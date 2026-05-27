import{c as s,Q as a,j as e,m as t}from"./chunks/framework.DOi4mjdC.js";const _=JSON.parse('{"title":"连续非对齐搬出","description":"","frontmatter":{},"headers":[{"level":1,"title":"连续非对齐搬出","slug":"连续非对齐搬出"},{"level":2,"title":"产品支持情况","slug":"产品支持情况"},{"level":2,"title":"功能说明","slug":"功能说明"},{"level":2,"title":"函数原型","slug":"函数原型"},{"level":2,"title":"参数说明","slug":"参数说明"},{"level":2,"title":"约束说明","slug":"约束说明"},{"level":2,"title":"调用示例","slug":"调用示例"}],"relativePath":"api/SIMD-API/基础API/Reg矢量计算/Reg数据搬运/连续非对齐搬出.md","filePath":"api/SIMD-API/基础API/Reg矢量计算/Reg数据搬运/连续非对齐搬出.md"}'),p={name:"api/SIMD-API/基础API/Reg矢量计算/Reg数据搬运/连续非对齐搬出.md"};function d(l,n,r,i,o,g){return a(),e("div",null,[...n[0]||(n[0]=[t(`<h1 id="连续非对齐搬出" tabindex="-1">连续非对齐搬出 <a class="header-anchor" href="#连续非对齐搬出" aria-label="Permalink to &quot;连续非对齐搬出&quot;">​</a></h1><h2 id="产品支持情况" tabindex="-1">产品支持情况 <a class="header-anchor" href="#产品支持情况" aria-label="Permalink to &quot;产品支持情况&quot;">​</a></h2><table tabindex="0"><thead><tr><th>产品</th><th>是否支持</th></tr></thead><tbody><tr><td>Ascend 950PR/Ascend 950DT</td><td>√</td></tr><tr><td>Atlas A3 训练系列产品/Atlas A3 推理系列产品</td><td>x</td></tr><tr><td>Atlas A2 训练系列产品/Atlas A2 推理系列产品</td><td>x</td></tr><tr><td>Atlas 200I/500 A2 推理产品</td><td>x</td></tr><tr><td>Atlas 推理系列产品AI Core</td><td>x</td></tr><tr><td>Atlas 推理系列产品Vector Core</td><td>x</td></tr><tr><td>Atlas 训练系列产品</td><td>x</td></tr></tbody></table><h2 id="功能说明" tabindex="-1">功能说明 <a class="header-anchor" href="#功能说明" aria-label="Permalink to &quot;功能说明&quot;">​</a></h2><p>Reg矢量计算数据搬运接口，适用于从RegTensor连续非对齐搬出到UB。</p><h2 id="函数原型" tabindex="-1">函数原型 <a class="header-anchor" href="#函数原型" aria-label="Permalink to &quot;函数原型&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 场景1:使用uint32_t作为存储偏移量，使用post mode进行搬运，每调用一次接口更新目的操作数在UB上的地址</span></span>
<span class="line"><span>template &lt;typename T = DefaultType, PostLiteral postMode = PostLiteral::POST_MODE_UPDATE, typename U&gt;</span></span>
<span class="line"><span>__simd_callee__ inline void StoreUnAlign(__ubuf__ T*&amp; dstAddr, U&amp; srcReg, UnalignRegForStore&amp; ureg, uint32_t postUpdateStride); </span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 处理非对齐搬运的尾块，适用于场景1</span></span>
<span class="line"><span>template &lt;typename T, PostLiteral postMode = PostLiteral::POST_MODE_UPDATE&gt;</span></span>
<span class="line"><span>__simd_callee__ inline void StoreUnAlignPost(__ubuf__ T*&amp; dstAddr, UnalignRegForStore&amp; ureg, int32_t postUpdateStride);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 场景2：使用 AddrReg 存储偏移量进行搬运，使用post mode进行搬运，每调用一次接口更新目的操作数在UB上的地址</span></span>
<span class="line"><span>template &lt;typename T = DefaultType, PostLiteral postMode = PostLiteral::POST_MODE_UPDATE, typename U&gt;</span></span>
<span class="line"><span>__simd_callee__ inline void StoreUnAlign(__ubuf__ T*&amp; dstAddr, U&amp; srcReg, UnalignRegForStore&amp; ureg, AddrReg&amp; areg);</span></span>
<span class="line"><span>// 处理非对齐搬运的尾块，适用于场景2</span></span>
<span class="line"><span>template &lt;typename T&gt;</span></span>
<span class="line"><span>__simd_callee__ inline void StoreUnAlignPost(__ubuf__ T*&amp; dstAddr, UnalignRegForStore&amp; ureg, AddrReg&amp; areg);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 场景3：配合Squeeze使用，连续非对齐搬出，SqueezeReg矢量计算API会存储有效元素的总字节数到AR特殊寄存器，使用此接口会将AR寄存器中效元素个数作为存储偏移量</span></span>
<span class="line"><span>template &lt;typename T = DefaultType, PostLiteral postMode = PostLiteral::POST_MODE_UPDATE, typename U&gt;</span></span>
<span class="line"><span>__simd_callee__ inline void StoreUnAlign(__ubuf__ T* dstAddr, U&amp; srcReg, UnalignRegForStore&amp; ureg);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 处理非对齐搬运的尾块，适用于场景3</span></span>
<span class="line"><span>template &lt;typename T&gt;</span></span>
<span class="line"><span>__simd_callee__ inline void StoreUnAlignPost(__ubuf__ T* dstAddr, UnalignRegForStore&amp; ureg);</span></span></code></pre></div><h2 id="参数说明" tabindex="-1">参数说明 <a class="header-anchor" href="#参数说明" aria-label="Permalink to &quot;参数说明&quot;">​</a></h2><p><strong>表 1</strong> 连续非对齐搬出使用int32_t存储偏移量场景</p><table tabindex="0"><thead><tr><th>参数名</th><th>输入/输出</th><th>描述</th></tr></thead><tbody><tr><td>T</td><td>输入</td><td>模板参数。 Ascend 950PR/Ascend 950DT，支持的数据类型为b8/b16/b32/b64。</td></tr><tr><td>postMode</td><td>输入</td><td>用于控制是否使能post update，PostLiteral类型。</td></tr><tr><td>U</td><td>输入</td><td>模板参数，模板参数T支持的数据类型对应的RegTensor类型。</td></tr><tr><td>ureg</td><td>输出/输入</td><td>UnalignRegForStore，非对齐寄存器，用于保存非对齐数据，长度32B。StoreUnAlign函数中作为输入/输出，StoreUnAlignPost函数中作为输入。</td></tr><tr><td>srcReg</td><td>输入</td><td>源操作数，类型为RegTensor。</td></tr><tr><td>dstAddr</td><td>输入/输出</td><td>目的操作数在UB上的起始地址。</td></tr><tr><td>postUpdateStride</td><td>输入</td><td>POST_MODE_NORMAL与POST_MODE_UPDATE场景下postUpdateStride含义不一致。 POST_MODE_NORMAL场景：实际搬运UB起始地址为dstAddr，搬运数量为postUpdateStride。POST_MODE_UPDATE场景：实际搬运UB起始地址为dstAddr，搬运数量为postUpdateStride，搬运后执行地址更新dstAddr += postUpdateStride。</td></tr></tbody></table><p><strong>表 2</strong> 连续非对齐搬出使用AddrReg存储偏移量场景</p><table tabindex="0"><thead><tr><th>参数名</th><th>输入/输出</th><th>描述</th></tr></thead><tbody><tr><td>ureg</td><td>输出/输入</td><td>UnalignRegForStore，非对齐寄存器，用于保存非对齐数据，长度32B。StoreUnAlign函数中作为输入/输出，StoreUnAlignPost函数中作为输入。</td></tr><tr><td>srcReg</td><td>输入</td><td>源操作数，类型为RegTensor。</td></tr><tr><td>dstAddr</td><td>输入/输出</td><td>目的操作数在UB上的起始地址。</td></tr><tr><td>areg</td><td>输入</td><td>实际搬运UB起始地址为 AddrReg数据类型，存储地址偏移量offset。实际搬运UB起始地址为srcAddr + offset。</td></tr></tbody></table><p><strong>表 3</strong> 配合Squeeze使用，连续非对齐搬出，使用AR寄存器中有效元素个数作为存储偏移量</p><table tabindex="0"><thead><tr><th>参数名</th><th>输入/输出</th><th>描述</th></tr></thead><tbody><tr><td>dstAddr</td><td>输入/输出</td><td>目的操作数在UB上的起始地址。</td></tr><tr><td>ureg</td><td>输出/输入</td><td>UnalignRegForStore，非对齐寄存器，用于保存非对齐数据，长度32B。StoreUnAlign函数中作为输入/输出，StoreUnAlignPost函数中作为输入。</td></tr><tr><td>srcReg</td><td>输入</td><td>源操作数，类型为RegTensor。</td></tr></tbody></table><h2 id="约束说明" tabindex="-1">约束说明 <a class="header-anchor" href="#约束说明" aria-label="Permalink to &quot;约束说明&quot;">​</a></h2><ul><li>该接口中的dstAddr不需要32B对齐。</li><li>StoreUnAlign与StoreUnAlignPost接口组合使用。</li></ul><h2 id="调用示例" tabindex="-1">调用示例 <a class="header-anchor" href="#调用示例" aria-label="Permalink to &quot;调用示例&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 连续非对齐搬出使用 uint32_t 存储偏移量场景</span></span>
<span class="line"><span>template &lt;typename T&gt;</span></span>
<span class="line"><span>__simd_vf__ inline void StoreUnAlignVF(__ubuf__ T* dstAddr, __ubuf__ T* srcAddr, uint32_t postUpdateStride, uint16_t repeatTimes)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    AscendC::Reg::RegTensor&lt;T&gt; srcReg;</span></span>
<span class="line"><span>    AscendC::Reg::UnalignRegForLoad ureg0;</span></span>
<span class="line"><span>    AscendC::Reg::UnalignRegForStore ureg1;</span></span>
<span class="line"><span>    for (uint16_t i = 0; i &lt; repeatTimes; ++i) {</span></span>
<span class="line"><span>        AscendC::Reg::LoadUnAlignPre(ureg0, srcAddr + i * postUpdateStride);</span></span>
<span class="line"><span>        AscendC::Reg::LoadUnAlign(srcReg, ureg0, srcAddr + i * postUpdateStride);</span></span>
<span class="line"><span>        AscendC::Reg::StoreUnAlign(dstAddr, srcReg, ureg1, postUpdateStride);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    AscendC::Reg::StoreUnAlignPost(dstAddr, ureg1, 0);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 连续非对齐搬出使用 AddrReg 存储偏移量场景</span></span>
<span class="line"><span>template &lt;typename T&gt;</span></span>
<span class="line"><span>__simd_vf__ inline void StoreUnAlignVF(__ubuf__ T* dstAddr, __ubuf__ T* srcAddr, uint32_t oneRepeatSize, uint16_t repeatTimes)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    AscendC::Reg::RegTensor&lt;T&gt; srcReg;    </span></span>
<span class="line"><span>    AscendC::Reg::UnalignRegForLoad ureg0;</span></span>
<span class="line"><span>    AscendC::Reg::UnalignRegForStore ureg1;</span></span>
<span class="line"><span>    AscendC::Reg::AddrReg aReg;</span></span>
<span class="line"><span>    for (uint16_t i = 0; i &lt; (uint16_t)repeatTimes; ++i) {</span></span>
<span class="line"><span>        aReg = AscendC::Reg::CreateAddrReg&lt;T&gt;(i, oneRepeatSize);</span></span>
<span class="line"><span>        AscendC::Reg::LoadUnAlignPre(ureg0, srcAddr, aReg);</span></span>
<span class="line"><span>        AscendC::Reg::LoadUnAlign(srcReg, ureg0, srcAddr, aReg, 0);</span></span>
<span class="line"><span>        AscendC::Reg::StoreUnAlign(dstAddr, srcReg, ureg1, aReg);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    AscendC::Reg::StoreUnAlignPost(dstAddr, ureg1, aReg);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 配合Squeeze使用，连续非对齐搬出，SqueezeReg矢量计算API会存储有效元素的总字节数到AR寄存器，使用AR寄存器中效元素个数作为存储偏移量</span></span>
<span class="line"><span>template &lt;typename T&gt;</span></span>
<span class="line"><span>__aicore__ inline void SqueezeVF(__ubuf__ T* dstAddr, __ubuf__ T* srcAddr, uint32_t oneRepeatSize, uint16_t repeatTimes)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    AscendC::Reg::RegTensor&lt;T&gt; srcReg0;</span></span>
<span class="line"><span>    AscendC::Reg::RegTensor&lt;T&gt; srcReg1;</span></span>
<span class="line"><span>    AscendC::Reg::UnalignRegForStore ureg;</span></span>
<span class="line"><span>    AscendC::Reg::MaskReg mask = AscendC::Reg::CreateMask&lt;T, AscendC::Reg::MaskPattern::H&gt;();</span></span>
<span class="line"><span>    for (uint16_t i = 0; i &lt; repeatTimes; ++i) {</span></span>
<span class="line"><span>        AscendC::Reg::LoadAlign&lt;T, AscendC::Reg::PostLiteral::POST_MODE_UPDATE&gt;(srcReg0, srcAddr, oneRepeatSize);</span></span>
<span class="line"><span>        AscendC::Reg::Squeeze&lt;T, AscendC::Reg::GatherMaskMode::STORE_REG&gt;(srcReg1, srcReg0, mask);</span></span>
<span class="line"><span>        AscendC::Reg::StoreUnAlign&lt;T, AscendC::Reg::PostLiteral::POST_MODE_UPDATE&gt;(dstAddr, srcReg1, ureg);</span></span>
<span class="line"><span>     }</span></span>
<span class="line"><span>     AscendC::Reg::StoreUnAlignPost(dstAddr, ureg);</span></span>
<span class="line"><span>}</span></span></code></pre></div>`,18)])])}const A=s(p,[["render",d]]);export{_ as __pageData,A as default};
