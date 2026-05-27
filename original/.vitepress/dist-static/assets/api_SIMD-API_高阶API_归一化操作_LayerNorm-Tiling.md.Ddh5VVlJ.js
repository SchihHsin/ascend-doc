import{c as a,Q as s,j as t,m as e}from"./chunks/framework.DOi4mjdC.js";const u=JSON.parse('{"title":"LayerNorm Tiling","description":"","frontmatter":{},"headers":[{"level":1,"title":"LayerNorm Tiling","slug":"layernorm-tiling"},{"level":2,"title":"功能说明","slug":"功能说明"},{"level":2,"title":"函数原型","slug":"函数原型"},{"level":2,"title":"参数说明","slug":"参数说明"},{"level":2,"title":"返回值说明","slug":"返回值说明"},{"level":2,"title":"约束说明","slug":"约束说明"},{"level":2,"title":"调用示例","slug":"调用示例"}],"relativePath":"api/SIMD-API/高阶API/归一化操作/LayerNorm-Tiling.md","filePath":"api/SIMD-API/高阶API/归一化操作/LayerNorm-Tiling.md"}'),i={name:"api/SIMD-API/高阶API/归一化操作/LayerNorm-Tiling.md"};function p(l,n,o,r,c,g){return s(),t("div",null,[...n[0]||(n[0]=[e(`<h1 id="layernorm-tiling" tabindex="-1">LayerNorm Tiling <a class="header-anchor" href="#layernorm-tiling" aria-label="Permalink to &quot;LayerNorm Tiling&quot;">​</a></h1><h2 id="功能说明" tabindex="-1">功能说明 <a class="header-anchor" href="#功能说明" aria-label="Permalink to &quot;功能说明&quot;">​</a></h2><p>Ascend C提供一组LayerNorm Tiling API，方便用户获取LayerNorm kernel计算时所需的Tiling参数。</p><p>获取Tiling参数主要分为如下两步：</p><ol><li><p>先通过<strong>GetLayerNormMaxMinTmpSize</strong>获取LayerNorm接口计算所需最大和最小临时空间大小，用于合理分配计算空间。</p><p>kernel侧LayerNorm接口的计算需要开发者预留/申请临时空间，<strong>GetLayerNormMaxMinTmpSize</strong>用于在host侧获取预留/申请的最大最小临时空间大小，开发者基于此范围选择合适的空间大小作为Tiling参数传递到kernel侧使用。</p><ul><li>为保证功能正确，预留/申请的临时空间大小不能小于最小临时空间大小；</li><li>在最小临时空间-最大临时空间范围内，随着临时空间增大，kernel侧接口计算性能会有一定程度的优化提升。为了达到更好的性能，开发者可以根据实际的内存使用情况进行空间预留/申请。</li></ul></li><li><p>通过<strong>GetLayerNormNDTilingInfo</strong>获取LayerNorm kernel侧接口所需tiling参数，需要传入输入shape，剩余的可供LayerNorm接口计算的空间大小和计算的数据类型。</p><p>LayerNorm Tiling结构体的定义如下，开发者无需关注该Tiling结构的具体信息，只需要传递到kernel侧，传入LayerNorm高阶API接口，直接进行使用即可。</p><ul><li><p>输出归一化结果、均值和方差的LayerNorm接口所需的Tiling结构体</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct LayerNormTiling {</span></span>
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
<span class="line"><span>    float lastDimValueBack = 0.0;</span></span>
<span class="line"><span>};</span></span></code></pre></div></li><li><p>输出归一化结果、均值和标准差的倒数的LayerNorm接口所需的Tiling结构体</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct LayerNormSeparateTiling{</span></span>
<span class="line"><span>    uint32_t aLength = 0;</span></span>
<span class="line"><span>    uint32_t rLength = 0;</span></span>
<span class="line"><span>    uint32_t halfAddRepeatTimes = 0;</span></span>
<span class="line"><span>    uint32_t rHeadLength = 0;</span></span>
<span class="line"><span>    float k2Rec = 0;</span></span>
<span class="line"><span>    float k2RRec = 0;</span></span>
<span class="line"><span>    uint32_t inputXSize = 0;</span></span>
<span class="line"><span>    uint32_t meanVarSize = 0;</span></span>
<span class="line"><span>    uint32_t numberOfTmpBuf = 0;</span></span>
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
<span class="line"><span>    uint32_t arCurLength = 0;</span></span>
<span class="line"><span>    uint32_t aCurLength = 0;</span></span>
<span class="line"><span>    float rValueBack = 0;</span></span>
<span class="line"><span>};</span></span></code></pre></div></li></ul></li></ol><h2 id="函数原型" tabindex="-1">函数原型 <a class="header-anchor" href="#函数原型" aria-label="Permalink to &quot;函数原型&quot;">​</a></h2><div class="note custom-block github-alert"><p class="custom-block-title">说明</p><p>GetLayerNormNDTillingInfo接口废弃，并将在后续版本移除，请不要使用该接口。请使用GetLayerNormNDTilingInfo接口。</p></div><ul><li><p>GetLayerNormMaxMinTmpSize接口</p><ul><li><p>输出归一化结果、均值和方差的LayerNorm接口所需的临时空间</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void GetLayerNormMaxMinTmpSize(const ge::Shape&amp; srcShape, const uint32_t typeSize, const bool isReuseSource, uint32_t&amp; maxValue, uint32_t&amp; minValue)</span></span></code></pre></div></li><li><p>输出归一化结果、均值和标准差的倒数的LayerNorm接口所需的临时空间</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void GetLayerNormMaxMinTmpSize(const ge::Shape&amp; srcShape, const uint32_t typeSize, const bool isReuseSource, const bool isComputeRstd, const bool isOnlyOutput, uint32_t&amp; maxValue, uint32_t&amp; minValue)</span></span></code></pre></div></li></ul></li><li><p>GetLayerNormNDTilingInfo/GetLayerNormNDTillingInfo接口</p><ul><li><p>输出归一化结果、均值和方差的LayerNorm接口所需的tiling参数</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void GetLayerNormNDTilingInfo(const ge::Shape&amp; srcShape, const uint32_t stackBufferSize, const uint32_t typeSize, const bool isReuseSource, optiling::LayerNormTiling&amp; tiling)</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void GetLayerNormNDTilingInfo(const ge::Shape&amp; srcShape, const uint32_t stackBufferSize, const uint32_t typeSize, const bool isReuseSource, AscendC::tiling::LayerNormTiling&amp; tiling)</span></span></code></pre></div></li><li><p>输出归一化结果、均值和方差的LayerNorm接口所需的tiling参数（不推荐使用）</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void GetLayerNormNDTillingInfo(const ge::Shape&amp; srcShape, const uint32_t stackBufferSize, const uint32_t typeSize, const bool isReuseSource, optiling::LayerNormTiling&amp; tilling)</span></span></code></pre></div></li><li><p>输出归一化结果、均值和标准差的倒数的LayerNorm接口所需的tiling参数</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void GetLayerNormNDTilingInfo(const ge::Shape&amp; srcShape, const uint32_t stackBufferSize, const uint32_t typeSize, const bool isReuseSource, const bool isComputeRstd, optiling::LayerNormSeparateTiling&amp; tiling)</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void GetLayerNormNDTilingInfo(const ge::Shape&amp; srcShape, const uint32_t stackBufferSize, const uint32_t typeSize, const bool isReuseSource, const bool isComputeRstd, AscendC::tiling::LayerNormSeparateTiling&amp; tiling)</span></span></code></pre></div></li></ul></li></ul><h2 id="参数说明" tabindex="-1">参数说明 <a class="header-anchor" href="#参数说明" aria-label="Permalink to &quot;参数说明&quot;">​</a></h2><p><strong>表 1</strong> GetLayerNormMaxMinTmpSize接口参数列表</p><table tabindex="0"><thead><tr><th>接口</th><th>输入/输出</th><th>功能</th></tr></thead><tbody><tr><td>srcShape</td><td>输入</td><td>输出归一化结果、均值和方差的LayerNorm接口： 输入数据inputX的shape信息{B, S, storageHLength, originHLength}，包括当前输入的inputX的shape信息，以及地址对齐前（如存在H轴补齐操作）的原有shape信息 。 在API支持的场景下，storageHLength和originHLength保持一致。 输出归一化结果、均值和标准差的倒数的LayerNorm接口： 输入数据inputX的shape信息{A, R}，A轴长度可以在kernel接口中动态指定，但范围不能超过此参数中A的大小。</td></tr><tr><td>typeSize</td><td>输入</td><td>输入数据inputX的数据类型大小，单位为字节。比如输入的数据类型为half，此处应传入2。</td></tr><tr><td>isReuseSource</td><td>输入</td><td>是否复用源操作数的内存空间，与LayerNorm接口一致。</td></tr><tr><td>isComputeRstd</td><td>输入</td><td>是否计算标准差的倒数rstd。用于Tiling中区分选择的LayerNorm API。</td></tr><tr><td>isOnlyOutput</td><td>输入</td><td>是否只输出y，不输出均值mean与标准差的倒数rstd。当前该参数仅支持false，y、mean和rstd的结果全都输出。</td></tr><tr><td>maxValue</td><td>输出</td><td>输出LayerNorm接口所需的tiling信息（最大临时空间大小）。 LayerNorm接口能完成计算所需的最大临时空间大小，超出该值的空间不会被该接口使用。在最小临时空间-最大临时空间范围内，随着临时空间增大，kernel侧接口计算性能会有一定程度的优化提升。为了达到更好的性能，开发者可以根据实际的内存使用情况进行空间预留/申请。 说明： maxValue仅作为参考值，有可能大于Unified Buffer剩余空间的大小，该场景下，开发者需要根据Unified Buffer剩余空间的大小来选取合适的临时空间大小。</td></tr><tr><td>minValue</td><td>输出</td><td>输出LayerNorm接口所需的tiling信息（最小临时空间大小）。 LayerNorm接口能完成计算所需最小临时空间大小。为保证功能正确，接口计算时预留/申请的临时空间不能小于该数值。</td></tr></tbody></table><p><strong>表 2</strong> GetLayerNormNDTilingInfo和GetLayerNormNDTillingInfo接口参数列表</p><table tabindex="0"><thead><tr><th>参数名称</th><th>输入/输出</th><th>含义</th></tr></thead><tbody><tr><td>srcShape</td><td>输入</td><td>输出归一化结果、均值和方差的LayerNorm接口： 输入数据inputX的shape信息{B, S, storageHLength, originHLength}，包括当前输入的inputX的shape信息，以及地址对齐前（如存在H轴补齐操作）的原有shape信息。 输出归一化结果、均值和标准差的倒数的LayerNorm接口： 输入数据inputX的shape信息{A, R}，A轴长度可以在kernel接口中动态指定，但范围不能超过此参数中A的大小。</td></tr><tr><td>stackBufferSize</td><td>输入</td><td>可供LayerNorm接口使用的空间大小，单位Byte。</td></tr><tr><td>typeSize</td><td>输入</td><td>输入的数据类型大小，单位为字节。比如输入的数据类型为half，此处应传入2。</td></tr><tr><td>isReuseSource</td><td>输入</td><td>是否可以复用inputX的内存空间。</td></tr><tr><td>isComputeRstd</td><td>输入</td><td>是否计算标准差的倒数rstd。用于Tiling中区分选择的LayerNorm API。</td></tr><tr><td>tilling</td><td>输出</td><td>输入数据的切分信息。</td></tr></tbody></table><h2 id="返回值说明" tabindex="-1">返回值说明 <a class="header-anchor" href="#返回值说明" aria-label="Permalink to &quot;返回值说明&quot;">​</a></h2><p>无</p><h2 id="约束说明" tabindex="-1">约束说明 <a class="header-anchor" href="#约束说明" aria-label="Permalink to &quot;约束说明&quot;">​</a></h2><p>无</p><h2 id="调用示例" tabindex="-1">调用示例 <a class="header-anchor" href="#调用示例" aria-label="Permalink to &quot;调用示例&quot;">​</a></h2><p>如下样例介绍了使用输出方差的LayerNorm高阶API时，host侧获取Tiling参数的流程以及该参数如何在kernel侧使用。样例中输入Tensor的shape大小为[2, 16, 64]，输入的数据类型为half。</p><ol><li><p>将LayerNormTiling结构体参数增加至TilingData结构体，作为TilingData结构体的一个字段。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>BEGIN_TILING_DATA_DEF(TilingData)               // 注册一个tiling的类，以tiling的名字作为入参</span></span>
<span class="line"><span>  TILING_DATA_FIELD_DEF(uint32_t, totalLength); // 添加tiling字段，总计算数据量</span></span>
<span class="line"><span>  TILING_DATA_FIELD_DEF(uint32_t, tileNum);     // 添加tiling字段，每个核上总计算数据分块个数</span></span>
<span class="line"><span>  ...                                           // 添加其他tiling字段</span></span>
<span class="line"><span>  TILING_DATA_FIELD_DEF_STRUCT(LayerNormTiling, layernormTilingData); // 将LayerNormTiling结构体参数增加至TilingData结构体</span></span>
<span class="line"><span>END_TILING_DATA_DEF;</span></span></code></pre></div></li><li><p>Tiling实现函数中，首先调用GetLayerNormMaxMinTmpSize接口获取LayerNorm接口能完成计算所需最大/最小临时空间大小，根据该范围结合实际的内存使用情况设置合适的空间大小，然后调用GetLayerNormNDTilingInfo接口根据输入shape、剩余的可供计算的空间大小等信息获取LayerNorm kernel侧接口所需tiling参数。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>namespace optiling {</span></span>
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
<span class="line"><span>    ...</span></span>
<span class="line"><span>    // {B, S, storageHLength, originHLength}</span></span>
<span class="line"><span>    std::vector&lt;int64_t&gt; shapeVec = {2, 16, 64, 64};</span></span>
<span class="line"><span>    ge::Shape srcShape(shapeVec);</span></span>
<span class="line"><span>    // 本样例中仅作为样例说明，通过GetLayerNormMaxMinTmpSize获取最小值并传入，来保证功能正确，开发者可以根据需要传入合适的空间大小</span></span>
<span class="line"><span>    uint32_t max;</span></span>
<span class="line"><span>    uint32_t min;</span></span>
<span class="line"><span>    AscendC::GetLayerNormMaxMinTmpSize(srcShape, sizeof(half), false, max, min);</span></span>
<span class="line"><span>    // 获取Layernorm Tiling参数</span></span>
<span class="line"><span>    AscendC::GetLayerNormNDTilingInfo(srcShape, min, sizeof(half), false, tiling.layernormTilingData); </span></span>
<span class="line"><span>     ... // 其他逻辑</span></span>
<span class="line"><span>    tiling.SaveToBuffer(context-&gt;GetRawTilingData()-&gt;GetData(), context-&gt;GetRawTilingData()-&gt;GetCapacity());</span></span>
<span class="line"><span>    context-&gt;GetRawTilingData()-&gt;SetDataSize(tiling.GetDataSize());</span></span>
<span class="line"><span>    context-&gt;SetTilingKey(1);</span></span>
<span class="line"><span>    return ge::GRAPH_SUCCESS;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>} // namespace optiling</span></span></code></pre></div></li><li><p>对应的kernel侧通过在核函数中调用GET_TILING_DATA获取TilingData，继而将TilingData中的LayerNormTiling信息传入LayerNorm接口参与计算。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>extern &quot;C&quot; __global__ __aicore__ void func_custom(GM_ADDR x, GM_ADDR y, GM_ADDR z, GM_ADDR workspace, GM_ADDR tiling)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    GET_TILING_DATA(tilingData, tiling);</span></span>
<span class="line"><span>    KernelFunc op;</span></span>
<span class="line"><span>    op.Init(x, y, z, tilingData.totalLength, tilingData.tileNum,tilingData.layernormTilingData);</span></span>
<span class="line"><span>    if (TILING_KEY_IS(1)) {</span></span>
<span class="line"><span>        op.Process();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div></li></ol><p>如下样例介绍了使用输出标准差的倒数的LayerNorm高阶API时，host侧获取Tiling参数的流程以及该参数如何在kernel侧使用。样例中输入Tensor的shape大小为[2, 64]，输入的数据类型为half。</p><ol><li><p>将LayerNormTiling结构体参数增加至TilingData结构体，作为TilingData结构体的一个字段。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>BEGIN_TILING_DATA_DEF(TilingData)                         // 注册一个tiling的类，以tiling的名字作为入参</span></span>
<span class="line"><span>  TILING_DATA_FIELD_DEF(uint32_t, aLength);                // 添加tiling字段，a轴长度</span></span>
<span class="line"><span>  TILING_DATA_FIELD_DEF(uint32_t, rLengthWithPadding);     // 添加tiling字段，r轴对齐32B后的长度</span></span>
<span class="line"><span>  ...                                                     // 添加其他tiling字段</span></span>
<span class="line"><span>  TILING_DATA_FIELD_DEF_STRUCT(LayerNormSeparateTiling, layernormTilingData); // 将LayerNormSeparateTiling结构体参数增加至TilingData结构体</span></span>
<span class="line"><span>END_TILING_DATA_DEF;</span></span></code></pre></div></li><li><p>Tiling实现函数中，首先调用GetLayerNormMaxMinTmpSize接口获取LayerNorm接口能完成计算所需最大/最小临时空间大小，根据该范围结合实际的内存使用情况设置合适的空间大小，然后调用GetLayerNormNDTilingInfo接口根据输入shape、剩余的可供计算的空间大小等信息获取LayerNorm kernel侧接口所需tiling参数。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>namespace optiling {</span></span>
<span class="line"><span>const uint32_t NUM_BLOCKS = 1;</span></span>
<span class="line"><span>const uint32_t TILE_NUM = 8;</span></span>
<span class="line"><span>static ge::graphStatus TilingFunc(gert::TilingContext* context)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    TilingData tiling;</span></span>
<span class="line"><span>    uint32_t totalLength = context-&gt;GetInputTensor(0)-&gt;GetShapeSize();</span></span>
<span class="line"><span>    context-&gt;SetBlockDim(NUM_BLOCKS);</span></span>
<span class="line"><span>    tiling.set_totalLength(totalLength);</span></span>
<span class="line"><span>    tiling.set_tileNum(TILE_NUM);</span></span>
<span class="line"><span>    // 设置其他Tiling参数</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    // {A, R}</span></span>
<span class="line"><span>    std::vector&lt;int64_t&gt; shapeVec = {2, 64};</span></span>
<span class="line"><span>    ge::Shape srcShape(shapeVec);</span></span>
<span class="line"><span>    // 本样例中仅作为样例说明，通过GetLayerNormMaxMinTmpSize获取最小值并传入，来保证功能正确，开发者可以根据需要传入合适的空间大小</span></span>
<span class="line"><span>    uint32_t max;</span></span>
<span class="line"><span>    uint32_t min;</span></span>
<span class="line"><span>    AscendC::GetLayerNormMaxMinTmpSize(srcShape, sizeof(half), false, true, false, max, min);</span></span>
<span class="line"><span>    // 获取Layernorm Tiling参数</span></span>
<span class="line"><span>    AscendC::GetLayerNormNDTilingInfo(srcShape, min, sizeof(half), false, true, tiling.layernormTilingData); </span></span>
<span class="line"><span>    // auto ascendcPlatform = platform_ascendc::PlatformAscendC(context-&gt;GetPlatformInfo());</span></span>
<span class="line"><span>    // AscendC::GetLayerNormMaxMinTmpSize(srcShape, sizeof(half), false, true, false, ascendcPlatform, max, min);</span></span>
<span class="line"><span>    // 获取Layernorm Tiling参数</span></span>
<span class="line"><span>    // AscendC::GetLayerNormNDTilingInfo(srcShape, min, sizeof(half), false, true, ascendcPlatform, tiling.layernormTilingData);</span></span>
<span class="line"><span>     ... // 其他逻辑</span></span>
<span class="line"><span>    tiling.SaveToBuffer(context-&gt;GetRawTilingData()-&gt;GetData(), context-&gt;GetRawTilingData()-&gt;GetCapacity());</span></span>
<span class="line"><span>    context-&gt;GetRawTilingData()-&gt;SetDataSize(tiling.GetDataSize());</span></span>
<span class="line"><span>    context-&gt;SetTilingKey(1);</span></span>
<span class="line"><span>    return ge::GRAPH_SUCCESS;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>} // namespace optiling</span></span></code></pre></div></li><li><p>对应的kernel侧通过在核函数中调用GET_TILING_DATA获取TilingData，继而将TilingData中的LayerNormTiling信息传入LayerNorm接口参与计算。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>extern &quot;C&quot; __global__ __aicore__ void func_custom(GM_ADDR x, GM_ADDR gamma, GM_ADDR beta, GM_ADDR mean, GM_ADDR rstd, GM_ADDR y, GM_ADDR workspace, GM_ADDR tiling)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    GET_TILING_DATA(tilingData, tiling);</span></span>
<span class="line"><span>    float epsilon = tilingData.epsilon;</span></span>
<span class="line"><span>    AscendC::LayerNormPara para(tilingData.aLength, tilingData.rLengthWithPadding);</span></span>
<span class="line"><span>    KernelFunc op;</span></span>
<span class="line"><span>    op.Init(x, gamma, beta, mean, rstd, y, epsilon, para, tilingData.layernormTilingData);</span></span>
<span class="line"><span>    if (TILING_KEY_IS(1)) {</span></span>
<span class="line"><span>        op.Process();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div></li></ol>`,22)])])}const m=a(i,[["render",p]]);export{u as __pageData,m as default};
