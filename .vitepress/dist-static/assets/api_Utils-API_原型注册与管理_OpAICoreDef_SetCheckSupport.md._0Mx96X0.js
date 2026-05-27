import{c as s,Q as n,j as e,m as p}from"./chunks/framework.DOi4mjdC.js";const d=JSON.parse('{"title":"SetCheckSupport","description":"","frontmatter":{},"headers":[{"level":1,"title":"SetCheckSupport","slug":"setchecksupport"},{"level":2,"title":"功能说明","slug":"功能说明"},{"level":2,"title":"函数原型","slug":"函数原型"},{"level":2,"title":"参数说明","slug":"参数说明"},{"level":2,"title":"返回值说明","slug":"返回值说明"},{"level":2,"title":"约束说明","slug":"约束说明"},{"level":2,"title":"调用示例","slug":"调用示例"}],"relativePath":"api/Utils-API/原型注册与管理/OpAICoreDef/SetCheckSupport.md","filePath":"api/Utils-API/原型注册与管理/OpAICoreDef/SetCheckSupport.md"}'),t={name:"api/Utils-API/原型注册与管理/OpAICoreDef/SetCheckSupport.md"};function l(i,a,o,r,c,u){return n(),e("div",null,[...a[0]||(a[0]=[p(`<h1 id="setchecksupport" tabindex="-1">SetCheckSupport <a class="header-anchor" href="#setchecksupport" aria-label="Permalink to &quot;SetCheckSupport&quot;">​</a></h1><h2 id="功能说明" tabindex="-1">功能说明 <a class="header-anchor" href="#功能说明" aria-label="Permalink to &quot;功能说明&quot;">​</a></h2><p>如果您需要在算子融合阶段进行算子参数校验，则可实现算子参数校验回调函数，并通过该接口进行注册。同时，需要将<a href="./../OpAICoreConfig/NeedCheckSupportFlag.html">NeedCheckSupportFlag</a>参数配置为true，则算子编译和融合阶段会调用注册的算子参数校验函数进行相关信息的校验。</p><p>若算子参数校验函数校验通过，则代表AI Core支持此算子参数，会选择AI Core上相应的算子执行；否则，会继续查询AI CPU算子库然后执行。</p><h2 id="函数原型" tabindex="-1">函数原型 <a class="header-anchor" href="#函数原型" aria-label="Permalink to &quot;函数原型&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>OpAICoreDef &amp;SetCheckSupport(optiling::OP_CHECK_FUNC func)</span></span></code></pre></div><h2 id="参数说明" tabindex="-1">参数说明 <a class="header-anchor" href="#参数说明" aria-label="Permalink to &quot;参数说明&quot;">​</a></h2><table tabindex="0"><thead><tr><th>参数</th><th>输入/输出</th><th>说明</th></tr></thead><tbody><tr><td>func</td><td>输入</td><td>参数校验函数。OP_CHECK_FUNC类型定义如下： &lt;pre class=&quot;screen&quot; codetype=&quot;Cpp&quot; id=&quot;zh-cn_topic_0000001600467085_zh-cn_topic_0000001526442954_screen746910291708&quot;&gt;using OP_CHECK_FUNC = ge::graphStatus (*)(const ge::Operator &amp;op, ge::AscendString &amp;result);&lt;/pre&gt; 该函数的入参是算子的描述，包括算子的输入、输出、属性等信息，出参为包含了校验返回码和原因的字符串，字符串的格式如下： &lt;pre class=&quot;screen&quot; id=&quot;zh-cn_topic_0000001600467085_screen54391842185513&quot;&gt;{&quot;ret_code&quot;: &quot;1&quot;,&quot;reason&quot;: &quot;your reason&quot;}&lt;/pre&gt; 若校验成功，则函数返回ge::GRAPH_SUCCESS；若校验失败，则返回ge::GRAPH_FAILED。</td></tr></tbody></table><h2 id="返回值说明" tabindex="-1">返回值说明 <a class="header-anchor" href="#返回值说明" aria-label="Permalink to &quot;返回值说明&quot;">​</a></h2><p>OpAICoreDef请参考<a href="./OpAICoreDef.html">OpAICoreDef</a>。</p><h2 id="约束说明" tabindex="-1">约束说明 <a class="header-anchor" href="#约束说明" aria-label="Permalink to &quot;约束说明&quot;">​</a></h2><p>无</p><h2 id="调用示例" tabindex="-1">调用示例 <a class="header-anchor" href="#调用示例" aria-label="Permalink to &quot;调用示例&quot;">​</a></h2><p>下文展示了自定义Add算子参数校验函数实现和注册的样例。</p><ul><li><p>参数校验函数实现如下：对第一个输入参数的shape进行校验，仅支持输入x shape的第一个维度为8，否则不支持。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static ge::graphStatus CheckSupported(const ge::Operator &amp;op, ge::AscendString &amp;result)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    std::string resultJsonStr;</span></span>
<span class="line"><span>    // 仅支持第一个输入参数shape的第一个维度为8，其他shape不支持</span></span>
<span class="line"><span>    if (op.GetInputDesc(0).GetShape().GetDim(0) == 8) {</span></span>
<span class="line"><span>        resultJsonStr = R&quot;({&quot;ret_code&quot;: &quot;1&quot;,&quot;reason&quot;: &quot;x.dim[0] is 8&quot;})&quot;;</span></span>
<span class="line"><span>        result = ge::AscendString(resultJsonStr.c_str());</span></span>
<span class="line"><span>        return ge::GRAPH_SUCCESS;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    resultJsonStr = R&quot;({&quot;ret_code&quot;: &quot;0&quot;,&quot;reason&quot;: &quot;xxx&quot;})&quot;;</span></span>
<span class="line"><span>    result = ge::AscendString(resultJsonStr.c_str());</span></span>
<span class="line"><span>    return ge::GRAPH_FAILED;</span></span>
<span class="line"><span>}</span></span></code></pre></div></li><li><p>参数校验函数注册的样例如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class AddCustom : public OpDef {</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    AddCustom(const char* name) : OpDef(name)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        this-&gt;Input(&quot;x&quot;)</span></span>
<span class="line"><span>            .ParamType(REQUIRED);</span></span>
<span class="line"><span>        this-&gt;Input(&quot;y&quot;)</span></span>
<span class="line"><span>            .ParamType(REQUIRED);</span></span>
<span class="line"><span>        this-&gt;Output(&quot;z&quot;)</span></span>
<span class="line"><span>            .ParamType(REQUIRED);</span></span>
<span class="line"><span>        this-&gt;SetInferShape(ge::InferShape);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        this-&gt;AICore()</span></span>
<span class="line"><span>            .SetTiling(optiling::TilingFunc)</span></span>
<span class="line"><span>            .SetTilingParse(optiling::TilingPrepare)</span></span>
<span class="line"><span>            .SetOpSelectFormat(optiling::OpSelectFormat)</span></span>
<span class="line"><span>            .SetCheckSupport(optiling::CheckSupported);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        OpAICoreConfig aicConfig;</span></span>
<span class="line"><span>        aicConfig.DynamicCompileStaticFlag(true)</span></span>
<span class="line"><span>            .DynamicFormatFlag(true)</span></span>
<span class="line"><span>            .DynamicRankSupportFlag(true)</span></span>
<span class="line"><span>            .DynamicShapeSupportFlag(true)</span></span>
<span class="line"><span>            .NeedCheckSupportFlag(true)</span></span>
<span class="line"><span>            .PrecisionReduceFlag(true);</span></span>
<span class="line"><span>        // 注意：soc_version请替换成实际的AI处理器型号</span></span>
<span class="line"><span>        this-&gt;AICore().AddConfig(&quot;soc_version&quot;, aicConfig);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>};</span></span></code></pre></div></li></ul>`,15)])])}const g=s(t,[["render",l]]);export{d as __pageData,g as default};
