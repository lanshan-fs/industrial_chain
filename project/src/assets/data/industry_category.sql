sys_industry_category/*
 Navicat MySQL Data Transfer
 Target Server Type    : MySQL
 Target Server Version : 8.0
 File Encoding         : 65001sys_config
 
 Date: 2026-02-12
 Desc: 区域产业链洞察平台 - 行业分类表 (sys_industry_category) 完整初始化脚本
 Source: 数据原型 V1.mm -> 行业分类
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

USE `industrial_chain`;

-- ----------------------------
-- Table structure for sys_industry_category
-- ----------------------------
DROP TABLE IF EXISTS `sys_industry_category`;
CREATE TABLE `sys_industry_category` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `parent_id` bigint DEFAULT '0' COMMENT '父级ID，0为顶级',
  `name` varchar(255) NOT NULL COMMENT '分类名称',
  `level` tinyint DEFAULT '0' COMMENT '层级：0=顶级, 1=一级, 2=二级, 3=三级',
  `sort_order` int DEFAULT '0' COMMENT '排序权重',
  PRIMARY KEY (`id`),
  KEY `idx_parent` (`parent_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='行业分类树';

-- ----------------------------
-- Records of sys_industry_category
-- ----------------------------
BEGIN;

-- =========================================================
-- 1. 数字医疗 (Level 0)
-- =========================================================
INSERT INTO `sys_industry_category` VALUES (1, 0, '数字医疗', 0, 1);

    -- 1.1 智慧医疗 (Level 1)
    INSERT INTO `sys_industry_category` VALUES (101, 1, '智慧医疗', 1, 1);
        -- 智慧CDSS (Level 2)
        INSERT INTO `sys_industry_category` VALUES (10101, 101, '智慧CDSS', 2, 1);
            INSERT INTO `sys_industry_category` VALUES (1010101, 10101, '主动干预：临床诊断与治疗', 3, 1);
            INSERT INTO `sys_industry_category` VALUES (1010102, 10101, '合理用药管理', 3, 2);
            INSERT INTO `sys_industry_category` VALUES (1010103, 10101, '被动检索：知识库', 3, 3);
        -- 智慧电子病历
        INSERT INTO `sys_industry_category` VALUES (10102, 101, '智慧电子病历', 2, 2);
            INSERT INTO `sys_industry_category` VALUES (1010201, 10102, '信息化企业', 3, 1);
            INSERT INTO `sys_industry_category` VALUES (1010202, 10102, '云服务提供商', 3, 2);
        -- 健康医疗大数据
        INSERT INTO `sys_industry_category` VALUES (10103, 101, '健康医疗大数据', 2, 3);
            INSERT INTO `sys_industry_category` VALUES (1010301, 10103, '信息化厂商', 3, 1);
            INSERT INTO `sys_industry_category` VALUES (1010302, 10103, '数据处理服务商', 3, 2);
            INSERT INTO `sys_industry_category` VALUES (1010303, 10103, '数据安全服务提供商', 3, 3);
            INSERT INTO `sys_industry_category` VALUES (1010304, 10103, '智能硬件厂商', 3, 4);
            INSERT INTO `sys_industry_category` VALUES (1010305, 10103, '物联网厂商', 3, 5);
        -- 智慧病理
        INSERT INTO `sys_industry_category` VALUES (10104, 101, '智慧病理', 2, 4);
            INSERT INTO `sys_industry_category` VALUES (1010401, 10104, '全切片成像系统与设备', 3, 1);
            INSERT INTO `sys_industry_category` VALUES (1010402, 10104, '独立病理中心', 3, 2);
            INSERT INTO `sys_industry_category` VALUES (1010403, 10104, '辅助病理诊断', 3, 3);
        -- 远程医疗
        INSERT INTO `sys_industry_category` VALUES (10105, 101, '远程医疗', 2, 5);
            INSERT INTO `sys_industry_category` VALUES (1010501, 10105, '信息化系统厂商', 3, 1);
            INSERT INTO `sys_industry_category` VALUES (1010502, 10105, '硬件设备生产商', 3, 2);
            INSERT INTO `sys_industry_category` VALUES (1010503, 10105, '通信服务商', 3, 3);
        -- 智慧医学影像
        INSERT INTO `sys_industry_category` VALUES (10106, 101, '智慧医学影像', 2, 6);
            INSERT INTO `sys_industry_category` VALUES (1010601, 10106, '人工智能辅助/线上诊断分析平台', 3, 1);
            INSERT INTO `sys_industry_category` VALUES (1010602, 10106, '医学影像存储系统PACS供应商', 3, 2);
            INSERT INTO `sys_industry_category` VALUES (1010603, 10106, '智慧CT', 3, 3);
            INSERT INTO `sys_industry_category` VALUES (1010604, 10106, '智慧DR', 3, 4);
            INSERT INTO `sys_industry_category` VALUES (1010605, 10106, '智慧MRI', 3, 5);
            INSERT INTO `sys_industry_category` VALUES (1010606, 10106, '智慧OCT', 3, 6);
            INSERT INTO `sys_industry_category` VALUES (1010607, 10106, '智慧内窥镜', 3, 7);
            INSERT INTO `sys_industry_category` VALUES (1010608, 10106, '智慧超声', 3, 8);
            INSERT INTO `sys_industry_category` VALUES (1010609, 10106, '独立医学影像中心', 3, 9);
        -- 智慧护理
        INSERT INTO `sys_industry_category` VALUES (10107, 101, '智慧护理', 2, 7);
            INSERT INTO `sys_industry_category` VALUES (1010701, 10107, '专项护理-养老', 3, 1);
            INSERT INTO `sys_industry_category` VALUES (1010702, 10107, '专项护理-慢病管理', 3, 2);
            INSERT INTO `sys_industry_category` VALUES (1010703, 10107, '专项护理-母婴', 3, 3);
            INSERT INTO `sys_industry_category` VALUES (1010704, 10107, '护理资源调配平台', 3, 4);
            INSERT INTO `sys_industry_category` VALUES (1010705, 10107, '智能硬件+护理服务', 3, 5);
            INSERT INTO `sys_industry_category` VALUES (1010706, 10107, '综合家庭护理', 3, 6);
        -- 智慧区域卫生
        INSERT INTO `sys_industry_category` VALUES (10108, 101, '智慧区域卫生', 2, 8);
            INSERT INTO `sys_industry_category` VALUES (1010801, 10108, '区域医疗数据信息中心', 3, 1);
            INSERT INTO `sys_industry_category` VALUES (1010802, 10108, '医疗大数据共享与交换平台', 3, 2);
            INSERT INTO `sys_industry_category` VALUES (1010803, 10108, '医疗线上平台应用系统', 3, 3);
            INSERT INTO `sys_industry_category` VALUES (1010804, 10108, '综合卫生监管平台', 3, 4);

    -- 1.2 互联网+健康 (Level 1)
    INSERT INTO `sys_industry_category` VALUES (102, 1, '互联网+健康', 1, 2);
        -- 互联网医院
        INSERT INTO `sys_industry_category` VALUES (10201, 102, '互联网医院', 2, 1);
            INSERT INTO `sys_industry_category` VALUES (1020101, 10201, '信息化服务商', 3, 1);
            INSERT INTO `sys_industry_category` VALUES (1020102, 10201, '处方流转平台', 3, 2);
            INSERT INTO `sys_industry_category` VALUES (1020103, 10201, '患者管理平台', 3, 3);
            INSERT INTO `sys_industry_category` VALUES (1020104, 10201, '药品流通商', 3, 4);
        -- 互联网保险
        INSERT INTO `sys_industry_category` VALUES (10202, 102, '互联网保险', 2, 2);
            INSERT INTO `sys_industry_category` VALUES (1020201, 10202, 'IOT', 3, 1);
            INSERT INTO `sys_industry_category` VALUES (1020202, 10202, '企业团险', 3, 2);
            INSERT INTO `sys_industry_category` VALUES (1020203, 10202, '保单和理赔服务', 3, 3);
            INSERT INTO `sys_industry_category` VALUES (1020204, 10202, '健康险企', 3, 4);
            INSERT INTO `sys_industry_category` VALUES (1020205, 10202, '比价/线上销售平台', 3, 5);
            INSERT INTO `sys_industry_category` VALUES (1020206, 10202, '网络互助保险平台', 3, 6);
        -- 公共卫生服务
        INSERT INTO `sys_industry_category` VALUES (10203, 102, '公共卫生服务', 2, 3);
            INSERT INTO `sys_industry_category` VALUES (1020301, 10203, '公卫服务相关智能设备', 3, 1);
            INSERT INTO `sys_industry_category` VALUES (1020302, 10203, '大数据与公卫服务', 3, 2);
            INSERT INTO `sys_industry_category` VALUES (1020303, 10203, '疾病知识科普', 3, 3);
        -- 检验检测
        INSERT INTO `sys_industry_category` VALUES (10204, 102, '检验检测', 2, 4);
            INSERT INTO `sys_industry_category` VALUES (1020401, 10204, '互联网公司', 3, 1);
            INSERT INTO `sys_industry_category` VALUES (1020402, 10204, '医院内检验机构', 3, 2);
            INSERT INTO `sys_industry_category` VALUES (1020403, 10204, '第三方检验中心', 3, 3);
        -- 医药电商
        INSERT INTO `sys_industry_category` VALUES (10205, 102, '医药电商', 2, 5);
            INSERT INTO `sys_industry_category` VALUES (1020501, 10205, 'B2B', 3, 1);
            INSERT INTO `sys_industry_category` VALUES (1020502, 10205, 'B2C', 3, 2);
            INSERT INTO `sys_industry_category` VALUES (1020503, 10205, 'O2O', 3, 3);
        -- 患者教育
        INSERT INTO `sys_industry_category` VALUES (10206, 102, '患者教育', 2, 6);
            INSERT INTO `sys_industry_category` VALUES (1020601, 10206, '其他疾病患教', 3, 1);
            INSERT INTO `sys_industry_category` VALUES (1020602, 10206, '图文在线健康科普', 3, 2);
            INSERT INTO `sys_industry_category` VALUES (1020603, 10206, '患者社区', 3, 3);
            INSERT INTO `sys_industry_category` VALUES (1020604, 10206, '用药指导', 3, 4);
            INSERT INTO `sys_industry_category` VALUES (1020605, 10206, '糖尿病患教', 3, 5);
            INSERT INTO `sys_industry_category` VALUES (1020606, 10206, '肿瘤患教', 3, 6);
            INSERT INTO `sys_industry_category` VALUES (1020607, 10206, '视/音频健康科普', 3, 7);
        -- 家庭医生
        INSERT INTO `sys_industry_category` VALUES (10207, 102, '家庭医生', 2, 7);
            INSERT INTO `sys_industry_category` VALUES (1020701, 10207, '医生在线预约平台', 3, 1);
            INSERT INTO `sys_industry_category` VALUES (1020702, 10207, '家庭医生信息化厂商和签约服务平台', 3, 2);
            INSERT INTO `sys_industry_category` VALUES (1020703, 10207, '诊所与家庭医生', 3, 3);
        -- 数字营销
        INSERT INTO `sys_industry_category` VALUES (10208, 102, '数字营销', 2, 8);
            INSERT INTO `sys_industry_category` VALUES (1020801, 10208, '医药企业', 3, 1);
            INSERT INTO `sys_industry_category` VALUES (1020802, 10208, '数字营销-以医生为导向', 3, 2);
            INSERT INTO `sys_industry_category` VALUES (1020803, 10208, '数字营销-以患者和消费者为导向', 3, 3);
            INSERT INTO `sys_industry_category` VALUES (1020804, 10208, '硬件和云服务', 3, 4);

    -- 1.3 数字疗法 (Level 1)
    INSERT INTO `sys_industry_category` VALUES (103, 1, '数字疗法', 1, 3);
        -- 可穿戴设备
        INSERT INTO `sys_industry_category` VALUES (10301, 103, '可穿戴设备', 2, 1);
            INSERT INTO `sys_industry_category` VALUES (1030101, 10301, '其他可穿戴设备', 3, 1);
            INSERT INTO `sys_industry_category` VALUES (1030102, 10301, '头戴式设备', 3, 2);
            INSERT INTO `sys_industry_category` VALUES (1030103, 10301, '智能手环', 3, 3);
            INSERT INTO `sys_industry_category` VALUES (1030104, 10301, '智能手表', 3, 4);
            INSERT INTO `sys_industry_category` VALUES (1030105, 10301, '智能服饰', 3, 5);
            INSERT INTO `sys_industry_category` VALUES (1030106, 10301, '智能眼镜', 3, 6);
            INSERT INTO `sys_industry_category` VALUES (1030107, 10301, '耳戴式设备', 3, 7);
            INSERT INTO `sys_industry_category` VALUES (1030108, 10301, '胸贴式设备', 3, 8);
            INSERT INTO `sys_industry_category` VALUES (1030109, 10301, '臂戴式设备', 3, 9);
        -- 糖尿病
        INSERT INTO `sys_industry_category` VALUES (10302, 103, '糖尿病', 2, 2);
            INSERT INTO `sys_industry_category` VALUES (1030201, 10302, '其他黑科技', 3, 1);
            INSERT INTO `sys_industry_category` VALUES (1030202, 10302, '智能胰岛素泵', 3, 2);
            INSERT INTO `sys_industry_category` VALUES (1030203, 10302, '糖尿病患者服务平台', 3, 3);
            INSERT INTO `sys_industry_category` VALUES (1030204, 10302, '糖尿病管理App', 3, 4);
            INSERT INTO `sys_industry_category` VALUES (1030205, 10302, '血糖监测系统', 3, 5);
        -- 肥胖症
        INSERT INTO `sys_industry_category` VALUES (10303, 103, '肥胖症', 2, 3);
            INSERT INTO `sys_industry_category` VALUES (1030301, 10303, '体重管理App及管理平台', 3, 1);
            INSERT INTO `sys_industry_category` VALUES (1030302, 10303, '智能可穿戴设备及其他智能减肥设备', 3, 2);
            INSERT INTO `sys_industry_category` VALUES (1030303, 10303, '肥胖症治疗器械', 3, 3);
        -- 哮喘/COPD
        INSERT INTO `sys_industry_category` VALUES (10304, 103, '哮喘/COPD', 2, 4);
            INSERT INTO `sys_industry_category` VALUES (1030401, 10304, '呼吸监测设备', 3, 1);
            INSERT INTO `sys_industry_category` VALUES (1030402, 10304, '哮喘/COPD吸入器传感器', 3, 2);
            INSERT INTO `sys_industry_category` VALUES (1030403, 10304, '哮喘/COPD相关App、线上平台', 3, 3);
        -- 抑郁症
        INSERT INTO `sys_industry_category` VALUES (10305, 103, '抑郁症', 2, 5);
            INSERT INTO `sys_industry_category` VALUES (1030501, 10305, '抑郁症诊断和分析', 3, 1);
            INSERT INTO `sys_industry_category` VALUES (1030502, 10305, '线上轻量级咨询', 3, 2);
            INSERT INTO `sys_industry_category` VALUES (1030503, 10305, '黑科技数字疗法', 3, 3);
        -- 高血压
        INSERT INTO `sys_industry_category` VALUES (10306, 103, '高血压', 2, 6);
            INSERT INTO `sys_industry_category` VALUES (1030601, 10306, 'App、线上服务', 3, 1);
            INSERT INTO `sys_industry_category` VALUES (1030602, 10306, '血压监测分析系统', 3, 2);
            INSERT INTO `sys_industry_category` VALUES (1030603, 10306, '智能血压计', 3, 3);
        -- 自闭症
        INSERT INTO `sys_industry_category` VALUES (10307, 103, '自闭症', 2, 7);
            INSERT INTO `sys_industry_category` VALUES (1030701, 10307, 'AI及VR/AR治疗', 3, 1);
            INSERT INTO `sys_industry_category` VALUES (1030702, 10307, '自闭症APP管理', 3, 2);
            INSERT INTO `sys_industry_category` VALUES (1030703, 10307, '自闭症患者社区', 3, 3);
            INSERT INTO `sys_industry_category` VALUES (1030704, 10307, '语言/行为康复治疗', 3, 4);


-- =========================================================
-- 2. 前沿技术 (Level 0)
-- =========================================================
INSERT INTO `sys_industry_category` VALUES (2, 0, '前沿技术', 0, 2);

    -- 2.1 前沿技术融合 (Level 1)
    INSERT INTO `sys_industry_category` VALUES (201, 2, '前沿技术融合', 1, 1);
        -- 脑机接口(BCI)
        INSERT INTO `sys_industry_category` VALUES (20101, 201, '脑机接口(BCI)', 2, 1);
            INSERT INTO `sys_industry_category` VALUES (2010101, 20101, '侵入式脑机接口', 3, 1);
            INSERT INTO `sys_industry_category` VALUES (2010102, 20101, '半侵入式/介入式脑机接口', 3, 2);
            INSERT INTO `sys_industry_category` VALUES (2010103, 20101, '非侵入式脑机接口', 3, 3);
        -- 人工智能
        INSERT INTO `sys_industry_category` VALUES (20102, 201, '人工智能', 2, 2);
            INSERT INTO `sys_industry_category` VALUES (2010201, 20102, 'AI临床试验解决方案', 3, 1);
            INSERT INTO `sys_industry_category` VALUES (2010202, 20102, 'AI健康管理平台', 3, 2);
            INSERT INTO `sys_industry_category` VALUES (2010203, 20102, '医疗垂直大模型', 3, 3);
            INSERT INTO `sys_industry_category` VALUES (2010204, 20102, '价值导向型医疗生态系统构建', 3, 4);


-- =========================================================
-- 3. 医疗器械 (Level 0)
-- =========================================================
INSERT INTO `sys_industry_category` VALUES (3, 0, '医疗器械', 0, 3);

    -- 3.1 体外诊断 (IVD) (Level 1)
    INSERT INTO `sys_industry_category` VALUES (301, 3, '体外诊断 (IVD)', 1, 1);
        -- 生化
        INSERT INTO `sys_industry_category` VALUES (30101, 301, '生化', 2, 1);
            INSERT INTO `sys_industry_category` VALUES (3010101, 30101, '生化分析仪、试剂等', 3, 1);
        -- 免疫
        INSERT INTO `sys_industry_category` VALUES (30102, 301, '免疫', 2, 2);
            INSERT INTO `sys_industry_category` VALUES (3010201, 30102, '免疫分析仪、试剂等', 3, 1);
        -- 分子
        INSERT INTO `sys_industry_category` VALUES (30103, 301, '分子', 2, 3);
            INSERT INTO `sys_industry_category` VALUES (3010301, 30103, 'PCR仪、基因测序设备等', 3, 1);
        -- 微生物
        INSERT INTO `sys_industry_category` VALUES (30104, 301, '微生物', 2, 4);
            INSERT INTO `sys_industry_category` VALUES (3010401, 30104, '微生物检测系统、培养箱等', 3, 1);
        -- 血液、体液
        INSERT INTO `sys_industry_category` VALUES (30105, 301, '血液、体液', 2, 5);
            INSERT INTO `sys_industry_category` VALUES (3010501, 30105, '血球仪、尿液分析仪等', 3, 1);
        -- POCT
        INSERT INTO `sys_industry_category` VALUES (30106, 301, 'POCT', 2, 6);
            INSERT INTO `sys_industry_category` VALUES (3010601, 30106, '便携式血糖仪、快速检测卡等', 3, 1);

    -- 3.2 影像设备 (Level 1)
    INSERT INTO `sys_industry_category` VALUES (302, 3, '影像设备', 1, 2);
        -- X射线成像设备
        INSERT INTO `sys_industry_category` VALUES (30201, 302, 'X射线成像设备', 2, 1);
            INSERT INTO `sys_industry_category` VALUES (3020101, 30201, 'CT、DR', 3, 1);
            INSERT INTO `sys_industry_category` VALUES (3020102, 30201, 'DSA', 3, 2);
        -- 超声诊断设备
        INSERT INTO `sys_industry_category` VALUES (30202, 302, '超声诊断设备', 2, 2);
            INSERT INTO `sys_industry_category` VALUES (3020201, 30202, '超声影像诊断设备', 3, 1);
            INSERT INTO `sys_industry_category` VALUES (3020202, 30202, '超声血管流量计', 3, 2);
        -- 核磁共振设备
        INSERT INTO `sys_industry_category` VALUES (30203, 302, '核磁共振设备', 2, 3);
            INSERT INTO `sys_industry_category` VALUES (3020301, 30203, 'MRI', 3, 1);
        -- 核医学检查设备
        INSERT INTO `sys_industry_category` VALUES (30204, 302, '核医学检查设备', 2, 4);
            INSERT INTO `sys_industry_category` VALUES (3020401, 30204, 'PET-CT', 3, 1);
        -- 内窥镜检查设备
        INSERT INTO `sys_industry_category` VALUES (30205, 302, '内窥镜检查设备', 2, 5);
            INSERT INTO `sys_industry_category` VALUES (3020501, 30205, '医用内窥镜', 3, 1);
            INSERT INTO `sys_industry_category` VALUES (3020502, 30205, '血管内超声诊断设备', 3, 2);
            INSERT INTO `sys_industry_category` VALUES (3020503, 30205, '电凝切割内窥镜', 3, 3);

    -- 3.3 治疗设备 (Level 1)
    INSERT INTO `sys_industry_category` VALUES (303, 3, '治疗设备', 1, 3);
        -- 手术机器人
        INSERT INTO `sys_industry_category` VALUES (30301, 303, '手术机器人', 2, 1);
            INSERT INTO `sys_industry_category` VALUES (3030101, 30301, '腔镜手术机器人', 3, 1);
            INSERT INTO `sys_industry_category` VALUES (3030102, 30301, '骨科手术机器人', 3, 2);
            INSERT INTO `sys_industry_category` VALUES (3030103, 30301, '泛血管介入手术机器人', 3, 3);
            INSERT INTO `sys_industry_category` VALUES (3030104, 30301, '经自然腔道手术机器人', 3, 4);
            INSERT INTO `sys_industry_category` VALUES (3030105, 30301, '经皮穿刺手术机器人', 3, 5);
        -- 能量源设备
        INSERT INTO `sys_industry_category` VALUES (30302, 303, '能量源设备', 2, 2);
            INSERT INTO `sys_industry_category` VALUES (3030201, 30302, '高频手术设备', 3, 1);
            INSERT INTO `sys_industry_category` VALUES (3030202, 30302, '激光治疗设备', 3, 2);
            INSERT INTO `sys_industry_category` VALUES (3030203, 30302, '射频治疗设备', 3, 3);
            INSERT INTO `sys_industry_category` VALUES (3030204, 30302, '脉冲电场消融设备', 3, 4);
            INSERT INTO `sys_industry_category` VALUES (3030205, 30302, '超声波治疗设备', 3, 5);
        -- 放射设备
        INSERT INTO `sys_industry_category` VALUES (30303, 303, '放射设备', 2, 3);
            INSERT INTO `sys_industry_category` VALUES (3030301, 30303, '放疗设备', 3, 1);

    -- 3.4 生命信息支持设备 (Level 1)
    INSERT INTO `sys_industry_category` VALUES (304, 3, '生命信息支持设备', 1, 4);
        -- 监护仪
        INSERT INTO `sys_industry_category` VALUES (30401, 304, '监护仪', 2, 1);
            INSERT INTO `sys_industry_category` VALUES (3040101, 30401, '监护设备', 3, 1);
        -- 呼吸机
        INSERT INTO `sys_industry_category` VALUES (30402, 304, '呼吸机', 2, 2);
            INSERT INTO `sys_industry_category` VALUES (3040201, 30402, '呼吸机', 3, 1);
        -- 麻醉机
        INSERT INTO `sys_industry_category` VALUES (30403, 304, '麻醉机', 2, 3);
            INSERT INTO `sys_industry_category` VALUES (3040301, 30403, '麻醉机', 3, 1);
        -- ECMO
        INSERT INTO `sys_industry_category` VALUES (30404, 304, 'ECMO', 2, 4);
            INSERT INTO `sys_industry_category` VALUES (3040401, 30404, '体外膜肺氧合设备', 3, 1);

    -- 3.5 康复设备 (Level 1)
    INSERT INTO `sys_industry_category` VALUES (305, 3, '康复设备', 1, 5);
        -- 康复机器人
        INSERT INTO `sys_industry_category` VALUES (30501, 305, '康复机器人', 2, 1);
            INSERT INTO `sys_industry_category` VALUES (3050101, 30501, '运动康复、视听障碍康复', 3, 1);
        -- 物理治疗设备
        INSERT INTO `sys_industry_category` VALUES (30502, 305, '物理治疗设备', 2, 2);
            INSERT INTO `sys_industry_category` VALUES (3050201, 30502, '声、光、电、磁疗', 3, 1);

    -- 3.6 辅助设备 (Level 1)
    INSERT INTO `sys_industry_category` VALUES (306, 3, '辅助设备', 1, 6);
        -- 诊断辅助软件
        INSERT INTO `sys_industry_category` VALUES (30601, 306, '诊断辅助软件', 2, 1);
            INSERT INTO `sys_industry_category` VALUES (3060101, 30601, 'AI影像处理软件', 3, 1);
            INSERT INTO `sys_industry_category` VALUES (3060102, 30601, 'AI决策支持软件', 3, 2);
            INSERT INTO `sys_industry_category` VALUES (3060103, 30601, 'AI手术计划软件', 3, 3);
            INSERT INTO `sys_industry_category` VALUES (3060104, 30601, '采用脑机接口技术的医疗器械', 3, 4);
            INSERT INTO `sys_industry_category` VALUES (3060105, 30601, '应用纳米材料的医疗器械', 3, 5);
            INSERT INTO `sys_industry_category` VALUES (3060106, 30601, '医疗器械软件（SaMD）', 3, 6);

    -- 3.7 家用医疗设备 (Level 1)
    INSERT INTO `sys_industry_category` VALUES (307, 3, '家用医疗设备', 1, 7);
        -- 呼吸治疗
        INSERT INTO `sys_industry_category` VALUES (30701, 307, '呼吸治疗', 2, 1);
            INSERT INTO `sys_industry_category` VALUES (3070101, 30701, '制氧机、呼吸机', 3, 1);
        -- 血糖监测
        INSERT INTO `sys_industry_category` VALUES (30702, 307, '血糖监测', 2, 2);
            INSERT INTO `sys_industry_category` VALUES (3070201, 30702, '血糖仪', 3, 1);
        -- 健康检测
        INSERT INTO `sys_industry_category` VALUES (30703, 307, '健康检测', 2, 3);
            INSERT INTO `sys_industry_category` VALUES (3070301, 30703, '电子血压计', 3, 1);
        -- 助听设备
        INSERT INTO `sys_industry_category` VALUES (30704, 307, '助听设备', 2, 4);
            INSERT INTO `sys_industry_category` VALUES (3070401, 30704, '助听器', 3, 1);

    -- 3.8 高值医用耗材 (Level 1)
    INSERT INTO `sys_industry_category` VALUES (308, 3, '高值医用耗材', 1, 8);
        -- 血管介入类
        INSERT INTO `sys_industry_category` VALUES (30801, 308, '血管介入类', 2, 1);
            INSERT INTO `sys_industry_category` VALUES (3080101, 30801, '冠脉介入球囊/支架', 3, 1);
            INSERT INTO `sys_industry_category` VALUES (3080102, 30801, '外周血管介入', 3, 2);
            INSERT INTO `sys_industry_category` VALUES (3080103, 30801, '神经血管介入', 3, 3);
            INSERT INTO `sys_industry_category` VALUES (3080104, 30801, '肺动脉血栓取出系统', 3, 4);
        -- 非血管介入类
        INSERT INTO `sys_industry_category` VALUES (30802, 308, '非血管介入类', 2, 2);
            INSERT INTO `sys_industry_category` VALUES (3080201, 30802, '内窥镜下耗材', 3, 1);
            INSERT INTO `sys_industry_category` VALUES (3080202, 30802, '其他介入耗材', 3, 2);

    -- 3.9 植入器械/材料 (Level 1)
    INSERT INTO `sys_industry_category` VALUES (309, 3, '植入器械/材料', 1, 9);
        -- 有源植入物
        INSERT INTO `sys_industry_category` VALUES (30901, 309, '有源植入物', 2, 1);
            INSERT INTO `sys_industry_category` VALUES (3090101, 30901, '心脏起搏器', 3, 1);
            INSERT INTO `sys_industry_category` VALUES (3090102, 30901, '植入式心律转复除颤器', 3, 2);
            INSERT INTO `sys_industry_category` VALUES (3090103, 30901, '心室辅助装置', 3, 3);
            INSERT INTO `sys_industry_category` VALUES (3090104, 30901, '脑深部电刺激器', 3, 4);
            INSERT INTO `sys_industry_category` VALUES (3090105, 30901, '脊髓刺激器', 3, 5);
            INSERT INTO `sys_industry_category` VALUES (3090106, 30901, '听觉植入物', 3, 6);
        -- 无源植入物
        INSERT INTO `sys_industry_category` VALUES (30902, 309, '无源植入物', 2, 2);
            INSERT INTO `sys_industry_category` VALUES (3090201, 30902, '心脏瓣膜', 3, 1);
            INSERT INTO `sys_industry_category` VALUES (3090202, 30902, '封堵器', 3, 2);
            INSERT INTO `sys_industry_category` VALUES (3090203, 30902, '关节植入物', 3, 3);
            INSERT INTO `sys_industry_category` VALUES (3090204, 30902, '脊柱植入物', 3, 4);
            INSERT INTO `sys_industry_category` VALUES (3090205, 30902, '创伤植入物', 3, 5);
            INSERT INTO `sys_industry_category` VALUES (3090206, 30902, '运动医学植入器械', 3, 6);
            INSERT INTO `sys_industry_category` VALUES (3090207, 30902, '整形外科植入物', 3, 7);
            INSERT INTO `sys_industry_category` VALUES (3090208, 30902, '眼科植入物', 3, 8);
            INSERT INTO `sys_industry_category` VALUES (3090209, 30902, '其他植入物', 3, 9);

    -- 3.10 低值医用耗材 (Level 1)
    INSERT INTO `sys_industry_category` VALUES (310, 3, '低值医用耗材', 1, 10);
        -- 注射穿刺类
        INSERT INTO `sys_industry_category` VALUES (31001, 310, '注射穿刺类', 2, 1);
            INSERT INTO `sys_industry_category` VALUES (3100101, 31001, '注射器、输液器', 3, 1);
        -- 医用卫生材料
        INSERT INTO `sys_industry_category` VALUES (31002, 310, '医用卫生材料', 2, 2);
            INSERT INTO `sys_industry_category` VALUES (3100201, 31002, '敷料、口罩', 3, 1);
        -- 医用高分子制品
        INSERT INTO `sys_industry_category` VALUES (31003, 310, '医用高分子制品', 2, 3);
            INSERT INTO `sys_industry_category` VALUES (3100301, 31003, '导管、引流袋', 3, 1);

    -- 3.11 装备制造 (Level 1)
    INSERT INTO `sys_industry_category` VALUES (311, 3, '装备制造', 1, 11);
        -- 制药装备
        INSERT INTO `sys_industry_category` VALUES (31101, 311, '制药装备', 2, 1);
            INSERT INTO `sys_industry_category` VALUES (3110101, 31101, '生物反应器/系统', 3, 1);
            INSERT INTO `sys_industry_category` VALUES (3110102, 31101, '实验室自动化', 3, 2);
            INSERT INTO `sys_industry_category` VALUES (3110103, 31101, '智慧工厂方案', 3, 3);


-- =========================================================
-- 4. 医疗服务 (Level 0)
-- =========================================================
INSERT INTO `sys_industry_category` VALUES (4, 0, '医疗服务', 0, 4);

    -- 4.1 医药商业 / 流通 (Level 1)
    INSERT INTO `sys_industry_category` VALUES (401, 4, '医药商业 / 流通', 1, 1);
        INSERT INTO `sys_industry_category` VALUES (40101, 401, '医药配送企业', 2, 1);
        -- 医药即时零售
        INSERT INTO `sys_industry_category` VALUES (40102, 401, '医药即时零售', 2, 2);
            INSERT INTO `sys_industry_category` VALUES (4010201, 40102, '平台型', 3, 1);
            INSERT INTO `sys_industry_category` VALUES (4010202, 40102, '连锁药店 O2O', 3, 2);
        -- 药企线上渠道 / 合作
        INSERT INTO `sys_industry_category` VALUES (40103, 401, '药企线上渠道 / 合作', 2, 3);
            INSERT INTO `sys_industry_category` VALUES (4010301, 40103, '新品首发 / 旗舰店 / 营销', 3, 1);
        INSERT INTO `sys_industry_category` VALUES (40104, 401, '医药跨境供应链', 2, 4);

    -- 4.2 医疗零售 (Level 1)
    INSERT INTO `sys_industry_category` VALUES (402, 4, '医疗零售', 1, 2);
        -- 实体药店
        INSERT INTO `sys_industry_category` VALUES (40201, 402, '实体药店', 2, 1);
            INSERT INTO `sys_industry_category` VALUES (4020101, 40201, '连锁药店', 3, 1);
            INSERT INTO `sys_industry_category` VALUES (4020102, 40201, 'DTP 药房 / 特药房', 3, 2);
        -- 医药电商
        INSERT INTO `sys_industry_category` VALUES (40202, 402, '医药电商', 2, 2);
            INSERT INTO `sys_industry_category` VALUES (4020201, 40202, 'B2B', 3, 1);
            INSERT INTO `sys_industry_category` VALUES (4020202, 40202, 'B2C', 3, 2);
            INSERT INTO `sys_industry_category` VALUES (4020203, 40202, 'O2O', 3, 3);
        -- 药店业务拓展
        INSERT INTO `sys_industry_category` VALUES (40203, 402, '药店业务拓展', 2, 3);
            INSERT INTO `sys_industry_category` VALUES (4020301, 40203, '医美服务', 3, 1);
            INSERT INTO `sys_industry_category` VALUES (4020302, 40203, '中医诊所', 3, 2);

    -- 4.3 严肃医疗 (Level 1)
    INSERT INTO `sys_industry_category` VALUES (403, 4, '严肃医疗', 1, 3);
        INSERT INTO `sys_industry_category` VALUES (40301, 403, '公立三级', 2, 1);
        INSERT INTO `sys_industry_category` VALUES (40302, 403, '公立二级', 2, 2);
        INSERT INTO `sys_industry_category` VALUES (40303, 403, '基层公卫', 2, 3);
        -- 民营医院
        INSERT INTO `sys_industry_category` VALUES (40304, 403, '民营医院', 2, 4);
            INSERT INTO `sys_industry_category` VALUES (4030401, 40304, '综合医院', 3, 1);
            INSERT INTO `sys_industry_category` VALUES (4030402, 40304, '专科医院（肿瘤）', 3, 2);
            INSERT INTO `sys_industry_category` VALUES (4030403, 40304, '专科医院（辅助生殖）', 3, 3);

    -- 4.4 消费医疗 (Level 1)
    INSERT INTO `sys_industry_category` VALUES (404, 4, '消费医疗', 1, 4);
        INSERT INTO `sys_industry_category` VALUES (40401, 404, '口腔诊所 / 连锁', 2, 1);
        INSERT INTO `sys_industry_category` VALUES (40402, 404, '体检中心 / 健康管理', 2, 2);
        -- 眼科诊所 / 连锁
        INSERT INTO `sys_industry_category` VALUES (40403, 404, '眼科诊所 / 连锁', 2, 3);
            INSERT INTO `sys_industry_category` VALUES (4040301, 40403, '综合眼科集团', 3, 1);
            INSERT INTO `sys_industry_category` VALUES (4040302, 40403, '垂直眼视光 / 少儿眼科', 3, 2);
        INSERT INTO `sys_industry_category` VALUES (40404, 404, '产后中心 / 母婴护理', 2, 4);
        INSERT INTO `sys_industry_category` VALUES (40405, 404, '生殖中心 / 门诊', 2, 5);
        INSERT INTO `sys_industry_category` VALUES (40406, 404, '中医诊所 / 连锁', 2, 6);
        INSERT INTO `sys_industry_category` VALUES (40407, 404, '医美诊所 / 服务', 2, 7);
        -- 专科诊所 / 连锁（其他）
        INSERT INTO `sys_industry_category` VALUES (40408, 404, '专科诊所 / 连锁（其他）', 2, 8);
            INSERT INTO `sys_industry_category` VALUES (4040801, 40408, '骨科与肌肉健康（数字疗法）', 3, 1);

    -- 4.5 互联网医疗 (Level 1)
    INSERT INTO `sys_industry_category` VALUES (405, 4, '互联网医疗', 1, 5);
        -- 综合平台 / 在线诊疗
        INSERT INTO `sys_industry_category` VALUES (40501, 405, '综合平台 / 在线诊疗', 2, 1);
            INSERT INTO `sys_industry_category` VALUES (4050101, 40501, '互联网医院', 3, 1);
            INSERT INTO `sys_industry_category` VALUES (4050102, 40501, 'AI 医疗应用', 3, 2);
        -- 垂直服务平台
        INSERT INTO `sys_industry_category` VALUES (40502, 405, '垂直服务平台', 2, 2);
            INSERT INTO `sys_industry_category` VALUES (4050201, 40502, '互联网 + 护理服务', 3, 1);
            INSERT INTO `sys_industry_category` VALUES (4050202, 40502, '数字慢病 / 专病管理', 3, 2);

    -- 4.6 第三方中心 (Level 1)
    INSERT INTO `sys_industry_category` VALUES (406, 4, '第三方中心', 1, 6);
        INSERT INTO `sys_industry_category` VALUES (40601, 406, '检验中心', 2, 1);
        INSERT INTO `sys_industry_category` VALUES (40602, 406, '影像中心', 2, 2);
        INSERT INTO `sys_industry_category` VALUES (40603, 406, '病理中心', 2, 3);
        -- 消毒中心
        INSERT INTO `sys_industry_category` VALUES (40604, 406, '消毒中心', 2, 4);
            INSERT INTO `sys_industry_category` VALUES (4060401, 40604, '第三方消毒供应', 3, 1);
        INSERT INTO `sys_industry_category` VALUES (40605, 406, '血透中心', 2, 5);
        -- 其他第三方服务
        INSERT INTO `sys_industry_category` VALUES (40606, 406, '其他第三方服务', 2, 6);
            INSERT INTO `sys_industry_category` VALUES (4060601, 40606, '居家护理 / 上门检测', 3, 1);

    -- 4.7 保险支付 (Level 1)
    INSERT INTO `sys_industry_category` VALUES (407, 4, '保险支付', 1, 7);
        -- 商业保险
        INSERT INTO `sys_industry_category` VALUES (40701, 407, '商业保险', 2, 1);
            INSERT INTO `sys_industry_category` VALUES (4070101, 40701, '健康险产品 / 公司', 3, 1);
        -- TPA / 保险科技
        INSERT INTO `sys_industry_category` VALUES (40702, 407, 'TPA / 保险科技', 2, 2);
            INSERT INTO `sys_industry_category` VALUES (4070201, 40702, '保险科技平台 / 服务', 3, 1);


-- =========================================================
-- 5. 药品 (Level 0)
-- =========================================================
INSERT INTO `sys_industry_category` VALUES (5, 0, '药品', 0, 5);

    -- 5.1 化学制药 (Level 1)
    INSERT INTO `sys_industry_category` VALUES (501, 5, '化学制药', 1, 1);
        -- 化学制剂
        INSERT INTO `sys_industry_category` VALUES (50101, 501, '化学制剂', 2, 1);
            INSERT INTO `sys_industry_category` VALUES (5010101, 50101, '创新小分子药', 3, 1);
            INSERT INTO `sys_industry_category` VALUES (5010102, 50101, '改良型新药', 3, 2);
            INSERT INTO `sys_industry_category` VALUES (5010103, 50101, '仿制药', 3, 3);
            INSERT INTO `sys_industry_category` VALUES (5010104, 50101, '减重领域小分子药', 3, 4);
            INSERT INTO `sys_industry_category` VALUES (5010105, 50101, '肿瘤靶向小分子药', 3, 5);
            INSERT INTO `sys_industry_category` VALUES (5010106, 50101, '自免领域小分子药', 3, 6);
        -- 原料药
        INSERT INTO `sys_industry_category` VALUES (50102, 501, '原料药', 2, 2);
            INSERT INTO `sys_industry_category` VALUES (5010201, 50102, '高端原料药', 3, 1);
            INSERT INTO `sys_industry_category` VALUES (5010202, 50102, '特色原料药', 3, 2);
            INSERT INTO `sys_industry_category` VALUES (5010203, 50102, '大宗原料药', 3, 3);
            INSERT INTO `sys_industry_category` VALUES (5010204, 50102, '多肽原料药', 3, 4);

    -- 5.2 生物制品 (Level 1)
    INSERT INTO `sys_industry_category` VALUES (502, 5, '生物制品', 1, 2);
        -- 血液制品
        INSERT INTO `sys_industry_category` VALUES (50201, 502, '血液制品', 2, 1);
            INSERT INTO `sys_industry_category` VALUES (5020101, 50201, '人血白蛋白', 3, 1);
            INSERT INTO `sys_industry_category` VALUES (5020102, 50201, '免疫球蛋白', 3, 2);
            INSERT INTO `sys_industry_category` VALUES (5020103, 50201, '凝血因子', 3, 3);
        -- 疫苗
        INSERT INTO `sys_industry_category` VALUES (50202, 502, '疫苗', 2, 2);
            INSERT INTO `sys_industry_category` VALUES (5020201, 50202, '预防性疫苗（HPV、PCV13）', 3, 1);
            INSERT INTO `sys_industry_category` VALUES (5020202, 50202, '治疗性疫苗', 3, 2);
            INSERT INTO `sys_industry_category` VALUES (5020203, 50202, 'mRNA 疫苗', 3, 3);
            INSERT INTO `sys_industry_category` VALUES (5020204, 50202, '乙肝治疗性疫苗', 3, 4);
        -- 抗体药物
        INSERT INTO `sys_industry_category` VALUES (50203, 502, '抗体药物', 2, 3);
            INSERT INTO `sys_industry_category` VALUES (5020301, 50203, '双特异性抗体', 3, 1);
            INSERT INTO `sys_industry_category` VALUES (5020302, 50203, 'ADC（抗体偶联药物）', 3, 2);
            INSERT INTO `sys_industry_category` VALUES (5020303, 50203, '双抗 ADC', 3, 3);
            INSERT INTO `sys_industry_category` VALUES (5020304, 50203, '双载荷 ADC', 3, 4);
            INSERT INTO `sys_industry_category` VALUES (5020305, 50203, '单克隆抗体', 3, 5);
            INSERT INTO `sys_industry_category` VALUES (5020306, 50203, '髓系细胞衔接器（MCE）', 3, 6);
        -- 蛋白药物
        INSERT INTO `sys_industry_category` VALUES (50204, 502, '蛋白药物', 2, 4);
            INSERT INTO `sys_industry_category` VALUES (5020401, 50204, '重组蛋白药物', 3, 1);
            INSERT INTO `sys_industry_category` VALUES (5020402, 50204, '酶替代疗法', 3, 2);
            INSERT INTO `sys_industry_category` VALUES (5020403, 50204, '细胞因子', 3, 3);
        -- 基因治疗
        INSERT INTO `sys_industry_category` VALUES (50205, 502, '基因治疗', 2, 5);
            INSERT INTO `sys_industry_category` VALUES (5020501, 50205, 'CAR-T（自体 / 通用型 / 体内 CAR-T）', 3, 1);
            INSERT INTO `sys_industry_category` VALUES (5020502, 50205, 'TIL 疗法', 3, 2);
            INSERT INTO `sys_industry_category` VALUES (5020503, 50205, '核酸药物（siRNA、mRNA 等）', 3, 3);
            INSERT INTO `sys_industry_category` VALUES (5020504, 50205, '基因编辑疗法', 3, 4);
            INSERT INTO `sys_industry_category` VALUES (5020505, 50205, '现货型细胞疗法', 3, 5);

    -- 5.3 中药 (Level 1)
    INSERT INTO `sys_industry_category` VALUES (503, 5, '中药', 1, 3);
        -- 中药饮片
        INSERT INTO `sys_industry_category` VALUES (50301, 503, '中药饮片', 2, 1);
            INSERT INTO `sys_industry_category` VALUES (5030101, 50301, '传统饮片', 3, 1);
            INSERT INTO `sys_industry_category` VALUES (5030102, 50301, '配方颗粒', 3, 2);
            INSERT INTO `sys_industry_category` VALUES (5030103, 50301, '破壁饮片', 3, 3);
        -- 中成药
        INSERT INTO `sys_industry_category` VALUES (50302, 503, '中成药', 2, 2);
            INSERT INTO `sys_industry_category` VALUES (5030201, 50302, '心脑血管类', 3, 1);
            INSERT INTO `sys_industry_category` VALUES (5030202, 50302, '呼吸系统类', 3, 2);
            INSERT INTO `sys_industry_category` VALUES (5030203, 50302, '抗肿瘤辅助类', 3, 3);


-- =========================================================
-- 6. AI 药物研发 (Level 0)
-- 注: 原型节点名为“AI 药物研”，已修正为“AI 药物研发”
-- =========================================================
INSERT INTO `sys_industry_category` VALUES (6, 0, 'AI 药物研发', 0, 6);

    -- 6.1 AI 药物研发平台 (Level 1)
    INSERT INTO `sys_industry_category` VALUES (601, 6, 'AI 药物研发平台', 1, 1);
        -- 小分子 / AI 药物研发平台等
        INSERT INTO `sys_industry_category` VALUES (60101, 601, '小分子 / AI 药物研发平台等', 2, 1);
            INSERT INTO `sys_industry_category` VALUES (6010101, 60101, '小分子 / AI 药物研发平台（如晶泰科技 XtalFold™）', 3, 1);
            INSERT INTO `sys_industry_category` VALUES (6010102, 60101, 'DNA 编码化合物库技术', 3, 2);
            INSERT INTO `sys_industry_category` VALUES (6010103, 60101, '一站式 AI 赋能新药研发平台（如腾迈医药 TandemViz™）', 3, 3);
            INSERT INTO `sys_industry_category` VALUES (6010104, 60101, '计算设计平台（如深势科技 Hermite®）', 3, 4);
            INSERT INTO `sys_industry_category` VALUES (6010105, 60101, 'AI + 疫苗研发平台', 3, 5);

    -- 6.2 AI CRO / 技术服务商 (Level 1)
    INSERT INTO `sys_industry_category` VALUES (602, 6, 'AI CRO / 技术服务商', 1, 2);
        -- AI 驱动的口服小分子药物等
        INSERT INTO `sys_industry_category` VALUES (60201, 602, 'AI 驱动的口服小分子药物等', 2, 1);
            INSERT INTO `sys_industry_category` VALUES (6020101, 60201, 'AI 驱动的口服小分子药物', 3, 1);
            INSERT INTO `sys_industry_category` VALUES (6020102, 60201, '代谢增强型细胞疗法（如莱芒生物 MetaOC 平台）', 3, 2);
            INSERT INTO `sys_industry_category` VALUES (6020103, 60201, 'AI 驱动的大分子药物（如倍华生物抗体平台）', 3, 3);
            INSERT INTO `sys_industry_category` VALUES (6020104, 60201, 'AI 设计的减重 / 代谢类药物', 3, 4);
            INSERT INTO `sys_industry_category` VALUES (6020105, 60201, 'AI 辅助临床试验设计', 3, 5);
            INSERT INTO `sys_industry_category` VALUES (6020106, 60201, '数字化 CRO 服务', 3, 6);

    -- 6.3 AI 自研管线企业 (Level 1)
    INSERT INTO `sys_industry_category` VALUES (603, 6, 'AI 自研管线企业', 1, 3);
        -- AI 药物研发 SaaS 平台等
        INSERT INTO `sys_industry_category` VALUES (60301, 603, 'AI 药物研发 SaaS 平台等', 2, 1);
            INSERT INTO `sys_industry_category` VALUES (6030101, 60301, 'AI 药物研发 SaaS 平台（覆盖药物设计、虚拟筛选、成药性预测）', 3, 1);
            INSERT INTO `sys_industry_category` VALUES (6030102, 60301, 'AI 智能体（如衍因科技在 RNA 药物、IND 申报等场景的嵌入）', 3, 2);
            INSERT INTO `sys_industry_category` VALUES (6030103, 60301, 'AI 蛋白质设计平台', 3, 3);
            INSERT INTO `sys_industry_category` VALUES (6030104, 60301, 'AI 设计的抗肿瘤药物', 3, 4);
            INSERT INTO `sys_industry_category` VALUES (6030105, 60301, 'AI 优化的代谢类药物', 3, 5);
            INSERT INTO `sys_industry_category` VALUES (6030106, 60301, 'AI 驱动的神经免疫疗法', 3, 6);

    -- 6.4 AI 软件 / 工具平台 (Level 1)
    INSERT INTO `sys_industry_category` VALUES (604, 6, 'AI 软件 / 工具平台', 1, 4);
        -- AI + 神经免疫疗法等
        INSERT INTO `sys_industry_category` VALUES (60401, 604, 'AI + 神经免疫疗法等', 2, 1);
            INSERT INTO `sys_industry_category` VALUES (6040101, 60401, 'AI + 神经免疫疗法（如埃格林医药 EG-501）', 3, 1);
            INSERT INTO `sys_industry_category` VALUES (6040102, 60401, 'AI + 疫苗研发（如智峪生科与沃森生物合作）', 3, 2);
            INSERT INTO `sys_industry_category` VALUES (6040103, 60401, 'AI + 多肽药物发现平台', 3, 3);
            INSERT INTO `sys_industry_category` VALUES (6040104, 60401, 'AI + 新型 ADC 化合物库开发', 3, 4);
            INSERT INTO `sys_industry_category` VALUES (6040105, 60401, 'AI 药物发现平台', 3, 5);
            INSERT INTO `sys_industry_category` VALUES (6040106, 60401, 'AI 蛋白质设计平台', 3, 6);
            INSERT INTO `sys_industry_category` VALUES (6040107, 60401, 'AI 临床试验优化平台', 3, 7);
            INSERT INTO `sys_industry_category` VALUES (6040108, 60401, 'AI 智能体平台', 3, 8);

    -- 6.5 AI + 特定领域研发 (Level 1)
    INSERT INTO `sys_industry_category` VALUES (605, 6, 'AI + 特定领域研发', 1, 5);
        -- 小分子及抗体类新药研发平台授权等
        INSERT INTO `sys_industry_category` VALUES (60501, 605, '小分子及抗体类新药研发平台授权等', 2, 1);
            INSERT INTO `sys_industry_category` VALUES (6050101, 60501, '小分子及抗体类新药研发平台授权', 3, 1);
            INSERT INTO `sys_industry_category` VALUES (6050102, 60501, 'AI 驱动的药物选择平台授权', 3, 2);
            INSERT INTO `sys_industry_category` VALUES (6050103, 60501, 'AI 平台用于大分子药物研发', 3, 3);

COMMIT;

SET FOREIGN_KEY_CHECKS = 1;