import{c as s,Q as n,j as e,m as l}from"./chunks/framework.DOi4mjdC.js";const p="/assets/Flash-Attention%E6%A0%B8%E5%BF%83%E5%AE%9E%E7%8E%B0.Bcs3GHip.png",t="/assets/%E7%8B%AC%E7%AB%8B%E7%9F%A2%E9%87%8F%E7%AE%97%E5%AD%90%E5%92%8C%E7%9F%A9%E9%98%B5%E7%AE%97%E5%AD%90-Mix%E8%9E%8D%E5%90%88%E7%AE%97%E5%AD%90%E7%9A%84%E6%89%A7%E8%A1%8C%E8%80%97%E6%97%B6%E5%AF%B9%E6%AF%94.CkDkX_Xp.png",i="/assets/%E7%9F%A9%E9%98%B5%E7%BC%96%E7%A8%8B%E9%80%BB%E8%BE%91%E4%BD%8D%E7%BD%AE%E7%A4%BA%E6%84%8F%E5%9B%BE-45.RpW7o83F.png",o="/assets/%E8%9E%8D%E5%90%88%E7%AE%97%E5%AD%90%E7%BC%96%E7%A8%8B%E8%8C%83%E5%BC%8F-46.CiX1TyFV.png",A=JSON.parse('{"title":"基础知识","description":"","frontmatter":{},"headers":[{"level":1,"title":"基础知识","slug":"基础知识"},{"level":2,"title":"CV融合算子","slug":"cv融合算子"},{"level":2,"title":"使用场景和优势","slug":"使用场景和优势"},{"level":2,"title":"编程范式","slug":"编程范式"}],"relativePath":"guide/算子实践参考/SIMD算子实现/融合算子编程/CV融合/基础知识.md","filePath":"guide/算子实践参考/SIMD算子实现/融合算子编程/CV融合/基础知识.md"}'),r={name:"guide/算子实践参考/SIMD算子实现/融合算子编程/CV融合/基础知识.md"};function c(u,a,m,_,E,g){return n(),e("div",null,[...a[0]||(a[0]=[l('<h1 id="基础知识" tabindex="-1">基础知识 <a class="header-anchor" href="#基础知识" aria-label="Permalink to &quot;基础知识&quot;">​</a></h1><div class="note custom-block github-alert"><p class="custom-block-title">说明</p><p>学习融合算子编程之前，请确保已经掌握<a href="./../../矩阵编程（高阶API）/基础知识.html">矩阵编程</a>相关知识。</p></div><h2 id="cv融合算子" tabindex="-1">CV融合算子 <a class="header-anchor" href="#cv融合算子" aria-label="Permalink to &quot;CV融合算子&quot;">​</a></h2><p>融合算子由多个独立的小算子融合而成，其功能与多个小算子的功能等价，性能方面通常优于独立的小算子。用户可以根据实际业务场景诉求，按照具体算法自由融合向量（Vector）、矩阵（Cube）算子以达到性能上的收益。融合了Cube计算、Vector计算的算子统称为CV融合算子。</p><p>比如对于LLM大模型中最核心的一个融合算子Flash Attention， 其核心实现如下图。图中的Matmul算子（Cube）、Scale算子（Vector）、Mask算子（Vector）、SoftMax算子（Vector）融合为一个大的算子Flash Attention。</p><p><strong>图 1</strong> Flash Attention核心实现<br><img src="'+p+'" alt="" title="Flash-Attention核心实现"></p><h2 id="使用场景和优势" tabindex="-1">使用场景和优势 <a class="header-anchor" href="#使用场景和优势" aria-label="Permalink to &quot;使用场景和优势&quot;">​</a></h2><p>针对有数据依赖的矢量算子和矩阵算子，可以通过融合算子编程的方式，将矢量算子和矩阵算子进行融合，通过一个算子Kernel函数来承载，由此来获得性能上的收益。下图展示了独立矢量算子和矩阵算子、Mix融合算子的执行耗时对比，由此可以看出为什么开发Mix融合算子会带来性能上的收益。</p><p><strong>图 2</strong> 独立矢量算子和矩阵算子、Mix融合算子的执行耗时对比<br><img src="'+t+'" alt="" title="独立矢量算子和矩阵算子-Mix融合算子的执行耗时对比"></p><ul><li><strong>独立的矢量算子和矩阵算子实现</strong>：矩阵计算后的结果需要搬运到Global Memory上，然后由Global Memory搬运到Local Memory，再进行矢量算子的计算，计算和搬运都是串行执行，另外多个算子的调度执行，会增加算子的调度耗时。</li><li><strong>融合算子的实现方法</strong>：可以对数据进行切片，再通过流水的设计，使得矢量计算单元和矩阵计算单元实现并行计算；另外相比于不融合的单算子，减少了算子的调度耗时。</li></ul><p>除了有效提升算子性能，充分发挥AI处理器的算力，融合算子还有如下优势：</p><ul><li>减少计算量：融合算子可以将多个算子合并为一个，简化计算过程，减少计算量，提高计算效率。</li><li>减少内存占用：融合算子可以将多个算子的中间结果合并为一个，从而减少内存占用，提高内存利用率。</li><li>优化数据流：融合算子可以优化数据流，减少数据在不同算子之间的传输，从而提高数据处理效率。</li><li>简化代码实现：融合算子可以简化代码实现，减少代码量，提高代码可读性和可维护性。</li></ul><p><strong>总之，融合算子是一种优化计算的有效手段，可以提高计算效率和内存利用率，优化数据流，简化代码实现。</strong></p><h2 id="编程范式" tabindex="-1">编程范式 <a class="header-anchor" href="#编程范式" aria-label="Permalink to &quot;编程范式&quot;">​</a></h2><p>Ascend C提供<strong>融合算子的编程范式</strong>，方便开发者基于该范式表达融合算子的数据流，快速实现自定义的融合算子。</p><p><strong>融合算子数据流</strong>指融合算子的输入输出在各存储位置间的流向。以一个典型的Cube和Vector融合算子为例，逻辑位置间的数据流向如下图所示：</p><ul><li>Cube的输出可以作为Vector的输入：CO2-&gt;VECIN</li><li>Vector的输出可以作为Cube的输入：VECOUT-&gt;A1-&gt;A2、VECOUT-&gt;B1-&gt;B2</li></ul><p><img src="'+i+'" alt=""></p><p>基于Matmul高阶API的融合算子编程范式，对上述数据流简化表达如下：</p><p><strong>图 3</strong> 融合算子编程范式<br><img src="'+o+`" alt="" title="融合算子编程范式-46"></p><ol><li>初始化一个Matmul对象。</li><li>进行Matmul内部的计算。</li><li>将Matmul的计算结果搬运到Vector核上。</li><li>进行Vector矢量计算。</li><li>将输出结果搬运到Global Memory上。</li></ol><p>整个过程的示例代码如下（伪代码）。完整样例请参考<a href="https://gitcode.com/cann/asc-devkit/tree/master/examples/01_simd_cpp_api/00_introduction/03_fusion_operation/matmul_leakyrelu_high_level_api" target="_blank" rel="noreferrer">MatmulLeakyRelu</a>。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>template&lt;typename aType, typename bType, typename cType, typename biasType&gt;</span></span>
<span class="line"><span>__aicore__ inline void MatmulLeakyKernel&lt;aType, bType, cType, biasType&gt;::Process()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    uint32_t computeRound = 0;</span></span>
<span class="line"><span>    matmulObj.SetTensorA(aGlobal);</span></span>
<span class="line"><span>    matmulObj.SetTensorB(bGlobal);</span></span>
<span class="line"><span>    matmulObj.SetBias(biasGlobal);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    while (matmulObj.template Iterate&lt;true&gt;()) { // 步骤2：进行Matmul内部的计算。</span></span>
<span class="line"><span>        // 步骤3：将Matmul的计算结果搬运到Vector核上。</span></span>
<span class="line"><span>        reluOutLocal = reluOutQueue_.AllocTensor&lt;cType&gt;();</span></span>
<span class="line"><span>        matmulObj.template GetTensorC&lt;true&gt;(reluOutLocal, false, true);</span></span>
<span class="line"><span>        // 步骤4：进行Vector矢量计算。</span></span>
<span class="line"><span>        AscendC::LeakyRelu(reluOutLocal, reluOutLocal, (cType)alpha, tiling.baseM * tiling.baseN);</span></span>
<span class="line"><span>        reluOutQueue_.EnQue(reluOutLocal);</span></span>
<span class="line"><span>        // 步骤5：将输出结果搬运到Global Memory上</span></span>
<span class="line"><span>        reluOutQueue_.DeQue&lt;cType&gt;();</span></span>
<span class="line"><span>        ...</span></span>
<span class="line"><span>        AscendC::DataCopy(cGlobal[startOffset], reluOutLocal, copyParam);</span></span>
<span class="line"><span>        reluOutQueue_.FreeTensor(reluOutLocal);</span></span>
<span class="line"><span>        computeRound++;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    matmulObj.End();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// kernel入口函数，__mix__(1, 2)表示：mix场景，AIC:AIV=1:2。</span></span>
<span class="line"><span>__global__ __mix__(1, 2) void matmul_leakyrelu_custom(GM_ADDR a, GM_ADDR b, GM_ADDR bias, GM_ADDR c,</span></span>
<span class="line"><span>                                                      __kfc_workspace__ GM_ADDR workspace, AscendC::tiling::TCubeTiling tiling)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    AscendC::TPipe pipe;</span></span>
<span class="line"><span>    MatmulLeakyKernel&lt;half, half, float, float&gt; matmulLeakyKernel;</span></span>
<span class="line"><span>    matmulLeakyKernel.Init(a, b, bias, c, workspace, tiling, &amp;pipe);</span></span>
<span class="line"><span>    // 步骤1：初始化Matmul对象。</span></span>
<span class="line"><span>    REGIST_MATMUL_OBJ(&amp;pipe, GetSysWorkSpacePtr(), matmulLeakyKernel.matmulObj, &amp;matmulLeakyKernel.tiling);</span></span>
<span class="line"><span>    matmulLeakyKernel.Process();</span></span>
<span class="line"><span>}</span></span></code></pre></div>`,23)])])}const d=s(r,[["render",c]]);export{A as __pageData,d as default};
