import{c as a,Q as n,j as t,m as e}from"./chunks/framework.DOi4mjdC.js";const m=JSON.parse('{"title":"is_same","description":"","frontmatter":{},"headers":[{"level":1,"title":"is\\\\_same","slug":"is_same"},{"level":2,"title":"产品支持情况","slug":"产品支持情况"},{"level":2,"title":"功能说明","slug":"功能说明"},{"level":2,"title":"函数原型","slug":"函数原型"},{"level":2,"title":"参数说明","slug":"参数说明"},{"level":2,"title":"约束说明","slug":"约束说明"},{"level":2,"title":"返回值说明","slug":"返回值说明"},{"level":2,"title":"调用示例","slug":"调用示例"}],"relativePath":"api/Utils-API/C++标准库/类型特性/is_same.md","filePath":"api/Utils-API/C++标准库/类型特性/is_same.md"}'),l={name:"api/Utils-API/C++标准库/类型特性/is_same.md"};function p(i,s,d,c,o,r){return n(),t("div",null,[...s[0]||(s[0]=[e(`<h1 id="is-same" tabindex="-1">is_same <a class="header-anchor" href="#is-same" aria-label="Permalink to &quot;is\\_same&quot;">​</a></h1><h2 id="产品支持情况" tabindex="-1">产品支持情况 <a class="header-anchor" href="#产品支持情况" aria-label="Permalink to &quot;产品支持情况&quot;">​</a></h2><table tabindex="0"><thead><tr><th>产品</th><th>是否支持</th></tr></thead><tbody><tr><td>Ascend 950PR/Ascend 950DT</td><td>√</td></tr><tr><td>Atlas A3 训练系列产品/Atlas A3 推理系列产品</td><td>√</td></tr><tr><td>Atlas A2 训练系列产品/Atlas A2 推理系列产品</td><td>√</td></tr><tr><td>Atlas 200I/500 A2 推理产品</td><td>x</td></tr><tr><td>Atlas 推理系列产品AI Core</td><td>x</td></tr><tr><td>Atlas 推理系列产品Vector Core</td><td>x</td></tr><tr><td>Atlas 训练系列产品</td><td>x</td></tr></tbody></table><h2 id="功能说明" tabindex="-1">功能说明 <a class="header-anchor" href="#功能说明" aria-label="Permalink to &quot;功能说明&quot;">​</a></h2><p>is_same是定义在&lt;type_traits&gt;头文件里的一个类型特征工具，它能够在程序编译时判断两个类型是否完全相同。本接口可应用在模板元编程、类型检查、条件编译等场景，用于在编译阶段确定类型信息，避免运行时可能出现的类型不匹配问题。</p><h2 id="函数原型" tabindex="-1">函数原型 <a class="header-anchor" href="#函数原型" aria-label="Permalink to &quot;函数原型&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>template &lt;typename Tp, typename Up&gt;</span></span>
<span class="line"><span>struct is_same;</span></span></code></pre></div><h2 id="参数说明" tabindex="-1">参数说明 <a class="header-anchor" href="#参数说明" aria-label="Permalink to &quot;参数说明&quot;">​</a></h2><p><strong>表 1</strong> 模板参数说明</p><table tabindex="0"><thead><tr><th>参数名</th><th>含义</th></tr></thead><tbody><tr><td>Tp</td><td>需要比较两个类型是否完全相同的第一个类型。</td></tr><tr><td>Up</td><td>需要比较两个类型是否完全相同的第二个类型。</td></tr></tbody></table><h2 id="约束说明" tabindex="-1">约束说明 <a class="header-anchor" href="#约束说明" aria-label="Permalink to &quot;约束说明&quot;">​</a></h2><p>无</p><h2 id="返回值说明" tabindex="-1">返回值说明 <a class="header-anchor" href="#返回值说明" aria-label="Permalink to &quot;返回值说明&quot;">​</a></h2><p>is_same的静态常量成员value用于获取返回的布尔值，is_same&lt;Tp, Up&gt;::value取值如下：</p><ul><li>true：Tp和Up是完全相同的类型。</li><li>false：Tp和Up不是相同的类型。</li></ul><h2 id="调用示例" tabindex="-1">调用示例 <a class="header-anchor" href="#调用示例" aria-label="Permalink to &quot;调用示例&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 定义两个不同的类</span></span>
<span class="line"><span>class ClassA {};</span></span>
<span class="line"><span>class ClassB {};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 定义相同的类两次</span></span>
<span class="line"><span>class ClassC {};</span></span>
<span class="line"><span>using ClassC_alias = ClassC;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 定义一个简单的模板类</span></span>
<span class="line"><span>template &lt;typename T&gt;</span></span>
<span class="line"><span>class TemplateClass {};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 比较相同的基本类型</span></span>
<span class="line"><span>AscendC::PRINTF(&quot;Is int the same as int? %d\\n&quot;, AscendC::Std::is_same&lt;int, int&gt;::value);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 比较不同的基本类型</span></span>
<span class="line"><span>AscendC::PRINTF(&quot;Is int the same as double? %d\\n&quot;, AscendC::Std::is_same&lt;int, double&gt;::value);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 比较不同的类类型</span></span>
<span class="line"><span>AscendC::PRINTF(&quot;Is ClassA the same as ClassB? %d\\n&quot;, AscendC::Std::is_same&lt;ClassA, ClassB&gt;::value);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 比较相同的类类型</span></span>
<span class="line"><span>AscendC::PRINTF(&quot;Is ClassC the same as ClassC_alias? %d\\n&quot;, AscendC::Std::is_same&lt;ClassC, ClassC_alias&gt;::value);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 比较相同模板实例化类型</span></span>
<span class="line"><span>AscendC::PRINTF(&quot;Is TemplateClass&lt;int&gt; the same as TemplateClass&lt;int&gt;? %d\\n&quot;, AscendC::Std::is_same&lt;TemplateClass&lt;int&gt;, TemplateClass&lt;int&gt;&gt;::value);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 比较不同模板实例化类型</span></span>
<span class="line"><span>AscendC::PRINTF(&quot;Is TemplateClass&lt;int&gt; the same as TemplateClass&lt;double&gt;? %d\\n&quot;, AscendC::Std::is_same&lt;TemplateClass&lt;int&gt;, TemplateClass&lt;double&gt;&gt;::value);</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 执行结果：</span></span>
<span class="line"><span>Is int the same as int? 1</span></span>
<span class="line"><span>Is int the same as double? 0</span></span>
<span class="line"><span>Is ClassA the same as ClassB? 0</span></span>
<span class="line"><span>Is ClassC the same as ClassC_alias? 1</span></span>
<span class="line"><span>Is TemplateClass&lt;int&gt; the same as TemplateClass&lt;int&gt;? 1</span></span>
<span class="line"><span>Is TemplateClass&lt;int&gt; the same as TemplateClass&lt;double&gt;? 0</span></span></code></pre></div>`,18)])])}const u=a(l,[["render",p]]);export{m as __pageData,u as default};
