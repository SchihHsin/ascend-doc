import{c as n,Q as s,j as t,m as p}from"./chunks/framework.DOi4mjdC.js";const u=JSON.parse('{"title":"编程示例","description":"","frontmatter":{},"headers":[{"level":1,"title":"编程示例","slug":"编程示例"}],"relativePath":"guide/编程指南/编程模型/AI-Core-SIMT编程/编程示例.md","filePath":"guide/编程指南/编程模型/AI-Core-SIMT编程/编程示例.md"}'),e={name:"guide/编程指南/编程模型/AI-Core-SIMT编程/编程示例.md"};function i(l,a,o,c,d,_){return s(),t("div",null,[...a[0]||(a[0]=[p(`<h1 id="编程示例" tabindex="-1">编程示例 <a class="header-anchor" href="#编程示例" aria-label="Permalink to &quot;编程示例&quot;">​</a></h1><p>基于SIMT进行算子开发需要使用的内置关键字和API请参见<a href="./../../语言扩展层/SIMT-BuiltIn关键字.html">SIMT BuiltIn关键字</a>、<a href="./../../语言扩展层/SIMT语言扩展层C-API.html">SIMT语言扩展层C API</a>。当前SIMT编程暂不支持部分语法结构，相关限制请参考<a href="./../../附录/CPP标准支持/语法限制/语法限制.html">语法限制</a>。</p><p>考虑如下计算场景：从形状为100000 * 128的二维向量中获取指定索引的12288行数据。算子输出output第i行数据的计算公式为：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>output[i] = input[index[i]]</span></span></code></pre></div><p>在核函数中完成一行数据量的计算逻辑，通过配置多个线程完成不同行的数据计算操作。核函数的实现逻辑具体为：</p><ul><li><p>通过每个线程独有的线程索引找到当前线程需要计算的数据偏移量。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int32_t out_row = blockIdx.x * blockDim.x + threadIdx.x;</span></span></code></pre></div><p>一个线程完成一次核函数的计算操作，核函数内通过计算blockIdx.x * blockDim.x + threadIdx.x得到索引偏移，其中blockIdx是当前线程块的索引，blockDim是每个线程块启用的线程数，threadIdx是当前线程在线程块内的索引，更多详细介绍请参考<a href="./../../语言扩展层/SIMT-BuiltIn关键字.html">SIMT BuiltIn关键字</a>。</p></li><li><p>通过下标偏移将偏移位置的输入数据拷贝到输出中，从而完成获取指定数据的功能。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>uint32_t in_row = index[out_row];</span></span>
<span class="line"><span>for (int32_t col = 0; col &lt; in_width; col++) { </span></span>
<span class="line"><span>    //每个线程完成一行数据的计算操作</span></span>
<span class="line"><span>    int input_idx = in_row * in_width + col;</span></span>
<span class="line"><span>    int output_idx = out_row * in_width + col;</span></span>
<span class="line"><span>    gather_output[output_idx] = input[input_idx];</span></span>
<span class="line"><span>}</span></span></code></pre></div></li></ul><p>核函数的实现参考如下代码。完整的样例请参考<a href="https://gitcode.com/cann/asc-devkit/tree/master/examples/03_simt_api/02_features/00_resource_management/basic_gather" target="_blank" rel="noreferrer">简单gather算子样例</a>。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>template &lt;typename type_data, typename type_idx&gt;</span></span>
<span class="line"><span>__global__ void gather_custom(type_data* input, type_idx* index, type_data* gather_output, uint32_t in_width, uint32_t index_total_length)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    // 计算计算索引偏移量</span></span>
<span class="line"><span>    int32_t out_row = blockIdx.x * blockDim.x + threadIdx.x;</span></span>
<span class="line"><span>    // 从index中取出需要处理的行索引</span></span>
<span class="line"><span>    uint32_t in_row = index[out_row];</span></span>
<span class="line"><span>    // 循环处理该行所有数据</span></span>
<span class="line"><span>    for (int32_t col = 0; col &lt; in_width; col++) {</span></span>
<span class="line"><span>        int input_idx = in_row * in_width + col;</span></span>
<span class="line"><span>        int output_idx = out_row * in_width + col;</span></span>
<span class="line"><span>        gather_output[output_idx] = input[input_idx]; // 将输入数据拷贝到输出中</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>算子需要处理总共12288行数据，每行数据由核函数完成处理，因此需要12288个线程来完成对所有数据的处理。在Host侧通过&lt;&lt;&lt;...&gt;&gt;&gt;调用核函数，同时设置启动48个线程块、每个线程块包含256个线程，示例代码如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int main(int argc, char* argv[])</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>   …    </span></span>
<span class="line"><span>    gather_custom&lt;&lt;&lt;48, 256, 0, stream&gt;&gt;&gt;(input_device, index_device, output_device, in_shape[1], index_total_length);</span></span>
<span class="line"><span>   … </span></span>
<span class="line"><span>}</span></span></code></pre></div>`,10)])])}const h=n(e,[["render",i]]);export{u as __pageData,h as default};
