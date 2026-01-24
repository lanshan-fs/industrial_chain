import React, { useState, useEffect } from "react";
import {
  Layout,
  Input,
  Button,
  Drawer,
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
  Alert,
  Spin,
  theme,
  Empty,
  Tabs,
} from "antd";
import {
  MenuUnfoldOutlined,
  RadarChartOutlined,
  SafetyOutlined,
  FallOutlined,
  RightOutlined,
  TrophyOutlined,
  ExperimentOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { Radar } from "@ant-design/plots";
import type { DataNode } from "antd/es/tree";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

// 映射图标
const DIMENSION_ICONS: Record<string, React.ReactNode> = {
  foundation: <TrophyOutlined style={{ fontSize: 24, color: "#faad14" }} />,
  tech: <ExperimentOutlined style={{ fontSize: 24, color: "#1890ff" }} />,
  ability: <ThunderboltOutlined style={{ fontSize: 24, color: "#52c41a" }} />,
};

const IndustryProfile: React.FC = () => {
  const { token } = theme.useToken();

  // State
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null); // 存储后端返回的完整数据
  const [selectedIndustry, setSelectedIndustry] = useState("生物医药");

  // Drawers
  const [treeDrawerVisible, setTreeDrawerVisible] = useState(false);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [selectedDimension, setSelectedDimension] = useState<any>(null); // 当前选中的维度详情
  const [riskListVisible, setRiskListVisible] = useState(false);
  const [riskListType, setRiskListType] = useState<"high" | "low">("high");

  // Tree Data
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [loadingTree, setLoadingTree] = useState(false);

  // 1. 获取树数据
  useEffect(() => {
    const fetchTree = async () => {
      setLoadingTree(true);
      try {
        const response = await fetch("http://localhost:3001/api/industry/tree");
        const resData = await response.json();
        if (resData.success) {
          setTreeData(resData.data);
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
      if (resData.success) {
        setData(resData.data);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedIndustry) {
      fetchProfile(selectedIndustry);
    }
  }, [selectedIndustry]);

  // 雷达图配置
  const radarConfig = {
    data: data?.radarData || [],
    xField: "item",
    yField: "score",
    area: { style: { fillOpacity: 0.2 } },
    scale: { y: { min: 0, max: 100 } },
    axis: {
      x: { grid: { line: { style: { stroke: "#d9d9d9", lineDash: [4, 4] } } } },
    },
    style: { lineWidth: 2 },
  };

  // 处理维度卡片点击
  const handleDimensionClick = (dim: any) => {
    setSelectedDimension(dim);
    setDetailDrawerVisible(true);
  };

  // 处理风险列表点击
  const showRiskList = (type: "high" | "low") => {
    setRiskListType(type);
    setRiskListVisible(true);
  };

  if (loading && !data) {
    return (
      <div style={{ textAlign: "center", padding: 50 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout style={{ background: "transparent" }}>
      {/* 1. 顶部操作栏 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
          background: "#fff",
          padding: "16px 24px",
          borderRadius: token.borderRadiusLG,
          boxShadow: token.boxShadowTertiary,
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <Title level={4} style={{ margin: 0, marginRight: 24 }}>
            {selectedIndustry}
            <Tag
              color="geekblue"
              style={{ marginLeft: 12, fontWeight: "normal" }}
            >
              {data?.basicInfo?.totalCompanies || 0} 家企业
            </Tag>
          </Title>
          <Input.Search
            placeholder="搜索行业..."
            allowClear
            onSearch={(val) => val && setSelectedIndustry(val)}
            style={{ width: 260 }}
          />
        </div>
        <Button
          icon={<MenuUnfoldOutlined />}
          onClick={() => setTreeDrawerVisible(true)}
        >
          切换行业
        </Button>
      </div>

      <Content style={{ minHeight: 280 }}>
        {data ? (
          <>
            <Row gutter={[24, 24]}>
              {/* 左侧：综合评分雷达 */}
              <Col xs={24} lg={10} xl={9}>
                <Card
                  title={
                    <Space>
                      <RadarChartOutlined /> 行业综合评分
                    </Space>
                  }
                  style={{ height: "100%" }}
                  extra={
                    <Text
                      strong
                      style={{ fontSize: 24, color: token.colorPrimary }}
                    >
                      {data.totalScore}
                    </Text>
                  }
                >
                  <div style={{ height: 320 }}>
                    <Radar {...radarConfig} />
                  </div>
                </Card>
              </Col>

              {/* 右侧：三个维度评分 (List Style) */}
              <Col xs={24} lg={14} xl={15}>
                <Row gutter={[16, 16]}>
                  {data.dimensions.map((dim: any) => (
                    <Col span={24} key={dim.key}>
                      <Card
                        hoverable
                        onClick={() => handleDimensionClick(dim)}
                        bodyStyle={{ padding: "20px 24px" }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <div
                              style={{
                                width: 56,
                                height: 56,
                                borderRadius: "50%",
                                background: "#f5f5f5",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginRight: 24,
                              }}
                            >
                              {DIMENSION_ICONS[dim.key] || <TrophyOutlined />}
                            </div>
                            <div>
                              <Title level={5} style={{ margin: 0 }}>
                                {dim.title}
                              </Title>
                              <Text type="secondary" style={{ fontSize: 13 }}>
                                {dim.desc}
                              </Text>
                              <div style={{ marginTop: 4 }}>
                                <Tag color="blue">权重: {dim.weight}</Tag>
                              </div>
                            </div>
                          </div>
                          <div style={{ textAlign: "right", minWidth: 120 }}>
                            <Statistic
                              value={dim.score}
                              suffix="/ 100"
                              valueStyle={{ fontSize: 22, fontWeight: "bold" }}
                            />
                            <Progress
                              percent={dim.score}
                              showInfo={false}
                              size="small"
                              strokeColor={token.colorPrimary}
                            />
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              点击查看详情{" "}
                              <RightOutlined style={{ fontSize: 10 }} />
                            </Text>
                          </div>
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Col>
            </Row>

            {/* 下半部分：薄弱环节与风险评估 */}
            <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
              {/* 薄弱环节 (静态 Mock + 动态逻辑) */}
              <Col xs={24} md={12}>
                <Card
                  title={
                    <Space>
                      <FallOutlined /> 薄弱环节识别
                    </Space>
                  }
                  style={{ height: "100%" }}
                >
                  <Alert
                    message="基于产业链数据的自动分析结果"
                    type="info"
                    showIcon
                    style={{ marginBottom: 16 }}
                  />
                  {/* 这里暂时保留部分静态数据展示样式，实际应从后端 weakLinks 字段获取 */}
                  <List
                    itemLayout="horizontal"
                    dataSource={[
                      {
                        name: "核心原材料",
                        level: "高危",
                        reason: "本地配套率 < 10%",
                      },
                      { name: "高端设备", level: "中危", reason: "依赖进口" },
                    ]}
                    renderItem={(item, index) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={
                            <Badge
                              count={index + 1}
                              color={item.level === "高危" ? "red" : "orange"}
                            />
                          }
                          title={item.name}
                          description={`${item.reason}`}
                        />
                        <Tag color={item.level === "高危" ? "red" : "orange"}>
                          {item.level}
                        </Tag>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>

              {/* 风险评估 (高风险/低风险企业列表) */}
              <Col xs={24} md={12}>
                <Card
                  title={
                    <Space>
                      <SafetyOutlined /> 风险评估
                    </Space>
                  }
                  style={{ height: "100%" }}
                  extra={
                    <Space>
                      <Button
                        size="small"
                        danger
                        onClick={() => showRiskList("high")}
                      >
                        高风险名单
                      </Button>
                      <Button
                        size="small"
                        type="primary"
                        ghost
                        onClick={() => showRiskList("low")}
                      >
                        优质企业名单
                      </Button>
                    </Space>
                  }
                >
                  <Tabs
                    defaultActiveKey="high"
                    items={[
                      {
                        key: "high",
                        label: "高风险企业 TOP 5",
                        children: (
                          <List
                            dataSource={data.risks.high.slice(0, 5)}
                            renderItem={(item: any) => (
                              <List.Item
                                actions={[
                                  <Tag color="red">{item.score}分</Tag>,
                                ]}
                              >
                                <Space>
                                  <Text style={{ width: 180 }} ellipsis>
                                    {item.name}
                                  </Text>
                                  <Text
                                    type="secondary"
                                    style={{ fontSize: 12 }}
                                  >
                                    {item.reason}
                                  </Text>
                                </Space>
                              </List.Item>
                            )}
                          />
                        ),
                      },
                      {
                        key: "low",
                        label: "低风险(优质) TOP 5",
                        children: (
                          <List
                            dataSource={data.risks.low.slice(0, 5)}
                            renderItem={(item: any) => (
                              <List.Item
                                actions={[
                                  <Tag color="green">{item.score}分</Tag>,
                                ]}
                              >
                                <Space>
                                  <Text style={{ width: 180 }} ellipsis>
                                    {item.name}
                                  </Text>
                                  <Tag color="success">经营稳健</Tag>
                                </Space>
                              </List.Item>
                            )}
                          />
                        ),
                      },
                    ]}
                  />
                </Card>
              </Col>
            </Row>
          </>
        ) : (
          <Empty description="请搜索或选择行业查看画像" />
        )}
      </Content>

      {/* --- Drawer 1: 维度详情 --- */}
      <Drawer
        title={selectedDimension?.title || "维度详情"}
        placement="right"
        width={500}
        onClose={() => setDetailDrawerVisible(false)}
        open={detailDrawerVisible}
      >
        {selectedDimension && (
          <>
            <Paragraph type="secondary">{selectedDimension.desc}</Paragraph>
            <Table
              dataSource={selectedDimension.subRules}
              columns={[
                { title: "指标名称", dataIndex: "name" },
                {
                  title: "当前数值",
                  dataIndex: "value",
                  render: (text) => <Text strong>{text}</Text>,
                },
                {
                  title: "得分",
                  dataIndex: "score",
                  render: (score) => (
                    <Tag color={score > 80 ? "green" : "orange"}>{score}</Tag>
                  ),
                },
              ]}
              pagination={false}
              size="small"
              bordered
            />
            <div style={{ marginTop: 24 }}>
              <Alert
                message="评分规则说明"
                description="得分基于系统配置的权重与阈值自动计算。如需调整规则，请联系系统管理员前往【系统管理】模块。"
                type="info"
                showIcon
              />
            </div>
          </>
        )}
      </Drawer>

      {/* --- Drawer 2: 完整企业名单 --- */}
      <Drawer
        title={riskListType === "high" ? "高风险企业名单" : "优质企业名单"}
        placement="right"
        width={500}
        onClose={() => setRiskListVisible(false)}
        open={riskListVisible}
      >
        <Table
          dataSource={
            riskListType === "high" ? data?.risks.high : data?.risks.low
          }
          columns={[
            { title: "企业名称", dataIndex: "name" },
            {
              title: "评分",
              dataIndex: "score",
              sorter: (a: any, b: any) => a.score - b.score,
            },
            { title: "状态", dataIndex: "reason" },
          ]}
          pagination={{ pageSize: 15 }}
          size="small"
        />
      </Drawer>

      {/* --- Drawer 3: 行业选择树 --- */}
      <Drawer
        title="切换行业"
        placement="right"
        onClose={() => setTreeDrawerVisible(false)}
        open={treeDrawerVisible}
        width={400}
      >
        {loadingTree ? (
          <Spin />
        ) : (
          <Tree
            treeData={treeData}
            height={600}
            onSelect={(keys, info: any) => {
              if (keys.length > 0) {
                setSelectedIndustry(info.node.title as string);
                setTreeDrawerVisible(false);
              }
            }}
          />
        )}
      </Drawer>
    </Layout>
  );
};

export default IndustryProfile;
