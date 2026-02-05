import React, { useState, useEffect } from "react";
import {
  Layout,
  Button,
  Tree,
  Typography,
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
  Descriptions,
} from "antd";
import {
  SafetyOutlined,
  FallOutlined,
  TrophyOutlined,
  ExperimentOutlined,
  ThunderboltOutlined,
  InfoCircleOutlined,
  AppstoreOutlined,
  RiseOutlined,
  BankOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  DoubleRightOutlined,
  ContainerOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Radar } from "@ant-design/plots";
import type { DataNode } from "antd/es/tree";
import type { ColumnsType } from "antd/es/table";

import ReportActionButtons from "../../components/ReportActionButtons";

const { Content, Sider } = Layout;
const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const COLORS = {
  primary: "#1890ff",
  gold: "#faad14",
  green: "#52c41a",
  riskHigh: "#ff4d4f",
  riskLow: "#52c41a",
  bg: "#fff", // 背景改为纯白，配合边框设计
  borderColor: "#f0f0f0", // 统一边框颜色
};

const BORDER_STYLE = `1px solid ${COLORS.borderColor}`;

// 优化后的主雷达图配置
const MAIN_RADAR_CONFIG = (data: any[]) => ({
  data,
  xField: "item",
  yField: "score",
  seriesField: "date",
  meta: {
    score: { min: 0, max: 100 },
  },
  area: {
    style: { fillOpacity: 0.1 },
  },
  line: {
    style: { lineWidth: 2 },
  },
  point: {
    size: 2,
    shape: "circle",
  },
  color: ["#d9d9d9", "#bfbfbf", "#8c8c8c", "#595959", "#434343", "#1890ff"],
  legend: {
    position: "bottom" as const,
  },
  height: 320,
});

const DETAIL_RADAR_CONFIG = (data: any[]) => ({
  data,
  xField: "name",
  yField: "score",
  area: { style: { fill: "#1890ff", fillOpacity: 0.2 } },
  line: { style: { stroke: "#1890ff", lineWidth: 2 } },
  point: {
    size: 3,
    shape: "circle",
    style: { fill: "#fff", stroke: "#1890ff" },
  },
  scale: { y: { min: 0, max: 100 } },
  height: 300,
});

const IndustryProfile: React.FC = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [selectedIndustry, setSelectedIndustry] = useState("");

  const [riskModalVisible, setRiskModalVisible] = useState(false);
  const [riskModalType, setRiskModalType] = useState<"high" | "low">("high");

  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [currentDetail, setCurrentDetail] = useState<any>(null);

  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [loadingTree, setLoadingTree] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

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

  const fetchProfile = async (industry: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3001/api/industry/profile?industryName=${encodeURIComponent(industry)}`,
      );
      const resData = await response.json();
      if (resData.success && resData.data) {
        // Mock data enhancement if needed
        const enrichedData = {
          ...resData.data,
          basicInfo: {
            ...resData.data.basicInfo,
            department: "朝阳区科学技术和信息化局",
            policyCount: 12,
            growthRate: "18.5%",
            chainLink: "上游 - 中游 - 下游",
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

  const showCompanyDetail = (record: any, modelTitle: string) => {
    setCurrentDetail({
      name: record.name,
      score: record.score,
      modelName: modelTitle,
      details: record.details,
    });
    setDetailModalVisible(true);
  };

  // 渲染评分模型子卡片（包含排序表格）
  const renderSubModelCard = (
    title: string,
    icon: React.ReactNode,
    modelData: any,
    color: string,
    hasRightBorder: boolean = true,
  ) => {
    const columns: ColumnsType<any> = [
      {
        title: "企业名称",
        dataIndex: "name",
        ellipsis: true,
        align: "left",
        render: (t) => <Text style={{ fontSize: 13 }}>{t}</Text>,
      },
      {
        title: "评分",
        dataIndex: "score",
        width: 100,
        align: "center",
        sorter: (a, b) => a.score - b.score, // 增加排序功能
        showSorterTooltip: { title: "点击排序" },
        render: (s) => (
          <Text strong style={{ color: s < 60 ? "red" : color }}>
            {s}
          </Text>
        ),
      },
      {
        title: "详情",
        key: "action",
        width: 70,
        align: "center",
        render: (_, record) => (
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => showCompanyDetail(record, title)}
          />
        ),
      },
    ];

    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRight: hasRightBorder && !isMobile ? BORDER_STYLE : "none",
        }}
      >
        <div
          style={{
            padding: "16px 20px",
            borderBottom: BORDER_STYLE,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#fafafa",
          }}
        >
          <Space>
            {icon}
            <Text strong>{title}</Text>
          </Space>
          <Statistic
            value={modelData.score}
            valueStyle={{ color: color, fontWeight: "bold", fontSize: 18 }}
            suffix={<span style={{ fontSize: 12, color: "#999" }}>分(均)</span>}
          />
        </div>
        <div style={{ flex: 1, padding: 0 }}>
          <Table
            dataSource={modelData.companies}
            rowKey="name"
            pagination={false}
            size="small"
            columns={columns}
            scroll={{ y: 250 }} // 固定高度
            bordered={false}
          />
        </div>
      </div>
    );
  };

  const renderSider = () => (
    <Sider
      width={240}
      theme="light"
      style={{
        borderRight: BORDER_STYLE,
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
            borderBottom: BORDER_STYLE,
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

  return (
    <Layout style={{ minHeight: "85vh", background: "#fff" }}>
      {renderSider()}

      <Content
        style={{
          padding: 0, // 移除Content内边距，实现全宽设计
          overflowY: "auto",
          height: "calc(100vh - 64px)",
        }}
      >
        <div style={{ width: "100%" }}>
          {/* 顶部工具栏 */}
          <div
            style={{
              padding: "16px 24px",
              borderBottom: BORDER_STYLE,
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              background: "#fff",
            }}
          >
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
              description="请从左侧选择行业，或使用顶部导航栏进行搜索"
              style={{ marginTop: 100 }}
            />
          ) : (
            <div
              id="industry-report-content"
              style={{ borderBottom: BORDER_STYLE }}
            >
              {/* 第一行：行业概览 + 雷达图 
                   使用 Grid 布局模拟“紧贴”效果
                */}
              <Row gutter={0} style={{ borderBottom: BORDER_STYLE }}>
                <Col
                  xs={24}
                  lg={15}
                  style={{ borderRight: !isMobile ? BORDER_STYLE : "none" }}
                >
                  <div style={{ padding: 24 }}>
                    <div style={{ marginBottom: 24 }}>
                      <Space align="center" style={{ marginBottom: 12 }}>
                        <Title
                          level={2}
                          style={{ margin: 0, color: COLORS.primary }}
                        >
                          {data.basicInfo.industryName}
                        </Title>
                        <Tag color="geekblue">朝阳区重点行业</Tag>{" "}
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
                        <Descriptions.Item label="同比上月">
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
                        <Descriptions.Item label="行业描述" span={2}>
                          <Text
                            type="secondary"
                            style={{ maxWidth: 600, display: "block" }}
                            ellipsis={{ tooltip: true }}
                          >
                            {data.basicInfo.description}
                          </Text>
                        </Descriptions.Item>
                      </Descriptions>
                    </div>

                    {/* 统计数据栏 */}
                    <div
                      style={{
                        background: "#fafafa",
                        padding: "16px 20px",
                        border: BORDER_STYLE,
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Statistic
                        title="收录企业"
                        value={data.basicInfo.totalCompanies}
                        suffix="家"
                        valueStyle={{ fontSize: 20, fontWeight: 500 }}
                        prefix={
                          <BankOutlined style={{ color: COLORS.primary }} />
                        }
                      />
                      <Divider type="vertical" style={{ height: 40, top: 5 }} />
                      <Statistic
                        title="资本规模"
                        value={data.basicInfo.totalCapital}
                        suffix="亿元"
                        valueStyle={{ fontSize: 20, fontWeight: 500 }}
                        prefix={
                          <ContainerOutlined style={{ color: COLORS.gold }} />
                        }
                      />
                      <Divider type="vertical" style={{ height: 40, top: 5 }} />
                      <Statistic
                        title="主要风险"
                        value={data.risks.high.length}
                        suffix="项"
                        valueStyle={{
                          fontSize: 20,
                          fontWeight: 500,
                          color: COLORS.riskHigh,
                        }}
                        prefix={<WarningOutlined />}
                      />
                    </div>
                  </div>
                </Col>
                <Col xs={24} lg={9}>
                  <div
                    style={{
                      padding: 24,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                    }}
                  >
                    <div style={{ textAlign: "center", marginBottom: 12 }}>
                      <Text strong style={{ fontSize: 16 }}>
                        多维能力雷达图
                      </Text>
                      <div style={{ fontSize: 12, color: "#999" }}>
                        （近6个月动态评估）
                      </div>
                    </div>
                    <Radar {...MAIN_RADAR_CONFIG(data.overallRadar)} />
                  </div>
                </Col>
              </Row>

              {/* 第二行：三个评分模型 (无Gutter，紧贴) */}
              <Row gutter={0} style={{ borderBottom: BORDER_STYLE }}>
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
                    false, // 最后一个不需要右边框
                  )}
                </Col>
              </Row>

              {/* 第三行：薄弱环节 & 风险评估 */}
              <Row gutter={0} style={{ borderBottom: BORDER_STYLE }}>
                <Col
                  span={24}
                  lg={12}
                  style={{ borderRight: !isMobile ? BORDER_STYLE : "none" }}
                >
                  <div style={{ padding: 0 }}>
                    <div
                      style={{
                        padding: "12px 24px",
                        borderBottom: BORDER_STYLE,
                        backgroundColor: "#fafafa",
                      }}
                    >
                      <Space>
                        <FallOutlined /> <Text strong>薄弱环节识别</Text>
                      </Space>
                    </div>
                    <div style={{ padding: 24, minHeight: 250 }}>
                      <List
                        dataSource={data.weakLinks}
                        split={false}
                        renderItem={(item: any) => (
                          <List.Item style={{ padding: "8px 0" }}>
                            <Alert
                              message={<Text strong>{item.name}</Text>}
                              description={
                                <div style={{ marginTop: 4 }}>
                                  <Tag
                                    color={
                                      item.level === "高危" ? "red" : "orange"
                                    }
                                  >
                                    {item.level}
                                  </Tag>{" "}
                                  <Text type="secondary">{item.reason}</Text>
                                </div>
                              }
                              type={item.level === "高危" ? "error" : "warning"}
                              showIcon
                              style={{
                                width: "100%",
                                border: "none",
                                background:
                                  item.level === "高危" ? "#fff1f0" : "#fffbe6",
                              }}
                            />
                          </List.Item>
                        )}
                      />
                    </div>
                  </div>
                </Col>
                <Col span={24} lg={12}>
                  <div
                    style={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div
                      style={{
                        padding: "12px 24px",
                        borderBottom: BORDER_STYLE,
                        display: "flex",
                        justifyContent: "space-between",
                        backgroundColor: "#fafafa",
                      }}
                    >
                      <Space>
                        <SafetyOutlined /> <Text strong>风险评估监控</Text>
                      </Space>
                      <Space>
                        <Tooltip title="查看高风险企业名单">
                          <Button
                            type="text"
                            size="small"
                            icon={
                              <WarningOutlined
                                style={{ color: COLORS.riskHigh }}
                              />
                            }
                            onClick={() => {
                              setRiskModalType("high");
                              setRiskModalVisible(true);
                            }}
                          />
                        </Tooltip>
                        <Tooltip title="查看优质企业名单">
                          <Button
                            type="text"
                            size="small"
                            icon={
                              <CheckCircleOutlined
                                style={{ color: COLORS.green }}
                              />
                            }
                            onClick={() => {
                              setRiskModalType("low");
                              setRiskModalVisible(true);
                            }}
                          />
                        </Tooltip>
                      </Space>
                    </div>
                    <div style={{ padding: "0 24px", flex: 1 }}>
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
                              <Text style={{ width: 120 }} ellipsis>
                                {item.name}
                              </Text>
                            </Space>
                            <Space>
                              <Tag color="red">{item.score}分</Tag>
                              <Tooltip title={item.reason}>
                                <InfoCircleOutlined
                                  style={{ color: "#ccc", cursor: "help" }}
                                />
                              </Tooltip>
                            </Space>
                          </List.Item>
                        )}
                      />
                      <div style={{ textAlign: "center", padding: "12px 0" }}>
                        <Button
                          type="link"
                          size="small"
                          onClick={() => {
                            setRiskModalType("high");
                            setRiskModalVisible(true);
                          }}
                        >
                          查看更多高风险企业 <DoubleRightOutlined />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>

              {/* 第四行：重点企业列表 */}
              <div style={{ padding: 0 }}>
                <div
                  style={{
                    padding: "12px 24px",
                    borderBottom: BORDER_STYLE,
                    backgroundColor: "#fafafa",
                  }}
                >
                  <Space>
                    <AppstoreOutlined /> <Text strong>行业重点企业一览</Text>
                  </Space>
                </div>
                <Table
                  dataSource={data.topCompanies}
                  size="middle"
                  pagination={false}
                  rowKey="name"
                  bordered={false}
                  style={{ margin: 0 }}
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
                      // sorter: (a, b) => a.score - b.score, // 全局列表也加上排序
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
              </div>
            </div>
          )}

          {/* 底部版权 */}
          <div
            style={{
              textAlign: "center",
              padding: "24px 0",
              color: "#ccc",
              fontSize: 12,
              background: "#f5f5f5", // 底部稍微区分一下背景
            }}
          >
            - 朝阳区产业链洞察平台生成 -
          </div>

          {/* 详情弹窗 */}
          <Modal
            title={
              currentDetail
                ? `${currentDetail.name} - ${currentDetail.modelName}详情`
                : "评分详情"
            }
            open={detailModalVisible}
            onCancel={() => setDetailModalVisible(false)}
            footer={null}
            width={700}
            centered
          >
            {currentDetail && (
              <Row gutter={24}>
                <Col span={12}>
                  <Title level={5}>评分概览</Title>
                  <div style={{ height: 300 }}>
                    <Radar {...DETAIL_RADAR_CONFIG(currentDetail.details)} />
                  </div>
                </Col>
                <Col span={12}>
                  <Title level={5}>维度明细</Title>
                  <Table
                    dataSource={currentDetail.details}
                    pagination={false}
                    size="small"
                    rowKey="name"
                    scroll={{ y: 240 }}
                    columns={[
                      { title: "指标", dataIndex: "name" },
                      {
                        title: "权重",
                        dataIndex: "weight",
                        render: (w) => <Tag>{w}%</Tag>,
                      },
                      {
                        title: "得分",
                        dataIndex: "score",
                        render: (s) => <b>{s}</b>,
                      },
                    ]}
                  />
                </Col>
              </Row>
            )}
          </Modal>

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
              rowKey="name"
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
