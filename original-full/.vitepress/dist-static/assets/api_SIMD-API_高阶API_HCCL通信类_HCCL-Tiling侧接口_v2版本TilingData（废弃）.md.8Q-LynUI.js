import{c as n,Q as s,j as t,m as l}from"./chunks/framework.DOi4mjdC.js";const u=JSON.parse('{"title":"v2版本TilingData（废弃）","description":"","frontmatter":{},"headers":[{"level":1,"title":"v2版本TilingData（废弃）","slug":"v2版本tilingdata废弃"},{"level":2,"title":"功能说明","slug":"功能说明"},{"level":2,"title":"参数说明","slug":"参数说明"},{"level":2,"title":"约束说明","slug":"约束说明"},{"level":2,"title":"调用示例","slug":"调用示例"}],"relativePath":"api/SIMD-API/高阶API/HCCL通信类/HCCL-Tiling侧接口/v2版本TilingData（废弃）.md","filePath":"api/SIMD-API/高阶API/HCCL通信类/HCCL-Tiling侧接口/v2版本TilingData（废弃）.md"}'),e={name:"api/SIMD-API/高阶API/HCCL通信类/HCCL-Tiling侧接口/v2版本TilingData（废弃）.md"};function p(i,a,o,c,r,g){return s(),t("div",null,[...a[0]||(a[0]=[l(`<h1 id="v2版本tilingdata-废弃" tabindex="-1">v2版本TilingData（废弃） <a class="header-anchor" href="#v2版本tilingdata-废弃" aria-label="Permalink to &quot;v2版本TilingData（废弃）&quot;">​</a></h1><div class="note custom-block github-alert"><p class="custom-block-title">说明</p><p>该结构体废弃，并将在后续版本移除，请不要使用该结构体。无需直接对该结构体中的成员进行设置，统一使用HCCL Tiling提供的接口设置即可。</p></div><h2 id="功能说明" tabindex="-1">功能说明 <a class="header-anchor" href="#功能说明" aria-label="Permalink to &quot;功能说明&quot;">​</a></h2><p>AI CPU启动下发通信任务前，需获取固定的通信配置，如<a href="#table4835205712588">表1</a>所示。在算子实现中，由Tiling组装通信配置项，通过配置固定参数和固定参数顺序的Tiling Data，将通信配置信息在调用AI CPU通信接口时传递给AI CPU。</p><h2 id="参数说明" tabindex="-1">参数说明 <a class="header-anchor" href="#参数说明" aria-label="Permalink to &quot;参数说明&quot;">​</a></h2><p><strong>表 1</strong> v2版本HCCL TilingData参数说明</p><table tabindex="0"><thead><tr><th>参数名</th><th>描述</th></tr></thead><tbody><tr><td>version</td><td>uint32_t类型。用于区分TilingData版本。 v2版本的TilingData结构体中，version字段仅支持取值为2。 注意：该字段在v2版本TilingData中的位置，同v1版本的preparePosition字段。当该字段取值为2时，为v2版本的结构体，当取值为1时，为v1版本的结构体，请使用Mc2Msg结构体。</td></tr><tr><td>mc2HcommCnt</td><td>uint32_t类型。表示各通信域中通信任务总个数。当前该参数支持的最大取值为3。</td></tr><tr><td>serverCfg</td><td>Mc2ServerCfg类型。集合通信server端通用参数配置。</td></tr><tr><td>hcom</td><td>Mc2HcommCfg类型。各通信域中每个通信任务的参数配置。在通信算子TilingData的定义中，根据各通信域中通信任务总个数，共需要定义mc2HcommCnt个Mc2HcommCfg结构体。例如：mc2HcommCnt=2，则需要依次定义2个Mc2HcommCfg类型的参数，自定义参数名，比如hcom1、hcom2。</td></tr></tbody></table><p><strong>表 2</strong> Mc2ServerCfg结构体说明</p><table tabindex="0"><thead><tr><th>参数名</th><th>描述</th></tr></thead><tbody><tr><td>version</td><td>预留字段，不需要配置。</td></tr><tr><td>debugMode</td><td>预留字段，不需要配置。</td></tr><tr><td>sendArgIndex</td><td>预留字段，不需要配置。</td></tr><tr><td>recvArgIndex</td><td>预留字段，不需要配置。</td></tr><tr><td>commOutArgIndex</td><td>预留字段，不需要配置。</td></tr><tr><td>reserved</td><td>预留字段，不需要配置。</td></tr></tbody></table><p><strong>表 3</strong> Mc2HcommCfg结构体说明</p><table tabindex="0"><thead><tr><th>参数名</th><th>描述</th></tr></thead><tbody><tr><td>skipLocalRankCopy</td><td>预留字段，不需要配置。</td></tr><tr><td>skipBufferWindowCopy</td><td>预留字段，不需要配置。</td></tr><tr><td>stepSize</td><td>预留字段，不需要配置。</td></tr><tr><td>reserved</td><td>预留字段，不需要配置。</td></tr><tr><td>groupName</td><td>当前通信任务所在的通信域。char *类型，支持最大长度128。</td></tr><tr><td>algConfig</td><td>通信算法配置。char *类型，支持最大长度128。 当前支持的取值为： &quot;AllGather=level0:doublering&quot;：AllGather通信任务。&quot;ReduceScatter=level0:doublering&quot;：ReduceScatter通信任务。&quot;AlltoAll=level0:fullmesh;level1:pairwise&quot;：AlltoAllV通信任务。</td></tr><tr><td>opType</td><td>表示通信任务类型。uint32_t类型，取值详见HcclCMDType参数说明。</td></tr><tr><td>reduceType</td><td>归约操作类型，仅对有归约操作的通信任务生效。uint32_t类型，取值详见HcclReduceOp参数说明。</td></tr></tbody></table><h2 id="约束说明" tabindex="-1">约束说明 <a class="header-anchor" href="#约束说明" aria-label="Permalink to &quot;约束说明&quot;">​</a></h2><ul><li>如果需要使用v2版本的Tiling结构体，必须设置Tiling结构体的第一个参数version=2。</li><li>算子的Tiling Data结构需要完整包含<a href="#table4835205712588">v2版本HCCL TilingData参数</a>，其中各参数需要严格按照对应参数的结构来定义。</li></ul><h2 id="调用示例" tabindex="-1">调用示例 <a class="header-anchor" href="#调用示例" aria-label="Permalink to &quot;调用示例&quot;">​</a></h2><p>如下为自定义算子AlltoallvDoubleCommCustom的算子原型。该算子有两对输入输出，其中x1、y1是ep通信域的AlltoAllV任务的输入输出，x2、y2是tp通信域的AlltoAllV任务的输入输出。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>namespace ops {</span></span>
<span class="line"><span>class AlltoallvDoubleCommCustom : public OpDef {</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    explicit AlltoallvDoubleCommCustom(const char *name) : OpDef(name)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        this-&gt;Input(&quot;x1&quot;)</span></span>
<span class="line"><span>            .ParamType(REQUIRED)</span></span>
<span class="line"><span>            .DataType({ge::DT_FLOAT16, ge::DT_BF16})</span></span>
<span class="line"><span>            .Format({ge::FORMAT_ND, ge::FORMAT_ND})</span></span>
<span class="line"><span>            .UnknownShapeFormat({ge::FORMAT_ND, ge::FORMAT_ND});</span></span>
<span class="line"><span>        this-&gt;Input(&quot;x2&quot;)</span></span>
<span class="line"><span>            .ParamType(REQUIRED)</span></span>
<span class="line"><span>            .DataType({ge::DT_FLOAT16, ge::DT_BF16})</span></span>
<span class="line"><span>            .Format({ge::FORMAT_ND, ge::FORMAT_ND})</span></span>
<span class="line"><span>            .UnknownShapeFormat({ge::FORMAT_ND, ge::FORMAT_ND})</span></span>
<span class="line"><span>            .IgnoreContiguous();</span></span>
<span class="line"><span>        this-&gt;Output(&quot;y1&quot;)</span></span>
<span class="line"><span>            .ParamType(REQUIRED)</span></span>
<span class="line"><span>            .DataType({ge::DT_FLOAT16, ge::DT_BF16})</span></span>
<span class="line"><span>            .Format({ge::FORMAT_ND, ge::FORMAT_ND})</span></span>
<span class="line"><span>            .UnknownShapeFormat({ge::FORMAT_ND, ge::FORMAT_ND});</span></span>
<span class="line"><span>        this-&gt;Output(&quot;y2&quot;)</span></span>
<span class="line"><span>            .ParamType(REQUIRED)</span></span>
<span class="line"><span>            .DataType({ge::DT_FLOAT16, ge::DT_BF16})</span></span>
<span class="line"><span>            .Format({ge::FORMAT_ND, ge::FORMAT_ND})</span></span>
<span class="line"><span>            .UnknownShapeFormat({ge::FORMAT_ND, ge::FORMAT_ND});</span></span>
<span class="line"><span>        this-&gt;Attr(&quot;group_ep&quot;).AttrType(REQUIRED).String();</span></span>
<span class="line"><span>        this-&gt;Attr(&quot;group_tp&quot;).AttrType(REQUIRED).String();</span></span>
<span class="line"><span>        this-&gt;Attr(&quot;ep_world_size&quot;).AttrType(REQUIRED).Int();</span></span>
<span class="line"><span>        this-&gt;Attr(&quot;tp_world_size&quot;).AttrType(REQUIRED).Int();</span></span>
<span class="line"><span>        this-&gt;AICore().SetTiling(optiling::AlltoAllVDoubleCommCustomTilingFunc);</span></span>
<span class="line"><span>        this-&gt;AICore().AddConfig(&quot;ascendxxx&quot;); // ascendxxx请修改为对应的AI处理器型号。</span></span>
<span class="line"><span>        this-&gt;MC2().HcclGroup({&quot;group_ep&quot;, &quot;group_tp&quot;});</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span>OP_ADD(AlltoallvDoubleCommCustom);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>如下为该自定义算子Tiling Data声明和实现。</p><p>该自定义算子Tiling Data的声明中：首先定义version字段，设置为2，表明为v2版本的通信算子Tiling结构体。其次，定义mc2HcommCnt字段，本例AlltoallvDoubleCommCustom算子的kernel实现中，共2个AlltoAllV通信任务，该参数取值为2。然后定义server通用参数配置，Mc2ServerCfg。最后，定义2个Mc2HcommCfg结构体，表示各通信域中的每个通信任务参数配置。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// HCCL TilingData声明</span></span>
<span class="line"><span>BEGIN_TILING_DATA_DEF(AlltoallvDoubleCommCustomTilingData)</span></span>
<span class="line"><span>    TILING_DATA_FIELD_DEF(uint32_t, version);                           // HCCL tiling结构体的版本，设为2</span></span>
<span class="line"><span>    TILING_DATA_FIELD_DEF(uint32_t, mc2HcommCnt);                       // 各通信域中的通信算子总个数，当前最多支持3个。AlltoallvDoubleCommCustom算子kernel实现中每个通信域中均用了1个AlltoAllV，因此设为2</span></span>
<span class="line"><span>    TILING_DATA_FIELD_DEF_STRUCT(Mc2ServerCfg, serverCfg);    // server通用参数配置，融合算子级</span></span>
<span class="line"><span>    TILING_DATA_FIELD_DEF_STRUCT(Mc2HcommCfg, hcom1);         // 各通信域中的每个通信任务参数配置，算子级，共有mc2HcommCnt个Mc2HcommCfg</span></span>
<span class="line"><span>    TILING_DATA_FIELD_DEF_STRUCT(Mc2HcommCfg, hcom2);</span></span>
<span class="line"><span>END_TILING_DATA_DEF;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>REGISTER_TILING_DATA_CLASS(AlltoallvDoubleCommCustom, AlltoallvDoubleCommCustomTilingData);</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// HCCL TilingData配置片段</span></span>
<span class="line"><span>static ge::graphStatus AlltoAllVDoubleCommCustomTilingFunc(gert::TilingContext *context)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    char *group1 = const_cast&lt;char *&gt;(context-&gt;GetAttrs()-&gt;GetAttrPointer&lt;char&gt;(0));</span></span>
<span class="line"><span>    char *group2 = const_cast&lt;char *&gt;(context-&gt;GetAttrs()-&gt;GetAttrPointer&lt;char&gt;(1));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    AlltoallvDoubleCommCustomTilingData tiling;</span></span>
<span class="line"><span>    tiling.set_version(2);</span></span>
<span class="line"><span>    tiling.set_mc2HcommCnt(2);</span></span>
<span class="line"><span>    tiling.serverCfg.set_debugMode(0);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    tiling.hcom1.set_opType(8);</span></span>
<span class="line"><span>    tiling.hcom1.set_reduceType(4);</span></span>
<span class="line"><span>    tiling.hcom1.set_groupName(group1);</span></span>
<span class="line"><span>    tiling.hcom1.set_algConfig(&quot;AlltoAll=level0:fullmesh;level1:pairwise&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    tiling.hcom2.set_opType(8);</span></span>
<span class="line"><span>    tiling.hcom2.set_reduceType(4);</span></span>
<span class="line"><span>    tiling.hcom2.set_groupName(group2);</span></span>
<span class="line"><span>    tiling.hcom2.set_algConfig(&quot;AlltoAll=level0:fullmesh;level1:pairwise&quot;);</span></span>
<span class="line"><span>    </span></span>
<span class="line"><span>    tiling.SaveToBuffer(context-&gt;GetRawTilingData()-&gt;GetData(), context-&gt;GetRawTilingData()-&gt;GetCapacity());</span></span>
<span class="line"><span>    context-&gt;GetRawTilingData()-&gt;SetDataSize(tiling.GetDataSize());</span></span>
<span class="line"><span>    return ge::GRAPH_SUCCESS;</span></span>
<span class="line"><span>}</span></span></code></pre></div>`,20)])])}const m=n(e,[["render",p]]);export{u as __pageData,m as default};
