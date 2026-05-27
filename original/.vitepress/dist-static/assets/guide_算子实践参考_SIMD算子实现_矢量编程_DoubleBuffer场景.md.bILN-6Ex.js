import{c as s,Q as a,j as e,m as t}from"./chunks/framework.DOi4mjdC.js";const l="/assets/DoubleBuffer%E6%95%B0%E6%8D%AE%E5%88%87%E5%88%86%E7%A4%BA%E6%84%8F%E5%9B%BE.DbMmyCJr.png",f=JSON.parse('{"title":"DoubleBuffer场景","description":"","frontmatter":{},"headers":[{"level":1,"title":"DoubleBuffer场景","slug":"doublebuffer场景"},{"level":2,"title":"Tiling实现","slug":"tiling实现"},{"level":2,"title":"算子类实现","slug":"算子类实现"}],"relativePath":"guide/算子实践参考/SIMD算子实现/矢量编程/DoubleBuffer场景.md","filePath":"guide/算子实践参考/SIMD算子实现/矢量编程/DoubleBuffer场景.md"}'),i={name:"guide/算子实践参考/SIMD算子实现/矢量编程/DoubleBuffer场景.md"};function p(o,n,g,c,u,r){return a(),e("div",null,[...n[0]||(n[0]=[t('<h1 id="doublebuffer场景" tabindex="-1">DoubleBuffer场景 <a class="header-anchor" href="#doublebuffer场景" aria-label="Permalink to &quot;DoubleBuffer场景&quot;">​</a></h1><p>因存在算子中多次搬入搬出数据的场景，为充分利用硬件资源，实现多流水并行，引入<a href="./../../../编程指南/概念原理和术语/性能优化技术原理/DoubleBuffer.html">DoubleBuffer</a>机制。<a href="./../../../编程指南/概念原理和术语/性能优化技术原理/DoubleBuffer.html">DoubleBuffer</a>是通过将输入数据分成大小相等的两块，充分利用AI Core的硬件资源，实现数据搬入、计算、数据搬出的并行执行方式。下面以“核间不均分，核内不均分”的样例为例，介绍算子中DoubleBuffer的实现。一个简单的DoubleBuffer样例代码请参见<a href="https://gitcode.com/cann/asc-devkit/tree/master/examples/01_simd_cpp_api/00_introduction/01_vector/add_tpipe_tque" target="_blank" rel="noreferrer">使用DoubleBuffer的Add算子样例</a>。</p><p><strong>图 1</strong> DoubleBuffer数据切分示意图<br><img src="'+l+`" alt="" title="DoubleBuffer数据切分示意图"></p><h2 id="tiling实现" tabindex="-1">Tiling实现 <a class="header-anchor" href="#tiling实现" aria-label="Permalink to &quot;Tiling实现&quot;">​</a></h2><p>使能DoubleBuffer后，每一个数据块会分成大小相等的两块，因此，若要使能DoubleBuffer，要求数据总量应该能够均分。为了简化处理，将可用的Unified Buffer空间以32字节为粒度，分成n块dataBlock，如果n不是偶数，则减1，这样就可以保证一套代码兼容开启或不开启DoubleBuffer功能。对应步骤如下：</p><ol><li><p>判断数据总长度totalLength是否满足32字节对齐，如不满足，则计算totalLength向上32字节对齐后的长度totalLengthAligned。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>constexpr uint32_t BLOCK_SIZE = 32;</span></span>
<span class="line"><span>// 为方便计算，这里根据数据类型定义变量alignNum作为对齐数</span></span>
<span class="line"><span>uint32_t alignNum = BLOCK_SIZE / dataTypeSize;</span></span>
<span class="line"><span>// totalLength为数据总量</span></span>
<span class="line"><span>uint32_t totalLengthAligned = (totalLength % alignNum == 0)?</span></span>
<span class="line"><span>        totalLength : ((totalLength + alignNum - 1) / alignNum) * alignNum;</span></span></code></pre></div></li><li><p>根据totalLengthAligned，计算每个核的计算数据长度blockLength，分核策略可参照<a href="./多核-Tiling切分/尾核Tiling.html">尾核Tiling</a>。</p></li><li><p>计算其余Tiling参数。</p><p>对当前Unified Buffer可用空间以32字节为粒度，进行切分，计算出数据块个数UB_BLOCK_NUM。根据是否开启DoubleBuffer计算出当前可用的最大数据块个数，记作MAX_AVAILABLE_UB_BLOCK_NUM。最后，以MAX_AVAILABLE_UB_BLOCK_NUM为粒度，对blockLength进行切分。为方便演示，如下代码直接给出UB_BLOCK_NUM，作为当前Unified Buffer可用空间包含的block（32字节）数。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>constexpr uint32_t BUFFER_NUM = 2;</span></span>
<span class="line"><span>constexpr uint32_t UB_BLOCK_NUM = 21;  // UB最大可以使用的block数量</span></span>
<span class="line"><span>constexpr uint32_t MAX_AVAILABLE_UB_BLOCK_NUM = UB_BLOCK_NUM / BUFFER_NUM * BUFFER_NUM;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>tileNum = blockLength / (alignNum * MAX_AVAILABLE_UB_BLOCK_NUM);</span></span>
<span class="line"><span>if (tileNum == 0) {</span></span>
<span class="line"><span>    // 单核需要计算的长度小于UB可用空间，按照仅有尾块处理</span></span>
<span class="line"><span>    tileLength = 0;</span></span>
<span class="line"><span>    lastTileLength = (blockLength + alignNum - 1) / alignNum * alignNum;</span></span>
<span class="line"><span>} else if ((blockLength / alignNum) % MAX_AVAILABLE_UB_BLOCK_NUM == 0) {</span></span>
<span class="line"><span>    // 单核的计算量能被当前可用UB空间均分，仅有主块，无尾块</span></span>
<span class="line"><span>    tileLength = MAX_AVAILABLE_UB_BLOCK_NUM * alignNum;</span></span>
<span class="line"><span>    lastTileLength = 0;</span></span>
<span class="line"><span>} else {</span></span>
<span class="line"><span>    // 同时有主块和尾块</span></span>
<span class="line"><span>    tileLength = MAX_AVAILABLE_UB_BLOCK_NUM * alignNum;</span></span>
<span class="line"><span>    lastTileLength = blockLength - tileNum * tileLength;</span></span>
<span class="line"><span>}</span></span></code></pre></div></li></ol><h2 id="算子类实现" tabindex="-1">算子类实现 <a class="header-anchor" href="#算子类实现" aria-label="Permalink to &quot;算子类实现&quot;">​</a></h2><p>不开启DoubleBuffer时，只需要对每个核上最后一个分块的起始地址做处理；开启DoubleBuffer后，需要处理的数据块长度变成原来的一半，所以需要对最后两个数据块的起始地址做处理。</p><p>开启DoubleBuffer，参考<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/InitBuffer.md" target="_blank" rel="noreferrer">InitBuffer接口函数原型</a>，将num参数配置成2，即BUFFER_NUM。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>this-&gt;initBufferLength = AscendC::Std::max(this-&gt;tileLength, this-&gt;lastTileLength);</span></span>
<span class="line"><span>pipe.InitBuffer(inQueueX, BUFFER_NUM, this-&gt;initBufferLength * sizeof(dataType));</span></span>
<span class="line"><span>pipe.InitBuffer(inQueueY, BUFFER_NUM, this-&gt;initBufferLength * sizeof(dataType));</span></span>
<span class="line"><span>pipe.InitBuffer(outQueueZ, BUFFER_NUM, this-&gt;initBufferLength * sizeof(dataType));</span></span></code></pre></div><p>同时在计算核内每个数据块的长度时，考虑DoubleBuffer场景，需要将Buffer数量，即BUFFER_NUM=2带入计算。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>this-&gt;tileLength = tiling.tileLength / BUFFER_NUM;</span></span></code></pre></div><p>由于无法保证尾块满足DoubleBuffer的条件，因此不对尾块进行切分。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>this-&gt;lastTileLength = tiling.lastTileLength;</span></span></code></pre></div><p>Init函数实现代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>__aicore__ inline void Init(GM_ADDR x, GM_ADDR y, GM_ADDR z, AddCustomTilingData tiling)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    if (tiling.isEvenCore) {</span></span>
<span class="line"><span>        this-&gt;blockLength = tiling.blockLength;</span></span>
<span class="line"><span>        this-&gt;tileNum = tiling.tileNum;</span></span>
<span class="line"><span>        this-&gt;tileLength = tiling.tileLength / BUFFER_NUM;</span></span>
<span class="line"><span>        this-&gt;lastTileLength = tiling.lastTileLength;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        xGm.SetGlobalBuffer((__gm__ dataType *)x + this-&gt;blockLength * AscendC::GetBlockIdx(), this-&gt;blockLength);</span></span>
<span class="line"><span>        yGm.SetGlobalBuffer((__gm__ dataType *)y + this-&gt;blockLength * AscendC::GetBlockIdx(), this-&gt;blockLength);</span></span>
<span class="line"><span>        zGm.SetGlobalBuffer((__gm__ dataType *)z + this-&gt;blockLength * AscendC::GetBlockIdx(), this-&gt;blockLength);</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        if (AscendC::GetBlockIdx() &lt; tiling.formerNum) {</span></span>
<span class="line"><span>            this-&gt;tileNum = tiling.formerTileNum;</span></span>
<span class="line"><span>            this-&gt;tileLength = tiling.formerTileLength / BUFFER_NUM;</span></span>
<span class="line"><span>            this-&gt;lastTileLength = tiling.formerLastTileLength;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            xGm.SetGlobalBuffer((__gm__ dataType *)x + tiling.formerLength * AscendC::GetBlockIdx(), tiling.formerLength);</span></span>
<span class="line"><span>            yGm.SetGlobalBuffer((__gm__ dataType *)y + tiling.formerLength * AscendC::GetBlockIdx(), tiling.formerLength);</span></span>
<span class="line"><span>            zGm.SetGlobalBuffer((__gm__ dataType *)z + tiling.formerLength * AscendC::GetBlockIdx(), tiling.formerLength);</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            this-&gt;tileNum = tiling.tailTileNum;</span></span>
<span class="line"><span>            this-&gt;tileLength = tiling.tailTileLength / BUFFER_NUM;</span></span>
<span class="line"><span>            this-&gt;lastTileLength = tiling.tailLastTileLength;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            xGm.SetGlobalBuffer((__gm__ dataType *)x + tiling.formerLength * tiling.formerNum +</span></span>
<span class="line"><span>                tiling.tailLength * (AscendC::GetBlockIdx() - tiling.formerNum), tiling.tailLength);</span></span>
<span class="line"><span>            yGm.SetGlobalBuffer((__gm__ dataType *)y + tiling.formerLength * tiling.formerNum +</span></span>
<span class="line"><span>                tiling.tailLength * (AscendC::GetBlockIdx() - tiling.formerNum), tiling.tailLength);</span></span>
<span class="line"><span>            zGm.SetGlobalBuffer((__gm__ dataType *)z + tiling.formerLength * tiling.formerNum +</span></span>
<span class="line"><span>                tiling.tailLength * (AscendC::GetBlockIdx() - tiling.formerNum), tiling.tailLength);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    uint32_t initBufferLength = AscendC::Std::max(this-&gt;tileLength, this-&gt;lastTileLength);</span></span>
<span class="line"><span>    pipe.InitBuffer(inQueueX, BUFFER_NUM, initBufferLength * sizeof(dataType));</span></span>
<span class="line"><span>    pipe.InitBuffer(inQueueY, BUFFER_NUM, initBufferLength * sizeof(dataType));</span></span>
<span class="line"><span>    pipe.InitBuffer(outQueueZ, BUFFER_NUM, initBufferLength * sizeof(dataType));</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>由于开启DoubleBuffer后，切分后的主块数据块个数翻倍，在Process函数中，需要将BUFFER_NUM带入计算循环次数；尾块独立计算，不开启DoubleBuffer。后续主尾块在CopyIn、Compute、CopyOut函数中的处理，与<a href="./多核-Tiling切分/尾块Tiling.html">尾块tiling处理</a>相同。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>__aicore__ inline void Process()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    // 主块进行DoubleBuffer计算，所以loopCount得乘以2</span></span>
<span class="line"><span>    uint32_t loopCount = this-&gt;tileNum * BUFFER_NUM;</span></span>
<span class="line"><span>    for (uint32_t i = 0; i &lt; loopCount; i++) {</span></span>
<span class="line"><span>        CopyIn(i, this-&gt;tileLength);</span></span>
<span class="line"><span>        Compute(i, this-&gt;tileLength);</span></span>
<span class="line"><span>        CopyOut(i, this-&gt;tileLength);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    // 尾块进行计算, 不做DoubleBuffer操作</span></span>
<span class="line"><span>    if (this-&gt;lastTileLength &gt; 0U) {</span></span>
<span class="line"><span>        CopyIn(loopCount, this-&gt;lastTileLength);</span></span>
<span class="line"><span>        Compute(loopCount, this-&gt;lastTileLength);</span></span>
<span class="line"><span>        CopyOut(loopCount, this-&gt;lastTileLength);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div>`,18)])])}const d=s(i,[["render",p]]);export{f as __pageData,d as default};
