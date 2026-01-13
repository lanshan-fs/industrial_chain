import React, { useState } from "react";
import {
  Layout,
  Menu,
  Input,
  Avatar,
  Dropdown,
  Space,
  Typography,
  Card,
  List,
  Tag,
  Button,
  theme,
  Breadcrumb,
  Row,
  Col,
  Tree,
  Tabs,
  Divider,
  Statistic,
} from "antd";
import type { MenuProps, TreeDataNode } from "antd";
import {
  UserOutlined,
  DownOutlined,
  AppstoreOutlined,
  SearchOutlined,
  BellOutlined,
  LogoutOutlined,
  SettingOutlined,
  DashboardOutlined,
  BarChartOutlined,
  ProjectOutlined,
  TagsOutlined,
  FileSearchOutlined,
  LineChartOutlined,
} from "@ant-design/icons";

const { Header, Content, Footer, Sider } = Layout;
const { Title, Text } = Typography;

// --- 模拟数据 ---

// 1. 顶部功能导航
const headerNavItems: MenuProps["items"] = [
  { key: "home", label: "首页", icon: <DashboardOutlined /> },
  { key: "data-mgmt", label: "数据管理", icon: <AppstoreOutlined /> },
  { key: "score-mgmt", label: "评分管理", icon: <BarChartOutlined /> },
  { key: "graph-portrait", label: "图谱画像", icon: <ProjectOutlined /> },
  { key: "tag-mgmt", label: "标签管理", icon: <TagsOutlined /> },
  { key: "industry-analysis", label: "产业分析", icon: <LineChartOutlined /> },
];

// 2. 首页侧边栏菜单配置
const siderItems: MenuProps["items"] = [
  { key: "overview", icon: <AppstoreOutlined />, label: "数据概览" },
  { key: "search", icon: <SearchOutlined />, label: "高级搜索" },
  { key: "notice", icon: <BellOutlined />, label: "公告栏" },
];

// 辅助映射：用于面包屑标题显示
const siderLabelMap: Record<string, string> = {
  overview: "数据概览",
  search: "搜索与高级检索",
  notice: "公告栏",
};

// 3. 数据概览 - 标签树 (模拟3级)
const tagTreeData: TreeDataNode[] = [
  {
    title: "产业链环节",
    key: "chain",
    children: [
      {
        title: "上游研发",
        key: "upstream",
        children: [
          { title: "基础研究", key: "basic-research" },
          { title: "原料供应", key: "raw-material" },
        ],
      },
      {
        title: "中游制造",
        key: "midstream",
        children: [
          { title: "设备生产", key: "equipment" },
          { title: "软件开发", key: "software" },
        ],
      },
    ],
  },
  {
    title: "企业规模",
    key: "scale",
    children: [
      { title: "大型领军", key: "large" },
      { title: "中小微", key: "sme" },
    ],
  },
];

// 4. 用户菜单
const userDropdownItems: MenuProps["items"] = [
  { key: "center", label: "个人中心", icon: <UserOutlined /> },
  { key: "settings", label: "系统设置", icon: <SettingOutlined /> },
  { type: "divider" },
  { key: "logout", label: "退出登录", icon: <LogoutOutlined />, danger: true },
];

const App: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG, colorPrimary },
  } = theme.useToken();

  // 状态管理
  const [activeSiderKey, setActiveSiderKey] = useState("overview"); // 默认显示数据概览
  const [collapsed, setCollapsed] = useState(false);

  // --- 视图渲染组件 ---

  // 视图1: 数据概览
  const renderOverview = () => (
    <div style={{ height: "100%" }}>
      <Title level={4} style={{ marginBottom: 24 }}>
        数据概览（当前这个概览之上预设有一个可视化大屏）
      </Title>
      <Row gutter={[16, 16]} style={{ height: "100%" }}>
        {/* 左侧：标签树 - 响应式处理：小屏幕占满一行，中大屏幕占1/4 */}
        <Col xs={24} md={8} lg={6}>
          <Card
            title="标签筛选 (1-3级)"
            bordered={false}
            style={{
              height: "100%",
              minHeight: 400,
              boxShadow: "0 1px 2px 0 rgba(0,0,0,0.03)",
            }}
          >
            <Tree
              showLine
              defaultExpandedKeys={["chain", "upstream"]}
              treeData={tagTreeData}
              onSelect={(keys) => console.log("选中标签:", keys)}
            />
          </Card>
        </Col>
        {/* 右侧：数据结果/统计 - 响应式处理：自适应剩余空间 */}
        <Col xs={24} md={16} lg={18}>
          <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
            <Col xs={24} sm={8}>
              <Card
                bordered={false}
                size="small"
                style={{ background: "#f6ffed" }}
              >
                <Statistic
                  title="当前标签下企业"
                  value={1128}
                  suffix="家"
                  valueStyle={{ color: "#3f8600" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card
                bordered={false}
                size="small"
                style={{ background: "#e6f7ff" }}
              >
                <Statistic
                  title="平均评分"
                  value={85.2}
                  precision={1}
                  valueStyle={{ color: "#1890ff" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card
                bordered={false}
                size="small"
                style={{ background: "#fff7e6" }}
              >
                <Statistic
                  title="本周新增"
                  value={12}
                  prefix="+"
                  valueStyle={{ color: "#fa8c16" }}
                />
              </Card>
            </Col>
          </Row>
          <Card
            title="关联主体列表"
            bordered={false}
            style={{ boxShadow: "0 1px 2px 0 rgba(0,0,0,0.03)" }}
          >
            <List
              itemLayout="horizontal"
              dataSource={[
                {
                  title: "北京数字医疗科技有限公司",
                  tag: "上游研发",
                  score: 92,
                },
                { title: "朝阳区智慧康养中心", tag: "下游服务", score: 88 },
                { title: "未来生命科学研究院", tag: "基础研究", score: 95 },
                { title: "博爱医疗器械股份公司", tag: "设备生产", score: 85 },
                { title: "云端健康大数据中心", tag: "软件开发", score: 89 },
              ]}
              renderItem={(item) => (
                <List.Item
                  actions={[<a key="detail">详情</a>, <a key="score">评分</a>]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        style={{
                          backgroundColor: colorPrimary,
                          verticalAlign: "middle",
                        }}
                        size="large"
                      >
                        {item.title[0]}
                      </Avatar>
                    }
                    title={<a href="#">{item.title}</a>}
                    description={
                      <Space wrap>
                        <Tag color="blue">{item.tag}</Tag>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          代码: 91110...
                        </Text>
                      </Space>
                    }
                  />
                  <div
                    style={{
                      textAlign: "center",
                      minWidth: 60,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      评分
                    </Text>
                    <span
                      style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        color: item.score > 90 ? "#52c41a" : "#1890ff",
                      }}
                    >
                      {item.score}
                    </span>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );

  // 视图2: 高级搜索
  const renderSearch = () => (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 0" }}>
      <div style={{ textAlign: "center", marginBottom: 40, marginTop: 20 }}>
        <Title level={2} style={{ fontSize: "min(30px, 6vw)" }}>
          企业主体全量检索
        </Title>
        <Text type="secondary">
          支持按名称、代码、标签、评分等多维度组合检索
        </Text>
      </div>

      <Card
        bordered={false}
        style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
      >
        <Input.Search
          placeholder="请输入企业名称、统一社会信用代码..."
          enterButton="搜索"
          size="large"
          style={{ marginBottom: 20 }}
        />

        <Divider orientation={"left" as const}>
          <Text type="secondary" style={{ fontSize: 13 }}>
            高级筛选
          </Text>
        </Divider>

        <Row gutter={[16, 24]}>
          <Col xs={24} md={8}>
            <Text strong>所属区域：</Text>
            <div style={{ marginTop: 8 }}>
              <Tag.CheckableTag checked>全部</Tag.CheckableTag>
              <Tag.CheckableTag checked={false}>朝阳区</Tag.CheckableTag>
              <Tag.CheckableTag checked={false}>朝阳区</Tag.CheckableTag>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );

  // 视图3: 公告栏
  const renderNotice = () => (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>
        系统公告与操作指引
      </Title>
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            key: "1",
            label: "系统公告",
            children: (
              <List
                itemLayout="horizontal"
                dataSource={[
                  "【维护】系统将于本周五晚 22:00 进行停机维护",
                  "【更新】新增“产业分析”大模型微调模块",
                  "【通知】朝阳区数字医疗数据已更新至 1 月份",
                ]}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <BellOutlined
                          style={{ color: "#faad14", fontSize: 18 }}
                        />
                      }
                      title={item}
                      description="2026-01-13 10:00"
                    />
                  </List.Item>
                )}
              />
            ),
          },
          {
            key: "2",
            label: "操作指引",
            children: (
              <List
                grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 4 }} // 响应式网格配置
                dataSource={[
                  {
                    title: "如何批量导入数据？",
                    desc: "支持Excel模板下载与校验",
                  },
                  {
                    title: "评分模型配置 V2.0",
                    desc: "详解权重调整对综合评分的影响",
                  },
                  { title: "标签管理手册", desc: "自动打标签与人工修正的流程" },
                  { title: "企业画像导出教程", desc: "导出PDF报告的详细步骤" },
                ]}
                renderItem={(item) => (
                  <List.Item>
                    <Card
                      title={
                        <>
                          <FileSearchOutlined /> {item.title}
                        </>
                      }
                      hoverable
                      size="small"
                    >
                      <div
                        style={{
                          height: 40,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {item.desc}
                      </div>
                      <div style={{ marginTop: 10, textAlign: "right" }}>
                        <Button type="link" size="small" style={{ padding: 0 }}>
                          查看详情
                        </Button>
                      </div>
                    </Card>
                  </List.Item>
                )}
              />
            ),
          },
        ]}
      />
    </div>
  );

  return (
    // 外层 Layout 占满屏幕高度
    <Layout style={{ minHeight: "100vh", width: "100%" }}>
      {/* 1. 顶部 Header (通栏) */}
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#001529",
          padding: "0 16px", // 缩小 padding 以适应小屏
          position: "sticky",
          top: 0,
          zIndex: 100,
          width: "100%",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
      >
        {/* 左侧 Logo */}
        <div style={{ display: "flex", alignItems: "center", minWidth: 160 }}>
          <div
            style={{
              width: 24,
              height: 24,
              background: "linear-gradient(135deg, #1890ff 0%, #0050b3 100%)",
              borderRadius: 6,
              marginRight: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            P
          </div>
          <span
            style={{
              color: "white",
              fontSize: "18px",
              fontWeight: 600,
              letterSpacing: "0.5px",
              whiteSpace: "nowrap",
            }}
          >
            区域产业链洞察平台
          </span>
        </div>

        {/* 中间 功能导航 (响应式隐藏 overflow) */}
        <div style={{ flex: 1, minWidth: 0, margin: "0 20px" }}>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["home"]}
            items={headerNavItems}
            style={{ borderBottom: "none", lineHeight: "64px" }}
            // 禁用溢出省略，通过 flex 布局压缩
            disabledOverflow={false}
          />
        </div>

        {/* 右侧 用户信息 */}
        <div style={{ flexShrink: 0 }}>
          <Dropdown
            menu={{ items: userDropdownItems }}
            placement="bottomRight"
            arrow
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                padding: "4px 8px",
                borderRadius: "6px",
                background: "rgba(255,255,255,0.05)",
                transition: "all 0.3s",
              }}
            >
              <Avatar
                style={{ backgroundColor: "#1890ff", verticalAlign: "middle" }}
                icon={<UserOutlined />}
                size="small"
              />
              {/* 在小屏幕隐藏用户名细节 */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginLeft: 8,
                  lineHeight: 1.2,
                }}
                className="hidden-xs"
              >
                <span style={{ color: "white", fontWeight: 500, fontSize: 13 }}>
                  管理员
                </span>
                <span
                  style={{ fontSize: "10px", color: "rgba(255,255,255,0.65)" }}
                >
                  <Tag
                    color="cyan"
                    style={{
                      margin: 0,
                      border: 0,
                      padding: "0 2px",
                      fontSize: 10,
                      height: 14,
                      lineHeight: "14px",
                    }}
                  >
                    数智医疗
                  </Tag>
                </span>
              </div>
              <DownOutlined
                style={{
                  color: "rgba(255,255,255,0.5)",
                  marginLeft: 8,
                  fontSize: 10,
                }}
              />
            </div>
          </Dropdown>
        </div>
      </Header>

      <Layout>
        {/* 2. 左侧边栏 (响应式：在小屏自动收缩) */}
        <Sider
          width={220}
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          breakpoint="lg" // 关键：在 lg 尺寸(992px)以下自动收起
          collapsedWidth="60" // 收起时宽度
          style={{
            background: colorBgContainer,
            borderRight: "1px solid #f0f0f0",
            zIndex: 99,
          }}
        >
          <Menu
            mode="inline"
            selectedKeys={[activeSiderKey]}
            onClick={(e) => setActiveSiderKey(e.key)}
            style={{ height: "100%", borderRight: 0, paddingTop: 10 }}
            items={siderItems}
          />
        </Sider>

        {/* 3. 主内容区域 */}
        <Layout style={{ padding: "0 16px 16px" }}>
          <Breadcrumb
            style={{ margin: "12px 0" }}
            items={[
              { title: "首页" },
              { title: siderLabelMap[activeSiderKey] || "未知" },
            ]}
          />

          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              overflowY: "auto", // 内容过长时滚动
            }}
          >
            {/* 动态渲染子页面内容 */}
            {activeSiderKey === "overview" && renderOverview()}
            {activeSiderKey === "search" && renderSearch()}
            {activeSiderKey === "notice" && renderNotice()}
          </Content>

          <Footer
            style={{
              textAlign: "center",
              color: "#999",
              fontSize: 12,
              padding: "12px 0",
            }}
          >
            区域产业链平台 ©2026 Created by Lanshan
          </Footer>
        </Layout>
      </Layout>

      {/* 补充样式：用于在极小屏幕隐藏元素 */}
      <style>{`
        @media (max-width: 576px) {
          .hidden-xs { display: none !important; }
        }
      `}</style>
    </Layout>
  );
};

export default App;
