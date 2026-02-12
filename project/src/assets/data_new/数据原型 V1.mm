
<map>
  <node ID="root" TEXT="数据原型 V1">
    <node TEXT="使用须知 README" ID="69add1cac14fda6bc5f187e113323887" STYLE="bubble" POSITION="right">
      <node TEXT="构建时的一些灵感（暂存）" ID="a9c3bc9f33242256e7cdfbb3630f87de" STYLE="fork">
        <node TEXT="评分模型可以参考这个数据原型来构建规则、权重、分值" ID="0e7946eb42ac16f878a1026238d1cf51" STYLE="fork"/>
      </node>
      <node TEXT="成立年限、注册、实缴资本等涉及实际数值的字段，用实际的数值填值，下有示例" ID="b7a5869b42de00c915a3246ead765231" STYLE="fork"/>
      <node TEXT="行业分类为四级标签分类" ID="3bf59d0be17698334278bbe2b4d523f5" STYLE="fork">
        <node TEXT="0 级" ID="7f2f4fb30c0a6634727a9769188d86e4" STYLE="fork">
          <node TEXT="数字医疗、前沿技术等并列的标签" ID="fc13826964ea165c93361c7394e38ed4" STYLE="fork"/>
        </node>
        <node TEXT="1 级" ID="d0b08adfa36189b71ba6f786239a7c60" STYLE="fork">
          <node TEXT="所有 0 级标签的下一级节点" ID="e1065c559df2fcf7c13121ff83315eb5" STYLE="fork"/>
        </node>
        <node TEXT="2 级" ID="018cb38696114214cfe87552addb6ee1" STYLE="fork">
          <node TEXT="所有 1 级标签的下一级节点" ID="2e653bf844dd14b6904535ed51a3bcf1" STYLE="fork"/>
        </node>
        <node TEXT="3 级" ID="32e40c439a34b4f71af36864bb613ab1" STYLE="fork">
          <node TEXT="所有 2 级标签的下一级节点" ID="1daa39e40b18c045bf241c952bb9327c" STYLE="fork"/>
        </node>
      </node>
    </node>
    <node TEXT="企业数据原型" ID="1806be24cfb9582642f76b51412220ea" STYLE="bubble" POSITION="right">
      <node TEXT="基本信息" ID="3f4b4ff56dd9a65761791fe3603b6162" STYLE="fork">
        <node TEXT="名称" ID="03333a2554ee0994535c97eaeb51f915" STYLE="fork"/>
        <node TEXT="统一社会信用代码" ID="0bb9ffd259a4ed47432bd21a760751d1" STYLE="fork"/>
        <node TEXT="成立年限——构建数据集时用实际的“成立时间”（如：2026）填值，下类同" ID="78b895ea52a39a9edbaecf335de381bd" STYLE="fork">
          <node TEXT="1 年内" ID="16976ec7153e2efa6e6f39c3f6bbcd41" STYLE="fork"/>
          <node TEXT="1-5 年" ID="195f55d7aaf3610806a1642f729add26" STYLE="fork"/>
          <node TEXT="5-10 年" ID="53c8a5fe20e8e6bf9873e13d166a52e2" STYLE="fork"/>
          <node TEXT="10-15 年" ID="bcebd516ad72700bd7a0e65e13045554" STYLE="fork"/>
          <node TEXT="15 年以上" ID="7b29f7130d67399a2798a01c32865775" STYLE="fork"/>
        </node>
        <node TEXT="注册——构建数据集时用实际的“注册资本”（如：50000000）等填值，下类同" ID="86f088cc7e619c0615117f52c762ccc5" STYLE="fork">
          <node TEXT="0 万-100 万" ID="7fbac80fc4bd985457f5f14bd9ca4286" STYLE="fork"/>
          <node TEXT="100 万-200 万" ID="899181ea16a0876630df5c9390d2f811" STYLE="fork"/>
          <node TEXT="200 万- 500 万" ID="43f4ce305cc8015b20dd0341f6f69582" STYLE="fork"/>
          <node TEXT="500 万- 1000 万" ID="fc1cefbe7849f15bd538052b157269b9" STYLE="fork"/>
          <node TEXT="1000 万以上" ID="25bee72efa04c8401493dc7ce7c9d64f" STYLE="fork"/>
        </node>
        <node TEXT="实缴资本" ID="c2820e24a6b02282039cc63692470a50" STYLE="fork">
          <node TEXT="有实缴资本" ID="c688b699b4d0a8f2daee00e8e3eb1f47" STYLE="fork"/>
          <node TEXT="无实缴资本" ID="1451a5bc857da70dd98997022965dc18" STYLE="fork"/>
          <node TEXT="0 万-100 万" ID="02fcadd18815fcd88e4100dbd93c15a1" STYLE="fork"/>
          <node TEXT="100 万-200 万" ID="2e7930d065b7815ced869e8232ae15d1" STYLE="fork"/>
          <node TEXT="200 万-500 万" ID="03ca90bb534602fdd1ee715fcfe0c412" STYLE="fork"/>
          <node TEXT="500 万-1000 万" ID="05204c1fedb1c3e2d37131bbeff36639" STYLE="fork"/>
          <node TEXT="1000 万-5000 万" ID="eba56f86a5361a19af186035486db4b6" STYLE="fork"/>
          <node TEXT="5000 万以上" ID="41a9a331c54b3240711955409594bf08" STYLE="fork"/>
          <node TEXT="自定义" ID="c541196f1cc788bbde91b9858a5772aa" STYLE="fork"/>
        </node>
        <node TEXT="经营状态" ID="c2820eebccf7051c2f9a011c8d2f25c8" STYLE="fork">
          <node TEXT="都是存续" ID="871404b6c77cefc557184ddecaa0959d" STYLE="fork"/>
        </node>
        <node TEXT="企业类型" ID="c6cac785066608fa6ad3d9b01ddc0ddb" STYLE="fork">
          <node TEXT="国有企业" ID="9c4f26d0cbf07bd591ea4d25a5de7e30" STYLE="fork"/>
          <node TEXT="集体所有制企业" ID="c57f89c60ce6815afd3e1c8808f6090f" STYLE="fork"/>
          <node TEXT="股份合作企业" ID="b5efe9d68bbc9baca93fa78f74f1842a" STYLE="fork"/>
          <node TEXT="联营企业" ID="6f0f65ed6975ab3f1772c0de18c2b825" STYLE="fork"/>
          <node TEXT="有限责任公司" ID="4e9cc2e98bf457340267550acbf50307" STYLE="fork"/>
          <node TEXT="普通合伙" ID="72afed2e16e23c8c6d4a37eac24d0e9b" STYLE="fork"/>
          <node TEXT="有限合伙" ID="5732d3133adb348760b4e7b870991864" STYLE="fork"/>
          <node TEXT="股份有限公司" ID="6cdab8152f430e772e247f9fe7d597b5" STYLE="fork"/>
          <node TEXT="私营企业" ID="39847177c7c5ad0f644227360054aef8" STYLE="fork"/>
          <node TEXT="民营企业" ID="b88e8c2ca61888c348e9e9e2b11d5437" STYLE="fork"/>
          <node TEXT="个体工商户" ID="c231fe0fa4e3eed7999c0ba19bd7c1e7" STYLE="fork"/>
          <node TEXT="港澳台投资" ID="6b015baa1a892ef9086022a83d7ab97e" STYLE="fork"/>
          <node TEXT="外商投资" ID="ea55156759c35d6acd90ea1eca9bfec4" STYLE="fork"/>
          <node TEXT="全民所有制" ID="025749e14eab2df841d4be15ab8a0db8" STYLE="fork"/>
          <node TEXT="个人独资企业" ID="34f4e4d7c51c4ce8f679f1baec9b63b1" STYLE="fork"/>
          <node TEXT="农民专业合作社（联合社）" ID="3e4901cfbf69d8301f53da1c06a3e3e7" STYLE="fork"/>
          <node TEXT="其他" ID="532ce8b37ee819547796f571b2488907" STYLE="fork"/>
        </node>
        <node TEXT="组织类型（爬）" ID="e61ab2e4120f624d0d5b781601c723ea" STYLE="fork">
          <node TEXT="新三板" ID="a67f7d9ae6f7807d8d60464f7f754eaf" STYLE="fork"/>
          <node TEXT="上市公司" ID="a6355207afd9fb0545020402debeebb3" STYLE="fork"/>
          <node TEXT="社会组织" ID="5aa22d3f22e52c34dcad85e395098b1c" STYLE="fork"/>
          <node TEXT="律师事务所" ID="6a1897d438b4d68b8deff3eb908302c9" STYLE="fork"/>
          <node TEXT="香港企业" ID="74e4170a72834c5bf24d868acd2b9cbf" STYLE="fork"/>
          <node TEXT="台湾企业" ID="6d30efadf5b99df28fc4be6df523106c" STYLE="fork"/>
          <node TEXT="机关单位" ID="711ac21e60dca5b7d8a24328e4ec4422" STYLE="fork"/>
          <node TEXT="事业单位" ID="ffa87a90d18c5e669023836c18c3a339" STYLE="fork"/>
          <node TEXT="学校" ID="77673ea750e01f922574834b2645ab03" STYLE="fork"/>
        </node>
        <node TEXT="企业规模（爬）" ID="83a9c637f12200706fa4ba0bad462f29" STYLE="fork">
          <node TEXT="不限" ID="b7d1fa732bd080ed616fbc5e28255081" STYLE="fork"/>
          <node TEXT="大型" ID="bd48a2bb309c2be29e1476df1aedd805" STYLE="fork"/>
          <node TEXT="中型" ID="beb579711466b759fc7d5c4466a7a635" STYLE="fork"/>
          <node TEXT="小型" ID="6dffed76933d389ceb08935151ae7efd" STYLE="fork"/>
          <node TEXT="微型" ID="dbe400877ea5fe9edfe1fc8f8eec5259" STYLE="fork"/>
        </node>
        <node TEXT="分支机构（爬）" ID="4ceb5a781018d5fafe946d969a7656dc" STYLE="fork">
          <node TEXT="不限" ID="2308b266c56b7d45ddb0572289df4045" STYLE="fork"/>
          <node TEXT="是分支机构" ID="c7a292a43a05278515fc6adbb6865be0" STYLE="fork"/>
          <node TEXT="非分支机构" ID="c468c4d92011e6add8d279b2f421c01b" STYLE="fork"/>
        </node>
        <node TEXT="地址信息" ID="5fd939a500b0309e992ba55bd8fcbd1f" STYLE="fork">
          <node TEXT="不限" ID="5c55d8d444daaf7066587f7c9dfa6945" STYLE="fork"/>
          <node TEXT="有企业地址" ID="5387611de9f7108b9eaf0ce1d11673df" STYLE="fork"/>
          <node TEXT="无企业地址" ID="6b8c836e3095f9f164c069bb67504605" STYLE="fork"/>
        </node>
        <node TEXT="投融资轮次" ID="d726270ab81b27d3da83721bff5b5642" STYLE="fork"/>
      </node>
      <node TEXT="经营状况" ID="fdf7377b2e700c3e4681cd9ef3784d2e" STYLE="fork">
        <node TEXT="员工人数（爬）" ID="198271800a157dc6a5274ff4411900c6" STYLE="fork">
          <node TEXT="小于 50 人" ID="31aba051bf8ee642feea3e6051fd8e97" STYLE="fork"/>
          <node TEXT="50-99 人" ID="e31a8ef7c754c43614e9c2cced798ab6" STYLE="fork"/>
          <node TEXT="100-499 人" ID="561cae578a2b4df6c94b39fc3bea6c07" STYLE="fork"/>
          <node TEXT="500 人以上" ID="0bff88ba24feed9e3a9593f7dc7e9326" STYLE="fork"/>
          <node TEXT="未披露" ID="843e848ae29fd3e82ac472c42d8d2a63" STYLE="fork"/>
          <node TEXT="自定义" ID="db290ca44979f3cc4b0fd9e7fe3778e9" STYLE="fork"/>
        </node>
        <node TEXT="参保人数" ID="627d83079b2a66e07752192c54e8bed1" STYLE="fork">
          <node TEXT="小于 50 人" ID="f2133fdfc7c8759eec8f5b4a476f66e5" STYLE="fork"/>
          <node TEXT="50-99 人" ID="846d92b21e88342caa01183c80c86cfc" STYLE="fork"/>
          <node TEXT="100-499 人" ID="a2b0fa0eda6649be5f11304411a29238" STYLE="fork"/>
          <node TEXT="500 人以上" ID="7047a63ad214f22e7eb6e78af9e49c1c" STYLE="fork"/>
          <node TEXT="自定义" ID="f974745b741256bda4b4c4a09e8e1f83" STYLE="fork"/>
        </node>
        <node TEXT="上市状态（爬）" ID="9ea3ae037cf5a7f5963a323acc2ddeca" STYLE="fork">
          <node TEXT="A 股" ID="bef3051329db6460c9a8c6fa13fa9af0" STYLE="fork"/>
          <node TEXT="中概股" ID="558b033dcdf4a985be65864af634d4d3" STYLE="fork"/>
          <node TEXT="港股" ID="eecab2e1daf7b51687d72e347208d045" STYLE="fork"/>
          <node TEXT="科创板" ID="8b44054e3f0d3f2cf614399d805f972f" STYLE="fork"/>
          <node TEXT="新三板" ID="0e0ba116281dba72e14379974ee35434" STYLE="fork"/>
        </node>
        <node TEXT="规上企业（替换为了可爬取的国标行业）" ID="01f510879eb2ab7438abea76b47c98cc" STYLE="fork">
          <node TEXT="有资质的建筑业" ID="a947f5cba153c9550904e7283e7bbead" STYLE="fork"/>
          <node TEXT="规模以上服务业" ID="06599d53cf41ae7d6234ed1497ccbfa8" STYLE="fork"/>
          <node TEXT="规模以上工业" ID="da1d7ea1bb531325de36da00266628bf" STYLE="fork"/>
          <node TEXT="限额以上批发和零售业" ID="daf030fde080ecae85e3f1c4daf46797" STYLE="fork"/>
          <node TEXT="房地产开发经营业" ID="413ccbc24606b9f50595ae12642a55ea" STYLE="fork"/>
          <node TEXT="限额以上住宿和餐饮业" ID="094a7ef18c772306498d4f216a3a4d59" STYLE="fork"/>
        </node>
        <node TEXT="联系方式" ID="20c7aff07382e66f56ee87fc94c57fa1" STYLE="fork">
          <node TEXT="不限" ID="f1c7c2c20f47195f5ee0e7f76fb39feb" STYLE="fork"/>
          <node TEXT="有联系电话" ID="815c91b09affdfa4955b7bcd82b162e4" STYLE="fork"/>
          <node TEXT="有固定电话" ID="1ccaeed2efca5c422bc8485ca2e3537c" STYLE="fork"/>
          <node TEXT="有手机号" ID="2526cc9e1cfd812db3cccdd7e08ae225" STYLE="fork"/>
        </node>
        <node TEXT="空号过滤（无信息）替换为了同电话企业" ID="9aa12d8ffb848879281f0df1214aee10" STYLE="fork">
          <node TEXT="不限" ID="7206c67c35449b0ceeacd567f0a7ba9a" STYLE="fork"/>
          <node TEXT="正常号码" ID="3ba0e68f9b19e64d55dff6cbd6dc1d60" STYLE="fork"/>
          <node TEXT="不可用或无号码" ID="663e57734f19a2008878a35fc4816c41" STYLE="fork"/>
          <node TEXT="同电话" ID="9e312f58ee155b2086ff8646d4256b0f" STYLE="fork"/>
        </node>
        <node TEXT="联系邮箱" ID="e7140c93813c59114b2ea3828c34bdab" STYLE="fork">
          <node TEXT="不限" ID="b321fee0e78e25caedef6f1397eba897" STYLE="fork"/>
          <node TEXT="有联系邮箱" ID="85149993db1c1c9ce80a3c3da899eb59" STYLE="fork"/>
          <node TEXT="无联系邮箱" ID="07df37007b7d41efbc6350f796ee857a" STYLE="fork"/>
        </node>
        <node TEXT="小微企业（爬）" ID="99a68f6911666c4b5dd03babb1f85144" STYLE="fork">
          <node TEXT="不限" ID="568b1169dd52cde14e5ce773ebbe0b11" STYLE="fork"/>
          <node TEXT="是小微企业" ID="9e6fbaa374dee42d1e871af4f3ee7e84" STYLE="fork"/>
          <node TEXT="非小微企业" ID="bd423400649c7f07d32eb54d2bffe0b0" STYLE="fork"/>
        </node>
        <node TEXT="变更信息" ID="f1756045d272169bd0d6479981b6732c" STYLE="fork">
          <node TEXT="不限" ID="6863842e304a7a321cc0ff5dfe984288" STYLE="fork"/>
          <node TEXT="有变更信息" ID="333730809f74b1f55a909da95ef5cb32" STYLE="fork"/>
          <node TEXT="无变更信息" ID="11c613a7815b304def0b5d2ea85a330e" STYLE="fork"/>
        </node>
        <node TEXT="一般纳税人（爬）" ID="3caaa7cc6b830b24cac6f9fced478f7d" STYLE="fork">
          <node TEXT="不限" ID="7b5dc846b3ce24a63677aa6092f30fdd" STYLE="fork"/>
          <node TEXT="一般纳税人" ID="91f7486981df5d187463b32d01c24c08" STYLE="fork"/>
          <node TEXT="非一般纳税人" ID="d1900b9072ec30b8cb65af034058f1da" STYLE="fork"/>
        </node>
        <node TEXT="融资信息（爬）" ID="11af823f8e4977600ce4ea73fdc3dd75" STYLE="fork">
          <node TEXT="不限" ID="9b1d1ea098467fc1ce58c0701fa520c5" STYLE="fork"/>
          <node TEXT="有融资" ID="3302d5b61b3059b0cb0fb9179583538e" STYLE="fork"/>
          <node TEXT="无融资" ID="b61c99429b6f43fecc02edb36d89d102" STYLE="fork"/>
        </node>
        <node TEXT="招投标" ID="842508a302ab9ac402836e10528606a4" STYLE="fork">
          <node TEXT="不限" ID="632afa5bcffbf69fa8e3bb03e886a669" STYLE="fork"/>
          <node TEXT="有招投标" ID="07c69320a80c8dfa8b131b9ec48e567e" STYLE="fork"/>
          <node TEXT="无招投标" ID="4341709db99bcbcc0eba6c6d0b2be3f6" STYLE="fork"/>
        </node>
        <node TEXT="招聘" ID="550282c1b025094a245c15197a00bffc" STYLE="fork">
          <node TEXT="不限" ID="efaa3259842fcafed7d24ed3887288ac" STYLE="fork"/>
          <node TEXT="有招聘" ID="9762631039b52e754794ddffe88df0b3" STYLE="fork"/>
          <node TEXT="无招聘" ID="ed522c31ce93aa6817cdd7996090044c" STYLE="fork"/>
        </node>
        <node TEXT="税务评级" ID="08dfe6a3e835bc9aa89a0e4ab8c14073" STYLE="fork">
          <node TEXT="不限" ID="f81a7df62486d1f2b4ee24f40acaef3f" STYLE="fork"/>
          <node TEXT="A 级" ID="3c952b3e5e63e212446f97e9efbfa2cf" STYLE="fork"/>
        </node>
        <node TEXT="进出口信息" ID="2d60180009b58db31ec67e7dd98583d4" STYLE="fork">
          <node TEXT="不限" ID="96ae4d58e077c0b1a8a06d9b97e01af3" STYLE="fork"/>
          <node TEXT="有进出口信息" ID="f2451319c507a6ed7671157b228ffac4" STYLE="fork"/>
          <node TEXT="无进出口信息" ID="919b718ad3ed0653e31f7db07b01b876" STYLE="fork"/>
        </node>
        <node TEXT="开户行" ID="c692f4d85ba9394fa9a06a535d2d24e3" STYLE="fork">
          <node TEXT="国有大型企业" ID="407698ff9e1e25c1d0730c9586522624" STYLE="fork"/>
          <node TEXT="股份制商业银行" ID="b95f1887fb2b62bba771e1102056da89" STYLE="fork"/>
          <node TEXT="城市商业银行" ID="88a364d79b3045201d0361d570a9831f" STYLE="fork"/>
          <node TEXT="农业商业银行" ID="53431d05146d0ad7b880a11fd67a6f64" STYLE="fork"/>
        </node>
      </node>
      <node TEXT="知识产权" ID="a1f0961142483890df973f5f8d23c425" STYLE="fork">
        <node TEXT="专利类型" ID="f0be88925b3b2c1987396dbc1c24e2be" STYLE="fork">
          <node TEXT="发明公布" ID="20c732a16fb58135ce27912e3e6ff083" STYLE="fork"/>
          <node TEXT="发明授权" ID="4a3bd289184450b063dbf67bcda06d4c" STYLE="fork"/>
          <node TEXT="实用新型" ID="8584a628de09a8389688005fc064a58d" STYLE="fork"/>
          <node TEXT="外观设计" ID="267294f8f1f965e4b9b5675834be2144" STYLE="fork"/>
        </node>
        <node TEXT="企业科技属性" ID="7cf4c3bbac21a148d26ffe4fea21befd" STYLE="fork">
          <node TEXT="高新企业" ID="97b3cef99a52e9a1a4b70b3157763c8c" STYLE="fork"/>
          <node TEXT="科技型中小企业" ID="35a79f940c8359fe334c8233dc081b98" STYLE="fork"/>
          <node TEXT="瞪羚企业" ID="54d99ba791faa84c2bae041a96c7814a" STYLE="fork"/>
          <node TEXT="国家级技术创新示范企业" ID="0cdcdbdc32bb7753b71ddf8d76e71903" STYLE="fork"/>
          <node TEXT="省级技术创新示范企业" ID="cf6b458116890af0e7090f5b7fe61ab0" STYLE="fork"/>
          <node TEXT="国家级企业技术中心" ID="52d42867808996243d84f9092f8001f2" STYLE="fork"/>
          <node TEXT="省级企业技术中心" ID="e410b1aa9aba775a18cd6111634b368b" STYLE="fork"/>
          <node TEXT="国家备案众创空间" ID="00542575e5680952c6f0d9202a052af2" STYLE="fork"/>
          <node TEXT="国家级科技企业孵化器" ID="f1c470c70b9725adaf64425db15d2e23" STYLE="fork"/>
          <node TEXT="省级科技企业孵化器" ID="eead9b2271aeddf2b3705e3911c65444" STYLE="fork"/>
          <node TEXT="国家火炬计划项目" ID="56fb65480ab8d8b96c6a9753149b5b53" STYLE="fork"/>
          <node TEXT="技术先进型服务企业" ID="2a8c871a2bfe5397bc1d2b5ff8b2cd63" STYLE="fork"/>
          <node TEXT="民营科技企业" ID="e7b821899c28586afbcf4b91dc389e03" STYLE="fork"/>
          <node TEXT="专精特新企业" ID="f484d03ce104e1db55b820e9f9c12f17" STYLE="fork"/>
          <node TEXT="科技小巨人企业" ID="d543f7a084199c18eefacef8494f9724" STYLE="fork"/>
          <node TEXT="专精特新小巨人" ID="8c54cc25f10e18d9b5c3889930a1c84e" STYLE="fork"/>
          <node TEXT="创新型企业" ID="1eb6885e99f2d668a6930fc6a1ee1619" STYLE="fork"/>
          <node TEXT="创新型试点企业" ID="f90bfbce8d6d92cf22dcbed3193c5bbe" STYLE="fork"/>
          <node TEXT="创新型领军企业" ID="55b00195ee7ca60133db012eb4e13e06" STYLE="fork"/>
          <node TEXT="雏鹰企业" ID="ce75889afaeb1d666593ea56a83c3a71" STYLE="fork"/>
          <node TEXT="隐形冠军" ID="c762c791d2f4b293c8ba0def6f89eb1f" STYLE="fork"/>
          <node TEXT="牛羚企业" ID="8ef3fe65bad8272091023326af32c0ee" STYLE="fork"/>
          <node TEXT="独角兽企业" ID="704d56cdd60224b5dfdc0db4e53ec523" STYLE="fork"/>
          <node TEXT="未来独角兽企业" ID="4900ab20c74d6aa0a044cb5c6bfe0c66" STYLE="fork"/>
          <node TEXT="潜在独角兽企业" ID="8925474940a9a230e4035e4bb9b05752" STYLE="fork"/>
          <node TEXT="种子独角兽企业" ID="0f25b94cbda5d899834588b88f2312ae" STYLE="fork"/>
        </node>
        <node TEXT="资质证书" ID="8d6d96be43c56f5feaf96f64dfddb72a" STYLE="fork">
          <node TEXT="进网许可证" ID="f521b73d9abe0b5598fb9bda9b35dd62" STYLE="fork"/>
          <node TEXT="排污许可证" ID="5b9d2f87309b9b175efda5c4193edc7e" STYLE="fork"/>
          <node TEXT="采矿权许可证" ID="464796d067cdf82ab3bbf8d22a66e03e" STYLE="fork"/>
          <node TEXT="金融许可证" ID="13f8ff1dbc403c51c171b0e05a563c6f" STYLE="fork"/>
          <node TEXT="食品生产许可证" ID="c5f100bfa8044bab6c377b8498083768" STYLE="fork"/>
          <node TEXT="食品经营许可证" ID="9a0f6fbc7eb30c2f6426cb25f73b60fc" STYLE="fork"/>
        </node>
        <node TEXT="商标信息" ID="d9d385028afad103816052f1b16b1552" STYLE="fork">
          <node TEXT="不限" ID="7db1b487dcc3053aec40acef25deef61" STYLE="fork"/>
          <node TEXT="有商标" ID="a81e43111ca11b3414a11d37d94a5f04" STYLE="fork"/>
          <node TEXT="无商标" ID="a0f1795c9083abf1fac9fb9d275c93f3" STYLE="fork"/>
        </node>
        <node TEXT="专利信息" ID="6e38d77516d70f1efaa3762e51cb3a29" STYLE="fork">
          <node TEXT="不限" ID="f416c5640e5f4f6d778e68005b9c32e6" STYLE="fork"/>
          <node TEXT="有专利" ID="f07315a098c572d80ac4eeadd9128fea" STYLE="fork"/>
          <node TEXT="无专利" ID="4f99c55b83b2bc89796c5de3d1e14ce4" STYLE="fork"/>
        </node>
        <node TEXT="作品著作权" ID="8bcfedc9b762c135554b963cb555cd5d" STYLE="fork">
          <node TEXT="不限" ID="7707245dfc08e42e3f5a60333a4ad147" STYLE="fork"/>
          <node TEXT="有作品著作权" ID="40a417f66e1f2d9447539f3b35428304" STYLE="fork"/>
          <node TEXT="无作品著作权" ID="3c528f55e12796da0bddf3c51f2d4e58" STYLE="fork"/>
        </node>
        <node TEXT="软件著作权" ID="50b1f81e32e4a80c4237b5ba6d3f34ed" STYLE="fork">
          <node TEXT="不限" ID="36e081288ca0cf735f647c7022dfad2a" STYLE="fork"/>
          <node TEXT="有软件著作权" ID="097606fdca078c83b615e27eabecab6d" STYLE="fork"/>
          <node TEXT="无软件著作权" ID="11ae7c771aad1f918c0ecb0abd263174" STYLE="fork"/>
        </node>
        <node TEXT="高新技术企业" ID="6a39b46af97224636c48a8bf197a175c" STYLE="fork">
          <node TEXT="不限" ID="78e4fa0a67534dc28d90b2cf1452e207" STYLE="fork"/>
          <node TEXT="是高新技术企业" ID="d11e4836b8172c47a0ef01c32213c3dc" STYLE="fork"/>
          <node TEXT="不是高新技术企业" ID="57464216b7cef30e68895fd59ad8b2b0" STYLE="fork"/>
        </node>
        <node TEXT="微信公众号" ID="736dc0c1c7f8242f1a9375cb48f67192" STYLE="fork">
          <node TEXT="不限" ID="7b4826ded28593f8502915bf5775e4ed" STYLE="fork"/>
          <node TEXT="有微信公众号" ID="4f7db9070b164c278c4a57794ee78a85" STYLE="fork"/>
          <node TEXT="无微信公众号" ID="c3e3eb594a690f4ab7b6da70b872dd79" STYLE="fork"/>
        </node>
        <node TEXT="标准制定" ID="19df192097ae8f78b62b8843cac17b59" STYLE="fork">
          <node TEXT="不限" ID="ec4edf3e8ffb35da29d7c3d3c70f274c" STYLE="fork"/>
          <node TEXT="有制定标准" ID="4d3665896a859c16ddf783bc25d07272" STYLE="fork"/>
          <node TEXT="无制定标准" ID="1b1f311120e23499a419deaddf190713" STYLE="fork"/>
        </node>
        <node TEXT="集成电路布图" ID="6a50208234bfeb9daa7d2bda6afd2929" STYLE="fork">
          <node TEXT="有集成电路布图" ID="09f0ad82d7739576ae452dbad68d9606" STYLE="fork"/>
          <node TEXT="无集成电路布图" ID="821f08783724ad6336d1b2e1f54586f5" STYLE="fork"/>
        </node>
        <node TEXT="建筑资质" ID="ed11027afe3e39b1be3a3bab541ef074" STYLE="fork">
          <node TEXT="不限" ID="d97c8f2c96e9832892c397d077414579" STYLE="fork"/>
          <node TEXT="有建筑资质" ID="e04aaeace1b192bdb1fe3339069a9033" STYLE="fork"/>
          <node TEXT="无建筑资质" ID="43fddc13ebb8d75a1bb252c0f1c4455e" STYLE="fork"/>
        </node>
        <node TEXT="网址信息 " ID="449bffb531c231b46b324b67795919c7" STYLE="fork">
          <node TEXT="不限" ID="38d05a1144560d9d937ad2432ade3289" STYLE="fork"/>
          <node TEXT="有网址信息" ID="0ea6f4f7933e99d0239f8df71e657c8f" STYLE="fork"/>
          <node TEXT="无网址信息" ID="13ec2820d831e96fac6d5e01652e9a66" STYLE="fork"/>
        </node>
        <node TEXT="备案网站检测" ID="37ce6a384be77188b3d06140f02802ff" STYLE="fork">
          <node TEXT="不限" ID="2494ca30b4050581738f66b96ab179f4" STYLE="fork"/>
          <node TEXT="有 ICP 备案" ID="345325c0bf4bb93059fdcfbf16a23187" STYLE="fork"/>
          <node TEXT="无 ICP 备案" ID="caaf5578c3f18e396ccc596a0f04e763" STYLE="fork"/>
        </node>
        <node TEXT="商业特许经营" ID="9002aeb2aa7e47913c12cfaae284f008" STYLE="fork">
          <node TEXT="不限" ID="58edbf526bec7c66001f81fe7b661775" STYLE="fork"/>
          <node TEXT="有商业特许经营" ID="fa8bdf820dbe22ea46e2c4211ad62545" STYLE="fork"/>
          <node TEXT="无商业特许经营" ID="7da6f73e81a318e2773bc56e33acef6e" STYLE="fork"/>
        </node>
      </node>
      <node TEXT="风险信息" ID="09820c7fbdeed2ab55307d4fa72faeab" STYLE="fork">
        <node TEXT="失信被执行" ID="4d35e04c740f9e7a7eb3aa72fc8aed03" STYLE="fork">
          <node TEXT="不限" ID="e7bc37ead6eeec0549e778167583413b" STYLE="fork"/>
          <node TEXT="有失信被执行" ID="acb154ef6adbead4e59544e04e6bbded" STYLE="fork"/>
          <node TEXT="无失信被执行" ID="dff7600fc3438fdfe0e7cb64a5fd4ac5" STYLE="fork"/>
        </node>
        <node TEXT="动产抵押" ID="3dd3f57dc849ee535295370ae3f52aba" STYLE="fork">
          <node TEXT="不限" ID="098664997c40924e155e04b94730c3c5" STYLE="fork"/>
          <node TEXT="有动产抵押" ID="a9b572fb9f9b0e0966ce09b2153ae64b" STYLE="fork"/>
          <node TEXT="无动产抵押" ID="941ea09a67332580efdee6c2dd922307" STYLE="fork"/>
        </node>
        <node TEXT="经营异常" ID="6e74326e8bda130d7c8adc8fe72e2277" STYLE="fork">
          <node TEXT="不限" ID="476a6a9e71dc3c64d28fa44698f4da38" STYLE="fork"/>
          <node TEXT="有经营异常" ID="611438efc9080f3ee47fb9ca10e8d047" STYLE="fork"/>
          <node TEXT="无经营异常" ID="df6fd0c18973fbacde5870c3f1247473" STYLE="fork"/>
        </node>
        <node TEXT="法律文书" ID="dc99b18bbf78c0a40593b1876289066e" STYLE="fork">
          <node TEXT="不限" ID="d4202a83ccb784a35a5d4a3902a565c0" STYLE="fork"/>
          <node TEXT="有法律文书" ID="3b12b96f9ac9e8a134775a92dcac2c42" STYLE="fork"/>
          <node TEXT="无法律文书" ID="3b0a530f58fe93003efab47dba1438a8" STYLE="fork"/>
        </node>
        <node TEXT="行政处罚" ID="b561832c11a82df983bd16c3938550ac" STYLE="fork">
          <node TEXT="不限" ID="24852ca6d30e29d0e99824564d68f6b2" STYLE="fork"/>
          <node TEXT="有行政处罚" ID="131215b39171d215383228a6d6a1fd4a" STYLE="fork"/>
          <node TEXT="无行政处罚" ID="c1a59e0335b0d99c5aa2b7c21a531992" STYLE="fork"/>
        </node>
        <node TEXT="破产重叠" ID="def42fab310c4abe62a6c24d4eb98335" STYLE="fork">
          <node TEXT="不限" ID="209490c7ca0590b9288a77595edec2ab" STYLE="fork"/>
          <node TEXT="有破产重叠" ID="1934745c457b124559a3829156735e4b" STYLE="fork"/>
          <node TEXT="无破产重叠" ID="e13b105db363d1e1b2ccf1380f7dab32" STYLE="fork"/>
        </node>
        <node TEXT="清算信息" ID="bd57b468e769584f7f2c9186275eb626" STYLE="fork">
          <node TEXT="不限" ID="e496976799921e93fe2f46fa81404494" STYLE="fork"/>
          <node TEXT="有清算信息" ID="0ccdecd64237f8d31a26ea0742a710ff" STYLE="fork"/>
          <node TEXT="无清算信息" ID="805339bc3754a3a68d9cf4d9ba9fd08c" STYLE="fork"/>
        </node>
        <node TEXT="环保处罚" ID="688c6ab467011e7feb418cae3acba5f4" STYLE="fork">
          <node TEXT="不限" ID="dccd1dd1e205a883c21ce34d3a149753" STYLE="fork"/>
          <node TEXT="有环保处罚" ID="dcb02e94647b5ba3c0fc5085ea13c22c" STYLE="fork"/>
          <node TEXT="无环保处罚" ID="2990197c0fe47dce3615beb6cc81032e" STYLE="fork"/>
        </node>
        <node TEXT="股权冻结" ID="0359df9776489c268e4e23c74a5b5772" STYLE="fork">
          <node TEXT="不限" ID="dfcc974b4e8ce9e0f855db230c7ec1b6" STYLE="fork"/>
          <node TEXT="有股权冻结" ID="fd17b444be407a4ec1162a4bf24ff52e" STYLE="fork"/>
          <node TEXT="无股权冻结" ID="33351ed5c7e1ebda8152e018ce46cab8" STYLE="fork"/>
        </node>
        <node TEXT="被执行人" ID="c5de089d7bf5e624a951cdc3d29d6a52" STYLE="fork">
          <node TEXT="不限" ID="0232e6644124ed4f69e207bddd27d663" STYLE="fork"/>
          <node TEXT="有被执行人" ID="f072da7f74524982cc0df323dfd35d47" STYLE="fork"/>
          <node TEXT="无被执行人" ID="e92741f0e0f818d313f378149e51d3c4" STYLE="fork"/>
        </node>
        <node TEXT="限制高消费" ID="4751232b9ac163dc8afca6ba524b8453" STYLE="fork">
          <node TEXT="不限" ID="82c8e99f0e1f03a21f724306cb15d0e0" STYLE="fork"/>
          <node TEXT="有限制高消费" ID="9510b40aad904e3acb8634f5b6ffa682" STYLE="fork"/>
          <node TEXT="无限制高消费" ID="80713abe5105d43959a269df63eded1c" STYLE="fork"/>
        </node>
        <node TEXT="（迁出风险 &amp; 迁入匹配）" ID="1b9c01d86cad6b9440f7548bfeda7535" STYLE="fork"/>
      </node>
      <node TEXT="街道地区" ID="0f66aa965cc4c142d774e561a524ab2c" STYLE="fork">
        <node TEXT="街道" ID="c2fc7787c249aa97027fd295e8c340dc" STYLE="fork">
          <node TEXT="朝外街道" ID="bd6de79e1ea891861b810d8aca1480d6" STYLE="fork"/>
          <node TEXT="劲松街道" ID="924ec5d541439071b1db32e4052e558b" STYLE="fork"/>
          <node TEXT="建外街道" ID="3f2e5328d0537366718440eba53e6054" STYLE="fork"/>
          <node TEXT="呼家楼街道" ID="121514c6e7d1aca667b0387ac8b355b5" STYLE="fork"/>
          <node TEXT="八里庄街道" ID="001ea385e81f57c6fd6d8fd7c0510e31" STYLE="fork"/>
          <node TEXT="三里屯街道" ID="4a289cc022f24a3ce171082618482377" STYLE="fork"/>
          <node TEXT="团结湖街道" ID="78c58243040477de18aba9c3361e1b74" STYLE="fork"/>
          <node TEXT="双井街道" ID="50f04f635ecb6a812bd190d9d1240b84" STYLE="fork"/>
          <node TEXT="垡头街道" ID="b4161a157f9e3c8986fa9db78c5df206" STYLE="fork"/>
          <node TEXT="左家庄街道" ID="e901a4c78b6dfdbda2bddcacd085bce4" STYLE="fork"/>
          <node TEXT="小关街道" ID="9974698edec18274c4f5fc531c907c19" STYLE="fork"/>
          <node TEXT="和平街街道" ID="fff990c9515794a9fbac077a4f1b3f82" STYLE="fork"/>
          <node TEXT="酒仙桥街道" ID="bed2ca5558af7f01290926c954ec8b7d" STYLE="fork"/>
          <node TEXT="首都机场街道" ID="6f1982b8cc88184a9a145449bf352fc5" STYLE="fork"/>
          <node TEXT="潘家园街道" ID="0fc61aea6f99c817d90d37e0f426630b" STYLE="fork"/>
          <node TEXT="六里屯街道" ID="2a29200d16590e9cd23219dee4a1a24b" STYLE="fork"/>
          <node TEXT="麦子店街道" ID="9bc092bc085261ef0ab56de5513d7e63" STYLE="fork"/>
          <node TEXT="香河园街道" ID="b92605800c49eda1f4ce2544965774f0" STYLE="fork"/>
          <node TEXT="亚运村街道" ID="20c6a7e907067e15ff1085257b0f055c" STYLE="fork"/>
          <node TEXT="望京街道" ID="70563e5faa39d3f3adc38c98d7270070" STYLE="fork"/>
          <node TEXT="安贞街道" ID="dc719cdd3612ba083e25ff0c19875fef" STYLE="fork"/>
          <node TEXT="大屯街道" ID="75dfe4d005122812a93a93820dbfaef3" STYLE="fork"/>
          <node TEXT="奥运村街道" ID="65e94dc2e06f5b10f6d5f9d12a5d7f75" STYLE="fork"/>
          <node TEXT="东湖街道" ID="c0ecf9007b3994d88416e2ae3ace4f31" STYLE="fork"/>
        </node>
        <node TEXT="地区" ID="deba3ca254032d5cb63237a4817b07d0" STYLE="fork">
          <node TEXT="南磨房地区" ID="48abe7003bfdc03da12a39789f369b66" STYLE="fork"/>
          <node TEXT="高碑店地区" ID="53b2c8ff88a526e826f0f7a1b0b352bd" STYLE="fork"/>
          <node TEXT="将台地区" ID="cc7413949dfcef21fff5d52f09495237" STYLE="fork"/>
          <node TEXT="太阳宫地区" ID="aaad46216e27a90cd88279c1a0a04829" STYLE="fork"/>
          <node TEXT="小红门地区" ID="390fbc86eab153b1aa9484582e0074a8" STYLE="fork"/>
          <node TEXT="十八里店地区" ID="3a47a3ec8824839eee1136a8fa5c694c" STYLE="fork"/>
          <node TEXT="三间房地区" ID="ef214d35a5500d716a4e717625d13fc7" STYLE="fork"/>
          <node TEXT="东风地区" ID="f9b6350bc643492900c3c4a5abfccfb2" STYLE="fork"/>
          <node TEXT="常营地区" ID="17e2da401a60a2f605e74a4b3d04870c" STYLE="fork"/>
          <node TEXT="管庄地区" ID="2c053ce4749d399b49fe1a9d65160634" STYLE="fork"/>
          <node TEXT="孙河地区" ID="d5f938b418700b60890679d1d272c7d1" STYLE="fork"/>
          <node TEXT="王四营地区" ID="cd9a87cf28a5930ea9624edf774a277b" STYLE="fork"/>
          <node TEXT="东坝地区" ID="b86fe73a3eb5fd1b80f31e2556fcb1f4" STYLE="fork"/>
          <node TEXT="黑庄户地区" ID="4c4b9715e3356836018dc7ec44d94c71" STYLE="fork"/>
          <node TEXT="崔各庄地区" ID="3deb57f87d8f3a90afee469366f82aed" STYLE="fork"/>
          <node TEXT="豆各庄地区" ID="e82ad404b56b02f66fb69d669505f8be" STYLE="fork"/>
          <node TEXT="金盏地区" ID="148d30e7e33c9e3b1a932dccf328860d" STYLE="fork"/>
          <node TEXT="平房地区 " ID="d2a93e82e4aa4e4a18e4122014a969f4" STYLE="fork"/>
          <node TEXT="来广营地区" ID="a27aeb10dbf2f22639fb2c5dc8d810de" STYLE="fork"/>
        </node>
      </node>
      <node TEXT="行业分类" ID="4fa7b41d3b9711081b228bba61d63c16" STYLE="fork">
        <node TEXT="数字医疗" ID="ca627c4d10785703dbe62c7844c7f992" STYLE="fork">
          <node TEXT="智慧医疗" ID="e1d87d2fef8b51bc8f7a3ac2e05edf0c" STYLE="fork">
            <node TEXT="智慧CDSS" ID="b69cc382470ee485ca1c2bf6d4417ac7" STYLE="fork">
              <node TEXT="主动干预：临床诊断与治疗" ID="f107f46927927686ae4606901cc16c18" STYLE="fork"/>
              <node TEXT="合理用药管理" ID="82f965566c7225af0946ad91daa2ecb6" STYLE="fork"/>
              <node TEXT="被动检索：知识库" ID="1fbb2bf602a1e4c88b3f230843f6a366" STYLE="fork"/>
            </node>
            <node TEXT="智慧电子病历" ID="e84978db57c126cc512b7f01e7b3e638" STYLE="fork">
              <node TEXT="信息化企业" ID="ce00a02825b97e116c1ca92c3fa41571" STYLE="fork"/>
              <node TEXT="云服务提供商" ID="834afc0ae011b51a2792b44c294b2a4c" STYLE="fork"/>
            </node>
            <node TEXT="健康医疗大数据" ID="b6151983494809ce6304911d4c942bb9" STYLE="fork">
              <node TEXT="信息化厂商" ID="42f0886eb4e396fefd09d5ba63babdc1" STYLE="fork"/>
              <node TEXT="数据处理服务商" ID="c7e4230201f01b0fc59428a41a04c85d" STYLE="fork"/>
              <node TEXT="数据安全服务提供商" ID="bdb507a2da22d78dbe7072d071cfb19f" STYLE="fork"/>
              <node TEXT="智能硬件厂商" ID="e4c1e1e1b97c12d35d5a8c0395cb595f" STYLE="fork"/>
              <node TEXT="物联网厂商" ID="36901f5c386c7258e6aa3a8b8f691e8f" STYLE="fork"/>
            </node>
            <node TEXT="智慧病理" ID="ee774951f10e84d42a484f79bb5f09ee" STYLE="fork">
              <node TEXT="全切片成像系统与设备" ID="8f21ce173c200de306d22f9190a36676" STYLE="fork"/>
              <node TEXT="独立病理中心" ID="1943d05d33cd6abcae10caf9a708391d" STYLE="fork"/>
              <node TEXT="辅助病理诊断" ID="9d760efbfb4e6a29fd16b962a7dfe8b4" STYLE="fork"/>
            </node>
            <node TEXT="远程医疗" ID="f6c01d46a4a1c3207b3931f298cf1c92" STYLE="fork">
              <node TEXT="信息化系统厂商" ID="cc470a4e4ae9d4a2dd98b9f9a9d48334" STYLE="fork"/>
              <node TEXT="硬件设备生产商" ID="b71d6b095dc135adb786e480c9bb384e" STYLE="fork"/>
              <node TEXT="通信服务商" ID="490970174d5c3783d243b343009b4fde" STYLE="fork"/>
            </node>
            <node TEXT="智慧医学影像" ID="2f44fda6dd45b7d3fa66f7d8d39b5676" STYLE="fork">
              <node TEXT="人工智能辅助/线上诊断分析平台" ID="181feaa8563958b10ec41a78b4870281" STYLE="fork"/>
              <node TEXT="医学影像存储系统PACS供应商" ID="17ec5c57a9d1baf66c637d63fa298bd3" STYLE="fork"/>
              <node TEXT="智慧CT" ID="a91156f5e7d3ba2c739a5dbc442e151a" STYLE="fork"/>
              <node TEXT="智慧DR" ID="2c6be149a1abb2da7e1371eb426d706a" STYLE="fork"/>
              <node TEXT="智慧MRI" ID="1eca9199bcfe7c88c8d988d68c1a1e4e" STYLE="fork"/>
              <node TEXT="智慧OCT" ID="05a329ff845e4a9264080f393368ce79" STYLE="fork"/>
              <node TEXT="智慧内窥镜" ID="f26f4decf44f0f89cd81c7c3877ae19d" STYLE="fork"/>
              <node TEXT="智慧超声" ID="00aee75feff9efc3d193358c459e549b" STYLE="fork"/>
              <node TEXT="独立医学影像中心" ID="2cc60d319b337197663ca522458cc2be" STYLE="fork"/>
            </node>
            <node TEXT="智慧护理" ID="a273c1d03e82080639ff1fede79c2d91" STYLE="fork">
              <node TEXT="专项护理-养老" ID="b9caee8a1d3dda2287280fb5e59d8019" STYLE="fork"/>
              <node TEXT="专项护理-慢病管理" ID="2eb9ae2f7754d1d5c345b2e12f9b578b" STYLE="fork"/>
              <node TEXT="专项护理-母婴" ID="3c980f859a07cb8504d70d9f584f4950" STYLE="fork"/>
              <node TEXT="护理资源调配平台" ID="ad4dc4043a1765449dfbbbf797ddd762" STYLE="fork"/>
              <node TEXT="智能硬件+护理服务" ID="48ec21e7a63fbb6efa1c4571188c5c68" STYLE="fork"/>
              <node TEXT="综合家庭护理" ID="484bf9c2923d17db7b7e53298c3a965e" STYLE="fork"/>
            </node>
            <node TEXT="智慧区域卫生" ID="543ce98d99917b82c63c72f9dc985e74" STYLE="fork">
              <node TEXT="区域医疗数据信息中心" ID="8205f4a77db80ac78b835944ab805bd0" STYLE="fork"/>
              <node TEXT="医疗大数据共享与交换平台" ID="8c546c5707f25700cae520f8d4bae4f1" STYLE="fork"/>
              <node TEXT="医疗线上平台应用系统" ID="36e95937d62aeece012fb95eaea33c95" STYLE="fork"/>
              <node TEXT="综合卫生监管平台" ID="7415ee567b9e97ec63304e387c4c5b0c" STYLE="fork"/>
            </node>
          </node>
          <node TEXT="互联网+健康" ID="7e8d6b4ffa5834b4d92b5cce370cfd1c" STYLE="fork">
            <node TEXT="互联网医院" ID="1a4436505cecee1482089bdfc2d2cd52" STYLE="fork">
              <node TEXT="信息化服务商" ID="060fc0d160dc597fc2b9bd27215dde01" STYLE="fork"/>
              <node TEXT="处方流转平台" ID="1d23f8e629c4556b31dfec0d6e8961e1" STYLE="fork"/>
              <node TEXT="患者管理平台" ID="9982e77d50da51dcb4e0473e03aff360" STYLE="fork"/>
              <node TEXT="药品流通商" ID="4dfdf22176e3f3f3a11a0cc8f4b17c90" STYLE="fork"/>
            </node>
            <node TEXT="互联网保险" ID="dc1e92733125b43409e27df9e490a2e0" STYLE="fork">
              <node TEXT="IOT" ID="66048b04d9607f677d36e7071de1d1c4" STYLE="fork"/>
              <node TEXT="企业团险" ID="12325af8f090ede8ba074e55423ec4d5" STYLE="fork"/>
              <node TEXT="保单和理赔服务" ID="37ce7b675cdd9ecb5c599b35f399df9a" STYLE="fork"/>
              <node TEXT="健康险企" ID="8156de6ce3cf7e12f062e1d380462644" STYLE="fork"/>
              <node TEXT="比价/线上销售平台" ID="78fe05f1a0c82d7cae4c009938d3a521" STYLE="fork"/>
              <node TEXT="网络互助保险平台" ID="90e6af3936dc0b37dbb82c5e3c4cfbb9" STYLE="fork"/>
            </node>
            <node TEXT="公共卫生服务" ID="a0d3125f83da27941c4a481ee94fc2ab" STYLE="fork">
              <node TEXT="公卫服务相关智能设备" ID="1cd7cc3a026926148ce4ca1286d03369" STYLE="fork"/>
              <node TEXT="大数据与公卫服务" ID="2ab7ea08cdee0ac71bde1a10995859fd" STYLE="fork"/>
              <node TEXT="疾病知识科普" ID="d9f23177337262996de20fc50959daad" STYLE="fork"/>
            </node>
            <node TEXT="检验检测" ID="2b0c42b81c5aa9eecf92a669609d47b4" STYLE="fork">
              <node TEXT="互联网公司" ID="1ed6c071aebad0f38e6ac451f4c37a21" STYLE="fork"/>
              <node TEXT="医院内检验机构" ID="e1598997549498279e3114493d452ac4" STYLE="fork"/>
              <node TEXT="第三方检验中心" ID="15a121ecefdbb7edd3bcbc18cbe2c5cd" STYLE="fork"/>
            </node>
            <node TEXT="医药电商" ID="8cbf0f4fc2c41902f733a09ab0c94d1d" STYLE="fork">
              <node TEXT="B2B" ID="6efe09ff1a20dac9867b98ed4a5dfafd" STYLE="fork"/>
              <node TEXT="B2C" ID="81c003e305bd7afb72a740981c067b4f" STYLE="fork"/>
              <node TEXT="O2O" ID="663ab58fd960d5f53b55e90b8c4d5585" STYLE="fork"/>
            </node>
            <node TEXT="患者教育" ID="5ca1125e47bec8594d5a906c46eccfc5" STYLE="fork">
              <node TEXT="其他疾病患教" ID="b186c28ad4e5182bc299c5726a8298d3" STYLE="fork"/>
              <node TEXT="图文在线健康科普" ID="998337180929f43b902bf3835fa43c1f" STYLE="fork"/>
              <node TEXT="患者社区" ID="16ba1d34cc25dea0a1b71792e90f14b4" STYLE="fork"/>
              <node TEXT="用药指导" ID="13411400f39571005b4be68bf92a5a11" STYLE="fork"/>
              <node TEXT="糖尿病患教" ID="dec94ca83400b06d33b9ccc4df89f4bd" STYLE="fork"/>
              <node TEXT="肿瘤患教" ID="ee11fe4b37a07c2c70821b22ef5070ff" STYLE="fork"/>
              <node TEXT="视/音频健康科普" ID="162af335454be62957fd44d5a26996b9" STYLE="fork"/>
            </node>
            <node TEXT="家庭医生" ID="d644d73c48a35c1ac4e0f594bc89d55c" STYLE="fork">
              <node TEXT="医生在线预约平台" ID="5050cdda362c6a7dcb6c23f0a7333eb3" STYLE="fork"/>
              <node TEXT="家庭医生信息化厂商和签约服务平台" ID="30a90663b93f44a12bd462a87540f024" STYLE="fork"/>
              <node TEXT="诊所与家庭医生" ID="a4f7a864a95dabd6f2d982f5942c33e1" STYLE="fork"/>
            </node>
            <node TEXT="数字营销" ID="e8ca49a0f22def1af31eb69545403c0d" STYLE="fork">
              <node TEXT="医药企业" ID="44ab834c52f49547ecc58b0f11e82272" STYLE="fork"/>
              <node TEXT="数字营销-以医生为导向" ID="083dfc46e7a8444185f1d083a5182283" STYLE="fork"/>
              <node TEXT="数字营销-以患者和消费者为导向" ID="3a5641a25d62ae1f24ad1fa2e472b9b3" STYLE="fork"/>
              <node TEXT="硬件和云服务" ID="58a5fabc8bb2d99f26b9c5f641106216" STYLE="fork"/>
            </node>
          </node>
          <node TEXT="数字疗法" ID="ed7d4d446f6dac32fae8773952db3914" STYLE="fork">
            <node TEXT="可穿戴设备" ID="04480481da832de2bfd7f85ef17de4e1" STYLE="fork">
              <node TEXT="其他可穿戴设备" ID="c8bb3c42fcc0c8353af8dce0de8e3fe3" STYLE="fork"/>
              <node TEXT="头戴式设备" ID="f8e2595ec9f18c25a70291712dcb002e" STYLE="fork"/>
              <node TEXT="智能手环" ID="16b7a265666bdb3d6f713b97ba780e4e" STYLE="fork"/>
              <node TEXT="智能手表" ID="541824f18cf5bcee5bd78dc3f0479815" STYLE="fork"/>
              <node TEXT="智能服饰" ID="c967b4fdfd5846e9e44c0cb2af8bcfdb" STYLE="fork"/>
              <node TEXT="智能眼镜" ID="839fab043fe2df7703f60676ea1d85a8" STYLE="fork"/>
              <node TEXT="耳戴式设备" ID="0665ee60e30624b718450304c0958633" STYLE="fork"/>
              <node TEXT="胸贴式设备" ID="89250830706c79b4eced429b7d799a86" STYLE="fork"/>
              <node TEXT="臂戴式设备" ID="c949407396f742e0dab0a86614cf92b2" STYLE="fork"/>
            </node>
            <node TEXT="糖尿病" ID="6fd0aafca5bcdaccbf90e61d989ecf24" STYLE="fork">
              <node TEXT="其他黑科技" ID="72e6a3aa40b550a5ff596cef76dce36a" STYLE="fork"/>
              <node TEXT="智能胰岛素泵" ID="d09b8f9c8bc82afad360cdabb432c44a" STYLE="fork"/>
              <node TEXT="糖尿病患者服务平台" ID="605543b241be6504f29d6329ca4470b4" STYLE="fork"/>
              <node TEXT="糖尿病管理App" ID="431a73f7a1f996b91c4c7e317d49e6ee" STYLE="fork"/>
              <node TEXT="血糖监测系统" ID="e794f725d487db14772c0017d31ac4eb" STYLE="fork"/>
            </node>
            <node TEXT="肥胖症" ID="817c44c52dfe7b946f282b2d174a59c6" STYLE="fork">
              <node TEXT="体重管理App及管理平台" ID="6a572411b1154975305907c0a0431efa" STYLE="fork"/>
              <node TEXT="智能可穿戴设备及其他智能减肥设备" ID="91fcd6d043efc44acf5d7b705a41be3c" STYLE="fork"/>
              <node TEXT="肥胖症治疗器械" ID="dce450c0f85b7e2fab780fdfa19120c8" STYLE="fork"/>
            </node>
            <node TEXT="哮喘/COPD" ID="e97cf75f85434f1ed028f07a986ca6e0" STYLE="fork">
              <node TEXT="呼吸监测设备" ID="d908997039a238d81833f9d529d6b87b" STYLE="fork"/>
              <node TEXT="哮喘/COPD吸入器传感器" ID="513048c46f975510505a62009f785231" STYLE="fork"/>
              <node TEXT="哮喘/COPD相关App、线上平台" ID="54443c81a0466e925ab7964728826562" STYLE="fork"/>
            </node>
            <node TEXT="抑郁症" ID="19b16a800413ca1b4e647d57267c35aa" STYLE="fork">
              <node TEXT="抑郁症诊断和分析" ID="4641a34f60a1bf03c8e2e5140f58bd77" STYLE="fork"/>
              <node TEXT="线上轻量级咨询" ID="07a37ac6d602ffb4ed8e7689615366c4" STYLE="fork"/>
              <node TEXT="黑科技数字疗法" ID="3147233b85aff1dfc409a1f6481e5deb" STYLE="fork"/>
            </node>
            <node TEXT="高血压" ID="57a25cd7e59bbc91b172e0d5c97afebb" STYLE="fork">
              <node TEXT="App、线上服务" ID="fc209db6a6f4d654bd0a1a8872baf5c3" STYLE="fork"/>
              <node TEXT="血压监测分析系统" ID="88dbf75c3f4a4e782afabd669636619c" STYLE="fork"/>
              <node TEXT="智能血压计" ID="23454d6b17b553914fbf9f8558641034" STYLE="fork"/>
            </node>
            <node TEXT="自闭症" ID="c7d6b1358cbeed7dbedf369df3e68445" STYLE="fork">
              <node TEXT="AI及VR/AR治疗" ID="fc9f84c1c79b6f6d0fe09879ce2c14c9" STYLE="fork"/>
              <node TEXT="自闭症APP管理" ID="034341478cfd15fbdf412666be67a90a" STYLE="fork"/>
              <node TEXT="自闭症患者社区" ID="5800b5fd615d3714a52ea596441222fa" STYLE="fork"/>
              <node TEXT="语言/行为康复治疗" ID="c5986d51708b74d62b76038de5cbe91f" STYLE="fork"/>
            </node>
          </node>
        </node>
        <node TEXT="前沿技术" ID="40da4cb18ac0e7ef7fa970852c048bfd" STYLE="fork">
          <node TEXT="前沿技术融合" ID="cc6a8e6a2d4d0f21e8c87b2ac9e883e8" STYLE="fork">
            <node TEXT="脑机接口(BCI)" ID="b101697064d16ebbda6fe28123229bab" STYLE="fork">
              <node TEXT="侵入式脑机接口" ID="9eeae3d2ce12ce26925e5ff4394c324f" STYLE="fork"/>
              <node TEXT="半侵入式/介入式脑机接口" ID="867aa0b16ed223a66f77024f4b6603ba" STYLE="fork"/>
              <node TEXT="非侵入式脑机接口" ID="54a7b4a62b54729c068459344375cb12" STYLE="fork"/>
            </node>
            <node TEXT="人工智能" ID="98a204081f6d29fa6cf7efc0c4a4fb66" STYLE="fork">
              <node TEXT="AI临床试验解决方案" ID="f4eab9ed2f4ff680738ec7381643f354" STYLE="fork"/>
              <node TEXT="AI健康管理平台" ID="86d5913a620329090e9d370c3ff69bb8" STYLE="fork"/>
              <node TEXT="医疗垂直大模型" ID="15cb0c4e32c485db73bb7b2e5c8cab43" STYLE="fork"/>
              <node TEXT="价值导向型医疗生态系统构建" ID="2430123a1329c8444b9510a9d722abfd" STYLE="fork"/>
            </node>
          </node>
        </node>
        <node TEXT="医疗器械" ID="ee4b09533d03982f41b8666332a80db2" STYLE="fork">
          <node TEXT="体外诊断 (IVD)" ID="7b0fdf363f2344dd170169e05e2026ad" STYLE="fork">
            <node TEXT="生化" ID="eb2fd374d8618f3ad8167e6829dec5ca" STYLE="fork">
              <node TEXT="生化分析仪、试剂等" ID="25ef3610705261d558124ef52cfb2495" STYLE="fork"/>
            </node>
            <node TEXT="免疫" ID="9a62df12eaffd680f5fe601f665d691b" STYLE="fork">
              <node TEXT="免疫分析仪、试剂等" ID="c6c881d9c2a1079b7f788db323a69d8b" STYLE="fork"/>
            </node>
            <node TEXT="分子" ID="3a4afbe9c916d2acc4ab3a4b047fb33a" STYLE="fork">
              <node TEXT="PCR仪、基因测序设备等" ID="8bb0c1eefce0fd2489b926464832a3cf" STYLE="fork"/>
            </node>
            <node TEXT="微生物" ID="b1d67a1afc59a0696a6a53396c09f3cd" STYLE="fork">
              <node TEXT="微生物检测系统、培养箱等" ID="52b2d94e71626aac0bc3d776c6c5b200" STYLE="fork"/>
            </node>
            <node TEXT="血液、体液" ID="0ea0da11cdd3fd3ac86f5155fd7ec5e8" STYLE="fork">
              <node TEXT="血球仪、尿液分析仪等" ID="6d8a21c5dfa6406944003624c77e26e7" STYLE="fork"/>
            </node>
            <node TEXT="POCT" ID="5e49aba40ad47f15440631dd011c83bb" STYLE="fork">
              <node TEXT="便携式血糖仪、快速检测卡等" ID="199a51083b084b8a04cb510401e1b134" STYLE="fork"/>
            </node>
          </node>
          <node TEXT="影像设备" ID="412713e692f35c01e2b33cf4088a8318" STYLE="fork">
            <node TEXT="X射线成像设备" ID="13fe0ff425276099a812f4d4c0310d26" STYLE="fork">
              <node TEXT="CT、DR" ID="93f43cda96b3aa10558c67010b9cddee" STYLE="fork"/>
              <node TEXT="DSA" ID="5b94f26f912ff02f3108c2a71b548f0a" STYLE="fork"/>
            </node>
            <node TEXT="超声诊断设备" ID="476dba445fc6feb4e13bddc37cb8691e" STYLE="fork">
              <node TEXT="超声影像诊断设备" ID="28e08c342978897ee51821f7aeece018" STYLE="fork"/>
              <node TEXT="超声血管流量计" ID="45b43688d2edb110c34405edf1d1488d" STYLE="fork"/>
            </node>
            <node TEXT="核磁共振设备" ID="0af838bd9232066a66e7906488e08ad7" STYLE="fork">
              <node TEXT="MRI" ID="d7592f19ac7cf423729318b2949aaae0" STYLE="fork"/>
            </node>
            <node TEXT="核医学检查设备" ID="9cf430164511d8907653cfa439d5b8af" STYLE="fork">
              <node TEXT="PET-CT" ID="5d4b5c7377551cc916af65ac16e9fb21" STYLE="fork"/>
            </node>
            <node TEXT="内窥镜检查设备" ID="0d008606e9f6e3cb421663e337ba3893" STYLE="fork">
              <node TEXT="医用内窥镜" ID="3dffe893afc9d41540046aa6c4f06440" STYLE="fork"/>
              <node TEXT="血管内超声诊断设备" ID="46460f3eadc9fdfa2a71c8b8e22c2737" STYLE="fork"/>
              <node TEXT="电凝切割内窥镜" ID="839f4a7285ef47fafb75dacd5310b5f2" STYLE="fork"/>
            </node>
          </node>
          <node TEXT="治疗设备" ID="447431288ade54b0b3d9f11021ffe7af" STYLE="fork">
            <node TEXT="手术机器人" ID="b48fc7dec45434036300b95e3d3f2e12" STYLE="fork">
              <node TEXT="腔镜手术机器人" ID="d43d830e77e8381e3ff70e4ff276a7c0" STYLE="fork"/>
              <node TEXT="骨科手术机器人" ID="5ff418fcf9f41c9590f30439390ff62f" STYLE="fork"/>
              <node TEXT="泛血管介入手术机器人" ID="9c845ef99b0e457295ee09eb40c6056b" STYLE="fork"/>
              <node TEXT="经自然腔道手术机器人" ID="e563ce90761faca654a2c50a71fb61de" STYLE="fork"/>
              <node TEXT="经皮穿刺手术机器人" ID="f03af6b55d04a1b8bf4e11896ec71174" STYLE="fork"/>
            </node>
            <node TEXT="能量源设备" ID="f582817744776b1fc3f9fe68c4c06f82" STYLE="fork">
              <node TEXT="高频手术设备" ID="235b5c51c4ae93e760d5d38da389e7fd" STYLE="fork"/>
              <node TEXT="激光治疗设备" ID="57577fdd5a23aa7589026e3c73db8343" STYLE="fork"/>
              <node TEXT="射频治疗设备" ID="b88feabd9179a518064d415c39269c35" STYLE="fork"/>
              <node TEXT="脉冲电场消融设备" ID="b594948e0eb919c9eeec1c24999f1463" STYLE="fork"/>
              <node TEXT="超声波治疗设备" ID="e326076d2f326df6b3f2e6f60ae3b6ca" STYLE="fork"/>
            </node>
            <node TEXT="放射设备" ID="52d48e05b3c3869477ad51fbd8143221" STYLE="fork">
              <node TEXT="放疗设备" ID="12401b32acf6822355607d1dbb14c103" STYLE="fork"/>
            </node>
          </node>
          <node TEXT="生命信息支持设备" ID="7bef32390579cd084259bd50ac50b29d" STYLE="fork">
            <node TEXT="监护仪" ID="232bf6539183bb036eaa79fa17a08f0b" STYLE="fork">
              <node TEXT="监护设备" ID="6899f24bebeaa098e722807a811fe993" STYLE="fork"/>
            </node>
            <node TEXT="呼吸机" ID="043aff4f915de5ecd2390869085cecda" STYLE="fork">
              <node TEXT="呼吸机" ID="d2ca319eabbae3460c4719efb8448188" STYLE="fork"/>
            </node>
            <node TEXT="麻醉机" ID="2908ad2a72da48b84a965411178ecbc1" STYLE="fork">
              <node TEXT="麻醉机" ID="9e3b75524cb27f7d468d88fd8f79b1eb" STYLE="fork"/>
            </node>
            <node TEXT="ECMO" ID="c1ee5f8eed2aac3efce60411ef6c8e70" STYLE="fork">
              <node TEXT="体外膜肺氧合设备" ID="e6ad39645ec732365ffcb1c45dacd7a8" STYLE="fork"/>
            </node>
          </node>
          <node TEXT="康复设备" ID="96488ced4c9679852dea3b35ff3d9cac" STYLE="fork">
            <node TEXT="康复机器人" ID="e69caa5489a701ce97709fcd0ca6122e" STYLE="fork">
              <node TEXT="运动康复、视听障碍康复" ID="d98bb8a3b4f6f2d0a13804f0d075b7ba" STYLE="fork"/>
            </node>
            <node TEXT="物理治疗设备" ID="68055d851f2a81c12add1ac4dd87ec85" STYLE="fork">
              <node TEXT="声、光、电、磁疗" ID="4e50688171b9006c5900e282b9275063" STYLE="fork"/>
            </node>
          </node>
          <node TEXT="辅助设备" ID="1c6a2bde3706f3d57ca754d261df45c2" STYLE="fork">
            <node TEXT="诊断辅助软件" ID="b8fc7f43e457184c622991bef44a8035" STYLE="fork">
              <node TEXT="AI影像处理软件" ID="09886593dca7c100966c9dcd48b39c20" STYLE="fork"/>
              <node TEXT="AI决策支持软件" ID="a7c7e53da9c7295f9fb7eed3e4a55ee2" STYLE="fork"/>
              <node TEXT="AI手术计划软件" ID="77c8e67556553d037890655b2871bb5d" STYLE="fork"/>
              <node TEXT="采用脑机接口技术的医疗器械" ID="47bded623d0c2452233f71e203b48d41" STYLE="fork"/>
              <node TEXT="应用纳米材料的医疗器械" ID="ff3315126e0d0e844b7140942b0bf5ce" STYLE="fork"/>
              <node TEXT="医疗器械软件（SaMD）" ID="6f6b87486857dde3aebe241c0607f676" STYLE="fork"/>
            </node>
          </node>
          <node TEXT="家用医疗设备" ID="a472bb5502434a534768b4cf67b7aa29" STYLE="fork">
            <node TEXT="呼吸治疗" ID="5cc08168b4470a573093e129701a9cdf" STYLE="fork">
              <node TEXT="制氧机、呼吸机" ID="69f080ff95666557f417aed9b22e44ab" STYLE="fork"/>
            </node>
            <node TEXT="血糖监测" ID="6d099f19cac8d33615bd3332d6da6984" STYLE="fork">
              <node TEXT="血糖仪" ID="7497915b71bdf2be25df0d622f275eea" STYLE="fork"/>
            </node>
            <node TEXT="健康检测" ID="c797438ffe70ec463816335d903cba1e" STYLE="fork">
              <node TEXT="电子血压计" ID="e05a62221fecb727a83ac59147607d35" STYLE="fork"/>
            </node>
            <node TEXT="助听设备" ID="ccc026100aecde0b2e8436da905d8283" STYLE="fork">
              <node TEXT="助听器" ID="1e03c252c682cd5c40129d271559c37f" STYLE="fork"/>
            </node>
          </node>
          <node TEXT="高值医用耗材" ID="40d7c614cbfeac66251f8a4ec589c52a" STYLE="fork">
            <node TEXT="血管介入类" ID="09712a39c85b780f391f200fbf2eb839" STYLE="fork">
              <node TEXT="冠脉介入球囊/支架" ID="6c5801c01bed695b2888f8ee12513941" STYLE="fork"/>
              <node TEXT="外周血管介入" ID="2d3d4b119f0d501280e8882f566a1336" STYLE="fork"/>
              <node TEXT="神经血管介入" ID="4adaadd023e02003e7cc2456afb633fe" STYLE="fork"/>
              <node TEXT="肺动脉血栓取出系统" ID="223f736db9836470181fcd65f067a488" STYLE="fork"/>
            </node>
            <node TEXT="非血管介入类" ID="c0dd812002dbec7f16c0f478fcfd605c" STYLE="fork">
              <node TEXT="内窥镜下耗材" ID="173afd1734df133878c7348e6f69bb28" STYLE="fork"/>
              <node TEXT="其他介入耗材" ID="fec8030441dfc253d3405d321fee42f1" STYLE="fork"/>
            </node>
          </node>
          <node TEXT="植入器械/材料" ID="2b802635cafabbcf74de39840f2e844c" STYLE="fork">
            <node TEXT="有源植入物" ID="6cbca25b865764a22c4ec4eff94ba751" STYLE="fork">
              <node TEXT="心脏起搏器" ID="f1c29f7b6fdf8bffab02392fa0b78545" STYLE="fork"/>
              <node TEXT="植入式心律转复除颤器" ID="6f50bfad981ef0bd9d7b5984d3b727b2" STYLE="fork"/>
              <node TEXT="心室辅助装置" ID="c541d5eb2f838d52327983d7ddac52e5" STYLE="fork"/>
              <node TEXT="脑深部电刺激器" ID="c25b634212c12341c7a27da185119643" STYLE="fork"/>
              <node TEXT="脊髓刺激器" ID="2d1b277abad7105d79d5427e2913afb8" STYLE="fork"/>
              <node TEXT="听觉植入物" ID="7f66594f4ce6dd68af8c7b2c24c86660" STYLE="fork"/>
            </node>
            <node TEXT="无源植入物" ID="b2c405506dfea98c001f0cd5a41a4694" STYLE="fork">
              <node TEXT="心脏瓣膜" ID="5cc6fff79b651a2e962c6c861caecb28" STYLE="fork"/>
              <node TEXT="封堵器" ID="c381b3912c29cb2b269d61b406fa8c5d" STYLE="fork"/>
              <node TEXT="关节植入物" ID="92c3bcc99d01da0458fb95e9c0124571" STYLE="fork"/>
              <node TEXT="脊柱植入物" ID="caa745c73e61c14d7187f0cf8eed1093" STYLE="fork"/>
              <node TEXT="创伤植入物" ID="2f13c66dbda4dc82b9a07c7524a918a8" STYLE="fork"/>
              <node TEXT="运动医学植入器械" ID="35dcc1fa5f0c0ef12025cca49078ed00" STYLE="fork"/>
              <node TEXT="整形外科植入物" ID="ce16ed7722348ec683b6130611d0c612" STYLE="fork"/>
              <node TEXT="眼科植入物" ID="94c00490fa4028a7bfbd9acc51d50d04" STYLE="fork"/>
              <node TEXT="其他植入物" ID="33099ef018514ac4602a2888884d6c10" STYLE="fork"/>
            </node>
          </node>
          <node TEXT="低值医用耗材" ID="079df44de216aeb5e3d7601ee7c0d847" STYLE="fork">
            <node TEXT="注射穿刺类" ID="ac5746c09fd0801b2fc65eead951f581" STYLE="fork">
              <node TEXT="注射器、输液器" ID="ae0a7433a342ae6c0645625c2c675c55" STYLE="fork"/>
            </node>
            <node TEXT="医用卫生材料" ID="aa2be62a6c2437f51e11703e6cec6dd5" STYLE="fork">
              <node TEXT="敷料、口罩" ID="322f7470f803b304d563b11db81d4632" STYLE="fork"/>
            </node>
            <node TEXT="医用高分子制品" ID="34bdcbbeacf2cb2551bd7b22a1c19d2d" STYLE="fork">
              <node TEXT="导管、引流袋" ID="5b8dc6806e8114cc2605393cd3f50ad5" STYLE="fork"/>
            </node>
          </node>
          <node TEXT="装备制造" ID="79f360a71da03dc68c64a6da3042bb11" STYLE="fork">
            <node TEXT="制药装备" ID="df66aefec29812125dc544cc81de7436" STYLE="fork">
              <node TEXT="生物反应器/系统" ID="4ef9222f6d37fd34ac48ceef5291f627" STYLE="fork"/>
              <node TEXT="实验室自动化" ID="c80664f7f87bdfcb661796eddff37954" STYLE="fork"/>
              <node TEXT="智慧工厂方案" ID="6615ed90ae811e947fa2ae865e7999d8" STYLE="fork"/>
            </node>
          </node>
        </node>
        <node TEXT="医疗服务" ID="a0a82d6d64548fa7f433a2ca442fd615" STYLE="fork">
          <node TEXT="医药商业 / 流通" ID="bfea1cb0907521f12bee262a23356195" STYLE="fork">
            <node TEXT="医药配送企业" ID="e11debac8aaf5d0a2a1ca570bce487b2" STYLE="fork"/>
            <node TEXT="医药即时零售" ID="d0fa25d91bc032d913f453062ce3d9e6" STYLE="fork">
              <node TEXT="平台型" ID="01696eb4cad84953942e9f111977199a" STYLE="fork"/>
              <node TEXT="连锁药店 O2O" ID="c014c932bb3f0067bed65962fdf69aa5" STYLE="fork"/>
            </node>
            <node TEXT="药企线上渠道 / 合作" ID="46ec5380d6c00b06c0032f03ff8c419b" STYLE="fork">
              <node TEXT="新品首发 / 旗舰店 / 营销" ID="30a3cc82a6a62f050675643c22c0d2a2" STYLE="fork"/>
            </node>
            <node TEXT="医药跨境供应链" ID="cebfcd0f1bb109cebe847b73608b17c0" STYLE="fork"/>
          </node>
          <node TEXT="医疗零售" ID="aad471e0f77e6db0b74c529391281814" STYLE="fork">
            <node TEXT="实体药店" ID="0e7d9107c384787792aa499aafd2afb5" STYLE="fork">
              <node TEXT="连锁药店" ID="e88f8f10d69cfb804f6fd597697fa90c" STYLE="fork"/>
              <node TEXT="DTP 药房 / 特药房" ID="1057f31ecf966c6bf77a6c108dc57ea3" STYLE="fork"/>
            </node>
            <node TEXT="医药电商" ID="c814aa1ad167a674cb21cc91af2c39cf" STYLE="fork">
              <node TEXT="B2B" ID="685f18948b103c44f5e7bc085abce1a0" STYLE="fork"/>
              <node TEXT="B2C" ID="a94bbb5c0a64eaa3e3e62740942a0873" STYLE="fork"/>
              <node TEXT="O2O" ID="aa5e176b29b77e08bbf4557ca57d6d93" STYLE="fork"/>
            </node>
            <node TEXT="药店业务拓展" ID="ba6d6103ce648cf9def74025c6753842" STYLE="fork">
              <node TEXT="医美服务" ID="0f9bdb9da39e0a224b61ddf70a911479" STYLE="fork"/>
              <node TEXT="中医诊所" ID="6ca7bce27732cad433a15ce608f07fc4" STYLE="fork"/>
            </node>
          </node>
          <node TEXT="严肃医疗" ID="a5ea4984ac9d94b24cb38adfa5f1b84d" STYLE="fork">
            <node TEXT="公立三级" ID="6a235a846f4913299db6a244e5615f85" STYLE="fork"/>
            <node TEXT="公立二级" ID="21439456b5a1ba48980ec27401cf4dac" STYLE="fork"/>
            <node TEXT="基层公卫" ID="a2fb6c3fb48cb8a0128d2c7a9e2b0e04" STYLE="fork"/>
            <node TEXT="民营医院" ID="d7b8585b543063b55e4e26d24edd9cf3" STYLE="fork">
              <node TEXT="综合医院" ID="1a44b26feb57b2831f03022d19c8311f" STYLE="fork"/>
              <node TEXT="专科医院（肿瘤）" ID="5ca6ddd3d0cab47d75be59fc1fc3dfcf" STYLE="fork"/>
              <node TEXT="专科医院（辅助生殖）" ID="f75832e8880b58037abb2b5b57a43658" STYLE="fork"/>
            </node>
          </node>
          <node TEXT="消费医疗" ID="2fdf11db42f7bd866a5d92380985a1a3" STYLE="fork">
            <node TEXT="口腔诊所 / 连锁" ID="6fdef9031d41b604873360c96f630861" STYLE="fork"/>
            <node TEXT="体检中心 / 健康管理" ID="386fd099e00a145367368a5192ea45c0" STYLE="fork"/>
            <node TEXT="眼科诊所 / 连锁" ID="ee0788d8729f137bfc0915fbe39aed1a" STYLE="fork">
              <node TEXT="综合眼科集团" ID="d1d8bd1e776e876dd8c2fa1f4e2e7e70" STYLE="fork"/>
              <node TEXT="垂直眼视光 / 少儿眼科" ID="a60aada28114f0505acd2ea0266f5804" STYLE="fork"/>
            </node>
            <node TEXT="产后中心 / 母婴护理" ID="a55b9d7911dee0b267f01016641495cb" STYLE="fork"/>
            <node TEXT="生殖中心 / 门诊" ID="5dc4cbf9d89cb1fec81470690eac4281" STYLE="fork"/>
            <node TEXT="中医诊所 / 连锁" ID="a2cf218d30d811248b66639b357b7d6b" STYLE="fork"/>
            <node TEXT="医美诊所 / 服务" ID="67e8af4c6ebbedb9dfddb572ce891af9" STYLE="fork"/>
            <node TEXT="专科诊所 / 连锁（其他）" ID="e7f9a41224dcf285028d00a519d193d1" STYLE="fork">
              <node TEXT="骨科与肌肉健康（数字疗法）" ID="a4f7c9409260bfa309582dc857cced0a" STYLE="fork"/>
            </node>
          </node>
          <node TEXT="互联网医疗" ID="ab3d629e5200dbdbd3341ef6746070d0" STYLE="fork">
            <node TEXT="综合平台 / 在线诊疗" ID="f2903e551bd16bf26ee456040573a396" STYLE="fork">
              <node TEXT="互联网医院" ID="9655cb28a2381e54eb89e64b210c63d8" STYLE="fork"/>
              <node TEXT="AI 医疗应用" ID="81418fc315ef52fd9088e19a0f4fe425" STYLE="fork"/>
            </node>
            <node TEXT="垂直服务平台" ID="fb6a1863fb7f5c687260666ae276a1b2" STYLE="fork">
              <node TEXT="互联网 + 护理服务" ID="4d2dbd77797a99968b06d368a16971be" STYLE="fork"/>
              <node TEXT="数字慢病 / 专病管理" ID="e91aa1858e7989fd9fcd47cddf85abd0" STYLE="fork"/>
            </node>
          </node>
          <node TEXT="第三方中心" ID="8b5fc5de802b77c15685038970f96c05" STYLE="fork">
            <node TEXT="检验中心" ID="225f44770e5b4152fde3f4882c6627a0" STYLE="fork"/>
            <node TEXT="影像中心" ID="fb58b0495eddcf03f40225e833496660" STYLE="fork"/>
            <node TEXT="病理中心" ID="1935b87ea26ec0d69845762198f9573e" STYLE="fork"/>
            <node TEXT="消毒中心" ID="0d45a452c0fa104c537bd932d20f9109" STYLE="fork">
              <node TEXT="第三方消毒供应" ID="51804405a1939035cc88b785d6add8ab" STYLE="fork"/>
            </node>
            <node TEXT="血透中心" ID="f8a7966df441fc1d92ea8a404599cb93" STYLE="fork"/>
            <node TEXT="其他第三方服务" ID="5f52e2e1d5ad047f8fa97ff699f05d91" STYLE="fork">
              <node TEXT="居家护理 / 上门检测" ID="c1c9544ef7b12a06dcfb944c2c414d63" STYLE="fork"/>
            </node>
          </node>
          <node TEXT="保险支付" ID="8e3a763f733bdef1737649ea1fe7050d" STYLE="fork">
            <node TEXT="商业保险" ID="0ced5f58bd2d6e51c41cddae974754fb" STYLE="fork">
              <node TEXT="健康险产品 / 公司" ID="5316a5eac4c7e83a0e50b0c378bee85e" STYLE="fork"/>
            </node>
            <node TEXT="TPA / 保险科技" ID="3b8949ad97fde427d538601ba36a01fb" STYLE="fork">
              <node TEXT="保险科技平台 / 服务" ID="7deaf39821d71ccd3e5e1647e868f82a" STYLE="fork"/>
            </node>
          </node>
        </node>
        <node TEXT="药品" ID="363bf350a2509c5aaa1772220a5314cd" STYLE="fork">
          <node TEXT="化学制药" ID="461a904699ceb723b32eddb7611f6876" STYLE="fork">
            <node TEXT="化学制剂" ID="906bc3ea7c35e0d91fa25f454c7c94ac" STYLE="fork">
              <node TEXT="创新小分子药" ID="8ef582d4bcd7e121e2cd5dcd086a6d48" STYLE="fork"/>
              <node TEXT="改良型新药" ID="659225b6bba1f1e51a05adcaecf233f8" STYLE="fork"/>
              <node TEXT="仿制药" ID="b9850e2ed9907a27aae4dec99207af3d" STYLE="fork"/>
              <node TEXT="减重领域小分子药" ID="555fdd8dd9942b48fef2ac29e2074f58" STYLE="fork"/>
              <node TEXT="肿瘤靶向小分子药" ID="8067d4ad30a0c0ef3b953134bed0ec22" STYLE="fork"/>
              <node TEXT="自免领域小分子药" ID="3db3e8b65bd37e108cbfd3f6f8062922" STYLE="fork"/>
            </node>
            <node TEXT="原料药" ID="5418e79e981e3a5b793caf1ee1440162" STYLE="fork">
              <node TEXT="高端原料药" ID="f8ef7234b2b731ce93425a8eb46d521a" STYLE="fork"/>
              <node TEXT="特色原料药" ID="0a855d2a489534962b73b13a7f57c1fa" STYLE="fork"/>
              <node TEXT="大宗原料药" ID="ad5e706f1cc2dfd942dbce95c6afe3cf" STYLE="fork"/>
              <node TEXT="多肽原料药" ID="98e6df258b7c10defa1fd5483c28b42f" STYLE="fork"/>
            </node>
          </node>
          <node TEXT="生物制品" ID="d35c31217998a3b574afc6461699a9b4" STYLE="fork">
            <node TEXT="血液制品" ID="bd3a305c224e0ab0c26ae2d786d8bd76" STYLE="fork">
              <node TEXT="人血白蛋白" ID="653559ce48aa468c4c8185cef468614b" STYLE="fork"/>
              <node TEXT="免疫球蛋白" ID="d8b0a2217aceedb84011c1cc3018cbee" STYLE="fork"/>
              <node TEXT="凝血因子" ID="85d1c3aef12d03c70776dab944c8b4a0" STYLE="fork"/>
            </node>
            <node TEXT="疫苗" ID="930ab0e327f2b3a6cb5b016677206386" STYLE="fork">
              <node TEXT="预防性疫苗（HPV、PCV13）" ID="03f16b61c798b9b4bbaa2addb3dcc08b" STYLE="fork"/>
              <node TEXT="治疗性疫苗" ID="f4319d6c6179ba57775b1653d9903a1d" STYLE="fork"/>
              <node TEXT="mRNA 疫苗" ID="1806c4c23fe718a058711cc1e193dbbf" STYLE="fork"/>
              <node TEXT="乙肝治疗性疫苗" ID="9c291f33a88f1343fd084cd80b2723c2" STYLE="fork"/>
            </node>
            <node TEXT="抗体药物" ID="5d7f2fa38871952b12caa4cadf5c0140" STYLE="fork">
              <node TEXT="双特异性抗体" ID="22249603e7c8fe6b6d7e4d723b319531" STYLE="fork"/>
              <node TEXT="ADC（抗体偶联药物）" ID="16f86ada9c72376e40dfd15c2740b1e9" STYLE="fork"/>
              <node TEXT="双抗 ADC" ID="582d73633fc76e3f0e089ce6a4c956b4" STYLE="fork"/>
              <node TEXT="双载荷 ADC" ID="544edfcd18f568db55dc6a29263d866e" STYLE="fork"/>
              <node TEXT="单克隆抗体" ID="281a30d6fe392ddc594bfc3d070ab787" STYLE="fork"/>
              <node TEXT="髓系细胞衔接器（MCE）" ID="17d556a8c31820828f841bd75bec1fe6" STYLE="fork"/>
            </node>
            <node TEXT="蛋白药物" ID="b75d1d6b6949c72b249d3451b90c9096" STYLE="fork">
              <node TEXT="重组蛋白药物" ID="72ff0475cc2eee6b4c34fdad18d6d590" STYLE="fork"/>
              <node TEXT="酶替代疗法" ID="71510229bb2b47e3d242cfc305d14fe3" STYLE="fork"/>
              <node TEXT="细胞因子" ID="061477bb215dc45b25fc51ce473817b8" STYLE="fork"/>
            </node>
            <node TEXT="基因治疗" ID="7c3fd67935e0bcd6b3052c3c066795b9" STYLE="fork">
              <node TEXT="CAR-T（自体 / 通用型 / 体内 CAR-T）" ID="c1d65db86819f040f4847f17a54feaec" STYLE="fork"/>
              <node TEXT="TIL 疗法" ID="3da90618adfa9884b85a9fb40fb629c0" STYLE="fork"/>
              <node TEXT="核酸药物（siRNA、mRNA 等）" ID="63fae19a8964597c0b9a6e8b57519e02" STYLE="fork"/>
              <node TEXT="基因编辑疗法" ID="2d0599d4ddd5cd28705fdb43bd01ab50" STYLE="fork"/>
              <node TEXT="现货型细胞疗法" ID="abc69096b7a0ca9228ec107f0ea64a39" STYLE="fork"/>
            </node>
          </node>
          <node TEXT="中药" ID="2edd847dcdec9b9ed49455ad9cb6fbbd" STYLE="fork">
            <node TEXT="中药饮片" ID="d1b617411295ec490c55508d750514af" STYLE="fork">
              <node TEXT="传统饮片" ID="0c5743c3a8c538c45b52808b348bf9d4" STYLE="fork"/>
              <node TEXT="配方颗粒" ID="6876b9290245dd53c76c49326fef3dfd" STYLE="fork"/>
              <node TEXT="破壁饮片" ID="1c9cc861b392f42efa42fdb6f7b3664f" STYLE="fork"/>
            </node>
            <node TEXT="中成药" ID="9e540dc0ed1940761c9ef541377a90f6" STYLE="fork">
              <node TEXT="心脑血管类" ID="063a7cf5c180473baaecdd7f4cb76fbf" STYLE="fork"/>
              <node TEXT="呼吸系统类" ID="279ee947ca8bbaab763a9bb643800a96" STYLE="fork"/>
              <node TEXT="抗肿瘤辅助类" ID="ece18b09b2622a8d8b901618c6c54a52" STYLE="fork"/>
            </node>
          </node>
        </node>
        <node TEXT="AI 药物研" ID="31a446180d927f19d303f40a17aa94e1" STYLE="fork">
          <node TEXT="AI 药物研发平台" ID="8817badee64172aa6d71a0cfd2fe360e" STYLE="fork">
            <node TEXT="小分子 / AI 药物研发平台等" ID="deed08bc8065b4eb0072a1de040c7341" STYLE="fork">
              <node TEXT="小分子 / AI 药物研发平台（如晶泰科技 XtalFold™）" ID="4b1d374d6c3c4c30ddd3029172893e1d" STYLE="fork"/>
              <node TEXT="DNA 编码化合物库技术" ID="645b3889005b74fa17eb67fd2c7996ea" STYLE="fork"/>
              <node TEXT="一站式 AI 赋能新药研发平台（如腾迈医药 TandemViz™）" ID="caa2136fcbcf2675b549ed8e76a4243b" STYLE="fork"/>
              <node TEXT="计算设计平台（如深势科技 Hermite®）" ID="ab716451b847b83b9abe87dd544c8841" STYLE="fork"/>
              <node TEXT="AI + 疫苗研发平台" ID="eabad88f255984b2f0c35254a70136b6" STYLE="fork"/>
            </node>
          </node>
          <node TEXT="AI CRO / 技术服务商" ID="e4f6d2df33b4e1aedabb56f17c9ea5e1" STYLE="fork">
            <node TEXT="AI 驱动的口服小分子药物等" ID="03157e440a52aa62d3e904db03c1c8d7" STYLE="fork">
              <node TEXT="AI 驱动的口服小分子药物" ID="0562f0e4f52d268db0ba1acf3d75c7a7" STYLE="fork"/>
              <node TEXT="代谢增强型细胞疗法（如莱芒生物 MetaOC 平台）" ID="b44026b26fc933ab940a1eee4ccf12b0" STYLE="fork"/>
              <node TEXT="AI 驱动的大分子药物（如倍华生物抗体平台）" ID="c0999971e24e2a93b73fc0438624016d" STYLE="fork"/>
              <node TEXT="AI 设计的减重 / 代谢类药物" ID="ca44cfc6cf7ac731b18da91ed9404baa" STYLE="fork"/>
              <node TEXT="AI 辅助临床试验设计" ID="2a45c71dab02a42a8dbab97ecc31b151" STYLE="fork"/>
              <node TEXT="数字化 CRO 服务" ID="4036fe199f4f90c24e30bdb12eced717" STYLE="fork"/>
            </node>
          </node>
          <node TEXT="AI 自研管线企业" ID="42ffcdf18bd88f742995080dfd9daf66" STYLE="fork">
            <node TEXT="AI 药物研发 SaaS 平台等" ID="7c5c9316eb6088ec7519f040c9d49761" STYLE="fork">
              <node TEXT="AI 药物研发 SaaS 平台（覆盖药物设计、虚拟筛选、成药性预测）" ID="381011953e0612915fb4e5c087d040ad" STYLE="fork"/>
              <node TEXT="AI 智能体（如衍因科技在 RNA 药物、IND 申报等场景的嵌入）" ID="ff4608f563543917337c213a23340361" STYLE="fork"/>
              <node TEXT="AI 蛋白质设计平台" ID="4cbffdf49b9b16e8847e83d25c48f99d" STYLE="fork"/>
              <node TEXT="AI 设计的抗肿瘤药物" ID="8550423e29d420043a1f4e00fcbbc3e0" STYLE="fork"/>
              <node TEXT="AI 优化的代谢类药物" ID="c6342f17f2ac7cd095f032178109fc23" STYLE="fork"/>
              <node TEXT="AI 驱动的神经免疫疗法" ID="44320c4d9bff14ebc47495648210a8dd" STYLE="fork"/>
            </node>
          </node>
          <node TEXT="AI 软件 / 工具平台" ID="ed23629e626bc8dca4dcbf9971df398b" STYLE="fork">
            <node TEXT="AI + 神经免疫疗法等" ID="9968830677fed897ddfb49bbe3534c55" STYLE="fork">
              <node TEXT="AI + 神经免疫疗法（如埃格林医药 EG-501）" ID="a88b00deecbae0c1f94697e414d65b20" STYLE="fork"/>
              <node TEXT="AI + 疫苗研发（如智峪生科与沃森生物合作）" ID="74576251b828575d52fd4f37b77e74cd" STYLE="fork"/>
              <node TEXT="AI + 多肽药物发现平台" ID="3d1de81ff578d6166759a828df1b18d0" STYLE="fork"/>
              <node TEXT="AI + 新型 ADC 化合物库开发" ID="62408ea9085c8748badfe0698ee5c559" STYLE="fork"/>
              <node TEXT="AI 药物发现平台" ID="a507b23e3a3c78ef86c070df62e4ad97" STYLE="fork"/>
              <node TEXT="AI 蛋白质设计平台" ID="f7ebb73eb3c775dc925e5426a52be6a4" STYLE="fork"/>
              <node TEXT="AI 临床试验优化平台" ID="f58083904c3cc2d133564907b295cfdf" STYLE="fork"/>
              <node TEXT="AI 智能体平台" ID="cb9dbacd8926c0b6743259fd544446bf" STYLE="fork"/>
            </node>
          </node>
          <node TEXT="AI + 特定领域研发" ID="32b0984e750faa6b39aece1445d10f68" STYLE="fork">
            <node TEXT="小分子及抗体类新药研发平台授权等" ID="f7d52947e88ec1d82d0fdf2f75213d64" STYLE="fork">
              <node TEXT="小分子及抗体类新药研发平台授权" ID="1fb2b3be24e97d2019353226bcfeba4f" STYLE="fork"/>
              <node TEXT="AI 驱动的药物选择平台授权" ID="b80118574c09c997d6c48eeb574c6f8e" STYLE="fork"/>
              <node TEXT="AI 平台用于大分子药物研发" ID="8638c2b3dfb8cde0dc15b3b974f6372e" STYLE="fork"/>
            </node>
          </node>
        </node>
      </node>
      <node TEXT="应用场景" ID="0c07f4e5ab989f30fa799a64e1f24f50" STYLE="fork">
        <node TEXT="健康管理" ID="33ac32076913800aa3e6223a40faf46f" STYLE="fork"/>
        <node TEXT="患者社区" ID="76e08784439dda9210eb902f50c5219e" STYLE="fork"/>
        <node TEXT="健康和疾病咨询" ID="13e1fcedbaaab5118ba6aedce422d5d3" STYLE="fork"/>
        <node TEXT="就诊挂号" ID="f2d964ec0cf1b835594f5b07dda76212" STYLE="fork"/>
        <node TEXT="就诊服务" ID="af2f8e87064f8bcfd5faacf4d1b4119d" STYLE="fork"/>
        <node TEXT="转诊服务" ID="f9fc12265104aaf8d795f67534231a3a" STYLE="fork"/>
        <node TEXT="诊后服务" ID="20c57478ec9d06000aa84aa4e0622ee4" STYLE="fork"/>
        <node TEXT="疾病诊断" ID="3c03a2924572efe9ce36f1e8115e73c1" STYLE="fork"/>
        <node TEXT="疾病治疗" ID="9620440d2714765278b0a2389cb6ae87" STYLE="fork"/>
        <node TEXT="康复治疗" ID="c93fd5386820fe9822a721571cc8e6ad" STYLE="fork"/>
        <node TEXT="疾病预防" ID="51cab647419b94b7548d7ff4993299f3" STYLE="fork"/>
        <node TEXT="中医科" ID="8fc2aaf1ef2d7eee114a86327afe21ad" STYLE="fork"/>
        <node TEXT="口腔科" ID="f4a510ae1eb73d5c329da6c465e20b6f" STYLE="fork"/>
        <node TEXT="眼科" ID="76be01a5884e1f8e3d2a40a02c7b4e85" STYLE="fork"/>
        <node TEXT="疼痛科" ID="48fa3a404d088e2213024460ad8e6c9e" STYLE="fork"/>
        <node TEXT="辅助科室" ID="6e3f0858f732f464edf434221b7cde62" STYLE="fork"/>
        <node TEXT="精神科" ID="526a54651aee36dcf285a158b1158021" STYLE="fork"/>
        <node TEXT="行政管理" ID="bcf4c03999ac1bb0ade5bb9d662821f2" STYLE="fork"/>
        <node TEXT="后勤支持" ID="7710e74d61c5adf8f6d23487b3f08779" STYLE="fork"/>
        <node TEXT="肿瘤" ID="b0e046b1dbea555225947bbda2fa9b2d" STYLE="fork"/>
        <node TEXT="心血管疾病" ID="b8edbe73c9041e3ae7bd7147811a7808" STYLE="fork"/>
        <node TEXT="感染性疾病" ID="c2ec1bae1d6e9d7795ccb74fc87ce5f8" STYLE="fork"/>
        <node TEXT="内分泌系统疾病" ID="990c658966c4358855f65ce656b3d64f" STYLE="fork"/>
        <node TEXT="代谢性疾病" ID="fc097a53bbbf3dc09ca833f19297be0a" STYLE="fork"/>
        <node TEXT="精神类疾病" ID="63b7c25d7e836aab8a6e3a6e611efc69" STYLE="fork"/>
        <node TEXT="神经系统疾病" ID="92362985d00ac6ff3dc5fa18ef436011" STYLE="fork"/>
        <node TEXT="呼吸系统疾病" ID="de29f00d57802ead09f08da522ee0eea" STYLE="fork"/>
        <node TEXT="血液系统疾病" ID="3c9d95877e64140757bb10fd3b21b0de" STYLE="fork"/>
        <node TEXT="消化系统疾病" ID="628416d0db580eedfebd6899393b2b5d" STYLE="fork"/>
        <node TEXT="眼部疾病" ID="66171da3519afb794fd87e108c32e7ef" STYLE="fork"/>
        <node TEXT="皮肤疾病" ID="98cce3c9c481e6dd9379911cfa8509f4" STYLE="fork"/>
        <node TEXT="生殖系统疾病" ID="2291f7628db1e95cbda37407488a0dd8" STYLE="fork"/>
        <node TEXT="罕见病" ID="9ab9cfbbf1132b4f97f64a920711e390" STYLE="fork"/>
        <node TEXT="泌尿系统疾病" ID="a76bd75f295d68f175a9d954a7eec72c" STYLE="fork"/>
        <node TEXT="慢性病" ID="63eb2fab9b9377201d7059561b11c376" STYLE="fork"/>
        <node TEXT="脑部疾病" ID="38cebbbf1303aca4c08875f12b41eba0" STYLE="fork"/>
        <node TEXT="运动系统疾病" ID="f6588912938576666d8f4d1ccb07691a" STYLE="fork"/>
        <node TEXT="骨科" ID="ab926d87ce21981bbbeed99af98411c4" STYLE="fork"/>
      </node>
      <node TEXT="产业链环节" ID="4871fd71592ae663a27d767bf384550a" STYLE="fork">
        <node TEXT="上游" ID="33993a605316ffad8b934973b530da21" STYLE="fork"/>
        <node TEXT="中游" ID="c7ee300adaab3bd8a0aca72b3a9642f9" STYLE="fork"/>
        <node TEXT="下游" ID="5e94f3064f8c1894d885cfbf42691e40" STYLE="fork"/>
      </node>
    </node>
  </node>
</map>