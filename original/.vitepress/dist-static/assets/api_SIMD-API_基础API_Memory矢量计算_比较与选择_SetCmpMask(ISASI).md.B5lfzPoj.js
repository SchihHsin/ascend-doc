import{c as a,Q as n,j as t,m as e}from"./chunks/framework.DOi4mjdC.js";const S=JSON.parse('{"title":"SetCmpMask(ISASI)","description":"","frontmatter":{},"headers":[{"level":1,"title":"SetCmpMask\\\\(ISASI\\\\)","slug":"setcmpmaskisasi"},{"level":2,"title":"产品支持情况","slug":"产品支持情况"},{"level":2,"title":"功能说明","slug":"功能说明"},{"level":2,"title":"函数原型","slug":"函数原型"},{"level":2,"title":"参数说明","slug":"参数说明"},{"level":2,"title":"返回值说明","slug":"返回值说明"},{"level":2,"title":"约束说明","slug":"约束说明"},{"level":2,"title":"调用示例","slug":"调用示例"}],"relativePath":"api/SIMD-API/基础API/Memory矢量计算/比较与选择/SetCmpMask(ISASI).md","filePath":"api/SIMD-API/基础API/Memory矢量计算/比较与选择/SetCmpMask(ISASI).md"}'),p={name:"api/SIMD-API/基础API/Memory矢量计算/比较与选择/SetCmpMask(ISASI).md"};function l(i,s,c,r,o,d){return n(),t("div",null,[...s[0]||(s[0]=[e(`<h1 id="setcmpmask-isasi" tabindex="-1">SetCmpMask(ISASI) <a class="header-anchor" href="#setcmpmask-isasi" aria-label="Permalink to &quot;SetCmpMask\\(ISASI\\)&quot;">​</a></h1><h2 id="产品支持情况" tabindex="-1">产品支持情况 <a class="header-anchor" href="#产品支持情况" aria-label="Permalink to &quot;产品支持情况&quot;">​</a></h2><table tabindex="0"><thead><tr><th>产品</th><th>是否支持</th></tr></thead><tbody><tr><td>Ascend 950PR/Ascend 950DT</td><td>√</td></tr><tr><td>Atlas A3 训练系列产品/Atlas A3 推理系列产品</td><td>√</td></tr><tr><td>Atlas A2 训练系列产品/Atlas A2 推理系列产品</td><td>√</td></tr><tr><td>Atlas 200I/500 A2 推理产品</td><td>x</td></tr><tr><td>Atlas 推理系列产品AI Core</td><td>√</td></tr><tr><td>Atlas 推理系列产品Vector Core</td><td>x</td></tr><tr><td>Atlas 训练系列产品</td><td>x</td></tr></tbody></table><h2 id="功能说明" tabindex="-1">功能说明 <a class="header-anchor" href="#功能说明" aria-label="Permalink to &quot;功能说明&quot;">​</a></h2><p>为<a href="./Select.html">Select</a>不传入mask参数的接口设置比较寄存器。配合不同的selMode传入不同的数据。</p><ul><li><p>模式0（SELMODE::VSEL_CMPMASK_SPR）</p><p>SetCmpMask中传入selMask LocalTensor。</p></li><li><p>模式1（SELMODE::VSEL_TENSOR_SCALAR_MODE）</p><p>SetCmpMask中传入src1 LocalTensor。</p></li><li><p>模式2（SELMODE::VSEL_TENSOR_TENSOR_MODE）</p><p>SetCmpMask中传入LocalTensor，LocalTensor中存放的是selMask的地址。</p></li></ul><h2 id="函数原型" tabindex="-1">函数原型 <a class="header-anchor" href="#函数原型" aria-label="Permalink to &quot;函数原型&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>template &lt;typename T&gt;</span></span>
<span class="line"><span>__aicore__ inline void SetCmpMask(const LocalTensor&lt;T&gt;&amp; src)</span></span></code></pre></div><h2 id="参数说明" tabindex="-1">参数说明 <a class="header-anchor" href="#参数说明" aria-label="Permalink to &quot;参数说明&quot;">​</a></h2><p><strong>表 1</strong> 模板参数说明</p><table tabindex="0"><thead><tr><th>参数名</th><th>描述</th></tr></thead><tbody><tr><td>T</td><td>操作数的数据类型。</td></tr></tbody></table><p><strong>表 2</strong> 参数说明</p><table tabindex="0"><thead><tr><th>参数名</th><th>输入/输出</th><th>描述</th></tr></thead><tbody><tr><td>src</td><td>输入</td><td>类型为LocalTensor，支持的TPosition为VECIN/VECCALC/VECOUT。 LocalTensor的起始地址需要16字节对齐。</td></tr></tbody></table><h2 id="返回值说明" tabindex="-1">返回值说明 <a class="header-anchor" href="#返回值说明" aria-label="Permalink to &quot;返回值说明&quot;">​</a></h2><p>无</p><h2 id="约束说明" tabindex="-1">约束说明 <a class="header-anchor" href="#约束说明" aria-label="Permalink to &quot;约束说明&quot;">​</a></h2><p>无</p><h2 id="调用示例" tabindex="-1">调用示例 <a class="header-anchor" href="#调用示例" aria-label="Permalink to &quot;调用示例&quot;">​</a></h2><ul><li><p>当selMode为模式0或模式2时：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>uint32_t dataSize = 256;</span></span>
<span class="line"><span>uint32_t selDataSize = 8;</span></span>
<span class="line"><span>TPipe pipe;</span></span>
<span class="line"><span>TQue&lt;TPosition::VECIN, 1&gt; inQueueX;</span></span>
<span class="line"><span>TQue&lt;TPosition::VECIN, 1&gt; inQueueY;</span></span>
<span class="line"><span>TQue&lt;TPosition::VECIN, 1&gt; inQueueSel;</span></span>
<span class="line"><span>TQue&lt;TPosition::VECOUT, 1&gt; outQueue;</span></span>
<span class="line"><span>pipe.InitBuffer(inQueueX, 1, dataSize * sizeof(float));</span></span>
<span class="line"><span>pipe.InitBuffer(inQueueY, 1, dataSize * sizeof(float));</span></span>
<span class="line"><span>pipe.InitBuffer(inQueueSel, 1, selDataSize * sizeof(uint8_t));</span></span>
<span class="line"><span>pipe.InitBuffer(outQueue, 1, dataSize * sizeof(float));</span></span>
<span class="line"><span>AscendC::LocalTensor&lt;float&gt; dst = outQueue.AllocTensor&lt;float&gt;();</span></span>
<span class="line"><span>AscendC::LocalTensor&lt;uint8_t&gt; sel = inQueueSel.AllocTensor&lt;uint8_t&gt;();</span></span>
<span class="line"><span>AscendC::LocalTensor&lt;float&gt; src0 = inQueueX.AllocTensor&lt;float&gt;();</span></span>
<span class="line"><span>AscendC::LocalTensor&lt;float&gt; src1 = inQueueY.AllocTensor&lt;float&gt;();</span></span>
<span class="line"><span>uint8_t repeat = 4;</span></span>
<span class="line"><span>uint32_t mask = 64;</span></span>
<span class="line"><span>AscendC::BinaryRepeatParams repeatParams = { 1, 1, 1, 8, 8, 8 };</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// selMode为模式0（SELMODE::VSEL_CMPMASK_SPR）</span></span>
<span class="line"><span>AscendC::SetCmpMask(sel);</span></span>
<span class="line"><span>AscendC::PipeBarrier&lt;PIPE_V&gt;();</span></span>
<span class="line"><span>AscendC::SetVectorMask&lt;float&gt;(mask);</span></span>
<span class="line"><span>AscendC::Select&lt;float, AscendC::SELMODE::VSEL_CMPMASK_SPR&gt;(dst, src0, src1, repeat, repeatParams);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// selMode为模式2（SELMODE::VSEL_TENSOR_TENSOR_MODE）</span></span>
<span class="line"><span>AscendC::LocalTensor&lt;int32_t&gt; tempBuf;</span></span>
<span class="line"><span>#if defined(ASCENDC_CPU_DEBUG) &amp;&amp; (ASCENDC_CPU_DEBUG == 1)</span><span>  // cpu调试</span></span>
<span class="line"><span>tempBuf.ReinterpretCast&lt;int64_t&gt;().SetValue(0, reinterpret_cast&lt;int64_t&gt;(reinterpret_cast&lt;__ubuf__ int64_t*&gt;(sel.GetPhyAddr())));</span></span>
<span class="line"><span>event_t eventIdSToV = static_cast&lt;event_t&gt;(AscendC::GetTPipePtr()-&gt;FetchEventID(AscendC::HardEvent::S_V));</span></span>
<span class="line"><span>AscendC::SetFlag&lt;AscendC::HardEvent::S_V&gt;(eventIdSToV);</span></span>
<span class="line"><span>AscendC::WaitFlag&lt;AscendC::HardEvent::S_V&gt;(eventIdSToV);</span></span>
<span class="line"><span>#else</span><span> // npu调试</span></span>
<span class="line"><span>uint32_t selAddr = static_cast&lt;uint32_t&gt;(reinterpret_cast&lt;int64_t&gt;(reinterpret_cast&lt;__ubuf__ int64_t*&gt;(sel.GetPhyAddr())));</span></span>
<span class="line"><span>AscendC::SetVectorMask&lt;uint32_t&gt;(32);</span></span>
<span class="line"><span>AscendC::Duplicate&lt;uint32_t, false&gt;(tempBuf.ReinterpretCast&lt;uint32_t&gt;(), selAddr, AscendC::MASK_PLACEHOLDER, 1, 1, 8);</span></span>
<span class="line"><span>AscendC::PipeBarrier&lt;PIPE_V&gt;();</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span>AscendC::SetCmpMask&lt;int64_t&gt;(tempBuf.ReinterpretCast&lt;int64_t&gt;());</span></span>
<span class="line"><span>AscendC::PipeBarrier&lt;PIPE_V&gt;();</span></span>
<span class="line"><span>AscendC::SetVectorMask&lt;float&gt;(mask);</span></span>
<span class="line"><span>AscendC::Select&lt;float, AscendC::SELMODE::VSEL_TENSOR_TENSOR_MODE&gt;(dst, src0, src1, repeat, repeatParams);</span></span></code></pre></div></li><li><p>当selMode为模式1时：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>uint32_t dataSize = 256;</span></span>
<span class="line"><span>uint32_t selDataSize = 8;</span></span>
<span class="line"><span>TPipe pipe;</span></span>
<span class="line"><span>TQue&lt;TPosition::VECIN, 1&gt; inQueueX;</span></span>
<span class="line"><span>TQue&lt;TPosition::VECIN, 1&gt; inQueueY;</span></span>
<span class="line"><span>TQue&lt;TPosition::VECIN, 1&gt; inQueueSel;</span></span>
<span class="line"><span>TQue&lt;TPosition::VECOUT, 1&gt; outQueue;</span></span>
<span class="line"><span>pipe.InitBuffer(inQueueX, 1, dataSize * sizeof(float));</span></span>
<span class="line"><span>pipe.InitBuffer(inQueueY, 1, dataSize * sizeof(float));</span></span>
<span class="line"><span>pipe.InitBuffer(inQueueSel, 1, selDataSize * sizeof(uint8_t));</span></span>
<span class="line"><span>pipe.InitBuffer(outQueue, 1, dataSize * sizeof(float));</span></span>
<span class="line"><span>AscendC::LocalTensor&lt;float&gt; dst = outQueue.AllocTensor&lt;float&gt;();</span></span>
<span class="line"><span>AscendC::LocalTensor&lt;uint8_t&gt; sel = inQueueSel.AllocTensor&lt;uint8_t&gt;();</span></span>
<span class="line"><span>AscendC::LocalTensor&lt;float&gt; src0 = inQueueX.AllocTensor&lt;float&gt;();</span></span>
<span class="line"><span>AscendC::LocalTensor&lt;float&gt; tmpScalar = inQueueY.AllocTensor&lt;float&gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>uint8_t repeat = 4;</span></span>
<span class="line"><span>uint32_t mask = 64;</span></span>
<span class="line"><span>AscendC::BinaryRepeatParams repeatParams = { 1, 1, 1, 8, 8, 8 };</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// selMode为模式1（SELMODE::VSEL_TENSOR_SCALAR_MODE）</span></span>
<span class="line"><span>AscendC::SetVectorMask&lt;uint32_t&gt;(32);</span></span>
<span class="line"><span>AscendC::Duplicate&lt;float, false&gt;(tmpScalar, static_cast&lt;float&gt;(1.0), MASK_PLACEHOLDER, 1, 1, 8);</span></span>
<span class="line"><span>AscendC::PipeBarrier&lt;PIPE_V&gt;();</span></span>
<span class="line"><span>AscendC::SetCmpMask(tmpScalar);</span></span>
<span class="line"><span>AscendC::PipeBarrier&lt;PIPE_V&gt;();</span></span>
<span class="line"><span>AscendC::SetVectorMask&lt;float&gt;(mask);</span></span>
<span class="line"><span>AscendC::Select(dst, sel, src0, repeat, repeatParams);</span></span></code></pre></div></li></ul>`,19)])])}const _=a(p,[["render",l]]);export{S as __pageData,_ as default};
