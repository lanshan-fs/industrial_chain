/**
 * src/pages/IndustryPortrait/components/EnterpriseOverviewTab.tsx
 */
import React, { useState } from "react";
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
  Progress,
  Timeline,
  Alert,
  Grid,
  List,
  Dropdown,
  ConfigProvider,
} from "antd";
import type { MenuProps } from "antd";
import {
  GlobalOutlined,
  EnvironmentOutlined,
  BankOutlined,
  ExperimentOutlined,
  ThunderboltOutlined,
  UserOutlined,
  WarningOutlined,
  RiseOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { Radar } from "@ant-design/plots";
import dayjs from "dayjs";

// --- 引入新组件 ---
import EnterpriseBasicInfoTab from "./EnterpriseBasicInfoTab";
import ProfileListCard from "./ProfileListCard";

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

// --- 图表配置 (保持不变) ---
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

// --- 新版标签页配置 (保持不变) ---
const NEW_TAB_CONFIG = [
  {
    key: "basic",
    label: "基本信息",
    children: [
      { key: "basic-business", label: "工商信息" },
      { key: "basic-shareholder", label: "股东信息" },
      { key: "basic-personnel", label: "主要人员" },
      { key: "basic-branch", label: "分支机构" },
      { key: "basic-change", label: "变更记录" },
      { key: "basic-report", label: "企业年报" },
      { key: "basic-social", label: "社保人数" },
      { key: "basic-related", label: "关联企业" },
    ],
  },
  {
    key: "judicial",
    label: "司法涉诉",
    children: [
      { key: "judicial-case", label: "司法案件" },
      { key: "judicial-doc", label: "法律文书" },
      { key: "judicial-dishonest", label: "失信被执行" },
      { key: "judicial-litigation", label: "诉讼" },
    ],
  },
  {
    key: "investment",
    label: "投融资",
    children: [
      { key: "invest-history", label: "融资历史" },
      { key: "invest-out", label: "对外投资" },
    ],
  },
  {
    key: "risk",
    label: "经营风险",
    children: [
      { key: "risk-abnormal", label: "经营异常" },
      { key: "risk-admin", label: "行政处罚" },
      { key: "risk-env", label: "环保处罚" },
      { key: "risk-clear", label: "清算信息" },
    ],
  },
  {
    key: "operating",
    label: "经营信息",
    children: [
      { key: "op-bid", label: "招投标" },
      { key: "op-product", label: "产品" },
      { key: "op-cert", label: "资质认证" },
      { key: "op-tax", label: "税务资质" },
      { key: "op-client", label: "客户" },
      { key: "op-supplier", label: "供应商" },
    ],
  },
  {
    key: "ip",
    label: "知识产权",
    children: [
      { key: "ip-patent", label: "专利" },
      { key: "ip-soft", label: "软件著作" },
      { key: "ip-tm", label: "商标" },
      { key: "ip-copy", label: "著作权" },
    ],
  },
];

interface EnterpriseOverviewTabProps {
  profile: any;
}

const EnterpriseOverviewTab: React.FC<EnterpriseOverviewTabProps> = ({
  profile,
}) => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const [activeTabKey, setActiveTabKey] = useState("basic");

  // --- 锚点跳转处理 ---
  const handleSubMenuClick = (tabKey: string, subKey: string) => {
    setActiveTabKey(tabKey);
    setTimeout(() => {
      const el = document.getElementById(subKey);
      if (el) {
        const headerOffset = 60;
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }, 100);
  };

  // --- 占位渲染 (用于非基本信息 Tab) ---
  const renderPlaceholderTab = (title: string) => (
    <div style={{ padding: 24, minHeight: 300 }}>
      <Alert
        message={`此处展示${title}详细信息`}
        type="info"
        showIcon
        style={{ marginBottom: 24, borderRadius: 0 }}
      />
      <ProfileListCard
        columns={[
          { title: "项目", dataIndex: "name" },
          { title: "详情", dataIndex: "desc" },
        ]}
        data={[{ key: 1, name: "示例数据", desc: "暂无记录" }]}
      />
    </div>
  );

  // --- 渲染评分模型子卡片 (保持不变) ---
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
      {/* 区块一：企业名片 (代码保持不变) */}
      <div style={{ padding: 24, borderBottom: BORDER_STYLE }}>
        <Row gutter={24} align="middle">
          <Col flex="100px">
            <Avatar
              shape="square"
              size={88}
              style={{ backgroundColor: COLORS.primary, fontSize: 32 }}
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
                  <UserOutlined /> 法人：{profile.baseInfo.legalPerson}
                </span>
                <span>
                  <EnvironmentOutlined /> 地址：{profile.baseInfo.address}
                </span>
                <span>
                  <GlobalOutlined /> 官网：{profile.baseInfo.website}
                </span>
              </Space>
              <Space style={{ marginTop: 8 }} wrap>
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

      {/* 区块二：工商信息全景 + 资质荣誉 (代码保持不变) */}
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
                {profile.baseInfo.regCapital}
              </Descriptions.Item>
              <Descriptions.Item label="实缴资本">
                {profile.baseInfo.paidInCapital}
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
            <Text strong>资质与荣誉概览</Text>
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
          </div>
        </Col>
      </Row>

      {/* =======================
          【修改】新增区块：企业详细数据 (Custom Tabs)
          优化目标：下拉选框配色、阴影优化，以及字号行高加大
          ======================= */}
      <div style={{ borderBottom: BORDER_STYLE, minHeight: 300 }}>
        {/* Sticky 导航栏 */}
        <div
          style={{
            background: "#fff",
            borderBottom: "1px solid #e8e8e8",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          {/* 使用 ConfigProvider 覆盖下拉菜单样式 */}
          <ConfigProvider
            theme={{
              components: {
                Dropdown: {
                  borderRadius: 0,
                },
                Menu: {
                  borderRadius: 0,
                  borderRadiusLG: 0,
                  borderRadiusSM: 0,
                  itemSelectedBg: "#f5f9ff",
                  itemSelectedColor: COLORS.primary,
                  itemHoverBg: "#fafafa",
                  boxShadowSecondary: "0 4px 12px rgba(0,0,0,0.06)",

                  // 【核心修改】加大字号和行高(选项高度)
                  itemHeight: 42, // 原 38
                  fontSize: 14, // 原 13
                },
              },
            }}
          >
            <Row>
              {NEW_TAB_CONFIG.map((tab) => {
                const isActive = activeTabKey === tab.key;

                // 构造下拉菜单项
                const menuItems: MenuProps["items"] = tab.children.map(
                  (child) => ({
                    key: child.key,
                    label: (
                      <span style={{ fontWeight: 400 }}>{child.label}</span>
                    ),
                    onClick: () => handleSubMenuClick(tab.key, child.key),
                  }),
                );

                return (
                  <Col key={tab.key} flex={1} style={{ textAlign: "center" }}>
                    <Dropdown
                      menu={{
                        items: menuItems,
                        style: {
                          border: "1px solid #ebebeb",
                          borderTop: "none",
                        },
                      }}
                      placement="bottom"
                      overlayStyle={{ paddingTop: 0 }}
                    >
                      <div
                        onClick={() => setActiveTabKey(tab.key)}
                        style={{
                          cursor: "pointer",
                          height: 48,
                          lineHeight: "48px",
                          fontSize: 14,
                          fontWeight: isActive ? 600 : 400,
                          color: isActive ? COLORS.primary : "#333",
                          borderBottom: isActive
                            ? `2px solid ${COLORS.primary}`
                            : "2px solid transparent",
                          transition: "all 0.2s",
                          background: "#fff",
                        }}
                      >
                        {tab.label}{" "}
                        <DownOutlined
                          style={{
                            fontSize: 10,
                            color: "#ccc",
                            marginLeft: 4,
                            verticalAlign: "middle",
                          }}
                        />
                      </div>
                    </Dropdown>
                  </Col>
                );
              })}
            </Row>
          </ConfigProvider>
        </div>

        {/* 内容区域 */}
        <div style={{ backgroundColor: "#fff", paddingTop: 8 }}>
          {activeTabKey === "basic" && (
            <EnterpriseBasicInfoTab profile={profile} />
          )}
          {activeTabKey === "judicial" && renderPlaceholderTab("司法涉诉")}
          {activeTabKey === "investment" && renderPlaceholderTab("投融资")}
          {activeTabKey === "risk" && renderPlaceholderTab("经营风险")}
          {activeTabKey === "operating" && renderPlaceholderTab("经营信息")}
          {activeTabKey === "ip" && renderPlaceholderTab("知识产权")}
        </div>
      </div>

      {/* 区块三：企业综合评估 (代码保持不变) */}
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

      {/* 区块四：三大评分模型 (代码保持不变) */}
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
