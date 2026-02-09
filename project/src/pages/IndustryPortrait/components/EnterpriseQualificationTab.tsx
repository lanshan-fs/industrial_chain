/**
 * src/pages/IndustryPortrait/components/EnterpriseQualificationTab.tsx
 */
import React from "react";
import { SafetyCertificateOutlined } from "@ant-design/icons";
import ProfileListCard from "./ProfileListCard";

const EnterpriseQualificationTab: React.FC = () => {
  const columns = [
    { title: "资质名称", dataIndex: "name", width: 300 },
    { title: "发证机关", dataIndex: "authority" },
    { title: "有效期至", dataIndex: "expiry" },
    { title: "证书编号", dataIndex: "code" },
  ];

  const data = [
    {
      key: 1,
      name: "高新技术企业证书",
      authority: "北京市科学技术委员会",
      expiry: "2025-10-10",
      code: "GR20221100XXXX",
    },
    {
      key: 2,
      name: "ISO9001质量管理体系认证",
      authority: "中国质量认证中心",
      expiry: "2024-05-20",
      code: "00120Q3XXXXR0M",
    },
    {
      key: 3,
      name: "信息安全管理体系认证",
      authority: "中国网络安全审查技术中心",
      expiry: "2024-12-31",
      code: "ISMS-2021-XXXX",
    },
  ];

  return (
    <ProfileListCard
      title="企业资质认证"
      icon={<SafetyCertificateOutlined />}
      columns={columns}
      data={data}
    />
  );
};

export default EnterpriseQualificationTab;
