import{c as s,Q as n,j as t,m as e}from"./chunks/framework.DOi4mjdC.js";const h=JSON.parse('{"title":"SetFlag/WaitFlag(ISASI)","description":"","frontmatter":{},"headers":[{"level":1,"title":"SetFlag/WaitFlag\\\\(ISASI\\\\)","slug":"setflagwaitflagisasi"},{"level":2,"title":"产品支持情况","slug":"产品支持情况"},{"level":2,"title":"功能说明","slug":"功能说明"},{"level":2,"title":"函数原型","slug":"函数原型"},{"level":2,"title":"参数说明","slug":"参数说明"},{"level":2,"title":"返回值说明","slug":"返回值说明"},{"level":2,"title":"约束说明","slug":"约束说明"},{"level":2,"title":"调用示例","slug":"调用示例"}],"relativePath":"api/SIMD-API/基础API/同步控制/核内同步/SetFlag-WaitFlag(ISASI).md","filePath":"api/SIMD-API/基础API/同步控制/核内同步/SetFlag-WaitFlag(ISASI).md"}'),l={name:"api/SIMD-API/基础API/同步控制/核内同步/SetFlag-WaitFlag(ISASI).md"};function p(i,a,d,c,r,o){return n(),t("div",null,[...a[0]||(a[0]=[e(`<h1 id="setflag-waitflag-isasi" tabindex="-1">SetFlag/WaitFlag(ISASI) <a class="header-anchor" href="#setflag-waitflag-isasi" aria-label="Permalink to &quot;SetFlag/WaitFlag\\(ISASI\\)&quot;">​</a></h1><h2 id="产品支持情况" tabindex="-1">产品支持情况 <a class="header-anchor" href="#产品支持情况" aria-label="Permalink to &quot;产品支持情况&quot;">​</a></h2><table tabindex="0"><thead><tr><th>产品</th><th>是否支持</th></tr></thead><tbody><tr><td>Ascend 950PR/Ascend 950DT</td><td>√</td></tr><tr><td>Atlas A3 训练系列产品/Atlas A3 推理系列产品</td><td>√</td></tr><tr><td>Atlas A2 训练系列产品/Atlas A2 推理系列产品</td><td>√</td></tr><tr><td>Atlas 200I/500 A2 推理产品</td><td>x</td></tr><tr><td>Atlas 推理系列产品AI Core</td><td>√</td></tr><tr><td>Atlas 推理系列产品Vector Core</td><td>x</td></tr><tr><td>Atlas 训练系列产品</td><td>√</td></tr><tr><td>Kirin X90</td><td>√</td></tr><tr><td>Kirin 9030</td><td>√</td></tr></tbody></table><h2 id="功能说明" tabindex="-1">功能说明 <a class="header-anchor" href="#功能说明" aria-label="Permalink to &quot;功能说明&quot;">​</a></h2><p>同一核内不同流水之间的同步指令。具有数据依赖的不同流水指令之间需要插此同步。</p><h2 id="函数原型" tabindex="-1">函数原型 <a class="header-anchor" href="#函数原型" aria-label="Permalink to &quot;函数原型&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>template &lt;HardEvent event&gt;</span></span>
<span class="line"><span>__aicore__ inline void SetFlag(int32_t eventID)</span></span>
<span class="line"><span>template &lt;HardEvent event&gt;</span></span>
<span class="line"><span>__aicore__ inline void WaitFlag(int32_t eventID)</span></span></code></pre></div><h2 id="参数说明" tabindex="-1">参数说明 <a class="header-anchor" href="#参数说明" aria-label="Permalink to &quot;参数说明&quot;">​</a></h2><p><strong>表 1</strong> 参数说明</p><table tabindex="0"><thead><tr><th>参数名</th><th>输入/输出</th><th>描述</th></tr></thead><tbody><tr><td>event</td><td>输入</td><td>模板参数。 同步事件，数据类型为HardEvent。详细内容参考下文中的同步类型说明。</td></tr><tr><td>eventID</td><td>输入</td><td>事件ID。数据类型为int32_t类型。其定义如下： 在基于TPipe和TQue编程场景中，eventID需要通过AllocEventID或者FetchEventID来获取。 Atlas 训练系列产品，数据范围为：0-3 Atlas 推理系列产品AI Core，数据范围为：0-7 Atlas A2 训练系列产品/Atlas A2 推理系列产品，数据范围为：0-7 Atlas A3 训练系列产品/Atlas A3 推理系列产品，数据范围为：0-7 Ascend 950PR/Ascend 950DT，数据范围为：0-7</td></tr></tbody></table><p>同步类型说明如下:</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>enum class HardEvent : uint8_t {</span></span>
<span class="line"><span>    // 名称（源流水_目标流水），例如MTE2_V，代表PIPE_MTE2为源流水，PIPE_V为目标流水。标识从PIPE_MTE2到PIPE_V的同步，PIPE_V等待PIPE_MTE2。</span></span>
<span class="line"><span>    MTE2_MTE1</span></span>
<span class="line"><span>    MTE1_MTE2</span></span>
<span class="line"><span>    MTE1_M</span></span>
<span class="line"><span>    M_MTE1</span></span>
<span class="line"><span>    MTE2_V</span></span>
<span class="line"><span>    V_MTE2</span></span>
<span class="line"><span>    MTE3_V</span></span>
<span class="line"><span>    V_MTE3</span></span>
<span class="line"><span>    M_V</span></span>
<span class="line"><span>    V_M</span></span>
<span class="line"><span>    V_V</span></span>
<span class="line"><span>    MTE3_MTE1</span></span>
<span class="line"><span>    MTE1_MTE3</span></span>
<span class="line"><span>    MTE1_V</span></span>
<span class="line"><span>    MTE2_M</span></span>
<span class="line"><span>    M_MTE2</span></span>
<span class="line"><span>    V_MTE1</span></span>
<span class="line"><span>    M_FIX</span></span>
<span class="line"><span>    FIX_M</span></span>
<span class="line"><span>    MTE3_MTE2</span></span>
<span class="line"><span>    MTE2_MTE3</span></span>
<span class="line"><span>    S_V</span></span>
<span class="line"><span>    V_S</span></span>
<span class="line"><span>    S_MTE2</span></span>
<span class="line"><span>    MTE2_S</span></span>
<span class="line"><span>    S_MTE3</span></span>
<span class="line"><span>    MTE3_S</span></span>
<span class="line"><span>    MTE2_FIX</span></span>
<span class="line"><span>    FIX_MTE2</span></span>
<span class="line"><span>    FIX_S</span></span>
<span class="line"><span>    M_S</span></span>
<span class="line"><span>    FIX_MTE3</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="返回值说明" tabindex="-1">返回值说明 <a class="header-anchor" href="#返回值说明" aria-label="Permalink to &quot;返回值说明&quot;">​</a></h2><p>无</p><h2 id="约束说明" tabindex="-1">约束说明 <a class="header-anchor" href="#约束说明" aria-label="Permalink to &quot;约束说明&quot;">​</a></h2><ul><li>SetFlag/WaitFlag必须成对出现。</li><li>在基于TPipe和TQue编程场景中，禁止用户在使用SetFlag和WaitFlag时自行指定eventID，容易与框架同步事件冲突，导致卡死问题。</li><li>在静态Tensor编程场景中，事件的类型和事件ID由开发者自行管理，但需要注意事件ID不能使用6和7（可能与内部使用的事件ID出现冲突，进而出现未定义行为）。</li></ul><h2 id="调用示例" tabindex="-1">调用示例 <a class="header-anchor" href="#调用示例" aria-label="Permalink to &quot;调用示例&quot;">​</a></h2><p>如DataCopy需要等待SetValue执行完成后才能执行，需要插入PIPE_S到PIPE_MTE3的同步。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>AscendC::GlobalTensor&lt;half&gt; dstGlobal;</span></span>
<span class="line"><span>AscendC::LocalTensor&lt;half&gt; dstLocal;</span></span>
<span class="line"><span>dstLocal.SetValue(0, 0);</span></span>
<span class="line"><span>uint32_t dataSize = 512;</span></span>
<span class="line"><span>// 基于TPipe和TQue编程场景中，eventID需要通过AllocEventID或FetchEventID获取</span></span>
<span class="line"><span>int32_t eventIDSToMTE3 = static_cast&lt;int32_t&gt;(GetTPipePtr()-&gt;FetchEventID(AscendC::HardEvent::S_MTE3));</span></span>
<span class="line"><span>AscendC::SetFlag&lt;AscendC::HardEvent::S_MTE3&gt;(eventIDSToMTE3);</span></span>
<span class="line"><span>AscendC::WaitFlag&lt;AscendC::HardEvent::S_MTE3&gt;(eventIDSToMTE3);</span></span>
<span class="line"><span>// 静态Tensor编程场景中，eventID由开发者自行管理</span></span>
<span class="line"><span>// AscendC::SetFlag&lt;AscendC::HardEvent::S_MTE3&gt;(EVENT_ID0);</span></span>
<span class="line"><span>// AscendC::WaitFlag&lt;AscendC::HardEvent::S_MTE3&gt;(EVENT_ID0);</span></span>
<span class="line"><span>AscendC::DataCopy(dstGlobal, dstLocal, dataSize);</span></span></code></pre></div>`,19)])])}const g=s(l,[["render",p]]);export{h as __pageData,g as default};
