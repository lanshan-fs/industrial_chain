USE `industrial_chain`;companies

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
CREATE TABLE IF NOT EXISTS `companies_tags` (
  `company_id` VARCHAR(50) NOT NULL COMMENT '企业ID',
  `tag_id` VARCHAR(50) NOT NULL COMMENT '标签ID',
  KEY `idx_company` (`company_id`),
  KEY `idx_tag` (`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='企业与标签关联表';