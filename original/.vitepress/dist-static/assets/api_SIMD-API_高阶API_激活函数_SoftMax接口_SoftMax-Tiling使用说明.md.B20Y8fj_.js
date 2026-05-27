import{c as n,Q as s,j as i,m as p}from"./chunks/framework.DOi4mjdC.js";const r=JSON.parse('{"title":"SoftMax Tiling使用说明","description":"","frontmatter":{},"headers":[{"level":1,"title":"SoftMax Tiling使用说明","slug":"softmax-tiling使用说明"},{"level":2,"title":"调用示例","slug":"调用示例"}],"relativePath":"api/SIMD-API/高阶API/激活函数/SoftMax接口/SoftMax-Tiling使用说明.md","filePath":"api/SIMD-API/高阶API/激活函数/SoftMax接口/SoftMax-Tiling使用说明.md"}'),t={name:"api/SIMD-API/高阶API/激活函数/SoftMax接口/SoftMax-Tiling使用说明.md"};function l(e,a,o,c,g,S){return s(),i("div",null,[...a[0]||(a[0]=[p(`<h1 id="softmax-tiling使用说明" tabindex="-1">SoftMax Tiling使用说明 <a class="header-anchor" href="#softmax-tiling使用说明" aria-label="Permalink to &quot;SoftMax Tiling使用说明&quot;">​</a></h1><p>Ascend C提供一组SoftMax Tiling API，方便用户获取SoftMax kernel计算时所需的Tiling参数。</p><p>获取Tiling参数主要分为如下两步：</p><ol><li><p>获取SoftMax接口计算所需最小和最大临时空间大小，注意该步骤不是必须的，只是作为一个参考，供合理分配计算空间。</p></li><li><p>获取输入SoftMax kernel侧接口所需tiling参数，需要传入输入shape、剩余的可供softmax接口计算的空间大小和计算的数据类型大小。</p><p>SoftMax Tiling结构体的定义如下，开发者无需关注该tiling结构的具体信息，只需要传递到kernel侧，传入SoftMax高阶API接口，直接进行使用即可。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct SoftMaxTiling {</span></span>
<span class="line"><span>    uint32_t srcM = 0;</span></span>
<span class="line"><span>    uint32_t srcK = 0;</span></span>
<span class="line"><span>    uint32_t srcSize = 0;</span></span>
<span class="line"><span>    uint32_t outMaxM = 0;</span></span>
<span class="line"><span>    uint32_t outMaxK = 0;</span></span>
<span class="line"><span>    uint32_t outMaxSize = 0;</span></span>
<span class="line"><span>    uint32_t splitM = 0;</span></span>
<span class="line"><span>    uint32_t splitK = 0;</span></span>
<span class="line"><span>    uint32_t splitSize = 0;</span></span>
<span class="line"><span>    uint32_t reduceM = 0;</span></span>
<span class="line"><span>    uint32_t reduceK = 0;</span></span>
<span class="line"><span>    uint32_t reduceSize = 0;</span></span>
<span class="line"><span>    uint32_t rangeM = 0;</span></span>
<span class="line"><span>    uint32_t tailM = 0;</span></span>
<span class="line"><span>    uint32_t tailSplitSize = 0;</span></span>
<span class="line"><span>    uint32_t tailReduceSize = 0;</span></span>
<span class="line"><span>};</span></span></code></pre></div></li></ol><p>对于SoftMax/SimpleSoftMax请参考<a href="./SoftMax-SimpleSoftMax-Tiling.html">SoftMax/SimpleSoftMax Tiling</a>；</p><p>对于SoftmaxFlash请参考<a href="./SoftmaxFlash-Tiling接口.html">SoftmaxFlash Tiling接口</a>；</p><p>对于SoftmaxGrad请参考<a href="./SoftmaxGrad-Tiling接口.html">SoftmaxGrad Tiling接口</a>；</p><p>对于SoftmaxFlashV2请参考<a href="./SoftmaxFlashV2-Tiling接口.html">SoftmaxFlashV2 Tiling接口</a>；</p><p>判断SoftMaxTiling是否为基本块Tiling请参考<a href="./IsBasicBlockInSoftMax.html">IsBasicBlockInSoftMax</a>。</p><h2 id="调用示例" tabindex="-1">调用示例 <a class="header-anchor" href="#调用示例" aria-label="Permalink to &quot;调用示例&quot;">​</a></h2><p>如下样例介绍了使用SoftMax高阶API时host侧获取Tiling参数的流程以及该参数如何在kernel侧使用。样例中输入Tensor的shape大小为[320,64]，输入的数据类型为half。</p><ol><li><p>将SoftMaxTiling结构体参数增加至TilingData结构体，作为TilingData结构体的一个字段。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>BEGIN_TILING_DATA_DEF(TilingData)               // 注册一个tiling的类，以tiling的名字作为入参</span></span>
<span class="line"><span>  TILING_DATA_FIELD_DEF(uint32_t, totalLength); // 添加tiling字段，总计算数据量</span></span>
<span class="line"><span>  TILING_DATA_FIELD_DEF(uint32_t, tileNum);     // 添加tiling字段，每个核上总计算数据分块个数</span></span>
<span class="line"><span>  ...                                           // 添加其他tiling字段</span></span>
<span class="line"><span>  TILING_DATA_FIELD_DEF_STRUCT(SoftMaxTiling, softmaxTilingData); // 将SoftMaxTiling结构体参数增加至TilingData结构体</span></span>
<span class="line"><span>END_TILING_DATA_DEF;</span></span></code></pre></div></li><li><p>Tiling实现函数中，首先调用<strong>GetSoftMaxMaxTmpSize/GetSoftMaxMinTmpSize</strong>接口获取SoftMax接口能完成计算所需最大/最小临时空间大小，根据该范围结合实际的内存使用情况设置合适的空间大小；然后根据输入shape、剩余的可供计算的空间大小等信息获取SoftMax kernel侧接口所需tiling参数。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>namespace optiling {</span></span>
<span class="line"><span>const uint32_t NUM_BLOCKS = 8;</span></span>
<span class="line"><span>const uint32_t TILE_NUM = 8;</span></span>
<span class="line"><span>static ge::graphStatus TilingFunc(gert::TilingContext* context)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    TilingData tiling;</span></span>
<span class="line"><span>    uint32_t totalLength = context-&gt;GetInputTensor(0)-&gt;GetShapeSize();</span></span>
<span class="line"><span>    context-&gt;SetBlockDim(NUM_BLOCKS);</span></span>
<span class="line"><span>    tiling.set_totalLength(totalLength);</span></span>
<span class="line"><span>    tiling.set_tileNum(TILE_NUM);</span></span>
<span class="line"><span>    // 设置其他Tiling参数</span></span>
<span class="line"><span>    ... </span></span>
<span class="line"><span>    std::vector&lt;int64_t&gt; shapeVec = {320,64};</span></span>
<span class="line"><span>    ge::Shape srcShape(shapeVec);</span></span>
<span class="line"><span>    // 本样例中仅作为样例说明，通过GetSoftMaxMinTmpSize获取最小值并传入，来保证功能正确，开发者可以根据需要传入合适的空间大小</span></span>
<span class="line"><span>    const uint32_t localWorkSpaceSize = AscendC::GetSoftMaxMinTmpSize(srcShape, sizeof(half), false);</span></span>
<span class="line"><span>    // 获取SoftMax Tiling参数</span></span>
<span class="line"><span>    AscendC::SoftMaxTilingFunc(srcShape, sizeof(half), localWorkSpaceSize, tiling.softmaxTilingData); </span></span>
<span class="line"><span>     ... // 其他逻辑</span></span>
<span class="line"><span>    tiling.SaveToBuffer(context-&gt;GetRawTilingData()-&gt;GetData(), context-&gt;GetRawTilingData()-&gt;GetCapacity());</span></span>
<span class="line"><span>    context-&gt;GetRawTilingData()-&gt;SetDataSize(tiling.GetDataSize());</span></span>
<span class="line"><span>    context-&gt;SetTilingKey(1);</span></span>
<span class="line"><span>    return ge::GRAPH_SUCCESS;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>} // namespace optiling</span></span></code></pre></div></li><li><p>对应的kernel侧通过在核函数中调用GET_TILING_DATA获取TilingData，继而将TilingData中的SoftMax Tiling信息传入SoftMax接口参与计算。完整的kernel侧样例请参考<a href="./SoftMax.html#section94691236101419">调用示例</a>。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>extern &quot;C&quot; __global__ __aicore__ void func_custom(GM_ADDR x, GM_ADDR y, GM_ADDR z, GM_ADDR workspace, GM_ADDR tiling)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    GET_TILING_DATA(tilingData, tiling);</span></span>
<span class="line"><span>    KernelFunc op;</span></span>
<span class="line"><span>    op.Init(x, y, z, tilingData.totalLength, tilingData.tileNum,tilingData.SoftMaxTiling);</span></span>
<span class="line"><span>    if (TILING_KEY_IS(1)) {</span></span>
<span class="line"><span>        op.Process();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div></li></ol>`,12)])])}const f=n(t,[["render",l]]);export{r as __pageData,f as default};
