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
  message,
} from "antd";
import {
  SendOutlined,
  SettingOutlined,
  UserOutlined,
  RobotOutlined,
  ClockCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { TextArea } = Input;

// 消息类型定义
interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  time: string;
}

// 历史会话类型
interface HistorySession {
  session_id: string;
  title: string;
  create_time: string;
}

const RICIV1: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  // 新增状态
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null); // 当前会话ID
  const [historyList, setHistoryList] = useState<HistorySession[]>([]); // 历史列表
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. 初始化加载历史记录列表
  useEffect(() => {
    fetchHistoryList();
  }, []);

  // 滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 获取历史列表 API
  const fetchHistoryList = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/chat/history");
      const data = await res.json();
      if (data.success) {
        setHistoryList(data.data);
      }
    } catch (error) {
      console.error("Fetch history failed", error);
    }
  };

  // 加载某个具体的会话
  const loadSession = async (sessionId: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:3001/api/chat/history/${sessionId}`,
      );
      const data = await res.json();
      if (data.success) {
        // 转换后端消息格式为前端 Message 格式
        const formattedMsgs: Message[] = data.data.map(
          (item: any, index: number) => ({
            id: `${sessionId}-${index}`,
            role: item.role === "assistant" ? "ai" : "user",
            content: item.content,
            time: new Date(item.create_time).toLocaleTimeString(),
          }),
        );
        setMessages(formattedMsgs);
        setCurrentSessionId(sessionId);
      }
    } catch (error) {
      message.error("加载会话失败");
    } finally {
      setLoading(false);
    }
  };

  // 开启新对话
  const startNewChat = () => {
    setMessages([]);
    setCurrentSessionId(null);
  };

  // 发送消息
  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const currentText = inputValue;

    // UI 乐观更新
    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: currentText,
      time: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, newUserMsg]);
    setInputValue("");
    setLoading(true);

    try {
      // 构造 API 消息体 (DeepSeek 格式)
      const apiMessages = messages.concat(newUserMsg).map((msg) => ({
        role: msg.role === "ai" ? "assistant" : "user",
        content: msg.content,
      }));

      const res = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          sessionId: currentSessionId, // 传当前会话 ID
        }),
      });

      const data = await res.json();

      if (data.success) {
        const newAiMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: "ai",
          content: data.data,
          time: new Date().toLocaleTimeString(),
        };
        setMessages((prev) => [...prev, newAiMsg]);

        // 如果是新会话，更新 sessionId 并刷新历史列表
        if (!currentSessionId && data.sessionId) {
          setCurrentSessionId(data.sessionId);
          fetchHistoryList(); // 刷新左侧/首页列表
        }
      } else {
        message.error(data.message || "请求失败");
      }
    } catch (error) {
      message.error("网络连接异常");
    } finally {
      setLoading(false);
    }
  };

  // 初始欢迎状态组件 (修改为显示真实数据)
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
          dataSource={historyList} // 使用真实数据
          renderItem={(item) => (
            <List.Item>
              <Card
                hoverable
                size="small"
                style={{ borderRadius: 8 }}
                onClick={() => loadSession(item.session_id)} // 点击加载
              >
                <Card.Meta
                  title={
                    <Text ellipsis={{ tooltip: item.title }}>{item.title}</Text>
                  }
                  description={new Date(item.create_time).toLocaleDateString()}
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
        height: "100%",
        position: "relative",
      }}
    >
      {/* 顶部操作栏 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "0 0 16px 0",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        {/* 左侧添加新对话按钮 */}
        <Button
          icon={<PlusOutlined />}
          onClick={startNewChat}
          type={!currentSessionId ? "primary" : "default"}
        >
          新对话
        </Button>
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
            {/* ... 这里的 message map 渲染逻辑保持不变 ... */}
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
                {/* 头像和气泡代码保持不变，直接复用你原来的代码即可 */}
                {msg.role === "ai" && (
                  <Avatar
                    icon={<RobotOutlined />}
                    style={{ backgroundColor: "#1890ff", marginRight: 12 }}
                  />
                )}
                <div
                  style={{
                    maxWidth: "70%",
                    padding: "12px 16px",
                    borderRadius: 8,
                    backgroundColor:
                      msg.role === "user" ? "#e6f7ff" : "#f5f5f5",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {msg.content}
                </div>
                {msg.role === "user" && (
                  <Avatar
                    icon={<UserOutlined />}
                    style={{ backgroundColor: "#87d068", marginLeft: 12 }}
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
                  分析中...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* 底部输入框保持不变 */}
      <div
        style={{
          marginTop: 16,
          maxWidth: 800,
          width: "100%",
          margin: "0 auto",
        }}
      >
        {/* ...输入框代码复用之前的即可... */}
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
            placeholder="输入您的问题..."
            autoSize={{ minRows: 2, maxRows: 6 }}
            style={{ paddingRight: 60, borderRadius: 12, resize: "none" }}
          />
          <Button
            type="primary"
            shape="circle"
            icon={<SendOutlined />}
            onClick={handleSend}
            style={{ position: "absolute", right: 12, bottom: 12 }}
          />
        </div>
      </div>

      {/* 弹窗代码保持不变 */}
      <Modal
        open={isConfigModalOpen}
        onCancel={() => setIsConfigModalOpen(false)}
        title="模型配置"
      >
        {/* ... */}
      </Modal>
    </div>
  );
};

export default RICIV1;
