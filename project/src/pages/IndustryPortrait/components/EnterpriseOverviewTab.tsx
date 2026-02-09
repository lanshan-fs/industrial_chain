/**
 * src/pages/IndustryPortrait/components/EnterpriseOverviewTab.tsx
 */
import React from "react";
import {
  Row,
  Col,
  Typography,
  Space,
  Tag,
  Avatar,
  Descriptions,
  Table,
  Statistic,
  Divider,
  Progress,
  Timeline,
  Alert,
  Grid,
  List,
} from "antd";
import {
  GlobalOutlined,
  EnvironmentOutlined,
  BankOutlined,
  ExperimentOutlined,
  ThunderboltOutlined,
  UserOutlined,
  WarningOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import { Radar } from "@ant-design/plots";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

// --- 视觉风格定义 ---
const COLORS = {
  primary: "#1890ff",
  gold: "#faad14",
  green: "#52c41a",
  bg: "#fff",
  borderColor: "#f0f0f0",
  textSecondary: "#666",
  riskHigh: "#ff4d4f",
  riskMedium: "#faad14",
  riskLow: "#52c41a",
};

const BORDER_STYLE = `1px solid ${COLORS.borderColor}`;

// --- 图表配置 ---
const MAIN_RADAR_CONFIG = (data: any[]) => ({
  data,
  xField: "item",
  yField: "score",
  area: {
    style: {
      fill: "l(90) 0:#1890ff 1:rgba(24,144,255,0.1)",
      fillOpacity: 0.4,
    },
  },
  line: { style: { stroke: "#1890ff", lineWidth: 2 } },
  point: {
    size: 3,
    shape: "circle",
    style: { fill: "#fff", stroke: "#1890ff", lineWidth: 2 },
  },
  scale: { y: { min: 0, max: 100, tickCount: 5 } },
  axis: { x: { grid: { line: { style: { stroke: "#eee" } } } } },
  height: 220,
});

interface EnterpriseOverviewTabProps {
  profile: any;
}

const EnterpriseOverviewTab: React.FC<EnterpriseOverviewTabProps> = ({
  profile,
}) => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  // --- 渲染评分模型子卡片 ---
  const renderSubModelCard = (
    title: string,
    icon: React.ReactNode,
    modelData: any,
    color: string,
    hasRightBorder: boolean = true,
  ) => {
    const columns: any[] = [
      {
        title: "评分维度",
        dataIndex: "name",
        ellipsis: true,
        align: "left",
        render: (t: string) => <Text style={{ fontSize: 13 }}>{t}</Text>,
      },
      {
        title: "权重",
        dataIndex: "weight",
        width: 80,
        align: "center",
        sorter: (a: any, b: any) => a.weight - b.weight,
        render: (t: number) => <Tag style={{ marginRight: 0 }}>{t}%</Tag>,
      },
      {
        title: "得分",
        dataIndex: "score",
        width: 80,
        align: "center",
        sorter: (a: any, b: any) => a.score - b.score,
        render: (s: number) => (
          <Text strong style={{ color: s < 60 ? "red" : color }}>
            {s}
          </Text>
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
            suffix={<span style={{ fontSize: 12, color: "#999" }}>分(总)</span>}
          />
        </div>
        <div style={{ flex: 1, padding: 0 }}>
          <Table
            dataSource={modelData.dimensions}
            rowKey="name"
            pagination={false}
            size="small"
            columns={columns}
            scroll={{ y: 250 }}
            bordered={false}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      {/* 区块一：企业名片 */}
      <div style={{ padding: 24, borderBottom: BORDER_STYLE }}>
        <Row gutter={24} align="middle">
          <Col flex="100px">
            <Avatar
              shape="square"
              size={88}
              style={{
                backgroundColor: COLORS.primary,
                fontSize: 32,
              }}
            >
              {profile.baseInfo.name[0]}
            </Avatar>
          </Col>
          <Col flex="auto">
            <Space direction="vertical" size={6} style={{ width: "100%" }}>
              <Space align="center">
                <Title level={3} style={{ margin: 0 }}>
                  {profile.baseInfo.name}
                </Title>
                <Tag color="success">在业</Tag>
                <Tag color="blue">{profile.baseInfo.type}</Tag>
              </Space>
              <Space size={24} style={{ color: COLORS.textSecondary }}>
                <span>
                  <UserOutlined /> 法人：
                  {profile.baseInfo.legalPerson}
                </span>
                <span>
                  <EnvironmentOutlined /> 地址：
                  {profile.baseInfo.address}
                </span>
                <span>
                  <GlobalOutlined /> 官网：{profile.baseInfo.website}
                </span>
              </Space>
              <Space style={{ marginTop: 8 }}>
                {profile.tags.map((t: string) => (
                  <Tag key={t} color="geekblue">
                    {t}
                  </Tag>
                ))}
              </Space>
            </Space>
          </Col>
          <Col
            flex="200px"
            style={{
              textAlign: "right",
              borderLeft: "1px solid #f0f0f0",
              paddingLeft: 24,
            }}
          >
            <Statistic
              title="综合健康分"
              value={profile.metrics.totalScore}
              valueStyle={{
                color: COLORS.primary,
                fontSize: 36,
                fontWeight: "bold",
              }}
              suffix={
                <span style={{ fontSize: 14, color: "#999" }}>/ 100</span>
              }
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                更新于：{dayjs().format("YYYY-MM-DD")}
              </Text>
            </div>
          </Col>
        </Row>
      </div>

      {/* 区块二：工商信息全景 + 资质荣誉 */}
      <Row gutter={0} style={{ borderBottom: BORDER_STYLE }}>
        <Col
          xs={24}
          lg={16}
          style={{ borderRight: !isMobile ? BORDER_STYLE : "none" }}
        >
          <div
            style={{
              padding: "12px 24px",
              borderBottom: BORDER_STYLE,
              backgroundColor: "#fafafa",
            }}
          >
            <Text strong>工商信息全景</Text>
          </div>
          <div style={{ padding: 24 }}>
            <Descriptions
              column={2}
              bordered
              size="small"
              labelStyle={{ width: 160, background: "#fafafa" }}
            >
              <Descriptions.Item label="统一社会信用代码">
                {profile.baseInfo.creditCode}
              </Descriptions.Item>
              <Descriptions.Item label="纳税人识别号">
                {profile.baseInfo.taxId}
              </Descriptions.Item>
              <Descriptions.Item label="注册资本">
                {profile.baseInfo.regCapital} 万元
              </Descriptions.Item>
              <Descriptions.Item label="实缴资本">
                {profile.baseInfo.paidInCapital} 万元
              </Descriptions.Item>
              <Descriptions.Item label="成立日期">
                {profile.baseInfo.establishDate}
              </Descriptions.Item>
              <Descriptions.Item label="企业类型">
                {profile.baseInfo.type}
              </Descriptions.Item>
              <Descriptions.Item label="所属行业">
                {profile.baseInfo.industry}
              </Descriptions.Item>
              <Descriptions.Item label="参保人数">124 人</Descriptions.Item>
              <Descriptions.Item label="注册地址" span={2}>
                {profile.baseInfo.address}
              </Descriptions.Item>
              <Descriptions.Item label="经营范围" span={2}>
                {profile.baseInfo.scope}
              </Descriptions.Item>
            </Descriptions>
          </div>
        </Col>
        <Col xs={24} lg={8}>
          <div
            style={{
              padding: "12px 24px",
              borderBottom: BORDER_STYLE,
              display: "flex",
              justifyContent: "space-between",
              backgroundColor: "#fafafa",
            }}
          >
            <Text strong>资质与荣誉</Text>
            <a href="#">更多</a>
          </div>
          <div style={{ padding: 24 }}>
            <Timeline
              items={profile.honors.map((h: any) => ({
                color: "blue",
                children: (
                  <>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {h.year}
                    </Text>
                    <div style={{ fontWeight: 500 }}>{h.name}</div>
                  </>
                ),
              }))}
            />
            <Divider style={{ margin: "12px 0" }} />
            <Title level={5} style={{ fontSize: 14, marginBottom: 8 }}>
              企业标签
            </Title>
            <Space size={[0, 8]} wrap>
              {profile.tags.map((t: string) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </Space>
          </div>
        </Col>
      </Row>

      {/* 区块三：企业综合评估 */}
      <div style={{ borderBottom: BORDER_STYLE }}>
        <div
          style={{
            padding: "12px 24px",
            borderBottom: BORDER_STYLE,
            backgroundColor: "#fafafa",
          }}
        >
          <Text strong>企业综合评估</Text>
        </div>
        <div style={{ padding: 24 }}>
          <Row gutter={0}>
            {/* 左子区块：企业综合能力可视化 */}
            <Col
              xs={24}
              lg={14}
              style={{
                borderRight: !isMobile ? "1px solid #f0f0f0" : "none",
                paddingRight: !isMobile ? 24 : 0,
              }}
            >
              <Title level={5} style={{ fontSize: 14, marginBottom: 24 }}>
                企业综合能力可视化
              </Title>
              <Row gutter={24} align="middle">
                <Col xs={24} md={10} style={{ textAlign: "center" }}>
                  <Progress
                    type="dashboard"
                    percent={profile.metrics.totalScore}
                    strokeColor={COLORS.primary}
                    width={180}
                    format={(percent) => (
                      <div style={{ color: COLORS.primary }}>
                        <div style={{ fontSize: 32 }}>{percent}</div>
                        <div style={{ fontSize: 14, color: "#999" }}>
                          综合得分
                        </div>
                      </div>
                    )}
                  />
                  <div style={{ marginTop: 16 }}>
                    <Alert
                      message="经营稳健，潜力巨大"
                      type="success"
                      showIcon
                      style={{
                        display: "inline-flex",
                        fontSize: 12,
                        padding: "4px 12px",
                      }}
                    />
                  </div>
                </Col>
                <Col xs={24} md={14}>
                  <Radar {...MAIN_RADAR_CONFIG(profile.overallRadar)} />
                </Col>
              </Row>
            </Col>

            {/* 右子区块：企业迁出风险 */}
            <Col xs={24} lg={10} style={{ paddingLeft: !isMobile ? 24 : 0 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <Title level={5} style={{ fontSize: 14, margin: 0 }}>
                  企业迁出风险
                </Title>
                <WarningOutlined style={{ color: "#faad14" }} />
              </div>

              <div
                style={{
                  background: "#fff",
                  borderRadius: 4,
                  padding: "16px 0",
                }}
              >
                <Row align="middle" gutter={16} style={{ marginBottom: 20 }}>
                  <Col>
                    <Text type="secondary">当前风险等级：</Text>
                  </Col>
                  <Col>
                    <Tag
                      color={profile.migrationRisk.color}
                      style={{
                        fontSize: 14,
                        padding: "4px 12px",
                        fontWeight: "bold",
                      }}
                    >
                      {profile.migrationRisk.level}风险
                    </Tag>
                  </Col>
                  <Col>
                    <Progress
                      percent={profile.migrationRisk.score}
                      size="small"
                      status="normal"
                      strokeColor={profile.migrationRisk.color}
                      style={{ width: 100 }}
                      showInfo={false}
                    />
                  </Col>
                </Row>

                <Text strong style={{ fontSize: 12, color: "#999" }}>
                  关键风险因素 (Top 5)
                </Text>
                <List
                  size="small"
                  split={false}
                  dataSource={profile.migrationRisk.factors}
                  renderItem={(item: any, index: number) => (
                    <List.Item
                      style={{
                        padding: "8px 0",
                        borderBottom: "1px dashed #f0f0f0",
                      }}
                    >
                      <Space style={{ width: "100%" }}>
                        <Avatar
                          size={18}
                          style={{
                            backgroundColor: index < 3 ? "#ffccc7" : "#f0f0f0",
                            color: index < 3 ? "#cf1322" : "#666",
                            fontSize: 10,
                          }}
                        >
                          {index + 1}
                        </Avatar>
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Text style={{ fontSize: 13 }}>{item.name}</Text>
                            <Space size={4}>
                              {item.impact === "High" && (
                                <RiseOutlined
                                  style={{
                                    color: COLORS.riskHigh,
                                    fontSize: 10,
                                  }}
                                />
                              )}
                              <Text type="secondary" style={{ fontSize: 12 }}>
                                {item.desc}
                              </Text>
                            </Space>
                          </div>
                        </div>
                      </Space>
                    </List.Item>
                  )}
                />
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {/* 区块四：三大评分模型 */}
      <Row gutter={0} style={{ borderBottom: BORDER_STYLE }}>
        <Col xs={24} md={8}>
          {renderSubModelCard(
            "企业基础评分",
            <BankOutlined style={{ color: COLORS.gold }} />,
            profile.models.basic,
            COLORS.gold,
            true,
          )}
        </Col>
        <Col xs={24} md={8}>
          {renderSubModelCard(
            "科技属性评分",
            <ExperimentOutlined style={{ color: COLORS.primary }} />,
            profile.models.tech,
            COLORS.primary,
            true,
          )}
        </Col>
        <Col xs={24} md={8}>
          {renderSubModelCard(
            "企业能力评分",
            <ThunderboltOutlined style={{ color: COLORS.green }} />,
            profile.models.ability,
            COLORS.green,
            false,
          )}
        </Col>
      </Row>
    </>
  );
};

export default EnterpriseOverviewTab;
