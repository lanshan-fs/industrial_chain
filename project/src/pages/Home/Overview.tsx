import React, { useState, useEffect, useRef } from "react";
import {
  Row,
  Col,
  List,
  Tag,
  Typography,
  Collapse,
  FloatButton,
  Badge,
  Tooltip,
  Button,
  Spin,
  message,
  Carousel,
  Input,
  Tabs,
  Space,
  Divider,
  Modal,
  Table,
  Progress,
  Avatar,
  Rate,
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
  CopyrightOutlined,
  GithubOutlined,
  RightOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type { ColumnsType } from "antd/es/table";

// 引入自定义组件
import MoreButton from "../../components/Home/MoreButton";
import RankList, { type RankItem } from "../../components/Home/RankList";
import SuggestionList, {
  type SuggestionItem,
} from "../../components/Home/SuggestionList";
import StatsGrid, { type StatItem } from "../../components/Home/StatsGrid";

const { Title, Text } = Typography;
const { Panel } = Collapse;

// ================== 数据定义接口 ==================

// 弹窗用：补链建议数据结构
interface WeakLinkDetail {
  id: string;
  name: string;
  layer: string;
  urgency: number;
  count: number;
}

// 弹窗用：推荐引育数据结构
interface RecommendEnterpriseDetail {
  id: string;
  name: string;
  matchScore: number;
  location: string;
  tags: string[];
}

// ================== 静态数据准备 ==================

// 1. 顶部驾驶舱关键指标
const keyMetrics = [
  { label: "收录总数", value: 2853, suffix: "家", color: "#fff" },
  { label: "综合评分", value: 85.2, suffix: "分", color: "#73d13d" },
  { label: "协同效率", value: 78.5, suffix: "%", color: "#ffec3d" },
];

// 2. 企业资质分布
const chaoyangStatsRaw = [
  { label: "上市企业", value: 35, icon: <GlobalOutlined />, color: "#cf1322" },
  { label: "外资企业", value: 128, icon: <GlobalOutlined />, color: "#d48806" },
  { label: "独角兽", value: 12, icon: <CrownOutlined />, color: "#eb2f96" },
  { label: "专精特新", value: 185, icon: <TrophyOutlined />, color: "#722ed1" },
  { label: "高新技术", value: 456, icon: <RocketOutlined />, color: "#1890ff" },
  { label: "科技中小", value: 890, icon: <ShopOutlined />, color: "#52c41a" },
  { label: "上市企业", value: 35, icon: <GlobalOutlined />, color: "#cf1322" },
  { label: "外资企业", value: 128, icon: <GlobalOutlined />, color: "#d48806" },
  { label: "独角兽", value: 12, icon: <CrownOutlined />, color: "#eb2f96" },
];

// 3. 热门区域分布
const hotspotStreets: RankItem[] = [
  { name: "酒仙桥街道", count: 156, percent: 85 },
  { name: "望京街道", count: 132, percent: 72 },
  { name: "朝外街道", count: 98, percent: 54 },
  { name: "大屯街道", count: 76, percent: 42 },
  { name: "奥运村街道", count: 65, percent: 36 },
  { name: "建外街道", count: 54, percent: 30 },
  { name: "三里屯", count: 42, percent: 25 },
  { name: "呼家楼", count: 38, percent: 22 },
  { name: "团结湖", count: 35, percent: 20 },
  { name: "麦子店", count: 29, percent: 18 },
  { name: "劲松街道", count: 25, percent: 15 },
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

// 6. 热门产业标签
const hotTagsData: RankItem[] = [
  { name: "生物医药", count: 320, percent: 90 },
  { name: "跨境电商", count: 280, percent: 82 },
  { name: "元宇宙", count: 210, percent: 70 },
  { name: "自动驾驶", count: 180, percent: 65 },
  { name: "绿色能源", count: 150, percent: 55 },
  { name: "区块链", count: 120, percent: 45 },
  { name: "SaaS", count: 98, percent: 35 },
  { name: "智能制造", count: 85, percent: 30 },
  { name: "光子计算", count: 60, percent: 20 },
  { name: "工业互联", count: 45, percent: 15 },
];

// 7. 产业生态圈分类
const ecologyCategoriesRaw = [
  { name: "科研院校", icon: <BankOutlined />, count: 42 },
  { name: "行业协会", icon: <ClusterOutlined />, count: 15 },
  { name: "投资基金", icon: <RiseOutlined />, count: 88 },
  { name: "孵化器", icon: <BulbOutlined />, count: 26 },
  { name: "专业园区", icon: <EnvironmentOutlined />, count: 18 },
  { name: "概念验证", icon: <ExperimentOutlined />, count: 9 },
  { name: "科研院校", icon: <BankOutlined />, count: 42 },
  { name: "行业协会", icon: <ClusterOutlined />, count: 15 },
  { name: "投资基金", icon: <RiseOutlined />, count: 88 },
];

// ================== 主页面组件 ==================

const Overview: React.FC = () => {
  const navigate = useNavigate();
  const carouselRef = useRef<any>(null);

  // 状态管理
  const [loading, setLoading] = useState(true);
  const [chainData, setChainData] = useState<any[]>([]);

  // 首页展示用的简略数据
  const [weakLinksFull, setWeakLinksFull] = useState<SuggestionItem[]>([]);
  const [recommendEnterprisesFull, setRecommendEnterprisesFull] = useState<
    SuggestionItem[]
  >([]);

  // 弹窗展示用的详细数据
  const [weakLinksDetail, setWeakLinksDetail] = useState<WeakLinkDetail[]>([]);
  const [recEnterprisesDetail, setRecEnterprisesDetail] = useState<
    RecommendEnterpriseDetail[]
  >([]);

  const [searchScope, setSearchScope] = useState("industry");
  const [activeNoticeIndex, setActiveNoticeIndex] = useState(0);

  // 弹窗控制
  const [isWeakLinksModalVisible, setIsWeakLinksModalVisible] = useState(false);
  const [isRecModalVisible, setIsRecModalVisible] = useState(false);

  // 企业资质统计
  const chaoyangStatsData: StatItem[] = chaoyangStatsRaw.map((item) => ({
    icon: item.icon,
    value: item.value,
    label: item.label,
    color: item.color,
    onClick: () => {
      message.loading(`正在筛选：${item.label}`);
      navigate(
        `/industry-class?qualification=${encodeURIComponent(item.label)}`,
      );
    },
  }));

  // 生态圈统计
  const ecologyStatsData: StatItem[] = ecologyCategoriesRaw.map((item) => ({
    icon: item.icon,
    value: item.count,
    label: item.name,
    color: "#1890ff",
    onClick: () =>
      navigate(`/industry-class?ecology=${encodeURIComponent(item.name)}`),
  }));

  // 初始化数据 - 恢复原接口逻辑
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. 尝试调用真实接口
        const response = await fetch(
          "http://localhost:3001/api/dashboard/overview",
        );
        const json = await response.json();

        if (json.success) {
          setChainData(json.data.chainData);
          // 计算补链建议（从接口数据衍生）
          const computedWeakLinks = json.data.chainData.flatMap((layer: any) =>
            layer.subTags
              .filter((t: any) => t.isWeak)
              .map((t: any) => ({ name: t.name, highlight: true })),
          );
          setWeakLinksFull(computedWeakLinks);

          // 如果接口返回了详细数据则使用，否则使用模拟数据填充弹窗
          generateModalData(computedWeakLinks);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        // 2. 接口失败，使用 Fallback 数据 (原封不动拿回)
        const fallbackChainData = [
          {
            title: "上游 · 研发与技术",
            type: "upstream",
            total: 120,
            subTags: [
              { name: "芯片设计", count: 40 },
              { name: "算法模型", count: 30, isWeak: true },
              { name: "EDA工具", count: 12 },
              { name: "IP核", count: 8, isWeak: true },
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
        ];
        setChainData(fallbackChainData);

        const fallbackWeakLinks = [
          { name: "光刻机零部件", highlight: true },
          { name: "工业级操作系统", highlight: true },
          { name: "高性能传感器", highlight: true },
          { name: "车规级芯片", highlight: true },
          { name: "精密减速器", highlight: true },
        ];
        setWeakLinksFull(fallbackWeakLinks);
        generateModalData(fallbackWeakLinks);
      } finally {
        setLoading(false);
      }
    };

    // 生成弹窗所需的详细数据 (模拟扩展，避免过于复杂)
    const generateModalData = (basicLinks: any[]) => {
      // 补链弹窗数据
      const details = basicLinks.map((item: any, index: number) => ({
        id: String(index),
        name: item.name,
        layer: index % 2 === 0 ? "上游-核心组件" : "中游-关键设备",
        urgency: index < 3 ? 5 : 4,
        count: Math.floor(Math.random() * 10),
      }));
      setWeakLinksDetail(details);

      // 引育弹窗数据 (静态模拟)
      setRecEnterprisesDetail([
        {
          id: "1",
          name: "北京神州生物原料有限公司",
          matchScore: 98,
          location: "北京·海淀",
          tags: ["生物医药", "专精特新"],
        },
        {
          id: "2",
          name: "中关村工业软件研发院",
          matchScore: 95,
          location: "北京·海淀",
          tags: ["工业软件", "国资背景"],
        },
        {
          id: "3",
          name: "京北医药冷链物流集团",
          matchScore: 92,
          location: "北京·顺义",
          tags: ["物流服务", "独角兽"],
        },
        {
          id: "4",
          name: "智谱AI科技有限公司",
          matchScore: 90,
          location: "北京·海淀",
          tags: ["人工智能", "大模型"],
        },
        {
          id: "5",
          name: "寒武纪科技股份有限公司",
          matchScore: 89,
          location: "北京·海淀",
          tags: ["芯片设计", "上市企业"],
        },
      ]);
    };

    fetchData();

    // 首页展示的简略推荐企业
    setRecommendEnterprisesFull([
      { name: "北京神州生物原料有限公司", desc: "匹配度 98%" },
      { name: "中关村工业软件研发院", desc: "匹配度 95%" },
      { name: "京北医药冷链物流集团", desc: "匹配度 92%" },
      { name: "智谱AI科技有限公司", desc: "匹配度 90%" },
      { name: "寒武纪科技股份有限公司", desc: "匹配度 89%" },
    ]);
  }, []);

  const handleListNoticeClick = (index: number) => {
    if (carouselRef.current) {
      carouselRef.current.goTo(index);
    }
    setActiveNoticeIndex(index);
  };

  const styles = {
    fullWidthContainer: {
      width: "100vw",
      position: "relative" as const,
      left: "50%",
      right: "50%",
      marginLeft: "-50vw",
      marginRight: "-50vw",
    },
    bannerSection: {
      background: "linear-gradient(135deg, #001529 0%, #003a8c 100%)",
      padding: "60px 0 60px 0",
      marginBottom: 0,
    },
    noticeBarSection: {
      background: "#fffbe6",
      borderBottom: "1px solid #ffe58f",
      height: 40,
    },
    contentInner: {
      maxWidth: 1280,
      margin: "0 auto",
      padding: "0 24px",
    },
    panelContainer: {
      background: "#fff",
      border: "1px solid #f0f0f0",
      marginTop: 24,
    },
    panelLeft: {
      borderRight: "1px solid #f0f0f0",
      padding: 24,
    },
    panelRightItem: {
      borderBottom: "1px solid #f0f0f0",
      padding: "16px 24px",
    },
    panelHeader: {
      fontSize: 16,
      fontWeight: 600,
      color: "#333",
      marginBottom: 16,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    tagCard: {
      cursor: "pointer",
      borderRadius: 4,
      padding: "8px 12px",
      background: "#fff",
      border: "1px solid #f0f0f0",
      transition: "all 0.3s",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      height: 48,
    },
    tagCardWeak: {
      background: "#fff7e6",
      border: "1px solid #ffd591",
    },
    footer: {
      background: "#001529",
      padding: "40px 0 20px 0",
      color: "rgba(255,255,255,0.65)",
      marginTop: 24,
      textAlign: "center" as const,
      fontSize: 14,
    },
  };

  const handleSearch = (value: string) => {
    message.info(`正在搜索 [${searchScope}]：${value}`);
    navigate(`/industry-class?q=${value}`);
  };

  // 弹窗表格列定义 (简化版)
  const weakLinkColumns: ColumnsType<WeakLinkDetail> = [
    {
      title: "序号",
      dataIndex: "id",
      key: "id",
      width: 80,
      align: "center",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "行业环节名称",
      dataIndex: "name",
      key: "name",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "所属产业链层级",
      dataIndex: "layer",
      key: "layer",
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "紧缺指数",
      dataIndex: "urgency",
      key: "urgency",
      width: 150,
      sorter: (a, b) => a.urgency - b.urgency,
      render: (value) => (
        <Rate
          disabled
          defaultValue={value}
          style={{ fontSize: 14, color: "#fa8c16" }}
        />
      ),
    },
    {
      title: "操作",
      key: "action",
      width: 100,
      align: "center",
      render: (_, record) => (
        <Button
          type="link"
          size="small"
          onClick={() => navigate(`/industry-class?tag=${record.name}`)}
        >
          查看
        </Button>
      ),
    },
  ];

  return (
    <div>
      {/* 1. 顶部全屏 Banner (搜索区块) */}
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
                .home-search-tabs .ant-tabs-tab { 
                    color: rgba(255,255,255,0.7); 
                    font-size: 16px; 
                    padding: 8px 0; 
                    margin-right: 32px; 
                    transition: color 0.3s;
                }
                .home-search-tabs .ant-tabs-tab-active .ant-tabs-tab-btn { 
                    color: #fff !important; 
                    font-weight: 600; 
                    font-size: 16px;
                    text-shadow: 0 0 0.25px currentColor;
                }
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
                      onClick={() => navigate("/advanced-search")}
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

              {/* 热搜区域 */}
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
        </div>
      </div>

      {/* 1.5 新增：独立公告轮播条 */}
      <div style={{ ...styles.fullWidthContainer, ...styles.noticeBarSection }}>
        <div
          style={{
            ...styles.contentInner,
            height: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <SoundOutlined
            style={{
              color: "#fa8c16",
              marginRight: 12,
              fontSize: 16,
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1, minWidth: 0, height: 40 }}>
            <Carousel
              ref={carouselRef}
              autoplay
              dots={false}
              effect="scrollx"
              afterChange={(current) => setActiveNoticeIndex(current)}
              style={{
                width: "100%",
                height: 40,
                lineHeight: "40px",
              }}
            >
              {notices.map((n) => (
                <div key={n.id} style={{ width: "100%", height: 40 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      height: "100%",
                      cursor: "pointer",
                      paddingRight: 16,
                    }}
                    onClick={() =>
                      document
                        .getElementById("notice-section")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    <Tag
                      color="orange"
                      style={{ marginRight: 8, flexShrink: 0 }}
                    >
                      {n.type}
                    </Tag>
                    <span
                      style={{
                        color: "#333",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        marginRight: 8,
                      }}
                    >
                      {n.title}
                    </span>
                    <span
                      style={{
                        color: "#999",
                        fontSize: 12,
                        flexShrink: 0,
                      }}
                    >
                      {n.date}
                    </span>
                  </div>
                </div>
              ))}
            </Carousel>
          </div>
          <a
            onClick={() =>
              document
                .getElementById("notice-section")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            style={{
              color: "#1890ff",
              fontSize: 13,
              marginLeft: 24,
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            更多公告 &gt;
          </a>
        </div>
      </div>

      {/* 2. 主体内容 */}
      <Spin spinning={loading}>
        <div style={styles.panelContainer}>
          <Row gutter={0}>
            {/* === 左侧：产业链树谱 + 补链 + 引育 === */}
            <Col xs={24} lg={16} style={styles.panelLeft}>
              <div style={styles.panelHeader}>
                <Space>
                  <EnvironmentOutlined style={{ color: "#1890ff" }} />
                  <span>全景产业链树谱</span>
                  <Tag color="blue">数字医疗</Tag>
                </Space>
                <MoreButton onClick={() => navigate("/industry-class")} />
              </div>

              {/* 关键指标 */}
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

              {/* 产业链树谱 */}
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
                      grid={{ gutter: 16, xs: 2, sm: 2, md: 3, lg: 4, xl: 4 }}
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
                            >
                              <div
                                style={{
                                  fontWeight: 500,
                                  color: tag.isWeak ? "#d46b08" : "#333",
                                  flex: 1,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
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
                                <Text
                                  type="secondary"
                                  style={{ fontSize: 12, marginRight: 4 }}
                                >
                                  {tag.count}家
                                </Text>
                                {tag.isWeak && (
                                  <ThunderboltFilled
                                    style={{ color: "#fa8c16", fontSize: 12 }}
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

              <div
                style={{ height: 1, background: "#f0f0f0", margin: "24px 0" }}
              />

              {/* 补链建议 & 推荐引育 */}
              <Row gutter={[24, 24]}>
                <Col span={24}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 16,
                    }}
                  >
                    <span style={{ fontSize: 16, fontWeight: 600 }}>
                      <LinkOutlined
                        style={{ color: "#fa8c16", marginRight: 8 }}
                      />
                      补链建议
                    </span>
                    <MoreButton
                      onClick={() => setIsWeakLinksModalVisible(true)}
                    />
                  </div>
                  <SuggestionList
                    data={weakLinksFull}
                    icon={<ThunderboltFilled />}
                    iconColor="#fa8c16"
                  />
                </Col>

                <Col span={24}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 16,
                      marginTop: 8,
                    }}
                  >
                    <span style={{ fontSize: 16, fontWeight: 600 }}>
                      <AimOutlined
                        style={{ color: "#1890ff", marginRight: 8 }}
                      />
                      推荐引育
                    </span>
                    <MoreButton onClick={() => setIsRecModalVisible(true)} />
                  </div>
                  <SuggestionList
                    data={recommendEnterprisesFull}
                    icon={<ShopOutlined />}
                    iconColor="#1890ff"
                  />
                </Col>
              </Row>
            </Col>

            {/* === 右侧：分析看板 === */}
            <Col xs={24} lg={8}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                {/* 1. 资质构成 */}
                <div style={styles.panelRightItem}>
                  <div style={styles.panelHeader}>企业资质构成</div>
                  <StatsGrid data={chaoyangStatsData} />
                </div>

                {/* 2. 产业生态圈 */}
                <div style={styles.panelRightItem}>
                  <div style={styles.panelHeader}>产业生态圈</div>
                  <StatsGrid data={ecologyStatsData} />
                </div>

                {/* 3. 热门产业标签 */}
                <div style={styles.panelRightItem}>
                  <div style={styles.panelHeader}>热门产业标签</div>
                  <RankList data={hotTagsData} colorScale={true} />
                </div>

                {/* 4. 热门区域分布 */}
                <div style={{ ...styles.panelRightItem, borderBottom: "none" }}>
                  <div style={styles.panelHeader}>热门区域分布</div>
                  <RankList
                    data={hotspotStreets}
                    colorScale={true}
                    limit={10}
                  />
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Spin>

      {/* 3. 底部详细公告列表 */}
      <div id="notice-section" style={{ marginTop: 24 }}>
        <div style={{ ...styles.panelContainer, padding: 24 }}>
          {/* Header */}
          <div style={styles.panelHeader}>
            <Space>
              <SoundOutlined style={{ color: "#1890ff" }} />
              <span>平台公告中心</span>
            </Space>
            <Button
              type="link"
              style={{ padding: 0, height: "auto" }}
              onClick={() => message.info("查看全部公告")}
            >
              查看全部 <ArrowRightOutlined />
            </Button>
          </div>

          <List
            grid={{ gutter: 60, column: 2 }}
            dataSource={notices}
            renderItem={(item, index) => (
              <List.Item style={{ marginBottom: 12 }}>
                <div
                  onClick={() => handleListNoticeClick(index)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderBottom: "1px solid #f0f0f0",
                    height: 52,
                    alignItems: "center",
                    width: "100%",
                    padding: "0 16px",
                    borderRadius: 4,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    background:
                      activeNoticeIndex === index ? "#e6f7ff" : "transparent",
                    borderLeft:
                      activeNoticeIndex === index
                        ? "4px solid #1890ff"
                        : "4px solid transparent",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flex: 1,
                      overflow: "hidden",
                      marginRight: 24,
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
                      style={{ marginRight: 12, flexShrink: 0 }}
                    >
                      {item.type}
                    </Tag>
                    <Text
                      ellipsis
                      style={{
                        fontSize: 14,
                        color: activeNoticeIndex === index ? "#1890ff" : "#333",
                        fontWeight: activeNoticeIndex === index ? 500 : 400,
                        flex: 1,
                      }}
                    >
                      {item.title}
                    </Text>
                  </div>
                  <span
                    style={{
                      color: "#999",
                      fontSize: 13,
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                  >
                    {item.date}
                  </span>
                </div>
              </List.Item>
            )}
          />
        </div>
      </div>

      {/* 4. Footer */}
      <div style={{ ...styles.fullWidthContainer, ...styles.footer }}>
        <div style={styles.contentInner}>
          <Row gutter={[32, 32]}>
            <Col xs={24} md={8} style={{ textAlign: "left" }}>
              <div
                style={{
                  color: "#fff",
                  fontSize: 18,
                  fontWeight: "bold",
                  marginBottom: 16,
                }}
              >
                朝阳区产业链洞察平台
              </div>
              <div style={{ marginBottom: 8 }}>
                专注于朝阳区产业数据分析与辅助决策
              </div>
              <div>
                <CopyrightOutlined /> 2026
              </div>
            </Col>
            <Col xs={24} md={8} style={{ textAlign: "left" }}>
              <div style={{ color: "#fff", fontSize: 16, marginBottom: 16 }}>
                快速链接
              </div>
              <Space
                direction="vertical"
                style={{ color: "rgba(255,255,255,0.65)" }}
              >
                <a style={{ color: "inherit" }} onClick={() => navigate("/")}>
                  首页
                </a>
                <a
                  style={{ color: "inherit" }}
                  onClick={() => navigate("/industry-class")}
                >
                  产业分类
                </a>
                <a
                  style={{ color: "inherit" }}
                  onClick={() => navigate("/industry-score")}
                >
                  产业评分
                </a>
                <a
                  style={{ color: "inherit" }}
                  onClick={() => navigate("/industry-portrait")}
                >
                  行业画像
                </a>
                <a
                  style={{ color: "inherit" }}
                  onClick={() => navigate("/industry-diag")}
                >
                  智能诊断
                </a>
              </Space>
            </Col>
            <Col xs={24} md={8} style={{ textAlign: "left" }}>
              <div style={{ color: "#fff", fontSize: 16, marginBottom: 16 }}>
                联系我们
              </div>
              <div style={{ marginBottom: 8 }}>
                地址：北京市朝阳区日坛北街33号
              </div>
              <div style={{ marginBottom: 8 }}>电话：010-6509XXXX</div>
              <div>邮箱：support@chaoyang.gov.cn</div>
            </Col>
          </Row>
          <Divider
            style={{ borderColor: "rgba(255,255,255,0.15)", margin: "24px 0" }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>京ICP备20260001号-1</span>
            <Space size="large">
              <GithubOutlined style={{ fontSize: 20, cursor: "pointer" }} />
              <GlobalOutlined style={{ fontSize: 20, cursor: "pointer" }} />
            </Space>
          </div>
        </div>
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

      {/* ============== 弹窗 1：补链建议（统一宽度 800，简化表格） ============== */}
      <Modal
        title={
          <Space>
            <ThunderboltFilled style={{ color: "#fa8c16" }} />
            <span style={{ fontSize: 16, fontWeight: 600 }}>
              重点补链行业建议
            </span>
          </Space>
        }
        open={isWeakLinksModalVisible}
        onCancel={() => setIsWeakLinksModalVisible(false)}
        footer={null}
        width={800} // 统一宽度
        styles={{ body: { padding: "20px 24px" } }}
      >
        <div style={{ marginBottom: 16, color: "#666" }}>
          <InfoCircleOutlined style={{ marginRight: 6, color: "#1890ff" }} />
          基于全产业链图谱分析，以下环节存在产能或技术缺口，建议重点关注。
        </div>
        <Table
          dataSource={weakLinksDetail}
          columns={weakLinkColumns}
          rowKey="id"
          pagination={false}
          size="middle"
          bordered
          scroll={{ y: 400 }}
        />
      </Modal>

      {/* ============== 弹窗 2：推荐引育（统一宽度 800，简化列表） ============== */}
      <Modal
        title={
          <Space>
            <ShopOutlined style={{ color: "#1890ff" }} />
            <span style={{ fontSize: 16, fontWeight: 600 }}>
              推荐引育企业库
            </span>
          </Space>
        }
        open={isRecModalVisible}
        onCancel={() => setIsRecModalVisible(false)}
        footer={null}
        width={800} // 统一宽度
        styles={{ body: { padding: "20px 24px" } }}
      >
        <div style={{ marginBottom: 16, color: "#666" }}>
          <InfoCircleOutlined style={{ marginRight: 6, color: "#1890ff" }} />
          智能匹配高潜力企业，助力产业强链补链。
        </div>
        <List
          itemLayout="horizontal"
          dataSource={recEnterprisesDetail}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button
                  key="view"
                  type="primary"
                  ghost
                  size="small"
                  onClick={() => {
                    setIsRecModalVisible(false);
                    navigate(
                      `/industry-portrait/enterprise-profile?company=${encodeURIComponent(
                        item.name,
                      )}`,
                    );
                  }}
                >
                  查看详情
                </Button>,
              ]}
              style={{
                padding: "12px 16px",
                border: "1px solid #f0f0f0",
                borderRadius: 4,
                marginBottom: 12,
                transition: "all 0.3s",
              }}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    shape="square"
                    size="large"
                    style={{ backgroundColor: "#e6f7ff", color: "#1890ff" }}
                  >
                    {item.name.substring(0, 1)}
                  </Avatar>
                }
                title={
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span style={{ fontWeight: 600 }}>{item.name}</span>
                  </div>
                }
                description={
                  <Space size={12} style={{ marginTop: 4 }}>
                    <Tag bordered={false}>{item.location}</Tag>
                    {item.tags.map((tag) => (
                      <Tag key={tag} color="blue" bordered={false}>
                        {tag}
                      </Tag>
                    ))}
                  </Space>
                }
              />
              <div
                style={{
                  width: 140,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  justifyContent: "center",
                  marginRight: 24,
                }}
              >
                <div style={{ fontSize: 12, color: "#999", marginBottom: 4 }}>
                  匹配度
                </div>
                <Progress
                  percent={item.matchScore}
                  size="small"
                  strokeColor="#1890ff"
                />
              </div>
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
};

export default Overview;
