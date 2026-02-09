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
  CheckCircleOutlined, // 修复：补充导入
} from "@ant-design/icons";
import type { TableProps } from "antd";
const { Text } = Typography;
const { confirm } = Modal;

// --- Mock Data (保持不变) ---
const MOCK_TAG_OPTIONS = {
  basic: [
    "注册资本超1亿",
    "注册资本超5千万",
    "实缴资本100%",
    "成立10年以上",
    "成立5-10年",
    "成立1-3年",
    "朝阳区注册",
    "海淀区注册",
    "外商独资",
    "中外合资",
    "国有控股",
    "自然人独资",
    "一般纳税人",
    "小规模纳税人",
    "集团总部",
    "分支机构",
    "园区入驻企业",
    "集群注册",
  ],
  business: [
    "数字医疗",
    "医疗器械",
    "体外诊断(IVD)",
    "医学影像",
    "康复设备",
    "家用医疗",
    "创新药研发",
    "生物制药",
    "CRO/CMO",
    "医药电商",
    "互联网医院",
    "智慧养老",
    "基因测序",
    "靶向治疗",
    "免疫治疗",
    "干细胞技术",
    "脑机接口",
    "医疗大数据",
  ],
  tech: [
    "国家高新技术企业",
    "中关村高新",
    "专精特新'小巨人'",
    "省级专精特新",
    "科技型中小企业",
    "CMMI5认证",
    "ISO9001认证",
    "知识产权贯标",
    "发明专利超50项",
    "发明专利10-50项",
    "拥有PCT专利",
    "软件著作权超100项",
    "国家级企业技术中心",
    "省级工程实验室",
  ],
  risk: [
    "信用评级AAA",
    "信用评级AA",
    "信用良好",
    "无失信记录",
    "无行政处罚",
    "连续3年纳税信用A",
    "法律诉讼低风险",
    "经营状况稳定",
    "现金流充足",
    "存在经营异常(已移除)",
    "有历史被执行记录",
    "关联企业风险",
    "股权质押风险",
  ],
  market: [
    "A股上市",
    "港股上市",
    "美股上市",
    "科创板上市",
    "新三板挂牌",
    "拟上市",
    "独角兽企业",
    "潜在独角兽",
    "瞪羚企业",
    "估值超10亿",
    "估值超50亿",
    "A轮融资",
    "B轮融资",
    "C轮融资",
    "战略融资",
    "IPO基石投资",
  ],
};

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
  const [popoverOpenState, setPopoverOpenState] = useState<
    Record<string, boolean>
  >({});

  // 编辑模式状态管理
  const [editingKeys, setEditingKeys] = useState<Set<string>>(new Set());

  // 详情弹窗 State
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<EnterpriseData | null>(
    null,
  );

  // --- API ---
  const fetchData = async (page = 1, size = 10, keyword = "") => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:3001/api/tags/companies?page=${page}&pageSize=${size}&keyword=${keyword}`,
      );
      const json = await res.json();
      if (json.success) {
        setData(json.data.list);
        setTotal(json.data.total);
        setCurrentPage(page);
      } else {
        message.error(json.message);
      }
    } catch (err) {
      // 演示用，忽略错误
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1, pageSize);
  }, []);

  // --- Handlers ---

  const handleSearch = (value: string) => {
    setSearchText(value);
    fetchData(1, pageSize, value);
  };

  const toggleEditMode = (key: string) => {
    const newKeys = new Set(editingKeys);
    if (newKeys.has(key)) {
      newKeys.delete(key);
    } else {
      newKeys.add(key);
    }
    setEditingKeys(newKeys);
  };

  const isEditing = (record: EnterpriseData) => editingKeys.has(record.key);

  const handleAddTag = async (
    record: EnterpriseData,
    dimension: DimensionKey,
    tagName: string,
  ) => {
    const popoverKey = `${record.key}_${dimension}`;
    setPopoverOpenState((prev) => ({ ...prev, [popoverKey]: false }));

    if (record.dimensions[dimension].includes(tagName)) {
      message.warning("该标签已存在");
      return;
    }

    const newData = data.map((item) => {
      if (item.key === record.key) {
        return {
          ...item,
          dimensions: {
            ...item.dimensions,
            [dimension]: [...item.dimensions[dimension], tagName],
          },
        };
      }
      return item;
    });
    setData(newData);

    try {
      await fetch("http://localhost:3001/api/tags/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId: record.key,
          tagName: tagName,
          dimension: dimension,
        }),
      });
      message.success({
        content: "打标成功",
        icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
      });
    } catch (e) {
      // 失败回滚逻辑
    }
  };

  const handleDeleteTagConfirm = (
    record: EnterpriseData,
    dimension: DimensionKey,
    tagName: string,
  ) => {
    confirm({
      title: `确认删除标签 "${tagName}"?`,
      icon: <ExclamationCircleOutlined />,
      content: "删除后该企业的画像将不再包含此标签。",
      okText: "确定",
      okType: "danger",
      cancelText: "取消",
      onOk: async () => {
        const newData = data.map((item) => {
          if (item.key === record.key) {
            return {
              ...item,
              dimensions: {
                ...item.dimensions,
                [dimension]: item.dimensions[dimension].filter(
                  (t) => t !== tagName,
                ),
              },
            };
          }
          return item;
        });
        setData(newData);

        try {
          await fetch("http://localhost:3001/api/tags/delete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              companyId: record.key,
              tagName: tagName,
              dimension: dimension,
            }),
          });
          message.success("标签已删除");
        } catch (e) {
          message.error("删除失败");
          fetchData(currentPage, pageSize, searchText);
        }
      },
    });
  };

  const handleViewDetails = (record: EnterpriseData) => {
    setCurrentRecord(record);
    setViewModalOpen(true);
  };

  // --- Render Helpers ---

  const getDimensionName = (key: string) => {
    const map: Record<string, string> = {
      basic: "基本信息",
      business: "经营业务",
      tech: "科技属性",
      risk: "风险管控",
      market: "市场表现",
    };
    return map[key] || key;
  };

  const renderDimensionCell = (
    tags: string[],
    record: EnterpriseData,
    dimension: DimensionKey,
    color: string,
  ) => {
    const MAX_VISIBLE = 2;
    const editing = isEditing(record);

    const popoverKey = `${record.key}_${dimension}`;
    const isOpen = popoverOpenState[popoverKey] || false;
    const options = MOCK_TAG_OPTIONS[dimension].map((t) => ({
      label: t,
      value: t,
    }));

    const visibleTags = editing ? tags : tags.slice(0, MAX_VISIBLE);
    const hiddenCount = tags.length - MAX_VISIBLE;

    return (
      <div
        style={{
          display: "flex",
          flexWrap: editing ? "wrap" : "nowrap",
          alignItems: "center",
          height: editing ? "auto" : "56px",
          minHeight: "56px",
          overflow: editing ? "visible" : "hidden", // 编辑模式下允许溢出显示(尽管我们加了padding)
          gap: "8px", // 增加间距
          // 修复：编辑模式下增加左侧内边距，防止第一个标签的删除按钮被遮挡
          padding: editing ? "8px 0 8px 10px" : "0",
          transition: "all 0.3s",
        }}
      >
        {visibleTags.map((tag, idx) => (
          <div
            key={`${tag}-${idx}`}
            style={{ position: "relative", display: "inline-block" }}
          >
            <Tag
              color={color}
              style={{
                marginRight: 0,
                maxWidth: editing ? "100%" : "90px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                verticalAlign: "middle",
                // 稍微增加 Tag 内部左padding，让文字不至于离删除按钮太近
                paddingLeft: editing ? 8 : 7,
              }}
            >
              <Tooltip title={tag}>{tag}</Tooltip>
            </Tag>
            {editing && (
              <CloseCircleFilled
                style={{
                  position: "absolute",
                  top: -6,
                  left: -6,
                  color: "#ff4d4f",
                  background: "#fff",
                  borderRadius: "50%",
                  cursor: "pointer",
                  fontSize: "14px",
                  zIndex: 2,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteTagConfirm(record, dimension, tag);
                }}
              />
            )}
          </div>
        ))}

        {!editing && hiddenCount > 0 && (
          <Tooltip
            title={
              <div>
                {tags.slice(MAX_VISIBLE).map((t) => (
                  <div key={t}>{t}</div>
                ))}
                <div style={{ fontSize: 12, color: "#aaa", marginTop: 4 }}>
                  点击操作列"编辑"或"查看"浏览全部
                </div>
              </div>
            }
          >
            <Tag style={{ marginRight: 0, cursor: "pointer" }}>
              +{hiddenCount}
            </Tag>
          </Tooltip>
        )}

        {editing && (
          <Popover
            content={
              <div style={{ width: 280 }}>
                <div style={{ marginBottom: 8, color: "#999", fontSize: 12 }}>
                  添加{getDimensionName(dimension)}标签:
                </div>
                <Select
                  showSearch
                  placeholder="请选择"
                  style={{ width: "100%" }}
                  options={options}
                  onChange={(val) => handleAddTag(record, dimension, val)}
                  autoFocus={true}
                  defaultOpen={true}
                />
              </div>
            }
            trigger="click"
            open={isOpen}
            onOpenChange={(visible) =>
              setPopoverOpenState((prev) => ({
                ...prev,
                [popoverKey]: visible,
              }))
            }
            placement="bottomLeft"
            overlayStyle={{ zIndex: 1000 }}
          >
            <Tag
              className="site-tag-plus"
              style={{
                background: "#fff",
                borderStyle: "dashed",
                cursor: "pointer",
                marginRight: 0,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 24,
                padding: 0,
              }}
              onClick={(e) => {
                e.stopPropagation();
                setPopoverOpenState({ [popoverKey]: true });
              }}
            >
              <PlusOutlined style={{ fontSize: 10 }} />
            </Tag>
          </Popover>
        )}
      </div>
    );
  };

  const columns: TableProps<EnterpriseData>["columns"] = [
    {
      title: "企业名称 & 统一社会信用代码",
      key: "info",
      width: 180,
      fixed: "left",
      render: (_, record) => (
        <Space direction="vertical" size={0} style={{ width: "100%" }}>
          <Text
            strong
            style={{ fontSize: 14 }}
            ellipsis={{ tooltip: record.name }}
          >
            {record.name}
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            统一社会信用代码: 666666666888888888
          </Text>
        </Space>
      ),
    },
    {
      title: "基本信息",
      dataIndex: ["dimensions", "basic"],
      key: "basic",
      width: 180,
      render: (tags, record) =>
        renderDimensionCell(tags, record, "basic", "cyan"),
    },
    {
      title: "经营业务",
      dataIndex: ["dimensions", "business"],
      key: "business",
      width: 180,
      render: (tags, record) =>
        renderDimensionCell(tags, record, "business", "blue"),
    },
    {
      title: "科技属性",
      dataIndex: ["dimensions", "tech"],
      key: "tech",
      width: 180,
      render: (tags, record) =>
        renderDimensionCell(tags, record, "tech", "purple"),
    },
    {
      title: "风险管控",
      dataIndex: ["dimensions", "risk"],
      key: "risk",
      width: 180,
      render: (tags, record) =>
        renderDimensionCell(tags, record, "risk", "red"),
    },
    {
      title: "市场表现",
      dataIndex: ["dimensions", "market"],
      key: "market",
      width: 180,
      render: (tags, record) =>
        renderDimensionCell(tags, record, "market", "gold"),
    },
    {
      title: "操作",
      key: "action",
      width: 140,
      fixed: "right",
      align: "center",
      render: (_, record) => {
        const editing = isEditing(record);
        return (
          <Space split={<Divider type="vertical" />}>
            <Button
              type="link"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetails(record)}
              style={{ padding: 0 }}
              disabled={editing}
            >
              查看
            </Button>
            <Button
              type={editing ? "primary" : "link"}
              size="small"
              icon={editing ? <CheckOutlined /> : <EditOutlined />}
              onClick={() => toggleEditMode(record.key)}
              style={{ padding: editing ? "0 8px" : 0 }}
            >
              {editing ? "完成" : "编辑"}
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <div style={{ minHeight: "100%", padding: 24, background: "#f5f7fa" }}>
      <Card bordered={false} style={{ marginBottom: 16 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Space size="large">
            <Input.Search
              placeholder="搜索企业..."
              allowClear
              enterButton={<Button icon={<SearchOutlined />}>搜索</Button>}
              size="large"
              onSearch={handleSearch}
              style={{ width: 350 }}
            />
            <div style={{ color: "#888", fontSize: 13 }}>
              <TagsOutlined style={{ marginRight: 6 }} />
              点击表格右侧 <EditOutlined /> 开启编辑模式，可进行增删操作
            </div>
          </Space>

          <Button type="primary" onClick={() => fetchData(1, pageSize)}>
            <ReloadOutlined /> 刷新数据
          </Button>
        </div>
      </Card>

      <Card bordered={false} bodyStyle={{ padding: "0 24px 24px" }}>
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showTotal: (t) => `共 ${t} 条`,
            onChange: (p, s) => {
              setPageSize(s);
              fetchData(p, s, searchText);
            },
          }}
          scroll={{ x: 1500 }}
          rowKey="key"
          size="middle"
        />
      </Card>

      <Modal
        title={
          <Space>
            <TagsOutlined />
            <span>企业标签全景 - {currentRecord?.name}</span>
          </Space>
        }
        open={viewModalOpen}
        onCancel={() => setViewModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalOpen(false)}>
            关闭
          </Button>,
        ]}
        width={800}
      >
        {currentRecord && (
          <Descriptions column={1} layout="vertical" bordered size="small">
            <Descriptions.Item
              label={
                <Space>
                  <span style={{ color: "#13c2c2" }}>●</span> 基本信息维度
                </Space>
              }
            >
              {currentRecord.dimensions.basic.length > 0 ? (
                currentRecord.dimensions.basic.map((t) => (
                  <Tag color="cyan" key={t} style={{ marginBottom: 4 }}>
                    {t}
                  </Tag>
                ))
              ) : (
                <Text type="secondary">暂无标签</Text>
              )}
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <Space>
                  <span style={{ color: "#1890ff" }}>●</span> 经营业务维度
                </Space>
              }
            >
              {currentRecord.dimensions.business.length > 0 ? (
                currentRecord.dimensions.business.map((t) => (
                  <Tag color="blue" key={t} style={{ marginBottom: 4 }}>
                    {t}
                  </Tag>
                ))
              ) : (
                <Text type="secondary">暂无标签</Text>
              )}
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <Space>
                  <span style={{ color: "#722ed1" }}>●</span> 科技属性维度
                </Space>
              }
            >
              {currentRecord.dimensions.tech.length > 0 ? (
                currentRecord.dimensions.tech.map((t) => (
                  <Tag color="purple" key={t} style={{ marginBottom: 4 }}>
                    {t}
                  </Tag>
                ))
              ) : (
                <Text type="secondary">暂无标签</Text>
              )}
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <Space>
                  <span style={{ color: "#f5222d" }}>●</span> 风险管控维度
                </Space>
              }
            >
              {currentRecord.dimensions.risk.length > 0 ? (
                currentRecord.dimensions.risk.map((t) => (
                  <Tag color="red" key={t} style={{ marginBottom: 4 }}>
                    {t}
                  </Tag>
                ))
              ) : (
                <Text type="secondary">暂无标签</Text>
              )}
            </Descriptions.Item>

            <Descriptions.Item
              label={
                <Space>
                  <span style={{ color: "#faad14" }}>●</span> 市场表现维度
                </Space>
              }
            >
              {currentRecord.dimensions.market.length > 0 ? (
                currentRecord.dimensions.market.map((t) => (
                  <Tag color="gold" key={t} style={{ marginBottom: 4 }}>
                    {t}
                  </Tag>
                ))
              ) : (
                <Text type="secondary">暂无标签</Text>
              )}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default EnterpriseTag;
