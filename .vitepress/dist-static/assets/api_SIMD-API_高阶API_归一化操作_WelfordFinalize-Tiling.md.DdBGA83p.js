import{c as a,Q as s,j as t,m as e}from"./chunks/framework.DOi4mjdC.js";const u=JSON.parse('{"title":"WelfordFinalize Tiling","description":"","frontmatter":{},"headers":[{"level":1,"title":"WelfordFinalize Tiling","slug":"welfordfinalize-tiling"},{"level":2,"title":"功能说明","slug":"功能说明"},{"level":2,"title":"函数原型","slug":"函数原型"},{"level":2,"title":"参数说明","slug":"参数说明"},{"level":2,"title":"返回值说明","slug":"返回值说明"},{"level":2,"title":"约束说明","slug":"约束说明"},{"level":2,"title":"调用示例","slug":"调用示例"}],"relativePath":"api/SIMD-API/高阶API/归一化操作/WelfordFinalize-Tiling.md","filePath":"api/SIMD-API/高阶API/归一化操作/WelfordFinalize-Tiling.md"}'),i={name:"api/SIMD-API/高阶API/归一化操作/WelfordFinalize-Tiling.md"};function l(p,n,r,o,c,g){return s(),t("div",null,[...n[0]||(n[0]=[e(`<h1 id="welfordfinalize-tiling" tabindex="-1">WelfordFinalize Tiling <a class="header-anchor" href="#welfordfinalize-tiling" aria-label="Permalink to &quot;WelfordFinalize Tiling&quot;">​</a></h1><h2 id="功能说明" tabindex="-1">功能说明 <a class="header-anchor" href="#功能说明" aria-label="Permalink to &quot;功能说明&quot;">​</a></h2><p>Ascend C提供WelfordFinalize Tiling API，方便用户获取WelfordFinalize kernel计算时所需的Tiling参数。</p><p>获取Tiling参数主要步骤如下：</p><p>具体为，通过<strong>GetWelfordFinalizeMaxMinTmpSize</strong>获取WelfordFinalize接口计算所需最大和最小临时空间大小。</p><p>kernel侧WelfordFinalize接口的计算需要开发者预留/申请临时空间，<strong>GetWelfordFinalizeMaxMinTmpSize</strong>用于在host侧获取预留/申请的最大最小临时空间大小，开发者基于此范围选择合适的空间大小作为Tiling参数传递到kernel侧使用。</p><ul><li>为保证功能正确，预留/申请的临时空间大小不能小于最小临时空间大小；</li><li>在最小临时空间-最大临时空间范围内，随着临时空间增大，kernel侧接口计算性能会有一定程度的优化提升。为了达到更好的性能，开发者可以根据实际的内存使用情况进行空间预留/申请。</li></ul><h2 id="函数原型" tabindex="-1">函数原型 <a class="header-anchor" href="#函数原型" aria-label="Permalink to &quot;函数原型&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void GetWelfordFinalizeMaxMinTmpSize(const ge::Shape&amp; srcShape, const uint32_t typeSize, const bool isReuseSource, uint32_t&amp; maxValue, uint32_t&amp; minValue)</span></span></code></pre></div><h2 id="参数说明" tabindex="-1">参数说明 <a class="header-anchor" href="#参数说明" aria-label="Permalink to &quot;参数说明&quot;">​</a></h2><p><strong>表 1</strong> GetWelfordFinalizeMaxMinTmpSize接口参数说明</p><table tabindex="0"><thead><tr><th>参数名</th><th>输入/输出</th><th>描述</th></tr></thead><tbody><tr><td>srcShape</td><td>输入</td><td>输入inputMean/inputVariance的shape信息{abLength}。</td></tr><tr><td>typeSize</td><td>输入</td><td>输入inputMean/inputVariance的数据类型大小，单位为字节。比如输入的数据类型为float，此处应传入4。</td></tr><tr><td>isReuseSource</td><td>输入</td><td>是否允许修改源操作数。该参数取值与WelfordFinalize接口一致。</td></tr><tr><td>maxValue</td><td>输出</td><td>WelfordFinalize接口能完成计算所需的最大临时空间大小，超出该值的空间不会被该接口使用。在最小临时空间-最大临时空间范围内，随着临时空间增大，kernel侧接口计算性能会有一定程度的优化提升。为了达到更好的性能，开发者可以根据实际的内存使用情况进行空间预留/申请。最大空间大小为0表示计算不需要临时空间。 说明： maxValue仅作为参考值，有可能大于Unified Buffer剩余空间的大小，该场景下，开发者需要根据Unified Buffer剩余空间的大小来选取合适的临时空间大小。</td></tr><tr><td>minValue</td><td>输出</td><td>WelfordFinalize接口能完成计算所需最小临时空间大小。为保证功能正确，接口计算时预留/申请的临时空间不能小于该数值。最小空间大小为0表示计算不需要临时空间。</td></tr></tbody></table><h2 id="返回值说明" tabindex="-1">返回值说明 <a class="header-anchor" href="#返回值说明" aria-label="Permalink to &quot;返回值说明&quot;">​</a></h2><p>无</p><h2 id="约束说明" tabindex="-1">约束说明 <a class="header-anchor" href="#约束说明" aria-label="Permalink to &quot;约束说明&quot;">​</a></h2><p>无</p><h2 id="调用示例" tabindex="-1">调用示例 <a class="header-anchor" href="#调用示例" aria-label="Permalink to &quot;调用示例&quot;">​</a></h2><ol><li><p>将WelfordFinalizeTiling结构体参数增加至TilingData结构体，作为TilingData结构体的一个字段。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>BEGIN_TILING_DATA_DEF(WelfordFinalizeCustomTilingData) // 注册一个tiling的类，以tiling的名字作为入参</span></span>
<span class="line"><span>  TILING_DATA_FIELD_DEF(uint32_t, isCounts); // 添加tiling字段</span></span>
<span class="line"><span>  TILING_DATA_FIELD_DEF(uint32_t, rnLength);</span></span>
<span class="line"><span>  TILING_DATA_FIELD_DEF(uint32_t, abLength);</span></span>
<span class="line"><span>  TILING_DATA_FIELD_DEF(uint32_t, rLength);</span></span>
<span class="line"><span>  TILING_DATA_FIELD_DEF(uint32_t, head);</span></span>
<span class="line"><span>  TILING_DATA_FIELD_DEF(uint32_t, headLength);</span></span>
<span class="line"><span>  TILING_DATA_FIELD_DEF(uint32_t, tail);</span></span>
<span class="line"><span>  TILING_DATA_FIELD_DEF(uint32_t, tailLength);</span></span>
<span class="line"><span>END_TILING_DATA_DEF;</span></span>
<span class="line"><span>REGISTER_TILING_DATA_CLASS(WelfordFinalizeCustom, WelfordFinalizeCustomTilingData)// 将WelfordFinalizeCustomTilingData结构体参数增加至TilingData结构体</span></span></code></pre></div></li><li><p>Tiling实现函数中，首先调用<strong>GetWelfordFinalizeMaxMinTmpSize</strong>接口获取WelfordFinalize接口能完成计算所需最大/最小临时空间大小，根据该范围结合实际的内存使用情况设置合适的空间大小，然后根据输入shape、剩余的可供计算的空间大小等信息获取WelfordFinalize kernel侧接口所需tiling参数。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>namespace optiling {</span></span>
<span class="line"><span>static ge::graphStatus TilingFunc(gert::TilingContext *context)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    WelfordFinalizeCustomTilingData tiling;</span></span>
<span class="line"><span>    const gert::RuntimeAttrs *attrs = context-&gt;GetAttrs();</span></span>
<span class="line"><span>    const uint32_t isCounts = *(attrs-&gt;GetAttrPointer&lt;uint32_t&gt;(0));</span></span>
<span class="line"><span>    const uint32_t rnLength = *(attrs-&gt;GetAttrPointer&lt;uint32_t&gt;(1));</span></span>
<span class="line"><span>    const uint32_t abLength = *(attrs-&gt;GetAttrPointer&lt;uint32_t&gt;(2));</span></span>
<span class="line"><span>    const uint32_t rLength = *(attrs-&gt;GetAttrPointer&lt;uint32_t&gt;(3));</span></span>
<span class="line"><span>    const uint32_t head = *(attrs-&gt;GetAttrPointer&lt;uint32_t&gt;(4));</span></span>
<span class="line"><span>    const uint32_t headLength = *(attrs-&gt;GetAttrPointer&lt;uint32_t&gt;(5));</span></span>
<span class="line"><span>    const uint32_t tail = *(attrs-&gt;GetAttrPointer&lt;uint32_t&gt;(6));</span></span>
<span class="line"><span>    const uint32_t tailLength = *(attrs-&gt;GetAttrPointer&lt;uint32_t&gt;(7));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    std::vector&lt;int64_t&gt; srcDims = {abLength};</span></span>
<span class="line"><span>    ge::Shape srcShape(srcDims);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 本样例中仅作为样例说明，通过GetWelfordFinalizeMaxMinTmpSize获取最小值并传入，来保证功能正确，开发者可以根据需要传入合适的空间大小</span></span>
<span class="line"><span>    uint32_t maxTmpsize = 0;</span></span>
<span class="line"><span>    uint32_t minTmpsize = 0;</span></span>
<span class="line"><span>    AscendC::GetWelfordFinalizeMaxMinTmpSize(srcShape, 4, false, maxTmpsize, minTmpsize);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // auto ascendcPlatform = platform_ascendc::PlatformAscendC(context-&gt;GetPlatformInfo());</span></span>
<span class="line"><span>    // AscendC::GetWelfordFinalizeMaxMinTmpSize(srcShape, 4, false, ascendcPlatform, maxTmpsize, minTmpsize);</span></span>
<span class="line"><span>    ... // 其他逻辑</span></span>
<span class="line"><span>    context-&gt;SetTilingKey(1);</span></span>
<span class="line"><span>    tiling.SaveToBuffer(context-&gt;GetRawTilingData()-&gt;GetData(), context-&gt;GetRawTilingData()-&gt;GetCapacity());</span></span>
<span class="line"><span>    context-&gt;GetRawTilingData()-&gt;SetDataSize(tiling.GetDataSize());</span></span>
<span class="line"><span>    size_t *currentWorkspace = context-&gt;GetWorkspaceSizes(1);</span></span>
<span class="line"><span>    currentWorkspace[0] = 0;</span></span>
<span class="line"><span>    return ge::GRAPH_SUCCESS;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>} // namespace optiling</span></span></code></pre></div></li><li><p>对应的kernel侧通过在核函数中调用GET_TILING_DATA获取TilingData，继而将TilingData中的WelfordFinalize Tiling信息传入WelfordFinalize接口参与计算。完整的kernel侧样例请参考<a href="./WelfordFinalize.html">WelfordFinalize</a>。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>extern &quot;C&quot; __global__ __aicore__ void</span></span>
<span class="line"><span>welford_finalize_custom(</span></span>
<span class="line"><span>    GM_ADDR inputX_gm, GM_ADDR mean_gm, GM_ADDR var_gm, GM_ADDR outputMean_gm, GM_ADDR outputVariance_gm, GM_ADDR workspace, GM_ADDR tiling)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    GET_TILING_DATA(tilingData, tiling);</span></span>
<span class="line"><span>    if (TILING_KEY_IS(1))</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        if (tilingData.isCounts)</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            KernelWelfordFinalize&lt;int32_t, true&gt; op;</span></span>
<span class="line"><span>            op.Init(inputX_gm, mean_gm, var_gm, outputMean_gm, outputVariance_gm, tilingData.rnLength, tilingData.abLength, tilingData.rLength, tilingData.head, tilingData.headLength, tilingData.tail, tilingData.tailLength);</span></span>
<span class="line"><span>            op.Process();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        else</span></span>
<span class="line"><span>        {</span></span>
<span class="line"><span>            KernelWelfordFinalize&lt;int32_t, false&gt; op;</span></span>
<span class="line"><span>            op.Init(inputX_gm, mean_gm, var_gm, outputMean_gm, outputVariance_gm, tilingData.rnLength, tilingData.abLength, tilingData.rLength, tilingData.head, tilingData.headLength, tilingData.tail, tilingData.tailLength);</span></span>
<span class="line"><span>            op.Process();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div></li></ol>`,18)])])}const _=a(i,[["render",l]]);export{u as __pageData,_ as default};
