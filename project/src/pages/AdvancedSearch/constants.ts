// project/src/pages/AdvancedSearch/constants.ts

export interface FilterGroup {
  name: string;
  key: string;
  sourceType: "dictionary" | "static" | "tree" | "list" | "region"; // 数据来源类型
  sourceKey?: string; // 对应数据库的 group_code 或特定标识
  component?: "checkbox" | "treeSelect"; // 渲染组件类型
  options?: string[]; // 静态选项 (当 sourceType 为 static 时使用)
}

export interface FilterCategory {
  title: string;
  groups: FilterGroup[];
}

export const FILTER_CONFIG: FilterCategory[] = [
  {
    title: "行业与场景",
    groups: [
      {
        name: "行业分类",
        key: "industryCategory",
        sourceType: "tree",
        sourceKey: "industry",
        component: "treeSelect",
      },
      {
        name: "应用场景",
        key: "applicationScenario",
        sourceType: "list",
        sourceKey: "scenario",
      },
    ],
  },
  {
    title: "基本信息",
    groups: [
      {
        name: "成立年限",
        key: "estDate",
        sourceType: "dictionary",
        sourceKey: "EST_AGE",
      },
      {
        name: "注册资本",
        key: "regCapital",
        sourceType: "dictionary",
        sourceKey: "REG_CAPITAL",
      },
      {
        name: "实缴资本",
        key: "paidCapital",
        sourceType: "dictionary",
        sourceKey: "PAID_CAPITAL",
      },
      {
        name: "经营状态",
        key: "bizStatus",
        sourceType: "dictionary",
        sourceKey: "BIZ_STATUS",
      },
      {
        name: "企业类型",
        key: "entType",
        sourceType: "dictionary",
        sourceKey: "ENT_TYPE",
      },
      {
        name: "组织类型",
        key: "orgType",
        sourceType: "dictionary",
        sourceKey: "ORG_TYPE",
      },
      {
        name: "企业规模",
        key: "scale",
        sourceType: "dictionary",
        sourceKey: "ENT_SCALE",
      },
      {
        name: "分支机构",
        key: "branchStatus",
        sourceType: "dictionary",
        sourceKey: "BRANCH_STATUS",
      },
      {
        name: "地址信息",
        key: "addrInfo",
        sourceType: "dictionary",
        sourceKey: "ADDR_INFO",
      },
    ],
  },
  {
    title: "经营状况",
    groups: [
      {
        name: "员工人数",
        key: "staffRange",
        sourceType: "dictionary",
        sourceKey: "STAFF_RANGE",
      },
      {
        name: "参保人数",
        key: "insuredRange",
        sourceType: "dictionary",
        sourceKey: "INSURED_RANGE",
      },
      {
        name: "上市状态",
        key: "listingStatus",
        sourceType: "dictionary",
        sourceKey: "LISTING_STATUS",
      },
      {
        name: "规上企业",
        key: "aboveScale",
        sourceType: "dictionary",
        sourceKey: "ABOVE_SCALE",
      },
      {
        name: "联系方式",
        key: "contactType",
        sourceType: "dictionary",
        sourceKey: "CONTACT_TYPE",
      },
      {
        name: "空号过滤",
        key: "numberStatus",
        sourceType: "dictionary",
        sourceKey: "NUMBER_STATUS",
      },
      {
        name: "联系邮箱",
        key: "emailStatus",
        sourceType: "dictionary",
        sourceKey: "EMAIL_STATUS",
      },
      {
        name: "小微企业",
        key: "smallMicro",
        sourceType: "dictionary",
        sourceKey: "SMALL_MICRO",
      },
      {
        name: "变更信息",
        key: "changeInfo",
        sourceType: "dictionary",
        sourceKey: "CHANGE_INFO",
      },
      {
        name: "纳税人资质",
        key: "taxPayer",
        sourceType: "dictionary",
        sourceKey: "TAX_PAYER",
      },
      {
        name: "融资信息",
        key: "financing",
        sourceType: "dictionary",
        sourceKey: "FINANCING",
      },
      {
        name: "招投标",
        key: "bidding",
        sourceType: "dictionary",
        sourceKey: "BIDDING",
      },
      {
        name: "招聘",
        key: "recruitment",
        sourceType: "dictionary",
        sourceKey: "RECRUITMENT",
      },
      {
        name: "税务评级",
        key: "taxRating",
        sourceType: "dictionary",
        sourceKey: "TAX_RATING",
      },
      {
        name: "进出口",
        key: "importExport",
        sourceType: "dictionary",
        sourceKey: "IMPORT_EXPORT",
      },
      {
        name: "开户行",
        key: "bankType",
        sourceType: "dictionary",
        sourceKey: "BANK_TYPE",
      },
    ],
  },
  {
    title: "知识产权",
    groups: [
      {
        name: "专利类型",
        key: "patentType",
        sourceType: "dictionary",
        sourceKey: "PATENT_TYPE",
      },
      {
        name: "科技属性",
        key: "techAttr",
        sourceType: "dictionary",
        sourceKey: "TECH_ATTR",
      },
      {
        name: "资质证书",
        key: "certType",
        sourceType: "dictionary",
        sourceKey: "CERT_TYPE",
      },
      {
        name: "商标信息",
        key: "tmStatus",
        sourceType: "dictionary",
        sourceKey: "IP_STATUS_TRADEMARK",
      },
      {
        name: "专利信息",
        key: "patentStatus",
        sourceType: "dictionary",
        sourceKey: "IP_STATUS_PATENT",
      },
      {
        name: "作品著作权",
        key: "copyrightStatus",
        sourceType: "dictionary",
        sourceKey: "IP_STATUS_COPYRIGHT",
      },
      {
        name: "软件著作权",
        key: "softStatus",
        sourceType: "dictionary",
        sourceKey: "IP_STATUS_SOFTWARE",
      },
      {
        name: "高新技术",
        key: "highTechStatus",
        sourceType: "dictionary",
        sourceKey: "IP_STATUS_HIGH_TECH",
      },
      {
        name: "微信公众号",
        key: "wechatStatus",
        sourceType: "dictionary",
        sourceKey: "IP_STATUS_WECHAT",
      },
      {
        name: "标准制定",
        key: "standardStatus",
        sourceType: "dictionary",
        sourceKey: "IP_STATUS_STANDARD",
      },
      {
        name: "集成电路",
        key: "icStatus",
        sourceType: "dictionary",
        sourceKey: "IP_STATUS_IC",
      },
      {
        name: "建筑资质",
        key: "constStatus",
        sourceType: "dictionary",
        sourceKey: "IP_STATUS_CONST",
      },
      {
        name: "网址信息",
        key: "webStatus",
        sourceType: "dictionary",
        sourceKey: "IP_STATUS_WEB",
      },
      {
        name: "ICP备案",
        key: "icpStatus",
        sourceType: "dictionary",
        sourceKey: "IP_STATUS_ICP",
      },
      {
        name: "特许经营",
        key: "franchiseStatus",
        sourceType: "dictionary",
        sourceKey: "IP_STATUS_FRANCHISE",
      },
    ],
  },
  {
    title: "风险信息",
    groups: [
      {
        name: "失信被执行",
        key: "riskDishonest",
        sourceType: "dictionary",
        sourceKey: "RISK_DISHONEST",
      },
      {
        name: "动产抵押",
        key: "riskMortgage",
        sourceType: "dictionary",
        sourceKey: "RISK_MORTGAGE",
      },
      {
        name: "经营异常",
        key: "riskAbnormal",
        sourceType: "dictionary",
        sourceKey: "RISK_ABNORMAL",
      },
      {
        name: "法律文书",
        key: "riskLegal",
        sourceType: "dictionary",
        sourceKey: "RISK_LEGAL_DOC",
      },
      {
        name: "行政处罚",
        key: "riskPenalty",
        sourceType: "dictionary",
        sourceKey: "RISK_PENALTY",
      },
      {
        name: "破产重整",
        key: "riskBankruptcy",
        sourceType: "dictionary",
        sourceKey: "RISK_BANKRUPTCY",
      },
      {
        name: "清算信息",
        key: "riskLiquidation",
        sourceType: "dictionary",
        sourceKey: "RISK_LIQUIDATION",
      },
      {
        name: "环保处罚",
        key: "riskEnv",
        sourceType: "dictionary",
        sourceKey: "RISK_ENV_PENALTY",
      },
      {
        name: "股权冻结",
        key: "riskEquity",
        sourceType: "dictionary",
        sourceKey: "RISK_EQUITY_FREEZE",
      },
      {
        name: "被执行人",
        key: "riskExecutor",
        sourceType: "dictionary",
        sourceKey: "RISK_EXECUTOR",
      },
      {
        name: "限制高消费",
        key: "riskLimit",
        sourceType: "dictionary",
        sourceKey: "RISK_LIMIT_CONSUMPTION",
      },
    ],
  },
  {
    title: "街道地区",
    groups: [
      {
        name: "所属街道",
        key: "street",
        sourceType: "region",
        sourceKey: "street",
      },
      {
        name: "所属地区",
        key: "district", // 这里对应地区(Area)
        sourceType: "region",
        sourceKey: "area",
      },
    ],
  },
];
