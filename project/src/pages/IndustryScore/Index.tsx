import React, { useState, useEffect, useMemo } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import { useNavigate } from "react-router-dom";
import {
  Input,
  Row,
  Col,
  Typography,
  Space,
  Button,
  Select,
  message,
  Tag,
  Divider,
  Collapse,
  theme,
  Empty,
} from "antd";
import type { CollapseProps } from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  DeploymentUnitOutlined,
  MedicineBoxOutlined,
  ExperimentOutlined,
  UsergroupAddOutlined,
  AppstoreOutlined,
  FilterOutlined,
  CaretRightOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

// --- 类型定义 ---
interface IndustryNode {
  name: string;
  value?: number;
  itemStyle?: { color: string };
  children?: IndustryNode[];
  companies?: string;
  category?: string;
  [key: string]: any;
}

// 定义四大行业的基础颜色
const INDUSTRY_COLORS = {
  数字医疗: "#B3D9FF",
  药物: "#D9C2E0",
  医疗器械: "#B3E6B3",
  医疗服务: "#FFE0B3",
} as const;

// 行业图标映射
const INDUSTRY_ICONS: Record<string, React.ReactNode> = {
  数字医疗: <DeploymentUnitOutlined />,
  药物: <MedicineBoxOutlined />,
  医疗器械: <ExperimentOutlined />,
  医疗服务: <UsergroupAddOutlined />,
};

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
        .filter((n): n is IndustryNode => n !== null);
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
  const { token } = theme.useToken();
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

  // 渲染统计项（扁平化设计）
  const renderMetricItem = (title: string, color: string) => {
    const industryName = title.replace("研发", "").replace("服务", "");
    const avgScore = calculateIndustryAverage(rawData, industryName);
    const icon =
      INDUSTRY_ICONS[industryName as keyof typeof INDUSTRY_ICONS] ||
      INDUSTRY_ICONS["数字医疗"];

    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 6,
            background: `${color}25`, // 浅色背景
            color: color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            marginRight: 16,
          }}
        >
          {icon}
        </div>
        <div>
          <div style={{ color: "#8c8c8c", fontSize: 13, marginBottom: 2 }}>
            {title}
          </div>
          <div style={{ fontSize: 22, fontWeight: 600, color: "#262626" }}>
            {avgScore}{" "}
            <span style={{ fontSize: 12, fontWeight: 400, color: "#bfbfbf" }}>
              分
            </span>
          </div>
        </div>
      </div>
    );
  };

  // 配置 collapse items (AntD v5 推荐写法)
  const collapseItems: CollapseProps["items"] = [
    {
      key: "tags",
      label: (
        <Space>
          <AppstoreOutlined />
          <span style={{ fontWeight: 500 }}>细分赛道标签筛选</span>
          {selectedTags.length > 0 && (
            <Tag color="blue">{selectedTags.length} 已选</Tag>
          )}
        </Space>
      ),
      children: (
        <div style={{ padding: "0 16px 16px 40px" }}>
          {Object.entries(organizedTags).map(([industryName, industryData]) => (
            <div key={industryName} style={{ marginBottom: 12 }}>
              <div style={{ marginBottom: 8 }}>
                <Tag
                  color={
                    selectedTags.includes(industryName) ? "blue" : "default"
                  }
                  style={{ cursor: "pointer", fontWeight: "bold" }}
                  onClick={() => handleTagChange(industryName)}
                >
                  {industryName}
                </Tag>
              </div>
              <div style={{ paddingLeft: 12 }}>
                {Object.entries(industryData).map(
                  ([level1Name, level2Items]) => (
                    <div
                      key={level1Name}
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "baseline",
                        marginBottom: 6,
                        fontSize: 13,
                      }}
                    >
                      <span
                        style={{
                          marginRight: 8,
                          color: "#8c8c8c",
                          cursor: "pointer",
                          minWidth: 80,
                        }}
                        onClick={() => handleTagChange(level1Name)}
                      >
                        {level1Name}
                        {selectedTags.includes(level1Name) && (
                          <Tag
                            color="blue"
                            style={{ marginLeft: 4, transform: "scale(0.8)" }}
                          >
                            ✓
                          </Tag>
                        )}
                        ：
                      </span>
                      <div style={{ flex: 1 }}>
                        {(level2Items as any[]).map((level2Item) => (
                          <span
                            key={level2Item.name}
                            onClick={() => handleTagChange(level2Item.name)}
                            style={{
                              display: "inline-block",
                              marginRight: 16,
                              cursor: "pointer",
                              color: selectedTags.includes(level2Item.name)
                                ? token.colorPrimary
                                : "#595959",
                              fontWeight: selectedTags.includes(level2Item.name)
                                ? 500
                                : 400,
                            }}
                          >
                            {level2Item.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          ))}
          {selectedTags.length > 0 && (
            <div style={{ marginTop: 12, paddingLeft: 12 }}>
              <Button
                size="small"
                type="link"
                danger
                onClick={() => {
                  setSelectedTags([]);
                  handleSearch(searchText); // 重置筛选
                }}
              >
                清除所有筛选
              </Button>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        background: "#fff",
        minHeight: "100vh", // 确保整个容器有高度
      }}
    >
      {/* 1. 顶部数据概览区块 */}
      <div
        style={{
          padding: "20px 32px",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <Space>
            <div
              style={{
                width: 4,
                height: 18,
                background: token.colorPrimary,
                borderRadius: 2,
              }}
            ></div>
            <Title level={4} style={{ margin: 0 }}>
              产业评分全景图
            </Title>
            <Divider type="vertical" />
            <Text type="secondary" style={{ fontSize: 13 }}>
              基于多维数据的实时产业赛道评分监控体系
            </Text>
          </Space>
          <Button icon={<ReloadOutlined />} onClick={refreshScores}>
            刷新评分
          </Button>
        </div>

        {/* 统计指标行 */}
        <Row
          gutter={0}
          style={{
            background: "#fafafa",
            borderRadius: 8,
            padding: "16px 0",
            border: "1px solid #f0f0f0",
          }}
        >
          <Col span={6} style={{ borderRight: "1px solid #e8e8e8" }}>
            {renderMetricItem("数字医疗", INDUSTRY_COLORS["数字医疗"])}
          </Col>
          <Col span={6} style={{ borderRight: "1px solid #e8e8e8" }}>
            {renderMetricItem("药物研发", INDUSTRY_COLORS["药物"])}
          </Col>
          <Col span={6} style={{ borderRight: "1px solid #e8e8e8" }}>
            {renderMetricItem("医疗器械", INDUSTRY_COLORS["医疗器械"])}
          </Col>
          <Col span={6}>
            {renderMetricItem("医疗服务", INDUSTRY_COLORS["医疗服务"])}
          </Col>
        </Row>
      </div>

      {/* 2. 筛选控制区块 */}
      <div
        style={{
          padding: "16px 32px",
          borderBottom: "1px solid #f0f0f0",
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <Space>
          <FilterOutlined style={{ color: token.colorPrimary }} />
          <span style={{ fontWeight: 500 }}>核心筛选:</span>
        </Space>

        <Input
          prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
          placeholder="搜索赛道、细分领域..."
          style={{ width: 260 }}
          allowClear
          onChange={(e) => handleSearch(e.target.value)}
        />

        <Select
          defaultValue="all"
          style={{ width: 150 }}
          onChange={handleScoreChange}
          placeholder="分值范围"
        >
          <Option value="all">全部分值</Option>
          <Option value="high">高评分 (85-100)</Option>
          <Option value="mid">中评分 (70-85)</Option>
          <Option value="low">低评分 (0-70)</Option>
        </Select>

        <Select
          defaultValue="all"
          style={{ width: 150 }}
          onChange={handleIndustryChange}
          placeholder="所属行业"
        >
          <Option value="all">全部行业</Option>
          {INDUSTRIES.map((industry) => (
            <Option key={industry} value={industry}>
              {industry}
            </Option>
          ))}
        </Select>

        <div style={{ flex: 1 }}></div>
        <Tag color="default" style={{ margin: 0 }}>
          提示：矩形面积 = 评分权重
        </Tag>
      </div>

      {/* 3. 标签筛选区块 (修复 Collapse 写法) */}
      <div style={{ borderBottom: "1px solid #f0f0f0" }}>
        <Collapse
          ghost
          expandIcon={({ isActive }) => (
            <CaretRightOutlined rotate={isActive ? 90 : 0} />
          )}
          defaultActiveKey={[]}
          items={collapseItems}
        />
      </div>

      {/* 4. 可视化图表区块 (自适应填充) */}
      <div
        style={{
          padding: "24px 32px",
          display: "flex",
          flexDirection: "column",
          // 关键修改：设置一个基于视口的计算高度，保证 ECharts 有高度渲染
          height: "calc(100vh - 350px)",
          minHeight: "600px",
        }}
      >
        <div style={{ marginBottom: 16, flexShrink: 0 }}>
          <Text strong style={{ fontSize: 16 }}>
            赛道热力分布
          </Text>
          {searchText && (
            <span style={{ marginLeft: 12, color: "#faad14", fontSize: 13 }}>
              (搜索模式: {searchText})
            </span>
          )}
        </div>
        <div
          style={{
            flex: 1,
            borderRadius: 8,
            overflow: "hidden",
            border: "1px solid #f0f0f0",
            position: "relative", // 确保 ECharts 绝对定位子元素参考正常
          }}
        >
          {treeData && treeData.length > 0 ? (
            <ReactECharts
              option={getOption()}
              style={{ height: "100%", width: "100%" }}
              onEvents={{
                click: onChartClick,
              }}
              // 关键：强制更新
              notMerge={true}
              lazyUpdate={true}
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
              <Empty description="未找到匹配的赛道数据" />
            </div>
          )}
        </div>
      </div>

      {/* 样式微调 */}
      <style>{`
          .echarts-for-react div {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
          }
          /* 调整折叠面板头部高度 */
          .ant-collapse-header {
             padding: 12px 32px !important;
          }
      `}</style>
    </div>
  );
};

export default IndustryScore;
