import{c as s,Q as a,j as i,m as l}from"./chunks/framework.DOi4mjdC.js";const u=JSON.parse('{"title":"如何进行Tiling调测","description":"","frontmatter":{},"headers":[{"level":1,"title":"如何进行Tiling调测","slug":"如何进行tiling调测"}],"relativePath":"guide/编程指南/附录/常用操作/如何进行Tiling调测.md","filePath":"guide/编程指南/附录/常用操作/如何进行Tiling调测.md"}'),p={name:"guide/编程指南/附录/常用操作/如何进行Tiling调测.md"};function e(t,n,o,c,g,r){return a(),i("div",null,[...n[0]||(n[0]=[l(`<h1 id="如何进行tiling调测" tabindex="-1">如何进行Tiling调测 <a class="header-anchor" href="#如何进行tiling调测" aria-label="Permalink to &quot;如何进行Tiling调测&quot;">​</a></h1><p>在<a href="./../工程化算子开发/概述.html">工程化算子开发</a>过程中，开发者需实现Tiling函数，该函数原型是固定的，接受TilingContext作为输入。框架负责构造TilingContext并调用Tiling函数。若需单独进行Tiling调测，开发者可通过OpTilingRegistry加载编译后的Tiling动态库，获取Tiling函数的指针并进行调用，调用时Tiling函数的TilingContext入参使用ContextBuilder构建。</p><p>以下是具体步骤：</p><ol><li><p>参考工程化算子开发的开发步骤，完成算子实现，并通过<strong>算子包编译</strong>或<strong>算子动态库编译</strong>获取对应的Tiling动态库文件。</p><ul><li>算子包编译：Tiling实现对应的动态库为算子包部署目录下的liboptiling.so。具体路径可参考<a href="./../工程化算子开发/算子包编译/算子包部署.html">算子包部署</a>。</li><li>动态库编译：Tiling实现集成在算子动态库libcust_opapi.so中。具体路径可参考<a href="./../工程化算子开发/算子动态库和静态库编译.html">算子动态库和静态库编译</a>。</li></ul></li><li><p>编写测试代码。</p><ul><li>使用ContextBuilder配置输入输出Tensor的形状、数据类型、格式及平台信息等，构建TilingContext。</li><li>通过OpTilingRegistry的<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/LoadTilingLibrary.md" target="_blank" rel="noreferrer">LoadTilingLibrary</a>接口加载Tiling动态库；使用<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/api/context/GetTilingFunc.md" target="_blank" rel="noreferrer">GetTilingFunc</a>接口获取Tiling函数指针。</li><li>执行Tiling函数，验证其正确性。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// test.cpp</span></span>
<span class="line"><span>#include &lt;iostream&gt;</span></span>
<span class="line"><span>#include &quot;exe_graph/runtime/storage_shape.h&quot;</span></span>
<span class="line"><span>#include &quot;tiling/context/context_builder.h&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>int main()</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    gert::StorageShape x_shape = {{2, 32}, {2, 32}};</span></span>
<span class="line"><span>    gert::StorageShape y_shape = {{2, 32}, {2, 32}};</span></span>
<span class="line"><span>    gert::StorageShape z_shape = {{2, 32}, {2, 32}};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    auto param = gert::TilingData::CreateCap(4096);</span></span>
<span class="line"><span>    auto workspace_size_holder = gert::ContinuousVector::Create&lt;size_t&gt;(4096);</span></span>
<span class="line"><span>    auto ws_size = reinterpret_cast&lt;gert::ContinuousVector *&gt;(workspace_size_holder.get());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    auto holder = context_ascendc::ContextBuilder()</span></span>
<span class="line"><span>                                .NodeIoNum(2, 1)</span></span>
<span class="line"><span>                                .IrInstanceNum({1, 1})</span></span>
<span class="line"><span>                                .AddInputTd(0, ge::DT_FLOAT, ge::FORMAT_ND, ge::FORMAT_ND, x_shape)</span></span>
<span class="line"><span>                                .AddInputTd(1, ge::DT_FLOAT, ge::FORMAT_ND, ge::FORMAT_ND, y_shape)</span></span>
<span class="line"><span>                                .AddOutputTd(0, ge::DT_FLOAT, ge::FORMAT_ND, ge::FORMAT_ND, z_shape)</span></span>
<span class="line"><span>                                .TilingData(param.get())</span></span>
<span class="line"><span>                                .Workspace(ws_size)</span></span>
<span class="line"><span>                                .AddPlatformInfo(&quot;Ascendxxxyy&quot;)</span></span>
<span class="line"><span>                                .BuildTilingContext();</span></span>
<span class="line"><span>    auto tilingContext = holder-&gt;GetContext&lt;gert::TilingContext&gt;();</span></span>
<span class="line"><span>    context_ascendc::OpTilingRegistry tmpIns;</span></span>
<span class="line"><span>    bool flag = tmpIns.LoadTilingLibrary(&quot;/your/path/to/so_path/liboptiling.so&quot;);  // 加载对应的Tiling动态库文件</span></span>
<span class="line"><span>    if (flag == false) {</span></span>
<span class="line"><span>        std::cout &lt;&lt; &quot;Failed to load tiling so&quot; &lt;&lt; std::endl;</span></span>
<span class="line"><span>        return -1;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    context_ascendc::TilingFunc tilingFunc = tmpIns.GetTilingFunc(&quot;AddCustom&quot;);  // 获取AddCustom算子对应的Tiling函数, 此处入参为OpType</span></span>
<span class="line"><span>    if (tilingFunc != nullptr) {</span></span>
<span class="line"><span>        ge::graphStatus ret = tilingFunc(tilingContext);  // 执行Tiling函数</span></span>
<span class="line"><span>        if (ret != ge::GRAPH_SUCCESS) {</span></span>
<span class="line"><span>            std::cout &lt;&lt; &quot;Exec tiling func failed.&quot; &lt;&lt; std::endl;</span></span>
<span class="line"><span>            return -1;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>        std::cout &lt;&lt; &quot;Get tiling func failed.&quot; &lt;&lt; std::endl;</span></span>
<span class="line"><span>        return -1;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return 0;</span></span>
<span class="line"><span>}</span></span></code></pre></div></li><li><p>编译测试代码。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>g++ test.cpp -I\${INSTALL_DIR}/include  -L\${INSTALL_DIR}/lib64 -Wl,-rpath,\${INSTALL_DIR}/lib64 -ltiling_api -lc_sec -lgraph_base -lregister -lunified_dlog -lplatform -o test</span></span></code></pre></div><ul><li>\${INSTALL_DIR}请替换为CANN软件安装后文件存储路径。以root用户安装为例，安装后文件默认存储路径为：/usr/local/Ascend/cann。</li><li>开发者根据需要链接依赖的动态库，必需链接的动态库有： <ul><li>libtiling_api.so：Tiling功能相关的动态库，包含ContextBuilder类、OpTilingRegistry类等。</li><li>libc_sec.so：安全函数库，libtiling_api.so依赖该库。</li><li>libgraph_base.so：基础数据结构与接口库，libtiling_api.so依赖该库。</li><li>libregister.so：业务函数注册相关库（例如Tiling函数注册，算子原型注册等）。</li><li>libunified_dlog.so：log库，libtiling_api.so依赖该库。</li><li>libplatform.so：平台信息库，libtiling_api.so依赖该库；Tiling函数中使用硬件平台信息时，需要依赖该库。</li></ul></li></ul></li><li><p>执行可执行文件。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>./test</span></span></code></pre></div></li></ol>`,4)])])}const _=s(p,[["render",e]]);export{u as __pageData,_ as default};
