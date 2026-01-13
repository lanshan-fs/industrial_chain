import React from "react";
import {
  Row,
  Col,
  Card,
  Tree,
  Statistic,
  List,
  Avatar,
  Tag,
  Typography,
  theme,
} from "antd";
import type { TreeDataNode } from "antd";

const { Title } = Typography;

// 模拟数据
const tagTreeData: TreeDataNode[] = [
  {
    title: "产业链环节",
    key: "chain",
    children: [
      {
        title: "上游研发",
        key: "upstream",
        children: [
          { title: "基础研究", key: "basic-research" },
          { title: "原料供应", key: "raw-material" },
        ],
      },
      {
        title: "中游制造",
        key: "midstream",
        children: [
          { title: "设备生产", key: "equipment" },
          { title: "软件开发", key: "software" },
        ],
      },
    ],
  },
];

const Overview: React.FC = () => {
  const {
    token: { colorPrimary },
  } = theme.useToken();

  return (
    <div style={{ height: "100%" }}>
      <Title level={4} style={{ marginBottom: 24 }}>
        数据概览
      </Title>
      <Row gutter={[16, 16]} style={{ height: "100%" }}>
        <Col xs={24} md={6}>
          <Card
            title="标签筛选 (1-3级)"
            bordered={false}
            style={{ height: "100%", minHeight: 400 }}
          >
            <Tree
              showLine
              defaultExpandedKeys={["chain", "upstream"]}
              treeData={tagTreeData}
            />
          </Card>
        </Col>
        <Col xs={24} md={18}>
          <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
            <Col span={8}>
              <Card size="small">
                <Statistic title="当前标签下企业" value={1128} suffix="家" />
              </Card>
            </Col>
            <Col span={8}>
              <Card size="small">
                <Statistic title="平均评分" value={85.2} precision={1} />
              </Card>
            </Col>
            <Col span={8}>
              <Card size="small">
                <Statistic title="本周新增" value={12} prefix="+" />
              </Card>
            </Col>
          </Row>
          <Card title="关联主体列表" bordered={false}>
            <List
              itemLayout="horizontal"
              dataSource={[
                {
                  title: "北京数字医疗科技有限公司",
                  tag: "上游研发",
                  score: 92,
                },
                { title: "朝阳区智慧康养中心", tag: "下游服务", score: 88 },
              ]}
              renderItem={(item) => (
                <List.Item actions={[<a key="d">详情</a>]}>
                  <List.Item.Meta
                    avatar={
                      <Avatar style={{ backgroundColor: colorPrimary }}>
                        {item.title[0]}
                      </Avatar>
                    }
                    title={<a>{item.title}</a>}
                    description={<Tag color="blue">{item.tag}</Tag>}
                  />
                  <div
                    style={{
                      fontWeight: "bold",
                      color: item.score > 90 ? "#52c41a" : "#1890ff",
                    }}
                  >
                    {item.score}
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Overview;
