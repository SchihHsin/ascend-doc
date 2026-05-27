import{c as e,Q as s,j as t,m as n}from"./chunks/framework.DOi4mjdC.js";const l="/assets/%E5%9F%BA%E4%BA%8ECubeResGroupHandle%E7%9A%84AI-Core%E8%AE%A1%E7%AE%97%E8%B5%84%E6%BA%90%E5%88%86%E7%BB%84%E9%80%9A%E4%BF%A1%E7%A4%BA%E6%84%8F%E5%9B%BE.xGfRJlgo.png",C=JSON.parse('{"title":"CubeResGroupHandle使用说明","description":"","frontmatter":{},"headers":[{"level":1,"title":"CubeResGroupHandle使用说明","slug":"cuberesgrouphandle使用说明"}],"relativePath":"api/SIMD-API/基础API/Cube分组管理（ISASI）/CubeResGroupHandle/CubeResGroupHandle使用说明.md","filePath":"api/SIMD-API/基础API/Cube分组管理（ISASI）/CubeResGroupHandle/CubeResGroupHandle使用说明.md"}'),p={name:"api/SIMD-API/基础API/Cube分组管理（ISASI）/CubeResGroupHandle/CubeResGroupHandle使用说明.md"};function i(o,a,u,d,r,c){return s(),t("div",null,[...a[0]||(a[0]=[n('<h1 id="cuberesgrouphandle使用说明" tabindex="-1">CubeResGroupHandle使用说明 <a class="header-anchor" href="#cuberesgrouphandle使用说明" aria-label="Permalink to &quot;CubeResGroupHandle使用说明&quot;">​</a></h1><p>CubeResGroupHandle用于在分离模式下对AI Core计算资源分组。分组后，开发者可以对不同的分组指定不同的计算任务。一个AI Core分组可包含多个AIV和AIC，AIV和AIC之间采取Client和Server架构进行任务处理。AIV为Client，每一个Cube计算任务为一个消息，AIV发送消息至消息队列，AIC作为Server，遍历消息队列的消息，根据消息类型及内容执行对应的计算任务。一个CubeResGroupHandle中可以有一个或多个AIC，同一个AIC只能属于一个CubeResGroupHandle，AIV无此限制，即同一个AIV可以属于多个CubeResGroupHandle。</p><p>如下图所示，CubeResGroupHandle1中有2个AIC，10个AIV，AIC为Block0和Block1。其中Block0与Queue0、Queue1、Queue2、Queue3、Queue4进行通信，Block1与Queue 5、Queue 6、Queue 7、Queue 8、Queue9进行通信。每一个消息队列对应一个AIV，消息队列的深度固定为4，即一次性最多可以容纳4个消息。CubeResGroupHandle2的消息队列个数为12，表明有12个AIV。CubeResGroupHandle的消息处理顺序如CubeResGroupHandle2中黑色箭头所示。</p><p><strong>图 1</strong> 基于CubeResGroupHandle的AI Core计算资源分组通信示意图<br><img src="'+l+`" alt="" title="基于CubeResGroupHandle的AI-Core计算资源分组通信示意图"></p><p>基于CubeResGroupHandle实现AI Core计算资源分组步骤如下：</p><ol><li><p>创建AIC上所需要的计算对象类型。</p></li><li><p>创建通信区域描述<a href="./../KfcWorkspace/KfcWorkspace.html">KfcWorkspace</a>，用于记录通信消息Msg的地址分配。</p></li><li><p>自定义消息结构体，用于通信。</p></li><li><p>自定义回调计算结构体，根据实际业务场景实现Init函数和Call函数。</p></li><li><p>创建CubeResGroupHandle。</p></li><li><p>绑定AIV到CubeResGroupHandle。</p></li><li><p>收发消息。</p></li><li><p>AIV退出消息队列。</p></li><li><p>创建AIC上所需要的计算对象类型。</p><p>用户根据实际需求，自定义AIC所需要的计算对象类型，或者高阶API已提供的Matmul类型。例如，创建Matmul类型如下，其中A_TYPE、B_TYPE、 C_TYPE、BIAS_TYPE、CFG_NORM等含义请参考<a href="./../../../高阶API/矩阵计算/Matmul-Kernel侧接口/Matmul模板参数.html">Matmul模板参数</a>。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// A_TYPE, B_TYPE, C_TYPE, BIAS_TYPE, CFG_NORM根据实际需求场景构造</span></span>
<span class="line"><span>using MatmulApiType = MatmulImpl&lt;A_TYPE, B_TYPE, C_TYPE, C_TYPE, CFG_NORM&gt;;</span></span></code></pre></div></li><li><p>创建KfcWorkspace。</p><p>使用<a href="./../KfcWorkspace/KfcWorkspace.html">KfcWorkspace</a>管理不同CubeResGrouphandle的消息通信区的划分。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>// 创建KfcWorkspace对象前，需要对该workspaceGM清零</span></span>
<span class="line"><span>KfcWorkspace desc(workspaceGM);</span></span></code></pre></div></li><li><p>自定义消息结构体。</p><p>用户需要自行构造消息结构体<a href="#table189051237164018">CubeMsgBody</a>，用于AIV向AIC发送通信消息。构造的CubeMsgBody必须64字节对齐，该结构体最前面需要定义2字节的CubeGroupMsgHead，使消息收发机制正常运行，CubeGroupMsgHead结构定义请参考<a href="#table77221554135216">表2</a>。除2字节的CubeGroupMsgHead外，其余参数根据业务需求自行构造。</p><p><strong>表 1</strong> CubeMsgBody消息结构体</p></li></ol><table tabindex="0"><thead><tr><th>参数名称</th><th>含义</th></tr></thead><tbody><tr><td>CubeMsgBody</td><td>用户自定义的消息结构体。结构体名称可自定义，结构体大小需要64字节对齐。 &lt;pre class=&quot;screen&quot; codetype=&quot;Cpp&quot; id=&quot;screen1555172113494&quot;&gt;// 这里提供64B对齐的结构体示例，用户实际使用时，除CubeGroupMsgHead外，其他参数个数及参数类型可自行构造 struct CubeMsgBody { CubeGroupMsgHead head; // 2B，需放在结构体最前面, 自定义的CubeMsgBody中，CubeGroupMsgHead的变量名需设置为head，否则会编译报错。 uint8_t funcID; uint8_t skipCnt; uint32_t value; bool isTransA; bool isTransB; bool isAtomic; bool isLast; int32_t tailM; int32_t tailN; int32_t tailK; uint64_t aAddr; uint64_t bAddr; uint64_t cAddr; uint64_t aGap; uint64_t bGap; }&lt;/pre&gt;</td></tr></tbody></table><pre><code>**表 2**  CubeGroupMsgHead结构体参数定义
</code></pre><table tabindex="0"><thead><tr><th>参数名称</th><th>含义</th></tr></thead><tbody><tr><td>msgState</td><td>表明该位置的消息状态。参数取值如下： CubeMsgState::FREE：表明该位置还未填写消息，可执行AllocMessage。CubeMsgState::VALID：表明该位置已经含有AIV发送的消息，待AIC接收执行。CubeMsgState::QUIT：表明该位置的消息为通知AIC有AIV将退出流程。CubeMsgState::FAKE：表明该位置的消息为假消息。在消息合并场景，被跳过处理任务的AIV需要发送假消息，消息合并场景请参考PostFakeMsg中的介绍。</td></tr><tr><td>aivID</td><td>发送消息的AIV的序号。</td></tr></tbody></table><ol start="4"><li><p>自定义回调计算结构体，根据实际业务场景实现Init函数和Call函数。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>template&lt;class MatmulApiCfg, class CubeMsgBody&gt;</span></span>
<span class="line"><span>struct NormalCallbackFuncs {</span></span>
<span class="line"><span>    __aicore__ inline static void Call(MatmulApiCfg &amp;mm, __gm__ CubeMsgBody *rcvMsg, CubeResGroupHandle&lt;CubeMsgBody&gt; &amp;handle){</span></span>
<span class="line"><span>      // 用户自行实现逻辑</span></span>
<span class="line"><span>    };</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    __aicore__ inline static void Init(NormalCallbackFuncs&lt;MatmulApiCfg, CubeMsgBody&gt; &amp;foo, MatmulApiCfg &amp;mm, GM_ADDR tilingGM){</span></span>
<span class="line"><span>       // 用户自行实现逻辑</span></span>
<span class="line"><span>    };</span></span>
<span class="line"><span>   </span></span>
<span class="line"><span>};</span></span></code></pre></div><p>计算逻辑结构体的模板参数请参考<a href="#table18865397406">表3</a>。</p><p><strong>表 3</strong> 模板参数说明</p></li></ol><table tabindex="0"><thead><tr><th>参数</th><th>说明</th></tr></thead><tbody><tr><td>MatmulApiCfg</td><td>用户自定义的AIC上计算所需要对象的数据类型，参考步骤1，该模板参数必须填入。</td></tr><tr><td>CubeMsgBody</td><td>用户自定义的消息结构体，该模板参数必须填入。</td></tr></tbody></table><pre><code>用户自定义回调计算结构体中需要包含固定的Init函数和Call函数，函数原型如下所示。其中，Init函数的参数说明请参考[表4](#zh-cn_topic_0000001526206862_zh-cn_topic_0000001389783361_table111938719446)，Call函数的参数说明请参考[表5](#table9997952179)。

\`\`\`
// 该函数的参数和名称为固定格式，函数实现根据业务逻辑自行实现。
__aicore__ inline static void Init(MyCallbackFunc&lt;MatmulApiCfg, CubeMsgBody&gt; &amp;myCallBack, MatmulApiCfg &amp;mm, GM_ADDR tilingGM){
     // 用户自行实现内部逻辑
}
\`\`\`

**表 4**  Init函数参数说明
</code></pre><table tabindex="0"><thead><tr><th>参数</th><th>输入/输出</th><th>说明</th></tr></thead><tbody><tr><td>myCallBack</td><td>输入</td><td>用户自定义的带模板参数的回调计算结构体。</td></tr><tr><td>mm</td><td>输入</td><td>AIC上计算对象，多为Matmul对象。</td></tr><tr><td>tilingGM</td><td>输入</td><td>用户传入的tiling指针。</td></tr></tbody></table><pre><code>\`\`\`
// 该函数的参数和名称为固定格式，函数实现根据业务逻辑自行实现。
__aicore__ inline static void Call(MatmulApiCfg &amp;mm, __gm__ CubeMsgBody *rcvMsg, CubeResGroupHandle&lt;CubeMsgBody&gt; &amp;handle){
        // 用户自行实现内部逻辑
}
\`\`\`

**表 5**  Call函数参数说明
</code></pre><table tabindex="0"><thead><tr><th>参数</th><th>输入/输出</th><th>说明</th></tr></thead><tbody><tr><td>mm</td><td>输入</td><td>AIC上计算对象，多为Matmul对象。</td></tr><tr><td>rcvMsg</td><td>输入</td><td>用户自定义的消息结构体指针。</td></tr><tr><td>handle</td><td>输入</td><td>分组管理Handle，用户调用其接口进行收发消息，释放消息等。</td></tr></tbody></table><pre><code>某算子的回调计算结构体的代码示例如下。

\`\`\`
// 用户自定义的回调计算逻辑
template&lt;class MatmulApiCfg, typename CubeMsgBody&gt;
struct MyCallbackFunc
{
    template&lt;int32_t funcId&gt;
    __aicore__ inline static typename IsEqual&lt;funcId, 0&gt;::Type CubeGroupCallBack(MatmulApiCfg &amp;mm, __gm__ CubeMsgBody *rcvMsg, CubeResGroupHandle&lt;CubeMsgBody&gt; &amp;handle)
    {
        GlobalTensor&lt;int64_t&gt; msgGlobal;
        msgGlobal.SetGlobalBuffer(reinterpret_cast&lt;__gm__ int64_t *&gt; (rcvMsg) + sizeof(int64_t));
        DataCacheCleanAndInvalid&lt;int64_t, CacheLine::SINGLE_CACHE_LINE, DcciDst::CACHELINE_OUT&gt; (msgGlobal);
        using SrcAT = typename MatmulApiCfg::AType::T;
        auto skipNum = 0;
        for (int i = 0; i &lt; skipNum + 1; ++i)
        {
            auto tmpId = handle.FreeMessage(rcvMsg + i); // msgPtr process is complete
        }
        handle.SetSkipMsg(skipNum);
    }
    template&lt;int32_t funcId&gt;
    __aicore__ inline static typename IsEqual&lt;funcId, 1&gt;::Type CubeGroupCallBack(MatmulApiCfg &amp;mm, __gm__ CubeMsgBody *rcvMsg, CubeResGroupHandle&lt;CubeMsgBody&gt; &amp;handle)
    {
        GlobalTensor&lt;int64_t&gt; msgGlobal;
        msgGlobal.SetGlobalBuffer(reinterpret_cast&lt;__gm__ int64_t *&gt; (rcvMsg) + sizeof(int64_t));
        DataCacheCleanAndInvalid&lt;int64_t, CacheLine::SINGLE_CACHE_LINE, DcciDst::CACHELINE_OUT&gt; (msgGlobal);
        using SrcAT = typename MatmulApiCfg::AType::T;
        LocalTensor&lt;SrcAT&gt; tensor_temp;
        auto skipNum = 3;
        auto tmpId = handle.FreeMessage(rcvMsg, CubeMsgState::VALID);
        for (int i = 1; i &lt; skipNum + 1; ++i)
        {
            auto tmpId = handle.FreeMessage(rcvMsg + i, CubeMsgState::FAKE);
        }
        handle.SetSkipMsg(skipNum); // notify the cube not to process
    }
    __aicore__ inline static void Call(MatmulApiCfg &amp;mm, __gm__ CubeMsgBody *rcvMsg, CubeResGroupHandle&lt;CubeMsgBody&gt; &amp;handle)
    {
        if (rcvMsg-&gt;funcId == 0)
        {
            CubeGroupCallBack&lt;0&gt; (mm, rcvMsg, handle);
        }
        else if(rcvMsg-&gt;funcId == 1)
        {
            CubeGroupCallBack&lt;1&gt; (mm, rcvMsg, handle);
        }
    }
    __aicore__ inline static void Init(MyCallbackFunc&lt;MatmulApiCfg, CubeMsgBody&gt; &amp;foo, MatmulApiCfg &amp;mm, GM_ADDR tilingGM)
    {
        auto tempTilingGM = (__gm__ uint32_t*)tilingGM;
        auto tempTiling = (uint32_t*)&amp;(foo.tiling);
        for (int i = 0; i &lt; sizeof(TCubeTiling) / sizeof(int32_t); ++i, ++tempTilingGM, ++tempTiling)
        {
            *tempTiling = *tempTilingGM;
        }
        mm.SetSubBlockIdx(0);
        mm.Init(&amp;foo.tiling, GetTPipePtr());
    }
    TCubeTiling tiling;
};
\`\`\`
</code></pre><ol start="5"><li><p>创建CubeResGroupHandle。</p><p>用户使用<a href="./CreateCubeResGroup.html">CreateCubeResGroup</a>接口创建一个或多个CubeResGroupHandle。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>/* </span></span>
<span class="line"><span> * groupID为用户自定义的CreateCubeResGroup的groupID</span></span>
<span class="line"><span> * MatmulApiType为定义好的AIC上计算对象的类型</span></span>
<span class="line"><span> * MyCallbackFunc为定义好的自定义回调计算结构体</span></span>
<span class="line"><span> * CubeMsgBody为自定义消息结构体</span></span>
<span class="line"><span> * desc为用户初始化好的通信区域描述</span></span>
<span class="line"><span> * groupID为1，blockStart为0，blockSize为12，msgQueueSize为48，tilingGm为指针，存储了用户在AIC上所需要的tiling信息</span></span>
<span class="line"><span>*/</span></span>
<span class="line"><span>auto handle =  AscendC::CreateCubeResGroup&lt;groupID, MatmulApiType, MyCallbackFunc, CubeMsgBody&gt;(desc, 0, 12, 48, tilingGM);</span></span></code></pre></div></li><li><p>绑定AIV到CubeResGroupHandle。</p><p>绑定AIV和消息队列序号。注意：消息队列序号queIdx小于该CubeGroupHandle的消息队列总数，每个AIV需要传入不同的queIdx。handle为<a href="#li355132105919">步骤5</a>中CreateCubeResGroup创建的CubeResGroupHandle对象。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>handle.AssignQueue(queIdx);</span></span></code></pre></div></li><li><p>AIV发消息。</p><p>用户调用<a href="./AllocMessage.html">AllocMessage</a>, <a href="./PostMessage.html">PostMessage</a>等接口进行消息的收发。其中，调用AllocMessage获取消息结构体指针，通过PostMessage发送消息，在消息合并场景调用<a href="./PostFakeMsg.html">PostFakeMessage</a>发送假消息，示例如下。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>CubeGroupMsgHead head = {CubeMsgState::VALID, (uint8_t)queIdx};</span></span>
<span class="line"><span>CubeMsgBody aCubeMsgBody {head, 0, 0, 0, false, false, false, false, 0, 0, 0, 0, 0, 0, 0, 0};</span></span>
<span class="line"><span>CubeMsgBody bCubeMsgBody {head, 1, 0, 0, false, false, false, false, 0, 0, 0, 0, 0, 0, 0, 0};</span></span>
<span class="line"><span>auto offset = 0;</span></span>
<span class="line"><span>if (GetBlockIdx() == 0)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    auto msgPtr = handle.template AllocMessage(); // alloc for queue space</span></span>
<span class="line"><span>    offset = handle.template PostMessage(msgPtr, bCubeMsgBody); // post true msgPtr</span></span>
<span class="line"><span>    bool waitState = handle.template Wait&lt;true&gt; (offset); // wait until the msgPtr is processed</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>else if (GetBlockIdx() &lt; 4)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    auto msgPtr = handle.AllocMessage();</span></span>
<span class="line"><span>    offset = handle.PostFakeMsg(msgPtr); // post fake msgPtr</span></span>
<span class="line"><span>    bool waitState = handle.template Wait&lt;true&gt; (offset); // wait until the msgPtr is processed</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>else</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    auto msgPtr = handle.template AllocMessage();</span></span>
<span class="line"><span>    offset = handle.template PostMessage(msgPtr, aCubeMsgBody);</span></span>
<span class="line"><span>    bool waitState = handle.template Wait&lt;true&gt; (offset); // wait until the msgPtr is processed</span></span>
<span class="line"><span>}</span></span></code></pre></div></li><li><p>AIV退出消息队列。</p><p>调用AllocMessage获取消息结构体指针后，通过SendQuitMsg发送当前消息队列退出。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>auto msgPtr = handle.AllocMessage();        // 获取消息空间指针msgPtr</span></span>
<span class="line"><span>handle.SetQuit(msgPtr);              // 发送退出消息</span></span></code></pre></div></li></ol>`,17)])])}const b=e(p,[["render",i]]);export{C as __pageData,b as default};
