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
  message,
} from "antd";
import type { MenuProps } from "antd";
import {
  DeploymentUnitOutlined,
  LeftOutlined,
  RightOutlined,
  UserOutlined,
  BankOutlined,
  EnvironmentOutlined,
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
  UpOutlined, // 新增：用于收起图标
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import type { DataNode } from "antd/es/tree";

const { Sider, Content } = Layout;
const { Title, Text, Link } = Typography;
const { useBreakpoint } = Grid;

// --- 原版树谱颜色配置 (保持不变) ---
const STAGE_COLORS: Record<string, string> = {
  stage_上游: "#1677ff",
  stage_中游: "#13c2c2",
  stage_下游: "#fa8c16",
};
const STAGE_BG_COLORS: Record<string, string> = {
  stage_上游: "#f0f5ff",
  stage_中游: "#e6fffb",
  stage_下游: "#fff7e6",
};
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

// 随机标签颜色
const TAG_COLORS = [
  "magenta",
  "red",
  "volcano",
  "orange",
  "gold",
  "lime",
  "green",
  "cyan",
  "blue",
  "geekblue",
  "purple",
];

// --- 静态 Mock 数据 ---
const MOCK_TECH_FIELDS = [
  "人工智能",
  "大数据",
  "云计算",
  "物联网",
  "区块链",
  "5G通信",
  "数字孪生",
  "边缘计算",
  "量子计算",
  "元宇宙",
];
const MOCK_FINANCING_ROUNDS = [
  "种子轮",
  "天使轮",
  "A轮",
  "B轮",
  "C轮",
  "D轮及以上",
  "IPO上市",
  "战略融资",
  "未融资",
];

// --- 辅助组件：可折叠的筛选行 ---
const FilterRow: React.FC<{
  label: string;
  groupKey: string;
  options: string[];
  activeValue: string;
  onSelect: (key: string, val: string) => void;
}> = ({ label, groupKey, options, activeValue, onSelect }) => {
  const [expanded, setExpanded] = useState(false);
  const LIMIT = 10; // 默认显示个数
  const showExpand = options.length > LIMIT;
  const visibleOptions = expanded ? options : options.slice(0, LIMIT);

  return (
    <div style={{ display: "flex", marginBottom: 10, lineHeight: "26px" }}>
      <div
        style={{ width: 80, color: "#8c8c8c", fontWeight: 500, flexShrink: 0 }}
      >
        {label}
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <Space wrap size={[4, 4]}>
            <Tag.CheckableTag
              checked={!activeValue}
              onChange={() => onSelect(groupKey, "")}
              style={{ border: "none", padding: "1px 10px" }}
            >
              不限
            </Tag.CheckableTag>
            {visibleOptions.map((opt) => (
              <Tag.CheckableTag
                key={opt}
                checked={activeValue === opt}
                onChange={() => onSelect(groupKey, opt)}
                style={{
                  border: "none",
                  padding: "1px 10px",
                  color: activeValue === opt ? undefined : "#595959",
                }}
              >
                {opt}
              </Tag.CheckableTag>
            ))}
          </Space>
        </div>
        {showExpand && (
          <Button
            type="link"
            size="small"
            onClick={() => setExpanded(!expanded)}
            style={{
              padding: "0 8px",
              fontSize: 12,
              height: 24,
              marginLeft: 8,
            }}
          >
            {expanded ? "收起" : "更多"}{" "}
            {expanded ? <UpOutlined /> : <DownOutlined />}
          </Button>
        )}
      </div>
    </div>
  );
};

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

  // 筛选元数据
  const [metaData, setMetaData] = useState<any>({
    dictionary: {},
    scenarios: [],
    regions: { street: [], area: [] },
  });
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    {},
  );

  // Stats
  const [searchTime, setSearchTime] = useState(0.0);
  const [totalResult, setTotalResult] = useState(0);
  const [sortLabel, setSortLabel] = useState("默认排序");

  const scrollRef = useRef<HTMLDivElement>(null);

  // --- Initialization ---
  useEffect(() => {
    fetchMeta();
    fetchTree();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const keyword = params.get("keyword") || "";
    const tagId = params.get("tagId");
    const stageKey = params.get("stageKey");

    if (tagId) setSelectedKeys([tagId]);
    if (stageKey) setSelectedKeys([stageKey]);

    const queryParams: any = { keyword, tagId, stageKey };
    fetchCompanies(queryParams);
  }, [location.search]);

  // 1. 获取树谱
  const fetchTree = async () => {
    setLoadingTree(true);
    try {
      const res = await fetch("http://localhost:3001/api/industry/tree");
      const json = await res.json();
      if (json.success) {
        setTreeData(json.data);
        if (json.data && json.data.length > 0) {
          setExpandedKeys([json.data[0].key]);
        }
      }
    } catch (err) {
      console.error(err);
      message.error("加载树谱失败");
    } finally {
      setLoadingTree(false);
    }
  };

  // 2. 获取筛选元数据
  const fetchMeta = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/meta/all");
      const json = await res.json();
      if (json.success) setMetaData(json.data);
    } catch (e) {
      console.error(e);
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
      message.error("获取企业列表失败");
    } finally {
      const endTime = performance.now();
      setSearchTime(parseFloat(((endTime - startTime) / 1000).toFixed(3)));
      setLoadingList(false);
    }
  };

  // --- 原版树谱逻辑 ---
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

    let stageKey = isStage
      ? (node.key as string)
      : findParentStageKey(node.key as string);
    const primaryColor = STAGE_COLORS[stageKey] || token.colorPrimary;
    const bgColor = STAGE_BG_COLORS[stageKey] || "#fafafa";
    const borderColor = STAGE_BORDER_COLORS[stageKey] || "#d9d9d9";

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

  const onSelect = (keys: React.Key[]) => {
    setSelectedKeys(keys);
    const key = keys[0] as string;
    const params = new URLSearchParams(location.search);
    params.delete("tagId");
    params.delete("stageKey");
    if (key) {
      if (key.startsWith("stage_")) params.set("stageKey", key);
      else params.set("tagId", key);
    }
    navigate(`?${params.toString()}`);
  };

  const handleFilterClick = (groupKey: string, value: string) => {
    setActiveFilters((prev) => ({
      ...prev,
      [groupKey]: prev[groupKey] === value ? "" : value,
    }));
  };

  const scrollLeft = () =>
    scrollRef.current?.scrollBy({ left: -320, behavior: "smooth" });
  const scrollRight = () =>
    scrollRef.current?.scrollBy({ left: 320, behavior: "smooth" });

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

  // --- 1. 筛选区块 (优化：全量数据 + 展开收起) ---
  const renderFilterSection = () => {
    // 构造筛选组数据
    const filterGroups = [
      {
        key: "entType",
        name: "企业类型",
        options: (metaData.dictionary["ENT_TYPE"] || []).map(
          (i: any) => i.value,
        ),
      },
      {
        key: "techAttr",
        name: "科技属性",
        options: (metaData.dictionary["TECH_ATTR"] || []).map(
          (i: any) => i.value,
        ),
      },
      { key: "techField", name: "技术领域", options: MOCK_TECH_FIELDS },
      {
        key: "scenario",
        name: "应用场景",
        options: metaData.scenarios.map((i: any) => i.value),
      }, // 全量
      { key: "financing", name: "融资轮次", options: MOCK_FINANCING_ROUNDS },
      {
        key: "street",
        name: "街道地区",
        options: metaData.regions.street.map((i: any) => i.value),
      }, // 全量
    ];

    return (
      <div
        style={{
          background: "#fff",
          padding: "20px 32px",
          borderBottom: "1px solid #f0f0f0",
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

        <div style={{ fontSize: 13 }}>
          {filterGroups.map((group) => (
            <FilterRow
              key={group.key}
              label={group.name}
              groupKey={group.key}
              options={group.options || []}
              activeValue={activeFilters[group.key]}
              onSelect={handleFilterClick}
            />
          ))}
        </div>
      </div>
    );
  };

  // --- 2. 推荐结果 ---
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
                key={`p-${item.company_id}`}
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
                  border: "1px solid #f0f0f0",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
                bodyStyle={{ padding: "20px" }}
              >
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
                      backgroundColor: LOGO_COLORS[idx % 6],
                      marginRight: 12,
                      borderRadius: 6,
                    }}
                  >
                    {item.company_name[0]}
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
                      style={{ fontSize: 10, lineHeight: "18px", margin: 0 }}
                    >
                      行业龙头
                    </Tag>
                  </div>
                </div>
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

  // --- 3. 列表项 ---
  const renderListItem = (item: any, index: number) => {
    return (
      <List.Item
        style={{
          padding: "32px",
          background: "#fff",
          borderBottom: "1px solid #f0f0f0",
        }}
        className="list-item-hover"
      >
        <Row gutter={24} style={{ width: "100%" }}>
          <Col span={15} style={{ borderRight: "1px dashed #f0f0f0" }}>
            <div style={{ display: "flex", alignItems: "flex-start" }}>
              <div
                style={{
                  width: 68,
                  height: 68,
                  background: LOGO_COLORS[index % 6],
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 20,
                  color: "#fff",
                  fontSize: 28,
                  fontWeight: "bold",
                  flexShrink: 0,
                }}
              >
                {item.company_name[0]}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    marginBottom: 10,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    flexWrap: "wrap",
                  }}
                >
                  <Link
                    strong
                    style={{ fontSize: 18, color: "#262626" }}
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
                      高新
                    </Tag>
                  )}
                  {item.risk_score > 80 && (
                    <Tag color="green" bordered={false}>
                      信用优
                    </Tag>
                  )}
                </div>
                <Row gutter={16} style={{ marginBottom: 12 }}>
                  <Col span={8}>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      法定代表人
                    </Text>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: 2,
                      }}
                    >
                      <UserOutlined
                        style={{ color: token.colorPrimary, marginRight: 6 }}
                      />
                      <Text>{item.legalPerson || "-"}</Text>
                    </div>
                  </Col>
                  <Col span={8}>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      注册资本
                    </Text>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: 2,
                      }}
                    >
                      <BankOutlined
                        style={{ color: "#fa8c16", marginRight: 6 }}
                      />
                      <Text>{item.registeredCapital}</Text>
                    </div>
                  </Col>
                  <Col span={8}>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      成立日期
                    </Text>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: 2,
                      }}
                    >
                      <GlobalOutlined
                        style={{ color: "#52c41a", marginRight: 6 }}
                      />
                      <Text>{item.establishmentDate?.substring(0, 7)}</Text>
                    </div>
                  </Col>
                </Row>
                <div style={{ fontSize: 13, color: "#8c8c8c" }}>
                  <EnvironmentOutlined style={{ marginRight: 6 }} />
                  注册地址：北京市朝阳区望京街道...
                </div>
              </div>
            </div>
          </Col>

          <Col
            span={9}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              paddingLeft: 24,
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <Text type="secondary" style={{ fontSize: 12 }}>
                  企业标签
                </Text>
                <Tag color="cyan" style={{ margin: 0 }}>
                  {item.financing_round}
                </Tag>
              </div>
              <Space size={[6, 6]} wrap style={{ minHeight: 60 }}>
                {(item.tags || [])
                  .slice(0, 8)
                  .map((tag: string, tIdx: number) => (
                    <Tag
                      key={tIdx}
                      color={
                        TAG_COLORS[
                          Math.floor(Math.random() * TAG_COLORS.length)
                        ]
                      }
                      style={{ cursor: "pointer", borderRadius: 2, margin: 0 }}
                      onClick={() =>
                        navigate(`/advanced-search?keyword=${tag}`)
                      }
                    >
                      {tag}
                    </Tag>
                  ))}
              </Space>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                marginTop: 12,
              }}
            >
              <Space
                direction="vertical"
                size={2}
                style={{ fontSize: 12, color: "#999" }}
              >
                <span>
                  <PhoneOutlined /> {item.phone}
                </span>
                <span>
                  <MailOutlined /> {item.email}
                </span>
              </Space>
              <Button
                type="primary"
                ghost
                size="middle"
                icon={<ArrowRightOutlined />}
                iconPosition="end"
                onClick={() =>
                  navigate(
                    `/industry-portrait/enterprise-profile?id=${item.company_id}`,
                  )
                }
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
      <Sider
        width={360}
        breakpoint="lg"
        collapsedWidth="0"
        style={{
          background: "#fafafa",
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
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <Spin />
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

      {/* 优化点：Content 背景色改回 #fff 以去除底部灰边，并确保内部组件铺满 */}
      <Content
        style={{
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          background: "#fff",
        }}
      >
        {renderPreciseBlock()}
        {renderFilterSection()}

        <div style={{ flex: 1, background: "#fff", padding: "0 24px" }}>
          <div
            style={{
              padding: "16px 0",
              borderBottom: "1px solid #f0f0f0",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Text>
              共找到{" "}
              <Text strong style={{ color: token.colorPrimary }}>
                {totalResult}
              </Text>{" "}
              家企业， 用时 <Text>{searchTime}</Text> 秒
            </Text>
            <Space>
              <Dropdown
                menu={{ items: sortItems, onClick: handleSortChange }}
                trigger={["click"]}
              >
                {/* 优化点：按钮改为 text 类型，视觉更轻量 */}
                <Button type="text" icon={<SortAscendingOutlined />}>
                  {sortLabel} <DownOutlined />
                </Button>
              </Dropdown>
              <Button type="text" icon={<ExportOutlined />}>
                导出数据
              </Button>
            </Space>
          </div>

          {loadingList ? (
            <div style={{ textAlign: "center", padding: 60 }}>
              <Spin tip="搜索中..." />
            </div>
          ) : (
            <List
              itemLayout="vertical"
              dataSource={companyList}
              renderItem={renderListItem}
              locale={{ emptyText: <Empty description="暂无符合条件的企业" /> }}
              pagination={{
                pageSize: 10,
                total: totalResult,
                align: "center",
                showSizeChanger: true,
              }}
            />
          )}
        </div>
      </Content>
    </Layout>
  );
};

export default IndustryClass;
