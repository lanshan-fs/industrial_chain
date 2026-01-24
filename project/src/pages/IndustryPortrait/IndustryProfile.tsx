import React, { useState, useEffect } from "react";
import {
  Layout,
  Input,
  Button,
  Tree,
  Typography,
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  Space,
  List,
  Progress,
  Badge,
  Spin,
  Empty,
  Tabs,
  Divider,
  Grid,
} from "antd";
import {
  SafetyOutlined,
  FallOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Radar } from "@ant-design/plots";
import type { DataNode } from "antd/es/tree";

const { Content, Sider } = Layout;
const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

// --- 样式常量 ---
const COLORS = {
  primary: "#1677ff",
  success: "#52c41a",
  warning: "#faad14",
  error: "#f5222d",
  bgGray: "#f5f5f5", // 背景灰
};

// 紧凑型卡片样式
const COMPACT_CARD_STYLE = {
  body: { padding: "12px 16px" },
  header: { padding: "0 16px", minHeight: "40px" }, // 压缩标题高度
};

const IndustryProfile: React.FC = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  // State
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [selectedIndustry, setSelectedIndustry] = useState("");

  // UI Control
  const [riskListType, setRiskListType] = useState<"high" | "low">("high");

  // Tree Data
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [loadingTree, setLoadingTree] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);

  // 1. 获取树数据
  useEffect(() => {
    const fetchTree = async () => {
      setLoadingTree(true);
      try {
        const response = await fetch("http://localhost:3001/api/industry/tree");
        const resData = await response.json();
        if (resData.success) {
          setTreeData(resData.data);
          if (resData.data.length > 0) {
            setExpandedKeys(resData.data.map((node: any) => node.key));
          }
        }
      } catch (error) {
        console.error("Failed to fetch tree:", error);
      } finally {
        setLoadingTree(false);
      }
    };
    fetchTree();
  }, []);

  // 2. 获取行业画像数据
  const fetchProfile = async (industry: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3001/api/industry/profile?industryName=${encodeURIComponent(industry)}`,
      );
      const resData = await response.json();
      if (resData.success && resData.data) {
        setData(resData.data);
      } else {
        setData(null);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedIndustry) {
      fetchProfile(selectedIndustry);
    }
  }, [selectedIndustry]);

  // 雷达图配置 (紧凑版)
  const radarConfig = {
    data: data?.radarData || [],
    xField: "item",
    yField: "score",
    area: {
      style: {
        fill: `l(90) 0:${COLORS.primary} 1:rgba(255,255,255,0.2)`,
        fillOpacity: 0.3,
      },
    },
    line: { style: { stroke: COLORS.primary, lineWidth: 2 } },
    point: { size: 3, shape: "circle" },
    scale: { y: { min: 0, max: 100, tickCount: 5 } },
    axis: {
      x: { grid: { line: { style: { stroke: "#eee" } } } },
      y: { grid: { line: { style: { stroke: "#eee" } } } },
    },
    legend: false,
    height: 200, // 限制高度
  };

  // 渲染左侧树
  const renderTree = () => (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #f0f0f0" }}>
        <Input.Search placeholder="搜索产业链节点" size="small" />
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
        {loadingTree ? (
          <Spin style={{ display: "block", margin: "20px auto" }} />
        ) : (
          <Tree
            treeData={treeData}
            expandedKeys={expandedKeys}
            autoExpandParent={autoExpandParent}
            onExpand={(keys) => {
              setExpandedKeys(keys);
              setAutoExpandParent(false);
            }}
            onSelect={(keys, info: any) => {
              if (keys.length > 0 && !info.node.isStage) {
                setSelectedIndustry(info.node.title as string);
              }
            }}
            blockNode
            style={{ fontSize: "13px" }}
          />
        )}
      </div>
    </div>
  );

  return (
    <Layout style={{ minHeight: "85vh", background: COLORS.bgGray }}>
      {/* 1. 左侧常驻产业链树谱 (复用产业分类样式) */}
      <Sider
        width={260}
        theme="light"
        style={{
          borderRight: "1px solid #e8e8e8",
          position: isMobile ? "absolute" : "static",
          zIndex: 10,
          height: "100%",
        }}
        breakpoint="lg"
        collapsedWidth="0"
      >
        {renderTree()}
      </Sider>

      {/* 2. 右侧内容区 */}
      <Content style={{ padding: "12px", overflowY: "auto" }}>
        {/* 顶部简易面包屑/标题栏 (极简) */}
        {!data && !loading && (
          <Empty description="请在左侧选择行业" style={{ marginTop: 100 }} />
        )}

        {loading ? (
          <div style={{ textAlign: "center", padding: 100 }}>
            <Spin size="large" />
          </div>
        ) : (
          data && (
            <Space direction="vertical" size={12} style={{ width: "100%" }}>
              {/* 顶部标题栏 */}
              <Card size="small" bodyStyle={{ padding: "12px 16px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Space>
                    <Title level={4} style={{ margin: 0 }}>
                      {data.basicInfo.industryName}
                    </Title>
                    <Tag color="blue">
                      {data.basicInfo.totalCompanies} 家企业
                    </Tag>
                  </Space>
                  <Space>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      数据更新于：2026-01-24
                    </Text>
                    <Button size="small" type="primary" ghost>
                      导出报告
                    </Button>
                  </Space>
                </div>
              </Card>

              {/* 第一行：评分 + 雷达 + 核心维度 (高密度布局) */}
              <Row gutter={[12, 12]}>
                {/* 区块 1: 综合评分 */}
                <Col xs={24} md={6} lg={5} xl={4}>
                  <Card
                    title="行业综合评分"
                    size="small"
                    headStyle={COMPACT_CARD_STYLE.header}
                    bodyStyle={{
                      ...COMPACT_CARD_STYLE.body,
                      textAlign: "center",
                      height: 240,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <Statistic
                      value={data.totalScore}
                      valueStyle={{
                        fontSize: 48,
                        fontWeight: "bold",
                        color: COLORS.primary,
                      }}
                    />
                    <div style={{ marginTop: 8 }}>
                      <Tag
                        color={data.totalScore >= 80 ? "green" : "orange"}
                        style={{ fontSize: 14, padding: "4px 12px" }}
                      >
                        评级：
                        {data.totalScore >= 85
                          ? "AAA"
                          : data.totalScore >= 70
                            ? "AA"
                            : "B"}
                      </Tag>
                    </div>
                    <Divider style={{ margin: "16px 0" }} />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-around",
                        width: "100%",
                      }}
                    >
                      <Statistic
                        title="排名"
                        value={3}
                        valueStyle={{ fontSize: 16 }}
                      />
                      <Statistic
                        title="击败"
                        value="92%"
                        valueStyle={{ fontSize: 16 }}
                      />
                    </div>
                  </Card>
                </Col>

                {/* 区块 2: 多维雷达 */}
                <Col xs={24} md={8} lg={7} xl={6}>
                  <Card
                    title="多维能力模型"
                    size="small"
                    headStyle={COMPACT_CARD_STYLE.header}
                    bodyStyle={{
                      ...COMPACT_CARD_STYLE.body,
                      height: 240,
                      padding: 0,
                    }}
                  >
                    <div style={{ height: "100%", padding: "10px" }}>
                      <Radar {...radarConfig} />
                    </div>
                  </Card>
                </Col>

                {/* 区块 3: 核心指标矩阵 (高密度表格) */}
                <Col xs={24} md={10} lg={12} xl={14}>
                  <Card
                    title="核心维度拆解"
                    size="small"
                    headStyle={COMPACT_CARD_STYLE.header}
                    bodyStyle={{
                      ...COMPACT_CARD_STYLE.body,
                      height: 240,
                      overflowY: "auto",
                      padding: 0,
                    }}
                  >
                    <Table
                      dataSource={data.dimensions.flatMap((d: any) =>
                        d.subRules.map((rule: any) => ({
                          ...rule,
                          category: d.title,
                          key: d.key + rule.name,
                        })),
                      )}
                      pagination={false}
                      size="small"
                      columns={[
                        {
                          title: "维度",
                          dataIndex: "category",
                          width: 100,
                          onCell: (_, index) => {
                            // 简单的合并行逻辑，为了Demo效果先固定
                            if (index === 0) return { rowSpan: 2 };
                            if (index === 1) return { rowSpan: 0 };
                            if (index === 2) return { rowSpan: 2 };
                            if (index === 3) return { rowSpan: 0 };
                            if (index === 4) return { rowSpan: 2 };
                            if (index === 5) return { rowSpan: 0 };
                            return {};
                          },
                          render: (text) => <Tag>{text}</Tag>,
                        },
                        {
                          title: "指标项",
                          dataIndex: "name",
                          width: 120,
                          render: (text) => (
                            <Text type="secondary">{text}</Text>
                          ),
                        },
                        {
                          title: "当前数值",
                          dataIndex: "value",
                          render: (text) => <Text strong>{text}</Text>,
                        },
                        {
                          title: "得分",
                          dataIndex: "score",
                          width: 80,
                          render: (score) => (
                            <Progress
                              percent={score}
                              size="small"
                              showInfo={false}
                              strokeColor={
                                score > 80 ? COLORS.success : COLORS.warning
                              }
                            />
                          ),
                        },
                        {
                          title: "",
                          dataIndex: "score",
                          width: 40,
                          render: (s) => (
                            <span style={{ fontSize: 12 }}>{s}</span>
                          ),
                        },
                      ]}
                    />
                  </Card>
                </Col>
              </Row>

              {/* 第二行：风险与薄弱环节 (并列) */}
              <Row gutter={[12, 12]}>
                <Col xs={24} md={12}>
                  <Card
                    size="small"
                    title={
                      <Space>
                        <FallOutlined style={{ color: COLORS.warning }} />{" "}
                        薄弱环节识别
                      </Space>
                    }
                    headStyle={COMPACT_CARD_STYLE.header}
                  >
                    <List
                      size="small"
                      dataSource={[
                        {
                          name: "核心原材料",
                          level: "高危",
                          reason: "本地配套率 < 10%",
                          icon: <SafetyOutlined />,
                        },
                        {
                          name: "高端设备",
                          level: "中危",
                          reason: "依赖进口",
                          icon: <InfoCircleOutlined />,
                        },
                        {
                          name: "专业人才",
                          level: "中危",
                          reason: "缺口约 500 人",
                          icon: <InfoCircleOutlined />,
                        },
                      ]}
                      renderItem={(item) => (
                        <List.Item>
                          <List.Item.Meta
                            title={
                              <span style={{ fontSize: 13 }}>{item.name}</span>
                            }
                            description={
                              <span style={{ fontSize: 12, color: "#999" }}>
                                {item.reason}
                              </span>
                            }
                          />
                          <Tag color={item.level === "高危" ? "red" : "orange"}>
                            {item.level}
                          </Tag>
                        </List.Item>
                      )}
                    />
                  </Card>
                </Col>

                <Col xs={24} md={12}>
                  <Card
                    size="small"
                    title={
                      <Space>
                        <SafetyOutlined style={{ color: COLORS.error }} />{" "}
                        企业风险监控
                      </Space>
                    }
                    headStyle={COMPACT_CARD_STYLE.header}
                    extra={
                      <Tabs
                        size="small"
                        activeKey={riskListType}
                        onChange={(k) => setRiskListType(k as any)}
                        items={[
                          { key: "high", label: "高风险" },
                          { key: "low", label: "优质企业" },
                        ]}
                        tabBarStyle={{ marginBottom: 0 }}
                      />
                    }
                  >
                    <List
                      size="small"
                      dataSource={
                        riskListType === "high"
                          ? data.risks.high.slice(0, 3)
                          : data.risks.low.slice(0, 3)
                      }
                      renderItem={(item: any) => (
                        <List.Item>
                          <div
                            style={{
                              width: "100%",
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Space>
                              <Badge
                                status={
                                  riskListType === "high" ? "error" : "success"
                                }
                              />
                              <Text style={{ fontSize: 13 }} ellipsis>
                                {item.name}
                              </Text>
                            </Space>
                            <Space size="small">
                              <Text type="secondary" style={{ fontSize: 12 }}>
                                {item.reason}
                              </Text>
                              <Tag
                                bordered={false}
                                color={
                                  riskListType === "high" ? "red" : "green"
                                }
                              >
                                {item.score}分
                              </Tag>
                            </Space>
                          </div>
                        </List.Item>
                      )}
                    />
                  </Card>
                </Col>
              </Row>

              {/* 第三行：行业 Top 企业列表 (增加信息密度) */}
              <Card
                title="行业重点企业一览"
                size="small"
                headStyle={COMPACT_CARD_STYLE.header}
              >
                <Table
                  size="small"
                  dataSource={data.risks.low.slice(0, 5)} // 复用优质企业数据作为Top企业
                  pagination={false}
                  columns={[
                    { title: "排名", render: (_, __, i) => i + 1, width: 60 },
                    {
                      title: "企业名称",
                      dataIndex: "name",
                      render: (t) => <a href="#">{t}</a>,
                    },
                    {
                      title: "注册资本",
                      dataIndex: "score",
                      render: (s) => `${(s * 120).toFixed(0)} 万`,
                    }, // Mock数据
                    {
                      title: "综合评分",
                      dataIndex: "score",
                      render: (s) => (
                        <Text strong style={{ color: COLORS.primary }}>
                          {s}
                        </Text>
                      ),
                    },
                    {
                      title: "企业标签",
                      render: () => (
                        <Space size={4}>
                          <Tag style={{ fontSize: 10 }}>高新</Tag>
                          <Tag style={{ fontSize: 10 }}>专精特新</Tag>
                        </Space>
                      ),
                    },
                  ]}
                />
              </Card>
            </Space>
          )
        )}
      </Content>
    </Layout>
  );
};

export default IndustryProfile;
