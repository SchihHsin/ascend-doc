import{c as s,Q as a,j as p,m as _}from"./chunks/framework.DOi4mjdC.js";const D=JSON.parse('{"title":"Tiling模板编程","description":"","frontmatter":{},"headers":[{"level":1,"title":"Tiling模板编程","slug":"tiling模板编程"}],"relativePath":"guide/编程指南/高级编程/高级特性/Aclnn算子工程化开发/Host侧Tiling实现/Tiling模板编程.md","filePath":"guide/编程指南/高级编程/高级特性/Aclnn算子工程化开发/Host侧Tiling实现/Tiling模板编程.md"}'),l={name:"guide/编程指南/高级编程/高级特性/Aclnn算子工程化开发/Host侧Tiling实现/Tiling模板编程.md"};function e(t,n,i,T,c,L){return a(),p("div",null,[...n[0]||(n[0]=[_(`<h1 id="tiling模板编程" tabindex="-1">Tiling模板编程 <a class="header-anchor" href="#tiling模板编程" aria-label="Permalink to &quot;Tiling模板编程&quot;">​</a></h1><p>在<a href="./基本流程.html">TilingKey编程</a>章节介绍的TilingKey编程方式中，TilingKey不易于记忆和理解，因为它们通常是较长又没有明确含义的数字。</p><p>在涉及多个TilingKey的场景中，开发者依赖TilingKey来管理kernel的实现，无论是在管理还是使用上都会遇到相当大的复杂性。为了简化这一过程，可以采用模板编程的方法来替代传统的TilingKey编程，从而减少对TilingKey数值标识的依赖，使kernel的管理更加直观和高效。使用步骤如下，完整样例请参考<a href="https://gitee.com/ascend/samples/tree/master/operator/ascendc/0_introduction/6_addtemplate_frameworklaunch" target="_blank" rel="noreferrer">Tiling模板编程样例</a>。</p><ol><li><p>在<a href="./../../Aclnn算子工程化开发/概述.html">自定义算子工程</a>的op_kernel目录下，新增定义模板参数和模板参数组合的头文件，本示例中头文件命名为tiling_key_add_custom.h。</p><ul><li>该头文件中需要包含模板头文件ascendc/host_api/tiling/template_argument.h。</li><li>定义模板参数ASCENDC_TPL_ARGS_DECL和模板参数组合ASCENDC_TPL_ARGS_SEL（即可使用的模板）。具体API参考见<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/%E6%A8%A1%E6%9D%BF%E5%8F%82%E6%95%B0%E5%AE%9A%E4%B9%89.md" target="_blank" rel="noreferrer">模板参数定义</a>。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &quot;ascendc/host_api/tiling/template_argument.h&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 模板参数</span></span>
<span class="line"><span>ASCENDC_TPL_ARGS_DECL(AddCustomTemplate, // 算子OpType</span></span>
<span class="line"><span>ASCENDC_TPL_DATATYPE_DECL(D_T_X, C_DT_FLOAT, C_DT_FLOAT16, ASCENDC_TPL_INPUT(0)),  // DataType类型的模板参数定义：输入参数x的数据类型，取值范围为float16/float32, ASCENDC_TPL_INPUT(0)说明对应Kernel侧第0个输入</span></span>
<span class="line"><span>ASCENDC_TPL_DATATYPE_DECL(D_T_Y, C_DT_FLOAT, C_DT_FLOAT16, ASCENDC_TPL_INPUT(1)),  // DataType类型的模板参数定义：输入参数y的数据类型，取值范围为float16/float32, ASCENDC_TPL_INPUT(1)说明对应Kernel侧第1个输入</span></span>
<span class="line"><span>ASCENDC_TPL_DATATYPE_DECL(D_T_Z, C_DT_FLOAT, C_DT_FLOAT16, ASCENDC_TPL_OUTPUT(0)), // DataType类型的模板参数定义：输入参数z的数据类型，取值范围为float16/float32, ASCENDC_TPL_OUTPUT(0)说明对应Kernel侧第0个输出</span></span>
<span class="line"><span>ASCENDC_TPL_UINT_DECL(TILE_NUM, ASCENDC_TPL_8_BW, ASCENDC_TPL_UI_MIX, 2, 0, 2, 3, 5, 10, 12, 13, 9, 8),// 自定义UINT类型（无符号整形）的模板参数定义：模板参数为切分的块数，编码位宽为ASCENDC_TPL_8_BW即8比特，表示该模板参数的个数不超过8比特能表达的范围；ASCENDC_TPL_UI_MIX表示通过混合模式表达取值范围，有2组的数据{0-2}、{3-5}和穷举值10、12、13、9、8，最后结果为{0, 1, 2, 3, 4, 5, 10, 12, 13, 9, 8}</span></span>
<span class="line"><span>ASCENDC_TPL_BOOL_DECL(IS_SPLIT, 0, 1), // 自定义bool类型的模板参数定义：模板参数为是否切分标志位，取值范围为0和1，1表示切分，0表示不切分</span></span>
<span class="line"><span>);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 模板参数组合</span></span>
<span class="line"><span>// 用于调用GET_TPL_TILING_KEY获取TilingKey时，接口内部校验TilingKey是否合法</span></span>
<span class="line"><span>ASCENDC_TPL_SEL(</span></span>
<span class="line"><span>    ASCENDC_TPL_ARGS_SEL(</span></span>
<span class="line"><span>    ASCENDC_TPL_KERNEL_TYPE_SEL(ASCENDC_TPL_AIV_ONLY), // Kernel类型选择，无需在模板参数声明中定义，在SEL中直接配置，所有ASCENDC_TPL_ARGS_SEL是否配置需要保持统一，如不配置将走自动推导流程</span></span>
<span class="line"><span>    ASCENDC_TPL_DATATYPE_SEL(D_T_X, C_DT_FLOAT16),</span></span>
<span class="line"><span>    ASCENDC_TPL_DATATYPE_SEL(D_T_Y, C_DT_FLOAT16),</span></span>
<span class="line"><span>    ASCENDC_TPL_DATATYPE_SEL(D_T_Z, C_DT_FLOAT16),</span></span>
<span class="line"><span>    ASCENDC_TPL_UINT_SEL(TILE_NUM, ASCENDC_TPL_UI_LIST, 1, 8),</span></span>
<span class="line"><span>    ASCENDC_TPL_BOOL_SEL(IS_SPLIT, 0, 1)</span></span>
<span class="line"><span>    ),</span></span>
<span class="line"><span>    ASCENDC_TPL_ARGS_SEL(</span></span>
<span class="line"><span>    ASCENDC_TPL_KERNEL_TYPE_SEL(ASCENDC_TPL_AIV_ONLY),</span></span>
<span class="line"><span>    ASCENDC_TPL_DATATYPE_SEL(D_T_X, C_DT_FLOAT),</span></span>
<span class="line"><span>    ASCENDC_TPL_DATATYPE_SEL(D_T_Y, C_DT_FLOAT),</span></span>
<span class="line"><span>    ASCENDC_TPL_DATATYPE_SEL(D_T_Z, C_DT_FLOAT),</span></span>
<span class="line"><span>    ASCENDC_TPL_UINT_SEL(TILE_NUM, ASCENDC_TPL_UI_LIST, 1, 8),</span></span>
<span class="line"><span>    ASCENDC_TPL_BOOL_SEL(IS_SPLIT, 0, 1)</span></span>
<span class="line"><span>    ),</span></span>
<span class="line"><span>);</span></span></code></pre></div><p>当不同模板参数组合需要使用不同的Tiling结构体时，可以在对应的ASCENDC_TPL_ARGS_SEL中增加ASCENDC_TPL_TILING_STRUCT_SEL接口。例如：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ASCENDC_TPL_SEL(</span></span>
<span class="line"><span>    ASCENDC_TPL_ARGS_SEL(</span></span>
<span class="line"><span>    ASCENDC_TPL_KERNEL_TYPE_SEL(ASCENDC_TPL_AIV_ONLY),</span></span>
<span class="line"><span>    ASCENDC_TPL_DATATYPE_SEL(D_T_X, C_DT_FLOAT16),</span></span>
<span class="line"><span>    ASCENDC_TPL_DATATYPE_SEL(D_T_Y, C_DT_FLOAT16),</span></span>
<span class="line"><span>    ASCENDC_TPL_DATATYPE_SEL(D_T_Z, C_DT_FLOAT16),</span></span>
<span class="line"><span>    ASCENDC_TPL_UINT_SEL(TILE_NUM, ASCENDC_TPL_UI_LIST, 1, 8),</span></span>
<span class="line"><span>    ASCENDC_TPL_BOOL_SEL(IS_SPLIT, 0),</span></span>
<span class="line"><span>    ASCENDC_TPL_TILING_STRUCT_SEL(SplitTilingData)</span></span>
<span class="line"><span>    ),</span></span>
<span class="line"><span>    ASCENDC_TPL_ARGS_SEL(</span></span>
<span class="line"><span>    ASCENDC_TPL_KERNEL_TYPE_SEL(ASCENDC_TPL_AIV_ONLY),</span></span>
<span class="line"><span>    ASCENDC_TPL_DATATYPE_SEL(D_T_X, C_DT_FLOAT16),</span></span>
<span class="line"><span>    ASCENDC_TPL_DATATYPE_SEL(D_T_Y, C_DT_FLOAT16),</span></span>
<span class="line"><span>    ASCENDC_TPL_DATATYPE_SEL(D_T_Z, C_DT_FLOAT16),</span></span>
<span class="line"><span>    ASCENDC_TPL_UINT_SEL(TILE_NUM, ASCENDC_TPL_UI_LIST, 1, 8),</span></span>
<span class="line"><span>    ASCENDC_TPL_BOOL_SEL(IS_SPLIT, 1)</span></span>
<span class="line"><span>    ),</span></span>
<span class="line"><span>);</span></span></code></pre></div><p>上述接口仅用于为当前模板参数组合指定Tiling结构体，不作为kernel的模板参数传入，也不参与ASCENDC_TPL_SEL_PARAM或GET_TPL_TILING_KEY的参数顺序。未配置ASCENDC_TPL_TILING_STRUCT_SEL的模板参数组合，将使用REGISTER_TILING_DEFAULT注册的默认Tiling结构体；使用该接口时，必须提供默认Tiling结构体。kernel侧可通过GET_TILING_DATA_WITH_STRUCT(TilingStructName, tiling_data, tiling)读取指定结构体对应的tiling数据。</p></li><li><p>host侧调用ASCENDC_TPL_SEL_PARAM接口自动生成并配置TilingKey。</p><ul><li>host实现文件中包含<a href="#li1949014102516">步骤1</a>中定义模板参数和模板参数组合的头文件。</li><li>调用ASCENDC_TPL_SEL_PARAM接口自动生成并配置TilingKey，ASCENDC_TPL_SEL_PARAM输入参数为模板参数的具体值，传入时需要与定义模板参数和模板参数组合的头文件中的模板参数顺序保持一致。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &quot;tiling_key_add_custom.h&quot;</span></span>
<span class="line"><span>static ge::graphStatus TilingFunc(gert::TilingContext *context)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    TilingData tiling;</span></span>
<span class="line"><span>    uint32_t totalLength = context-&gt;GetInputShape(0)-&gt;GetOriginShape().GetShapeSize();</span></span>
<span class="line"><span>    ge::DataType dtype_x = context-&gt;GetInputDesc(0)-&gt;GetDataType();</span></span>
<span class="line"><span>    ge::DataType dtype_y = context-&gt;GetInputDesc(1)-&gt;GetDataType();</span></span>
<span class="line"><span>    ge::DataType dtype_z = context-&gt;GetOutputDesc(1)-&gt;GetDataType();</span></span>
<span class="line"><span>    uint32_t D_T_X = static_cast&lt;int&gt;(dtype_x), D_T_Y = static_cast&lt;int&gt;(dtype_y), D_T_Z = static_cast&lt;int&gt;(dtype_z), TILE_NUM = 1, IS_SPLIT = 0;</span></span>
<span class="line"><span>    if(totalLength&lt; MIN_LENGTH_FOR_SPLIT){</span></span>
<span class="line"><span>        IS_SPLIT = 0;</span></span>
<span class="line"><span>        TILE_NUM = 1;</span></span>
<span class="line"><span>    }else{</span></span>
<span class="line"><span>        IS_SPLIT = 1;</span></span>
<span class="line"><span>        TILE_NUM = DEFAULT_TILE_NUM;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    context-&gt;SetBlockDim(NUM_BLOCKS);</span></span>
<span class="line"><span>    tiling.set_totalLength(totalLength);</span></span>
<span class="line"><span>    tiling.SaveToBuffer(context-&gt;GetRawTilingData()-&gt;GetData(), context-&gt;GetRawTilingData()-&gt;GetCapacity());</span></span>
<span class="line"><span>    context-&gt;GetRawTilingData()-&gt;SetDataSize(tiling.GetDataSize());</span></span>
<span class="line"><span>    ASCENDC_TPL_SEL_PARAM(context, D_T_X, D_T_Y, D_T_Z, TILE_NUM, IS_SPLIT);</span></span>
<span class="line"><span>    size_t *currentWorkspace = context-&gt;GetWorkspaceSizes(1);</span></span>
<span class="line"><span>    currentWorkspace[0] = 0;</span></span>
<span class="line"><span>    return ge::GRAPH_SUCCESS;</span></span>
<span class="line"><span>}</span></span></code></pre></div></li><li><p>kernel侧实现</p><ul><li>kernel实现文件中包含<a href="#li1949014102516">步骤1</a>中定义模板参数和模板参数组合的头文件。</li><li>核函数添加template模板，以便支持模板参数的传入，参数顺序需要与定义模板参数和模板参数组合的头文件中的模板参数顺序保持一致。</li><li>通过对模板参数的分支判断，选择不同的kernel侧实现。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &quot;tiling_key_add_custom.h&quot;</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span>template&lt;typename D_T_X, typename D_T_Y, typename D_T_Z, int TILE_NUM, int IS_SPLIT&gt;</span></span>
<span class="line"><span> __global__ __aicore__ void add_custom_template(GM_ADDR x, GM_ADDR y, GM_ADDR z, GM_ADDR workspace, GM_ADDR tiling)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    GET_TILING_DATA(tiling_data, tiling);</span></span>
<span class="line"><span>    KernelAdd&lt;D_T_X, D_T_Y, D_T_Z&gt; op;</span></span>
<span class="line"><span>    op.Init(x, y, z, tiling_data.totalLength, TILE_NUM);</span></span>
<span class="line"><span>    if constexpr (std::is_same_v&lt;D_T_X, float&gt; &amp;&amp; std::is_same_v&lt;D_T_Y, float&gt; &amp;&amp; std::is_same_v&lt;D_T_Z, float&gt;) {</span></span>
<span class="line"><span>        op.Process1();</span></span>
<span class="line"><span>    } else if constexpr (std::is_same_v&lt;D_T_X, half&gt; &amp;&amp; std::is_same_v&lt;D_T_Y, half&gt; &amp;&amp; std::is_same_v&lt;D_T_Z, half&gt;){</span></span>
<span class="line"><span>        if (IS_SPLIT == 0) {</span></span>
<span class="line"><span>            op.Process1();</span></span>
<span class="line"><span>        } else if(IS_SPLIT == 1) {</span></span>
<span class="line"><span>            op.Process2();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div></li></ol><div class="note custom-block github-alert"><p class="custom-block-title">说明</p><p>Tiling模板编程场景下，编译时，可以通过<a href="./../算子包编译/算子工程编译.html">--kernel-template-input</a>编译选项配置仅编译指定的模板参数组合相关的Kernel代码，用于加速编译过程。</p></div>`,5)])])}const E=s(l,[["render",e]]);export{D as __pageData,E as default};
