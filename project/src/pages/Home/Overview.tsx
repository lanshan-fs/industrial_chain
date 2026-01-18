import React, { useState, useMemo } from "react";
import {
  Row,
  Col,
  Card,
  Tree,
  Statistic,
  List,
  Avatar,
  Tag,
  Typography,
  theme,
  ConfigProvider,
} from "antd";
import type { TreeDataNode } from "antd";
// 移除 Column 组件引用，因为不再使用柱状图
import {
  ShopOutlined,
  DashboardOutlined,
  ThunderboltFilled,
  ApartmentOutlined,
  SafetyCertificateOutlined,
  TrophyOutlined,
  GlobalOutlined,
  RocketOutlined,
  BankOutlined,
  CrownOutlined,
  RiseOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

// --- 1. 模拟数据 ---

// 标签树数据 (1-3级)
const tagTreeData: TreeDataNode[] = [
  {
    title: "产业链全景",
    key: "all",
    children: [
      {
        title: "上游研发",
        key: "upstream",
        children: [
          { title: "基础研究", key: "basic-research" },
          { title: "原料供应", key: "raw-material" },
        ],
      },
      {
        title: "中游制造",
        key: "midstream",
        children: [
          { title: "设备生产", key: "equipment" },
          { title: "软件开发", key: "software" },
          { title: "系统集成", key: "integration" },
        ],
      },
      {
        title: "下游服务",
        key: "downstream",
        children: [
          { title: "医疗服务", key: "medical-service" },
          { title: "健康管理", key: "health-mgmt" },
        ],
      },
    ],
  },
];

interface EnterpriseItem {
  id: string;
  title: string;
  tagKey: string;
  tagName: string;
  score: number;
  description: string;
}

const allEnterprises: EnterpriseItem[] = [
  {
    id: "1",
    title: "北京数字医疗科技有限公司",
    tagKey: "software",
    tagName: "软件开发",
    score: 92,
    description: "AI影像识别算法领军企业",
  },
  {
    id: "2",
    title: "朝阳区智慧康养中心",
    tagKey: "medical-service",
    tagName: "医疗服务",
    score: 88,
    description: "智慧养老示范试点单位",
  },
  {
    id: "3",
    title: "未来生物制药实验室",
    tagKey: "basic-research",
    tagName: "基础研究",
    score: 95,
    description: "国家级生物医药重点实验室",
  },
  {
    id: "4",
    title: "健安医疗器械厂",
    tagKey: "equipment",
    tagName: "设备生产",
    score: 81,
    description: "家用健康监测设备制造商",
  },
  {
    id: "5",
    title: "云端健康数据平台",
    tagKey: "integration",
    tagName: "系统集成",
    score: 89,
    description: "区域医疗数据互联互通平台",
  },
];

// 新增：企业资质类型统计数据 (模拟您提到的分类排布)
const enterpriseTypeStats = [
  {
    label: "上市企业",
    value: 12,
    icon: <GlobalOutlined />,
    color: "#cf1322", // 红色系
    bg: "rgba(207, 19, 34, 0.1)",
  },
  {
    label: "拟上市企业",
    value: 8,
    icon: <RiseOutlined />,
    color: "#d48806", // 橙色系
    bg: "rgba(212, 136, 6, 0.1)",
  },
  {
    label: "独角兽企业",
    value: 3,
    icon: <CrownOutlined />,
    color: "#eb2f96", // 粉色系
    bg: "rgba(235, 47, 150, 0.1)",
  },
  {
    label: "专精特新",
    value: 45,
    icon: <TrophyOutlined />,
    color: "#722ed1", // 紫色系
    bg: "rgba(114, 46, 209, 0.1)",
  },
  {
    label: "高新技术",
    value: 156,
    icon: <RocketOutlined />,
    color: "#1890ff", // 蓝色系
    bg: "rgba(24, 144, 255, 0.1)",
  },
  {
    label: "科技中小",
    value: 380,
    icon: <ShopOutlined />,
    color: "#52c41a", // 绿色系
    bg: "rgba(82, 196, 26, 0.1)",
  },
];

// --- 2. 页面组件 ---

const Overview: React.FC = () => {
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>(["all"]);

  // 筛选逻辑
  const filteredData = useMemo(() => {
    const key = selectedKeys[0];
    if (!key || key === "all") return allEnterprises;

    const keyMap: Record<string, string[]> = {
      upstream: ["basic-research", "raw-material"],
      midstream: ["equipment", "software", "integration"],
      downstream: ["medical-service", "health-mgmt"],
    };

    if (keyMap[key as string]) {
      return allEnterprises.filter((item) =>
        keyMap[key as string].includes(item.tagKey)
      );
    }
    return allEnterprises.filter((item) => item.tagKey === key);
  }, [selectedKeys]);

  // 大屏配色方案
  const dashboardColors = {
    bg: "linear-gradient(180deg, #001529 0%, #000c17 100%)", // 深空蓝背景
    cardBg: "rgba(255, 255, 255, 0.04)", // 玻璃拟态卡片背景
    accent: "#1890ff", // 科技蓝
    border: "rgba(255,255,255,0.1)",
    textSecondary: "rgba(255, 255, 255, 0.65)",
  };

  const handleSelect = (keys: React.Key[]) => {
    if (keys.length > 0) setSelectedKeys(keys);
  };

  return (
    // 使用 ConfigProvider 强制局部暗色模式
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
          // Hack: 使用负 margin 抵消父容器的 padding，营造全屏沉浸感
          margin: "-24px",
          padding: "24px",
          minHeight: "calc(100% + 48px)",
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
              <DashboardOutlined
                style={{ marginRight: 12, color: dashboardColors.accent }}
              />
              产业链数据驾驶舱
            </Title>
            <Text
              style={{ color: dashboardColors.textSecondary, fontSize: 12 }}
            >
              REGIONAL INDUSTRIAL CHAIN DATA DASHBOARD
            </Text>
          </div>
          <div style={{ textAlign: "right" }}>
            <Tag color="blue" style={{ margin: 0 }}>
              实时监控中
            </Tag>
          </div>
        </div>

        <Row gutter={[20, 20]}>
          {/* 左侧：标签筛选 (侧边控制面板风格) */}
          <Col xs={24} md={6}>
            <Card
              title={
                <span style={{ color: dashboardColors.accent }}>
                  {" "}
                  <ApartmentOutlined /> 环节透视
                </span>
              }
              bordered={false}
              style={{
                height: "100%",
                minHeight: 600,
                borderLeft: `2px solid ${dashboardColors.accent}`, // 科技感左边框
              }}
            >
              <Tree
                showLine
                defaultExpandedKeys={["all", "upstream", "midstream"]}
                selectedKeys={selectedKeys}
                onSelect={handleSelect}
                treeData={tagTreeData}
                style={{ background: "transparent" }}
              />
            </Card>
          </Col>

          {/* 右侧：数据展示区 */}
          <Col xs={24} md={18}>
            {/* 1. 关键指标卡片 (Key Metrics) */}
            <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
              <Col xs={24} sm={8}>
                <Card bordered={false} hoverable>
                  <Statistic
                    title={
                      <span style={{ color: dashboardColors.textSecondary }}>
                        收录企业总数
                      </span>
                    }
                    value={filteredData.length}
                    suffix={<span style={{ fontSize: 14 }}>家</span>}
                    valueStyle={{ color: "#fff", fontWeight: "bold" }}
                    prefix={
                      <BankOutlined style={{ color: dashboardColors.accent }} />
                    }
                  />
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card bordered={false} hoverable>
                  <Statistic
                    title={
                      <span style={{ color: dashboardColors.textSecondary }}>
                        平均健康度评分
                      </span>
                    }
                    value={
                      filteredData.length > 0
                        ? filteredData.reduce(
                            (acc, cur) => acc + cur.score,
                            0
                          ) / filteredData.length
                        : 0
                    }
                    precision={1}
                    valueStyle={{ color: "#52c41a", fontWeight: "bold" }}
                    prefix={<SafetyCertificateOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card bordered={false} hoverable>
                  <Statistic
                    title={
                      <span style={{ color: dashboardColors.textSecondary }}>
                        产业链活跃度
                      </span>
                    }
                    value={88.5}
                    suffix="%"
                    valueStyle={{ color: "#f5222d", fontWeight: "bold" }}
                    prefix={<ThunderboltFilled />}
                  />
                </Card>
              </Col>
            </Row>

            {/* 2. 企业资质分布态势 (Grid Layout) - 替换了原来的图表 */}
            <Card
              title={<span style={{ color: "#fff" }}>企业资质分布态势</span>}
              bordered={false}
              style={{ marginBottom: 20 }}
            >
              <Row gutter={[16, 16]}>
                {enterpriseTypeStats.map((item, index) => (
                  <Col xs={24} sm={12} md={8} key={index}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "16px 20px",
                        background: item.bg, // 动态背景色
                        borderRadius: "8px",
                        border: `1px solid ${item.color}`, // 动态边框色
                        transition: "all 0.3s",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-4px)";
                        e.currentTarget.style.boxShadow = `0 4px 12px ${item.bg}`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      {/* 图标区 */}
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "50%",
                          background: item.color,
                          color: "#fff",
                          fontSize: 24,
                          marginRight: 16,
                          boxShadow: `0 0 10px ${item.color}`,
                        }}
                      >
                        {item.icon}
                      </div>

                      {/* 文字区 */}
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            color: "rgba(255,255,255,0.7)",
                            fontSize: 13,
                            marginBottom: 4,
                          }}
                        >
                          {item.label}
                        </div>
                        <div
                          style={{
                            fontSize: 24,
                            fontWeight: "bold",
                            color: "#fff",
                            lineHeight: 1,
                          }}
                        >
                          {item.value}{" "}
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: "normal",
                              color: "rgba(255,255,255,0.5)",
                            }}
                          >
                            家
                          </span>
                        </div>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </Card>

            {/* 3. 重点关注主体列表 */}
            <Card
              title={
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ color: "#fff" }}>重点关注主体</span>
                  <Tag color="cyan">
                    当前视图：
                    {selectedKeys[0] === "all" ? "全产业链" : selectedKeys[0]}
                  </Tag>
                </div>
              }
              bordered={false}
            >
              <List
                itemLayout="horizontal"
                dataSource={filteredData}
                pagination={{
                  pageSize: 3,
                  simple: true,
                  style: { color: "white" },
                }}
                renderItem={(item) => (
                  <List.Item
                    style={{
                      borderBottom: `1px solid ${dashboardColors.border}`,
                    }}
                    actions={[
                      <a key="detail" style={{ color: dashboardColors.accent }}>
                        深度画像
                      </a>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          style={{
                            backgroundColor: "rgba(24,144,255,0.2)",
                            color: dashboardColors.accent,
                            border: `1px solid ${dashboardColors.accent}`,
                          }}
                        >
                          {item.title[0]}
                        </Avatar>
                      }
                      title={
                        <span style={{ color: "#fff", fontSize: 15 }}>
                          {item.title}
                        </span>
                      }
                      description={
                        <span style={{ color: "rgba(255,255,255,0.45)" }}>
                          <Tag color="geekblue">{item.tagName}</Tag>{" "}
                          {item.description}
                        </span>
                      }
                    />
                    <div style={{ textAlign: "right", minWidth: 80 }}>
                      <div
                        style={{
                          fontSize: 20,
                          fontWeight: "bold",
                          color:
                            item.score >= 90
                              ? "#52c41a"
                              : dashboardColors.accent,
                          textShadow:
                            item.score >= 90
                              ? "0 0 10px rgba(82,196,26,0.3)"
                              : "none",
                        }}
                      >
                        {item.score}
                      </div>
                      <div
                        style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}
                      >
                        综合评分
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </ConfigProvider>
  );
};

export default Overview;
