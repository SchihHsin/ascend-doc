import{c as s,Q as n,j as e,m as l}from"./chunks/framework.DOi4mjdC.js";const p="/assets/%E4%BC%98%E5%8C%96%E5%89%8DProfiling%E6%95%B0%E6%8D%AE.DIFm2AFD.png",i="/assets/%E4%BC%98%E5%8C%96%E5%88%86%E6%A0%B8%E9%80%BB%E8%BE%91%E5%90%8EProfiling%E6%95%B0%E6%8D%AE.BaB5nK1i.png",t="/assets/%E4%BC%98%E5%8C%96%E5%9F%BA%E6%9C%AC%E5%9D%97%E5%90%8EProfiling%E6%95%B0%E6%8D%AE.DSNGDIvq.png",c="/assets/%E4%BD%BF%E8%83%BD%E5%A4%A7%E5%8C%85%E6%90%AC%E8%BF%90%E5%90%8EProfiling%E6%95%B0%E6%8D%AE.azr9EK1x.png",_=JSON.parse('{"title":"Matmul算子优化Tiling策略","description":"","frontmatter":{},"headers":[{"level":1,"title":"Matmul算子优化Tiling策略","slug":"matmul算子优化tiling策略"},{"level":2,"title":"案例介绍","slug":"案例介绍"},{"level":2,"title":"获取性能数据","slug":"获取性能数据"},{"level":2,"title":"分析主要瓶颈点","slug":"分析主要瓶颈点"},{"level":2,"title":"设计优化方案","slug":"设计优化方案"},{"level":2,"title":"验证优化方案性能收益","slug":"验证优化方案性能收益"},{"level":2,"title":"总结","slug":"总结"}],"relativePath":"guide/算子实践参考/优秀实践/Matmul性能调优案例/Matmul算子优化Tiling策略.md","filePath":"guide/算子实践参考/优秀实践/Matmul性能调优案例/Matmul算子优化Tiling策略.md"}'),o={name:"guide/算子实践参考/优秀实践/Matmul性能调优案例/Matmul算子优化Tiling策略.md"};function r(u,a,C,m,g,b){return n(),e("div",null,[...a[0]||(a[0]=[l('<h1 id="matmul算子优化tiling策略" tabindex="-1">Matmul算子优化Tiling策略 <a class="header-anchor" href="#matmul算子优化tiling策略" aria-label="Permalink to &quot;Matmul算子优化Tiling策略&quot;">​</a></h1><h2 id="案例介绍" tabindex="-1">案例介绍 <a class="header-anchor" href="#案例介绍" aria-label="Permalink to &quot;案例介绍&quot;">​</a></h2><p>本案例对Matmul算子进行性能分析和优化。Matmul算子实现的功能是矩阵乘法，其中主要包含数据搬入和搬出流水，Cube计算流水。</p><p>以矩阵维度M = 4096，N = 5120，K = 4096，输入数据类型half，输出数据类型float，输出格式是ND为例，性能验证平台为Atlas A2 训练系列产品/Atlas A2 推理系列产品，介绍针对Matmul算子的优化手段，包括优化分核逻辑、优化基本块、使能大包搬运。</p><ul><li>分核逻辑：开启尽量多的Cube核使能并行计算。</li><li>优化基本块，选择最优的baseM、baseN、baseK参数，其中baseM、baseN、baseK为Matmul Tiling中的参数。</li><li>使能大包搬运：从GM搬运数据到L1时，对于A矩阵，一次搬入depthA1个基本块，基本块大小为baseM * baseK，对于B矩阵，一次搬入depthB1个基本块，基本块大小为baseN * baseK。使能大包搬运后，一次搬入的数据量变大，从而提升MTE2搬运效率。</li></ul><h2 id="获取性能数据" tabindex="-1">获取性能数据 <a class="header-anchor" href="#获取性能数据" aria-label="Permalink to &quot;获取性能数据&quot;">​</a></h2><p>使用msProf工具获取算子的Profiling数据，重点分析MTE2，Cube，Scalar pipeline的流水情况。</p><h2 id="分析主要瓶颈点" tabindex="-1">分析主要瓶颈点 <a class="header-anchor" href="#分析主要瓶颈点" aria-label="Permalink to &quot;分析主要瓶颈点&quot;">​</a></h2><p><strong>图 1</strong> 优化前Profiling数据<br><img src="'+p+`" alt="" title="优化前Profiling数据"></p><p>由以上Profiling数据，可以看出MTE2耗时占比较大，当前性能瓶颈点在于MTE2流水。</p><ul><li><p>Profiling数据的Block Dim可见分核未分满，考虑分核逻辑的优化。设CurrentCore是未优化前分核的Cube核数，MaxCore为最大Cube核数，当开启全部核并行做当前shape数据量的计算时，预估性能收益为MaxCore / CurrentCore的倍数。</p></li><li><p>优化基本块切分，将影响搬运数据的效率，算子搬运的总数据量为搬运的左矩阵和右矩阵数据量之和。在Matmul计算K方向不能全载的场景下，根据矩阵乘法的算法，搬运左矩阵的次数为N / baseN，搬运右矩阵的次数为M / baseM，即搬运总数据量totalCnt = (N / baseN) * M * K + (M / baseM) * K * N。预估性能收益为搬运数据量的比值，优化前搬运数据量totalCnt0/优化后搬运数据量totalCnt1，化简后结果为(1 / baseM0 + 1 / baseN0) / (1 / baseM1 + 1 / baseN1)，其中，baseM0, baseN0为优化前基本块参数，baseM1, baseN1为优化后基本块参数。</p></li><li><p>使能大包搬运后，指令条数变化、地址对齐等因素会影响性能，按照经验预估，对于MTE2为性能瓶颈的场景，会有20%以上的MTE2性能收益。</p></li></ul><h2 id="设计优化方案" tabindex="-1">设计优化方案 <a class="header-anchor" href="#设计优化方案" aria-label="Permalink to &quot;设计优化方案&quot;">​</a></h2><ul><li><p>优化点一：优化分核逻辑</p><p>由Profiling数据看出分核数为4，启动更多的核同时计算，可以提高计算并行度。当前案例使用的AI处理器共20个核，每个核中包含1个Cube Core和2个Vector Core。NPU调用程序中设置numBlocks为实际使用的核数20。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 代码片段</span></span>
<span class="line"><span>uint32_t numBlocks = 20; // 优化前numBlocks为4</span></span>
<span class="line"><span>CHECK_ACL(aclInit(nullptr));</span></span>
<span class="line"><span>int32_t deviceId = 0;</span></span>
<span class="line"><span>CHECK_ACL(aclrtSetDevice(deviceId));</span></span>
<span class="line"><span>aclrtStream stream = nullptr;</span></span>
<span class="line"><span>CHECK_ACL(aclrtCreateStream(&amp;stream));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>uint8_t *aHost;</span></span>
<span class="line"><span>uint8_t *aDevice;</span></span>
<span class="line"><span>CHECK_ACL(aclrtMallocHost((void **)(&amp;aHost), aFileSize));</span></span>
<span class="line"><span>CHECK_ACL(</span></span>
<span class="line"><span>  aclrtMalloc((void **)&amp;aDevice, aFileSize, ACL_MEM_MALLOC_HUGE_FIRST));</span></span>
<span class="line"><span>ReadFile(&quot;./input/x1_gm.bin&quot;, aFileSize, aHost, aFileSize);</span></span>
<span class="line"><span>// PrintData(aHost, 16, printDataType::HALF);</span></span>
<span class="line"><span>CHECK_ACL(aclrtMemcpy(aDevice, aFileSize, aHost, aFileSize,</span></span>
<span class="line"><span>					ACL_MEMCPY_HOST_TO_DEVICE));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>uint8_t *bHost;</span></span>
<span class="line"><span>uint8_t *bDevice;</span></span>
<span class="line"><span>CHECK_ACL(aclrtMallocHost((void **)(&amp;bHost), bFileSize));</span></span>
<span class="line"><span>CHECK_ACL(</span></span>
<span class="line"><span>  aclrtMalloc((void **)&amp;bDevice, bFileSize, ACL_MEM_MALLOC_HUGE_FIRST));</span></span>
<span class="line"><span>ReadFile(&quot;./input/x2_gm.bin&quot;, bFileSize, bHost, bFileSize);</span></span>
<span class="line"><span>// PrintData(bHost, 16, printDataType::HALF);</span></span>
<span class="line"><span>CHECK_ACL(aclrtMemcpy(bDevice, bFileSize, bHost, bFileSize,</span></span>
<span class="line"><span>					ACL_MEMCPY_HOST_TO_DEVICE));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>uint8_t *workspaceHost;</span></span>
<span class="line"><span>uint8_t *workspaceDevice;</span></span>
<span class="line"><span>CHECK_ACL(aclrtMallocHost((void **)(&amp;workspaceHost), workspaceSize));</span></span>
<span class="line"><span>CHECK_ACL(aclrtMalloc((void **)&amp;workspaceDevice, workspaceSize,</span></span>
<span class="line"><span>					ACL_MEM_MALLOC_HUGE_FIRST));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>uint8_t *tilingHost;</span></span>
<span class="line"><span>uint8_t *tilingDevice;</span></span>
<span class="line"><span>CHECK_ACL(aclrtMallocHost((void **)(&amp;tilingHost), tilingFileSize));</span></span>
<span class="line"><span>CHECK_ACL(aclrtMalloc((void **)&amp;tilingDevice, tilingFileSize,</span></span>
<span class="line"><span>					ACL_MEM_MALLOC_HUGE_FIRST));</span></span>
<span class="line"><span>CHECK_ACL(aclrtMemcpy(tilingHost, tilingFileSize, GenerateTiling(),</span></span>
<span class="line"><span>					tilingFileSize, ACL_MEMCPY_HOST_TO_HOST));</span></span>
<span class="line"><span>// PrintData(tilingHost, 16, printDataType::UINT32_T);</span></span>
<span class="line"><span>CHECK_ACL(aclrtMemcpy(tilingDevice, tilingFileSize, tilingHost,</span></span>
<span class="line"><span>					tilingFileSize, ACL_MEMCPY_HOST_TO_DEVICE));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>uint8_t *cHost;</span></span>
<span class="line"><span>uint8_t *cDevice;</span></span>
<span class="line"><span>CHECK_ACL(aclrtMallocHost((void **)(&amp;cHost), cFileSize));</span></span>
<span class="line"><span>CHECK_ACL(</span></span>
<span class="line"><span>  aclrtMalloc((void **)&amp;cDevice, cFileSize, ACL_MEM_MALLOC_HUGE_FIRST));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// ACLRT_LAUNCH_KERNEL(matmul_custom)</span></span>
<span class="line"><span>// (numBlocks, stream, aDevice, bDevice, cDevice, workspaceDevice, tilingDevice);</span></span>
<span class="line"><span>matmul_custom_do(numBlocks, stream, aDevice, bDevice, cDevice, workspaceDevice, tilingDevice);</span></span></code></pre></div><p>由于Matmul API都是从Vector侧发起的，当前案例使用的AI处理器中Cube Core和Vector Core的配比为1 : 2，所以在Matmul tiling计算中需要按照2倍的numBlocks数切分，即Vector Core数。NPU调用程序中设置的实际运行核数是20核，所以Tiling代码中设置Tiling API按照40个核进行数据切分，如下代码所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int usedCoreNum = 40; // 优化前usedCoreNum是8</span></span>
<span class="line"><span>int runMode = 1;</span></span>
<span class="line"><span>int32_t baseM = 64; // 64</span></span>
<span class="line"><span>int32_t baseN = 64; // 64</span></span>
<span class="line"><span>optiling::TCubeTiling tilingData;</span></span>
<span class="line"><span>MultiCoreMatmulTiling tilingApi;</span></span>
<span class="line"><span>tilingApi.SetDim(usedCoreNum);</span></span></code></pre></div><p><strong>图 2</strong> 优化分核逻辑后Profiling数据<br><img src="`+i+`" alt="" title="优化分核逻辑后Profiling数据"></p><p>修改代码后，算子执行时间从12045us下降到2532us，约等于(20核 / 4核) = 5倍的性能提升。</p></li><li><p>优化点二：优化基本块</p><p>当前Tiling中设置的base块为 [baseM, baseN, baseK] = [64, 64, 256]，这种基本块Cube计算cycle少，计算访存比（即计算量与需要数据量的比值）低；搬出一次Matmul结果到GM的base块是64 * 64，由于输出格式是ND，数据类型是float，搬出下一次Matmul结果的起始地址需要偏移一个baseN的大小，即64 * 4 = 256字节，导致fixpipe搬出时GM地址非512byte对齐，那么需要设置更优的基本块。</p><p>针对当前shape较大的场景，基本块的选择原则为计算访存比最大，即在Cube计算量最大的情况下，访存的数据量最小。在输入为fp16类型的情况下，Cube执行单元1 cycle能算16 * 16 * 16个数。根据经验，[baseM, baseN, baseK] = [128, 256, 64]和[128, 128, 128]两种切分方案均满足搬出时<a href="./../../SIMD算子性能优化/内存访问/GM地址尽量512B对齐.html">GM地址512Byte对齐</a>（每搬出一次Matmul结果时，地址分别偏移256 * 4byte和128 * 4byte），Cube计算cycle数一致，为(128 * 64 * 256) / (16 * 16 * 16) = (128 * 128 * 128) / (16 * 16 * 16) = 512cycle。针对[baseM, baseN, baseK] = [128, 256, 64]，计算访存比为512cycle / (128 * 64 * 2 + 256 * 64 * 2) = 512cycle / 48KB；针对[baseM, baseN, baseK] = [128, 128, 128]，计算访存比为512cycle / (128 * 128 * 2 + 128 * 128 * 2) = 512cycle / 64KB；可见[128, 256, 64]基本块方案的计算访存比更高，计算密度更大，同样的计算量，需要的数据量最小，最大限度提高Cube单元的计算量。</p><p>修改Tiling代码，通过SetFixSplit()接口设置baseM和baseN，tiling函数会自动计算出最优baseK，这里得到64。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int32_t baseM = 128; // 优化前baseM是64</span></span>
<span class="line"><span>int32_t baseN = 256; // 优化前baseN是64</span></span>
<span class="line"><span></span></span>
<span class="line"><span>optiling::TCubeTiling tilingData;</span></span>
<span class="line"><span>MultiCoreMatmulTiling tilingApi;</span></span>
<span class="line"><span>tilingApi.SetDim(usedCoreNum);</span></span>
<span class="line"><span>tilingApi.SetAType(leftPos, leftFormat, leftDtype, bool(transposeA));</span></span>
<span class="line"><span>tilingApi.SetBType(rightPos, rightFormat, rightDtype, bool(transposeB));</span></span>
<span class="line"><span>tilingApi.SetCType(resPos, resFormat, resDtype);</span></span>
<span class="line"><span>tilingApi.SetBiasType(biasPos, biasFormat, biasDtype);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>tilingApi.SetOrgShape(M, N, K);</span></span>
<span class="line"><span>tilingApi.SetShape(M, N, K);</span></span>
<span class="line"><span>tilingApi.SetFixSplit(baseM, baseN, -1);</span></span></code></pre></div><p>使能这组基本块后，MTE2耗时（对应aic_mte2_time）从2452us降低到808us，MTE2性能提升3倍。</p><p><strong>图 3</strong> 优化基本块后Profiling数据<br><img src="`+t+`" alt="" title="优化基本块后Profiling数据"></p></li><li><p>优化点三：使能大包搬运</p><p>当前带宽利用率为：totalSize / mte2Time = totalCnt * dtype / mte2Time，代入数据计算为2491GB/s。未使能大包搬运的情况下，矩阵从GM搬运到L1一次只搬运1个基本块。通过模板参数使能大包搬运，一次搬运多个基本块，提高MTE2带宽利用率。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span> // 原始matmul对象定义:</span></span>
<span class="line"><span>  Matmul&lt;AscendC::MatmulType&lt;TPosition::GM, CubeFormat::ND, A_T&gt;,</span></span>
<span class="line"><span>         AscendC::MatmulType&lt;TPosition::GM, CubeFormat::ND, B_T&gt;,</span></span>
<span class="line"><span>         AscendC::MatmulType&lt;TPosition::GM, CubeFormat::ND, C_T&gt;,</span></span>
<span class="line"><span>         AscendC::MatmulType&lt;TPosition::GM, CubeFormat::ND, BiasT&gt;&gt;&gt;</span></span>
<span class="line"><span>      mm;</span></span>
<span class="line"><span> // 通过在定义matmul对象的模板参数里加上CFG_MDL参数使能大包搬运功能：</span></span>
<span class="line"><span>  Matmul&lt;AscendC::MatmulType&lt;TPosition::GM, CubeFormat::ND, A_T&gt;,</span></span>
<span class="line"><span>         AscendC::MatmulType&lt;TPosition::GM, CubeFormat::ND, B_T&gt;,</span></span>
<span class="line"><span>         AscendC::MatmulType&lt;TPosition::GM, CubeFormat::ND, C_T&gt;,</span></span>
<span class="line"><span>         AscendC::MatmulType&lt;TPosition::GM, CubeFormat::ND, BiasT&gt;, CFG_MDL&gt;&gt;</span></span>
<span class="line"><span>      mm;</span></span></code></pre></div><p>从下图可以看到，使能大包搬运后，MTE2耗时从808us下降到591us，带宽利用率代入数据计算为3406GB/s，利用率提升36%+，Cube利用率达到80%+。</p><p><strong>图 4</strong> 使能大包搬运后Profiling数据<br><img src="`+c+'" alt="" title="使能大包搬运后Profiling数据"></p></li></ul><h2 id="验证优化方案性能收益" tabindex="-1">验证优化方案性能收益 <a class="header-anchor" href="#验证优化方案性能收益" aria-label="Permalink to &quot;验证优化方案性能收益&quot;">​</a></h2><ul><li>优化分核逻辑，实际收益4.75倍，约等于(20核 / 4核) = 5倍收益，并且考虑到核的启动开销，可以认为收益一致。</li><li>优化基本块，实际收益约3倍，理论评估代入上述分析公式，收益为(1 / 64 + 1 / 64) / (1 / 128 + 1 / 256)，约等于2.7倍，考虑到cache缓存的影响，认为收益一致。</li><li>大包搬运，实际收益25%+，与经验值一致。</li></ul><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>优化点一和优化点二的适用场景，需要shape足够大，数据量足够多，才能分满核和使能最优的基本块。大shape场景下，MTE2 Bound算子可参考此案例的优化手段。</p>',17)])])}const d=s(o,[["render",r]]);export{_ as __pageData,d as default};
