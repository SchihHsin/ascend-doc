import{c as a,Q as s,j as e,m as t}from"./chunks/framework.DOi4mjdC.js";const u=JSON.parse('{"title":"DeepNorm Tiling","description":"","frontmatter":{},"headers":[{"level":1,"title":"DeepNorm Tiling","slug":"deepnorm-tiling"},{"level":2,"title":"功能说明","slug":"功能说明"},{"level":2,"title":"函数原型","slug":"函数原型"},{"level":2,"title":"参数说明","slug":"参数说明"},{"level":2,"title":"返回值说明","slug":"返回值说明"},{"level":2,"title":"约束说明","slug":"约束说明"},{"level":2,"title":"调用示例","slug":"调用示例"}],"relativePath":"api/SIMD-API/高阶API/归一化操作/DeepNorm-Tiling.md","filePath":"api/SIMD-API/高阶API/归一化操作/DeepNorm-Tiling.md"}'),p={name:"api/SIMD-API/高阶API/归一化操作/DeepNorm-Tiling.md"};function i(l,n,o,r,c,d){return s(),e("div",null,[...n[0]||(n[0]=[t(`<h1 id="deepnorm-tiling" tabindex="-1">DeepNorm Tiling <a class="header-anchor" href="#deepnorm-tiling" aria-label="Permalink to &quot;DeepNorm Tiling&quot;">​</a></h1><h2 id="功能说明" tabindex="-1">功能说明 <a class="header-anchor" href="#功能说明" aria-label="Permalink to &quot;功能说明&quot;">​</a></h2><p>Ascend C提供DeepNorm Tiling API，方便用户获取DeepNorm kernel计算时所需的Tiling参数。</p><p>获取Tiling参数主要分为如下两步：</p><ol><li><p>通过<strong>GetDeepNormMaxMinTmpSize</strong>获取DeepNorm接口计算所需最大和最小临时空间大小。</p><p>kernel侧DeepNorm接口的计算需要开发者预留/申请临时空间，<strong>GetDeepNormMaxMinTmpSize</strong>用于在host侧获取预留/申请的最大最小临时空间大小，开发者基于此范围选择合适的空间大小作为Tiling参数传递到kernel侧使用。</p><ul><li>为保证功能正确，预留/申请的临时空间大小不能小于最小临时空间大小；</li><li>在最小临时空间-最大临时空间范围内，随着临时空间增大，kernel侧接口计算性能会有一定程度的优化提升。为了达到更好的性能，开发者可以根据实际的内存使用情况进行空间预留/申请。</li></ul></li><li><p>通过<strong>GetDeepNormTilingInfo</strong>获取DeepNormkernel侧接口所需tiling参数。</p><p>DeepNormTiling结构体的定义如下，开发者无需关注该tiling结构的具体信息，只需要传递到kernel侧，传入DeepNorm高阶API接口，直接进行使用即可。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct DeepNormTiling {</span></span>
<span class="line"><span>    uint32_t bLength = 0;</span></span>
<span class="line"><span>    uint32_t sLength = 0;</span></span>
<span class="line"><span>    uint32_t hLength = 0;</span></span>
<span class="line"><span>    uint32_t originalHLength = 0;</span></span>
<span class="line"><span>    uint32_t inputXSize = 0;</span></span>
<span class="line"><span>    uint32_t meanVarSize = 0;</span></span>
<span class="line"><span>    uint32_t numberOfTmpBuf = 0;</span></span>
<span class="line"><span>    uint32_t meanTmpTensorPos = 0;</span></span>
<span class="line"><span>    uint32_t meanTmpTensorSize = 0;</span></span>
<span class="line"><span>    uint32_t varianceTmpTensorPos = 0;</span></span>
<span class="line"><span>    uint32_t varianceTmpTensorSize = 0;</span></span>
<span class="line"><span>    uint32_t tmpBufSize = 0;</span></span>
<span class="line"><span>    uint32_t oneTmpSize = 0;</span></span>
<span class="line"><span>    uint32_t firstTmpStartPos = 0;</span></span>
<span class="line"><span>    uint32_t secondTmpStartPos = 0;</span></span>
<span class="line"><span>    uint32_t thirdTmpStartPos = 0;</span></span>
<span class="line"><span>    uint32_t loopRound = 0;</span></span>
<span class="line"><span>    uint32_t inputRoundSize = 0;</span></span>
<span class="line"><span>    uint32_t inputTailSize = 0;</span></span>
<span class="line"><span>    uint32_t inputTailPos = 0;</span></span>
<span class="line"><span>    uint32_t meanVarRoundSize = 0;</span></span>
<span class="line"><span>    uint32_t meanVarTailSize = 0;</span></span>
<span class="line"><span>    uint32_t meanVarTailPos = 0;</span></span>
<span class="line"><span>    uint32_t bshCurLength = 0;</span></span>
<span class="line"><span>    uint32_t bsCurLength = 0;</span></span>
<span class="line"><span>    float lastDimValueBack = 0;</span></span>
<span class="line"><span>};</span></span></code></pre></div></li></ol><h2 id="函数原型" tabindex="-1">函数原型 <a class="header-anchor" href="#函数原型" aria-label="Permalink to &quot;函数原型&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>bool GetDeepNormMaxMinTmpSize(const ge::Shape&amp; srcShape, const uint32_t typeSize, const bool isReuseSource, const bool isBasicBlock, uint32_t&amp; maxValue, uint32_t&amp; minValue)</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>bool GetDeepNormTilingInfo(const ge::Shape&amp; srcShape, const ge::Shape&amp; originSrcShape, const uint32_t stackBufferSize, const uint32_t typeSize, const bool isReuseSource, const bool isBasicBlock, optiling::DeepNormTiling&amp; tiling)</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>bool GetDeepNormTilingInfo(const ge::Shape&amp; srcShape, const ge::Shape&amp; originSrcShape, const uint32_t stackBufferSize, const uint32_t typeSize, const bool isReuseSource, const bool isBasicBlock, AscendC::tiling::DeepNormTiling&amp; tiling)</span></span></code></pre></div><h2 id="参数说明" tabindex="-1">参数说明 <a class="header-anchor" href="#参数说明" aria-label="Permalink to &quot;参数说明&quot;">​</a></h2><p><strong>表 1</strong> GetDeepNormMaxMinTmpSize接口参数说明</p><table tabindex="0"><thead><tr><th>参数名</th><th>输入/输出</th><th>描述</th></tr></thead><tbody><tr><td>srcShape</td><td>输入</td><td>输入的shape信息。</td></tr><tr><td>typeSize</td><td>输入</td><td>输入的数据类型大小，单位为字节。比如输入的数据类型为half，此处应传入2。</td></tr><tr><td>isReuseSource</td><td>输入</td><td>是否复用源操作数输入的空间，与DeepNorm接口一致。</td></tr><tr><td>isBasicBlock</td><td>输入</td><td>srcShape是否符合基本块定义：尾轴H的长度为64的倍数（不超过2040）， B*S为8的倍数。</td></tr><tr><td>maxValue</td><td>输出</td><td>DeepNorm接口能完成计算所需的最大临时空间大小，超出该值的空间不会被该接口使用。在最小临时空间-最大临时空间范围内，随着临时空间增大，kernel侧接口计算性能会有一定程度的优化提升。为了达到更好的性能，开发者可以根据实际的内存使用情况进行空间预留/申请。最大空间大小为0表示计算不需要临时空间。 说明： maxValue仅作为参考值，有可能大于Unified Buffer剩余空间的大小，该场景下，开发者需要根据Unified Buffer剩余空间的大小来选取合适的临时空间大小。</td></tr><tr><td>minValue</td><td>输出</td><td>DeepNorm接口能完成计算所需最小临时空间大小。为保证功能正确，接口计算时预留/申请的临时空间不能小于该数值。最小空间大小为0表示计算不需要临时空间。</td></tr></tbody></table><p><strong>表2</strong> GetDeepNormTilingInfo接口参数说明</p><table tabindex="0"><thead><tr><th>参数名</th><th>输入/输出</th><th>描述</th></tr></thead><tbody><tr><td>srcShape</td><td>输入</td><td>输入的shape信息[B, S, H]。</td></tr><tr><td>originSrcShape</td><td>输入</td><td>32B对齐前的输入shape信息[B, S, originH]。originH的长度应该在(0, H]的范围内。如果isBasicBlock置为true，originH必须与H一致。</td></tr><tr><td>stackBufferSize</td><td>输入</td><td>临时空间的buffer大小，单位为Byte。通过GetDeepNormMaxMinTmpSize获取最大最小临时空间大小，开发者基于此范围选择合适的空间大小作为stackBufferByteSize传入。</td></tr><tr><td>typeSize</td><td>输入</td><td>输入的数据类型大小，单位为字节。比如输入的数据类型为half，此处应传入2。</td></tr><tr><td>isReuseSource</td><td>输入</td><td>是否复用源操作数输入的空间，与DeepNorm接口一致。</td></tr><tr><td>isBasicBlock</td><td>输入</td><td>srcShape是否符合基本块定义：尾轴H的长度为64的倍数（不超过2040）， B*S为8的倍数。</td></tr><tr><td>tiling</td><td>输出</td><td>DeepNorm计算所需Tiling信息。</td></tr></tbody></table><h2 id="返回值说明" tabindex="-1">返回值说明 <a class="header-anchor" href="#返回值说明" aria-label="Permalink to &quot;返回值说明&quot;">​</a></h2><ul><li>GetDeepNormMaxMinTmpSize返回值为true/false，true表示成功拿到DeepNorm接口内部计算需要的最大和最小临时空间大小；false表示获取失败。</li><li>GetDeepNormTilingInfo返回类型为true/false，true表示成功拿到DeepNorm的Tiling各项参数值；false表示获取失败。</li></ul><h2 id="约束说明" tabindex="-1">约束说明 <a class="header-anchor" href="#约束说明" aria-label="Permalink to &quot;约束说明&quot;">​</a></h2><p>无</p><h2 id="调用示例" tabindex="-1">调用示例 <a class="header-anchor" href="#调用示例" aria-label="Permalink to &quot;调用示例&quot;">​</a></h2><ol><li><p>将DeepNorm Tiling结构体参数增加至TilingData结构体，作为TilingData结构体的一个字段。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>BEGIN_TILING_DATA_DEF(TilingData)               // 注册一个tiling的类，以tiling的名字作为入参</span></span>
<span class="line"><span>  TILING_DATA_FIELD_DEF(uint32_t, totalLength); // 添加tiling字段，总计算数据量</span></span>
<span class="line"><span>  TILING_DATA_FIELD_DEF(uint32_t, tileNum);     // 添加tiling字段，每个核上总计算数据分块个数</span></span>
<span class="line"><span>  ...                                           // 添加其他tiling字段</span></span>
<span class="line"><span>  TILING_DATA_FIELD_DEF_STRUCT(DeepNormTiling, deepnormTilingData); // 将DeepNormTiling结构体参数增加至TilingData结构体</span></span>
<span class="line"><span>END_TILING_DATA_DEF;</span></span></code></pre></div></li><li><p>Tiling实现函数中，首先调用<strong>GetDeepNormMaxMinTmpSize</strong>接口获取DeepNorm接口能完成计算所需最大/最小临时空间大小，根据该范围结合实际的内存使用情况设置合适的空间大小，然后根据输入shape、剩余的可供计算的空间大小等信息获取DeepNorm kernel侧接口所需tiling参数。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>namespace optiling {</span></span>
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
<span class="line"><span>    std::vector&lt;int64_t&gt; shapeVec = {2, 16, 64};</span></span>
<span class="line"><span>    std::vector&lt;int64_t&gt; oriShapeVec = {2, 16, 64};</span></span>
<span class="line"><span>    ge::Shape srcShape(shapeVec);</span></span>
<span class="line"><span>    ge::Shape originSrcShape(oriShapeVec);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 本样例中仅作为样例说明，通过GetDeepNormMaxMinTmpSize获取最小值并传入，来保证功能正确，开发者可以根据需要传入合适的空间大小</span></span>
<span class="line"><span>    uint32_t minValue = 0;</span></span>
<span class="line"><span>    uint32_t maxValue = 0;</span></span>
<span class="line"><span>    AscendC::GetDeepNormMaxMinTmpSize(srcShape, sizeof(half), isReuseSrc, isBasicBlock, maxValue, minValue);</span></span>
<span class="line"><span>    // 获取DeepNorm Tiling参数</span></span>
<span class="line"><span>    AscendC::GetDeepNormTilingInfo(srcShape, originSrcShape, minValue, sizeof(half), isReuseSrc, isBasicBlock, tiling.deepnormTilingData); </span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>     ... // 其他逻辑</span></span>
<span class="line"><span>    tiling.SaveToBuffer(context-&gt;GetRawTilingData()-&gt;GetData(), context-&gt;GetRawTilingData()-&gt;GetCapacity());</span></span>
<span class="line"><span>    context-&gt;GetRawTilingData()-&gt;SetDataSize(tiling.GetDataSize());</span></span>
<span class="line"><span>    context-&gt;SetTilingKey(1);</span></span>
<span class="line"><span>    return ge::GRAPH_SUCCESS;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>} // namespace optiling</span></span></code></pre></div></li><li><p>对应的kernel侧通过在核函数中调用GET_TILING_DATA获取TilingData，继而将TilingData中的DeepNorm Tiling信息传入DeepNorm接口参与计算。完整的kernel侧样例请参考<a href="./DeepNorm.html">DeepNorm</a>。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>extern &quot;C&quot; __global__ __aicore__ void deepnorm_custom(GM_ADDR inputX, GM_ADDR inputGx, GM_ADDR beta, GM_ADDR gamma, GM_ADDR output, GM_ADDR outputMean, GM_ADDR outputVariance, GM_ADDR tiling)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    GET_TILING_DATA(tilingData, tiling);</span></span>
<span class="line"><span>    KernelDeepNorm op;</span></span>
<span class="line"><span>    op.Init(inputX, inputGx, beta, gamma, output, outputMean, outputVariance,  tilingData.totalLength, tilingData.tileNum, tilingData.deepnormTilingData);</span></span>
<span class="line"><span>    if (TILING_KEY_IS(1)) {</span></span>
<span class="line"><span>        op.Process();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div></li></ol>`,20)])])}const h=a(p,[["render",i]]);export{u as __pageData,h as default};
