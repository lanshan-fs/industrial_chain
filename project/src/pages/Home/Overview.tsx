import React from "react";
import {
  Row,
  Col,
  Card,
  Statistic,
  List,
  Tag,
  Typography,
  Collapse,
  theme,
  ConfigProvider,
  FloatButton,
  Badge,
} from "antd";
import {
  SafetyCertificateOutlined,
  BankOutlined,
  GlobalOutlined,
  RocketOutlined,
  TrophyOutlined,
  CrownOutlined,
  ShopOutlined,
  RightOutlined,
  RobotOutlined,
  LinkOutlined,
  EnvironmentOutlined,
  ThunderboltFilled,
  SoundOutlined,
  AimOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const { Panel } = Collapse;

// --- 1. 模拟数据 ---

// 左屏：产业链上中下游数据
const chainData = [
  {
    type: "upstream",
    title: "上游 · 研发与技术",
    total: 342,
    color: "#1890ff",
    subTags: [
      { name: "创新药研发", count: 86, isWeak: false },
      { name: "医疗器械基础研究", count: 120, isWeak: false },
      { name: "生物医药原料供应", count: 32, isWeak: true }, // 薄弱
      { name: "核心零部件", count: 104, isWeak: false },
    ],
  },
  {
    type: "midstream",
    title: "中游 · 生产与制造",
    total: 518,
    color: "#52c41a",
    subTags: [
      { name: "高端医疗设备生产", count: 145, isWeak: false },
      { name: "医药耗材制造", count: 210, isWeak: false },
      { name: "数字化系统集成", count: 98, isWeak: false },
      { name: "工业软件开发", count: 65, isWeak: true }, // 薄弱
    ],
  },
  {
    type: "downstream",
    title: "下游 · 服务与应用",
    total: 620,
    color: "#fa8c16",
    subTags: [
      { name: "医疗机构服务", count: 280, isWeak: false },
      { name: "智慧健康管理", count: 156, isWeak: false },
      { name: "医疗电商流通", count: 134, isWeak: false },
      { name: "医药冷链物流", count: 50, isWeak: true }, // 薄弱
    ],
  },
];

// 计算所有薄弱环节（补链建议数据源）
const weakLinks = chainData.flatMap((layer) =>
  layer.subTags
    .filter((t) => t.isWeak)
    .map((t) => ({ ...t, layer: layer.title })),
);

// 朝阳区概览数据
const chaoyangStats = [
  {
    label: "朝阳区上市企业",
    value: 35,
    icon: <GlobalOutlined />,
    color: "#cf1322",
  },
  {
    label: "朝阳区外资企业",
    value: 128,
    icon: <GlobalOutlined />,
    color: "#d48806",
  },
  { label: "独角兽企业", value: 12, icon: <CrownOutlined />, color: "#eb2f96" },
  { label: "专精特新", value: 185, icon: <TrophyOutlined />, color: "#722ed1" },
  { label: "高新技术", value: 456, icon: <RocketOutlined />, color: "#1890ff" },
  { label: "科技中小", value: 890, icon: <ShopOutlined />, color: "#52c41a" },
];

// 推荐补链企业（引育推荐数据源 - 模拟来自其他区）
const recommendEnterprises = [
  {
    name: "北京神州生物原料有限公司",
    district: "大兴区",
    tag: "生物医药原料供应",
    match: "98%",
  },
  {
    name: "中关村工业软件研发院",
    district: "海淀区",
    tag: "工业软件开发",
    match: "95%",
  },
  {
    name: "京北医药冷链物流集团",
    district: "顺义区",
    tag: "医药冷链物流",
    match: "92%",
  },
];

// 公告栏数据
const notices = [
  "【通知】关于2026年第一季度高新技术企业申报的预通知",
  "【动态】朝阳区新增3家国家级专精特新“小巨人”企业",
  "【系统】平台将于本周日凌晨 02:00 进行系统维护升级",
];

// --- 2. 页面组件 ---

const Overview: React.FC = () => {
  const navigate = useNavigate();

  // 大屏配色方案
  const dashboardColors = {
    bg: "linear-gradient(180deg, #001529 0%, #000c17 100%)",
    cardBg: "rgba(255, 255, 255, 0.04)",
    accent: "#1890ff",
    border: "rgba(255,255,255,0.1)",
    textSecondary: "rgba(255, 255, 255, 0.65)",
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorBgContainer: dashboardColors.cardBg,
          colorBorderSecondary: dashboardColors.border,
        },
      }}
    >
      <div
        style={{
          padding: "24px",
          minHeight: "100%",
          background: dashboardColors.bg,
          color: "#fff",
        }}
      >
        {/* 顶部标题栏 */}
        <div
          style={{
            marginBottom: 24,
            paddingBottom: 16,
            borderBottom: `1px solid ${dashboardColors.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "end",
          }}
        >
          <div>
            <Title
              level={3}
              style={{ margin: 0, color: "#fff", letterSpacing: "1px" }}
            >
              <EnvironmentOutlined
                style={{ marginRight: 12, color: dashboardColors.accent }}
              />
              产业链全景驾驶舱
            </Title>
            <Text
              style={{ color: dashboardColors.textSecondary, fontSize: 12 }}
            >
              CHAOYANG DISTRICT INDUSTRIAL CHAIN DASHBOARD
            </Text>
          </div>
        </div>

        {/* 5:5 分屏布局 */}
        <Row gutter={[24, 24]}>
          {/* ================= 左半屏：产业链分类 ================= */}
          <Col xs={24} md={12}>
            <Card
              title={<span style={{ color: "#fff" }}>全景产业链树谱</span>}
              bordered={false}
              style={{ height: "100%" }}
            >
              <Collapse
                defaultActiveKey={["upstream", "midstream", "downstream"]}
                ghost
                expandIconPosition="end"
              >
                {chainData.map((category) => (
                  <Panel
                    key={category.type}
                    header={
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                          alignItems: "center",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 16,
                            fontWeight: "bold",
                            color: category.color,
                          }}
                        >
                          {category.title}
                        </span>
                        <Tag color={category.color}>{category.total} 家</Tag>
                      </div>
                    }
                    style={{
                      borderBottom: `1px solid ${dashboardColors.border}`,
                      marginBottom: 12,
                      background: "rgba(255,255,255,0.02)",
                      borderRadius: 8,
                    }}
                  >
                    <List
                      grid={{ gutter: 16, column: 2 }}
                      dataSource={category.subTags}
                      renderItem={(tag) => (
                        <List.Item>
                          <Card
                            size="small"
                            style={{
                              background: tag.isWeak
                                ? "rgba(250, 140, 22, 0.1)"
                                : "rgba(255,255,255,0.03)",
                              borderColor: tag.isWeak
                                ? "#fa8c16"
                                : dashboardColors.border,
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              navigate(`/graph-portrait/map?tag=${tag.name}`)
                            }
                            hoverable
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <div>
                                <div
                                  style={{
                                    fontSize: 14,
                                    color: tag.isWeak ? "#fa8c16" : "#fff",
                                  }}
                                >
                                  {tag.name}{" "}
                                  {tag.isWeak && (
                                    <Tag
                                      color="warning"
                                      style={{ marginLeft: 4 }}
                                    >
                                      需补链
                                    </Tag>
                                  )}
                                </div>
                                <div
                                  style={{
                                    fontSize: 12,
                                    color: dashboardColors.textSecondary,
                                  }}
                                >
                                  企业数:{" "}
                                  <span
                                    style={{
                                      color: category.color,
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {tag.count}
                                  </span>
                                </div>
                              </div>
                              <RightOutlined
                                style={{ color: dashboardColors.textSecondary }}
                              />
                            </div>
                          </Card>
                        </List.Item>
                      )}
                    />
                  </Panel>
                ))}
              </Collapse>
            </Card>
          </Col>

          {/* ================= 右半屏：概览 & 诊断 ================= */}
          <Col xs={24} md={12}>
            <Row gutter={[16, 16]}>
              {/* 1. 关键指标 */}
              <Col span={24}>
                <Row gutter={[16, 16]}>
                  <Col span={8}>
                    <Card bordered={false}>
                      <Statistic
                        title={
                          <span
                            style={{ color: dashboardColors.textSecondary }}
                          >
                            朝阳区收录总数
                          </span>
                        }
                        value={1480}
                        suffix="家"
                        valueStyle={{ color: "#fff", fontWeight: "bold" }}
                        prefix={<BankOutlined />}
                      />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card bordered={false}>
                      <Statistic
                        title={
                          <span
                            style={{ color: dashboardColors.textSecondary }}
                          >
                            朝阳区健康度评分
                          </span>
                        }
                        value={85.2}
                        valueStyle={{ color: "#52c41a", fontWeight: "bold" }}
                        prefix={<SafetyCertificateOutlined />}
                      />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card bordered={false}>
                      <Statistic
                        title={
                          <span
                            style={{ color: dashboardColors.textSecondary }}
                          >
                            朝阳区协同效率
                          </span>
                        }
                        value={78.5}
                        suffix="%"
                        valueStyle={{ color: "#fa8c16", fontWeight: "bold" }}
                        prefix={<ThunderboltFilled />}
                      />
                    </Card>
                  </Col>
                </Row>
              </Col>

              {/* 2. 企业类型概览 */}
              <Col span={24}>
                <Card
                  title={
                    <span style={{ color: "#fff" }}>朝阳区企业类型概览</span>
                  }
                  bordered={false}
                  bodyStyle={{ padding: "12px 24px" }}
                >
                  <Row gutter={[12, 12]}>
                    {chaoyangStats.map((item, idx) => (
                      <Col span={8} key={idx}>
                        <div
                          style={{
                            padding: "12px",
                            background: "rgba(255,255,255,0.03)",
                            borderRadius: "6px",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <span
                            style={{
                              color: item.color,
                              fontSize: 24,
                              marginRight: 12,
                            }}
                          >
                            {item.icon}
                          </span>
                          <div>
                            <div
                              style={{
                                color: dashboardColors.textSecondary,
                                fontSize: 12,
                              }}
                            >
                              {item.label}
                            </div>
                            <div
                              style={{
                                color: "#fff",
                                fontSize: 18,
                                fontWeight: "bold",
                              }}
                            >
                              {item.value}
                            </div>
                          </div>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Card>
              </Col>

              {/* 3. 智能诊断 - 模块拆分 */}
              <Col span={24}>
                <Row gutter={[16, 16]}>
                  {/* 3.1 补链建议：显示朝阳区需要补链的行业 */}
                  <Col span={12}>
                    <Card
                      title={
                        <span style={{ color: "#fa8c16" }}>
                          <LinkOutlined /> 补链建议 (朝阳区)
                        </span>
                      }
                      bordered={false}
                      style={{ height: "100%", borderTop: "2px solid #fa8c16" }}
                    >
                      <List
                        dataSource={weakLinks}
                        renderItem={(item) => (
                          <List.Item
                            style={{
                              padding: "10px 0",
                              borderBottom: `1px dashed ${dashboardColors.border}`,
                            }}
                          >
                            <div style={{ width: "100%" }}>
                              <div
                                style={{
                                  color: "#fff",
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <span>{item.name}</span>
                                <Tag color="error">缺口明显</Tag>
                              </div>
                              <div
                                style={{
                                  fontSize: 12,
                                  color: dashboardColors.textSecondary,
                                  marginTop: 4,
                                }}
                              >
                                所属环节：{item.layer}
                              </div>
                            </div>
                          </List.Item>
                        )}
                      />
                    </Card>
                  </Col>

                  {/* 3.2 引育推荐：显示北京市其他区的推荐企业 */}
                  <Col span={12}>
                    <Card
                      title={
                        <span style={{ color: "#1890ff" }}>
                          <AimOutlined /> 引育推荐 (全市联动)
                        </span>
                      }
                      bordered={false}
                      style={{ height: "100%", borderTop: "2px solid #1890ff" }}
                    >
                      <List
                        dataSource={recommendEnterprises}
                        renderItem={(item) => (
                          <List.Item
                            style={{
                              padding: "10px 0",
                              borderBottom: `1px dashed ${dashboardColors.border}`,
                            }}
                          >
                            <div style={{ width: "100%" }}>
                              <div
                                style={{
                                  color: "#fff",
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <span>{item.name}</span>
                                <span
                                  style={{ color: "#52c41a", fontSize: 12 }}
                                >
                                  匹配 {item.match}
                                </span>
                              </div>
                              <div
                                style={{
                                  fontSize: 12,
                                  color: dashboardColors.textSecondary,
                                  marginTop: 4,
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <EnvironmentOutlined
                                  style={{ marginRight: 4 }}
                                />{" "}
                                {item.district}
                                <span style={{ margin: "0 8px" }}>|</span>
                                <Tag
                                  bordered={false}
                                  style={{
                                    color: "#fff",
                                    background: "rgba(255,255,255,0.1)",
                                  }}
                                >
                                  {item.tag}
                                </Tag>
                              </div>
                            </div>
                          </List.Item>
                        )}
                      />
                    </Card>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>

        {/* ================= 底部：公告栏模块 ================= */}
        <div
          style={{
            marginTop: 24,
            padding: "16px",
            background: "rgba(24,144,255,0.1)",
            border: `1px solid ${dashboardColors.accent}`,
            borderRadius: 8,
          }}
        >
          <Row align="middle">
            <Col
              span={2}
              style={{
                textAlign: "center",
                borderRight: `1px solid ${dashboardColors.border}`,
              }}
            >
              <SoundOutlined
                style={{ fontSize: 20, color: dashboardColors.accent }}
              />
              <div
                style={{
                  fontSize: 12,
                  color: dashboardColors.accent,
                  marginTop: 4,
                }}
              >
                公告栏
              </div>
            </Col>
            <Col span={22} style={{ paddingLeft: 24 }}>
              <div style={{ display: "flex", overflow: "hidden" }}>
                {/* 简单模拟滚动或列表 */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    width: "100%",
                  }}
                >
                  {notices.map((notice, idx) => (
                    <div
                      key={idx}
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <Tag
                        color={idx === 2 ? "red" : "blue"}
                        style={{ marginRight: 12 }}
                      >
                        {idx === 2 ? "紧急" : "最新"}
                      </Tag>
                      <span
                        style={{
                          color: "rgba(255,255,255,0.85)",
                          fontSize: 14,
                        }}
                      >
                        {notice}
                      </span>
                      <span
                        style={{
                          marginLeft: "auto",
                          color: dashboardColors.textSecondary,
                          fontSize: 12,
                        }}
                      >
                        2026-01-23
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Col>
          </Row>
        </div>

        {/* 悬浮按钮 */}
        <FloatButton.Group
          trigger="hover"
          style={{ right: 24, bottom: 80 }}
          icon={<RobotOutlined />}
        >
          <Badge count={"New"} offset={[-10, 0]}>
            <FloatButton
              tooltip="风险预警"
              icon={<SafetyCertificateOutlined />}
            />
          </Badge>
          <FloatButton
            tooltip="AI 助手"
            icon={<RobotOutlined />}
            type="primary"
          />
        </FloatButton.Group>
      </div>
    </ConfigProvider>
  );
};

export default Overview;
