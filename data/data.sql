USE `industrial_chain`;

-- 1. 创建企业表 (companies)
CREATE TABLE IF NOT EXISTS `companies` (
  `company_id` VARCHAR(50) NOT NULL COMMENT '企业ID',
  `company_name` VARCHAR(255) DEFAULT NULL COMMENT '企业名称',
  `raw_variants` TEXT DEFAULT NULL COMMENT '原始变体/别名',
  PRIMARY KEY (`company_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='企业信息表';

-- 2. 创建标签表 (tags)
CREATE TABLE IF NOT EXISTS `tags` (
  `tag_id` VARCHAR(50) NOT NULL COMMENT '标签ID',
  `domain` VARCHAR(100) DEFAULT NULL COMMENT '领域',
  `level` INT DEFAULT NULL COMMENT '层级',
  `tag_name` VARCHAR(255) DEFAULT NULL COMMENT '标签名称',
  `path` TEXT DEFAULT NULL COMMENT '全路径',
  `parent_tag_id` VARCHAR(50) DEFAULT NULL COMMENT '父标签ID',
  `parent_path` TEXT DEFAULT NULL COMMENT '父路径',
  `source_sheet` VARCHAR(255) DEFAULT NULL COMMENT '来源表',
  `representative_companies` TEXT DEFAULT NULL COMMENT '代表性企业',
  `level0` VARCHAR(255) DEFAULT NULL,
  `level1` VARCHAR(255) DEFAULT NULL,
  `level2` VARCHAR(255) DEFAULT NULL,
  `level3` VARCHAR(255) DEFAULT NULL,
  `level4` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='产业链标签体系表';

-- 3. 创建企业-标签关联表 (companies_tags)
CREATE TABLE IF NOT EXISTS `companies_tags_map` (
  `company_id` VARCHAR(50) NOT NULL COMMENT '企业ID',
  `tag_id` VARCHAR(50) NOT NULL COMMENT '标签ID',
  KEY `idx_company` (`company_id`),
  KEY `idx_tag` (`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='企业与标签关联表';


CREATE TABLE IF NOT EXISTS `tags_chain_stage_map` (
  `domain` VARCHAR(100) NOT NULL COMMENT '领域',
  `level1` VARCHAR(255) NOT NULL ,
  `chain_stage` ENUM('上游','中游','下游') NOT NULL COMMENT '产业链阶段',
  `description` TEXT DEFAULT NULL COMMENT '划分依据说明',
  PRIMARY KEY (`domain`, `level1`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
COMMENT='产业链阶段映射表';

INSERT INTO chain_stage_map VALUES
('数字医疗','前沿技术融合','上游','底层算法、数据、算力、安全与前沿技术'),
('数字医疗','智慧医疗','中游','面向医疗机构的信息化与系统集成'),
('数字医疗','互联网+健康','下游','面向个人和家庭的健康服务'),
('数字医疗','数字疗法','下游','直接面向患者的数字化治疗与干预'),

('医疗器械','医用卫生材料','上游','医疗器械所需基础材料'),
('医疗器械','医用高分子制品','上游','高分子材料及部件'),
('医疗器械','制药装备','上游','药品和器械生产装备'),

('医疗器械','体外诊断 (IVD)','中游','诊断设备与试剂系统'),
('医疗器械','治疗设备','中游','治疗类整机设备'),
('医疗器械','影像设备','中游','医学影像系统'),
('医疗器械','康复设备','中游','康复治疗设备'),
('医疗器械','家用医疗设备','中游','面向家庭的医疗设备'),
('医疗器械','生命信息支持设备','中游','监护与生命支持系统'),
('医疗器械','辅助设备','中游','通用辅助类医疗设备'),

('医疗器械','注射穿刺类','下游','临床直接使用器械'),
('医疗器械','血管介入类','下游','高专用介入类器械'),
('医疗器械','非血管介入类','下游','介入治疗器械'),
('医疗器械','无源植入物','下游','植入人体的无源器械'),
('医疗器械','有源植入物','下游','植入人体的有源器械'),

('医疗服务','保险支付','上游','医疗服务的支付与保障体系'),

('医疗服务','严肃医疗','中游','以治疗为核心的医疗服务'),
('医疗服务','第三方中心','中游','检验、影像等专业服务机构'),

('医疗服务','互联网医疗','下游','线上医疗服务平台'),
('医疗服务','医疗零售','下游','药店与医疗零售终端'),
('医疗服务','医药商业 / 流通','下游','药品流通与销售'),
('医疗服务','消费医疗','下游','非刚需、消费型医疗服务'),

('药物','AI 软件 / 工具平台','上游','AI研发工具与算法平台'),
('药物','AI CRO / 技术服务商','上游','研发外包与技术服务'),
('药物','AI 平台整体授权 / 合作','上游','技术授权与平台合作'),

('药物','AI 药物研发平台','中游','AI驱动的药物研发'),
('药物','AI + 特定领域研发','中游','聚焦特定疾病或靶点'),
('药物','AI 自研管线企业','中游','拥有自有药物管线'),

('药物','化学制药','下游','化学药品生产'),
('药物','生物制品','下游','生物药品生产'),
('药物','中药','下游','中成药及中药制品')