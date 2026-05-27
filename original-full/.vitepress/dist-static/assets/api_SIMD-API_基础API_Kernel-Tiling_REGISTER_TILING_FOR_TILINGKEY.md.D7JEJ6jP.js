import{c as n,Q as s,j as i,m as t}from"./chunks/framework.DOi4mjdC.js";const _=JSON.parse('{"title":"REGISTER_TILING_FOR_TILINGKEY","description":"","frontmatter":{},"headers":[{"level":1,"title":"REGISTER\\\\_TILING\\\\_FOR\\\\_TILINGKEY","slug":"register_tiling_for_tilingkey"},{"level":2,"title":"产品支持情况","slug":"产品支持情况"},{"level":2,"title":"功能说明","slug":"功能说明"},{"level":2,"title":"函数原型","slug":"函数原型"},{"level":2,"title":"参数说明","slug":"参数说明"},{"level":2,"title":"约束说明","slug":"约束说明"},{"level":2,"title":"调用示例","slug":"调用示例"}],"relativePath":"api/SIMD-API/基础API/Kernel-Tiling/REGISTER_TILING_FOR_TILINGKEY.md","filePath":"api/SIMD-API/基础API/Kernel-Tiling/REGISTER_TILING_FOR_TILINGKEY.md"}'),l={name:"api/SIMD-API/基础API/Kernel-Tiling/REGISTER_TILING_FOR_TILINGKEY.md"};function p(e,a,g,c,T,d){return s(),i("div",null,[...a[0]||(a[0]=[t(`<h1 id="register-tiling-for-tilingkey" tabindex="-1">REGISTER_TILING_FOR_TILINGKEY <a class="header-anchor" href="#register-tiling-for-tilingkey" aria-label="Permalink to &quot;REGISTER\\_TILING\\_FOR\\_TILINGKEY&quot;">​</a></h1><h2 id="产品支持情况" tabindex="-1">产品支持情况 <a class="header-anchor" href="#产品支持情况" aria-label="Permalink to &quot;产品支持情况&quot;">​</a></h2><table tabindex="0"><thead><tr><th>产品</th><th>是否支持</th></tr></thead><tbody><tr><td>Ascend 950PR/Ascend 950DT</td><td>√</td></tr><tr><td>Atlas A3 训练系列产品/Atlas A3 推理系列产品</td><td>√</td></tr><tr><td>Atlas A2 训练系列产品/Atlas A2 推理系列产品</td><td>√</td></tr><tr><td>Atlas 200I/500 A2 推理产品</td><td>√</td></tr><tr><td>Atlas 推理系列产品AI Core</td><td>√</td></tr><tr><td>Atlas 推理系列产品Vector Core</td><td>√</td></tr><tr><td>Atlas 训练系列产品</td><td>x</td></tr></tbody></table><h2 id="功能说明" tabindex="-1">功能说明 <a class="header-anchor" href="#功能说明" aria-label="Permalink to &quot;功能说明&quot;">​</a></h2><p>用于在kernel侧注册与TilingKey相匹配的TilingData自定义结构体；该接口需提供一个逻辑表达式，逻辑表达式以字符串“TILING_KEY_VAR”代指实际TilingKey，表达TilingKey所满足的范围。</p><h2 id="函数原型" tabindex="-1">函数原型 <a class="header-anchor" href="#函数原型" aria-label="Permalink to &quot;函数原型&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>REGISTER_TILING_FOR_TILINGKEY(EXPRESSION, TILING_STRUCT)</span></span></code></pre></div><h2 id="参数说明" tabindex="-1">参数说明 <a class="header-anchor" href="#参数说明" aria-label="Permalink to &quot;参数说明&quot;">​</a></h2><table tabindex="0"><thead><tr><th>参数</th><th>输入/输出</th><th>说明</th></tr></thead><tbody><tr><td>EXPRESSION</td><td>输入</td><td>EXPRESSION为逻辑运算，其中用TILING_KEY_VAR指代TilingKey。</td></tr><tr><td>TILING_STRUCT</td><td>输入</td><td>用户注册的与TilingKey相匹配的TilingData自定义结构体。</td></tr></tbody></table><h2 id="约束说明" tabindex="-1">约束说明 <a class="header-anchor" href="#约束说明" aria-label="Permalink to &quot;约束说明&quot;">​</a></h2><ul><li>使用该接口时，需确保已使用REGISTER_TILING_DEFAULT注册默认的用户自定义TilingData结构体，用于告知框架侧用户使用标准C++语法来定义TilingData。</li><li>EXPRESSION当前支持位运算：&amp;、|、~、^；移位运算符：&lt;&lt;、&gt;&gt;；算术运算：+、-、*、/、%；条件运算符：==、!=、&gt;、&lt;、&gt;=、&lt;=；逻辑与&amp;&amp;、或||以及()。优先级同C++。</li><li>若TilingData结构体在命名空间内，注册时需要携带对应的命名空间作用域符。</li><li>不支持同个TilingKey指向不同TilingData结构体，会出现拦截报错。</li><li>暂不支持kernel直调工程。</li></ul><h2 id="调用示例" tabindex="-1">调用示例 <a class="header-anchor" href="#调用示例" aria-label="Permalink to &quot;调用示例&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>extern &quot;C&quot; __global__ __aicore__ void add_custom(__gm__ uint8_t *x, __gm__ uint8_t *y, __gm__ uint8_t *z, __gm__ uint8_t *tiling)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    REGISTER_TILING_DEFAULT(optiling::TilingData);  // 注册用户默认自定义TilingData结构体</span></span>
<span class="line"><span>    REGISTER_TILING_FOR_TILINGKEY(&quot;TILING_KEY_VAR == 1&quot;, optiling::TilingDataA); // 注册TilingKey为1的TilingData结构体</span></span>
<span class="line"><span>    REGISTER_TILING_FOR_TILINGKEY(&quot;(TILING_KEY_VAR &gt;= 10) &amp;&amp; (TILING_KEY_VAR &lt;= 15)&quot;, optiling::TilingDataB); // 注册TilingKey在[10,15]之间的TilingData结构体</span></span>
<span class="line"><span>    REGISTER_TILING_FOR_TILINGKEY(&quot;TILING_KEY_VAR &amp; 0xFF&quot;, optiling::TilingDataC); // 注册TilingKey低16位为1的TilingData结构体</span></span>
<span class="line"><span>    if (TILING_KEY_IS(1)) {</span></span>
<span class="line"><span>        GET_TILING_DATA_WITH_STRUCT(optiling::TilingDataA, tilingData, tiling);</span></span>
<span class="line"><span>        ......</span></span>
<span class="line"><span>    } else if (TILING_KEY_IS(11)) {</span></span>
<span class="line"><span>        GET_TILING_DATA_WITH_STRUCT(optiling::TilingDataB, tilingData, tiling);</span></span>
<span class="line"><span>        ......</span></span>
<span class="line"><span>    } else if (TILING_KEY_IS(14)) {</span></span>
<span class="line"><span>        GET_TILING_DATA_WITH_STRUCT(optiling::TilingDataB, tilingData, tiling);</span></span>
<span class="line"><span>        ......</span></span>
<span class="line"><span>    } else if (TILING_KEY_IS(255)) {</span></span>
<span class="line"><span>        GET_TILING_DATA_WITH_STRUCT(optiling::TilingDataC, tilingData, tiling);</span></span>
<span class="line"><span>        ......</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        GET_TILING_DATA(tilingData, tiling);</span></span>
<span class="line"><span>        ......</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>使用标准C++语法注册tiling结构体：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class TilingDataA{</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span>class TilingDataB{</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span>class TilingDataC{</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>配套的host侧tiling函数示例：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ge::graphStatus TilingFunc(gert::TilingContext* context)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    // 其他代码逻辑</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    if(condition1){</span></span>
<span class="line"><span>        context-&gt;SetTilingKey(1);</span></span>
<span class="line"><span>        optiling::TilingDataA *Addtiling = context-&gt;GetTilingData&lt;optiling::TilingDataA&gt;();</span></span>
<span class="line"><span>        ...</span></span>
<span class="line"><span>    } else if (condition2){</span></span>
<span class="line"><span>        context-&gt;SetTilingKey(11);</span></span>
<span class="line"><span>        optiling::TilingDataB *Addtiling = context-&gt;GetTilingData&lt;optiling::TilingDataB &gt;();</span></span>
<span class="line"><span>        ...</span></span>
<span class="line"><span>    } else if (condition3){</span></span>
<span class="line"><span>        context-&gt;SetTilingKey(14);</span></span>
<span class="line"><span>        optiling::TilingDataB *Addtiling = context-&gt;GetTilingData&lt;optiling::TilingDataB &gt;();</span></span>
<span class="line"><span>        ...</span></span>
<span class="line"><span>    } else if (condition4){</span></span>
<span class="line"><span>        context-&gt;SetTilingKey(255);</span></span>
<span class="line"><span>        optiling::TilingDataC *Addtiling = context-&gt;GetTilingData&lt;optiling::TilingDataC &gt;();</span></span>
<span class="line"><span>        ...</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    // 其他代码逻辑</span></span>
<span class="line"><span>}</span></span></code></pre></div>`,17)])])}const I=n(l,[["render",p]]);export{_ as __pageData,I as default};
