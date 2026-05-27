import{c as s,Q as n,j as p,m as l}from"./chunks/framework.DOi4mjdC.js";const e="/assets/%E6%90%AC%E8%BF%90%E4%BC%98%E5%8C%96.WynA3fZF.png",t="/assets/%E4%BD%BF%E7%94%A8%E5%A4%9A%E6%AC%A1DataCopyPad%E6%8E%A5%E5%8F%A3%E8%BF%9B%E8%A1%8C%E6%90%AC%E8%BF%90.Ctq0YTJ4.png",o="/assets/%E4%BD%BF%E7%94%A8Loop%E6%A8%A1%E5%BC%8F%E8%BF%9B%E8%A1%8C%E6%90%AC%E8%BF%90.BcBb5V-t.png",d="/assets/%E6%90%AC%E8%BF%90%E5%89%8D%E5%90%8E%E6%95%B0%E6%8D%AE.BEm9EXEo.png",c="/assets/%E4%BD%BF%E7%94%A8%E5%A4%9A%E6%AC%A1DataCopyPad%E8%BF%9B%E8%A1%8C%E6%90%AC%E8%BF%90.Csqa_CPg.png",i="/assets/%E6%90%AC%E8%BF%90%E5%89%8D%E5%90%8E%E6%95%B0%E6%8D%AE-56.Cc0AAtcR.png",_=JSON.parse('{"title":"非连续搬运场景减少搬运次数","description":"","frontmatter":{},"headers":[{"level":1,"title":"非连续搬运场景减少搬运次数","slug":"非连续搬运场景减少搬运次数"},{"level":2,"title":"使用Loop模式减少非连续搬运的次数","slug":"使用loop模式减少非连续搬运的次数"},{"level":2,"title":"使用多维数据搬运减少非连续搬运次数","slug":"使用多维数据搬运减少非连续搬运次数"}],"relativePath":"guide/算子实践参考/SIMD算子性能优化/内存访问/非连续搬运场景减少搬运次数.md","filePath":"guide/算子实践参考/SIMD算子性能优化/内存访问/非连续搬运场景减少搬运次数.md"}'),r={name:"guide/算子实践参考/SIMD算子性能优化/内存访问/非连续搬运场景减少搬运次数.md"};function C(P,a,m,g,y,A){return n(),p("div",null,[...a[0]||(a[0]=[l('<h1 id="非连续搬运场景减少搬运次数" tabindex="-1">非连续搬运场景减少搬运次数 <a class="header-anchor" href="#非连续搬运场景减少搬运次数" aria-label="Permalink to &quot;非连续搬运场景减少搬运次数&quot;">​</a></h1><p>【优先级】中</p><div class="note custom-block github-alert"><p class="custom-block-title">说明</p><p>该性能优化建议适用于如下产品型号：</p><ul><li>Ascend 950PR/Ascend 950DT</li></ul></div><p>在非连续搬运场景可以使用DataCopyPad接口的Loop模式和DataCopy的多维数据搬运接口来减少搬运次数，优化搬运性能。</p><h2 id="使用loop模式减少非连续搬运的次数" tabindex="-1">使用Loop模式减少非连续搬运的次数 <a class="header-anchor" href="#使用loop模式减少非连续搬运的次数" aria-label="Permalink to &quot;使用Loop模式减少非连续搬运的次数&quot;">​</a></h2><p>【描述】DataCopyPad接口在Normal/Compact模式基础上，可以使用Loop模式搬运二维数据，假设我们希望以下图的方式搬运8个48B大小的数据块：</p><p><img src="'+e+`" alt=""></p><p>【反例】调用多次搬运接口进行搬运（以DataCopyPad为例）</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>__aicore__ inline void CopyIn3(){</span></span>
<span class="line"><span>    AscendC::LocalTensor&lt;T&gt; xLocal = inQueueX.AllocTensor&lt;T&gt;();</span></span>
<span class="line"><span>    AscendC::Duplicate&lt;T&gt;(xLocal, 0, count);</span></span>
<span class="line"><span>    AscendC::DataCopyParams dataCopyParams;</span></span>
<span class="line"><span>    dataCopyParams.blockCount = 2;</span></span>
<span class="line"><span>    dataCopyParams.blockLen = 48;</span></span>
<span class="line"><span>    dataCopyParams.srcStride = 0;</span></span>
<span class="line"><span>    dataCopyParams.dstStride = 0;</span></span>
<span class="line"><span>    AscendC::DataCopyPadParams dataCopyPadParams;</span></span>
<span class="line"><span>    dataCopyPadParams.isPad = 0;</span></span>
<span class="line"><span>    dataCopyPadParams.leftPadding = 0;</span></span>
<span class="line"><span>    dataCopyPadParams.rightPadding = 0;</span></span>
<span class="line"><span>    dataCopyPadParams.paddingValue = 0;</span></span>
<span class="line"><span>    AscendC::DataCopyPad&lt;T, AscendC::PaddingMode::Compact&gt;(xLocal, xGm, dataCopyParams, dataCopyPadParams);</span></span>
<span class="line"><span>    AscendC::DataCopyPad&lt;T, AscendC::PaddingMode::Compact&gt;(xLocal[32], xGm[24], dataCopyParams, dataCopyPadParams);</span></span>
<span class="line"><span>    AscendC::DataCopyPad&lt;T, AscendC::PaddingMode::Compact&gt;(xLocal[72], xGm[48], dataCopyParams, dataCopyPadParams);</span></span>
<span class="line"><span>    AscendC::DataCopyPad&lt;T, AscendC::PaddingMode::Compact&gt;(xLocal[104], xGm[72], dataCopyParams, dataCopyPadParams);</span></span>
<span class="line"><span>    inQueueX.EnQue&lt;T&gt;(xLocal);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>图 1</strong> 使用多次DataCopyPad接口进行搬运<br><img src="`+t+`" alt="" title="使用多次DataCopyPad接口进行搬运"></p><p>【正例】使用Loop模式进行搬运</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>__aicore__ inline void CopyIn3(){</span></span>
<span class="line"><span>    AscendC::LoopModeParams loopModeParams;</span></span>
<span class="line"><span>    loopModeParams.loop1Size = 2;</span></span>
<span class="line"><span>    loopModeParams.loop2Size = 2;</span></span>
<span class="line"><span>    loopModeParams.loop1SrcStride = 96;</span></span>
<span class="line"><span>    loopModeParams.loop1DstStride = 128;</span></span>
<span class="line"><span>    loopModeParams.loop2SrcStride = 192;</span></span>
<span class="line"><span>    loopModeParams.loop2DstStride = 288;</span></span>
<span class="line"><span>    AscendC::LocalTensor&lt;T&gt; xLocal = inQueueX.AllocTensor&lt;T&gt;();</span></span>
<span class="line"><span>    AscendC::Duplicate&lt;T&gt;(xLocal, 0, count);</span></span>
<span class="line"><span>    AscendC::DataCopyParams dataCopyParams;</span></span>
<span class="line"><span>    dataCopyParams.blockCount = 2;</span></span>
<span class="line"><span>    dataCopyParams.blockLen = 48;</span></span>
<span class="line"><span>    dataCopyParams.srcStride = 0;</span></span>
<span class="line"><span>    dataCopyParams.dstStride = 0;</span></span>
<span class="line"><span>    AscendC::DataCopyPadParams dataCopyPadParams;</span></span>
<span class="line"><span>    dataCopyPadParams.isPad = 0;</span></span>
<span class="line"><span>    dataCopyPadParams.leftPadding = 0;</span></span>
<span class="line"><span>    dataCopyPadParams.rightPadding = 0;</span></span>
<span class="line"><span>    dataCopyPadParams.paddingValue = 0;</span></span>
<span class="line"><span>    AscendC::SetLoopModePara(loopModeParams, AscendC::DataCopyMVType::OUT_TO_UB);</span></span>
<span class="line"><span>    AscendC::DataCopyPad&lt;T, AscendC::PaddingMode::Compact&gt;(xLocal, xGm, dataCopyParams, dataCopyPadParams);</span></span>
<span class="line"><span>    AscendC::ResetLoopModePara(AscendC::DataCopyMVType::OUT_TO_UB);</span></span>
<span class="line"><span>    inQueueX.EnQue&lt;T&gt;(xLocal);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>图 2</strong> 使用Loop模式进行搬运<br><img src="`+o+'" alt="" title="使用Loop模式进行搬运"></p><p>【总结】当数据块之间需要插入不同大小Padding时，使用Loop模式搬运代替多次的DataCopyPad能够减少搬运指令的使用，提升性能。</p><h2 id="使用多维数据搬运减少非连续搬运次数" tabindex="-1">使用多维数据搬运减少非连续搬运次数 <a class="header-anchor" href="#使用多维数据搬运减少非连续搬运次数" aria-label="Permalink to &quot;使用多维数据搬运减少非连续搬运次数&quot;">​</a></h2><p>【描述】假设我们希望以下图的方式搬运2个8B大小的数据块：</p><p><strong>图 3</strong> 搬运前后数据<br><img src="'+d+'" alt="" title="搬运前后数据"></p><p>【反例】使用多次DataCopyPad进行搬运</p><p><strong>图 4</strong> 使用多次DataCopyPad进行搬运<br><img src="'+c+`" alt="" title="使用多次DataCopyPad进行搬运"></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>__aicore__ inline void CopyIn5(){</span></span>
<span class="line"><span>    AscendC::LocalTensor&lt;T&gt; xLocal = inQueueX.AllocTensor&lt;T&gt;();</span></span>
<span class="line"><span>    AscendC::Duplicate&lt;T&gt;(xLocal, 0, count);</span></span>
<span class="line"><span>    AscendC::DataCopyParams dataCopyParams;</span></span>
<span class="line"><span>    dataCopyParams.blockCount = 1;</span></span>
<span class="line"><span>    dataCopyParams.blockLen = 8;</span></span>
<span class="line"><span>    dataCopyParams.srcStride = 0;</span></span>
<span class="line"><span>    dataCopyParams.dstStride = 0;</span></span>
<span class="line"><span>    AscendC::DataCopyPadParams dataCopyPadParams;</span></span>
<span class="line"><span>    dataCopyPadParams.isPad = 1;</span></span>
<span class="line"><span>    dataCopyPadParams.leftPadding = 5;</span></span>
<span class="line"><span>    dataCopyPadParams.rightPadding = 1;</span></span>
<span class="line"><span>    dataCopyPadParams.paddingValue = 0;</span></span>
<span class="line"><span>    // 第一次搬运</span></span>
<span class="line"><span>    AscendC::DataCopyPad&lt;T, AscendC::PaddingMode::Normal&gt;(xLocal, xGm, dataCopyParams, dataCopyPadParams);</span></span>
<span class="line"><span>    dataCopyPadParams.isPad = 1;</span></span>
<span class="line"><span>    dataCopyPadParams.leftPadding = 1;</span></span>
<span class="line"><span>    dataCopyPadParams.rightPadding = 5;</span></span>
<span class="line"><span>    dataCopyPadParams.paddingValue = 0;</span></span>
<span class="line"><span>    // 第二次搬运</span></span>
<span class="line"><span>    AscendC::DataCopyPad&lt;T, AscendC::PaddingMode::Normal&gt;(xLocal[8], xGm[2], dataCopyParams, dataCopyPadParams);</span></span>
<span class="line"><span>    inQueueX.EnQue&lt;T&gt;(xLocal);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>【正例】使用多维数据搬运</p><p>DataCopy接口在Ascend 950PR/Ascend 950DT上支持多维数据的搬运，具体可参考<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/%E5%A4%9A%E7%BB%B4%E6%95%B0%E6%8D%AE%E6%90%AC%E8%BF%90%EF%BC%88ISASI%EF%BC%89.md" target="_blank" rel="noreferrer">多维数据搬运（ISASI）</a>。以2D场景的搬运为例，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>__aicore__ inline void CopyIn6(){</span></span>
<span class="line"><span>    AscendC::LocalTensor&lt;T&gt; xLocal = inQueueX.AllocTensor&lt;T&gt;();</span></span>
<span class="line"><span>    AscendC::Duplicate&lt;T&gt;(xLocal, 0, count);</span></span>
<span class="line"><span>    AscendC::NdDmaLoopInfo&lt;2&gt; loopInfo{{1, 2}, {1, 4}, {2, 2}, {1, 1}, {1, 1}};</span></span>
<span class="line"><span>    AscendC::NdDmaParams&lt;T, 2&gt; params = {loopInfo, 0};</span></span>
<span class="line"><span>    AscendC::NdDmaDci();</span></span>
<span class="line"><span>    static constexpr AscendC::NdDmaConfig config = {false};</span></span>
<span class="line"><span>    AscendC::DataCopy&lt;T, 2, config&gt;(xLocal, xGm, params);</span></span>
<span class="line"><span>    inQueueX.EnQue&lt;T&gt;(xLocal);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>图 5</strong> 搬运前后数据<br><img src="`+i+'" alt="" title="搬运前后数据-56"></p><p>【总结】使用多维数据搬运在部分场景下能够减少搬运指令的条数，从而提升性能。</p>',25)])])}const E=s(r,[["render",C]]);export{_ as __pageData,E as default};
