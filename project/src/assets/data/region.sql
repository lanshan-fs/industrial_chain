/*
 Navicat MySQL Data Transfer
 Target Server Type    : MySQL
 Target Server Version : 8.0
 File Encoding         : 65001
 
 Date: 2026-02-12
 Desc: 区域产业链洞察平台 - 行政区域表 (sys_region) 完整初始化脚本
 Source: 数据原型 V1.mm -> 街道地区
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- =========================================================
-- 0. 指定数据库
-- =========================================================
USE `industrial_chain`;

-- ----------------------------
-- Table structure for sys_region
-- ----------------------------
DROP TABLE IF EXISTS `sys_region`;
CREATE TABLE `sys_region` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `parent_id` bigint DEFAULT '0' COMMENT '父级ID',
  `name` varchar(100) NOT NULL COMMENT '区域名称',
  `type` varchar(20) DEFAULT 'STREET' COMMENT '类型：DISTRICT(区), STREET(街道), AREA(地区)',
  `sort_order` int DEFAULT '0' COMMENT '排序权重',
  PRIMARY KEY (`id`),
  KEY `idx_parent` (`parent_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='行政区域表';

-- ----------------------------
-- Records of sys_region
-- ----------------------------
BEGIN;

-- =========================================================
-- 1. 根节点 (逻辑根节点：朝阳区)
-- =========================================================
INSERT INTO `sys_region` VALUES (1, 0, '朝阳区', 'DISTRICT', 1);

-- =========================================================
-- 2. 街道 (Type: STREET, Parent: 1)
-- =========================================================
INSERT INTO `sys_region` (`parent_id`, `name`, `type`, `sort_order`) VALUES 
(1, '朝外街道', 'STREET', 10),
(1, '劲松街道', 'STREET', 20),
(1, '建外街道', 'STREET', 30),
(1, '呼家楼街道', 'STREET', 40),
(1, '八里庄街道', 'STREET', 50),
(1, '三里屯街道', 'STREET', 60),
(1, '团结湖街道', 'STREET', 70),
(1, '双井街道', 'STREET', 80),
(1, '垡头街道', 'STREET', 90),
(1, '左家庄街道', 'STREET', 100),
(1, '小关街道', 'STREET', 110),
(1, '和平街街道', 'STREET', 120),
(1, '酒仙桥街道', 'STREET', 130),
(1, '首都机场街道', 'STREET', 140),
(1, '潘家园街道', 'STREET', 150),
(1, '六里屯街道', 'STREET', 160),
(1, '麦子店街道', 'STREET', 170),
(1, '香河园街道', 'STREET', 180),
(1, '亚运村街道', 'STREET', 190),
(1, '望京街道', 'STREET', 200),
(1, '安贞街道', 'STREET', 210),
(1, '大屯街道', 'STREET', 220),
(1, '奥运村街道', 'STREET', 230),
(1, '东湖街道', 'STREET', 240);

-- =========================================================
-- 3. 地区 (Type: AREA, Parent: 1)
-- =========================================================
INSERT INTO `sys_region` (`parent_id`, `name`, `type`, `sort_order`) VALUES 
(1, '南磨房地区', 'AREA', 300),
(1, '高碑店地区', 'AREA', 310),
(1, '将台地区', 'AREA', 320),
(1, '太阳宫地区', 'AREA', 330),
(1, '小红门地区', 'AREA', 340),
(1, '十八里店地区', 'AREA', 350),
(1, '三间房地区', 'AREA', 360),
(1, '东风地区', 'AREA', 370),
(1, '常营地区', 'AREA', 380),
(1, '管庄地区', 'AREA', 390),
(1, '孙河地区', 'AREA', 400),
(1, '王四营地区', 'AREA', 410),
(1, '东坝地区', 'AREA', 420),
(1, '黑庄户地区', 'AREA', 430),
(1, '崔各庄地区', 'AREA', 440),
(1, '豆各庄地区', 'AREA', 450),
(1, '金盏地区', 'AREA', 460),
(1, '平房地区', 'AREA', 470),
(1, '来广营地区', 'AREA', 480);

COMMIT;

SET FOREIGN_KEY_CHECKS = 1;