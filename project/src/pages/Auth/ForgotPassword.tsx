import React, { useState } from "react";
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
} from "@ant-design/icons";

const { Title, Text } = Typography;

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);

  // 模拟发送验证码的状态
  const [counting, setCounting] = useState(false);
  const [count, setCount] = useState(60);

  // 定义步骤条的数据 items
  const stepsItems = [
    { title: "验证身份", key: "verify" },
    { title: "重置密码", key: "reset" },
    { title: "完成", key: "finish" },
  ];

  // 第一步表单提交：验证身份
  const onFinishStep1 = (values: any) => {
    setLoading(true);
    console.log("Step 1 values:", values);

    // 模拟后端校验
    setTimeout(() => {
      setLoading(false);
      message.success("验证码已发送至您的邮箱/手机");
      setCurrentStep(1);
    }, 1000);
  };

  // 第二步表单提交：重置密码
  const onFinishStep2 = (values: any) => {
    setLoading(true);
    console.log("Step 2 values:", values);

    // 模拟重置密码接口
    setTimeout(() => {
      setLoading(false);
      setCurrentStep(2);
    }, 1000);
  };

  // 模拟发送验证码倒计时
  const startCount = () => {
    setCounting(true);
    let tempCount = 60;
    setCount(tempCount);
    const timer = setInterval(() => {
      tempCount -= 1;
      setCount(tempCount);
      if (tempCount <= 0) {
        clearInterval(timer);
        setCounting(false);
      }
    }, 1000);
    message.success("验证码已发送");
  };

  // 渲染第一步：身份验证
  const renderStep1 = () => (
    <Form
      name="verify_identity"
      onFinish={onFinishStep1}
      layout="vertical"
      size="large"
    >
      <Form.Item
        name="account"
        label="账号/邮箱/手机号"
        rules={[{ required: true, message: "请输入您的注册账号!" }]}
      >
        <Input
          prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
          placeholder="请输入用户名、邮箱或手机号"
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block loading={loading}>
          下一步
        </Button>
      </Form.Item>
    </Form>
  );

  // 渲染第二步：重置密码
  const renderStep2 = () => (
    <Form
      name="reset_password"
      onFinish={onFinishStep2}
      layout="vertical"
      size="large"
    >
      <Form.Item
        name="code"
        label="验证码"
        rules={[{ required: true, message: "请输入验证码!" }]}
      >
        <Row gutter={8}>
          <Col flex="auto">
            <Input
              prefix={
                <SafetyCertificateOutlined
                  style={{ color: "rgba(0,0,0,.25)" }}
                />
              }
              placeholder="请输入6位验证码"
            />
          </Col>
          <Col>
            <Button disabled={counting} onClick={startCount}>
              {counting ? `${count}秒后重发` : "获取验证码"}
            </Button>
          </Col>
        </Row>
      </Form.Item>

      <Form.Item
        name="newPassword"
        label="新密码"
        rules={[
          { required: true, message: "请输入新密码!" },
          { min: 6, message: "密码至少6位" },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
          placeholder="设置新密码"
        />
      </Form.Item>

      <Form.Item
        name="confirmPassword"
        label="确认密码"
        dependencies={["newPassword"]}
        rules={[
          { required: true, message: "请确认新密码!" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("newPassword") === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("两次输入的密码不一致!"));
            },
          }),
        ]}
      >
        <Input.Password
          prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
          placeholder="确认新密码"
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block loading={loading}>
          确认重置
        </Button>
      </Form.Item>

      <div style={{ textAlign: "center" }}>
        <a onClick={() => setCurrentStep(0)}>返回上一步</a>
      </div>
    </Form>
  );

  // 渲染第三步：完成
  const renderStep3 = () => (
    <Result
      status="success"
      title="密码重置成功"
      subTitle="您的密码已成功更新，请使用新密码重新登录。"
      extra={[
        <Button
          type="primary"
          key="login"
          onClick={() => navigate("/login")}
          size="large"
        >
          立即登录
        </Button>,
      ]}
    />
  );

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
        className="hidden-xs"
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "radial-gradient(circle at 30% 70%, #333 0%, #18181b 70%)",
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
            安全中心
          </Title>
          <Text style={{ color: "rgba(255,255,255,0.65)", fontSize: 18 }}>
            找回您的账号密码，保障数据安全。
          </Text>
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
          {/* 顶部返回导航 */}
          <div style={{ marginBottom: 40 }}>
            <Link
              to="/login"
              style={{
                color: "#666",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              <LeftOutlined style={{ marginRight: 4 }} /> 返回登录
            </Link>
          </div>

          <div style={{ marginBottom: 32 }}>
            <Title level={2} style={{ marginBottom: 8 }}>
              找回密码
            </Title>
            <Text type="secondary">请按照步骤重置您的登录密码</Text>
          </div>

          {/* 步骤条：使用 items 属性替代子组件写法 */}
          <Steps
            current={currentStep}
            items={stepsItems}
            style={{ marginBottom: 40 }}
          />

          {/* 动态渲染表单内容 */}
          <div style={{ minHeight: 300 }}>
            {currentStep === 0 && renderStep1()}
            {currentStep === 1 && renderStep2()}
            {currentStep === 2 && renderStep3()}
          </div>
        </div>
      </div>

      {/* 响应式样式 */}
      <style>{`
        @media (max-width: 768px) {
          .hidden-xs { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default ForgotPassword;
