import React, { useState } from "react";
import {
  Card,
  Input,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  Typography,
  Space,
  Descriptions,
} from "antd";
import { RiseOutlined, TeamOutlined, BankOutlined } from "@ant-design/icons";
import { Radar } from "@ant-design/plots";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

// --- 模拟数据 ---
// 1. 产业基础信息
const INDUSTRY_INFO = {
  name: "数字医疗产业",
  code: "CY-DM-2026",
  totalEnterprises: 1256,
  avgScore: 82.5,
  level: "A+",
};

// 2. 雷达图数据 (各维度平均分)
const RADAR_DATA = [
  { item: "基础评分", score: 85 },
  { item: "科技属性", score: 78 },
  { item: "专业能力", score: 90 },
  { item: "财务能力", score: 70 },
  { item: "招商评分", score: 88 },
];

// 3. 右侧详情列表数据
const DIMENSION_DETAILS = [
  {
    key: "1",
    dimension: "基础评分",
    indicator: "注册资本、成立年限、参保人数",
    avgScore: 85,
  },
  {
    key: "2",
    dimension: "科技属性",
    indicator: "专利数量、研发人员占比、软著数量",
    avgScore: 78,
  },
  {
    key: "3",
    dimension: "专业能力",
    indicator: "资质认证、行业标准制定、核心期刊论文",
    avgScore: 90,
  },
  {
    key: "4",
    dimension: "财务能力",
    indicator: "营收增长率、净利润率、纳税额",
    avgScore: 70,
  },
  {
    key: "5",
    dimension: "招商评分",
    indicator: "政策匹配度、投资意向、落地可行性",
    avgScore: 88,
  },
];

const IndustryScore: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // 处理搜索：跳转到企业评分页面 (需携带参数)
  const handleSearch = (value: string) => {
    if (!value) return;
    setLoading(true);
    // 模拟搜索延迟
    setTimeout(() => {
      setLoading(false);
      // 跳转到企业评分详情页，实际开发中应先调用接口获取企业ID
      navigate(`/score-mgmt/enterprise-score?keyword=${value}`);
    }, 500);
  };

  // 雷达图配置
  const radarConfig = {
    data: RADAR_DATA,
    xField: "item",
    yField: "score",
    area: {
      style: {
        fillOpacity: 0.2,
      },
    },
    meta: {
      score: {
        alias: "平均分数",
        min: 0,
        max: 100,
      },
    },
    axis: {
      x: {
        grid: {
          line: {
            style: {
              stroke: "rgba(0,0,0,0.1)",
            },
          },
        },
      },
      y: {
        grid: {
          line: {
            style: {
              stroke: "rgba(0,0,0,0.1)",
            },
          },
        },
      },
    },
    point: {
      shapeField: "circle",
      sizeField: 4,
    },
    style: {
      lineWidth: 2,
    },
  };

  const columns = [
    {
      title: "维度名称",
      dataIndex: "dimension",
      key: "dimension",
      width: 120,
      render: (text: string) => <b>{text}</b>,
    },
    { title: "包含关键指标", dataIndex: "indicator", key: "indicator" },
    {
      title: "行业平均分",
      dataIndex: "avgScore",
      key: "avgScore",
      width: 120,
      render: (score: number) => (
        <Tag color={score > 80 ? "green" : score > 60 ? "blue" : "orange"}>
          {score} 分
        </Tag>
      ),
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      {/* 1. 顶部搜索区 */}
      <Card bordered={false} style={{ borderRadius: 8 }}>
        <Row justify="center" align="middle">
          <Col xs={24} sm={18} md={12}>
            <Title level={4} style={{ textAlign: "center", marginBottom: 24 }}>
              产业与企业评分检索
            </Title>
            <Input.Search
              placeholder="请输入企业名称或统一社会信用代码，查看企业微观评分"
              enterButton="搜索企业"
              size="large"
              onSearch={handleSearch}
              loading={loading}
              allowClear
            />
          </Col>
        </Row>
      </Card>

      {/* 2. 产业概览统计卡片 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card bordered={false} hoverable style={{ height: "100%" }}>
            <Statistic
              title="当前分析产业"
              value={INDUSTRY_INFO.name}
              prefix={<BankOutlined />}
            />
            <div style={{ marginTop: 8, color: "#999" }}>
              产业编码：{INDUSTRY_INFO.code}
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} hoverable style={{ height: "100%" }}>
            <Statistic
              title="入库企业总数"
              value={INDUSTRY_INFO.totalEnterprises}
              suffix="家"
              prefix={<TeamOutlined />}
            />
            <div style={{ marginTop: 8, color: "#999" }}>
              覆盖上中下游全产业链
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} hoverable style={{ height: "100%" }}>
            <Statistic
              title="产业综合评分"
              value={INDUSTRY_INFO.avgScore}
              precision={1}
              valueStyle={{ color: "#3f8600" }}
              prefix={<RiseOutlined />}
              suffix={
                <Tag color="success" style={{ marginLeft: 10 }}>
                  {INDUSTRY_INFO.level}
                </Tag>
              }
            />
            <div style={{ marginTop: 8, color: "#999" }}>
              基于 5 大维度 120 项指标计算
            </div>
          </Card>
        </Col>
      </Row>

      {/* 3. 核心图表与详情区 */}
      <Row gutter={24}>
        {/* 左侧：雷达图 */}
        <Col xs={24} lg={10}>
          <Card
            title="产业评分维度分析"
            bordered={false}
            style={{ height: "100%" }}
          >
            <div style={{ height: 350 }}>
              <Radar {...radarConfig} />
            </div>
            <div
              style={{
                textAlign: "center",
                marginTop: 16,
                color: "#666",
                fontSize: 12,
              }}
            >
              * 数据实时更新，展示产业内所有企业在各维度的平均表现
            </div>
          </Card>
        </Col>

        {/* 右侧：维度指标详情 */}
        <Col xs={24} lg={14}>
          <Card
            title="维度得分详情"
            bordered={false}
            style={{ height: "100%" }}
          >
            <Table
              dataSource={DIMENSION_DETAILS}
              columns={columns}
              pagination={false}
              size="middle"
            />
            <div style={{ marginTop: 24 }}>
              <Descriptions
                title="产业优势分析"
                column={1}
                size="small"
                bordered
              >
                <Descriptions.Item label="优势维度">
                  <span style={{ color: "#1890ff" }}>专业能力 (90分)</span>、
                  <span style={{ color: "#1890ff" }}>招商评分 (88分)</span>
                </Descriptions.Item>
                <Descriptions.Item label="薄弱环节">
                  <span style={{ color: "#faad14" }}>财务能力 (70分)</span>
                  <span style={{ fontSize: 12, color: "#999", marginLeft: 8 }}>
                    (建议：加强中小微企业融资扶持政策)
                  </span>
                </Descriptions.Item>
              </Descriptions>
            </div>
          </Card>
        </Col>
      </Row>
    </Space>
  );
};

export default IndustryScore;
