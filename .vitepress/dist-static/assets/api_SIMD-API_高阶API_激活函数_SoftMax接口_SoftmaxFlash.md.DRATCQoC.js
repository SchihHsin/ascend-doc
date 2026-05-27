import{c as a,Q as n,j as e,m as t}from"./chunks/framework.DOi4mjdC.js";const u=JSON.parse('{"title":"SoftmaxFlash","description":"","frontmatter":{},"headers":[{"level":1,"title":"SoftmaxFlash","slug":"softmaxflash"},{"level":2,"title":"产品支持情况","slug":"产品支持情况"},{"level":2,"title":"功能说明","slug":"功能说明"},{"level":2,"title":"函数原型","slug":"函数原型"},{"level":2,"title":"参数说明","slug":"参数说明"},{"level":2,"title":"返回值说明","slug":"返回值说明"},{"level":2,"title":"约束说明","slug":"约束说明"},{"level":2,"title":"调用示例","slug":"调用示例"}],"relativePath":"api/SIMD-API/高阶API/激活函数/SoftMax接口/SoftmaxFlash.md","filePath":"api/SIMD-API/高阶API/激活函数/SoftMax接口/SoftmaxFlash.md"}'),l={name:"api/SIMD-API/高阶API/激活函数/SoftMax接口/SoftmaxFlash.md"};function p(o,s,i,c,r,d){return n(),e("div",null,[...s[0]||(s[0]=[t(`<h1 id="softmaxflash" tabindex="-1">SoftmaxFlash <a class="header-anchor" href="#softmaxflash" aria-label="Permalink to &quot;SoftmaxFlash&quot;">​</a></h1><h2 id="产品支持情况" tabindex="-1">产品支持情况 <a class="header-anchor" href="#产品支持情况" aria-label="Permalink to &quot;产品支持情况&quot;">​</a></h2><table tabindex="0"><thead><tr><th>产品</th><th>是否支持</th></tr></thead><tbody><tr><td>Ascend 950PR/Ascend 950DT</td><td>√</td></tr><tr><td>Atlas A3 训练系列产品/Atlas A3 推理系列产品</td><td>√</td></tr><tr><td>Atlas A2 训练系列产品/Atlas A2 推理系列产品</td><td>√</td></tr><tr><td>Atlas 200I/500 A2 推理产品</td><td>x</td></tr><tr><td>Atlas 推理系列产品AI Core</td><td>√</td></tr><tr><td>Atlas 推理系列产品Vector Core</td><td>x</td></tr><tr><td>Atlas 训练系列产品</td><td>x</td></tr><tr><td>Kirin X90</td><td>√</td></tr><tr><td>Kirin 9030</td><td>√</td></tr></tbody></table><h2 id="功能说明" tabindex="-1">功能说明 <a class="header-anchor" href="#功能说明" aria-label="Permalink to &quot;功能说明&quot;">​</a></h2><p><strong>注意：该接口后续即将废弃，请使用精度和性能更好的SoftmaxFlashV2接口</strong>。</p><p>Softmax增强版本，除了可以对输入tensor做SoftmaxFlash计算，还可以根据上一次Softmax计算的sum和max来更新本次的Softmax计算结果。last轴切轴的情况，每次计算的reduce结果并非是全轴的，需要根据上一次Softmax计算的sum和max来更新本次的Softmax计算结果，可以使用该增强接口。不支持NZ格式。</p><p>当前仅支持传入shape为ND格式，内部的reduce过程都是按last轴进行。不使能update时，该接口等同于<a href="./SoftMax.html">SoftMax</a>。</p><p>为方便理解，通过Python脚本实现的方式，表达其计算公式如下，其中src、inmax、 insum、update为输入，dst、x_sum、x_max、exp_max为输出。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def softmax_flash(src, inmax=None, insum=None, update=None):</span></span>
<span class="line"><span>    if update == None:</span></span>
<span class="line"><span>        #基于last轴进行rowmax(按行取最大值)处理</span></span>
<span class="line"><span>        x_max = np.max(src, axis=-1, keepdims=True)</span></span>
<span class="line"><span>        x_sub = src - x_max</span></span>
<span class="line"><span>        x_exp = np.exp(x_sub)</span></span>
<span class="line"><span>        #基于last轴进行rowsum(按行求和)处理</span></span>
<span class="line"><span>        x_sum = np.sum(x_exp, axis=-1, keepdims=True)</span></span>
<span class="line"><span>        dst = x_exp / x_sum</span></span>
<span class="line"><span>        exp_max = None</span></span>
<span class="line"><span>        return dst, x_max, x_sum, exp_max</span></span>
<span class="line"><span>    else:</span></span>
<span class="line"><span>        #将inmax和src拼接后求rowmax</span></span>
<span class="line"><span>        x_max = np.max(np.concatenate((inmax, src), axis=-1), axis=-1, keepdims=True)</span></span>
<span class="line"><span>        x_exp = np.exp(src - x_max)</span></span>
<span class="line"><span>        x_sum = np.sum(x_exp, axis=-1, keepdims=True)</span></span>
<span class="line"><span>        exp_max = np.exp(inmax - x_max)</span></span>
<span class="line"><span>        x_sum = exp_max * insum +  x_sum</span></span>
<span class="line"><span>        exp_max = exp_max * insum / x_sum</span></span>
<span class="line"><span>        dst = x_exp / x_sum</span></span>
<span class="line"><span>        return dst, x_max, x_sum, exp_max</span></span></code></pre></div><h2 id="函数原型" tabindex="-1">函数原型 <a class="header-anchor" href="#函数原型" aria-label="Permalink to &quot;函数原型&quot;">​</a></h2><ul><li><p>接口框架申请临时空间</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>template &lt;typename T, bool isReuseSource = false, bool isBasicBlock = false&gt;</span></span>
<span class="line"><span>__aicore__ inline void SoftmaxFlash(const LocalTensor&lt;T&gt; &amp;dstTensor, const LocalTensor&lt;T&gt; &amp;sumTensor, const LocalTensor&lt;T&gt; &amp;maxTensor, const LocalTensor&lt;T&gt; &amp;srcTensor, const LocalTensor&lt;T&gt; &amp;expMaxTensor, const LocalTensor&lt;T&gt; &amp;inSumTensor, const LocalTensor&lt;T&gt; &amp;inMaxTensor, const SoftMaxTiling &amp;tiling, bool isUpdate = false, const SoftMaxShapeInfo &amp;softmaxShapeInfo = {})</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>template &lt;typename T, bool isReuseSource = false, bool isBasicBlock = false&gt;</span></span>
<span class="line"><span>__aicore__ inline void SoftmaxFlash(const LocalTensor&lt;half&gt;&amp; dstTensor, const LocalTensor&lt;float&gt;&amp; sumTensor, const LocalTensor&lt;float&gt;&amp; maxTensor, const LocalTensor&lt;half&gt;&amp; srcTensor, const LocalTensor&lt;half&gt;&amp; expMaxTensor, const LocalTensor&lt;float&gt;&amp; inSumTensor, const LocalTensor&lt;float&gt;&amp; inMaxTensor, const SoftMaxTiling&amp; tiling, bool isUpdate = false, const SoftMaxShapeInfo&amp; softmaxShapeInfo = {})</span></span></code></pre></div></li><li><p>通过sharedTmpBuffer入参传入临时空间</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>template &lt;typename T, bool isReuseSource = false, bool isBasicBlock = false&gt;</span></span>
<span class="line"><span>__aicore__ inline void SoftmaxFlash(const LocalTensor&lt;T&gt;&amp; dstTensor, const LocalTensor&lt;T&gt;&amp; sumTensor, const LocalTensor&lt;T&gt;&amp; maxTensor, const LocalTensor&lt;T&gt;&amp; srcTensor, const LocalTensor&lt;T&gt;&amp; expMaxTensor, const LocalTensor&lt;T&gt;&amp; inSumTensor, const LocalTensor&lt;T&gt;&amp; inMaxTensor, const LocalTensor&lt;uint8_t&gt;&amp; sharedTmpBuffer, const SoftMaxTiling&amp; tiling, bool isUpdate = false, const SoftMaxShapeInfo&amp; softmaxShapeInfo = {})</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>template &lt;typename T, bool isReuseSource = false, bool isBasicBlock = false&gt;</span></span>
<span class="line"><span>__aicore__ inline void SoftmaxFlash(const LocalTensor&lt;half&gt;&amp; dstTensor, const LocalTensor&lt;float&gt;&amp; sumTensor, const LocalTensor&lt;float&gt;&amp; maxTensor, const LocalTensor&lt;half&gt;&amp; srcTensor, const LocalTensor&lt;half&gt;&amp; expMaxTensor, const LocalTensor&lt;float&gt;&amp; inSumTensor, const LocalTensor&lt;float&gt;&amp; inMaxTensor, const LocalTensor&lt;uint8_t&gt;&amp; sharedTmpBuffer, const SoftMaxTiling&amp; tiling, bool isUpdate = false, const SoftMaxShapeInfo&amp; softmaxShapeInfo = {})</span></span></code></pre></div></li></ul><p>由于该接口的内部实现中涉及复杂的计算，需要额外的临时空间来存储计算过程中的中间变量。临时空间支持<strong>接口框架申请</strong>和开发者<strong>通过sharedTmpBuffer入参传入</strong>两种方式。</p><ul><li><p>接口框架申请临时空间，开发者无需申请，但是需要预留临时空间的大小。</p></li><li><p>通过sharedTmpBuffer入参传入，使用该tensor作为临时空间进行处理，接口框架不再申请。该方式开发者可以自行管理sharedTmpBuffer内存空间，并在接口调用完成后，复用该部分内存，内存不会反复申请释放，灵活性较高，内存利用率也较高。</p></li></ul><p>接口框架申请的方式，开发者需要预留临时空间；通过sharedTmpBuffer传入的情况，开发者需要为tensor申请空间。临时空间大小BufferSize的获取方式如下：通过<a href="./SoftmaxFlash-Tiling接口.html">SoftmaxFlash Tiling接口</a>中提供的GetSoftMaxFlashMaxTmpSize/GetSoftMaxFlashMinTmpSize接口获取所需最大和最小临时空间大小，最小空间可以保证功能正确，最大空间用于提升性能。</p><h2 id="参数说明" tabindex="-1">参数说明 <a class="header-anchor" href="#参数说明" aria-label="Permalink to &quot;参数说明&quot;">​</a></h2><p><strong>表 1</strong> 模板参数说明</p><table tabindex="0"><thead><tr><th>参数名</th><th>描述</th></tr></thead><tbody><tr><td>T</td><td>操作数的数据类型。支持的数据类型为：half、float。</td></tr><tr><td>isReuseSource</td><td>该参数预留，传入默认值false即可。</td></tr><tr><td>isBasicBlock</td><td>srcTensor和dstTensor的shape信息和Tiling切分策略满足基本块要求的情况下，可以使能该参数用于提升性能，默认不使能。是否满足基本块的要求，可以采用如下两种方式之一判断： srcTensor和dstTensor的shape信息[m,n]需要满足如下条件：尾轴长度n小于2048并且大于等于256/sizeof(T)（即half场景下n最小为128，float场景下n最小为64），同时n是64的倍数；非尾轴长度的乘积m为8的倍数。 在Tiling实现中，通过调用IsBasicBlockInSoftMax判断Tiling切分策略是否满足基本块的切分要求。</td></tr></tbody></table><p><strong>表 2</strong> 接口参数说明</p><table tabindex="0"><thead><tr><th>参数名</th><th>输入/输出</th><th>描述</th></tr></thead><tbody><tr><td>dstTensor</td><td>输出</td><td>目的操作数。 类型为LocalTensor，支持的TPosition为VECIN/VECCALC/VECOUT。 dstTensor的shape和源操作数srcTensor一致。</td></tr><tr><td>sumTensor</td><td>输出</td><td>目的操作数。 类型为LocalTensor，支持的TPosition为VECIN/VECCALC/VECOUT。 用于保存softmax计算过程中reducesum的结果。 sumTensor的last轴长度固定为32Byte，即一个datablock长度。该datablock中的所有数据为同一个值，比如half数据类型下，该datablock中的16个数均为相同的reducesum的值。非last轴的长度与dstTensor保持一致。</td></tr><tr><td>maxTensor</td><td>输出</td><td>目的操作数。 类型为LocalTensor，支持的TPosition为VECIN/VECCALC/VECOUT。 用于保存softmax计算过程中reducemax的结果。 maxTensor的last轴长度固定为32Byte，即一个datablock长度。该datablock中的所有数据为同一个值。比如half数据类型下，该datablock中的16个数均为相同的reducemax的值。非last轴的长度与dstTensor保持一致。</td></tr><tr><td>srcTensor</td><td>输入</td><td>源操作数。 类型为LocalTensor，支持的TPosition为VECIN/VECCALC/VECOUT。 last轴长度需要32Byte对齐。</td></tr><tr><td>expMaxTensor</td><td>输出</td><td>目的操作数。 类型为LocalTensor，支持的TPosition为VECIN/VECCALC/VECOUT。 expMaxTensor的last轴长度固定为32Byte，即一个datablock长度。该datablock中的所有数据为同一个值。比如half数据类型下，该datablock中的16个数均为相同的值。非last轴的长度与dstTensor保持一致。</td></tr><tr><td>inSumTensor</td><td>输入</td><td>源操作数。 类型为LocalTensor，支持的TPosition为VECIN/VECCALC/VECOUT。 softmax计算所需要的sum值。 inSumTensor的last轴长度固定为32Byte，即一个datablock长度。该datablock中的所有数据为同一个值，比如half数据类型下，该datablock中的16个数均为相同的值。非last轴的长度需要与dstTensor保持一致。</td></tr><tr><td>inMaxTensor</td><td>输入</td><td>源操作数。 类型为LocalTensor，支持的TPosition为VECIN/VECCALC/VECOUT。 softmax计算所需要的max值。 inMaxTensor的last轴长度固定为32Byte，即一个datablock长度。该datablock中的所有数据为同一个值，比如half数据类型下，该datablock里的16个数均为相同的值。非last轴的长度需要与dstTensor保持一致。</td></tr><tr><td>sharedTmpBuffer</td><td>输入</td><td>临时空间。 类型为LocalTensor，支持的TPosition为VECIN/VECCALC/VECOUT。 接口内部复杂计算时用于存储中间变量，由开发者提供。 临时空间大小BufferSize的获取方式请参考SoftmaxFlash Tiling接口。</td></tr><tr><td>tiling</td><td>输入</td><td>接口计算所需tiling信息，Tiling信息的获取请参考SoftmaxFlash Tiling接口。</td></tr><tr><td>isUpdate</td><td>输入</td><td>是否使能update算法。</td></tr><tr><td>softmaxShapeInfo</td><td>输入</td><td>srcTensor的shape信息。SoftMaxShapeInfo类型，具体定义如下方代码所示，其中参数的含义为： srcM：非尾轴长度的乘积。srcK：尾轴长度，必须32Byte对齐oriSrcM：原始非尾轴长度的乘积。oriSrcK：原始尾轴长度。</td></tr></tbody></table><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct SoftMaxShapeInfo {</span></span>
<span class="line"><span>  uint32_t srcM; </span></span>
<span class="line"><span>  uint32_t srcK; </span></span>
<span class="line"><span>  uint32_t oriSrcM;  </span></span>
<span class="line"><span>  uint32_t oriSrcK;  </span></span>
<span class="line"><span>};</span></span></code></pre></div><h2 id="返回值说明" tabindex="-1">返回值说明 <a class="header-anchor" href="#返回值说明" aria-label="Permalink to &quot;返回值说明&quot;">​</a></h2><p>无</p><h2 id="约束说明" tabindex="-1">约束说明 <a class="header-anchor" href="#约束说明" aria-label="Permalink to &quot;约束说明&quot;">​</a></h2><ul><li>srcTensor和dstTensor的空间可以复用，maxTensor和inMaxTensor的空间可以复用，sumTensor和inSumTensor的空间可以复用。</li><li>sumTensor、maxTensor、expMaxTensor、inSumTensor、inMaxTensor的Tensor空间，last轴长度必须固定32Byte。</li><li>操作数地址对齐要求请参见<a href="./../../../通用说明和约束.html#section796754519912">通用地址对齐约束</a>。</li><li>不支持sharedTmpBuffer与源操作数和目的操作数地址重叠。</li></ul><h2 id="调用示例" tabindex="-1">调用示例 <a class="header-anchor" href="#调用示例" aria-label="Permalink to &quot;调用示例&quot;">​</a></h2><p>本样例输入src的Shape大小为[80,144]，输出Shape大小dst=[80,144]，输入inExpSumTensor=[80,16]，输入inMaxTensor=[80,16]，输出expMaxTensor=[80,16]，数据类型均为half，update为false。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &quot;kernel_operator.h&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>template &lt;typename T&gt;</span></span>
<span class="line"><span>class KernelSoftmaxFlash {</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    __aicore__ inline KernelSoftmaxFlash()</span></span>
<span class="line"><span>    {}</span></span>
<span class="line"><span>    __aicore__ inline void Init(</span></span>
<span class="line"><span>        GM_ADDR srcGm, GM_ADDR inMaxGm, GM_ADDR inSumGm, GM_ADDR dstGm, const SoftMaxTiling &amp;tilingData)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        elementNumPerBlk = 32 / sizeof(T);</span></span>
<span class="line"><span>        srcGlobal.SetGlobalBuffer((__gm__ T *)srcGm);</span></span>
<span class="line"><span>        maxGlobal.SetGlobalBuffer((__gm__ T *)inMaxGm);</span></span>
<span class="line"><span>        sumGlobal.SetGlobalBuffer((__gm__ T *)inSumGm);</span></span>
<span class="line"><span>        dstGlobal.SetGlobalBuffer((__gm__ T *)dstGm);</span></span>
<span class="line"><span>        pipe.InitBuffer(inQueueSrc, 1, height * width * sizeof(T));</span></span>
<span class="line"><span>        pipe.InitBuffer(outQueueDst, 1, height * width * sizeof(T));</span></span>
<span class="line"><span>        pipe.InitBuffer(inMaxQueue, 1, height * elementNumPerBlk * sizeof(T));</span></span>
<span class="line"><span>        pipe.InitBuffer(inSumQueue, 1, height * elementNumPerBlk * sizeof(T));</span></span>
<span class="line"><span>        pipe.InitBuffer(expMaxQueue, 1, height * elementNumPerBlk * sizeof(T));</span></span>
<span class="line"><span>        tiling = tilingData;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void Process()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        CopyIn();</span></span>
<span class="line"><span>        Compute();</span></span>
<span class="line"><span>        CopyOut();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private:</span></span>
<span class="line"><span>    __aicore__ inline void CopyIn()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;T&gt; srcLocal = inQueueSrc.AllocTensor&lt;T&gt;();</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;T&gt; inSumLocal = inSumQueue.AllocTensor&lt;T&gt;();</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;T&gt; inMaxLocal = inMaxQueue.AllocTensor&lt;T&gt;();</span></span>
<span class="line"><span>        AscendC::DataCopy(srcLocal, srcGlobal, height * width);</span></span>
<span class="line"><span>        AscendC::DataCopy(inSumLocal, sumGlobal, height * elementNumPerBlk);</span></span>
<span class="line"><span>        AscendC::DataCopy(inMaxLocal, maxGlobal, height * elementNumPerBlk);</span></span>
<span class="line"><span>        inQueueSrc.EnQue(srcLocal);</span></span>
<span class="line"><span>        inSumQueue.EnQue(inSumLocal);</span></span>
<span class="line"><span>        inMaxQueue.EnQue(inMaxLocal);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void Compute()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;T&gt; srcLocal = inQueueSrc.DeQue&lt;T&gt;();</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;T&gt; dstLocal = outQueueDst.AllocTensor&lt;T&gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;T&gt; inMaxLocal = inMaxQueue.AllocTensor&lt;T&gt;();</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;T&gt; inSumLocal = inSumQueue.AllocTensor&lt;T&gt;();</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;T&gt; expMaxTensor = expMaxQueue.AllocTensor&lt;T&gt;();</span></span>
<span class="line"><span>        AscendC::SoftMaxShapeInfo srcShape = {height, width, height, width};</span></span>
<span class="line"><span>        AscendC::SoftmaxFlash&lt;T, false&gt;(srcLocal,</span></span>
<span class="line"><span>            inSumLocal,</span></span>
<span class="line"><span>            inMaxLocal,</span></span>
<span class="line"><span>            srcLocal,</span></span>
<span class="line"><span>            expMaxTensor,</span></span>
<span class="line"><span>            inSumLocal,</span></span>
<span class="line"><span>            inMaxLocal,</span></span>
<span class="line"><span>            tiling,</span></span>
<span class="line"><span>            false,</span></span>
<span class="line"><span>            srcShape);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        AscendC::DataCopy(dstLocal, srcLocal, height * width);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        outQueueDst.EnQue&lt;T&gt;(dstLocal);</span></span>
<span class="line"><span>        inMaxQueue.FreeTensor(inMaxLocal);</span></span>
<span class="line"><span>        inSumQueue.FreeTensor(inSumLocal);</span></span>
<span class="line"><span>        inQueueSrc.FreeTensor(srcLocal);</span></span>
<span class="line"><span> </span></span>
<span class="line"><span>        expMaxQueue.FreeTensor(expMaxTensor);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    __aicore__ inline void CopyOut()</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        AscendC::LocalTensor&lt;T&gt; dstLocal = outQueueDst.DeQue&lt;T&gt;();</span></span>
<span class="line"><span>        AscendC::DataCopy(dstGlobal, dstLocal, height * width);</span></span>
<span class="line"><span>        outQueueDst.FreeTensor(dstLocal);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>private:</span></span>
<span class="line"><span>    AscendC::TPipe pipe;</span></span>
<span class="line"><span>    AscendC::TQue&lt;AscendC::TPosition::VECIN, 1&gt; inQueueSrc;</span></span>
<span class="line"><span>    AscendC::TQue&lt;AscendC::TPosition::VECOUT, 1&gt; outQueueDst;</span></span>
<span class="line"><span>    AscendC::TQue&lt;AscendC::TPosition::VECIN, 1&gt; inMaxQueue;</span></span>
<span class="line"><span>    AscendC::TQue&lt;AscendC::TPosition::VECIN, 1&gt; inSumQueue;</span></span>
<span class="line"><span>    AscendC::TQue&lt;AscendC::TPosition::VECIN, 1&gt; expMaxQueue;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    AscendC::GlobalTensor&lt;T&gt; srcGlobal, dstGlobal;</span></span>
<span class="line"><span>    AscendC::GlobalTensor&lt;T&gt; maxGlobal, sumGlobal;</span></span>
<span class="line"><span>    uint32_t elementNumPerBlk = 0;</span></span>
<span class="line"><span>    uint32_t width = 144;</span></span>
<span class="line"><span>    uint32_t height = 80;</span></span>
<span class="line"><span>    SoftMaxTiling tiling;</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>extern &quot;C&quot; __global__ __aicore__ void softmax_flash_kernel_half(GM_ADDR srcGm, GM_ADDR inMaxGm, GM_ADDR inSumGm, GM_ADDR dstGm, GM_ADDR tiling)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    GET_TILING_DATA(tilingData, tiling);</span></span>
<span class="line"><span>    KernelSoftmaxFlash&lt;half&gt; op;</span></span>
<span class="line"><span>    op.Init(srcGm, inMaxGm, inSumGm, dstGm, tilingData.softmaxTilingData);</span></span>
<span class="line"><span>    op.Process();</span></span>
<span class="line"><span>}</span></span></code></pre></div>`,27)])])}const T=a(l,[["render",p]]);export{u as __pageData,T as default};
