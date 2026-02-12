/*
 Navicat MySQL Data Transfer
 Target Server Type    : MySQL
 Target Server Version : 8.0
 File Encoding         : 65001
 
 Date: 2026-02-12
 Desc: 区域产业链洞察平台 - 企业经营状况扩展表 (enterprise_business_data)
 Source: 数据原型 V1.mm -> 企业数据原型 -> 经营状况
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- =========================================================
-- 0. 指定数据库
-- =========================================================
USE `industrial_chain`;

-- =========================================================
-- 1. 经营状况扩展表 (enterprise_business_data)
-- =========================================================
DROP TABLE IF EXISTS `enterprise_business_data`;
CREATE TABLE `enterprise_business_data` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `enterprise_id` bigint NOT NULL COMMENT '关联企业ID',
  
  -- [员工人数（爬）] (区间标签，如：'50-99 人')
  `staff_size_range` varchar(50) DEFAULT NULL COMMENT '员工人数区间',
  
  -- [参保人数] (区间标签)
  `insured_size_range` varchar(50) DEFAULT NULL COMMENT '参保人数区间',
  
  -- [上市状态（爬）] (如：'A 股', '科创板')
  `listing_status` varchar(50) DEFAULT NULL COMMENT '上市状态',
  
  -- [规上企业] (如：'规模以上工业', '有资质的建筑业')
  `above_scale_type` varchar(50) DEFAULT NULL COMMENT '规上企业类型',
  
  -- [联系方式] (如：'有联系电话')
  `contact_type` varchar(50) DEFAULT NULL COMMENT '联系方式概况',
  
  -- [空号过滤] (如：'正常号码', '同电话')
  `number_status` varchar(50) DEFAULT NULL COMMENT '号码状态',
  
  -- [联系邮箱] (如：'有联系邮箱')
  `email_status` varchar(50) DEFAULT NULL COMMENT '邮箱状态',
  
  -- [小微企业（爬）] (如：'是小微企业')
  `is_small_micro` varchar(50) DEFAULT NULL COMMENT '小微企业标识',
  
  -- [变更信息] (如：'有变更信息')
  `has_change_info` varchar(50) DEFAULT NULL COMMENT '变更信息状态',
  
  -- [一般纳税人（爬）] (如：'一般纳税人')
  `tax_payer_status` varchar(50) DEFAULT NULL COMMENT '纳税人资质',
  
  -- [融资信息（爬）] (如：'有融资')
  `has_financing` varchar(50) DEFAULT NULL COMMENT '融资状态',
  
  -- [招投标] (如：'有招投标')
  `has_bidding` varchar(50) DEFAULT NULL COMMENT '招投标状态',
  
  -- [招聘] (如：'有招聘')
  `has_recruitment` varchar(50) DEFAULT NULL COMMENT '招聘状态',
  
  -- [税务评级] (如：'A 级')
  `tax_rating` varchar(50) DEFAULT NULL COMMENT '税务评级',
  
  -- [进出口信息] (如：'有进出口信息')
  `import_export_status` varchar(50) DEFAULT NULL COMMENT '进出口状态',
  
  -- [开户行] (如：'国有大型企业')
  `bank_type` varchar(50) DEFAULT NULL COMMENT '开户行类型',
  
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_ent_id` (`enterprise_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='企业经营状况数据表';


-- =========================================================
-- 2. 插入相关字典数据 (sys_dictionary)
-- =========================================================

-- 确保字典表存在
CREATE TABLE IF NOT EXISTS `sys_dictionary` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `group_code` varchar(50) NOT NULL,
  `group_name` varchar(50) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `sort_order` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_group` (`group_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

BEGIN;

-- [员工人数区间]
INSERT INTO `sys_dictionary` (`group_code`, `group_name`, `name`, `sort_order`) VALUES 
('STAFF_RANGE', '员工人数', '小于 50 人', 1),
('STAFF_RANGE', '员工人数', '50-99 人', 2),
('STAFF_RANGE', '员工人数', '100-499 人', 3),
('STAFF_RANGE', '员工人数', '500 人以上', 4),
('STAFF_RANGE', '员工人数', '未披露', 5),
('STAFF_RANGE', '员工人数', '自定义', 6);

-- [参保人数区间]
INSERT INTO `sys_dictionary` (`group_code`, `group_name`, `name`, `sort_order`) VALUES 
('INSURED_RANGE', '参保人数', '小于 50 人', 1),
('INSURED_RANGE', '参保人数', '50-99 人', 2),
('INSURED_RANGE', '参保人数', '100-499 人', 3),
('INSURED_RANGE', '参保人数', '500 人以上', 4),
('INSURED_RANGE', '参保人数', '自定义', 5);

-- [上市状态]
INSERT INTO `sys_dictionary` (`group_code`, `group_name`, `name`, `sort_order`) VALUES 
('LISTING_STATUS', '上市状态', 'A 股', 1),
('LISTING_STATUS', '上市状态', '中概股', 2),
('LISTING_STATUS', '上市状态', '港股', 3),
('LISTING_STATUS', '上市状态', '科创板', 4),
('LISTING_STATUS', '上市状态', '新三板', 5);

-- [规上企业]
INSERT INTO `sys_dictionary` (`group_code`, `group_name`, `name`, `sort_order`) VALUES 
('ABOVE_SCALE', '规上企业', '有资质的建筑业', 1),
('ABOVE_SCALE', '规上企业', '规模以上服务业', 2),
('ABOVE_SCALE', '规上企业', '规模以上工业', 3),
('ABOVE_SCALE', '规上企业', '限额以上批发和零售业', 4),
('ABOVE_SCALE', '规上企业', '房地产开发经营业', 5),
('ABOVE_SCALE', '规上企业', '限额以上住宿和餐饮业', 6);

-- [联系方式]
INSERT INTO `sys_dictionary` (`group_code`, `group_name`, `name`, `sort_order`) VALUES 
('CONTACT_TYPE', '联系方式', '不限', 1),
('CONTACT_TYPE', '联系方式', '有联系电话', 2),
('CONTACT_TYPE', '联系方式', '有固定电话', 3),
('CONTACT_TYPE', '联系方式', '有手机号', 4);

-- [空号过滤]
INSERT INTO `sys_dictionary` (`group_code`, `group_name`, `name`, `sort_order`) VALUES 
('NUMBER_STATUS', '空号过滤', '不限', 1),
('NUMBER_STATUS', '空号过滤', '正常号码', 2),
('NUMBER_STATUS', '空号过滤', '不可用或无号码', 3),
('NUMBER_STATUS', '空号过滤', '同电话', 4);

-- [联系邮箱]
INSERT INTO `sys_dictionary` (`group_code`, `group_name`, `name`, `sort_order`) VALUES 
('EMAIL_STATUS', '联系邮箱', '不限', 1),
('EMAIL_STATUS', '联系邮箱', '有联系邮箱', 2),
('EMAIL_STATUS', '联系邮箱', '无联系邮箱', 3);

-- [小微企业]
INSERT INTO `sys_dictionary` (`group_code`, `group_name`, `name`, `sort_order`) VALUES 
('SMALL_MICRO', '小微企业', '不限', 1),
('SMALL_MICRO', '小微企业', '是小微企业', 2),
('SMALL_MICRO', '小微企业', '非小微企业', 3);

-- [变更信息]
INSERT INTO `sys_dictionary` (`group_code`, `group_name`, `name`, `sort_order`) VALUES 
('CHANGE_INFO', '变更信息', '不限', 1),
('CHANGE_INFO', '变更信息', '有变更信息', 2),
('CHANGE_INFO', '变更信息', '无变更信息', 3);

-- [一般纳税人]
INSERT INTO `sys_dictionary` (`group_code`, `group_name`, `name`, `sort_order`) VALUES 
('TAX_PAYER', '一般纳税人', '不限', 1),
('TAX_PAYER', '一般纳税人', '一般纳税人', 2),
('TAX_PAYER', '一般纳税人', '非一般纳税人', 3);

-- [融资信息]
INSERT INTO `sys_dictionary` (`group_code`, `group_name`, `name`, `sort_order`) VALUES 
('FINANCING', '融资信息', '不限', 1),
('FINANCING', '融资信息', '有融资', 2),
('FINANCING', '融资信息', '无融资', 3);

-- [招投标]
INSERT INTO `sys_dictionary` (`group_code`, `group_name`, `name`, `sort_order`) VALUES 
('BIDDING', '招投标', '不限', 1),
('BIDDING', '招投标', '有招投标', 2),
('BIDDING', '招投标', '无招投标', 3);

-- [招聘]
INSERT INTO `sys_dictionary` (`group_code`, `group_name`, `name`, `sort_order`) VALUES 
('RECRUITMENT', '招聘', '不限', 1),
('RECRUITMENT', '招聘', '有招聘', 2),
('RECRUITMENT', '招聘', '无招聘', 3);

-- [税务评级]
INSERT INTO `sys_dictionary` (`group_code`, `group_name`, `name`, `sort_order`) VALUES 
('TAX_RATING', '税务评级', '不限', 1),
('TAX_RATING', '税务评级', 'A 级', 2);

-- [进出口信息]
INSERT INTO `sys_dictionary` (`group_code`, `group_name`, `name`, `sort_order`) VALUES 
('IMPORT_EXPORT', '进出口信息', '不限', 1),
('IMPORT_EXPORT', '进出口信息', '有进出口信息', 2),
('IMPORT_EXPORT', '进出口信息', '无进出口信息', 3);

-- [开户行]
INSERT INTO `sys_dictionary` (`group_code`, `group_name`, `name`, `sort_order`) VALUES 
('BANK_TYPE', '开户行', '国有大型企业', 1),
('BANK_TYPE', '开户行', '股份制商业银行', 2),
('BANK_TYPE', '开户行', '城市商业银行', 3),
('BANK_TYPE', '开户行', '农业商业银行', 4);

COMMIT;

SET FOREIGN_KEY_CHECKS = 1;