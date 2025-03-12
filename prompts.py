sql_prompt = """You are a SQL expert. Convert the following natural language question to SQL based on the schema below.
### SCHEMA:
CREATE TABLE categories (
    category_id CHAR(36) PRIMARY KEY DEFAULT (UUID ()),
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE products (
    product_id CHAR(36) PRIMARY KEY DEFAULT (UUID ()),
    name VARCHAR(100) NOT NULL,
    stock_quantity INT NOT NULL CHECK (stock_quantity >= 0),
    manufacturer VARCHAR(100) NOT NULL,
    category_id CHAR(36) NULL,
    FOREIGN KEY (category_id) REFERENCES categories (category_id) ON DELETE SET NULL ON UPDATE CASCADE,
    UNIQUE (name, manufacturer)
);
CREATE TABLE product_prices (
    price_id CHAR(36) PRIMARY KEY DEFAULT (UUID ()),
    product_id CHAR(36) NOT NULL,
    price_type ENUM ('import', 'export') NOT NULL,
    price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
    effective_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products (product_id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE partners (
    partner_id CHAR(36) PRIMARY KEY DEFAULT (UUID ()),
    name VARCHAR(100) NOT NULL UNIQUE,
    partner_type ENUM ('supplier', 'customer') NOT NULL,
    address TEXT,
    phone VARCHAR(15) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE employees (
    employee_id CHAR(36) PRIMARY KEY DEFAULT (UUID ()),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id CHAR(36) UNIQUE,
    FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE TABLE transactions (
    transaction_id CHAR(36) PRIMARY KEY DEFAULT (UUID ()),
    action ENUM ('import', 'export') NOT NULL,
    product_id CHAR(36) NOT NULL,
    partner_id CHAR(36) NOT NULL,
    employee_id CHAR(36) NOT NULL,
    price_per_unit DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products (product_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (partner_id) REFERENCES partners (partner_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (employee_id) REFERENCES employees (employee_id) ON DELETE CASCADE ON UPDATE CASCADE
);

### QUESTION:
{}

### RESPONSE:
{}
"""

validate_question_prompt="""You are an AI that classifies if a question is related to the following database schema:

# DATABASE SCHEMA:
- categories (category_id, name, created_at)
- products (product_id, name, stock_quantity, manufacturer, category_id)
- product_prices (price_id, product_id, price_type, price, effective_date)
- partners (partner_id, name, partner_type, address, phone, email, created_at)
- employees (employee_id, name, email, phone, created_at, user_id)
- transactions (transaction_id, action, product_id, partner_id, employee_id, price_per_unit, quantity, created_at)

# INSTRUCTION:
- A question is related if it involves querying or analyzing data from these tables and the result is "yes". Otherwise, it is unrelated and the result is "no".
- Respond in the following JSON format without any additional explanation: {{"result": "yes"}} or {{"result": "no"}}

# EXAMPLES:
{examples}

Now, please classify the following question:
{question}
"""

transform_question_prompt = """You are an expert in reformatting database-related questions to make them clearer and more readable. Given a question about an SQL database, your task is to rewrite it in a way that is more understandable while preserving its original meaning. Ensure that the revised question is direct, grammatically correct, and avoids ambiguity.

## DATABASE SCHEMA
- categories (category_id, name, created_at)
- products (product_id, name, stock_quantity, manufacturer, category_id)
- product_prices (price_id, product_id, price_type, price, effective_date)
- partners (partner_id, name, partner_type, address, phone, email, created_at)
- employees (employee_id, name, email, phone, created_at, user_id)
- transactions (transaction_id, action, product_id, partner_id, employee_id, price_per_unit, quantity, created_at)

## INSTRUCTIONS:
- use complete and well-structured sentences to improve clarity.  
- do not remove important context or details that help understand the question.  
- avoid ambiguous or vague phrases and replace them with explicit terms.  
- if a question involves a specific condition, make it explicit rather than implied.  
- ensure the question clearly reflects its intended query according to the database schema. 
- Response with the reformatted question only without any additional text.

## EXAMPLES:

Example 1: 
Human: list the phone numbers of all partners, excluding those without a registered email.  
AI: list the phone numbers of all partners who have a registered email address. partners without a registered email should be excluded from the list.

Example 2:
Human: List of employees who have processed transactions from multiple categories.
AI: List employees who have processed transactions involving products from more than one category.

Now, given the following question, rewrite it in a clearer and more natural way:
{question}
"""