import React, { useMemo, useState } from "react";
import {
  Layout,
  Input,
  Button,
  Card,
  Row,
  Col,
  Typography,
  Space,
  Tag,
  Avatar,
  Descriptions,
  Divider,
  Progress,
  List,
  Table,
  Badge,
  Grid,
} from "antd";
import {
  SearchOutlined,
  ExportOutlined,
  InfoCircleOutlined,
  AimOutlined,
  BankOutlined,
  RiseOutlined,
  RadarChartOutlined,
  SafetyOutlined,
  ShareAltOutlined,
  PhoneOutlined,
  MailOutlined,
  FundProjectionScreenOutlined,
} from "@ant-design/icons";
import { Radar } from "@ant-design/plots";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;

// --- 视觉常量 ---
const COLORS = {
  primary: "#1890ff",
  gold: "#faad14",
  green: "#52c41a",
  bg: "#f5f7fa",
};

const CARD_HEAD_STYLE = { minHeight: 46, borderBottom: "1px solid #f0f0f0" };

const MOCK_PROFILE = {
  company: {
    name: "星航新能源科技有限公司",
    logo: "https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/logo.svg",
    rating: "A+",
    legalPerson: "张岚",
    creditCode: "91440300MA5FF8E1X0",
    founded: "2014-06-12",
    location: "深圳·南山科技园",
    capital: "2.5 亿元",
    stageTags: ["储能系统", "动力电池", "智能制造"],
    highlightTags: ["专精特新", "高新技术", "已融资C轮"],
  },
  overview: {
    score: 92,
    rankNote: "领先同业 93%",
    companyCount: 2650,
    revenue: "18.6 亿元",
    staff: "820 人",
    mainRadar: [
      { item: "经营稳健度", score: 88 },
      { item: "技术领先度", score: 95 },
      { item: "产业带动", score: 90 },
      { item: "合规保障", score: 84 },
      { item: "资本弹性", score: 91 },
    ],
  },
  models: {
    basic: {
      score: 88,
      radar: [
        { item: "注册规范", score: 86 },
        { item: "资金充裕", score: 92 },
        { item: "资产稳健", score: 84 },
        { item: "合规风险", score: 89 },
      ],
      dimensions: [
        { name: "注册资本", weight: 30, score: 92 },
        { name: "资产负债", weight: 25, score: 84 },
        { name: "诉讼 & 经营异常", weight: 20, score: 88 },
        { name: "信用等级", weight: 25, score: 89 },
      ],
    },
    tech: {
      score: 94,
      radar: [
        { item: "专利与软著", score: 95 },
        { item: "研发投入", score: 92 },
        { item: "技术成果转化", score: 90 },
        { item: "产线数字化", score: 98 },
      ],
      dimensions: [
        { name: "专利族数量", weight: 28, score: 96 },
        { name: "研发费用占比", weight: 32, score: 92 },
        { name: "研发团队建设", weight: 20, score: 93 },
        { name: "生产智造水平", weight: 20, score: 98 },
      ],
    },
    ability: {
      score: 90,
      radar: [
        { item: "市场开拓", score: 92 },
        { item: "供应链韧性", score: 88 },
        { item: "交付能力", score: 90 },
        { item: "品牌影响", score: 89 },
      ],
      dimensions: [
        { name: "核心客户集中度", weight: 25, score: 91 },
        { name: "区域覆盖", weight: 25, score: 88 },
        { name: "供应链安全", weight: 25, score: 87 },
        { name: "交付履约", weight: 25, score: 90 },
      ],
    },
  },
  business: {
    registerInfo: [
      { label: "统一社会信用代码", value: "91440300MA5FF8E1X0" },
      { label: "登记机关", value: "深圳市市场监督管理局" },
      { label: "经营状态", value: "存续" },
      { label: "注册资本", value: "25,000.00 万元人民币" },
      { label: "实缴资本", value: "16,800.00 万元人民币" },
      { label: "员工人数", value: "820 人" },
      { label: "行业分类", value: "新能源及智能制造" },
      { label: "营收规模", value: "18.6 亿元 (2025E)" },
    ],
    tags: {
      industry: ["储能系统", "动力电池材料", "BMS 软件"],
      capability: ["自研算法", "MES 数字产线", "供应链协同"],
      caution: ["曾有1条经营异常，已整改"],
    },
  },
  relations: {
    financing: [
      {
        round: "C 轮",
        date: "2025-09",
        amount: "6 亿元",
        investors: ["华创资本", "深创投"],
      },
      {
        round: "B+ 轮",
        date: "2024-03",
        amount: "2.1 亿元",
        investors: ["红杉中国", "国开制造基金"],
      },
      {
        round: "B 轮",
        date: "2023-01",
        amount: "1.3 亿元",
        investors: ["IDG", "君联资本"],
      },
    ],
    shareholders: [
      { name: "张岚", ratio: 32, role: "实际控制人" },
      { name: "华创资本", ratio: 18, role: "财务投资" },
      { name: "红杉中国", ratio: 12, role: "财务投资" },
      { name: "员工持股平台", ratio: 10, role: "激励" },
      { name: "君联资本", ratio: 8, role: "财务投资" },
    ],
    keyContacts: [
      { name: "李明", title: "CTO", phone: "138****2108", mail: "li.ming@xinghang.com" },
      { name: "王倩", title: "商务负责人", phone: "137****8456", mail: "wangqian@xinghang.com" },
      { name: "陈宇", title: "供应链总监", phone: "139****3345", mail: "chenyu@xinghang.com" },
    ],
  },
};

const radarConfig = (data: { item: string; score: number }[]) => ({
  data,
  xField: "item",
  yField: "score",
  height: 240,
  area: { style: { fill: "rgba(24,144,255,0.15)" } },
  line: { style: { stroke: COLORS.primary, lineWidth: 2 } },
  point: {
    size: 3,
    shape: "circle",
    style: { fill: "#fff", stroke: COLORS.primary, lineWidth: 2 },
  },
  scale: { y: { min: 0, max: 100, tickCount: 5 } },
  legend: false,
});

const miniRadarConfig = (
  data: { item: string; score: number }[],
  color: string,
) => ({
  data,
  xField: "item",
  yField: "score",
  height: 180,
  area: { style: { fill: color, fillOpacity: 0.18 } },
  line: { style: { stroke: color, lineWidth: 1.5 } },
  point: { size: 2, style: { fill: "#fff", stroke: color } },
  scale: { y: { min: 0, max: 100, tickCount: 4 } },
  legend: false,
  padding: [10, 10, 10, 10],
});

const EnterpriseProfile: React.FC = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const [activeCompany, setActiveCompany] = useState(MOCK_PROFILE.company.name);
  const [profileData] = useState(MOCK_PROFILE);

  const shareholderColumns = useMemo(
    () => [
      { title: "股东", dataIndex: "name", key: "name" },
      {
        title: "持股比例",
        dataIndex: "ratio",
        key: "ratio",
        width: 140,
        render: (r: number) => (
          <Progress
            percent={r}
            size="small"
            strokeColor={COLORS.primary}
            format={(val) => `${val}%`}
          />
        ),
      },
      { title: "类型", dataIndex: "role", key: "role", width: 120 },
    ],
    [],
  );

  const renderModelCard = (
    title: string,
    color: string,
    data: (typeof MOCK_PROFILE.models)["basic"],
  ) => (
    <Card
      size="small"
      bordered={false}
      headStyle={CARD_HEAD_STYLE}
      title={
        <Space>
          <RadarChartOutlined style={{ color }} />
          {title}
        </Space>
      }
      extra={
        <Tag color={color} bordered={false} style={{ marginRight: 0 }}>
          {data.score} 分
        </Tag>
      }
      style={{ height: "100%" }}
      bodyStyle={{ padding: 14 }}
    >
      <div style={{ marginBottom: 12 }}>
        <Radar {...miniRadarConfig(data.radar, color)} />
      </div>
      <Table
        size="small"
        bordered
        pagination={false}
        rowKey="name"
        dataSource={data.dimensions}
        columns={[
          { title: "维度", dataIndex: "name", width: "40%" },
          {
            title: "权重",
            dataIndex: "weight",
            width: "20%",
            render: (w) => <Tag style={{ marginRight: 0 }}>{w}%</Tag>,
          },
          {
            title: "得分",
            dataIndex: "score",
            render: (s) => (
              <Space size={6}>
                <Progress
                  percent={s}
                  size="small"
                  strokeColor={color}
                  showInfo={false}
                  style={{ width: 50 }}
                />
                <Text strong>{s}</Text>
              </Space>
            ),
          },
        ]}
      />
    </Card>
  );

  return (
    <Layout style={{ background: COLORS.bg, minHeight: "85vh" }}>
      <Content
        style={{
          padding: isMobile ? "16px" : "24px",
          maxWidth: 1300,
          margin: "0 auto",
          width: "100%",
        }}
      >
        {/* 顶部搜索 + 操作 */}
        <div
          style={{
            marginBottom: 20,
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Input.Search
            allowClear
            placeholder="输入企业名称 / 统一社会信用代码"
            enterButton={
              <Button type="primary" icon={<SearchOutlined />}>
                搜索企业画像
              </Button>
            }
            style={{ width: 460, maxWidth: "100%", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
            onSearch={(val) => val && setActiveCompany(val)}
          />
          <Space>
            <Tag icon={<InfoCircleOutlined />} color="default">
              数据来源：工商/投融/风控
            </Tag>
            <Button icon={<ExportOutlined />}>导出报告</Button>
          </Space>
        </div>

        <Space direction="vertical" size={16} style={{ width: "100%" }}>
          {/* 公司名片 + 总览 */}
          <Card bordered={false} bodyStyle={{ padding: 20 }}>
            <Row gutter={20} align="middle">
              <Col xs={24} lg={10}>
                <Space align="start" size={16}>
                  <Avatar
                    shape="square"
                    size={78}
                    src={profileData.company.logo}
                    alt={profileData.company.name}
                    style={{ background: "#fff", border: "1px solid #f0f0f0" }}
                  />
                  <Space direction="vertical" size={4}>
                    <Space align="center">
                      <Title level={3} style={{ margin: 0 }}>
                        {activeCompany}
                      </Title>
                      <Tag color="gold">信用 {profileData.company.rating}</Tag>
                    </Space>
                    <Text type="secondary">
                      <AimOutlined /> {profileData.company.location}
                    </Text>
                    <Space wrap>
                      {profileData.company.stageTags.map((t) => (
                        <Tag color="blue" key={t}>
                          {t}
                        </Tag>
                      ))}
                      {profileData.company.highlightTags.map((t) => (
                        <Tag color="cyan" key={t}>
                          {t}
                        </Tag>
                      ))}
                    </Space>
                    <Descriptions
                      column={1}
                      size="small"
                      labelStyle={{ color: "#999", width: 88 }}
                    >
                      <Descriptions.Item label="法定代表人">
                        {profileData.company.legalPerson}
                      </Descriptions.Item>
                      <Descriptions.Item label="成立时间">
                        {profileData.company.founded}
                      </Descriptions.Item>
                      <Descriptions.Item label="统一社会信用代码">
                        {profileData.company.creditCode}
                      </Descriptions.Item>
                    </Descriptions>
                  </Space>
                </Space>
              </Col>
              <Col xs={24} lg={14}>
                <Row gutter={12} align="middle">
                  <Col span={10}>
                    <div style={{ padding: "12px 16px", background: "#fff", borderRadius: 8 }}>
                      <Text type="secondary">综合得分</Text>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                        <Title level={1} style={{ margin: 0, color: COLORS.primary }}>
                          {profileData.overview.score}
                        </Title>
                        <Text type="secondary">/100</Text>
                      </div>
                      <Text type="secondary">{profileData.overview.rankNote}</Text>
                      <Divider style={{ margin: "12px 0" }} />
                      <Row gutter={12}>
                        <Col span={12}>
                          <Space size={6}>
                            <BankOutlined style={{ color: COLORS.gold }} />
                            <Text type="secondary">登记资本</Text>
                          </Space>
                          <div style={{ fontWeight: 600 }}>{profileData.company.capital}</div>
                        </Col>
                        <Col span={12}>
                          <Space size={6}>
                            <RiseOutlined style={{ color: COLORS.green }} />
                            <Text type="secondary">营收规模</Text>
                          </Space>
                          <div style={{ fontWeight: 600 }}>{profileData.overview.revenue}</div>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                  <Col span={14}>
                    <div style={{ position: "relative" }}>
                      <Title level={5} style={{ position: "absolute", top: -4, left: 12 }}>
                        综合能力雷达
                      </Title>
                      <Radar {...radarConfig(profileData.overview.mainRadar)} />
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>

          {/* 三个评分模型 */}
          <Row gutter={16}>
            <Col xs={24} md={8}>
              {renderModelCard("企业基础评分", COLORS.gold, profileData.models.basic)}
            </Col>
            <Col xs={24} md={8}>
              {renderModelCard("企业科技评分", COLORS.primary, profileData.models.tech)}
            </Col>
            <Col xs={24} md={8}>
              {renderModelCard("企业能力评分", COLORS.green, profileData.models.ability)}
            </Col>
          </Row>

          {/* 商业信息全景 */}
          <Card
            size="small"
            bordered={false}
            headStyle={CARD_HEAD_STYLE}
            title={
              <Space>
                <SafetyOutlined />
                企业商业信息全景
              </Space>
            }
          >
            <Row gutter={20}>
              <Col xs={24} md={14}>
                <Descriptions
                  column={2}
                  colon={false}
                  size="small"
                  labelStyle={{ color: "#888", width: 120 }}
                >
                  {profileData.business.registerInfo.map((item) => (
                    <Descriptions.Item label={item.label} key={item.label}>
                      {item.value}
                    </Descriptions.Item>
                  ))}
                </Descriptions>
              </Col>
              <Col xs={24} md={10} style={{ borderLeft: isMobile ? "none" : "1px solid #f0f0f0" }}>
                <div style={{ paddingLeft: isMobile ? 0 : 12 }}>
                  <Text type="secondary">行业标签</Text>
                  <div style={{ marginBottom: 8 }}>
                    {profileData.business.tags.industry.map((t) => (
                      <Tag key={t} color="blue">
                        {t}
                      </Tag>
                    ))}
                  </div>
                  <Text type="secondary">能力标签</Text>
                  <div style={{ marginBottom: 8 }}>
                    {profileData.business.tags.capability.map((t) => (
                      <Tag key={t} color="green">
                        {t}
                      </Tag>
                    ))}
                  </div>
                  <Text type="secondary">风险提示</Text>
                  <div>
                    {profileData.business.tags.caution.map((t) => (
                      <Tag key={t} color="orange">
                        {t}
                      </Tag>
                    ))}
                  </div>
                </div>
              </Col>
            </Row>
          </Card>

          {/* 关联 & 股权 & 联系人 */}
          <Card
            size="small"
            bordered={false}
            headStyle={CARD_HEAD_STYLE}
            title={
              <Space>
                <ShareAltOutlined />
                企业关联与股权穿透
              </Space>
            }
            extra={
              <Tag icon={<InfoCircleOutlined />} color="purple">
                支持查看更多
              </Tag>
            }
          >
            <Row gutter={20}>
              <Col xs={24} md={9} style={{ borderRight: isMobile ? "none" : "1px solid #f0f0f0" }}>
                <Title level={5} style={{ marginTop: 0 }}>
                  融资历程
                </Title>
                <List
                  size="small"
                  itemLayout="vertical"
                  dataSource={profileData.relations.financing}
                  renderItem={(item) => (
                    <List.Item>
                      <Space direction="vertical" size={2}>
                        <Space size={8}>
                          <Badge color="blue" />
                          <Text strong>{item.round}</Text>
                          <Tag color="geekblue">{item.date}</Tag>
                        </Space>
                        <Text type="secondary">融资金额：{item.amount}</Text>
                        <Text type="secondary">
                          投资方：{item.investors.join("、")}
                        </Text>
                      </Space>
                    </List.Item>
                  )}
                />
              </Col>
              <Col xs={24} md={9} style={{ paddingLeft: isMobile ? 0 : 16 }}>
                <Title level={5} style={{ marginTop: 0 }}>
                  股东结构
                </Title>
                <Table
                  size="small"
                  pagination={false}
                  dataSource={profileData.relations.shareholders}
                  rowKey="name"
                  columns={shareholderColumns}
                />
              </Col>
              <Col xs={24} md={6} style={{ paddingLeft: isMobile ? 0 : 16 }}>
                <Title level={5} style={{ marginTop: 0 }}>
                  关键联系人
                </Title>
                <List
                  size="small"
                  dataSource={profileData.relations.keyContacts}
                  renderItem={(p) => (
                    <List.Item>
                      <Space direction="vertical" size={4}>
                        <Space size={6}>
                          <Badge color="green" />
                          <Text strong>{p.name}</Text>
                          <Tag color="default">{p.title}</Tag>
                        </Space>
                        <Space size={8}>
                          <PhoneOutlined />
                          <Text>{p.phone}</Text>
                        </Space>
                        <Space size={8}>
                          <MailOutlined />
                          <Text>{p.mail}</Text>
                        </Space>
                      </Space>
                    </List.Item>
                  )}
                />
              </Col>
            </Row>
          </Card>

          {/* 备注 */}
          <Card bordered={false} size="small">
            <Space align="start">
              <FundProjectionScreenOutlined style={{ color: COLORS.primary }} />
              <Paragraph style={{ margin: 0, color: "#666" }}>
                数据为样例格式，真实数据可接入工商/风控/投融等接口后填充。评分维度、权重、标签均可在“系统管理-评分权重”模块里配置并同步到企业画像。
              </Paragraph>
            </Space>
          </Card>
        </Space>
      </Content>
    </Layout>
  );
};

export default EnterpriseProfile;
