import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Typography } from "antd";
import { AppstoreOutlined } from "@ant-design/icons";

// 引入组件
import MainLayout from "./layouts/MainLayout";
import Overview from "./pages/Home/Overview";
import EnterpriseData from "./pages/DataManagement/EnterpriseData";
// 引入新创建的登录页
import Login from "./pages/Auth/Login";

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
        {/* 1. 公开路由：登录页 */}
        <Route path="/login" element={<Login />} />

        {/* 注册和忘记密码页预留 */}
        <Route
          path="/register"
          element={<PlaceholderPage title="注册页面" desc="开发中..." />}
        />
        <Route
          path="/forgot-password"
          element={<PlaceholderPage title="找回密码" desc="开发中..." />}
        />

        {/* 2. 根路径重定向到 首页-数据概览 */}
        <Route path="/" element={<Navigate to="/home/overview" replace />} />

        {/* 3. 受保护路由（需要 MainLayout） */}
        <Route element={<MainLayout />}>
          {/* 首页 */}
          <Route path="home">
            <Route path="overview" element={<Overview />} />
            <Route
              path="search"
              element={
                <PlaceholderPage
                  title="高级搜索"
                  desc="支持多维度组合检索企业主体"
                />
              }
            />
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

          {/* ============ 其他一级模块 (暂未开发) ============ */}
          <Route
            path="score-mgmt/*"
            element={
              <PlaceholderPage
                title="评分管理"
                desc="产业与企业评分全流程管理"
              />
            }
          />
          <Route
            path="graph-portrait/*"
            element={
              <PlaceholderPage
                title="图谱画像"
                desc="产业链图谱可视化与画像分析"
              />
            }
          />
          <Route
            path="tag-mgmt/*"
            element={<PlaceholderPage title="标签管理" desc="企业标签库管理" />}
          />
          <Route
            path="industry-analysis/*"
            element={
              <PlaceholderPage title="产业分析" desc="AI 大模型辅助决策分析" />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
