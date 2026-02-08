// src/pages/SystemMgmt/Data/Tag/tagData.ts

export interface Dimension {
  id: string;
  name: string;
  desc: string;
  color: string;
  tagCount: number;
  usedCount: number;
  stats: {
    totalTags: number;
    usedTags: number;
    companyCount: number; // 覆盖企业数
    usageCount: number; // 总使用频次
    recentAdd: number; // 本月新增
  };
}

// 颜色映射：根据 dim1-dim7 分配不同颜色
const colors = [
  "#1890ff", // 蓝
  "#722ed1", // 紫
  "#52c41a", // 绿
  "#faad14", // 黄
  "#eb2f96", // 粉
  "#13c2c2", // 青
  "#f5222d", // 红
];

export const dimensions: Dimension[] = [
  {
    id: "dim1",
    name: "产业定位维度",
    desc: "描述企业在产业链中的位置、行业归属和业务聚焦度",
    color: colors[0],
    tagCount: 45,
    usedCount: 345,
    stats: {
      totalTags: 45,
      usedTags: 40,
      companyCount: 345,
      usageCount: 1250,
      recentAdd: 12,
    },
  },
  {
    id: "dim2",
    name: "创新实力维度",
    desc: "技术能力 + 资质认证 + 创新成果",
    color: colors[1],
    tagCount: 32,
    usedCount: 210,
    stats: {
      totalTags: 32,
      usedTags: 28,
      companyCount: 210,
      usageCount: 890,
      recentAdd: 5,
    },
  },
  {
    id: "dim3",
    name: "经营资质维度",
    desc: "企业经营所需的官方许可、质量认证、合规证明",
    color: colors[2],
    tagCount: 28,
    usedCount: 450,
    stats: {
      totalTags: 28,
      usedTags: 25,
      companyCount: 450,
      usageCount: 2100,
      recentAdd: 20,
    },
  },
  {
    id: "dim4",
    name: "业务场景维度",
    desc: "企业产品/服务在领域的应用场景（服务对象/阶段/领域/模式）",
    color: colors[3],
    tagCount: 56,
    usedCount: 180,
    stats: {
      totalTags: 56,
      usedTags: 30,
      companyCount: 180,
      usageCount: 560,
      recentAdd: 8,
    },
  },
  {
    id: "dim5",
    name: "资本实力维度",
    desc: "企业的资金状况、融资历程和资本运作能力",
    color: colors[4],
    tagCount: 24,
    usedCount: 320,
    stats: {
      totalTags: 24,
      usedTags: 24,
      companyCount: 320,
      usageCount: 980,
      recentAdd: 15,
    },
  },
  {
    id: "dim6",
    name: "区域特征维度",
    desc: "企业所在地理位置的相关特征（行政/功能/集聚度）",
    color: colors[5],
    tagCount: 18,
    usedCount: 510,
    stats: {
      totalTags: 18,
      usedTags: 18,
      companyCount: 510,
      usageCount: 1500,
      recentAdd: 30,
    },
  },
  {
    id: "dim7",
    name: "关联网络维度",
    desc: "企业在产业生态中的关系网络（集团/产业链/创新/资本）",
    color: colors[6],
    tagCount: 30,
    usedCount: 150,
    stats: {
      totalTags: 30,
      usedTags: 12,
      companyCount: 150,
      usageCount: 420,
      recentAdd: 2,
    },
  },
];

// 模拟层级数据 (以产业定位维度为例)
export const mockTreeData = [
  {
    title: "行业大类",
    key: "L1-1",
    children: [
      {
        title: "数字医疗",
        key: "L2-1",
        children: [
          {
            title: "上游：技术/设备",
            key: "L3-1",
            children: [
              { title: "单一业务聚焦", key: "L4-1", isLeaf: true },
              { title: "多元化业务", key: "L4-2", isLeaf: true },
            ],
          },
          {
            title: "中游：服务/平台",
            key: "L3-2",
            isLeaf: true,
          },
        ],
      },
      {
        title: "生物医药",
        key: "L2-2",
        isLeaf: true,
      },
    ],
  },
  {
    title: "产业赛道",
    key: "L1-2",
    children: [
      { title: "AI辅助诊断", key: "L2-3", isLeaf: true },
      { title: "远程医疗", key: "L2-4", isLeaf: true },
    ],
  },
];

// 模拟标签列表
export const mockTagList = [
  { name: "数字医疗", usage: 128, coverage: 85 },
  { name: "医疗信息化", usage: 96, coverage: 65 },
  { name: "AI辅助诊断", usage: 84, coverage: 45 },
  { name: "互联网医院", usage: 72, coverage: 38 },
  { name: "远程监护", usage: 65, coverage: 32 },
  { name: "健康大数据", usage: 55, coverage: 28 },
  { name: "康复机器人", usage: 42, coverage: 20 },
  { name: "基因检测", usage: 38, coverage: 18 },
  { name: "微创手术", usage: 30, coverage: 15 },
  { name: "智能穿戴", usage: 25, coverage: 12 },
];

// 模拟企业列表
export const mockCompanyList = [
  {
    id: 1,
    name: "北京康健医疗科技有限公司",
    domain: "数字医疗",
    tags: ["数字医疗", "AI辅助诊断"],
    lastUsed: "2026-02-08",
  },
  {
    id: 2,
    name: "朝阳数字健康研究院",
    domain: "科研机构",
    tags: ["医疗信息化", "大数据"],
    lastUsed: "2026-02-07",
  },
  {
    id: 3,
    name: "智慧康养云平台",
    domain: "智慧养老",
    tags: ["互联网医院", "远程监护"],
    lastUsed: "2026-02-06",
  },
  {
    id: 4,
    name: "未来生物制药股份",
    domain: "生物医药",
    tags: ["基因检测", "靶向药"],
    lastUsed: "2026-02-05",
  },
  {
    id: 5,
    name: "仁和智能器械",
    domain: "医疗器械",
    tags: ["康复机器人", "微创手术"],
    lastUsed: "2026-02-01",
  },
];
