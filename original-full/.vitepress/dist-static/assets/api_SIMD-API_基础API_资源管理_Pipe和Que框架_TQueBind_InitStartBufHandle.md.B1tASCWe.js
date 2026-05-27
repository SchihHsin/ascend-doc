import{c as n,Q as s,j as t,m as e}from"./chunks/framework.DOi4mjdC.js";const f=JSON.parse('{"title":"InitStartBufHandle","description":"","frontmatter":{},"headers":[{"level":1,"title":"InitStartBufHandle","slug":"initstartbufhandle"},{"level":2,"title":"产品支持情况","slug":"产品支持情况"},{"level":2,"title":"功能说明","slug":"功能说明"},{"level":2,"title":"函数原型","slug":"函数原型"},{"level":2,"title":"参数说明","slug":"参数说明"},{"level":2,"title":"约束说明","slug":"约束说明"},{"level":2,"title":"返回值说明","slug":"返回值说明"},{"level":2,"title":"调用示例","slug":"调用示例"}],"relativePath":"api/SIMD-API/基础API/资源管理/Pipe和Que框架/TQueBind/InitStartBufHandle.md","filePath":"api/SIMD-API/基础API/资源管理/Pipe和Que框架/TQueBind/InitStartBufHandle.md"}'),l={name:"api/SIMD-API/基础API/资源管理/Pipe和Que框架/TQueBind/InitStartBufHandle.md"};function p(i,a,d,u,r,o){return s(),t("div",null,[...a[0]||(a[0]=[e(`<h1 id="initstartbufhandle" tabindex="-1">InitStartBufHandle <a class="header-anchor" href="#initstartbufhandle" aria-label="Permalink to &quot;InitStartBufHandle&quot;">​</a></h1><h2 id="产品支持情况" tabindex="-1">产品支持情况 <a class="header-anchor" href="#产品支持情况" aria-label="Permalink to &quot;产品支持情况&quot;">​</a></h2><table tabindex="0"><thead><tr><th>产品</th><th>是否支持</th></tr></thead><tbody><tr><td>Ascend 950PR/Ascend 950DT</td><td>√</td></tr><tr><td>Atlas A3 训练系列产品/Atlas A3 推理系列产品</td><td>√</td></tr><tr><td>Atlas A2 训练系列产品/Atlas A2 推理系列产品</td><td>√</td></tr><tr><td>Atlas 200I/500 A2 推理产品</td><td>√</td></tr><tr><td>Atlas 推理系列产品AI Core</td><td>√</td></tr><tr><td>Atlas 推理系列产品Vector Core</td><td>x</td></tr><tr><td>Atlas 训练系列产品</td><td>√</td></tr></tbody></table><h2 id="功能说明" tabindex="-1">功能说明 <a class="header-anchor" href="#功能说明" aria-label="Permalink to &quot;功能说明&quot;">​</a></h2><p>设置TQue/TBuf的起始内存块指针、内存块的个数、每一块内存块的大小。</p><h2 id="函数原型" tabindex="-1">函数原型 <a class="header-anchor" href="#函数原型" aria-label="Permalink to &quot;函数原型&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>__aicore__ inline void InitStartBufHandle(TBufHandle startBufhandle, uint8_t num, uint32_t len)</span></span></code></pre></div><h2 id="参数说明" tabindex="-1">参数说明 <a class="header-anchor" href="#参数说明" aria-label="Permalink to &quot;参数说明&quot;">​</a></h2><p><strong>表 1</strong> 参数说明</p><table tabindex="0"><thead><tr><th>参数名称</th><th>输入/输出</th><th>含义</th></tr></thead><tbody><tr><td>startBufhandle</td><td>输入</td><td>TQue/TBuf的起始内存块指针，数据类型为TBufHandle（实际为uint8_t*）。</td></tr><tr><td>num</td><td>输入</td><td>分配内存块的个数。</td></tr><tr><td>len</td><td>输入</td><td>每一个内存块的大小，单位为Bytes。</td></tr></tbody></table><h2 id="约束说明" tabindex="-1">约束说明 <a class="header-anchor" href="#约束说明" aria-label="Permalink to &quot;约束说明&quot;">​</a></h2><ul><li><p>TQue、TBuf类继承自TQueBind类，所以TQue、TBuf对象也可使用该接口。</p></li><li><p>该接口目前只提供给<a href="./../自定义TBufPool/自定义TBufPool.html">自定义TBufPool</a>初始化TQue、TBuf的内存块时使用。</p></li><li><p>当使用TBuf对象调用该接口时，入参num必须为1。</p></li></ul><h2 id="返回值说明" tabindex="-1">返回值说明 <a class="header-anchor" href="#返回值说明" aria-label="Permalink to &quot;返回值说明&quot;">​</a></h2><p>无</p><h2 id="调用示例" tabindex="-1">调用示例 <a class="header-anchor" href="#调用示例" aria-label="Permalink to &quot;调用示例&quot;">​</a></h2><p>完整示例请参考<a href="./../自定义TBufPool/EXTERN_IMPL_BUFPOOL宏.html#section1234017553610">调用示例</a>。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 假设自定义tbufpool类为MyBufPool</span></span>
<span class="line"><span>// 自定义tbufpool类内部对TQue初始化的InitBuffer函数：</span></span>
<span class="line"><span>template&lt;class T&gt; </span></span>
<span class="line"><span>__aicore__ inline bool MyBufPool::InitBuffer(T&amp; que, uint8_t num, uint32_t len)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>   ...</span></span>
<span class="line"><span>   // 对TQue的内存块进行初始化</span></span>
<span class="line"><span>   uint32_t curPoolAddr  = 0;  // 内存块起始地址</span></span>
<span class="line"><span>   auto bufhandle = xxx; // 具体的内存块，该变量可由自定义tbufpool内获得</span></span>
<span class="line"><span>   srcQue0.InitStartBufHandle(bufhandle, num, len);</span></span>
<span class="line"><span>   for (uint8_t i = 0; i &lt; num; i++) {</span></span>
<span class="line"><span>      que.InitBufHandle(this, i, bufhandle , curPoolAddr + i * len, len);</span></span>
<span class="line"><span>   }</span></span>
<span class="line"><span>   ...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 自定义tbufpool类内部对TBuf初始化的InitBuffer函数：</span></span>
<span class="line"><span>template&lt;class T&gt; </span></span>
<span class="line"><span>__aicore__ inline bool MyBufPool::InitBuffer(AscendC::TBuf&lt;bufPos&gt;&amp; buf, uint32_t len)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>   ...</span></span>
<span class="line"><span>   // 对TBuf的内存块进行初始化</span></span>
<span class="line"><span>   uint32_t curPoolAddr  = 0;  // 内存块起始地址</span></span>
<span class="line"><span>   auto bufhandle = xxx; // 具体的内存块，该变量可由自定义tbufpool内获得</span></span>
<span class="line"><span>   srcBuf1.InitStartBufHandle(bufhandle, 1, len);</span></span>
<span class="line"><span>   srcBuf1.InitBufHandle(this, 0, bufhandle , curPoolAddr, len);</span></span>
<span class="line"><span>   ...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>AscendC::TPipe pipe;</span></span>
<span class="line"><span>AscendC::TQue&lt;AscendC::TPosition::VECIN, 1&gt; srcQue0;</span></span>
<span class="line"><span>AscendC::TBuf&lt;AscendC::TPosition::VECIN&gt; srcBuf1;</span></span>
<span class="line"><span>MyBufPool tbufPool;</span></span>
<span class="line"><span>pipe.InitBufPool(tbufPool, 1024 * 2);</span></span>
<span class="line"><span>tbufPool.InitBuffer(srcQue0, 1, 1024);</span></span>
<span class="line"><span>tbufPool.InitBuffer(srcBuf1, 1024);</span></span></code></pre></div>`,17)])])}const h=n(l,[["render",p]]);export{f as __pageData,h as default};
