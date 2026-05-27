import{c as s,Q as a,j as n,m as d}from"./chunks/framework.DOi4mjdC.js";const g=JSON.parse('{"title":"连续对齐搬入","description":"","frontmatter":{},"headers":[{"level":1,"title":"连续对齐搬入","slug":"连续对齐搬入"},{"level":2,"title":"产品支持情况","slug":"产品支持情况"},{"level":2,"title":"功能说明","slug":"功能说明"},{"level":2,"title":"函数原型","slug":"函数原型"},{"level":2,"title":"参数说明","slug":"参数说明"},{"level":2,"title":"返回值说明","slug":"返回值说明"},{"level":2,"title":"约束说明","slug":"约束说明"},{"level":2,"title":"调用示例","slug":"调用示例"}],"relativePath":"api/SIMD-API/基础API/Reg矢量计算/Reg数据搬运/连续对齐搬入.md","filePath":"api/SIMD-API/基础API/Reg矢量计算/Reg数据搬运/连续对齐搬入.md"}'),e={name:"api/SIMD-API/基础API/Reg矢量计算/Reg数据搬运/连续对齐搬入.md"};function p(r,t,l,i,c,o){return a(),n("div",null,[...t[0]||(t[0]=[d(`<h1 id="连续对齐搬入" tabindex="-1">连续对齐搬入 <a class="header-anchor" href="#连续对齐搬入" aria-label="Permalink to &quot;连续对齐搬入&quot;">​</a></h1><h2 id="产品支持情况" tabindex="-1">产品支持情况 <a class="header-anchor" href="#产品支持情况" aria-label="Permalink to &quot;产品支持情况&quot;">​</a></h2><table tabindex="0"><thead><tr><th>产品</th><th>是否支持</th></tr></thead><tbody><tr><td>Ascend 950PR/Ascend 950DT</td><td>√</td></tr><tr><td>Atlas A3 训练系列产品/Atlas A3 推理系列产品</td><td>x</td></tr><tr><td>Atlas A2 训练系列产品/Atlas A2 推理系列产品</td><td>x</td></tr><tr><td>Atlas 200I/500 A2 推理产品</td><td>x</td></tr><tr><td>Atlas 推理系列产品AI Core</td><td>x</td></tr><tr><td>Atlas 推理系列产品Vector Core</td><td>x</td></tr><tr><td>Atlas 训练系列产品</td><td>x</td></tr></tbody></table><h2 id="功能说明" tabindex="-1">功能说明 <a class="header-anchor" href="#功能说明" aria-label="Permalink to &quot;功能说明&quot;">​</a></h2><p>Reg矢量计算数据搬运接口，适用于从UB连续对齐搬入RegTensor。单搬入模式下，可以将数据从UB搬运到一个目的寄存器，双搬入模式下，可以将数据从UB搬运到两个目的寄存器。</p><h2 id="函数原型" tabindex="-1">函数原型 <a class="header-anchor" href="#函数原型" aria-label="Permalink to &quot;函数原型&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 单搬入模式 POST_MODE_NORMAL场景</span></span>
<span class="line"><span>template &lt;typename T = DefaultType, LoadDist dist = LoadDist::DIST_NORM, typename U&gt;</span></span>
<span class="line"><span>__simd_callee__ inline void LoadAlign(U&amp; dstReg, __ubuf__ T* srcAddr);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 单搬入模式 POST_MODE_UPDATE场景</span></span>
<span class="line"><span>template &lt;typename T = DefaultType, PostLiteral postMode, LoadDist dist = LoadDist::DIST_NORM, typename U&gt;</span></span>
<span class="line"><span>__simd_callee__ inline void LoadAlign(U&amp; dstReg, __ubuf__ T*&amp; srcAddr, int32_t postUpdateStride);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 单搬入模式 使用AddrReg存储偏移量</span></span>
<span class="line"><span>template &lt;typename T = DefaultType, LoadDist dist = LoadDist::DIST_NORM, typename U&gt;</span></span>
<span class="line"><span>__simd_callee__ inline void LoadAlign(U&amp; dstReg, __ubuf__ T* srcAddr, AddrReg offset);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 双搬入模式 POST_MODE_NORMAL场景</span></span>
<span class="line"><span>template &lt;typename T = DefaultType, LoadDist dist, typename U&gt;</span></span>
<span class="line"><span>__simd_callee__ inline void LoadAlign(U&amp; dstReg0, U&amp; dstReg1, __ubuf__ T* srcAddr);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 双搬入模式 POST_MODE_UPDATE场景</span></span>
<span class="line"><span>template &lt;typename T = DefaultType, PostLiteral postMode, LoadDist dist, typename U&gt;</span></span>
<span class="line"><span>__simd_callee__ inline void LoadAlign(U&amp; dstReg0, U&amp; dstReg1, __ubuf__ T*&amp; srcAddr, int32_t postUpdateStride);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 双搬入模式使用 AddrReg存储偏移量</span></span>
<span class="line"><span>template &lt;typename T = DefaultType, LoadDist dist, typename U&gt;</span></span>
<span class="line"><span>__simd_callee__ inline void LoadAlign(U&amp; dstReg0, U&amp; dstReg1, __ubuf__ T* srcAddr, AddrReg offset);</span></span></code></pre></div><h2 id="参数说明" tabindex="-1">参数说明 <a class="header-anchor" href="#参数说明" aria-label="Permalink to &quot;参数说明&quot;">​</a></h2><p><strong>表 1</strong> LoadDist模板参数说明（单搬入模式）</p><table tabindex="0"><thead><tr><th>LoadDist取值</th><th>含义</th><th>搬运对齐约束（Byte）</th></tr></thead><tbody><tr><td>DIST_NORM</td><td>正常模式，搬运VL数据</td><td>32</td></tr><tr><td>DIST_BRC_B8</td><td>搬运一个b8类型的数据，并Broadcast到所有元素位置</td><td>1</td></tr><tr><td>DIST_BRC_B16</td><td>搬运一个b16类型的数据，并Broadcast到所有元素位置</td><td>2</td></tr><tr><td>DIST_BRC_B32</td><td>搬运一个b32类型的数据，并Broadcast到所有元素位置</td><td>4</td></tr><tr><td>DIST_US_B8</td><td>数据2倍上采样，加载VL/2个数据，每个输入元素重复两次，数据类型为b8</td><td>min(32, VL/2)</td></tr><tr><td>DIST_US_B16</td><td>数据2倍上采样，加载VL/2个数据，每个输入元素重复两次，数据类型为b16</td><td>min(32, VL/2)</td></tr><tr><td>DIST_DS_B8</td><td>数据2倍下采样，加载2倍VL的数据，数据每隔一个保留，数据类型为b8</td><td>32</td></tr><tr><td>DIST_DS_B16</td><td>数据2倍下采样，加载2倍VL的数据，数据每隔一个保留，数据类型为b16</td><td>32</td></tr><tr><td>DIST_UNPACK_B8</td><td>解压缩模式，按无符号整型u8加载VL/2长度数据，unpack到VL长度u16类型，中间位置补0 例，VL=256B： src: [0x00, 0x01, 0x02, 0x03, ..., 0xFF, ...] dst:[0x0000, 0x0001, ..., 0x0007F]</td><td>min(32, VL/2)</td></tr><tr><td>DIST_UNPACK_B16</td><td>解压缩模式，按无符号整型u16加载VL/2长度数据，unpack到VL长度u32类型，中间位置补0 例，VL=256B： src: [0x0000, 0x0001, 0x0002, 0x0003, ..., 0x007F, ...] dst:[0x00000000, 0x00000001, ..., 0x000003F]</td><td>min(32, VL/2)</td></tr><tr><td>DIST_BLK</td><td>读取一个DataBlock（32B），并广播到VL</td><td>32</td></tr><tr><td>DIST_E2B_B16</td><td>加载(VL/DataBlock)B的数据，并将每个元素（16bit）广播到一个DataBlock（32B）中。</td><td>VL/16</td></tr><tr><td>DIST_E2B_B32</td><td>加载(VL/DataBlock)B的数据，并将每个元素（32bit）广播到一个DataBlock（32B）中。</td><td>VL/8</td></tr><tr><td>DIST_UNPACK_B32</td><td>解压缩模式，按无符号整型u32加载VL/2长度数据，unpack到VL长度u64类型，中间位置补0 例，VL=256B： src: [0x00000000, 0x00000001, 0x00000002, ..., 0x000003F, ...] dst:[0x0000000000000000, 0x0000000000000001, ..., 0x000000000000001F]</td><td>min(32, VL/2)</td></tr><tr><td>DIST_UNPACK4_B8</td><td>解压缩模式，按无符号整型u8加载VL/4长度数据，unpack到VL长度u32类型，中间位置补0 例，VL=256B： src: [0x00, 0x01, 0x02, 0x03, ..., 0xFF, ...] dst:[0x00000000, 0x00000001, ..., 0x000003F]</td><td>min(32, VL/4)</td></tr></tbody></table><p><strong>表 2</strong> LoadDist模板参数说明（双搬入模式）</p><table tabindex="0"><thead><tr><th>LoadDist取值</th><th>含义</th><th>搬运对齐约束（Byte）</th></tr></thead><tbody><tr><td>DIST_DINTLV_B8</td><td>双搬入模式，基于元素的交错搬运，从src中读取2*VL长度数据，将偶数索引的元素存入dst0，将奇数索引的元素存入dst1，数据类型为b8</td><td>32</td></tr><tr><td>DIST_DINTLV_B16</td><td>双搬入模式，基于元素的交错搬运，从src中读取2*VL长度数据，将偶数索引的元素存入dst0，将奇数索引的元素存入dst1，数据类型为b16</td><td>32</td></tr><tr><td>DIST_DINTLV_B32</td><td>双搬入模式，基于元素的交错搬运，从src中读取2*VL长度数据，将偶数索引的元素存入dst0，将奇数索引的元素存入dst1，数据类型为b32</td><td>32</td></tr></tbody></table><p><strong>表 3</strong> 单搬入模式POST_MODE_NORMAL场景参数说明</p><table tabindex="0"><thead><tr><th>参数名</th><th>输入/输出</th><th>描述</th></tr></thead><tbody><tr><td>T</td><td>输入</td><td>操作数数据类型。 Ascend 950PR/Ascend 950DT，支持的数据类型为b8/b16/b32/b64。</td></tr><tr><td>dist</td><td>输入</td><td>搬运模式，LoadDist类型，具体的取值请参考表1。</td></tr><tr><td>U</td><td>输入</td><td>目的操作数的RegTensor类型，例如RegTensor&lt;half&gt;，由编译器自动推导，用户不需要填写。</td></tr><tr><td>dstReg</td><td>输出</td><td>目的操作数，类型为RegTensor。</td></tr><tr><td>srcAddr</td><td>输入</td><td>源操作数在UB上的起始地址。</td></tr></tbody></table><p><strong>表 4</strong> 单搬入模式POST_MODE_UPDATE场景参数说明</p><table tabindex="0"><thead><tr><th>参数名</th><th>输入/输出</th><th>描述</th></tr></thead><tbody><tr><td>T</td><td>输入</td><td>模板参数。 Ascend 950PR/Ascend 950DT，支持的数据类型为b8/b16/b32/b64。</td></tr><tr><td>postMode</td><td>输入</td><td>用于控制是否使能post update，PostLiteral类型。</td></tr><tr><td>dist</td><td>输入</td><td>搬运模式，LoadDist类型，具体的取值请参考表1。</td></tr><tr><td>U</td><td>输入</td><td>目的操作数的RegTensor类型，例如RegTensor&lt;half&gt;，由编译器自动推导，用户不需要填写。</td></tr><tr><td>dstReg</td><td>输出</td><td>目的操作数，类型为RegTensor。</td></tr><tr><td>srcAddr</td><td>输入/输出</td><td>源操作数在UB上的起始地址。</td></tr><tr><td>postUpdateStride</td><td>输入</td><td>实际搬运UB起始地址为srcAddr，搬运后执行地址更新：srcAddr += postUpdateStride。</td></tr></tbody></table><p><strong>表 5</strong> 单搬入模式使用AddrReg存储偏移量场景参数说明</p><table tabindex="0"><thead><tr><th>参数名</th><th>输入/输出</th><th>描述</th></tr></thead><tbody><tr><td>T</td><td>输入</td><td>模板参数。 Ascend 950PR/Ascend 950DT，支持的数据类型为b8/b16/b32/b64。</td></tr><tr><td>dist</td><td>输入</td><td>搬运模式，LoadDist类型，具体的取值请参考表1。</td></tr><tr><td>U</td><td>输入</td><td>目的操作数的RegTensor类型，例如RegTensor&lt;half&gt;，由编译器自动推导，用户不需要填写。</td></tr><tr><td>dstReg</td><td>输出</td><td>目的操作数，类型为RegTensor。</td></tr><tr><td>offset</td><td>输入</td><td>实际搬运地址UB为srcAddr + offset。</td></tr><tr><td>srcAddr</td><td>输入/输出</td><td>源操作数在UB上的起始地址。</td></tr></tbody></table><p><strong>表 6</strong> 双搬入模式POST_MODE_NORMAL场景参数说明</p><table tabindex="0"><thead><tr><th>参数名</th><th>输入/输出</th><th>描述</th></tr></thead><tbody><tr><td>T</td><td>输入</td><td>模板参数，支持的数据类型为b8/b16/b32。</td></tr><tr><td>dist</td><td>输入</td><td>搬运模式，LoadDist类型，具体的取值请参考表2。</td></tr><tr><td>U</td><td>输入</td><td>目的操作数的RegTensor类型，例如RegTensor&lt;half&gt;，由编译器自动推导，用户不需要填写。</td></tr><tr><td>dstReg0</td><td>输出</td><td>第一个目的操作数，类型为RegTensor。</td></tr><tr><td>dstReg1</td><td>输出</td><td>第二个目的操作数，类型为RegTensor。</td></tr><tr><td>srcAddr</td><td>输入/输出</td><td>源操作数在UB上的起始地址。</td></tr></tbody></table><p><strong>表 7</strong> 双搬入模式POST_MODE_UPDATE场景参数说明</p><table tabindex="0"><thead><tr><th>参数名</th><th>输入/输出</th><th>描述</th></tr></thead><tbody><tr><td>T</td><td>输入</td><td>模板参数。 Ascend 950PR/Ascend 950DT，支持的数据类型为b8/b16/b32/b64。</td></tr><tr><td>postMode</td><td>输入</td><td>用于控制是否使能post update，PostLiteral类型。</td></tr><tr><td>dist</td><td>输入</td><td>搬运模式，LoadDist类型，具体的取值请参考表2。</td></tr><tr><td>U</td><td>输入</td><td>目的操作数的RegTensor类型，例如RegTensor&lt;half&gt;，由编译器自动推导，用户不需要填写。</td></tr><tr><td>dstReg0</td><td>输出</td><td>第一个目的操作数，类型为RegTensor。</td></tr><tr><td>dstReg1</td><td>输出</td><td>第二个目的操作数，类型为RegTensor。</td></tr><tr><td>srcAddr</td><td>输入/输出</td><td>源操作数在UB上的起始地址。</td></tr><tr><td>postUpdateStride</td><td>输入</td><td>实际搬运UB起始地址为srcAddr，搬运后执行地址更新：srcAddr += postUpdateStride。</td></tr></tbody></table><p><strong>表 8</strong> 双搬入模式使用AddrReg存储偏移量场景参数说明</p><table tabindex="0"><thead><tr><th>参数名</th><th>输入/输出</th><th>描述</th></tr></thead><tbody><tr><td>T</td><td>输入</td><td>模板参数，支持的数据类型为b8/b16/b32。</td></tr><tr><td>dist</td><td>输入</td><td>搬运模式，LoadDist类型，具体的取值请参考表2。</td></tr><tr><td>U</td><td>输入</td><td>目的操作数的RegTensor类型，例如RegTensor&lt;half&gt;，由编译器自动推导，用户不需要填写。</td></tr><tr><td>dstReg0</td><td>输出</td><td>第一个目的操作数，类型为RegTensor。</td></tr><tr><td>dstReg1</td><td>输出</td><td>第二个目的操作数，类型为RegTensor。</td></tr><tr><td>offset</td><td>输入</td><td>实际搬运地址UB为srcAddr + offset。</td></tr><tr><td>srcAddr</td><td>输入/输出</td><td>源操作数在UB上的起始地址。</td></tr></tbody></table><h2 id="返回值说明" tabindex="-1">返回值说明 <a class="header-anchor" href="#返回值说明" aria-label="Permalink to &quot;返回值说明&quot;">​</a></h2><p>无</p><h2 id="约束说明" tabindex="-1">约束说明 <a class="header-anchor" href="#约束说明" aria-label="Permalink to &quot;约束说明&quot;">​</a></h2><p>b64数据类型只支持LoadDist中的DIST_NORM模式。</p><h2 id="调用示例" tabindex="-1">调用示例 <a class="header-anchor" href="#调用示例" aria-label="Permalink to &quot;调用示例&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 单搬入/单搬出 POST_MODE_NORMAL 场景</span></span>
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
<span class="line"><span>        AscendC::Reg::LoadAlign&lt;T, AscendC::Reg::LoadDist::DIST_DINTLV_B8&gt;(srcReg0, srcReg1, srcAddr + i * oneRepeatSize);</span></span>
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
<span class="line"><span>}</span></span></code></pre></div>`,30)])])}const R=s(e,[["render",p]]);export{g as __pageData,R as default};
