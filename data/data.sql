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
('药物','中药','下游','中成药及中药制品');

-- 4. 创建会话表 (chat_sessions)
-- 用于存储对话的标题、创建时间
CREATE TABLE IF NOT EXISTS `chat_sessions` (
  `session_id` VARCHAR(50) NOT NULL COMMENT '会话ID',
  `title` VARCHAR(255) DEFAULT NULL COMMENT '会话标题(通常是第一个问题)',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='AI对话会话表';

-- 5. 创建消息表 (chat_messages)
-- 用于存储具体的问答内容
CREATE TABLE IF NOT EXISTS `chat_messages` (
  `message_id` INT AUTO_INCREMENT PRIMARY KEY COMMENT '消息ID',
  `session_id` VARCHAR(50) NOT NULL COMMENT '关联的会话ID',
  `role` ENUM('user', 'assistant') NOT NULL COMMENT '角色',
  `content` TEXT NOT NULL COMMENT '消息内容',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '发送时间',
  INDEX `idx_session` (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='AI对话消息记录表';

-- ---------------------------------------------------------
-- 6. 模型定义表 (evaluation_models)
-- 用于区分：企业基础、企业科技、企业能力、行业基础...
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS `evaluation_models` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `model_key` VARCHAR(50) NOT NULL UNIQUE COMMENT '模型标识',
  `model_name` VARCHAR(100) NOT NULL COMMENT '模型名称',
  `target_type` ENUM('ENTERPRISE', 'INDUSTRY') NOT NULL COMMENT '适用对象',
  `description` TEXT COMMENT '描述',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='评分模型主表';

-- ---------------------------------------------------------
-- 7. 评分维度表 (evaluation_dimensions)
-- 定义具体的考察点，如：成立年限、专利类型、失信记录
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS `evaluation_dimensions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `model_key` VARCHAR(50) NOT NULL COMMENT '关联 evaluation_models.model_key',
  `dimension_name` VARCHAR(100) NOT NULL COMMENT '维度名称',
  `weight` DECIMAL(5, 2) DEFAULT 0 COMMENT '标准分值/权重',
  `is_deduction` TINYINT(1) DEFAULT 0 COMMENT '是否为减分项(1:是, 0:否)',
  `calc_method` ENUM('RANGE', 'ENUM', 'COUNT', 'KEYWORD', 'MANUAL') DEFAULT 'RANGE' COMMENT '计算方式',
  `sort_order` INT DEFAULT 0 COMMENT '排序',
  KEY `idx_model_key` (`model_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='评分维度配置表';

-- ---------------------------------------------------------
-- 8. 评分规则表 (evaluation_rules)
-- 定义具体得分逻辑，如：1-5年得3分，包含"AI"关键词得1分
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS `evaluation_rules` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `dimension_id` INT NOT NULL COMMENT '关联 evaluation_dimensions.id',
  `rule_label` VARCHAR(255) NOT NULL COMMENT '规则显示名称',
  `min_val` DECIMAL(20, 4) DEFAULT NULL COMMENT '范围下限(含)',
  `max_val` DECIMAL(20, 4) DEFAULT NULL COMMENT '范围上限(不含)',
  `text_match` TEXT DEFAULT NULL COMMENT '匹配文本/关键词(逗号分隔)',
  `score` DECIMAL(10, 2) NOT NULL COMMENT '得分',
  FOREIGN KEY (`dimension_id`) REFERENCES `evaluation_dimensions`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='评分细则表';

-- =========================================================
-- 数据初始化 (DML) - 严格对照文档录入
-- =========================================================

-- 1. 初始化模型
INSERT INTO `evaluation_models` (`model_key`, `model_name`, `target_type`) VALUES
('ent_basic', '企业基础评分模型', 'ENTERPRISE'),
('ent_tech', '企业科技属性评分模型', 'ENTERPRISE'),
('ent_ability', '企业专业能力评分模型', 'ENTERPRISE'),
('ind_basic', '行业基础评分模型', 'INDUSTRY'),
('ind_tech', '行业科技属性评分模型', 'INDUSTRY'),
('ind_ability', '行业能力评分模型', 'INDUSTRY')
ON DUPLICATE KEY UPDATE model_name = VALUES(model_name);

-- ---------------------------------------------------------
-- 2. 配置 [企业基础评分模型] (Source 164-165)
-- ---------------------------------------------------------

-- 插入维度
INSERT INTO `evaluation_dimensions` (`model_key`, `dimension_name`, `weight`, `calc_method`, `sort_order`, `is_deduction`) VALUES
('ent_basic', '成立年限', 5, 'RANGE', 1, 0),
('ent_basic', '注册资本', 6, 'RANGE', 2, 0),
('ent_basic', '实缴资本', 8, 'RANGE', 3, 0),
('ent_basic', '公司类型', 7, 'ENUM', 4, 0),
('ent_basic', '企业规模(分型)', 5, 'ENUM', 5, 0),
('ent_basic', '企业规模(社保人数)', 6, 'RANGE', 6, 0),
('ent_basic', '网址', 2, 'ENUM', 7, 0),
('ent_basic', '经营范围', 5, 'ENUM', 8, 0),
('ent_basic', '纳税人等级', 3, 'ENUM', 9, 0),
('ent_basic', '纳税人类型', 3, 'ENUM', 10, 0),
('ent_basic', '投融资轮次', 10, 'ENUM', 11, 0),
('ent_basic', '专利类型', 15, 'COUNT', 12, 0),  -- 累计加分
('ent_basic', '软件著作权', 15, 'COUNT', 13, 0), -- 累计加分
('ent_basic', '科技型企业', 10, 'ENUM', 14, 0),
-- 减分项 (用于风险评估)
('ent_basic', '失信被执行', 50, 'ENUM', 90, 1),
('ent_basic', '限制高消费', 50, 'ENUM', 91, 1),
('ent_basic', '经营异常', 10, 'ENUM', 92, 1),
('ent_basic', '注册地址(集群注册)', 2, 'ENUM', 93, 1);

-- 插入规则 (利用存储过程或变量简化插入，此处用标准SQL展开)
-- 成立年限
SET @d_id = (SELECT id FROM evaluation_dimensions WHERE model_key='ent_basic' AND dimension_name='成立年限');
INSERT INTO `evaluation_rules` (`dimension_id`, `rule_label`, `min_val`, `max_val`, `score`) VALUES
(@d_id, '1年内', 0, 1, 1),
(@d_id, '1-5年', 1, 5, 3),
(@d_id, '5-10年', 5, 10, 4),
(@d_id, '10年以上', 10, 999, 5);

-- 注册资本 (单位：万)
SET @d_id = (SELECT id FROM evaluation_dimensions WHERE model_key='ent_basic' AND dimension_name='注册资本');
INSERT INTO `evaluation_rules` (`dimension_id`, `rule_label`, `min_val`, `max_val`, `score`) VALUES
(@d_id, '0-100万', 0, 100, 2),
(@d_id, '100-200万', 100, 200, 3),
(@d_id, '200-500万', 200, 500, 4),
(@d_id, '500-1000万', 500, 1000, 5),
(@d_id, '1000万以上', 1000, 99999999, 6);

-- 实缴资本
SET @d_id = (SELECT id FROM evaluation_dimensions WHERE model_key='ent_basic' AND dimension_name='实缴资本');
INSERT INTO `evaluation_rules` (`dimension_id`, `rule_label`, `min_val`, `max_val`, `score`) VALUES
(@d_id, '无实缴', -1, 0, 1), -- 特殊标记
(@d_id, '0-100万', 0, 100, 3),
(@d_id, '100-500万', 100, 500, 6),
(@d_id, '500万以上', 500, 99999999, 8);

-- 公司类型
SET @d_id = (SELECT id FROM evaluation_dimensions WHERE model_key='ent_basic' AND dimension_name='公司类型');
INSERT INTO `evaluation_rules` (`dimension_id`, `rule_label`, `text_match`, `score`) VALUES
(@d_id, '央企/上市公司', '央企,上市公司', 7),
(@d_id, '国有企业/股份有限公司', '国有企业,股份有限公司', 5),
(@d_id, '有限责任公司/外商投资', '有限责任公司,外商投资', 4),
(@d_id, '自然人投资/股份合作', '自然人投资,股份合作', 3),
(@d_id, '个人独资/合伙', '个人独资,合伙', 2),
(@d_id, '其他', '其他', 1);

-- 企业规模(社保人数)
SET @d_id = (SELECT id FROM evaluation_dimensions WHERE model_key='ent_basic' AND dimension_name='企业规模(社保人数)');
INSERT INTO `evaluation_rules` (`dimension_id`, `rule_label`, `min_val`, `max_val`, `score`) VALUES
(@d_id, '小于30人', 1, 30, 2),
(@d_id, '30-50人', 30, 50, 3),
(@d_id, '50-99人', 50, 99, 4),
(@d_id, '100-499人', 100, 499, 5),
(@d_id, '500人以上', 500, 99999, 6),
(@d_id, '未披露或0人', 0, 0, 0);

-- 科技型企业 (基础版)
SET @d_id = (SELECT id FROM evaluation_dimensions WHERE model_key='ent_basic' AND dimension_name='科技型企业');
INSERT INTO `evaluation_rules` (`dimension_id`, `rule_label`, `text_match`, `score`) VALUES
(@d_id, '专精特新', '专精特新', 8),
(@d_id, '创新型企业', '创新型企业', 6),
(@d_id, '高新企业', '高新技术企业', 4),
(@d_id, '无', '', 1);

-- 减分项规则
SET @d_id = (SELECT id FROM evaluation_dimensions WHERE model_key='ent_basic' AND dimension_name='失信被执行');
INSERT INTO `evaluation_rules` (`dimension_id`, `rule_label`, `score`) VALUES (@d_id, '有失信记录', -50);

SET @d_id = (SELECT id FROM evaluation_dimensions WHERE model_key='ent_basic' AND dimension_name='限制高消费');
INSERT INTO `evaluation_rules` (`dimension_id`, `rule_label`, `score`) VALUES (@d_id, '有限高记录', -50);

SET @d_id = (SELECT id FROM evaluation_dimensions WHERE model_key='ent_basic' AND dimension_name='经营异常');
INSERT INTO `evaluation_rules` (`dimension_id`, `rule_label`, `score`) VALUES (@d_id, '有经营异常', -10);

-- ---------------------------------------------------------
-- 3. 配置 [企业科技属性评分模型] (Source 166-167)
-- ---------------------------------------------------------
INSERT INTO `evaluation_dimensions` (`model_key`, `dimension_name`, `weight`, `calc_method`, `sort_order`) VALUES
('ent_tech', '专利类型(数量级)', 10, 'RANGE', 1),
('ent_tech', '专利科技属性(关键词)', 10, 'KEYWORD', 2),
('ent_tech', '软著数量级', 10, 'RANGE', 3),
('ent_tech', '软著科技属性(关键词)', 10, 'KEYWORD', 4),
('ent_tech', '科技型企业(加权)', 10, 'ENUM', 5),
('ent_tech', '科技荣誉(国家级)', 20, 'KEYWORD', 6),
('ent_tech', '科技荣誉(省级)', 20, 'KEYWORD', 7),
('ent_tech', '核心期刊论文', 10, 'MANUAL', 8),
('ent_tech', '知名三甲医院PI合作', 10, 'MANUAL', 9),
('ent_tech', '算法备案的医疗大模型', 10, 'MANUAL', 10),
('ent_tech', '高质量数据集', 10, 'MANUAL', 11);

-- 专利科技属性关键词
SET @d_id = (SELECT id FROM evaluation_dimensions WHERE model_key='ent_tech' AND dimension_name='专利科技属性(关键词)');
INSERT INTO `evaluation_rules` (`dimension_id`, `rule_label`, `text_match`, `score`) VALUES
(@d_id, '高新关键词', 'AI,算法,5G,物联网,传感器,区块链,机器人,3D打印,人工智能,人机交互,基因,生物,诊断,IVD,可穿戴,医学影像', 1);

-- 科技荣誉(国家级) - 这里的score是单项分
SET @d_id = (SELECT id FROM evaluation_dimensions WHERE model_key='ent_tech' AND dimension_name='科技荣誉(国家级)');
INSERT INTO `evaluation_rules` (`dimension_id`, `rule_label`, `text_match`, `score`) VALUES
(@d_id, '国家级技术创新示范企业', '国家级技术创新示范企业', 4),
(@d_id, '国家级企业技术中心', '国家级企业技术中心', 4),
(@d_id, '国家火炬计划项目', '国家火炬计划项目', 4),
(@d_id, '创新型领军企业', '创新型领军企业', 4),
(@d_id, '隐形冠军', '隐形冠军', 1),
(@d_id, '独角兽企业', '独角兽企业', 1),
(@d_id, '未来/潜在独角兽', '未来独角兽,潜在独角兽', 1);

-- 科技荣誉(省级)
SET @d_id = (SELECT id FROM evaluation_dimensions WHERE model_key='ent_tech' AND dimension_name='科技荣誉(省级)');
INSERT INTO `evaluation_rules` (`dimension_id`, `rule_label`, `text_match`, `score`) VALUES
(@d_id, '省级荣誉', '瞪羚企业,省级技术创新示范企业,省级企业技术中心,技术先进型服务企业,科技小巨人企业,专精特新小巨人,创新型试点企业,雏鹰企业', 1); 
-- 注：文档未详细标明省级每项分数，这里暂定1分/项，或根据需求调整

-- ---------------------------------------------------------
-- 4. 配置 [企业专业能力评分模型] (Source 168-169)
-- 此部分多为人工录入或报告来源
-- ---------------------------------------------------------
INSERT INTO `evaluation_dimensions` (`model_key`, `dimension_name`, `weight`, `calc_method`, `sort_order`) VALUES
('ent_ability', '行业市场规模分值', 10, 'MANUAL', 1),
('ent_ability', '行业热度分值', 10, 'MANUAL', 2),
('ent_ability', '行业利润率分值', 10, 'MANUAL', 3),
('ent_ability', '资质认证', 10, 'KEYWORD', 4),
('ent_ability', '证书(药械)', 10, 'COUNT', 5),
('ent_ability', '创新性', 10, 'KEYWORD', 6),
('ent_ability', '合作上下游', 10, 'MANUAL', 7);

SET @d_id = (SELECT id FROM evaluation_dimensions WHERE model_key='ent_ability' AND dimension_name='资质认证');
INSERT INTO `evaluation_rules` (`dimension_id`, `rule_label`, `text_match`, `score`) VALUES
(@d_id, '医疗器械质量管理体系', '医疗器械质量管理体系认证', 10);

SET @d_id = (SELECT id FROM evaluation_dimensions WHERE model_key='ent_ability' AND dimension_name='创新性');
INSERT INTO `evaluation_rules` (`dimension_id`, `rule_label`, `text_match`, `score`) VALUES
(@d_id, '创新公示', '创新医疗器械,突破性治疗公示', 10);

-- =========================================================
-- 行业模型配置 (Industry Models)
-- 由于文档中行业模型规则(Source 152)与企业模型(Source 164)高度一致
-- 为简化，此处复用企业规则逻辑，但在数据库层面是独立的数据
-- =========================================================

-- 复制企业基础维度到行业基础
INSERT INTO `evaluation_dimensions` (`model_key`, `dimension_name`, `weight`, `calc_method`, `sort_order`, `is_deduction`)
SELECT 'ind_basic', dimension_name, weight, calc_method, sort_order, is_deduction
FROM `evaluation_dimensions` WHERE model_key = 'ent_basic';

-- 复制规则 (需要复杂的JOIN，此处为简便，建议后端代码处理复用，或手动执行类似的插入)
-- 实际开发中，如果行业与企业规则完全相同，可共享配置。
-- 但鉴于文档区分了章节，建议保持独立性。
-- (此处省略行业规则的重复INSERT语句，逻辑同上)