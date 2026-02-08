import React, { useState, useRef, useEffect } from "react";
import {
  Input,
  Button,
  Typography,
  List,
  Avatar,
  Space,
  Modal,
  message,
  Layout,
  theme,
  // Tooltip,
} from "antd";
import {
  SendOutlined,
  SettingOutlined,
  UserOutlined,
  RobotOutlined,
  PlusOutlined,
  MessageOutlined,
  BulbOutlined,
  // DeleteOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Sider, Content } = Layout;

// --- 类型定义 ---
interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  time: string;
}

interface HistorySession {
  session_id: string;
  title: string;
  create_time: string;
}

// --- 模拟推荐提问 (Initial Prompts) ---
const INITIAL_PROMPTS = [
  { icon: <BulbOutlined />, text: "分析朝阳区数字医疗产业现状" },
  { icon: <BulbOutlined />, text: "生成一份医疗器械产业链招商建议书" },
  { icon: <BulbOutlined />, text: "识别当前区域产业链的断链风险" },
  { icon: <BulbOutlined />, text: "评估某企业的科技属性得分" },
];

const SmartDiag: React.FC = () => {
  const { token } = theme.useToken();

  // --- 状态管理 ---
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [historyList, setHistoryList] = useState<HistorySession[]>([]);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false); // 侧边栏折叠状态

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- API 交互 ---

  // 1. 初始化加载历史记录
  useEffect(() => {
    fetchHistoryList();
  }, []);

  // 2. 消息滚动
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

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

  const loadSession = async (sessionId: string) => {
    if (sessionId === currentSessionId) return;
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:3001/api/chat/history/${sessionId}`,
      );
      const data = await res.json();
      if (data.success) {
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

  const startNewChat = () => {
    setMessages([]);
    setCurrentSessionId(null);
    setInputValue("");
  };

  const handleSend = async (text: string = inputValue) => {
    const contentToSend = text.trim();
    if (!contentToSend) return;

    // 乐观更新 UI
    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: contentToSend,
      time: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, newUserMsg]);
    setInputValue("");
    setLoading(true);

    try {
      const apiMessages = messages.concat(newUserMsg).map((msg) => ({
        role: msg.role === "ai" ? "assistant" : "user",
        content: msg.content,
      }));

      const res = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          sessionId: currentSessionId,
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

        if (!currentSessionId && data.sessionId) {
          setCurrentSessionId(data.sessionId);
          fetchHistoryList();
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

  // --- 子组件渲染 ---

  // 侧边栏：历史记录
  const renderSidebar = () => (
    <Sider
      width={280}
      collapsible
      collapsed={collapsed}
      trigger={null}
      style={{
        background: "#fff",
        borderRight: "1px solid #f0f0f0",
        height: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* 顶部：新建对话 & 收起按钮 */}
      <div
        style={{
          padding: "16px 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {!collapsed && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={startNewChat}
            style={{ borderRadius: 20, flex: 1, marginRight: 8, height: 40 }}
          >
            新建对话
          </Button>
        )}
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{ color: "#666" }}
        />
      </div>

      {/* 历史列表 */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 8px" }}>
        {!collapsed && (
          <>
            <div
              style={{
                padding: "8px 12px",
                fontSize: 12,
                color: "#999",
                fontWeight: 500,
              }}
            >
              历史记录
            </div>
            <List
              dataSource={historyList}
              renderItem={(item) => (
                <div
                  onClick={() => loadSession(item.session_id)}
                  style={{
                    padding: "10px 12px",
                    cursor: "pointer",
                    borderRadius: 8,
                    marginBottom: 4,
                    background:
                      currentSessionId === item.session_id
                        ? "#e6f4ff"
                        : "transparent",
                    color:
                      currentSessionId === item.session_id ? "#1677ff" : "#333",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                  className="history-item"
                >
                  <MessageOutlined style={{ fontSize: 14 }} />
                  <div
                    style={{
                      flex: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      fontSize: 14,
                    }}
                  >
                    {item.title || "无标题对话"}
                  </div>
                </div>
              )}
            />
          </>
        )}
      </div>

      {/* 底部：配置 */}
      {!collapsed && (
        <div style={{ padding: "16px", borderTop: "1px solid #f0f0f0" }}>
          <Button
            block
            icon={<SettingOutlined />}
            onClick={() => setIsConfigModalOpen(true)}
          >
            模型配置
          </Button>
        </div>
      )}
    </Sider>
  );

  // 初次输入状态（居中）
  const renderInitialState = () => (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 20px",
        maxWidth: 800,
        margin: "0 auto",
        width: "100%",
      }}
    >
      <div style={{ marginBottom: 40, textAlign: "center" }}>
        <Title level={2} style={{ marginBottom: 8 }}>
          有什么可以帮您？
        </Title>
        <Text type="secondary" style={{ fontSize: 16 }}>
          我是您的产业诊断助手，您可以询问关于产业链、企业画像或招商建议的任何问题。
        </Text>
      </div>

      {/* 输入框 (Initial) */}
      <div style={{ width: "100%", marginBottom: 40 }}>
        <div
          style={{
            position: "relative",
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            borderRadius: 16,
            background: "#fff",
            border: "1px solid #e0e0e0",
          }}
        >
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
            autoSize={{ minRows: 3, maxRows: 6 }}
            style={{
              padding: "16px 60px 16px 20px",
              borderRadius: 16,
              border: "none",
              fontSize: 16,
              resize: "none",
              backgroundColor: "transparent",
            }}
          />
          <Button
            type={inputValue.trim() ? "primary" : "default"}
            shape="circle"
            icon={<SendOutlined />}
            onClick={() => handleSend()}
            disabled={!inputValue.trim()}
            style={{ position: "absolute", right: 16, bottom: 16 }}
          />
        </div>
      </div>

      {/* 推荐提问 Chips */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          justifyContent: "center",
        }}
      >
        {INITIAL_PROMPTS.map((prompt, idx) => (
          <div
            key={idx}
            onClick={() => handleSend(prompt.text)}
            style={{
              padding: "8px 16px",
              background: "#f5f5f5",
              borderRadius: 20,
              cursor: "pointer",
              fontSize: 14,
              color: "#555",
              border: "1px solid transparent",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#fff";
              e.currentTarget.style.borderColor = "#d9d9d9";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#f5f5f5";
              e.currentTarget.style.borderColor = "transparent";
            }}
          >
            {prompt.icon}
            {prompt.text}
          </div>
        ))}
      </div>
    </div>
  );

  // 正常对话界面 (输入框在底部)
  const renderChatInterface = () => (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* 消息列表区 */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 0" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 20px" }}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: "flex",
                justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                marginBottom: 32,
              }}
            >
              {msg.role === "ai" && (
                <Avatar
                  icon={<RobotOutlined />}
                  style={{
                    backgroundColor: token.colorPrimary,
                    marginRight: 16,
                    marginTop: 4,
                  }}
                />
              )}
              <div style={{ maxWidth: "80%" }}>
                {msg.role === "ai" && (
                  <div style={{ fontSize: 13, color: "#666", marginBottom: 4 }}>
                    产业诊断助手
                  </div>
                )}
                <div
                  style={{
                    padding: "12px 16px",
                    borderRadius:
                      msg.role === "user"
                        ? "16px 16px 4px 16px"
                        : "4px 16px 16px 16px",
                    backgroundColor:
                      msg.role === "user" ? "#e6f4ff" : "#f5f5f5", // 极简灰与品牌蓝
                    color: "#333",
                    whiteSpace: "pre-wrap",
                    lineHeight: 1.6,
                    fontSize: 15,
                  }}
                >
                  {msg.content}
                </div>
              </div>
              {msg.role === "user" && (
                <Avatar
                  icon={<UserOutlined />}
                  style={{
                    backgroundColor: "#87d068",
                    marginLeft: 16,
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
                alignItems: "flex-start",
                marginBottom: 32,
              }}
            >
              <Avatar
                icon={<RobotOutlined />}
                style={{ backgroundColor: token.colorPrimary, marginRight: 16 }}
              />
              <div
                style={{
                  padding: "12px 16px",
                  background: "#f5f5f5",
                  borderRadius: "4px 16px 16px 16px",
                  color: "#666",
                }}
              >
                <Space>
                  <span className="dot-loading">思考中...</span>
                </Space>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 底部输入框区 */}
      <div style={{ padding: "20px", background: "#fff" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", position: "relative" }}>
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
            autoSize={{ minRows: 1, maxRows: 6 }}
            style={{
              padding: "12px 50px 12px 16px",
              borderRadius: 24,
              resize: "none",
              background: "#f8f9fa",
              border: "1px solid transparent",
            }}
            onFocus={(e) => (e.target.style.background = "#fff")}
            onBlur={(e) => (e.target.style.background = "#f8f9fa")}
          />
          <Button
            type="primary"
            shape="circle"
            // size="small"
            icon={<SendOutlined />}
            onClick={() => handleSend()}
            disabled={!inputValue.trim() || loading}
            style={{ position: "absolute", right: 12, bottom: 7 }}
          />
        </div>
        <div
          style={{
            textAlign: "center",
            marginTop: 8,
            fontSize: 12,
            color: "#999",
          }}
        >
          AI 生成内容可能不准确，请结合实际情况判断。
        </div>
      </div>
    </div>
  );

  return (
    <Layout style={{ height: "100%", background: "#fff" }}>
      {/* 1. 左侧侧边栏 */}
      {renderSidebar()}

      {/* 2. 右侧主内容 */}
      <Content style={{ height: "100%", position: "relative" }}>
        {messages.length === 0 ? renderInitialState() : renderChatInterface()}
      </Content>

      {/* 3. 配置弹窗 */}
      <Modal
        open={isConfigModalOpen}
        onCancel={() => setIsConfigModalOpen(false)}
        title="模型配置"
        footer={null}
      >
        <div style={{ padding: 20, textAlign: "center", color: "#999" }}>
          暂无更多高级配置项，当前使用默认模型。
        </div>
      </Modal>
    </Layout>
  );
};

export default SmartDiag;
