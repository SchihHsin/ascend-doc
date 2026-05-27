import{c as a,Q as n,j as p,m as t}from"./chunks/framework.DOi4mjdC.js";const e="/assets/%E5%BE%85%E6%90%AC%E8%BF%90%E6%95%B0%E6%8D%AE%E6%8E%92%E5%B8%83.CNcmO89t.png",m=JSON.parse('{"title":"高效的使用搬运API","description":"","frontmatter":{},"headers":[{"level":1,"title":"高效的使用搬运API","slug":"高效的使用搬运api"}],"relativePath":"guide/算子实践参考/SIMD算子性能优化/内存访问/高效的使用搬运API.md","filePath":"guide/算子实践参考/SIMD算子性能优化/内存访问/高效的使用搬运API.md"}'),i={name:"guide/算子实践参考/SIMD算子性能优化/内存访问/高效的使用搬运API.md"};function l(o,s,c,r,d,g){return n(),p("div",null,[...s[0]||(s[0]=[t('<h1 id="高效的使用搬运api" tabindex="-1">高效的使用搬运API <a class="header-anchor" href="#高效的使用搬运api" aria-label="Permalink to &quot;高效的使用搬运API&quot;">​</a></h1><p>【优先级】高</p><p>【描述】在使用搬运API时，应该尽可能地通过配置搬运控制参数实现连续搬运或者固定间隔搬运，避免使用for循环，二者效率差距极大。如下图示例，图片的每一行为16KB，需要从每一行中搬运前2KB，针对这种场景，使用for循环遍历每行，每次仅能搬运<strong>2</strong>KB。若直接配置DataCopyParams参数（包含srcStride/dstStride/blockLen/blockCount），则可以达到一次搬完的效果，每次搬运<strong>32</strong>KB；参考<a href="./尽量一次搬运较大的数据块.html">尽量一次搬运较大的数据块</a>章节介绍的搬运数据量和实际带宽的关系，建议一次搬完。</p><p><strong>图 1</strong> 待搬运数据排布<br><img src="'+e+`" alt="" title="待搬运数据排布"></p><p>【反例】</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 搬运数据存在间隔，从GM上每行16KB中搬运2KB数据, 共16行</span></span>
<span class="line"><span>LocalTensor&lt;float&gt; tensorIn;</span></span>
<span class="line"><span>GlobalTensor&lt;float&gt; tensorGM;</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span>constexpr int32_t copyWidth = 2 * 1024 / sizeof(float);</span></span>
<span class="line"><span>constexpr int32_t imgWidth = 16 * 1024 / sizeof(float);</span></span>
<span class="line"><span>constexpr int32_t imgHeight = 16;</span></span>
<span class="line"><span>// 使用for循环，每次只能搬运2K，重复16次</span></span>
<span class="line"><span>for (int i = 0; i &lt; imgHeight; i++) {</span></span>
<span class="line"><span>    DataCopy(tensorIn[i * copyWidth], tensorGM[i * imgWidth], copyWidth);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>【正例】</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>LocalTensor&lt;float&gt; tensorIn;</span></span>
<span class="line"><span>GlobalTensor&lt;float&gt; tensorGM;</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span>constexpr int32_t copyWidth = 2 * 1024 / sizeof(float);</span></span>
<span class="line"><span>constexpr int32_t imgWidth = 16 * 1024 / sizeof(float);</span></span>
<span class="line"><span>constexpr int32_t imgHeight = 16;</span></span>
<span class="line"><span>// 通过DataCopy包含DataCopyParams的接口一次搬完</span></span>
<span class="line"><span>DataCopyParams copyParams;</span></span>
<span class="line"><span>copyParams.blockCount = imgHeight;</span></span>
<span class="line"><span>copyParams.blockLen = copyWidth / 8; // 搬运的单位为DataBlock(32Byte)，每个DataBlock内有8个float</span></span>
<span class="line"><span>copyParams.srcStride = (imgWidth  - copyWidth) / 8; // 表示两次搬运src之间的间隔，单位为DataBlock</span></span>
<span class="line"><span>copyParams.dstStride = 0; // 连续写，两次搬运之间dst的间隔为0，单位为DataBlock</span></span>
<span class="line"><span>DataCopy(tensorGM, tensorIn, copyParams);</span></span></code></pre></div>`,8)])])}const _=a(i,[["render",l]]);export{m as __pageData,_ as default};
