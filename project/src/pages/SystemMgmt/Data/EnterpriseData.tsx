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
  Typography,
  Tooltip,
} from "antd";
import type { TableProps } from "antd";
import {
  PlusOutlined,
  ImportOutlined,
  ReloadOutlined,
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
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit" | "view">("add");
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");

  const fetchData = async (page = 1, size = 15, keyword = "") => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/system/companies?page=${page}&pageSize=${size}&keyword=${keyword}`);
      const result = await response.json();
      if (result.success) {
        setData(result.data);
        setTotal(result.total);
        setCurrentPage(page);
      } else {
        message.error("获取数据失败：" + result.message);
      }
    } catch (error) {
      message.error("网络请求错误");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1, pageSize);
  }, []);

  const handleSearch = (val: string) => {
    setSearchText(val);
    fetchData(1, pageSize, val);
  };

  const handleOk = async () => {
    if (modalMode === "view") {
      setIsModalOpen(false);
      return;
    }

    try {
      const values = await form.validateFields();
      const url = modalMode === "add" 
        ? "http://localhost:3001/api/system/companies" 
        : `http://localhost:3001/api/system/companies/${editingKey}`;
      
      const res = await fetch(url, {
        method: modalMode === "add" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });
      const result = await res.json();

      if (result.success) {
        message.success(modalMode === "add" ? "新增成功" : "修改成功");
        setIsModalOpen(false);
        fetchData(currentPage, pageSize, searchText);
      } else {
        message.error(result.message);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (key: string) => {
    try {
      const res = await fetch(`http://localhost:3001/api/system/companies/${key}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        message.success("删除成功");
        fetchData(currentPage, pageSize, searchText);
      }
    } catch (e) {
      message.error("删除失败");
    }
  };

  const columns: TableProps<EnterpriseDataType>["columns"] = [
    {
      title: "企业名称",
      dataIndex: "name",
      key: "name",
      width: 200,
      ellipsis: true,
      render: (text) => <Typography.Text strong style={{ color: "#1677ff" }}>{text}</Typography.Text>,
    },
    {
      title: "信用代码",
      dataIndex: "key",
      key: "key",
      width: 180,
      render: (text) => <Typography.Text type="secondary" copyable>{text}</Typography.Text>,
    },
    { title: "法定代表人", dataIndex: "legalPerson", key: "legalPerson", width: 100 },
    {
      title: "注册资本",
      dataIndex: "registeredCapital",
      key: "registeredCapital",
      width: 120,
      render: (val) => val ? `${val} 万` : "-",
    },
    {
      title: "行业标签",
      dataIndex: "variants",
      key: "variants",
      width: 220,
      ellipsis: true,
      render: (text: string) => {
        if (!text) return <span style={{ color: "#ccc" }}>无标签</span>;
        return text.split("|").map((t, i) => <Tag color="cyan" key={i} style={{ marginBottom: 2 }}>{t.trim()}</Tag>);
      },
    },
    {
      title: "更新时间",
      dataIndex: "updateTime",
      key: "updateTime",
      width: 150,
      render: (val) => val ? new Date(val).toLocaleString() : "-"
    },
    {
      title: "操作",
      key: "action",
      width: 140,
      align: "center",
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" onClick={() => { setModalMode("edit"); setEditingKey(record.key); form.setFieldsValue(record); setIsModalOpen(true); }}>编辑</Button>
          <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record.key)}>
            <Button type="link" danger size="small">删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      {/* AntD v6 中，Card 不再推荐使用 bordered={false}，改为 variant="none" 或保持默认 */}
      <Card style={{ marginBottom: 16 }} styles={{ body: { padding: "16px 24px" } }}>
        <Row justify="space-between">
          <Col><Input.Search placeholder="搜索企业..." onSearch={handleSearch} style={{ width: 350 }} enterButton /></Col>
          <Col>
            <Space>
              <Button type="primary" onClick={() => { setModalMode("add"); setIsModalOpen(true); form.resetFields(); }} icon={<PlusOutlined />}>新增企业</Button>
              <Button icon={<ImportOutlined />}>批量导入</Button>
              <Button onClick={() => fetchData(currentPage, pageSize, searchText)} icon={<ReloadOutlined />}>刷新</Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card styles={{ body: { padding: 0 } }}>
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            onChange: (p, s) => { setPageSize(s); fetchData(p, s, searchText); }
          }}
          rowKey="key"
        />
      </Card>

      <Modal
        title={modalMode === "add" ? "新增企业" : modalMode === "edit" ? "编辑企业" : "查看企业"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="企业名称" rules={[{ required: true }]}><Input /></Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="key" label="统一社会信用代码" rules={[{ required: true }]}><Input disabled={modalMode === "edit"} /></Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}><Form.Item name="legalPerson" label="法定代表人"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name="registeredCapital" label="注册资本(万)"><Input type="number" /></Form.Item></Col>
            <Col span={8}><Form.Item name="establishmentDate" label="成立日期"><Input placeholder="YYYY-MM-DD" /></Form.Item></Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default EnterpriseData;
