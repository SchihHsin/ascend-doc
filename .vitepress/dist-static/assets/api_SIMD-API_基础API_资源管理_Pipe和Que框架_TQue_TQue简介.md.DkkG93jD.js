import{c as s,Q as e,j as a,m as p}from"./chunks/framework.DOi4mjdC.js";const t="/assets/enque.CKUq_Ne_.png",T=JSON.parse('{"title":"TQue简介","description":"","frontmatter":{},"headers":[{"level":1,"title":"TQue简介","slug":"tque简介"},{"level":2,"title":"模板参数","slug":"模板参数"},{"level":2,"title":"TQue Buffer限制","slug":"tque-buffer限制"},{"level":2,"title":"调用示例","slug":"调用示例"}],"relativePath":"api/SIMD-API/基础API/资源管理/Pipe和Que框架/TQue/TQue简介.md","filePath":"api/SIMD-API/基础API/资源管理/Pipe和Que框架/TQue/TQue简介.md"}'),l={name:"api/SIMD-API/基础API/资源管理/Pipe和Que框架/TQue/TQue简介.md"};function i(u,n,o,c,r,d){return e(),a("div",null,[...n[0]||(n[0]=[p('<h1 id="tque简介" tabindex="-1">TQue简介 <a class="header-anchor" href="#tque简介" aria-label="Permalink to &quot;TQue简介&quot;">​</a></h1><p>流水任务之间通过队列（Queue）完成任务间通信和同步。TQue是用来执行队列相关操作、管理相关资源的数据结构。TQue继承自TQueBind父类，继承关系如下：</p><p><img src="'+t+`" alt=""></p><h2 id="模板参数" tabindex="-1">模板参数 <a class="header-anchor" href="#模板参数" aria-label="Permalink to &quot;模板参数&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>template &lt;TPosition pos, int32_t depth, auto mask = 0&gt; class TQue{...};</span></span></code></pre></div><p><strong>表 1</strong> TQue模板参数介绍</p><table tabindex="0"><thead><tr><th>参数名称</th><th>含义</th></tr></thead><tbody><tr><td>pos</td><td>队列逻辑位置，可以为VECIN、VECOUT、A1、A2、B1、B2、CO1、CO2。关于TPosition的具体介绍请参考TPosition。</td></tr><tr><td>depth</td><td>队列的深度表示该队列可以连续进行入队/出队的次数，在代码运行时，对同一个队列有n次连续的EnQue（中间没有DeQue），那么该队列的深度就需要设置为n。 注意，这里的队列深度和double buffer无关，队列机制用于实现流水线并行，double buffer在此基础上进一步提高流水线的利用率。即使队列的深度为1，仍可以开启double buffer。 非Tensor原地操作的场景下，队列的深度设置为1时，编译器对这种场景做了特殊优化，性能通常更好，推荐设置为1。 Tensor原地操作的场景下，需要设置为0。 如下样例中队列没有连续入队，队列的深度设置为1。&lt;pre class=&quot;screen&quot; codetype=&quot;Cpp&quot; id=&quot;screen17724335125812&quot;&gt;a1 = que.AllocTensor(); que.EnQue(a1); a1 = que.DeQue(); que.FreeTensor(a1);&lt;/pre&gt; 如下样例中队列连续2次入队，队列的深度应设置为2，仅在极少数preload场景（比如连续搬入两份数据，计算处理一份，完成后再搬入一份，然后计算处理提前搬入的一份...）可能会使用。其他情况下均不推荐depth &gt;= 2 。&lt;pre class=&quot;screen&quot; codetype=&quot;Cpp&quot; id=&quot;screen11973229582&quot;&gt;a1 = que.AllocTensor(); a2 = que.AllocTensor(); que.EnQue(a1); que.EnQue(a2); a1 = que.DeQue(); a2 = que.DeQue(); que.FreeTensor(a1); que.FreeTensor(a2);&lt;/pre&gt;</td></tr><tr><td>mask</td><td>mask是int类型时，采用比特位表达信息：bit 0位为1表示，数据格式从ND转换为NZ，TPosition仅支持A1或B1；bit 1位为1表示，数据格式从NZ转换为ND，TPosition仅支持CO2。 支持的型号如下： Atlas 推理系列产品AI Core mask是const TQueConfig*类型时，TQueConfig结构定义和参数说明如下，调用示例见调用示例:&lt;pre class=&quot;screen&quot; codetype=&quot;Cpp&quot; id=&quot;screen13896155731115&quot;&gt;struct TQueConfig { bool nd2nz = false; // true代表数据格式从ND转换为NZ，仅支持TPosition为A1或B1，默认为false bool nz2nd = false; // true代表数据格式从NZ转换为ND，仅支持TPosition为CO2，默认为false bool scmBlockGroup = false; // TSCM相关参数，预留参数，默认为false uint32_t bufferLen = 0; // 与InitBuffer时输入的len参数保持一致，可以在编译期做性能优化，传0表示在InitBuffer时做资源分配。 uint32_t bufferNumber = 0; // 与InitBuffer时输入的num参数保持一致，可以在编译期做性能优化，传0表示在InitBuffer时做资源分配。 uint32_t consumerSize = 0; // 预留参数 TPosition consumer[8] = {}; // 预留参数 bool enableStaticEvtId = false; // 预留参数 bool enableLoopQueue = false; // 预留参数 };&lt;/pre&gt; 上述ND、NZ格式转换相关参数支持的型号如下： Atlas 推理系列产品AI Core</td></tr></tbody></table><h2 id="tque-buffer限制" tabindex="-1">TQue Buffer限制 <a class="header-anchor" href="#tque-buffer限制" aria-label="Permalink to &quot;TQue Buffer限制&quot;">​</a></h2><p>由于TQue分配的Buffer存储着同步事件eventID，故同一个TPosition上TQue Buffer的数量与硬件的同步事件eventID有关。</p><p>针对Atlas 训练系列产品，eventID的数量为4</p><p>Atlas 推理系列产品AI Core，eventID的数量为8</p><p>Atlas 推理系列产品Vector Core，eventID的数量为8</p><p>Atlas A2 训练系列产品/Atlas A2 推理系列产品，eventID的数量为8</p><p>Atlas A3 训练系列产品/Atlas A3 推理系列产品，eventID的数量为8</p><p>Atlas 200I/500 A2 推理产品，eventID的数量为8</p><p>QUE的Buffer数量最大也分别为8个或4个，即能插入的同步事件的个数为8个或4个。当用TPipe的InitBuffer申请TQue时，会受到Buffer数量的限制，TQue能申请到的最大个数分别为8个或4个。</p><p>如果同时使用的QUE Buffer超出限制，则无法再申请TQue。如果想要继续申请，可以调用FreeAllEvent接口来释放一些暂时不用的TQue。在使用完对应TQue后，用该接口释放对应队列中的所有事件，之后便可再次申请TQue。样例如下：</p><ul><li><p>不开启double buffer</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 能申请的VECIN position上的buffer数量最大为8。如果超出该限制，在后续使用AllocTensor/FreeTensor可能会出现分配资源失败。故当不开启double buffer时，此时最多能申请8个TQue。</span></span>
<span class="line"><span>AscendC::TPipe pipe;</span></span>
<span class="line"><span>int len = 1024;</span></span>
<span class="line"><span>AscendC::TQue&lt;AscendC::TPosition::VECIN, 1&gt; que0;</span></span>
<span class="line"><span>AscendC::TQue&lt;AscendC::TPosition::VECIN, 1&gt; que1;</span></span>
<span class="line"><span>AscendC::TQue&lt;AscendC::TPosition::VECIN, 1&gt; que2;</span></span>
<span class="line"><span>AscendC::TQue&lt;AscendC::TPosition::VECIN, 1&gt; que3;</span></span>
<span class="line"><span>AscendC::TQue&lt;AscendC::TPosition::VECIN, 1&gt; que4;</span></span>
<span class="line"><span>AscendC::TQue&lt;AscendC::TPosition::VECIN, 1&gt; que5;</span></span>
<span class="line"><span>AscendC::TQue&lt;AscendC::TPosition::VECIN, 1&gt; que6;</span></span>
<span class="line"><span>AscendC::TQue&lt;AscendC::TPosition::VECIN, 1&gt; que7;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>pipe.InitBuffer(que0, 1, len);</span></span>
<span class="line"><span>pipe.InitBuffer(que1, 1, len);</span></span>
<span class="line"><span>pipe.InitBuffer(que2, 1, len);</span></span>
<span class="line"><span>pipe.InitBuffer(que3, 1, len);</span></span>
<span class="line"><span>pipe.InitBuffer(que4, 1, len);</span></span>
<span class="line"><span>pipe.InitBuffer(que5, 1, len);</span></span>
<span class="line"><span>pipe.InitBuffer(que6, 1, len);</span></span>
<span class="line"><span>pipe.InitBuffer(que7, 1, len);</span></span></code></pre></div></li><li><p>开启double buffer</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 如果开启double buffer，此时每一个TQue分配的内存块个数为2，故最多只能申请4个TQue。</span></span>
<span class="line"><span>AscendC::TPipe pipe;</span></span>
<span class="line"><span>int len = 1024;</span></span>
<span class="line"><span>AscendC::TQue&lt;AscendC::TPosition::VECIN, 1&gt; que0;</span></span>
<span class="line"><span>AscendC::TQue&lt;AscendC::TPosition::VECIN, 1&gt; que1;</span></span>
<span class="line"><span>AscendC::TQue&lt;AscendC::TPosition::VECIN, 1&gt; que2;</span></span>
<span class="line"><span>AscendC::TQue&lt;AscendC::TPosition::VECIN, 1&gt; que3;</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>pipe.InitBuffer(que0, 2, len);</span></span>
<span class="line"><span>pipe.InitBuffer(que1, 2, len);</span></span>
<span class="line"><span>pipe.InitBuffer(que2, 2, len);</span></span>
<span class="line"><span>pipe.InitBuffer(que3, 2, len);</span></span></code></pre></div></li><li><p>多次申请TQue</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 如果TQue个数已达最大值，可以调用FreeAllEvent接口来继续申请TQue。</span></span>
<span class="line"><span>AscendC::TPipe pipe;</span></span>
<span class="line"><span>int len = 1024;</span></span>
<span class="line"><span>AscendC::TQue&lt;AscendC::TPosition::VECIN, 1&gt; que0;</span></span>
<span class="line"><span>pipe.InitBuffer(que0, 1, len);</span></span>
<span class="line"><span>AscendC::LocalTensor&lt;half&gt; tensor1 = que0.AllocTensor&lt;half&gt;();</span></span>
<span class="line"><span>que0.EnQue(tensor1);</span></span>
<span class="line"><span>tensor1 = que0.DeQue&lt;half&gt;(); // 将tensor从VECOUT的Queue中搬出</span></span>
<span class="line"><span>que0.FreeTensor&lt;half&gt;(tensor1);</span></span>
<span class="line"><span>que0.FreeAllEvent(); // 释放que0的所有同步事件，之后可继续申请TQue</span></span>
<span class="line"><span>AscendC::TQue&lt;AscendC::TPosition::VECIN, 1&gt; que1;</span></span>
<span class="line"><span>pipe.InitBuffer(que1, 1, len);</span></span></code></pre></div></li></ul><h2 id="调用示例" tabindex="-1">调用示例 <a class="header-anchor" href="#调用示例" aria-label="Permalink to &quot;调用示例&quot;">​</a></h2><p>以下用例通过传入TQueConfig使能bufferNumber的编译期计算。vector算子不涉及数据格式的转换，所以nd2nz和nz2nd是false。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 用户自定义的构造TQueConfig的元函数</span></span>
<span class="line"><span>__aicore__ constexpr AscendC::TQueConfig GetMyTQueConfig(bool nd2nzIn, bool nz2ndIn, bool scmBlockGroupIn,</span></span>
<span class="line"><span>    uint32_t bufferLenIn, uint32_t bufferNumberIn, uint32_t consumerSizeIn, const AscendC::TPosition consumerIn[])</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    return {</span></span>
<span class="line"><span>        .nd2nz = nd2nzIn,</span></span>
<span class="line"><span>        .nz2nd = nz2ndIn,</span></span>
<span class="line"><span>        .scmBlockGroup = scmBlockGroupIn,</span></span>
<span class="line"><span>        .bufferLen = bufferLenIn,</span></span>
<span class="line"><span>        .bufferNumber = bufferNumberIn,</span></span>
<span class="line"><span>        .consumerSize = consumerSizeIn,</span></span>
<span class="line"><span>        .consumer = {consumerIn[0], consumerIn[1], consumerIn[2], consumerIn[3],</span></span>
<span class="line"><span>            consumerIn[4], consumerIn[5], consumerIn[6], consumerIn[7]}</span></span>
<span class="line"><span>    };</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>static constexpr AscendC::TPosition tp[8] = {AscendC::TPosition::MAX, AscendC::TPosition::MAX, AscendC::TPosition::MAX, AscendC::TPosition::MAX,</span></span>
<span class="line"><span>            AscendC::TPosition::MAX, AscendC::TPosition::MAX, AscendC::TPosition::MAX, AscendC::TPosition::MAX};</span></span>
<span class="line"><span>static constexpr AscendC::TQueConfig conf = GetMyTQueConfig(false, false, false, 0, 1, 0, tp);</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span>AscendC::TPipe pipe;</span></span>
<span class="line"><span>AscendC::TQue&lt;AscendC::TPosition::VECIN, 1, &amp;conf&gt; inQueueX;</span></span>
<span class="line"><span>AscendC::TQue&lt;AscendC::TPosition::VECOUT, 1, &amp;conf&gt; outQueue;</span></span>
<span class="line"><span>pipe.InitBuffer(inQueueX, 1, dataSize * sizeof(srcType));</span></span>
<span class="line"><span>pipe.InitBuffer(outQueue, 1, dataSize * sizeof(int8_t));</span></span></code></pre></div>`,21)])])}const C=s(l,[["render",i]]);export{T as __pageData,C as default};
