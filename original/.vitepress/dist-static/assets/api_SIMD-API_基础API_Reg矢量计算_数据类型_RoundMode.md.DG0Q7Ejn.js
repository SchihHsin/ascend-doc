import{c as a,Q as s,j as e,m as p}from"./chunks/framework.DOi4mjdC.js";const u=JSON.parse('{"title":"RoundMode","description":"","frontmatter":{},"headers":[{"level":1,"title":"RoundMode","slug":"roundmode"}],"relativePath":"api/SIMD-API/基础API/Reg矢量计算/数据类型/RoundMode.md","filePath":"api/SIMD-API/基础API/Reg矢量计算/数据类型/RoundMode.md"}'),o={name:"api/SIMD-API/基础API/Reg矢量计算/数据类型/RoundMode.md"};function d(t,n,l,i,r,c){return s(),e("div",null,[...n[0]||(n[0]=[p(`<h1 id="roundmode" tabindex="-1">RoundMode <a class="header-anchor" href="#roundmode" aria-label="Permalink to &quot;RoundMode&quot;">​</a></h1><p>控制舍入模式，可输入值：</p><p>CAST_RINT：返回最接近参数的整数，如果有2个整数同样接近，则会返回偶数的那个；</p><p>CAST_ROUND：round模式， 四舍五入求整；</p><p>CAST_FLOOR：floor模式，向下取整；</p><p>CAST_CEIL：ceil模式， 向上取整；</p><p>CAST_TRUNC：truncation模式， 截断取整；</p><p>CAST_ODD：向奇数的方向舍入，既当小数点后数值不为0时，如果整数位是偶数，则进位；</p><p>CAST_HYBRID：随机舍入，算子中目前特指输出结果是hif8数据时，会用到的一种随机舍入。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>enum class RoundMode {</span></span>
<span class="line"><span>    CAST_NONE = 0,  // 在转换有精度损失时表示CAST_RINT模式，不涉及精度损失时表示不舍入</span></span>
<span class="line"><span>    CAST_RINT,      // rint，四舍六入五成双舍入</span></span>
<span class="line"><span>    CAST_FLOOR,     // floor，向负无穷舍入</span></span>
<span class="line"><span>    CAST_CEIL,      // ceil，向正无穷舍入</span></span>
<span class="line"><span>    CAST_ROUND,     // round，四舍五入舍入</span></span>
<span class="line"><span>    CAST_TRUNC,     // trunc，向零舍入</span></span>
<span class="line"><span>    CAST_ODD,       // Von Neumann rounding，最近邻奇数舍入</span></span>
<span class="line"><span>    CAST_HYBRID,    // hybrid，目前特指输出结果是hif8数据时，会用到的一种随机舍入 </span></span>
<span class="line"><span>};</span></span></code></pre></div>`,10)])])}const T=a(o,[["render",d]]);export{u as __pageData,T as default};
