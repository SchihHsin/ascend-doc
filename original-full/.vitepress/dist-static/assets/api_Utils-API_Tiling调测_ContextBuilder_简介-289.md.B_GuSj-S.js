import{c as a,Q as s,j as e,m as t}from"./chunks/framework.DOi4mjdC.js";const x=JSON.parse('{"title":"简介","description":"","frontmatter":{},"headers":[{"level":1,"title":"简介","slug":"简介"},{"level":2,"title":"调用示例","slug":"调用示例"}],"relativePath":"api/Utils-API/Tiling调测/ContextBuilder/简介-289.md","filePath":"api/Utils-API/Tiling调测/ContextBuilder/简介-289.md"}'),l={name:"api/Utils-API/Tiling调测/ContextBuilder/简介-289.md"};function p(i,n,o,r,c,d){return s(),e("div",null,[...n[0]||(n[0]=[t(`<h1 id="简介" tabindex="-1">简介 <a class="header-anchor" href="#简介" aria-label="Permalink to &quot;简介&quot;">​</a></h1><p>ContextBuilder类提供一系列的API接口，支持手动构造TilingContext类来验证Tiling函数以及KernelContext类用于TilingParse函数的验证。</p><h2 id="调用示例" tabindex="-1">调用示例 <a class="header-anchor" href="#调用示例" aria-label="Permalink to &quot;调用示例&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 构造KernelContext</span></span>
<span class="line"><span>auto kernelContextHolder = context_ascendc::ContextBuilder()</span></span>
<span class="line"><span>    .Inputs(...)</span></span>
<span class="line"><span>    .Outputs(...)</span></span>
<span class="line"><span>    .BuildKernelRunContext();</span></span>
<span class="line"><span>gert::KernelContext* tilingParseContext = kernelContextHolder-&gt;GetContext&lt;gert::KernelContext&gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 构造TilingContext</span></span>
<span class="line"><span>auto tilingContextHolder = context_ascendc::ContextBuilder()</span></span>
<span class="line"><span>    .SetOpNameType(...,...)</span></span>
<span class="line"><span>    .NodeIoNum(...)</span></span>
<span class="line"><span>    .IrInstanceNum(...)</span></span>
<span class="line"><span>    .AddInputTd(...)</span></span>
<span class="line"><span>    .AddOutputTd(...)</span></span>
<span class="line"><span>    .AddAttr(...)</span></span>
<span class="line"><span>    .BuildTilingContext(...);</span></span>
<span class="line"><span>gert::TilingContext* tilingContext = tilingContextHolder-&gt;GetContext&lt;gert::TilingContext&gt;();</span></span></code></pre></div>`,4)])])}const g=a(l,[["render",p]]);export{x as __pageData,g as default};
