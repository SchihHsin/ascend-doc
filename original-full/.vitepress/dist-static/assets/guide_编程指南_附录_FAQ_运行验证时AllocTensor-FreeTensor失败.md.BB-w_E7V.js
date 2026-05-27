import{c as s,Q as e,j as a,m as l}from"./chunks/framework.DOi4mjdC.js";const T=JSON.parse('{"title":"运行验证时AllocTensor/FreeTensor失败","description":"","frontmatter":{},"headers":[{"level":1,"title":"运行验证时AllocTensor/FreeTensor失败","slug":"运行验证时alloctensorfreetensor失败"},{"level":2,"title":"现象描述","slug":"现象描述"},{"level":2,"title":"问题根因","slug":"问题根因"},{"level":2,"title":"处理步骤","slug":"处理步骤"}],"relativePath":"guide/编程指南/附录/FAQ/运行验证时AllocTensor-FreeTensor失败.md","filePath":"guide/编程指南/附录/FAQ/运行验证时AllocTensor-FreeTensor失败.md"}'),p={name:"guide/编程指南/附录/FAQ/运行验证时AllocTensor-FreeTensor失败.md"};function t(o,n,c,i,r,u){return e(),a("div",null,[...n[0]||(n[0]=[l(`<h1 id="运行验证时alloctensor-freetensor失败" tabindex="-1">运行验证时AllocTensor/FreeTensor失败 <a class="header-anchor" href="#运行验证时alloctensor-freetensor失败" aria-label="Permalink to &quot;运行验证时AllocTensor/FreeTensor失败&quot;">​</a></h1><h2 id="现象描述" tabindex="-1">现象描述 <a class="header-anchor" href="#现象描述" aria-label="Permalink to &quot;现象描述&quot;">​</a></h2><p>通过NPU进行核函数的运行验证时，出现挂死现象；通过CPU进行核函数的运行验证时，出现AllocTensor/FreeTensor失败的报错，日志报错和调用栈打印如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>[ERROR][Core_0][/usr/local/Ascend/cann/x86_64-linux/tikcpp/tikcfw/interface/kernel_tpipe.h:730][AllocEventID][321678] current size is 4, max buffer number in same queue position is 4</span></span>
<span class="line"><span>[ERROR][CORE_0][pid 321674] error happened! =========</span></span>
<span class="line"><span>SIGABRT Signal (Abort Signal from abort) catched, backtrace info:</span></span>
<span class="line"><span>[#0] 0x000000000001e7c0: handler(int) at /usr/local/Ascend/cann/tools/tikicpulib/lib/include/kern_fwk.h:105</span></span>
<span class="line"><span>[#1] 0x0000000000017c4f: signed char AscendC::TPipe::AllocEventID&lt;(AscendC::HardEvent)5&gt;() at /usr/local/Ascend/cann/x86_64-linux/tikcpp/tikcfw/interface/kernel_tpipe.h:733</span></span>
<span class="line"><span>[#2] 0x000000000001426d: AscendC::TQueBind&lt;(AscendC::TPosition)0, (AscendC::TPosition)9, 4, 0&gt;::FreeBuffer(unsigned char*) at /usr/local/Ascend/cann/x86_64-linux/tikcpp/tikcfw/interface/kernel_tpipe.h:1217</span></span>
<span class="line"><span>[#3] 0x0000000000011058: void AscendC::TQueBind&lt;(AscendC::TPosition)0, (AscendC::TPosition)9, 4, 0&gt;::FreeTensor&lt;float16::Fp16T&gt;(AscendC::LocalTensor&lt;float16::Fp16T&gt;&amp;) at /usr/local/Ascend/cann/x86_64-linux/tikcpp/tikcfw/interface/kernel_tpipe.h:1237</span></span>
<span class="line"><span>[#4] 0x000000000000dfde: KernelAdd::Compute(int) at /home/xxxx/xxxx.cpp:59</span></span>
<span class="line"><span>[#5] 0x000000000000dd1c: KernelAdd::Process() at /home/xxxx/xxxx.cpp:37 (discriminator 2)</span></span>
<span class="line"><span>...</span></span></code></pre></div><h2 id="问题根因" tabindex="-1">问题根因 <a class="header-anchor" href="#问题根因" aria-label="Permalink to &quot;问题根因&quot;">​</a></h2><p>根据日志信息“current size is 4, <strong>max buffer number in same queue position</strong> is 4”可以明确该问题是因为同一个TPosition上QUE Buffer的数量超出限制导致。</p><p>同一个TPosition上的所有Queue，连续调用AllocTensor接口申请的Tensor数量，根据AI处理器型号的不同，有数量约束。申请Buffer时，需要满足该约束。</p><p>Atlas 训练系列产品不超过4个。</p><p>Atlas 推理系列产品AI Core不超过8个。</p><p>Atlas 推理系列产品Vector Core不超过8个。</p><p>Atlas A2 训练系列产品/Atlas A2 推理系列产品不超过8个。</p><p>Atlas A3 训练系列产品/Atlas A3 推理系列产品不超过8个。</p><p>Atlas 200I/500 A2 推理产品不超过8个。</p><p>不满足该约束，在后续使用AllocTensor/FreeTensor可能会出现分配资源失败。比如：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>AscendC::TQue&lt;AscendC::TPosition::VECIN, 1&gt; que0;</span></span>
<span class="line"><span>AscendC::TQue&lt;AscendC::TPosition::VECIN, 1&gt; que1;</span></span>
<span class="line"><span>AscendC::TQue&lt;AscendC::TPosition::VECIN, 1&gt; que2;</span></span>
<span class="line"><span>AscendC::TQue&lt;AscendC::TPosition::VECIN, 1&gt; que3;</span></span>
<span class="line"><span>AscendC::TQue&lt;AscendC::TPosition::VECIN, 1&gt; que4;</span></span>
<span class="line"><span>AscendC::TQue&lt;AscendC::TPosition::VECIN, 1&gt; que5;</span></span>
<span class="line"><span>// 比如，算子有6个输入，需要申请6块buffer</span></span>
<span class="line"><span>// 通过6个队列为其申请内存，分别为que0~que5，每个que分配1块,申请VECIN TPosition上的buffer总数为6</span></span>
<span class="line"><span>// 假设，同一个Position上连续Alloc的Buffer数量限制为4，超出该限制后，使用AllocTensor/FreeTensor会出现分配资源失败</span></span>
<span class="line"><span>// 在NPU上可能体现为卡死等异常行为，在CPU Debug场景会出现报错提示</span></span>
<span class="line"><span>pipe.InitBuffer(que0, 1, len);</span></span>
<span class="line"><span>pipe.InitBuffer(que1, 1, len);</span></span>
<span class="line"><span>pipe.InitBuffer(que2, 1, len);</span></span>
<span class="line"><span>pipe.InitBuffer(que3, 1, len);</span></span>
<span class="line"><span>pipe.InitBuffer(que4, 1, len);</span></span>
<span class="line"><span>pipe.InitBuffer(que5, 1, len);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>AscendC::LocalTensor&lt;T&gt; local1 = que0.AllocTensor&lt;T&gt;();</span></span>
<span class="line"><span>AscendC::LocalTensor&lt;T&gt; local2 = que1.AllocTensor&lt;T&gt;();</span></span>
<span class="line"><span>AscendC::LocalTensor&lt;T&gt; local3 = que2.AllocTensor&lt;T&gt;();</span></span>
<span class="line"><span>AscendC::LocalTensor&lt;T&gt; local4 = que3.AllocTensor&lt;T&gt;();</span></span>
<span class="line"><span>// 第5个AllocTensor会出现资源分配失败，同一个TPosition上同时Alloc出来的Tensor数量超出了4个的限制</span></span>
<span class="line"><span>AscendC::LocalTensor&lt;T&gt; local5 = que4.AllocTensor&lt;T&gt;();</span></span></code></pre></div><h2 id="处理步骤" tabindex="-1">处理步骤 <a class="header-anchor" href="#处理步骤" aria-label="Permalink to &quot;处理步骤&quot;">​</a></h2><p>如果确实有多块buffer使用，可以将多个buffer合并到一块buffer，通过偏移使用。样例如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 此时建议通过以下方法解决：</span></span>
<span class="line"><span>// 如果确实有多块buffer使用, 可以将多个buffer合并到一块buffer, 通过偏移使用</span></span>
<span class="line"><span>pipe.InitBuffer(que0, 1, len * 3);</span></span>
<span class="line"><span>pipe.InitBuffer(que1, 1, len * 3);</span></span>
<span class="line"><span>/*</span></span>
<span class="line"><span> * 分配出3块内存大小的LocalTensor, local1的地址为que0中buffer的起始地址，</span></span>
<span class="line"><span> * local2的地址为local1的地址偏移len后的地址，local3的地址为local1的地址偏移</span></span>
<span class="line"><span> * len * 2的地址</span></span>
<span class="line"><span> */</span></span>
<span class="line"><span>int32_t offset1 = len;</span></span>
<span class="line"><span>int32_t offset2 = len * 2;</span></span>
<span class="line"><span>AscendC::LocalTensor&lt;T&gt; local1 = que0.AllocTensor&lt;T&gt;();</span></span>
<span class="line"><span>AscendC::LocalTensor&lt;T&gt; local2 = local1[offset1];</span></span>
<span class="line"><span>AscendC::LocalTensor&lt;T&gt; local3 = local1[offset2];</span></span></code></pre></div>`,18)])])}const f=s(p,[["render",t]]);export{T as __pageData,f as default};
