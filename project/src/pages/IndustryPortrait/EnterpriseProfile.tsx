import React, { useState, useEffect } from "react";
import { Layout, Empty, Spin, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import ReportActionButtons from "../../components/ReportActionButtons";
import EnterpriseOverviewTab from "./components/EnterpriseOverviewTab";

// --- 引入本地数据 ---
import companiesData from "../../assets/data/companies.json";
import tagsData from "../../assets/data/tags.json";

const { Content } = Layout;

// --- 视觉风格定义 (保持不变) ---
const COLORS = {
  primary: "#1890ff",
  riskHigh: "#ff4d4f",
  riskMedium: "#faad14",
  riskLow: "#52c41a",
  borderColor: "#f0f0f0",
};

const BORDER_STYLE = `1px solid ${COLORS.borderColor}`;

// ... (保持原有的 Interface 定义不变)

// --- 标签池 (保持不变) ---
const TAG_POOL = [
  "高新技术企业",
  "科技型中小企业",
  "专精特新",
  "专精特新小巨人",
  "独角兽企业",
  "瞪羚企业",
  "A级纳税人",
  "中关村金种子",
  "ISO9001认证",
  "知识产权优势企业",
  "绿色工厂",
  "智能制造标杆",
  "企业技术中心",
  "博士后工作站",
  "上市后备企业",
  "文明单位",
];

// --- Mock 数据生成器 (仅追加新字段) ---
const generateMockProfile = (company: any, allTags: any[]) => {
  if (!company) return null;

  // ... (保持原有的 baseScore, totalScore 计算逻辑不变)
  const baseScore =
    60 +
    (company.is_high_tech ? 20 : 0) +
    Math.min(company.registered_capital / 100, 15);
  const totalScore = Math.min(Math.round(baseScore), 98);
  const matchedTag =
    allTags.find((t) => company.raw_variants?.includes(t.tag_name)) ||
    allTags[0];
  const creditCode = "91110105MA01XXXXXX";

  // ... (保持原有的 riskVal, migrationRiskLevel 计算逻辑不变)
  const riskVal = company.risk_score || 40;
  let migrationRiskLevel = "低";
  let migrationRiskColor = COLORS.riskLow;
  if (riskVal > 60) {
    migrationRiskLevel = "中";
    migrationRiskColor = COLORS.riskMedium;
  }
  if (riskVal > 80) {
    migrationRiskLevel = "高";
    migrationRiskColor = COLORS.riskHigh;
  }

  // ... (保持原有的 generateDimensions 逻辑不变)
  const generateDimensions = (base: number) => [
    { name: "注册资本规模", weight: 30, score: Math.min(base + 10, 100) },
    { name: "持续经营时长", weight: 20, score: Math.min(base + 5, 100) },
    { name: "纳税信用等级", weight: 20, score: Math.min(base + 15, 100) },
    { name: "社保缴纳人数", weight: 30, score: Math.min(base - 5, 100) },
    { name: "企业人员规模", weight: 10, score: Math.min(base, 100) },
    { name: "分支机构数量", weight: 10, score: Math.min(base - 10, 100) },
  ];

  const randomTags = [...TAG_POOL]
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.floor(Math.random() * 5) + 6);

  return {
    // --- 原有字段保持原封不动 ---
    baseInfo: {
      id: company.company_id,
      name: company.company_name,
      legalPerson: ["张伟", "李强", "王芳"][Math.floor(Math.random() * 3)],
      status: "在业",
      establishDate: company.establishment_date,
      regCapital: company.registered_capital,
      paidInCapital: company.registered_capital,
      address: `北京市朝阳区产业园 ${Math.floor(Math.random() * 20)} 号楼`,
      website: `www.${company.company_id.substring(0, 6)}.com`,
      type: "有限责任公司(自然人投资或控股)",
      creditCode: creditCode,
      taxId: creditCode,
      industry: matchedTag?.path?.split(" / ")[0] || "科技推广和应用服务业",
      scope:
        "技术开发、技术推广、技术转让、技术咨询、技术服务；销售自行开发的产品；计算机系统服务；基础软件服务；应用软件服务。",
    },
    metrics: { totalScore, rank: Math.floor(Math.random() * 50) + 1 },
    migrationRisk: {
      level: migrationRiskLevel,
      score: riskVal,
      color: migrationRiskColor,
      factors: [
        {
          name: "周边办公租金上涨",
          impact: "High",
          desc: "租金成本同比上涨 15%",
        },
        {
          name: "核心人才流失风险",
          impact: "Medium",
          desc: "研发人员流动率略高",
        },
        {
          name: "产业政策适配度",
          impact: "Medium",
          desc: "部分优惠政策即将到期",
        },
        {
          name: "业务市场区域偏移",
          impact: "Low",
          desc: "主要客户群体向外区迁移",
        },
        { name: "用地空间限制", impact: "Low", desc: "现有办公面积趋于饱和" },
      ],
    },
    overallRadar: [
      { item: "基础实力", score: 85 },
      { item: "科技属性", score: company.is_high_tech ? 95 : 60 },
      { item: "专业能力", score: 78 },
      { item: "成长潜力", score: 88 },
      { item: "合规风险", score: 100 - company.risk_score },
    ],
    models: {
      basic: { score: 85, dimensions: generateDimensions(80) },
      tech: {
        score: company.is_high_tech ? 92 : 65,
        dimensions: [
          { name: "发明专利数量", weight: 30, score: 90 },
          { name: "研发人员占比", weight: 20, score: 85 },
          {
            name: "高新企业认证",
            weight: 20,
            score: company.is_high_tech ? 100 : 0,
          },
          { name: "研发投入强度", weight: 15, score: 88 },
          { name: "科技奖项数量", weight: 15, score: 75 },
          { name: "产学研合作", weight: 10, score: 80 },
        ],
      },
      ability: {
        score: 78,
        dimensions: [
          { name: "专精特新认证", weight: 40, score: 80 },
          { name: "行业标准制定", weight: 20, score: 70 },
          { name: "政府奖项", weight: 20, score: 85 },
          { name: "品牌知名度", weight: 10, score: 75 },
          { name: "市场占有率", weight: 10, score: 82 },
        ],
      },
    },
    tags: randomTags,
    honors: [
      { year: "2023", name: "北京市专精特新中小企业" },
      { year: "2022", name: "朝阳区高增长企业 Top20" },
      { year: "2021", name: "中关村金种子企业" },
    ],

    // --- 【新增】新版六大标签页所需数据 (Mock) ---
    basicInfoData: {
      shareholders: [
        {
          key: 1,
          name: "北京海游友科技有限公司",
          ratio: "45%",
          capital: "19928.57万",
        },
        {
          key: 2,
          name: "北京迅翼科技发展有限公司",
          ratio: "35%",
          capital: "15500.00万",
        },
        {
          key: 3,
          name: "中信证券投资有限公司",
          ratio: "10%",
          capital: "4428.57万",
        },
      ],
      keyPersonnel: [
        { key: 1, name: "严其亮", title: "执行董事" },
        { key: 2, name: "张玉", title: "监事" },
        { key: 3, name: "韩道成", title: "经理" },
      ],
      branches: [
        {
          key: 1,
          name: "北京雍禾医疗投资管理有限公司温州分公司",
          principal: "李某",
          date: "2018-05-12",
        },
        {
          key: 2,
          name: "北京雍禾医疗投资管理有限公司南宁分公司",
          principal: "王某",
          date: "2019-08-20",
        },
      ],
      changes: [
        {
          key: 1,
          date: "2023-11-15",
          item: "注册资本变更",
          before: "30000万",
          after: "44285.71万",
        },
        {
          key: 2,
          date: "2022-06-10",
          item: "投资人变更",
          before: "严其亮",
          after: "严其亮, 北京海游友科技有限公司...",
        },
      ],
      reports: [
        { key: 1, year: "2023年度报告", date: "2024-03-15" },
        { key: 2, year: "2022年度报告", date: "2023-04-20" },
      ],
      social: [
        {
          key: 1,
          year: "2023",
          pension: 219,
          unemployment: 219,
          medical: 219,
          injury: 219,
          maternity: 219,
        },
      ],
      related: [
        { key: 1, name: "上海雍禾医疗技术有限公司", relation: "全资子公司" },
      ],
    },
  };
};

// ... (EnterpriseProfile 组件代码保持不变)
const EnterpriseProfile: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const navigate = useNavigate();

  // 初始化加载
  useEffect(() => {
    handleSearch("init");
  }, []);

  const handleSearch = (_value: string) => {
    setLoading(true);
    setTimeout(() => {
      const target =
        (companiesData as any[]).find((c) => c.is_high_tech === 1) ||
        companiesData[0];
      if (target) {
        setProfile(generateMockProfile(target as any, tagsData as any[]));
      }
      setLoading(false);
    }, 600);
  };

  if (!profile && !loading)
    return (
      <Empty description="请输入企业名称搜索" style={{ marginTop: 100 }} />
    );

  return (
    <Layout style={{ minHeight: "100vh", background: "#fff" }}>
      <Content style={{ padding: 0, width: "100%" }}>
        <div style={{ maxWidth: "100%", margin: "0 auto" }}>
          {/* 顶部工具栏 */}
          <div
            style={{
              padding: "0 24px",
              borderBottom: BORDER_STYLE,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#fff",
              height: 64,
            }}
          >
            {/* 左侧：返回按钮 */}
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(-1)}
              style={{ fontSize: 14 }}
            >
              返回
            </Button>

            {/* 右侧：操作按钮 */}
            {profile && (
              <ReportActionButtons
                reportTitle={`${profile.baseInfo.name}企业画像报告`}
                targetId="enterprise-report-content"
              />
            )}
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "100px 0" }}>
              <Spin size="large" tip="企业全息数据加载中..." />
            </div>
          ) : (
            <div id="enterprise-report-content">
              <EnterpriseOverviewTab profile={profile} />
            </div>
          )}

          {/* 页脚 */}
          <div
            style={{
              textAlign: "center",
              padding: "24px 0",
              color: "#ccc",
              fontSize: 12,
              backgroundColor: "#f5f5f5",
            }}
          >
            - 朝阳区产业链洞察平台生成 -
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default EnterpriseProfile;
