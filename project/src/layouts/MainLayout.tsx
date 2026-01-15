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
} from "@ant-design/icons";

const { Header, Content, Footer, Sider } = Layout;

// --- 导航配置 ---
// 1. 顶部一级导航
const TOP_NAV_ITEMS: MenuProps["items"] = [
  { key: "home", label: "首页", icon: <DashboardOutlined /> },
  { key: "data-mgmt", label: "数据管理", icon: <AppstoreOutlined /> },
  { key: "score-mgmt", label: "评分管理", icon: <BarChartOutlined /> },
  { key: "graph-portrait", label: "图谱画像", icon: <ProjectOutlined /> },
  { key: "tag-mgmt", label: "标签管理", icon: <TagsOutlined /> },
  { key: "industry-analysis", label: "产业分析", icon: <LineChartOutlined /> },
];

// 2. 侧边栏二级导航配置 (一级Key -> 二级菜单Items)
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
};

// 3. 面包屑映射
const BREADCRUMB_MAP: Record<string, string> = {
  home: "首页",
  "data-mgmt": "数据管理",
  "score-mgmt": "评分管理",
  overview: "数据概览",
  search: "高级搜索",
  notice: "公告栏",
  "enterprise-data": "企业基础数据",
  "industry-data": "行业统计数据",
  "weight-data": "评分维度权重",
  "tag-data": "标签基础数据",
  "industry-score": "产业评分",
  "enterprise-score": "企业评分",
  "auto-tag": "自动打标签",
  "enterprise-tag": "企业标签管理",
  "tag-library": "标签体系库",
};

// 4. 用户下拉菜单配置
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

  // 解析当前路由路径
  // 假设路径格式为: /一级/二级 (例如 /data-mgmt/enterprise-data)
  const pathSnippets = location.pathname.split("/").filter((i) => i);
  const currentTopNav = pathSnippets[0] || "home";
  const currentSiderKey = pathSnippets[1] || "";

  // 处理顶部导航点击
  const handleTopNavClick = (e: { key: string }) => {
    const key = e.key;
    // 查找该模块下的第一个子菜单，默认跳转过去
    const subItems = SIDER_CONFIG[key];
    if (subItems && subItems.length > 0 && subItems[0]) {
      navigate(`/${key}/${subItems[0].key}`);
    } else {
      navigate(`/${key}`);
    }
  };

  // 处理侧边栏点击
  const handleSiderClick = (e: { key: string }) => {
    navigate(`/${currentTopNav}/${e.key}`);
  };

  const handleUserMenuClick: MenuProps["onClick"] = (e) => {
    if (e.key === "logout") {
      // TODO: 如果有存储 token（如 localStorage），建议在此处清除
      // localStorage.removeItem('token');

      // 跳转至登录页
      navigate("/login");
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Header */}
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
            区域产业链洞察
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
        {/* 右侧 用户信息 (恢复原有设计) */}
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
              {/* 信息区：在小屏幕(hidden-xs)隐藏，只留头像 */}
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
        {/* Sider: 动态显示 */}
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

        {/* Main Content */}
        <Layout style={{ padding: "0 16px 16px" }}>
          <Breadcrumb
            style={{ margin: "12px 0" }}
            items={[
              { title: BREADCRUMB_MAP[currentTopNav] || currentTopNav },
              { title: BREADCRUMB_MAP[currentSiderKey] || currentSiderKey },
            ]}
          />

          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              overflowY: "auto",
            }}
          >
            <Outlet />
          </Content>
          <Footer style={{ textAlign: "center", color: "#999", fontSize: 12 }}>
            区域产业链平台 ©2026
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

export default MainLayout;
