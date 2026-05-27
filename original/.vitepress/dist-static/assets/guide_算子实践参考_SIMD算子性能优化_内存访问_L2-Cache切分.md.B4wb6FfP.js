import{c as s,Q as a,j as p,m as e}from"./chunks/framework.DOi4mjdC.js";const l="/assets/%E6%9C%AA%E4%BD%BF%E8%83%BDL2-Cache%E5%88%87%E5%88%86.BY-VBjIk.png",i="/assets/%E4%BD%BF%E8%83%BDL2-Cache%E5%88%87%E5%88%86.DyyvDkUS.png",C=JSON.parse('{"title":"L2 Cache切分","description":"","frontmatter":{},"headers":[{"level":1,"title":"L2 Cache切分","slug":"l2-cache切分"}],"relativePath":"guide/算子实践参考/SIMD算子性能优化/内存访问/L2-Cache切分.md","filePath":"guide/算子实践参考/SIMD算子性能优化/内存访问/L2-Cache切分.md"}'),c={name:"guide/算子实践参考/SIMD算子性能优化/内存访问/L2-Cache切分.md"};function t(o,n,_,L,r,u){return a(),p("div",null,[...n[0]||(n[0]=[e('<h1 id="l2-cache切分" tabindex="-1">L2 Cache切分 <a class="header-anchor" href="#l2-cache切分" aria-label="Permalink to &quot;L2 Cache切分&quot;">​</a></h1><p>【优先级】：高</p><p>【描述】假设，AI处理器的L2 Cache大小为192MB，L2 Cache读写混合带宽约为7TB/s，而GM的带宽约为1.6TB/s，两者之间存在较大差距。搬入或搬出相同数据量的情况下，访问L2 Cache读写数据比GM更快。若数据无法命中L2 Cache，即需要访问的数据不在L2 Cache内，导致需要去GM上读写，带宽利用效率较低，最终算子搬入或搬出数据变为算子整个运行过程的性能瓶颈。切分策略建议：当输入和输出数据的数据量超过L2 Cache大小时，Tiling中使能L2 Cache切分策略。</p><p>【反例】</p><p>假设输入数据大小为InputTotalSize，L2 Cache大小为L2CacheSize，InputTotalSize = L2CacheSize * 2，总核数为20个核，数据未切分，整体一次完成计算。假设20个核一次可以处理共L2CacheSize的数据，则每个核至少两次读取输入数据。</p><p><strong>图 1</strong> 未使能L2 Cache切分<br><img src="'+l+`" alt="" title="未使能L2-Cache切分"></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>constexpr int32_t TOTAL_LENGTH = InputTotalSize / sizeof(half);</span></span>
<span class="line"><span>constexpr int32_t USE_CORE_NUM = 20;</span></span>
<span class="line"><span>constexpr int32_t TILE_NUM = 2;</span></span>
<span class="line"><span>constexpr int32_t BLOCK_LENGTH = TOTAL_LENGTH / USE_CORE_NUM;</span></span>
<span class="line"><span>constexpr int32_t TILE_LENGTH = BLOCK_LENGTH / TILE_NUM;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class KernelSample {</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    __aicore__ inline KernelSample() {}</span></span>
<span class="line"><span>    __aicore__ inline void Init(GM_ADDR x)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        xGm.SetGlobalBuffer((__gm__ half*)x + BLOCK_LENGTH * GetBlockIdx(), BLOCK_LENGTH);</span></span>
<span class="line"><span>        yGm.SetGlobalBuffer((__gm__ half*)y + BLOCK_LENGTH * GetBlockIdx(), BLOCK_LENGTH);</span></span>
<span class="line"><span>        pipe.InitBuffer(inQueueX, 1, BLOCK_LENGTH * sizeof(half));</span></span>
<span class="line"><span>        pipe.InitBuffer(inQueueY, 1, BLOCK_LENGTH * sizeof(half));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void Process()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        // 示例演示对输入数据加2的运算</span></span>
<span class="line"><span>        constexpr int32_t loopCount = 2;</span></span>
<span class="line"><span>        for (int32_t i = 0; i &lt; loopCount; i++) {</span></span>
<span class="line"><span>            // 外层的每次循环对输入数据进行加1的运算</span></span>
<span class="line"><span>            for (int32_t j = 0; j &lt; TILE_NUM; j++) {</span></span>
<span class="line"><span>                // 内层循环分别处理每个核第0块和第1块数据</span></span>
<span class="line"><span>                CopyIn(j);</span></span>
<span class="line"><span>                Compute();</span></span>
<span class="line"><span>                CopyOut(j);</span></span>
<span class="line"><span>            }</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>private:</span></span>
<span class="line"><span>    __aicore__ inline void CopyIn(int32_t process)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        LocalTensor&lt;half&gt; xLocal = inQueueX.AllocTensor&lt;half&gt;();</span></span>
<span class="line"><span>        // 对于每个核，除了首次读取外，读取第0块数据时，L2 Cache内缓存的是第1块数据；</span></span>
<span class="line"><span>        // 对于每个核，读取第1块数据时，L2 Cache内缓存的是第0块数据；</span></span>
<span class="line"><span>        // 每个核需要4次读取GM上的数据</span></span>
<span class="line"><span>        DataCopy(xLocal, xGm[process * TILE_LENGTH], TILE_LENGTH );</span></span>
<span class="line"><span>        inQueueX.EnQue(xLocal);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void Compute()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        LocalTensor&lt;half&gt; yLocal = inQueueY.AllocTensor&lt;half&gt;();</span></span>
<span class="line"><span>        LocalTensor&lt;half&gt; xLocal = inQueueX.DeQue&lt;half&gt;();</span></span>
<span class="line"><span>        Adds(yLocal, xLocal, 1, TILE_LENGTH);   </span></span>
<span class="line"><span>        inQueueY.EnQue&lt;half&gt;(yLocal);</span></span>
<span class="line"><span>        inQueueX.FreeTensor(xLocal);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void CopyOut(int32_t process)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        LocalTensor&lt;half&gt; yLocal = inQueueY.DeQue&lt;half&gt;();</span></span>
<span class="line"><span>        DataCopy(yGm[process * TILE_LENGTH], yLocal, TILE_LENGTH);</span></span>
<span class="line"><span>        inQueueY.FreeTensor(yLocal);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>...</span></span></code></pre></div><p>【正例】</p><p>假设输入数据大小为InputTotalSize，L2 Cache大小为L2CacheSize，InputTotalSize = L2CacheSize * 2，能使用的总核数为20个核，输入数据均等切分成2份数据，则整体分两次进行计算，每次的计算量为L2CacheSize，第一次20个核先计算前L2CacheSize个数据，第二次20个核计算后L2CacheSize个数据。每次计算前读取的数据能够命中L2 Cache，提升算子性能。</p><p><strong>图 2</strong> 使能L2 Cache切分<br><img src="`+i+`" alt="" title="使能L2-Cache切分"></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>constexpr int32_t TOTAL_LENGTH = InputTotalSize / sizeof(half);</span></span>
<span class="line"><span>constexpr int32_t TILE_NUM = 2;</span></span>
<span class="line"><span>constexpr int32_t USE_CORE_NUM = 20;</span></span>
<span class="line"><span>constexpr int32_t TILE_LENGTH = TOTAL_LENGTH / TILE_NUM;</span></span>
<span class="line"><span>constexpr int32_t BLOCK_LENGTH = TILE_LENGTH / USE_CORE_NUM;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>class KernelSample {</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    __aicore__ inline KernelSample() {}</span></span>
<span class="line"><span>    __aicore__ inline void Init(GM_ADDR x, GM_ADDR y, int32_t index)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        xGm.SetGlobalBuffer((__gm__ half*)x + BLOCK_LENGTH * GetBlockIdx() + index * TILE_LENGTH, BLOCK_LENGTH);</span></span>
<span class="line"><span>        yGm.SetGlobalBuffer((__gm__ half*)y + BLOCK_LENGTH * GetBlockIdx() + index * TILE_LENGTH, BLOCK_LENGTH);</span></span>
<span class="line"><span>        pipe.InitBuffer(inQueueX, 1, BLOCK_LENGTH * sizeof(half));</span></span>
<span class="line"><span>        pipe.InitBuffer(inQueueY, 1, BLOCK_LENGTH * sizeof(half));</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void Process()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        // 示例演示对输入数据加2的运算</span></span>
<span class="line"><span>        constexpr int32_t loopCount = 2;</span></span>
<span class="line"><span>        for (int32_t i = 0; i &lt; loopCount; i++) {</span></span>
<span class="line"><span>            // 每次循环对输入数据进行加1的运算</span></span>
<span class="line"><span>            CopyIn();</span></span>
<span class="line"><span>            Compute();</span></span>
<span class="line"><span>            CopyOut();</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>private:</span></span>
<span class="line"><span>    __aicore__ inline void CopyIn()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        LocalTensor&lt;half&gt; xLocal = inQueueX.AllocTensor&lt;half&gt;();</span></span>
<span class="line"><span>        // 对于每个核，除了首次读取外，第二次读取可以命中L2 Cache；</span></span>
<span class="line"><span>        // 每个核2次读取GM上的数据，2次访问L2 Cache读数据</span></span>
<span class="line"><span>        DataCopy(xLocal, xGm, BLOCK_LENGTH );</span></span>
<span class="line"><span>        inQueueX.EnQue(xLocal);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void Compute()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        LocalTensor&lt;half&gt; yLocal = inQueueY.AllocTensor&lt;half&gt;();</span></span>
<span class="line"><span>        LocalTensor&lt;half&gt; xLocal = inQueueX.DeQue&lt;half&gt;();</span></span>
<span class="line"><span>        Adds(yLocal, xLocal, 1, BLOCK_LENGTH);   </span></span>
<span class="line"><span>        inQueueY.EnQue&lt;half&gt;(yLocal);</span></span>
<span class="line"><span>        inQueueX.FreeTensor(xLocal);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void CopyOut()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        LocalTensor&lt;half&gt; yLocal = inQueueY.DeQue&lt;half&gt;();</span></span>
<span class="line"><span>        DataCopy(yGm, yLocal, BLOCK_LENGTH);</span></span>
<span class="line"><span>        inQueueY.FreeTensor(yLocal);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>extern &quot;C&quot; __global__ __aicore__ void simple_kernel(__gm__ uint8_t* srcGm, __gm__ uint8_t* dstGm)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    AscendC::KernelSample op;</span></span>
<span class="line"><span>    // 输入数据均等切分成2份数据进行计算</span></span>
<span class="line"><span>    for (int32_t i = 0; i &lt; TILE_NUM; i++) {</span></span>
<span class="line"><span>        op.Init(srcGm, dstGm, i);</span></span>
<span class="line"><span>        op.Process();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>...</span></span></code></pre></div><p>更多完整样例请参考<a href="https://gitcode.com/cann/asc-devkit/tree/master/examples/01_simd_cpp_api/03_libraries/00_matrix/matmul_l2cache" target="_blank" rel="noreferrer">L2 Cache切分的算子样例</a>。</p>`,12)])])}const T=s(c,[["render",t]]);export{C as __pageData,T as default};
