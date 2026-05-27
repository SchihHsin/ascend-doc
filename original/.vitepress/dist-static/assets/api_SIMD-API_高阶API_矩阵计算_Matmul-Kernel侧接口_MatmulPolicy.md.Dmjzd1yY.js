import{c as a,Q as n,j as l,m as p}from"./chunks/framework.DOi4mjdC.js";const e="/assets/%E4%B8%8A%E4%B8%89%E8%A7%92%E6%A8%A1%E6%9D%BF%E7%AD%96%E7%95%A5%E7%A4%BA%E6%84%8F%E5%9B%BE.B-J9rOfJ.png",t="/assets/%E4%B8%8B%E4%B8%89%E8%A7%92%E6%A8%A1%E6%9D%BF%E7%AD%96%E7%95%A5%E7%A4%BA%E6%84%8F%E5%9B%BE.BoWkApbb.png",i="/assets/NBuffer33%E6%A8%A1%E6%9D%BF%E7%AD%96%E7%95%A5%E7%A4%BA%E6%84%8F%E5%9B%BE.BZmIfpGH.png",c="/assets/MatmulMx%E5%85%AC%E5%BC%8F%E5%9B%BE%E7%A4%BA.k7IAPv6A.png",m="/assets/SplitM%E6%A8%A1%E6%9D%BF%E7%AD%96%E7%95%A5%E7%A4%BA%E6%84%8F%E5%9B%BE.C1J0tsOI.png",r="/assets/SplitN%E6%A8%A1%E6%9D%BF%E7%AD%96%E7%95%A5%E7%A4%BA%E6%84%8F%E5%9B%BE.Dj17n61C.png",A=JSON.parse('{"title":"MatmulPolicy","description":"","frontmatter":{},"headers":[{"level":1,"title":"MatmulPolicy","slug":"matmulpolicy"},{"level":2,"title":"产品支持情况","slug":"产品支持情况"},{"level":2,"title":"功能说明","slug":"功能说明"},{"level":2,"title":"约束说明","slug":"约束说明"},{"level":2,"title":"调用示例","slug":"调用示例"}],"relativePath":"api/SIMD-API/高阶API/矩阵计算/Matmul-Kernel侧接口/MatmulPolicy.md","filePath":"api/SIMD-API/高阶API/矩阵计算/Matmul-Kernel侧接口/MatmulPolicy.md"}'),u={name:"api/SIMD-API/高阶API/矩阵计算/Matmul-Kernel侧接口/MatmulPolicy.md"};function o(d,s,M,T,g,C){return n(),l("div",null,[...s[0]||(s[0]=[p('<h1 id="matmulpolicy" tabindex="-1">MatmulPolicy <a class="header-anchor" href="#matmulpolicy" aria-label="Permalink to &quot;MatmulPolicy&quot;">​</a></h1><h2 id="产品支持情况" tabindex="-1">产品支持情况 <a class="header-anchor" href="#产品支持情况" aria-label="Permalink to &quot;产品支持情况&quot;">​</a></h2><table tabindex="0"><thead><tr><th>产品</th><th>MatmulPolicy</th><th>TrianUpperMatmulPolicy/TrianLowerMatmulPolicy</th><th>NBuffer33MatmulPolicy</th><th>MatmulWithScalePolicy/SplitMMatmulPolicy/SplitNMatmulPolicy</th></tr></thead><tbody><tr><td>Ascend 950PR/Ascend 950DT</td><td>√</td><td>√</td><td>√</td><td>√</td></tr><tr><td>Atlas A3 训练系列产品/Atlas A3 推理系列产品</td><td>√</td><td>√</td><td>√</td><td>x</td></tr><tr><td>Atlas A2 训练系列产品/Atlas A2 推理系列产品</td><td>√</td><td>√</td><td>√</td><td>x</td></tr><tr><td>Atlas 200I/500 A2 推理产品</td><td>√</td><td>x</td><td>x</td><td>x</td></tr><tr><td>Atlas 推理系列产品AI Core</td><td>√</td><td>x</td><td>x</td><td>x</td></tr><tr><td>Atlas 推理系列产品Vector Core</td><td>x</td><td>x</td><td>x</td><td>x</td></tr><tr><td>Atlas 训练系列产品</td><td>x</td><td>x</td><td>x</td><td>x</td></tr><tr><td>Kirin X90</td><td>√</td><td>√</td><td>√</td><td>x</td></tr></tbody></table><h2 id="功能说明" tabindex="-1">功能说明 <a class="header-anchor" href="#功能说明" aria-label="Permalink to &quot;功能说明&quot;">​</a></h2><p>模板参数MatmulPolicy用于定义Matmul可拓展模块策略。目前支持设置以下四种Matmul内置模板策略。</p><ul><li><p>MatmulPolicy（默认模板策略）</p><p>使能Matmul API的默认实现策略。</p></li><li><p>TrianUpperMatmulPolicy（上三角模板策略）</p><p>一次矩阵乘指令计算的结果为<a href="./../Matmul-Tiling侧接口/Matmul-Tiling类/TCubeTiling结构体.html#p17899165811566">baseM * baseN</a>大小的矩阵块，称该矩阵块为基本块。若Matmul结果矩阵C中的基本块位于下三角位置，则Matmul内部做数据计算和数据搬出时，将不对该基本块进行处理，最后得到的矩阵C为一个上三角矩阵。上三角模板策略如下图所示，图示中矩阵形状的相关大小为M=N=512，K=256，baseM=baseN=baseK=32。</p><p><strong>图 1</strong> 上三角模板策略示意图<br><img src="'+e+'" alt="" title="上三角模板策略示意图"></p></li><li><p>TrianLowerMatmulPolicy（下三角模板策略）</p><p>一次矩阵乘指令计算的结果为<a href="./../Matmul-Tiling侧接口/Matmul-Tiling类/TCubeTiling结构体.html#p17899165811566">baseM * baseN</a>大小的矩阵块，称该矩阵块为基本块。若Matmul结果矩阵C中的基本块位于上三角位置，则Matmul内部做数据计算和数据搬出时，将不对该基本块进行处理，最后得到的矩阵C为一个下三角矩阵。下三角模板策略如下图所示，图示中矩阵形状的相关大小为M=N=512，K=256，baseM=baseN=baseK=32。</p><p><strong>图 2</strong> 下三角模板策略示意图<br><img src="'+t+'" alt="" title="下三角模板策略示意图"></p></li><li><p>NBuffer33MatmulPolicy（NBuffer33模板策略）</p><p>一次矩阵乘指令计算的结果为<a href="./../Matmul-Tiling侧接口/Matmul-Tiling类/TCubeTiling结构体.html#p17899165811566">baseM * baseN</a>大小的矩阵块，称该矩阵块为基本块。单核计算的A矩阵切分为3x3个基本块，该3x3个A矩阵的基本块全载和保持在L1 Buffer中，每次与3x1个B矩阵的基本块计算矩阵乘，同时DoubleBuffer并行搬入下次计算所需的3x1个B矩阵基本块，直到singleCoreN方向的矩阵乘计算完成。NBuffer33模板策略如下图所示，图中<a href="./../Matmul-Tiling侧接口/Matmul-Tiling类/TCubeTiling结构体.html#p11899125875617">singleCoreM、singleCoreN、singleCoreK</a>表示单核内A、B矩阵的shape大小，单核计算的A矩阵切分为3x3个基本块，3x3个基本块全载在L1 Buffer上，这些基本块每次与B矩阵的3x1个基本块计算矩阵乘。</p><p><strong>图 3</strong> NBuffer33模板策略示意图<br><img src="'+i+'" alt="" title="NBuffer33模板策略示意图"></p></li><li><p>MatmulWithScalePolicy（MxMatmul模板策略）</p><p>实现带有量化系数的矩阵乘法，即左矩阵和右矩阵均有对应的量化系数矩阵，左量化系数矩阵scaleA和右量化系数矩阵scaleB。MxMatmul场景中，左量化系数矩阵与左矩阵乘积，右量化系数矩阵与右矩阵乘积，对两个乘积的结果做矩阵乘法。</p><p>图4 MxMatmul模板策略示意图</p><p><img src="'+c+'" alt=""></p></li><li><p>SplitMMatmulPolicy（SplitM模板策略）</p><p>Matmul一次<a href="./Iterate.html">Iterate</a>的计算结果从L0C Buffer搬到Unified Buffer时，采用双输出模式，即在分离模式下，AIC核与AIV核的核数比为1：2时，在调用<a href="./GetTensorC.html">GetTensorC</a>接口后，Matmul一次Iterate的计算结果在矩阵的M方向一分为二，将被切分后的两块结果数据分别搬运到两个AIV核的Unified Buffer。模板策略示意图如下所示。</p><p><strong>图 4</strong> SplitM模板策略示意图<br><img src="'+m+'" alt="" title="SplitM模板策略示意图"></p></li><li><p>SplitNMatmulPolicy（SplitN模板策略）</p><p>Matmul一次<a href="./Iterate.html">Iterate</a>的计算结果从L0C Buffer搬到Unified Buffer时，采用双输出模式，即在分离模式下，AIC核与AIV核的核数比为1：2时，在调用<a href="./GetTensorC.html">GetTensorC</a>接口后，Matmul一次Iterate的计算结果在矩阵的N方向一分为二，将被切分后的两块结果数据分别搬运到两个AIV核的Unified Buffer。模板策略示意图如下所示。</p><p><strong>图 5</strong> SplitN模板策略示意图<br><img src="'+r+`" alt="" title="SplitN模板策略示意图"></p></li></ul><h2 id="约束说明" tabindex="-1">约束说明 <a class="header-anchor" href="#约束说明" aria-label="Permalink to &quot;约束说明&quot;">​</a></h2><ul><li><p>TrianUpperMatmulPolicy当前只支持<a href="./MatmulConfig.html#p159827389308">Norm模板</a>和<a href="./MatmulConfig.html#p109823386305">MDL模板</a>。</p></li><li><p>TrianLowerMatmulPolicy当前只支持<a href="./MatmulConfig.html#p159827389308">Norm模板</a>和<a href="./MatmulConfig.html#p109823386305">MDL模板</a>。</p></li><li><p>NBuffer33MatmulPolicy：</p><ul><li>当前只支持<a href="./MatmulConfig.html#p109823386305">MDL模板</a>。</li><li>A矩阵、B矩阵的内存逻辑位置只支持TPosition::GM。</li><li>暂不支持MIX模式（包含矩阵计算和矢量计算），仅支持纯Cube模式（只有矩阵计算）。</li><li>只支持通过<a href="./IterateAll.html">IterateAll</a>接口获取Matmul的计算结果C矩阵。</li><li><a href="./../Matmul-Tiling侧接口/Matmul-Tiling类/TCubeTiling结构体.html#p139009583566">stepM、stepKa、stepKb</a>小于等于3，且满足：stepKa=stepKb=ceil(<a href="./../Matmul-Tiling侧接口/Matmul-Tiling类/TCubeTiling结构体.html#p11899125875617">singleCoreK</a>/baseK)。</li><li>A矩阵全载的基本块大小与B矩阵载入的基本块大小之和不超过L1 Buffer大小。</li><li>在使用<a href="./../Matmul-Tiling侧接口/Matmul-Tiling类/GetTiling.html">GetTiling</a>接口生成Tiling参数前，必须通过<a href="./../Matmul-Tiling侧接口/Matmul-Tiling类/SetMatmulConfigParams.html">SetMatmulConfigParams</a>接口将scheduleTypeIn参数设置为ScheduleType::N_BUFFER_33，以启用NBuffer33模板策略的Tiling生成逻辑。</li></ul></li><li><p>MatmulWithScalePolicy：</p><ul><li>仅在Ascend 950PR/Ascend 950DT上支持。</li><li>当前只支持<a href="./MatmulConfig.html#p159827389308">Norm模板</a>和<a href="./MatmulConfig.html#p109823386305">MDL模板</a>。</li></ul></li><li><p>SplitMMatmulPolicy：</p><ul><li>仅在Ascend 950PR/Ascend 950DT上支持。</li><li>只支持C矩阵输出到Unified Buffer。</li><li>A矩阵、B矩阵类型信息MatmulType中的参数<a href="./Matmul使用说明.html#p1613334125414">IBSHARE</a>必须为true。</li></ul></li><li><p>SplitNMatmulPolicy：</p><ul><li>仅在Ascend 950PR/Ascend 950DT上支持。</li><li>只支持C矩阵输出到Unified Buffer。</li><li>baseN必须满足是16的倍数。</li><li><a href="./../Matmul-Tiling侧接口/Matmul-Tiling类/TCubeTiling结构体.html#table1563162142915">Tiling参数</a>必须满足：singleCoreM = baseM，singleCoreN = baseN，singleCoreK = baseK。</li><li>A矩阵、B矩阵类型信息MatmulType中的参数<a href="./Matmul使用说明.html#p1613334125414">IBSHARE</a>必须为true。</li></ul></li></ul><h2 id="调用示例" tabindex="-1">调用示例 <a class="header-anchor" href="#调用示例" aria-label="Permalink to &quot;调用示例&quot;">​</a></h2><p>默认模板策略MatmulPolicy为模板参数的默认值，下面主要介绍TrianUpperMatmulPolicy（上三角模板策略）和TrianLowerMatmulPolicy（下三角模板策略）的使用方式。</p><ul><li><p>上三角模板策略使用示例</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &quot;lib/matmul_intf.h&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>typedef AscendC::MatmulType&lt;AscendC::TPosition::GM, CubeFormat::ND, half&gt; aType; </span></span>
<span class="line"><span>typedef AscendC::MatmulType&lt;AscendC::TPosition::GM, CubeFormat::ND, half&gt; bType;</span></span>
<span class="line"><span>typedef AscendC::MatmulType&lt;AscendC::TPosition::GM, CubeFormat::ND, float&gt; cType; </span></span>
<span class="line"><span>typedef AscendC::MatmulType&lt;AscendC::TPosition::GM, CubeFormat::ND, float&gt; biasType;</span></span>
<span class="line"><span>// Matmul定义时传入TrianUpperMatmulPolicy</span></span>
<span class="line"><span>AscendC::Matmul&lt;aType, bType, cType, biasType, CFG_NORM, MatmulCallBackFunc&lt;nullptr, nullptr, nullptr&gt;, AscendC::Impl::Detail::TrianUpperMatmulPolicy&gt; mm; </span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 常规Matmul计算，最后输出上三角形式的结果</span></span>
<span class="line"><span>TPipe pipe;</span></span>
<span class="line"><span>TCubeTiling tiling;</span></span>
<span class="line"><span>REGIST_MATMUL_OBJ(&amp;pipe, GetSysWorkSpacePtr(), mm, &amp;tiling);</span></span>
<span class="line"><span>mm.SetTensorA(gmA, isTransposeA);</span></span>
<span class="line"><span>mm.SetTensorB(gmB, isTransposeB);</span></span>
<span class="line"><span>if (tiling.isBias) {</span></span>
<span class="line"><span>    mm.SetBias(gmBias);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>mm.IterateAll(gmC);</span></span>
<span class="line"><span>mm.End();</span></span></code></pre></div></li><li><p>下三角模板策略使用示例</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &quot;lib/matmul_intf.h&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>typedef AscendC::MatmulType&lt;AscendC::TPosition::GM, CubeFormat::ND, half&gt; aType; </span></span>
<span class="line"><span>typedef AscendC::MatmulType&lt;AscendC::TPosition::GM, CubeFormat::ND, half&gt; bType;</span></span>
<span class="line"><span>typedef AscendC::MatmulType&lt;AscendC::TPosition::GM, CubeFormat::ND, float&gt; cType; </span></span>
<span class="line"><span>typedef AscendC::MatmulType&lt;AscendC::TPosition::GM, CubeFormat::ND, float&gt; biasType;</span></span>
<span class="line"><span>// Matmul定义时传入TrianLowerMatmulPolicy</span></span>
<span class="line"><span>AscendC::Matmul&lt;aType, bType, cType, biasType, CFG_NORM, MatmulCallBackFunc&lt;nullptr, nullptr, nullptr&gt;, AscendC::Impl::Detail::TrianLowerMatmulPolicy&gt; mm; </span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 常规Matmul计算，最后输出下三角形式的结果</span></span>
<span class="line"><span>TPipe pipe;</span></span>
<span class="line"><span>TCubeTiling tiling;</span></span>
<span class="line"><span>REGIST_MATMUL_OBJ(&amp;pipe, GetSysWorkSpacePtr(), mm, &amp;tiling);</span></span>
<span class="line"><span>mm.SetTensorA(gmA, isTransposeA);</span></span>
<span class="line"><span>mm.SetTensorB(gmB, isTransposeB);</span></span>
<span class="line"><span>if (tiling.isBias) {</span></span>
<span class="line"><span>    mm.SetBias(gmBias);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>mm.IterateAll(gmC);</span></span>
<span class="line"><span>mm.End();</span></span></code></pre></div></li><li><p>NBuffer33模板策略使用示例</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &quot;lib/matmul_intf.h&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>typedef AscendC::MatmulType&lt;AscendC::TPosition::GM, CubeFormat::ND, half&gt; aType; </span></span>
<span class="line"><span>typedef AscendC::MatmulType&lt;AscendC::TPosition::GM, CubeFormat::ND, half&gt; bType;</span></span>
<span class="line"><span>typedef AscendC::MatmulType&lt;AscendC::TPosition::GM, CubeFormat::ND, float&gt; cType; </span></span>
<span class="line"><span>typedef AscendC::MatmulType&lt;AscendC::TPosition::GM, CubeFormat::ND, float&gt; biasType;</span></span>
<span class="line"><span>// Matmul定义时传入NBuffer33MatmulPolicy</span></span>
<span class="line"><span></span></span>
<span class="line"><span>AscendC::Matmul&lt;aType, bType, cType, biasType, CFG_NORM, MatmulCallBackFunc&lt;nullptr, nullptr, nullptr&gt;, AscendC::Impl::Detail::NBuffer33MatmulPolicy&gt; mm; </span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 常规Matmul计算，最后输出下三角形式的结果</span></span>
<span class="line"><span>TPipe pipe;</span></span>
<span class="line"><span>TCubeTiling tiling;</span></span>
<span class="line"><span>REGIST_MATMUL_OBJ(&amp;pipe, GetSysWorkSpacePtr(), mm, &amp;tiling);</span></span>
<span class="line"><span>mm.SetTensorA(gmA, isTransposeA);</span></span>
<span class="line"><span>mm.SetTensorB(gmB, isTransposeB);</span></span>
<span class="line"><span>if (tiling.isBias) {</span></span>
<span class="line"><span>    mm.SetBias(gmBias);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>mm.IterateAll(gmC);</span></span>
<span class="line"><span>mm.End();</span></span></code></pre></div></li><li><p>MxMatmul模板策略使用示例</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &quot;lib/matmul_intf.h&quot;</span></span>
<span class="line"><span>typedef MatmulTypeWithScale&lt;AscendC::TPosition::GM, AscendC::TPosition::GM, CubeFormat::ND, AType, isTransposeA&gt; aType;</span></span>
<span class="line"><span>typedef MatmulTypeWithScale&lt;AscendC::TPosition::GM, AscendC::TPosition::GM, CubeFormat::ND, BType, isTransposeB&gt; bType;</span></span>
<span class="line"><span>typedef AscendC::MatmulType&lt;AscendC::TPosition::GM, CubeFormat::ND, float&gt; cType; </span></span>
<span class="line"><span>typedef AscendC::MatmulType&lt;AscendC::TPosition::GM, CubeFormat::ND, float&gt; biasType;</span></span>
<span class="line"><span>// Matmul定义时传入MatmulWithScalePolicy</span></span>
<span class="line"><span>AscendC::Matmul&lt;aType, bType, cType, biasType, CFG_NORM, MatmulCallBackFunc&lt;nullptr, nullptr, nullptr&gt;, AscendC::Impl::Detail::MatmulWithScalePolicy&gt; mm; </span></span>
<span class="line"><span></span></span>
<span class="line"><span>// MxMatmul计算逻辑，最后输出结果</span></span>
<span class="line"><span>TPipe pipe;</span></span>
<span class="line"><span>TCubeTiling tiling;</span></span>
<span class="line"><span>REGIST_MATMUL_OBJ(&amp;pipe, GetSysWorkSpacePtr(), mm, &amp;tiling);</span></span>
<span class="line"><span>mm.SetTensorA(gmA, isTransposeA);</span></span>
<span class="line"><span>mm.SetTensorB(gmB, isTransposeB);</span></span>
<span class="line"><span>mm.SetTensorScaleA(gm_scaleA, isTransposeScaleA);</span></span>
<span class="line"><span>mm.SetTensorScaleB(gm_scaleB, isTransposeScaleB);</span></span>
<span class="line"><span>if (tiling.isBias) {</span></span>
<span class="line"><span>    mm.SetBias(gmBias);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>mm.IterateAll(gmC);</span></span>
<span class="line"><span>mm.End();</span></span></code></pre></div></li><li><p>SplitM模板策略使用示例</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &quot;lib/matmul_intf.h&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>typedef AscendC::MatmulType&lt;AscendC::TPosition::GM, CubeFormat::ND, half, LayoutMode::NONE, true&gt; aType; </span></span>
<span class="line"><span>typedef AscendC::MatmulType&lt;AscendC::TPosition::GM, CubeFormat::ND, half, LayoutMode::NONE, true&gt; bType;</span></span>
<span class="line"><span>typedef AscendC::MatmulType&lt;AscendC::TPosition::VECCALC, CubeFormat::ND, float&gt; cType; </span></span>
<span class="line"><span>typedef AscendC::MatmulType&lt;AscendC::TPosition::GM, CubeFormat::ND, float&gt; biasType;</span></span>
<span class="line"><span>// Matmul定义时传入SplitMMatmulPolicy</span></span>
<span class="line"><span>AscendC::Matmul&lt;aType, bType, cType, biasType, CFG_NORM, MatmulCallBackFunc&lt;nullptr, nullptr, nullptr&gt;, AscendC::Impl::Detail::SplitMMatmulPolicy&gt; mm;</span></span>
<span class="line"><span>// Matmul计算</span></span>
<span class="line"><span>TPipe pipe;</span></span>
<span class="line"><span>TCubeTiling tiling;</span></span>
<span class="line"><span>REGIST_MATMUL_OBJ(&amp;pipe, GetSysWorkSpacePtr(), mm, &amp;tiling);</span></span>
<span class="line"><span>mm.SetTensorA(gmA, isTransposeA);</span></span>
<span class="line"><span>mm.SetTensorB(gmB, isTransposeB);</span></span>
<span class="line"><span>if (tiling.isBias) {</span></span>
<span class="line"><span>    mm.SetBias(gmBias);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 调用GetTensorC接口后，将Matmul一次Iterate的计算结果一分为二，搬运到两个AIV核的Unified Buffer。</span></span>
<span class="line"><span>pipe.InitBuffer(resultCMatrix, 1, tiling.M * tiling.N * sizeof(C_T));</span></span>
<span class="line"><span>mm.template Iterate&lt;false&gt;();</span></span>
<span class="line"><span>bufferC = resultCMatrix.AllocTensor&lt;C_T&gt;();</span></span>
<span class="line"><span>uint16_t nIter_ = Ceil(tiling.singleCoreN, tiling.baseN);</span></span>
<span class="line"><span>uint16_t mIter_ = Ceil(tiling.singleCoreM, tiling.baseM);</span></span>
<span class="line"><span>uint16_t mnIter_ = nIter_ * mIter_;</span></span>
<span class="line"><span>uint16_t size = tiling.baseM / 2 * tiling.baseN;</span></span>
<span class="line"><span>for (int i = 0; i &lt; mnIter_; i++) {</span></span>
<span class="line"><span>     mm.template GetTensorC&lt;false&gt;(bufferC, false, false);  // false // kfc vec0 iterate             </span></span>
<span class="line"><span>     PipeBarrier&lt;PIPE_ALL&gt;();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>mm.End();</span></span>
<span class="line"><span>resultCMatrix.EnQue(bufferC);</span></span>
<span class="line"><span>bufferC = resultCMatrix.DeQue&lt;C_T&gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>uint16_t baseOffset = tiling.M / 2 * tiling.N;</span></span>
<span class="line"><span>uint16_t stride = tiling.M / 2 * tiling.N * sizeof(C_T) / 32;  // 32B</span></span>
<span class="line"><span>const uint16_t blockCount = tiling.M / tiling.M;</span></span>
<span class="line"><span>if (GetSubBlockIdxImpl() == 0) {</span></span>
<span class="line"><span>    DataCopy(gmC, bufferC, {blockCount, stride, stride, stride});</span></span>
<span class="line"><span>} else {</span></span>
<span class="line"><span>    DataCopy(gmC[baseOffset], bufferC, {blockCount, stride, stride, stride});</span></span>
<span class="line"><span>}</span></span></code></pre></div></li><li><p>SplitN模板策略使用示例</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &quot;lib/matmul_intf.h&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>typedef AscendC::MatmulType&lt;AscendC::TPosition::GM, CubeFormat::ND, half, LayoutMode::NONE, true&gt; aType; </span></span>
<span class="line"><span>typedef AscendC::MatmulType&lt;AscendC::TPosition::GM, CubeFormat::ND, half, LayoutMode::NONE, true&gt; bType;</span></span>
<span class="line"><span>typedef AscendC::MatmulType&lt;AscendC::TPosition::VECCALC, CubeFormat::ND, float&gt; cType; </span></span>
<span class="line"><span>typedef AscendC::MatmulType&lt;AscendC::TPosition::GM, CubeFormat::ND, float&gt; biasType;</span></span>
<span class="line"><span>// Matmul定义时传入SplitNMatmulPolicy</span></span>
<span class="line"><span>AscendC::Matmul&lt;aType, bType, cType, biasType, CFG_NORM, MatmulCallBackFunc&lt;nullptr, nullptr, nullptr&gt;, AscendC::Impl::Detail::SplitNMatmulPolicy&gt; mm;</span></span>
<span class="line"><span>// Matmul计算</span></span>
<span class="line"><span>TPipe pipe;</span></span>
<span class="line"><span>TCubeTiling tiling;</span></span>
<span class="line"><span>REGIST_MATMUL_OBJ(&amp;pipe, GetSysWorkSpacePtr(), mm, &amp;tiling);</span></span>
<span class="line"><span>mm.SetTensorA(gmA, isTransposeA);</span></span>
<span class="line"><span>mm.SetTensorB(gmB, isTransposeB);</span></span>
<span class="line"><span>if (tiling.isBias) {</span></span>
<span class="line"><span>    mm.SetBias(gmBias);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 调用GetTensorC接口后，将Matmul一次Iterate的计算结果一分为二，搬运到两个AIV核的Unified Buffer。</span></span>
<span class="line"><span>pipe.InitBuffer(resultCMatrix, 1, tiling.M * tiling.N * sizeof(C_T));</span></span>
<span class="line"><span>mm.template Iterate&lt;false&gt;();</span></span>
<span class="line"><span>bufferC = resultCMatrix.AllocTensor&lt;C_T&gt;();</span></span>
<span class="line"><span>uint16_t nIter_ = Ceil(tiling.singleCoreN, tiling.baseN);</span></span>
<span class="line"><span>uint16_t mIter_ = Ceil(tiling.singleCoreM, tiling.baseM);</span></span>
<span class="line"><span>uint16_t mnIter_ = nIter_ * mIter_;</span></span>
<span class="line"><span>uint16_t size = tiling.baseM / 2 * tiling.baseN;</span></span>
<span class="line"><span>for (int i = 0; i &lt; mnIter_; i++) {</span></span>
<span class="line"><span>     mm.template GetTensorC&lt;false&gt;(bufferC, false, false);  // false // kfc vec0 iterate             </span></span>
<span class="line"><span>     PipeBarrier&lt;PIPE_ALL&gt;();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>mm.End();</span></span>
<span class="line"><span>resultCMatrix.EnQue(bufferC);</span></span>
<span class="line"><span>bufferC = resultCMatrix.DeQue&lt;C_T&gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>uint16_t baseOffset = tiling.N / 2;</span></span>
<span class="line"><span>uint16_t blockCount = tiling.M;</span></span>
<span class="line"><span>uint16_t blockLen = (tiling.N / 2 * sizeof(C_T)) / 32;</span></span>
<span class="line"><span>uint16_t srcStride = 0;</span></span>
<span class="line"><span>uint16_t dstStride = (tiling.N / 2 * sizeof(C_T)) / 32;</span></span>
<span class="line"><span>if (GetSubBlockIdxImpl() == 0) {</span></span>
<span class="line"><span>    DataCopy(gmC, bufferC, {blockCount, blockLen, srcStride, dstStride});</span></span>
<span class="line"><span>} else {</span></span>
<span class="line"><span>    DataCopy(gmC[baseOffset], bufferC, {blockCount, blockLen, srcStride, dstStride});</span></span>
<span class="line"><span>}</span></span></code></pre></div></li></ul>`,11)])])}const y=a(u,[["render",o]]);export{A as __pageData,y as default};
