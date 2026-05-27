import{c as a,Q as s,j as n,m as p}from"./chunks/framework.DOi4mjdC.js";const O=JSON.parse('{"title":"OpAttrDef","description":"","frontmatter":{},"headers":[{"level":1,"title":"OpAttrDef","slug":"opattrdef"},{"level":2,"title":"功能说明","slug":"功能说明"},{"level":2,"title":"函数原型","slug":"函数原型"},{"level":2,"title":"函数说明","slug":"函数说明"}],"relativePath":"api/Utils-API/原型注册与管理/OpAttrDef/OpAttrDef-272.md","filePath":"api/Utils-API/原型注册与管理/OpAttrDef/OpAttrDef-272.md"}'),e={name:"api/Utils-API/原型注册与管理/OpAttrDef/OpAttrDef-272.md"};function d(l,t,r,i,o,c){return s(),n("div",null,[...t[0]||(t[0]=[p(`<h1 id="opattrdef" tabindex="-1">OpAttrDef <a class="header-anchor" href="#opattrdef" aria-label="Permalink to &quot;OpAttrDef&quot;">​</a></h1><h2 id="功能说明" tabindex="-1">功能说明 <a class="header-anchor" href="#功能说明" aria-label="Permalink to &quot;功能说明&quot;">​</a></h2><p>定义算子属性。</p><h2 id="函数原型" tabindex="-1">函数原型 <a class="header-anchor" href="#函数原型" aria-label="Permalink to &quot;函数原型&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class OpAttrDef {</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>  explicit OpAttrDef(const char *name);</span></span>
<span class="line"><span>  OpAttrDef(const OpAttrDef &amp;attr_def);</span></span>
<span class="line"><span>  ~OpAttrDef();</span></span>
<span class="line"><span>  OpAttrDef &amp;operator=(const OpAttrDef &amp;attr_def);</span></span>
<span class="line"><span>  OpAttrDef &amp;AttrType(Option attr_type);</span></span>
<span class="line"><span>  OpAttrDef &amp;Bool(void);</span></span>
<span class="line"><span>  OpAttrDef &amp;Bool(bool value);</span></span>
<span class="line"><span>  OpAttrDef &amp;Float(void);</span></span>
<span class="line"><span>  OpAttrDef &amp;Float(float value);</span></span>
<span class="line"><span>  OpAttrDef &amp;Int(void);</span></span>
<span class="line"><span>  OpAttrDef &amp;Int(int64_t value);</span></span>
<span class="line"><span>  OpAttrDef &amp;String(void);</span></span>
<span class="line"><span>  OpAttrDef &amp;String(const char *value);</span></span>
<span class="line"><span>  OpAttrDef &amp;ListBool(void);</span></span>
<span class="line"><span>  OpAttrDef &amp;ListBool(std::vector&lt;bool&gt; value);</span></span>
<span class="line"><span>  OpAttrDef &amp;ListFloat(void);</span></span>
<span class="line"><span>  OpAttrDef &amp;ListFloat(std::vector&lt;float&gt; value);</span></span>
<span class="line"><span>  OpAttrDef &amp;ListInt(void);</span></span>
<span class="line"><span>  OpAttrDef &amp;ListInt(std::vector&lt;int64_t&gt; value);</span></span>
<span class="line"><span>  OpAttrDef &amp;ListListInt(void);</span></span>
<span class="line"><span>  OpAttrDef &amp;ListListInt(std::vector&lt;std::vector&lt;int64_t&gt;&gt; value);</span></span>
<span class="line"><span>  OpAttrDef &amp;Version(uint32_t version);</span></span>
<span class="line"><span>  ge::AscendString &amp;GetName(void) const;</span></span>
<span class="line"><span>  bool IsRequired(void);</span></span>
<span class="line"><span>private:</span></span>
<span class="line"><span>  ...</span></span>
<span class="line"><span>};</span></span></code></pre></div><h2 id="函数说明" tabindex="-1">函数说明 <a class="header-anchor" href="#函数说明" aria-label="Permalink to &quot;函数说明&quot;">​</a></h2><p><strong>表 1</strong> OpAttrDef类成员函数说明</p><table tabindex="0"><thead><tr><th>函数名称</th><th>入参说明</th><th>功能说明</th></tr></thead><tbody><tr><td>AttrType</td><td>attr_type: 属性类型</td><td>设置算子属性类型，取值为：OPTIONAL（可选）、REQUIRED（必选）。</td></tr><tr><td>Bool</td><td>无</td><td>设置算子属性数据类型为Bool</td></tr><tr><td>Bool</td><td>value</td><td>设置算子属性数据类型为Bool，并设置属性默认值为value。属性类型设置为OPTIONAL时必须调用该类接口设置默认值。</td></tr><tr><td>Float</td><td>无</td><td>设置算子属性数据类型为Float</td></tr><tr><td>Float</td><td>value</td><td>设置算子属性数据类型为Float，并设置属性默认值为value。属性类型设置为OPTIONAL时必须调用该类接口设置默认值。</td></tr><tr><td>Int</td><td>无</td><td>设置算子属性数据类型为Int</td></tr><tr><td>Int</td><td>value</td><td>设置算子属性数据类型为Int，并设置属性默认值为value。属性类型设置为OPTIONAL时必须调用该类接口设置默认值。</td></tr><tr><td>String</td><td>无</td><td>设置算子属性数据类型为String</td></tr><tr><td>String</td><td>value</td><td>设置算子属性数据类型为String，并设置属性默认值为value。属性类型设置为OPTIONAL时必须调用该类接口设置默认值。</td></tr><tr><td>ListBool</td><td>无</td><td>设置算子属性数据类型为ListBool</td></tr><tr><td>ListBool</td><td>value</td><td>设置算子属性数据类型为ListBool，并设置属性默认值为value。属性类型设置为OPTIONAL时必须调用该类接口设置默认值。</td></tr><tr><td>ListFloat</td><td>无</td><td>设置算子属性数据类型为ListFloat</td></tr><tr><td>ListFloat</td><td>value</td><td>设置算子属性数据类型为ListFloat，并设置属性默认值为value。属性类型设置为OPTIONAL时必须调用该类接口设置默认值。</td></tr><tr><td>ListInt</td><td>无</td><td>设置算子属性数据类型为ListInt</td></tr><tr><td>ListInt</td><td>value</td><td>设置算子属性数据类型为ListInt，并设置属性默认值为value。属性类型设置为OPTIONAL时必须调用该类接口设置默认值。</td></tr><tr><td>ListListInt</td><td>无</td><td>设置算子属性数据类型为ListListInt</td></tr><tr><td>ListListInt</td><td>value</td><td>设置算子属性数据类型为ListListInt，并设置属性默认值为value。属性类型设置为OPTIONAL时必须调用该类接口设置默认值。</td></tr><tr><td>Version</td><td>version：配置的版本号</td><td>新增可选属性时，为了保持原有单算子API(aclnnxxx)接口的兼容性，可以通过Version接口配置aclnn接口的版本号，版本号需要从1开始配，且应该连续配置（和可选输入统一编号）。配置后，自动生成的aclnn接口会携带版本号。高版本号的接口会包含低版本号接口的所有参数。</td></tr><tr><td>GetName</td><td>无</td><td>获取属性名称。</td></tr><tr><td>IsRequired</td><td>无</td><td>判断算子属性是否为必选，必选返回true，可选返回false。</td></tr></tbody></table>`,8)])])}const A=a(e,[["render",d]]);export{O as __pageData,A as default};
