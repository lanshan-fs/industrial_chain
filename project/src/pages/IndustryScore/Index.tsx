import React, { useState } from "react";
import { Card, Input, Row, Col, Typography, Space } from "antd";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

// --- 模拟数据 ---

const IndustryScore: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // 处理搜索：跳转到企业评分页面 (需携带参数)
  const handleSearch = (value: string) => {
    if (!value) return;
    setLoading(true);
    // 模拟搜索延迟
    setTimeout(() => {
      setLoading(false);
      // 跳转到企业评分详情页，实际开发中应先调用接口获取企业ID
      navigate(`/score-mgmt/enterprise-score?keyword=${value}`);
    }, 500);
  };

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      {/* 1. 顶部搜索区 */}
      <Card bordered={false} style={{ borderRadius: 8 }}>
        <Row justify="center" align="middle">
          <Col xs={24} sm={18} md={12}>
            <Title level={4} style={{ textAlign: "center", marginBottom: 24 }}>
              产业与企业评分检索
            </Title>
            <Input.Search
              placeholder="请输入企业名称或统一社会信用代码，查看企业微观评分"
              enterButton="搜索企业"
              size="large"
              onSearch={handleSearch}
              loading={loading}
              allowClear
            />
          </Col>
        </Row>
      </Card>
    </Space>
  );
};

export default IndustryScore;
