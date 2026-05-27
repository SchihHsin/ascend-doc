import{c as i,Q as a,j as s,m as p}from"./chunks/framework.DOi4mjdC.js";const v=JSON.parse('{"title":"Conv3D Tiling使用说明","description":"","frontmatter":{},"headers":[{"level":1,"title":"Conv3D Tiling使用说明","slug":"conv3d-tiling使用说明"},{"level":2,"title":"需要包含的头文件","slug":"需要包含的头文件"}],"relativePath":"api/SIMD-API/高阶API/卷积计算/Conv3D/Conv3D-Tiling侧接口/Conv3D-Tiling使用说明.md","filePath":"api/SIMD-API/高阶API/卷积计算/Conv3D/Conv3D-Tiling侧接口/Conv3D-Tiling使用说明.md"}'),e={name:"api/SIMD-API/高阶API/卷积计算/Conv3D/Conv3D-Tiling侧接口/Conv3D-Tiling使用说明.md"};function l(t,n,o,c,d,g){return a(),s("div",null,[...n[0]||(n[0]=[p(`<h1 id="conv3d-tiling使用说明" tabindex="-1">Conv3D Tiling使用说明 <a class="header-anchor" href="#conv3d-tiling使用说明" aria-label="Permalink to &quot;Conv3D Tiling使用说明&quot;">​</a></h1><p>Ascend C提供一组Conv3D Tiling API，方便用户获取Conv3D正向算子Kernel计算时所需的Tiling参数。用户只需要传入Input/Weight/Bias/Output的Position位置、Format格式和DType数据类型及相关参数等信息，调用API接口，即可获取<a href="./../Conv3D-Kernel侧接口/Init-101.html">Init</a>中TConv3DApiTiling结构体中的相关参数。</p><p>Conv3D Tiling API提供Conv3D单核Tiling接口，用于Conv3D单核计算场景，获取Tiling参数的流程如下：</p><ol><li>创建一个单核Tiling对象。</li><li>设置Input、Weight、Bias、Output的参数类型信息以及Shape信息，如果存在Padding、Stride、Dilation参数，通过<a href="./SetPadding.html">SetPadding</a>、<a href="./SetStride.html">SetStride</a>、<a href="./SetDilation.html">SetDilation</a>接口进行相关设置。</li><li>调用<a href="./GetTiling-105.html">GetTiling</a>接口，获取Tiling信息。</li></ol><p>使用Conv3D Tiling接口获取Tiling参数的样例如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 实例化Conv3D Api</span></span>
<span class="line"><span>auto ascendcPlatform = platform_ascendc::PlatformAscendC(context-&gt;GetPlatformInfo());</span></span>
<span class="line"><span>Conv3dTilingApi::Conv3dTiling conv3dApiTiling(ascendcPlatform);</span></span>
<span class="line"><span>// 设置输入输出原始规格、单核规格、参数等</span></span>
<span class="line"><span>conv3dApiTiling.SetGroups(groups);</span></span>
<span class="line"><span>conv3dApiTiling.SetOrgWeightShape(cout, kd, kh, kw);</span></span>
<span class="line"><span>conv3dApiTiling.SetOrgInputShape(cin, di, hi, wi);</span></span>
<span class="line"><span>conv3dApiTiling.SetPadding(padh, padt, padu, padd, padl, padr);</span></span>
<span class="line"><span>conv3dApiTiling.SetDilation(dilationH, dilationW, dilationD);</span></span>
<span class="line"><span>conv3dApiTiling.SetStride(strideH, strideW, strideD);</span></span>
<span class="line"><span>conv3dApiTiling.SetSingleWeightShape(cin, kd, kh, kw);</span></span>
<span class="line"><span>conv3dApiTiling.SetSingleOutputShape(singleCoreCo, singleCoreDo, singleCoreMo);</span></span>
<span class="line"><span>// 设置输入输出type</span></span>
<span class="line"><span>conv3dApiTiling.SetInputType(TPosition::GM, inputFormat, inputDtype);</span></span>
<span class="line"><span>conv3dApiTiling.SetWeightType(TPosition::GM, weightFormat, weightDtype);</span></span>
<span class="line"><span>conv3dApiTiling.SetOutputType(TPosition::CO1, outputFormat, outputDtype);</span></span>
<span class="line"><span>if (biasFlag) {</span></span>
<span class="line"><span>   conv3dApiTiling.SetBiasType(TPosition::GM, biasFormat, biasDtype);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 调用GetTiling接口获取核内切分策略，如果返回-1代表获取tiling失败</span></span>
<span class="line"><span>if (conv3dApiTiling.GetTiling(tilingData.conv3dApiTilingData) == -1) {</span></span>
<span class="line"><span>   return false;</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="需要包含的头文件" tabindex="-1">需要包含的头文件 <a class="header-anchor" href="#需要包含的头文件" aria-label="Permalink to &quot;需要包含的头文件&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &quot;lib/conv/conv3d/conv3d_tiling.h&quot;</span></span></code></pre></div>`,8)])])}const T=i(e,[["render",l]]);export{v as __pageData,T as default};
