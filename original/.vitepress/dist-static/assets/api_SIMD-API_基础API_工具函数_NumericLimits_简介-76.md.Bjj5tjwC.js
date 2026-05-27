import{c as a,Q as s,j as i,m as t}from"./chunks/framework.DOi4mjdC.js";const u=JSON.parse('{"title":"简介","description":"","frontmatter":{},"headers":[{"level":1,"title":"简介","slug":"简介"}],"relativePath":"api/SIMD-API/基础API/工具函数/NumericLimits/简介-76.md","filePath":"api/SIMD-API/基础API/工具函数/NumericLimits/简介-76.md"}'),e={name:"api/SIMD-API/基础API/工具函数/NumericLimits/简介-76.md"};function p(c,n,l,o,_,r){return s(),i("div",null,[...n[0]||(n[0]=[t(`<h1 id="简介" tabindex="-1">简介 <a class="header-anchor" href="#简介" aria-label="Permalink to &quot;简介&quot;">​</a></h1><p>NumericLimits工具类，用于查询指定数据类型的最大值/最小值等属性。</p><p>通过模板参数T指定数据类型。原型定义如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>template &lt;typename T&gt;</span></span>
<span class="line"><span>struct NumericLimits {</span></span>
<span class="line"><span>    // 标量接口，返回值为标量</span></span>
<span class="line"><span>    constexpr __aicore__ static inline T Max();</span></span>
<span class="line"><span>    constexpr __aicore__ static inline T Lowest();</span></span>
<span class="line"><span>    constexpr __aicore__ static inline T Min();</span></span>
<span class="line"><span>    constexpr __aicore__ static inline T Infinity();</span></span>
<span class="line"><span>    constexpr __aicore__ static inline T NegativeInfinity();</span></span>
<span class="line"><span>    constexpr __aicore__ static inline T QuietNaN();</span></span>
<span class="line"><span>    constexpr __aicore__ static inline T SignalingNaN();</span></span>
<span class="line"><span>    constexpr __aicore__ static inline T DeNormMin();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 为dstLocal前count个元素赋值</span></span>
<span class="line"><span>    __aicore__ static inline void Max(const LocalTensor&lt;T&gt; &amp;dstLocal, uint32_t count);</span></span>
<span class="line"><span>    __aicore__ static inline void Lowest(const LocalTensor&lt;T&gt; &amp;dstLocal, uint32_t count);</span></span>
<span class="line"><span>    __aicore__ static inline void Min(const LocalTensor&lt;T&gt; &amp;dstLocal, uint32_t count);</span></span>
<span class="line"><span>    __aicore__ static inline void Infinity(const LocalTensor&lt;T&gt; &amp;dstLocal, uint32_t count);</span></span>
<span class="line"><span>    __aicore__ static inline void NegativeInfinity(const LocalTensor&lt;T&gt; &amp;dstLocal, uint32_t count);</span></span>
<span class="line"><span>    __aicore__ static inline void QuietNaN(const LocalTensor&lt;T&gt; &amp;dstLocal, uint32_t count);</span></span>
<span class="line"><span>    __aicore__ static inline void SignalingNaN(const LocalTensor&lt;T&gt; &amp;dstLocal, uint32_t count);</span></span>
<span class="line"><span>    __aicore__ static inline void DeNormMin(const LocalTensor&lt;T&gt; &amp;dstLocal, uint32_t count);</span></span>
<span class="line"><span>};</span></span></code></pre></div>`,4)])])}const m=a(e,[["render",p]]);export{u as __pageData,m as default};
