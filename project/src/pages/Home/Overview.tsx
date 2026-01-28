import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Statistic,
  List,
  Tag,
  Typography,
  Collapse,
  FloatButton,
  Badge,
  Tooltip,
  Modal,
  Progress,
  Button,
  Spin,
  message,
  Carousel,
  Divider,
} from "antd";
import {
  SafetyCertificateOutlined,
  RocketOutlined,
  TrophyOutlined,
  CrownOutlined,
  ShopOutlined,
  RobotOutlined,
  LinkOutlined,
  EnvironmentOutlined,
  ThunderboltFilled,
  SoundOutlined,
  AimOutlined,
  FireOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const { Panel } = Collapse;

// --- 1. 静态模拟数据 ---

// 模拟：朝阳区企业资质分布
const chaoyangStats = [
  { label: "上市企业", value: 35, icon: <GlobalOutlined />, color: "#cf1322" },
  { label: "外资企业", value: 128, icon: <GlobalOutlined />, color: "#d48806" },
  { label: "独角兽", value: 12, icon: <CrownOutlined />, color: "#eb2f96" },
  { label: "专精特新", value: 185, icon: <TrophyOutlined />, color: "#722ed1" },
  { label: "高新技术", value: 456, icon: <RocketOutlined />, color: "#1890ff" },
  { label: "科技中小", value: 890, icon: <ShopOutlined />, color: "#52c41a" },
];

// 模拟：热门区域分布
const hotspotStreets = [
  { name: "酒仙桥街道", count: 156, percent: 85 },
  { name: "望京街道", count: 132, percent: 72 },
  { name: "朝外街道", count: 98, percent: 54 },
  { name: "大屯街道", count: 76, percent: 42 },
  { name: "奥运村街道", count: 65, percent: 36 },
];

// 模拟：公告栏
const notices = [
  "【通知】关于2026年第一季度高新技术企业申报的预通知",
  "【动态】朝阳区新增3家国家级专精特新“小巨人”企业",
  "【系统】平台将于本周日凌晨 02:00 进行系统维护升级",
];

const Overview: React.FC = () => {
  const navigate = useNavigate();

  // 状态管理
  const [loading, setLoading] = useState(true);
  const [chainData, setChainData] = useState<any[]>([]);
  const [totalCompanies, setTotalCompanies] = useState(0);
  const [weakLinksFull, setWeakLinksFull] = useState<any[]>([]);
  const [recommendEnterprisesFull, setRecommendEnterprisesFull] = useState<
    any[]
  >([]);

  // 弹窗状态
  const [isWeakModalVisible, setIsWeakModalVisible] = useState(false);
  const [isRecModalVisible, setIsRecModalVisible] = useState(false);

  // 初始化：获取后端数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/api/dashboard/overview",
        );
        const json = await response.json();

        if (json.success) {
          setTotalCompanies(json.data.totalCompanies);
          setChainData(json.data.chainData);

          const computedWeakLinks = json.data.chainData.flatMap((layer: any) =>
            layer.subTags
              .filter((t: any) => t.isWeak)
              .map((t: any) => ({ ...t, layer: layer.title })),
          );
          setWeakLinksFull([
            ...computedWeakLinks,
            {
              name: "高端传感器 (示例)",
              layer: "上游 · 研发与技术",
              isWeak: true,
            },
          ]);
        } else {
          message.error("获取概览数据失败");
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    setRecommendEnterprisesFull([
      {
        name: "北京神州生物原料有限公司",
        district: "大兴区",
        tag: "生物原料供应",
        match: "98%",
      },
      {
        name: "中关村工业软件研发院",
        district: "海淀区",
        tag: "工业软件开发",
        match: "95%",
      },
      {
        name: "京北医药冷链物流集团",
        district: "顺义区",
        tag: "医药冷链物流",
        match: "92%",
      },
      {
        name: "亦庄生物医药基地",
        district: "亦庄",
        tag: "实验动物养殖",
        match: "90%",
      },
      {
        name: "昌平生命科学园",
        district: "昌平区",
        tag: "纳米材料应用",
        match: "88%",
      },
    ]);
  }, []);

  // 样式定义
  const styles = {
    pageContainer: {
      minHeight: "100%",
      background: "#f0f2f5",
    },
    headerSection: {
      background: "linear-gradient(135deg, #001529 0%, #003a8c 100%)",
      padding: "24px 32px 48px 32px",
      color: "#fff",
      position: "relative" as "relative",
    },
    contentSection: {
      padding: "0 24px 24px 24px",
      marginTop: -32,
    },
    card: {
      borderRadius: 8,
      boxShadow: "0 1px 2px 0 rgba(0,0,0,0.03)",
    },
    // 标签卡片样式（优化质感）
    tagCard: {
      cursor: "pointer",
      borderRadius: 6,
      transition: "all 0.3s ease",
      position: "relative" as "relative",
      padding: "10px 14px",
      background: "#fff",
      boxShadow: "0 2px 6px rgba(0,0,0,0.06)", // 增加基础阴影
      border: "1px solid #f0f0f0",
      display: "flex",
      flexDirection: "column" as "column",
      justifyContent: "space-between",
      minHeight: 64, // 增加高度
    },
    tagCardWeak: {
      background: "linear-gradient(135deg, #fff 0%, #fff7e6 100%)", // 微弱渐变
      border: "1px solid #ffd591",
      boxShadow: "0 2px 6px rgba(250, 140, 22, 0.15)", // 橙色系阴影
    },
  };

  return (
    <div style={styles.pageContainer}>
      {/* 1. 顶部驾驶舱核心区块 */}
      <div style={styles.headerSection}>
        <Row justify="space-between" align="middle" gutter={24}>
          <Col md={14} xs={24}>
            <div style={{ marginBottom: 16 }}>
              <Tag
                color="blue"
                style={{
                  border: "none",
                  background: "rgba(255,255,255,0.2)",
                  color: "#fff",
                }}
              >
                数字医疗
              </Tag>
              <Title
                level={2}
                style={{ color: "#fff", margin: "8px 0 0 0", letterSpacing: 1 }}
              >
                产业全景驾驶舱
              </Title>
              <Text style={{ color: "rgba(255,255,255,0.65)", fontSize: 13 }}>
                DIGITAL INDUSTRY PANORAMA COCKPIT
              </Text>
            </div>
          </Col>

          <Col md={10} xs={24}>
            <Row gutter={16}>
              <Col span={8}>
                <Statistic
                  title={
                    <span style={{ color: "rgba(255,255,255,0.7)" }}>
                      收录总数
                    </span>
                  }
                  value={totalCompanies}
                  suffix="家"
                  valueStyle={{
                    color: "#fff",
                    fontSize: 24,
                    fontWeight: "bold",
                  }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title={
                    <span style={{ color: "rgba(255,255,255,0.7)" }}>
                      综合评分
                    </span>
                  }
                  value={85.2}
                  valueStyle={{
                    color: "#73d13d",
                    fontSize: 24,
                    fontWeight: "bold",
                  }}
                  prefix={<SafetyCertificateOutlined />}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title={
                    <span style={{ color: "rgba(255,255,255,0.7)" }}>
                      协同效率
                    </span>
                  }
                  value={78.5}
                  suffix="%"
                  valueStyle={{
                    color: "#ffec3d",
                    fontSize: 24,
                    fontWeight: "bold",
                  }}
                  prefix={<ThunderboltFilled />}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </div>

      {/* 2. 主体内容区域 */}
      <div style={styles.contentSection}>
        {/* 公告栏 */}
        <Card
          bodyStyle={{ padding: "12px 24px" }}
          style={{
            ...styles.card,
            marginBottom: 24,
            borderLeft: "4px solid #1890ff",
          }}
          bordered={false}
        >
          <Row align="middle">
            <Col flex="80px">
              <span style={{ color: "#1890ff", fontWeight: "bold" }}>
                <SoundOutlined /> 平台公告
              </span>
              <Divider type="vertical" />
            </Col>
            <Col flex="auto">
              <Carousel
                autoplay
                dots={false}
                effect="scrollx"
                style={{ lineHeight: "24px" }}
              >
                {notices.map((notice, idx) => (
                  <div key={idx}>
                    <Tag
                      color={idx === 2 ? "red" : "blue"}
                      style={{ marginRight: 8 }}
                    >
                      {idx === 2 ? "系统通知" : "产业动态"}
                    </Tag>
                    <span style={{ color: "#595959", cursor: "pointer" }}>
                      {notice}
                    </span>
                    <span
                      style={{ float: "right", color: "#999", fontSize: 12 }}
                    >
                      2026-01-28
                    </span>
                  </div>
                ))}
              </Carousel>
            </Col>
          </Row>
        </Card>

        <Spin spinning={loading} tip="加载产业数据中...">
          <Row gutter={[24, 24]}>
            {/* ================= 左侧：产业链树谱 (增强质感) ================= */}
            <Col xs={24} lg={14} xl={15}>
              <Card
                title={
                  <span>
                    <EnvironmentOutlined style={{ color: "#1890ff" }} />{" "}
                    全景产业链树谱
                  </span>
                }
                bordered={false}
                style={{ ...styles.card, height: "100%" }}
                extra={<Tag color="blue">实时监测中</Tag>}
              >
                <Collapse
                  defaultActiveKey={["upstream", "midstream", "downstream"]}
                  ghost
                  expandIconPosition="end"
                >
                  {chainData.map((category) => (
                    <Panel
                      key={category.type}
                      header={
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            width: "100%",
                          }}
                        >
                          <span
                            style={{
                              fontWeight: 600,
                              fontSize: 15,
                              width: 150,
                            }}
                          >
                            {category.title}
                          </span>
                          <Divider type="vertical" />
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            共 {category.total} 家企业
                          </Text>
                        </div>
                      }
                      style={{
                        borderBottom: "1px solid #f0f0f0",
                        marginBottom: 12,
                      }}
                    >
                      <List
                        grid={{
                          gutter: 16,
                          xs: 2,
                          sm: 3,
                          md: 3,
                          lg: 3,
                          xl: 4,
                          xxl: 5,
                        }} // 增加gutter
                        dataSource={category.subTags}
                        renderItem={(tag: any) => (
                          <List.Item style={{ marginBottom: 16 }}>
                            <Tooltip
                              title={
                                tag.isWeak
                                  ? "该环节存在缺口，建议重点关注"
                                  : `收录: ${tag.count} 家`
                              }
                            >
                              <div
                                onClick={() =>
                                  navigate(
                                    `/graph-portrait/map?tag=${tag.name}`,
                                  )
                                }
                                style={{
                                  ...styles.tagCard,
                                  ...(tag.isWeak ? styles.tagCardWeak : {}),
                                }}
                                className="chain-node-card" // 方便后续写 hover css，或者直接在这里写 onMouseEnter
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.transform =
                                    "translateY(-4px)";
                                  e.currentTarget.style.boxShadow =
                                    "0 6px 16px rgba(0,0,0,0.12)";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.transform =
                                    "translateY(0)";
                                  e.currentTarget.style.boxShadow = tag.isWeak
                                    ? "0 2px 6px rgba(250, 140, 22, 0.15)"
                                    : "0 2px 6px rgba(0,0,0,0.06)";
                                }}
                              >
                                <div
                                  style={{
                                    fontSize: 13,
                                    color: tag.isWeak ? "#d46b08" : "#333",
                                    fontWeight: 500,
                                    lineHeight: 1.4,
                                    marginBottom: 8,
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                  }}
                                >
                                  {tag.name}
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
                                  <Tag
                                    color={tag.isWeak ? "orange" : "blue"}
                                    style={{
                                      margin: 0,
                                      border: "none",
                                      background: tag.isWeak
                                        ? "rgba(250,140,22,0.1)"
                                        : "rgba(24,144,255,0.1)",
                                      color: tag.isWeak ? "#fa8c16" : "#1890ff",
                                    }}
                                  >
                                    {tag.count} 家
                                  </Tag>
                                  {tag.isWeak && (
                                    <ThunderboltFilled
                                      style={{ color: "#fa8c16", fontSize: 14 }}
                                    />
                                  )}
                                </div>
                              </div>
                            </Tooltip>
                          </List.Item>
                        )}
                      />
                    </Panel>
                  ))}
                </Collapse>
              </Card>
            </Col>

            {/* ================= 右侧：分析面板 ================= */}
            <Col xs={24} lg={10} xl={9}>
              <Row gutter={[24, 24]}>
                {/* 1. 企业资质构成 */}
                <Col span={24}>
                  <Card
                    title={
                      <span>
                        <PieChartIcon /> 企业资质构成
                      </span>
                    }
                    bordered={false}
                    style={styles.card}
                  >
                    <Row gutter={[12, 12]}>
                      {chaoyangStats.map((item, idx) => (
                        <Col span={8} key={idx}>
                          <div
                            style={{
                              textAlign: "center",
                              padding: "12px 0",
                              background: "#fafafa",
                              borderRadius: 6,
                              border: "1px solid #f0f0f0",
                            }}
                          >
                            <div
                              style={{
                                fontSize: 18,
                                color: item.color,
                                marginBottom: 4,
                              }}
                            >
                              {item.icon}
                            </div>
                            <div
                              style={{
                                fontSize: 16,
                                fontWeight: "bold",
                                color: "#333",
                              }}
                            >
                              {item.value}
                            </div>
                            <div style={{ fontSize: 11, color: "#888" }}>
                              {item.label}
                            </div>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </Card>
                </Col>

                {/* 2. 热门区域 */}
                <Col span={24}>
                  <Card
                    title="热门区域分布 (Top 5 街道)"
                    extra={<FireOutlined style={{ color: "#ff4d4f" }} />}
                    bordered={false}
                    style={styles.card}
                  >
                    <List
                      dataSource={hotspotStreets}
                      renderItem={(item, index) => (
                        <List.Item
                          style={{
                            padding: "10px 0",
                            borderBottom: "1px dashed #f0f0f0",
                          }}
                        >
                          <div
                            style={{
                              width: "100%",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <Badge
                              count={index + 1}
                              style={{
                                backgroundColor:
                                  index < 3 ? "#ff4d4f" : "#d9d9d9",
                                boxShadow: "none",
                                marginRight: 12,
                              }}
                            />
                            <span style={{ flex: 1, color: "#333" }}>
                              {item.name}
                            </span>
                            <div style={{ width: 100, marginRight: 16 }}>
                              <Progress
                                percent={item.percent}
                                size="small"
                                showInfo={false}
                                strokeColor={index < 3 ? "#ff4d4f" : "#1890ff"}
                              />
                            </div>
                            <span style={{ color: "#999", fontSize: 12 }}>
                              {item.count} 家
                            </span>
                          </div>
                        </List.Item>
                      )}
                    />
                  </Card>
                </Col>

                {/* 3. 补链建议 & 引育推荐 (恢复双栏设计) */}
                <Col span={24}>
                  <Row gutter={[16, 16]}>
                    {/* 3.1 补链建议 */}
                    <Col span={12}>
                      <Card
                        title={
                          <span style={{ color: "#fa8c16", fontSize: 14 }}>
                            <LinkOutlined /> 补链建议
                          </span>
                        }
                        bordered={false}
                        style={{
                          ...styles.card,
                          height: "100%",
                          borderTop: "3px solid #fa8c16",
                        }}
                        headStyle={{ minHeight: 48, padding: "0 16px" }}
                        bodyStyle={{ padding: "0 12px 12px" }}
                        extra={
                          <Button
                            type="text"
                            size="small"
                            style={{ color: "#999", fontSize: 12 }}
                            onClick={() => setIsWeakModalVisible(true)}
                          >
                            更多
                          </Button>
                        }
                      >
                        <List
                          size="small"
                          dataSource={weakLinksFull.slice(0, 5)}
                          renderItem={(item) => (
                            <List.Item
                              style={{
                                padding: "8px 0",
                                borderBottom: "1px dashed #f0f0f0",
                              }}
                            >
                              <div style={{ width: "100%" }}>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    fontSize: 13,
                                    marginBottom: 2,
                                  }}
                                >
                                  <span
                                    style={{ color: "#333", fontWeight: 500 }}
                                  >
                                    {item.name}
                                  </span>
                                  <Tag
                                    color="error"
                                    style={{
                                      margin: 0,
                                      fontSize: 10,
                                      lineHeight: "16px",
                                      height: 18,
                                      padding: "0 4px",
                                    }}
                                  >
                                    缺口
                                  </Tag>
                                </div>
                                <div style={{ fontSize: 11, color: "#999" }}>
                                  所属: {item.layer.split("·")[0]}
                                </div>
                              </div>
                            </List.Item>
                          )}
                        />
                      </Card>
                    </Col>

                    {/* 3.2 引育推荐 */}
                    <Col span={12}>
                      <Card
                        title={
                          <span style={{ color: "#1890ff", fontSize: 14 }}>
                            <AimOutlined /> 推荐引育
                          </span>
                        }
                        bordered={false}
                        style={{
                          ...styles.card,
                          height: "100%",
                          borderTop: "3px solid #1890ff",
                        }}
                        headStyle={{ minHeight: 48, padding: "0 16px" }}
                        bodyStyle={{ padding: "0 12px 12px" }}
                        extra={
                          <Button
                            type="text"
                            size="small"
                            style={{ color: "#999", fontSize: 12 }}
                            onClick={() => setIsRecModalVisible(true)}
                          >
                            更多
                          </Button>
                        }
                      >
                        <List
                          size="small"
                          dataSource={recommendEnterprisesFull.slice(0, 5)}
                          renderItem={(item) => (
                            <List.Item
                              style={{
                                padding: "8px 0",
                                borderBottom: "1px dashed #f0f0f0",
                              }}
                            >
                              <div style={{ width: "100%" }}>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    fontSize: 13,
                                    marginBottom: 2,
                                  }}
                                >
                                  <span
                                    style={{
                                      maxWidth: "65%",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                      color: "#333",
                                      fontWeight: 500,
                                    }}
                                  >
                                    {item.name}
                                  </span>
                                  <span
                                    style={{
                                      color: "#52c41a",
                                      fontWeight: "bold",
                                      fontSize: 12,
                                    }}
                                  >
                                    {item.match}
                                  </span>
                                </div>
                                <div style={{ fontSize: 11, color: "#999" }}>
                                  <Tag
                                    style={{
                                      margin: 0,
                                      fontSize: 10,
                                      padding: "0 4px",
                                      border: "none",
                                      background: "#f0f5ff",
                                      color: "#1890ff",
                                    }}
                                  >
                                    {item.district}
                                  </Tag>
                                </div>
                              </div>
                            </List.Item>
                          )}
                        />
                      </Card>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
        </Spin>

        {/* 悬浮按钮组 */}
        <FloatButton.Group
          trigger="hover"
          style={{ right: 24, bottom: 80 }}
          icon={<RobotOutlined />}
        >
          <FloatButton
            tooltip="风险预警"
            icon={<SafetyCertificateOutlined />}
          />
          <FloatButton
            tooltip="AI 产业链助手"
            icon={<RobotOutlined />}
            type="primary"
          />
        </FloatButton.Group>

        {/* Modals 保持不变 */}
        <Modal
          title={
            <span style={{ color: "#fa8c16" }}>
              <LinkOutlined /> 补链建议完整清单
            </span>
          }
          open={isWeakModalVisible}
          onCancel={() => setIsWeakModalVisible(false)}
          footer={null}
          width={600}
        >
          <List
            dataSource={weakLinksFull}
            renderItem={(item: any) => (
              <List.Item>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: "bold",
                        color: "#333",
                      }}
                    >
                      {item.name}
                    </div>
                    <div style={{ fontSize: 12, color: "#999" }}>
                      所属环节：{item.layer}
                    </div>
                  </div>
                  <Tag color="error">急需引入</Tag>
                </div>
              </List.Item>
            )}
          />
        </Modal>

        <Modal
          title={
            <span style={{ color: "#1890ff" }}>
              <AimOutlined /> 引育推荐完整清单
            </span>
          }
          open={isRecModalVisible}
          onCancel={() => setIsRecModalVisible(false)}
          footer={null}
          width={700}
        >
          <List
            dataSource={recommendEnterprisesFull}
            renderItem={(item: any) => (
              <List.Item>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: "bold",
                        color: "#333",
                      }}
                    >
                      {item.name}
                    </div>
                    <div style={{ fontSize: 12, color: "#999", marginTop: 4 }}>
                      <Tag>{item.district}</Tag>{" "}
                      <Tag color="blue">{item.tag}</Tag>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        color: "#52c41a",
                        fontSize: 16,
                        fontWeight: "bold",
                      }}
                    >
                      匹配度 {item.match}
                    </div>
                    <Button type="link" size="small">
                      查看详情
                    </Button>
                  </div>
                </div>
              </List.Item>
            )}
          />
        </Modal>
      </div>
    </div>
  );
};

// 辅助组件
const PieChartIcon = () => (
  <span role="img" aria-label="pie-chart" className="anticon">
    <svg
      viewBox="64 64 896 896"
      focusable="false"
      data-icon="pie-chart"
      width="1em"
      height="1em"
      fill="currentColor"
      aria-hidden="true"
      style={{ color: "#1890ff", marginRight: 8 }}
    >
      <path d="M864 518H506V160c0-4.4-3.6-8-8-8h-26a398.46 398.46 0 00-282.6 117.4A398.24 398.24 0 0072 552a398.46 398.46 0 00117.4 282.6A398.24 398.24 0 00472 952a398.46 398.46 0 00282.6-117.4c75.1-75.1 116.5-175 116.5-281.4V526c0-4.4-3.6-8-8-8zM434 876.8A326.33 326.33 0 01147.2 590 326.25 326.25 0 01243.3 358 325.79 325.79 0 01434 233.1V876.8zm72-358.8V161.1c78.1 8.8 152 48 206 109.2 46.5 52.6 77.2 120.2 86.8 193.8H506z"></path>
    </svg>
  </span>
);

export default Overview;
