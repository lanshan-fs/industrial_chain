import React from "react";
import { List, Badge, Typography, Progress } from "antd";

const { Text } = Typography;

export interface RankItem {
  name: string;
  count: number;
  percent: number;
}

interface RankListProps {
  data: RankItem[];
  colorScale?: boolean;
  limit?: number;
}

const RankList: React.FC<RankListProps> = ({
  data,
  colorScale = true,
  limit = 10,
}) => {
  return (
    <List
      dataSource={data.slice(0, limit)}
      size="small"
      split={false}
      renderItem={(item, i) => (
        <List.Item style={{ padding: "6px 0" }}>
          <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
            <Badge
              count={i + 1}
              style={{
                background: colorScale && i < 3 ? "#ff4d4f" : "#f0f0f0",
                color: colorScale && i < 3 ? "#fff" : "#666",
                boxShadow: "none",
                marginRight: 12,
                fontWeight: "bold",
              }}
            />
            <Text ellipsis style={{ width: 80, marginRight: 8, fontSize: 13 }}>
              {item.name}
            </Text>
            <Progress
              percent={item.percent}
              size="small"
              showInfo={false}
              strokeColor={colorScale && i < 3 ? "#ff4d4f" : "#1890ff"}
              style={{ flex: 1, marginRight: 12 }}
            />
            <span
              style={{
                fontSize: 12,
                color: "#999",
                minWidth: 40,
                textAlign: "right",
              }}
            >
              {item.count} 家
            </span>
          </div>
        </List.Item>
      )}
    />
  );
};

export default RankList;
