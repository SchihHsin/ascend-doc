import{c as s,Q as n,j as p,m as e}from"./chunks/framework.DOi4mjdC.js";const l="/assets/%E6%B5%81%E6%B0%B4%E4%BB%BB%E5%8A%A1%E8%BF%90%E8%A1%8C%E7%A4%BA%E6%84%8F%E5%9B%BE-33.uaUmLO_8.png",g=JSON.parse('{"title":"Kernel侧算子实现","description":"","frontmatter":{},"headers":[{"level":1,"title":"Kernel侧算子实现","slug":"kernel侧算子实现"},{"level":2,"title":"自动生成kernel侧算子实现模板","slug":"自动生成kernel侧算子实现模板"},{"level":2,"title":"GET\\\\_TILING\\\\_DATA获取Tiling参数","slug":"get_tiling_data获取tiling参数"},{"level":2,"title":"核函数内获取算子输入输出的数据类型和格式","slug":"核函数内获取算子输入输出的数据类型和格式"},{"level":2,"title":"输出shape依赖计算的算子kernel实现","slug":"输出shape依赖计算的算子kernel实现"}],"relativePath":"guide/编程指南/高级编程/高级特性/Aclnn算子工程化开发/Kernel侧算子实现.md","filePath":"guide/编程指南/高级编程/高级特性/Aclnn算子工程化开发/Kernel侧算子实现.md"}'),t={name:"guide/编程指南/高级编程/高级特性/Aclnn算子工程化开发/Kernel侧算子实现.md"};function i(o,a,_,c,u,r){return n(),p("div",null,[...a[0]||(a[0]=[e(`<h1 id="kernel侧算子实现" tabindex="-1">Kernel侧算子实现 <a class="header-anchor" href="#kernel侧算子实现" aria-label="Permalink to &quot;Kernel侧算子实现&quot;">​</a></h1><p>在<a href="./../../../编程模型/AI-Core-SIMD编程/核函数.html">核函数</a>章节已经介绍了kernel侧算子核心的实现方法，本章节侧重于介绍接入CANN框架时编程模式和API的使用。</p><h2 id="自动生成kernel侧算子实现模板" tabindex="-1">自动生成kernel侧算子实现模板 <a class="header-anchor" href="#自动生成kernel侧算子实现模板" aria-label="Permalink to &quot;自动生成kernel侧算子实现模板&quot;">​</a></h2><p>在算子工程目录下的“op_kernel/xxx.cpp”文件中实现算子的核函数。核函数的定义模板已通过msOpGen工具自动生成，样例如下所示。<strong>注意这里参数的顺序按照“输入、输出、workspace、tiling”的顺序排布，开发者不要调整其顺序。</strong></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &quot;kernel_operator.h&quot;</span></span>
<span class="line"><span>extern &quot;C&quot; __global__ __aicore__ void add_custom(GM_ADDR x, GM_ADDR y, GM_ADDR z, GM_ADDR workspace, GM_ADDR tiling) {</span></span>
<span class="line"><span>    GET_TILING_DATA(tiling_data, tiling);// 获取Tiling参数，详见下文介绍</span></span>
<span class="line"><span>    // TODO: user kernel impl</span></span>
<span class="line"><span>}</span></span></code></pre></div><div class="note custom-block github-alert"><p class="custom-block-title">说明</p><p>算子原型定义中的输入和输出同名的情况下，自动生成的核函数中，输出参数增加ref后缀予以区分。示例如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>extern &quot;C&quot; __global__ __aicore__ void add_custom(GM_ADDR x, GM_ADDR y, GM_ADDR x_ref, GM_ADDR workspace, GM_ADDR tiling) {</span></span>
<span class="line"><span>   ...</span></span>
<span class="line"><span>}</span></span></code></pre></div></div><h2 id="get-tiling-data获取tiling参数" tabindex="-1">GET_TILING_DATA获取Tiling参数 <a class="header-anchor" href="#get-tiling-data获取tiling参数" aria-label="Permalink to &quot;GET\\_TILING\\_DATA获取Tiling参数&quot;">​</a></h2><p>提供GET_TILING_DATA，用于获取算子kernel入口函数传入的tiling信息，并填入注册的Tiling结构体中，此函数会以宏展开的方式进行编译。注意，对应的算子host实现中需要定义TilingData结构体，实现并注册计算TilingData的Tiling函数。具体请参考<a href="./Host侧Tiling实现/基本流程.html">Host侧Tiling实现</a>。</p><p>核函数中调用<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/GET_TILING_DATA.md" target="_blank" rel="noreferrer">GET_TILING_DATA</a>获取TilingData的样例如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>extern &quot;C&quot; __global__ __aicore__ void add_custom(GM_ADDR x, GM_ADDR y, GM_ADDR z, GM_ADDR workspace, GM_ADDR tiling)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    GET_TILING_DATA(tilingData, tiling);</span></span>
<span class="line"><span>    KernelAdd op;</span></span>
<span class="line"><span>    op.Init(x, y, z, tilingData.totalLength, tilingData.tileNum);</span></span>
<span class="line"><span>    if (TILING_KEY_IS(1)) {</span></span>
<span class="line"><span>        op.Process();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="核函数内获取算子输入输出的数据类型和格式" tabindex="-1">核函数内获取算子输入输出的数据类型和格式 <a class="header-anchor" href="#核函数内获取算子输入输出的数据类型和格式" aria-label="Permalink to &quot;核函数内获取算子输入输出的数据类型和格式&quot;">​</a></h2><p>算子工程在核函数内提供了DTYPE_&lt;Arg&gt;、ORIG_DTYPE_&lt;Arg&gt;、FORMAT_&lt;Arg&gt;三种宏用于表示核函数入参（算子的输入输出）的数据类型、原始数据类型和数据格式。其中&lt;Arg&gt;为入参的大写格式。</p><ul><li>DTYPE_&lt;Arg&gt;，入参的数据类型。是指在Device侧实际可使用的数据类型，比如half、float等。</li><li>ORIG_DTYPE_&lt;Arg&gt;，入参的原始数据类型。是指在Host侧进行原型定义时，指定的数据类型（不包含命名空间），比如DT_FLOAT16、DT_FLOAT等。</li><li>FORMAT_&lt;Arg&gt;，入参的数据格式。是指在Host侧进行原型定义时，指定的数据格式（不包含命名空间），比如FORMAT_ND、FORMAT_NZ等。</li></ul><p>样例如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>template&lt;class T&gt; func() {}</span></span>
<span class="line"><span>extern &quot;C&quot; __global__ __aicore__ void add_custom(GM_ADDR x, GM_ADDR y, GM_ADDR z, GM_ADDR workspace, GM_ADDR tiling)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    DTYPE_X temp;</span></span>
<span class="line"><span>    func&lt;DTYPE_Z&gt;();</span></span>
<span class="line"><span>    if (FORMAT_Y == FORMAT_ND) {</span></span>
<span class="line"><span>        ...</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    if (ORIG_DTYPE_Y == DT_FLOAT) {</span></span>
<span class="line"><span>        ...</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="输出shape依赖计算的算子kernel实现" tabindex="-1">输出shape依赖计算的算子kernel实现 <a class="header-anchor" href="#输出shape依赖计算的算子kernel实现" aria-label="Permalink to &quot;输出shape依赖计算的算子kernel实现&quot;">​</a></h2><p>某些算子，比如NonZero（统计tensor中非零值的个数），计算完成前无法得知算子输出的shape信息，算子计算完成后才能获取。该类算子在原型定义时，需要使用OutputShapeDependOnCompute接口进行标识，同时在算子核函数中将实际输出shape写入到出参中，便于框架侧基于该信息进行输出内存的管理。</p><p>在核函数所有输出的最后增加一个GM_ADDR类型的输出参数，并在核函数计算完成后，将输出shape信息写入到该出参中。shape信息的排布格式如下，大小为<strong>n * (8 + 1)</strong>，每个元素的数据类型为<strong>uint64_t</strong>。其中n表示待刷新shape信息的输出个数，每个输出的shape信息都通过第1个元素来保存实际的shape维度（dim），后续的8个元素来保存具体每个维度的shape信息。</p><p><img src="`+l+`" alt=""></p><div class="note custom-block github-alert"><p class="custom-block-title">说明</p><p></p><ul><li>输出的顺序和原型定义中输出的顺序保持一致。</li><li>对于uint64_t的输出数据类型（对于tensor而言），需要将dim的uint32_t的高位设置为1，表示以uint64_t类型解析该tensor。</li></ul></div><ul><li><p>如下示例中，算子中有一个输出依赖计算得出，输出tensor的数据类型为uint32_t，计算完成后，得到输出的shape为（32, 64），出参shape_out用于存放该shape信息，值为（2, 32, 64）。代码示例如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>extern &quot;C&quot; __global__ __aicore__ void xxx_custom(GM_ADDR x, GM_ADDR y, GM_ADDR z, GM_ADDR shape_out, GM_ADDR workspace, GM_ADDR tiling) {</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span>    constexpr uint32_t SHAPEOUT_SIZE = 9;</span></span>
<span class="line"><span>    // 输出数据为2维([32, 64])，tensor类型为uint32_t</span></span>
<span class="line"><span>    // shapeoutGlobal_uint32用于存放输出Shape信息，数据类型固定为uint64_t</span></span>
<span class="line"><span>    GlobalTensor&lt;uint64_t&gt; shapeoutGlobal_uint32;</span></span>
<span class="line"><span>    shapeoutGlobal_uint32.SetGlobalBuffer((__gm__ uint64_t*)shape_out, SHAPEOUT_SIZE);</span></span>
<span class="line"><span>    shapeoutGlobal_uint32.SetValue(0, 2);</span></span>
<span class="line"><span>    shapeoutGlobal_uint32.SetValue(1, 32);</span></span>
<span class="line"><span>    shapeoutGlobal_uint32.SetValue(2, 64);</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span>}</span></span></code></pre></div></li><li><p>如下示例中，算子中有一个输出依赖计算得出，输出tensor的数据类型为uint64_t，计算完成后，得到输出的shape为（1, 64, 128, 128），出参shape_out用于存放该shape信息，值为（0x0000000080000000 | 4 , 1, 64, 128, 128）。代码示例如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>extern &quot;C&quot; __global__ __aicore__ void xxx_custom(GM_ADDR x, GM_ADDR y, GM_ADDR z, GM_ADDR shape_out, GM_ADDR workspace, GM_ADDR tiling) {</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span>    constexpr uint32_t SHAPEOUT_SIZE = 9;</span></span>
<span class="line"><span>    // 输出数据为4维([1, 64, 128, 128])，tensor类型为uint64_t</span></span>
<span class="line"><span>    // shapeoutGlobal_uint64用于存放输出Shape信息，数据类型固定为uint64_t</span></span>
<span class="line"><span>    GlobalTensor&lt;uint64_t&gt; shapeoutGlobal_uint64;</span></span>
<span class="line"><span>    shapeoutGlobal_uint64.SetGlobalBuffer((__gm__ uint64_t*)shape_out, SHAPEOUT_SIZE);</span></span>
<span class="line"><span>    shapeoutGlobal_uint64.SetValue(0, 0x0000000080000000 | 4);</span></span>
<span class="line"><span>    shapeoutGlobal_uint64.SetValue(1, 1);</span></span>
<span class="line"><span>    shapeoutGlobal_uint64.SetValue(2, 64);</span></span>
<span class="line"><span>    shapeoutGlobal_uint64.SetValue(3, 128);</span></span>
<span class="line"><span>    shapeoutGlobal_uint64.SetValue(4, 128);</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span>}</span></span></code></pre></div></li><li><p>如下示例中，算子中有两个输出依赖计算得出，输出tensor的数据类型为uint64_t，计算完成后，得到输出的shape为（16, 32）和 （1, 16, 16, 32），出参shape_out用于存放该shape信息。示例如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>extern &quot;C&quot; __global__ __aicore__ void xxx_custom(GM_ADDR x, GM_ADDR y, GM_ADDR z, GM_ADDR shape_out, GM_ADDR workspace, GM_ADDR tiling) {</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    // 有两个输出需要刷新shape，一个维度为2维[16, 32]，一个维度为4维[1, 16, 16, 32]</span></span>
<span class="line"><span>    // 输出tensor类型为uint64_t</span></span>
<span class="line"><span>    constexpr uint32_t SHAPEOUT_SIZE_2 = 18;</span></span>
<span class="line"><span>    // shapeoutGlobal_uint64_2用于存放输出Shape信息，数据类型固定为uint64_t</span></span>
<span class="line"><span>    GlobalTensor&lt;uint64_t&gt; shapeoutGlobal_uint64_2;</span></span>
<span class="line"><span>    shapeoutGlobal_uint64_2.SetGlobalBuffer((__gm__ uint64_t*)shape_out, SHAPEOUT_SIZE_2 );</span></span>
<span class="line"><span>    shapeoutGlobal_uint64_2.SetValue(0, 0x0000000080000000 | 2);</span></span>
<span class="line"><span>    shapeoutGlobal_uint64_2.SetValue(1, 16);</span></span>
<span class="line"><span>    shapeoutGlobal_uint64_2.SetValue(2, 32);</span></span>
<span class="line"><span>    // index[3]~index[8]数据为占位</span></span>
<span class="line"><span>    shapeoutGlobal_uint64_2.SetValue(9, 0x0000000080000000 | 4);</span></span>
<span class="line"><span>    shapeoutGlobal_uint64_2.SetValue(10, 1);</span></span>
<span class="line"><span>    shapeoutGlobal_uint64_2.SetValue(11, 16);</span></span>
<span class="line"><span>    shapeoutGlobal_uint64_2.SetValue(12, 16);</span></span>
<span class="line"><span>    shapeoutGlobal_uint64_2.SetValue(13, 32);</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>}</span></span></code></pre></div></li></ul>`,21)])])}const d=s(t,[["render",i]]);export{g as __pageData,d as default};
