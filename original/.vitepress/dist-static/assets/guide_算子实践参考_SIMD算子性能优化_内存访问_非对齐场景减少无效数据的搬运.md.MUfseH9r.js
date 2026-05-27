import{c as s,Q as n,j as p,m as e}from"./chunks/framework.DOi4mjdC.js";const t="/assets/Normal%E6%A8%A1%E5%BC%8F%E6%90%AC%E8%BF%90.BmEmyGRM.png",l="/assets/Compact%E6%A8%A1%E5%BC%8F%E6%90%AC%E8%BF%90.B2ulWPw6.png",g=JSON.parse('{"title":"非对齐场景减少无效数据的搬运","description":"","frontmatter":{},"headers":[{"level":1,"title":"非对齐场景减少无效数据的搬运","slug":"非对齐场景减少无效数据的搬运"}],"relativePath":"guide/算子实践参考/SIMD算子性能优化/内存访问/非对齐场景减少无效数据的搬运.md","filePath":"guide/算子实践参考/SIMD算子性能优化/内存访问/非对齐场景减少无效数据的搬运.md"}'),i={name:"guide/算子实践参考/SIMD算子性能优化/内存访问/非对齐场景减少无效数据的搬运.md"};function o(c,a,d,r,m,C){return n(),p("div",null,[...a[0]||(a[0]=[e(`<h1 id="非对齐场景减少无效数据的搬运" tabindex="-1">非对齐场景减少无效数据的搬运 <a class="header-anchor" href="#非对齐场景减少无效数据的搬运" aria-label="Permalink to &quot;非对齐场景减少无效数据的搬运&quot;">​</a></h1><p>【优先级】中</p><div class="note custom-block github-alert"><p class="custom-block-title">说明</p><p>该性能优化建议适用于如下型号：</p><ul><li>Ascend 950PR/Ascend 950DT</li></ul></div><p>【描述】在非对齐数据搬运场景中，Ascend 950PR/Ascend 950DT在基础API层面提供了DataCopyPad接口，该接口支持Normal、Compact（紧凑）两种搬运模式。搬运多块非32B对齐数据块的场景下，使用Compact模式在可以减少搬运的无效数据量，节省带宽。</p><p>假设需要搬运三个数据块，每块数据块大小为48B，数据类型为float类型。除了这三个48字节的数据块之外，其他所有数据均为无效数据。</p><p>【反例】使用DataCopyPad接口进行Normal模式搬运数据</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>__aicore__ inline void CopyIn(){</span></span>
<span class="line"><span>    AscendC::LocalTensor&lt;T&gt; xLocal = inQueueX.AllocTensor&lt;T&gt;();</span></span>
<span class="line"><span>    AscendC::Duplicate&lt;T&gt;(xLocal, 0, count);</span></span>
<span class="line"><span>    AscendC::DataCopyParams dataCopyParams;</span></span>
<span class="line"><span>    dataCopyParams.blockCount = 3;</span></span>
<span class="line"><span>    dataCopyParams.blockLen = 48;</span></span>
<span class="line"><span>    dataCopyParams.srcStride = 0;</span></span>
<span class="line"><span>    dataCopyParams.dstStride = 0;</span></span>
<span class="line"><span>    AscendC::DataCopyPadParams dataCopyPadParams;</span></span>
<span class="line"><span>    dataCopyPadParams.isPad = 1;</span></span>
<span class="line"><span>    dataCopyPadParams.leftPadding = 0;</span></span>
<span class="line"><span>    dataCopyPadParams.rightPadding = 4;</span></span>
<span class="line"><span>    dataCopyPadParams.paddingValue = 0;</span></span>
<span class="line"><span>    AscendC::DataCopyPad&lt;T, AscendC::PaddingMode::Normal&gt;(xLocal, xGm, dataCopyParams, dataCopyPadParams);</span></span>
<span class="line"><span>    inQueueX.EnQue&lt;T&gt;(xLocal);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>搬运后UB内数据如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[1., 1., 1., 1., 1., 1., 1., 1., 1., 1., 1., 1., 0., 0., 0., 0., </span></span>
<span class="line"><span> 1., 1., 1., 1., 1., 1., 1., 1., 1., 1., 1., 1., 0., 0., 0., 0.,</span></span>
<span class="line"><span> 1., 1., 1., 1., 1., 1., 1., 1., 1., 1., 1., 1., 0., 0., 0., 0.....]</span></span></code></pre></div><p><strong>图 1</strong> Normal模式搬运<br><img src="`+t+`" alt="" title="Normal模式搬运"></p><p>如图所示，由于每块数据块为48B，非32B对齐，因此搬运每块数据块时需要插入16B大小的padding数据使得数据32B对齐，最终搬运192B大小的数据到UB，其中包含48B的无效数据。</p><p>【正例】改用Compact模式搬运进行优化</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>__aicore__ inline void CopyIn(){</span></span>
<span class="line"><span>    AscendC::LocalTensor&lt;T&gt; xLocal = inQueueX.AllocTensor&lt;T&gt;();</span></span>
<span class="line"><span>    AscendC::Duplicate&lt;T&gt;(xLocal, 0, count);</span></span>
<span class="line"><span>    AscendC::DataCopyParams dataCopyParams;</span></span>
<span class="line"><span>    dataCopyParams.blockCount = 3;</span></span>
<span class="line"><span>    dataCopyParams.blockLen = 48;</span></span>
<span class="line"><span>    dataCopyParams.srcStride = 0;</span></span>
<span class="line"><span>    dataCopyParams.dstStride = 0;</span></span>
<span class="line"><span>    AscendC::DataCopyPadParams dataCopyPadParams;</span></span>
<span class="line"><span>    dataCopyPadParams.isPad = 1;</span></span>
<span class="line"><span>    dataCopyPadParams.leftPadding = 0;</span></span>
<span class="line"><span>    dataCopyPadParams.rightPadding = 4;</span></span>
<span class="line"><span>    dataCopyPadParams.paddingValue = 0;</span></span>
<span class="line"><span>    AscendC::DataCopyPad&lt;T, AscendC::PaddingMode::Compact&gt;(xLocal, xGm, dataCopyParams, dataCopyPadParams);</span></span>
<span class="line"><span>    inQueueX.EnQue&lt;T&gt;(xLocal);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>搬运后UB内数据如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[1., 1., 1., 1., 1., 1., 1., 1., 1., 1., 1., 1., 1., 1., 1., 1., 1.,</span></span>
<span class="line"><span> 1., 1., 1., 1., 1., 1., 1., 1., 1., 1., 1., 1., 1., 1., 1., 1., 1.,</span></span>
<span class="line"><span> 1., 1., 0., 0., 0., 0....]</span></span></code></pre></div><p><strong>图 2</strong> Compact模式搬运<br><img src="`+l+'" alt="" title="Compact模式搬运"></p><p>根据Compact模式搬运的示意图，最终搬运了160B大小的数据，其中包含16B的无效数据。</p><p>【总结】通过比较可以发现，搬运多块非32B对齐数据块的场景下，使用Compact模式在可以减少搬运的无效数据量，节省带宽。</p>',18)])])}const u=s(i,[["render",o]]);export{g as __pageData,u as default};
