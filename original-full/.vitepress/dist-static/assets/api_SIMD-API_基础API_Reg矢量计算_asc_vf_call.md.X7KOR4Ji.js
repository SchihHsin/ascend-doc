import{c as s,Q as n,j as e,m as t}from"./chunks/framework.DOi4mjdC.js";const u=JSON.parse('{"title":"asc_vf_call","description":"","frontmatter":{},"headers":[{"level":1,"title":"asc\\\\_vf\\\\_call","slug":"asc_vf_call"},{"level":2,"title":"产品支持情况","slug":"产品支持情况"},{"level":2,"title":"功能说明","slug":"功能说明"},{"level":2,"title":"函数原型","slug":"函数原型"},{"level":2,"title":"参数说明","slug":"参数说明"},{"level":2,"title":"返回值说明","slug":"返回值说明"},{"level":2,"title":"约束说明","slug":"约束说明"},{"level":2,"title":"调用示例","slug":"调用示例"}],"relativePath":"api/SIMD-API/基础API/Reg矢量计算/asc_vf_call.md","filePath":"api/SIMD-API/基础API/Reg矢量计算/asc_vf_call.md"}'),l={name:"api/SIMD-API/基础API/Reg矢量计算/asc_vf_call.md"};function p(d,a,i,c,r,o){return n(),e("div",null,[...a[0]||(a[0]=[t(`<h1 id="asc-vf-call" tabindex="-1">asc_vf_call <a class="header-anchor" href="#asc-vf-call" aria-label="Permalink to &quot;asc\\_vf\\_call&quot;">​</a></h1><h2 id="产品支持情况" tabindex="-1">产品支持情况 <a class="header-anchor" href="#产品支持情况" aria-label="Permalink to &quot;产品支持情况&quot;">​</a></h2><table tabindex="0"><thead><tr><th>产品</th><th>是否支持</th></tr></thead><tbody><tr><td>Ascend 950PR/Ascend 950DT</td><td>√</td></tr><tr><td>Atlas A3 训练系列产品/Atlas A3 推理系列产品</td><td>x</td></tr><tr><td>Atlas A2 训练系列产品/Atlas A2 推理系列产品</td><td>x</td></tr><tr><td>Atlas 200I/500 A2 推理产品</td><td>x</td></tr><tr><td>Atlas 推理系列产品AI Core</td><td>x</td></tr><tr><td>Atlas 推理系列产品Vector Core</td><td>x</td></tr><tr><td>Atlas 训练系列产品</td><td>x</td></tr></tbody></table><h2 id="功能说明" tabindex="-1">功能说明 <a class="header-anchor" href="#功能说明" aria-label="Permalink to &quot;功能说明&quot;">​</a></h2><p>在SIMD编程场景下使用。用于启动SIMD VF（Vector Function）子任务。</p><h2 id="函数原型" tabindex="-1">函数原型 <a class="header-anchor" href="#函数原型" aria-label="Permalink to &quot;函数原型&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>template &lt;auto funcPtr, typename... Args&gt;</span></span>
<span class="line"><span>__aicore__ inline void asc_vf_call(Args &amp;&amp;...args)</span></span></code></pre></div><h2 id="参数说明" tabindex="-1">参数说明 <a class="header-anchor" href="#参数说明" aria-label="Permalink to &quot;参数说明&quot;">​</a></h2><p><strong>表 1</strong> 模板参数说明</p><table tabindex="0"><thead><tr><th>参数名</th><th>描述</th></tr></thead><tbody><tr><td>funcPtr</td><td>用于指定SIMD入口核函数。</td></tr><tr><td>Args</td><td>定义可变参数，用于传递实参到SIMD入口核函数。</td></tr></tbody></table><p><strong>表 2</strong> 参数说明</p><table tabindex="0"><thead><tr><th>参数名</th><th>输入/输出</th><th>描述</th></tr></thead><tbody><tr><td>args</td><td>输入</td><td>可变参数，用于传递实参到SIMD入口核函数。</td></tr></tbody></table><h2 id="返回值说明" tabindex="-1">返回值说明 <a class="header-anchor" href="#返回值说明" aria-label="Permalink to &quot;返回值说明&quot;">​</a></h2><p>无</p><h2 id="约束说明" tabindex="-1">约束说明 <a class="header-anchor" href="#约束说明" aria-label="Permalink to &quot;约束说明&quot;">​</a></h2><ul><li>asc_vf_call启动SIMD VF子任务时，子任务函数不能是类的成员函数，推荐使用普通函数或类静态函数，且入口函数必须使用__simd_vf__修饰宏。</li><li>asc_vf_call启动SIMD VF子任务时，传递的参数只支持裸指针，常见基本数据类型。不支持传递结构体，数组等。</li></ul><h2 id="调用示例" tabindex="-1">调用示例 <a class="header-anchor" href="#调用示例" aria-label="Permalink to &quot;调用示例&quot;">​</a></h2><p>使用SIMD VF 函数对UB数据做加法计算。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// SIMD函数</span></span>
<span class="line"><span>template &lt;typename T&gt;</span></span>
<span class="line"><span>__simd_vf__ inline void AddVF(</span></span>
<span class="line"><span>    __ubuf__ T* dstAddr, __ubuf__ T* src0Addr, __ubuf__ T* src1Addr, uint32_t count, uint32_t oneRepeatSize, uint16_t repeatTimes)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    AscendC::Reg::RegTensor&lt;T&gt; src0Reg;</span></span>
<span class="line"><span>    AscendC::Reg::RegTensor&lt;T&gt; src1Reg;</span></span>
<span class="line"><span>    AscendC::Reg::RegTensor&lt;T&gt; dstReg;</span></span>
<span class="line"><span>    AscendC::Reg::MaskReg mask;</span></span>
<span class="line"><span>    for (uint16_t i = 0; i &lt; repeatTimes; i++) {</span></span>
<span class="line"><span>        mask = AscendC::Reg::UpdateMask&lt;T&gt;(count);</span></span>
<span class="line"><span>        AscendC::Reg::LoadAlign(src0Reg, src0Addr + i * oneRepeatSize);</span></span>
<span class="line"><span>        AscendC::Reg::LoadAlign(src1Reg, src1Addr + i * oneRepeatSize);</span></span>
<span class="line"><span>        AscendC::Reg::Add(dstReg, src0Reg, src1Reg, mask);</span></span>
<span class="line"><span>        AscendC::Reg::StoreAlign(dstAddr + i * oneRepeatSize, dstReg, mask);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>template &lt;typename T&gt;</span></span>
<span class="line"><span>__aicore__ inline void Compute()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    AscendC::LocalTensor&lt;T&gt; dst = outQueueZ.AllocTensor&lt;T&gt;();</span></span>
<span class="line"><span>    AscendC::LocalTensor&lt;T&gt; src0 = inQueueX.DeQue&lt;T&gt;();</span></span>
<span class="line"><span>    AscendC::LocalTensor&lt;T&gt; src1 = inQueueY.DeQue&lt;T&gt;();</span></span>
<span class="line"><span>    constexpr uint32_t oneRepeatSize = AscendC::GetVecLen() / sizeof(T);</span></span>
<span class="line"><span>    uint32_t count = 512;</span></span>
<span class="line"><span>    // 向上取整，计算循环次数</span></span>
<span class="line"><span>    uint16_t repeatTimes = AscendC::CeilDivision(count, oneRepeatSize);</span></span>
<span class="line"><span>    __ubuf__ T* dstAddr = (__ubuf__ T*)dst.GetPhyAddr();</span></span>
<span class="line"><span>    __ubuf__ T* src0Addr = (__ubuf__ T*)src0.GetPhyAddr();</span></span>
<span class="line"><span>    __ubuf__ T* src1Addr = (__ubuf__ T*)src1.GetPhyAddr();</span></span>
<span class="line"><span>    asc_vf_call&lt;AddVF&lt;T&gt;&gt;(dstAddr, src0Addr, src1Addr, count, oneRepeatSize, repeatTimes);</span></span>
<span class="line"><span>    outQueueZ.EnQue(dst);</span></span>
<span class="line"><span>    inQueueX.FreeTensor(src0);</span></span>
<span class="line"><span>    inQueueY.FreeTensor(src1);</span></span>
<span class="line"><span>}</span></span></code></pre></div>`,19)])])}const h=s(l,[["render",p]]);export{u as __pageData,h as default};
