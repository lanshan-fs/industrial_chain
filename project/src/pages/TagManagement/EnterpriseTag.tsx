import React, { useState } from "react";
import {
  Card,
  Table,
  Input,
  Select,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  message,
  Typography,
} from "antd";
import {
  PlusOutlined,
  TagsOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import type { TableProps } from "antd";

const { Text } = Typography;
const { Option } = Select;

// --- 模拟数据与类型定义 ---

// 标签维度定义
const TAG_DIMENSIONS = [
  "基本信息维度",
  "经营业务维度",
  "科技属性维度",
  "风险管控维度",
  "市场表现维度",
];

// 单个维度的标签组
interface TagGroup {
  dimension: string;
  tags: string[];
}

// 企业数据接口
interface EnterpriseTagData {
  key: string;
  name: string;
  code: string;
  industry: string; // 所属行业
  tagGroups: TagGroup[]; // 按维度分组的标签
}

// 模拟数据
const initialData: EnterpriseTagData[] = [
  {
    key: "1",
    name: "北京数字医疗科技有限公司",
    code: "91110105MA01...",
    industry: "数字医疗",
    tagGroups: [
      { dimension: "科技属性维度", tags: ["高新技术企业", "专精特新"] },
      { dimension: "基本信息维度", tags: ["朝阳区重点"] },
    ],
  },
  {
    key: "2",
    name: "朝阳区智慧康养中心",
    code: "52110105MJ23...",
    industry: "智慧康养",
    tagGroups: [
      { dimension: "经营业务维度", tags: ["养老服务", "政府采购"] },
      { dimension: "风险管控维度", tags: ["信用良好"] },
    ],
  },
  {
    key: "3",
    name: "未来生命科学研究院",
    code: "121000004000...",
    industry: "生物医药",
    tagGroups: [
      { dimension: "科技属性维度", tags: ["科研机构", "成果转化潜力"] },
      { dimension: "市场表现维度", tags: ["行业龙头"] },
    ],
  },
  {
    key: "4",
    name: "博爱医疗器械股份公司",
    code: "911100007890...",
    industry: "医疗器械",
    tagGroups: [],
  },
];

// 预设推荐标签（用于自动补全）
const PRESET_TAGS: Record<string, string[]> = {
  基本信息维度: ["朝阳区重点", "国企", "民企", "外资"],
  经营业务维度: ["养老服务", "互联网医疗", "医疗器械生产", "政府采购"],
  科技属性维度: ["高新技术企业", "专精特新", "独角兽", "研发强", "科研机构"],
  风险管控维度: ["信用良好", "经营异常", "行政处罚"],
  市场表现维度: ["行业龙头", "高增长", "拟上市"],
};

const EnterpriseTag: React.FC = () => {
  // 状态管理
  const [data, setData] = useState<EnterpriseTagData[]>(initialData);
  const [searchText, setSearchText] = useState("");
  const [filterDimension, setFilterDimension] = useState<string | null>(null);

  // Modal 状态
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEnterprise, setEditingEnterprise] =
    useState<EnterpriseTagData | null>(null); // null 表示批量操作
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const [form] = Form.useForm();
  // 动态获取当前选中维度的推荐标签
  const [currentDimensionTags, setCurrentDimensionTags] = useState<string[]>(
    []
  );

  // --- 筛选逻辑 ---
  const filteredData = data.filter((item) => {
    // 1. 文本搜索 (名称或代码)
    const matchText =
      item.name.includes(searchText) || item.code.includes(searchText);

    // 2. 维度筛选
    const matchDimension = filterDimension
      ? item.tagGroups.some(
          (g) => g.dimension === filterDimension && g.tags.length > 0
        )
      : true;

    return matchText && matchDimension;
  });

  // --- 操作处理 ---

  // 打开添加标签 Modal
  const openAddTagModal = (record?: EnterpriseTagData) => {
    form.resetFields();
    setCurrentDimensionTags([]);
    if (record) {
      setEditingEnterprise(record);
    } else {
      // 批量操作
      if (selectedRowKeys.length === 0) {
        message.warning("请先选择要操作的企业");
        return;
      }
      setEditingEnterprise(null);
    }
    setIsModalOpen(true);
  };

  // 提交添加标签
  const handleModalOk = () => {
    form.validateFields().then((values) => {
      const { dimension, newTags } = values; // newTags 是数组

      const targetKeys = editingEnterprise
        ? [editingEnterprise.key]
        : selectedRowKeys;

      const newData = data.map((item) => {
        if (targetKeys.includes(item.key)) {
          // 查找该企业该维度的现有分组
          const existingGroupIndex = item.tagGroups.findIndex(
            (g) => g.dimension === dimension
          );
          let newTagGroups = [...item.tagGroups];

          if (existingGroupIndex > -1) {
            // 合并标签并去重
            const existingTags = newTagGroups[existingGroupIndex].tags;
            const mergedTags = Array.from(
              new Set([...existingTags, ...newTags])
            );
            newTagGroups[existingGroupIndex] = {
              ...newTagGroups[existingGroupIndex],
              tags: mergedTags,
            };
          } else {
            // 新增维度分组
            newTagGroups.push({ dimension, tags: newTags });
          }
          return { ...item, tagGroups: newTagGroups };
        }
        return item;
      });

      setData(newData);
      message.success(`成功为 ${targetKeys.length} 家企业添加标签`);
      setIsModalOpen(false);
      setSelectedRowKeys([]); // 清空选择
    });
  };

  // 删除单个标签
  const handleCloseTag = (
    recordKey: string,
    dimension: string,
    tagToRemove: string
  ) => {
    const newData = data.map((item) => {
      if (item.key === recordKey) {
        const newGroups = item.tagGroups
          .map((group) => {
            if (group.dimension === dimension) {
              return {
                ...group,
                tags: group.tags.filter((t) => t !== tagToRemove),
              };
            }
            return group;
          })
          .filter((group) => group.tags.length > 0); // 如果该维度没有标签了，可以移除该维度分组(可选)
        return { ...item, tagGroups: newGroups };
      }
      return item;
    });
    setData(newData);
    message.success("标签已删除");
  };

  // 表格列定义
  const columns: TableProps<EnterpriseTagData>["columns"] = [
    {
      title: "企业名称 / 代码",
      dataIndex: "name",
      key: "name",
      width: 280,
      render: (_, record) => (
        <Space direction="vertical" size={2}>
          <Text strong>{record.name}</Text>
          <Text type="secondary" copyable style={{ fontSize: 12 }}>
            {record.code}
          </Text>
          <Tag bordered={false} style={{ margin: 0 }}>
            {record.industry}
          </Tag>
        </Space>
      ),
    },
    {
      title: "标签信息 (按维度分组)",
      key: "tags",
      render: (_, record) => (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {record.tagGroups.length === 0 && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              暂无标签
            </Text>
          )}
          {record.tagGroups.map((group) => (
            <div
              key={group.dimension}
              style={{ display: "flex", alignItems: "flex-start" }}
            >
              <Text
                type="secondary"
                style={{
                  fontSize: "12px",
                  width: "90px",
                  flexShrink: 0,
                  marginTop: "2px",
                }}
              >
                {group.dimension}:
              </Text>
              <div style={{ flex: 1 }}>
                {group.tags.map((tag) => (
                  <Tag
                    key={tag}
                    closable
                    onClose={(e) => {
                      e.preventDefault();
                      handleCloseTag(record.key, group.dimension, tag);
                    }}
                    color="blue"
                    style={{ marginBottom: "4px" }}
                  >
                    {tag}
                  </Tag>
                ))}
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "操作",
      key: "action",
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<PlusOutlined />}
            onClick={() => openAddTagModal(record)}
          >
            打标
          </Button>
          <Button type="link" size="small" icon={<EyeOutlined />}>
            详情
          </Button>
        </Space>
      ),
    },
  ];

  // 行选择配置
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  return (
    <div style={{ minHeight: "100%" }}>
      {/* 顶部搜索筛选栏 */}
      <Card bordered={false} style={{ marginBottom: 16 }}>
        <Space wrap size="large">
          <Input.Search
            placeholder="搜索企业名称或统一信用代码"
            allowClear
            onSearch={(val) => setSearchText(val)}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />

          <Space>
            <span>维度筛选：</span>
            <Select
              placeholder="全部维度"
              allowClear
              style={{ width: 180 }}
              onChange={(val) => setFilterDimension(val)}
            >
              {TAG_DIMENSIONS.map((d) => (
                <Option key={d} value={d}>
                  {d}
                </Option>
              ))}
            </Select>
          </Space>
        </Space>
      </Card>

      {/* 主体表格区域 */}
      <Card
        title={
          <Space>
            <TagsOutlined />
            <span>企业标签列表</span>
            {filterDimension && (
              <Tag color="orange">筛选中: {filterDimension}</Tag>
            )}
          </Space>
        }
        extra={
          <Space>
            <Button onClick={() => message.info("跳转至新增企业页面")}>
              新增企业
            </Button>
            <Button
              type="primary"
              disabled={selectedRowKeys.length === 0}
              onClick={() => openAddTagModal()}
            >
              批量打标{" "}
              {selectedRowKeys.length > 0 && `(${selectedRowKeys.length})`}
            </Button>
          </Space>
        }
        bordered={false}
      >
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredData}
          pagination={{
            pageSize: 5,
            showTotal: (total) => `共 ${total} 家企业`,
          }}
          rowKey="key"
        />
      </Card>

      {/* 添加/编辑标签 Modal */}
      <Modal
        title={
          editingEnterprise
            ? `为 "${editingEnterprise.name}" 添加标签`
            : "批量添加标签"
        }
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
        destroyOnClose
      >
        {!editingEnterprise && (
          <div style={{ marginBottom: 16 }}>
            <Typography.Text type="warning">
              <ExclamationCircleOutlined /> 即将为选中的{" "}
              {selectedRowKeys.length} 家企业批量添加以下标签
            </Typography.Text>
          </div>
        )}

        <Form form={form} layout="vertical" preserve={false}>
          <Form.Item
            name="dimension"
            label="1. 选择标签维度"
            rules={[{ required: true, message: "请选择维度" }]}
          >
            <Select
              placeholder="请选择"
              onChange={(value) =>
                setCurrentDimensionTags(PRESET_TAGS[value] || [])
              }
            >
              {TAG_DIMENSIONS.map((d) => (
                <Option key={d} value={d}>
                  {d}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="newTags"
            label="2. 添加标签 (可直接输入新标签回车，或从下拉选择)"
            rules={[{ required: true, message: "请至少输入一个标签" }]}
          >
            <Select
              mode="tags"
              style={{ width: "100%" }}
              placeholder="输入标签后按回车"
              options={currentDimensionTags.map((tag) => ({
                label: tag,
                value: tag,
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EnterpriseTag;
