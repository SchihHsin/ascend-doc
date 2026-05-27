import{c as a,Q as n,j as p,m as e}from"./chunks/framework.DOi4mjdC.js";const d=JSON.parse('{"title":"核函数内删除Workspace相关冗余操作","description":"","frontmatter":{},"headers":[{"level":1,"title":"核函数内删除Workspace相关冗余操作","slug":"核函数内删除workspace相关冗余操作"}],"relativePath":"guide/算子实践参考/SIMD算子性能优化/头尾开销优化/核函数内删除Workspace相关冗余操作.md","filePath":"guide/算子实践参考/SIMD算子性能优化/头尾开销优化/核函数内删除Workspace相关冗余操作.md"}'),t={name:"guide/算子实践参考/SIMD算子性能优化/头尾开销优化/核函数内删除Workspace相关冗余操作.md"};function l(i,s,c,_,o,r){return n(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="核函数内删除workspace相关冗余操作" tabindex="-1">核函数内删除Workspace相关冗余操作 <a class="header-anchor" href="#核函数内删除workspace相关冗余操作" aria-label="Permalink to &quot;核函数内删除Workspace相关冗余操作&quot;">​</a></h1><p>【优先级】中</p><p>【描述】在Ascend C算子工程中，编写核函数时传入的参数workspace已经直接赋值为用户Workspace，因此无需再通过SetSysWorkspace和GetUserWorkspace来设置和获取Workspace。减少这些冗余判断后，编译器可以在不使用该参数的情况下进一步优化未用到的workspace变量。</p><p>【反例】</p><p>fast_gelu函数的参数workspace等价于用户workspace，且不为空，仍然对workspace进行判空，并且设置SetSysWorkspace和GetUserWorkspace来获取用户Workspace。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>template &lt;uint64_t schMode, uint64_t dType&gt;</span></span>
<span class="line"><span>__global__ __aicore__ void fast_gelu(GM_ADDR x, GM_ADDR y, GM_ADDR workspace, GM_ADDR tiling)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    // 反例，冗余判断</span></span>
<span class="line"><span>    if (workspace == nullptr) {</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    SetSysWorkspace(workspace);</span></span>
<span class="line"><span>    GM_ADDR userWS = GetUserWorkspace(workspace);</span></span>
<span class="line"><span>    if (userWS == nullptr) {</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    REGISTER_TILING_DEFAULT(EleBaseTilingDataV2);</span></span>
<span class="line"><span>    GET_TILING_DATA_WITH_STRUCT(EleBaseTilingDataV2, tilingData, tiling);</span></span>
<span class="line"><span>    KERNEL_TASK_TYPE_DEFAULT(KERNEL_TYPE_AIV_ONLY);</span></span>
<span class="line"><span>    TPipe pipe;</span></span>
<span class="line"><span>    if constexpr (dType == static_cast&lt;uint64_t&gt;(TPL_FP16)) {</span></span>
<span class="line"><span>        ElementwiseSch&lt;schMode, FastGeluDag::FastGeluNeedCast&lt;half&gt;::OpDag&gt; sch(&amp;tilingData, &amp;pipe);</span></span>
<span class="line"><span>        sch.Init(x, y);</span></span>
<span class="line"><span>        sch.Process();</span></span>
<span class="line"><span>    } else if constexpr (dType == static_cast&lt;uint64_t&gt;(TPL_BF16)) {</span></span>
<span class="line"><span>        ElementwiseSch&lt;schMode, FastGeluDag::FastGeluNeedCast&lt;bfloat16_t&gt;::OpDag&gt; sch(&amp;tilingData, &amp;pipe);</span></span>
<span class="line"><span>        sch.Init(x, y);</span></span>
<span class="line"><span>        sch.Process();</span></span>
<span class="line"><span>    } else if constexpr (dType == static_cast&lt;uint64_t&gt;(TPL_FP32)) {</span></span>
<span class="line"><span>        ElementwiseSch&lt;schMode, FastGeluDag::FastGeluNoCast&lt;float&gt;::OpDag&gt; sch(&amp;tilingData, &amp;pipe);</span></span>
<span class="line"><span>        sch.Init(x, y);</span></span>
<span class="line"><span>        sch.Process();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>【正例】</p><p>fast_gelu函数中删除对workspace参数进行空指针判断，也无需设置SetSysWorkspace和通过GetUserWorkspace来获取Workspace。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>template &lt;uint64_t schMode, uint64_t dType&gt;</span></span>
<span class="line"><span>__global__ __aicore__ void fast_gelu(GM_ADDR x, GM_ADDR y, GM_ADDR workspace, GM_ADDR tiling)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    REGISTER_TILING_DEFAULT(EleBaseTilingDataV2);</span></span>
<span class="line"><span>    GET_TILING_DATA_WITH_STRUCT(EleBaseTilingDataV2, tilingData, tiling);</span></span>
<span class="line"><span>    KERNEL_TASK_TYPE_DEFAULT(KERNEL_TYPE_AIV_ONLY);</span></span>
<span class="line"><span>    TPipe pipe;</span></span>
<span class="line"><span>    if constexpr (dType == static_cast&lt;uint64_t&gt;(TPL_FP16)) {</span></span>
<span class="line"><span>        ElementwiseSch&lt;schMode, FastGeluDag::FastGeluNeedCast&lt;half&gt;::OpDag&gt; sch(&amp;tilingData, &amp;pipe);</span></span>
<span class="line"><span>        sch.Init(x, y);</span></span>
<span class="line"><span>        sch.Process();</span></span>
<span class="line"><span>    } else if constexpr (dType == static_cast&lt;uint64_t&gt;(TPL_BF16)) {</span></span>
<span class="line"><span>        ElementwiseSch&lt;schMode, FastGeluDag::FastGeluNeedCast&lt;bfloat16_t&gt;::OpDag&gt; sch(&amp;tilingData, &amp;pipe);</span></span>
<span class="line"><span>        sch.Init(x, y);</span></span>
<span class="line"><span>        sch.Process();</span></span>
<span class="line"><span>    } else if constexpr (dType == static_cast&lt;uint64_t&gt;(TPL_FP32)) {</span></span>
<span class="line"><span>        ElementwiseSch&lt;schMode, FastGeluDag::FastGeluNoCast&lt;float&gt;::OpDag&gt; sch(&amp;tilingData, &amp;pipe);</span></span>
<span class="line"><span>        sch.Init(x, y);</span></span>
<span class="line"><span>        sch.Process();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div>`,9)])])}const h=a(t,[["render",l]]);export{d as __pageData,h as default};
