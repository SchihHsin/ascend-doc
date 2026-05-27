import{c as s,Q as n,j as t,m as l}from"./chunks/framework.DOi4mjdC.js";const p="/assets/%E7%9F%A9%E9%98%B5%E7%BC%96%E7%A8%8B%E5%9F%BA%E6%9C%AC%E4%BB%BB%E5%8A%A1%E8%AE%BE%E8%AE%A1.C4hks0J8.png",e="/assets/%E7%9F%A9%E9%98%B5%E7%BC%96%E7%A8%8BQueue%E9%98%9F%E5%88%97.CtNw15ih.png",o="/assets/%E7%9F%A9%E9%98%B5%E7%AE%97%E5%AD%90%E5%AE%9E%E7%8E%B0%E6%B5%81%E7%A8%8B.1B2haU2p.png",i="/assets/Matmul%E7%AE%97%E5%AD%90%E7%9A%84%E8%AE%A1%E7%AE%97%E6%B5%81%E7%A8%8B%E5%9B%BE.DNs5zUUU.png",c="/assets/%E6%95%B0%E6%8D%AE%E6%B5%81%E9%80%9A%E7%A4%BA%E6%84%8F%E5%9B%BE.D6agJZHm.png",r="/assets/%E5%B9%B6%E8%A1%8C%E7%A4%BA%E6%84%8F%E5%9B%BE.BpAmGE0y.png",u="/assets/ND-to-NZ%E8%BD%AC%E6%8D%A2%E7%A4%BA%E6%84%8F%E5%9B%BE.SpYOllVf.png",d="/assets/NZ-to-ZZ%E6%A0%BC%E5%BC%8F%E8%BD%AC%E6%8D%A2%E7%A4%BA%E6%84%8F%E5%9B%BE.DpQ8Z011.png",g="/assets/NZ-to-ZN%E6%A0%BC%E5%BC%8F%E8%BD%AC%E6%8D%A2%E7%A4%BA%E6%84%8F%E5%9B%BE.BA9MtBtp.png",m="/assets/NZ-to-ND%E6%A0%BC%E5%BC%8F%E8%BD%AC%E6%8D%A2%E7%A4%BA%E6%84%8F%E5%9B%BE.CZIbWNWD.png",D=JSON.parse('{"title":"耦合模式","description":"","frontmatter":{},"headers":[{"level":1,"title":"耦合模式","slug":"耦合模式"},{"level":2,"title":"编程范式","slug":"编程范式"},{"level":2,"title":"开发流程","slug":"开发流程"},{"level":2,"title":"算子分析","slug":"算子分析"},{"level":2,"title":"核函数定义","slug":"核函数定义"},{"level":2,"title":"算子类实现","slug":"算子类实现"}],"relativePath":"guide/算子实践参考/SIMD算子实现/矩阵编程（基础API）/耦合模式.md","filePath":"guide/算子实践参考/SIMD算子实现/矩阵编程（基础API）/耦合模式.md"}'),b={name:"guide/算子实践参考/SIMD算子实现/矩阵编程（基础API）/耦合模式.md"};function h(_,a,f,C,k,A){return n(),t("div",null,[...a[0]||(a[0]=[l('<h1 id="耦合模式" tabindex="-1">耦合模式 <a class="header-anchor" href="#耦合模式" aria-label="Permalink to &quot;耦合模式&quot;">​</a></h1><div class="note custom-block github-alert"><p class="custom-block-title">说明</p><p>本节内容为针对<a href="./../../../编程指南/硬件实现/基本架构.html#section1574769433">耦合模式</a>，使用基础API进行矩阵乘法的编程指导。 如下章节内容暂不支持Ascend 950PR/Ascend 950DT。</p></div><h2 id="编程范式" tabindex="-1">编程范式 <a class="header-anchor" href="#编程范式" aria-label="Permalink to &quot;编程范式&quot;">​</a></h2><p>Cube编程范式把算子的实现流程分为5个基本任务：CopyIn，Split，Compute，Aggregate，CopyOut。CopyIn负责搬入操作，Split负责数据切分操作，Compute负责矩阵指令计算操作，Aggregate负责数据汇聚操作，CopyOut负责搬出操作。</p><p><strong>图 1</strong> 矩阵编程基本任务设计<br><img src="'+p+'" alt="" title="矩阵编程基本任务设计"></p><p>具体任务之间的交互流程和流程图如下。</p><ol><li><p>Stage1：CopyIn任务。</p><ol><li>使用<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/DataCopy.md" target="_blank" rel="noreferrer">DataCopy</a>接口将GlobalTensor数据拷贝到LocalTensor。</li><li>使用<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/EnQue.md" target="_blank" rel="noreferrer">EnQue</a>将LocalTensor放入A1/B1的Queue中。</li></ol></li><li><p>Stage2：Split任务。</p><ol><li>使用<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/DeQue.md" target="_blank" rel="noreferrer">DeQue</a>从A1/B1中取出LocalTensor。</li><li>使用<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/LoadData.md" target="_blank" rel="noreferrer">LoadData</a>接口将LocalTensor从A1/B1中搬运到A2/B2。</li><li>使用<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/EnQue.md" target="_blank" rel="noreferrer">EnQue</a>将计算结果LocalTensor放入到A2/B2的Queue中。</li></ol></li><li><p>Stage3：Compute任务。</p><ol><li>使用<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/DeQue.md" target="_blank" rel="noreferrer">DeQue</a>从A2/B2中取出LocalTensor。</li><li>使用<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/Mmad.md" target="_blank" rel="noreferrer">Mmad</a>接口完成矩阵计算。</li><li>使用<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/EnQue.md" target="_blank" rel="noreferrer">EnQue</a>将计算结果LocalTensor放入到CO1的Queue中。</li></ol></li><li><p>Stage4：Aggregate任务。</p><ol><li>使用<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/DeQue.md" target="_blank" rel="noreferrer">DeQue</a>从CO1中取出LocalTensor。</li><li>使用Ascend C接口拷贝结果矩阵到CO2。</li><li>使用<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/EnQue.md" target="_blank" rel="noreferrer">EnQue</a>将计算结果LocalTensor放入到CO2的Queue中。</li></ol></li><li><p>Stage5：CopyOut任务。</p><ol><li>使用<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/DeQue.md" target="_blank" rel="noreferrer">DeQue</a>接口从CO2的Queue中取出LocalTensor。</li><li>使用<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/DataCopy.md" target="_blank" rel="noreferrer">DataCopy</a>接口将LocalTensor拷贝到GlobalTensor上。</li></ol></li></ol><p><strong>图 2</strong> 矩阵编程Queue队列<br><img src="'+e+'" alt="" title="矩阵编程Queue队列"></p><h2 id="开发流程" tabindex="-1">开发流程 <a class="header-anchor" href="#开发流程" aria-label="Permalink to &quot;开发流程&quot;">​</a></h2><p>基于Ascend C方式实现矩阵算子的流程如下图所示。</p><p><strong>图 3</strong> 矩阵算子实现流程<br><img src="'+o+`" alt="" title="矩阵算子实现流程"></p><ul><li>算子分析：分析算子的数学表达式、输入、输出以及计算逻辑的实现，明确需要调用的Ascend C接口。</li><li>核函数定义：定义Ascend C算子入口函数。</li><li>根据矩阵编程范式实现算子类：完成核函数的内部实现，调用私有成员函数CopyIn、SplitA、SplitB、Compute、Aggregate、CopyOut完成矩阵算子的五级流水操作。</li></ul><p>下文将以Matmul算子为例对上述步骤进行详细介绍，Matmul算子的代码框架如下，完整代码请参见<a href="https://gitee.com/ascend/samples/tree/master/operator/ascendc/0_introduction/20_mmad_kernellaunch/MmadInvocation" target="_blank" rel="noreferrer">Mmad样例</a>。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &quot;kernel_operator.h&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 根据编程范式实现算子类</span></span>
<span class="line"><span>class KernelMatmul {</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    __aicore__ inline void Init(GM_ADDR a, GM_ADDR b, GM_ADDR c)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        // ...</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void Process()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        CopyIn();</span></span>
<span class="line"><span>        SplitA();</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;half&gt; b1Local = inQueueB1.DeQue&lt;half&gt;();</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;half&gt; a2Local = inQueueA2.DeQue&lt;half&gt;();</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;float&gt; c2Local = outQueueCO2.AllocTensor&lt;float&gt;();</span></span>
<span class="line"><span>        // split matrix b into 2 parts, [32, 16] and [32, 16]</span></span>
<span class="line"><span>        for (int i = 0; i &lt; 2; ++i) {</span></span>
<span class="line"><span>            SplitB(b1Local, i);</span></span>
<span class="line"><span>            Compute(a2Local);</span></span>
<span class="line"><span>            Aggregate(c2Local, i);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        inQueueB1.FreeTensor(b1Local);</span></span>
<span class="line"><span>        inQueueA2.FreeTensor(a2Local);</span></span>
<span class="line"><span>        outQueueCO2.EnQue&lt;float&gt;(c2Local);</span></span>
<span class="line"><span>        CopyOut();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>private:</span></span>
<span class="line"><span>    __aicore__ inline void CopyIn()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        // ...</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void SplitA()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        // ...</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void SplitB(const LocalTensor&lt;half&gt;&amp; b1Local, const int bSplitIdx)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        // ...</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void Compute(const LocalTensor&lt;half&gt;&amp; a2Local)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        // ...</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void Aggregate(const LocalTensor&lt;float&gt;&amp; c2Local, const int bSplitIdx)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        // ...</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void CopyOut()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        // ...</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>private:</span></span>
<span class="line"><span>    // ...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//核函数定义</span></span>
<span class="line"><span>extern &quot;C&quot; __global__ __aicore__ void matmul_custom(GM_ADDR a, GM_ADDR b, GM_ADDR c)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    KernelMatmul op;</span></span>
<span class="line"><span>    op.Init(a, b, c);</span></span>
<span class="line"><span>    op.Process();</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="算子分析" tabindex="-1">算子分析 <a class="header-anchor" href="#算子分析" aria-label="Permalink to &quot;算子分析&quot;">​</a></h2><p>在开发算子代码之前需要分析算子的数学表达式、输入、输出以及计算逻辑的实现，明确需要调用的Ascend C接口。</p><ol><li><p>明确算子的数学表达式及计算逻辑。</p><p>Matmul算子完成矩阵乘操作，其数学表达式如下，形状为[m, k]的矩阵a和形状为[k, n]的矩阵b相乘，得到形状为[m, n]的矩阵c。为了方便，令m=k=n=32。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>c = a * b</span></span></code></pre></div><p>注意需要处理的数据过大时，需要对数据进行切分并分块搬运到A2、B2，分别计算后再进行汇聚。下文的计算逻辑为了展示Split和Aggregate阶段的样例，请您根据实际需要处理的数据大小决定是否需要切分和汇聚。</p><p>计算逻辑如下：</p><ol><li>分别搬运输入数据矩阵a、b至Local Memory A1、B1。</li><li>将a矩阵从A1搬运至A2。为实现部分并行，将b矩阵切分为part1和part2，形状均为[k, n / 2]，切分后再分块搬运至B2。</li><li>a矩阵和b矩阵part1、part2分别做矩阵乘运算，获得矩阵c的part1和part2，形状均为[m, n / 2]。计算结果在CO1存储。</li><li>将矩阵c的part1和part2分别拷贝到CO2进行合并。</li><li>将合并后的输出数据从CO2搬出。</li></ol></li><li><p>明确输入和输出。</p><ul><li>Matmul算子有两个输入：a与b，输出为c。</li><li>本样例中算子输入支持的数据类型为half（float16），算子输出的数据类型为float32。</li><li>矩阵a、b、c的形状均为[32, 32]。</li><li>算子输入输出支持的数据格式为：ND。</li></ul></li><li><p>确定核函数名称和参数。</p><ul><li>您可以自定义核函数名称，本样例中核函数命名为matmul_custom。</li><li>根据对算子输入输出的分析，确定核函数有3个参数a，b，c；a，b为输入在Global Memory上的内存地址，c为输出在Global Memory上的内存地址。</li></ul></li><li><p>约束分析。</p><p>由于硬件架构对矩阵乘计算的输入输出有格式约束，需要在算子实现中增加格式转换的流程。</p><ul><li>搬运矩阵a、b至A1、B1时，将ND格式的矩阵a、b转换为NZ格式。</li><li>从A1搬运矩阵a至A2时，将NZ格式的a矩阵转换为ZZ格式；从B1搬运矩阵b到B2时将NZ格式的b矩阵转换为ZN格式。</li><li>将计算结果从CO2搬出时，将NZ格式的c矩阵转换为ND格式。</li><li>数据排布格式的相关介绍详见<a href="./../../../编程指南/概念原理和术语/神经网络和算子/数据排布格式.html">数据排布格式</a>。</li></ul></li><li><p>确定算子实现所需接口。</p><ul><li>实现外部存储和内部存储间的数据搬运，查看Ascend C API参考中的数据搬移接口，具体参考<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/DataCopy.md" target="_blank" rel="noreferrer">DataCopy</a>。</li><li>实现矩阵数据格式转换，查看Ascend C API参考中的数据转换接口，具体参考<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/LoadData.md" target="_blank" rel="noreferrer">LoadData</a>。</li><li>矩阵计算过程涉及矩阵乘法，查看Ascend C API参考中的矩阵计算接口，具体参考<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/Mmad.md" target="_blank" rel="noreferrer">Mmad</a>。</li><li>计算中使用到的Tensor数据结构，使用Queue队列进行管理，会使用到<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/EnQue.md" target="_blank" rel="noreferrer">EnQue</a>、<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/DeQue.md" target="_blank" rel="noreferrer">DeQue</a>等接口。</li></ul></li></ol><p>通过以上分析，得到Ascend C Matmul算子的计算流程图和设计规格如下：</p><p><strong>图 4</strong> Matmul算子的计算流程图<br><img src="`+i+`" alt="" title="Matmul算子的计算流程图"></p><p><strong>表 1</strong> Ascend C Matmul算子设计规格</p><p>&lt;table&gt;&lt;tbody&gt;&lt;tr&gt;&lt;th class=&quot;firstcol&quot; valign=&quot;top&quot;&gt;&lt;p&gt;算子类型（OpType）&lt;/p&gt; &lt;/th&gt; &lt;td class=&quot;cellrowborder&quot; colspan=&quot;4&quot; valign=&quot;top&quot;&gt;&lt;p&gt;Matmul&lt;/p&gt; &lt;/td&gt; &lt;/tr&gt; &lt;tr&gt;&lt;th class=&quot;firstcol&quot; rowspan=&quot;3&quot; valign=&quot;top&quot; width=&quot;19.82%&quot;&gt;&lt;p&gt;算子输入&lt;/p&gt; &lt;/th&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;19.17%&quot;&gt;&lt;p&gt;&lt;strong&gt;name&lt;/strong&gt;&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;16.39%&quot;&gt;&lt;p&gt;&lt;strong&gt;shape&lt;/strong&gt;&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;15.09%&quot;&gt;&lt;p&gt;&lt;strong&gt;data type&lt;/strong&gt;&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;29.53%&quot;&gt;&lt;p&gt;&lt;strong&gt;format&lt;/strong&gt;&lt;/p&gt; &lt;/td&gt; &lt;/tr&gt; &lt;tr&gt;&lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot;&gt;&lt;p&gt;a&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot;&gt;&lt;p&gt;(m, k) = (32, 32)&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot;&gt;&lt;p&gt;half&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot;&gt;&lt;p&gt;ND&lt;/p&gt; &lt;/td&gt; &lt;/tr&gt; &lt;tr&gt;&lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot;&gt;&lt;p&gt;b&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot;&gt;&lt;p&gt;(k, n) = (32, 32)&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot;&gt;&lt;p&gt;half&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot;&gt;&lt;p&gt;ND&lt;/p&gt; &lt;/td&gt; &lt;/tr&gt; &lt;tr&gt;&lt;th class=&quot;firstcol&quot; valign=&quot;top&quot; width=&quot;19.82%&quot;&gt;&lt;p&gt;算子输出&lt;/p&gt; &lt;/th&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;19.17%&quot;&gt;&lt;p&gt;c&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;16.39%&quot;&gt;&lt;p&gt;(m, n) = (32, 32)&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;15.09%&quot;&gt;&lt;p&gt;float32&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;29.53%&quot;&gt;&lt;p&gt;ND&lt;/p&gt; &lt;/td&gt; &lt;/tr&gt; &lt;tr&gt;&lt;th class=&quot;firstcol&quot; valign=&quot;top&quot;&gt;&lt;p&gt;核函数名称&lt;/p&gt; &lt;/th&gt; &lt;td class=&quot;cellrowborder&quot; colspan=&quot;4&quot; valign=&quot;top&quot;&gt;&lt;p&gt;matmul_custom&lt;/p&gt; &lt;/td&gt; &lt;/tr&gt; &lt;tr&gt;&lt;th class=&quot;firstcol&quot; rowspan=&quot;4&quot; valign=&quot;top&quot;&gt;&lt;p&gt;使用的主要接口&lt;/p&gt; &lt;/th&gt; &lt;td class=&quot;cellrowborder&quot; colspan=&quot;4&quot; valign=&quot;top&quot;&gt;&lt;p&gt;DataCopy：数据搬移接口&lt;/p&gt; &lt;/td&gt; &lt;/tr&gt; &lt;tr&gt;&lt;td class=&quot;cellrowborder&quot; colspan=&quot;4&quot; valign=&quot;top&quot;&gt;&lt;p&gt;LoadData：矩阵数据格式转换接口&lt;/p&gt; &lt;/td&gt; &lt;/tr&gt; &lt;tr&gt;&lt;td class=&quot;cellrowborder&quot; colspan=&quot;4&quot; valign=&quot;top&quot;&gt;&lt;p&gt;Mmad：矩阵乘计算接口&lt;/p&gt; &lt;/td&gt; &lt;/tr&gt; &lt;tr&gt;&lt;td class=&quot;cellrowborder&quot; colspan=&quot;4&quot; valign=&quot;top&quot;&gt;&lt;p&gt;EnQue、DeQue等接口：Queue队列管理接口&lt;/p&gt; &lt;/td&gt; &lt;/tr&gt; &lt;tr&gt;&lt;th class=&quot;firstcol&quot; valign=&quot;top&quot;&gt;&lt;p&gt;算子实现文件名称&lt;/p&gt; &lt;/th&gt; &lt;td class=&quot;cellrowborder&quot; colspan=&quot;4&quot; valign=&quot;top&quot;&gt;&lt;p&gt;matmul_custom.cpp&lt;/p&gt; &lt;/td&gt; &lt;/tr&gt; &lt;/tbody&gt; &lt;/table&gt;</p><h2 id="核函数定义" tabindex="-1">核函数定义 <a class="header-anchor" href="#核函数定义" aria-label="Permalink to &quot;核函数定义&quot;">​</a></h2><p>根据<a href="./../../../编程指南/编程模型/AI-Core-SIMD编程/核函数.html">核函数</a>中介绍的规则进行核函数的定义。</p><ol><li><p>函数原型定义。</p><p>本样例中，函数名为matmul_custom（核函数名称可自定义）；根据<a href="#zh-cn_topic_0000002135641293_section11569817102912">算子分析</a>中对算子输入输出的分析，确定有3个参数a，b，c，其中a，b都为输入内存，c为输出内存。根据<a href="./../../../编程指南/编程模型/AI-Core-SIMD编程/核函数.html">核函数</a>中核函数的规则介绍，函数原型定义如下所示：使用__global__函数类型限定符来标识它是一个核函数，可以被&lt;&lt;&lt;&gt;&gt;&gt;调用；使用__aicore__函数类型限定符来标识该核函数在设备端aicore上执行；为方便起见，统一使用GM_ADDR宏修饰入参，GM_ADDR宏定义请参考<a href="./../../../编程指南/编程模型/AI-Core-SIMD编程/核函数.html">核函数</a>。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>extern &quot;C&quot; __global__ __aicore__ void matmul_custom(GM_ADDR a, GM_ADDR b, GM_ADDR c)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>}</span></span></code></pre></div></li><li><p>调用算子类的Init和Process函数。</p><p>算子类的Init函数，完成内存初始化相关工作，Process函数完成算子实现的核心逻辑，具体介绍参见<a href="#zh-cn_topic_0000002135641293_section1882915463510">算子类实现</a>。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>extern &quot;C&quot; __global__ __aicore__ void matmul_custom(GM_ADDR a, GM_ADDR b, GM_ADDR c)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    KernelMatmul op;</span></span>
<span class="line"><span>    op.Init(a, b, c);</span></span>
<span class="line"><span>    op.Process();</span></span>
<span class="line"><span>}</span></span></code></pre></div></li><li><p>对核函数进行封装，得到matmul_custom_do函数，便于主程序调用。#ifndef ASCENDC_CPU_DEBUG表示该封装函数仅在编译运行NPU侧的算子时会用到，编译运行CPU侧的算子时，可以直接调用matmul_custom函数。根据<a href="./../../../编程指南/编程模型/AI-Core-SIMD编程/核函数.html#zh-cn_topic_0000001447989210_section1915102519220">核函数定义和调用</a>章节，调用核函数时，除了需要传入参数a，b，c，还需要传入numBlocks（核函数执行的核数），l2ctrl（保留参数，设置为nullptr），stream（应用程序中维护异步操作执行顺序的stream）来规定核函数的执行配置。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#ifndef ASCENDC_CPU_DEBUG</span></span>
<span class="line"><span>// call of kernel function</span></span>
<span class="line"><span>void matmul_custom_do(uint32_t numBlocks, void* l2ctrl, void* stream, uint8_t* a, uint8_t* b, uint8_t* c)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    matmul_custom&lt;&lt;&lt;numBlocks, l2ctrl, stream&gt;&gt;&gt;(a, b, c);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>#endif</span></span></code></pre></div></li></ol><h2 id="算子类实现" tabindex="-1">算子类实现 <a class="header-anchor" href="#算子类实现" aria-label="Permalink to &quot;算子类实现&quot;">​</a></h2><p>根据上一章节介绍，核函数中会调用算子类的Init和Process函数，本章具体讲解基于编程范式实现算子类。矩阵编程范式请参考<a href="#zh-cn_topic_0000002135641293_section12567050132819">编程范式</a>。</p><p>算子类中主要包含对外开放的初始化Init函数和核心处理函数Process以及一些实现中会用到的私有成员。KernelMatmul算子类的定义如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class KernelMatmul {</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    __aicore__ inline KernelMatmul(){}</span></span>
<span class="line"><span>    // 初始化函数，完成内存初始化相关操作</span></span>
<span class="line"><span>    __aicore__ inline void Init(GM_ADDR a, GM_ADDR b, GM_ADDR c){}</span></span>
<span class="line"><span>    // 核心处理函数，实现算子逻辑</span></span>
<span class="line"><span>    // 调用私有成员函数CopyIn、SplitA、SplitB、Compute、Aggregate、CopyOut完成矩阵算子的五级流水操作</span></span>
<span class="line"><span>    __aicore__ inline void Process(){}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private:</span></span>
<span class="line"><span>    __aicore__ inline void CopyND2NZ(const LocalTensor&lt;half&gt;&amp; dst, const GlobalTensor&lt;half&gt;&amp; src, const uint16_t height, const uint16_t width){}</span></span>
<span class="line"><span>    // 搬进函数，完成编程范式中的CopyIn阶段的处理，由Process函数调用</span></span>
<span class="line"><span>    __aicore__ inline void CopyIn(){}</span></span>
<span class="line"><span>    // 搬进函数，完成编程范式中的Split阶段的处理，由Process函数调用</span></span>
<span class="line"><span>    __aicore__ inline void SplitA(){}</span></span>
<span class="line"><span>    // 搬进函数，完成编程范式中的Split阶段的处理，由Process函数循环调用两次，分别搬运b矩阵的两个part</span></span>
<span class="line"><span>    __aicore__ inline void SplitB(const LocalTensor&lt;half&gt;&amp; b1Local, const int bSplitIdx){}</span></span>
<span class="line"><span>    // 计算函数，完成编程范式中的Compute阶段的处理，由Process函数循环调用两次，分别计算出矩阵c的两个part</span></span>
<span class="line"><span>    __aicore__ inline void Compute(const LocalTensor&lt;half&gt;&amp; a2Local){}</span></span>
<span class="line"><span>    // 搬出函数，完成编程范式中的Aggregate阶段的处理，由Process函数循环调用两次，分别搬出矩阵c的两个part</span></span>
<span class="line"><span>    __aicore__ inline void Aggregate(const LocalTensor&lt;float&gt;&amp; c2Local, const int bSplitIdx){}</span></span>
<span class="line"><span>    // 搬出函数，完成编程范式中的CopyOut阶段的处理，由Process函数调用</span></span>
<span class="line"><span>    __aicore__ inline void CopyOut(){}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private:</span></span>
<span class="line"><span>    AscendC::TPipe pipe;  // Pipe内存管理对象，管理Queue队列的内存</span></span>
<span class="line"><span>    AscendC::TQue&lt;AscendC::TPosition::A1, 1&gt; inQueueA1;  // 输入数据的队列，TPosition为A1</span></span>
<span class="line"><span>    AscendC::TQue&lt;AscendC::TPosition::A2, 1&gt; inQueueA2;  // 输入数据的队列，TPosition为A2</span></span>
<span class="line"><span>    AscendC::TQue&lt;AscendC::TPosition::B1, 1&gt; inQueueB1;  // 输入数据的队列，TPosition为B1</span></span>
<span class="line"><span>    AscendC::TQue&lt;AscendC::TPosition::B2, 2&gt; inQueueB2;  // 输入数据的队列，TPosition为B2</span></span>
<span class="line"><span>    AscendC::TQue&lt;AscendC::TPosition::CO1, 2&gt; outQueueCO1;  // 输出数据的队列，TPosition为CO1</span></span>
<span class="line"><span>    AscendC::TQue&lt;AscendC::TPosition::CO2, 1&gt; outQueueCO2;  // 输出数据的队列，TPosition为CO2</span></span>
<span class="line"><span>    // 管理输入输出Global Memory内存地址的对象，其中aGM，bGM为输入，cGM为输出</span></span>
<span class="line"><span>    AscendC::GlobalTensor&lt;half&gt; aGM, bGM;</span></span>
<span class="line"><span>    AscendC::GlobalTensor&lt;float&gt; cGM;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    uint16_t m = 32;</span></span>
<span class="line"><span>    uint16_t n = 32;</span></span>
<span class="line"><span>    uint16_t k = 32;</span></span>
<span class="line"><span>    uint16_t aSize, bSize, cSize, mBlocks, nBlocks, kBlocks;</span></span>
<span class="line"><span>};</span></span></code></pre></div><p><strong>KernelMatmul构造函数实现</strong></p><p>构造函数中对私有成员变量进行初始化，具体代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>__aicore__ inline KernelMatmul()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    aSize = m * k;</span></span>
<span class="line"><span>    bSize = k * n;</span></span>
<span class="line"><span>    cSize = m * n;</span></span>
<span class="line"><span>    mBlocks = m / 16;</span></span>
<span class="line"><span>    nBlocks = n / 16;</span></span>
<span class="line"><span>    kBlocks = k / 16;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>矩阵a的形状为[m, k]，矩阵b的形状为[k, n]，矩阵c的形状为[m,n]，此样例中m、n、k均设置为32。</p><p>aSize、bSize、cSize分别为矩阵a、b、c的数值个数。</p><p>mBlocks、 nBlocks、 kBlocks为m、n、k所占分形数量，half类型一个分形Shape为16 * 16，blocks计算公式为：</p><ul><li>mBlocks = m / 16</li><li>nBlocks = n / 16</li><li>kBlocks = k / 16</li></ul><p>分形具体介绍可参考<a href="./../../../编程指南/概念原理和术语/神经网络和算子/数据排布格式.html">数据排布格式</a>。</p><p><strong>Init函数实现</strong></p><p>Init函数主要完成以下内容：</p><ul><li><p>设置输入输出Global Tensor的Global Memory内存地址。</p><p>以设置输入a在Global Memory上的内存偏移地址为例：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>aGM.SetGlobalBuffer((__gm__ half*)a);</span></span></code></pre></div><p>注意，因为本样例中Init函数的入参统一设置为uint8_t*，这里需要强转成具体的数据类型(__gm__ half*)，再进行偏移。</p></li><li><p>通过Pipe内存管理对象为输入输出Queue分配内存。</p><p>比如，为输入数据队列inQueueB2分配内存，可以通过如下代码段实现：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>pipe.InitBuffer(inQueueB2, 2, bSize * sizeof(half) / 2);</span></span></code></pre></div><p>此样例中将b矩阵切分为两个part，为inQueueB2分配内存时需要申请两块内存空间，每一块的大小为b矩阵大小的一半，outQueueCO1的内存初始化同理。</p></li></ul><p>具体的初始化函数代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>__aicore__ inline void Init(GM_ADDR a, GM_ADDR b, GM_ADDR c)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    aGM.SetGlobalBuffer((__gm__ half*)a);</span></span>
<span class="line"><span>    bGM.SetGlobalBuffer((__gm__ half*)b);</span></span>
<span class="line"><span>    cGM.SetGlobalBuffer((__gm__ float*)c);</span></span>
<span class="line"><span>    pipe.InitBuffer(inQueueA1, 1, aSize * sizeof(half));</span></span>
<span class="line"><span>    pipe.InitBuffer(inQueueA2, 1, aSize * sizeof(half));</span></span>
<span class="line"><span>    pipe.InitBuffer(inQueueB1, 1, bSize * sizeof(half));</span></span>
<span class="line"><span>    pipe.InitBuffer(inQueueB2, 2, bSize * sizeof(half) / 2);</span></span>
<span class="line"><span>    pipe.InitBuffer(outQueueCO1, 2, cSize * sizeof(float) / 2);</span></span>
<span class="line"><span>    pipe.InitBuffer(outQueueCO2, 1, cSize * sizeof(float));</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>Process函数实现</strong></p><p>基于矩阵编程范式，将核函数的实现分为5个基本阶段：CopyIn，Split，Compute，Aggregate，CopyOut。Split，Compute，Aggregate阶段需要区分a、b矩阵。Process函数中通过如下方式调用这几个函数。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>__aicore__ inline void Process()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    CopyIn();</span></span>
<span class="line"><span>    SplitA();</span></span>
<span class="line"><span>    AscendC::LocalTensor&lt;half&gt; b1Local = inQueueB1.DeQue&lt;half&gt;();</span></span>
<span class="line"><span>    AscendC::LocalTensor&lt;half&gt; a2Local = inQueueA2.DeQue&lt;half&gt;();</span></span>
<span class="line"><span>    AscendC::LocalTensor&lt;float&gt; c2Local = outQueueCO2.AllocTensor&lt;float&gt;();</span></span>
<span class="line"><span>    // split matrix b into 2 parts, [32, 16] and [32, 16]</span></span>
<span class="line"><span>    for (int i = 0; i &lt; 2; ++i) {</span></span>
<span class="line"><span>        SplitB(b1Local, i);</span></span>
<span class="line"><span>        Compute(a2Local);</span></span>
<span class="line"><span>        Aggregate(c2Local, i);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    inQueueB1.FreeTensor(b1Local);</span></span>
<span class="line"><span>    inQueueA2.FreeTensor(a2Local);</span></span>
<span class="line"><span>    outQueueCO2.EnQue&lt;float&gt;(c2Local);</span></span>
<span class="line"><span>    CopyOut();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>两次循环内，SplitB需要从inQueueB1中分别搬运两个part的b矩阵，Compute需要分别计算a矩阵和两个part b矩阵的乘法，Aggregate要分别搬运两个part的c矩阵，具体五个阶段数据流通示意图如下：</p><p><strong>图 5</strong> 数据流通示意图<br><img src="`+c+'" alt="" title="数据流通示意图"></p><p>切分b矩阵，可以实现一部分的并行，本样例的流水并行示意图如下：</p><p><strong>图 6</strong> 并行示意图<br><img src="'+r+'" alt="" title="并行示意图"></p><ol><li><p>Stage1：CopyIn函数实现。</p><ol><li><p>使用<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/AllocTensor.md" target="_blank" rel="noreferrer">AllocTensor</a>从A1，B1的Queue中申请a1Local和b1Local。</p></li><li><p>使用<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/DataCopy.md" target="_blank" rel="noreferrer">DataCopy</a>接口将矩阵a、b搬运到Local Memory，同时将其数据格式从ND转换为NZ。</p><p>一次DataCopy指令搬运height*16个数，循环执行width/16次。DataCopy的参数设置如下：</p><ul><li>blockCount设置为height，共搬运height次。</li><li>blockLen设置为1，一次搬运16个类型为half的数。</li><li>srcStride设置为width/16 - 1，源矩阵每搬运一个block需要跳跃一行。</li><li>dstStride设置为0，目的矩阵每个block在内存中连续存储。</li><li>每次循环迭代，源矩阵首地址移动16个数，目的矩阵首地址移动16*height个数。</li></ul><p>格式转换示意图如下，第一次循环搬运蓝色部分，第二次循环搬运绿色部分；图中width为32，占两个分形，height为32，占两个分形，一共搬运4个16*16分形。</p><p><strong>图 7</strong> ND to NZ转换示意图<br><img src="'+u+`" alt="" title="ND-to-NZ转换示意图"></p><p>注意：上述ND到NZ的格式转换仅作为举例说明，开发者可根据实际情况选择合适的转换方式。</p></li><li><p>使用<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/EnQue.md" target="_blank" rel="noreferrer">EnQue</a>将a1Local、b1Local分别放入A1、B1的Queue中。</p></li></ol><p>具体代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>__aicore__ inline void CopyND2NZ(const LocalTensor&lt;half&gt;&amp; dst, const GlobalTensor&lt;half&gt;&amp; src, const uint16_t height, const uint16_t width)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    for (int i = 0; i &lt; width / 16; ++i) {</span></span>
<span class="line"><span>        int srcOffset = i * 16;</span></span>
<span class="line"><span>        int dstOffset = i * 16 * height;</span></span>
<span class="line"><span>        AscendC::DataCopy(dst[dstOffset], src[srcOffset], { height, 1, uint16_t(width / 16 - 1), 0 });</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>__aicore__ inline void CopyIn()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    AscendC::LocalTensor&lt;half&gt; a1Local = inQueueA1.AllocTensor&lt;half&gt;();</span></span>
<span class="line"><span>    AscendC::LocalTensor&lt;half&gt; b1Local = inQueueB1.AllocTensor&lt;half&gt;();</span></span>
<span class="line"><span>    CopyND2NZ(a1Local, aGM, m, k);</span></span>
<span class="line"><span>    CopyND2NZ(b1Local, bGM, k, n);</span></span>
<span class="line"><span>    inQueueA1.EnQue(a1Local);</span></span>
<span class="line"><span>    inQueueB1.EnQue(b1Local);</span></span>
<span class="line"><span>}</span></span></code></pre></div></li><li><p>Stage2：SplitA函数实现。</p><ol><li><p>使用<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/DeQue.md" target="_blank" rel="noreferrer">DeQue</a>从A1的Queue中取出a1Local。</p></li><li><p>使用<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/AllocTensor.md" target="_blank" rel="noreferrer">AllocTensor</a>从A2的Queue中申请a2Local。</p></li><li><p>使用<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/LoadData.md" target="_blank" rel="noreferrer">LoadData</a>将矩阵a搬运到A2，同时将a矩阵从NZ格式转换为ZZ格式。</p><p>搬运及格式转换示意图如下：图中k为32，占kBlocks（k/16=2）个分形，m为32，占mBlocks（m/16=2）个分形，一共搬运4个16*16分形。本示例中，调用一次LoadData接口完成两个16*16分形的搬运，循环调用两次LoadData。第一次循环搬运蓝色部分两个分形，第二次循环搬运绿色部分两个分形。</p><p>单次循环中LoadData（本样例中要完成2个分形的搬运，蓝色部分或者绿色部分）的参数设置如下：</p><ul><li>repeatTimes表示数据处理的迭代次数，因为LoadData每个迭代处理一个分形，所以也可以理解为待搬运分形的个数。本样例中即为k轴方向的分形个数，设置为kBlocks，表示搬运kBlocks个分形。</li><li>srcStride表示，相邻迭代间源操作数分形首地址之间的间隔，以搬运蓝色部分分形为例：下图中左侧源操作数矩阵，第一个蓝色分形和第二个蓝色分形起始地址之间的间隔为mBlocks个分形，此处设置为mBlocks。</li><li>dstGap使用默认值，目的矩阵两个分形连续存储。</li><li>ifTranspose设置为false，每块分形搬运前搬运后都为Z格式，不使能转置。</li><li>每次循环迭代源矩阵首地址偏移16*16，目的矩阵首地址偏移16*k。</li></ul><p><strong>图 8</strong> NZ to ZZ格式转换示意图<br><img src="`+d+`" alt="" title="NZ-to-ZZ格式转换示意图"></p></li><li><p>使用<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/EnQue.md" target="_blank" rel="noreferrer">EnQue</a>将计算结果a2Local放入到A2的Queue中。</p><p>具体代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    __aicore__ inline void SplitA()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        int srcOffset = 0;</span></span>
<span class="line"><span>        int dstOffset = 0;</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;half&gt; a1Local = inQueueA1.DeQue&lt;half&gt;();</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;half&gt; a2Local = inQueueA2.AllocTensor&lt;half&gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // transform nz to zz</span></span>
<span class="line"><span>        for (int i = 0; i &lt; mBlocks; ++i) {</span></span>
<span class="line"><span>            AscendC::LoadData2DParams loadDataParams;</span></span>
<span class="line"><span>            loadDataParams.repeatTimes = kBlocks;</span></span>
<span class="line"><span>            loadDataParams.srcStride = mBlocks;</span></span>
<span class="line"><span>            loadDataParams.ifTranspose = false;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            AscendC::LoadData(a2Local[dstOffset], a1Local[srcOffset], loadDataParams);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>            srcOffset += 16 * 16;</span></span>
<span class="line"><span>            dstOffset += k * 16;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        inQueueA2.EnQue&lt;half&gt;(a2Local);</span></span>
<span class="line"><span>        inQueueA1.FreeTensor(a1Local);</span></span>
<span class="line"><span>    }</span></span></code></pre></div></li></ol></li><li><p>Stage2：SplitB函数实现。</p><ol><li><p>SplitB需要传入两个参数：使用<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/DeQue.md" target="_blank" rel="noreferrer">DeQue</a>从B1的Queue中取出的b1Local和循环迭代变量index。</p></li><li><p>使用<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/AllocTensor.md" target="_blank" rel="noreferrer">AllocTensor</a>从B2的Queue中申请b2Local。</p></li><li><p>使用<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/LoadData.md" target="_blank" rel="noreferrer">LoadData</a>将b矩阵搬运到B2，同时从NZ格式转换为ZN格式。</p><p>搬运及格式转换示意图如下：图中k为32，占kBlocks（k/16=2）个分形，n为32，占nBlocks（n/16=2）个分形，一共搬运4个16*16分形。本示例中，调用一次LoadData接口完成两个16*16分形的搬运，循环调用两次LoadData。第一次循环搬运蓝色部分两个分形，第二次循环搬运绿色部分两个分形。</p><p>单次循环中LoadData（本样例中要完成2个分形的搬运，蓝色部分或者绿色部分）的参数设置如下：</p><ul><li>repeatTimes表示数据处理的迭代次数，因为LoadData每个迭代处理一个分形，所以也可以理解为待搬运分形的个数。本样例中即为k轴方向的分形个数，设置为kBlocks，表示搬运kBlocks个分形。</li><li>srcStride相邻迭代间源操作数分形首地址之间的间隔，以搬运蓝色部分分形为例：下图中左侧源操作数矩阵，第一个蓝色分形和第二个蓝色分形起始地址之间的间隔为1个分形，此处设置为1，源矩阵两个分形连续存储。</li><li>dstGap使用默认值0，目的矩阵两个分形连续存储。</li><li>ifTranspose设置为true，每块分形搬运前为Z格式，搬运后需要为N格式，需要使能转置。</li><li>每次循环迭代，源矩阵首地址需要偏移k*n/2。</li></ul><p><strong>图 9</strong> NZ to ZN格式转换示意图<br><img src="`+g+`" alt="" title="NZ-to-ZN格式转换示意图"></p></li><li><p>使用<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/EnQue.md" target="_blank" rel="noreferrer">EnQue</a>将计算结果b2Local放入到B2的Queue中。</p></li></ol><p>具体代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    __aicore__ inline void SplitB(const AscendC::LocalTensor&lt;half&gt;&amp; b1Local, const int bSplitIdx)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;half&gt; b2Local = inQueueB2.AllocTensor&lt;half&gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // transform nz to zn</span></span>
<span class="line"><span>        AscendC::LoadData2DParams loadDataParams;</span></span>
<span class="line"><span>        loadDataParams.repeatTimes = kBlocks;</span></span>
<span class="line"><span>        loadDataParams.srcStride = 1;</span></span>
<span class="line"><span>        loadDataParams.ifTranspose = true;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        AscendC::LoadData(b2Local, b1Local[bSplitIdx * bSize / 2], loadDataParams);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        inQueueB2.EnQue&lt;half&gt;(b2Local);</span></span>
<span class="line"><span>    }</span></span></code></pre></div></li><li><p>Stage3：Compute函数实现，完成核心的矩阵计算功能。</p><ol><li>Compute函数需要传入参数a2Local，a2Local从A2的Queue中使用<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/DeQue.md" target="_blank" rel="noreferrer">DeQue</a>取出。</li><li>使用<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/AllocTensor.md" target="_blank" rel="noreferrer">AllocTensor</a>从CO1的Queue中申请c1Local。</li><li>使用<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/DeQue.md" target="_blank" rel="noreferrer">DeQue</a>从B2中取出b2Local。</li><li>使用<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/Mmad.md" target="_blank" rel="noreferrer">Mmad</a>完成矩阵乘计算。</li><li>使用<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/EnQue.md" target="_blank" rel="noreferrer">EnQue</a>将计算结果c1Local放入到CO1的Queue中。</li></ol><p>具体代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    __aicore__ inline void Compute(const AscendC::LocalTensor&lt;half&gt;&amp; a2Local)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;half&gt; b2Local = inQueueB2.DeQue&lt;half&gt;();</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;float&gt; c1Local = outQueueCO1.AllocTensor&lt;float&gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        AscendC::MmadParams mmadParams;</span></span>
<span class="line"><span>        mmadParams.m = m;</span></span>
<span class="line"><span>        mmadParams.n = n / 2;</span></span>
<span class="line"><span>        mmadParams.k = k;</span></span>
<span class="line"><span>        AscendC::Mmad(c1Local, a2Local, b2Local, mmadParams);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        outQueueCO1.EnQue&lt;float&gt;(c1Local);</span></span>
<span class="line"><span>        inQueueB2.FreeTensor(b2Local);</span></span>
<span class="line"><span>    }</span></span></code></pre></div></li><li><p>Stage4：Aggregate函数实现，完成数据汇聚操作。</p><ol><li><p>Aggregate需要传入两个参数：使用<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/AllocTensor.md" target="_blank" rel="noreferrer">AllocTensor</a>从CO2的Queue中申请的c2Local和循环迭代变量index。</p></li><li><p>使用<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/DeQue.md" target="_blank" rel="noreferrer">DeQue</a>从CO1中取出c1Local。</p></li><li><p>使用<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/DataCopy.md" target="_blank" rel="noreferrer">DataCopy</a>将结果矩阵从CO1搬运到CO2。</p><p>DataCopy参数设置如下：</p><ul><li>blockCount设置为1，blockLen设置为2，连续搬运两个分形，无需格式转换。</li><li>blockMode设置为BlockMode::BLOCK_MODE_MATRIX，表示需要按分形搬运。</li><li>c2Local首地址偏移量设置为index * cSize / 2。</li></ul></li></ol><p>具体代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    __aicore__ inline void Aggregate(const AscendC::LocalTensor&lt;float&gt;&amp; c2Local, const int bSplitIdx)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;float&gt; c1Local = outQueueCO1.DeQue&lt;float&gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        AscendC::DataCopyParams dataCopyParams;</span></span>
<span class="line"><span>        dataCopyParams.blockCount = 1;</span></span>
<span class="line"><span>        dataCopyParams.blockLen = 2;</span></span>
<span class="line"><span>        AscendC::DataCopyEnhancedParams enhancedParams;</span></span>
<span class="line"><span>        enhancedParams.blockMode = AscendC::BlockMode::BLOCK_MODE_MATRIX;</span></span>
<span class="line"><span>        AscendC::DataCopy(c2Local[bSplitIdx * cSize / 2], c1Local, dataCopyParams, enhancedParams);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        outQueueCO1.FreeTensor(c1Local);</span></span>
<span class="line"><span>    }</span></span></code></pre></div></li><li><p>Stage5：CopyOut函数实现。</p><ol><li><p>使用<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/DeQue.md" target="_blank" rel="noreferrer">DeQue</a>从CO2中取出c2Local。</p></li><li><p>使用<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/DataCopy.md" target="_blank" rel="noreferrer">DataCopy</a>将结果矩阵从CO2搬运到Global Memory，同时需要将格式从NZ转换为ND。</p><p>每次循环移动一个分形，搬运m*16个数。DataCopy参数说明如下：</p><ul><li>blockCount设置为m，共搬运m次。</li><li>blockLen设置为2，DataCopy指令一次搬运2个block，每个block16个数。</li><li>srcStride设置为0，每两次搬运间没有间隙。</li><li>dstStride设置为(nBlocks - 1) * 2，每两次搬运间隔2个block。</li><li>每次循环迭代，目的矩阵偏移16，源矩阵偏移m*16。</li></ul><p>格式转换示意图如下，第一次循环搬运蓝色部分数据，第二次循环搬运绿色部分数据。</p><p><strong>图 10</strong> NZ to ND格式转换示意图<br><img src="`+m+`" alt="" title="NZ-to-ND格式转换示意图"></p></li></ol><p>具体代码如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>    __aicore__ inline void CopyOut()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;float&gt; c2Local = outQueueCO2.DeQue&lt;float&gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // transform nz to nd</span></span>
<span class="line"><span>        for (int i = 0; i &lt; nBlocks; ++i) {</span></span>
<span class="line"><span>            AscendC::DataCopy(cGM[i * 16], c2Local[i * m * 16], { m, 2, 0, uint16_t((nBlocks - 1) * 2) });</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        outQueueCO2.FreeTensor(c2Local);</span></span>
<span class="line"><span>    }</span></span></code></pre></div></li></ol>`,49)])])}const q=s(b,[["render",h]]);export{D as __pageData,q as default};
