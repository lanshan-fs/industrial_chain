import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  List,
  Tag,
  Typography,
  Collapse,
  FloatButton,
  Badge,
  Tooltip,
  Modal,
  Progress,
  Button,
  Spin,
  message,
  Carousel,
  Input,
  Tabs,
  Space,
} from "antd";
import {
  SafetyCertificateOutlined,
  RocketOutlined,
  TrophyOutlined,
  CrownOutlined,
  ShopOutlined,
  RobotOutlined,
  LinkOutlined,
  EnvironmentOutlined,
  ThunderboltFilled,
  SoundOutlined,
  AimOutlined,
  FireOutlined,
  GlobalOutlined,
  BankOutlined,
  ClusterOutlined,
  RiseOutlined,
  BulbOutlined,
  ArrowRightOutlined,
  ExperimentOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const { Panel } = Collapse;

// --- 模拟数据 ---

// 1. 顶部驾驶舱关键指标
const keyMetrics = [
  { label: "收录总数", value: 2853, suffix: "家", color: "#fff" },
  { label: "综合评分", value: 85.2, suffix: "分", color: "#73d13d" },
  { label: "协同效率", value: 78.5, suffix: "%", color: "#ffec3d" },
];

// 2. 企业资质分布
const chaoyangStats = [
  { label: "上市企业", value: 35, icon: <GlobalOutlined />, color: "#cf1322" },
  { label: "外资企业", value: 128, icon: <GlobalOutlined />, color: "#d48806" },
  { label: "独角兽", value: 12, icon: <CrownOutlined />, color: "#eb2f96" },
  { label: "专精特新", value: 185, icon: <TrophyOutlined />, color: "#722ed1" },
  { label: "高新技术", value: 456, icon: <RocketOutlined />, color: "#1890ff" },
  { label: "科技中小", value: 890, icon: <ShopOutlined />, color: "#52c41a" },
];

// 3. 热门区域分布
const hotspotStreets = [
  { name: "酒仙桥街道", count: 156, percent: 85 },
  { name: "望京街道", count: 132, percent: 72 },
  { name: "朝外街道", count: 98, percent: 54 },
  { name: "大屯街道", count: 76, percent: 42 },
  { name: "奥运村街道", count: 65, percent: 36 },
];

// 4. 平台公告
const notices = [
  {
    id: 1,
    title: "关于2026年第一季度高新技术企业申报的预通知",
    type: "通知",
    date: "2026-01-29",
  },
  {
    id: 2,
    title: "朝阳区新增3家国家级专精特新“小巨人”企业名单公示",
    type: "动态",
    date: "2026-01-28",
  },
  {
    id: 3,
    title: "产业链平台将于本周日凌晨 02:00 进行系统维护升级",
    type: "系统",
    date: "2026-01-27",
  },
  {
    id: 4,
    title: "2025年度全区数字经济产业发展报告已发布",
    type: "报告",
    date: "2026-01-25",
  },
  {
    id: 5,
    title: "关于举办“数据要素×”产业沙龙的邀请函",
    type: "活动",
    date: "2026-01-24",
  },
];

// 5. 热搜数据
const hotSearches = {
  industries: ["数字医疗", "工业互联网", "人工智能", "光子计算"],
  enterprises: ["京东方", "阿里云", "美团", "泡泡玛特"],
};

// 6. 产业生态圈分类
const ecologyCategories = [
  { name: "科研院校", icon: <BankOutlined />, count: 42 },
  { name: "行业协会", icon: <ClusterOutlined />, count: 15 },
  { name: "投资基金", icon: <RiseOutlined />, count: 88 },
  { name: "孵化器", icon: <BulbOutlined />, count: 26 },
  { name: "专业园区", icon: <EnvironmentOutlined />, count: 18 },
  { name: "概念验证", icon: <ExperimentOutlined />, count: 9 },
];

// 7. 热门标签
const hotTags = [
  "生物医药",
  "跨境电商",
  "元宇宙",
  "自动驾驶",
  "绿色能源",
  "区块链",
  "SaaS",
  "智能制造",
];

const Overview: React.FC = () => {
  const navigate = useNavigate();

  // 状态管理
  const [loading, setLoading] = useState(true);
  const [chainData, setChainData] = useState<any[]>([]);
  const [weakLinksFull, setWeakLinksFull] = useState<any[]>([]);
  const [recommendEnterprisesFull, setRecommendEnterprisesFull] = useState<
    any[]
  >([]);
  const [searchScope, setSearchScope] = useState("industry");
  const [isWeakModalVisible, setIsWeakModalVisible] = useState(false);
  const [isRecModalVisible, setIsRecModalVisible] = useState(false);

  // 初始化数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/api/dashboard/overview",
        );
        const json = await response.json();
        if (json.success) {
          setChainData(json.data.chainData);
          const computedWeakLinks = json.data.chainData.flatMap((layer: any) =>
            layer.subTags
              .filter((t: any) => t.isWeak)
              .map((t: any) => ({ ...t, layer: layer.title })),
          );
          setWeakLinksFull(computedWeakLinks);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setChainData([
          {
            title: "上游 · 研发与技术",
            type: "upstream",
            total: 120,
            subTags: [
              { name: "芯片设计", count: 40 },
              { name: "算法模型", count: 30, isWeak: true },
              { name: "EDA工具", count: 12 },
            ],
          },
          {
            title: "中游 · 产品与制造",
            type: "midstream",
            total: 340,
            subTags: [
              { name: "智能硬件", count: 150 },
              { name: "系统集成", count: 190 },
            ],
          },
          {
            title: "下游 · 应用与服务",
            type: "downstream",
            total: 560,
            subTags: [
              { name: "智慧医疗", count: 200 },
              { name: "智慧金融", count: 360 },
            ],
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    setRecommendEnterprisesFull([
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
    ]);
  }, []);

  const styles = {
    // 首页容器，背景色通栏
    fullWidthContainer: {
      width: "100vw",
      position: "relative" as "relative",
      left: "50%",
      right: "50%",
      marginLeft: "-50vw",
      marginRight: "-50vw",
    },
    // Banner 区域样式
    bannerSection: {
      background: "linear-gradient(135deg, #001529 0%, #003a8c 100%)",
      padding: "60px 0 100px 0", // 底部留空间给卡片上浮
      marginBottom: -60,
    },
    // 内容版心 1280px
    contentInner: {
      maxWidth: 1280,
      margin: "0 auto",
      padding: "0 24px",
    },
    // 卡片通用样式 (优化：移除 marginBottom，改用 Grid Gutter 控制)
    card: {
      borderRadius: 8,
      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      // marginBottom: 24, // 移除
    },
    tagCard: {
      cursor: "pointer",
      borderRadius: 4,
      padding: "12px",
      background: "#fff",
      border: "1px solid #f0f0f0",
      transition: "all 0.3s",
      minHeight: 70,
      display: "flex",
      flexDirection: "column" as "column",
      justifyContent: "space-between",
    },
    tagCardWeak: {
      background: "#fff7e6",
      border: "1px solid #ffd591",
    },
  };

  const handleSearch = (value: string) => {
    message.info(`正在搜索 [${searchScope}]：${value}`);
    navigate(`/industry-class?q=${value}`);
  };

  return (
    <div>
      {/* 1. 顶部全屏 Banner */}
      <div style={{ ...styles.fullWidthContainer, ...styles.bannerSection }}>
        <div style={styles.contentInner}>
          <div style={{ textAlign: "center" }}>
            <Title
              level={1}
              style={{
                color: "#fff",
                marginBottom: 32,
                fontWeight: 500,
                letterSpacing: 2,
              }}
            >
              产业链洞察专家
            </Title>

            <div style={{ maxWidth: 840, margin: "0 auto", textAlign: "left" }}>
              <Tabs
                activeKey={searchScope}
                onChange={setSearchScope}
                items={[
                  { key: "industry", label: "查行业" },
                  { key: "company", label: "查企业" },
                  { key: "person", label: "查负责人" },
                  { key: "risk", label: "查风险" },
                  { key: "qualification", label: "查资质" },
                ]}
                tabBarStyle={{
                  marginBottom: 8,
                  borderBottom: "none",
                  color: "rgba(255,255,255,0.7)",
                }}
                className="home-search-tabs"
              />
              <style>{`
                .home-search-tabs .ant-tabs-tab { color: rgba(255,255,255,0.7); font-size: 16px; padding: 8px 0; margin-right: 32px; }
                .home-search-tabs .ant-tabs-tab-active .ant-tabs-tab-btn { color: #fff !important; font-weight: 600; font-size: 18px; }
                .home-search-tabs .ant-tabs-ink-bar { background: #fff; height: 3px; }
              `}</style>

              <div
                style={{
                  display: "flex",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  borderRadius: 8,
                }}
              >
                <Input
                  size="large"
                  placeholder={`请输入${searchScope === "industry" ? "行业" : "企业"}名称、关键词...`}
                  style={{
                    height: 56,
                    fontSize: 16,
                    border: "none",
                    borderRadius: "8px 0 0 8px",
                    paddingLeft: 24,
                  }}
                  suffix={
                    <span
                      style={{
                        cursor: "pointer",
                        color: "#1890ff",
                        fontWeight: 500,
                        padding: "0 16px",
                        borderLeft: "1px solid #f0f0f0",
                      }}
                      onClick={() => message.info("跳转至高级搜索页")}
                    >
                      高级搜索
                    </span>
                  }
                  onPressEnter={(e) => handleSearch(e.currentTarget.value)}
                />
                <Button
                  type="primary"
                  size="large"
                  style={{
                    width: 120,
                    height: 56,
                    fontSize: 18,
                    borderRadius: "0 8px 8px 0",
                    border: "none",
                    background: "#1890ff",
                  }}
                  icon={<SearchOutlined />}
                  onClick={() => handleSearch("")}
                >
                  搜索
                </Button>
              </div>

              <div
                style={{
                  marginTop: 16,
                  color: "rgba(255,255,255,0.8)",
                  fontSize: 13,
                }}
              >
                <FireOutlined style={{ marginRight: 8, color: "#ffec3d" }} />
                <span style={{ marginRight: 8 }}>热搜行业：</span>
                {hotSearches.industries.map((item) => (
                  <Tag
                    key={item}
                    bordered={false}
                    style={{
                      background: "rgba(255,255,255,0.15)",
                      color: "#fff",
                      cursor: "pointer",
                      border: "none",
                    }}
                    onClick={() => navigate("/industry-class")}
                  >
                    {item}
                  </Tag>
                ))}
                <span style={{ margin: "0 16px", opacity: 0.5 }}>|</span>
                <span style={{ marginRight: 8 }}>热搜企业：</span>
                {hotSearches.enterprises.map((item) => (
                  <span
                    key={item}
                    style={{
                      marginRight: 16,
                      cursor: "pointer",
                      borderBottom: "1px dashed rgba(255,255,255,0.5)",
                    }}
                    onClick={() => navigate("/industry-class")}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: 40,
              background: "rgba(0,0,0,0.2)",
              padding: "8px 24px",
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              backdropFilter: "blur(4px)",
            }}
          >
            <SoundOutlined style={{ color: "#ffec3d", marginRight: 12 }} />
            <Carousel
              autoplay
              dots={false}
              effect="scrollx"
              style={{
                flex: 1,
                height: 24,
                lineHeight: "24px",
                overflow: "hidden",
              }}
            >
              {notices.map((n) => (
                <div key={n.id}>
                  <Text style={{ color: "#fff" }}>
                    [{n.type}] {n.title}{" "}
                    <span style={{ opacity: 0.6, fontSize: 12, marginLeft: 8 }}>
                      {n.date}
                    </span>
                  </Text>
                </div>
              ))}
            </Carousel>
            <a
              onClick={() =>
                document
                  .getElementById("notice-section")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              style={{
                color: "#fff",
                opacity: 0.8,
                fontSize: 12,
                marginLeft: 16,
              }}
            >
              全部公告 &gt;
            </a>
          </div>
        </div>
      </div>

      {/* 2. 主体内容 */}
      <Spin spinning={loading}>
        <Row gutter={[24, 0]}>
          {" "}
          {/* 0 垂直间距，由内部 Col 控制 */}
          {/* === 左侧：产业链树谱 === */}
          <Col xs={24} lg={16} style={{ marginBottom: 24 }}>
            <Card
              title={
                <Space>
                  <EnvironmentOutlined style={{ color: "#1890ff" }} />
                  <span style={{ fontWeight: 600 }}>全景产业链树谱</span>
                  <Tag color="blue">数字医疗</Tag>
                </Space>
              }
              bordered={false}
              style={{ ...styles.card, height: "100%" }} // height 100% 确保左侧撑满
              bodyStyle={{ padding: 24 }}
            >
              <div
                style={{
                  background: "#f5f7fa",
                  padding: "16px 24px",
                  borderRadius: 8,
                  marginBottom: 24,
                }}
              >
                <Row gutter={24}>
                  {keyMetrics.map((m, idx) => (
                    <Col
                      span={8}
                      key={idx}
                      style={{
                        textAlign: "center",
                        borderRight: idx !== 2 ? "1px solid #e8e8e8" : "none",
                      }}
                    >
                      <div
                        style={{ fontSize: 13, color: "#666", marginBottom: 4 }}
                      >
                        {m.label}
                      </div>
                      <div>
                        <span
                          style={{
                            fontSize: 24,
                            fontWeight: "bold",
                            color:
                              idx === 0
                                ? "#1890ff"
                                : idx === 1
                                  ? "#52c41a"
                                  : "#fa8c16",
                          }}
                        >
                          {m.value}
                        </span>
                        <span
                          style={{ fontSize: 12, color: "#999", marginLeft: 4 }}
                        >
                          {m.suffix}
                        </span>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>

              <Collapse
                defaultActiveKey={["upstream", "midstream", "downstream"]}
                ghost
                expandIconPosition="end"
              >
                {chainData.map((cat) => (
                  <Panel
                    key={cat.type}
                    header={
                      <Space>
                        <span style={{ fontWeight: 600, fontSize: 15 }}>
                          {cat.title}
                        </span>
                        <Badge
                          count={cat.total}
                          overflowCount={9999}
                          style={{
                            backgroundColor: "#e6f7ff",
                            color: "#1890ff",
                          }}
                        />
                      </Space>
                    }
                    style={{ marginBottom: 16 }}
                  >
                    <List
                      grid={{ gutter: 16, xs: 2, sm: 3, md: 3, lg: 3, xl: 4 }}
                      dataSource={cat.subTags}
                      renderItem={(tag: any) => (
                        <List.Item style={{ marginBottom: 16 }}>
                          <Tooltip
                            title={
                              tag.isWeak
                                ? "存在缺口，建议关注"
                                : `收录 ${tag.count} 家`
                            }
                          >
                            <div
                              style={{
                                ...styles.tagCard,
                                ...(tag.isWeak ? styles.tagCardWeak : {}),
                              }}
                              onClick={() =>
                                navigate(`/industry-class?tag=${tag.name}`)
                              }
                              onMouseEnter={(e) => {
                                e.currentTarget.style.boxShadow =
                                  "0 4px 12px rgba(0,0,0,0.1)";
                                e.currentTarget.style.transform =
                                  "translateY(-2px)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.boxShadow = "none";
                                e.currentTarget.style.transform =
                                  "translateY(0)";
                              }}
                            >
                              <div
                                style={{
                                  fontSize: 13,
                                  fontWeight: 500,
                                  color: tag.isWeak ? "#d46b08" : "#333",
                                  marginBottom: 8,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                }}
                              >
                                {tag.name}
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                  {tag.count}
                                </Text>
                                {tag.isWeak && (
                                  <ThunderboltFilled
                                    style={{ color: "#fa8c16" }}
                                  />
                                )}
                              </div>
                            </div>
                          </Tooltip>
                        </List.Item>
                      )}
                    />
                  </Panel>
                ))}
              </Collapse>
            </Card>
          </Col>
          {/* === 右侧：分析看板 (紧凑布局) === */}
          <Col xs={24} lg={8}>
            {/* 优化：减小 Row gutter 的垂直间距到 12 */}
            <Row gutter={[24, 12]}>
              {/* 1. 资质构成 */}
              <Col span={24}>
                <Card
                  title="企业资质构成"
                  size="small"
                  bordered={false}
                  style={styles.card}
                >
                  <Row gutter={[8, 8]}>
                    {" "}
                    {/* 内部间距更紧凑 */}
                    {chaoyangStats.map((item, idx) => (
                      <Col span={8} key={idx}>
                        <div
                          style={{
                            textAlign: "center",
                            background: "#fafafa",
                            padding: "8px 0",
                            borderRadius: 4,
                          }}
                        >
                          <div
                            style={{
                              color: item.color,
                              fontSize: 16,
                              marginBottom: 4,
                            }}
                          >
                            {item.icon}
                          </div>
                          <div style={{ fontWeight: "bold", color: "#333" }}>
                            {item.value}
                          </div>
                          <div style={{ fontSize: 11, color: "#999" }}>
                            {item.label}
                          </div>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Card>
              </Col>

              {/* 2. 产业生态圈 */}
              <Col span={24}>
                <Card
                  title="产业生态圈"
                  size="small"
                  bordered={false}
                  style={styles.card}
                >
                  <Row gutter={[8, 8]}>
                    {ecologyCategories.map((cat) => (
                      <Col span={8} key={cat.name}>
                        <div
                          style={{
                            textAlign: "center",
                            cursor: "pointer",
                            padding: "8px 0",
                            borderRadius: 4,
                            border: "1px solid #f0f0f0",
                            transition: "all 0.3s",
                          }}
                          onClick={() => navigate("/industry-class")}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.borderColor = "#1890ff")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.borderColor = "#f0f0f0")
                          }
                        >
                          <div
                            style={{
                              color: "#1890ff",
                              fontSize: 16,
                              marginBottom: 4,
                            }}
                          >
                            {cat.icon}
                          </div>
                          <div style={{ fontSize: 12, color: "#333" }}>
                            {cat.name}
                          </div>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Card>
              </Col>

              {/* 3. 热门标签 */}
              <Col span={24}>
                <Card
                  title="热门产业标签"
                  size="small"
                  bordered={false}
                  style={styles.card}
                >
                  <Space size={[8, 8]} wrap>
                    {hotTags.map((tag, i) => (
                      <Tag
                        key={tag}
                        color={i < 3 ? "blue" : "default"}
                        style={{ cursor: "pointer", margin: 0 }}
                        onClick={() => navigate(`/industry-class?tag=${tag}`)}
                      >
                        #{tag}
                      </Tag>
                    ))}
                  </Space>
                </Card>
              </Col>

              {/* 4. 热门街道 */}
              <Col span={24}>
                <Card
                  title="热门区域分布"
                  size="small"
                  extra={<FireOutlined style={{ color: "#ff4d4f" }} />}
                  bordered={false}
                  style={styles.card}
                >
                  <List
                    dataSource={hotspotStreets}
                    size="small"
                    renderItem={(item, i) => (
                      <List.Item
                        style={{
                          padding: "6px 0",
                          borderBottom: "1px dashed #f0f0f0",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            width: "100%",
                          }}
                        >
                          <Badge
                            count={i + 1}
                            style={{
                              background: i < 3 ? "#ff4d4f" : "#d9d9d9",
                              boxShadow: "none",
                              marginRight: 8,
                            }}
                          />
                          <span style={{ flex: 1, fontSize: 13 }}>
                            {item.name}
                          </span>
                          <Progress
                            percent={item.percent}
                            size="small"
                            showInfo={false}
                            strokeColor={i < 3 ? "#ff4d4f" : "#1890ff"}
                            style={{ width: 60, marginRight: 8 }}
                          />
                          <span
                            style={{
                              fontSize: 12,
                              color: "#999",
                              width: 40,
                              textAlign: "right",
                            }}
                          >
                            {item.count}
                          </span>
                        </div>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>

              {/* 5. 补链建议 (独立成行 span=24) */}
              <Col span={24}>
                <Card
                  title={
                    <span style={{ color: "#fa8c16", fontSize: 13 }}>
                      <LinkOutlined /> 补链建议
                    </span>
                  }
                  size="small"
                  bordered={false}
                  style={{ ...styles.card, borderTop: "2px solid #fa8c16" }}
                  bodyStyle={{ padding: 12 }}
                >
                  <List
                    size="small"
                    dataSource={weakLinksFull.slice(0, 3)}
                    renderItem={(item) => (
                      <List.Item style={{ padding: "6px 0" }}>
                        <Space
                          style={{
                            width: "100%",
                            justifyContent: "space-between",
                          }}
                        >
                          <Text
                            ellipsis
                            style={{ fontSize: 12, maxWidth: 200 }}
                          >
                            {item.name}
                          </Text>
                          <Tag color="orange" style={{ margin: 0 }}>
                            缺口
                          </Tag>
                        </Space>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>

              {/* 6. 推荐引育 (独立成行 span=24) */}
              <Col span={24}>
                <Card
                  title={
                    <span style={{ color: "#1890ff", fontSize: 13 }}>
                      <AimOutlined /> 推荐引育
                    </span>
                  }
                  size="small"
                  bordered={false}
                  style={{ ...styles.card, borderTop: "2px solid #1890ff" }}
                  bodyStyle={{ padding: 12 }}
                >
                  <List
                    size="small"
                    dataSource={recommendEnterprisesFull.slice(0, 3)}
                    renderItem={(item) => (
                      <List.Item style={{ padding: "6px 0" }}>
                        <Space
                          style={{
                            width: "100%",
                            justifyContent: "space-between",
                          }}
                        >
                          <Text
                            ellipsis
                            style={{ fontSize: 12, maxWidth: 180 }}
                          >
                            {item.name}
                          </Text>
                          <span
                            style={{
                              color: "#52c41a",
                              fontWeight: "bold",
                              fontSize: 12,
                            }}
                          >
                            {item.match}
                          </span>
                        </Space>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Spin>

      {/* 3. 底部详细公告列表 */}
      <div id="notice-section" style={{ marginTop: 24 }}>
        <Card
          title={
            <>
              <SoundOutlined style={{ color: "#1890ff" }} /> 平台公告中心
            </>
          }
          extra={
            <Button type="link">
              查看更多 <ArrowRightOutlined />
            </Button>
          }
          bordered={false}
          style={styles.card}
        >
          <List
            grid={{ gutter: 24, column: 2 }}
            dataSource={notices}
            renderItem={(item) => (
              <List.Item>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderBottom: "1px solid #f0f0f0",
                    paddingBottom: 12,
                    width: "100%",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flex: 1,
                      overflow: "hidden",
                    }}
                  >
                    <Tag
                      color={
                        item.type === "通知"
                          ? "blue"
                          : item.type === "系统"
                            ? "red"
                            : "green"
                      }
                    >
                      {item.type}
                    </Tag>
                    <Text
                      ellipsis
                      style={{ cursor: "pointer", maxWidth: "80%" }}
                    >
                      {item.title}
                    </Text>
                  </div>
                  <span style={{ color: "#999", fontSize: 13, marginLeft: 16 }}>
                    {item.date}
                  </span>
                </div>
              </List.Item>
            )}
          />
        </Card>
      </div>

      <FloatButton.Group
        trigger="hover"
        style={{ right: 24, bottom: 80 }}
        icon={<RobotOutlined />}
      >
        <FloatButton tooltip="风险预警" icon={<SafetyCertificateOutlined />} />
        <FloatButton
          tooltip="AI 产业链助手"
          icon={<RobotOutlined />}
          type="primary"
        />
      </FloatButton.Group>

      <Modal
        title="补链建议"
        open={isWeakModalVisible}
        onCancel={() => setIsWeakModalVisible(false)}
        footer={null}
      />
      <Modal
        title="引育推荐"
        open={isRecModalVisible}
        onCancel={() => setIsRecModalVisible(false)}
        footer={null}
      />
    </div>
  );
};

export default Overview;
