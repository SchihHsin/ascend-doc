import{c as s,Q as t,j as a,m as e}from"./chunks/framework.DOi4mjdC.js";const g=JSON.parse('{"title":"tuple","description":"","frontmatter":{},"headers":[{"level":1,"title":"tuple","slug":"tuple"},{"level":2,"title":"产品支持情况","slug":"产品支持情况"},{"level":2,"title":"功能说明","slug":"功能说明"},{"level":2,"title":"函数原型","slug":"函数原型"},{"level":2,"title":"参数说明","slug":"参数说明"},{"level":2,"title":"约束说明","slug":"约束说明"},{"level":2,"title":"返回值说明","slug":"返回值说明"},{"level":2,"title":"调用示例","slug":"调用示例"}],"relativePath":"api/Utils-API/C++标准库/容器函数/tuple.md","filePath":"api/Utils-API/C++标准库/容器函数/tuple.md"}'),p={name:"api/Utils-API/C++标准库/容器函数/tuple.md"};function l(i,n,c,d,u,o){return t(),a("div",null,[...n[0]||(n[0]=[e(`<h1 id="tuple" tabindex="-1">tuple <a class="header-anchor" href="#tuple" aria-label="Permalink to &quot;tuple&quot;">​</a></h1><h2 id="产品支持情况" tabindex="-1">产品支持情况 <a class="header-anchor" href="#产品支持情况" aria-label="Permalink to &quot;产品支持情况&quot;">​</a></h2><table tabindex="0"><thead><tr><th>产品</th><th>是否支持</th></tr></thead><tbody><tr><td>Ascend 950PR/Ascend 950DT</td><td>√</td></tr><tr><td>Atlas A3 训练系列产品/Atlas A3 推理系列产品</td><td>√</td></tr><tr><td>Atlas A2 训练系列产品/Atlas A2 推理系列产品</td><td>√</td></tr><tr><td>Atlas 200I/500 A2 推理产品</td><td>x</td></tr><tr><td>Atlas 推理系列产品AI Core</td><td>x</td></tr><tr><td>Atlas 推理系列产品Vector Core</td><td>x</td></tr><tr><td>Atlas 训练系列产品</td><td>x</td></tr></tbody></table><h2 id="功能说明" tabindex="-1">功能说明 <a class="header-anchor" href="#功能说明" aria-label="Permalink to &quot;功能说明&quot;">​</a></h2><p>在C++中，tuple是一个功能强大的容器，它允许存储多个不同类型的元素。具体使用场景如下：</p><ul><li>当一个函数需要返回多个不同类型的值时，使用tuple是一个很好的选择。它避免了创建结构体或类来封装多个返回值，尤其是在不需要为这些返回值创建单独的类型时。</li><li>当需要存储不同类型的数据，可以使用tuple来存储异构元素。例如，存储数据的查询结果，其中包含不同类型的字段。</li><li>在函数调用中，当需要传递多个不同类型的参数，但又不想为它们创建结构体时，可以使用tuple对这些参数分组。</li><li>在模板元编程中，tuple可以作为类型列表，存储多个类型信息。</li><li>当程序需要在不同阶段存储和传递多个状态信息时，可以使用tuple将这些状态统一存储，便于管理。</li><li>在一些泛型算法中，可以使用tuple存储计算结果或中间结果。</li><li>在模板元编程中，可以使用tuple存储和展开参数包。</li></ul><p>以下是tuple的构造函数说明：</p><ul><li>默认构造函数：创建一个空的元组。</li><li>初始化列表构造函数：直接在创建对象时提供元素的值。</li><li>复制构造函数：用来复制一个已有的元组。</li></ul><p>另外，Ascend C提供辅助函数<a href="./make_tuple.html">make_tuple</a>，用于创建元组，它可以自动推断元素的类型，使代码更简洁，也可以使用make_tuple来构造元素列表。</p><h2 id="函数原型" tabindex="-1">函数原型 <a class="header-anchor" href="#函数原型" aria-label="Permalink to &quot;函数原型&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>template &lt;typename Tp, typename ...Tps&gt;</span></span>
<span class="line"><span>class tuple&lt;Tp, Tps...&gt; : public tuple&lt;Tps...&gt; </span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>public:</span></span>
<span class="line"><span>    __aicore__ inline tuple();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    __aicore__ inline tuple(const Tp&amp; val, const Tps&amp; ...params);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    __aicore__ inline tuple(Tp&amp;&amp; val, Tps&amp;&amp; ...params);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    template &lt;typename Head, typename ...Args&gt;</span></span>
<span class="line"><span>    __aicore__ inline tuple&lt;Tp, Tps...&gt;&amp; operator=(const tuple&lt;Head, Args...&gt;&amp; t);</span></span>
<span class="line"><span>}</span></span></code></pre></div><h2 id="参数说明" tabindex="-1">参数说明 <a class="header-anchor" href="#参数说明" aria-label="Permalink to &quot;参数说明&quot;">​</a></h2><p><strong>表 1</strong> 模板参数说明</p><table tabindex="0"><thead><tr><th>参数名</th><th>含义</th></tr></thead><tbody><tr><td>Tps...</td><td>表示输入类型的形参包，参数个数范围为[0，64]。 Ascend 950PR/Ascend 950DT，支持的数据类型为：bool、int4b_t、int8_t、uint8_t、fp8_e8m0_t、int16_t、uint16_t、half、bfloat16_t、int32_t、uint32_t、float、int64_t、uint64_t、LocalTensor、GlobalTensor。 Atlas A3 训练系列产品/Atlas A3 推理系列产品，支持的数据类型为：bool、int4b_t、int8_t、uint8_t、int16_t、uint16_t、half、bfloat16_t、int32_t、uint32_t、float、int64_t、uint64_t、LocalTensor、GlobalTensor。 Atlas A2 训练系列产品/Atlas A2 推理系列产品，支持的数据类型为：bool、int4b_t、int8_t、uint8_t、int16_t、uint16_t、half、bfloat16_t、int32_t、uint32_t、float、int64_t、uint64_t、LocalTensor、GlobalTensor。</td></tr></tbody></table><h2 id="约束说明" tabindex="-1">约束说明 <a class="header-anchor" href="#约束说明" aria-label="Permalink to &quot;约束说明&quot;">​</a></h2><ul><li>tuple实例化深度为64，即支持64个元素以内的数据类型的聚合。</li><li>构造函数为初始化列表时，列表中的数据应同为左值或右值，不可混用，初始化列表中的元素个数和类型，必须与tuple定义的元素个数和类型严格匹配。</li><li>不支持数组等可变长度的数据类型。</li><li>不支持隐式转换构造函数。</li><li>由于当前基于继承实现tuple，对于如tuple&lt;int, int&gt; a =make_tuple(1, 2, 3)的写法，会触发隐式转换，同时因为C++ object slice数据切片的特性，会导致多余的部分数据被丢弃，因此，应避免使用上述写法。</li></ul><h2 id="返回值说明" tabindex="-1">返回值说明 <a class="header-anchor" href="#返回值说明" aria-label="Permalink to &quot;返回值说明&quot;">​</a></h2><p>无</p><h2 id="调用示例" tabindex="-1">调用示例 <a class="header-anchor" href="#调用示例" aria-label="Permalink to &quot;调用示例&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>AscendC::LocalTensor&lt;T&gt; src0Local = inQueueX.AllocTensor&lt;T&gt;();</span></span>
<span class="line"><span>AscendC::LocalTensor&lt;T&gt; src1Local = inQueueX2.AllocTensor&lt;T&gt;();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// make_tuple聚合Tensor类结构</span></span>
<span class="line"><span>auto testMakeTensor = AscendC::Std::make_tuple(src0Local, src1Local, src0_global, src1_global);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>AscendC::PRINTF(&quot;tuple size is --&gt; %d\\n&quot;, AscendC::Std::tuple_size&lt;decltype(testMakeTensor)&gt;::value);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>//初始化列表构造聚合</span></span>
<span class="line"><span>AscendC::Std::tuple&lt;AscendC::LocalTensor&lt;T&gt;, AscendC::LocalTensor&lt;T&gt;, AscendC::GlobalTensor&lt;T&gt;, AscendC::GlobalTensor&lt;T&gt;&gt; testTensor{src0Local, src1Local, src0_global, src1_global};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 复制构造方式</span></span>
<span class="line"><span>AscendC::Std::tuple&lt;AscendC::LocalTensor&lt;T&gt;, AscendC::LocalTensor&lt;T&gt;, AscendC::GlobalTensor&lt;T&gt;, AscendC::GlobalTensor&lt;T&gt;&gt; test2Tensor = testTensor;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>AscendC::Std::tuple&lt;AscendC::LocalTensor&lt;T&gt;, AscendC::LocalTensor&lt;T&gt;, AscendC::GlobalTensor&lt;T&gt;, AscendC::GlobalTensor&lt;T&gt;&gt; test3Tensor;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 运算符重载</span></span>
<span class="line"><span>test3Tensor = test2Tensor;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>AscendC::PRINTF(&quot;tuple size is --&gt; %d\\n&quot;, AscendC::Std::tuple_size&lt;decltype(test3Tensor)&gt;::value);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// get方法获取对应元素</span></span>
<span class="line"><span>AscendC::LocalTensor&lt;T&gt; src0LocalTuple = AscendC::Std::get&lt;0&gt;(test3Tensor);</span></span>
<span class="line"><span>AscendC::LocalTensor&lt;T&gt; src1LocalTuple = AscendC::Std::get&lt;1&gt;(test3Tensor);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>AscendC::GlobalTensor&lt;T&gt; src0_globalTuple = AscendC::Std::get&lt;2&gt;(test3Tensor);</span></span>
<span class="line"><span>AscendC::GlobalTensor&lt;T&gt; src1_globalTuple = AscendC::Std::get&lt;3&gt;(test3Tensor);        </span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 多种数据类型初始化列表聚合</span></span>
<span class="line"><span>AscendC::Std::tuple&lt;AscendC::int4b_t, int8_t, uint8_t, int16_t, uint16_t, int32_t, uint32_t, uint64_t, int64_t, half, float, \\</span></span>
<span class="line"><span>bfloat16_t, fp8_e8m0_t, bool&gt; test1 = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10.0, 11.0, 12.0, 13.0, true};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>AscendC::PRINTF(&quot;tuple size is --&gt; %d\\n&quot;, AscendC::Std::tuple_size&lt;decltype(test1)&gt;::value);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// get方法获取多种数据类型元素</span></span>
<span class="line"><span>AscendC::int4b_t        number_int4b_t =        AscendC::Std::get&lt;0&gt;(test1);</span></span>
<span class="line"><span>int8_t                  number_int8_t =         AscendC::Std::get&lt;1&gt;(test1);</span></span>
<span class="line"><span>uint8_t                 number_uint8_t =        AscendC::Std::get&lt;2&gt;(test1);</span></span>
<span class="line"><span>int16_t                 number_int16_t =        AscendC::Std::get&lt;3&gt;(test1);</span></span>
<span class="line"><span>uint16_t                number_uint16_t =       AscendC::Std::get&lt;4&gt;(test1);</span></span>
<span class="line"><span>int32_t                 number_int32_t =        AscendC::Std::get&lt;5&gt;(test1);</span></span>
<span class="line"><span>uint32_t                number_uint32_t =       AscendC::Std::get&lt;6&gt;(test1);</span></span>
<span class="line"><span>uint64_t                number_uint64_t =       AscendC::Std::get&lt;7&gt;(test1);</span></span>
<span class="line"><span>int64_t                 number_int64_t =        AscendC::Std::get&lt;8&gt;(test1);</span></span>
<span class="line"><span>half                    number_half =           AscendC::Std::get&lt;9&gt;(test1);</span></span>
<span class="line"><span>float                   number_float =          AscendC::Std::get&lt;10&gt;(test1);</span></span>
<span class="line"><span>bfloat16_t              number_bfloat16_t =     AscendC::Std::get&lt;11&gt;(test1);</span></span>
<span class="line"><span>fp8_e8m0_t              number_fp8_e8m0_t =     AscendC::Std::get&lt;12&gt;(test1);</span></span>
<span class="line"><span>bool                    number_bool =           AscendC::Std::get&lt;13&gt;(test1);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// get方法获取元素引用接续运算</span></span>
<span class="line"><span>AscendC::Std::get&lt;1&gt;(test1)+= 1 ;</span></span>
<span class="line"><span>AscendC::Std::get&lt;2&gt;(test1)+= 1 ;</span></span>
<span class="line"><span>AscendC::Std::get&lt;3&gt;(test1)+= 1 ;</span></span>
<span class="line"><span>AscendC::Std::get&lt;4&gt;(test1)+= 1 ;</span></span>
<span class="line"><span>AscendC::Std::get&lt;5&gt;(test1)+= 1 ;</span></span>
<span class="line"><span>AscendC::Std::get&lt;6&gt;(test1)+= 1 ;</span></span>
<span class="line"><span>AscendC::Std::get&lt;7&gt;(test1)+= 1 ;</span></span>
<span class="line"><span>AscendC::Std::get&lt;8&gt;(test1)+= 1 ;</span></span>
<span class="line"><span>AscendC::Std::get&lt;10&gt;(test1) += (float)1.0 ;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// make_tuple初始化列表固定元素数据类型</span></span>
<span class="line"><span>auto test2 = AscendC::Std::make_tuple(AscendC::int4b_t (1) ,int8_t (2) ,uint8_t (3) ,int16_t (4) ,uint16_t (5) ,int32_t (6) , \\</span></span>
<span class="line"><span>    uint32_t (7) ,uint64_t (8) ,int64_t (9) ,half (10) ,float (11) ,bfloat16_t (12) ,fp8_e8m0_t (13) , bool (true));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>AscendC::PRINTF(&quot;tuple size is --&gt; %d\\n&quot;, AscendC::Std::tuple_size&lt;decltype(test2)&gt;::value);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// get方法获取多种数据类型元素</span></span>
<span class="line"><span>number_int4b_t =        AscendC::Std::get&lt;0&gt;(test2);</span></span>
<span class="line"><span>number_int8_t =         AscendC::Std::get&lt;1&gt;(test2);</span></span>
<span class="line"><span>number_uint8_t =        AscendC::Std::get&lt;2&gt;(test2);</span></span>
<span class="line"><span>number_int16_t =        AscendC::Std::get&lt;3&gt;(test2);</span></span>
<span class="line"><span>number_uint16_t =       AscendC::Std::get&lt;4&gt;(test2);</span></span>
<span class="line"><span>number_int32_t =        AscendC::Std::get&lt;5&gt;(test2);</span></span>
<span class="line"><span>number_uint32_t =       AscendC::Std::get&lt;6&gt;(test2);</span></span>
<span class="line"><span>number_uint64_t =       AscendC::Std::get&lt;7&gt;(test2);</span></span>
<span class="line"><span>number_int64_t =        AscendC::Std::get&lt;8&gt;(test2);</span></span>
<span class="line"><span>number_half =           AscendC::Std::get&lt;9&gt;(test2);</span></span>
<span class="line"><span>number_float =          AscendC::Std::get&lt;10&gt;(test2);</span></span>
<span class="line"><span>number_bfloat16_t =     AscendC::Std::get&lt;11&gt;(test2);</span></span>
<span class="line"><span>number_fp8_e8m0_t =     AscendC::Std::get&lt;12&gt;(test2);</span></span>
<span class="line"><span>number_bool =           AscendC::Std::get&lt;13&gt;(test2);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// get方法获取元素引用接续运算</span></span>
<span class="line"><span>AscendC::Std::get&lt;1&gt;(test2)+= 1 ;</span></span>
<span class="line"><span>AscendC::Std::get&lt;2&gt;(test2)+= 1 ;</span></span>
<span class="line"><span>AscendC::Std::get&lt;3&gt;(test2)+= 1 ;</span></span>
<span class="line"><span>AscendC::Std::get&lt;4&gt;(test2)+= 1 ;</span></span>
<span class="line"><span>AscendC::Std::get&lt;5&gt;(test2)+= 1 ;</span></span>
<span class="line"><span>AscendC::Std::get&lt;6&gt;(test2)+= 1 ;</span></span>
<span class="line"><span>AscendC::Std::get&lt;7&gt;(test2)+= 1 ;</span></span>
<span class="line"><span>AscendC::Std::get&lt;8&gt;(test2)+= 1 ;</span></span>
<span class="line"><span>AscendC::Std::get&lt;10&gt;(test2) += (float)1.0 ;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 变量初始化列表聚合</span></span>
<span class="line"><span>AscendC::Std::tuple&lt;AscendC::int4b_t, int8_t, uint8_t, int16_t, uint16_t, int32_t, uint32_t, uint64_t, int64_t, half, float, \\</span></span>
<span class="line"><span>bfloat16_t, fp8_e8m0_t, bool&gt; test3 = {</span></span>
<span class="line"><span>    number_int4b_t, number_int8_t, number_uint8_t, number_int16_t, number_uint16_t, number_int32_t, number_uint32_t, \\</span></span>
<span class="line"><span>    number_uint64_t, number_int64_t, number_half, number_float, number_bfloat16_t, number_fp8_e8m0_t, number_bool, </span></span>
<span class="line"><span>};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>AscendC::PRINTF(&quot;tuple size is --&gt; %d\\n&quot;, AscendC::Std::tuple_size&lt;decltype(test3)&gt;::value);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>uint32_t const_uint32_t = 0;</span></span>
<span class="line"><span>float const_float = 0.0;</span></span>
<span class="line"><span>bool const_bool = false;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// const常量类型</span></span>
<span class="line"><span>const AscendC::Std::tuple&lt;uint32_t, float, bool&gt; test4{11, 2.2, true};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// get方法获取const常量类型</span></span>
<span class="line"><span>const_uint32_t = AscendC::Std::get&lt;0&gt;(test4);</span></span>
<span class="line"><span>const_float = AscendC::Std::get&lt;1&gt;(test4);</span></span>
<span class="line"><span>const_bool = AscendC::Std::get&lt;2&gt;(test4);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>AscendC::Std::tuple_element&lt;0,decltype(test4)&gt;::type first = 77;</span></span>
<span class="line"><span>AscendC::Std::tuple_element&lt;1,decltype(test4)&gt;::type second = 7.7;</span></span>
<span class="line"><span>AscendC::Std::tuple_element&lt;2,decltype(test4)&gt;::type third = false;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>AscendC::PRINTF(&quot;The value of the test element is: %d, %f, %d\\n&quot;, first, second, third);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>AscendC::Std::tie(const_uint32_t, const_float, const_bool) = test4;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>AscendC::PRINTF(&quot;The value of the test element is: %d, %f, %d\\n&quot;, const_uint32_t, const_float, const_bool);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// const元素聚合</span></span>
<span class="line"><span>AscendC::Std::tuple&lt;const uint32_t, const float, const bool&gt; test5{33, 4.4, true};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// get方法获取const元素</span></span>
<span class="line"><span>const_uint32_t = AscendC::Std::get&lt;0&gt;(test5);</span></span>
<span class="line"><span>const_float = AscendC::Std::get&lt;1&gt;(test5);</span></span>
<span class="line"><span>const_bool = AscendC::Std::get&lt;2&gt;(test5);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const AscendC::Std::tuple&lt;const uint32_t, const float, const bool&gt; test6{33, 4.4, true};</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const_uint32_t = AscendC::Std::get&lt;0&gt;(test6);</span></span>
<span class="line"><span>const_float = AscendC::Std::get&lt;1&gt;(test6);</span></span>
<span class="line"><span>const_bool = AscendC::Std::get&lt;2&gt;(test6);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 默认构造初始化</span></span>
<span class="line"><span>AscendC::Std::tuple&lt;\\</span></span>
<span class="line"><span>uint32_t, uint32_t, uint32_t, uint32_t, uint32_t, uint32_t, uint32_t, uint32_t, uint32_t, uint32_t, \\</span></span>
<span class="line"><span>uint32_t, uint32_t, uint32_t, uint32_t, uint32_t, uint32_t, uint32_t, uint32_t, uint32_t, uint32_t, \\</span></span>
<span class="line"><span>uint32_t, uint32_t, uint32_t, uint8_t, uint32_t, uint32_t, uint32_t, uint32_t, uint32_t, uint32_t,\\</span></span>
<span class="line"><span>uint32_t, uint32_t, uint32_t, uint32_t, uint32_t, uint32_t, uint32_t, uint32_t, uint32_t, uint32_t, \\</span></span>
<span class="line"><span>uint32_t, uint32_t, uint32_t, uint32_t, uint32_t, uint32_t, uint32_t, uint32_t, uint32_t, uint32_t, \\</span></span>
<span class="line"><span>uint32_t, uint32_t, uint32_t, uint32_t, uint32_t, uint32_t, uint32_t, uint32_t, uint32_t, uint32_t, \\</span></span>
<span class="line"><span>uint32_t, uint32_t, uint32_t, uint32_t&gt; test7;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 默认元素初始化聚合</span></span>
<span class="line"><span>auto test8 = AscendC::Std::make_tuple(\\</span></span>
<span class="line"><span>    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, \\</span></span>
<span class="line"><span>    11, 12, 13, 14, 15, 16, 17, 18, 19, 20, \\</span></span>
<span class="line"><span>    21, 22, 23, 24, 25, 26, 27, 28, 29, 30, \\</span></span>
<span class="line"><span>    31, 32, 33, 34, 35, 36, 37, 38, 39, 40, \\</span></span>
<span class="line"><span>    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, \\</span></span>
<span class="line"><span>    51, 52, 53, 54, 55, 56, 57, 58, 59, 60, \\</span></span>
<span class="line"><span>    61, 62, 63, 64);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// 运算符重载赋值</span></span>
<span class="line"><span>test7 = test8;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>AscendC::PRINTF(&quot;tuple size is --&gt; %d\\n&quot;, AscendC::Std::tuple_size&lt;decltype(test7)&gt;::value);</span></span>
<span class="line"><span>AscendC::PRINTF(&quot;tuple size is --&gt; %d\\n&quot;, AscendC::Std::tuple_size&lt;decltype(test8)&gt;::value);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>// make_tuple聚合初始化</span></span>
<span class="line"><span>AscendC::Std::tuple&lt;uint32_t, float, bool&gt; test9 = AscendC::Std::make_tuple(const_uint32_t, const_float, const_bool);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const_uint32_t = AscendC::Std::get&lt;0&gt;(test9);</span></span>
<span class="line"><span>const_float = AscendC::Std::get&lt;1&gt;(test9);</span></span>
<span class="line"><span>const_bool = AscendC::Std::get&lt;2&gt;(test9);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>AscendC::PRINTF(&quot;tuple size is --&gt; %d\\n&quot;, AscendC::Std::tuple_size&lt;decltype(test9)&gt;::value);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>using Element0Type = AscendC::Std::tuple_element&lt;0, decltype(test9)&gt;::type;</span></span>
<span class="line"><span>Element0Type element0 = 88;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>using Element1Type = AscendC::Std::tuple_element&lt;1, decltype(test9)&gt;::type;</span></span>
<span class="line"><span>Element1Type element1 = 8.8;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>using Element2Type = AscendC::Std::tuple_element&lt;2, decltype(test9)&gt;::type;</span></span>
<span class="line"><span>Element2Type element2 = true;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>AscendC::PRINTF(&quot;The value of the test element is: %d, %f, %d\\n&quot;, element0, element1, element2);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>AscendC::Std::tie(const_uint32_t, const_float, const_bool) = test9;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>AscendC::PRINTF(&quot;The value of the test element is: %d, %f, %d\\n&quot;, const_uint32_t, const_float, const_bool);</span></span></code></pre></div><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 执行结果：</span></span>
<span class="line"><span>(testMakeTensor) tuple size is --&gt; 4</span></span>
<span class="line"><span>(test3Tensor) tuple size is --&gt; 4</span></span>
<span class="line"><span>(test1) tuple size is --&gt; 14</span></span>
<span class="line"><span>(test2) tuple size is --&gt; 14</span></span>
<span class="line"><span>(test3) tuple size is --&gt; 14</span></span>
<span class="line"><span>(test4 tuple_element) The value of the test element is: 77, 7.700000, 0</span></span>
<span class="line"><span>(test4 tie) The value of the test element is: 11, 2.200000, 1</span></span>
<span class="line"><span>(test7) tuple size is --&gt; 64</span></span>
<span class="line"><span>(test8) tuple size is --&gt; 64</span></span>
<span class="line"><span>(test9) tuple size is --&gt; 3</span></span>
<span class="line"><span>(test9 tuple_element) The value of the test element is: 88, 8.800000, 1</span></span>
<span class="line"><span>(test9 tie) The value of the test element is: 33, 4.400000, 1</span></span></code></pre></div>`,21)])])}const r=s(p,[["render",l]]);export{g as __pageData,r as default};
