import{c as n,Q as t,j as s,m as e}from"./chunks/framework.DOi4mjdC.js";const l="/assets/251208103727744.B95An86J.png",A=JSON.parse('{"title":"AlltoAllvWrite","description":"","frontmatter":{},"headers":[{"level":1,"title":"AlltoAllvWrite","slug":"alltoallvwrite"},{"level":2,"title":"产品支持情况","slug":"产品支持情况"},{"level":2,"title":"功能说明","slug":"功能说明"},{"level":2,"title":"函数原型","slug":"函数原型"},{"level":2,"title":"参数说明","slug":"参数说明"},{"level":2,"title":"返回值说明","slug":"返回值说明"},{"level":2,"title":"约束说明","slug":"约束说明"},{"level":2,"title":"调用示例","slug":"调用示例"}],"relativePath":"api/SIMD-API/高阶API/HCCL通信类/HCCL-Kernel侧接口/AlltoAllvWrite.md","filePath":"api/SIMD-API/高阶API/HCCL通信类/HCCL-Kernel侧接口/AlltoAllvWrite.md"}'),i={name:"api/SIMD-API/高阶API/HCCL通信类/HCCL-Kernel侧接口/AlltoAllvWrite.md"};function p(d,a,r,c,o,_){return t(),s("div",null,[...a[0]||(a[0]=[e('<h1 id="alltoallvwrite" tabindex="-1">AlltoAllvWrite <a class="header-anchor" href="#alltoallvwrite" aria-label="Permalink to &quot;AlltoAllvWrite&quot;">​</a></h1><h2 id="产品支持情况" tabindex="-1">产品支持情况 <a class="header-anchor" href="#产品支持情况" aria-label="Permalink to &quot;产品支持情况&quot;">​</a></h2><table tabindex="0"><thead><tr><th>产品</th><th>是否支持</th></tr></thead><tbody><tr><td>Ascend 950PR/Ascend 950DT</td><td>√</td></tr><tr><td>Atlas A3 训练系列产品/Atlas A3 推理系列产品</td><td>x</td></tr><tr><td>Atlas A2 训练系列产品/Atlas A2 推理系列产品</td><td>x</td></tr><tr><td>Atlas 200I/500 A2 推理产品</td><td>x</td></tr><tr><td>Atlas 推理系列产品AI Core</td><td>x</td></tr><tr><td>Atlas 推理系列产品Vector Core</td><td>x</td></tr><tr><td>Atlas 训练系列产品</td><td>x</td></tr></tbody></table><h2 id="功能说明" tabindex="-1">功能说明 <a class="header-anchor" href="#功能说明" aria-label="Permalink to &quot;功能说明&quot;">​</a></h2><p>集合通信AlltoAllvWrite的任务下发接口，返回该任务的标识handleId给用户。</p><p>AlltoAllvWrite的功能为：通信域内的卡互相发送和接收数据，并且定制每张卡给其它卡发送的数据量和从其它卡接收的数据量，以及定制发送和接收的数据在内存中的偏移。结合原型中的参数，描述接口功能，具体为：本卡发送地址偏移为sendOffsets[i]字节且大小为sendSizes[i]字节的数据给第i张卡，remoteWinOffset表示对端卡发送数据的地址偏移，localDataSize表示发送给本卡的数据大小。注意：这里的偏移和数据量均为字节数。</p><p><img src="'+l+`" alt=""></p><h2 id="函数原型" tabindex="-1">函数原型 <a class="header-anchor" href="#函数原型" aria-label="Permalink to &quot;函数原型&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>template &lt;bool commit = false&gt;</span></span>
<span class="line"><span>__aicore__ inline HcclHandle AlltoAllvWrite(GM_ADDR usrIn, GM_ADDR sendOffsets, GM_ADDR sendSizes, uint64_t remoteWinOffset, uint64_t localDataSize)</span></span></code></pre></div><h2 id="参数说明" tabindex="-1">参数说明 <a class="header-anchor" href="#参数说明" aria-label="Permalink to &quot;参数说明&quot;">​</a></h2><p><strong>表 1</strong> 模板参数说明</p><table tabindex="0"><thead><tr><th>参数名</th><th>输入/输出</th><th>描述</th></tr></thead><tbody><tr><td>commit</td><td>输入</td><td>bool类型。参数取值如下： true：在调用Prepare接口时，Commit同步通知服务端可以执行该通信任务。false：在调用Prepare接口时，不通知服务端执行该通信任务。</td></tr></tbody></table><p><strong>表 2</strong> 接口参数说明</p><table tabindex="0"><thead><tr><th>参数名</th><th>输入/输出</th><th>描述</th></tr></thead><tbody><tr><td>usrIn</td><td>输入</td><td>源数据buffer地址。</td></tr><tr><td>sendOffsets</td><td>输入</td><td>待发送的每个分片的偏移，以字节为单位。</td></tr><tr><td>sendSizes</td><td>输入</td><td>待发送的每个分片的数据大小，以字节为单位。</td></tr><tr><td>remoteWinOffset</td><td>输入</td><td>对端卡发送的数据偏移，以字节为单位。</td></tr><tr><td>localDataSize</td><td>输入</td><td>发送给本卡的数据大小，以字节为单位。</td></tr></tbody></table><h2 id="返回值说明" tabindex="-1">返回值说明 <a class="header-anchor" href="#返回值说明" aria-label="Permalink to &quot;返回值说明&quot;">​</a></h2><p>返回该任务的标识handleId，handleId大于等于0。调用失败时，返回 -1。</p><h2 id="约束说明" tabindex="-1">约束说明 <a class="header-anchor" href="#约束说明" aria-label="Permalink to &quot;约束说明&quot;">​</a></h2><ul><li>调用本接口前确保已调用过<a href="./InitV2.html">InitV2</a>和<a href="./SetCcTilingV2.html">SetCcTilingV2</a>接口。</li><li>若HCCL对象的<a href="./HCCL模板参数.html#p150710476349">模板参数config</a>未指定下发通信任务的核，则该接口只能在AIC核或者AIV核两者之一上调用。若HCCL对象的<a href="./HCCL模板参数.html#p150710476349">模板参数config</a>指定了下发通信任务的核，则该接口可以在AIC核和AIV核上同时调用，接口内部根据指定的核的类型，在对应的AIC核、AIV核二者之一下发该通信任务。</li><li>一个通信域内，所有Prepare接口和InterHcclGroupSync接口的总调用次数不能超过63。</li><li>对于Ascend 950PR/Ascend 950DT，通信服务端为CCU时，单次最大通信数据量不能超过256M。</li></ul><h2 id="调用示例" tabindex="-1">调用示例 <a class="header-anchor" href="#调用示例" aria-label="Permalink to &quot;调用示例&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>extern &quot;C&quot; __global__ __aicore__ void alltoallvwrite_custom(GM_ADDR xGM, GM_ADDR yGM, GM_ADDR workspaceGM, GM_ADDR tilingGM) {  </span></span>
<span class="line"><span></span></span>
<span class="line"><span>    REGISTER_TILING_DEFAULT(AllToAllVWriteCustomTilingData); //AllToAllVWriteCustomTilingData为对应算子头文件定义的结构体</span></span>
<span class="line"><span>    GET_TILING_DATA_WITH_STRUCT(AllToAllVWriteCustomTilingData, tilingData, tilingGM);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    auto &amp;&amp;cfg       = tilingData.param;</span></span>
<span class="line"><span>    uint32_t M = cfg.M;</span></span>
<span class="line"><span>    uint32_t K = cfg.K;</span></span>
<span class="line"><span>    uint32_t dataType = cfg.dataType;</span></span>
<span class="line"><span>    uint32_t dataTypeSize = cfg.dataTypeSize;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    KERNEL_TASK_TYPE_DEFAULT(KERNEL_TYPE_MIX_AIC_1_2);</span></span>
<span class="line"><span>    Hccl&lt;HcclServerType::HCCL_SERVER_TYPE_CCU&gt; hccl;</span></span>
<span class="line"><span>    GM_ADDR context = GetHcclContext&lt;HCCL_GROUP_ID_0&gt;();</span></span>
<span class="line"><span>    hccl.InitV2(context, &amp;tilingData);</span></span>
<span class="line"><span>    hccl.SetCcTilingV2(offsetof(AllToAllVCustomV3TilingData, mc2CcTiling));</span></span>
<span class="line"><span>    uint32_t rankDim = hccl.GetRankDim();</span></span>
<span class="line"><span>    uint32_t rankId = hccl.GetRankId();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    uint64_t perRankDataSize_ = M * K * dataTypeSize / rankDim;</span></span>
<span class="line"><span>    GM_ADDR sendSizeGM_ = workspaceGM;</span></span>
<span class="line"><span>    GM_ADDR sendOffsetGM_ = sendSizeGM_ + rankDim * sizeof(uint64_t) * 2;</span></span>
<span class="line"><span>    __gm__ uint64_t *sendSizes = reinterpret_cast&lt;__gm__ uint64_t *&gt;(sendSizeGM_);</span></span>
<span class="line"><span>    __gm__ uint64_t *sendOffsets = reinterpret_cast&lt;__gm__ uint64_t *&gt;(sendOffsetGM_);</span></span>
<span class="line"><span>    for (uint32_t i = 0U; i &lt; rankDim; i++) { // 当前ccu通信都是双die，所以sendSize和sendOffset需要等分切成die0和die1的数据</span></span>
<span class="line"><span>        sendSizes[i] = perRankDataSize_ / 2;</span></span>
<span class="line"><span>        sendSizes[i + rankDim] = perRankDataSize_ - perRankDataSize_ / 2;</span></span>
<span class="line"><span>        sendOffsets[i] = i * perRankDataSize_;</span></span>
<span class="line"><span>        sendOffsets[i + rankDim] = i * perRankDataSize_ + sendSizes[i];</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    uint64_t remoteWinOffset = rankId * perRankDataSize_;</span></span>
<span class="line"><span>    uint64_t localDataSize = perRankDataSize_;</span></span>
<span class="line"><span>    if (TILING_KEY_IS(1000UL)) {</span></span>
<span class="line"><span>        if ASCEND_IS_AIV {</span></span>
<span class="line"><span>            AscendC::HcclHandle handleId = -1;</span></span>
<span class="line"><span>            handleId = hccl.AlltoAllvWrite&lt;true&gt;(xGM, sendOffsetGM_, sendSizeGM_, remoteWinOffset, localDataSize);</span></span>
<span class="line"><span>            hccl.Wait(handleId);</span></span>
<span class="line"><span>            AscendC::SyncAll&lt;true&gt;();  // 全AIV核同步，防止0核执行过快，提前调用hccl.Finalize()接口，导致其他核Wait卡死</span></span>
<span class="line"><span>            hccl.Finalize();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div>`,20)])])}const u=n(i,[["render",p]]);export{A as __pageData,u as default};
