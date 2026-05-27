import{c as n,Q as e,j as a,m as p}from"./chunks/framework.DOi4mjdC.js";const l="/assets/%E6%95%B0%E6%8D%AE%E6%90%AC%E8%BF%90%E4%B8%8EVector%E8%AE%A1%E7%AE%97%E8%BF%87%E7%A8%8B-54.BjJTOCRo.png",i="/assets/%E6%9C%AA%E4%BD%BF%E8%83%BDDoubleBuffer%E7%9A%84%E6%B5%81%E6%B0%B4%E5%9B%BE.BVaIW7qj.png",t="/assets/DoubleBuffer%E6%9C%BA%E5%88%B6-55.D_XhczcJ.png",o="/assets/%E4%BD%BF%E8%83%BDDoubleBuffer%E7%9A%84%E6%B5%81%E6%B0%B4%E5%9B%BE.BtzCrUff.png",m=JSON.parse('{"title":"使能DoubleBuffer","description":"","frontmatter":{},"headers":[{"level":1,"title":"使能DoubleBuffer","slug":"使能doublebuffer"}],"relativePath":"guide/算子实践参考/SIMD算子性能优化/流水编排/使能DoubleBuffer.md","filePath":"guide/算子实践参考/SIMD算子性能优化/流水编排/使能DoubleBuffer.md"}'),r={name:"guide/算子实践参考/SIMD算子性能优化/流水编排/使能DoubleBuffer.md"};function c(u,s,f,_,B,b){return e(),a("div",null,[...s[0]||(s[0]=[p('<h1 id="使能doublebuffer" tabindex="-1">使能DoubleBuffer <a class="header-anchor" href="#使能doublebuffer" aria-label="Permalink to &quot;使能DoubleBuffer&quot;">​</a></h1><p>【优先级】中</p><p>【描述】执行于AI Core上的指令队列主要包括如下几类，Vector指令队列（V）、Cube指令队列（M）、Scalar指令队列（S）和搬运指令队列（MTE1/MTE2/MTE3）。不同指令队列间的相互独立性和可并行执行特性，是DoubleBuffer优化机制的基石。</p><p>以纯Vector计算为例，矢量计算前后的CopyIn、CopyOut过程使用搬运指令队列（MTE2/MTE3），Compute过程使用Vector指令队列（V），不同指令队列可并行执行，意味着CopyIn、CopyOut过程和Compute过程是可以并行的。如<a href="#fig994415385460">图1</a>所示，考虑一个完整的数据搬运和计算过程，CopyIn过程将数据从Global Memory搬运到Local Memory，Vector计算单元完成Compute计算后，经过CopyOut过程将计算结果搬回Global Memory。</p><p><strong>图 1</strong> 数据搬运与Vector计算过程<br><img src="'+l+'" alt="" title="数据搬运与Vector计算过程-54"></p><p><strong>图 2</strong> 未使能DoubleBuffer的流水图<br><img src="'+i+'" alt="" title="未使能DoubleBuffer的流水图"></p><p>在此过程中，数据搬运与Vector计算串行执行，Vector计算单元不可避免存在资源闲置问题，假设CopyIn、Compute、CopyOut三阶段分别耗时相同均为_t_，则Vector的利用率仅为1/3，等待时间过长，Vector利用率严重不足。</p><p>为减少Vector等待时间，使能DoubleBuffer机制将待处理的数据一分为二，例如Tensor1、Tensor2。如<a href="#fig189541246194710">图3</a>所示，当Vector单元对Tensor1中数据进行Compute计算时，Tensor2数据流可以执行CopyIn的过程；而当Vector切换到计算Tensor2时，Tensor1数据流可以执行CopyOut的过程。由此，数据的进出搬运和Vector计算实现并行执行，Vector闲置问题得以有效缓解。</p><p>总体来说，DoubleBuffer是基于MTE指令队列与Vector指令队列的独立性和可并行性，通过将数据搬运与Vector计算并行执行以隐藏大部分的数据搬运时间，并降低Vector指令的等待时间，最终提高Vector单元的利用效率。通过为队列申请内存时设置内存块的个数为2，使能DoubleBuffer，实现数据并行，简单代码示例如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>pipe.InitBuffer(inQueueX, 2, 256);</span></span></code></pre></div><p><strong>图 3</strong> DoubleBuffer机制<br><img src="'+t+'" alt="" title="DoubleBuffer机制-55"></p><p><strong>图 4</strong> 使能DoubleBuffer的流水图<br><img src="'+o+`" alt="" title="使能DoubleBuffer的流水图"></p><p><strong>需要注意：</strong></p><p>多数情况下，采用DoubleBuffer能有效提升Vector的利用率，缩减算子执行时间。然而，DoubleBuffer机制缓解Vector闲置问题，并不代表它总能带来明显的整体性能提升。例如：</p><ul><li>当数据搬运时间较短，而Vector计算时间较长时，由于数据搬运在整个计算过程中的时间占比较低，DoubleBuffer机制带来的性能收益会偏小。</li><li>当原始数据较小且Vector可一次性完成所有数据量的计算时，强行使用DoubleBuffer会降低Vector计算资源的利用率，最终效果可能适得其反。</li></ul><p>因此，DoubleBuffer的使用需综合考虑Vector算力、数据量大小、搬运与计算时间占比等多种因素。</p><p>【反例】</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>__aicore__ inline void Init(__gm__ uint8_t* src0Gm, __gm__ uint8_t* src1Gm, __gm__ uint8_t* dstGm)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    src0Global.SetGlobalBuffer((__gm__ half*)src0Gm);</span></span>
<span class="line"><span>    src1Global.SetGlobalBuffer((__gm__ half*)src1Gm);</span></span>
<span class="line"><span>    dstGlobal.SetGlobalBuffer((__gm__ half*)dstGm);</span></span>
<span class="line"><span>    // 不使能DoubleBuffer,占用的物理空间是1 * sizeSrc0 * sizeof(half)</span></span>
<span class="line"><span>    // 3个InitBuffer执行后总空间为1 * (sizeSrc0 * sizeof(half) + sizeSrc1 * sizeof(half) + sizeDst0 * sizeof(half)) </span></span>
<span class="line"><span>    pipe.InitBuffer(inQueueSrc0, 1, sizeSrc0 * sizeof(half));</span></span>
<span class="line"><span>    pipe.InitBuffer(inQueueSrc1, 1, sizeSrc1 * sizeof(half));</span></span>
<span class="line"><span>    pipe.InitBuffer(outQueueDst, 1, sizeDst0 * sizeof(half));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>__aicore__ inline void Process()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    // 需要round*2次循环才能处理完数据</span></span>
<span class="line"><span>    for (uint32_t index = 0; index &lt; round * 2; ++index) {</span></span>
<span class="line"><span>        CopyIn(index);</span></span>
<span class="line"><span>        Compute();</span></span>
<span class="line"><span>        CopyOut(index);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>【正例】</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>__aicore__ inline void Init(__gm__ uint8_t* src0Gm, __gm__ uint8_t* src1Gm, __gm__ uint8_t* dstGm)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    src0Global.SetGlobalBuffer((__gm__ half*)src0Gm);</span></span>
<span class="line"><span>    src1Global.SetGlobalBuffer((__gm__ half*)src1Gm);</span></span>
<span class="line"><span>    dstGlobal.SetGlobalBuffer((__gm__ half*)dstGm);</span></span>
<span class="line"><span>    // InitBuffer中使用2表示使能DoubleBuffer,占用的物理空间是2 * sizeSrc0 * sizeof(half)</span></span>
<span class="line"><span>    // 3个InitBuffer执行后总空间为2 * (sizeSrc0 * sizeof(half) + sizeSrc1 * sizeof(half) + sizeDst0 * sizeof(half)) </span></span>
<span class="line"><span>    pipe.InitBuffer(inQueueSrc0, 2, sizeSrc0 * sizeof(half));</span></span>
<span class="line"><span>    pipe.InitBuffer(inQueueSrc1, 2, sizeSrc1 * sizeof(half));</span></span>
<span class="line"><span>    pipe.InitBuffer(outQueueDst, 2, sizeDst0 * sizeof(half));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>__aicore__ inline void Process()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    // 开启DoubleBuffer的前提是循环次数 &gt;= 2</span></span>
<span class="line"><span>    for (uint32_t index = 0; index &lt; round; ++index) {</span></span>
<span class="line"><span>        CopyIn(index);</span></span>
<span class="line"><span>        Compute();</span></span>
<span class="line"><span>        CopyOut(index);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div>`,20)])])}const g=n(r,[["render",c]]);export{m as __pageData,g as default};
