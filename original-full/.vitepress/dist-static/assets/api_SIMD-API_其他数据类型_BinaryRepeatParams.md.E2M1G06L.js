import{c as s,Q as n,j as e,m as t}from"./chunks/framework.DOi4mjdC.js";const _=JSON.parse('{"title":"BinaryRepeatParams","description":"","frontmatter":{},"headers":[{"level":1,"title":"BinaryRepeatParams","slug":"binaryrepeatparams"}],"relativePath":"api/SIMD-API/其他数据类型/BinaryRepeatParams.md","filePath":"api/SIMD-API/其他数据类型/BinaryRepeatParams.md"}'),p={name:"api/SIMD-API/其他数据类型/BinaryRepeatParams.md"};function r(i,a,l,c,d,B){return n(),e("div",null,[...a[0]||(a[0]=[t(`<h1 id="binaryrepeatparams" tabindex="-1">BinaryRepeatParams <a class="header-anchor" href="#binaryrepeatparams" aria-label="Permalink to &quot;BinaryRepeatParams&quot;">​</a></h1><p>BinaryRepeatParams为用于控制操作数地址步长的数据结构。结构体内包含操作数相邻迭代间相同DataBlock的地址步长，操作数同一迭代内不同DataBlock的地址步长等参数。</p><p>相邻迭代间的地址步长参数说明请参考<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/guide/%E7%BC%96%E7%A8%8B%E6%8C%87%E5%8D%97/C++%E7%B1%BB%E5%BA%93API/%E5%9F%BA%E7%A1%80API/%E6%8E%A5%E5%8F%A3%E5%88%86%E7%B1%BB%E8%AF%B4%E6%98%8E/%E9%AB%98%E7%BB%B4%E5%88%87%E5%88%86API.md" target="_blank" rel="noreferrer">repeatStride</a>；同一迭代内DataBlock的地址步长参数说明请参考<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/guide/%E7%BC%96%E7%A8%8B%E6%8C%87%E5%8D%97/C++%E7%B1%BB%E5%BA%93API/%E5%9F%BA%E7%A1%80API/%E6%8E%A5%E5%8F%A3%E5%88%86%E7%B1%BB%E8%AF%B4%E6%98%8E/%E9%AB%98%E7%BB%B4%E5%88%87%E5%88%86API.md" target="_blank" rel="noreferrer">dataBlockStride</a>。</p><p>结构体具体定义为：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const int32_t DEFAULT_BLK_NUM = 8;</span></span>
<span class="line"><span>const int32_t DEFAULT_BLK_STRIDE = 1;</span></span>
<span class="line"><span>const uint8_t DEFAULT_REPEAT_STRIDE = 8;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>struct BinaryRepeatParams {</span></span>
<span class="line"><span>    __aicore__ BinaryRepeatParams() {}</span></span>
<span class="line"><span>    __aicore__ BinaryRepeatParams(const uint8_t dstBlkStrideIn, const uint8_t src0BlkStrideIn,</span></span>
<span class="line"><span>        const uint8_t src1BlkStrideIn, const uint8_t dstRepStrideIn, const uint8_t src0RepStrideIn,</span></span>
<span class="line"><span>        const uint8_t src1RepStrideIn)</span></span>
<span class="line"><span>        : dstBlkStride(dstBlkStrideIn),</span></span>
<span class="line"><span>          src0BlkStride(src0BlkStrideIn),</span></span>
<span class="line"><span>          src1BlkStride(src1BlkStrideIn),</span></span>
<span class="line"><span>          dstRepStride(dstRepStrideIn),</span></span>
<span class="line"><span>          src0RepStride(src0RepStrideIn),</span></span>
<span class="line"><span>          src1RepStride(src1RepStrideIn)</span></span>
<span class="line"><span>    {}</span></span>
<span class="line"><span>    uint32_t blockNumber = DEFAULT_BLK_NUM;</span></span>
<span class="line"><span>    uint8_t dstBlkStride = DEFAULT_BLK_STRIDE;</span></span>
<span class="line"><span>    uint8_t src0BlkStride = DEFAULT_BLK_STRIDE;</span></span>
<span class="line"><span>    uint8_t src1BlkStride = DEFAULT_BLK_STRIDE;</span></span>
<span class="line"><span>    uint8_t dstRepStride = DEFAULT_REPEAT_STRIDE;</span></span>
<span class="line"><span>    uint8_t src0RepStride = DEFAULT_REPEAT_STRIDE;</span></span>
<span class="line"><span>    uint8_t src1RepStride = DEFAULT_REPEAT_STRIDE;</span></span>
<span class="line"><span>    bool repeatStrideMode = false;</span></span>
<span class="line"><span>    bool strideSizeMode = false;</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>其中，blockNumber，repeatStrideMode和strideSizeMode为保留参数，用户无需关心，使用默认值即可。用户需要自行定义DataBlock Stride参数，包含dstBlkStride，src0BlkStride和src1BlkStride，以及Repeat Stride参数，包含dstRepStride，src0RepStride和src1RepStride。</p>`,6)])])}const o=s(p,[["render",r]]);export{_ as __pageData,o as default};
