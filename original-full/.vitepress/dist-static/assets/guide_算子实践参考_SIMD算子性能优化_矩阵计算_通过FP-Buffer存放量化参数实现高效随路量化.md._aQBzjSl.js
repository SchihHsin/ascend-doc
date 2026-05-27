import{c as n,Q as s,j as p,m as l}from"./chunks/framework.DOi4mjdC.js";const e="/assets/%E5%8F%8D%E4%BE%8B%E6%95%B0%E6%8D%AE%E6%B5%81%E5%9B%BE-78.BDcrqlTM.png",i="/assets/%E6%AD%A3%E4%BE%8B%E6%95%B0%E6%8D%AE%E6%B5%81%E5%9B%BE-79.BUDBpiLR.png",m=JSON.parse('{"title":"通过FP Buffer存放量化参数实现高效随路量化","description":"","frontmatter":{},"headers":[{"level":1,"title":"通过FP Buffer存放量化参数实现高效随路量化","slug":"通过fp-buffer存放量化参数实现高效随路量化"}],"relativePath":"guide/算子实践参考/SIMD算子性能优化/矩阵计算/通过FP-Buffer存放量化参数实现高效随路量化.md","filePath":"guide/算子实践参考/SIMD算子性能优化/矩阵计算/通过FP-Buffer存放量化参数实现高效随路量化.md"}'),t={name:"guide/算子实践参考/SIMD算子性能优化/矩阵计算/通过FP-Buffer存放量化参数实现高效随路量化.md"};function c(o,a,u,r,_,d){return s(),p("div",null,[...a[0]||(a[0]=[l('<h1 id="通过fp-buffer存放量化参数实现高效随路量化" tabindex="-1">通过FP Buffer存放量化参数实现高效随路量化 <a class="header-anchor" href="#通过fp-buffer存放量化参数实现高效随路量化" aria-label="Permalink to &quot;通过FP Buffer存放量化参数实现高效随路量化&quot;">​</a></h1><p>【优先级】高</p><p>【描述】算子实现中对矩阵乘结果进行量化计算时，可将量化参数搬运到C2PIPE2GM（Fixpipe Buffer）上，调用一次Fixpipe接口实现矩阵乘结果的量化计算。相比于将矩阵乘的结果从CO1（L0C）搬运到GM，再从GM搬运到UB，在UB进行量化计算的过程，数据搬运的次数更少，内存使用效率更高。</p><div class="note custom-block github-alert"><p class="custom-block-title">说明</p><p>本性能优化手段仅针对Atlas A2 训练系列产品/Atlas A2 推理系列产品生效。</p></div><p><strong>图 1</strong> 反例数据流图<br><img src="'+e+'" alt="" title="反例数据流图-78"></p><p><strong>图 2</strong> 正例数据流图<br><img src="'+i+`" alt="" title="正例数据流图-79"></p><p>【反例】</p><p>对矩阵乘结果进行量化计算的过程如下：</p><ul><li>将矩阵乘的结果从CO1搬运到workspace上；</li><li>再从workspace搬运到UB上；</li><li>将量化参数搬运到UB上，和矩阵乘的结果一起在UB上进行一系列量化计算；</li><li>将最终量化结果从UB搬运到GM上。</li></ul><p>相比于正确示例多增加了CO1-&gt;workspace、workspace-&gt;UB的搬运过程和量化的vector计算。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>...</span></span>
<span class="line"><span>// 该样例仅做示例说明，非完整代码，省略了部分同步控制代码</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    __aicore__ inline KernelSample()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        aSize = m * k;</span></span>
<span class="line"><span>        bSize = k * n;</span></span>
<span class="line"><span>        cSize = m * n;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void Init(__gm__ uint8_t *a, __gm__ uint8_t *b, __gm__ uint8_t *c, __gm__ uint8_t *deqTensor)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        aGM.SetGlobalBuffer((__gm__ half *)a);</span></span>
<span class="line"><span>        bGM.SetGlobalBuffer((__gm__ half *)b);</span></span>
<span class="line"><span>        cGM.SetGlobalBuffer((__gm__ float *)c);</span></span>
<span class="line"><span>        deqGM.SetGlobalBuffer((__gm__ half *)deqTensor);</span></span>
<span class="line"><span>        pipe.InitBuffer(inQueueA1, 1, aSize * sizeof(half));</span></span>
<span class="line"><span>        pipe.InitBuffer(inQueueA2, 1, aSize * sizeof(half));</span></span>
<span class="line"><span>        pipe.InitBuffer(inQueueB1, 1, bSize * sizeof(half));</span></span>
<span class="line"><span>        pipe.InitBuffer(inQueueB2, 2, bSize * sizeof(half));</span></span>
<span class="line"><span>        pipe.InitBuffer(outQueueCO1, 1, cSize * sizeof(float));</span></span>
<span class="line"><span>        pipe.InitBuffer(inQueueSrc0, 1, cSize * sizeof(float));</span></span>
<span class="line"><span>        pipe.InitBuffer(inQueueTmp, 1, cSize * sizeof(half));</span></span>
<span class="line"><span>        pipe.InitBuffer(inQueueDeq, 1, cSize * sizeof(half));</span></span>
<span class="line"><span>        pipe.InitBuffer(outQueueDst, 1, cSize * sizeof(int8_t));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void Process()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        CopyIn();</span></span>
<span class="line"><span>        SplitA();</span></span>
<span class="line"><span>        SplitB();</span></span>
<span class="line"><span>        Compute();</span></span>
<span class="line"><span>        CopyOut();</span></span>
<span class="line"><span>        CopyIn1();</span></span>
<span class="line"><span>        Compute1();</span></span>
<span class="line"><span>        CopyOut1();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>private:</span></span>
<span class="line"><span>    __aicore__ inline void CopyIn()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        LocalTensor&lt;half&gt; a1Local = inQueueA1.AllocTensor&lt;half&gt;();</span></span>
<span class="line"><span>        LocalTensor&lt;half&gt; b1Local = inQueueB1.AllocTensor&lt;half&gt;();</span></span>
<span class="line"><span>        LocalTensor&lt;half&gt; deqLocal = inQueueDeq.AllocTensor&lt;half&gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        Nd2NzParams dataCopyA1Params;</span></span>
<span class="line"><span>        dataCopyA1Params.ndNum = 1;</span></span>
<span class="line"><span>        dataCopyA1Params.nValue = m;</span></span>
<span class="line"><span>        dataCopyA1Params.dValue = k;</span></span>
<span class="line"><span>        dataCopyA1Params.srcNdMatrixStride = 0;</span></span>
<span class="line"><span>        dataCopyA1Params.srcDValue = k;</span></span>
<span class="line"><span>        dataCopyA1Params.dstNzC0Stride = m;</span></span>
<span class="line"><span>        dataCopyA1Params.dstNzNStride = 1;</span></span>
<span class="line"><span>        dataCopyA1Params.dstNzMatrixStride = 0;</span></span>
<span class="line"><span>        DataCopy(a1Local, aGM, dataCopyA1Params);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        Nd2NzParams dataCopyB1Params;</span></span>
<span class="line"><span>        dataCopyB1Params.ndNum = 1;</span></span>
<span class="line"><span>        dataCopyB1Params.nValue = k;</span></span>
<span class="line"><span>        dataCopyB1Params.dValue = n;</span></span>
<span class="line"><span>        dataCopyB1Params.srcNdMatrixStride = 0;</span></span>
<span class="line"><span>        dataCopyB1Params.srcDValue = n;</span></span>
<span class="line"><span>        dataCopyB1Params.dstNzC0Stride = k;</span></span>
<span class="line"><span>        dataCopyB1Params.dstNzNStride = 1;</span></span>
<span class="line"><span>        dataCopyB1Params.dstNzMatrixStride = 0;</span></span>
<span class="line"><span>        DataCopy(b1Local, bGM, dataCopyB1Params);</span></span>
<span class="line"><span>        // 将量化参数搬运到UB</span></span>
<span class="line"><span>        DataCopy(deqLocal, deqGM, cSize);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        inQueueA1.EnQue(a1Local);</span></span>
<span class="line"><span>        inQueueB1.EnQue(b1Local);</span></span>
<span class="line"><span>        inQueueDeq.EnQue(deqLocal);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void SplitA()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        ...</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void SplitB()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        ...</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void Compute()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        LocalTensor&lt;half&gt; a2Local = inQueueA2.DeQue&lt;half&gt;();</span></span>
<span class="line"><span>        LocalTensor&lt;half&gt; b2Local = inQueueB2.DeQue&lt;half&gt;();</span></span>
<span class="line"><span>        LocalTensor&lt;float&gt; c1Local = outQueueCO1.AllocTensor&lt;float&gt;();</span></span>
<span class="line"><span>        MmadParams mmadParams;</span></span>
<span class="line"><span>        mmadParams.m = m;</span></span>
<span class="line"><span>        mmadParams.n = n;</span></span>
<span class="line"><span>        mmadParams.k = k;</span></span>
<span class="line"><span>        // 矩阵乘</span></span>
<span class="line"><span>        Mmad(c1Local, a2Local, b2Local, mmadParams); // m*n</span></span>
<span class="line"><span>        outQueueCO1.EnQue&lt;float&gt;(c1Local);</span></span>
<span class="line"><span>        inQueueA2.FreeTensor(a2Local);</span></span>
<span class="line"><span>        inQueueB2.FreeTensor(b2Local);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void CopyOut()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        LocalTensor&lt;float&gt; c1Local = outQueueCO1.DeQue&lt;float&gt;();</span></span>
<span class="line"><span>        GM_ADDR usrWorkspace = AscendC::GetUserWorkspace(workspace);</span></span>
<span class="line"><span>        xGm.SetGlobalBuffer((__gm__ float *)(usrWorkspace));</span></span>
<span class="line"><span>        FixpipeParamsV220 fixpipeParams;</span></span>
<span class="line"><span>        fixpipeParams.nSize = n;</span></span>
<span class="line"><span>        fixpipeParams.mSize = m;</span></span>
<span class="line"><span>        fixpipeParams.srcStride = m;</span></span>
<span class="line"><span>        fixpipeParams.dstStride = n;</span></span>
<span class="line"><span>        fixpipeParams.ndNum = 1;</span></span>
<span class="line"><span>        fixpipeParams.srcNdStride = 0;</span></span>
<span class="line"><span>        fixpipeParams.dstNdStride = 0;</span></span>
<span class="line"><span>        // 将矩阵乘的计算结果从CO1搬运到workspace</span></span>
<span class="line"><span>        Fixpipe(xGm, c1Local, fixpipeParams);</span></span>
<span class="line"><span>        outQueueCO1.FreeTensor(c1Local);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void CopyIn1()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        // 将矩阵乘的计算结果从workspace搬运到UB</span></span>
<span class="line"><span>        LocalTensor&lt;float&gt; src0Local = inQueueSrc0.AllocTensor&lt;float&gt;();</span></span>
<span class="line"><span>        DataCopy(src0Local, xGm, cSize);</span></span>
<span class="line"><span>        inQueueSrc0.EnQue(src0Local);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void Compute1()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        LocalTensor&lt;float&gt; src0Local = inQueueSrc0.DeQue&lt;float&gt;();</span></span>
<span class="line"><span>        LocalTensor&lt;half&gt; tmpLocal = inQueueTmp.AllocTensor&lt;half&gt;();</span></span>
<span class="line"><span>        LocalTensor&lt;half&gt; deqLocal = inQueueDeq.DeQue&lt;half&gt;();</span></span>
<span class="line"><span>        LocalTensor&lt;int8_t&gt; dstLocal = outQueueDst.AllocTensor&lt;int8_t&gt;();</span></span>
<span class="line"><span>        // 量化计算</span></span>
<span class="line"><span>        Cast(tmpLocal, src0Local, RoundMode::CAST_NONE, cSize);</span></span>
<span class="line"><span>        LocalTensor&lt;half&gt; tmpHalfBuffer = src0Local.ReinterpretCast&lt;half&gt;();</span></span>
<span class="line"><span>        Mul(tmpHalfBuffer, tmpLocal, deqLocal, cSize);</span></span>
<span class="line"><span>        Cast(dstLocal, tmpHalfBuffer, RoundMode::CAST_NONE, cSize);</span></span>
<span class="line"><span>        outQueueDst.EnQue&lt;int8_t&gt;(dstLocal);</span></span>
<span class="line"><span>        inQueueSrc0.FreeTensor(src0Local);</span></span>
<span class="line"><span>        inQueueTmp.FreeTensor(tmpLocal);</span></span>
<span class="line"><span>        inQueueDeq.FreeTensor(deqLocal);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void CopyOut1()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        ...</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>private:</span></span>
<span class="line"><span>    TPipe pipe;</span></span>
<span class="line"><span>    TQue&lt;TPosition::A1, 1&gt; inQueueA1;</span></span>
<span class="line"><span>    TQue&lt;TPosition::A2, 1&gt; inQueueA2;</span></span>
<span class="line"><span>    TQue&lt;TPosition::B1, 1&gt; inQueueB1;</span></span>
<span class="line"><span>    TQue&lt;TPosition::B2, 1&gt; inQueueB2;</span></span>
<span class="line"><span>    TQue&lt;TPosition::CO1, 1&gt; outQueueCO1;</span></span>
<span class="line"><span>    TQue&lt;TPosition::VECIN, 1&gt; inQueueDeq;</span></span>
<span class="line"><span>    TQue&lt;TPosition::VECIN, 1&gt; inQueueSrc0;</span></span>
<span class="line"><span>    TQue&lt;TPosition::VECCALC, 1&gt; inQueueTmp;</span></span>
<span class="line"><span>    TQue&lt;TPosition::VECOUT, 1&gt; outQueueDst;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    GlobalTensor&lt;half&gt; aGM;</span></span>
<span class="line"><span>    GlobalTensor&lt;half&gt; bGM;</span></span>
<span class="line"><span>    GlobalTensor&lt;float&gt; cGM;</span></span>
<span class="line"><span>    GlobalTensor&lt;float&gt; biasGM;</span></span>
<span class="line"><span>    uint16_t m = 32, k = 32, n = 32;</span></span>
<span class="line"><span>    uint16_t aSize, bSize, cSize;</span></span>
<span class="line"><span>    ...</span></span></code></pre></div><p>【正例】</p><p>该算子对矩阵乘的结果进行量化计算时，可将量化参数搬运到FB(Fixpipe Buffer)上，调用一次Fixpipe接口实现矩阵乘结果的量化计算。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>...</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    __aicore__ inline KernelSample()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        aSize = m * k;</span></span>
<span class="line"><span>        bSize = k * n;</span></span>
<span class="line"><span>        cSize = m * n;</span></span>
<span class="line"><span>        QuantSize = n;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void Init(__gm__ uint8_t *a, __gm__ uint8_t *b, __gm__ uint8_t *c, __gm__ uint8_t *deqTensor)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        aGM.SetGlobalBuffer((__gm__ half *)a);</span></span>
<span class="line"><span>        bGM.SetGlobalBuffer((__gm__ half *)b);</span></span>
<span class="line"><span>        cGM.SetGlobalBuffer((__gm__ float *)c);</span></span>
<span class="line"><span>        deqGM.SetGlobalBuffer((__gm__ uint64_t *)deqTensor);</span></span>
<span class="line"><span>        pipe.InitBuffer(inQueueA1, 1, aSize * sizeof(half));</span></span>
<span class="line"><span>        pipe.InitBuffer(inQueueA2, 1, aSize * sizeof(half));</span></span>
<span class="line"><span>        pipe.InitBuffer(inQueueB1, 1, bSize * sizeof(half));</span></span>
<span class="line"><span>        pipe.InitBuffer(inQueueB2, 2, bSize * sizeof(half));</span></span>
<span class="line"><span>        pipe.InitBuffer(outQueueCO1, 1, cSize * sizeof(float));</span></span>
<span class="line"><span>        pipe.InitBuffer(inQueueDeq1, 1, QuantSize * sizeof(uint64_t));</span></span>
<span class="line"><span>        pipe.InitBuffer(inQueueDeq, 1, QuantSize * sizeof(uint64_t));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void Process()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        CopyIn();</span></span>
<span class="line"><span>        SplitA();</span></span>
<span class="line"><span>        SplitB();</span></span>
<span class="line"><span>        SplitDeq();</span></span>
<span class="line"><span>        Compute();</span></span>
<span class="line"><span>        CopyOut();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>private:</span></span>
<span class="line"><span>    __aicore__ inline void CopyIn()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        LocalTensor&lt;half&gt; a1Local = inQueueA1.AllocTensor&lt;half&gt;();</span></span>
<span class="line"><span>        LocalTensor&lt;half&gt; b1Local = inQueueB1.AllocTensor&lt;half&gt;();</span></span>
<span class="line"><span>        LocalTensor&lt;uint64_t&gt; deq1Local = inQueueDeq1.AllocTensor&lt;uint64_t&gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        Nd2NzParams dataCopyA1Params;</span></span>
<span class="line"><span>        dataCopyA1Params.ndNum = 1;</span></span>
<span class="line"><span>        dataCopyA1Params.nValue = m;</span></span>
<span class="line"><span>        dataCopyA1Params.dValue = k;</span></span>
<span class="line"><span>        dataCopyA1Params.srcNdMatrixStride = 0;</span></span>
<span class="line"><span>        dataCopyA1Params.srcDValue = k;</span></span>
<span class="line"><span>        dataCopyA1Params.dstNzC0Stride = m;</span></span>
<span class="line"><span>        dataCopyA1Params.dstNzNStride = 1;</span></span>
<span class="line"><span>        dataCopyA1Params.dstNzMatrixStride = 0;</span></span>
<span class="line"><span>        DataCopy(a1Local, aGM, dataCopyA1Params);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        Nd2NzParams dataCopyB1Params;</span></span>
<span class="line"><span>        dataCopyB1Params.ndNum = 1;</span></span>
<span class="line"><span>        dataCopyB1Params.nValue = k;</span></span>
<span class="line"><span>        dataCopyB1Params.dValue = n;</span></span>
<span class="line"><span>        dataCopyB1Params.srcNdMatrixStride = 0;</span></span>
<span class="line"><span>        dataCopyB1Params.srcDValue = n;</span></span>
<span class="line"><span>        dataCopyB1Params.dstNzC0Stride = k;</span></span>
<span class="line"><span>        dataCopyB1Params.dstNzNStride = 1;</span></span>
<span class="line"><span>        dataCopyB1Params.dstNzMatrixStride = 0;</span></span>
<span class="line"><span>        DataCopy(b1Local, bGM, dataCopyB1Params);</span></span>
<span class="line"><span>        // 将量化参数搬运到L1上</span></span>
<span class="line"><span>        DataCopy(deq1Local, deqGM, QuantSize);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        inQueueA1.EnQue(a1Local);</span></span>
<span class="line"><span>        inQueueB1.EnQue(b1Local);</span></span>
<span class="line"><span>        inQueueDeq.EnQue(deq1Local);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void SplitA()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        ...</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void SplitB()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        ...</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void SplitDeq()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        LocalTensor&lt;uint64_t&gt; deq1Local = inQueueDeq1.DeQue&lt;uint64_t&gt;();</span></span>
<span class="line"><span>        LocalTensor&lt;uint64_t&gt; deqLocal = inQueueDeq.AllocTensor&lt;uint64_t&gt;();</span></span>
<span class="line"><span>        // 将量化参数从L1-&gt;FB</span></span>
<span class="line"><span>        DataCopy(deqLocal, deq1Local, { 1, (uint16_t)(QuantSize * sizeof(uint64_t) / 128), 0, 0 });</span></span>
<span class="line"><span>        inQueueDeq.EnQue&lt;uint64_t&gt;(deqLocal);</span></span>
<span class="line"><span>        inQueueDeq1.FreeTensor(deq1Local);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void Compute()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        LocalTensor&lt;half&gt; a2Local = inQueueA2.DeQue&lt;half&gt;();</span></span>
<span class="line"><span>        LocalTensor&lt;half&gt; b2Local = inQueueB2.DeQue&lt;half&gt;();</span></span>
<span class="line"><span>        LocalTensor&lt;float&gt; c1Local = outQueueCO1.AllocTensor&lt;float&gt;();</span></span>
<span class="line"><span>        MmadParams mmadParams;</span></span>
<span class="line"><span>        mmadParams.m = m;</span></span>
<span class="line"><span>        mmadParams.n = n;</span></span>
<span class="line"><span>        mmadParams.k = k;</span></span>
<span class="line"><span>        // 矩阵乘</span></span>
<span class="line"><span>        Mmad(c1Local, a2Local, b2Local, mmadParams); // m*n</span></span>
<span class="line"><span>        outQueueCO1.EnQue&lt;float&gt;(c1Local);</span></span>
<span class="line"><span>        inQueueA2.FreeTensor(a2Local);</span></span>
<span class="line"><span>        inQueueB2.FreeTensor(b2Local);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void CopyOut()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        LocalTensor&lt;float&gt; c1Local = outQueueCO1.DeQue&lt;float&gt;();</span></span>
<span class="line"><span>        LocalTensor&lt;uint64_t&gt; deqLocal = inQueueDeq.DeQue&lt;uint64_t&gt;();</span></span>
<span class="line"><span>        SetFixpipeNz2ndFlag(1, 0, 0);</span></span>
<span class="line"><span>        DataCopyCO12DstParams dataCopyParams;</span></span>
<span class="line"><span>        dataCopyParams.nSize = n;</span></span>
<span class="line"><span>        dataCopyParams.mSize = m;</span></span>
<span class="line"><span>        dataCopyParams.srcStride = m;</span></span>
<span class="line"><span>        dataCopyParams.dstStride = n;</span></span>
<span class="line"><span>        dataCopyParams.quantPre = QuantMode_t::VQF322B8_PRE;</span></span>
<span class="line"><span>        dataCopyParams.nz2ndEn = true;</span></span>
<span class="line"><span>        // 将矩阵乘进行量化后的计算结果搬出</span></span>
<span class="line"><span>        DataCopy(cGM, c1Local, DataCopyCO12DstParams);</span></span>
<span class="line"><span>        outQueueCO1.FreeTensor(c1Local);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private:</span></span>
<span class="line"><span>    TPipe pipe;</span></span>
<span class="line"><span>    TQue&lt;QuePosition::A1, 1&gt; inQueueA1;</span></span>
<span class="line"><span>    TQue&lt;QuePosition::A2, 1&gt; inQueueA2;</span></span>
<span class="line"><span>    TQue&lt;QuePosition::B1, 1&gt; inQueueB1;</span></span>
<span class="line"><span>    TQue&lt;QuePosition::B2, 1&gt; inQueueB2;</span></span>
<span class="line"><span>    TQue&lt;QuePosition::C1, 1&gt; inQueueDeq1;</span></span>
<span class="line"><span>    TQue&lt;QuePosition::C2PIPE2GM, 1&gt; inQueueDeq;</span></span>
<span class="line"><span>    TQue&lt;QuePosition::CO1, 1&gt; outQueueCO1;</span></span>
<span class="line"><span>    GlobalTensor&lt;half&gt; aGM;</span></span>
<span class="line"><span>    GlobalTensor&lt;half&gt; bGM;</span></span>
<span class="line"><span>    GlobalTensor&lt;float&gt; cGM;</span></span>
<span class="line"><span>    GlobalTensor&lt;uint64_t&gt; deqTensorGM;</span></span>
<span class="line"><span>    uint16_t m = 32, k = 32, n = 32;</span></span>
<span class="line"><span>    uint16_t aSize, bSize, cSize, QuantSize;</span></span>
<span class="line"><span>    ...</span></span></code></pre></div>`,14)])])}const Q=n(t,[["render",c]]);export{m as __pageData,Q as default};
