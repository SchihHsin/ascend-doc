import{c as a,Q as s,j as e,m as p}from"./chunks/framework.DOi4mjdC.js";const t="/assets/Pytorch%E6%A1%86%E6%9E%B6%E9%83%A8%E7%BD%B2%E6%96%B9%E5%BC%8F.Cxh4HhI0.png",_=JSON.parse('{"title":"PyTorch框架","description":"","frontmatter":{},"headers":[{"level":1,"title":"PyTorch框架","slug":"pytorch框架"},{"level":2,"title":"torch.library","slug":"torchlibrary"},{"level":2,"title":"Pybind","slug":"pybind"}],"relativePath":"guide/编程指南/高级编程/高级特性/AI框架算子适配/PyTorch框架.md","filePath":"guide/编程指南/高级编程/高级特性/AI框架算子适配/PyTorch框架.md"}'),l={name:"guide/编程指南/高级编程/高级特性/AI框架算子适配/PyTorch框架.md"};function c(i,n,r,o,d,h){return s(),e("div",null,[...n[0]||(n[0]=[p('<h1 id="pytorch框架" tabindex="-1">PyTorch框架 <a class="header-anchor" href="#pytorch框架" aria-label="Permalink to &quot;PyTorch框架&quot;">​</a></h1><p>通过PyTorch框架进行模型的训练、推理时，会调用很多算子进行计算。开发者开发的自定义算子如果需要集成部署到PyTorch框架，有如下几种方式：</p><ul><li>Kernel直调：通过适配torch.library或Pybind注册自定义算子，可以实现PyTorch框架调用算子Kernel程序。</li><li>单算子API调用：该模式下的适配插件开发流程和具体样例请参见 <a href="https://www.hiascend.com/document/redirect/pytorchuserguide" target="_blank" rel="noreferrer">《Ascend Extension for PyTorch》</a> 中的“《Ascend Extension for PyTorch 框架特性指南》 &gt; 基于OpPlugin算子适配开发”章节。</li><li>图模式调用：自定义算子在Pytorch图模式下的适配开发指导请参见 <a href="https://www.hiascend.com/document/redirect/pytorchuserguide" target="_blank" rel="noreferrer">《Ascend Extension for PyTorch》</a> 中的“《Pytorch图模式使用(TorchAir)》 &gt; 自定义算子入图”章节。</li></ul><p><strong>图 1</strong> Pytorch框架部署方式<br><img src="'+t+`" alt="" title="Pytorch框架部署方式"></p><p><strong>本节主要提供通过torch.library与Pybind注册自定义算子并实现PyTorch框架调用算子Kernel程序的指导。</strong></p><ul><li>torch.library是用于扩展PyTorch核心算子库的API集合。它允许开发者创建新的算子、并为其提供自定义实现。</li><li>Pybind是一个开源的C++和Python之间的桥接工具，它旨在使C++代码能够无缝地集成到Python环境中。</li></ul><p>Pybind适用于快速将C++函数暴露给Python，实现高效接口绑定。但其生成的算子无法被PyTorch的算子系统识别，不具备schema定义与图追踪能力，因此不支持torch.compile优化。相比之下，torch.library提供了与PyTorch核心算子系统深度集成的机制，支持算子注册、schema定义和图追踪能力，是支持torch.compile的必要条件。开发者可根据需求选择对应方式。</p><h2 id="torch-library" tabindex="-1">torch.library <a class="header-anchor" href="#torch-library" aria-label="Permalink to &quot;torch.library&quot;">​</a></h2><p>下面代码以add_custom（Add自定义算子为例）算子为例，介绍通过torch.library如何调用算子Kernel程序，文档中仅介绍核心步骤，完整样例请参考<a href="https://gitcode.com/cann/asc-devkit/tree/master/examples/01_simd_cpp_api/02_features/02_framework/00_pytorch/torch_library" target="_blank" rel="noreferrer">torch.library样例</a>。</p><ol><li><p>环境准备。</p><p>除了按照<a href="./../../../../入门教程/环境准备.html">环境准备</a>进行CANN软件包的安装，还需要安装以下依赖：</p><ul><li><a href="https://www.hiascend.com/document/detail/zh/Pytorch/60RC3/configandinstg/instg/insg_0005.html" target="_blank" rel="noreferrer">安装PyTorch框架</a></li><li><a href="https://www.hiascend.com/document/detail/zh/Pytorch/60RC3/configandinstg/instg/insg_0006.html" target="_blank" rel="noreferrer">安装torch_npu插件</a></li></ul></li><li><p>实现NPU上的自定义算子。</p><p>包括算子Kernel实现，并使用&lt;&lt;&lt;&gt;&gt;&gt;接口调用算子核函数完成指定的运算。样例中的c10_npu::getCurrentNPUStream接口用于获取当前npu流，返回值类型NPUStream，使用方式请参考 <a href="https://www.hiascend.com/document/redirect/pytorchuserguide" target="_blank" rel="noreferrer">《Ascend Extension for PyTorch》</a> 中的“API &gt;《Ascend Extension for PyTorch 自定义API参考》”。</p><p>需要注意的是，本样例的输入x，y的内存是在外层的Python调用脚本中分配的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>namespace ascendc_ops {</span></span>
<span class="line"><span>at::Tensor ascendc_add(const at::Tensor&amp; x, const at::Tensor&amp; y)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    // 运行资源申请，通过c10_npu::getCurrentNPUStream()的函数获取当前NPU上的流</span></span>
<span class="line"><span>    auto aclStream = c10_npu::getCurrentNPUStream().stream(false);</span></span>
<span class="line"><span>    // 分配Device侧输出内存</span></span>
<span class="line"><span>    at::Tensor z = at::empty_like(x);</span></span>
<span class="line"><span>    uint32_t numBlocks = 8;</span></span>
<span class="line"><span>    uint32_t totalLength = 1;</span></span>
<span class="line"><span>    for (uint32_t size : x.sizes()) {</span></span>
<span class="line"><span>        totalLength *= size;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    // 用&lt;&lt;&lt;&gt;&gt;&gt;接口调用核函数完成指定的运算</span></span>
<span class="line"><span>    add_custom&lt;&lt;&lt;numBlocks, nullptr, aclStream&gt;&gt;&gt;((uint8_t*)(x.mutable_data_ptr()), (uint8_t*)(y.mutable_data_ptr()), (uint8_t*)(z.mutable_data_ptr()), totalLength);</span></span>
<span class="line"><span>    // 将Device上的运算结果拷贝回Host并释放申请的资源</span></span>
<span class="line"><span>    return z;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>} // namespace ascendc_ops</span></span></code></pre></div></li><li><p>自定义算子的注册。</p><p>PyTorch提供TORCH_LIBRARY宏作为自定义算子注册的核心接口，用于创建并初始化自定义算子库，注册后在Python侧可以通过torch.ops.namespace.op_name方式进行调用。TORCH_LIBRARY_IMPL用于将算子逻辑绑定到特定的DispatchKey（PyTorch设备调度标识），针对NPU设备，需要将算子实现注册到PrivateUse1这一专属的DispatchKey上。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 注册算子到torch.library</span></span>
<span class="line"><span>TORCH_LIBRARY(ascendc_ops, m)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    m.def(&quot;ascendc_add(Tensor x, Tensor y) -&gt; Tensor&quot;);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 注册PrivateUse1实现，NPU设备</span></span>
<span class="line"><span>TORCH_LIBRARY_IMPL(ascendc_ops, PrivateUse1, m)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    m.impl(&quot;ascendc_add&quot;, TORCH_FN(ascendc_ops::ascendc_add));</span></span>
<span class="line"><span>}</span></span></code></pre></div></li><li><p>编译生成算子动态库。</p></li><li><p>使用Python测试脚本进行测试。</p><p>在add_custom_test.py中，首先通过torch.ops.load_library加载生成的自定义算子库，调用注册的ascendc_add函数，并通过对比NPU输出与CPU标准加法结果来验证自定义算子的数值正确性。</p></li></ol><h2 id="pybind" tabindex="-1">Pybind <a class="header-anchor" href="#pybind" aria-label="Permalink to &quot;Pybind&quot;">​</a></h2><p>下面代码以add_custom算子为例，介绍通过Pybind方式实现Pytorch脚本中调用自定义算子的流程。文档中仅介绍核心步骤，完整样例请参考<a href="https://gitcode.com/cann/asc-devkit/tree/master/examples/01_simd_cpp_api/02_features/02_framework/00_pytorch/pybind" target="_blank" rel="noreferrer">Pybind样例</a>。</p><ol><li><p>环境准备。</p><p>除了按照<a href="./../../../../入门教程/环境准备.html">环境准备</a>进行CANN软件包的安装，还需要安装以下依赖：</p><ul><li><p><a href="https://www.hiascend.com/document/detail/zh/Pytorch/60RC3/configandinstg/instg/insg_0005.html" target="_blank" rel="noreferrer">安装PyTorch框架</a></p></li><li><p><a href="https://www.hiascend.com/document/detail/zh/Pytorch/60RC3/configandinstg/instg/insg_0006.html" target="_blank" rel="noreferrer">安装torch_npu插件</a></p></li><li><p>安装pybind11</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>pip3 install pybind11 expecttest</span></span></code></pre></div></li></ul></li><li><p>实现NPU上的自定义算子。</p><p>包括算子Kernel实现，并使用&lt;&lt;&lt;&gt;&gt;&gt;接口调用算子核函数完成指定的运算。样例中的c10_npu::getCurrentNPUStream接口用于获取当前npu流，返回值类型NPUStream，使用方式请参考《Ascend Extension for PyTorch 自定义API参考》中的“（beta）c10_npu::getCurrentNPUStream”章节。</p><p>需要注意的是，本样例的输入x，y的内存是在Python调用脚本中分配的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// Pybind和PyTorch调用所需的头文件</span></span>
<span class="line"><span>#include &lt;pybind11/pybind11.h&gt;</span></span>
<span class="line"><span>#include &lt;torch/extension.h&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#include &quot;torch_npu/csrc/core/npu/NPUStream.h&quot;</span></span>
<span class="line"><span>// Kernel侧实现需要的头文件</span></span>
<span class="line"><span>#include &quot;kernel_operator.h&quot; </span></span>
<span class="line"><span>...</span></span>
<span class="line"><span>namespace ascendc_ops {</span></span>
<span class="line"><span>at::Tensor ascendc_add(const at::Tensor&amp; x, const at::Tensor&amp; y)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    // 运行资源申请，通过c10_npu::getCurrentNPUStream()的函数获取当前NPU上的流</span></span>
<span class="line"><span>    auto aclStream = c10_npu::getCurrentNPUStream().stream(false);</span></span>
<span class="line"><span>    // 分配Device侧输出内存</span></span>
<span class="line"><span>    at::Tensor z = at::empty_like(x);</span></span>
<span class="line"><span>    uint32_t numBlocks = 8;</span></span>
<span class="line"><span>    uint32_t totalLength = 1;</span></span>
<span class="line"><span>    for (uint32_t size : x.sizes()) {</span></span>
<span class="line"><span>        totalLength *= size;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    // 用&lt;&lt;&lt;&gt;&gt;&gt;接口调用核函数完成指定的运算</span></span>
<span class="line"><span>    add_custom&lt;&lt;&lt;numBlocks, nullptr, aclStream&gt;&gt;&gt;((uint8_t*)(x.mutable_data_ptr()), (uint8_t*)(y.mutable_data_ptr()), (uint8_t*)(z.mutable_data_ptr()), totalLength);</span></span>
<span class="line"><span>    // 将Device上的运算结果拷贝回Host并释放申请的资源</span></span>
<span class="line"><span>    return z;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>} // namespace ascendc_ops</span></span></code></pre></div></li><li><p>定义Pybind模块，将C++函数封装成Python函数。PYBIND11_MODULE是Pybind11库中的一个宏，用于定义一个Python模块。它接受两个参数，第一个参数是封装后的模块名，第二个参数是一个Pybind11模块对象，用于定义模块中的函数、类、常量等。通过调用m.def()方法，可以将上一步骤中函数ascendc_ops::ascendc_add转成Python函数ascendc_add，使其可以在Python代码中被调用。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>PYBIND11_MODULE(ascendc_ops, m)// 模块名ascendc_ops，模块对象m</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    m.doc() = &quot;add_custom pybind11 interfaces&quot;;// optional module docstring</span></span>
<span class="line"><span>    m.def(&quot;ascendc_add&quot;, &amp;ascendc_ops::ascendc_add, &quot;&quot;);// 将函数ascendc_add与Pybind模块进行绑定</span></span>
<span class="line"><span>}</span></span></code></pre></div></li><li><p>编译生成算子动态库。</p></li><li><p>在Python调用脚本中，使用torch接口生成随机输入数据并分配内存，通过导入封装的自定义模块ascendc_ops，调用自定义模块ascendc_ops中的run_add_custom函数，从而在NPU上执行算子。</p></li></ol>`,13)])])}const m=a(l,[["render",c]]);export{_ as __pageData,m as default};
