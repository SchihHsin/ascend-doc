import{c as n,Q as a,j as e,m as t}from"./chunks/framework.DOi4mjdC.js";const m=JSON.parse('{"title":"TSCM简介","description":"","frontmatter":{},"headers":[{"level":1,"title":"TSCM简介","slug":"tscm简介"}],"relativePath":"api/SIMD-API/基础API/资源管理/Pipe和Que框架/TSCM/TSCM简介.md","filePath":"api/SIMD-API/基础API/资源管理/Pipe和Que框架/TSCM/TSCM简介.md"}'),l={name:"api/SIMD-API/基础API/资源管理/Pipe和Que框架/TSCM/TSCM简介.md"};function p(o,s,i,c,u,r){return a(),e("div",null,[...s[0]||(s[0]=[t(`<h1 id="tscm简介" tabindex="-1">TSCM简介 <a class="header-anchor" href="#tscm简介" aria-label="Permalink to &quot;TSCM简介&quot;">​</a></h1><p>Vector和Cube之间通过队列（Queue）完成任务间通信和同步。TSCM是数据通路的目的地在TSCM Position时，用来管理执行队列相关操作、相关资源的数据结构。TSCM与TQueBind，TQue属于相同类型结构。TSCM定义如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>template &lt;TPosition pos, int32_t depth, auto mask = 0&gt;</span></span>
<span class="line"><span>using TSCM = TQueBind&lt;pos, TPosition::TSCM, depth, mask&gt;;</span></span></code></pre></div><p><strong>表 1</strong> 模板参数介绍</p><table tabindex="0"><thead><tr><th>参数名称</th><th>含义</th></tr></thead><tbody><tr><td>pos</td><td>队列逻辑位置，可以为VECIN、GM。关于TPosition的具体介绍请参考TPosition。</td></tr><tr><td>depth</td><td>队列的深度表示该队列可以连续进行入队/出队的次数，在代码运行时，对同一个队列有n次连续的EnQue（中间没有DeQue），那么该队列的深度就需要设置为n。 注意，这里的队列深度和double buffer无关，队列机制用于实现流水线并行，double buffer在此基础上进一步提高流水线的利用率。即使队列的深度为1，仍可以开启double buffer。 队列的深度设置为1时，编译器对这种场景做了特殊优化，性能通常更好，推荐设置为1。 如下样例中队列没有连续入队，队列的深度设置为1。&lt;pre class=&quot;screen&quot; codetype=&quot;Cpp&quot; id=&quot;screen17724335125812&quot;&gt;a1 = que.AllocTensor(); que.EnQue(a1); a1 = que.DeQue(); que.FreeTensor(a1);&lt;/pre&gt; 如下样例中队列连续2次入队，队列的深度应设置为2，仅在极少数preload场景（比如连续搬入两份数据，计算处理一份，完成后再搬入一份，然后计算处理提前搬入的一份...）可能会使用。其他情况下均不推荐depth &gt;= 2 。&lt;pre class=&quot;screen&quot; codetype=&quot;Cpp&quot; id=&quot;screen11973229582&quot;&gt;a1 = que.AllocTensor(); a2 = que.AllocTensor(); que.EnQue(a1); que.EnQue(a2); a1 = que.DeQue(); a2 = que.DeQue(); que.FreeTensor(a1); que.FreeTensor(a2);&lt;/pre&gt;</td></tr><tr><td>mask</td><td>mask是int类型时，采用比特位表达信息：bit 0位为预留参数。bit 1位为预留参数。bit 2位为0时，VECTOR0与VECTOR1映射到CUBE上的内存位置错开，为1时，VECTOR0与VECTOR1映射到CUBE上的内存位置相同。 mask是const TQueConfig*类型时，TQueConfig结构定义和参数说明如下。&lt;pre class=&quot;screen&quot; codetype=&quot;Cpp&quot; id=&quot;screen13896155731115&quot;&gt;struct TQueConfig { bool nd2nz = false; // 不支持，默认为false bool nz2nd = false; // 不支持，默认为false bool scmBlockGroup = false; // tscm相关参数，为false，VECTOR0与VECTOR1映射到CUBE上的内存位置错开，为true时，VECTOR0与VECTOR1映射到CUBE上的内存位置相同。 uint32_t bufferLen = 0; // 与InitBuffer时输入的len参数保持一致，可以在编译期做性能优化，传0表示在InitBuffer时做资源分配。 uint32_t bufferNumber = 0; // 与InitBuffer时输入的num参数保持一致，可以在编译期做性能优化，传0表示在InitBuffer时做资源分配。 uint32_t consumerSize = 0; // 预留参数 TPosition consumer[8] = {}; // 预留参数 bool enableStaticEvtId = false; // 预留参数 bool enableLoopQueue = false; // 预留参数 };&lt;/pre&gt;</td></tr></tbody></table><div class="note custom-block github-alert"><p class="custom-block-title">说明</p><p></p><ul><li>TSCM通过using定义TSCM为TQueBind目的地址为TSCM Position时的别名。</li><li>支持AllocTensor/EnQue/DeQue/FreeTensor接口。必须严格按照AllocTensor-&gt;EnQue-&gt;DeQue-&gt;FreeTensor的操作执行完整的生命周期，且配对使用。</li><li>但TSCM并不需要支持TQueBind的所有接口。不支持VacantInQue/HasTensorInQue/GetTensorCountInQue/HasIdleBuffer。</li><li>由于TSCM分配的Buffer中存储着同步事件eventID，且该结构伴随着与Cube类高阶API如（Matmul高阶API，宏函数调用方式)共同使用，故同一个TPosition上TSCM Buffer的数量与硬件的同步事件eventID以及Matmul对象数量有关。 <strong>TSCM从VECIN发起的Buffer块数量与Matmul对象数量之和最大为10个。</strong><strong>不允许申请的TSCM Buffer超出规格限制，超出规格可能会引起未定义行为。</strong></li></ul></div><p>如下是一个简单的使用示例：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>TSCM&lt;TPosition::VECIN, 1&gt; tscm;</span></span>
<span class="line"><span>for () {</span></span>
<span class="line"><span>    auto scmTensor = tscm.AllocTensor&lt;float&gt;(); // 在搬运数据从UB-&gt;TSCM前分配Buffer</span></span>
<span class="line"><span>    DataCopy(scmTensor, ubLocal, 1024); // 将UB数据搬运至TSCM，准备用于Matmul计算</span></span>
<span class="line"><span>    tscm.EnQue(scmTensor); //搬运完成在Matmul计算前，EnQue/DeQue</span></span>
<span class="line"><span>    LocalTensor&lt;float&gt; scmLocal = tscm.DeQue&lt;float&gt;();</span></span>
<span class="line"><span>    mm.SetTensorA(scmLocal);</span></span>
<span class="line"><span>    mm.SetTensorB(gm_b);</span></span>
<span class="line"><span>    mm.IterateAll(gm_c);</span></span>
<span class="line"><span>    tscm.FreeTensor(scmLocal); // Matmul计算完成后，释放tensor</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>与高阶API Matmul配合使用，调用示例如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>{</span></span>
<span class="line"><span>    typedef matmul::MatmulType&lt;AscendC::TPosition::TSCM, CubeFormat::NZ, half, true, LayoutMode::NONE, false, AscendC::TPosition::VECIN&gt; A_TYPE;</span></span>
<span class="line"><span>    typedef matmul::MatmulType&lt;AscendC::TPosition::GM, CubeFormat::ND, half&gt; B_TYPE;</span></span>
<span class="line"><span>    typedef matmul::MatmulType&lt;AscendC::TPosition::GM, CubeFormat::ND, float&gt; C_TYPE;</span></span>
<span class="line"><span>    typedef matmul::MatmulType&lt;AscendC::TPosition::GM, CubeFormat::ND, float&gt; BIAS_TYPE; </span></span>
<span class="line"><span>    matmul::Matmul&lt;A_TYPE, B_TYPE, C_TYPE, BIAS_TYPE&gt; mm1;</span></span>
<span class="line"><span>    constexpr uint32_t M = 32;</span></span>
<span class="line"><span>    constexpr uint32_t N = 32;</span></span>
<span class="line"><span>    constexpr uint32_t K = 32;</span></span>
<span class="line"><span>    AscendC::GlobalTensor&lt;half&gt; aGlobal;</span></span>
<span class="line"><span>    AscendC::GlobalTensor&lt;half&gt; bGlobal;</span></span>
<span class="line"><span>    AscendC::GlobalTensor&lt;float&gt; cGlobal;</span></span>
<span class="line"><span>    AscendC::GlobalTensor&lt;float&gt; biasGlobal;</span></span>
<span class="line"><span>    aGlobal.SetGlobalBuffer(reinterpret_cast&lt;__gm__ half *&gt;(aGM), M * K);</span></span>
<span class="line"><span>    bGlobal.SetGlobalBuffer(reinterpret_cast&lt;__gm__ half *&gt;(bGM), K * N);</span></span>
<span class="line"><span>    cGlobal.SetGlobalBuffer(reinterpret_cast&lt;__gm__ float *&gt;(cGM), M * N);</span></span>
<span class="line"><span>    TCubeTiling tiling;</span></span>
<span class="line"><span>    AscendC::TPipe pipe;</span></span>
<span class="line"><span>    AscendC::TSCM&lt;AscendC::TPosition::VECIN, 1&gt; scm;</span></span>
<span class="line"><span>    AscendC::TQue&lt;AscendC::TPosition::VECIN, 1&gt; qIn;</span></span>
<span class="line"><span>    pipe.InitBuffer(scm, 1, M * K * sizeof(half));</span></span>
<span class="line"><span>    pipe.InitBuffer(qIn, 1, M * K * sizeof(half));</span></span>
<span class="line"><span>    REGIST_MATMUL_OBJ(&amp;pipe, workspaceGM, mm1, &amp;tiling);</span></span>
<span class="line"><span>    auto scmTensor = scm.AllocTensor&lt;half&gt;();</span></span>
<span class="line"><span>    auto ubTensor = qIn.AllocTensor&lt;half&gt;();</span></span>
<span class="line"><span>    AscendC::Nd2NzParams intriParams;</span></span>
<span class="line"><span>    DataCopy(ubTensor, aGlobal, M * K);</span></span>
<span class="line"><span>    qIn.EnQue(ubTensor);</span></span>
<span class="line"><span>    AscendC::LocalTensor&lt;half&gt; ubLocal = qIn.DeQue&lt;half&gt;();</span></span>
<span class="line"><span>    AscendC::DataCopy(scmTensor, ubLocal, intriParams);</span></span>
<span class="line"><span>    scm.EnQue(scmTensor);</span></span>
<span class="line"><span>    AscendC::LocalTensor&lt;half&gt; scmLocal = scm.DeQue&lt;half&gt;();</span></span>
<span class="line"><span>    mm1.SetTensorA(scmLocal);</span></span>
<span class="line"><span>    mm1.SetTensorB(bGlobal);</span></span>
<span class="line"><span>    mm1.IterateAll(cGlobal);</span></span>
<span class="line"><span>    scm.FreeTensor(scmLocal);</span></span>
<span class="line"><span>    qIn.FreeTensor(ubLocal);</span></span>
<span class="line"><span>}</span></span></code></pre></div>`,10)])])}const d=n(l,[["render",p]]);export{m as __pageData,d as default};
