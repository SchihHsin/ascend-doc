import{c as s,Q as n,j as p,m as e}from"./chunks/framework.DOi4mjdC.js";const u=JSON.parse('{"title":"NPU架构版本2002","description":"","frontmatter":{},"headers":[{"level":1,"title":"NPU架构版本2002","slug":"npu架构版本2002"}],"relativePath":"guide/编程指南/高级编程/硬件实现/硬件约束/NPU架构版本2002.md","filePath":"guide/编程指南/高级编程/硬件实现/硬件约束/NPU架构版本2002.md"}'),t={name:"guide/编程指南/高级编程/硬件实现/硬件约束/NPU架构版本2002.md"};function i(l,a,c,o,r,d){return n(),p("div",null,[...a[0]||(a[0]=[e(`<h1 id="npu架构版本2002" tabindex="-1">NPU架构版本2002 <a class="header-anchor" href="#npu架构版本2002" aria-label="Permalink to &quot;NPU架构版本2002&quot;">​</a></h1><p>本节介绍硬件约束以及解决方案建议。对应的产品型号为：Atlas 推理系列产品。</p><ul><li><p>全局变量使用约束</p><p>NPU架构版本2002不支持Generic Addressing通用寻址（针对UB、stack、GM等地址空间），因此语言层面地址空间必须匹配。不同的地址空间信息不允许转换，不符合语法。全局变量位于GM上，传参位于stack上，函数内传参使用全局变量时会报错。目前编译器仅在优化级别为O0的场景下，对constexpr做了适配处理：将全局变量先从DDR上放到stack上。所以全局变量仅支持在O0下使用constexpr进行定义和使用，在其他场景均不支持。</p><ul><li><p>支持场景</p><p>在O0下支持constexpr全局变量小规模类型（整型、浮点型）数据的引用，支持数组取元素。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>constexpr int a=1；</span></span>
<span class="line"><span>int *pa=&amp;a; </span></span>
<span class="line"><span>// 数组</span></span>
<span class="line"><span>constexpr uint8_t padList[4] = {0, 1, 3, 5};</span></span>
<span class="line"><span>__aicore__ uint64_t Compute(uint32_t padNumber){</span></span>
<span class="line"><span>  uint64_t regFMatrix =3;</span></span>
<span class="line"><span>    for (uint32_t i = 0; i &lt; padNumber; i++) {</span></span>
<span class="line"><span>        regFMatrix |= uint64_t(padList[i]);    } </span></span>
<span class="line"><span> return regFMatrix;</span></span>
<span class="line"><span>}</span></span></code></pre></div></li><li><p>不支持场景</p><p>对于使用constexpr之外的全局参数将报错。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const float aa = 3.141592653589; // 不支持const 应修改为constexpr</span></span>
<span class="line"><span>template&lt;typename T&gt;</span></span>
<span class="line"><span>__global__ __aicore__ void hello_world3()</span></span>
<span class="line"><span>{   </span></span>
<span class="line"><span>    AscendC::printf(&quot;global var is %f\\n&quot;, aa);</span></span>
<span class="line"><span>};</span></span></code></pre></div></li></ul></li></ul>`,3)])])}const g=s(t,[["render",i]]);export{u as __pageData,g as default};
