import{c as s,Q as n,j as _,m as i}from"./chunks/framework.DOi4mjdC.js";const g=JSON.parse('{"title":"函数","description":"","frontmatter":{},"headers":[{"level":1,"title":"函数","slug":"函数"}],"relativePath":"guide/技术附录/CPP标准支持/语法限制/函数.md","filePath":"guide/技术附录/CPP标准支持/语法限制/函数.md"}'),p={name:"guide/技术附录/CPP标准支持/语法限制/函数.md"};function l(e,a,t,c,o,d){return n(),_("div",null,[...a[0]||(a[0]=[i(`<h1 id="函数" tabindex="-1">函数 <a class="header-anchor" href="#函数" aria-label="Permalink to &quot;函数&quot;">​</a></h1><p>__simt_vf__标记的SIMT VF函数需要遵循以下约束和限制：</p><ul><li><p>标量参数不允许使用指针和引用。</p></li><li><p>不允许使用数组作为参数，以下为错误示例。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>__simt_vf__ __launch_bounds__(1024) inline void foo(__gm__ int* a, __gm__ int* b, __gm__ int* c, int* array) {</span></span>
<span class="line"><span>    int idx = blockIdx * blockDim.x + threadIdx.x;</span></span>
<span class="line"><span>    // error: 不允许使用数组array</span></span>
<span class="line"><span>    a[idx] = b[idx] + c[idx] + array[0];</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>__global__ __aicore__ void foo(__gm__ int* a, __gm__ int* b, __gm__ int* c) {</span></span>
<span class="line"><span>    int array[5] = {0,1,2,3,4};</span></span>
<span class="line"><span>    asc_vf_call&lt;foo&gt;(dim3{256}, a, b, c, array);</span></span>
<span class="line"><span>}</span></span></code></pre></div></li><li><p>如果传参中出现多级指针，不允许使用内层栈地址指针访问，以下为错误示例。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>__simt_vf__ __launch_bounds__(1024) inline void foo(__gm__ int* a, __gm__ int* b, __gm__ int* c, __ubuf__ uint64_t* s) {</span></span>
<span class="line"><span>    int idx = blockIdx * blockDim.x + threadIdx.x;</span></span>
<span class="line"><span>    int* stack = (int*)(s[0]);</span></span>
<span class="line"><span>    // error: *stack表示从多级指针中读取，不允许使用</span></span>
<span class="line"><span>    a[idx] = b[idx] + c[idx] + *stack;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>__global__ __aicore__ void foo(__gm__ int* a, __gm__ int* b, __gm__ int* c) {</span></span>
<span class="line"><span>    int stack = 0;</span></span>
<span class="line"><span>    __ubuf__ uint64_t* s = ...;</span></span>
<span class="line"><span>    s[0] = &amp;stack;</span></span>
<span class="line"><span>    asc_vf_call&lt;foo&gt;(dim3{256}, a, b, c, s);</span></span>
<span class="line"><span>}</span></span></code></pre></div></li><li><p>不支持通过函数指针进行间接调用，被调用的__simt_vf__函数需要在编译期确定。</p></li><li><p>函数的inline行为由编译器决定，添加的always_inline或noinline将被忽略。</p></li><li><p>不允许使用结构体作为参数，以下为错误示例。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>__simt_vf__ __launch_bounds__(1024) inline void foo(__gm__ int* a, __gm__ int* b, __gm__ int* c, struct S s) {</span></span>
<span class="line"><span>    // error: s表示结构体参数，不允许使用</span></span>
<span class="line"><span>}</span></span></code></pre></div></li></ul>`,3)])])}const m=s(p,[["render",l]]);export{g as __pageData,m as default};
