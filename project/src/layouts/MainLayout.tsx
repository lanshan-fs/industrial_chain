import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Layout, Menu, Avatar, Dropdown, Breadcrumb, theme } from "antd";
import type { MenuProps } from "antd";
import {
  UserOutlined,
  DashboardOutlined,
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
} from "@ant-design/icons";

const { Header, Content, Footer, Sider } = Layout;

const TOP_NAV_ITEMS: MenuProps["items"] = [
  { key: "home", label: "首页", icon: <DashboardOutlined /> },
  { key: "industry-class", label: "产业分类", icon: <ApartmentOutlined /> }, // 新增
  { key: "industry-portrait", label: "产业画像", icon: <ProjectOutlined /> }, // 原图谱画像
  { key: "industry-score", label: "产业评分", icon: <PieChartOutlined /> }, // 独立模块
  { key: "industry-diag", label: "产业诊断", icon: <ExperimentOutlined /> }, // 原产业分析
  { key: "system-mgmt", label: "系统管理", icon: <SettingOutlined /> }, // 聚合管理功能
];

// 注意：对于没有侧边栏的模块（如首页、产业分类），配置为空数组
const SIDER_CONFIG: Record<string, MenuProps["items"]> = {
  // 1. 首页：左侧不设置子页面导航栏
  home: [],

  // 2. 产业分类：在单一页面呈现，没有子页面
  "industry-class": [],

  // 3. 产业画像：两个子页面：行业画像、企业画像
  "industry-portrait": [
    { key: "industry-profile", icon: <ProfileOutlined />, label: "行业画像" },
    {
      key: "enterprise-profile",
      icon: <SolutionOutlined />,
      label: "企业画像",
    },
  ],

  // 4. 产业评分：在单一页面呈现，没有子页面
  "industry-score": [],

  // 5. 产业诊断：暂时只有一个子页面：智能诊断
  "industry-diag": [
    { key: "smart-diag", icon: <ThunderboltOutlined />, label: "智能诊断" },
  ],

  // 6. 系统管理：数据管理、用户管理
  "system-mgmt": [
    {
      key: "data-mgmt",
      icon: <DatabaseOutlined />,
      label: "数据管理",
      children: [
        { key: "enterprise-data", label: "企业数据管理" },
        { key: "industry-data", label: "行业数据管理" },
        // 标签数据管理下有三个子页面
        {
          key: "tag-data",
          label: "标签数据管理",
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

// --- 3. 面包屑映射 ---
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
  "industry-data": "行业数据管理",
  "tag-data": "标签数据管理",
  "enterprise-tag": "企业标签管理",
  "tag-library": "标签体系库",
  "auto-tag": "自动打标签",
  "weight-data": "评分权重管理",
  "user-mgmt": "用户管理",
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

  // 解析当前路径
  // 假设路径格式为 /:topNav/:siderKey1/:siderKey2...
  const pathSnippets = location.pathname.split("/").filter((i) => i);
  const currentTopNav = pathSnippets[0] || "home";

  // 递归查找当前选中的 Sider Key (用于高亮)
  // 简单处理：取路径的最后一个片段作为选中的 key，或者倒数第二个
  // 实际项目中可能需要更复杂的匹配逻辑，这里取路径最后一段匹配 Sider 配置
  const currentSiderKey = pathSnippets[pathSnippets.length - 1];

  // 判断当前模块是否有侧边栏配置
  const currentSiderItems = SIDER_CONFIG[currentTopNav] || [];
  const hasSider = currentSiderItems.length > 0;

  // 首页和其他单页模式处理 (Home, Industry Class, Score)
  const isSinglePage = !hasSider;

  const handleTopNavClick = (e: { key: string }) => {
    const key = e.key;
    // const subItems = SIDER_CONFIG[key];

    // 路由跳转逻辑：
    // 1. 如果有子菜单，且配置了 children，尝试跳转到第一个叶子节点（可选优化）
    // 2. 这里简单处理：如果有子菜单，跳转到该模块根路径，由 App.tsx 重定向到默认子页
    // 3. 如果没有子菜单（单页），直接跳转
    navigate(`/${key}`);
  };

  const handleSiderClick = (e: { key: string; keyPath: string[] }) => {
    // 修正：使用基于当前 TopNav 的绝对路径跳转，支持同级页面切换
    // 例如：从 /system-mgmt/enterprise-data 切换到 /system-mgmt/tag-library
    navigate(`/${currentTopNav}/${e.key}`);
  };

  const handleUserMenuClick: MenuProps["onClick"] = (e) => {
    if (e.key === "logout") navigate("/login");
  };

  // 生成面包屑 Items
  const breadcrumbItems = pathSnippets.map((snippet) => ({
    title: BREADCRUMB_MAP[snippet] || snippet,
  }));

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
        <div style={{ display: "flex", alignItems: "center", minWidth: 200 }}>
          {/* <div
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
          </div> */}
          <span style={{ color: "white", fontSize: "20px", fontWeight: 600 }}>
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
              {/* 此处省略了部分用户信息的展示代码，保持原有即可 */}
              <div
                className="hidden-xs"
                style={{ marginLeft: 8, color: "white" }}
              >
                管理员
              </div>
            </div>
          </Dropdown>
        </div>
      </Header>

      <Layout>
        {hasSider && (
          <Sider
            width={240} // 稍微加宽以容纳多级菜单
            collapsible
            collapsed={collapsed}
            onCollapse={setCollapsed}
            breakpoint="lg"
            collapsedWidth="60"
            style={{ background: colorBgContainer }}
          >
            <Menu
              mode="inline"
              // selectedKeys 需要匹配当前路由的末端 key
              selectedKeys={[currentSiderKey]}
              // defaultOpenKeys 可以默认展开数据管理等
              defaultOpenKeys={["data-mgmt", "tag-data"]}
              items={SIDER_CONFIG[currentTopNav] || []}
              onClick={handleSiderClick}
              style={{ height: "100%", borderRight: 0, paddingTop: 10 }}
            />
          </Sider>
        )}

        <Layout style={{ padding: isSinglePage ? "0" : "0 16px 16px" }}>
          {!isSinglePage && (
            <Breadcrumb style={{ margin: "12px 0" }} items={breadcrumbItems} />
          )}

          <Content
            style={{
              padding: isSinglePage ? 0 : 24,
              margin: 0,
              minHeight: 280,
              background: isSinglePage ? "transparent" : colorBgContainer,
              borderRadius: isSinglePage ? 0 : borderRadiusLG,
              overflowY: "auto",
            }}
          >
            <Outlet />
          </Content>

          <Footer
            style={{
              textAlign: "center",
              background: isSinglePage ? "#000c17" : undefined,
              color: isSinglePage ? "rgba(255,255,255,0.45)" : "#999",
              padding: "12px 0",
              fontSize: 12,
              borderTop: isSinglePage
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
