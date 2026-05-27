import{c as s,Q as a,j as e,m as p}from"./chunks/framework.DOi4mjdC.js";const m=JSON.parse('{"title":"如何使用Kernel侧临时空间","description":"","frontmatter":{},"headers":[{"level":1,"title":"如何使用Kernel侧临时空间","slug":"如何使用kernel侧临时空间"}],"relativePath":"guide/编程指南/类库API/高阶API/常用操作速查指导/如何使用Kernel侧临时空间.md","filePath":"guide/编程指南/类库API/高阶API/常用操作速查指导/如何使用Kernel侧临时空间.md"}'),i={name:"guide/编程指南/类库API/高阶API/常用操作速查指导/如何使用Kernel侧临时空间.md"};function t(l,n,c,r,o,u){return a(),e("div",null,[...n[0]||(n[0]=[p(`<h1 id="如何使用kernel侧临时空间" tabindex="-1">如何使用Kernel侧临时空间 <a class="header-anchor" href="#如何使用kernel侧临时空间" aria-label="Permalink to &quot;如何使用Kernel侧临时空间&quot;">​</a></h1><p>Kernel侧接口的内部实现一般涉及复杂的数学计算，需要额外的临时空间来存储计算过程中的中间变量。除矩阵计算、HCCL通信类、卷积计算等，对于多数高阶API中临时空间的处理，开发者可以通过Kernel侧接口的入参sharedTmpBuffer传入提前申请的临时空间、通过接口框架申请临时空间两种方式。</p><ul><li>通过sharedTmpBuffer入参传入，Kernel侧接口使用该传入的Tensor作为临时空间。该方式下，开发者可以自行管理sharedTmpBuffer内存空间，并在接口调用完成后，复用该部分内存，内存不会反复申请释放，灵活性较高，内存利用率也较高。</li><li>接口框架申请临时空间，开发者无需在Kernel侧申请临时空间，但是需要预留临时空间的大小，即在分配内存空间时，应在可用空间大小中减去需预留的临时空间大小。</li></ul><p>无论开发者采用上述哪种方式，在申请Tensor空间或预留临时空间时，都需要提前获取Kernel侧接口所需的临时空间大小BufferSize，为此相应类别API中提供了GetxxxMaxMinTmpSize接口，用于获取所需预留空间的大小范围，其中xxx为对应的Kernel侧接口。开发者在Host侧调用GetxxxMaxMinTmpSize接口，获取预留/申请的最大和最小临时空间的字节数，基于此范围选择合适的空间大小作为Tiling参数传递到Kernel侧使用。</p><ul><li>为保证功能正确，预留/申请的临时空间大小不能小于最小临时空间大小；</li><li>在最小临时空间-最大临时空间范围内，随着临时空间增大，Kernel侧接口计算性能会有一定程度的优化提升。为了达到更好的性能，开发者可以根据实际的内存使用情况进行空间预留/申请。</li></ul><p>以Asin接口为例：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 算子输入的数据类型T为half，isReuseSource传入默认值false</span></span>
<span class="line"><span>auto shape_input = context-&gt;GetInputTensor(0)-&gt;GetOriginShape();    </span></span>
<span class="line"><span>std::vector&lt;int64_t&gt; srcDims = {shape_input.GetDim(0), shape_input.GetDim(1)};</span></span>
<span class="line"><span>uint32_t srcSize = 1;</span></span>
<span class="line"><span>for (auto dim : srcDims) {</span></span>
<span class="line"><span>    srcSize *= dim;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>uint32_t typeSize = 2;</span></span>
<span class="line"><span>ge::Shape shape(srcDims);</span></span>
<span class="line"><span>uint32_t minValue = 0;</span></span>
<span class="line"><span>uint32_t maxValue = 0;</span></span>
<span class="line"><span>AscendC::GetAsinMaxMinTmpSize(shape, typeSize, false, maxValue, minValue);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>auto platformInfo = context-&gt;GetPlatformInfo();</span></span>
<span class="line"><span>auto ascendcPlatform = platform_ascendc::PlatformAscendC(platformInfo);</span></span>
<span class="line"><span>uint64_t tailSize = 0; // UB剩余空间大小</span></span>
<span class="line"><span>ascendcPlatform.GetCoreMemSize(platform_ascendc::CoreMemType::UB, tailSize); // 本样例中使用完整的ub空间，实际情况下tailSize需要减掉用户已使用的UB空间</span></span>
<span class="line"><span>auto tmpSize = tailSize &gt;= maxValue ? maxValue : tailSize;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>AsinCustomTilingData tiling;</span></span>
<span class="line"><span>tiling.set_tmpBufferSize(tmpSize); // 将临时空间大小设置为Tiling参数</span></span></code></pre></div><p>另外，多数高阶API中提供了GetxxxTmpBufferFactorSize接口，该接口用于获取maxLiveNodeCnt和extraBuf，maxLiveNodeCnt表示临时空间是单次计算数据量所占空间的多少倍；extraBuf表示Kernel侧接口所需的临时空间大小的字节数。在固定空间大小的情况下，通过maxLiveNodeCnt和extraBuf可以推算算子单次最大计算元素数量。</p><p>推算示例如下：</p><ul><li><p>算子实现需要调用Mean接口，开发者为其预留currBuff大小的空间（即总可用空间），利用GetMeanTmpBufferFactorSize接口得到maxLiveNodeCnt、extraBuf输出值，可推导算子单次最大计算元素数量为：</p><p>currentShapeSize = (currBuff - extraBuf) / maxLiveNodeCnt / typeSize</p></li><li><p>算子实现需要调用两个Kernel侧API KernelIntf1、KernelIntf2，利用两个GetXxxTmpBufferFactorSize（其中Xxx为需要调用的两个高阶API）接口的两组输出值(maxLiveNodeCnt、extraBuf)以及当前现有的临时空间currBuff，推导单次最大计算元素数量currentShapeSize为：</p><p>currentShapeSize1 = (currBuff - extraBuf1) / maxLiveNodeCnt1 / typeSize</p><p>currentShapeSize2 = (currBuff - extraBuf2) / maxLiveNodeCnt2 / typeSize</p><p>currentShapeSize = min(currentShapeSize1 , currentShapeSize2)</p></li></ul><p>注意上文中的currBuff表示接口计算可用的空间，需要去除用户输入输出等空间。</p><p>以算子中需要同时调用Asin、Acos接口为例：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 算子输入的数据类型T为half</span></span>
<span class="line"><span>auto shape_input = context-&gt;GetInputTensor(0)-&gt;GetOriginShape();</span></span>
<span class="line"><span>std::vector&lt;int64_t&gt; srcDims = { shape_input.GetDim(0), shape_input.GetDim(1) };</span></span>
<span class="line"><span>uint32_t srcSize = 1;</span></span>
<span class="line"><span>uint32_t srcCurSize = 1;</span></span>
<span class="line"><span>for (auto dim : srcDims) {</span></span>
<span class="line"><span>    srcSize *= dim;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>uint32_t typeSize = 2;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>auto platformInfo = context-&gt;GetPlatformInfo();</span></span>
<span class="line"><span>auto ascendcPlatform = platform_ascendc::PlatformAscendC(platformInfo);</span></span>
<span class="line"><span>uint64_t tailSize = 0; // UB剩余空间大小</span></span>
<span class="line"><span>ascendcPlatform.GetCoreMemSize(platform_ascendc::CoreMemType::UB, tailSize);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>uint32_t asinMaxLiveNodeCount = 0;</span></span>
<span class="line"><span>uint32_t asinExtraBuf = 0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>uint32_t acosMaxLiveNodeCount = 0;</span></span>
<span class="line"><span>uint32_t acosExtraBuf = 0;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>AscendC::GetAsinTmpBufferFactorSize(typeSize, asinMaxLiveNodeCount, asinExtraBuf);</span></span>
<span class="line"><span>AscendC::GetAcosTmpBufferFactorSize(typeSize, acosMaxLiveNodeCount, acosExtraBuf);</span></span>
<span class="line"><span>// tmp的大小需要减去UB上调用api接口输入和输出占用的大小</span></span>
<span class="line"><span>// 该示例中包括Asin接口的输入输出，以及Acos的输入输出，其中Asin接口的输出作为Acos的输入，因此一共需要3份src的空间大小</span></span>
<span class="line"><span>auto tmpSize = tailSize - srcSize * typeSize * 3;</span></span>
<span class="line"><span>assert(tmpSize &gt;= asinExtraBuf);</span></span>
<span class="line"><span>assert(tmpSize &gt;= acosExtraBuf);</span></span>
<span class="line"><span>// 计算Asin算子单次最大计算元素数量</span></span>
<span class="line"><span>if (asinMaxLiveNodeCount != 0) {</span></span>
<span class="line"><span>    srcAsinCurSize = (tmpSize - asinExtraBuf) / asinMaxLiveNodeCount / typeSize;</span></span>
<span class="line"><span>} else {</span></span>
<span class="line"><span>    srcAsinCurSize = srcSize;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 计算Acos算子单次最大计算元素数量</span></span>
<span class="line"><span>if (acosMaxLiveNodeCount != 0) {</span></span>
<span class="line"><span>    srcAcosCurSize = (tmpSize - acosExtraBuf) / acosMaxLiveNodeCount / typeSize; </span></span>
<span class="line"><span>} else {</span></span>
<span class="line"><span>    srcAcosCurSize = srcSize;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>srcCurSize = std::min(srcAsinCurSize, srcAcosCurSize);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>AsinCustomTilingData tiling;</span></span>
<span class="line"><span>tiling.set_srcCurSize(srcCurSize); // 将单次最大计算元素数量设置为Tiling参数</span></span></code></pre></div>`,13)])])}const S=s(i,[["render",t]]);export{m as __pageData,S as default};
