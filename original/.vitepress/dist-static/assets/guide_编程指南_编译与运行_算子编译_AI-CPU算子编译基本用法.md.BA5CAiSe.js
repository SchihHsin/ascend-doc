import{c as a,Q as s,j as l,m as n}from"./chunks/framework.DOi4mjdC.js";const d=JSON.parse('{"title":"AI CPU算子编译","description":"","frontmatter":{},"headers":[{"level":1,"title":"AI CPU算子编译","slug":"ai-cpu算子编译"},{"level":2,"title":"通过bisheng命令行编译","slug":"通过bisheng命令行编译"},{"level":1,"title":"--npu-arch用于指定NPU的架构版本，dav-后为架构版本号，各产品型号对应的架构版本号请通过[对应关系表](../语言扩展层/SIMD-BuiltIn关键字.md#table65291052154114)进行查询。","slug":"npu-arch用于指定npu的架构版本dav-后为架构版本号各产品型号对应的架构版本号请通过对应关系表语言扩展层simd-builtin关键字mdtable65291052154114进行查询"},{"level":2,"title":"AI CPU算子常用编译选项","slug":"ai-cpu算子常用编译选项"},{"level":2,"title":"CMake方式编译","slug":"cmake方式编译"},{"level":1,"title":"1、find_package()是CMake中用于查找和配置Ascend C编译工具链的命令","slug":"1find_package是cmake中用于查找和配置ascend-c编译工具链的命令"},{"level":1,"title":"2、指定项目支持的语言包括ASC、AICPU和CXX，ASC表示支持使用毕昇编译器对Ascend C编程语言进行编译，AI CPU表示支持使用毕昇编译器对AI CPU算子进行编译","slug":"2指定项目支持的语言包括ascaicpu和cxxasc表示支持使用毕昇编译器对ascend-c编程语言进行编译ai-cpu表示支持使用毕昇编译器对ai-cpu算子进行编译"},{"level":1,"title":"3、使用CMake接口编译可执行文件","slug":"3使用cmake接口编译可执行文件"}],"relativePath":"guide/编程指南/编译与运行/算子编译/AI-CPU算子编译基本用法.md","filePath":"guide/编程指南/编译与运行/算子编译/AI-CPU算子编译基本用法.md"}'),p={name:"guide/编程指南/编译与运行/算子编译/AI-CPU算子编译基本用法.md"};function o(e,t,i,c,u,g){return s(),l("div",null,[...t[0]||(t[0]=[n(`<h1 id="ai-cpu算子编译" tabindex="-1">AI CPU算子编译 <a class="header-anchor" href="#ai-cpu算子编译" aria-label="Permalink to &quot;AI CPU算子编译&quot;">​</a></h1><h2 id="通过bisheng命令行编译" tabindex="-1">通过bisheng命令行编译 <a class="header-anchor" href="#通过bisheng命令行编译" aria-label="Permalink to &quot;通过bisheng命令行编译&quot;">​</a></h2><p>下文基于一个Hello World打印样例来讲解如何通过bisheng命令行编译AI CPU算子。</p><p>hello_world.aicpu文件内容如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &quot;aicpu_api.h&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>__global__ __aicpu__ uint32_t hello_world(void *args)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    AscendC::printf(&quot;Hello World!!!\\n&quot;);</span></span>
<span class="line"><span>    return 0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>Host侧使用内核调用符&lt;&lt;&lt;...&gt;&gt;&gt;进行AI CPU算子的调用， main.asc示例代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &quot;acl/acl.h&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>struct KernelArgs {</span></span>
<span class="line"><span>    int mode;</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>extern __global__ __aicpu__ uint32_t hello_world(void *args);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int32_t main(int argc, char const *argv[])</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    aclInit(nullptr);</span></span>
<span class="line"><span>    int32_t deviceId = 0;</span></span>
<span class="line"><span>    aclrtSetDevice(deviceId);</span></span>
<span class="line"><span>    aclrtStream stream = nullptr;</span></span>
<span class="line"><span>    aclrtCreateStream(&amp;stream);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    struct KernelArgs args = {0};</span></span>
<span class="line"><span>    constexpr uint32_t numBlocks = 1;</span></span>
<span class="line"><span>    hello_world&lt;&lt;&lt;numBlocks, nullptr, stream&gt;&gt;&gt;(&amp;args, sizeof(KernelArgs));</span></span>
<span class="line"><span>    aclrtSynchronizeStream(stream);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    aclrtDestroyStream(stream);</span></span>
<span class="line"><span>    aclrtResetDevice(deviceId);</span></span>
<span class="line"><span>    aclFinalize();</span></span>
<span class="line"><span>    return 0;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>开发者可以使用bisheng命令行将hello_world.aicpu与main.asc分别编译成.o，再链接成为可执行文件，编译命令如下：</p><ul><li>编译hello_world.aicpu时，通过-I指定依赖头文件所在路径；通过--cce-aicpu-laicpu_api为Device链接依赖的库libaicpu_api.a，通过--cce-aicpu-L指定libaicpu_api.a的库路径。</li><li>编译main.asc时，通过--npu-arch编译选项指定对应的架构版本号。</li></ul><p>\${INSTALL_DIR}请替换为CANN软件安装后文件存储路径。以root用户安装为例，安装后文件默认存储路径为：/usr/local/Ascend/cann。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>$bisheng -O2 hello_world.aicpu --cce-aicpu-L\${INSTALL_DIR}/lib64/device/lib64 --cce-aicpu-laicpu_api -I\${INSTALL_DIR}/include/ascendc/aicpu_api -c -o hello_world.aicpu.o</span></span>
<span class="line"><span># --npu-arch用于指定NPU的架构版本，dav-后为架构版本号，各产品型号对应的架构版本号请通过[对应关系表](../语言扩展层/SIMD-BuiltIn关键字.md#table65291052154114)进行查询。</span></span>
<span class="line"><span>$bisheng --npu-arch=dav-2201 main.asc -c -o main.asc.o</span></span>
<span class="line"><span>$bisheng hello_world.aicpu.o main.asc.o -o demo</span></span></code></pre></div><p>上文我们通过一个入门示例介绍了使用bisheng命令行编译生成可执行文件的示例。除此之外，使用bisheng命令行也支持编译生成AI CPU算子的动态库与静态库，用户可在asc代码中通过内核调用符&lt;&lt;&lt;...&gt;&gt;&gt;调用AI CPU算子的核函数，并在编译asc代码源文件生成可执行文件的时候，链接AI CPU动态库或者静态库，注意：若单独编译AI CPU算子代码生成动态库、静态库时，需要手动链接<a href="./AI-Core算子编译基本用法.html#table201231542115513">表2</a>。</p><ul><li><p>编译生成算子动态库</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 编译test_aicpu.cpp生成算子动态库</span></span>
<span class="line"><span># -lxxx表示默认链接库</span></span>
<span class="line"><span># bisheng -shared -x aicpu test_aicpu.cpp -o libtest_aicpu.so -lxxx ...</span></span></code></pre></div></li><li><p>编译生成算子静态库</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 编译test_aicpu.cpp生成算子静态库</span></span>
<span class="line"><span># -lxxx表示默认链接库</span></span>
<span class="line"><span># bisheng -lib -x aicpu test_aicpu.cpp -o libtest_aicpu.a -lxxx ...</span></span></code></pre></div></li></ul><h2 id="ai-cpu算子常用编译选项" tabindex="-1">AI CPU算子常用编译选项 <a class="header-anchor" href="#ai-cpu算子常用编译选项" aria-label="Permalink to &quot;AI CPU算子常用编译选项&quot;">​</a></h2><p>AI CPU算子常用的编译选项说明如下：</p><p>&lt;table&gt;&lt;thead align=&quot;left&quot;&gt;&lt;tr&gt;&lt;th class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;33.63636363636363%&quot;&gt;&lt;p&gt;&lt;strong&gt;选项&lt;/strong&gt;&lt;/p&gt; &lt;/th&gt; &lt;th class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;9.676767676767676%&quot;&gt;&lt;p&gt;&lt;strong&gt;是否必需&lt;/strong&gt;&lt;/p&gt; &lt;/th&gt; &lt;th class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;56.686868686868685%&quot;&gt;&lt;p&gt;&lt;strong&gt;说明&lt;/strong&gt;&lt;/p&gt; &lt;/th&gt; &lt;/tr&gt; &lt;/thead&gt; &lt;tbody&gt;&lt;tr&gt;&lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;33.63636363636363%&quot;&gt;&lt;p&gt;-help&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;9.676767676767676%&quot;&gt;&lt;p&gt;否&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;56.686868686868685%&quot;&gt;&lt;p&gt;查看帮助。&lt;/p&gt; &lt;/td&gt; &lt;/tr&gt; &lt;tr&gt;&lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;33.63636363636363%&quot;&gt;&lt;p&gt;-x&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;9.676767676767676%&quot;&gt;&lt;p&gt;否&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;56.686868686868685%&quot;&gt;&lt;p&gt;指定编译语言。&lt;/p&gt; &lt;p&gt;指定为aicpu时表示AI CPU算子编程语言。&lt;/p&gt; &lt;/td&gt; &lt;/tr&gt; &lt;tr&gt;&lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;33.63636363636363%&quot;&gt;&lt;p&gt;-o &lt;file&gt;&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;9.676767676767676%&quot;&gt;&lt;p&gt;否&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;56.686868686868685%&quot;&gt;&lt;p&gt;指定输出文件的名称和位置。&lt;/p&gt; &lt;/td&gt; &lt;/tr&gt; &lt;tr&gt;&lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;33.63636363636363%&quot;&gt;&lt;p&gt;-c&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;9.676767676767676%&quot;&gt;&lt;p&gt;否&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;56.686868686868685%&quot;&gt;&lt;p&gt;编译生成目标文件。&lt;/p&gt; &lt;/td&gt; &lt;/tr&gt; &lt;tr&gt;&lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;33.63636363636363%&quot;&gt;&lt;p&gt;-shared，--shared&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;9.676767676767676%&quot;&gt;&lt;p&gt;否&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;56.686868686868685%&quot;&gt;&lt;p&gt;编译生成动态链接库。&lt;/p&gt; &lt;/td&gt; &lt;/tr&gt; &lt;tr&gt;&lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;33.63636363636363%&quot;&gt;&lt;p&gt;-lib&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;9.676767676767676%&quot;&gt;&lt;p&gt;否&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;56.686868686868685%&quot;&gt;&lt;p&gt;编译生成静态链接库。&lt;/p&gt; &lt;/td&gt; &lt;/tr&gt; &lt;tr&gt;&lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;33.63636363636363%&quot;&gt;&lt;p&gt;-g&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;9.676767676767676%&quot;&gt;&lt;p&gt;否&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;56.686868686868685%&quot;&gt;&lt;p&gt;编译时增加调试信息。&lt;/p&gt; &lt;/td&gt; &lt;/tr&gt; &lt;tr&gt;&lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;33.63636363636363%&quot;&gt;&lt;p&gt;-fPIC&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;9.676767676767676%&quot;&gt;&lt;p&gt;否&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;56.686868686868685%&quot;&gt;&lt;p&gt;告知编译器产生位置无关代码。&lt;/p&gt; &lt;/td&gt; &lt;/tr&gt; &lt;tr&gt;&lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;33.63636363636363%&quot;&gt;&lt;p&gt;-O&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;9.676767676767676%&quot;&gt;&lt;p&gt;否&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;56.686868686868685%&quot;&gt;&lt;p&gt;用于指定编译器的优化级别，当前支持-O3，-O2，-O0。&lt;/p&gt; &lt;/td&gt; &lt;/tr&gt; &lt;tr&gt;&lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;33.63636363636363%&quot;&gt;&lt;p&gt;--cce-aicpu-L&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;9.676767676767676%&quot;&gt;&lt;p&gt;否&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;56.686868686868685%&quot;&gt;&lt;p&gt;指定AI CPU Device依赖的库路径。&lt;/p&gt; &lt;/td&gt; &lt;/tr&gt; &lt;tr&gt;&lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;33.63636363636363%&quot;&gt;&lt;p&gt;--cce-aicpu-l&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;9.676767676767676%&quot;&gt;&lt;p&gt;否&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;56.686868686868685%&quot;&gt;&lt;p&gt;指定AI CPU Device依赖的库。&lt;/p&gt; &lt;/td&gt; &lt;/tr&gt; &lt;/tbody&gt; &lt;/table&gt;</p><h2 id="cmake方式编译" tabindex="-1">CMake方式编译 <a class="header-anchor" href="#cmake方式编译" aria-label="Permalink to &quot;CMake方式编译&quot;">​</a></h2><p>项目中可以使用CMake来更简便地使用毕昇编译器编译AI CPU算子，生成可执行文件、动态库、静态库或二进制文件。</p><p>仍以<a href="#section153291123460">通过bisheng命令行编译</a>中介绍的Hello World打印样例为例，除了代码实现文件，还需要在工程目录下准备一个CMakeLists.txt。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>├── hello_world.aicpu // AI CPU算子核函数定义</span></span>
<span class="line"><span>├── main.asc // AI CPU算子核函数调用</span></span>
<span class="line"><span>└── CMakeLists.txt</span></span></code></pre></div><p>CMakeLists.txt内容如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>cmake_minimum_required(VERSION 3.16)</span></span>
<span class="line"><span># 1、find_package()是CMake中用于查找和配置Ascend C编译工具链的命令</span></span>
<span class="line"><span>find_package(ASC REQUIRED) </span></span>
<span class="line"><span>find_package(AICPU REQUIRED) </span></span>
<span class="line"><span></span></span>
<span class="line"><span># 2、指定项目支持的语言包括ASC、AICPU和CXX，ASC表示支持使用毕昇编译器对Ascend C编程语言进行编译，AI CPU表示支持使用毕昇编译器对AI CPU算子进行编译</span></span>
<span class="line"><span>project(kernel_samples LANGUAGES ASC AICPU CXX)</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 3、使用CMake接口编译可执行文件</span></span>
<span class="line"><span>add_executable(demo</span></span>
<span class="line"><span>    hello_world.aicpu</span></span>
<span class="line"><span>    main.asc</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#4、由于存在ASC与AI CPU语言，需要指定链接器</span></span>
<span class="line"><span>set_target_properties(demo PROPERTIES LINKER_LANGUAGE ASC)  # 指定链接使用语言</span></span>
<span class="line"><span></span></span>
<span class="line"><span>target_compile_options(demo PRIVATE</span></span>
<span class="line"><span>    # --npu-arch用于指定NPU的架构版本，dav-后为架构版本号，各产品型号对应的架构版本号请通过[对应关系表](../语言扩展层/SIMD-BuiltIn关键字.md#table65291052154114)进行查询。</span></span>
<span class="line"><span>    # &lt;COMPILE_LANGUAGE:ASC&gt;:表明该编译选项仅对语言ASC生效</span></span>
<span class="line"><span>    $&lt;$&lt;COMPILE_LANGUAGE:ASC&gt;:--npu-arch=dav-2201&gt;</span></span>
<span class="line"><span>)</span></span></code></pre></div><p>如果需要CMake编译编译生成动态库、静态库，下面提供了更详细具体的编译示例：</p><ul><li><p>编译.cpp文件生成动态库</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 将.cpp文件置为ASC属性，启用Ascend C语言进行编译</span></span>
<span class="line"><span>set_source_files_properties(</span></span>
<span class="line"><span>    add_custom_base.cpp </span></span>
<span class="line"><span>    sub_custom_base.cpp</span></span>
<span class="line"><span>    PROPERTIES LANGUAGE ASC</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 将.cpp文件置为AICPU属性，支持AI CPU算子编译</span></span>
<span class="line"><span>set_source_files_properties(</span></span>
<span class="line"><span>    aicpu_kernel.cpp</span></span>
<span class="line"><span>    PROPERTIES LANGUAGE AICPU</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>add_library(kernel_lib SHARED</span></span>
<span class="line"><span>    add_custom_base.cpp </span></span>
<span class="line"><span>    sub_custom_base.cpp</span></span>
<span class="line"><span>    aicpu_kernel.cpp # 支持AI CPU算子与AI Core算子一起打包为动态库</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>target_compile_options(kernel_lib PRIVATE</span></span>
<span class="line"><span>    $&lt;$&lt;COMPILE_LANGUAGE:ASC&gt;:--npu-arch=dav-2201&gt;</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span># AI CPU算子编译时，需要手动链接以下依赖库（若指定链接语言为ASC时，不需要手动链接以下库）</span></span>
<span class="line"><span>target_link_libraries(kernel_lib PRIVATE</span></span>
<span class="line"><span>    ascendc_runtime</span></span>
<span class="line"><span>    profapi</span></span>
<span class="line"><span>    unified_dlog</span></span>
<span class="line"><span>    ascendcl</span></span>
<span class="line"><span>    runtime</span></span>
<span class="line"><span>    c_sec</span></span>
<span class="line"><span>    mmpa</span></span>
<span class="line"><span>    error_manager</span></span>
<span class="line"><span>    ascend_dump</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>add_executable(demo</span></span>
<span class="line"><span>    main.asc</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span>target_link_libraries(demo PRIVATE</span></span>
<span class="line"><span>    kernel_lib</span></span>
<span class="line"><span>)</span></span></code></pre></div></li><li><p>编译.asc文件与.aicpu文件生成静态库</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># .asc文件会默认启用Ascend C语言进行编译，.aicpu文件会默认启用AICPU语言进行编译，不需要通过set_source_files_properties进行设置</span></span>
<span class="line"><span>add_library(kernel_lib STATIC</span></span>
<span class="line"><span>    add_custom_base.asc </span></span>
<span class="line"><span>    sub_custom_base.asc</span></span>
<span class="line"><span>    aicpu_kernel.aicpu  # 可支持AI CPU算子与AI Core算子一起打包为静态库</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>target_compile_options(kernel_lib PRIVATE</span></span>
<span class="line"><span>    $&lt;$&lt;COMPILE_LANGUAGE:ASC&gt;:--npu-arch=dav-2201&gt;</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>add_executable(demo</span></span>
<span class="line"><span>    main.asc</span></span>
<span class="line"><span>)</span></span>
<span class="line"><span>target_link_libraries(demo PRIVATE</span></span>
<span class="line"><span>    kernel_lib</span></span>
<span class="line"><span>)</span></span></code></pre></div></li></ul><p>下文列出了使用CMake编译时常用的变量配置说明、常用的链接库。</p><p><strong>表 1</strong> 常用的变量配置说明</p><p>&lt;table&gt;&lt;thead align=&quot;left&quot;&gt;&lt;tr&gt;&lt;th class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;24.54%&quot;&gt;&lt;p&gt;变量&lt;/p&gt; &lt;/th&gt; &lt;th class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;75.46000000000001%&quot;&gt;&lt;p&gt;配置说明&lt;/p&gt; &lt;/th&gt; &lt;/tr&gt; &lt;/thead&gt; &lt;tbody&gt;&lt;tr&gt;&lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;24.54%&quot;&gt;&lt;p&gt;CMAKE_BUILD_TYPE&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;75.46000000000001%&quot;&gt;&lt;p&gt;编译模式选项，可配置为：&lt;/p&gt; &lt;ul&gt;&lt;li&gt;“Release”，Release版本，不包含调试信息，编译最终发布的版本。&lt;/li&gt;&lt;li&gt;“Debug”，Debug版本，包含调试信息，便于开发者开发和调试。&lt;/li&gt;&lt;/ul&gt; &lt;/td&gt; &lt;/tr&gt; &lt;tr&gt;&lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;24.54%&quot;&gt;&lt;p&gt;CMAKE_INSTALL_PREFIX&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;75.46000000000001%&quot;&gt;&lt;p&gt;用于指定CMake执行install时，安装的路径前缀，执行install后编译产物（ascendc_library中指定的target以及对应的头文件）会安装在该路径下。默认路径为当前目录的out目录下。&lt;/p&gt; &lt;/td&gt; &lt;/tr&gt; &lt;tr&gt;&lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;24.54%&quot;&gt;&lt;p&gt;CMAKE_CXX_COMPILER_LAUNCHER&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;75.46000000000001%&quot;&gt;&lt;p&gt;用于配置C++语言编译器（如g++）、毕昇编译器的启动器程序为ccache，配置后即可开启cache缓存编译，&lt;span&gt;加速重复编译并提高构建效率&lt;/span&gt;。使用该功能前需要安装ccache。&lt;/p&gt; &lt;p&gt;配置方法如下，在对应的CMakeLists.txt进行设置：&lt;/p&gt; &lt;pre class=&quot;screen&quot;&gt;set(CMAKE_CXX_COMPILER_LAUNCHER &lt;launcher_program&gt;)&lt;/pre&gt; &lt;p&gt;其中&lt;launcher_program&gt;是ccache的安装路径，比如ccache的安装路径为/usr/bin/ccache，示例如下：&lt;/p&gt; &lt;pre class=&quot;screen&quot;&gt;set(CMAKE_CXX_COMPILER_LAUNCHER /usr/bin/ccache)&lt;/pre&gt; &lt;/td&gt; &lt;/tr&gt; &lt;/tbody&gt; &lt;/table&gt;</p><p><strong>表 2</strong> 常用的链接库（在使用高阶API时，必须链接以下库，因为这些库是高阶API功能所依赖的。在其他场景下，可以根据具体需求选择是否链接这些库。）</p><p>&lt;table&gt;&lt;thead align=&quot;left&quot;&gt;&lt;tr&gt;&lt;th class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;24.099999999999998%&quot;&gt;&lt;p&gt;名称&lt;/p&gt; &lt;/th&gt; &lt;th class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;33.019999999999996%&quot;&gt;&lt;p&gt;作用描述&lt;/p&gt; &lt;/th&gt; &lt;th class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;42.88%&quot;&gt;&lt;p&gt;使用场景&lt;/p&gt; &lt;/th&gt; &lt;/tr&gt; &lt;/thead&gt; &lt;tbody&gt;&lt;tr&gt;&lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;24.099999999999998%&quot;&gt;&lt;p&gt;libtiling_api.a&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;33.019999999999996%&quot;&gt;&lt;p&gt;Tiling函数相关库。&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;42.88%&quot;&gt;&lt;p&gt;使用高阶API相关的Tiling接口时需要链接。&lt;/p&gt; &lt;/td&gt; &lt;/tr&gt; &lt;tr&gt;&lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;24.099999999999998%&quot;&gt;&lt;p&gt;libregister.so&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;33.019999999999996%&quot;&gt;&lt;p&gt;Tiling注册相关库。&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;42.88%&quot;&gt;&lt;p&gt;使用高阶API相关的Tiling接口时需要链接。&lt;/p&gt; &lt;/td&gt; &lt;/tr&gt; &lt;tr&gt;&lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;24.099999999999998%&quot;&gt;&lt;p&gt;libgraph_base.so&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;33.019999999999996%&quot;&gt;&lt;p&gt;基础数据结构和接口库。&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;42.88%&quot;&gt;&lt;p&gt;调用ge::Shape，ge::DataType等基础结构体时需要链接。&lt;/p&gt; &lt;/td&gt; &lt;/tr&gt; &lt;tr&gt;&lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;24.099999999999998%&quot;&gt;&lt;p&gt;libplatform.so&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;33.019999999999996%&quot;&gt;&lt;p&gt;硬件平台信息库。&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;42.88%&quot;&gt;&lt;p&gt;使用PlatformAscendC相关硬件平台信息接口时需要链接。&lt;/p&gt; &lt;/td&gt; &lt;/tr&gt; &lt;/tbody&gt; &lt;/table&gt;</p>`,29)])])}const q=a(p,[["render",o]]);export{d as __pageData,q as default};
