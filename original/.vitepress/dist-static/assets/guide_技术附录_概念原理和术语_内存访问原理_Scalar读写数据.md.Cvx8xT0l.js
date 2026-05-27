import{c as n,Q as s,j as e,m as l}from"./chunks/framework.DOi4mjdC.js";const p="/assets/%E5%9B%BE1-AI-Core%E5%86%85%E9%83%A8%E5%B9%B6%E8%A1%8C%E8%AE%A1%E7%AE%97%E6%9E%B6%E6%9E%84%E6%8A%BD%E8%B1%A1%E7%A4%BA%E6%84%8F%E5%9B%BE-31.BnJ5jvT4.png",t="/assets/%E5%9B%BE1-AI-Core%E5%86%85%E9%83%A8%E5%B9%B6%E8%A1%8C%E8%AE%A1%E7%AE%97%E6%9E%B6%E6%9E%84%E6%8A%BD%E8%B1%A1%E7%A4%BA%E6%84%8F%E5%9B%BE-32.vv6yyTaA.png",f=JSON.parse('{"title":"Scalar读写数据","description":"","frontmatter":{},"headers":[{"level":1,"title":"Scalar读写数据","slug":"scalar读写数据"},{"level":2,"title":"Scalar读写Global Memory","slug":"scalar读写global-memory"},{"level":2,"title":"Scalar读写Unified Buffer","slug":"scalar读写unified-buffer"},{"level":2,"title":"Scalar读写数据时的同步","slug":"scalar读写数据时的同步"}],"relativePath":"guide/技术附录/概念原理和术语/内存访问原理/Scalar读写数据.md","filePath":"guide/技术附录/概念原理和术语/内存访问原理/Scalar读写数据.md"}'),i={name:"guide/技术附录/概念原理和术语/内存访问原理/Scalar读写数据.md"};function c(r,a,o,u,d,h){return s(),e("div",null,[...a[0]||(a[0]=[l('<h1 id="scalar读写数据" tabindex="-1">Scalar读写数据 <a class="header-anchor" href="#scalar读写数据" aria-label="Permalink to &quot;Scalar读写数据&quot;">​</a></h1><p>AI Core中Scalar计算单元负责各类型的标量数据运算和程序的流程控制。根据<a href="./../../../编程指南/高级编程/硬件实现/基本架构.html">硬件架构</a>设计，Scalar仅支持对Global Memory和Unified Buffer的读写操作，而不支持对L1 Buffer、L0A Buffer、L0B Buffer和L0C Buffer等其他类型存储的访问。下文分别介绍了Scalar读写Global Memory和Unified Buffer的方式和Scalar读写数据时的同步机制。</p><h2 id="scalar读写global-memory" tabindex="-1">Scalar读写Global Memory <a class="header-anchor" href="#scalar读写global-memory" aria-label="Permalink to &quot;Scalar读写Global Memory&quot;">​</a></h2><p><img src="'+p+`" alt=""></p><p>如上图所示，Scalar读写GM数据时会经过DataCache，DataCache主要用于提高标量访存指令的执行效率，每一个AIC/AIV核内均有一个独立的DataCache。下面通过一个具体示例来讲解DataCache的具体工作机制。</p><p>globalTensor1是位于GM上的Tensor：</p><ul><li>执行完GetValue(0)后，globalTensor1的前8个元素会进入DataCache，后续GetValue(1)~GetValue(7)不需要再访问GM，而可以直接从DataCache的Cache Line中读取数据，提高了标量连续访问的效率。</li><li>执行完SetValue(8, val)后，globalTensor1的index为8~15的元素会进入DataCache，SetValue只会修改DataCache中的Cache Line数据，同时将Cache Line的状态设置为Dirty，表明Cache Line中的数据与GM中的数据不一致。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>AscendC::GlobalTensor&lt;int64_t&gt; globalTensor1;</span></span>
<span class="line"><span>globalTensor1.SetGlobalBuffer((__gm__ int64_t *)input);</span></span>
<span class="line"><span>// 从0~7共计8个uint64_t类型，DataCache的Cache Line长度为64字节</span></span>
<span class="line"><span>// 执行完GetValue(0)后，GetValue(1)~GetValue(7)可以直接从Cache Line中读取，不需要再访问GM</span></span>
<span class="line"><span>globalTensor1.GetValue(0);</span></span>
<span class="line"><span>globalTensor1.GetValue(1);</span></span>
<span class="line"><span>globalTensor1.GetValue(2);</span></span>
<span class="line"><span>globalTensor1.GetValue(3);</span></span>
<span class="line"><span>globalTensor1.GetValue(4);</span></span>
<span class="line"><span>globalTensor1.GetValue(5);</span></span>
<span class="line"><span>globalTensor1.GetValue(6);</span></span>
<span class="line"><span>globalTensor1.GetValue(7);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 执行完SetValue(8)后，不会修改GM上的数据，只会修改DataCache中Cache Line数据</span></span>
<span class="line"><span>// 同时Cache Line的状态置为dirty，dirty表示DataCache中Cache Line数据与GM中的数据不一致</span></span>
<span class="line"><span>int64_t val = 32;</span></span>
<span class="line"><span>globalTensor1.SetValue(8, val);</span></span>
<span class="line"><span>globalTensor1.GetValue(8);</span></span></code></pre></div><p>根据上文的工作机制（如下图所示），多核间访问globalTensor1会出现数据不一致的情况，如果其余核需要获取GM数据的变化，则需要开发者手动调用<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/DataCacheCleanAndInvalid.md" target="_blank" rel="noreferrer">DataCacheCleanAndInvalid</a>来保证数据的一致性。</p><p><img src="`+t+`" alt=""></p><h2 id="scalar读写unified-buffer" tabindex="-1">Scalar读写Unified Buffer <a class="header-anchor" href="#scalar读写unified-buffer" aria-label="Permalink to &quot;Scalar读写Unified Buffer&quot;">​</a></h2><p>Scalar读写Unified Buffer时，可以使用LocalTensor的SetValue和GetValue接口。示例如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>for (int32_t i = 0; i &lt; 16; ++i) {</span></span>
<span class="line"><span>    inputLocal.SetValue(i, i); // 对inputLocal中第i个位置进行赋值为i</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>for (int32_t i = 0; i &lt; srcLen; ++i) {</span></span>
<span class="line"><span>    auto element = inputLocal.GetValue(i); // 获取inputLocal中第i个位置的数值</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="scalar读写数据时的同步" tabindex="-1">Scalar读写数据时的同步 <a class="header-anchor" href="#scalar读写数据时的同步" aria-label="Permalink to &quot;Scalar读写数据时的同步&quot;">​</a></h2><p>Scalar读写Global Memory和Unified Buffer时属于PIPE_S（Scalar流水）操作，当用户使用SetValue或者GetValue接口，且算子工程使能自动同步时，不需要手动插入同步事件。</p><p>如果用户关闭算子工程的自动同步功能时，则需要手动插入同步事件：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// GetValue为Scalar操作，与后续的Duplicate存在数据依赖</span></span>
<span class="line"><span>// 因此Vector流水需要等待Scalar操作结束</span></span>
<span class="line"><span>float inputVal = srcLocal.GetValue(0);</span></span>
<span class="line"><span>SetFlag&lt;HardEvent::S_V&gt;(eventID1);</span></span>
<span class="line"><span>WaitFlag&lt;HardEvent::S_V&gt;(eventID1);</span></span>
<span class="line"><span>AscendC::Duplicate(dstLocal, inputVal, srcDataSize); </span></span>
<span class="line"><span></span></span>
<span class="line"><span>// SetValue为Scalar操作，与后续的数据搬运操作存在数据依赖</span></span>
<span class="line"><span>// 因此MTE3流水需要等待Scalar操作结束</span></span>
<span class="line"><span>srcLocal.SetValue(0, value);</span></span>
<span class="line"><span>SetFlag&lt;HardEvent::S_MTE3&gt;(eventID2);</span></span>
<span class="line"><span>WaitFlag&lt;HardEvent::S_MTE3&gt;(eventID2);</span></span>
<span class="line"><span>AscendC::DataCopy(dstGlobal, srcLocal, srcDataSize);</span></span></code></pre></div>`,17)])])}const b=n(i,[["render",c]]);export{f as __pageData,b as default};
