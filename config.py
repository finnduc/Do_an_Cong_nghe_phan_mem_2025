import os
import dotenv

dotenv.load_dotenv()

llm_config = {
    "model": "gemini-2.0-flash",
    "api_key": os.environ.get("GOOGLE_API_KEY"),
}

database_config = {
    "host": os.environ.get("DB_HOST"),
    "user": os.environ.get("DB_USER"),
    "database": os.environ.get("DB_NAME"),
    "password": os.environ.get("DB_PASSWORD"),
    "port": os.environ.get("DB_PORT") or 3306,
}
