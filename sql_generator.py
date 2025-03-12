from unsloth import FastLanguageModel
from langchain_core.prompts import ChatPromptTemplate
from typing_extensions import TypedDict, Literal
from pydantic import BaseModel, Field
from langchain_openai import ChatOpenAI
from mysql_database import MySQLDatabase
from langgraph.graph import StateGraph, START, END
from prompts import sql_prompt, transform_question_prompt, validate_question_prompt


class ValidateResult(BaseModel):
    """The validation result if the question is relevant to the provided schema"""

    result: Literal["yes", "no"] = Field(
        description="Whether the question is relevant to the schema, yes or no only"
    )


class State(TypedDict):
    question: str
    received_data: dict
    sql_statement: str
    max_retries: int


class SQLGenerator:
    def __init__(self, llm_config: dict, database_config: dict):
        """
        Constructor for SQLGenerator

        Args:
            llm_config (dict): Configuration for the OpenAI API
            database_config (dict): Configuration for the MySQL Database

        Returns:
            None
        """
        model, tokenizer = FastLanguageModel.from_pretrained(
            model_name="gianghp/Qwen2.5Coder-0.5B-Instruct-T2SQL-ttcs",
            max_seq_length=2048,
            dtype=None,
            load_in_4bit=False,
        )
        FastLanguageModel.for_inference(model)
        self.model = model
        self.tokenizer = tokenizer
        self.llm = ChatOpenAI(**llm_config)
        self.database = MySQLDatabase(**database_config)

    def validate_question(self, state: State):
        question = state["question"]
        examples = f"""Example 1: 
        Human: List all employees who made a transaction.
        Your response: {ValidateResult(result='yes').model_dump_json()}
        
        Example 2:
        Human: List all products whose export price has increased compared to last month, and include the percentage increase for each product.
        Your response: {ValidateResult(result='yes').model_dump_json()}
        
        Example 3:
        Human: What's the weather today?
        Your response: {ValidateResult(result='no').model_dump_json()}
        
        Example 4:
        Human: What is best seller product at market ABC?
        Your response: {ValidateResult(result='no').model_dump_json()}
        """

        prompt = ChatPromptTemplate.from_messages(
            {
                ("human", validate_question_prompt),
            }
        )
        chain = prompt | self.llm.with_structured_output(
            ValidateResult, method="json_mode"
        )
        result = chain.invoke({"examples": examples, "question": question})
        if "yes" in result.result:
            return "Continue"
        else:
            return "Early stopping"

    def generate_sql(self, state: State):
        question = state["question"]
        inputs = self.tokenizer(
            [sql_prompt.format(question, "")], return_tensors="pt"
        ).to("cuda")
        input_ids = inputs.input_ids  # Lấy token IDs của prompt
        # Generate response từ model
        output_ids = self.model.generate(
            input_ids,
            max_new_tokens=256,
            eos_token_id=self.tokenizer.eos_token_id,
            do_sample=False,
        )
        # Loại bỏ phần prompt khỏi output để chỉ lấy phần response
        response_ids = output_ids[:, input_ids.shape[1] :]  # Cắt bỏ token đầu vào
        # Giải mã phần response thành text
        sql_text = self.tokenizer.decode(response_ids[0], skip_special_tokens=True)
        sql_text = sql_text.replace("<|im_end|>", "").strip()
        return {"sql_statement": sql_text}

    def execute_sql(self, state: State):
        sql_statement = state["sql_statement"]
        result = self.database.execute_query(sql_statement)
        if result["detail"] == "success":
            return "Execution successful"
        elif state["max_retries"] <= 0:
            return "Exceed max retries"
        else:
            return "Execution failed"

    def get_result(self, state: State):
        return {"received_data": self.database.get_query_result()}

    def failed(self, state: State):
        return {
            "received_data": "Please rewrite your question to be clearer and improve clarity. Also check again if your question is related to the database.",
            'sql_statement': 'None'
        }

    def transform_question(self, state: State):
        question = state["question"]
        prompt = ChatPromptTemplate.from_messages(
            {
                ("human", transform_question_prompt),
            }
        )
        chain = prompt | self.llm
        result = chain.invoke({"question": question})
        return {"question": result.content, "max_retries": state["max_retries"] - 1}

    def build(self):
        """
        Build the workflow for generating SQL from natural language input.

        The workflow consists of the following nodes:

        - `generate_sql`: Generate a SQL statement from the input question.
        - `transform_question`: Transform the question into a clearer form.
        - `get_result`: Execute the SQL statement and return the result.
        - `failed`: Return an error message if the SQL statement fails to execute.

        The edges between the nodes are:

        - `START` -> `validate_question` -> `generate_sql` or `failed`
        - `generate_sql` -> `execute_sql` -> `get_result` or `transform_question` or `failed`
        - `transform_question` -> `generate_sql`
        - `get_result` -> `END`
        - `failed` -> `END`

        Returns:
            The compiled workflow app.
        """
        workflow = StateGraph(state_schema=State)
        workflow.add_node("generate_sql", self.generate_sql)
        workflow.add_node("transform_question", self.transform_question)
        workflow.add_node("get_result", self.get_result)
        workflow.add_node("failed", self.failed)
        workflow.add_conditional_edges(
            START,
            self.validate_question,
            {"Continue": "generate_sql", "Early stopping": "failed"},
        )
        workflow.add_conditional_edges(
            "generate_sql",
            self.execute_sql,
            {
                "Execution successful": "get_result",
                "Exceed max retries": "failed",
                "Execution failed": "transform_question",
            },
        )
        workflow.add_edge("transform_question", "generate_sql")
        workflow.add_edge("get_result", END)
        workflow.add_edge("failed", END)
        app = workflow.compile()
        return app
