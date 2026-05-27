import{c as a,Q as s,j as t,m as l}from"./chunks/framework.DOi4mjdC.js";const r=JSON.parse('{"title":"is_floating_point","description":"","frontmatter":{},"headers":[{"level":1,"title":"is\\\\_floating\\\\_point","slug":"is_floating_point"},{"level":2,"title":"产品支持情况","slug":"产品支持情况"},{"level":2,"title":"功能说明","slug":"功能说明"},{"level":2,"title":"函数原型","slug":"函数原型"},{"level":2,"title":"参数说明","slug":"参数说明"},{"level":2,"title":"约束说明","slug":"约束说明"},{"level":2,"title":"返回值说明","slug":"返回值说明"},{"level":2,"title":"调用示例","slug":"调用示例"}],"relativePath":"api/Utils-API/C++标准库/类型特性/is_floating_point.md","filePath":"api/Utils-API/C++标准库/类型特性/is_floating_point.md"}'),i={name:"api/Utils-API/C++标准库/类型特性/is_floating_point.md"};function e(p,n,o,d,c,u){return s(),t("div",null,[...n[0]||(n[0]=[l(`<h1 id="is-floating-point" tabindex="-1">is_floating_point <a class="header-anchor" href="#is-floating-point" aria-label="Permalink to &quot;is\\_floating\\_point&quot;">​</a></h1><h2 id="产品支持情况" tabindex="-1">产品支持情况 <a class="header-anchor" href="#产品支持情况" aria-label="Permalink to &quot;产品支持情况&quot;">​</a></h2><table tabindex="0"><thead><tr><th>产品</th><th>是否支持</th></tr></thead><tbody><tr><td>Ascend 950PR/Ascend 950DT</td><td>√</td></tr><tr><td>Atlas A3 训练系列产品/Atlas A3 推理系列产品</td><td>√</td></tr><tr><td>Atlas A2 训练系列产品/Atlas A2 推理系列产品</td><td>√</td></tr><tr><td>Atlas 200I/500 A2 推理产品</td><td>x</td></tr><tr><td>Atlas 推理系列产品AI Core</td><td>x</td></tr><tr><td>Atlas 推理系列产品Vector Core</td><td>x</td></tr><tr><td>Atlas 训练系列产品</td><td>x</td></tr></tbody></table><h2 id="功能说明" tabindex="-1">功能说明 <a class="header-anchor" href="#功能说明" aria-label="Permalink to &quot;功能说明&quot;">​</a></h2><p>在程序编译时，检测一个类型是否为浮点类型，可以用于在编译时进行类型检查和条件处理。</p><h2 id="函数原型" tabindex="-1">函数原型 <a class="header-anchor" href="#函数原型" aria-label="Permalink to &quot;函数原型&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>template &lt;typename T&gt;</span></span>
<span class="line"><span>struct is_floating_point;</span></span></code></pre></div><h2 id="参数说明" tabindex="-1">参数说明 <a class="header-anchor" href="#参数说明" aria-label="Permalink to &quot;参数说明&quot;">​</a></h2><p><strong>表 1</strong> 模板参数说明</p><table tabindex="0"><thead><tr><th>参数名</th><th>含义</th></tr></thead><tbody><tr><td>T</td><td>需要检测的类型，包括基本数据类型、修饰类型等。</td></tr></tbody></table><h2 id="约束说明" tabindex="-1">约束说明 <a class="header-anchor" href="#约束说明" aria-label="Permalink to &quot;约束说明&quot;">​</a></h2><p>无</p><h2 id="返回值说明" tabindex="-1">返回值说明 <a class="header-anchor" href="#返回值说明" aria-label="Permalink to &quot;返回值说明&quot;">​</a></h2><p>is_floating_point的静态常量成员value用于获取返回的布尔值，is_floating_point&lt;Tp&gt;::value取值如下：</p><ul><li>true：Tp是浮点类型。</li><li>false：Tp不是浮点类型。</li></ul><h2 id="调用示例" tabindex="-1">调用示例 <a class="header-anchor" href="#调用示例" aria-label="Permalink to &quot;调用示例&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 自定义测试类型</span></span>
<span class="line"><span>struct MyStruct{};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 返回值为浮点的函数类型</span></span>
<span class="line"><span>using FuncType = double(int);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Legal floating point type</span></span>
<span class="line"><span>AscendC::printf(&quot;AscendC::Std::is_floating_point::value:%d\\n&quot;, AscendC::Std::is_floating_point&lt;float&gt;::value);</span></span>
<span class="line"><span>AscendC::printf(&quot;AscendC::Std::is_floating_point::value:%d\\n&quot;, AscendC::Std::is_floating_point&lt;double&gt;::value);</span></span>
<span class="line"><span>AscendC::printf(&quot;AscendC::Std::is_floating_point::value:%d\\n&quot;, AscendC::Std::is_floating_point&lt;long double&gt;::value);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// Floating point types limited by CV</span></span>
<span class="line"><span>AscendC::printf(&quot;AscendC::Std::is_floating_point::value:%d\\n&quot;, AscendC::Std::is_floating_point&lt;const float&gt;::value);</span></span>
<span class="line"><span>AscendC::printf(&quot;AscendC::Std::is_floating_point::value:%d\\n&quot;, AscendC::Std::is_floating_point&lt;volatile double&gt;::value);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// non-floating point type</span></span>
<span class="line"><span>AscendC::printf(&quot;AscendC::Std::is_floating_point::value:%d\\n&quot;, AscendC::Std::is_floating_point&lt;int&gt;::value);</span></span>
<span class="line"><span>AscendC::printf(&quot;AscendC::Std::is_floating_point::value:%d\\n&quot;, AscendC::Std::is_floating_point&lt;bool&gt;::value);</span></span>
<span class="line"><span>AscendC::printf(&quot;AscendC::Std::is_floating_point::value:%d\\n&quot;, AscendC::Std::is_floating_point&lt;double*&gt;::value);</span></span>
<span class="line"><span>AscendC::printf(&quot;AscendC::Std::is_floating_point::value:%d\\n&quot;, AscendC::Std::is_floating_point&lt;float&amp;&gt;::value);</span></span>
<span class="line"><span>AscendC::printf(&quot;AscendC::Std::is_floating_point::value:%d\\n&quot;, AscendC::Std::is_floating_point&lt;double[5]&gt;::value);</span></span>
<span class="line"><span>AscendC::printf(&quot;AscendC::Std::is_floating_point::value:%d\\n&quot;, AscendC::Std::is_floating_point&lt;FuncType&gt;::value);</span></span>
<span class="line"><span>AscendC::printf(&quot;AscendC::Std::is_floating_point::value:%d\\n&quot;, AscendC::Std::is_floating_point&lt;MyStruct&gt;::value);</span></span>
<span class="line"><span>AscendC::printf(&quot;AscendC::Std::is_floating_point::value:%d\\n&quot;, AscendC::Std::is_floating_point&lt;void&gt;::value);</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 执行结果：</span></span>
<span class="line"><span>AscendC::Std::is_floating_point::value:1</span></span>
<span class="line"><span>AscendC::Std::is_floating_point::value:1</span></span>
<span class="line"><span>AscendC::Std::is_floating_point::value:1</span></span>
<span class="line"><span>AscendC::Std::is_floating_point::value:1</span></span>
<span class="line"><span>AscendC::Std::is_floating_point::value:1</span></span>
<span class="line"><span>AscendC::Std::is_floating_point::value:0</span></span>
<span class="line"><span>AscendC::Std::is_floating_point::value:0</span></span>
<span class="line"><span>AscendC::Std::is_floating_point::value:0</span></span>
<span class="line"><span>AscendC::Std::is_floating_point::value:0</span></span>
<span class="line"><span>AscendC::Std::is_floating_point::value:0</span></span>
<span class="line"><span>AscendC::Std::is_floating_point::value:0</span></span>
<span class="line"><span>AscendC::Std::is_floating_point::value:0</span></span>
<span class="line"><span>AscendC::Std::is_floating_point::value:0</span></span></code></pre></div>`,18)])])}const g=a(i,[["render",e]]);export{r as __pageData,g as default};
