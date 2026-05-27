import{c as n,Q as s,j as t,m as e}from"./chunks/framework.DOi4mjdC.js";const _=JSON.parse('{"title":"连续非对齐搬入","description":"","frontmatter":{},"headers":[{"level":1,"title":"连续非对齐搬入","slug":"连续非对齐搬入"},{"level":2,"title":"产品支持情况","slug":"产品支持情况"},{"level":2,"title":"功能说明","slug":"功能说明"},{"level":2,"title":"函数原型","slug":"函数原型"},{"level":2,"title":"参数说明","slug":"参数说明"},{"level":2,"title":"约束说明","slug":"约束说明"},{"level":2,"title":"调用示例","slug":"调用示例"}],"relativePath":"api/SIMD-API/基础API/Reg矢量计算/Reg数据搬运/连续非对齐搬入.md","filePath":"api/SIMD-API/基础API/Reg矢量计算/Reg数据搬运/连续非对齐搬入.md"}'),d={name:"api/SIMD-API/基础API/Reg矢量计算/Reg数据搬运/连续非对齐搬入.md"};function p(l,a,r,i,o,g){return s(),t("div",null,[...a[0]||(a[0]=[e(`<h1 id="连续非对齐搬入" tabindex="-1">连续非对齐搬入 <a class="header-anchor" href="#连续非对齐搬入" aria-label="Permalink to &quot;连续非对齐搬入&quot;">​</a></h1><h2 id="产品支持情况" tabindex="-1">产品支持情况 <a class="header-anchor" href="#产品支持情况" aria-label="Permalink to &quot;产品支持情况&quot;">​</a></h2><table tabindex="0"><thead><tr><th>产品</th><th>是否支持</th></tr></thead><tbody><tr><td>Ascend 950PR/Ascend 950DT</td><td>√</td></tr><tr><td>Atlas A3 训练系列产品/Atlas A3 推理系列产品</td><td>x</td></tr><tr><td>Atlas A2 训练系列产品/Atlas A2 推理系列产品</td><td>x</td></tr><tr><td>Atlas 200I/500 A2 推理产品</td><td>x</td></tr><tr><td>Atlas 推理系列产品AI Core</td><td>x</td></tr><tr><td>Atlas 推理系列产品Vector Core</td><td>x</td></tr><tr><td>Atlas 训练系列产品</td><td>x</td></tr></tbody></table><h2 id="功能说明" tabindex="-1">功能说明 <a class="header-anchor" href="#功能说明" aria-label="Permalink to &quot;功能说明&quot;">​</a></h2><p>Reg矢量计算数据搬运接口，适用于从UB非32B对齐地址起始连续搬入RegTensor。</p><h2 id="函数原型" tabindex="-1">函数原型 <a class="header-anchor" href="#函数原型" aria-label="Permalink to &quot;函数原型&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// LoadUnAlignPre接口用于在进行非对齐搬入前的初始化，适用于场景1和场景2</span></span>
<span class="line"><span>template &lt;typename T&gt;</span></span>
<span class="line"><span>__simd_callee__ inline void LoadUnAlignPre(UnalignRegForLoad&amp; ureg, __ubuf__ T* srcAddr);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// LoadUnAlignPre接口用于在进行非对齐搬入前的初始化，适用于场景3</span></span>
<span class="line"><span>template &lt;typename T&gt;</span></span>
<span class="line"><span>__simd_callee__ inline void LoadUnAlignPre(UnalignRegForLoad&amp; ureg, __ubuf__ T* srcAddr, AddrReg&amp; areg);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 场景1:使用uint32_t作为偏移量，使用post mode搬运 ，每调用一次接口更新源操作数在UB上的地址</span></span>
<span class="line"><span>template &lt;typename T = DefaultType, PostLiteral postMode = PostLiteral::POST_MODE_UPDATE, typename U&gt;</span></span>
<span class="line"><span>__simd_callee__ inline void LoadUnAlign(U&amp; dstReg, UnalignRegForLoad&amp; ureg, __ubuf__ T*&amp; srcAddr, uint32_t postUpdateStride);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 场景2:调用接口不改变源操作数在UB上的地址，每次Repeat需要手动更新源操作数在UB上的地址</span></span>
<span class="line"><span>template &lt;typename T = DefaultType, typename U&gt;</span></span>
<span class="line"><span>__simd_callee__ inline void LoadUnAlign(U&amp; dstReg, UnalignRegForLoad&amp; ureg, __ubuf__ T* srcAddr);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 场景3:使用 AddrReg 存储偏移量进行数据搬运</span></span>
<span class="line"><span>template &lt;typename T = DefaultType, typename U&gt;</span></span>
<span class="line"><span>__simd_callee__ inline void LoadUnAlign(U&amp; dstReg, UnalignRegForLoad&amp; ureg, __ubuf__ T*&amp; srcAddr, AddrReg&amp; areg, uint32_t inc);</span></span></code></pre></div><h2 id="参数说明" tabindex="-1">参数说明 <a class="header-anchor" href="#参数说明" aria-label="Permalink to &quot;参数说明&quot;">​</a></h2><p><strong>表 1</strong> 连续非对齐搬入使用uint32_t存储偏移量场景参数说明</p><table tabindex="0"><thead><tr><th>参数名</th><th>输入/输出</th><th>描述</th></tr></thead><tbody><tr><td>T</td><td>输入</td><td>模板参数。 Ascend 950PR/Ascend 950DT，支持的数据类型为b8/b16/b32/b64。</td></tr><tr><td>postMode</td><td>输入</td><td>用于控制是否使能post update，PostLiteral类型。</td></tr><tr><td>U</td><td>输入</td><td>模板参数，支持的数据类型对应的RegTensor类型。</td></tr><tr><td>ureg</td><td>输出/输入</td><td>UnalignRegForLoad，非对齐寄存器，用于保存非对齐数据，长度32B。LoadUnAlignPre函数中作为输出，LoadUnAlign函数中作为输入/输出。</td></tr><tr><td>dstReg</td><td>输出</td><td>目的操作数，类型为RegTensor。</td></tr><tr><td>srcAddr</td><td>输入/输出</td><td>源操作数在UB上的起始地址。</td></tr><tr><td>postUpdateStride</td><td>输入</td><td>仅支持POST_MODE_UPDATE场景：实际搬运UB起始地址为srcAddr，搬运后执行地址更新srcAddr += postUpdateStride。</td></tr></tbody></table><p><strong>表 2</strong> 连续非对齐搬入使用AddrReg存储偏移量场景参数说明</p><table tabindex="0"><thead><tr><th>参数名</th><th>输入/输出</th><th>描述</th></tr></thead><tbody><tr><td>ureg</td><td>输出/输入</td><td>UnalignRegForLoad，非对齐寄存器，用于保存非对齐数据，长度32B。LoadUnAlignPre函数中作为输出，LoadUnAlign函数中作为输入/输出。</td></tr><tr><td>dstReg</td><td>输出</td><td>目的操作数，类型为RegTensor。</td></tr><tr><td>srcAddr</td><td>输入/输出</td><td>源操作数在UB上的起始地址。</td></tr><tr><td>areg</td><td>输入</td><td>AddrReg数据类型，存储地址偏移量offset。实际搬运UB起始地址为srcAddr + offset。</td></tr><tr><td>inc</td><td>输入</td><td>搬运完成后offset 在自增前被更新为offset + inc。</td></tr></tbody></table><h2 id="约束说明" tabindex="-1">约束说明 <a class="header-anchor" href="#约束说明" aria-label="Permalink to &quot;约束说明&quot;">​</a></h2><ul><li>该接口中的srcAddr不需要32B对齐。</li><li>LoadUnAlignPre与LoadUnAlign接口需要组合使用。</li></ul><h2 id="调用示例" tabindex="-1">调用示例 <a class="header-anchor" href="#调用示例" aria-label="Permalink to &quot;调用示例&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 连续非对齐搬入使用 uint32_t 存储偏移量场景</span></span>
<span class="line"><span>template &lt;typename T&gt;</span></span>
<span class="line"><span>__simd_vf__ inline void LoadUnAlignVF(__ubuf__ T* dstAddr, __ubuf__ T* srcAddr, uint32_t postUpdateStride, uint16_t repeatTimes)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    AscendC::Reg::RegTensor&lt;T&gt; srcReg;</span></span>
<span class="line"><span>    AscendC::Reg::UnalignRegForLoad ureg0;</span></span>
<span class="line"><span>    AscendC::Reg::UnalignRegForStore ureg1;   </span></span>
<span class="line"><span>    for (uint16_t i = 0; i &lt; repeatTimes; ++i) {</span></span>
<span class="line"><span>        AscendC::Reg::LoadUnAlignPre(ureg0, srcAddr + i * postUpdateStride);</span></span>
<span class="line"><span>        AscendC::Reg::LoadUnAlign(srcReg, ureg0, srcAddr + i * postUpdateStride);</span></span>
<span class="line"><span>        AscendC::Reg::StoreUnAlign(dstAddr, srcReg, ureg1, postUpdateStride);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    AscendC::Reg::StoreUnAlignPost(dstAddr, ureg1, 0);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 连续非对齐搬入使用 AddrReg 存储偏移量场景</span></span>
<span class="line"><span>template &lt;typename T&gt;</span></span>
<span class="line"><span>__simd_vf__ inline void LoadUnAlignVF(__ubuf__ T* dstAddr, __ubuf__ T* srcAddr, uint32_t oneRepeatSize, uint16_t repeatTimes)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    AscendC::Reg::RegTensor&lt;T&gt; srcReg;</span></span>
<span class="line"><span>    AscendC::Reg::UnalignRegForLoad ureg0;</span></span>
<span class="line"><span>    AscendC::Reg::UnalignRegForStore ureg1;</span></span>
<span class="line"><span>    AscendC::Reg::AddrReg aReg;</span></span>
<span class="line"><span>    for (uint16_t i = 0; i &lt; repeatTimes; ++i) {</span></span>
<span class="line"><span>        aReg = AscendC::Reg::CreateAddrReg&lt;T&gt;(i, oneRepeatSize);</span></span>
<span class="line"><span>        AscendC::Reg::LoadUnAlignPre(ureg0, srcAddr, aReg);</span></span>
<span class="line"><span>        AscendC::Reg::LoadUnAlign(srcReg, ureg0, srcAddr, aReg, 0);</span></span>
<span class="line"><span>        AscendC::Reg::StoreUnAlign(dstAddr, srcReg, ureg1, aReg);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    AscendC::Reg::StoreUnAlignPost(dstAddr, ureg1, aReg);</span></span>
<span class="line"><span>}</span></span></code></pre></div>`,16)])])}const A=n(d,[["render",p]]);export{_ as __pageData,A as default};
