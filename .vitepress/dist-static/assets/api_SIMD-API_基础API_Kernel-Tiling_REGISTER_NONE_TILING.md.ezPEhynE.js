import{c as s,Q as n,j as p,m as l}from"./chunks/framework.DOi4mjdC.js";const o=JSON.parse('{"title":"REGISTER_NONE_TILING","description":"","frontmatter":{},"headers":[{"level":1,"title":"REGISTER\\\\_NONE\\\\_TILING","slug":"register_none_tiling"},{"level":2,"title":"产品支持情况","slug":"产品支持情况"},{"level":2,"title":"功能说明","slug":"功能说明"},{"level":2,"title":"函数原型","slug":"函数原型"},{"level":2,"title":"参数说明","slug":"参数说明"},{"level":2,"title":"约束说明","slug":"约束说明"},{"level":2,"title":"调用示例","slug":"调用示例"},{"level":1,"title":"Tiling模板库提供方，无法预知用户实例化何种TilingData结构体","slug":"tiling模板库提供方无法预知用户实例化何种tilingdata结构体"}],"relativePath":"api/SIMD-API/基础API/Kernel-Tiling/REGISTER_NONE_TILING.md","filePath":"api/SIMD-API/基础API/Kernel-Tiling/REGISTER_NONE_TILING.md"}'),t={name:"api/SIMD-API/基础API/Kernel-Tiling/REGISTER_NONE_TILING.md"};function e(i,a,c,_,r,T){return n(),p("div",null,[...a[0]||(a[0]=[l(`<h1 id="register-none-tiling" tabindex="-1">REGISTER_NONE_TILING <a class="header-anchor" href="#register-none-tiling" aria-label="Permalink to &quot;REGISTER\\_NONE\\_TILING&quot;">​</a></h1><h2 id="产品支持情况" tabindex="-1">产品支持情况 <a class="header-anchor" href="#产品支持情况" aria-label="Permalink to &quot;产品支持情况&quot;">​</a></h2><table tabindex="0"><thead><tr><th>产品</th><th>是否支持</th></tr></thead><tbody><tr><td>Ascend 950PR/Ascend 950DT</td><td>√</td></tr><tr><td>Atlas A3 训练系列产品/Atlas A3 推理系列产品</td><td>√</td></tr><tr><td>Atlas A2 训练系列产品/Atlas A2 推理系列产品</td><td>√</td></tr><tr><td>Atlas 200I/500 A2 推理产品</td><td>x</td></tr><tr><td>Atlas 推理系列产品AI Core</td><td>x</td></tr><tr><td>Atlas 推理系列产品Vector Core</td><td>x</td></tr><tr><td>Atlas 训练系列产品</td><td>x</td></tr></tbody></table><h2 id="功能说明" tabindex="-1">功能说明 <a class="header-anchor" href="#功能说明" aria-label="Permalink to &quot;功能说明&quot;">​</a></h2><p>在Kernel侧使用标准C++语法自定义的TilingData结构体时，若用户不确定需要注册哪些结构体，可使用该接口告知框架侧需使用未注册的标准C++语法来定义TilingData，并配套<a href="./GET_TILING_DATA_WITH_STRUCT.html">GET_TILING_DATA_WITH_STRUCT</a>，<a href="./GET_TILING_DATA_MEMBER.html">GET_TILING_DATA_MEMBER</a>，<a href="./GET_TILING_DATA_PTR_WITH_STRUCT.html">GET_TILING_DATA_PTR_WITH_STRUCT</a>来获取对应的TilingData。</p><h2 id="函数原型" tabindex="-1">函数原型 <a class="header-anchor" href="#函数原型" aria-label="Permalink to &quot;函数原型&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>REGISTER_NONE_TILING</span></span></code></pre></div><h2 id="参数说明" tabindex="-1">参数说明 <a class="header-anchor" href="#参数说明" aria-label="Permalink to &quot;参数说明&quot;">​</a></h2><p>无</p><h2 id="约束说明" tabindex="-1">约束说明 <a class="header-anchor" href="#约束说明" aria-label="Permalink to &quot;约束说明&quot;">​</a></h2><ul><li>暂不支持Kernel直调工程。</li><li>使用<a href="./GET_TILING_DATA.html">GET_TILING_DATA</a>需提供默认注册的TilingData结构体，但本接口不注册TilingData结构体，故不支持与<a href="./GET_TILING_DATA.html">5.11.1-GET_TILING_DATA</a>组合使用。</li><li>不支持和<a href="./REGISTER_TILING_DEFAULT.html">REGISTER_TILING_DEFAULT</a>或<a href="./REGISTER_TILING_FOR_TILINGKEY.html">REGISTER_TILING_FOR_TILINGKEY</a>混用，即不支持注册TilingData结构体的场景与非注册场景混合使用。</li></ul><h2 id="调用示例" tabindex="-1">调用示例 <a class="header-anchor" href="#调用示例" aria-label="Permalink to &quot;调用示例&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># Tiling模板库提供方，无法预知用户实例化何种TilingData结构体</span></span>
<span class="line"><span>template &lt;class BrcDag&gt;</span></span>
<span class="line"><span>struct BroadcastBaseTilingData {</span></span>
<span class="line"><span>    int32_t scheMode;</span></span>
<span class="line"><span>    int32_t shapeLen;</span></span>
<span class="line"><span>    int32_t ubSplitAxis;</span></span>
<span class="line"><span>    int32_t ubFormer;</span></span>
<span class="line"><span>    int32_t ubTail;</span></span>
<span class="line"><span>    int64_t ubOuter;</span></span>
<span class="line"><span>    int64_t blockFormer;</span></span>
<span class="line"><span>    int64_t blockTail;</span></span>
<span class="line"><span>    int64_t dimProductBeforeUbInner;</span></span>
<span class="line"><span>    int64_t elemNum;</span></span>
<span class="line"><span>    int64_t blockNum;</span></span>
<span class="line"><span>    int64_t outputDims[BROADCAST_MAX_DIMS_NUM];</span></span>
<span class="line"><span>    int64_t outputStrides[BROADCAST_MAX_DIMS_NUM];</span></span>
<span class="line"><span>    int64_t inputDims[BrcDag::InputSize][2]; // 整块 + 尾块</span></span>
<span class="line"><span>    int64_t inputBrcDims[BrcDag::CopyBrcSize][BROADCAST_MAX_DIMS_NUM];</span></span>
<span class="line"><span>    int64_t inputVecBrcDims[BrcDag::VecBrcSize][BROADCAST_MAX_DIMS_NUM];</span></span>
<span class="line"><span>    int64_t inputStrides[BrcDag::InputSize][BROADCAST_MAX_DIMS_NUM];</span></span>
<span class="line"><span>    int64_t inputBrcStrides[BrcDag::CopyBrcSize][BROADCAST_MAX_DIMS_NUM];</span></span>
<span class="line"><span>    int64_t inputVecBrcStrides[BrcDag::VecBrcSize];</span></span>
<span class="line"><span>    char scalarData[BROADCAST_MAX_SCALAR_BYTES];</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>template &lt;uint64_t schMode, class BrcDag&gt; class BroadcastSch {</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    __aicore__ inline explicit BroadcastSch(GM_ADDR&amp; tmpTiling)</span></span>
<span class="line"><span>        : tiling(tmpTiling)</span></span>
<span class="line"><span>    {}</span></span>
<span class="line"><span>    template &lt;class... Args&gt;</span></span>
<span class="line"><span>    __aicore__ inline void Process(Args... args)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        REGISTER_NONE_TILING; // 告知框架侧使用未注册的TilingData结构体</span></span>
<span class="line"><span>        if constexpr (schMode == 1) {</span></span>
<span class="line"><span>            GET_TILING_DATA_WITH_STRUCT(BroadcastBaseTilingData&lt;BrcDag&gt;, tilingData, tiling);</span></span>
<span class="line"><span>            GET_TILING_DATA_MEMBER(BroadcastBaseTilingData&lt;BrcDag&gt;, blockNum, blockNumVar, tiling);</span></span>
<span class="line"><span>            TPipe pipe;</span></span>
<span class="line"><span>            BroadcastNddmaSch&lt;BrcDag, false&gt; sch(&amp;tilingData); // 获取Schedule</span></span>
<span class="line"><span>            sch.Init(&amp;pipe, args...);</span></span>
<span class="line"><span>            sch.Process();</span></span>
<span class="line"><span>        }   else if constexpr (schMode == 202) {</span></span>
<span class="line"><span>            GET_TILING_DATA_PTR_WITH_STRUCT(BroadcastOneDimTilingDataAdvance, tilingDataPtr, tiling);</span></span>
<span class="line"><span>            BroadcastOneDimAdvanceSch&lt;BrcDag&gt; sch(tilingDataPtr); // 获取Schedule</span></span>
<span class="line"><span>            sch.Init(args...);</span></span>
<span class="line"><span>            sch.Process();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    GM_ADDR tiling;</span></span>
<span class="line"><span>};</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#用户通过传入schMode, OpDag模板参数来实例化模板库</span></span>
<span class="line"><span>using namespace AscendC;</span></span>
<span class="line"><span>template &lt;uint64_t schMode&gt;</span></span>
<span class="line"><span>__global__ __aicore__ void mul(GM_ADDR x1, GM_ADDR x2, GM_ADDR y, GM_ADDR workspace, GM_ADDR tiling)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    if constexpr (std::is_same&lt;DTYPE_X1, int8_t&gt;::value) {</span></span>
<span class="line"><span>        // int8</span></span>
<span class="line"><span>        using OpDag = MulDag::MulInt8Op::OpDag;</span></span>
<span class="line"><span>        BroadcastSch&lt;schMode, OpDag&gt; sch(tiling);</span></span>
<span class="line"><span>        sch.Process(x1, x2, y);</span></span>
<span class="line"><span>    } else if constexpr (std::is_same&lt;DTYPE_X1, uint8_t&gt;::value) {</span></span>
<span class="line"><span>        // uint8</span></span>
<span class="line"><span>        using OpDag = MulDag::MulUint8Op::OpDag;</span></span>
<span class="line"><span>        BroadcastSch&lt;schMode, OpDag&gt; sch(tiling);</span></span>
<span class="line"><span>        sch.Process(x1, x2, y);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div>`,14)])])}const g=s(t,[["render",e]]);export{o as __pageData,g as default};
