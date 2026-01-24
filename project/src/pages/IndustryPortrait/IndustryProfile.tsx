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
} from "antd";
import {
  SearchOutlined,
  MenuUnfoldOutlined,
  RadarChartOutlined,
  SafetyOutlined,
  FallOutlined,
  RightOutlined,
  TrophyOutlined,
  ExperimentOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { Radar } from "@ant-design/plots"; // 使用 Ant Design Charts
import type { DataNode } from "antd/es/tree";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

// --- Mock Data: 行业评分数据 ---
const MOCK_SCORE_DATA = {
  totalScore: 86.5,
  radarData: [
    { item: "产业基础", score: 85, fullMark: 100 },
    { item: "科技属性", score: 92, fullMark: 100 },
    { item: "产业能力", score: 78, fullMark: 100 },
    { item: "人才聚集", score: 88, fullMark: 100 },
    { item: "资本热度", score: 75, fullMark: 100 },
  ],
  dimensions: [
    {
      key: "foundation",
      title: "行业基础",
      score: 85,
      weight: "30%",
      icon: <TrophyOutlined style={{ fontSize: 24, color: "#faad14" }} />,
      desc: "反映行业存量规模、企业数量及注册资本情况",
    },
    {
      key: "tech",
      title: "科技属性",
      score: 92,
      weight: "40%",
      icon: <ExperimentOutlined style={{ fontSize: 24, color: "#1890ff" }} />,
      desc: "反映行业专利申请、高新企业占比及研发投入",
    },
    {
      key: "ability",
      title: "行业能力",
      score: 78,
      weight: "30%",
      icon: <ThunderboltOutlined style={{ fontSize: 24, color: "#52c41a" }} />,
      desc: "反映行业盈利能力、纳税贡献及增长潜力",
    },
  ],
  weakLinks: [
    {
      name: "高端光刻胶",
      level: "高危",
      reason: "国产化率低于 5%",
      suggestion: "加大研发补贴，引入海外团队",
    },
    {
      name: "大尺寸硅片",
      level: "中危",
      reason: "产能不足，依赖进口",
      suggestion: "支持龙头企业扩产",
    },
  ],
  risks: [
    {
      title: "供应链断供风险",
      level: "高",
      score: 88,
      desc: "关键原材料单一来源占比过高",
    },
    {
      title: "技术迭代风险",
      level: "中",
      score: 65,
      desc: "行业技术路线存在不确定性",
    },
  ],
  // 详细规则 Mock
  detailRules: [
    {
      key: "1",
      dimension: "行业基础",
      subDim: "企业总量",
      condition: "> 1000 家",
      score: 10,
      weight: "10%",
    },
    {
      key: "2",
      dimension: "行业基础",
      subDim: "龙头企业",
      condition: "上市企业 > 5 家",
      score: 8,
      weight: "10%",
    },
    {
      key: "3",
      dimension: "科技属性",
      subDim: "发明专利",
      condition: "年均增长 > 20%",
      score: 15,
      weight: "15%",
    },
    {
      key: "4",
      dimension: "科技属性",
      subDim: "研发投入",
      condition: "占比营收 > 5%",
      score: 12,
      weight: "15%",
    },
    {
      key: "5",
      dimension: "行业能力",
      subDim: "营收增速",
      condition: "连续3年 > 10%",
      score: 10,
      weight: "10%",
    },
  ],
};

const IndustryProfile: React.FC = () => {
  const { token } = theme.useToken();
  const [treeDrawerVisible, setTreeDrawerVisible] = useState(false);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState("生物医药"); // 默认选中

  // Tree State (复用 IndustryClass 的逻辑)
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [loadingTree, setLoadingTree] = useState(false);

  // 获取树数据 (模拟复用)
  useEffect(() => {
    const fetchTree = async () => {
      setLoadingTree(true);
      try {
        const response = await fetch("/api/tags/tree");
        const data = await response.json();
        if (data.success) {
          setTreeData(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch tree:", error);
      } finally {
        setLoadingTree(false);
      }
    };
    fetchTree();
  }, []);

  // 雷达图配置
  const radarConfig = {
    data: MOCK_SCORE_DATA.radarData,
    xField: "item",
    yField: "score",
    area: {
      style: {
        fillOpacity: 0.2,
      },
    },
    scale: {
      y: {
        min: 0,
        max: 100,
      },
    },
    axis: {
      x: {
        grid: {
          line: {
            style: { stroke: "#d9d9d9", lineDash: [4, 4] },
          },
        },
      },
    },
    style: {
      lineWidth: 2,
    },
  };

  return (
    <Layout style={{ background: "transparent" }}>
      {/* 1. 顶部搜索与操作栏 */}
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
            <Tag color="blue" style={{ marginLeft: 12, fontWeight: "normal" }}>
              产业链画像
            </Tag>
          </Title>
          <Input.Search
            placeholder="输入行业名称搜索..."
            allowClear
            enterButton={<Button icon={<SearchOutlined />}>搜索</Button>}
            style={{ width: 300 }}
            onSearch={(val) => {
              if (val) setSelectedIndustry(val);
            }}
          />
        </div>
        <Button
          type="primary"
          icon={<MenuUnfoldOutlined />}
          onClick={() => setTreeDrawerVisible(true)}
        >
          切换行业
        </Button>
      </div>

      <Content style={{ minHeight: 280 }}>
        {/* 2. 行业综合评分与核心维度 */}
        <Row gutter={[24, 24]}>
          {/* 左侧：综合评分雷达 */}
          <Col xs={24} lg={10} xl={8}>
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
                  style={{ fontSize: 20, color: token.colorPrimary }}
                >
                  {MOCK_SCORE_DATA.totalScore}
                </Text>
              }
            >
              <div style={{ height: 300 }}>
                <Radar {...radarConfig} />
              </div>
              <div style={{ textAlign: "center", marginTop: 16 }}>
                <Text type="secondary">基于 5 大维度、24 项指标的综合评估</Text>
              </div>
            </Card>
          </Col>

          {/* 右侧：维度评分卡片 (列表排列) */}
          <Col xs={24} lg={14} xl={16}>
            <Row gutter={[16, 16]}>
              {MOCK_SCORE_DATA.dimensions.map((dim) => (
                <Col span={24} key={dim.key}>
                  <Card
                    hoverable
                    bodyStyle={{ padding: "20px 24px" }}
                    onClick={() => setDetailDrawerVisible(true)}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
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
                          {dim.icon}
                        </div>
                        <div>
                          <Title level={5} style={{ margin: 0 }}>
                            {dim.title}
                          </Title>
                          <Text type="secondary" style={{ fontSize: 13 }}>
                            {dim.desc}
                          </Text>
                          <div style={{ marginTop: 8 }}>
                            <Tag>权重: {dim.weight}</Tag>
                          </div>
                        </div>
                      </div>
                      <div style={{ textAlign: "right", minWidth: 100 }}>
                        <Statistic
                          value={dim.score}
                          suffix="/ 100"
                          valueStyle={{ fontSize: 24, fontWeight: "bold" }}
                        />
                        <Progress
                          percent={dim.score}
                          showInfo={false}
                          size="small"
                          strokeColor={token.colorPrimary}
                        />
                        <Button
                          type="link"
                          size="small"
                          style={{ marginTop: 8, padding: 0 }}
                        >
                          查看详情 <RightOutlined />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>

        {/* 3. 薄弱环节与风险评估 */}
        <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
          {/* 薄弱环节 */}
          <Col xs={24} md={12}>
            <Card
              title={
                <Space>
                  <FallOutlined /> 薄弱环节识别
                </Space>
              }
              style={{ height: "100%" }}
            >
              <List
                itemLayout="horizontal"
                dataSource={MOCK_SCORE_DATA.weakLinks}
                renderItem={(item, index) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Badge
                          count={index + 1}
                          style={{
                            backgroundColor:
                              item.level === "高危" ? "#f5222d" : "#fa8c16",
                          }}
                        />
                      }
                      title={<Text strong>{item.name}</Text>}
                      description={
                        <Space
                          direction="vertical"
                          size={2}
                          style={{ width: "100%" }}
                        >
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            原因: {item.reason}
                          </Text>
                          <Alert
                            message={`建议: ${item.suggestion}`}
                            type="warning"
                            showIcon
                            style={{ padding: "4px 12px", fontSize: 12 }}
                          />
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>

          {/* 风险评估 */}
          <Col xs={24} md={12}>
            <Card
              title={
                <Space>
                  <SafetyOutlined /> 风险评估
                </Space>
              }
              style={{ height: "100%" }}
            >
              <List
                dataSource={MOCK_SCORE_DATA.risks}
                renderItem={(item) => (
                  <List.Item>
                    <div style={{ width: "100%" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 8,
                        }}
                      >
                        <Text strong>{item.title}</Text>
                        <Tag color={item.level === "高" ? "red" : "orange"}>
                          {item.level}风险
                        </Tag>
                      </div>
                      <Progress
                        percent={item.score}
                        status={item.level === "高" ? "exception" : "normal"}
                        format={() => `${item.score}`}
                      />
                      <Text
                        type="secondary"
                        style={{ fontSize: 12, marginTop: 4, display: "block" }}
                      >
                        {item.desc}
                      </Text>
                    </div>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      </Content>

      {/* --- Drawer 1: 产业链树谱选择 --- */}
      <Drawer
        title="选择行业 (产业链树谱)"
        placement="right"
        onClose={() => setTreeDrawerVisible(false)}
        open={treeDrawerVisible}
        width={400}
      >
        <Input.Search style={{ marginBottom: 16 }} placeholder="搜索节点..." />
        {loadingTree ? (
          <div style={{ textAlign: "center", padding: 20 }}>
            <Spin />
          </div>
        ) : (
          <Tree
            treeData={treeData}
            onSelect={(selectedKeys, info: any) => {
              if (selectedKeys.length > 0) {
                setSelectedIndustry(info.node.title as string);
                setTreeDrawerVisible(false); // 选中后自动关闭
              }
            }}
            height={600}
          />
        )}
      </Drawer>

      {/* --- Drawer 2: 评分详情 --- */}
      <Drawer
        title="评分维度详情"
        placement="right"
        width={600}
        onClose={() => setDetailDrawerVisible(false)}
        open={detailDrawerVisible}
      >
        <div style={{ marginBottom: 24 }}>
          <Title level={5}>评分模型说明</Title>
          <Paragraph type="secondary">
            当前行业采用“通用制造类V2.0”评分模型。该模型侧重于对技术创新能力和产业集聚度的考量。
            所有权重配置可在“系统管理-评分权重管理”中进行调整。
          </Paragraph>
        </div>

        <Table
          dataSource={MOCK_SCORE_DATA.detailRules}
          pagination={false}
          columns={[
            {
              title: "维度",
              dataIndex: "dimension",
              width: 100,
              onCell: (_, index) => {
                // 简单合并行逻辑 (Mock)
                if (index === 0) return { rowSpan: 2 };
                if (index === 1) return { rowSpan: 0 };
                if (index === 2) return { rowSpan: 2 };
                if (index === 3) return { rowSpan: 0 };
                return {};
              },
            },
            { title: "子维度", dataIndex: "subDim", width: 100 },
            { title: "判断条件", dataIndex: "condition" },
            {
              title: "得分",
              dataIndex: "score",
              width: 80,
              render: (text) => <Text strong>{text}</Text>,
            },
          ]}
          size="small"
          bordered
        />

        <div style={{ marginTop: 24, textAlign: "center" }}>
          <Button
            type="dashed"
            onClick={() => {
              /* 跳转到系统管理 */
            }}
          >
            前往系统管理配置权重
          </Button>
        </div>
      </Drawer>
    </Layout>
  );
};

export default IndustryProfile;
