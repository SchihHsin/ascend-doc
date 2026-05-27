import{c as s,Q as a,j as p,m as e}from"./chunks/framework.DOi4mjdC.js";const u=JSON.parse('{"title":"更多样例","description":"","frontmatter":{},"headers":[{"level":1,"title":"更多样例","slug":"更多样例"}],"relativePath":"api/SIMD-API/基础数据结构/TensorTrait/更多样例.md","filePath":"api/SIMD-API/基础数据结构/TensorTrait/更多样例.md"}'),l={name:"api/SIMD-API/基础数据结构/TensorTrait/更多样例.md"};function i(t,n,c,o,r,_){return a(),p("div",null,[...n[0]||(n[0]=[e(`<h1 id="更多样例" tabindex="-1">更多样例 <a class="header-anchor" href="#更多样例" aria-label="Permalink to &quot;更多样例&quot;">​</a></h1><ul><li><p>矢量计算基础API使用TensorTrait样例</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &quot;kernel_operator.h&quot;</span></span>
<span class="line"><span>class KernelBinaryScalarTrait {</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    __aicore__ inline KernelBinaryScalarTrait() {}</span></span>
<span class="line"><span>    __aicore__ inline void Init(__gm__ uint8_t* src, __gm__ uint8_t* dstGm)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        srcGlobal.SetGlobalBuffer((__gm__ int16_t*)src);</span></span>
<span class="line"><span>        dstGlobal.SetGlobalBuffer((__gm__ int16_t*)dstGm);</span></span>
<span class="line"><span>        pipe.InitBuffer(inQueueSrc, 1, 512 * sizeof(int16_t));</span></span>
<span class="line"><span>        pipe.InitBuffer(outQueueDst, 1, 512 * sizeof(int16_t));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void Process()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        CopyIn();</span></span>
<span class="line"><span>        Compute();</span></span>
<span class="line"><span>        CopyOut();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>private:</span></span>
<span class="line"><span>    __aicore__ inline void CopyIn()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;AscendC::TensorTrait&lt;int16_t&gt;&gt; srcLocal = inQueueSrc.AllocTensor&lt;AscendC::TensorTrait&lt;int16_t&gt;&gt;();</span></span>
<span class="line"><span>        AscendC::DataCopy(srcLocal, srcGlobal, 512);</span></span>
<span class="line"><span>        inQueueSrc.EnQue(srcLocal);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void Compute()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;AscendC::TensorTrait&lt;int16_t&gt;&gt; srcLocal = inQueueSrc.DeQue&lt;AscendC::TensorTrait&lt;int16_t&gt;&gt;();</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;AscendC::TensorTrait&lt;int16_t&gt;&gt; dstLocal = outQueueDst.AllocTensor&lt;AscendC::TensorTrait&lt;int16_t&gt;&gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        uint64_t mask = 128;</span></span>
<span class="line"><span>        int16_t scalar = 2;</span></span>
<span class="line"><span>        // repeatTime = 4, 128 elements one repeat, 512 elements total</span></span>
<span class="line"><span>       // dstBlkStride, srcBlkStride = 1, no gap between blocks in one repeat</span></span>
<span class="line"><span>       // dstRepStride, srcRepStride =8, no gap between repeats</span></span>
<span class="line"><span>        AscendC::Adds(dstLocal, srcLocal, scalar, mask, 4, {1, 1, 8, 8});</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        outQueueDst.EnQue(dstLocal);</span></span>
<span class="line"><span>        inQueueSrc.FreeTensor(srcLocal);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void CopyOut()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;AscendC::TensorTrait&lt;int16_t&gt;&gt; dstLocal = outQueueDst.DeQue&lt;AscendC::TensorTrait&lt;int16_t&gt;&gt;();</span></span>
<span class="line"><span>        AscendC::DataCopy(dstGlobal, dstLocal, 512);</span></span>
<span class="line"><span>        outQueueDst.FreeTensor(dstLocal);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>private:</span></span>
<span class="line"><span>    AscendC::TPipe pipe;</span></span>
<span class="line"><span>    AscendC::TQue&lt;AscendC::TPosition::VECIN, 1&gt; inQueueSrc;</span></span>
<span class="line"><span>    AscendC::TQue&lt;AscendC::TPosition::VECOUT, 1&gt; outQueueDst;</span></span>
<span class="line"><span>    AscendC::GlobalTensor&lt;AscendC::TensorTrait&lt;int16_t&gt;&gt; srcGlobal, dstGlobal;</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span>extern &quot;C&quot; __global__ __aicore__ void binary_scalar_trait_kernel(__gm__ uint8_t* src, __gm__ uint8_t* dstGm)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    KernelBinaryScalarTrait op;</span></span>
<span class="line"><span>    op.Init(src, dstGm);</span></span>
<span class="line"><span>    op.Process();</span></span>
<span class="line"><span>}</span></span></code></pre></div></li><li><p>矩阵计算基础API使用TensorTrait样例</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &quot;kernel_operator.h&quot;</span></span>
<span class="line"><span>template &lt;typename dst_T, typename fmap_T, typename weight_T, typename dstCO1_T, typename bias_T&gt; class KernelMatmul {</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    __aicore__ inline KernelMatmul(uint16_t mIn, uint8_t kIn, uint8_t nIn, bool initl1In, bool initl0In)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        m = mIn;</span></span>
<span class="line"><span>        k = kIn;</span></span>
<span class="line"><span>        n = nIn;</span></span>
<span class="line"><span>        aSize = m * k;</span></span>
<span class="line"><span>        bSize = k * n;</span></span>
<span class="line"><span>        cSize = m * n;</span></span>
<span class="line"><span>        initl0 = initl0In;</span></span>
<span class="line"><span>        initl1 = initl1In;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void Init(__gm__ uint8_t *a, __gm__ uint8_t *b, __gm__ uint8_t *c)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        aGM.SetGlobalBuffer((__gm__ fmap_T *)a);</span></span>
<span class="line"><span>        bGM.SetGlobalBuffer((__gm__ weight_T *)b);</span></span>
<span class="line"><span>        cGM.SetGlobalBuffer((__gm__ dstCO1_T *)c);</span></span>
<span class="line"><span>        pipe.InitBuffer(inQueueA1, 1, aSize * sizeof(fmap_T));</span></span>
<span class="line"><span>        pipe.InitBuffer(inQueueA2, 1, aSize * sizeof(fmap_T));</span></span>
<span class="line"><span>        pipe.InitBuffer(inQueueB1, 1, bSize * sizeof(weight_T));</span></span>
<span class="line"><span>        pipe.InitBuffer(inQueueB2, 2, bSize * sizeof(weight_T));</span></span>
<span class="line"><span>        pipe.InitBuffer(outQueueCO1, 1, cSize * sizeof(dstCO1_T));</span></span>
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
<span class="line"><span>        AscendC::LocalTensor&lt;AscendC::TensorTrait&lt;fmap_T&gt;&gt; a1Local = inQueueA1.AllocTensor&lt;AscendC::TensorTrait&lt;fmap_T&gt;&gt;();</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;AscendC::TensorTrait&lt;weight_T&gt;&gt; b1Local = inQueueB1.AllocTensor&lt;AscendC::TensorTrait&lt;weight_T&gt;&gt;();</span></span>
<span class="line"><span>        if(initl1 == true) {</span></span>
<span class="line"><span>            AscendC::Fill(a1Local, {static_cast&lt;uint16_t&gt;(m * k * sizeof(fmap_T) / 32), 1, 0, 1});</span></span>
<span class="line"><span>            AscendC::Fill(b1Local, {static_cast&lt;uint16_t&gt;(k * n * sizeof(weight_T) / 32), 1, 0, 1});</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            AscendC::DataCopy(a1Local, aGM, aSize);</span></span>
<span class="line"><span>            AscendC::DataCopy(b1Local, bGM, bSize);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        inQueueA1.EnQue(a1Local);</span></span>
<span class="line"><span>        inQueueB1.EnQue(b1Local);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void SplitA()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;AscendC::TensorTrait&lt;fmap_T&gt;&gt; a1Local = inQueueA1.DeQue&lt;AscendC::TensorTrait&lt;fmap_T&gt;&gt;();</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;AscendC::TensorTrait&lt;fmap_T&gt;&gt; a2Local = inQueueA2.AllocTensor&lt;AscendC::TensorTrait&lt;fmap_T&gt;&gt;();</span></span>
<span class="line"><span>        // 1、load2d L1-&gt;L0A</span></span>
<span class="line"><span>        AscendC::LoadData2dParams loadL0AParams;</span></span>
<span class="line"><span>        loadL0AParams.repeatTimes = m * k * sizeof(fmap_T) / 512;</span></span>
<span class="line"><span>        loadL0AParams.srcStride = 1;</span></span>
<span class="line"><span>        loadL0AParams.dstGap = 0;</span></span>
<span class="line"><span>        if (initl0 == true) {</span></span>
<span class="line"><span>            Fill(a2Local, {static_cast&lt;uint16_t&gt;(m * k * sizeof(fmap_T) / 512), 1, 0, 1});</span></span>
<span class="line"><span>        } else{</span></span>
<span class="line"><span>            LoadData(a2Local, a1Local, loadL0AParams);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        inQueueA2.EnQue&lt;AscendC::TensorTrait&lt;fmap_T&gt;&gt;(a2Local);</span></span>
<span class="line"><span>        inQueueA1.FreeTensor(a1Local);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void SplitB()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;AscendC::TensorTrait&lt;weight_T&gt;&gt; b1Local = inQueueB1.DeQue&lt;AscendC::TensorTrait&lt;weight_T&gt;&gt;();</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;AscendC::TensorTrait&lt;weight_T&gt;&gt; b2Local = inQueueB2.AllocTensor&lt;AscendC::TensorTrait&lt;weight_T&gt;&gt;();</span></span>
<span class="line"><span>        // 2、load2d L1-&gt;L0B</span></span>
<span class="line"><span>        AscendC::LoadData2dParams loadL0BParams;</span></span>
<span class="line"><span>        loadL0BParams.repeatTimes = k * n * sizeof(weight_T) / 512;</span></span>
<span class="line"><span>        loadL0BParams.srcStride = 1;</span></span>
<span class="line"><span>        loadL0BParams.dstGap = 0;</span></span>
<span class="line"><span>        if (initl0 == true) {</span></span>
<span class="line"><span>            AscendC::Fill(b2Local, {static_cast&lt;uint16_t&gt;(k * n * sizeof(weight_T) / 512), 1, 0, 1});</span></span>
<span class="line"><span>        } else{</span></span>
<span class="line"><span>            AscendC::LoadData(b2Local, b1Local, loadL0BParams);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        inQueueB1.FreeTensor(b1Local);</span></span>
<span class="line"><span>        inQueueB2.EnQue&lt;AscendC::TensorTrait&lt;weight_T&gt;&gt;(b2Local);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void Compute()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;AscendC::TensorTrait&lt;fmap_T&gt;&gt; a2Local = inQueueA2.DeQue&lt;AscendC::TensorTrait&lt;fmap_T&gt;&gt;();</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;AscendC::TensorTrait&lt;weight_T&gt;&gt; b2Local = inQueueB2.DeQue&lt;AscendC::TensorTrait&lt;weight_T&gt;&gt;();</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;AscendC::TensorTrait&lt;dstCO1_T&gt;&gt; c1Local = outQueueCO1.AllocTensor&lt;AscendC::TensorTrait&lt;dstCO1_T&gt;&gt;();</span></span>
<span class="line"><span>        mmadParams.isBias = false;</span></span>
<span class="line"><span>        mmadParams.m = m;</span></span>
<span class="line"><span>        mmadParams.n = n;</span></span>
<span class="line"><span>        mmadParams.k = k;</span></span>
<span class="line"><span>        AscendC::Mmad(c1Local, a2Local, b2Local, mmadParams); // m*n</span></span>
<span class="line"><span>        outQueueCO1.EnQue&lt;AscendC::TensorTrait&lt;dstCO1_T&gt;&gt;(c1Local);</span></span>
<span class="line"><span>        inQueueA2.FreeTensor(a2Local);</span></span>
<span class="line"><span>        inQueueB2.FreeTensor(b2Local);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>#if __NPU_ARCH__ &lt;= 2002</span></span>
<span class="line"><span>    __aicore__ inline void CopyOut()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;AscendC::TensorTrait&lt;dstCO1_T&gt;&gt; c1Local = outQueueCO1.DeQue&lt;AscendC::TensorTrait&lt;dstCO1_T&gt;&gt;();</span></span>
<span class="line"><span>        uint16_t M_ = Ceil(m, 16) * 16;</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;AscendC::TensorTrait&lt;dst_T&gt;&gt; ublocal;</span></span>
<span class="line"><span>        AscendC::TBuffAddr tbufublocal;</span></span>
<span class="line"><span>        tbufublocal.logicPos = (uint8_t)AscendC::TPosition::C1;</span></span>
<span class="line"><span>        ublocal.SetAddr(tbufublocal);</span></span>
<span class="line"><span>        ublocal.InitBuffer(0, M_ * n);</span></span>
<span class="line"><span>        DataCopyParams dataCopyParams;</span></span>
<span class="line"><span>        dataCopyParams.blockCount = 1;</span></span>
<span class="line"><span>        dataCopyParams.blockLen = Ceil(M_ * n * 4, 1024);</span></span>
<span class="line"><span>        DataCopyEnhancedParams enhancedParams;</span></span>
<span class="line"><span>        enhancedParams.blockMode = AscendC::BlockMode::BLOCK_MODE_MATRIX;</span></span>
<span class="line"><span>        AscendC::DataCopy(ublocal, c1Local, dataCopyParams, enhancedParams);</span></span>
<span class="line"><span>        PipeBarrier&lt;PIPE_ALL&gt;();</span></span>
<span class="line"><span>        outQueueCO1.FreeTensor(c1Local);</span></span>
<span class="line"><span>        dataCopyParams.blockCount = 1;</span></span>
<span class="line"><span>        dataCopyParams.blockLen = m * n *sizeof(dstCO1_T) / ONE_BLK_SIZE;</span></span>
<span class="line"><span>        dataCopyParams.srcStride = 0;</span></span>
<span class="line"><span>        dataCopyParams.dstStride = 0;</span></span>
<span class="line"><span>        AscendC::DataCopy(cGM, ublocal, dataCopyParams);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>#else</span></span>
<span class="line"><span>    __aicore__ inline void CopyOut()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;AscendC::TensorTrait&lt;dstCO1_T&gt;&gt; c1Local = outQueueCO1.DeQue&lt;AscendC::TensorTrait&lt;dstCO1_T&gt;&gt;();</span></span>
<span class="line"><span>        AscendC::FixpipeParamsV220 fixpipeParams;</span></span>
<span class="line"><span>        fixpipeParams.nSize = n;</span></span>
<span class="line"><span>        fixpipeParams.mSize = m;</span></span>
<span class="line"><span>        fixpipeParams.srcStride = m;</span></span>
<span class="line"><span>        fixpipeParams.dstStride = n;</span></span>
<span class="line"><span>        fixpipeParams.ndNum = 1;</span></span>
<span class="line"><span>        fixpipeParams.srcNdStride = 0;</span></span>
<span class="line"><span>        fixpipeParams.dstNdStride = 0;</span></span>
<span class="line"><span>        AscendC::Fixpipe(cGM, c1Local, fixpipeParams);</span></span>
<span class="line"><span>        outQueueCO1.FreeTensor(c1Local);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span>private:</span></span>
<span class="line"><span>    AscendC::TPipe pipe;</span></span>
<span class="line"><span>    AscendC::TQue&lt;AscendC::TPosition::A1, 1&gt; inQueueA1;</span></span>
<span class="line"><span>    AscendC::TQue&lt;AscendC::TPosition::A2, 1&gt; inQueueA2;</span></span>
<span class="line"><span>    AscendC::TQue&lt;AscendC::TPosition::B1, 1&gt; inQueueB1;</span></span>
<span class="line"><span>    AscendC::TQue&lt;AscendC::TPosition::B2, 1&gt; inQueueB2;</span></span>
<span class="line"><span>    // dst queue</span></span>
<span class="line"><span>    AscendC::TQue&lt;AscendC::TPosition::CO1, 1&gt; outQueueCO1;</span></span>
<span class="line"><span>    AscendC::GlobalTensor&lt;AscendC::TensorTrait&lt;fmap_T&gt;&gt; aGM;</span></span>
<span class="line"><span>    AscendC::GlobalTensor&lt;AscendC::TensorTrait&lt;weight_T&gt;&gt; bGM;</span></span>
<span class="line"><span>    AscendC::GlobalTensor&lt;AscendC::TensorTrait&lt;dst_T&gt;&gt; cGM;</span></span>
<span class="line"><span>    uint16_t m, k, n;</span></span>
<span class="line"><span>    bool initl0, initl1;</span></span>
<span class="line"><span>    uint16_t aSize, bSize, cSize, b2Size;</span></span>
<span class="line"><span>    AscendC::MmadParams mmadParams;</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span>extern &quot;C&quot; __global__ __aicore__ void cube_initconstvalue_simple_operator_half_16_32_16_true_false(</span></span>
<span class="line"><span>    __gm__ uint8_t *a, __gm__ uint8_t *b, __gm__ uint8_t *c)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    if ASCEND_IS_AIV {</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    KernelMatmul&lt;float, half, half, float, half&gt; op(16, 32, 16, true, false);</span></span>
<span class="line"><span>    op.Init(a, b, c);</span></span>
<span class="line"><span>    op.Process();</span></span>
<span class="line"><span>}</span></span></code></pre></div></li></ul>`,2)])])}const T=s(l,[["render",i]]);export{u as __pageData,T as default};
