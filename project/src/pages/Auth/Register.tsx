import React from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Select,
  Typography,
  Row,
  Col,
  message,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  BankOutlined,
  IdcardOutlined,
  KeyOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    try {
      const res = await fetch("http://localhost:3001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (data.success) {
        message.success("注册成功！即将跳转登录页面...");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        message.error(data.message || "注册失败");
      }
    } catch (error) {
      console.error("Register error:", error);
      message.error("网络连接异常");
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
      {/* 左侧品牌区域 - 保持与登录页一致的视觉风格 */}
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
        className="hidden-xs" // 响应式处理：极小屏幕隐藏左侧
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "radial-gradient(circle at 70% 70%, #333 0%, #18181b 70%)",
            opacity: 0.5,
            zIndex: 0,
          }}
        />

        <div style={{ zIndex: 1 }}>
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
            加入区域产业链
            <br />
            洞察平台
          </Title>
          <Text style={{ color: "rgba(255,255,255,0.65)", fontSize: 18 }}>
            注册即刻开启数据驱动的产业分析之旅。
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
          © 2026 Industrial Chain Platform.
        </div>
      </div>

      {/* 右侧表单区域 - 增加滚动条以适应长表单 */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
          padding: "40px",
          overflowY: "auto", // 允许垂直滚动
        }}
      >
        <div style={{ width: "100%", maxWidth: 520 }}>
          <div style={{ marginBottom: 32 }}>
            <Title level={2} style={{ marginBottom: 8 }}>
              创建账号
            </Title>
            <Text type="secondary">
              已有账号？ <Link to="/login">立即登录</Link>
            </Text>
          </div>

          <Form
            form={form}
            name="register_form"
            onFinish={onFinish}
            size="large"
            layout="vertical"
            scrollToFirstError
          >
            {/* 核心必填项：领域与邀请码 */}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="domain"
                  label="所属领域"
                  rules={[{ required: true, message: "请选择所属领域!" }]}
                >
                  <Select placeholder="选择领域">
                    <Option value="digital_wellness">数字康养</Option>
                    <Option value="digital_medical">数字医疗</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="inviteCode"
                  label="邀请码"
                  rules={[{ required: true, message: "请输入邀请码!" }]}
                  tooltip="请使用固定邀请码：CY2026"
                >
                  <Input
                    prefix={
                      <KeyOutlined style={{ color: "rgba(0,0,0,.25)" }} />
                    }
                    placeholder="请输入邀请码 CY2026"
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* 账号信息 */}
            <Form.Item
              name="username"
              label="用户名"
              rules={[
                { required: true, message: "请输入用户名!", whitespace: true },
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                placeholder="用于登录的用户名"
              />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="password"
                  label="密码"
                  rules={[
                    { required: true, message: "请输入密码!" },
                    { min: 6, message: "密码至少6位" },
                  ]}
                  hasFeedback
                >
                  <Input.Password
                    prefix={
                      <LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />
                    }
                    placeholder="设置密码"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="confirm"
                  label="确认密码"
                  dependencies={["password"]}
                  hasFeedback
                  rules={[
                    { required: true, message: "请确认密码!" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("两次输入的密码不一致!")
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    prefix={
                      <LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />
                    }
                    placeholder="确认密码"
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* 个人/单位信息 */}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="email"
                  label="邮箱"
                  rules={[
                    { type: "email", message: "邮箱格式不正确!" },
                    { required: true, message: "请输入邮箱!" },
                  ]}
                >
                  <Input
                    prefix={
                      <MailOutlined style={{ color: "rgba(0,0,0,.25)" }} />
                    }
                    placeholder="example@mail.com"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="phone"
                  label="联系方式"
                  rules={[{ required: true, message: "请输入手机号!" }]}
                >
                  <Input
                    prefix={
                      <PhoneOutlined style={{ color: "rgba(0,0,0,.25)" }} />
                    }
                    placeholder="手机号码"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="company"
                  label="单位名称"
                  rules={[{ required: true, message: "请输入单位名称!" }]}
                >
                  <Input
                    prefix={
                      <BankOutlined style={{ color: "rgba(0,0,0,.25)" }} />
                    }
                    placeholder="所在单位"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="job" label="职务">
                  <Input
                    prefix={
                      <IdcardOutlined style={{ color: "rgba(0,0,0,.25)" }} />
                    }
                    placeholder="当前职务"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item style={{ marginTop: 16 }}>
              <Button
                type="primary"
                htmlType="submit"
                block
                style={{ height: 44, fontSize: 16 }}
              >
                注 册
              </Button>
            </Form.Item>

            <div style={{ textAlign: "center", color: "rgba(0,0,0,0.45)" }}>
              点击“注册”即表示您同意平台的 <a href="#">服务条款</a> 和{" "}
              <a href="#">隐私政策</a>
            </div>
          </Form>
        </div>
      </div>

      {/* 补充样式：在小屏幕隐藏左侧 */}
      <style>{`
        @media (max-width: 768px) {
          .hidden-xs { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default Register;
