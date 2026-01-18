import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Typography } from "antd";
import { AppstoreOutlined } from "@ant-design/icons";

import MainLayout from "./layouts/MainLayout";
import Overview from "./pages/Home/Overview";
import AdvancedSearch from "./pages/Home/AdvancedSearch";
import EnterpriseData from "./pages/DataManagement/EnterpriseData";

import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ForgotPassword from "./pages/Auth/ForgotPassword";

import AutoTag from "./pages/TagManagement/AutoTag";
import EnterpriseTag from "./pages/TagManagement/EnterpriseTag";
import TagLibrary from "./pages/TagManagement/TagLibrary";

import IndustryScore from "./pages/ScoreManagement/IndustryScore";
import EnterpriseScore from "./pages/ScoreManagement/EnterpriseScore";

import RICIV1 from "./pages/IndustryAnalysis/RICIV1";
import History from "./pages/IndustryAnalysis/History";

const { Title, Text } = Typography;

// 简单的占位组件，用于那些还没开发的页面
const PlaceholderPage: React.FC<{ title: string; desc: string }> = ({
  title,
  desc,
}) => (
  <div style={{ textAlign: "center", padding: "50px 0", color: "#999" }}>
    <AppstoreOutlined style={{ fontSize: 48, marginBottom: 16 }} />
    <Title level={4} style={{ color: "#666" }}>
      {title}
    </Title>
    <Text type="secondary">{desc}</Text>
  </div>
);

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. 公开路由：登录、注册、找回密码 */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* 2. 根路径重定向到 首页-数据概览 */}
        <Route path="/" element={<Navigate to="/home/overview" replace />} />

        {/* 3. 受保护路由（需要 MainLayout） */}
        <Route element={<MainLayout />}>
          {/* 首页 */}
          <Route path="home">
            <Route path="overview" element={<Overview />} />
            <Route path="search" element={<AdvancedSearch />} />
            <Route
              path="notice"
              element={
                <PlaceholderPage title="公告栏" desc="系统公告与操作指引" />
              }
            />
          </Route>

          {/* 数据管理 */}
          <Route path="data-mgmt">
            {/* 企业基础数据 */}
            <Route path="enterprise-data" element={<EnterpriseData />} />

            {/* 待开发子页面 */}
            <Route
              path="industry-data"
              element={
                <PlaceholderPage title="行业统计数据" desc="管理宏观产业指标" />
              }
            />
            <Route
              path="weight-data"
              element={
                <PlaceholderPage title="评分维度权重" desc="配置模型权重参数" />
              }
            />
            <Route
              path="tag-data"
              element={
                <PlaceholderPage
                  title="标签基础数据"
                  desc="管理标签体系与自动打标规则"
                />
              }
            />
          </Route>

          {/* 评分管理 */}
          <Route path="score-mgmt">
            <Route index element={<Navigate to="industry-score" replace />} />
            <Route path="industry-score" element={<IndustryScore />} />
            <Route path="enterprise-score" element={<EnterpriseScore />} />
          </Route>

          {/* 图谱画像 */}
          <Route
            path="graph-portrait/*"
            element={
              <PlaceholderPage
                title="图谱画像"
                desc="产业链图谱可视化与画像分析"
              />
            }
          />

          {/* 标签管理 */}
          <Route path="tag-mgmt">
            <Route path="auto-tag" element={<AutoTag />} />
            <Route path="enterprise-tag" element={<EnterpriseTag />} />
            <Route path="tag-library" element={<TagLibrary />} />
          </Route>

          {/* 产业分析 */}
          <Route path="industry-analysis">
            <Route index element={<Navigate to="rici-v1" replace />} />
            <Route path="rici-v1" element={<RICIV1 />} />
            <Route path="history" element={<History />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
