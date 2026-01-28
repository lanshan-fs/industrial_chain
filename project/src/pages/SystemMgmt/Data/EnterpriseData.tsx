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
  Divider,
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
  legalPerson: string;
  registeredCapital: number;
  variants: string;
  updateTime: string;
  establishmentDate?: string;
}

const EnterpriseData: React.FC = () => {
  const [data, setData] = useState<EnterpriseDataType[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view">("add");
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
    (item) => item.name.includes(searchText) || item.key.includes(searchText),
  );

  const handleOk = () => {
    if (modalMode === "view") {
      setIsModalOpen(false);
      return;
    }

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

  const openView = (record: EnterpriseDataType) => {
    setModalMode("view");
    setEditingKey(record.key);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  // 优化点1：列宽自适应设计
  // 策略：给固定内容的列（如日期、金额、操作）设置 width
  // 给弹性内容的列（如名称、标签）不设 width 或设百分比，并开启 ellipsis
  const columns: TableProps<EnterpriseDataType>["columns"] = [
    {
      title: "企业名称",
      dataIndex: "name",
      key: "name",
      // 不设固定宽度，使其自适应剩余空间
      width: 150,
      ellipsis: true,
      render: (text) => (
        <Tooltip placement="topLeft" title={text}>
          <span style={{ fontWeight: "bold", color: "#1677ff" }}>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: "统一社会信用代码",
      dataIndex: "key",
      key: "key",
      width: 150,
      ellipsis: true,
      render: () => (
        <Typography.Text type="secondary" copyable style={{ fontSize: 13 }}>
          666666666888888888
        </Typography.Text>
      ),
    },
    {
      title: "法定代表人",
      dataIndex: "legalPerson",
      key: "legalPerson",
      width: 100,
      ellipsis: true,
    },
    {
      title: "注册资本",
      dataIndex: "registeredCapital",
      key: "registeredCapital",
      width: 130, // 足够显示 "¥ 10000 万"
      render: (val) => (val ? `¥ ${val} 万` : "-"),
      sorter: (a, b) => (a.registeredCapital || 0) - (b.registeredCapital || 0),
    },
    {
      title: (
        <Space>
          <TagsOutlined />
          <span>行业标签</span>
        </Space>
      ),
      dataIndex: "variants",
      key: "variants",
      width: 220, // 限制标签列的最大宽度，避免过多挤压名称列
      ellipsis: true,
      render: (text: string) => {
        if (!text) return <span style={{ color: "#ccc" }}>无标签</span>;
        const tags = text
          .split("|")
          .map((t) => t.trim())
          .filter((t) => t);
        // 动态调整显示数量，尽量显示2个
        const showTags = tags.slice(0, 2);
        const hiddenTags = tags.slice(2);

        return (
          <Space size={[0, 4]} wrap={false} style={{ width: "100%" }}>
            {showTags.map((tag, index) => (
              <Tag
                color="cyan"
                key={index}
                bordered={false}
                style={{
                  maxWidth: 80,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  verticalAlign: "middle",
                }}
              >
                {tag}
              </Tag>
            ))}
            {hiddenTags.length > 0 && (
              <Tooltip title={hiddenTags.join(", ")}>
                <Tag bordered={false}>+{hiddenTags.length}</Tag>
              </Tooltip>
            )}
          </Space>
        );
      },
    },
    {
      title: "详情",
      key: "viewAll",
      width: 80,
      align: "center",
      render: (_, record) => (
        <a onClick={() => openView(record)} style={{ cursor: "pointer" }}>
          全部
        </a>
      ),
    },
    {
      title: "更新时间",
      dataIndex: "updateTime",
      key: "updateTime",
      width: 110,
      ellipsis: true,
      sorter: (a, b) => a.updateTime.localeCompare(b.updateTime),
    },
    {
      title: "操作",
      key: "action",
      width: 140, // 刚好放下 编辑|删除
      align: "center",
      render: (_, record) => (
        <Space size={0}>
          <Button
            type="link"
            icon={<EditOutlined />}
            size="small"
            onClick={() => openEdit(record)}
          >
            编辑
          </Button>
          <Divider type="vertical" />
          <Popconfirm
            title="确认删除该企业数据？"
            onConfirm={() => handleDelete(record.key)}
          >
            <Button type="link" danger icon={<DeleteOutlined />} size="small">
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const renderFormContent = (disabled: boolean) => (
    <Form form={form} layout="vertical" disabled={disabled}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="name"
            label="企业名称"
            rules={[{ required: true, message: "请输入企业名称" }]}
          >
            <Input placeholder="请输入企业全称" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="key"
            label="统一社会信用代码"
            rules={[{ required: true, message: "请输入统一社会信用代码" }]}
          >
            <Input placeholder="请输入18位信用代码" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="legalPerson" label="法定代表人">
            <Input placeholder="例如：张三" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="registeredCapital" label="注册资本 (万元)">
            <Input type="number" suffix="万" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="establishmentDate" label="成立日期">
            <Input placeholder="YYYY-MM-DD" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item name="variants" label="行业标签 / 业务变体">
        <Input.TextArea
          placeholder="多个标签请用 '|' 分隔，例如：人工智能 | 大模型 | 医疗健康"
          rows={3}
        />
      </Form.Item>

      <Form.Item name="description" label="企业简介 (模拟字段)">
        <Input.TextArea rows={4} placeholder="请输入企业简介..." />
      </Form.Item>
    </Form>
  );

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
                placeholder="搜索企业名称 / 信用代码"
                prefix={<SearchOutlined />}
                style={{ width: 300 }}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
              />
              <Button icon={<FilterOutlined />}>更多筛选</Button>
            </Space>
          </Col>
          <Col>
            <Space>
              <Button
                type="primary"
                onClick={() => {
                  setModalMode("add");
                  setIsModalOpen(true);
                  form.resetFields();
                }}
              >
                <PlusOutlined /> 新增企业
              </Button>
              <Button icon={<ImportOutlined />}>Excel/CSV 导入</Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card bordered={false} bodyStyle={{ padding: 0 }}>
        {/* 优化点：
          1. 移除了 scroll={{ x: 1300 }}，防止强制横向滚动条。
          2. columns 中配置了 ellipsis 和合理的宽度，确保在小屏下挤压内容而不是撑开容器。
        */}
        <Table
          columns={columns}
          dataSource={filteredData}
          loading={loading}
          // 优化点2：默认显示 15 条
          pagination={{
            pageSize: 15,
            showSizeChanger: true,
            pageSizeOptions: ["15", "30", "50", "100"],
            showTotal: (total) => `共 ${total} 条数据`,
          }}
          rowKey="key"
        />
      </Card>

      <Modal
        title={
          modalMode === "add"
            ? "新增企业"
            : modalMode === "edit"
              ? "编辑企业信息"
              : "企业全景数据 (只读)"
        }
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        width={700}
        okText={modalMode === "view" ? "关闭" : "保存"}
        cancelButtonProps={{
          style: { display: modalMode === "view" ? "none" : "inline-block" },
        }}
      >
        {modalMode === "add" ? (
          <Tabs
            defaultActiveKey="manual"
            items={[
              {
                key: "manual",
                label: "人工录入",
                children: renderFormContent(false),
              },
              {
                key: "import",
                label: "批量导入",
                children: (
                  <div style={{ textAlign: "center", padding: "40px 0" }}>
                    <Upload.Dragger>
                      <p className="ant-upload-drag-icon">
                        <FileExcelOutlined style={{ color: "#1677ff" }} />
                      </p>
                      <p className="ant-upload-text">
                        点击或拖拽文件到此区域上传
                      </p>
                      <p className="ant-upload-hint">
                        支持 .csv, .xlsx 格式，最大支持 10MB
                      </p>
                    </Upload.Dragger>
                  </div>
                ),
              },
            ]}
          />
        ) : (
          renderFormContent(modalMode === "view")
        )}
      </Modal>
    </div>
  );
};

export default EnterpriseData;
