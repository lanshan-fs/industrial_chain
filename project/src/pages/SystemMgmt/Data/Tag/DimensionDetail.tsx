import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Breadcrumb,
  Statistic,
  Tree,
  List,
  Tag,
  Input,
  Table,
  Progress,
  Space,
  Empty,
  message,
  Tooltip,
  Spin, // 新增：引入 Spin 组件
} from "antd";
import {
  ArrowLeftOutlined,
  ExportOutlined,
  TagsOutlined,
  BankOutlined,
  LineChartOutlined,
  ClockCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  dimensions,
  mockTreeData,
  mockTagList,
  mockCompanyList,
} from "./tagData";

const { Title, Text } = Typography;
const { Search } = Input;

const DimensionDetail: React.FC = () => {
  const { dimensionId } = useParams<{ dimensionId: string }>();
  const navigate = useNavigate();
  // 设置初始状态，如果未找到则使用第一个作为默认值防止崩溃，或者留空后续处理
  const [currentDim, setCurrentDim] = useState(dimensions[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // 模拟数据获取延迟
    const timer = setTimeout(() => {
      const found = dimensions.find((d) => d.id === dimensionId);
      if (found) {
        setCurrentDim(found);
      }
      setLoading(false);
    }, 500);

    // 清理定时器
    return () => clearTimeout(timer);
  }, [dimensionId]);

  // 表格列定义
  const columns = [
    {
      title: "企业名称",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: any) => (
        <div>
          <div style={{ fontWeight: 500 }}>{text}</div>
          <div style={{ fontSize: 12, color: "#999" }}>{record.domain}</div>
        </div>
      ),
    },
    {
      title: "标签数量",
      dataIndex: "tags",
      key: "tagCount",
      render: (tags: string[]) => <Tag color="blue">{tags.length} 个</Tag>,
    },
    {
      title: "具体标签",
      dataIndex: "tags",
      key: "tags",
      render: (tags: string[]) => (
        <Space size={[0, 4]} wrap>
          {tags.map((tag: string) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: "最近使用",
      dataIndex: "lastUsed",
      key: "lastUsed",
      render: (text: string) => (
        <span>
          <ClockCircleOutlined style={{ marginRight: 4, color: "#999" }} />
          {text}
        </span>
      ),
    },
    {
      title: "操作",
      key: "action",
      render: () => (
        <Button type="link" size="small">
          查看画像
        </Button>
      ),
    },
  ];

  // 1. 解决 loading 未使用的警告，同时优化体验
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          minHeight: "400px",
        }}
      >
        <Spin size="large" tip="加载维度数据中..." />
      </div>
    );
  }

  // 2. 数据判空处理（防止无效ID导致页面崩溃）
  if (!currentDim) {
    return (
      <Empty description="未找到该维度的详细信息" style={{ marginTop: 100 }}>
        <Button type="primary" onClick={() => navigate(-1)}>
          返回上一页
        </Button>
      </Empty>
    );
  }

  return (
    <div style={{ minHeight: "100%", paddingBottom: 24 }}>
      {/* 顶部导航与标题 */}
      <Card
        bordered={false}
        bodyStyle={{ padding: "16px 24px" }}
        style={{ marginBottom: 24 }}
      >
        <Breadcrumb
          items={[
            { title: "系统管理" },
            { title: "数据管理" },
            {
              title: (
                <a onClick={() => navigate("/system-mgmt/tag-library")}>
                  标签体系库
                </a>
              ),
            },
            { title: "维度详情" },
          ]}
          style={{ marginBottom: 16 }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div style={{ display: "flex", gap: 16 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 8,
                background: currentDim.color,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                fontWeight: "bold",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              }}
            >
              {currentDim.id.replace("dim", "")}
            </div>
            <div>
              <Title level={3} style={{ marginBottom: 4, marginTop: 0 }}>
                {currentDim.name}
              </Title>
              <Text
                type="secondary"
                style={{ display: "block", maxWidth: 600 }}
              >
                {currentDim.desc}
              </Text>
              <Space style={{ marginTop: 8 }}>
                <Tag color="blue">四级层级结构</Tag>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  管理员: Admin_User | 最后更新: 2026-02-01
                </Text>
              </Space>
            </div>
          </div>

          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
              返回
            </Button>
            <Button
              type="primary"
              icon={<ExportOutlined />}
              onClick={() => message.success("数据导出中...")}
            >
              导出数据
            </Button>
          </Space>
        </div>
      </Card>

      {/* 核心统计指标 */}
      <Row gutter={24} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card bordered={false} hoverable>
            <Statistic
              title="标签总数"
              value={currentDim.stats.totalTags}
              prefix={<TagsOutlined style={{ color: currentDim.color }} />}
              suffix="个"
            />
            <Progress
              percent={Math.round(
                (currentDim.stats.usedTags / currentDim.stats.totalTags) * 100,
              )}
              size="small"
              strokeColor={currentDim.color}
              showInfo={false}
              style={{ marginTop: 12 }}
            />
            <div style={{ fontSize: 12, color: "#999", marginTop: 4 }}>
              已使用 {currentDim.stats.usedTags} 个
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} hoverable>
            <Statistic
              title="覆盖企业"
              value={currentDim.stats.companyCount}
              prefix={<BankOutlined style={{ color: "#52c41a" }} />}
              suffix="家"
            />
            <Progress
              percent={85}
              size="small"
              strokeColor="#52c41a"
              showInfo={false}
              style={{ marginTop: 12 }}
            />
            <div style={{ fontSize: 12, color: "#999", marginTop: 4 }}>
              行业覆盖率 85%
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} hoverable>
            <Statistic
              title="使用频次"
              value={currentDim.stats.usageCount}
              prefix={<LineChartOutlined style={{ color: "#faad14" }} />}
              suffix="次"
            />
            <div style={{ marginTop: 12, fontSize: 14 }}>
              平均每企业 <Text strong>3.6</Text> 个标签
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} hoverable>
            <Statistic
              title="本月新增"
              value={currentDim.stats.recentAdd}
              prefix={<ClockCircleOutlined style={{ color: "#722ed1" }} />}
              suffix="家"
            />
            <div style={{ marginTop: 12, fontSize: 14, color: "#52c41a" }}>
              环比增长 +12%
            </div>
          </Card>
        </Col>
      </Row>

      {/* 主要内容区：左侧层级树，右侧标签列表 */}
      <Row gutter={24} style={{ marginBottom: 24 }}>
        <Col span={16}>
          <Card
            title={
              <Space>
                <TagsOutlined /> 层级结构概览
              </Space>
            }
            bordered={false}
            style={{ height: "100%", minHeight: 500 }}
          >
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={6}>
                <Tag
                  color={currentDim.color}
                  style={{ width: "100%", textAlign: "center" }}
                >
                  Level 1 行业
                </Tag>
              </Col>
              <Col span={6}>
                <Tag
                  color="blue"
                  style={{ width: "100%", textAlign: "center" }}
                >
                  Level 2 赛道
                </Tag>
              </Col>
              <Col span={6}>
                <Tag
                  color="cyan"
                  style={{ width: "100%", textAlign: "center" }}
                >
                  Level 3 分类
                </Tag>
              </Col>
              <Col span={6}>
                <Tag
                  color="geekblue"
                  style={{ width: "100%", textAlign: "center" }}
                >
                  Level 4 标签
                </Tag>
              </Col>
            </Row>
            <div
              style={{
                border: "1px solid #f0f0f0",
                borderRadius: 8,
                padding: 16,
              }}
            >
              <Tree
                showLine
                switcherIcon={<ArrowLeftOutlined rotate={-90} />}
                defaultExpandedKeys={["L1-1", "L2-1", "L3-1"]}
                treeData={mockTreeData}
                blockNode
                titleRender={(node: any) => (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <span>{node.title}</span>
                    {node.isLeaf && (
                      <Tag style={{ fontSize: 10, marginRight: 0 }}>标签</Tag>
                    )}
                  </div>
                )}
              />
            </div>
          </Card>
        </Col>

        <Col span={8}>
          <Card
            title="标签列表"
            bordered={false}
            extra={
              <Tooltip title="按热度排序">
                <LineChartOutlined />
              </Tooltip>
            }
            style={{ height: "100%", minHeight: 500 }}
            bodyStyle={{ padding: "12px 24px" }}
          >
            <Search
              placeholder="搜索标签..."
              style={{ marginBottom: 16 }}
              allowClear
            />
            <List
              itemLayout="horizontal"
              dataSource={mockTagList}
              renderItem={(item, index) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <div
                        style={{
                          width: 24,
                          height: 24,
                          background: index < 3 ? currentDim.color : "#f0f0f0",
                          color: index < 3 ? "#fff" : "#999",
                          borderRadius: 4,
                          textAlign: "center",
                          lineHeight: "24px",
                          fontSize: 12,
                          fontWeight: "bold",
                        }}
                      >
                        {index + 1}
                      </div>
                    }
                    title={<Text strong>{item.name}</Text>}
                    description={
                      <div style={{ marginTop: 4 }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: 12,
                            color: "#999",
                          }}
                        >
                          <span>覆盖率 {item.coverage}%</span>
                          <span>{item.usage} 次</span>
                        </div>
                        <Progress
                          percent={item.coverage}
                          showInfo={false}
                          strokeWidth={4}
                          strokeColor={currentDim.color}
                        />
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* 底部：企业使用情况 */}
      <Card
        title={
          <Space>
            <BankOutlined /> 使用企业列表
          </Space>
        }
        bordered={false}
        extra={
          <Space>
            <Input
              placeholder="输入企业名称搜索"
              prefix={<SearchOutlined />}
              style={{ width: 200 }}
            />
            <Button>重置</Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={mockCompanyList}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </Card>
    </div>
  );
};

export default DimensionDetail;
