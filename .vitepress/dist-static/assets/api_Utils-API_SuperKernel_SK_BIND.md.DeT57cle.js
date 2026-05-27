import{c as s,Q as n,j as t,m as e}from"./chunks/framework.DOi4mjdC.js";const u=JSON.parse('{"title":"SK_BIND","description":"","frontmatter":{},"headers":[{"level":1,"title":"SK\\\\_BIND","slug":"sk_bind"},{"level":2,"title":"产品支持情况","slug":"产品支持情况"},{"level":2,"title":"功能说明","slug":"功能说明"},{"level":2,"title":"函数原型","slug":"函数原型"},{"level":2,"title":"参数说明","slug":"参数说明"},{"level":2,"title":"返回值说明","slug":"返回值说明"},{"level":2,"title":"约束说明","slug":"约束说明"},{"level":2,"title":"需要包含的头文件","slug":"需要包含的头文件"},{"level":2,"title":"调用示例","slug":"调用示例"}],"relativePath":"api/Utils-API/SuperKernel/SK_BIND.md","filePath":"api/Utils-API/SuperKernel/SK_BIND.md"}'),l={name:"api/Utils-API/SuperKernel/SK_BIND.md"};function p(d,a,i,r,o,c){return n(),t("div",null,[...a[0]||(a[0]=[e(`<h1 id="sk-bind" tabindex="-1">SK_BIND <a class="header-anchor" href="#sk-bind" aria-label="Permalink to &quot;SK\\_BIND&quot;">​</a></h1><h2 id="产品支持情况" tabindex="-1">产品支持情况 <a class="header-anchor" href="#产品支持情况" aria-label="Permalink to &quot;产品支持情况&quot;">​</a></h2><table tabindex="0"><thead><tr><th>产品</th><th>是否支持</th></tr></thead><tbody><tr><td>Ascend 950PR/Ascend 950DT</td><td>x</td></tr><tr><td>Atlas A3 训练系列产品/Atlas A3 推理系列产品</td><td>√</td></tr><tr><td>Atlas A2 训练系列产品/Atlas A2 推理系列产品</td><td>√</td></tr><tr><td>Atlas 200I/500 A2 推理产品</td><td>x</td></tr><tr><td>Atlas 推理系列产品AI Core</td><td>x</td></tr><tr><td>Atlas 推理系列产品Vector Core</td><td>x</td></tr><tr><td>Atlas 训练系列产品</td><td>x</td></tr><tr><td>Kirin X90</td><td>x</td></tr><tr><td>Kirin 9030</td><td>x</td></tr></tbody></table><h2 id="功能说明" tabindex="-1">功能说明 <a class="header-anchor" href="#功能说明" aria-label="Permalink to &quot;功能说明&quot;">​</a></h2><p>本接口为算子Superkernel场景提供绑定原核函数和SK子函数的能力。</p><h2 id="函数原型" tabindex="-1">函数原型 <a class="header-anchor" href="#函数原型" aria-label="Permalink to &quot;函数原型&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// GF, cap, SK0, ...</span></span>
<span class="line"><span>#define SK_BIND(...)</span></span></code></pre></div><h2 id="参数说明" tabindex="-1">参数说明 <a class="header-anchor" href="#参数说明" aria-label="Permalink to &quot;参数说明&quot;">​</a></h2><table tabindex="0"><thead><tr><th>参数名</th><th>输入/输出</th><th>描述</th></tr></thead><tbody><tr><td>GF</td><td>输入</td><td>核函数函数签名。</td></tr><tr><td>cap</td><td>输入</td><td>预留参数，当前不使能。 SuperKernel相关特性的掩码。 4 表示 DCCI（默认值，建议使用）2 表示 early start set flag1 表示 early start wait flag</td></tr><tr><td>SK0</td><td>输入</td><td>SK子函数签名。</td></tr><tr><td>...</td><td>输入</td><td>SK1~SK3 可提供多个SK子函数签名，包含SK0最多四个函数签名。</td></tr></tbody></table><h2 id="返回值说明" tabindex="-1">返回值说明 <a class="header-anchor" href="#返回值说明" aria-label="Permalink to &quot;返回值说明&quot;">​</a></h2><p>无</p><h2 id="约束说明" tabindex="-1">约束说明 <a class="header-anchor" href="#约束说明" aria-label="Permalink to &quot;约束说明&quot;">​</a></h2><ul><li>一个核函数最多绑定四个SK子函数。</li></ul><h2 id="需要包含的头文件" tabindex="-1">需要包含的头文件 <a class="header-anchor" href="#需要包含的头文件" aria-label="Permalink to &quot;需要包含的头文件&quot;">​</a></h2><p>使用该接口需要包含&quot;kernel_operator.h&quot;头文件。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &quot;kernel_operator.h&quot;</span></span></code></pre></div><h2 id="调用示例" tabindex="-1">调用示例 <a class="header-anchor" href="#调用示例" aria-label="Permalink to &quot;调用示例&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &quot;kernel_operator.h&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 原普通 kernel 保留（用于非 SuperKernel 场景）</span></span>
<span class="line"><span>__global__ __vector__ void add_custom(GM_ADDR x, GM_ADDR y, GM_ADDR z, uint32_t totalLength) </span></span>
<span class="line"><span>{ </span></span>
<span class="line"><span>    KernelAdd op; </span></span>
<span class="line"><span>    op.Init(x, y, z, totalLength); </span></span>
<span class="line"><span>    op.Process(); </span></span>
<span class="line"><span>} </span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 规则3：定义参数结构体（根据原 global 函数的实际参数定义）</span></span>
<span class="line"><span>struct GmmArgs { </span></span>
<span class="line"><span>   GM_ADDR x;                      // 对应 add_custom 的第一个参数 </span></span>
<span class="line"><span>   GM_ADDR y;                      // 对应 add_custom 的第二个参数 </span></span>
<span class="line"><span>   GM_ADDR z;                      // 对应 add_custom 的第三个参数 </span></span>
<span class="line"><span>   uint32_t totalLength;           // 对应 add_custom 的第四个参数</span></span>
<span class="line"><span>};  </span></span>
<span class="line"><span>// 定义一个带模板参数的 SK 子函数</span></span>
<span class="line"><span>// 模板参数仅用于实例化出不同的符号，不影响函数逻辑</span></span>
<span class="line"><span>template&lt;uint32_t splitNum&gt;</span></span>
<span class="line"><span>__sk__ __vector__ void add_custom_sk(const GmmArgs *args, sk::SkSystemArgs *sysArgs/* 可选添加 sysArgs 参数*/)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    // 从结构体中获取参数</span></span>
<span class="line"><span>    GM_ADDR x = args-&gt;x;</span></span>
<span class="line"><span>    GM_ADDR y = args-&gt;y; </span></span>
<span class="line"><span>    GM_ADDR z = args-&gt;z; </span></span>
<span class="line"><span>    uint32_t totalLength = args-&gt;totalLength; </span></span>
<span class="line"><span>    // 规则5：逻辑与 global 函数一致</span></span>
<span class="line"><span>    KernelAdd op;</span></span>
<span class="line"><span>    op.Init(x, y, z, totalLength);</span></span>
<span class="line"><span>    op.Process();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 规则6：使用 SK_BIND 绑定</span></span>
<span class="line"><span>// 通过指定模板参数实例化出 4 个不同的符号</span></span>
<span class="line"><span></span></span>
<span class="line"><span>SK_BIND(add_custom, 4, add_custom_sk&lt;0&gt;, add_custom_sk&lt;1&gt;, add_custom_sk&lt;2&gt;, add_custom_sk&lt;3&gt;);</span></span></code></pre></div>`,18)])])}const _=s(l,[["render",p]]);export{u as __pageData,_ as default};
