import React, { useState, useMemo, useEffect } from "react";
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
  Select,
  Divider,
} from "antd";
import {
  ApartmentOutlined,
  RightOutlined,
  BankOutlined,
  FilterOutlined,
  AppstoreOutlined,
  BarsOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type { DataNode } from "antd/es/tree";

const { Sider, Content } = Layout;
const { Title, Text, Paragraph } = Typography;

// ------------------------------------------------------------------
// 1. Mock Data (模拟您提供的 SQL/JSON 数据结构)
// ------------------------------------------------------------------

// 模拟 tags.json
const MOCK_TAGS = [
  {
    tag_id: "root_medical_service",
    level: 0,
    tag_name: "医疗服务",
    parent_tag_id: null,
  },
  {
    tag_id: "root_digital_medical",
    level: 0,
    tag_name: "数字医疗",
    parent_tag_id: null,
  },
  { tag_id: "root_drugs", level: 0, tag_name: "医药制造", parent_tag_id: null },

  // 医疗服务子集
  {
    tag_id: "0164ec5fb30370c579aac628acbf8dd9",
    level: 1,
    tag_name: "保险支付",
    parent_tag_id: "root_medical_service",
  },
  {
    tag_id: "tag_hospital_mgmt",
    level: 1,
    tag_name: "医院管理",
    parent_tag_id: "root_medical_service",
  },
  {
    tag_id: "72f9fa8e635aa810b9f8a06a60ee86e3",
    level: 2,
    tag_name: "商业保险",
    parent_tag_id: "0164ec5fb30370c579aac628acbf8dd9",
  },
  {
    tag_id: "b5725e4b6419d6e4de5d9d4b32548bd9",
    level: 3,
    tag_name: "健康险产品",
    parent_tag_id: "72f9fa8e635aa810b9f8a06a60ee86e3",
  },
  {
    tag_id: "006372c8f86c3f774712685f6af2ec39",
    level: 4,
    tag_name: "专科保险",
    parent_tag_id: "b5725e4b6419d6e4de5d9d4b32548bd9",
  },

  // 数字医疗子集
  {
    tag_id: "0f8e8ac82da4be066fc48f10ed76b10a",
    level: 1,
    tag_name: "智慧医疗",
    parent_tag_id: "root_digital_medical",
  },
  {
    tag_id: "e288a831f44fff55603203eaa6cb41c3",
    level: 1,
    tag_name: "互联网+健康",
    parent_tag_id: "root_digital_medical",
  },
  {
    tag_id: "159884140ccb58fcba80ebd9b3bb3ad6",
    level: 2,
    tag_name: "互联网保险",
    parent_tag_id: "e288a831f44fff55603203eaa6cb41c3",
  },
  {
    tag_id: "119cd8636b56670cfe520a002a378769",
    level: 4,
    tag_name: "AI客服与理赔",
    parent_tag_id: "159884140ccb58fcba80ebd9b3bb3ad6",
  },

  // 医药制造子集
  {
    tag_id: "0b812a08ccdce06e9ed512b26a330779",
    level: 1,
    tag_name: "化学制药",
    parent_tag_id: "root_drugs",
  },
  {
    tag_id: "root_devices_l1",
    level: 1,
    tag_name: "医疗器械",
    parent_tag_id: "root_drugs",
  },
];

// 模拟 companies.json
const MOCK_COMPANIES = [
  {
    company_id: "c1",
    company_name: "平安健康险",
    reg_capital: "3000万",
    status: "存续",
    desc: "专业的健康保险服务提供商",
  },
  {
    company_id: "c2",
    company_name: "众安保险",
    reg_capital: "10亿",
    status: "存续",
    desc: "互联网保险科技公司，利用大数据进行核保",
  },
  {
    company_id: "c3",
    company_name: "圆心科技",
    reg_capital: "500万",
    status: "存续",
    desc: "AI客户管家、理赔材料审核",
  },
  {
    company_id: "c4",
    company_name: "恒瑞医药",
    reg_capital: "60亿",
    status: "存续",
    desc: "创新小分子药研发，抗肿瘤药物领导者",
  },
  {
    company_id: "c5",
    company_name: "卫宁健康",
    reg_capital: "20亿",
    status: "存续",
    desc: "智慧医疗信息化解决方案，HIS系统服务商",
  },
  {
    company_id: "c6",
    company_name: "京东健康",
    reg_capital: "50亿",
    status: "存续",
    desc: "互联网医疗与药品零售，在线问诊平台",
  },
  {
    company_id: "c7",
    company_name: "迈瑞医疗",
    reg_capital: "12亿",
    status: "存续",
    desc: "全球领先的医疗器械与解决方案供应商",
  },
  {
    company_id: "c8",
    company_name: "泰康在线",
    reg_capital: "40亿",
    status: "存续",
    desc: "互联网财产保险公司",
  },
  {
    company_id: "c9",
    company_name: "医渡科技",
    reg_capital: "1亿",
    status: "存续",
    desc: "医疗大数据技术平台",
  },
];

// 模拟 companies_tags_map.json
const MOCK_RELATIONS = [
  { company_id: "c1", tag_id: "006372c8f86c3f774712685f6af2ec39" },
  { company_id: "c1", tag_id: "72f9fa8e635aa810b9f8a06a60ee86e3" },
  { company_id: "c2", tag_id: "006372c8f86c3f774712685f6af2ec39" },
  { company_id: "c2", tag_id: "159884140ccb58fcba80ebd9b3bb3ad6" },
  { company_id: "c3", tag_id: "119cd8636b56670cfe520a002a378769" },
  { company_id: "c4", tag_id: "0b812a08ccdce06e9ed512b26a330779" },
  { company_id: "c5", tag_id: "0f8e8ac82da4be066fc48f10ed76b10a" },
  { company_id: "c6", tag_id: "159884140ccb58fcba80ebd9b3bb3ad6" },
  { company_id: "c6", tag_id: "e288a831f44fff55603203eaa6cb41c3" },
  { company_id: "c7", tag_id: "root_devices_l1" },
  { company_id: "c8", tag_id: "72f9fa8e635aa810b9f8a06a60ee86e3" },
  { company_id: "c9", tag_id: "0f8e8ac82da4be066fc48f10ed76b10a" },
];

// ------------------------------------------------------------------
// 2. 逻辑处理函数
// ------------------------------------------------------------------

// 递归获取某个节点及其所有子节点的 ID
const getAllChildKeys = (
  nodeKey: string,
  map: Record<string, any[]>,
): string[] => {
  let keys = [nodeKey];
  const children = map[nodeKey];
  if (children) {
    children.forEach((child) => {
      keys = [...keys, ...getAllChildKeys(child.tag_id, map)];
    });
  }
  return keys;
};

// 计算每个 Tag 下涉及的去重企业数量（包含子级 Tag 的企业）
const calculateCounts = () => {
  const counts: Record<string, number> = {};

  // 1. 建立父子关系 Map
  const parentToChildrenMap: Record<string, any[]> = {};
  MOCK_TAGS.forEach((tag) => {
    if (tag.parent_tag_id) {
      if (!parentToChildrenMap[tag.parent_tag_id])
        parentToChildrenMap[tag.parent_tag_id] = [];
      parentToChildrenMap[tag.parent_tag_id].push(tag);
    }
  });

  // 2. 为每个 Tag 计算数量
  MOCK_TAGS.forEach((tag) => {
    // 获取当前 Tag 及其所有子孙 Tag ID
    const allTagIds = getAllChildKeys(tag.tag_id, parentToChildrenMap);

    // 找到关联的企业 ID
    const relatedCompanyIds = new Set();
    MOCK_RELATIONS.forEach((r) => {
      if (allTagIds.includes(r.tag_id)) {
        relatedCompanyIds.add(r.company_id);
      }
    });

    counts[tag.tag_id] = relatedCompanyIds.size;
  });

  return counts;
};

// 构建 Tree 数据结构
const buildTreeData = (
  tags: any[],
  counts: Record<string, number>,
): DataNode[] => {
  const dataMap: Record<string, any> = {};
  const roots: any[] = [];

  tags.forEach((tag) => {
    dataMap[tag.tag_id] = {
      title: tag.tag_name,
      key: tag.tag_id,
      count: counts[tag.tag_id] || 0, // 注入计算出的数量
      level: tag.level,
      children: [],
    };
  });

  tags.forEach((tag) => {
    const node = dataMap[tag.tag_id];
    if (tag.parent_tag_id && dataMap[tag.parent_tag_id]) {
      dataMap[tag.parent_tag_id].children.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
};

// ------------------------------------------------------------------
// 3. 组件实现
// ------------------------------------------------------------------

const IndustryClass: React.FC = () => {
  const navigate = useNavigate();
  const { token } = theme.useToken();

  // Data State
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [tagCounts, setTagCounts] = useState<Record<string, number>>({});

  // UI State
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [searchText, setSearchText] = useState("");
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    const counts = calculateCounts();
    setTagCounts(counts);
    const tree = buildTreeData(MOCK_TAGS, counts);
    setTreeData(tree);
    // 默认展开 Level 0 和 Level 1
    const defaultExpand = MOCK_TAGS.filter((t) => t.level < 2).map(
      (t) => t.tag_id,
    );
    setExpandedKeys(defaultExpand);
  }, []);

  // 筛选逻辑
  const filteredCompanies = useMemo(() => {
    let result = MOCK_COMPANIES;

    // 1. 树筛选
    if (selectedKeys.length > 0) {
      const selectedRootKey = selectedKeys[0] as string;
      const parentToChildrenMap: Record<string, any[]> = {};
      MOCK_TAGS.forEach((tag) => {
        if (tag.parent_tag_id) {
          if (!parentToChildrenMap[tag.parent_tag_id])
            parentToChildrenMap[tag.parent_tag_id] = [];
          parentToChildrenMap[tag.parent_tag_id].push(tag);
        }
      });
      const relatedTagIds = getAllChildKeys(
        selectedRootKey,
        parentToChildrenMap,
      );
      const validCompanyIds = new Set(
        MOCK_RELATIONS.filter((r) => relatedTagIds.includes(r.tag_id)).map(
          (r) => r.company_id,
        ),
      );
      result = result.filter((c) => validCompanyIds.has(c.company_id));
    }

    // 2. 文本搜索
    if (searchText.trim()) {
      const lowerKey = searchText.toLowerCase();
      result = result.filter(
        (c) =>
          c.company_name.toLowerCase().includes(lowerKey) ||
          (c.desc && c.desc.toLowerCase().includes(lowerKey)),
      );
    }

    return result;
  }, [selectedKeys, searchText]);

  // --- 自定义树节点渲染 (关键优化：长条形卡片风格) ---
  const titleRender = (node: any) => {
    const isSelected = selectedKeys.includes(node.key);

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          padding: "10px 12px",
          marginBottom: 4,
          borderRadius: 6,
          border: isSelected
            ? `1px solid ${token.colorPrimary}`
            : "1px solid #e8e8e8",
          background: isSelected ? token.colorPrimaryBg : "#fff",
          transition: "all 0.2s",
          boxShadow: isSelected ? "0 2px 8px rgba(0,0,0,0.05)" : "none",
        }}
      >
        <Space>
          {/* 根据层级显示不同图标或缩进感 */}
          {node.level === 0 ? (
            <AppstoreOutlined style={{ color: token.colorPrimary }} />
          ) : (
            <ApartmentOutlined style={{ opacity: 0.6 }} />
          )}
          <Text
            strong={node.level === 0}
            style={{
              color: isSelected ? token.colorPrimary : "inherit",
              fontSize: node.level === 0 ? 15 : 14,
            }}
          >
            {node.title}
          </Text>
        </Space>

        <Tag
          color={isSelected ? "blue" : "default"}
          style={{
            borderRadius: 10,
            marginRight: 0,
            border: "none",
            background: isSelected ? "rgba(255,255,255,0.5)" : "#f5f5f5",
          }}
        >
          {node.count} 家
        </Tag>
      </div>
    );
  };

  return (
    <Layout style={{ height: "calc(100vh - 64px - 50px)", background: "#fff" }}>
      {/* --- 左侧：宽幅产业链树谱 (380px) --- */}
      <Sider
        width={380}
        style={{
          background: "#fafafa",
          borderRight: "1px solid #f0f0f0",
          overflowY: "auto",
          padding: "20px 16px",
        }}
        theme="light"
      >
        <div style={{ marginBottom: 20, paddingLeft: 4 }}>
          <Title level={4} style={{ marginBottom: 4 }}>
            产业链分类树谱
          </Title>
          <Text type="secondary">点击节点筛选，数字代表关联企业总数</Text>
        </div>

        <Tree
          treeData={treeData}
          selectedKeys={selectedKeys}
          expandedKeys={expandedKeys}
          onExpand={setExpandedKeys}
          onSelect={(keys) => setSelectedKeys(keys)}
          blockNode
          titleRender={titleRender}
          showLine={false} // 关闭连接线，使用卡片风格
          style={{ background: "transparent" }}
        />
      </Sider>

      {/* --- 右侧：高级搜索与结果 --- */}
      <Content
        style={{ display: "flex", flexDirection: "column", height: "100%" }}
      >
        {/* 1. 顶部：大气居中的高级搜索区 */}
        <div
          style={{
            padding: "40px 40px 20px 40px",
            background: "linear-gradient(180deg, #fff 0%, #f9f9f9 100%)",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
            <Title level={3} style={{ marginBottom: 24, color: "#262626" }}>
              {selectedKeys.length > 0
                ? `正在检索 “${MOCK_TAGS.find((t) => t.tag_id === selectedKeys[0])?.tag_name || ""}” 行业`
                : "全产业链检索"}
            </Title>

            <Input.Search
              placeholder="请输入企业名称、核心产品或经营范围..."
              allowClear
              enterButton="搜索企业"
              size="large"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: "100%", height: 50 }}
            />

            {/* 快速筛选标签 */}
            <div
              style={{
                marginTop: 16,
                display: "flex",
                justifyContent: "center",
                gap: 16,
              }}
            >
              <Select
                defaultValue="all_capital"
                bordered={false}
                style={{ width: 120 }}
              >
                <Select.Option value="all_capital">注册资本不限</Select.Option>
                <Select.Option value="1000w">1000万以上</Select.Option>
                <Select.Option value="1y">1亿以上</Select.Option>
              </Select>
              <Select
                defaultValue="all_status"
                bordered={false}
                style={{ width: 120 }}
              >
                <Select.Option value="all_status">全部状态</Select.Option>
                <Select.Option value="normal">存续</Select.Option>
              </Select>
              <Button type="link" icon={<FilterOutlined />}>
                更多高级筛选
              </Button>
            </div>
          </div>
        </div>

        {/* 2. 底部：结果列表 */}
        <div
          style={{
            flex: 1,
            padding: "24px 40px",
            overflowY: "auto",
            background: "#fff",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <Space>
              <Text strong style={{ fontSize: 16 }}>
                搜索结果
              </Text>
              <Tag color="blue">{filteredCompanies.length}</Tag>
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

          <List
            grid={{ gutter: 24, xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 3 }}
            dataSource={filteredCompanies}
            renderItem={(item) => (
              <List.Item>
                <Card
                  hoverable
                  onClick={() =>
                    navigate(
                      `/industry-portrait/enterprise-profile?id=${item.company_id}`,
                    )
                  }
                  style={{ borderRadius: 8, border: "1px solid #f0f0f0" }}
                  bodyStyle={{ padding: 20 }}
                >
                  <div style={{ display: "flex", marginBottom: 16 }}>
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        background: "#f0f5ff",
                        borderRadius: 8,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#1890ff",
                        marginRight: 16,
                        flexShrink: 0,
                      }}
                    >
                      <BankOutlined style={{ fontSize: 24 }} />
                    </div>
                    <div>
                      <Text
                        strong
                        style={{
                          fontSize: 16,
                          display: "block",
                          marginBottom: 4,
                        }}
                      >
                        {item.company_name}
                      </Text>
                      <Space size={8}>
                        <Tag style={{ margin: 0 }}>{item.status}</Tag>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          资本: {item.reg_capital}
                        </Text>
                      </Space>
                    </div>
                  </div>

                  <Paragraph
                    type="secondary"
                    ellipsis={{ rows: 2 }}
                    style={{ fontSize: 13, minHeight: 40, marginBottom: 16 }}
                  >
                    {item.desc}
                  </Paragraph>

                  <Divider style={{ margin: "12px 0" }} />

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Space size={4}>
                      {/* 模拟标签展示 */}
                      <Tag
                        color="cyan"
                        style={{ fontSize: 10, lineHeight: "18px" }}
                      >
                        高新技术
                      </Tag>
                    </Space>
                    <Button type="link" size="small" style={{ padding: 0 }}>
                      查看详情 <RightOutlined />
                    </Button>
                  </div>
                </Card>
              </List.Item>
            )}
          />
        </div>
      </Content>
    </Layout>
  );
};

export default IndustryClass;
