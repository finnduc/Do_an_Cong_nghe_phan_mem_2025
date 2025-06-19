import os
import mysql.connector
from mysql.connector.pooling import MySQLConnectionPool
import re

class MySQLDatabase:
    def __init__(self, config: dict):
        """Initializes the MySQLDatabase instance.

        Args:
            config (dict): A dictionary containing optional MySQL connection parameters.
        """
        self.config = config
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
        Creates MySQL user: app_user (for T2SQL).
        - app_user: SELECT on non-sensitive tables (categories, stock, etc.).
        
        Returns:
            dict: Status of user creation and permission granting.
        """
        connection = self.connection_pool.get_connection()
        cursor = connection.cursor()
        
        try:
            # Lấy mật khẩu từ biến môi trường
            app_user_password = os.environ.get("DB_APP_USER_PASSWORD")
            db_host = os.environ.get("DB_HOST")
            user_host = '%' if db_host != "localhost" else 'localhost'
            if not app_user_password:
                raise ValueError("DB_APP_USER_PASSWORD environment variable is not set")
            
            # Tạo app_user với host '%'
            cursor.execute(f"""
                CREATE USER IF NOT EXISTS 'app_user'@'{user_host}' IDENTIFIED BY %s;
            """, (app_user_password,))
            
            # Cấp quyền SELECT cho app_user trên các bảng không nhạy cảm
            non_sensitive_tables = [
                'categories', 'manufacturers', 'products', 'stock', 'product_prices',
                'partners', 'employees', 'transaction_headers', 'transaction_items', 'parameters'
            ]
            for table in non_sensitive_tables:
                cursor.execute(f"""
                    GRANT SELECT ON {self.config.get('database')}.{table} TO 'app_user'@'{user_host}';
                """)
            
            # Áp dụng quyền
            cursor.execute("FLUSH PRIVILEGES;")
            
            return {
                "status": "success",
                "message": "User app_user created with appropriate permissions."
            }
        except mysql.connector.Error as e:
            return {
                "status": "error",
                "message": f"Failed to create users: {str(e)}"
            }
        except ValueError as e:
            return {
                "status": "error",
                "message": str(e)
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
        default_max_limit = 8 # Đặt giới hạn mặc định mong muốn

        # Bước 1: Trích xuất LIMIT và OFFSET gốc từ câu SQL
        original_limit = None
        original_offset = 0

        # Tìm LIMIT
        limit_pattern = re.compile(r"\s+LIMIT\s+(\d+)", re.IGNORECASE)
        limit_match = limit_pattern.search(sql)
        if limit_match:
            original_limit = int(limit_match.group(1))

        # Tìm OFFSET (có thể đi kèm LIMIT hoặc đứng riêng)
        offset_pattern = re.compile(r"\s+OFFSET\s+(\d+)", re.IGNORECASE)
        offset_match = offset_pattern.search(sql)
        if offset_match:
            original_offset = int(offset_match.group(1))

        # Bước 2: Loại bỏ mọi LIMIT và OFFSET hiện có trong câu SQL gốc để tạo base query
        sql_no_limit_offset = re.sub(
            r"\s*(LIMIT\s+\d+(\s+OFFSET\s+\d+)?|OFFSET\s+\d+)", "", sql, flags=re.IGNORECASE
        ).strip().rstrip(';')

        # Bước 3: Quyết định LIMIT cuối cùng sẽ áp dụng
        final_limit = default_max_limit # Mặc định là 8

        if original_limit is not None and original_limit < default_max_limit:
            final_limit = original_limit # Giữ nguyên LIMIT gốc nếu nó nhỏ hơn 8

        # Bước 4: Quyết định OFFSET cuối cùng sẽ áp dụng
        final_offset = 0
        if offset == 0 and not force_offset:
            # Nếu offset truyền vào là 0 và không ép buộc offset, sử dụng offset gốc
            final_offset = original_offset
        else:
            # Sử dụng offset được cung cấp từ tham số hàm
            final_offset = offset

        # Bước 5: Tạo câu SQL với LIMIT và OFFSET cuối cùng
        if final_offset > 0:
            limited_sql = f"{sql_no_limit_offset} LIMIT {final_limit} OFFSET {final_offset}"
        else:
            limited_sql = f"{sql_no_limit_offset} LIMIT {final_limit}"

        # Tạo câu truy vấn đếm tổng số hàng
        count_sql = f"SELECT COUNT(*) AS total FROM ({sql_no_limit_offset}) AS subquery;"

        try:
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
            column_names = [des[0] for des in description]

            # Tìm index của cột 'is_deleted', nếu có
            try:
                is_delete_idx = column_names.index('is_deleted')
            except ValueError:
                is_delete_idx = None

            # Tạo danh sách cột, bỏ qua 'is_delete' nếu tồn tại
            columns = ["No"] + [
                name for idx, name in enumerate(column_names) if idx != is_delete_idx
            ]

            # Tạo hàng dữ liệu, loại bỏ dữ liệu ở vị trí 'is_delete' nếu tồn tại
            rows = [
                [idx + 1 + final_offset] + [
                    col for i, col in enumerate(row) if i != is_delete_idx
                ]
                for idx, row in enumerate(result)
            ]
            
            return {
                "limited_sql_query": limited_sql + ';', 
                "total_count": total_count,
                "result": {
                    "columns": columns,
                    "rows": rows
                }
            }
        except Exception as e:
            print(f"Error executing query: {e}")
            return None

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