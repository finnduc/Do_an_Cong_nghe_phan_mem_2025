import os
import dotenv

dotenv.load_dotenv()

llm_config = {
    "model": "google/gemini-2.0-flash-lite-preview-02-05:free",
    "api_key": os.environ.get("LLM_API_KEY"),
    "base_url": os.environ.get("LLM_BASE_URL"),
}

database_config = {
    "host": os.environ.get("DB_HOST"),
    "user": os.environ.get("DB_USER"),
    "database": os.environ.get("DB_NAME"),
    "password": os.environ.get("DB_PASSWORD"),
    "port": os.environ.get("DB_PORT"),
}
