import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Card,
  Input,
  Row,
  Col,
  Descriptions,
  Tag,
  Typography,
  Tabs,
  Table,
  Space,
  Alert,
  Button,
  List,
  Badge,
} from "antd";
import {
  TrophyOutlined,
  FileTextOutlined,
  CalculatorOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { Radar } from "@ant-design/plots";

const { Title, Text } = Typography;

// --- 模拟数据 ---

// 1. 企业基础信息
const MOCK_ENTERPRISE_INFO = {
  id: "E001",
  name: "北京数智康养科技有限公司",
  creditCode: "91110105MA01ABCD22",
  industry: "数字医疗",
  chainPosition: "中游-医疗器械研发",
  regCapital: "5000万人民币",
  estDate: "2018-05-12",
  legalPerson: "张三",
};

// 2. 评分概览
const MOCK_SCORE_OVERVIEW = {
  totalScore: 88.5,
  level: "AAA",
  rank: 12, // 行业排名
  rankChange: "up", // 排名趋势
};

// 3. 维度得分 (用于雷达图)
const MOCK_RADAR_DATA = [
  { item: "基础评分", score: 90 },
  { item: "科技属性", score: 85 },
  { item: "专业能力", score: 92 },
  { item: "财务能力", score: 75 },
  { item: "招商评分", score: 95 },
];

// 4. 维度详情配置 (公式与数据)
const DIMENSION_DETAILS: Record<string, any> = {
  基础评分: {
    formula:
      "基础评分 = (注册资本得分 * 0.3) + (成立年限得分 * 0.3) + (参保人数得分 * 0.4)",
    desc: "评估企业经营的稳定性与规模基础。",
    tableData: [
      {
        key: "1",
        item: "注册资本",
        value: "5000万元",
        rawScore: 95,
        time: "2025-01-01",
      },
      {
        key: "2",
        item: "成立年限",
        value: "7年",
        rawScore: 85,
        time: "2025-01-01",
      },
      {
        key: "3",
        item: "参保人数",
        value: "128人",
        rawScore: 88,
        time: "2024-12-15",
      },
    ],
  },
  科技属性: {
    formula:
      "科技属性 = (发明专利数 * 0.4) + (软件著作权 * 0.3) + (研发人员占比 * 0.3)",
    desc: "评估企业的技术创新能力与研发投入强度。",
    tableData: [
      {
        key: "1",
        item: "发明专利：一种智能康复机器人",
        value: "授权",
        rawScore: 10,
        time: "2023-08-10",
      },
      {
        key: "2",
        item: "发明专利：基于AI的诊断算法",
        value: "实质审查",
        rawScore: 5,
        time: "2024-02-11",
      },
      {
        key: "3",
        item: "软件著作权：康养云平台V1.0",
        value: "登记",
        rawScore: 5,
        time: "2022-11-05",
      },
      {
        key: "4",
        item: "研发人员占比",
        value: "35%",
        rawScore: 85,
        time: "2024-12-31",
      },
    ],
  },
  专业能力: {
    formula: "专业能力 = (资质认证 * 0.5) + (行业标准制定 * 0.5)",
    desc: "评估企业在垂直领域的专业资质与话语权。",
    tableData: [
      {
        key: "1",
        item: "高新技术企业认证",
        value: "有效期内",
        rawScore: 20,
        time: "2023-01-01",
      },
      {
        key: "2",
        item: "专精特新“小巨人”",
        value: "获批",
        rawScore: 30,
        time: "2023-06-15",
      },
    ],
  },
  // ... 其他维度可按需补充，这里复用数据结构
  财务能力: {
    formula: "财务能力 = 营收增长率 * 0.5 + 净利润率 * 0.5",
    desc: "评估企业盈利能力",
    tableData: [],
  },
  招商评分: {
    formula: "招商评分 = 政策匹配度 * 0.6 + 落地意向 * 0.4",
    desc: "评估企业招商潜力",
    tableData: [],
  },
};

const EnterpriseScore: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [enterprise] = useState(MOCK_ENTERPRISE_INFO);

  // 控制当前选中的维度（用于联动）
  const [activeDimension, setActiveDimension] = useState("科技属性");

  // 初始化：如果URL有参数，模拟加载数据
  useEffect(() => {
    const keyword = searchParams.get("keyword");
    if (keyword) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        // 这里实际应该调API，现在仅模拟 loading 结束
      }, 500);
    }
  }, [searchParams]);

  const handleSearch = (value: string) => {
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  };

  // 雷达图配置
  const radarConfig = {
    data: MOCK_RADAR_DATA,
    xField: "item",
    yField: "score",
    area: { style: { fillOpacity: 0.25 } },
    point: { size: 4, shape: "circle" },
    scale: {
      y: { min: 0, max: 100 },
    },
    axis: { x: { title: false, grid: true }, y: { grid: true, title: false } },
    style: { lineWidth: 2 },
  };

  // 详情表列定义
  const detailColumns = [
    { title: "数据项名称", dataIndex: "item", key: "item", width: "30%" },
    {
      title: "关键数值/状态",
      dataIndex: "value",
      key: "value",
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    { title: "单项原始得分", dataIndex: "rawScore", key: "rawScore" },
    {
      title: "数据更新时间",
      dataIndex: "time",
      key: "time",
      width: 150,
      color: "#999",
    },
  ];

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      {/* 1. 顶部搜索区 */}
      <Card bordered={false} bodyStyle={{ padding: "16px 24px" }}>
        <Input.Search
          placeholder="输入企业名称或统一社会信用代码进行搜索"
          enterButton="查询企业画像"
          size="large"
          onSearch={handleSearch}
          loading={loading}
          style={{ maxWidth: 600 }}
        />
      </Card>

      {/* 2. 企业信息概览区 */}
      <Card bordered={false} title="企业基本信息">
        <Descriptions
          bordered
          column={{ xxl: 4, xl: 3, lg: 3, md: 2, sm: 1, xs: 1 }}
        >
          <Descriptions.Item label="企业名称">
            {enterprise.name}
          </Descriptions.Item>
          <Descriptions.Item label="统一社会信用代码">
            {enterprise.creditCode}
          </Descriptions.Item>
          <Descriptions.Item label="所属产业">
            {enterprise.industry}
          </Descriptions.Item>
          <Descriptions.Item label="产业链环节">
            <Tag color="cyan">{enterprise.chainPosition}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="注册资本">
            {enterprise.regCapital}
          </Descriptions.Item>
          <Descriptions.Item label="成立日期">
            {enterprise.estDate}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 3. 评分核心区 (总分 + 雷达图 + 维度列表) */}
      <Row gutter={16}>
        {/* 左侧：总分展示 */}
        <Col xs={24} md={6}>
          <Card
            bordered={false}
            style={{ height: "100%", textAlign: "center" }}
          >
            <div style={{ padding: "40px 0" }}>
              <Title level={5} type="secondary">
                企业综合评分
              </Title>
              <Title
                style={{ fontSize: 64, margin: "10px 0", color: "#1890ff" }}
              >
                {MOCK_SCORE_OVERVIEW.totalScore}
              </Title>
              <div style={{ marginBottom: 20 }}>
                <Tag color="gold" style={{ fontSize: 16, padding: "5px 15px" }}>
                  评级：{MOCK_SCORE_OVERVIEW.level}
                </Tag>
              </div>
              <Text type="secondary">
                行业排名：第{" "}
                <b style={{ color: "#333" }}>{MOCK_SCORE_OVERVIEW.rank}</b> 名
                <span style={{ marginLeft: 8, color: "#ff4d4f", fontSize: 12 }}>
                  <TrophyOutlined /> TOP 5%
                </span>
              </Text>
            </div>
          </Card>
        </Col>

        {/* 中间：雷达图 */}
        <Col xs={24} md={10}>
          <Card
            bordered={false}
            title="维度能力分析"
            style={{ height: "100%" }}
          >
            <div style={{ height: 300 }}>
              <Radar {...radarConfig} />
            </div>
          </Card>
        </Col>

        {/* 右侧：维度列表 (点击可联动下方) */}
        <Col xs={24} md={8}>
          <Card
            bordered={false}
            title="评分维度明细 (点击查看依据)"
            style={{ height: "100%" }}
            bodyStyle={{ padding: "0 12px" }}
          >
            <List
              itemLayout="horizontal"
              dataSource={MOCK_RADAR_DATA}
              renderItem={(item) => (
                <List.Item
                  onClick={() => setActiveDimension(item.item)}
                  style={{
                    cursor: "pointer",
                    padding: "12px",
                    backgroundColor:
                      activeDimension === item.item ? "#e6f7ff" : "transparent",
                    borderLeft:
                      activeDimension === item.item
                        ? "3px solid #1890ff"
                        : "3px solid transparent",
                    transition: "all 0.3s",
                  }}
                >
                  <List.Item.Meta
                    avatar={
                      <Badge
                        status={
                          item.score >= 80
                            ? "success"
                            : item.score >= 60
                            ? "processing"
                            : "warning"
                        }
                      />
                    }
                    title={<span>{item.item}</span>}
                  />
                  <div
                    style={{
                      fontWeight: "bold",
                      fontSize: 16,
                      color: "#1890ff",
                    }}
                  >
                    {item.score} 分
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* 4. 评分依据下钻区 (核心功能) */}
      <Card
        bordered={false}
        title={
          <Space>
            <CalculatorOutlined />
            <span>评分计算依据与数据溯源</span>
          </Space>
        }
      >
        <Tabs
          activeKey={activeDimension}
          onChange={setActiveDimension}
          type="card"
          items={MOCK_RADAR_DATA.map((dim) => ({
            label: dim.item,
            key: dim.item,
            children: (
              <div style={{ paddingTop: 10 }}>
                {/* A. 公式展示区 */}
                <Alert
                  message={
                    <Space direction="vertical">
                      <Text strong style={{ fontSize: 16 }}>
                        <CalculatorOutlined /> 计算公式
                      </Text>
                      <Text code copyable style={{ fontSize: 14 }}>
                        {DIMENSION_DETAILS[dim.item]?.formula || "暂无公式配置"}
                      </Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {DIMENSION_DETAILS[dim.item]?.desc}
                      </Text>
                    </Space>
                  }
                  type="info"
                  showIcon={false}
                  style={{
                    marginBottom: 24,
                    border: "1px solid #91caff",
                    background: "#f0f5ff",
                  }}
                />

                {/* B. 数据筛选栏 */}
                <Row
                  justify="space-between"
                  align="middle"
                  style={{ marginBottom: 16 }}
                >
                  <Col>
                    <Title level={5} style={{ margin: 0 }}>
                      <FileTextOutlined /> 原始数据明细
                    </Title>
                  </Col>
                  <Col>
                    <Space>
                      <Input.Search
                        placeholder="搜索数据项名称 (如专利号)"
                        style={{ width: 250 }}
                      />
                      <Button icon={<CheckCircleOutlined />}>导出证据</Button>
                    </Space>
                  </Col>
                </Row>

                {/* C. 详细数据表格 */}
                <Table
                  columns={detailColumns}
                  dataSource={DIMENSION_DETAILS[dim.item]?.tableData || []}
                  pagination={{ pageSize: 5 }}
                  size="middle"
                  bordered
                  locale={{ emptyText: "该维度暂无详细数据记录" }}
                />
              </div>
            ),
          }))}
        />
      </Card>
    </Space>
  );
};

export default EnterpriseScore;
