import{_ as s,a as t,b as n}from"./chunks/Nd2Nz转换示意图-19.pTayIwq-.js";import{c as p,Q as i,j as l,m as e}from"./chunks/framework.DOi4mjdC.js";const r="/assets/Nd2Nz%E8%BD%AC%E6%8D%A2%E7%A4%BA%E6%84%8F%E5%9B%BE-13.Cj1DShtL.png",d="/assets/Nd2Nz%E8%BD%AC%E6%8D%A2%E7%A4%BA%E6%84%8F%E5%9B%BE-14.D6Jszea-.png",c="/assets/Nd2Nz%E8%BD%AC%E6%8D%A2%E7%A4%BA%E6%84%8F%E5%9B%BE-15.CGsMblzt.png",o="/assets/Nd2Nz%E8%BD%AC%E6%8D%A2%E7%A4%BA%E6%84%8F%E5%9B%BE-16.DrUdcaKt.png",m="/assets/Nd2Nz%E8%BD%AC%E6%8D%A2%E7%A4%BA%E6%84%8F%E5%9B%BE-17.Bapt0c8x.png",g=JSON.parse('{"title":"LoadDataWithTranspose","description":"","frontmatter":{},"headers":[{"level":1,"title":"LoadDataWithTranspose","slug":"loaddatawithtranspose"},{"level":2,"title":"产品支持情况","slug":"产品支持情况"},{"level":2,"title":"功能说明","slug":"功能说明"},{"level":2,"title":"函数原型","slug":"函数原型"},{"level":2,"title":"参数说明","slug":"参数说明"},{"level":2,"title":"约束说明","slug":"约束说明"},{"level":2,"title":"调用示例","slug":"调用示例"}],"relativePath":"api/SIMD-API/基础API/矩阵计算（ISASI）/数据搬运/LoadDataWithTranspose.md","filePath":"api/SIMD-API/基础API/矩阵计算（ISASI）/数据搬运/LoadDataWithTranspose.md"}'),f={name:"api/SIMD-API/基础API/矩阵计算（ISASI）/数据搬运/LoadDataWithTranspose.md"};function h(_,a,u,D,A,b){return i(),l("div",null,[...a[0]||(a[0]=[e('<h1 id="loaddatawithtranspose" tabindex="-1">LoadDataWithTranspose <a class="header-anchor" href="#loaddatawithtranspose" aria-label="Permalink to &quot;LoadDataWithTranspose&quot;">​</a></h1><h2 id="产品支持情况" tabindex="-1">产品支持情况 <a class="header-anchor" href="#产品支持情况" aria-label="Permalink to &quot;产品支持情况&quot;">​</a></h2><table tabindex="0"><thead><tr><th>产品</th><th>是否支持</th></tr></thead><tbody><tr><td>Ascend 950PR/Ascend 950DT</td><td>√</td></tr><tr><td>Atlas A3 训练系列产品/Atlas A3 推理系列产品</td><td>√</td></tr><tr><td>Atlas A2 训练系列产品/Atlas A2 推理系列产品</td><td>√</td></tr><tr><td>Atlas 200I/500 A2 推理产品</td><td>√</td></tr><tr><td>Atlas 推理系列产品AI Core</td><td>x</td></tr><tr><td>Atlas 推理系列产品Vector Core</td><td>x</td></tr><tr><td>Atlas 训练系列产品</td><td>x</td></tr><tr><td>Kirin X90</td><td>√</td></tr><tr><td>Kirin 9030</td><td>x</td></tr></tbody></table><h2 id="功能说明" tabindex="-1">功能说明 <a class="header-anchor" href="#功能说明" aria-label="Permalink to &quot;功能说明&quot;">​</a></h2><p>该接口实现带转置的2D格式数据从A1/B1到A2/B2的加载。</p><p>下面通过示例来讲解接口功能和关键参数：下文图中一个N形或者一个Z形代表一个分形。</p><ul><li><p>对于uint8_t/int8_t数据类型，每次迭代处理32*32*1B数据，可处理2个分形（一个分形512B），每次迭代中，源操作数中2个连续的16*32分形将被合并为1个32*32的方块矩阵，基于方块矩阵做转置，转置后分裂为2个16*32分形，根据目的操作数分形间隔等参数可以有不同的排布。</p><p>如下图示例：</p><ul><li>共需要处理3072B的数据，每次迭代处理32*32*1B数据，需要3次迭代可以完成，repeatTime = 3；</li><li>srcStride = 1，表示相邻迭代间，源操作数前一个方块矩阵与后一个方块矩阵起始地址的间隔为1（单位：32*32*1B），这里的单位实际上是拼接后的方块矩阵的大小；</li><li>dstGap = 1，表示相邻迭代间，目的操作数前一个迭代第一个分形的结束地址到下一个迭代第一个分形起始地址的间隔为1（单位：512B）；</li><li>dstFracGap = 0，表示每个迭代内目的操作数前一个分形的结束地址与后一个分形起始地址的间隔为0（单位：512B）。</li></ul><p><img src="'+r+'" alt=""></p><p>如下图示例：</p><ul><li>repeatTime和srcStride的解释和上图示例一致。</li><li>dstGap = 0，表示相邻迭代间，目的操作数前一个迭代第一个分形的结束地址和下一个迭代第一个分形起始地址无间隔。</li><li>dstFracGap = 2，表示每个迭代内目的操作数前一个分形的结束地址与后一个分形起始地址的间隔为2（单位：512B）。</li></ul><p><img src="'+d+'" alt=""></p></li><li><p>对于half/bfloat16_t数据类型，每次迭代处理16*16*2B数据，可处理1个分形（一个分形512B），每次迭代中，源操作数中1个16*16分形将被转置。</p><ul><li>共需要处理1536B的数据，每次迭代处理16*16*2B数据，需要3次迭代可以完成，repeatTime = 3；</li><li>srcStride = 1，表示相邻迭代间，源操作数前一个方块矩阵与后一个方块矩阵起始地址的间隔为1 （单位：16*16*2B）；</li><li>dstGap = 0，表示相邻迭代间，目的操作数前一个迭代第一个分形的结束地址到下一个迭代第一个分形起始地址无间隔；</li><li>该场景下，因为其分形即为方块矩阵，每个迭代处理一个分形，不存在迭代内分形的间隔，该参数设置无效。</li></ul><p><img src="'+c+'" alt=""></p></li><li><p>对于float/int32_t/uint32_t数据类型，每次迭代处理16*16*4B数据，可处理2个分形（一个分形512B），每次迭代中，源操作数2个连续的16*8分形将被合并为1个16*16的方块矩阵，基于方块矩阵做转置，转置后分裂为2个16*8分形，根据目的操作数分形间隔等参数可以有不同的排布。</p><p>如下图示例：</p><ul><li>共需要处理3072B的数据，每次迭代处理16*16*4B数据，需要3次迭代可以完成，repeatTime = 3；</li><li>srcStride = 1，表示相邻迭代间，源操作数前一个方块矩阵与后一个方块矩阵起始地址的间隔为1（单位：16*16*4B），这里的单位实际上是拼接后的方块矩阵的大小；</li><li>dstGap = 1，表示相邻迭代间，目的操作数前一个迭代第一个分形的结束地址到下一个迭代第一个分形起始地址的间隔为1（单位：512B）；</li><li>dstFracGap = 0，表示每个迭代内目的操作数前一个分形结束地址与后一个分形起始地址的间隔为0（单位：512B）。</li></ul><p><img src="'+o+'" alt=""></p><p>如下图示例：</p><ul><li>repeatTime和srcStride的解释和上图示例一致。</li><li>dstGap = 0，表示相邻迭代间，目的操作数前一个迭代第一个分形的结束地址和下一个迭代第一个分形起始地址无间隔。</li><li>dstFracGap = 2，表示每个迭代内目的操作数前一个分形结束地址与后一个分形起始地址的间隔为2（单位：512B）。</li></ul><p><img src="'+m+'" alt=""></p></li><li><p>对于int4b_t数据类型，每次迭代处理64*64*0.5B数据，可处理4个分形（一个分形512B），每次迭代中，源操作数中4个连续的16*64分形将被合并为1个64*64的方块矩阵，基于方块矩阵做转置，转置后分裂为4个16*64分形，根据目的操作数分形间隔等参数可以有不同的排布。</p><p>int4b_t数据类型需要两个数拼成一个int8_t或uint8_t的数，拼凑的规则如下：</p><p><img src="'+s+'" alt=""></p><p>如下图示例：</p><ul><li>共需要处理6144B的数据，每次迭代处理64*64*0.5B数据，需要3次迭代可以完成，repeatTime = 3；</li><li>srcStride = 1，表示相邻迭代间，源操作数前一个方块矩阵与后一个方块矩阵起始地址的间隔为1（单位：64*64*0.5B），这里的单位实际上是拼接后的方块矩阵的大小；</li><li>dstGap = 1，表示相邻迭代间，目的操作数前一个迭代第一个分形的结束地址到下一个迭代第一个分形起始地址的间隔为1（单位：512B）；</li><li>dstFracGap = 0，表示每个迭代内目的操作数前一个分形的结束地址与后一个分形起始地址的间隔为0（单位：512B）。</li></ul><p><img src="'+t+'" alt=""></p><p>如下图示例：</p><ul><li>repeatTime和srcStride的解释和上图示例一致。</li><li>dstGap = 0，表示相邻迭代间，目的操作数前一个迭代第一个分形的结束地址和下一个迭代第一个分形起始地址无间隔。</li><li>dstFracGap = 2，表示每个迭代内目的操作数前一个分形的结束地址与后一个分形起始地址的间隔为2（单位：512B）。</li></ul><p><img src="'+n+`" alt=""></p></li></ul><h2 id="函数原型" tabindex="-1">函数原型 <a class="header-anchor" href="#函数原型" aria-label="Permalink to &quot;函数原型&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>template &lt;typename T&gt;</span></span>
<span class="line"><span>__aicore__ inline void LoadDataWithTranspose(const LocalTensor&lt;T&gt;&amp; dst, const LocalTensor&lt;T&gt;&amp; src, const LoadData2dTransposeParams&amp; loadDataParams)</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 该函数原型仅支持Ascend 950PR/Ascend 950DT</span></span>
<span class="line"><span>template &lt;typename T&gt;</span></span>
<span class="line"><span>__aicore__ inline void LoadDataWithTranspose(const LocalTensor&lt;T&gt;&amp; dst, const LocalTensor&lt;T&gt;&amp; src, const LoadData2dTransposeParamsV2&amp; loadDataParams)</span></span></code></pre></div><h2 id="参数说明" tabindex="-1">参数说明 <a class="header-anchor" href="#参数说明" aria-label="Permalink to &quot;参数说明&quot;">​</a></h2><p><strong>表 1</strong> 模板参数说明</p><table tabindex="0"><thead><tr><th>参数名</th><th>描述</th></tr></thead><tbody><tr><td>T</td><td>Atlas A2 训练系列产品/Atlas A2 推理系列产品，支持的数据类型为：int4b_t/int8_t/uint8_t/half/bfloat16_t/float/int32_t/uint32_t，其中int4b_t仅支持B1-&gt;B2通路。 Atlas A3 训练系列产品/Atlas A3 推理系列产品，支持的数据类型为：int4b_t/int8_t/uint8_t/half/bfloat16_t/float/int32_t/uint32_t，其中int4b_t仅支持B1-&gt;B2通路。 Atlas 200I/500 A2 推理产品，支持的数据类型为：int4b_t/uint8_t/int8_t/uint16_t/int16_t/half/bfloat16_t/uint32_t/int32_t/float。 Ascend 950PR/Ascend 950DT，支持数据类型：int8_t/uint8_t/half/bfloat16_t/float/int32_t/uint32_t。 其中int4b_t数据类型仅在LocalTensor的TPosition为B2时支持。 Kirin X90，支持数据类型：int8_t/half。</td></tr></tbody></table><p><strong>表 2</strong> 参数说明</p><table tabindex="0"><thead><tr><th>参数名称</th><th>输入/输出</th><th>含义</th></tr></thead><tbody><tr><td>dst</td><td>输出</td><td>目的操作数，结果矩阵，类型为LocalTensor。 Atlas A2 训练系列产品/Atlas A2 推理系列产品，支持的TPosition为A2/B2。 Atlas A3 训练系列产品/Atlas A3 推理系列产品，支持的TPosition为A2/B2。 Atlas 200I/500 A2 推理产品，支持的TPosition为A2/B2。 Ascend 950PR/Ascend 950DT，支持的TPosition为B2。 Kirin X90，支持的TPosition为A2/B2。 LocalTensor的起始地址需要保证512字节对齐。 数据类型和src的数据类型保持一致。</td></tr><tr><td>src</td><td>输入</td><td>源操作数，类型为LocalTensor。 Atlas A2 训练系列产品/Atlas A2 推理系列产品，支持的TPosition为A1/B1。 Atlas A3 训练系列产品/Atlas A3 推理系列产品，支持的TPosition为A1/B1。 Atlas 200I/500 A2 推理产品，支持的TPosition为A1/B1。 Ascend 950PR/Ascend 950DT，支持的TPosition为B1。 Kirin X90，支持的TPosition为A1/B1。 LocalTensor的起始地址需要保证32字节对齐。 数据类型和dst的数据类型保持一致。</td></tr><tr><td>loadDataParams</td><td>输入</td><td>LoadDataWithTranspose相关参数，类型为LoadData2dTransposeParams。 具体定义请参考\${INSTALL_DIR}/include/ascendc/basic_api/interface/kernel_struct_mm.h，\${INSTALL_DIR}请替换为CANN软件安装后文件存储路径。 参数说明请参考表3。</td></tr><tr><td>loadDataParams</td><td>输入</td><td>LoadDataWithTranspose相关参数，类型为LoadData2dTransposeParamsV2。 参数说明请参考表4。</td></tr></tbody></table><p><strong>表 3</strong> LoadData2dTransposeParams结构体内参数说明</p><table tabindex="0"><thead><tr><th>参数名称</th><th>输入/输出</th><th>含义</th></tr></thead><tbody><tr><td>startIndex</td><td>输入</td><td>方块矩阵ID，搬运起始位置为源操作数中第几个方块矩阵（0 为源操作数中第1个方块矩阵）。取值范围：startIndex∈[0, 65535] 。默认为0。 例如，源操作数中有20个大小为16<em>8</em>4B的分形（数据类型为float），startIndex=1表示搬运起始位置为第2个方块矩阵，即将第3和第4个分形从源操作数中转置到目的操作数中（第1、2个分形组成第1个方块矩阵，第3、4个分形组成第2个方块矩阵）。</td></tr><tr><td>repeatTimes</td><td>输入</td><td>迭代次数。 对于uint8_t/int8_t数据类型，每次迭代处理32<em>32</em>1B数据； 对于half/bfloat16_t数据类型，每次迭代处理16<em>16</em>2B数据； 对于float/int32_t/uint32_t数据类型，每次迭代处理16<em>16</em>4B数据。 对于int4b_t数据类型，每次迭代处理16<em>64</em>0.5B数据。 取值范围：repeatTimes∈[0, 255]。默认为0。</td></tr><tr><td>srcStride</td><td>输入</td><td>相邻迭代间，源操作数前一个分形与后一个分形起始地址的间隔。这里的单位实际上是拼接后的方块矩阵的大小。 对于uint8_t/int8_t数据类型，单位是32<em>32</em>1B； 对于half/bfloat16_t数据类型，单位是16<em>16</em>2B； 对于float/int32_t/uint32_t数据类型，单位是16<em>16</em>4B。 对于int4b_t数据类型，每次迭代处理16<em>64</em>0.5B数据。 取值范围：srcStride∈[0, 65535]。默认为0。</td></tr><tr><td>dstGap</td><td>输入</td><td>相邻迭代间，目的操作数前一个迭代第一个分形的结束地址到下一个迭代第一个分形起始地址的间隔，单位：512B。取值范围：dstGap∈[0, 65535]。默认为0。</td></tr><tr><td>dstFracGap</td><td>输入</td><td>每个迭代内目的操作数转置前一个分形结束地址与后一个分形起始地址的间隔，单位为512B，仅在数据类型为float/int32_t/uint32_t/uint8_t/int8_t/int4b_t时有效。取值范围：dstFracGap∈[0, 65535]。默认为0。</td></tr><tr><td>addrMode</td><td>输入</td><td>控制地址更新方式，默认为false： true：递减，每次迭代在前一个地址的基础上减去srcStride。false：递增，每次迭代在前一个地址的基础上加上srcStride。</td></tr></tbody></table><p><strong>表 4</strong> LoadData2dTransposeParamsV2结构体内参数说明</p><table tabindex="0"><thead><tr><th>参数名称</th><th>输入/输出</th><th>含义</th></tr></thead><tbody><tr><td>startIndex</td><td>输入</td><td>方块矩阵 ID，搬运起始位置为源操作数中第几个分形。取值范围：startIndex∈[0, 65535] 。默认为0。</td></tr><tr><td>repeatTimes</td><td>输入</td><td>迭代次数。 对于int4b_t数据类型，每次迭代处理4个分形，每个分形为16<em>64</em>0.5B数据。 对于uint8_t/int8_t数据类型，每次迭代处理2个分形，每个分形处理16<em>32</em>1B数据； 对于half/bfloat16_t数据类型，每次迭代处理1个分形，每个分形处理16<em>16</em>2B数据； 对于int32_t/uint32_t/float数据类型，每次迭代处理4个分形，每个分形为16<em>8</em>4B数据。 取值范围：repeatTimes∈[1, 255]。</td></tr><tr><td>srcStride</td><td>输入</td><td>相邻迭代间，源操作数前一个分形与后一个分形起始地址的间隔。单位为单个分形512B。 取值范围：srcStride∈[0, 65535]。默认为0。</td></tr><tr><td>dstGap</td><td>输入</td><td>相邻迭代间，目的操作数前一个迭代第一个分形的结束地址到下一个迭代第一个分形起始地址的间隔，单位：512B。取值范围：dstGap∈[0, 65535]。默认为0。</td></tr><tr><td>dstFracGap</td><td>输入</td><td>每个迭代内目的操作数转置前一个分形结束地址与后一个分形起始地址的间隔，单位为512B，仅在数据类型为float/int32_t/uint32_t/uint8_t/int8_t/int4b_t时有效。</td></tr><tr><td>srcFracGap</td><td>输入</td><td>每个迭代内源操作数前一个分形结束地址与后一个分形起始地址的间隔，单位为512B，仅在数据类型为float/int32_t/uint32_t/uint8_t/int8_t/int4b_t时有效。</td></tr><tr><td>addrMode</td><td>输入</td><td>控制地址更新方式，默认为false： true：递减，每次迭代在前一个地址的基础上减去srcStride。false：递增，每次迭代在前一个地址的基础上加上srcStride。</td></tr></tbody></table><h2 id="约束说明" tabindex="-1">约束说明 <a class="header-anchor" href="#约束说明" aria-label="Permalink to &quot;约束说明&quot;">​</a></h2><ul><li>repeat=0表示不执行搬运操作。</li><li>开发者需要保证目的操作数转置后的分形没有重叠。</li><li>操作数地址对齐要求请参见<a href="./../../../通用说明和约束.html#section796754519912">通用地址对齐约束</a>。</li><li>针对以下型号，推荐使用LoadData2dTransposeParamsV2作为参数，该参数具有更精细的搬运粒度。 <ul><li>Ascend 950PR/Ascend 950DT</li></ul></li></ul><h2 id="调用示例" tabindex="-1">调用示例 <a class="header-anchor" href="#调用示例" aria-label="Permalink to &quot;调用示例&quot;">​</a></h2><ul><li><p>示例1：该示例输入a矩阵为int8_t类型，shape为[40,70]，输入b矩阵为int8_t类型，shape为[70,50]，输出c的类型为int32_t。a矩阵从A1-&gt;A2转置，b矩阵从B1-&gt;B2转置，之后进行Mmad计算和Fixpipe计算。完整使用样例请参见<a href="https://gitcode.com/cann/asc-devkit/tree/master/examples/01_simd_cpp_api/02_features/03_basic_api/01_matrix_compute/load_data_l12l0" target="_blank" rel="noreferrer">LoadData_L12L0样例</a>。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>uint16_t m = 40, k = 70, n = 50;</span></span>
<span class="line"><span>uint32_t fractalShape[0] = 16;</span></span>
<span class="line"><span>uint32_t fractalShape[1] = 32 / sizeof(int8_t);</span></span>
<span class="line"><span>uint32_t fractalNum = 2</span></span>
<span class="line"><span>uint32_t fractalSize = fractalShape[0] * fractalShape[1];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// A矩阵 LoadDataWithTranspose: Nz -&gt; Zz</span></span>
<span class="line"><span>// dstoffset要根据A矩阵在L0上，宽度方向的对齐来求解</span></span>
<span class="line"><span>// CeilDivision计算两个整数相除，结果向上取整</span></span>
<span class="line"><span>uint32_t dstOffset = CeilDivision(k, fractalShape[1]) * fractalSize * fractalNum;</span></span>
<span class="line"><span>uint32_t srcOffset = CeilDivision(k, fractalShape[0] * fractalNum) * fractalSize * fractalNum;</span></span>
<span class="line"><span>AscendC::LoadData2dTransposeParams loadDataParams;</span></span>
<span class="line"><span>loadDataParams.startIndex = 0;</span></span>
<span class="line"><span>loadDataParams.repeatTimes = CeilDivision(k, fractalShape[0] * fractalNum);</span></span>
<span class="line"><span>loadDataParams.srcStride = 1;</span></span>
<span class="line"><span>loadDataParams.dstGap = 0;</span></span>
<span class="line"><span>loadDataParams.dstFracGap = CeilDivision(k, fractalShape[1]) - 1;</span></span>
<span class="line"><span>for (int i = 0; i &lt; CeilDivision(m, fractalShape[1]); ++i) {</span></span>
<span class="line"><span>	AscendC::LoadDataWithTranspose(a2Local[i * dstOffset], a1Local[i * srcOffset], loadDataParams);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// B矩阵 LoadDataWithTranspose: Nz -&gt; Zn</span></span>
<span class="line"><span>// CeilDivision计算两个整数相除，结果向上取整</span></span>
<span class="line"><span>uint32_t dstOffset = CeilDivision(n, fractalShape[0] * fractalNum) * fractalSize * fractalNum;</span></span>
<span class="line"><span>uint32_t srcOffset = fractalSize * fractalNum;</span></span>
<span class="line"><span>AscendC::LoadData2dTransposeParams loadDataParams;</span></span>
<span class="line"><span>loadDataParams.startIndex = 0;</span></span>
<span class="line"><span>loadDataParams.repeatTimes = CeilDivision(n, fractalShape[1]);</span></span>
<span class="line"><span>loadDataParams.srcStride = CeilDivision(k, fractalShape[0] * fractalNum);</span></span>
<span class="line"><span>loadDataParams.dstGap = 1;</span></span>
<span class="line"><span>loadDataParams.dstFracGap = 0;</span></span>
<span class="line"><span>for (int i = 0; i &lt; CeilDivision(k, fractalShape[0] * fractalNum); ++i) {</span></span>
<span class="line"><span>	AscendC::LoadDataWithTranspose(b2Local[i * dstOffset], b1Local[i * srcOffset], loadDataParams);</span></span>
<span class="line"><span>}</span></span></code></pre></div></li><li><p>示例2：该示例输入a矩阵为half类型，shape为[40,70]，输入b矩阵为half类型，shape为[70,50]，输出c的类型为float。a矩阵从A1-&gt;A2转置，b矩阵从B1-&gt;B2转置，之后进行Mmad计算和Fixpipe计算。完整使用样例请参见<a href="https://gitcode.com/cann/asc-devkit/tree/master/examples/01_simd_cpp_api/02_features/03_basic_api/01_matrix_compute/load_data_l12l0" target="_blank" rel="noreferrer">LoadData_L12L0样例</a>。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>uint16_t m = 40, k = 70, n = 50;</span></span>
<span class="line"><span>uint32_t fractalShape[0] = 16;</span></span>
<span class="line"><span>uint32_t fractalShape[1] = 32 / sizeof(half);</span></span>
<span class="line"><span>uint32_t fractalNum = 1</span></span>
<span class="line"><span>uint32_t fractalSize = fractalShape[0] * fractalShape[1];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// A矩阵 LoadDataWithTranspose: Nz -&gt; Zz</span></span>
<span class="line"><span>// CeilDivision计算两个整数相除，结果向上取整</span></span>
<span class="line"><span>uint32_t dstOffset = CeilDivision(k, fractalShape[1]) * fractalSize * fractalNum;</span></span>
<span class="line"><span>uint32_t srcOffset = CeilDivision(k, fractalShape[0] * fractalNum) * fractalSize * fractalNum;</span></span>
<span class="line"><span>AscendC::LoadData2dTransposeParams loadDataParams;</span></span>
<span class="line"><span>loadDataParams.startIndex = 0;</span></span>
<span class="line"><span>loadDataParams.repeatTimes = CeilDivision(k, fractalShape[0] * fractalNum);</span></span>
<span class="line"><span>loadDataParams.srcStride = 1;</span></span>
<span class="line"><span>loadDataParams.dstGap = 0;</span></span>
<span class="line"><span>loadDataParams.dstFracGap = CeilDivision(k, fractalShape[1]) - 1;</span></span>
<span class="line"><span>for (int i = 0; i &lt; CeilDivision(m, fractalShape[1]); ++i) {</span></span>
<span class="line"><span>  AscendC::LoadDataWithTranspose(a2Local[i * dstOffset], a1Local[i * srcOffset], loadDataParams);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// B矩阵 LoadDataWithTranspose: Nz -&gt; Zn</span></span>
<span class="line"><span>// CeilDivision计算两个整数相除，结果向上取整</span></span>
<span class="line"><span>uint32_t dstOffset = CeilDivision(n, fractalShape[0] * fractalNum) * fractalSize * fractalNum;</span></span>
<span class="line"><span>uint32_t srcOffset = fractalSize * fractalNum;</span></span>
<span class="line"><span>AscendC::LoadData2dTransposeParams loadDataParams;</span></span>
<span class="line"><span>loadDataParams.startIndex = 0;</span></span>
<span class="line"><span>loadDataParams.repeatTimes = CeilDivision(n, fractalShape[1]);</span></span>
<span class="line"><span>loadDataParams.srcStride = CeilDivision(k, fractalShape[0] * fractalNum);</span></span>
<span class="line"><span>loadDataParams.dstGap = 0;</span></span>
<span class="line"><span>loadDataParams.dstFracGap = 0;</span></span>
<span class="line"><span>for (int i = 0; i &lt; CeilDivision(k, fractalShape[0] * fractalNum); ++i) {</span></span>
<span class="line"><span>  AscendC::LoadDataWithTranspose(b2Local[i * dstOffset], b1Local[i * srcOffset], loadDataParams);</span></span>
<span class="line"><span>}</span></span></code></pre></div></li><li><p>示例3：该示例输入a矩阵为float类型，shape为[40,70]，输入b矩阵为float类型，shape为[70,50]，输出c的类型为float。a矩阵从A1-&gt;A2转置，b矩阵从B1-&gt;B2转置，之后进行Mmad计算和Fixpipe计算。完整使用样例请参见<a href="https://gitcode.com/cann/asc-devkit/tree/master/examples/01_simd_cpp_api/02_features/03_basic_api/01_matrix_compute/load_data_l12l0" target="_blank" rel="noreferrer">LoadData_L12L0样例</a>。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>uint32_t m = 40, k = 70, n = 50;</span></span>
<span class="line"><span>uint32_t fractalShape[0] = 16;</span></span>
<span class="line"><span>uint32_t fractalShape[1] = 32 / sizeof(float);</span></span>
<span class="line"><span>uint32_t fractalNum = 2</span></span>
<span class="line"><span>uint32_t fractalSize = fractalShape[0] * fractalShape[1];</span></span>
<span class="line"><span>// A矩阵 LoadDataWithTranspose: Zz -&gt; Zz</span></span>
<span class="line"><span>// CeilDivision计算两个整数相除，结果向上取整</span></span>
<span class="line"><span>uint32_t dstOffset = CeilDivision(k, fractalShape[1] * fractalNum) * fractalSize * fractalNum;</span></span>
<span class="line"><span>uint32_t srcOffset = fractalSize * fractalNum;</span></span>
<span class="line"><span>AscendC::LoadData2dTransposeParams loadDataParams;</span></span>
<span class="line"><span>loadDataParams.startIndex = 0;</span></span>
<span class="line"><span>loadDataParams.repeatTimes = CeilDivision(k, fractalShape[1] * fractalNum);</span></span>
<span class="line"><span>loadDataParams.srcStride = CeilDivision(m, fractalShape[1] * fractalNum);</span></span>
<span class="line"><span>loadDataParams.dstGap = 1;</span></span>
<span class="line"><span>loadDataParams.dstFracGap = 0;</span></span>
<span class="line"><span>for (int i = 0; i &lt; CeilDivision(m, fractalShape[1] * fractalNum); ++i) {</span></span>
<span class="line"><span>  AscendC::LoadDataWithTranspose(a2Local[i * dstOffset], a1Local[i * srcOffset], loadDataParams);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// B矩阵 LoadDataWithTranspose: Nz -&gt; Zn</span></span>
<span class="line"><span>// CeilDivision计算两个整数相除，结果向上取整</span></span>
<span class="line"><span>uint32_t dstOffset = CeilDivision(n, fractalShape[0]) * fractalSize * fractalNum;</span></span>
<span class="line"><span>uint32_t srcOffset = CeilDivision(n, fractalShape[1] * fractalNum) * fractalSize * fractalNum;</span></span>
<span class="line"><span>AscendC::LoadData2dTransposeParams loadDataParams;</span></span>
<span class="line"><span>loadDataParams.startIndex = 0;</span></span>
<span class="line"><span>loadDataParams.repeatTimes = CeilDivision(n, fractalShape[1] * fractalNum);</span></span>
<span class="line"><span>loadDataParams.srcStride = 1;</span></span>
<span class="line"><span>loadDataParams.dstGap = 0;</span></span>
<span class="line"><span>loadDataParams.dstFracGap = CeilDivision(n, fractalShape[0]) - 1;</span></span>
<span class="line"><span>for (int i = 0; i &lt; CeilDivision(k, fractalShape[0]); ++i) {</span></span>
<span class="line"><span>	AscendC::LoadDataWithTranspose(b2Local[i * dstOffset], b1Local[i * srcOffset], loadDataParams);</span></span>
<span class="line"><span>}</span></span></code></pre></div></li><li><p>示例4：该示例使用了LoadData2dTransposeParamsV2结构体作为参数，输入a矩阵为int8_t类型，shape为[128,128]，输入数据格式为NZ，输入b矩阵为int8_t类型，shape为[128,256]，输入数据格式为NZ，输出c的类型为float。a矩阵从A1-&gt;A2不转置，b矩阵从B1-&gt;B2转置，示例仅展示接口调用过程，其余计算和搬运不作参考。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>uint32 m = 256;</span></span>
<span class="line"><span>uint32 n = 256;</span></span>
<span class="line"><span>uint32 k = 128;</span></span>
<span class="line"><span>pipe = tpipe;</span></span>
<span class="line"><span>TQue&lt;TPosition::B1, 1&gt; qidB1_;</span></span>
<span class="line"><span>TQue&lt;TPosition::B2, 1&gt; qidB2_;</span></span>
<span class="line"><span>uint32 m = 128;</span></span>
<span class="line"><span>pipe-&gt;InitBuffer(qidB1_, 1, n * k * sizeof(int8_t));</span></span>
<span class="line"><span>pipe-&gt;InitBuffer(qidB2_, 1, n * k * sizeof(int8_t));</span></span>
<span class="line"><span>auto rightMatrix = qidB1_.template DeQue&lt;int8_t&gt;();</span></span>
<span class="line"><span>LocalTensor&lt;int8_t&gt; b2 = qidB2_.AllocTensor&lt;int8_t&gt;();</span></span>
<span class="line"><span>uint16_t fracNum = 2;</span></span>
<span class="line"><span>uint16_t kStep = CeilDiv(kLength, 16);</span></span>
<span class="line"><span>uint16_t nStep = CeilDiv(nLength, 32);</span></span>
<span class="line"><span>for (uint16_t i = 0; i &lt; nStep; i ++) {</span></span>
<span class="line"><span>    LoadData2dTransposeParamsV2 loadDataParams;</span></span>
<span class="line"><span>    loadDataParams.startIndex = i * kStep;</span></span>
<span class="line"><span>    loadDataParams.repeatTimes = kStep / 2;</span></span>
<span class="line"><span>    loadDataParams.srcStride = 2;</span></span>
<span class="line"><span>    loadDataParams.dstGap = nStep*2 - 1;</span></span>
<span class="line"><span>    LoadDataWithTranspose(b2[1024*i], rightMatrix, loadDataParams);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>qidB2_.EnQue(b2);</span></span>
<span class="line"><span>qidB1_.FreeTensor(rightMatrix);</span></span></code></pre></div></li></ul>`,23)])])}const P=p(f,[["render",h]]);export{g as __pageData,P as default};
