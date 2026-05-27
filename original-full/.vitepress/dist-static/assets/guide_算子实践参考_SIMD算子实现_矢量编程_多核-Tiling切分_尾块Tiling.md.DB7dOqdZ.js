import{c as s,Q as a,j as p,m as l}from"./chunks/framework.DOi4mjdC.js";const e="/assets/shape%E5%AF%B9%E9%BD%90%E5%9C%BA%E6%99%AF.DdqELili.png",t="/assets/%E5%A4%9A%E6%A0%B8Tiling%E5%B0%BE%E5%9D%97%E7%A4%BA%E6%84%8F%E5%9B%BE.DkA9Tpbt.png",r=JSON.parse('{"title":"尾块Tiling","description":"","frontmatter":{},"headers":[{"level":1,"title":"尾块Tiling","slug":"尾块tiling"},{"level":2,"title":"Tiling实现","slug":"tiling实现"},{"level":2,"title":"算子类实现","slug":"算子类实现"}],"relativePath":"guide/算子实践参考/SIMD算子实现/矢量编程/多核-Tiling切分/尾块Tiling.md","filePath":"guide/算子实践参考/SIMD算子实现/矢量编程/多核-Tiling切分/尾块Tiling.md"}'),i={name:"guide/算子实践参考/SIMD算子实现/矢量编程/多核-Tiling切分/尾块Tiling.md"};function c(g,n,o,h,u,d){return a(),p("div",null,[...n[0]||(n[0]=[l('<h1 id="尾块tiling" tabindex="-1">尾块Tiling <a class="header-anchor" href="#尾块tiling" aria-label="Permalink to &quot;尾块Tiling&quot;">​</a></h1><p>如下图中的示例，算子的输入shape为（1，2048），支持的数据类型为half类型，输入数据可以对齐到一个datablock的大小（32字节），输入数据为2048 * 2 / 32 = 128个datablock，因此可以平均分配到每个核上（假设使用8个核），每个核上处理256个数，16个datablock。此时不需要进行尾块处理。</p><p><strong>图 1</strong> shape对齐场景<br><img src="'+e+'" alt="" title="shape对齐场景"></p><p>针对一些shape，比如算子的输入shape为（1，1904），支持的数据类型为half类型，输入数据可以对齐到一个datablock的大小（32字节），可以平均分配到每个核上（假设使用8个核），每个核上处理238个数，238个数无法均分到datablock上，分满14个datablock后，剩余14个数（28字节），多核切分后需要进行尾块处理。</p><p>对于不同shape的输入进行数据切分时，可能会发生Tiling后的数据平均分配到多核上，但每个核内的数据无法均分的情况。针对此种场景，在Tiling参数中增加变量lastTileLength，用来表示最后一个分块，即尾块的大小。因此，在定义算子的Tiling结构体时包含以下四个成员：</p><ul><li>blockLength：每个核上计算的数据长度；</li><li>tileNum：每个核上切分的主块数据块的个数；</li><li>tileLength：每个核上主块数据块的长度；</li><li>lastTileLength：每个核上尾块的长度。</li></ul><p><strong>图 2</strong> 多核Tiling尾块示意图<br><img src="'+t+`" alt="" title="多核Tiling尾块示意图"></p><h2 id="tiling实现" tabindex="-1">Tiling实现 <a class="header-anchor" href="#tiling实现" aria-label="Permalink to &quot;Tiling实现&quot;">​</a></h2><p>算子的Tiling结构体定义如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct AddCustomTilingData {</span></span>
<span class="line"><span>    uint32_t blockLength;</span></span>
<span class="line"><span>    uint32_t tileNum;</span></span>
<span class="line"><span>    uint32_t tileLength;</span></span>
<span class="line"><span>    uint32_t lastTileLength;</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>Host侧Tiling实现的主要内容为计算以上四个成员变量。步骤如下：</p><ol><li><p>判断数据总长度totalLength是否满足32字节对齐，如不满足，则计算totalLength向上32字节对齐后的长度totalLengthAligned。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>constexpr uint32_t BLOCK_SIZE = 32;</span></span>
<span class="line"><span>// 为方便计算，这里根据数据类型定义变量alignNum作为对齐数</span></span>
<span class="line"><span>uint32_t alignNum = BLOCK_SIZE / dataTypeSize;</span></span>
<span class="line"><span>// totalLength为数据总量</span></span>
<span class="line"><span>totalLengthAligned = (totalLength % alignNum == 0U) ?</span></span>
<span class="line"><span>                      static_cast&lt;uint32_t&gt;(totalLength) :</span></span>
<span class="line"><span>                      ((static_cast&lt;uint32_t&gt;(totalLength) + alignNum - 1) / alignNum) * alignNum;</span></span></code></pre></div></li><li><p>判断totalLengthAligned是否能被使用的核数NumBlocks均分，如果可以，则计算每个核上计算数据长度blockLength。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>constexpr uint32_t NUM_BLOCKS = 8;</span></span>
<span class="line"><span>constexpr uint32_t UB_BLOCK_NUM = 100;  // 此处为方便验证，使用UB_BLOCK_NUM作为Unified Buffer可用的Block数量，因此可得出可用UB空间的大小为UB_BLOCK_NUM * BLOCK_SIZE</span></span>
<span class="line"><span>uint32_t blockLength, tileNum;</span></span>
<span class="line"><span>if ((totalLengthAligned / alignNum) % NUM_BLOCKS == 0U) {</span></span>
<span class="line"><span>    blockLength = totalLengthAligned / NUM_BLOCKS;</span></span>
<span class="line"><span>}</span></span></code></pre></div></li><li><p>计算tileNum。为了减少数据搬运开销，应尽量使用核内的Unified Buffer空间。基于每个核上的计算量以及可用Unified Buffer空间的大小，计算tileNum。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>tileNum = blockLength / (alignNum * UB_BLOCK_NUM);</span></span></code></pre></div></li><li><p>根据计算出的tileNum，计算tileLength和lastTileLength。</p><p>如果每个核的计算量能够被当前可用Unified Buffer空间均分，则按照无尾块场景处理。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>if (static_cast&lt;uint32_t&gt;(blockLength / alignNum) % UB_BLOCK_NUM == 0U) {</span></span>
<span class="line"><span>    // 单核的计算量能被当前可用UB空间均分，仅有主块，无尾块</span></span>
<span class="line"><span>    tileLength = UB_BLOCK_NUM * alignNum;</span></span>
<span class="line"><span>    lastTileLength = 0U;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>反之，按照尾块场景处理，尾块长度为单核计算数据长度 - tileNum * tileLength。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>if (tileNum == 0U) {</span></span>
<span class="line"><span>    // 单核需要计算的长度小于UB可用空间，按照仅有尾块处理</span></span>
<span class="line"><span>    tileLength = 0U;</span></span>
<span class="line"><span>    lastTileLength = static_cast&lt;uint32_t&gt;(((blockLength + alignNum - 1) / alignNum) * alignNum);</span></span>
<span class="line"><span>} else {</span></span>
<span class="line"><span>    // 同时有主块和尾块</span></span>
<span class="line"><span>    tileLength = UB_BLOCK_NUM * alignNum;</span></span>
<span class="line"><span>    lastTileLength = static_cast&lt;uint32_t&gt;(blockLength - tileNum * tileLength);</span></span>
<span class="line"><span>}</span></span></code></pre></div></li></ol><p>Host侧Tiling实现的代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>constexpr uint32_t BLOCK_SIZE = 32;</span></span>
<span class="line"><span>constexpr uint32_t NUM_BLOCKS = 8;</span></span>
<span class="line"><span>constexpr uint32_t UB_BLOCK_NUM = 100;  // 此处为方便验证，使用UB_BLOCK_NUM作为UB可用的Block数量，因此可得出可用UB空间的大小为UB_BLOCK_NUM * BLOCK_SIZE</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>uint32_t alignNum = BLOCK_SIZE / dataTypeSize;  // 为方便计算，这里根据数据类型定义变量alignNum作为对齐数，dataTypeSize为运算数据的数据类型对应的字节数</span></span>
<span class="line"><span>// totalLength为数据总量</span></span>
<span class="line"><span>totalLengthAligned = (totalLength % alignNum == 0U) ?</span></span>
<span class="line"><span>                             static_cast&lt;uint32_t&gt;(totalLength) :</span></span>
<span class="line"><span>                             ((static_cast&lt;uint32_t&gt;(totalLength) + alignNum - 1) / alignNum) * alignNum;</span></span>
<span class="line"><span>uint32_t blockLength, tileNum;</span></span>
<span class="line"><span>if ((totalLengthAligned / alignNum) % NUM_BLOCKS == 0U) {</span></span>
<span class="line"><span>    blockLength = totalLengthAligned / NUM_BLOCKS;</span></span>
<span class="line"><span>    tileNum = blockLength / alignNum / UB_BLOCK_NUM;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (tileNum == 0) {</span></span>
<span class="line"><span>        // 单核需要计算的长度小于UB可用空间，按照仅有尾块处理</span></span>
<span class="line"><span>        tileLength = 0;</span></span>
<span class="line"><span>        lastTileLength = ((blockLength + alignNum - 1) / alignNum) * alignNum;</span></span>
<span class="line"><span>    } else if ((blockLength / alignNum) % UB_BLOCK_NUM == 0) {</span></span>
<span class="line"><span>        // 单核的计算量能被当前可用UB空间均分，仅有主块，无尾块</span></span>
<span class="line"><span>        tileLength = UB_BLOCK_NUM * alignNum;</span></span>
<span class="line"><span>        lastTileLength = 0;</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        // 同时有主块和尾块</span></span>
<span class="line"><span>        tileLength = UB_BLOCK_NUM * alignNum;</span></span>
<span class="line"><span>        lastTileLength = blockLength - tileNum * tileLength;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>(1，1904)形状的输入数据计算后，tiling结构体内各个变量的值如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct AddCustomTilingData {</span></span>
<span class="line"><span>    uint32_t blockLength = 238;      // 每个核计算238个half，8个核共计算1904个half</span></span>
<span class="line"><span>    uint32_t tileNum = 0;            // 可用的UB空间足够，为仅有尾块的场景</span></span>
<span class="line"><span>    uint32_t tileLength = 0;         // 没有主块，主块长度为0</span></span>
<span class="line"><span>    uint32_t lastTileLength = 240;   // 238个half未32B对齐，对齐到240个half搬运</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>};</span></span></code></pre></div><h2 id="算子类实现" tabindex="-1">算子类实现 <a class="header-anchor" href="#算子类实现" aria-label="Permalink to &quot;算子类实现&quot;">​</a></h2><p>与<a href="./多核Tiling.html">多核Tiling</a>相比，在Init函数中通过Pipe内存管理对象为输入输出Queue分配内存时，取tileLength与lastTileLength中的最大值作为分配内存的长度。例如，当单核需要计算的长度小于UB可用空间时，按照仅有尾块处理，此时tileLength为0，而lastTileLength为数据块长度。因此，需要取两者中的较大值来分配内存。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>uint32_t initBufferLength = AscendC::Std::max(this-&gt;tileLength, this-&gt;lastTileLength);</span></span>
<span class="line"><span>pipe-&gt;InitBuffer(inQueueX, 1, this-&gt;initBufferLength * sizeof(dataType));</span></span></code></pre></div><p>由于尾块长度为lastTileLength，与主块数据块的长度不同，因此在CopyIn函数、Compute函数、CopyOut函数中传入本次循环待处理的数据块长度参数tileLength，即待处理的主块或尾块的数据长度。</p><p>Process函数实现代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>__aicore__ inline void Process()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    // 计算主块数据，对应数据块长度为tileLength</span></span>
<span class="line"><span>    for (uint32_t i = 0; i &lt; this-&gt;tileNum; i++) {</span></span>
<span class="line"><span>        CopyIn(i, this-&gt;tileLength);</span></span>
<span class="line"><span>        Compute(i, this-&gt;tileLength);</span></span>
<span class="line"><span>        CopyOut(i, this-&gt;tileLength);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    // 计算尾块数据，对应数据块长度为lastTileLength</span></span>
<span class="line"><span>    if (this-&gt;lastTileLength &gt; 0) {</span></span>
<span class="line"><span>        CopyIn(this-&gt;tileNum, this-&gt;lastTileLength);</span></span>
<span class="line"><span>        Compute(this-&gt;tileNum, this-&gt;lastTileLength);</span></span>
<span class="line"><span>        CopyOut(this-&gt;tileNum, this-&gt;lastTileLength);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>CopyIn函数实现代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>__aicore__ inline void CopyIn(int32_t progress, uint32_t tileLength)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    AscendC::LocalTensor&lt;T&gt; xLocal = inQueueX.AllocTensor&lt;T&gt;();</span></span>
<span class="line"><span>    AscendC::LocalTensor&lt;T&gt; yLocal = inQueueY.AllocTensor&lt;T&gt;();</span></span>
<span class="line"><span>    AscendC::DataCopy(xLocal, xGm[progress * this-&gt;tileLength], tileLength);</span></span>
<span class="line"><span>    AscendC::DataCopy(yLocal, yGm[progress * this-&gt;tileLength], tileLength);</span></span>
<span class="line"><span>    inQueueX.EnQue(xLocal);</span></span>
<span class="line"><span>    inQueueY.EnQue(yLocal);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>Compute函数实现代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>__aicore__ inline void Compute(int32_t progress, uint32_t tileLength)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    AscendC::LocalTensor&lt;T&gt; xLocal = inQueueX.DeQue&lt;T&gt;();</span></span>
<span class="line"><span>    AscendC::LocalTensor&lt;T&gt; yLocal = inQueueY.DeQue&lt;T&gt;();</span></span>
<span class="line"><span>    AscendC::LocalTensor&lt;T&gt; zLocal = outQueueZ.AllocTensor&lt;T&gt;();</span></span>
<span class="line"><span>    AscendC::Add(zLocal, xLocal, yLocal, tileLength);</span></span>
<span class="line"><span>    outQueueZ.EnQue&lt;T&gt;(zLocal);</span></span>
<span class="line"><span>    inQueueX.FreeTensor(xLocal);</span></span>
<span class="line"><span>    inQueueY.FreeTensor(yLocal);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>CopyOut函数实现代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>__aicore__ inline void CopyOut(int32_t progress, uint32_t tileLength)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    AscendC::LocalTensor&lt;T&gt; zLocal = outQueueZ.DeQue&lt;T&gt;();</span></span>
<span class="line"><span>    AscendC::DataCopy(zGm[progress * this-&gt;tileLength], zLocal, tileLength);</span></span>
<span class="line"><span>    outQueueZ.FreeTensor(zLocal);</span></span>
<span class="line"><span>}</span></span></code></pre></div>`,28)])])}const _=s(i,[["render",c]]);export{r as __pageData,_ as default};
