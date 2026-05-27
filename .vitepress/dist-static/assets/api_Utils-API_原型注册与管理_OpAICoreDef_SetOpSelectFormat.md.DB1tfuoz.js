import{c as a,Q as n,j as s,m as e}from"./chunks/framework.DOi4mjdC.js";const d=JSON.parse('{"title":"SetOpSelectFormat","description":"","frontmatter":{},"headers":[{"level":1,"title":"SetOpSelectFormat","slug":"setopselectformat"},{"level":2,"title":"功能说明","slug":"功能说明"},{"level":2,"title":"函数原型","slug":"函数原型"},{"level":2,"title":"参数说明","slug":"参数说明"},{"level":2,"title":"返回值说明","slug":"返回值说明"},{"level":2,"title":"约束说明","slug":"约束说明"},{"level":2,"title":"调用示例","slug":"调用示例"}],"relativePath":"api/Utils-API/原型注册与管理/OpAICoreDef/SetOpSelectFormat.md","filePath":"api/Utils-API/原型注册与管理/OpAICoreDef/SetOpSelectFormat.md"}'),o={name:"api/Utils-API/原型注册与管理/OpAICoreDef/SetOpSelectFormat.md"};function p(u,t,l,i,q,r){return n(),s("div",null,[...t[0]||(t[0]=[e(`<h1 id="setopselectformat" tabindex="-1">SetOpSelectFormat <a class="header-anchor" href="#setopselectformat" aria-label="Permalink to &quot;SetOpSelectFormat&quot;">​</a></h1><h2 id="功能说明" tabindex="-1">功能说明 <a class="header-anchor" href="#功能说明" aria-label="Permalink to &quot;功能说明&quot;">​</a></h2><p>如果您需要自行推导算子输入输出所支持的数据类型与格式，则可实现推导回调函数，并通过该接口进行注册。同时需要将<a href="./../OpAICoreConfig/DynamicFormatFlag.html">DynamicFormatFlag</a>配置为true，则算子融合时会自动调用推导函数进行数据类型与格式的设置，算子原型注册时无需配置输入输出支持的数据类型与格式。</p><p>注意，如果算子原型已经注册过数据类型与格式，则以算子原型注册的数据类型与格式为准，即使注册了推导函数也不会执行。</p><h2 id="函数原型" tabindex="-1">函数原型 <a class="header-anchor" href="#函数原型" aria-label="Permalink to &quot;函数原型&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>OpAICoreDef &amp;SetOpSelectFormat(optiling::OP_CHECK_FUNC func)</span></span></code></pre></div><h2 id="参数说明" tabindex="-1">参数说明 <a class="header-anchor" href="#参数说明" aria-label="Permalink to &quot;参数说明&quot;">​</a></h2><table tabindex="0"><thead><tr><th>参数</th><th>输入/输出</th><th>说明</th></tr></thead><tbody><tr><td>func</td><td>输入</td><td>推导算子输入输出所支持数据类型与格式的函数。OP_CHECK_FUNC类型定义如下： &lt;pre class=&quot;screen&quot; codetype=&quot;Cpp&quot; id=&quot;zh-cn_topic_0000001626409757_zh-cn_topic_0000001526442954_screen746910291708&quot;&gt;using OP_CHECK_FUNC = ge::graphStatus (*)(const ge::Operator &amp;op, ge::AscendString &amp;result);&lt;/pre&gt; 该函数的入参是算子的描述，包括算子的输入、输出、属性等信息，出参为包含了当前算子输入输出支持的数据类型与格式列表的字符串，字符串的格式样例如下： &lt;pre class=&quot;screen&quot; id=&quot;zh-cn_topic_0000001626409757_screen11586142152320&quot;&gt;{ &quot;input0&quot;: {&quot;name&quot;: &quot;x&quot;,&quot;dtype&quot;: &quot;float16,float32,int32&quot;,&quot;format&quot;: &quot;ND,ND,ND&quot;}, &quot;input1&quot;: {&quot;name&quot;: &quot;y&quot;,&quot;dtype&quot;: &quot;float16,float32,int32&quot;,&quot;format&quot;: &quot;ND,ND,ND&quot;}, &quot;output0&quot;: {&quot;name&quot;: &quot;z&quot;,&quot;dtype&quot;: &quot;float16,float32,int32&quot;,&quot;format&quot;: &quot;ND,ND,ND&quot;} }&lt;/pre&gt;</td></tr></tbody></table><h2 id="返回值说明" tabindex="-1">返回值说明 <a class="header-anchor" href="#返回值说明" aria-label="Permalink to &quot;返回值说明&quot;">​</a></h2><p>OpAICoreDef算子定义，OpAICoreDef请参考<a href="./OpAICoreDef.html">OpAICoreDef</a>。</p><h2 id="约束说明" tabindex="-1">约束说明 <a class="header-anchor" href="#约束说明" aria-label="Permalink to &quot;约束说明&quot;">​</a></h2><p>无</p><h2 id="调用示例" tabindex="-1">调用示例 <a class="header-anchor" href="#调用示例" aria-label="Permalink to &quot;调用示例&quot;">​</a></h2><p>如下展示了自定义Add算子推导函数实现和注册的样例。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static ge::graphStatus OpSelectFormat(const ge::Operator &amp;op, ge::AscendString &amp;result)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    std::string resultJsonStr;</span></span>
<span class="line"><span>    // 如果本次执行第一个输入参数shape的第一个维度&lt;=8，则支持更多的格式，否则仅支持int32</span></span>
<span class="line"><span>    if (op.GetInputDesc(0).GetShape().GetDim(0) &lt;= 8) {</span></span>
<span class="line"><span>        resultJsonStr = R&quot;({</span></span>
<span class="line"><span>        &quot;input0&quot;: {&quot;name&quot;: &quot;x&quot;,&quot;dtype&quot;: &quot;float16,float32,int32&quot;,&quot;format&quot;: &quot;ND,ND,ND&quot;,&quot;unknownshape_format&quot;: &quot;ND,ND,ND&quot;},</span></span>
<span class="line"><span>        &quot;input1&quot;: {&quot;name&quot;: &quot;y&quot;,&quot;dtype&quot;: &quot;float16,float32,int32&quot;,&quot;format&quot;: &quot;ND,ND,ND&quot;,&quot;unknownshape_format&quot;: &quot;ND,ND,ND&quot;},</span></span>
<span class="line"><span>        &quot;output0&quot;: {&quot;name&quot;: &quot;z&quot;,&quot;dtype&quot;: &quot;float16,float32,int32&quot;,&quot;format&quot;: &quot;ND,ND,ND&quot;,&quot;unknownshape_format&quot;: &quot;ND,ND,ND&quot;}</span></span>
<span class="line"><span>        })&quot;;</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        resultJsonStr = R&quot;({</span></span>
<span class="line"><span>        &quot;input0&quot;: {&quot;name&quot;: &quot;x&quot;,&quot;dtype&quot;: &quot;int32&quot;,&quot;format&quot;: &quot;ND&quot;,&quot;unknownshape_format&quot;: &quot;ND&quot;},</span></span>
<span class="line"><span>        &quot;input1&quot;: {&quot;name&quot;: &quot;y&quot;,&quot;dtype&quot;: &quot;int32&quot;,&quot;format&quot;: &quot;ND&quot;,&quot;unknownshape_format&quot;: &quot;ND&quot;},</span></span>
<span class="line"><span>        &quot;output0&quot;: {&quot;name&quot;: &quot;z&quot;,&quot;dtype&quot;: &quot;int32&quot;,&quot;format&quot;: &quot;ND&quot;,&quot;unknownshape_format&quot;: &quot;ND&quot;}</span></span>
<span class="line"><span>        })&quot;;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    result = ge::AscendString(resultJsonStr.c_str());</span></span>
<span class="line"><span>    return ge::GRAPH_SUCCESS;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>推导函数的注册样例如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class AddCustom : public OpDef {</span></span>
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
<span class="line"><span>        this-&gt;AICore()</span></span>
<span class="line"><span>            .SetTiling(optiling::TilingFunc)</span></span>
<span class="line"><span>            .SetTilingParse(optiling::TilingPrepare)</span></span>
<span class="line"><span>            .SetOpSelectFormat(optiling::OpSelectFormat);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        OpAICoreConfig aicConfig;</span></span>
<span class="line"><span>        aicConfig.DynamicCompileStaticFlag(true)</span></span>
<span class="line"><span>            .DynamicFormatFlag(true)</span></span>
<span class="line"><span>            .DynamicRankSupportFlag(true)</span></span>
<span class="line"><span>            .DynamicShapeSupportFlag(true)</span></span>
<span class="line"><span>            .NeedCheckSupportFlag(false)</span></span>
<span class="line"><span>            .PrecisionReduceFlag(true);</span></span>
<span class="line"><span>        // 注意：soc_version请替换成实际的AI处理器型号</span></span>
<span class="line"><span>        this-&gt;AICore().AddConfig(&quot;soc_version&quot;, aicConfig);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>};</span></span></code></pre></div>`,17)])])}const h=a(o,[["render",p]]);export{d as __pageData,h as default};
