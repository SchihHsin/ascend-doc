import{c as s,Q as a,j as e,m as t}from"./chunks/framework.DOi4mjdC.js";const T=JSON.parse('{"title":"LocalTensor简介","description":"","frontmatter":{},"headers":[{"level":1,"title":"LocalTensor简介","slug":"localtensor简介"},{"level":2,"title":"需要包含的头文件","slug":"需要包含的头文件"},{"level":2,"title":"原型定义","slug":"原型定义"},{"level":2,"title":"模板参数","slug":"模板参数"}],"relativePath":"api/SIMD-API/基础数据结构/LocalTensor/LocalTensor简介.md","filePath":"api/SIMD-API/基础数据结构/LocalTensor/LocalTensor简介.md"}'),p={name:"api/SIMD-API/基础数据结构/LocalTensor/LocalTensor简介.md"};function i(l,n,o,c,r,_){return a(),e("div",null,[...n[0]||(n[0]=[t(`<h1 id="localtensor简介" tabindex="-1">LocalTensor简介 <a class="header-anchor" href="#localtensor简介" aria-label="Permalink to &quot;LocalTensor简介&quot;">​</a></h1><p>LocalTensor用于存放AI Core中Local Memory（内部存储）的数据，支持逻辑位置<a href="./../../其他数据类型/TPosition.html">TPosition</a>为VECIN、VECOUT、VECCALC、A1、A2、B1、B2、CO1、CO2。</p><h2 id="需要包含的头文件" tabindex="-1">需要包含的头文件 <a class="header-anchor" href="#需要包含的头文件" aria-label="Permalink to &quot;需要包含的头文件&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &quot;kernel_operator.h&quot;</span></span></code></pre></div><h2 id="原型定义" tabindex="-1">原型定义 <a class="header-anchor" href="#原型定义" aria-label="Permalink to &quot;原型定义&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>template &lt;typename T&gt; class LocalTensor : public BaseLocalTensor&lt;T&gt; {</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    // PrimT用于在T传入为TensorTrait类型时萃取TensorTrait中的LiteType基础数据类型</span></span>
<span class="line"><span>    using PrimType = PrimT&lt;T&gt;;</span></span>
<span class="line"><span>    __aicore__ inline LocalTensor&lt;T&gt;() {};</span></span>
<span class="line"><span>#if defined(ASCENDC_CPU_DEBUG) &amp;&amp; ASCENDC_CPU_DEBUG == 1</span></span>
<span class="line"><span>    ~LocalTensor();</span></span>
<span class="line"><span>    explicit LocalTensor&lt;T&gt;(TBuffAddr&amp; address);</span></span>
<span class="line"><span>    LocalTensor&lt;T&gt;(const LocalTensor&lt;T&gt;&amp; other);</span></span>
<span class="line"><span>    LocalTensor&lt;T&gt; operator = (const LocalTensor&lt;T&gt;&amp; other); // = 前后的两个LocalTensor共享相同的内部存储。</span></span>
<span class="line"><span>    PrimType* GetPhyAddr(const uint32_t offset) const;</span></span>
<span class="line"><span>    PrimType* GetPhyAddr() const;</span></span>
<span class="line"><span>    __inout_pipe__(S) PrimType GetValue(const uint32_t offset) const;</span></span>
<span class="line"><span>    __inout_pipe__(S) PrimType&amp; operator()(const uint32_t offset) const;</span></span>
<span class="line"><span>    template &lt;typename CAST_T&gt; __aicore__ inline LocalTensor&lt;CAST_T&gt; ReinterpretCast() const;</span></span>
<span class="line"><span>    template &lt;typename T1&gt; __inout_pipe__(S) void SetValue(const uint32_t index, const T1 value) const;</span></span>
<span class="line"><span>    LocalTensor operator[](const uint32_t offset) const;</span></span>
<span class="line"><span>    template &lt;typename T1&gt; void SetAddrWithOffset(LocalTensor&lt;T1&gt; &amp;src, uint32_t offset);</span></span>
<span class="line"><span>    inline void Print();</span></span>
<span class="line"><span>    inline void Print(uint32_t len);</span></span>
<span class="line"><span>    int32_t ToFile(const std::string&amp; fileName) const;</span></span>
<span class="line"><span>#else</span></span>
<span class="line"><span>    __aicore__ inline uint64_t GetPhyAddr() const;</span></span>
<span class="line"><span>    __aicore__ inline uint64_t GetPhyAddr(const uint32_t offset) const;</span></span>
<span class="line"><span>    __aicore__ inline __inout_pipe__(S) PrimType GetValue(const uint32_t index) const;</span></span>
<span class="line"><span>    __aicore__ inline __inout_pipe__(S) __ubuf__ PrimType&amp; operator()(const uint32_t offset) const;</span></span>
<span class="line"><span>    template &lt;typename CAST_T&gt; __aicore__ inline LocalTensor&lt;CAST_T&gt; ReinterpretCast() const;</span></span>
<span class="line"><span>    template &lt;typename T1&gt; __aicore__ inline __inout_pipe__(S)</span></span>
<span class="line"><span>        void SetValue(const uint32_t index, const T1 value) const;</span></span>
<span class="line"><span>    __aicore__ inline LocalTensor operator[](const uint32_t offset) const;</span></span>
<span class="line"><span>    template &lt;typename T1&gt;</span></span>
<span class="line"><span>    [[deprecated(&quot;NOTICE: SetAddrWithOffset has been deprecated and will be removed in the next version. &quot;</span></span>
<span class="line"><span>        &quot;Please do not use it!&quot;)]]</span></span>
<span class="line"><span>    __aicore__ inline void SetAddrWithOffset(LocalTensor&lt;T1&gt; &amp;src, uint32_t offset);</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span>    __aicore__ inline LocalTensor&lt;T&gt;(AscendC::TPosition pos, uint32_t addr, uint32_t tieSize);</span></span>
<span class="line"><span>    __aicore__ inline int32_t GetPosition() const;</span></span>
<span class="line"><span>    __aicore__ inline void SetSize(const uint32_t size);</span></span>
<span class="line"><span>    __aicore__ inline uint32_t GetSize() const;</span></span>
<span class="line"><span>    [[deprecated(&quot;NOTICE: GetLength has been deprecated and will be removed in the next version. Please do not use &quot;</span></span>
<span class="line"><span>                 &quot;it!&quot;)]]</span></span>
<span class="line"><span>    __aicore__ inline uint32_t GetLength() const;</span></span>
<span class="line"><span>    __aicore__ inline void SetBufferLen(uint32_t dataLen);</span></span>
<span class="line"><span>    __aicore__ inline void SetUserTag(const TTagType tag);</span></span>
<span class="line"><span>    __aicore__ inline TTagType GetUserTag() const;</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    __aicore__ inline void SetShapeInfo(const ShapeInfo&amp; shapeInfo);</span></span>
<span class="line"><span>    __aicore__ inline ShapeInfo GetShapeInfo() const;</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>};</span></span></code></pre></div><h2 id="模板参数" tabindex="-1">模板参数 <a class="header-anchor" href="#模板参数" aria-label="Permalink to &quot;模板参数&quot;">​</a></h2><p><strong>表 1</strong> 模板参数说明</p><table tabindex="0"><thead><tr><th>参数名</th><th>描述</th></tr></thead><tbody><tr><td>T</td><td>类型T可以支持基础数据类型以及TensorTrait类型，但需要遵循使用此LocalTensor接口的数据类型支持情况。 特别地，针对根据指定的逻辑位置/地址/长度，返回Tensor对象的构造函数，类型T仅支持基础数据类型。</td></tr></tbody></table>`,9)])])}const u=s(p,[["render",i]]);export{T as __pageData,u as default};
