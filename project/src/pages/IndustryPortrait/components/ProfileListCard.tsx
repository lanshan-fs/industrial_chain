/**
 * src/pages/IndustryPortrait/components/ProfileListCard.tsx
 * 通用列表卡片组件 - 优化版
 * 1. 支持无标题模式（title 为可选）
 * 2. 移除圆角和默认边距，提升视觉密度
 */
import React from "react";
import { Card, Table, Typography } from "antd";

const { Text } = Typography;

interface ProfileListCardProps {
  title?: string; // 变为可选
  icon?: React.ReactNode; // 变为可选
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
      // 仅当有 title 时才渲染 title 属性，否则头部不占用空间
      title={
        title ? (
          <span style={{ fontSize: 16 }}>
            {icon}{" "}
            <Text strong style={{ marginLeft: 8 }}>
              {title}
            </Text>
          </span>
        ) : undefined
      }
      bordered={false}
      bodyStyle={{ padding: 0 }} // 列表贴边，无内边距
      // 移除 marginBottom 和 borderRadius，减少留白和圆角突兀感
      style={{ background: "transparent" }}
      headStyle={{ borderBottom: "1px solid #f0f0f0", minHeight: 48 }}
    >
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={false}
        size="middle" // 使用更紧凑的表格尺寸
        rowKey="key"
        bordered={false} // 移除表格外边框，与页面融合更佳
      />
    </Card>
  );
};

export default ProfileListCard;
