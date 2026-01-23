import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  List,
  Tag,
  Button,
  Typography,
  Space,
  Progress,
  Tooltip,
  Drawer,
  message,
} from "antd";
import {
  TagsOutlined,
  BankOutlined,
  SettingOutlined,
  FireOutlined,
  ArrowUpOutlined,
  RightOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

// --- 模拟数据 ---

// 1. 总体统计数据
const overviewData = {
  totalTags: 128,
  coveredEnterprises: 345,
  dailyGrowth: 2.3, // 较昨日增长百分比
};

// 2. 五个维度详情数据
const dimensionData = [
  {
    id: "basic",
    name: "基本信息维度",
    tagCount: 24,
    usedCount: 345,
    color: "#1890ff",
  },
  {
    id: "business",
    name: "经营业务维度",
    tagCount: 36,
    usedCount: 280,
    color: "#52c41a",
  },
  {
    id: "tech",
    name: "科技属性维度",
    tagCount: 18,
    usedCount: 120,
    color: "#722ed1",
  },
  {
    id: "risk",
    name: "风险管控维度",
    tagCount: 15,
    usedCount: 45,
    color: "#faad14",
  },
  {
    id: "market",
    name: "市场表现维度",
    tagCount: 35,
    usedCount: 88,
    color: "#f5222d",
  },
];

// 3. 热门标签 Top 10
const hotTags = [
  { rank: 1, name: "高新技术企业", count: 156, dimension: "科技属性维度" },
  { rank: 2, name: "朝阳区重点", count: 142, dimension: "基本信息维度" },
  { rank: 3, name: "养老服务", count: 98, dimension: "经营业务维度" },
  { rank: 4, name: "专精特新", count: 85, dimension: "科技属性维度" },
  { rank: 5, name: "政府采购", count: 76, dimension: "经营业务维度" },
  { rank: 6, name: "信用良好", count: 68, dimension: "风险管控维度" },
  { rank: 7, name: "研发强", count: 54, dimension: "科技属性维度" },
  { rank: 8, name: "拟上市", count: 42, dimension: "市场表现维度" },
  { rank: 9, name: "互联网医疗", count: 38, dimension: "经营业务维度" },
  { rank: 10, name: "独角兽", count: 12, dimension: "科技属性维度" },
];

const TagLibrary: React.FC = () => {
  const [manageDrawerVisible, setManageDrawerVisible] = useState(false);

  // 模拟打开配置抽屉
  const showDrawer = () => {
    setManageDrawerVisible(true);
  };

  const closeDrawer = () => {
    setManageDrawerVisible(false);
  };

  return (
    <div style={{ minHeight: "100%" }}>
      {/* 第一部分：体系统计卡片 */}
      <Card bordered={false} style={{ marginBottom: 24 }}>
        <Row gutter={24}>
          <Col span={12}>
            <Statistic
              title="标签库总数"
              value={overviewData.totalTags}
              prefix={<TagsOutlined />}
              suffix="个"
              valueStyle={{ color: "#1890ff" }}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: "#8c8c8c" }}>
              涵盖 5 大维度，持续建设中
            </div>
          </Col>
          <Col span={12}>
            <Statistic
              title="已覆盖企业总数"
              value={overviewData.coveredEnterprises}
              prefix={<BankOutlined />}
              suffix="家"
              valueStyle={{ color: "#52c41a" }}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: "#8c8c8c" }}>
              <Space>
                <span>较昨日新增</span>
                <span style={{ color: "#cf1322" }}>
                  <ArrowUpOutlined /> {overviewData.dailyGrowth}%
                </span>
              </Space>
            </div>
          </Col>
        </Row>
      </Card>

      {/* 第二部分：五个维度详情卡片 */}
      <Title level={5} style={{ marginBottom: 16 }}>
        维度分布详情
      </Title>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {dimensionData.map((dim) => (
          <Col
            xs={24}
            sm={12}
            md={8}
            lg={4}
            xl={4}
            style={{ flex: "1 0 auto" }}
            key={dim.id}
          >
            <Card
              hoverable
              bordered={false}
              style={{ height: "100%", borderTop: `4px solid ${dim.color}` }}
              bodyStyle={{ padding: "20px 16px" }}
            >
              <Space
                direction="vertical"
                style={{ width: "100%" }}
                size="middle"
              >
                <div>
                  <Text strong style={{ fontSize: 16 }}>
                    {dim.name}
                  </Text>
                </div>
                <div>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    标签数量
                  </Text>
                  <div style={{ fontSize: 24, fontWeight: "bold" }}>
                    {dim.tagCount}
                  </div>
                </div>
                <div>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    应用企业数
                  </Text>
                  <Progress
                    percent={Math.round(
                      (dim.usedCount / overviewData.coveredEnterprises) * 100
                    )}
                    size="small"
                    strokeColor={dim.color}
                    showInfo={false}
                  />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 12,
                      marginTop: 4,
                    }}
                  >
                    <span>{dim.usedCount} 家</span>
                    <a onClick={() => message.info(`跳转至${dim.name}详情页`)}>
                      详情 <RightOutlined style={{ fontSize: 10 }} />
                    </a>
                  </div>
                </div>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={24}>
        {/* 第三部分：热门标签展示 */}
        <Col xs={24} lg={16}>
          <Card
            title={
              <Space>
                <FireOutlined style={{ color: "#f5222d" }} /> 热门标签 Top 10
              </Space>
            }
            bordered={false}
            style={{ height: "100%" }}
          >
            <List
              itemLayout="horizontal"
              dataSource={hotTags}
              renderItem={(item) => (
                <List.Item>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        lineHeight: "24px",
                        textAlign: "center",
                        borderRadius: "50%",
                        background: item.rank <= 3 ? "#314659" : "#f0f2f5",
                        color: item.rank <= 3 ? "#fff" : "#000",
                        marginRight: 16,
                        fontWeight: "bold",
                        fontSize: 12,
                      }}
                    >
                      {item.rank}
                    </div>
                    <div style={{ flex: 1 }}>
                      <Text strong style={{ marginRight: 8 }}>
                        {item.name}
                      </Text>
                      <Tag style={{ fontSize: 10 }}>{item.dimension}</Tag>
                    </div>
                    <div style={{ width: 150 }}>
                      <Tooltip title={`使用次数: ${item.count}`}>
                        <Progress
                          percent={Math.min(item.count, 100)}
                          showInfo={false}
                          strokeColor="#faad14"
                        />
                      </Tooltip>
                    </div>
                    <div
                      style={{
                        width: 60,
                        textAlign: "right",
                        color: "#8c8c8c",
                      }}
                    >
                      {item.count} 次
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 第四部分：体系管理入口 & 系统信息 */}
        <Col xs={24} lg={8}>
          <Space direction="vertical" style={{ width: "100%" }} size={24}>
            {/* 体系管理入口 */}
            <Card
              title={
                <Space>
                  <SettingOutlined /> 体系管理
                </Space>
              }
              bordered={false}
              extra={
                <Button type="link" onClick={showDrawer}>
                  配置
                </Button>
              }
            >
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <Button
                  type="primary"
                  size="large"
                  onClick={showDrawer}
                  icon={<SettingOutlined />}
                  block
                >
                  标签体系配置
                </Button>
                <Text
                  type="secondary"
                  style={{ display: "block", marginTop: 16, fontSize: 13 }}
                >
                  <InfoCircleOutlined />{" "}
                  支持标签增删改、维度权重调整及自动打标规则设置
                </Text>
              </div>
            </Card>

            {/* 系统信息 */}
            <Card title="系统信息" bordered={false} size="small">
              <List size="small">
                <List.Item>
                  <Text type="secondary">最后更新时间</Text>
                  <Text>2026-01-15 10:30</Text>
                </List.Item>
                <List.Item>
                  <Text type="secondary">当前版本</Text>
                  <Text>V1.2.0</Text>
                </List.Item>
                <List.Item>
                  <Text type="secondary">数据来源</Text>
                  <Text>工商数据 / 专利库 / 人工录入</Text>
                </List.Item>
              </List>
            </Card>
          </Space>
        </Col>
      </Row>

      {/* 侧边栏抽屉：标签体系配置（模拟） */}
      <Drawer
        title="标签体系配置"
        placement="right"
        onClose={closeDrawer}
        open={manageDrawerVisible}
        width={400}
      >
        <div style={{ textAlign: "center", marginTop: 50, color: "#999" }}>
          <SettingOutlined style={{ fontSize: 48, marginBottom: 16 }} />
          <p>此处将提供标签维度的增删改查功能</p>
          <p>以及自动打标规则的详细配置页面</p>
        </div>
      </Drawer>
    </div>
  );
};

export default TagLibrary;
