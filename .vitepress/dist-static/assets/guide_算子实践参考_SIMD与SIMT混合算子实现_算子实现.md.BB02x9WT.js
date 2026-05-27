import{c as n,Q as s,j as t,m as l}from"./chunks/framework.DOi4mjdC.js";const e="/assets/SIMD%E4%B8%8ESIMT%E6%B7%B7%E5%90%88%E6%A0%B8%E5%87%BD%E6%95%B0%E5%AE%9E%E7%8E%B0%E6%B5%81%E7%A8%8B.DMaO5ljM.png",p="/assets/%E7%AE%97%E5%AD%90%E8%AE%A1%E7%AE%97%E9%80%BB%E8%BE%91-52.B9Wni-gM.png",h=JSON.parse('{"title":"算子实现","description":"","frontmatter":{},"headers":[{"level":1,"title":"算子实现","slug":"算子实现"},{"level":2,"title":"算子分析","slug":"算子分析"},{"level":2,"title":"核函数定义与实现","slug":"核函数定义与实现"},{"level":2,"title":"SIMT VF函数定义与实现","slug":"simt-vf函数定义与实现"},{"level":2,"title":"SIMD VF函数定义与实现","slug":"simd-vf函数定义与实现"}],"relativePath":"guide/算子实践参考/SIMD与SIMT混合算子实现/算子实现.md","filePath":"guide/算子实践参考/SIMD与SIMT混合算子实现/算子实现.md"}'),i={name:"guide/算子实践参考/SIMD与SIMT混合算子实现/算子实现.md"};function o(d,a,c,u,r,g){return s(),t("div",null,[...a[0]||(a[0]=[l('<h1 id="算子实现" tabindex="-1">算子实现 <a class="header-anchor" href="#算子实现" aria-label="Permalink to &quot;算子实现&quot;">​</a></h1><div class="note custom-block github-alert"><p class="custom-block-title">说明</p><p>本样例的目的是通过一个简单的算子实现展示SIMD与SIMT混合编程方式，不是该算子功能的最佳实践。</p></div><p>基于SIMD与SIMT混合编程方式实现矢量算子核函数的流程如下图所示。</p><p><strong>图 1</strong> SIMD与SIMT混合核函数实现流程<br><img src="'+e+'" alt="" title="SIMD与SIMT混合核函数实现流程"></p><ul><li>算子分析：分析算子的输入、输出、数学表达式和计算逻辑。</li><li>核函数开发：定义并实现Ascend C算子入口函数。</li><li>SIMD VF函数开发：定义并实现SIMD VF入口函数。</li><li>SIMT VF函数开发：定义并实现SIMT VF入口函数。</li></ul><p>以下内容以从长度为10万的一维向量中提取指定索引的8192个数据，并对提取的数据分别执行加1运算的gather &amp; adds算子为例，对上述步骤进行详细说明。本样例中介绍的算子完整代码请参见<a href="https://gitcode.com/cann/asc-devkit/tree/master/examples/01_simd_cpp_api/00_introduction/03_fusion_operation/gather_adds_simt_simd_hybrid" target="_blank" rel="noreferrer">SIMD与SIMT混合编程实现gather&amp;adds算子样例</a>。</p><h2 id="算子分析" tabindex="-1">算子分析 <a class="header-anchor" href="#算子分析" aria-label="Permalink to &quot;算子分析&quot;">​</a></h2><p>算子分析具体步骤如下：</p><ol><li><p>明确算子的输入和输出。</p><ul><li>gather &amp; adds算子有两个输入input与index，input是原始数据，index是要获取的数据在input中的索引；输出为output。</li><li>本样例中算子的输入input支持的数据类型为float，输入index支持的数据类型为uint32_t，输出output的数据类型与输入input的数据类型相同。</li><li>算子输入input支持的shape为[100000]；输入index支持的shape为[8192]，且index数据取值在[0, 100000)范围内；输出output的shape与输入index的shape相同。</li><li>算子输入支持的<a href="./../../编程指南/概念原理和术语/神经网络和算子/数据排布格式.html">format</a>为：ND。</li></ul></li><li><p>明确算子的数学表达式及计算逻辑。</p><p>gather &amp; adds算子输出output中第i个数据为：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>output[i] = input[index[i]] + 1</span></span></code></pre></div><p>计算逻辑如下：</p><ul><li>使用SIMT编程方式从输入input（Global Memory）中获取指定索引的数据，存储到Unified Buffer上。</li><li>使用SIMD编程方式在片上存储（Unified Buffer）做数据加1运算。</li><li>将Unified Buffer上的计算结果搬出到外部存储（Global Memory）上。</li></ul><p><strong>图 2</strong> 算子计算逻辑<br><img src="'+p+`" alt="" title="算子计算逻辑-52"></p><div class="note custom-block github-alert"><p class="custom-block-title">说明</p><p>simd_adds中加1运算实际可以在simt_gather函数中快速实现，本样例的目的是通过一个简单的算子实现展示SIMD与SIMT混合编程方式，不是该算子功能的最佳实践。</p></div></li><li><p>确定核函数名称和参数。</p><ul><li>本样例中核函数命名为gather_and_adds_kernel。</li><li>根据对算子输入输出的分析，确定核函数有5个参数input，index，output，inputTotalLength，indexTotalLength；input，index为输入在Global Memory上的内存地址，output为输出在Global Memory上的内存地址，inputTotalLength是input的数据长度，indexTotalLength是index的数据长度，也是output的数据长度。</li></ul></li><li><p>明确分核策略、SIMT线程配置和SIMD Reg矢量计算API循环调用次数。</p><p>本例中算子输入index的形状为8192，可设置核数为8，每个核处理数据量为1024。</p><p>对于SIMT实现，可设置线程数为1024，每个线程处理1个数据，单个核只需调用1次simt_gather函数即可完成gather运算。</p><p>对于SIMD Reg矢量计算实现，单核处理数据量为1024，Reg矢量计算API单次处理的数据长度oneRepeatSize为<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/GetVecLen.md" target="_blank" rel="noreferrer">GetVecLen</a>/sizeof(float)，API的循环调用次数repeatTimes为1024/oneRepeatSize。</p></li><li><p>确定SIMT VF函数名称和参数。</p><ul><li>本样例中SIMT VF函数命名为simt_gather。</li><li>根据SIMT线程配置策略，确定SIMT VF函数有6个参数input，index，gatherOutput，inputTotalLength，indexTotalLength，outputTotalLength；input，index为输入在Global Memory上的内存地址，gatherOutput为输出在Unified Buffer上的内存地址，inputTotalLength是input的数据长度，indexTotalLength是index的数据长度，outputTotalLength是单核上gatherOutput的数据长度。</li></ul></li><li><p>确定SIMD VF函数名称和参数</p><ul><li>本样例中SIMD VF函数命名为simd_adds。</li><li>根据上述SIMD策略，确定SIMD VF函数有5个参数output，input，count，oneRepeatSize，repeatTimes；output为输出在Unified Buffer上的内存地址，input为输入在Unified Buffer上的内存地址，count是单核处理的数据总量，oneRepeatSize是单次循环处理的数据量，repeatTimes是Reg矢量计算API循环调用次数。</li></ul></li></ol><p>通过以上分析，得到Ascend C gather &amp; adds算子的设计规格如下：</p><ul><li><p>算子类型（OpType）：Gather_Adds</p></li><li><p>算子输入输出：</p><p><strong>表 1</strong> gather &amp; adds算子输入输出规格</p><p>&lt;table&gt;&lt;thead align=&quot;left&quot;&gt;&lt;tr&gt;&lt;th class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;25%&quot;&gt;&lt;p&gt;&lt;strong&gt;name&lt;/strong&gt;&lt;/p&gt; &lt;/th&gt; &lt;th class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;25%&quot;&gt;&lt;p&gt;&lt;strong&gt;shape&lt;/strong&gt;&lt;/p&gt; &lt;/th&gt; &lt;th class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;25%&quot;&gt;&lt;p&gt;&lt;strong&gt;data type&lt;/strong&gt;&lt;/p&gt; &lt;/th&gt; &lt;th class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;25%&quot;&gt;&lt;p&gt;&lt;strong&gt;format&lt;/strong&gt;&lt;/p&gt; &lt;/th&gt; &lt;/tr&gt; &lt;/thead&gt; &lt;tbody&gt;&lt;tr&gt;&lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;25%&quot;&gt;&lt;p&gt;input（输入）&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;25%&quot;&gt;&lt;p&gt;100000&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;25%&quot;&gt;&lt;p&gt;float&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;25%&quot;&gt;&lt;p&gt;ND&lt;/p&gt; &lt;/td&gt; &lt;/tr&gt; &lt;tr&gt;&lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;25%&quot;&gt;&lt;p&gt;index（输入）&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;25%&quot;&gt;&lt;p&gt;8192&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;25%&quot;&gt;&lt;p&gt;uint32_t&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;25%&quot;&gt;&lt;p&gt;ND&lt;/p&gt; &lt;/td&gt; &lt;/tr&gt; &lt;tr&gt;&lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;25%&quot;&gt;&lt;p&gt;output（输出）&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;25%&quot;&gt;&lt;p&gt;8192&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;25%&quot;&gt;&lt;p&gt;float&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;25%&quot;&gt;&lt;p&gt;ND&lt;/p&gt; &lt;/td&gt; &lt;/tr&gt; &lt;/tbody&gt; &lt;/table&gt;</p></li><li><p>核数：8</p></li><li><p>SIMT线程数：1024</p></li><li><p>核函数名称：gather_and_adds_kernel</p></li><li><p>SIMT VF函数名称：simt_gather</p></li><li><p>SIMD VF函数名称：simd_adds</p></li><li><p>算子实现文件名称：gather_and_adds.asc</p></li></ul><h2 id="核函数定义与实现" tabindex="-1">核函数定义与实现 <a class="header-anchor" href="#核函数定义与实现" aria-label="Permalink to &quot;核函数定义与实现&quot;">​</a></h2><p>根据<a href="./../../编程指南/编程模型/AI-Core-SIMD编程/核函数.html">核函数</a>中介绍的规则进行核函数的定义。</p><ol><li><p>函数原型定义</p><p>本样例中，函数名为gather_and_adds_kernel（核函数名称可自定义），根据上述分析，函数原型定义如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>__global__ __vector__ void gather_and_adds_kernel(__gm__ float* input, __gm__ uint32_t* index, __gm__ float* output, uint32_t inputTotalLength, uint32_t indexTotalLength)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>}</span></span></code></pre></div></li><li><p>启动SIMT VF函数simt_gather，从input中获取指定索引的数据。</p><ol><li><p>计算单核应处理的数据量。数据总量为indexTotalLength，除以核数即可得到单核应处理的数据量。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>uint32_t indexTotalLengthPerBlock = indexTotalLength / AscendC::GetBlockNum();</span></span></code></pre></div></li><li><p>使用<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/Alloc.md" target="_blank" rel="noreferrer">Alloc</a>接口申请Unified Buffer内存空间，并将该Tensor作为simt_gather函数的输出。</p></li><li><p>使用<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/asc_vf_call.md" target="_blank" rel="noreferrer">asc_vf_call</a>接口启动SIMT_VF函数simt_gather。第一个参数为<a href="./../../编程指南/语言扩展层/SIMT-BuiltIn关键字.html#li1136665405">dim3</a>结构，代表线程的三维层次结构，本例中初始化为dim3(1024)，使用一维定义方式，线程总数为1024。</p></li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>constexpr uint32_t THREAD_COUNT = 1024;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>__global__ __vector__ void gather_and_adds_kernel(__gm__ float* input, __gm__ uint32_t* index, __gm__ float* output, uint32_t inputTotalLength, uint32_t indexTotalLength)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    // 定义UB内存分配对象</span></span>
<span class="line"><span>    AscendC::LocalMemAllocator&lt;AscendC::Hardware::UB&gt; ubAllocator;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 计算单核应处理的数据量</span></span>
<span class="line"><span>    uint32_t indexTotalLengthPerBlock = indexTotalLength / AscendC::GetBlockNum();</span></span>
<span class="line"><span>    // 申请UB内存作为simt_gather的输出</span></span>
<span class="line"><span>    AscendC::LocalTensor&lt;float&gt; gatherOutput = ubAllocator.Alloc&lt;float&gt;(indexTotalLengthPerBlock);</span></span>
<span class="line"><span>    // 1. 调用simt函数获取指定索引的1024个数据</span></span>
<span class="line"><span>    asc_vf_call&lt;simt_gather&gt;(dim3(THREAD_COUNT), input, index,</span></span>
<span class="line"><span>                             (__ubuf__ float *)gatherOutput.GetPhyAddr(),</span></span>
<span class="line"><span>                             inputTotalLength,</span></span>
<span class="line"><span>                             indexTotalLength,</span></span>
<span class="line"><span>                             indexTotalLengthPerBlock);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 2. 调用SIMD函数完成加1操作</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 3. 将数据搬运到GM</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>}</span></span></code></pre></div></li><li><p>启动SIMD VF函数simd_adds，对Unified Buffer上的数据做加1计算。</p><ol><li>使用<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/Alloc.md" target="_blank" rel="noreferrer">Alloc</a>接口申请Unified Buffer内存空间，并将该Tensor作为simt_adds函数的输出。</li><li>使用<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/GetVecLen.md" target="_blank" rel="noreferrer">GetVecLen</a>接口除以单个数据长度，计算Reg矢量计算API单次处理的数据量oneRepeatSize。使用单核应处理的数据量indexTotalLengthPerBlock除以单次处理数据量oneRepeatSize，计算Reg矢量计算API循环调用次数。</li><li>使用<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/asc_vf_call.md" target="_blank" rel="noreferrer">asc_vf_call</a>接口启动SIMD VF函数simd_adds。</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>__global__ __vector__ void gather_and_adds_kernel(__gm__ float* input, __gm__ uint32_t* index, __gm__ float* output, uint32_t inputTotalLength, uint32_t indexTotalLength)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    // 1. 调用simt函数获取指定索引的1024个数据</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 申请UB作为simd_adds的输出</span></span>
<span class="line"><span>    AscendC::LocalTensor&lt;float&gt; addsOutput = ubAllocator.Alloc&lt;float&gt;(indexTotalLengthPerBlock);</span></span>
<span class="line"><span>    // 计算Reg矢量计算API单次调用处理的数据量</span></span>
<span class="line"><span>    constexpr uint32_t oneRepeatSize = AscendC::GetVecLen() / sizeof(float);</span></span>
<span class="line"><span>    // 计算Reg矢量计算API循环调用次数</span></span>
<span class="line"><span>    uint16_t repeatTimes = (indexTotalLengthPerBlock + oneRepeatSize - 1) / oneRepeatSize;</span></span>
<span class="line"><span>    // 2. 调用SIMD函数完成加1操作</span></span>
<span class="line"><span>    asc_vf_call&lt;simd_adds&gt;((__ubuf__ float *)addsOutput.GetPhyAddr(),</span></span>
<span class="line"><span>        (__ubuf__ float *)gatherOutput.GetPhyAddr(), indexTotalLengthPerBlock, oneRepeatSize, repeatTimes);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 依赖PIPE_V和PIPE_MTE3流水同步</span></span>
<span class="line"><span>    AscendC::SetFlag&lt;AscendC::HardEvent::V_MTE3&gt;(0);</span></span>
<span class="line"><span>    AscendC::WaitFlag&lt;AscendC::HardEvent::V_MTE3&gt;(0);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 3. 将数据搬运到GM</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>}</span></span></code></pre></div></li><li><p>使用<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/DataCopy.md" target="_blank" rel="noreferrer">DataCopy</a>接口将结果数据搬运到Global Memory。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>__global__ __vector__ void gather_and_adds_kernel(__gm__ float* input, __gm__ uint32_t* index, __gm__ float* output, uint32_t inputTotalLength, uint32_t indexTotalLength)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    // 1. 调用simt函数获取指定索引的1024个数据</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 2. 调用SIMD函数完成加1操作</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 3. 将数据搬运到GM</span></span>
<span class="line"><span>    // 定义GlobalTensor对象，用于数据搬运</span></span>
<span class="line"><span>    AscendC::GlobalTensor&lt;float&gt; outputGlobalTensor;</span></span>
<span class="line"><span>    // 根据核偏移初始化GlobalTensor地址</span></span>
<span class="line"><span>    outputGlobalTensor.SetGlobalBuffer(output + indexTotalLengthPerBlock * AscendC::GetBlockIdx());</span></span>
<span class="line"><span>    // 调用数据搬运接口将数据搬运到GM</span></span>
<span class="line"><span>    AscendC::DataCopy(outputGlobalTensor, addsOutput, indexTotalLengthPerBlock);</span></span>
<span class="line"><span>}</span></span></code></pre></div></li></ol><h2 id="simt-vf函数定义与实现" tabindex="-1">SIMT VF函数定义与实现 <a class="header-anchor" href="#simt-vf函数定义与实现" aria-label="Permalink to &quot;SIMT VF函数定义与实现&quot;">​</a></h2><ol><li><p>定义函数原型。</p><p>根据上述对SIMT VF函数的参数分析，定义SIMT VF函数原型。使用<a href="./../../编程指南/语言扩展层/SIMD-BuiltIn关键字.html#li611618392141">__simt_vf__</a>函数类型限定符标识SIMT VF核函数入口，使其可以被asc_vf_call调用。</p><div class="note custom-block github-alert"><p class="custom-block-title">说明</p><p>在SIMT 编程中，__launch_bounds__(thread_num)是可选配置，用于在编译期指定核函数启动的最大线程数（如果不配置，thread_num默认为1024），使用时请注意：thread_num &gt;= x * y * z （即：asc_vf_call的第一个参数：dim3{x, y, z}）, 线程数thread_num的取值范围为1到2048。最大线程数决定了每个线程可分配的寄存器数量，具体对应关系请见<a href="./../../编程指南/语言扩展层/SIMT-BuiltIn关键字.html#table1715318510594">表5</a>，寄存器用于存储线程中的局部变量，若局部变量的个数超出寄存器个数，容易出现栈溢出等问题。</p></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>constexpr uint32_t THREAD_COUNT = 1024;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>__simt_vf__ __launch_bounds__(THREAD_COUNT) inline void simt_gather(</span></span>
<span class="line"><span>    __gm__ float* input,</span></span>
<span class="line"><span>    __gm__ uint32_t* index,</span></span>
<span class="line"><span>    __ubuf__ float* gatherOutput,</span></span>
<span class="line"><span>    uint32_t inputTotalLength,</span></span>
<span class="line"><span>    uint32_t indexTotalLength,</span></span>
<span class="line"><span>    uint32_t outputTotalLength)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>}</span></span></code></pre></div></li><li><p>实现函数。</p><p>simt_gather函数实现从输入input（Global Memory）中获取指定索引的数据。基于上述数据切分策略，首先计算线程应处理数据的索引，然后通过赋值操作将数据存储到Unified Buffer上。</p><p>本例中核数设置为8，线程的层次结构为{1024, 1, 1}，数据总量为8192（8 *1024）。每个线程只需处理一个数据，应处理数据在index中的索引计算逻辑为：当前核id*每核线程数+当前线程的id，代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int idx = blockIdx.x * blockDim.x + threadIdx.x;</span></span></code></pre></div><p><a href="./../../编程指南/语言扩展层/SIMT-BuiltIn关键字.html#li1676053814914">blockIdx</a>用于获取当前核id。blockDim用于获取线程三维层次结构{x, y, z}，本例中为{1024, 1, 1}，其中第2，3维度均为1，使用一维层次结构，因此线程数可写作blockDim.x。<a href="./../../编程指南/语言扩展层/SIMT-BuiltIn关键字.html#li7760123814919">threadIdx</a>用于获取三维线程索引{x, y, z}，本例中仅使用第1维x，可通过threadIdx.x获取当前线程的id。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>__simt_vf__ __launch_bounds__(THREAD_COUNT) inline void simt_gather(</span></span>
<span class="line"><span>    __gm__ float* input,</span></span>
<span class="line"><span>    __gm__ uint32_t* index,</span></span>
<span class="line"><span>    __ubuf__ float* gatherOutput,</span></span>
<span class="line"><span>    uint32_t inputTotalLength,</span></span>
<span class="line"><span>    uint32_t indexTotalLength,</span></span>
<span class="line"><span>    uint32_t outputTotalLength)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    // 异常判断，防止越界</span></span>
<span class="line"><span>    if (threadIdx.x &gt;= outputTotalLength) {</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 计算线程应处理的数据在输入index的索引</span></span>
<span class="line"><span>    int idx = blockIdx.x * blockDim.x + threadIdx.x;</span></span>
<span class="line"><span>    // 异常判断，防止越界</span></span>
<span class="line"><span>    if (idx &gt;= indexTotalLength) {</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 读取线程应获取的数据在输入input中的索引</span></span>
<span class="line"><span>    uint32_t gatherIdx = index[idx];</span></span>
<span class="line"><span>    // 异常判断，防止越界</span></span>
<span class="line"><span>    if (gatherIdx &gt;= inputTotalLength) {</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 将input中索引为gatherIdx的数据存到UB上</span></span>
<span class="line"><span>    gatherOutput[threadIdx.x] = input[gatherIdx];</span></span>
<span class="line"><span>}</span></span></code></pre></div></li></ol><h2 id="simd-vf函数定义与实现" tabindex="-1">SIMD VF函数定义与实现 <a class="header-anchor" href="#simd-vf函数定义与实现" aria-label="Permalink to &quot;SIMD VF函数定义与实现&quot;">​</a></h2><ol><li><p>定义函数原型。</p><p>根据上述对SIMD VF函数的参数分析，定义SIMD VF函数原型。使用__simd_vf__函数类型限定符标识SIMD VF入口函数，使其可以被asc_vf_call关键字调用。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>__simd_vf__ inline void simd_adds(__ubuf__ float *output, __ubuf__ float *input,</span></span>
<span class="line"><span>    uint32_t count, uint32_t oneRepeatSize, uint16_t repeatTimes)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>}</span></span></code></pre></div></li><li><p>循环调用repeatTimes次Reg矢量计算API完成加1运算。</p><ol><li>使用<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/%E8%BF%9E%E7%BB%AD%E5%AF%B9%E9%BD%90%E6%90%AC%E5%85%A5.md" target="_blank" rel="noreferrer">连续对齐搬入</a>接口将数据从Unified Buffer搬运到Reg矢量计算基本单元<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/RegTensor.md" target="_blank" rel="noreferrer">RegTensor</a>。</li><li>使用<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/Adds.md" target="_blank" rel="noreferrer">Adds</a>接口完成将数据加1运算。</li><li>使用<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/%E8%BF%9E%E7%BB%AD%E5%AF%B9%E9%BD%90%E6%90%AC%E5%87%BA.md" target="_blank" rel="noreferrer">连续对齐搬出</a>接口将数据从RegTensor搬运到Unified Buffer。</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>constexpr float ADDS_ADDEND = 1.0f;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>__simd_vf__ inline void simd_adds(__ubuf__ float *output, __ubuf__ float *input,</span></span>
<span class="line"><span>    uint32_t count, uint32_t oneRepeatSize, uint16_t repeatTimes)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    // 初始化Reg矢量计算单元，源操作数</span></span>
<span class="line"><span>    AscendC::Reg::RegTensor&lt;float&gt; srcReg0;</span></span>
<span class="line"><span>    // 初始化Reg矢量计算单元，目的操作数</span></span>
<span class="line"><span>    AscendC::Reg::RegTensor&lt;float&gt; dstReg0;</span></span>
<span class="line"><span>    // 初始化Reg矢量计算标记寄存器</span></span>
<span class="line"><span>    AscendC::Reg::MaskReg maskReg;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    for (uint16_t i = 0; i &lt; repeatTimes; i++) {</span></span>
<span class="line"><span>        // 从UB搬运数据到Reg矢量计算基本单元</span></span>
<span class="line"><span>        maskReg = AscendC::Reg::UpdateMask&lt;float&gt;(count);</span></span>
<span class="line"><span>        AscendC::Reg::LoadAlign(srcReg0, input + i * oneRepeatSize);</span></span>
<span class="line"><span>        // 调用Adds接口完成加1运算</span></span>
<span class="line"><span>        AscendC::Reg::Adds(dstReg0, srcReg0, ADDS_ADDEND, maskReg);</span></span>
<span class="line"><span>        // 从Reg矢量计算基本单元搬运数据到UB</span></span>
<span class="line"><span>        AscendC::Reg::StoreAlign(output + i * oneRepeatSize, dstReg0, maskReg);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div></li></ol>`,18)])])}const m=n(i,[["render",o]]);export{h as __pageData,m as default};
