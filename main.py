from fastapi import FastAPI, HTTPException, Depends, Header, Request, status
from config import llm_config
from sql_generator import SQLGenerator
from pydantic import BaseModel
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
import jwt
from typing import Annotated, Dict, Any
from mysql_database import MySQLDatabase
import dotenv
import os

dotenv.load_dotenv()

FORBIDDEN_TABLES = [
    "api_keys",
    "users",
    "user_roles",
    "roles",
    "resources",
    "role_permissions",
    "permissions",
]


def initialize_database():
    """Khởi tạo users và trả về instance MySQLDatabase với app_user."""
    admin_database_config = {
        "host": os.environ.get("DB_HOST"),
        "user": os.environ.get("DB_USER"),
        "database": os.environ.get("DB_NAME"),
        "password": os.environ.get("DB_PASSWORD"),
        "port": os.environ.get("DB_PORT") or 3306,
    }
    # Tạo users với tài khoản admin
    admin_db = MySQLDatabase(admin_database_config)
    result = admin_db.create_mysql_users()
    print(result)

    # Cấu hình cho app_user
    app_user_config = {
        "host": os.environ.get("DB_HOST"),
        "user": "app_user",
        "password": "secure_password",
        "database": os.environ.get("DB_NAME"),
        "port": os.environ.get("DB_PORT") or 3306,
    }

    # Khởi tạo instance MySQLDatabase với app_user
    return MySQLDatabase(app_user_config), admin_db


def is_restricted_query(query: str) -> bool:
    query_lower = query.lower().strip()

    # Kiểm tra bảng cấm
    for table in FORBIDDEN_TABLES:
        if table in query_lower:
            return True

    # Ngăn chặn các từ khóa nguy hiểm
    dangerous_keywords = [
        "drop ",
        "delete ",
        "update ",
        "insert ",
        "alter ",
        "truncate",
    ]
    for keyword in dangerous_keywords:
        if keyword in query_lower:
            return True

    return False


retricted_database, database = initialize_database()

sql_generator = SQLGenerator(llm_config, retricted_database).build()


HEADER_CLIENT_ID = "x-client-id"
HEADER_AUTHORIZATION = "authorization"


def verify_token(
    user_id: Annotated[
        str | None, Header(alias=HEADER_CLIENT_ID, description="User ID của client")
    ] = None,
    access_token_header: Annotated[
        str | None,
        Header(alias=HEADER_AUTHORIZATION, description="Bearer Access Token"),
    ] = None,
) -> Dict[str, Any]:
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Missing required header: {HEADER_CLIENT_ID}",
        )

    if access_token_header is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Missing required header: {HEADER_AUTHORIZATION}",
        )

    token_parts = access_token_header.split()
    if len(token_parts) != 2 or token_parts[0].lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Authorization header format. Use 'Bearer <token>'.",
        )
    access_token = token_parts[1]

    key_store = database.get_key_store_by_user_id(user_id)

    if not key_store or not key_store.get("public_key"):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User key information not found. Cannot verify token.",
        )

    public_key = key_store["public_key"]

    try:
        # PyJWT decode
        payload = jwt.decode(
            access_token,
            public_key,
            algorithms=["RS256"],  # đảm bảo đúng thuật toán
            options={
                "verify_exp": True
            },  # Mặc định là verify_exp=True rồi, nhưng ghi rõ ra
        )

        print(payload)

        token_user_id: str = payload.get("ID")
        if not token_user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload: Missing user identifier.",
            )

        if token_user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Invalid user credentials.",
            )

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Access token has expired."
        )
    except jwt.InvalidTokenError as e:
        # PyJWT chỉ có 1 nhóm lỗi chính là InvalidTokenError, nó bao hết các lỗi (DecodeError, InvalidSignatureError,...)
        print(f"JWT Verification Error for user {user_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials. Invalid token.",
        )
    except Exception as e:
        print(f"Unexpected error during authentication for user {user_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An internal server error occurred during authentication.",
        )

    user_role = database.get_role_by_user_id(user_id)
    if not user_role or user_role.get("name") == "employee":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to access this resource.",
        )

    return {"user_id": user_id, "payload": payload, "key_store": key_store}


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield  # This is where the app runs
    print("Closing database connection...")
    retricted_database.close()
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
    offset: int = 0
    force_offset: bool = False


@app.post("/question")
async def get_data(
    question_request: QuestionRequest,
    current_user_info: Annotated[Dict[str, Any], Depends(verify_token)],
):
    try:
        result = sql_generator.invoke(
            {"question": question_request.question, "max_retries": 2}
        )
        print(result)
        return {
            "detail": "success",
            "data": result["received_data"],
        }
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/execute")
async def execute(
    sql_request: SQLRequest,
    current_user_info: Annotated[Dict[str, Any], Depends(verify_token)],
):
    if is_restricted_query(sql_request.sql):
        raise HTTPException(status_code=400, detail="Restricted query")
    try:
        result = retricted_database.execute_limited_query(
            sql_request.sql, sql_request.offset, sql_request.force_offset
        )
        return {"detail": "success", "data": result}
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail=str(e))
