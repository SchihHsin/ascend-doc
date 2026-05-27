import{c as s,Q as n,j as p,m as l}from"./chunks/framework.DOi4mjdC.js";const e="/assets/%E5%8F%8D%E4%BE%8B%E6%95%B0%E6%8D%AE%E6%B5%81%E5%9B%BE-80.kMAWCeXe.png",i="/assets/%E6%AD%A3%E4%BE%8B%E6%95%B0%E6%8D%AE%E6%B5%81%E5%9B%BE-81.CU-VHe9n.png",f=JSON.parse('{"title":"通过L0C Buffer数据暂存实现高效的矩阵乘结果累加","description":"","frontmatter":{},"headers":[{"level":1,"title":"通过L0C Buffer数据暂存实现高效的矩阵乘结果累加","slug":"通过l0c-buffer数据暂存实现高效的矩阵乘结果累加"}],"relativePath":"guide/算子实践参考/SIMD算子性能优化/矩阵计算/通过L0C-Buffer数据暂存实现高效的矩阵乘结果累加.md","filePath":"guide/算子实践参考/SIMD算子性能优化/矩阵计算/通过L0C-Buffer数据暂存实现高效的矩阵乘结果累加.md"}'),c={name:"guide/算子实践参考/SIMD算子性能优化/矩阵计算/通过L0C-Buffer数据暂存实现高效的矩阵乘结果累加.md"};function t(o,a,r,u,m,d){return n(),p("div",null,[...a[0]||(a[0]=[l('<h1 id="通过l0c-buffer数据暂存实现高效的矩阵乘结果累加" tabindex="-1">通过L0C Buffer数据暂存实现高效的矩阵乘结果累加 <a class="header-anchor" href="#通过l0c-buffer数据暂存实现高效的矩阵乘结果累加" aria-label="Permalink to &quot;通过L0C Buffer数据暂存实现高效的矩阵乘结果累加&quot;">​</a></h1><p>【优先级】高 __</p><p>【描述】算子实现中对矩阵乘的结果进行累加时（比如矩阵A1 * B1 + A2 * B2...结果的累加），可将前一次矩阵乘的结果暂存在CO1（L0C）上，调用Mmad接口实现矩阵乘结果累加。相比于每次矩阵乘的结果从CO1搬运到GM上，再搬运到UB上进行累加计算，可减少数据搬运的次数，提升内存使用效率。</p><p><strong>图 1</strong> 反例数据流图<br><img src="'+e+'" alt="" title="反例数据流图-80"></p><p><strong>图 2</strong> 正例数据流图<br><img src="'+i+`" alt="" title="正例数据流图-81"></p><p>【反例】</p><p>优化前，算子进行2次矩阵乘结果累加的过程如下：</p><ul><li>将前一次矩阵乘的计算结果从CO1搬运到workspace上，再从workspace搬运到UB上；</li><li>下一次矩阵乘计算重复完成上述步骤将结果搬运到UB上；</li><li>在UB上将2次矩阵乘的结果相加。</li></ul><p>当需要累加n次矩阵乘时，分别增加了n次CO1-&gt;workspace、workspace-&gt;UB搬运以及n次Add运算。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>...</span></span>
<span class="line"><span>// 该样例仅做示例说明，非完整代码，省略了部分同步控制代码</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    __aicore__ inline KernelSample()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        aSize = m * k;</span></span>
<span class="line"><span>        bSize = k * n;</span></span>
<span class="line"><span>        cSize = m * n;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void Init(__gm__ uint8_t *a, __gm__ uint8_t *b, __gm__ uint8_t *c)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        aGM.SetGlobalBuffer((__gm__ half *)a);</span></span>
<span class="line"><span>        bGM.SetGlobalBuffer((__gm__ half *)b);</span></span>
<span class="line"><span>        cGM.SetGlobalBuffer((__gm__ float *)c);</span></span>
<span class="line"><span>        pipe.InitBuffer(inQueueA1, 1, aSize * sizeof(half));</span></span>
<span class="line"><span>        pipe.InitBuffer(inQueueA2, 1, aSize * sizeof(half));</span></span>
<span class="line"><span>        pipe.InitBuffer(inQueueB1, 1, bSize * sizeof(half));</span></span>
<span class="line"><span>        pipe.InitBuffer(inQueueB2, 2, bSize * sizeof(half));</span></span>
<span class="line"><span>        pipe.InitBuffer(outQueueCO1, 1, cSize * sizeof(float));</span></span>
<span class="line"><span>        pipe.InitBuffer(inQueueSrc0, 1, cSize * sizeof(float));</span></span>
<span class="line"><span>        pipe.InitBuffer(inQueueSrc1, 1, cSize * sizeof(float));</span></span>
<span class="line"><span>        pipe.InitBuffer(outQueueDst, 1, cSize * sizeof(float));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void Process()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        // 第一次矩阵乘计算</span></span>
<span class="line"><span>        CopyIn();</span></span>
<span class="line"><span>        SplitA();</span></span>
<span class="line"><span>        SplitB();</span></span>
<span class="line"><span>        Compute();</span></span>
<span class="line"><span>        // 将第一次矩阵乘的结果搬出</span></span>
<span class="line"><span>        CopyOut();</span></span>
<span class="line"><span>        // 将第一次矩阵乘的结果搬运到UB</span></span>
<span class="line"><span>        CopyIn1();</span></span>
<span class="line"><span>        // 第二次矩阵乘计算</span></span>
<span class="line"><span>        Compute1();</span></span>
<span class="line"><span>        // 将第一次矩阵乘的结果搬出</span></span>
<span class="line"><span>        CopyOut1();</span></span>
<span class="line"><span>        // 将第二次矩阵乘的结果搬运到UB</span></span>
<span class="line"><span>        CopyIn1();</span></span>
<span class="line"><span>        // 将两次矩阵乘的结果累加</span></span>
<span class="line"><span>        Compute2();</span></span>
<span class="line"><span>        CopyOut2();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>private:</span></span>
<span class="line"><span>    __aicore__ inline void CopyIn()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        LocalTensor&lt;half&gt; a1Local = inQueueA1.AllocTensor&lt;half&gt;();</span></span>
<span class="line"><span>        LocalTensor&lt;half&gt; b1Local = inQueueB1.AllocTensor&lt;half&gt;();</span></span>
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
<span class="line"><span></span></span>
<span class="line"><span>        inQueueA1.EnQue&lt;half&gt;(a1Local);</span></span>
<span class="line"><span>        inQueueB1.EnQue&lt;half&gt;(b1Local);</span></span>
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
<span class="line"><span>        Mmad(c1Local, a2Local, b2Local, mmadParams);</span></span>
<span class="line"><span>        outQueueCO1.EnQue&lt;float&gt;(c1Local);</span></span>
<span class="line"><span>        inQueueA2.EnQue&lt;half&gt;(a2Local);</span></span>
<span class="line"><span>        inQueueB2.EnQue&lt;half&gt;(b2Local);</span></span>
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
<span class="line"><span>        outQueueCO1.EnQue&lt;float&gt;(c1Local);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void CopyIn1()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        LocalTensor&lt;float&gt; src0Local = inQueueSrc0.AllocTensor&lt;float&gt;();</span></span>
<span class="line"><span>        // 将矩阵乘的计算结果从workspace搬运到UB</span></span>
<span class="line"><span>        DataCopy(src0Local, xGm, cSize);</span></span>
<span class="line"><span>        inQueueSrc0.EnQue&lt;float&gt;(src0Local);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void Compute1()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        LocalTensor&lt;half&gt; a2Local = inQueueA2.DeQue&lt;half&gt;();</span></span>
<span class="line"><span>        LocalTensor&lt;half&gt; b2Local = inQueueB2.DeQue&lt;half&gt;();</span></span>
<span class="line"><span>        LocalTensor&lt;float&gt; c1Local = outQueueCO1.DeQue&lt;float&gt;();</span></span>
<span class="line"><span>        MmadParams mmadParams;</span></span>
<span class="line"><span>        mmadParams.m = m;</span></span>
<span class="line"><span>        mmadParams.n = n;</span></span>
<span class="line"><span>        mmadParams.k = k;</span></span>
<span class="line"><span>        // 矩阵乘</span></span>
<span class="line"><span>        Mmad(c1Local, a2Local, b2Local, mmadParams);</span></span>
<span class="line"><span>        outQueueCO1.EnQue&lt;float&gt;(c1Local);</span></span>
<span class="line"><span>        inQueueA2.FreeTensor(a2Local);</span></span>
<span class="line"><span>        inQueueB2.FreeTensor(b2Local);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void CopyOut1()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        LocalTensor&lt;float&gt; c1Local = outQueueCO1.DeQue&lt;float&gt;();</span></span>
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
<span class="line"><span>    __aicore__ inline void CopyIn2()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        PipeBarrier&lt;PIPE_ALL&gt;();</span></span>
<span class="line"><span>        LocalTensor&lt;float&gt; src1Local = inQueueSrc1.AllocTensor&lt;float&gt;();</span></span>
<span class="line"><span>        // 将矩阵乘的计算结果从workspace搬运到UB</span></span>
<span class="line"><span>        DataCopy(src1Local, xGm, cSize);</span></span>
<span class="line"><span>        inQueueSrc1.EnQue&lt;float&gt;(src1Local);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void Compute2()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        LocalTensor&lt;float&gt; src0Local = inQueueSrc0.DeQue&lt;float&gt;();</span></span>
<span class="line"><span>        LocalTensor&lt;float&gt; src1Local = inQueueSrc1.DeQue&lt;float&gt;();</span></span>
<span class="line"><span>        LocalTensor&lt;float&gt; dstLocal = outQueueDst.AllocTensor&lt;float&gt;();</span></span>
<span class="line"><span>        // 两次矩阵乘的结果相加</span></span>
<span class="line"><span>        Add(dstLocal, src0Local, src1Local, cSize);</span></span>
<span class="line"><span>        outQueueDst.EnQue&lt;float&gt;(dstLocal);</span></span>
<span class="line"><span>        inQueueSrc0.FreeTensor(src0Local);</span></span>
<span class="line"><span>        inQueueSrc1.FreeTensor(src1Local);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void CopyOut2()</span></span>
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
<span class="line"><span>    TQue&lt;TPosition::VECIN, 1&gt; inQueueSrc0;</span></span>
<span class="line"><span>    TQue&lt;TPosition::VECIN, 1&gt; inQueueSrc1;</span></span>
<span class="line"><span>    TQue&lt;TPosition::VECOUT, 1&gt; outQueueDst;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    GlobalTensor&lt;half&gt; aGM;</span></span>
<span class="line"><span>    GlobalTensor&lt;half&gt; bGM;</span></span>
<span class="line"><span>    GlobalTensor&lt;float&gt; cGM;</span></span>
<span class="line"><span>    uint16_t m = 32, k = 32, n = 32;</span></span>
<span class="line"><span>    uint16_t aSize, bSize, cSize;  </span></span>
<span class="line"><span>...</span></span></code></pre></div><p>【正例】</p><p>通过优化，算子对矩阵乘结果累加时，可将前一次矩阵乘的结果暂存在L0C上，通过Mmad接口参数cmatrixInitVal和cmatrixSource配置C矩阵的初始值，只调用2次Mmad接口实现2次矩阵乘结果累加。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>...</span></span>
<span class="line"><span>// 该样例仅做示例说明，非完整代码，省略了部分同步控制代码</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    __aicore__ inline KernelSample()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        aSize = m * k;</span></span>
<span class="line"><span>        bSize = k * n;</span></span>
<span class="line"><span>        cSize = m * n;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void Init(__gm__ uint8_t *a, __gm__ uint8_t *b, __gm__ uint8_t *c)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        aGM.SetGlobalBuffer((__gm__ half *)a);</span></span>
<span class="line"><span>        bGM.SetGlobalBuffer((__gm__ half *)b);</span></span>
<span class="line"><span>        cGM.SetGlobalBuffer((__gm__ float *)c);</span></span>
<span class="line"><span>        pipe.InitBuffer(inQueueA1, 1, aSize * sizeof(half));</span></span>
<span class="line"><span>        pipe.InitBuffer(inQueueA2, 1, aSize * sizeof(half));</span></span>
<span class="line"><span>        pipe.InitBuffer(inQueueB1, 1, bSize * sizeof(half));</span></span>
<span class="line"><span>        pipe.InitBuffer(inQueueB2, 2, bSize * sizeof(half));</span></span>
<span class="line"><span>        pipe.InitBuffer(outQueueCO1, 1, cSize * sizeof(float));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void Process()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        CopyIn();</span></span>
<span class="line"><span>        SplitA();</span></span>
<span class="line"><span>        SplitB();</span></span>
<span class="line"><span>        Compute();</span></span>
<span class="line"><span>        CopyOut();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>private:</span></span>
<span class="line"><span>    __aicore__ inline void CopyIn()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        LocalTensor&lt;half&gt; a1Local = inQueueA1.AllocTensor&lt;half&gt;();</span></span>
<span class="line"><span>        LocalTensor&lt;half&gt; b1Local = inQueueB1.AllocTensor&lt;half&gt;();</span></span>
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
<span class="line"><span></span></span>
<span class="line"><span>        inQueueA1.EnQue(a1Local);</span></span>
<span class="line"><span>        inQueueB1.EnQue(b1Local);</span></span>
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
<span class="line"><span>        // 第一次矩阵乘</span></span>
<span class="line"><span>        Mmad(c1Local, a2Local, b2Local, mmadParams);</span></span>
<span class="line"><span>        PipeBarrier&lt;PIPE_M&gt;();</span></span>
<span class="line"><span>        // 第二次矩阵乘累加第一次矩阵乘的结果</span></span>
<span class="line"><span>        mmadParams.cmatrixInitVal = false;</span></span>
<span class="line"><span>        Mmad(c1Local, a2Local, b2Local, c1Local, mmadParams);</span></span>
<span class="line"><span>        outQueueCO1.EnQue&lt;float&gt;(c1Local);</span></span>
<span class="line"><span>        inQueueA2.FreeTensor(a2Local);</span></span>
<span class="line"><span>        inQueueB2.FreeTensor(b2Local);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void CopyOut()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        LocalTensor&lt;float&gt; c1Local = outQueueCO1.DeQue&lt;float&gt;();</span></span>
<span class="line"><span>        FixpipeParamsV220 fixpipeParams;</span></span>
<span class="line"><span>        fixpipeParams.nSize = n;</span></span>
<span class="line"><span>        fixpipeParams.mSize = m;</span></span>
<span class="line"><span>        fixpipeParams.srcStride = m;</span></span>
<span class="line"><span>        fixpipeParams.dstStride = n;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        fixpipeParams.ndNum = 1;</span></span>
<span class="line"><span>        fixpipeParams.srcNdStride = 0;</span></span>
<span class="line"><span>        fixpipeParams.dstNdStride = 0;</span></span>
<span class="line"><span>        Fixpipe(cGM, c1Local, fixpipeParams);</span></span>
<span class="line"><span>        outQueueCO1.FreeTensor(c1Local);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>private:</span></span>
<span class="line"><span>    TPipe pipe;</span></span>
<span class="line"><span>    TQue&lt;TPosition::A1, 1&gt; inQueueA1;</span></span>
<span class="line"><span>    TQue&lt;TPosition::A2, 1&gt; inQueueA2;</span></span>
<span class="line"><span>    TQue&lt;TPosition::B1, 1&gt; inQueueB1;</span></span>
<span class="line"><span>    TQue&lt;TPosition::B2, 1&gt; inQueueB2;</span></span>
<span class="line"><span>    TQue&lt;TPosition::CO1, 1&gt; outQueueCO1;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    GlobalTensor&lt;half&gt; aGM;</span></span>
<span class="line"><span>    GlobalTensor&lt;half&gt; bGM;</span></span>
<span class="line"><span>    GlobalTensor&lt;dst_T&gt; cGM;</span></span>
<span class="line"><span>    uint16_t m = 32, k = 32, n = 32;</span></span>
<span class="line"><span>    uint16_t aSize, bSize, cSize;</span></span></code></pre></div>`,13)])])}const P=s(c,[["render",t]]);export{f as __pageData,P as default};
