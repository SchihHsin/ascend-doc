import{c as n,Q as a,j as p,m as e}from"./chunks/framework.DOi4mjdC.js";const _=JSON.parse('{"title":"更多样例","description":"","frontmatter":{},"headers":[{"level":1,"title":"更多样例","slug":"更多样例"},{"level":2,"title":"样例一","slug":"样例一"},{"level":2,"title":"样例二","slug":"样例二"},{"level":2,"title":"样例三","slug":"样例三"},{"level":2,"title":"样例四","slug":"样例四"}],"relativePath":"api/SIMD-API/高阶API/数学计算/更多样例-83.md","filePath":"api/SIMD-API/高阶API/数学计算/更多样例-83.md"}'),l={name:"api/SIMD-API/高阶API/数学计算/更多样例-83.md"};function i(t,s,c,o,r,u){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="更多样例" tabindex="-1">更多样例 <a class="header-anchor" href="#更多样例" aria-label="Permalink to &quot;更多样例&quot;">​</a></h1><h2 id="样例一" tabindex="-1">样例一 <a class="header-anchor" href="#样例一" aria-label="Permalink to &quot;样例一&quot;">​</a></h2><p>下面的样例展示了数学库kernel侧API和Tiling API GetXxxMaxMinTmpSize的配套使用方法，具体流程如下：</p><p>Host侧调用Tiling接口，获取所需临时空间的大小，并将其写入tiling data中；kernel侧再读取tiling data，获取相应的临时空间大小，并根据此分配临时空间。</p><p>Host侧Tiling API使用样例:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &lt;vector&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#include &quot;register/op_def_registry.h&quot;</span></span>
<span class="line"><span>#include &quot;register/tilingdata_base.h&quot;</span></span>
<span class="line"><span>#include &quot;tiling/tiling_api.h&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>namespace optiling {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>BEGIN_TILING_DATA_DEF(AsinCustomTilingData)</span></span>
<span class="line"><span>  TILING_DATA_FIELD_DEF(uint32_t, srcSize);</span></span>
<span class="line"><span>  TILING_DATA_FIELD_DEF(uint32_t, tmpBufferSize);</span></span>
<span class="line"><span>END_TILING_DATA_DEF;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static ge::graphStatus TilingFunc(gert::TilingContext* context)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    // Input source shapes.</span></span>
<span class="line"><span>    auto shape_input = context-&gt;GetInputTensor(0)-&gt;GetOriginShape();    </span></span>
<span class="line"><span>    std::vector&lt;int64_t&gt; srcDims = {shape_input.GetDim(0), shape_input.GetDim(1)};</span></span>
<span class="line"><span>    uint32_t srcSize = 1;</span></span>
<span class="line"><span>    for (auto dim : srcDims) {</span></span>
<span class="line"><span>        srcSize *= dim;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    uint32_t typeSize = 2;</span></span>
<span class="line"><span>    ge::Shape shape(srcDims);</span></span>
<span class="line"><span>    uint32_t minValue = 0;</span></span>
<span class="line"><span>    uint32_t maxValue = 0;</span></span>
<span class="line"><span>    AscendC::GetAsinMaxMinTmpSize(shape, typeSize, false, maxValue, minValue);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    auto platformInfo = context-&gt;GetPlatformInfo();</span></span>
<span class="line"><span>    auto ascendcPlatform = platform_ascendc::PlatformAscendC(platformInfo);</span></span>
<span class="line"><span>    uint64_t tailSize = 0; // ub剩余空间大小</span></span>
<span class="line"><span>    ascendcPlatform.GetCoreMemSize(platform_ascendc::CoreMemType::UB, tailSize); // 本样例中使用完整的ub空间，实际情况下tailSize需要减掉用户已使用的ub空间</span></span>
<span class="line"><span>    auto tmpSize = tailSize &gt;= maxValue ? maxValue : tailSize;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    AsinCustomTilingData tiling;</span></span>
<span class="line"><span>    tiling.set_srcSize(srcSize);</span></span>
<span class="line"><span>    tiling.set_tmpBufferSize(tmpSize);</span></span>
<span class="line"><span>    context-&gt;SetBlockDim(1);</span></span>
<span class="line"><span>    tiling.SaveToBuffer(context-&gt;GetRawTilingData()-&gt;GetData(), context-&gt;GetRawTilingData()-&gt;GetCapacity());</span></span>
<span class="line"><span>    context-&gt;GetRawTilingData()-&gt;SetDataSize(tiling.GetDataSize());</span></span>
<span class="line"><span>    context-&gt;SetTilingKey(1);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return ge::GRAPH_SUCCESS;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>} // namespace optiling</span></span></code></pre></div><p>kernel侧读取tiling data，获取相应的临时空间大小，并根据此分配临时空间：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &quot;kernel_operator.h&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>template &lt;typename srcType&gt;</span></span>
<span class="line"><span>class KernelAsin</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    __aicore__ inline KernelAsin() {}</span></span>
<span class="line"><span>    __aicore__ inline void Init(GM_ADDR srcGm, GM_ADDR dstGm, uint32_t srcSize, uint32_t tmpBufferSize)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        srcGlobal.SetGlobalBuffer(reinterpret_cast&lt;__gm__ srcType *&gt;(srcGm), srcSize);</span></span>
<span class="line"><span>        dstGlobal.SetGlobalBuffer(reinterpret_cast&lt;__gm__ srcType *&gt;(dstGm), srcSize);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        pipe.InitBuffer(inQueue, 1, srcSize * sizeof(srcType));</span></span>
<span class="line"><span>        pipe.InitBuffer(outQueue, 1, srcSize * sizeof(srcType));</span></span>
<span class="line"><span>        pipe.InitBuffer(tmpBuf, tmpBufferSize);</span></span>
<span class="line"><span>        bufferSize = srcSize;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void Process()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        CopyIn();</span></span>
<span class="line"><span>        Compute();</span></span>
<span class="line"><span>        CopyOut();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private:</span></span>
<span class="line"><span>    __aicore__ inline void CopyIn()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;srcType&gt; srcLocal = inQueue.AllocTensor&lt;srcType&gt;();</span></span>
<span class="line"><span>        AscendC::DataCopy(srcLocal, srcGlobal, bufferSize);</span></span>
<span class="line"><span>        inQueue.EnQue(srcLocal);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void Compute()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;srcType&gt; dstLocal = outQueue.AllocTensor&lt;srcType&gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;srcType&gt; srcLocal = inQueue.DeQue&lt;srcType&gt;();</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;uint8_t&gt; sharedTmpBuffer = tmpBuf.Get&lt;uint8_t&gt;();</span></span>
<span class="line"><span>        AscendC::Asin&lt;srcType, false&gt;(dstLocal, srcLocal, sharedTmpBuffer, bufferSize);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        outQueue.EnQue&lt;srcType&gt;(dstLocal);</span></span>
<span class="line"><span>        inQueue.FreeTensor(srcLocal);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void CopyOut()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;srcType&gt; dstLocal = outQueue.DeQue&lt;srcType&gt;();</span></span>
<span class="line"><span>        AscendC::DataCopy(dstGlobal, dstLocal, bufferSize);</span></span>
<span class="line"><span>        outQueue.FreeTensor(dstLocal);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private:</span></span>
<span class="line"><span>    AscendC::GlobalTensor&lt;srcType&gt; srcGlobal;</span></span>
<span class="line"><span>    AscendC::GlobalTensor&lt;srcType&gt; dstGlobal;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    AscendC::TPipe pipe;</span></span>
<span class="line"><span>    AscendC::TQue&lt;AscendC::TPosition::VECIN, 1&gt; inQueue;</span></span>
<span class="line"><span>    AscendC::TBuf&lt;AscendC::TPosition::VECCALC&gt; tmpBuf;</span></span>
<span class="line"><span>    AscendC::TQue&lt;AscendC::TPosition::VECOUT, 1&gt; outQueue;</span></span>
<span class="line"><span>    uint32_t bufferSize = 0;</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>extern &quot;C&quot; __global__ __aicore__ void asin_custom(GM_ADDR srcGm, GM_ADDR dstGm, GM_ADDR workspace, GM_ADDR tiling)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    GET_TILING_DATA(tilingData, tiling);</span></span>
<span class="line"><span>    KernelAsin&lt;half&gt; op;</span></span>
<span class="line"><span>    op.Init(srcGm, dstGm, tilingData.srcSize, tilingData.tmpBufferSize);</span></span>
<span class="line"><span>    if (TILING_KEY_IS(1))</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        op.Process();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="样例二" tabindex="-1">样例二 <a class="header-anchor" href="#样例二" aria-label="Permalink to &quot;样例二&quot;">​</a></h2><p>下面的样例展示了数学库Kernel侧API和<a href="./../../../Utils-API/平台信息获取/PlatformAscendC/ReserveLocalMemory.html">PlatformAscendC::ReserveLocalMemory</a>的配合使用方法，流程如下：</p><p>Host侧调用ReserveLocalMemory接口预留Unified Buffer内存空间，并通过GetCoreMemSize接口获取实际可用的Unified Buffer内存大小。基于实际可用的内存大小计算能够支持的最大Shape（最大数据规模）。这种方式可以避免多次调用GetXXXTmpMaxMinSize接口来获取合适的临时空间大小。</p><p>Host侧Tiling API使用样例：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &lt;vector&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#include &quot;register/op_def_registry.h&quot;</span></span>
<span class="line"><span>#include &quot;register/tilingdata_base.h&quot;</span></span>
<span class="line"><span>#include &quot;tiling/tiling_api.h&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>namespace optiling {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>BEGIN_TILING_DATA_DEF(MathCustomTilingData)</span></span>
<span class="line"><span>  TILING_DATA_FIELD_DEF(uint32_t, calSize);</span></span>
<span class="line"><span>END_TILING_DATA_DEF;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static ge::graphStatus TilingFunc(gert::TilingContext* context)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    auto platformInfo = context-&gt;GetPlatformInfo();</span></span>
<span class="line"><span>    auto ascendcPlatform = platform_ascendc::PlatformAscendC(platformInfo);</span></span>
<span class="line"><span>    uint64_t tailSize = 0; // Unified Buffer剩余空间大小</span></span>
<span class="line"><span>    ascendcPlatform.ReserveLocalMemory(platform_ascendc::ReservedSize::RESERVED_SIZE_8K);</span></span>
<span class="line"><span>    ascendcPlatform.GetCoreMemSize(platform_ascendc::CoreMemType::UB, tailSize);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    uint64_t calSize = tailSize / (3 * 4); // src + dst + tmp float type</span></span>
<span class="line"><span>    MathCustomTilingData tiling;</span></span>
<span class="line"><span>    tiling.set_calSize(calSize);</span></span>
<span class="line"><span>    context-&gt;SetBlockDim(1);</span></span>
<span class="line"><span>    tiling.SaveToBuffer(context-&gt;GetRawTilingData()-&gt;GetData(), context-&gt;GetRawTilingData()-&gt;GetCapacity());</span></span>
<span class="line"><span>    context-&gt;GetRawTilingData()-&gt;SetDataSize(tiling.GetDataSize());</span></span>
<span class="line"><span>    context-&gt;SetTilingKey(1);</span></span>
<span class="line"><span>    return ge::GRAPH_SUCCESS;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>} // namespace optiling</span></span></code></pre></div><p>Kernel侧通过读取TilingData，获取相应的计算规模参数。随后，Kernel调用数学库提供的不带临时空间的API，执行多种数学运算：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &quot;kernel_operator.h&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>template &lt;typename srcType&gt;</span></span>
<span class="line"><span>class KernelMath</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    __aicore__ inline KernelMath() {}</span></span>
<span class="line"><span>    __aicore__ inline void Init(GM_ADDR srcGm, GM_ADDR dstGm, uint32_t srcSize)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        srcGlobal.SetGlobalBuffer(reinterpret_cast&lt;__gm__ srcType *&gt;(srcGm), srcSize);</span></span>
<span class="line"><span>        dstGlobal.SetGlobalBuffer(reinterpret_cast&lt;__gm__ srcType *&gt;(dstGm), srcSize);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        pipe.InitBuffer(inQueue, 1, srcSize * sizeof(srcType));</span></span>
<span class="line"><span>        pipe.InitBuffer(outQueue, 1, srcSize * sizeof(srcType));</span></span>
<span class="line"><span>        pipe.InitBuffer(tmpBuf, srcSize * sizeof(srcType));</span></span>
<span class="line"><span>        bufferSize = srcSize;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void Process()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        CopyIn();</span></span>
<span class="line"><span>        Compute();</span></span>
<span class="line"><span>        CopyOut();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private:</span></span>
<span class="line"><span>    __aicore__ inline void CopyIn()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;srcType&gt; srcLocal = inQueue.AllocTensor&lt;srcType&gt;();</span></span>
<span class="line"><span>        AscendC::DataCopy(srcLocal, srcGlobal, bufferSize);</span></span>
<span class="line"><span>        inQueue.EnQue(srcLocal);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void Compute()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;srcType&gt; dstLocal = outQueue.AllocTensor&lt;srcType&gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;srcType&gt; srcLocal = inQueue.DeQue&lt;srcType&gt;();</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;srcType&gt; tmp = tmpBuf.Get&lt;srcType&gt;();</span></span>
<span class="line"><span>        AscendC::Asin&lt;srcType, false&gt;(tmp, srcLocal, bufferSize);</span></span>
<span class="line"><span>        AscendC::PipeBarrier&lt;PIPE_V&gt;();</span></span>
<span class="line"><span>        AscendC::Sin&lt;srcType, false&gt;(dstLocal, tmp, bufferSize);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        outQueue.EnQue&lt;srcType&gt;(dstLocal);</span></span>
<span class="line"><span>        inQueue.FreeTensor(srcLocal);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void CopyOut()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;srcType&gt; dstLocal = outQueue.DeQue&lt;srcType&gt;();</span></span>
<span class="line"><span>        AscendC::DataCopy(dstGlobal, dstLocal, bufferSize);</span></span>
<span class="line"><span>        outQueue.FreeTensor(dstLocal);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private:</span></span>
<span class="line"><span>    AscendC::GlobalTensor&lt;srcType&gt; srcGlobal;</span></span>
<span class="line"><span>    AscendC::GlobalTensor&lt;srcType&gt; dstGlobal;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    AscendC::TPipe pipe;</span></span>
<span class="line"><span>    AscendC::TQue&lt;AscendC::TPosition::VECIN, 1&gt; inQueue;</span></span>
<span class="line"><span>    AscendC::TBuf&lt;AscendC::TPosition::VECCALC&gt; tmpBuf;</span></span>
<span class="line"><span>    AscendC::TQue&lt;AscendC::TPosition::VECOUT, 1&gt; outQueue;</span></span>
<span class="line"><span>    uint32_t bufferSize = 0;</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>extern &quot;C&quot; __global__ __aicore__ void math_custom(GM_ADDR srcGm, GM_ADDR dstGm, GM_ADDR workspace, GM_ADDR tiling)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    GET_TILING_DATA(tilingData, tiling);</span></span>
<span class="line"><span>    KernelMath&lt;float&gt; op;</span></span>
<span class="line"><span>    op.Init(srcGm, dstGm, tilingData.calSize);</span></span>
<span class="line"><span>    if (TILING_KEY_IS(1))</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        op.Process();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="样例三" tabindex="-1">样例三 <a class="header-anchor" href="#样例三" aria-label="Permalink to &quot;样例三&quot;">​</a></h2><p>下面的样例展示了数学库kernel侧API和Tiling API GetXxxTmpBufferFactorSize的配套使用方法，具体流程如下：</p><p>Host侧调用Tiling接口，获取maxLiveNodeCount和extraBuf，并推算算子单次最大计算元素数量，将其写入tiling data中；kernel侧再读取tiling data，获取该值，基于该值分配临时空间。</p><p>Host侧Tiling API使用样例:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &lt;vector&gt;</span></span>
<span class="line"><span>#include &lt;cassert&gt;</span></span>
<span class="line"><span>#include &quot;register/op_def_registry.h&quot;</span></span>
<span class="line"><span>#include &quot;register/tilingdata_base.h&quot;</span></span>
<span class="line"><span>#include &quot;tiling/tiling_api.h&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>namespace optiling {</span></span>
<span class="line"><span>BEGIN_TILING_DATA_DEF(AsinCustomTilingData)</span></span>
<span class="line"><span>TILING_DATA_FIELD_DEF(uint32_t, srcSize);</span></span>
<span class="line"><span>TILING_DATA_FIELD_DEF(uint32_t, tmpBufferSize);</span></span>
<span class="line"><span>END_TILING_DATA_DEF;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static ge::graphStatus TilingFunc(gert::TilingContext *context)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    // Input source shapes.</span></span>
<span class="line"><span>    auto shape_input = context-&gt;GetInputTensor(0)-&gt;GetOriginShape();</span></span>
<span class="line"><span>    std::vector&lt;int64_t&gt; srcDims = { shape_input.GetDim(0), shape_input.GetDim(1) };</span></span>
<span class="line"><span>    uint32_t srcSize = 1;</span></span>
<span class="line"><span>    uint32_t srcCurSize = 1;</span></span>
<span class="line"><span>    for (auto dim : srcDims) {</span></span>
<span class="line"><span>        srcSize *= dim;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    uint32_t typeSize = 2;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    auto platformInfo = context-&gt;GetPlatformInfo();</span></span>
<span class="line"><span>    auto ascendcPlatform = platform_ascendc::PlatformAscendC(platformInfo);</span></span>
<span class="line"><span>    uint64_t tailSize = 0; // ub剩余空间大小</span></span>
<span class="line"><span>    ascendcPlatform.GetCoreMemSize(platform_ascendc::CoreMemType::UB, tailSize);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    uint32_t asinMaxLiveNodeCount = 0;</span></span>
<span class="line"><span>    uint32_t asinExtraBuf = 0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    uint32_t acosMaxLiveNodeCount = 0;</span></span>
<span class="line"><span>    uint32_t acosExtraBuf = 0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    AscendC::GetAsinTmpBufferFactorSize(typeSize, asinMaxLiveNodeCount, asinExtraBuf);</span></span>
<span class="line"><span>    AscendC::GetAcosTmpBufferFactorSize(typeSize, acosMaxLiveNodeCount, acosExtraBuf);</span></span>
<span class="line"><span>    // tmp的大小需要减去UB上调用api接口输入和输出占用的大小</span></span>
<span class="line"><span>    // 该示例中包括Asin接口的输入输出，以及Acos的输入输出，其中Asin接口的输出作为Acos的输入，因此一共需要3份src的空间大小</span></span>
<span class="line"><span>    auto tmpSize = tailSize - srcSize * typeSize * 3;</span></span>
<span class="line"><span>    assert(tmpSize &gt;= asinExtraBuf);</span></span>
<span class="line"><span>    assert(tmpSize &gt;= acosExtraBuf);</span></span>
<span class="line"><span>    // 计算Asin算子单次最大计算元素数量</span></span>
<span class="line"><span>    if (asinMaxLiveNodeCount != 0) {</span></span>
<span class="line"><span>        srcAsinCurSize = (tmpSize - asinExtraBuf) / asinMaxLiveNodeCount / typeSize;</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        srcAsinCurSize = srcSize;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    // 计算Acos算子单次最大计算元素数量</span></span>
<span class="line"><span>    if (acosMaxLiveNodeCount != 0) {</span></span>
<span class="line"><span>        srcAcosCurSize = (tmpSize - acosExtraBuf) / acosMaxLiveNodeCount / typeSize; </span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        srcAcosCurSize = srcSize;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    srcCurSize = std::min(srcAsinCurSize, srcAcosCurSize);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    AsinCustomTilingData tiling;</span></span>
<span class="line"><span>    tiling.set_srcSize(srcSize);</span></span>
<span class="line"><span>    tiling.set_srcCurSize(srcCurSize);</span></span>
<span class="line"><span>    tiling.set_tmpBufferSize(tmpSize);</span></span>
<span class="line"><span>    context-&gt;SetBlockDim(1);</span></span>
<span class="line"><span>    tiling.SaveToBuffer(context-&gt;GetRawTilingData()-&gt;GetData(), context-&gt;GetRawTilingData()-&gt;GetCapacity());</span></span>
<span class="line"><span>    context-&gt;GetRawTilingData()-&gt;SetDataSize(tiling.GetDataSize());</span></span>
<span class="line"><span>    context-&gt;SetTilingKey(1);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return ge::GRAPH_SUCCESS;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>} // namespace optiling</span></span></code></pre></div><p>kernel侧样例:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &quot;kernel_operator.h&quot;</span></span>
<span class="line"><span>template &lt;typename srcType&gt;</span></span>
<span class="line"><span>class KernelAsin {</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    __aicore__ inline KernelAsin(){}</span></span>
<span class="line"><span>    __aicore__ inline void Init(GM_ADDR srcGm, GM_ADDR dstGm, uint32_t srcSizeIn, uint32_t srcCurSizeIn, uint32_t tmpBufferSize)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        srcSize = srcSizeIn;</span></span>
<span class="line"><span>        srcCurSize = srcCurSizeIn;</span></span>
<span class="line"><span>        srcGlobal.SetGlobalBuffer(reinterpret_cast&lt;__gm__ srcType *&gt;(srcGm), srcSize);</span></span>
<span class="line"><span>        dstGlobal.SetGlobalBuffer(reinterpret_cast&lt;__gm__ srcType *&gt;(dstGm), srcSize);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        pipe.InitBuffer(inQueue, 1, srcSize * sizeof(srcType));</span></span>
<span class="line"><span>        pipe.InitBuffer(outQueue, 1, srcSize * sizeof(srcType));</span></span>
<span class="line"><span>        pipe.InitBuffer(tmpBuf1, 1, srcCurSize * sizeof(srcType));</span></span>
<span class="line"><span>        pipe.InitBuffer(tmpBuf, 1, tmpBufferSize);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void Process()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        CopyIn();</span></span>
<span class="line"><span>        Compute();</span></span>
<span class="line"><span>        CopyOut();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private:</span></span>
<span class="line"><span>    __aicore__ inline void CopyIn()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;srcType&gt; srcLocal = inQueue.AllocTensor&lt;srcType&gt;();</span></span>
<span class="line"><span>        AscendC::DataCopy(srcLocal, srcGlobal, srcSize);</span></span>
<span class="line"><span>        inQueue.EnQue(srcLocal);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void Compute()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;srcType&gt; dstLocal = outQueue.AllocTensor&lt;srcType&gt;();</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;srcType&gt; srcLocal = inQueue.DeQue&lt;srcType&gt;();</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;uint8_t&gt; sharedTmpBuffer = tmpBuf.Get&lt;uint8_t&gt;();</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;srcType&gt; tmpresBuffer = tmpBuf1.Get&lt;srcType&gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        for (int32_t offset = 0; offset &lt; srcSize; offset += srcCurSize) {</span></span>
<span class="line"><span>            AscendC::Asin&lt;srcType, false&gt;(tmpresBuffer, srcLocal[offset], sharedTmpBuffer, srcCurSize);</span></span>
<span class="line"><span>            AscendC::PipeBarrier&lt;PIPE_V&gt;();</span></span>
<span class="line"><span>            AscendC::Acos&lt;srcType, false&gt;(dstLocal[offset], tmpresBuffer, sharedTmpBuffer, srcCurSize);</span></span>
<span class="line"><span>            AscendC::PipeBarrier&lt;PIPE_V&gt;();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        outQueue.EnQue&lt;srcType&gt;(dstLocal);</span></span>
<span class="line"><span>        inQueue.FreeTensor(srcLocal);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void CopyOut()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;srcType&gt; dstLocal = outQueue.DeQue&lt;srcType&gt;();</span></span>
<span class="line"><span>        AscendC::DataCopy(dstGlobal, dstLocal, srcSize);</span></span>
<span class="line"><span>        outQueue.FreeTensor(dstLocal);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private:</span></span>
<span class="line"><span>    AscendC::GlobalTensor&lt;srcType&gt; srcGlobal;</span></span>
<span class="line"><span>    AscendC::GlobalTensor&lt;srcType&gt; dstGlobal;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    AscendC::TPipe pipe;</span></span>
<span class="line"><span>    AscendC::TQue&lt;AscendC::TPosition::VECIN, 1&gt; inQueue;</span></span>
<span class="line"><span>    AscendC::TBuf&lt;AscendC::TPosition::VECCALC, 1&gt; tmpBuf;</span></span>
<span class="line"><span>    AscendC::TBuf&lt;AscendC::TPosition::VECCALC, 1&gt; tmpBuf1;</span></span>
<span class="line"><span>    AscendC::TQue&lt;AscendC::TPosition::VECOUT, 1&gt; outQueue;</span></span>
<span class="line"><span>    uint32_t srcSize, srcCurSize;</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>extern &quot;C&quot; __global__ __aicore__ void kernel_asin_operator(GM_ADDR srcGm, GM_ADDR dstGm, GM_ADDR workspace, GM_ADDR tiling)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    GET_TILING_DATA(tilingData, tiling);</span></span>
<span class="line"><span>    KernelAsin&lt;half&gt; op;</span></span>
<span class="line"><span>    op.Init(srcGm, dstGm, tilingData.srcSize, tilingData.srcCurSize, tilingData.tmpBufferSize);</span></span>
<span class="line"><span>    if (TILING_KEY_IS(1)) {</span></span>
<span class="line"><span>        op.Process();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="样例四" tabindex="-1">样例四 <a class="header-anchor" href="#样例四" aria-label="Permalink to &quot;样例四&quot;">​</a></h2><p>下面以<a href="./Exp接口/Exp接口.html">Exp</a>接口的关键调用代码为例，辅以调用前后数据打印结果，展示模板参数isReuseSource的使用及其相关影响。</p><p>模板参数isReuseSource为bool类型；若isReuseSource为false，则接口内部计算时不复用源操作数的内存空间；若isReuseSource为true，接口内部计算时会复用源操作数的内存空间，存放一些中间结果，节省内存空间，开发者需要注意接口执行完成后，源操作数的内存空间不再是原始值。</p><ul><li><p>isReuseSource = false</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 调用Exp前dstLocal、srcLocal数值</span></span>
<span class="line"><span>// dstLocal: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]</span></span>
<span class="line"><span>// srcLocal: [-7.5, -6.5, -5.5, -4.5, -3.5, -2.5, -1.5, -0.5, 0.5, 1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>AscendC::Exp&lt;float, 15, false&gt;(dstLocal, srcLocal, 16);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 调用Exp后dstLocal、srcLocal数值</span></span>
<span class="line"><span>// dstLocal: [0.000553084, 0.00150344, 0.00408677, 0.011109, 0.0301974, 0.082085, 0.22313, 0.606531, 1.64872, 4.48169, 12.1825, 33.1155, 90.0171, 244.692, 665.142, 1808.04]</span></span>
<span class="line"><span>// srcLocal: [-7.5, -6.5, -5.5, -4.5, -3.5, -2.5, -1.5, -0.5, 0.5, 1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5]</span></span></code></pre></div></li><li><p>isReuseSource = true</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 调用Exp前dstLocal、srcLocal数值</span></span>
<span class="line"><span>// dstLocal: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]</span></span>
<span class="line"><span>// srcLocal: [-7.5, -6.5, -5.5, -4.5, -3.5, -2.5, -1.5, -0.5, 0.5, 1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>AscendC::Exp&lt;float, 15, true&gt;(dstLocal, srcLocal, 16);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 调用Exp后dstLocal、srcLocal数值</span></span>
<span class="line"><span>// dstLocal: [0.000553084, 0.00150344, 0.00408677, 0.011109, 0.0301974, 0.082085, 0.22313, 0.606531, 1.64872, 4.48169, 12.1825, 33.1155, 90.0171, 244.692, 665.142, 1808.04]</span></span>
<span class="line"><span>// srcLocal: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5]</span></span></code></pre></div></li></ul>`,26)])])}const g=n(l,[["render",i]]);export{_ as __pageData,g as default};
