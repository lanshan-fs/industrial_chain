import React, { useState, useEffect, useRef } from "react";
import {
  Layout,
  Tree,
  List,
  Card,
  Tag,
  Typography,
  Space,
  Button,
  theme,
  Empty,
  Spin,
  Grid,
  Row,
  Col,
  Divider,
  Dropdown,
  Avatar,
} from "antd";
import type { MenuProps } from "antd";
import {
  DeploymentUnitOutlined,
  LeftOutlined,
  RightOutlined,
  UserOutlined,
  BankOutlined,
  EnvironmentOutlined,
  SafetyCertificateOutlined,
  ExportOutlined,
  SortAscendingOutlined,
  GlobalOutlined,
  PhoneOutlined,
  MailOutlined,
  ArrowRightOutlined,
  DownOutlined,
  ShopOutlined,
  RiseOutlined,
  CrownOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import type { DataNode } from "antd/es/tree";
import { FILTER_CONFIG } from "../AdvancedSearch/constants";

const { Sider, Content } = Layout;
const { Title, Text, Link } = Typography;
const { useBreakpoint } = Grid;

// 增强色彩
const STAGE_COLORS: Record<string, string> = {
  stage_上游: "#1677ff", // 科技蓝
  stage_中游: "#13c2c2", // 智造青
  stage_下游: "#fa8c16", // 服务橙
};

// 使用更明显的淡色背景，增强树谱的区块感
const STAGE_BG_COLORS: Record<string, string> = {
  stage_上游: "#f0f5ff",
  stage_中游: "#e6fffb",
  stage_下游: "#fff7e6",
};

// 边框色，用于节点左侧装饰
const STAGE_BORDER_COLORS: Record<string, string> = {
  stage_上游: "#adc6ff",
  stage_中游: "#87e8de",
  stage_下游: "#ffd591",
};

const LOGO_COLORS = [
  "#1677ff",
  "#722ed1",
  "#fa8c16",
  "#13c2c2",
  "#f5222d",
  "#52c41a",
];

const IndustryClass: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = theme.useToken();
  const screens = useBreakpoint();

  // --- State ---
  const [loadingTree, setLoadingTree] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [companyList, setCompanyList] = useState<any[]>([]);
  const [preciseList, setPreciseList] = useState<any[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);

  // Stats
  const [searchTime, setSearchTime] = useState(0.0);
  const [totalResult, setTotalResult] = useState(0);
  const [sortLabel, setSortLabel] = useState("默认排序");

  // Scroll Refs
  const scrollRef = useRef<HTMLDivElement>(null);

  // --- Initialization ---
  useEffect(() => {
    fetchTree();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const keyword = params.get("keyword") || "";
    const tagId = params.get("tagId");
    const stageKey = params.get("stageKey");
    const advanced = params.get("advanced");
    const filterData = params.get("filterData");

    if (tagId) setSelectedKeys([tagId]);
    if (stageKey) setSelectedKeys([stageKey]);

    const queryParams: any = { keyword };
    if (tagId) queryParams.tagId = tagId;
    if (stageKey) queryParams.stageKey = stageKey;
    if (advanced === "true" && filterData) {
      queryParams.filterData = filterData;
    }

    fetchCompanies(queryParams);
  }, [location.search]);

  const fetchTree = async () => {
    setLoadingTree(true);
    try {
      const res = await fetch("http://localhost:3001/api/industry/tree");
      const json = await res.json();
      if (json.success) {
        setTreeData(json.data);
        setExpandedKeys(json.data.map((d: any) => d.key));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTree(false);
    }
  };

  const fetchCompanies = async (params: any) => {
    setLoadingList(true);
    const startTime = performance.now();
    try {
      const query = new URLSearchParams();
      Object.keys(params).forEach((key) => {
        if (params[key]) query.append(key, params[key]);
      });

      const res = await fetch(
        `http://localhost:3001/api/industry/companies?${query.toString()}`,
      );
      const json = await res.json();

      if (json.success) {
        setCompanyList(json.data);
        setPreciseList(json.data.slice(0, 10));
        setTotalResult(json.data.length);
      } else {
        setCompanyList([]);
        setPreciseList([]);
        setTotalResult(0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      const endTime = performance.now();
      setSearchTime(parseFloat(((endTime - startTime) / 1000).toFixed(3)));
      setLoadingList(false);
    }
  };

  // --- Event Handlers ---
  const onSelect = (keys: React.Key[]) => {
    setSelectedKeys(keys);
    const key = keys[0] as string;
    const params = new URLSearchParams(location.search);

    if (key) {
      params.delete("tagId");
      params.delete("stageKey");
      if (key.startsWith("stage_")) {
        params.set("stageKey", key);
      } else {
        params.set("tagId", key);
      }
    } else {
      params.delete("tagId");
      params.delete("stageKey");
    }
    navigate(`?${params.toString()}`);
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  const handleSortChange: MenuProps["onClick"] = (e) => {
    switch (e.key) {
      case "default":
        setSortLabel("默认排序");
        break;
      case "capital_desc":
        setSortLabel("注册资本 (高->低)");
        break;
      case "date_desc":
        setSortLabel("成立日期 (晚->早)");
        break;
      case "score_desc":
        setSortLabel("评分 (高->低)");
        break;
    }
  };

  const sortItems: MenuProps["items"] = [
    { key: "default", label: "默认排序" },
    { key: "capital_desc", label: "注册资本 (高->低)" },
    { key: "date_desc", label: "成立日期 (晚->早)" },
    { key: "score_desc", label: "企业评分 (高->低)" },
  ];

  // 查找节点的父级 Stage 颜色
  const findParentStageKey = (nodeKey: string): string => {
    for (const root of treeData) {
      if (root.key === nodeKey) return root.key as string;
      if (root.children) {
        const hasChild = (nodes: any[], targetKey: string): boolean => {
          return nodes.some(
            (n) =>
              n.key === targetKey ||
              (n.children && hasChild(n.children, targetKey)),
          );
        };
        if (hasChild(root.children as any[], nodeKey))
          return root.key as string;
      }
    }
    return "";
  };

  const titleRender = (node: any) => {
    const isSelected = selectedKeys.includes(node.key);
    const isStage = String(node.key).startsWith("stage_");

    // 确定节点的颜色体系
    let stageKey = isStage
      ? (node.key as string)
      : findParentStageKey(node.key as string);
    const primaryColor = STAGE_COLORS[stageKey] || token.colorPrimary;
    const bgColor = STAGE_BG_COLORS[stageKey] || "#fafafa";
    const borderColor = STAGE_BORDER_COLORS[stageKey] || "#d9d9d9";

    // 视觉设计：每个节点都是一个小胶囊，带有左侧颜色条
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          padding: isStage ? "12px 16px" : "10px 12px",
          margin: "6px 0",
          borderRadius: 8,
          // 如果选中：深色边框 + 浅色背景；如果未选中：极浅背景 + 无边框
          background: isSelected ? "#fff" : isStage ? bgColor : "transparent",
          border: isSelected
            ? `1px solid ${primaryColor}`
            : isStage
              ? `1px solid ${borderColor}`
              : "1px solid transparent",
          boxShadow: isSelected ? `0 2px 8px ${primaryColor}33` : "none",
          cursor: "pointer",
          transition: "all 0.3s",
        }}
      >
        <Space size={10}>
          {isStage ? (
            <DeploymentUnitOutlined
              style={{ color: primaryColor, fontSize: 18 }}
            />
          ) : (
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: isSelected ? primaryColor : borderColor,
              }}
            />
          )}
          <Text
            strong={isStage || isSelected}
            style={{
              color: isSelected ? primaryColor : "#262626",
              fontSize: isStage ? 15 : 14,
            }}
          >
            {node.title}
          </Text>
        </Space>
        {node.count > 0 && (
          <Tag
            bordered={false}
            color={isSelected ? primaryColor : "default"}
            style={{
              margin: 0,
              borderRadius: 12,
              padding: "0 8px",
              fontSize: 12,
              color: isSelected ? "#fff" : "#666",
            }}
          >
            {node.count}
          </Tag>
        )}
      </div>
    );
  };

  // --- Render Sections ---

  // 1. 筛选区块
  const renderFilterSection = () => {
    const displayFilters = FILTER_CONFIG.slice(0, 3);
    return (
      <div
        style={{
          background: "#fff",
          padding: "24px 32px",
          borderBottom: "1px solid #f0f0f0",
          marginBottom: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <Space>
            <div
              style={{
                width: 4,
                height: 18,
                background: "linear-gradient(to bottom, #1677ff, #36cfc9)",
                borderRadius: 2,
              }}
            ></div>
            <Text strong style={{ fontSize: 16 }}>
              筛选条件
            </Text>
          </Space>
          <Button
            type="link"
            size="small"
            onClick={() => navigate("/advanced-search")}
          >
            更多筛选条件，试试高级搜索 <RightOutlined />
          </Button>
        </div>
        <div style={{ fontSize: 14 }}>
          {displayFilters.map((cat) =>
            cat.groups.map((group) => (
              <div
                key={group.key}
                style={{
                  display: "flex",
                  marginBottom: 16,
                  lineHeight: "28px",
                }}
              >
                <div
                  style={{
                    width: 100,
                    color: "#8c8c8c",
                    fontWeight: 500,
                    flexShrink: 0,
                  }}
                >
                  {group.name}
                </div>
                <div style={{ flex: 1 }}>
                  <Space wrap size={[8, 8]}>
                    <Tag.CheckableTag
                      checked={true}
                      onChange={() => {}}
                      style={{
                        border: "none",
                        background: "#e6f4ff",
                        color: "#1677ff",
                        fontWeight: 600,
                        padding: "2px 12px",
                        borderRadius: 4,
                      }}
                    >
                      不限
                    </Tag.CheckableTag>
                    {group.options.slice(0, 8).map((opt) => (
                      <Tag.CheckableTag
                        key={opt}
                        checked={false}
                        onChange={() => {}}
                        style={{
                          border: "none",
                          padding: "2px 12px",
                          color: "#595959",
                        }}
                      >
                        {opt}
                      </Tag.CheckableTag>
                    ))}
                  </Space>
                </div>
              </div>
            )),
          )}
        </div>
      </div>
    );
  };

  // 2. 精准结果 (启信宝风格)
  const renderPreciseBlock = () => {
    if (loadingList || preciseList.length === 0) return null;
    return (
      <div
        style={{
          background: "#fff",
          padding: "24px 32px 32px",
          borderBottom: "1px solid #f0f0f0",
          position: "relative",
        }}
      >
        <div
          style={{
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            color: "#595959",
            fontSize: 14,
          }}
        >
          {/* 统计条：使用 Tag 或 图标让数据更生动 */}
          <Space size={24}>
            <Space>
              <ShopOutlined style={{ color: "#1677ff" }} />
              <Text strong>5</Text> 家集团
            </Space>
            <Divider type="vertical" />
            <Space>
              <RiseOutlined style={{ color: "#fa8c16" }} />
              <Text strong>3</Text> 家上市公司
            </Space>
            <Divider type="vertical" />
            <Space>
              <CrownOutlined style={{ color: "#722ed1" }} />
              <Text strong>1</Text> 个品牌产品
            </Space>
          </Space>
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <Button
            shape="circle"
            icon={<LeftOutlined />}
            onClick={scrollLeft}
            style={{
              marginRight: 20,
              flexShrink: 0,
              border: "none",
              background: "#f5f5f5",
              color: "#999",
            }}
          />
          <div
            ref={scrollRef}
            style={{
              display: "flex",
              overflowX: "hidden",
              gap: 20,
              flex: 1,
              scrollBehavior: "smooth",
              padding: "8px 4px",
            }}
          >
            {preciseList.map((item, idx) => (
              <Card
                key={`precise-${item.company_id}`}
                hoverable
                onClick={() =>
                  navigate(
                    `/industry-portrait/enterprise-profile?id=${item.company_id}`,
                  )
                }
                style={{
                  minWidth: 260,
                  maxWidth: 260,
                  borderRadius: 8,
                  border: "1px solid #f0f0f0", // 极淡边框
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)", // 柔和阴影
                }}
                bodyStyle={{ padding: "20px" }}
              >
                {/* 头部：Logo + Name */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 16,
                  }}
                >
                  <Avatar
                    shape="square"
                    size={40}
                    style={{
                      backgroundColor: LOGO_COLORS[idx % LOGO_COLORS.length],
                      marginRight: 12,
                      borderRadius: 6,
                    }}
                  >
                    {item.company_name.substring(0, 1)}
                  </Avatar>
                  <div style={{ overflow: "hidden" }}>
                    <Text
                      strong
                      ellipsis
                      style={{
                        display: "block",
                        fontSize: 15,
                        marginBottom: 2,
                      }}
                    >
                      {item.company_name}
                    </Text>
                    <Tag
                      color="geekblue"
                      bordered={false}
                      style={{ margin: 0, fontSize: 10, lineHeight: "18px" }}
                    >
                      行业龙头
                    </Tag>
                  </div>
                </div>

                {/* 数据对齐展示 (Grid) */}
                <Row gutter={[8, 12]}>
                  <Col span={12}>
                    <Text
                      type="secondary"
                      style={{ fontSize: 12, display: "block" }}
                    >
                      注册资本
                    </Text>
                    <Text strong style={{ color: "#1f1f1f" }}>
                      {item.registeredCapital || "-"}
                    </Text>
                  </Col>
                  <Col span={12}>
                    <Text
                      type="secondary"
                      style={{ fontSize: 12, display: "block" }}
                    >
                      成立日期
                    </Text>
                    <Text strong style={{ color: "#1f1f1f" }}>
                      2015-05
                    </Text>
                  </Col>
                </Row>

                {/* 底部：装饰性 Link */}
                <div
                  style={{
                    marginTop: 16,
                    paddingTop: 12,
                    borderTop: "1px solid #f5f5f5",
                    textAlign: "center",
                  }}
                >
                  <Text
                    type="secondary"
                    style={{ fontSize: 12, cursor: "pointer" }}
                  >
                    查看详情 <RightOutlined style={{ fontSize: 10 }} />
                  </Text>
                </div>
              </Card>
            ))}
          </div>
          <Button
            shape="circle"
            icon={<RightOutlined />}
            onClick={scrollRight}
            style={{
              marginLeft: 20,
              flexShrink: 0,
              border: "none",
              background: "#f5f5f5",
              color: "#999",
            }}
          />
        </div>
      </div>
    );
  };

  // 3. 列表项渲染
  const renderListItem = (item: any, index: number) => {
    const avatarColor = LOGO_COLORS[index % LOGO_COLORS.length];
    return (
      <List.Item
        style={{
          padding: "48px 32px",
          background: "#fff",
          borderBottom: "1px solid #f0f0f0",
          marginBottom: 0,
          transition: "all 0.3s",
        }}
        className="list-item-hover"
      >
        <Row gutter={48} style={{ width: "100%" }} align="stretch">
          {/* 左侧：Logo 和 名称 */}
          <Col flex="480px">
            <div style={{ display: "flex", alignItems: "flex-start" }}>
              <div
                style={{
                  width: 72,
                  height: 72,
                  background: avatarColor,
                  borderRadius: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 24,
                  flexShrink: 0,
                  boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                  color: "#fff",
                  fontSize: 30,
                  fontWeight: "bold",
                }}
              >
                {item.company_name.substring(0, 1)}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    marginBottom: 16,
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 8,
                  }}
                >
                  <Link
                    strong
                    style={{ fontSize: 20, color: "#262626" }}
                    onClick={() =>
                      navigate(
                        `/industry-portrait/enterprise-profile?id=${item.company_id}`,
                      )
                    }
                  >
                    {item.company_name}
                  </Link>
                  {item.is_high_tech && (
                    <Tag color="blue" bordered={false}>
                      高新技术企业
                    </Tag>
                  )}
                  {item.risk_score > 80 && (
                    <Tag color="green" bordered={false}>
                      信用优秀
                    </Tag>
                  )}
                  <Tag bordered={false}>A级纳税人</Tag>
                </div>

                {/* 关键指标行 */}
                <Space
                  size={32}
                  style={{ fontSize: 14, color: "#595959", marginBottom: 20 }}
                >
                  <span style={{ display: "flex", alignItems: "center" }}>
                    <UserOutlined
                      style={{ color: "#1677ff", marginRight: 8, fontSize: 16 }}
                    />{" "}
                    {item.legalPerson || "王**"}
                  </span>
                  <span style={{ display: "flex", alignItems: "center" }}>
                    <BankOutlined
                      style={{ color: "#fa8c16", marginRight: 8, fontSize: 16 }}
                    />{" "}
                    {item.registeredCapital}1 万人民币
                  </span>
                  <span style={{ display: "flex", alignItems: "center" }}>
                    <GlobalOutlined
                      style={{ color: "#52c41a", marginRight: 8, fontSize: 16 }}
                    />{" "}
                    {item.establishmentDate || "2015-05-20"}
                  </span>
                </Space>

                {/* 辅助信息 */}
                <Space
                  direction="vertical"
                  size={8}
                  style={{ fontSize: 13, color: "#8c8c8c" }}
                >
                  <div>
                    统一社会信用代码：
                    <Text copyable style={{ color: "#8c8c8c" }}>
                      91110105MA00XXXXXX
                    </Text>
                  </div>
                  {/* 确保使用 EnvironmentOutlined */}
                  <div>
                    <EnvironmentOutlined style={{ marginRight: 6 }} />
                    注册地址：北京市朝阳区望京街道...
                  </div>
                </Space>
              </div>
            </div>
          </Col>

          {/* 右侧：更丰富的信息 + 底部按钮 */}
          <Col
            flex="auto"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {/* 上部分：联系方式 & 状态 */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <Space
                direction="vertical"
                size={8}
                style={{ fontSize: 13, color: "#666" }}
              >
                <Space>
                  <MailOutlined /> {item.email || "contact@company.com"}
                </Space>
                <Space>
                  <PhoneOutlined /> {item.phone || "010-88888888"}
                </Space>
                <Space>
                  <GlobalOutlined /> {item.website || "www.company.com"}
                </Space>
              </Space>

              {/* 状态标 */}
              <div>
                {item.risk_score < 60 ? (
                  <Tag
                    color="error"
                    style={{ borderRadius: 10, padding: "2px 10px" }}
                  >
                    <SafetyCertificateOutlined /> 高风险
                  </Tag>
                ) : (
                  <Tag
                    color="success"
                    style={{ borderRadius: 10, padding: "2px 10px" }}
                  >
                    存续
                  </Tag>
                )}
              </div>
            </div>

            {/* 下部分：操作按钮 (右下角) */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "flex-end",
                marginTop: 24,
              }}
            >
              <Button
                type="primary"
                size="large"
                icon={<ArrowRightOutlined />}
                iconPosition="end"
                onClick={() =>
                  navigate(
                    `/industry-portrait/enterprise-profile?id=${item.company_id}`,
                  )
                }
                style={{
                  borderRadius: 24,
                  paddingLeft: 32,
                  paddingRight: 32,
                  boxShadow: "0 4px 12px rgba(22, 119, 255, 0.3)",
                }}
              >
                查看画像
              </Button>
            </div>
          </Col>
        </Row>
      </List.Item>
    );
  };

  return (
    <Layout style={{ height: "calc(100vh - 64px)", background: "#fff" }}>
      {/* 侧边栏：增加背景色，视觉上分离 */}
      <Sider
        width={360}
        breakpoint="lg"
        collapsedWidth="0"
        style={{
          background: "#fafafa", // 浅灰背景
          borderRight: "1px solid #f0f0f0",
          overflowY: "auto",
          padding: screens.md ? "24px 20px" : "12px",
          zIndex: 2,
        }}
        theme="light"
        zeroWidthTriggerStyle={{ top: 10, left: -45 }}
      >
        <div style={{ marginBottom: 24, paddingLeft: 8 }}>
          <Title level={4} style={{ margin: "0 0 6px 0", color: "#1f1f1f" }}>
            产业链树谱
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            <DeploymentUnitOutlined style={{ marginRight: 6 }} />
            点击节点筛选，支持多级联动
          </Text>
        </div>

        {loadingTree ? (
          <div style={{ textAlign: "center", marginTop: 60 }}>
            <Spin tip="加载产业结构..." />
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

      <Content
        style={{
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          background: "#f7f8fa",
        }}
      >
        {renderPreciseBlock()}
        {renderFilterSection()}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* 列表头部功能栏 */}
          <div
            style={{
              background: "#fff",
              padding: "16px 32px",
              borderBottom: "1px solid #f0f0f0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 14 }}>
              朝阳区产业链洞察平台为您找到{" "}
              <Text strong style={{ color: token.colorPrimary, fontSize: 16 }}>
                {totalResult}
              </Text>{" "}
              个搜索结果，用时 <Text>{searchTime}</Text> 秒
            </Text>

            <Space size="middle">
              <Dropdown
                menu={{ items: sortItems, onClick: handleSortChange }}
                trigger={["click"]}
              >
                <Button icon={<SortAscendingOutlined />}>
                  {sortLabel}{" "}
                  <DownOutlined style={{ fontSize: 10, marginLeft: 4 }} />
                </Button>
              </Dropdown>
              <Button icon={<ExportOutlined />}>数据导出</Button>
            </Space>
          </div>

          <div style={{ flex: 1, background: "#fff" }}>
            {loadingList ? (
              <div style={{ textAlign: "center", padding: 80 }}>
                <Spin size="large" tip="数据查询中..." />
              </div>
            ) : (
              <List
                itemLayout="vertical"
                size="large"
                dataSource={companyList}
                renderItem={renderListItem}
                locale={{
                  emptyText: (
                    <Empty
                      description="未找到相关企业"
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      style={{ margin: "60px 0" }}
                    />
                  ),
                }}
                pagination={{
                  pageSize: 10,
                  total: totalResult,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  position: "bottom",
                  align: "center",
                  style: { padding: "32px 0" },
                }}
              />
            )}
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default IndustryClass;
