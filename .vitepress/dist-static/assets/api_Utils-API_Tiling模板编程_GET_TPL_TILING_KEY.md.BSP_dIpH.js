import{c as n,Q as s,j as t,m as e}from"./chunks/framework.DOi4mjdC.js";const T=JSON.parse('{"title":"GET_TPL_TILING_KEY","description":"","frontmatter":{},"headers":[{"level":1,"title":"GET\\\\_TPL\\\\_TILING\\\\_KEY","slug":"get_tpl_tiling_key"},{"level":2,"title":"功能说明","slug":"功能说明"},{"level":2,"title":"函数原型","slug":"函数原型"},{"level":2,"title":"参数说明","slug":"参数说明"},{"level":2,"title":"返回值说明","slug":"返回值说明"},{"level":2,"title":"约束说明","slug":"约束说明"},{"level":2,"title":"调用示例","slug":"调用示例"}],"relativePath":"api/Utils-API/Tiling模板编程/GET_TPL_TILING_KEY.md","filePath":"api/Utils-API/Tiling模板编程/GET_TPL_TILING_KEY.md"}'),l={name:"api/Utils-API/Tiling模板编程/GET_TPL_TILING_KEY.md"};function i(p,a,c,_,g,o){return s(),t("div",null,[...a[0]||(a[0]=[e(`<h1 id="get-tpl-tiling-key" tabindex="-1">GET_TPL_TILING_KEY <a class="header-anchor" href="#get-tpl-tiling-key" aria-label="Permalink to &quot;GET\\_TPL\\_TILING\\_KEY&quot;">​</a></h1><h2 id="功能说明" tabindex="-1">功能说明 <a class="header-anchor" href="#功能说明" aria-label="Permalink to &quot;功能说明&quot;">​</a></h2><p>Tiling模板编程时，开发者通过调用此接口自动生成TilingKey。该接口将传入的模板参数通过定义的位宽，转成二进制，按照顺序组合后转成uint64数值，即TilingKey。</p><p>使用该接口需要包含定义模板参数和模板参数组合的头文件。详细内容请参考<a href="./Tiling模板编程.html">Tiling模板编程</a>。</p><h2 id="函数原型" tabindex="-1">函数原型 <a class="header-anchor" href="#函数原型" aria-label="Permalink to &quot;函数原型&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>namespace AscendC {</span></span>
<span class="line"><span>    uint64_t EncodeTilingKey(TilingDeclareParams declareParams,</span></span>
<span class="line"><span>                             TilingSelectParams selectParamsVec,</span></span>
<span class="line"><span>                             std::vector&lt;uint64_t&gt; tilingParams);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#define GET_TPL_TILING_KEY(...) \\</span></span>
<span class="line"><span>    AscendC::EncodeTilingKey(g_tilingDeclareParams, g_tilingSelectParams, {__VA_ARGS__}) // GET_TPL_TILING_KEY通过调用EncodeTilingKey接口生成TilingKey， EncodeTilingKey属于内部关联接口，开发者无需关注</span></span></code></pre></div><h2 id="参数说明" tabindex="-1">参数说明 <a class="header-anchor" href="#参数说明" aria-label="Permalink to &quot;参数说明&quot;">​</a></h2><table tabindex="0"><thead><tr><th>参数</th><th>输入/输出</th><th>说明</th></tr></thead><tbody><tr><td>...</td><td>输入</td><td>可变长参数，模板参数的具体值，传入时需要与定义模板参数和模板参数组合的头文件中的模板参数顺序保持一致。</td></tr></tbody></table><h2 id="返回值说明" tabindex="-1">返回值说明 <a class="header-anchor" href="#返回值说明" aria-label="Permalink to &quot;返回值说明&quot;">​</a></h2><p>TilingKey数值。</p><h2 id="约束说明" tabindex="-1">约束说明 <a class="header-anchor" href="#约束说明" aria-label="Permalink to &quot;约束说明&quot;">​</a></h2><p>无。</p><h2 id="调用示例" tabindex="-1">调用示例 <a class="header-anchor" href="#调用示例" aria-label="Permalink to &quot;调用示例&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &quot;tiling_key_add_custom.h&quot;</span></span>
<span class="line"><span>static ge::graphStatus TilingFunc(gert::TilingContext *context)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    TilingDataTemplate tiling;</span></span>
<span class="line"><span>    uint32_t totalLength = context-&gt;GetInputShape(0)-&gt;GetOriginShape().GetShapeSize();</span></span>
<span class="line"><span>    ge::DataType dtype_x = context-&gt;GetInputDesc(0)-&gt;GetDataType();</span></span>
<span class="line"><span>    ge::DataType dtype_y = context-&gt;GetInputDesc(1)-&gt;GetDataType();</span></span>
<span class="line"><span>    ge::DataType dtype_z = context-&gt;GetOutputDesc(0)-&gt;GetDataType();</span></span>
<span class="line"><span>    uint32_t D_T_X = static_cast&lt;int&gt;(dtype_x), D_T_Y = static_cast&lt;int&gt;(dtype_y), D_T_Z = static_cast&lt;int&gt;(dtype_z), TILE_NUM = 1, IS_SPLIT = 0;</span></span>
<span class="line"><span>    if (totalLength &lt; MIN_LENGTH_FOR_SPLIT) {</span></span>
<span class="line"><span>        IS_SPLIT = 0;</span></span>
<span class="line"><span>        TILE_NUM = 1;</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        IS_SPLIT = 1;</span></span>
<span class="line"><span>        TILE_NUM = DEFAULT_TILE_NUM;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    context-&gt;SetBlockDim(NUM_BLOCKS);</span></span>
<span class="line"><span>    tiling.set_totalLength(totalLength);</span></span>
<span class="line"><span>    tiling.SaveToBuffer(context-&gt;GetRawTilingData()-&gt;GetData(), context-&gt;GetRawTilingData()-&gt;GetCapacity());</span></span>
<span class="line"><span>    context-&gt;GetRawTilingData()-&gt;SetDataSize(tiling.GetDataSize());</span></span>
<span class="line"><span>    const uint64_t tilingKey = GET_TPL_TILING_KEY(D_T_X, D_T_Y, D_T_Z, TILE_NUM, IS_SPLIT);  // 模板参数tilingkey配置</span></span>
<span class="line"><span>    context-&gt;SetTilingKey(tilingKey);</span></span>
<span class="line"><span>    size_t *currentWorkspace = context-&gt;GetWorkspaceSizes(1);</span></span>
<span class="line"><span>    currentWorkspace[0] = 0;</span></span>
<span class="line"><span>    return ge::GRAPH_SUCCESS;</span></span>
<span class="line"><span>}</span></span></code></pre></div>`,14)])])}const d=n(l,[["render",i]]);export{T as __pageData,d as default};
