import{c as n,Q as a,j as e,m as p}from"./chunks/framework.DOi4mjdC.js";const l="/assets/SIMD%E5%AE%9E%E7%8E%B0floor_mod%E7%9A%84%E8%80%97%E6%97%B6.2R9lNelZ.png",t="/assets/SIMT%E5%AE%9E%E7%8E%B0floor_mod%E7%9A%84%E8%80%97%E6%97%B6.D6vzDaXd.png",m=JSON.parse('{"title":"通过SIMT实现分支判断","description":"","frontmatter":{},"headers":[{"level":1,"title":"通过SIMT实现分支判断","slug":"通过simt实现分支判断"}],"relativePath":"guide/算子实践参考/SIMD与SIMT混合算子性能优化/计算优化/通过SIMT实现分支判断.md","filePath":"guide/算子实践参考/SIMD与SIMT混合算子性能优化/计算优化/通过SIMT实现分支判断.md"}'),i={name:"guide/算子实践参考/SIMD与SIMT混合算子性能优化/计算优化/通过SIMT实现分支判断.md"};function c(d,s,o,u,g,r){return a(),e("div",null,[...s[0]||(s[0]=[p(`<h1 id="通过simt实现分支判断" tabindex="-1">通过SIMT实现分支判断 <a class="header-anchor" href="#通过simt实现分支判断" aria-label="Permalink to &quot;通过SIMT实现分支判断&quot;">​</a></h1><div class="note custom-block github-alert"><p class="custom-block-title">说明</p><p>该性能优化建议适用于如下型号：</p><ul><li>Ascend 950PR/Ascend 950DT</li></ul></div><p>【优先级】高</p><p>【描述】基于SIMD编程模型实现的批量数据计算性能很高，但在算子实现逻辑中涉及分支判断时，基于SIMD的计算操作会变得相对复杂，导致性能下降。此时，可以考虑采用SIMT方式，因为SIMT编程更为灵活，更适合处理分支判断的场景。</p><p>【样例介绍】以floor_mod算子为例，算子功能为将输入self的每个元素除以输入other的对应元素，获取余数。该余数应与除数other具有相同的符号，且其绝对值应小于other的绝对值。在计算过程中，需要判断other中每个元素的符号以及余数与该元素绝对值的大小关系。</p><p>【反例】</p><p>基于SIMD的floor_mod算子实现：由于SIMD无法直接实现分支判断逻辑，因此需要使用多个Reg矢量计算API来完成分支判断，相关代码如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>template &lt;typename T&gt;</span></span>
<span class="line"><span>__simd_vf__ inline void floor_mod_int_simd(__ubuf__ T* dstAddr, __ubuf__ T* input1Addr, __ubuf__ T* input2Addr,</span></span>
<span class="line"><span>    __ubuf__ T* divAddr, const uint32_t count)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    uint32_t vecLen = VECTOR_LENGTH / sizeof(T);</span></span>
<span class="line"><span>    uint16_t loopTimes = (count + vecLen - 1) / vecLen;</span></span>
<span class="line"><span>    AscendC::Reg::RegTensor&lt;T&gt; zeroValue;</span></span>
<span class="line"><span>    AscendC::Reg::RegTensor&lt;T&gt; defaultValue;</span></span>
<span class="line"><span>    AscendC::Reg::RegTensor&lt;T&gt; signValue;</span></span>
<span class="line"><span>    AscendC::Reg::RegTensor&lt;T&gt; input1Value;</span></span>
<span class="line"><span>    AscendC::Reg::RegTensor&lt;T&gt; input2Value;</span></span>
<span class="line"><span>    AscendC::Reg::RegTensor&lt;T&gt; divValue;</span></span>
<span class="line"><span>    AscendC::Reg::RegTensor&lt;T&gt; mulValue;</span></span>
<span class="line"><span>    AscendC::Reg::RegTensor&lt;T&gt; subValue;</span></span>
<span class="line"><span>    AscendC::Reg::RegTensor&lt;T&gt; modValue;</span></span>
<span class="line"><span>    AscendC::Reg::RegTensor&lt;T&gt; modSignValue;</span></span>
<span class="line"><span>    AscendC::Reg::RegTensor&lt;T&gt; addValue;</span></span>
<span class="line"><span>    AscendC::Reg::RegTensor&lt;T&gt; input2SignValue;</span></span>
<span class="line"><span>    AscendC::Reg::RegTensor&lt;T&gt; resValue;</span></span>
<span class="line"><span>    AscendC::Reg::MaskReg preg;</span></span>
<span class="line"><span>    AscendC::Reg::MaskReg cmpValue;</span></span>
<span class="line"><span>    AscendC::Reg::MaskReg negValue;</span></span>
<span class="line"><span>    AscendC::Reg::MaskReg signNegValue;</span></span>
<span class="line"><span>    AscendC::Reg::MaskReg resMaskValue;</span></span>
<span class="line"><span>    uint32_t sregMask = count;</span></span>
<span class="line"><span>    AscendC::Reg::Duplicate(zeroValue, T(0));</span></span>
<span class="line"><span>    AscendC::Reg::Duplicate(defaultValue, T(-1));</span></span>
<span class="line"><span>    AscendC::Reg::Duplicate(signValue, FMOD_B32_SIGN);</span></span>
<span class="line"><span>    for (uint16_t j = 0; j &lt; loopTimes; j++) {</span></span>
<span class="line"><span>        // handel -1</span></span>
<span class="line"><span>        preg = AscendC::Reg::UpdateMask&lt;T&gt;(sregMask);</span></span>
<span class="line"><span>        AscendC::Reg::DataCopy&lt;T, AscendC::Reg::LoadDist::DIST_NORM&gt;(input2Value, input2Addr + vecLen * j);</span></span>
<span class="line"><span>        AscendC::Reg::DataCopy&lt;T, AscendC::Reg::LoadDist::DIST_NORM&gt;(divValue, divAddr + vecLen * j);</span></span>
<span class="line"><span>        AscendC::Reg::Mul(mulValue, input2Value, divValue, preg);</span></span>
<span class="line"><span>        AscendC::Reg::DataCopy&lt;T, AscendC::Reg::LoadDist::DIST_NORM&gt;(input1Value, input1Addr + vecLen * j);</span></span>
<span class="line"><span>        AscendC::Reg::Sub(subValue, input1Value, mulValue, preg);</span></span>
<span class="line"><span>        AscendC::Reg::Compare&lt;T, AscendC::CMPMODE::NE&gt;(cmpValue, input2Value, zeroValue, preg);</span></span>
<span class="line"><span>        AscendC::Reg::Select(modValue, subValue, defaultValue, cmpValue);</span></span>
<span class="line"><span>        // post handel</span></span>
<span class="line"><span>        AscendC::Reg::Add(addValue, modValue, input2Value, preg);</span></span>
<span class="line"><span>        AscendC::Reg::Compare&lt;T, AscendC::CMPMODE::NE&gt;(negValue, modValue, zeroValue, preg);</span></span>
<span class="line"><span>        AscendC::Reg::And(input2SignValue, input2Value, signValue, preg);</span></span>
<span class="line"><span>        AscendC::Reg::And(modSignValue, modValue, signValue, preg);</span></span>
<span class="line"><span>        AscendC::Reg::Compare&lt;T, AscendC::CMPMODE::NE&gt;(signNegValue, modSignValue, input2SignValue, preg);</span></span>
<span class="line"><span>        AscendC::Reg::MaskAnd(resMaskValue, signNegValue, negValue, preg);</span></span>
<span class="line"><span>        AscendC::Reg::Select(resValue, addValue, modValue, resMaskValue);</span></span>
<span class="line"><span>        AscendC::Reg::DataCopy&lt;T, AscendC::Reg::StoreDist::DIST_NORM&gt;(dstAddr + vecLen * j, resValue, preg);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>【正例】</p><p>基于SIMT的floor_mod算子实现：采用SIMT编程方式实现计算过程，通过if else语句完成分支判断，代码如下所示，代码简洁且易于实现。完整的算子实现代码请参考<a href="https://gitcode.com/cann/asc-devkit/tree/master/examples/01_simd_cpp_api/04_best_practices/03_fusion_compute_practices/simt_and_simd_floor_mod" target="_blank" rel="noreferrer">floor_mod算子样例</a>。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>template &lt;typename T&gt;</span></span>
<span class="line"><span>__simt_vf__ inline void floor_mod_simt(</span></span>
<span class="line"><span>    __ubuf__ T* self,</span></span>
<span class="line"><span>    __ubuf__ T* other,</span></span>
<span class="line"><span>    __ubuf__ T* out,</span></span>
<span class="line"><span>    uint32_t input_total_length)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    uint32_t index = threadIdx.x;</span></span>
<span class="line"><span>    auto rem = self[index] % other[index];</span></span>
<span class="line"><span>    bool signs_differ = ((rem &lt; 0) != (other[index] &lt; 0));</span></span>
<span class="line"><span>    if (signs_differ &amp;&amp; (rem != 0)) {</span></span>
<span class="line"><span>        out[index] = rem + other[index];</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        out[index] = rem;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>【性能对比】</p><p>如下图所示，基于SIMD实现的floor_mod算子的Kernel执行耗时为4.03us。</p><p><strong>图 1</strong> SIMD实现floor_mod的耗时<br><img src="`+l+'" alt="" title="SIMD实现floor_mod的耗时"></p><p>如下图所示，基于SIMT实现的floor_mod算子的Kernel执行耗时为3.444us。</p><p><strong>图 2</strong> SIMT实现floor_mod的耗时<br><img src="'+t+'" alt="" title="SIMT实现floor_mod的耗时"></p><p>在核数不变、每个核处理的数据量相同且数据统一搬运到Unified Buffer上进行计算的情况下，使用SIMT实现分支判断的性能比使用SIMD实现的性能提升了14.6%。</p>',17)])])}const T=n(i,[["render",c]]);export{m as __pageData,T as default};
