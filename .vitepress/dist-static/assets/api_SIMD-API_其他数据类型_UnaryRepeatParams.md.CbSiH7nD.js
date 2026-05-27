import{c as s,Q as n,j as e,m as p}from"./chunks/framework.DOi4mjdC.js";const _=JSON.parse('{"title":"UnaryRepeatParams","description":"","frontmatter":{},"headers":[{"level":1,"title":"UnaryRepeatParams","slug":"unaryrepeatparams"}],"relativePath":"api/SIMD-API/其他数据类型/UnaryRepeatParams.md","filePath":"api/SIMD-API/其他数据类型/UnaryRepeatParams.md"}'),t={name:"api/SIMD-API/其他数据类型/UnaryRepeatParams.md"};function r(l,a,i,c,d,o){return n(),e("div",null,[...a[0]||(a[0]=[p(`<h1 id="unaryrepeatparams" tabindex="-1">UnaryRepeatParams <a class="header-anchor" href="#unaryrepeatparams" aria-label="Permalink to &quot;UnaryRepeatParams&quot;">​</a></h1><p>UnaryRepeatParams为用于控制操作数地址步长的数据结构。结构体内包含操作数相邻迭代间相同DataBlock的地址步长，操作数同一迭代内不同DataBlock的地址步长等参数。</p><p>相邻迭代间的地址步长参数说明请参考<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/guide/%E7%BC%96%E7%A8%8B%E6%8C%87%E5%8D%97/C++%E7%B1%BB%E5%BA%93API/%E5%9F%BA%E7%A1%80API/%E6%8E%A5%E5%8F%A3%E5%88%86%E7%B1%BB%E8%AF%B4%E6%98%8E/%E9%AB%98%E7%BB%B4%E5%88%87%E5%88%86API.md" target="_blank" rel="noreferrer">repeatStride</a>；同一迭代内DataBlock的地址步长参数说明请参考<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/guide/%E7%BC%96%E7%A8%8B%E6%8C%87%E5%8D%97/C++%E7%B1%BB%E5%BA%93API/%E5%9F%BA%E7%A1%80API/%E6%8E%A5%E5%8F%A3%E5%88%86%E7%B1%BB%E8%AF%B4%E6%98%8E/%E9%AB%98%E7%BB%B4%E5%88%87%E5%88%86API.md" target="_blank" rel="noreferrer">dataBlockStride</a>。</p><p>结构体具体定义为：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const int32_t DEFAULT_BLK_NUM = 8;</span></span>
<span class="line"><span>const int32_t DEFAULT_BLK_STRIDE = 1;</span></span>
<span class="line"><span>const uint8_t DEFAULT_REPEAT_STRIDE = 8;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>struct UnaryRepeatParams {</span></span>
<span class="line"><span>    __aicore__ UnaryRepeatParams() {}</span></span>
<span class="line"><span>    __aicore__ UnaryRepeatParams(const uint16_t dstBlkStrideIn, const uint16_t srcBlkStrideIn,</span></span>
<span class="line"><span>        const uint8_t dstRepStrideIn, const uint8_t srcRepStrideIn)</span></span>
<span class="line"><span>        : dstBlkStride(dstBlkStrideIn),</span></span>
<span class="line"><span>          srcBlkStride(srcBlkStrideIn),</span></span>
<span class="line"><span>          dstRepStride(dstRepStrideIn),</span></span>
<span class="line"><span>          srcRepStride(srcRepStrideIn)</span></span>
<span class="line"><span>    {}</span></span>
<span class="line"><span>    __aicore__ UnaryRepeatParams(const uint16_t dstBlkStrideIn, const uint16_t srcBlkStrideIn,</span></span>
<span class="line"><span>        const uint8_t dstRepStrideIn, const uint8_t srcRepStrideIn, const bool halfBlockIn)</span></span>
<span class="line"><span>        : dstBlkStride(dstBlkStrideIn),</span></span>
<span class="line"><span>          srcBlkStride(srcBlkStrideIn),</span></span>
<span class="line"><span>          dstRepStride(dstRepStrideIn),</span></span>
<span class="line"><span>          srcRepStride(srcRepStrideIn),</span></span>
<span class="line"><span>          halfBlock(halfBlockIn)</span></span>
<span class="line"><span>    {}</span></span>
<span class="line"><span>    uint32_t blockNumber = DEFAULT_BLK_NUM;</span></span>
<span class="line"><span>    uint16_t dstBlkStride = DEFAULT_BLK_STRIDE;</span></span>
<span class="line"><span>    uint16_t srcBlkStride = DEFAULT_BLK_STRIDE;</span></span>
<span class="line"><span>    uint8_t dstRepStride = DEFAULT_REPEAT_STRIDE;</span></span>
<span class="line"><span>    uint8_t srcRepStride = DEFAULT_REPEAT_STRIDE;</span></span>
<span class="line"><span>    bool repeatStrideMode = false;</span></span>
<span class="line"><span>    bool strideSizeMode = false;</span></span>
<span class="line"><span>    bool halfBlock = false;</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>其中，blockNumber，repeatStrideMode，strideSizeMode为保留参数，用户无需关心，使用默认值即可。halfBlock表示CastDeq指令的结果写入对应UB的上半（halfBlock = true）还是下半（halfBlock = false）部分。用户需要自行定义DataBlock Stride参数，包含dstBlkStride，srcBlkStride，以及Repeat Stride参数，包含dstRepStride，srcRepStride。</p>`,6)])])}const E=s(t,[["render",r]]);export{_ as __pageData,E as default};
