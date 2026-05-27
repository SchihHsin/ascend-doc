import{c as s,Q as a,j as e,m as p}from"./chunks/framework.DOi4mjdC.js";const b=JSON.parse('{"title":"GlobalTensor简介","description":"","frontmatter":{},"headers":[{"level":1,"title":"GlobalTensor简介","slug":"globaltensor简介"}],"relativePath":"api/SIMD-API/基础数据结构/GlobalTensor/GlobalTensor简介.md","filePath":"api/SIMD-API/基础数据结构/GlobalTensor/GlobalTensor简介.md"}'),l={name:"api/SIMD-API/基础数据结构/GlobalTensor/GlobalTensor简介.md"};function o(i,n,t,_,r,c){return a(),e("div",null,[...n[0]||(n[0]=[p(`<h1 id="globaltensor简介" tabindex="-1">GlobalTensor简介 <a class="header-anchor" href="#globaltensor简介" aria-label="Permalink to &quot;GlobalTensor简介&quot;">​</a></h1><p>GlobalTensor用来存放Global Memory（外部存储）的全局数据。</p><p>GlobalTensor public成员函数如下。类型T支持基础数据类型以及<a href="./../TensorTrait/TensorTrait.html">TensorTrait</a>类型，但需要遵循使用此GlobalTensor的指令的数据类型支持情况。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>template &lt;typename T&gt; class GlobalTensor : public BaseGlobalTensor&lt;T&gt; {</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    // PrimT用于在T传入为TensorTrait类型时萃取TensorTrait中的LiteType基础数据类型</span></span>
<span class="line"><span>    using PrimType = PrimT&lt;T&gt;;</span></span>
<span class="line"><span>    // 构造函数</span></span>
<span class="line"><span>    __aicore__ inline GlobalTensor&lt;T&gt;() {}</span></span>
<span class="line"><span>    // 初始化GlobalTensor</span></span>
<span class="line"><span>    __aicore__ inline void SetGlobalBuffer(__gm__ PrimType* buffer, uint64_t bufferSize); </span></span>
<span class="line"><span>    __aicore__ inline void SetGlobalBuffer(__gm__ PrimType* buffer);</span></span>
<span class="line"><span>    // 获取全局数据的地址 </span></span>
<span class="line"><span>    __aicore__ inline const __gm__ PrimType* GetPhyAddr() const;</span></span>
<span class="line"><span>    __aicore__ inline __gm__ PrimType* GetPhyAddr(const uint64_t offset) const;</span></span>
<span class="line"><span>    // 获取GlobalTensor的相应偏移位置的值</span></span>
<span class="line"><span>    __aicore__ inline __inout_pipe__(S) PrimType GetValue(const uint64_t offset) const; </span></span>
<span class="line"><span>    // 获取某个索引位置的元素的引用</span></span>
<span class="line"><span>    __aicore__ inline __inout_pipe__(S) __gm__ PrimType&amp; operator()(const uint64_t offset) const;</span></span>
<span class="line"><span>    // 设置GlobalTensor相应偏移位置的值</span></span>
<span class="line"><span>    __aicore__ inline void SetValue(const uint64_t offset, PrimType value);</span></span>
<span class="line"><span>    // 获取GlobalTensor的元素个数</span></span>
<span class="line"><span>    __aicore__ inline uint64_t GetSize() const;</span></span>
<span class="line"><span>    // 返回指定偏移量的GlobalTensor</span></span>
<span class="line"><span>    __aicore__ inline GlobalTensor operator[](const uint64_t offset) const; </span></span>
<span class="line"><span>    // 设置GlobalTensor的shape信息</span></span>
<span class="line"><span>    __aicore__ inline void SetShapeInfo(const ShapeInfo&amp; shapeInfo);</span></span>
<span class="line"><span>    // 获取GlobalTensor的shape信息</span></span>
<span class="line"><span>    __aicore__ inline ShapeInfo GetShapeInfo() const;</span></span>
<span class="line"><span>    // 设置GlobalTensor写入L2 Cache的模式</span></span>
<span class="line"><span>    template&lt;CacheRwMode rwMode = CacheRwMode::RW&gt;</span></span>
<span class="line"><span>    __aicore__ inline void SetL2CacheHint(CacheMode mode);</span></span>
<span class="line"><span>    // 将当前GlobalTensor重解释为用户指定的新类型</span></span>
<span class="line"><span>    template &lt;typename CAST_T&gt;</span></span>
<span class="line"><span>    __aicore__ inline GlobalTensor&lt;CAST_T&gt; ReinterpretCast() const;</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>};</span></span></code></pre></div>`,4)])])}const m=s(l,[["render",o]]);export{b as __pageData,m as default};
