import{c as a,Q as n,j as p,m as e}from"./chunks/framework.DOi4mjdC.js";const h=JSON.parse('{"title":"图编译和图执行","description":"","frontmatter":{},"headers":[{"level":1,"title":"图编译和图执行","slug":"图编译和图执行"},{"level":2,"title":"环境要求","slug":"环境要求"},{"level":2,"title":"准备验证代码工程","slug":"准备验证代码工程"},{"level":2,"title":"生成单算子离线模型文件","slug":"生成单算子离线模型文件"},{"level":2,"title":"编写验证代码","slug":"编写验证代码"},{"level":2,"title":"运行和验证","slug":"运行和验证"}],"relativePath":"guide/编程指南/高级编程/高级特性/算子入图开发/图编译和图执行.md","filePath":"guide/编程指南/高级编程/高级特性/算子入图开发/图编译和图执行.md"}'),t={name:"guide/编程指南/高级编程/高级特性/算子入图开发/图编译和图执行.md"};function l(i,s,o,c,u,r){return n(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="图编译和图执行" tabindex="-1">图编译和图执行 <a class="header-anchor" href="#图编译和图执行" aria-label="Permalink to &quot;图编译和图执行&quot;">​</a></h1><p>本节通过单算子模型执行的样例来介绍图模式下图编译和图执行流程。单算子模型执行是指基于图IR执行算子，先编译算子（例如，使用ATC工具将Ascend IR定义的单算子描述文件编译成算子om模型文件），再调用acl接口加载算子模型，最后调用acl接口执行算子。</p><h2 id="环境要求" tabindex="-1">环境要求 <a class="header-anchor" href="#环境要求" aria-label="Permalink to &quot;环境要求&quot;">​</a></h2><ul><li><p>已参考<a href="./../../../../入门教程/环境准备.html">环境准备</a>，完成CANN驱动和软件的安装，配置CANN软件所需基本环境变量。</p><p>安装CANN软件后，使用CANN运行用户进行编译、运行时，需要以CANN运行用户登录环境，执行source $<em>{INSTALL_DIR}</em>/set_env.sh命令设置环境变量。\${INSTALL_DIR}请替换为CANN软件安装后文件存储路径。以root用户安装为例，安装后文件默认存储路径为：/usr/local/Ascend/cann。</p></li><li><p>已参考<a href="./../Aclnn算子工程化开发/概述.html">Aclnn算子工程化开发</a>完成算子的开发和部署。</p></li></ul><h2 id="准备验证代码工程" tabindex="-1">准备验证代码工程 <a class="header-anchor" href="#准备验证代码工程" aria-label="Permalink to &quot;准备验证代码工程&quot;">​</a></h2><p>代码工程目录结构如下，您可以单击<a href="https://gitcode.com/cann/asc-devkit/tree/master/examples/01_simd_cpp_api/02_features/01_invocation/aclop_invocation" target="_blank" rel="noreferrer">LINK</a>，获取样例工程的完整样例：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>├── aclop_invocation</span></span>
<span class="line"><span>│   ├── add_custom.json                   // 算子描述文件，用于构造单算子模型文件</span></span>
<span class="line"><span>│   ├── CMakeLists.txt</span></span>
<span class="line"><span>│   └── main.cpp                          // 将单算子编译为om文件并加载om文件执行</span></span></code></pre></div><h2 id="生成单算子离线模型文件" tabindex="-1">生成单算子离线模型文件 <a class="header-anchor" href="#生成单算子离线模型文件" aria-label="Permalink to &quot;生成单算子离线模型文件&quot;">​</a></h2><ol><li><p>构造静态shape单算子描述文件add_custom_static_shape.json，描述算子的输入、输出及属性等信息。</p><p>AddCustom静态shape算子的描述文件示例如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        &quot;op&quot;: &quot;AddCustom&quot;,</span></span>
<span class="line"><span>        &quot;input_desc&quot;: [</span></span>
<span class="line"><span>            {</span></span>
<span class="line"><span>                &quot;name&quot;: &quot;x&quot;,</span></span>
<span class="line"><span>                &quot;param_type&quot;: &quot;required&quot;,</span></span>
<span class="line"><span>                &quot;format&quot;: &quot;ND&quot;,</span></span>
<span class="line"><span>                &quot;shape&quot;: [8, 2048],</span></span>
<span class="line"><span>                &quot;type&quot;: &quot;float16&quot;</span></span>
<span class="line"><span>            },</span></span>
<span class="line"><span>            {</span></span>
<span class="line"><span>                &quot;name&quot;: &quot;y&quot;,</span></span>
<span class="line"><span>                &quot;param_type&quot;: &quot;required&quot;,</span></span>
<span class="line"><span>                &quot;format&quot;:&quot;ND&quot;,</span></span>
<span class="line"><span>                &quot;shape&quot;: [8, 2048],</span></span>
<span class="line"><span>                &quot;type&quot;: &quot;float16&quot;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        ],</span></span>
<span class="line"><span>        &quot;output_desc&quot;: [</span></span>
<span class="line"><span>            {</span></span>
<span class="line"><span>                &quot;name&quot;: &quot;z&quot;,</span></span>
<span class="line"><span>                &quot;param_type&quot;: &quot;required&quot;,</span></span>
<span class="line"><span>                &quot;format&quot;:  &quot;ND&quot;,</span></span>
<span class="line"><span>                &quot;shape&quot;: [8, 2048],</span></span>
<span class="line"><span>                &quot;type&quot;: &quot;float16&quot;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        ]</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>]</span></span></code></pre></div></li><li><p>使用ATC工具，将该算子描述文件编译成单算子模型文件（*.om文件）</p><p>ATC工具的命令示例如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>atc --singleop=op_verify/run/out/test_data/config/add_custom_static_shape.json --output=. --soc_version=&lt;soc_version&gt;</span></span></code></pre></div><p>关键参数解释如下：</p><ul><li>--singleop：单算子描述文件（json格式）的路径。</li><li>--output：存放om模型文件的目录。</li><li>--soc_version：配置为AI处理器的型号，请根据实际环境进行替换。</li></ul><p>以上命令执行后，会在output参数指定路径下生成*.om后缀的离线模型文件。</p></li></ol><h2 id="编写验证代码" tabindex="-1">编写验证代码 <a class="header-anchor" href="#编写验证代码" aria-label="Permalink to &quot;编写验证代码&quot;">​</a></h2><p>您可以参考如下样例编写单算子加载、执行的代码逻辑。</p><p>以下是关键步骤的代码示例，不可以直接拷贝编译运行，仅供参考，调用接口后，需增加异常处理的分支，并记录报错日志、提示日志，此处不一一列举。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 1.初始化</span></span>
<span class="line"><span>CHECK_ACL(aclInit(nullptr));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 2.运行管理资源申请</span></span>
<span class="line"><span>const int32_t deviceId = 0;</span></span>
<span class="line"><span>CHECK_ACL(aclrtSetDevice(deviceId));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 3.加载单算子模型文件（*.om文件）</span></span>
<span class="line"><span>CHECK_ACL(aclopSetModelDir(&quot;.&quot;));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 4.设置算子的输入，申请内存，然后读取输入数据保存至申请的内存中</span></span>
<span class="line"><span>// ......</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 5.创建Stream流</span></span>
<span class="line"><span>aclrtStream stream = nullptr;</span></span>
<span class="line"><span>aclrtCreateStream(&amp;stream);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 6.执行算子</span></span>
<span class="line"><span>// opType表示算子类型名称，例如AddCustom</span></span>
<span class="line"><span>// inputDesc.size()表示算子输入个数，例如AddCustom算子是2个输入</span></span>
<span class="line"><span>// inputDesc.data()表示算子输入tensor描述的数组，描述每个输入的format、shape、数据类型</span></span>
<span class="line"><span>// inputBuffers.data()表示算子输入tensor数据</span></span>
<span class="line"><span>// outputDesc.size()表示算子输出个数，例如AddCustom算子是1个输出</span></span>
<span class="line"><span>// outputDesc.data()表示算子输出tensor描述的数组，描述每个输出的format、shape、数据类型</span></span>
<span class="line"><span>// outputBuffers.data()表示算子输出tensor数据</span></span>
<span class="line"><span>// opAttr表示算子属性，如果算子没有属性，也需要调用aclopCreateAttr接口创建aclopAttr类型的数据</span></span>
<span class="line"><span>// stream用于维护一些异步操作的执行顺序</span></span>
<span class="line"><span></span></span>
<span class="line"><span>CHECK_ACL(aclopExecuteV2(opType, inputDesc.size(), inputDesc.data(), inputBuffers.data(),</span></span>
<span class="line"><span>                             outputDesc.size(), outputDesc.data(), outputBuffers.data(), opAttr, stream));</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 7.阻塞应用运行，直到指定Stream中的所有任务都完成</span></span>
<span class="line"><span>aclrtSynchronizeStream(stream);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 8.处理执行算子后的输出数据，例如在屏幕上显示、写入文件等，由用户根据实际情况自行实现</span></span>
<span class="line"><span>// ......</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 9.释放stream流</span></span>
<span class="line"><span>aclrtDestroyStream(stream);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 10.释放运行管理资源</span></span>
<span class="line"><span>aclRet = aclrtResetDevice(deviceId);</span></span>
<span class="line"><span>aclRet = aclFinalize();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// ....</span></span></code></pre></div><h2 id="运行和验证" tabindex="-1">运行和验证 <a class="header-anchor" href="#运行和验证" aria-label="Permalink to &quot;运行和验证&quot;">​</a></h2><ol><li><p>开发环境上，设置环境变量，配置单算子验证程序编译依赖的头文件与库文件路径，如下为设置环境变量的示例。\${INSTALL_DIR}请替换为CANN软件安装后文件存储路径。以root用户安装为例，安装后文件默认存储路径为：/usr/local/Ascend/cann。{arch-os}为运行环境的架构和操作系统，arch表示操作系统架构，os表示操作系统，例如x86_64-linux。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>export DDK_PATH=\${INSTALL_DIR}</span></span>
<span class="line"><span>export NPU_HOST_LIB=\${INSTALL_DIR}/{arch-os}/devlib</span></span></code></pre></div></li><li><p>编译样例工程，生成单算子验证可执行文件。</p><ol><li><p>切换到样例工程根目录，然后在样例工程根目录下执行如下命令创建目录用于存放编译文件，例如，创建的目录为“build“。</p><p><strong>mkdir -p build</strong></p></li><li><p>进入build目录，执行cmake编译命令，生成编译文件</p><p>命令示例如下所示：</p><p><strong>cd build</strong></p><p><strong>cmake ../src -DCMAKE_SKIP_RPATH=TRUE</strong></p></li><li><p>执行如下命令，生成可执行文件。</p><p><strong>make</strong></p><p>会在工程目录的output目录下生成可执行文件<strong>execute_add_op</strong>。</p></li></ol></li><li><p>执行单算子</p><ol><li><p>以运行用户（例如HwHiAiUser）拷贝开发环境中样例工程output下的<strong>execute_add_op</strong>到运行环境任一目录。</p><p>说明： 若您的开发环境即为运行环境，此拷贝操作可跳过。</p></li><li><p>在运行环境中，执行<strong>execute_add_op</strong>文件，验证单算子模型文件。</p><p><strong>chmod +x execute_add_op</strong></p><p><strong>./execute_add_op</strong></p><p>如果有test pass，表明执行成功。</p></li></ol></li></ol>`,15)])])}const m=a(t,[["render",l]]);export{h as __pageData,m as default};
