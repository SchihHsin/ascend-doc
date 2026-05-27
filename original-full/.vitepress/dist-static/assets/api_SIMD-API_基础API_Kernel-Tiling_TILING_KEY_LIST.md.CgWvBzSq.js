import{c as n,Q as s,j as e,m as t}from"./chunks/framework.DOi4mjdC.js";const h=JSON.parse('{"title":"TILING_KEY_LIST","description":"","frontmatter":{},"headers":[{"level":1,"title":"TILING\\\\_KEY\\\\_LIST","slug":"tiling_key_list"},{"level":2,"title":"产品支持情况","slug":"产品支持情况"},{"level":2,"title":"功能说明","slug":"功能说明"},{"level":2,"title":"函数原型","slug":"函数原型"},{"level":2,"title":"参数说明","slug":"参数说明"},{"level":2,"title":"约束说明","slug":"约束说明"},{"level":2,"title":"调用示例","slug":"调用示例"}],"relativePath":"api/SIMD-API/基础API/Kernel-Tiling/TILING_KEY_LIST.md","filePath":"api/SIMD-API/基础API/Kernel-Tiling/TILING_KEY_LIST.md"}'),l={name:"api/SIMD-API/基础API/Kernel-Tiling/TILING_KEY_LIST.md"};function i(p,a,o,_,c,d){return s(),e("div",null,[...a[0]||(a[0]=[t(`<h1 id="tiling-key-list" tabindex="-1">TILING_KEY_LIST <a class="header-anchor" href="#tiling-key-list" aria-label="Permalink to &quot;TILING\\_KEY\\_LIST&quot;">​</a></h1><h2 id="产品支持情况" tabindex="-1">产品支持情况 <a class="header-anchor" href="#产品支持情况" aria-label="Permalink to &quot;产品支持情况&quot;">​</a></h2><table tabindex="0"><thead><tr><th>产品</th><th>是否支持</th></tr></thead><tbody><tr><td>Ascend 950PR/Ascend 950DT</td><td>√</td></tr><tr><td>Atlas A3 训练系列产品/Atlas A3 推理系列产品</td><td>√</td></tr><tr><td>Atlas A2 训练系列产品/Atlas A2 推理系列产品</td><td>√</td></tr><tr><td>Atlas 200I/500 A2 推理产品</td><td>x</td></tr><tr><td>Atlas 推理系列产品AI Core</td><td>x</td></tr><tr><td>Atlas 推理系列产品Vector Core</td><td>x</td></tr><tr><td>Atlas 训练系列产品</td><td>x</td></tr></tbody></table><h2 id="功能说明" tabindex="-1">功能说明 <a class="header-anchor" href="#功能说明" aria-label="Permalink to &quot;功能说明&quot;">​</a></h2><p>TILING_KEY_LIST函数用于在核函数中判断当前执行的TilingKey是否与Host侧配置的指定TilingKey匹配，从而标识满足TilingKey == key1或TilingKey == key2条件的分支逻辑。</p><h2 id="函数原型" tabindex="-1">函数原型 <a class="header-anchor" href="#函数原型" aria-label="Permalink to &quot;函数原型&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>TILING_KEY_LIST(key1,key2)</span></span></code></pre></div><h2 id="参数说明" tabindex="-1">参数说明 <a class="header-anchor" href="#参数说明" aria-label="Permalink to &quot;参数说明&quot;">​</a></h2><table tabindex="0"><thead><tr><th>参数</th><th>输入/输出</th><th>说明</th></tr></thead><tbody><tr><td>key</td><td>输入</td><td>key表示某个核函数的分支，必须是非负整数。</td></tr></tbody></table><h2 id="约束说明" tabindex="-1">约束说明 <a class="header-anchor" href="#约束说明" aria-label="Permalink to &quot;约束说明&quot;">​</a></h2><ul><li>TILING_KEY_LIST运用于if和else if分支，不支持else分支，即用TILING_KEY_LIST函数来表征N个分支，必须用N个TILING_KEY_LIST(key1,key2)来分别表示。</li><li>支持传入两个TilingKey，每个TilingKey具备唯一性。</li><li>使用该接口时，必须设置默认的Kernel类型，也可以为某个TilingKey单独配置Kernel类型，该配置会覆盖默认Kernel类型。Kernel类型仅支持配置为KERNEL_TYPE_MIX_AIC_1_1、KERNEL_TYPE_MIX_AIC_1_2。</li><li>暂不支持Kernel直调工程。</li></ul><h2 id="调用示例" tabindex="-1">调用示例 <a class="header-anchor" href="#调用示例" aria-label="Permalink to &quot;调用示例&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>extern &quot;C&quot; __global__ __aicore__ void add_custom(__gm__ uint8_t *x, __gm__ uint8_t *y, __gm__ uint8_t *z, __gm__ uint8_t *workspace, __gm__ uint8_t *tiling)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    GET_TILING_DATA(tilingData, tiling);</span></span>
<span class="line"><span>    if (workspace == nullptr) {</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    KernelAdd op;</span></span>
<span class="line"><span>    KERNEL_TASK_TYPE_DEFAULT(KERNEL_TYPE_MIX_AIC_1_1);</span></span>
<span class="line"><span>    op.Init(x, y, z, tilingData.numBlocks, tilingData.totalLength, tilingData.tileNum);</span></span>
<span class="line"><span>    // 当TilingKey为1或2时，执行Process1；为3或4时，执行Process2</span></span>
<span class="line"><span>    if (TILING_KEY_LIST(1,2)) {</span></span>
<span class="line"><span>        op.Process1();</span></span>
<span class="line"><span>    } else if (TILING_KEY_LIST(3,4)) {</span></span>
<span class="line"><span>        KERNEL_TASK_TYPE(4, KERNEL_TYPE_MIX_AIC_1_2);</span></span>
<span class="line"><span>        op.Process2();</span></span>
<span class="line"><span>    } </span></span>
<span class="line"><span>    // 其他代码逻辑</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    // 此处示例当TilingKey为3或4时，会执行ProcessOther</span></span>
<span class="line"><span>    if (TILING_KEY_LIST(3,4)) {</span></span>
<span class="line"><span>        op.ProcessOther();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>配套的Host侧Tiling函数示例（伪代码）：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>ge::graphStatus TilingFunc(gert::TilingContext* context)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    // 其他代码逻辑</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    if (context-&gt;GetInputShape(0) &gt; 10) {</span></span>
<span class="line"><span>        context-&gt;SetTilingKey(1);</span></span>
<span class="line"><span>    } else if (some condition) {</span></span>
<span class="line"><span>        context-&gt;SetTilingKey(2);</span></span>
<span class="line"><span>    } else if (some condition) {</span></span>
<span class="line"><span>        context-&gt;SetTilingKey(3);</span></span>
<span class="line"><span>    } else if (some condition) {</span></span>
<span class="line"><span>        context-&gt;SetTilingKey(4);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div>`,15)])])}const I=n(l,[["render",i]]);export{h as __pageData,I as default};
