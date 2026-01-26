import React, { useState, useEffect } from "react";
import {
  Layout,
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
  Badge,
  Alert,
  Spin,
  Empty,
  Divider,
  Grid,
  Modal,
  Tooltip,
  AutoComplete,
  Descriptions,
  Input,
} from "antd";
import {
  SafetyOutlined,
  FallOutlined,
  TrophyOutlined,
  ExperimentOutlined,
  ThunderboltOutlined,
  SearchOutlined,
  InfoCircleOutlined,
  AppstoreOutlined,
  RiseOutlined,
  BankOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  DoubleRightOutlined,
  ContainerOutlined,
} from "@ant-design/icons";
import { Radar } from "@ant-design/plots";
import type { DataNode } from "antd/es/tree";

// 引入组件
import ReportActionButtons from "../../components/ReportActionButtons";

const { Content, Sider } = Layout;
const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

// --- 视觉风格定义 ---
const COLORS = {
  primary: "#1890ff",
  gold: "#faad14",
  green: "#52c41a",
  riskHigh: "#ff4d4f",
  riskLow: "#52c41a",
  bg: "#f0f2f5",
};

const CARD_HEAD_STYLE = { minHeight: 48, borderBottom: "1px solid #f0f0f0" };

// ... (Radar配置保持不变，省略以节省篇幅) ...
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

const MOCK_OPTIONS = [
  { value: "数字医疗" },
  { value: "人工智能" },
  { value: "新能源汽车" },
  { value: "工业互联网" },
  { value: "生物医药" },
];

const IndustryProfile: React.FC = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [searchOptions, setSearchOptions] = useState<{ value: string }[]>([]);
  const [riskModalVisible, setRiskModalVisible] = useState(false);
  const [riskModalType, setRiskModalType] = useState<"high" | "low">("high");
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
          const flatTreeData = resData.data.reduce((acc: any[], stage: any) => {
            if (stage.children && stage.children.length > 0)
              return [...acc, ...stage.children];
            return acc;
          }, []);
          setTreeData(flatTreeData);
          if (flatTreeData.length > 0)
            setExpandedKeys(flatTreeData.map((node: any) => node.key));
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
        const enrichedData = {
          ...resData.data,
          basicInfo: {
            ...resData.data.basicInfo,
            department: "朝阳区科学技术委员会",
            policyCount: 12,
            growthRate: "18.5%",
            chainLink: "研发 - 制造 - 服务",
            description:
              "聚焦数字化技术在医疗健康全流程的应用，涵盖数字诊疗设备、医疗大数据、远程医疗等关键领域。",
          },
        };
        setData(enrichedData);
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

  const handleSearch = (value: string) => {
    if (value) setSelectedIndustry(value);
  };
  const handleSearchChange = (value: string) => {
    if (!value) setSearchOptions([]);
    else
      setSearchOptions(MOCK_OPTIONS.filter((opt) => opt.value.includes(value)));
  };

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
                if (keys.length > 0)
                  setSelectedIndustry(
                    (info.node.title as string).split(" (")[0],
                  );
              }}
              blockNode
              style={{ fontSize: 13 }}
            />
          )}
        </div>
      </div>
    </Sider>
  );

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
      <div style={{ height: 160, marginBottom: 12 }}>
        <Radar {...MINI_RADAR_CONFIG(modelData.radar, color)} />
      </div>
      <Table
        dataSource={modelData.dimensions}
        rowKey="name"
        pagination={false}
        size="small"
        bordered={false}
        scroll={{ y: 150 }}
        columns={[
          {
            title: "维度名称",
            dataIndex: "name",
            width: "45%",
            ellipsis: true,
            render: (t) => <Text style={{ fontSize: 12 }}>{t}</Text>,
          },
          {
            title: "权重",
            dataIndex: "weight",
            width: "20%",
            align: "center",
            render: (t) => (
              <Tag style={{ fontSize: 10, marginRight: 0 }}>{t}%</Tag>
            ),
          },
          {
            title: "得分",
            dataIndex: "score",
            width: "35%",
            align: "center",
            render: (s) => (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <b style={{ color: s < 60 ? "red" : color, fontSize: 12 }}>
                  {s}
                </b>
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
        <div style={{ maxWidth: 1600, margin: "0 auto", width: "100%" }}>
          {/* 搜索栏 */}
          <div
            style={{
              marginBottom: 24,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <AutoComplete
              options={searchOptions}
              style={{ width: 500 }}
              onSearch={handleSearchChange}
              onSelect={handleSearch}
              placeholder="请输入行业名称"
            >
              <Input.Search
                size="large"
                enterButton={
                  <Button type="primary" icon={<SearchOutlined />}>
                    行业画像搜索
                  </Button>
                }
                style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
                onSearch={handleSearch}
              />
            </AutoComplete>

            {/* 修改处：使用 targetId 指向下方内容，移除 onDownload 以启用 PDF 功能 */}
            {data && (
              <ReportActionButtons
                reportTitle={`${data.basicInfo.industryName}行业分析报告`}
                targetId="industry-report-content"
              />
            )}
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "100px 0" }}>
              <Spin size="large" tip="全维度数据计算中..." />
            </div>
          ) : !data ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="请搜索行业名称..."
              style={{ marginTop: 100 }}
            />
          ) : (
            // 修改处：添加 id="industry-report-content" 包裹主要内容
            <div id="industry-report-content">
              <Space direction="vertical" size={24} style={{ width: "100%" }}>
                {/* 行业概览 */}
                <Card bordered={false} bodyStyle={{ padding: 24 }}>
                  <Row gutter={24}>
                    <Col xs={24} lg={15}>
                      <div style={{ marginBottom: 24 }}>
                        <Space align="center" style={{ marginBottom: 12 }}>
                          <Title
                            level={2}
                            style={{ margin: 0, color: COLORS.primary }}
                          >
                            {data.basicInfo.industryName}
                          </Title>
                          <Tag color="geekblue">朝阳区重点产业</Tag>{" "}
                          <Tag color="success">AAA级</Tag>
                        </Space>
                        <Descriptions
                          column={2}
                          size="small"
                          labelStyle={{ color: "#999", width: 100 }}
                        >
                          <Descriptions.Item label="综合评分">
                            <span
                              style={{
                                fontSize: 24,
                                fontWeight: "bold",
                                color: COLORS.primary,
                              }}
                            >
                              {data.totalScore}
                            </span>
                          </Descriptions.Item>
                          <Descriptions.Item label="同比增长">
                            <span style={{ color: COLORS.riskHigh }}>
                              <RiseOutlined /> {data.basicInfo.growthRate}
                            </span>
                          </Descriptions.Item>
                          <Descriptions.Item label="主管部门">
                            {data.basicInfo.department}
                          </Descriptions.Item>
                          <Descriptions.Item label="相关政策">
                            {data.basicInfo.policyCount} 项
                          </Descriptions.Item>
                          <Descriptions.Item label="产业链环节" span={2}>
                            <Space split={<Divider type="vertical" />}>
                              {data.basicInfo.chainLink
                                .split(" - ")
                                .map((l: string, i: number) => (
                                  <Text key={i} strong={i === 1}>
                                    {l}
                                  </Text>
                                ))}
                            </Space>
                          </Descriptions.Item>
                          <Descriptions.Item label="产业描述" span={2}>
                            <Text
                              type="secondary"
                              style={{ maxWidth: 600 }}
                              ellipsis={{ tooltip: true }}
                            >
                              {data.basicInfo.description}
                            </Text>
                          </Descriptions.Item>
                        </Descriptions>
                      </div>
                      <div
                        style={{
                          background: "#fafafa",
                          padding: "20px",
                          borderRadius: 6,
                          display: "flex",
                          justifyContent: "space-around",
                        }}
                      >
                        <Statistic
                          title="收录企业"
                          value={data.basicInfo.totalCompanies}
                          suffix="家"
                          valueStyle={{ fontSize: 22, fontWeight: 500 }}
                          prefix={
                            <BankOutlined style={{ color: COLORS.primary }} />
                          }
                        />
                        <Divider
                          type="vertical"
                          style={{ height: 40, top: 10 }}
                        />
                        <Statistic
                          title="资本规模"
                          value={data.basicInfo.totalCapital}
                          suffix="亿元"
                          valueStyle={{ fontSize: 22, fontWeight: 500 }}
                          prefix={
                            <ContainerOutlined style={{ color: COLORS.gold }} />
                          }
                        />
                        <Divider
                          type="vertical"
                          style={{ height: 40, top: 10 }}
                        />
                        <Statistic
                          title="主要风险"
                          value={data.risks.high.length}
                          suffix="项"
                          valueStyle={{
                            fontSize: 22,
                            fontWeight: 500,
                            color: COLORS.riskHigh,
                          }}
                          prefix={<WarningOutlined />}
                        />
                      </div>
                    </Col>
                    <Col xs={24} lg={9}>
                      <div
                        style={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          minHeight: 280,
                        }}
                      >
                        <div style={{ textAlign: "center", marginBottom: 8 }}>
                          <Text strong>产业多维能力雷达</Text>
                        </div>
                        <Radar {...MAIN_RADAR_CONFIG(data.overallRadar)} />
                      </div>
                    </Col>
                  </Row>
                </Card>

                {/* 评分模型 */}
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

                {/* 薄弱环节 */}
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
                              <Tag
                                color={item.level === "高危" ? "red" : "orange"}
                              >
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

                {/* 风险评估 */}
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

                {/* 重点企业 */}
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
                              backgroundColor:
                                i < 3 ? COLORS.primary : "#d9d9d9",
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
              <div
                style={{
                  textAlign: "center",
                  marginTop: 32,
                  color: "#ccc",
                  fontSize: 12,
                }}
              >
                - 朝阳区产业链洞察平台生成 -
              </div>
            </div>
          )}

          <Modal
            title={
              riskModalType === "high"
                ? "高风险企业完整名单"
                : "优质企业完整名单"
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
        </div>
      </Content>
    </Layout>
  );
};

export default IndustryProfile;
