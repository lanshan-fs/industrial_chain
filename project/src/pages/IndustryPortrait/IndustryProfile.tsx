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
  Alert,
  Spin,
  // theme,
  Empty,
  Divider,
  Grid,
  Modal,
  Tooltip,
} from "antd";
import {
  SafetyOutlined,
  FallOutlined,
  TrophyOutlined,
  ExperimentOutlined,
  ThunderboltOutlined,
  SearchOutlined,
  InfoCircleOutlined,
  FileTextOutlined,
  AppstoreOutlined,
  RiseOutlined,
  BankOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  DoubleRightOutlined,
} from "@ant-design/icons";
import { Radar } from "@ant-design/plots";
import type { DataNode } from "antd/es/tree";

const { Content, Sider } = Layout;
const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

// --- 视觉风格定义 ---
const COLORS = {
  primary: "#1890ff", // 科技蓝
  gold: "#faad14", // 基础金
  green: "#52c41a", // 能力绿
  riskHigh: "#ff4d4f",
  riskLow: "#52c41a",
  bg: "#f0f2f5", // 经典的 Ant Design Pro 灰底
};

// 紧凑表头样式
const CARD_HEAD_STYLE = { minHeight: 48, borderBottom: "1px solid #f0f0f0" };

// 大雷达配置
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

// 小雷达配置 (用于三个子模型)
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
      label: { style: { fontSize: 10, fill: "#666" } },
    },
    y: false,
  },
  legend: false,
  height: 160,
  padding: [10, 10, 10, 10],
});

const IndustryProfile: React.FC = () => {
  // const { token } = theme.useToken();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  // State
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [selectedIndustry, setSelectedIndustry] = useState("");

  // UI Control
  const [riskModalVisible, setRiskModalVisible] = useState(false);
  const [riskModalType, setRiskModalType] = useState<"high" | "low">("high");

  // Tree Data
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [loadingTree, setLoadingTree] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

  // 1. 获取树数据 (并做特殊处理：去上中下游，直接展示一级标签)
  useEffect(() => {
    const fetchTree = async () => {
      setLoadingTree(true);
      try {
        const response = await fetch("http://localhost:3001/api/industry/tree");
        const resData = await response.json();
        if (resData.success) {
          // --- 核心修改：数据打平 ---
          // 后端返回的是 [{title: '上游', children: [...]}, ...]
          // 我们需要提取所有的 children 组成一个新的根数组
          const flatTreeData = resData.data.reduce((acc: any[], stage: any) => {
            if (stage.children && stage.children.length > 0) {
              return [...acc, ...stage.children];
            }
            return acc;
          }, []);

          setTreeData(flatTreeData);

          // 默认展开第一层
          if (flatTreeData.length > 0) {
            setExpandedKeys(flatTreeData.map((node: any) => node.key));
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

  // 2. 获取行业画像
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
    if (selectedIndustry) fetchProfile(selectedIndustry);
  }, [selectedIndustry]);

  // 渲染左侧树谱 (导航样式 - 无搜索框，直接一级标签)
  const renderSider = () => (
    <Sider
      width={240}
      theme="light"
      style={{
        borderRight: "1px solid #f0f0f0",
        height: "calc(100vh - 64px)",
        position: isMobile ? "absolute" : "static",
        zIndex: 10,
        left: 0,
        background: "#fff",
      }}
      breakpoint="lg"
      collapsedWidth="0"
    >
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div
          style={{
            padding: "20px 16px 12px",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <Text strong style={{ fontSize: 16 }}>
            <AppstoreOutlined /> 行业分类导航
          </Text>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 8px" }}>
          {loadingTree ? (
            <Spin style={{ display: "block", margin: "20px auto" }} />
          ) : (
            <Tree
              treeData={treeData}
              expandedKeys={expandedKeys}
              onExpand={setExpandedKeys}
              onSelect={(keys, info: any) => {
                if (keys.length > 0) {
                  // 如果不是叶子节点(如1级标签)，也可以选择查看
                  setSelectedIndustry(
                    (info.node.title as string).split(" (")[0],
                  );
                }
              }}
              blockNode
              style={{ fontSize: 13 }}
            />
          )}
        </div>
      </div>
    </Sider>
  );

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
      {/* 上半部分：雷达 */}
      <div style={{ height: 160, marginBottom: 12 }}>
        <Radar {...MINI_RADAR_CONFIG(modelData.radar, color)} />
      </div>

      {/* 下半部分：维度权重得分表 */}
      <Table
        dataSource={modelData.dimensions}
        rowKey="name"
        pagination={false}
        size="small"
        bordered
        columns={[
          {
            title: "维度名称",
            dataIndex: "name",
            width: "38%",
            render: (t) => <Text style={{ fontSize: 12 }}>{t}</Text>,
          },
          {
            title: "权重",
            dataIndex: "weight",
            width: "25%",
            align: "center",
            render: (t) => (
              <Tag style={{ fontSize: 10, marginRight: 0 }}>{t}%</Tag>
            ),
          },
          {
            title: "得分",
            dataIndex: "score",
            width: "37%",
            align: "center",
            render: (s) => (
              <div style={{ display: "flex", alignItems: "center" }}>
                <Progress
                  percent={s}
                  size="small"
                  showInfo={false}
                  strokeColor={color}
                  style={{ width: 40, marginRight: 6 }}
                />
                <Text style={{ fontSize: 12 }}>{s}</Text>
              </div>
            ),
          },
        ]}
      />
    </Card>
  );

  return (
    <Layout style={{ minHeight: "85vh", background: COLORS.bg }}>
      {renderSider()}

      <Content
        style={{
          padding: "24px",
          overflowY: "auto",
          height: "calc(100vh - 64px)",
        }}
      >
        {/* 顶部搜索栏 (无面包屑，直接起手) */}
        <div
          style={{
            marginBottom: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Input.Search
            placeholder="请输入行业名称或企业关键词..."
            enterButton={
              <Button type="primary" icon={<SearchOutlined />}>
                画像搜索
              </Button>
            }
            size="large"
            style={{ maxWidth: 500, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
            onSearch={(val) => val && setSelectedIndustry(val)}
          />
          {data && (
            <Space>
              <Tooltip title="数据来源：工商/专利/招投标/舆情">
                <Tag icon={<InfoCircleOutlined />} color="default">
                  数据源接入正常
                </Tag>
              </Tooltip>
              <Button icon={<FileTextOutlined />}>导出报告</Button>
            </Space>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "100px 0" }}>
            <Spin size="large" tip="全维度数据计算中..." />
          </div>
        ) : !data ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span style={{ color: "#999" }}>
                请在左侧导航选择行业，或搜索行业名称
                <br />
                (示例：数字医疗)
              </span>
            }
            style={{ marginTop: 100 }}
          />
        ) : (
          <Space direction="vertical" size={20} style={{ width: "100%" }}>
            {/* 第一行：行业综合概览 (Dashboard 头部) */}
            <Card bordered={false} bodyStyle={{ padding: 24 }}>
              <Row gutter={24} align="middle">
                <Col
                  xs={24}
                  md={10}
                  style={{
                    borderRight: isMobile ? "none" : "1px solid #f0f0f0",
                  }}
                >
                  <Space direction="vertical" size={2}>
                    <Tag color="geekblue" style={{ marginBottom: 8 }}>
                      {data.basicInfo.industryName}
                    </Tag>
                    <Title
                      level={1}
                      style={{ margin: 0, fontSize: 48, color: COLORS.primary }}
                    >
                      {data.totalScore}
                      <span
                        style={{
                          fontSize: 16,
                          color: "#999",
                          fontWeight: "normal",
                          marginLeft: 8,
                        }}
                      >
                        / 100
                      </span>
                    </Title>
                    <Space style={{ marginTop: 8 }}>
                      <Tag color="success" style={{ padding: "0 12px" }}>
                        评级 AAA
                      </Tag>
                      <Text type="secondary">高于 92% 同类行业</Text>
                    </Space>
                  </Space>
                  <Divider style={{ margin: "20px 0" }} />
                  <Row gutter={16}>
                    <Col span={12}>
                      <Statistic
                        title="收录企业 (家)"
                        value={data.basicInfo.totalCompanies}
                        prefix={<BankOutlined />}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="资本规模 (亿元)"
                        value={data.basicInfo.totalCapital}
                        prefix={<RiseOutlined />}
                      />
                    </Col>
                  </Row>
                </Col>
                <Col xs={24} md={14}>
                  <div style={{ position: "relative" }}>
                    <Title
                      level={5}
                      style={{ position: "absolute", top: 0, left: 16 }}
                    >
                      多维能力雷达
                    </Title>
                    <Radar {...MAIN_RADAR_CONFIG(data.overallRadar)} />
                  </div>
                </Col>
              </Row>
            </Card>

            {/* 第二行：三个评分模型 (并排) */}
            <Row gutter={20}>
              <Col xs={24} md={8}>
                {renderSubModelCard(
                  "行业基础评分",
                  <TrophyOutlined style={{ color: COLORS.gold }} />,
                  data.models.basic,
                  COLORS.gold,
                )}
              </Col>
              <Col xs={24} md={8}>
                {renderSubModelCard(
                  "科技属性评分",
                  <ExperimentOutlined style={{ color: COLORS.primary }} />,
                  data.models.tech,
                  COLORS.primary,
                )}
              </Col>
              <Col xs={24} md={8}>
                {renderSubModelCard(
                  "行业能力评分",
                  <ThunderboltOutlined style={{ color: COLORS.green }} />,
                  data.models.ability,
                  COLORS.green,
                )}
              </Col>
            </Row>

            {/* 第三行：薄弱环节识别 */}
            <Card
              title={
                <Space>
                  <FallOutlined /> 薄弱环节识别
                </Space>
              }
              size="small"
              bordered={false}
              headStyle={CARD_HEAD_STYLE}
            >
              <List
                grid={{ gutter: 16, column: 2 }}
                dataSource={data.weakLinks}
                renderItem={(item: any) => (
                  <List.Item>
                    <Alert
                      message={
                        <Text strong style={{ fontSize: 15 }}>
                          {item.name}
                        </Text>
                      }
                      description={
                        <div style={{ marginTop: 4 }}>
                          <Tag color={item.level === "高危" ? "red" : "orange"}>
                            {item.level}
                          </Tag>
                          <Text type="secondary">{item.reason}</Text>
                        </div>
                      }
                      type={item.level === "高危" ? "error" : "warning"}
                      showIcon
                      icon={
                        item.level === "高危" ? (
                          <WarningOutlined />
                        ) : (
                          <InfoCircleOutlined />
                        )
                      }
                      style={{
                        border:
                          item.level === "高危"
                            ? "1px solid #ffa39e"
                            : "1px solid #ffe58f",
                      }}
                    />
                  </List.Item>
                )}
              />
            </Card>

            {/* 第四行：风险评估 (优化：更多按钮内嵌) */}
            <Card
              title={
                <Space>
                  <SafetyOutlined /> 风险评估监控
                </Space>
              }
              size="small"
              bordered={false}
              headStyle={CARD_HEAD_STYLE}
            >
              <Row gutter={48}>
                {/* 左侧：高风险 */}
                <Col span={12} style={{ borderRight: "1px solid #f0f0f0" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 16,
                    }}
                  >
                    <Title
                      level={5}
                      style={{ color: COLORS.riskHigh, margin: 0 }}
                    >
                      <WarningOutlined /> 高风险企业 Top5
                    </Title>
                    <Button
                      type="link"
                      size="small"
                      onClick={() => {
                        setRiskModalType("high");
                        setRiskModalVisible(true);
                      }}
                    >
                      查看更多 <DoubleRightOutlined />
                    </Button>
                  </div>
                  <List
                    size="small"
                    dataSource={data.risks.high}
                    renderItem={(item: any, idx: number) => (
                      <List.Item>
                        <Space>
                          <Badge
                            count={idx + 1}
                            style={{
                              backgroundColor: "#fff",
                              color: "#999",
                              boxShadow: "0 0 0 1px #d9d9d9 inset",
                            }}
                          />
                          <Text style={{ width: 140 }} ellipsis>
                            {item.name}
                          </Text>
                        </Space>
                        <Space>
                          <Tag color="red" bordered={false}>
                            {item.score}分
                          </Tag>
                          <Tooltip title={item.reason}>
                            <InfoCircleOutlined style={{ color: "#ccc" }} />
                          </Tooltip>
                        </Space>
                      </List.Item>
                    )}
                  />
                </Col>
                {/* 右侧：低风险/优质 */}
                <Col span={12}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 16,
                    }}
                  >
                    <Title
                      level={5}
                      style={{ color: COLORS.riskLow, margin: 0 }}
                    >
                      <CheckCircleOutlined /> 优质稳健企业 Top5
                    </Title>
                    <Button
                      type="link"
                      size="small"
                      onClick={() => {
                        setRiskModalType("low");
                        setRiskModalVisible(true);
                      }}
                    >
                      查看更多 <DoubleRightOutlined />
                    </Button>
                  </div>
                  <List
                    size="small"
                    dataSource={data.risks.low}
                    renderItem={(item: any, idx: number) => (
                      <List.Item>
                        <Space>
                          <Badge
                            count={idx + 1}
                            style={{
                              backgroundColor: "#e6f7ff",
                              color: "#1890ff",
                            }}
                          />
                          <Text style={{ width: 140 }} ellipsis strong>
                            {item.name}
                          </Text>
                        </Space>
                        <Space>
                          <Tag color="green" bordered={false}>
                            {item.score}分
                          </Tag>
                          <Tag color="success">经营稳健</Tag>
                        </Space>
                      </List.Item>
                    )}
                  />
                </Col>
              </Row>
            </Card>

            {/* 第五行：行业重点企业一览 */}
            <Card
              title={
                <Space>
                  <AppstoreOutlined /> 行业重点企业一览
                </Space>
              }
              size="small"
              bordered={false}
              headStyle={CARD_HEAD_STYLE}
            >
              <Table
                dataSource={data.topCompanies}
                size="middle"
                pagination={false}
                rowKey="name"
                columns={[
                  {
                    title: "排名",
                    width: 80,
                    align: "center",
                    render: (_, __, i) => (
                      <Badge
                        count={i + 1}
                        style={{
                          backgroundColor: i < 3 ? COLORS.primary : "#d9d9d9",
                        }}
                      />
                    ),
                  },
                  {
                    title: "企业名称",
                    dataIndex: "name",
                    render: (t) => <a style={{ fontWeight: 500 }}>{t}</a>,
                  },
                  {
                    title: "注册资本",
                    dataIndex: "capital",
                    align: "right",
                    render: (t) => (
                      <Text>{parseFloat(t).toLocaleString()} 万</Text>
                    ),
                  },
                  {
                    title: "综合评分",
                    dataIndex: "score",
                    align: "center",
                    render: (s) => (
                      <Text
                        strong
                        style={{ color: COLORS.primary, fontSize: 16 }}
                      >
                        {s}
                      </Text>
                    ),
                  },
                  {
                    title: "企业标签",
                    dataIndex: "tags",
                    render: (tags) => (
                      <Space size={4}>
                        {tags.map((t: string) => (
                          <Tag key={t} color="blue">
                            {t}
                          </Tag>
                        ))}
                      </Space>
                    ),
                  },
                  {
                    title: "操作",
                    width: 100,
                    align: "center",
                    render: () => <a>查看画像</a>,
                  },
                ]}
              />
            </Card>
          </Space>
        )}

        {/* 弹窗：更多风险企业 */}
        <Modal
          title={
            riskModalType === "high" ? "高风险企业完整名单" : "优质企业完整名单"
          }
          open={riskModalVisible}
          onCancel={() => setRiskModalVisible(false)}
          footer={null}
          width={700}
        >
          <Table
            dataSource={data?.risks[riskModalType]}
            size="small"
            rowKey="id"
            pagination={{ pageSize: 10 }}
            columns={[
              {
                title: "企业名称",
                dataIndex: "name",
                render: (t) => <b>{t}</b>,
              },
              {
                title: "评分",
                dataIndex: "score",
                width: 100,
                sorter: (a: any, b: any) => a.score - b.score,
                render: (s) => (
                  <Tag color={riskModalType === "high" ? "red" : "green"}>
                    {s}
                  </Tag>
                ),
              },
              { title: "评估说明", dataIndex: "reason" },
            ]}
          />
        </Modal>
      </Content>
    </Layout>
  );
};

export default IndustryProfile;
