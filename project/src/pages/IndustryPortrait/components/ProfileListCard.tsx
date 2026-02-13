import React from "react";
import { Card, Table, Typography, ConfigProvider } from "antd";

const { Text } = Typography;

interface ProfileListCardProps {
  title?: string;
  icon?: React.ReactNode;
  columns: any[];
  data: any[];
  loading?: boolean;
}

const ProfileListCard: React.FC<ProfileListCardProps> = ({
  title,
  icon,
  columns,
  data,
  loading = false,
}) => {
  return (
    <Card
      title={
        title ? (
          <span style={{ fontSize: 15, fontWeight: 600 }}>
            {icon}{" "}
            <Text strong style={{ marginLeft: 8 }}>
              {title}
            </Text>
          </span>
        ) : undefined
      }
      bordered={false}
      bodyStyle={{ padding: 0 }}
      style={{
        background: "transparent",
        boxShadow: "none",
        borderRadius: 0,
      }}
      headStyle={{
        borderBottom: "none",
        minHeight: 40,
        padding: "0 12px",
      }}
    >
      <ConfigProvider
        theme={{
          components: {
            Table: {
              borderRadius: 0,
              headerBorderRadius: 0,
              borderColor: "#f0f0f0",
            },
          },
        }}
      >
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={false}
          size="small"
          rowKey="key"
          bordered // 显示全边框
          style={{
            borderRadius: 0,
          }}
        />
      </ConfigProvider>
    </Card>
  );
};

export default ProfileListCard;
