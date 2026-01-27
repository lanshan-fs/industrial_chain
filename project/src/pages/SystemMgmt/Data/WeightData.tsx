import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Radio,
  Slider,
  Statistic,
  Progress,
  Table,
  InputNumber,
  Typography,
  Space,
  Tag,
  Divider,
  message,
  Popconfirm,
  Empty,
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

  // 1. 获取所有模型
  useEffect(() => {
    const fetchModels = async () => {
      setLoadingModels(true);
      try {
        const res = await fetch("http://localhost:3001/api/evaluation/models");
        const data = await res.json();
        if (data.success) {
          setAllModels(data.data);
          // 默认选中第一个
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

  // 2. 获取选中模型的详情（维度+规则）
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

  // 根据 TargetType 筛选当前显示的 Models
  const displayedModels = useMemo(() => {
    return allModels.filter((m) => m.target_type === targetType);
  }, [allModels, targetType]);

  // 计算总权重
  const totalWeight = useMemo(() => {
    return dimensions.reduce((acc, cur) => acc + (cur.weight || 0), 0);
  }, [dimensions]);

  // 环形图数据
  const chartData = useMemo(() => {
    return dimensions.map((d) => ({
      type: d.dimension_name,
      value: d.weight,
    }));
  }, [dimensions]);

  // 将维度和规则展平，用于表格展示
  // 使用 rowSpan 实现合并单元格
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
            ruleId: rule.id,
            ruleLabel: rule.rule_label,
            score: rule.score,
            rowSpan: index === 0 ? dim.rules.length : 0,
          });
        });
      } else {
        // 如果没有规则，也显示一行维度信息
        rows.push({
          key: `${dim.id}-no-rule`,
          dimId: dim.id,
          dimName: dim.dimension_name,
          dimWeight: dim.weight,
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
        // 刷新数据
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
      message.warning(`当前总权重为 ${totalWeight}%，请调整至 100% 后保存`);
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

  // Chart Config
  const pieConfig = {
    data: chartData,
    angleField: "value",
    colorField: "type",
    innerRadius: 0.6,
    radius: 0.8,
    label: {
      text: "value",
      style: {
        fontWeight: "bold",
      },
      position: "spider",
    },
    legend: {
      color: {
        title: false,
        position: "right",
        rowPadding: 5,
      },
    },
    annotations: [
      {
        type: "text",
        style: {
          text: "Total\n100",
          x: "50%",
          y: "50%",
          textAlign: "center",
          fontSize: 24,
          fontStyle: "bold",
        },
      },
    ],
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
          <Text strong>{text}</Text>
          <Tag color="blue">权重 {record.dimWeight}%</Tag>
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
          {/* 当不处于加载状态且没有模型时才显示 Empty */}
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
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Statistic
                      title="当前总权重"
                      value={totalWeight}
                      suffix="/ 100%"
                      valueStyle={{
                        color: totalWeight === 100 ? "#3f8600" : "#cf1322",
                      }}
                    />
                    <Progress
                      percent={totalWeight}
                      status={totalWeight === 100 ? "success" : "exception"}
                      style={{ width: 200 }}
                    />
                  </div>
                  <Divider />
                  <div
                    style={{
                      maxHeight: 350,
                      overflowY: "auto",
                      paddingRight: 10,
                    }}
                  >
                    {dimensions.map((dim) => (
                      <Row
                        key={dim.id}
                        align="middle"
                        style={{ marginBottom: 12 }}
                      >
                        <Col span={6}>
                          <Text>{dim.dimension_name}</Text>
                        </Col>
                        <Col span={14}>
                          <Slider
                            min={0}
                            max={100}
                            value={dim.weight}
                            onChange={(v) => handleWeightChange(dim.id, v)}
                          />
                        </Col>
                        <Col span={4} style={{ textAlign: "right" }}>
                          <Tag color="blue">{dim.weight}%</Tag>
                        </Col>
                      </Row>
                    ))}
                  </div>
                </Space>
              </Card>
            </Col>
            <Col span={10}>
              <Card
                title="权重分布实时预览"
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
