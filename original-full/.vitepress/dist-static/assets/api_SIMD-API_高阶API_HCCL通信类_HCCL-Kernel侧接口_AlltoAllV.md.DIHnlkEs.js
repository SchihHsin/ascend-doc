import{c as n,Q as a,j as l,m as t}from"./chunks/framework.DOi4mjdC.js";const e="/assets/allreduce-61.CLdqTw4x.png",p="/assets/%E9%9D%9E%E5%88%87%E5%88%86%E5%9C%BA%E6%99%AF%E4%B8%8B4%E5%8D%A1AlltoAllV%E5%9B%BE%E7%A4%BA.D7LKsL5j.png",i="/assets/%E9%9D%9E%E5%88%87%E5%88%86%E5%9C%BA%E6%99%AF%E4%B8%8B4%E5%8D%A1%E4%B8%8D%E5%9D%87%E5%8C%80%E6%94%B6%E5%8F%91.2IsL_j-c.png",_=JSON.parse('{"title":"AlltoAllV","description":"","frontmatter":{},"headers":[{"level":1,"title":"AlltoAllV","slug":"alltoallv"},{"level":2,"title":"产品支持情况","slug":"产品支持情况"},{"level":2,"title":"功能说明","slug":"功能说明"},{"level":2,"title":"函数原型","slug":"函数原型"},{"level":2,"title":"参数说明","slug":"参数说明"},{"level":2,"title":"返回值说明","slug":"返回值说明"},{"level":2,"title":"约束说明","slug":"约束说明"},{"level":2,"title":"调用示例","slug":"调用示例"}],"relativePath":"api/SIMD-API/高阶API/HCCL通信类/HCCL-Kernel侧接口/AlltoAllV.md","filePath":"api/SIMD-API/高阶API/HCCL通信类/HCCL-Kernel侧接口/AlltoAllV.md"}'),c={name:"api/SIMD-API/高阶API/HCCL通信类/HCCL-Kernel侧接口/AlltoAllV.md"};function r(d,s,o,u,A,C){return a(),l("div",null,[...s[0]||(s[0]=[t('<h1 id="alltoallv" tabindex="-1">AlltoAllV <a class="header-anchor" href="#alltoallv" aria-label="Permalink to &quot;AlltoAllV&quot;">​</a></h1><h2 id="产品支持情况" tabindex="-1">产品支持情况 <a class="header-anchor" href="#产品支持情况" aria-label="Permalink to &quot;产品支持情况&quot;">​</a></h2><table tabindex="0"><thead><tr><th>产品</th><th>是否支持</th></tr></thead><tbody><tr><td>Ascend 950PR/Ascend 950DT</td><td>√</td></tr><tr><td>Atlas A3 训练系列产品/Atlas A3 推理系列产品</td><td>√</td></tr><tr><td>Atlas A2 训练系列产品/Atlas A2 推理系列产品</td><td>x</td></tr><tr><td>Atlas 200I/500 A2 推理产品</td><td>x</td></tr><tr><td>Atlas 推理系列产品AI Core</td><td>x</td></tr><tr><td>Atlas 推理系列产品Vector Core</td><td>x</td></tr><tr><td>Atlas 训练系列产品</td><td>x</td></tr></tbody></table><h2 id="功能说明" tabindex="-1">功能说明 <a class="header-anchor" href="#功能说明" aria-label="Permalink to &quot;功能说明&quot;">​</a></h2><p>集合通信AlltoAllV的任务下发接口，返回该任务的标识handleId给用户。AlltoAll是AlltoAllV的一个子集，AlltoAll要求所有卡的收发数据量相同，AlltoAllV则不需要数据量相同，使用上更加灵活。</p><p>AlltoAllV的功能为：通信域内的卡互相发送和接收数据，并且定制每张卡给其它卡发送的数据量和从其它卡接收的数据量，以及定制发送和接收的数据在内存中的偏移。结合原型中的参数，描述接口功能，具体为：第i张卡发送sendBuf内存中第j块数据到第j张卡，该块数据在sendBuf中偏移为sdispls[j]的位置，且数据量为sendCounts[j]，第j张卡将该数据存放到本卡recvBuf中偏移为rdispls[i]的位置，接收数据量为recvCounts[i]，这里的sendCounts[j]与recvCounts[i]需要相等。注意：这里的偏移和数据量均为数据的个数，单位为sizeof(sendType)。</p><p><img src="'+e+`" alt=""></p><h2 id="函数原型" tabindex="-1">函数原型 <a class="header-anchor" href="#函数原型" aria-label="Permalink to &quot;函数原型&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>template &lt;bool commit = false&gt;</span></span>
<span class="line"><span>__aicore__ inline HcclHandle AlltoAllV(GM_ADDR sendBuf, void *sendCounts, void *sdispls, HcclDataType sendType, GM_ADDR recvBuf, void *recvCounts, void *rdispls, HcclDataType recvType, uint8_t repeat = 1)</span></span></code></pre></div><h2 id="参数说明" tabindex="-1">参数说明 <a class="header-anchor" href="#参数说明" aria-label="Permalink to &quot;参数说明&quot;">​</a></h2><p><strong>表 1</strong> 模板参数说明</p><table tabindex="0"><thead><tr><th>参数名</th><th>输入/输出</th><th>描述</th></tr></thead><tbody><tr><td>commit</td><td>输入</td><td>bool类型。参数取值如下： true：在调用Prepare接口时，Commit同步通知服务端可以执行该通信任务。false：在调用Prepare接口时，不通知服务端执行该通信任务。</td></tr></tbody></table><p><strong>表 2</strong> 接口参数说明</p><table tabindex="0"><thead><tr><th>参数名</th><th>输入/输出</th><th>描述</th></tr></thead><tbody><tr><td>sendBuf</td><td>输入</td><td>源数据buffer地址。</td></tr><tr><td>sendCounts</td><td>输入</td><td>本卡向通信域内其它每张卡发送的数据量，sendCounts[i]表示本卡发送到第i张卡rank_i的数据量，单位是sizeof(sendType)。 sendCounts是一个uint64_t类型的数组，数组长度必须为通信域内总rank数。 例如：sendBuf内数据的数据类型为fp16，sendCounts[0]=1，sendCounts[1]=2，表示本rank给rank0发送1个fp16数据，给rank1发送2个fp16数据。</td></tr><tr><td>sdispls</td><td>输入</td><td>本卡向其它卡发送的数据在sendBuf中的偏移，sdispls[i]=n表示本卡发送给rank_i的数据块在sendBuf中的偏移数据量为n。 sdispls是一个uint64_t类型的数组，数组长度必须为通信域内总rank数。</td></tr><tr><td>sendType</td><td>输入</td><td>sendBuf内数据的数据类型，目前支持HcclDataType包含的全部数据类型，HcclDataType详细可参考表1。</td></tr><tr><td>recvBuf</td><td>输出</td><td>目的数据buffer地址，集合通信结果输出到此buffer中。</td></tr><tr><td>recvCounts</td><td>输入</td><td>本卡从其它卡接收的数据量，recvCounts[i]表示本rank接收到的来自rank_i的数据个数，单位是sizeof(recvType)。 recvCounts是一个uint64_t类型的数组，数组长度必须为通信域内总rank数。 例如：recvBuf内数据的数据类型为fp16，recvCounts[0]=1，recvCounts[1]=2，表示本rank接收到rank0的1个fp16数据，接收到rank1的2个fp16数据。</td></tr><tr><td>rdispls</td><td>输入</td><td>本卡接收的数据存放在recvBuf中的偏移，rdispls[i]=n表示本卡接收到的rank_i的数据块在recvBuf中的偏移数据量为n。 rdispls是一个uint64_t类型的数组，数组长度必须为通信域内总rank数。</td></tr><tr><td>recvType</td><td>输入</td><td>recvBuf内数据的数据类型，目前支持HcclDataType包含的全部数据类型，HcclDataType详细可参考表1。 注意：recvType和sendType必须一致。</td></tr><tr><td>repeat</td><td>输入</td><td>一次下发的AlltoAllV通信任务个数。repeat取值≥1，默认值为1。当repeat&gt;1时，每个AlltoAllV任务的sendBuf\\sendCounts\\recvBuf\\recvCounts参数不变，sdispls和rdispls由服务端更新，每一轮任务i的更新公式如下： sdispls[i] = sdispls[i] + sendCounts[i], i∈[0, sdispls.size()) rdispls[i] = rdispls[i] + recvCounts[i], i∈[0, rdispls.size()) 注意：当设置repeat&gt;1时，须根据此计算公式，规划通信内存。</td></tr></tbody></table><h2 id="返回值说明" tabindex="-1">返回值说明 <a class="header-anchor" href="#返回值说明" aria-label="Permalink to &quot;返回值说明&quot;">​</a></h2><p>返回该任务的标识handleId，handleId大于等于0。调用失败时，返回 -1。</p><h2 id="约束说明" tabindex="-1">约束说明 <a class="header-anchor" href="#约束说明" aria-label="Permalink to &quot;约束说明&quot;">​</a></h2><ul><li>调用本接口前确保已调用过<a href="./InitV2.html">InitV2</a>和<a href="./SetCcTilingV2.html">SetCcTilingV2</a>接口。</li><li>若HCCL对象的<a href="./HCCL模板参数.html#table884518212555">config模板参数</a>未指定下发通信任务的核，该接口只能在AIC核或者AIV核两者之一上调用。若HCCL对象的<a href="./HCCL模板参数.html#table884518212555">config模板参数</a>中指定了下发通信任务的核，则该接口可以在AIC核和AIV核上同时调用，接口内部会根据指定的核的类型，只在AIC核、AIV核二者之一下发该通信任务。</li><li>一个通信域内，所有Prepare接口和InterHcclGroupSync接口的总调用次数不能超过63。</li><li>每张卡发送给卡rank_j的数据量sendCounts[j]，与rank_j接收对应卡rank_i的数据量recvCounts[i]，必须相等。</li><li>对于Atlas A3 训练系列产品/Atlas A3 推理系列产品，一个通信域内，最大支持128卡通信。</li><li>对于Ascend 950PR/Ascend 950DT，一个通信域内，所有Prepare接口的总调用次数不能超过63。</li><li>对于Ascend 950PR/Ascend 950DT，通信服务端为CCU时，单次最大通信数据量不能超过256M。</li></ul><h2 id="调用示例" tabindex="-1">调用示例 <a class="header-anchor" href="#调用示例" aria-label="Permalink to &quot;调用示例&quot;">​</a></h2><ul><li><p>使用AlltoAllV接口等效实现4卡间的AlltoAll通信</p><p>4张卡调用AlltoAllV接口。非多轮切分场景下，每张卡上的数据块和数据量一致，如下图中每张卡的A\\B\\C\\D数据块，数据量均为dataCount。</p><p><strong>图 1</strong> 非切分场景下4卡AlltoAllV图示<br><img src="`+p+`" alt="" title="非切分场景下4卡AlltoAllV图示"></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>extern &quot;C&quot; __global__ __aicore__ void alltoallv_custom(GM_ADDR xGM, GM_ADDR yGM, GM_ADDR workspaceGM, GM_ADDR tilingGM) {</span></span>
<span class="line"><span>    constexpr uint32_t rankNum = 4U;	</span></span>
<span class="line"><span>    constexpr uint32_t dataCount = 10U;   // 假设图中A\\B\\C\\D数据块的个数均为10个</span></span>
<span class="line"><span>    uint64_t sendCounts[rankNum] = {0};</span></span>
<span class="line"><span>    uint64_t sDisplacements[rankNum] = {0};</span></span>
<span class="line"><span>    uint64_t recvCounts[rankNum] = {0};</span></span>
<span class="line"><span>    uint64_t rDisplacements[rankNum] = {0};</span></span>
<span class="line"><span>    for (uint32_t i = 0U; i &lt; rankNum; ++i) {</span></span>
<span class="line"><span>        sendCounts[i] = dataCount;</span></span>
<span class="line"><span>        sDisplacements[i] = i * dataCount;</span></span>
<span class="line"><span>        recvCounts[i] = dataCount;</span></span>
<span class="line"><span>        rDisplacements[i] = i * dataCount;</span></span>
<span class="line"><span>    }	</span></span>
<span class="line"><span>    auto sendBuf = xGM;  // xGM为AlltoAllV的输入GM地址</span></span>
<span class="line"><span>    auto recvBuf = yGM;  // yGM为AlltoAllV的输出GM地址</span></span>
<span class="line"><span>    auto dtype = HcclDataType::HCCL_DATA_TYPE_FP16;</span></span>
<span class="line"><span>    REGISTER_TILING_DEFAULT(AllToAllVCustomTilingData); //AllToAllVCustomTilingData为对应算子头文件定义的结构体</span></span>
<span class="line"><span>    GET_TILING_DATA_WITH_STRUCT(AllToAllVCustomTilingData, tilingData, tilingGM);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Hccl hccl;</span></span>
<span class="line"><span>    GM_ADDR contextGM = AscendC::GetHcclContext&lt;0&gt;();  // AscendC自定义算子kernel中，通过此方式获取HCCL context</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (AscendC::g_coreType == AIV) {  // 指定AIV核通信   </span></span>
<span class="line"><span>        hccl.InitV2(contextGM, &amp;tilingData);</span></span>
<span class="line"><span>        auto ret = hccl.SetCcTilingV2(offsetof(AllToAllVCustomTilingData, alltoallvCcTiling));</span></span>
<span class="line"><span>        if (ret != HCCL_SUCCESS) {</span></span>
<span class="line"><span>          return;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        auto handleId1 = hccl.AlltoAllV&lt;true&gt;(sendBuf, sendCounts, sDisplacements, dtype, </span></span>
<span class="line"><span>                                               recvBuf, recvCounts, rDisplacements, dtype);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        hccl.Wait(handleId1);    </span></span>
<span class="line"><span>        AscendC::SyncAll&lt;true&gt;();  // 全AIV核同步，防止0核执行过快，提前调用hccl.Finalize()接口，导致其他核Wait卡死   </span></span>
<span class="line"><span>        hccl.Finalize();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div></li><li><p>使用AlltoAllV接口实现4卡间不同数据量的数据收发</p><p>如下图所示，每个rank下的方格中数字表示发送或接收的数据个数，以rank1为例进行说明：rank1分别向rank0、rank1、rank2、rank3发送2、2、3、2个数据，并分别从rank0、rank1、rank2、rank3接收3、2、4、3个数据，对应的代码示例如下。</p><p><strong>图 2</strong> 非切分场景下4卡不均匀收发<br><img src="`+i+`" alt="" title="非切分场景下4卡不均匀收发"></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>extern &quot;C&quot; __global__ __aicore__ void alltoallv_custom(GM_ADDR xGM, GM_ADDR yGM, GM_ADDR workspaceGM, GM_ADDR tilingGM) {</span></span>
<span class="line"><span>    constexpr uint32_t rankNum = 4U;	</span></span>
<span class="line"><span>    uint64_t sendCounts[rankNum] = {0};</span></span>
<span class="line"><span>    uint64_t sDisplacements[rankNum] = {0};</span></span>
<span class="line"><span>    uint64_t recvCounts[rankNum] = {0};</span></span>
<span class="line"><span>    uint64_t rDisplacements[rankNum] = {0};</span></span>
<span class="line"><span>    auto sendBuf = xGM;  // xGM为AlltoAllV的输入GM地址</span></span>
<span class="line"><span>    auto recvBuf = yGM;  // yGM为AlltoAllV的输出GM地址</span></span>
<span class="line"><span>    auto dtype = HcclDataType::HCCL_DATA_TYPE_FP16;</span></span>
<span class="line"><span>    REGISTER_TILING_DEFAULT(AllToAllVCustomTilingData); //AllToAllVCustomTilingData为对应算子头文件定义的结构体</span></span>
<span class="line"><span>    GET_TILING_DATA_WITH_STRUCT(AllToAllVCustomTilingData, tilingData, tilingGM);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Hccl hccl;</span></span>
<span class="line"><span>    GM_ADDR contextGM = AscendC::GetHcclContext&lt;0&gt;();  // AscendC自定义算子kernel中，通过此方式获取HCCL context</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (AscendC::g_coreType == AIV) {  // 指定AIV核通信   </span></span>
<span class="line"><span>        hccl.InitV2(contextGM, &amp;tilingData);</span></span>
<span class="line"><span>        auto ret = hccl.SetCcTilingV2(offsetof(AllToAllVCustomTilingData, alltoallvCcTiling));</span></span>
<span class="line"><span>        if (ret != HCCL_SUCCESS) {</span></span>
<span class="line"><span>          return;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        if(hccl.GetRankId() == 0) {</span></span>
<span class="line"><span>            sendCounts[0] = 3; sendCounts[1] = 3; sendCounts[2] = 3; sendCounts[3] = 3;</span></span>
<span class="line"><span>            sDisplacements[1] = 3; sDisplacements[2] = 6; sDisplacements[2] = 9;</span></span>
<span class="line"><span>            recvCounts[0] = 3; recvCounts[1] = 2; recvCounts[2] = 1; recvCounts[3] = 3;</span></span>
<span class="line"><span>            rDisplacements[1] = 3; rDisplacements[2] = 5; rDisplacements[3] = 6;</span></span>
<span class="line"><span>        } else if(hccl.GetRankId() == 1) {</span></span>
<span class="line"><span>            sendCounts[0] = 2; sendCounts[1] = 2; sendCounts[2] = 3; sendCounts[3] = 2;</span></span>
<span class="line"><span>            sDisplacements[1] = 2; sDisplacements[2] = 4; sDisplacements[2] = 7;</span></span>
<span class="line"><span>            recvCounts[0] = 3; recvCounts[1] = 2; recvCounts[2] = 4; recvCounts[3] = 3;</span></span>
<span class="line"><span>            rDisplacements[1] = 3; rDisplacements[2] = 5; rDisplacements[3] = 9;</span></span>
<span class="line"><span>        } else if(hccl.GetRankId() == 2) {</span></span>
<span class="line"><span>            sendCounts[0] = 1; sendCounts[1] = 4; sendCounts[2] = 4; sendCounts[3] = 4;</span></span>
<span class="line"><span>            sDisplacements[1] = 1; sDisplacements[2] = 5; sDisplacements[2] = 9;</span></span>
<span class="line"><span>            recvCounts[0] = 3; recvCounts[1] = 3; recvCounts[2] = 4; recvCounts[3] = 3;</span></span>
<span class="line"><span>            rDisplacements[1] = 3; rDisplacements[2] = 6; rDisplacements[3] = 10;</span></span>
<span class="line"><span>        } else if(hccl.GetRankId() == 3) {</span></span>
<span class="line"><span>            sendCounts[0] = 3; sendCounts[1] = 3; sendCounts[2] = 3; sendCounts[3] = 3;</span></span>
<span class="line"><span>            sDisplacements[1] = 3; sDisplacements[2] = 6; sDisplacements[2] = 9;</span></span>
<span class="line"><span>            recvCounts[0] = 3; recvCounts[1] = 2; recvCounts[2] = 4; recvCounts[3] = 3;</span></span>
<span class="line"><span>            rDisplacements[1] = 3; rDisplacements[2] = 5; rDisplacements[3] = 9;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        auto handleId = hccl.AlltoAllV&lt;true&gt;(sendBuf, sendCounts, sDisplacements, dtype, </span></span>
<span class="line"><span>                                               recvBuf, recvCounts, rDisplacements, dtype);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        hccl.Wait(handleId);    </span></span>
<span class="line"><span>        AscendC::SyncAll&lt;true&gt;();  // 全AIV核同步，防止0核执行过快，提前调用hccl.Finalize()接口，导致其他核Wait卡死   </span></span>
<span class="line"><span>        hccl.Finalize();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div></li></ul>`,20)])])}const D=n(c,[["render",r]]);export{_ as __pageData,D as default};
