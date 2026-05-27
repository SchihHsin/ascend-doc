import{c as s,Q as n,j as t,m as e}from"./chunks/framework.DOi4mjdC.js";const m=JSON.parse('{"title":"GetDropOutMaxMinTmpSize","description":"","frontmatter":{},"headers":[{"level":1,"title":"GetDropOutMaxMinTmpSize","slug":"getdropoutmaxmintmpsize"},{"level":2,"title":"功能说明","slug":"功能说明"},{"level":2,"title":"函数原型","slug":"函数原型"},{"level":2,"title":"参数说明","slug":"参数说明"},{"level":2,"title":"返回值说明","slug":"返回值说明"},{"level":2,"title":"约束说明","slug":"约束说明"},{"level":2,"title":"调用示例","slug":"调用示例"}],"relativePath":"api/SIMD-API/高阶API/数据过滤/GetDropOutMaxMinTmpSize.md","filePath":"api/SIMD-API/高阶API/数据过滤/GetDropOutMaxMinTmpSize.md"}'),p={name:"api/SIMD-API/高阶API/数据过滤/GetDropOutMaxMinTmpSize.md"};function i(l,a,o,c,r,u){return n(),t("div",null,[...a[0]||(a[0]=[e(`<h1 id="getdropoutmaxmintmpsize" tabindex="-1">GetDropOutMaxMinTmpSize <a class="header-anchor" href="#getdropoutmaxmintmpsize" aria-label="Permalink to &quot;GetDropOutMaxMinTmpSize&quot;">​</a></h1><h2 id="功能说明" tabindex="-1">功能说明 <a class="header-anchor" href="#功能说明" aria-label="Permalink to &quot;功能说明&quot;">​</a></h2><p>用于获取DropOut Tiling参数。</p><h2 id="函数原型" tabindex="-1">函数原型 <a class="header-anchor" href="#函数原型" aria-label="Permalink to &quot;函数原型&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>uint32_t GetDropOutMaxTmpSize(const ge::Shape&amp; srcShape, const uint32_t typeSize, const bool isReuseSource)</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>uint32_t GetDropOutMinTmpSize(const ge::Shape&amp; srcShape, const uint32_t typeSize, const bool isReuseSource)</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void GetDropOutMaxMinTmpSize(const ge::Shape&amp; srcShape, const uint32_t typeSize, const bool isReuseSource, uint32_t&amp; maxValue, uint32_t&amp; minValue)</span></span></code></pre></div><h2 id="参数说明" tabindex="-1">参数说明 <a class="header-anchor" href="#参数说明" aria-label="Permalink to &quot;参数说明&quot;">​</a></h2><p><strong>表 1</strong> 参数列表</p><table tabindex="0"><thead><tr><th>参数名</th><th>输入/输出</th><th>描述</th></tr></thead><tbody><tr><td>srcShape</td><td>输入</td><td>输入的shape信息。</td></tr><tr><td>typeSize</td><td>输入</td><td>计算的数据类型大小，half=2，float=4。</td></tr><tr><td>isReuseSource</td><td>输入</td><td>预留参数，暂未启用，保持默认值false即可。</td></tr><tr><td>maxValue</td><td>输出</td><td>输出DropOut接口所需的tiling信息（最大临时空间大小）。 说明： maxValue仅作为参考值，有可能大于Unified Buffer剩余空间的大小，该场景下，开发者需要根据Unified Buffer剩余空间的大小来选取合适的临时空间大小。</td></tr><tr><td>minValue</td><td>输出</td><td>输出DropOut接口所需的tiling信息（最小临时空间大小）。</td></tr></tbody></table><h2 id="返回值说明" tabindex="-1">返回值说明 <a class="header-anchor" href="#返回值说明" aria-label="Permalink to &quot;返回值说明&quot;">​</a></h2><p>GetDropOutMaxTmpSize返回DropOut接口能完成计算所需最大临时空间大小。</p><p>GetDropOutMinTmpSize返回DropOut接口能完成计算所需最小临时空间大小。</p><p>GetDropOutMaxMinTmpSize无返回值。</p><h2 id="约束说明" tabindex="-1">约束说明 <a class="header-anchor" href="#约束说明" aria-label="Permalink to &quot;约束说明&quot;">​</a></h2><p>无</p><h2 id="调用示例" tabindex="-1">调用示例 <a class="header-anchor" href="#调用示例" aria-label="Permalink to &quot;调用示例&quot;">​</a></h2><p>下文呈现了一个host侧调用<strong>GetDropOutMaxMinTmpSize</strong>接口的使用示例，通过该接口获取DropOut计算所需的最大最小临时空间大小，开发者基于此范围选择合适的空间大小作为Tiling参数传递到kernel侧使用。配套的kernel侧使用样例请参考<a href="./DropOut.html#section642mcpsimp">调用示例</a>。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &lt;vector&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#include &quot;register/op_def_registry.h&quot;</span></span>
<span class="line"><span>#include &quot;register/tilingdata_base.h&quot;</span></span>
<span class="line"><span>#include &quot;tiling/tiling_api.h&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>namespace optiling {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>BEGIN_TILING_DATA_DEF(DropoutCustomTilingData)</span></span>
<span class="line"><span>    TILING_DATA_FIELD_DEF(uint32_t, firstAxis);</span></span>
<span class="line"><span>    TILING_DATA_FIELD_DEF(uint32_t, srcLastAxis);</span></span>
<span class="line"><span>    TILING_DATA_FIELD_DEF(uint32_t, maskLastAxis);</span></span>
<span class="line"><span>    TILING_DATA_FIELD_DEF(uint32_t, tmpBufferSize);</span></span>
<span class="line"><span>END_TILING_DATA_DEF;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static ge::graphStatus TilingFunc(gert::TilingContext* context)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    // Input source shapes.</span></span>
<span class="line"><span>    int64_t firstAxis = 16;</span></span>
<span class="line"><span>    int64_t srcLastAxis = 64;</span></span>
<span class="line"><span>    int64_t maskLastAxis = 64;</span></span>
<span class="line"><span>	</span></span>
<span class="line"><span>    std::vector&lt;int64_t&gt; srcDims = {firstAxis, srcLastAxis, maskLastAxis};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    uint32_t typeSize = 2;</span></span>
<span class="line"><span>    ge::Shape shape(srcDims);</span></span>
<span class="line"><span>    uint32_t minValue = 0;</span></span>
<span class="line"><span>    uint32_t maxValue = 0;</span></span>
<span class="line"><span>    AscendC::GetDropOutMaxMinTmpSize(shape, typeSize, false, maxValue, minValue);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    auto platformInfo = context-&gt;GetPlatformInfo();</span></span>
<span class="line"><span>    auto ascendcPlatform = platform_ascendc::PlatformAscendC(platformInfo);</span></span>
<span class="line"><span>    uint64_t tailSize = 0; // ub剩余空间大小</span></span>
<span class="line"><span>    ascendcPlatform.GetCoreMemSize(platform_ascendc::CoreMemType::UB, tailSize); // 本样例中使用完整的ub空间，实际情况下tailSize需要减掉用户已使用的ub空间</span></span>
<span class="line"><span>    auto tmpSize = tailSize &gt;= maxValue ? maxValue : tailSize;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    DropoutCustomTilingData tiling;</span></span>
<span class="line"><span>    tiling.set_firstAxis(firstAxis);</span></span>
<span class="line"><span>    tiling.set_srcLastAxis(srcLastAxis);</span></span>
<span class="line"><span>    tiling.set_maskLastAxis(maskLastAxis);	</span></span>
<span class="line"><span>    tiling.set_tmpBufferSize(tmpSize);</span></span>
<span class="line"><span>    context-&gt;SetBlockDim(1);</span></span>
<span class="line"><span>    tiling.SaveToBuffer(context-&gt;GetRawTilingData()-&gt;GetData(), context-&gt;GetRawTilingData()-&gt;GetCapacity());</span></span>
<span class="line"><span>    context-&gt;GetRawTilingData()-&gt;SetDataSize(tiling.GetDataSize());</span></span>
<span class="line"><span>    context-&gt;SetTilingKey(1);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return ge::GRAPH_SUCCESS;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>} // namespace optiling</span></span></code></pre></div>`,19)])])}const h=s(p,[["render",i]]);export{m as __pageData,h as default};
