import React, { useState, useEffect } from "react";
import {
  Layout,
  Button,
  Card,
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
  Input,
  Progress,
  Timeline,
  Alert,
  Spin,
} from "antd";
import {
  SearchOutlined,
  // DownloadOutlined, // 移除：已封装在组件中
  // ShareAltOutlined, // 移除：已封装在组件中
  GlobalOutlined,
  EnvironmentOutlined,
  BankOutlined,
  ExperimentOutlined,
  ThunderboltOutlined,
  ClusterOutlined,
  UserOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";
import { Radar } from "@ant-design/plots";
// import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

// --- 引入新封装的组件 ---
import ReportActionButtons from "../../components/ReportActionButtons";

// --- 引入本地数据 ---
import companiesData from "../../assets/data/companies.json";
import tagsData from "../../assets/data/tags.json";

const { Content } = Layout;
const { Title, Text } = Typography;

// --- 视觉风格定义 (保持与 IndustryProfile 一致) ---
const COLORS = {
  primary: "#1890ff",
  gold: "#faad14",
  green: "#52c41a",
  bg: "#f0f2f5",
  textSecondary: "#666",
};

const CARD_HEAD_STYLE = { minHeight: 48, borderBottom: "1px solid #f0f0f0" };

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
  height: 240,
});

const MINI_RADAR_CONFIG = (data: any[], color: string) => ({
  data,
  xField: "item",
  yField: "score",
  area: { style: { fill: color, fillOpacity: 0.3 } },
  line: { style: { stroke: color, lineWidth: 1 } },
  scale: { y: { min: 0, max: 100, tickCount: 3 } },
  axis: {
    x: {
      grid: { line: { style: { stroke: "#f0f0f0" } } },
      label: { style: { fontSize: 10 } },
    },
    y: false,
  },
  legend: false,
  height: 140,
  padding: [10, 10, 10, 10],
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

  // 模拟一些扩展字段
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
        radar: [
          { item: "资金", score: 90 },
          { item: "人员", score: 80 },
          { item: "信用", score: 85 },
          { item: "经营", score: 85 },
        ],
        dimensions: generateDimensions(80),
      },
      tech: {
        score: company.is_high_tech ? 92 : 65,
        radar: [
          { item: "专利", score: 90 },
          { item: "软著", score: 85 },
          { item: "研发", score: 80 },
          { item: "团队", score: 95 },
        ],
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
        radar: [
          { item: "资质", score: 70 },
          { item: "荣誉", score: 80 },
          { item: "标准", score: 75 },
          { item: "品牌", score: 85 },
        ],
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

const EnterpriseProfile: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);

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

  // 渲染子模型卡片
  const renderSubModelCard = (
    title: string,
    icon: React.ReactNode,
    modelData: any,
    color: string,
  ) => (
    <Card
      title={
        <Space>
          {icon}
          {title}
        </Space>
      }
      size="small"
      bordered={false}
      headStyle={CARD_HEAD_STYLE}
      bodyStyle={{ padding: 12 }}
      extra={
        <Tag color={color} style={{ marginRight: 0 }}>
          {modelData.score} 分
        </Tag>
      }
      style={{ height: "100%" }}
    >
      <Row gutter={8}>
        <Col span={10}>
          <div style={{ height: 140 }}>
            <Radar {...MINI_RADAR_CONFIG(modelData.radar, color)} />
          </div>
        </Col>
        <Col span={14}>
          <Table
            dataSource={modelData.dimensions}
            rowKey="name"
            pagination={false}
            size="small"
            bordered={false}
            scroll={{ y: 150 }}
            columns={[
              { title: "维度", dataIndex: "name", ellipsis: true },
              {
                title: "权重",
                dataIndex: "weight",
                width: 50,
                render: (t) => (
                  <span style={{ fontSize: 10, color: "#999" }}>{t}%</span>
                ),
              },
              {
                title: "得分",
                dataIndex: "score",
                width: 50,
                render: (t) => (
                  <b style={{ color: t < 60 ? "red" : color }}>{t}</b>
                ),
              },
            ]}
          />
        </Col>
      </Row>
    </Card>
  );

  if (!profile && !loading)
    return (
      <Empty description="请输入企业名称搜索" style={{ marginTop: 100 }} />
    );

  return (
    <Layout style={{ minHeight: "100vh", background: COLORS.bg }}>
      <Content
        style={{
          padding: "24px",
          maxWidth: 1600,
          margin: "0 auto",
          width: "100%",
        }}
      >
        {/* 0. 顶部搜索 */}
        <div
          style={{
            marginBottom: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Input.Search
            placeholder="请输入企业名称"
            enterButton={
              <Button type="primary" icon={<SearchOutlined />}>
                企业画像搜索
              </Button>
            }
            size="large"
            style={{ maxWidth: 500, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
            onSearch={handleSearch}
          />
          {/* 优化1：复用“下载”和“分享”组件，指定 targetId */}
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
          /* 优化2：添加 ID 供 PDF 下载工具识别，并包裹主要内容 */
          <div id="enterprise-report-content">
            <Space direction="vertical" size={24} style={{ width: "100%" }}>
              {/* 区块一：企业名片 + 工商信息全景 */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: 24 }}
              >
                {/* 1.1 企业名片 */}
                <Card bodyStyle={{ padding: 24 }} bordered={false}>
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
                        <Space
                          size={24}
                          style={{ color: COLORS.textSecondary }}
                        >
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
                </Card>

                {/* 1.2 工商信息全景 */}
                <Row gutter={24} style={{ alignItems: "stretch" }}>
                  <Col xs={24} lg={16}>
                    <Card
                      title="工商信息全景"
                      bordered={false}
                      style={{ height: "100%" }}
                    >
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
                    </Card>
                  </Col>
                  <Col xs={24} lg={8}>
                    <Card
                      title="资质与荣誉"
                      bordered={false}
                      style={{ height: "100%" }}
                      extra={<a href="#">更多</a>}
                    >
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
                      <Title
                        level={5}
                        style={{ fontSize: 14, marginBottom: 8 }}
                      >
                        企业标签
                      </Title>
                      <Space size={[0, 8]} wrap>
                        {profile.tags.map((t: string) => (
                          <Tag key={t}>{t}</Tag>
                        ))}
                      </Space>
                    </Card>
                  </Col>
                </Row>
              </div>

              {/* 区块二：综合评分与雷达 */}
              <Row gutter={24}>
                <Col span={24}>
                  <Card bordered={false} title="企业综合能力评估">
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
                  </Card>
                </Col>
              </Row>

              {/* 区块三：三大评分模型 */}
              <Row gutter={20}>
                <Col xs={24} md={8}>
                  {renderSubModelCard(
                    "企业基础评分",
                    <BankOutlined style={{ color: COLORS.gold }} />,
                    profile.models.basic,
                    COLORS.gold,
                  )}
                </Col>
                <Col xs={24} md={8}>
                  {renderSubModelCard(
                    "科技属性评分",
                    <ExperimentOutlined style={{ color: COLORS.primary }} />,
                    profile.models.tech,
                    COLORS.primary,
                  )}
                </Col>
                <Col xs={24} md={8}>
                  {renderSubModelCard(
                    "企业能力评分",
                    <ThunderboltOutlined style={{ color: COLORS.green }} />,
                    profile.models.ability,
                    COLORS.green,
                  )}
                </Col>
              </Row>

              {/* 区块四：企业关联族谱与股权穿透 */}
              <Card
                title={
                  <Space>
                    <ClusterOutlined /> 企业关联族谱与股权穿透
                  </Space>
                }
                bordered={false}
                extra={
                  <Button type="primary" size="small" ghost>
                    查看全屏图谱
                  </Button>
                }
              >
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
              </Card>
            </Space>

            {/* 页脚水印 (仅在 PDF 中可见) */}
            <div
              style={{
                textAlign: "center",
                marginTop: 32,
                color: "#ccc",
                fontSize: 12,
              }}
            >
              - 朝阳区产业链洞察平台生成 -
            </div>
          </div>
        )}
      </Content>
    </Layout>
  );
};

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

export default EnterpriseProfile;
