/*
 Navicat MySQL Data Transfer
 Target Server Type    : MySQL
 Target Server Version : 8.0
 File Encoding         : 65001
 
 Date: 2026-02-12
 Desc: 区域产业链洞察平台 - 知识产权扩展表 (enterprise_ip_data)
 Source: 数据原型 V1.mm -> 企业数据原型 -> 知识产权
 Note: 已移除 color 字段，适配现有字典表结构
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- =========================================================
-- 0. 指定数据库
-- =========================================================
USE `industrial_chain`;

-- =========================================================
-- 1. 知识产权状态扩展表 (enterprise_ip_data)
-- =========================================================
DROP TABLE IF EXISTS `enterprise_ip_data`;
CREATE TABLE `enterprise_ip_data` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `enterprise_id` bigint NOT NULL COMMENT '关联企业ID',
  
  -- [商标信息]
  `trademark_status` varchar(50) DEFAULT NULL COMMENT '商标状态',
  -- [专利信息]
  `patent_status` varchar(50) DEFAULT NULL COMMENT '专利状态',
  -- [作品著作权]
  `copyright_work_status` varchar(50) DEFAULT NULL COMMENT '作品著作权状态',
  -- [软件著作权]
  `copyright_software_status` varchar(50) DEFAULT NULL COMMENT '软件著作权状态',
  -- [集成电路布图]
  `ic_layout_status` varchar(50) DEFAULT NULL COMMENT '集成电路布图状态',
  -- [标准制定]
  `standard_status` varchar(50) DEFAULT NULL COMMENT '标准制定状态',
  -- [建筑资质]
  `construction_qual_status` varchar(50) DEFAULT NULL COMMENT '建筑资质状态',
  -- [高新技术企业]
  `is_high_tech` varchar(50) DEFAULT NULL COMMENT '高新企业标识',
  -- [微信公众号]
  `wechat_public_status` varchar(50) DEFAULT NULL COMMENT '公众号状态',
  -- [网址信息]
  `website_status` varchar(50) DEFAULT NULL COMMENT '网址状态',
  -- [备案网站检测]
  `icp_status` varchar(50) DEFAULT NULL COMMENT 'ICP备案状态',
  -- [商业特许经营]
  `franchise_status` varchar(50) DEFAULT NULL COMMENT '商业特许经营状态',
  
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_ent_id` (`enterprise_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='企业知识产权与资质状态表';


-- =========================================================
-- 2. 插入相关字典数据 (无 color 字段)
-- =========================================================
BEGIN;

-- 清理本模块相关的旧字典数据
DELETE FROM `sys_dictionary` WHERE `group_code` IN (
    'PATENT_TYPE', 'TECH_ATTR', 'CERT_TYPE', 'IP_STATUS_TRADEMARK', 
    'IP_STATUS_PATENT', 'IP_STATUS_COPYRIGHT', 'IP_STATUS_SOFTWARE',
    'IP_STATUS_HIGH_TECH', 'IP_STATUS_WECHAT', 'IP_STATUS_STANDARD',
    'IP_STATUS_IC', 'IP_STATUS_CONST', 'IP_STATUS_WEB', 
    'IP_STATUS_ICP', 'IP_STATUS_FRANCHISE'
);

-- [专利类型]
INSERT INTO `sys_dictionary` (`group_code`, `group_name`, `name`, `sort_order`) VALUES 
('PATENT_TYPE', '专利类型', '发明公布', 1),
('PATENT_TYPE', '专利类型', '发明授权', 2),
('PATENT_TYPE', '专利类型', '实用新型', 3),
('PATENT_TYPE', '专利类型', '外观设计', 4);

-- [企业科技属性]
INSERT INTO `sys_dictionary` (`group_code`, `group_name`, `name`, `sort_order`) VALUES 
('TECH_ATTR', '企业科技属性', '高新企业', 1),
('TECH_ATTR', '企业科技属性', '科技型中小企业', 2),
('TECH_ATTR', '企业科技属性', '瞪羚企业', 3),
('TECH_ATTR', '企业科技属性', '国家级技术创新示范企业', 4),
('TECH_ATTR', '企业科技属性', '省级技术创新示范企业', 5),
('TECH_ATTR', '企业科技属性', '国家级企业技术中心', 6),
('TECH_ATTR', '企业科技属性', '省级企业技术中心', 7),
('TECH_ATTR', '企业科技属性', '国家备案众创空间', 8),
('TECH_ATTR', '企业科技属性', '国家级科技企业孵化器', 9),
('TECH_ATTR', '企业科技属性', '省级科技企业孵化器', 10),
('TECH_ATTR', '企业科技属性', '国家火炬计划项目', 11),
('TECH_ATTR', '企业科技属性', '技术先进型服务企业', 12),
('TECH_ATTR', '企业科技属性', '民营科技企业', 13),
('TECH_ATTR', '企业科技属性', '专精特新企业', 14),
('TECH_ATTR', '企业科技属性', '科技小巨人企业', 15),
('TECH_ATTR', '企业科技属性', '专精特新小巨人', 16),
('TECH_ATTR', '企业科技属性', '创新型企业', 17),
('TECH_ATTR', '企业科技属性', '创新型试点企业', 18),
('TECH_ATTR', '企业科技属性', '创新型领军企业', 19),
('TECH_ATTR', '企业科技属性', '雏鹰企业', 20),
('TECH_ATTR', '企业科技属性', '隐形冠军', 21),
('TECH_ATTR', '企业科技属性', '牛羚企业', 22),
('TECH_ATTR', '企业科技属性', '独角兽企业', 23),
('TECH_ATTR', '企业科技属性', '未来独角兽企业', 24),
('TECH_ATTR', '企业科技属性', '潜在独角兽企业', 25),
('TECH_ATTR', '企业科技属性', '种子独角兽企业', 26);

-- [资质证书]
INSERT INTO `sys_dictionary` (`group_code`, `group_name`, `name`, `sort_order`) VALUES 
('CERT_TYPE', '资质证书', '进网许可证', 1),
('CERT_TYPE', '资质证书', '排污许可证', 2),
('CERT_TYPE', '资质证书', '采矿权许可证', 3),
('CERT_TYPE', '资质证书', '金融许可证', 4),
('CERT_TYPE', '资质证书', '食品生产许可证', 5),
('CERT_TYPE', '资质证书', '食品经营许可证', 6);

-- [商标信息]
INSERT INTO `sys_dictionary` (`group_code`, `group_name`, `name`, `sort_order`) VALUES 
('IP_STATUS_TRADEMARK', '商标信息', '不限', 1),
('IP_STATUS_TRADEMARK', '商标信息', '有商标', 2),
('IP_STATUS_TRADEMARK', '商标信息', '无商标', 3);

-- [专利信息]
INSERT INTO `sys_dictionary` (`group_code`, `group_name`, `name`, `sort_order`) VALUES 
('IP_STATUS_PATENT', '专利信息', '不限', 1),
('IP_STATUS_PATENT', '专利信息', '有专利', 2),
('IP_STATUS_PATENT', '专利信息', '无专利', 3);

-- [作品著作权]
INSERT INTO `sys_dictionary` (`group_code`, `group_name`, `name`, `sort_order`) VALUES 
('IP_STATUS_COPYRIGHT', '作品著作权', '不限', 1),
('IP_STATUS_COPYRIGHT', '作品著作权', '有作品著作权', 2),
('IP_STATUS_COPYRIGHT', '作品著作权', '无作品著作权', 3);

-- [软件著作权]
INSERT INTO `sys_dictionary` (`group_code`, `group_name`, `name`, `sort_order`) VALUES 
('IP_STATUS_SOFTWARE', '软件著作权', '不限', 1),
('IP_STATUS_SOFTWARE', '软件著作权', '有软件著作权', 2),
('IP_STATUS_SOFTWARE', '软件著作权', '无软件著作权', 3);

-- [高新技术企业]
INSERT INTO `sys_dictionary` (`group_code`, `group_name`, `name`, `sort_order`) VALUES 
('IP_STATUS_HIGH_TECH', '高新技术企业', '不限', 1),
('IP_STATUS_HIGH_TECH', '高新技术企业', '是高新技术企业', 2),
('IP_STATUS_HIGH_TECH', '高新技术企业', '不是高新技术企业', 3);

-- [微信公众号]
INSERT INTO `sys_dictionary` (`group_code`, `group_name`, `name`, `sort_order`) VALUES 
('IP_STATUS_WECHAT', '微信公众号', '不限', 1),
('IP_STATUS_WECHAT', '微信公众号', '有微信公众号', 2),
('IP_STATUS_WECHAT', '微信公众号', '无微信公众号', 3);

-- [标准制定]
INSERT INTO `sys_dictionary` (`group_code`, `group_name`, `name`, `sort_order`) VALUES 
('IP_STATUS_STANDARD', '标准制定', '不限', 1),
('IP_STATUS_STANDARD', '标准制定', '有制定标准', 2),
('IP_STATUS_STANDARD', '标准制定', '无制定标准', 3);

-- [集成电路布图]
INSERT INTO `sys_dictionary` (`group_code`, `group_name`, `name`, `sort_order`) VALUES 
('IP_STATUS_IC', '集成电路布图', '不限', 1),
('IP_STATUS_IC', '集成电路布图', '有集成电路布图', 2),
('IP_STATUS_IC', '集成电路布图', '无集成电路布图', 3);

-- [建筑资质]
INSERT INTO `sys_dictionary` (`group_code`, `group_name`, `name`, `sort_order`) VALUES 
('IP_STATUS_CONST', '建筑资质', '不限', 1),
('IP_STATUS_CONST', '建筑资质', '有建筑资质', 2),
('IP_STATUS_CONST', '建筑资质', '无建筑资质', 3);

-- [网址信息]
INSERT INTO `sys_dictionary` (`group_code`, `group_name`, `name`, `sort_order`) VALUES 
('IP_STATUS_WEB', '网址信息', '不限', 1),
('IP_STATUS_WEB', '网址信息', '有网址信息', 2),
('IP_STATUS_WEB', '网址信息', '无网址信息', 3);

-- [备案网站检测]
INSERT INTO `sys_dictionary` (`group_code`, `group_name`, `name`, `sort_order`) VALUES 
('IP_STATUS_ICP', '备案网站检测', '不限', 1),
('IP_STATUS_ICP', '备案网站检测', '有 ICP 备案', 2),
('IP_STATUS_ICP', '备案网站检测', '无 ICP 备案', 3);

-- [商业特许经营]
INSERT INTO `sys_dictionary` (`group_code`, `group_name`, `name`, `sort_order`) VALUES 
('IP_STATUS_FRANCHISE', '商业特许经营', '不限', 1),
('IP_STATUS_FRANCHISE', '商业特许经营', '有商业特许经营', 2),
('IP_STATUS_FRANCHISE', '商业特许经营', '无商业特许经营', 3);

COMMIT;

SET FOREIGN_KEY_CHECKS = 1;