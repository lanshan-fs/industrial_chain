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

// 定义导航数据结构
const TOP_NAV_ITEMS = [
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

// 系统管理的侧边栏配置
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
  const isIndustryDiag = currentTopNav === "industry-diag";

  // 定义哪些页面需要全宽
  const isFullWidthPage = isSystemMgmt || isIndustryDiag;

  // 定义哪些页面是 App 模式 (无全局滚动条，高度固定为 100vh)
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
      const isActive = currentTopNav === item.key;
      const hasChildren = item.children && item.children.length > 0;

      // 导航项触发区域的渲染内容
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
          <span style={{ fontSize: "16px", fontWeight: 500 }}>
            {item.label}
          </span>
        </div>
      );

      // 如果有子菜单，使用 Dropdown 包裹
      if (hasChildren) {
        return (
          <Dropdown
            key={item.key}
            menu={{
              items: item.children,
              onClick: handleTopNavClick,
            }}
            placement="bottom"
            arrow
          >
            {trigger}
          </Dropdown>
        );
      }

      return <div key={item.key}>{trigger}</div>;
    });
  };

  return (
    <Layout
      style={{
        // 关键修复：App模式下强制锁定视口高度，禁止 body 滚动
        height: isAppMode ? "100vh" : "auto",
        minHeight: "100vh",
        overflow: isAppMode ? "hidden" : "visible",
        background: "#f0f2f5",
      }}
    >
      <Header
        style={{
          padding: 0,
          background: "#001529",
          position: "sticky",
          top: 0,
          zIndex: 100,
          width: "100%",
          boxShadow: "none",
          height: 64,
          flex: "0 0 auto", // 防止 Header 被压缩
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
                borderRadius: 4,
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
            <span style={{ color: "white", fontSize: "18px", fontWeight: 500 }}>
              朝阳区产业链洞察平台
            </span>
          </div>

          {!isHomePage && (
            <div style={{ flex: 1, maxWidth: 320, transition: "all 0.3s" }}>
              <ConfigProvider
                theme={{
                  components: {
                    Input: { borderRadius: 0 },
                    Button: { borderRadius: 0 },
                  },
                }}
              >
                <Search
                  placeholder="搜索企业、行业..."
                  allowClear
                  enterButton="搜索"
                  onSearch={(value) => console.log("Global search:", value)}
                  style={{ verticalAlign: "middle" }}
                  size="middle"
                />
              </ConfigProvider>
            </div>
          )}

          {/* 顶部导航区域 */}
          <div
            style={{
              flex: 1,
              minWidth: 0,
              display: "flex",
              justifyContent: "flex-end",
              marginRight: 12,
              height: "100%",
            }}
          >
            {renderNavItems()}
          </div>

          <div style={{ flexShrink: 0 }}>
            <Dropdown
              menu={{ items: userDropdownItems, onClick: handleUserMenuClick }}
              placement="bottomRight"
              arrow
            >
              <div className="nav-action-trigger">
                <Space style={{ color: "#fff" }}>
                  <Avatar
                    style={{ backgroundColor: "#1890ff" }}
                    icon={<UserOutlined />}
                    size="default"
                  />
                  <span className="hidden-xs">管理员</span>
                </Space>
              </div>
            </Dropdown>
          </div>
        </div>
      </Header>

      {/* 主内容 Wrapper */}
      <div
        style={{
          width: "100%",
          maxWidth: isFullWidthPage ? "100%" : 1280,
          margin: "0 auto",
          padding: 0,
          display: "flex",
          flexDirection: "column",
          // 关键修复：使用 flex: 1 占据剩余空间，而不是 calc
          flex: 1,
          transition: "max-width 0.3s",
          // 确保 Wrapper 自身也是 100% 高度 (相对于父级 Flex 容器)
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
                // 确保 Content 撑满且不处理滚动（交给子组件）
                height: isAppMode ? "100%" : "auto",
                overflow: isAppMode ? "hidden" : "initial",
              }}
            >
              <div
                style={{
                  background: isSinglePage ? "transparent" : colorBgContainer,
                  padding: isSinglePage ? 0 : 24,
                  borderRadius: isSinglePage ? 0 : borderRadiusLG,
                  // 强制撑满高度，建立 Flex 上下文供 Outlet 使用
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
        
        /* 统一导航和用户下拉菜单的触发样式 */
        .nav-action-trigger {
          height: 64px;
          display: flex;
          align-items: center;
          padding: 0 16px;
          cursor: pointer;
          transition: all 0.3s;
          color: rgba(255, 255, 255, 0.65);
          // font-size: 16px;
        }
        .nav-action-trigger:hover {
          color: #fff;
          background-color: rgba(255, 255, 255, 0.1);
        }
        /* 选中状态 */
        .nav-action-trigger.active {
          color: #fff;
          background-color: #1890ff;
        }
      `}</style>
    </Layout>
  );
};

export default MainLayout;
