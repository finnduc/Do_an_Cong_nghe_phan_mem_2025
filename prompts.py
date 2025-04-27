sql_prompt = """You are a SQL expert. Convert the following natural language question to SQL based on the schema below.
### SCHEMA:
CREATE TABLE categories (
    category_id CHAR(36) PRIMARY KEY DEFAULT (UUID()), 
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE manufacturers (
    manufacturer_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    product_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(100) NOT NULL UNIQUE, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE stock (
    stock_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    product_id CHAR(36) NOT NULL,
    stock_quantity INT NOT NULL CHECK (stock_quantity >= 0),
    manufacturer_id CHAR(36) NOT NULL,
    category_id CHAR(36),
    FOREIGN KEY (product_id) REFERENCES products (product_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (manufacturer_id) REFERENCES manufacturers (manufacturer_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories (category_id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE product_prices (
    price_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    stock_id CHAR(36) NOT NULL,
    price_type ENUM('import', 'export') NOT NULL,
    price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
    effective_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (stock_id) REFERENCES stock (stock_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE partners (
    partner_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(100) NOT NULL UNIQUE,
    partner_type ENUM('supplier', 'customer') NOT NULL,
    address TEXT,
    phone VARCHAR(15) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE employees (
    employee_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transactions (
    transaction_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    action ENUM('import', 'export') NOT NULL,
    stock_id CHAR(36) NOT NULL,
    partner_id CHAR(36) NOT NULL,
    employee_id CHAR(36) NOT NULL,
    price_per_unit DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (stock_id) REFERENCES stock (stock_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (partner_id) REFERENCES partners (partner_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (employee_id) REFERENCES employees (employee_id) ON DELETE CASCADE ON UPDATE CASCADE
);

### QUESTION:
{}

### RESPONSE:
{}
"""

validate_question_prompt="""You are an AI that classifies whether a question is related to the following database schema and allowed by the system:

# DATABASE SCHEMA:
- categories(category_id, name, created_at)
- manufacturers(manufacturer_id, name, created_at)
- products(product_id, name, created_at)
- stock(stock_id, product_id, stock_quantity, manufacturer_id, category_id)
- product_prices(price_id, stock_id, price_type, price, effective_date)
- partners(partner_id, name, partner_type, address, phone, email, created_at)
- employees(employee_id, name, email, phone, created_at)
- transactions(transaction_id, action, stock_id, partner_id, employee_id, price_per_unit, quantity, created_at)

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
- categories(category_id, name, created_at)
- manufacturers(manufacturer_id, name, created_at)
- products(product_id, name, created_at)
- stock(stock_id, product_id, stock_quantity, manufacturer_id, category_id)
- product_prices(price_id, stock_id, price_type, price, effective_date)
- partners(partner_id, name, partner_type, address, phone, email, created_at)
- employees(employee_id, name, email, phone, created_at)
- transactions(transaction_id, action, stock_id, partner_id, employee_id, price_per_unit, quantity, created_at)

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
- categories(category_id, name, created_at)
- manufacturers(manufacturer_id, name, created_at)
- products(product_id, name, created_at)
- stock(stock_id, product_id, stock_quantity, manufacturer_id, category_id)
- product_prices(price_id, stock_id, price_type, price, effective_date)
- partners(partner_id, name, partner_type, address, phone, email, created_at)
- employees(employee_id, name, email, phone, created_at)
- transactions(transaction_id, action, stock_id, partner_id, employee_id, price_per_unit, quantity, created_at)

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