import{c as s,Q as a,j as p,m as e}from"./chunks/framework.DOi4mjdC.js";const l="/assets/VF%E8%9E%8D%E5%90%88.CDnI78yA.png",t="/assets/VF%E8%9E%8D%E5%90%882.Ce2p0qKm.png",A=JSON.parse('{"title":"VF融合优化","description":"","frontmatter":{},"headers":[{"level":1,"title":"VF融合优化","slug":"vf融合优化"},{"level":2,"title":"VF融合原理介绍","slug":"vf融合原理介绍"},{"level":2,"title":"VF融合编写指导","slug":"vf融合编写指导"}],"relativePath":"guide/算子实践参考/SIMD算子性能优化/矢量计算/VF性能优化/VF融合优化.md","filePath":"guide/算子实践参考/SIMD算子性能优化/矢量计算/VF性能优化/VF融合优化.md"}'),i={name:"guide/算子实践参考/SIMD算子性能优化/矢量计算/VF性能优化/VF融合优化.md"};function c(o,n,d,r,u,_){return a(),p("div",null,[...n[0]||(n[0]=[e('<h1 id="vf融合优化" tabindex="-1">VF融合优化 <a class="header-anchor" href="#vf融合优化" aria-label="Permalink to &quot;VF融合优化&quot;">​</a></h1><p>【优先级】高</p><p>【描述】VF融合是将代码中多个VF函数融合成一个VF函数，有效提升性能。VF融合特性是优化特性，VF自动融合会借助Loop Fuse算法，将VF转换成Loop形态，然后将控制流等价（Control-Flow-Equivalent）的VF进行融合，最后将VF进行还原。编译器首先会做融合前的合法性检查，判断两个VF是否等价，Main侧中间代码是否能在VF内执行以及融合后是否可产生正收益（不会引起传参寄存器溢出、VF代码不会过大）等，如果满足VF融合条件，编译器会自动执行VF融合优化，为保证融合后的VF执行逻辑与语义与融合前一致，会在原来两个VF之间保守地插入同步指令，编译器还会尝试外提、合并融合后的VF中的指令，对VF代码进行优化。融合策略是能融尽融，用户按照符合融合的合法性检查的模式进行编码，可以增加VF融合的机会。</p><h2 id="vf融合原理介绍" tabindex="-1">VF融合原理介绍 <a class="header-anchor" href="#vf融合原理介绍" aria-label="Permalink to &quot;VF融合原理介绍&quot;">​</a></h2><p>VF融合优化可分为三个阶段：VF浅度融合、VF深度融合和VF内自动同步：</p><p><strong>VF浅度融合</strong>：编译器首先会分析两个VF的控制流是否等价，构建Cost Model分析是否有正向收益，如果满足VF融合条件，将VF外部的控制流融入到VF内，将VF外的Software Loop硬化成VF内的Hardware Loop，然后使能VF自动融合的基础能力，将两个VF融合成一个VF，为后续的VF深度融合提供基础。</p><p><img src="'+l+'" alt=""></p><p><strong>VF深度融合</strong>：VF深度融合会继续对VF内的Hardware Loop进行融合，从而减少Hardware Loop的启动开销，并且极大地减少冗余的Load/Store操作，充分复用寄存器。</p><p><img src="'+t+`" alt=""></p><p><strong>VF内自动同步</strong>：编译器会精准地插入必要的同步指令，删除冗余的同步指令，极大地释放了硬件OOO（Out of Order）能力。用户无需手动插入同步指令，极大地降低了用户的编码难度。</p><h2 id="vf融合编写指导" tabindex="-1">VF融合编写指导 <a class="header-anchor" href="#vf融合编写指导" aria-label="Permalink to &quot;VF融合编写指导&quot;">​</a></h2><ol><li><p>多个VF函数自动融合：如果多个VF函数的控制流等价，且满足均为<a href="./VF循环优化.html#section11326136133217">Hardware Loop循环</a>，编译器会执行VF融合优化特性。</p><p>【正例】VF函数DivVF和AddVF会被编译器融合成一个VF函数，并且能优化多余的Load/Store指令。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>template&lt;typename T&gt;</span></span>
<span class="line"><span>__simd_vf__ inline void DivVF(__ubuf__ T* dstAddr, __ubuf__ T* srcAddr, uint32_t count, uint32_t repeatTime, uint32_t oneRepNum){</span></span>
<span class="line"><span>    AscendC::Reg::MaskReg mask;</span></span>
<span class="line"><span>    AscendC::Reg::RegTensor&lt;T&gt; reg0, reg1, reg2;</span></span>
<span class="line"><span>    constexpr float num = 1.0f;</span></span>
<span class="line"><span>    for(uint16_t j = 0; j &lt; repeatTime; ++j){</span></span>
<span class="line"><span>        mask = AscendC::Reg::UpdateMask&lt;T&gt;(count);</span></span>
<span class="line"><span>        AscendC::Reg::LoadAlign(reg0, srcAddr + j * oneRepNum);</span></span>
<span class="line"><span>        AscendC::Reg::Duplicate(reg1, num, mask);</span></span>
<span class="line"><span>        AscendC::Reg::Div(reg2, reg1, reg0, mask);</span></span>
<span class="line"><span>        AscendC::Reg::StoreAlign(dstAddr + j * oneRepNum, reg2, mask);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>template&lt;typename T&gt;</span></span>
<span class="line"><span>__simd_vf__ inline void AddVF(__ubuf__ T* dstAddr, __ubuf__ T* srcAddr, uint32_t count, uint32_t repeatTime, uint32_t oneRepNum){</span></span>
<span class="line"><span>    AscendC::Reg::MaskReg mask;</span></span>
<span class="line"><span>    AscendC::Reg::RegTensor&lt;T&gt; srcReg;</span></span>
<span class="line"><span>    AscendC::Reg::RegTensor&lt;T&gt; dstReg;</span></span>
<span class="line"><span>    constexpr float num = 1.0f;</span></span>
<span class="line"><span>    for(uint16_t j = 0; j &lt; repeatTime; ++j){</span></span>
<span class="line"><span>        mask = AscendC::Reg::UpdateMask&lt;T&gt;(count);</span></span>
<span class="line"><span>        AscendC::Reg::LoadAlign(srcReg, srcAddr + j * oneRepNum);</span></span>
<span class="line"><span>        AscendC::Reg::Adds(dstReg, srcReg, num, mask);</span></span>
<span class="line"><span>        AscendC::Reg::StoreAlign(dstAddr + j * oneRepNum, dstReg, mask);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>template&lt;typename T&gt;</span></span>
<span class="line"><span>class Kernel {</span></span>
<span class="line"><span>    public:</span></span>
<span class="line"><span>    __aicore__ inline Kernel() = default;</span></span>
<span class="line"><span>    __aicore__ inline void Init(GM_ADDR x, GM_ADDR y, uint32_t count, AscendC::TPipe* pipeIn){</span></span>
<span class="line"><span>        // ... </span></span>
<span class="line"><span> </span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void CopyIn(){</span></span>
<span class="line"><span>        // ... </span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void Compute(){</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;T&gt; xLocal = inQueueX.DeQue&lt;T&gt;();</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;T&gt; yLocal = outQueueY.AllocTensor&lt;T&gt;();</span></span>
<span class="line"><span>        AscendC::DataCopy(yLocal, xLocal, count);</span></span>
<span class="line"><span>        __ubuf__ T* srcAddr = reinterpret_cast&lt;__ubuf__ T*&gt;(xLocal.GetPhyAddr());</span></span>
<span class="line"><span>        __ubuf__ T* dstAddr = reinterpret_cast&lt;__ubuf__ T*&gt;(yLocal.GetPhyAddr());</span></span>
<span class="line"><span>        constexpr uint32_t oneRepNum = 256 / sizeof(T);</span></span>
<span class="line"><span>        uint32_t repeatTime =  count / oneRepNum;</span></span>
<span class="line"><span>        DivVF(dstAddr, srcAddr, count, repeatTime, oneRepNum);</span></span>
<span class="line"><span>        AddVF(dstAddr, dstAddr, count, repeatTime, oneRepNum);</span></span>
<span class="line"><span>        outQueueY.EnQue&lt;T&gt;(yLocal);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void CopyOut(){</span></span>
<span class="line"><span>        // ... </span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void Process(){</span></span>
<span class="line"><span>        CopyIn();</span></span>
<span class="line"><span>        Compute();</span></span>
<span class="line"><span>        CopyOut();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    private:</span></span>
<span class="line"><span>    AscendC::TPipe* pipe = nullptr;</span></span>
<span class="line"><span>    uint32_t count;</span></span>
<span class="line"><span>    AscendC::GlobalTensor&lt;T&gt; xGm;</span></span>
<span class="line"><span>    AscendC::GlobalTensor&lt;T&gt; yGm;</span></span>
<span class="line"><span>    AscendC::TQue&lt;AscendC::TPosition::VECIN, 1&gt; inQueueX;</span></span>
<span class="line"><span>    AscendC::TQue&lt;AscendC::TPosition::VECOUT, 1&gt; outQueueY;</span></span>
<span class="line"><span>};</span></span></code></pre></div></li><li><p>使用基础API连续计算模式：基础API实现对硬件能力的抽象，开放芯片的能力，保证完备性和兼容性。基础API根据对数据操作方法的不同，可以分为两大类：</p><ul><li>连续计算API：支持Tensor前n个数据计算。针对源操作数的连续n个数据进行计算并连续写入目的操作数，解决一维tensor的连续计算问题。</li><li>高维切分API：支持Repeat和Stride。功能灵活的计算API，提供与Builtin API完全对等的编程能力，充分发挥硬件优势，支持对每个操作数的DataBlock Stride，Repeat Stride，Mask等参数的操作。</li></ul><p>在VF融合优化中，推荐使用基础API的连续计算模式编写算子，可以充分发挥出VF融合优化的能力，与高维切分API相比，连续计算API使得编译器能更好地分析VF融合优化，更加容易满足VF融合优化的条件，使用基础API的连续计算模式能写出性能更优的算子。</p><p>【反例】使用基础API的高维切分模式编写算子，编译器在分析VF融合时受复杂的计算逻辑影响，无法对Add和Mul接口进行VF融合优化。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>template&lt;typename T&gt;</span></span>
<span class="line"><span>class Kernel {</span></span>
<span class="line"><span>    public:</span></span>
<span class="line"><span>    // ...</span></span>
<span class="line"><span>    __aicore__ inline void Compute(){</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;T&gt; xLocal = inQueueX.DeQue&lt;T&gt;();</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;T&gt; yLocal = outQueueY.AllocTensor&lt;T&gt;();</span></span>
<span class="line"><span>        AscendC::DataCopy(yLocal, xLocal, inner * outter);</span></span>
<span class="line"><span>        uint64_t mask = 128;</span></span>
<span class="line"><span>        AscendC::Add(yLocal, xLocal, xLocal, mask, 4, { 1, 1, 1, 8, 8, 8 });</span></span>
<span class="line"><span>        AscendC::Mul(yLocal, yLocal, xLocal, mask, 4, { 1, 1, 1, 8, 8, 8 });</span></span>
<span class="line"><span>        outQueueY.EnQue&lt;T&gt;(yLocal);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    // ...</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>【正例】使用基础API的连续计算模式，编译器分析Add和Mul函数后符合VF融合要求，将Add和Mul融合成一个VF函数。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>template&lt;typename T&gt;</span></span>
<span class="line"><span>class Kernel {</span></span>
<span class="line"><span>    public:</span></span>
<span class="line"><span>    // ...</span></span>
<span class="line"><span>    __aicore__ inline void Compute(){</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;T&gt; xLocal = inQueueX.DeQue&lt;T&gt;();</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;T&gt; yLocal = outQueueY.AllocTensor&lt;T&gt;();</span></span>
<span class="line"><span>        AscendC::DataCopy(yLocal, xLocal, inner * outter);</span></span>
<span class="line"><span>        AscendC::Add(yLocal, xLocal, xLocal, count);</span></span>
<span class="line"><span>        AscendC::Mul(yLocal, yLocal, xLocal, count);</span></span>
<span class="line"><span>        outQueueY.EnQue&lt;T&gt;(yLocal);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    // ...</span></span>
<span class="line"><span>};</span></span></code></pre></div></li></ol>`,12)])])}const V=s(i,[["render",c]]);export{A as __pageData,V as default};
