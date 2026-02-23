import pandas as pd
import mysql.connector
from mysql.connector import Error
import json
import os
from dotenv import load_dotenv

# 加载 .env 文件
# 寻找脚本上两级目录下的 .env 文件
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ROOT_DIR = os.path.dirname(BASE_DIR)
load_dotenv(os.path.join(ROOT_DIR, '.env'))

# --- 从环境变量读取配置 ---
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD'),
    'database': os.getenv('DB_NAME', 'industrial_chain'),
    'charset': 'utf8mb4'
}

CSV_PATH = os.path.join(BASE_DIR, 'example', 'data_example100.csv')
JSON_PATH = os.path.join(BASE_DIR, 'example', 'data_example100.json')

MAPPING = {
    "企业名称": "company_name", "统一社会信用代码": "company_id", "成立年限": "establishment_date_desc",
    "注册资本": "reg_capital", "注册资本（统一人民币为单位）": "reg_capital_rmb", "实缴资本": "paid_capital",
    "实缴资本（统一人民币为单位）": "paid_capital_rmb", "企业类型": "enterprise_type", "组织类型": "organization_type",
    "企业规模": "enterprise_scale", "分支机构": "is_branch_info", "地址信息": "address_info",
    "投融资轮次": "financing_round", "企业资质": "qualifications", "法定代表人": "legal_person",
    "社保人数": "insured_count", "注册号": "reg_number", "组织机构代码": "org_code",
    "所属行业": "industry_gs", "经营范围": "business_scope", "邮箱（工商信息）": "email_gs",
    "邮箱（企业认证信息）": "email_auth", "股东": "shareholders", "联系电话（工商信息，按最新信息依次展示）": "phone_gs",
    "联系电话2": "phone2", "联系电话3": "phone3", "联系电话4": "phone4", "联系电话5": "phone5",
    "推荐电话": "phone_rec", "原始行号": "original_row", "法律文书_司法案件": "judicial_cases",
    "法律文书_裁判文书": "judicial_docs", "法律文书_合计": "judicial_total", "失信被执行": "dishonest_executor",
    "动产抵押": "chattel_mortgage", "经营异常": "operating_abnormal", "行政处罚": "admin_penalty",
    "破产重叠": "bankruptcy_overlap", "清算信息": "liquidation_info", "环保处罚": "env_penalty",
    "股权冻结": "equity_freeze", "被执行人": "executor", "限制高消费": "limit_consumption",
    "地址": "address_detail", "地区": "district", "街道": "street", "员工人数": "staff_count_desc",
    "社保人数_状态": "insured_status", "上市状态": "listing_status", "国标行业": "gb_industry",
    "联系方式": "contact_methods", "同企业电话": "same_phone_count", "邮箱（工商信息）_状态": "email_gs_status",
    "是否小微企业": "is_small_micro", "是否有变更信息": "has_change_info", "是否为一般纳税人": "is_general_taxpayer",
    "有无融资信息": "has_financing", "招投标数量": "bidding_count", "招聘信息数量": "recruitment_count",
    "税务评级": "tax_rating", "开户行": "bank_account"
}

def process_data():
    if not DB_CONFIG['password']:
        print("错误: 未在 .env 文件中发现 DB_PASSWORD")
        return
    
    if not os.path.exists(CSV_PATH):
        print(f"错误: 找不到文件 {CSV_PATH}")
        return

    print(f"1. 正在解析 CSV...")
    df = pd.read_csv(CSV_PATH).replace({pd.NA: None, float('nan'): None})
    df = df.rename(columns=MAPPING)
    
    # 转换数值
    int_cols = ["judicial_cases", "judicial_docs", "judicial_total", "dishonest_executor", 
                "chattel_mortgage", "operating_abnormal", "admin_penalty", "bankruptcy_overlap", 
                "liquidation_info", "env_penalty", "equity_freeze", "executor", "limit_consumption", 
                "same_phone_count", "bidding_count", "recruitment_count"]
    for col in int_cols:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0).astype(int)
            
    # 转换布尔
    bool_cols = ["is_small_micro", "has_change_info", "is_general_taxpayer", "has_financing"]
    for col in bool_cols:
        if col in df.columns:
            df[col] = df[col].apply(lambda x: 1 if str(x) == '1' else 0)

    # 保存 JSON
    records = df.to_dict(orient='records')
    with open(JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(records, f, ensure_ascii=False, indent=2)
    print(f"2. JSON 已导出至: {JSON_PATH}")

    # 导入数据库
    print(f"3. 正在连接数据库并导入...")
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()
        
        cols = list(records[0].keys())
        columns_str = ", ".join([f"`{c}`" for c in cols])
        placeholders = ", ".join(["%s"] * len(cols))
        
        sql = f"INSERT INTO `companies` ({columns_str}) VALUES ({placeholders}) ON DUPLICATE KEY UPDATE company_name=VALUES(company_name)"
        data = [tuple(r[col] for col in cols) for r in records]
        
        cursor.executemany(sql, data)
        conn.commit()
        print(f"成功！已将 {cursor.rowcount} 条记录导入 MySQL。")
    except Error as e:
        print(f"数据库错误: {e}")
    finally:
        if 'conn' in locals() and conn.is_connected():
            cursor.close()
            conn.close()

if __name__ == "__main__":
    process_data()
