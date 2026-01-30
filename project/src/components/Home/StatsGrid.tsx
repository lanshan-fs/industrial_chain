import React from "react";
import { Row, Col } from "antd";

export interface StatItem {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
  onClick?: () => void;
}

interface StatsGridProps {
  data: StatItem[];
  columns?: number; // 默认一行3个 (span 8)
}

const StatsGrid: React.FC<StatsGridProps> = ({ data, columns = 3 }) => {
  const span = 24 / columns;

  return (
    <Row gutter={[8, 12]}>
      {data.map((item, idx) => (
        <Col span={span} key={idx}>
          <div
            onClick={item.onClick}
            style={{
              textAlign: "center",
              background: "#fafafa",
              padding: "12px 0",
              borderRadius: 4,
              cursor: item.onClick ? "pointer" : "default",
              transition: "all 0.3s",
              border: "1px solid transparent",
            }}
            onMouseEnter={(e) => {
              if (item.onClick) {
                e.currentTarget.style.borderColor = "#1890ff";
                e.currentTarget.style.background = "#e6f7ff";
              }
            }}
            onMouseLeave={(e) => {
              if (item.onClick) {
                e.currentTarget.style.borderColor = "transparent";
                e.currentTarget.style.background = "#fafafa";
              }
            }}
          >
            <div
              style={{
                color: item.color || "#1890ff",
                fontSize: 18,
                marginBottom: 4,
              }}
            >
              {item.icon}
            </div>
            <div style={{ fontWeight: "bold", color: "#333", fontSize: 16 }}>
              {item.value}
            </div>
            <div style={{ fontSize: 12, color: "#999" }}>{item.label}</div>
          </div>
        </Col>
      ))}
    </Row>
  );
};

export default StatsGrid;
