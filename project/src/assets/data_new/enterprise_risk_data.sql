/*
 Navicat MySQL Data Transfer
 Target Server Type    : MySQL
 Target Server Version : 8.0
 File Encoding         : 65001
 
 Date: 2026-02-12
 Desc: 区域产业链洞察平台 - 风险信息扩展表 (enterprise_risk_data)
 Source: 数据原型 V1.mm -> 企业数据原型 -> 风险信息
 Note: 已移除 color 字段
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- =========================================================
-- 0. 指定数据库
-- =========================================================
USE `industrial_chain`;

-- =========================================================
-- 1. 风险信息扩展表 (enterprise_risk_data)
-- =========================================================
DROP TABLE IF EXISTS `enterprise_risk_data`;
CREATE TABLE `enterprise_risk_data` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `enterprise_id` bigint NOT NULL COMMENT '关联企业ID',
  
  -- [失信被执行] (如：'有失信被执行')
  `dishonest_executor_status` varchar(50) DEFAULT NULL COMMENT '失信被执行状态',
  
  -- [动产抵押] (如：'有动产抵押')
  `chattel_mortgage_status` varchar(50) DEFAULT NULL COMMENT '动产抵押状态',
  
  -- [经营异常] (如：'有经营异常')
  `abnormal_operation_status` varchar(50) DEFAULT NULL COMMENT '经营异常状态',
  
  -- [法律文书] (如：'有法律文书')
  `legal_document_status` varchar(50) DEFAULT NULL COMMENT '法律文书状态',
  
  -- [行政处罚] (如：'有行政处罚')
  `admin_penalty_status` varchar(50) DEFAULT NULL COMMENT '行政处罚状态',
  
  -- [破产重叠] (原文如此，推测为破产重整)
  `bankruptcy_status` varchar(50) DEFAULT NULL COMMENT '破产重整状态',
  
  -- [清算信息] (如：'有清算信息')
  `liquidation_status` varchar(50) DEFAULT NULL COMMENT '清算信息状态',
  
  -- [环保处罚] (如：'有环保处罚')
  `env_penalty_status` varchar(50) DEFAULT NULL COMMENT '环保处罚状态',
  
  -- [股权冻结] (如：'有股权冻结')
  `equity_freeze_status` varchar(50) DEFAULT NULL COMMENT '股权冻结状态',
  
  -- [被执行人] (如：'有被执行人')
  `executor_status` varchar(50) DEFAULT NULL COMMENT '被执行人状态',
  
  -- [限制高消费] (如：'有限制高消费')
  `high_consumption_limit_status` varchar(50) DEFAULT NULL COMMENT '限制高消费状态',
  
  -- [（迁出风险 & 迁入匹配）] (原型中无子节点，预留字段)
  `migration_risk_label` varchar(100) DEFAULT NULL COMMENT '迁出/迁入风险标签',
  
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_ent_id` (`enterprise_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='企业风险信息扩展表';


-- =========================================================
-- 2. 插入相关字典数据 (sys_dictionary)
-- =========================================================
BEGIN;

-- 清理本模块相关的旧字典数据
DELETE FROM `sys_dictionary` WHERE `group_code` IN (
    'RISK_DISHONEST', 'RISK_MORTGAGE', 'RISK_ABNORMAL', 'RISK_LEGAL_DOC',
    'RISK_PENALTY', 'RISK_BANKRUPTCY', 'RISK_LIQUIDATION', 'RISK_ENV_PENALTY',
    'RISK_EQUITY_FREEZE', 'RISK_EXECUTOR', 'RISK_LIMIT_CONSUMPTION'
);

-- [失信被执行]
INSERT INTO `sys_dictionary` (`group_code`, `group_name`, `name`, `sort_order`) VALUES 
('RISK_DISHONEST', '失信被执行', '不限', 1),
('RISK_DISHONEST', '失信被执行', '有失信被执行', 2),
('RISK_DISHONEST', '失信被执行', '无失信被执行', 3);

-- [动产抵押]
INSERT INTO `sys_dictionary` (`group_code`, `group_name`, `name`, `sort_order`) VALUES 
('RISK_MORTGAGE', '动产抵押', '不限', 1),
('RISK_MORTGAGE', '动产抵押', '有动产抵押', 2),
('RISK_MORTGAGE', '动产抵押', '无动产抵押', 3);

-- [经营异常]
INSERT INTO `sys_dictionary` (`group_code`, `group_name`, `name`, `sort_order`) VALUES 
('RISK_ABNORMAL', '经营异常', '不限', 1),
('RISK_ABNORMAL', '经营异常', '有经营异常', 2),
('RISK_ABNORMAL', '经营异常', '无经营异常', 3);

-- [法律文书]
INSERT INTO `sys_dictionary` (`group_code`, `group_name`, `name`, `sort_order`) VALUES 
('RISK_LEGAL_DOC', '法律文书', '不限', 1),
('RISK_LEGAL_DOC', '法律文书', '有法律文书', 2),
('RISK_LEGAL_DOC', '法律文书', '无法律文书', 3);

-- [行政处罚]
INSERT INTO `sys_dictionary` (`group_code`, `group_name`, `name`, `sort_order`) VALUES 
('RISK_PENALTY', '行政处罚', '不限', 1),
('RISK_PENALTY', '行政处罚', '有行政处罚', 2),
('RISK_PENALTY', '行政处罚', '无行政处罚', 3);

-- [破产重叠]
INSERT INTO `sys_dictionary` (`group_code`, `group_name`, `name`, `sort_order`) VALUES 
('RISK_BANKRUPTCY', '破产重叠', '不限', 1),
('RISK_BANKRUPTCY', '破产重叠', '有破产重叠', 2),
('RISK_BANKRUPTCY', '破产重叠', '无破产重叠', 3);

-- [清算信息]
INSERT INTO `sys_dictionary` (`group_code`, `group_name`, `name`, `sort_order`) VALUES 
('RISK_LIQUIDATION', '清算信息', '不限', 1),
('RISK_LIQUIDATION', '清算信息', '有清算信息', 2),
('RISK_LIQUIDATION', '清算信息', '无清算信息', 3);

-- [环保处罚]
INSERT INTO `sys_dictionary` (`group_code`, `group_name`, `name`, `sort_order`) VALUES 
('RISK_ENV_PENALTY', '环保处罚', '不限', 1),
('RISK_ENV_PENALTY', '环保处罚', '有环保处罚', 2),
('RISK_ENV_PENALTY', '环保处罚', '无环保处罚', 3);

-- [股权冻结]
INSERT INTO `sys_dictionary` (`group_code`, `group_name`, `name`, `sort_order`) VALUES 
('RISK_EQUITY_FREEZE', '股权冻结', '不限', 1),
('RISK_EQUITY_FREEZE', '股权冻结', '有股权冻结', 2),
('RISK_EQUITY_FREEZE', '股权冻结', '无股权冻结', 3);

-- [被执行人]
INSERT INTO `sys_dictionary` (`group_code`, `group_name`, `name`, `sort_order`) VALUES 
('RISK_EXECUTOR', '被执行人', '不限', 1),
('RISK_EXECUTOR', '被执行人', '有被执行人', 2),
('RISK_EXECUTOR', '被执行人', '无被执行人', 3);

-- [限制高消费]
INSERT INTO `sys_dictionary` (`group_code`, `group_name`, `name`, `sort_order`) VALUES 
('RISK_LIMIT_CONSUMPTION', '限制高消费', '不限', 1),
('RISK_LIMIT_CONSUMPTION', '限制高消费', '有限制高消费', 2),
('RISK_LIMIT_CONSUMPTION', '限制高消费', '无限制高消费', 3);

COMMIT;

SET FOREIGN_KEY_CHECKS = 1;