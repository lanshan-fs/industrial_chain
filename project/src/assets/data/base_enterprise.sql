/*
 Navicat MySQL Data Transfer
 Target Server Type    : MySQL
 Target Server Version : 8.0
 File Encoding         : 65001
 
 Date: 2026-02-12
 Desc: 区域产业链洞察平台 - 基本信息表 (base_enterprise)
 Source: 数据原型 V1.mm -> 企业数据原型 -> 基本信息
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- =========================================================
-- 0. 指定数据库
-- =========================================================
USE `industrial_chain`;

-- =========================================================
-- 1. 基本信息表 (base_enterprise)
-- =========================================================
DROP TABLE IF EXISTS `base_enterprise`;
CREATE TABLE `base_enterprise` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  
  -- [名称]
  `name` varchar(255) NOT NULL COMMENT '企业名称',
  
  -- [统一社会信用代码]
  `credit_code` varchar(50) DEFAULT NULL COMMENT '统一社会信用代码',
  
  -- [成立年限] (存储实际日期，用于计算年限)
  `est_date` date DEFAULT NULL COMMENT '成立日期',
  
  -- [注册] (存储实际数值，单位：元)
  `reg_capital` decimal(20,2) DEFAULT '0.00' COMMENT '注册资本',
  
  -- [实缴资本] (存储实际数值，单位：元)
  `paid_in_capital` decimal(20,2) DEFAULT '0.00' COMMENT '实缴资本',
  
  -- [经营状态] (原型：都是存续)
  `business_status` varchar(50) DEFAULT '存续' COMMENT '经营状态',
  
  -- [企业类型] (对应字典 ENT_TYPE)
  `enterprise_type` varchar(100) DEFAULT NULL COMMENT '企业类型',
  
  -- [组织类型（爬）] (对应字典 ORG_TYPE)
  `org_type` varchar(100) DEFAULT NULL COMMENT '组织类型',
  
  -- [企业规模（爬）] (对应字典 ENT_SCALE)
  `scale` varchar(50) DEFAULT NULL COMMENT '企业规模',
  
  -- [分支机构（爬）] (对应字典 BRANCH_STATUS)
  `branch_status` varchar(50) DEFAULT NULL COMMENT '分支机构状态',
  
  -- [地址信息] (存储具体地址，搜索时判断是否有值)
  `address` varchar(500) DEFAULT NULL COMMENT '企业地址',
  
  -- [投融资轮次]
  `financing_round` varchar(50) DEFAULT NULL COMMENT '投融资轮次',
  
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_credit_code` (`credit_code`),
  KEY `idx_name` (`name`),
  KEY `idx_est_date` (`est_date`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='企业基本信息表';


-- =========================================================
-- 2. 相关标签字典数据 (插入 sys_dictionary)
-- 包含“基本信息”节点下所有的枚举标签
-- =========================================================

-- 确保字典表存在 (如果尚未创建)
CREATE TABLE IF NOT EXISTS `sys_dictionary` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `group_code` varchar(50) NOT NULL COMMENT '分组编码',
  `group_name` varchar(50) DEFAULT NULL COMMENT '分组名称',
  `name` varchar(100) NOT NULL COMMENT '标签名称',
  `sort_order` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_group` (`group_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='通用标签字典表';

BEGIN;

-- ---------------------------------------------------------
-- [成立年限] (区间标签，供搜索使用)
-- ---------------------------------------------------------
INSERT INTO `sys_dictionary` (`group_code`, `group_name`, `name`, `sort_order`) VALUES 
('EST_AGE', '成立年限', '1 年内', 1),
('EST_AGE', '成立年限', '1-5 年', 2),
('EST_AGE', '成立年限', '5-10 年', 3),
('EST_AGE', '成立年限', '10-15 年', 4),
('EST_AGE', '成立年限', '15 年以上', 5);

-- ---------------------------------------------------------
-- [注册资本] (区间标签，供搜索使用)
-- ---------------------------------------------------------
INSERT INTO `sys_dictionary` (`group_code`, `group_name`, `name`, `sort_order`) VALUES 
('REG_CAPITAL', '注册资本', '0 万-100 万', 1),
('REG_CAPITAL', '注册资本', '100 万-200 万', 2),
('REG_CAPITAL', '注册资本', '200 万- 500 万', 3),
('REG_CAPITAL', '注册资本', '500 万- 1000 万', 4),
('REG_CAPITAL', '注册资本', '1000 万以上', 5);

-- ---------------------------------------------------------
-- [实缴资本] (状态与区间)
-- ---------------------------------------------------------
INSERT INTO `sys_dictionary` (`group_code`, `group_name`, `name`, `sort_order`) VALUES 
('PAID_CAPITAL', '实缴资本', '有实缴资本', 1),
('PAID_CAPITAL', '实缴资本', '无实缴资本', 2),
('PAID_CAPITAL', '实缴资本', '0 万-100 万', 3),
('PAID_CAPITAL', '实缴资本', '100 万-200 万', 4),
('PAID_CAPITAL', '实缴资本', '200 万-500 万', 5),
('PAID_CAPITAL', '实缴资本', '500 万-1000 万', 6),
('PAID_CAPITAL', '实缴资本', '1000 万-5000 万', 7),
('PAID_CAPITAL', '实缴资本', '5000 万以上', 8),
('PAID_CAPITAL', '实缴资本', '自定义', 9);

-- ---------------------------------------------------------
-- [经营状态]
-- ---------------------------------------------------------
INSERT INTO `sys_dictionary` (`group_code`, `group_name`, `name`, `sort_order`) VALUES 
('BIZ_STATUS', '经营状态', '存续', 1);

-- ---------------------------------------------------------
-- [企业类型]
-- ---------------------------------------------------------
INSERT INTO `sys_dictionary` (`group_code`, `group_name`, `name`, `sort_order`) VALUES 
('ENT_TYPE', '企业类型', '国有企业', 1),
('ENT_TYPE', '企业类型', '集体所有制企业', 2),
('ENT_TYPE', '企业类型', '股份合作企业', 3),
('ENT_TYPE', '企业类型', '联营企业', 4),
('ENT_TYPE', '企业类型', '有限责任公司', 5),
('ENT_TYPE', '企业类型', '普通合伙', 6),
('ENT_TYPE', '企业类型', '有限合伙', 7),
('ENT_TYPE', '企业类型', '股份有限公司', 8),
('ENT_TYPE', '企业类型', '私营企业', 9),
('ENT_TYPE', '企业类型', '民营企业', 10),
('ENT_TYPE', '企业类型', '个体工商户', 11),
('ENT_TYPE', '企业类型', '港澳台投资', 12),
('ENT_TYPE', '企业类型', '外商投资', 13),
('ENT_TYPE', '企业类型', '全民所有制', 14),
('ENT_TYPE', '企业类型', '个人独资企业', 15),
('ENT_TYPE', '企业类型', '农民专业合作社（联合社）', 16),
('ENT_TYPE', '企业类型', '其他', 17);

-- ---------------------------------------------------------
-- [组织类型（爬）]
-- ---------------------------------------------------------
INSERT INTO `sys_dictionary` (`group_code`, `group_name`, `name`, `sort_order`) VALUES 
('ORG_TYPE', '组织类型', '新三板', 1),
('ORG_TYPE', '组织类型', '上市公司', 2),
('ORG_TYPE', '组织类型', '社会组织', 3),
('ORG_TYPE', '组织类型', '律师事务所', 4),
('ORG_TYPE', '组织类型', '香港企业', 5),
('ORG_TYPE', '组织类型', '台湾企业', 6),
('ORG_TYPE', '组织类型', '机关单位', 7),
('ORG_TYPE', '组织类型', '事业单位', 8),
('ORG_TYPE', '组织类型', '学校', 9);

-- ---------------------------------------------------------
-- [企业规模（爬）]
-- ---------------------------------------------------------
INSERT INTO `sys_dictionary` (`group_code`, `group_name`, `name`, `sort_order`) VALUES 
('ENT_SCALE', '企业规模', '不限', 1),
('ENT_SCALE', '企业规模', '大型', 2),
('ENT_SCALE', '企业规模', '中型', 3),
('ENT_SCALE', '企业规模', '小型', 4),
('ENT_SCALE', '企业规模', '微型', 5);

-- ---------------------------------------------------------
-- [分支机构（爬）]
-- ---------------------------------------------------------
INSERT INTO `sys_dictionary` (`group_code`, `group_name`, `name`, `sort_order`) VALUES 
('BRANCH_STATUS', '分支机构', '不限', 1),
('BRANCH_STATUS', '分支机构', '是分支机构', 2),
('BRANCH_STATUS', '分支机构', '非分支机构', 3);

-- ---------------------------------------------------------
-- [地址信息] (状态标签)
-- ---------------------------------------------------------
INSERT INTO `sys_dictionary` (`group_code`, `group_name`, `name`, `sort_order`) VALUES 
('ADDR_INFO', '地址信息', '不限', 1),
('ADDR_INFO', '地址信息', '有企业地址', 2),
('ADDR_INFO', '地址信息', '无企业地址', 3);

COMMIT;

SET FOREIGN_KEY_CHECKS = 1;