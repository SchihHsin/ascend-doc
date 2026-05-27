import{c as n,Q as s,j as t,m as e}from"./chunks/framework.DOi4mjdC.js";const g=JSON.parse('{"title":"integral_constant","description":"","frontmatter":{},"headers":[{"level":1,"title":"integral\\\\_constant","slug":"integral_constant"},{"level":2,"title":"产品支持情况","slug":"产品支持情况"},{"level":2,"title":"功能说明","slug":"功能说明"},{"level":2,"title":"函数原型","slug":"函数原型"},{"level":2,"title":"参数说明","slug":"参数说明"},{"level":2,"title":"约束说明","slug":"约束说明"},{"level":2,"title":"返回值说明","slug":"返回值说明"},{"level":2,"title":"调用示例","slug":"调用示例"}],"relativePath":"api/Utils-API/C++标准库/类型特性/integral_constant.md","filePath":"api/Utils-API/C++标准库/类型特性/integral_constant.md"}'),l={name:"api/Utils-API/C++标准库/类型特性/integral_constant.md"};function p(i,a,c,d,o,r){return s(),t("div",null,[...a[0]||(a[0]=[e(`<h1 id="integral-constant" tabindex="-1">integral_constant <a class="header-anchor" href="#integral-constant" aria-label="Permalink to &quot;integral\\_constant&quot;">​</a></h1><h2 id="产品支持情况" tabindex="-1">产品支持情况 <a class="header-anchor" href="#产品支持情况" aria-label="Permalink to &quot;产品支持情况&quot;">​</a></h2><table tabindex="0"><thead><tr><th>产品</th><th>是否支持</th></tr></thead><tbody><tr><td>Ascend 950PR/Ascend 950DT</td><td>√</td></tr><tr><td>Atlas A3 训练系列产品/Atlas A3 推理系列产品</td><td>√</td></tr><tr><td>Atlas A2 训练系列产品/Atlas A2 推理系列产品</td><td>√</td></tr><tr><td>Atlas 200I/500 A2 推理产品</td><td>x</td></tr><tr><td>Atlas 推理系列产品AI Core</td><td>x</td></tr><tr><td>Atlas 推理系列产品Vector Core</td><td>x</td></tr><tr><td>Atlas 训练系列产品</td><td>x</td></tr></tbody></table><h2 id="功能说明" tabindex="-1">功能说明 <a class="header-anchor" href="#功能说明" aria-label="Permalink to &quot;功能说明&quot;">​</a></h2><p>integral_constant是一个带有模板参数的结构体，定义在&lt;type_traits&gt;头文件中，用于封装一个编译时常量整数值，是标准库中许多类型特性和编译时计算的基础组件。</p><p>integral_constant的功能如下：</p><ol><li>封装编译时常量，将一个int或bool类型的值封装为特定类型，以便该值可以在编译时被操作和传递。</li><li>类型标识，每个不同的integral_constant实例都是唯一的类型，可用于模板特化或重载决议。</li><li>隐式转换时支持转换为其封装的值类型，便于在需要该值的上下文中直接使用。</li><li>函数调用运算符允许像调用函数一样调用实例，以获取其值。</li></ol><p>integral_constant提供了多个常用的特化版本，具体如下：</p><ul><li>Std::true_type：integral_constant&lt;bool, true&gt;的别名。</li><li>Std::false_type：integral_constant&lt;bool, false&gt;的别名。</li><li>数值常量：如Std::integral_constant&lt;int, 42&gt;。</li><li>数值常量的简化写法，Std::Int，数值类型为size_t：如Std::Int&lt;42&gt;。</li></ul><h2 id="函数原型" tabindex="-1">函数原型 <a class="header-anchor" href="#函数原型" aria-label="Permalink to &quot;函数原型&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>template &lt;typename Tp, Tp v&gt;</span></span>
<span class="line"><span>struct integral_constant</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    static constexpr const Tp value = v;</span></span>
<span class="line"><span>    using value_type = Tp;</span></span>
<span class="line"><span>    using type = integral_constant;</span></span>
<span class="line"><span>    inline constexpr operator value_type() const noexcept;</span></span>
<span class="line"><span>    inline constexpr value_type operator()() const noexcept;</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>template &lt;size_t v&gt;</span></span>
<span class="line"><span>using Int = integral_constant&lt;size_t, v&gt;;</span></span></code></pre></div><h2 id="参数说明" tabindex="-1">参数说明 <a class="header-anchor" href="#参数说明" aria-label="Permalink to &quot;参数说明&quot;">​</a></h2><p><strong>表 1</strong> 模板参数说明</p><table tabindex="0"><thead><tr><th>参数名</th><th>含义</th></tr></thead><tbody><tr><td>Tp</td><td>数值的数据类型。</td></tr><tr><td>v</td><td>常量数值。</td></tr></tbody></table><h2 id="约束说明" tabindex="-1">约束说明 <a class="header-anchor" href="#约束说明" aria-label="Permalink to &quot;约束说明&quot;">​</a></h2><ul><li>Int类型是integral_constant数值结构的别名简写，数值类型必须是size_t类型。</li><li>模板参数Tp不支持float等浮点数类型，因为模板参数需在编译期确定，而浮点数的精度问题可能导致编译期无法准确表示。</li></ul><h2 id="返回值说明" tabindex="-1">返回值说明 <a class="header-anchor" href="#返回值说明" aria-label="Permalink to &quot;返回值说明&quot;">​</a></h2><p>无</p><h2 id="调用示例" tabindex="-1">调用示例 <a class="header-anchor" href="#调用示例" aria-label="Permalink to &quot;调用示例&quot;">​</a></h2><ul><li><p>数值类型封装</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 以下示例为基于googletest的UT示例</span></span>
<span class="line"><span>using IntTrue = AscendC::Std::integral_constant&lt;int, 1&gt;;</span></span>
<span class="line"><span>using IntFalse = AscendC::Std::integral_constant&lt;int, 0&gt;;</span></span>
<span class="line"><span>// 测试 value 静态常量</span></span>
<span class="line"><span>EXPECT_EQ(IntTrue::value, 1);</span></span>
<span class="line"><span>EXPECT_EQ(IntFalse::value, 0);</span></span>
<span class="line"><span>// 测试()操作符重载</span></span>
<span class="line"><span>EXPECT_EQ(IntTrue()(), 1);</span></span>
<span class="line"><span>EXPECT_EQ(IntFalse()(), 0);</span></span>
<span class="line"><span>// 测试类型定义</span></span>
<span class="line"><span>EXPECT_TRUE((AscendC::Std::is_same&lt;typename IntTrue::value_type, int&gt;::value));</span></span>
<span class="line"><span>EXPECT_TRUE((AscendC::Std::is_same&lt;typename IntTrue::type, IntTrue&gt;::value));</span></span></code></pre></div></li><li><p>特化类型——bool</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 以下示例为基于googletest的UT示例</span></span>
<span class="line"><span>using TrueType = AscendC::Std::true_type;</span></span>
<span class="line"><span>using FalseType = AscendC::Std::false_type;</span></span>
<span class="line"><span>// 测试 value 静态常量</span></span>
<span class="line"><span>EXPECT_TRUE(TrueType::value);</span></span>
<span class="line"><span>EXPECT_FALSE(FalseType::value);</span></span>
<span class="line"><span>// 测试()操作符重载</span></span>
<span class="line"><span>EXPECT_TRUE(TrueType()());</span></span>
<span class="line"><span>EXPECT_FALSE(FalseType()());</span></span>
<span class="line"><span>// 测试类型定义</span></span>
<span class="line"><span>EXPECT_TRUE((AscendC::Std::is_same&lt;typename TrueType::value_type, bool&gt;::value));</span></span>
<span class="line"><span>EXPECT_TRUE((AscendC::Std::is_same&lt;typename TrueType::type, TrueType&gt;::value));</span></span>
<span class="line"><span>EXPECT_TRUE((AscendC::Std::is_same&lt;typename FalseType::type, FalseType&gt;::value));</span></span></code></pre></div></li><li><p>特化类型——Int</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 以下示例为基于googletest的UT示例</span></span>
<span class="line"><span>using Zero = AscendC::Std::Int&lt;0&gt;;</span></span>
<span class="line"><span>using One = AscendC::Std::Int&lt;1&gt;;</span></span>
<span class="line"><span>using Large = AscendC::Std::Int&lt;0xFFFFFFFF&gt;;</span></span>
<span class="line"><span>// 验证 value 静态常量</span></span>
<span class="line"><span>EXPECT_EQ(Zero::value, 0);</span></span>
<span class="line"><span>EXPECT_EQ(One::value, 1);</span></span>
<span class="line"><span>EXPECT_EQ(Large::value, 0xFFFFFFFF);</span></span>
<span class="line"><span>// 验证类型定义</span></span>
<span class="line"><span>EXPECT_TRUE((AscendC::Std::is_same&lt;typename Zero::value_type, size_t&gt;::value));</span></span>
<span class="line"><span>EXPECT_TRUE((AscendC::Std::is_same&lt;typename Zero::type, Zero&gt;::value));</span></span>
<span class="line"><span>EXPECT_TRUE((AscendC::Std::is_same&lt;Zero, AscendC::Std::integral_constant&lt;size_t, 0&gt;&gt;::value));</span></span>
<span class="line"><span>// 验证()操作符重载</span></span>
<span class="line"><span>EXPECT_EQ(Zero()(), 0);</span></span>
<span class="line"><span>EXPECT_EQ(One()(), 1);</span></span>
<span class="line"><span>EXPECT_EQ(Large()(), 0xFFFFFFFF);</span></span></code></pre></div></li><li><p>Int特化类型的运算</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 加法</span></span>
<span class="line"><span>static_assert((AscendC::Std::Int&lt;5&gt;::value + AscendC::Std::Int&lt;3&gt;::value) == 8, &quot;Addition failed&quot;);</span></span>
<span class="line"><span>// 乘法</span></span>
<span class="line"><span>static_assert((AscendC::Std::Int&lt;4&gt;::value * AscendC::Std::Int&lt;6&gt;::value) == 24, &quot;Multiplication failed&quot;);</span></span>
<span class="line"><span>// 比较</span></span>
<span class="line"><span>static_assert(AscendC::Std::Int&lt;10&gt;::value &gt; AscendC::Std::Int&lt;5&gt;::value, &quot;Comparison failed&quot;);</span></span>
<span class="line"><span>static_assert(AscendC::Std::Int&lt;7&gt;::value != AscendC::Std::Int&lt;77&gt;::value, &quot;Equality check failed&quot;);</span></span></code></pre></div></li></ul>`,20)])])}const _=n(l,[["render",p]]);export{g as __pageData,_ as default};
