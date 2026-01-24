import React, { useState, useEffect } from "react";
import {
  Layout,
  Tree,
  Input,
  List,
  Card,
  Tag,
  Typography,
  Space,
  Button,
  theme,
  Breadcrumb,
  Empty,
  Spin,
  message,
} from "antd";
import {
  BankOutlined,
  DeploymentUnitOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type { DataNode } from "antd/es/tree";

const { Sider, Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const IndustryClass: React.FC = () => {
  const navigate = useNavigate();
  const { token } = theme.useToken();

  // State
  const [loadingTree, setLoadingTree] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [companyList, setCompanyList] = useState<any[]>([]);

  // Selection State
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [selectedNodeTitle, setSelectedNodeTitle] = useState<string>("");
  const [searchText, setSearchText] = useState("");
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

  // 1. 加载树谱
  useEffect(() => {
    const fetchTree = async () => {
      setLoadingTree(true);
      try {
        const res = await fetch("http://localhost:3001/api/industry/tree");
        const json = await res.json();
        if (json.success) {
          setTreeData(json.data);
          // 默认展开上中下游
          setExpandedKeys(json.data.map((d: any) => d.key));
        } else {
          message.error(json.message || "加载树谱失败");
        }
      } catch (err) {
        console.error(err);
        message.error("连接服务器失败");
      } finally {
        setLoadingTree(false);
      }
    };
    fetchTree();
    // 初始加载
    fetchCompanies({});
  }, []);

  // 2. 查询企业列表
  const fetchCompanies = async (params: {
    keyword?: string;
    tagId?: string;
    stageKey?: string;
  }) => {
    setLoadingList(true);
    try {
      const query = new URLSearchParams();
      if (params.keyword) query.append("keyword", params.keyword);
      if (params.stageKey) query.append("stageKey", params.stageKey);
      if (params.tagId) query.append("tagId", params.tagId);

      const res = await fetch(
        `http://localhost:3001/api/industry/companies?${query.toString()}`,
      );
      const json = await res.json();
      if (json.success) {
        setCompanyList(json.data);
      } else {
        message.error(json.message);
        setCompanyList([]);
      }
    } catch (err) {
      console.error(err);
      setCompanyList([]);
    } finally {
      setLoadingList(false);
    }
  };

  // 3. 树节点点击处理
  const onSelect = (keys: React.Key[], info: any) => {
    setSelectedKeys(keys);
    const key = keys[0] as string;
    const node = info.node;

    if (!key) {
      setSelectedNodeTitle("");
      fetchCompanies({ keyword: searchText });
      return;
    }

    setSelectedNodeTitle(node.title as string);

    if (String(key).startsWith("stage_")) {
      fetchCompanies({ keyword: searchText, stageKey: key });
    } else {
      fetchCompanies({ keyword: searchText, tagId: key });
    }
  };

  // 4. 搜索框处理
  const onSearch = (value: string) => {
    setSearchText(value);
    const currentKey = selectedKeys[0] as string;
    const isStage = currentKey?.startsWith("stage_");

    fetchCompanies({
      keyword: value,
      stageKey: isStage ? currentKey : undefined,
      tagId: !isStage ? currentKey : undefined,
    });
  };

  // 5. 树节点渲染器
  const titleRender = (node: any) => {
    const isSelected = selectedKeys.includes(node.key);
    const isStage = String(node.key).startsWith("stage_");

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          padding: isStage ? "10px 12px" : "6px 8px",
          margin: "2px 0",
          borderRadius: 4,
          border: isSelected
            ? `1px solid ${token.colorPrimary}`
            : "1px solid transparent",
          backgroundColor: isSelected
            ? "#e6f7ff"
            : isStage
              ? "#fafafa"
              : "transparent",
          borderBottom: isStage ? "1px solid #f0f0f0" : "none",
        }}
      >
        <Space>
          {isStage && (
            <DeploymentUnitOutlined style={{ color: token.colorPrimary }} />
          )}
          <Text
            strong={isStage}
            style={{ color: isSelected ? token.colorPrimary : "inherit" }}
          >
            {node.title}
          </Text>
        </Space>
        {node.count > 0 && (
          <Tag style={{ margin: 0, color: "#999" }} bordered={false}>
            {node.count}
          </Tag>
        )}
      </div>
    );
  };

  return (
    <Layout style={{ height: "calc(100vh - 64px - 50px)", background: "#fff" }}>
      {/* 左侧树谱 */}
      <Sider
        width={380}
        style={{
          background: "#fff",
          borderRight: "1px solid #f0f0f0",
          overflowY: "auto",
          padding: "16px",
        }}
      >
        <Title level={4} style={{ marginBottom: 16, paddingLeft: 8 }}>
          产业链分类
        </Title>
        {loadingTree ? (
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <Spin />
          </div>
        ) : (
          <Tree
            blockNode
            showLine={{ showLeafIcon: false }}
            treeData={treeData}
            selectedKeys={selectedKeys}
            expandedKeys={expandedKeys}
            onExpand={setExpandedKeys}
            onSelect={onSelect}
            titleRender={titleRender}
          />
        )}
      </Sider>

      {/* 右侧列表 */}
      <Content
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          background: "#f5f7fa",
        }}
      >
        {/* 顶部搜索 */}
        <div
          style={{
            padding: "24px 32px",
            background: "#fff",
            boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
          }}
        >
          <Breadcrumb
            items={[
              { title: "全产业链" },
              { title: selectedNodeTitle || "全部企业" },
            ]}
            style={{ marginBottom: 16 }}
          />

          <div style={{ display: "flex", gap: 16 }}>
            <Input.Search
              placeholder={`在 ${selectedNodeTitle || "全库"} 中搜索企业...`}
              allowClear
              enterButton="搜索"
              size="large"
              onSearch={onSearch}
              style={{ maxWidth: 600 }}
            />
          </div>
        </div>

        {/* 列表区域 */}
        <div style={{ flex: 1, padding: "24px 32px", overflowY: "auto" }}>
          {loadingList ? (
            <div style={{ textAlign: "center", marginTop: 50 }}>
              <Spin size="large" />
            </div>
          ) : (
            <List
              grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 3 }}
              dataSource={companyList}
              locale={{
                emptyText: <Empty description="当前分类下暂无相关企业数据" />,
              }}
              renderItem={(item) => (
                <List.Item>
                  <Card
                    hoverable
                    onClick={() =>
                      navigate(
                        `/industry-portrait/enterprise-profile?id=${item.company_id}`,
                      )
                    }
                    style={{ borderRadius: 8 }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: 12,
                      }}
                    >
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          background: "#f0f5ff",
                          borderRadius: 4,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: 12,
                        }}
                      >
                        <BankOutlined
                          style={{ color: token.colorPrimary, fontSize: 20 }}
                        />
                      </div>
                      <div style={{ flex: 1, overflow: "hidden" }}>
                        <Text strong style={{ fontSize: 16 }} ellipsis>
                          {item.company_name}
                        </Text>
                        <div style={{ marginTop: 4 }}>
                          {/* 由于没有 status 字段，暂时不显示标签，或显示默认 */}
                          <Tag style={{ margin: 0, fontSize: 10 }}>企业</Tag>
                        </div>
                      </div>
                    </div>
                    <Paragraph
                      type="secondary"
                      ellipsis={{ rows: 2 }}
                      style={{ fontSize: 12, minHeight: 36, marginBottom: 8 }}
                    >
                      {/* 显示原始变体名作为描述，如果没有则显示默认文案 */}
                      {item.raw_variants
                        ? `别名/变体: ${item.raw_variants}`
                        : "暂无更多描述信息"}
                    </Paragraph>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderTop: "1px solid #f0f0f0",
                        paddingTop: 8,
                      }}
                    >
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        ID: {item.company_id}
                      </Text>
                      <Button
                        type="text"
                        size="small"
                        style={{ color: token.colorPrimary }}
                      >
                        详情 <RightOutlined />
                      </Button>
                    </div>
                  </Card>
                </List.Item>
              )}
            />
          )}
        </div>
      </Content>
    </Layout>
  );
};

export default IndustryClass;
