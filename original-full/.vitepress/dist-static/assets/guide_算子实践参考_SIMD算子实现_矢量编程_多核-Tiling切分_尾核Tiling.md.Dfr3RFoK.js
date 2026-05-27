import{c as s,Q as a,j as t,m as l}from"./chunks/framework.DOi4mjdC.js";const e="/assets/%E6%95%B0%E6%8D%AE%E5%AF%B9%E9%BD%90%E7%A4%BA%E6%84%8F%E5%9B%BE.CQNqSXt4.png",i="/assets/%E6%97%A0%E6%B3%95%E5%9D%87%E5%88%86%E5%88%B0%E6%AF%8F%E4%B8%AA%E6%A0%B8%E4%B8%8A%E7%9A%84%E7%A4%BA%E4%BE%8B.pyeAcWjL.png",d=JSON.parse('{"title":"尾核Tiling","description":"","frontmatter":{},"headers":[{"level":1,"title":"尾核Tiling","slug":"尾核tiling"},{"level":2,"title":"Tiling实现","slug":"tiling实现"},{"level":2,"title":"算子类实现","slug":"算子类实现"}],"relativePath":"guide/算子实践参考/SIMD算子实现/矢量编程/多核-Tiling切分/尾核Tiling.md","filePath":"guide/算子实践参考/SIMD算子实现/矢量编程/多核-Tiling切分/尾核Tiling.md"}'),p={name:"guide/算子实践参考/SIMD算子实现/矢量编程/多核-Tiling切分/尾核Tiling.md"};function o(c,n,g,_,r,h){return a(),t("div",null,[...n[0]||(n[0]=[l('<h1 id="尾核tiling" tabindex="-1">尾核Tiling <a class="header-anchor" href="#尾核tiling" aria-label="Permalink to &quot;尾核Tiling&quot;">​</a></h1><p>对于不同shape的输入进行数据切分时，可能会发生数据无法平均分配到多个核的情况。例如当算子的输入shape为[1, 1999]，使用核数为8，数据类型为half时，需要计算的数据总量为1 * 1999 * sizeof(half) = 3998字节，3998字节既不满足32字节对齐，也无法平均分配到8个核上。因此该场景下，对数据进行多核切分后，每个核的计算数据量不同。此种情况下，应该尽可能均匀的分配数据，所有核上的计算数据量有两种情况，将计算量较多的核称为整核，计算量较少的核称为尾核。</p><p><strong>图 1</strong> 数据对齐示意图<br><img src="'+e+`" alt="" title="数据对齐示意图"></p><h2 id="tiling实现" tabindex="-1">Tiling实现 <a class="header-anchor" href="#tiling实现" aria-label="Permalink to &quot;Tiling实现&quot;">​</a></h2><ul><li><p>因为AI处理器在进行数据搬运和Vector计算时，对于搬运的数据长度和Unified Buffer首地址都有必须32字节对齐的要求，<strong>首先待处理数据需要先保证向上对齐到32字节的大小</strong>。该场景下后续搬运和计算的处理细节请参考<a href="./../非对齐场景.html">非对齐场景</a>。如下代码片段展示了将数据对齐到datablock大小的示例：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>constexpr uint32_t SIZE_OF_HALF = 2;</span></span>
<span class="line"><span>constexpr uint32_t BLOCK_SIZE = 32;</span></span>
<span class="line"><span>constexpr uint32_t NUM_BLOCKS = 8;</span></span>
<span class="line"><span>constexpr uint32_t ALIGN_NUM = BLOCK_SIZE / SIZE_OF_HALF;</span></span>
<span class="line"><span>// shape需要对齐到的32字节，假设原totalLength为1999，向上满足32字节对齐后为2000</span></span>
<span class="line"><span>uint32_t totalLengthAligned = (totalLength % ALIGN_NUM == 0U) ?</span></span>
<span class="line"><span>                      static_cast&lt;uint32_t&gt;(totalLength) :</span></span>
<span class="line"><span>                      ((static_cast&lt;uint32_t&gt;(totalLength) + ALIGN_NUM - 1) / ALIGN_NUM) * ALIGN_NUM;</span></span></code></pre></div></li><li><p>满足32字节对齐后的数据，应尽可能的均分到每个核上。如果无法均分，那么先将可以均分的部分平均分配，剩余的部分分配给部分核，会有部分核多算一个datablock。为了保证切分后的数据仍是满足32字节对齐的，以ALIGN_NUM（ALIGN_NUM个数据为32字节）为粒度，将数据分配到所有核上。在本样例中，数据类型为half，ALIGN_NUM = BLOCK_SIZE / sizeof(half) = 16。将对齐后的数据总量按ALIGN_NUM为粒度分成x个数据块，x = 2000 / 16 = 125。</p><p>AI处理器的核数NUM_BLOCKS为8，无法将125个数据块均分到8个核上。按照以下步骤将数据块尽可能的均分到每个核上：</p><ol><li>计算x / NUM_BLOCKS = 15；</li><li>计算x % NUM_BLOCKS = 5。</li></ol><p>根据上述步骤得出，如果每个核上分配15个数据块，那么将有5个数据块剩余。将这5个剩余的数据块分配到5个核上，这样可以得到5个计算16个数据块的整核和3个计算15个数据块的尾核。下图展示了数据无法均分时多核切分的示例。</p><p><strong>图 2</strong> 无法均分到每个核上的示例<br><img src="`+i+`" alt="" title="无法均分到每个核上的示例"></p></li></ul><p>基于上文，设计如下的算子Tiling结构体成员：</p><ul><li>formerNum：分配到数据量较多的核数，即整核的核数。</li><li>tailNum：分配到数据量较少的核数，即尾核的核数。</li><li>formerLength：整核计算的数据长度。</li><li>tailLength：尾核计算的数据长度。</li></ul><p>Tiling参数的计算代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>constexpr uint32_t NUM_BLOCKS = 8;</span></span>
<span class="line"><span>constexpr uint32_t SIZE_OF_HALF = 2;</span></span>
<span class="line"><span>constexpr uint32_t BLOCK_SIZE = 32;</span></span>
<span class="line"><span>// shape需要对齐到的最小单位</span></span>
<span class="line"><span>constexpr uint32_t ALIGN_NUM = BLOCK_SIZE / SIZE_OF_HALF;</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span>void GenerateTilingData(uint8_t* tilingBuf, uint32_t numBlocks)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    // shape需要对齐到的datablock,假设原totalLength为1999，向上满足32字节对齐后为2000</span></span>
<span class="line"><span>    uint32_t totalLengthAligned = (totalLength % ALIGN_NUM == 0U) ?</span></span>
<span class="line"><span>                      static_cast&lt;uint32_t&gt;(totalLength) :</span></span>
<span class="line"><span>                      ((static_cast&lt;uint32_t&gt;(totalLength) + ALIGN_NUM - 1) / ALIGN_NUM) * ALIGN_NUM;</span></span>
<span class="line"><span>    // 核心数为8，一个datablock包含16个数，那么：datablock的总数：2000 / 16 = 125</span></span>
<span class="line"><span>    // 有5个核会分到16个datablock：125 % 8 =5，可以称之为整核</span></span>
<span class="line"><span>    // 有3个核会分到15个datablock：8 - 5 = 3，可以称之为尾核</span></span>
<span class="line"><span>    uint32_t formerNum = (totalLengthAligned / ALIGN_NUM) % numBlocks; </span></span>
<span class="line"><span>    uint32_t tailNum = numBlocks - formerNum;</span></span>
<span class="line"><span>    // 整核计算的数据长度：totalLengthAligned / NUM_BLOCKS为每个核上计算的元素个数，formerLength为上述元素个数向上32字节对齐的结果</span></span>
<span class="line"><span>    uint32_t formerLength =</span></span>
<span class="line"><span>            static_cast&lt;uint32_t&gt;(((totalLengthAligned + numBlocks - 1) / numBlocks + alignNum - 1) / alignNum) * alignNum;</span></span>
<span class="line"><span>    // 尾核计算的数据长度：totalLengthAligned / NUM_BLOCKS为每个核上计算的元素个数，tailLength 为上述元素个数向下32字节对齐的结果</span></span>
<span class="line"><span>    uint32_t tailLength = (totalLengthAligned / numBlocks / ALIGN_NUM) * ALIGN_NUM;</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="算子类实现" tabindex="-1">算子类实现 <a class="header-anchor" href="#算子类实现" aria-label="Permalink to &quot;算子类实现&quot;">​</a></h2><p>在Kernel侧的Init函数中，计算输入在Global Memory上的内存偏移地址时，应对整核和尾核加以区分。</p><p>整核上，输入的内存偏移地址计算代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>xGm.SetGlobalBuffer((__gm__ T*)x + formerLength * AscendC::GetBlockIdx(), formerLength);</span></span></code></pre></div><p>尾核上，计算输入的内存偏移地址时，需在全部整核的数据长度基础上加上尾核的偏移量，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>xGm.SetGlobalBuffer((__gm__ T*)x + formerLength * formerNum + tailLength * (AscendC::GetBlockIdx() - formerNum), tailLength);</span></span></code></pre></div><p>完整的Init函数实现代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>__aicore__ inline void Init(GM_ADDR x, GM_ADDR y, GM_ADDR z, AddCustomTilingData tiling, AscendC::TPipe* pipeIn)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    pipe = pipeIn;</span></span>
<span class="line"><span>    if (AscendC::GetBlockIdx() &lt; tiling.formerNum) {</span></span>
<span class="line"><span>        this-&gt;tileLength = tiling.formerLength;</span></span>
<span class="line"><span>        uint64_t offset = tiling.formerLength * AscendC::GetBlockIdx();</span></span>
<span class="line"><span>        xGm.SetGlobalBuffer((__gm__ half *)x + offset, tiling.formerLength);</span></span>
<span class="line"><span>        yGm.SetGlobalBuffer((__gm__ half *)y + offset, tiling.formerLength);</span></span>
<span class="line"><span>        zGm.SetGlobalBuffer((__gm__ half *)z + offset, tiling.formerLength);</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        this-&gt;tileLength = tiling.tailLength;</span></span>
<span class="line"><span>        uint64_t offset = tiling.formerLength * tiling.formerNum</span></span>
<span class="line"><span>                          + tiling.tailLength * (AscendC::GetBlockIdx() - tiling.formerNum);</span></span>
<span class="line"><span>        xGm.SetGlobalBuffer((__gm__ half *)x +offset, tiling.tailLength);</span></span>
<span class="line"><span>        yGm.SetGlobalBuffer((__gm__ half *)y + offset, tiling.tailLength);</span></span>
<span class="line"><span>        zGm.SetGlobalBuffer((__gm__ half *)z + offset, tiling.tailLength);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    pipe-&gt;InitBuffer(inQueueX, 1, this-&gt;tileLength * sizeof(half));</span></span>
<span class="line"><span>    pipe-&gt;InitBuffer(inQueueY, 1, this-&gt;tileLength * sizeof(half));</span></span>
<span class="line"><span>    pipe-&gt;InitBuffer(outQueueZ, 1, this-&gt;tileLength * sizeof(half));</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>其余实现与<a href="./多核Tiling.html">多核Tiling</a>中的实现一致，这里不重复进行说明。</p>`,18)])])}const f=s(p,[["render",o]]);export{d as __pageData,f as default};
