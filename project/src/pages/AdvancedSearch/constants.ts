// project/src/pages/AdvancedSearch/constants.ts

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterGroup {
  name: string; // 例如：成立年限
  key: string; // 对应后端字段或逻辑key
  options: string[]; // 简化处理，直接用字符串数组，选中即为值
}

export interface FilterCategory {
  title: string; // 例如：基本信息
  groups: FilterGroup[];
}

export const FILTER_CONFIG: FilterCategory[] = [
  {
    title: "基本信息",
    groups: [
      {
        name: "成立年限",
        key: "establishmentDate",
        options: ["1 年内", "1-5 年", "5-10 年", "10-15 年", "15 年以上"],
      },
      {
        name: "注册资本",
        key: "registeredCapital",
        options: [
          "0-100 万",
          "100-200 万",
          "200-500 万",
          "500-1000 万",
          "1000 万以上",
        ],
      },
      {
        name: "实缴资本",
        key: "paidInCapital",
        options: ["无实缴资本", "0-100 万", "100-500 万", "500 万以上"],
      },
      {
        name: "经营状态",
        key: "businessStatus",
        options: ["存续", "注销", "吊销", "迁出", "停业"],
      },
      {
        name: "企业类型",
        key: "companyType",
        options: [
          "国有企业",
          "有限责任公司",
          "股份有限公司",
          "外商投资",
          "独角兽企业",
        ], // 节选
      },
      {
        name: "地址信息",
        key: "hasAddress",
        options: ["有企业地址", "无企业地址"],
      },
    ],
  },
  {
    title: "经营状况",
    groups: [
      {
        name: "员工人数",
        key: "staffCount",
        options: ["小于 50 人", "50-99 人", "100-499 人", "500 人以上"],
      },
      {
        name: "上市状态",
        key: "listingStatus",
        options: ["A 股", "港股", "美股", "新三板", "科创板"],
      },
      {
        name: "纳税人资质",
        key: "taxpayerType",
        options: ["一般纳税人", "小规模纳税人"],
      },
    ],
  },
  {
    title: "知识产权",
    groups: [
      {
        name: "专利类型",
        key: "patentType",
        options: ["发明公布", "发明授权", "实用新型", "外观设计"],
      },
      {
        name: "科技资质",
        key: "techQualification",
        options: ["高新技术企业", "科技型中小企业", "专精特新", "瞪羚企业"],
      },
      {
        name: "软件著作权",
        key: "hasSoftwareCopyright",
        options: ["有软件著作权", "无软件著作权"],
      },
    ],
  },
  {
    title: "风险信息",
    groups: [
      {
        name: "失信风险",
        key: "riskDishonest",
        options: ["有失信被执行", "无失信被执行"],
      },
      {
        name: "行政处罚",
        key: "riskPunishment",
        options: ["有行政处罚", "无行政处罚"],
      },
      {
        name: "经营异常",
        key: "riskAbnormal",
        options: ["有经营异常", "无经营异常"],
      },
    ],
  },
  {
    title: "街道地区",
    groups: [
      {
        name: "所属街道",
        key: "street",
        options: [
          "朝外街道",
          "劲松街道",
          "建外街道",
          "呼家楼街道",
          "八里庄街道",
          "三里屯街道",
          "望京街道",
          "亚运村街道",
          "奥运村街道",
        ],
      },
      {
        name: "所属地区",
        key: "district",
        options: [
          "高碑店地区",
          "将台地区",
          "太阳宫地区",
          "十八里店地区",
          "来广营地区",
        ],
      },
    ],
  },
];
