import{c as n,Q as s,j as e,m as t}from"./chunks/framework.DOi4mjdC.js";const p="/assets/AI-Core%E4%B8%8B%E5%8F%91HCCL%E9%80%9A%E4%BF%A1%E4%BB%BB%E5%8A%A1%E6%9C%BA%E5%88%B6.Bb54UpBK.png",l="/assets/Ascend-950PR-Ascend-950DT-AI-Core%E4%B8%8B%E5%8F%91HCCL%E9%80%9A%E4%BF%A1%E4%BB%BB%E5%8A%A1%E6%9C%BA%E5%88%B6.DXupkX9H.png",i="/assets/ReduceScatter%E9%80%9A%E4%BF%A1%E7%A4%BA%E4%BE%8B.Cas_q9E_.png",A=JSON.parse('{"title":"HCCL使用说明","description":"","frontmatter":{},"headers":[{"level":1,"title":"HCCL使用说明","slug":"hccl使用说明"}],"relativePath":"api/SIMD-API/高阶API/HCCL通信类/HCCL-Kernel侧接口/HCCL使用说明.md","filePath":"api/SIMD-API/高阶API/HCCL通信类/HCCL-Kernel侧接口/HCCL使用说明.md"}'),c={name:"api/SIMD-API/高阶API/HCCL通信类/HCCL-Kernel侧接口/HCCL使用说明.md"};function C(r,a,d,o,_,u){return s(),e("div",null,[...a[0]||(a[0]=[t('<h1 id="hccl使用说明" tabindex="-1">HCCL使用说明 <a class="header-anchor" href="#hccl使用说明" aria-label="Permalink to &quot;HCCL使用说明&quot;">​</a></h1><p>Ascend C提供一组HCCL通信类高阶API，方便算子Kernel开发用户在AI Core侧灵活管理通算融合算子中计算与通信任务的执行顺序。</p><p>HCCL为<strong>集合通信任务客户端</strong>，主要对外提供了集合通信原语接口（以下统称为Prepare接口），对标集合通信C++接口，当前支持<a href="./AllReduce.html">AllReduce</a>、<a href="./AllGather.html">AllGather</a>、<a href="./ReduceScatter.html">ReduceScatter</a>、<a href="./AlltoAll.html">AlltoAll</a>接口等。本章的所有接口运行在AI Core上，且不执行通信任务，而是由用户调用Prepare接口将对应类型的通信任务信息发送给AI CPU或CCU服务端，并在合适的时机通过<a href="./Commit.html">Commit</a>接口通知AI CPU或CCU上的服务端执行对应的通信任务。注意，当前Ascend 950PR/Ascend 950DT上仅支持CCU服务端。</p><p>所谓合适的时机，取决于用户编排的是先通信后计算的任务，还是先计算后通信的任务。对于这两种场景，简述如下：</p><ul><li>先通信后计算的任务：典型的如AllGather通信+Matmul计算任务编排。此场景下，用户在调用AllGather接口下发通信任务之后，通过AllGather接口返回的该通信任务标识handleId，可立即调用Commit接口通知服务端执行该handleId对应的任务，同时用户调用<a href="./Wait-98.html">Wait</a>阻塞接口等待服务端通知handleId对应的通信任务执行结束，待该通信任务结束后，再执行计算任务。</li><li>先计算后通信的任务：典型的如Matmul计算+AllReduce通信任务编排。此场景下，用户可以先调用AllReduce接口通知服务端先下发通信任务，再调用Matmul计算接口进行计算，这样AllReduce任务的组装和任务下发及执行过程可以被Matmul的计算流水所掩盖，待计算任务完成后，调用Commit接口通知服务端执行AllReduce任务，无须调用Wait接口等待通信任务执行结束。</li></ul><p>当后续无通信任务时，调用<a href="./Finalize.html">Finalize</a>接口，通知服务端后续无通信任务，执行结束后退出，客户端检测并等待最后一个通信任务执行结束。以上介绍的AI Core下发HCCL通信任务的机制如下图所示。</p><p><strong>图 1</strong> AI Core下发HCCL通信任务机制<br><img src="'+p+'" alt="" title="AI-Core下发HCCL通信任务机制"></p><p><strong>图 2</strong> Ascend 950PR/Ascend 950DT AI Core下发HCCL通信任务机制<br><img src="'+l+`" alt="" title="Ascend-950PR-Ascend-950DT-AI-Core下发HCCL通信任务机制"></p><div class="caution custom-block github-alert"><p class="custom-block-title">注意</p><p>对于Atlas A3 训练系列产品/Atlas A3 推理系列产品，在AI CPU作为服务端的场景中，HCCL通信API的功能依赖开放AI CPU用户态下发调度任务，存在一定的安全风险，用户需要自行确保AI Core自定义算子的安全可靠，防止恶意攻击行为。</p></div><p>实现AI Core下发一个通信任务的具体步骤如下：</p><ol><li><p>创建HCCL对象，并调用初始化接口<a href="./InitV2.html">InitV2</a>。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 传initTiling地址的调用方式，推荐使用该方式</span></span>
<span class="line"><span>GET_TILING_DATA_WITH_STRUCT(AllGatherCustomTilingData, tilingData, tilingGM); // AllGatherCustomTilingData为对应算子头文件定义的结构体</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Hccl hccl;</span></span>
<span class="line"><span>Hccl&lt;HcclServerType::HCCL_SERVER_TYPE_CCU&gt; hccl; // 通过模板入参的方式选择硬件类型，默认AICPU，可以指定CCU</span></span>
<span class="line"><span>GM_ADDR contextGM = GetHcclContext&lt;0&gt;();  // AscendC自定义算子kernel中，通过此方式获取HCCL context</span></span>
<span class="line"><span></span></span>
<span class="line"><span>hccl.InitV2(contextGM, &amp;tilingData);</span></span></code></pre></div><p>当调用InitV2接口时，必须使用标准C++语法定义TilingData结构体的开发方式。如上示例代码中的tilingGM为host侧传入的、作为核函数入参的算子TilingData的GM地址，通过<a href="./../../../基础API/Kernel-Tiling/GET_TILING_DATA_WITH_STRUCT.html">GET_TILING_DATA_WITH_STRUCT</a>获取TilingData。调用<a href="./InitV2.html">InitV2</a>初始化接口时，需要传入通信上下文信息，可以通过框架提供的获取通信上下文的接口<a href="./../HCCL-Context/GetHcclContext.html">GetHcclContext</a>获取。</p></li><li><p>设置对应通信算法的Tiling地址。</p><p>通过<a href="./SetCcTilingV2.html">SetCcTilingV2</a>接口设置对应通信算法的Tiling地址，调用Commit接口后，该地址被发送到服务端由服务端解析。<a href="./SetCcTilingV2.html">SetCcTilingV2</a>接口必须与<a href="./InitV2.html">InitV2</a>接口配合使用。示例如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 传initTiling地址的调用方式</span></span>
<span class="line"><span>GET_TILING_DATA_WITH_STRUCT(AllGatherCustomTilingData, tilingData, tilingGM);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Hccl hccl;</span></span>
<span class="line"><span>GM_ADDR contextGM = GetHcclContext&lt;0&gt;();  // AscendC自定义算子kernel中，通过此方式获取HCCL context</span></span>
<span class="line"><span></span></span>
<span class="line"><span>hccl.InitV2(contextGM, &amp;tilingData);</span></span>
<span class="line"><span>if (SetCcTilingV2(offsetof(AllGatherCustomTilingData, mc2CcTiling)) != HCCL_SUCCESS) {</span></span>
<span class="line"><span>  return;</span></span>
<span class="line"><span>}</span></span></code></pre></div></li><li><p>用户通过对应的Prepare接口异步下发对应类型的通信任务，并获取到该任务的标识handleId，服务端接收到后开始通信任务的展开和下发，示例如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>auto handleId = hccl.ReduceScatter&lt;false&gt;(aGM, cGM, recvCount, </span></span>
<span class="line"><span>                                          AscendC::HCCL_DATA_TYPE_FP16,</span></span>
<span class="line"><span>                                          HCCL_REDUCE_SUM, strideCount, 1);</span></span>
<span class="line"><span>// 对于Prepare接口，在调试时可增加异常值校验和PRINTF打印</span></span>
<span class="line"><span>// if (handleId == INVALID_HANDLE_ID) {</span></span>
<span class="line"><span>// 	PRINTF(&quot;[ERROR] call ReduceScatter failed, handleId is -1.&quot;);</span></span>
<span class="line"><span>//	return;</span></span>
<span class="line"><span>// }</span></span></code></pre></div><p>示例的Prepare接口为<a href="./ReduceScatter.html">ReduceScatter</a>，其他接口可参考后续章节的内容。其中的参数AscendC::HCCL_DATA_TYPE_FP16是HCCL任务的数据类型，其数据结构为HcclDataType，对应的参数说明参考<a href="#table116710585514">表1</a>；参数HCCL_REDUCE_SUM是一种Reduce操作，AllReduce和ReduceScatter归约操作支持的Reduce操作类型参见<a href="#table2469980529">表2</a>。</p><p><strong>表 1</strong> HcclDataType参数说明</p></li></ol><table tabindex="0"><thead><tr><th>数据类型</th><th>说明</th></tr></thead><tbody><tr><td>HcclDataType</td><td>HCCL任务的数据类型。 &lt;pre class=&quot;screen&quot; codetype=&quot;Cpp&quot; id=&quot;screen1335615365568&quot;&gt;enum HcclDataType { HCCL_DATA_TYPE_INT8 = 0, /* int8 <em>/ HCCL_DATA_TYPE_INT16 = 1, /</em> int16 <em>/ HCCL_DATA_TYPE_INT32 = 2, /</em> int32 <em>/ HCCL_DATA_TYPE_FP16 = 3, /</em> half或float16 <em>/ HCCL_DATA_TYPE_FP32 = 4, /</em> float <em>/ HCCL_DATA_TYPE_INT64 = 5, /</em> int64 <em>/ HCCL_DATA_TYPE_UINT64 = 6, /</em> uint64 <em>/ HCCL_DATA_TYPE_UINT8 = 7, /</em> uint8 <em>/ HCCL_DATA_TYPE_UINT16 = 8, /</em> uint16 <em>/ HCCL_DATA_TYPE_UINT32 = 9, /</em> uint32 <em>/ HCCL_DATA_TYPE_FP64 = 10, /</em> float64 <em>/ HCCL_DATA_TYPE_BFP16 = 11, /</em> bfloat16 <em>/ HCCL_DATA_TYPE_INT128 = 12, /</em> int128 预留类型，暂不支持 <em>/ HCCL_DATA_TYPE_HIF8 = 14, /</em> hif8 <em>/ HCCL_DATA_TYPE_FP8E4M3 = 15, /</em> fp8e4m3 <em>/ HCCL_DATA_TYPE_FP8E5M2 = 16, /</em> fp8e5m2 <em>/ HCCL_DATA_TYPE_FP8E8M0 = 17, /</em> fp8e8m0 <em>/ HCCL_DATA_TYPE_RESERVED /</em> reserved */ }&lt;/pre&gt;</td></tr></tbody></table><pre><code>**表 2**  HcclReduceOp参数说明
</code></pre><table tabindex="0"><thead><tr><th>数据类型</th><th>说明</th></tr></thead><tbody><tr><td>HcclReduceOp</td><td>Reduce操作类型。 &lt;pre class=&quot;screen&quot; codetype=&quot;Cpp&quot; id=&quot;screen117584394535&quot;&gt;enum HcclReduceOp { HCCL_REDUCE_SUM = 0, /* sum <em>/ HCCL_REDUCE_PROD = 1, /</em> prod <em>/ HCCL_REDUCE_MAX = 2, /</em> max <em>/ HCCL_REDUCE_MIN = 3, /</em> min <em>/ HCCL_REDUCE_RESERVED /</em> reserved */ }&lt;/pre&gt;</td></tr></tbody></table><ol start="4"><li><p>用户调用<a href="./Commit.html">Commit</a>接口通知服务端执行handleId对应的通信任务。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 等待通信任务执行时机成熟，调用Commit接口通知服务端执行</span></span>
<span class="line"><span>hccl.Commit(handleId);</span></span></code></pre></div></li><li><p>用户调用<a href="./Wait-98.html">Wait</a>阻塞接口，等待服务端执行完对应的通信任务。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>auto ret = hccl.Wait(handleId);</span></span>
<span class="line"><span>// 对于Wait和Query接口，在调试时可增加异常值校验和PRINTF打印</span></span>
<span class="line"><span>// if (ret == HCCL_FAILED) {</span></span>
<span class="line"><span>//	PRINTF(&quot;[ERROR] call Wait for handleId[%d] failed.&quot;, handleId);</span></span>
<span class="line"><span>//	return;</span></span>
<span class="line"><span>// }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 调用核间同步接口，防止部分核执行较快退出，触发Hccl析构，影响执行较慢的核</span></span>
<span class="line"><span>// 开发者可根据实际的业务场景，选择调用[SyncAll](../../../基础API/同步控制/核间同步/SyncAll.md)、[CrossCoreSetFlag(ISASI)](../../../基础API/同步控制/核间同步/CrossCoreSetFlag(ISASI).md)、[CrossCoreWaitFlag(ISASI)](../../../基础API/同步控制/核间同步/CrossCoreWaitFlag(ISASI).md)接口，保证全部核的任务完成后再退出执行</span></span></code></pre></div></li><li><p>用户调用<a href="./Finalize.html">Finalize</a>接口，通知服务端后续无通信任务，执行结束后退出；客户端检测并等待最后一个通信任务执行结束。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>hccl.Finalize();</span></span></code></pre></div></li></ol><p>注意：若HCCL对象的模板参数未指定下发通信任务的核，则Prepare接口仅能在AIC或AIV之一上运行，调用步骤2到步骤5的接口前，必须指定接口代码运行在AIC或AIV核上，实现时如下代码所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 通过内置常量g_coreType来判断AIC核或者AIV核</span></span>
<span class="line"><span>if (g_coreType == AIV) {</span></span>
<span class="line"><span>// if (g_coreType == AIC) {</span></span>
<span class="line"><span>        调用HCCL接口</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>基于以上对单个通信任务下发的了解，介绍Prepare接口中repeat参数的灵活使用方式。一次Prepare接口的调用对应一个handleId，Prepare接口中的参数repeat代表这次Prepare的通信任务次数，该值必须和针对该handleId调用Commit接口的次数、Wait接口的次数一致。以<a href="#fig19780192164210">图2 ReduceScatter通信示例</a>进行说明，假设共4张卡，每张卡上源数据首先按照rankId均匀分成4份，每份数据被切分成3份，最终被切分后的每份数据的个数为TileLen，每次ReduceScatter通信仅通信一组切分数据（如图中数据0-0、1-0、2-0、3-0为一组切分数据），因此需要做3次ReduceScatter操作，全部数据才能通信完。</p><p>这种场景下，可以调用3次repeat参数为1的ReduceScatter接口，下发3个通信任务，同时更新每个ReduceScatter任务的收发地址，得到3个任务的handleId，每个handleId任务调用1次Commit和Wait接口，对应代码片段如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>extern &quot;C&quot; __global__ __aicore__ void reduce_scatter_custom(GM_ADDR xGM, GM_ADDR yGM, GM_ADDR workspaceGM, GM_ADDR tilingGM) {</span></span>
<span class="line"><span>    auto sendBuf = xGM;  // xGM为ReduceScatter的输入GM地址</span></span>
<span class="line"><span>    auto recvBuf = yGM;  // yGM为ReduceScatter的输出GM地址</span></span>
<span class="line"><span>    constexpr size_t rankSize = 4U; // 4张卡</span></span>
<span class="line"><span>    constexpr size_t tileCnt = 3U;  // 卡上的数据均匀分成rankSize份，且每份又被切分成3份</span></span>
<span class="line"><span>    constexpr size_t tileLen = 100U;  // 被切分后的每份数据个数</span></span>
<span class="line"><span>    uint64_t strideCount = tileLen*tileCnt;  // 表示sendBuf上相邻数据块间的起始地址的偏移量</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    REGISTER_TILING_DEFAULT(ReduceScatterCustomTilingData); //ReduceScatterCustomTilingData为对应算子头文件定义的结构体</span></span>
<span class="line"><span>    GET_TILING_DATA_WITH_STRUCT(ReduceScatterCustomTilingData, tilingData, tilingGM);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Hccl hccl;</span></span>
<span class="line"><span>    GM_ADDR contextGM = AscendC::GetHcclContext&lt;0&gt;();  // AscendC自定义算子kernel中，通过此方式获取HCCL context</span></span>
<span class="line"><span>    if (AscendC::g_coreType == AIV) {  // 指定AIV核通信   </span></span>
<span class="line"><span>        hccl.InitV2(contextGM, &amp;tilingData);</span></span>
<span class="line"><span>        auto ret = hccl.SetCcTilingV2(offsetof(ReduceScatterCustomTilingData, reduceScatterCcTiling));</span></span>
<span class="line"><span>        if (ret != HCCL_SUCCESS) {</span></span>
<span class="line"><span>          return;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>	// for循环中生成了3个handleId，每个handleId只调用了repeat=1次Commit和Wait接口</span></span>
<span class="line"><span>        for (int i = 0; i &lt; tileCnt; ++i) {</span></span>
<span class="line"><span>	    auto handleId = hccl.ReduceScatter(sendBuf, recvBuf, tileLen, HcclDataType::HCCL_DATA_TYPE_FP32, HcclReduceOp::HCCL_REDUCE_SUM, strideCount, 1); //具体参数参见ReduceScatter接口说明</span></span>
<span class="line"><span>	    hccl.Commit(handleId);</span></span>
<span class="line"><span>	    auto ret = hccl.Wait(handleId);</span></span>
<span class="line"><span>	    // 执行其他计算逻辑 ....</span></span>
<span class="line"><span>			</span></span>
<span class="line"><span>	    // 更新ReduceScatter的收发地址</span></span>
<span class="line"><span>	    sendBuf += tileLen * sizeOf(float32);</span></span>
<span class="line"><span>	    recvBuf += tileLen * sizeOf(float32);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>        AscendC::SyncAll&lt;true&gt;();  // 全AIV核同步，防止0核执行过快，提前调用hccl.Finalize()接口，导致其他核Wait卡死   </span></span>
<span class="line"><span>        hccl.Finalize();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>由于每张卡上3份数据的源地址SendBuf是连续的，且每张卡中目的地址recvBuf用来存储3份通信结果数据的内存也是连续的，因此以上代码可以优化，将ReduceScatter接口中的repeat参数设置为3，从而调用1次ReduceScatter接口，达到下发3个通信任务的效果。此时，只有1个handleId的任务，但是需要调用3次Commit和Wait接口，对应代码片段如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>extern &quot;C&quot; __global__ __aicore__ void reduce_scatter_custom(GM_ADDR xGM, GM_ADDR yGM, GM_ADDR workspaceGM, GM_ADDR tilingGM) {</span></span>
<span class="line"><span>    auto sendBuf = xGM;  // xGM为ReduceScatter的输入GM地址</span></span>
<span class="line"><span>    auto recvBuf = yGM;  // yGM为ReduceScatter的输出GM地址</span></span>
<span class="line"><span>    constexpr size_t rankSize = 4U; // 4张卡</span></span>
<span class="line"><span>    constexpr size_t tileCnt = 3U;  // 卡上的数据均匀分成rankSize份，且每份又被切分成3份</span></span>
<span class="line"><span>    constexpr size_t tileLen = 100U;  // 被切分后的每份数据个数</span></span>
<span class="line"><span>    uint64_t strideCount = tileLen*tileCnt;  // 表示sendBuf上相邻数据块间的起始地址的偏移量</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    REGISTER_TILING_DEFAULT(ReduceScatterCustomTilingData); //ReduceScatterCustomTilingData为对应算子头文件定义的结构体</span></span>
<span class="line"><span>    GET_TILING_DATA_WITH_STRUCT(ReduceScatterCustomTilingData, tilingData, tilingGM);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    Hccl hccl;</span></span>
<span class="line"><span>    GM_ADDR contextGM = AscendC::GetHcclContext&lt;0&gt;();  // AscendC自定义算子kernel中，通过此方式获取HCCL context</span></span>
<span class="line"><span>    if (AscendC::g_coreType == AIV) {  // 指定AIV核通信   </span></span>
<span class="line"><span>        hccl.InitV2(contextGM, &amp;tilingData);</span></span>
<span class="line"><span>        auto ret = hccl.SetCcTilingV2(offsetof(ReduceScatterCustomTilingData, reduceScatterCcTiling));</span></span>
<span class="line"><span>        if (ret != HCCL_SUCCESS) {</span></span>
<span class="line"><span>          return;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>		</span></span>
<span class="line"><span>	auto handleId = hccl.ReduceScatter(sendBuf, recvBuf, tileLen, HcclDataType::HCCL_DATA_TYPE_FP32, HcclReduceOp::HCCL_REDUCE_SUM, strideCount, tileCnt); //具体参数参见ReduceScatter接口说明</span></span>
<span class="line"><span>	for (int i = 0; i &lt; tileCnt; ++i) {</span></span>
<span class="line"><span>	    hccl.Commit(handleId);</span></span>
<span class="line"><span>	    auto ret = hccl.Wait(handleId);</span></span>
<span class="line"><span>	    // 执行其他计算逻辑 ....</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>        AscendC::SyncAll&lt;true&gt;();  // 全AIV核同步，防止0核执行过快，提前调用hccl.Finalize()接口，导致其他核Wait卡死   </span></span>
<span class="line"><span>        hccl.Finalize();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>图 3</strong> ReduceScatter通信示例<br><img src="`+i+'" alt="" title="ReduceScatter通信示例"></p><p><strong>表 3</strong> MC2_BUFFER_LOCATION参数说明</p><table tabindex="0"><thead><tr><th>数据类型</th><th>说明</th></tr></thead><tbody><tr><td>MC2_BUFFER_LOCATION</td><td>预留参数。计算和通信中间结果的Buffer存放位置。用户在Tiling侧可设置该字段。</td></tr></tbody></table><p>提示：调试含有HCCL高阶API的算子时，在算子编译工程中增加编译选项-DASCENDC_DEBUG，可以使能异常场景拦截的能力，具体内容请参考并使用<a href="./../../../基础API/调试接口/异常检测/assert.html">assert接口</a>。</p>',26)])])}const m=n(c,[["render",C]]);export{A as __pageData,m as default};
