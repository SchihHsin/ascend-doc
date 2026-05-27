import{c as s,Q as n,j as p,m as l}from"./chunks/framework.DOi4mjdC.js";const e="/assets/%E5%8F%8D%E4%BE%8B%E5%88%87%E5%88%86%E7%AD%96%E7%95%A5%E5%9B%BE%E7%A4%BA.orZky657.png",m=JSON.parse('{"title":"较小矩阵长驻L1 Buffer，仅分次搬运较大矩阵","description":"","frontmatter":{},"headers":[{"level":1,"title":"较小矩阵长驻L1 Buffer，仅分次搬运较大矩阵","slug":"较小矩阵长驻l1-buffer仅分次搬运较大矩阵"}],"relativePath":"guide/算子实践参考/SIMD算子性能优化/矩阵计算/较小矩阵长驻L1-Buffer-仅分次搬运较大矩阵.md","filePath":"guide/算子实践参考/SIMD算子性能优化/矩阵计算/较小矩阵长驻L1-Buffer-仅分次搬运较大矩阵.md"}'),i={name:"guide/算子实践参考/SIMD算子性能优化/矩阵计算/较小矩阵长驻L1-Buffer-仅分次搬运较大矩阵.md"};function c(t,a,o,r,u,d){return n(),p("div",null,[...a[0]||(a[0]=[l('<h1 id="较小矩阵长驻l1-buffer-仅分次搬运较大矩阵" tabindex="-1">较小矩阵长驻L1 Buffer，仅分次搬运较大矩阵 <a class="header-anchor" href="#较小矩阵长驻l1-buffer-仅分次搬运较大矩阵" aria-label="Permalink to &quot;较小矩阵长驻L1 Buffer，仅分次搬运较大矩阵&quot;">​</a></h1><p>【优先级】高 __</p><p>【描述】在进行cube计算时，当L1无法全载左右矩阵时，可以让较小的矩阵长驻于L1上，只分次搬运较大的矩阵，减少搬运次数。</p><p>【反例】</p><p>假设L1的大小为512K，左矩阵和右矩阵的大小分别为992K、16K，数据类型为half，单次无法将左右矩阵全部载入L1中。开发者规划的切分策略为：不切K轴，将左矩阵平均分成两块A1、A2，shape大小均为[992, 256]；将右矩阵平均分成两块，shape大小均为[256, 16]。计算时的加载顺序如下：先加载A1矩阵至L1，将B1、B2依次加载并计算；然后再加载A2至L1，将B1、B2依次加载并计算。</p><p><strong>图 1</strong> 反例切分策略图示<br><img src="'+e+`" alt="" title="反例切分策略图示"></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>...</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    __aicore__ inline KernelSample()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        aSize = baseM * baseK;</span></span>
<span class="line"><span>        bSize = baseK * baseN;</span></span>
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
<span class="line"><span>        for (uint32_t i = 0; i &lt; 2; i++) {</span></span>
<span class="line"><span>            CopyInA1(i);</span></span>
<span class="line"><span>            SplitA();</span></span>
<span class="line"><span>            for (uint32_t j = 0; j &lt; 2; j++) {</span></span>
<span class="line"><span>                CopyInB1(j);</span></span>
<span class="line"><span>                SplitB();</span></span>
<span class="line"><span>                Compute(i, j);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        CopyOut();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>private:</span></span>
<span class="line"><span>    __aicore__ inline void CopyInA1(uint32_t i)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        LocalTensor&lt;half&gt; a1Local = inQueueA1.AllocTensor&lt;half&gt;();</span></span>
<span class="line"><span>        // 左矩阵a1/a2分块载入A1</span></span>
<span class="line"><span>        Nd2NzParams dataCopyA1Params;</span></span>
<span class="line"><span>        dataCopyA1Params.ndNum = 1;</span></span>
<span class="line"><span>        dataCopyA1Params.nValue = baseM;</span></span>
<span class="line"><span>        dataCopyA1Params.dValue = baseK;</span></span>
<span class="line"><span>        dataCopyA1Params.srcNdMatrixStride = 0;</span></span>
<span class="line"><span>        dataCopyA1Params.srcDValue = baseK;</span></span>
<span class="line"><span>        dataCopyA1Params.dstNzC0Stride = baseM;</span></span>
<span class="line"><span>        dataCopyA1Params.dstNzNStride = 1;</span></span>
<span class="line"><span>        dataCopyA1Params.dstNzMatrixStride = 0;</span></span>
<span class="line"><span>        DataCopy(a1Local, aGM[i * baseM * baseK], dataCopyA1Params);</span></span>
<span class="line"><span>        inQueueA1.EnQue(a1Local);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void SplitA()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        LocalTensor&lt;half&gt; a1Local = inQueueA1.DeQue&lt;half&gt;();</span></span>
<span class="line"><span>        LocalTensor&lt;half&gt; a2Local = inQueueA2.AllocTensor&lt;half&gt;();</span></span>
<span class="line"><span>        // 左矩阵a1/a2分块从A1-&gt;A2</span></span>
<span class="line"><span>        LoadData2dParams loadL0AParams;</span></span>
<span class="line"><span>        loadL0AParams.repeatTimes = baseM * baseK * sizeof(half) / 512;</span></span>
<span class="line"><span>        loadL0AParams.srcStride = 1;</span></span>
<span class="line"><span>        loadL0AParams.dstGap = 0;</span></span>
<span class="line"><span>        LoadData(a2Local, a1Local, loadL0AParams);</span></span>
<span class="line"><span>        inQueueA2.EnQue(a2Local);</span></span>
<span class="line"><span>        inQueueA1.FreeTensor(a1Local);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void CopyInB1(uint32_t j)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        LocalTensor&lt;half&gt; b1Local = inQueueB1.AllocTensor&lt;half&gt;();</span></span>
<span class="line"><span>        // 右矩阵分块b1/b2载入B1</span></span>
<span class="line"><span>        Nd2NzParams dataCopyB1Params;</span></span>
<span class="line"><span>        dataCopyB1Params.ndNum = 1;</span></span>
<span class="line"><span>        dataCopyB1Params.nValue = baseK;</span></span>
<span class="line"><span>        dataCopyB1Params.dValue = baseN;</span></span>
<span class="line"><span>        dataCopyB1Params.srcNdMatrixStride = 0;</span></span>
<span class="line"><span>        dataCopyB1Params.srcDValue = n;</span></span>
<span class="line"><span>        dataCopyB1Params.dstNzC0Stride = baseK;</span></span>
<span class="line"><span>        dataCopyB1Params.dstNzNStride = 1;</span></span>
<span class="line"><span>        dataCopyB1Params.dstNzMatrixStride = 0;</span></span>
<span class="line"><span>        DataCopy(b1Local, bGM[j * baseN], dataCopyB1Params);</span></span>
<span class="line"><span>        inQueueB1.EnQue(b1Local);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void SplitB()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        LocalTensor&lt;half&gt; b1Local = inQueueB1.DeQue&lt;half&gt;();</span></span>
<span class="line"><span>        LocalTensor&lt;half&gt; b2Local = inQueueB2.AllocTensor&lt;half&gt;();</span></span>
<span class="line"><span>        // 右矩阵分块b1/b2从B1-&gt;B2</span></span>
<span class="line"><span>        LoadData2dTransposeParams loadL0BParams;</span></span>
<span class="line"><span>        loadL0BParams.startIndex = 0;</span></span>
<span class="line"><span>        loadL0BParams.repeatTimes = baseK / nBlockSize;</span></span>
<span class="line"><span>        loadL0BParams.srcStride = 1;</span></span>
<span class="line"><span>        loadL0BParams.dstGap = 1;</span></span>
<span class="line"><span>        LoadDataWithTranspose(b2Local, b1Local, loadL0BParams);</span></span>
<span class="line"><span>        inQueueB2.EnQue(b2Local);</span></span>
<span class="line"><span>        inQueueB1.FreeTensor(b1Local);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void Compute(uint32_t i, uint32_t j)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        LocalTensor&lt;half&gt; a2Local = inQueueA2.DeQue&lt;half&gt;();</span></span>
<span class="line"><span>        LocalTensor&lt;half&gt; b2Local = inQueueB2.DeQue&lt;half&gt;();</span></span>
<span class="line"><span>        LocalTensor&lt;float&gt; c1Local = outQueueCO1.AllocTensor&lt;float&gt;();</span></span>
<span class="line"><span>        // 矩阵乘</span></span>
<span class="line"><span>        mmadParams.m = baseM;</span></span>
<span class="line"><span>        mmadParams.n = baseN;</span></span>
<span class="line"><span>        mmadParams.k = baseK;</span></span>
<span class="line"><span>        Mmad(c1Local[i * baseM * baseN + j * m * baseN], a2Local, b2Local, mmadParams);</span></span>
<span class="line"><span>        outQueueCO1.EnQue&lt;float&gt;(c1Local);</span></span>
<span class="line"><span>        inQueueA2.FreeTensor(a2Local);</span></span>
<span class="line"><span>        inQueueB2.FreeTensor(b2Local);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void CopyOut()</span></span>
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
<span class="line"><span></span></span>
<span class="line"><span>    GlobalTensor&lt;half&gt; aGM;</span></span>
<span class="line"><span>    GlobalTensor&lt;half&gt; bGM;</span></span>
<span class="line"><span>    GlobalTensor&lt;float&gt; cGM;</span></span>
<span class="line"><span>    uint16_t m = 1984, k = 256, n = 32;</span></span>
<span class="line"><span>    uint16_t baseM = 992, baseK = 256, baseN = 16;</span></span>
<span class="line"><span>    uint16_t aSize, bSize, cSize;</span></span>
<span class="line"><span>    uint16_t nBlockSize = 16;</span></span>
<span class="line"><span>...</span></span></code></pre></div><p>【正例】</p><p>该示例中，将较小的右矩阵一次性搬入L1并长存于L1上，循环内不断搬运A矩阵，当循环次数为2时，共需要3次搬运。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>...</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    __aicore__ inline KernelSample()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        aSize = baseM * baseK;</span></span>
<span class="line"><span>        bSize = baseK * n;</span></span>
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
<span class="line"><span>        CopyInB1();</span></span>
<span class="line"><span>        SplitB();</span></span>
<span class="line"><span>        for (uint32_t i = 0; i &lt; 2; i++) {</span></span>
<span class="line"><span>            CopyInA1(i);</span></span>
<span class="line"><span>            SplitA();</span></span>
<span class="line"><span>            for (uint32_t j = 0; j &lt; 2; j++) {</span></span>
<span class="line"><span>                Compute(i, j);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        CopyOut();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>private:</span></span>
<span class="line"><span>    __aicore__ inline void CopyInB1()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        LocalTensor&lt;half&gt; b1Local = inQueueB1.AllocTensor&lt;half&gt;();</span></span>
<span class="line"><span>        // 右矩阵全载入B1</span></span>
<span class="line"><span>        Nd2NzParams dataCopyB1Params;</span></span>
<span class="line"><span>        dataCopyB1Params.ndNum = 1;</span></span>
<span class="line"><span>        dataCopyB1Params.nValue = baseK;</span></span>
<span class="line"><span>        dataCopyB1Params.dValue = n;</span></span>
<span class="line"><span>        dataCopyB1Params.srcNdMatrixStride = 0;</span></span>
<span class="line"><span>        dataCopyB1Params.srcDValue = n;</span></span>
<span class="line"><span>        dataCopyB1Params.dstNzC0Stride = baseK;</span></span>
<span class="line"><span>        dataCopyB1Params.dstNzNStride = 1;</span></span>
<span class="line"><span>        dataCopyB1Params.dstNzMatrixStride = 0;</span></span>
<span class="line"><span>        DataCopy(b1Local, bGM, dataCopyB1Params);</span></span>
<span class="line"><span>        inQueueB1.EnQue(b1Local);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void SplitB()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        LocalTensor&lt;half&gt; b1Local = inQueueB1.DeQue&lt;half&gt;();</span></span>
<span class="line"><span>        LocalTensor&lt;half&gt; b2Local = inQueueB2.AllocTensor&lt;half&gt;();</span></span>
<span class="line"><span>        // 右矩阵全部从B1-&gt;B2</span></span>
<span class="line"><span>        LoadData2dTransposeParams loadL0BParams;</span></span>
<span class="line"><span>        loadL0BParams.startIndex = 0;</span></span>
<span class="line"><span>        loadL0BParams.repeatTimes = baseK / nBlockSize;</span></span>
<span class="line"><span>        loadL0BParams.srcStride = 1;</span></span>
<span class="line"><span>        loadL0BParams.dstGap = 1;</span></span>
<span class="line"><span>        for (int blockNum = 0; blockNum &lt; (n / nBlockSize); blockNum++) {</span></span>
<span class="line"><span>            LoadDataWithTranspose(b2Local[blockNum * 16 * nBlockSize], b1Local[blockNum * baseK * nBlockSize], loadL0BParams);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        inQueueB2.EnQue(b2Local);</span></span>
<span class="line"><span>        inQueueB1.FreeTensor(b1Local);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void CopyInA1(uint32_t i)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        LocalTensor&lt;half&gt; a1Local = inQueueA1.AllocTensor&lt;half&gt;();</span></span>
<span class="line"><span>        // 左矩阵a1/a2分块载入A1</span></span>
<span class="line"><span>        Nd2NzParams dataCopyA1Params;</span></span>
<span class="line"><span>        dataCopyA1Params.ndNum = 1;</span></span>
<span class="line"><span>        dataCopyA1Params.nValue = baseM;</span></span>
<span class="line"><span>        dataCopyA1Params.dValue = baseK;</span></span>
<span class="line"><span>        dataCopyA1Params.srcNdMatrixStride = 0;</span></span>
<span class="line"><span>        dataCopyA1Params.srcDValue = baseK;</span></span>
<span class="line"><span>        dataCopyA1Params.dstNzC0Stride = baseM;</span></span>
<span class="line"><span>        dataCopyA1Params.dstNzNStride = 1;</span></span>
<span class="line"><span>        dataCopyA1Params.dstNzMatrixStride = 0;</span></span>
<span class="line"><span>        DataCopy(a1Local, aGM[i * baseM * baseK], dataCopyA1Params);</span></span>
<span class="line"><span>        inQueueA1.EnQue(a1Local);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void SplitA()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        LocalTensor&lt;half&gt; a1Local = inQueueA1.DeQue&lt;half&gt;();</span></span>
<span class="line"><span>        LocalTensor&lt;half&gt; a2Local = inQueueA2.AllocTensor&lt;half&gt;();</span></span>
<span class="line"><span>        // 左矩阵a1/a2分块从A1-&gt;A2</span></span>
<span class="line"><span>        LoadData2dParams loadL0AParams;</span></span>
<span class="line"><span>        loadL0AParams.repeatTimes = baseM * baseK * sizeof(half) / 512;</span></span>
<span class="line"><span>        loadL0AParams.srcStride = 1;</span></span>
<span class="line"><span>        loadL0AParams.dstGap = 0;</span></span>
<span class="line"><span>        LoadData(a2Local, a1Local, loadL0AParams);</span></span>
<span class="line"><span>        inQueueA2.EnQue(a2Local);</span></span>
<span class="line"><span>        inQueueA1.FreeTensor(a1Local);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void Compute(uint32_t i, uint32_t j)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        LocalTensor&lt;half&gt; a2Local = inQueueA2.DeQue&lt;half&gt;();</span></span>
<span class="line"><span>        LocalTensor&lt;half&gt; b2Local = inQueueB2.DeQue&lt;half&gt;();</span></span>
<span class="line"><span>        LocalTensor&lt;float&gt; c1Local = outQueueCO1.AllocTensor&lt;float&gt;();</span></span>
<span class="line"><span>        // 矩阵乘</span></span>
<span class="line"><span>        mmadParams.m = baseM;</span></span>
<span class="line"><span>        mmadParams.n = baseN;</span></span>
<span class="line"><span>        mmadParams.k = baseK;</span></span>
<span class="line"><span>        Mmad(c1Local[i * baseM * baseN + j * m * baseN], a2Local, b2Local, mmadParams);</span></span>
<span class="line"><span>        outQueueCO1.EnQue&lt;float&gt;(c1Local);</span></span>
<span class="line"><span>        inQueueA2.FreeTensor(a2Local);</span></span>
<span class="line"><span>        inQueueB2.FreeTensor(b2Local);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void CopyOut()</span></span>
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
<span class="line"><span></span></span>
<span class="line"><span>    GlobalTensor&lt;half&gt; aGM;</span></span>
<span class="line"><span>    GlobalTensor&lt;half&gt; bGM;</span></span>
<span class="line"><span>    GlobalTensor&lt;float&gt; cGM;</span></span>
<span class="line"><span>    uint16_t m = 1984, k = 256, n = 32;</span></span>
<span class="line"><span>    uint16_t baseM = 992, baseK = 256, baseN = 16;</span></span>
<span class="line"><span>    uint16_t aSize, bSize, cSize;</span></span>
<span class="line"><span>    uint16_t nBlockSize = 16;</span></span>
<span class="line"><span>...</span></span></code></pre></div>`,10)])])}const f=s(i,[["render",c]]);export{m as __pageData,f as default};
