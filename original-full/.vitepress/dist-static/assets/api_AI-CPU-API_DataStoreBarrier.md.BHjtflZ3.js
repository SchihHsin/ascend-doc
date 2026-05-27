import{c as n,Q as s,j as e,m as t}from"./chunks/framework.DOi4mjdC.js";const g=JSON.parse('{"title":"DataStoreBarrier","description":"","frontmatter":{},"headers":[{"level":1,"title":"DataStoreBarrier","slug":"datastorebarrier"},{"level":2,"title":"产品支持情况","slug":"产品支持情况"},{"level":2,"title":"功能说明","slug":"功能说明"},{"level":2,"title":"需要包含的头文件","slug":"需要包含的头文件"},{"level":2,"title":"函数原型","slug":"函数原型"},{"level":2,"title":"参数说明","slug":"参数说明"},{"level":2,"title":"返回值说明","slug":"返回值说明"},{"level":2,"title":"约束说明","slug":"约束说明"},{"level":2,"title":"调用示例","slug":"调用示例"}],"relativePath":"api/AI-CPU-API/DataStoreBarrier.md","filePath":"api/AI-CPU-API/DataStoreBarrier.md"}'),l={name:"api/AI-CPU-API/DataStoreBarrier.md"};function p(i,a,r,c,o,d){return s(),e("div",null,[...a[0]||(a[0]=[t(`<h1 id="datastorebarrier" tabindex="-1">DataStoreBarrier <a class="header-anchor" href="#datastorebarrier" aria-label="Permalink to &quot;DataStoreBarrier&quot;">​</a></h1><h2 id="产品支持情况" tabindex="-1">产品支持情况 <a class="header-anchor" href="#产品支持情况" aria-label="Permalink to &quot;产品支持情况&quot;">​</a></h2><table tabindex="0"><thead><tr><th>产品</th><th>是否支持</th></tr></thead><tbody><tr><td>Ascend 950PR/Ascend 950DT</td><td>√</td></tr><tr><td>Atlas A3 训练系列产品/Atlas A3 推理系列产品</td><td>√</td></tr><tr><td>Atlas A2 训练系列产品/Atlas A2 推理系列产品</td><td>√</td></tr><tr><td>Atlas 200I/500 A2 推理产品</td><td>x</td></tr><tr><td>Atlas 推理系列产品AI Core</td><td>x</td></tr><tr><td>Atlas 推理系列产品Vector Core</td><td>x</td></tr><tr><td>Atlas 训练系列产品</td><td>x</td></tr></tbody></table><h2 id="功能说明" tabindex="-1">功能说明 <a class="header-anchor" href="#功能说明" aria-label="Permalink to &quot;功能说明&quot;">​</a></h2><p>数据同步屏障指令，该指令会阻塞当前线程执行，确保所有先前的写内存操作完成并对其它硬件单元可见后，才继续执行后续指令。用于AI CPU与AI Core多核之间的数据一致性。</p><h2 id="需要包含的头文件" tabindex="-1">需要包含的头文件 <a class="header-anchor" href="#需要包含的头文件" aria-label="Permalink to &quot;需要包含的头文件&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &quot;aicpu_api.h&quot;</span></span></code></pre></div><h2 id="函数原型" tabindex="-1">函数原型 <a class="header-anchor" href="#函数原型" aria-label="Permalink to &quot;函数原型&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>DataStoreBarrier(void)</span></span></code></pre></div><h2 id="参数说明" tabindex="-1">参数说明 <a class="header-anchor" href="#参数说明" aria-label="Permalink to &quot;参数说明&quot;">​</a></h2><p>无</p><h2 id="返回值说明" tabindex="-1">返回值说明 <a class="header-anchor" href="#返回值说明" aria-label="Permalink to &quot;返回值说明&quot;">​</a></h2><p>无</p><h2 id="约束说明" tabindex="-1">约束说明 <a class="header-anchor" href="#约束说明" aria-label="Permalink to &quot;约束说明&quot;">​</a></h2><ul><li>该接口仅支持通过&lt;&lt;&lt;...&gt;&gt;&gt;调用，并在异构编译场景使用。</li></ul><h2 id="调用示例" tabindex="-1">调用示例 <a class="header-anchor" href="#调用示例" aria-label="Permalink to &quot;调用示例&quot;">​</a></h2><p>在AI CPU算子Kernel侧实现代码中调用AscendC::DataStoreBarrier()，确保AI CPU算子对Tiling数据的修改写入内存，使得AI Core算子能够正确读取Tiling数据：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct TilingInfo {</span></span>
<span class="line"><span>    uint64_t lock; // AI CPU/AI Core之间同步的锁</span></span>
<span class="line"><span>    int8_t type;</span></span>
<span class="line"><span>    int8_t mode;</span></span>
<span class="line"><span>    int8_t len;</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span>struct KernelArgs {</span></span>
<span class="line"><span>    uint32_t *xDevice;</span></span>
<span class="line"><span>    uint32_t *yDevice;</span></span>
<span class="line"><span>    uint32_t *zDevice;</span></span>
<span class="line"><span>    TilingInfo *ti; // 与AI Core共享的参数，用于同步tiling选择</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>template&lt;typename T, int8_t mode, int8_t len&gt;</span></span>
<span class="line"><span>__aicore__ void hello_world_impl(GM_ADDR m)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    if constexpr (std::is_same_v&lt;T, float&gt;) {</span></span>
<span class="line"><span>       AscendC::printf(&quot;Hello World: float mode %u len %u.\\n&quot;, mode, len);</span></span>
<span class="line"><span>    } else if constexpr (std::is_same_v&lt;T, int&gt;) {</span></span>
<span class="line"><span>       AscendC::printf(&quot;Hello World: int mode %u len %u.\\n&quot;, mode, len);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// AI Core算子总入口</span></span>
<span class="line"><span>// tilingInfo: 和AI CPU算子共同传递的参数，用于数据共享</span></span>
<span class="line"><span>template&lt;typename T, int8_t mode, int8_t len&gt;</span></span>
<span class="line"><span>__mix__(1,2) __global__ __aicore__ void hello_world(GM_ADDR m, GM_ADDR TilingPtr)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>     __gm__ struct KernelInfo::TilingInfo *ti = (__gm__ struct KernelInfo::TilingInfo *)TilingPtr;</span></span>
<span class="line"><span>    AscendC::GlobalTensor&lt;uint64_t&gt; lock;</span></span>
<span class="line"><span>    lock.SetGlobalBuffer(reinterpret_cast&lt;__gm__ uint64_t *&gt;(&amp;ti-&gt;lock));</span></span>
<span class="line"><span>    if ASCEND_IS_AIV {</span></span>
<span class="line"><span>        if (AscendC::GetBlockIdx() == 0) {</span></span>
<span class="line"><span>            while (*reinterpret_cast&lt;volatile __gm__ uint64_t*&gt;(lock.GetPhyAddr(0)) == 0) {   // 下沉模式，AI Core等待AICPU tiling计算完成</span></span>
<span class="line"><span>                AscendC::DataCacheCleanAndInvalid&lt;uint64_t, AscendC::CacheLine::SINGLE_CACHE_LINE,</span></span>
<span class="line"><span>                    AscendC::DcciDst::CACHELINE_OUT&gt;(lock);    //直接访问Global Memory，获取最新数据</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    // 上面是1个核等待AI CPU tiling计算完成，这里进行核间同步</span></span>
<span class="line"><span>    AscendC::SyncAll&lt;false&gt;();</span></span>
<span class="line"><span>    // 根据tiling参数值选择不同模板</span></span>
<span class="line"><span>    if (ti-&gt;type ==0 &amp;&amp; ti-&gt;mode == 1 &amp;&amp; ti-&gt;len == 2) {</span></span>
<span class="line"><span>        hello_world_impl&lt;float, 1, 2&gt;(m);</span></span>
<span class="line"><span>    } else if (ti-&gt;type == 1 &amp;&amp; ti-&gt;mode == 2 &amp;&amp; ti-&gt;len == 4) {</span></span>
<span class="line"><span>        hello_world_impl&lt;int, 2, 4&gt;(m);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    // 执行完留一个核释放lock</span></span>
<span class="line"><span>    if ASCEND_IS_AIV {</span></span>
<span class="line"><span>        if (AscendC::GetBlockIdx() == 0) {</span></span>
<span class="line"><span>            lock.SetValue(0, 0);  // 刷新 lock</span></span>
<span class="line"><span>            AscendC::DataCacheCleanAndInvalid&lt;uint64_t, AscendC::CacheLine::SINGLE_CACHE_LINE,</span></span>
<span class="line"><span>                AscendC::DcciDst::CACHELINE_OUT&gt;(lock);    //刷新Dcache，同步与GM之间的数据</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>extern &quot;C&quot; __global__ __aicpu__ uint32_t MyAicpuKernel(void *arg)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    KernelArgs* cfg = (KernelArgs*)arg;</span></span>
<span class="line"><span>    AscendC::printf(&quot;MyAicpuKernel inited!\\n&quot;);</span></span>
<span class="line"><span>    cfg-&gt;ti-&gt;lock = 1;</span></span>
<span class="line"><span>    cfg-&gt;ti-&gt;type = 1;</span></span>
<span class="line"><span>    cfg-&gt;ti-&gt;mode = 2;</span></span>
<span class="line"><span>    cfg-&gt;ti-&gt;len = 4;</span></span>
<span class="line"><span>    AscendC::DataStoreBarrier(); // 对tilingInfo进行写同步</span></span>
<span class="line"><span>    AscendC::printf(&quot;MyAicpuKernel inited type %u mode %u len %u end!\\n&quot;, cfg-&gt;ti-&gt;type, cfg-&gt;ti-&gt;mode, cfg-&gt;ti-&gt;len);</span></span>
<span class="line"><span>    return 0;</span></span>
<span class="line"><span>}</span></span></code></pre></div>`,18)])])}const u=n(l,[["render",p]]);export{g as __pageData,u as default};
