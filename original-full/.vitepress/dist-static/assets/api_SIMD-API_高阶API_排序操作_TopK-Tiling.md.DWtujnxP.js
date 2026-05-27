import{c as s,Q as a,j as t,m as p}from"./chunks/framework.DOi4mjdC.js";const _=JSON.parse('{"title":"TopK Tiling","description":"","frontmatter":{},"headers":[{"level":1,"title":"TopK Tiling","slug":"topk-tiling"},{"level":2,"title":"功能说明","slug":"功能说明"},{"level":2,"title":"函数原型","slug":"函数原型"},{"level":2,"title":"参数说明","slug":"参数说明"},{"level":2,"title":"返回值说明","slug":"返回值说明"},{"level":2,"title":"约束说明","slug":"约束说明"},{"level":2,"title":"调用示例","slug":"调用示例"}],"relativePath":"api/SIMD-API/高阶API/排序操作/TopK-Tiling.md","filePath":"api/SIMD-API/高阶API/排序操作/TopK-Tiling.md"}'),e={name:"api/SIMD-API/高阶API/排序操作/TopK-Tiling.md"};function i(l,n,o,c,r,d){return a(),t("div",null,[...n[0]||(n[0]=[p(`<h1 id="topk-tiling" tabindex="-1">TopK Tiling <a class="header-anchor" href="#topk-tiling" aria-label="Permalink to &quot;TopK Tiling&quot;">​</a></h1><h2 id="功能说明" tabindex="-1">功能说明 <a class="header-anchor" href="#功能说明" aria-label="Permalink to &quot;功能说明&quot;">​</a></h2><p>用于获取TopK Tiling参数。</p><p>Ascend C提供TopK Tiling API，方便用户获取TopK kernel计算时所需的Tiling参数。</p><p>获取Tiling参数主要分为如下两步：</p><ol><li><p>获取TopK接口计算所需最小和最大临时空间大小，注意该步骤不是必须的，只是作为一个参考，供合理分配计算空间。</p></li><li><p>获取TopK kernel侧接口所需tiling参数。</p><p>TopK Tiling结构体的定义如下，开发者无需关注该tiling结构的具体信息，只需要传递到kernel侧，传入TopK高阶API接口，直接进行使用即可。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct TopkTiling {</span></span>
<span class="line"><span>    int32_t tmpLocalSize = 0;</span></span>
<span class="line"><span>    int32_t allDataSize = 0;</span></span>
<span class="line"><span>    int32_t innerDataSize = 0;</span></span>
<span class="line"><span>    uint32_t sortRepeat = 0;</span></span>
<span class="line"><span>    int32_t mrgSortRepeat = 0;</span></span>
<span class="line"><span>    int32_t kAlignFourBytes = 0;</span></span>
<span class="line"><span>    int32_t kAlignTwoBytes = 0;</span></span>
<span class="line"><span>    int32_t maskOffset = 0;</span></span>
<span class="line"><span>    int32_t maskVreducev2FourBytes = 0;</span></span>
<span class="line"><span>    int32_t maskVreducev2TwoBytes = 0;</span></span>
<span class="line"><span>    int32_t mrgSortSrc1offset = 0;</span></span>
<span class="line"><span>    int32_t mrgSortSrc2offset = 0;</span></span>
<span class="line"><span>    int32_t mrgSortSrc3offset = 0;</span></span>
<span class="line"><span>    int32_t mrgSortTwoQueueSrc1Offset = 0;</span></span>
<span class="line"><span>    int32_t mrgFourQueueTailPara1 = 0;</span></span>
<span class="line"><span>    int32_t mrgFourQueueTailPara2 = 0;</span></span>
<span class="line"><span>    int32_t srcIndexOffset = 0;</span></span>
<span class="line"><span>    uint32_t copyUbToUbBlockCount = 0;</span></span>
<span class="line"><span>    int32_t topkMrgSrc1MaskSizeOffset = 0;</span></span>
<span class="line"><span>    int32_t topkNSmallSrcIndexOffset = 0;</span></span>
<span class="line"><span>    uint32_t vreduceValMask0 = 0;</span></span>
<span class="line"><span>    uint32_t vreduceValMask1 = 0;</span></span>
<span class="line"><span>    uint32_t vreduceIdxMask0 = 0;</span></span>
<span class="line"><span>    uint32_t vreduceIdxMask1 = 0;</span></span>
<span class="line"><span>    uint16_t vreducehalfValMask0 = 0;</span></span>
<span class="line"><span>    uint16_t vreducehalfValMask1 = 0;</span></span>
<span class="line"><span>    uint16_t vreducehalfValMask2 = 0;</span></span>
<span class="line"><span>    uint16_t vreducehalfValMask3 = 0;</span></span>
<span class="line"><span>    uint16_t vreducehalfValMask4 = 0;</span></span>
<span class="line"><span>    uint16_t vreducehalfValMask5 = 0;</span></span>
<span class="line"><span>    uint16_t vreducehalfValMask6 = 0;</span></span>
<span class="line"><span>    uint16_t vreducehalfValMask7 = 0;    </span></span>
<span class="line"><span>};</span></span></code></pre></div></li></ol><h2 id="函数原型" tabindex="-1">函数原型 <a class="header-anchor" href="#函数原型" aria-label="Permalink to &quot;函数原型&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>bool GetTopKMaxMinTmpSize(const platform_ascendc::PlatformAscendC&amp; ascendcPlatform, const int32_t inner, const int32_t outter, const bool isReuseSource, const bool isInitIndex, enum TopKMode mode, const bool isLargest, const uint32_t dataTypeSize, uint32_t&amp; maxValue, uint32_t&amp; minValue)</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>bool GetTopKMaxMinTmpSize(const int32_t inner, const int32_t outter, const int32_t k, const bool isReuseSource, const bool isInitIndex, enum TopKMode mode, const bool isLargest, ge::DataType dataType, const TopKConfig&amp; config, uint32_t&amp; maxValue, uint32_t&amp; minValue)</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>bool TopKTilingFunc(const platform_ascendc::PlatformAscendC&amp; ascendcPlatform, const int32_t inner, const int32_t outter, const int32_t k, const uint32_t dataTypeSize, const bool isInitIndex, enum TopKMode mode, const bool isLargest, optiling::TopkTiling&amp; topKTiling)</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>bool TopKTilingFunc(const platform_ascendc::PlatformAscendC&amp; ascendcPlatform, const int32_t inner, const int32_t outter, const int32_t k, const uint32_t dataTypeSize, const bool isInitIndex, enum TopKMode mode, const bool isLargest, AscendC::tiling::TopkTiling&amp; topKTiling)</span></span></code></pre></div><h2 id="参数说明" tabindex="-1">参数说明 <a class="header-anchor" href="#参数说明" aria-label="Permalink to &quot;参数说明&quot;">​</a></h2><p><strong>表 1</strong> GetTopKMaxMinTmpSize接口参数列表</p><table tabindex="0"><thead><tr><th>接口</th><th>输入/输出</th><th>功能</th></tr></thead><tbody><tr><td>ascendcPlatform</td><td>输入</td><td>传入硬件平台的信息，PlatformAscendC定义请参见构造及析构函数。</td></tr><tr><td>inner</td><td>输入</td><td>表示TopK接口输入srcLocal的内轴长度，该参数的取值为32的整数倍。</td></tr><tr><td>outter</td><td>输入</td><td>表示TopK接口输入srcLocal的外轴长度。</td></tr><tr><td>k</td><td>输入</td><td>获取前k个最大值或最小值及其对应的索引。</td></tr><tr><td>isReuseSource</td><td>输入</td><td>中间变量是否能够复用输入内存。与kernel侧接口的isReuseSrc保持一致。</td></tr><tr><td>isInitIndex</td><td>输入</td><td>是否传入输入数据对应的索引，与kernel侧接口一致。</td></tr><tr><td>mode</td><td>输入</td><td>选择TopKMode::TOPK_NORMAL模式或者TopKMode::TOPK_NSMALL模式，与kernel侧接口一致。</td></tr><tr><td>isLargest</td><td>输入</td><td>表示降序/升序，true表示降序，false表示升序。与kernel侧接口一致。</td></tr><tr><td>dataType</td><td>输入</td><td>表示待排序数据的数据类型。该参数的取值与Kernel接口参数srcLocal的数据类型保持一致。</td></tr><tr><td>config</td><td>输入</td><td>TopK计算的相关配置，包括算法选择、取最大值或最小值、是否对结果排序。该参数的配置需要与TopK Kernel接口模板参数的配置保持一致。 algo：选择的排序算法。默认为MERGE_SORT算法，当前仅支持RADIX_SELECT算法，用户需要显式指定algo为TopKAlgo::RADIX_SELECT。order：表示获取前k个最大值或者获取前k个最小值，取值如下：UNSET：默认值，按照函数参数isLargest的配置实现。isLargest为true时，取前k个最大值及其对应的索引，isLargest为false，取前k个最小值及其对应的索引。LARGEST：表示取前k个最大值及其对应的索引。取值为LARGEST时，函数参数isLargest的配置不生效。SMALLEST：表示取前k个最小值及其对应的索引。取值为SMALLEST时，函数参数isLargest的配置不生效。 sorted：表示是否对输出结果进行排序。取值为true，对输出结果进行排序；取值为false，不对输出结果进行排序。 &lt;pre class=&quot;screen&quot; codetype=&quot;Cpp&quot; id=&quot;screen1563331371317&quot;&gt;struct TopKConfig { TopKAlgo algo = TopKAlgo::MERGE_SORT; TopKOrder order = TopKOrder::UNSET; bool sorted = true; }; enum class TopKAlgo { RADIX_SELECT, MERGE_SORT }; enum class TopKOrder { UNSET, LARGEST, SMALLEST };&lt;/pre&gt;</td></tr><tr><td>dataTypeSize</td><td>输入</td><td>参与计算的srcLocal数据类型的大小，比如half=2， float=4</td></tr><tr><td>maxValue</td><td>输出</td><td>TopK接口内部完成计算需要的最大临时空间大小，单位是Byte。 说明： maxValue仅作为参考值，有可能大于Unified Buffer剩余空间的大小，该场景下，开发者需要根据Unified Buffer剩余空间的大小来选取合适的临时空间大小。</td></tr><tr><td>minValue</td><td>输出</td><td>TopK接口内部完成计算需要的最小临时空间大小，单位是Byte。</td></tr></tbody></table><p><strong>表 2</strong> TopKTilingFunc接口参数列表</p><table tabindex="0"><thead><tr><th>接口</th><th>输入/输出</th><th>功能</th></tr></thead><tbody><tr><td>ascendcPlatform</td><td>输入</td><td>传入硬件平台的信息，PlatformAscendC定义请参见构造及析构函数。</td></tr><tr><td>inner</td><td>输入</td><td>表示TopK接口输入srcLocal的内轴长度，该参数的取值为32的整数倍。</td></tr><tr><td>outter</td><td>输入</td><td>表示TopK接口输入srcLocal的外轴长度。</td></tr><tr><td>k</td><td>输入</td><td>获取前k个最大值或最小值及其对应的索引。</td></tr><tr><td>dataTypeSize</td><td>输入</td><td>参与计算的srcLocal数据类型的大小，比如half=2， float=4。</td></tr><tr><td>isInitIndex</td><td>输入</td><td>是否传入输入数据对应的索引，与kernel侧接口一致。</td></tr><tr><td>mode</td><td>输入</td><td>选择TopKMode::TOPK_NORMAL模式或者TopKMode::TOPK_NSMALL模式，与kernel侧接口一致。</td></tr><tr><td>isLargest</td><td>输入</td><td>表示降序/升序，true表示降序，false表示升序。与kernel侧接口一致。</td></tr><tr><td>topKTiling</td><td>输出</td><td>输出TopK接口所需的tiling信息。</td></tr></tbody></table><h2 id="返回值说明" tabindex="-1">返回值说明 <a class="header-anchor" href="#返回值说明" aria-label="Permalink to &quot;返回值说明&quot;">​</a></h2><p>GetTopKMaxMinTmpSize返回值为true/false，true表示成功拿到TopK接口内部计算需要的最大和最小临时空间大小；false表示获取失败。</p><p>TopKTilingFunc返回值为true/false，true表示成功拿到TopK的Tiling各项参数值；false表示获取失败。</p><h2 id="约束说明" tabindex="-1">约束说明 <a class="header-anchor" href="#约束说明" aria-label="Permalink to &quot;约束说明&quot;">​</a></h2><p>无</p><h2 id="调用示例" tabindex="-1">调用示例 <a class="header-anchor" href="#调用示例" aria-label="Permalink to &quot;调用示例&quot;">​</a></h2><p>如下样例介绍了使用TopK高阶API时host侧获取Tiling参数的流程以及该参数如何在kernel侧使用。</p><ol><li><p>将TopK Tiling结构体参数增加至TilingData结构体，作为TilingData结构体的一个字段。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>namespace optiling {</span></span>
<span class="line"><span>BEGIN_TILING_DATA_DEF(TilingData)</span></span>
<span class="line"><span>    TILING_DATA_FIELD_DEF(uint32_t, totalLength);</span></span>
<span class="line"><span>    TILING_DATA_FIELD_DEF(uint32_t, tilenum);</span></span>
<span class="line"><span>    //添加其他tiling字段</span></span>
<span class="line"><span>    ...                                </span></span>
<span class="line"><span>    TILING_DATA_FIELD_DEF(int32_t, k);</span></span>
<span class="line"><span>    TILING_DATA_FIELD_DEF(bool, islargest);</span></span>
<span class="line"><span>    TILING_DATA_FIELD_DEF(bool, isinitindex);</span></span>
<span class="line"><span>    TILING_DATA_FIELD_DEF(bool, ishasfinish);</span></span>
<span class="line"><span>    TILING_DATA_FIELD_DEF(uint32_t, tmpsize);</span></span>
<span class="line"><span>    TILING_DATA_FIELD_DEF(int32_t, outter);</span></span>
<span class="line"><span>    TILING_DATA_FIELD_DEF(int32_t, inner);</span></span>
<span class="line"><span>    TILING_DATA_FIELD_DEF(int32_t, n);</span></span>
<span class="line"><span>    TILING_DATA_FIELD_DEF(int32_t, order);</span></span>
<span class="line"><span>    TILING_DATA_FIELD_DEF(int32_t, sorted);</span></span>
<span class="line"><span>    TILING_DATA_FIELD_DEF_STRUCT(TopkTiling, topkTilingData);</span></span>
<span class="line"><span>END_TILING_DATA_DEF;</span></span>
<span class="line"><span>REGISTER_TILING_DATA_CLASS(TopkCustom, TilingData)</span></span>
<span class="line"><span>}</span></span></code></pre></div></li><li><p>Tiling实现函数中，首先调用GetTopKMaxMinTmpSize接口获取TopK接口能完成计算所需最大/最小临时空间大小，根据该范围结合实际的内存使用情况设置合适的空间大小；然后根据输入shape等信息获取TopK kernel侧接口所需tiling参数。MERGE_SORT算法参考如下调用示例。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>namespace optiling {</span></span>
<span class="line"><span>const uint32_t NUM_BLOCKS = 8;</span></span>
<span class="line"><span>const uint32_t TILE_NUM = 8;</span></span>
<span class="line"><span>const int32_t OUTTER = 2;</span></span>
<span class="line"><span>const int32_t INNER = 32;</span></span>
<span class="line"><span>const int32_t N = 32;</span></span>
<span class="line"><span>const int32_t K = 8;</span></span>
<span class="line"><span>const bool IS_LARGEST = true;</span></span>
<span class="line"><span>const bool IS_INITINDEX = true;</span></span>
<span class="line"><span>const bool IS_REUSESOURCE = false;</span></span>
<span class="line"><span>static ge::graphStatus TilingFunc(gert::TilingContext* context)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    TilingData tiling;</span></span>
<span class="line"><span>    uint32_t totalLength = context-&gt;GetInputTensor(0)-&gt;GetShapeSize();</span></span>
<span class="line"><span>    context-&gt;SetBlockDim(NUM_BLOCKS);</span></span>
<span class="line"><span>    tiling.set_totalLength(totalLength);</span></span>
<span class="line"><span>    tiling.set_tileNum(TILE_NUM);</span></span>
<span class="line"><span>    tiling.set_k(K);</span></span>
<span class="line"><span>    tiling.set_outter(OUTTER);</span></span>
<span class="line"><span>    tiling.set_inner(INNER);</span></span>
<span class="line"><span>    tiling.set_n(N);</span></span>
<span class="line"><span>    tiling.set_islargest(IS_LARGEST);</span></span>
<span class="line"><span>    tiling.set_isinitindex(IS_INITINDEX);</span></span>
<span class="line"><span>    // 设置其他Tiling参数</span></span>
<span class="line"><span>    ... </span></span>
<span class="line"><span>    // 本样例中仅作为样例说明，通过GetTopKMaxMinTmpSize获取最小值并传入，来保证功能正确，开发者可以根据需要传入合适的空间大小。</span></span>
<span class="line"><span>    uint32_t maxsize = 0;</span></span>
<span class="line"><span>    uint32_t minsize = 0;</span></span>
<span class="line"><span>    uint32_t dtypesize = 4;  // float类型</span></span>
<span class="line"><span>    auto ascendcPlatform = platform_ascendc::PlatformAscendC(context-&gt;GetPlatformInfo());</span></span>
<span class="line"><span>    AscendC::TopKTilingFunc(ascendcPlatform, tiling.inner, tiling.outter, tiling.k, dtypesize, tiling.isinitindex, AscendC::TopKMode::TOPK_NSMALL, tiling.islargest, tiling.topkTilingData);</span></span>
<span class="line"><span>    AscendC::GetTopKMaxMinTmpSize(ascendcPlatform, tiling.inner, tiling.outter, IS_REUSESOURCE, tiling.isinitindex, AscendC::TopKMode::TOPK_NSMALL, tiling.islargest, dtypesize, maxsize, minsize);</span></span>
<span class="line"><span>    tiling.set_tmpsize(minsize);</span></span>
<span class="line"><span>     ... // 其他逻辑</span></span>
<span class="line"><span>    tiling.SaveToBuffer(context-&gt;GetRawTilingData()-&gt;GetData(), context-&gt;GetRawTilingData()-&gt;GetCapacity());</span></span>
<span class="line"><span>    context-&gt;GetRawTilingData()-&gt;SetDataSize(tiling.GetDataSize());</span></span>
<span class="line"><span>    size_t *currentWorkspace = context-&gt;GetWorkspaceSizes(1);</span></span>
<span class="line"><span>    currentWorkspace[0] = 0;</span></span>
<span class="line"><span>    return ge::GRAPH_SUCCESS;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>} // namespace optiling</span></span></code></pre></div><p>RADIX_SELECT算法参考如下调用示例。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>namespace optiling</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    static ge::graphStatus TilingFunc(gert::TilingContext *context)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        std::map&lt;ge::DataType, uint32_t&gt; dtypeSizes = {</span></span>
<span class="line"><span>            {ge::DataType::DT_UINT32, 4},</span></span>
<span class="line"><span>            {ge::DataType::DT_INT32, 4}</span></span>
<span class="line"><span>        };</span></span>
<span class="line"><span>        RadixtopkCustomTilingData tiling;</span></span>
<span class="line"><span>        const gert::RuntimeAttrs *attrs = context-&gt;GetAttrs();</span></span>
<span class="line"><span>        const uint32_t is_init_index = *(attrs-&gt;GetAttrPointer&lt;uint32_t&gt;(0));</span></span>
<span class="line"><span>        const uint32_t is_reuse_src = *(attrs-&gt;GetAttrPointer&lt;uint32_t&gt;(1));</span></span>
<span class="line"><span>        const uint32_t order = *(attrs-&gt;GetAttrPointer&lt;uint32_t&gt;(2));</span></span>
<span class="line"><span>        const uint32_t is_largest = *(attrs-&gt;GetAttrPointer&lt;uint32_t&gt;(3));</span></span>
<span class="line"><span>        const uint32_t outter = *(attrs-&gt;GetAttrPointer&lt;uint32_t&gt;(4));</span></span>
<span class="line"><span>        const uint32_t inner = *(attrs-&gt;GetAttrPointer&lt;uint32_t&gt;(5));</span></span>
<span class="line"><span>        const uint32_t n = *(attrs-&gt;GetAttrPointer&lt;uint32_t&gt;(6));</span></span>
<span class="line"><span>        const uint32_t k = *(attrs-&gt;GetAttrPointer&lt;uint32_t&gt;(7));</span></span>
<span class="line"><span>        const uint32_t k_pad = *(attrs-&gt;GetAttrPointer&lt;uint32_t&gt;(8));</span></span>
<span class="line"><span>        const uint32_t sorted = *(attrs-&gt;GetAttrPointer&lt;uint32_t&gt;(9));</span></span>
<span class="line"><span>        const uint32_t top_mode = *(attrs-&gt;GetAttrPointer&lt;uint32_t&gt;(10));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        auto xDType = context-&gt;GetInputTensor(0)-&gt;GetDataType();</span></span>
<span class="line"><span>        uint32_t typeSize = dtypeSizes.at(xDType);</span></span>
<span class="line"><span>        AscendC::TopKConfig config;</span></span>
<span class="line"><span>        config.algo = AscendC::TopKAlgo::RADIX_SELECT;</span></span>
<span class="line"><span>        if (order == 1) {</span></span>
<span class="line"><span>            config.order = AscendC::TopKOrder::LARGEST;</span></span>
<span class="line"><span>        } else if (order == 2) {</span></span>
<span class="line"><span>            config.order = AscendC::TopKOrder::SMALLEST;</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            config.order = AscendC::TopKOrder::UNSET;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if (sorted == 0) {</span></span>
<span class="line"><span>            config.sorted = false;</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            config.sorted = true;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        uint32_t maxValue = 0;</span></span>
<span class="line"><span>        uint32_t minValue = 0;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>        if (top_mode == 0) {</span></span>
<span class="line"><span>            AscendC::GetTopKMaxMinTmpSize(inner, outter, k, is_reuse_src, is_init_index, AscendC::TopKMode::TOPK_NORMAL, is_largest, xDType, config, maxValue, minValue);</span></span>
<span class="line"><span>            context-&gt;SetTilingKey(0);</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            AscendC::GetTopKMaxMinTmpSize(inner, outter, k, is_reuse_src, is_init_index, AscendC::TopKMode::TOPK_NSMALL, is_largest, xDType, config, maxValue, minValue);</span></span>
<span class="line"><span>            context-&gt;SetTilingKey(1);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        context-&gt;SetBlockDim(1);</span></span>
<span class="line"><span>        tiling.set_is_init_index(is_init_index);</span></span>
<span class="line"><span>        tiling.set_is_reuse_src(is_reuse_src);</span></span>
<span class="line"><span>        tiling.set_order(order);</span></span>
<span class="line"><span>        tiling.set_is_largest(is_largest);</span></span>
<span class="line"><span>        tiling.set_outter(outter);</span></span>
<span class="line"><span>        tiling.set_inner(inner);</span></span>
<span class="line"><span>        tiling.set_n(n);</span></span>
<span class="line"><span>        tiling.set_k(k);</span></span>
<span class="line"><span>        tiling.set_k_pad(k_pad);</span></span>
<span class="line"><span>        tiling.set_sorted(sorted);</span></span>
<span class="line"><span>        tiling.set_top_mode(top_mode);</span></span>
<span class="line"><span>        tiling.SaveToBuffer(context-&gt;GetRawTilingData()-&gt;GetData(), context-&gt;GetRawTilingData()-&gt;GetCapacity());</span></span>
<span class="line"><span>        context-&gt;GetRawTilingData()-&gt;SetDataSize(tiling.GetDataSize());</span></span>
<span class="line"><span>        size_t *currentWorkspace = context-&gt;GetWorkspaceSizes(1);</span></span>
<span class="line"><span>        currentWorkspace[0] = 0;</span></span>
<span class="line"><span>        return ge::GRAPH_SUCCESS;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>} // namespace optiling</span></span></code></pre></div></li><li><p>对应的kernel侧通过在核函数中调用GET_TILING_DATA获取TilingData，继而将TilingData中的TopK Tiling信息传入TopK接口参与计算。完整的kernel侧样例请参考<a href="./TopK.html#section94691236101419">调用示例</a>。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>extern &quot;C&quot; __global__ __aicore__ void topk_custom(GM_ADDR srcVal, GM_ADDR srcIdx, GM_ADDR finishLocal, GM_ADDR dstVal, GM_ADDR dstIdx, GM_ADDR tiling)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    GET_TILING_DATA(tilingData, tiling);</span></span>
<span class="line"><span>    KernelTopK&lt;float, true, true, false, false, AscendC::TopKMode::TOPK_NSMALL&gt; op;</span></span>
<span class="line"><span>    op.Init(srcVal, srcIdx, finishLocal, dstVal, dstIdx, tilingData.k, tilingData.islargest, tilingData.tmpsize, tilingData.outter, tilingData.inner, tilingData.n,tilingData.topkTilingData);</span></span>
<span class="line"><span>    op.Process();</span></span>
<span class="line"><span>}</span></span></code></pre></div></li></ol>`,24)])])}const T=s(e,[["render",i]]);export{_ as __pageData,T as default};
