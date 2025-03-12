from fastapi import FastAPI, HTTPException
from config import llm_config, database_config
from sql_generator import SQLGenerator
from pydantic import BaseModel
from contextlib import asynccontextmanager

sql_generator = SQLGenerator(llm_config, database_config).build()

app = FastAPI()

class QuestionRequest(BaseModel):
    question: str
    
class SQLRequest(BaseModel):
    sql: str

@app.post("/question/")
async def get_data(question_request: QuestionRequest):
    try:
        result = sql_generator.invoke({
            'question': question_request.question,
            'max_retries': 2
        })
        return {
            'detail': 'success',
            'data': result['received_data'],
            'sql_statement': result['sql_statement']
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/execute")
async def execute(sql_request: SQLRequest):
    result = sql_generator.database.execute_query(sql_request.query)
    return {'detail': result}
    
    

