import React, { useState, useEffect } from "react";
import { Layout, Tabs, Empty, Spin, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import ReportActionButtons from "../../components/ReportActionButtons";
import EnterpriseOverviewTab from "./components/EnterpriseOverviewTab";
import EnterpriseRDTab from "./components/EnterpriseRDTab";
import EnterpriseMarketTab from "./components/EnterpriseMarketTab";
import EnterpriseQualificationTab from "./components/EnterpriseQualificationTab";
import EnterpriseHonorTab from "./components/EnterpriseHonorTab";
import EnterpriseProductTab from "./components/EnterpriseProductTab";

// --- 引入本地数据 ---
import companiesData from "../../assets/data_test/companies.json";
import tagsData from "../../assets/data_test/tags.json";

const { Content } = Layout;

// --- 视觉风格定义 ---
const COLORS = {
  primary: "#1890ff",
  riskHigh: "#ff4d4f",
  riskMedium: "#faad14",
  riskLow: "#52c41a",
  borderColor: "#f0f0f0",
};

const BORDER_STYLE = `1px solid ${COLORS.borderColor}`;

// --- 类型定义 ---
interface CompanyRaw {
  company_id: string;
  company_name: string;
  raw_variants?: string;
  registered_capital: number;
  establishment_date: string;
  is_high_tech: number;
  risk_score: number;
}

interface TagRaw {
  tag_id: string;
  tag_name: string;
  level: number;
  path: string;
}

// --- Mock 数据生成器 ---
const generateMockProfile = (company: CompanyRaw, allTags: TagRaw[]) => {
  if (!company) return null;

  const baseScore =
    60 +
    (company.is_high_tech ? 20 : 0) +
    Math.min(company.registered_capital / 100, 15);
  const totalScore = Math.min(Math.round(baseScore), 98);
  const matchedTag =
    allTags.find((t) => company.raw_variants?.includes(t.tag_name)) ||
    allTags[0];

  const creditCode = "91110105MA01XXXXXX";

  // 迁出风险数据模拟
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

  // 通用维度生成器
  const generateDimensions = (base: number) => [
    { name: "注册资本规模", weight: 30, score: Math.min(base + 10, 100) },
    { name: "持续经营时长", weight: 20, score: Math.min(base + 5, 100) },
    { name: "纳税信用等级", weight: 20, score: Math.min(base + 15, 100) },
    { name: "社保缴纳人数", weight: 30, score: Math.min(base - 5, 100) },
    { name: "企业人员规模", weight: 10, score: Math.min(base, 100) },
    { name: "分支机构数量", weight: 10, score: Math.min(base - 10, 100) },
  ];

  return {
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
    metrics: {
      totalScore,
      rank: Math.floor(Math.random() * 50) + 1,
    },
    // 迁出风险数据
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
        {
          name: "用地空间限制",
          impact: "Low",
          desc: "现有办公面积趋于饱和",
        },
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
      basic: {
        score: 85,
        dimensions: generateDimensions(80),
      },
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
    tags: ["高新技术企业", "科技型中小企业", "A级纳税人"],
    honors: [
      { year: "2023", name: "北京市专精特新中小企业" },
      { year: "2022", name: "朝阳区高增长企业 Top20" },
      { year: "2021", name: "中关村金种子企业" },
    ],
  };
};

const EnterpriseProfile: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("profile"); // 控制子标签页切换
  const navigate = useNavigate(); // 使用 hook 获取导航方法

  // 初始化加载
  useEffect(() => {
    handleSearch("init");
  }, []);

  const handleSearch = (_value: string) => {
    setLoading(true);
    setTimeout(() => {
      const target =
        (companiesData as CompanyRaw[]).find((c) => c.is_high_tech === 1) ||
        companiesData[0];
      if (target) {
        setProfile(
          generateMockProfile(target as CompanyRaw, tagsData as TagRaw[]),
        );
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
          {/* 顶部工具栏 + 导航 Tabs */}
          <div
            style={{
              padding: "0 24px",
              borderBottom: BORDER_STYLE,
              display: "flex",
              justifyContent: "flex-end", // 整体靠右
              alignItems: "center",
              backgroundColor: "#fff",
              height: 64, // 固定高度
            }}
          >
            {/* 左侧：返回按钮 */}
            <div style={{ flex: 1 }}>
              <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(-1)}
                style={{ fontSize: 14 }}
              >
                返回
              </Button>
            </div>

            {/* 中间：Tabs 导航 (放在右侧与按钮平行) */}
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={[
                { key: "profile", label: "基本信息" },
                { key: "rd", label: "研发信息" },
                { key: "market", label: "市场信息" },
                { key: "qualification", label: "资质信息" },
                { key: "honor", label: "获奖信息" },
                { key: "product", label: "产品信息" },
              ]}
              style={{ marginRight: 24, marginBottom: -16 }} // 负边距抵消 Tabs 默认底部留白，使其垂直居中
              tabBarStyle={{ borderBottom: "none", marginBottom: 0 }}
            />

            {/* 右侧：操作按钮 */}
            {profile && (
              <div
                style={{
                  paddingLeft: 16,
                  borderLeft: "1px solid #f0f0f0",
                }}
              >
                <ReportActionButtons
                  reportTitle={`${profile.baseInfo.name}企业画像报告`}
                  targetId="enterprise-report-content"
                />
              </div>
            )}
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "100px 0" }}>
              <Spin size="large" tip="企业全息数据加载中..." />
            </div>
          ) : (
            <div id="enterprise-report-content">
              {/* 根据 ActiveTab 渲染不同内容 */}
              {activeTab === "profile" && (
                <EnterpriseOverviewTab profile={profile} />
              )}
              {activeTab === "rd" && <EnterpriseRDTab />}
              {activeTab === "market" && <EnterpriseMarketTab />}
              {activeTab === "qualification" && <EnterpriseQualificationTab />}
              {activeTab === "honor" && <EnterpriseHonorTab />}
              {activeTab === "product" && <EnterpriseProductTab />}
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
