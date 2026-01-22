import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Layout, Menu, Avatar, Dropdown, Breadcrumb, theme, Tag } from "antd";
import type { MenuProps } from "antd";
import {
  UserOutlined,
  DashboardOutlined,
  AppstoreOutlined,
  BarChartOutlined,
  ProjectOutlined,
  TagsOutlined,
  LineChartOutlined,
  SearchOutlined,
  BellOutlined,
  SettingOutlined,
  LogoutOutlined,
  DownOutlined,
  ThunderboltOutlined,
  ReadOutlined,
  TagOutlined,
  PieChartOutlined,
  RobotOutlined,
  HistoryOutlined,
} from "@ant-design/icons";

const { Header, Content, Footer, Sider } = Layout;

// --- 导航配置 ---
const TOP_NAV_ITEMS: MenuProps["items"] = [
  { key: "home", label: "首页", icon: <DashboardOutlined /> },
  { key: "data-mgmt", label: "数据管理", icon: <AppstoreOutlined /> },
  { key: "score-mgmt", label: "评分管理", icon: <BarChartOutlined /> },
  { key: "graph-portrait", label: "图谱画像", icon: <ProjectOutlined /> },
  { key: "tag-mgmt", label: "标签管理", icon: <TagsOutlined /> },
  { key: "industry-analysis", label: "产业分析", icon: <LineChartOutlined /> },
];

const SIDER_CONFIG: Record<string, MenuProps["items"]> = {
  home: [
    { key: "overview", icon: <AppstoreOutlined />, label: "数据概览" },
    { key: "search", icon: <SearchOutlined />, label: "高级搜索" },
    { key: "notice", icon: <BellOutlined />, label: "公告栏" },
  ],
  "data-mgmt": [
    {
      key: "enterprise-data",
      icon: <ProjectOutlined />,
      label: "企业基础数据",
    },
    {
      key: "industry-data",
      icon: <LineChartOutlined />,
      label: "行业统计数据",
    },
    { key: "weight-data", icon: <SettingOutlined />, label: "评分维度权重" },
    { key: "tag-data", icon: <TagsOutlined />, label: "标签基础数据" },
  ],
  "score-mgmt": [
    { key: "industry-score", icon: <PieChartOutlined />, label: "产业评分" },
    { key: "enterprise-score", icon: <BarChartOutlined />, label: "企业评分" },
  ],
  "tag-mgmt": [
    { key: "auto-tag", icon: <ThunderboltOutlined />, label: "自动打标签" },
    { key: "enterprise-tag", icon: <TagOutlined />, label: "企业标签管理" },
    { key: "tag-library", icon: <ReadOutlined />, label: "标签体系库" },
  ],
  "industry-analysis": [
    { key: "rici-v1", icon: <RobotOutlined />, label: "RICI V1" },
    { key: "history", icon: <HistoryOutlined />, label: "历史记录" },
  ],
};

const BREADCRUMB_MAP: Record<string, string> = {
  home: "首页",
  "data-mgmt": "数据管理",
  "enterprise-data": "企业基础数据",
  "industry-data": "行业统计数据",
  "weight-data": "评分维度权重",
  "tag-data": "标签基础数据",
  "score-mgmt": "评分管理",
  "industry-score": "产业评分",
  "enterprise-score": "企业评分",
  "tag-mgmt": "标签管理",
  "auto-tag": "自动打标签",
  "enterprise-tag": "企业标签管理",
  "tag-library": "标签体系库",
  "industry-analysis": "产业分析",
  "rici-v1": "RICI V1 助手",
  history: "历史记录",
};

const userDropdownItems: MenuProps["items"] = [
  { key: "center", label: "个人中心", icon: <UserOutlined /> },
  { key: "settings", label: "系统设置", icon: <SettingOutlined /> },
  { type: "divider" },
  { key: "logout", label: "退出登录", icon: <LogoutOutlined />, danger: true },
];

const MainLayout: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const pathSnippets = location.pathname.split("/").filter((i) => i);
  const currentTopNav = pathSnippets[0] || "home";
  const currentSiderKey = pathSnippets[1] || "";
  const isHomePage = currentTopNav === "home"; // 判断是否为首页

  const handleTopNavClick = (e: { key: string }) => {
    const key = e.key;
    const subItems = SIDER_CONFIG[key];
    if (subItems && subItems.length > 0 && subItems[0]) {
      navigate(`/${key}/${subItems[0].key}`);
    } else {
      navigate(`/${key}`);
    }
  };

  const handleSiderClick = (e: { key: string }) => {
    navigate(`/${currentTopNav}/${e.key}`);
  };

  const handleUserMenuClick: MenuProps["onClick"] = (e) => {
    if (e.key === "logout") navigate("/login");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#001529",
          padding: "0 16px",
          position: "sticky",
          top: 0,
          zIndex: 100,
          width: "100%",
        }}
      >
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
            }}
          >
            P
          </div>
          <span style={{ color: "white", fontSize: "18px", fontWeight: 600 }}>
            朝阳区产业链洞察平台
          </span>
        </div>
        <div style={{ flex: 1, margin: "0 20px" }}>
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[currentTopNav]}
            items={TOP_NAV_ITEMS}
            onClick={handleTopNavClick}
            style={{ borderBottom: "none", lineHeight: "64px" }}
            disabledOverflow={false}
          />
        </div>
        <div style={{ flexShrink: 0 }}>
          <Dropdown
            menu={{ items: userDropdownItems, onClick: handleUserMenuClick }}
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
                    数字医疗
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
        {!isHomePage && (
          <Sider
            width={220}
            collapsible
            collapsed={collapsed}
            onCollapse={setCollapsed}
            breakpoint="lg"
            collapsedWidth="60"
            style={{ background: colorBgContainer }}
          >
            <Menu
              mode="inline"
              selectedKeys={[currentSiderKey]}
              items={SIDER_CONFIG[currentTopNav] || []}
              onClick={handleSiderClick}
              style={{ height: "100%", borderRight: 0, paddingTop: 10 }}
            />
          </Sider>
        )}

        <Layout style={{ padding: isHomePage ? "0" : "0 16px 16px" }}>
          {!isHomePage && (
            <Breadcrumb
              style={{ margin: "12px 0" }}
              items={[
                { title: BREADCRUMB_MAP[currentTopNav] || currentTopNav },
                { title: BREADCRUMB_MAP[currentSiderKey] || currentSiderKey },
              ]}
            />
          )}

          <Content
            style={{
              padding: isHomePage ? 0 : 24,
              margin: 0,
              minHeight: 280,
              background: isHomePage ? "transparent" : colorBgContainer,
              borderRadius: isHomePage ? 0 : borderRadiusLG,
              overflowY: "auto",
            }}
          >
            <Outlet />
          </Content>

          <Footer
            style={{
              textAlign: "center",
              background: isHomePage ? "#000c17" : undefined,
              color: isHomePage ? "rgba(255,255,255,0.45)" : "#999",
              padding: "12px 0",
              fontSize: 12,
              borderTop: isHomePage
                ? "1px solid rgba(255,255,255,0.05)"
                : "none",
            }}
          >
            区域产业链洞察平台 ©2026 Powered by
          </Footer>
        </Layout>
      </Layout>
      <style>{`@media (max-width: 576px) { .hidden-xs { display: none !important; } }`}</style>
    </Layout>
  );
};

export default MainLayout;
