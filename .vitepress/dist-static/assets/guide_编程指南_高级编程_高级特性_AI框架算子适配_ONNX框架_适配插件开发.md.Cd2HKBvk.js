import{c as a,Q as n,j as p,m as e}from"./chunks/framework.DOi4mjdC.js";const g=JSON.parse('{"title":"适配插件开发","description":"","frontmatter":{},"headers":[{"level":1,"title":"适配插件开发","slug":"适配插件开发"}],"relativePath":"guide/编程指南/高级编程/高级特性/AI框架算子适配/ONNX框架/适配插件开发.md","filePath":"guide/编程指南/高级编程/高级特性/AI框架算子适配/ONNX框架/适配插件开发.md"}'),t={name:"guide/编程指南/高级编程/高级特性/AI框架算子适配/ONNX框架/适配插件开发.md"};function l(i,s,o,r,c,u){return n(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="适配插件开发" tabindex="-1">适配插件开发 <a class="header-anchor" href="#适配插件开发" aria-label="Permalink to &quot;适配插件开发&quot;">​</a></h1><div class="note custom-block github-alert"><p class="custom-block-title">说明</p><p>针对Atlas A3 训练系列产品/Atlas A3 推理系列产品，暂不支持ONNX框架算子调用。 针对Ascend 950PR/Ascend 950DT，暂不支持ONNX框架算子调用。</p></div><p>您可以参考本章节进行算子适配插件的开发，将ONNX框架的算子映射成适配AI处理器的算子（下文简称CANN算子），从而完成从ONNX框架调用Ascend C自定义算子的过程。</p><p>完成<a href="./../TensorFlow框架.html#li123241091016">算子工程创建</a>后，会在算子工程目录下生成framework/onnx_plugin目录，用于存放ONNX框架适配插件实现文件。以自定义CANN算子LeakyReluCustom为例，算子工程目录如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>LeakyReluCustom</span></span>
<span class="line"><span>├── build.sh             // 编译入口脚本</span></span>
<span class="line"><span>├── cmake </span></span>
<span class="line"><span>├── CMakeLists.txt       // 算子工程的CMakeLists.txt</span></span>
<span class="line"><span>├── CMakePresets.json    // 编译配置项</span></span>
<span class="line"><span>├── framework            // 框架适配插件实现文件目录</span></span>
<span class="line"><span>│   ├── onnx_plugin     //  ONNX框架适配插件实现文件目录</span></span>
<span class="line"><span>│   │   ├── CMakeLists.txt    </span></span>
<span class="line"><span>│   │   ├── leaky_relu_custom_plugin.cc // ONNX框架适配插件实现文件    </span></span>
<span class="line"><span>│   ├── CMakeLists.txt</span></span>
<span class="line"><span>├── op_host                      // host侧实现文件</span></span>
<span class="line"><span>├── op_kernel                    // kernel侧实现文件</span></span>
<span class="line"><span>└── scripts                      // 自定义算子工程打包相关脚本所在目录</span></span></code></pre></div><p>下文主要讲解ONNX框架适配插件实现文件（leaky_relu_custom_plugin.cc ）的开发流程。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &quot;register/register.h&quot;</span></span>
<span class="line"><span>#include &quot;graph/operator.h&quot;</span></span>
<span class="line"><span>#include &quot;json.hpp&quot;</span></span>
<span class="line"><span>namespace domi {</span></span>
<span class="line"><span>    Status ParseParamByOpFunc(const ge::Operator&amp; op_src, ge::Operator&amp; op_dest) {</span></span>
<span class="line"><span>        //...</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    REGISTER_CUSTOM_OP(&quot;OpType&quot;)</span></span>
<span class="line"><span>        .FrameworkType(ONNX) </span></span>
<span class="line"><span>        .OriginOpType(&quot;OriginOpType&quot;)</span></span>
<span class="line"><span>        .ParseParamsByOperatorFn(ParseParamByOpFunc)   //用来注册解析算子属性的函数</span></span>
<span class="line"><span>        .ImplyType(ImplyType::TVM);  // Ascend C算子实现类型设置为TVM</span></span>
<span class="line"><span>}</span></span></code></pre></div><ol><li><p>包含所需头文件。</p><ul><li>register.h，存储在CANN软件安装后文件存储路径的“include/register/”目录下，包含该头文件，可使用算子注册相关类，调用算子注册相关的接口。</li><li>operator.h（可选），存储在CANN软件安装后文件存储路径的“include/graph/”目录下，包含该头文件，可以使用Operator类相关接口，获取算子输入输出及属性等算子信息。</li><li>json.hpp，用于进行ONNX数据定义的解析，将String类型的算子参数定义转换为json格式。若样例工程中未提供“json.hpp”文件，用户可以自行下载，并将“json.hpp”放在工程可以找到的任意路径下，然后包含此头文件即可，下载路径可参见<a href="https://github.com/nlohmann/json/blob/develop/include/nlohmann/json.hpp" target="_blank" rel="noreferrer">json.hpp</a>。</li></ul></li><li><p>使用REGISTER_CUSTOM_OP宏，完成CANN算子和ONNX框架的算子映射关系注册。使用方法如下：</p><ul><li>REGISTER_CUSTOM_OP：注册自定义算子，OpType为算子类型名称，需要与<a href="./../../Aclnn算子工程化开发/算子原型定义.html">算子原型注册</a>中的OpType保持一致。</li><li>FrameworkType：ONNX代表原始框架为ONNX。</li><li>OriginOpType：算子在原始框架中的类型。例如自定义算子_OpTypeA_，对应ONNX算子库版本opset_version=11，应传入“ai.onnx::11::<em>OpTypeA</em>”，当前支持的ONNX版本范围为9~15。</li><li>ParseParamsByOperatorFn(<em>ParseParamByOpFunc</em>)：用来注册解析算子参数实现映射关系的回调函数，需要用户自定义实现回调函数ParseParamByOpFunc。具体实现方式参考<a href="#li213610403113">3</a>。</li><li>ImplyType：指定算子的实现方式。Ascend C算子实现类型设置为TVM。</li></ul></li><li><p>实现回调函数ParseParamByOpFunc。其函数声明如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Status ParseParamByOpFunc(const ge::Operator&amp; op_src, ge::Operator&amp; op_dest)</span></span></code></pre></div><ul><li><em>ParseParamByOpFunc</em>：函数名称，用户自定义。</li><li>op_src：ONNX框架定义的Operator类对象，包含ONNX模型中自定义的算子属性信息，定义来源于ONNX框架的原始模型文件。</li><li>op_dest：CANN算子数据结构，保存算子信息。</li></ul><p>开发者需要在回调函数中实现属性的解析和映射，具体实现方式如下：</p><p>ONNX原始模型中，属性为repeated message类型，对于repeated message类型的参数，可使GetAttr(const char *name, ge::AscendString &amp;attr_value)接口获取其属性值，然后将AscendString类型的属性值转换为String类型，再将其转换为json格式进行属性字段的解析。</p><p>实现如下所示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Status ParseOnnxParamsLeakyReluCustom(const ge::Operator&amp; op_src, ge::Operator&amp; op_dest) {</span></span>
<span class="line"><span>  // trans op_src to op_dest</span></span>
<span class="line"><span>  // if op_src get required attr failed, need to return Failed</span></span>
<span class="line"><span>  // if op_src get optional attr failed, need to return Failed or set a default value</span></span>
<span class="line"><span>  float negative_slope = 0.01f;</span></span>
<span class="line"><span>  string negative_slope_str;</span></span>
<span class="line"><span>  AscendString attrs_string;</span></span>
<span class="line"><span>  // 使用固定属性名称“attribute”获取ONNX算子中的属性，并赋值给AscendString类型对象</span></span>
<span class="line"><span>  if (ge::GRAPH_SUCCESS == op_src.GetAttr(&quot;attribute&quot;, attrs_string)) {</span></span>
<span class="line"><span>    // 转换为json格式</span></span>
<span class="line"><span>    json attrs = json::parse(attrs_string.GetString());</span></span>
<span class="line"><span>    for (json attr : attrs[&quot;attribute&quot;]) {</span></span>
<span class="line"><span>      if (attr[&quot;name&quot;] == &quot;alpha&quot; &amp;&amp; attr[&quot;type&quot;] == kTypeFloat) {</span></span>
<span class="line"><span>        negative_slope_str = attr[&quot;f&quot;];  // float type in json has accuracy loss, so we use string type to store it</span></span>
<span class="line"><span>        negative_slope = atof(negative_slope_str.c_str());</span></span>
<span class="line"><span>      }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  op_dest.SetAttr(&quot;negative_slope&quot;, negative_slope);</span></span>
<span class="line"><span>  return SUCCESS;</span></span>
<span class="line"><span>}</span></span></code></pre></div><div class="note custom-block github-alert"><p class="custom-block-title">说明</p><p></p><ul><li>当前版本GetAttr与SetAttr接口不支持对原始文件中数据类型为double和uint64的字段进行解析。</li><li>使用ATC工具执行模型转换时，对属性的获取情况不会进行强校验。所以进行算子适配插件实现时，若用户调用GetAttr失败，建议根据算子实际情况增加相应的处理逻辑，例如，针对必选属性，可返回失败，针对可选属性，可设置默认值。</li></ul></div></li></ol>`,8)])])}const _=a(t,[["render",l]]);export{g as __pageData,_ as default};
