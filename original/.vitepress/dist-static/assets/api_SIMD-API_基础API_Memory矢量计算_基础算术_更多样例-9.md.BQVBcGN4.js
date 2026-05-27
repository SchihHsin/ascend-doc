import{c as n,Q as a,j as p,m as e}from"./chunks/framework.DOi4mjdC.js";const g=JSON.parse('{"title":"更多样例","description":"","frontmatter":{},"headers":[{"level":1,"title":"更多样例","slug":"更多样例"}],"relativePath":"api/SIMD-API/基础API/Memory矢量计算/基础算术/更多样例-9.md","filePath":"api/SIMD-API/基础API/Memory矢量计算/基础算术/更多样例-9.md"}'),l={name:"api/SIMD-API/基础API/Memory矢量计算/基础算术/更多样例-9.md"};function i(t,s,c,o,d,r){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="更多样例" tabindex="-1">更多样例 <a class="header-anchor" href="#更多样例" aria-label="Permalink to &quot;更多样例&quot;">​</a></h1><ul><li><p>通过tensor高维切分计算接口中的mask连续模式，实现数据非连续计算。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>uint64_t mask = 64;  // 每个迭代内只计算前64个数</span></span>
<span class="line"><span>AscendC::Add(dstLocal, src0Local, src1Local, mask, 4, { 1, 1, 1, 8, 8, 8 });</span></span></code></pre></div><p>结果示例如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>输入数据src0Local：[1 2 3 ... 512]</span></span>
<span class="line"><span>输入数据src1Local：[513 514 515 ... 1024]</span></span>
<span class="line"><span>输出数据dstLocal：</span></span>
<span class="line"><span>[514 516 518 ... 640 undefined ... undefined</span></span>
<span class="line"><span> 770 772 774 ... 896 undefined ... undefined</span></span>
<span class="line"><span> 1026 1028 1030 ... 1152 undefined ... undefined</span></span>
<span class="line"><span> 1282 1284 1286 ... 1408 undefined ... undefined]</span></span></code></pre></div></li><li><p>通过tensor高维切分计算接口中的mask逐比特模式，实现数据非连续计算。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>uint64_t mask[2] = { UINT64_MAX, 0 };  // mask[0]满，mask[1]空，每次只计算前64个数</span></span>
<span class="line"><span>AscendC::Add(dstLocal, src0Local, src1Local, mask, 4, { 1, 1, 1, 8, 8, 8 });</span></span></code></pre></div><p>结果示例如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>输入数据src0Local：[1 2 3 ... 512]</span></span>
<span class="line"><span>输入数据src1Local：[513 514 515 ... 1024]</span></span>
<span class="line"><span>输出数据dstLocal：</span></span>
<span class="line"><span>[514 516 518 ... 640 undefined ... undefined</span></span>
<span class="line"><span> 770 772 774 ... 896 undefined ... undefined</span></span>
<span class="line"><span> 1026 1028 1030 ... 1152 undefined ... undefined</span></span>
<span class="line"><span> 1282 1284 1286 ... 1408 undefined ... undefined]</span></span></code></pre></div></li><li><p>通过控制tensor高维切分计算接口的Repeat Stride参数，实现数据非连续计算。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>uint64_t mask = 128;</span></span>
<span class="line"><span>// repeatTime设置为2，表示一共需要进行2次迭代</span></span>
<span class="line"><span>// src0BlkStride, src1BlkStride设置为1，表示每个迭代内src0参与计算的数据地址间隔为1个DataBlock</span></span>
<span class="line"><span>// src0RepStride设置为16, 表示相邻迭代之间src0起始地址间隔为16个datablock</span></span>
<span class="line"><span>AscendC::Add(dstLocal, src0Local, src1Local, mask, 2, { 1, 1, 1, 8, 16, 8 });</span></span></code></pre></div><p>结果示例如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>输入数据src0Local：[1 2 3 ... 512]</span></span>
<span class="line"><span>输入数据src1Local：[513 514 515 ... 1024]</span></span>
<span class="line"><span>输出数据dstLocal：</span></span>
<span class="line"><span>[514 516 518 ...768 898 900 902 ... 1150 1152 undefined ... undefined]</span></span></code></pre></div></li><li><p>通过控制tensor高维切分计算接口的DataBlock Stride和Repeat Stride参数，实现数据非连续计算。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>uint64_t mask = 128;</span></span>
<span class="line"><span>// repeatTime设置为2，表示一共需要进行2次迭代</span></span>
<span class="line"><span>// src0BlkStride设置为2，表示每个迭代内src0参与计算的数据地址间隔为2个datablock</span></span>
<span class="line"><span>// src0RepStride设置为16, 表示相邻迭代之间src0起始地址间隔为16个datablock</span></span>
<span class="line"><span>AscendC::Add(dstLocal, src0Local, src1Local, mask, 2, { 1, 2, 1, 8, 16, 8 });</span></span></code></pre></div><p>结果示例如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>输入数据src0Local：[1 2 3 ... 512]</span></span>
<span class="line"><span>输入数据src1Local：[513 514 515 ... 1024]</span></span>
<span class="line"><span>输出数据dstLocal：</span></span>
<span class="line"><span>[514 516 518 ... 544  562 564 566 ... 592  610 612 614 ... 640  658 660 662 ... 688</span></span>
<span class="line"><span> 706 708 710 ... 736  754 756 758 ... 784  802 804 806 ... 832  850 852 854 ... 880 </span></span>
<span class="line"><span> 898 900 902 ... 928  946 948 950 ... 976  994 996 998 ... 1024  1042 1044 1046 ... 1072</span></span>
<span class="line"><span>1090 1092 1094 ... 1120  1138 1140 1142 ... 1168  1186 1188 1190 ... 1216 1234 1236 1238 … 1264</span></span>
<span class="line"><span>undefined ... undefined]</span></span></code></pre></div></li><li><p>需要传入标量参数的API使用样例。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &quot;kernel_operator.h&quot;</span></span>
<span class="line"><span>constexpr int32_t BUFFER_NUM = 2;</span></span>
<span class="line"><span>class KernelBinaryScalar {</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    __aicore__ inline KernelBinaryScalar() {}</span></span>
<span class="line"><span>    __aicore__ inline void Init(GM_ADDR x, GM_ADDR z, float scalar, uint32_t totalLength, uint32_t tileNum)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        this-&gt;blockLength = totalLength / AscendC::GetBlockNum();</span></span>
<span class="line"><span>        this-&gt;scalar = scalar;</span></span>
<span class="line"><span>        this-&gt;tileNum = tileNum;</span></span>
<span class="line"><span>        ASSERT(tileNum != 0 &amp;&amp; &quot;tile num can not be zero!&quot;);</span></span>
<span class="line"><span>        this-&gt;tileLength = this-&gt;blockLength / tileNum / BUFFER_NUM;</span></span>
<span class="line"><span>        xGm.SetGlobalBuffer((__gm__ DTYPE_X*)x + this-&gt;blockLength * AscendC::GetBlockIdx(), this-&gt;blockLength);</span></span>
<span class="line"><span>        zGm.SetGlobalBuffer((__gm__ DTYPE_Z*)z + this-&gt;blockLength * AscendC::GetBlockIdx(), this-&gt;blockLength);</span></span>
<span class="line"><span>        pipe.InitBuffer(inQueueX, BUFFER_NUM, this-&gt;tileLength * sizeof(DTYPE_X));</span></span>
<span class="line"><span>        pipe.InitBuffer(outQueueZ, BUFFER_NUM, this-&gt;tileLength * sizeof(DTYPE_Z));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void Process()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        int32_t loopCount = this-&gt;tileNum * BUFFER_NUM;</span></span>
<span class="line"><span>        for (int32_t i = 0; i &lt; loopCount; i++) {</span></span>
<span class="line"><span>            CopyIn(i);</span></span>
<span class="line"><span>            Compute(i);</span></span>
<span class="line"><span>            CopyOut(i);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>private:</span></span>
<span class="line"><span>    __aicore__ inline void CopyIn(int32_t progress)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;DTYPE_X&gt; xLocal = inQueueX.AllocTensor&lt;DTYPE_X&gt;();</span></span>
<span class="line"><span>        AscendC::DataCopy(xLocal, xGm[progress * this-&gt;tileLength], this-&gt;tileLength);</span></span>
<span class="line"><span>        inQueueX.EnQue(xLocal);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void Compute(int32_t progress)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;DTYPE_X&gt; xLocal = inQueueX.DeQue&lt;DTYPE_X&gt;();</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;DTYPE_Z&gt; zLocal = outQueueZ.AllocTensor&lt;DTYPE_Z&gt;();</span></span>
<span class="line"><span>        AscendC::Adds(zLocal, xLocal, (DTYPE_X)scalar, this-&gt;tileLength);</span></span>
<span class="line"><span>        outQueueZ.EnQue&lt;DTYPE_Z&gt;(zLocal);</span></span>
<span class="line"><span>        inQueueX.FreeTensor(xLocal);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void CopyOut(int32_t progress)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;DTYPE_Z&gt; zLocal = outQueueZ.DeQue&lt;DTYPE_Z&gt;();</span></span>
<span class="line"><span>        AscendC::DataCopy(zGm[progress * this-&gt;tileLength], zLocal, this-&gt;tileLength);</span></span>
<span class="line"><span>        outQueueZ.FreeTensor(zLocal);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>private:</span></span>
<span class="line"><span>    AscendC::TPipe pipe;</span></span>
<span class="line"><span>    AscendC::TQue&lt;AscendC::TPosition::VECIN, BUFFER_NUM&gt; inQueueX;</span></span>
<span class="line"><span>    AscendC::TQue&lt;AscendC::TPosition::VECOUT, BUFFER_NUM&gt; outQueueZ;</span></span>
<span class="line"><span>    AscendC::GlobalTensor&lt;DTYPE_X&gt; xGm;</span></span>
<span class="line"><span>    AscendC::GlobalTensor&lt;DTYPE_Z&gt; zGm;</span></span>
<span class="line"><span>    float scalar;</span></span>
<span class="line"><span>    uint32_t blockLength;</span></span>
<span class="line"><span>    uint32_t tileNum;</span></span>
<span class="line"><span>    uint32_t tileLength;</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span>extern &quot;C&quot; __global__ __aicore__ void binary_scalar_simple_kernel(GM_ADDR x, GM_ADDR z, GM_ADDR workspace, GM_ADDR tiling)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    GET_TILING_DATA(tilingData, tiling);</span></span>
<span class="line"><span>    KernelBinaryScalar op;</span></span>
<span class="line"><span>    op.Init(x, z, tilingData.scalar, tilingData.totalLength, tilingData.tileNum);</span></span>
<span class="line"><span>    if (TILING_KEY_IS(1)) {</span></span>
<span class="line"><span>        op.Process();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div></li></ul>`,2)])])}const _=n(l,[["render",i]]);export{g as __pageData,_ as default};
