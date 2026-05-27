import{c as n,Q as a,j as p,m as l}from"./chunks/framework.DOi4mjdC.js";const e="/assets/%E6%95%B0%E6%8D%AE%E6%B5%81%E5%9B%BE%E5%AF%B9%E6%AF%94.BAVmgS25.png",d=JSON.parse('{"title":"通过Unified Buffer融合实现连续vector计算","description":"","frontmatter":{},"headers":[{"level":1,"title":"通过Unified Buffer融合实现连续vector计算","slug":"通过unified-buffer融合实现连续vector计算"}],"relativePath":"guide/算子实践参考/SIMD算子性能优化/矢量计算/通过Unified-Buffer融合实现连续vector计算.md","filePath":"guide/算子实践参考/SIMD算子性能优化/矢量计算/通过Unified-Buffer融合实现连续vector计算.md"}'),i={name:"guide/算子实践参考/SIMD算子性能优化/矢量计算/通过Unified-Buffer融合实现连续vector计算.md"};function t(c,s,o,r,u,_){return a(),p("div",null,[...s[0]||(s[0]=[l('<h1 id="通过unified-buffer融合实现连续vector计算" tabindex="-1">通过Unified Buffer融合实现连续vector计算 <a class="header-anchor" href="#通过unified-buffer融合实现连续vector计算" aria-label="Permalink to &quot;通过Unified Buffer融合实现连续vector计算&quot;">​</a></h1><p>【优先级】高</p><p>【描述】算子实现中涉及多次vector计算，且前一次计算输出是后一次计算输入的情况下，可将前一次计算输出暂存在UB（Unified Buffer）上直接作为下一次计算的输入，不需要将前一次的计算输出从UB搬运到GM后再从GM搬运到UB。这种UB Buffer融合的方式可以减少搬入搬出次数，实现连续vector计算，提升内存使用效率。数据流图对比如下：</p><p><strong>图 1</strong> 数据流图对比<br><img src="'+e+`" alt="" title="数据流图对比"></p><p>【反例】</p><p>该算子的计算逻辑为进行Exp计算后再进行Abs计算。计算过程中先把源操作数从GM搬运到UB进行Exp计算，Exp计算完成后将Exp的结果从UB搬运到GM；再从GM中把Exp的结果搬运到UB上作为Abs计算的输入，Abs计算完成后将目的操作数结果从UB搬运到GM。整个过程从GM搬进搬出共4次。当需要进行的vector计算为n次时，从GM搬进搬出共需要2n次。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class KernelSample {</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    __aicore__ inline KernelSample() {}</span></span>
<span class="line"><span>    __aicore__ inline void Init(__gm__ uint8_t* src0Gm, __gm__ uint8_t* dstGm)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        src0Global.SetGlobalBuffer((__gm__ float*)src0Gm);</span></span>
<span class="line"><span>        dstGlobal.SetGlobalBuffer((__gm__ float*)dstGm);</span></span>
<span class="line"><span>        pipe.InitBuffer(inQueueSrc0, 1, 1024 * sizeof(float));</span></span>
<span class="line"><span>        pipe.InitBuffer(outQueueDst, 1, 1024 * sizeof(float));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void Process()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        CopyIn();</span></span>
<span class="line"><span>        Compute();</span></span>
<span class="line"><span>        CopyOut();</span></span>
<span class="line"><span>        CopyIn1();</span></span>
<span class="line"><span>        Compute1();</span></span>
<span class="line"><span>        CopyOut1();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private:</span></span>
<span class="line"><span>    __aicore__ inline void CopyIn()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        LocalTensor&lt;float&gt; src0Local = inQueueSrc0.AllocTensor&lt;float&gt;();</span></span>
<span class="line"><span>        DataCopy(src0Local, src0Global, 1024);</span></span>
<span class="line"><span>        inQueueSrc0.EnQue(src0Local);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void Compute()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        LocalTensor&lt;float&gt; src0Local = inQueueSrc0.DeQue&lt;float&gt;();</span></span>
<span class="line"><span>        LocalTensor&lt;float&gt; dstLocal = outQueueDst.AllocTensor&lt;float&gt;();</span></span>
<span class="line"><span>        Exp(dstLocal, src0Local, 1024);</span></span>
<span class="line"><span>        outQueueDst.EnQue&lt;float&gt;(dstLocal);</span></span>
<span class="line"><span>        inQueueSrc0.FreeTensor(src0Local);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void CopyOut()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        LocalTensor&lt;float&gt; dstLocal = outQueueDst.DeQue&lt;float&gt;();</span></span>
<span class="line"><span>        DataCopy(dstGlobal, dstLocal, 1024);</span></span>
<span class="line"><span>        outQueueDst.FreeTensor(dstLocal);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void CopyIn1()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        LocalTensor&lt;float&gt; src0Local = inQueueSrc0.AllocTensor&lt;float&gt;();</span></span>
<span class="line"><span>        DataCopy(src0Local, dstGlobal, 1024);</span></span>
<span class="line"><span>        inQueueSrc0.EnQue(src0Local);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void Compute1()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        LocalTensor&lt;float&gt; src0Local = inQueueSrc0.DeQue&lt;float&gt;();</span></span>
<span class="line"><span>        LocalTensor&lt;float&gt; dstLocal = outQueueDst.AllocTensor&lt;float&gt;();</span></span>
<span class="line"><span>        Abs(dstLocal, src0Local, 1024);</span></span>
<span class="line"><span>        outQueueDst.EnQue&lt;float&gt;(dstLocal);</span></span>
<span class="line"><span>        inQueueSrc0.FreeTensor(src0Local);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void CopyOut1()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        LocalTensor&lt;float&gt; dstLocal = outQueueDst.DeQue&lt;float&gt;();</span></span>
<span class="line"><span>        DataCopy(dstGlobal, dstLocal, 1024);</span></span>
<span class="line"><span>        outQueueDst.FreeTensor(dstLocal);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private:</span></span>
<span class="line"><span>    TPipe pipe;</span></span>
<span class="line"><span>    TQue&lt;TPosition::VECIN, 1&gt; inQueueSrc0;</span></span>
<span class="line"><span>    TQue&lt;TPosition::VECOUT, 1&gt; outQueueDst;</span></span>
<span class="line"><span>    GlobalTensor&lt;float&gt; src0Global, dstGlobal;</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>【正例】</p><p>使用UB Buffer融合方式后，在UB上进行连续vector计算时，前一次的结果可直接作为后一次计算的输入，继续在UB上进行计算，不需要中间的搬进搬出，只需在开始计算时将源操作数搬运到UB，以及全部计算结束后将最终结果从UB搬运到GM，共2次搬进搬出。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class KernelSample {</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    __aicore__ inline KernelSample() {}</span></span>
<span class="line"><span>    __aicore__ inline void Init(__gm__ uint8_t* src0Gm, __gm__ uint8_t* dstGm)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        src0Global.SetGlobalBuffer((__gm__ float*)src0Gm);</span></span>
<span class="line"><span>        dstGlobal.SetGlobalBuffer((__gm__ float*)dstGm);</span></span>
<span class="line"><span>        pipe.InitBuffer(inQueueSrc0, 1, 1024 * sizeof(float));</span></span>
<span class="line"><span>        pipe.InitBuffer(outQueueDst, 1, 1024 * sizeof(float));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void Process()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        CopyIn();</span></span>
<span class="line"><span>        Compute();</span></span>
<span class="line"><span>        CopyOut();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private:</span></span>
<span class="line"><span>    __aicore__ inline void CopyIn()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        LocalTensor&lt;float&gt; src0Local = inQueueSrc0.AllocTensor&lt;float&gt;();</span></span>
<span class="line"><span>        DataCopy(src0Local, src0Global, 1024);</span></span>
<span class="line"><span>        inQueueSrc0.EnQue(src0Local);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void Compute()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        LocalTensor&lt;float&gt; src0Local = inQueueSrc0.DeQue&lt;float&gt;();</span></span>
<span class="line"><span>        LocalTensor&lt;float&gt; dstLocal = outQueueDst.AllocTensor&lt;float&gt;();</span></span>
<span class="line"><span>        Exp(dstLocal, src0Local, 1024);</span></span>
<span class="line"><span>        Abs(dstLocal, dstLocal, 1024);</span></span>
<span class="line"><span>        outQueueDst.EnQue&lt;float&gt;(dstLocal);</span></span>
<span class="line"><span>        inQueueSrc0.FreeTensor(src0Local);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void CopyOut()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        LocalTensor&lt;float&gt; dstLocal = outQueueDst.DeQue&lt;float&gt;();</span></span>
<span class="line"><span>        DataCopy(dstGlobal, dstLocal, 1024);</span></span>
<span class="line"><span>        outQueueDst.FreeTensor(dstLocal);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private:</span></span>
<span class="line"><span>    TPipe pipe;</span></span>
<span class="line"><span>    TQue&lt;TPosition::VECIN, 1&gt; inQueueSrc0;</span></span>
<span class="line"><span>    TQue&lt;TPosition::VECOUT, 1&gt; outQueueDst;</span></span>
<span class="line"><span>    GlobalTensor&lt;float&gt; src0Global, dstGlobal;</span></span>
<span class="line"><span>};</span></span></code></pre></div>`,10)])])}const g=n(i,[["render",t]]);export{d as __pageData,g as default};
