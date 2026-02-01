import React, { useState } from "react";
import {
  Card,
  Typography,
  Checkbox,
  Button,
  Tag,
  Space,
  Divider,
  message,
  Row,
  Col,
} from "antd";
import {
  DeleteOutlined,
  SaveOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { FILTER_CONFIG } from "./constants";

const { Title, Text } = Typography;

const AdvancedSearch: React.FC = () => {
  const navigate = useNavigate();

  // 状态：存储选中的筛选条件 { "registeredCapital": ["0-100万"], "street": ["望京街道"] }
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string[]>
  >({});

  // 处理复选框变化
  const handleFilterChange = (key: string, checkedValues: string[]) => {
    setSelectedFilters((prev) => {
      const newState = { ...prev, [key]: checkedValues };
      if (checkedValues.length === 0) {
        delete newState[key];
      }
      return newState;
    });
  };

  // 清空所有
  const handleClear = () => {
    setSelectedFilters({});
    message.info("筛选条件已清空");
  };

  // 保存条件 (模拟)
  const handleSave = () => {
    if (Object.keys(selectedFilters).length === 0) {
      message.warning("请先选择筛选条件");
      return;
    }
    message.success("筛选条件保存成功 (模拟)");
    console.log("Saved:", selectedFilters);
  };

  // 查看结果 -> 跳转到产业分类页面并携带参数
  const handleSearch = () => {
    // 将对象转换为 URL 查询参数字符串
    const params = new URLSearchParams();
    params.set("advanced", "true");
    params.set("filterData", JSON.stringify(selectedFilters));

    // 假设产业分类页面的路由是 /industry-class
    navigate(`/industry-class?${params.toString()}`);
  };

  // 渲染单个分类块 (如：基本信息)
  const renderCategoryBlock = (category: (typeof FILTER_CONFIG)[0]) => (
    <Card
      key={category.title}
      title={
        <Text strong style={{ fontSize: 16 }}>
          {category.title}
        </Text>
      }
      className="mb-4 shadow-sm"
      bodyStyle={{ padding: "12px 24px" }}
      size="small"
      style={{ marginBottom: 16 }}
    >
      {category.groups.map((group, gIndex) => (
        <div key={group.key}>
          {gIndex > 0 && <Divider style={{ margin: "12px 0" }} dashed />}
          <Row gutter={16} align="middle">
            {/* 左侧：关键词栏 (较窄) */}
            <Col
              flex="100px"
              style={{ textAlign: "right", color: "#666", fontWeight: 500 }}
            >
              {group.name}
            </Col>

            {/* 右侧：筛选标签 (复选框) */}
            <Col flex="auto">
              <Checkbox.Group
                options={group.options}
                value={selectedFilters[group.key] || []}
                onChange={(vals) =>
                  handleFilterChange(group.key, vals as string[])
                }
                style={{ width: "100%" }}
              />
            </Col>
          </Row>
        </div>
      ))}
    </Card>
  );

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: 1200,
        margin: "0 auto",
        minHeight: "100%",
      }}
    >
      <div style={{ marginBottom: 20 }}>
        <Title level={3}>高级搜索</Title>
        <Text type="secondary">基于多维度的企业精准筛选，支持组合查询</Text>
      </div>

      {/* 区块一：筛选区域 */}
      <div style={{ marginBottom: 24 }}>
        {FILTER_CONFIG.map((category) => renderCategoryBlock(category))}
      </div>

      {/* 区块二：底部操作栏 (优化版) */}
      {/* 使用 sticky 实现吸底效果，同时受限于父容器宽度，不会溢出 */}
      <div style={{ position: "sticky", bottom: 0, zIndex: 10 }}>
        <Card
          style={{
            boxShadow: "0 -4px 12px rgba(0,0,0,0.1)",
            border: "none", // 移除边框让阴影更自然
          }}
          bodyStyle={{ padding: "16px 24px" }}
        >
          <Row justify="space-between" align="middle">
            <Col span={16}>
              <Space align="center" size="large">
                <Text strong>已选条件：</Text>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                    maxHeight: 40,
                    overflowY: "auto",
                  }}
                >
                  {Object.entries(selectedFilters).map(
                    ([key, values]) =>
                      values.length > 0 && (
                        <Tag
                          key={key}
                          color="blue"
                          closable
                          onClose={() => handleFilterChange(key, [])}
                        >
                          {
                            FILTER_CONFIG.flatMap((c) => c.groups).find(
                              (g) => g.key === key,
                            )?.name
                          }
                          : {values.join(", ")}
                        </Tag>
                      ),
                  )}
                  {Object.keys(selectedFilters).length === 0 && (
                    <Text type="secondary">暂无选择</Text>
                  )}
                </div>
              </Space>
            </Col>
            <Col>
              <Space>
                <Button icon={<DeleteOutlined />} onClick={handleClear}>
                  清空
                </Button>
                <Button icon={<SaveOutlined />} onClick={handleSave}>
                  保存条件
                </Button>
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  size="large"
                  onClick={handleSearch}
                >
                  查看结果
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
};

export default AdvancedSearch;
