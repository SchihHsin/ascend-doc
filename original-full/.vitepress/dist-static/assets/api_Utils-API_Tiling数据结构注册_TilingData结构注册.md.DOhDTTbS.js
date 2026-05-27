import{c as n,Q as s,j as t,m as l}from"./chunks/framework.DOi4mjdC.js";const g=JSON.parse('{"title":"TilingData结构注册","description":"","frontmatter":{},"headers":[{"level":1,"title":"TilingData结构注册","slug":"tilingdata结构注册"},{"level":2,"title":"功能说明","slug":"功能说明"},{"level":2,"title":"函数原型","slug":"函数原型"},{"level":2,"title":"参数说明","slug":"参数说明"},{"level":2,"title":"约束说明","slug":"约束说明"},{"level":2,"title":"调用示例","slug":"调用示例"}],"relativePath":"api/Utils-API/Tiling数据结构注册/TilingData结构注册.md","filePath":"api/Utils-API/Tiling数据结构注册/TilingData结构注册.md"}'),i={name:"api/Utils-API/Tiling数据结构注册/TilingData结构注册.md"};function p(e,a,_,c,d,r){return s(),t("div",null,[...a[0]||(a[0]=[l(`<h1 id="tilingdata结构注册" tabindex="-1">TilingData结构注册 <a class="header-anchor" href="#tilingdata结构注册" aria-label="Permalink to &quot;TilingData结构注册&quot;">​</a></h1><h2 id="功能说明" tabindex="-1">功能说明 <a class="header-anchor" href="#功能说明" aria-label="Permalink to &quot;功能说明&quot;">​</a></h2><p>注册定义的TilingData结构体并和自定义算子绑定。具体使用说明请参考<a href="#zh-cn_topic_0000001576728165_section97001499599">调用示例</a>。</p><h2 id="函数原型" tabindex="-1">函数原型 <a class="header-anchor" href="#函数原型" aria-label="Permalink to &quot;函数原型&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#define REGISTER_TILING_DATA_CLASS(op_type, class_name)</span></span>
<span class="line"><span>  class op_type##class_name##Helper {</span></span>
<span class="line"><span>  public:</span></span>
<span class="line"><span>    op_type##class_name##Helper() {</span></span>
<span class="line"><span>      CTilingDataClassFactory::RegisterTilingData(#op_type, op_type##class_name##Helper::CreateTilingDataInstance);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    static std::shared_ptr&lt;TilingDef&gt; CreateTilingDataInstance() {</span></span>
<span class="line"><span>      return std::make_shared&lt;class_name&gt;();</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  };</span></span>
<span class="line"><span>  op_type##class_name##Helper g_tilingdata_##op_type##class_name##helper;</span></span></code></pre></div><h2 id="参数说明" tabindex="-1">参数说明 <a class="header-anchor" href="#参数说明" aria-label="Permalink to &quot;参数说明&quot;">​</a></h2><p><strong>表 1</strong> 参数说明</p><table tabindex="0"><thead><tr><th>参数</th><th>输入/输出</th><th>说明</th></tr></thead><tbody><tr><td>op_type</td><td>输入</td><td>注册的算子名</td></tr><tr><td>struct_name</td><td>输入</td><td>tiling结构体名，与c++变量命名要求一致</td></tr></tbody></table><h2 id="约束说明" tabindex="-1">约束说明 <a class="header-anchor" href="#约束说明" aria-label="Permalink to &quot;约束说明&quot;">​</a></h2><ul><li>使用时需要包含头文件register/tilingdata_base.h。</li><li>中间结构体和定制tilingkey结构体需注意op_type命名规则，具体见<a href="#zh-cn_topic_0000001576728165_section97001499599">调用示例</a>。</li><li>算子定制tilingkey结构体需保证必须注册op_type默认结构体。</li><li>tiling结构体是全局属性，需注意应通过结构体名作为全局唯一标记，不同算子若注册同名不同结构tiling结构体则会发生未定义行为。</li></ul><h2 id="调用示例" tabindex="-1">调用示例 <a class="header-anchor" href="#调用示例" aria-label="Permalink to &quot;调用示例&quot;">​</a></h2><ul><li><p>注册算子Tiling结构体</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#include &quot;register/tilingdata_base.h&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 定义tilingdata类</span></span>
<span class="line"><span>namespace optiling {</span></span>
<span class="line"><span>BEGIN_TILING_DATA_DEF(AddCustomTilingData)    // 注册一个tiling的类，以tiling的名字作为入参</span></span>
<span class="line"><span>  TILING_DATA_FIELD_DEF(uint32_t, blkDim);    // 添加tiling字段，参与计算核数</span></span>
<span class="line"><span>  TILING_DATA_FIELD_DEF(uint32_t, totalSize); // 添加tiling字段，总计算数据量-输入shape大小</span></span>
<span class="line"><span>  TILING_DATA_FIELD_DEF(uint32_t, splitTile); // 添加tiling字段，每个core处理的数据分块计算</span></span>
<span class="line"><span>END_TILING_DATA_DEF;                          // 定义结束</span></span>
<span class="line"><span>// 注册算子tilingdata类到对应的AddCustom算子</span></span>
<span class="line"><span>REGISTER_TILING_DATA_CLASS(AddCustom, AddCustomTilingData) </span></span>
<span class="line"><span>}</span></span></code></pre></div></li><li><p>注册中间结构体。当用户有结构体嵌套场景时，嵌套的结构体称为中间结构体。因为一个算子名只能注册一个Tiling结构体，为使得框架能够检测中间结构体信息，需要构造“虚拟算子名”（结构体名+Op）并通过REGISTER_TILING_DATA_CLASS接口注册中间结构体，注册方式如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>BEGIN_TILING_DATA_DEF(Matmul)</span></span>
<span class="line"><span>  TILING_DATA_FIELD_DEF(uint16_t, mmVar);</span></span>
<span class="line"><span>  TILING_DATA_FIELD_DEF_ARR(uint16_t, 3, mmArr);</span></span>
<span class="line"><span>END_TILING_DATA_DEF;</span></span>
<span class="line"><span>//注册中间结构体，第一个参数固定为struct_name#Op，第二个参数即struct_name, 如struct_name为Matmul，第一参数为MatmulOp，第二个参数为Matmul</span></span>
<span class="line"><span>REGISTER_TILING_DATA_CLASS(MatmulOp, Matmul)      //注册中间结构体</span></span></code></pre></div></li><li><p>定制tiling_key注册不同Tiling结构体</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/*REGISTER_TILING_DATA_CLASS中第一个参数为\${op_type} + ‘_’ + tiling_key。若tiling_key未注册匹配的tiling结构体，则会使用默认的结构体。如下面两种方式，tiling_key不指定或者非1情况，tiling结构体为AddStruct；tiling_key等于1的时候，tiling结构体为AddStructSample1*/</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 以op_type为Add为例，默认tiling结构体注册如下</span></span>
<span class="line"><span>BEGIN_TILING_DATA_DEF(AddStruct)   </span></span>
<span class="line"><span>  TILING_DATA_FIELD_DEF(uint16_t, mmVar);   </span></span>
<span class="line"><span>  TILING_DATA_FIELD_DEF_ARR(uint16_t, 3, mmArr); </span></span>
<span class="line"><span>END_TILING_DATA_DEF; </span></span>
<span class="line"><span>REGISTER_TILING_DATA_CLASS(Add, AddStruct) </span></span>
<span class="line"><span></span></span>
<span class="line"><span>// TilingKey等于1时注册结构体如下</span></span>
<span class="line"><span>BEGIN_TILING_DATA_DEF(AddStructSample1) </span></span>
<span class="line"><span>  TILING_DATA_FIELD_DEF(uint16_t, mmVar);   </span></span>
<span class="line"><span>  TILING_DATA_FIELD_DEF_ARR(uint16_t, 3, mmArr); </span></span>
<span class="line"><span>END_TILING_DATA_DEF; </span></span>
<span class="line"><span>REGISTER_TILING_DATA_CLASS(Add_1, AddStructSample1)</span></span></code></pre></div></li></ul>`,12)])])}const T=n(i,[["render",p]]);export{g as __pageData,T as default};
