import{c as n,Q as a,j as t,m as e}from"./chunks/framework.DOi4mjdC.js";const p="/assets/%E4%BA%8C%E5%88%86%E7%B4%AF%E5%8A%A0%E6%96%B9%E6%A1%88%E7%A4%BA%E6%84%8F%E5%9B%BE.CSeEM4kV.png",_=JSON.parse('{"title":"选择低延迟指令，优化归约操作性能","description":"","frontmatter":{},"headers":[{"level":1,"title":"选择低延迟指令，优化归约操作性能","slug":"选择低延迟指令优化归约操作性能"},{"level":2,"title":"二分累加方案和归约类指令方案的对比","slug":"二分累加方案和归约类指令方案的对比"},{"level":2,"title":"BlockReduceSum和WholeReduceSum归约方案对比","slug":"blockreducesum和wholereducesum归约方案对比"}],"relativePath":"guide/算子实践参考/SIMD算子性能优化/矢量计算/选择低延迟指令-优化归约操作性能.md","filePath":"guide/算子实践参考/SIMD算子性能优化/矢量计算/选择低延迟指令-优化归约操作性能.md"}'),l={name:"guide/算子实践参考/SIMD算子性能优化/矢量计算/选择低延迟指令-优化归约操作性能.md"};function c(o,s,i,u,d,r){return a(),t("div",null,[...s[0]||(s[0]=[e('<h1 id="选择低延迟指令-优化归约操作性能" tabindex="-1">选择低延迟指令，优化归约操作性能 <a class="header-anchor" href="#选择低延迟指令-优化归约操作性能" aria-label="Permalink to &quot;选择低延迟指令，优化归约操作性能&quot;">​</a></h1><p>【优先级】高</p><p>【描述】</p><p>指令执行延迟（Instruction Execution Latency） 指的是一条指令从开始执行到完全完成（即所有操作结束，结果可用）所消耗的时间，它直接影响程序的响应速度和实时性。在延迟敏感的场景中，降低指令执行延迟是提升性能的关键。下文以归约操作为例，介绍了几种归约方案的性能对比，便于开发者在使用归约指令时，能够根据具体的数据规模和场景，选择性能更高的方案。</p><h2 id="二分累加方案和归约类指令方案的对比" tabindex="-1">二分累加方案和归约类指令方案的对比 <a class="header-anchor" href="#二分累加方案和归约类指令方案的对比" aria-label="Permalink to &quot;二分累加方案和归约类指令方案的对比&quot;">​</a></h2><p>根据单指令性能测试数据（开发者可以自行测试）分析，WholeReduceSum等归约指令的延迟时间约为Add指令的2-5倍。因此，对于连续数据的归约操作，可以采用Add指令和WholeReduceSum指令的组合，以优化整体性能。该方案简称为<strong>二分累加方案</strong>，具体方案说明如下：</p><ul><li>二分累加：将数据一分为二，使用Add指令将两部分数据相加；将相加后的结果再次一分为二，继续使用Add指令进行累加，重复此过程。</li><li>当二分累加后的数据量小于等于256Byte（一条指令一个Repeat的数据操作量），使用WholeReduceSum指令，一次执行得到归约结果。</li></ul><p>假设输入数据的数据类型为float，shape为(5, 256)，下图展示了一行数据的执行过程：</p><p><strong>图 1</strong> 二分累加方案示意图<br><img src="'+p+`" alt="" title="二分累加方案示意图"></p><p>将以上过程，针对每一行，各自执行，得到最终归约结果，即shape为(m, k)的数据，归约完成后，shape为(m, 1)。</p><p>由于ReduceSum接口是由多种指令组合实现，通常来说，数据量较大，循环次数较多的场景，二分累加方案性能 &gt; WholeReduceSum单指令操作性能 &gt; ReduceSum接口性能。而小数据量或者特殊shape下的场景，需要拆分开来，依据指令执行时间和指令执行数目等条件，具体问题具体分析。</p><p>下文给出了二分累加方案和归约类指令方案的核心代码片段和性能数据对比。完整样例请参考<a href="https://gitcode.com/cann/asc-devkit/blob/master/examples/01_simd_cpp_api/03_libraries/04_reduce/reduce" target="_blank" rel="noreferrer">ReduceCustom</a>。</p><p>【性能数据】</p><p>输入shape为30000，数据类型为float时，如下示例的性能数据对比如下，数据单位为cycle，使用GetSystemCycle接口获取。</p><p>&lt;table&gt;&lt;thead align=&quot;left&quot;&gt;&lt;tr&gt;&lt;th class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;50%&quot;&gt;&lt;p&gt;二分累加方案&lt;/p&gt; &lt;/th&gt; &lt;th class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;50%&quot;&gt;&lt;p&gt;WholeReduceSum单指令操作&lt;/p&gt; &lt;/th&gt; &lt;/tr&gt; &lt;/thead&gt; &lt;tbody&gt;&lt;tr&gt;&lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;50%&quot;&gt;&lt;p&gt;172&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;50%&quot;&gt;&lt;p&gt;242&lt;/p&gt; &lt;/td&gt; &lt;/tr&gt; &lt;/tbody&gt; &lt;/table&gt;</p><p>【二分累加方案】</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>__aicore__ inline void BinaryReduceSumImpl(const AscendC::LocalTensor&lt;float&gt;&amp; dst, const AscendC::LocalTensor&lt;float&gt;&amp; src, const uint32_t bsLength, const uint32_t hLength)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    // src为二维数据，shape为(bsLength, hLength)，dst的shape为(bsLength,1)</span></span>
<span class="line"><span>    AscendC::BinaryRepeatParams binaryParams;</span></span>
<span class="line"><span>    AscendC::UnaryRepeatParams unaryParams;</span></span>
<span class="line"><span>    AscendC::SetMaskCount();</span></span>
<span class="line"><span>    for (uint32_t i = 0; i &lt; bsLength; i++) {</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;float&gt; srcTmp = src[i * hLength];</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;float&gt; dstTmp = dst[i * hLength];</span></span>
<span class="line"><span>        uint32_t totalNum = hLength / 16 * 16;</span></span>
<span class="line"><span>        uint32_t remaining = hLength - totalNum;</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;float&gt; remainingTensor = srcTmp[totalNum];</span></span>
<span class="line"><span>        while (totalNum &gt; ONE_REPEAT_FLOAT_SIZE) {</span></span>
<span class="line"><span>            uint32_t halfNum = AscendC::DivCeil(totalNum, 16) * DEFAULT_REP_STRIDE;</span></span>
<span class="line"><span>            AscendC::SetVectorMask&lt;uint8_t, AscendC::MaskMode::COUNTER&gt;(0, totalNum - halfNum);</span></span>
<span class="line"><span>            AscendC::Add&lt;float, false&gt;(dstTmp, srcTmp, srcTmp[halfNum], AscendC::MASK_PLACEHOLDER, 1, binaryParams);</span></span>
<span class="line"><span>            totalNum = halfNum;</span></span>
<span class="line"><span>            srcTmp = dstTmp;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if (remaining != 0 &amp;&amp; hLength &gt; ONE_REPEAT_FLOAT_SIZE) {</span></span>
<span class="line"><span>            AscendC::SetVectorMask&lt;uint8_t, AscendC::MaskMode::COUNTER&gt;(0, remaining);</span></span>
<span class="line"><span>            AscendC::Add&lt;float, false&gt;(dstTmp, dstTmp, remainingTensor, AscendC::MASK_PLACEHOLDER, 1, binaryParams);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        AscendC::SetVectorMask&lt;uint8_t, AscendC::MaskMode::COUNTER&gt;(0, totalNum);</span></span>
<span class="line"><span>        AscendC::WholeReduceSum&lt;float, false&gt;(dstTmp, srcTmp, AscendC::MASK_PLACEHOLDER, 1, DEFAULT_BLK_STRIDE,</span></span>
<span class="line"><span>            DEFAULT_BLK_STRIDE, DEFAULT_REP_STRIDE);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    AscendC::ResetMask();</span></span>
<span class="line"><span>    AscendC::SetMaskNorm();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>【WholeReduceSum单指令操作】</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>__aicore__ inline void WholeReduceSumImpl(const AscendC::LocalTensor&lt;float&gt;&amp; dst, const AscendC::LocalTensor&lt;float&gt;&amp; src, const uint32_t bsLength, const uint32_t hLength)</span></span>
<span class="line"><span>{ </span></span>
<span class="line"><span>    // src为二维数据，shape为(bsLength, hLength)，dst的shape为(bsLength,1)</span></span>
<span class="line"><span>    AscendC::SetMaskCount();</span></span>
<span class="line"><span>    for (uint32_t i = 0; i &lt; bsLength; i++) {</span></span>
<span class="line"><span>        uint32_t totalNum = hLength;</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;float&gt; srcTmp = src[i * hLength];</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;float&gt; dstTmp = dst[i * hLength];</span></span>
<span class="line"><span>        while (totalNum &gt; 1) {</span></span>
<span class="line"><span>            AscendC::SetVectorMask&lt;uint8_t, AscendC::MaskMode::COUNTER&gt;(0, totalNum);</span></span>
<span class="line"><span>            AscendC::WholeReduceSum&lt;float, false&gt;(dstTmp, srcTmp, AscendC::MASK_PLACEHOLDER, 1, DEFAULT_BLK_STRIDE,</span></span>
<span class="line"><span>                DEFAULT_BLK_STRIDE, DEFAULT_REP_STRIDE);</span></span>
<span class="line"><span>            totalNum = AscendC::DivCeil(totalNum, ONE_REPEAT_FLOAT_SIZE);</span></span>
<span class="line"><span>            srcTmp = dstTmp;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    AscendC::ResetMask();</span></span>
<span class="line"><span>    AscendC::SetMaskNorm();</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="blockreducesum和wholereducesum归约方案对比" tabindex="-1">BlockReduceSum和WholeReduceSum归约方案对比 <a class="header-anchor" href="#blockreducesum和wholereducesum归约方案对比" aria-label="Permalink to &quot;BlockReduceSum和WholeReduceSum归约方案对比&quot;">​</a></h2><p>进一步测试分析可知，单指令BlockReduceSum的执行效率优于WholeReduceSum，因此，根据不同的shape，通过不同的指令组合，可以达到更佳的执行性能。</p><p>例如数据类型为float，shape大小为256的数据，可以通过如下三种方式得到归约结果：</p><ul><li>使用两次WholeReduceSum；</li><li>使用三次BlockReduceSum；</li><li>一次BlockReduceSum操作加一次WholeReduceSum操作。</li></ul><p>通过分析单指令性能数据（开发者可以自行测试）可知：一次BlockReduceSum操作加一次WholeReduceSum操作性能优于两次WholeReduceSum，同时也优于三次BlockReduceSum的方案。</p><p>下文给出了上面三种方式的核心代码片段和性能数据对比。完整样例请参考<a href="https://gitcode.com/cann/asc-devkit/blob/master/examples/01_simd_cpp_api/03_libraries/04_reduce/reduce" target="_blank" rel="noreferrer">ReduceCustom</a>。</p><p>【性能数据】</p><p>输入shape为256，数据类型为float。如下示例的性能数据如下：</p><p><strong>表 1</strong> 两次WholeReduceSum、三次BlockReduceSum、一次BlockReduceSum加一次WholeReduceSum，三种归约操作的性能数据（循环100次的时间总和）</p><p>&lt;table&gt;&lt;thead align=&quot;left&quot;&gt;&lt;tr&gt;&lt;th class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;33.33333333333333%&quot;&gt;&lt;p&gt;两次WholeReduceSum&lt;/p&gt; &lt;/th&gt; &lt;th class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;33.33333333333333%&quot;&gt;&lt;p&gt;三次BlockReduceSum&lt;/p&gt; &lt;/th&gt; &lt;th class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;33.33333333333333%&quot;&gt;&lt;p&gt;一次BlockReduceSum加一次WholeReduceSum&lt;/p&gt; &lt;/th&gt; &lt;/tr&gt; &lt;/thead&gt; &lt;tbody&gt;&lt;tr&gt;&lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;33.33333333333333%&quot;&gt;&lt;p&gt;13us&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;33.33333333333333%&quot;&gt;&lt;p&gt;13.94us&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;33.33333333333333%&quot;&gt;&lt;p&gt;8.44us&lt;/p&gt; &lt;/td&gt; &lt;/tr&gt; &lt;/tbody&gt; &lt;/table&gt;</p><p>【两次WholeReduceSum操作】</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>...</span></span>
<span class="line"><span>pipe.InitBuffer(calcBuf, totalLength * sizeof(DTYPE));</span></span>
<span class="line"><span>AscendC::LocalTensor&lt;DTYPE&gt; tempTensor1 = calcBuf.Get&lt;DTYPE&gt;();</span></span>
<span class="line"><span>const uint32_t repeatNum = (totalLength * sizeof(DTYPE) + REP_LEN - 1) / REP_LEN;</span></span>
<span class="line"><span>AscendC::SetMaskCount();</span></span>
<span class="line"><span>AscendC::SetVectorMask&lt;DTYPE&gt;(0, totalLength);</span></span>
<span class="line"><span>AscendC::WholeReduceSum&lt;DTYPE, false&gt;(tempTensor1, xLocal, 1, AscendC::MASK_PLACEHOLDER,</span></span>
<span class="line"><span>    DEFAULT_BLK_STRIDE, DEFAULT_BLK_STRIDE, DEFAULT_REP_STRIDE);</span></span>
<span class="line"><span>AscendC::PipeBarrier&lt;PIPE_V&gt;();</span></span>
<span class="line"><span>AscendC::SetVectorMask&lt;DTYPE&gt;(0, repeatNum);</span></span>
<span class="line"><span>AscendC::WholeReduceSum&lt;DTYPE, false&gt;(zLocal, tempTensor1, 1, AscendC::MASK_PLACEHOLDER,</span></span>
<span class="line"><span>    DEFAULT_BLK_STRIDE, DEFAULT_BLK_STRIDE, DEFAULT_REP_STRIDE);</span></span>
<span class="line"><span>AscendC::PipeBarrier&lt;PIPE_V&gt;();</span></span>
<span class="line"><span>AscendC::SetMaskNorm();</span></span>
<span class="line"><span>...</span></span></code></pre></div><p>【三次BlockReduceSum操作】</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>...</span></span>
<span class="line"><span>static constexpr uint32_t BLK_LEN = 32;</span></span>
<span class="line"><span>TBuf&lt;TPosition::VECCALC&gt; calcBuf;</span></span>
<span class="line"><span>constexpr uint32_t c0Count = BLK_LEN / sizeof(DTYPE_X);</span></span>
<span class="line"><span>const uint32_t blockNum0 = (totalLength + c0Count - 1) / c0Count;</span></span>
<span class="line"><span>const uint32_t blockNum1 = (blockNum0 + c0Count - 1) / c0Count;</span></span>
<span class="line"><span>AscendC::SetMaskCount();</span></span>
<span class="line"><span>AscendC::SetVectorMask&lt;DTYPE_X&gt;(0, totalLength);</span></span>
<span class="line"><span>AscendC::BlockReduceSum&lt;DTYPE_X, false&gt;(tempTensor1, xLocal, AscendC::MASK_PLACEHOLDER, 1,</span></span>
<span class="line"><span>    DEFAULT_BLK_STRIDE, DEFAULT_BLK_STRIDE, DEFAULT_REP_STRIDE);</span></span>
<span class="line"><span>AscendC::PipeBarrier&lt;PIPE_V&gt;();</span></span>
<span class="line"><span>AscendC::SetVectorMask&lt;DTYPE_X&gt;(0, blockNum0);</span></span>
<span class="line"><span>AscendC::BlockReduceSum&lt;DTYPE_X, false&gt;(tempTensor1, tempTensor1, AscendC::MASK_PLACEHOLDER, 1,</span></span>
<span class="line"><span>    DEFAULT_BLK_STRIDE, DEFAULT_BLK_STRIDE, DEFAULT_REP_STRIDE);</span></span>
<span class="line"><span>AscendC::PipeBarrier&lt;PIPE_V&gt;();</span></span>
<span class="line"><span>AscendC::SetVectorMask&lt;DTYPE_X&gt;(0, blockNum1);</span></span>
<span class="line"><span>AscendC::BlockReduceSum&lt;DTYPE_X, false&gt;(zLocal, tempTensor1, AscendC::MASK_PLACEHOLDER, 1,</span></span>
<span class="line"><span>    DEFAULT_BLK_STRIDE, DEFAULT_BLK_STRIDE, DEFAULT_REP_STRIDE);</span></span>
<span class="line"><span>AscendC::PipeBarrier&lt;PIPE_V&gt;();</span></span>
<span class="line"><span>AscendC::SetMaskNorm();</span></span>
<span class="line"><span>...</span></span></code></pre></div><p>【BlockReduceSum + WholeReduceSum操作】</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>...</span></span>
<span class="line"><span>pipe.InitBuffer(calcBuf, totalLength * sizeof(DTYPE));</span></span>
<span class="line"><span>AscendC::LocalTensor&lt;DTYPE&gt; tempTensor1 = calcBuf.Get&lt;DTYPE&gt;();</span></span>
<span class="line"><span>constexpr uint32_t c0Count = BLK_LEN / sizeof(DTYPE);</span></span>
<span class="line"><span>const uint32_t blockNum0 = (totalLength + c0Count - 1) / c0Count;</span></span>
<span class="line"><span>AscendC::SetMaskCount();</span></span>
<span class="line"><span>AscendC::SetVectorMask&lt;DTYPE&gt;(0, totalLength);</span></span>
<span class="line"><span>AscendC::BlockReduceSum&lt;DTYPE, false&gt;(tempTensor1, xLocal, 1, AscendC::MASK_PLACEHOLDER,</span></span>
<span class="line"><span>    DEFAULT_BLK_STRIDE, DEFAULT_BLK_STRIDE, DEFAULT_REP_STRIDE);</span></span>
<span class="line"><span>AscendC::PipeBarrier&lt;PIPE_V&gt;();</span></span>
<span class="line"><span>AscendC::SetVectorMask&lt;DTYPE&gt;(0, blockNum0);</span></span>
<span class="line"><span>AscendC::WholeReduceSum&lt;DTYPE, false&gt;(zLocal, tempTensor1, 1, AscendC::MASK_PLACEHOLDER,</span></span>
<span class="line"><span>    DEFAULT_BLK_STRIDE, DEFAULT_BLK_STRIDE, DEFAULT_REP_STRIDE);</span></span>
<span class="line"><span>AscendC::PipeBarrier&lt;PIPE_V&gt;();</span></span>
<span class="line"><span>AscendC::SetMaskNorm();</span></span>
<span class="line"><span>...</span></span></code></pre></div>`,35)])])}const m=n(l,[["render",c]]);export{_ as __pageData,m as default};
