import{c as n,Q as s,j as l,m as t}from"./chunks/framework.DOi4mjdC.js";const C=JSON.parse('{"title":"SetCcTilingV2","description":"","frontmatter":{},"headers":[{"level":1,"title":"SetCcTilingV2","slug":"setcctilingv2"},{"level":2,"title":"产品支持情况","slug":"产品支持情况"},{"level":2,"title":"功能说明","slug":"功能说明"},{"level":2,"title":"函数原型","slug":"函数原型"},{"level":2,"title":"参数说明","slug":"参数说明"},{"level":2,"title":"返回值说明","slug":"返回值说明"},{"level":2,"title":"约束说明","slug":"约束说明"},{"level":2,"title":"调用示例","slug":"调用示例"}],"relativePath":"api/SIMD-API/高阶API/HCCL通信类/HCCL-Kernel侧接口/SetCcTilingV2.md","filePath":"api/SIMD-API/高阶API/HCCL通信类/HCCL-Kernel侧接口/SetCcTilingV2.md"}'),e={name:"api/SIMD-API/高阶API/HCCL通信类/HCCL-Kernel侧接口/SetCcTilingV2.md"};function i(p,a,c,d,r,o){return s(),l("div",null,[...a[0]||(a[0]=[t(`<h1 id="setcctilingv2" tabindex="-1">SetCcTilingV2 <a class="header-anchor" href="#setcctilingv2" aria-label="Permalink to &quot;SetCcTilingV2&quot;">​</a></h1><h2 id="产品支持情况" tabindex="-1">产品支持情况 <a class="header-anchor" href="#产品支持情况" aria-label="Permalink to &quot;产品支持情况&quot;">​</a></h2><table tabindex="0"><thead><tr><th>产品</th><th>是否支持</th></tr></thead><tbody><tr><td>Ascend 950PR/Ascend 950DT</td><td>√</td></tr><tr><td>Atlas A3 训练系列产品/Atlas A3 推理系列产品</td><td>√</td></tr><tr><td>Atlas A2 训练系列产品/Atlas A2 推理系列产品</td><td>√</td></tr><tr><td>Atlas 200I/500 A2 推理产品</td><td>x</td></tr><tr><td>Atlas 推理系列产品AI Core</td><td>x</td></tr><tr><td>Atlas 推理系列产品Vector Core</td><td>x</td></tr><tr><td>Atlas 训练系列产品</td><td>x</td></tr></tbody></table><h2 id="功能说明" tabindex="-1">功能说明 <a class="header-anchor" href="#功能说明" aria-label="Permalink to &quot;功能说明&quot;">​</a></h2><p>用于设置HCCL客户端中某个通信算法配置的TilingData地址。</p><h2 id="函数原型" tabindex="-1">函数原型 <a class="header-anchor" href="#函数原型" aria-label="Permalink to &quot;函数原型&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>__aicore__ inline int32_t SetCcTilingV2(uint64_t offset)</span></span></code></pre></div><h2 id="参数说明" tabindex="-1">参数说明 <a class="header-anchor" href="#参数说明" aria-label="Permalink to &quot;参数说明&quot;">​</a></h2><p><strong>表 1</strong> 接口参数说明</p><table tabindex="0"><thead><tr><th>参数名</th><th>输入/输出</th><th>描述</th></tr></thead><tbody><tr><td>offset</td><td>输入</td><td>通信算法配置Mc2CcTiling参数地址相对于Mc2InitTiling起始地址的偏移。Mc2CcTiling在Host侧计算得出，具体请参考表2 Mc2CcTiling参数说明，由框架传递到Kernel函数中使用。</td></tr></tbody></table><h2 id="返回值说明" tabindex="-1">返回值说明 <a class="header-anchor" href="#返回值说明" aria-label="Permalink to &quot;返回值说明&quot;">​</a></h2><ul><li>HCCL_SUCCESS，表示成功。</li><li>HCCL_FAILED，表示失败。</li></ul><h2 id="约束说明" tabindex="-1">约束说明 <a class="header-anchor" href="#约束说明" aria-label="Permalink to &quot;约束说明&quot;">​</a></h2><ul><li>若调用本接口，必须保证<a href="./InitV2.html">InitV2</a>在本接口前被调用。</li><li>Tiling参数相同的同一种通信算法在调用Prepare接口前，只需要调用一次本接口，请参考调用示例：<a href="#li71505119260">类型不同、Tiling参数不同的通信</a>。</li><li>对于同一种通信算法，如果Tiling参数不同，重复调用本接口会覆盖之前的Tiling参数地址，因此需要在调用Prepare接口后再调用本接口设置新的Tiling参数。请参考调用示例：<a href="#li1163031215116">类型相同、Tiling参数不同的通信</a>。</li><li>若调用本接口，必须使用标准C++语法定义TilingData结构体的开发方式。</li></ul><h2 id="调用示例" tabindex="-1">调用示例 <a class="header-anchor" href="#调用示例" aria-label="Permalink to &quot;调用示例&quot;">​</a></h2><ul><li><p>用户自定义TilingData结构体：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class UserCustomTilingData {</span></span>
<span class="line"><span>    AscendC::tiling::Mc2InitTiling initTiling;</span></span>
<span class="line"><span>    AscendC::tiling::Mc2CcTiling allGatherTiling;</span></span>
<span class="line"><span>    AscendC::tiling::Mc2CcTiling allReduceTiling1;</span></span>
<span class="line"><span>    AscendC::tiling::Mc2CcTiling allReduceTiling2;</span></span>
<span class="line"><span>    CustomTiling param;</span></span>
<span class="line"><span>};</span></span></code></pre></div></li><li><p>类型不同、Tiling参数不同的通信</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>extern &quot;C&quot; __global__ __aicore__ void userKernel(GM_ADDR aGM, GM_ADDR workspaceGM, GM_ADDR tilingGM) {</span></span>
<span class="line"><span>    REGISTER_TILING_DEFAULT(UserCustomTilingData);</span></span>
<span class="line"><span>    GET_TILING_DATA_WITH_STRUCT(UserCustomTilingData, tilingData, tilingGM);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Hccl hccl;</span></span>
<span class="line"><span>    GM_ADDR contextGM = AscendC::GetHcclContext&lt;0&gt;();</span></span>
<span class="line"><span>    hccl.InitV2(contextGM, &amp;tilingData);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 在下发任务之前，通过SetCcTilingV2设置对应的tiling</span></span>
<span class="line"><span>    if (hccl.SetCcTilingV2(offsetof(UserCustomTilingData, allGatherTiling)) != HCCL_SUCCESS ||</span></span>
<span class="line"><span>        hccl.SetCcTilingV2(offsetof(UserCustomTilingData, allReduceTiling1)) != HCCL_SUCCESS) {</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    const auto agHandleId = hccl.AllGather&lt;true&gt;(sendBuf, recvBuf, dataCount, HcclDataType::HCCL_DATA_TYPE_FP16);</span></span>
<span class="line"><span>    hccl.Wait(agHandleId);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    const auto arHandleId = hccl.AllReduce&lt;true&gt;(sendBuf, recvBuf, dataCount, HcclDataType::HCCL_DATA_TYPE_FP16, HcclReduceOp::HCCL_REDUCE_SUM);</span></span>
<span class="line"><span>    hccl.Wait(arHandleId);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    hccl.Finalize();</span></span>
<span class="line"><span>}</span></span></code></pre></div></li><li><p>类型相同、Tiling参数不同的通信</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>extern &quot;C&quot; __global__ __aicore__ void userKernel(GM_ADDR aGM, GM_ADDR workspaceGM, GM_ADDR tilingGM) {</span></span>
<span class="line"><span>    REGISTER_TILING_DEFAULT(UserCustomTilingData);</span></span>
<span class="line"><span>    GET_TILING_DATA_WITH_STRUCT(UserCustomTilingData, tilingData, tilingGM);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Hccl hccl;</span></span>
<span class="line"><span>    GM_ADDR contextGM = AscendC::GetHcclContext&lt;0&gt;();</span></span>
<span class="line"><span>    hccl.InitV2(contextGM, &amp;tilingData);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // 在下发通信任务之前，通过SetCcTilingV2设置对应的Tiling参数地址</span></span>
<span class="line"><span>    if (hccl.SetCcTilingV2(offsetof(UserCustomTilingData, allReduceTiling1)) != HCCL_SUCCESS) {</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    const auto arHandleId1 = hccl.AllReduce&lt;true&gt;(sendBuf, recvBuf, dataCount, HcclDataType::HCCL_DATA_TYPE_FP16, HcclReduceOp::HCCL_REDUCE_SUM);</span></span>
<span class="line"><span>    hccl.Wait(arHandleId1);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    // 第二次AllReduce的Tiling参数与第一次不同，在第一次Prepare之后再调用SetCcTilingV2</span></span>
<span class="line"><span>    if (hccl.SetCcTilingV2(offsetof(UserCustomTilingData, allReduceTiling2)) != HCCL_SUCCESS) {</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    const auto arHandleId2 = hccl.AllReduce&lt;true&gt;(sendBuf, recvBuf, dataCount, HcclDataType::HCCL_DATA_TYPE_FP16, HcclReduceOp::HCCL_REDUCE_SUM);</span></span>
<span class="line"><span>    hccl.Wait(arHandleId2);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    hccl.Finalize();</span></span>
<span class="line"><span>}</span></span></code></pre></div></li></ul>`,16)])])}const h=n(e,[["render",i]]);export{C as __pageData,h as default};
