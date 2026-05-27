import{c as a,Q as n,j as p,m as e}from"./chunks/framework.DOi4mjdC.js";const t="/assets/%E6%89%A7%E8%A1%8C%E9%98%9F%E5%88%97%E5%92%8C%E6%8C%87%E4%BB%A4%E7%9A%84%E6%89%A7%E8%A1%8C%E9%A1%BA%E5%BA%8F.Bf9rJLmE.png",m=JSON.parse('{"title":"指令双发优化","description":"","frontmatter":{},"headers":[{"level":1,"title":"指令双发优化","slug":"指令双发优化"},{"level":2,"title":"合理拆分VF循环","slug":"合理拆分vf循环"},{"level":2,"title":"手动控制循环拆分","slug":"手动控制循环拆分"},{"level":2,"title":"避免寄存器数量超限，导致执行队列中依赖指令的数量增加","slug":"避免寄存器数量超限导致执行队列中依赖指令的数量增加"}],"relativePath":"guide/算子实践参考/SIMD算子性能优化/矢量计算/VF性能优化/指令双发优化.md","filePath":"guide/算子实践参考/SIMD算子性能优化/矢量计算/VF性能优化/指令双发优化.md"}'),l={name:"guide/算子实践参考/SIMD算子性能优化/矢量计算/VF性能优化/指令双发优化.md"};function i(g,s,c,d,R,r){return n(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="指令双发优化" tabindex="-1">指令双发优化 <a class="header-anchor" href="#指令双发优化" aria-label="Permalink to &quot;指令双发优化&quot;">​</a></h1><p>指令双发指的是处理器在同一个时钟周期内，能够同时发射两条指令到执行单元进行处理。这种能力需要满足以下两个条件：</p><ul><li>两条指令之间没有数据上的依赖关系（依赖关系指后一条指令需要使用前一条指令产生的结果）</li><li>硬件中拥有足够的执行资源</li></ul><p>这种机制可以在不改变程序逻辑的前提下，提升处理器在单位时间内的指令处理效率，是实现指令级并行的重要基础之一。</p><p>如下示例中，VLoop-1循环16次，由于每个循环内的4条指令有数据依赖，所以执行队列的深度是64。64条指令并发执行顺序如下图所示，LoadAlign_0和LoadAlign_1没有依赖关系，可以并发执行。黑框选中的位置仅代表该4条指令有同时执行的资格，真正执行时是乱序选取其中的2条执行。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>for (uint16_t i = 0; i &lt; 16; ++i) { // VLoop-1</span></span>
<span class="line"><span>    // 循环16次， 每次4条指令</span></span>
<span class="line"><span>    // 数据依赖性：Adds依赖LoadAlign，Mul依赖Adds ...</span></span>
<span class="line"><span>    mask = AscendC::Reg::UpdateMask&lt;T&gt;(count);</span></span>
<span class="line"><span>    int16_t scalar = 2;</span></span>
<span class="line"><span>    AscendC::Reg::LoadAlign(srcReg, src0Addr + i * oneRepeatSize);</span></span>
<span class="line"><span>    AscendC::Reg::Adds(dstReg1, srcReg, scalar , mask);</span></span>
<span class="line"><span>    AscendC::Reg::Mul(dstReg2, dstReg1, srcReg, mask);</span></span>
<span class="line"><span>    AscendC::Reg::StoreAlign(dstAddr + i * oneRepeatSize, dstReg2, mask);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>图 1</strong> 执行队列和指令的执行顺序<br><img src="`+t+`" alt="" title="执行队列和指令的执行顺序"></p><p>在编写算子时，开发者通常习惯于按“加载数据 → 处理计算 → 存储结果”的顺序来组织代码流程。这种写法在寄存器资源充足时运行良好，但一旦资源紧张，问题就会被放大。当多个计算指令之间会产生依赖关系，这些等待会堆积在执行队列中，导致后续指令无法及时发射。</p><p>开发者在编程时应<strong>尽可能保证队列里存在数目充足且无依赖的并发指令</strong>，从而高效的利用硬件双发特性。可以通过合理拆分VF循环以及手动控制循环展开等方案来提高性能。</p><h2 id="合理拆分vf循环" tabindex="-1">合理拆分VF循环 <a class="header-anchor" href="#合理拆分vf循环" aria-label="Permalink to &quot;合理拆分VF循环&quot;">​</a></h2><p>VF并不是写的越长，把所有运算都放在一个for循环内就好，需要适当的搬出中间结果到UB，减少数据依赖。</p><p>优化前：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>for (uint16_t i = 0; i &lt; 32; ++i) { // VLoop-1</span></span>
<span class="line"><span>    // 数据依赖性：每一条Adds的输入都依赖上一条Adds的结果</span></span>
<span class="line"><span>    mask = AscendC::Reg::UpdateMask&lt;T&gt;(count);</span></span>
<span class="line"><span>    AscendC::Reg::LoadAlign(srcReg0, src0Addr + i * oneRepeatSize);</span></span>
<span class="line"><span>    AscendC::Reg::LoadAlign(srcReg1, src1Addr + i * oneRepeatSize);</span></span>
<span class="line"><span>    AscendC::Reg::Add(dstReg, srcReg0, srcReg1, mask);</span></span>
<span class="line"><span>    AscendC::Reg::Adds(dstReg, dstReg, 10, mask);</span></span>
<span class="line"><span>    AscendC::Reg::Adds(dstReg, dstReg, 10, mask);</span></span>
<span class="line"><span>    AscendC::Reg::Adds(dstReg, dstReg, 10, mask);</span></span>
<span class="line"><span>    AscendC::Reg::Adds(dstReg, dstReg, 10, mask);</span></span>
<span class="line"><span>    AscendC::Reg::Adds(dstReg, dstReg, 10, mask);</span></span>
<span class="line"><span>    AscendC::Reg::Adds(dstReg, dstReg, 10, mask);</span></span>
<span class="line"><span>    AscendC::Reg::StoreAlign(dstAddr + i * oneRepeatSize, dstReg, mask);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>优化后：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>for (uint16_t i = 0; i &lt; 32; ++i) { // VLoop-1</span></span>
<span class="line"><span>    mask = AscendC::Reg::UpdateMask&lt;T&gt;(count);</span></span>
<span class="line"><span>    AscendC::Reg::LoadAlign(srcReg0, src0Addr + i * oneRepeatSize);</span></span>
<span class="line"><span>    AscendC::Reg::LoadAlign(srcReg1, src1Addr + i * oneRepeatSize);</span></span>
<span class="line"><span>    AscendC::Reg::Add(dstReg, srcReg0, srcReg1, mask);</span></span>
<span class="line"><span>    AscendC::Reg::Adds(dstReg, dstReg1, 10, mask);</span></span>
<span class="line"><span>    AscendC::Reg::Adds(dstReg, dstReg1, 10, mask);</span></span>
<span class="line"><span>    AscendC::Reg::Adds(dstReg, dstReg1, 10, mask);</span></span>
<span class="line"><span>    AscendC::Reg::StoreAlign(dstAddr + i * oneRepeatSize, dstReg, mask);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>for (uint16_t i = 0; i &lt; 32; ++i) { // VLoop-2</span></span>
<span class="line"><span>    mask = AscendC::Reg::UpdateMask&lt;T&gt;(count);</span></span>
<span class="line"><span>    AscendC::Reg::LoadAlign(dstReg, dstAddr + i * oneRepeatSize);</span></span>
<span class="line"><span>    AscendC::Reg::Adds(dstReg, dstReg, 10, mask);</span></span>
<span class="line"><span>    AscendC::Reg::Adds(dstReg, dstReg, 10, mask);</span></span>
<span class="line"><span>    AscendC::Reg::Adds(dstReg, dstReg, 10, mask);</span></span>
<span class="line"><span>    AscendC::Reg::StoreAlign(dstAddr + i * oneRepeatSize, dstReg, mask);</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="手动控制循环拆分" tabindex="-1">手动控制循环拆分 <a class="header-anchor" href="#手动控制循环拆分" aria-label="Permalink to &quot;手动控制循环拆分&quot;">​</a></h2><p>如果循环内存在依赖关系过多的指令，队列没有办法同时加载进for(i = n)和for(i = n+1)的所有指令，那么即使循环之间没有依赖关系，也无法使能双发特性，指令无法并发执行。可以通过手动展开循环，这样做有两个好处：贴近硬件乱序执行的特性，为下发的指令创造更多执行的机会；减少指令因为寄存器资源未到位而产生的等待。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>for (uint16_t i = 0; i &lt; 32; ++i) { </span></span>
<span class="line"><span>// for循环间没有依赖关系：i=0,i=1可以并行执行，但是由于循环内数据依赖指令过多导致i=1的指令无法加载进执行队列中</span></span>
<span class="line"><span>    AscendC::Reg::LoadAlign(srcReg, srcAddr, offset);</span></span>
<span class="line"><span>    AscendC::Reg::Adds(dstReg0, srcReg, 10, mask);</span></span>
<span class="line"><span>    AscendC::Reg::Muls(dstReg1 dstReg0, 20, mask);</span></span>
<span class="line"><span>    ... // 超过64条有数据依赖的指令</span></span>
<span class="line"><span>    AscendC::Reg::StoreAlign(dstAddr, dstReg1, offset, mask);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>展开后</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>for (uint16_t i = 0; i &lt; 8; ++i) { // 32做4展开</span></span>
<span class="line"><span>    AscendC::Reg::LoadAlign(srcReg0, srcAddr, offset);</span></span>
<span class="line"><span>    AscendC::Reg::LoadAlign(srcReg1, srcAddr, offset);</span></span>
<span class="line"><span>    AscendC::Reg::LoadAlign(srcReg2, srcAddr, offset);</span></span>
<span class="line"><span>    AscendC::Reg::LoadAlign(srcReg3, srcAddr, offset);</span></span>
<span class="line"><span>    AscendC::Reg::Adds(...)</span></span>
<span class="line"><span>    AscendC::Reg::Adds(...)</span></span>
<span class="line"><span>    AscendC::Reg::Adds(...)</span></span>
<span class="line"><span>    AscendC::Reg::Adds(...)</span></span>
<span class="line"><span>    AscendC::Reg::Muls(...)</span></span>
<span class="line"><span>    AscendC::Reg::Muls(...)</span></span>
<span class="line"><span>    AscendC::Reg::Muls(...)</span></span>
<span class="line"><span>    AscendC::Reg::Muls(...)</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    AscendC::Reg::StoreAlign(...)</span></span>
<span class="line"><span>    AscendC::Reg::StoreAlign(...)</span></span>
<span class="line"><span>    AscendC::Reg::StoreAlign(...)</span></span>
<span class="line"><span>    AscendC::Reg::StoreAlign(...)</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="避免寄存器数量超限-导致执行队列中依赖指令的数量增加" tabindex="-1">避免寄存器数量超限，导致执行队列中依赖指令的数量增加 <a class="header-anchor" href="#避免寄存器数量超限-导致执行队列中依赖指令的数量增加" aria-label="Permalink to &quot;避免寄存器数量超限，导致执行队列中依赖指令的数量增加&quot;">​</a></h2><p>在同一个VF中，硬件可以同时处理的最大RegTensor寄存器个数为32，如果超出，编译器会进行数据的换入换出并加入同步指令，严重拖慢算子的执行效率。同理，在同一个VF中，MaskReg不超过8个，读/写UnalignRegForLoad和UnalignRegForStore各不超过4个，否则会发生寄存器溢出，导致性能劣化。</p><p>优化方案：</p><ul><li>使用布尔代数运算。比如!(a &amp;&amp; b) 可简化为 !a || !b，!(a || b) 可以化简为 !a &amp;&amp; !b。</li><li>适当等价调整指令顺序，节省寄存器。</li></ul><p>本示例用于判断两个double类型数据是否相等，需要处理两个特殊场景，是否为NAN或者+0和-0的场景。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>template&lt;typename T = Reg::DefaultType, CMPMODE mode = CMPMODE::EQ, typename RegT&gt;</span></span>
<span class="line"><span>__simd_caller__ inline void CompareDoubleImpl(Reg::MaskReg &amp;dstMask, RegT &amp;srcReg0, RegT &amp;srcReg1, Reg::MaskReg &amp;mask)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    using ActualT = typename RegT::ActualT;</span></span>
<span class="line"><span>    static_assert(SupportType&lt;ActualT, double, uint64_t&gt;(), &quot;CompareDoubleImpl only support double and uint64_t type&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Reg::RegTensor&lt;uint64_t, Reg::RegTraitNumTwo&gt; tmpSrcReg0 = (Reg::RegTensor&lt;uint64_t, Reg::RegTraitNumTwo&gt;&amp;)srcReg0;</span></span>
<span class="line"><span>    Reg::RegTensor&lt;uint64_t, Reg::RegTraitNumTwo&gt; tmpSrcReg1 = (Reg::RegTensor&lt;uint64_t, Reg::RegTraitNumTwo&gt;&amp;)srcReg1;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Reg::RegTensor&lt;uint64_t, Reg::RegTraitNumTwo&gt; exponent0;</span></span>
<span class="line"><span>    Reg::RegTensor&lt;uint64_t, Reg::RegTraitNumTwo&gt; exponent1;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Reg::ShiftRights(exponent0, tmpSrcReg0, static_cast&lt;int16_t&gt;(52), mask);</span></span>
<span class="line"><span>    Reg::ShiftRights(exponent1, tmpSrcReg1, static_cast&lt;int16_t&gt;(52), mask);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Reg::RegTensor&lt;uint64_t, Reg::RegTraitNumTwo&gt; scalarExponent;</span></span>
<span class="line"><span>    Reg::Duplicate(scalarExponent, static_cast&lt;uint64_t&gt;(0x7ff), mask);</span></span>
<span class="line"><span>    Reg::And(exponent0, exponent0, scalarExponent, mask);</span></span>
<span class="line"><span>    Reg::And(exponent1, exponent1, scalarExponent, mask);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Reg::RegTensor&lt;uint64_t, Reg::RegTraitNumTwo&gt; mantissa0, mantissa1;</span></span>
<span class="line"><span>    Reg::RegTensor&lt;uint64_t, Reg::RegTraitNumTwo&gt; scalarMantissa;</span></span>
<span class="line"><span>    Reg::Duplicate(scalarMantissa, static_cast&lt;uint64_t&gt;(0xfffffffffffff), mask);</span></span>
<span class="line"><span>    Reg::And(mantissa0, tmpSrcReg0, scalarMantissa, mask);</span></span>
<span class="line"><span>    Reg::And(mantissa1, tmpSrcReg1, scalarMantissa, mask);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Reg::MaskReg tmpMask0, tmpMask1;</span></span>
<span class="line"><span>    Reg::Compares(tmpMask0, exponent0, 0x7ff, mask);</span></span>
<span class="line"><span>    Reg::Compares(dstMask, exponent1, 0x7ff, mask);</span></span>
<span class="line"><span>    Reg::MaskAnd(dstMask, tmpMask0, dstMask, mask);</span></span>
<span class="line"><span>    // dstMask表示两个double数的尾数不同时为0,需要先判断两个数的尾数部分是否不为0，全为0时为0，再进行或运算，tmpMask为1表示两个数不同时为0</span></span>
<span class="line"><span>    Reg::MaskReg tmpMask1;</span></span>
<span class="line"><span>    Reg::Compares&lt;uint64_t, CMPMODE::NE&gt;(tmpMask1, mantissa0, 0, mask);</span></span>
<span class="line"><span>    Reg::Compares&lt;uint64_t, CMPMODE::NE&gt;(tmpMask0, mantissa1, 0, mask);</span></span>
<span class="line"><span>    Reg::MaskOr(tmpMask0, tmpMask1, tmpMask0, mask);</span></span>
<span class="line"><span>    //【反例】判断指数全为1，尾数不同时为0（结果为NAN）的特殊情况，用到的公式为!(a&amp;&amp;b) ，需要多申请一个MaskReg即noNaNMask来记录a&amp;&amp;b中间结果</span></span>
<span class="line"><span>    Reg::MaskReg noNaNMask;</span></span>
<span class="line"><span>    Reg::MaskAnd(noNaNMask, dstMask, tmpMask0, mask);</span></span>
<span class="line"><span>    Reg::MaskNot(noNaNMask, noNaNMask, mask);</span></span>
<span class="line"><span>    // 判断+0和-0的特殊情况</span></span>
<span class="line"><span>    Reg::RegTensor&lt;uint64_t, Reg::RegTraitNumTwo&gt; unsignedPart0, unsignedPart1;</span></span>
<span class="line"><span>    Reg::RegTensor&lt;uint64_t, Reg::RegTraitNumTwo&gt; scalarUnsignedPart;</span></span>
<span class="line"><span>    Reg::Duplicate(scalarUnsignedPart, static_cast&lt;uint64_t&gt;(0x7fffffffffffff), mask);</span></span>
<span class="line"><span>    Reg::And(unsignedPart0, tmpSrcReg0, scalarUnsignedPart, mask);</span></span>
<span class="line"><span>    Reg::And(unsignedPart1, tmpSrcReg1, scalarUnsignedPart, mask);</span></span>
<span class="line"><span>    //【反例】先分别判断两个无符号数是否为0，接着对结果进行与运算，可以通过将判断unsignedPart1是否为0 的mask换成tmpMask，可以节省一条MaskAnd指令</span></span>
<span class="line"><span>    Reg::Compares&lt;uint64_t, CMPMODE::EQ&gt;(tmpMask0, unsignedPart0, 0, mask);</span></span>
<span class="line"><span>    Reg::Compares&lt;uint64_t, CMPMODE::EQ&gt;(dstMask, unsignedPart1, 0, mask);</span></span>
<span class="line"><span>    Reg::MaskAnd(tmpMask0, tmpMask0, dstMask, mask);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Reg::Compare(dstMask, tmpSrcReg0, tmpSrcReg1, mask);</span></span>
<span class="line"><span>    Reg::MaskAnd(dstMask, dstMask, noNaNMask, mask);</span></span>
<span class="line"><span>    Reg::MaskOr(dstMask, dstMask, tmpMask0, mask);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>优化后：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>template &lt;typename T = Reg::DefaultType, CMPMODE mode = CMPMODE::EQ, typename RegT&gt;</span></span>
<span class="line"><span>_simd_caller inline void CompareDoubleImpl(Reg::MaskReg &amp;dstMask, Reg &amp;srcReg0, Reg &amp;srcReg1, Reg::MaskReg &amp;mask)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    using ActualT = typename RegT::ActualT;</span></span>
<span class="line"><span>    static_assert(SupportType&lt;ActualT, double, uint64_t&gt;(), &quot;CompareDoubleImpl only support double and uint64_t type&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Reg::RegTensor&lt;uint64_t, Reg::RegTraitNumTwo&gt; tmpSrcReg0 = (Reg::RegTensor&lt;uint64_t, Reg::RegTraitNumTwo&gt;&amp;)srcReg0;</span></span>
<span class="line"><span>    Reg::RegTensor&lt;uint64_t, Reg::RegTraitNumTwo&gt; tmpSrcReg1 = (Reg::RegTensor&lt;uint64_t, Reg::RegTraitNumTwo&gt;&amp;)srcReg1;</span></span>
<span class="line"><span>    Reg::RegTensor&lt;uint64_t, Reg::RegTraitNumTwo&gt; exponent0;</span></span>
<span class="line"><span>    Reg::RegTensor&lt;uint64_t, Reg::RegTraitNumTwo&gt; exponent1;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Reg::ShiftRights(exponent0, tmpSrcReg0, static_cast&lt;int16_t&gt;(52), mask);</span></span>
<span class="line"><span>    Reg::ShiftRights(exponent1, tmpSrcReg1, static_cast&lt;int16_t&gt;(52), mask);</span></span>
<span class="line"><span>    Reg::RegTensor&lt;uint64_t, Reg::RegTraitNumTwo&gt; scalarExponent;</span></span>
<span class="line"><span>    Reg::Duplicate(scalarExponent, static_cast&lt;uint64_t&gt;(0x7ff), mask);</span></span>
<span class="line"><span>    Reg::And(exponent0, exponent0, scalarExponent, mask);</span></span>
<span class="line"><span>    Reg::And(exponent1, exponent1, scalarExponent, mask);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Reg::RegTensor&lt;uint64_t, Reg::RegTraitNumTwo&gt; mantissa0, mantissa1;</span></span>
<span class="line"><span>    Reg::RegTensor&lt;uint64_t, Reg::RegTraitNumTwo&gt; scalarMantissa;</span></span>
<span class="line"><span>    Reg::Duplicate(scalarMantissa, static_cast&lt;uint64_t&gt;(0xfffffffffffff), mask);</span></span>
<span class="line"><span>    Reg::And(mantissa0, tmpSrcReg0, scalarMantissa, mask);</span></span>
<span class="line"><span>    Reg::And(mantissa1, tmpSrcReg1, scalarMantissa, mask);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Reg::MaskReg tmpMask0, tmpMask1;</span></span>
<span class="line"><span>    Reg::Compares(tmpMask0, exponent0, 0x7ff, mask);</span></span>
<span class="line"><span>    Reg::Compares(dstMask, exponent1, 0x7ff, tmpMask0);</span></span>
<span class="line"><span>    Reg::MaskNot(dstMask, dstMask, mask);</span></span>
<span class="line"><span>    Reg::Compares&lt;uint64_t, CMPMODE::EQ&gt;(tmpMask1, mantissa0, 0, mask);</span></span>
<span class="line"><span>    Reg::Compares&lt;uint64_t, CMPMODE::EQ&gt;(tmpMask0, mantissa1, 0, tmpMask1);</span></span>
<span class="line"><span>    //【正例】!(a&amp;&amp;b)化简为 !a||!b，表示指数不全为1或者tmpMask0均为0时候，可以正常进行判断，不需要多申请寄存器</span></span>
<span class="line"><span>    Reg::MaskOr(tmpMask0, tmpMask0, dstMask, mask);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Reg::Compare(dstMask, tmpSrcReg0, tmpSrcReg1, mask);</span></span>
<span class="line"><span>    Reg::MaskAnd(dstMask, dstMask, tmpMask0, mask);</span></span>
<span class="line"><span>    // +0 -0</span></span>
<span class="line"><span>    Reg::RegTensor&lt;uint64_t, Reg::RegTraitNumTwo&gt; unsignedPart0, unsignedPart1;</span></span>
<span class="line"><span>    Reg::RegTensor&lt;uint64_t, Reg::RegTraitNumTwo&gt; scalarUnsignedPart;</span></span>
<span class="line"><span>    Reg::Duplicate(scalarUnsignedPart, static_cast&lt;uint64_t&gt;(0x7fffffffffffff), mask);</span></span>
<span class="line"><span>    Reg::And(unsignedPart0, tmpSrcReg0, scalarUnsignedPart, mask);</span></span>
<span class="line"><span>    Reg::And(unsignedPart1, tmpSrcReg1, scalarUnsignedPart, mask);</span></span>
<span class="line"><span>    //【正例】这里将unsignedPart1判断后的mask替换为tmpMask0，相当于unsignedPart0，unsignedPart1分别判断完后再进行与运算,相较于反例省略了一条MaskAnd指令。</span></span>
<span class="line"><span>    Reg::Compares&lt;uint64_t, CMPMODE::EQ&gt;(tmpMask0, unsignedPart0, 0, mask);</span></span>
<span class="line"><span>    Reg::Compares&lt;uint64_t, CMPMODE::EQ&gt;(tmpMask1, unsignedPart1, 0, tmpMask0);</span></span>
<span class="line"><span>    Reg::MaskOr(dstMask, dstMask, tmpMask0, mask);</span></span>
<span class="line"><span>}</span></span></code></pre></div>`,28)])])}const k=a(l,[["render",i]]);export{m as __pageData,k as default};
