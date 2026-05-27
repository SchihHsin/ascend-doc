import{c as s,Q as n,j as e,m as t}from"./chunks/framework.DOi4mjdC.js";const p="/assets/%E5%90%8C%E6%AD%A5%E6%96%B9%E5%BC%8F%E6%B6%88%E6%81%AF%E5%8F%91%E9%80%81%E7%A4%BA%E6%84%8F%E5%9B%BE.CdEB4EEb.png",l="/assets/%E5%BC%82%E6%AD%A5%E6%96%B9%E5%BC%8F%E6%B6%88%E6%81%AF%E5%8F%91%E9%80%81%E7%A4%BA%E6%84%8F%E5%9B%BE.CHyiAzW-.png",m=JSON.parse('{"title":"使能Iterate或IterateAll异步接口避免AIC/AIV同步依赖","description":"","frontmatter":{},"headers":[{"level":1,"title":"使能Iterate或IterateAll异步接口避免AIC/AIV同步依赖","slug":"使能iterate或iterateall异步接口避免aicaiv同步依赖"}],"relativePath":"guide/算子实践参考/SIMD算子性能优化/流水编排/使能Iterate或IterateAll异步接口避免AIC-AIV同步依赖.md","filePath":"guide/算子实践参考/SIMD算子性能优化/流水编排/使能Iterate或IterateAll异步接口避免AIC-AIV同步依赖.md"}'),i={name:"guide/算子实践参考/SIMD算子性能优化/流水编排/使能Iterate或IterateAll异步接口避免AIC-AIV同步依赖.md"};function c(r,a,o,I,A,g){return n(),e("div",null,[...a[0]||(a[0]=[t('<h1 id="使能iterate或iterateall异步接口避免aic-aiv同步依赖" tabindex="-1">使能Iterate或IterateAll异步接口避免AIC/AIV同步依赖 <a class="header-anchor" href="#使能iterate或iterateall异步接口避免aic-aiv同步依赖" aria-label="Permalink to &quot;使能Iterate或IterateAll异步接口避免AIC/AIV同步依赖&quot;">​</a></h1><p>【优先级】高</p><p>【描述】在MIX场景，即AIC（AI Cube核）和AIV（AI Vector核）混合编程中，调用Matmul Iterate或者IterateAll时，AIV发送消息到AIC启动Matmul计算。若通过Iterate&lt;true&gt;同步方式，如<a href="#fig99236286201">图1 同步方式消息发送示意图</a>，每次调用都会触发一次消息发送，而通过Iterate&lt;false&gt;异步方式，如<a href="#fig1511392207">图2 异步方式消息发送示意图</a>，仅第一次需要发送消息，后续无需发送消息，从而减少Cube与Vector核间交互，减少核间通信开销。因此，MIX场景推荐使用Iterate&lt;false&gt;或者IterateAll&lt;false&gt;异步接口（注意：使用异步接口时需要设置Workspace）。</p><p><strong>图 1</strong> 同步方式消息发送示意图<br><img src="'+p+'" alt="" title="同步方式消息发送示意图"></p><p><strong>图 2</strong> 异步方式消息发送示意图<br><img src="'+l+`" alt="" title="异步方式消息发送示意图"></p><p>【反例】</p><p>MIX场景使用Iterate接口的同步方式。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>TQueBind&lt;TPosition::CO2, TPosition::VECIN&gt;  qVecIn;</span></span>
<span class="line"><span>TQueBind&lt;TPosition::VECIN, TPosition::VECOUT&gt;  qVecOut;</span></span>
<span class="line"><span>mm.SetTensorA(gmA);</span></span>
<span class="line"><span>mm.SetTensorB(gmB);</span></span>
<span class="line"><span>int16_t scalar = 2;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>while(mm.template Iterate()){</span></span>
<span class="line"><span>    auto cInUB = qVecIn.AllocTensor&lt;float&gt;();</span></span>
<span class="line"><span>    mm.GetTensorC(cInUB);</span></span>
<span class="line"><span>    qVecIn.EnQue(cInUB);</span></span>
<span class="line"><span>    cInUB = qVecIn.DeQue&lt;float&gt;();</span></span>
<span class="line"><span>    auto cOutUB = qVecOut.AllocTensor&lt;float&gt;();</span></span>
<span class="line"><span>    Muls(cOutUB, cInUB, scalar, baseM*baseN);</span></span>
<span class="line"><span>    qVecIn.FreeTensor(cInUB);</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>【正例】</p><p>MIX场景使用Iterate接口的异步方式。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>TQueBind&lt;TPosition::CO2, TPosition::VECIN&gt;  qVecIn;</span></span>
<span class="line"><span>TQueBind&lt;TPosition::VECIN, TPosition::VECOUT&gt;  qVecOut;</span></span>
<span class="line"><span>mm.SetTensorA(gmA);</span></span>
<span class="line"><span>mm.SetTensorB(gmB);</span></span>
<span class="line"><span>mm.SetWorkspace(workspace, size);//其中，workspace为临时空间的物理地址，size为singleCoreM*singleCoreN大小的矩阵C占用的内存大小：singleCoreM*singleCoreN*sizeof(float)</span></span>
<span class="line"><span>int16_t scalar = 2;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>while(mm.template Iterate&lt;false&gt;()){</span></span>
<span class="line"><span>    auto cInUB = qVecIn.AllocTensor&lt;float&gt;();</span></span>
<span class="line"><span>    mm.GetTensorC(cInUB);</span></span>
<span class="line"><span>    qVecIn.EnQue(cInUB);</span></span>
<span class="line"><span>    cInUB = qVecIn.DeQue&lt;float&gt;();</span></span>
<span class="line"><span>    auto cOutUB = qVecOut.AllocTensor&lt;float&gt;();</span></span>
<span class="line"><span>    Muls(cOutUB, cInUB, scalar, baseM*baseN);</span></span>
<span class="line"><span>    qVecIn.FreeTensor(cInUB);</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>}</span></span></code></pre></div>`,11)])])}const d=s(i,[["render",c]]);export{m as __pageData,d as default};
