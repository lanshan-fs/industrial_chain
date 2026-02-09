/**
 * src/pages/IndustryPortrait/components/EnterpriseProductTab.tsx
 */
import React from "react";
import { FileProtectOutlined } from "@ant-design/icons";
import ProfileListCard from "./ProfileListCard";

const EnterpriseProductTab: React.FC = () => {
  const columns = [
    { title: "产品名称", dataIndex: "name", width: 250 },
    { title: "产品类型", dataIndex: "type" },
    { title: "应用领域", dataIndex: "field" },
    { title: "简介", dataIndex: "desc" },
  ];

  const data = [
    {
      key: 1,
      name: "产业大脑SaaS平台",
      type: "软件平台",
      field: "政府/园区",
      desc: "提供产业链分析、企业画像、招商引资等功能的大数据平台。",
    },
    {
      key: 2,
      name: "企业信用风险评估系统",
      type: "数据服务",
      field: "金融机构",
      desc: "基于多维数据的企业信用评分模型。",
    },
    {
      key: 3,
      name: "智慧园区管理系统",
      type: "解决方案",
      field: "产业园区",
      desc: "集园区资产管理、企业服务、安防监控于一体的综合解决方案。",
    },
  ];

  return (
    <ProfileListCard
      title="主要产品与服务"
      icon={<FileProtectOutlined />}
      columns={columns}
      data={data}
    />
  );
};

export default EnterpriseProductTab;
