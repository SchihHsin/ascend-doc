import{c as s,Q as a,j as p,m as e}from"./chunks/framework.DOi4mjdC.js";const h=JSON.parse('{"title":"LocalTensor构造函数","description":"","frontmatter":{},"headers":[{"level":1,"title":"LocalTensor构造函数","slug":"localtensor构造函数"},{"level":2,"title":"产品支持情况","slug":"产品支持情况"},{"level":2,"title":"功能说明","slug":"功能说明"},{"level":2,"title":"函数原型","slug":"函数原型"},{"level":2,"title":"参数说明","slug":"参数说明"},{"level":2,"title":"返回值说明","slug":"返回值说明"},{"level":2,"title":"约束说明","slug":"约束说明"},{"level":2,"title":"调用示例","slug":"调用示例"}],"relativePath":"api/SIMD-API/基础数据结构/LocalTensor/LocalTensor构造函数.md","filePath":"api/SIMD-API/基础数据结构/LocalTensor/LocalTensor构造函数.md"}'),t={name:"api/SIMD-API/基础数据结构/LocalTensor/LocalTensor构造函数.md"};function l(i,n,o,c,r,d){return a(),p("div",null,[...n[0]||(n[0]=[e(`<h1 id="localtensor构造函数" tabindex="-1">LocalTensor构造函数 <a class="header-anchor" href="#localtensor构造函数" aria-label="Permalink to &quot;LocalTensor构造函数&quot;">​</a></h1><h2 id="产品支持情况" tabindex="-1">产品支持情况 <a class="header-anchor" href="#产品支持情况" aria-label="Permalink to &quot;产品支持情况&quot;">​</a></h2><table tabindex="0"><thead><tr><th>产品</th><th>是否支持（Pipe框架）</th><th>是否支持（静态Tensor编程）</th></tr></thead><tbody><tr><td>Ascend 950PR/Ascend 950DT</td><td>√</td><td>√</td></tr><tr><td>Atlas A3 训练系列产品/Atlas A3 推理系列产品</td><td>√</td><td>√</td></tr><tr><td>Atlas A2 训练系列产品/Atlas A2 推理系列产品</td><td>√</td><td>√</td></tr><tr><td>Atlas 200I/500 A2 推理产品</td><td>√</td><td>x</td></tr><tr><td>Atlas 推理系列产品AI Core</td><td>√</td><td>√</td></tr><tr><td>Atlas 推理系列产品Vector Core</td><td>√</td><td>√</td></tr><tr><td>Atlas 训练系列产品</td><td>√</td><td>x</td></tr></tbody></table><h2 id="功能说明" tabindex="-1">功能说明 <a class="header-anchor" href="#功能说明" aria-label="Permalink to &quot;功能说明&quot;">​</a></h2><p>LocalTensor构造函数。</p><h2 id="函数原型" tabindex="-1">函数原型 <a class="header-anchor" href="#函数原型" aria-label="Permalink to &quot;函数原型&quot;">​</a></h2><ul><li><p>适用于<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/guide/%E7%BC%96%E7%A8%8B%E6%8C%87%E5%8D%97/%E7%BC%96%E7%A8%8B%E6%A8%A1%E5%9E%8B/AI-Core-SIMD%E7%BC%96%E7%A8%8B/SIMD%E7%BC%96%E7%A8%8B/%E5%9F%BA%E4%BA%8ETPipe%E5%92%8CTQue%E7%BC%96%E7%A8%8B.md" target="_blank" rel="noreferrer">Pipe编程框架</a>，通常情况下开发者不直接调用，该函数不会对LocaTensor成员变量赋初值，均为随机值。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>__aicore__ inline LocalTensor&lt;T&gt;() {}</span></span></code></pre></div></li><li><p>适用于<a href="https://gitcode.com/cann/asc-devkit/blob/master/docs/guide/%E7%BC%96%E7%A8%8B%E6%8C%87%E5%8D%97/%E7%BC%96%E7%A8%8B%E6%A8%A1%E5%9E%8B/AI-Core-SIMD%E7%BC%96%E7%A8%8B/SIMD%E7%BC%96%E7%A8%8B/%E9%9D%99%E6%80%81Tensor%E7%BC%96%E7%A8%8B.md" target="_blank" rel="noreferrer">静态Tensor编程</a>，根据指定的逻辑位置/地址/长度，返回Tensor对象。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>__aicore__ inline LocalTensor&lt;T&gt;(TPosition pos, uint32_t addr, uint32_t tileSize)</span></span>
<span class="line"><span>__aicore__ inline LocalTensor&lt;T&gt;(uint32_t addr)</span></span></code></pre></div></li></ul><h2 id="参数说明" tabindex="-1">参数说明 <a class="header-anchor" href="#参数说明" aria-label="Permalink to &quot;参数说明&quot;">​</a></h2><p><strong>表 1</strong> 模板参数说明</p><table tabindex="0"><thead><tr><th>参数名</th><th>描述</th></tr></thead><tbody><tr><td>T</td><td>适用于Pipe编程框架的原型，支持基础数据类型以及TensorTrait类型。适用于静态Tensor编程的原型，支持的数据类型如下：&lt;pre class=&quot;screen&quot; id=&quot;screen148501140172610&quot;&gt;// 仅支持基础数据类型 <strong>aicore</strong> inline LocalTensor&lt;T&gt;(TPosition pos, uint32_t addr, uint32_t tileSize) // 仅支持TensorTrait类型 <strong>aicore</strong> inline LocalTensor&lt;T&gt;(uint32_t addr)&lt;/pre&gt;</td></tr></tbody></table><p><strong>表 2</strong> 参数说明</p><table tabindex="0"><thead><tr><th>参数名</th><th>输入/输出</th><th>描述</th></tr></thead><tbody><tr><td>pos</td><td>输入</td><td>LocalTensor所在的逻辑位置。</td></tr><tr><td>addr</td><td>输入</td><td>LocalTensor的起始地址，其范围为[0, 对应物理内存最大值)。起始地址需要保证32字节对齐。</td></tr><tr><td>tileSize</td><td>输入</td><td>LocalTensor的元素个数，addr和tileSize（转换成所占字节数）之和不应超出对应物理内存的范围。</td></tr></tbody></table><h2 id="返回值说明" tabindex="-1">返回值说明 <a class="header-anchor" href="#返回值说明" aria-label="Permalink to &quot;返回值说明&quot;">​</a></h2><p>无</p><h2 id="约束说明" tabindex="-1">约束说明 <a class="header-anchor" href="#约束说明" aria-label="Permalink to &quot;约束说明&quot;">​</a></h2><p>无</p><h2 id="调用示例" tabindex="-1">调用示例 <a class="header-anchor" href="#调用示例" aria-label="Permalink to &quot;调用示例&quot;">​</a></h2><p>本节提供了LocalTensor构造函数的使用示例和其所有成员函数的调用示例。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// srcLen = 256, num = 100, M=50</span></span>
<span class="line"><span>// 示例1</span></span>
<span class="line"><span>for (int32_t i = 0; i &lt; srcLen; ++i) {</span></span>
<span class="line"><span>    inputLocal.SetValue(i, num); // 对inputLocal中第i个位置进行赋值为num</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 示例1结果如下：</span></span>
<span class="line"><span>// 数据(inputLocal): [100 100 100  ... 100]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 示例2</span></span>
<span class="line"><span>for (int32_t i = 0; i &lt; srcLen; ++i) {</span></span>
<span class="line"><span>    auto element = inputLocal.GetValue(i); // 获取inputLocal中第i个位置的数值</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 示例2结果如下：</span></span>
<span class="line"><span>// element 为100</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 示例3</span></span>
<span class="line"><span>for (int32_t i = 0; i &lt; srcLen; ++i) {</span></span>
<span class="line"><span>    inputLocal(i) = num; // 对inputLocal中第i个位置进行赋值为num</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 示例3结果如下：</span></span>
<span class="line"><span>// 数据(inputLocal): [100 100 100  ... 100]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 示例4</span></span>
<span class="line"><span>for (int32_t i = 0; i &lt; srcLen; ++i) {</span></span>
<span class="line"><span>    auto element = inputLocal(i); // 获取inputLocal中第i个位置的数值</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 示例4结果如下：</span></span>
<span class="line"><span>// element 为100</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 示例5</span></span>
<span class="line"><span>auto size = inputLocal.GetSize(); // 获取inputLocal的长度，size大小为inputLocal有多少个元素</span></span>
<span class="line"><span>// 示例5结果如下：</span></span>
<span class="line"><span>// size大小为srcLen，256。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 示例6</span></span>
<span class="line"><span>// operator[]使用方法, inputLocal[16]为从起始地址开始偏移量为16的新tensor</span></span>
<span class="line"><span>AscendC::Add(outputLocal[16], inputLocal[16], inputLocal2[16], M);</span></span>
<span class="line"><span>// 示例6结果如下：</span></span>
<span class="line"><span>// 输入数据(inputLocal): [100 100 100 ... 100]</span></span>
<span class="line"><span>// 输入数据(inputLocal2): [1 2 3 ... 66]</span></span>
<span class="line"><span>// 输出数据(outputLocal): [... 117 118 119 ... 166]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 示例7</span></span>
<span class="line"><span>AscendC::TTagType tag = 10;</span></span>
<span class="line"><span>inputLocal.SetUserTag(tag); // 对LocalTensor设置tag信息。</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 示例8</span></span>
<span class="line"><span>AscendC::LocalTensor&lt;half&gt; tensor1 = que1.DeQue&lt;half&gt;();</span></span>
<span class="line"><span>AscendC::TTagType tag1 = tensor1.GetUserTag();</span></span>
<span class="line"><span>AscendC::LocalTensor&lt;half&gt; tensor2 = que2.DeQue&lt;half&gt;();</span></span>
<span class="line"><span>AscendC::TTagType tag2 = tensor2.GetUserTag();</span></span>
<span class="line"><span>AscendC::LocalTensor&lt;half&gt; tensor3 = que3.AllocTensor&lt;half&gt;();</span></span>
<span class="line"><span>/* 使用Tag控制条件语句执行*/</span></span>
<span class="line"><span>if ((tag1 &lt;= 10) &amp;&amp; (tag2 &gt;= 9)) {</span></span>
<span class="line"><span>    AscendC::Add(tensor3, tensor1, tensor2, TILE_LENGTH); // 当tag1小于等于10，tag2大于等于9的时候，才能进行相加操作。</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// 示例9</span></span>
<span class="line"><span>// input_local为int32_t 类型，包含16个元素(64字节)</span></span>
<span class="line"><span>for (int32_t i = 0; i &lt; 16; ++i) {</span></span>
<span class="line"><span>    inputLocal.SetValue(i, i); // 对inputLocal中第i个位置进行赋值为i</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 调用ReinterpretCast将input_local重解释为int16_t类型</span></span>
<span class="line"><span>AscendC::LocalTensor&lt;int16_t&gt; interpreTensor = inputLocal.ReinterpretCast&lt;int16_t&gt;();</span></span>
<span class="line"><span>// 示例9结果如下，二者数据完全一致，在物理内存上也是同一地址，仅根据不同类型进行了重解释</span></span>
<span class="line"><span>// inputLocal:0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15</span></span>
<span class="line"><span>// interpreTensor:0 0 1 0 2 0 3 0 4 0 5 0 6 0 7 0 8 0 9 0 10 0 11 0 12 0 13 0 14 0 15 0</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 示例10</span></span>
<span class="line"><span>// 调用GetPhyAddr()返回LocalTensor地址，CPU上返回的是指针类型(T*)，NPU上返回的是物理存储的地址(uint64_t)</span></span>
<span class="line"><span>#ifdef ASCENDC_CPU_DEBUG</span></span>
<span class="line"><span>float *inputLocalCpuPtr = inputLocal.GetPhyAddr();</span></span>
<span class="line"><span>uint64_t realAddr = (uint64_t)inputLocalCpuPtr - (uint64_t)(GetTPipePtr()-&gt;GetBaseAddr(static_cast&lt;int8_t&gt;(AscendC::TPosition::VECCALC)));</span></span>
<span class="line"><span>#else</span></span>
<span class="line"><span>uint64_t realAddr = inputLocal.GetPhyAddr();</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 示例11</span></span>
<span class="line"><span>AscendC::TPosition srcPos = (AscendC::TPosition)inputLocal.GetPosition();</span></span>
<span class="line"><span>if (srcPos == AscendC::TPosition::VECCALC) {</span></span>
<span class="line"><span>    // 处理逻辑1</span></span>
<span class="line"><span>} else if (srcPos == AscendC::TPosition::A1) {</span></span>
<span class="line"><span>    // 处理逻辑2</span></span>
<span class="line"><span>} else {</span></span>
<span class="line"><span>    // 处理逻辑3</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 示例12</span></span>
<span class="line"><span>// 获取localTensor的长度(单位为Byte)，数据类型为int32_t，所以是16*sizeof(int32_t)</span></span>
<span class="line"><span>uint32_t len = inputLocal.GetLength();</span></span>
<span class="line"><span>// inputLocal:0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15</span></span>
<span class="line"><span>// len: 64</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 示例13 设置Tensor的ShapeInfo信息</span></span>
<span class="line"><span>AscendC::LocalTensor&lt;float&gt; maxUb = softmaxMaxBuf.template Get&lt;float&gt;();</span></span>
<span class="line"><span>uint32_t shapeArray[] = {16, 1024};</span></span>
<span class="line"><span>maxUb.SetShapeInfo(AscendC::ShapeInfo(2, shapeArray, AscendC::DataFormat::ND));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 示例14 获取Tensor的ShapeInfo信息</span></span>
<span class="line"><span>AscendC::ShapeInfo maxShapeInfo = maxUb.GetShapeInfo();</span></span>
<span class="line"><span>uint32_t orgShape0 = maxShapeInfo.originalShape[0];</span></span>
<span class="line"><span>uint32_t orgShape1 = maxShapeInfo.originalShape[1];</span></span>
<span class="line"><span>uint32_t orgShape2 = maxShapeInfo.originalShape[2];</span></span>
<span class="line"><span>uint32_t orgShape3 = maxShapeInfo.originalShape[3];</span></span>
<span class="line"><span>uint32_t shape2 = maxShapeInfo.shape[2];</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 示例15 SetAddrWithOffset，用于快速获取定义一个Tensor，同时指定新Tensor相对于旧Tensor首地址的偏移</span></span>
<span class="line"><span>// 需要注意，偏移的长度为旧Tensor的元素个数</span></span>
<span class="line"><span>AscendC::LocalTensor&lt;float&gt; tmpBuffer1 = tempBmm2Queue.AllocTensor&lt;float&gt;();</span></span>
<span class="line"><span>AscendC::LocalTensor&lt;half&gt; tmpHalfBuffer;</span></span>
<span class="line"><span>tmpHalfBuffer.SetAddrWithOffset(tmpBuffer1, calcSize * 2);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 示例16 SetBufferLen 如下示例将申请的Tensor长度修改为1024(单位为字节)</span></span>
<span class="line"><span>AscendC::LocalTensor&lt;float&gt; tmpBuffer2 = tempBmm2Queue.AllocTensor&lt;float&gt;();</span></span>
<span class="line"><span>tmpBuffer2.SetBufferLen(1024);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 示例17 SetSize 如下示例将申请的Tensor长度修改为256(单位为元素)</span></span>
<span class="line"><span>AscendC::LocalTensor&lt;float&gt; tmpBuffer3 = tempBmm2Queue.AllocTensor&lt;float&gt;();</span></span>
<span class="line"><span>tmpBuffer3.SetSize(256);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#ifdef ASCENDC_CPU_DEBUG</span></span>
<span class="line"><span>// 示例18 只限于CPU调试，将LocalTensor数据Dump到文件中，用于精度调试，文件保存在执行目录</span></span>
<span class="line"><span>AscendC::LocalTensor&lt;float&gt; tmpTensor = softmaxMaxBuf.template Get&lt;float&gt;();</span></span>
<span class="line"><span>tmpTensor.ToFile(&quot;tmpTensor.bin&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 示例19 只限于CPU调试，在调试窗口中打印LocalTensor数据用于精度调试，每一行打印一个datablock(32Bytes)的数据</span></span>
<span class="line"><span>AscendC::LocalTensor&lt;int32_t&gt; inputLocal = softmaxMaxBuf.template Get&lt;int32_t&gt;();</span></span>
<span class="line"><span>for (int32_t i = 0; i &lt; 16; ++i) {</span></span>
<span class="line"><span>    inputLocal.SetValue(i, i); // 对input_local中第i个位置进行赋值为i</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>inputLocal.Print();</span></span>
<span class="line"><span>// 0000: 0 1 2 3 4 5 6 7 8</span></span>
<span class="line"><span>// 0008: 9 10 11 12 13 14 15</span></span>
<span class="line"><span>#endif</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 示例20 在静态Tensor编程场景使用，根据传入的逻辑位置VECIN、起始地址128、元素个数32、数据类型float，构造出Tensor对象</span></span>
<span class="line"><span>uint32_t addr = 128;</span></span>
<span class="line"><span>uint32_t tileSize = 32;</span></span>
<span class="line"><span>AscendC::LocalTensor&lt;float&gt; tensor1 = AscendC::LocalTensor&lt;float&gt;(AscendC::TPosition::VECIN, addr, tileSize);</span></span>
<span class="line"><span>// 根据传入的TensorTrait信息、起始地址128构造出Tensor对象</span></span>
<span class="line"><span>// 其逻辑位置为VECIN，数据类型为float，Tensor元素个数为16*16*16</span></span>
<span class="line"><span>template &lt;uint32_t v&gt;</span></span>
<span class="line"><span>using UIntImm = Std::integral_constant&lt;uint32_t, v&gt;;</span></span>
<span class="line"><span>...</span></span>
<span class="line"><span>auto shape = AscendC::MakeShape(UIntImm&lt;16&gt;{}, UIntImm&lt;16&gt;{}, UIntImm&lt;16&gt;{});</span></span>
<span class="line"><span>auto stride = AscendC::MakeStride(UIntImm&lt;0&gt;{}, UIntImm&lt;0&gt;{}, UIntImm&lt;0&gt;{});</span></span>
<span class="line"><span>auto layoutMake = AscendC::MakeLayout(shape, stride);</span></span>
<span class="line"><span>auto tensorTraitMake = AscendC::MakeTensorTrait&lt;float, AscendC::TPosition::VECIN&gt;(layoutMake);</span></span>
<span class="line"><span>uint32_t addr = 128;</span></span>
<span class="line"><span>auto tensor1 = AscendC::LocalTensor&lt;decltype(tensorTraitMake)&gt;(addr);</span></span></code></pre></div>`,19)])])}const T=s(t,[["render",l]]);export{h as __pageData,T as default};
