import{c as n,Q as s,j as e,m as i}from"./chunks/framework.DOi4mjdC.js";const o=JSON.parse('{"title":"通过TilingData传递属性信息","description":"","frontmatter":{},"headers":[{"level":1,"title":"通过TilingData传递属性信息","slug":"通过tilingdata传递属性信息"}],"relativePath":"guide/编程指南/高级编程/高级特性/Aclnn算子工程化开发/Host侧Tiling实现/通过TilingData传递属性信息.md","filePath":"guide/编程指南/高级编程/高级特性/Aclnn算子工程化开发/Host侧Tiling实现/通过TilingData传递属性信息.md"}'),t={name:"guide/编程指南/高级编程/高级特性/Aclnn算子工程化开发/Host侧Tiling实现/通过TilingData传递属性信息.md"};function p(l,a,c,g,r,d){return s(),e("div",null,[...a[0]||(a[0]=[i(`<h1 id="通过tilingdata传递属性信息" tabindex="-1">通过TilingData传递属性信息 <a class="header-anchor" href="#通过tilingdata传递属性信息" aria-label="Permalink to &quot;通过TilingData传递属性信息&quot;">​</a></h1><p>如果算子包含属性信息，该属性信息可以通过TilingData传递到kernel侧，参与kernel侧算子核函数的计算。以ReduceMaxCustom算子为例，该算子用于对输入数据按维度dim返回最大值，并且返回索引。ReduceMaxCustom算子有两个属性，reduceDim和isKeepDim，reduceDim表示按照哪一个维度进行reduce操作；isKeepDim表示是否需要保持输出的维度与输入一样。本样例仅支持对最后一维做reduce操作，输入数据类型为half。</p><ol><li><p>ReduceMaxCustom算子TilingData的定义如下：这里我们重点关注reduceAxisLen。参数reduceAxisLen表示获取reduceDim轴的长度，这里也就是最后一维的长度。该参数后续会通过TilingData传递到kernel侧参与计算。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#ifndef REDUCE_MAX_CUSTOM_TILING_H</span></span>
<span class="line"><span>#define REDUCE_MAX_CUSTOM_TILING_H</span></span>
<span class="line"><span>#include &quot;register/tilingdata_base.h&quot;</span></span>
<span class="line"><span>namespace optiling {</span></span>
<span class="line"><span>BEGIN_TILING_DATA_DEF(ReduceMaxTilingData)</span></span>
<span class="line"><span>  TILING_DATA_FIELD_DEF(uint32_t, reduceAxisLen); // 添加tiling字段，reduceDim轴的长度</span></span>
<span class="line"><span>  //其他TilingData参数的定义</span></span>
<span class="line"><span>  ...</span></span>
<span class="line"><span>END_TILING_DATA_DEF;</span></span>
<span class="line"><span>// 注册算子tilingdata类到对应的ReduceMaxCustom算子</span></span>
<span class="line"><span>REGISTER_TILING_DATA_CLASS(ReduceMaxCustom, ReduceMaxTilingData)</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>#endif</span><span> // REDUCE_MAX_CUSTOM_TILING_H</span></span></code></pre></div></li><li><p>ReduceMaxCustom算子的Tiling实现如下。这里我们重点关注属性信息通过TilingData传递的过程：首先通过TilingContext上下文从attr获取reduceDim属性值；然后根据reduceDim属性值获取reduceDim轴的长度并设置到TilingData中。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>namespace optiling {</span></span>
<span class="line"><span>static ge::graphStatus TilingFunc(gert::TilingContext* context)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    ReduceMaxTilingData tiling;</span></span>
<span class="line"><span>    // 从attr获取reduceDim属性值，因为reduceDim是第一个属性，所以GetAttrPointer传入的索引值为0</span></span>
<span class="line"><span>    const gert::RuntimeAttrs* attrs = context-&gt;GetAttrs();</span></span>
<span class="line"><span>    const uint32_t* reduceDim = attrs-&gt;GetAttrPointer&lt;uint32_t&gt;(0);</span></span>
<span class="line"><span>    // 获取reduceDim轴的长度</span></span>
<span class="line"><span>    const gert::StorageShape* xShapePtr = context-&gt;GetInputShape(0);</span></span>
<span class="line"><span>    const gert::Shape&amp; xShape = xShapePtr-&gt;GetStorageShape();</span></span>
<span class="line"><span>    const uint32_t reduceAxisLen = xShape.GetDim(*reduceDim);</span></span>
<span class="line"><span>    // 计算TilingData中除了reduceAxisLen之外其他成员变量的值</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    // 将reduceAxisLen设置到tiling结构体中，传递到kernel函数使用</span></span>
<span class="line"><span>    tiling.set_reduceAxisLen(reduceAxisLen);</span></span>
<span class="line"><span>    // 设置TilingData中除了reduceAxisLen之外其他成员变量的值</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    // TilingData序列化保存</span></span>
<span class="line"><span>    tiling.SaveToBuffer(context-&gt;GetRawTilingData()-&gt;GetData(), context-&gt;GetRawTilingData()-&gt;GetCapacity());</span></span>
<span class="line"><span>    context-&gt;GetRawTilingData()-&gt;SetDataSize(tiling.GetDataSize());</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>    return ge::GRAPH_SUCCESS;</span></span>
<span class="line"><span>}} // namespace optiling</span></span></code></pre></div></li></ol>`,3)])])}const _=n(t,[["render",p]]);export{o as __pageData,_ as default};
