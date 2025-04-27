from langchain_core.prompts import ChatPromptTemplate
from typing_extensions import TypedDict, Literal
from mysql_database import MySQLDatabase
from langgraph.types import Command
from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.graph import StateGraph, START, END
from prompts import (
    sql_prompt,
    validate_question_prompt,
    correcting_semantic_prompt,
    correcting_syntax_prompt,
)
from load_model import model, tokenizer
import re


def extract_select_sql(text: str) -> str:
    """
    Extract the first SELECT SQL statement from the text.
    Handles SQL code blocks (```sql ... ```) or plain text.
    Ensures the statement ends with a semicolon.
    """
    # 1. Check if inside markdown ```sql ... ``` block
    code_block_match = re.search(r"```sql\s+(SELECT[\s\S]+?)```", text, re.IGNORECASE)
    if code_block_match:
        sql = code_block_match.group(1).strip()
    else:
        # 2. Fallback to plain text: match from SELECT until next keyword or end
        match = re.search(r"\bSELECT\b[\s\S]+?(?=(?:\bWITH\b|\bSELECT\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b|$))", text, re.IGNORECASE)
        if match:
            sql = match.group(0).strip()
        else:
            return ""

    # 3. Ensure it ends with a semicolon
    if not sql.endswith(";"):
        sql += ";"

    return sql

class State(TypedDict):
    question: str
    received_data: dict
    sql_query: str
    max_retries: int
    error_message: str

class SQLGenerator:
    def __init__(self, llm_config: dict, database):
        """
        Constructor for SQLGenerator

        Args:
            llm_config (dict): Configuration for the OpenAI API
            database_config (dict): Configuration for the MySQL Database

        Returns:
            None
        """
        self.model = model
        self.tokenizer = tokenizer
        self.llm = ChatGoogleGenerativeAI(**llm_config)
        self.database = database
    def validate_question(self, state: State) -> Command[Literal[END, "generate_sql"]]:  # type: ignore
        question = state["question"]

        prompt = ChatPromptTemplate.from_messages(
            {
                ("human", validate_question_prompt),
            }
        )
        chain = prompt | self.llm
        result = chain.invoke({"question": question})
        if "yes" in result.content:
            return Command(goto="generate_sql")
        else:
            return Command(
                update={
                    "received_data": "Please rewrite your question to be clearer and improve clarity. Also check again if your question is related to the database."
                },
                goto=END,
            )

    def generate_sql(self, state: State):
        question = state["question"]
        inputs = self.tokenizer(
            [sql_prompt.format(question, "")], return_tensors="pt"
        ).to("cuda")
        input_ids = inputs.input_ids  # Lấy token IDs của prompt
        attention_mask = inputs.attention_mask # Lấy attention mask của prompt
        # Generate response từ model
        output_ids = self.model.generate(
            input_ids,
            attention_mask=attention_mask,
            max_new_tokens=256,
            eos_token_id=self.tokenizer.eos_token_id,
            do_sample=False,
        )
        # Loại bỏ phần prompt khỏi output để chỉ lấy phần response
        response_ids = output_ids[:, input_ids.shape[1] :]  # Cắt bỏ token đầu vào
        # Giải mã phần response thành text
        sql_text = self.tokenizer.decode(response_ids[0], skip_special_tokens=True)
        sql_text = sql_text.replace("<|im_end|>", "").strip()
        return {"sql_query": sql_text}

    def correcting_semantic(self, state: State) -> Command[Literal[END, "adjust_limit_and_execute_sql"]]:  # type: ignore
        sql_query = state["sql_query"]
        question = state["question"]
        prompt = ChatPromptTemplate.from_messages(
            {
                (
                    "human",
                    correcting_semantic_prompt,
                ),
            }
        )
        chain = prompt | self.llm
        max_retries = 3
        while max_retries > 0:
            result = chain.invoke({"sql_query": sql_query, "question": question})
            if "yes" in result.content.lower():
                return Command(update={"sql_query": sql_query}, goto="adjust_limit_and_execute_sql")
            sql_query = extract_select_sql(result.content)
            max_retries -= 1
        return Command(
            update={
                "received_data": "Please rewrite your question to be clearer and improve clarity. Also check again if your question is related to the database."
            },
            goto=END,
        )

    def correcting_syntax(self, state: State):
        sql_query = state["sql_query"]
        error_message = state["error_message"]
        prompt = ChatPromptTemplate.from_messages(
            {
                (
                    "human",
                    correcting_syntax_prompt,
                ),
            }
        )
        chain = prompt | self.llm
        result = chain.invoke({"sql_query": sql_query, "error_message": error_message})
        return {
            "sql_query": extract_select_sql(result.content),
            "max_retries": state["max_retries"] - 1,
        }

    def adjust_limit_and_execute_sql(self, state: State) -> Command[Literal[END, "correcting_syntax"]]:  # type: ignore
        if state["max_retries"] <= 0:
            return Command(
                update={
                    "sql_query": "",
                    "received_data": "Please rewrite your question to be clearer and improve clarity. Also check again if your question is related to the database.",
                },
                goto=END,
            )
        sql_query = state["sql_query"]
        try:
            data = self.database.execute_limited_query(sql_query)
            return Command(update={"received_data": data}, goto=END)
        except Exception as e:
            return Command(update={"error_message": str(e)}, goto="correcting_syntax")

    def build(self):
        """
        Build a Text2SQL workflow.

        The workflow is defined by the following nodes and edges:

        - validate_question: Validate the user's question and filter out unsupported queries.
        - generate_sql: Generate an SQL query from the user's question.
        - execute_sql: Execute the SQL query and return the result to the user.
        - correcting_syntax: Correct the syntax errors in the SQL query.
        - correcting_semantic: Correct the semantic errors in the SQL query.

        The edges are:

        - START -> validate_question
        - validate_question -> generate_sql
        - generate_sql -> correcting_semantic
        - correcting_semantic -> execute_sql
        - correcting_syntax -> execute_sql

        Returns a tuple of (app, database), where app is the compiled workflow and database is the MySQL database connection.
        """
        workflow = StateGraph(state_schema=State)
        workflow.add_node("validate_question", self.validate_question)
        workflow.add_node("generate_sql", self.generate_sql)
        workflow.add_node("adjust_limit_and_execute_sql", self.adjust_limit_and_execute_sql)
        workflow.add_node("correcting_syntax", self.correcting_syntax)
        workflow.add_node("correcting_semantic", self.correcting_semantic)
        workflow.add_edge(START, "validate_question")
        workflow.add_edge(
            "generate_sql",
            "correcting_semantic",
        )
        workflow.add_edge("correcting_syntax", "adjust_limit_and_execute_sql")
        app = workflow.compile()
        return app
