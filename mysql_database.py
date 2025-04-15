import mysql.connector


class MySQLDatabase:
    def __init__(self, config: dict):
        """Initializes the MySQLDatabase instance.

        Args:
            config (dict): A dictionary containing optional MySQL connection parameters.
        """
        self.connection = mysql.connector.connect(
            host=config.get("host", "localhost"),
            user=config.get("user", "root"),
            password=config.get("password", ""),
            database=config.get("database", None),
            port=config.get("port", 3306),
        )
        self.cursor = self.connection.cursor()

    def execute_query(self, query):
        """Executes a given SQL query using the established database connection.

        Args:
            query (str): The SQL query to be executed.

        Returns:
            None
        """
        self.cursor.execute(query)
        columns = [
            des[0] for des in self.cursor.description if "id" not in des[0].lower()
        ]
        rows = [
            [
                value
                for idx, value in enumerate(row)
                if "id" not in self.cursor.description[idx][0].lower()
            ]
            for row in self.cursor.fetchall()
        ]
        return {
            "columns": columns,
            "rows": rows,
        }

    def close(self):
        """Closes the database connection and cursor."""
        self.cursor.close()
        self.connection.close()
