import React, { useState, useRef, useEffect } from "react";
import {
  Input,
  Button,
  Card,
  Typography,
  List,
  Avatar,
  Space,
  Modal,
  Form,
  Select,
  Checkbox,
} from "antd";
import {
  SendOutlined,
  SettingOutlined,
  UserOutlined,
  RobotOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { TextArea } = Input;

// 模拟最近记录数据
const MOCK_RECENT_HISTORY = [
  { id: 1, title: "朝阳区数字医疗产业发展趋势分析", time: "2小时前" },
  { id: 2, title: "生物医药产业链薄弱环节识别报告", time: "昨天" },
  { id: 3, title: "2025年智慧康养行业招商策略建议", time: "2天前" },
];

// 消息类型定义
interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  time: string;
}

const RICIV1: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 发送消息处理
  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      time: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInputValue("");
    setLoading(true);

    // 模拟AI回复
    setTimeout(() => {
      const newAiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: `收到您的请求："${newUserMsg.content}"。\n\n根据现有产业链数据分析，朝阳区在数字医疗领域具有显著的政策优势和人才集聚效应。建议重点关注以下几个方面...\n\n(这是模拟的 RICI V1 回复)`,
        time: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, newAiMsg]);
      setLoading(false);
    }, 1500);
  };

  // 初始欢迎状态组件
  const InitialState = () => (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 0" }}>
      <div style={{ textAlign: "center", marginBottom: 60 }}>
        <Title level={2}>你好，我是 RICI 产业分析助手</Title>
        <Text type="secondary" style={{ fontSize: 16 }}>
          基于大模型的产业链决策辅助系统，我可以为您生成分析报告、识别风险或提供招商建议。
        </Text>
      </div>

      <Card
        title={
          <Space>
            <ClockCircleOutlined /> 最近对话
          </Space>
        }
        bordered={false}
        style={{ background: "transparent", boxShadow: "none" }}
      >
        <List
          grid={{ gutter: 16, column: 3 }}
          dataSource={MOCK_RECENT_HISTORY}
          renderItem={(item) => (
            <List.Item>
              <Card
                hoverable
                size="small"
                style={{ borderRadius: 8 }}
                actions={[
                  <EditOutlined key="edit" />,
                  <DeleteOutlined key="delete" />,
                ]}
              >
                <Card.Meta
                  title={
                    <Text ellipsis={{ tooltip: item.title }}>{item.title}</Text>
                  }
                  description={item.time}
                />
              </Card>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%", // 占满 Content 区域
        position: "relative",
      }}
    >
      {/* 顶部操作栏 */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "0 0 16px 0",
          borderBottom: messages.length > 0 ? "1px solid #f0f0f0" : "none",
        }}
      >
        <Button
          icon={<SettingOutlined />}
          onClick={() => setIsConfigModalOpen(true)}
        >
          模型配置
        </Button>
      </div>

      {/* 中间内容交互区 */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 0" }}>
        {messages.length === 0 ? (
          <InitialState />
        ) : (
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: "flex",
                  justifyContent:
                    msg.role === "user" ? "flex-end" : "flex-start",
                  marginBottom: 24,
                }}
              >
                {msg.role === "ai" && (
                  <Avatar
                    icon={<RobotOutlined />}
                    style={{
                      backgroundColor: "#1890ff",
                      marginRight: 12,
                      marginTop: 4,
                    }}
                  />
                )}
                <div
                  style={{
                    maxWidth: "70%",
                    padding: "12px 16px",
                    borderRadius: 8,
                    backgroundColor:
                      msg.role === "user" ? "#e6f7ff" : "#f5f5f5",
                    border:
                      msg.role === "user"
                        ? "1px solid #91d5ff"
                        : "1px solid #f0f0f0",
                  }}
                >
                  <div style={{ whiteSpace: "pre-wrap" }}>{msg.content}</div>
                </div>
                {msg.role === "user" && (
                  <Avatar
                    icon={<UserOutlined />}
                    style={{
                      backgroundColor: "#87d068",
                      marginLeft: 12,
                      marginTop: 4,
                    }}
                  />
                )}
              </div>
            ))}
            {loading && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 24,
                }}
              >
                <Avatar
                  icon={<RobotOutlined />}
                  style={{ backgroundColor: "#1890ff", marginRight: 12 }}
                />
                <div
                  style={{
                    padding: "12px 16px",
                    background: "#f5f5f5",
                    borderRadius: 8,
                  }}
                >
                  <Space>
                    <span>分析中</span>
                    <span className="loading-dots">...</span>
                  </Space>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* 底部输入框 */}
      <div
        style={{
          marginTop: 16,
          maxWidth: 800,
          width: "100%",
          margin: "0 auto",
        }}
      >
        <div style={{ position: "relative" }}>
          <TextArea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onPressEnter={(e) => {
              if (!e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="输入您的问题，例如：分析当前产业链的薄弱环节..."
            autoSize={{ minRows: 2, maxRows: 6 }}
            style={{ paddingRight: 60, borderRadius: 12, resize: "none" }}
          />
          <Button
            type="primary"
            shape="circle"
            icon={<SendOutlined />}
            onClick={handleSend}
            style={{
              position: "absolute",
              right: 12,
              bottom: 12,
            }}
          />
        </div>
        <div style={{ textAlign: "center", marginTop: 8 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            RICI 生成的内容可能不准确，请核对重要信息。
          </Text>
        </div>
      </div>

      {/* 模型配置弹窗 */}
      <Modal
        title="模型分析配置"
        open={isConfigModalOpen}
        onOk={() => setIsConfigModalOpen(false)}
        onCancel={() => setIsConfigModalOpen(false)}
        okText="保存配置"
      >
        <Form
          layout="vertical"
          initialValues={{ reportType: "industry", concerns: [] }}
        >
          <Form.Item label="报告类型" name="reportType">
            <Select>
              <Select.Option value="industry">产业链整体分析</Select.Option>
              <Select.Option value="enterprise">企业深度画像</Select.Option>
              <Select.Option value="risk">风险评估报告</Select.Option>
              <Select.Option value="investment">招商策略建议</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="核心关注点" name="concerns">
            <Checkbox.Group style={{ width: "100%" }}>
              <Space direction="vertical">
                <Checkbox value="tech">技术创新能力</Checkbox>
                <Checkbox value="market">市场占有率</Checkbox>
                <Checkbox value="finance">财务健康度</Checkbox>
                <Checkbox value="supply">供应链稳定性</Checkbox>
              </Space>
            </Checkbox.Group>
          </Form.Item>
          <Form.Item label="分析深度">
            <Select defaultValue="standard">
              <Select.Option value="fast">快速分析（基于摘要）</Select.Option>
              <Select.Option value="standard">
                标准分析（基于结构化数据）
              </Select.Option>
              <Select.Option value="deep">
                深度推理（结合外部知识库）
              </Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RICIV1;
