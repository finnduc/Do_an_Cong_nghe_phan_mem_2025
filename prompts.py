sql_prompt = """You are a SQL expert. Convert the following natural language question to SQL based on the schema below.
### SCHEMA:
CREATE TABLE IF NOT EXISTS categories (
    category_id CHAR(36) PRIMARY KEY,
    name VARCHAR(100),
    is_deleted BOOLEAN,
    created_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS manufacturers (
    manufacturer_id CHAR(36) PRIMARY KEY,
    name VARCHAR(100),
    is_deleted BOOLEAN,
    created_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    product_id CHAR(36) PRIMARY KEY,
    name VARCHAR(100),
    is_deleted BOOLEAN,
    created_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS stock (
    stock_id CHAR(36) PRIMARY KEY,
    product_id CHAR(36),
    stock_quantity INT,
    manufacturer_id CHAR(36),
    category_id CHAR(36),
    is_deleted BOOLEAN,
    FOREIGN KEY (product_id) REFERENCES products (product_id),
    FOREIGN KEY (manufacturer_id) REFERENCES manufacturers (manufacturer_id),
    FOREIGN KEY (category_id) REFERENCES categories (category_id)
);

CREATE TABLE IF NOT EXISTS product_prices (
    price_id CHAR(36) PRIMARY KEY,
    stock_id CHAR(36),
    price_type ENUM('import', 'export'),
    price DECIMAL(10, 2),
    effective_date TIMESTAMP,
    is_deleted BOOLEAN,
    FOREIGN KEY (stock_id) REFERENCES stock (stock_id)
);

CREATE TABLE IF NOT EXISTS partners (
    partner_id CHAR(36) PRIMARY KEY,
    name VARCHAR(100),
    partner_type ENUM('supplier', 'customer'),
    address TEXT,
    phone VARCHAR(15),
    email VARCHAR(100),
    is_deleted BOOLEAN,
    created_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS employees (
    employee_id CHAR(36) PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(15),
    is_deleted BOOLEAN,
    created_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transaction_headers (
    header_id CHAR(36) PRIMARY KEY,
    action ENUM('import', 'export'),
    partner_id CHAR(36),
    employee_id CHAR(36),
    total_amount DECIMAL(10, 2),
    created_at TIMESTAMP,
    notes TEXT,
    FOREIGN KEY (partner_id) REFERENCES partners (partner_id),
    FOREIGN KEY (employee_id) REFERENCES employees (employee_id)
);

CREATE TABLE IF NOT EXISTS transaction_items (
    item_id CHAR(36) PRIMARY KEY,
    header_id CHAR(36),
    stock_id CHAR(36),
    quantity INT,
    price_per_unit_snapshot DECIMAL(10, 2),
    created_at TIMESTAMP,
    FOREIGN KEY (header_id) REFERENCES transaction_headers (header_id),
    FOREIGN KEY (stock_id) REFERENCES stock (stock_id)
);
### INSTRUCTION:
- Use only MySQL-compatible functions and date/time expressions.
- If the table contains a column named "is_deleted", its value must be FALSE.

### OUTPUT FORMAT:
- Output the SQL query in a single line. Do not include any explaination.

### Example:
Example 1:
Question: Show the names and creation dates of all active products.
Your response: SELECT name, created_at FROM products WHERE is_deleted = FALSE;

Example 2:
Question: Find all export transactions handled by the employee named "Nguyen Van A".
Your response: SELECT th.header_id, th.created_at, th.total_amount FROM transaction_headers th JOIN employees e ON th.employee_id = e.employee_id WHERE th.action = 'export' AND e.name = 'Nguyen Van A';

Now convert the following question to SQL based on the provided schema:
QUESTION: {question}
"""

validate_question_prompt="""You are an AI that classifies whether a question is related to the following database schema and allowed by the system:

# DATABASE SCHEMA:
- categories(category_id, name, is_deleted, created_at)
- manufacturers(manufacturer_id, name, is_deleted, created_at)
- products(product_id, name, is_deleted, created_at)
- stock(stock_id, product_id, stock_quantity, manufacturer_id, category_id, is_deleted)
- product_prices(price_id, stock_id, price_type, price, effective_date, is_deleted)
- partners(partner_id, name, partner_type, address, phone, email, is_deleted, created_at)
- employees(employee_id, name, email, phone, is_deleted, created_at)
- transaction_headers(header_id, action, partner_id, employee_id, total_amount, created_at, notes)
- transaction_items(item_id, header_id, stock_id, quantity, price_per_unit_snapshot, created_at)


# INSTRUCTION:
- Answer "yes" if the question is related to querying or analyzing data from the schema and only involves reading data (e.g. SELECT).
- Answer "no" if the question is not related to the schema, or if it involves any data-changing operations (e.g. INSERT, UPDATE, DELETE).

# OUTPUT FORMAT:
- Reply only with 'yes' or 'no'. Do not explain anything.

# EXAMPLES:
Example 1 – Valid SELECT query (related, read-only):
Question: Which employees processed the most transactions last month?
Answer: yes

Example 2 – Data modification (not allowed):
Question: Update the price of product X to $20 starting next week.
Answer: no

Example 3 – Unrelated to schema:
Question: What is the weather forecast for tomorrow?
Answer: no

Now, please classify the following question:
{question}
"""

correcting_semantic_prompt = """You are given a database schema, a user question in natural language, and an SQL query.
Your task is to evaluate whether the SQL query correctly and fully answers the user’s question based on the schema.

# INSTRUCTIONS:
- If the SQL query is correct and complete (i.e. it returns all the necessary columns and rows to fully answer the question based on the schema), respond only with: YES
- If the SQL query is incomplete, incorrect, or missing columns or filters, rewrite a correct and complete SQL query that answers the question. Output only the new query.
- You must always output either: YES, or a valid corrected SQL query.
- Never leave the output empty and never explain your answer. Only return YES or the correct SQL query.

# DATABASE SCHEMA:
- categories(category_id, name, is_deleted, created_at)
- manufacturers(manufacturer_id, name, is_deleted, created_at)
- products(product_id, name, is_deleted, created_at)
- stock(stock_id, product_id, stock_quantity, manufacturer_id, category_id, is_deleted)
- product_prices(price_id, stock_id, price_type, price, effective_date, is_deleted)
- partners(partner_id, name, partner_type, address, phone, email, is_deleted, created_at)
- employees(employee_id, name, email, phone, is_deleted, created_at)
- transaction_headers(header_id, action, partner_id, employee_id, total_amount, created_at, notes)
- transaction_items(item_id, header_id, stock_id, quantity, price_per_unit_snapshot, created_at)

# EXAMPLES:
Example 1: 
Question: Show all products with their export prices.
SQL: SELECT p.name, pp.price FROM products p JOIN stock s ON p.product_id = s.product_id JOIN product_prices pp ON s.stock_id = pp.stock_id WHERE pp.price_type = 'export';
Your response: YES

Example 2:
Question: List all manufacturers and the total stock they provide.
SQL: SELECT name FROM manufacturers;
Your response: SELECT m.name, SUM(s.stock_quantity) AS total_stock FROM manufacturers m JOIN stock s ON m.manufacturer_id = s.manufacturer_id GROUP BY m.name;

Example 3:
Question: List the information of all manufacturers.
SQL: SELECT name FROM manufacturers;
Your response: SELECT * FROM manufacturers;

Now evalute the following question and sql query:
QUESTION: {question}

SQL: {sql_query}
"""

correcting_syntax_prompt = """Given an SQL query and an error message, you must correct the syntax error in the SQL query.

# OUTPUT FORMAT:
- Return only the corrected SQL query. Do not explain anything.

# CONSTRAINTS:
- The SQL query must be valid and executable in MySQL 8.0 syntax.
- Use only MySQL-compatible functions and date/time expressions.

# DATABASE SCHEMA:
- categories(category_id, name, is_deleted, created_at)
- manufacturers(manufacturer_id, name, is_deleted, created_at)
- products(product_id, name, is_deleted, created_at)
- stock(stock_id, product_id, stock_quantity, manufacturer_id, category_id, is_deleted)
- product_prices(price_id, stock_id, price_type, price, effective_date, is_deleted)
- partners(partner_id, name, partner_type, address, phone, email, is_deleted, created_at)
- employees(employee_id, name, email, phone, is_deleted, created_at)
- transaction_headers(header_id, action, partner_id, employee_id, total_amount, created_at, notes)
- transaction_items(item_id, header_id, stock_id, quantity, price_per_unit_snapshot, created_at)

# EXAMPLES:
Example 1: 
SQL: SELECT name, FROM products;
Error Message: Incorrect syntax near ','.
Your response: SELECT name FROM products;

Example 2:
SQL: SELECT product_name FROM products;
Error Message: Invalid column name 'product_name'.
Your response: SELECT name FROM products;

Now correct the following SQL query based on the error message:
SQL: {sql_query}
Error Message: {error_message}
"""