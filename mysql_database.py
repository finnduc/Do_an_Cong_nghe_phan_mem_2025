import mysql.connector


class MySQLDatabase:
    def __init__(self, config: dict):
        """
        Initializes the MySQLDatabase instance.

        Args:
            config (dict): A dictionary containing MySQL connection parameters such as
                        host, user, password, and database name.

        Establishes a connection to the MySQL database using the provided configuration
        and initializes a cursor for executing queries.
        """

        self.connection = mysql.connector.connect(**config)
        self.cursor = self.connection.cursor()

    def execute_query(self, query):
        """
        Executes a given SQL query using the established database connection.

        Args:
            query (str): The SQL query to be executed.

        Returns:
            dict: A dictionary containing a 'detail' key with a value of 'success' if the query
            executes successfully, or an error message if an exception occurs.
        """
        try:
            self.cursor.execute(query)
            return {"detail": "success"}
        except Exception as e:
            return {"detail": str(e)}

    def get_query_result(self):
        """
        Retrieves the result of the previously executed query.

        Returns:
            dict: A dictionary containing the column names as keys and a list of rows as values.
        """
        return {
            "columns": [des[0] for des in self.cursor.description],
            "rows": self.cursor.fetchall(),
        }

    def close(self):
        """
        Closes the database connection and cursor.

        """
        self.cursor.close()
        self.connection.close()
