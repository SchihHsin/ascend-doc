import{c as s,Q as n,j as t,m as e}from"./chunks/framework.DOi4mjdC.js";const A=JSON.parse('{"title":"SetAtomicMin(ISASI)","description":"","frontmatter":{},"headers":[{"level":1,"title":"SetAtomicMin\\\\(ISASI\\\\)","slug":"setatomicminisasi"},{"level":2,"title":"产品支持情况","slug":"产品支持情况"},{"level":2,"title":"功能说明","slug":"功能说明"},{"level":2,"title":"函数原型","slug":"函数原型"},{"level":2,"title":"参数说明","slug":"参数说明"},{"level":2,"title":"返回值说明","slug":"返回值说明"},{"level":2,"title":"约束说明","slug":"约束说明"},{"level":2,"title":"调用示例","slug":"调用示例"}],"relativePath":"api/SIMD-API/基础API/原子操作/SetAtomicMin(ISASI).md","filePath":"api/SIMD-API/基础API/原子操作/SetAtomicMin(ISASI).md"}'),l={name:"api/SIMD-API/基础API/原子操作/SetAtomicMin(ISASI).md"};function i(p,a,c,o,r,d){return n(),t("div",null,[...a[0]||(a[0]=[e(`<h1 id="setatomicmin-isasi" tabindex="-1">SetAtomicMin(ISASI) <a class="header-anchor" href="#setatomicmin-isasi" aria-label="Permalink to &quot;SetAtomicMin\\(ISASI\\)&quot;">​</a></h1><h2 id="产品支持情况" tabindex="-1">产品支持情况 <a class="header-anchor" href="#产品支持情况" aria-label="Permalink to &quot;产品支持情况&quot;">​</a></h2><table tabindex="0"><thead><tr><th>产品</th><th>是否支持</th></tr></thead><tbody><tr><td>Ascend 950PR/Ascend 950DT</td><td>√</td></tr><tr><td>Atlas A3 训练系列产品/Atlas A3 推理系列产品</td><td>√</td></tr><tr><td>Atlas A2 训练系列产品/Atlas A2 推理系列产品</td><td>√</td></tr><tr><td>Atlas 200I/500 A2 推理产品</td><td>x</td></tr><tr><td>Atlas 推理系列产品AI Core</td><td>x</td></tr><tr><td>Atlas 推理系列产品Vector Core</td><td>x</td></tr><tr><td>Atlas 训练系列产品</td><td>x</td></tr></tbody></table><h2 id="功能说明" tabindex="-1">功能说明 <a class="header-anchor" href="#功能说明" aria-label="Permalink to &quot;功能说明&quot;">​</a></h2><p>原子操作函数，设置后续从VECOUT传输到GM的数据是否执行原子比较，将待拷贝的内容和GM已有内容进行比较，将最小值写入GM。</p><p>可通过设置模板参数来设定不同的数据类型。</p><h2 id="函数原型" tabindex="-1">函数原型 <a class="header-anchor" href="#函数原型" aria-label="Permalink to &quot;函数原型&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>template &lt;typename T&gt;</span></span>
<span class="line"><span>__aicore__ inline void SetAtomicMin()</span></span></code></pre></div><h2 id="参数说明" tabindex="-1">参数说明 <a class="header-anchor" href="#参数说明" aria-label="Permalink to &quot;参数说明&quot;">​</a></h2><p><strong>表 1</strong> 模板参数说明</p><table tabindex="0"><thead><tr><th>参数名</th><th>描述</th></tr></thead><tbody><tr><td>T</td><td>设定不同的数据类型。 Atlas A2 训练系列产品/Atlas A2 推理系列产品，支持int8_t/int16_t/half/bfloat16_t/int32_t/float。 Atlas A3 训练系列产品/Atlas A3 推理系列产品，支持int8_t/int16_t/half/bfloat16_t/int32_t/float。 Ascend 950PR/Ascend 950DT，支持int8_t/int16_t/half/bfloat16_t/int32_t/float。</td></tr></tbody></table><h2 id="返回值说明" tabindex="-1">返回值说明 <a class="header-anchor" href="#返回值说明" aria-label="Permalink to &quot;返回值说明&quot;">​</a></h2><p>无</p><h2 id="约束说明" tabindex="-1">约束说明 <a class="header-anchor" href="#约束说明" aria-label="Permalink to &quot;约束说明&quot;">​</a></h2><p>使用完后，建议通过<a href="./DisableDmaAtomic.html">DisableDmaAtomic</a>关闭原子最小操作，以免影响后续相关指令功能。</p><h2 id="调用示例" tabindex="-1">调用示例 <a class="header-anchor" href="#调用示例" aria-label="Permalink to &quot;调用示例&quot;">​</a></h2><p>完整使用样例请参见<a href="https://gitcode.com/cann/asc-devkit/tree/master/examples/01_simd_cpp_api/02_features/03_basic_api/08_atomic_operations/data_movement_with_atomic_operations" target="_blank" rel="noreferrer">DataMovementWithAtomicOperations样例</a>。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &quot;kernel_operator.h&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>uint32_t size = 256;</span></span>
<span class="line"><span>constexpr uint32_t SIZE = 256;</span></span>
<span class="line"><span>__aicore__ inline void CopyIn()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    AscendC::LocalTensor&lt;T&gt; srcLocal = queueSrc.AllocTensor&lt;T&gt;();</span></span>
<span class="line"><span>    // 清空原子操作的状态</span></span>
<span class="line"><span>    AscendC::DisableDmaAtomic();</span></span>
<span class="line"><span>    AscendC::DataCopy(srcLocal, srcGlobal, SIZE);</span></span>
<span class="line"><span>    queueSrc.EnQue(srcLocal);</span></span>
<span class="line"><span>    // 核间同步</span></span>
<span class="line"><span>    AscendC::SyncAll();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>__aicore__ inline void CopyOut()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    AscendC::LocalTensor&lt;T&gt; srcLocal = queueSrc.DeQue&lt;T&gt;();</span></span>
<span class="line"><span>    // 开启原子MIN模式，3个核取最小值</span></span>
<span class="line"><span>    AscendC::SetAtomicMin&lt;T&gt;();</span></span>
<span class="line"><span>    AscendC::DataCopy(dstGlobal, srcLocal, SIZE);</span></span>
<span class="line"><span>    // 关闭原子操作</span></span>
<span class="line"><span>    AscendC::DisableDmaAtomic();</span></span>
<span class="line"><span>    queueSrc.FreeTensor(srcLocal);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>每个核的输入数据为: </span></span>
<span class="line"><span>Src0: [1,1,1,1,1,...,1] // 256个1</span></span>
<span class="line"><span>Src1: [2,2,2,2,2,...,2] // 256个2</span></span>
<span class="line"><span>最终输出数据: [1,1,1,1,1,...,1] // 256个1</span></span></code></pre></div>`,18)])])}const _=s(l,[["render",i]]);export{A as __pageData,_ as default};
