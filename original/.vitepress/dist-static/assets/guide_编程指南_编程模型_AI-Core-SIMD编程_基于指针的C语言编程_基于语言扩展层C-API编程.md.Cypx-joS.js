import{c as n,Q as a,j as t,m as l}from"./chunks/framework.DOi4mjdC.js";const d=JSON.parse('{"title":"基于语言扩展层C API编程","description":"","frontmatter":{},"headers":[{"level":1,"title":"基于语言扩展层C API编程","slug":"基于语言扩展层c-api编程"},{"level":2,"title":"内存管理","slug":"内存管理"},{"level":2,"title":"同步控制","slug":"同步控制"},{"level":2,"title":"编程示例","slug":"编程示例"}],"relativePath":"guide/编程指南/编程模型/AI-Core-SIMD编程/基于指针的C语言编程/基于语言扩展层C-API编程.md","filePath":"guide/编程指南/编程模型/AI-Core-SIMD编程/基于指针的C语言编程/基于语言扩展层C-API编程.md"}'),p={name:"guide/编程指南/编程模型/AI-Core-SIMD编程/基于指针的C语言编程/基于语言扩展层C-API编程.md"};function o(_,s,e,c,i,u){return a(),t("div",null,[...s[0]||(s[0]=[l(`<h1 id="基于语言扩展层c-api编程" tabindex="-1">基于语言扩展层C API编程 <a class="header-anchor" href="#基于语言扩展层c-api编程" aria-label="Permalink to &quot;基于语言扩展层C API编程&quot;">​</a></h1><p>基于语言扩展层C API编程时，通过提供纯C风格的接口，符合C语言算子开发习惯，提供与业界类似编程体验。本节主要介绍C API编程范式，通过内存管理、同步控制、计算及搬运接口相关的介绍，使开发者更好地理解和使用C API进行编程。</p><h2 id="内存管理" tabindex="-1">内存管理 <a class="header-anchor" href="#内存管理" aria-label="Permalink to &quot;内存管理&quot;">​</a></h2><p>C API通过C风格的地址限定符描述不同层级内存，并且可以通过指针直接操作内存地址，从而精准控制数据存放位置。不同存储单元的地址限定符介绍如下：</p><p><strong>表 1</strong> 不同存储单元的地址限定符</p><p>&lt;table&gt;&lt;thead align=&quot;left&quot;&gt;&lt;tr&gt;&lt;th class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;22.33%&quot;&gt;&lt;p&gt;存储单元&lt;/p&gt; &lt;/th&gt; &lt;th class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;13.98%&quot;&gt;&lt;p&gt;地址限定符&lt;/p&gt; &lt;/th&gt; &lt;th class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;63.690000000000005%&quot;&gt;&lt;p&gt;描述&lt;/p&gt; &lt;/th&gt; &lt;/tr&gt; &lt;/thead&gt; &lt;tbody&gt;&lt;tr&gt;&lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;22.33%&quot;&gt;&lt;p&gt;&lt;span&gt;Global Memory&lt;/span&gt;&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;13.98%&quot;&gt;&lt;p&gt;<strong>gm</strong>&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;63.690000000000005%&quot;&gt;&lt;p&gt;表示被修饰的变量位于Global Memory地址空间。&lt;/p&gt; &lt;/td&gt; &lt;/tr&gt; &lt;tr&gt;&lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;22.33%&quot;&gt;&lt;p&gt;&lt;span&gt;Unified Buffer&lt;/span&gt;&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;13.98%&quot;&gt;&lt;p&gt;<strong>ubuf</strong>&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;63.690000000000005%&quot;&gt;&lt;p&gt;表示被修饰的变量位于Unified Buffer地址空间。&lt;/p&gt; &lt;/td&gt; &lt;/tr&gt; &lt;tr&gt;&lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;22.33%&quot;&gt;&lt;p&gt;&lt;span&gt;L1 Buffer&lt;/span&gt;&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;13.98%&quot;&gt;&lt;p&gt;<strong>cbuf</strong>&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;63.690000000000005%&quot;&gt;&lt;p&gt;表示被修饰的变量位于L1 Buffer地址空间。&lt;/p&gt; &lt;/td&gt; &lt;/tr&gt; &lt;tr&gt;&lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;22.33%&quot;&gt;&lt;p&gt;&lt;span&gt;L0A Buffer&lt;/span&gt;&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;13.98%&quot;&gt;&lt;p&gt;<strong>ca</strong>&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;63.690000000000005%&quot;&gt;&lt;p&gt;表示被修饰的变量位于L0A Buffer地址空间。&lt;/p&gt; &lt;/td&gt; &lt;/tr&gt; &lt;tr&gt;&lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;22.33%&quot;&gt;&lt;p&gt;&lt;span&gt;L0B Buffer&lt;/span&gt;&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;13.98%&quot;&gt;&lt;p&gt;<strong>cb</strong>&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;63.690000000000005%&quot;&gt;&lt;p&gt;表示被修饰的变量位于L0B Buffer地址空间。&lt;/p&gt; &lt;/td&gt; &lt;/tr&gt; &lt;tr&gt;&lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;22.33%&quot;&gt;&lt;p&gt;&lt;span&gt;L0C Buffer&lt;/span&gt;&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;13.98%&quot;&gt;&lt;p&gt;<strong>cc</strong>&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;63.690000000000005%&quot;&gt;&lt;p&gt;表示被修饰的变量位于L0C Buffer地址空间。&lt;/p&gt; &lt;/td&gt; &lt;/tr&gt; &lt;/tbody&gt; &lt;/table&gt;</p><p>地址空间限定符可以在数组或指针变量声明中使用，用于指定对象分配的区域。同一个类型上不允许使用多个地址空间限定符。</p><p>基于C API编程时，开发者需要自行通过显式的内存管理来控制内存，不同层级的内存申请介绍如下：</p><ul><li>全局内存（Global Memory）：一般通过Device侧接口aclrtMalloc接口分配传入，需要增加对应地址限定符使用。</li><li>内部存储（包含Unified Buffer、L1 Buffer等）：由用户自行申请空间，通过地址限定符关键字在Kernel内声明。无自动垃圾回收机制，需开发者严格控制生命周期。以申请UB空间为例：</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 在数组变量声明中使用地址空间限定符</span></span>
<span class="line"><span>// total_length 指参与计算的数据长度</span></span>
<span class="line"><span>constexpr uint64_t total_length = 256;</span></span>
<span class="line"><span>__ubuf__ float xLocal[ total_length ];</span></span>
<span class="line"><span>__ubuf__ float yLocal[ total_length ];</span></span>
<span class="line"><span>__ubuf__ float zLocal[ total_length ];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 在指针变量声明中使用地址空间限定符</span></span>
<span class="line"><span>uint64_t offset = 0;                                   // 首先为src0申请内存，从0开始。</span></span>
<span class="line"><span>__ubuf__ half* src0 = (__ubuf__ half*)asc_get_phy_buf_addr(offset);    // 获取src0的地址，通过__ubuf__关键字指定该地址指向UB内存。</span></span></code></pre></div><h2 id="同步控制" tabindex="-1">同步控制 <a class="header-anchor" href="#同步控制" aria-label="Permalink to &quot;同步控制&quot;">​</a></h2><p>NPU内部有不同的计算单元，在计算前往往需要把计算数据搬运到计算单元上。不同计算单元上的计算过程、数据搬运过程可划分为不同的流水线。如下表所示：</p><p><strong>表 2</strong> 指令流水类型和相关说明</p><p>&lt;table&gt;&lt;thead align=&quot;left&quot;&gt;&lt;tr&gt;&lt;th class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;23.03%&quot;&gt;&lt;p&gt;流水类型&lt;/p&gt; &lt;/th&gt; &lt;th class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;76.97%&quot;&gt;&lt;p&gt;含义&lt;/p&gt; &lt;/th&gt; &lt;/tr&gt; &lt;/thead&gt; &lt;tbody&gt;&lt;tr&gt;&lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;23.03%&quot;&gt;&lt;p&gt;PIPE_S&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;76.97%&quot;&gt;&lt;p&gt;标量流水线&lt;/p&gt; &lt;/td&gt; &lt;/tr&gt; &lt;tr&gt;&lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;23.03%&quot;&gt;&lt;p&gt;PIPE_V&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;76.97%&quot;&gt;&lt;p&gt;矢量计算流水及部分硬件架构下的L0C Buffer-&gt;UB数据搬运流水&lt;/p&gt; &lt;/td&gt; &lt;/tr&gt; &lt;tr&gt;&lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;23.03%&quot;&gt;&lt;p&gt;PIPE_M&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;76.97%&quot;&gt;&lt;p&gt;矩阵计算流水&lt;/p&gt; &lt;/td&gt; &lt;/tr&gt; &lt;tr&gt;&lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;23.03%&quot;&gt;&lt;p&gt;PIPE_MTE1&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;76.97%&quot;&gt;&lt;p&gt;L1 Buffer -&gt;L0A Buffer、L1 Buffer-&gt;L0B Buffer数据搬运流水&lt;/p&gt; &lt;/td&gt; &lt;/tr&gt; &lt;tr&gt;&lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;23.03%&quot;&gt;&lt;p&gt;PIPE_MTE2&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;76.97%&quot;&gt;&lt;p&gt;GM-&gt;L1 Buffer、GM-&gt;UB等数据搬运流水&lt;/p&gt; &lt;/td&gt; &lt;/tr&gt; &lt;tr&gt;&lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;23.03%&quot;&gt;&lt;p&gt;PIPE_MTE3&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;76.97%&quot;&gt;&lt;p&gt;UB-&gt;GM等数据搬运流水&lt;/p&gt; &lt;/td&gt; &lt;/tr&gt; &lt;tr&gt;&lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;23.03%&quot;&gt;&lt;p&gt;PIPE_FIX&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;76.97%&quot;&gt;&lt;p&gt;L0C Buffer-&gt;GM、L0C Buffer -&gt;L1等数据搬运流水&lt;/p&gt; &lt;/td&gt; &lt;/tr&gt; &lt;/tbody&gt; &lt;/table&gt;</p><p>在调用C API提供的搬运或者计算类API编写算子时，需要根据流水线之间的数据依赖关系插入对应的同步事件。C API提供了两种不同的同步控制接口，同步控制粒度由浅到深，帮助开发者精准适配硬件架构，挖掘异构计算的性能极限。</p><p>第一种：和静态Tensor编程方式一致的同步接口，主要通过asc_sync_notify/asc_sync_wait接口来精细化管理，需要手动管理事件的类型和事件ID，还需要考虑正向同步（循环内依赖）与反向同步（循环间依赖）。极致性能场景推荐使用此方式。使用示例如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 本片段仅用于说明数据搬运、矢量计算、同步操作间的关系。各接口的完整参数及上下文请参考下文中的编程示例。</span></span>
<span class="line"><span>asc_copy_gm2ub(); // GM-&gt;UB的搬运流水</span></span>
<span class="line"><span>asc_sync_notify(PIPE_MTE2, PIPE_V, EVENT_ID0);</span></span>
<span class="line"><span>asc_sync_wait(PIPE_MTE2, PIPE_V, EVENT_ID0);</span></span>
<span class="line"><span>asc_add(); // 矢量计算流水</span></span>
<span class="line"><span>asc_sync_notify(PIPE_V, PIPE_MTE3, EVENT_ID0);</span></span>
<span class="line"><span>asc_sync_wait(PIPE_V, PIPE_MTE3, EVENT_ID0);</span></span>
<span class="line"><span>asc_copy_ub2gm(); // UB-&gt;GM的搬运流水</span></span></code></pre></div><p>第二种：不感知流水类型的同步接口，将asc_sync接口添加在对应流水类型的指令后面来实现。使用这类同步接口时，不需要考虑指令流水类型，接口内部会自动管理所有指令流水的同步，简化同步指令。性能不敏感场景下，可以使用此方式。使用示例如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 本片段仅用于说明数据搬运、矢量计算、同步操作间的关系。各接口的完整参数及上下文请参考下文中的编程示例。</span></span>
<span class="line"><span>asc_copy_gm2ub();// GM-&gt;UB的搬运流水</span></span>
<span class="line"><span>asc_sync(); // 全同步 无需考虑后面的指令流水</span></span>
<span class="line"><span>asc_add(); // 矢量计算流水</span></span>
<span class="line"><span>asc_sync(); // 全同步 无需考虑后面的指令流水</span></span>
<span class="line"><span>asc_copy_ub2gm(); // UB-&gt;GM的搬运流水</span></span></code></pre></div><p>另外，C API还提供了一组包含同步能力的搬运及计算接口，开发者无需显式手动管理同步，同步操作隐藏在相应的接口中。性能不敏感场景下，推荐使用此方式。使用示例如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 本片段仅用于说明数据搬运、矢量计算、同步操作间的关系。各接口的完整参数及上下文请参考下文中的编程示例。</span></span>
<span class="line"><span>asc_copy_gm2ub_sync(); // GM-&gt;UB的搬运流水同时包含了和后面的任意指令流水的同步</span></span>
<span class="line"><span>asc_add_sync(); // 矢量计算流水同时包含了和后面的任意指令流水的同步</span></span>
<span class="line"><span>asc_copy_ub2gm_sync(); // UB-&gt;GM的搬运流水同时包含了和后面的任意指令流水的同步</span></span></code></pre></div><h2 id="编程示例" tabindex="-1">编程示例 <a class="header-anchor" href="#编程示例" aria-label="Permalink to &quot;编程示例&quot;">​</a></h2><p>内存管理与精细化同步完整示例：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &lt;cstdint&gt;</span></span>
<span class="line"><span>#include &quot;c_api/asc_simd.h&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>constexpr uint32_t C_API_ONE_BLOCK_SIZE = 32;</span></span>
<span class="line"><span>constexpr uint32_t C_API_ONE_REPEAT_BYTE_SIZE = 256;</span></span>
<span class="line"><span>constexpr uint32_t C_API_TOTAL_LENGTH = 16384;</span></span>
<span class="line"><span>constexpr uint32_t C_API_TILE_NUM = 8;</span></span>
<span class="line"><span>constexpr uint32_t C_API_TILE_LENGTH = 256;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>__vector__ __global__ __aicore__ void add_custom(__gm__ float* x, __gm__ float* y, __gm__ float* z)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    asc_init();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    uint32_t blockLength = C_API_TOTAL_LENGTH / asc_get_block_num();</span></span>
<span class="line"><span>    uint32_t tileLength = blockLength / C_API_TILE_NUM;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    __gm__ float* xGm = x + asc_get_block_idx() * blockLength;</span></span>
<span class="line"><span>    __gm__ float* yGm = y + asc_get_block_idx() * blockLength;</span></span>
<span class="line"><span>    __gm__ float* zGm = z + asc_get_block_idx() * blockLength;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    __ubuf__ float xLocal[C_API_TILE_LENGTH];</span></span>
<span class="line"><span>    __ubuf__ float yLocal[C_API_TILE_LENGTH];</span></span>
<span class="line"><span>    __ubuf__ float zLocal[C_API_TILE_LENGTH];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    uint16_t len_burst = tileLength;</span></span>
<span class="line"><span>    for (uint32_t i = 0; i &lt; C_API_TILE_NUM; i++) {</span></span>
<span class="line"><span>        if (i != 0) {</span></span>
<span class="line"><span>            asc_sync_wait(PIPE_V, PIPE_MTE2, EVENT_ID0);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        len_burst = tileLength * sizeof(float) / C_API_ONE_BLOCK_SIZE;</span></span>
<span class="line"><span>        asc_copy_gm2ub(xLocal, xGm + i * tileLength, 0, 1, len_burst, 0, 0);    </span></span>
<span class="line"><span>        asc_copy_gm2ub(yLocal, yGm + i * tileLength, 0, 1, len_burst, 0, 0);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        asc_sync_notify(PIPE_MTE2, PIPE_V, EVENT_ID0);</span></span>
<span class="line"><span>        asc_sync_wait(PIPE_MTE2, PIPE_V, EVENT_ID0);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (i != 0) {</span></span>
<span class="line"><span>            asc_sync_wait(PIPE_MTE3, PIPE_V, EVENT_ID0);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        asc_add(zLocal, xLocal, yLocal, tileLength * sizeof(float) / C_API_ONE_REPEAT_BYTE_SIZE, 1, 1, 1, 8, 8, 8);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (i != (C_API_TILE_NUM-1)) {</span></span>
<span class="line"><span>            asc_sync_notify(PIPE_V, PIPE_MTE2, EVENT_ID0);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        asc_sync_notify(PIPE_V, PIPE_MTE3, EVENT_ID0);</span></span>
<span class="line"><span>        asc_sync_wait(PIPE_V, PIPE_MTE3, EVENT_ID0);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        asc_copy_ub2gm(zGm + i * tileLength, zLocal, 0, 1, len_burst, 0, 0);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        if (i != (C_API_TILE_NUM-1)) {</span></span>
<span class="line"><span>            asc_sync_notify(PIPE_MTE3, PIPE_V, EVENT_ID0);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>内存管理与不感知流水类型的同步管理完整示例如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &lt;cstdint&gt;</span></span>
<span class="line"><span>#include &quot;c_api/asc_simd.h&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>constexpr uint32_t TILE_LENGTH = 2048;</span></span>
<span class="line"><span>constexpr uint32_t NUM_BLOCKS = 8;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>__vector__ __global__ __aicore__ void add_custom(__gm__ float* x, __gm__ float* y, __gm__ float* z)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    asc_init();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    uint32_t blockLength = NUM_BLOCKS * TILE_LENGTH / asc_get_block_num();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    __gm__ float* xGm = x + asc_get_block_idx() * blockLength;</span></span>
<span class="line"><span>    __gm__ float* yGm = y + asc_get_block_idx() * blockLength;</span></span>
<span class="line"><span>    __gm__ float* zGm = z + asc_get_block_idx() * blockLength;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    __ubuf__ float xLocal[TILE_LENGTH];</span></span>
<span class="line"><span>    __ubuf__ float yLocal[TILE_LENGTH];</span></span>
<span class="line"><span>    __ubuf__ float zLocal[TILE_LENGTH];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    asc_copy_gm2ub((__ubuf__ void*)xLocal, (__gm__ void*)xGm, blockLength * sizeof(float));</span></span>
<span class="line"><span>    asc_copy_gm2ub((__ubuf__ void*)yLocal, (__gm__ void*)yGm, blockLength * sizeof(float));</span></span>
<span class="line"><span>    asc_sync();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    asc_add(zLocal, xLocal, yLocal, blockLength);</span></span>
<span class="line"><span>    asc_sync();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    asc_copy_ub2gm((__gm__ void*)zGm, (__ubuf__ void*)zLocal, blockLength * sizeof(float));</span></span>
<span class="line"><span>    asc_sync();</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>内存管理与使用带同步能力的接口完整示例如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &lt;cstdint&gt;</span></span>
<span class="line"><span>#include &quot;c_api/asc_simd.h&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>constexpr uint32_t TILE_LENGTH = 2048;</span></span>
<span class="line"><span>constexpr uint32_t NUM_BLOCKS = 8;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>__vector__ __global__ __aicore__ void add_custom(__gm__ float* x, __gm__ float* y, __gm__ float* z)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    asc_init();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    __ubuf__ float xLocal[TILE_LENGTH];</span></span>
<span class="line"><span>    __ubuf__ float yLocal[TILE_LENGTH];</span></span>
<span class="line"><span>    __ubuf__ float zLocal[TILE_LENGTH];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    uint32_t blockLength = TILE_LENGTH * NUM_BLOCKS / asc_get_block_num();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    asc_copy_gm2ub_sync((__ubuf__ void*)xLocal, (__gm__ void*)(x + asc_get_block_idx() * blockLength), blockLength * sizeof(float));</span></span>
<span class="line"><span>    asc_copy_gm2ub_sync((__ubuf__ void*)yLocal, (__gm__ void*)(y + asc_get_block_idx() * blockLength), blockLength * sizeof(float));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    asc_add_sync(zLocal, xLocal, yLocal, blockLength);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    asc_copy_ub2gm_sync((__gm__ void*)(z + asc_get_block_idx() * blockLength), (__ubuf__ void*)zLocal, blockLength * sizeof(float));</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>内存管理、Reg矢量计算与精细化同步完整示例：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &lt;cstdint&gt;</span></span>
<span class="line"><span>#include &quot;c_api/asc_simd.h&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>onstexpr uint32_t TILE_LENGTH = 2048;</span></span>
<span class="line"><span>constexpr uint32_t NUM_BLOCKS = 8;</span></span>
<span class="line"><span>constexpr uint32_t BLK_NUM = 1;</span></span>
<span class="line"><span>constexpr uint32_t MASK = 32;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>__simd_vf__ inline void AddVF(uint16_t rep, uint16_t one_rep_size, uint32_t blockLength, __ubuf__ float* xLocal, __ubuf__ float* yLocal, __ubuf__ float* zLocal)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    vector_bool vmask;</span></span>
<span class="line"><span>    vector_float reg_src0;</span></span>
<span class="line"><span>    vector_float reg_src1;</span></span>
<span class="line"><span>    vector_float reg_dst;</span></span>
<span class="line"><span>    uint32_t remaining = blockLength;</span></span>
<span class="line"><span>    for (uint16_t i = 0; i &lt; rep; ++i) {</span></span>
<span class="line"><span>        vmask = asc_update_mask_b32(remaining);</span></span>
<span class="line"><span>        asc_loadalign(reg_src0, xLocal + i * one_rep_size);</span></span>
<span class="line"><span>        asc_loadalign(reg_src1, yLocal + i * one_rep_size);    </span></span>
<span class="line"><span>        asc_add(reg_dst, reg_src0, reg_src1, vmask);</span></span>
<span class="line"><span>        asc_storealign(zLocal + i * one_rep_size, reg_dst, vmask);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>__vector__ __global__ __aicore__ void add_custom(__gm__ float* x, __gm__ float* y, __gm__ float* z)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    asc_init();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    uint32_t blockLength = TILE_LENGTH * NUM_BLOCKS / asc_get_block_num();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    __gm__ float* xGm = x + get_block_idx() * blockLength;</span></span>
<span class="line"><span>    __gm__ float* yGm = y + get_block_idx() * blockLength;</span></span>
<span class="line"><span>    __gm__ float* zGm = z + get_block_idx() * blockLength;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    __ubuf__ float xLocal[TILE_LENGTH];</span></span>
<span class="line"><span>    __ubuf__ float yLocal[TILE_LENGTH];</span></span>
<span class="line"><span>    __ubuf__ float zLocal[TILE_LENGTH];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    const uint8_t cacheMode0 = static_cast&lt;uint8_t&gt;(((uint64_t)xGm) &gt;&gt; 60);</span></span>
<span class="line"><span>    const uint8_t cacheMode1 = static_cast&lt;uint8_t&gt;(((uint64_t)yGm) &gt;&gt; 60);</span></span>
<span class="line"><span>    const uint8_t cacheMode2 = static_cast&lt;uint8_t&gt;(((uint64_t)zGm) &gt;&gt; 60);</span></span>
<span class="line"><span>    uint32_t burstLength = blockLength * 32;</span></span>
<span class="line"><span>    uint64_t srcStride = burstLength;</span></span>
<span class="line"><span>    uint32_t dstStride = (burstLength + 31) / 32 * 32;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    asc_copy_gm2ub_align((__ubuf__ float*)xLocal, xGm, BLK_NUM, burstLength, 0, 0, true, cacheMode0, srcStride, dstStride);</span></span>
<span class="line"><span>    asc_copy_gm2ub_align((__ubuf__ float*)yLocal, yGm, BLK_NUM, burstLength, 0, 0, true, cacheMode1, srcStride, dstStride);</span></span>
<span class="line"><span>    asc_sync_notify(PIPE_MTE2, PIPE_V, EVENT_ID0);</span></span>
<span class="line"><span>    asc_sync_wait(PIPE_MTE2, PIPE_V, EVENT_ID0);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    uint16_t mask_bit_size = 256;</span></span>
<span class="line"><span>    uint16_t one_rep_size = mask_bit_size / sizeof(float);</span></span>
<span class="line"><span>    uint16_t rep = (blockLength + one_rep_size - 1) / one_rep_size;</span></span>
<span class="line"><span>    asc_vf_call&lt;AddVF&gt;(rep, one_rep_size, blockLength, (__ubuf__ float*)xLocal, (__ubuf__ float*)yLocal, (__ubuf__ float*)zLocal );</span></span>
<span class="line"><span>    asc_sync_notify(PIPE_V, PIPE_MTE3, EVENT_ID0);</span></span>
<span class="line"><span>    asc_sync_wait(PIPE_V, PIPE_MTE3, EVENT_ID0);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    asc_copy_ub2gm_align(zGm, (__ubuf__ float*)zLocal, BLK_NUM, burstLength, cacheMode2, srcStride, dstStride);</span></span>
<span class="line"><span>}</span></span></code></pre></div>`,30)])])}const r=n(p,[["render",o]]);export{d as __pageData,r as default};
