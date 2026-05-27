import{c as a,Q as n,j as p,m as e}from"./chunks/framework.DOi4mjdC.js";const u=JSON.parse('{"title":"算子编译迁移指导","description":"","frontmatter":{},"headers":[{"level":1,"title":"算子编译迁移指导","slug":"算子编译迁移指导"}],"relativePath":"guide/跨代迁移兼容性指南/3510架构迁移指导/2201迁移3510指导/算子编译迁移指导.md","filePath":"guide/跨代迁移兼容性指南/3510架构迁移指导/2201迁移3510指导/算子编译迁移指导.md"}'),i={name:"guide/跨代迁移兼容性指南/3510架构迁移指导/2201迁移3510指导/算子编译迁移指导.md"};function l(t,s,c,o,d,r){return n(),p("div",null,[...s[0]||(s[0]=[e(`<h1 id="算子编译迁移指导" tabindex="-1">算子编译迁移指导 <a class="header-anchor" href="#算子编译迁移指导" aria-label="Permalink to &quot;算子编译迁移指导&quot;">​</a></h1><p>进行算子编译时，开发者需要感知不同架构、不同的AI处理器型号。</p><ul><li><p>异构编译场景，开发者使用命令行或者编写Cmake文件进行编译的情况，需要手动修改NPU架构版本号或者AI 处理器型号。以修改NPU架构版本号为例，更改编译命令行或编译工程CMakeLists.txt文件中的--npu-arch配置，示例如下：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>target_compile_options(demo PRIVATE</span></span>
<span class="line"><span>    // 将dav-xxxx更换为对应NPU架构版本号</span></span>
<span class="line"><span>    $&lt;$&lt;COMPILE_LANGUAGE:ASC&gt;:--npu-arch=dav-xxxx&gt;</span></span>
<span class="line"><span>)</span></span></code></pre></div></li><li><p>对于使用msOpGen工具生成的标准自定义算子工程的情况，会自动在算子工程目录下生成编译配置项文件CMakePresets.json中，并自动填充ASCEND_COMPUTE_UNIT字段。开发者需要在进行算子原型定义时，通过AddConfig接口注册算子支持的AI处理器型号以及相关的配置信息。AddConfig接口原型如下：soc参数表示AI处理器型号，aicore_config表示其他配置信息。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>void AddConfig(const char *soc);</span></span>
<span class="line"><span>void AddConfig(const char *soc, OpAICoreConfig &amp;aicore_config);</span></span></code></pre></div><p>通过该接口注册AI处理器型号的样例如下，ascendxxx填写规则请参考算子工程目录下编译配置项文件CMakePresets.json中的ASCEND_COMPUTE_UNIT字段，该字段取值在使用msOpGen创建工程时自动生成。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>...</span></span>
<span class="line"><span></span></span>
<span class="line"><span>namespace ops {</span></span>
<span class="line"><span>class AddCustom : public OpDef {</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    AddCustom(const char* name) : OpDef(name)</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        ...</span></span>
<span class="line"><span>        // 将ascendXXX更换为对应芯片版本</span></span>
<span class="line"><span>        this-&gt;AICore().AddConfig(&quot;ascendxxx&quot;);</span></span>
<span class="line"><span>        </span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span>OP_ADD(AddCustom);</span></span>
<span class="line"><span>} // namespace ops</span></span></code></pre></div></li></ul>`,3)])])}const g=a(i,[["render",l]]);export{u as __pageData,g as default};
