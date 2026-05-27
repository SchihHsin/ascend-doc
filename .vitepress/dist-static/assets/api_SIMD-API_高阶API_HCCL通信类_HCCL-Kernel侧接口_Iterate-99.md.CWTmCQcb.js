import{c as n,Q as a,j as l,m as e}from"./chunks/framework.DOi4mjdC.js";const t="/assets/%E4%BD%BF%E7%94%A8pairwise%E7%AE%97%E6%B3%95%E7%9A%84AlltoAllV%E9%80%9A%E4%BF%A1%E6%AD%A5%E9%AA%A4%E7%A4%BA%E6%84%8F%E5%9B%BE.D8piw9mf.png",A=JSON.parse('{"title":"Iterate","description":"","frontmatter":{},"headers":[{"level":1,"title":"Iterate","slug":"iterate"},{"level":2,"title":"产品支持情况","slug":"产品支持情况"},{"level":2,"title":"功能说明","slug":"功能说明"},{"level":2,"title":"函数原型","slug":"函数原型"},{"level":2,"title":"参数说明","slug":"参数说明"},{"level":2,"title":"返回值说明","slug":"返回值说明"},{"level":2,"title":"约束说明","slug":"约束说明"},{"level":2,"title":"调用示例","slug":"调用示例"}],"relativePath":"api/SIMD-API/高阶API/HCCL通信类/HCCL-Kernel侧接口/Iterate-99.md","filePath":"api/SIMD-API/高阶API/HCCL通信类/HCCL-Kernel侧接口/Iterate-99.md"}'),p={name:"api/SIMD-API/高阶API/HCCL通信类/HCCL-Kernel侧接口/Iterate-99.md"};function i(c,s,r,o,d,u){return a(),l("div",null,[...s[0]||(s[0]=[e('<h1 id="iterate" tabindex="-1">Iterate <a class="header-anchor" href="#iterate" aria-label="Permalink to &quot;Iterate&quot;">​</a></h1><h2 id="产品支持情况" tabindex="-1">产品支持情况 <a class="header-anchor" href="#产品支持情况" aria-label="Permalink to &quot;产品支持情况&quot;">​</a></h2><table tabindex="0"><thead><tr><th>产品</th><th>是否支持</th></tr></thead><tbody><tr><td>Ascend 950PR/Ascend 950DT</td><td>x</td></tr><tr><td>Atlas A3 训练系列产品/Atlas A3 推理系列产品</td><td>√</td></tr><tr><td>Atlas A2 训练系列产品/Atlas A2 推理系列产品</td><td>√</td></tr><tr><td>Atlas 200I/500 A2 推理产品</td><td>x</td></tr><tr><td>Atlas 推理系列产品AI Core</td><td>x</td></tr><tr><td>Atlas 推理系列产品Vector Core</td><td>x</td></tr><tr><td>Atlas 训练系列产品</td><td>x</td></tr></tbody></table><h2 id="功能说明" tabindex="-1">功能说明 <a class="header-anchor" href="#功能说明" aria-label="Permalink to &quot;功能说明&quot;">​</a></h2><p>在某些算法下，一次完整的集合通信任务可以细分为多个步骤，对每个步骤的数据完成点对点的通信任务，称为细粒度通信。以通信算法&quot;AlltoAll=level0:fullmesh;level1:pairwise&quot;、通信步长为1的AlltoAllV通信任务为例，这里参数level0代表配置Server（昇腾AI Server，通常是8卡或16卡的昇腾NPU设备组成的服务器形态的统称）内通信算法，参数level1代表配置Server间通信算法，fullmesh为全连接通信算法，pairwise为逐对通信算法；如下图所示，该示例展示了AlltoAllV通信的所有待发送数据、每一步通信完成后各卡收到的数据。</p><p><strong>图 1</strong> 使用pairwise算法的AlltoAllV通信步骤示意图<br><img src="'+t+`" alt="" title="使用pairwise算法的AlltoAllV通信步骤示意图"></p><p>在通算融合算子中，通过调用本接口，结合对应的Prepare原语，获取通信算法每一步的输入或输出，让计算、通信实现更精细粒度的流水排布，从而获得更好的性能收益。</p><h2 id="函数原型" tabindex="-1">函数原型 <a class="header-anchor" href="#函数原型" aria-label="Permalink to &quot;函数原型&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>template &lt;bool sync = true&gt;</span></span>
<span class="line"><span>__aicore__ inline int32_t Iterate(HcclHandle handleId, uint16_t *seqSlices, uint16_t seqSliceLen)</span></span></code></pre></div><h2 id="参数说明" tabindex="-1">参数说明 <a class="header-anchor" href="#参数说明" aria-label="Permalink to &quot;参数说明&quot;">​</a></h2><p><strong>表 1</strong> 模板参数说明</p><table tabindex="0"><thead><tr><th>参数名</th><th>输入/输出</th><th>描述</th></tr></thead><tbody><tr><td>sync</td><td>输入</td><td>bool类型。是否需要等待当前通信步骤完成再进行后续计算或通信任务，参数取值如下： true：默认值，表示阻塞并等待当前通信步骤完成。该参数取值为true时，无需再调用Wait接口等待通信任务完成。false：表示不等待当前通信步骤完成。</td></tr></tbody></table><p><strong>表 2</strong> 接口参数说明</p><table tabindex="0"><thead><tr><th>参数名</th><th>输入/输出</th><th>描述</th></tr></thead><tbody><tr><td>handleId</td><td>输入</td><td>对应通信任务的标识ID，只能使用Prepare原语接口的返回值。 &lt;pre class=&quot;screen&quot; codetype=&quot;Cpp&quot; id=&quot;zh-cn_topic_0000001952464897_screen103142322514&quot;&gt;using HcclHandle = int8_t;&lt;/pre&gt;</td></tr><tr><td>seqSlices</td><td>输出</td><td>由用户申请的栈空间，用于保存当前通信步骤的输入或输出数据块的索引下标。在先计算后通信场景，该参数返回当前通信步骤需要的输入数据块索引；在先通信后计算场景，该参数返回当前通信步骤的输出数据块索引。</td></tr><tr><td>seqSliceLen</td><td>输入</td><td>seqSlices数组的长度。根据算法的通信步长及算法逻辑，取每一步通信需要保存的数据块索引个数为该数组长度。</td></tr></tbody></table><h2 id="返回值说明" tabindex="-1">返回值说明 <a class="header-anchor" href="#返回值说明" aria-label="Permalink to &quot;返回值说明&quot;">​</a></h2><ul><li><p>当通信任务未结束时：</p><ul><li>在先计算后通信场景，返回值为当前通信步骤需要的输入数据块数量，与参数seqSliceLen数值相同。</li><li>在先通信后计算场景，返回值为当前通信步骤产生的输出数据块数量，与参数seqSliceLen数值相同。</li></ul></li><li><p>当通信任务结束后，返回值为0。</p></li></ul><h2 id="约束说明" tabindex="-1">约束说明 <a class="header-anchor" href="#约束说明" aria-label="Permalink to &quot;约束说明&quot;">​</a></h2><ul><li>调用本接口前确保已调用过<a href="./InitV2.html">InitV2</a>和<a href="./SetCcTilingV2.html">SetCcTilingV2</a>接口。</li><li>入参handleId只能使用Prepare原语对应接口的返回值。</li><li>本接口当前支持的通信算法为&quot;AlltoAll=level0:fullmesh;level1:pairwise&quot;。</li></ul><h2 id="调用示例" tabindex="-1">调用示例 <a class="header-anchor" href="#调用示例" aria-label="Permalink to &quot;调用示例&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>extern &quot;C&quot; __global__ __aicore__ void alltoallv_custom(GM_ADDR sendBuf, GM_ADDR recvBuf, GM_ADDR workspaceGM, GM_ADDR tilingGM) {</span></span>
<span class="line"><span>    // 指定AIV核通信</span></span>
<span class="line"><span>    if (AscendC::g_coreType != AIV) {</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    constexpr uint32_t RANK_NUM = 4U;</span></span>
<span class="line"><span>    constexpr uint32_t STEP_SIZE = 1U; // 细粒度通信步长，通常使用SetStepSize接口设置，示例代码简化成1</span></span>
<span class="line"><span>    constexpr uint64_t sendCounts[RANK_NUM][RANK_NUM] = {</span></span>
<span class="line"><span>        {3, 3, 3, 3}, {2, 2, 3, 2},</span></span>
<span class="line"><span>        {1, 4, 4, 4}, {3, 3, 3, 3}</span></span>
<span class="line"><span>    };</span></span>
<span class="line"><span>    constexpr uint64_t sDisplacements[RANK_NUM][RANK_NUM] = {</span></span>
<span class="line"><span>        {0, 3, 6, 9}, {0, 2, 4, 7},</span></span>
<span class="line"><span>        {0, 1, 5, 9}, {0, 3, 6, 9}</span></span>
<span class="line"><span>    };</span></span>
<span class="line"><span>    constexpr uint64_t recvCounts[RANK_NUM][RANK_NUM] = {</span></span>
<span class="line"><span>        {3, 2, 1, 3}, {3, 2, 4, 3},</span></span>
<span class="line"><span>        {3, 3, 4, 3}, {3, 2, 4, 3}</span></span>
<span class="line"><span>    };</span></span>
<span class="line"><span>    constexpr uint64_t rDisplacements[RANK_NUM][RANK_NUM] = {</span></span>
<span class="line"><span>        {0, 3, 5, 6}, {0, 3, 5, 9},</span></span>
<span class="line"><span>        {0, 3, 6, 10}, {0, 3, 5, 9}</span></span>
<span class="line"><span>    };</span></span>
<span class="line"><span>    HcclDataType dtype = HcclDataType::HCCL_DATA_TYPE_FP16;</span></span>
<span class="line"><span>    REGISTER_TILING_DEFAULT(AllToAllVCustomTilingData); // AllToAllVCustomTilingData为对应算子头文件定义的结构体</span></span>
<span class="line"><span>    GET_TILING_DATA_WITH_STRUCT(AllToAllVCustomTilingData, tilingData, tilingGM);</span></span>
<span class="line"><span>    GM_ADDR contextGM = AscendC::GetHcclContext&lt;0&gt;();  // AscendC自定义算子kernel中，通过此方式获取HCCL context</span></span>
<span class="line"><span>    Hccl hccl;</span></span>
<span class="line"><span>    hccl.InitV2(contextGM, &amp;tilingData);</span></span>
<span class="line"><span>    auto ret = hccl.SetCcTilingV2(offsetof(AllToAllVCustomTilingData, alltoallvCcTiling));</span></span>
<span class="line"><span>    if (ret != HCCL_SUCCESS) {</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    const uint32_t selfRankId = hccl.GetRankId();</span></span>
<span class="line"><span>    // 当通信任务为&quot;AlltoAll=level0:fullmesh;level1:pairwise&quot;时</span></span>
<span class="line"><span>    // 1. 每步通信产生的数据块数量等于STEP_SIZE</span></span>
<span class="line"><span>    // 2. 总的通信步数为RANK_NUM/STEP_SIZE*repeat</span></span>
<span class="line"><span>    uint16_t sliceInfo[STEP_SIZE];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (TILING_KEY_IS(1000UL)) {</span></span>
<span class="line"><span>        // 通算融合中的“先通信后计算”场景，即每一步都是先通信，再将通信的输出作为计算的输入并执行计算</span></span>
<span class="line"><span>        const auto handleId = hccl.AlltoAllV&lt;true&gt;(sendBuf, sendCounts[selfRankId], sDisplacements[selfRankId], dtype,</span></span>
<span class="line"><span>                                                   recvBuf, recvCounts[selfRankId], rDisplacements[selfRankId], dtype);</span></span>
<span class="line"><span>        // 模板参数sync = true，表示该接口会阻塞等待每一步通信结果，并将输出数据块的下标索引填入sliceInfo中</span></span>
<span class="line"><span>        while (hccl.Iterate&lt;true&gt;(handleId, sliceInfo, sizeof(sliceInfo) / sizeof(sliceInfo[0]))) {</span></span>
<span class="line"><span>            // 每一步通信的输出数据块的下标索引保存在sliceInfo中，可以插入相应的计算流程，实现细粒度的通算融合</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        // Iterate已经会阻塞等待，因此不再需要Wait</span></span>
<span class="line"><span>        // hccl.Wait(handleId);</span></span>
<span class="line"><span>    } else if (TILING_KEY_IS(1001UL)) {</span></span>
<span class="line"><span>        // 通算融合中的“先计算后通信”场景，即每一步都是先计算，再将计算的结果作为通信的输入并提交通信事务</span></span>
<span class="line"><span>        const uint8_t tileNum = 2U;</span></span>
<span class="line"><span>        const auto handleId = hccl.AlltoAllV&lt;false&gt;(sendBuf, sendCounts[selfRankId], sDisplacements[selfRankId], dtype,</span></span>
<span class="line"><span>                                                    recvBuf, recvCounts[selfRankId], rDisplacements[selfRankId], dtype,</span></span>
<span class="line"><span>                                                    tileNum);</span></span>
<span class="line"><span>        for (uint8_t i = 0; i &lt; tileNum; ++i) {</span></span>
<span class="line"><span>            for (uint8_t j = 0; j &lt; RANK_NUM; ++j) {</span></span>
<span class="line"><span>                // 模板参数sync = false，表示该接口不会阻塞等待，只会将当前这一步通信的输入数据块填入sliceInfo中</span></span>
<span class="line"><span>                if (hccl.Iterate&lt;false&gt;(handleId, sliceInfo, sizeof(sliceInfo) / sizeof(sliceInfo[0])) &lt;= 0) {</span></span>
<span class="line"><span>                    break;</span></span>
<span class="line"><span>                }</span></span>
<span class="line"><span>                // sliceInfo表示相对地址偏移，需要结合sDisplacements进行GM地址的运算，保证通信的输入正确</span></span>
<span class="line"><span>                // 计算完之后需要核间同步，再通过Commit接口通知服务端进行集合通信</span></span>
<span class="line"><span>                hccl.Commit(handleId);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        for (uint8_t i = 0; i &lt; tileNum * RANK_NUM; ++i) {</span></span>
<span class="line"><span>            hccl.Wait(handleId);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    AscendC::SyncAll&lt;true&gt;();</span></span>
<span class="line"><span>    hccl.Finalize();</span></span>
<span class="line"><span>}</span></span></code></pre></div>`,20)])])}const _=n(p,[["render",i]]);export{A as __pageData,_ as default};
