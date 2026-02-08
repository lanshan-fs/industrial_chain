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
  ConfigProvider,
} from "antd";
import type { MenuProps } from "antd";
import {
  UserOutlined,
  TagsOutlined,
  SettingOutlined,
  LogoutOutlined,
  PieChartOutlined,
  ReadOutlined,
  ThunderboltOutlined,
  TeamOutlined,
  DatabaseOutlined,
  ProfileOutlined,
  ApartmentOutlined,
  SafetyCertificateOutlined,
  BuildOutlined,
  ControlOutlined,
} from "@ant-design/icons";

const { Header, Content, Sider } = Layout;
const { Search } = Input;

// 定义导航数据结构
const TOP_NAV_ITEMS = [
  {
    key: "industry-class",
    label: "产业分类",
    icon: <ApartmentOutlined />,
  },
  {
    key: "industry-portrait",
    label: "行业画像",
    icon: <ProfileOutlined />,
  },
  {
    key: "industry-score",
    label: "产业评分",
    icon: <PieChartOutlined />,
  },
  {
    key: "industry-diag",
    label: "智能诊断",
    icon: <ThunderboltOutlined />,
  },
];

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
  // "industry-portrait": "画像",
  "industry-profile": "行业画像",
  "enterprise-profile": "企业画像",
  "industry-score": "产业评分",
  // "industry-diag": "诊断",
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

  const isEnterpriseProfile = location.pathname.includes("enterprise-profile");
  const activeNavKey = isEnterpriseProfile ? "" : currentTopNav;

  const isSystemMgmt = currentTopNav === "system-mgmt";
  const isIndustryDiag = currentTopNav === "industry-diag";

  const isFullWidthPage = isSystemMgmt || isIndustryDiag;
  const isAppMode = isIndustryDiag;

  const currentSiderItems = isSystemMgmt
    ? SIDER_CONFIG["system-mgmt"] || []
    : [];
  const hasSider = currentSiderItems.length > 0;

  const isHomePage = currentTopNav === "home";
  const isSinglePage = !hasSider;

  const userDropdownItems: MenuProps["items"] = [
    { key: "center", label: "个人中心", icon: <UserOutlined /> },
    { key: "system-mgmt", label: "系统管理", icon: <SettingOutlined /> },
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

  const handleTopNavClick = (e: { key: string }) => navigate(`/${e.key}`);
  const handleSiderClick = (e: { key: string }) =>
    navigate(`/${currentTopNav}/${e.key}`);

  const handleUserMenuClick: MenuProps["onClick"] = (e) => {
    if (e.key === "logout") navigate("/login");
    else if (e.key === "system-mgmt") navigate("/system-mgmt");
  };

  const renderNavItems = () => {
    return TOP_NAV_ITEMS.map((item) => {
      const isActive = activeNavKey === item.key;
      const hasChildren =
        (item as any).children && (item as any).children.length > 0;

      const trigger = (
        <div
          className={`nav-action-trigger ${isActive ? "active" : ""}`}
          onClick={() => {
            if (!hasChildren) {
              handleTopNavClick({ key: item.key });
            }
          }}
        >
          <span style={{ fontSize: "16px", marginRight: 8 }}>{item.icon}</span>
          {/* 优化点：移除 fontWeight: 500，使用默认字重更清爽 */}
          <span style={{ fontSize: "16px" }}>{item.label}</span>
          {isActive && (
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 3,
                background: "#00e5ff",
                borderRadius: "3px 3px 0 0",
                boxShadow: "0 0 8px rgba(0, 229, 255, 0.6)",
              }}
            />
          )}
        </div>
      );

      if (hasChildren) {
        return (
          <Dropdown
            key={item.key}
            menu={{
              items: (item as any).children,
              onClick: handleTopNavClick,
            }}
            placement="bottom"
            arrow
          >
            {trigger}
          </Dropdown>
        );
      }

      return (
        <div key={item.key} style={{ position: "relative", height: "100%" }}>
          {trigger}
        </div>
      );
    });
  };

  return (
    <Layout
      style={{
        height: isAppMode ? "100vh" : "auto",
        minHeight: "100vh",
        overflow: isAppMode ? "hidden" : "visible",
        background: "#f0f2f5",
      }}
    >
      <Header
        style={{
          padding: 0,
          background: "linear-gradient(90deg, #001529 0%, #003a8c 100%)",
          position: "sticky",
          top: 0,
          zIndex: 100,
          width: "100%",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
          height: 56,
          lineHeight: "56px",
          flex: "0 0 auto",
          borderBottom: "none",
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
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              marginRight: 48,
              flexShrink: 0,
              height: "100%",
            }}
            onClick={() => navigate("/home")}
          >
            <div
              style={{
                width: 30,
                height: 30,
                background: "rgba(255, 255, 255, 0.15)",
                borderRadius: 6,
                marginRight: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: "bold",
                fontSize: 16,
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              P
            </div>
            {/* 优化点：字重从 600 降为 500，视觉更协调 */}
            <span
              style={{
                color: "#fff",
                fontSize: "18px",
                fontWeight: 500,
                letterSpacing: "0.5px",
              }}
            >
              朝阳区产业链洞察平台
            </span>
          </div>

          {!isHomePage && (
            <div style={{ flex: 1, maxWidth: 320, transition: "all 0.3s" }}>
              <ConfigProvider
                theme={{
                  components: {
                    Input: {
                      colorBgContainer: "rgba(255, 255, 255, 0.1)",
                      colorBorder: "transparent",
                      colorTextPlaceholder: "rgba(255, 255, 255, 0.5)",
                      colorText: "#fff",
                    },
                    Button: {
                      colorBgContainer: "rgba(255, 255, 255, 0.2)",
                      colorText: "#fff",
                      colorPrimaryHover: "rgba(255, 255, 255, 0.3)",
                      // 修复点：使用 lineWidth: 0 替代 border: 'none' 来消除边框
                      lineWidth: 0,
                    },
                  },
                }}
              >
                <Search
                  placeholder="搜索企业、行业..."
                  allowClear
                  onSearch={(value) => console.log("Global search:", value)}
                  style={{ verticalAlign: "middle" }}
                  size="middle"
                  variant="borderless"
                />
              </ConfigProvider>
            </div>
          )}

          <div
            style={{
              flex: 1,
              minWidth: 0,
              display: "flex",
              justifyContent: "flex-end",
              marginRight: 24,
              height: "100%",
            }}
          >
            {renderNavItems()}
          </div>

          <div
            style={{
              flexShrink: 0,
              height: "100%",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Dropdown
              menu={{ items: userDropdownItems, onClick: handleUserMenuClick }}
              placement="bottomRight"
              arrow
            >
              <div
                className="nav-action-trigger"
                style={{ color: "rgba(255,255,255,0.85)" }}
              >
                <Space>
                  <Avatar
                    style={{ backgroundColor: "#1890ff", color: "#fff" }}
                    icon={<UserOutlined />}
                    size="small"
                  />
                  <span className="hidden-xs" style={{ fontSize: 14 }}>
                    管理员
                  </span>
                </Space>
              </div>
            </Dropdown>
          </div>
        </div>
      </Header>

      <div
        style={{
          width: "100%",
          maxWidth: isFullWidthPage ? "100%" : 1280,
          margin: "0 auto",
          padding: 0,
          display: "flex",
          flexDirection: "column",
          flex: 1,
          transition: "max-width 0.3s",
          height: isAppMode ? "100%" : "auto",
          overflow: isAppMode ? "hidden" : "visible",
        }}
      >
        <Layout style={{ background: "transparent", height: "100%" }}>
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

          <Layout style={{ background: "transparent", height: "100%" }}>
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
                height: isAppMode ? "100%" : "auto",
                overflow: isAppMode ? "hidden" : "initial",
              }}
            >
              <div
                style={{
                  background: isSinglePage ? "transparent" : colorBgContainer,
                  padding: isSinglePage ? 0 : 24,
                  borderRadius: isSinglePage ? 0 : borderRadiusLG,
                  height: isAppMode ? "100%" : "auto",
                  minHeight: isAppMode ? 0 : "100%",
                  display: "flex",
                  flexDirection: "column",
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
        
        .nav-action-trigger {
          height: 56px; 
          display: flex;
          align-items: center;
          padding: 0 16px;
          cursor: pointer;
          transition: all 0.3s;
          color: rgba(255, 255, 255, 0.65);
          position: relative;
        }
        
        .nav-action-trigger:hover {
          color: #fff;
          background-color: rgba(255, 255, 255, 0.1);
        }
        
        /* 优化点：选中态只保留文字微发光，去掉加粗，保持轻快感 */
        .nav-action-trigger.active {
          color: #fff;
          background-color: transparent;
          text-shadow: 0 0 10px rgba(0, 229, 255, 0.3);
        }
      `}</style>
    </Layout>
  );
};

export default MainLayout;
