import{c as n,Q as a,j as t,m as p}from"./chunks/framework.DOi4mjdC.js";const h=JSON.parse('{"title":"GetMrgSortResult","description":"","frontmatter":{},"headers":[{"level":1,"title":"GetMrgSortResult","slug":"getmrgsortresult"},{"level":2,"title":"产品支持情况","slug":"产品支持情况"},{"level":2,"title":"功能说明","slug":"功能说明"},{"level":2,"title":"函数原型","slug":"函数原型"},{"level":2,"title":"参数说明","slug":"参数说明"},{"level":2,"title":"返回值说明","slug":"返回值说明"},{"level":2,"title":"约束说明","slug":"约束说明"},{"level":2,"title":"调用示例","slug":"调用示例"}],"relativePath":"api/SIMD-API/基础API/Memory矢量计算/排序组合（ISASI）/GetMrgSortResult.md","filePath":"api/SIMD-API/基础API/Memory矢量计算/排序组合（ISASI）/GetMrgSortResult.md"}'),e={name:"api/SIMD-API/基础API/Memory矢量计算/排序组合（ISASI）/GetMrgSortResult.md"};function l(r,s,i,o,c,d){return a(),t("div",null,[...s[0]||(s[0]=[p(`<h1 id="getmrgsortresult" tabindex="-1">GetMrgSortResult <a class="header-anchor" href="#getmrgsortresult" aria-label="Permalink to &quot;GetMrgSortResult&quot;">​</a></h1><h2 id="产品支持情况" tabindex="-1">产品支持情况 <a class="header-anchor" href="#产品支持情况" aria-label="Permalink to &quot;产品支持情况&quot;">​</a></h2><table tabindex="0"><thead><tr><th>产品</th><th>是否支持</th></tr></thead><tbody><tr><td>Ascend 950PR/Ascend 950DT</td><td>√</td></tr><tr><td>Atlas A3 训练系列产品/Atlas A3 推理系列产品</td><td>√</td></tr><tr><td>Atlas A2 训练系列产品/Atlas A2 推理系列产品</td><td>√</td></tr><tr><td>Atlas 200I/500 A2 推理产品</td><td>√</td></tr><tr><td>Atlas 推理系列产品AI Core</td><td>√</td></tr><tr><td>Atlas 推理系列产品Vector Core</td><td>x</td></tr><tr><td>Atlas 训练系列产品</td><td>x</td></tr></tbody></table><h2 id="功能说明" tabindex="-1">功能说明 <a class="header-anchor" href="#功能说明" aria-label="Permalink to &quot;功能说明&quot;">​</a></h2><p>获取MrgSort已经处理过的队列里的Region Proposal个数，并依次存储在四个出参中。</p><p>本接口和MrgSort相关指令的配合关系如下：</p><ul><li><p>配合<a href="./MrgSort4.html">MrgSort4指令</a>使用，获取MrgSort4指令处理过的队列里的Region Proposal个数。使用时，需要将MrgSort4中的MrgSort4Info.ifExhaustedSuspension参数配置为true，该配置模式下某条队列耗尽后，MrgSort4指令即停止。</p><p>以上说明适用于如下型号：</p><p>Atlas 推理系列产品AI Core</p></li><li><p>配合<a href="./MrgSort.html">MrgSort指令</a>使用，获取MrgSort指令处理过的队列里的Region Proposal个数。使用时，需要将MrgSort中的MrgSort4Info.ifExhaustedSuspension参数配置为true，该配置模式下某条队列耗尽后，MrgSort指令即停止。</p><p>以上说明适用于如下型号：</p><p>Ascend 950PR/Ascend 950DT</p><p>Atlas A3 训练系列产品/Atlas A3 推理系列产品</p><p>Atlas A2 训练系列产品/Atlas A2 推理系列产品</p><p>Atlas 200I/500 A2 推理产品</p></li></ul><h2 id="函数原型" tabindex="-1">函数原型 <a class="header-anchor" href="#函数原型" aria-label="Permalink to &quot;函数原型&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>__aicore__ inline void GetMrgSortResult(uint16_t &amp;mrgSortList1, uint16_t &amp;mrgSortList2, uint16_t &amp;mrgSortList3, uint16_t &amp;mrgSortList4)</span></span></code></pre></div><h2 id="参数说明" tabindex="-1">参数说明 <a class="header-anchor" href="#参数说明" aria-label="Permalink to &quot;参数说明&quot;">​</a></h2><p><strong>表 1</strong> 参数说明</p><table tabindex="0"><thead><tr><th>参数名</th><th>输入/输出</th><th>描述</th></tr></thead><tbody><tr><td>mrgSortList1</td><td>输出</td><td>类型为uint16_t，表示MrgSort第一个队列里已经处理过的Region Proposal个数。</td></tr><tr><td>mrgSortList2</td><td>输出</td><td>类型为uint16_t，表示MrgSort第二个队列里已经处理过的Region Proposal个数。</td></tr><tr><td>mrgSortList3</td><td>输出</td><td>类型为uint16_t，表示MrgSort第三个队列里已经处理过的Region Proposal个数。</td></tr><tr><td>mrgSortList4</td><td>输出</td><td>类型为uint16_t，表示MrgSort第四个队列里已经处理过的Region Proposal个数。</td></tr></tbody></table><h2 id="返回值说明" tabindex="-1">返回值说明 <a class="header-anchor" href="#返回值说明" aria-label="Permalink to &quot;返回值说明&quot;">​</a></h2><p>无</p><h2 id="约束说明" tabindex="-1">约束说明 <a class="header-anchor" href="#约束说明" aria-label="Permalink to &quot;约束说明&quot;">​</a></h2><p>无</p><h2 id="调用示例" tabindex="-1">调用示例 <a class="header-anchor" href="#调用示例" aria-label="Permalink to &quot;调用示例&quot;">​</a></h2><ul><li><p>配合<a href="./MrgSort.html">MrgSort指令</a>使用示例。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>uint16_t elementLengths[4] = { 0 };</span></span>
<span class="line"><span>uint32_t sortedNum[4] = { 0 };</span></span>
<span class="line"><span>elementLengths[0] = 32;</span></span>
<span class="line"><span>elementLengths[1] = 32;</span></span>
<span class="line"><span>elementLengths[2] = 32;</span></span>
<span class="line"><span>elementLengths[3] = 32;</span></span>
<span class="line"><span>uint16_t validBit = 0b1111;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>AscendC::MrgSortSrcList&lt;float&gt; srcList;</span></span>
<span class="line"><span>srcList.src1 = workLocal[0];</span></span>
<span class="line"><span>srcList.src2 = workLocal[32 * 1 * 2];</span></span>
<span class="line"><span>srcList.src3 = workLocal[32 * 2 * 2];</span></span>
<span class="line"><span>srcList.src4 = workLocal[32 * 3 * 2];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>AscendC::MrgSort4Info mrgSortInfo(elementLengths, true, validBit, 1);</span></span>
<span class="line"><span>AscendC::MrgSort(dstLocal, srcList, mrgSortInfo);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>uint16_t mrgRes1 = 0;</span></span>
<span class="line"><span>uint16_t mrgRes2 = 0;</span></span>
<span class="line"><span>uint16_t mrgRes3 = 0;</span></span>
<span class="line"><span>uint16_t mrgRes4 = 0;</span></span>
<span class="line"><span>AscendC::GetMrgSortResult(mrgRes1, mrgRes2, mrgRes3, mrgRes4);</span></span></code></pre></div><p>输出示例:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>srcList： [  1.   2.   3.   4.   5.   6.   7.   8.   9.  10.  11.  12.  13.  14.</span></span>
<span class="line"><span>  15.  16.  17.  18.  19.  20.  21.  22.  23.  24.  25.  26.  27.  28.</span></span>
<span class="line"><span>  29.  30.  31.  32.  33.  34.  35.  36.  37.  38.  39.  40.  41.  42.</span></span>
<span class="line"><span>  43.  44.  45.  46.  47.  48.  49.  50.  51.  52.  53.  54.  55.  56.</span></span>
<span class="line"><span>  57.  58.  59.  60.  61.  62.  63.  64.  65.  66.  67.  68.  69.  70.</span></span>
<span class="line"><span>  71.  72.  73.  74.  75.  76.  77.  78.  79.  80.  81.  82.  83.  84.</span></span>
<span class="line"><span>  85.  86.  87.  88.  89.  90.  91.  92.  93.  94.  95.  96.  97.  98.</span></span>
<span class="line"><span>  99. 100. 101. 102. 103. 104. 105. 106. 107. 108. 109. 110. 111. 112.</span></span>
<span class="line"><span> 113. 114. 115. 116. 117. 118. 119. 120. 121. 122. 123. 124. 125. 126.</span></span>
<span class="line"><span> 127. 128.]</span></span>
<span class="line"><span>workLocal:</span></span>
<span class="line"><span> [0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0</span></span>
<span class="line"><span> 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0</span></span>
<span class="line"><span> 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0</span></span>
<span class="line"><span> 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0]</span></span>
<span class="line"><span>dstLocal:</span></span>
<span class="line"><span> [128.   0. 127.   0. 126.   0. 125.   0. 124.   0. 123.   0. 122.   0.</span></span>
<span class="line"><span> 121.   0. 120.   0. 119.   0. 118.   0. 117.   0. 116.   0. 115.   0.</span></span>
<span class="line"><span> 114.   0. 113.   0. 112.   0. 111.   0. 110.   0. 109.   0. 108.   0.</span></span>
<span class="line"><span> 107.   0. 106.   0. 105.   0. 104.   0. 103.   0. 102.   0. 101.   0.</span></span>
<span class="line"><span> 100.   0.  99.   0.  98.   0.  97.   0.  96.   0.  95.   0.  94.   0.</span></span>
<span class="line"><span>  93.   0.  92.   0.  91.   0.  90.   0.  89.   0.  88.   0.  87.   0.</span></span>
<span class="line"><span>  86.   0.  85.   0.  84.   0.  83.   0.  82.   0.  81.   0.  80.   0.</span></span>
<span class="line"><span>  79.   0.  78.   0.  77.   0.  76.   0.  75.   0.  74.   0.  73.   0.</span></span>
<span class="line"><span>  72.   0.  71.   0.  70.   0.  69.   0.  68.   0.  67.   0.  66.   0.</span></span>
<span class="line"><span>  65.   0.  64.   0.  63.   0.  62.   0.  61.   0.  60.   0.  59.   0.</span></span>
<span class="line"><span>  58.   0.  57.   0.  56.   0.  55.   0.  54.   0.  53.   0.  52.   0.</span></span>
<span class="line"><span>  51.   0.  50.   0.  49.   0.  48.   0.  47.   0.  46.   0.  45.   0.</span></span>
<span class="line"><span>  44.   0.  43.   0.  42.   0.  41.   0.  40.   0.  39.   0.  38.   0.</span></span>
<span class="line"><span>  37.   0.  36.   0.  35.   0.  34.   0.  33.   0.  32.   0.  31.   0.</span></span>
<span class="line"><span>  30.   0.  29.   0.  28.   0.  27.   0.  26.   0.  25.   0.  24.   0.</span></span>
<span class="line"><span>  23.   0.  22.   0.  21.   0.  20.   0.  19.   0.  18.   0.  17.   0.</span></span>
<span class="line"><span>  16.   0.  15.   0.  14.   0.  13.   0.  12.   0.  11.   0.  10.   0.</span></span>
<span class="line"><span>   9.   0.   8.   0.   7.   0.   6.   0.   5.   0.   4.   0.   3.   0.</span></span>
<span class="line"><span>   2.   0.   1.   0.]</span></span></code></pre></div></li><li><p>配合<a href="./MrgSort4.html">MrgSort4指令</a>使用示例。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>uint16_t elementLengths[4] = { 0 };</span></span>
<span class="line"><span>uint32_t sortedNum[4] = { 0 };</span></span>
<span class="line"><span>elementLengths[0] = 32;</span></span>
<span class="line"><span>elementLengths[1] = 32;</span></span>
<span class="line"><span>elementLengths[2] = 32;</span></span>
<span class="line"><span>elementLengths[3] = 32;</span></span>
<span class="line"><span>uint16_t validBit = 0b1111;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>AscendC::MrgSortSrcList&lt;float&gt; srcList;</span></span>
<span class="line"><span>srcList.src1 = workLocal[0];</span></span>
<span class="line"><span>srcList.src2 = workLocal[32 * 1 * 2];</span></span>
<span class="line"><span>srcList.src3 = workLocal[32 * 2 * 2];</span></span>
<span class="line"><span>srcList.src4 = workLocal[32 * 3 * 2];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>AscendC::MrgSort4Info mrgSortInfo(elementLengths, true, validBit, 1);</span></span>
<span class="line"><span>AscendC::MrgSort4(dstLocal, srcList, mrgSortInfo);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>uint16_t mrgRes1 = 0;</span></span>
<span class="line"><span>uint16_t mrgRes2 = 0;</span></span>
<span class="line"><span>uint16_t mrgRes3 = 0;</span></span>
<span class="line"><span>uint16_t mrgRes4 = 0;</span></span>
<span class="line"><span>AscendC::GetMrgSortResult(mrgRes1, mrgRes2, mrgRes3, mrgRes4);</span></span></code></pre></div></li></ul>`,18)])])}const u=n(e,[["render",l]]);export{h as __pageData,u as default};
