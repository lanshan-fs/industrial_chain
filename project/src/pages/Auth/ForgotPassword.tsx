import React from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Typography,
  Steps,
  Result,
  message,
  Row,
  Col,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  SafetyCertificateOutlined,
  LeftOutlined,
  MailOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({ username: "", email: "" });

  const stepsItems = [
    { title: "验证身份", key: "verify" },
    { title: "重置密码", key: "reset" },
    { title: "完成", key: "finish" },
  ];

  // 第一步：校验并发送验证码
  const onFinishStep1 = async (values: any) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (data.success) {
        message.success(data.message);
        setFormData(values); // 保存用户名和邮箱用于下一步
        setCurrentStep(1);
      } else {
        message.error(data.message || "验证失败");
      }
    } catch (error) {
      message.error("网络连接异常");
    } finally {
      setLoading(false);
    }
  };

  // 第二步：提交重置密码
  const onFinishStep2 = async (values: any) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          code: values.code,
          newPassword: values.newPassword
        }),
      });
      const data = await res.json();

      if (data.success) {
        message.success("密码重置成功");
        setCurrentStep(2);
      } else {
        message.error(data.message || "重置失败");
      }
    } catch (error) {
      message.error("网络连接异常");
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <Form onFinish={onFinishStep1} layout="vertical" size="large">
      <Form.Item
        name="username"
        label="用户名"
        rules={[{ required: true, message: "请输入用户名!" }]}
      >
        <Input prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />} placeholder="您的登录账号" />
      </Form.Item>
      <Form.Item
        name="email"
        label="绑定邮箱"
        rules={[
          { required: true, message: "请输入绑定邮箱!" },
          { type: 'email', message: '邮箱格式不正确' }
        ]}
      >
        <Input prefix={<MailOutlined style={{ color: "rgba(0,0,0,.25)" }} />} placeholder="绑定的电子邮箱" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" block loading={loading}>发送验证码</Button>
      </Form.Item>
    </Form>
  );

  const renderStep2 = () => (
    <Form onFinish={onFinishStep2} layout="vertical" size="large">
      <Form.Item
        name="code"
        label="验证码"
        rules={[{ required: true, message: "请输入验证码!" }]}
      >
        <Input prefix={<SafetyCertificateOutlined style={{ color: "rgba(0,0,0,.25)" }} />} placeholder="6位数字验证码" />
      </Form.Item>
      <Form.Item
        name="newPassword"
        label="新密码"
        rules={[{ required: true, message: "请输入新密码!" }, { min: 6, message: "至少6位" }]}
      >
        <Input.Password prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />} placeholder="设置新密码" />
      </Form.Item>
      <Form.Item
        name="confirm"
        label="确认密码"
        dependencies={['newPassword']}
        rules={[
          { required: true, message: "请确认密码!" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('newPassword') === value) return Promise.resolve();
              return Promise.reject(new Error('两次输入的密码不一致!'));
            },
          }),
        ]}
      >
        <Input.Password prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />} placeholder="确认新密码" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" block loading={loading}>确认重置</Button>
      </Form.Item>
    </Form>
  );

  const renderStep3 = () => (
    <Result
      status="success"
      title="密码重置成功"
      subTitle="您的密码已成功更新。"
      extra={<Button type="primary" onClick={() => navigate("/login")} size="large">立即登录</Button>}
    />
  );

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw", overflow: "hidden" }}>
      <div style={{ flex: 1, backgroundColor: "#18181b", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 80px", position: "relative", color: "white" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundImage: "radial-gradient(circle at 30% 70%, #333 0%, #18181b 70%)", opacity: 0.5 }} />
        <div style={{ zIndex: 1 }}>
          <div style={{ width: 64, height: 64, background: "white", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", color: "#18181b", fontSize: 32, fontWeight: "bold", marginBottom: 24 }}>P</div>
          <Title style={{ color: "white", fontSize: 40, margin: "0 0 16px" }}>安全中心</Title>
          <Text style={{ color: "rgba(255,255,255,0.65)", fontSize: 18 }}>找回您的账号密码，保障数据安全。</Text>
        </div>
      </div>
      <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "white", padding: 40 }}>
        <div style={{ width: "100%", maxWidth: 440 }}>
          <div style={{ marginBottom: 40 }}><Link to="/login" style={{ color: "#666", display: "inline-flex", alignItems: "center" }}><LeftOutlined style={{ marginRight: 4 }} /> 返回登录</Link></div>
          <div style={{ marginBottom: 32 }}><Title level={2} style={{ marginBottom: 8 }}>找回密码</Title><Text type="secondary">请按照步骤重置您的登录密码</Text></div>
          <Steps current={currentStep} items={stepsItems} style={{ marginBottom: 40 }} />
          <div style={{ minHeight: 300 }}>
            {currentStep === 0 && renderStep1()}
            {currentStep === 1 && renderStep2()}
            {currentStep === 2 && renderStep3()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
