import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Input, Button, Select, Typography, Divider, message } from "antd";
import {
  UserOutlined,
  LockOutlined,
  SafetyCertificateOutlined,
  GithubOutlined,
  TwitterOutlined,
  GoogleOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (data.success) {
        message.success("登录成功");
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data.user));
        navigate("/home");
      } else {
        message.error(data.message || "登录失败");
      }
    } catch (error) {
      console.error("Login error:", error);
      message.error("网络连接异常");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      {/* 左侧品牌区域 */}
      <div
        style={{
          flex: 1,
          backgroundColor: "#18181b",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 80px",
          position: "relative",
          color: "white",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "radial-gradient(circle at 30% 30%, #333 0%, #18181b 70%)",
            opacity: 0.5,
            zIndex: 0,
          }}
        />

        <div style={{ zIndex: 1, marginBottom: 40 }}>
          <div
            style={{
              width: 64,
              height: 64,
              background: "white",
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#18181b",
              fontSize: 32,
              fontWeight: "bold",
              marginBottom: 24,
            }}
          >
            P
          </div>
          <Title style={{ color: "white", fontSize: 40, margin: "0 0 16px" }}>
            区域产业链
            <br />
            洞察平台
          </Title>
          <Text style={{ color: "rgba(255,255,255,0.65)", fontSize: 18 }}>
            以数据驱动产业决策，构建区域经济新生态。
          </Text>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: 80,
            zIndex: 1,
            color: "rgba(255,255,255,0.45)",
          }}
        >
          © 2024 Industrial Chain Platform. All rights reserved.
        </div>
      </div>

      {/* 右侧表单区域 */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
          padding: 40,
        }}
      >
        <div style={{ width: "100%", maxWidth: 440 }}>
          <div style={{ position: "absolute", top: 40, right: 40 }}>
            <Button type="text">
              <Link to="/register">注册新账号</Link>
            </Button>
          </div>

          <div style={{ marginBottom: 40 }}>
            <Title level={2} style={{ marginBottom: 8 }}>
              登录账户
            </Title>
            <Text type="secondary">请输入您的凭据以访问平台</Text>
          </div>

          <Form
            name="login_form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            size="large"
            layout="vertical"
            requiredMark="optional"
          >
            <Form.Item
              name="domain"
              label="所属领域"
              rules={[{ required: true, message: "请选择所属领域!" }]}
            >
              <Select
                placeholder="请选择领域"
                suffixIcon={
                  <SafetyCertificateOutlined
                    style={{ color: "rgba(0,0,0,.25)" }}
                  />
                }
              >
                <Option value="digital_wellness">数字康养</Option>
                <Option value="digital_medical">数字医疗</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="username"
              label="用户名"
              rules={[{ required: true, message: "请输入用户名!" }]}
            >
              <Input
                prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                placeholder="name@example.com"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="密码"
              rules={[{ required: true, message: "请输入密码!" }]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                placeholder="请输入密码"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                style={{ height: 44, fontSize: 16, fontWeight: 500 }}
              >
                登 录
              </Button>
            </Form.Item>

            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <Link to="/forgot-password" style={{ color: "#666" }}>
                忘记密码？
              </Link>
            </div>
          </Form>

          <Divider plain>
            <Text type="secondary" style={{ fontSize: 12 }}>
              或通过以下方式登录
            </Text>
          </Divider>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 16,
              marginTop: 24,
            }}
          >
            <Button shape="circle" icon={<GithubOutlined />} size="large" />
            <Button shape="circle" icon={<TwitterOutlined />} size="large" />
            <Button shape="circle" icon={<GoogleOutlined />} size="large" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
