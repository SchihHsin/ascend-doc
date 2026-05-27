import{c as s,Q as a,j as p,m as t}from"./chunks/framework.DOi4mjdC.js";const e="/assets/fixpipe.C5R0JBwI.png",C=JSON.parse('{"title":"随路量化激活搬运","description":"","frontmatter":{},"headers":[{"level":1,"title":"随路量化激活搬运","slug":"随路量化激活搬运"},{"level":2,"title":"产品支持情况","slug":"产品支持情况"},{"level":2,"title":"功能说明","slug":"功能说明"},{"level":2,"title":"函数原型","slug":"函数原型"},{"level":2,"title":"参数说明","slug":"参数说明"},{"level":2,"title":"返回值说明","slug":"返回值说明"},{"level":2,"title":"约束说明","slug":"约束说明"},{"level":2,"title":"支持的通路和数据类型","slug":"支持的通路和数据类型"},{"level":2,"title":"调用示例","slug":"调用示例"}],"relativePath":"api/SIMD-API/基础API/Memory数据搬运/DataCopy/随路量化激活搬运.md","filePath":"api/SIMD-API/基础API/Memory数据搬运/DataCopy/随路量化激活搬运.md"}'),l={name:"api/SIMD-API/基础API/Memory数据搬运/DataCopy/随路量化激活搬运.md"};function i(c,n,d,o,r,u){return a(),p("div",null,[...n[0]||(n[0]=[t('<h1 id="随路量化激活搬运" tabindex="-1">随路量化激活搬运 <a class="header-anchor" href="#随路量化激活搬运" aria-label="Permalink to &quot;随路量化激活搬运&quot;">​</a></h1><h2 id="产品支持情况" tabindex="-1">产品支持情况 <a class="header-anchor" href="#产品支持情况" aria-label="Permalink to &quot;产品支持情况&quot;">​</a></h2><table tabindex="0"><thead><tr><th>产品</th><th>是否支持</th></tr></thead><tbody><tr><td>Ascend 950PR/Ascend 950DT</td><td>√</td></tr><tr><td>Atlas A3 训练系列产品/Atlas A3 推理系列产品</td><td>√</td></tr><tr><td>Atlas A2 训练系列产品/Atlas A2 推理系列产品</td><td>√</td></tr><tr><td>Atlas 200I/500 A2 推理产品</td><td>√</td></tr><tr><td>Atlas 推理系列产品AI Core</td><td>x</td></tr><tr><td>Atlas 推理系列产品Vector Core</td><td>x</td></tr><tr><td>Atlas 训练系列产品</td><td>x</td></tr></tbody></table><h2 id="功能说明" tabindex="-1">功能说明 <a class="header-anchor" href="#功能说明" aria-label="Permalink to &quot;功能说明&quot;">​</a></h2><p>支持在数据搬运过程中进行量化和Relu激活等操作，同时支持Local Memory到Global Memory通路NZ到ND格式的转换。</p><p><img src="'+e+`" alt=""></p><h2 id="函数原型" tabindex="-1">函数原型 <a class="header-anchor" href="#函数原型" aria-label="Permalink to &quot;函数原型&quot;">​</a></h2><ul><li><p>Local Memory -&gt; Global Memory，支持量化和Relu激活等操作，同时支持NZ到ND格式的转换</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>template &lt;typename T, typename U&gt;</span></span>
<span class="line"><span>__aicore__ inline void DataCopy(const GlobalTensor&lt;T&gt;&amp; dst, const LocalTensor&lt;U&gt;&amp; src, const DataCopyCO12DstParams&amp; intriParams)</span></span></code></pre></div></li><li><p>Local Memory -&gt; Local Memory，支持量化和Relu激活等操作</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>template &lt;typename T, typename U&gt;</span></span>
<span class="line"><span>__aicore__ inline void DataCopy(const LocalTensor&lt;T&gt;&amp; dst, const LocalTensor&lt;U&gt;&amp; src, const DataCopyCO12DstParams&amp; intriParams)</span></span></code></pre></div></li></ul><div class="note custom-block github-alert"><p class="custom-block-title">说明</p><p>各原型支持的具体数据通路和数据类型，请参考<a href="#section2614932173011">支持的通路和数据类型</a>。</p></div><h2 id="参数说明" tabindex="-1">参数说明 <a class="header-anchor" href="#参数说明" aria-label="Permalink to &quot;参数说明&quot;">​</a></h2><p><strong>表 1</strong> 模板参数说明</p><table tabindex="0"><thead><tr><th>参数名</th><th>描述</th></tr></thead><tbody><tr><td>T</td><td>目的操作数的数据类型。支持的数据类型请参考支持的通路和数据类型。</td></tr><tr><td>U</td><td>源操作数的数据类型。支持的数据类型请参考支持的通路和数据类型。</td></tr></tbody></table><p><strong>表 2</strong> 参数说明</p><table tabindex="0"><thead><tr><th>参数名称</th><th>输入/输出</th><th>含义</th></tr></thead><tbody><tr><td>dst</td><td>输出</td><td>目的操作数，类型为LocalTensor或GlobalTensor。</td></tr><tr><td>src</td><td>输入</td><td>源操作数，类型为LocalTensor。</td></tr><tr><td>intriParams</td><td>输入</td><td>搬运参数，类型为DataCopyCO12DstParams。 具体定义请参考\${INSTALL_DIR}/include/ascendc/basic_api/interface/kernel_struct_data_copy.h，\${INSTALL_DIR}请替换为CANN软件安装后文件存储路径。</td></tr></tbody></table><p><strong>表 3</strong> DataCopyCO12DstParams结构体参数定义（C0取值：一般情况下，C0 = 16；使能channelSplit（channel切分）时，C0 = 8）</p><table tabindex="0"><thead><tr><th>参数名称</th><th>含义</th></tr></thead><tbody><tr><td>nSize</td><td>src横向方向的size大小。 不使能NZ2ND功能，必须为C0的倍数，此时连续传输数据块的个数为nSize / C0。使能NZ2ND功能，不受限制。</td></tr><tr><td>mSize</td><td>src纵向方向的size大小。 不使能NZ2ND功能，连续传输数据块的大小为mSize * C0个元素的长度。 使能NZ2ND功能，NZ/ND矩阵的大小为mSize * nSize。</td></tr><tr><td>dstStride</td><td>不使能NZ2ND功能 dst相邻连续数据片段间隔（前面一个数据块的头与后面数据块的头的间隔），取值不为0。单位为DataBlock（32字节）。 使能NZ2ND功能 dst同一ND矩阵的相邻行的偏移（头与头），取值不为0， 单位为元素。</td></tr><tr><td>srcStride</td><td>不使能NZ2ND功能 src相邻连续数据片段间隔（前面一个数据块的头与后面数据块的头的间隔），必须为16的倍数。取值范围：srcStride∈[0, 65535]， 单位：C0_Size(C0 * sizeof(U)，U为src的数据类型)。 使能NZ2ND功能 src同一NZ矩阵的相邻Z排布的偏移（头与头），必须为16的倍数，取值范围：srcStride∈[0, 65535]，单位C0_size。</td></tr><tr><td>quantPre</td><td>用于控制量化模式，QuantMode_t类型，具体定义如下。默认值为QuantMode_t::NoQuant，即不使能量化功能。 配置为scalar量化时，需要调用SetFixpipePreQuantFlag接口来设置scalar量化参数；配置为tensor量化时，需要调用SetFixPipeConfig来设置tensor量化参数。&lt;pre class=&quot;screen&quot; codetype=&quot;Cpp&quot; id=&quot;screen1658855117287&quot;&gt;enum QuantMode_t { NoQuant, // 不使能量化功能 F322F16, // float cast成half，cast mode为CAST_RINT模式 F322BF16, // float cast成bfloat16_t，cast mode为CAST_RINT模式 DEQF16, // int32_t量化成half, scalar量化 VDEQF16, // int32_t量化成half，tensor量化 QF322B8_PRE, // float量化成int8_t/uint8_t，scalar量化 VQF322B8_PRE, // float量化成int8_t/uint8_t，tensor量化 REQ8, // int32_t量化成int8_t/uint8_t，scalar量化 VREQ8, // int32_t量化成int8_t/uint8_t，tensor量化 };&lt;/pre&gt;</td></tr><tr><td>reluPre</td><td>用于配置relu操作的模式，类型为uint8_t，取值如下： 0：不使能relu1：Normal relu</td></tr><tr><td>channelSplit</td><td>类型为bool，配置是否使能channel切分，对于float类型的dst生效。 false：不使能true：使能</td></tr><tr><td>nz2ndEn</td><td>类型为bool，配置是否使能NZ2ND的格式转换，仅在CO1 -&gt; GM通路生效。 如果要使能NZ2ND的功能需要同步调用SetFixpipeNz2ndFlag来设置格式转换的相关配置信息。 false：不使能true：使能</td></tr><tr><td>clipReluPre</td><td>用于配置是否使能ClipRelu操作，参数类型为uint8_t，取值如下：0，不使能ClipRelu；1，使能ClipRelu，此时需要调用SetFixPipeClipRelu来设置clipRelu的最大值。 该操作在随路量化后进行，quantPre配置后才能使用，当前支持的量化模式有F322F16/DEQF16/VDEQF16/QF322B8_PRE/VQF322B8_PRE/REQ8/VREQ8。该参数仅在Atlas 200I/500 A2 推理产品支持。</td></tr><tr><td>eltWiseOp</td><td>用于配置是否使能Elementwise操作及操作模式。Elementwise操作是指进行随路量化后，可以逐个元素加/减一个LocalTensor，大小为mSize * nSize，具体LocalTensor地址相关参数需要调用SetFixPipeAddr来设置。 eltWiseOp参数类型为uint8_t，取值如下： 0：不使能Elementwise1：Elementwise Addition2：Elementwise Subtraction 该参数仅在Atlas 200I/500 A2 推理产品支持。</td></tr><tr><td>sid</td><td>预留参数，为后续的功能做保留，开发者暂时无需关注。</td></tr></tbody></table><h2 id="返回值说明" tabindex="-1">返回值说明 <a class="header-anchor" href="#返回值说明" aria-label="Permalink to &quot;返回值说明&quot;">​</a></h2><p>无</p><h2 id="约束说明" tabindex="-1">约束说明 <a class="header-anchor" href="#约束说明" aria-label="Permalink to &quot;约束说明&quot;">​</a></h2><p>无</p><h2 id="支持的通路和数据类型" tabindex="-1">支持的通路和数据类型 <a class="header-anchor" href="#支持的通路和数据类型" aria-label="Permalink to &quot;支持的通路和数据类型&quot;">​</a></h2><p>下文的数据通路均通过逻辑位置<a href="./../../../其他数据类型/TPosition.html#table5376122715308">TPosition</a>来表达，并注明了对应的物理通路。TPosition与物理内存的映射关系见<a href="./../../../通用说明和约束.html#table07372185712">表1</a>。</p><p><strong>表 4</strong> Local Memory -&gt; Global Memory具体通路和支持的数据类型</p><table tabindex="0"><thead><tr><th>支持型号</th><th>数据通路</th><th>源操作数的数据类型</th><th>目的操作数的数据类型</th></tr></thead><tbody><tr><td>Atlas A2 训练系列产品/Atlas A2 推理系列产品</td><td>CO1 -&gt; GM（L0C Buffer -&gt; GM）</td><td>float</td><td>uint8_t、int8_t、half、bfloat16_t、float</td></tr><tr><td>Atlas A2 训练系列产品/Atlas A2 推理系列产品</td><td>CO1 -&gt; GM（L0C Buffer -&gt; GM）</td><td>int32_t</td><td>uint8_t、int8_t、half、int16_t、int32_t</td></tr><tr><td>Atlas A3 训练系列产品/Atlas A3 推理系列产品</td><td>CO1 -&gt; GM（L0C Buffer -&gt; GM）</td><td>float</td><td>uint8_t、int8_t、half、bfloat16_t、float</td></tr><tr><td>Atlas A3 训练系列产品/Atlas A3 推理系列产品</td><td>CO1 -&gt; GM（L0C Buffer -&gt; GM）</td><td>int32_t</td><td>uint8_t、int8_t、half、int16_t、int32_t</td></tr><tr><td>Atlas 200I/500 A2 推理产品</td><td>CO1 -&gt; GM（L0C Buffer -&gt; GM）</td><td>float</td><td>uint8_t、int8_t、half、bfloat16_t、float</td></tr><tr><td>Atlas 200I/500 A2 推理产品</td><td>CO1 -&gt; GM（L0C Buffer -&gt; GM）</td><td>int32_t</td><td>uint8_t、int8_t、half、int16_t、int32_t</td></tr><tr><td>Ascend 950PR/Ascend 950DT</td><td>CO1 -&gt; GM（L0C Buffer -&gt; GM）</td><td>float</td><td>uint8_t、int8_t、half、bfloat16_t、float</td></tr><tr><td>Ascend 950PR/Ascend 950DT</td><td>CO1 -&gt; GM（L0C Buffer -&gt; GM）</td><td>int32_t</td><td>uint8_t、int8_t、half、int16_t、int32_t</td></tr></tbody></table><p><strong>表 5</strong> Local Memory -&gt; Local Memory具体通路和支持的数据类型</p><table tabindex="0"><thead><tr><th>支持型号</th><th>数据通路</th><th>源操作数的数据类型</th><th>目的操作数的数据类型</th></tr></thead><tbody><tr><td>Atlas A2 训练系列产品/Atlas A2 推理系列产品</td><td>CO1 -&gt; A1（L0C Buffer -&gt; L1 Buffer）</td><td>float</td><td>uint8_t、int8_t、half、bfloat16_t</td></tr><tr><td>Atlas A2 训练系列产品/Atlas A2 推理系列产品</td><td>CO1 -&gt; A1（L0C Buffer -&gt; L1 Buffer）</td><td>int32_t</td><td>uint8_t、int8_t、half、int16_t</td></tr><tr><td>Atlas A3 训练系列产品/Atlas A3 推理系列产品</td><td>CO1 -&gt; A1（L0C Buffer -&gt; L1 Buffer）</td><td>float</td><td>uint8_t、int8_t、half、bfloat16_t</td></tr><tr><td>Atlas A3 训练系列产品/Atlas A3 推理系列产品</td><td>CO1 -&gt; A1（L0C Buffer -&gt; L1 Buffer）</td><td>int32_t</td><td>uint8_t、int8_t、half、int16_t</td></tr><tr><td>Ascend 950PR/Ascend 950DT</td><td>CO1 -&gt; A1（L0C Buffer -&gt; L1 Buffer）</td><td>float</td><td>uint8_t、int8_t、half、bfloat16_t、float</td></tr><tr><td>Ascend 950PR/Ascend 950DT</td><td>CO1 -&gt; A1（L0C Buffer -&gt; L1 Buffer）</td><td>int32_t</td><td>uint8_t、int8_t、half、int16_t、int32_t</td></tr></tbody></table><h2 id="调用示例" tabindex="-1">调用示例 <a class="header-anchor" href="#调用示例" aria-label="Permalink to &quot;调用示例&quot;">​</a></h2><ul><li><p>随路格式转换数据搬运，通路：CO1-&gt;A1、CO1-&gt;GM</p><p>示例：Mmad含有矩阵乘偏置，左矩阵和右矩阵的数据类型为int8_t，结果矩阵的数据类型为int32_t。量化模式DEQF16，Scalar量化参数为2.0，将Mmad计算出的结果由int32_t量化成half并搬出。完整算子样例参考：<a href="https://gitcode.com/cann/asc-devkit/tree/master/examples/01_simd_cpp_api/02_features/03_basic_api/00_data_movement/data_copy_l0c2gm" target="_blank" rel="noreferrer">随路Scalar量化样例</a>。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// Scalar量化，量化参数为2.0</span></span>
<span class="line"><span>float quantScalar = 2.0;</span></span>
<span class="line"><span>uint64_t deqScalar = static_cast&lt;uint64_t&gt;(*reinterpret_cast&lt;int32_t*&gt;(&amp;quantScalar));</span></span>
<span class="line"><span>// 将量化参数的标量写入寄存器，供后续DataCopy指令使用</span></span>
<span class="line"><span>AscendC::SetFixpipePreQuantFlag(deqScalar);</span></span>
<span class="line"><span>// 创建DataCopy的参数</span></span>
<span class="line"><span>AscendC::DataCopyCO12DstParams intriParams;</span></span>
<span class="line"><span>intriParams.nSize = n;</span></span>
<span class="line"><span>intriParams.mSize = m;</span></span>
<span class="line"><span>intriParams.srcStride = CeilAlign(m, CUBE_BLOCK);</span></span>
<span class="line"><span>intriParams.dstStride = n;</span></span>
<span class="line"><span>intriParams.quantPre = QuantMode_t::DEQF16;</span></span>
<span class="line"><span>intriParams.reluPre = 1; // 使能ReLU</span></span>
<span class="line"><span>intriParams.nz2ndEn = true; // 使能NZ2ND格式转换</span></span>
<span class="line"><span>// 根据intriParams中的参数，执行最终的数据搬运</span></span>
<span class="line"><span>AscendC::DataCopy(cGM, cLocal, intriParams);</span></span></code></pre></div><p>结果示例如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>输入数据（Fm，shape为[1, 4, 4, 32]，数据类型为int8_t）：</span></span>
<span class="line"><span>[[[[ 1  1  1  1  1  1  1  1  1  2  2  2  2  2  2  2  2  3  3  3  3  3  3  3  3  4  4  4  4  4  4  4]</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>   [12 12 13 13 13 13 13 13 13 13 14 14 14 14 14 14 14 14 15 15 15 15 15 15 15 15 16 16 16 16 16 16]]</span></span>
<span class="line"><span>  [[16 16 17 17 17 17 17 17 17 17 18 18 18 18 18 18 18 18 19 19 19 19 19 19 19 19 19 20 20 20 20 20]</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>   [28 28 28 28 29 29 29 29 29 29 29 29 30 30 30 30 30 30 30 30 31 31 31 31 31 31 31 31 32 32 32 32]]</span></span>
<span class="line"><span>  [[32 32 32 32 33 33 33 33 33 33 33 33 34 34 34 34 34 34 34 34 35 35 35 35 35 35 35 35 36 36 36 36]</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>   [44 44 44 44 44 45 45 45 45 45 45 45 45 46 46 46 46 46 46 46 46 46 47 47 47 47 47 47 47 47 48 48]]</span></span>
<span class="line"><span>  [[48 48 48 48 48 48 49 49 49 49 49 49 49 49 50 50 50 50 50 50 50 50 51 51 51 51 51 51 51 51 52 52]</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>   [60 60 60 60 60 60 60 61 61 61 61 61 61 61 61 62 62 62 62 62 62 62 62 63 63 63 63 63 63 63 63 64]]]]</span></span>
<span class="line"><span>输入数据（Weight，shape为[1, 2, 2, 128, 32]，数据类型为int8_t）：</span></span>
<span class="line"><span>[[[[[1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1]</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    [1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1]]]]]</span></span>
<span class="line"><span>输出数据（DstL0c，shape为[8, 16, 32]，数据类型为int32_t）：</span></span>
<span class="line"><span>[[[1572,1572,1572,1572,1572,1572,1572,1572,1572,1572,1572,1572,1572,1572,1572,1572],</span></span>
<span class="line"><span>  [2078,2078,2078,2078,2078,2078,2078,2078,2078,2078,2078,2078,2078,2078,2078,2078],</span></span>
<span class="line"><span>  [2582,2582,2582,2582,2582,2582,2582,2582,2582,2582,2582,2582,2582,2582,2582,2582],</span></span>
<span class="line"><span>  [3592,3592,3592,3592,3592,3592,3592,3592,3592,3592,3592,3592,3592,3592,3592,3592],</span></span>
<span class="line"><span>  [4097,4097,4097,4097,4097,4097,4097,4097,4097,4097,4097,4097,4097,4097,4097,4097],</span></span>
<span class="line"><span>  [4602,4602,4602,4602,4602,4602,4602,4602,4602,4602,4602,4602,4602,4602,4602,4602],</span></span>
<span class="line"><span>  [5612,5612,5612,5612,5612,5612,5612,5612,5612,5612,5612,5612,5612,5612,5612,5612],</span></span>
<span class="line"><span>  [6116,6116,6116,6116,6116,6116,6116,6116,6116,6116,6116,6116,6116,6116,6116,6116],</span></span>
<span class="line"><span>  [6622,6622,6622,6622,6622,6622,6622,6622,6622,6622,6622,6622,6622,6622,6622,6622],</span></span>
<span class="line"><span>  [0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0],</span></span>
<span class="line"><span>  [0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0],</span></span>
<span class="line"><span>  [0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0],</span></span>
<span class="line"><span>  [0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0],</span></span>
<span class="line"><span>  [0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0],</span></span>
<span class="line"><span>  [0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0],</span></span>
<span class="line"><span>  [0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0]],</span></span>
<span class="line"><span>  ...</span></span>
<span class="line"><span>输出数据（DstGm，shape为[8, 9, 32]，数据类型为half）：</span></span>
<span class="line"><span>[[[ 786.  786.  786.  786.  786.  786.  786.  786.  786.  786.  786.  786.  786.  786.  786.  786.]</span></span>
<span class="line"><span>   ...</span></span>
<span class="line"><span>  [1039. 1039. 1039. 1039. 1039. 1039. 1039. 1039. 1039. 1039. 1039. 1039. 1039. 1039. 1039. 1039.]</span></span>
<span class="line"><span>   ...</span></span>
<span class="line"><span>  [1291. 1291. 1291. 1291. 1291. 1291. 1291. 1291. 1291. 1291. 1291. 1291. 1291. 1291. 1291. 1291.]</span></span>
<span class="line"><span>   ...</span></span>
<span class="line"><span>  [1796. 1796. 1796. 1796. 1796. 1796. 1796. 1796. 1796. 1796. 1796. 1796. 1796. 1796. 1796. 1796.]</span></span>
<span class="line"><span>   ...</span></span>
<span class="line"><span>  [2048. 2048. 2048. 2048. 2048. 2048. 2048. 2048. 2048. 2048. 2048. 2048. 2048. 2048. 2048. 2048.]</span></span>
<span class="line"><span>   ...</span></span>
<span class="line"><span>  [2300. 2300. 2300. 2300. 2300. 2300. 2300. 2300. 2300. 2300. 2300. 2300. 2300. 2300. 2300. 2300.]</span></span>
<span class="line"><span>   ...</span></span>
<span class="line"><span>  [2806. 2806. 2806. 2806. 2806. 2806. 2806. 2806. 2806. 2806. 2806. 2806. 2806. 2806. 2806. 2806.]</span></span>
<span class="line"><span>   ...</span></span>
<span class="line"><span>  [3058. 3058. 3058. 3058. 3058. 3058. 3058. 3058. 3058. 3058. 3058. 3058. 3058. 3058. 3058. 3058.]</span></span>
<span class="line"><span>   ...</span></span>
<span class="line"><span>  [3312. 3312. 3312. 3312. 3312. 3312. 3312. 3312. 3312. 3312. 3312. 3312. 3312. 3312. 3312. 3312.]</span></span>
<span class="line"><span>   ...</span></span></code></pre></div><p>示例：Mmad含有矩阵乘偏置，左矩阵和右矩阵的数据类型为int8_t，结果矩阵的数据类型为int32_t。量化模式VDEQF16，Tensor量化，将Mmad计算出的结果由int32_t量化成half并搬出。完整算子样例参考：<a href="https://gitcode.com/cann/asc-devkit/tree/master/examples/01_simd_cpp_api/02_features/03_basic_api/00_data_movement/data_copy_l0c2gm" target="_blank" rel="noreferrer">随路Tensor量化样例</a>。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// CeilAlign定义如下</span></span>
<span class="line"><span>__aicore__ inline uint16_t CeilAlign(uint16_t numerator, uint16_t denominator) </span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    return (numerator + denominator - 1) / denominator * denominator;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 将GM中的量化数据 (quantAlphaGM) 拷贝到C1（quantAlphaTensor）</span></span>
<span class="line"><span>uint16_t burstLen = CeilAlign(n * sizeof(uint64_t), 128) / AscendC::ONE_BLK_SIZE;</span></span>
<span class="line"><span>AscendC::DataCopyParams intriParams{ 1, burstLen, 0, 0 };</span></span>
<span class="line"><span>AscendC::DataCopy(quantAlphaTensor, quantAlphaGM, intriParams);</span></span>
<span class="line"><span>// 设置同步，确保量化数据拷贝到C1后，执行后续DataCopy指令</span></span>
<span class="line"><span>AscendC::SetFlag&lt;AscendC::HardEvent::MTE2_FIX&gt;(EVENT_ID0);</span></span>
<span class="line"><span>AscendC::WaitFlag&lt;AscendC::HardEvent::MTE2_FIX&gt;(EVENT_ID0);</span></span>
<span class="line"><span>// 将C1中的量化数据（quantAlphaTensor）拷贝到C2PIPE2GM（fbTensor）</span></span>
<span class="line"><span>uint16_t fbufBurstLen = CeilAlign(deqDataSize, 128) / 128;</span></span>
<span class="line"><span>AscendC::DataCopyParams dataCopyParams(1, fbufBurstLen, 0, 0);</span></span>
<span class="line"><span>AscendC::DataCopy(fbTensor, quantAlphaTensor, dataCopyParams);</span></span>
<span class="line"><span>// 将量化参数数据写入寄存器，供后续DataCopy指令使用</span></span>
<span class="line"><span>AscendC::SetFixPipeConfig(fbTensor);</span></span>
<span class="line"><span>// 创建DataCopy的参数, </span></span>
<span class="line"><span>AscendC::DataCopyCO12DstParams intriParams;</span></span>
<span class="line"><span>intriParams.nSize = CeilAlign(n, CUBE_BLOCK);</span></span>
<span class="line"><span>intriParams.mSize = m;</span></span>
<span class="line"><span>intriParams.srcStride = CeilAlign(m, CUBE_BLOCK);</span></span>
<span class="line"><span>intriParams.dstStride = m * C0_SIZE / AscendC::ONE_BLK_SIZE; // C0_SIZE = 32</span></span>
<span class="line"><span>intriParams.quantPre = QuantMode_t::VDEQF16;</span></span>
<span class="line"><span>intriParams.reluPre = 1; // 使能ReLU</span></span>
<span class="line"><span>// 根据intriParams中的参数，执行最终的数据搬运</span></span>
<span class="line"><span>AscendC::DataCopy(cGM, cLocal, intriParams);</span></span></code></pre></div><p>结果示例如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>输入数据（Fm，shape为[1, 4, 4, 32]，数据类型为int8_t）：</span></span>
<span class="line"><span>[[[[ 1  1  1  1  1  1  1  1  1  2  2  2  2  2  2  2  2  3  3  3  3  3  3  3  3  4  4  4  4  4  4  4]</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>   [12 12 13 13 13 13 13 13 13 13 14 14 14 14 14 14 14 14 15 15 15 15 15 15 15 15 16 16 16 16 16 16]]</span></span>
<span class="line"><span>  [[16 16 17 17 17 17 17 17 17 17 18 18 18 18 18 18 18 18 19 19 19 19 19 19 19 19 19 20 20 20 20 20]</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>   [28 28 28 28 29 29 29 29 29 29 29 29 30 30 30 30 30 30 30 30 31 31 31 31 31 31 31 31 32 32 32 32]]</span></span>
<span class="line"><span>  [[32 32 32 32 33 33 33 33 33 33 33 33 34 34 34 34 34 34 34 34 35 35 35 35 35 35 35 35 36 36 36 36]</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>   [44 44 44 44 44 45 45 45 45 45 45 45 45 46 46 46 46 46 46 46 46 46 47 47 47 47 47 47 47 47 48 48]]</span></span>
<span class="line"><span>  [[48 48 48 48 48 48 49 49 49 49 49 49 49 49 50 50 50 50 50 50 50 50 51 51 51 51 51 51 51 51 52 52]</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>   [60 60 60 60 60 60 60 61 61 61 61 61 61 61 61 62 62 62 62 62 62 62 62 63 63 63 63 63 63 63 63 64]]]]</span></span>
<span class="line"><span>输入数据（Weight，shape为[1, 2, 2, 128, 32]，数据类型为int8_t）：</span></span>
<span class="line"><span>[[[[[1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1]</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    [1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1]]]]]</span></span>
<span class="line"><span>输入数据（Quant，shape为[128]，数据类型为float）：</span></span>
<span class="line"><span>[0.1 0.01 0.1 0.01 ... 0.1 0.01 0.1 0.01]</span></span>
<span class="line"><span>输出数据（DstL0c，shape为[8, 16, 32]，数据类型为int32_t）：</span></span>
<span class="line"><span>[[[1572,1572,1572,1572,1572,1572,1572,1572,1572,1572,1572,1572,1572,1572,1572,1572],</span></span>
<span class="line"><span>  [2078,2078,2078,2078,2078,2078,2078,2078,2078,2078,2078,2078,2078,2078,2078,2078],</span></span>
<span class="line"><span>  [2582,2582,2582,2582,2582,2582,2582,2582,2582,2582,2582,2582,2582,2582,2582,2582],</span></span>
<span class="line"><span>  [3592,3592,3592,3592,3592,3592,3592,3592,3592,3592,3592,3592,3592,3592,3592,3592],</span></span>
<span class="line"><span>  [4097,4097,4097,4097,4097,4097,4097,4097,4097,4097,4097,4097,4097,4097,4097,4097],</span></span>
<span class="line"><span>  [4602,4602,4602,4602,4602,4602,4602,4602,4602,4602,4602,4602,4602,4602,4602,4602],</span></span>
<span class="line"><span>  [5612,5612,5612,5612,5612,5612,5612,5612,5612,5612,5612,5612,5612,5612,5612,5612],</span></span>
<span class="line"><span>  [6116,6116,6116,6116,6116,6116,6116,6116,6116,6116,6116,6116,6116,6116,6116,6116],</span></span>
<span class="line"><span>  [6622,6622,6622,6622,6622,6622,6622,6622,6622,6622,6622,6622,6622,6622,6622,6622],</span></span>
<span class="line"><span>  [0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0],</span></span>
<span class="line"><span>  [0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0],</span></span>
<span class="line"><span>  [0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0],</span></span>
<span class="line"><span>  [0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0],</span></span>
<span class="line"><span>  [0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0],</span></span>
<span class="line"><span>  [0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0],</span></span>
<span class="line"><span>  [0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0]],</span></span>
<span class="line"><span>  ...</span></span>
<span class="line"><span>输出数据（DstGm，shape为[8, 9, 32]，数据类型为half）：</span></span>
<span class="line"><span>[[157.1   15.71 157.1   15.71 157.1   15.71 157.1   15.71 157.1   15.71 157.1   15.71 157.1   15.71 157.1   15.71]</span></span>
<span class="line"><span>  ...</span></span>
<span class="line"><span> [207.8   20.77 207.8   20.77 207.8   20.77 207.8   20.77 207.8   20.77 207.8   20.77 207.8   20.77 207.8   20.77]</span></span>
<span class="line"><span>  ...</span></span>
<span class="line"><span> [258.2   25.81 258.2   25.81 258.2   25.81 258.2   25.81 258.2   25.81 258.2   25.81 258.2   25.81 258.2   25.81]</span></span>
<span class="line"><span>  ...</span></span>
<span class="line"><span> [359.    35.9  359.    35.9  359.    35.9  359.    35.9  359.    35.9  359.    35.9  359.    35.9  359.    35.9 ]</span></span>
<span class="line"><span>  ...</span></span>
<span class="line"><span> [409.5   40.94 409.5   40.94 409.5   40.94 409.5   40.94 409.5   40.94 409.5   40.94 409.5   40.94 409.5   40.94]</span></span>
<span class="line"><span>  ...</span></span>
<span class="line"><span> [460.    46.   460.    46.   460.    46.   460.    46.   460.    46.   460.    46.   460.    46.   460.    46.  ]</span></span>
<span class="line"><span>  ...</span></span>
<span class="line"><span> [561.    56.1  561.    56.1  561.    56.1  561.    56.1  561.    56.1  561.    56.1  561.    56.1  561.    56.1 ]</span></span>
<span class="line"><span>  ...</span></span>
<span class="line"><span> [611.5   61.12 611.5   61.12 611.5   61.12 611.5   61.12 611.5   61.12 611.5   61.12 611.5   61.12 611.5   61.12]</span></span>
<span class="line"><span>  ...</span></span></code></pre></div></li><li><p>针对Atlas 200I/500 A2 推理产品，随路格式转换数据搬运，通路：CO1-&gt;GM。</p><p>示例：Mmad含有矩阵乘偏置，左矩阵和右矩阵的数据类型为int8_t，结果矩阵的数据类型为int32_t。量化模式DEQF16，scalar量化参数为0.5，将Mmad计算出的结果由int32_t量化成half并搬出。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#ifdef ASCENDC_CPU_DEBUG</span></span>
<span class="line"><span>#include &quot;tikicpulib.h&quot;</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span>#include &quot;kernel_operator.h&quot;</span></span>
<span class="line"><span>#include &quot;../../instrs/common_utils/register_utils.h&quot;</span></span>
<span class="line"><span>template &lt;typename dst_T, typename fmap_T, typename weight_T, typename dstCO1_T&gt; class KernelCubeDataCopy{</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    __aicore__ inline KernelCubeDataCopy(uint16_t CoutIn, uint8_t dilationHIn, uint8_t dilationWIn, QuantMode_t deqModeIn)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        // ceiling of 16</span></span>
<span class="line"><span>        Cout = CoutIn;</span></span>
<span class="line"><span>        dilationH = dilationHIn;</span></span>
<span class="line"><span>        dilationW = dilationWIn;</span></span>
<span class="line"><span>        C0 = 32 / sizeof(fmap_T);</span></span>
<span class="line"><span>        C1 = channelSize / C0;</span></span>
<span class="line"><span>        coutBlocks = (Cout + 16 - 1) / 16;</span></span>
<span class="line"><span>        ho = H - dilationH * (Kh - 1);</span></span>
<span class="line"><span>        wo = W - dilationW * (Kw - 1);</span></span>
<span class="line"><span>        howo = ho * wo;</span></span>
<span class="line"><span>        howoRound = ((howo + 16 - 1) / 16) * 16;</span></span>
<span class="line"><span>        featureMapA1Size = C1 * H * W * C0;      // shape: [C1, H, W, C0]</span></span>
<span class="line"><span>        weightA1Size = C1 * Kh * Kw * Cout * C0; // shape: [C1, Kh, Kw, Cout, C0]</span></span>
<span class="line"><span>        featureMapA2Size = howoRound * (C1 * Kh * Kw * C0);</span></span>
<span class="line"><span>        weightB2Size = (C1 * Kh * Kw * C0) * coutBlocks * 16;</span></span>
<span class="line"><span>        m = howo;</span></span>
<span class="line"><span>        k = C1 * Kh * Kw * C0;</span></span>
<span class="line"><span>        n = Cout;</span></span>
<span class="line"><span>        biasSize = Cout;                  // shape: [Cout]</span></span>
<span class="line"><span>        dstSize = coutBlocks * howo * 16; // shape: [coutBlocks, howo, 16]</span></span>
<span class="line"><span>        dstCO1Size = coutBlocks * howoRound * 16;</span></span>
<span class="line"><span>        fmRepeat = featureMapA2Size / (16 * C0);</span></span>
<span class="line"><span>        weRepeat = weightB2Size / (16 * C0);</span></span>
<span class="line"><span>        deqMode = deqModeIn;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void Init(__gm__ uint8_t* fmGm, __gm__ uint8_t* weGm, __gm__ uint8_t* biasGm, __gm__ uint8_t* deqGm, __gm__ uint8_t* eleWiseGm, __gm__ uint8_t* dstGm)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        fmGlobal.SetGlobalBuffer((__gm__ fmap_T*)fmGm);</span></span>
<span class="line"><span>        weGlobal.SetGlobalBuffer((__gm__ weight_T*)weGm);</span></span>
<span class="line"><span>        biasGlobal.SetGlobalBuffer((__gm__ dstCO1_T*)biasGm);</span></span>
<span class="line"><span>        deqGlobal.SetGlobalBuffer((__gm__ uint64_t*)deqGm);</span></span>
<span class="line"><span>        dstGlobal.SetGlobalBuffer((__gm__ dst_T*)dstGm);</span></span>
<span class="line"><span>        eleWiseGlobal.SetGlobalBuffer((__gm__ half*)eleWiseGm);</span></span>
<span class="line"><span>        pipe.InitBuffer(inQueueFmA1, 1, featureMapA1Size * sizeof(fmap_T));</span></span>
<span class="line"><span>        pipe.InitBuffer(inQueueFmA2, 1, featureMapA2Size * sizeof(fmap_T));</span></span>
<span class="line"><span>        pipe.InitBuffer(inQueueWeB1, 1, weightA1Size * sizeof(weight_T));</span></span>
<span class="line"><span>        pipe.InitBuffer(inQueueWeB2, 1, weightB2Size * sizeof(weight_T));</span></span>
<span class="line"><span>        pipe.InitBuffer(inQueueBiasA1, 1, biasSize * sizeof(dstCO1_T));</span></span>
<span class="line"><span>        pipe.InitBuffer(inQueueDeqA1, 1, dstCO1Size * sizeof(uint64_t));</span></span>
<span class="line"><span>        pipe.InitBuffer(inQueueDeqFB, 1, dstCO1Size * sizeof(uint64_t));</span></span>
<span class="line"><span>        pipe.InitBuffer(outQueueCO1, 1, dstCO1Size * sizeof(dstCO1_T));</span></span>
<span class="line"><span>        pipe.InitBuffer(inQueueC1, 1, dstSize * sizeof(half));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void Process()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        CopyIn();</span></span>
<span class="line"><span>        Split();</span></span>
<span class="line"><span>        Compute();</span></span>
<span class="line"><span>        CopyOut();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>private:</span></span>
<span class="line"><span>    __aicore__ inline void CopyIn()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;fmap_T&gt; featureMapA1 = inQueueFmA1.AllocTensor&lt;fmap_T&gt;();</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;weight_T&gt; weightB1 = inQueueWeB1.AllocTensor&lt;weight_T&gt;();</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;dstCO1_T&gt; biasA1 = inQueueBiasA1.AllocTensor&lt;dstCO1_T&gt;();</span></span>
<span class="line"><span>        AscendC::DataCopy(featureMapA1, fmGlobal, { 1, static_cast&lt;uint16_t&gt;(featureMapA1Size * sizeof(fmap_T) / 32), 0, 0 });</span></span>
<span class="line"><span>        AscendC::DataCopy(weightB1, weGlobal, { 1, static_cast&lt;uint16_t&gt;(weightA1Size * sizeof(weight_T) / 32), 0, 0 });</span></span>
<span class="line"><span>        AscendC::DataCopy(biasA1, biasGlobal, { 1, static_cast&lt;uint16_t&gt;(biasSize * sizeof(dstCO1_T) / 32), 0, 0 });</span></span>
<span class="line"><span>        inQueueFmA1.EnQue(featureMapA1);</span></span>
<span class="line"><span>        inQueueWeB1.EnQue(weightB1);</span></span>
<span class="line"><span>        inQueueBiasA1.EnQue(biasA1);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void Split()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;fmap_T&gt; featureMapA1 = inQueueFmA1.DeQue&lt;fmap_T&gt;();</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;weight_T&gt; weightB1 = inQueueWeB1.DeQue&lt;weight_T&gt;();</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;fmap_T&gt; featureMapA2 = inQueueFmA2.AllocTensor&lt;fmap_T&gt;();</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;weight_T&gt; weightB2 = inQueueWeB2.AllocTensor&lt;weight_T&gt;();</span></span>
<span class="line"><span>        uint8_t padList[] = {0, 0, 0, 0};</span></span>
<span class="line"><span>        // load3dv2</span></span>
<span class="line"><span>        AscendC::LoadData(featureMapA2, featureMapA1, { padList, H, W, channelSize, k, howoRound, 0, 0, 1, 1, Kw, Kh, dilationW, dilationH, false, false, 0 });</span></span>
<span class="line"><span>        // load2d</span></span>
<span class="line"><span>        AscendC::LoadData(weightB2, weightB1, { 0, weRepeat, 1, 0, 0, false, 0 });</span></span>
<span class="line"><span>        inQueueFmA2.EnQue&lt;fmap_T&gt;(featureMapA2);</span></span>
<span class="line"><span>        inQueueWeB2.EnQue&lt;weight_T&gt;(weightB2);</span></span>
<span class="line"><span>        inQueueFmA1.FreeTensor(featureMapA1);</span></span>
<span class="line"><span>        inQueueWeB1.FreeTensor(weightB1);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void Compute()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;fmap_T&gt; featureMapA2 = inQueueFmA2.DeQue&lt;fmap_T&gt;();</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;weight_T&gt; weightB2 = inQueueWeB2.DeQue&lt;weight_T&gt;();</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;dstCO1_T&gt; dstCO1 = outQueueCO1.AllocTensor&lt;dstCO1_T&gt;();</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;dstCO1_T&gt; biasA1 = inQueueBiasA1.DeQue&lt;dstCO1_T&gt;();</span></span>
<span class="line"><span>        // C = A * B + bias</span></span>
<span class="line"><span>        // m: 左矩阵Height, k: 左矩阵Width, n: 右矩阵Width</span></span>
<span class="line"><span>        AscendC::Mmad(dstCO1, featureMapA2, weightB2, biasA1, { m, n, k, true, 0, false, false, false });</span></span>
<span class="line"><span>        outQueueCO1.EnQue&lt;dstCO1_T&gt;(dstCO1);</span></span>
<span class="line"><span>        inQueueFmA2.FreeTensor(featureMapA2);</span></span>
<span class="line"><span>        inQueueWeB2.FreeTensor(weightB2);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void CopyOut()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;dstCO1_T&gt; dstCO1 = outQueueCO1.DeQue&lt;dstCO1_T&gt;();</span></span>
<span class="line"><span>        // 使能DEQF16量化，量化参数设置为0.5</span></span>
<span class="line"><span>        float tmp = (float)0.5;</span></span>
<span class="line"><span>        // 将float的tmp转换成uint64_t的deqScalar</span></span>
<span class="line"><span>        uint64_t deqScalar = static_cast&lt;uint64_t&gt;(*reinterpret_cast&lt;int32_t*&gt;(&amp;tmp));</span></span>
<span class="line"><span>        bool nz2ndEn = false;</span></span>
<span class="line"><span>        // nz2nd不使能时，nSize必须为16的倍数</span></span>
<span class="line"><span>        uint16_t nSize = coutBlocks * 16;</span></span>
<span class="line"><span>        uint16_t mSize = m;</span></span>
<span class="line"><span>        // srcStride必须为16的倍数</span></span>
<span class="line"><span>        uint16_t srcStride = (m + 16 - 1) / 16 * 16;</span></span>
<span class="line"><span>        // nz2nd不使能时，dstStride为burst头到头的距离，且为32B对齐</span></span>
<span class="line"><span>        uint32_t dstStride = m * sizeof(dst_T) * 16 / 32;</span></span>
<span class="line"><span>        if (nz2ndEn) {</span></span>
<span class="line"><span>            // nd矩阵的数量为1，src_nd_stride与dst_nd_stride填1</span></span>
<span class="line"><span>            AscendC::SetFixpipeNz2ndFlag(1, 1, 1);</span></span>
<span class="line"><span>            // nz2nd使能时，nSize可以不为16的倍数，与Mmad的n保持一致</span></span>
<span class="line"><span>            nSize = n;</span></span>
<span class="line"><span>            // nz2nd使能时，dstStride表示同一nd矩阵的相邻连续行的间隔，与n保持一致</span></span>
<span class="line"><span>            dstStride = nSize;</span></span>
<span class="line"><span>        };</span></span>
<span class="line"><span>        // 不使能relu与channelSplit</span></span>
<span class="line"><span>        AscendC::DataCopyCO12DstParams intriParams(nSize, mSize, dstStride, srcStride, deqMode, 0, false, nz2ndEn);</span></span>
<span class="line"><span>       </span></span>
<span class="line"><span>        // mov l0c to gm, deq scalar quant</span></span>
<span class="line"><span>        AscendC::SetFixpipePreQuantFlag(deqScalar);  // 设置量化参数</span></span>
<span class="line"><span>        AscendC::PipeBarrier&lt;PIPE_FIX&gt;();</span></span>
<span class="line"><span>        AscendC::DataCopy(dstGlobal, dstCO1, intriParams);</span></span>
<span class="line"><span>        //</span><span> // mov l0c to gm, deq tensor quant</span></span>
<span class="line"><span>        //</span><span> // 需要额外申请deq tensor的gm空间，将值搬运到workA1</span></span>
<span class="line"><span>        // AscendC::LocalTensor&lt;uint64_t&gt; workA1 = inQueueDeqA1.AllocTensor&lt;uint64_t&gt;();</span></span>
<span class="line"><span>        //</span><span> // deq tensor的size</span></span>
<span class="line"><span>        // uint16_t deqSize = 128;</span></span>
<span class="line"><span>        // AscendC::DataCopy(workA1, deqGlobal, deqSize);</span></span>
<span class="line"><span>        //</span><span> // deq tensor在fix上的地址</span></span>
<span class="line"><span>        // AscendC::LocalTensor&lt;uint64_t&gt; deqFB = inQueueDeqFB.AllocTensor&lt;uint64_t&gt;();</span></span>
<span class="line"><span>        //</span><span> // l1-&gt;fix, burst_len unit is 128Bytes</span></span>
<span class="line"><span>        // uint16_t fbufBurstLen = deqSize / 128;</span></span>
<span class="line"><span>        // AscendC::DataCopyParams dataCopyParams(1, fbufBurstLen, 0, 0);</span></span>
<span class="line"><span>        // AscendC::DataCopy(deqFB, workA1, dataCopyParams);</span></span>
<span class="line"><span>        //</span><span> // 设置量化tensor</span></span>
<span class="line"><span>        // AscendC::SetFixPipeConfig(deqFB);</span></span>
<span class="line"><span>        // AscendC::PipeBarrier&lt;PIPE_FIX&gt;();</span></span>
<span class="line"><span>        //</span><span> // mov l0c to gm, 量化操作后使能ClipRelu操作</span></span>
<span class="line"><span>        // intriParams.clipReluPre = 1; </span></span>
<span class="line"><span>        //</span><span> // 设置clip relu的值到寄存器</span></span>
<span class="line"><span>        // uint64_t clipReluVal = 0x3c00;</span><span> // value 1, half</span></span>
<span class="line"><span>        // SetFixPipeClipRelu(clipReluVal);</span></span>
<span class="line"><span>        //</span><span> //mov l0c to gm, 量化操作后，设置 element-wise 操作，Add</span></span>
<span class="line"><span>        // intriParams.eltWiseOp = 1;</span></span>
<span class="line"><span>        //</span><span> // 需要额外申请 element-wise tensor的gm空间，将值搬到eleWiseTensor</span></span>
<span class="line"><span>        // AscendC::LocalTensor&lt;half&gt; eleWiseTensor = inQueueC1.AllocTensor&lt;half&gt;();</span></span>
<span class="line"><span>        // DataCopy(eleWiseTensor, eleWiseGlobal, { 1, static_cast&lt;uint16_t&gt;(sizeof(half) * dst_size / 32), 0, 0 });</span></span>
<span class="line"><span>        // AscendC::PipeBarrier&lt;PIPE_ALL&gt;();</span></span>
<span class="line"><span>        //</span><span> // 将存放element-wise tensor的地址设置到寄存器里</span></span>
<span class="line"><span>        // SetFixPipeAddr(eleWiseTensor, 1);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // AscendC::DataCopy(dstGlobal, dstCO1, intriParams);</span></span>
<span class="line"><span>        // inQueueDeqA1.FreeTensor(workA1);</span></span>
<span class="line"><span>        // inQueueDeqFB.FreeTensor(deqFB);</span></span>
<span class="line"><span>        // outQueueCO1.FreeTensor(dstCO1);</span></span>
<span class="line"><span>        // inQueueC1.FreeTensor(eleWiseTensor);</span></span>
<span class="line"><span>     }</span></span>
<span class="line"><span>private:</span></span>
<span class="line"><span>    AscendC::TPipe pipe;</span></span>
<span class="line"><span>    // feature map queue</span></span>
<span class="line"><span>    AscendC::TQue&lt;AscendC::TPosition::A1, 1&gt; inQueueFmA1;</span></span>
<span class="line"><span>    AscendC::TQue&lt;AscendC::TPosition::A2, 1&gt; inQueueFmA2;</span></span>
<span class="line"><span>    // weight queue</span></span>
<span class="line"><span>    AscendC::TQue&lt;AscendC::TPosition::B1, 1&gt; inQueueWeB1;</span></span>
<span class="line"><span>    AscendC::TQue&lt;AscendC::TPosition::B2, 1&gt; inQueueWeB2;</span></span>
<span class="line"><span>    // bias queue</span></span>
<span class="line"><span>    AscendC::TQue&lt;AscendC::TPosition::A1, 1&gt; inQueueBiasA1;</span></span>
<span class="line"><span>    // deq tensor queue</span></span>
<span class="line"><span>    AscendC::TQue&lt;AscendC::TPosition::A1, 1&gt; inQueueDeqA1;</span></span>
<span class="line"><span>    // fb dst of deq tensor</span></span>
<span class="line"><span>    AscendC::TQue&lt;AscendC::TPosition::C2PIPE2GM, 1&gt; inQueueDeqFB;</span></span>
<span class="line"><span>    // dst queue</span></span>
<span class="line"><span>    AscendC::TQue&lt;AscendC::TPosition::CO1, 1&gt; outQueueCO1;</span></span>
<span class="line"><span>    // element-wise tensor</span></span>
<span class="line"><span>    AscendC::TQue&lt;AscendC::TPosition::C1, 1&gt; inQueueC1;</span></span>
<span class="line"><span>    AscendC::GlobalTensor&lt;fmap_T&gt; fmGlobal;</span></span>
<span class="line"><span>    AscendC::GlobalTensor&lt;weight_T&gt; weGlobal;</span></span>
<span class="line"><span>    AscendC::GlobalTensor&lt;dst_T&gt; dstGlobal;</span></span>
<span class="line"><span>    AscendC::GlobalTensor&lt;uint64_t&gt; deqGlobal;</span></span>
<span class="line"><span>    AscendC::GlobalTensor&lt;dstCO1_T&gt; biasGlobal;</span></span>
<span class="line"><span>    AscendC::GlobalTensor&lt;half&gt; eleWiseGlobal;</span></span>
<span class="line"><span>    uint16_t channelSize = 32;</span></span>
<span class="line"><span>    uint16_t H = 4, W = 4;</span></span>
<span class="line"><span>    uint8_t Kh = 2, Kw = 2;</span></span>
<span class="line"><span>    uint16_t Cout;</span></span>
<span class="line"><span>    uint16_t C0, C1;</span></span>
<span class="line"><span>    uint8_t dilationH, dilationW;</span></span>
<span class="line"><span>    uint16_t coutBlocks, ho, wo, howo, howoRound;</span></span>
<span class="line"><span>    uint32_t featureMapA1Size, weightA1Size, featureMapA2Size, weightB2Size, biasSize, dstSize, dstCO1Size;</span></span>
<span class="line"><span>    uint16_t m, k, n;</span></span>
<span class="line"><span>    uint8_t fmRepeat, weRepeat;</span></span>
<span class="line"><span>    QuantMode_t deqMode = QuantMode_t::NoQuant;</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span>#define KERNEL_CUBE_DATACOPY(dst_type, fmap_type, weight_type, dstCO1_type, CoutIn, dilationHIn, dilationWIn, deqModeIn)  \\</span></span>
<span class="line"><span>    extern &quot;C&quot; __global__ __aicore__ void cube_datacopy_kernel_##fmap_type(__gm__ uint8_t* fmGm, __gm__ uint8_t* weGm,    \\</span></span>
<span class="line"><span>        __gm__ uint8_t* biasGm, __gm__ uint8_t* deqGm, __gm__ uint8_t* eleWiseGm, __gm__ uint8_t* dstGm)                                             \\</span></span>
<span class="line"><span>    {                                                                                                                     \\</span></span>
<span class="line"><span>        if (g_coreType == AscendC::AIV) {                                                                                 \\</span></span>
<span class="line"><span>            return;                                                                                                       \\</span></span>
<span class="line"><span>        }                                                                                                                 \\</span></span>
<span class="line"><span>        KernelCubeDataCopy&lt;dst_type, fmap_type, weight_type, dstCO1_type&gt; op(CoutIn, dilationHIn, dilationWIn,            \\</span></span>
<span class="line"><span>            deqModeIn);                                                                                                   \\</span></span>
<span class="line"><span>        op.Init(fmGm, weGm, biasGm, deqGm, eleWiseGm, dstGm);                                                                        \\</span></span>
<span class="line"><span>        op.Process();                                                                                                     \\</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>KERNEL_CUBE_DATACOPY(half, int8_t, int8_t, int32_t, 128, 1, 1, QuantMode_t::DEQF16);</span></span></code></pre></div></li></ul>`,28)])])}const m=s(l,[["render",i]]);export{C as __pageData,m as default};
