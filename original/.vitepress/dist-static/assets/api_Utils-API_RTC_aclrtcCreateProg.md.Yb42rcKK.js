import{c as t,Q as s,j as n,m as e}from"./chunks/framework.DOi4mjdC.js";const u=JSON.parse('{"title":"aclrtcCreateProg","description":"","frontmatter":{},"headers":[{"level":1,"title":"aclrtcCreateProg","slug":"aclrtccreateprog"},{"level":2,"title":"产品支持情况","slug":"产品支持情况"},{"level":2,"title":"功能说明","slug":"功能说明"},{"level":2,"title":"函数原型","slug":"函数原型"},{"level":2,"title":"参数说明","slug":"参数说明"},{"level":2,"title":"返回值说明","slug":"返回值说明"},{"level":2,"title":"约束说明","slug":"约束说明"},{"level":2,"title":"调用示例","slug":"调用示例"}],"relativePath":"api/Utils-API/RTC/aclrtcCreateProg.md","filePath":"api/Utils-API/RTC/aclrtcCreateProg.md"}'),l={name:"api/Utils-API/RTC/aclrtcCreateProg.md"};function r(p,a,c,d,o,i){return s(),n("div",null,[...a[0]||(a[0]=[e(`<h1 id="aclrtccreateprog" tabindex="-1">aclrtcCreateProg <a class="header-anchor" href="#aclrtccreateprog" aria-label="Permalink to &quot;aclrtcCreateProg&quot;">​</a></h1><h2 id="产品支持情况" tabindex="-1">产品支持情况 <a class="header-anchor" href="#产品支持情况" aria-label="Permalink to &quot;产品支持情况&quot;">​</a></h2><table tabindex="0"><thead><tr><th>产品</th><th>是否支持</th></tr></thead><tbody><tr><td>Ascend 950PR/Ascend 950DT</td><td>√</td></tr><tr><td>Atlas A3 训练系列产品/Atlas A3 推理系列产品</td><td>√</td></tr><tr><td>Atlas A2 训练系列产品/Atlas A2 推理系列产品</td><td>√</td></tr><tr><td>Atlas 200I/500 A2 推理产品</td><td>x</td></tr><tr><td>Atlas 推理系列产品AI Core</td><td>x</td></tr><tr><td>Atlas 推理系列产品Vector Core</td><td>x</td></tr><tr><td>Atlas 训练系列产品</td><td>x</td></tr></tbody></table><h2 id="功能说明" tabindex="-1">功能说明 <a class="header-anchor" href="#功能说明" aria-label="Permalink to &quot;功能说明&quot;">​</a></h2><p>通过给定的参数，创建编译程序的实例。</p><h2 id="函数原型" tabindex="-1">函数原型 <a class="header-anchor" href="#函数原型" aria-label="Permalink to &quot;函数原型&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>aclError aclrtcCreateProg(aclrtcProg *prog, const char *src, const char *name, int numHeaders, const char **headers, const char **includeNames)</span></span></code></pre></div><h2 id="参数说明" tabindex="-1">参数说明 <a class="header-anchor" href="#参数说明" aria-label="Permalink to &quot;参数说明&quot;">​</a></h2><p><strong>表 1</strong> 接口参数说明</p><table tabindex="0"><thead><tr><th>参数名</th><th>输入/输出</th><th>描述</th></tr></thead><tbody><tr><td>prog</td><td>输出</td><td>运行时编译程序的句柄。</td></tr><tr><td>src</td><td>输入</td><td>以字符串形式提供的Ascend C Device侧源代码内容。</td></tr><tr><td>name</td><td>输入</td><td>用户自定义的程序名称，用于标识和区分不同的编译程序，默认值为&quot;default_program&quot;。</td></tr><tr><td>numHeaders</td><td>输入</td><td>指定要包含的头文件数量，必须为非负整数。 无需包含头文件或者Ascend C Device侧源代码中已包含所需头文件时，此参数需设置为0。</td></tr><tr><td>headers</td><td>输入</td><td>一个指向数组的指针，数组中的每个元素都是以&#39;\\0&#39;结尾的字符串，表示头文件的源代码内容。当numHeaders为0时，此参数可以设置为nullptr。</td></tr><tr><td>includeNames</td><td>输入</td><td>一个指向数组的指针，数组中的每个元素都是以&#39;\\0&#39;结尾的字符串，表示头文件的名称。 这些名称必须与源代码中#include指令中包含的头文件名称完全一致。</td></tr></tbody></table><h2 id="返回值说明" tabindex="-1">返回值说明 <a class="header-anchor" href="#返回值说明" aria-label="Permalink to &quot;返回值说明&quot;">​</a></h2><p>aclError为int类型变量，详细说明请参考<a href="./RTC错误码.html">RTC错误码</a>。</p><h2 id="约束说明" tabindex="-1">约束说明 <a class="header-anchor" href="#约束说明" aria-label="Permalink to &quot;约束说明&quot;">​</a></h2><p>无</p><h2 id="调用示例" tabindex="-1">调用示例 <a class="header-anchor" href="#调用示例" aria-label="Permalink to &quot;调用示例&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>aclrtcProg prog;</span></span>
<span class="line"><span>const char *src = R&quot;&quot;&quot;&quot;(</span></span>
<span class="line"><span>#include &quot;kernel_operator.h&quot;</span></span>
<span class="line"><span>#include &quot;my_const_a.h&quot;</span></span>
<span class="line"><span>#include &quot;my_const_b.h&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>extern &quot;C&quot; __global__ __aicore__ void hello_world(GM_ADDR x)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>	KERNEL_TASK_TYPE_DEFAULT(KERNEL_TYPE_AIC_ONLY);</span></span>
<span class="line"><span>	*x = *x + MY_CONST_A + MY_CONST_B;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>)&quot;&quot;&quot;&quot;;</span></span>
<span class="line"><span>const char* headerSrcA = R&quot;(</span></span>
<span class="line"><span>#ifndef CONST_A_H</span></span>
<span class="line"><span>#define CONST_A_H</span></span>
<span class="line"><span>const int MY_CONST_A = 100;</span></span>
<span class="line"><span>#endif</span><span> // CONST_A_H</span></span>
<span class="line"><span>)&quot;;</span></span>
<span class="line"><span>const char* includeNameA = &quot;my_const_a.h&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const char* headerSrcB = R&quot;(</span></span>
<span class="line"><span>#ifndef CONST_B_H</span></span>
<span class="line"><span>#define CONST_B_H</span></span>
<span class="line"><span>const int MY_CONST_B = 50;</span></span>
<span class="line"><span>#endif</span><span> // CONST_B_H</span></span>
<span class="line"><span>)&quot;;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const char* includeNameB = &quot;my_const_b.h&quot;;</span></span>
<span class="line"><span>const char* headersArray[] = { headerSrcA, headerSrcB };</span></span>
<span class="line"><span>const char* includeNameArray[] = { includeNameA, includeNameB };</span></span>
<span class="line"><span>aclError result = aclrtcCreateProg(&amp;prog, src, &quot;hello_world&quot;, 2,  headersArray,  includeNameArray);</span></span></code></pre></div>`,16)])])}const _=t(l,[["render",r]]);export{u as __pageData,_ as default};
