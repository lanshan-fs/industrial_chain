import React, { useState, useEffect } from "react";
import {
  Layout,
  Button,
  Row,
  Col,
  Typography,
  Space,
  Tag,
  Avatar,
  Descriptions,
  Table,
  List,
  Statistic,
  Empty,
  Divider,
  Progress,
  Timeline,
  Alert,
  Spin,
  Grid,
} from "antd";
import {
  GlobalOutlined,
  EnvironmentOutlined,
  BankOutlined,
  ExperimentOutlined,
  ThunderboltOutlined,
  ClusterOutlined,
  UserOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";
import { Radar, DualAxes } from "@ant-design/plots";
import dayjs from "dayjs";

// --- 引入新封装的组件 ---
import ReportActionButtons from "../../components/ReportActionButtons";

// --- 引入本地数据 ---
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
  bg: "#fff", // 背景改为纯白
  borderColor: "#f0f0f0", // 统一边框颜色
  textSecondary: "#666",
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

// 1. 综合雷达图 (保持原样)
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
  height: 240,
});

// 2. 子模型图表：竖状折线 + 条形图 (新需求)
const SUB_MODEL_CHART_CONFIG = (data: any[], color: string) => {
  return {
    data: [data, data],
    xField: "name",
    yField: ["score", "weight"],
    geometryOptions: [
      {
        geometry: "column",
        color: color,
        columnWidthRatio: 0.4,
      },
      {
        geometry: "line",
        color: "#595959", // 权重用深灰色折线
        lineStyle: { lineWidth: 2, lineDash: [4, 4] },
        point: {
          size: 3,
          shape: "circle",
          style: { fill: "#fff", stroke: "#595959" },
        },
      },
    ],
    legend: {
      position: "top-right",
      itemName: {
        formatter: (text: string) => (text === "score" ? "得分" : "权重"),
      },
    },
    meta: {
      score: { min: 0, max: 100, alias: "得分" },
      weight: { min: 0, max: 100, alias: "权重" },
    },
    xAxis: {
      label: {
        autoRotate: false,
        rotate: Math.PI / 2, // 竖直显示标签
        style: {
          fontSize: 10,
          textAlign: "start",
          textBaseline: "middle",
        },
        offset: 10,
      },
    },
    yAxis: {
      score: { min: 0, max: 100, tickCount: 5 },
      weight: { min: 0, max: 100, tickCount: 5, grid: null },
    },
    tooltip: {
      showMarkers: false,
      formatter: (datum: any) => {
        return {
          name: datum.score !== undefined ? "得分" : "权重",
          value: datum.score ?? datum.weight,
        };
      },
    },
    height: 240, // 调整高度以适应布局
    padding: [20, 20, 70, 30], // 底部留出空间给竖排文字
  };
};

// --- Mock 数据生成器 (保持原样) ---
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
    relations: {
      controller: "张伟 (占股 51%)",
      shareholders: [
        { name: "张伟", role: "自然人股东", ratio: "51%" },
        { name: "北京某某投资中心", role: "企业法人", ratio: "30%" },
        { name: "李强", role: "自然人股东", ratio: "19%" },
      ],
      keyStaff: ["张伟 (执行董事)", "王芳 (监事)", "李强 (经理)"],
    },
  };
};

// --- TabsMock 组件 (保留原功能) ---
const TabsMock = ({ items }: { items: any[] }) => {
  const [active, setActive] = useState(items[0].key);
  return (
    <div>
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid #f0f0f0",
          marginBottom: 12,
        }}
      >
        {items.map((i) => (
          <div
            key={i.key}
            onClick={() => setActive(i.key)}
            style={{
              padding: "8px 16px",
              cursor: "pointer",
              color: active === i.key ? "#1890ff" : "rgba(0,0,0,0.65)",
              borderBottom: active === i.key ? "2px solid #1890ff" : "none",
              fontWeight: active === i.key ? 500 : 400,
            }}
          >
            {i.label}
          </div>
        ))}
      </div>
      {items.find((i) => i.key === active)?.content}
    </div>
  );
};

const EnterpriseProfile: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  // 初始化加载
  useEffect(() => {
    handleSearch("init");
  }, []);

  const handleSearch = (_value: string) => {
    setLoading(true);
    setTimeout(() => {
      // 模拟搜索
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

  // 渲染子模型区块 (优化后：上图下表)
  const renderSubModelSection = (
    title: string,
    icon: React.ReactNode,
    modelData: any,
    color: string,
    hasRightBorder: boolean,
  ) => (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRight: hasRightBorder && !isMobile ? BORDER_STYLE : "none",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "12px 20px",
          borderBottom: BORDER_STYLE,
          backgroundColor: "#fafafa",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Space>
          {icon}
          <Text strong>{title}</Text>
        </Space>
        <Tag color={color} style={{ marginRight: 0 }}>
          {modelData.score} 分
        </Tag>
      </div>

      {/* Top: Chart (Vertical Line + Bar) */}
      <div style={{ padding: 12, borderBottom: BORDER_STYLE }}>
        {/* @ts-ignore DualAxes TS definition issue */}
        <DualAxes {...SUB_MODEL_CHART_CONFIG(modelData.dimensions, color)} />
      </div>

      {/* Bottom: Table (复用列表，保留字段) */}
      <div style={{ flex: 1 }}>
        <Table
          dataSource={modelData.dimensions}
          rowKey="name"
          pagination={false}
          size="small"
          bordered={false}
          scroll={{ y: 200 }}
          columns={[
            { title: "评分维度", dataIndex: "name", ellipsis: true },
            {
              title: "权重",
              dataIndex: "weight",
              width: 60,
              align: "center",
              render: (t) => (
                <span style={{ fontSize: 12, color: "#999" }}>{t}%</span>
              ),
            },
            {
              title: "得分",
              dataIndex: "score",
              width: 60,
              align: "center",
              render: (t) => (
                <b style={{ color: t < 60 ? "red" : color }}>{t}</b>
              ),
            },
          ]}
        />
      </div>
    </div>
  );

  if (!profile && !loading)
    return (
      <Empty description="请输入企业名称搜索" style={{ marginTop: 100 }} />
    );

  return (
    <Layout style={{ minHeight: "100vh", background: "#fff" }}>
      <Content
        style={{
          padding: 0, // 全宽布局，无内边距
          width: "100%",
        }}
      >
        <div style={{ maxWidth: "100%", margin: "0 auto" }}>
          {/* 顶部工具栏 (保留右侧按钮) */}
          <div
            style={{
              padding: "16px 24px",
              borderBottom: BORDER_STYLE,
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              backgroundColor: "#fff",
            }}
          >
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
              {/* 区块一：企业名片 (原 Card 内容，现为无圆角区块) */}
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
                    <Space
                      direction="vertical"
                      size={6}
                      style={{ width: "100%" }}
                    >
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
                      borderLeft: "1px solid #f0f0f0", // 保留内部分隔线
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
                        <span style={{ fontSize: 14, color: "#999" }}>
                          / 100
                        </span>
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

              {/* 区块二：工商信息全景 + 资质荣誉 (原 Row/Col，现用 Grid 紧贴) */}
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
                      labelStyle={{ width: 140, background: "#fafafa" }}
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
                      <Descriptions.Item label="参保人数">
                        124 人
                      </Descriptions.Item>
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

              {/* 区块三：综合评估 (原 Card 内容，现无圆角) */}
              <div style={{ borderBottom: BORDER_STYLE }}>
                <div
                  style={{
                    padding: "12px 24px",
                    borderBottom: BORDER_STYLE,
                    backgroundColor: "#fafafa",
                  }}
                >
                  <Text strong>企业综合能力评估</Text>
                </div>
                <div style={{ padding: 24 }}>
                  <Row gutter={48} align="middle">
                    <Col xs={24} md={8} style={{ textAlign: "center" }}>
                      <Progress
                        type="dashboard"
                        percent={profile.metrics.totalScore}
                        strokeColor={COLORS.primary}
                        width={200}
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
                          message="企业经营状况良好，科技属性突出"
                          type="success"
                          showIcon
                          style={{ display: "inline-flex" }}
                        />
                      </div>
                    </Col>
                    <Col xs={24} md={16}>
                      <Title
                        level={5}
                        style={{ marginBottom: 16, textAlign: "center" }}
                      >
                        多维评分雷达
                      </Title>
                      <Radar {...MAIN_RADAR_CONFIG(profile.overallRadar)} />
                    </Col>
                  </Row>
                </div>
              </div>

              {/* 区块四：三大评分模型 (原 Row/Col，现紧贴，且内部结构优化) */}
              <Row gutter={0} style={{ borderBottom: BORDER_STYLE }}>
                <Col xs={24} md={8}>
                  {renderSubModelSection(
                    "企业基础评分",
                    <BankOutlined style={{ color: COLORS.gold }} />,
                    profile.models.basic,
                    COLORS.gold,
                    true,
                  )}
                </Col>
                <Col xs={24} md={8}>
                  {renderSubModelSection(
                    "科技属性评分",
                    <ExperimentOutlined style={{ color: COLORS.primary }} />,
                    profile.models.tech,
                    COLORS.primary,
                    true,
                  )}
                </Col>
                <Col xs={24} md={8}>
                  {renderSubModelSection(
                    "企业能力评分",
                    <ThunderboltOutlined style={{ color: COLORS.green }} />,
                    profile.models.ability,
                    COLORS.green,
                    false,
                  )}
                </Col>
              </Row>

              {/* 区块五：关联族谱 (原 Card 内容，现无圆角) */}
              <div style={{ borderBottom: BORDER_STYLE }}>
                <div
                  style={{
                    padding: "12px 24px",
                    borderBottom: BORDER_STYLE,
                    display: "flex",
                    justifyContent: "space-between",
                    backgroundColor: "#fafafa",
                  }}
                >
                  <Space>
                    <ClusterOutlined />{" "}
                    <Text strong>企业关联族谱与股权穿透</Text>
                  </Space>
                  <Button type="primary" size="small" ghost>
                    查看全屏图谱
                  </Button>
                </div>
                <div style={{ padding: 24 }}>
                  <Row gutter={24}>
                    <Col xs={24} lg={14}>
                      <div
                        style={{
                          background: "#f9f9f9",
                          border: "1px dashed #d9d9d9",
                          borderRadius: 4,
                          height: 400,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "column",
                        }}
                      >
                        <ApartmentOutlined
                          style={{
                            fontSize: 48,
                            color: "#ccc",
                            marginBottom: 16,
                          }}
                        />
                        <Text type="secondary">
                          此处加载企业股权穿透图谱 (Relationship Graph)
                        </Text>
                        <div style={{ marginTop: 16 }}>
                          <Tag color="blue">对外投资</Tag>
                          <Tag color="green">股东关系</Tag>
                          <Tag color="orange">高管关联</Tag>
                        </div>
                      </div>
                    </Col>
                    <Col xs={24} lg={10}>
                      <TabsMock
                        items={[
                          {
                            label: "股东信息",
                            key: "1",
                            content: (
                              <List
                                size="small"
                                dataSource={profile.relations.shareholders}
                                renderItem={(item: any) => (
                                  <List.Item>
                                    <Space>
                                      <UserOutlined />
                                      {item.name}
                                    </Space>{" "}
                                    <Tag>{item.ratio}</Tag>
                                  </List.Item>
                                )}
                              />
                            ),
                          },
                          {
                            label: "主要人员",
                            key: "2",
                            content: (
                              <List
                                size="small"
                                dataSource={profile.relations.keyStaff}
                                renderItem={(item: any) => (
                                  <List.Item>{item}</List.Item>
                                )}
                              />
                            ),
                          },
                          {
                            label: "实际控制人",
                            key: "3",
                            content: (
                              <div
                                style={{
                                  padding: 16,
                                  textAlign: "center",
                                  background: "#f0f5ff",
                                  borderRadius: 4,
                                }}
                              >
                                <Title
                                  level={4}
                                  style={{ color: COLORS.primary }}
                                >
                                  {profile.relations.controller}
                                </Title>
                                <Text type="secondary">最终受益股份: 51%</Text>
                              </div>
                            ),
                          },
                        ]}
                      />
                    </Col>
                  </Row>
                </div>
              </div>
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
