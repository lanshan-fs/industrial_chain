import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Layout,
  Menu,
  Avatar,
  Dropdown,
  Breadcrumb,
  theme,
  Input,
  Space,
} from "antd";
import type { MenuProps } from "antd";
import {
  UserOutlined,
  ProjectOutlined,
  TagsOutlined,
  SettingOutlined,
  LogoutOutlined,
  PieChartOutlined,
  ReadOutlined,
  ThunderboltOutlined,
  TeamOutlined,
  DatabaseOutlined,
  SolutionOutlined,
  ProfileOutlined,
  ExperimentOutlined,
  ApartmentOutlined,
  SafetyCertificateOutlined,
  BuildOutlined,
  ControlOutlined,
} from "@ant-design/icons";

const { Header, Content, Sider } = Layout;
const { Search } = Input;

const TOP_NAV_ITEMS: MenuProps["items"] = [
  { key: "industry-class", label: "产业分类", icon: <ApartmentOutlined /> },
  {
    key: "industry-portrait",
    label: "产业画像",
    icon: <ProjectOutlined />,
    children: [
      {
        key: "industry-portrait/industry-profile",
        label: "行业画像",
        icon: <ProfileOutlined />,
      },
      {
        key: "industry-portrait/enterprise-profile",
        label: "企业画像",
        icon: <SolutionOutlined />,
      },
    ],
  },
  { key: "industry-score", label: "产业评分", icon: <PieChartOutlined /> },
  {
    key: "industry-diag",
    label: "产业诊断",
    icon: <ExperimentOutlined />,
    children: [
      {
        key: "industry-diag/smart-diag",
        label: "智能诊断",
        icon: <ThunderboltOutlined />,
      },
    ],
  },
];

// 优化：仅保留系统管理的侧边栏配置
const SIDER_CONFIG: Record<string, MenuProps["items"]> = {
  "system-mgmt": [
    {
      key: "data-mgmt",
      icon: <DatabaseOutlined />,
      label: "数据管理",
      children: [
        {
          key: "enterprise-data",
          label: "企业数据管理",
          icon: <BuildOutlined />,
        },
        {
          key: "tag-data",
          label: "标签数据管理",
          icon: <ControlOutlined />,
          children: [
            {
              key: "enterprise-tag",
              label: "企业标签管理",
              icon: <TagsOutlined />,
            },
            { key: "tag-library", label: "标签体系库", icon: <ReadOutlined /> },
            {
              key: "auto-tag",
              label: "自动打标签",
              icon: <ThunderboltOutlined />,
            },
          ],
        },
        {
          key: "weight-data",
          label: "评分权重管理",
          icon: <SafetyCertificateOutlined />,
        },
      ],
    },
    { key: "user-mgmt", icon: <TeamOutlined />, label: "用户管理" },
  ],
};

const BREADCRUMB_MAP: Record<string, string> = {
  home: "首页",
  "industry-class": "产业分类",
  "industry-portrait": "产业画像",
  "industry-profile": "行业画像",
  "enterprise-profile": "企业画像",
  "industry-score": "产业评分",
  "industry-diag": "产业诊断",
  "smart-diag": "智能诊断",
  "system-mgmt": "系统管理",
  "data-mgmt": "数据管理",
  "enterprise-data": "企业数据管理",
  "tag-data": "标签数据管理",
  "enterprise-tag": "企业标签管理",
  "tag-library": "标签体系库",
  "auto-tag": "自动打标签",
  "weight-data": "评分权重管理",
  "user-mgmt": "用户管理",
};

const MainLayout: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  // 解析路径
  const pathSnippets = location.pathname.split("/").filter((i) => i);
  const currentTopNav = pathSnippets[0] || "home";

  const isSystemMgmt = currentTopNav === "system-mgmt";

  // 优化：仅系统管理模块显示侧边栏
  const currentSiderItems = isSystemMgmt
    ? SIDER_CONFIG["system-mgmt"] || []
    : [];
  const hasSider = currentSiderItems.length > 0;

  const isHomePage = currentTopNav === "home";
  // 系统管理页面通常不是 SinglePage (因为它有 Sider)，其他页面大多变成了 SinglePage (无 Sider)
  const isSinglePage = !hasSider;

  // 优化：用户下拉菜单，包含系统管理入口
  const userDropdownItems: MenuProps["items"] = [
    { key: "center", label: "个人中心", icon: <UserOutlined /> },
    {
      key: "system-mgmt",
      label: "系统管理",
      icon: <SettingOutlined />,
      // 加个分割线或标记，使其显眼
    },
    { type: "divider" },
    {
      key: "logout",
      label: "退出登录",
      icon: <LogoutOutlined />,
      danger: true,
    },
  ];

  const breadcrumbItems = pathSnippets.map((snippet) => ({
    title: BREADCRUMB_MAP[snippet] || snippet,
  }));

  // 顶部导航点击
  const handleTopNavClick = (e: { key: string }) => {
    navigate(`/${e.key}`);
  };

  // 侧边栏点击（仅用于系统管理）：保持原有逻辑
  const handleSiderClick = (e: { key: string }) =>
    navigate(`/${currentTopNav}/${e.key}`);

  const handleUserMenuClick: MenuProps["onClick"] = (e) => {
    if (e.key === "logout") {
      navigate("/login");
    } else if (e.key === "system-mgmt") {
      navigate("/system-mgmt");
    }
  };

  // 计算顶部导航选中项：取路径去除了开头的 '/'
  const selectedTopNavKey = location.pathname.substring(1) || "home";

  return (
    <Layout style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      <Header
        style={{
          padding: 0,
          background: "#001529",
          position: "sticky",
          top: 0,
          zIndex: 100,
          width: "100%",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
      >
        <div
          className="header-content"
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            height: "100%",
            transition: "max-width 0.3s",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              marginRight: 48,
              flexShrink: 0,
            }}
            onClick={() => navigate("/home")}
          >
            <div
              style={{
                width: 32,
                height: 32,
                background: "linear-gradient(135deg, #1890ff 0%, #0050b3 100%)",
                borderRadius: 6,
                marginRight: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "bold",
                fontSize: 18,
              }}
            >
              P
            </div>
            <span
              style={{
                color: "white",
                fontSize: "18px",
                fontWeight: 600,
                letterSpacing: 1,
              }}
            >
              朝阳区产业链洞察平台
            </span>
          </div>

          {!isHomePage && (
            <div
              style={{
                flex: 1,
                maxWidth: 360,
                marginRight: 36,
                transition: "all 0.3s",
              }}
            >
              <Search
                placeholder="搜索企业、行业..."
                allowClear
                enterButton
                onSearch={() => {}}
                style={{ verticalAlign: "middle" }}
              />
            </div>
          )}

          <div
            style={{
              flex: 1,
              minWidth: 0,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            {/* 注意：系统管理页面时，TopNav 应该不选中任何主要项，或者您可以添加逻辑 */}
            <Menu
              theme="dark"
              mode="horizontal"
              selectedKeys={[selectedTopNavKey]}
              items={TOP_NAV_ITEMS}
              onClick={handleTopNavClick}
              style={{
                borderBottom: "none",
                lineHeight: "64px",
                background: "transparent",
                width: "100%",
                justifyContent: !isHomePage ? "flex-end" : "flex-start",
              }}
              disabledOverflow={false}
            />
          </div>

          <div style={{ flexShrink: 0, marginLeft: 24 }}>
            <Dropdown
              menu={{ items: userDropdownItems, onClick: handleUserMenuClick }}
              placement="bottomRight"
              arrow
            >
              <Space style={{ cursor: "pointer", color: "#fff" }}>
                <Avatar
                  style={{ backgroundColor: "#1890ff" }}
                  icon={<UserOutlined />}
                  size="default"
                />
                <span className="hidden-xs">管理员</span>
              </Space>
            </Dropdown>
          </div>
        </div>
      </Header>

      <div
        style={{
          width: "100%",
          maxWidth: isSystemMgmt ? "100%" : 1280,
          margin: "0 auto",
          padding: 0,
          display: "flex",
          flexDirection: "column",
          flex: 1,
          transition: "max-width 0.3s",
        }}
      >
        <Layout style={{ background: "transparent" }}>
          {hasSider && (
            <Sider
              width={220}
              collapsible
              collapsed={collapsed}
              onCollapse={setCollapsed}
              breakpoint="lg"
              collapsedWidth="60"
              style={{
                background: colorBgContainer,
                margin: "24px 0 24px 24px",
                borderRadius: borderRadiusLG,
                overflow: "hidden",
                boxShadow: "0 1px 2px 0 rgba(0,0,0,0.05)",
              }}
            >
              {/* 这里的 selectedKeys 需要匹配 Sider 中的 key */}
              <Menu
                mode="inline"
                selectedKeys={[pathSnippets[pathSnippets.length - 1]]}
                defaultOpenKeys={["data-mgmt", "tag-data"]}
                items={currentSiderItems}
                onClick={handleSiderClick}
                style={{ height: "100%", borderRight: 0, paddingTop: 10 }}
              />
            </Sider>
          )}

          <Layout style={{ background: "transparent" }}>
            {!isSinglePage && (
              <div style={{ padding: "24px 24px 0 24px" }}>
                <Breadcrumb items={breadcrumbItems} />
              </div>
            )}

            <Content
              style={{
                padding: isSinglePage ? 0 : 24,
                margin: 0,
                minHeight: 280,
                background: "transparent",
              }}
            >
              <div
                style={{
                  background: isSinglePage ? "transparent" : colorBgContainer,
                  padding: isSinglePage ? 0 : 24,
                  borderRadius: isSinglePage ? 0 : borderRadiusLG,
                  minHeight: "100%",
                }}
              >
                <Outlet />
              </div>
            </Content>
          </Layout>
        </Layout>
      </div>

      <style>{`
        @media (max-width: 576px) { .hidden-xs { display: none !important; } }
        .ant-layout-sider-trigger { border-radius: 0 0 8px 8px; }
      `}</style>
    </Layout>
  );
};

export default MainLayout;
