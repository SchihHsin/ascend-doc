import{c as n,Q as a,j as e,m as p}from"./chunks/framework.DOi4mjdC.js";const t="/assets/axis-1%E6%97%B6coef%E7%A4%BA%E6%84%8F%E5%9B%BE.BNFZ8E_h.png",u=JSON.parse('{"title":"Broadcast场景","description":"","frontmatter":{},"headers":[{"level":1,"title":"Broadcast场景","slug":"broadcast场景"},{"level":2,"title":"Tiling实现","slug":"tiling实现"},{"level":2,"title":"算子类实现","slug":"算子类实现"}],"relativePath":"guide/算子实践参考/SIMD算子实现/矢量编程/Broadcast场景.md","filePath":"guide/算子实践参考/SIMD算子实现/矢量编程/Broadcast场景.md"}'),l={name:"guide/算子实践参考/SIMD算子实现/矢量编程/Broadcast场景.md"};function i(c,s,o,r,g,d){return a(),e("div",null,[...s[0]||(s[0]=[p('<h1 id="broadcast场景" tabindex="-1">Broadcast场景 <a class="header-anchor" href="#broadcast场景" aria-label="Permalink to &quot;Broadcast场景&quot;">​</a></h1><p>在某些场景下，可能会存在两个输入shape不相同的情况。由于<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/Add.md" target="_blank" rel="noreferrer">Add</a>接口只支持对shape相同的输入进行计算，因此需要先对输入进行shape变换，再进行Add计算。本节将对满足Broadcast条件的输入在算子实现中的Broadcast处理进行介绍，其他场景可以参考本章节中提供的思路。</p><div class="note custom-block github-alert"><p class="custom-block-title">注意</p><p>Broadcast机制通过扩展较小维度的数据，使得不同shape的输入能够进行运算，从而避免了显式的复制操作，提高了计算效率。数据进行Broadcast需满足：两个输入的维度个数相同，并且仅在某一个维度上的长度不同，某一个输入在此维度的长度为1。比如：shape为(32, 8) 和 (32, 1) 的两个输入可以进行Broadcast，因为它们都是二维，且第一个维度大小相等，而不相等的维度中第二个输入的维度为1，满足条件。</p></div><p>本节中将使用<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/Broadcast.md" target="_blank" rel="noreferrer">Broadcast</a>接口，因此输入需满足该API相关约束。同时，由于硬件限制，该API的输入地址需满足32字节对齐。本节以输入维度为2、第二个轴（axis = 1）需要Broadcast为例进行说明。完整的样例代码请参见<a href="https://gitcode.com/cann/asc-devkit/tree/master/examples/01_simd_cpp_api/03_libraries/08_tensor_transformation/add_broadcast" target="_blank" rel="noreferrer">输入Broadcast的Add算子样例</a>。</p><h2 id="tiling实现" tabindex="-1">Tiling实现 <a class="header-anchor" href="#tiling实现" aria-label="Permalink to &quot;Tiling实现&quot;">​</a></h2><p>与输入shape相同的场景相比，在Tiling结构体中增加相应的成员变量，表示是否需要对输入进行Broadcast、需要对哪个维度进行Broadcast、Broadcast的轴需要扩充的倍数。因此新增四个Tiling结构体成员：</p><ul><li>xLen和yLen：表示两个输入的数据长度。</li><li>axis：表示对输入的哪个维度进行Broadcast。</li><li>coef：表示Broadcast的输入需要扩维的倍数。例如，x shape为(m, 1)，y shape为(m, n)，则coef = n。如下图所示，图中相同颜色部分为单次计算的数据块。</li></ul><p><strong>图 1</strong> axis=1时coef示意图<br><img src="'+t+`" alt="" title="axis-1时coef示意图"></p><p>Tiling结构体定义代码如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct AddCustomTilingData {</span></span>
<span class="line"><span>    uint32_t xLen;</span></span>
<span class="line"><span>    uint32_t yLen;</span></span>
<span class="line"><span>    uint32_t coef;</span></span>
<span class="line"><span>    uint32_t axis;</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>设需要进行Broadcast的输入长度为shorterAxisLen；不需要进行Broadcast的输入长度为totalLength。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>constexpr uint32_t BLOCK_SIZE = 32;</span></span>
<span class="line"><span>...  // 读入数据</span></span>
<span class="line"><span>uint32_t totalLength = (xLen &gt; yLen)? xLen : yLen;</span></span>
<span class="line"><span>uint32_t shorterAxisLen = (xLen &lt; yLen)? xLen : yLen;</span></span></code></pre></div><p>使用shorterAxisLen进行分核计算，并使用分核后的长度与coef相乘作为totalLength的分核长度。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>constexpr uint32_t BLOCK_SIZE = 32;</span></span>
<span class="line"><span>uint32_t alignCoef = (tiling-&gt;axis == 0U) ? shorterAxisLen : totalLength / shorterAxisLen;</span></span>
<span class="line"><span>uint32_t divDimCoef = (tiling-&gt;axis == 0U) ? totalLength / shorterAxisLen : shorterAxisLen;</span></span>
<span class="line"><span>if (divDimCoef % blockDim == 0U) {</span></span>
<span class="line"><span>    uint32_t blockLength = divDimCoef / blockDim * alignCoef;    </span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>} else {</span></span>
<span class="line"><span>    uint32_t formerNum = (divDimCoef / BUFFER_NUM) % blockDim;</span></span>
<span class="line"><span>    uint32_t tailNum = blockDim - formerNum;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    uint32_t formerLength = ((divDimCoef / BUFFER_NUM) / blockDim + 1U) * BUFFER_NUM * alignCoef;</span></span>
<span class="line"><span>    uint32_t tailLength = ((divDimCoef / BUFFER_NUM) / blockDim) * BUFFER_NUM * alignCoef;</span></span>
<span class="line"><span>    ....</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>进行核内数据切分时，需要计算Unified Buffer数据块的数量向coef和BUFFER_NUM对齐之后的数量ubBlockAligned。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>uint32_t ubBlockAligned =</span></span>
<span class="line"><span>        (MAX_AVAILABLE_UB_BLOCK_NUM * alignNum / (alignCoef * BUFFER_NUM) * (alignCoef * BUFFER_NUM) == 0U) ?</span></span>
<span class="line"><span>            MAX_AVAILABLE_UB_BLOCK_NUM :</span></span>
<span class="line"><span>            MAX_AVAILABLE_UB_BLOCK_NUM * alignNum / (alignCoef * BUFFER_NUM) * (alignCoef * BUFFER_NUM);</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span>tileNum = length / ubBlockAligned;</span></span>
<span class="line"><span>if (length % ubBlockAligned == 0U || tileNum == 0U) {</span></span>
<span class="line"><span>    if (tileNum == 0U) {</span></span>
<span class="line"><span>        tileNum = 1U;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (length &lt; ubBlockAligned) {</span></span>
<span class="line"><span>        tileLength = length;</span></span>
<span class="line"><span>        lastTileLength = tileLength;</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        tileLength = ubBlockAligned;</span></span>
<span class="line"><span>        lastTileLength = tileLength;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>} else {</span></span>
<span class="line"><span>    tileNum++;</span></span>
<span class="line"><span>    tileLength = ubBlockNum;</span></span>
<span class="line"><span>    lastTileLength = (uint32_t)(length - (tileNum - 1) * tileLength);</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="算子类实现" tabindex="-1">算子类实现 <a class="header-anchor" href="#算子类实现" aria-label="Permalink to &quot;算子类实现&quot;">​</a></h2><p>在核函数初始化阶段，根据Tiling结构体传入的参数确定对哪个输入进行Broadcast。由于针对输入的第二个轴（axis = 1）进行Broadcast，可以计算出，对于需要进行Broadcast的输入，每个核搬入数据长度为blockLength / coef。</p><p>初始化函数代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>__aicore__ inline void Init(GM_ADDR x, GM_ADDR y, GM_ADDR z, AddCustomTilingData tiling, AscendC::TPipe* pipeIn)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    pipe = pipeIn;</span></span>
<span class="line"><span>    GM_ADDR longerInputPtr;</span></span>
<span class="line"><span>    GM_ADDR shorterInputPtr;</span></span>
<span class="line"><span>    if (tiling.xLen &gt; tiling.yLen) {</span></span>
<span class="line"><span>        longerInputPtr = x;</span></span>
<span class="line"><span>        shorterInputPtr = y;</span></span>
<span class="line"><span>        this-&gt;shorterAxisLen = tiling.yLen;</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        longerInputPtr = y;</span></span>
<span class="line"><span>        shorterInputPtr = x;</span></span>
<span class="line"><span>        this-&gt;shorterAxisLen = tiling.xLen;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    this-&gt;coef = tiling.coef;</span></span>
<span class="line"><span>    if (tiling.isEvenCore) {</span></span>
<span class="line"><span>        this-&gt;tileNum = tiling.tileNum;</span></span>
<span class="line"><span>        this-&gt;tileLength = tiling.tileLength / BUFFER_NUM;</span></span>
<span class="line"><span>        this-&gt;lastTileLength = tiling.lastTileLength;</span></span>
<span class="line"><span>        xGm.SetGlobalBuffer((__gm__ T*)longerInputPtr + tiling.blockLength * AscendC::GetBlockIdx(), tiling.blockLength);</span></span>
<span class="line"><span>        yGm.SetGlobalBuffer((__gm__ T*)shorterInputPtr, this-&gt;shorterAxisLen);</span></span>
<span class="line"><span>        zGm.SetGlobalBuffer((__gm__ T*)z + tiling.blockLength * AscendC::GetBlockIdx(), tiling.blockLength);</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        if (AscendC::GetBlockIdx() &lt; tiling.formerNum) {</span></span>
<span class="line"><span>            this-&gt;tileNum = tiling.formerTileNum;</span></span>
<span class="line"><span>            this-&gt;tileLength = tiling.formerTileLength / BUFFER_NUM;</span></span>
<span class="line"><span>            this-&gt;lastTileLength = tiling.formerLastTileLength;</span></span>
<span class="line"><span>            xGm.SetGlobalBuffer((__gm__ T*)longerInputPtr + tiling.formerLength * AscendC::GetBlockIdx(), tiling.formerLength);</span></span>
<span class="line"><span>            yGm.SetGlobalBuffer((__gm__ T*)shorterInputPtr, this-&gt;shorterAxisLen);</span></span>
<span class="line"><span>            zGm.SetGlobalBuffer((__gm__ T*)z + tiling.formerLength * AscendC::GetBlockIdx(), tiling.formerLength);</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            this-&gt;tileNum = tiling.tailTileNum;</span></span>
<span class="line"><span>            this-&gt;tileLength = tiling.tailTileLength / BUFFER_NUM;</span></span>
<span class="line"><span>            this-&gt;lastTileLength = tiling.tailLastTileLength;</span></span>
<span class="line"><span>            xGm.SetGlobalBuffer((__gm__ T*)longerInputPtr + tiling.formerLength * tiling.formerNum +</span></span>
<span class="line"><span>                tiling.tailLength * (AscendC::GetBlockIdx() - tiling.formerNum), tiling.tailLength);</span></span>
<span class="line"><span>            yGm.SetGlobalBuffer((__gm__ T*)shorterInputPtr, this-&gt;shorterAxisLen);</span></span>
<span class="line"><span>            zGm.SetGlobalBuffer((__gm__ T*)z + tiling.formerLength * tiling.formerNum +</span></span>
<span class="line"><span>                tiling.tailLength * (AscendC::GetBlockIdx() - tiling.formerNum), tiling.tailLength);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    pipe-&gt;InitBuffer(inQueueX, BUFFER_NUM, this-&gt;tileLength * sizeof(T));</span></span>
<span class="line"><span>    pipe-&gt;InitBuffer(inQueueY, BUFFER_NUM, this-&gt;coef * sizeof(T));</span></span>
<span class="line"><span>    pipe-&gt;InitBuffer(outQueueZ, BUFFER_NUM, this-&gt;tileLength * sizeof(T));</span></span>
<span class="line"><span>    pipe-&gt;InitBuffer(tmpBuf0, this-&gt;tileLength * sizeof(dataType));</span></span>
<span class="line"><span>    pipe-&gt;InitBuffer(tmpBuf1, this-&gt;tileLength * sizeof(dataType));</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>由于数据是向coef对齐的，在数据拷贝的过程中可能会出现地址不满足32字节对齐的场景，因此CopyIn函数、CopyOut函数中使用<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/DataCopyPad(ISASI).md" target="_blank" rel="noreferrer">DataCopyPad</a>进行数据拷贝。</p><p>CopyIn函数实现代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>__aicore__ inline void CopyIn(int32_t progress)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    AscendC::LocalTensor&lt;T&gt; xLocal = inQueueX.AllocTensor&lt;T&gt;();</span></span>
<span class="line"><span>    AscendC::LocalTensor&lt;T&gt; yLocal = inQueueY.AllocTensor&lt;T&gt;();</span></span>
<span class="line"><span>    AscendC::DataCopyExtParams copyParams = {1, (uint32_t)(this-&gt;tileLength * sizeof(T)), 0, 0, 0};</span></span>
<span class="line"><span>    AscendC::DataCopyPadExtParams&lt;T&gt; padParams = {false, 0, 0, 0};</span></span>
<span class="line"><span>    AscendC::DataCopyPad&lt;T&gt;(xLocal, xGm[progress * this-&gt;tileLength], copyParams, padParams);</span></span>
<span class="line"><span>    AscendC::DataCopyPad&lt;T&gt;(yLocal, yGm[(progress % BUFFER_NUM) * this-&gt;tileLength], copyParams,</span></span>
<span class="line"><span>                                        padParams);</span></span>
<span class="line"><span>    inQueueX.EnQue(xLocal);</span></span>
<span class="line"><span>    inQueueY.EnQue(yLocal);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>CopyOut函数实现代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>__aicore__ inline void CopyOut(int32_t progress)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    AscendC::LocalTensor&lt;T&gt; zLocal = outQueueZ.DeQue&lt;T&gt;();</span></span>
<span class="line"><span>    AscendC::DataCopyExtParams copyParams = {1, (uint32_t)(this-&gt;tileLength * sizeof(T)), 0, 0, 0};</span></span>
<span class="line"><span>    AscendC::DataCopyPad&lt;T&gt;(zGm[progress * this-&gt;tileLength], zLocal, copyParams);</span></span>
<span class="line"><span>    outQueueZ.FreeTensor(zLocal);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在Compute函数中，调用Add接口前需要先对输入进行Broadcast。这里需要计算Broadcast前后的shape。基于前文提到的数据关系，可以计算得出Broadcast前后的shape分别为{tileLength / broadcastCoef, 1}和{tileLength / broadcastCoef, broadcastCoef}。在此基础上对输入进行Broadcast，并将计算结果存入临时空间中，然后进行Add计算。实现代码示例如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>__aicore__ inline void Compute(int32_t progress)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    AscendC::LocalTensor&lt;T&gt; xLocal = inQueueX.DeQue&lt;T&gt;();</span></span>
<span class="line"><span>    AscendC::LocalTensor&lt;T&gt; yLocal = inQueueY.DeQue&lt;T&gt;();</span></span>
<span class="line"><span>    AscendC::LocalTensor&lt;T&gt; zLocal = outQueueZ.AllocTensor&lt;T&gt;();</span></span>
<span class="line"><span>    AscendC::LocalTensor&lt;T&gt; broadcastTmpTensor = tmpBuf2.Get&lt;T&gt;();</span></span>
<span class="line"><span>    uint32_t dstShape[] = {this-&gt;tileLength / this-&gt;coef, this-&gt;coef};</span></span>
<span class="line"><span>    uint32_t srcShape[] = {this-&gt;tileLength / this-&gt;coef, 1};</span></span>
<span class="line"><span>    AscendC::BroadCast&lt;T, 2, 1&gt;(broadcastTmpTensor, yLocal, dstShape, srcShape);</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>}</span></span></code></pre></div>`,27)])])}const _=n(l,[["render",i]]);export{u as __pageData,_ as default};
