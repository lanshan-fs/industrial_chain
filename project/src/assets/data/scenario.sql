/*
 Navicat MySQL Data Transfer
 Target Server Type    : MySQL
 Target Server Version : 8.0
 File Encoding         : 65001
 
 Date: 2026-02-12
 Desc: 区域产业链洞察平台 - 应用场景表 (sys_scenario) 完整初始化脚本
 Source: 数据原型 V1.mm -> 应用场景
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- =========================================================
-- 0. 指定数据库
-- =========================================================
USE `industrial_chain`;

-- ----------------------------
-- Table structure for sys_scenario
-- ----------------------------
DROP TABLE IF EXISTS `sys_scenario`;
CREATE TABLE `sys_scenario` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL COMMENT '场景名称',
  `code` varchar(50) DEFAULT NULL COMMENT '场景编码(可选，自动生成拼音或自定义)',
  `sort_order` int DEFAULT '0' COMMENT '排序权重',
  `description` varchar(255) DEFAULT NULL COMMENT '场景描述',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='应用场景维表';

-- ----------------------------
-- Records of sys_scenario
-- ----------------------------
BEGIN;

-- 按照思维导图顺序插入所有应用场景节点
INSERT INTO `sys_scenario` (`name`, `sort_order`) VALUES 
('健康管理', 10),
('患者社区', 20),
('健康和疾病咨询', 30),
('就诊挂号', 40),
('就诊服务', 50),
('转诊服务', 60),
('诊后服务', 70),
('疾病诊断', 80),
('疾病治疗', 90),
('康复治疗', 100),
('疾病预防', 110),
('中医科', 120),
('口腔科', 130),
('眼科', 140),
('疼痛科', 150),
('辅助科室', 160),
('精神科', 170),
('行政管理', 180),
('后勤支持', 190),
('肿瘤', 200),
('心血管疾病', 210),
('感染性疾病', 220),
('内分泌系统疾病', 230),
('代谢性疾病', 240),
('精神类疾病', 250),
('神经系统疾病', 260),
('呼吸系统疾病', 270),
('血液系统疾病', 280),
('消化系统疾病', 290),
('眼部疾病', 300),
('皮肤疾病', 310),
('生殖系统疾病', 320),
('罕见病', 330),
('泌尿系统疾病', 340),
('慢性病', 350),
('脑部疾病', 360),
('运动系统疾病', 370),
('骨科', 380);

COMMIT;

SET FOREIGN_KEY_CHECKS = 1;