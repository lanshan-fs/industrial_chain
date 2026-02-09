/**
 * src/pages/IndustryPortrait/components/ProfileListCard.tsx
 */
import React from "react";
import { Card, Table, Space } from "antd";

interface ProfileListCardProps {
  title: string;
  icon: React.ReactNode;
  columns: any[];
  data: any[];
}

const ProfileListCard: React.FC<ProfileListCardProps> = ({
  title,
  icon,
  columns,
  data,
}) => {
  return (
    <Card
      bordered={false}
      title={
        <Space>
          {icon}
          {title}
        </Space>
      }
      style={{ margin: 24 }}
    >
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        bordered
        size="middle"
      />
    </Card>
  );
};

export default ProfileListCard;
