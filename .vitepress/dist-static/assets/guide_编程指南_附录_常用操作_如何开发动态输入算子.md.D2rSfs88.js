import{c as n,Q as a,j as e,m as p}from"./chunks/framework.DOi4mjdC.js";const u=JSON.parse('{"title":"如何开发动态输入算子","description":"","frontmatter":{},"headers":[{"level":1,"title":"如何开发动态输入算子","slug":"如何开发动态输入算子"}],"relativePath":"guide/编程指南/附录/常用操作/如何开发动态输入算子.md","filePath":"guide/编程指南/附录/常用操作/如何开发动态输入算子.md"}'),t={name:"guide/编程指南/附录/常用操作/如何开发动态输入算子.md"};function i(l,s,c,o,r,_){return a(),e("div",null,[...s[0]||(s[0]=[p(`<h1 id="如何开发动态输入算子" tabindex="-1">如何开发动态输入算子 <a class="header-anchor" href="#如何开发动态输入算子" aria-label="Permalink to &quot;如何开发动态输入算子&quot;">​</a></h1><p>动态输入算子是指算子的输入个数是动态的，例如AddN，将N个输入tensor累加到一起，输出一个tensor，输入tensor的个数是不固定的。动态输入算子的开发在构造和解析输入数据方面有差异：核函数的入参采用ListTensorDesc的结构存储输入数据信息，对应的，调用时需构造TensorList结构保存参数信息。下面基于kernel直调和工程化算子开发两种开发方式分别介绍具体开发流程。</p><div class="note custom-block github-alert"><p class="custom-block-title">说明</p><p>下文仅列出代码片段，完整样例请参考<a href="https://gitcode.com/cann/asc-devkit/tree/master/examples/01_simd_cpp_api/02_features/03_basic_api/04_resource_management/list_tensor_desc_input" target="_blank" rel="noreferrer">动态输入算子样例</a>。</p></div><ul><li><p>kernel直调</p><ul><li><p>参考<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/ListTensorDesc.md" target="_blank" rel="noreferrer">ListTensorDesc</a>数据结构自行定义ListTensorDesc和TensorDesc结构体，并将实际的输入数据保存至ListTensorDesc结构中。示例如下:</p><p>ptrOffset传入为ListTensorDesc首地址和数据指针首地址dataPtr之间的偏移量，tensorDesc中保存两个输入的tensor描述信息， dataPtr传入为保存输入数据的地址指针。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    constexpr uint32_t SHAPE_DIM = 2;</span></span>
<span class="line"><span>    struct TensorDesc {</span></span>
<span class="line"><span>        uint32_t dim{SHAPE_DIM};</span></span>
<span class="line"><span>        uint32_t index;</span></span>
<span class="line"><span>        uint64_t shape[SHAPE_DIM] = {8, 2048};</span></span>
<span class="line"><span>    };</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    TensorDesc xDesc;</span></span>
<span class="line"><span>    xDesc.index = 0;</span></span>
<span class="line"><span>    TensorDesc yDesc;</span></span>
<span class="line"><span>    yDesc.index = 1;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    constexpr uint32_t TENSOR_DESC_NUM = 2;</span></span>
<span class="line"><span>    struct ListTensorDesc {</span></span>
<span class="line"><span>        uint64_t ptrOffset;</span></span>
<span class="line"><span>        TensorDesc tensorDesc[TENSOR_DESC_NUM];</span></span>
<span class="line"><span>        uintptr_t dataPtr[TENSOR_DESC_NUM];</span></span>
<span class="line"><span>    } inputDesc;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    inputDesc = {(1 + (1 + SHAPE_DIM) * TENSOR_DESC_NUM) * sizeof(uint64_t), {xDesc, yDesc}, {(uintptr_t)xDevice, (uintptr_t)yDevice}};</span></span></code></pre></div></li><li><p>kernel侧调用时，直接传入ListTensorDesc表达的输入信息。示例如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    // Allocate ListTensorDesc device memory</span></span>
<span class="line"><span>    ret = aclrtMalloc((void **)&amp;inputDescInDevice, sizeof(ListTensorDesc), ACL_MEM_MALLOC_HUGE_FIRST);</span></span>
<span class="line"><span>    assert(ret == ACL_SUCCESS &amp;&amp; &quot;aclrtMalloc inputDescInDevice failed!&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Copy ListTensorDesc to device</span></span>
<span class="line"><span>    ret = aclrtMemcpy(inputDescInDevice, sizeof(ListTensorDesc), &amp;inputDesc, sizeof(ListTensorDesc),</span></span>
<span class="line"><span>                        ACL_MEMCPY_HOST_TO_DEVICE);</span></span>
<span class="line"><span>    assert(ret == ACL_SUCCESS &amp;&amp; &quot;aclrtMemcpy inputDesc to device failed!&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    list_tensor_desc_input_custom&lt;&lt;&lt;numBlocks, nullptr, stream&gt;&gt;&gt;(inputDescInDevice, zDevice, tiling);</span></span></code></pre></div></li><li><p>kernel侧算子实现，入参需传入动态结构的数据（srcList），并使用AscendC::ListTensorDesc结构做解析。示例如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>__global__ __vector__ void list_tensor_desc_input_custom(GM_ADDR srcList, GM_ADDR z, AddCustomTilingData tiling)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    AscendC::ListTensorDesc keyListTensorDescInit((__gm__ void*)srcList);</span></span>
<span class="line"><span>    GM_ADDR x = (__gm__ uint8_t*)keyListTensorDescInit.GetDataPtr&lt;__gm__ uint8_t&gt;(0);</span></span>
<span class="line"><span>    GM_ADDR y = (__gm__ uint8_t*)keyListTensorDescInit.GetDataPtr&lt;__gm__ uint8_t&gt;(1);</span></span>
<span class="line"><span>}</span></span></code></pre></div></li></ul></li><li><p>工程化算子开发</p><ul><li><p>单算子调用时，构造List类型tensor并传入。</p><p>使用aclCreateTensor创建tensor后，需调用aclCreateTensorList，将创建好的tensor组成List形式，如下所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>inputTensorList = aclCreateTensorList(inputTensor_.data(), inputTensor_.size());</span></span></code></pre></div><p>获取算子使用的workspace空间大小接口的入参，也需使用aclTensorList结构参数，用来计算workspace的大小，调用示例如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 获取算子使用的workspace空间大小</span></span>
<span class="line"><span>aclnnStatus aclnnAddNCustomGetWorkspaceSize(const aclTensorList *srcList, const aclTensor *out, uint64_t *workspaceSize, aclOpExecutor **executor);</span></span></code></pre></div></li><li><p>算子原型定义中，输入数据的参数类型设置为动态，示例如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>this-&gt;Input(&quot;srcList&quot;)</span></span>
<span class="line"><span>    .ParamType(DYNAMIC)</span></span>
<span class="line"><span>    .DataType({ge::DT_FLOAT16})</span></span>
<span class="line"><span>    .Format({ge::FORMAT_ND});</span></span></code></pre></div></li><li><p>host侧算子实现，获取动态输入信息的接口，需使用对应的动态接口。</p><p>例如，Tiling函数和InferShape函数中，GetDynamicInputShape接口用于获取动态输入的shape信息，InferDataType函数中，GetDynamicInputDataType接口用于获取动态输入的数据类型，示例如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>namespace ge {</span></span>
<span class="line"><span>static graphStatus InferShape(gert::InferShapeContext *context)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    const gert::Shape *x1_shape = context-&gt;GetDynamicInputShape(0, 0);</span></span>
<span class="line"><span>    gert::Shape *y_shape = context-&gt;GetOutputShape(0);</span></span>
<span class="line"><span>    *y_shape = *x1_shape;</span></span>
<span class="line"><span>    return GRAPH_SUCCESS;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static graphStatus InferDataType(gert::InferDataTypeContext *context)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    const auto inputDataType = context-&gt;GetDynamicInputDataType(0, 0);</span></span>
<span class="line"><span>    context-&gt;SetOutputDataType(0, inputDataType);</span></span>
<span class="line"><span>    return ge::GRAPH_SUCCESS;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>} // namespace ge</span></span></code></pre></div></li><li><p>kernel侧算子实现，入参需传入动态结构的数据，并使用AscendC::ListTensorDesc结构做解析。</p><p>核函数入参需传入动态结构的数据，例如GM_ADDR srcList，示例如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>extern &quot;C&quot; __global__ __aicore__ void addn_custom(GM_ADDR srcList, GM_ADDR z, GM_ADDR workspace, GM_ADDR tiling)</span></span></code></pre></div><p>对传入的参数srcList，需使用AscendC::ListTensorDesc结构做解析，得到每个tensor的具体信息，示例如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>AscendC::ListTensorDesc keyListTensorDescInit((__gm__ void*)srcList);</span></span>
<span class="line"><span>GM_ADDR x = (__gm__ uint8_t*)keyListTensorDescInit.GetDataPtr&lt;__gm__ uint8_t&gt;(0);</span></span>
<span class="line"><span>GM_ADDR y = (__gm__ uint8_t*)keyListTensorDescInit.GetDataPtr&lt;__gm__ uint8_t&gt;(1);</span></span></code></pre></div></li></ul></li></ul>`,4)])])}const D=n(t,[["render",i]]);export{u as __pageData,D as default};
