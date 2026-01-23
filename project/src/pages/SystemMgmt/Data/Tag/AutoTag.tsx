import React, { useState } from "react";
import {
  Card,
  Upload,
  Button,
  Checkbox,
  Table,
  Row,
  Col,
  Typography,
  Space,
  message,
  Tag,
  Divider,
  Alert,
} from "antd";
import {
  InboxOutlined,
  ThunderboltOutlined,
  FileExcelOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import type { UploadProps, UploadFile } from "antd";
// 删除导致报错的 import: import type { CheckboxValueType } from 'antd/es/checkbox/Group';

const { Text } = Typography; // 移除了未使用的 Title
const { Dragger } = Upload;

// 定义标签维度选项
const DIMENSION_OPTIONS = [
  { label: "基本信息维度", value: "basic" },
  { label: "经营业务维度", value: "business" },
  { label: "科技属性维度", value: "tech" },
  { label: "风险管控维度", value: "risk" },
  { label: "市场表现维度", value: "market" },
];

// 模拟的打标结果数据接口
interface TagResultType {
  key: string;
  name: string;
  code: string;
  dimensions: string[];
  generatedTags: { label: string; color: string }[];
  status: "success" | "fail";
}

const AutoTag: React.FC = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  // 将类型明确为 string[]，避免依赖 CheckboxValueType
  const [selectedDimensions, setSelectedDimensions] = useState<string[]>([
    "basic",
    "tech",
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultData, setResultData] = useState<TagResultType[]>([]);

  // 1. 文件上传配置
  const uploadProps: UploadProps = {
    name: "file",
    multiple: false,
    maxCount: 1,
    fileList,
    // 移除了未使用的参数 file，改为空参数
    onRemove: () => {
      setFileList([]);
    },
    beforeUpload: (file) => {
      const isExcel =
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel";
      if (!isExcel) {
        message.error("只能上传 Excel 文件 (xlsx/xls)!");
        return Upload.LIST_IGNORE;
      }
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error("文件大小不能超过 10MB!");
        return Upload.LIST_IGNORE;
      }
      setFileList([file]);
      return false; // 阻止自动上传，等待用户点击开始
    },
  };

  // 2. 模拟打标处理函数
  const handleStartAnalysis = () => {
    if (fileList.length === 0) {
      message.warning("请先上传企业数据文件！");
      return;
    }
    if (selectedDimensions.length === 0) {
      message.warning("请至少选择一个标签维度！");
      return;
    }

    setIsProcessing(true);
    setResultData([]); // 清空旧数据

    // 模拟后端处理延迟
    setTimeout(() => {
      const mockResults: TagResultType[] = [
        {
          key: "1",
          name: "北京数字医疗科技有限公司",
          code: "91110105MA01...",
          dimensions: selectedDimensions,
          generatedTags: [
            { label: "高新技术企业", color: "blue" },
            { label: "专精特新", color: "purple" },
            { label: "研发强", color: "cyan" },
          ],
          status: "success",
        },
        {
          key: "2",
          name: "朝阳区智慧康养中心",
          code: "52110105MJ23...",
          dimensions: selectedDimensions,
          generatedTags: [
            { label: "养老服务", color: "orange" },
            { label: "政府采购", color: "green" },
          ],
          status: "success",
        },
        {
          key: "3",
          name: "未来生命科学研究院",
          code: "121000004000...",
          dimensions: selectedDimensions,
          generatedTags: [
            { label: "科研机构", color: "geekblue" },
            { label: "成果转化潜力", color: "magenta" },
          ],
          status: "success",
        },
      ];

      setResultData(mockResults);
      setIsProcessing(false);
      message.success("自动打标完成！");
    }, 2000);
  };

  // 3. 表格列定义
  const columns = [
    {
      title: "企业名称",
      dataIndex: "name",
      key: "name",
      width: 250,
    },
    {
      title: "统一社会信用代码",
      dataIndex: "code",
      key: "code",
      width: 200,
      render: (text: string) => <Text copyable>{text}</Text>,
    },
    {
      title: "生成的标签",
      key: "tags",
      // 显式声明 _ 为 any 或 unknown 以修复 "隐式具有 any 类型" 错误
      render: (_: unknown, record: TagResultType) => (
        <>
          {record.generatedTags.map((tag, index) => (
            <Tag color={tag.color} key={index}>
              {tag.label}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: "状态",
      key: "status",
      width: 100,
      // 移除了未使用的参数 record
      render: () => (
        <Tag icon={<CheckCircleOutlined />} color="success">
          已完成
        </Tag>
      ),
    },
    {
      title: "操作",
      key: "action",
      width: 100,
      render: () => (
        <Button type="link" size="small">
          详情
        </Button>
      ),
    },
  ];

  return (
    <Space direction="vertical" style={{ width: "100%" }} size="large">
      {/* 顶部配置区域 */}
      <Card title="自动打标签配置" bordered={false}>
        <Row gutter={48}>
          {/* 左侧：文件上传 */}
          <Col span={10}>
            <div style={{ marginBottom: 16 }}>
              <Text strong>1. 上传企业数据文件</Text>
              <div style={{ marginTop: 8 }}>
                <Alert
                  message="支持 .xlsx, .xls 格式，单个文件不超过 10MB"
                  type="info"
                  showIcon
                  style={{ marginBottom: 10 }}
                />
                <Dragger {...uploadProps} disabled={isProcessing}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">点击或拖拽文件到此区域</p>
                  <p className="ant-upload-hint">
                    系统将自动解析文件中的企业名称与代码
                  </p>
                </Dragger>
              </div>
            </div>
          </Col>

          {/* 右侧：维度选择与操作 */}
          <Col span={14}>
            <div style={{ marginBottom: 24 }}>
              <Text strong>2. 选择标签生成维度</Text>
              <div
                style={{
                  marginTop: 16,
                  padding: "20px",
                  background: "#f5f5f5",
                  borderRadius: "8px",
                }}
              >
                <Checkbox.Group
                  options={DIMENSION_OPTIONS}
                  value={selectedDimensions}
                  // 这里断言为 string[]，因为我们知道 options 的 value 都是 string
                  onChange={(checkedValues) =>
                    setSelectedDimensions(checkedValues as string[])
                  }
                  disabled={isProcessing}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "16px",
                  }}
                />
              </div>
            </div>

            <Divider />

            <div>
              <Text strong>3. 开始处理</Text>
              <div style={{ marginTop: 16 }}>
                <Button
                  type="primary"
                  icon={<ThunderboltOutlined />}
                  size="large"
                  onClick={handleStartAnalysis}
                  loading={isProcessing}
                  block
                >
                  {isProcessing ? "正在分析数据并生成标签..." : "开始自动打标"}
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* 底部结果区域 */}
      {resultData.length > 0 && (
        <Card
          title={
            <Space>
              <span>打标结果</span>
              <Tag color="blue">{resultData.length} 条数据</Tag>
            </Space>
          }
          bordered={false}
          extra={
            <Space>
              <Button
                icon={<DeleteOutlined />}
                onClick={() => setResultData([])}
              >
                清空结果
              </Button>
              <Button type="primary" ghost icon={<FileExcelOutlined />}>
                导出结果
              </Button>
            </Space>
          }
        >
          <Table
            columns={columns}
            dataSource={resultData}
            pagination={false}
            rowKey="key"
          />
        </Card>
      )}
    </Space>
  );
};

export default AutoTag;
