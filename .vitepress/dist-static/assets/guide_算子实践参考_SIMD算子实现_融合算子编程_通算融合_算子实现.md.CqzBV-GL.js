import{c as n,Q as s,j as l,m as t}from"./chunks/framework.DOi4mjdC.js";const p="/assets/AllGatherMatmul%E9%80%9A%E4%BF%A1%E8%AE%A1%E7%AE%97%E6%8E%A9%E7%9B%96%E7%A4%BA%E6%84%8F%E5%9B%BE.Ddbtl5x2.png",e="/assets/MatmulAllReduce%E9%80%9A%E4%BF%A1%E8%AE%A1%E7%AE%97%E6%8E%A9%E7%9B%96%E7%A4%BA%E6%84%8F%E5%9B%BE.DpU86UVN.png",i="/assets/%E9%80%9A%E7%AE%97%E8%9E%8D%E5%90%88%E7%AE%97%E5%AD%90%E9%80%9A%E4%BF%A1%E6%B5%81%E7%A8%8B%E7%A4%BA%E6%84%8F%E5%9B%BE.VPpOXQlz.png",c="/assets/AllGatherMatmul%E7%AC%AC%E4%B8%80%E8%BD%AE%E9%80%9A%E4%BF%A1%E4%B8%8Erank0%E4%B8%8A%E7%9A%84%E6%9C%AC%E5%8D%A1%E6%95%B0%E6%8D%AE%E7%9F%A9%E9%98%B5%E4%B9%98%E7%A4%BA%E6%84%8F%E5%9B%BE.xjxXDy97.png",o="/assets/AllGatherMatmul%E7%AC%AC%E4%BA%8C%E8%BD%AE%E9%80%9A%E4%BF%A1%E4%B8%8Erank0%E4%B8%8A%E4%B8%BB%E5%9D%971%E7%9A%84%E7%9F%A9%E9%98%B5%E4%B9%98%E7%A4%BA%E6%84%8F%E5%9B%BE.mN83_RvN.png",r="/assets/AllGatherMatmul%E7%AE%97%E5%AD%90%E5%9C%A8rank0%E7%9A%84%E7%9F%A9%E9%98%B5%E4%B9%98%E7%A4%BA%E6%84%8F%E5%9B%BE.DJbpWM6i.png",u="/assets/Matmul%E8%AE%A1%E7%AE%97%E5%88%86%E6%A0%B8%E7%A4%BA%E6%84%8F%E5%9B%BE.Ci3VcbA8.png",C=JSON.parse('{"title":"算子实现","description":"","frontmatter":{},"headers":[{"level":1,"title":"算子实现","slug":"算子实现"},{"level":2,"title":"算子分析","slug":"算子分析"},{"level":2,"title":"数据流分析","slug":"数据流分析"},{"level":2,"title":"创建算子工程","slug":"创建算子工程"},{"level":2,"title":"算子原型定义","slug":"算子原型定义"},{"level":2,"title":"Tiling实现","slug":"tiling实现"},{"level":2,"title":"Kernel实现","slug":"kernel实现"},{"level":2,"title":"编译和运行","slug":"编译和运行"}],"relativePath":"guide/算子实践参考/SIMD算子实现/融合算子编程/通算融合/算子实现.md","filePath":"guide/算子实践参考/SIMD算子实现/融合算子编程/通算融合/算子实现.md"}'),g={name:"guide/算子实践参考/SIMD算子实现/融合算子编程/通算融合/算子实现.md"};function m(d,a,h,M,A,b){return s(),l("div",null,[...a[0]||(a[0]=[t(`<h1 id="算子实现" tabindex="-1">算子实现 <a class="header-anchor" href="#算子实现" aria-label="Permalink to &quot;算子实现&quot;">​</a></h1><p>在通算融合类算子的实现中，通信操作使用<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/HCCL%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E.md" target="_blank" rel="noreferrer">Hccl高阶API</a>，矩阵乘计算操作使用<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/Matmul-Kernel%E4%BE%A7%E6%8E%A5%E5%8F%A3.md" target="_blank" rel="noreferrer">Matmul高阶API</a>。关于更多集合通信的内容和相关概念请参考<a href="https://www.hiascend.com/document/redirect/CannCommunityHcclUg" target="_blank" rel="noreferrer">《HCCL集合通信库》</a>。通算融合算子的开发过程与一般算子相同，但请注意，当前通算融合算子暂不支持<a href="./../../../../编程指南/附录/基于样例工程完成Kernel直调.html">Kernel直调</a>和<a href="./../../../../编程指南/附录/算子入图（GE图）开发/概述.html">入图（GE图）开发</a>，仅支持<a href="./../../../../编程指南/附录/工程化算子开发/单算子API调用.html">单算子API调用</a>。</p><p>下文将以AllGatherMatmulCustom算子（简称AllGatherMatmul）的实现为例，从算子分析、数据流分析、创建算子工程、原型定义、Tiling实现、Kernel实现、编译与运行等方面介绍通算融合算子的设计和实现流程。本样例中算子的完整代码请参见<a href="https://gitcode.com/cann/ops-transformer/tree/master/mc2/all_gather_matmul_v2" target="_blank" rel="noreferrer">AllGatherMatmul样例</a>。该样例仅支持在<strong>Atlas A2 训练系列产品/Atlas A2 推理系列产品</strong>上运行。</p><h2 id="算子分析" tabindex="-1">算子分析 <a class="header-anchor" href="#算子分析" aria-label="Permalink to &quot;算子分析&quot;">​</a></h2><p>算子分析是指明确算子的数学表达式、输入、输出，核函数的名称等信息。</p><ol><li><p>明确算子的数学表达式及通信计算逻辑。</p><p>AllGatherMatmul算子实现了<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/AllGather.md" target="_blank" rel="noreferrer">AllGather</a>通信和<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/Matmul-Kernel%E4%BE%A7%E6%8E%A5%E5%8F%A3.md" target="_blank" rel="noreferrer">Matmul</a>矩阵乘法的融合。算子逻辑为：对输入的通信矩阵a做AllGather通信得到Matmul计算的左矩阵，即通信结果gather_out，将gather_out和右矩阵b做Matmul运算得到输出c。对应的数学表达式为：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>gather_out = AllGather(a)</span></span>
<span class="line"><span>c = gather_out ∗ b</span></span></code></pre></div></li><li><p>明确输入、输出和属性。</p><ul><li>a、b为源操作数，a为通信的输入矩阵，形状为[M, K]；b为Matmul的右矩阵，形状为[K, N]。在样例中，M、K、N分别固定为512、5120、640。</li><li>gather_out为目的操作数，存放AllGather通信结果，形状为[M * rankDim, K]，其中，rankDim为通信域内的卡数，在样例中固定为8。</li><li>c为目的操作数，存放Matmul运算结果，形状为[M * rankDim, N]。</li><li>算子输入输出的数据类型为float16，<a href="./../../../../编程指南/概念原理和术语/神经网络和算子/数据排布格式.html">format</a>为：ND。</li><li>group为算子属性，表示通信域名称，明确算子运行时所在的通信域。</li></ul></li><li><p>确定核函数名称和参数。</p><ul><li>本样例中核函数命名为all_gather_matmul_custom。</li><li>根据对算子输入输出的分析，确定核函数的参数aGM，bGM，cGM，gatherOutGM；aGM，bGM为输入在Global Memory上的内存地址，cGM，gatherOutGM为输出在Global Memory上的内存地址。注意，核函数的参数和单算子API调用的输入输出在命名上存在区别，原因是核函数的参数是输入输出在Global Memory上的内存地址，而单算子API调用时输入输出的类型是aclTensor，两者并不完全一致。</li></ul></li><li><p>确定算子实现所需接口。</p><ul><li>算子涉及AllGather通信，查看Ascend C API参考中的通信相关接口，需要使用<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/HCCL%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E.md" target="_blank" rel="noreferrer">Hccl高阶API</a>来实现AllGather通信。</li><li>算子涉及Matmul左右矩阵在外部存储和内部存储间的数据搬运，查看Ascend C API参考中的数据搬运接口，需要使用<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/DataCopy.md" target="_blank" rel="noreferrer">DataCopy</a>来实现数据搬运。</li><li>计算过程涉及矩阵计算操作，查看Ascend C API参考中的矩阵计算相关接口，需要使用<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/Matmul-Kernel%E4%BE%A7%E6%8E%A5%E5%8F%A3.md" target="_blank" rel="noreferrer">Matmul高阶API</a>实现矩阵乘计算。</li></ul></li></ol><p><strong>表 1</strong> AllGatherMatmulCustom算子规格</p><p>&lt;table&gt;&lt;tbody&gt;&lt;tr&gt;&lt;th class=&quot;firstcol&quot; valign=&quot;top&quot;&gt;&lt;p&gt;算子类型（OpType）&lt;/p&gt; &lt;/th&gt; &lt;td class=&quot;cellrowborder&quot; colspan=&quot;4&quot; valign=&quot;top&quot;&gt;&lt;p&gt;&lt;span&gt;AllGatherMatmulCustom&lt;/span&gt;&lt;/p&gt; &lt;/td&gt; &lt;/tr&gt; &lt;tr&gt;&lt;th class=&quot;firstcol&quot; rowspan=&quot;5&quot; valign=&quot;top&quot; width=&quot;19.8%&quot;&gt;&lt;p&gt;算子输入输出&lt;/p&gt; &lt;/th&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;19.189999999999998%&quot;&gt;&lt;p&gt;&lt;strong&gt;name&lt;/strong&gt;&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;16.39%&quot;&gt;&lt;p&gt;&lt;strong&gt;shape&lt;/strong&gt;&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;15.09%&quot;&gt;&lt;p&gt;&lt;strong&gt;data type&lt;/strong&gt;&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;29.53%&quot;&gt;&lt;p&gt;&lt;strong&gt;format&lt;/strong&gt;&lt;/p&gt; &lt;/td&gt; &lt;/tr&gt; &lt;tr&gt;&lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot;&gt;&lt;p&gt;a&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot;&gt;&lt;p&gt;[512, 5120]&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot;&gt;&lt;p&gt;&lt;span&gt;float16&lt;/span&gt;&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot;&gt;&lt;p&gt;ND&lt;/p&gt; &lt;/td&gt; &lt;/tr&gt; &lt;tr&gt;&lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot;&gt;&lt;p&gt;b&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot;&gt;&lt;p&gt;[5120, 640]&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot;&gt;&lt;p&gt;&lt;span&gt;float16&lt;/span&gt;&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot;&gt;&lt;p&gt;ND&lt;/p&gt; &lt;/td&gt; &lt;/tr&gt; &lt;tr&gt;&lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot;&gt;&lt;p&gt;c&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot;&gt;&lt;p&gt;[4096, 640]&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot;&gt;&lt;p&gt;&lt;span&gt;float16&lt;/span&gt;&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot;&gt;&lt;p&gt;ND&lt;/p&gt; &lt;/td&gt; &lt;/tr&gt; &lt;tr&gt;&lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot;&gt;&lt;p&gt;gather_out&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot;&gt;&lt;p&gt;[&lt;span&gt;4096, 5120]&lt;/span&gt;&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot;&gt;&lt;p&gt;&lt;span&gt;float16&lt;/span&gt;&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot;&gt;&lt;p&gt;ND&lt;/p&gt; &lt;/td&gt; &lt;/tr&gt; &lt;tr&gt;&lt;th class=&quot;firstcol&quot; valign=&quot;top&quot;&gt;&lt;p&gt;算子属性&lt;/p&gt; &lt;/th&gt; &lt;td class=&quot;cellrowborder&quot; colspan=&quot;4&quot; valign=&quot;top&quot;&gt;&lt;p&gt;group（char*），Host侧标识通信域的字符串，表示通信域名称。&lt;/p&gt; &lt;/td&gt; &lt;/tr&gt; &lt;tr&gt;&lt;th class=&quot;firstcol&quot; valign=&quot;top&quot;&gt;&lt;p&gt;核函数名称&lt;/p&gt; &lt;/th&gt; &lt;td class=&quot;cellrowborder&quot; colspan=&quot;4&quot; valign=&quot;top&quot;&gt;&lt;p&gt;all_gather_matmul_custom&lt;/p&gt; &lt;/td&gt; &lt;/tr&gt; &lt;/tbody&gt; &lt;/table&gt;</p><h2 id="数据流分析" tabindex="-1">数据流分析 <a class="header-anchor" href="#数据流分析" aria-label="Permalink to &quot;数据流分析&quot;">​</a></h2><p>AllGatherMatmul算子的数据在卡间进行AllGather通信，在卡内进行Matmul计算，通信和计算按照数据切分后的主块、尾块分多次进行，流水互相掩盖。分析过程中，假定通信矩阵的切分策略为按M轴进行切分，切分后主块数（tileCnt）为2，尾块数（tailCnt）为1，则可得到通信计算掩盖示意图如下。</p><p><strong>图 1</strong> AllGatherMatmul通信计算掩盖示意图<br><img src="`+p+'" alt="" title="AllGatherMatmul通信计算掩盖示意图"></p><p>AllGather的功能为将通信域内所有卡的输入按照卡id重新排序，然后拼接起来，再将结果发送到所有卡。因此，AllGather的结果中包含本卡数据，即本卡输入的通信矩阵a，算子无需等待这部分数据的通信完成，也无需对数据进行切分，可直接基于完整的通信矩阵a进行Matmul计算。AllGatherMatmul算子首先做本卡数据的Matmul计算，这样做的好处在于主块1的通信能与Matmul计算互相掩盖，同时，主块1、主块2、尾块1的计算无需再包括对本卡数据的Matmul计算，可以减少后续主尾块的计算量，增加通信计算的掩盖率，从而提高性能。注意，不是所有的通算融合算子都适合首先进行本卡数据的Matmul计算。因为AllGatherMatmul算子的通信在计算之前，所以先进行本卡数据的Matmul计算，可以实现本卡数据计算和第一次通信之间的互相掩盖。如果是计算在通信前的算子，如MatmulAllReduce，建议将本卡数据的计算放在最后，与最后一次通信互相掩盖，如下图所示。</p><p><strong>图 2</strong> MatmulAllReduce通信计算掩盖示意图<br><img src="'+e+'" alt="" title="MatmulAllReduce通信计算掩盖示意图"></p><p>AllGatherMatmul算子逻辑分析：</p><ol><li><p>AI Core将要执行的通信信息写入Global Memory中的消息区，实现任务下发。消息区是特定地址的Global Memory，AI Core和AI CPU通过向其写入和轮询读取来实现消息在两者间的传递，这些操作统一封装于<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/HCCL%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E.md" target="_blank" rel="noreferrer">Hccl高阶API</a>中。</p><p><strong>图 3</strong> 通算融合算子通信流程示意图<br><img src="'+i+'" alt="" title="通算融合算子通信流程示意图"></p></li><li><p>AI CPU从消息区读取到所有通信任务信息，开始基于HCCS（华为缓存一致性系统，用于CPU/NPU之间的高速互联）或RoCE（承载在融合以太网上的RDMA技术，即跨越以太网的RDMA通信方式）等链路执行第一轮AllGather集合通信任务。与此同时，AI Core开始对本卡数据进行Matmul计算。</p><p>下图是通信卡数为4时，第一轮通信与本卡计算的示意图。tile 1表示图示为第一轮通信和与其相互掩盖的矩阵乘计算的处理流程。图中切分后的小矩阵中形如X-Y的数字表示它所在的数据块对应于第X张卡第Y块数据。</p><p><strong>图 4</strong> AllGatherMatmul第一轮通信与rank0上的本卡数据矩阵乘示意图<br><img src="'+c+'" alt="" title="AllGatherMatmul第一轮通信与rank0上的本卡数据矩阵乘示意图"></p></li><li><p>AI CPU完成第一轮通信任务后，向消息区写入第一轮通信任务已完成的消息，并开始执行第二轮通信任务。同时，AI Core在完成本卡数据的Matmul计算后，通过轮询消息区等到第一轮通信任务已完成的消息，开始进行第一轮通信结果即主块1的Matmul计算。</p><p>下图是通信卡数为4时，第二轮通信与rank0计算的示意图。tile 2表示图示为第二轮通信和与其相互掩盖的矩阵乘计算的处理流程。</p><p><strong>图 5</strong> AllGatherMatmul第二轮通信与rank0上主块1的矩阵乘示意图<br><img src="'+o+`" alt="" title="AllGatherMatmul第二轮通信与rank0上主块1的矩阵乘示意图"></p></li><li><p>类似步骤3，逐步完成剩余所有数据块的通信和计算。</p></li></ol><h2 id="创建算子工程" tabindex="-1">创建算子工程 <a class="header-anchor" href="#创建算子工程" aria-label="Permalink to &quot;创建算子工程&quot;">​</a></h2><p>创建通算融合算子的算子工程与一般算子相同，具体请参考<a href="./../../../../编程指南/附录/工程化算子开发/创建算子工程.html">创建算子工程</a>章节。本样例基于如下原型定义json文件，使用自定义算子工程生成工具msOpGen，为AllGatherMatmul算子创建算子工程。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        &quot;op&quot;: &quot;AllGatherMatmulCustom&quot;,</span></span>
<span class="line"><span>        &quot;input_desc&quot;: [</span></span>
<span class="line"><span>            {</span></span>
<span class="line"><span>                &quot;name&quot;: &quot;a&quot;,</span></span>
<span class="line"><span>                &quot;param_type&quot;: &quot;required&quot;,</span></span>
<span class="line"><span>                &quot;format&quot;: [</span></span>
<span class="line"><span>                    &quot;ND&quot;</span></span>
<span class="line"><span>                ],</span></span>
<span class="line"><span>                &quot;type&quot;: [</span></span>
<span class="line"><span>                    &quot;float16&quot;</span></span>
<span class="line"><span>                ]</span></span>
<span class="line"><span>            },</span></span>
<span class="line"><span>            {</span></span>
<span class="line"><span>                &quot;name&quot;: &quot;b&quot;,</span></span>
<span class="line"><span>                &quot;param_type&quot;: &quot;required&quot;,</span></span>
<span class="line"><span>                &quot;format&quot;: [</span></span>
<span class="line"><span>                    &quot;ND&quot;</span></span>
<span class="line"><span>                ],</span></span>
<span class="line"><span>                &quot;type&quot;: [</span></span>
<span class="line"><span>                    &quot;float16&quot;</span></span>
<span class="line"><span>                ]</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        ],</span></span>
<span class="line"><span>        &quot;output_desc&quot;:[</span></span>
<span class="line"><span>            {</span></span>
<span class="line"><span>                &quot;name&quot;: &quot;c&quot;,</span></span>
<span class="line"><span>                &quot;param_type&quot;: &quot;required&quot;,</span></span>
<span class="line"><span>                &quot;format&quot;: [</span></span>
<span class="line"><span>                    &quot;ND&quot;</span></span>
<span class="line"><span>                ],</span></span>
<span class="line"><span>                &quot;type&quot;: [</span></span>
<span class="line"><span>                    &quot;float16&quot;</span></span>
<span class="line"><span>                ]</span></span>
<span class="line"><span>            },</span></span>
<span class="line"><span>            {</span></span>
<span class="line"><span>                &quot;name&quot;: &quot;gather_out&quot;,</span></span>
<span class="line"><span>                &quot;param_type&quot;: &quot;required&quot;,</span></span>
<span class="line"><span>                &quot;format&quot;: [</span></span>
<span class="line"><span>                    &quot;ND&quot;</span></span>
<span class="line"><span>                ],</span></span>
<span class="line"><span>                &quot;type&quot;: [</span></span>
<span class="line"><span>                    &quot;float16&quot;</span></span>
<span class="line"><span>                ]</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        ],</span></span>
<span class="line"><span>        &quot;attr&quot;: [</span></span>
<span class="line"><span>            {</span></span>
<span class="line"><span>                &quot;name&quot;: &quot;group&quot;,</span></span>
<span class="line"><span>                &quot;type&quot;: &quot;string&quot;,</span></span>
<span class="line"><span>                &quot;default_value&quot;:&quot;&quot;,</span></span>
<span class="line"><span>                &quot;param_type&quot;:&quot;required&quot;</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        ]</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>]</span></span></code></pre></div><h2 id="算子原型定义" tabindex="-1">算子原型定义 <a class="header-anchor" href="#算子原型定义" aria-label="Permalink to &quot;算子原型定义&quot;">​</a></h2><p>相比于一般算子，通算融合算子在实现<a href="./../../../../编程指南/附录/工程化算子开发/算子原型定义.html">算子原型定义</a>时，有如下约束：</p><ul><li>必须定义一个表示算子通信域名称的属性。通信域是集合通信执行的上下文，管理对应的通信实体（例如一个NPU就是一个通信实体）和通信所需的资源。</li><li>必须通过原型注册中的MC2接口注册该算子为通算融合算子，并通过HcclGroup接口配置该算子的通信域名称。</li></ul><p>AllGatherMatmul算子使用&quot;group&quot;属性表示该算子的通信域名称，其在算子原型中定义如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>this-&gt;Attr(&quot;group&quot;).AttrType(REQUIRED).String(); // &quot;group&quot;为通算融合算子的属性，表示通信域名称，原型定义中的String类型对应单算子API中的char*类型</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span>this-&gt;MC2().HcclGroup(&quot;group&quot;); // 将&quot;group&quot;属性配置为该算子的通信域名称</span></span></code></pre></div><p>AllGatherMatmul算子的完整原型定义如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>namespace ops {</span></span>
<span class="line"><span>class AllGatherMatmulCustom : public OpDef {</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    explicit AllGatherMatmulCustom(const char *name) : OpDef(name)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        this-&gt;Input(&quot;a&quot;)</span></span>
<span class="line"><span>            .ParamType(REQUIRED)</span></span>
<span class="line"><span>            .DataType({ge::DT_FLOAT16})</span></span>
<span class="line"><span>            .Format({ge::FORMAT_ND})</span></span>
<span class="line"><span>            .UnknownShapeFormat({ge::FORMAT_ND});</span></span>
<span class="line"><span>        this-&gt;Input(&quot;b&quot;)</span></span>
<span class="line"><span>            .ParamType(REQUIRED)</span></span>
<span class="line"><span>            .DataType({ge::DT_FLOAT16})</span></span>
<span class="line"><span>            .Format({ge::FORMAT_ND})</span></span>
<span class="line"><span>            .UnknownShapeFormat({ge::FORMAT_ND})</span></span>
<span class="line"><span>            .IgnoreContiguous();</span></span>
<span class="line"><span>        this-&gt;Output(&quot;c&quot;)</span></span>
<span class="line"><span>            .ParamType(REQUIRED)</span></span>
<span class="line"><span>            .DataType({ge::DT_FLOAT16})</span></span>
<span class="line"><span>            .Format({ge::FORMAT_ND})</span></span>
<span class="line"><span>            .UnknownShapeFormat({ge::FORMAT_ND});</span></span>
<span class="line"><span>        this-&gt;Output(&quot;gather_out&quot;)</span></span>
<span class="line"><span>            .ParamType(REQUIRED)</span></span>
<span class="line"><span>            .DataType({ge::DT_FLOAT16})</span></span>
<span class="line"><span>            .Format({ge::FORMAT_ND})</span></span>
<span class="line"><span>            .UnknownShapeFormat({ge::FORMAT_ND});</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        this-&gt;Attr(&quot;group&quot;).AttrType(REQUIRED).String();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        this-&gt;AICore().SetTiling(AllGatherMatmulCustomTilingFunc); // 注册AllGatherMatmulCustomTilingFunc为Tiling入口函数</span></span>
<span class="line"><span>        this-&gt;AICore().AddConfig(&quot;ascendxxx&quot;); // ascendxxx请修改为对应的AI处理器型号。</span></span>
<span class="line"><span>        this-&gt;MC2().HcclGroup(&quot;group&quot;);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span>OP_ADD(AllGatherMatmulCustom);</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="tiling实现" tabindex="-1">Tiling实现 <a class="header-anchor" href="#tiling实现" aria-label="Permalink to &quot;Tiling实现&quot;">​</a></h2><p>通算融合算子Tiling策略的设计主要包括通信切分策略、Matmul多核切分和核内切分策略。</p><ul><li><p>通信切分策略：每轮通信数据块的大小，对通算融合算子的性能有较大影响。样例中按照主块M轴长度448对通信矩阵A的M轴进行切分。具体场景中如何确定切分策略请参考<a href="./../../../优秀实践/MC-算子性能调优案例.html">MC²算子性能调优案例</a>。</p></li><li><p>Matmul多核切分和核内切分:</p><ul><li>多核切分: 根据当前核数，对输入shape的M、K、N进行多核切分，得到单核内shape大小singleCoreM、singleCoreK、singleCoreN。</li><li>核内切分: 根据Local Memory的大小约束，对单核内的shape大小进一步切分，得到A、B、C矩阵参与一次矩阵乘指令的shape大小baseM、baseN、baseK。</li></ul><p>如上所述，通信矩阵被切分为主块、尾块，主块、尾块的通信结果以及本卡数据需要分别进行Matmul计算。如下图，主块、尾块和本卡数据在M轴的长度分别为tileM、tailM和rankM，即Matmul计算时的左矩阵存在三种不同的形状，因此需要分别以通信矩阵主块、尾块和本卡数据块的大小为矩阵乘原始的输入形状，调用<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/Matmul-Kernel%E4%BE%A7%E6%8E%A5%E5%8F%A3.md" target="_blank" rel="noreferrer">Matmul高阶API</a>提供的Tiling接口，得到对应这三种形状的多核切分和核内切分策略。这里，singleCoreM、baseM等概念和相关原理的介绍请参考<a href="./基础知识.html">基础知识</a>。</p><p><strong>图 6</strong> AllGatherMatmul算子在rank0的矩阵乘示意图<br><img src="`+r+`" alt="" title="AllGatherMatmul算子在rank0的矩阵乘示意图"></p></li></ul><p>下面给出Tiling实现的关键步骤：</p><ol><li><p>定义AllGatherMatmul算子的Tiling结构体。</p><p>通信和Matmul融合得到的通算融合算子的Tiling结构体一般包括如下三个部分：</p><ul><li><a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/TilingData%E7%BB%93%E6%9E%84%E4%BD%93.md" target="_blank" rel="noreferrer">Hccl高阶API的Tiling结构体</a>。定义Mc2InitTiling和Mc2CcTiling参数。Mc2InitTiling参数用于初始化通信任务配置，必须定义为算子Tiling结构体的第一个参数。Mc2CcTiling为具体每个通信任务的参数配置，由于AllGatherMatmul算子中只有AllGather一个通信任务，因此仅需定义一个Mc2CcTiling参数。</li><li><a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/TCubeTiling%E7%BB%93%E6%9E%84%E4%BD%93.md" target="_blank" rel="noreferrer">Matmul高阶API的Tiling结构体TCubeTiling</a>。一般而言，主块、尾块和本卡数据的shape是不同的，由于TCubeTiling只能存储对一个输入形状进行Tiling计算得到的结果，因此需要分别定义主块、尾块和本卡数据块的Tiling结构体，来存放它们的多核切分和核内切分策略。</li><li>AllGatherMatmul算子额外需要的自定义结构体AllGatherMatmulTiling。</li></ul><p>AllGatherMatmul算子的完整Tiling结构体定义如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct AllGatherMatmulTiling {</span></span>
<span class="line"><span>    uint32_t rankM;           // A矩阵M轴的长度</span></span>
<span class="line"><span>    uint32_t rankN;           // B矩阵N轴的长度</span></span>
<span class="line"><span>    uint32_t rankK;           // A、B矩阵K轴的长度</span></span>
<span class="line"><span>    uint32_t tileNum;         // 主块个数</span></span>
<span class="line"><span>    uint32_t tailM;           // 尾块的M轴长度</span></span>
<span class="line"><span>    uint32_t tailNum;         // 尾块个数（0或1）</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class AllGatherMatmulCustomTilingData {</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    Mc2InitTiling mc2InitTiling;</span></span>
<span class="line"><span>    Mc2CcTiling mc2CcTiling;</span></span>
<span class="line"><span>    TCubeTiling localTiling;</span></span>
<span class="line"><span>    TCubeTiling tileTiling;</span></span>
<span class="line"><span>    TCubeTiling tailTiling;</span></span>
<span class="line"><span>    AllGatherMatmulTiling cfg;</span></span>
<span class="line"><span>};</span></span></code></pre></div></li><li><p>获取AllGatherMatmul算子的Tiling结构体对象指针。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>AllGatherMatmulCustomTilingData *tiling = context-&gt;GetTilingData&lt;AllGatherMatmulCustomTilingData&gt;();</span></span></code></pre></div><p>context为TilingContext的对象指针，该指针由框架自动从注册的Tiling入口函数AllGatherMatmulCustomTilingFunc传入，用于保存算子Tiling计算的上下文。在AllGatherMatmul算子的Tiling实现中，通过该上下文context获取计算Tiling所需要的输入输出shape、输入属性等参数，然后将Tiling结果（例如TilingKey、TilingData）保存至上下文中，供后续算子执行时使用。</p></li><li><p>设置算子自定义的Tiling结构体参数。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>tiling-&gt;cfg.tileNum = rankM / TILE_M; // TILE_M在样例中为常量448，表示通信数据块切分后的主块在M轴的长度</span></span>
<span class="line"><span>tiling-&gt;cfg.tailM = rankM % TILE_M;</span></span>
<span class="line"><span>tiling-&gt;cfg.tailNum = (rankM % TILE_M == 0) ? 0 : 1;</span></span>
<span class="line"><span>tiling-&gt;cfg.rankM = rankM;</span></span>
<span class="line"><span>tiling-&gt;cfg.rankN = rankN;</span></span>
<span class="line"><span>tiling-&gt;cfg.rankK = rankK;</span></span></code></pre></div></li><li><p>设置<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/Matmul-Kernel%E4%BE%A7%E6%8E%A5%E5%8F%A3.md" target="_blank" rel="noreferrer">Matmul高阶API</a> Tiling结构体。</p><p>通过matmul_tiling::MultiCoreMatmulTiling获取TCubeTiling结构体，首先创建多核Tiling对象mmTiling，然后设置A、B、C的参数类型信息，M、N、K形状信息等，最后调用<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/GetTiling.md" target="_blank" rel="noreferrer">GetTiling</a>接口，获取Tiling信息，具体方法可详见<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/Matmul-Tiling%E7%B1%BB.md" target="_blank" rel="noreferrer">Matmul Tiling类</a>。AllGatherMatmul算子中将上述逻辑封装为matmulTilingFunc函数，再分别根据主块、尾块和本卡数据的形状大小，调用matmulTilingFunc函数，得到对应的TCubeTiling参数。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 封装设置TCubeTiling结构体的函数为matmulTilingFunc</span></span>
<span class="line"><span>auto matmulTilingFunc = [&amp;](int64_t m, int64_t n, int64_t k, TCubeTiling &amp;cubeTiling) -&gt; bool {</span></span>
<span class="line"><span>    matmul_tiling::MultiCoreMatmulTiling mmTiling;</span></span>
<span class="line"><span>    mmTiling.SetAType(matmul_tiling::TPosition::GM, matmul_tiling::CubeFormat::ND, matmul_tiling::DataType::DT_FLOAT16);</span></span>
<span class="line"><span>    mmTiling.SetBType(matmul_tiling::TPosition::GM, matmul_tiling::CubeFormat::ND, matmul_tiling::DataType::DT_FLOAT16);</span></span>
<span class="line"><span>    mmTiling.SetCType(matmul_tiling::TPosition::GM, matmul_tiling::CubeFormat::ND, matmul_tiling::DataType::DT_FLOAT16);</span></span>
<span class="line"><span>    mmTiling.SetBias(false);</span></span>
<span class="line"><span>    mmTiling.SetDim(aicCoreNum);</span></span>
<span class="line"><span>    mmTiling.SetShape(m, n, k);</span></span>
<span class="line"><span>    mmTiling.SetOrgShape(m, n, k);</span></span>
<span class="line"><span>    mmTiling.SetBufferSpace(L1_BUFFER_SIZE);</span></span>
<span class="line"><span>    if (mmTiling.GetTiling(cubeTiling) != 0) {</span></span>
<span class="line"><span>        return false;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return true;</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span>// 设置本卡数据的Matmul TCubeTiling结构体</span></span>
<span class="line"><span>if (!matmulTilingFunc(rankM, rankN, rankK, tiling-&gt;localTiling)) {</span></span>
<span class="line"><span>    ERROR_LOG(&quot;Get local matmul tiling failed&quot;);</span></span>
<span class="line"><span>    return ge::GRAPH_FAILED;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 设置主块的Matmul TCubeTiling结构体</span></span>
<span class="line"><span>if (!matmulTilingFunc(TILE_M, rankN, rankK, tiling-&gt;tileTiling)) {</span></span>
<span class="line"><span>    ERROR_LOG(&quot;Get tile matmul tiling failed&quot;);</span></span>
<span class="line"><span>    return ge::GRAPH_FAILED;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 设置尾块的Matmul TCubeTiling结构体</span></span>
<span class="line"><span>if (!matmulTilingFunc(rankM % TILE_M, rankN, rankK, tiling-&gt;tailTiling)) {</span></span>
<span class="line"><span>    ERROR_LOG(&quot;Get tail matmul tiling failed&quot;);</span></span>
<span class="line"><span>    return ge::GRAPH_FAILED;</span></span>
<span class="line"><span>}</span></span></code></pre></div></li><li><p>设置Hccl高阶API Tiling结构体。</p><p>根据通信任务类型、算法配置等，创建一个Mc2CcTilingConfig类对象，通过向<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/GetTiling-101.md" target="_blank" rel="noreferrer">GetTiling</a>方法传入算子Tiling结构体中mc2InitTiling和mc2CcTiling成员的引用，完成需要传递给Kernel侧的Mc2InitTiling参数和Mc2CcTiling参数的获取。Hccl高阶API Tiling结构体的具体使用方法详见<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/HCCL-Tiling%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E.md" target="_blank" rel="noreferrer">Hccl Tiling使用说明</a>。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>uint32_t opType = HCCL_CMD_ALLGATHER; // 设置通信任务类型</span></span>
<span class="line"><span>std::string algConfig = &quot;AllGather=level0:doublering&quot;; // 设置通信算法，该参数为预留字段，配置后不生效</span></span>
<span class="line"><span>uint32_t reduceType = HCCL_REDUCE_SUM; // 设置Reduce操作类型，仅对有归约操作的通信任务有效，作为AllGather通信，可以直接配置默认值HCCL_REDUCE_SUM</span></span>
<span class="line"><span>AscendC::Mc2CcTilingConfig mc2CcTilingConfig(group, opType, algConfig, reduceType);</span></span>
<span class="line"><span>mc2CcTilingConfig.GetTiling(tiling-&gt;mc2InitTiling);</span></span>
<span class="line"><span>mc2CcTilingConfig.SetSkipLocalRankCopy(0); // 输出gatherOut需带有本卡的A矩阵，因此设置为0</span></span>
<span class="line"><span>mc2CcTilingConfig.GetTiling(tiling-&gt;mc2CcTiling);</span></span></code></pre></div></li></ol><h2 id="kernel实现" tabindex="-1">Kernel实现 <a class="header-anchor" href="#kernel实现" aria-label="Permalink to &quot;Kernel实现&quot;">​</a></h2><p>在AllGatherMatmul算子的Kernel实现中，需要对本卡数据、通信主块、通信尾块共三种形状的左矩阵进行Matmul运算，为避免重复代码，有必要抽象出一个通用的适用于不同输入形状的Matmul计算函数。设计该Matmul计算函数前，需要考虑Matmul计算需要的基本信息，罗列如下：</p><ul><li>输入A、B矩阵和输出C矩阵的地址。</li><li>TCubeTiling结构体：包含矩阵A、B、C的形状、数据类型等信息，以及A、B矩阵进行Matmul运算时在核间和核内的切分策略。</li></ul><p>除了上述Matmul运算所需的信息外，为了快速实现Matmul矩阵乘法，可以使用Matmul高阶API中的Matmul对象来执行计算。如果Matmul对象在Matmul计算函数中定义，每次调用该函数时都会实例化Matmul对象并释放资源，这将导致较大的运行时开销。因此，将该对象也作为Matmul计算函数的参数，以实现对象的复用。</p><p>综上所述，在Kernel实现中定义的适用于不同输入形状的Matmul计算函数如下。其中Matmul计算函数函数名定义为MatmulKernel，入参aGM、bGM、cGM表示需要运算的原始输入输出矩阵的地址，入参tiling表示TCubeTiling结构体，入参mm对应Matmul高阶API的实现类。MATMUL_TYPE是特化了MatmulType模板的类型别名。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>using MATMUL_TYPE = MatmulType&lt;AscendC::TPosition::GM, CubeFormat::ND, half&gt;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>__aicore__ inline void MatmulKernel(GM_ADDR aGM, GM_ADDR bGM, GM_ADDR cGM, TCubeTiling &amp;tiling,</span></span>
<span class="line"><span>                                    Matmul&lt;MATMUL_TYPE, MATMUL_TYPE, MATMUL_TYPE&gt; &amp;mm)</span></span></code></pre></div><p>MatmulKernel函数的实现步骤如下。</p><ol><li><p>TCubeTiling结构体存储了Matmul计算所需的核数，在无需计算的核上直接返回，结束计算。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>if (GetBlockIdx() &gt;= tiling.usedCoreNum) {</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span></code></pre></div></li><li><p>Matmul高阶API要求使用GlobalTensor作为输入输出矩阵，因此，根据函数输入的A、B、C矩阵在Global Memory的地址，分别定义aGlobal、bGlobal、cGlobal三个GlobalTensor。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>GlobalTensor&lt;half&gt; aGlobal, bGlobal, cGlobal;</span></span>
<span class="line"><span>aGlobal.SetGlobalBuffer(reinterpret_cast&lt;__gm__ half *&gt;(aGM), tiling.M * tiling.Ka);</span></span>
<span class="line"><span>bGlobal.SetGlobalBuffer(reinterpret_cast&lt;__gm__ half *&gt;(bGM), tiling.Ka * tiling.N);</span></span>
<span class="line"><span>cGlobal.SetGlobalBuffer(reinterpret_cast&lt;__gm__ half *&gt;(cGM), tiling.M * tiling.N);</span></span></code></pre></div></li><li><p>为了实现多核并行，提升计算效率，将矩阵数据进行切分，切分后的数据分配到不同的核上进行处理。这里采用了不切分K轴、仅切分M、N轴的切分策略，示意图如下。在这种场景下，每个核需要计算待处理的矩阵数据相对于原始矩阵的偏移量，并将偏移后的矩阵作为传入A、B、C矩阵时的入参。同时，为支持分核后的尾块数据的处理，每个核需要计算实际处理的singleCoreM、singleCoreN大小，并在下一步中通过调用Matmul高阶API进行设置。</p><p><strong>图 7</strong> Matmul计算分核示意图<br><img src="`+u+`" alt="" title="Matmul计算分核示意图"></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int mSingleBlocks = (tiling.M + tiling.singleCoreM - 1) / tiling.singleCoreM;</span></span>
<span class="line"><span>int mCoreIndex = GetBlockIdx() % mSingleBlocks;</span></span>
<span class="line"><span>int nCoreIndex = GetBlockIdx() / mSingleBlocks;</span></span>
<span class="line"><span>// 计算当前核需要处理的矩阵数据相对于原始矩阵的偏移</span></span>
<span class="line"><span>int offsetA = mCoreIndex * tiling.Ka * tiling.singleCoreM;</span></span>
<span class="line"><span>int offsetB = nCoreIndex * tiling.singleCoreN;</span></span>
<span class="line"><span>int offsetC = mCoreIndex * tiling.N * tiling.singleCoreM + nCoreIndex * tiling.singleCoreN;</span></span>
<span class="line"><span>// 计算当前核的singleCoreM/singleCoreN，作为后续SetTail接口的入参</span></span>
<span class="line"><span>int tailM = Std::min(tiling.M - mCoreIndex * tiling.singleCoreM, tiling.singleCoreM);</span></span>
<span class="line"><span>int tailN = Std::min(tiling.N - nCoreIndex * tiling.singleCoreN, tiling.singleCoreN);</span></span></code></pre></div></li><li><p>调用Matmul高阶API设置Matmul计算的原始完整的形状、当前核处理的输入输出矩阵的地址和计算的实际singleCoreM、singleCoreN的大小，并完成矩阵乘运算。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mm.SetOrgShape(tiling.M, tiling.N, tiling.Ka, tiling.Kb);</span></span>
<span class="line"><span>mm.SetTensorA(aGlobal[offsetA]);</span></span>
<span class="line"><span>mm.SetTensorB(bGlobal[offsetB]);</span></span>
<span class="line"><span>mm.SetTail(tailM, tailN);</span></span>
<span class="line"><span>mm.IterateAll(cGlobal[offsetC]);</span></span></code></pre></div></li></ol><p>AllGatherMatmul算子的核函数定义如下，aGM、bGM、cGM、gatherOutGM参数含义如<a href="#zh-cn_topic_0000002400208581_section59611034123213">算子分析</a>中所述，workspaceGM和tilingGM分别表示wrokspace空间和tiling数据在Global Memory的地址。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>extern &quot;C&quot; __global__ __aicore__ void all_gather_matmul_custom(GM_ADDR aGM, GM_ADDR bGM, GM_ADDR cGM, GM_ADDR gatherOutGM, GM_ADDR workspaceGM, GM_ADDR tilingGM)</span></span></code></pre></div><p>下面介绍AllGatherMatmul算子主流程实现的具体步骤。</p><ol><li><p>Matmul计算依赖AIC核，因此控制算子逻辑仅运行于AIC中。通过ASCEND_IS_AIV宏，判断如果当前核为AIV核，直接返回，结束当前核的运行。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>if ASCEND_IS_AIV {</span></span>
<span class="line"><span>    return;</span></span>
<span class="line"><span>}</span></span></code></pre></div></li><li><p>注册算子Tiling结构体、获取Tiling，并初始化TPipe。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>REGISTER_TILING_DEFAULT(AllGatherMatmulCustomTilingData);</span></span>
<span class="line"><span>GET_TILING_DATA(tilingData, tilingGM);</span></span>
<span class="line"><span>TPipe pipe;</span></span></code></pre></div></li><li><p>定义并赋值后续计算所需变量。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>auto &amp;&amp;localTiling = tilingData.localTiling;</span></span>
<span class="line"><span>auto &amp;&amp;tileTiling = tilingData.tileTiling;</span></span>
<span class="line"><span>auto &amp;&amp;tailTiling = tilingData.tailTiling;</span></span>
<span class="line"><span>const auto tileNum = tilingData.cfg.tileNum;                          // 主块数量</span></span>
<span class="line"><span>const auto tailNum = tilingData.cfg.tailNum;                          // 尾块数量</span></span>
<span class="line"><span>const auto aTileEleCnt = tileTiling.M * tileTiling.Ka;                // 通信矩阵主块元素数</span></span>
<span class="line"><span>const auto aTileSize = tileTiling.M * tileTiling.Ka * sizeof(half);   // 通信矩阵主块字节数</span></span>
<span class="line"><span>const auto cTileSize = tileTiling.M * tileTiling.N * sizeof(half);    // 通信矩阵主块对应在输出矩阵的字节数</span></span>
<span class="line"><span>const auto aTailEleCnt = tailTiling.M * tailTiling.Ka;                // 通信矩阵尾块元素数</span></span>
<span class="line"><span>const auto aRankEleCnt = localTiling.M * localTiling.Ka;              // 通信矩阵元素数</span></span>
<span class="line"><span>const auto aRankSize = localTiling.M * localTiling.Ka * sizeof(half); // 通信矩阵字节数</span></span>
<span class="line"><span>const auto cRankSize = localTiling.M * localTiling.N * sizeof(half);  // 通信矩阵对应在输出矩阵的字节数</span></span></code></pre></div></li><li><p>初始化hccl对象并下发AllGather通信任务。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Hccl hccl;</span></span>
<span class="line"><span>GM_ADDR contextGM = GetHcclContext&lt;HCCL_GROUP_ID_0&gt;();</span></span>
<span class="line"><span>hccl.InitV2(contextGM, &amp;tilingData);</span></span>
<span class="line"><span>hccl.SetCcTilingV2(offsetof(AllGatherMatmulCustomTilingData, mc2CcTiling));</span></span>
<span class="line"><span>auto handleId = hccl.AllGather&lt;true&gt;(aGM, gatherOutGM, aTileEleCnt, HcclDataType::HCCL_DATA_TYPE_FP16, aRankEleCnt, tileNum);</span></span>
<span class="line"><span>auto tailHandleId = hccl.AllGather&lt;true&gt;(aGM + tileNum * aTileSize, gatherOutGM + tileNum * aTileSize, aTailEleCnt,</span></span>
<span class="line"><span>                                         HcclDataType::HCCL_DATA_TYPE_FP16, aRankEleCnt, tailNum);</span></span></code></pre></div></li><li><p>初始化Matmul对象，对本卡数据进行Matmul计算。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>Matmul&lt;MATMUL_TYPE, MATMUL_TYPE, MATMUL_TYPE&gt; mm;</span></span>
<span class="line"><span>REGIST_MATMUL_OBJ(GetTPipePtr(), GetSysWorkSpacePtr(), mm);</span></span>
<span class="line"><span>mm.Init(&amp;localTiling);</span></span>
<span class="line"><span>MatmulKernel(aGM, bGM, cGM + hccl.GetRankId() * cRankSize, localTiling, mm);</span></span></code></pre></div></li><li><p>逐轮等待主块的通信完成，并对其进行Matmul计算。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>auto aAddr = gatherOutGM;</span></span>
<span class="line"><span>auto cAddr = cGM;</span></span>
<span class="line"><span>mm.Init(&amp;tileTiling);</span></span>
<span class="line"><span>for (uint32_t i = 0; i &lt; tileNum; i++) {</span></span>
<span class="line"><span>    hccl.Wait(handleId);</span></span>
<span class="line"><span>    for (uint32_t rankId = 0; rankId &lt; hccl.GetRankDim(); rankId++) {</span></span>
<span class="line"><span>        if (rankId == hccl.GetRankId())</span></span>
<span class="line"><span>            continue;</span></span>
<span class="line"><span>        MatmulKernel(aAddr + rankId * aRankSize, bGM, cAddr + rankId * cRankSize, tileTiling, mm);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    aAddr += aTileSize;</span></span>
<span class="line"><span>    cAddr += cTileSize;</span></span>
<span class="line"><span>}</span></span></code></pre></div></li><li><p>等待尾块的通信完成，并对其进行Matmul计算。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>aAddr = gatherOutGM + tileNum * aTileSize;</span></span>
<span class="line"><span>cAddr = cGM + tileNum * cTileSize;</span></span>
<span class="line"><span>if (tailNum &gt; 0) {</span></span>
<span class="line"><span>    mm.Init(&amp;tailTiling);</span></span>
<span class="line"><span>    hccl.Wait(tailHandleId);</span></span>
<span class="line"><span>    for (uint32_t rankId = 0; rankId &lt; hccl.GetRankDim(); rankId++) {</span></span>
<span class="line"><span>        if (rankId == hccl.GetRankId())</span></span>
<span class="line"><span>            continue;</span></span>
<span class="line"><span>        MatmulKernel(aAddr + rankId * aRankSize, bGM, cAddr + rankId * cRankSize, tailTiling, mm);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div></li><li><p>释放资源。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>mm.End();</span></span>
<span class="line"><span>hccl.Finalize();</span></span></code></pre></div></li></ol><p>整合前述代码 ，完整Kernel代码如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#define ASCENDC_CUBE_ONLY</span></span>
<span class="line"><span>#include &quot;kernel_operator.h&quot;</span></span>
<span class="line"><span>#include &quot;lib/matmul_intf.h&quot;</span></span>
<span class="line"><span>#include &quot;all_gather_matmul_custom_tiling.h&quot;</span></span>
<span class="line"><span>using namespace AscendC;</span></span>
<span class="line"><span>using MATMUL_TYPE = MatmulType&lt;AscendC::TPosition::GM, CubeFormat::ND, half&gt;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>__aicore__ inline void MatmulKernel(GM_ADDR aGM, GM_ADDR bGM, GM_ADDR cGM, TCubeTiling &amp;tiling,</span></span>
<span class="line"><span>                                    Matmul&lt;MATMUL_TYPE, MATMUL_TYPE, MATMUL_TYPE&gt; &amp;mm)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    if (GetBlockIdx() &gt;= tiling.usedCoreNum) {</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    GlobalTensor&lt;half&gt; aGlobal, bGlobal, cGlobal;</span></span>
<span class="line"><span>    aGlobal.SetGlobalBuffer(reinterpret_cast&lt;__gm__ half *&gt;(aGM), tiling.M * tiling.Ka);</span></span>
<span class="line"><span>    bGlobal.SetGlobalBuffer(reinterpret_cast&lt;__gm__ half *&gt;(bGM), tiling.Ka * tiling.N);</span></span>
<span class="line"><span>    cGlobal.SetGlobalBuffer(reinterpret_cast&lt;__gm__ half *&gt;(cGM), tiling.M * tiling.N);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    int mSingleBlocks = (tiling.M + tiling.singleCoreM - 1) / tiling.singleCoreM;</span></span>
<span class="line"><span>    int mCoreIndx = GetBlockIdx() % mSingleBlocks;</span></span>
<span class="line"><span>    int nCoreIndx = GetBlockIdx() / mSingleBlocks;</span></span>
<span class="line"><span>    int offsetA = mCoreIndx * tiling.Ka * tiling.singleCoreM;</span></span>
<span class="line"><span>    int offsetB = nCoreIndx * tiling.singleCoreN;</span></span>
<span class="line"><span>    int offsetC = mCoreIndx * tiling.N * tiling.singleCoreM + nCoreIndx * tiling.singleCoreN;</span></span>
<span class="line"><span>    int tailM = Std::min(tiling.M - mCoreIndx * tiling.singleCoreM, tiling.singleCoreM);</span></span>
<span class="line"><span>    int tailN = Std::min(tiling.N - nCoreIndx * tiling.singleCoreN, tiling.singleCoreN);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    mm.SetOrgShape(tiling.M, tiling.N, tiling.Ka, tiling.Kb);</span></span>
<span class="line"><span>    mm.SetTensorA(aGlobal[offsetA]);</span></span>
<span class="line"><span>    mm.SetTensorB(bGlobal[offsetB]);</span></span>
<span class="line"><span>    mm.SetTail(tailM, tailN);</span></span>
<span class="line"><span>    mm.IterateAll(cGlobal[offsetC]);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>extern &quot;C&quot; __global__ __aicore__ void all_gather_matmul_custom(GM_ADDR aGM, GM_ADDR bGM, GM_ADDR cGM,</span></span>
<span class="line"><span>                                                               GM_ADDR gatherOutGM, GM_ADDR workspaceGM,</span></span>
<span class="line"><span>                                                               GM_ADDR tilingGM)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    if ASCEND_IS_AIV {</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    REGISTER_TILING_DEFAULT(AllGatherMatmulCustomTilingData);</span></span>
<span class="line"><span>    GET_TILING_DATA(tilingData, tilingGM);</span></span>
<span class="line"><span>    TPipe pipe;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    auto &amp;&amp;localTiling = tilingData.localTiling;</span></span>
<span class="line"><span>    auto &amp;&amp;tileTiling = tilingData.tileTiling;</span></span>
<span class="line"><span>    auto &amp;&amp;tailTiling = tilingData.tailTiling;</span></span>
<span class="line"><span>    const auto tileNum = tilingData.cfg.tileNum;                          // 主块数量</span></span>
<span class="line"><span>    const auto tailNum = tilingData.cfg.tailNum;                          // 尾块数量</span></span>
<span class="line"><span>    const auto aTileEleCnt = tileTiling.M * tileTiling.Ka;                // 通信矩阵主块元素数</span></span>
<span class="line"><span>    const auto aTileSize = tileTiling.M * tileTiling.Ka * sizeof(half);   // 通信矩阵主块字节数</span></span>
<span class="line"><span>    const auto cTileSize = tileTiling.M * tileTiling.N * sizeof(half);    // 输出矩阵主块字节数</span></span>
<span class="line"><span>    const auto aTailEleCnt = tailTiling.M * tailTiling.Ka;                // 通信矩阵尾块元素数</span></span>
<span class="line"><span>    const auto aRankEleCnt = localTiling.M * localTiling.Ka;              // 单卡通信矩阵元素数</span></span>
<span class="line"><span>    const auto aRankSize = localTiling.M * localTiling.Ka * sizeof(half); // 单卡通信矩阵字节数</span></span>
<span class="line"><span>    const auto cRankSize = localTiling.M * localTiling.N * sizeof(half);  // 单卡输出矩阵字节数</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Hccl hccl;</span></span>
<span class="line"><span>    GM_ADDR contextGM = GetHcclContext&lt;HCCL_GROUP_ID_0&gt;();</span></span>
<span class="line"><span>    hccl.InitV2(contextGM, &amp;tilingData);</span></span>
<span class="line"><span>    hccl.SetCcTilingV2(offsetof(AllGatherMatmulCustomTilingData, mc2CcTiling));</span></span>
<span class="line"><span>    auto handleId = hccl.AllGather&lt;true&gt;(aGM, gatherOutGM, aTileEleCnt, HcclDataType::HCCL_DATA_TYPE_FP16, aRankEleCnt, tileNum);</span></span>
<span class="line"><span>    auto tailHandleId = hccl.AllGather&lt;true&gt;(aGM + tileNum * aTileSize, gatherOutGM + tileNum * aTileSize, aTailEleCnt,</span></span>
<span class="line"><span>                                             HcclDataType::HCCL_DATA_TYPE_FP16, aRankEleCnt, tailNum);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Matmul&lt;MATMUL_TYPE, MATMUL_TYPE, MATMUL_TYPE&gt; mm;</span></span>
<span class="line"><span>    REGIST_MATMUL_OBJ(GetTPipePtr(), GetSysWorkSpacePtr(), mm);</span></span>
<span class="line"><span>    mm.Init(&amp;localTiling);</span></span>
<span class="line"><span>    MatmulKernel(aGM, bGM, cGM + hccl.GetRankId() * cRankSize, localTiling, mm);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    auto aAddr = gatherOutGM;</span></span>
<span class="line"><span>    auto cAddr = cGM;</span></span>
<span class="line"><span>    mm.Init(&amp;tileTiling);</span></span>
<span class="line"><span>    for (uint32_t i = 0; i &lt; tileNum; i++) {</span></span>
<span class="line"><span>        hccl.Wait(handleId);</span></span>
<span class="line"><span>        for (uint32_t rankId = 0; rankId &lt; hccl.GetRankDim(); rankId++) {</span></span>
<span class="line"><span>            if (rankId == hccl.GetRankId())</span></span>
<span class="line"><span>                continue;</span></span>
<span class="line"><span>            MatmulKernel(aAddr + rankId * aRankSize, bGM, cAddr + rankId * cRankSize, tileTiling, mm);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        aAddr += aTileSize;</span></span>
<span class="line"><span>        cAddr += cTileSize;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    aAddr = gatherOutGM + tileNum * aTileSize;</span></span>
<span class="line"><span>    cAddr = cGM + tileNum * cTileSize;</span></span>
<span class="line"><span>    if (tailNum &gt; 0) {</span></span>
<span class="line"><span>        mm.Init(&amp;tailTiling);</span></span>
<span class="line"><span>        hccl.Wait(tailHandleId);</span></span>
<span class="line"><span>        for (uint32_t rankId = 0; rankId &lt; hccl.GetRankDim(); rankId++) {</span></span>
<span class="line"><span>            if (rankId == hccl.GetRankId())</span></span>
<span class="line"><span>                continue;</span></span>
<span class="line"><span>            MatmulKernel(aAddr + rankId * aRankSize, bGM, cAddr + rankId * cRankSize, tailTiling, mm);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    mm.End();</span></span>
<span class="line"><span>    hccl.Finalize();</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="编译和运行" tabindex="-1">编译和运行 <a class="header-anchor" href="#编译和运行" aria-label="Permalink to &quot;编译和运行&quot;">​</a></h2><p>下面从编译、安装、运行三个步骤对AllGatherMatmul样例作简要介绍。</p><ol><li><p><strong>编译</strong></p><p>参考<a href="https://gitcode.com/cann/ops-transformer/tree/master/mc2/all_gather_matmul_v2" target="_blank" rel="noreferrer">AllGatherMatmul样例</a>中生成自定义算子工程、编译算子的命令，运行install.sh脚本完成编译。</p><p>样例目录结构如下，AllGatherMatmulCustom目录为必要的算子实现，install.sh脚本使用msOpGen在21_all_gather_matmul_custom目录下创建一个CustomOp目录，并将算子实现文件复制到对应目录下，再调用msOpGen生成的编译入口脚本build.sh编译算子。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>├── 21_all_gather_matmul_custom</span></span>
<span class="line"><span>│   ├── AclNNInvocation                  // 通过aclnn调用的方式调用AllGatherMatmulCustom算子 </span></span>
<span class="line"><span>│   ├── AllGatherMatmulCustom            // AllGatherMatmulCustom算子工程 </span></span>
<span class="line"><span>│   ├── all_gather_matmul_custom.json    // AllGatherMatmulCustom算子的原型定义json文件 </span></span>
<span class="line"><span>│   ├── all_gather_matmul_demo_def.h     // AllGatherMatmulCustom算子参数配置 </span></span>
<span class="line"><span>│   └── install.sh                       // 脚本，调用msOpGen生成自定义算子工程，并编译</span></span></code></pre></div><p>msOpGen生成的CustomOp目录结构如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>├── CustomOp                 // msOpGen生成的AllGatherMatmul自定义算子工程 </span></span>
<span class="line"><span>│   ├── cmake </span></span>
<span class="line"><span>│   ├── op_host             // host侧实现文件 </span></span>
<span class="line"><span>│   ├── op_kernel           // kernel侧实现文件 </span></span>
<span class="line"><span>│   ├── scripts             // 自定义算子工程打包相关脚本所在目录 </span></span>
<span class="line"><span>│   ├── build.sh            // 编译入口脚本 </span></span>
<span class="line"><span>│   ├── CMakeLists.txt      // 算子工程的CMakeLists.txt </span></span>
<span class="line"><span>│   └── CMakePresets.json   // 编译配置项</span></span></code></pre></div></li><li><p><strong>安装</strong></p><p>部署自定义算子包前，请确保环境中存在自定义算子包默认部署路径的环境变量ASCEND_OPP_PATH。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 查看环境变量输出</span></span>
<span class="line"><span>echo $ASCEND_OPP_PATH</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 若无输出，则需设置环境变量，ASCEND_INSTALL_PATH为CANN软件包安装路径</span></span>
<span class="line"><span>source [ASCEND_INSTALL_PATH]/set_env.bash </span></span>
<span class="line"><span># 例如 source /usr/local/Ascend/cann/set_env.sh</span></span></code></pre></div><p>然后执行如下命令，切换目录为编译出的自定义算子安装包所在目录，并安装自定义算子包。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>cd CustomOp/build_out</span></span>
<span class="line"><span>./custom_opp_&lt;target os&gt;_&lt;target architecture&gt;.run</span></span></code></pre></div><p>命令执行成功后，自定义算子包中的相关文件将部署至环境变量ASCEND_OPP_PATH指向的的vendors/customize目录中。</p></li><li><p><strong>运行</strong></p><p>切换目录为AclNNInvocation目录，执行run.sh脚本运行单算子样例。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>cd ../../AclNNInvocation</span></span>
<span class="line"><span>bash run.sh</span></span></code></pre></div><p>样例中的AclNNInvocation目录提供了完整的单算子API调用的示例代码。完成前两个步骤自定义算子的编译部署后，会自动生成单算子API，该API可以直接在应用程序中调用。算子API的形式一般为“两段式接口”，形如：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 获取算子使用的workspace空间大小</span></span>
<span class="line"><span>aclnnStatus aclnnAllGatherMatmulCustomGetWorkspaceSize(</span></span>
<span class="line"><span>     const aclTensor *a,</span></span>
<span class="line"><span>     const aclTensor *b,</span></span>
<span class="line"><span>     char *group,</span></span>
<span class="line"><span>     const aclTensor *cOut,</span></span>
<span class="line"><span>     const aclTensor *gatherOutOut,</span></span>
<span class="line"><span>     uint64_t *workspaceSize,</span></span>
<span class="line"><span>     aclOpExecutor **executor);</span></span>
<span class="line"><span>// 执行算子</span></span>
<span class="line"><span>aclnnStatus aclnnAllGatherMatmulCustom(</span></span>
<span class="line"><span>     void *workspace,</span></span>
<span class="line"><span>     uint64_t workspaceSize,</span></span>
<span class="line"><span>     aclOpExecutor *executor,</span></span>
<span class="line"><span>     const aclrtStream stream);</span></span></code></pre></div><p>其中aclnnAllGatherMatmulCustomGetWorkspaceSize为第一段接口，主要用于计算本次API调用计算过程中需要的workspace内存大小。按照该workspaceSize大小申请Device侧内存，然后调用第二段接口aclnnAllGatherMatmulCustom执行计算。详细内容请参考<a href="./../../../../编程指南/附录/工程化算子开发/单算子API调用.html">单算子API调用</a>章节。</p><p>在通算融合场景，单算子API调用的程序中需要调用<a href="https://www.hiascend.com/document/redirect/CannCommunityHcclApi" target="_blank" rel="noreferrer">《HCCL集合通信库接口》</a>中的接口创建通信域，并在多线程上执行AllGatherMatmul算子。以下给出main函数和线程调用函数中关键步骤的代码示例，仅供参考。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int main(int argc, char **argv)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    // 1.AscendCL初始化</span></span>
<span class="line"><span>    if (aclInit(NULL) != ACL_SUCCESS) {</span></span>
<span class="line"><span>        ERROR_LOG(&quot;aclInit failed&quot;);</span></span>
<span class="line"><span>        return FAILED;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    // 2.通信域创建</span></span>
<span class="line"><span>    HcclComm comms[RANK_DIM]; // RANK_DIM为卡数，示例中为8</span></span>
<span class="line"><span>    int32_t devices[RANK_DIM];</span></span>
<span class="line"><span>    for (int32_t i = 0; i &lt; RANK_DIM; i++) {</span></span>
<span class="line"><span>        devices[i] = i;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (HcclCommInitAll(RANK_DIM, devices, comms) != HCCL_SUCCESS) {</span></span>
<span class="line"><span>        ERROR_LOG(&quot;Hccl comm init failed.&quot;);</span></span>
<span class="line"><span>        (void)aclFinalize();</span></span>
<span class="line"><span>        return FAILED;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    // 3.创建多线程以在通信域的所有卡上都调用AllGatherMatmul算子</span></span>
<span class="line"><span>    std::vector&lt;std::unique_ptr&lt;std::thread&gt;&gt; threads(RANK_DIM);</span></span>
<span class="line"><span>    for (uint32_t rankId = 0; rankId &lt; RANK_DIM; rankId++) {</span></span>
<span class="line"><span>        threads[rankId].reset(new(std::nothrow) std::thread(&amp;RunOp, rankId, std::ref(comms[rankId])));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    for (uint32_t rankId = 0; rankId &lt; RANK_DIM; rankId++) {</span></span>
<span class="line"><span>        threads[rankId]-&gt;join();</span></span>
<span class="line"><span>    } </span></span>
<span class="line"><span>    // 4.AscendCL去初始化</span></span>
<span class="line"><span>    (void)aclFinalize();</span></span>
<span class="line"><span>    return SUCCESS;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>在main函数中，通过HcclCommInitAll接口在当前进程统一创建了RANK_DIM张卡的通信域，一张卡对应后续创建的一个线程。每个线程都调用RunOp函数，该函数负责卡上运行时资源申请和单算子API的二阶段接口调用。RunOp函数的代码示例如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>bool RunOp(uint32_t rankId, HcclComm &amp;comm)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    // 1.申请当前线程的context、stream等资源</span></span>
<span class="line"><span>    aclrtContext context;</span></span>
<span class="line"><span>    aclrtCreateContext(&amp;context, rankId);</span></span>
<span class="line"><span>    aclrtStream stream;</span></span>
<span class="line"><span>    aclrtCreateStream(&amp;stream);</span></span>
<span class="line"><span>    aclrtSetCurrentContext(context);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 2.获取当前线程对应卡的通信域名称</span></span>
<span class="line"><span>    char group[128] = {0};</span></span>
<span class="line"><span>    HcclGetCommName(comm, group);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 3.申请device侧内存存放算子的输入输出</span></span>
<span class="line"><span>    // ......</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 4.计算workspace大小并申请内存</span></span>
<span class="line"><span>    size_t workspaceSize = 0;</span></span>
<span class="line"><span>    aclOpExecutor *handle = nullptr;</span></span>
<span class="line"><span>    auto ret = aclnnAllGatherMatmulCustomGetWorkspaceSize(a, b, group, c, gatherOut, &amp;workspaceSize, &amp;handle);</span></span>
<span class="line"><span>    void *workspace = nullptr;</span></span>
<span class="line"><span>    if (workspaceSize != 0) {</span></span>
<span class="line"><span>        aclrtMalloc(&amp;workspace, workspaceSize);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 5.执行算子</span></span>
<span class="line"><span>    ret = aclnnAllGatherMatmulCustom(workspace, workspaceSize, handle, stream);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 6.同步等待</span></span>
<span class="line"><span>    ret = aclrtSynchronizeStreamWithTimeout(stream, 10000);  // 10000ms 流同步超时</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 7.释放算子输入、输出和workspace等device侧内存</span></span>
<span class="line"><span>    // ......</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 8.释放通信域、context、stream等资源</span></span>
<span class="line"><span>    (void)HcclCommDestroy(comm);</span></span>
<span class="line"><span>    (void)aclrtDestroyStream(stream);</span></span>
<span class="line"><span>    (void)aclrtDestroyContext(context);</span></span>
<span class="line"><span>    (void)aclrtResetDevice(rankId);</span></span>
<span class="line"><span>    return true;</span></span>
<span class="line"><span>}</span></span></code></pre></div></li></ol>`,47)])])}const _=n(g,[["render",m]]);export{C as __pageData,_ as default};
