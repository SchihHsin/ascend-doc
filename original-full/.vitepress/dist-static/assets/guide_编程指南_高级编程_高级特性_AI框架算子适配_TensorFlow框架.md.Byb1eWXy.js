import{c as n,Q as a,j as p,m as e}from"./chunks/framework.DOi4mjdC.js";const t="/assets/copy.BPkjrgj9.png",m=JSON.parse('{"title":"TensorFlow框架","description":"","frontmatter":{},"headers":[{"level":1,"title":"TensorFlow框架","slug":"tensorflow框架"},{"level":2,"title":"适配插件开发","slug":"适配插件开发"},{"level":2,"title":"TensorFlow原生算子映射到CANN算子","slug":"tensorflow原生算子映射到cann算子"},{"level":2,"title":"TensorFlow自定义算子开发并映射到CANN算子","slug":"tensorflow自定义算子开发并映射到cann算子"},{"level":2,"title":"可选输入算子映射关系开发","slug":"可选输入算子映射关系开发"},{"level":2,"title":"动态输入算子映射关系开发","slug":"动态输入算子映射关系开发"}],"relativePath":"guide/编程指南/高级编程/高级特性/AI框架算子适配/TensorFlow框架.md","filePath":"guide/编程指南/高级编程/高级特性/AI框架算子适配/TensorFlow框架.md"}'),l={name:"guide/编程指南/高级编程/高级特性/AI框架算子适配/TensorFlow框架.md"};function i(o,s,c,r,_,u){return a(),p("div",null,[...s[0]||(s[0]=[e('<h1 id="tensorflow框架" tabindex="-1">TensorFlow框架 <a class="header-anchor" href="#tensorflow框架" aria-label="Permalink to &quot;TensorFlow框架&quot;">​</a></h1><div class="note custom-block github-alert"><p class="custom-block-title">说明</p><p>针对Ascend 950PR/Ascend 950DT，暂不支TensorFlow框架算子调用。</p></div><p>本章节介绍TensorFlow框架算子适配的流程，用于将TensorFlow框架的算子映射成CANN算子（开发者基于CANN框架自定义开发的算子），从而完成从TensorFlow框架调用到CANN算子的过程。同时给出TensorFlow框架侧算子调用的示例，便于开发者了解完整流程。</p><p>下图展示了完整的开发流程，具体步骤如下：</p><p><img src="'+t+`" alt=""></p><ol><li><p>环境准备。</p><ol><li><p>CANN软件安装请参考<a href="./../../../../入门教程/环境准备.html">环境准备</a>。</p></li><li><p>安装框架插件包，请参考<a href="https://www.hiascend.com/document/redirect/canncommercial-tfmigr115" target="_blank" rel="noreferrer">《TensorFlow 1.15模型迁移指南》</a>或<a href="https://www.hiascend.com/document/redirect/canncommercial-tfmigr26" target="_blank" rel="noreferrer">《TensorFlow 2.6.5模型迁移》</a>中的环境准备 &gt; 安装框架插件包章节，获取框架插件包详细的安装步骤。</p></li><li><p><a href="./../Aclnn算子工程化开发/创建算子工程.html">创建算子工程</a>。使用msOpGen工具创建算子开发工程。TensorFlow框架算子适配场景下，需要通过framework参数指定具体的框架为tf或者tensorflow，工具会自动生成框架适配代码。以自定义CANN算子AddCustom为例，使用msOpGen工具创建算子开发工程的具体命令如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>\${INSTALL_DIR}/python/site-packages/bin/msopgen gen -i $HOME/sample/add_custom.json -f tf -c ai_core-&lt;soc_version&gt; -lan cpp -out $HOME/sample/AddCustom</span></span></code></pre></div></li></ol></li><li><p>算子实现。</p><ul><li><a href="./../Aclnn算子工程化开发/算子原型定义.html">算子原型定义</a>。通过原型定义来描述算子输入输出、属性等信息以及算子在AI处理器上相关实现信息，并关联tiling实现等函数。</li><li>Kernel侧算子实现和host侧tiling实现请参考<a href="./../../../../算子实践参考/SIMD算子实现/概述.html">SIMD算子实现</a>；工程化算子开发，支持开发者调用Tiling API基于CANN提供的编程框架进行tiling开发，kernel侧也提供对应的接口方便开发者获取tiling参数，具体内容请参考<a href="./../Aclnn算子工程化开发/Kernel侧算子实现.html">Kernel侧算子实现</a>和<a href="./../Aclnn算子工程化开发/Host侧Tiling实现/基本流程.html">Host侧Tiling实现</a>，由此而带来的额外约束也在上述章节说明。</li></ul></li><li><p><a href="./../算子入图开发/基本开发流程.html">算子入图（GE图）开发</a>。算子入图场景下，需要提供shape推导等算子入图适配函数的实现。</p></li><li><p>TensorFlow框架适配插件开发。详细说明见<a href="#section1820291291414">适配插件开发</a>。</p></li><li><p>编译部署。通过工程编译脚本完成算子的编译部署，分为<a href="./../Aclnn算子工程化开发/算子包编译/算子工程编译.html">算子包编译</a>和<a href="./../Aclnn算子工程化开发/算子动态库和静态库编译.html">算子动态库编译</a>两种方式。</p></li><li><p>TensorFlow框架算子调用。详细说明见<a href="#section6342138121512">TensorFlow原生算子映射到CANN算子</a>和<a href="#section18276103563719">TensorFlow自定义算子开发并映射到CANN算子</a>。完整样例请参考<a href="https://gitcode.com/cann/asc-devkit/tree/master/examples/01_simd_cpp_api/02_features/02_framework/02_onnx" target="_blank" rel="noreferrer">LINK</a>。</p></li></ol><h2 id="适配插件开发" tabindex="-1">适配插件开发 <a class="header-anchor" href="#适配插件开发" aria-label="Permalink to &quot;适配插件开发&quot;">​</a></h2><p>完成<a href="#li123241091016">算子工程创建</a>后，会在算子工程目录下生成framework/tf_plugin目录，用于存放TensorFlow框架适配插件实现文件。以自定义CANN算子AddCustom为例，算子工程目录如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>AddCustom</span></span>
<span class="line"><span>├── build.sh             // 编译入口脚本</span></span>
<span class="line"><span>├── cmake </span></span>
<span class="line"><span>├── CMakeLists.txt       // 算子工程的CMakeLists.txt</span></span>
<span class="line"><span>├── CMakePresets.json    // 编译配置项</span></span>
<span class="line"><span>├── framework            // 框架适配插件实现文件目录</span></span>
<span class="line"><span>│   ├── tf_plugin     //  TensorFlow框架适配插件实现文件目录</span></span>
<span class="line"><span>│   │   ├── CMakeLists.txt    </span></span>
<span class="line"><span>│   │   ├── tensorflow_add_custom_plugin.cc  // TensorFlow框架适配插件实现文件    </span></span>
<span class="line"><span>│   ├── CMakeLists.txt</span></span>
<span class="line"><span>├── op_host                      // host侧实现文件</span></span>
<span class="line"><span>├── op_kernel                    // kernel侧实现文件</span></span>
<span class="line"><span>└── scripts                      // 自定义算子工程打包相关脚本所在目录</span></span></code></pre></div><p>当TensorFlow算子与CANN算子原型定义一致时，TensorFlow框架适配插件实现代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &quot;register/register.h&quot;</span></span>
<span class="line"><span>namespace domi {</span></span>
<span class="line"><span>REGISTER_CUSTOM_OP(&quot;AddCustom&quot;)</span></span>
<span class="line"><span>    .FrameworkType(TENSORFLOW) </span></span>
<span class="line"><span>    .OriginOpType(&quot;AddCustom&quot;)   </span></span>
<span class="line"><span>    .ParseParamsByOperatorFn(AutoMappingByOpFn);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>当TensorFlow算子与CANN算子原型定义不一致时，TensorFlow框架适配插件实现代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &quot;register/register.h&quot;</span></span>
<span class="line"><span>REGISTER_CUSTOM_OP(&quot;FlashAttentionScore&quot;)</span></span>
<span class="line"><span>    .FrameworkType(TENSORFLOW)</span></span>
<span class="line"><span>    .OriginOpType({&quot;FlashAttentionScore&quot;})</span></span>
<span class="line"><span>    .ParseParamsByOperatorFn(FlashAttentionScoreMapping)  </span></span>
<span class="line"><span>    .ParseOpToGraphFn(AddOptionalPlaceholderForFA);</span></span></code></pre></div><ul><li><p>包含插件实现函数相关的头文件。</p><p>register.h存储在CANN软件安装后文件存储路径的“include/register/”目录下，包含该头文件，可使用算子注册相关类，调用算子注册相关的接口。</p></li><li><p>REGISTER_CUSTOM_OP：注册自定义算子，传入算子的_OpType_，需要与算子原型注册中的_OpType_保持一致。</p><ul><li>FrameworkType：TENSORFLOW代表原始框架为TensorFlow。</li><li>OriginOpType：算子在原始框架中的类型。对于TensorFlow自定义算子，还需要完成<a href="#li312982016383">TensorFlow自定义算子的开发</a>，这里的OriginOpType与REGISTER_OP注册算子名相同，对于TensorFlow原生算子， 即为原生算子名。</li><li>ParseParamsByOperatorFn：用来注册解析算子参数实现映射关系的回调函数，需要用户自定义实现回调函数ParseParamByOpFunc。原始TensorFlow算子中参数与CANN算子中参数一一对应时，可直接使用自动映射回调函数AutoMappingByOpFn自动实现映射。</li><li>ParseOpToGraphFn：当TensorFlow算子与CANN算子原型定义不一致（比如CANN算子原型定义原型中有可选输入，但TensorFlow原型定义中不支持可选输入，没有可选输入）的情况时，用来注册调整算子原型映射关系的回调函数。</li></ul></li></ul><h2 id="tensorflow原生算子映射到cann算子" tabindex="-1">TensorFlow原生算子映射到CANN算子 <a class="header-anchor" href="#tensorflow原生算子映射到cann算子" aria-label="Permalink to &quot;TensorFlow原生算子映射到CANN算子&quot;">​</a></h2><p>以自定义算子AddCustom为例，将该算子映射到TensorFlow内置算子Add上，需要先修改AddCustom自定义算子目录framework/tf_plugin下插件代码，完成算子名映射：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &quot;register/register.h&quot;</span></span>
<span class="line"><span>namespace domi {</span></span>
<span class="line"><span>REGISTER_CUSTOM_OP(&quot;AddCustom&quot;)   // 当前Ascend C自定义算子名</span></span>
<span class="line"><span>    .FrameworkType(TENSORFLOW)    // 第三方框架类型TENSORFLOW</span></span>
<span class="line"><span>    .OriginOpType(&quot;Add&quot;)          // 映射到TensorFlow原生算子Add</span></span>
<span class="line"><span>    .ParseParamsByOperatorFn(AutoMappingByOpFn);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>完成算子工程的编译部署后，构造单算子的TensorFlow 1.15版本测试用例进行验证。</p><ol><li><p>编写测试用例_“tf_add_.py”。</p></li><li><p>导入python库。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import logging            # Python标准库日志模块</span></span>
<span class="line"><span>import tensorflow as tf   # 导入TensorFlow开源库</span></span>
<span class="line"><span>from npu_bridge.estimator import npu_ops   # 导入TensorFlow开源库中的npu_ops模块</span></span>
<span class="line"><span>import numpy as np    # 导入Python的数学基础库</span></span></code></pre></div></li><li><p>通过config()定义AI处理器和CPU上的运行参数。</p><p>当“execute_type“为“ai_core“时，代表在AI处理器上运行单算子网络，最终会调用到Ascend C算子。</p><p>当“execute_type“为“cpu“时，代表在Host侧的CPU运行单算子网络，调用的是TensorFlow算子。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def config(execute_type):</span></span>
<span class="line"><span>    if execute_type == &#39;ai_core&#39;:</span></span>
<span class="line"><span>        session_config = tf.ConfigProto(</span></span>
<span class="line"><span>            allow_soft_placement=True,</span></span>
<span class="line"><span>            log_device_placement=False,)</span></span>
<span class="line"><span>        custom_op = session_config.graph_options.rewrite_options.custom_optimizers.add()</span></span>
<span class="line"><span>        custom_op.name = &quot;NpuOptimizer&quot;</span></span>
<span class="line"><span>        custom_op.parameter_map[&quot;enable_data_pre_proc&quot;].b = True   # 开启数据预处理下沉到Device侧执行</span></span>
<span class="line"><span>        custom_op.parameter_map[&quot;mix_compile_mode&quot;].b = True    </span></span>
<span class="line"><span>        custom_op.parameter_map[&quot;use_off_line&quot;].b = True     # True表示在AI处理器上执行训练</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>    elif execute_type == &#39;cpu&#39;:</span></span>
<span class="line"><span>        session_config = tf.ConfigProto(</span></span>
<span class="line"><span>            allow_soft_placement=True,</span></span>
<span class="line"><span>            log_device_placement=False)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return session_config</span></span></code></pre></div></li><li><p>单算子网络测试用例主函数。</p><ul><li>算子输入请根据算子实际输入个数及shape进行构造。</li><li>算子输出的计算，请根据算子逻辑调用TensorFlow相关接口进行实现。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#设置np.allclose比较函数的公差参数。</span></span>
<span class="line"><span>#np.allclose比较函数的相对公差参数</span></span>
<span class="line"><span>atol = 0.001</span></span>
<span class="line"><span>#np.allclose比较函数的绝对公差参数</span></span>
<span class="line"><span>rtol = 0.001</span></span>
<span class="line"><span></span></span>
<span class="line"><span>def main(unused_argv):</span></span>
<span class="line"><span>    shape_params = (8, 2048)</span></span>
<span class="line"><span>    dtype_params = np.float16</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    # 构造Add算子的两个输入数据,shape为shape_params，范围在[-2,2]之间的随机数</span></span>
<span class="line"><span>    x_data = np.random.uniform(-2, 2, size=shape_params).astype(dtype_params)</span></span>
<span class="line"><span>    y_data = np.random.uniform(-2, 2, size=shape_params).astype(dtype_params)</span></span>
<span class="line"><span>    # 分别对Add算子的两个输入数据进行占位</span></span>
<span class="line"><span>    x = tf.compat.v1.placeholder(dtype_params, shape=shape_params)</span></span>
<span class="line"><span>    y = tf.compat.v1.placeholder(dtype_params, shape=shape_params)</span></span>
<span class="line"><span>    # 计算算子输出</span></span>
<span class="line"><span>    out = tf.math.add(x, y)</span></span>
<span class="line"><span>    # 在Host侧CPU上运行单算子，得到期望运行结果</span></span>
<span class="line"><span>    with tf.compat.v1.Session(config=config(&#39;cpu&#39;)) as session:</span></span>
<span class="line"><span>        result_cpu = session.run(out, feed_dict={x: x_data, y: y_data})</span></span>
<span class="line"><span>    # 在AI处理器上运行单算子，得到实际运行结果</span></span>
<span class="line"><span>    with tf.compat.v1.Session(config=config(&#39;ai_core&#39;)) as session:</span></span>
<span class="line"><span>        result_ai_core = session.run(out, feed_dict={x: x_data, y: y_data})</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    np.array(result_ai_core).astype(dtype_params)</span></span>
<span class="line"><span>    np.array(result_cpu).astype(dtype_params)</span></span>
<span class="line"><span>    print(&#39;====================================&#39;)</span></span>
<span class="line"><span>   # 通过np.allclose比较AI处理器上运行的实际结果和cpu上运行的期望结果，其中atol和rtol为np.allclose比较函数的相对公差参数和绝对公差参数</span></span>
<span class="line"><span>    cmp_result = np.allclose(result_ai_core, result_cpu, atol, rtol)</span></span>
<span class="line"><span>    print(cmp_result)</span></span>
<span class="line"><span>    print(&#39;====================================&#39;)</span></span></code></pre></div></li><li><p>运行单算子网络。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>if __name__ == &quot;__main__&quot;:</span></span>
<span class="line"><span>    tf.app.run()</span></span></code></pre></div></li></ol><h2 id="tensorflow自定义算子开发并映射到cann算子" tabindex="-1">TensorFlow自定义算子开发并映射到CANN算子 <a class="header-anchor" href="#tensorflow自定义算子开发并映射到cann算子" aria-label="Permalink to &quot;TensorFlow自定义算子开发并映射到CANN算子&quot;">​</a></h2><ol><li><p>适配插件代码开发。以自定义算子AddCustom为例，将该算子映射到TensorFlow自定义算子AddCustom上，需要先修改CANN AddCustom自定义算子工程目录framework/tf_plugin下插件代码，完成算子名映射：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>REGISTER_CUSTOM_OP(&quot;AddCustom&quot;)</span></span>
<span class="line"><span>  .FrameworkType(TENSORFLOW)      </span></span>
<span class="line"><span>  .OriginOpType(&quot;AddCustom&quot;) </span></span>
<span class="line"><span>  .ParseParamsByOperatorFn(AutoMappingByOpFn);</span></span></code></pre></div></li><li><p>TensorFlow自定义算子的开发。本节仅给出示例说明，详细内容请参考TensorFlow官方文档。</p><p>创建TensorFlow原型注册文件custom_assign_add_custom.cc，内容如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &quot;tensorflow/core/framework/op.h&quot;</span></span>
<span class="line"><span>#include &quot;tensorflow/core/framework/shape_inference.h&quot;</span></span>
<span class="line"><span>#include &quot;tensorflow/core/framework/op_kernel.h&quot;</span></span>
<span class="line"><span>#include &quot;tensorflow/core/framework/common_shape_fns.h&quot;</span></span>
<span class="line"><span>using namespace tensorflow;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 通过TensorFlow提供的REGISTER_OP接口完成算子原型的注册</span></span>
<span class="line"><span>REGISTER_OP(&quot;AddCustom&quot;)        // TensorFlow 注册算子名</span></span>
<span class="line"><span>    .Input(&quot;x: T&quot;)              // 算子原型，输入参数x，类型为T</span></span>
<span class="line"><span>    .Input(&quot;y: T&quot;)              // 算子原型，输入参数y，类型为T</span></span>
<span class="line"><span>    .Output(&quot;z: T&quot;)             // 算子原型，输入参数z，类型为T</span></span>
<span class="line"><span>    .Attr(&quot;T: {half}&quot;)          // T类型支持范围</span></span>
<span class="line"><span>    .SetShapeFn(shape_inference::BroadcastBinaryOpShapeFn);  // 算子shape信息推导，BroadcastBinaryOpShapeFn为TensorFlow提供的内置函数，输出shape信息由输入shape传播推导，即输入和输出shape保持一致</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 实现一个CPU版本的kernel函数，因为Tensorflow的计算图在构建时会检查所有的算子是否有任意设备上的kernel函数（NPU Kernel无法被感知），如果没有将会报错。这里实现一个固定返回错误的CPU kernel函数：</span></span>
<span class="line"><span>class AddCustomOp : public OpKernel {</span></span>
<span class="line"><span> public:</span></span>
<span class="line"><span>  explicit AddCustomOp(OpKernelConstruction* context) : OpKernel(context) {}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  void Compute(OpKernelContext* context) override {</span></span>
<span class="line"><span>    OP_REQUIRES_OK(context, errors::Unimplemented(&quot;AddCustomOp is not supported on CPU&quot;)); </span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>REGISTER_KERNEL_BUILDER(Name(&quot;AddCustom&quot;).Device(DEVICE_CPU), AddCustomOp);          // 注册AddCustom算子的CPU实现内核，该函数当前仅打印日志提示CPU不支持</span></span></code></pre></div><p>使用如下命令对上述代码进行编译，产物为libcustom_ops.so，后续的算子调用脚本中可通过load_op_library接口加载该so为python模块，从而调用自定义算子。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>TF_CFLAGS=( $(python3 -c &#39;import tensorflow as tf; print(&quot; &quot;.join(tf.sysconfig.get_compile_flags()))&#39;) )     // 获取TensorFlow编译选项</span></span>
<span class="line"><span>TF_LFLAGS=( $(python3 -c &#39;import tensorflow as tf; print(&quot; &quot;.join(tf.sysconfig.get_link_flags()))&#39;) )        // 获取TensorFlow链接选项</span></span>
<span class="line"><span>SOURCE_FILES=custom_assign_add_custom.cc                                                                     // 包含TensorFlow算子注册和CPU内核实现的cc文件</span></span>
<span class="line"><span>g++ -std=c++14 -shared $SOURCE_FILES -o \${Path}/libcustom_ops.so -fPIC \${TF_CFLAGS[@]} \${TF_LFLAGS[@]} -O2   // 编译命令，产物为libcustom_ops.so，TensorFlow即可通过load_op_library加载该so为python模块，调用自定义算子</span></span></code></pre></div></li><li><p>测试脚本中加载上一步骤编译好的动态库，实现自定义算子的调用。</p><ul><li><p>TensorFlow 1.15.0调用代码示例</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import os</span></span>
<span class="line"><span>import tensorflow as tf</span></span>
<span class="line"><span>import numpy as np</span></span>
<span class="line"><span>from npu_bridge.npu_init import *</span></span>
<span class="line"><span>tf.enable_resource_variables()</span></span>
<span class="line"><span>#np.allclose比较函数的相对公差参数</span></span>
<span class="line"><span>atol = 0.001</span></span>
<span class="line"><span>#np.allclose比较函数的绝对公差参数</span></span>
<span class="line"><span>rtol = 0.001</span></span>
<span class="line"><span>def main(unused_argv):</span></span>
<span class="line"><span>    custom_op_lib = tf.load_op_library(&#39;./outputs/libcustom_ops.so&#39;)     # 加载so为python模块</span></span>
<span class="line"><span>    shape_params = (8, 2048)</span></span>
<span class="line"><span>    dtype_params = np.float16</span></span>
<span class="line"><span>    x_data = np.random.uniform(-2, 2, size=shape_params).astype(dtype_params)</span></span>
<span class="line"><span>    y_data = np.random.uniform(-2, 2, size=shape_params).astype(dtype_params)</span></span>
<span class="line"><span>    x = tf.compat.v1.placeholder(dtype_params, shape=shape_params)</span></span>
<span class="line"><span>    y = tf.compat.v1.placeholder(dtype_params, shape=shape_params)</span></span>
<span class="line"><span>    tf_z = tf.math.add(x, y)                                           # 调用TensorFlow原生算子</span></span>
<span class="line"><span>    ac_z = custom_op_lib.add_custom(x, y)                              # 调用AscendC AddCustom自定义算子；add_custom是将REGISTER_OP(AddCustom)中的AddCustom由大驼峰命名转为下划线格式</span></span>
<span class="line"><span>    config = tf.ConfigProto()</span></span>
<span class="line"><span>    custom_op = config.graph_options.rewrite_options.custom_optimizers.add()</span></span>
<span class="line"><span>    custom_op.name = &quot;NpuOptimizer&quot;   # 配置在AI处理器上运行单算子</span></span>
<span class="line"><span>    config.graph_options.rewrite_options.remapping = RewriterConfig.OFF</span></span>
<span class="line"><span>    config.graph_options.rewrite_options.memory_optimization = RewriterConfig.OFF</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    with tf.Session(config=config) as sess:</span></span>
<span class="line"><span>        sess.run(tf.global_variables_initializer())</span></span>
<span class="line"><span>        tf_golden = sess.run(tf_z, feed_dict={x: x_data, y: y_data})</span></span>
<span class="line"><span>    with tf.Session(config=config) as sess:</span></span>
<span class="line"><span>        sess.run(tf.global_variables_initializer())</span></span>
<span class="line"><span>        ascend_out = sess.run(ac_z, feed_dict={x: x_data, y: y_data})</span></span>
<span class="line"><span>    np.array(tf_golden).astype(dtype_params)</span></span>
<span class="line"><span>    np.array(ascend_out).astype(dtype_params)</span></span>
<span class="line"><span>    print(&#39;====================================&#39;)</span></span>
<span class="line"><span>    # 通过np.allclose比较AI处理器上运行的实际结果和使用TensorFlow原生算子运行的期望结果，其中atol和rtol为np.allclose比较函数的相对公差参数和绝对公差参数。</span></span>
<span class="line"><span>    cmp_result = np.allclose(tf_golden, ascend_out, atol, rtol)</span></span>
<span class="line"><span>    print(cmp_result)</span></span>
<span class="line"><span>    print(&#39;====================================&#39;)</span></span>
<span class="line"><span>if __name__ == &quot;__main__&quot;:</span></span>
<span class="line"><span>    tf.app.run()</span></span></code></pre></div></li><li><p>TensorFlow 2.6.5调用代码</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import os</span></span>
<span class="line"><span>import tensorflow as tf</span></span>
<span class="line"><span>import numpy as np</span></span>
<span class="line"><span>import npu_device</span></span>
<span class="line"><span>from npu_device.compat.v1.npu_init import *</span></span>
<span class="line"><span>npu_device.compat.enable_v1()</span></span>
<span class="line"><span>tf.compat.v1.enable_resource_variables()</span></span>
<span class="line"><span>#np.allclose比较函数的相对公差参数</span></span>
<span class="line"><span>atol = 0.001</span></span>
<span class="line"><span>#np.allclose比较函数的绝对公差参数</span></span>
<span class="line"><span>rtol = 0.001</span></span>
<span class="line"><span>def main(unused_argv):</span></span>
<span class="line"><span>    custom_op_lib = tf.load_op_library(&#39;./outputs/libcustom_ops.so&#39;)     # 加载so为python模块</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    shape_params = (8, 2048)</span></span>
<span class="line"><span>    dtype_params = np.float16</span></span>
<span class="line"><span>    x_data = np.random.uniform(-2, 2, size=shape_params).astype(dtype_params)</span></span>
<span class="line"><span>    y_data = np.random.uniform(-2, 2, size=shape_params).astype(dtype_params)</span></span>
<span class="line"><span>    x = tf.compat.v1.placeholder(dtype_params, shape=shape_params)</span></span>
<span class="line"><span>    y = tf.compat.v1.placeholder(dtype_params, shape=shape_params)</span></span>
<span class="line"><span>    tf_z = tf.math.add(x, y)                                           # 调用TensorFlow原生算子</span></span>
<span class="line"><span>    ac_z = custom_op_lib.add_custom(x, y)                              # 调用AscendC AddCustom自定义算子；add_custom是将REGISTER_OP(AddCustom)中的AddCustom由大驼峰命名转为下划线格式    </span></span>
<span class="line"><span>    config = tf.compat.v1.ConfigProto()</span></span>
<span class="line"><span>    custom_op = config.graph_options.rewrite_options.custom_optimizers.add()</span></span>
<span class="line"><span>    custom_op.name = &quot;NpuOptimizer&quot;</span></span>
<span class="line"><span>    config.graph_options.rewrite_options.remapping = RewriterConfig.OFF</span></span>
<span class="line"><span>    config.graph_options.rewrite_options.memory_optimization = RewriterConfig.OFF</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    with tf.compat.v1.Session(config=config) as sess:</span></span>
<span class="line"><span>        sess.run(tf.global_variables_initializer())</span></span>
<span class="line"><span>        tf_golden = sess.run(tf_z, feed_dict={x: x_data, y: y_data})</span></span>
<span class="line"><span>    with tf.compat.v1.Session(config=config) as sess:</span></span>
<span class="line"><span>        sess.run(tf.global_variables_initializer())</span></span>
<span class="line"><span>        ascend_out = sess.run(ac_z, feed_dict={x: x_data, y: y_data})</span></span>
<span class="line"><span>    np.array(tf_golden).astype(dtype_params)</span></span>
<span class="line"><span>    np.array(ascend_out).astype(dtype_params)</span></span>
<span class="line"><span>    print(&#39;====================================&#39;)</span></span>
<span class="line"><span>    # 通过np.allclose比较AI处理器上运行的实际结果和使用TensorFlow原生算子运行的期望结果，其中atol和rtol为np.allclose比较函数的相对公差参数和绝对公差参数。</span></span>
<span class="line"><span>    cmp_result = np.allclose(tf_golden, ascend_out, atol, rtol)</span></span>
<span class="line"><span>    print(cmp_result)</span></span>
<span class="line"><span>    print(&#39;====================================&#39;)</span></span>
<span class="line"><span>if __name__ == &quot;__main__&quot;:</span></span>
<span class="line"><span>    tf.app.run()</span></span></code></pre></div></li></ul></li></ol><h2 id="可选输入算子映射关系开发" tabindex="-1">可选输入算子映射关系开发 <a class="header-anchor" href="#可选输入算子映射关系开发" aria-label="Permalink to &quot;可选输入算子映射关系开发&quot;">​</a></h2><p>TensorFlow的原型定义中不支持可选输入，对于包含可选输入的算子，其从TensorFlow到CANN的映射关系，不满足简单的一对一映射，需要在插件适配代码中，将输入转换为可选输入，调整原型的映射关系。下文以CANN算子库中的FlashAttentionScore算子为例，介绍针对此类算子的框架适配插件如何开发。</p><ol><li><p>适配插件开发</p><p>和上文中介绍的简单的一对一映射不同，进行插件适配开发时，需要调用ParseOpToGraphFn注册回调函数，回调函数中用于调整算子原型映射关系。此时：</p><ul><li>通过ParseParamsByOperatorFn注册回调函数，回调函数中将TensorFlow原生算子映射到一个IR和TensorFlow一致的中间算子（调用AutoMappingByOpFn完成属性映射）。</li><li>通过ParseOpToGraphFn注册回调函数，调整算子原型映射关系，将中间算子最终映射到CANN算子库中的算子，这里映射到Graph图的概念是指一个算子构成的单算子图。</li></ul><p>需要<strong>注意</strong>：在ParseParamsByOperatorFn的回调函数中，需要将TensorFlow算子名称设置到中间算子的original_type属性中，用于后续ParseOpToGraphFn回调函数的触发。示例代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &lt;string&gt;</span></span>
<span class="line"><span>#include &lt;vector&gt;</span></span>
<span class="line"><span>#include &quot;register/register.h&quot;</span></span>
<span class="line"><span>#include &quot;graph/operator.h&quot;</span></span>
<span class="line"><span>#include &quot;graph/graph.h&quot;</span></span>
<span class="line"><span>#include &quot;graph/operator_factory.h&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>namespace domi {</span></span>
<span class="line"><span>using namespace ge;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static Status AddOptionalPlaceholderForFA(const ge::Operator &amp;tf_op, ge::Graph &amp;graph) {</span></span>
<span class="line"><span>  // 1. 创建一个FlashAttentionScore算子npu_fa_op</span></span>
<span class="line"><span>  ge::AscendString op_name;</span></span>
<span class="line"><span>  tf_op.GetName(op_name);</span></span>
<span class="line"><span>  auto npu_fa_op = OperatorFactory::CreateOperator(op_name.GetString(), &quot;FlashAttentionScore&quot;);</span></span>
<span class="line"><span>  // 2. 将TensorFlow算子属性映射到npu_fa_op算子上</span></span>
<span class="line"><span>  float scale_value = 1.0;</span></span>
<span class="line"><span>  (void)tf_op.GetAttr(&quot;scale_value&quot;, scale_value);</span></span>
<span class="line"><span>  (void)npu_fa_op.SetAttr(&quot;scale_value&quot;, scale_value);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  float keep_prob = 1.0;</span></span>
<span class="line"><span>  (void)tf_op.GetAttr(&quot;keep_prob&quot;, keep_prob);</span></span>
<span class="line"><span>  (void)npu_fa_op.SetAttr(&quot;keep_prob&quot;, keep_prob);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  int32_t pre_tokens = 2147483647;</span></span>
<span class="line"><span>  (void)tf_op.GetAttr(&quot;pre_tokens&quot;, pre_tokens);</span></span>
<span class="line"><span>  (void)npu_fa_op.SetAttr(&quot;pre_tokens&quot;, pre_tokens);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  int32_t next_tokens = 2147483647;</span></span>
<span class="line"><span>  (void)tf_op.GetAttr(&quot;next_tokens&quot;, next_tokens);</span></span>
<span class="line"><span>  (void)npu_fa_op.SetAttr(&quot;next_tokens&quot;, next_tokens);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  int32_t head_num = 0;</span></span>
<span class="line"><span>  (void)tf_op.GetAttr(&quot;head_num&quot;, head_num);</span></span>
<span class="line"><span>  (void)npu_fa_op.SetAttr(&quot;head_num&quot;, head_num);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  std::string input_layout;</span></span>
<span class="line"><span>  (void)tf_op.GetAttr(&quot;input_layout&quot;, input_layout);</span></span>
<span class="line"><span>  (void)npu_fa_op.SetAttr(&quot;input_layout&quot;, input_layout);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  int32_t inner_precise = 0;</span></span>
<span class="line"><span>  (void)tf_op.GetAttr(&quot;inner_precise&quot;, inner_precise);</span></span>
<span class="line"><span>  (void)npu_fa_op.SetAttr(&quot;inner_precise&quot;, inner_precise);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  int32_t sparse_mode = 0;</span></span>
<span class="line"><span>  (void)tf_op.GetAttr(&quot;sparse_mode&quot;, sparse_mode);</span></span>
<span class="line"><span>  (void)npu_fa_op.SetAttr(&quot;sparse_mode&quot;, sparse_mode);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  int32_t pse_type = 1;</span></span>
<span class="line"><span>  (void)tf_op.GetAttr(&quot;pse_type&quot;, pse_type);</span></span>
<span class="line"><span>  (void)npu_fa_op.SetAttr(&quot;pse_type&quot;, pse_type);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  int32_t seed = 0;</span></span>
<span class="line"><span>  (void)tf_op.GetAttr(&quot;seed&quot;, seed);</span></span>
<span class="line"><span>  (void)npu_fa_op.SetAttr(&quot;seed&quot;, seed);</span></span>
<span class="line"><span>  int32_t offset = 0;</span></span>
<span class="line"><span>  (void)tf_op.GetAttr(&quot;offset&quot;, offset);</span></span>
<span class="line"><span>  (void)npu_fa_op.SetAttr(&quot;offset&quot;, offset);</span></span>
<span class="line"><span>  int32_t out_dtype = 0;</span></span>
<span class="line"><span>  (void)tf_op.GetAttr(&quot;out_dtype&quot;, out_dtype);</span></span>
<span class="line"><span>  (void)npu_fa_op.SetAttr(&quot;out_dtype&quot;, out_dtype);  </span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 3. 创建输入Data</span></span>
<span class="line"><span>  std::vector&lt;Operator&gt; inputs;</span></span>
<span class="line"><span>  for (size_t i = 0UL; i &lt; tf_op.GetInputsSize(); i++) {</span></span>
<span class="line"><span>    const std::string data_name = &quot;Data_&quot; + std::to_string(i);</span></span>
<span class="line"><span>    Operator data_op = OperatorFactory::CreateOperator(data_name.c_str(), &quot;Data&quot;);</span></span>
<span class="line"><span>    (void)data_op.SetAttr(&quot;index&quot;, static_cast&lt;int32_t&gt;(i));</span></span>
<span class="line"><span>    inputs.emplace_back(data_op);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  size_t index = 0UL;</span></span>
<span class="line"><span>  //4. 必选输入直接设置Data到算子输入</span></span>
<span class="line"><span>  (void)npu_fa_op.SetInput(&quot;query&quot;, inputs[index++]);</span></span>
<span class="line"><span>  (void)npu_fa_op.SetInput(&quot;key&quot;, inputs[index++]);</span></span>
<span class="line"><span>  (void)npu_fa_op.SetInput(&quot;value&quot;, inputs[index++]);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  // 5. 可选输入需要判断type属性的个数是否为0，不为0则表示可选输入已经使能</span></span>
<span class="line"><span>  std::vector&lt;DataType&gt; real_shift_type;</span></span>
<span class="line"><span>  (void)tf_op.GetAttr(&quot;real_shift_type&quot;, real_shift_type);</span></span>
<span class="line"><span>  if (!real_shift_type.empty()) {</span></span>
<span class="line"><span>    (void)npu_fa_op.SetInput(&quot;real_shift&quot;, inputs[index++]);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  std::vector&lt;DataType&gt; drop_mask_type;</span></span>
<span class="line"><span>  (void)tf_op.GetAttr(&quot;drop_mask_type&quot;, drop_mask_type);</span></span>
<span class="line"><span>  if (!drop_mask_type.empty()) {</span></span>
<span class="line"><span>    (void)npu_fa_op.SetInput(&quot;drop_mask&quot;, inputs[index++]);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  std::vector&lt;DataType&gt; padding_mask_type;</span></span>
<span class="line"><span>  (void)tf_op.GetAttr(&quot;padding_mask_type&quot;, padding_mask_type);</span></span>
<span class="line"><span>  if (!padding_mask_type.empty()) {</span></span>
<span class="line"><span>    (void)npu_fa_op.SetInput(&quot;padding_mask&quot;, inputs[index++]);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  std::vector&lt;DataType&gt; atten_mask_type;</span></span>
<span class="line"><span>  (void)tf_op.GetAttr(&quot;atten_mask_type&quot;, atten_mask_type);</span></span>
<span class="line"><span>  if (!atten_mask_type.empty()) {</span></span>
<span class="line"><span>    (void)npu_fa_op.SetInput(&quot;atten_mask&quot;, inputs[index++]);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  std::vector&lt;DataType&gt; prefix_type;</span></span>
<span class="line"><span>  (void)tf_op.GetAttr(&quot;prefix_type&quot;, prefix_type);</span></span>
<span class="line"><span>  if (!prefix_type.empty()) {</span></span>
<span class="line"><span>    (void)npu_fa_op.SetInput(&quot;prefix&quot;, inputs[index++]);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  std::vector&lt;DataType&gt; actual_seq_qlen_type;</span></span>
<span class="line"><span>  (void)tf_op.GetAttr(&quot;actual_seq_qlen_type&quot;, actual_seq_qlen_type);</span></span>
<span class="line"><span>  if (!actual_seq_qlen_type.empty()) {</span></span>
<span class="line"><span>    (void)npu_fa_op.SetInput(&quot;actual_seq_qlen&quot;, inputs[index++]);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  std::vector&lt;DataType&gt; actual_seq_kvlen_type;</span></span>
<span class="line"><span>  (void)tf_op.GetAttr(&quot;actual_seq_kvlen_type&quot;, actual_seq_kvlen_type);</span></span>
<span class="line"><span>  if (!actual_seq_kvlen_type.empty()) {</span></span>
<span class="line"><span>    (void)npu_fa_op.SetInput(&quot;actual_seq_kvlen&quot;, inputs[index++]);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  std::vector&lt;DataType&gt; q_start_idx_type;</span></span>
<span class="line"><span>  (void)tf_op.GetAttr(&quot;q_start_idx_type&quot;, q_start_idx_type);</span></span>
<span class="line"><span>  if (!q_start_idx_type.empty()) {</span></span>
<span class="line"><span>    (void)npu_fa_op.SetInput(&quot;q_start_idx&quot;, inputs[index++]);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  std::vector&lt;DataType&gt; kv_start_idx_type;</span></span>
<span class="line"><span>  (void)tf_op.GetAttr(&quot;kv_start_idx_type&quot;, kv_start_idx_type);</span></span>
<span class="line"><span>  if (!kv_start_idx_type.empty()) {</span></span>
<span class="line"><span>    (void)npu_fa_op.SetInput(&quot;kv_start_idx&quot;, inputs[index++]);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  std::vector&lt;DataType&gt; d_scale_q_type;</span></span>
<span class="line"><span>  (void)tf_op.GetAttr(&quot;d_scale_q_type&quot;, d_scale_q_type);</span></span>
<span class="line"><span>  if (!d_scale_q_type.empty()) {</span></span>
<span class="line"><span>    (void)npu_fa_op.SetInput(&quot;d_scale_q&quot;, inputs[index++]);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  std::vector&lt;DataType&gt; d_scale_k_type;</span></span>
<span class="line"><span>  (void)tf_op.GetAttr(&quot;d_scale_k_type&quot;, d_scale_k_type);</span></span>
<span class="line"><span>  if (!d_scale_k_type.empty()) {</span></span>
<span class="line"><span>    (void)npu_fa_op.SetInput(&quot;d_scale_k&quot;, inputs[index++]);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  std::vector&lt;DataType&gt; d_scale_v_type;</span></span>
<span class="line"><span>  (void)tf_op.GetAttr(&quot;d_scale_v_type&quot;, d_scale_v_type);</span></span>
<span class="line"><span>  if (!d_scale_v_type.empty()) {</span></span>
<span class="line"><span>    (void)npu_fa_op.SetInput(&quot;d_scale_v&quot;, inputs[index++]);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  std::vector&lt;DataType&gt; query_rope_type;</span></span>
<span class="line"><span>  (void)tf_op.GetAttr(&quot;query_rope_type&quot;, query_rope_type);</span></span>
<span class="line"><span>  if (!query_rope_type.empty()) {</span></span>
<span class="line"><span>    (void)npu_fa_op.SetInput(&quot;queryRope&quot;, inputs[index++]);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  std::vector&lt;DataType&gt; key_rope_type;</span></span>
<span class="line"><span>  (void)tf_op.GetAttr(&quot;key_rope_type&quot;, key_rope_type);</span></span>
<span class="line"><span>  if (!key_rope_type.empty()) {</span></span>
<span class="line"><span>    (void)npu_fa_op.SetInput(&quot;keyRope&quot;, inputs[index++]);</span></span>
<span class="line"><span>  }  </span></span>
<span class="line"><span>  // 6. 使用npu_fa_op算子的输出构造图的输出。</span></span>
<span class="line"><span>  std::vector&lt;std::pair&lt;Operator, std::vector&lt;size_t&gt;&gt;&gt; output_indexs;</span></span>
<span class="line"><span>  std::vector&lt;size_t&gt; node_output_index;</span></span>
<span class="line"><span>  for (size_t i = 0UL; i &lt; npu_fa_op.GetOutputsSize(); i++) {</span></span>
<span class="line"><span>    node_output_index.emplace_back(i);</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  (void)output_indexs.emplace_back(std::make_pair(npu_fa_op, node_output_index));</span></span>
<span class="line"><span>  (void)graph.SetInputs(inputs).SetOutputs(output_indexs);</span></span>
<span class="line"><span>  return SUCCESS;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static Status FlashAttentionScoreMapping(const ge::Operator&amp; op_src, ge::Operator&amp; op_dst) {</span></span>
<span class="line"><span>  // 1. 调用默认映射函数即可</span></span>
<span class="line"><span>  if (AutoMappingByOpFn(op_src, op_dst) != ge::GRAPH_SUCCESS) {</span></span>
<span class="line"><span>    return FAILED;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>  // 2. 需要将TensorFlow算子名称设置到op_dst的original_type属性中，用于后续ParseOpToGraphFn回调函数的触发</span></span>
<span class="line"><span>  op_dst.SetAttr(&quot;original_type&quot;, &quot;FlashAttentionScore&quot;);</span></span>
<span class="line"><span>  return SUCCESS;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>REGISTER_CUSTOM_OP(&quot;FlashAttentionScore&quot;)</span></span>
<span class="line"><span>    .FrameworkType(TENSORFLOW)</span></span>
<span class="line"><span>    .OriginOpType({&quot;FlashAttentionScore&quot;})</span></span>
<span class="line"><span>    .ParseParamsByOperatorFn(FlashAttentionScoreMapping) // 注册此函数用于实现算子本身属性的映射</span></span>
<span class="line"><span>    .ParseOpToGraphFn(AddOptionalPlaceholderForFA); // 注册此函数用于实现将tf中的输入转化为可选输入，改变连边关系</span></span>
<span class="line"><span>}  // namespace domi</span></span></code></pre></div></li><li><p>在TensorFlow开源框架里注册FlashAttentionScore算子的原型定义，由于TensorFlow不支持可选输入，需要将其可选输入在TensorFlow原型中表示为动态输入，并通过属性来标记动态输入的个数，<strong>这些可选输入需要放置在原型定义的最后</strong>。示例代码（FlashAttentionScore.cc）如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &lt;algorithm&gt;</span></span>
<span class="line"><span>#include &lt;atomic&gt;</span></span>
<span class="line"><span>#include &lt;map&gt; </span></span>
<span class="line"><span>#include &quot;tensorflow/core/framework/common_shape_fns.h&quot;</span></span>
<span class="line"><span>#include &quot;tensorflow/core/framework/op.h&quot;</span></span>
<span class="line"><span>#include &quot;tensorflow/core/framework/op_kernel.h&quot; </span></span>
<span class="line"><span>using namespace tensorflow;</span></span>
<span class="line"><span>using shape_inference::InferenceContext;</span></span>
<span class="line"><span>using shape_inference::ShapeHandle; </span></span>
<span class="line"><span>using namespace std;</span></span>
<span class="line"><span>using namespace chrono; </span></span>
<span class="line"><span>using OpKernelConstructionPtr = OpKernelConstruction*;</span></span>
<span class="line"><span>using OpKernelContextPtr = OpKernelContext*;</span></span>
<span class="line"><span>using InferenceContextPtr = ::tensorflow::shape_inference::InferenceContext*; </span></span>
<span class="line"><span>namespace {</span></span>
<span class="line"><span>class CustOps : public OpKernel {</span></span>
<span class="line"><span>public:    </span></span>
<span class="line"><span>     explicit CustOps(OpKernelConstructionPtr context) : OpKernel(context) {}</span></span>
<span class="line"><span>     void Compute(OpKernelContextPtr context) override</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        std::cout &lt;&lt; &quot;Cust Ops not installed!!&quot; &lt;&lt; std::endl;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>     ~CustOps() override = default;};</span></span>
<span class="line"><span>}  // namespace </span></span>
<span class="line"><span>namespace tensorflow {</span></span>
<span class="line"><span>REGISTER_OP(&quot;FlashAttentionScore&quot;)</span></span>
<span class="line"><span>    .Input(&quot;query: T&quot;)</span></span>
<span class="line"><span>    .Input(&quot;key: T&quot;)</span></span>
<span class="line"><span>    .Input(&quot;value: T&quot;)</span></span>
<span class="line"><span>    .Input(&quot;real_shift: real_shift_type&quot;)  // 可选输入在TensorFlow原型中注册为动态输入</span></span>
<span class="line"><span>    .Input(&quot;drop_mask: drop_mask_type&quot;)</span></span>
<span class="line"><span>    .Input(&quot;padding_mask: padding_mask_type&quot;)</span></span>
<span class="line"><span>    .Input(&quot;atten_mask: atten_mask_type&quot;)</span></span>
<span class="line"><span>    .Input(&quot;prefix: prefix_type&quot;)</span></span>
<span class="line"><span>    .Input(&quot;actual_seq_qlen: actual_seq_qlen_type&quot;)</span></span>
<span class="line"><span>    .Input(&quot;actual_seq_kvlen: actual_seq_kvlen_type&quot;)</span></span>
<span class="line"><span>    .Input(&quot;q_start_idx: q_start_idx_type&quot;)</span></span>
<span class="line"><span>    .Input(&quot;kv_start_idx: kv_start_idx_type&quot;)</span></span>
<span class="line"><span>    .Input(&quot;d_scale_q: d_scale_q_type&quot;)</span></span>
<span class="line"><span>    .Input(&quot;d_scale_k: d_scale_k_type&quot;)</span></span>
<span class="line"><span>    .Input(&quot;d_scale_v: d_scale_v_type&quot;)</span></span>
<span class="line"><span>    .Input(&quot;query_rope: query_rope_type&quot;)</span></span>
<span class="line"><span>    .Input(&quot;key_rope: key_rope_type&quot;)</span></span>
<span class="line"><span>    .Output(&quot;softmax_max: float32&quot;)</span></span>
<span class="line"><span>    .Output(&quot;softmax_sum: float32&quot;)</span></span>
<span class="line"><span>    .Output(&quot;softmax_out: T&quot;)</span></span>
<span class="line"><span>    .Output(&quot;attention_out: T&quot;)</span></span>
<span class="line"><span>    .Attr(&quot;scale_value: float = 1.0&quot;)</span></span>
<span class="line"><span>    .Attr(&quot;keep_prob: float = 1.0&quot;)</span></span>
<span class="line"><span>    .Attr(&quot;pre_tokens: int = 2147483647&quot;)</span></span>
<span class="line"><span>    .Attr(&quot;next_tokens: int = 2147483647&quot;)</span></span>
<span class="line"><span>    .Attr(&quot;head_num: int&quot;)</span></span>
<span class="line"><span>    .Attr(&quot;input_layout: string&quot;)</span></span>
<span class="line"><span>    .Attr(&quot;inner_precise: int = 0&quot;)</span></span>
<span class="line"><span>    .Attr(&quot;sparse_mode: int = 0&quot;)</span></span>
<span class="line"><span>    .Attr(&quot;pse_type: int = 1&quot;)</span></span>
<span class="line"><span>    .Attr(&quot;seed: int = 0&quot;)</span></span>
<span class="line"><span>    .Attr(&quot;offset: int = 0&quot;)</span></span>
<span class="line"><span>    .Attr(&quot;out_dtype: int = 0&quot;) </span></span>
<span class="line"><span>    .Attr(&quot;T: {float16, float32, bfloat16} = DT_FLOAT&quot;)</span></span>
<span class="line"><span>    .Attr(&quot;real_shift_type: list({float16, float32, bfloat16}) &gt;= 0&quot;) // 通过属性来标记动态输入个数</span></span>
<span class="line"><span>    .Attr(&quot;drop_mask_type: list({uint8}) &gt;= 0&quot;)</span></span>
<span class="line"><span>    .Attr(&quot;padding_mask_type: list({float16, float32, bfloat16}) &gt;= 0&quot;)</span></span>
<span class="line"><span>    .Attr(&quot;atten_mask_type: list({bool, uint8}) &gt;= 0&quot;)</span></span>
<span class="line"><span>    .Attr(&quot;prefix_type: list({int64}) &gt;= 0&quot;)</span></span>
<span class="line"><span>    .Attr(&quot;actual_seq_qlen_type: list({int64}) &gt;= 0&quot;)</span></span>
<span class="line"><span>    .Attr(&quot;actual_seq_kvlen_type: list({int64}) &gt;= 0&quot;)</span></span>
<span class="line"><span>    .Attr(&quot;q_start_idx_type: list({int64}) &gt;= 0&quot;)</span></span>
<span class="line"><span>    .Attr(&quot;kv_start_idx_type: list({int64}) &gt;= 0&quot;)</span></span>
<span class="line"><span>    .Attr(&quot;d_scale_q_type: list({float32}) &gt;= 0&quot;)</span></span>
<span class="line"><span>    .Attr(&quot;d_scale_k_type: list({float32}) &gt;= 0&quot;)</span></span>
<span class="line"><span>    .Attr(&quot;d_scale_v_type: list({float32}) &gt;= 0&quot;)</span></span>
<span class="line"><span>    .Attr(&quot;query_rope_type: list({float32}) &gt;= 0&quot;)</span></span>
<span class="line"><span>    .Attr(&quot;key_rope_type: list({float32}) &gt;= 0&quot;)</span></span>
<span class="line"><span>    .SetShapeFn([](InferenceContext *c) {</span></span>
<span class="line"><span>      return Status::OK();</span></span>
<span class="line"><span>    });</span></span>
<span class="line"><span>REGISTER_KERNEL_BUILDER(Name(&quot;FlashAttentionScore&quot;).Device(DEVICE_CPU), CustOps)}</span></span></code></pre></div><p>使用如下命令对上述代码进行编译，产物为libcustom_ops.so，后续的算子调用脚本中可通过load_op_library接口加载该so为python模块，从而调用自定义算子。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>TF_CFLAGS=( $(python3 -c &#39;import tensorflow as tf; print(&quot; &quot;.join(tf.sysconfig.get_compile_flags()))&#39;) )     // 获取TensorFlow编译选项</span></span>
<span class="line"><span>TF_LFLAGS=( $(python3 -c &#39;import tensorflow as tf; print(&quot; &quot;.join(tf.sysconfig.get_link_flags()))&#39;) )        // 获取TensorFlow链接选项</span></span>
<span class="line"><span>SOURCE_FILES=FlashAttentionScore.cc                                                                          // 包含TensorFlow算子注册和CPU内核实现的cc文件</span></span>
<span class="line"><span>g++ -std=c++14 -shared $SOURCE_FILES -o \${Path}/libflashattention.so -fPIC \${TF_CFLAGS[@]} \${TF_LFLAGS[@]} -O2   // 编译命令，产物为libflashattention.so，\${Path}为自定义的路径，后续TensorFlow可通过load_op_library加载该so为python模块，调用自定义算子</span></span></code></pre></div></li><li><p>封装一个TensorFlow的算子调用接口，在此接口中处理可选输入。在该脚本需要加载上一步骤编译好的动态库。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>from tensorflow.python.framework import ops</span></span>
<span class="line"><span>import tensorflow as tf</span></span>
<span class="line"><span>tfOpLib = tf.load_op_library(&quot;../build/tf_ops/libflashattention.so&quot;)</span></span>
<span class="line"><span># 假如外部未使能该可选输入，则给底层传入空列表</span></span>
<span class="line"><span>def create_optional_input_list(input):</span></span>
<span class="line"><span>    input_list = []</span></span>
<span class="line"><span>    if not input is None:</span></span>
<span class="line"><span>        input_list.append(input)</span></span>
<span class="line"><span>    return input_list</span></span>
<span class="line"><span># flash_attention_score 封装函数</span></span>
<span class="line"><span>def npu_flash_attention(query, key, value, head_num, input_layout, real_shift=None, drop_mask=None, padding_mask=None,</span></span>
<span class="line"><span>                        atten_mask=None, prefix=None, actual_seq_qlen=None, actual_seq_kvlen=None,</span></span>
<span class="line"><span>                        q_start_idx=None, kv_start_idx=None, d_scale_q=None,d_scale_k=None,d_scale_v=None,query_rope=None,key_rope=None,scale_value=1.0, keep_prob=1.0,</span></span>
<span class="line"><span>                        pre_tokens=2147483647, next_tokens=2147483647, inner_precise=0, sparse_mode=0,</span></span>
<span class="line"><span>                        pse_type=1,seed=0,offset=0,out_dtype=0</span></span>
<span class="line"><span>):</span></span>
<span class="line"><span>    output = tfOpLib.flash_attention_score(query=query, key=key, value=value,</span></span>
<span class="line"><span>            real_shift=create_optional_input_list(real_shift), drop_mask=create_optional_input_list(drop_mask),</span></span>
<span class="line"><span>            padding_mask=create_optional_input_list(padding_mask), atten_mask=create_optional_input_list(atten_mask),</span></span>
<span class="line"><span>            prefix=create_optional_input_list(prefix), actual_seq_qlen=create_optional_input_list(actual_seq_qlen),</span></span>
<span class="line"><span>            actual_seq_kvlen=create_optional_input_list(actual_seq_kvlen), q_start_idx=create_optional_input_list(q_start_idx),</span></span>
<span class="line"><span>            kv_start_idx=create_optional_input_list(kv_start_idx),d_scale_q=create_optional_input_list(d_scale_q),</span></span>
<span class="line"><span>            d_scale_k=create_optional_input_list(d_scale_k),d_scale_v=create_optional_input_list(d_scale_v),</span></span>
<span class="line"><span>            query_rope=create_optional_input_list(query_rope),key_rope=create_optional_input_list(key_rope),</span></span>
<span class="line"><span>            scale_value=scale_value, keep_prob=keep_prob, pre_tokens=pre_tokens, next_tokens=next_tokens,</span></span>
<span class="line"><span>            head_num=head_num, input_layout=input_layout, inner_precise=inner_precise, sparse_mode=sparse_mode,</span></span>
<span class="line"><span>            pse_type=pse_type,seed=seed,offset=offset,out_dtype=out_dtype</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span>    return output</span></span></code></pre></div></li><li><p>测试脚本中实现自定义算子的调用。假设<a href="#li17250141634510">上一步骤</a>中代码文件保存为ops.py，从ops中导入npu_flash_attention函数并使用。TensorFlow 2.6.5调用代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>import sys</span></span>
<span class="line"><span>from ops import npu_flash_attention</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import tensorflow as tf</span></span>
<span class="line"><span>import numpy as np</span></span>
<span class="line"><span>tf.compat.v1.disable_eager_execution()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>import npu_device</span></span>
<span class="line"><span>from npu_device.compat.v1.npu_init import *</span></span>
<span class="line"><span>npu_device.compat.enable_v1()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>def sess_config():</span></span>
<span class="line"><span>    config = tf.compat.v1.ConfigProto()</span></span>
<span class="line"><span>    custom_op = config.graph_options.rewrite_options.custom_optimizers.add()</span></span>
<span class="line"><span>    custom_op.name = &quot;NpuOptimizer&quot;</span></span>
<span class="line"><span>    config.graph_options.rewrite_options.remapping = RewriterConfig.OFF</span></span>
<span class="line"><span>    config.graph_options.rewrite_options.memory_optimization = RewriterConfig.OFF</span></span>
<span class="line"><span>    return config</span></span>
<span class="line"><span></span></span>
<span class="line"><span>shape = [1, 32, 32]</span></span>
<span class="line"><span>query_np = np.random.randn(*shape).astype(np.float16)</span></span>
<span class="line"><span>key_np = np.random.randn(*shape).astype(np.float16)</span></span>
<span class="line"><span>value_np = np.random.randn(*shape).astype(np.float16)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>query = tf.Variable(query_np, tf.float16)</span></span>
<span class="line"><span>key = tf.Variable(key_np, tf.float16)</span></span>
<span class="line"><span>value = tf.Variable(value_np, tf.float16)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>mask = tf.zeros(shape=(shape[0], 1, shape[1], shape[1]), dtype=tf.uint8)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>head_num = 1</span></span>
<span class="line"><span>input_layout = &quot;BSH&quot;</span></span>
<span class="line"><span>flash_result_t = npu_flash_attention(query, key, value, head_num, input_layout, atten_mask=mask)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>with tf.compat.v1.Session(config=sess_config()) as sess:</span></span>
<span class="line"><span>    sess.run(tf.compat.v1.global_variables_initializer())</span></span>
<span class="line"><span>    flash_result = sess.run(flash_result_t)</span></span>
<span class="line"><span>    print(flash_result)</span></span></code></pre></div></li></ol><h2 id="动态输入算子映射关系开发" tabindex="-1">动态输入算子映射关系开发 <a class="header-anchor" href="#动态输入算子映射关系开发" aria-label="Permalink to &quot;动态输入算子映射关系开发&quot;">​</a></h2><p>对于存在动态输入/输出的算子，需要在插件的回调函数ParseParamByOpFunc中使用AutoMappingByOpFnDynamic实现TensorFlow算子和CANN算子的匹配。通过DynamicInputOutputInfo结构类描述动态输入/输出的信息，将动态输入/输出的名称和描述其个数的属性名绑定，再传入AutoMappingByOpFnDynamic实现自动匹配。</p><p>以ParseSingleExample算子为例，插件适配代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &quot;register/register.h&quot;</span></span>
<span class="line"><span>namespace domi {</span></span>
<span class="line"><span>Status ParseSingleExampleMapping(const ge::Operator&amp; op_src, ge::Operator&amp; op) {</span></span>
<span class="line"><span>  std::vector&lt;DynamicInputOutputInfo&gt; value;</span></span>
<span class="line"><span>  const std::string dynamic_input_name_dense_defaults = &quot;dense_defaults&quot;;</span></span>
<span class="line"><span>  const std::string dynamic_input_attr_name_dense_defaults = &quot;Tdense&quot;;</span></span>
<span class="line"><span>  DynamicInputOutputInfo input(kInput, dynamic_input_name_dense_defaults.c_str(),</span></span>
<span class="line"><span>      dynamic_input_name_dense_defaults.size(), dynamic_input_attr_name_dense_defaults.c_str(),</span></span>
<span class="line"><span>      dynamic_input_attr_name_dense_defaults.size());</span></span>
<span class="line"><span>  value.push_back(input);</span></span>
<span class="line"><span>  const std::string dynamic_output_name_sparse_indices = &quot;sparse_indices&quot;;</span></span>
<span class="line"><span>  const std::string dynamic_output_attr_name_sparse_indices = &quot;num_sparse&quot;;</span></span>
<span class="line"><span>  DynamicInputOutputInfo output(kOutput, </span></span>
<span class="line"><span>      dynamic_output_name_sparse_indices.c_str(),</span></span>
<span class="line"><span>      dynamic_output_name_sparse_indices.size(), dynamic_output_attr_name_sparse_indices.c_str(),</span></span>
<span class="line"><span>      dynamic_output_attr_name_sparse_indices.size());</span></span>
<span class="line"><span>  value.push_back(output);</span></span>
<span class="line"><span>  const std::string dynamic_output_name_sparse_values = &quot;sparse_values&quot;;</span></span>
<span class="line"><span>  const std::string dynamic_output_attr_name_sparse_values = &quot;sparse_types&quot;;</span></span>
<span class="line"><span>  DynamicInputOutputInfo output1(kOutput, </span></span>
<span class="line"><span>      dynamic_output_name_sparse_values.c_str(),</span></span>
<span class="line"><span>      dynamic_output_name_sparse_values.size(), dynamic_output_attr_name_sparse_values.c_str(),</span></span>
<span class="line"><span>      dynamic_output_attr_name_sparse_values.size());</span></span>
<span class="line"><span>  value.push_back(output1);</span></span>
<span class="line"><span>  const std::string dynamic_output_name_sparse_shapes = &quot;sparse_shapes&quot;;</span></span>
<span class="line"><span>  const std::string dynamic_output_attr_name_sparse_shapes = &quot;sparse_types&quot;;</span></span>
<span class="line"><span>  DynamicInputOutputInfo output2(kOutput, </span></span>
<span class="line"><span>      dynamic_output_name_sparse_shapes.c_str(),</span></span>
<span class="line"><span>      dynamic_output_name_sparse_shapes.size(), dynamic_output_attr_name_sparse_shapes.c_str(),</span></span>
<span class="line"><span>      dynamic_output_attr_name_sparse_shapes.size());</span></span>
<span class="line"><span>  value.push_back(output2);</span></span>
<span class="line"><span>  const std::string dynamic_output_name_dense_values = &quot;dense_values&quot;;</span></span>
<span class="line"><span>  const std::string dynamic_output_attr_name_dense_values = &quot;Tdense&quot;;</span></span>
<span class="line"><span>  DynamicInputOutputInfo output3(kOutput, </span></span>
<span class="line"><span>      dynamic_output_name_dense_values.c_str(),</span></span>
<span class="line"><span>      dynamic_output_name_dense_values.size(), dynamic_output_attr_name_dense_values.c_str(),</span></span>
<span class="line"><span>      dynamic_output_attr_name_dense_values.size());</span></span>
<span class="line"><span>  value.push_back(output3);</span></span>
<span class="line"><span>  AutoMappingByOpFnDynamic(op_src, op, value);</span></span>
<span class="line"><span>  return SUCCESS;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// register ParseSingleExample op to GE</span></span>
<span class="line"><span>REGISTER_CUSTOM_OP(&quot;ParseSingleExample&quot;)</span></span>
<span class="line"><span>    .FrameworkType(TENSORFLOW)</span></span>
<span class="line"><span>    .OriginOpType(&quot;ParseSingleExample&quot;)</span></span>
<span class="line"><span>    .ParseParamsByOperatorFn(ParseSingleExampleMapping)</span></span>
<span class="line"><span>    }</span></span></code></pre></div><div class="note custom-block github-alert"><p class="custom-block-title">说明</p><p>暂不支持同时有可选输入和动态输入的算子映射。</p></div>`,29)])])}const f=n(l,[["render",i]]);export{m as __pageData,f as default};
