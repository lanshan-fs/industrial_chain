import React, { useState, useEffect } from "react";
import {
  Layout,
  Row,
  Col,
  Typography,
  Space,
  Tag,
  Avatar,
  Descriptions,
  Table,
  Statistic,
  Empty,
  Divider,
  Progress,
  Timeline,
  Alert,
  Spin,
  Grid,
  Tabs,
  Card,
  List,
} from "antd";
import {
  GlobalOutlined,
  EnvironmentOutlined,
  BankOutlined,
  ExperimentOutlined,
  ThunderboltOutlined,
  UserOutlined,
  TrophyOutlined,
  RocketOutlined,
  SafetyCertificateOutlined,
  ShopOutlined,
  FileProtectOutlined,
  WarningOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import { Radar } from "@ant-design/plots";
import dayjs from "dayjs";

import ReportActionButtons from "../../components/ReportActionButtons";

import companiesData from "../../assets/data/companies.json";
import tagsData from "../../assets/data/tags.json";

const { Content } = Layout;
const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

// --- 视觉风格定义 ---
const COLORS = {
  primary: "#1890ff",
  gold: "#faad14",
  green: "#52c41a",
  bg: "#fff",
  borderColor: "#f0f0f0",
  textSecondary: "#666",
  riskHigh: "#ff4d4f",
  riskMedium: "#faad14",
  riskLow: "#52c41a",
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

// --- 图表配置 ---
const MAIN_RADAR_CONFIG = (data: any[]) => ({
  data,
  xField: "item",
  yField: "score",
  area: {
    style: { fill: "l(90) 0:#1890ff 1:rgba(24,144,255,0.1)", fillOpacity: 0.4 },
  },
  line: { style: { stroke: "#1890ff", lineWidth: 2 } },
  point: {
    size: 3,
    shape: "circle",
    style: { fill: "#fff", stroke: "#1890ff", lineWidth: 2 },
  },
  scale: { y: { min: 0, max: 100, tickCount: 5 } },
  axis: { x: { grid: { line: { style: { stroke: "#eee" } } } } },
  height: 220, // 稍微调小一点以适应布局
});

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
  const riskVal = company.risk_score || 40; // 这里的 risk_score 在原始数据中似乎代表风险分数
  // 假设 risk_score 越高风险越高
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
  const screens = useBreakpoint();
  const isMobile = !screens.md;

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

  // --- 渲染子模型卡片 (优化版：复用 IndustryProfile 的设计但调整字段) ---
  const renderSubModelCard = (
    title: string,
    icon: React.ReactNode,
    modelData: any,
    color: string,
    hasRightBorder: boolean = true,
  ) => {
    const columns: any[] = [
      {
        title: "评分维度",
        dataIndex: "name",
        ellipsis: true,
        align: "left",
        render: (t: string) => <Text style={{ fontSize: 13 }}>{t}</Text>,
      },
      {
        title: "权重",
        dataIndex: "weight",
        width: 80, // 增加宽度以容纳排序图标
        align: "center",
        sorter: (a: any, b: any) => a.weight - b.weight, // 添加权重排序
        render: (t: number) => <Tag style={{ marginRight: 0 }}>{t}%</Tag>,
      },
      {
        title: "得分",
        dataIndex: "score",
        width: 80, // 增加宽度以容纳排序图标
        align: "center",
        sorter: (a: any, b: any) => a.score - b.score, // 添加得分排序
        render: (s: number) => (
          <Text strong style={{ color: s < 60 ? "red" : color }}>
            {s}
          </Text>
        ),
      },
    ];

    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRight: hasRightBorder && !isMobile ? BORDER_STYLE : "none",
        }}
      >
        <div
          style={{
            padding: "16px 20px",
            borderBottom: BORDER_STYLE,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#fafafa",
          }}
        >
          <Space>
            {icon}
            <Text strong>{title}</Text>
          </Space>
          <Statistic
            value={modelData.score}
            valueStyle={{ color: color, fontWeight: "bold", fontSize: 18 }}
            suffix={<span style={{ fontSize: 12, color: "#999" }}>分(总)</span>}
          />
        </div>
        <div style={{ flex: 1, padding: 0 }}>
          <Table
            dataSource={modelData.dimensions}
            rowKey="name"
            pagination={false}
            size="small"
            columns={columns}
            scroll={{ y: 250 }} // 固定高度
            bordered={false}
          />
        </div>
      </div>
    );
  };

  // --- 渲染各子标签页内容 ---

  // 1. 全景画像 (原核心内容)
  const renderOverviewTab = () => (
    <>
      {/* 区块一：企业名片 */}
      <div style={{ padding: 24, borderBottom: BORDER_STYLE }}>
        <Row gutter={24} align="middle">
          <Col flex="100px">
            <Avatar
              shape="square"
              size={88}
              style={{
                backgroundColor: COLORS.primary,
                fontSize: 32,
              }}
            >
              {profile.baseInfo.name[0]}
            </Avatar>
          </Col>
          <Col flex="auto">
            <Space direction="vertical" size={6} style={{ width: "100%" }}>
              <Space align="center">
                <Title level={3} style={{ margin: 0 }}>
                  {profile.baseInfo.name}
                </Title>
                <Tag color="success">在业</Tag>
                <Tag color="blue">{profile.baseInfo.type}</Tag>
              </Space>
              <Space size={24} style={{ color: COLORS.textSecondary }}>
                <span>
                  <UserOutlined /> 法人：
                  {profile.baseInfo.legalPerson}
                </span>
                <span>
                  <EnvironmentOutlined /> 地址：
                  {profile.baseInfo.address}
                </span>
                <span>
                  <GlobalOutlined /> 官网：{profile.baseInfo.website}
                </span>
              </Space>
              <Space style={{ marginTop: 8 }}>
                {profile.tags.map((t: string) => (
                  <Tag key={t} color="geekblue">
                    {t}
                  </Tag>
                ))}
              </Space>
            </Space>
          </Col>
          <Col
            flex="200px"
            style={{
              textAlign: "right",
              borderLeft: "1px solid #f0f0f0",
              paddingLeft: 24,
            }}
          >
            <Statistic
              title="综合健康分"
              value={profile.metrics.totalScore}
              valueStyle={{
                color: COLORS.primary,
                fontSize: 36,
                fontWeight: "bold",
              }}
              suffix={
                <span style={{ fontSize: 14, color: "#999" }}>/ 100</span>
              }
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                更新于：{dayjs().format("YYYY-MM-DD")}
              </Text>
            </div>
          </Col>
        </Row>
      </div>

      {/* 区块二：工商信息全景 + 资质荣誉 */}
      <Row gutter={0} style={{ borderBottom: BORDER_STYLE }}>
        <Col
          xs={24}
          lg={16}
          style={{ borderRight: !isMobile ? BORDER_STYLE : "none" }}
        >
          <div
            style={{
              padding: "12px 24px",
              borderBottom: BORDER_STYLE,
              backgroundColor: "#fafafa",
            }}
          >
            <Text strong>工商信息全景</Text>
          </div>
          <div style={{ padding: 24 }}>
            <Descriptions
              column={2}
              bordered
              size="small"
              labelStyle={{ width: 160, background: "#fafafa" }}
            >
              <Descriptions.Item label="统一社会信用代码">
                {profile.baseInfo.creditCode}
              </Descriptions.Item>
              <Descriptions.Item label="纳税人识别号">
                {profile.baseInfo.taxId}
              </Descriptions.Item>
              <Descriptions.Item label="注册资本">
                {profile.baseInfo.regCapital} 万元
              </Descriptions.Item>
              <Descriptions.Item label="实缴资本">
                {profile.baseInfo.paidInCapital} 万元
              </Descriptions.Item>
              <Descriptions.Item label="成立日期">
                {profile.baseInfo.establishDate}
              </Descriptions.Item>
              <Descriptions.Item label="企业类型">
                {profile.baseInfo.type}
              </Descriptions.Item>
              <Descriptions.Item label="所属行业">
                {profile.baseInfo.industry}
              </Descriptions.Item>
              <Descriptions.Item label="参保人数">124 人</Descriptions.Item>
              <Descriptions.Item label="注册地址" span={2}>
                {profile.baseInfo.address}
              </Descriptions.Item>
              <Descriptions.Item label="经营范围" span={2}>
                {profile.baseInfo.scope}
              </Descriptions.Item>
            </Descriptions>
          </div>
        </Col>
        <Col xs={24} lg={8}>
          <div
            style={{
              padding: "12px 24px",
              borderBottom: BORDER_STYLE,
              display: "flex",
              justifyContent: "space-between",
              backgroundColor: "#fafafa",
            }}
          >
            <Text strong>资质与荣誉</Text>
            <a href="#">更多</a>
          </div>
          <div style={{ padding: 24 }}>
            <Timeline
              items={profile.honors.map((h: any) => ({
                color: "blue",
                children: (
                  <>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {h.year}
                    </Text>
                    <div style={{ fontWeight: 500 }}>{h.name}</div>
                  </>
                ),
              }))}
            />
            <Divider style={{ margin: "12px 0" }} />
            <Title level={5} style={{ fontSize: 14, marginBottom: 8 }}>
              企业标签
            </Title>
            <Space size={[0, 8]} wrap>
              {profile.tags.map((t: string) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </Space>
          </div>
        </Col>
      </Row>

      {/* 区块三：企业综合评估 */}
      <div style={{ borderBottom: BORDER_STYLE }}>
        <div
          style={{
            padding: "12px 24px",
            borderBottom: BORDER_STYLE,
            backgroundColor: "#fafafa",
          }}
        >
          <Text strong>企业综合评估</Text>
        </div>
        <div style={{ padding: 24 }}>
          <Row gutter={0}>
            {/* 左子区块：企业综合能力可视化 */}
            <Col
              xs={24}
              lg={14}
              style={{
                borderRight: !isMobile ? "1px solid #f0f0f0" : "none",
                paddingRight: !isMobile ? 24 : 0,
              }}
            >
              <Title level={5} style={{ fontSize: 14, marginBottom: 24 }}>
                企业综合能力可视化
              </Title>
              <Row gutter={24} align="middle">
                <Col xs={24} md={10} style={{ textAlign: "center" }}>
                  <Progress
                    type="dashboard"
                    percent={profile.metrics.totalScore}
                    strokeColor={COLORS.primary}
                    width={180}
                    format={(percent) => (
                      <div style={{ color: COLORS.primary }}>
                        <div style={{ fontSize: 32 }}>{percent}</div>
                        <div style={{ fontSize: 14, color: "#999" }}>
                          综合得分
                        </div>
                      </div>
                    )}
                  />
                  <div style={{ marginTop: 16 }}>
                    <Alert
                      message="经营稳健，潜力巨大"
                      type="success"
                      showIcon
                      style={{
                        display: "inline-flex",
                        fontSize: 12,
                        padding: "4px 12px",
                      }}
                    />
                  </div>
                </Col>
                <Col xs={24} md={14}>
                  <Radar {...MAIN_RADAR_CONFIG(profile.overallRadar)} />
                </Col>
              </Row>
            </Col>

            {/* 右子区块：企业迁出风险 */}
            <Col xs={24} lg={10} style={{ paddingLeft: !isMobile ? 24 : 0 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <Title level={5} style={{ fontSize: 14, margin: 0 }}>
                  企业迁出风险
                </Title>
                <WarningOutlined style={{ color: "#faad14" }} />
              </div>

              <div
                style={{
                  background: "#fff",
                  borderRadius: 4,
                  padding: "16px 0",
                }}
              >
                <Row align="middle" gutter={16} style={{ marginBottom: 20 }}>
                  <Col>
                    <Text type="secondary">当前风险等级：</Text>
                  </Col>
                  <Col>
                    <Tag
                      color={profile.migrationRisk.color}
                      style={{
                        fontSize: 14,
                        padding: "4px 12px",
                        fontWeight: "bold",
                      }}
                    >
                      {profile.migrationRisk.level}风险
                    </Tag>
                  </Col>
                  <Col>
                    <Progress
                      percent={profile.migrationRisk.score}
                      size="small"
                      status="normal"
                      strokeColor={profile.migrationRisk.color}
                      style={{ width: 100 }}
                      showInfo={false}
                    />
                  </Col>
                </Row>

                <Text strong style={{ fontSize: 12, color: "#999" }}>
                  关键风险因素 (Top 5)
                </Text>
                <List
                  size="small"
                  split={false}
                  dataSource={profile.migrationRisk.factors}
                  renderItem={(item: any, index: number) => (
                    <List.Item
                      style={{
                        padding: "8px 0",
                        borderBottom: "1px dashed #f0f0f0",
                      }}
                    >
                      <Space style={{ width: "100%" }}>
                        <Avatar
                          size={18}
                          style={{
                            backgroundColor: index < 3 ? "#ffccc7" : "#f0f0f0",
                            color: index < 3 ? "#cf1322" : "#666",
                            fontSize: 10,
                          }}
                        >
                          {index + 1}
                        </Avatar>
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Text style={{ fontSize: 13 }}>{item.name}</Text>
                            <Space size={4}>
                              {item.impact === "High" && (
                                <RiseOutlined
                                  style={{
                                    color: COLORS.riskHigh,
                                    fontSize: 10,
                                  }}
                                />
                              )}
                              <Text type="secondary" style={{ fontSize: 12 }}>
                                {item.desc}
                              </Text>
                            </Space>
                          </div>
                        </div>
                      </Space>
                    </List.Item>
                  )}
                />
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {/* 区块四：三大评分模型 (优化后：复用 IndustryProfile 组件风格) */}
      <Row gutter={0} style={{ borderBottom: BORDER_STYLE }}>
        <Col xs={24} md={8}>
          {renderSubModelCard(
            "企业基础评分",
            <BankOutlined style={{ color: COLORS.gold }} />,
            profile.models.basic,
            COLORS.gold,
            true,
          )}
        </Col>
        <Col xs={24} md={8}>
          {renderSubModelCard(
            "科技属性评分",
            <ExperimentOutlined style={{ color: COLORS.primary }} />,
            profile.models.tech,
            COLORS.primary,
            true,
          )}
        </Col>
        <Col xs={24} md={8}>
          {renderSubModelCard(
            "企业能力评分",
            <ThunderboltOutlined style={{ color: COLORS.green }} />,
            profile.models.ability,
            COLORS.green,
            false,
          )}
        </Col>
      </Row>
    </>
  );

  // 通用 Mock 列表渲染器
  const renderMockList = (
    title: string,
    icon: React.ReactNode,
    columns: any[],
    data: any[],
  ) => (
    <Card
      bordered={false}
      title={
        <Space>
          {icon}
          {title}
        </Space>
      }
      style={{ margin: 24 }}
    >
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        bordered
        size="middle"
      />
    </Card>
  );

  // 2. 研发信息 Mock 数据
  const renderRDTab = () =>
    renderMockList(
      "研发创新信息",
      <RocketOutlined />,
      [
        { title: "专利名称", dataIndex: "name", width: 300 },
        { title: "专利类型", dataIndex: "type" },
        { title: "申请日期", dataIndex: "date" },
        {
          title: "当前状态",
          dataIndex: "status",
          render: (t: string) => <Tag color="blue">{t}</Tag>,
        },
      ],
      [
        {
          key: 1,
          name: "一种基于AI的图像识别算法",
          type: "发明专利",
          date: "2023-05-12",
          status: "实质审查",
        },
        {
          key: 2,
          name: "智能数据分析系统V1.0",
          type: "软件著作权",
          date: "2023-01-10",
          status: "已登记",
        },
        {
          key: 3,
          name: "一种服务器散热装置",
          type: "实用新型",
          date: "2022-11-05",
          status: "已授权",
        },
        {
          key: 4,
          name: "企业服务平台界面设计",
          type: "外观设计",
          date: "2022-08-20",
          status: "已授权",
        },
      ],
    );

  // 3. 市场信息 Mock 数据
  const renderMarketTab = () =>
    renderMockList(
      "市场招投标与竞品信息",
      <ShopOutlined />,
      [
        { title: "项目名称", dataIndex: "project", width: 400 },
        { title: "采购方", dataIndex: "buyer" },
        { title: "中标金额 (万元)", dataIndex: "amount" },
        { title: "中标日期", dataIndex: "date" },
      ],
      [
        {
          key: 1,
          project: "2023年朝阳区智慧城市大数据平台采购项目",
          buyer: "朝阳区数据局",
          amount: "580.00",
          date: "2023-11-15",
        },
        {
          key: 2,
          project: "某大型国企企业画像系统建设",
          buyer: "某集团有限公司",
          amount: "220.50",
          date: "2023-09-02",
        },
        {
          key: 3,
          project: "产业链数据分析服务采购",
          buyer: "某产业园区管委会",
          amount: "150.00",
          date: "2023-06-20",
        },
      ],
    );

  // 4. 资质信息 Mock 数据
  const renderQualificationTab = () =>
    renderMockList(
      "企业资质认证",
      <SafetyCertificateOutlined />,
      [
        { title: "资质名称", dataIndex: "name", width: 300 },
        { title: "发证机关", dataIndex: "authority" },
        { title: "有效期至", dataIndex: "expiry" },
        { title: "证书编号", dataIndex: "code" },
      ],
      [
        {
          key: 1,
          name: "高新技术企业证书",
          authority: "北京市科学技术委员会",
          expiry: "2025-10-10",
          code: "GR20221100XXXX",
        },
        {
          key: 2,
          name: "ISO9001质量管理体系认证",
          authority: "中国质量认证中心",
          expiry: "2024-05-20",
          code: "00120Q3XXXXR0M",
        },
        {
          key: 3,
          name: "信息安全管理体系认证",
          authority: "中国网络安全审查技术中心",
          expiry: "2024-12-31",
          code: "ISMS-2021-XXXX",
        },
      ],
    );

  // 5. 获奖信息 Mock 数据
  const renderHonorTab = () =>
    renderMockList(
      "企业荣誉奖项",
      <TrophyOutlined />,
      [
        { title: "奖项名称", dataIndex: "name", width: 400 },
        { title: "颁发机构", dataIndex: "org" },
        { title: "获奖年度", dataIndex: "year" },
        {
          title: "级别",
          dataIndex: "level",
          render: (t: string) => <Tag color="gold">{t}</Tag>,
        },
      ],
      [
        {
          key: 1,
          name: "北京市专精特新中小企业",
          org: "北京市经济和信息化局",
          year: "2023",
          level: "省市级",
        },
        {
          key: 2,
          name: "2022年度朝阳区高增长企业Top20",
          org: "朝阳区人民政府",
          year: "2022",
          level: "区级",
        },
        {
          key: 3,
          name: "中国大数据产业年度创新企业",
          org: "中国电子信息产业发展研究院",
          year: "2021",
          level: "国家级协会",
        },
      ],
    );

  // 6. 产品信息 Mock 数据
  const renderProductTab = () =>
    renderMockList(
      "主要产品与服务",
      <FileProtectOutlined />,
      [
        { title: "产品名称", dataIndex: "name", width: 250 },
        { title: "产品类型", dataIndex: "type" },
        { title: "应用领域", dataIndex: "field" },
        { title: "简介", dataIndex: "desc" },
      ],
      [
        {
          key: 1,
          name: "产业大脑SaaS平台",
          type: "软件平台",
          field: "政府/园区",
          desc: "提供产业链分析、企业画像、招商引资等功能的大数据平台。",
        },
        {
          key: 2,
          name: "企业信用风险评估系统",
          type: "数据服务",
          field: "金融机构",
          desc: "基于多维数据的企业信用评分模型。",
        },
        {
          key: 3,
          name: "智慧园区管理系统",
          type: "解决方案",
          field: "产业园区",
          desc: "集园区资产管理、企业服务、安防监控于一体的综合解决方案。",
        },
      ],
    );

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
            {/* 左侧留空或后续扩展 */}
            <div style={{ flex: 1 }}></div>

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
              <div style={{ paddingLeft: 16, borderLeft: "1px solid #f0f0f0" }}>
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
              {activeTab === "profile" && renderOverviewTab()}
              {activeTab === "rd" && renderRDTab()}
              {activeTab === "market" && renderMarketTab()}
              {activeTab === "qualification" && renderQualificationTab()}
              {activeTab === "honor" && renderHonorTab()}
              {activeTab === "product" && renderProductTab()}
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
