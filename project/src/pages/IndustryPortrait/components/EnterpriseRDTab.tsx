/**
 * src/pages/IndustryPortrait/components/EnterpriseRDTab.tsx
 */
import React from "react";
import { RocketOutlined } from "@ant-design/icons";
import { Tag } from "antd";
import ProfileListCard from "./ProfileListCard";

const EnterpriseRDTab: React.FC = () => {
  const columns = [
    { title: "专利名称", dataIndex: "name", width: 300 },
    { title: "专利类型", dataIndex: "type" },
    { title: "申请日期", dataIndex: "date" },
    {
      title: "当前状态",
      dataIndex: "status",
      render: (t: string) => <Tag color="blue">{t}</Tag>,
    },
  ];

  const data = [
    {
      key: 1,
      name: "一种基于AI的图像识别算法",
      type: "发明专利",
      date: "2023-05-12",
      status: "实质审查",
    },
    {
      key: 2,
      name: "智能数据分析系统V1.0",
      type: "软件著作权",
      date: "2023-01-10",
      status: "已登记",
    },
    {
      key: 3,
      name: "一种服务器散热装置",
      type: "实用新型",
      date: "2022-11-05",
      status: "已授权",
    },
    {
      key: 4,
      name: "企业服务平台界面设计",
      type: "外观设计",
      date: "2022-08-20",
      status: "已授权",
    },
  ];

  return (
    <ProfileListCard
      title="研发创新信息"
      icon={<RocketOutlined />}
      columns={columns}
      data={data}
    />
  );
};

export default EnterpriseRDTab;
