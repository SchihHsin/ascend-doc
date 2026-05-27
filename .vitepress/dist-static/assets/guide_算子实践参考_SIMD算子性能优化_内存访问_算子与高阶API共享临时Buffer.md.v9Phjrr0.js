import{c as n,Q as a,j as p,m as e}from"./chunks/framework.DOi4mjdC.js";const m=JSON.parse('{"title":"算子与高阶API共享临时Buffer","description":"","frontmatter":{},"headers":[{"level":1,"title":"算子与高阶API共享临时Buffer","slug":"算子与高阶api共享临时buffer"}],"relativePath":"guide/算子实践参考/SIMD算子性能优化/内存访问/算子与高阶API共享临时Buffer.md","filePath":"guide/算子实践参考/SIMD算子性能优化/内存访问/算子与高阶API共享临时Buffer.md"}'),t={name:"guide/算子实践参考/SIMD算子性能优化/内存访问/算子与高阶API共享临时Buffer.md"};function i(l,s,o,r,f,u){return a(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="算子与高阶api共享临时buffer" tabindex="-1">算子与高阶API共享临时Buffer <a class="header-anchor" href="#算子与高阶api共享临时buffer" aria-label="Permalink to &quot;算子与高阶API共享临时Buffer&quot;">​</a></h1><p>【优先级】高</p><p>【描述】如果算子使用的高阶API需要传入临时Buffer，如SoftMax，该临时空间会挤占算子其他计算的空间，从而导致单次计算搬运的数据量变少，搬运的次数变多。此场景可通过共享临时Buffer空间，提升单次搬运的数据量，减少搬运的次数，提升内存使用效率。</p><p>【反例】</p><p>SoftMax高阶API计算需要临时Buffer空间，算子在进行其他计算时拥有独立临时Buffer。UB空间是固定的，假设可以给SoftMax和Add能分配临时空间为64KB，SoftMax计算需要的临时Buffer空间tmpSoftmaxBuf占用32KB，则存储Add计算结果的LocalTensor tmpSumBuf最多只能分配32KB。如果src0Tensor计算的数据量是512KB，则需要搬运512 / 32 = <strong>16</strong>次。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>...</span></span>
<span class="line"><span>constexpr int32_t blockLen = 32 * 1024;</span></span>
<span class="line"><span>TBuf&lt;TPosition::VECCALC&gt; tmpSoftmaxBuf; </span></span>
<span class="line"><span>pipe.InitBuffer(tmpSoftmaxBuf, softmaxBufSize * sizeof(uint8_t));  // 单独分配Softmax的临时Buf 32KB</span></span>
<span class="line"><span>TBuf&lt;TPosition::VECCALC&gt; tmpSumBuf;</span></span>
<span class="line"><span>pipe.InitBuffer(tmpSumBuf, sumBufSize * sizeof(T)); // 单独分配Add的临时Buf，且softmaxBufSize * sizeof(uint8_t) + sumBufSize * sizeof(T) &lt;= 64KB</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span>for (int i = 0; i &lt; 16; i++) {</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    LocalTensor&lt;uint8_t&gt; tmpSoftmaxTensor = tmpSoftmaxBuf.Get&lt;uint8_t&gt;(softmaxBufSize);</span></span>
<span class="line"><span>    SoftMax&lt;T, true, true&gt;(dstTensor, expSumTensor, dstMaxTensor, srcTensor, tmpSoftmaxTensor, tiling);</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    DataCopy(src0Tensor, src0Gm[i * blockLen / sizeof(T)], Params);</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    LocalTensor&lt;T&gt; tmpSumTensor = tmpSumBuf.Get&lt;T&gt;(sumBufSize);</span></span>
<span class="line"><span>    Add&lt;T&gt;(tmpSumTensor, src0Tensor, src1Tensor, count);</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>...</span></span></code></pre></div><p>【正例】</p><p>SoftMax高阶API计算需要临时Buffer空间，算子在进行其他计算时可以共享此临时Buffer，按照上述假设只需要搬运512 / 64 = <strong>8</strong>次。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>...</span></span>
<span class="line"><span>constexpr int32_t blockLen = 64 * 1024;</span></span>
<span class="line"><span>TBuf&lt;TPosition::VECCALC&gt; tmpSharedBuf;</span></span>
<span class="line"><span>pipe.InitBuffer(tmpSharedBuf, bufferSize); // 共享分配bufferSize = MAX(softmaxBufSize * sizeof(uint8_t), sumBufSize * sizeof(T)) &lt;= 64KB</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span>for (int i = 0; i &lt; 8; i++) {</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    LocalTensor&lt;uint8_t&gt; tmpSharedTensor = tmpSharedBuf.Get&lt;uint8_t&gt;(softmaxBufSize);</span></span>
<span class="line"><span>    SoftMax&lt;T, true, true&gt;(dstTensor, expSumTensor, dstMaxTensor, srcTensor, tmpSharedTensor, tiling);</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    DataCopy(src0Tensor, src0Gm[i * blockLen / sizeof(T)], Params);</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    LocalTensor&lt;T&gt; tmpSumTensor = tmpSharedBuf.Get&lt;T&gt;(sumBufSize);</span></span>
<span class="line"><span>    Add&lt;T&gt;(tmpSumTensor, src0Tensor, src1Tensor, count);</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>...</span></span></code></pre></div>`,9)])])}const d=n(t,[["render",i]]);export{m as __pageData,d as default};
