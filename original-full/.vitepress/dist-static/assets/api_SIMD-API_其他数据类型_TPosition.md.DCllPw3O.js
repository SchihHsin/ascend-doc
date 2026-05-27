import{c as s,Q as n,j as a,m as p}from"./chunks/framework.DOi4mjdC.js";const P=JSON.parse('{"title":"TPosition","description":"","frontmatter":{},"headers":[{"level":1,"title":"TPosition","slug":"tposition"}],"relativePath":"api/SIMD-API/其他数据类型/TPosition.md","filePath":"api/SIMD-API/其他数据类型/TPosition.md"}'),d={name:"api/SIMD-API/其他数据类型/TPosition.md"};function i(e,t,o,r,l,C){return n(),a("div",null,[...t[0]||(t[0]=[p(`<h1 id="tposition" tabindex="-1">TPosition <a class="header-anchor" href="#tposition" aria-label="Permalink to &quot;TPosition&quot;">​</a></h1><p>Ascend C管理不同层级的物理内存时，用一种抽象的逻辑位置（TPosition）来表达各级别的存储，代替了片上物理存储的概念，达到隐藏硬件架构的目的。主要的TPosition类型包括：VECIN、VECOUT、VECCALC、A1、A2、B1、B2、C1、C2、CO1、CO2，其中VECIN、VECCALC、VECOUT主要用于矢量编程，A1、A2、B1、B2、C1、C2、CO1、CO2用于矩阵编程。您可以通过<a href="./../通用说明和约束.html#table07372185712">表1</a>了解TPosition和物理存储的映射关系。</p><p>TPosition定义如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>enum class TPosition : uint8_t {</span></span>
<span class="line"><span>    GM,</span></span>
<span class="line"><span>    A1,</span></span>
<span class="line"><span>    A2,</span></span>
<span class="line"><span>    B1,</span></span>
<span class="line"><span>    B2,</span></span>
<span class="line"><span>    C1,</span></span>
<span class="line"><span>    C2,</span></span>
<span class="line"><span>    CO1,</span></span>
<span class="line"><span>    CO2,</span></span>
<span class="line"><span>    VECIN,</span></span>
<span class="line"><span>    VECOUT,</span></span>
<span class="line"><span>    VECCALC,</span></span>
<span class="line"><span>    LCM = VECCALC,</span></span>
<span class="line"><span>    SPM,</span></span>
<span class="line"><span>    SHM = SPM,</span></span>
<span class="line"><span>    TSCM,</span></span>
<span class="line"><span>    C2PIPE2GM,</span></span>
<span class="line"><span>    C2PIPE2LOCAL,</span></span>
<span class="line"><span>    MAX,</span></span>
<span class="line"><span>};</span></span></code></pre></div><p>TPosition枚举值的具体定义如下：</p><p><strong>表 1</strong> TPosition枚举值含义说明</p><table tabindex="0"><thead><tr><th>枚举值</th><th>具体含义</th></tr></thead><tbody><tr><td>GM</td><td>Global Memory，对应AI Core的外部存储。</td></tr><tr><td>VECIN</td><td>用于矢量计算，搬入数据的存放位置，在数据搬入Vector计算单元时使用此位置。</td></tr><tr><td>VECOUT</td><td>用于矢量计算，搬出数据的存放位置，在将Vector计算单元结果搬出时使用此位置。</td></tr><tr><td>VECCALC</td><td>用于矢量计算/矩阵计算，在计算需要临时变量时使用此位置。</td></tr><tr><td>A1</td><td>用于矩阵计算，存放整块A矩阵，可类比CPU多级缓存中的二级缓存。</td></tr><tr><td>B1</td><td>用于矩阵计算，存放整块B矩阵，可类比CPU多级缓存中的二级缓存。</td></tr><tr><td>C1</td><td>用于矩阵计算，存放整块Bias矩阵，可类比CPU多级缓存中的二级缓存。</td></tr><tr><td>A2</td><td>用于矩阵计算，存放切分后的小块A矩阵，可类比CPU多级缓存中的一级缓存。</td></tr><tr><td>B2</td><td>用于矩阵计算，存放切分后的小块B矩阵，可类比CPU多级缓存中的一级缓存。</td></tr><tr><td>C2</td><td>用于矩阵计算，存放切分后的小块Bias矩阵，可类比CPU多级缓存中的一级缓存。</td></tr><tr><td>CO1</td><td>用于矩阵计算，存放小块结果C矩阵，可理解为Cube Out。</td></tr><tr><td>CO2</td><td>用于矩阵计算，存放整块结果C矩阵，可理解为Cube Out。</td></tr><tr><td>LCM</td><td>Local Cache Memory，代表临时共享的Unified Buffer空间，VECCALC的别名，与VECCALC实现同样的功能。</td></tr><tr><td>SPM</td><td>当Unified Buffer内存有溢出风险时，用于Unified Buffer的数据暂存。</td></tr><tr><td>SHM</td><td>SPM的别名。</td></tr><tr><td>TSCM</td><td>Temp Swap Cache Memory，用于临时把数据交换到额外空间，进行Matmul运算。</td></tr><tr><td>C2PIPE2GM</td><td>用于存放FIXPIPE量化参数。</td></tr><tr><td>C2PIPE2LOCAL</td><td>预留参数。为后续的功能做保留，开发者暂时无需关注。</td></tr></tbody></table>`,7)])])}const A=s(d,[["render",i]]);export{P as __pageData,A as default};
