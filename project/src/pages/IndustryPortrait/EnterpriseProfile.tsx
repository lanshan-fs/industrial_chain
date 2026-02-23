import React, { useState, useEffect } from "react";
import { Layout, Empty, Spin, Button, message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

import ReportActionButtons from "../../components/ReportActionButtons";
import EnterpriseOverviewTab from "./components/EnterpriseOverviewTab";

const { Content } = Layout;

const EnterpriseProfile: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // 从 URL 获取企业 ID 或名称
  const queryParams = new URLSearchParams(location.search);
  const companyId = queryParams.get("id");
  const companyName = queryParams.get("company");

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        // 优先使用 ID 查询，没有则尝试按名称模糊匹配
        const identifier = companyId || companyName;
        if (!identifier) {
          setLoading(false);
          return;
        }

        const res = await fetch(`http://localhost:3001/api/companies/${encodeURIComponent(identifier)}`);
        const json = await res.json();

        if (json.success && json.data) {
          setProfile(json.data);
        } else {
          message.warning("未找到该企业详细画像数据");
        }
      } catch (error) {
        console.error("Fetch profile error:", error);
        message.error("加载画像数据失败");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [companyId, companyName]);

  if (!loading && !profile)
    return (
      <div style={{ textAlign: "center", marginTop: 100 }}>
        <Empty description="未找到匹配的企业画像" />
        <Button onClick={() => navigate(-1)} style={{ marginTop: 16 }}>返回上一页</Button>
      </div>
    );

  return (
    <Layout style={{ minHeight: "100vh", background: "#fff" }}>
      <Content style={{ padding: 0, width: "100%" }}>
        <div style={{ maxWidth: "100%", margin: "0 auto" }}>
          {/* 顶部工具栏 */}
          <div
            style={{
              padding: "0 24px",
              borderBottom: "1px solid #f0f0f0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#fff",
              height: 64,
            }}
          >
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(-1)}
              style={{ fontSize: 14 }}
            >
              返回
            </Button>

            {profile && (
              <ReportActionButtons
                reportTitle={`${profile.baseInfo.name}企业画像报告`}
                targetId="enterprise-report-content"
              />
            )}
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "100px 0" }}>
              <Spin size="large" tip="企业全息数据加载中..." />
            </div>
          ) : (
            <div id="enterprise-report-content">
              <EnterpriseOverviewTab profile={profile} />
            </div>
          )}

          <div
            style={{
              textAlign: "center",
              padding: "24px 0",
              color: "#ccc",
              fontSize: 12,
              backgroundColor: "#f5f5f5",
            }}
          >
            - 朝阳区产业链洞察平台生成 -
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default EnterpriseProfile;
