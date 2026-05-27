import{c as s,Q as n,j as a,m as p}from"./chunks/framework.DOi4mjdC.js";const l="/assets/%E5%8F%8D%E4%BE%8B%E6%8C%87%E4%BB%A4%E6%B5%81%E6%B0%B4%E5%9B%BE%EF%BC%88%E4%BB%BF%E7%9C%9F%E6%95%B0%E6%8D%AE%EF%BC%89.Cy_PeIYK.png",e="/assets/%E5%8F%8D%E4%BE%8B%E5%86%85%E5%AD%98%E8%B4%9F%E8%BD%BD%E5%88%86%E6%9E%90%EF%BC%88%E4%B8%8A%E6%9D%BF%E6%95%B0%E6%8D%AE%EF%BC%89.C-Zq_f0w.png",o="/assets/%E6%AD%A3%E4%BE%8B%E6%8C%87%E4%BB%A4%E6%B5%81%E6%B0%B4%E5%9B%BE%EF%BC%88%E4%BB%BF%E7%9C%9F%E6%95%B0%E6%8D%AE%EF%BC%89.BSsTOKh6.png",i="/assets/%E6%AD%A3%E4%BE%8B%E5%86%85%E5%AD%98%E8%B4%9F%E8%BD%BD%E5%88%86%E6%9E%90%EF%BC%88%E4%B8%8A%E6%9D%BF%E6%95%B0%E6%8D%AE%EF%BC%89.CIyS8AZx.png",u="/assets/%E5%8F%8D%E4%BE%8B%E7%AE%97%E5%AD%90%E8%BF%90%E8%A1%8C%E6%97%B6%E9%97%B4%EF%BC%88%E4%B8%8A%E6%9D%BF%E6%95%B0%E6%8D%AE%EF%BC%89.BGwvHwOW.png",_="/assets/%E6%AD%A3%E4%BE%8B%E7%AE%97%E5%AD%90%E8%BF%90%E8%A1%8C%E6%97%B6%E9%97%B4%EF%BC%88%E4%B8%8A%E6%9D%BF%E6%95%B0%E6%8D%AE%EF%BC%89.RX5k_uo-.png",h=JSON.parse('{"title":"使用Unified Buffer提升内存访问效率","description":"","frontmatter":{},"headers":[{"level":1,"title":"使用Unified Buffer提升内存访问效率","slug":"使用unified-buffer提升内存访问效率"}],"relativePath":"guide/算子实践参考/SIMD与SIMT混合算子性能优化/内存访问/使用Unified-Buffer提升内存访问效率.md","filePath":"guide/算子实践参考/SIMD与SIMT混合算子性能优化/内存访问/使用Unified-Buffer提升内存访问效率.md"}'),c={name:"guide/算子实践参考/SIMD与SIMT混合算子性能优化/内存访问/使用Unified-Buffer提升内存访问效率.md"};function r(g,t,d,E,q,B){return n(),a("div",null,[...t[0]||(t[0]=[p(`<h1 id="使用unified-buffer提升内存访问效率" tabindex="-1">使用Unified Buffer提升内存访问效率 <a class="header-anchor" href="#使用unified-buffer提升内存访问效率" aria-label="Permalink to &quot;使用Unified Buffer提升内存访问效率&quot;">​</a></h1><div class="note custom-block github-alert"><p class="custom-block-title">说明</p><p>该性能优化建议适用于如下型号：</p><ul><li>Ascend 950PR/Ascend 950DT</li></ul></div><p>【优先级】高</p><p>【描述】SIMT访问Global Memory的粒度为128B，在随机访问Global Memory中的数据时，访存效率较低。当所需访问的数据量远小于最大可用Unified Buffer空间（256KB - 系统预留8KB - 最小Dcache 32KB）时，可以使用SIMD搬运接口将数据从Global Memory搬运到Unified Buffer，使SIMT编程能够直接从Unified Buffer读取数据，从而提高内存访问效率，提升算子的整体性能。</p><p>【样例介绍】以SIMD与SIMT混合编程方式实现的gather算子为例，该算子从长度为8192的一维向量中获取指定索引的65536个数据。通过将输入数据预先搬运到Unified Buffer中，提高离散内存访问的效率，从而提升算子的整体性能。</p><p><strong>表 1</strong> 算子规格</p><p>&lt;table&gt;&lt;thead align=&quot;left&quot;&gt;&lt;tr&gt;&lt;th class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;20%&quot;&gt;&lt;p&gt;名称&lt;/p&gt; &lt;/th&gt; &lt;th class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;20%&quot;&gt;&lt;p&gt;name&lt;/p&gt; &lt;/th&gt; &lt;th class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;20%&quot;&gt;&lt;p&gt;shape&lt;/p&gt; &lt;/th&gt; &lt;th class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;20%&quot;&gt;&lt;p&gt;data type&lt;/p&gt; &lt;/th&gt; &lt;th class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;20%&quot;&gt;&lt;p&gt;format&lt;/p&gt; &lt;/th&gt; &lt;/tr&gt; &lt;/thead&gt; &lt;tbody&gt;&lt;tr&gt;&lt;td class=&quot;cellrowborder&quot; rowspan=&quot;2&quot; valign=&quot;top&quot; width=&quot;20%&quot;&gt;&lt;p&gt;算子输入&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;20%&quot;&gt;&lt;p&gt;input&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;20%&quot;&gt;&lt;p&gt;8192&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;20%&quot;&gt;&lt;p&gt;float&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;20%&quot;&gt;&lt;p&gt;ND&lt;/p&gt; &lt;/td&gt; &lt;/tr&gt; &lt;tr&gt;&lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot;&gt;&lt;p&gt;index&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot;&gt;&lt;p&gt;65536&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot;&gt;&lt;p&gt;uint32_t&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot;&gt;&lt;p&gt;ND&lt;/p&gt; &lt;/td&gt; &lt;/tr&gt; &lt;tr&gt;&lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;20%&quot;&gt;&lt;p&gt;算子输出&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;20%&quot;&gt;&lt;p&gt;output&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;20%&quot;&gt;&lt;p&gt;65536&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;20%&quot;&gt;&lt;p&gt;float&lt;/p&gt; &lt;/td&gt; &lt;td class=&quot;cellrowborder&quot; valign=&quot;top&quot; width=&quot;20%&quot;&gt;&lt;p&gt;ND&lt;/p&gt; &lt;/td&gt; &lt;/tr&gt; &lt;/tbody&gt; &lt;/table&gt;</p><p>SIMT线程层次结构为：</p><ul><li>线程块数：64</li><li>单个线程块中线程数：1024</li></ul><p>完整样例请参考<a href="https://gitcode.com/cann/asc-devkit/tree/master/examples/01_simd_cpp_api/04_best_practices/03_fusion_compute_practices/simt_gather_with_ub" target="_blank" rel="noreferrer">SIMD与SIMT混合编程使用UB提高内存访问效率</a>。</p><p>【反例】</p><p>SIMT随机访问Global Memory上的input数据，触发数据加载到Dcache，随机访存效率低，代码如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>namespace {</span></span>
<span class="line"><span>    constexpr uint32_t THREAD_COUNT = 1024;</span></span>
<span class="line"><span>    constexpr uint32_t INPUT_SIZE = 8192;</span></span>
<span class="line"><span>    constexpr uint32_t INDEX_SIZE = 65536;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>__simt_vf__ __launch_bounds__(THREAD_COUNT) inline void simt_gather(</span></span>
<span class="line"><span>    __gm__ float* input,</span></span>
<span class="line"><span>    __gm__ uint32_t* index,</span></span>
<span class="line"><span>    __gm__ float* output)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    int32_t idx = blockIdx.x * blockDim.x + threadIdx.x;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (idx &gt;= INDEX_SIZE) {</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    uint32_t gather_idx = index[idx];</span></span>
<span class="line"><span>    if (gather_idx &gt; INPUT_SIZE) {</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    output[idx] = input[gather_idx];</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>__global__ __vector__ void gather_kernel(__gm__ float* input, __gm__ uint32_t* index, __gm__ float* output)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    asc_vf_call&lt;simt_gather&gt;(dim3(THREAD_COUNT), input, index, output);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>【正例】</p><p>使用SIMD接口将数据从Global Memory搬运到Unified Buffer，基于SIMT编程方式直接从Unified Buffer读取数据，访存效率远高于读取Global Memory上的数据，代码如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>namespace {</span></span>
<span class="line"><span>    constexpr uint32_t THREAD_COUNT = 1024;</span></span>
<span class="line"><span>    constexpr uint32_t INPUT_SIZE = 8192;</span></span>
<span class="line"><span>    constexpr uint32_t INDEX_SIZE = 65536;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>__simt_vf__ __launch_bounds__(THREAD_COUNT) inline void simt_gather(</span></span>
<span class="line"><span>    __ubuf__ float* input,</span></span>
<span class="line"><span>    __gm__ uint32_t* index,</span></span>
<span class="line"><span>    __gm__ float* output)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    int32_t idx = blockIdx.x * blockDim.x + threadIdx.x;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if (idx &gt;= INDEX_SIZE) {</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    uint32_t gather_idx = index[idx];</span></span>
<span class="line"><span>    if (gather_idx &gt;= INPUT_SIZE) {</span></span>
<span class="line"><span>        return;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    output[idx] = input[gather_idx];</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>__global__ __vector__ void gather_kernel(__gm__ float* input, __gm__ uint32_t* index, __gm__ float* output)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    __ubuf__ float input_buf[INPUT_SIZE];</span></span>
<span class="line"><span>    uint32_t blk_length = INPUT_SIZE * sizeof(float);</span></span>
<span class="line"><span>    asc_copy_gm2ub_align(input_buf, input, 1, blk_length, 0, 0, false, 0, 0, 0);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    if ASC_IS_AIV {</span></span>
<span class="line"><span>        asc_sync_notify(PIPE_MTE2, PIPE_V, EVENT_ID0);</span></span>
<span class="line"><span>        asc_sync_wait(PIPE_MTE2, PIPE_V, EVENT_ID0);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    asc_vf_call&lt;simt_gather&gt;(dim3(THREAD_COUNT), input_buf, index, output);</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>【性能对比】</p><p>下图为反例的流水图，线程中有两条SIMT_LDG指令，对应表示从Global Memory上加载数据，其中第二条指令占用区间分布不均，指令启动时间差异明显，同一个线程块中随机访问输入数据input，单次访存加载128B数据，而针对单精度浮点数，实际有效数据仅为4B，导致访存效率低。</p><p><strong>图 1</strong> 反例指令流水图（仿真数据）<br><img src="`+l+'" alt="" title="反例指令流水图（仿真数据）"></p><p>下图为反例的内存负载分析图，L2 Cache到Dcache数据传输带宽为10.04GB/s。</p><p><strong>图 2</strong> 反例内存负载分析（上板数据）<br><img src="'+e+'" alt="" title="反例内存负载分析（上板数据）"></p><p>下图为正例的流水图，只有一条占用大区间的SIMT_LDG指令，MTE2流水新增搬运指令MOV_SRC_TO_DST_ALIGNv2。</p><p><strong>图 3</strong> 正例指令流水图（仿真数据）<br><img src="'+o+'" alt="" title="正例指令流水图（仿真数据）"></p><p>下图为正例的内存负载分析图，L2 Cache到Dcache数据传输带宽降低为1.61GB/s，L2 Cache到Unified Buffer数据传输带宽提升至12.93GB/s。</p><p><strong>图 4</strong> 正例内存负载分析（上板数据）<br><img src="'+i+'" alt="" title="正例内存负载分析（上板数据）"></p><p>对比算子运行时间，反例约为4.56us，正例约为3.57us，整体性能提升约21.71%。</p><p><strong>图 5</strong> 反例算子运行时间（上板数据）<br><img src="'+u+'" alt="" title="反例算子运行时间（上板数据）"></p><p><strong>图 6</strong> 正例算子运行时间（上板数据）<br><img src="'+_+'" alt="" title="正例算子运行时间（上板数据）"></p>',28)])])}const b=s(c,[["render",r]]);export{h as __pageData,b as default};
