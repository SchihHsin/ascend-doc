import{c as s,Q as a,j as p,m as e}from"./chunks/framework.DOi4mjdC.js";const l="/assets/1.DO4qUTOf.png",C=JSON.parse('{"title":"纯搬运类算子VECIN和VECOUT建议复用","description":"","frontmatter":{},"headers":[{"level":1,"title":"纯搬运类算子VECIN和VECOUT建议复用","slug":"纯搬运类算子vecin和vecout建议复用"}],"relativePath":"guide/算子实践参考/SIMD算子性能优化/内存访问/纯搬运类算子VECIN和VECOUT建议复用.md","filePath":"guide/算子实践参考/SIMD算子性能优化/内存访问/纯搬运类算子VECIN和VECOUT建议复用.md"}'),i={name:"guide/算子实践参考/SIMD算子性能优化/内存访问/纯搬运类算子VECIN和VECOUT建议复用.md"};function c(t,n,o,u,r,_){return a(),p("div",null,[...n[0]||(n[0]=[e(`<h1 id="纯搬运类算子vecin和vecout建议复用" tabindex="-1">纯搬运类算子VECIN和VECOUT建议复用 <a class="header-anchor" href="#纯搬运类算子vecin和vecout建议复用" aria-label="Permalink to &quot;纯搬运类算子VECIN和VECOUT建议复用&quot;">​</a></h1><p>【优先级】高</p><p>【描述】纯搬运类算子在执行时并不涉及实际vector计算，若存在冗余的vector指令，会导致算子整体执行时间变长。这种场景可以使用Ascend C针对纯搬运类算子提供的TQueBind接口，该接口可以将VECIN与VECOUT绑定，省略将数据从VECIN拷贝到VECOUT的步骤，从而避免vector的无谓消耗。</p><p>【反例】</p><p>此段代码为了保证数据搬入和数据搬出之间的流水同步，存在LocalTensor -&gt; LocalTensor的DataCopy指令。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>template &lt;typename ComputeT&gt; class KernelExample {</span></span>
<span class="line"><span> public:</span></span>
<span class="line"><span>     ...</span></span>
<span class="line"><span>     __aicore__ inline void Process(...)</span></span>
<span class="line"><span>     {</span></span>
<span class="line"><span>         for (int i = 0; i &lt; iLen; ++i) {</span></span>
<span class="line"><span>             ... </span></span>
<span class="line"><span>             auto iLocal = QueI.AllocTensor&lt;ComputeT&gt;();</span></span>
<span class="line"><span>             DataCopy(iLocal, inGm[i * 32], size);</span></span>
<span class="line"><span>             QueI.EnQue(iLocal);</span></span>
<span class="line"><span>             iLocal = QueI.DeQue&lt;ComputeT&gt;();</span></span>
<span class="line"><span>             for (int j = 0; j &lt; jLen; ++j) { </span></span>
<span class="line"><span>                 ...</span></span>
<span class="line"><span>                 auto oLocal = QueO.AllocTensor&lt;ComputeT&gt;();</span></span>
<span class="line"><span>                 DataCopy(oLocal, iLocal, size); // LocalTensor -&gt; LocalTensor的DataCopy指令,以实现数据从VECIN到VECOUT的搬运</span></span>
<span class="line"><span>                 QueO.EnQue(oLocal);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>                 auto oLocal = QueO.DeQue&lt;ComputeT&gt;();</span></span>
<span class="line"><span>                 DataCopyPad(outGm[j], oLocal, ...);</span></span>
<span class="line"><span>                 QueO.FreeTensor(oLocal);</span></span>
<span class="line"><span>             }</span></span>
<span class="line"><span>             QueI.FreeTensor(iLocal);</span></span>
<span class="line"><span>         }</span></span>
<span class="line"><span>     }</span></span>
<span class="line"><span></span></span>
<span class="line"><span> private:</span></span>
<span class="line"><span>     ... </span></span>
<span class="line"><span>     TQue&lt;TPosition::VECIN, BUFFER_NUM&gt; QueI;</span></span>
<span class="line"><span>     TQue&lt;TPosition::VECOUT, BUFFER_NUM&gt; QueO;</span></span>
<span class="line"><span>     ...</span></span>
<span class="line"><span> };</span></span>
<span class="line"><span></span></span>
<span class="line"><span> extern &quot;C&quot; __global__ __aicore__ void example_kernel(...)</span></span>
<span class="line"><span> {</span></span>
<span class="line"><span>     ...</span></span>
<span class="line"><span>     op.Process(...);</span></span>
<span class="line"><span> }</span></span></code></pre></div><p>【正例】</p><p>将LocalTensor -&gt; LocalTensor的DataCopy指令替换为TQueBind接口，减少将VECIN拷贝到VECOUT的步骤，从而避免了冗余拷贝。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>template &lt;typename ComputeT&gt; class KernelExample {</span></span>
<span class="line"><span> public:</span></span>
<span class="line"><span>     ...</span></span>
<span class="line"><span>     __aicore__ inline void Process(...)</span></span>
<span class="line"><span>     {</span></span>
<span class="line"><span>         for (int i = 0; i &lt; iLen; ++i) {</span></span>
<span class="line"><span>             ... </span></span>
<span class="line"><span>             auto bindLocal = queBind.AllocTensor&lt;ComputeT&gt;();</span></span>
<span class="line"><span>             DataCopy(bindLocal, inGm[i * 32], size);</span></span>
<span class="line"><span>             queBind.EnQue(bindLocal);</span></span>
<span class="line"><span>             bindLocal = queBind.DeQue&lt;ComputeT&gt;();</span></span>
<span class="line"><span>             for (int j = 0; j &lt; jlen; ++j) {</span></span>
<span class="line"><span>                 ...</span></span>
<span class="line"><span>                 DataCopyPad(outGm[j], bindLocal, ...);</span></span>
<span class="line"><span>             }</span></span>
<span class="line"><span>             queBind.FreeTensor(bindLocal);</span></span>
<span class="line"><span>         }</span></span>
<span class="line"><span>     }</span></span>
<span class="line"><span></span></span>
<span class="line"><span> private:</span></span>
<span class="line"><span>     ... </span></span>
<span class="line"><span>     TQueBind&lt;TPosition::VECIN, TPosition::VECOUT, BUFFER_NUM&gt; queBind; // 使用TQueBind替换原来的QueI，QueO</span></span>
<span class="line"><span>     ...</span></span>
<span class="line"><span> };</span></span>
<span class="line"><span></span></span>
<span class="line"><span> extern &quot;C&quot; __global__ __aicore__ void example_kernel(...)</span></span>
<span class="line"><span> {</span></span>
<span class="line"><span>     ...</span></span>
<span class="line"><span>     op.Process(...);</span></span>
<span class="line"><span> }</span></span></code></pre></div><p>【性能对比】</p><p><strong>图 1</strong> aiv_vec_time优化前后对比</p><p><img src="`+l+'" alt=""></p><p>如上图所示，将反例中DataCopy指令替换为TQueBind之后有明显优化。由于省略了数据从VECIN拷贝到VECOUT的步骤，aiv_vec_time几乎缩减为0。</p>',13)])])}const T=s(i,[["render",c]]);export{C as __pageData,T as default};
