import mysql.connector
from mysql.connector.pooling import MySQLConnectionPool
import re

class MySQLDatabase:
    def __init__(self, config: dict):
        """Initializes the MySQLDatabase instance.

        Args:
            config (dict): A dictionary containing optional MySQL connection parameters.
        """
        self.connection_pool = MySQLConnectionPool(
            pool_name="my_pool",
            pool_size=5,
            host=config.get("host", "localhost"),
            user=config.get("user", "root"),
            password=config.get("password", ""),
            database=config.get("database", None),
            port=config.get("port", 3306),
            autocommit=True,
            buffered=True
        )
        
    def create_mysql_users(self):
        """
        Creates two MySQL users: app_user (for T2SQL) and api_user (for api_keys.public_key).
        - app_user: SELECT on non-sensitive tables (categories, stock, etc.).
        - api_user: SELECT on api_keys.public_key only.
        
        Returns:
            dict: Status of user creation and permission granting.
        """
        connection = self.connection_pool.get_connection()
        cursor = connection.cursor()
        
        try:
            # Tạo app_user
            cursor.execute("""
                CREATE USER IF NOT EXISTS 'app_user'@'localhost' IDENTIFIED BY 'secure_password';
            """)
            
            # Cấp quyền SELECT cho app_user trên các bảng không nhạy cảm
            non_sensitive_tables = [
                'categories', 'manufacturers', 'products', 'stock', 'product_prices',
                'partners', 'employees', 'transactions', 'parameters'
            ]
            for table in non_sensitive_tables:
                cursor.execute(f"""
                    GRANT SELECT ON thuctapcoso.{table} TO 'app_user'@'localhost';
                """)
            
            
            # Áp dụng quyền
            cursor.execute("FLUSH PRIVILEGES;")
            
            return {
                "status": "success",
                "message": "Users app_user created with appropriate permissions."
            }
        except mysql.connector.Error as e:
            return {
                "status": "error",
                "message": f"Failed to create users: {str(e)}"
            }
        finally:
            cursor.close()
            connection.close()
        
    def execute_limited_query(self, sql, offset=0, force_offset=False):
        connection = self.connection_pool.get_connection()
        cursor = connection.cursor(buffered=True)
        """
        Thực thi một câu truy vấn SQL với giới hạn số hàng trả về (tối đa 8) và hỗ trợ offset.
        Nếu offset > 0, sử dụng offset này; nếu không, giữ nguyên OFFSET trong câu SQL gốc.

        Args:
            sql (str): Câu truy vấn SQL gốc.
            offset (int): Số hàng bị bỏ qua trước khi lấy kết quả (mặc định là 0).

        Returns:
            dict: Kết quả bao gồm câu SQL đã giới hạn, tổng số hàng và dữ liệu định dạng.
                  Trả về None nếu có lỗi.
        """
        max_limit = 8

        # Loại bỏ mọi LIMIT và OFFSET hiện có trong câu SQL gốc
        sql_no_limit_offset = re.sub(
            r"\s*(LIMIT\s+\d+(\s+OFFSET\s+\d+)?|OFFSET\s+\d+)", "", sql, flags=re.IGNORECASE
        ).strip().rstrip(';')
        print(sql_no_limit_offset)
        # Kiểm tra OFFSET trong câu SQL gốc
        offset_value = 0
        if offset == 0 and not force_offset:
            # Tìm OFFSET trong câu SQL gốc
            offset_pattern = re.compile(r"\s+OFFSET\s+(\d+)", re.IGNORECASE)
            offset_match = offset_pattern.search(sql)
            if offset_match:
                offset_value = int(offset_match.group(1))
        else:
            # Sử dụng offset được cung cấp
            offset_value = offset

        # Tạo câu SQL với LIMIT và OFFSET
        if offset_value > 0:
            limited_sql = f"{sql_no_limit_offset} LIMIT {max_limit} OFFSET {offset_value}"
        else:
            limited_sql = f"{sql_no_limit_offset} LIMIT {max_limit}"

        # Tạo câu truy vấn đếm tổng số hàng
        count_sql = f"SELECT COUNT(*) AS total FROM ({sql_no_limit_offset}) AS subquery;"
        
        # Tiêu thụ các tập kết quả còn sót lại trước khi thực thi
        while cursor.nextset():
            pass

        # Thực thi câu truy vấn đếm
        cursor.execute(count_sql)
        total_count = cursor.fetchone()[0]

        # Tiêu thụ các tập kết quả còn sót lại (nếu có)
        while cursor.nextset():
            pass

        # Thực thi câu truy vấn giới hạn
        cursor.execute(limited_sql)
        result = cursor.fetchall()
        description = cursor.description

        # Định dạng kết quả
        columns = ["No"] + [des[0] for des in description]
        rows = [
            [idx + 1 + offset_value] + list(row)
            for idx, row in enumerate(result)
        ]
        cursor.close()
        connection.close()
        return {
            "limited_sql_query": limited_sql + ';', 
            "total_count": total_count,
            "result": {
                "columns": columns,
                "rows": rows
            }
        }

    def get_key_store_by_user_id(self, user_id):
        connection = self.connection_pool.get_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT public_key FROM api_keys WHERE user_id = %s", (user_id,))
        result = cursor.fetchone()
        cursor.close()
        connection.close()
        return result

    def get_role_by_user_id(self, user_id):
        connection = self.connection_pool.get_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT r.name FROM users u JOIN user_roles ur ON u.user_id = ur.user_id JOIN roles r ON ur.role_id = r.role_id WHERE u.user_id = %s", (user_id,))
        result = cursor.fetchone()
        cursor.close()
        connection.close()
        return result
    
    def close(self):
        """Closes the database connection and cursor."""
        self.connection_pool.close()