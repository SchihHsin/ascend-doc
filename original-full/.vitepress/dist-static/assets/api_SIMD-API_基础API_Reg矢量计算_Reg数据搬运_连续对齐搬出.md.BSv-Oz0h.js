import{c as s,Q as a,j as n,m as e}from"./chunks/framework.DOi4mjdC.js";const o=JSON.parse('{"title":"连续对齐搬出","description":"","frontmatter":{},"headers":[{"level":1,"title":"连续对齐搬出","slug":"连续对齐搬出"},{"level":2,"title":"产品支持情况","slug":"产品支持情况"},{"level":2,"title":"功能说明","slug":"功能说明"},{"level":2,"title":"函数原型","slug":"函数原型"},{"level":2,"title":"参数说明","slug":"参数说明"},{"level":2,"title":"返回值说明","slug":"返回值说明"},{"level":2,"title":"约束说明","slug":"约束说明"},{"level":2,"title":"调用示例","slug":"调用示例"}],"relativePath":"api/SIMD-API/基础API/Reg矢量计算/Reg数据搬运/连续对齐搬出.md","filePath":"api/SIMD-API/基础API/Reg矢量计算/Reg数据搬运/连续对齐搬出.md"}'),d={name:"api/SIMD-API/基础API/Reg矢量计算/Reg数据搬运/连续对齐搬出.md"};function p(r,t,l,i,c,_){return a(),n("div",null,[...t[0]||(t[0]=[e(`<h1 id="连续对齐搬出" tabindex="-1">连续对齐搬出 <a class="header-anchor" href="#连续对齐搬出" aria-label="Permalink to &quot;连续对齐搬出&quot;">​</a></h1><h2 id="产品支持情况" tabindex="-1">产品支持情况 <a class="header-anchor" href="#产品支持情况" aria-label="Permalink to &quot;产品支持情况&quot;">​</a></h2><table tabindex="0"><thead><tr><th>产品</th><th>是否支持</th></tr></thead><tbody><tr><td>Ascend 950PR/Ascend 950DT</td><td>√</td></tr><tr><td>Atlas A3 训练系列产品/Atlas A3 推理系列产品</td><td>x</td></tr><tr><td>Atlas A2 训练系列产品/Atlas A2 推理系列产品</td><td>x</td></tr><tr><td>Atlas 200I/500 A2 推理产品</td><td>x</td></tr><tr><td>Atlas 推理系列产品AI Core</td><td>x</td></tr><tr><td>Atlas 推理系列产品Vector Core</td><td>x</td></tr><tr><td>Atlas 训练系列产品</td><td>x</td></tr></tbody></table><h2 id="功能说明" tabindex="-1">功能说明 <a class="header-anchor" href="#功能说明" aria-label="Permalink to &quot;功能说明&quot;">​</a></h2><p>Reg矢量计算数据搬运接口，适用于从RegTensor连续对齐搬出到UB。</p><h2 id="函数原型" tabindex="-1">函数原型 <a class="header-anchor" href="#函数原型" aria-label="Permalink to &quot;函数原型&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 单搬出模式 POST_MODE_NORMAL场景</span></span>
<span class="line"><span>template &lt;typename T = DefaultType, StoreDist dist = StoreDist::DIST_NORM, typename U&gt;</span></span>
<span class="line"><span>__simd_callee__ inline void StoreAlign(__ubuf__ T* dstAddr, U&amp; srcReg, MaskReg&amp; mask);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 单搬出模式 POST_MODE_UPDATE场景</span></span>
<span class="line"><span>template &lt;typename T = DefaultType, PostLiteral postMode, StoreDist dist = StoreDist::DIST_NORM, typename U&gt;</span></span>
<span class="line"><span>__simd_callee__ inline void StoreAlign(__ubuf__ T*&amp; dstAddr, U&amp; srcReg, int32_t postUpdateStride, MaskReg&amp; mask);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 单搬出模式 使用AddrReg存储偏移量</span></span>
<span class="line"><span>template &lt;typename T = DefaultType, StoreDist dist = StoreDist::DIST_NORM, typename U&gt;</span></span>
<span class="line"><span>__simd_callee__ inline void StoreAlign(__ubuf__ T* dstAddr, U&amp; srcReg, AddrReg offset, MaskReg&amp; mask);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 双搬出模式 POST_MODE_NORMAL场景</span></span>
<span class="line"><span>template &lt;typename T = DefaultType, StoreDist dist, typename U&gt;</span></span>
<span class="line"><span>__simd_callee__ inline void StoreAlign(__ubuf__ T* dstAddr, U&amp; srcReg0, U&amp; srcReg1, MaskReg&amp; mask);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 双搬出模式 使用AddrReg 存储偏移量</span></span>
<span class="line"><span>template &lt;typename T = DefaultType, StoreDist dist, typename U&gt;</span></span>
<span class="line"><span>__simd_callee__ inline void StoreAlign(__ubuf__ T* dstAddr, U&amp; srcReg0, U&amp; srcReg1, AddrReg offset, MaskReg&amp; mask);</span></span></code></pre></div><h2 id="参数说明" tabindex="-1">参数说明 <a class="header-anchor" href="#参数说明" aria-label="Permalink to &quot;参数说明&quot;">​</a></h2><p><strong>表 1</strong> StoreDist模板参数说明（单搬出模式）</p><table tabindex="0"><thead><tr><th>StoreDist</th><th>含义</th><th>对齐约束（Byte）</th></tr></thead><tbody><tr><td>DIST_NORM_B8</td><td>正常模式，搬运VL数据，数据类型为b8。</td><td>32</td></tr><tr><td>DIST_NORM_B16</td><td>正常模式，搬运VL数据，数据类型为b16。</td><td>32</td></tr><tr><td>DIST_NORM_B32</td><td>正常模式，搬运VL数据，数据类型为b32。</td><td>32</td></tr><tr><td>DIST_FIRST_ELEMENT_B8</td><td>忽略mask，向dst中搬运src第一个元素，数据类型为b8。</td><td>1</td></tr><tr><td>DIST_FIRST_ELEMENT_B16</td><td>忽略mask，向dst中搬运src第一个元素，数据类型为b16。</td><td>2</td></tr><tr><td>DIST_FIRST_ELEMENT_B32</td><td>忽略mask，向dst中搬运src第一个元素，数据类型为b32。</td><td>4</td></tr><tr><td>DIST_PACK_B16</td><td>压缩模式，数据类型为b16，根据mask，将src中有效元素的低半部分bit数据连续存储于dst中 例：数据类型为uint16_t，mask配置为所有元素有效，dst长度需要为VL/2，执行结果如下： src: [0x3210, 0x7654, 0xBA98, 0xFEDC, ..., 0xFEDC, 0xBA98, 0x7654, 0x3210] dst: [0x5410, 0xDC98, ... 0x98DC, 0x1054]</td><td>min(32, VL/2)</td></tr><tr><td>DIST_PACK_B32</td><td>压缩模式，数据类型为b32，根据mask，将src中有效元素的低半部分bit数据连续存储于dst中。</td><td>min(32, VL/2)</td></tr><tr><td>DIST_PACK_B64</td><td>压缩模式，数据类型为b64，根据mask，将src中有效元素的低半部分bit数据连续存储于dst中。</td><td>min(32, VL/2)</td></tr><tr><td>DIST_PACK4_B32</td><td>压缩模式，数据类型为b32，根据mask，将src中有效元素的低8bit（四分之一）数据连续存储于dst中。</td><td>min(32, VL/4)</td></tr><tr><td>DIST_NORM</td><td>正常模式，搬运VL数据，支持数据类型b8/b16/b32，根据模板T确定。</td><td>32</td></tr></tbody></table><p><strong>表 2</strong> StoreDist模板参数说明（双搬出模式）</p><table tabindex="0"><thead><tr><th>StoreDist</th><th>含义</th><th>对齐约束(Byte)</th></tr></thead><tbody><tr><td>DIST_INTLV_B8</td><td>双搬出模式，数据类型为b8，忽略mask，将src0，src1中的元素交错存储于dst中，dst长度需要为VL*2。 例：数据类型为uint8_t： src0: [0, 2, 4, 6, ... 254, 0, 2, 4, ... 252, 254] src1: [1, 3, 5, 7, ... 255, 1, 3, 5, ... 253, 255] dst: [0, 1, 2, 3, ..., 254, 255, 0, 1, 2, 3, ... 253, 254, 255]</td><td>32</td></tr><tr><td>DIST_INTLV_B16</td><td>双搬出模式，数据类型为b16，忽略mask，将src0，src1中的元素交错存储于dst中，dst长度需要为VL*2。</td><td>32</td></tr><tr><td>DIST_INTLV_B32</td><td>双搬出模式，数据类型为b32，忽略mask，将src0，src1中的元素交错存储于dst中，dst长度需要为VL*2。</td><td>32</td></tr></tbody></table><p><strong>表 3</strong> 单搬出模式POST_MODE_NORMAL场景参数说明</p><table tabindex="0"><thead><tr><th>参数名</th><th>输入/输出</th><th>描述</th></tr></thead><tbody><tr><td>T</td><td>输入</td><td>模板参数。 Ascend 950PR/Ascend 950DT，支持的数据类型为b8/b16/b32/b64。</td></tr><tr><td>dist</td><td>输入</td><td>StoreDist模板参数，enum class类型，具体的取值请参考表1。</td></tr><tr><td>U</td><td>输入</td><td>RegTensor类型， 例如RegTensor&lt;half&gt;，由编译器自动推导，用户不需要填写。</td></tr><tr><td>dstAddr</td><td>输出</td><td>目的操作数在UB上的起始地址。</td></tr><tr><td>srcReg</td><td>输入</td><td>源操作数，类型为RegTensor。</td></tr><tr><td>mask</td><td>输入</td><td>MaskReg类型，指示在搬运过程中哪些元素有效。</td></tr></tbody></table><p><strong>表 4</strong> 单搬出模POST_MODE_UPDATE场景参数说明</p><table tabindex="0"><thead><tr><th>参数名</th><th>输入/输出</th><th>描述</th></tr></thead><tbody><tr><td>T</td><td>输入</td><td>模板参数。 Ascend 950PR/Ascend 950DT，支持的数据类型为b8/b16/b32/b64。</td></tr><tr><td>postMode</td><td>输入</td><td>用于控制是否使能post update，PostLiteral类型。</td></tr><tr><td>dist</td><td>输入</td><td>StoreDist模板参数，enum class类型，具体的取值请参考表1。</td></tr><tr><td>U</td><td>输入</td><td>RegTensor类型， 例如RegTensor&lt;half&gt;，由编译器自动推导，用户不需要填写。</td></tr><tr><td>dstAddr</td><td>输入/输出</td><td>目的操作数在UB上的起始地址。</td></tr><tr><td>srcReg</td><td>输入</td><td>源操作数，类型为RegTensor。</td></tr><tr><td>postUpdateStride</td><td>输入</td><td>实际搬运UB起始地址为dstAddr，搬运后自动执行地址更新：dstAddr += postUpdateStride。</td></tr><tr><td>mask</td><td>输入</td><td>MaskReg类型，指示在搬运过程中哪些元素有效。</td></tr></tbody></table><p><strong>表 5</strong> 单搬出模式使用AddrReg存储偏移量场景参数说明</p><table tabindex="0"><thead><tr><th>参数名</th><th>输入/输出</th><th>描述</th></tr></thead><tbody><tr><td>T</td><td>输入</td><td>模板参数。 Ascend 950PR/Ascend 950DT，支持的数据类型为b8/b16/b32/b64。</td></tr><tr><td>dist</td><td>输入</td><td>StoreDist模板参数，enum class类型，具体的取值请参考表1。</td></tr><tr><td>U</td><td>输入</td><td>RegTensor类型， 例如RegTensor&lt;half&gt;，由编译器自动推导，用户不需要填写。</td></tr><tr><td>dstAddr</td><td>输入/输出</td><td>目的操作数。</td></tr><tr><td>srcReg</td><td>输入</td><td>源操作数，类型为RegTensor。</td></tr><tr><td>offset</td><td>输入</td><td>实际搬运地址UB为dstAddr + offset。</td></tr><tr><td>mask</td><td>输入</td><td>MaskReg类型，指示在搬运过程中哪些元素有效。</td></tr></tbody></table><p><strong>表 6</strong> 双搬出模式POST_MODE_NORMAL场景参数说明</p><table tabindex="0"><thead><tr><th>参数名</th><th>输入/输出</th><th>描述</th></tr></thead><tbody><tr><td>T</td><td>输入</td><td>模板参数。 Ascend 950PR/Ascend 950DT，支持的数据类型为b8/b16/b32/b64。</td></tr><tr><td>dist</td><td>输入</td><td>StoreDist模板参数，enum class类型，具体的取值请参考表2。</td></tr><tr><td>U</td><td>输入</td><td>RegTensor类型， 例如RegTensor&lt;half&gt;，由编译器自动推导，用户不需要填写。</td></tr><tr><td>dstAddr</td><td>输出</td><td>目的操作数在UB上的起始地址。</td></tr><tr><td>srcReg0</td><td>输入</td><td>第一个源操作数，类型为RegTensor。</td></tr><tr><td>srcReg1</td><td>输入</td><td>第二个源操作数，类型为RegTensor。</td></tr><tr><td>mask</td><td>输入</td><td>MaskReg类型，指示在搬运过程中哪些元素有效。</td></tr></tbody></table><p><strong>表 7</strong> 双搬出模式使用AddrReg存储偏移量场景参数说明</p><table tabindex="0"><thead><tr><th>参数名</th><th>输入/输出</th><th>描述</th></tr></thead><tbody><tr><td>T</td><td>输入</td><td>模板参数，支持的数据类型为b8/b16/b32。</td></tr><tr><td>dist</td><td>输入</td><td>StoreDist模板参数，enum class类型，具体的取值请参考表2。</td></tr><tr><td>U</td><td>输入</td><td>RegTensor类型， 例如RegTensor&lt;half&gt;，由编译器自动推导，用户不需要填写。</td></tr><tr><td>dstAddr</td><td>输出</td><td>目的操作数在UB上的起始地址。</td></tr><tr><td>srcReg0</td><td>输入</td><td>第一个源操作数，类型为RegTensor。</td></tr><tr><td>srcReg1</td><td>输入</td><td>第二个源操作数，类型为RegTensor。</td></tr><tr><td>offset</td><td>输入</td><td>实际搬运地址UB为dstAddr + offset。</td></tr><tr><td>mask</td><td>输入</td><td>MaskReg类型，指示在搬运过程中哪些元素有效。</td></tr></tbody></table><h2 id="返回值说明" tabindex="-1">返回值说明 <a class="header-anchor" href="#返回值说明" aria-label="Permalink to &quot;返回值说明&quot;">​</a></h2><p>无</p><h2 id="约束说明" tabindex="-1">约束说明 <a class="header-anchor" href="#约束说明" aria-label="Permalink to &quot;约束说明&quot;">​</a></h2><p>b64数据类型只支持StoreDist中的DIST_NORM模式。</p><h2 id="调用示例" tabindex="-1">调用示例 <a class="header-anchor" href="#调用示例" aria-label="Permalink to &quot;调用示例&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 单搬入/单搬出 POST_MODE_NORMAL 场景</span></span>
<span class="line"><span>__simd_vf__ inline void ComputeMode01(__ubuf__ T* dstAddr, __ubuf__ T* srcAddr, uint32_t dstSize,</span></span>
<span class="line"><span>    uint32_t oneRepeatSize, uint16_t repeatTimes)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    AscendC::Reg::RegTensor&lt;T&gt; dstReg;</span></span>
<span class="line"><span>    AscendC::Reg::MaskReg mask;</span></span>
<span class="line"><span>    for (uint16_t i = 0; i &lt; repeatTimes; ++i) {</span></span>
<span class="line"><span>        mask = AscendC::Reg::UpdateMask&lt;T&gt;(dstSize);</span></span>
<span class="line"><span>        AscendC::Reg::LoadAlign(dstReg, srcAddr + i * oneRepeatSize);</span></span>
<span class="line"><span>        AscendC::Reg::StoreAlign(dstAddr + i * oneRepeatSize, dstReg, mask);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 单搬入/单搬出 POST_MODE_UPDATE 场景</span></span>
<span class="line"><span>__simd_vf__ inline void ComputeMode02(__ubuf__ T* dstAddr, __ubuf__ T* srcAddr, uint32_t dstSize,</span></span>
<span class="line"><span>    uint32_t oneRepeatSize, uint16_t repeatTimes)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    AscendC::Reg::RegTensor&lt;T&gt; dstReg;</span></span>
<span class="line"><span>    AscendC::Reg::MaskReg mask;</span></span>
<span class="line"><span>    for (uint16_t i = 0; i &lt; repeatTimes; ++i) {</span></span>
<span class="line"><span>        mask = AscendC::Reg::UpdateMask&lt;T&gt;(dstSize);</span></span>
<span class="line"><span>        AscendC::Reg::LoadAlign&lt;T, AscendC::Reg::PostLiteral::POST_MODE_UPDATE&gt;(dstReg, srcAddr, oneRepeatSize);</span></span>
<span class="line"><span>        AscendC::Reg::StoreAlign&lt;T, AscendC::Reg::PostLiteral::POST_MODE_UPDATE&gt;(dstAddr, dstReg, oneRepeatSize, mask);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 单搬入/单搬出使用 AddrReg 存储偏移量场景</span></span>
<span class="line"><span>__simd_vf__ inline void ComputeMode03(__ubuf__ T* dstAddr, __ubuf__ T* srcAddr, uint32_t oneRepeatSize, uint16_t repeatTimes)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    AscendC::Reg::RegTensor&lt;T&gt; dstReg;</span></span>
<span class="line"><span>    AscendC::Reg::MaskReg mask = AscendC::Reg::CreateMask&lt;T&gt;();</span></span>
<span class="line"><span>    AscendC::Reg::AddrReg aReg;</span></span>
<span class="line"><span>    for (uint16_t i = 0; i &lt; repeatTimes; ++i) {</span></span>
<span class="line"><span>        aReg = AscendC::Reg::CreateAddrReg&lt;T&gt;(i, oneRepeatSize);</span></span>
<span class="line"><span>        AscendC::Reg::LoadAlign(dstReg, srcAddr, aReg);</span></span>
<span class="line"><span>        AscendC::Reg::StoreAlign(dstAddr, dstReg, aReg, mask);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 双搬入/双搬出 POST_MODE_NORMAL 场景</span></span>
<span class="line"><span>__simd_vf__ inline void ComputeMode04(__ubuf__ T* dstAddr, __ubuf__ T* srcAddr, uint32_t oneRepeatSize,</span></span>
<span class="line"><span>    uint16_t repeatTimes)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    AscendC::Reg::RegTensor&lt;T&gt; srcReg0;</span></span>
<span class="line"><span>    AscendC::Reg::RegTensor&lt;T&gt; srcReg1;</span></span>
<span class="line"><span>    AscendC::Reg::MaskReg mask = AscendC::Reg::CreateMask&lt;uint8_t, AscendC::Reg::MaskPattern::ALL&gt;();</span></span>
<span class="line"><span>    for (uint16_t i = 0; i &lt; repeatTimes; ++i) {</span></span>
<span class="line"><span>        AscendC::Reg::LoadAlign&lt;T, AscendC::Reg::LoadDist::DIST_DINTLV_B8&gt;(srcReg0, srcReg0, srcAddr + i * oneRepeatSize);</span></span>
<span class="line"><span>        AscendC::Reg::StoreAlign&lt;T, AscendC::Reg::StoreDist::DIST_INTLV_B8&gt;(dstAddr + i * oneRepeatSize, srcReg0, srcReg1, mask);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 双搬入/双搬出使用 AddrReg 存储偏移量场景</span></span>
<span class="line"><span>__simd_vf__ inline void ComputeMode05(__ubuf__ T* dstAddr, __ubuf__ T* srcAddr, uint32_t oneRepeatSize, uint16_t repeatTimes)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    AscendC::Reg::RegTensor&lt;T&gt; srcReg0;</span></span>
<span class="line"><span>    AscendC::Reg::RegTensor&lt;T&gt; srcReg1;</span></span>
<span class="line"><span>    AscendC::Reg::MaskReg mask = AscendC::Reg::CreateMask&lt;T&gt;();</span></span>
<span class="line"><span>    AscendC::Reg::AddrReg aReg;</span></span>
<span class="line"><span>    for (uint16_t i = 0; i &lt; repeatTimes; ++i) {</span></span>
<span class="line"><span>        aReg = AscendC::Reg::CreateAddrReg&lt;T&gt;(i, oneRepeatSize);</span></span>
<span class="line"><span>        AscendC::Reg::LoadAlign&lt;T, AscendC::Reg::LoadDist::DIST_DINTLV_B8&gt;(srcReg0, srcReg1, srcAddr, aReg);</span></span>
<span class="line"><span>        AscendC::Reg::StoreAlign&lt;T, AscendC::Reg::StoreDist::DIST_INTLV_B8&gt;(dstAddr, srcReg0, srcReg1, aReg, mask);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div>`,28)])])}const R=s(d,[["render",p]]);export{o as __pageData,R as default};
