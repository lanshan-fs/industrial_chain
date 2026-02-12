
<map>
  <node ID="root" TEXT="计划 1.19-1.24 V1.8">
    <node TEXT="一、需要做的" ID="f8b6bf5f9d0daf9a4405aaf5bf4655c9" STYLE="bubble" POSITION="right">
      <node TEXT="平台面向朝阳区" ID="d67932cb040084fd715a0b972d3617bd" STYLE="fork"/>
      <node TEXT="但数据库中还会存有北京市其他区的数据" ID="3aaa287008d439e97b3b8e117d61b027" STYLE="fork"/>
      <node TEXT="平台结构和多个页面内容正在被重新构思，顶部导航栏将导航至以下六个模块" ID="8c4f9c0a5f8dd213695070df35dc805f" STYLE="fork">
        <node TEXT="首页" ID="3253946dbd3741d1ecdc1acfeacb5013" STYLE="fork"/>
        <node TEXT="产业分类" ID="bc0b83fc364c6eeee0d7a644ca39f0ff" STYLE="fork"/>
        <node TEXT="产业画像（图谱画像？产业图谱）" ID="dd680648f61b2091a70f06f5881043b6" STYLE="fork"/>
        <node TEXT="产业评分" ID="abe623b34e31e88f4ff168dc7d49b882" STYLE="fork"/>
        <node TEXT="产业诊断" ID="a9b85bfe266cc49cd9ff73cab96ea6ab" STYLE="fork"/>
        <node TEXT="系统管理（仅管理员可见）" ID="96b244b533c2e0a0d619669c83b15566" STYLE="fork"/>
      </node>
      <node TEXT="1 首页" ID="67d23513250768a30edc6b6e3e6f6485" STYLE="fork">
        <node TEXT="优化：左侧不设置子页面导航栏" ID="f49bae73f173f9a3e81ab53096df2017" STYLE="fork"/>
        <node TEXT="优化：密度加大；颜色区分（参考下图）" ID="65ade0daed078445e8c349900c11c230" STYLE="fork"/>
        <node TEXT="优化，左半屏：按上、中、下游分类（如何区分上中下游？）" ID="661034f30286bc34c5c418089970d0a8" STYLE="fork">
          <node TEXT="每个上、中、下游分类内按 tag 的 level 层级展开，展示 0 级标签和 1 级标签及其对应的企业数量即可" ID="6c049b51b89cf72e1e1abf23102e5532" STYLE="fork"/>
          <node TEXT="点击 1 级标签可跳转至对应的行业画像" ID="56f6deaf875417b74383c5c03787fa6a" STYLE="fork"/>
        </node>
        <node TEXT="优化，右半屏：设置一个概览区域" ID="ac6d10c05265a2d7dddfb17ca44a10a1" STYLE="fork">
          <node TEXT="概览企业主体及其总数" ID="6251d1e4579e027db46fc967fe1f9426" STYLE="fork">
            <node TEXT="收录总数，健康评分、协同效率等关键评分" ID="40eda5ce80f86b447b984c6f36426519" STYLE="fork"/>
            <node TEXT="企业资质构成" ID="d29966ff2cbc395ca2d2fd754d307369" STYLE="fork">
              <node TEXT="若干种资质" ID="cfb7da68765dbe20f45ab7809114fe2a" STYLE="fork"/>
            </node>
            <node TEXT="热门区域分布" ID="ee44c522c0a95052a64d656a40d5fab6" STYLE="fork">
              <node TEXT="Top 5" ID="36b9aac14a7a69ab2ca7e1d0aec96ee4" STYLE="fork"/>
              <node TEXT="按朝阳区街道分" ID="8d938a2e76f35b4246111a8b7412274d" STYLE="fork"/>
              <node TEXT="可以接朝阳区的地图？" ID="cadcad0a5ecb16fdfcdd2fcca03867ef" STYLE="fork"/>
            </node>
          </node>
          <node TEXT="概览产业诊断基本信息" ID="d27962f357ceb09c6a229e7b8c611406" STYLE="fork">
            <node TEXT="补链建议和引育推荐在业务逻辑上是有一定区别的" ID="a6bae8196e7b4a7233f6054b6b9f29ad" STYLE="fork">
              <node TEXT="补链建议：显示朝阳区上中下游需要补链的行业" ID="47ca8e63811fd02389f8c15ccb343574" STYLE="fork"/>
              <node TEXT="引育推荐：结合北京市其他区的数据（在数据库中，后台处理），显示可引进企业的推荐" ID="28d9781ab351d5db73195ca99f92fd7f" STYLE="fork"/>
            </node>
            <node TEXT="二者均默认显示 Top-5" ID="d05f8fb1eb748ede457b12ffe94c2529" STYLE="fork"/>
            <node TEXT="在组件右上角设置一个“更多”，点击弹窗，显示所有需要补链的行业或可引育的企业" ID="eb76e650b01a130eba3b817c71101b3e" STYLE="fork"/>
          </node>
        </node>
        <node TEXT="优化，与智能诊断联动，放一个模型推荐小窗？" ID="7ed85b860a3a9e401e6aacfb5e0a1e37" STYLE="fork"/>
        <node TEXT="优化：底部设置一个公告栏模块" ID="21728064e7d1e171fd0c563bfd59957f" STYLE="fork"/>
      </node>
      <node TEXT="2 产业分类" ID="c61f34ed0616ee5d2e124ec551f24cb0" STYLE="fork">
        <node TEXT="在单一页面呈现，没有子页面" ID="52579a6ecc92ed7b3458a0197931d580" STYLE="fork"/>
        <node TEXT="产业链树谱和高级搜索有相同的业务优先级，二者同等重要" ID="67d46c70b7482c733b11eb86bff1b7b6" STYLE="fork"/>
        <node TEXT="左侧：产业链树谱，按上、中、下游分类" ID="064cc860fda8b050c181617462a63a74" STYLE="fork">
          <node TEXT="每个上、中、下游分类内按 industrial_chain 数据库中 tags 表的 level 分级" ID="342996e3e59d72280535a1ca2dc7bf55" STYLE="fork"/>
          <node TEXT="在各级标签的左侧均显示对应的企业总数" ID="3e9928cae216ef65f3eb54f1319bd7da" STYLE="fork"/>
        </node>
        <node TEXT="右侧：高级搜索+企业列表" ID="cb0fe478f82fd7628cf479a78fdc557e" STYLE="fork">
          <node TEXT="高级搜索要在右侧中上部大气居中显示" ID="9cf54f685fbaa30be5c4223ece573192" STYLE="fork"/>
          <node TEXT="企业列表显示（二选一）：" ID="683ed1479c3b387892f50a7c49416a5d" STYLE="fork">
            <node TEXT="左侧产业链树谱点击某一行业后，该行业所有企业的简要信息" ID="d866c3dffe1796b30fa812b3a5ba7942" STYLE="fork"/>
            <node TEXT="高级搜索检索某一行业后，该行业所有企业的简要信息" ID="866d2b0fa8d70dead0062ffe94539bf4" STYLE="fork"/>
          </node>
          <node TEXT="点击企业列表中的任一企业后，将跳转至其对应的企业画像" ID="e73a0d48c1c722ea81fb09a9715bfa7e" STYLE="fork"/>
        </node>
      </node>
      <node TEXT="3 产业画像" ID="8473127241b5312d2d56c492973ad378" STYLE="fork">
        <node TEXT="两个子页面：行业画像、企业画像" ID="8770016d1a946769da1e98f04a33abd5" STYLE="fork"/>
        <node TEXT="部分复用“产业分类”中的产业链树谱" ID="d2013c117f365f0b5f8d6fe1ee4af8d5" STYLE="fork">
          <node TEXT="在侧边导航栏右侧显式呈现，相当于把除侧边导航栏外的页面再划分为左右两部分" ID="c777a0c537430e152f4901ed5f4c46fc" STYLE="fork"/>
          <node TEXT="取消 上游、中游、下游的分类，直接 1 级标签下的行业起手" ID="8b7313fd4fc08e11e877c28ff06a552a" STYLE="fork"/>
        </node>
        <node TEXT="行业画像" ID="d62646fa48ff7260f23e8f49270d88f4" STYLE="fork">
          <node TEXT="在顶部添加一个搜索功能，不需要像“产业分类”中那样大气居中，但要求便捷、看起来不磕碜" ID="ef28b7c0c76a082bb8da3b978adc9a52" STYLE="fork"/>
          <node TEXT="自上而下依次编排以下功能区块。图中样式仅供参考，不是一定要求" ID="bb0f30c6312428762497489baae54083" STYLE="fork">
            <node TEXT="行业综合得分、行业多维评分雷达图" ID="30483a79644f8e1472d2422f6f1babfc" STYLE="fork">
              <node TEXT="放一行" ID="f44ae5c8b4e000f46e400c365ca6f977" STYLE="fork"/>
            </node>
            <node TEXT="行业基础、行业科技属性、行业能力三个评分模型" ID="c0a90fd3511fd7c9cb72b7b364b5b595" STYLE="fork">
              <node TEXT="设置并排的三列区块" ID="b17fe200f4613b7c71a5dfd3fd3c19f7" STYLE="fork"/>
              <node TEXT="在模型各自的区块中显示详情，包括：" ID="0817edf981a3dab428155507100aa8f0" STYLE="fork">
                <node TEXT="评分模型名称" ID="7162a22b0b4a47604a23e2449b9aaf4d" STYLE="fork"/>
                <node TEXT="模型内置的评分维度雷达图" ID="e1db6755f3d96d3275ab4ddb9c135d9e" STYLE="fork"/>
                <node TEXT="所有模型内置的评分维度名称、权重和得分" ID="38075574de3c43757a673888c4838234" STYLE="fork"/>
                <node TEXT="所有模型内置的评分维度名称、权重在产业画像的页面中仅可视，在“系统管理”中可配置" ID="9dd13b60ff904b0dca6a8074c53573e3" STYLE="fork"/>
              </node>
            </node>
            <node TEXT="薄弱环节识别" ID="a3f931309ea87a77cbb15b21bde281a3" STYLE="fork">
              <node TEXT="区块独占一行" ID="35776ab7f48a4930099766e57f887ed9" STYLE="fork"/>
            </node>
            <node TEXT="风险评估" ID="06d12397e3bc730f778e5e7fce44f88a" STYLE="fork">
              <node TEXT="区块独占一行" ID="19ef1501a3f33d55c0284724902131c6" STYLE="fork"/>
              <node TEXT="该区块需列出高风险企业列表和低风险企业列表" ID="511cc98da3d366212214414bd81745f3" STYLE="fork">
                <node TEXT="每个列表均默认显示 top-5" ID="0386ce1eaf297e1dfac7268e3ff8cea0" STYLE="fork"/>
                <node TEXT="分别设置一个“更多”，点击弹窗，显示所有高风险企业或低风险企业" ID="43432bbfcc5221de8ae955c554033a29" STYLE="fork"/>
              </node>
            </node>
            <node TEXT="行业重点企业一览" ID="3af5a1bc97b431934e0fb15b92280346" STYLE="fork">
              <node TEXT="可包括排名、企业名称、注册资本、综合评分、企业标签等信息" ID="7c27f2b69118645af8059ad9636df7bb" STYLE="fork"/>
            </node>
          </node>
          <node TEXT="这是甲方提到的一句话：“放明面上来”。我觉得是便于用户理解平台功能和上手操作的意思" ID="e83f23f276216cf615e10fa7d9245f18" STYLE="fork"/>
        </node>
        <node TEXT="企业画像" ID="472a342f5886696f00af82b5beb80f6a" STYLE="fork">
          <node TEXT="在顶部设置一个搜索功能" ID="75c85892f17f582f5a7d599b96a23259" STYLE="fork"/>
          <node TEXT="自上而下依次编排以下功能区块。图中样式仅供参考，不是一定要求" ID="28398592da85497c3481c7f47c2fb82b" STYLE="fork">
            <node TEXT="公司名片" ID="32ee1c870d2febab4d610a9cc6238b46" STYLE="fork">
              <node TEXT="包含公司 Logo、公司名称、法定代表人、成立日期、地址、企业综合评分等关键信息" ID="00b404ffc6f9a07355fc649feb7ffd29" STYLE="fork"/>
              <node TEXT="独占一行" ID="0d67196c08b7fcfc829c6aecf673eda5" STYLE="fork"/>
            </node>
            <node TEXT="企业综合评分可视化、企业多维评分雷达图" ID="07abb997f668d95949269cddabb332b8" STYLE="fork">
              <node TEXT="放同一行" ID="c36e2876453d5761f0cc6789deaab28c" STYLE="fork"/>
            </node>
            <node TEXT="企业基础、企业科技属性、企业能力三个评分模型" ID="4dd7a2ae12ca79094ca5afb54ab112c7" STYLE="fork">
              <node TEXT="设置并排的三列区块" ID="df0ce7c081dc2fbc6b19dd6fdc108b93" STYLE="fork"/>
              <node TEXT="在模型各自的区块中显示详情，包括：" ID="c31373a0d0743f9d83263336f51e6617" STYLE="fork">
                <node TEXT="评分模型名称" ID="1c033d784ef9457ebd047637e9bf5d16" STYLE="fork"/>
                <node TEXT="模型内置的评分维度雷达图" ID="34fbc7b4e9c17ccd7293f13878015a13" STYLE="fork"/>
                <node TEXT="所有模型内置的评分维度名称、权重和得分" ID="34f933f73d5bd4d64964ef8bf28dbfa3" STYLE="fork"/>
                <node TEXT="所有模型内置的评分维度名称、权重在企业画像的页面中仅可视，在“系统管理”中可配置" ID="e1dabc951db6d02d436e1ec163bc8005" STYLE="fork"/>
              </node>
            </node>
            <node TEXT="企业工商信息全景" ID="f27f6d5e2409aab98f7d2017cc01c122" STYLE="fork">
              <node TEXT="独占一行，行业分左右两区块" ID="06dbffa8eaa647884f8069ab341db44a" STYLE="fork">
                <node TEXT="左侧区块显示统一社会信用代码、纳税人识别号、注册资本、实缴资本、企业类型、参保人数、注册地址、经营范围等数据库中收纳的企业工商信息" ID="6db0390c2e7f92136f198858d6e610dc" STYLE="fork">
                  <node TEXT="可使用 antd Descriptions 组件" ID="ee252dda9009b4167c45b3c563d19342" STYLE="fork"/>
                </node>
                <node TEXT="右侧区块显示行业标签、企业资质与荣誉" ID="2c13543d87e0df94dad692cdf909d1a4" STYLE="fork"/>
              </node>
            </node>
            <node TEXT="企业关联族谱与股权穿透" ID="80e02b2313e69ede519050c102b45bf1" STYLE="fork">
              <node TEXT="有一个企业关联可视化图谱" ID="9aa2d06a9d1b5436cd231259bed0e1a2" STYLE="fork"/>
              <node TEXT="设置以下信息区块" ID="8282c2d86306ca1a6a7f11b403d47f55" STYLE="fork">
                <node TEXT="实际控制人信息" ID="f652646efd4a56be6c81db7a53d62ecc" STYLE="fork"/>
                <node TEXT="股东信息" ID="65a528ad29f8885dba73e8c37b4aebf2" STYLE="fork"/>
                <node TEXT="主要人员关联及其信息" ID="b35add3372e7e42ae94bcdefc3a0f37c" STYLE="fork"/>
              </node>
            </node>
          </node>
        </node>
      </node>
      <node TEXT="4 产业评分" ID="2df2d012eef71bbee908ebbbdb60996a" STYLE="fork">
        <node TEXT="在单一页面呈现，没有子页面" ID="781cd993c272559479899e2ed507800f" STYLE="fork"/>
        <node TEXT="上、中、下游各自有一套评分，自上而下编排" ID="212c1be402c1fe68aa3830c9a937c6fa" STYLE="fork"/>
        <node TEXT="评分依据、权重可视化，在系统管理部分可配置" ID="e1f7e9efcdf10497342a93b14ce4ee04" STYLE="fork"/>
        <node TEXT="“放明面上来”" ID="7bf4acc867bef9bc424ebe4744a1efb5" STYLE="fork"/>
      </node>
      <node TEXT="5 产业诊断" ID="30bf1883223ce5d021fc4aea6e61d9e3" STYLE="fork">
        <node TEXT="暂时只有一个子页面：智能诊断" ID="117f0247080746c6022634a181186fac" STYLE="fork"/>
        <node TEXT="智能诊断（原产业分析）" ID="360b18a59e8154ce6e3f1fbb3b17440e" STYLE="fork">
          <node TEXT="先接一个大模型做 demo，再部署微调后的大模型" ID="53ea7c0e3eb731dd05f05fa4994bfde5" STYLE="fork"/>
        </node>
      </node>
      <node TEXT="6 系统管理" ID="84e6379c6a889d76385458347198b05b" STYLE="fork">
        <node TEXT="系统管理模块下暂时有两个子页面：数据管理、用户管理。数据管理还会有其自身的四个子页面：企业数据管理、行业数据管理、标签数据管理、评分权重管理。评分权重管理下又会有其自身的三个子页面：企业标签管理、标签体系库、自动打标签" ID="c387b0e926256c3e21b34ac9edbb60d1" STYLE="fork"/>
        <node TEXT="数据管理" ID="5fb7de140d437dcb454d889c061fa42e" STYLE="fork">
          <node TEXT="企业数据管理" ID="394a106b97d9510dccda9d7440efb66f" STYLE="fork">
            <node TEXT="展示尽可能多且关键的信息" ID="a12041ae3e1fce8459f56a0172868c47" STYLE="fork"/>
            <node TEXT="Excel 导入记得加模板" ID="672a10b5d957937b616de6ea5fff4bf9" STYLE="fork"/>
            <node TEXT="只有“数据用户”or“管理员”可以上传数据" ID="8e570dac86cc158efcbefd2728099d1f" STYLE="fork"/>
          </node>
          <node TEXT="行业数据管理" ID="b8a7dbb6afb71c20d28d1d1cd75f3718" STYLE="fork">
            <node TEXT="" ID="e1160dfbd0c46c8894c526f215d06033" STYLE="fork"/>
          </node>
          <node TEXT="标签数据管理" ID="5c6f60d85ad03467f362bcbf546a9058" STYLE="fork">
            <node TEXT="数据库自带基础标签" ID="f44b6fdbf8182358788ddd11b460fc58" STYLE="fork"/>
            <node TEXT="（1）企业标签管理" ID="ff33d585990befeee3a66d6fce625a22" STYLE="fork">
              <node TEXT="“打标”的标签指定，列出来并显式可选" ID="4ea6779c5f17173868d082dad683c267" STYLE="fork"/>
            </node>
            <node TEXT="（2）标签体系库" ID="5d4cbb7faf72c0569cb793196bbc8de3" STYLE="fork">
              <node TEXT="对数据库标签体系的展示" ID="c238992c01664fd3ce0ebf77fd138b48" STYLE="fork"/>
            </node>
            <node TEXT="（3）自动打标签" ID="1270270bf2259cdf1e341ae26b4f35a0" STYLE="fork">
              <node TEXT="对数据库已有标签数据的补充" ID="45219ef237d18b739bedd3121fccc71f" STYLE="fork"/>
            </node>
          </node>
          <node TEXT="评分权重管理（评分维度权重）" ID="220b8cec24058c6ca4be1b19c03ecaa9" STYLE="fork">
            <node TEXT="和其他页面风格保持一致" ID="813e3c7ba2092478cdf1a2a88f1769bf" STYLE="fork"/>
            <node TEXT="1.功能：" ID="d0b93accb67096e58fe01307e342b8da" STYLE="fork">
              <node TEXT="评分模型切换配置：允许用户在五种评分模型（基础、科技属性、专业能力、财务能力（甲方未给）、招商（甲方未给））之间切换，每个模型有独立的权重和规则配置。" ID="cd60a310537a837dc3e6a2e24fedd44c" STYLE="fork"/>
              <node TEXT="子维度权重分配：通过滑块实时调整每个子维度的权重百分比，支持可视化调整与校验。" ID="991e143cc648fb573428c1f6d7c479c6" STYLE="fork"/>
              <node TEXT="权重实时预览：通过环形图实时展示各子维度权重分布，辅助用户直观理解权重分配。" ID="03ebdb1a27f5bfdba079c86ab8d9ef99" STYLE="fork"/>
              <node TEXT="详细打分规则管理：展示每个子维度下的具体判断条件和对应得分，支持规则编辑与删除。" ID="5151f933982809bb94c77503a4f34153" STYLE="fork"/>
              <node TEXT="配置保存与校验：保存当前模型配置前，系统自动校验总权重是否为100%，并提供即时反馈。" ID="1bc4de231b8b896af09c38a9991c336a" STYLE="fork"/>
            </node>
            <node TEXT="2.业务逻辑：" ID="1ef0af81bb062171665a185ce8fbd14d" STYLE="fork">
              <node TEXT="页面加载时，默认选中“基础评分模型”，并加载该模型的子维度权重和规则数据。" ID="91988b7e87cc77ad9c68cbd6fb587503" STYLE="fork"/>
              <node TEXT="用户点击不同模型卡片时，切换当前编辑的模型，页面动态更新对应配置项和图表。" ID="598533bbe01712977dc472d9b098eebc" STYLE="fork"/>
              <node TEXT="拖动滑块调整权重时，系统实时计算总权重，若不为100%则提示颜色变化（红色），合格则为绿色。" ID="9085401ece9ccb1d0f3db37935168784" STYLE="fork"/>
              <node TEXT="用户可在规则表格中直接修改得分值，修改后即时更新内存中的数据。" ID="a5aab08ffc9726a4acf5227f6d88bbb3" STYLE="fork"/>
              <node TEXT="点击“保存配置”时，系统先校验总权重是否为100%，若不符合则提示错误并阻止保存。" ID="5157e31747e0310eea22de25fba0e8da" STYLE="fork"/>
            </node>
            <node TEXT="3.功能编排与页面布局（自上而下）：" ID="bb4dc7d08cf8b6ba009edf5e76f44b16" STYLE="fork">
              <node TEXT="1. 页面顶部功能区" ID="6aed7a88941f879dd2e31212cd025274" STYLE="fork">
                <node TEXT="" ID="57ffaad63a10d4f9223dff9b6b1a28d9" STYLE="fork"/>
                <node TEXT="功能：页面标题（评分模型权重配置）、操作按钮（重置、保存）" ID="8672cf4c96cedae5e9ed3efd2a49b627" STYLE="fork"/>
                <node TEXT="Ant Design组件：" ID="964eaccf7ba50d3c2fbce3bc2db5c107" STYLE="fork">
                  <node TEXT="Typography.Title：用于显示“评分模型权重配置”标题" ID="133eebca14a8aa86728d56ca2e4c74b2" STYLE="fork"/>
                  <node TEXT="Button：两个按钮，分别用于“重置”和“保存配置”，保存按钮设为type=&quot;primary&quot;" ID="4fd1487e378e073a942d0c5a7069b0d4" STYLE="fork"/>
                </node>
              </node>
              <node TEXT="2. 评分模型选择区" ID="6c46bfc98dd649cc99cf30f51692ec31" STYLE="fork">
                <node TEXT="" ID="09b14ff177780859b7a2421d801dc33c" STYLE="fork"/>
                <node TEXT="功能：以卡片形式展示五种评分模型，用户点击切换当前编辑的模型" ID="1c67d3d67385d941554dea0cbb8f386e" STYLE="fork"/>
                <node TEXT="Ant Design组件：" ID="bf806483d50464d96b08fcb78df4bad4" STYLE="fork">
                  <node TEXT="Card：每张卡片代表一个模型，点击后切换选中状态（“点击切换配置”（未选中）——“当前正在编辑”（选中））" ID="a501521db518ebaf27ddb1d2128d78aa" STYLE="fork"/>
                  <node TEXT="Tag：用于标记默认模型（如“基础评分模型”旁的“Default”标签）" ID="1207926def0856e1873458132d74deac" STYLE="fork"/>
                </node>
              </node>
              <node TEXT="3. 权重配置与预览区" ID="5af396a282a54ff244d36973940538d2" STYLE="fork">
                <node TEXT="" ID="0df21a53cf25e5dcebaa98b13f9859e1" STYLE="fork"/>
                <node TEXT="左半部分（权重分配）：" ID="ae82e3fda8259353737521ef54fc3350" STYLE="fork">
                  <node TEXT="功能：展示当前模型下所有子维度的滑块调整面板" ID="cc69df786ff8e091f4980c8abb6b7e46" STYLE="fork"/>
                  <node TEXT="Ant Design组件：" ID="71078b2b78b385c7bf2ff1e7350da0d6" STYLE="fork">
                    <node TEXT="Slider：每个子维度对应一个滑块，用于调整0-100的权重值" ID="0ce5679655a5d5f3e213862e7a150ad7" STYLE="fork"/>
                    <node TEXT="Statistic：显示“当前总权重”数值" ID="ceb96abb5e2ec3718d23203fcafe4609" STYLE="fork"/>
                    <node TEXT="Progress：底部进度条，动态显示总权重百分比" ID="2c5db9b0557e582fb9c506bdd032d9d5" STYLE="fork"/>
                  </node>
                </node>
              </node>
              <node TEXT="右半部分（权重分布图）：" ID="9169b71c78a6ef4886c6fe821c64dfe9" STYLE="fork">
                <node TEXT="功能：实时展示各子维度权重占比的环形图" ID="0bf3372f9c322479fb5fd9dd276b34f5" STYLE="fork"/>
                <node TEXT="Ant Design组件：" ID="76a6871ac7b5c3ac34299733e5a267f9" STYLE="fork">
                  <node TEXT="Chart（如G2Plot或ECharts的React封装）：用于绘制环形图" ID="2d6fce7ba18d889d42ecd0994944862f" STYLE="fork"/>
                  <node TEXT="Typography.Text：中央显示“Total 100”" ID="0b21219faae9a93ef576ea7188d5a54c" STYLE="fork"/>
                </node>
              </node>
              <node TEXT="4. 详细打分规则管理区" ID="83db50f0a51b8433fc3bf821731e55d0" STYLE="fork">
                <node TEXT="" ID="fa0999916ff759f13440068f9069ec3b" STYLE="fork"/>
                <node TEXT="功能：以表格形式展示每个子维度下的具体评分规则" ID="3d2c48a2c082d943de4d85e085a38ef0" STYLE="fork"/>
                <node TEXT="Ant Design组件：" ID="09748bfb1b8269448a13b757d7495b5c" STYLE="fork">
                  <node TEXT="Table：展示规则列表，列包括：子维度名称、判断条件、得分值、操作" ID="824857ee541bc388f0265d92bfcb4d27" STYLE="fork"/>
                  <node TEXT="InputNumber：用于编辑“得分值”列，支持数字输入" ID="06e5b0bde27fd386cc6a69cae798fb61" STYLE="fork"/>
                  <node TEXT="Button（图标按钮）：用于删除规则，使用&lt;DeleteOutlined /&gt;图标" ID="b028192b636d0f25fb2212b157f2545b" STYLE="fork"/>
                </node>
              </node>
            </node>
          </node>
        </node>
        <node TEXT="用户管理" ID="d7b35810653495cc444ebeb42ae27f5d" STYLE="fork"/>
      </node>
    </node>
    <node TEXT="二、设计要点" ID="2ec4442cf6c34d4a08447f74f091a677" STYLE="bubble" POSITION="right">
      <node TEXT="统一使用 antd 中的组件，或基于 antd 中的现有组件组合 or 个性化修改" ID="2993823868ec107bcfc27664e43d7ede" STYLE="fork"/>
      <node TEXT="注意保持平台各页面风格一致" ID="0bceda860c51d9a226c058db35a9899b" STYLE="fork"/>
      <node TEXT="有明确子页面的的模块，统一使用多级侧边导航栏" ID="bb8215e16ffeff3f8eb2e18a92f01b5b" STYLE="fork"/>
      <node TEXT="有两点基本需求" ID="9aabc495a2e0f10ebe516e8e83c79bc4" STYLE="fork">
        <node TEXT="高信息密度，不要让页面显得单薄" ID="4448b8a9b39a0e49acd5b474768ac016" STYLE="fork"/>
        <node TEXT="增加一些合适的色彩，增加可读性" ID="1795ce9bb2ff3b67857b8b9e1897c0e5" STYLE="fork"/>
      </node>
    </node>
  </node>
</map>