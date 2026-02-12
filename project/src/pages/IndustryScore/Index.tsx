import React, { useState, useEffect, useMemo } from "react";
import { Spin, message, Empty } from "antd";
import { useNavigate } from "react-router-dom";
import { Treemap } from "@ant-design/plots";

// --- 颜色配置 ---
const COLOR_CONFIG: Record<string, string> = {
  数字医疗: "#5B8FF9", // 蓝
  前沿技术: "#5AD8A6", // 绿
  医疗器械: "#5D7092", // 灰蓝
  医疗服务: "#F6BD16", // 黄
  药品: "#E8684A", // 红
  "AI 药物研发": "#6DC8EC", // 青
  default: "#9270CA",
};

// --- 类型定义 ---
interface CategoryRow {
  id: number;
  parent_id: number;
  name: string;
  level: number;
}

const IndustryScore: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<any>(null);

  // 1. 使用 State 存储“颜色查找表”，确保渲染时能读到
  const [colorMap, setColorMap] = useState<Record<string, string>>({});

  // 2. 动态计算高度，防止 Flex/Calc 计算失效导致的渲染压缩
  const [chartHeight, setChartHeight] = useState(600);

  useEffect(() => {
    // 强制高度 = 视口高度 - 头部(60) - 顶部图例(50) - Padding(40)
    const updateHeight = () => {
      const h = window.innerHeight - 150;
      setChartHeight(h > 400 ? h : 400);
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/api/industry/categories",
        );
        const json = await response.json();

        if (json.success) {
          const rows: CategoryRow[] = json.data;
          const level0 = rows.filter((r) => r.level === 0);
          const level1 = rows.filter((r) => r.level === 1);

          // --- 核心：构建 Name -> Color 的查找表 ---
          const newColorMap: Record<string, string> = {};

          const treeData = {
            name: "朝阳区产业全景",
            children: level0.map((parent) => {
              const pColor =
                COLOR_CONFIG[parent.name] || COLOR_CONFIG["default"];
              // 记录父节点颜色
              newColorMap[parent.name] = pColor;

              return {
                name: parent.name,
                value: 0, // 父节点不占面积，由子节点撑开
                children: level1
                  .filter((child) => child.parent_id === parent.id)
                  .map((child) => {
                    // 记录子节点颜色 (与父节点一致)
                    newColorMap[child.name] = pColor;

                    return {
                      name: child.name,
                      value: Math.floor(Math.random() * 40) + 60, // 随机分
                      // 额外字段用于 tooltip
                      category: parent.name,
                    };
                  }),
              };
            }),
          };

          setColorMap(newColorMap);
          setChartData(treeData);
        } else {
          message.error("获取数据失败");
        }
      } catch (error) {
        console.error("Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const config = useMemo(() => {
    return {
      data: chartData,
      // 3. 核心修复：绑定到 'name' 字段，因为它是唯一且必定存在的
      colorField: "name",
      // 4. 核心修复：直接查字典，不依赖组件内部的数据透传
      color: (name: string) => {
        return colorMap[name] || COLOR_CONFIG["default"];
      },

      tile: "treemapResquarify",
      legend: false,
      tooltip: {
        formatter: (datum: any) => {
          return {
            name: datum.name,
            value: datum.value ? `${datum.value} 分` : "-",
          };
        },
      },

      // 5. 显式指定 label，避免 undefined 错误
      label: {
        position: "top", // 换一个安全的位置参数
        style: {
          fill: "#fff",
          fontSize: 13,
          fontWeight: "bold",
          stroke: "#000",
          lineWidth: 2,
          opacity: 0.9,
          pointerEvents: "none",
        },
        formatter: (datum: any) => {
          if (!datum) return "";
          // 只有叶子节点显示分数
          if (!datum.children && datum.value) {
            return `${datum.name}\n${datum.value}`;
          }
          return datum.name;
        },
      },

      // 样式微调
      rectStyle: {
        stroke: "#fff",
        lineWidth: 1,
      },

      // 6. 交互修复：打印日志以辅助调试
      onReady: (plot: any) => {
        plot.on("element:click", (...args: any) => {
          const event = args[0];
          // G2Plot 不同版本数据路径可能不同，做个兼容读取
          const itemData = event?.data?.data || event?.data;

          console.log("点击触发:", itemData);

          if (
            itemData &&
            !itemData.children &&
            itemData.name !== "朝阳区产业全景"
          ) {
            const url = `/industry-portrait/industry-profile?industry=${encodeURIComponent(itemData.name)}`;
            navigate(url);
          }
        });
      },
    };
  }, [chartData, colorMap, navigate]);

  if (loading) {
    return (
      <div
        style={{
          height: chartHeight,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        // 移除 margin 负值，改用纯净的 Flex 布局
        width: "100%",
        height: "100%",
        backgroundColor: "#fff",
      }}
    >
      {/* 顶部自定义图例 */}
      <div
        style={{
          padding: "12px 24px",
          borderBottom: "1px solid #eee",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <div style={{ fontSize: 16, fontWeight: "bold" }}>产业评分全景</div>
        <div style={{ display: "flex", gap: 12 }}>
          {Object.entries(COLOR_CONFIG)
            .filter(([k]) => k !== "default")
            .map(([name, color]) => (
              <div
                key={name}
                style={{ display: "flex", alignItems: "center", fontSize: 12 }}
              >
                <span
                  style={{
                    width: 12,
                    height: 12,
                    backgroundColor: color,
                    borderRadius: 2,
                    marginRight: 6,
                  }}
                ></span>
                {name}
              </div>
            ))}
        </div>
      </div>

      {/* 图表容器：高度由 JS 严格控制 */}
      <div style={{ width: "100%", height: chartHeight, padding: 12 }}>
        {chartData ? (
          // @ts-ignore
          <Treemap {...config} />
        ) : (
          <Empty description="暂无数据" style={{ marginTop: 100 }} />
        )}
      </div>
    </div>
  );
};

export default IndustryScore;
