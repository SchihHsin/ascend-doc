import{c as n,Q as s,j as p,m as e}from"./chunks/framework.DOi4mjdC.js";const m=JSON.parse('{"title":"分离模式","description":"","frontmatter":{},"headers":[{"level":1,"title":"分离模式","slug":"分离模式"}],"relativePath":"guide/算子实践参考/SIMD算子实现/矩阵编程（基础API）/分离模式.md","filePath":"guide/算子实践参考/SIMD算子实现/矩阵编程（基础API）/分离模式.md"}'),l={name:"guide/算子实践参考/SIMD算子实现/矩阵编程（基础API）/分离模式.md"};function i(t,a,c,o,r,d){return s(),p("div",null,[...a[0]||(a[0]=[e(`<h1 id="分离模式" tabindex="-1">分离模式 <a class="header-anchor" href="#分离模式" aria-label="Permalink to &quot;分离模式&quot;">​</a></h1><div class="note custom-block github-alert"><p class="custom-block-title">说明</p><p>本节内容为针对分离模式，使用基础API进行矩阵乘法的编程指导。 如下章节内容暂不支持Ascend 950PR/Ascend 950DT。</p></div><p>针对<a href="./../../../编程指南/硬件实现/基本架构.html#section1574769433">分离模式</a>，使用基础API进行矩阵乘法算子实现的编程范式和<a href="./耦合模式.html">耦合模式</a>一致，由于硬件架构不同，具体实现有一些差异，本节仅提供差异点说明。完整代码请参见<a href="https://gitee.com/ascend/samples/tree/master/operator/ascendc/0_introduction/20_mmad_kernellaunch/MmadInvocation" target="_blank" rel="noreferrer">Mmad样例</a>。</p><ul><li><p><strong>CopyIn阶段差异</strong></p><ul><li><p><strong>耦合模式</strong></p><p>在CopyIn阶段，即从GM-&gt;A1/B1（L1 Buffer）的阶段，耦合模式下可以使用DataCopy接口直接将数据从GM搬入L1 Buffer，也可以将数据从GM搬入UB，再搬入L1 Buffer。若需要ND2NZ的格式转换，需要开发者自行完成；或使用DataCopy接口提供的<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/%E9%9A%8F%E8%B7%AF%E8%BD%AC%E6%8D%A2ND2NZ%E6%90%AC%E8%BF%90.md" target="_blank" rel="noreferrer">随路格式转换</a>功能，但该功能会使用UB临时空间。</p><p>如下示例，直接使用了GM-&gt;A1/B1的数据搬运指令，自行完成ND2NZ的格式转换。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    __aicore__ inline void CopyND2NZ(const AscendC::LocalTensor&lt;half&gt;&amp; dst, const AscendC::GlobalTensor&lt;half&gt;&amp; src,</span></span>
<span class="line"><span>        const uint16_t height, const uint16_t width)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        for (int i = 0; i &lt; width / 16; ++i) {</span></span>
<span class="line"><span>            int srcOffset = i * 16;</span></span>
<span class="line"><span>            int dstOffset = i * 16 * height;</span></span>
<span class="line"><span>            AscendC::DataCopy(dst[dstOffset], src[srcOffset], { height, 1, uint16_t(width / 16 - 1), 0 });</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void CopyIn()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;half&gt; a1Local = inQueueA1.AllocTensor&lt;half&gt;();</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;half&gt; b1Local = inQueueB1.AllocTensor&lt;half&gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        CopyND2NZ(a1Local, aGM, m, k);</span></span>
<span class="line"><span>        CopyND2NZ(b1Local, bGM, k, n);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        inQueueA1.EnQue(a1Local);</span></span>
<span class="line"><span>        inQueueB1.EnQue(b1Local);</span></span>
<span class="line"><span>    }</span></span></code></pre></div></li><li><p><strong>分离模式</strong></p><p>分离模式下数据无法经过VECIN/VECCALC/VECOUT (UB) 直接搬运到A1/B1 (L1 Buffer) ，但是使用DataCopy接口提供的<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/%E9%9A%8F%E8%B7%AF%E8%BD%AC%E6%8D%A2ND2NZ%E6%90%AC%E8%BF%90.md" target="_blank" rel="noreferrer">随路格式转换</a>功能一条指令即可完成格式转换，无需UB作为临时空间。</p><p>示例如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    __aicore__ inline void CopyIn()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;half&gt; a1Local = inQueueA1.AllocTensor&lt;half&gt;();</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;half&gt; b1Local = inQueueB1.AllocTensor&lt;half&gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        AscendC::Nd2NzParams nd2nzA1Params;</span></span>
<span class="line"><span>        nd2nzA1Params.ndNum = 1;</span></span>
<span class="line"><span>        nd2nzA1Params.nValue = m;</span></span>
<span class="line"><span>        nd2nzA1Params.dValue = k;</span></span>
<span class="line"><span>        nd2nzA1Params.srcNdMatrixStride = 0;</span></span>
<span class="line"><span>        nd2nzA1Params.srcDValue = k;</span></span>
<span class="line"><span>        nd2nzA1Params.dstNzC0Stride = CeilCubeBlock(m) * CUBE_BLOCK;</span></span>
<span class="line"><span>        nd2nzA1Params.dstNzNStride = 1;</span></span>
<span class="line"><span>        nd2nzA1Params.dstNzMatrixStride = 0;</span></span>
<span class="line"><span>        AscendC::DataCopy(a1Local, aGM, nd2nzA1Params);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        AscendC::Nd2NzParams nd2nzB1Params;</span></span>
<span class="line"><span>        nd2nzB1Params.ndNum = 1;</span></span>
<span class="line"><span>        nd2nzB1Params.nValue = k;</span></span>
<span class="line"><span>        nd2nzB1Params.dValue = n;</span></span>
<span class="line"><span>        nd2nzB1Params.srcNdMatrixStride = 0;</span></span>
<span class="line"><span>        nd2nzB1Params.srcDValue = n;</span></span>
<span class="line"><span>        nd2nzB1Params.dstNzC0Stride = CeilCubeBlock(k) * CUBE_BLOCK;</span></span>
<span class="line"><span>        nd2nzB1Params.dstNzNStride = 1;</span></span>
<span class="line"><span>        nd2nzB1Params.dstNzMatrixStride = 0;</span></span>
<span class="line"><span>        AscendC::DataCopy(b1Local, bGM, nd2nzB1Params);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        inQueueA1.EnQue(a1Local);</span></span>
<span class="line"><span>        inQueueB1.EnQue(b1Local);</span></span>
<span class="line"><span>    }</span></span></code></pre></div></li></ul></li><li><p><strong>Aggregate及CopyOut阶段差异</strong></p><ul><li><p><strong>耦合模式</strong></p><p>耦合模式中，完成矩阵乘计算后数据存放于CO1（L0C Buffer），最终搬入GM需要通过CO2（UB），且NZ2ND的格式转换需要在CO1-&gt;CO2-&gt;GM阶段中手动完成。如下样例，在Aggregate阶段将NZ格式数据从CO1搬入CO2中，在CO2-&gt;GM的阶段使用for循环调用DataCopy完成了格式转换。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>     </span></span>
<span class="line"><span>    __aicore__ inline void Aggregate(const AscendC::LocalTensor&lt;float&gt;&amp; c2Local, const int bSplitIdx)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;float&gt; c1Local = outQueueCO1.DeQue&lt;float&gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        AscendC::DataCopyParams dataCopyParams;</span></span>
<span class="line"><span>        dataCopyParams.blockCount = 1;</span></span>
<span class="line"><span>        dataCopyParams.blockLen = 2;</span></span>
<span class="line"><span>        AscendC::DataCopyEnhancedParams enhancedParams;</span></span>
<span class="line"><span>        enhancedParams.blockMode = AscendC::BlockMode::BLOCK_MODE_MATRIX;</span></span>
<span class="line"><span>        AscendC::DataCopy(c2Local[bSplitIdx * cSize / 2], c1Local, dataCopyParams, enhancedParams);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        outQueueCO1.FreeTensor(c1Local);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void CopyOut()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;float&gt; c2Local = outQueueCO2.DeQue&lt;float&gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // transform nz to nd</span></span>
<span class="line"><span>        for (int i = 0; i &lt; nBlocks; ++i) {</span></span>
<span class="line"><span>            AscendC::DataCopy(cGM[i * 16], c2Local[i * m * 16], { m, 2, 0, uint16_t((nBlocks - 1) * 2) });</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        outQueueCO2.FreeTensor(c2Local);</span></span>
<span class="line"><span>    }</span></span></code></pre></div></li><li><p>分离模式</p><p>分离模式下，矩阵乘的计算结果从CO1（L0C Buffer）可以通过Fixpipe通路直接写入GM，而且<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/Fixpipe.md" target="_blank" rel="noreferrer">Fixpipe</a>提供了随路NZ2ND的功能，方便用户做格式转换。样例如下，样例中省去了Aggregate阶段，直接CopyOut。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    __aicore__ inline void CopyOut()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;float&gt; c1Local = outQueueCO1.DeQue&lt;float&gt;();</span></span>
<span class="line"><span>        AscendC::FixpipeParamsV220 fixpipeParams;</span></span>
<span class="line"><span>        fixpipeParams.nSize = n;</span></span>
<span class="line"><span>        fixpipeParams.mSize = m;</span></span>
<span class="line"><span>        fixpipeParams.srcStride = m;</span></span>
<span class="line"><span>        fixpipeParams.dstStride = n;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        fixpipeParams.ndNum = 1;</span></span>
<span class="line"><span>        fixpipeParams.srcNdStride = 0;</span></span>
<span class="line"><span>        fixpipeParams.dstNdStride = 0;</span></span>
<span class="line"><span>        AscendC::Fixpipe(cGM, c1Local, fixpipeParams);</span></span>
<span class="line"><span>        outQueueCO1.FreeTensor(c1Local);</span></span>
<span class="line"><span>    }</span></span></code></pre></div></li></ul></li></ul>`,4)])])}const C=n(l,[["render",i]]);export{m as __pageData,C as default};
