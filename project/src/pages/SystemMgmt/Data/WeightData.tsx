import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Slider,
  Table,
  InputNumber,
  Typography,
  Space,
  Tag,
  message,
  Popconfirm,
  Empty,
  Divider,
} from "antd";
import {
  SaveOutlined,
  ReloadOutlined,
  DeleteOutlined,
  SafetyCertificateOutlined,
  ExperimentOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import * as echarts from "echarts";

const { Title, Text } = Typography;

// --- 类型定义 ---
interface Rule {
  id: number;
  dimension_id: number;
  rule_label: string;
  score: number;
  [key: string]: any;
}

interface Dimension {
  id: number;
  model_key: string;
  dimension_name: string;
  weight: number;
  is_deduction?: number;
  rules: Rule[];
  [key: string]: any;
}

interface EvaluationModel {
  id: number;
  model_key: string;
  model_name: string;
  target_type: "ENTERPRISE" | "INDUSTRY";
  description?: string;
}

// 预定义色盘
const PALETTE = [
  "#5B8FF9",
  "#5AD8A6",
  "#5D7092",
  "#F6BD16",
  "#E8684A",
  "#6DC8EC",
  "#9270CA",
  "#FF9D4D",
  "#269A99",
  "#FF99C3",
];

const WeightData: React.FC = () => {
  // --- State ---
  // 移除 targetType 状态，固定为企业模型
  const [allModels, setAllModels] = useState<EvaluationModel[]>([]);
  const [selectedModelKey, setSelectedModelKey] = useState<string>("");
  const [dimensions, setDimensions] = useState<Dimension[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [saving, setSaving] = useState(false);

  // ECharts Ref
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  // --- Fetch Data ---
  useEffect(() => {
    const fetchModels = async () => {
      setLoadingModels(true);
      try {
        const res = await fetch("http://localhost:3001/api/evaluation/models");
        const data = await res.json();
        if (data.success) {
          // 核心逻辑修改：仅筛选并展示 target_type 为 'ENTERPRISE' 的模型
          const enterpriseModels = data.data.filter(
            (m: any) => m.target_type === "ENTERPRISE",
          );
          setAllModels(enterpriseModels);

          if (enterpriseModels.length > 0) {
            setSelectedModelKey(enterpriseModels[0].model_key);
          }
        }
      } catch (error) {
        message.error("获取模型列表失败");
      } finally {
        setLoadingModels(false);
      }
    };
    fetchModels();
  }, []);

  const fetchModelDetails = async (key: string) => {
    if (!key) return;
    setLoadingDetails(true);
    try {
      const res = await fetch(
        `http://localhost:3001/api/evaluation/model-details?modelKey=${key}`,
      );
      const data = await res.json();
      if (data.success) {
        setDimensions(data.data);
      } else {
        message.error(data.message);
      }
    } catch (error) {
      message.error("获取模型详情失败");
    } finally {
      setLoadingDetails(false);
    }
  };

  useEffect(() => {
    fetchModelDetails(selectedModelKey);
  }, [selectedModelKey]);

  // --- Computations ---
  // 不再依赖 targetType 过滤，allModels 已经是过滤后的数据
  const displayedModels = allModels;

  // 计算总权重 (排除扣分项)
  const totalWeight = useMemo(() => {
    const sum = dimensions
      .filter((d) => !d.is_deduction)
      .reduce((acc, cur) => acc + Number(cur.weight || 0), 0);
    return parseFloat(sum.toFixed(2));
  }, [dimensions]);

  // 环形图数据构造
  const chartData = useMemo(() => {
    const data = dimensions
      .filter((d) => !d.is_deduction)
      .map((d) => ({
        name: d.dimension_name,
        value: Number(d.weight),
        isPlaceholder: false,
      }));

    if (totalWeight < 100) {
      const remaining = parseFloat((100 - totalWeight).toFixed(2));
      if (remaining > 0) {
        data.push({
          name: "__placeholder__",
          value: remaining,
          isPlaceholder: true,
        });
      }
    }

    return data;
  }, [dimensions, totalWeight]);

  // --- ECharts Effect ---
  useEffect(() => {
    if (!chartRef.current) return;

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    const instance = chartInstance.current;

    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: "item",
        formatter: (params: any) => {
          if (params.data.isPlaceholder) return "";
          return `${params.marker} ${params.name}: <b>${params.value}%</b>`;
        },
        showContent: true,
      },
      legend: {
        top: "middle",
        right: "0%",
        orient: "vertical",
        data: chartData.filter((d) => !d.isPlaceholder).map((d) => d.name),
        itemWidth: 10,
        itemHeight: 10,
        textStyle: { fontSize: 12 },
      },
      title: {
        text: `{label|Total}\n{val|${totalWeight}}`,
        left: "35%",
        top: "center",
        textAlign: "center",
        textStyle: {
          rich: {
            label: {
              fontSize: 14,
              color: "#999",
              padding: [0, 0, 4, 0],
            },
            val: {
              fontSize: 36,
              fontWeight: "bold",
              color:
                totalWeight === 100
                  ? "#333"
                  : totalWeight > 100
                    ? "#ff4d4f"
                    : "#faad14",
            },
          },
        },
      },
      series: [
        {
          name: "权重分布",
          type: "pie",
          radius: ["60%", "85%"],
          center: ["35%", "50%"],
          avoidLabelOverlap: false,
          label: { show: false },
          itemStyle: {
            borderRadius: 4,
            borderColor: "#fff",
            borderWidth: 2,
          },
          emphasis: {
            scale: true,
            scaleSize: 5,
          },
          data: chartData.map((d) => {
            if (d.isPlaceholder) {
              return {
                value: d.value,
                name: d.name,
                isPlaceholder: true,
                itemStyle: {
                  color: "rgba(0,0,0,0)",
                  borderWidth: 0,
                },
                tooltip: { show: false },
                cursor: "default",
                emphasis: { disabled: true },
                silent: true,
              };
            }

            const realIndex = dimensions
              .filter((dim) => !dim.is_deduction)
              .findIndex((dim) => dim.dimension_name === d.name);
            const itemColor = PALETTE[realIndex % PALETTE.length];

            return {
              value: d.value,
              name: d.name,
              isPlaceholder: false,
              itemStyle: { color: itemColor },
            };
          }),
        },
      ],
    };

    instance.setOption(option, true);

    const handleResize = () => instance.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      instance.dispose();
      chartInstance.current = null;
    };
  }, [chartData, totalWeight, dimensions]);

  // 表格数据源
  const tableDataSource = useMemo(() => {
    const rows: any[] = [];
    dimensions.forEach((dim) => {
      if (dim.rules && dim.rules.length > 0) {
        dim.rules.forEach((rule, index) => {
          rows.push({
            key: `${dim.id}-${rule.id}`,
            dimId: dim.id,
            dimName: dim.dimension_name,
            dimWeight: dim.weight,
            isDeduction: dim.is_deduction,
            ruleId: rule.id,
            ruleLabel: rule.rule_label,
            score: rule.score,
            rowSpan: index === 0 ? dim.rules.length : 0,
          });
        });
      } else {
        rows.push({
          key: `${dim.id}-no-rule`,
          dimId: dim.id,
          dimName: dim.dimension_name,
          dimWeight: dim.weight,
          isDeduction: dim.is_deduction,
          ruleId: null,
          ruleLabel: "暂无规则",
          score: 0,
          rowSpan: 1,
        });
      }
    });
    return rows;
  }, [dimensions]);

  // --- Handlers ---
  const handleWeightChange = (dimId: number, val: number) => {
    setDimensions((prev) =>
      prev.map((d) => (d.id === dimId ? { ...d, weight: val } : d)),
    );
  };

  const handleScoreChange = (
    dimId: number,
    ruleId: number,
    val: number | null,
  ) => {
    setDimensions((prev) =>
      prev.map((d) => {
        if (d.id === dimId) {
          return {
            ...d,
            rules: d.rules.map((r) =>
              r.id === ruleId ? { ...r, score: val || 0 } : r,
            ),
          };
        }
        return d;
      }),
    );
  };

  const handleDeleteRule = async (ruleId: number) => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/evaluation/rule/${ruleId}`,
        {
          method: "DELETE",
        },
      );
      const data = await res.json();
      if (data.success) {
        message.success("规则删除成功");
        fetchModelDetails(selectedModelKey);
      } else {
        message.error("删除失败：" + data.message);
      }
    } catch (err) {
      message.error("网络异常");
    }
  };

  const handleSave = async () => {
    if (totalWeight !== 100) {
      message.warning(
        `当前评分维度的总权重为 ${totalWeight}%，请调整至 100% 后保存`,
      );
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("http://localhost:3001/api/evaluation/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modelKey: selectedModelKey,
          dimensions: dimensions,
        }),
      });
      const data = await res.json();
      if (data.success) {
        message.success("配置保存成功");
      } else {
        message.error("保存失败：" + data.message);
      }
    } catch (err) {
      message.error("网络异常");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    fetchModelDetails(selectedModelKey);
    message.info("已重置为上次保存的状态");
  };

  // --- Render Helpers ---
  const currentModelName = allModels.find(
    (m) => m.model_key === selectedModelKey,
  )?.model_name;

  const columns = [
    {
      title: "评分维度",
      dataIndex: "dimName",
      key: "dimName",
      width: 300,
      onCell: (record: any) => ({
        rowSpan: record.rowSpan,
      }),
      render: (text: string, record: any) => (
        <Space direction="vertical" size={2}>
          <Space>
            {record.isDeduction === 1 && (
              <Tag color="error" icon={<MinusCircleOutlined />}>
                扣分项
              </Tag>
            )}
            <Text delete={record.isDeduction === 1}>{text}</Text>
          </Space>
          <Tag color={record.isDeduction === 1 ? "default" : "blue"}>
            权重 {record.dimWeight}%
          </Tag>
        </Space>
      ),
    },
    {
      title: "规则详情 (Condition)",
      dataIndex: "ruleLabel",
      key: "ruleLabel",
    },
    {
      title: "得分值 (Score)",
      dataIndex: "score",
      key: "score",
      width: 150,
      render: (val: number, record: any) => (
        <InputNumber
          value={val}
          onChange={(v) => handleScoreChange(record.dimId, record.ruleId, v)}
          style={{ width: "100%" }}
        />
      ),
    },
    {
      title: "操作",
      key: "action",
      width: 100,
      render: (_: any, record: any) =>
        record.ruleId ? (
          <Popconfirm
            title="确定删除该规则吗?"
            onConfirm={() => handleDeleteRule(record.ruleId)}
          >
            <Button type="text" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        ) : null,
    },
  ];

  return (
    <div style={{ paddingBottom: 24 }}>
      {/* 区块一：顶部功能区 */}
      <Card bordered={false} style={{ marginBottom: 16 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Space size="large">
            {/* 移除 Radio.Group 切换 */}
            <Title level={4} style={{ margin: 0 }}>
              <SafetyCertificateOutlined
                style={{ marginRight: 8, color: "#1890ff" }}
              />
              配置企业评分模型的评分权重
            </Title>
            <Divider type="vertical" />
            <Text type="secondary">
              配置各模型的评分维度及权重，当前选中：{currentModelName}
            </Text>
          </Space>

          <Space>
            <Button icon={<ReloadOutlined />} onClick={handleReset}>
              重置
            </Button>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSave}
              loading={saving}
            >
              保存配置
            </Button>
          </Space>
        </div>
      </Card>

      {/* 区块二：评分模型选择区 */}
      <Card
        bordered={false}
        style={{ marginBottom: 16 }}
        loading={loadingModels}
      >
        <Title level={5} style={{ marginBottom: 16 }}>
          选择评分模型
        </Title>
        <Row gutter={[16, 16]}>
          {displayedModels.map((model) => {
            const isSelected = selectedModelKey === model.model_key;
            return (
              <Col
                xs={24}
                sm={12}
                md={8}
                lg={4.8}
                xl={4.8}
                key={model.id}
                style={{ flex: "1 0 20%" }}
              >
                <Card
                  hoverable
                  onClick={() => setSelectedModelKey(model.model_key)}
                  style={{
                    cursor: "pointer",
                    borderColor: isSelected ? "#1890ff" : undefined,
                    backgroundColor: isSelected ? "#e6f7ff" : undefined,
                  }}
                >
                  <Space
                    direction="vertical"
                    align="center"
                    style={{ width: "100%" }}
                  >
                    {/* 统一使用 SafetyCertificateOutlined 或根据业务需要添加图标 */}
                    <SafetyCertificateOutlined
                      style={{
                        fontSize: 24,
                        color: isSelected ? "#1890ff" : "#8c8c8c",
                      }}
                    />
                    <Text
                      strong
                      style={{ color: isSelected ? "#1890ff" : undefined }}
                    >
                      {model.model_name}
                    </Text>
                  </Space>
                </Card>
              </Col>
            );
          })}
          {!loadingModels && displayedModels.length === 0 && (
            <Empty description="暂无评分模型" />
          )}
        </Row>
      </Card>

      {dimensions.length > 0 ? (
        <>
          {/* 区块三：权重配置与预览区 */}
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={14}>
              <Card
                title="评分维度权重分配"
                bordered={false}
                style={{ height: "100%" }}
              >
                <Space
                  direction="vertical"
                  style={{ width: "100%" }}
                  size="middle"
                >
                  <div
                    style={{
                      maxHeight: 350,
                      overflowY: "auto",
                      paddingRight: 10,
                    }}
                  >
                    {dimensions.map((dim) => {
                      const isDeduction = dim.is_deduction === 1;
                      return (
                        <Row
                          key={dim.id}
                          align="middle"
                          style={{
                            marginBottom: 12,
                            opacity: isDeduction ? 0.6 : 1,
                          }}
                        >
                          <Col span={6}>
                            <Space>
                              {isDeduction && (
                                <Tag
                                  color="error"
                                  style={{ margin: 0, fontSize: 10 }}
                                >
                                  扣分
                                </Tag>
                              )}
                              <Text delete={isDeduction}>
                                {dim.dimension_name}
                              </Text>
                            </Space>
                          </Col>
                          <Col span={14}>
                            <Slider
                              min={0}
                              max={100}
                              value={dim.weight}
                              onChange={(v) => handleWeightChange(dim.id, v)}
                              trackStyle={{
                                backgroundColor: isDeduction
                                  ? "#ffccc7"
                                  : "#1890ff",
                              }}
                            />
                          </Col>
                          <Col span={4} style={{ textAlign: "right" }}>
                            <Tag color={isDeduction ? "volcano" : "blue"}>
                              {dim.weight}%
                            </Tag>
                          </Col>
                        </Row>
                      );
                    })}
                  </div>
                </Space>
              </Card>
            </Col>
            <Col span={10}>
              <Card
                title="权重分布预览"
                bordered={false}
                style={{ height: "100%" }}
              >
                <div ref={chartRef} style={{ height: 350, width: "100%" }} />
              </Card>
            </Col>
          </Row>

          {/* 区块四：评分维度规则管理区 */}
          <Card
            title={
              <Space>
                <ExperimentOutlined /> 详细规则管理
              </Space>
            }
            bordered={false}
          >
            <Table
              columns={columns}
              dataSource={tableDataSource}
              bordered
              pagination={false}
              loading={loadingDetails}
              scroll={{ y: 500 }}
              size="middle"
            />
          </Card>
        </>
      ) : (
        <Card>
          <Empty
            description={
              selectedModelKey ? "该模型暂无维度配置" : "请先选择一个评分模型"
            }
          />
        </Card>
      )}
    </div>
  );
};

export default WeightData;
