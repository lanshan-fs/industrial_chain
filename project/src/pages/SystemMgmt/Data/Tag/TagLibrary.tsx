import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Statistic,
  List,
  Tag,
  Button,
  Typography,
  Space,
  Progress,
  Tooltip,
  Drawer,
  Spin,
  message,
} from "antd";
import {
  TagsOutlined,
  BankOutlined,
  SettingOutlined,
  FireOutlined,
  ArrowUpOutlined,
  RightOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const TagLibrary: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({
    dimensions: [],
    overview: { totalTags: 0, coveredEnterprises: 0, totalCompanies: 0 }
  });
  const [manageDrawerVisible, setManageDrawerVisible] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/tags/dimensions/stats");
      const json = await res.json();
      if (json.success) {
        setStats(json.data);
      }
    } catch (error) {
      console.error("Fetch tag stats failed", error);
      message.error("加载标签统计失败");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (dimId: number) => {
    navigate(`/system-mgmt/tag-library/detail/${dimId}`);
  };

  return (
    <div style={{ minHeight: "100%" }}>
      <Spin spinning={loading}>
        {/* 第一部分：体系统计卡片 */}
        <Card bordered={false} style={{ marginBottom: 24 }}>
          <Row gutter={24}>
            <Col span={12}>
              <Statistic
                title="标签库总数"
                value={stats.overview.totalTags}
                prefix={<TagsOutlined />}
                suffix="个"
                valueStyle={{ color: "#1890ff" }}
              />
              <div style={{ marginTop: 8, fontSize: 12, color: "#8c8c8c" }}>
                涵盖 {stats.dimensions.length} 大维度，持续建设中
              </div>
            </Col>
            <Col span={12}>
              <Statistic
                title="已覆盖企业总数"
                value={stats.overview.coveredEnterprises}
                prefix={<BankOutlined />}
                suffix="家"
                valueStyle={{ color: "#52c41a" }}
              />
              <div style={{ marginTop: 8, fontSize: 12, color: "#8c8c8c" }}>
                <Space>
                  <span>总收录企业</span>
                  <span style={{ fontWeight: 600 }}>{stats.overview.totalCompanies} 家</span>
                </Space>
              </div>
            </Col>
          </Row>
        </Card>

        {/* 第二部分：维度分布详情 */}
        <Title level={5} style={{ marginBottom: 16 }}>维度分布详情</Title>
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          {stats.dimensions.map((dim: any) => (
            <Col xs={24} sm={12} md={8} lg={6} key={dim.id}>
              <Card
                hoverable
                bordered={false}
                style={{ height: "100%", borderTop: `4px solid ${dim.color}` }}
                bodyStyle={{ padding: "20px 16px" }}
                onClick={() => handleViewDetail(dim.id)}
              >
                <Space direction="vertical" style={{ width: "100%" }} size="middle">
                  <div><Text strong style={{ fontSize: 16 }}>{dim.name}</Text></div>
                  <div>
                    <Text type="secondary" style={{ fontSize: 12 }}>标签数量</Text>
                    <div style={{ fontSize: 24, fontWeight: "bold" }}>{dim.tagCount}</div>
                  </div>
                  <div>
                    <Text type="secondary" style={{ fontSize: 12 }}>覆盖率</Text>
                    <Progress
                      percent={dim.coverage}
                      size="small"
                      strokeColor={dim.color}
                    />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginTop: 4 }}>
                      <span>{dim.usedCount} 家企业已打标</span>
                      <a onClick={(e) => { e.stopPropagation(); handleViewDetail(dim.id); }}>
                        管理 <RightOutlined style={{ fontSize: 10 }} />
                      </a>
                    </div>
                  </div>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>

        <Row gutter={24}>
          {/* 第三部分：热门标签 (目前保持静态，后续可改为真实查询) */}
          <Col xs={24} lg={16}>
            <Card
              title={<Space><FireOutlined style={{ color: "#f5222d" }} /> 核心标签库状态</Space>}
              bordered={false}
              style={{ height: "100%" }}
            >
              <div style={{ padding: '40px 0', textAlign: 'center', color: '#999' }}>
                <InfoCircleOutlined style={{ fontSize: 32, marginBottom: 16 }} />
                <p>标签库运行正常，所有维度已对接数据库。</p>
                <p>点击上方维度卡片可进入标签明细管理。</p>
              </div>
            </Card>
          </Col>

          {/* 第四部分：体系管理入口 */}
          <Col xs={24} lg={8}>
            <Space direction="vertical" style={{ width: "100%" }} size={24}>
              <Card
                title={<Space><SettingOutlined /> 体系管理</Space>}
                bordered={false}
              >
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <Button
                    type="primary"
                    size="large"
                    onClick={() => setManageDrawerVisible(true)}
                    icon={<SettingOutlined />}
                    block
                  >
                    全局配置
                  </Button>
                  <Text type="secondary" style={{ display: "block", marginTop: 16, fontSize: 13 }}>
                    支持维度权重调整及自动打标规则设置
                  </Text>
                </div>
              </Card>
            </Space>
          </Col>
        </Row>
      </Spin>

      <Drawer
        title="全局配置"
        placement="right"
        onClose={() => setManageDrawerVisible(false)}
        open={manageDrawerVisible}
        width={400}
      >
        <div style={{ textAlign: "center", marginTop: 50, color: "#999" }}>
          <p>此处提供自动打标规则的详细配置</p>
        </div>
      </Drawer>
    </div>
  );
};

export default TagLibrary;
