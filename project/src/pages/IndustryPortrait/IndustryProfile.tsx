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
  Divider,
} from "antd";
import {
  RadarChartOutlined,
  SafetyOutlined,
  FallOutlined,
  RightOutlined,
  TrophyOutlined,
  ExperimentOutlined,
  ThunderboltOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";
import { Radar } from "@ant-design/plots";
import type { DataNode } from "antd/es/tree";

const { Content, Sider } = Layout;
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
  const [data, setData] = useState<any>(null);
  const [selectedIndustry, setSelectedIndustry] = useState(""); // 初始为空，等待树选择

  // Drawers & UI Control
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [selectedDimension, setSelectedDimension] = useState<any>(null);
  const [riskListVisible, setRiskListVisible] = useState(false);
  const [riskListType, setRiskListType] = useState<"high" | "low">("high");

  // Tree Data
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [loadingTree, setLoadingTree] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

  // 1. 获取树数据
  useEffect(() => {
    const fetchTree = async () => {
      setLoadingTree(true);
      try {
        const response = await fetch("http://localhost:3001/api/industry/tree");
        const resData = await response.json();
        if (resData.success) {
          setTreeData(resData.data);
          // 默认展开第一层
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
        setData(null); // 无数据或未找到
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

  const handleDimensionClick = (dim: any) => {
    setSelectedDimension(dim);
    setDetailDrawerVisible(true);
  };

  const showRiskList = (type: "high" | "low") => {
    setRiskListType(type);
    setRiskListVisible(true);
  };

  return (
    <Layout style={{ minHeight: "85vh", background: "transparent" }}>
      {/* 左侧：常驻产业链树谱 */}
      <Sider
        width={280}
        theme="light"
        style={{
          background: "#fff",
          borderRadius: token.borderRadiusLG,
          marginRight: 24,
          boxShadow: token.boxShadowTertiary,
          overflowY: "auto",
          height: "100%",
        }}
      >
        <div style={{ padding: 16, borderBottom: "1px solid #f0f0f0" }}>
          <Title level={5} style={{ margin: 0 }}>
            <ApartmentOutlined /> 产业链导航
          </Title>
        </div>
        <div style={{ padding: 10 }}>
          {loadingTree ? (
            <Spin style={{ display: "block", margin: "20px auto" }} />
          ) : (
            <Tree
              treeData={treeData}
              expandedKeys={expandedKeys}
              onExpand={(keys) => setExpandedKeys(keys)}
              onSelect={(keys, info: any) => {
                // 只有点击具体的标签节点（非 root stage）才触发
                if (keys.length > 0 && !info.node.isStage) {
                  setSelectedIndustry(info.node.title as string);
                }
              }}
              height={700}
            />
          )}
        </div>
      </Sider>

      {/* 右侧：内容区 */}
      <Content>
        {/* 顶部搜索栏 */}
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
              {data?.basicInfo?.industryName ||
                selectedIndustry ||
                "请选择行业"}
            </Title>
            {data && (
              <Tag color="geekblue" style={{ marginLeft: 12 }}>
                收录企业: {data.basicInfo.totalCompanies} 家
              </Tag>
            )}
            {data && (
              <Tag color="gold">总资本: {data.basicInfo.totalCapital} 亿元</Tag>
            )}
          </div>
          <Input.Search
            placeholder="输入行业名称搜索..."
            allowClear
            onSearch={(val) => val && setSelectedIndustry(val)}
            style={{ width: 300 }}
          />
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 100 }}>
            <Spin size="large" tip="正在分析产业链数据..." />
          </div>
        ) : data ? (
          <>
            {/* 1. 评分概览区 */}
            <Row gutter={[24, 24]}>
              {/* 雷达图 */}
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

              {/* 维度评分卡片 */}
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

            {/* 2. 薄弱环节 & 风险评估 */}
            <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
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
                          description={item.reason}
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
                                  <Text style={{ width: 160 }} ellipsis>
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
                        label: "优质企业 TOP 5",
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
                                  <Text style={{ width: 160 }} ellipsis>
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
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span>
                请在左侧选择行业，或在上方搜索行业名称
                <br />
                <small style={{ color: "#999" }}>
                  提示：尝试点击"数字医疗"或搜索"生物医药"
                </small>
              </span>
            }
            style={{ marginTop: 100 }}
          />
        )}
      </Content>

      {/* --- Drawer 1: 维度详情 (增强版) --- */}
      <Drawer
        title={selectedDimension?.title || "维度详情"}
        placement="right"
        width={600}
        onClose={() => setDetailDrawerVisible(false)}
        open={detailDrawerVisible}
      >
        {selectedDimension && (
          <>
            <Paragraph type="secondary">{selectedDimension.desc}</Paragraph>

            {/* 新增：模型完整配置展示区 */}
            {selectedDimension.metaConfig &&
              selectedDimension.metaConfig.length > 0 && (
                <div
                  style={{
                    marginBottom: 24,
                    background: "#fafafa",
                    padding: 16,
                    borderRadius: 8,
                  }}
                >
                  <Title level={5} style={{ marginTop: 0 }}>
                    评分模型配置
                  </Title>
                  <Table
                    dataSource={selectedDimension.metaConfig}
                    columns={[
                      {
                        title: "评分维度",
                        dataIndex: "dimension_name",
                        width: "60%",
                      },
                      {
                        title: "标准分/权重",
                        dataIndex: "weight",
                        render: (text) => <Tag>{text}</Tag>,
                      },
                    ]}
                    pagination={false}
                    size="small"
                    scroll={{ y: 200 }}
                  />
                  <div style={{ marginTop: 8, textAlign: "right" }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      * 以上为该模型包含的所有考察维度，系统据此计算综合得分
                    </Text>
                  </div>
                </div>
              )}

            <Divider>当前行业得分详情</Divider>

            <Table
              dataSource={selectedDimension.subRules}
              columns={[
                { title: "关键指标", dataIndex: "name" },
                {
                  title: "当前数值",
                  dataIndex: "value",
                  render: (text) => <Text strong>{text}</Text>,
                },
                {
                  title: "计算得分",
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
            { title: "说明", dataIndex: "reason" },
          ]}
          pagination={{ pageSize: 15 }}
          size="small"
        />
      </Drawer>
    </Layout>
  );
};

export default IndustryProfile;
