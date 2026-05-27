import{c as a,Q as s,j as i,m as t}from"./chunks/framework.DOi4mjdC.js";const o=JSON.parse('{"title":"限制TilingData结构大小","description":"","frontmatter":{},"headers":[{"level":1,"title":"限制TilingData结构大小","slug":"限制tilingdata结构大小"}],"relativePath":"guide/算子实践参考/SIMD算子性能优化/头尾开销优化/限制TilingData结构大小.md","filePath":"guide/算子实践参考/SIMD算子性能优化/头尾开销优化/限制TilingData结构大小.md"}'),p={name:"guide/算子实践参考/SIMD算子性能优化/头尾开销优化/限制TilingData结构大小.md"};function l(e,n,_,g,c,D){return s(),i("div",null,[...n[0]||(n[0]=[t(`<h1 id="限制tilingdata结构大小" tabindex="-1">限制TilingData结构大小 <a class="header-anchor" href="#限制tilingdata结构大小" aria-label="Permalink to &quot;限制TilingData结构大小&quot;">​</a></h1><p>【优先级】中</p><p>【描述】TilingData结构是Tiling切分信息的载体，当Host侧按照Tiling切分策略计算完Tiling后，算子会以入参的方式将Tiling切分信息从Host侧传递到Device侧，此时Tiling信息存放在GM上。调用GET_TILING_DATA宏后，会将Tiling信息从GM拷贝到AI处理器的栈空间上，期间会有拷贝开销，由于GM访问效率较低，同时考虑到栈空间限制，需要限制TilingData结构大小。拷贝耗时为us级别，在小shape的场景下，进行此类优化收益会更加明显。</p><p>限制TilingData结构大小，可以从以下方面考虑：</p><ul><li>减少不必要的TilingData结构变量；</li><li>根据Tiling的数据范围选择合适的变量类型；</li><li>合理排布TilingData结构；</li><li>TilingData整体结构要求8字节补齐。</li></ul><p>【反例】</p><ul><li>如下的示例中存在TilingData结构变量冗余的情况：NumBlocks信息已经通过SetBlockDim接口进行设置，可以在Kernel侧调用GetBlockNum接口获取，无需通过TilingData结构传递。</li><li>此外，变量的数据类型也不合理：formerNum和tailNum分别为计算整块数据的核数和计算尾块数据的核数，不会超过NUM_BLOCKS的值，使用uint8_t类型即可；formerLength等变量根据其计算逻辑，不会超出uint32_t的范围，使用uint32_t类型即可。</li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// Tiling结构体定义</span></span>
<span class="line"><span>BEGIN_TILING_DATA_DEF(TilingDataUnalign)</span></span>
<span class="line"><span>  TILING_DATA_FIELD_DEF(uint64_t, numBlocks);</span></span>
<span class="line"><span>  TILING_DATA_FIELD_DEF(uint64_t, formerNum);</span></span>
<span class="line"><span>  TILING_DATA_FIELD_DEF(uint64_t, tailNum);</span></span>
<span class="line"><span>  TILING_DATA_FIELD_DEF(uint64_t, formerLength);</span></span>
<span class="line"><span>  TILING_DATA_FIELD_DEF(uint64_t, tailLength);</span></span>
<span class="line"><span>  TILING_DATA_FIELD_DEF(uint64_t, alignNum);</span></span>
<span class="line"><span>END_TILING_DATA_DEF;</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// Host侧Tiling函数计算Tiling结构信息</span></span>
<span class="line"><span>constexpr uint32_t NUM_BLOCKS = 8;</span></span>
<span class="line"><span>constexpr uint32_t SIZE_OF_HALF = 2;</span></span>
<span class="line"><span>constexpr uint32_t BLOCK_SIZE = 32;</span></span>
<span class="line"><span>constexpr uint32_t ALIGN_NUM = BLOCK_SIZE / SIZE_OF_HALF;</span></span>
<span class="line"><span>static ge::graphStatus TilingFunc(gert::TilingContext *context)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    TilingDataUnalign tiling;</span></span>
<span class="line"><span>    uint32_t totalLength = context-&gt;GetInputTensor(0)-&gt;GetShapeSize();</span></span>
<span class="line"><span>    // NumBlocks信息已经通过SetBlockDim接口进行设置</span></span>
<span class="line"><span>    context-&gt;SetBlockDim(NUM_BLOCKS);</span></span>
<span class="line"><span>    uint32_t totalLengthAligned = ((totalLength + ALIGN_NUM - 1) / ALIGN_NUM) * ALIGN_NUM;</span></span>
<span class="line"><span>    // formerNum、tailNum保证不超过0-NUM_BLOCKS数据范围</span></span>
<span class="line"><span>    uint32_t formerNum = (totalLengthAligned / ALIGN_NUM) % NUM_BLOCKS;</span></span>
<span class="line"><span>    uint32_t tailNum = NUM_BLOCKS - formerNum;</span></span>
<span class="line"><span>    // formerLength等变量根据其计算逻辑，不会超出uint32_t的范围   </span></span>
<span class="line"><span>    uint32_t formerLength = ((totalLengthAligned / NUM_BLOCKS + ALIGN_NUM - 1) / ALIGN_NUM) * ALIGN_NUM;</span></span>
<span class="line"><span>    uint32_t tailLength = (totalLengthAligned / NUM_BLOCKS / ALIGN_NUM) * ALIGN_NUM;</span></span>
<span class="line"><span>    ...</span></span>
<span class="line"><span>}</span></span></code></pre></div><p>【正例】</p><p>Tiling变量无冗余，变量数据类型最小化。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>BEGIN_TILING_DATA_DEF(TilingDataUnalign)</span></span>
<span class="line"><span>  TILING_DATA_FIELD_DEF(uint8_t, formerNum);</span></span>
<span class="line"><span>  TILING_DATA_FIELD_DEF(uint8_t, tailNum); </span></span>
<span class="line"><span>  TILING_DATA_FIELD_DEF(uint32_t, formerLength);</span></span>
<span class="line"><span>  TILING_DATA_FIELD_DEF(uint32_t, tailLength);</span></span>
<span class="line"><span>  TILING_DATA_FIELD_DEF(uint32_t, alignNum);</span></span>
<span class="line"><span>END_TILING_DATA_DEF;</span></span></code></pre></div><p>【反例】</p><p>如下的示例中TilingData结构不合理：由于AI处理器访存需要8字节对齐，在用户定义TilingData结构后，Ascend C工程框架会按照8字节对齐的方式对字节进行补齐，并保证整体TilingData结构满足8字节对齐要求。如下TilingData结构formerNum和tailNum变量都会补充3个字节，整体TilingData结构会因为8字节对齐再补充4个字节，该TilingData结构共计补充<strong>10</strong>个字节。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>BEGIN_TILING_DATA_DEF(TilingDataUnalign)</span></span>
<span class="line"><span>  TILING_DATA_FIELD_DEF(uint8_t, formerNum); // 需补充3个字节，使得formerLength变量访问无误</span></span>
<span class="line"><span>  TILING_DATA_FIELD_DEF(uint32_t, formerLength);</span></span>
<span class="line"><span>  TILING_DATA_FIELD_DEF(uint8_t, tailNum); // 需补充3个字节，使得tailLength变量访问无误</span></span>
<span class="line"><span>  TILING_DATA_FIELD_DEF(uint32_t, tailLength);</span></span>
<span class="line"><span>  TILING_DATA_FIELD_DEF(uint32_t, alignNum);// 需补充4个字节，使得下个TilingData结构访问无误</span></span>
<span class="line"><span>END_TILING_DATA_DEF;</span></span></code></pre></div><p>【正例】</p><p>如下的示例中，对Tiling参数的排布进行了调整，字节排布合理，只需要补充<strong>2</strong>个字节，达到了减小TilingData结构的目的。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>BEGIN_TILING_DATA_DEF(TilingDataUnalign)</span></span>
<span class="line"><span>  TILING_DATA_FIELD_DEF(uint8_t, formerNum);</span></span>
<span class="line"><span>  TILING_DATA_FIELD_DEF(uint8_t, tailNum); // 需补充2个字节，使得formerLength变量访问无误</span></span>
<span class="line"><span>  TILING_DATA_FIELD_DEF(uint32_t, formerLength);</span></span>
<span class="line"><span>  TILING_DATA_FIELD_DEF(uint32_t, tailLength);</span></span>
<span class="line"><span>  TILING_DATA_FIELD_DEF(uint32_t, alignNum);</span></span>
<span class="line"><span>END_TILING_DATA_DEF;</span></span></code></pre></div>`,18)])])}const I=a(p,[["render",l]]);export{o as __pageData,I as default};
