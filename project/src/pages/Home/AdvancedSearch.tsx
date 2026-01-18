import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Input,
  Card,
  Tag,
  Space,
  List,
  Typography,
  Row,
  Col,
  Button,
  theme,
  Select,
  Avatar,
  Badge,
} from "antd";
import {
  FilterOutlined,
  ReloadOutlined,
  BankOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
const { CheckableTag } = Tag;

// --- 模拟数据 ---

// 筛选选项配置
const FILTER_CONFIG = [
  {
    key: "chain",
    label: "产业链环节",
    options: ["全部", "上游研发", "中游制造", "下游服务", "配套支持"],
  },
  {
    key: "type",
    label: "企业资质",
    options: ["全部", "上市企业", "拟上市", "高新技术", "专精特新", "科技中小"],
  },
  {
    key: "score",
    label: "评分等级",
    options: ["全部", "S级 (90+)", "A级 (80-89)", "B级 (70-79)", "C级 (<70)"],
  },
];

// 模拟企业数据 (扩展版)
const MOCK_DATA = Array.from({ length: 12 }).map((_, i) => ({
  id: `${i + 1}`,
  name:
    i % 2 === 0
      ? `北京数字医疗科技${i + 1}有限公司`
      : `朝阳智慧康养${i + 1}中心`,
  chain: i % 3 === 0 ? "上游研发" : i % 3 === 1 ? "中游制造" : "下游服务",
  type: i % 4 === 0 ? "上市企业" : i % 4 === 1 ? "高新技术" : "专精特新",
  score: 85 + (i % 15), // 85 ~ 99
  capital: "5000万人民币",
  date: "2018-06-15",
  desc: "专注于医疗大数据挖掘与AI辅助诊疗系统的研发，拥有多项核心专利，服务于全国三甲医院。",
  logo: i % 2 === 0 ? "B" : "C",
}));

const AdvancedSearch: React.FC = () => {
  const { token } = theme.useToken();
  const [searchParams, setSearchParams] = useSearchParams();

  // 状态管理
  const [searchText, setSearchText] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string>
  >({
    chain: "全部",
    type: "全部",
    score: "全部",
  });
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(MOCK_DATA);

  // 初始化：读取 URL 参数 (实现与其他页面的联动)
  useEffect(() => {
    const query = searchParams.get("q");
    const tag = searchParams.get("tag");

    if (query) setSearchText(query);
    if (tag) {
      // 简单的映射逻辑，实际可更复杂
      setSelectedFilters((prev) => ({ ...prev, chain: tag }));
    }
  }, [searchParams]);

  // 处理筛选点击
  const handleFilterChange = (category: string, option: string) => {
    const newFilters = { ...selectedFilters, [category]: option };
    setSelectedFilters(newFilters);
    performSearch(searchText, newFilters);
  };

  // 处理搜索
  const handleSearch = (value: string) => {
    setSearchText(value);
    performSearch(value, selectedFilters);
    // 更新 URL，方便分享
    setSearchParams({ q: value });
  };

  // 模拟搜索逻辑
  const performSearch = (text: string, filters: Record<string, string>) => {
    setLoading(true);
    setTimeout(() => {
      let result = MOCK_DATA;

      // 1. 文本搜索
      if (text) {
        result = result.filter((item) => item.name.includes(text));
      }

      // 2. 标签筛选
      if (filters.chain !== "全部") {
        result = result.filter((item) => item.chain === filters.chain);
      }
      if (filters.type !== "全部") {
        result = result.filter((item) => item.type === filters.type);
      }
      if (filters.score !== "全部") {
        // 简单模拟评分筛选
        if (filters.score.includes("90"))
          result = result.filter((i) => i.score >= 90);
        else if (filters.score.includes("80"))
          result = result.filter((i) => i.score >= 80 && i.score < 90);
      }

      setData(result);
      setLoading(false);
    }, 300); // 模拟网络延迟
  };

  // 重置筛选
  const handleReset = () => {
    setSearchText("");
    setSelectedFilters({ chain: "全部", type: "全部", score: "全部" });
    setData(MOCK_DATA);
    setSearchParams({});
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      {/* 1. 顶部搜索区 */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <Title level={3}>企业数据高级检索</Title>
        <Paragraph type="secondary" style={{ marginBottom: 24 }}>
          支持多维度组合筛选，快速定位产业链关键主体
        </Paragraph>
        <Input.Search
          placeholder="请输入企业名称、统一社会信用代码或关键词"
          allowClear
          enterButton="搜索"
          size="large"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onSearch={handleSearch}
          style={{ maxWidth: 600 }}
        />
      </div>

      {/* 2. 筛选导航区 (Navigation Area) */}
      <Card
        bordered={false}
        style={{ marginBottom: 24, boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}
        bodyStyle={{ padding: "12px 24px" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <Text strong>
            <FilterOutlined /> 筛选条件
          </Text>
          <Button
            type="link"
            size="small"
            icon={<ReloadOutlined />}
            onClick={handleReset}
          >
            重置筛选
          </Button>
        </div>
        {FILTER_CONFIG.map((filter) => (
          <Row key={filter.key} style={{ marginBottom: 8, lineHeight: "32px" }}>
            <Col flex="100px">
              <Text type="secondary">{filter.label}：</Text>
            </Col>
            <Col flex="auto">
              <Space size={[8, 8]} wrap>
                {filter.options.map((tag) => (
                  <CheckableTag
                    key={tag}
                    checked={selectedFilters[filter.key] === tag}
                    onChange={() => handleFilterChange(filter.key, tag)}
                    style={{
                      padding: "4px 12px",
                      fontSize: 13,
                      border:
                        selectedFilters[filter.key] === tag
                          ? "none"
                          : "1px solid #f0f0f0",
                    }}
                  >
                    {tag}
                  </CheckableTag>
                ))}
              </Space>
            </Col>
          </Row>
        ))}
      </Card>

      {/* 3. 搜索结果列表 */}
      <Card
        title={
          <Space>
            <span>搜索结果</span>
            <Badge count={data.length} style={{ backgroundColor: "#52c41a" }} />
          </Space>
        }
        bordered={false}
        extra={
          <Space>
            <Select
              defaultValue="score"
              style={{ width: 120 }}
              bordered={false}
            >
              <Select.Option value="score">综合评分降序</Select.Option>
              <Select.Option value="date">成立时间降序</Select.Option>
            </Select>
          </Space>
        }
      >
        <List
          itemLayout="vertical"
          size="large"
          loading={loading}
          dataSource={data}
          pagination={{
            onChange: (page) => console.log(page),
            pageSize: 5,
            align: "center",
          }}
          renderItem={(item) => (
            <List.Item
              key={item.id}
              extra={
                <div style={{ textAlign: "center", minWidth: 100 }}>
                  <div style={{ marginBottom: 8 }}>
                    <Text type="secondary">综合评分</Text>
                  </div>
                  <div
                    style={{
                      fontSize: 28,
                      color:
                        item.score >= 90
                          ? token.colorSuccess
                          : token.colorPrimary,
                      fontWeight: "bold",
                      fontFamily: "Arial",
                    }}
                  >
                    {item.score}
                  </div>
                  <Button type="primary" size="small" style={{ marginTop: 8 }}>
                    查看详情
                  </Button>
                </div>
              }
              actions={[
                <Space>
                  <BankOutlined /> 注册资本：{item.capital}
                </Space>,
                <Space>
                  <SafetyCertificateOutlined /> 成立日期：{item.date}
                </Space>,
              ]}
              style={{ padding: "20px 0" }}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    shape="square"
                    size={64}
                    style={{
                      backgroundColor:
                        item.logo === "B" ? "#1890ff" : "#722ed1",
                    }}
                  >
                    {item.logo}
                  </Avatar>
                }
                title={
                  <Space>
                    <a style={{ fontSize: 18, fontWeight: 500 }}>{item.name}</a>
                    <Tag color="blue">{item.chain}</Tag>
                    {item.type === "上市企业" && <Tag color="red">上市</Tag>}
                    {item.type === "高新技术" && <Tag color="cyan">高新</Tag>}
                  </Space>
                }
                description={
                  <div style={{ marginTop: 8 }}>
                    <Paragraph
                      ellipsis={{ rows: 2 }}
                      type="secondary"
                      style={{ marginBottom: 0 }}
                    >
                      {item.desc}
                    </Paragraph>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default AdvancedSearch;
