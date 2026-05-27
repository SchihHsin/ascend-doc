import{c as a,Q as n,j as p,m as l}from"./chunks/framework.DOi4mjdC.js";const e="/assets/zh-cn_formulaimage_0000002357906828.BuCYy_73.png",m=JSON.parse('{"title":"MulAddRelu","description":"","frontmatter":{},"headers":[{"level":1,"title":"MulAddRelu","slug":"muladdrelu"},{"level":2,"title":"产品支持情况","slug":"产品支持情况"},{"level":2,"title":"功能说明","slug":"功能说明"},{"level":2,"title":"函数原型","slug":"函数原型"},{"level":2,"title":"参数说明","slug":"参数说明"},{"level":2,"title":"返回值说明","slug":"返回值说明"},{"level":2,"title":"约束说明","slug":"约束说明"},{"level":2,"title":"调用示例","slug":"调用示例"}],"relativePath":"api/SIMD-API/基础API/Memory矢量计算/复合计算/MulAddRelu.md","filePath":"api/SIMD-API/基础API/Memory矢量计算/复合计算/MulAddRelu.md"}'),t={name:"api/SIMD-API/基础API/Memory矢量计算/复合计算/MulAddRelu.md"};function i(c,s,d,r,o,u){return n(),p("div",null,[...s[0]||(s[0]=[l('<h1 id="muladdrelu" tabindex="-1">MulAddRelu <a class="header-anchor" href="#muladdrelu" aria-label="Permalink to &quot;MulAddRelu&quot;">​</a></h1><h2 id="产品支持情况" tabindex="-1">产品支持情况 <a class="header-anchor" href="#产品支持情况" aria-label="Permalink to &quot;产品支持情况&quot;">​</a></h2><table tabindex="0"><thead><tr><th>产品</th><th>是否支持</th></tr></thead><tbody><tr><td>Ascend 950PR/Ascend 950DT</td><td>√</td></tr><tr><td>Atlas A3 训练系列产品/Atlas A3 推理系列产品</td><td>√</td></tr><tr><td>Atlas A2 训练系列产品/Atlas A2 推理系列产品</td><td>√</td></tr><tr><td>Atlas 200I/500 A2 推理产品</td><td>√</td></tr><tr><td>Atlas 推理系列产品AI Core</td><td>√</td></tr><tr><td>Atlas 推理系列产品Vector Core</td><td>x</td></tr><tr><td>Atlas 训练系列产品</td><td>x</td></tr></tbody></table><h2 id="功能说明" tabindex="-1">功能说明 <a class="header-anchor" href="#功能说明" aria-label="Permalink to &quot;功能说明&quot;">​</a></h2><p>按元素将src0和dst相乘并加上src1，再进行Relu计算（结果和0对比取较大值），最终结果存放进dst中。计算公式如下：</p><p><img src="'+e+`" alt=""></p><h2 id="函数原型" tabindex="-1">函数原型 <a class="header-anchor" href="#函数原型" aria-label="Permalink to &quot;函数原型&quot;">​</a></h2><ul><li><p>tensor前n个数据计算</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>template &lt;typename T&gt;</span></span>
<span class="line"><span>__aicore__ inline void MulAddRelu(const LocalTensor&lt;T&gt;&amp; dst, const LocalTensor&lt;T&gt;&amp; src0, const LocalTensor&lt;T&gt;&amp; src1, const int32_t&amp; count)</span></span></code></pre></div></li><li><p>tensor高维切分计算</p><ul><li><p>mask逐bit模式</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>template &lt;typename T, bool isSetMask = true&gt;</span></span>
<span class="line"><span>__aicore__ inline void MulAddRelu(const LocalTensor&lt;T&gt;&amp; dst, const LocalTensor&lt;T&gt;&amp; src0, const LocalTensor&lt;T&gt;&amp; src1, uint64_t mask[], const uint8_t repeatTime, const BinaryRepeatParams&amp; repeatParams)</span></span></code></pre></div></li><li><p>mask连续模式</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>template &lt;typename T, bool isSetMask = true&gt;</span></span>
<span class="line"><span>__aicore__ inline void MulAddRelu(const LocalTensor&lt;T&gt;&amp; dst, const LocalTensor&lt;T&gt;&amp; src0, const LocalTensor&lt;T&gt;&amp; src1, uint64_t mask, const uint8_t repeatTime, const BinaryRepeatParams&amp; repeatParams)</span></span></code></pre></div></li></ul></li></ul><h2 id="参数说明" tabindex="-1">参数说明 <a class="header-anchor" href="#参数说明" aria-label="Permalink to &quot;参数说明&quot;">​</a></h2><p><strong>表 1</strong> 模板参数说明</p><table tabindex="0"><thead><tr><th>参数名</th><th>描述</th></tr></thead><tbody><tr><td>T</td><td>操作数数据类型。 Ascend 950PR/Ascend 950DT，支持的数据类型为：half/float/int64_t/uint64_t Atlas A3 训练系列产品/Atlas A3 推理系列产品，支持的数据类型为：half/float Atlas A2 训练系列产品/Atlas A2 推理系列产品，支持的数据类型为：half/float Atlas 200I/500 A2 推理产品，支持的数据类型为：half/float Atlas 推理系列产品AI Core，支持的数据类型为：half/float</td></tr><tr><td>isSetMask</td><td>是否在接口内部设置mask。 true，表示在接口内部设置mask。false，表示在接口外部设置mask，开发者需要使用SetVectorMask接口设置mask值。这种模式下，接口入参中的mask值设置为占位符MASK_PLACEHOLDER，用于占位，无实际含义。</td></tr></tbody></table><p><strong>表 2</strong> 参数说明</p><table tabindex="0"><thead><tr><th>参数名</th><th>输入/输出</th><th>描述</th></tr></thead><tbody><tr><td>dst</td><td>输出</td><td>目的操作数。 类型为LocalTensor，支持的TPosition为VECIN/VECCALC/VECOUT。 LocalTensor的起始地址需要32字节对齐。</td></tr><tr><td>src0、src1</td><td>输入</td><td>源操作数。 类型为LocalTensor，支持的TPosition为VECIN/VECCALC/VECOUT。 LocalTensor的起始地址需要32字节对齐。 两个源操作数的数据类型需要与目的操作数保持一致。</td></tr><tr><td>count</td><td>输入</td><td>参与计算的元素个数。</td></tr><tr><td>mask[]/mask</td><td>输入</td><td>mask用于控制每次迭代内参与计算的元素。 逐bit模式：可以按位控制哪些元素参与计算，bit位的值为1表示参与计算，0表示不参与。 mask为数组形式，数组长度和数组元素的取值范围和操作数的数据类型有关。当操作数为16位时，数组长度为2，mask[0]、mask[1]∈[0, 264-1]并且不同时为0；当操作数为32位时，数组长度为1，mask[0]∈(0, 264-1]；当操作数为64位时，数组长度为1，mask[0]∈(0, 232-1]。 例如，mask=[8, 0]，8=0b1000，表示仅第4个元素参与计算。 连续模式：表示前面连续的多少个元素参与计算。取值范围和操作数的数据类型有关，数据类型不同，每次迭代内能够处理的元素个数最大值不同。当操作数为16位时，mask∈[1, 128]；当操作数为32位时，mask∈[1, 64]；当操作数为64位时，mask∈[1, 32]。</td></tr><tr><td>repeatTime</td><td>输入</td><td>重复迭代次数。矢量计算单元，每次读取连续的256Bytes数据进行计算，为完成对输入数据的处理，必须通过多次迭代（repeat）才能完成所有数据的读取与计算。repeatTime表示迭代的次数。 关于该参数的具体描述请参考高维切分API。</td></tr><tr><td>repeatParams</td><td>输入</td><td>控制操作数地址步长的参数。BinaryRepeatParams类型，包含操作数相邻迭代间相同datablock的地址步长，操作数同一迭代内不同datablock的地址步长等参数。 相邻迭代间的地址步长参数说明请参考repeatStride；同一迭代内DataBlock的地址步长参数说明请参考dataBlockStride。</td></tr></tbody></table><h2 id="返回值说明" tabindex="-1">返回值说明 <a class="header-anchor" href="#返回值说明" aria-label="Permalink to &quot;返回值说明&quot;">​</a></h2><p>无</p><h2 id="约束说明" tabindex="-1">约束说明 <a class="header-anchor" href="#约束说明" aria-label="Permalink to &quot;约束说明&quot;">​</a></h2><ul><li><p>操作数地址对齐要求请参见<a href="./../../../通用说明和约束.html#section796754519912">通用地址对齐约束</a>。</p></li><li><p>操作数地址重叠约束请参考<a href="./../../../通用说明和约束.html#section668772811100">通用地址重叠约束</a>。</p></li><li><p>针对Ascend 950PR/Ascend 950DT，uint64_t/int64_t数据类型仅支持tensor前n个数据计算接口。</p></li></ul><h2 id="调用示例" tabindex="-1">调用示例 <a class="header-anchor" href="#调用示例" aria-label="Permalink to &quot;调用示例&quot;">​</a></h2><ul><li><p>高维切分计算接口样例-mask连续模式</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>uint64_t mask = 128;</span></span>
<span class="line"><span>// repeatTime = 2，一次迭代计算128个数，共计算256个数</span></span>
<span class="line"><span>// dstBlkStride, src0BlkStride, src1BlkStride = 1，单次迭代内数据连续读取和写入</span></span>
<span class="line"><span>// dstRepStride, src0RepStride, src1RepStride = 8，相邻迭代间数据连续读取和写入</span></span>
<span class="line"><span>AscendC::MulAddRelu(dstLocal, src0Local, src1Local, mask, 2, { 1, 1, 1, 8, 8, 8 });</span></span></code></pre></div></li><li><p>高维切分计算接口样例-mask逐bit模式</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>uint64_t mask[2] = { UINT64_MAX, UINT64_MAX };</span></span>
<span class="line"><span>// repeatTime = 2，一次迭代计算128个数，共计算256个数</span></span>
<span class="line"><span>// dstBlkStride, src0BlkStride, src1BlkStride = 1，单次迭代内数据连续读取和写入</span></span>
<span class="line"><span>// dstRepStride, src0RepStride, src1RepStride = 8，相邻迭代间数据连续读取和写入</span></span>
<span class="line"><span>AscendC::MulAddRelu(dstLocal, src0Local, src1Local, mask, 2, { 1, 1, 1, 8, 8, 8 });</span></span></code></pre></div></li><li><p>tensor前n个数据计算样例</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>AscendC::MulAddRelu(dstLocal, src0Local, src1Local, 256);</span></span></code></pre></div></li></ul><p>结果示例如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>输入数据src0Local：</span></span>
<span class="line"><span>[ 77.25   59.84  -39.5    19.3   -45.88   11.81  -60.75  -99.6   -12.164</span></span>
<span class="line"><span>  25.75  100.    -68.    -48.12   -4.504 -78.5   -53.4    71.56  -33.5</span></span>
<span class="line"><span> -78.75   81.6    61.25   -6.414 -31.77  -50.38   84.9   -75.56   89.06</span></span>
<span class="line"><span> -50.7    93.     99.75    8.1    58.34  -47.3    40.78  -98.94   41.34</span></span>
<span class="line"><span>  98.5   -21.11   30.7    39.3   -82.06  -34.88  -51.44  -91.7   -33.12</span></span>
<span class="line"><span>  71.2   -66.3   -60.2    52.84  -75.9   -18.31  -85.3    92.5    62.22</span></span>
<span class="line"><span>  92.2    87.44  -77.56   26.64   31.47  -60.97   85.8   -48.47   74.2</span></span>
<span class="line"><span>  42.62  -49.8    77.56  -15.     47.5   -26.66  -97.1    -3.28   99.25</span></span>
<span class="line"><span> -95.4    72.    -16.97  -50.12  -68.5    75.1    63.2   -34.72   79.56</span></span>
<span class="line"><span>  97.1   -60.47  -99.3   -59.5   -54.2   -23.62  -10.74   74.8   -18.3</span></span>
<span class="line"><span>   3.81  -72.2    15.21   31.55    9.5    22.08  -88.     77.5     7.3</span></span>
<span class="line"><span>  68.44  -40.7   -27.53   39.03   -6.84   43.28    4.81   26.75   -8.59</span></span>
<span class="line"><span>  95.44  -40.22   98.94   74.4   -84.8    -8.72   42.44   63.1    14.14</span></span>
<span class="line"><span> -93.25   22.77  -39.1   -18.75  -26.22  -56.62   -8.43   25.14   43.66</span></span>
<span class="line"><span>  40.     63.44   87.94  -94.75   36.44   24.17  -91.2    33.66  -67.1</span></span>
<span class="line"><span>  52.6    81.     32.88   69.25   23.27   30.23   82.56   49.3   -59.78</span></span>
<span class="line"><span>  81.2    28.94   45.03  -49.22  -99.2    -6.19    1.262 -94.3    83.6</span></span>
<span class="line"><span> -17.7   -61.     47.4   -50.62    1.013  32.97   87.7    -5.93  -13.36</span></span>
<span class="line"><span>  20.45  -18.45   -9.2    33.03  -50.7   -89.1   -93.4    10.3   -60.72</span></span>
<span class="line"><span>  44.84   12.664  39.1   -81.9   -37.1     5.215 -91.9    85.44   76.9</span></span>
<span class="line"><span> -70.5   -39.22   59.8   -11.78    4.875 -98.     83.94  -31.03  -58.84</span></span>
<span class="line"><span> -38.56   39.44   97.    -53.     97.75  -69.25   54.4    27.03  -42.66</span></span>
<span class="line"><span>  24.94  -56.97   -7.105  71.3    15.28  -39.84   79.7    51.28   76.25</span></span>
<span class="line"><span>   7.203  77.56  -15.26  -74.06   59.38   64.5   -63.3   -34.38  -24.98</span></span>
<span class="line"><span> -54.03  -23.53   -9.875  46.12   34.94  -67.9    96.25   65.3   -88.06</span></span>
<span class="line"><span>  66.5    65.6   -76.75   77.2    29.73   63.28   41.25  -20.84   34.6</span></span>
<span class="line"><span>  37.78  -72.44   58.25    9.4   -50.56   29.28   28.2     4.438 -10.35</span></span>
<span class="line"><span>  79.06   62.75  -11.51  -15.16   -4.055 -10.016   4.887  94.1   -50.25</span></span>
<span class="line"><span>  15.055  18.45    8.78   28.25 ]</span></span>
<span class="line"><span>输入数据src1Local:</span></span>
<span class="line"><span>[-20.95    -1.547  -46.25    27.14    43.16    21.44    65.6     78.25</span></span>
<span class="line"><span> -72.9     25.39     2.133   76.3     17.56   -96.9    -41.16   -10.734</span></span>
<span class="line"><span>  -2.305   74.5    -42.2    -63.44   -67.5    -11.62   -78.44    52.66</span></span>
<span class="line"><span>  18.8     45.16   -35.94    82.44   -53.9     10.54   -86.9    -55.9</span></span>
<span class="line"><span>   7.22    85.3     14.32   -57.53    52.9    -92.4     45.      31.64</span></span>
<span class="line"><span>  40.56    42.06    70.25    -1.671  -24.27    74.9     34.56    96.44</span></span>
<span class="line"><span>  19.27    -9.76    96.1    -85.8     26.34    83.1    -66.8     63.03</span></span>
<span class="line"><span>  29.69    39.22   -55.      53.2    -68.75     0.5854  57.9     -8.53</span></span>
<span class="line"><span> -39.62    36.06    66.     -34.56    50.4     59.16   -66.1     54.06</span></span>
<span class="line"><span>  60.1    -30.06    88.3    -72.06   -22.34   -52.34    39.4    -59.28</span></span>
<span class="line"><span>  10.266  -54.7     59.44    14.49   -86.94    98.7     10.25   -75.75</span></span>
<span class="line"><span> -70.06     6.758  -43.66    17.42   -81.3     23.22    33.5     50.72</span></span>
<span class="line"><span>  -5.547   44.78    71.2     28.7     92.06   -68.3    -89.     -69.2</span></span>
<span class="line"><span>  28.95   -63.72    49.53    15.29    23.06    89.44    87.4    -87.3</span></span>
<span class="line"><span>  91.44    80.3     22.9     -1.456  -69.94   -99.3     40.47    11.984</span></span>
<span class="line"><span> -28.7    -32.22   -84.     -17.67    70.3    -79.     -83.6     42.56</span></span>
<span class="line"><span> -67.     -46.53   -84.4     -0.7954 -15.34   -71.7    -81.25    24.62</span></span>
<span class="line"><span> -63.7     81.8     85.44    73.2    -99.1     15.29   -85.6     78.5</span></span>
<span class="line"><span> -54.12    47.03    46.38   -31.78    58.84   -21.9     83.6     60.88</span></span>
<span class="line"><span> -53.4    -52.3    -47.3     20.2     -8.055  -67.3    -52.16   -20.8</span></span>
<span class="line"><span>  11.1     36.8    -22.06   -57.53   -42.34   -59.66    -0.651  -34.25</span></span>
<span class="line"><span> -19.33   -80.5    -33.62    28.31   -89.7    -41.5     -8.9    -58.44</span></span>
<span class="line"><span> -54.16   -87.4    -63.66     6.664   -7.562   95.06    85.3     82.25</span></span>
<span class="line"><span>  27.75   -25.39    88.06   -94.56    86.8     68.     -26.05     8.14</span></span>
<span class="line"><span> -42.94   -35.      29.12   -64.9     38.7     29.42    15.31   -28.3</span></span>
<span class="line"><span> -56.47    79.44   -96.8    -64.8     81.5    -69.3    -23.36   -95.75</span></span>
<span class="line"><span> -56.62    77.75   -23.1     67.94   -29.03   -14.69     0.5996 -17.05</span></span>
<span class="line"><span> -73.75    95.6     79.25   -61.7      5.363   88.1    -15.086   58.66</span></span>
<span class="line"><span> -20.7     90.9     42.7    -51.22     0.3909  77.1    -69.3     70.75</span></span>
<span class="line"><span>  89.7     95.1     56.1    -72.4    -99.9    -11.64     1.984  -86.6</span></span>
<span class="line"><span> -22.22   -24.44    12.5    -46.66    77.7     46.28   -48.3    -19.03</span></span>
<span class="line"><span> -16.61    64.44    -4.758  -20.9     80.2     67.      12.9    -71.75  ]</span></span>
<span class="line"><span>输入数据dstLocal：</span></span>
<span class="line"><span>[-69.5     -8.8    -38.3     19.9    -70.      71.75   -23.17   -13.48</span></span>
<span class="line"><span>  70.     -31.16    29.6     -2.914   47.6     83.5    -33.75    44.25</span></span>
<span class="line"><span> -87.9      3.54    46.1     53.8     -4.164  -83.56   -35.6     58.47</span></span>
<span class="line"><span> -43.56   -38.03    63.72     4.9    -25.56    73.7     34.7     96.3</span></span>
<span class="line"><span> -58.34   -56.78   -39.44    82.5     34.4    -30.34    -4.72   -97.75</span></span>
<span class="line"><span>   2.406  -83.1     17.06    41.34   -45.84   -35.6     19.58    27.45</span></span>
<span class="line"><span>   4.258  -95.25    -7.418  -10.34    99.06   -84.3     -2.508  -14.805</span></span>
<span class="line"><span>  44.72    27.14    64.44   -16.69   -48.28    73.94    72.2     71.75</span></span>
<span class="line"><span> -72.7    -43.72   -65.3    -17.75    16.02    35.     -57.6     87.75</span></span>
<span class="line"><span>  91.6    -44.53   -82.     -54.44   -23.61   -71.5     86.75   -83.5</span></span>
<span class="line"><span>  39.16   -60.2     51.22   -63.2     61.8     53.9    -13.016   78.4</span></span>
<span class="line"><span> -55.1    -59.94   -88.25   -12.35    83.4     94.44   -38.28   -59.38</span></span>
<span class="line"><span> -98.06    54.94   -11.664  -22.66   -94.3     65.06    89.56   -74.44</span></span>
<span class="line"><span>  17.98    29.78   -98.06    95.6     -4.26   -65.5      2.662  -76.9</span></span>
<span class="line"><span>  26.03   -22.84    40.6    -78.6     58.56   -25.34   -73.9     -2.59</span></span>
<span class="line"><span> -86.9     52.75    69.7     48.66    -8.95   -57.84   -87.3    -43.84</span></span>
<span class="line"><span> -26.36    72.3      0.1203  57.88    96.56    43.6     94.44    76.1</span></span>
<span class="line"><span> -58.47    82.1    -46.03    82.2    -67.94   -80.75    91.4    -46.4</span></span>
<span class="line"><span>  77.56   -39.25    92.25   -83.8    -17.25   -42.72    -3.533   18.4</span></span>
<span class="line"><span> -17.6     80.94    64.      72.6     53.66   -19.17   -34.88    73.94</span></span>
<span class="line"><span> -80.1    -65.8     -8.6     62.     -64.9    -31.45   -25.12   -98.1</span></span>
<span class="line"><span>  75.75    -6.44    66.75     4.11   -62.22   -74.56    17.61    85.4</span></span>
<span class="line"><span>  -0.5825 -39.28    -0.2615 -88.5     67.1    -78.25    -7.7    -82.75</span></span>
<span class="line"><span>  98.1     62.12    73.9    -98.8    -78.6    -88.44    49.97    98.6</span></span>
<span class="line"><span> -14.484  -18.44   -15.57    87.8    -46.56   -71.75    61.7     16.42</span></span>
<span class="line"><span> -71.56    91.4    -35.03   -61.78   -10.39   -44.1     96.44    92.7</span></span>
<span class="line"><span>   5.785  -59.75   -57.22   -63.1    -71.6     87.06     3.691  -69.44</span></span>
<span class="line"><span> -15.84   -73.56     4.08   -27.5     41.7     88.6     21.4    -73.3</span></span>
<span class="line"><span>  91.9     29.28   100.     -19.3    -52.88    28.23   -42.72    68.25</span></span>
<span class="line"><span>  60.9    -48.4    -31.86    74.25   -40.8    -21.61    78.3    -90.56</span></span>
<span class="line"><span> -56.47    -9.51    80.8    -32.28    11.18    34.34    65.9     98.8</span></span>
<span class="line"><span>  24.83    82.9    -92.6    -67.06    51.9     -8.68   -55.03   -75.    ]</span></span>
<span class="line"><span>输出数据dstLocal：</span></span>
<span class="line"><span>[   0.      0.   1467.    411.5  3256.    869.   1474.   1421.      0.</span></span>
<span class="line"><span>    0.   2962.    274.5     0.      0.   2608.      0.      0.      0.</span></span>
<span class="line"><span>    0.   4328.      0.    524.5  1053.      0.      0.   2920.   5640.</span></span>
<span class="line"><span>    0.      0.   7364.    194.1  5564.   2768.      0.   3916.   3352.</span></span>
<span class="line"><span> 3442.    548.      0.      0.      0.   2940.      0.      0.   1495.</span></span>
<span class="line"><span>    0.      0.      0.    244.2  7220.    232.    796.5  9184.      0.</span></span>
<span class="line"><span>    0.      0.      0.    762.   1973.   1071.      0.      0.   5412.</span></span>
<span class="line"><span> 3050.   3580.      0.   1046.      0.      0.      0.    122.75 8768.</span></span>
<span class="line"><span>    0.      0.   1479.   2656.   1595.      0.   5520.   2840.   3126.</span></span>
<span class="line"><span>    0.      0.   6292.      0.      0.    317.8     0.      0.   1104.</span></span>
<span class="line"><span>    0.    909.   1187.   3004.      0.      0.   8624.   4300.      0.</span></span>
<span class="line"><span>    0.   3930.      0.   3408.    440.    807.5    79.5     0.      0.</span></span>
<span class="line"><span>    0.   2724.    351.      0.      0.    279.5  1746.      0.    758.</span></span>
<span class="line"><span> 2264.      0.    113.25 1600.      0.      0.      0.      0.      0.</span></span>
<span class="line"><span>    0.      0.      0.      0.      0.   1398.      0.   1395.      0.</span></span>
<span class="line"><span> 4028.      0.   2782.      0.   1985.      0.      0.   4420.   2852.</span></span>
<span class="line"><span> 6240.      0.   4204.   4092.   1770.    242.6    79.2     0.      0.</span></span>
<span class="line"><span>    0.      0.   3462.      0.      0.      0.   6464.    486.    916.</span></span>
<span class="line"><span>    0.      0.    554.5     0.   1273.   8712.      0.      0.      0.</span></span>
<span class="line"><span>  212.5     0.      0.      0.      0.      0.   3520.      0.      0.</span></span>
<span class="line"><span>    0.   3164.      0.   1057.    506.      0.   6288.   2972.   4716.</span></span>
<span class="line"><span> 3478.   1945.   9576.    724.5     0.   1107.   4712.      0.   3090.</span></span>
<span class="line"><span> 1553.      0.    452.   6596.      0.   2398.      0.      0.   7328.</span></span>
<span class="line"><span>  572.    392.    989.   4212.      0.      0.      0.      0.   1718.</span></span>
<span class="line"><span>  782.   1827.     38.97    0.   1461.      0.   2045.      0.      0.</span></span>
<span class="line"><span> 2038.   6608.   1430.      0.    916.5     0.   2886.      0.      0.</span></span>
<span class="line"><span>    0.      0.      0.      0.      0.      0.      0.      0.      0.</span></span>
<span class="line"><span>    0.    779.      0.      0.      0.      0.    469.5     0.   3350.</span></span>
<span class="line"><span>  861.5     0.      0.      0.  ]</span></span></code></pre></div>`,21)])])}const b=a(t,[["render",i]]);export{m as __pageData,b as default};
