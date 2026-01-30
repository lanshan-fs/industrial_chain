
<map>
  <node ID="root" TEXT="业务需求1.28-V3">
    <node TEXT="一、需要做的" ID="f8b6bf5f9d0daf9a4405aaf5bf4655c9" STYLE="bubble" POSITION="right">
      <node TEXT="平台面向朝阳区" ID="d67932cb040084fd715a0b972d3617bd" STYLE="fork"/>
      <node TEXT="当前数据库中数据有限，但未来设计还会存有北京市其他区的数据" ID="3aaa287008d439e97b3b8e117d61b027" STYLE="fork"/>
      <node TEXT="平台有以下六个模块：" ID="8c4f9c0a5f8dd213695070df35dc805f" STYLE="fork">
        <node TEXT="首页" ID="3253946dbd3741d1ecdc1acfeacb5013" STYLE="fork"/>
        <node TEXT="产业分类" ID="bc0b83fc364c6eeee0d7a644ca39f0ff" STYLE="fork"/>
        <node TEXT="产业画像" ID="dd680648f61b2091a70f06f5881043b6" STYLE="fork"/>
        <node TEXT="产业评分" ID="abe623b34e31e88f4ff168dc7d49b882" STYLE="fork"/>
        <node TEXT="产业诊断" ID="a9b85bfe266cc49cd9ff73cab96ea6ab" STYLE="fork"/>
        <node TEXT="系统管理（仅管理员可见）" ID="96b244b533c2e0a0d619669c83b15566" STYLE="fork"/>
      </node>
      <node TEXT="写明**优化**的模块，针对性考虑**优化**的部分，其他部分保持不变" ID="78e1125e872f84c97c1acd5ee74e7279" STYLE="fork"/>
      <node TEXT="1 首页" ID="67d23513250768a30edc6b6e3e6f6485" STYLE="fork">
        <node TEXT="优化：页面视觉，色系调整" ID="d80e3ec5932ecc424069aabd4b306d9a" STYLE="fork">
          <node TEXT="和其他页面色系保持一致" ID="bf128ad0a82944bcf0e69bcfb5bd5743" STYLE="fork"/>
          <node TEXT="甲方要求，“数字医疗产业全景驾驶舱”区块可用蓝色系背景，其他区块和其他页面保持一致，灰白色" ID="2bba537467a2c996eb6c7910b1ae8607" STYLE="fork"/>
        </node>
        <node TEXT="优化：“数字医疗产业全景驾驶舱” 和 “朝阳区产业链洞察平台” 在视觉上有冲突" ID="72e2e935dd0ad442e7e0d80d9b9ba933" STYLE="fork"/>
        <node TEXT="优化：公告栏需要大气呈现" ID="e67aea8dab8bb6f41cf0eb97a45a32ce" STYLE="fork"/>
      </node>
      <node TEXT="2 产业分类" ID="c61f34ed0616ee5d2e124ec551f24cb0" STYLE="fork">
        <node TEXT="优化：高级搜索" ID="7388af0902d288887dd9e919f59d0be3" STYLE="fork">
          <node TEXT="搜索栏分三个部分，参考 CNKI Overseas" ID="0cbc49904fff47aab787109f00a53e5b" STYLE="fork">
            <node TEXT="左侧：下拉单选，用于限制检索“主题”" ID="42313202ed6ad68f2176b11a31376c35" STYLE="fork">
              <node TEXT="“主题”包含：行业标签、企业名称、企业信用代码、法定代表人、经营范围等" ID="fe964b95819426ec22939a73dc288430" STYLE="fork"/>
            </node>
            <node TEXT="中间：输入框" ID="7f9396984e5016496a00048f8f75f6f8" STYLE="fork"/>
            <node TEXT="右侧：“搜索”按钮" ID="1e88e6c6bc41aa866967f24ba9a094ec" STYLE="fork"/>
          </node>
          <node TEXT="高级搜索，参考 CNKI Overseas" ID="e0a694559009855d84cd0e066172d61c" STYLE="fork">
            <node TEXT="在搜索栏右侧设置一个“高级搜索”入口，点击后进入高级搜索" ID="5af2fc44eb6ea9c8ff3bfa42ce505656" STYLE="fork"/>
            <node TEXT="高级搜索使用 CNKI Overseas 或 PubMed 的 And、Or、Not 式的符合逻辑检索 " ID="b06a0282e0de4d6535efbc3a8ea6029e" STYLE="fork"/>
          </node>
        </node>
      </node>
      <node TEXT="3 产业画像" ID="8473127241b5312d2d56c492973ad378" STYLE="fork">
        <node TEXT="行业画像" ID="d62646fa48ff7260f23e8f49270d88f4" STYLE="fork">
          <node TEXT="背景：甲方要求只保留企业评分模型，删去行业评分模型" ID="e938982c889560431d305a1632d8151c" STYLE="fork">
            <node TEXT="行业评分使用行业内所有企业评分的平均值" ID="68d0f18d1038376176e634e34eca8620" STYLE="fork">
              <node TEXT="总评分" ID="5e3ecfc369c3cb1c10a3e2c8c396a9e6" STYLE="fork">
                <node TEXT="使用行业内所有企业总评分的平均值" ID="e6c98db77ba5a7d15bd894429a5d7d77" STYLE="fork"/>
              </node>
              <node TEXT="各个评分模型的评分" ID="5b25d09186829e1ac1036d9efb6c0fee" STYLE="fork">
                <node TEXT="使用行业内所有企业在相应评分模型下的评分的平均值" ID="404c94f34a343756906cdf5c035c8041" STYLE="fork"/>
              </node>
              <node TEXT="各个评分模型的各个维度的评分" ID="6f6882b7cfd8799f6d74ca0bd33fafb0" STYLE="fork">
                <node TEXT="使用行业内所有企业在相应评分模型的相应维度下的评分的平均值" ID="d56456c63c6173c1988db08a59b450a3" STYLE="fork"/>
              </node>
            </node>
          </node>
          <node TEXT="优化：“产业多维能力雷达”更名为“xxx行业多维能力”" ID="935d2628959d6500385e0ae6caef9861" STYLE="fork"/>
          <node TEXT="优化：产业多维能力雷达图各个维度（评分模型）数值逻辑调整" ID="97e149db3273493ca9854e9f9fb7aba2" STYLE="fork">
            <node TEXT="使用行业内所有企业在该评分模型下的评分的平均值" ID="95fa7867494ba664f344bbb1947c9054" STYLE="fork"/>
            <node TEXT="增加纵向的时间维度" ID="571799289d6dc264e290ad4071115412" STYLE="fork">
              <node TEXT="有序层叠 6 种颜色的雷达图" ID="54f8f9d85e6af8590e8de31cea84d9d3" STYLE="fork"/>
              <node TEXT="覆盖过去 6 个月该行业的多维能力评分" ID="cddbec400f3e7d619d37e3da47516eea" STYLE="fork"/>
            </node>
          </node>
          <node TEXT="优化：行业基础评分、科技属性评分、行业能力评分三个评分模型区块" ID="64dce43b659cb4cab2ef0f2c69007051" STYLE="fork">
            <node TEXT="原雷达图部分用一个 statistic 组件替换，表示该行业在该评分模型下的总评分" ID="9da57965e35714f878f9453cdb64954f" STYLE="fork"/>
            <node TEXT="下方的可滚动列表的字段调整为：" ID="8952e3f303f19c6cc1fcc7aa0221783b" STYLE="fork">
              <node TEXT="企业名称" ID="fe93c80c1a7c91c04b876ac86c2d5655" STYLE="fork"/>
              <node TEXT="评分" ID="2ed0735d19771f492469ca223915b5cf" STYLE="fork"/>
              <node TEXT="评分详情" ID="7ab7b06015f0f51a427407ee740be58a" STYLE="fork">
                <node TEXT="所有企业在该字段的值均为“详情”" ID="3a0bd9c3e57563a255c738214230670a" STYLE="fork"/>
                <node TEXT="点击“详情”后，会弹窗" ID="77c743f65150f5b5f65128a144faa2e2" STYLE="fork">
                  <node TEXT="可以看到该企业在该评分模型下的各个评分维度的评分（含权重信息）" ID="fd8f467beebd6f386534226c6593cfe0" STYLE="fork"/>
                </node>
              </node>
            </node>
          </node>
        </node>
        <node TEXT="企业画像" ID="472a342f5886696f00af82b5beb80f6a" STYLE="fork">
          <node TEXT="" ID="4118d31b750b51c726ce557ecc860af4" STYLE="fork"/>
        </node>
      </node>
      <node TEXT="4 产业评分" ID="2df2d012eef71bbee908ebbbdb60996a" STYLE="fork">
        <node TEXT="在单一页面呈现，没有子页面" ID="781cd993c272559479899e2ed507800f" STYLE="fork"/>
        <node TEXT="上、中、下游各自评分" ID="b63cdbccda7a97cabd3d20a78bfdfe0d" STYLE="fork"/>
      </node>
      <node TEXT="5 产业诊断" ID="30bf1883223ce5d021fc4aea6e61d9e3" STYLE="fork">
        <node TEXT="暂时只有一个子页面：智能诊断" ID="117f0247080746c6022634a181186fac" STYLE="fork"/>
        <node TEXT="智能诊断（原产业分析）" ID="360b18a59e8154ce6e3f1fbb3b17440e" STYLE="fork">
          <node TEXT="先接一个大模型做 demo，再部署微调后的大模型" ID="53ea7c0e3eb731dd05f05fa4994bfde5" STYLE="fork"/>
        </node>
      </node>
      <node TEXT="6 系统管理" ID="84e6379c6a889d76385458347198b05b" STYLE="fork">
        <node TEXT="系统管理模块下暂时有两个子页面：数据管理、用户管理。数据管理还会有其自身的三个子页面：企业数据管理、标签数据管理、评分权重管理。评分权重管理下又会有其自身的三个子页面：企业标签管理、标签体系库、自动打标签" ID="c387b0e926256c3e21b34ac9edbb60d1" STYLE="fork"/>
        <node TEXT="数据管理" ID="5adb465d0a961023f14a6acf200a8b00" STYLE="fork">
          <node TEXT="企业数据管理" ID="6f7686ca4684ca1ba2cdc7848b238561" STYLE="fork">
            <node TEXT="优化：默认显示“15 / page”" ID="4cc04c2f70b21bba286659ad2af2ceaa" STYLE="fork"/>
            <node TEXT="优化：列表默认包含以下字段" ID="290d323cb10c8bb3c16a1a20b4ac8b9e" STYLE="fork">
              <node TEXT="企业名称（保留）" ID="854334e4414127816e5d2dd7bfe82450" STYLE="fork"/>
              <node TEXT="统一社会信用代码（保留）" ID="ac6687569154c940ddc4dccaa72bd674" STYLE="fork"/>
              <node TEXT="法定代表人" ID="3ba6f9c5786475e4edc8cbca34a1674a" STYLE="fork"/>
              <node TEXT="注册资本" ID="5dcb7d64107d3dcad18b6bdb9c2fb68b" STYLE="fork"/>
              <node TEXT="行业标签" ID="98c330f69da0a95c9363e9b9c19fa312" STYLE="fork"/>
              <node TEXT="点击查看全部" ID="7e76af104b274d4950a8c539cfbd414c" STYLE="fork">
                <node TEXT="所有企业在该字段的值均为“全部”" ID="c52c76e54a95439cbf1015fee40516a1" STYLE="fork"/>
              </node>
              <node TEXT="更新时间（保留）" ID="3302dda4792a64dc3f3f986f80fc2be0" STYLE="fork"/>
              <node TEXT="操作（保留）" ID="3a8aebf9cbbec1ac39e38a855b855439" STYLE="fork">
                <node TEXT="编辑 &amp; 删除" ID="9acba547991b4b3ce71c1dfdeb98d3a5" STYLE="fork"/>
              </node>
            </node>
            <node TEXT="“全部”和“编辑”点击后弹出同样的排列有企业全部数据的窗口" ID="4799520a4227b3b53209f1ff7e9dd986" STYLE="fork">
              <node TEXT="但不同的是" ID="5fabf65ad9b9fb6434938d78932bdb9c" STYLE="fork">
                <node TEXT="“全部”点击后的弹窗无法编辑" ID="e8588cb71084a20ea3f00a0a42c0e43f" STYLE="fork"/>
                <node TEXT="“编辑”点击后的弹窗可以编辑" ID="d47b0a4ab127900c3a075764f01d655f" STYLE="fork"/>
              </node>
            </node>
          </node>
          <node TEXT="标签数据管理" ID="f9611e2f2843c7670e1cb524b87ddb6a" STYLE="fork">
            <node TEXT="企业标签管理" ID="8f7b1b30ab108add8cae3a2086a49ffd" STYLE="fork">
              <node TEXT="优化：企业标签列表字段调整，包含" ID="f70c15f3750ecf808e9ae42addef1354" STYLE="fork">
                <node TEXT="企业名称 &amp; 统一信用代码" ID="60e06be03e5830e9092b22d204679b89" STYLE="fork"/>
                <node TEXT="基本信息维度" ID="257479af51abf1e49c1a503682178375" STYLE="fork"/>
                <node TEXT="经营业务维度" ID="0b4c7785d6045e92c0200358ec668554" STYLE="fork"/>
                <node TEXT="科技属性维度" ID="5b2eedf9bfeab926f56fc4a5801e39fd" STYLE="fork"/>
                <node TEXT="风险管控维度" ID="ed930a30c9c6f4b454a0ed3c4003ed6b" STYLE="fork"/>
                <node TEXT="市场表现维度" ID="563e37caf9b67e9398acbe9aa1971523" STYLE="fork"/>
                <node TEXT="操作" ID="9b0412737f0a4b5d025ef1a522b73420" STYLE="fork">
                  <node TEXT="保留“详情”" ID="77ec9e92dc3d9a58da774f6f2e73f803" STYLE="fork"/>
                  <node TEXT="取消显式的“打标”操作，将“打标”“放到明面上来”" ID="5338c66f3ed597a2b4bacf6840cbd121" STYLE="fork"/>
                </node>
              </node>
              <node TEXT="优化：基本信息维度、经营业务维度、科技属性维度、风险管控维度、市场表现维度字段的值是对应的标签" ID="19e934f40b6d4e7a3841cba1200fb598" STYLE="fork">
                <node TEXT="在各字段已有标签的末尾设置一个“+”，点击实现打标" ID="75640a7e15a0ca26f3445328e92d4bab" STYLE="fork">
                  <node TEXT="可打标签使用下拉滚动列表和内置小搜索框的形式呈现" ID="6f392359bf29aecfabc625eff41f5a3f" STYLE="fork"/>
                  <node TEXT="下拉滚动列表可实现复选，即点击一次“+”可打多个该维度下的标签" ID="4a7b40c6b4088de4a5889c0891c1714b" STYLE="fork"/>
                </node>
              </node>
            </node>
            <node TEXT="标签体系库" ID="cd2fa9342d3dd88486034205f10faefc" STYLE="fork"/>
            <node TEXT="自动打标签" ID="a06ae780149c4bf8520bb732e120c143" STYLE="fork"/>
          </node>
          <node TEXT="评分权重管理" ID="7f583f5bed761b11ae13cf87934d22ba" STYLE="fork">
            <node TEXT="优化：只保留企业评分模型，删去行业评分模型" ID="e8cddc6d1c5d3e29b117af290de28455" STYLE="fork">
              <node TEXT="行业评分使用行业内所有企业评分的平均值" ID="c1554ac13b93e8b39a50a4f14d35d878" STYLE="fork">
                <node TEXT="总评分使用使用行业内所有企业总评分的平均值" ID="56ae195002953d7bc6ba629fc5144aef" STYLE="fork"/>
                <node TEXT="各个评分模型的评分使用行业内所有企业在相应评分模型下的评分的平均值" ID="e0f62acfb3c6e51d6cd3a3eaa6407ca8" STYLE="fork"/>
              </node>
              <node TEXT="{产业画像}模块的{行业画像}页面需要做对应优化" ID="ac9756d66cb5eca7e12a948f169372c4" STYLE="fork"/>
            </node>
          </node>
        </node>
        <node TEXT="用户管理" ID="d7b35810653495cc444ebeb42ae27f5d" STYLE="fork">
          <node TEXT="平台设计目前设计有三类用户" ID="3f8c9ddd9f71bc942302f3a04a764a67" STYLE="fork">
            <node TEXT="普通用户" ID="022cbe03669f7b5cb57694526ac52b7c" STYLE="fork"/>
            <node TEXT="高级用户" ID="5d8758a01e60df388079b98bd4d8b07c" STYLE="fork"/>
            <node TEXT="管理员" ID="771bfd41938181ce8945a0d3e157536c" STYLE="fork"/>
          </node>
        </node>
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