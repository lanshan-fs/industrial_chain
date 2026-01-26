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
  Grid,
  Modal,
  Form,
  Row,
  Col,
} from "antd";
import {
  BankOutlined,
  DeploymentUnitOutlined,
  RightOutlined,
  FilterOutlined,
  AppstoreOutlined,
  BarsOutlined,
  NodeIndexOutlined,
  SearchOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type { DataNode } from "antd/es/tree";

const { Sider, Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;

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

// 搜索主题选项
const SEARCH_SUBJECTS = [
  { label: "企业名称", value: "company_name" },
  { label: "行业标签", value: "tag" },
  { label: "企业信用代码", value: "credit_code" },
  { label: "法定代表人", value: "legal_person" },
  { label: "经营范围", value: "business_scope" },
];

const IndustryClass: React.FC = () => {
  const navigate = useNavigate();
  const { token } = theme.useToken();
  const screens = useBreakpoint();

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

  // Search State
  const [searchText, setSearchText] = useState("");
  const [searchType, setSearchType] = useState("company_name"); // 默认搜索主题
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

  // Advanced Search Modal State
  const [isAdvancedModalVisible, setIsAdvancedModalVisible] = useState(false);
  const [advancedForm] = Form.useForm();

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
    searchType?: string; // 新增搜索类型参数
    tagId?: string;
    stageKey?: string;
  }) => {
    setLoadingList(true);
    try {
      const query = new URLSearchParams();
      if (params.keyword) query.append("keyword", params.keyword);
      if (params.searchType) query.append("type", params.searchType); // 传递给后端的类型参数
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
      fetchCompanies({ keyword: searchText, searchType });
      return;
    }

    setSelectedNodeInfo({ title: node.title as string, key: key });

    if (String(key).startsWith("stage_")) {
      fetchCompanies({ keyword: searchText, searchType, stageKey: key });
    } else {
      fetchCompanies({ keyword: searchText, searchType, tagId: key });
    }
  };

  // 普通搜索触发
  const handleSearch = () => {
    const currentKey = selectedKeys[0] as string;
    const isStage = currentKey?.startsWith("stage_");

    fetchCompanies({
      keyword: searchText,
      searchType: searchType,
      stageKey: isStage ? currentKey : undefined,
      tagId: !isStage && currentKey ? currentKey : undefined,
    });
  };

  // 高级搜索提交
  const handleAdvancedSearch = () => {
    advancedForm.validateFields().then((values) => {
      console.log("Advanced Search Values:", values);
      // 这里构建复杂查询逻辑，暂时仅演示 UI 交互并关闭弹窗
      // 实际开发中会将 values 序列化传给后端接口
      setIsAdvancedModalVisible(false);
      message.loading("正在执行高级逻辑检索...", 1).then(() => {
        fetchCompanies({ keyword: values.conditions?.[0]?.value || "" }); // 简单回落演示
      });
    });
  };

  const findParentStageColor = (nodeKey: string): string => {
    for (const root of treeData) {
      if (root.key === nodeKey) return STAGE_COLORS[root.key as string];
      if (root.children) {
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

    let activeColor = token.colorPrimary;
    if (isStage) {
      activeColor = STAGE_COLORS[node.key] || token.colorPrimary;
    } else if (isSelected) {
      activeColor = findParentStageColor(node.key as string);
    }

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          padding: isStage ? "14px 16px" : "10px 12px",
          margin: "6px 0",
          borderRadius: 8,
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
      {/* --- 左侧：宽敞的产业链树谱 (自适应) --- */}
      <Sider
        width={450} // PC端宽度
        breakpoint="lg"
        collapsedWidth="0"
        style={{
          background: "#fff",
          borderRight: "1px solid #f0f0f0",
          overflowY: "auto",
          padding: screens.md ? "24px 20px" : "12px",
          zIndex: 2,
        }}
        theme="light"
        zeroWidthTriggerStyle={{ top: 10, left: -45 }}
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
            height={screens.md ? 800 : 600}
          />
        )}
      </Sider>

      {/* --- 右侧：内容区 --- */}
      <Content
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          background: "#f7f8fa",
        }}
      >
        {/* 1. 顶部：Hero 风格搜索区 (改造后) */}
        <div
          style={{
            padding: screens.md ? "48px 64px 40px" : "24px 20px",
            background: "linear-gradient(180deg, #ffffff 0%, #f0f5ff 100%)",
            borderBottom: "1px solid #e6ebf1",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div style={{ width: "100%", maxWidth: 900 }}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <Title
                level={screens.md ? 3 : 4}
                style={{ color: "#262626", marginBottom: 8 }}
              >
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
              <Text type="secondary">
                已收录朝阳区数据，支持组合逻辑高级筛选
              </Text>
            </div>

            {/* --- 核心改造：组合式搜索栏 (参考 CNKI Overseas) --- */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Space.Compact
                size="large"
                style={{
                  width: "100%",
                  maxWidth: 700,
                  boxShadow: "0 8px 24px rgba(22, 119, 255, 0.12)",
                  borderRadius: 8,
                }}
              >
                <Select
                  defaultValue="company_name"
                  options={SEARCH_SUBJECTS}
                  value={searchType}
                  onChange={setSearchType}
                  style={{ width: 140 }}
                  // 强制左侧圆角
                  suffixIcon={<FilterOutlined />}
                />
                <Input
                  placeholder="请输入检索词..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onPressEnter={handleSearch}
                  allowClear
                  style={{ width: "calc(100% - 240px)" }}
                />
                <Button
                  type="primary"
                  onClick={handleSearch}
                  icon={<SearchOutlined />}
                  style={{ width: 100 }}
                >
                  搜索
                </Button>
              </Space.Compact>

              {/* 高级搜索入口 */}
              <Button
                type="link"
                onClick={() => setIsAdvancedModalVisible(true)}
                style={{ marginLeft: 16, fontSize: 14 }}
              >
                高级搜索
              </Button>
            </div>

            {/* 常用筛选 Tag 组 */}
            <div
              style={{
                marginTop: 24,
                display: "flex",
                flexWrap: "wrap",
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
            </div>
          </div>
        </div>

        {/* 2. 底部：结果列表 */}
        <div
          style={{
            flex: 1,
            padding: screens.md ? "32px 64px" : "20px 16px",
            overflowY: "auto",
          }}
        >
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

      {/* --- 高级搜索模态框 --- */}
      <Modal
        title="高级检索 (Advanced Search)"
        open={isAdvancedModalVisible}
        onCancel={() => setIsAdvancedModalVisible(false)}
        onOk={handleAdvancedSearch}
        width={800}
        okText="执行检索"
        cancelText="取消"
      >
        <div style={{ marginBottom: 16, color: "#666" }}>
          支持使用 AND、OR、NOT 逻辑运算符构建复杂的检索表达式。
        </div>
        <Form
          form={advancedForm}
          name="advanced_search"
          initialValues={{
            conditions: [{ logic: "AND", field: "company_name", value: "" }],
          }}
        >
          <Form.List name="conditions">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }, index) => (
                  <Row
                    key={key}
                    gutter={12}
                    align="middle"
                    style={{ marginBottom: 12 }}
                  >
                    <Col span={4}>
                      {index === 0 ? (
                        <div
                          style={{
                            textAlign: "center",
                            fontWeight: "bold",
                            color: "#999",
                          }}
                        >
                          基准条件
                        </div>
                      ) : (
                        <Form.Item
                          {...restField}
                          name={[name, "logic"]}
                          noStyle
                          initialValue="AND"
                        >
                          <Select style={{ width: "100%" }}>
                            <Select.Option value="AND">AND (与)</Select.Option>
                            <Select.Option value="OR">OR (或)</Select.Option>
                            <Select.Option value="NOT">NOT (非)</Select.Option>
                          </Select>
                        </Form.Item>
                      )}
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        {...restField}
                        name={[name, "field"]}
                        noStyle
                        initialValue="company_name"
                      >
                        <Select
                          style={{ width: "100%" }}
                          options={SEARCH_SUBJECTS}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item {...restField} name={[name, "value"]} noStyle>
                        <Input placeholder="输入检索词" />
                      </Form.Item>
                    </Col>
                    <Col span={2}>
                      {index > 0 && (
                        <DeleteOutlined
                          onClick={() => remove(name)}
                          style={{
                            color: "#ff4d4f",
                            cursor: "pointer",
                            fontSize: 16,
                          }}
                        />
                      )}
                    </Col>
                  </Row>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                    style={{ marginTop: 8 }}
                  >
                    添加检索条件
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </Layout>
  );
};

export default IndustryClass;
