/**
 * src/pages/IndustryPortrait/components/EnterpriseMarketTab.tsx
 */
import React from "react";
// import { ShopOutlined } from "@ant-design/icons";
import ProfileListCard from "./ProfileListCard";

const EnterpriseMarketTab: React.FC = () => {
  const columns = [
    { title: "项目名称", dataIndex: "project", width: 400 },
    { title: "采购方", dataIndex: "buyer" },
    { title: "中标金额 (万元)", dataIndex: "amount" },
    { title: "中标日期", dataIndex: "date" },
  ];

  const data = [
    {
      key: 1,
      project: "2023年朝阳区智慧城市大数据平台采购项目",
      buyer: "朝阳区数据局",
      amount: "580.00",
      date: "2023-11-15",
    },
    {
      key: 2,
      project: "某大型国企企业画像系统建设",
      buyer: "某集团有限公司",
      amount: "220.50",
      date: "2023-09-02",
    },
    {
      key: 3,
      project: "产业链数据分析服务采购",
      buyer: "某产业园区管委会",
      amount: "150.00",
      date: "2023-06-20",
    },
  ];

  return (
    <ProfileListCard
      // title="市场招投标与竞品信息"
      // icon={<ShopOutlined />}
      columns={columns}
      data={data}
    />
  );
};

export default EnterpriseMarketTab;
