import React from "react";
import { Table, Tag, Space, Button, Input, message } from "antd";
import { SearchOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import type { TableProps } from "antd";

// 1. 定义数据类型接口
interface DataType {
  key: string;
  title: string;
  type: string;
  time: string;
}

const History: React.FC = () => {
  // 模拟数据
  const data: DataType[] = [
    {
      key: "1",
      title: "朝阳区数字医疗产业发展趋势分析",
      type: "产业分析",
      time: "2026-01-16 09:30",
    },
    {
      key: "2",
      title: "生物医药产业链薄弱环节识别报告",
      type: "风险评估",
      time: "2026-01-15 14:20",
    },
    {
      key: "3",
      title: "2025年智慧康养行业招商策略建议",
      type: "招商建议",
      time: "2026-01-14 11:00",
    },
  ];

  // 2. 为 columns 添加类型注解 TableProps<DataType>['columns']
  const columns: TableProps<DataType>['columns'] = [
    {
      title: "对话主题",
      dataIndex: "title",
      key: "title",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "报告类型",
      dataIndex: "type",
      key: "type",
      render: (type) => {
        const color = type === "风险评估" ? "volcano" : "geekblue";
        return <Tag color={color}>{type}</Tag>;
      },
    },
    {
      title: "创建时间",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "操作",
      key: "action",
      // 3. 显式指定参数类型，并使用 record
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EyeOutlined />}
            onClick={() => message.info(`查看记录: ${record.title}`)}
          >
            查看
          </Button>
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />}
            onClick={() => message.success(`删除记录 ID: ${record.key}`)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
        <Input placeholder="搜索历史记录" prefix={<SearchOutlined />} style={{ width: 300 }} />
      </div>
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default History;