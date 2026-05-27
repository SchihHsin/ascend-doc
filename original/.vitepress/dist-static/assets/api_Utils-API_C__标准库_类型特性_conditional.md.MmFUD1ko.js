import{c as n,Q as s,j as t,m as e}from"./chunks/framework.DOi4mjdC.js";const u=JSON.parse('{"title":"conditional","description":"","frontmatter":{},"headers":[{"level":1,"title":"conditional","slug":"conditional"},{"level":2,"title":"产品支持情况","slug":"产品支持情况"},{"level":2,"title":"功能说明","slug":"功能说明"},{"level":2,"title":"函数原型","slug":"函数原型"},{"level":2,"title":"参数说明","slug":"参数说明"},{"level":2,"title":"约束说明","slug":"约束说明"},{"level":2,"title":"返回值说明","slug":"返回值说明"},{"level":2,"title":"调用示例","slug":"调用示例"}],"relativePath":"api/Utils-API/C++标准库/类型特性/conditional.md","filePath":"api/Utils-API/C++标准库/类型特性/conditional.md"}'),p={name:"api/Utils-API/C++标准库/类型特性/conditional.md"};function l(i,a,d,o,c,r){return s(),t("div",null,[...a[0]||(a[0]=[e(`<h1 id="conditional" tabindex="-1">conditional <a class="header-anchor" href="#conditional" aria-label="Permalink to &quot;conditional&quot;">​</a></h1><h2 id="产品支持情况" tabindex="-1">产品支持情况 <a class="header-anchor" href="#产品支持情况" aria-label="Permalink to &quot;产品支持情况&quot;">​</a></h2><table tabindex="0"><thead><tr><th>产品</th><th>是否支持</th></tr></thead><tbody><tr><td>Ascend 950PR/Ascend 950DT</td><td>√</td></tr><tr><td>Atlas A3 训练系列产品/Atlas A3 推理系列产品</td><td>√</td></tr><tr><td>Atlas A2 训练系列产品/Atlas A2 推理系列产品</td><td>√</td></tr><tr><td>Atlas 200I/500 A2 推理产品</td><td>x</td></tr><tr><td>Atlas 推理系列产品AI Core</td><td>x</td></tr><tr><td>Atlas 推理系列产品Vector Core</td><td>x</td></tr><tr><td>Atlas 训练系列产品</td><td>x</td></tr></tbody></table><h2 id="功能说明" tabindex="-1">功能说明 <a class="header-anchor" href="#功能说明" aria-label="Permalink to &quot;功能说明&quot;">​</a></h2><p>conditional是定义在&lt;type_traits&gt;头文件里的一个类型特征工具，它在程序编译时根据一个布尔条件从两个类型中选择一个类型。本接口可应用在模板元编程中，用于根据不同的条件来灵活选择合适的类型，增强代码的通用性和灵活性。</p><p>conditional有一个嵌套的type成员，它的值取决于Bp的值：如果Bp为true，则conditional&lt;Bp, If, Then&gt;::type为If。如果Bp为false，则conditional&lt;Bp, If, Then&gt;::type为Then。</p><h2 id="函数原型" tabindex="-1">函数原型 <a class="header-anchor" href="#函数原型" aria-label="Permalink to &quot;函数原型&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>template &lt;bool Bp, typename If, typename Then&gt;</span></span>
<span class="line"><span>struct conditional;</span></span></code></pre></div><h2 id="参数说明" tabindex="-1">参数说明 <a class="header-anchor" href="#参数说明" aria-label="Permalink to &quot;参数说明&quot;">​</a></h2><p><strong>表 1</strong> 模板参数说明</p><table tabindex="0"><thead><tr><th>参数名</th><th>含义</th></tr></thead><tbody><tr><td>Bp</td><td>一个布尔常量表达式，作为选择类型的条件。</td></tr><tr><td>If</td><td>当Bp为true时选择的类型。</td></tr><tr><td>Then</td><td>当Bp为false时选择的类型。</td></tr></tbody></table><h2 id="约束说明" tabindex="-1">约束说明 <a class="header-anchor" href="#约束说明" aria-label="Permalink to &quot;约束说明&quot;">​</a></h2><p>无</p><h2 id="返回值说明" tabindex="-1">返回值说明 <a class="header-anchor" href="#返回值说明" aria-label="Permalink to &quot;返回值说明&quot;">​</a></h2><p>conditional的静态常量成员type用于获取返回值，conditional&lt;Bp, If, Then&gt;::type取值如下：</p><ul><li>If：Bp为true。</li><li>Then：Bp为false。</li></ul><h2 id="调用示例" tabindex="-1">调用示例 <a class="header-anchor" href="#调用示例" aria-label="Permalink to &quot;调用示例&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 定义两个不同的类型</span></span>
<span class="line"><span>struct TypeA {</span></span>
<span class="line"><span>    __aicore__ inline static void print() {</span></span>
<span class="line"><span>        AscendC::PRINTF(&quot;This is TypeA..\\n&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>struct TypeB {</span></span>
<span class="line"><span>    __aicore__ inline static void print() {</span></span>
<span class="line"><span>        AscendC::PRINTF(&quot;This is TypeB..\\n&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 根据条件选择类型</span></span>
<span class="line"><span>template &lt;bool Condition&gt;</span></span>
<span class="line"><span>__aicore__ inline void selectType() {</span></span>
<span class="line"><span>    using SelectedType = typename AscendC::Std::conditional&lt;Condition, TypeA, TypeB&gt;::type;</span></span>
<span class="line"><span>    SelectedType::print();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 定义一个模板函数，根据条件选择不同的类型</span></span>
<span class="line"><span>template &lt;bool Condition&gt;</span></span>
<span class="line"><span>__aicore__ inline void selectOtherType() {</span></span>
<span class="line"><span>    using SelectedType = typename std::conditional&lt;Condition, int, float&gt;::type;</span></span>
<span class="line"><span>    if constexpr (std::is_same_v&lt;SelectedType, int&gt;) {</span></span>
<span class="line"><span>        AscendC::PRINTF(&quot;Selected type is int.\\n&quot;);</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        AscendC::PRINTF(&quot;Selected type is float.\\n&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 条件为 true，选择 TypeA</span></span>
<span class="line"><span>selectType&lt;true&gt;();</span></span>
<span class="line"><span>// 条件为 false，选择 TypeB</span></span>
<span class="line"><span>selectType&lt;false&gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 测试条件为 true 的情况</span></span>
<span class="line"><span>selectOtherType&lt;true&gt;();</span></span>
<span class="line"><span>// 测试条件为 false 的情况</span></span>
<span class="line"><span>selectOtherType&lt;false&gt;();</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 执行结果：</span></span>
<span class="line"><span>This is TypeA..</span></span>
<span class="line"><span>This is TypeB..</span></span>
<span class="line"><span>Selected type is int.</span></span>
<span class="line"><span>Selected type is float.</span></span></code></pre></div>`,19)])])}const y=n(p,[["render",l]]);export{u as __pageData,y as default};
