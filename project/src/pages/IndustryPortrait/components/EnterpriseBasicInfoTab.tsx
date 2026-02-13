/**
 * src/pages/IndustryPortrait/components/EnterpriseBasicInfoTab.tsx
 */
import React from "react";
import { Descriptions, Tag, Button, message } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import ProfileListCard from "./ProfileListCard";

interface EnterpriseBasicInfoTabProps {
  profile: any;
}

const EnterpriseBasicInfoTab: React.FC<EnterpriseBasicInfoTabProps> = ({
  profile,
}) => {
  const { baseInfo, basicInfoData } = profile;

  // --- 样式常量：优化标题栏设计 ---
  const SECTION_STYLE: React.CSSProperties = {
    padding: "0 24px 24px",
    marginBottom: 0,
    background: "#fff",
  };

  // 标题栏容器：Flex 布局，两端对齐，底部带淡边框
  const HEADER_STYLE: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    paddingBottom: 12,
    marginBottom: 16,
    borderBottom: "1px solid #f0f0f0", // 视觉分隔线，替代之前的竖蓝线
  };

  // 标题文字样式
  const TITLE_TEXT_STYLE: React.CSSProperties = {
    fontSize: 16, // 主流字号
    fontWeight: 600, // 字重适中
    color: "#262626", // 深灰偏黑，提升质感
    lineHeight: 1.5,
  };

  // 模拟导出功能的处理函数
  const handleExport = (title: string) => {
    message.success(`正在导出${title}数据...`);
  };

  // 渲染标题栏的辅助函数
  const renderHeader = (title: string, showExport: boolean = true) => (
    <div style={HEADER_STYLE}>
      <div style={TITLE_TEXT_STYLE}>{title}</div>
      {showExport && (
        <Button
          type="link"
          icon={<DownloadOutlined />}
          size="small"
          onClick={() => handleExport(title)}
          style={{ paddingRight: 0, fontSize: 13 }}
        >
          导出数据
        </Button>
      )}
    </div>
  );

  // 1. 工商信息 (详细版) - Description 通常不需要导出表格数据，视情况可加，这里暂不加或加“导出详情”
  const renderBusinessInfo = () => (
    <div id="basic-business" style={SECTION_STYLE}>
      {/* 工商信息也可以拥有一致的标题设计，但不一定需要导出表格按钮 */}
      {renderHeader("工商信息", false)}
      <Descriptions
        column={{ xxl: 3, xl: 3, lg: 2, md: 2, sm: 1, xs: 1 }}
        bordered
        size="small"
        labelStyle={{ background: "#fafafa", width: 160, color: "#666" }}
        contentStyle={{ color: "#333" }}
      >
        <Descriptions.Item label="法定代表人">
          {baseInfo.legalPerson}
        </Descriptions.Item>
        <Descriptions.Item label="经营状态">
          <Tag color="success">{baseInfo.status}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="成立日期">
          {baseInfo.establishDate}
        </Descriptions.Item>
        <Descriptions.Item label="注册资本">
          {baseInfo.regCapital}
        </Descriptions.Item>
        <Descriptions.Item label="实缴资本">
          {baseInfo.paidInCapital}
        </Descriptions.Item>
        <Descriptions.Item label="企业类型">{baseInfo.type}</Descriptions.Item>
        <Descriptions.Item label="统一社会信用代码">
          {baseInfo.creditCode}
        </Descriptions.Item>
        <Descriptions.Item label="纳税人识别号">
          {baseInfo.taxId}
        </Descriptions.Item>
        <Descriptions.Item label="所属行业">
          {baseInfo.industry}
        </Descriptions.Item>
        <Descriptions.Item label="参保人数">219 人</Descriptions.Item>
        <Descriptions.Item label="核准日期">2023-11-15</Descriptions.Item>
        <Descriptions.Item label="登记机关">
          北京市朝阳区市场监督管理局
        </Descriptions.Item>
        <Descriptions.Item label="注册地址" span={3}>
          {baseInfo.address}
        </Descriptions.Item>
        <Descriptions.Item label="经营范围" span={3}>
          {baseInfo.scope}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );

  // 通用渲染函数：带表格和导出按钮
  const renderSection = (
    id: string,
    title: string,
    columns: any[],
    data: any[],
  ) => (
    <div id={id} style={SECTION_STYLE}>
      {renderHeader(title, true)}
      <ProfileListCard columns={columns} data={data} />
    </div>
  );

  return (
    <div style={{ background: "#fff" }}>
      {renderBusinessInfo()}

      {renderSection(
        "basic-shareholder",
        "股东信息",
        [
          { title: "股东名称", dataIndex: "name" },
          {
            title: "持股比例",
            dataIndex: "ratio",
            align: "center",
            width: 120,
          },
          {
            title: "认缴出资额",
            dataIndex: "capital",
            align: "right",
            width: 180,
          },
        ],
        basicInfoData?.shareholders || [],
      )}

      {renderSection(
        "basic-personnel",
        "主要人员",
        [
          { title: "姓名", dataIndex: "name", width: 150 },
          { title: "职务", dataIndex: "title" },
        ],
        basicInfoData?.keyPersonnel || [],
      )}

      {renderSection(
        "basic-branch",
        "分支机构",
        [
          { title: "机构名称", dataIndex: "name" },
          { title: "负责人", dataIndex: "principal", width: 120 },
          { title: "成立日期", dataIndex: "date", width: 150 },
        ],
        basicInfoData?.branches || [],
      )}

      {renderSection(
        "basic-change",
        "变更记录",
        [
          { title: "变更日期", dataIndex: "date", width: 150 },
          { title: "变更事项", dataIndex: "item", width: 180 },
          { title: "变更前", dataIndex: "before" },
          { title: "变更后", dataIndex: "after" },
        ],
        basicInfoData?.changes || [],
      )}

      {renderSection(
        "basic-report",
        "企业年报",
        [
          { title: "报送年度", dataIndex: "year" },
          { title: "发布日期", dataIndex: "date" },
        ],
        basicInfoData?.reports || [],
      )}

      {renderSection(
        "basic-social",
        "社保人数",
        [
          { title: "年份", dataIndex: "year" },
          { title: "城镇职工基本养老保险", dataIndex: "pension" },
          { title: "失业保险", dataIndex: "unemployment" },
          { title: "职工基本医疗保险", dataIndex: "medical" },
          { title: "工伤保险", dataIndex: "injury" },
          { title: "生育保险", dataIndex: "maternity" },
        ],
        basicInfoData?.social || [],
      )}

      {renderSection(
        "basic-related",
        "关联企业/人员",
        [
          { title: "关联方名称", dataIndex: "name" },
          { title: "关系", dataIndex: "relation", width: 150 },
        ],
        basicInfoData?.related || [],
      )}
    </div>
  );
};

export default EnterpriseBasicInfoTab;
