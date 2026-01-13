import React, { useState } from "react";
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
  Select,
  Upload,
  message,
  Popconfirm,
  Tabs,
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
} from "@ant-design/icons";

const { Option } = Select;

// 模拟数据
interface EnterpriseDataType {
  key: string;
  name: string;
  code: string;
  chainLink: string;
  patents: number;
  softwares: number;
  updateTime: string;
}

const initialEnterpriseData: EnterpriseDataType[] = [
  {
    key: "1",
    name: "北京数字医疗科技有限公司",
    code: "91110105MA01...",
    chainLink: "上游研发",
    patents: 24,
    softwares: 12,
    updateTime: "2026-01-12",
  },
  {
    key: "2",
    name: "朝阳区智慧康养中心",
    code: "52110105MJ23...",
    chainLink: "下游服务",
    patents: 5,
    softwares: 8,
    updateTime: "2026-01-10",
  },
  {
    key: "3",
    name: "未来生命科学研究院",
    code: "121000004000...",
    chainLink: "基础研究",
    patents: 156,
    softwares: 45,
    updateTime: "2026-01-13",
  },
  {
    key: "4",
    name: "博爱医疗器械股份公司",
    code: "911100007890...",
    chainLink: "设备生产",
    patents: 88,
    softwares: 30,
    updateTime: "2026-01-09",
  },
  {
    key: "5",
    name: "云端健康大数据中心",
    code: "911101086666...",
    chainLink: "软件开发",
    patents: 12,
    softwares: 120,
    updateTime: "2026-01-11",
  },
];

const EnterpriseData: React.FC = () => {
  const [data, setData] = useState(initialEnterpriseData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");

  const filteredData = data.filter(
    (item) => item.name.includes(searchText) || item.code.includes(searchText)
  );

  const handleOk = () => {
    form.validateFields().then((values) => {
      if (modalMode === "add") {
        const newData = {
          key: Date.now().toString(),
          ...values,
          patents: 0,
          softwares: 0,
          updateTime: new Date().toISOString().split("T")[0],
        };
        setData([newData, ...data]);
        message.success("新增成功 (已写入临时表)");
      } else {
        const newData = data.map((item) =>
          item.key === editingKey ? { ...item, ...values } : item
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
    message.success("删除成功 (已记录日志)");
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
      render: (text) => <a>{text}</a>,
    },
    {
      title: "统一社会信用代码",
      dataIndex: "code",
      key: "code",
      copyable: true,
    },
    {
      title: "产业链环节",
      dataIndex: "chainLink",
      key: "chainLink",
      filters: [
        { text: "上游研发", value: "上游研发" },
        { text: "设备生产", value: "设备生产" },
      ],
      onFilter: (value, record) =>
        record.chainLink.indexOf(value as string) === 0,
    },
    {
      title: "核心评分数据",
      key: "scoreData",
      render: (_, record) => (
        <Space size="small" direction="vertical" style={{ fontSize: 12 }}>
          <Tag color="blue">专利: {record.patents}</Tag>
          <Tag color="cyan">软著: {record.softwares}</Tag>
        </Space>
      ),
    },
    {
      title: "更新时间",
      dataIndex: "updateTime",
      key: "updateTime",
      sorter: (a, b) => a.updateTime.localeCompare(b.updateTime),
    },
    {
      title: "操作",
      key: "action",
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
                placeholder="搜索企业名称/代码..."
                prefix={<SearchOutlined />}
                style={{ width: 250 }}
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
              <Button type="primary" icon={<ImportOutlined />}>
                Excel 导入
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card bordered={false}>
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: 8 }}
        />
      </Card>

      <Modal
        title={modalMode === "add" ? "新增企业主体" : "编辑企业信息"}
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
                  <Form
                    form={form}
                    layout="vertical"
                    initialValues={{ chainLink: "上游研发" }}
                  >
                    <Form.Item
                      name="name"
                      label="企业名称"
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="请输入全称" />
                    </Form.Item>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          name="code"
                          label="社会信用代码"
                          rules={[{ required: true }]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="chainLink" label="产业链环节">
                          <Select>
                            <Option value="上游研发">上游研发</Option>
                            <Option value="设备生产">设备生产</Option>
                            <Option value="下游服务">下游服务</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                ),
              },
              {
                key: "import",
                label: "Excel导入",
                children: (
                  <div style={{ textAlign: "center", padding: "20px 0" }}>
                    <Upload.Dragger>
                      <p className="ant-upload-drag-icon">
                        <FileExcelOutlined />
                      </p>
                      <p className="ant-upload-text">
                        点击或拖拽 Excel 文件到此区域上传
                      </p>
                    </Upload.Dragger>
                    <Button type="link" style={{ marginTop: 10 }}>
                      下载标准导入模板
                    </Button>
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
            <Form.Item
              name="code"
              label="社会信用代码"
              rules={[{ required: true }]}
            >
              <Input disabled />
            </Form.Item>
            <Form.Item name="chainLink" label="产业链环节">
              <Select>
                <Option value="上游研发">上游研发</Option>
                <Option value="设备生产">设备生产</Option>
                <Option value="下游服务">下游服务</Option>
              </Select>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default EnterpriseData;
