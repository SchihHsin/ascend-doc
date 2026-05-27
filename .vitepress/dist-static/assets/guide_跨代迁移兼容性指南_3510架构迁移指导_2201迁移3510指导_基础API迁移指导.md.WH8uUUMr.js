import{c as s,Q as n,j as p,m as l}from"./chunks/framework.DOi4mjdC.js";const e="/assets/ZN-88.C6R9hSeZ.png",t="/assets/ZN-89._D7sDOlg.png",i="/assets/ZN-90.BeBtotfx.png",o="/assets/ZN-91.DT9TWVn-.png",L=JSON.parse('{"title":"基础API迁移指导","description":"","frontmatter":{},"headers":[{"level":1,"title":"基础API迁移指导","slug":"基础api迁移指导"},{"level":2,"title":"矢量计算","slug":"矢量计算"},{"level":2,"title":"数据搬运","slug":"数据搬运"},{"level":2,"title":"矩阵计算","slug":"矩阵计算"},{"level":2,"title":"系统变量访问","slug":"系统变量访问"},{"level":2,"title":"调测 API","slug":"调测-api"}],"relativePath":"guide/跨代迁移兼容性指南/3510架构迁移指导/2201迁移3510指导/基础API迁移指导.md","filePath":"guide/跨代迁移兼容性指南/3510架构迁移指导/2201迁移3510指导/基础API迁移指导.md"}'),c={name:"guide/跨代迁移兼容性指南/3510架构迁移指导/2201迁移3510指导/基础API迁移指导.md"};function r(d,a,g,u,C,f){return n(),p("div",null,[...a[0]||(a[0]=[l(`<h1 id="基础api迁移指导" tabindex="-1">基础API迁移指导 <a class="header-anchor" href="#基础api迁移指导" aria-label="Permalink to &quot;基础API迁移指导&quot;">​</a></h1><p>本节针对<a href="./../../../编程指南/语言扩展层/SIMD-BuiltIn关键字.html#table65291052154114">NPU架构版本3510</a>的芯片变更对基础API兼容性产生的影响进行说明，并提供基础API的兼容性适配方案。</p><h2 id="矢量计算" tabindex="-1">矢量计算 <a class="header-anchor" href="#矢量计算" aria-label="Permalink to &quot;矢量计算&quot;">​</a></h2><ul><li><p><strong>3510架构默认不支持Subnormal功能。</strong></p><p><strong>说明</strong>：SubNormal浮点数指的是指数位全为0、尾数不为0的浮点数，用于表示比最小正常数更小的值，避免“下溢为0”。3510版本默认不支持Subnormal，Subnormal浮点数在计算中被视为0。</p><p><strong>兼容方案</strong>：通过设置config模板参数来配置Subnormal计算模式。软件模拟对Subnormal数据的处理，通过精度扩展等处理方式来避免Subnormal浮点数下溢为0。</p><p><strong>表 1</strong> 涉及Subnormal的API和config参数说明</p><p>&lt;table&gt;&lt;thead align=&quot;left&quot;&gt;&lt;tr&gt;&lt;th class=&quot;cellrowborder&quot; align=&quot;center&quot; valign=&quot;top&quot; width=&quot;27%&quot;&gt;&lt;p&gt;Ascend C 基础API&lt;/p&gt; &lt;/th&gt; &lt;th class=&quot;cellrowborder&quot; align=&quot;center&quot; valign=&quot;top&quot; width=&quot;73%&quot;&gt;&lt;p&gt;兼容说明&lt;/p&gt; &lt;/th&gt; &lt;/tr&gt; &lt;/thead&gt; &lt;tbody&gt;&lt;tr&gt;&lt;td class=&quot;cellrowborder&quot; align=&quot;center&quot; valign=&quot;top&quot; width=&quot;27%&quot;&gt;&lt;p&gt;Exp、Ln、Reciprocal、Sqrt、Rsqrt、Div&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; align=&quot;left&quot; valign=&quot;top&quot; width=&quot;73%&quot;&gt;&lt;p&gt;以Ln接口为例来进行说明。&lt;/p&gt; &lt;p&gt;通过LnConfig结构体的参数algo来配置Subnormal计算模式。algo取值如下：&lt;/p&gt; &lt;ul&gt;&lt;li&gt;LnAlgo::INTRINSIC、LnAlgo::PRECISION_1ULP_FTZ_TRUE，使用单指令计算得出结果，所有Subnormal被近似为0。&lt;/li&gt;&lt;li&gt;LnAlgo::PRECISION_1ULP_FTZ_FALSE，支持Subnormal数据计算。&lt;/li&gt;&lt;/ul&gt; &lt;p&gt;该参数默认值DEFAULT_LN_CONFIG的取值如下：&lt;/p&gt; &lt;pre class=&quot;screen&quot; codetype=&quot;Cpp&quot;&gt;constexpr LnConfig DEFAULT_LN_CONFIG = { LnAlgo::INTRINSIC };&lt;/pre&gt; &lt;/td&gt; &lt;/tr&gt; &lt;/tbody&gt; &lt;/table&gt;</p><p>可以参考以下代码片段：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>// 定义模板参数</span></span>
<span class="line"><span>constexpr AscendC::LnConfig CONFIG = {</span></span>
<span class="line"><span>    AscendC::LnAlgo::PRECISION_1ULP_FTZ_FALSE</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span>template &lt;typename T&gt;</span></span>
<span class="line"><span>__aicore__ inline void Compute(GM_ADDR dst, GM_ADDR src, uint32_t count)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    AscendC::TPipe pipe;</span></span>
<span class="line"><span>    AscendC::GlobalTensor&lt;T&gt; srcGlobal;</span></span>
<span class="line"><span>    AscendC::GlobalTensor&lt;T&gt; dstGlobal;</span></span>
<span class="line"><span>    srcGlobal.SetGlobalBuffer((__gm__ T*)src);</span></span>
<span class="line"><span>    dstGlobal.SetGlobalBuffer((__gm__ T*)dst);</span></span>
<span class="line"><span>    AscendC::TQue&lt;AscendC::TPosition::VECIN, 1&gt; inQueue;</span></span>
<span class="line"><span>    AscendC::TQue&lt;AscendC::TPosition::VECOUT, 1&gt; outQueue;</span></span>
<span class="line"><span>    pipe.InitBuffer(inQueue, 1, count * sizeof(T));</span></span>
<span class="line"><span>    pipe.InitBuffer(outQueue, 1, count * sizeof(T));</span></span>
<span class="line"><span>    AscendC::LocalTensor&lt;T&gt; dstLocal = outQueue.AllocTensor&lt;T&gt;();</span></span>
<span class="line"><span>    AscendC::LocalTensor&lt;T&gt; srcLocal = inQueue.AllocTensor&lt;T&gt;();</span></span>
<span class="line"><span>    AscendC::DataCopy(srcLocal, srcGlobal, count);</span></span>
<span class="line"><span>    AscendC::SetFlag&lt;AscendC::HardEvent::MTE2_V&gt;(EVENT_ID0);</span></span>
<span class="line"><span>    AscendC::WaitFlag&lt;AscendC::HardEvent::MTE2_V&gt;(EVENT_ID0);</span></span>
<span class="line"><span>    // 调用基础API Ln，传入模板参数</span></span>
<span class="line"><span>    AscendC::Ln&lt;T, CONFIG&gt;(dstLocal, srcLocal, count);</span></span>
<span class="line"><span>    AscendC::SetFlag&lt;AscendC::HardEvent::V_MTE3&gt;(EVENT_ID1);</span></span>
<span class="line"><span>    AscendC::WaitFlag&lt;AscendC::HardEvent::V_MTE3&gt;(EVENT_ID1);</span></span>
<span class="line"><span>    AscendC::DataCopy(dstGlobal, dstLocal, count);</span></span>
<span class="line"><span>    inQueue.FreeTensor(srcLocal);</span></span>
<span class="line"><span>}</span></span></code></pre></div></li></ul><h2 id="数据搬运" tabindex="-1">数据搬运 <a class="header-anchor" href="#数据搬运" aria-label="Permalink to &quot;数据搬运&quot;">​</a></h2><ul><li><p><strong>DataCopy接口不支持L1 Buffer -&gt; GM通路。</strong></p><p><strong>说明</strong>：硬件删除L1 Buffer到GM的通路，无法将数据从L1 Buffer直接搬运到GM中。现有接口不支持L1 Buffer到GM的直接搬运。</p><p><strong>兼容方案</strong>：对于纯Cube计算场景：在GM多分配一个单位矩阵，通过Mmad矩阵乘法计算输出到L0C Buffer，再从L0C Buffer通过Fixpipe搬运到GM。对于Vector和Cube计算融合场景，可以通过L1 Buffer搬运到UB，再搬运到GM。以下以纯Cube计算场景为例进行说明，介绍算子核心流程，具体可参考<a href="https://gitcode.com/cann/asc-devkit/tree/master/examples/01_simd_cpp_api/05_compatibility_guide/data_copy_l1togm" target="_blank" rel="noreferrer">L1到GM搬运兼容性样例</a>。</p><ol><li><p>将矩阵A从GM搬运到L1 Buffer。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>__aicore__ inline void CopyGmToL1A(AscendC::LocalTensor&lt;T&gt; a1Local)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    AscendC::Nd2NzParams intriParams1{1, M, K, 0, K, M, 1, 0};</span></span>
<span class="line"><span>    AscendC::DataCopy(a1Local, aGlobal, intriParams1);</span></span>
<span class="line"><span>}</span></span></code></pre></div></li><li><p>将矩阵B（矩阵B为单位矩阵）从GM搬运到L1 Buffer。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>__aicore__ inline void CopyGmToL1B(AscendC::LocalTensor&lt;U&gt; b1Local)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    AscendC::Nd2NzParams intriParams2{1, K, N, 0, N, K, 1, 0};</span></span>
<span class="line"><span>    AscendC::DataCopy(b1Local, bGlobal, intriParams2);</span></span>
<span class="line"><span>}</span></span></code></pre></div></li><li><p>将矩阵A从L1 Buffer搬运到L0A Buffer。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>__aicore__ inline void Load2DL1AToL0A(AscendC::LocalTensor&lt;T&gt; a1Local, AscendC::LocalTensor&lt;T&gt; a2Local)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    AscendC::LoadData2DParamsV2 loadDataParams;</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    AscendC::LoadData(a2Local, a1Local, loadDataParams);</span></span>
<span class="line"><span>}</span></span></code></pre></div></li><li><p>将矩阵B从L1 Buffer搬运到L0B Buffer。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>__aicore__ inline void Load2DL1BToL0B(AscendC::LocalTensor&lt;U&gt; b1Local, AscendC::LocalTensor&lt;U&gt; b2Local)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    AscendC::LoadData2DParamsV2 loadDataParams;</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    AscendC::LoadData(b2Local, b1Local, loadDataParams);</span></span>
<span class="line"><span>}</span></span></code></pre></div></li><li><p>进行Mmad矩阵计算，结果输出到L0C Buffer。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>__aicore__ inline void Compute(</span></span>
<span class="line"><span>    AscendC::LocalTensor&lt;S&gt; co1Local, AscendC::LocalTensor&lt;T&gt; a2Local, AscendC::LocalTensor&lt;U&gt; b2Local)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    AscendC::MmadParams mmadParams;</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    AscendC::Mmad(co1Local, a2Local, b2Local, mmadParams);</span></span>
<span class="line"><span>}</span></span></code></pre></div></li><li><p>通过FixPipe将矩阵C从L0C Buffer拷贝到GM。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>__aicore__ inline void CopyL0CToGm(AscendC::LocalTensor&lt;S&gt; co1Local)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    AscendC::FixpipeParamsV220 fixpipeParams;</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    AscendC::Fixpipe&lt;S, S, AscendC::CFG_ROW_MAJOR&gt;(cGlobal, co1Local, fixpipeParams);</span></span>
<span class="line"><span>}</span></span></code></pre></div></li></ol></li><li><p><strong>不支持SetLoadDataBoundary接口。</strong></p><p><strong>说明</strong>：3510架构硬件删除了L1 Buffer的边界值设定相关寄存器，不再支持SetLoadDataBoundary接口。该接口用于设置Load3D时L1 Buffer的边界值。如果指令在处理源操作数时，源操作数在L1 Buffer上的地址超出设置的边界，则会从L1 Buffer的起始地址开始读取数据。设置为0表示无边界，可以使用整个L1 Buffer。</p><p><strong>兼容方案</strong>：</p><ul><li><a href="./../../../编程指南/语言扩展层/SIMD-BuiltIn关键字.html#table65291052154114">NPU架构版本2201</a>的接口参数boundaryValue设置为0时与3510架构版本等价。</li><li>如果需要在L1 Buffer上循环读取操作数，需要将对应的Load3D接口手动拆分成多条指令，手动绕回。</li></ul><p><img src="`+e+`" alt=""></p><p>如上图所示，以L1 Buffer到L0A Buffer的搬运为例。矩阵A为half数据类型，大小为32 * 32的矩阵，假设边界为512B，可以重复搬运数据到L0A Buffer，在每次搬运时设置目的操作数的地址偏移量。</p><ol><li><p>将矩阵A从GM搬运到L1 Buffer。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>__aicore__ inline void CopyGmToA1Nd2Nz()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    AscendC::LocalTensor&lt;T&gt; leftMatrix = qidA1_.template AllocTensor&lt;T&gt;();</span></span>
<span class="line"><span>    AscendC::Nd2NzParams nd2nzParams;</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    AscendC::DataCopy(leftMatrix, aGlobal_, nd2nzParams);</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>}</span></span></code></pre></div></li><li><p>将矩阵B从GM搬运到L1 Buffer。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>__aicore__ inline void CopyGmToB1Nd2Nz()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    AscendC::LocalTensor&lt;U&gt; rightMatrix = qidB1_.template AllocTensor&lt;U&gt;();</span></span>
<span class="line"><span>    AscendC::Nd2NzParams nd2nzParams;</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    AscendC::DataCopy(rightMatrix, bGlobal_, nd2nzParams);</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>}</span></span></code></pre></div></li><li><p>将矩阵A从L1 Buffer搬运到L0A Buffer。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>__aicore__ inline void Load3DA1ToL0A()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    auto leftMatrix = qidA1_.template DeQue&lt;T&gt;();</span></span>
<span class="line"><span>    AscendC::LocalTensor&lt;T&gt; a2 = qidA2_.AllocTensor&lt;T&gt;();</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    AscendC::LoadData3DParamsV2Pro loadData3dParamsPro;</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    // 多次调用LoadData进行手动绕回</span></span>
<span class="line"><span>    AscendC::LoadData(a2, leftMatrix, loadData3dParamsPro);</span></span>
<span class="line"><span>    AscendC::LocalTensor&lt;T&gt; a3 = a2[256];</span></span>
<span class="line"><span>    AscendC::LoadData(a3, leftMatrix, loadData3dParamsPro);</span></span>
<span class="line"><span>    AscendC::LocalTensor&lt;T&gt; a4 = a2[512];</span></span>
<span class="line"><span>    AscendC::LoadData(a4,  leftMatrix, loadData3dParamsPro);</span></span>
<span class="line"><span>    AscendC::LocalTensor&lt;T&gt; a5 = a2[768];</span></span>
<span class="line"><span>    AscendC::LoadData(a5,  leftMatrix, loadData3dParamsPro);</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>}</span></span></code></pre></div></li><li><p>将矩阵B从L1 Buffer搬运到L0B Buffer。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>__aicore__ inline void Load3DB1ToL0B()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    AscendC::SetLoadDataRepeat({0, 1, 0, dstStride});</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>}</span></span></code></pre></div></li><li><p>矩阵计算。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>__aicore__ inline void Compute()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    AscendC::MmadParams mmadParams;</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    auto co1Local = qidCO1_.AllocTensor&lt;V&gt;();</span></span>
<span class="line"><span>    auto a2 = qidA2_.DeQue&lt;T&gt;();</span></span>
<span class="line"><span>    auto b2 = qidB2_.DeQue&lt;U&gt;();</span></span>
<span class="line"><span>    AscendC::Mmad(co1Local, a2, b2, mmadParams);</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>}</span></span></code></pre></div></li><li><p>将矩阵C从L0C Buffer搬运到GM。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>__aicore__ inline void CopyL0CToGm(const AscendC::GlobalTensor&lt;S&gt;&amp; gm)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    auto co1Local = qidCO1_.DeQue&lt;V&gt;();</span></span>
<span class="line"><span>    AscendC::FixpipeParamsV220 fixpipeParams(nLength, static_cast&lt;uint16_t&gt;(mLength),</span></span>
<span class="line"><span>                                    AscendC::DivCeil(mLength, AscendC::BLOCK_CUBE) * AscendC::BLOCK_CUBE, static_cast&lt;uint16_t&gt;(nLength), 0);</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    AscendC::Fixpipe&lt;S, V, AscendC::CFG_ROW_MAJOR&gt;(gm, co1Local, fixpipeParams);</span></span>
<span class="line"><span>    qidCO1_.FreeTensor(co1Local);</span></span>
<span class="line"><span>}</span></span></code></pre></div></li></ol></li></ul><h2 id="矩阵计算" tabindex="-1">矩阵计算 <a class="header-anchor" href="#矩阵计算" aria-label="Permalink to &quot;矩阵计算&quot;">​</a></h2><ul><li><p><strong>Cube计算单元删除int4b_t数据类型。</strong></p><p><strong>说明</strong>：相较于2201架构版本，3510架构版本的Cube计算单元不支持int4b_t。相关的基础API有LoadData、Mmad和LoadDataWithTranspose，这些接口不再支持int4b_t。</p><p><strong>兼容方案</strong>：算子侧通过编写CV融合算子在Vector Core进行int4b_t到int8_t的Cast转换，再通过UB搬运到L1后进行Mmad计算。图层面可以在该算子前增加Cast节点进行int4b_t到int8_t的转换。</p><ol><li><p>在Vector Core进行int4b_t到int8_t的Cast转换，转换后的数据保存到新的GM空间中。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>__aicore__ inline void Unzip(AscendC::GlobalTensor&lt;int8_t&gt;&amp; dstGlobalTensor,</span></span>
<span class="line"><span>                             AscendC::GlobalTensor&lt;int8_t&gt;&amp; srcGlobalTensor, uint32_t count,</span></span>
<span class="line"><span>                             AscendC::TQue&lt;AscendC::TPosition::VECIN, 1&gt;&amp; q1,</span></span>
<span class="line"><span>                             AscendC::TQue&lt;AscendC::TPosition::VECOUT, 1&gt;&amp; q2,</span></span>
<span class="line"><span>                             AscendC::TQue&lt;AscendC::TPosition::VECOUT, 1&gt;&amp; q3)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    AscendC::LocalTensor&lt;int8_t&gt; srcLocalTensor = q1.AllocTensor&lt;int8_t&gt;();</span></span>
<span class="line"><span>    AscendC::LocalTensor&lt;half&gt; tmpTensor = q2.AllocTensor&lt;half&gt;();</span></span>
<span class="line"><span>    AscendC::LocalTensor&lt;int8_t&gt; dstLocalTensor = q3.AllocTensor&lt;int8_t&gt;();</span></span>
<span class="line"><span>    AscendC::DataCopy(srcLocalTensor, srcGlobalTensor, count);</span></span>
<span class="line"><span>    AscendC::LocalTensor&lt;AscendC::int4b_t&gt; int4SrcLocalTensor = srcLocalTensor.ReinterpretCast&lt;AscendC::int4b_t&gt;();</span></span>
<span class="line"><span>    uint32_t mask = count / sizeof(half);</span></span>
<span class="line"><span>    AscendC::SetFlag&lt;AscendC::HardEvent::MTE2_V&gt;(EVENT_ID0);</span></span>
<span class="line"><span>    AscendC::WaitFlag&lt;AscendC::HardEvent::MTE2_V&gt;(EVENT_ID0);</span></span>
<span class="line"><span>    AscendC::Cast&lt;half, AscendC::int4b_t&gt;(tmpTensor, int4SrcLocalTensor, AscendC::RoundMode::CAST_NONE, count * 2);</span></span>
<span class="line"><span>    AscendC::Cast&lt;int8_t, half&gt;(dstLocalTensor, tmpTensor, AscendC::RoundMode::CAST_CEIL, count * 2);</span></span>
<span class="line"><span>    AscendC::SetFlag&lt;AscendC::HardEvent::V_MTE3&gt;(EVENT_ID1);</span></span>
<span class="line"><span>    AscendC::WaitFlag&lt;AscendC::HardEvent::V_MTE3&gt;(EVENT_ID1);</span></span>
<span class="line"><span>    AscendC::DataCopy(dstGlobalTensor, dstLocalTensor, count * 2);</span></span>
<span class="line"><span>    q1.FreeTensor(srcLocalTensor);</span></span>
<span class="line"><span>    q2.FreeTensor(tmpTensor);</span></span>
<span class="line"><span>    q3.FreeTensor(dstLocalTensor);</span></span>
<span class="line"><span>}</span></span></code></pre></div></li><li><p>进行int8_t数据类型的矩阵计算。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>template &lt;class A_TYPE, class B_TYPE, class C_TYPE, class BIAS_TYPE&gt;</span></span>
<span class="line"><span>__aicore__ inline void MatMulKernel(AscendC::GlobalTensor&lt;int8_t&gt;&amp; aGlobal, AscendC::GlobalTensor&lt;int8_t&gt;&amp; bGlobal,</span></span>
<span class="line"><span>                                    AscendC::GlobalTensor&lt;int32_t&gt;&amp; cGlobal, GM_ADDR tilingGM, GM_ADDR workspaceGM,</span></span>
<span class="line"><span>                                    int32_t isTransposeAIn, int32_t isTransposeBIn, AscendC::TPipe&amp; que)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    using A_T = typename A_TYPE::T;</span></span>
<span class="line"><span>    using B_T = typename B_TYPE::T;</span></span>
<span class="line"><span>    using C_T = typename C_TYPE::T;</span></span>
<span class="line"><span>    using BiasT = typename BIAS_TYPE::T;</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    int offsetA = 0;</span></span>
<span class="line"><span>    int offsetB = 0;</span></span>
<span class="line"><span>    int offsetC = 0;</span></span>
<span class="line"><span>    int offsetBias = 0;</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    auto gmA = aGlobal[offsetA];</span></span>
<span class="line"><span>    auto gmB = bGlobal[offsetB];</span></span>
<span class="line"><span>    auto gmC = cGlobal[offsetC];</span></span>
<span class="line"><span>    AscendC::MatmulImpl&lt;A_TYPE, B_TYPE, C_TYPE, BIAS_TYPE, CFG_MDL&gt; mm;</span></span>
<span class="line"><span>    mm.SetSubBlockIdx(0);</span></span>
<span class="line"><span>    mm.Init(&amp;tiling, &amp;que);</span></span>
<span class="line"><span>    mm.SetTensorA(gmA, isTransposeA);</span></span>
<span class="line"><span>    mm.SetTensorB(gmB, isTransposeB);</span></span>
<span class="line"><span>    mm.IterateAll(gmC);</span></span>
<span class="line"><span>}</span></span></code></pre></div></li></ol></li><li><p><strong>L0A Buffer分形改变，从ZZ转换为ZN格式。</strong></p><p><strong>说明</strong>：涉及的API有LoadData、Mmad和LoadDataWithTranspose。</p><ul><li><p>2201架构版本，参与矩阵乘计算（A * B = C）时， ABC矩阵的数据排布格式分别为ZZ，ZN，NZ。A、B、C矩阵分别位于L0A Buffer、L0B Buffer、L0C Buffer。</p><p>矩阵A：每个分形矩阵内部是行主序，分形矩阵之间是行主序。分形Shape为16 x (32B/sizeof(AType))，大小为512Byte。</p><p>矩阵B：每个分形矩阵内部是列主序，分形矩阵之间是行主序。分形Shape为 (32B/sizeof(BType)) x 16，大小为512Byte。</p><p>矩阵C：每个分形矩阵内部是行主序，分形矩阵之间是列主序。分形Shape为16 x 16，大小为256个元素。</p><p><img src="`+t+'" alt=""></p></li><li><p>3510架构版本，参与矩阵乘计算（A * B = C）时， ABC矩阵的数据排布格式分别为NZ，ZN，NZ。</p><p>矩阵A：每个分形矩阵内部是行主序，分形矩阵之间是列主序。其Shape为16 x (32B/sizeof(AType))，大小为512Byte。</p><p>矩阵B：每个分形矩阵内部是列主序，分形矩阵之间是行主序。其Shape为 (32B/sizeof(BType)) x 16，大小为512Byte。</p><p>矩阵C：每个分形矩阵内部是行主序，分形矩阵之间是列主序。其Shape为16 x 16，大小为256个元素。</p><p><img src="'+i+'" alt=""></p></li></ul><p><strong>兼容方案</strong>：非L0A Buffer切分的场景兼容2201版本，L0A Buffer切分的场景需要根据新的分形重新适配。</p><p>在2201架构中，矩阵计算要求左矩阵为ZZ分形（3510中为NZ），右矩阵为ZN分形，由于L1 Buffer的数据分形为NZ，所以2201架构下将左矩阵从L1 Buffer搬运到L0A Buffer需要额外做NZ分形到ZZ分形的转换，3510架构下则不用转换分形。</p><p><img src="'+o+`" alt=""></p><p>分形变化带来的变动主要体现在L1 Buffer到L0A Buffer的搬运过程，以下代码片段进行展示：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>__aicore__ inline void SplitA()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    int srcOffset = 0;</span></span>
<span class="line"><span>    int dstOffset = 0;</span></span>
<span class="line"><span>    AscendC::LocalTensor&lt;half&gt; a1Local = inQueueA1.DeQue&lt;half&gt;();</span></span>
<span class="line"><span>    AscendC::LocalTensor&lt;half&gt; a2Local = inQueueA2.AllocTensor&lt;half&gt;();</span></span>
<span class="line"><span>    // 2201架构下LoadData时做Nz2Zz的分形转换</span></span>
<span class="line"><span>    // for (int i = 0; i &lt; mBlocks; ++i) {</span></span>
<span class="line"><span>    //     AscendC::LoadData2DParams loadDataParams;</span></span>
<span class="line"><span>    //     loadDataParams.repeatTimes = kBlocks;</span><span> //  kBlocks表示列方向上有几个宽为16的half类型矩阵</span></span>
<span class="line"><span>    //     loadDataParams.srcStride = mBlocks;</span><span> //  mBlocks表示行方向上有几个高为16的half类型矩阵</span></span>
<span class="line"><span>    //     loadDataParams.ifTranspose = false;</span></span>
<span class="line"><span>    //     AscendC::LoadData(a2Local[dstOffset], a1Local[srcOffset], loadDataParams);</span></span>
<span class="line"><span>    //     srcOffset += 16 * 16;</span></span>
<span class="line"><span>    //     dstOffset += k * 16;</span></span>
<span class="line"><span>    // }</span></span>
<span class="line"><span>    // 3510架构下LoadData时不需要做Nz2Zz的分形转换，对应搬运参数需要修改</span></span>
<span class="line"><span>    AscendC::LoadData2DParams loadDataParams;</span></span>
<span class="line"><span>    loadDataParams.repeatTimes = m * k / 512; // 小z矩阵的个数 </span></span>
<span class="line"><span>    loadDataParams.srcStride = 1; // 小z矩阵之间的间隔</span></span>
<span class="line"><span>    loadDataParams.dstGap = 0;</span></span>
<span class="line"><span>    loadDataParams.ifTranspose = false;</span></span>
<span class="line"><span>    AscendC::LoadData(a2Local, a1Local, loadDataParams);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    inQueueA2.EnQue&lt;half&gt;(a2Local);</span></span>
<span class="line"><span>    inQueueA1.FreeTensor(a1Local);</span></span>
<span class="line"><span>}</span></span></code></pre></div></li><li><p><strong>3510架构版本硬件架构删除4：2结构化稀疏功能。</strong></p><p><strong>说明</strong>：LoadDataWithSparse用于将存储在L1 Buffer中的512B稠密权重矩阵搬运到L0B buffer，并同时读取128B的索引矩阵以实现稠密矩阵的稀疏化。由于3510架构版本不支持结构化稀疏功能，因此LoadDataWithSparse在此版本中并不适用。另一方面，MmadWithSparse负责执行矩阵乘加操作，其中右矩阵B为稠密矩阵，需要通过调用LoadDataWithSparse进行载入。由于3510架构不支持LoadDataWithSparse，因此MmadWithSparse也无法在3510架构版本中使用。</p><p><strong>兼容方案</strong>：在算子侧可以不调用LoadDatawithSparse进行矩阵稠密转稀疏操作，然后使用Mmad进行正常的稠密矩阵计算。稀疏矩阵相关算法可参考MmadWithSparse中的介绍。</p></li><li><p><strong>3510架构版本删除GM-&gt; L0A Buffer/L0B Buffer 通路</strong></p><p><strong>说明</strong>：硬件删除GM-&gt; L0A Buffer/L0B Buffer通路，调用LoadData时，不再支持这些通路。</p><p><strong>兼容方案</strong>：实现GM-&gt; L0A Buffer/L0B Buffer搬运需拆分成两步进行，先从GM搬运到L1 Buffer，再从L1 Buffer搬运到L0A Buffer、L0B Buffer。</p><p>以GM -&gt; L1 Buffer -&gt; L0A Buffer通路为例可以参考以下步骤：</p><ol><li><p>将矩阵A从GM搬运到L1 Buffer。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>__aicore__ inline void CopyGmToA1()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    AscendC::LocalTensor&lt;T&gt; leftMatrix = inQueueA1.AllocTensor&lt;T&gt;();</span></span>
<span class="line"><span>    AscendC::Nd2NzParams intriParams1{1, 64, 128, 0, 128, 64, 1, 0};</span></span>
<span class="line"><span>    AscendC::DataCopy(leftMatrix, aGlobal, intriParams1);</span></span>
<span class="line"><span>    inQueueA1.EnQue(leftMatrix);</span></span>
<span class="line"><span>}</span></span></code></pre></div></li><li><p>将矩阵A从L1 Buffer搬运到L0A Buffer。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>__aicore__ inline void Load2DA1ToL0A()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    AscendC::LocalTensor&lt;T&gt; a1 = inQueueA1.DeQue&lt;T&gt;();</span></span>
<span class="line"><span>    AscendC::LocalTensor&lt;T&gt; a2 = inQueueA2.AllocTensor&lt;T&gt;();</span></span>
<span class="line"><span>    AscendC::LoadData2DParamsV2 loadDataParams;</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    AscendC::LoadData(a2, a1, loadDataParams);</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>}</span></span></code></pre></div></li></ol></li><li><p><strong>3510架构版本删除L0A Buffer/L0B Buffer初始化的相关硬件指令。</strong></p><p><strong>说明</strong>：Fill接口将特定存储位置的LocalTensor初始化为某一具体数值，不支持直接初始化L0A Buffer、L0B Buffer。</p><p><strong>兼容方案</strong>：先通过Fill接口初始化L1 Buffer，再通过LoadData接口将L1 Buffer上的数据搬运到L0A Buffer、L0B Buffer。具体代码可参考<a href="https://gitcode.com/cann/asc-devkit/tree/master/examples/01_simd_cpp_api/05_compatibility_guide/fill" target="_blank" rel="noreferrer">Fill兼容性样例</a>。</p><p>以 GM -&gt; L1 Buffer -&gt; L0A Buffer的数据通路为例：</p><ol><li><p>初始化L1 Buffer。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>__aicore__ inline void InitConstA1(AscendC::LocalTensor&lt;T&gt;&amp; a1Local)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    AscendC::Fill(a1Local, {1, static_cast&lt;uint16_t&gt;(M * K * sizeof(T) / 32), 0, 1});</span></span>
<span class="line"><span>}</span></span></code></pre></div></li><li><p>调用LoadData接口将L1 Buffer上的数据搬运到L0A Buffer。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>__aicore__ inline void Load2DA1ToA2(AscendC::LocalTensor&lt;T&gt;&amp; a1Local, AscendC::LocalTensor&lt;T&gt;&amp; a2Local)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    AscendC::LoadData2DParamsV2 loadDataParams;</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    AscendC::LoadData(a2Local, a1Local, loadDataParams);</span></span>
<span class="line"><span>}</span></span></code></pre></div></li></ol></li></ul><h2 id="系统变量访问" tabindex="-1">系统变量访问 <a class="header-anchor" href="#系统变量访问" aria-label="Permalink to &quot;系统变量访问&quot;">​</a></h2><ul><li><p><strong>不支持CheckLocalMemoryIA，3510架构版本相关寄存器删除。</strong></p><p><strong>说明</strong>：CheckLocalMemoryIA监视设定范围内的UB读写行为，如果监视到有设定范围的读写行为则会出现EXCEPTION报错，未监视到设定范围的读写行为则不会报错。</p><p><strong>兼容方案</strong>：该接口为调测接口，对功能无影响。</p></li></ul><h2 id="调测-api" tabindex="-1">调测 API <a class="header-anchor" href="#调测-api" aria-label="Permalink to &quot;调测 API&quot;">​</a></h2><ul><li><p><strong>L1 Buffer上不支持Tensor信息的打印。</strong></p><p><strong>说明</strong>：因芯片删除L1 Buffer -&gt; GM通路，不支持L1 Buffer -&gt; GM的功能。</p><p><strong>兼容方案</strong>：该接口为调测接口，对功能无影响。</p></li></ul>`,12)])])}const m=s(c,[["render",r]]);export{L as __pageData,m as default};
