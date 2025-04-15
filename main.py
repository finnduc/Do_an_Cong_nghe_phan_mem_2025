from fastapi import FastAPI, HTTPException
from config import llm_config, database_config
from sql_generator import SQLGenerator
from pydantic import BaseModel
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware


def is_restricted_query(user_query: str) -> bool:
    restricted_keywords = {"UPDATE", "DELETE", "INSERT", "DROP", "ALTER", "TRUNCATE"}

    # Chuyển câu truy vấn về chữ hoa và tách thành các từ
    words = set(user_query.upper().split())

    # Kiểm tra xem có từ khóa bị cấm không
    return any(word in words for word in restricted_keywords)


sql_generator, database = SQLGenerator(llm_config, database_config).build()


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield  # This is where the app runs
    print("Closing database connection...")
    database.close()


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4000"],  # Specific frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)


class QuestionRequest(BaseModel):
    question: str


class SQLRequest(BaseModel):
    sql: str


@app.post("/question/")
async def get_data(question_request: QuestionRequest):
    try:
        result = sql_generator.invoke(
            {"question": question_request.question, "max_retries": 2}
        )
        return {
            "detail": "success",
            "data": result["received_data"],
            "sql_query": result["sql_query"],
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/execute")
async def execute(sql_request: SQLRequest):
    if is_restricted_query(sql_request.sql):
        raise HTTPException(status_code=400, detail="Only select queries are allowed")
    try:
        database.execute_query(sql_request.sql)
        result = database.get_query_result()
        return {"detail": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
