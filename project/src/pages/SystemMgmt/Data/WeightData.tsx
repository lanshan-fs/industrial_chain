import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Radio,
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
  BarChartOutlined,
  SafetyCertificateOutlined,
  ExperimentOutlined,
  BankOutlined,
  ApartmentOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { Pie } from "@ant-design/plots";

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
  const [targetType, setTargetType] = useState<"ENTERPRISE" | "INDUSTRY">(
    "ENTERPRISE",
  );
  const [allModels, setAllModels] = useState<EvaluationModel[]>([]);
  const [selectedModelKey, setSelectedModelKey] = useState<string>("");
  const [dimensions, setDimensions] = useState<Dimension[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [saving, setSaving] = useState(false);

  // --- Fetch Data ---
  useEffect(() => {
    const fetchModels = async () => {
      setLoadingModels(true);
      try {
        const res = await fetch("http://localhost:3001/api/evaluation/models");
        const data = await res.json();
        if (data.success) {
          setAllModels(data.data);
          if (data.data.length > 0) {
            const first = data.data.find(
              (m: any) => m.target_type === "ENTERPRISE",
            );
            if (first) setSelectedModelKey(first.model_key);
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
  const displayedModels = useMemo(() => {
    return allModels.filter((m) => m.target_type === targetType);
  }, [allModels, targetType]);

  // 计算总权重 (排除扣分项)
  const totalWeight = useMemo(() => {
    return dimensions
      .filter((d) => !d.is_deduction)
      .reduce((acc, cur) => acc + (cur.weight || 0), 0);
  }, [dimensions]);

  // 环形图数据构造
  const chartData = useMemo(() => {
    // 1. 正常数据
    const data = dimensions
      .filter((d) => !d.is_deduction)
      .map((d) => ({
        type: d.dimension_name,
        value: d.weight,
        isPlaceholder: false,
      }));

    // 2. 占位数据 (如果不足100%)
    if (totalWeight < 100) {
      data.push({
        type: "未分配 (剩余)",
        value: 100 - totalWeight,
        isPlaceholder: true,
      });
    }
    return data;
  }, [dimensions, totalWeight]);

  // 表格数据
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
  const handleTargetTypeChange = (e: any) => {
    const newType = e.target.value;
    setTargetType(newType);
    const firstModel = allModels.find((m) => m.target_type === newType);
    if (firstModel) {
      setSelectedModelKey(firstModel.model_key);
    } else {
      setSelectedModelKey("");
      setDimensions([]);
    }
  };

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

  // 修复后的 PieConfig
  const pieConfig = {
    data: chartData,
    angleField: "value",
    colorField: "type",
    innerRadius: 0.55, // 增加圆环厚度
    radius: 0.85,
    autoFit: true, // 确保自适应容器
    // 颜色映射逻辑
    color: (datum: any) => {
      if (datum.isPlaceholder) return "#f0f0f0"; // 占位符颜色

      // 找到当前数据在真实维度中的索引，以分配固定的颜色
      const realDims = chartData.filter((d) => !d.isPlaceholder);
      const idx = realDims.findIndex((d) => d.type === datum.type);
      return PALETTE[idx % PALETTE.length];
    },
    // 标签配置：使用 content 或 formatter，避免使用 render
    label: {
      text: "value",
      style: {
        fontWeight: "bold",
        fontSize: 12,
      },
      position: "spider",
      formatter: (text: string, item: any) => {
        if (item.isPlaceholder) return ""; // 隐藏占位符标签
        return `${text}%`;
      },
    },
    legend: {
      color: {
        title: false,
        position: "right",
        rowPadding: 5,
        itemMarker: (_: string, _idx: number, item: any) => {
          return { symbol: "circle", style: { fill: item.color } };
        },
      },
    },
    // 提示信息配置
    tooltip: {
      formatter: (datum: any) => {
        return { name: datum.type, value: datum.value + "%" };
      },
    },
    // 中心文本配置
    annotations: [
      {
        type: "text",
        style: {
          text: `Total\n${totalWeight}`,
          x: "50%",
          y: "50%",
          textAlign: "center",
          fontSize: 28,
          fontWeight: "bold",
          fill:
            totalWeight === 100
              ? "#333"
              : totalWeight > 100
                ? "#cf1322"
                : "#faad14",
        },
      },
      {
        type: "text",
        style: {
          text:
            totalWeight > 100
              ? "已溢出"
              : totalWeight < 100
                ? "未分配"
                : "完美",
          x: "50%",
          y: "60%",
          textAlign: "center",
          fontSize: 12,
          fill: "#999",
        },
      },
    ],
    interactions: [{ type: "element-active" }],
  };

  const columns = [
    {
      title: "评分维度",
      dataIndex: "dimName",
      key: "dimName",
      width: 200,
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
            <Radio.Group
              value={targetType}
              onChange={handleTargetTypeChange}
              buttonStyle="solid"
            >
              <Radio.Button value="ENTERPRISE">
                <Space>
                  <BankOutlined /> 企业评分模型
                </Space>
              </Radio.Button>
              <Radio.Button value="INDUSTRY">
                <Space>
                  <ApartmentOutlined /> 行业评分模型
                </Space>
              </Radio.Button>
            </Radio.Group>

            <Divider type="vertical" />

            <Title level={4} style={{ margin: 0 }}>
              {currentModelName || "请选择模型"}
            </Title>
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
          模型切换
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
                    {model.target_type === "ENTERPRISE" ? (
                      <SafetyCertificateOutlined
                        style={{
                          fontSize: 24,
                          color: isSelected ? "#1890ff" : "#8c8c8c",
                        }}
                      />
                    ) : (
                      <BarChartOutlined
                        style={{
                          fontSize: 24,
                          color: isSelected ? "#1890ff" : "#8c8c8c",
                        }}
                      />
                    )}
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
            <Empty description="暂无该类型模型" />
          )}
        </Row>
      </Card>

      {dimensions.length > 0 ? (
        <>
          {/* 区块三：权重配置与预览区 */}
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={14}>
              <Card
                title="权重配置"
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
                title="权重分布预览 (正向指标)"
                bordered={false}
                style={{ height: "100%" }}
              >
                <div style={{ height: 350 }}>
                  {/* @ts-ignore */}
                  <Pie {...pieConfig} />
                </div>
              </Card>
            </Col>
          </Row>

          {/* 区块四：评分维度规则管理区 */}
          <Card
            title={
              <Space>
                <ExperimentOutlined /> 评分规则管理
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
