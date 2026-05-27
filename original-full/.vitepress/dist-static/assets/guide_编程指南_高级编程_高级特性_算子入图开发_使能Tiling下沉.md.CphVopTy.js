import{c as s,Q as a,j as p,m as i}from"./chunks/framework.DOi4mjdC.js";const r=JSON.parse('{"title":"使能Tiling下沉","description":"","frontmatter":{},"headers":[{"level":1,"title":"使能Tiling下沉","slug":"使能tiling下沉"}],"relativePath":"guide/编程指南/高级编程/高级特性/算子入图开发/使能Tiling下沉.md","filePath":"guide/编程指南/高级编程/高级特性/算子入图开发/使能Tiling下沉.md"}'),l={name:"guide/编程指南/高级编程/高级特性/算子入图开发/使能Tiling下沉.md"};function e(t,n,c,o,g,_){return a(),p("div",null,[...n[0]||(n[0]=[i(`<h1 id="使能tiling下沉" tabindex="-1">使能Tiling下沉 <a class="header-anchor" href="#使能tiling下沉" aria-label="Permalink to &quot;使能Tiling下沉&quot;">​</a></h1><p>在静态图模式下，可以通过<strong>整图下沉</strong>优化调度性能。将完整的计算图一次性下发至Device侧，后续执行则无需Host参与，由Device自主完成计算，从而减少Host-Device交互开销，提升执行效率。部分算子的Tiling计算依赖运行时输入的具体数值（<strong>Tiling值依赖</strong>），需在执行时动态计算Tiling参数。针对该场景，可采用<strong>Tiling下沉</strong>优化方案：将Tiling计算下沉至Device侧的AI CPU上执行，从而实现计算全程在Device侧高效完成。</p><div class="note custom-block github-alert"><p class="custom-block-title">说明</p><p></p><ul><li>基于新版本CANN包（支持Tiling下沉特性）编译生成的Tiling下沉算子，不兼容旧版CANN（不支持Tiling下沉特性）运行环境。</li><li>当前仅融合算子（矢量计算和矩阵计算融合）支持进行Tiling下沉。</li><li>Tiling下沉功能仅支持如下产品型号： <ul><li>Atlas A3 训练系列产品/Atlas A3 推理系列产品</li><li>Atlas A2 训练系列产品/Atlas A2 推理系列产品</li><li>Ascend 950PR/Ascend 950DT，暂不支持</li></ul></li></ul></div><p>自定义算子使能Tiling下沉的步骤如下，完整样例请参考<a href="https://gitcode.com/cann/asc-devkit/tree/master/examples/01_simd_cpp_api/02_features/00_compilation/custom_op" target="_blank" rel="noreferrer">Tiling下沉算子样例</a>。</p><p>Tiling下沉场景下，算子工程的op_host目录结构如下，Tiling实现文件需单独放在在一个cpp文件中，示例中为add_custom_tiling_sink_tiling.cpp。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>├── op_host</span></span>
<span class="line"><span>│   ├── add_custom_tiling_sink.cpp // 算子原型定义、InferShape、InferDataType实现</span></span>
<span class="line"><span>│   ├── add_custom_tiling_sink_tiling.cpp // Tiling函数实现</span></span>
<span class="line"><span>│   ├── add_custom_tiling_sink_tiling.h // TilingData结构体定义、Tiling函数声明</span></span>
<span class="line"><span>│   └── CMakeLists.txt</span></span></code></pre></div><p>以AddCustom算子为例，讲解关键代码文件的具体实现方法如下：</p><ul><li><p>在add_custom_tiling_sink_tiling.h中进行Tiling实现函数的声明</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#ifndef ADD_CUSTOM_TILING_SINK_TILING_H</span></span>
<span class="line"><span>#define ADD_CUSTOM_TILING_SINK_TILING_H</span></span>
<span class="line"><span>#include &quot;register/op_def_registry.h&quot;</span></span>
<span class="line"><span>namespace optiling {</span></span>
<span class="line"><span>    ge::graphStatus AddCustomSinkTilingFunc(gert::TilingContext* context); // Tiling函数声明</span></span>
<span class="line"><span>} // namespace optiling</span></span>
<span class="line"><span>#endif</span><span> // ADD_CUSTOM_TILING_SINK_TILING_H</span></span></code></pre></div></li><li><p>算子原型定义、InferShape、InferDataType实现文件add_custom_tiling_sink.cpp，需包含add_custom_tiling_sink_tiling.h，进行Tiling函数和算子原型定义的关联。</p><p>Tiling下沉仅适用于存在Tiling值依赖（即当InferShape不依赖输入值，仅Tiling计算需要输入值）且算子输入为非Const类型的场景，本示例中的输入y通过ValueDepend配置了非Const类型的Tiling值依赖。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &quot;add_custom_tiling_sink_tiling.h&quot;</span><span> // 包含头文件</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// ...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>namespace ops {</span></span>
<span class="line"><span>class AddCustomTilingSink : public OpDef {</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    explicit AddCustomTilingSink(const char *name) : OpDef(name)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        this-&gt;Input(&quot;x&quot;)</span></span>
<span class="line"><span>            .ParamType(REQUIRED)</span></span>
<span class="line"><span>            .DataType({ge::DT_FLOAT})</span></span>
<span class="line"><span>            .Format({ge::FORMAT_ND});</span></span>
<span class="line"><span>        this-&gt;Input(&quot;y&quot;)</span></span>
<span class="line"><span>            .ParamType(REQUIRED)</span></span>
<span class="line"><span>            .DataType({ge::DT_FLOAT})</span></span>
<span class="line"><span>            .Format({ge::FORMAT_ND})</span></span>
<span class="line"><span>            .ValueDepend(OPTIONAL, DependScope::TILING); // 表示输入y为Tiling值依赖</span></span>
<span class="line"><span>        this-&gt;Output(&quot;z&quot;)</span></span>
<span class="line"><span>            .ParamType(REQUIRED)</span></span>
<span class="line"><span>            .DataType({ge::DT_FLOAT})</span></span>
<span class="line"><span>            .Format({ge::FORMAT_ND});</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        this-&gt;SetInferShape(ge::InferShape).SetInferDataType(ge::InferDataType);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        this-&gt;AICore().SetTiling(optiling::AddCustomSinkTilingFunc); // Tiling函数和算子原型定义的关联</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>        // 请替换为实际的昇腾AI处理器型号</span></span>
<span class="line"><span>        this-&gt;AICore().AddConfig(&quot;ascendxxx&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span>OP_ADD(AddCustomTilingSink);</span></span>
<span class="line"><span>} // namespace ops</span></span></code></pre></div></li><li><p>Tiling函数的实现文件add_custom_tiling_sink_tiling.cpp</p><ul><li>Tiling函数中通过判断值依赖InputTensor即输入y的数据指针是否为空指针来确认当前是否处于编译期。Tiling下沉场景，编译期需要为算子分配内存，包括其所需的workspace。为了保证运行时的高效性，编译期应根据算子的执行需求，合理设置所需的workspace最大值，以避免内存不足或浪费。AddCustomTilingSink样例不需要用户workspace，不涉及设置，此处设置为固定值仅作为示例。</li><li>完成下沉Tiling函数注册：包含device_op_impl_registry.h头文件，使用宏DEVICE_IMPL_OP_OPTILING进行注册。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &quot;../../op_kernel/add_custom_tiling_sink/add_custom_tiling_sink_tiling_struct.h&quot;</span></span>
<span class="line"><span>#include &quot;add_custom_tiling_sink_tiling.h&quot;</span></span>
<span class="line"><span>#include &quot;register/device_op_impl_registry.h&quot;</span></span>
<span class="line"><span>#include &quot;tiling/platform/platform_ascendc.h&quot;</span></span>
<span class="line"><span>namespace optiling {</span></span>
<span class="line"><span>static constexpr uint32_t NUM_BLOCKS = 8;</span></span>
<span class="line"><span>static constexpr uint32_t TILE_NUM = 3;</span></span>
<span class="line"><span>static constexpr size_t MAX_WORKSPACE_SIZE = 32; // 算子所需用户workspace空间最大值，AddCustomTilingSink算子本身逻辑无需用户workspace空间，此处设置为固定值仅作为示例</span></span>
<span class="line"><span>static constexpr size_t DEFAULT_WORKSPACE_SIZE = 0;</span></span>
<span class="line"><span>ge::graphStatus AddCustomSinkTilingFunc(gert::TilingContext *context)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    TilingSinkTilingData *tiling = context-&gt;GetTilingData&lt;TilingSinkTilingData&gt;();</span></span>
<span class="line"><span>    uint32_t totalLength = context-&gt;GetInputTensor(0)-&gt;GetShapeSize();</span></span>
<span class="line"><span>    context-&gt;SetBlockDim(NUM_BLOCKS);</span></span>
<span class="line"><span>    tiling-&gt;totalLength = totalLength;</span></span>
<span class="line"><span>    tiling-&gt;tileNum = TILE_NUM;</span></span>
<span class="line"><span>    size_t *currentWorkspace = context-&gt;GetWorkspaceSizes(1);</span></span>
<span class="line"><span>    auto platform = platform_ascendc::PlatformAscendC(context-&gt;GetPlatformInfo());</span></span>
<span class="line"><span>    size_t sysWorkspaceSize = platform.GetLibApiWorkSpaceSize();</span></span>
<span class="line"><span>    currentWorkspace[0] = sysWorkspaceSize + DEFAULT_WORKSPACE_SIZE; // 设置运行时workspace大小，此处为系统workspace空间 + 用户workspace空间</span></span>
<span class="line"><span>    if (context-&gt;GetInputTensor(1) != nullptr &amp;&amp; context-&gt;GetInputTensor(1)-&gt;GetData&lt;float&gt;() == nullptr) {</span></span>
<span class="line"><span>        // 通过判断值依赖InputTensor的Data是否为空指针来确认当前是否处于编译期。</span></span>
<span class="line"><span>        // Tiling下沉场景，编译期需要为算子分配内存，包括其所需的workspace。为了保证运行时的高效性，编译期应根据算子的执行需求，合理设置所需的workspace最大值，以避免内存不足或浪费。</span></span>
<span class="line"><span>        currentWorkspace[0] = sysWorkspaceSize + MAX_WORKSPACE_SIZE; // 设置编译期workspace大小，此处为系统workspace空间 + 用户workspace空间最大值</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return ge::GRAPH_SUCCESS;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>DEVICE_IMPL_OP_OPTILING(AddCustomTilingSink).Tiling(optiling::AddCustomSinkTilingFunc); // 下沉tiling函数注册</span></span>
<span class="line"><span>} // namespace optiling</span></span></code></pre></div></li><li><p>算子核函数实现</p><p>当前Tiling下沉仅支持融合算子，为了模拟融合算子场景，通过<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/%E8%AE%BE%E7%BD%AEKernel%E7%B1%BB%E5%9E%8B.md" target="_blank" rel="noreferrer">KERNEL_TASK_TYPE_DEFAULT</a>接口强制指定算子在AIC、AIV混合场景运行。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>extern &quot;C&quot; __global__ __aicore__ void add_custom_tiling_sink(GM_ADDR x, GM_ADDR y, GM_ADDR z, GM_ADDR workspace, GM_ADDR tiling)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    REGISTER_TILING_DEFAULT(TilingSinkTilingData);</span></span>
<span class="line"><span>    GET_TILING_DATA(tiling_data, tiling);</span></span>
<span class="line"><span>    KERNEL_TASK_TYPE_DEFAULT(KERNEL_TYPE_MIX_AIC_1_2); // 将算子强制指定在AIC、AIV混合场景运行，模拟融合算子场景</span></span>
<span class="line"><span>    if ASCEND_IS_AIC {</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    AscendC::KernelAdd op;</span></span>
<span class="line"><span>    op.Init(x, y, z, tiling_data.totalLength, tiling_data.tileNum);</span></span>
<span class="line"><span>    op.Process();</span></span>
<span class="line"><span>}</span></span></code></pre></div></li><li><p>修改op_host目录下的编译脚本CMakeLists.txt，添加Tiling下沉编译命令。具体代码如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>npu_op_device_tiling_library(cust_opmaster SHARED  # 任务名称，固定为cust_opmaster</span></span>
<span class="line"><span>    add_custom_tiling_sink/add_custom_tiling_sink_tiling.cpp  # Tiling函数实现代码源文件</span></span>
<span class="line"><span>)</span></span></code></pre></div></li></ul>`,8)])])}const u=s(l,[["render",e]]);export{r as __pageData,u as default};
