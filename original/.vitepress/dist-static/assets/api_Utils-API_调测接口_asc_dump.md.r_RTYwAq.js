import{c as s,Q as n,j as t,m as e}from"./chunks/framework.DOi4mjdC.js";const o=JSON.parse('{"title":"asc_dump","description":"","frontmatter":{},"headers":[{"level":1,"title":"asc\\\\_dump","slug":"asc_dump"},{"level":2,"title":"产品支持情况","slug":"产品支持情况"},{"level":2,"title":"功能说明","slug":"功能说明"},{"level":2,"title":"函数原型","slug":"函数原型"},{"level":2,"title":"参数说明","slug":"参数说明"},{"level":2,"title":"返回值说明","slug":"返回值说明"},{"level":2,"title":"约束说明","slug":"约束说明"},{"level":2,"title":"调用示例","slug":"调用示例"}],"relativePath":"api/Utils-API/调测接口/asc_dump.md","filePath":"api/Utils-API/调测接口/asc_dump.md"}'),p={name:"api/Utils-API/调测接口/asc_dump.md"};function l(i,a,d,c,_,u){return n(),t("div",null,[...a[0]||(a[0]=[e(`<h1 id="asc-dump" tabindex="-1">asc_dump <a class="header-anchor" href="#asc-dump" aria-label="Permalink to &quot;asc\\_dump&quot;">​</a></h1><h2 id="产品支持情况" tabindex="-1">产品支持情况 <a class="header-anchor" href="#产品支持情况" aria-label="Permalink to &quot;产品支持情况&quot;">​</a></h2><table tabindex="0"><thead><tr><th>产品</th><th>是否支持</th></tr></thead><tbody><tr><td>Ascend 950PR/Ascend 950DT</td><td>√</td></tr><tr><td>Atlas A3 训练系列产品/Atlas A3 推理系列产品</td><td>√</td></tr><tr><td>Atlas A2 训练系列产品/Atlas A2 推理系列产品</td><td>√</td></tr><tr><td>Atlas 200I/500 A2 推理产品</td><td>x</td></tr><tr><td>Atlas 推理系列产品AI Core</td><td>x</td></tr><tr><td>Atlas 推理系列产品Vector Core</td><td>x</td></tr><tr><td>Atlas 训练系列产品</td><td>x</td></tr></tbody></table><h2 id="功能说明" tabindex="-1">功能说明 <a class="header-anchor" href="#功能说明" aria-label="Permalink to &quot;功能说明&quot;">​</a></h2><p>将对应内存上的数据打印出来，同时支持打印自定义的附加信息（仅支持uint32_t类型的信息），比如打印当前行号等。</p><p>使用该接口需要包含&quot;utils/debug/asc_dump.h&quot;头文件。</p><div class="caution custom-block github-alert"><p class="custom-block-title">注意</p><p>该功能主要用于<strong>调试和性能分析</strong>，开启后会对算子性能产生一定影响，通常在调测阶段使用，<strong>生产环境建议关闭</strong>。 默认情况下，该功能关闭，开发者需要在kernel核函数外定义如下宏定义:&quot;#define ASCENDC_DUMP 1&quot;，以开启dump功能。</p></div><h2 id="函数原型" tabindex="-1">函数原型 <a class="header-anchor" href="#函数原型" aria-label="Permalink to &quot;函数原型&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// GM内存上的数据打印</span></span>
<span class="line"><span>template&lt;typename T&gt;</span></span>
<span class="line"><span>__aicore__ inline void asc_dump_gm(__gm__ T* input, uint32_t desc, uint32_t dump_size)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// UB内存上的数据打印</span></span>
<span class="line"><span>template&lt;typename T&gt;</span></span>
<span class="line"><span>__aicore__ inline void asc_dump_ubuf(__ubuf__ T* input, uint32_t desc, uint32_t dump_size)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// L1内存上的数据打印</span></span>
<span class="line"><span>template&lt;typename T&gt;</span></span>
<span class="line"><span>__aicore__ inline void asc_dump_l1buf(__cbuf__ T* input, uint32_t desc, uint32_t dump_size)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// L0C内存上的数据打印</span></span>
<span class="line"><span>template&lt;typename T&gt;</span></span>
<span class="line"><span>__aicore__ inline void asc_dump_cbuf(__cc__ T* input, uint32_t desc, uint32_t dump_size)</span></span></code></pre></div><p>以下接口为simd_vf中所使用的asc_dump接口，仅支持Ascend 950PR/Ascend 950DT。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 寄存器上的数据打印</span></span>
<span class="line"><span>template &lt;typename T, typename U&gt;</span></span>
<span class="line"><span>__simd_callee__ inline void asc_dump_reg(U&amp; input, uint32_t desc, uint32_t dump_size)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 寄存器上的数据打印</span></span>
<span class="line"><span>template &lt;typename T, typename U&gt;</span></span>
<span class="line"><span>__simd_callee__ inline void asc_dump(U&amp; input, uint32_t desc, uint32_t dump_size)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// UB内存上的数据打印</span></span>
<span class="line"><span>template &lt;typename T&gt;</span></span>
<span class="line"><span>__simd_callee__ inline void asc_dump_ubuf(__ubuf__ T* input, uint32_t desc, uint32_t dump_size)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// UB内存上的数据打印</span></span>
<span class="line"><span>template &lt;typename T&gt;</span></span>
<span class="line"><span>__simd_callee__ inline void asc_dump(__ubuf__ T* input, uint32_t desc, uint32_t dump_size)</span></span></code></pre></div><h2 id="参数说明" tabindex="-1">参数说明 <a class="header-anchor" href="#参数说明" aria-label="Permalink to &quot;参数说明&quot;">​</a></h2><table tabindex="0"><thead><tr><th>参数名</th><th>输入/输出</th><th>描述</th></tr></thead><tbody><tr><td>T</td><td>输入</td><td>待dump的数据类型。</td></tr><tr><td>U</td><td>输入</td><td>待dump的寄存器数据类型。</td></tr><tr><td>input</td><td>输入</td><td>所需打印的内存块的起始地址。</td></tr><tr><td>desc</td><td>输入</td><td>自定义信息。uint32_t类型，支持的数据范围是[0, 2^32 - 1]。</td></tr><tr><td>dump_size</td><td>输入</td><td>所需要打印的元素数量。</td></tr></tbody></table><h2 id="返回值说明" tabindex="-1">返回值说明 <a class="header-anchor" href="#返回值说明" aria-label="Permalink to &quot;返回值说明&quot;">​</a></h2><p>无</p><h2 id="约束说明" tabindex="-1">约束说明 <a class="header-anchor" href="#约束说明" aria-label="Permalink to &quot;约束说明&quot;">​</a></h2><ul><li><p>Ascend 950PR/Ascend 950DT暂时不支持L1上的内存打印。</p></li><li><p>使用该接口时，在每个核上dump的数据总量不能超过1M，请开发者自行控制打印的内容数据量，超出则不会打印。</p></li><li><p>在计算数据量时，若dump的总长度未对齐，需要考虑padding数据的影响。当进行非对齐dump时，如果实际dump的元素长度不满足32字节对齐。 系统会自动在其末尾补充一定数量的padding数据，以满足对其要求。</p></li><li><p>如果要正常使用dump功能，需要在kernel核函数外定义如下宏定义：&quot;#define ASCENDC_DUMP 1&quot;。</p></li></ul><h2 id="调用示例" tabindex="-1">调用示例 <a class="header-anchor" href="#调用示例" aria-label="Permalink to &quot;调用示例&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>__gm__ half* src;</span></span>
<span class="line"><span>uint32_t desc = 1;</span></span>
<span class="line"><span>uint32_t dump_size = 32;</span></span>
<span class="line"><span>asc_dump_gm&lt;half&gt;(src, desc, dump_size);</span></span></code></pre></div><p>SIMD VF调用示例：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>__simd_vf__ inline void SimdVfDumpReg()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    AscendC::Reg::RegTensor&lt;float&gt; src_reg;</span></span>
<span class="line"><span>    uint32_t desc = 1;</span></span>
<span class="line"><span>    uint32_t dump_size = 32;;</span></span>
<span class="line"><span>    asc_dump&lt;float&gt;(src_reg, desc, dump_size);</span></span>
<span class="line"><span>}</span></span></code></pre></div>`,21)])])}const m=s(p,[["render",l]]);export{o as __pageData,m as default};
