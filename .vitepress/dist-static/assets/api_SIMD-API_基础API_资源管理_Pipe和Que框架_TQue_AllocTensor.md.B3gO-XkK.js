import{c as s,Q as a,j as e,m as l}from"./chunks/framework.DOi4mjdC.js";const T=JSON.parse('{"title":"AllocTensor","description":"","frontmatter":{},"headers":[{"level":1,"title":"AllocTensor","slug":"alloctensor"},{"level":2,"title":"产品支持情况","slug":"产品支持情况"},{"level":2,"title":"功能说明","slug":"功能说明"},{"level":2,"title":"函数原型","slug":"函数原型"},{"level":2,"title":"参数说明","slug":"参数说明"},{"level":2,"title":"约束说明","slug":"约束说明"},{"level":2,"title":"返回值说明","slug":"返回值说明"},{"level":2,"title":"调用示例","slug":"调用示例"}],"relativePath":"api/SIMD-API/基础API/资源管理/Pipe和Que框架/TQue/AllocTensor.md","filePath":"api/SIMD-API/基础API/资源管理/Pipe和Que框架/TQue/AllocTensor.md"}'),t={name:"api/SIMD-API/基础API/资源管理/Pipe和Que框架/TQue/AllocTensor.md"};function p(i,n,o,c,r,d){return a(),e("div",null,[...n[0]||(n[0]=[l(`<h1 id="alloctensor" tabindex="-1">AllocTensor <a class="header-anchor" href="#alloctensor" aria-label="Permalink to &quot;AllocTensor&quot;">​</a></h1><h2 id="产品支持情况" tabindex="-1">产品支持情况 <a class="header-anchor" href="#产品支持情况" aria-label="Permalink to &quot;产品支持情况&quot;">​</a></h2><table tabindex="0"><thead><tr><th>产品</th><th>是否支持</th></tr></thead><tbody><tr><td>Ascend 950PR/Ascend 950DT</td><td>√</td></tr><tr><td>Atlas A3 训练系列产品/Atlas A3 推理系列产品</td><td>√</td></tr><tr><td>Atlas A2 训练系列产品/Atlas A2 推理系列产品</td><td>√</td></tr><tr><td>Atlas 200I/500 A2 推理产品</td><td>√</td></tr><tr><td>Atlas 推理系列产品AI Core</td><td>√</td></tr><tr><td>Atlas 推理系列产品Vector Core</td><td>x</td></tr><tr><td>Atlas 训练系列产品</td><td>√</td></tr><tr><td>Kirin X90</td><td>√</td></tr><tr><td>Kirin 9030</td><td>√</td></tr></tbody></table><h2 id="功能说明" tabindex="-1">功能说明 <a class="header-anchor" href="#功能说明" aria-label="Permalink to &quot;功能说明&quot;">​</a></h2><p>从Que中分配Tensor，Tensor所占大小为InitBuffer时设置的每块内存长度。</p><h2 id="函数原型" tabindex="-1">函数原型 <a class="header-anchor" href="#函数原型" aria-label="Permalink to &quot;函数原型&quot;">​</a></h2><ul><li><p>non-inplace接口：构造新的Tensor作为内存管理的对象</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>template &lt;typename T&gt;</span></span>
<span class="line"><span>__aicore__ inline LocalTensor&lt;T&gt; AllocTensor()</span></span></code></pre></div></li><li><p>inplace接口：直接使用传入的Tensor作为内存管理的对象，可以减少Tensor反复创建的开销，具体使用指导可参考<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/guide/%E7%BC%96%E7%A8%8B%E6%8C%87%E5%8D%97/%E9%99%84%E5%BD%95/%E5%B8%B8%E7%94%A8%E6%93%8D%E4%BD%9C/%E5%A6%82%E4%BD%95%E4%BD%BF%E7%94%A8Tensor%E5%8E%9F%E5%9C%B0%E6%93%8D%E4%BD%9C%E6%8F%90%E5%8D%87%E7%AE%97%E5%AD%90%E6%80%A7%E8%83%BD.md" target="_blank" rel="noreferrer">Tensor原地操作</a>。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>template &lt;typename T&gt;</span></span>
<span class="line"><span>__aicore__ inline void AllocTensor(LocalTensor&lt;T&gt;&amp; tensor)</span></span></code></pre></div></li></ul><h2 id="参数说明" tabindex="-1">参数说明 <a class="header-anchor" href="#参数说明" aria-label="Permalink to &quot;参数说明&quot;">​</a></h2><p><strong>表 1</strong> 模板参数说明</p><table tabindex="0"><thead><tr><th>参数名</th><th>说明</th></tr></thead><tbody><tr><td>T</td><td>Tensor的数据类型。</td></tr></tbody></table><p><strong>表 2</strong> 参数说明</p><table tabindex="0"><thead><tr><th>参数名称</th><th>输入/输出</th><th>含义</th></tr></thead><tbody><tr><td>tensor</td><td>输入</td><td>inplace接口需要传入LocalTensor作为内存管理的对象。</td></tr></tbody></table><h2 id="约束说明" tabindex="-1">约束说明 <a class="header-anchor" href="#约束说明" aria-label="Permalink to &quot;约束说明&quot;">​</a></h2><ul><li><p>同一个TPosition上的所有Queue，连续调用AllocTensor接口申请的Tensor数量，根据AI处理器型号的不同，有数量约束。申请Buffer时，需要满足该约束。</p><p>Atlas 训练系列产品不超过4个。</p><p>Atlas 推理系列产品AI Core不超过8个。</p><p>Atlas 推理系列产品Vector Core不超过8个。</p><p>Atlas A2 训练系列产品/Atlas A2 推理系列产品不超过8个。</p><p>Atlas A3 训练系列产品/Atlas A3 推理系列产品不超过8个。</p><p>Atlas 200I/500 A2 推理产品不超过8个。</p><p>Kirin X90不超过8个。</p><p>Kirin 9030不超过8个。</p></li><li><p>non-inplace接口分配的Tensor内容可能包含随机值。</p></li><li><p>non-inplace接口，需要将TQueBind的depth模板参数设置为非零值；inplace接口，需要将TQueBind的depth模板参数设置为0。</p></li></ul><h2 id="返回值说明" tabindex="-1">返回值说明 <a class="header-anchor" href="#返回值说明" aria-label="Permalink to &quot;返回值说明&quot;">​</a></h2><p>non-inplace接口返回值为LocalTensor对象，inplace接口没有返回值。</p><h2 id="调用示例" tabindex="-1">调用示例 <a class="header-anchor" href="#调用示例" aria-label="Permalink to &quot;调用示例&quot;">​</a></h2><ul><li><p>示例一</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 使用AllocTensor分配Tensor</span></span>
<span class="line"><span>AscendC::TPipe pipe;</span></span>
<span class="line"><span>AscendC::TQue&lt;AscendC::TPosition::VECOUT, 2&gt; que;</span></span>
<span class="line"><span>int num = 2;</span></span>
<span class="line"><span>int len = 1024;</span></span>
<span class="line"><span>pipe.InitBuffer(que, num, len); // InitBuffer分配内存块数为2，每块大小为1024Bytes</span></span>
<span class="line"><span>AscendC::LocalTensor&lt;half&gt; tensor1 = que.AllocTensor&lt;half&gt;(); // AllocTensor分配Tensor长度为1024Bytes</span></span></code></pre></div></li><li><p>示例二</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 连续使用AllocTensor的限制场景举例如下:</span></span>
<span class="line"><span>AscendC::TQue&lt;AscendC::TPosition::VECIN, 1&gt; que0;</span></span>
<span class="line"><span>AscendC::TQue&lt;AscendC::TPosition::VECIN, 1&gt; que1;</span></span>
<span class="line"><span>AscendC::TQue&lt;AscendC::TPosition::VECIN, 1&gt; que2;</span></span>
<span class="line"><span>AscendC::TQue&lt;AscendC::TPosition::VECIN, 1&gt; que3;</span></span>
<span class="line"><span>AscendC::TQue&lt;AscendC::TPosition::VECIN, 1&gt; que4;</span></span>
<span class="line"><span>AscendC::TQue&lt;AscendC::TPosition::VECIN, 1&gt; que5;</span></span>
<span class="line"><span>// 不建议：</span></span>
<span class="line"><span>// 比如，算子有6个输入，需要申请6块buffer</span></span>
<span class="line"><span>// 通过6个队列为其申请内存，分别为que0~que5，每个que分配1块,申请VECIN TPosition上的buffer总数为6</span></span>
<span class="line"><span>// 假设，同一个TPosition上连续Alloc的Buffer数量限制为4，超出该限制后，使用AllocTensor/FreeTensor会出现分配资源失败</span></span>
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
<span class="line"><span>AscendC::LocalTensor&lt;T&gt; local5 = que4.AllocTensor&lt;T&gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 此时建议通过以下方法解决：</span></span>
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
<span class="line"><span>AscendC::LocalTensor&lt;T&gt; local3 = local1[offset2];</span></span></code></pre></div></li><li><p>示例三：inplace接口</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>AscendC::TPipe pipe;</span></span>
<span class="line"><span>AscendC::TQue&lt;AscendC::TPosition::VECIN, 0&gt; que;</span></span>
<span class="line"><span>int num = 2;</span></span>
<span class="line"><span>int len = 1024;</span></span>
<span class="line"><span>pipe.InitBuffer(que, num, len); // InitBuffer分配内存块数为2，每块大小为1024Bytes</span></span>
<span class="line"><span>AscendC::LocalTensor&lt;half&gt; tensor1;</span></span>
<span class="line"><span>que.AllocTensor&lt;half&gt;(tensor1); // AllocTensor分配Tensor长度为1024Bytes</span></span></code></pre></div></li></ul>`,18)])])}const h=s(t,[["render",p]]);export{T as __pageData,h as default};
