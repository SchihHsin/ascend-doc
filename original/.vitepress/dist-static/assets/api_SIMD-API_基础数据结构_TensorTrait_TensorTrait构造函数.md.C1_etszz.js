import{c as a,Q as s,j as n,m as e}from"./chunks/framework.DOi4mjdC.js";const h=JSON.parse('{"title":"TensorTrait构造函数","description":"","frontmatter":{},"headers":[{"level":1,"title":"TensorTrait构造函数","slug":"tensortrait构造函数"},{"level":2,"title":"产品支持情况","slug":"产品支持情况"},{"level":2,"title":"功能说明","slug":"功能说明"},{"level":2,"title":"函数原型","slug":"函数原型"},{"level":2,"title":"参数说明","slug":"参数说明"},{"level":2,"title":"返回值说明","slug":"返回值说明"},{"level":2,"title":"约束说明","slug":"约束说明"},{"level":2,"title":"调用示例","slug":"调用示例"}],"relativePath":"api/SIMD-API/基础数据结构/TensorTrait/TensorTrait构造函数.md","filePath":"api/SIMD-API/基础数据结构/TensorTrait/TensorTrait构造函数.md"}'),l={name:"api/SIMD-API/基础数据结构/TensorTrait/TensorTrait构造函数.md"};function p(i,t,r,o,d,c){return s(),n("div",null,[...t[0]||(t[0]=[e(`<h1 id="tensortrait构造函数" tabindex="-1">TensorTrait构造函数 <a class="header-anchor" href="#tensortrait构造函数" aria-label="Permalink to &quot;TensorTrait构造函数&quot;">​</a></h1><h2 id="产品支持情况" tabindex="-1">产品支持情况 <a class="header-anchor" href="#产品支持情况" aria-label="Permalink to &quot;产品支持情况&quot;">​</a></h2><table tabindex="0"><thead><tr><th>产品</th><th>是否支持</th></tr></thead><tbody><tr><td>Ascend 950PR/Ascend 950DT</td><td>√</td></tr><tr><td>Atlas A3 训练系列产品/Atlas A3 推理系列产品</td><td>√</td></tr><tr><td>Atlas A2 训练系列产品/Atlas A2 推理系列产品</td><td>√</td></tr><tr><td>Atlas 200I/500 A2 推理产品</td><td>x</td></tr><tr><td>Atlas 推理系列产品AI Core</td><td>x</td></tr><tr><td>Atlas 推理系列产品Vector Core</td><td>x</td></tr><tr><td>Atlas 训练系列产品</td><td>x</td></tr></tbody></table><h2 id="功能说明" tabindex="-1">功能说明 <a class="header-anchor" href="#功能说明" aria-label="Permalink to &quot;功能说明&quot;">​</a></h2><p>根据输入的Layout对象，实例化TensorTrait对象。</p><h2 id="函数原型" tabindex="-1">函数原型 <a class="header-anchor" href="#函数原型" aria-label="Permalink to &quot;函数原型&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>__aicore__ inline TensorTrait(const LayoutType&amp; t = {})</span></span></code></pre></div><h2 id="参数说明" tabindex="-1">参数说明 <a class="header-anchor" href="#参数说明" aria-label="Permalink to &quot;参数说明&quot;">​</a></h2><table tabindex="0"><thead><tr><th>参数名</th><th>输入/输出</th><th>描述</th></tr></thead><tbody><tr><td>t</td><td>输入</td><td>输入的Layout对象。输入的数据类型LayoutType，需满足约束说明。</td></tr></tbody></table><h2 id="返回值说明" tabindex="-1">返回值说明 <a class="header-anchor" href="#返回值说明" aria-label="Permalink to &quot;返回值说明&quot;">​</a></h2><p>无</p><h2 id="约束说明" tabindex="-1">约束说明 <a class="header-anchor" href="#约束说明" aria-label="Permalink to &quot;约束说明&quot;">​</a></h2><p>无</p><h2 id="调用示例" tabindex="-1">调用示例 <a class="header-anchor" href="#调用示例" aria-label="Permalink to &quot;调用示例&quot;">​</a></h2><ul><li><p>TensorTrait使用示例</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// TensorTrait使用示例为基于googletest的UT示例</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// MakeTensorTrait方法创建TensorTrait</span></span>
<span class="line"><span>AscendC::Shape&lt;int,int,int&gt; shape = AscendC::MakeShape(10, 20, 30);</span></span>
<span class="line"><span>AscendC::Stride&lt;int,int,int&gt; stride = AscendC::MakeStride(1, 100, 200);</span></span>
<span class="line"><span>auto layoutMake = AscendC::MakeLayout(shape, stride);    </span></span>
<span class="line"><span>auto tensorTraitMake = AscendC::MakeTensorTrait&lt;float, AscendC::TPosition::VECIN&gt;(layoutMake);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>EXPECT_EQ(AscendC::Std::get&lt;0&gt;(tensorTraitMake.GetLayout().GetShape()), 10);</span></span>
<span class="line"><span>EXPECT_EQ(AscendC::Std::get&lt;1&gt;(tensorTraitMake.GetLayout().GetShape()), 20);</span></span>
<span class="line"><span>EXPECT_EQ(AscendC::Std::get&lt;2&gt;(tensorTraitMake.GetLayout().GetShape()), 30);</span></span>
<span class="line"><span>EXPECT_EQ(AscendC::Std::get&lt;0&gt;(tensorTraitMake.GetLayout().GetStride()), 1);</span></span>
<span class="line"><span>EXPECT_EQ(AscendC::Std::get&lt;1&gt;(tensorTraitMake.GetLayout().GetStride()), 100);</span></span>
<span class="line"><span>EXPECT_EQ(AscendC::Std::get&lt;2&gt;(tensorTraitMake.GetLayout().GetStride()), 200);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 构造函数方法创建TensorTrait</span></span>
<span class="line"><span>using TensorTraitType = AscendC::TensorTrait&lt;half, AscendC::TPosition::VECCALC, AscendC::Layout&lt;AscendC::Shape&lt;int, int, int&gt;, AscendC::Stride&lt;int, int, int&gt;&gt;&gt;;</span></span>
<span class="line"><span>TensorTraitType tensorTraitInit(layoutMake);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>EXPECT_EQ(AscendC::Std::get&lt;0&gt;(tensorTraitInit.GetLayout().GetShape()), 10);</span></span>
<span class="line"><span>EXPECT_EQ(AscendC::Std::get&lt;1&gt;(tensorTraitInit.GetLayout().GetShape()), 20);</span></span>
<span class="line"><span>EXPECT_EQ(AscendC::Std::get&lt;2&gt;(tensorTraitInit.GetLayout().GetShape()), 30);</span></span>
<span class="line"><span>EXPECT_EQ(AscendC::Std::get&lt;0&gt;(tensorTraitInit.GetLayout().GetStride()), 1);</span></span>
<span class="line"><span>EXPECT_EQ(AscendC::Std::get&lt;1&gt;(tensorTraitInit.GetLayout().GetStride()), 100);</span></span>
<span class="line"><span>EXPECT_EQ(AscendC::Std::get&lt;2&gt;(tensorTraitInit.GetLayout().GetStride()), 200);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>EXPECT_EQ(AscendC::Std::get&lt;0&gt;(tensorTraitInit.GetShape()), 10);</span></span>
<span class="line"><span>EXPECT_EQ(AscendC::Std::get&lt;1&gt;(tensorTraitInit.GetShape()), 20);</span></span>
<span class="line"><span>EXPECT_EQ(AscendC::Std::get&lt;2&gt;(tensorTraitInit.GetShape()), 30);</span></span>
<span class="line"><span>EXPECT_EQ(AscendC::Std::get&lt;0&gt;(tensorTraitInit.GetStride()), 1);</span></span>
<span class="line"><span>EXPECT_EQ(AscendC::Std::get&lt;1&gt;(tensorTraitInit.GetStride()), 100);</span></span>
<span class="line"><span>EXPECT_EQ(AscendC::Std::get&lt;2&gt;(tensorTraitInit.GetStride()), 200);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// SetLayout方法设置TensorTrait</span></span>
<span class="line"><span>TensorTraitType tensorTraitSet;</span></span>
<span class="line"><span>tensorTraitSet.SetLayout(layoutMake);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>EXPECT_EQ(AscendC::Std::get&lt;0&gt;(tensorTraitSet.GetLayout().GetShape()), 10);</span></span>
<span class="line"><span>EXPECT_EQ(AscendC::Std::get&lt;1&gt;(tensorTraitSet.GetLayout().GetShape()), 20);</span></span>
<span class="line"><span>EXPECT_EQ(AscendC::Std::get&lt;2&gt;(tensorTraitSet.GetLayout().GetShape()), 30);</span></span>
<span class="line"><span>EXPECT_EQ(AscendC::Std::get&lt;0&gt;(tensorTraitSet.GetLayout().GetStride()), 1);</span></span>
<span class="line"><span>EXPECT_EQ(AscendC::Std::get&lt;1&gt;(tensorTraitSet.GetLayout().GetStride()), 100);</span></span>
<span class="line"><span>EXPECT_EQ(AscendC::Std::get&lt;2&gt;(tensorTraitSet.GetLayout().GetStride()), 200);</span></span></code></pre></div></li><li><p>TensorTrait和API配合使用示例</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>AscendC::LocalTensor&lt;AscendC::TensorTrait&lt;half&gt;&gt; tensor1 = que1.DeQue&lt;AscendC::TensorTrait&lt;half&gt;&gt;();</span></span>
<span class="line"><span>AscendC::LocalTensor&lt;AscendC::TensorTrait&lt;half&gt;&gt; tensor2 = que2.DeQue&lt;AscendC::TensorTrait&lt;half&gt;&gt;();</span></span>
<span class="line"><span>AscendC::LocalTensor&lt;AscendC::TensorTrait&lt;half&gt;&gt; tensor3 = que3.AllocTensor&lt;AscendC::TensorTrait&lt;half&gt;&gt;();</span></span>
<span class="line"><span>Add(tensor3, tensor1, tensor2, tensor3.GetSize());</span></span></code></pre></div></li></ul>`,15)])])}const g=a(l,[["render",p]]);export{h as __pageData,g as default};
