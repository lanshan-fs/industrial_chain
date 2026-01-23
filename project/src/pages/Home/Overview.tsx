import React, { useState } from "react";
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
  Tooltip,
  Modal,
  Progress,
  Button,
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
  FireOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const { Panel } = Collapse;

// --- 1. 模拟数据 ---

// 1.1 产业链数据 (左屏用)
const chainData = [
  {
    type: "upstream",
    title: "上游 · 研发与技术",
    total: 342,
    color: "#1890ff",
    subTags: [
      { name: "创新药研发", count: 86, isWeak: false },
      { name: "医疗器械研发", count: 120, isWeak: false },
      { name: "生物原料供应", count: 32, isWeak: true },
      { name: "核心零部件", count: 104, isWeak: false },
      { name: "基因测序技术", count: 45, isWeak: false },
      { name: "CRO服务", count: 67, isWeak: false },
      { name: "实验动物养殖", count: 23, isWeak: true },
      { name: "医学检验试剂", count: 89, isWeak: false },
      { name: "制药装备研发", count: 41, isWeak: false },
      { name: "生物信息分析", count: 55, isWeak: true },
      { name: "纳米材料应用", count: 18, isWeak: true },
      { name: "其它基础研究", count: 30, isWeak: false },
    ],
  },
  {
    type: "midstream",
    title: "中游 · 生产与制造",
    total: 518,
    color: "#52c41a",
    subTags: [
      { name: "高端设备生产", count: 145, isWeak: false },
      { name: "医药耗材制造", count: 210, isWeak: false },
      { name: "系统集成", count: 98, isWeak: false },
      { name: "工业软件开发", count: 65, isWeak: true },
      { name: "中成药加工", count: 112, isWeak: false },
      { name: "生物制剂生产", count: 78, isWeak: false },
      { name: "智能穿戴制造", count: 56, isWeak: false },
      { name: "康复辅具制造", count: 44, isWeak: true },
      { name: "医用机器人", count: 22, isWeak: true },
      { name: "制药自动化", count: 66, isWeak: false },
      { name: "包装材料制造", count: 88, isWeak: false },
      { name: "其它制造", count: 45, isWeak: false },
    ],
  },
  {
    type: "downstream",
    title: "下游 · 服务与应用",
    total: 620,
    color: "#fa8c16",
    subTags: [
      { name: "综合医疗服务", count: 280, isWeak: false },
      { name: "智慧健康管理", count: 156, isWeak: false },
      { name: "医药电商流通", count: 134, isWeak: false },
      { name: "医药冷链物流", count: 50, isWeak: true },
      { name: "专科诊疗", count: 90, isWeak: false },
      { name: "互联网医院", count: 77, isWeak: false },
      { name: "康养护理", count: 120, isWeak: false },
      { name: "商业健康险", count: 45, isWeak: true },
      { name: "医疗大数据", count: 66, isWeak: false },
      { name: "医生集团", count: 33, isWeak: true },
      { name: "公卫服务", count: 88, isWeak: false },
      { name: "其它服务", count: 56, isWeak: false },
    ],
  },
];

// 1.2 计算所有薄弱环节（增加数据量以演示 Top 5 功能）
const weakLinksSource = chainData.flatMap((layer) =>
  layer.subTags
    .filter((t) => t.isWeak)
    .map((t) => ({ ...t, layer: layer.title })),
);
// 模拟更多数据
const weakLinksFull = [
  ...weakLinksSource,
  { name: "高端传感器", layer: "上游 · 研发与技术", isWeak: true },
  { name: "抗体偶联药物", layer: "上游 · 研发与技术", isWeak: true },
  { name: "3D打印医疗材料", layer: "中游 · 生产与制造", isWeak: true },
];

// 1.3 朝阳区企业资质分布
const chaoyangStats = [
  { label: "上市企业", value: 35, icon: <GlobalOutlined />, color: "#cf1322" },
  { label: "外资企业", value: 128, icon: <GlobalOutlined />, color: "#d48806" },
  { label: "独角兽", value: 12, icon: <CrownOutlined />, color: "#eb2f96" },
  { label: "专精特新", value: 185, icon: <TrophyOutlined />, color: "#722ed1" },
  { label: "高新技术", value: 456, icon: <RocketOutlined />, color: "#1890ff" },
  { label: "科技中小", value: 890, icon: <ShopOutlined />, color: "#52c41a" },
];

// 1.4 引育推荐（增加数据量以演示 Top 5 功能）
const recommendEnterprisesFull = [
  {
    name: "北京神州生物原料有限公司",
    district: "大兴区",
    tag: "生物原料供应",
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
  {
    name: "亦庄生物医药基地",
    district: "亦庄",
    tag: "实验动物养殖",
    match: "90%",
  },
  {
    name: "昌平生命科学园",
    district: "昌平区",
    tag: "纳米材料应用",
    match: "88%",
  },
  {
    name: "丰台医用机器人中心",
    district: "丰台区",
    tag: "医用机器人",
    match: "86%",
  },
  {
    name: "通州智慧康养示范区",
    district: "通州区",
    tag: "康复辅具制造",
    match: "85%",
  },
  {
    name: "海淀AI制药实验室",
    district: "海淀区",
    tag: "生物信息分析",
    match: "84%",
  },
];

// 1.5 热门区域分布 (Top 5 街道)
const hotspotStreets = [
  { name: "酒仙桥街道", count: 156, percent: 85 },
  { name: "望京街道", count: 132, percent: 72 },
  { name: "朝外街道", count: 98, percent: 54 },
  { name: "大屯街道", count: 76, percent: 42 },
  { name: "奥运村街道", count: 65, percent: 36 },
];

// 1.6 公告栏
const notices = [
  "【通知】关于2026年第一季度高新技术企业申报的预通知",
  "【动态】朝阳区新增3家国家级专精特新“小巨人”企业",
  "【系统】平台将于本周日凌晨 02:00 进行系统维护升级",
];

// --- 2. 页面组件 ---

const Overview: React.FC = () => {
  const navigate = useNavigate();

  // 弹窗状态管理
  const [isWeakModalVisible, setIsWeakModalVisible] = useState(false);
  const [isRecModalVisible, setIsRecModalVisible] = useState(false);

  const dashboardColors = {
    bg: "linear-gradient(180deg, #001529 0%, #000c17 100%)",
    cardBg: "rgba(255, 255, 255, 0.04)",
    accent: "#1890ff",
    border: "rgba(255,255,255,0.1)",
    textSecondary: "rgba(255, 255, 255, 0.65)",
    modalBodyBg: "#001529", // 弹窗背景深色适配
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorBgContainer: dashboardColors.cardBg,
          colorBorderSecondary: dashboardColors.border,
          colorBgElevated: "#1f1f1f", // 弹窗背景色
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
              朝阳区数字医疗产业链洞察
            </Title>
            <Text
              style={{ color: dashboardColors.textSecondary, fontSize: 12 }}
            >
              CHAOYANG DISTRICT INDUSTRIAL CHAIN DASHBOARD
            </Text>
          </div>
        </div>

        <Row gutter={[24, 24]}>
          {/* ================= 左半屏：产业链树谱 (保持之前的优化效果) ================= */}
          <Col xs={24} md={12}>
            <Card
              title={<span style={{ color: "#fff" }}>全景产业链树谱</span>}
              bordered={false}
              style={{ height: "100%" }}
              bodyStyle={{ padding: "12px" }}
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
                            fontSize: 15,
                            fontWeight: "bold",
                            color: category.color,
                          }}
                        >
                          {category.title}
                        </span>
                        <Tag color={category.color} style={{ marginRight: 0 }}>
                          {category.total} 家
                        </Tag>
                      </div>
                    }
                    style={{
                      borderBottom: `1px solid ${dashboardColors.border}`,
                      marginBottom: 8,
                      background: "rgba(255,255,255,0.02)",
                      borderRadius: 6,
                    }}
                  >
                    <List
                      grid={{
                        gutter: 10,
                        xs: 2,
                        sm: 2,
                        md: 2,
                        lg: 3,
                        xl: 4,
                        xxl: 5,
                      }}
                      dataSource={category.subTags}
                      renderItem={(tag) => (
                        <List.Item style={{ marginBottom: 10 }}>
                          <Tooltip
                            title={
                              tag.isWeak ? "该环节较为薄弱，建议重点关注" : ""
                            }
                          >
                            <Card
                              size="small"
                              hoverable
                              onClick={() =>
                                navigate(`/graph-portrait/map?tag=${tag.name}`)
                              }
                              style={{
                                background: tag.isWeak
                                  ? "rgba(250, 140, 22, 0.1)"
                                  : "rgba(255,255,255,0.03)",
                                borderColor: tag.isWeak
                                  ? "#fa8c16"
                                  : "transparent",
                                cursor: "pointer",
                                width: "100%",
                              }}
                              bodyStyle={{
                                padding: "8px 12px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                minHeight: 46,
                              }}
                            >
                              <div
                                style={{
                                  fontSize: 13,
                                  color: tag.isWeak ? "#fa8c16" : "#fff",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  fontWeight: 500,
                                  flex: 1,
                                  marginRight: 8,
                                }}
                              >
                                {tag.name}
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  flexShrink: 0,
                                }}
                              >
                                <span
                                  style={{
                                    color: category.color,
                                    fontWeight: "bold",
                                    fontSize: 14,
                                    marginRight: 2,
                                  }}
                                >
                                  {tag.count}
                                </span>
                                {tag.isWeak ? (
                                  <ThunderboltFilled
                                    style={{ fontSize: 12, color: "#fa8c16" }}
                                  />
                                ) : (
                                  <RightOutlined
                                    style={{
                                      fontSize: 10,
                                      color: dashboardColors.textSecondary,
                                    }}
                                  />
                                )}
                              </div>
                            </Card>
                          </Tooltip>
                        </List.Item>
                      )}
                    />
                  </Panel>
                ))}
              </Collapse>
            </Card>
          </Col>

          {/* ================= 右半屏：概览区域 (根据最新计划优化) ================= */}
          <Col xs={24} md={12}>
            <Row gutter={[16, 16]}>
              {/* 1. 概览企业主体及其总数 & 关键评分 */}
              <Col span={24}>
                <Row gutter={[16, 16]}>
                  <Col span={8}>
                    <Card bordered={false} bodyStyle={{ padding: 16 }}>
                      <Statistic
                        title={
                          <span
                            style={{
                              color: dashboardColors.textSecondary,
                              fontSize: 12,
                            }}
                          >
                            收录总数
                          </span>
                        }
                        value={1480}
                        suffix="家"
                        valueStyle={{
                          color: "#fff",
                          fontWeight: "bold",
                          fontSize: 20,
                        }}
                        prefix={<BankOutlined />}
                      />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card bordered={false} bodyStyle={{ padding: 16 }}>
                      <Statistic
                        title={
                          <span
                            style={{
                              color: dashboardColors.textSecondary,
                              fontSize: 12,
                            }}
                          >
                            健康评分
                          </span>
                        }
                        value={85.2}
                        valueStyle={{
                          color: "#52c41a",
                          fontWeight: "bold",
                          fontSize: 20,
                        }}
                        prefix={<SafetyCertificateOutlined />}
                      />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card bordered={false} bodyStyle={{ padding: 16 }}>
                      <Statistic
                        title={
                          <span
                            style={{
                              color: dashboardColors.textSecondary,
                              fontSize: 12,
                            }}
                          >
                            协同效率
                          </span>
                        }
                        value={78.5}
                        suffix="%"
                        valueStyle={{
                          color: "#fa8c16",
                          fontWeight: "bold",
                          fontSize: 20,
                        }}
                        prefix={<ThunderboltFilled />}
                      />
                    </Card>
                  </Col>
                </Row>
              </Col>

              {/* 2. 企业资质构成 (Enterprise Qualification Composition) */}
              <Col span={24}>
                <Card
                  title={
                    <span style={{ color: "#fff" }}>朝阳区企业资质构成</span>
                  }
                  bordered={false}
                  bodyStyle={{ padding: "16px" }}
                >
                  <Row gutter={[8, 8]}>
                    {chaoyangStats.map((item, idx) => (
                      <Col span={4} key={idx} style={{ minWidth: 100 }}>
                        <div
                          style={{
                            padding: "8px",
                            background: "rgba(255,255,255,0.03)",
                            borderRadius: "4px",
                            textAlign: "center",
                          }}
                        >
                          <div
                            style={{
                              color: item.color,
                              fontSize: 20,
                              marginBottom: 4,
                            }}
                          >
                            {item.icon}
                          </div>
                          <div
                            style={{
                              color: "#fff",
                              fontSize: 16,
                              fontWeight: "bold",
                              lineHeight: 1,
                              marginBottom: 4,
                            }}
                          >
                            {item.value}
                          </div>
                          <div
                            style={{
                              color: dashboardColors.textSecondary,
                              fontSize: 10,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {item.label}
                          </div>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Card>
              </Col>

              {/* 3. 热门区域分布 Top 5 (新增模块) */}
              <Col span={24}>
                <Card
                  title={
                    <span style={{ color: "#fff" }}>
                      热门区域分布 (Top 5 街道)
                    </span>
                  }
                  bordered={false}
                  bodyStyle={{ padding: "12px 24px" }}
                  extra={
                    <Tag color="volcano">
                      <FireOutlined /> 热度
                    </Tag>
                  }
                >
                  <Row gutter={[24, 12]}>
                    {hotspotStreets.map((street, idx) => (
                      <Col
                        span={24}
                        key={idx}
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <div style={{ width: 80, color: "#fff", fontSize: 13 }}>
                          <span
                            style={{
                              display: "inline-block",
                              width: 20,
                              height: 20,
                              lineHeight: "20px",
                              textAlign: "center",
                              background:
                                idx < 3 ? "#cf1322" : "rgba(255,255,255,0.1)",
                              borderRadius: "50%",
                              fontSize: 12,
                              marginRight: 8,
                            }}
                          >
                            {idx + 1}
                          </span>
                          {street.name}
                        </div>
                        <div style={{ flex: 1, margin: "0 16px" }}>
                          <Progress
                            percent={street.percent}
                            strokeColor={
                              idx < 3
                                ? { "0%": "#fa541c", "100%": "#cf1322" }
                                : "#1890ff"
                            }
                            showInfo={false}
                            size="small"
                            trailColor="rgba(255,255,255,0.1)"
                          />
                        </div>
                        <div
                          style={{
                            width: 60,
                            textAlign: "right",
                            color: dashboardColors.textSecondary,
                            fontSize: 12,
                          }}
                        >
                          {street.count} 家
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Card>
              </Col>

              {/* 4. 产业诊断基本信息 (优化：默认显示 Top 5 + 查看更多) */}
              <Col span={24}>
                <Row gutter={[16, 16]}>
                  {/* 4.1 补链建议 (朝阳区缺口) */}
                  <Col span={12}>
                    <Card
                      title={
                        <span style={{ color: "#fa8c16", fontSize: 14 }}>
                          <LinkOutlined /> 补链建议 (朝阳区)
                        </span>
                      }
                      bordered={false}
                      style={{ height: "100%", borderTop: "2px solid #fa8c16" }}
                      bodyStyle={{ padding: "0 12px 12px" }}
                      extra={
                        <Button
                          type="text"
                          size="small"
                          style={{
                            color: dashboardColors.textSecondary,
                            fontSize: 12,
                          }}
                          onClick={() => setIsWeakModalVisible(true)}
                        >
                          更多 <RightOutlined />
                        </Button>
                      }
                    >
                      <List
                        size="small"
                        dataSource={weakLinksFull.slice(0, 5)} // 仅显示 Top 5
                        renderItem={(item) => (
                          <List.Item
                            style={{
                              padding: "8px 0",
                              borderBottom: `1px dashed ${dashboardColors.border}`,
                            }}
                          >
                            <div style={{ width: "100%" }}>
                              <div
                                style={{
                                  color: "#fff",
                                  display: "flex",
                                  justifyContent: "space-between",
                                  fontSize: 13,
                                }}
                              >
                                <span>{item.name}</span>
                                <Tag
                                  color="error"
                                  style={{
                                    margin: 0,
                                    fontSize: 10,
                                    lineHeight: "16px",
                                  }}
                                >
                                  缺口
                                </Tag>
                              </div>
                              <div
                                style={{
                                  fontSize: 11,
                                  color: dashboardColors.textSecondary,
                                  marginTop: 2,
                                }}
                              >
                                所属: {item.layer.split("·")[0]}
                              </div>
                            </div>
                          </List.Item>
                        )}
                      />
                    </Card>
                  </Col>

                  {/* 4.2 引育推荐 (全市联动) */}
                  <Col span={12}>
                    <Card
                      title={
                        <span style={{ color: "#1890ff", fontSize: 14 }}>
                          <AimOutlined /> 引育推荐 (全市联动)
                        </span>
                      }
                      bordered={false}
                      style={{ height: "100%", borderTop: "2px solid #1890ff" }}
                      bodyStyle={{ padding: "0 12px 12px" }}
                      extra={
                        <Button
                          type="text"
                          size="small"
                          style={{
                            color: dashboardColors.textSecondary,
                            fontSize: 12,
                          }}
                          onClick={() => setIsRecModalVisible(true)}
                        >
                          更多 <RightOutlined />
                        </Button>
                      }
                    >
                      <List
                        size="small"
                        dataSource={recommendEnterprisesFull.slice(0, 5)} // 仅显示 Top 5
                        renderItem={(item) => (
                          <List.Item
                            style={{
                              padding: "8px 0",
                              borderBottom: `1px dashed ${dashboardColors.border}`,
                            }}
                          >
                            <div style={{ width: "100%" }}>
                              <div
                                style={{
                                  color: "#fff",
                                  display: "flex",
                                  justifyContent: "space-between",
                                  fontSize: 13,
                                }}
                              >
                                <span
                                  style={{
                                    maxWidth: "60%",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {item.name}
                                </span>
                                <span
                                  style={{ color: "#52c41a", fontSize: 11 }}
                                >
                                  {item.match}
                                </span>
                              </div>
                              <div
                                style={{
                                  fontSize: 11,
                                  color: dashboardColors.textSecondary,
                                  marginTop: 2,
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <EnvironmentOutlined
                                  style={{ marginRight: 2 }}
                                />{" "}
                                {item.district}
                                <span style={{ margin: "0 4px" }}>|</span>
                                <span style={{ color: "#1890ff" }}>
                                  {item.tag}
                                </span>
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

        {/* 公告栏 */}
        <div
          style={{
            marginTop: 16,
            padding: "10px 16px",
            background: "rgba(24,144,255,0.06)",
            border: `1px solid rgba(24,144,255,0.2)`,
            borderRadius: 6,
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
                style={{ fontSize: 18, color: dashboardColors.accent }}
              />
              <div style={{ fontSize: 11, color: dashboardColors.accent }}>
                公告
              </div>
            </Col>
            <Col span={22} style={{ paddingLeft: 16 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {notices.map((notice, idx) => (
                  <div
                    key={idx}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <Tag
                      color={idx === 2 ? "red" : "blue"}
                      style={{
                        marginRight: 8,
                        fontSize: 10,
                        lineHeight: "16px",
                        padding: "0 4px",
                      }}
                    >
                      {idx === 2 ? "紧急" : "最新"}
                    </Tag>
                    <span
                      style={{
                        color: "rgba(255,255,255,0.85)",
                        fontSize: 13,
                        flex: 1,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {notice}
                    </span>
                    <span
                      style={{
                        color: dashboardColors.textSecondary,
                        fontSize: 11,
                      }}
                    >
                      2026-01-23
                    </span>
                  </div>
                ))}
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

        {/* --- Modals for "More" --- */}
        {/* 补链建议 Modal */}
        <Modal
          title={
            <span style={{ color: "#fa8c16" }}>
              <LinkOutlined /> 朝阳区补链建议清单 (完整版)
            </span>
          }
          open={isWeakModalVisible}
          onCancel={() => setIsWeakModalVisible(false)}
          footer={null}
          width={600}
        >
          <List
            dataSource={weakLinksFull}
            renderItem={(item) => (
              <List.Item>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ fontSize: 15, fontWeight: "bold" }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: 12, color: "#999" }}>
                      所属环节：{item.layer}
                    </div>
                  </div>
                  <Tag color="error">急需引入</Tag>
                </div>
              </List.Item>
            )}
          />
        </Modal>

        {/* 引育推荐 Modal */}
        <Modal
          title={
            <span style={{ color: "#1890ff" }}>
              <AimOutlined /> 北京市引育企业推荐库 (完整版)
            </span>
          }
          open={isRecModalVisible}
          onCancel={() => setIsRecModalVisible(false)}
          footer={null}
          width={700}
        >
          <List
            dataSource={recommendEnterprisesFull}
            renderItem={(item) => (
              <List.Item>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: "bold" }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: 12, color: "#999" }}>
                      <Tag>{item.district}</Tag>{" "}
                      <Tag color="blue">{item.tag}</Tag>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        color: "#52c41a",
                        fontSize: 16,
                        fontWeight: "bold",
                      }}
                    >
                      匹配度 {item.match}
                    </div>
                    <Button type="link" size="small">
                      查看详情
                    </Button>
                  </div>
                </div>
              </List.Item>
            )}
          />
        </Modal>
      </div>
    </ConfigProvider>
  );
};

export default Overview;
