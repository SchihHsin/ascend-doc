import{c as n,Q as t,j as s,m as e}from"./chunks/framework.DOi4mjdC.js";const _=JSON.parse('{"title":"SetCLayout","description":"","frontmatter":{},"headers":[{"level":1,"title":"SetCLayout","slug":"setclayout"},{"level":2,"title":"功能说明","slug":"功能说明"},{"level":2,"title":"函数原型","slug":"函数原型"},{"level":2,"title":"参数说明","slug":"参数说明"},{"level":2,"title":"返回值说明","slug":"返回值说明"},{"level":2,"title":"约束说明","slug":"约束说明"},{"level":2,"title":"调用示例","slug":"调用示例"}],"relativePath":"api/SIMD-API/高阶API/矩阵计算/Matmul-Tiling侧接口/Matmul-Tiling类/SetCLayout.md","filePath":"api/SIMD-API/高阶API/矩阵计算/Matmul-Tiling侧接口/Matmul-Tiling类/SetCLayout.md"}'),l={name:"api/SIMD-API/高阶API/矩阵计算/Matmul-Tiling侧接口/Matmul-Tiling类/SetCLayout.md"};function i(p,a,o,r,c,u){return t(),s("div",null,[...a[0]||(a[0]=[e(`<h1 id="setclayout" tabindex="-1">SetCLayout <a class="header-anchor" href="#setclayout" aria-label="Permalink to &quot;SetCLayout&quot;">​</a></h1><h2 id="功能说明" tabindex="-1">功能说明 <a class="header-anchor" href="#功能说明" aria-label="Permalink to &quot;功能说明&quot;">​</a></h2><p>设置C矩阵的Layout轴信息，包括<a href="./../../Matmul-Kernel侧接口/IterateBatch.html">B、S、N、G、D轴</a>。对于BSNGD、SBNGD、BNGS1S2 Layout格式，调用<a href="./../../Matmul-Kernel侧接口/IterateBatch.html">IterateBatch</a>接口之前，需要在Host侧Tiling实现中通过本接口设置C矩阵的Layout轴信息。</p><h2 id="函数原型" tabindex="-1">函数原型 <a class="header-anchor" href="#函数原型" aria-label="Permalink to &quot;函数原型&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int32_t SetCLayout(int32_t b, int32_t s, int32_t n, int32_t g, int32_t d)</span></span></code></pre></div><h2 id="参数说明" tabindex="-1">参数说明 <a class="header-anchor" href="#参数说明" aria-label="Permalink to &quot;参数说明&quot;">​</a></h2><p><strong>表 1</strong> 参数说明</p><table tabindex="0"><thead><tr><th>参数名</th><th>输入/输出</th><th>描述</th></tr></thead><tbody><tr><td>b</td><td>输入</td><td>C矩阵Layout的B轴信息</td></tr><tr><td>s</td><td>输入</td><td>C矩阵Layout的S轴信息</td></tr><tr><td>n</td><td>输入</td><td>C矩阵Layout的N轴信息</td></tr><tr><td>g</td><td>输入</td><td>C矩阵Layout的G轴信息</td></tr><tr><td>d</td><td>输入</td><td>C矩阵Layout的D轴信息</td></tr></tbody></table><h2 id="返回值说明" tabindex="-1">返回值说明 <a class="header-anchor" href="#返回值说明" aria-label="Permalink to &quot;返回值说明&quot;">​</a></h2><p>-1表示设置失败； 0表示设置成功。</p><h2 id="约束说明" tabindex="-1">约束说明 <a class="header-anchor" href="#约束说明" aria-label="Permalink to &quot;约束说明&quot;">​</a></h2><p>对于BSNGD、SBNGD、BNGS1S2 Layout格式，调用<a href="./../../Matmul-Kernel侧接口/IterateBatch.html">IterateBatch</a>接口之前，需要在Host侧Tiling实现中通过本接口设置C矩阵的Layout轴信息。</p><h2 id="调用示例" tabindex="-1">调用示例 <a class="header-anchor" href="#调用示例" aria-label="Permalink to &quot;调用示例&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>auto ascendcPlatform = platform_ascendc::PlatformAscendC(context-&gt;GetPlatformInfo());</span></span>
<span class="line"><span>matmul_tiling::MultiCoreMatmulTiling tiling(ascendcPlatform);   </span></span>
<span class="line"><span>int32_t M = 32;</span></span>
<span class="line"><span>int32_t N = 256;</span></span>
<span class="line"><span>int32_t K = 64;</span></span>
<span class="line"><span>tiling.SetDim(1);</span></span>
<span class="line"><span>tiling.SetAType(matmul_tiling::TPosition::GM, matmul_tiling::CubeFormat::ND, matmul_tiling::DataType::DT_FLOAT16);</span></span>
<span class="line"><span>tiling.SetBType(matmul_tiling::TPosition::GM, matmul_tiling::CubeFormat::ND, matmul_tiling::DataType::DT_FLOAT16);</span></span>
<span class="line"><span>tiling.SetCType(matmul_tiling::TPosition::GM, matmul_tiling::CubeFormat::ND, matmul_tiling::DataType::DT_FLOAT);</span></span>
<span class="line"><span>tiling.SetBiasType(matmul_tiling::TPosition::GM, matmul_tiling::CubeFormat::ND, matmul_tiling::DataType::DT_FLOAT);</span></span>
<span class="line"><span>tiling.SetShape(M, N, K);</span></span>
<span class="line"><span>tiling.SetOrgShape(M, N, K);</span></span>
<span class="line"><span>tiling.SetBias(true);</span></span>
<span class="line"><span>tiling.SetBufferSpace(-1, -1, -1);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>constexpr int32_t A_BNUM = 2;</span></span>
<span class="line"><span>constexpr int32_t A_SNUM = 32;</span></span>
<span class="line"><span>constexpr int32_t A_GNUM = 3;</span></span>
<span class="line"><span>constexpr int32_t A_DNUM = 64;</span></span>
<span class="line"><span>constexpr int32_t B_BNUM = 2;</span></span>
<span class="line"><span>constexpr int32_t B_SNUM = 256;</span></span>
<span class="line"><span>constexpr int32_t B_GNUM = 3;</span></span>
<span class="line"><span>constexpr int32_t B_DNUM = 64;</span></span>
<span class="line"><span>constexpr int32_t C_BNUM = 2;</span></span>
<span class="line"><span>constexpr int32_t C_SNUM = 32;</span></span>
<span class="line"><span>constexpr int32_t C_GNUM = 3;</span></span>
<span class="line"><span>constexpr int32_t C_DNUM = 256;</span></span>
<span class="line"><span>constexpr int32_t BATCH_NUM = 3;</span></span>
<span class="line"><span>tiling.SetALayout(A_BNUM, A_SNUM, 1, A_GNUM, A_DNUM);</span></span>
<span class="line"><span>tiling.SetBLayout(B_BNUM, B_SNUM, 1, B_GNUM, B_DNUM);</span></span>
<span class="line"><span>tiling.SetCLayout(C_BNUM, C_SNUM, 1, C_GNUM, C_DNUM);  // 设置C矩阵排布</span></span>
<span class="line"><span>tiling.SetBatchNum(BATCH_NUM);</span></span>
<span class="line"><span>tiling.SetBufferSpace(-1, -1, -1);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>optiling::TCubeTiling tilingData;</span></span>
<span class="line"><span>int ret = tiling.GetTiling(tilingData);</span></span></code></pre></div>`,14)])])}const h=n(l,[["render",i]]);export{_ as __pageData,h as default};
