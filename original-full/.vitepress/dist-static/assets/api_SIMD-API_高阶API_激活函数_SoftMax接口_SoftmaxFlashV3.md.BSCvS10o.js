import{c as s,Q as n,j as t,m as e}from"./chunks/framework.DOi4mjdC.js";const p="/assets/zh-cn_formulaimage_0000002466346798.Go8m1Fvs.png",l="/assets/zh-cn_formulaimage_0000002122846977.BFUzQ89K.png",u=JSON.parse('{"title":"SoftmaxFlashV3","description":"","frontmatter":{},"headers":[{"level":1,"title":"SoftmaxFlashV3","slug":"softmaxflashv3"},{"level":2,"title":"产品支持情况","slug":"产品支持情况"},{"level":2,"title":"功能说明","slug":"功能说明"},{"level":2,"title":"函数原型","slug":"函数原型"},{"level":2,"title":"参数说明","slug":"参数说明"},{"level":2,"title":"返回值说明","slug":"返回值说明"},{"level":2,"title":"约束说明","slug":"约束说明"},{"level":2,"title":"调用示例","slug":"调用示例"}],"relativePath":"api/SIMD-API/高阶API/激活函数/SoftMax接口/SoftmaxFlashV3.md","filePath":"api/SIMD-API/高阶API/激活函数/SoftMax接口/SoftmaxFlashV3.md"}'),o={name:"api/SIMD-API/高阶API/激活函数/SoftMax接口/SoftmaxFlashV3.md"};function i(r,a,c,d,m,x){return n(),t("div",null,[...a[0]||(a[0]=[e('<h1 id="softmaxflashv3" tabindex="-1">SoftmaxFlashV3 <a class="header-anchor" href="#softmaxflashv3" aria-label="Permalink to &quot;SoftmaxFlashV3&quot;">​</a></h1><h2 id="产品支持情况" tabindex="-1">产品支持情况 <a class="header-anchor" href="#产品支持情况" aria-label="Permalink to &quot;产品支持情况&quot;">​</a></h2><table tabindex="0"><thead><tr><th>产品</th><th>是否支持</th></tr></thead><tbody><tr><td>Ascend 950PR/Ascend 950DT</td><td>√</td></tr><tr><td>Atlas A3 训练系列产品/Atlas A3 推理系列产品</td><td>√</td></tr><tr><td>Atlas A2 训练系列产品/Atlas A2 推理系列产品</td><td>√</td></tr><tr><td>Atlas 200I/500 A2 推理产品</td><td>x</td></tr><tr><td>Atlas 推理系列产品AI Core</td><td>x</td></tr><tr><td>Atlas 推理系列产品Vector Core</td><td>x</td></tr><tr><td>Atlas 训练系列产品</td><td>x</td></tr></tbody></table><h2 id="功能说明" tabindex="-1">功能说明 <a class="header-anchor" href="#功能说明" aria-label="Permalink to &quot;功能说明&quot;">​</a></h2><p>SoftmaxFlash增强版本，对应Softmax PASA算法。将输入tensor[m0, m1, ..., mt, n]（t大于或等于0）的非尾轴长度m0, m1, ..., mt相乘的结果看作m，则输入tensor的shape看作[m, n]。对输入tensor x的尾轴进行切分，分块个数为splitMeanCnt，切分后的tensor为x_cnti。按如下公式进行计算，其中x、inmax、insum、inmean为输入，M、S、E、A均为输出。</p><ul><li><p>update为false：</p><p><img src="'+p+'" alt=""></p></li><li><p>update为true：</p><p><img src="'+l+`" alt=""></p></li></ul><p>本接口当前只支持ND格式的输入，内部的reduce过程按last轴处理。</p><p>为方便理解，通过Python伪代码实现的方式，表达其计算公式如下。其中，repeatSize为64，elementNumPerBlk/BlkcntPerRepeat为8，splitMeanCnt为8，src、inmean、inmax、 insum、update为输入，dst、x_mean、x_sum、x_max、exp_max为输出。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>def softmax_flash_3(src, height, width, loopCnt, alpha, baseK, inmax=None, insum=None, inmean=None, update=False):</span></span>
<span class="line"><span>    scalar = alpha / (1 - alpha)</span></span>
<span class="line"><span>    #(m,n)-&gt;(m,64)</span></span>
<span class="line"><span>    tmpbuffer0 = BlockReduceSum(repeatSize, repeatSize, elementNumPerBlk)</span></span>
<span class="line"><span>    remain = int(width / repeatSize - BlkcntPerRepeat)</span></span>
<span class="line"><span>    tmpbuffer0 = Add(tmpbuffer0, src, remain, repeatSize * elementNumPerBlk, width)</span></span>
<span class="line"><span>    #(m,64)-&gt;(m,8)</span></span>
<span class="line"><span>    tmpbuffer0 = BlockReduceSum(1, elementNumPerBlk, elementNumPerBlk)</span></span>
<span class="line"><span>    #width = baseK * splitMeanCnt</span></span>
<span class="line"><span>    rowMeanLocal = tmpbuffer0 / baseK</span></span>
<span class="line"><span>    rowMeanGlobal = np.mean(src, axis=(-1), keepdims=True)</span></span>
<span class="line"><span>    rowMeanGlobalTmp = (rowMeanGlobal - rowMeanLocal) * scalar</span></span>
<span class="line"><span>    src = src - rowMeanGlobalTmp </span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if update == False:</span></span>
<span class="line"><span>        x_mean = rowMeanGlobal</span></span>
<span class="line"><span>        maxTmp = np.max(src, axis=-1, keepdims=True)</span></span>
<span class="line"><span>        shiftCurr = (rowMeanGlobal - x_mean) * scalar</span></span>
<span class="line"><span>        x_max = shiftCurr + maxTmp</span></span>
<span class="line"><span>        maxTmp = x_max - shiftCurr</span></span>
<span class="line"><span>        x_sub = src - maxTmp   </span></span>
<span class="line"><span>        dst = np.exp(x_sub) </span></span>
<span class="line"><span>        x_sum = np.sum(dst, axis=-1, keepdims=True)</span></span>
<span class="line"><span>        exp_max = None</span></span>
<span class="line"><span>        return dst, x_max, x_sum, x_mean, exp_max</span></span>
<span class="line"><span>    else:</span></span>
<span class="line"><span>        x_mean = (rowMeanGlobal + inmean * (loopCnt - 1)) / loopCnt</span></span>
<span class="line"><span>        maxTmp = np.max(src, axis=-1, keepdims=True)</span></span>
<span class="line"><span>        shiftCurr = (rowMeanGlobal - x_mean) * scalar</span></span>
<span class="line"><span>        shiftPrev = (inmean - x_mean) * scalar</span></span>
<span class="line"><span>	x_max = shiftCurr + maxTmp</span></span>
<span class="line"><span>        maxTmp = shiftPrev + inmax</span></span>
<span class="line"><span>        x_max = np.max(np.concatenate((x_max, maxTmp), axis=(-1)), axis=(-1), keepdims=True)</span></span>
<span class="line"><span>        maxTmp = x_max - shiftCurr</span></span>
<span class="line"><span>        x_sub = src - maxTmp   </span></span>
<span class="line"><span>        dst = np.exp(x_sub)</span></span>
<span class="line"><span>        exp_max = np.exp(inmax - x_max + shiftPrev)</span></span>
<span class="line"><span>        x_sum = np.sum(x_exp, axis=-1, keepdims=True)</span></span>
<span class="line"><span>        x_sum = exp_max * insum +  x_sum</span></span>
<span class="line"><span>        return x_exp, x_max, x_sum, x_mean, exp_max</span></span></code></pre></div><h2 id="函数原型" tabindex="-1">函数原型 <a class="header-anchor" href="#函数原型" aria-label="Permalink to &quot;函数原型&quot;">​</a></h2><ul><li><p>接口框架申请临时空间</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>template &lt;typename T, typename U, bool isUpdate = false, bool isReuseSource = false, bool isBasicBlock = false, bool isDataFormatNZ = false, const SoftmaxConfig&amp; config = SOFTMAX_DEFAULT_CFG&gt;</span></span>
<span class="line"><span>__aicore__ inline void SoftmaxFlashV3(const LocalTensor&lt;T&gt;&amp; dstTensor, const LocalTensor&lt;U&gt;&amp; meanTensor, const LocalTensor&lt;U&gt;&amp; expSumTensor, const LocalTensor&lt;U&gt;&amp; maxTensor, const LocalTensor&lt;T&gt;&amp; srcTensor, const LocalTensor&lt;T&gt;&amp; expMaxTensor, const LocalTensor&lt;U&gt;&amp; inMeanTensor, const LocalTensor&lt;U&gt;&amp; inExpSumTensor, const LocalTensor&lt;U&gt;&amp; inMaxTensor, const SoftMaxTiling&amp; tiling, const SoftMaxParams&amp; params)</span></span></code></pre></div></li><li><p>通过sharedTmpBuffer入参传入临时空间</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>template &lt;typename T, typename U, bool isUpdate = false, bool isReuseSource = false, bool isBasicBlock = false, bool isDataFormatNZ = false, const SoftmaxConfig&amp; config = SOFTMAX_DEFAULT_CFG&gt;</span></span>
<span class="line"><span>__aicore__ inline void SoftmaxFlashV3(const LocalTensor&lt;T&gt;&amp; dstTensor, const LocalTensor&lt;U&gt;&amp; meanTensor,const LocalTensor&lt;U&gt;&amp; expSumTensor, const LocalTensor&lt;U&gt;&amp; maxTensor, const LocalTensor&lt;T&gt;&amp; srcTensor,const LocalTensor&lt;T&gt;&amp; expMaxTensor, const LocalTensor&lt;U&gt;&amp; inMeanTensor, const LocalTensor&lt;U&gt;&amp; inExpSumTensor, const LocalTensor&lt;U&gt;&amp; inMaxTensor, const LocalTensor&lt;uint8_t&gt;&amp; sharedTmpBuffer, const SoftMaxTiling&amp; tiling, const SoftMaxParams&amp; params)</span></span></code></pre></div></li></ul><p>由于该接口的内部实现中涉及复杂的计算，需要额外的临时空间来存储计算过程中的中间变量。临时空间支持<strong>接口框架申请</strong>和开发者<strong>通过sharedTmpBuffer入参传入</strong>两种方式。</p><ul><li><p>接口框架申请临时空间，开发者无需申请，但是需要预留临时空间的大小。</p></li><li><p>通过sharedTmpBuffer入参传入，使用该tensor作为临时空间进行处理，接口框架不再申请。该方式开发者可以自行管理sharedTmpBuffer内存空间，并在接口调用完成后，复用该部分内存，内存不会反复申请释放，灵活性较高，内存利用率也较高。</p></li></ul><p>接口框架申请的方式，开发者需要预留临时空间；通过sharedTmpBuffer传入的情况，开发者需要为tensor申请空间。临时空间大小BufferSize的获取方式如下：通过<a href="./SoftmaxFlashV3-Tiling接口.html">SoftmaxFlashV3 Tiling接口</a>中提供的GetSoftMaxFlashV3MaxMinTmpSize接口获取所需最小和最大临时空间大小，最小空间可以保证功能正确，最大空间用于提升性能。</p><h2 id="参数说明" tabindex="-1">参数说明 <a class="header-anchor" href="#参数说明" aria-label="Permalink to &quot;参数说明&quot;">​</a></h2><p><strong>表 1</strong> 模板参数说明</p><table tabindex="0"><thead><tr><th>参数名</th><th>描述</th></tr></thead><tbody><tr><td>T</td><td>输入srcTensor及输出dstTensor、expMaxTensor操作数的数据类型。支持的数据类型为：half。</td></tr><tr><td>U</td><td>输入inMeanTensor、inExpSumTensor、inMaxTensor及输出meanTensor、expSumTensor、maxTensor操作数的数据类型。支持的数据类型为：float。</td></tr><tr><td>isUpdate</td><td>是否使能update为true的计算。</td></tr><tr><td>isReuseSource</td><td>该参数预留，传入默认值false即可。</td></tr><tr><td>isBasicBlock</td><td>该参数预留，传入默认值false即可。</td></tr><tr><td>isDataFormatNZ</td><td>该参数预留，传入默认值false即可。</td></tr><tr><td>config</td><td>该参数预留，传入默认值SOFTMAX_DEFAULT_CFG即可。</td></tr></tbody></table><p><strong>表 2</strong> 接口参数说明</p><table tabindex="0"><thead><tr><th>参数名</th><th>输入/输出</th><th>描述</th></tr></thead><tbody><tr><td>dstTensor</td><td>输出</td><td>目的操作数。 类型为LocalTensor，支持的TPosition为VECIN/VECCALC/VECOUT。 dstTensor的shape和源操作数srcTensor一致。</td></tr><tr><td>meanTensor</td><td>输出</td><td>目的操作数。 类型为LocalTensor，支持的TPosition为VECIN/VECCALC/VECOUT。 用于保存softmax计算过程中平均值的结果。 meanTensor的last轴长度固定为32Byte，即一个datablock长度。该datablock中的所有数据为同一个值。比如float数据类型下，该datablock中的8个数均为相同的reducesum求平均后的值。非last轴的长度与dstTensor保持一致。</td></tr><tr><td>expSumTensor</td><td>输出</td><td>目的操作数。 类型为LocalTensor，支持的TPosition为VECIN/VECCALC/VECOUT。 用于保存softmax计算过程中reducesum的结果。 expSumTensor的last轴长度固定为32Byte，即一个datablock长度。该datablock中的所有数据为同一个值。比如float数据类型下，该datablock中的8个数均为相同的reducesum的值。非last轴的长度与dstTensor保持一致。</td></tr><tr><td>maxTensor</td><td>输出</td><td>目的操作数。 类型为LocalTensor，支持的TPosition为VECIN/VECCALC/VECOUT。 用于保存softmax计算过程中reducemax的结果。 maxTensor的last轴长度固定为32Byte，即一个datablock长度。该datablock中的所有数据为同一个值。比如float数据类型下，该datablock中的8个数均为相同的reducemax的值。非last轴的长度与dstTensor保持一致。</td></tr><tr><td>srcTensor</td><td>输入</td><td>源操作数。 类型为LocalTensor，支持的TPosition为VECIN/VECCALC/VECOUT。 last轴长度需要32Byte对齐。</td></tr><tr><td>expMaxTensor</td><td>输出</td><td>目的操作数。 类型为LocalTensor，支持的TPosition为VECIN/VECCALC/VECOUT。 expMaxTensor的last轴长度固定为32Byte，即一个datablock长度。该datablock中的所有数据为同一个值。比如half数据类型下，该datablock中的16个数均为相同的值。非last轴的长度需要与dstTensor保持一致。</td></tr><tr><td>inMeanTensor</td><td>输入</td><td>源操作数。 类型为LocalTensor，支持的TPosition为VECIN/VECCALC/VECOUT。 softmax计算所需要的mean值。 inMeanTensor的last轴长度固定为32Byte，即一个datablock长度。该datablock中的所有数据为同一个值。比如float数据类型下，该datablock中的8个数均为相同的值。非last轴的长度需要与dstTensor保持一致。</td></tr><tr><td>inExpSumTensor</td><td>输入</td><td>源操作数。 类型为LocalTensor，支持的TPosition为VECIN/VECCALC/VECOUT。 softmax计算所需要的sum值。 inExpSumTensor的last轴长度固定为32Byte，即一个datablock长度。该datablock中的所有数据为同一个值。比如float数据类型下，该datablock中的8个数均为相同的值。非last轴的长度需要与dstTensor保持一致。</td></tr><tr><td>inMaxTensor</td><td>输入</td><td>源操作数。 类型为LocalTensor，支持的TPosition为VECIN/VECCALC/VECOUT。 softmax计算所需要的max值。 inMaxTensor的last轴长度固定为32Byte，即一个datablock长度。该datablock中的所有数据为同一个值。比如float数据类型下，该datablock中的8个数均为相同的值。非last轴的长度需要与dstTensor保持一致。</td></tr><tr><td>sharedTmpBuffer</td><td>输入</td><td>临时空间。 类型为LocalTensor，支持的TPosition为VECIN/VECCALC/VECOUT。 该操作数的数据类型固定uint8_t。 接口内部复杂计算时用于存储中间变量，由开发者提供。 临时空间大小BufferSize的获取方式请参考SoftmaxFlashV3 Tiling接口。</td></tr><tr><td>tiling</td><td>输入</td><td>SoftmaxFlashV3接口计算所需Tiling信息，Tiling信息的获取请参考SoftmaxFlashV3 Tiling接口。</td></tr><tr><td>params</td><td>输入</td><td>srcTensor的shape信息和计算相关参数。SoftMaxParams类型，具体定义如下方代码所示，其中参数的含义为： srcM：非尾轴长度的乘积。srcK：尾轴长度，必须32Byte对齐oriSrcM：原始非尾轴长度的乘积。oriSrcK：原始尾轴长度。loopCnt：update为true时，公式中的循环次数loopCnt，该参数大于等于1。splitMeanCnt：公式中计算每一行平均值时的分块个数，当前该参数仅支持取值为8。alpha：公式中的计算参数，推荐取值0.9375、0.96889、0.984497。 注意，当前本接口不支持非对齐场景，因此参数srcM与oriSrcM相等，参数srcK与oriSrcK相等。</td></tr></tbody></table><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>struct SoftMaxParams {</span></span>
<span class="line"><span>    uint32_t srcM; </span></span>
<span class="line"><span>    uint32_t srcK;</span></span>
<span class="line"><span>    uint32_t oriSrcM; </span></span>
<span class="line"><span>    uint32_t oriSrcK;  </span></span>
<span class="line"><span>    uint32_t loopCnt; </span></span>
<span class="line"><span>    uint32_t splitMeanCnt; </span></span>
<span class="line"><span>    float alpha;  </span></span>
<span class="line"><span>};</span></span></code></pre></div><h2 id="返回值说明" tabindex="-1">返回值说明 <a class="header-anchor" href="#返回值说明" aria-label="Permalink to &quot;返回值说明&quot;">​</a></h2><p>无</p><h2 id="约束说明" tabindex="-1">约束说明 <a class="header-anchor" href="#约束说明" aria-label="Permalink to &quot;约束说明&quot;">​</a></h2><ul><li>操作数地址对齐要求请参见<a href="./../../../通用说明和约束.html#section796754519912">通用地址对齐约束</a>。</li><li>对于输入srcTensor需要满足：尾轴长度n大于等于512，同时n是64的倍数；非尾轴长度的乘积m为8的倍数。</li><li>srcTensor和dstTensor的Tensor的空间可以复用，meanTensor和inMeanTensor的空间可以复用，maxTensor和inMaxTensor的空间可以复用，expSumTensor和inExpSumTensor的空间可以复用。</li><li>meanTensor、expSumTensor、maxTensor、expMaxTensor、inMeanTensor、inExpSumTensor、inMaxTensor的Tensor空间，last轴长度必须是32字节。</li><li>不支持sharedTmpBuffer与源操作数和目的操作数地址重叠。</li></ul><h2 id="调用示例" tabindex="-1">调用示例 <a class="header-anchor" href="#调用示例" aria-label="Permalink to &quot;调用示例&quot;">​</a></h2><p>本样例中输入srcTensor和输出dstTensor的shape大小为[8, 1024]，输入inMeanTensor、inExpSumTensor、inMaxTensor的shape大小为[8, 8]，数据类型为float；输出expMaxTensor的shape大小为[8, 16]，数据类型为half；输入和输出的数据排布格式为ND，srcTensor和dstTensor空间不复用，模板参数isUpdate为true。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// dstLocal: 存放SoftMax计算结果的Tensor</span></span>
<span class="line"><span>// meanLocal：存放softmax计算过程中平均值的结果</span></span>
<span class="line"><span>// expSumLocal：存放softmax计算过程中reducesum的结果</span></span>
<span class="line"><span>// maxLocal：存放softmax计算过程中reducemax的结果</span></span>
<span class="line"><span>// srcLocal：存放SoftMax计算的输入Tensor</span></span>
<span class="line"><span>// expMaxLocal：存放inmax与reducemax差值的e的指数幂的结果</span></span>
<span class="line"><span>// inMeanLocal：存放softmax计算所需要的mean值</span></span>
<span class="line"><span>// inExpSumLocal：存放softmax计算所需要的sum值</span></span>
<span class="line"><span>// inMaxLocal：存放softmax计算所需要的max值</span></span>
<span class="line"><span>// sharedTmpBuffer: 存放SoftMax计算过程中临时缓存的Tensor</span></span>
<span class="line"><span>// softmaxTiling：存放SoftMax计算所需Tiling信息，可通过SoftMaxFlashV3TilingFunc接口获取</span></span>
<span class="line"><span></span></span>
<span class="line"><span>AscendC::SoftMaxParams params(</span></span>
<span class="line"><span>    /* 非尾轴长度的乘积          */ srcM, </span></span>
<span class="line"><span>    /* 尾轴长度，必须32Bytes对齐 */ srcK, </span></span>
<span class="line"><span>    /* 原始非尾轴长度的乘积      */ oriSrcM, </span></span>
<span class="line"><span>    /* 原始尾轴长度              */ oriSrcK,</span></span>
<span class="line"><span>    /* 循环次数，update为true时大于等于1    */ loopCn,</span></span>
<span class="line"><span>    /* 每一行平均值时的分块个数，仅支持为8  */ splitMeanCnt,</span></span>
<span class="line"><span>    /* 计算参数，推荐取值0.9375、0.96889、0.984497 */ alpha</span></span>
<span class="line"><span>);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 通过sharedTmpBuffer入参传入临时空间</span></span>
<span class="line"><span>AscendC::SoftmaxFlashV3&lt;T, U, true&gt;(dstLocal, meanLocal, expSumLocal, maxLocal, srcLocal, expMaxLocal, inMeanLocal, inExpSumLocal, inMaxLocal, sharedTmpBuffer, tiling, params);</span></span>
<span class="line"><span>// 接口框架申请临时空间</span></span>
<span class="line"><span>AscendC::SoftmaxFlashV3&lt;T, U, true&gt;(dstLocal, meanLocal, expSumLocal, maxLocal, srcLocal, expMaxLocal, inMeanLocal, inExpSumLocal, inMaxLocal, tiling, params);</span></span></code></pre></div><p>结果示例如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>输入数据(srcLocal)：</span></span>
<span class="line"><span>[[ 0.        0.001221  0.002441 ...  2.496     2.498     2.498   ]</span></span>
<span class="line"><span> [ 2.5       2.502     2.502    ...  4.996     4.996     5.      ]</span></span>
<span class="line"><span> [ 5.        5.        5.004    ...  7.496     7.496     7.5     ]</span></span>
<span class="line"><span> ...</span></span>
<span class="line"><span> [12.5      12.5      12.5      ... 15.       15.       15.      ]</span></span>
<span class="line"><span> [15.       15.       15.       ... 17.5      17.5      17.5     ]</span></span>
<span class="line"><span> [17.5      17.5      17.5      ... 20.       20.       20.      ]]</span></span>
<span class="line"><span>输入数据(inMeanLocal/inExpSumLocal/inMaxLocal)：</span></span>
<span class="line"><span>[[0.5 0.5 0.5 0.5 0.5 0.5 0.5 0.5]</span></span>
<span class="line"><span> [0.5 0.5 0.5 0.5 0.5 0.5 0.5 0.5]</span></span>
<span class="line"><span> ...</span></span>
<span class="line"><span> [0.5 0.5 0.5 0.5 0.5 0.5 0.5 0.5]</span></span>
<span class="line"><span> [0.5 0.5 0.5 0.5 0.5 0.5 0.5 0.5]]</span></span>
<span class="line"><span>输出数据(dstLocal)：</span></span>
<span class="line"><span>[[0.0049   0.004906 0.004913 ... 0.998    1.       1.      ]</span></span>
<span class="line"><span> [0.00488  0.00489  0.00489  ... 0.996    0.996    1.      ]</span></span>
<span class="line"><span> [0.004868 0.004868 0.004887 ... 0.996    0.996    1.      ]</span></span>
<span class="line"><span> ...</span></span>
<span class="line"><span> [0.004894 0.004894 0.004894 ... 1.       1.       1.      ]</span></span>
<span class="line"><span> [0.00472  0.00472  0.00472  ... 1.       1.       1.      ]</span></span>
<span class="line"><span> [0.004684 0.004684 0.004684 ... 1.       1.       1.      ]]</span></span></code></pre></div>`,29)])])}const h=s(o,[["render",i]]);export{u as __pageData,h as default};
