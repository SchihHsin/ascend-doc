import{c as n,Q as s,j as t,m as e}from"./chunks/framework.DOi4mjdC.js";const g=JSON.parse('{"title":"Normalize Tiling","description":"","frontmatter":{},"headers":[{"level":1,"title":"Normalize Tiling","slug":"normalize-tiling"},{"level":2,"title":"功能说明","slug":"功能说明"},{"level":2,"title":"函数原型","slug":"函数原型"},{"level":2,"title":"参数说明","slug":"参数说明"},{"level":2,"title":"返回值说明","slug":"返回值说明"},{"level":2,"title":"约束说明","slug":"约束说明"},{"level":2,"title":"调用示例","slug":"调用示例"}],"relativePath":"api/SIMD-API/高阶API/归一化操作/Normalize-Tiling.md","filePath":"api/SIMD-API/高阶API/归一化操作/Normalize-Tiling.md"}'),i={name:"api/SIMD-API/高阶API/归一化操作/Normalize-Tiling.md"};function p(l,a,o,r,c,m){return s(),t("div",null,[...a[0]||(a[0]=[e(`<h1 id="normalize-tiling" tabindex="-1">Normalize Tiling <a class="header-anchor" href="#normalize-tiling" aria-label="Permalink to &quot;Normalize Tiling&quot;">​</a></h1><h2 id="功能说明" tabindex="-1">功能说明 <a class="header-anchor" href="#功能说明" aria-label="Permalink to &quot;功能说明&quot;">​</a></h2><p>Ascend C提供Normalize Tiling API，方便用户获取Normalize kernel计算时所需的Tiling参数。</p><p>具体为，通过GetNormalizeMaxMinTmpSize获取Normalize接口计算所需最大和最小临时空间大小。</p><p>kernel侧Normalize接口的计算需要开发者预留/申请临时空间，GetNormalizeMaxMinTmpSize用于在host侧获取预留/申请的最大最小临时空间大小，开发者基于此范围选择合适的空间大小作为Tiling参数传递到kernel侧使用。</p><ul><li>为保证功能正确，预留/申请的临时空间大小不能小于最小临时空间大小；</li><li>在最小临时空间-最大临时空间范围内，随着临时空间增大，kernel侧接口计算性能会有一定程度的优化提升。为了达到更好的性能，开发者可以根据实际的内存使用情况进行空间预留/申请。</li></ul><h2 id="函数原型" tabindex="-1">函数原型 <a class="header-anchor" href="#函数原型" aria-label="Permalink to &quot;函数原型&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void GetNormalizeMaxMinTmpSize(const ge::Shape&amp; srcShape, const uint32_t typeSizeU, const uint32_t typeSizeT, const bool isReuseSource, const bool isComputeRstd, const bool isOnlyOutput, uint32_t&amp; maxValue, uint32_t&amp; minValue)</span></span></code></pre></div><h2 id="参数说明" tabindex="-1">参数说明 <a class="header-anchor" href="#参数说明" aria-label="Permalink to &quot;参数说明&quot;">​</a></h2><p><strong>表 1</strong> GetNormalizeMaxMinTmpSize接口参数说明</p><table tabindex="0"><thead><tr><th>参数名</th><th>输入/输出</th><th>描述</th></tr></thead><tbody><tr><td>srcShape</td><td>输入</td><td>Normalize输入数据inputX的shape信息{A, R}。</td></tr><tr><td>typeSizeU</td><td>输入</td><td>输入数据gamma, beta的数据类型大小，单位为字节。比如输入的数据类型为float，此处应传入4。</td></tr><tr><td>typeSizeT</td><td>输入</td><td>输入数据inputX的数据类型大小，单位为字节。比如输入的数据类型为float，此处应传入4。</td></tr><tr><td>isReuseSource</td><td>输入</td><td>是否复用源操作数的内存空间，与Normalize接口一致。</td></tr><tr><td>isComputeRstd</td><td>输入</td><td>是否计算rstd。该参数的取值只支持true。</td></tr><tr><td>isOnlyOutput</td><td>输入</td><td>是否只输出y，不输出标准差的倒数rstd。当前该参数仅支持取值为false，表示y和rstd的结果全部输出。</td></tr><tr><td>maxValue</td><td>输出</td><td>输出Normalize接口所需的tiling信息（最大临时空间大小）。 Normalize接口能完成计算所需的最大临时空间大小，超出该值的空间不会被该接口使用。在最小临时空间-最大临时空间范围内，随着临时空间增大，kernel侧接口计算性能会有一定程度的优化提升。为了达到更好的性能，开发者可以根据实际的内存使用情况进行空间预留/申请。 说明： maxValue仅作为参考值，有可能大于Unified Buffer剩余空间的大小，该场景下，开发者需要根据Unified Buffer剩余空间的大小来选取合适的临时空间大小。</td></tr><tr><td>minValue</td><td>输出</td><td>输出Normalize接口所需的tiling信息（最小临时空间大小）。 Normalize接口能完成计算所需最小临时空间大小。为保证功能正确，接口计算时预留/申请的临时空间不能小于该数值。</td></tr></tbody></table><h2 id="返回值说明" tabindex="-1">返回值说明 <a class="header-anchor" href="#返回值说明" aria-label="Permalink to &quot;返回值说明&quot;">​</a></h2><p>无</p><h2 id="约束说明" tabindex="-1">约束说明 <a class="header-anchor" href="#约束说明" aria-label="Permalink to &quot;约束说明&quot;">​</a></h2><p>无</p><h2 id="调用示例" tabindex="-1">调用示例 <a class="header-anchor" href="#调用示例" aria-label="Permalink to &quot;调用示例&quot;">​</a></h2><ol><li><p>将Normalize接口所需参数增加至TilingData结构体，作为TilingData结构体的一个字段。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>BEGIN_TILING_DATA_DEF(NormalizeCustomTilingData)</span></span>
<span class="line"><span>  TILING_DATA_FIELD_DEF(float, epsilon);</span></span>
<span class="line"><span>  TILING_DATA_FIELD_DEF(uint32_t, isNoBeta);</span></span>
<span class="line"><span>  TILING_DATA_FIELD_DEF(uint32_t, isNoGamma);</span></span>
<span class="line"><span>  TILING_DATA_FIELD_DEF(uint32_t, isOnlyOutput);</span></span>
<span class="line"><span>  TILING_DATA_FIELD_DEF(uint32_t, aLength);</span></span>
<span class="line"><span>  TILING_DATA_FIELD_DEF(uint32_t, rLength);</span></span>
<span class="line"><span>  TILING_DATA_FIELD_DEF(uint32_t, rLengthWithPadding);</span></span>
<span class="line"><span>  ...                                           // 添加其他tiling字段</span></span>
<span class="line"><span>END_TILING_DATA_DEF;</span></span></code></pre></div></li><li><p>Tiling实现函数中，首先调用<strong>GetNormalizeMaxMinTmpSize</strong>接口获取Normalize接口能完成计算所需最大/最小临时空间大小，根据该范围结合实际的内存使用情况设置合适的空间大小，然后根据输入shape、剩余的可供计算的空间大小等信息获取Normalize kernel侧接口所需tiling参数。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>namespace optiling {</span></span>
<span class="line"><span>static ge::graphStatus TilingFunc(gert::TilingContext *context)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    NormalizeCustomTilingData tiling;</span></span>
<span class="line"><span>    const gert::RuntimeAttrs *attrs = context-&gt;GetAttrs();</span></span>
<span class="line"><span>    const float epsilon = *(attrs-&gt;GetAttrPointer&lt;float&gt;(0));</span></span>
<span class="line"><span>    const uint32_t isNoBeta = *(attrs-&gt;GetAttrPointer&lt;uint32_t&gt;(1));</span></span>
<span class="line"><span>    const uint32_t isNoGamma = *(attrs-&gt;GetAttrPointer&lt;uint32_t&gt;(2));</span></span>
<span class="line"><span>    const uint32_t isOnlyOutput = *(attrs-&gt;GetAttrPointer&lt;uint32_t&gt;(3));</span></span>
<span class="line"><span>    const gert::StorageShape* x1_shape = context-&gt;GetInputShape(0);</span></span>
<span class="line"><span>    ...// 其他逻辑</span></span>
<span class="line"><span>    const gert::Shape shape = x1_shape-&gt;GetStorageShape();</span></span>
<span class="line"><span>    uint32_t aLength = shape.GetDim(0);</span></span>
<span class="line"><span>    uint32_t rLength = shape.GetDim(1);</span></span>
<span class="line"><span>    uint32_t rLengthWithPadding = (rLength + alignNum - 1) / alignNum * alignNum;</span></span>
<span class="line"><span>    std::vector&lt;int64_t&gt; srcDims = {aLength, rLength};</span></span>
<span class="line"><span>    ge::Shape srcShape(srcDims);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    uint32_t maxTmpsize = 0;</span></span>
<span class="line"><span>    uint32_t minTmpsize = 0;</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    AscendC::GetNormalizeMaxMinTmpSize(srcShape, typeSizeU, typeSizeT, false, true, isOnlyOutput, maxTmpsize, minTmpsize);</span></span>
<span class="line"><span>    // auto ascendcPlatform = platform_ascendc::PlatformAscendC(context-&gt;GetPlatformInfo());</span></span>
<span class="line"><span>    // AscendC::GetNormalizeMaxMinTmpSize(srcShape, typeSizeU, typeSizeT, false, true, isOnlyOutput, ascendcPlatform, maxTmpsize, minTmpsize);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    ... // 其他逻辑</span></span>
<span class="line"><span>    context-&gt;SetTilingKey(1);</span></span>
<span class="line"><span>    tiling.SaveToBuffer(context-&gt;GetRawTilingData()-&gt;GetData(), context-&gt;GetRawTilingData()-&gt;GetCapacity());</span></span>
<span class="line"><span>    context-&gt;GetRawTilingData()-&gt;SetDataSize(tiling.GetDataSize());</span></span>
<span class="line"><span>    size_t *currentWorkspace = context-&gt;GetWorkspaceSizes(1);</span></span>
<span class="line"><span>    currentWorkspace[0] = 0;</span></span>
<span class="line"><span>    return ge::GRAPH_SUCCESS;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>} // namespace optiling</span></span></code></pre></div></li><li><p>对应的kernel侧通过在核函数中调用GET_TILING_DATA获取TilingData，继而将TilingData中的Normalize Tiling信息传入Normalize接口参与计算。完整的kernel侧样例请参考<a href="./Normalize.html">Normalize</a>。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>extern &quot;C&quot; __global__ __aicore__ void normalize_custom(GM_ADDR x, GM_ADDR mean, GM_ADDR variance, GM_ADDR gamma, GM_ADDR beta, GM_ADDR rstd, GM_ADDR y, GM_ADDR workspace, GM_ADDR tiling) {</span></span>
<span class="line"><span>    GET_TILING_DATA(tilingData, tiling);</span></span>
<span class="line"><span>    float epsilon = tilingData.epsilon;</span></span>
<span class="line"><span>    NormalizePara para(tilingData.aLength, tilingData.rLength, tilingData.rLengthWithPadding);</span></span>
<span class="line"><span>    if (TILING_KEY_IS(1)) {</span></span>
<span class="line"><span>      if (!tilingData.isNoBeta &amp;&amp; !tilingData.isNoGamma) {</span></span>
<span class="line"><span>          KernelNormalize&lt;NLCFG_NORM&gt; op;</span></span>
<span class="line"><span>          op.Init(x, mean, variance, gamma, beta, rstd, y, epsilon, para);</span></span>
<span class="line"><span>          op.Process();</span></span>
<span class="line"><span>      } else if (!tilingData.isNoBeta &amp;&amp; tilingData.isNoGamma) {</span></span>
<span class="line"><span>          KernelNormalize&lt;NLCFG_NOGAMMA&gt; op;</span></span>
<span class="line"><span>          op.Init(x, mean, variance, gamma, beta, rstd, y, epsilon, para);</span></span>
<span class="line"><span>          op.Process();</span></span>
<span class="line"><span>      } else if (tilingData.isNoBeta &amp;&amp; !tilingData.isNoGamma) {</span></span>
<span class="line"><span>          KernelNormalize&lt;NLCFG_NOBETA&gt; op;</span></span>
<span class="line"><span>          op.Init(x, mean, variance, gamma, beta, rstd, y, epsilon, para);</span></span>
<span class="line"><span>          op.Process();</span></span>
<span class="line"><span>      } else if (tilingData.isNoBeta &amp;&amp; tilingData.isNoGamma) {</span></span>
<span class="line"><span>          KernelNormalize&lt;NLCFG_NOOPT&gt; op;</span></span>
<span class="line"><span>          op.Init(x, mean, variance, gamma, beta, rstd, y, epsilon, para);</span></span>
<span class="line"><span>          op.Process();</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span></code></pre></div></li></ol>`,17)])])}const u=n(i,[["render",p]]);export{g as __pageData,u as default};
