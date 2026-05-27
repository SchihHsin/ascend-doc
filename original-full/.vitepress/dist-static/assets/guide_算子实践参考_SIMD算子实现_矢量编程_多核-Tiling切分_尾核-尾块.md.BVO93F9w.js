import{c as a,Q as s,j as l,m as t}from"./chunks/framework.DOi4mjdC.js";const o=JSON.parse('{"title":"尾核&尾块","description":"","frontmatter":{},"headers":[{"level":1,"title":"尾核&尾块","slug":"尾核尾块"},{"level":2,"title":"Tiling实现","slug":"tiling实现"},{"level":2,"title":"算子类实现","slug":"算子类实现"}],"relativePath":"guide/算子实践参考/SIMD算子实现/矢量编程/多核-Tiling切分/尾核-尾块.md","filePath":"guide/算子实践参考/SIMD算子实现/矢量编程/多核-Tiling切分/尾核-尾块.md"}'),i={name:"guide/算子实践参考/SIMD算子实现/矢量编程/多核-Tiling切分/尾核-尾块.md"};function e(p,n,g,c,h,u){return s(),l("div",null,[...n[0]||(n[0]=[t(`<h1 id="尾核-尾块" tabindex="-1">尾核&amp;尾块 <a class="header-anchor" href="#尾核-尾块" aria-label="Permalink to &quot;尾核&amp;尾块&quot;">​</a></h1><p>对于不同shape的输入进行数据切分时，可能会发生数据无法平均分配到多个核、同时每个核内的数据无法均分的情况。参考<a href="./尾块Tiling.html">核间均分场景下的尾块处理</a>与<a href="./尾核Tiling.html">核间不均分场景下的尾核处理</a>的处理方式，将两者结合起来考虑整核的尾块、尾核的尾块的处理方式。</p><h2 id="tiling实现" tabindex="-1">Tiling实现 <a class="header-anchor" href="#tiling实现" aria-label="Permalink to &quot;Tiling实现&quot;">​</a></h2><p>由于本场景中核间、核内的数据均无法均分，在<a href="./尾核Tiling.html">核间不均分场景下的尾核处理</a>定义的Tiling结构体的基础上增加两个成员变量：</p><ul><li><p>formerLastTileLength：数据量多的核最后一个分块大小，即整核的尾块大小。</p><p>计算时，先按<a href="./尾核Tiling.html">尾核Tiling</a>中提到的分核策略，切分数据量多的核。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// shape需要对齐到的datablock</span></span>
<span class="line"><span>uint32_t totalLengthAligned = (totalLength % alignNum == 0U) ?</span></span>
<span class="line"><span>                      static_cast&lt;uint32_t&gt;(totalLength) :</span></span>
<span class="line"><span>                      ((static_cast&lt;uint32_t&gt;(totalLength) + alignNum - 1) / alignNum) * alignNum;</span></span>
<span class="line"><span>// 计算整核数量</span></span>
<span class="line"><span>uint32_t formerNum = (totalLengthAligned / alignNum) % numBlocks;</span></span>
<span class="line"><span>// 计算整核的数据量</span></span>
<span class="line"><span>uint32_t formerLength = static_cast&lt;uint32_t&gt;(((totalLengthAligned + numBlocks - 1) / numBlocks + alignNum - 1) / alignNum) * alignNum;</span></span></code></pre></div><p>再按<a href="./尾块Tiling.html">尾块Tiling</a>中的切分策略，计算尾块长度。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>TilingParamsCalc(formerLength, alignNum, formerTileNum, formerTileLength, formerLastTileLength);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void TilingParamsCalc(uint32_t length, uint32_t alignNum, uint32_t&amp; tileNum, uint32_t&amp; tileLength,</span></span>
<span class="line"><span>                      uint32_t&amp; lastTileLength)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    tileNum = length / (alignNum * UB_BLOCK_NUM);</span></span>
<span class="line"><span>    if (tileNum == 0U) {</span></span>
<span class="line"><span>        tileLength = 0U;</span></span>
<span class="line"><span>        lastTileLength = static_cast&lt;uint32_t&gt;(((length + alignNum - 1) / alignNum) * alignNum);</span></span>
<span class="line"><span>    } else if (static_cast&lt;uint32_t&gt;(length / alignNum) % UB_BLOCK_NUM == 0U) {</span></span>
<span class="line"><span>        tileLength = UB_BLOCK_NUM * alignNum;</span></span>
<span class="line"><span>        lastTileLength = 0U;</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        tileLength = UB_BLOCK_NUM * alignNum;</span></span>
<span class="line"><span>        lastTileLength = static_cast&lt;uint32_t&gt;(length - tileNum * tileLength);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div></li><li><p>tailLastTileLength：数据量少的核最后一个分块大小，即尾核的尾块大小。</p><p>计算时，先按<a href="./尾核Tiling.html">尾核Tiling</a>中提到的分核策略，切分数据量少的核。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 计算尾核数量</span></span>
<span class="line"><span>uint32_t tailNum = numBlocks - formerNum;</span></span>
<span class="line"><span>// 计算尾核的数据量</span></span>
<span class="line"><span>uint32_t tailLength = (totalLengthAligned / numBlocks / alignNum) * alignNum;</span></span></code></pre></div><p>再按<a href="./尾块Tiling.html">尾块Tiling</a>中的切分策略，计算尾块长度。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>TilingParamsCalc(tailLength, alignNum, tailTileNum, tailTileLength, tailLastTileLength);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>void TilingParamsCalc(uint32_t length, uint32_t alignNum, uint32_t&amp; tileNum, uint32_t&amp; tileLength,</span></span>
<span class="line"><span>                      uint32_t&amp; lastTileLength)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    tileNum = length / (alignNum * UB_BLOCK_NUM);</span></span>
<span class="line"><span>    if (tileNum == 0U) {</span></span>
<span class="line"><span>        tileLength = 0U;</span></span>
<span class="line"><span>        lastTileLength = static_cast&lt;uint32_t&gt;(((length + alignNum - 1) / alignNum) * alignNum);</span></span>
<span class="line"><span>    } else if (static_cast&lt;uint32_t&gt;(length / alignNum) % UB_BLOCK_NUM == 0U) {</span></span>
<span class="line"><span>        tileLength = UB_BLOCK_NUM * alignNum;</span></span>
<span class="line"><span>        lastTileLength = 0U;</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        tileLength = UB_BLOCK_NUM * alignNum;</span></span>
<span class="line"><span>        lastTileLength = static_cast&lt;uint32_t&gt;(length - tileNum * tileLength);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div></li></ul><h2 id="算子类实现" tabindex="-1">算子类实现 <a class="header-anchor" href="#算子类实现" aria-label="Permalink to &quot;算子类实现&quot;">​</a></h2><p>Kernel侧Init函数和Process函数的实现需将<a href="./尾块Tiling.html">核间均分场景下的尾块处理</a>与<a href="./尾核Tiling.html">核间不均分场景下的尾核处理</a>的实现结合起来。</p><p>Init函数中由于整核和尾核对应的tileLength和lastTileLength不同。因此需按照<a href="./尾核Tiling.html">核间不均分场景下的尾核处理</a>中提到的分别处理整核和尾核。后续对主块和尾块的CopyIn、Compute、CopyOut函数的处理方式与<a href="./尾块Tiling.html">核间均分场景下的处理</a>方式相同。</p><p>Init函数实现代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>__aicore__ inline void Init(GM_ADDR x, GM_ADDR y, GM_ADDR z, AddCustomTilingData tiling, AscendC::TPipe* pipeIn)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    pipe = pipeIn;</span></span>
<span class="line"><span>    if (AscendC::GetBlockIdx() &lt; tiling.formerNum) {</span></span>
<span class="line"><span>        this-&gt;tileNum = tiling.formerTileNum;</span></span>
<span class="line"><span>        this-&gt;tileLength = tiling.formerTileLength;</span></span>
<span class="line"><span>        this-&gt;lastTileLength = tiling.formerLastTileLength;</span></span>
<span class="line"><span>        uint64_t offset = tiling.formerLength * AscendC::GetBlockIdx();</span></span>
<span class="line"><span>        xGm.SetGlobalBuffer((__gm__ half *)x + offset, tiling.formerLength);</span></span>
<span class="line"><span>        yGm.SetGlobalBuffer((__gm__ half *)y + offset, tiling.formerLength);</span></span>
<span class="line"><span>        zGm.SetGlobalBuffer((__gm__ half *)z + offset, tiling.formerLength);</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        this-&gt;tileNum = tiling.tailTileNum;</span></span>
<span class="line"><span>        this-&gt;tileLength = tiling.tailTileLength;</span></span>
<span class="line"><span>        this-&gt;lastTileLength = tiling.tailLastTileLength;</span></span>
<span class="line"><span>        uint64_t offset = tiling.formerLength * tiling.formerNum</span></span>
<span class="line"><span>                          + tiling.tailLength * (AscendC::GetBlockIdx() - tiling.formerNum);</span></span>
<span class="line"><span>        xGm.SetGlobalBuffer((__gm__ half *)x + offset, tiling.tailLength);</span></span>
<span class="line"><span>        yGm.SetGlobalBuffer((__gm__ half *)y + offset, tiling.tailLength);</span></span>
<span class="line"><span>        zGm.SetGlobalBuffer((__gm__ half *)z + offset, tiling.tailLength);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // 只有尾块的场景下，tileLength为0，因此取tileLength和lastTileLength的最大值来初始化</span></span>
<span class="line"><span>    uint32_t initBufferLength = AscendC::Std::max(this-&gt;tileLength, this-&gt;lastTileLength);</span></span>
<span class="line"><span>    pipe-&gt;InitBuffer(inQueueX, 1, this-&gt;initBufferLength * sizeof(half));</span></span>
<span class="line"><span>    pipe-&gt;InitBuffer(inQueueY, 1, this-&gt;initBufferLength * sizeof(half));</span></span>
<span class="line"><span>    pipe-&gt;InitBuffer(outQueueZ, 1, this-&gt;initBufferLength * sizeof(half));</span></span>
<span class="line"><span>}</span></span></code></pre></div>`,10)])])}const r=a(i,[["render",e]]);export{o as __pageData,r as default};
