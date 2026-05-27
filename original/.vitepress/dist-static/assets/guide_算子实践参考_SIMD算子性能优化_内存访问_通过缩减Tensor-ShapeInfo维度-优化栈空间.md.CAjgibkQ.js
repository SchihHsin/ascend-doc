import{c as s,Q as a,j as p,m as e}from"./chunks/framework.DOi4mjdC.js";const h=JSON.parse('{"title":"通过缩减Tensor ShapeInfo维度，优化栈空间","description":"","frontmatter":{},"headers":[{"level":1,"title":"通过缩减Tensor ShapeInfo维度，优化栈空间","slug":"通过缩减tensor-shapeinfo维度优化栈空间"}],"relativePath":"guide/算子实践参考/SIMD算子性能优化/内存访问/通过缩减Tensor-ShapeInfo维度-优化栈空间.md","filePath":"guide/算子实践参考/SIMD算子性能优化/内存访问/通过缩减Tensor-ShapeInfo维度-优化栈空间.md"}'),l={name:"guide/算子实践参考/SIMD算子性能优化/内存访问/通过缩减Tensor-ShapeInfo维度-优化栈空间.md"};function t(i,n,o,c,_,r){return a(),p("div",null,[...n[0]||(n[0]=[e(`<h1 id="通过缩减tensor-shapeinfo维度-优化栈空间" tabindex="-1">通过缩减Tensor ShapeInfo维度，优化栈空间 <a class="header-anchor" href="#通过缩减tensor-shapeinfo维度-优化栈空间" aria-label="Permalink to &quot;通过缩减Tensor ShapeInfo维度，优化栈空间&quot;">​</a></h1><p>【优先级】中</p><p>【描述】GlobalTensor和LocalTensor中通过ShapeInfo类型的成员变量来保存shape信息，SetShapeInfo/GetShapeInfo可以设置或者获取ShapeInfo，在算子实现内部用于shape信息保存和传递。默认情况下支持的最大维度为8。在不使用上述ShapeInfo功能的情况下，不需要这些信息，可以通过K_MAX_SHAPE_DIM宏将其设置为0。经实测减小K_MAX_SHAPE_DIM值，可缩减栈空间，减少scalar指令和cache miss几率，提升算子性能。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>...</span></span>
<span class="line"><span>#ifndef K_MAX_SHAPE_DIM</span></span>
<span class="line"><span>#define K_MAX_SHAPE_DIM 8</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span>struct ShapeInfo {</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    uint32_t shape[K_MAX_SHAPE_DIM];</span></span>
<span class="line"><span>    uint32_t originalShape[K_MAX_SHAPE_DIM];</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>template &lt;typename T&gt; class GlobalTensor {</span></span>
<span class="line"><span>....</span></span>
<span class="line"><span>private:</span></span>
<span class="line"><span>    ShapeInfo shapeInfo_;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>template &lt;typename T&gt; class LocalTensor {</span></span>
<span class="line"><span>....</span></span>
<span class="line"><span>private:</span></span>
<span class="line"><span>    ShapeInfo shapeInfo_;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>...</span></span></code></pre></div><p>【反例】</p><p>算子无需使用ShapeInfo，但未对ShapeInfo大小进行限制（使用默认值8），导致浪费K_MAX_SHAPE_DIM * sizeof(uint32_t) * 2 * 4字节的栈空间。2表示有shape和originalShape两个数组，4表示该样例中使用了GlobalTensor和LocalTensor共4个Tensor。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>...</span></span>
<span class="line"><span>#include &quot;kernel_operator.h&quot; ...</span></span>
<span class="line"><span>extern &quot;C&quot; __global__ __aicore__ void add_custom(GM_ADDR x, GM_ADDR y, GM_ADDR z, GM_ADDR workspace, GM_ADDR tiling)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    GlobalTensor&lt;T&gt; dataIn;</span></span>
<span class="line"><span>    GlobalTensor&lt;T&gt; dataOut;</span></span>
<span class="line"><span>    LocalTensor&lt;T&gt; vecIn;</span></span>
<span class="line"><span>    LocalTensor&lt;T&gt; vecOut;</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>...</span></span></code></pre></div><p>【正例】</p><p>算子无需使用ShapeInfo，设置#define K_MAX_SHAPE_DIM 0，有效缩减了K_MAX_SHAPE_DIM * sizeof(uint32_t) * 2 * 4大小的栈空间。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#define K_MAX_SHAPE_DIM 0</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span>#include &quot;kernel_operator.h&quot;</span><span> //需注意定义K_MAX_SHAPE_DIM宏的位置须在包含Ascend C相关头文件之前</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span>extern &quot;C&quot; __global__ __aicore__ void add_custom(GM_ADDR x, GM_ADDR x, GM_ADDR z, GM_ADDR workspace, GM_ADDR tiling)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    GlobalTensor&lt;T&gt; dataIn;</span></span>
<span class="line"><span>    GlobalTensor&lt;T&gt; dataOut;</span></span>
<span class="line"><span>    LocalTensor&lt;T&gt; vecIn;</span></span>
<span class="line"><span>    LocalTensor&lt;T&gt; vecOut;</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>...</span></span></code></pre></div>`,10)])])}const u=s(l,[["render",t]]);export{h as __pageData,u as default};
