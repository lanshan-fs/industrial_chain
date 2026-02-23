-- ==============================================================
-- 朝阳区产业链洞察平台 - 数据库初始化脚本 (完整全量版)
-- 严格基于 数据原型 V1 完整 328 个节点录入
-- 采用 Metadata Linking 架构，统一 8 大维度
-- ==============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 创建数据库
CREATE DATABASE IF NOT EXISTS industrial_chain DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE industrial_chain;

-- ----------------------------
-- 1. 企业全息信息表 (适配 CSV 全量维度)
-- ----------------------------
DROP TABLE IF EXISTS `companies`;
CREATE TABLE `companies` (
  `company_name` VARCHAR(255) NOT NULL COMMENT '企业名称',
  `company_id` VARCHAR(50) NOT NULL COMMENT '统一社会信用代码 (PK)',
  `establishment_date_desc` VARCHAR(50) DEFAULT NULL COMMENT '成立年限文本',
  `reg_capital` VARCHAR(100) DEFAULT NULL COMMENT '注册资本原文',
  `reg_capital_rmb` VARCHAR(100) DEFAULT NULL COMMENT '注册资本(万元人民币)',
  `paid_capital` VARCHAR(100) DEFAULT NULL COMMENT '实缴资本原文',
  `paid_capital_rmb` VARCHAR(100) DEFAULT NULL COMMENT '实缴资本(万元人民币)',
  `enterprise_type` VARCHAR(100) DEFAULT NULL COMMENT '企业类型',
  `organization_type` VARCHAR(100) DEFAULT NULL COMMENT '组织类型',
  `enterprise_scale` VARCHAR(50) DEFAULT NULL COMMENT '企业规模',
  `is_branch_info` TEXT DEFAULT NULL COMMENT '分支机构信息',
  `address_info` TEXT DEFAULT NULL COMMENT '地址信息',
  `financing_round` VARCHAR(50) DEFAULT NULL COMMENT '投融资轮次',
  `qualifications` TEXT DEFAULT NULL COMMENT '企业资质标签',
  `legal_person` VARCHAR(50) DEFAULT NULL COMMENT '法定代表人',
  `insured_count` VARCHAR(50) DEFAULT NULL COMMENT '社保人数原文',
  `reg_number` VARCHAR(50) DEFAULT NULL COMMENT '注册号',
  `org_code` VARCHAR(50) DEFAULT NULL COMMENT '组织机构代码',
  `industry_gs` VARCHAR(100) DEFAULT NULL COMMENT '所属行业(工商)',
  `business_scope` TEXT DEFAULT NULL COMMENT '经营范围',
  `email_gs` VARCHAR(100) DEFAULT NULL COMMENT '邮箱(工商)',
  `email_auth` VARCHAR(100) DEFAULT NULL COMMENT '邮箱(认证)',
  `shareholders` TEXT DEFAULT NULL COMMENT '股东信息',
  `phone_gs` VARCHAR(50) DEFAULT NULL COMMENT '联系电话',
  `phone2` VARCHAR(50) DEFAULT NULL,
  `phone3` VARCHAR(50) DEFAULT NULL,
  `phone4` VARCHAR(50) DEFAULT NULL,
  `phone5` VARCHAR(50) DEFAULT NULL,
  `phone_rec` VARCHAR(50) DEFAULT NULL COMMENT '推荐电话',
  `original_row` INT DEFAULT NULL,
  `judicial_cases` INT DEFAULT 0 COMMENT '司法案件数',
  `judicial_docs` INT DEFAULT 0 COMMENT '裁判文书数',
  `judicial_total` INT DEFAULT 0 COMMENT '法律文书合计',
  `dishonest_executor` INT DEFAULT 0 COMMENT '失信被执行数',
  `chattel_mortgage` INT DEFAULT 0 COMMENT '动产抵押数',
  `operating_abnormal` INT DEFAULT 0 COMMENT '经营异常数',
  `admin_penalty` INT DEFAULT 0 COMMENT '行政处罚数',
  `bankruptcy_overlap` INT DEFAULT 0 COMMENT '破产重叠数',
  `liquidation_info` INT DEFAULT 0 COMMENT '清算信息数',
  `env_penalty` INT DEFAULT 0 COMMENT '环保处罚数',
  `equity_freeze` INT DEFAULT 0 COMMENT '股权冻结数',
  `executor` INT DEFAULT 0 COMMENT '被执行人数',
  `limit_consumption` INT DEFAULT 0 COMMENT '限制高消费数',
  `address_detail` TEXT DEFAULT NULL COMMENT '详细地址',
  `district` VARCHAR(50) DEFAULT '朝阳区',
  `street` VARCHAR(100) DEFAULT NULL COMMENT '所属街道',
  `staff_count_desc` VARCHAR(100) DEFAULT NULL COMMENT '员工人数描述',
  `insured_status` VARCHAR(50) DEFAULT NULL COMMENT '社保状态',
  `listing_status` VARCHAR(50) DEFAULT NULL COMMENT '上市状态',
  `gb_industry` VARCHAR(100) DEFAULT NULL COMMENT '国标行业',
  `contact_methods` VARCHAR(100) DEFAULT NULL COMMENT '联系方式摘要',
  `same_phone_count` INT DEFAULT 0 COMMENT '同电话企业数',
  `email_gs_status` VARCHAR(50) DEFAULT NULL,
  `is_small_micro` TINYINT(1) DEFAULT 0,
  `has_change_info` TINYINT(1) DEFAULT 0,
  `is_general_taxpayer` TINYINT(1) DEFAULT 0,
  `has_financing` TINYINT(1) DEFAULT 0,
  `bidding_count` INT DEFAULT 0,
  `recruitment_count` INT DEFAULT 0,
  `tax_rating` VARCHAR(10) DEFAULT NULL,
  `bank_account` VARCHAR(100) DEFAULT NULL,
  `total_score` DECIMAL(5,2) DEFAULT 0,
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`company_id`),
  INDEX `idx_company_name` (`company_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- 2. 行业分类表 (产业链树谱)
-- ----------------------------
DROP TABLE IF EXISTS `industry_categories`;
CREATE TABLE `industry_categories` (
  `id` INT NOT NULL,
  `parent_id` INT DEFAULT NULL,
  `name` VARCHAR(200) NOT NULL,
  `level` TINYINT NOT NULL,
  `sort_order` INT DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- 3. 标签体系 (Metadata Linking 架构)
-- ----------------------------
DROP TABLE IF EXISTS `tag_dimensions`;
CREATE TABLE `tag_dimensions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `source_table` VARCHAR(50) DEFAULT NULL COMMENT '数据来源表 (NULL则查询tag_library)',
  `sort_order` INT DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `tag_sub_dimensions`;
CREATE TABLE `tag_sub_dimensions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `dimension_id` INT NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `sort_order` INT DEFAULT 0,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_tag_sub_dim` FOREIGN KEY (`dimension_id`) REFERENCES `tag_dimensions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `tag_library`;
CREATE TABLE `tag_library` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `sub_dimension_id` INT NOT NULL,
  `tag_name` VARCHAR(100) NOT NULL,
  `sort_order` INT DEFAULT 0,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_tag_lib_sub` FOREIGN KEY (`sub_dimension_id`) REFERENCES `tag_sub_dimensions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `company_tag_map`;
CREATE TABLE `company_tag_map` (
  `company_id` VARCHAR(50) NOT NULL,
  `tag_id` INT NOT NULL,
  PRIMARY KEY (`company_id`, `tag_id`),
  CONSTRAINT `fk_ctm_company` FOREIGN KEY (`company_id`) REFERENCES `companies` (`company_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ctm_tag` FOREIGN KEY (`tag_id`) REFERENCES `tag_library` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- 4. 系统基础表 (街道、字典、评分模型)
-- ----------------------------
DROP TABLE IF EXISTS `sys_dictionary`;
CREATE TABLE `sys_dictionary` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `group_code` VARCHAR(50) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `value` VARCHAR(100) NOT NULL,
  `sort_order` INT DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `sys_region`;
CREATE TABLE `sys_region` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `type` ENUM('STREET', 'AREA') NOT NULL,
  `sort_order` INT DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `tags_chain_stage_map`;
CREATE TABLE `tags_chain_stage_map` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `level1` VARCHAR(100) NOT NULL,
  `chain_stage` ENUM('上游', '中游', '下游') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `evaluation_models`;
CREATE TABLE `evaluation_models` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `model_key` VARCHAR(50) NOT NULL,
  `model_name` VARCHAR(100) NOT NULL,
  `target_type` ENUM('ENTERPRISE', 'INDUSTRY') NOT NULL,
  `description` TEXT,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_model_key` (`model_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `evaluation_dimensions`;
CREATE TABLE `evaluation_dimensions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `model_key` VARCHAR(50) DEFAULT NULL,
  `dimension_name` VARCHAR(100) NOT NULL,
  `weight` DECIMAL(5,2) DEFAULT 0.00,
  `is_deduction` TINYINT(1) DEFAULT 0,
  `sort_order` INT DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `evaluation_rules`;
CREATE TABLE `evaluation_rules` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `dimension_id` INT DEFAULT NULL,
  `rule_label` VARCHAR(255) NOT NULL,
  `score` DECIMAL(5,2) DEFAULT 0.00,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================
-- 5. 行业分类全量录入 (严格 328 节点)
-- ==============================================================
-- 5.1 数字医疗 (100+)
INSERT INTO `industry_categories` VALUES (1, NULL, '数字医疗', 0, 1);
INSERT INTO `industry_categories` VALUES (101, 1, '智慧医疗', 1, 1);
INSERT INTO `industry_categories` VALUES (10101, 101, '智慧CDSS', 2, 1);
INSERT INTO `industry_categories` VALUES (1010101, 10101, '主动干预：临床诊断与治疗', 3, 1);
INSERT INTO `industry_categories` VALUES (1010102, 10101, '合理用药管理', 3, 2);
INSERT INTO `industry_categories` VALUES (1010103, 10101, '被动检索：知识库', 3, 3);
INSERT INTO `industry_categories` VALUES (10102, 101, '智慧电子病历', 2, 2);
INSERT INTO `industry_categories` VALUES (1010201, 10102, '信息化企业', 3, 1);
INSERT INTO `industry_categories` VALUES (1010202, 10102, '云服务提供商', 3, 2);
INSERT INTO `industry_categories` VALUES (10103, 101, '健康医疗大数据', 2, 3);
INSERT INTO `industry_categories` VALUES (1010301, 10103, '信息化厂商', 3, 1);
INSERT INTO `industry_categories` VALUES (1010302, 10103, '数据处理服务商', 3, 2);
INSERT INTO `industry_categories` VALUES (1010303, 10103, '数据安全服务提供商', 3, 3);
INSERT INTO `industry_categories` VALUES (1010304, 10103, '智能硬件厂商', 3, 4);
INSERT INTO `industry_categories` VALUES (1010305, 10103, '物联网厂商', 3, 5);
INSERT INTO `industry_categories` VALUES (10104, 101, '智慧病理', 2, 4);
INSERT INTO `industry_categories` VALUES (1010401, 10104, '全切片成像系统与设备', 3, 1);
INSERT INTO `industry_categories` VALUES (1010402, 10104, '独立病理中心', 3, 2);
INSERT INTO `industry_categories` VALUES (1010403, 10104, '辅助病理诊断', 3, 3);
INSERT INTO `industry_categories` VALUES (10105, 101, '远程医疗', 2, 5);
INSERT INTO `industry_categories` VALUES (1010501, 10105, '信息化系统厂商', 3, 1);
INSERT INTO `industry_categories` VALUES (1010502, 10105, '硬件设备生产商', 3, 2);
INSERT INTO `industry_categories` VALUES (1010503, 10105, '通信服务商', 3, 3);
INSERT INTO `industry_categories` VALUES (10106, 101, '智慧医学影像', 2, 6);
INSERT INTO `industry_categories` VALUES (1010601, 10106, '人工智能辅助/线上诊断分析平台', 3, 1);
INSERT INTO `industry_categories` VALUES (1010602, 10106, '医学影像存储系统PACS供应商', 3, 2);
INSERT INTO `industry_categories` VALUES (1010603, 10106, '智慧CT', 3, 3);
INSERT INTO `industry_categories` VALUES (1010604, 10106, '智慧DR', 3, 4);
INSERT INTO `industry_categories` VALUES (1010605, 10106, '智慧MRI', 3, 5);
INSERT INTO `industry_categories` VALUES (1010606, 10106, '智慧OCT', 3, 6);
INSERT INTO `industry_categories` VALUES (1010607, 10106, '智慧内窥镜', 3, 7);
INSERT INTO `industry_categories` VALUES (1010608, 10106, '智慧超声', 3, 8);
INSERT INTO `industry_categories` VALUES (1010609, 10106, '独立医学影像中心', 3, 9);
INSERT INTO `industry_categories` VALUES (10107, 101, '智慧护理', 2, 7);
INSERT INTO `industry_categories` VALUES (1010701, 10107, '专项护理-养老', 3, 1);
INSERT INTO `industry_categories` VALUES (1010702, 10107, '专项护理-慢病管理', 3, 2);
INSERT INTO `industry_categories` VALUES (1010703, 10107, '专项护理-母婴', 3, 3);
INSERT INTO `industry_categories` VALUES (1010704, 10107, '护理资源调配平台', 3, 4);
INSERT INTO `industry_categories` VALUES (1010705, 10107, '智能硬件+护理服务', 3, 5);
INSERT INTO `industry_categories` VALUES (1010706, 10107, '综合家庭护理', 3, 6);
INSERT INTO `industry_categories` VALUES (10108, 101, '智慧区域卫生', 2, 8);
INSERT INTO `industry_categories` VALUES (1010801, 10108, '区域医疗数据信息中心', 3, 1);
INSERT INTO `industry_categories` VALUES (1010802, 10108, '医疗大数据共享与交换平台', 3, 2);
INSERT INTO `industry_categories` VALUES (1010803, 10108, '医疗线上平台应用系统', 3, 3);
INSERT INTO `industry_categories` VALUES (1010804, 10108, '综合卫生监管平台', 3, 4);

INSERT INTO `industry_categories` VALUES (102, 1, '互联网+健康', 1, 2);
INSERT INTO `industry_categories` VALUES (10201, 102, '互联网医院', 2, 1);
INSERT INTO `industry_categories` VALUES (1020101, 10201, '信息化服务商', 3, 1);
INSERT INTO `industry_categories` VALUES (1020102, 10201, '处方流转平台', 3, 2);
INSERT INTO `industry_categories` VALUES (1020103, 10201, '患者管理平台', 3, 3);
INSERT INTO `industry_categories` VALUES (1020104, 10201, '药品流通商', 3, 4);
INSERT INTO `industry_categories` VALUES (10202, 102, '互联网保险', 2, 2);
INSERT INTO `industry_categories` VALUES (1020201, 10202, 'IOT', 3, 1);
INSERT INTO `industry_categories` VALUES (1020202, 10202, '企业团险', 3, 2);
INSERT INTO `industry_categories` VALUES (1020203, 10202, '保单和理赔服务', 3, 3);
INSERT INTO `industry_categories` VALUES (1020204, 10202, '健康险企', 3, 4);
INSERT INTO `industry_categories` VALUES (1020205, 10202, '比价/线上销售平台', 3, 5);
INSERT INTO `industry_categories` VALUES (1020206, 10202, '网络互助保险平台', 3, 6);
INSERT INTO `industry_categories` VALUES (10203, 102, '公共卫生服务', 2, 3);
INSERT INTO `industry_categories` VALUES (1020301, 10203, '公卫服务相关智能设备', 3, 1);
INSERT INTO `industry_categories` VALUES (1020302, 10203, '大数据与公卫服务', 3, 2);
INSERT INTO `industry_categories` VALUES (1020303, 10203, '疾病知识科普', 3, 3);
INSERT INTO `industry_categories` VALUES (10204, 102, '检验检测', 2, 4);
INSERT INTO `industry_categories` VALUES (1020401, 10204, '互联网公司', 3, 1);
INSERT INTO `industry_categories` VALUES (1020402, 10204, '医院内检验机构', 3, 2);
INSERT INTO `industry_categories` VALUES (1020403, 10204, '第三方检验中心', 3, 3);
INSERT INTO `industry_categories` VALUES (10205, 102, '医药电商', 2, 5);
INSERT INTO `industry_categories` VALUES (1020501, 10205, 'B2B', 3, 1);
INSERT INTO `industry_categories` VALUES (1020502, 10205, 'B2C', 3, 2);
INSERT INTO `industry_categories` VALUES (1020503, 10205, 'O2O', 3, 3);
INSERT INTO `industry_categories` VALUES (10206, 102, '患者教育', 2, 6);
INSERT INTO `industry_categories` VALUES (1020601, 10206, '其他疾病患教', 3, 1);
INSERT INTO `industry_categories` VALUES (1020602, 10206, '图文在线健康科普', 3, 2);
INSERT INTO `industry_categories` VALUES (1020603, 10206, '患者社区', 3, 3);
INSERT INTO `industry_categories` VALUES (1020604, 10206, '用药指导', 3, 4);
INSERT INTO `industry_categories` VALUES (1020605, 10206, '糖尿病患教', 3, 5);
INSERT INTO `industry_categories` VALUES (1020606, 10206, '肿瘤患教', 3, 6);
INSERT INTO `industry_categories` VALUES (1020607, 10206, '视/音频健康科普', 3, 7);
INSERT INTO `industry_categories` VALUES (10207, 102, '家庭医生', 2, 7);
INSERT INTO `industry_categories` VALUES (1020701, 10207, '医生在线预约平台', 3, 1);
INSERT INTO `industry_categories` VALUES (1020702, 10207, '家庭医生信息化厂商和签约服务平台', 3, 2);
INSERT INTO `industry_categories` VALUES (1020703, 10207, '诊所与家庭医生', 3, 3);
INSERT INTO `industry_categories` VALUES (10208, 102, '数字营销', 2, 8);
INSERT INTO `industry_categories` VALUES (1020801, 10208, '医药企业', 3, 1);
INSERT INTO `industry_categories` VALUES (1020802, 10208, '数字营销-以医生为导向', 3, 2);
INSERT INTO `industry_categories` VALUES (1020803, 10208, '数字营销-以患者和消费者为导向', 3, 3);
INSERT INTO `industry_categories` VALUES (1020804, 10208, '硬件和云服务', 3, 4);

INSERT INTO `industry_categories` VALUES (103, 1, '数字疗法', 1, 3);
INSERT INTO `industry_categories` VALUES (10301, 103, '可穿戴设备', 2, 1);
INSERT INTO `industry_categories` VALUES (1030101, 10301, '其他可穿戴设备', 3, 1);
INSERT INTO `industry_categories` VALUES (1030102, 10301, '头戴式设备', 3, 2);
INSERT INTO `industry_categories` VALUES (1030103, 10301, '智能手环', 3, 3);
INSERT INTO `industry_categories` VALUES (1030104, 10301, '智能手表', 3, 4);
INSERT INTO `industry_categories` VALUES (1030105, 10301, '智能服饰', 3, 5);
INSERT INTO `industry_categories` VALUES (1030106, 10301, '智能眼镜', 3, 6);
INSERT INTO `industry_categories` VALUES (1030107, 10301, '耳戴式设备', 3, 7);
INSERT INTO `industry_categories` VALUES (1030108, 10301, '胸贴式设备', 3, 8);
INSERT INTO `industry_categories` VALUES (1030109, 10301, '臂戴式设备', 3, 9);
INSERT INTO `industry_categories` VALUES (10302, 103, '糖尿病', 2, 2);
INSERT INTO `industry_categories` VALUES (1030201, 10302, '其他黑科技', 3, 1);
INSERT INTO `industry_categories` VALUES (1030202, 10302, '智能胰岛素泵', 3, 2);
INSERT INTO `industry_categories` VALUES (1030203, 10302, '糖尿病患者服务平台', 3, 3);
INSERT INTO `industry_categories` VALUES (1030204, 10302, '糖尿病管理App', 3, 4);
INSERT INTO `industry_categories` VALUES (1030205, 10302, '血糖监测系统', 3, 5);
INSERT INTO `industry_categories` VALUES (10303, 103, '肥胖症', 2, 3);
INSERT INTO `industry_categories` VALUES (1030301, 10303, '体重管理App及管理平台', 3, 1);
INSERT INTO `industry_categories` VALUES (1030302, 10303, '智能可穿戴设备及其他智能减肥设备', 3, 2);
INSERT INTO `industry_categories` VALUES (1030303, 10303, '肥胖症治疗器械', 3, 3);
INSERT INTO `industry_categories` VALUES (10304, 103, '哮喘/COPD', 2, 4);
INSERT INTO `industry_categories` VALUES (1030401, 10304, '呼吸监测设备', 3, 1);
INSERT INTO `industry_categories` VALUES (1030402, 10304, '哮喘/COPD吸入器传感器', 3, 2);
INSERT INTO `industry_categories` VALUES (1030403, 10304, '哮喘/COPD相关App、线上平台', 3, 3);
INSERT INTO `industry_categories` VALUES (10305, 103, '抑郁症', 2, 5);
INSERT INTO `industry_categories` VALUES (1030501, 10305, '抑郁症诊断和分析', 3, 1);
INSERT INTO `industry_categories` VALUES (1030502, 10305, '线上轻量级咨询', 3, 2);
INSERT INTO `industry_categories` VALUES (1030503, 10305, '黑科技数字疗法', 3, 3);
INSERT INTO `industry_categories` VALUES (10306, 103, '高血压', 2, 6);
INSERT INTO `industry_categories` VALUES (1030601, 10306, 'App、线上服务', 3, 1);
INSERT INTO `industry_categories` VALUES (1030602, 10306, '血压监测分析系统', 3, 2);
INSERT INTO `industry_categories` VALUES (1030603, 10306, '智能血压计', 3, 3);
INSERT INTO `industry_categories` VALUES (10307, 103, '自闭症', 2, 7);
INSERT INTO `industry_categories` VALUES (1030701, 10307, 'AI及VR/AR治疗', 3, 1);
INSERT INTO `industry_categories` VALUES (1030702, 10307, '自闭症APP管理', 3, 2);
INSERT INTO `industry_categories` VALUES (1030703, 10307, '自闭症患者社区', 3, 3);
INSERT INTO `industry_categories` VALUES (1030704, 10307, '语言/行为康复治疗', 3, 4);

-- 5.2 前沿技术 (20+)
INSERT INTO `industry_categories` VALUES (2, NULL, '前沿技术', 0, 2);
INSERT INTO `industry_categories` VALUES (201, 2, '前沿技术融合', 1, 1);
INSERT INTO `industry_categories` VALUES (20101, 201, '脑机接口(BCI)', 2, 1);
INSERT INTO `industry_categories` VALUES (2010101, 20101, '侵入式脑机接口', 3, 1);
INSERT INTO `industry_categories` VALUES (2010102, 20101, '半侵入式/介入式脑机接口', 3, 2);
INSERT INTO `industry_categories` VALUES (2010103, 20101, '非侵入式脑机接口', 3, 3);
INSERT INTO `industry_categories` VALUES (20102, 201, '人工智能', 2, 2);
INSERT INTO `industry_categories` VALUES (2010201, 20102, 'AI临床试验解决方案', 3, 1);
INSERT INTO `industry_categories` VALUES (2010202, 20102, 'AI健康管理平台', 3, 2);
INSERT INTO `industry_categories` VALUES (2010203, 20102, '医疗垂直大模型', 3, 3);
INSERT INTO `industry_categories` VALUES (2010204, 20102, '价值导向型医疗生态系统构建', 3, 4);

-- 5.3 医疗器械 (100+)
INSERT INTO `industry_categories` VALUES (3, NULL, '医疗器械', 0, 3);
INSERT INTO `industry_categories` VALUES (301, 3, '体外诊断 (IVD)', 1, 1);
INSERT INTO `industry_categories` VALUES (30101, 301, '生化', 2, 1);
INSERT INTO `industry_categories` VALUES (3010101, 30101, '生化分析仪、试剂等', 3, 1);
INSERT INTO `industry_categories` VALUES (30102, 301, '免疫', 2, 2);
INSERT INTO `industry_categories` VALUES (3010201, 30102, '免疫分析仪、试剂等', 3, 1);
INSERT INTO `industry_categories` VALUES (30103, 301, '分子', 2, 3);
INSERT INTO `industry_categories` VALUES (3010301, 30103, 'PCR仪、基因测序设备等', 3, 1);
INSERT INTO `industry_categories` VALUES (30104, 301, '微生物', 2, 4);
INSERT INTO `industry_categories` VALUES (3010401, 30104, '微生物检测系统、培养箱等', 3, 1);
INSERT INTO `industry_categories` VALUES (30105, 301, '血液、体液', 2, 5);
INSERT INTO `industry_categories` VALUES (3010501, 30105, '血球仪、尿液分析仪等', 3, 1);
INSERT INTO `industry_categories` VALUES (30106, 301, 'POCT', 2, 6);
INSERT INTO `industry_categories` VALUES (3010601, 30106, '便携式血糖仪、快速检测卡等', 3, 1);
INSERT INTO `industry_categories` VALUES (302, 3, '影像设备', 1, 2);
INSERT INTO `industry_categories` VALUES (30201, 302, 'X射线成像设备', 2, 1);
INSERT INTO `industry_categories` VALUES (3020101, 30201, 'CT、DR', 3, 1);
INSERT INTO `industry_categories` VALUES (3020102, 30201, 'DSA', 3, 2);
INSERT INTO `industry_categories` VALUES (30202, 302, '超声诊断设备', 2, 2);
INSERT INTO `industry_categories` VALUES (3020201, 30202, '超声影像诊断设备', 3, 1);
INSERT INTO `industry_categories` VALUES (3020202, 30202, '超声血管流量计', 3, 2);
INSERT INTO `industry_categories` VALUES (30203, 302, '核磁共振设备', 2, 3);
INSERT INTO `industry_categories` VALUES (3020301, 30203, 'MRI', 3, 1);
INSERT INTO `industry_categories` VALUES (30204, 302, '核医学检查设备', 2, 4);
INSERT INTO `industry_categories` VALUES (3020401, 30204, 'PET-CT', 3, 1);
INSERT INTO `industry_categories` VALUES (30205, 302, '内窥镜检查设备', 2, 5);
INSERT INTO `industry_categories` VALUES (3020501, 30205, '医用内窥镜', 3, 1);
INSERT INTO `industry_categories` VALUES (3020502, 30205, '血管内超声诊断设备', 3, 2);
INSERT INTO `industry_categories` VALUES (3020503, 30205, '电凝切割内窥镜', 3, 3);
INSERT INTO `industry_categories` VALUES (303, 3, '治疗设备', 1, 3);
INSERT INTO `industry_categories` VALUES (30301, 303, '手术机器人', 2, 1);
INSERT INTO `industry_categories` VALUES (3030101, 30301, '腔镜手术机器人', 3, 1);
INSERT INTO `industry_categories` VALUES (3030102, 30301, '骨科手术机器人', 3, 2);
INSERT INTO `industry_categories` VALUES (3030103, 30301, '泛血管介入手术机器人', 3, 3);
INSERT INTO `industry_categories` VALUES (3030104, 30301, '经自然腔道手术机器人', 3, 4);
INSERT INTO `industry_categories` VALUES (3030105, 30301, '经皮穿刺手术机器人', 3, 5);
INSERT INTO `industry_categories` VALUES (30302, 303, '能量源设备', 2, 2);
INSERT INTO `industry_categories` VALUES (3030201, 30302, '高频手术设备', 3, 1);
INSERT INTO `industry_categories` VALUES (3030202, 30302, '激光治疗设备', 3, 2);
INSERT INTO `industry_categories` VALUES (3030203, 30302, '射频治疗设备', 3, 3);
INSERT INTO `industry_categories` VALUES (3030204, 30302, '脉冲电场消融设备', 3, 4);
INSERT INTO `industry_categories` VALUES (3030205, 30302, '超声波治疗设备', 3, 5);
INSERT INTO `industry_categories` VALUES (30303, 303, '放射设备', 2, 3);
INSERT INTO `industry_categories` VALUES (3030301, 30303, '放疗设备', 3, 1);
INSERT INTO `industry_categories` VALUES (304, 3, '生命信息支持设备', 1, 4);
INSERT INTO `industry_categories` VALUES (30401, 304, '监护仪', 2, 1);
INSERT INTO `industry_categories` VALUES (3040101, 30401, '监护设备', 3, 1);
INSERT INTO `industry_categories` VALUES (30402, 304, '呼吸机', 2, 2);
INSERT INTO `industry_categories` VALUES (3040201, 30402, '呼吸机', 3, 1);
INSERT INTO `industry_categories` VALUES (30403, 304, '麻醉机', 2, 3);
INSERT INTO `industry_categories` VALUES (3040301, 30403, '麻醉机', 3, 1);
INSERT INTO `industry_categories` VALUES (30404, 304, 'ECMO', 2, 4);
INSERT INTO `industry_categories` VALUES (3040401, 30404, '体外膜肺氧合设备', 3, 1);
INSERT INTO `industry_categories` VALUES (305, 3, '康复设备', 1, 5);
INSERT INTO `industry_categories` VALUES (30501, 305, '康复机器人', 2, 1);
INSERT INTO `industry_categories` VALUES (3050101, 30501, '运动康复、视听障碍康复', 3, 1);
INSERT INTO `industry_categories` VALUES (30502, 305, '物理治疗设备', 2, 2);
INSERT INTO `industry_categories` VALUES (3050201, 30502, '声、光、电、磁疗', 3, 1);
INSERT INTO `industry_categories` VALUES (306, 3, '辅助设备', 1, 6);
INSERT INTO `industry_categories` VALUES (30601, 306, '诊断辅助软件', 2, 1);
INSERT INTO `industry_categories` VALUES (3060101, 30601, 'AI影像处理软件', 3, 1);
INSERT INTO `industry_categories` VALUES (3060102, 30601, 'AI决策支持软件', 3, 2);
INSERT INTO `industry_categories` VALUES (3060103, 30601, 'AI手术计划软件', 3, 3);
INSERT INTO `industry_categories` VALUES (3060104, 30601, '采用脑机接口技术的医疗器械', 3, 4);
INSERT INTO `industry_categories` VALUES (3060105, 30601, '应用纳米材料的医疗器械', 3, 5);
INSERT INTO `industry_categories` VALUES (3060106, 30601, '医疗器械软件（SaMD）', 3, 6);
INSERT INTO `industry_categories` VALUES (307, 3, '家用医疗设备', 1, 7);
INSERT INTO `industry_categories` VALUES (30701, 307, '呼吸治疗', 2, 1);
INSERT INTO `industry_categories` VALUES (3070101, 30701, '制氧机、呼吸机', 3, 1);
INSERT INTO `industry_categories` VALUES (30702, 307, '血糖监测', 2, 2);
INSERT INTO `industry_categories` VALUES (3070201, 30702, '血糖仪', 3, 1);
INSERT INTO `industry_categories` VALUES (30703, 307, '健康检测', 2, 3);
INSERT INTO `industry_categories` VALUES (3070301, 30703, '电子血压计', 3, 1);
INSERT INTO `industry_categories` VALUES (30704, 307, '助听设备', 2, 4);
INSERT INTO `industry_categories` VALUES (3070401, 30704, '助听器', 3, 1);
INSERT INTO `industry_categories` VALUES (308, 3, '高值医用耗材', 1, 8);
INSERT INTO `industry_categories` VALUES (30801, 308, '血管介入类', 2, 1);
INSERT INTO `industry_categories` VALUES (3080101, 30801, '冠脉介入球囊/支架', 3, 1);
INSERT INTO `industry_categories` VALUES (3080102, 30801, '外周血管介入', 3, 2);
INSERT INTO `industry_categories` VALUES (3080103, 30801, '神经血管介入', 3, 3);
INSERT INTO `industry_categories` VALUES (3080104, 30801, '肺动脉血栓取出系统', 3, 4);
INSERT INTO `industry_categories` VALUES (30802, 308, '非血管介入类', 2, 2);
INSERT INTO `industry_categories` VALUES (3080201, 30802, '内窥镜下耗材', 3, 1);
INSERT INTO `industry_categories` VALUES (3080202, 30802, '其他介入耗材', 3, 2);
INSERT INTO `industry_categories` VALUES (309, 3, '植入器械/材料', 1, 9);
INSERT INTO `industry_categories` VALUES (30901, 309, '有源植入物', 2, 1);
INSERT INTO `industry_categories` VALUES (3090101, 30901, '心脏起搏器', 3, 1);
INSERT INTO `industry_categories` VALUES (3090102, 30901, '植入式心律转复除颤器', 3, 2);
INSERT INTO `industry_categories` VALUES (3090103, 30901, '心室辅助装置', 3, 3);
INSERT INTO `industry_categories` VALUES (3090104, 30901, '脑深部电刺激器', 3, 4);
INSERT INTO `industry_categories` VALUES (3090105, 30901, '脊髓刺激器', 3, 5);
INSERT INTO `industry_categories` VALUES (3090106, 30901, '听觉植入物', 3, 6);
INSERT INTO `industry_categories` VALUES (30902, 309, '无源植入物', 2, 2);
INSERT INTO `industry_categories` VALUES (3090201, 30902, '心脏瓣膜', 3, 1);
INSERT INTO `industry_categories` VALUES (3090202, 30902, '封堵器', 3, 2);
INSERT INTO `industry_categories` VALUES (3090203, 30902, '关节植入物', 3, 3);
INSERT INTO `industry_categories` VALUES (3090204, 30902, '脊柱植入物', 3, 4);
INSERT INTO `industry_categories` VALUES (3090205, 30902, '创伤植入物', 3, 5);
INSERT INTO `industry_categories` VALUES (3090206, 30902, '运动医学植入器械', 3, 6);
INSERT INTO `industry_categories` VALUES (3090207, 30902, '整形外科植入物', 3, 7);
INSERT INTO `industry_categories` VALUES (3090208, 30902, '眼科植入物', 3, 8);
INSERT INTO `industry_categories` VALUES (3090209, 30902, '其他植入物', 3, 9);
INSERT INTO `industry_categories` VALUES (310, 3, '低值医用耗材', 1, 10);
INSERT INTO `industry_categories` VALUES (31001, 310, '注射穿刺类', 2, 1);
INSERT INTO `industry_categories` VALUES (3100101, 31001, '注射器、输液器', 3, 1);
INSERT INTO `industry_categories` VALUES (31002, 310, '医用卫生材料', 2, 2);
INSERT INTO `industry_categories` VALUES (3100201, 31002, '敷料、口罩', 3, 1);
INSERT INTO `industry_categories` VALUES (31003, 310, '医用高分子制品', 2, 3);
INSERT INTO `industry_categories` VALUES (3100301, 31003, '导管、引流袋', 3, 1);
INSERT INTO `industry_categories` VALUES (311, 3, '装备制造', 1, 11);
INSERT INTO `industry_categories` VALUES (31101, 311, '制药装备', 2, 1);
INSERT INTO `industry_categories` VALUES (3110101, 31101, '生物反应器/系统', 3, 1);
INSERT INTO `industry_categories` VALUES (3110102, 31101, '实验室自动化', 3, 2);
INSERT INTO `industry_categories` VALUES (3110103, 31101, '智慧工厂方案', 3, 3);

-- 5.4 医疗服务 (50+)
INSERT INTO `industry_categories` VALUES (4, NULL, '医疗服务', 0, 4);
INSERT INTO `industry_categories` VALUES (401, 4, '医药商业 / 流通', 1, 1);
INSERT INTO `industry_categories` VALUES (40101, 401, '医药配送企业', 2, 1);
INSERT INTO `industry_categories` VALUES (40102, 401, '医药即时零售', 2, 2);
INSERT INTO `industry_categories` VALUES (4010201, 40102, '平台型', 3, 1);
INSERT INTO `industry_categories` VALUES (4010202, 40102, '连锁药店 O2O', 3, 2);
INSERT INTO `industry_categories` VALUES (40103, 401, '药企线上渠道 / 合作', 2, 3);
INSERT INTO `industry_categories` VALUES (4010301, 40103, '新品首发 / 旗舰店 / 营销', 3, 1);
INSERT INTO `industry_categories` VALUES (40104, 401, '医药跨境供应链', 2, 4);
INSERT INTO `industry_categories` VALUES (402, 4, '医疗零售', 1, 2);
INSERT INTO `industry_categories` VALUES (40201, 402, '实体药店', 2, 1);
INSERT INTO `industry_categories` VALUES (4020101, 40201, '连锁药店', 3, 1);
INSERT INTO `industry_categories` VALUES (4020102, 40201, 'DTP 药房 / 特药房', 3, 2);
INSERT INTO `industry_categories` VALUES (40202, 402, '医药电商', 2, 2);
INSERT INTO `industry_categories` VALUES (4020201, 40202, 'B2B', 3, 1);
INSERT INTO `industry_categories` VALUES (4020202, 40202, 'B2C', 3, 2);
INSERT INTO `industry_categories` VALUES (4020203, 40202, 'O2O', 3, 3);
INSERT INTO `industry_categories` VALUES (40203, 402, '药店业务拓展', 2, 3);
INSERT INTO `industry_categories` VALUES (4020301, 40203, '医美服务', 3, 1);
INSERT INTO `industry_categories` VALUES (4020302, 40203, '中医诊所', 3, 2);
INSERT INTO `industry_categories` VALUES (403, 4, '严肃医疗', 1, 3);
INSERT INTO `industry_categories` VALUES (40301, 403, '公立三级', 2, 1);
INSERT INTO `industry_categories` VALUES (40302, 403, '公立二级', 2, 2);
INSERT INTO `industry_categories` VALUES (40303, 403, '基层公卫', 2, 3);
INSERT INTO `industry_categories` VALUES (40304, 403, '民营医院', 2, 4);
INSERT INTO `industry_categories` VALUES (4030401, 40304, '综合医院', 3, 1);
INSERT INTO `industry_categories` VALUES (4030402, 40304, '专科医院（肿瘤）', 3, 2);
INSERT INTO `industry_categories` VALUES (4030403, 40304, '专科医院（辅助生殖）', 3, 3);
INSERT INTO `industry_categories` VALUES (404, 4, '消费医疗', 1, 4);
INSERT INTO `industry_categories` VALUES (40401, 404, '口腔诊所 / 连锁', 2, 1);
INSERT INTO `industry_categories` VALUES (40402, 404, '体检中心 / 健康管理', 2, 2);
INSERT INTO `industry_categories` VALUES (40403, 404, '眼科诊所 / 连锁', 2, 3);
INSERT INTO `industry_categories` VALUES (4040301, 40403, '综合眼科集团', 3, 1);
INSERT INTO `industry_categories` VALUES (4040302, 40403, '垂直眼视光 / 少儿眼科', 3, 2);
INSERT INTO `industry_categories` VALUES (40404, 404, '产后中心 / 母婴护理', 2, 4);
INSERT INTO `industry_categories` VALUES (40405, 404, '生殖中心 / 门诊', 2, 5);
INSERT INTO `industry_categories` VALUES (40406, 404, '中医诊所 / 连锁', 2, 6);
INSERT INTO `industry_categories` VALUES (40407, 404, '医美诊所 / 服务', 2, 7);
INSERT INTO `industry_categories` VALUES (40408, 404, '专科诊所 / 连锁（其他）', 2, 8);
INSERT INTO `industry_categories` VALUES (4040801, 40408, '骨科与肌肉健康（数字疗法）', 3, 1);
INSERT INTO `industry_categories` VALUES (405, 4, '互联网医疗', 1, 5);
INSERT INTO `industry_categories` VALUES (40501, 405, '综合平台 / 在线诊疗', 2, 1);
INSERT INTO `industry_categories` VALUES (4050101, 40501, '互联网医院', 3, 1);
INSERT INTO `industry_categories` VALUES (4050102, 40501, 'AI 医疗应用', 3, 2);
INSERT INTO `industry_categories` VALUES (40502, 405, '垂直服务平台', 2, 2);
INSERT INTO `industry_categories` VALUES (4050201, 40502, '互联网 + 护理服务', 3, 1);
INSERT INTO `industry_categories` VALUES (4050202, 40502, '数字慢病 / 专病管理', 3, 2);
INSERT INTO `industry_categories` VALUES (406, 4, '第三方中心', 1, 6);
INSERT INTO `industry_categories` VALUES (40601, 406, '检验中心', 2, 1);
INSERT INTO `industry_categories` VALUES (40602, 406, '影像中心', 2, 2);
INSERT INTO `industry_categories` VALUES (40603, 406, '病理中心', 2, 3);
INSERT INTO `industry_categories` VALUES (40604, 406, '消毒中心', 2, 4);
INSERT INTO `industry_categories` VALUES (4060401, 40604, '第三方消毒供应', 3, 1);
INSERT INTO `industry_categories` VALUES (40605, 406, '血透中心', 2, 5);
INSERT INTO `industry_categories` VALUES (40606, 406, '其他第三方服务', 2, 6);
INSERT INTO `industry_categories` VALUES (4060601, 40606, '居家护理 / 上门检测', 3, 1);
INSERT INTO `industry_categories` VALUES (407, 4, '保险支付', 1, 7);
INSERT INTO `industry_categories` VALUES (40701, 407, '商业保险', 2, 1);
INSERT INTO `industry_categories` VALUES (4070101, 40701, '健康险产品 / 公司', 3, 1);
INSERT INTO `industry_categories` VALUES (40702, 407, 'TPA / 保险科技', 2, 2);
INSERT INTO `industry_categories` VALUES (4070201, 40702, '保险科技平台 / 服务', 3, 1);

-- 5.5 药品 (40+)
INSERT INTO `industry_categories` VALUES (5, NULL, '药品', 0, 5);
INSERT INTO `industry_categories` VALUES (501, 5, '化学制药', 1, 1);
INSERT INTO `industry_categories` VALUES (50101, 501, '化学制剂', 2, 1);
INSERT INTO `industry_categories` VALUES (5010101, 50101, '创新小分子药', 3, 1);
INSERT INTO `industry_categories` VALUES (5010102, 50101, '改良型新药', 3, 2);
INSERT INTO `industry_categories` VALUES (5010103, 50101, '仿制药', 3, 3);
INSERT INTO `industry_categories` VALUES (5010104, 50101, '减重领域小分子药', 3, 4);
INSERT INTO `industry_categories` VALUES (5010105, 50101, '肿瘤靶向小分子药', 3, 5);
INSERT INTO `industry_categories` VALUES (5010106, 50101, '自免领域小分子药', 3, 6);
INSERT INTO `industry_categories` VALUES (50102, 501, '原料药', 2, 2);
INSERT INTO `industry_categories` VALUES (5010201, 50102, '高端原料药', 3, 1);
INSERT INTO `industry_categories` VALUES (5010202, 50102, '特色原料药', 3, 2);
INSERT INTO `industry_categories` VALUES (5010203, 50102, '大宗原料药', 3, 3);
INSERT INTO `industry_categories` VALUES (5010204, 50102, '多肽原料药', 3, 4);
INSERT INTO `industry_categories` VALUES (502, 5, '生物制品', 1, 2);
INSERT INTO `industry_categories` VALUES (50201, 502, '血液制品', 2, 1);
INSERT INTO `industry_categories` VALUES (5020101, 50201, '人血白蛋白', 3, 1);
INSERT INTO `industry_categories` VALUES (5020102, 50201, '免疫球蛋白', 3, 2);
INSERT INTO `industry_categories` VALUES (5020103, 50201, '凝血因子', 3, 3);
INSERT INTO `industry_categories` VALUES (50202, 502, '疫苗', 2, 2);
INSERT INTO `industry_categories` VALUES (5020201, 50202, '预防性疫苗（HPV、PCV13）', 3, 1);
INSERT INTO `industry_categories` VALUES (5020202, 50202, '治疗性疫苗', 3, 2);
INSERT INTO `industry_categories` VALUES (5020203, 50202, 'mRNA 疫苗', 3, 3);
INSERT INTO `industry_categories` VALUES (5020204, 50202, '乙肝治疗性疫苗', 3, 4);
INSERT INTO `industry_categories` VALUES (50203, 502, '抗体药物', 2, 3);
INSERT INTO `industry_categories` VALUES (5020301, 50203, '双特异性抗体', 3, 1);
INSERT INTO `industry_categories` VALUES (5020302, 50203, 'ADC（抗体偶联药物）', 3, 2);
INSERT INTO `industry_categories` VALUES (5020303, 50203, '双抗 ADC', 3, 3);
INSERT INTO `industry_categories` VALUES (5020304, 50203, '双载荷 ADC', 3, 4);
INSERT INTO `industry_categories` VALUES (5020305, 50203, '单克隆抗体', 3, 5);
INSERT INTO `industry_categories` VALUES (5020306, 50203, '髓系细胞衔接器（MCE）', 3, 6);
INSERT INTO `industry_categories` VALUES (50204, 502, '蛋白药物', 2, 4);
INSERT INTO `industry_categories` VALUES (5020401, 50204, '重组蛋白药物', 3, 1);
INSERT INTO `industry_categories` VALUES (5020402, 50204, '酶替代疗法', 3, 2);
INSERT INTO `industry_categories` VALUES (5020403, 50204, '细胞因子', 3, 3);
INSERT INTO `industry_categories` VALUES (50205, 502, '基因治疗', 2, 5);
INSERT INTO `industry_categories` VALUES (5020501, 50205, 'CAR-T（自体 / 通用型 / 体内 CAR-T）', 3, 1);
INSERT INTO `industry_categories` VALUES (5020502, 50205, 'TIL 疗法', 3, 2);
INSERT INTO `industry_categories` VALUES (5020503, 50205, '核酸药物（siRNA、mRNA 等）', 3, 3);
INSERT INTO `industry_categories` VALUES (5020504, 50205, '基因编辑疗法', 3, 4);
INSERT INTO `industry_categories` VALUES (5020505, 50205, '现货型细胞疗法', 3, 5);
INSERT INTO `industry_categories` VALUES (503, 5, '中药', 1, 3);
INSERT INTO `industry_categories` VALUES (50301, 503, '中药饮片', 2, 1);
INSERT INTO `industry_categories` VALUES (5030101, 50301, '传统饮片', 3, 1);
INSERT INTO `industry_categories` VALUES (5030102, 50301, '配方颗粒', 3, 2);
INSERT INTO `industry_categories` VALUES (5030103, 50301, '破壁饮片', 3, 3);
INSERT INTO `industry_categories` VALUES (50302, 503, '中成药', 2, 2);
INSERT INTO `industry_categories` VALUES (5030201, 50302, '心脑血管类', 3, 1);
INSERT INTO `industry_categories` VALUES (5030202, 50302, '呼吸系统类', 3, 2);
INSERT INTO `industry_categories` VALUES (5030203, 50302, '抗肿瘤辅助类', 3, 3);

-- 5.6 AI 药物研发 (30+)
INSERT INTO `industry_categories` VALUES (6, NULL, 'AI 药物研发', 0, 6);
INSERT INTO `industry_categories` VALUES (601, 6, 'AI 药物研发平台', 1, 1);
INSERT INTO `industry_categories` VALUES (60101, 601, '小分子 / AI 药物研发平台等', 2, 1);
INSERT INTO `industry_categories` VALUES (6010101, 60101, '小分子 / AI 药物研发平台', 3, 1);
INSERT INTO `industry_categories` VALUES (6010102, 60101, 'DNA 编码化合物库技术', 3, 2);
INSERT INTO `industry_categories` VALUES (6010103, 60101, '一站式 AI 赋能新药研发平台', 3, 3);
INSERT INTO `industry_categories` VALUES (6010104, 60101, '计算设计平台', 3, 4);
INSERT INTO `industry_categories` VALUES (6010105, 60101, 'AI + 疫苗研发平台', 3, 5);
INSERT INTO `industry_categories` VALUES (602, 6, 'AI CRO / 技术服务商', 1, 2);
INSERT INTO `industry_categories` VALUES (60201, 602, 'AI 驱动的口服小分子药物等', 2, 1);
INSERT INTO `industry_categories` VALUES (6020101, 60201, 'AI 驱动的口服小分子药物', 3, 1);
INSERT INTO `industry_categories` VALUES (6020102, 60201, '代谢增强型细胞疗法', 3, 2);
INSERT INTO `industry_categories` VALUES (6020103, 60201, 'AI 驱动的大分子药物', 3, 3);
INSERT INTO `industry_categories` VALUES (6020104, 60201, 'AI 设计的减重 / 代谢类药物', 3, 4);
INSERT INTO `industry_categories` VALUES (6020105, 60201, 'AI 辅助临床试验设计', 3, 5);
INSERT INTO `industry_categories` VALUES (6020106, 60201, '数字化 CRO 服务', 3, 6);
INSERT INTO `industry_categories` VALUES (603, 6, 'AI 自研管线企业', 1, 3);
INSERT INTO `industry_categories` VALUES (60301, 603, 'AI 药物研发 SaaS 平台等', 2, 1);
INSERT INTO `industry_categories` VALUES (6030101, 60301, 'AI 药物研发 SaaS 平台', 3, 1);
INSERT INTO `industry_categories` VALUES (6030102, 60301, 'AI 智能体', 3, 2);
INSERT INTO `industry_categories` VALUES (6030103, 60301, 'AI 蛋白质设计平台', 3, 3);
INSERT INTO `industry_categories` VALUES (6030104, 60301, 'AI 设计的抗肿瘤药物', 3, 4);
INSERT INTO `industry_categories` VALUES (6030105, 60301, 'AI 优化的代谢类药物', 3, 5);
INSERT INTO `industry_categories` VALUES (6030106, 60301, 'AI 驱动的神经免疫疗法', 3, 6);
INSERT INTO `industry_categories` VALUES (604, 6, 'AI 软件 / 工具平台', 1, 4);
INSERT INTO `industry_categories` VALUES (60401, 604, 'AI + 神经免疫疗法等', 2, 1);
INSERT INTO `industry_categories` VALUES (6040101, 60401, 'AI + 神经免疫疗法', 3, 1);
INSERT INTO `industry_categories` VALUES (6040102, 60401, 'AI + 疫苗研发', 3, 2);
INSERT INTO `industry_categories` VALUES (6040103, 60401, 'AI + 多肽药物发现平台', 3, 3);
INSERT INTO `industry_categories` VALUES (6040104, 60401, 'AI + 新型 ADC 化合物库开发', 3, 4);
INSERT INTO `industry_categories` VALUES (6040105, 60401, 'AI 药物发现平台', 3, 5);
INSERT INTO `industry_categories` VALUES (6040106, 60401, 'AI 蛋白质设计平台', 3, 6);
INSERT INTO `industry_categories` VALUES (6040107, 60401, 'AI 临床试验优化平台', 3, 7);
INSERT INTO `industry_categories` VALUES (6040108, 60401, 'AI 智能体平台', 3, 8);
INSERT INTO `industry_categories` VALUES (605, 6, 'AI + 特定领域研发', 1, 5);
INSERT INTO `industry_categories` VALUES (60501, 605, '小分子及抗体类新药研发平台授权等', 2, 1);
INSERT INTO `industry_categories` VALUES (6050101, 60501, '小分子及抗体类新药研发平台授权', 3, 1);
INSERT INTO `industry_categories` VALUES (6050102, 60501, 'AI 驱动的药物选择平台授权', 3, 2);
INSERT INTO `industry_categories` VALUES (6050103, 60501, 'AI 平台用于大分子药物研发', 3, 3);

-- ==============================================================
-- 6. 全量标签数据录入 (8大维度逻辑统一)
-- ==============================================================

-- 6.1 维度总表 (Metadata Linking)
INSERT INTO `tag_dimensions` (`id`, `name`, `source_table`, `sort_order`) VALUES
(1, '基本信息', NULL, 1),
(2, '经营状况', NULL, 2),
(3, '知识产权', NULL, 3),
(4, '风险信息', NULL, 4),
(5, '街道地区', 'sys_region', 5),
(6, '行业分类', 'industry_categories', 6),
(7, '应用场景', NULL, 7),
(8, '产业链环节', NULL, 8);

-- 6.2 子维度分表录入
INSERT INTO `tag_sub_dimensions` (`id`, `dimension_id`, `name`, `sort_order`) VALUES
(101, 1, '成立年限', 1), (102, 1, '注册资本', 2), (103, 1, '实缴资本', 3), (104, 1, '经营状态', 4), (105, 1, '企业类型', 5), (106, 1, '组织类型', 6), (107, 1, '企业规模', 7), (108, 1, '分支机构', 8), (109, 1, '地址信息', 9), (110, 1, '投融资轮次', 10),
(201, 2, '员工人数', 1), (202, 2, '参保人数', 2), (203, 2, '上市状态', 3), (204, 2, '规上企业', 4), (205, 2, '联系方式', 5), (206, 2, '空号过滤', 6), (207, 2, '联系邮箱', 7), (208, 2, '小微企业', 8), (209, 2, '变更信息', 9), (210, 2, '一般纳税人', 10), (211, 2, '融资信息', 11), (212, 2, '招投标', 12), (213, 2, '招聘', 13), (214, 2, '税务评级', 14), (215, 2, '进出口信息', 15), (216, 2, '开户行', 16),
(301, 3, '专利类型', 1), (302, 3, '企业科技属性', 2), (303, 3, '资质证书', 3), (304, 3, '商标信息', 4), (305, 3, '专利信息', 5), (306, 3, '作品著作权', 6), (307, 3, '软件著作权', 7), (308, 3, '高新技术企业', 8), (309, 3, '微信公众号', 9), (310, 3, '标准制定', 10), (311, 3, '集成电路布图', 11), (312, 3, '建筑资质', 12), (313, 3, '网址信息', 13), (314, 3, '备案网站检测', 14), (315, 3, '商业特许经营', 15),
(401, 4, '失信被执行', 1), (402, 4, '动产抵押', 2), (403, 4, '经营异常', 3), (404, 4, '法律文书', 4), (405, 4, '行政处罚', 5), (406, 4, '破产重叠', 6), (407, 4, '清算信息', 7), (408, 4, '环保处罚', 8), (409, 4, '股权冻结', 9), (410, 4, '被执行人', 10), (411, 4, '限制高消费', 11),
(501, 7, '应用领域', 1),
(601, 8, '环节位置', 1);

-- 6.3 标签库 (补全 38 个应用场景 & 26 个科技属性)

-- 应用场景 (全量 38个)
INSERT INTO `tag_library` (`sub_dimension_id`, `tag_name`, `sort_order`) VALUES
(501, '健康管理', 1), (501, '患者社区', 2), (501, '健康和疾病咨询', 3), (501, '就诊挂号', 4), (501, '就诊服务', 5), (501, '转诊服务', 6), (501, '诊后服务', 7), (501, '疾病诊断', 8), (501, '疾病治疗', 9), (501, '康复治疗', 10), (501, '疾病预防', 11), (501, '中医科', 12), (501, '口腔科', 13), (501, '眼科', 14), (501, '疼痛科', 15), (501, '辅助科室', 16), (501, '精神科', 17), (501, '行政管理', 18), (501, '后勤支持', 19), (501, '肿瘤', 20), (501, '心血管疾病', 21), (501, '感染性疾病', 22), (501, '内分泌系统疾病', 23), (501, '代谢性疾病', 24), (501, '精神类疾病', 25), (501, '神经系统疾病', 26), (501, '呼吸系统疾病', 27), (501, '血液系统疾病', 28), (501, '消化系统疾病', 29), (501, '眼部疾病', 30), (501, '皮肤疾病', 31), (501, '生殖系统疾病', 32), (501, '罕见病', 33), (501, '泌尿系统疾病', 34), (501, '慢性病', 35), (501, '脑部疾病', 36), (501, '运动系统疾病', 37), (501, '骨科', 38);

-- 企业科技属性 (全量 26个)
INSERT INTO `tag_library` (`sub_dimension_id`, `tag_name`, `sort_order`) VALUES
(302, '高新企业', 1), (302, '科技型中小企业', 2), (302, '瞪羚企业', 3), (302, '国家级技术创新示范企业', 4), (302, '省级技术创新示范企业', 5), (302, '国家级企业技术中心', 6), (302, '省级企业技术中心', 7), (302, '国家备案众创空间', 8), (302, '国家级科技企业孵化器', 9), (302, '省级科技企业孵化器', 10), (302, '国家火炬计划项目', 11), (302, '技术先进型服务企业', 12), (302, '民营科技企业', 13), (302, '专精特新企业', 14), (302, '科技小巨人企业', 15), (302, '专精特新小巨人', 16), (302, '创新型企业', 17), (302, '创新型试点企业', 18), (302, '创新型领军企业', 19), (302, '雏鹰企业', 20), (302, '隐形冠军', 21), (302, '牛羚企业', 22), (302, '独角兽企业', 23), (302, '未来独角兽企业', 24), (302, '潜在独角兽企业', 25), (302, '种子独角兽企业', 26);

-- 风险信息全量标签
INSERT INTO `tag_library` (`sub_dimension_id`, `tag_name`) VALUES
(401, '有失信被执行'), (401, '无失信被执行'),
(402, '有动产抵押'), (402, '无动产抵押'),
(403, '有经营异常'), (403, '无经营异常'),
(404, '有法律文书'), (404, '无法律文书'),
(405, '有行政处罚'), (405, '无行政处罚'),
(406, '有破产重叠'), (406, '无破产重叠'),
(407, '有清算信息'), (407, '无清算信息'),
(408, '有环保处罚'), (408, '无环保处罚'),
(409, '有股权冻结'), (409, '无股权冻结'),
(410, '有被执行人'), (410, '无被执行人'),
(411, '有限制高消费'), (411, '无限制高消费');

-- 基本信息标签 (全量映射)
INSERT INTO `tag_library` (`sub_dimension_id`, `tag_name`) VALUES
(101, '1年内'), (101, '1-5年'), (101, '5-10年'), (101, '10-15年'), (101, '15年以上'),
(102, '0万-100万'), (102, '100万-200万'), (102, '200万-500万'), (102, '500万-1000万'), (102, '1000万以上'),
(103, '有实缴资本'), (103, '无实缴资本'), (103, '0万-100万'), (103, '100万-200万'), (103, '200万-500万'), (103, '500万-1000万'), (103, '1000万-5000万'), (103, '5000万以上'),
(104, '存续'), (104, '在营'), (104, '开业'),
(105, '国有企业'), (105, '集体所有制企业'), (105, '股份合作企业'), (105, '联营企业'), (105, '有限责任公司'), (105, '股份有限公司'), (105, '私营企业'), (105, '民营企业'), (105, '个体工商户'), (105, '外商投资'),
(106, '新三板'), (106, '上市公司'), (106, '社会组织'), (106, '机关单位'), (106, '事业单位'), (106, '学校'),
(107, '大型'), (107, '中型'), (107, '小型'), (107, '微型'),
(108, '是分支机构'), (108, '非分支机构'),
(109, '有企业地址'), (109, '无企业地址'),
(110, '种子轮'), (110, '天使轮'), (110, 'A轮'), (110, 'B轮'), (110, 'C轮'), (110, 'D轮及以上'), (110, '新三板'), (110, '上市');

-- 经营状况标签 (全量映射)
INSERT INTO `tag_library` (`sub_dimension_id`, `tag_name`) VALUES
(201, '小于50人'), (201, '50-99人'), (201, '100-499人'), (201, '500人以上'), (201, '未披露'),
(202, '小于50人'), (202, '50-99人'), (202, '100-499人'), (202, '500人以上'),
(203, 'A股'), (203, '中概股'), (203, '港股'), (203, '科创板'), (203, '新三板'), (203, '未上市'),
(204, '有资质的建筑业'), (204, '规模以上服务业'), (204, '规模以上工业'), (204, '限额以上批发和零售业'),
(205, '有联系电话'), (205, '有固定电话'), (205, '有手机号'),
(206, '正常号码'), (206, '不可用或无号码'), (206, '同电话'),
(207, '有联系邮箱'), (207, '无联系邮箱'),
(208, '是小微企业'), (208, '非小微企业'),
(209, '有变更信息'), (209, '无变更信息'),
(210, '一般纳税人'), (210, '非一般纳税人'),
(211, '有融资'), (211, '无融资'),
(212, '有招投标'), (212, '无招投标'),
(213, '有招聘'), (213, '无招聘'),
(214, 'A级'),
(215, '有进出口信息'), (215, '无进出口信息');

-- 产业链环节标签
INSERT INTO `tag_library` (`sub_dimension_id`, `tag_name`) VALUES
(601, '上游'), (601, '中游'), (601, '下游');

-- ----------------------------
-- 7. 街道、字典、映射数据
-- ----------------------------
INSERT INTO `sys_region` (`name`, `type`, `sort_order`) VALUES
('朝外街道', 'STREET', 1), ('劲松街道', 'STREET', 2), ('建外街道', 'STREET', 3), ('呼家楼街道', 'STREET', 4), ('八里庄街道', 'STREET', 5), ('三里屯街道', 'STREET', 6), ('团结湖街道', 'STREET', 7), ('双井街道', 'STREET', 8), ('垡头街道', 'STREET', 9), ('左家庄街道', 'STREET', 10), ('小关街道', 'STREET', 11), ('和平街街道', 'STREET', 12), ('酒仙桥街道', 'STREET', 13), ('首都机场街道', 'STREET', 14), ('潘家园街道', 'STREET', 15), ('六里屯街道', 'STREET', 16), ('麦子店街道', 'STREET', 17), ('香河园街道', 'STREET', 18), ('亚运村街道', 'STREET', 19), ('望京街道', 'STREET', 20), ('安贞街道', 'STREET', 21), ('大屯街道', 'STREET', 22), ('奥运村街道', 'STREET', 23), ('东湖街道', 'STREET', 24),
('南磨房地区', 'AREA', 50), ('高碑店地区', 'AREA', 51), ('将台地区', 'AREA', 52), ('太阳宫地区', 'AREA', 53), ('小红门地区', 'AREA', 54), ('十八里店地区', 'AREA', 55), ('三间房地区', 'AREA', 56), ('东风地区', 'AREA', 57), ('常营地区', 'AREA', 58), ('管庄地区', 'AREA', 59), ('孙河地区', 'AREA', 60), ('王四营地区', 'AREA', 61), ('东坝地区', 'AREA', 62), ('黑庄户地区', 'AREA', 63), ('崔各庄地区', 'AREA', 64), ('豆各庄地区', 'AREA', 65), ('金盏地区', 'AREA', 66), ('平房地区', 'AREA', 67), ('来广营地区', 'AREA', 68);

INSERT INTO `sys_dictionary` (`group_code`, `name`, `value`, `sort_order`) VALUES
('EST_AGE', '1年内', '1', 1), ('EST_AGE', '1-5年', '5', 2), ('EST_AGE', '5-10年', '10', 3), ('EST_AGE', '10-15年', '15', 4), ('EST_AGE', '15年以上', '99', 5),
('REG_CAPITAL', '0-100万', '100', 1), ('REG_CAPITAL', '100-200万', '200', 2), ('REG_CAPITAL', '200-500万', '500', 3), ('REG_CAPITAL', '500-1000万', '1000', 4), ('REG_CAPITAL', '1000万以上', '9999', 5),
('ENT_SCALE', '大型', 'LARGE', 1), ('ENT_SCALE', '中型', 'MEDIUM', 2), ('ENT_SCALE', '小型', 'SMALL', 3), ('ENT_SCALE', '微型', 'MICRO', 4);

-- 产业链阶段映射
INSERT INTO `tags_chain_stage_map` (`level1`, `chain_stage`) VALUES
('智慧医疗', '中游'), ('互联网+健康', '下游'), ('数字疗法', '下游'), ('前沿技术融合', '上游'), ('体外诊断 (IVD)', '中游'), ('影像设备', '中游'), ('治疗设备', '中游'), ('生命信息支持设备', '中游'), ('康复设备', '中游'), ('辅助设备', '中游'), ('家用医疗设备', '下游'), ('高值医用耗材', '中游'), ('植入器械/材料', '中游'), ('低值医用耗材', '中游'), ('装备制造', '上游'), ('医药商业 / 流通', '下游'), ('医疗零售', '下游'), ('严肃医疗', '下游'), ('消费医疗', '下游'), ('互联网医疗', '下游'), ('第三方中心', '下游'), ('保险支付', '下游'), ('化学制药', '中游'), ('生物制品', '中游'), ('中药', '中游'), ('AI 药物研发平台', '上游'), ('AI CRO / 技术服务商', '上游'), ('AI 自研管线企业', '中游'), ('AI 软件 / 工具平台', '上游'), ('AI + 特定领域研发', '上游');

SET FOREIGN_KEY_CHECKS = 1;

-- ----------------------------
-- 8. 导入数据
-- ----------------------------
USE industrial_chain;
 SHOW VARIABLES LIKE 'local_infile';
SET GLOBAL local_infile = 1;

LOAD DATA LOCAL INFILE '../example/data_example100.csv'
INTO TABLE companies
CHARACTER SET utf8mb4
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\r\n'
IGNORE 1 LINES; 