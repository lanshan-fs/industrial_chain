import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Card,
  Row,
  Col,
  Input,
  Space,
  Tag,
  Modal,
  Form,
  Upload,
  message,
  Popconfirm,
  Tabs,
  Typography,
  Tooltip,
} from "antd";
import type { TableProps } from "antd";
import {
  SearchOutlined,
  FilterOutlined,
  PlusOutlined,
  ImportOutlined,
  EditOutlined,
  DeleteOutlined,
  FileExcelOutlined,
  TagsOutlined,
} from "@ant-design/icons";

interface EnterpriseDataType {
  key: string;
  name: string;
  variants: string;
  updateTime: string;
}

const EnterpriseData: React.FC = () => {
  const [data, setData] = useState<EnterpriseDataType[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/companies");
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      } else {
        message.error("获取数据失败：" + result.message);
      }
    } catch (error) {
      message.error("网络请求错误，请确保 server.js 已启动");
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter(
    (item) =>
      item.name.includes(searchText) || item.variants.includes(searchText),
  );

  const handleOk = () => {
    form.validateFields().then((values) => {
      if (modalMode === "add") {
        const newData = {
          key: Date.now().toString(),
          ...values,
          updateTime: new Date().toISOString().split("T")[0],
        };
        setData([newData, ...data]);
        message.success("新增成功");
      } else {
        const newData = data.map((item) =>
          item.key === editingKey ? { ...item, ...values } : item,
        );
        setData(newData);
        message.success("修改成功");
      }
      setIsModalOpen(false);
      form.resetFields();
    });
  };

  const handleDelete = (key: string) => {
    setData(data.filter((item) => item.key !== key));
    message.success("删除成功");
  };

  const openEdit = (record: EnterpriseDataType) => {
    setModalMode("edit");
    setEditingKey(record.key);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const columns: TableProps<EnterpriseDataType>["columns"] = [
    {
      title: "企业名称",
      dataIndex: "name",
      key: "name",
      width: 180,
      render: (text) => <a style={{ fontWeight: "bold" }}>{text}</a>,
    },
    {
      title: "企业ID / 唯一标识",
      dataIndex: "key",
      key: "key",
      width: 120,
      ellipsis: true,
      render: (text) => (
        <Typography.Text type="secondary" copyable style={{ fontSize: 12 }}>
          {text}
        </Typography.Text>
      ),
    },
    {
      title: (
        <Space>
          <TagsOutlined />
          <span>业务标签 / 原始变体 (Tags)</span>
        </Space>
      ),
      dataIndex: "variants",
      key: "variants",
      render: (text: string) => {
        if (!text) return <Tag>无</Tag>;
        // 核心逻辑：解析 CSV 中的 "|" 分隔符，生成 Tag 列表
        const tags = text
          .split("|")
          .map((t) => t.trim())
          .filter((t) => t);
        // 只显示前3个，超出的放入 Tooltip
        const showTags = tags.slice(0, 3);
        const hiddenTags = tags.slice(3);

        return (
          <Space size={[0, 4]} wrap>
            {showTags.map((tag, index) => {
              // 简单处理，去掉括号外的重复名称，让标签更简洁 (可选)
              // 例如 "DeepSeek（通用开源模型）" -> "通用开源模型"
              // 这里为了保持原汁原味，暂时直接展示
              return (
                <Tag color="blue" key={index} style={{ marginRight: 4 }}>
                  {tag}
                </Tag>
              );
            })}
            {hiddenTags.length > 0 && (
              <Tooltip title={hiddenTags.join(", ")}>
                <Tag>+{hiddenTags.length}...</Tag>
              </Tooltip>
            )}
          </Space>
        );
      },
    },
    {
      title: "更新时间",
      dataIndex: "updateTime",
      key: "updateTime",
      width: 120,
      sorter: (a, b) => a.updateTime.localeCompare(b.updateTime),
    },
    {
      title: "操作",
      key: "action",
      width: 150,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            size="small"
            onClick={() => openEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除？"
            onConfirm={() => handleDelete(record.key)}
          >
            <Button type="text" danger icon={<DeleteOutlined />} size="small">
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card
        bordered={false}
        style={{ marginBottom: 16 }}
        bodyStyle={{ padding: "16px 24px" }}
      >
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              <Input
                placeholder="搜索企业或业务标签..."
                prefix={<SearchOutlined />}
                style={{ width: 300 }}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <Button icon={<FilterOutlined />}>更多筛选</Button>
            </Space>
          </Col>
          <Col>
            <Space>
              <Button
                onClick={() => {
                  setModalMode("add");
                  setIsModalOpen(true);
                  form.resetFields();
                }}
              >
                <PlusOutlined /> 手动新增
              </Button>
              {/* 这里在真实场景中可以连接后端的导入接口 */}
              <Button type="primary" icon={<ImportOutlined />}>
                Excel/CSV 导入
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card bordered={false}>
        <Table
          columns={columns}
          dataSource={filteredData}
          loading={loading}
          pagination={{ pageSize: 8 }}
          rowKey="key"
        />
      </Card>

      <Modal
        title={modalMode === "add" ? "新增企业" : "编辑企业信息"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        width={600}
      >
        {modalMode === "add" && (
          <Tabs
            defaultActiveKey="manual"
            items={[
              {
                key: "manual",
                label: "人工录入",
                children: (
                  <Form form={form} layout="vertical">
                    <Form.Item
                      name="name"
                      label="企业名称"
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="请输入企业全称" />
                    </Form.Item>
                    <Form.Item name="variants" label="业务标签/变体">
                      <Input.TextArea
                        placeholder="例如：DeepSeek（医疗大模型）| DeepSeek（开源）"
                        rows={3}
                      />
                    </Form.Item>
                  </Form>
                ),
              },
              {
                key: "import",
                label: "文件导入",
                children: (
                  <div style={{ textAlign: "center", padding: "20px 0" }}>
                    <Upload.Dragger>
                      <p className="ant-upload-drag-icon">
                        <FileExcelOutlined />
                      </p>
                      <p className="ant-upload-text">
                        点击或拖拽 CSV 文件到此区域上传
                      </p>
                      <p className="ant-upload-hint">
                        支持 .csv, .xlsx 格式，将自动解析并存入数据库
                      </p>
                    </Upload.Dragger>
                  </div>
                ),
              },
            ]}
          />
        )}
        {modalMode === "edit" && (
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="企业名称"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="variants" label="业务标签/变体">
              <Input.TextArea rows={4} />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default EnterpriseData;
