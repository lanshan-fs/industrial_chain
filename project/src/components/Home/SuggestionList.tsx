import React from "react";
import { List, Row, Col, Typography, Tag } from "antd";

const { Text } = Typography;

export interface SuggestionItem {
  name: string;
  desc?: string;
  highlight?: boolean;
}

interface SuggestionListProps {
  data: SuggestionItem[];
  icon: React.ReactNode;
  iconColor: string;
}

const SuggestionList: React.FC<SuggestionListProps> = ({
  data,
  icon,
  iconColor,
}) => {
  return (
    <List
      size="small"
      split={true}
      dataSource={data.slice(0, 5)}
      renderItem={(item) => (
        <List.Item
          style={{ padding: "10px 0", borderBottom: "1px dashed #f0f0f0" }}
        >
          <Row style={{ width: "100%", alignItems: "center" }}>
            <Col span={1}>
              <span style={{ color: iconColor }}>{icon}</span>
            </Col>
            <Col span={16}>
              <Text strong style={{ fontSize: 14, color: "#333" }}>
                {item.name}
              </Text>
            </Col>
            <Col span={7} style={{ textAlign: "right" }}>
              {item.highlight ? (
                <Tag color="orange">紧缺</Tag>
              ) : (
                <Text type="success" strong>
                  {item.desc}
                </Text>
              )}
            </Col>
          </Row>
        </List.Item>
      )}
    />
  );
};

export default SuggestionList;
