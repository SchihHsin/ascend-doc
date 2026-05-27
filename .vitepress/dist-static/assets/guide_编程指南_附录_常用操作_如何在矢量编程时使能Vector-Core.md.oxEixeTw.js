import{c as n,Q as e,j as s,m as t}from"./chunks/framework.DOi4mjdC.js";const d=JSON.parse('{"title":"如何在矢量编程时使能Vector Core","description":"","frontmatter":{},"headers":[{"level":1,"title":"如何在矢量编程时使能Vector Core","slug":"如何在矢量编程时使能vector-core"}],"relativePath":"guide/编程指南/附录/常用操作/如何在矢量编程时使能Vector-Core.md","filePath":"guide/编程指南/附录/常用操作/如何在矢量编程时使能Vector-Core.md"}'),o={name:"guide/编程指南/附录/常用操作/如何在矢量编程时使能Vector-Core.md"};function r(p,a,l,c,i,_){return e(),s("div",null,[...a[0]||(a[0]=[t(`<h1 id="如何在矢量编程时使能vector-core" tabindex="-1">如何在矢量编程时使能Vector Core <a class="header-anchor" href="#如何在矢量编程时使能vector-core" aria-label="Permalink to &quot;如何在矢量编程时使能Vector Core&quot;">​</a></h1><p>针对Atlas 推理系列产品，其硬件架构除了AI Core外，还额外设置了单独的Vector Core，作为AI Core中Vector计算单元的补充，从而缓解Vector计算瓶颈。Vector Core只包括了两种基础计算资源：向量计算单元（Vector Unit）和标量计算单元（Scalar Unit），分别用于完成向量与标量的数据计算。矢量算子开发时，使能Vector Core，算子执行时会同时启动AI Core和Vector Core，这些核并行执行相同的核函数代码。</p><p>本节将重点介绍如何使能Atlas 推理系列产品中的Vector Core。学习本节内容之前，建议您先熟悉<a href="./../../../算子实践参考/SIMD算子实现/矢量编程/概述.html">算子实现</a>、<a href="./../基于样例工程完成Kernel直调.html">基于样例工程完成Kernel直调</a>、<a href="./../工程化算子开发/概述.html">工程化算子开发</a>的相关内容，掌握基于AI Core的算子端到端开发流程。在此基础上本章将重点阐述使能Vector Core时的差异点。具体如下：</p><ol><li><p>完成算子kernel侧开发时，需要通过宏<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/%E8%AE%BE%E7%BD%AEKernel%E7%B1%BB%E5%9E%8B.md" target="_blank" rel="noreferrer">KERNEL_TASK_TYPE_DEFAULT</a>使能Vector Core，算子执行时会同时启动AI Core和Vector Core， 此时AI Core会当成Vector Core使用。如下的代码样例展示了使能Vector Core的方法：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>extern &quot;C&quot; __global__ __aicore__ void add_custom(__gm__ uint8_t *x, __gm__ uint8_t *y, __gm__ uint8_t *z, __gm__ uint8_t *workspace, __gm__ uint8_t *tiling)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    GET_TILING_DATA(tilingData, tiling);</span></span>
<span class="line"><span>    if (workspace == nullptr) {</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    GM_ADDR usr = AscendC::GetUserWorkspace(workspace);</span></span>
<span class="line"><span>    KernelAdd op;</span></span>
<span class="line"><span>    op.Init(x, y, z, tilingData.numBlocks, tilingData.totalLength, tilingData.tileNum);</span></span>
<span class="line"><span>    KERNEL_TASK_TYPE_DEFAULT(KERNEL_TYPE_MIX_VECTOR_CORE); // 使能VectorCore</span></span>
<span class="line"><span>    if (TILING_KEY_IS(1)) {</span></span>
<span class="line"><span>        op.Process1();</span></span>
<span class="line"><span>    } else if (TILING_KEY_IS(2)) {</span></span>
<span class="line"><span>        op.Process2();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    // ...</span></span>
<span class="line"><span>}</span></span></code></pre></div></li><li><p>完成host侧tiling开发时，设置的numBlocks代表的是AI Core和Vector Core的总数，比如用户在host侧设置numBlocks为10，则会启动总数为10的AI Core和Vector Core；为保证启动Vector Core，设置数值应大于AI Core的核数。您可以通过<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/GetCoreNumAic.md" target="_blank" rel="noreferrer">GetCoreNumAic</a>接口获取AI Core的核数，<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/GetCoreNumVector.md" target="_blank" rel="noreferrer">GetCoreNumVector</a>接口获取Vector Core的核数。 如下代码片段，分别为使用kernel直调工程和自定义算子工程时的设置样例，此处设置为AI Core和Vector Core的总和，表示所有AI Core和Vector Core都启动。</p><ul><li><p>kernel直调工程</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>auto ascendcPlatform = platform_ascendc::PlatformAscendCManager::GetInstance();</span></span>
<span class="line"><span>auto totalCoreNum = ascendcPlatform.GetCoreNumAic();</span></span>
<span class="line"><span>// ASCENDXXX请替换为实际的版本型号</span></span>
<span class="line"><span>if (ascendcPlatform.GetSocVersion() == platform_ascendc::SocVersion::ASCENDXXX) {</span></span>
<span class="line"><span>   totalCoreNum = totalCoreNum + ascendcPlatform.GetCoreNumVector();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span>kernel_name&lt;&lt;&lt;totalCoreNum , l2ctrl, stream&gt;&gt;&gt;(argument list);</span></span></code></pre></div></li><li><p>自定义算子工程</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 配套的host侧tiling函数示例：</span></span>
<span class="line"><span>ge::graphStatus TilingFunc(gert::TilingContext* context)</span></span>
<span class="line"><span>{	</span></span>
<span class="line"><span>    // 使能VectorCore，将numBlocks置为AI Core中vector核数 + Vector Core中的vector核数</span></span>
<span class="line"><span>    auto ascendcPlatform = platform_ascendc::PlatformAscendC(platformInfo);</span></span>
<span class="line"><span>    auto totalCoreNum = ascendcPlatform.GetCoreNumAic();</span></span>
<span class="line"><span>    // ASCENDXXX请替换为实际的版本型号</span></span>
<span class="line"><span>    if (ascendcPlatform.GetSocVersion() == platform_ascendc::SocVersion::ASCENDXXX) {</span></span>
<span class="line"><span>       totalCoreNum = totalCoreNum + ascendcPlatform.GetCoreNumVector();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    context-&gt;SetBlockDim(totalCoreNum);</span></span>
<span class="line"><span>}</span></span></code></pre></div></li></ul></li></ol><div class="note custom-block github-alert"><p class="custom-block-title">说明</p><p></p><ul><li>请参考<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/README.md" target="_blank" rel="noreferrer">Ascend C API</a>中具体API支持的型号，来判断API接口是否支持Atlas 推理系列产品Vector Core。</li><li>支持Vector Core后，因为AI Core和Vector Core会分别执行，通过不同的任务进行调度，所以不支持核间同步指令，如IBSet、IBWait、SyncAll等。</li><li>算子计算溢出（输入inf/nan或计算结果超出范围）时，需注意AI Core和Vector Core结果表现不一致，AI Core仅支持饱和模式，Vector Core仅支持inf/nan模式。</li></ul></div>`,5)])])}const m=n(o,[["render",r]]);export{d as __pageData,m as default};
