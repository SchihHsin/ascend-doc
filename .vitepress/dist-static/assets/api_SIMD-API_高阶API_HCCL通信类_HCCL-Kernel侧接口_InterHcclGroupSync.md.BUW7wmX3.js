import{c as n,Q as l,j as t,m as s}from"./chunks/framework.DOi4mjdC.js";const u=JSON.parse('{"title":"InterHcclGroupSync","description":"","frontmatter":{},"headers":[{"level":1,"title":"InterHcclGroupSync","slug":"interhcclgroupsync"},{"level":2,"title":"产品支持情况","slug":"产品支持情况"},{"level":2,"title":"功能说明","slug":"功能说明"},{"level":2,"title":"函数原型","slug":"函数原型"},{"level":2,"title":"参数说明","slug":"参数说明"},{"level":2,"title":"返回值说明","slug":"返回值说明"},{"level":2,"title":"约束说明","slug":"约束说明"},{"level":2,"title":"调用示例","slug":"调用示例"}],"relativePath":"api/SIMD-API/高阶API/HCCL通信类/HCCL-Kernel侧接口/InterHcclGroupSync.md","filePath":"api/SIMD-API/高阶API/HCCL通信类/HCCL-Kernel侧接口/InterHcclGroupSync.md"}'),e={name:"api/SIMD-API/高阶API/HCCL通信类/HCCL-Kernel侧接口/InterHcclGroupSync.md"};function p(c,a,i,r,o,d){return l(),t("div",null,[...a[0]||(a[0]=[s(`<h1 id="interhcclgroupsync" tabindex="-1">InterHcclGroupSync <a class="header-anchor" href="#interhcclgroupsync" aria-label="Permalink to &quot;InterHcclGroupSync&quot;">​</a></h1><h2 id="产品支持情况" tabindex="-1">产品支持情况 <a class="header-anchor" href="#产品支持情况" aria-label="Permalink to &quot;产品支持情况&quot;">​</a></h2><table tabindex="0"><thead><tr><th>产品</th><th>是否支持</th></tr></thead><tbody><tr><td>Ascend 950PR/Ascend 950DT</td><td>x</td></tr><tr><td>Atlas A3 训练系列产品/Atlas A3 推理系列产品</td><td>√</td></tr><tr><td>Atlas A2 训练系列产品/Atlas A2 推理系列产品</td><td>x</td></tr><tr><td>Atlas 200I/500 A2 推理产品</td><td>x</td></tr><tr><td>Atlas 推理系列产品AI Core</td><td>x</td></tr><tr><td>Atlas 推理系列产品Vector Core</td><td>x</td></tr><tr><td>Atlas 训练系列产品</td><td>x</td></tr></tbody></table><h2 id="功能说明" tabindex="-1">功能说明 <a class="header-anchor" href="#功能说明" aria-label="Permalink to &quot;功能说明&quot;">​</a></h2><p>用于等待一个跨通信域的通信任务完成。调用该接口后，本通信域后续下发的通信任务，均等待指定的srcGroupID通信域中的srcHandleID通信任务执行完成，才开始执行。</p><h2 id="函数原型" tabindex="-1">函数原型 <a class="header-anchor" href="#函数原型" aria-label="Permalink to &quot;函数原型&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>__aicore__ inline void InterHcclGroupSync(int8_t srcGroupID, HcclHandle srcHandleID)</span></span></code></pre></div><h2 id="参数说明" tabindex="-1">参数说明 <a class="header-anchor" href="#参数说明" aria-label="Permalink to &quot;参数说明&quot;">​</a></h2><table tabindex="0"><thead><tr><th>参数名</th><th>输入/输出</th><th>描述</th></tr></thead><tbody><tr><td>srcGroupID</td><td>输入</td><td>通信域编号，即后续通信任务所等待的通信任务所在的通信域编号。</td></tr><tr><td>srcHandleID</td><td>输入</td><td>通信任务，即后续通信任务所等待的通信任务的标识HcclHandle。</td></tr></tbody></table><h2 id="返回值说明" tabindex="-1">返回值说明 <a class="header-anchor" href="#返回值说明" aria-label="Permalink to &quot;返回值说明&quot;">​</a></h2><p>无</p><h2 id="约束说明" tabindex="-1">约束说明 <a class="header-anchor" href="#约束说明" aria-label="Permalink to &quot;约束说明&quot;">​</a></h2><ul><li>调用本接口前确保已调用过<a href="./InitV2.html">InitV2</a>和<a href="./SetCcTilingV2.html">SetCcTilingV2</a>接口。</li><li>本接口在AIC核或者AIV核上调用必须与对应的Prepare接口的调用核保持一致。</li><li>一个通信域内，所有Prepare接口和InterHcclGroupSync接口的总调用次数不能超过63。</li></ul><h2 id="调用示例" tabindex="-1">调用示例 <a class="header-anchor" href="#调用示例" aria-label="Permalink to &quot;调用示例&quot;">​</a></h2><p>本示例构造一个通信融合算子，该算子有1个输入xGM，2个输出alltoallGM和allgatherGM。算子内有2个通信域，首先通信域0对输入进行AlltoAll通信，将结果输出至alltoallGM。当结果数据输出到alltoallGM完成后，通信域1将该结果alltoallGM作为AllGather通信的输入，并将通信结果输出至allgatherGM。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>extern &quot;C&quot; __global__ __aicore__ void alltoall_allgather_custom(GM_ADDR xGM, GM_ADDR alltoallGM, GM_ADDR allgatherGM) {</span></span>
<span class="line"><span>    REGISTER_TILING_DEFAULT(AlltoAllAllGatherCustomTilingData); //AlltoAllAllGatherCustomTilingData为对应算子头文件定义的结构体</span></span>
<span class="line"><span>    GET_TILING_DATA_WITH_STRUCT(AlltoAllAllGatherCustomTilingData, tilingData, tilingGM);</span></span>
<span class="line"><span>    GM_ADDR contextGM0 = AscendC::GetHcclContext&lt;0&gt;();</span></span>
<span class="line"><span>    GM_ADDR contextGM1 = AscendC::GetHcclContext&lt;1&gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Hccl hccl0;</span></span>
<span class="line"><span>    Hccl hccl1;</span></span>
<span class="line"><span>    HcclDataType dtype = HcclDataType::HCCL_DATA_TYPE_FP16;</span></span>
<span class="line"><span>    const uint64_t dataCount = 10U;</span></span>
<span class="line"><span>    const uint64_t strideCount = 0U;</span></span>
<span class="line"><span>    const uint64_t rankNum = 4U;</span></span>
<span class="line"><span>    if (AscendC::g_coreType == AIV) {  // 仅使用AIV核进行通信</span></span>
<span class="line"><span>	hccl0.InitV2(contextGM0, &amp;tilingData);</span></span>
<span class="line"><span>        hccl1.InitV2(contextGM1, &amp;tilingData);</span></span>
<span class="line"><span>        hccl0.SetCcTilingV2(offsetof(AlltoAllAllGatherCustomTilingData, alltoallTiling));</span></span>
<span class="line"><span>        hccl1.SetCcTilingV2(offsetof(AlltoAllAllGatherCustomTilingData, allgatherTiling));</span></span>
<span class="line"><span>		</span></span>
<span class="line"><span>	// 通信域0下发1个AlltoAll任务</span></span>
<span class="line"><span>        auto group0_handle = hccl0.AlltoAll(xGM, alltoallGM, dataCount, dtype, strideCount);</span></span>
<span class="line"><span>		</span></span>
<span class="line"><span>	// 通信域1下发跨域依赖任务，保证通信域1后续的AllGather任务在通信域0的AlltoAll执行结束后，才开始执行</span></span>
<span class="line"><span>	hccl1.InterHcclGroupSync(0, group0_handle);</span></span>
<span class="line"><span>        // 通信域1下发1个ReduceScatter任务</span></span>
<span class="line"><span>        HcclReduceOp op = HcclReduceOp::HCCL_REDUCE_SUM;</span></span>
<span class="line"><span>	auto group1_handle = hccl1.AllGather(alltoallGM, allgatherGM, dataCount, dtype, op, strideCount);</span></span>
<span class="line"><span>		</span></span>
<span class="line"><span>	hccl0.Commit(group0_handle);</span></span>
<span class="line"><span>        hccl1.Commit(group1_handle);</span></span>
<span class="line"><span>	hccl0.Wait(group0_handle);</span></span>
<span class="line"><span>	hccl1.Wait(group1_handle);</span></span>
<span class="line"><span>		</span></span>
<span class="line"><span>	AscendC::SyncAll&lt;true&gt;();  // 全AIV核同步，防止0核执行过快，提前调用hccl.Finalize()接口，导致其他核Wait卡死           </span></span>
<span class="line"><span>	hccl0.Finalize();</span></span>
<span class="line"><span>	hccl1.Finalize();</span></span>
<span class="line"><span>    } </span></span>
<span class="line"><span>}</span></span></code></pre></div>`,16)])])}const A=n(e,[["render",p]]);export{u as __pageData,A as default};
