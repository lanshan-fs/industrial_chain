/**
 * src/pages/IndustryPortrait/components/EnterpriseHonorTab.tsx
 */
import React from "react";
// import { TrophyOutlined } from "@ant-design/icons";
import ProfileListCard from "./ProfileListCard";

const EnterpriseHonorTab: React.FC = () => {
  const columns = [
    { title: "荣誉名称", dataIndex: "name", width: 350 },
    { title: "颁发机构", dataIndex: "authority" },
    { title: "获奖年度", dataIndex: "year" },
    { title: "荣誉级别", dataIndex: "level" },
  ];

  const data = [
    {
      key: 1,
      name: "北京市专精特新中小企业",
      authority: "北京市经济和信息化局",
      year: "2023",
      level: "市级",
    },
    {
      key: 2,
      name: "朝阳区高增长企业 Top20",
      authority: "朝阳区人民政府",
      year: "2022",
      level: "区级",
    },
    {
      key: 3,
      name: "中关村金种子企业",
      authority: "中关村科技园区管理委员会",
      year: "2021",
      level: "市级",
    },
    {
      key: 4,
      name: "国家高新技术企业",
      authority: "全国高新技术企业认定管理工作领导小组",
      year: "2021",
      level: "国家级",
    },
  ];

  return (
    <ProfileListCard
      // title="获奖荣誉信息"
      // icon={<TrophyOutlined />}
      columns={columns}
      data={data}
    />
  );
};

export default EnterpriseHonorTab;
