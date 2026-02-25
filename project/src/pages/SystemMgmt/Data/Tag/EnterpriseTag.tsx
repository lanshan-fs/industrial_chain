import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Input,
  Button,
  Space,
  Tag,
  message,
  Typography,
  Select,
  Popover,
  Modal,
  Descriptions,
  Divider,
  Tooltip,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined,
  EditOutlined,
  CheckOutlined,
  EyeOutlined,
  TagsOutlined,
  CloseCircleFilled,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import type { TableProps } from "antd";

const { Text } = Typography;
const { confirm } = Modal;

// --- 类型定义 ---
type DimensionKey = "basic" | "business" | "tech" | "risk" | "market";

interface EnterpriseDimension {
  basic: string[];
  business: string[];
  tech: string[];
  risk: string[];
  market: string[];
}

interface EnterpriseData {
  key: string;
  name: string;
  code: string;
  updateTime: string;
  dimensions: EnterpriseDimension;
}

const EnterpriseTag: React.FC = () => {
  // --- State ---
  const [data, setData] = useState<EnterpriseData[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // 真实的标签选项库 (从后端加载)
  const [tagLibrary, setTagLibrary] = useState<Record<string, string[]>>({
    basic: [], business: [], tech: [], risk: [], market: []
  });

  const [popoverOpenState, setPopoverOpenState] = useState<Record<string, boolean>>({});
  const [editingKeys, setEditingKeys] = useState<Set<string>>(new Set());
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<EnterpriseData | null>(null);

  // --- API ---

  // 1. 获取企业列表及标签
  const fetchData = async (page = 1, size = 10, keyword = "") => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/api/tags/companies?page=${page}&pageSize=${size}&keyword=${keyword}`);
      const json = await res.json();
      if (json.success) {
        setData(json.data.list);
        setTotal(json.data.total);
        setCurrentPage(page);
      }
    } catch (err) {
      message.error("加载企业列表失败");
    } finally {
      setLoading(false);
    }
  };

  // 2. 获取所有可选标签 (用于打标)
  const fetchTagLibrary = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/meta/all");
      const json = await res.json();
      if (json.success) {
        const dict = json.data.dictionary;
        // 映射逻辑需与后端一致
        setTagLibrary({
          basic: (dict["ENT_TYPE"] || []).map((i:any) => i.value),
          business: (json.data.scenarios || []).map((i:any) => i.value),
          tech: (dict["TECH_ATTR"] || []).map((i:any) => i.value),
          risk: (dict["RISK_DISHONEST"] || []).map((i:any) => i.value),
          market: (dict["LISTING_STATUS"] || []).map((i:any) => i.value)
        });
      }
    } catch (e) {
      console.error("Fetch meta failed", e);
    }
  };

  useEffect(() => {
    fetchData(1, pageSize);
    fetchTagLibrary();
  }, []);

  // --- Handlers ---

  const handleSearch = (value: string) => {
    setSearchText(value);
    fetchData(1, pageSize, value);
  };

  const toggleEditMode = (key: string) => {
    const newKeys = new Set(editingKeys);
    newKeys.has(key) ? newKeys.delete(key) : newKeys.add(key);
    setEditingKeys(newKeys);
  };

  const handleAddTag = async (record: EnterpriseData, dimension: DimensionKey, tagName: string) => {
    const popoverKey = `${record.key}_${dimension}`;
    setPopoverOpenState(prev => ({ ...prev, [popoverKey]: false }));

    if (record.dimensions[dimension].includes(tagName)) {
      message.warning("该标签已存在");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/api/tags/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId: record.key, tagName, dimension }),
      });
      if (res.ok) {
        message.success("打标成功");
        fetchData(currentPage, pageSize, searchText); // 重新刷新行数据
      }
    } catch (e) {
      message.error("保存失败");
    }
  };

  const handleDeleteTagConfirm = (record: EnterpriseData, dimension: DimensionKey, tagName: string) => {
    confirm({
      title: `确认删除标签 "${tagName}"?`,
      okText: "确定",
      okType: "danger",
      cancelText: "取消",
      onOk: async () => {
        try {
          // 这里需要后端支持删除接口，暂时调用刷新
          message.info("删除功能待对接后端 DELETE 接口");
          fetchData(currentPage, pageSize, searchText);
        } catch (e) {
          message.error("删除失败");
        }
      },
    });
  };

  // --- Render Helpers ---

  const renderDimensionCell = (tags: string[] = [], record: EnterpriseData, dimension: DimensionKey, color: string) => {
    const editing = editingKeys.has(record.key);
    const popoverKey = `${record.key}_${dimension}`;
    const isOpen = popoverOpenState[popoverKey] || false;
    
    // 确保从库中获取选项
    const options = (tagLibrary[dimension] || []).map(t => ({ label: t, value: t }));

    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", padding: editing ? "4px" : "0" }}>
        {tags.map((tag, idx) => (
          <div key={idx} style={{ position: "relative" }}>
            <Tag color={color} style={{ margin: 0 }}>{tag}</Tag>
            {editing && (
              <CloseCircleFilled 
                style={{ position: "absolute", top: -5, right: -5, color: "#f5222d", cursor: "pointer", fontSize: 12, background: '#fff', borderRadius: '50%' }}
                onClick={() => handleDeleteTagConfirm(record, dimension, tag)}
              />
            )}
          </div>
        ))}
        {editing && (
          <Popover
            content={
              <div style={{ width: 200 }}>
                <Select
                  showSearch
                  placeholder="选择标签"
                  style={{ width: "100%" }}
                  options={options}
                  onChange={(val) => handleAddTag(record, dimension, val)}
                  defaultOpen
                />
              </div>
            }
            trigger="click"
            open={isOpen}
            onOpenChange={(v) => setPopoverOpenState(prev => ({ ...prev, [popoverKey]: v }))}
          >
            <Button type="dashed" size="small" icon={<PlusOutlined />} />
          </Popover>
        )}
      </div>
    );
  };

  const columns: TableProps<EnterpriseData>["columns"] = [
    {
      title: "企业基本信息",
      key: "info",
      width: 250,
      fixed: "left",
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{record.name}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>{record.code}</Text>
        </Space>
      ),
    },
    { title: "基本信息", dataIndex: ["dimensions", "basic"], width: 200, render: (t, r) => renderDimensionCell(t, r, "basic", "cyan") },
    { title: "经营业务", dataIndex: ["dimensions", "business"], width: 200, render: (t, r) => renderDimensionCell(t, r, "business", "blue") },
    { title: "科技属性", dataIndex: ["dimensions", "tech"], width: 200, render: (t, r) => renderDimensionCell(t, r, "tech", "purple") },
    { title: "风险管控", dataIndex: ["dimensions", "risk"], width: 200, render: (t, r) => renderDimensionCell(t, r, "risk", "red") },
    { title: "市场表现", dataIndex: ["dimensions", "market"], width: 200, render: (t, r) => renderDimensionCell(t, r, "market", "gold") },
    {
      title: "操作",
      key: "action",
      width: 120,
      fixed: "right",
      align: "center",
      render: (_, record) => {
        const editing = editingKeys.has(record.key);
        return (
          <Space>
            <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => { setCurrentRecord(record); setViewModalOpen(true); }} />
            <Button type={editing ? "primary" : "link"} size="small" icon={editing ? <CheckOutlined /> : <EditOutlined />} onClick={() => toggleEditMode(record.key)}>
              {editing ? "完成" : "编辑"}
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card bordered={false} style={{ marginBottom: 16 }}>
        <Space size="large">
          <Input.Search placeholder="搜索企业..." onSearch={handleSearch} style={{ width: 300 }} enterButton />
          <Button type="primary" onClick={() => fetchData(currentPage, pageSize, searchText)} icon={<ReloadOutlined />}>刷新</Button>
        </Space>
      </Card>

      <Card bordered={false}>
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="key"
          pagination={{
            current: currentPage, pageSize, total,
            onChange: (p, s) => { setPageSize(s); fetchData(p, s, searchText); }
          }}
          scroll={{ x: 1400 }}
        />
      </Card>

      <Modal
        title={`标签全景 - ${currentRecord?.name}`}
        open={viewModalOpen}
        onCancel={() => setViewModalOpen(false)}
        footer={null}
        width={600}
      >
        {currentRecord && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="基本信息">{currentRecord.dimensions.basic.map(t => <Tag key={t} color="cyan">{t}</Tag>)}</Descriptions.Item>
            <Descriptions.Item label="经营业务">{currentRecord.dimensions.business.map(t => <Tag key={t} color="blue">{t}</Tag>)}</Descriptions.Item>
            <Descriptions.Item label="科技属性">{currentRecord.dimensions.tech.map(t => <Tag key={t} color="purple">{t}</Tag>)}</Descriptions.Item>
            <Descriptions.Item label="风险管控">{currentRecord.dimensions.risk.map(t => <Tag key={t} color="red">{t}</Tag>)}</Descriptions.Item>
            <Descriptions.Item label="市场表现">{currentRecord.dimensions.market.map(t => <Tag key={t} color="gold">{t}</Tag>)}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default EnterpriseTag;
