import os
import dotenv

dotenv.load_dotenv()

llm_config = {
    "model": "gemini-2.0-flash",
    "api_key": os.environ.get("GOOGLE_API_KEY"),
    'temperature': 0
}


