import React, { useState, useEffect, useMemo } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Input,
  Row,
  Col,
  Typography,
  Space,
  Button,
  Select,
  Statistic,
  message,
  Tag,
  Divider,
  Collapse,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  DeploymentUnitOutlined,
  MedicineBoxOutlined,
  ExperimentOutlined,
  UsergroupAddOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;
const { Panel } = Collapse;

// --- 类型定义 ---
interface IndustryNode {
  name: string;
  value?: number;
  itemStyle?: { color: string };
  children?: IndustryNode[];
  companies?: string;
  category?: string;
  // 允许其他可能的动态属性
  [key: string]: any;
}

// 定义四大行业的基础颜色
const INDUSTRY_COLORS = {
  数字医疗: "#B3D9FF",
  药物: "#D9C2E0",
  医疗器械: "#B3E6B3",
  医疗服务: "#FFE0B3",
} as const;

// 配置常量
const SCORE_RANGES = {
  high: [85, 100],
  mid: [70, 85],
  low: [0, 70],
  all: [0, 100],
} as const;

const INDUSTRIES = ["数字医疗", "药物", "医疗器械", "医疗服务"] as const;

// 辅助函数：生成随机评分
const randomScore = () => Math.floor(Math.random() * 40) + 60;

// 数据生成函数 (Mock Data)
const generateRawData = (): IndustryNode[] => {
  const data: IndustryNode[] = [
    {
      name: "数字医疗",
      itemStyle: { color: INDUSTRY_COLORS["数字医疗"] },
      children: [
        {
          name: "数字医疗",
          children: [
            {
              name: "智慧医疗",
              value: randomScore(),
              companies: "神州医疗, 京东健康",
            },
            {
              name: "互联网+健康",
              value: randomScore(),
              companies: "医渡科技, 讯飞医疗",
            },
            { name: "数字疗法", value: randomScore(), companies: "创业慧康" },
          ],
        },
        {
          name: "前沿技术",
          children: [
            {
              name: "前沿技术融合",
              value: randomScore(),
              companies: "神州医疗, 京东健康",
            },
          ],
        },
      ],
    },
    {
      name: "药物",
      itemStyle: { color: INDUSTRY_COLORS["药物"] },
      children: [
        {
          name: "药品",
          children: [
            {
              name: "化学制药",
              value: randomScore(),
              companies: "恒瑞医药, 百济神州",
            },
            { name: "生物制品", value: randomScore(), companies: "信达生物" },
            { name: "中药", value: randomScore(), companies: "信达生物" },
          ],
        },
        {
          name: "AI 药物研",
          children: [
            {
              name: "AI 药物研发平台",
              value: randomScore(),
              companies: "石药集团, 沃森生物",
            },
            {
              name: "AI 平台整体授权 / 合作",
              value: randomScore(),
              companies: "万泰生物",
            },
          ],
        },
      ],
    },
    {
      name: "医疗器械",
      itemStyle: { color: INDUSTRY_COLORS["医疗器械"] },
      children: [
        {
          name: "医疗器械",
          children: [
            {
              name: "体外诊断 (IVD)",
              value: randomScore(),
              companies: "华大智造",
            },
            { name: "影像设备", value: randomScore(), companies: "圣湘生物" },
            {
              name: "治疗设备 (IVD)",
              value: randomScore(),
              companies: "华大智造",
            },
            {
              name: "生命信息支持设备",
              value: randomScore(),
              companies: "圣湘生物",
            },
            { name: "康复设备", value: randomScore(), companies: "华大智造" },
            { name: "辅助设备", value: randomScore(), companies: "圣湘生物" },
            {
              name: "家用医疗设备",
              value: randomScore(),
              companies: "圣湘生物",
            },
          ],
        },
        {
          name: "高值医用耗材",
          children: [
            { name: "血管介入类", value: randomScore(), companies: "华大智造" },
            {
              name: "非血管介入类",
              value: randomScore(),
              companies: "圣湘生物",
            },
          ],
        },
        {
          name: "植入器械/材料",
          children: [
            { name: "有源植入物", value: randomScore(), companies: "华大智造" },
            { name: "无源植入物", value: randomScore(), companies: "圣湘生物" },
          ],
        },
        {
          name: "低值医用耗材",
          children: [
            { name: "注射穿刺类", value: randomScore(), companies: "华大智造" },
            {
              name: "医用卫生材料",
              value: randomScore(),
              companies: "圣湘生物",
            },
            {
              name: "医用高分子制品",
              value: randomScore(),
              companies: "华大智造",
            },
          ],
        },
        {
          name: "装备制造",
          children: [
            { name: "制药装备", value: randomScore(), companies: "华大智造" },
          ],
        },
      ],
    },
    {
      name: "医疗服务",
      itemStyle: { color: INDUSTRY_COLORS["医疗服务"] },
      children: [
        {
          name: "医药商业 / 流通",
          children: [
            {
              name: "医药配送企业",
              value: randomScore(),
              companies: "华大智造",
            },
            {
              name: "医药即时零售",
              value: randomScore(),
              companies: "圣湘生物",
            },
            {
              name: "药企线上渠道 / 合作",
              value: randomScore(),
              companies: "华大智造",
            },
            {
              name: "医药跨境供应链",
              value: randomScore(),
              companies: "圣湘生物",
            },
          ],
        },
        {
          name: "医疗零售",
          children: [
            { name: "实体药店", value: randomScore(), companies: "华大智造" },
            { name: "医药电商", value: randomScore(), companies: "圣湘生物" },
            {
              name: "药店业务拓展",
              value: randomScore(),
              companies: "华大智造",
            },
          ],
        },
        {
          name: "严肃医疗",
          children: [
            { name: "公立三级", value: randomScore(), companies: "华大智造" },
            { name: "公立二级", value: randomScore(), companies: "圣湘生物" },
            { name: "基层公卫", value: randomScore(), companies: "华大智造" },
            { name: "民营医院", value: randomScore(), companies: "圣湘生物" },
          ],
        },
        {
          name: "消费医疗",
          children: [
            {
              name: "口腔诊所 / 连锁",
              value: randomScore(),
              companies: "华大智造",
            },
            {
              name: "眼科诊所 / 连锁",
              value: randomScore(),
              companies: "圣湘生物",
            },
            {
              name: "产后中心 / 母婴护理",
              value: randomScore(),
              companies: "华大智造",
            },
            {
              name: "生殖中心 / 门诊",
              value: randomScore(),
              companies: "圣湘生物",
            },
            {
              name: "中医诊所 / 连锁",
              value: randomScore(),
              companies: "华大智造",
            },
            {
              name: "医美诊所 / 服务",
              value: randomScore(),
              companies: "圣湘生物",
            },
            {
              name: "专科诊所 / 连锁（其他）",
              value: randomScore(),
              companies: "圣湘生物",
            },
          ],
        },
        {
          name: "互联网医疗",
          children: [
            {
              name: "综合平台 / 在线诊疗",
              value: randomScore(),
              companies: "华大智造",
            },
            {
              name: "垂直服务平台",
              value: randomScore(),
              companies: "圣湘生物",
            },
          ],
        },
        {
          name: "第三方中心",
          children: [
            { name: "检验中心", value: randomScore(), companies: "华大智造" },
            { name: "影像中心", value: randomScore(), companies: "圣湘生物" },
            { name: "病理中心", value: randomScore(), companies: "华大智造" },
            { name: "消毒中心", value: randomScore(), companies: "圣湘生物" },
            { name: "血透中心", value: randomScore(), companies: "华大智造" },
            {
              name: "其他第三方服务",
              value: randomScore(),
              companies: "圣湘生物",
            },
          ],
        },
        {
          name: "保险支付",
          children: [
            { name: "商业保险", value: randomScore(), companies: "华大智造" },
            {
              name: "TPA / 保险科技",
              value: randomScore(),
              companies: "圣湘生物",
            },
          ],
        },
      ],
    },
  ];

  return data;
};

// 递归计算每个父节点的平均分并注入 value 属性
const injectValues = (nodes: IndustryNode[]): IndustryNode[] => {
  return nodes.map((node) => {
    if (node.children && node.children.length > 0) {
      const updatedChildren = injectValues(node.children);
      // 显式声明 acc 和 child 的类型
      const sum = updatedChildren.reduce(
        (acc: number, child: IndustryNode) => acc + (child.value || 0),
        0,
      );
      const avg = parseFloat((sum / updatedChildren.length).toFixed(1));
      return { ...node, children: updatedChildren, value: avg };
    }
    return node;
  });
};

// 计算特定行业平均分的函数
const calculateIndustryAverage = (
  data: IndustryNode[],
  industryName: string,
) => {
  const industry = data.find((item) => item.name === industryName);
  if (industry && industry.value !== undefined) {
    return industry.value.toFixed(1);
  }
  return "N/A";
};

// 递归查找包含指定标签的节点
const findNodesWithTag = (
  nodes: IndustryNode[],
  tag: string,
): IndustryNode[] => {
  const result: IndustryNode[] = [];

  const traverse = (currentNodes: IndustryNode[]) => {
    currentNodes.forEach((node) => {
      if (node.name === tag) {
        result.push({ ...node });
      } else if (node.children && node.children.length > 0) {
        const filteredChildren = findNodesWithTag(node.children, tag);
        if (filteredChildren.length > 0) {
          result.push({
            ...node,
            children: filteredChildren,
          });
        }
      }
    });
  };

  traverse(nodes);
  return result;
};

// 递归过滤数据
const filterData = (
  rawData: IndustryNode[],
  text: string,
  range: readonly [number, number],
  industry: string,
  tags: string[],
): IndustryNode[] => {
  let filteredNodes = rawData;

  // 行业筛选
  if (industry !== "all") {
    filteredNodes = rawData.filter((item) => item.name === industry);
  }

  // 标签筛选
  if (tags.length > 0) {
    const filteredByTags: IndustryNode[] = [];
    tags.forEach((tag) => {
      const nodesWithTag = findNodesWithTag(filteredNodes, tag);
      filteredByTags.push(...nodesWithTag);
    });
    filteredNodes = filteredByTags;
  }

  // 搜索文本筛选
  if (text) {
    // 显式声明内部函数的参数和返回类型
    const filterByText = (nodes: IndustryNode[]): IndustryNode[] => {
      return nodes
        .map((node) => {
          const matchName = node.name
            .toLowerCase()
            .includes(text.toLowerCase());

          if (!node.children || node.children.length === 0) {
            const val = node.value || 0;
            const matchScore = val >= range[0] && val <= range[1];
            return matchName && matchScore ? node : null;
          } else {
            const filteredChildren = filterByText(node.children);
            if (filteredChildren.length > 0) {
              return { ...node, children: filteredChildren };
            }
            return null;
          }
        })
        .filter((n): n is IndustryNode => n !== null); // 使用类型谓词过滤 null
    };

    filteredNodes = filterByText(filteredNodes);
  }

  // 分数范围筛选
  if (range[0] !== 0 || range[1] !== 100) {
    const filterByScore = (nodes: IndustryNode[]): IndustryNode[] => {
      return nodes
        .map((node) => {
          const val = node.value || 0;
          const matchScore = val >= range[0] && val <= range[1];

          if (!node.children || node.children.length === 0) {
            return matchScore ? node : null;
          } else {
            const filteredChildren = filterByScore(node.children);
            if (filteredChildren.length > 0) {
              return { ...node, children: filteredChildren };
            }
            return null;
          }
        })
        .filter((n): n is IndustryNode => n !== null);
    };

    filteredNodes = filterByScore(filteredNodes);
  }

  return filteredNodes;
};

// 按层级组织标签
const organizeTagsByLevel = (rawData: IndustryNode[]) => {
  const organized: Record<string, Record<string, IndustryNode[]>> = {};

  rawData.forEach((industry) => {
    organized[industry.name] = {};
    if (industry.children) {
      industry.children.forEach((level1) => {
        organized[industry.name][level1.name] = level1.children || [];
      });
    }
  });

  return organized;
};

const IndustryScore: React.FC = () => {
  const navigate = useNavigate();
  const [rawData, setRawData] = useState<IndustryNode[]>([]);
  const [treeData, setTreeData] = useState<IndustryNode[]>([]);
  const [searchText, setSearchText] = useState("");
  const [scoreRange, setScoreRange] = useState<readonly [number, number]>(
    SCORE_RANGES.all,
  );
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // 初始化数据
  useEffect(() => {
    const data = generateRawData();
    const dataWithValues = injectValues(data);
    setRawData(dataWithValues);
    setTreeData(dataWithValues);
  }, []);

  // 组织标签数据
  const organizedTags = useMemo(() => organizeTagsByLevel(rawData), [rawData]);

  // 搜索与过滤逻辑
  const handleSearch = (value: string) => {
    setSearchText(value);
    const filtered = filterData(
      rawData,
      value,
      scoreRange,
      selectedIndustry,
      selectedTags,
    );
    setTreeData(filtered);
  };

  const handleScoreChange = (val: string) => {
    const range =
      SCORE_RANGES[val as keyof typeof SCORE_RANGES] || SCORE_RANGES.all;
    setScoreRange(range);
    const filtered = filterData(
      rawData,
      searchText,
      range,
      selectedIndustry,
      selectedTags,
    );
    setTreeData(filtered);
  };

  // 处理行业筛选
  const handleIndustryChange = (value: string) => {
    setSelectedIndustry(value);
    const filtered = filterData(
      rawData,
      searchText,
      scoreRange,
      value,
      selectedTags,
    );
    setTreeData(filtered);
  };

  // 处理标签筛选
  const handleTagChange = (tag: string) => {
    let newSelectedTags;
    if (selectedTags.includes(tag)) {
      newSelectedTags = selectedTags.filter((t) => t !== tag);
    } else {
      newSelectedTags = [...selectedTags, tag];
    }
    setSelectedTags(newSelectedTags);
    const filtered = filterData(
      rawData,
      searchText,
      scoreRange,
      selectedIndustry,
      newSelectedTags,
    );
    setTreeData(filtered);
  };

  // 刷新模拟数据
  const refreshScores = () => {
    const refreshRecursive = (nodes: IndustryNode[]): IndustryNode[] => {
      return nodes.map((node) => {
        if (!node.children) {
          return { ...node, value: randomScore() };
        }
        return { ...node, children: refreshRecursive(node.children) };
      });
    };
    const newData = injectValues(refreshRecursive(generateRawData()));
    setRawData(newData);
    setTreeData(newData);
    message.success("产业评分数据已实时更新");
  };

  // 点击图块处理
  const onChartClick = (params: any) => {
    if (!params.data.children) {
      // 路由跳转至行业画像
      navigate(
        `/industry-portrait/industry-profile?industry=${encodeURIComponent(
          params.data.name,
        )}`,
      );
    }
  };

  // ECharts 配置
  const getOption = () => {
    return {
      tooltip: {
        formatter: function (info: any) {
          const treePathInfo = info.treePathInfo;
          const treePath = treePathInfo.slice(1).map((item: any) => item.name);

          return [
            '<div class="tooltip-title">' +
              echarts.format.encodeHTML(treePath.join(" / ")) +
              "</div>",
            "产业评分: " + info.value + " 分 ",
            info.data.companies ? "代表企业: " + info.data.companies : "",
          ].join("<br/>");
        },
      },
      series: [
        {
          name: "产业评分",
          type: "treemap",
          visibleMin: 100,
          label: {
            show: true,
            formatter: (params: any) => `${params.name}\n${params.value}分`,
            fontSize: 12,
            fontWeight: "bold",
            color: "#fff",
            overflow: "truncate",
            ellipsis: "...",
          },
          upperLabel: {
            show: true,
            height: 30,
            color: "#fff",
            backgroundColor: "rgba(0,0,0,0.3)",
            formatter: (params: any) => `${params.name}  ${params.value}分`,
            fontSize: 12,
          },
          itemStyle: {
            borderColor: "#fff",
            borderWidth: 0,
            gapWidth: 0,
          },
          nodeClick: "zoomToNode",
          breadcrumb: {
            show: true,
            height: 30,
            itemStyle: {
              textStyle: { fontSize: 14, lineHeight: 14 },
            },
          },
          roam: false,
          data: treeData,
          levels: [
            {
              itemStyle: {
                borderColor: "#ffffff",
                borderWidth: 0,
                gapWidth: 1,
              },
              upperLabel: { show: false },
            },
            {
              itemStyle: {
                borderColor: "#ffffff",
                borderWidth: 0,
                gapWidth: 0,
              },
              emphasis: {
                itemStyle: { borderColor: "#aaa" },
              },
            },
            {
              colorSaturation: [0.35, 0.5],
              itemStyle: {
                borderWidth: 0.3,
                gapWidth: 0,
                borderColorSaturation: 0.7,
              },
            },
          ],
        },
      ],
    };
  };

  // 渲染统计卡片
  const renderMetricCard = (
    title: string,
    icon: React.ReactNode,
    color: string,
  ) => {
    const industryName = title.replace("研发", "").replace("服务", "");
    const avgScore = calculateIndustryAverage(rawData, industryName);

    return (
      <Card
        bordered={false}
        className="metric-card"
        style={{ borderTop: `4px solid ${color}` }}
      >
        <Statistic
          title={
            <Space>
              {icon}
              <span>{title}</span>
            </Space>
          }
          value={avgScore}
          suffix="Avg"
          valueStyle={{ fontWeight: 600 }}
        />
      </Card>
    );
  };

  return (
    <div style={{ minHeight: "100%", background: "#f0f2f5" }}>
      {/* 顶部控制栏与统计 */}
      <div style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]} align="middle" justify="space-between">
          <Col xs={24} md={12}>
            <Title level={3} style={{ margin: 0 }}>
              <ExperimentOutlined style={{ marginRight: 12 }} />
              产业评分全景图 (Industry Heatmap)
            </Title>
            <Text type="secondary">基于多维数据的实时产业赛道评分监控体系</Text>
          </Col>
          <Col xs={24} md={12} style={{ textAlign: "right" }}>
            <Space>
              <Button icon={<ReloadOutlined />} onClick={refreshScores}>
                刷新评分
              </Button>
            </Space>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
          <Col span={6}>
            {renderMetricCard(
              "数字医疗",
              <DeploymentUnitOutlined />,
              INDUSTRY_COLORS["数字医疗"],
            )}
          </Col>
          <Col span={6}>
            {renderMetricCard(
              "药物研发",
              <MedicineBoxOutlined />,
              INDUSTRY_COLORS["药物"],
            )}
          </Col>
          <Col span={6}>
            {renderMetricCard(
              "医疗器械",
              <ExperimentOutlined />,
              INDUSTRY_COLORS["医疗器械"],
            )}
          </Col>
          <Col span={6}>
            {renderMetricCard(
              "医疗服务",
              <UsergroupAddOutlined />,
              INDUSTRY_COLORS["医疗服务"],
            )}
          </Col>
        </Row>
      </div>

      {/* 搜索与筛选 */}
      <Card bodyStyle={{ padding: "16px 24px" }} style={{ marginBottom: 16 }}>
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Input
              placeholder="搜索赛道、细分领域 (如: AI药物, 基因测序...)"
              prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
              size="large"
              allowClear
              onChange={(e) => handleSearch(e.target.value)}
            />
          </Col>
          <Col>
            <Select
              defaultValue="all"
              size="large"
              style={{ width: 180 }}
              onChange={handleScoreChange}
            >
              <Option value="all">全部分值</Option>
              <Option value="high">高评分 (85-100)</Option>
              <Option value="mid">中评分 (70-85)</Option>
              <Option value="low">低评分 (0-70)</Option>
            </Select>
          </Col>
          <Col>
            <Select
              defaultValue="all"
              size="large"
              style={{ width: 180 }}
              onChange={handleIndustryChange}
            >
              <Option value="all">全部行业</Option>
              {INDUSTRIES.map((industry) => (
                <Option key={industry} value={industry}>
                  {industry}
                </Option>
              ))}
            </Select>
          </Col>
          <Col>
            <Button type="default" size="large" disabled>
              矩形面积 = 评分权重
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 标签筛选区域 - 按层级展示 */}
      <Card
        bodyStyle={{ padding: "16px 24px" }}
        style={{ marginBottom: 16 }}
        title={
          <Space>
            <AppstoreOutlined />
            <span>细分赛道标签筛选</span>
            {selectedTags.length > 0 && (
              <span style={{ color: "#52c41a" }}>
                (已选择 {selectedTags.length} 个标签)
              </span>
            )}
          </Space>
        }
      >
        <Collapse accordion>
          {Object.entries(organizedTags).map(([industryName, industryData]) => (
            <Panel
              header={
                <div>
                  <Tag
                    color={
                      selectedTags.includes(industryName) ? "blue" : "default"
                    }
                    onClick={() => handleTagChange(industryName)}
                    style={{
                      cursor: "pointer",
                      userSelect: "none",
                      fontSize: "14px",
                      padding: "4px 8px",
                    }}
                  >
                    <strong>{industryName}（0级）</strong>
                  </Tag>
                </div>
              }
              key={industryName}
            >
              <div style={{ paddingLeft: "20px" }}>
                {Object.entries(industryData).map(
                  ([level1Name, level2Items]) => (
                    <div key={level1Name} style={{ marginBottom: "10px" }}>
                      <Tag
                        color={
                          selectedTags.includes(level1Name) ? "blue" : "default"
                        }
                        onClick={() => handleTagChange(level1Name)}
                        style={{
                          cursor: "pointer",
                          userSelect: "none",
                          fontSize: "14px",
                          padding: "4px 8px",
                          marginBottom: "8px",
                        }}
                      >
                        <strong>{level1Name}（1级）</strong>
                      </Tag>
                      ：
                      {(level2Items as any[]).map((level2Item, index) => (
                        <span key={level2Item.name}>
                          <Tag
                            color={
                              selectedTags.includes(level2Item.name)
                                ? "blue"
                                : "default"
                            }
                            onClick={() => handleTagChange(level2Item.name)}
                            style={{
                              cursor: "pointer",
                              userSelect: "none",
                              margin: "2px",
                            }}
                          >
                            {level2Item.name}（2级）
                          </Tag>
                          {index < (level2Items as any[]).length - 1 && "、"}
                        </span>
                      ))}
                      ；
                    </div>
                  ),
                )}
              </div>
            </Panel>
          ))}
        </Collapse>

        {selectedTags.length > 0 && (
          <>
            <Divider style={{ margin: "16px 0" }} />
            <div>
              <Text strong>已选择的标签:</Text>
              <Space style={{ marginLeft: 16 }}>
                {selectedTags.map((tag) => (
                  <Tag
                    key={tag}
                    color="blue"
                    closable
                    onClose={(e) => {
                      e.preventDefault();
                      handleTagChange(tag);
                    }}
                  >
                    {tag}
                  </Tag>
                ))}
                <Button
                  type="link"
                  size="small"
                  onClick={() => {
                    setSelectedTags([]);
                    const filtered = filterData(
                      rawData,
                      searchText,
                      scoreRange,
                      selectedIndustry,
                      [],
                    );
                    setTreeData(filtered);
                  }}
                >
                  清除全部
                </Button>
              </Space>
            </div>
          </>
        )}
      </Card>

      {/* 核心可视化区域 - 矩形树图 */}
      <Card
        bodyStyle={{
          padding: 0,
          height: "calc(160vh - 500px)",
          minHeight: "600px",
        }}
        title={
          <Space>
            <AppstoreOutlined />
            <span>产业赛道热力分布</span>
            {searchText && <span style={{ color: "#faad14" }}>(搜索模式)</span>}
            {selectedIndustry !== "all" && (
              <span style={{ color: "#52c41a" }}>
                (行业: {selectedIndustry})
              </span>
            )}
            {selectedTags.length > 0 && (
              <span style={{ color: "#1890ff" }}>
                (标签筛选: {selectedTags.length}个)
              </span>
            )}
          </Space>
        }
      >
        {treeData && treeData.length > 0 ? (
          <ReactECharts
            option={getOption()}
            style={{ height: "100%", width: "100%" }}
            onEvents={{
              click: onChartClick,
            }}
          />
        ) : (
          <div
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div>未找到匹配的赛道</div>
          </div>
        )}
      </Card>

      {/* 样式覆盖 */}
      <style>{`
          .metric-card {
            transition: all 0.3s;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          }
          .metric-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          }
          .ant-statistic-title {
            margin-bottom: 8px;
          }
          
          /* 优化标签显示 */
          .echarts-for-react div {
            font-family: 'Arial', sans-serif;
          }
          
          /* 优化折叠面板样式 */
          .ant-collapse-content-box {
            padding-top: 10px !important;
            padding-bottom: 10px !important;
          }
        `}</style>
    </div>
  );
};

export default IndustryScore;
