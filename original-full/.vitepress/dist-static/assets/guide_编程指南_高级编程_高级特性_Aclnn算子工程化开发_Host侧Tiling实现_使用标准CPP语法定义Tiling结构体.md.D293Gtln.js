import{c as a,Q as s,j as l,m as t}from"./chunks/framework.DOi4mjdC.js";const d=JSON.parse('{"title":"使用标准C++语法定义Tiling结构体","description":"","frontmatter":{},"headers":[{"level":1,"title":"使用标准C++语法定义Tiling结构体","slug":"使用标准c语法定义tiling结构体"},{"level":2,"title":"具体步骤","slug":"具体步骤"},{"level":2,"title":"使用标准C++语法定义Tiling结构体的优势","slug":"使用标准c语法定义tiling结构体的优势"},{"level":2,"title":"使用约束","slug":"使用约束"},{"level":2,"title":"如何将宏定义Tiling结构体修改为标准C++语法","slug":"如何将宏定义tiling结构体修改为标准c语法"}],"relativePath":"guide/编程指南/高级编程/高级特性/Aclnn算子工程化开发/Host侧Tiling实现/使用标准CPP语法定义Tiling结构体.md","filePath":"guide/编程指南/高级编程/高级特性/Aclnn算子工程化开发/Host侧Tiling实现/使用标准CPP语法定义Tiling结构体.md"}'),p={name:"guide/编程指南/高级编程/高级特性/Aclnn算子工程化开发/Host侧Tiling实现/使用标准CPP语法定义Tiling结构体.md"};function i(e,n,c,o,g,u){return s(),l("div",null,[...n[0]||(n[0]=[t(`<h1 id="使用标准c-语法定义tiling结构体" tabindex="-1">使用标准C++语法定义Tiling结构体 <a class="header-anchor" href="#使用标准c-语法定义tiling结构体" aria-label="Permalink to &quot;使用标准C++语法定义Tiling结构体&quot;">​</a></h1><h2 id="具体步骤" tabindex="-1">具体步骤 <a class="header-anchor" href="#具体步骤" aria-label="Permalink to &quot;具体步骤&quot;">​</a></h2><p>在定义Tiling结构体时，可以使用标准C++语法定义一个<strong>POD类型（Plain Old Data）</strong>，即与C语言兼容的数据类型。具体步骤如下。完整样例请参考<a href="https://gitee.com/ascend/samples/tree/master/operator/ascendc/0_introduction/10_matmul_frameworklaunch/MatmulCustomMultiCore" target="_blank" rel="noreferrer">标准C++语法定义Tiling结构体样例</a>。</p><ol><li><p>使用C++语法定义Tiling结构体。</p><div class="note custom-block github-alert"><p class="custom-block-title">说明</p><p>该结构体定义所在的头文件应放置在算子工程的op_kernel目录下。由于只有该目录下的文件会被打包进算子包，供在线编译场景中使用，若将文件放置在其他目录中，可能导致在线编译因找不到相关文件而失败。</p></div><p>用户在使用高阶API的Tiling结构体时，通过AscendC::tiling命名空间引用&quot;kernel_tiling/kernel_tiling.h&quot;中预定义的Tiling结构体，如下代码所示。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#ifndef MATMUL_CUSTOM_TILING_H</span></span>
<span class="line"><span>#define MATMUL_CUSTOM_TILING_H</span></span>
<span class="line"><span>#include &lt;cstdint&gt;</span></span>
<span class="line"><span>#include &quot;kernel_tiling/kernel_tiling.h&quot;</span><span>    // for TCubeTiling</span></span>
<span class="line"><span></span></span>
<span class="line"><span>struct MatmulCustomTilingData {</span></span>
<span class="line"><span>    uint64_t localMemSize;</span></span>
<span class="line"><span>    AscendC::tiling::TCubeTiling cubeTilingData;</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span>#endif</span><span>  // MATMUL_CUSTOM_TILING_H</span></span></code></pre></div></li><li><p>Host侧Tiling函数中对Tiling结构体赋值。</p><ul><li>需要包含Tiling结构体定义头文件。</li><li>通过GetTilingData获取Tiling结构体指针，并对其成员变量进行赋值。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &quot;../op_kernel/matmul_custom_tiling.h&quot;</span><span>  // 包含Tiling结构体定义头文件</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>namespace optiling {</span></span>
<span class="line"><span>static ge::graphStatus TilingFunc(gert::TilingContext *context)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    MultiCoreMatmulTiling cubeTiling(ascendcPlatform);</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    // 获取Tiling结构体指针</span></span>
<span class="line"><span>    MatmulCustomTilingData *tiling = context-&gt;GetTilingData&lt;MatmulCustomTilingData&gt;();</span></span>
<span class="line"><span>    // 对tiling的成员变量赋值</span></span>
<span class="line"><span>    if (cubeTiling.GetTiling(tiling-&gt;cubeTilingData) == -1) {</span></span>
<span class="line"><span>        return ge::GRAPH_FAILED;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    uint64_t localMemSize;</span></span>
<span class="line"><span>    ascendcPlatform.GetCoreMemSize(platform_ascendc::CoreMemType::UB, localMemSize);</span></span>
<span class="line"><span>    tiling-&gt;localMemSize = localMemSize;</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    return ge::GRAPH_SUCCESS;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>} // namespace optiling</span></span></code></pre></div></li><li><p>Kernel侧注册Tiling结构体，解析Tiling数据至TilingData结构并使用。</p><ul><li>需要包含Tiling结构体定义头文件。</li><li>通过<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/REGISTER_TILING_DEFAULT.md" target="_blank" rel="noreferrer">REGISTER_TILING_DEFAULT</a>或者<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/REGISTER_TILING_FOR_TILINGKEY.md" target="_blank" rel="noreferrer">REGISTER_TILING_FOR_TILINGKEY</a>注册Tiling结构体；通过<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/GET_TILING_DATA.md" target="_blank" rel="noreferrer">GET_TILING_DATA</a>解析Tiling数据至TilingData结构并使用。其中REGISTER_TILING_DEFAULT同时也用于标识使用标准C++语法定义TilingData结构体。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &quot;kernel_operator.h&quot;</span></span>
<span class="line"><span>#include &quot;matmul_custom_tiling.h&quot;</span><span>  // 包含Tiling结构体定义头文件</span></span>
<span class="line"><span></span></span>
<span class="line"><span>extern &quot;C&quot; __global__ __aicore__ void matmul_custom(GM_ADDR a, GM_ADDR b, GM_ADDR bias, GM_ADDR c, GM_ADDR workspace, GM_ADDR tiling)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    REGISTER_TILING_DEFAULT(MatmulCustomTilingData);</span></span>
<span class="line"><span>    GET_TILING_DATA(tilingData, tiling);</span></span>
<span class="line"><span>    MatmulKernel&lt;half, half, float, float&gt; matmulKernel;</span></span>
<span class="line"><span>    AscendC::TPipe pipe;</span></span>
<span class="line"><span>    REGIST_MATMUL_OBJ(&amp;pipe, GetSysWorkSpacePtr(), matmulKernel.matmulObj, &amp;tilingData.cubeTilingData); // Initialize the matmul object.</span></span>
<span class="line"><span>    matmulKernel.Init(a, b, bias, c, workspace, tilingData.localMemSize, tilingData.cubeTilingData);</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>}</span></span></code></pre></div></li></ol><h2 id="使用标准c-语法定义tiling结构体的优势" tabindex="-1">使用标准C++语法定义Tiling结构体的优势 <a class="header-anchor" href="#使用标准c-语法定义tiling结构体的优势" aria-label="Permalink to &quot;使用标准C++语法定义Tiling结构体的优势&quot;">​</a></h2><p>相比较使用BEGIN_TILING_DATA_DEF等宏进行定义的方式，该方式不仅更符合C++开发者的开发习惯，并且提供了强大的灵活性。</p><ul><li><p>支持bool类型，支持数组、结构体数组及列表初始化。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class A {</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    bool xxx;</span></span>
<span class="line"><span>    uint32_t xxx[2][128] = {0};</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class B {</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    bool xxx = false;</span></span>
<span class="line"><span>    uint8_t xxx[2][2]{0};</span></span>
<span class="line"><span>    A[10];</span></span>
<span class="line"><span>};</span></span></code></pre></div></li><li><p>不同算子可以支持定义同名但结构不同的Tiling结构体，通过算子引用对应的头文件即可实现区分。这种方式允许每个算子使用符合自身需求的Tiling结构定义，而不会与其他算子产生冲突。</p><p>相比之下，使用BEGIN_TILING_DATA_DEF等宏方式定义同名但结构不同的Tiling结构体时，由于这些结构体会被注册到全局的Tiling结构体管理变量中，可能导致后续通过结构体名称访问时，无法准确获取当前算子实际使用的Tiling结构体，从而引发未定义行为。</p><p>算子A：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class TilingData {</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    uint32_t length;</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>算子B：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class TilingData {</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    uint32_t length;</span></span>
<span class="line"><span>    uint16_t coreNum;</span></span>
<span class="line"><span>};</span></span></code></pre></div></li><li><p>支持自定义Tiling赋值，用户可以通过访问Tiling结构体成员变量直接赋值，或自定义Tiling赋值函数（宏定义方式下，用户仅可通过框架生成的set_xx/get_xx方法赋值/访问）</p><p>Tiling结构体定义：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class TilingData {</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    uint32_t xxx1;</span></span>
<span class="line"><span>    uint32_t xxx2;</span></span>
<span class="line"><span>    uint8_t xxx3;</span></span>
<span class="line"><span>    bool xxx4;</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>Host侧Tiling函数：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &quot;../op_kernel/xxx_custom_tiling.h&quot;</span><span>  // 包含Tiling结构体定义头文件</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>namespace optiling {</span></span>
<span class="line"><span>static void ComputeTiling(TilingData* tiling, ...)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    // 计算Tiling逻辑</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    tiling-&gt;xxx1 = xxx;</span></span>
<span class="line"><span>    tiling-&gt;xxx2 = xxx;</span></span>
<span class="line"><span>    tiling-&gt;xxx3 = xxx;</span></span>
<span class="line"><span>    tiling-&gt;bool = xxx;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>static ge::graphStatus TilingFunc(gert::TilingContext *context)</span></span>
<span class="line"><span>{    </span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    TilingData *tiling = context-&gt;GetTilingData&lt;TilingData&gt;();</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    ComputeTiling(tiling, ...)</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return ge::GRAPH_SUCCESS;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>} // namespace optiling</span></span></code></pre></div></li></ul><h2 id="使用约束" tabindex="-1">使用约束 <a class="header-anchor" href="#使用约束" aria-label="Permalink to &quot;使用约束&quot;">​</a></h2><p>使用标准C++语法定义Tiling结构体时存在如下约束限制：</p><ul><li><p>Tiling结构体内不支持定义成员函数，因为成员函数存在Device侧和Host侧的差异（Device侧的函数需要__aicore__修饰符），而Tiling结构体Device侧和Host侧共用，所以会在编译或执行时出现问题：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class TilingData {</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    uint32_t xxx;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    __aicore__ funcA() { ... }  // 错误，host侧编译时不支持__aicore__修饰符，会出现编译错误</span></span>
<span class="line"><span>    void func() { ... }         // 错误，device侧缺少__aicore__修饰符，无法执行</span></span>
<span class="line"><span>};</span></span></code></pre></div></li><li><p>Tiling结构体成员变量不支持指针、引用类型，此类数据类型会导致Host侧到Device侧数据解析异常：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class TilingData {</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    uint32_t* totalLength; // 指针场景不支持，Host无法传递指针到Device</span></span>
<span class="line"><span>    uint32_t&amp; tileNum;       // 引用场景不支持，Host无法传递指针到Device</span></span>
<span class="line"><span>};</span></span></code></pre></div></li><li><p>Tiling结构体仅支持POD类型，没有虚函数、虚继承等面向对象特性，也不支持模板类：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>class A {</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    uint32_t totalLength;</span></span>
<span class="line"><span>    uint32_t tileNum;</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span>class B: public A {</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    uint32_t xxx;</span></span>
<span class="line"><span>    uint32_t xxx;</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span>static ge::graphStatus TilingFunc(gert::TilingContext* context)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    // 错误用法</span></span>
<span class="line"><span>    B *tiling = context-&gt;GetTilingData&lt;A&gt;(); // 不支持，会触发未知问题</span></span>
<span class="line"><span>    // 正确用法</span></span>
<span class="line"><span>    B *tiling = context-&gt;GetTilingData&lt;B&gt;();</span></span>
<span class="line"><span>    ......</span></span>
<span class="line"><span>    return ge::GRAPH_SUCCESS;</span></span>
<span class="line"><span>}</span></span></code></pre></div></li><li><p>GetTilingData获取的Tiling不包含初值，需显式赋值或在Tiling结构体定义并调用Tiling赋值函数；</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>static ge::graphStatus TilingFunc(gert::TilingContext* context)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    TilingData *tiling = context-&gt;GetTilingData&lt;TilingData&gt;(); //获取Tiling结构体，此时totalLength、tileNum为0，并不会带入初始值</span></span>
<span class="line"><span>    ......</span></span>
<span class="line"><span>    // 需显式赋值</span></span>
<span class="line"><span>    tiling-&gt;totalLength = totalLength;  // 赋值Tiling结构体成员变量</span></span>
<span class="line"><span>    tiling-&gt;tileNum = TILE_NUM;         // 赋值Tiling结构体成员变量</span></span>
<span class="line"><span>    ......</span></span>
<span class="line"><span>    return ge::GRAPH_SUCCESS;</span></span>
<span class="line"><span>}</span></span></code></pre></div></li><li><p>host侧和kernel侧的Tiling结构体支持传入模板参数。由于宏函数中逗号运算符的特殊性，在kernel侧宏函数（REGISTER_TILING_DEFAULT或者REGISTER_TILING_FOR_TILINGKEY）使用带逗号的模板类型（如：template&lt;int32_t sizeA, int32_t sizeB&gt;），存在编译异常，因此需要使用别名方式来定义带逗号的模板类型（如：using size = template&lt;int32_t sizeA, int32_t sizeB&gt;）。具体示例如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 模板参数个数大于1的场景</span></span>
<span class="line"><span>template&lt;int32_t sizeA, int32_t sizeB&gt;</span></span>
<span class="line"><span>class A {</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    uint32_t totalLength;</span></span>
<span class="line"><span>    uint32_t tileNum;</span></span>
<span class="line"><span>    uint32_t dataArray[sizeA];</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span>// 模板参数个数等于1的场景</span></span>
<span class="line"><span>template&lt;int32_t sizeA&gt;</span></span>
<span class="line"><span>class B {</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    uint32_t totalLength;</span></span>
<span class="line"><span>    uint32_t tileNum;</span></span>
<span class="line"><span>    uint32_t dataArray[sizeA];</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// host侧可以直接传入Tiling结构体以及对应模板参数</span></span>
<span class="line"><span>static ge::graphStatus TilingFunc(gert::TilingContext* context)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    // 模板参数个数等于1或者大于等于1的时候都可以直接传入</span></span>
<span class="line"><span>    A&lt;3, 5&gt; *tiling = context-&gt;GetTilingData&lt;A&lt;3,5&gt;&gt;();</span></span>
<span class="line"><span>    B&lt;3&gt; *tiling = context-&gt;GetTilingData&lt;B&lt;3&gt;&gt;();</span></span>
<span class="line"><span>    ......</span></span>
<span class="line"><span>    return ge::GRAPH_SUCCESS;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// kernel侧代码</span></span>
<span class="line"><span>#include &quot;kernel_operator.h&quot;</span></span>
<span class="line"><span>#include &quot;add_custom_tiling.h&quot;</span><span>  // 包含Tiling结构体定义头文件</span></span>
<span class="line"><span>extern &quot;C&quot; __global__ __aicore__ void add_custom(GM_ADDR x, GM_ADDR y, GM_ADDR z, GM_ADDR workspace, GM_ADDR tiling)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    using aa = A&lt;3,5&gt;;</span></span>
<span class="line"><span>    REGISTER_TILING_DEFAULT(aa);                                // 模板参数个数大于1时，一定要用using来指定</span></span>
<span class="line"><span>    REGISTER_TILING_FOR_TILINGKEY(&quot;TILING_KEY_VAR == 2&quot;, B&lt;3&gt;);  // 模板参数个数等于1时，可以直接写明模板参数</span></span>
<span class="line"><span>    ......</span></span>
<span class="line"><span>}</span></span></code></pre></div></li></ul><h2 id="如何将宏定义tiling结构体修改为标准c-语法" tabindex="-1">如何将宏定义Tiling结构体修改为标准C++语法 <a class="header-anchor" href="#如何将宏定义tiling结构体修改为标准c-语法" aria-label="Permalink to &quot;如何将宏定义Tiling结构体修改为标准C++语法&quot;">​</a></h2><p>本节介绍如何将使用BEGIN_TILING_DATA_DEF等宏进行定义的方式改造成使用标准C++语法的方式。</p><ol><li><p><strong>首先</strong>将之前位于op_host目录下的Tiling结构体定义头文件移至op_kernel目录下，内容前后对比如下，<strong>注意此时包含的头文件变化，不需要再包含宏定义相关的头文件</strong>。</p><p><strong>表 1</strong> 两种方式对比</p><p>&lt;table&gt;&lt;thead align=&quot;left&quot;&gt;&lt;tr&gt;&lt;th class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;50%&quot;&gt;&lt;p&gt;宏定义方式&lt;/p&gt; &lt;/th&gt; &lt;th class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;50%&quot;&gt;&lt;p&gt;标准C++语法定义方式&lt;/p&gt; &lt;/th&gt; &lt;/tr&gt; &lt;/thead&gt; &lt;tbody&gt;&lt;tr&gt;&lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;50%&quot;&gt;&lt;pre class=&quot;screen&quot;&gt;#include &quot;register/tilingdata_base.h&quot; #include &quot;tiling/tiling_api.h&quot; // TCubeTiling结构体通过宏定义</p><p>namespace optiling { BEGIN_TILING_DATA_DEF(MatmulCustomTilingData) TILING_DATA_FIELD_DEF(uint64_t, localMemSize); TILING_DATA_FIELD_DEF_STRUCT(TCubeTiling, cubeTilingData); END_TILING_DATA_DEF; REGISTER_TILING_DATA_CLASS(MatmulCustom, MatmulCustomTilingData) } // namespace optiling&lt;/pre&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;50%&quot;&gt;&lt;pre class=&quot;screen&quot;&gt;#include &lt;cstdint&gt; #include &quot;kernel_tiling/kernel_tiling.h&quot; // TCubeTiling结构体通过C++语法定义</p><p>struct MatmulCustomTilingData { uint64_t localMemSize; AscendC::tiling::TCubeTiling cubeTilingData; };&lt;/pre&gt; &lt;/td&gt; &lt;/tr&gt; &lt;/tbody&gt; &lt;/table&gt;</p></li><li><p><strong>然后</strong>修改Host侧的Tiling函数实现，此时对Tiling结构体的成员变量赋值无需使用宏定义生成的set方法，而是使用用户熟悉的C++指针赋值方式。</p><p><strong>表 2</strong> 两种方式对比</p><p>&lt;table&gt;&lt;thead align=&quot;left&quot;&gt;&lt;tr&gt;&lt;th class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;50%&quot;&gt;&lt;p&gt;宏定义方式&lt;/p&gt; &lt;/th&gt; &lt;th class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;50%&quot;&gt;&lt;p&gt;标准C++语法定义方式&lt;/p&gt; &lt;/th&gt; &lt;/tr&gt; &lt;/thead&gt; &lt;tbody&gt;&lt;tr&gt;&lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;50%&quot;&gt;&lt;pre class=&quot;screen&quot;&gt;namespace optiling { static ge::graphStatus TilingFunc(gert::TilingContext *context) { ... MultiCoreMatmulTiling cubeTiling(ascendcPlatform); ... MatmulCustomTilingData tiling; if (cubeTiling.GetTiling(tiling.cubeTilingData) == -1) { // Get matmul tiling. return ge::GRAPH_FAILED; }</p><pre><code>uint64_t localMemSize;
ascendcPlatform.GetCoreMemSize(platform_ascendc::CoreMemType::UB, localMemSize);
tiling.set_localMemSize(localMemSize);  // 需要使用宏定义方式生成的set方法

...
// 需要将局部变量保存至context上下文
tiling.SaveToBuffer(context-&amp;gt;GetRawTilingData()-&amp;gt;GetData(), context-&amp;gt;GetRawTilingData()-&amp;gt;GetCapacity());  
...

return ge::GRAPH_SUCCESS;
</code></pre><p>} } // namespace optiling&lt;/pre&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;50%&quot;&gt;&lt;pre class=&quot;screen&quot;&gt;#include &quot;../op_kernel/matmul_custom_tiling.h&quot; // 包含Tiling结构体定义头文件 ...</p><p>namespace optiling { static ge::graphStatus TilingFunc(gert::TilingContext *context) { ... MultiCoreMatmulTiling cubeTiling(ascendcPlatform); ... MatmulCustomTilingData *tiling = context-&gt;GetTilingData&lt;MatmulCustomTilingData&gt;(); if (cubeTiling.GetTiling(tiling-&gt;cubeTilingData) == -1) { return ge::GRAPH_FAILED; }</p><pre><code>uint64_t localMemSize;
ascendcPlatform.GetCoreMemSize(platform_ascendc::CoreMemType::UB, localMemSize);
tiling-&amp;gt;localMemSize = localMemSize;  // 使用用户友好的C++指针方式赋值成员变量

...

return ge::GRAPH_SUCCESS;
</code></pre><p>} } // namespace optiling&lt;/pre&gt; &lt;/td&gt; &lt;/tr&gt; &lt;/tbody&gt; &lt;/table&gt;</p></li><li><p><strong>最后</strong>，在Kernel 函数入口处新增<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/REGISTER_TILING_DEFAULT.md" target="_blank" rel="noreferrer">REGISTER_TILING_DEFAULT</a>调用，用于注册Tiling结构体。该注册操作的作用是：告知框架用户已使用标准 C++ 语法定义Tiling结构体，并明确其类型，以便框架在进行Tiling数据解析时能够正确识别和使用该结构体。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &quot;matmul_custom_tiling.h&quot;</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>extern &quot;C&quot; __global__ __aicore__ void matmul_custom(GM_ADDR a, GM_ADDR b, GM_ADDR bias, GM_ADDR c, GM_ADDR workspace, GM_ADDR tiling)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    REGISTER_TILING_DEFAULT(MatmulCustomTilingData);  // 新增REGISTER_TILING_DEFAULT调用注册Tiling结构体</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>}</span></span></code></pre></div></li></ol>`,13)])])}const _=a(p,[["render",i]]);export{d as __pageData,_ as default};
