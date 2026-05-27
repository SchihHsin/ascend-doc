import{c as a,Q as n,j as p,m as e}from"./chunks/framework.DOi4mjdC.js";const t="/assets/shape%E4%B8%8Edatatype%E6%8E%A8%E5%AF%BC%E7%A4%BA%E6%84%8F%E5%9B%BE.Cw9KZlC3.png",_=JSON.parse(`{"title":"基本开发流程","description":"","frontmatter":{},"headers":[{"level":1,"title":"基本开发流程","slug":"基本开发流程"},{"level":2,"title":"datatype推导","slug":"datatype推导"},{"level":2,"title":"shape推导","slug":"shape推导"},{"level":2,"title":"InferShapeRange实现","slug":"infershaperange实现"},{"level":1,"title":"tensor 'x' is [1, 1, 2, 4, 4, 4, 7, 8, 8]               x shape[9]","slug":"tensor-x-is-1-1-2-4-4-4-7-8-8-x-shape9"},{"level":2,"title":"InferShape时获取属性、输入","slug":"infershape时获取属性输入"},{"level":2,"title":"数据依赖","slug":"数据依赖"}],"relativePath":"guide/编程指南/高级编程/高级特性/算子入图开发/基本开发流程.md","filePath":"guide/编程指南/高级编程/高级特性/算子入图开发/基本开发流程.md"}`),l={name:"guide/编程指南/高级编程/高级特性/算子入图开发/基本开发流程.md"};function i(c,s,o,h,r,g){return n(),p("div",null,[...s[0]||(s[0]=[e('<h1 id="基本开发流程" tabindex="-1">基本开发流程 <a class="header-anchor" href="#基本开发流程" aria-label="Permalink to &quot;基本开发流程&quot;">​</a></h1><p>该开发流程以<a href="./../Aclnn算子工程化开发/概述.html">工程化算子开发</a>为基础，除了需要提供工程化算子开发中的算子实现文件外，还需要额外交付算子入图的代码文件。本节仅提供算子入图代码文件的开发指导。</p><p>假设下图是我们需要使用的网络模型，您可能会想直接逐个算子调用，根据输入tensor得到输出tensor就可以完成网络的运行，但在图模式场景下，实际的网络模型生成过程中，会先进行tensor shape以及datatype的推导。这样可以让我们在图执行之前，就知道各tensor的数据类型和形状，提前校验其正确性；同时提前推理出算子的输出张量描述，包括张量的形状、数据类型及数据排布格式等信息，算子构图准备阶段就可以为所有的张量静态分配内存，避免动态内存分配带来的开销。</p><p>下面的网络模型经过shape和datatype推导之后，可以得到灰色底纹框中的推导信息：</p><p><strong>图 1</strong> shape与datatype推导示意图<br><img src="'+t+`" alt="" title="shape与datatype推导示意图"></p><p>除了tiling实现外，算子入图时需要额外提供的实现代码有以下几种：</p><ul><li>datatype推导：根据算子的输入datatype、算子逻辑及算子属性等信息，推理出算子的输出张量datatype。</li><li>shape推导：根据算子的输入shape、算子逻辑及算子属性等信息，推理出算子的输出张量shape。</li><li>ShapeRange推导：编译时无法推导输出shape，只能推导输出shape range，执行完才能得出输出shape。 在下发时需要按照输出shape range来申请最大输出内存，该类算子需要提供ShapeRange推导函数。</li><li>声明数据依赖：部分算子在InferShape时，需要依赖某个输入的具体值才可以进行，这类算子被称为“数据依赖算子”，对应的输入被称为“数据依赖输入”。该类算子在注册时，需要声明其数据依赖输入。</li></ul><p>下表列出了不同类型的算子对上述实现代码的要求。</p><p><strong>表 1</strong> 不同的类型的算子对入图实现代码的要求</p><p>&lt;table&gt;&lt;thead align=&quot;left&quot;&gt;&lt;tr&gt;&lt;th class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;35.8%&quot;&gt;&lt;p&gt;分类&lt;/p&gt; &lt;/th&gt; &lt;th class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;64.2%&quot;&gt;&lt;p&gt;对入图实现代码的要求&lt;/p&gt; &lt;/th&gt; &lt;/tr&gt; &lt;/thead&gt; &lt;tbody&gt;&lt;tr&gt;&lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;35.8%&quot;&gt;&lt;p&gt;根据输入shape可以推导出输出shape。&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;64.2%&quot;&gt;&lt;ul&gt;&lt;li&gt;shape推导&lt;/li&gt;&lt;li&gt;datatype推导&lt;/li&gt;&lt;/ul&gt; &lt;/td&gt; &lt;/tr&gt; &lt;tr&gt;&lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;35.8%&quot;&gt;&lt;p&gt;依赖输入的value才能推导出输出shape，即数据依赖算子。 如Reshape算子，依赖shape输入的value才能推导出输出shape。&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;64.2%&quot;&gt;&lt;ul&gt;&lt;li&gt;shape推导&lt;/li&gt;&lt;li&gt;datatype推导&lt;/li&gt;&lt;li&gt;声明数据依赖&lt;/li&gt;&lt;/ul&gt; &lt;/td&gt; &lt;/tr&gt; &lt;tr&gt;&lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;35.8%&quot;&gt;&lt;p&gt;编译时无法推导输出shape，只能推导输出shape range，执行完才能得出输出shape。&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;64.2%&quot;&gt;&lt;ul&gt;&lt;li&gt;Shape推导（必选）&lt;/li&gt;&lt;li&gt;DataType推导（必选）&lt;/li&gt;&lt;li&gt;ShapeRange推导（必选）&lt;/li&gt;&lt;li&gt;声明数据依赖（按需）&lt;/li&gt;&lt;/ul&gt; &lt;/td&gt; &lt;/tr&gt; &lt;/tbody&gt; &lt;/table&gt;</p><p>实际开发时通过固定的datatype和shape推导原型实现推导函数，然后再通过SetInferShape、SetInferDataType接口来关联对应的shape推导函数，样例如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>namespace ge {</span></span>
<span class="line"><span>static graphStatus InferShape(gert::InferShapeContext *context)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    return GRAPH_SUCCESS;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static graphStatus InferDataType(gert::InferDataTypeContext *context)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    return ge::GRAPH_SUCCESS;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>} // namespace ge</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>namespace ops {</span></span>
<span class="line"><span>class AddCustom : public OpDef {</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    AddCustom(const char* name) : OpDef(name)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        this-&gt;Input(&quot;x&quot;)</span></span>
<span class="line"><span>            .ParamType(REQUIRED)</span></span>
<span class="line"><span>            .DataType({ge::DT_FLOAT16, ge::DT_FLOAT, ge::DT_INT32})</span></span>
<span class="line"><span>            .Format({ge::FORMAT_ND, ge::FORMAT_ND, ge::FORMAT_ND});</span></span>
<span class="line"><span>        this-&gt;Input(&quot;y&quot;)</span></span>
<span class="line"><span>            .ParamType(REQUIRED)</span></span>
<span class="line"><span>            .DataType({ge::DT_FLOAT16, ge::DT_FLOAT, ge::DT_INT32})</span></span>
<span class="line"><span>            .Format({ge::FORMAT_ND, ge::FORMAT_ND, ge::FORMAT_ND});</span></span>
<span class="line"><span>        this-&gt;Output(&quot;z&quot;)</span></span>
<span class="line"><span>            .ParamType(REQUIRED)</span></span>
<span class="line"><span>            .DataType({ge::DT_FLOAT16, ge::DT_FLOAT, ge::DT_INT32})</span></span>
<span class="line"><span>            .Format({ge::FORMAT_ND, ge::FORMAT_ND, ge::FORMAT_ND});</span></span>
<span class="line"><span>        // 根据用户的算子调用方式决定需不需要注册 图模式调用方式下需要</span></span>
<span class="line"><span>        this-&gt;SetInferShape(ge::InferShape);</span></span>
<span class="line"><span>        this-&gt;SetInferShapeRange(ge::InferShapeRange);</span></span>
<span class="line"><span>        this-&gt;SetInferDataType(ge::InferDataType);  </span></span>
<span class="line"><span>        this-&gt;AICore()</span></span>
<span class="line"><span>            .SetTiling(optiling::TilingFunc);</span></span>
<span class="line"><span>        // 请替换为实际的昇腾AI处理器型号</span></span>
<span class="line"><span>        this-&gt;AICore().AddConfig(&quot;ascendxxx&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span>OP_ADD(AddCustom);</span></span>
<span class="line"><span>} // namespace ops</span></span></code></pre></div><h2 id="datatype推导" tabindex="-1">datatype推导 <a class="header-anchor" href="#datatype推导" aria-label="Permalink to &quot;datatype推导&quot;">​</a></h2><p>以AddCustom算子为例，InferDataType的实现如下所示。该样例中输出tensor的数据类型与输入tensor的数据类型相同，所以直接将任意一个输入tensor的数据类型赋给输出tensor即可。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>namespace ge {</span></span>
<span class="line"><span>static graphStatus InferDataType(gert::InferDataTypeContext* context)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    const auto inputDataType = context-&gt;GetInputDataType(0);</span></span>
<span class="line"><span>    context-&gt;SetOutputDataType(0, inputDataType);</span></span>
<span class="line"><span>    return ge::GRAPH_SUCCESS;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>} // namespace ge</span></span></code></pre></div><p>如下示例则给出了更灵活的datatype推导样例，当输入的数据类型为DT_INT4时，其输出的数据类型为DT_INT32。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ge::graphStatus InferDataTypeForFoo(gert::InferDataTypeContext* context) {</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (context-&gt;GetInputDataType(0) == DT_INT4) {</span></span>
<span class="line"><span>        context-&gt;SetOutputDataType(0, DT_INT32);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="shape推导" tabindex="-1">shape推导 <a class="header-anchor" href="#shape推导" aria-label="Permalink to &quot;shape推导&quot;">​</a></h2><p>简单的shape推导逻辑可以使用Follow接口来表达，比如输出shape和输入shape相同的情况。示例如下：输出“y1”Follow输入“x1”场景，指定Follow模式为SHAPE，此时“y1”的shape将会和“x1”保持一致。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>this-&gt;Input(&quot;x1&quot;)</span></span>
<span class="line"><span>    .ParamType(REQUIRED)</span></span>
<span class="line"><span>    .DataType({ge::DT_FLOAT, ge::DT_FLOAT})</span></span>
<span class="line"><span>    .Format({ge::FORMAT_ND, ge::FORMAT_ND});</span></span>
<span class="line"><span>this-&gt;Input(&quot;x2&quot;)</span></span>
<span class="line"><span>    .ParamType(REQUIRED)</span></span>
<span class="line"><span>    .DataType({ge::DT_FLOAT, ge::DT_FLOAT})</span></span>
<span class="line"><span>    .Format({ge::FORMAT_ND, ge::FORMAT_ND});</span></span>
<span class="line"><span>this-&gt;Output(&quot;y1&quot;)</span></span>
<span class="line"><span>    .ParamType(REQUIRED)</span></span>
<span class="line"><span>    .DataType({ge::DT_FLOAT, ge::DT_FLOAT})</span></span>
<span class="line"><span>    .Format({ge::FORMAT_ND, ge::FORMAT_ND})</span></span>
<span class="line"><span>    .Follow(&quot;x1&quot;, FollowType::SHAPE);</span></span></code></pre></div><p>无法在原型定义中通过Follow表达的情况需要开发者编写InferShape函数，InferShape函数的原型是固定的，如下示例，接受一个InferShapeContext作为输入，从此context上可以获取到输入、输出的shape指针等内容。输入shape为const类型，因此InferShape时，输入shape是只读、不允许修改的。InferShape成功后，返回ge::GRAPH_SUCCESS，其他返回值被认为推导失败。推导失败后，执行过程结束退出。</p><p>以ReShape算子为例，InferShape的实现如下所示。根据第1个输入（shape输入）的值，Reshape算子将第0个输入（x输入）的shape做变换，并输出到其第0个输出（y输出）上。Reshape的InferShape实现为：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ge::graphStatus InferShapeForReshape(InferShapeContext *context) {</span></span>
<span class="line"><span>const gert::Shape *x_shape = context-&gt;GetInputShape(0);        // 获取第0个输入的shape</span></span>
<span class="line"><span>const gert::Tensor *shape_tensor = context-&gt;GetInputTensor(1); // 获取第1个输入的tensor</span></span>
<span class="line"><span>gert::Shape *output_shape = context-&gt;GetOutputShape(0);</span></span>
<span class="line"><span>if (x_shape == nullptr || shape_tensor == nullptr || output_shape == nullptr) {</span></span>
<span class="line"><span>    // 防御式编程，不应该出现的场景，打印错误并返回失败</span></span>
<span class="line"><span>    return ge::GRAPH_FAILED;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>auto reshape_size = static_cast&lt;int32_t&gt;(shape_tensor-&gt;GetShapeSize());</span></span>
<span class="line"><span>if (reshape_size &lt; 1) {</span></span>
<span class="line"><span>    // 防御式编程，不应该出现的场景，打印错误并返回失败</span></span>
<span class="line"><span>    return ge::GRAPH_FAILED;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 根据原型信息，Reshape的shape输入支持INT32与INT64两类，根据不同的类型进入对应的模板函数中做真正的shape变换操作</span></span>
<span class="line"><span>if (shape_tensor-&gt;GetDataType() == ge::DT_INT32) {</span></span>
<span class="line"><span>    int32_t *reshape_data = shape_tensor-&gt;GetData&lt;int32_t&gt;();</span></span>
<span class="line"><span>    return ReshapeInferShapeImpl&lt;int32_t&gt;(reshape_data, *x_shape, *output_shape, reshape_size);</span></span>
<span class="line"><span>} else {</span></span>
<span class="line"><span>    int64_t *reshape_data = shape_tensor-&gt;GetData&lt;int64_t&gt;();</span></span>
<span class="line"><span>    return ReshapeInferShapeImpl&lt;int64_t&gt;(reshape_data, *x_shape, *output_shape, reshape_size);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>InferShapeContext public继承自ExtendedKernelContext，因此ExtendedKernelContext中提供的方法如获取算子type、name、属性等接口均可以在InferShapeContext实例中调用。</p><div class="caution custom-block github-alert"><p class="custom-block-title">注意</p><p></p><ul><li>InferShape推导函数和Follow接口不能混用，即不支持部分输出采用Infershape推导、部分输出采用Follow推导的情况。若用户同时使用了InferShape函数和Follow接口，以用户的InferShape函数为准，需要保证在InferShape函数中能够推导出所有的输出shape。</li><li>为了效率考虑，调用InferShape函数时，框架不会为输出shape做初始化，因此，在InferShape函数中，可以认为输出是<strong>未初始化</strong>的状态。如果在InferShape时，希望通过Append方式操作输出shape，需要先将输出shape的DimNum清零，以防止出现未定义行为。</li></ul></div><h2 id="infershaperange实现" tabindex="-1">InferShapeRange实现 <a class="header-anchor" href="#infershaperange实现" aria-label="Permalink to &quot;InferShapeRange实现&quot;">​</a></h2><p>某些算子的输出Shape在计算完成后才能确定。比如unique算子，其Shape的推导逻辑如下：</p><p>给定一维Tensor x，找到其中不重复的元素，返回去重后的Tensor y，输出idx与输入x大小相同，保存x每个元素在y中的索引。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># tensor &#39;x&#39; is [1, 1, 2, 4, 4, 4, 7, 8, 8]               x shape[9]</span></span>
<span class="line"><span>y, idx = unique(x)</span></span>
<span class="line"><span>y ==&gt; [1, 2, 4, 7, 8]                                      y shape[5] </span></span>
<span class="line"><span>idx ==&gt; [0, 0, 1, 2, 2, 2, 3, 4, 4]                        idx shape[9]</span></span></code></pre></div><p>由此可知，y的shape在编译时为[-1]，unique执行后shape才确定。</p><p>在入图场景执行时，需要在执行前分配输出内存，而内存的大小依赖于输出Shape和数据类型。对于此类算子，由于输出Shape在执行后才能确定，因此需要根据输出Shape的范围，按照最大范围申请输出内存，以确保有足够的空间供计算函数写入输出Tensor。</p><p>这种场景下，开发者需要自行实现InferShapeRange函数，来推导输出Shape的范围。下面以unique算子为例子，介绍InferShapeRange函数的实现方法。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ge::graphStatus UniqueInferShapeRangeFunc(gert::InferShapeRangeContext *context) {</span></span>
<span class="line"><span>  // 取输入的shape range</span></span>
<span class="line"><span>  auto x_shape_range = context-&gt;GetInputShapeRange(0U);</span></span>
<span class="line"><span>  OPS_CHECK_NULL_WITH_CONTEXT(context, x_shape_range);</span></span>
<span class="line"><span>  OPS_CHECK_NULL_WITH_CONTEXT(context, x_shape_range-&gt;GetMax());</span></span>
<span class="line"><span>  OPS_CHECK_NULL_WITH_CONTEXT(context, x_shape_range-&gt;GetMin());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 开始计算y输出的shape range</span></span>
<span class="line"><span>  auto y_shape_range = context-&gt;GetOutputShapeRange(0U);</span></span>
<span class="line"><span>  OPS_CHECK_NULL_WITH_CONTEXT(context, y_shape_range);</span></span>
<span class="line"><span>  y_shape_range-&gt;GetMax()-&gt;SetDimNum(1); // 一维向量，rank为1</span></span>
<span class="line"><span>  y_shape_range-&gt;GetMin()-&gt;SetDimNum(1);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  auto x_max_shape = x_shape_range-&gt;GetMax();</span></span>
<span class="line"><span>  auto x_shape_dimnum = x_max_shape-&gt;GetDim(0); // x为一维Tensor，其shape为[n]， x_shape_dimnum表示x输入的元素个数n</span></span>
<span class="line"><span>  if (x_shape_dimnum == 1) {</span></span>
<span class="line"><span>    // 若x输入只有1个元素，不存在去重，y的shape轴最小最大均为1. 因此range为[1~1]</span></span>
<span class="line"><span>    y_shape_range-&gt;GetMax()-&gt;SetDim(0, 1);</span></span>
<span class="line"><span>    y_shape_range-&gt;GetMin()-&gt;SetDim(0, 1);</span></span>
<span class="line"><span>  } else {</span></span>
<span class="line"><span>    // 若x输入有0个元素，或者大于1个元素，去重后，y的元素个数最小为x的min，最大为x的max</span></span>
<span class="line"><span>    y_shape_range-&gt;GetMax()-&gt;SetDim(0, x_shape_dimnum);</span></span>
<span class="line"><span>    y_shape_range-&gt;GetMin()-&gt;SetDim(0, x_shape_range-&gt;GetMin());</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 开始计算输出idx的shape range</span></span>
<span class="line"><span>  // 输出idx表示x元素在y中的索引，其元素个数与x相等，因此shape range与x一致</span></span>
<span class="line"><span>  auto idx_shape_range = context-&gt;GetOutputShapeRange(1U);</span></span>
<span class="line"><span>  OPS_CHECK_NULL_WITH_CONTEXT(context, idx_shape_range);</span></span>
<span class="line"><span>  *(idx_shape_range-&gt;GetMax()) = *(x_shape_range-&gt;GetMax());</span></span>
<span class="line"><span>  *(idx_shape_range-&gt;GetMin()) = *(x_shape_range-&gt;GetMin());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  return ge::GRAPH_SUCCESS;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="infershape时获取属性、输入" tabindex="-1">InferShape时获取属性、输入 <a class="header-anchor" href="#infershape时获取属性、输入" aria-label="Permalink to &quot;InferShape时获取属性、输入&quot;">​</a></h2><p>在InferShape、Tiling时，可以通过context实例获取算子IR属性值，所谓IR属性，是指在IR注册时定义的属性，以TransData算子为例：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>namespace ops {</span></span>
<span class="line"><span>class TransData : public OpDef {</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    explicit TransData(const char *name) : OpDef(name)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        this-&gt;Input(&quot;src&quot;)</span></span>
<span class="line"><span>             ...</span></span>
<span class="line"><span>        this-&gt;Output(&quot;dst&quot;)</span></span>
<span class="line"><span>             ...</span></span>
<span class="line"><span>        this-&gt;Attr(&quot;src_format&quot;)</span></span>
<span class="line"><span>            .AttrType(REQUIRED)</span></span>
<span class="line"><span>            .String();</span></span>
<span class="line"><span>        this-&gt;Attr(&quot;dst_format&quot;)</span></span>
<span class="line"><span>            .AttrType(REQUIRED)</span></span>
<span class="line"><span>            .String();</span></span>
<span class="line"><span>        this-&gt;Attr(&quot;group&quot;)</span></span>
<span class="line"><span>            .AttrType(OPTIONAL)           </span></span>
<span class="line"><span>           .Int(1);</span></span>
<span class="line"><span>        ...</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span>OP_ADD(TransData);</span></span>
<span class="line"><span>} // namespace ops</span></span></code></pre></div><p>其原型定义中声明了src_format、dst_format、group三个属性，可以通过如下方式获取算子属性：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ge::graphStatus ExampleGetTransDataAttr(TilingContext *context) {</span></span>
<span class="line"><span>  // 获取所有属性</span></span>
<span class="line"><span>  const RuntimeAttrs *attrs = context-&gt;GetAttrs();</span></span>
<span class="line"><span>  ASSERT_NOT_NULL(attrs);</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  // 按照在原型定义中的顺序，使用index获取属性，index从0开始计数</span></span>
<span class="line"><span>  const char *src_format = attrs-&gt;GetAttrPointer&lt;char&gt;(0);  // 获取src_format，src_format是第一个属性，因此index为0</span></span>
<span class="line"><span>  const char *dst_format = attrs-&gt;GetAttrPointer&lt;char&gt;(1);  // 获取dst_format，dst_format是第二个属性，因此index为1</span></span>
<span class="line"><span>  const int64_t group = attrs-&gt;GetAttrPointer&lt;int64_t&gt;(2);  // 获取group，group是第三个属性，因此index为2</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  return ge::GRAPH_SUCCESS;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>通过index而不是字符串name来索引输入输出，对于带有OPTIONAL、DYNAMIC类型输入的算子，可能出现实例化后，单纯通过index无法索引到具体输入的问题，以DynamicRNNV3算子为例：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>namespace ops {</span></span>
<span class="line"><span>class DynamicRNNV3 : public OpDef {</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    explicit DynamicRNNV3(const char *name) : OpDef(name)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        this-&gt;Input(&quot;x&quot;)</span></span>
<span class="line"><span>             .ParamType(REQUIRED)</span></span>
<span class="line"><span>             ...</span></span>
<span class="line"><span>        this-&gt;Input(&quot;w&quot;)</span></span>
<span class="line"><span>             .ParamType(REQUIRED)</span></span>
<span class="line"><span>             ...</span></span>
<span class="line"><span>        this-&gt;Input(&quot;b&quot;)</span></span>
<span class="line"><span>             .ParamType(REQUIRED)</span></span>
<span class="line"><span>             ...</span></span>
<span class="line"><span>        this-&gt;Input(&quot;seq_length&quot;)</span></span>
<span class="line"><span>             .ParamType(OPTIONAL)</span></span>
<span class="line"><span>             ...</span></span>
<span class="line"><span>        this-&gt;Input(&quot;init_h&quot;)</span></span>
<span class="line"><span>             .ParamType(OPTIONAL)</span></span>
<span class="line"><span>             ...</span></span>
<span class="line"><span>        this-&gt;Input(&quot;init_c&quot;)</span></span>
<span class="line"><span>             .ParamType(OPTIONAL)</span></span>
<span class="line"><span>             ...</span></span>
<span class="line"><span>        this-&gt;Input(&quot;wci&quot;)</span></span>
<span class="line"><span>             .ParamType(OPTIONAL)</span></span>
<span class="line"><span>             ...</span></span>
<span class="line"><span>        this-&gt;Input(&quot;wcf&quot;)</span></span>
<span class="line"><span>             .ParamType(OPTIONAL)</span></span>
<span class="line"><span>             ...</span></span>
<span class="line"><span>        this-&gt;Input(&quot;mask&quot;)</span></span>
<span class="line"><span>             .ParamType(OPTIONAL)</span></span>
<span class="line"><span>             ...</span></span>
<span class="line"><span>        this-&gt;Input(&quot;mask&quot;)</span></span>
<span class="line"><span>             .ParamType(OPTIONAL)</span></span>
<span class="line"><span>             ...</span></span>
<span class="line"><span>        this-&gt;Input(&quot;project&quot;)</span></span>
<span class="line"><span>             .ParamType(OPTIONAL)</span></span>
<span class="line"><span>             ...</span></span>
<span class="line"><span>       </span></span>
<span class="line"><span>        ...</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span>OP_ADD(DynamicRNNV3);</span></span>
<span class="line"><span>} // namespace ops</span></span></code></pre></div><p>由于DynamicRNNV3算子有连续的多个optional输入，这导致init_h及其后面的输入的实例化后index都是不确定的，对于这种类型的算子，可以通过GetOptionalInputShape传入原型对应的index来获取对应的输入shape等数据，以InferShape为例：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ge::graphStatus InferShapeForDynamicRNNV3(InferShapeContext *context) {</span></span>
<span class="line"><span>  // 对于前两个输入，不受到optional或dynamic的影响，可以按照常规方法获取输入shape</span></span>
<span class="line"><span>  auto x_shape = context-&gt;GetInputShape(0);</span></span>
<span class="line"><span>  auto w_shape = context-&gt;GetInputShape(1);</span></span>
<span class="line"><span>  if (x_shape == nullptr || w_shape == nullptr) {</span></span>
<span class="line"><span>    return ge::GRAPH_FAILED;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  int64_t state_size = 0;</span></span>
<span class="line"><span>  // 在原型定义上，project是第11个输入(从0开始计数)</span></span>
<span class="line"><span>  constexpr int64_t kProjectInputIndex = 11;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 受到前面optional输入影响的，project实例化后输入的index是不确定的，通过GetOptionalInputShape来获取对应的输入shape，</span></span>
<span class="line"><span>  // GetOptionalInputShape的入参为原型上对应的index</span></span>
<span class="line"><span>  auto project_shape = context-&gt;GetOptionalInputShape(kProjectInputIndex);</span></span>
<span class="line"><span>  if (project_shape != nullptr) {</span></span>
<span class="line"><span>    if (project_shape-&gt;GetDimNum() &lt; 2) {</span></span>
<span class="line"><span>      return ge::GRAPH_FAILED;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    state_size = project_shape-&gt;GetDim(1);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  // 更多的infershape逻辑...</span></span>
<span class="line"><span>  return ge::GRAPH_SUCCESS;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>对于dynamic类型的输入，实例化后的输入可能是一到多个，对于此类输入，获取方式为：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// ir_index：此输入在原型定义中的index，从0开始计数</span></span>
<span class="line"><span>// relative_index：该输入实例化后的相对index，从0开始计数，例如某个DYNAMIC_INPUT实例化了3个，要取第二个，那么relative_index = 1</span></span>
<span class="line"><span>auto shape = context-&gt;GetDynamicInputShape(ir_index, relative_index);</span></span></code></pre></div><p>本节举例的获取optional、dynamic输入的方式，在InferShape、Tiling函数中均可以调用。</p><h2 id="数据依赖" tabindex="-1">数据依赖 <a class="header-anchor" href="#数据依赖" aria-label="Permalink to &quot;数据依赖&quot;">​</a></h2><p>一般来说，具备输入shape后，算子可以通过InferShape推导出输出shape。然而部分算子在InferShape时，需要依赖某个输入的具体值才可以进行，这类算子被称为“数据依赖算子”，对应的输入被称为“数据依赖输入”。以Reshape算子为例，其依据shape输入的描述，对输入的shape做调整，因此Reshape算子依赖shape输入的值。这类算子需要在原型定义时通过ValueDepend接口声明对应的输入为数据依赖输入。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>namespace ops {</span></span>
<span class="line"><span>class Reshape : public OpDef {</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    explicit Reshape(const char *name) : OpDef(name)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        ...</span></span>
<span class="line"><span>        this-&gt;Input(&quot;shape&quot;)</span></span>
<span class="line"><span>             .ParamType(REQUIRED)</span></span>
<span class="line"><span>             ...</span></span>
<span class="line"><span>             .ValueDepend(REQUIRED) // 声明 ReShape算子的shape输入为数据依赖输入</span></span>
<span class="line"><span>        ...</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span>OP_ADD(Reshape);</span></span>
<span class="line"><span>} // namespace ops</span></span></code></pre></div><p>根据第1个输入（shape输入）的值，Reshape算子将第0个输入（x输入）的shape做变换，并输出到其第0个输出（y输出）上。Reshape的InferShape实现为：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// shape变换具体实现</span></span>
<span class="line"><span>template&lt;typename T&gt;</span></span>
<span class="line"><span>ge::graphStatus ReshapeInferShapeImpl(const T *reshape_dims, const gert::Shape &amp;x_shape, gert::Shape &amp;output_shape, int32_t reshape_rank) {</span></span>
<span class="line"><span>    constexpr T UNKNOWN_DIM = -1;</span></span>
<span class="line"><span>    // 将算子输出的维度数设置为reshape后的维度数reshape_rank</span></span>
<span class="line"><span>    output_shape.SetDimNum(reshape_rank);</span></span>
<span class="line"><span>    auto x_shape_size = x_shape.GetShapeSize();</span></span>
<span class="line"><span>    int64_t output_shapesize = 1;</span></span>
<span class="line"><span>    size_t unknown_dim_idx = std::numeric_limits&lt;size_t&gt;::max();</span></span>
<span class="line"><span>    for (int32_t i = 0; i &lt; reshape_rank; i++) {</span></span>
<span class="line"><span>        if (reshape_dims[i] != UNKNOWN_DIM) {  // reshape后某一轴的维度值不为-1 </span></span>
<span class="line"><span>            output_shape.SetDim(i, reshape_dims[i]);  // 设置输出的维度值为reshape后的维度值</span></span>
<span class="line"><span>            output_shapesize *= reshape_dims[i];  // 计算当前输出元素数量</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            output_shape.SetDim(i, 1);  // reshape后某一轴的维度值为-1，临时设置输出的维度值为1，后续计算后看是否可以推导出确定值，并记录未知维度的索引</span></span>
<span class="line"><span>            unknown_dim_idx = i;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (unknown_dim_idx == std::numeric_limits&lt;size_t&gt;::max() &amp;&amp; output_shapesize == x_shape_size) {</span></span>
<span class="line"><span>        return ge::GRAPH_SUCCESS;  // 不存在未知维度，且输出shape size和输入x的shape size一致，直接返回成功</span></span>
<span class="line"><span>    } else if (unknown_dim_idx != std::numeric_limits&lt;size_t&gt;::max() &amp;&amp; x_shape_size % output_shapesize == 0) {</span></span>
<span class="line"><span>        output_shape.SetDim(unknown_dim_idx, x_shape_size / output_shapesize); // 存在未知维度，根据输入shape动态调整未知维度值保持总元素个数不变</span></span>
<span class="line"><span>        return ge::GRAPH_SUCCESS;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return ge::GRAPH_FAILED;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>ge::graphStatus InferShapeForReshape(InferShapeContext *context) {</span></span>
<span class="line"><span>    const gert::Shape *x_shape = context-&gt;GetInputShape(0);        // 获取第0个输入的shape</span></span>
<span class="line"><span>    const gert::Tensor *shape_tensor = context-&gt;GetInputTensor(1); // 获取第1个输入的tensor</span></span>
<span class="line"><span>    gert::Shape *output_shape = context-&gt;GetOutputShape(0);</span></span>
<span class="line"><span>    if (x_shape == nullptr || shape_tensor == nullptr || output_shape == nullptr) {</span></span>
<span class="line"><span>        // 防御式编程，不应该出现的场景，打印错误并返回失败</span></span>
<span class="line"><span>        return ge::GRAPH_FAILED;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    auto reshape_size = static_cast&lt;int32_t&gt;(shape_tensor-&gt;GetShapeSize());</span></span>
<span class="line"><span>    if (reshape_size &lt; 1) {</span></span>
<span class="line"><span>        // 防御式编程，不应该出现的场景，打印错误并返回失败</span></span>
<span class="line"><span>        return ge::GRAPH_FAILED;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 根据原型信息，Reshape的shape输入支持INT32与INT64两类，根据不同的类型进入对应的模板函数中做真正的shape变换操作</span></span>
<span class="line"><span>    if (shape_tensor-&gt;GetDataType() == ge::DT_INT32) {</span></span>
<span class="line"><span>        int32_t *reshape_data = shape_tensor-&gt;GetData&lt;int32_t&gt;();</span></span>
<span class="line"><span>        return ReshapeInferShapeImpl&lt;int32_t&gt;(reshape_data, *x_shape, *output_shape, reshape_size);</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        int64_t *reshape_data = shape_tensor-&gt;GetData&lt;int64_t&gt;();</span></span>
<span class="line"><span>        return ReshapeInferShapeImpl&lt;int64_t&gt;(reshape_data, *x_shape, *output_shape, reshape_size);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><div class="caution custom-block github-alert"><p class="custom-block-title">注意</p><p></p><ul><li>只有声明过数据依赖的输入，才可以在InferShape时调用GetInputTensor等获取tensor的接口获取其对应的tensor数据。若对一个未声明数据依赖的输入调用GetInputTensor等获取tensor的接口，只能在tensor中获取到正确的shape、format、datatype信息，无法获取到真实的tensor数据地址（获取到的地址为nullptr）。</li><li>从tensor中获取tensor_data时(GetData&lt;int32_t&gt;或GetData&lt;int64_t&gt;)，使用者需要保证获取的数据类型是正确的，否则行为是未定义的。</li></ul></div>`,51)])])}const d=a(l,[["render",i]]);export{_ as __pageData,d as default};
