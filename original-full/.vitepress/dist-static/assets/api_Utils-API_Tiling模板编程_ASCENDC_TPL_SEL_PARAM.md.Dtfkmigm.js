import{c as n,Q as t,j as s,m as e}from"./chunks/framework.DOi4mjdC.js";const g=JSON.parse('{"title":"ASCENDC_TPL_SEL_PARAM","description":"","frontmatter":{},"headers":[{"level":1,"title":"ASCENDC\\\\_TPL\\\\_SEL\\\\_PARAM","slug":"ascendc_tpl_sel_param"},{"level":2,"title":"功能说明","slug":"功能说明"},{"level":2,"title":"函数原型","slug":"函数原型"},{"level":2,"title":"参数说明","slug":"参数说明"},{"level":2,"title":"返回值说明","slug":"返回值说明"},{"level":2,"title":"约束说明","slug":"约束说明"},{"level":2,"title":"调用示例","slug":"调用示例"}],"relativePath":"api/Utils-API/Tiling模板编程/ASCENDC_TPL_SEL_PARAM.md","filePath":"api/Utils-API/Tiling模板编程/ASCENDC_TPL_SEL_PARAM.md"}'),p={name:"api/Utils-API/Tiling模板编程/ASCENDC_TPL_SEL_PARAM.md"};function l(i,a,c,_,o,r){return t(),s("div",null,[...a[0]||(a[0]=[e(`<h1 id="ascendc-tpl-sel-param" tabindex="-1">ASCENDC_TPL_SEL_PARAM <a class="header-anchor" href="#ascendc-tpl-sel-param" aria-label="Permalink to &quot;ASCENDC\\_TPL\\_SEL\\_PARAM&quot;">​</a></h1><h2 id="功能说明" tabindex="-1">功能说明 <a class="header-anchor" href="#功能说明" aria-label="Permalink to &quot;功能说明&quot;">​</a></h2><p>Tiling模板编程时，开发者通过调用此接口自动生成并配置TilingKey。</p><p>使用该接口需要包含定义模板参数和模板参数组合的头文件。详细内容请参考<a href="./Tiling模板编程.html">Tiling模板编程</a>。</p><h2 id="函数原型" tabindex="-1">函数原型 <a class="header-anchor" href="#函数原型" aria-label="Permalink to &quot;函数原型&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#define ASCENDC_TPL_SEL_PARAM(context, ...)           \\</span></span>
<span class="line"><span>do {                                                  \\</span></span>
<span class="line"><span>    uint64_t key = GET_TPL_TILING_KEY({__VA_ARGS__}); \\</span></span>
<span class="line"><span>    context-&gt;SetTilingKey(key);                       \\</span></span>
<span class="line"><span>} while(0)</span></span>
<span class="line"><span>// context指代TilingFunc(gert::TilingContext *context)中的context</span></span></code></pre></div><h2 id="参数说明" tabindex="-1">参数说明 <a class="header-anchor" href="#参数说明" aria-label="Permalink to &quot;参数说明&quot;">​</a></h2><table tabindex="0"><thead><tr><th>参数</th><th>输入/输出</th><th>说明</th></tr></thead><tbody><tr><td>context</td><td>输入</td><td>TilingFunc注册上下文。</td></tr><tr><td>...</td><td>输入</td><td>可变长参数，模板参数的具体值，传入时需要与定义模板参数和模板参数组合的头文件中的模板参数顺序保持一致。</td></tr></tbody></table><h2 id="返回值说明" tabindex="-1">返回值说明 <a class="header-anchor" href="#返回值说明" aria-label="Permalink to &quot;返回值说明&quot;">​</a></h2><p>无</p><h2 id="约束说明" tabindex="-1">约束说明 <a class="header-anchor" href="#约束说明" aria-label="Permalink to &quot;约束说明&quot;">​</a></h2><p>无</p><h2 id="调用示例" tabindex="-1">调用示例 <a class="header-anchor" href="#调用示例" aria-label="Permalink to &quot;调用示例&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &quot;tiling_key_add_custom.h&quot;</span></span>
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
<span class="line"><span>    ASCENDC_TPL_SEL_PARAM(context, D_T_X, D_T_Y, D_T_Z, TILE_NUM, IS_SPLIT);</span></span>
<span class="line"><span>    size_t *currentWorkspace = context-&gt;GetWorkspaceSizes(1);</span></span>
<span class="line"><span>    currentWorkspace[0] = 0;</span></span>
<span class="line"><span>    return ge::GRAPH_SUCCESS;</span></span>
<span class="line"><span>}</span></span></code></pre></div>`,14)])])}const h=n(p,[["render",l]]);export{g as __pageData,h as default};
