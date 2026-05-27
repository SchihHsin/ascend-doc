import{c as a,Q as s,j as i,m as p}from"./chunks/framework.DOi4mjdC.js";const u=JSON.parse('{"title":"使用高阶API时配套的Tiling实现","description":"","frontmatter":{},"headers":[{"level":1,"title":"使用高阶API时配套的Tiling实现","slug":"使用高阶api时配套的tiling实现"}],"relativePath":"guide/编程指南/高级编程/高级特性/Aclnn算子工程化开发/Host侧Tiling实现/使用高阶API时配套的Tiling实现.md","filePath":"guide/编程指南/高级编程/高级特性/Aclnn算子工程化开发/Host侧Tiling实现/使用高阶API时配套的Tiling实现.md"}'),l={name:"guide/编程指南/高级编程/高级特性/Aclnn算子工程化开发/Host侧Tiling实现/使用高阶API时配套的Tiling实现.md"};function e(t,n,c,T,g,o){return s(),i("div",null,[...n[0]||(n[0]=[p(`<h1 id="使用高阶api时配套的tiling实现" tabindex="-1">使用高阶API时配套的Tiling实现 <a class="header-anchor" href="#使用高阶api时配套的tiling实现" aria-label="Permalink to &quot;使用高阶API时配套的Tiling实现&quot;">​</a></h1><ol><li><p>首先进行tiling结构定义：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>namespace optiling {</span></span>
<span class="line"><span>BEGIN_TILING_DATA_DEF(MyAddTilingData)  // 声明tiling结构名字</span></span>
<span class="line"><span>  TILING_DATA_FIELD_DEF_STRUCT(TCubeTiling, cubeTilingData);   // 引用高阶API的tiling结构体</span></span>
<span class="line"><span>  TILING_DATA_FIELD_DEF(uint32_t, field);   // 结构成员的引用结构体</span></span>
<span class="line"><span>END_TILING_DATA_DEF;</span></span>
<span class="line"><span>REGISTER_TILING_DATA_CLASS(MyAdd, MyAddTilingData)  // tiling结构注册给算子</span></span>
<span class="line"><span>}</span></span></code></pre></div></li><li><p>通过高阶API配套的tiling函数对tiling结构初始化：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static ge::graphStatus TilingFunc(gert::TilingContext* context) {</span></span>
<span class="line"><span>    int32_t M = 1024;</span></span>
<span class="line"><span>    int32_t N = 640;</span></span>
<span class="line"><span>    int32_t K = 256;</span></span>
<span class="line"><span>    int32_t baseM = 128;</span></span>
<span class="line"><span>    int32_t baseN = 128;</span></span>
<span class="line"><span>    auto ascendcPlatform = platform_ascendc::PlatformAscendC(context-&gt;GetPlatformInfo());</span></span>
<span class="line"><span>    MultiCoreMatmulTiling cubeTiling(ascendcPlatform);</span></span>
<span class="line"><span>    cubeTiling.SetDim(2);</span></span>
<span class="line"><span>    cubeTiling.SetAType(TPosition::GM, CubeFormat::ND, matmul_tiling::DataType::DT_FLOAT16);</span></span>
<span class="line"><span>    cubeTiling.SetBType(TPosition::GM, CubeFormat::ND, matmul_tiling::DataType::DT_FLOAT16);</span></span>
<span class="line"><span>    cubeTiling.SetCType(TPosition::LCM, CubeFormat::ND, matmul_tiling::DataType::DT_FLOAT);</span></span>
<span class="line"><span>    cubeTiling.SetBiasType(TPosition::GM, CubeFormat::ND, matmul_tiling::DataType::DT_FLOAT);</span></span>
<span class="line"><span>    cubeTiling.SetShape(M, N, K);</span></span>
<span class="line"><span>    cubeTiling.SetOrgShape(M, N, K);</span></span>
<span class="line"><span>    cubeTiling.SetFixSplit(baseM, baseN, -1);</span></span>
<span class="line"><span>    cubeTiling.SetBias(true);</span></span>
<span class="line"><span>    cubeTiling.SetBufferSpace(-1, -1, -1);</span></span>
<span class="line"><span>    MyAddTilingData tiling;</span></span>
<span class="line"><span>    if (cubeTiling.GetTiling(tiling.cubeTilingData) == -1){</span></span>
<span class="line"><span>        return ge::GRAPH_FAILED;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    // some code</span></span>
<span class="line"><span>}</span></span></code></pre></div></li></ol>`,2)])])}const d=a(l,[["render",e]]);export{u as __pageData,d as default};
