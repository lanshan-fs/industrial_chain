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
  Empty,
  Spin,
  message,
  Select,
  Badge,
} from "antd";
import {
  BankOutlined,
  DeploymentUnitOutlined,
  RightOutlined,
  FilterOutlined,
  AppstoreOutlined,
  BarsOutlined,
  NodeIndexOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type { DataNode } from "antd/es/tree";

const { Sider, Content } = Layout;
const { Title, Text, Paragraph } = Typography;

// --- 样式常量定义 ---
const STAGE_COLORS: Record<string, string> = {
  stage_上游: "#1677ff", // 科技蓝
  stage_中游: "#13c2c2", // 智造青
  stage_下游: "#fa8c16", // 服务橙
};

const STAGE_BG_COLORS: Record<string, string> = {
  stage_上游: "#e6f4ff",
  stage_中游: "#e6fffb",
  stage_下游: "#fff7e6",
};

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
  const [selectedNodeInfo, setSelectedNodeInfo] = useState<{
    title: string;
    key: string;
  } | null>(null);
  const [searchText, setSearchText] = useState("");
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    const fetchTree = async () => {
      setLoadingTree(true);
      try {
        const res = await fetch("http://localhost:3001/api/industry/tree");
        const json = await res.json();
        if (json.success) {
          setTreeData(json.data);
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
    fetchCompanies({});
  }, []);

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
        setCompanyList([]);
      }
    } catch (err) {
      console.error(err);
      setCompanyList([]);
    } finally {
      setLoadingList(false);
    }
  };

  const onSelect = (keys: React.Key[], info: any) => {
    setSelectedKeys(keys);
    const key = keys[0] as string;
    const node = info.node;

    if (!key) {
      setSelectedNodeInfo(null);
      fetchCompanies({ keyword: searchText });
      return;
    }

    setSelectedNodeInfo({ title: node.title as string, key: key });

    if (String(key).startsWith("stage_")) {
      fetchCompanies({ keyword: searchText, stageKey: key });
    } else {
      fetchCompanies({ keyword: searchText, tagId: key });
    }
  };

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

  const findParentStageColor = (nodeKey: string): string => {
    // 简单逻辑：遍历根节点，看当前key是否在某个根节点的子孙中
    // 由于这里只有 treeData，且是扁平化渲染，更严谨的做法是遍历 treeData 查找路径
    // 为了简化性能，我们尝试从顶级节点判断
    for (const root of treeData) {
      if (root.key === nodeKey) return STAGE_COLORS[root.key as string];
      // 如果需要深度查找，这里可以扩展递归。目前仅对根节点着色，子节点保持统一或淡色
      if (root.children) {
        // 简易检查：如果当前选中项在这个 root 下，返回该 root 的颜色
        // (实际项目中可用更精准的树路径查找)
        const hasChild = (nodes: any[], targetKey: string): boolean => {
          return nodes.some(
            (n) =>
              n.key === targetKey ||
              (n.children && hasChild(n.children, targetKey)),
          );
        };
        if (hasChild(root.children as any[], nodeKey))
          return STAGE_COLORS[root.key as string];
      }
    }
    return token.colorPrimary;
  };

  // 树节点渲染器
  const titleRender = (node: any) => {
    const isSelected = selectedKeys.includes(node.key);
    const isStage = String(node.key).startsWith("stage_");

    // 确定颜色
    let activeColor = token.colorPrimary;
    if (isStage) {
      activeColor = STAGE_COLORS[node.key] || token.colorPrimary;
    } else if (isSelected) {
      // 尝试继承 Stage 颜色，或者直接用主色
      activeColor = findParentStageColor(node.key as string);
    }

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          padding: isStage ? "14px 16px" : "10px 12px", // 增加内边距，更宽敞
          margin: "6px 0",
          borderRadius: 8,
          // 选中态样式增强
          border: isSelected
            ? `1px solid ${activeColor}`
            : "1px solid transparent",
          background: isSelected
            ? isStage
              ? STAGE_BG_COLORS[node.key]
              : "#f0f7ff"
            : isStage
              ? "#fafafa"
              : "transparent",
          // 悬停效果在 CSS 中处理，这里只处理静态样式
          cursor: "pointer",
          transition: "all 0.3s",
          boxShadow:
            isStage && !isSelected ? "0 1px 2px rgba(0,0,0,0.03)" : "none",
        }}
      >
        <Space size={10}>
          {isStage ? (
            <DeploymentUnitOutlined
              style={{ color: activeColor, fontSize: 18 }}
            />
          ) : (
            // 子节点使用小圆点，选中时变色
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: isSelected ? activeColor : "#d9d9d9",
                border: isSelected ? `2px solid ${activeColor}` : "none",
              }}
            />
          )}
          <Text
            strong={isStage || isSelected}
            style={{
              color: isSelected ? activeColor : "#262626",
              fontSize: isStage ? 16 : 14,
            }}
          >
            {node.title}
          </Text>
        </Space>

        {/* 数量 Badge */}
        {node.count > 0 && (
          <Tag
            bordered={false}
            color={isSelected ? activeColor : "default"}
            style={{
              margin: 0,
              borderRadius: 12,
              padding: "0 8px",
              color: isSelected ? "#fff" : "#8c8c8c",
            }}
          >
            {node.count}
          </Tag>
        )}
      </div>
    );
  };

  return (
    <Layout style={{ height: "calc(100vh - 64px - 50px)", background: "#fff" }}>
      {/* --- 左侧：宽敞的产业链树谱 (450px) --- */}
      <Sider
        width={450}
        style={{
          background: "#fff",
          borderRight: "1px solid #f0f0f0",
          overflowY: "auto",
          padding: "24px 20px", // 增加内边距
        }}
        theme="light"
      >
        <div style={{ marginBottom: 24, paddingLeft: 8 }}>
          <Title level={4} style={{ margin: "0 0 8px 0", color: "#1f1f1f" }}>
            产业链树谱
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            <NodeIndexOutlined style={{ marginRight: 6 }} />
            点击标签可展开，点击标签左上角 - 号可收回
          </Text>
        </div>

        {loadingTree ? (
          <div style={{ textAlign: "center", marginTop: 60 }}>
            <Spin tip="加载产业结构..." size="large" />
          </div>
        ) : (
          <Tree
            blockNode
            showLine={{ showLeafIcon: false }}
            expandAction="click"
            treeData={treeData}
            selectedKeys={selectedKeys}
            expandedKeys={expandedKeys}
            onExpand={setExpandedKeys}
            onSelect={onSelect}
            titleRender={titleRender}
            style={{ background: "transparent" }}
            height={800} // 开启虚拟滚动优化性能
          />
        )}
      </Sider>

      {/* --- 右侧：内容区 --- */}
      <Content
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          background: "#f7f8fa", // 略微加深的背景色，提升白卡片的对比度
        }}
      >
        {/* 1. 顶部：Hero 风格搜索区 */}
        <div
          style={{
            padding: "48px 64px 40px",
            // 渐变背景，增加质感
            background: "linear-gradient(180deg, #ffffff 0%, #f0f5ff 100%)",
            borderBottom: "1px solid #e6ebf1",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div style={{ width: "100%", maxWidth: 800 }}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <Title level={3} style={{ color: "#262626", marginBottom: 8 }}>
                {selectedNodeInfo ? (
                  <>
                    正在搜索{" "}
                    <span style={{ color: token.colorPrimary }}>
                      {selectedNodeInfo.title}
                    </span>{" "}
                    行业
                  </>
                ) : (
                  "全产业链企业数据库搜索"
                )}
              </Title>
              <Text type="secondary">已收录朝阳区数据，支持多维度高级筛选</Text>
            </div>

            {/* 搜索框主体 */}
            <div
              style={{
                boxShadow: "0 8px 24px rgba(22, 119, 255, 0.12)",
                borderRadius: 8,
              }}
            >
              <Input.Search
                placeholder="输入企业名称、经营范围、产品关键词..."
                allowClear
                enterButton={
                  <Button
                    type="primary"
                    size="large"
                    style={{ padding: "0 40px", fontSize: 16, fontWeight: 500 }}
                  >
                    全局搜索
                  </Button>
                }
                size="large"
                onSearch={onSearch}
                style={{ width: "100%", height: 56 }}
                // 自定义 Input 样式
                styles={{ input: { height: 56, fontSize: 16 } }}
              />
            </div>

            {/* 常用筛选 Tag 组 */}
            <div
              style={{
                marginTop: 24,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 16,
              }}
            >
              <Text type="secondary" style={{ fontSize: 13 }}>
                快速筛选：
              </Text>
              <Select
                defaultValue="all_capital"
                variant="filled"
                size="middle"
                style={{ width: 140, borderRadius: 6 }}
              >
                <Select.Option value="all_capital">注册资本不限</Select.Option>
                <Select.Option value="1000w">1000万以上</Select.Option>
                <Select.Option value="5000w">5000万以上</Select.Option>
              </Select>
              <Select
                defaultValue="all_status"
                variant="filled"
                size="middle"
                style={{ width: 140, borderRadius: 6 }}
              >
                <Select.Option value="all_status">全部状态</Select.Option>
                <Select.Option value="active">在业/存续</Select.Option>
              </Select>
              <Button type="link" icon={<FilterOutlined />}>
                更多高级选项
              </Button>
            </div>
          </div>
        </div>

        {/* 2. 底部：结果列表 */}
        <div style={{ flex: 1, padding: "32px 64px", overflowY: "auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 20,
              alignItems: "center",
            }}
          >
            <Space>
              <Text strong style={{ fontSize: 18, color: "#262626" }}>
                搜索结果
              </Text>
              <Badge
                count={companyList.length}
                overflowCount={999}
                style={{ backgroundColor: "#52c41a" }}
              />
            </Space>
            <Space>
              <Button icon={<BarsOutlined />} type="text" />
              <Button
                icon={<AppstoreOutlined />}
                type="text"
                style={{ color: token.colorPrimary }}
              />
            </Space>
          </div>

          {loadingList ? (
            <div style={{ textAlign: "center", marginTop: 80 }}>
              <Spin size="large" tip="正在查询数据..." />
            </div>
          ) : (
            <List
              grid={{ gutter: 24, xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 4 }}
              dataSource={companyList}
              locale={{
                emptyText: (
                  <Empty
                    description="暂无符合条件的企业"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                ),
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
                    style={{
                      borderRadius: 12,
                      border: "none",
                      // 增加卡片阴影
                      boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
                      overflow: "hidden",
                    }}
                    bodyStyle={{
                      padding: 24,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {/* 卡片顶部彩色装饰条 */}
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 4,
                        background: token.colorPrimary,
                      }}
                    />

                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        marginBottom: 16,
                      }}
                    >
                      <div
                        style={{
                          width: 52,
                          height: 52,
                          background: "#f0f5ff",
                          borderRadius: 10,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: token.colorPrimary,
                          marginRight: 16,
                          flexShrink: 0,
                          border: "1px solid #d6e4ff",
                        }}
                      >
                        <BankOutlined style={{ fontSize: 26 }} />
                      </div>
                      <div style={{ flex: 1, overflow: "hidden" }}>
                        <Text
                          strong
                          style={{
                            fontSize: 16,
                            display: "block",
                            marginBottom: 6,
                            color: "#1f1f1f",
                          }}
                          ellipsis
                        >
                          {item.company_name}
                        </Text>
                        <Space size={6}>
                          {/* 使用更生动的标签颜色 */}
                          <Tag
                            color="cyan"
                            style={{ margin: 0, fontSize: 11, border: "none" }}
                          >
                            科技型中小企业
                          </Tag>
                        </Space>
                      </div>
                    </div>

                    <Paragraph
                      type="secondary"
                      ellipsis={{ rows: 2 }}
                      style={{
                        fontSize: 13,
                        flex: 1,
                        minHeight: 42,
                        marginBottom: 20,
                        color: "#666",
                      }}
                    >
                      {item.raw_variants
                        ? `别名/曾用名: ${item.raw_variants}`
                        : "暂无更多描述信息，点击查看详情..."}
                    </Paragraph>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderTop: "1px solid #f0f0f0",
                        paddingTop: 16,
                        marginTop: "auto",
                      }}
                    >
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        ID:{" "}
                        <span style={{ fontFamily: "monospace" }}>
                          {item.company_id}
                        </span>
                      </Text>
                      <Button
                        type="text"
                        size="small"
                        style={{
                          padding: 0,
                          color: token.colorPrimary,
                          fontWeight: 500,
                        }}
                      >
                        企业画像 <RightOutlined style={{ fontSize: 10 }} />
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
