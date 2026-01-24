import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Typography } from "antd";
import { AppstoreOutlined } from "@ant-design/icons";

import MainLayout from "./layouts/MainLayout";

import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ForgotPassword from "./pages/Auth/ForgotPassword";

import Overview from "./pages/Home/Overview";

import IndustryClass from "./pages/IndustryClass/IndustryClass";

import IndustryScore from "./pages/IndustryScore/Index";
import SmartDiag from "./pages/IndustryDiag/SmartDiag";

import EnterpriseData from "./pages/SystemMgmt/Data/EnterpriseData";

import AutoTag from "./pages/SystemMgmt/Data/Tag/AutoTag";
import EnterpriseTag from "./pages/SystemMgmt/Data/Tag/EnterpriseTag";
import TagLibrary from "./pages/SystemMgmt/Data/Tag/TagLibrary";

// --- 占位组件 ---
const { Title, Text } = Typography;
const PlaceholderPage: React.FC<{ title: string; desc: string }> = ({
  title,
  desc,
}) => (
  <div style={{ textAlign: "center", padding: "100px 0", color: "#999" }}>
    <AppstoreOutlined
      style={{ fontSize: 48, marginBottom: 16, opacity: 0.5 }}
    />
    <Title level={4} style={{ color: "#666", marginBottom: 8 }}>
      {title}
    </Title>
    <Text type="secondary">{desc}</Text>
    <div style={{ marginTop: 20 }}>
      <Text type="secondary" style={{ fontSize: 12 }}>
        此模块正在规划开发中 (V1.2)
      </Text>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- 公开路由 --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* --- 根路径重定向 --- */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* --- 主布局 --- */}
        <Route element={<MainLayout />}>
          {/* 1. 首页 */}
          <Route path="home" element={<Overview />} />

          {/* 2. 产业分类 */}
          <Route path="industry-class" element={<IndustryClass />} />

          {/* 3. 产业画像 */}
          <Route path="industry-portrait">
            <Route index element={<Navigate to="industry-profile" replace />} />
            <Route
              path="industry-profile"
              element={<PlaceholderPage title="行业画像" desc="行业多维分析" />}
            />
            <Route
              path="enterprise-profile"
              element={<PlaceholderPage title="企业画像" desc="企业全景视图" />}
            />
          </Route>

          {/* 4. 产业评分 */}
          <Route path="industry-score" element={<IndustryScore />} />

          {/* 5. 产业诊断 */}
          <Route path="industry-diag">
            <Route index element={<Navigate to="smart-diag" replace />} />
            <Route path="smart-diag" element={<SmartDiag />} />
          </Route>

          {/* 6. 系统管理 */}
          <Route path="system-mgmt">
            <Route index element={<Navigate to="enterprise-data" replace />} />

            {/* 6.1 数据管理 */}
            {/* 企业数据 */}
            <Route path="enterprise-data" element={<EnterpriseData />} />
            {/* 行业数据 */}
            <Route
              path="industry-data"
              element={
                <PlaceholderPage title="行业数据管理" desc="统计指标维护" />
              }
            />
            {/* 评分权重 */}
            <Route
              path="weight-data"
              element={
                <PlaceholderPage title="评分权重管理" desc="模型与权重配置" />
              }
            />

            {/* 6.2 标签数据管理 (归属于数据管理) */}
            {/* 注意：路由 Path 依然保持扁平，方便 MainLayout 跳转 */}
            <Route path="enterprise-tag" element={<EnterpriseTag />} />
            <Route path="tag-library" element={<TagLibrary />} />
            <Route path="auto-tag" element={<AutoTag />} />

            {/* 6.3 用户管理 */}
            <Route
              path="user-mgmt"
              element={
                <PlaceholderPage title="用户管理" desc="RBAC 权限管理" />
              }
            />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
