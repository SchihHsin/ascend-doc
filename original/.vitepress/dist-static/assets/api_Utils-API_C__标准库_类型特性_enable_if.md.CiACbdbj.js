import{c as n,Q as s,j as e,m as t}from"./chunks/framework.DOi4mjdC.js";const b=JSON.parse('{"title":"enable_if","description":"","frontmatter":{},"headers":[{"level":1,"title":"enable\\\\_if","slug":"enable_if"},{"level":2,"title":"产品支持情况","slug":"产品支持情况"},{"level":2,"title":"功能说明","slug":"功能说明"},{"level":2,"title":"函数原型","slug":"函数原型"},{"level":2,"title":"参数说明","slug":"参数说明"},{"level":2,"title":"约束说明","slug":"约束说明"},{"level":2,"title":"返回值说明","slug":"返回值说明"},{"level":2,"title":"调用示例","slug":"调用示例"}],"relativePath":"api/Utils-API/C++标准库/类型特性/enable_if.md","filePath":"api/Utils-API/C++标准库/类型特性/enable_if.md"}'),l={name:"api/Utils-API/C++标准库/类型特性/enable_if.md"};function p(i,a,c,o,d,r){return s(),e("div",null,[...a[0]||(a[0]=[t(`<h1 id="enable-if" tabindex="-1">enable_if <a class="header-anchor" href="#enable-if" aria-label="Permalink to &quot;enable\\_if&quot;">​</a></h1><h2 id="产品支持情况" tabindex="-1">产品支持情况 <a class="header-anchor" href="#产品支持情况" aria-label="Permalink to &quot;产品支持情况&quot;">​</a></h2><table tabindex="0"><thead><tr><th>产品</th><th>是否支持</th></tr></thead><tbody><tr><td>Ascend 950PR/Ascend 950DT</td><td>√</td></tr><tr><td>Atlas A3 训练系列产品/Atlas A3 推理系列产品</td><td>√</td></tr><tr><td>Atlas A2 训练系列产品/Atlas A2 推理系列产品</td><td>√</td></tr><tr><td>Atlas 200I/500 A2 推理产品</td><td>x</td></tr><tr><td>Atlas 推理系列产品AI Core</td><td>x</td></tr><tr><td>Atlas 推理系列产品Vector Core</td><td>x</td></tr><tr><td>Atlas 训练系列产品</td><td>x</td></tr></tbody></table><h2 id="功能说明" tabindex="-1">功能说明 <a class="header-anchor" href="#功能说明" aria-label="Permalink to &quot;功能说明&quot;">​</a></h2><p>enable_if是定义于&lt;type_traits&gt;头文件的一个模板元编程工具，它能够在程序编译时根据某个条件启用或禁用特定的函数模板、类模板或模板特化，以此实现更精细的模板重载和类型选择，增强代码的灵活性和安全性。</p><p>enable_if是一个模板结构体，有两个模板参数：模板参数Bp是一个布尔值，表示条件；模板参数Tp是一个类型，默认值为void。当Bp为false时，enable_if没有嵌套的type成员。当Bp为true时，enable_if有一个嵌套的type成员，其类型为Tp。</p><h2 id="函数原型" tabindex="-1">函数原型 <a class="header-anchor" href="#函数原型" aria-label="Permalink to &quot;函数原型&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>template &lt;bool Bp, typename Tp&gt;</span></span>
<span class="line"><span>struct enable_if;</span></span></code></pre></div><h2 id="参数说明" tabindex="-1">参数说明 <a class="header-anchor" href="#参数说明" aria-label="Permalink to &quot;参数说明&quot;">​</a></h2><p><strong>表 1</strong> 模板参数说明</p><table tabindex="0"><thead><tr><th>参数名</th><th>含义</th></tr></thead><tbody><tr><td>Bp</td><td>布尔值，表示条件。</td></tr><tr><td>Tp</td><td>类型，默认值为void。</td></tr></tbody></table><h2 id="约束说明" tabindex="-1">约束说明 <a class="header-anchor" href="#约束说明" aria-label="Permalink to &quot;约束说明&quot;">​</a></h2><p>无</p><h2 id="返回值说明" tabindex="-1">返回值说明 <a class="header-anchor" href="#返回值说明" aria-label="Permalink to &quot;返回值说明&quot;">​</a></h2><p>enable_if的静态常量成员type用于获取返回值，enable_if&lt;Bp, Tp&gt;::type取值如下：</p><ul><li>Tp：Bp为true。</li><li>void：Bp为false。</li></ul><h2 id="调用示例" tabindex="-1">调用示例 <a class="header-anchor" href="#调用示例" aria-label="Permalink to &quot;调用示例&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>template &lt;typename T&gt;</span></span>
<span class="line"><span>class Calculator {</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    // 当 T 是整数类型时启用此成员函数</span></span>
<span class="line"><span>    template &lt;typename U = T&gt;</span></span>
<span class="line"><span>    typename AscendC::Std::enable_if&lt;AscendC::Std::is_integral&lt;U&gt;::value, U&gt;::type</span></span>
<span class="line"><span>    __aicore__ inline multiply(U a, U b) {</span></span>
<span class="line"><span>        AscendC::PRINTF(&quot;Integral type multiplication&quot;);</span></span>
<span class="line"><span>        return a * b;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 当 T 不是整数类型时启用此成员函数</span></span>
<span class="line"><span>    template &lt;typename U = T&gt;</span></span>
<span class="line"><span>    typename AscendC::Std::enable_if&lt;!AscendC::Std::is_integral&lt;U&gt;::value, U&gt;::type</span></span>
<span class="line"><span>    __aicore__ inline multiply(U a, U b) {</span></span>
<span class="line"><span>        AscendC::PRINTF(&quot;Non-integral type multiplication&quot;);</span></span>
<span class="line"><span>        return a * b;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 通用模板类</span></span>
<span class="line"><span>template &lt;typename T, typename Enable = void&gt;</span></span>
<span class="line"><span>class Container {</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    __aicore__ inline Container() {</span></span>
<span class="line"><span>        AscendC::PRINTF(&quot;Generic container.\\n&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 特化版本，当 T 是整数类型时启用</span></span>
<span class="line"><span>template &lt;typename T&gt;</span></span>
<span class="line"><span>class Container&lt;T, typename AscendC::Std::enable_if&lt;AscendC::Std::is_integral&lt;T&gt;::value&gt;::type&gt; {</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    __aicore__ inline Container() {</span></span>
<span class="line"><span>        AscendC::PRINTF(&quot;Integral container.\\n&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 当 T 是整数类型时启用该函数</span></span>
<span class="line"><span>template &lt;typename T&gt; </span></span>
<span class="line"><span>__aicore__ inline typename AscendC::Std::enable_if&lt;AscendC::Std::is_integral&lt;T&gt;::value, T&gt;::type add(T a, T b) {</span></span>
<span class="line"><span>    AscendC::PRINTF(&quot;Integral type addition.&quot;);</span></span>
<span class="line"><span>    return a + b;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 当 T 不是整数类型时启用该函数</span></span>
<span class="line"><span>template &lt;typename T&gt; </span></span>
<span class="line"><span>__aicore__ inline typename AscendC::Std::enable_if&lt;!AscendC::Std::is_integral&lt;T&gt;::value, T&gt;::type add(T a, T b) {</span></span>
<span class="line"><span>    AscendC::PRINTF(&quot;Non-integral type addition.&quot;);</span></span>
<span class="line"><span>    return a + (-b);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Calculator&lt;int&gt; intCalculator;</span></span>
<span class="line"><span>int intResult = intCalculator.multiply((int)2, (int)3);</span></span>
<span class="line"><span>AscendC::PRINTF(&quot;Result of integral multiplication: %d\\n&quot;, intResult);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Calculator&lt;float&gt; doubleCalculator;</span></span>
<span class="line"><span>float doubleResult = doubleCalculator.multiply((float)2.5, (float)3.5);</span></span>
<span class="line"><span>AscendC::PRINTF(&quot;Result of non-integral multiplication: %f\\n&quot;, doubleResult);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Container&lt;float&gt; genericContainer;</span></span>
<span class="line"><span>Container&lt;int&gt; integralContainer;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>intResult = add(1, 2);</span></span>
<span class="line"><span>AscendC::PRINTF(&quot;Integer result: %d\\n&quot;, intResult);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>doubleResult = add((float)1.5, (float)2.5);</span></span>
<span class="line"><span>AscendC::PRINTF(&quot;float result: %f\\n&quot;, doubleResult);</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 执行结果：</span></span>
<span class="line"><span>Integral type multiplicationResult of integral multiplication: 6</span></span>
<span class="line"><span>Non-integral type multiplicationResult of non-integral multiplication: 8.750000</span></span>
<span class="line"><span>Generic container.</span></span>
<span class="line"><span>Integral container.</span></span>
<span class="line"><span>Integral type addition.Integer result: 3</span></span>
<span class="line"><span>Non-integral type addition.float result: -1.000000</span></span></code></pre></div>`,19)])])}const g=n(l,[["render",p]]);export{b as __pageData,g as default};
