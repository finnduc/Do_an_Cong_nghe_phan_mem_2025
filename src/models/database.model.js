const pool = require('../database/init.mysql');

const createAllTables = async () => {
  const queries = [
    `CREATE TABLE IF NOT EXISTS users (
        user_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    `CREATE TABLE IF NOT EXISTS api_keys (
        api_key_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
        user_id CHAR(36) NOT NULL UNIQUE,
        public_key TEXT NOT NULL,
        private_key TEXT NOT NULL,
        refresh_token TEXT NOT NULL,
        refresh_token_user JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE ON UPDATE CASCADE
    )`,

    `CREATE TABLE IF NOT EXISTS categories (
        category_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
        name VARCHAR(100) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    `CREATE TABLE IF NOT EXISTS manufacturers (
        manufacturer_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
        name VARCHAR(100) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    `CREATE TABLE IF NOT EXISTS products (
        product_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
        name VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    `CREATE TABLE IF NOT EXISTS stock (
        stock_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
        product_id CHAR(36) NOT NULL,
        stock_quantity INT NOT NULL CHECK (stock_quantity >= 0),
        manufacturer_id CHAR(36) NOT NULL,
        category_id CHAR(36) NULL,
        FOREIGN KEY (product_id) REFERENCES products (product_id) ON UPDATE CASCADE,
        FOREIGN KEY (manufacturer_id) REFERENCES manufacturers (manufacturer_id) ON UPDATE CASCADE,
        FOREIGN KEY (category_id) REFERENCES categories (category_id) ON UPDATE CASCADE
    )`,

    `CREATE TABLE IF NOT EXISTS product_prices (
        price_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
        stock_id CHAR(36) NOT NULL,
        price_type ENUM('import', 'export') NOT NULL,
        price DECIMAL(10, 2) NOT NULL CHECK (price > 0),
        effective_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (stock_id) REFERENCES stock (stock_id) ON DELETE CASCADE ON UPDATE CASCADE
    )`,

    `CREATE TABLE IF NOT EXISTS partners (
        partner_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
        name VARCHAR(100) NOT NULL UNIQUE,
        partner_type ENUM('supplier', 'customer') NOT NULL,
        address TEXT,
        phone VARCHAR(15) NOT NULL,
        email VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    `CREATE TABLE IF NOT EXISTS employees (
        employee_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        phone VARCHAR(15),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        user_id CHAR(36) UNIQUE,
        FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE SET NULL ON UPDATE CASCADE
    )`,

    `CREATE TABLE IF NOT EXISTS transactions (
        transaction_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
        action ENUM('import', 'export') NOT NULL,
        stock_id CHAR(36) NOT NULL,
        partner_id CHAR(36),
        employee_id CHAR(36),
        price_per_unit DECIMAL(10, 2) NOT NULL,
        quantity INT NOT NULL CHECK (quantity > 0),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (stock_id) REFERENCES stock (stock_id) ON UPDATE CASCADE,
        FOREIGN KEY (partner_id) REFERENCES partners (partner_id) ON UPDATE CASCADE,
        FOREIGN KEY (employee_id) REFERENCES employees (employee_id) ON UPDATE CASCADE
    )`,

    `CREATE TABLE IF NOT EXISTS parameters (
        parameter_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
        product_id CHAR(36),
        manufacturer_id CHAR(36),
        category_id CHAR(36),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products (product_id) ON DELETE SET NULL ON UPDATE CASCADE,
        FOREIGN KEY (manufacturer_id) REFERENCES manufacturers (manufacturer_id) ON DELETE SET NULL ON UPDATE CASCADE,
        FOREIGN KEY (category_id) REFERENCES categories (category_id) ON DELETE SET NULL ON UPDATE CASCADE
    )`,

    `CREATE TABLE IF NOT EXISTS roles (
        role_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    `CREATE TABLE IF NOT EXISTS permissions (
        permission_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    `CREATE TABLE IF NOT EXISTS resources (
        resource_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
        name VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    `CREATE TABLE IF NOT EXISTS user_roles (
        user_id CHAR(36),
        role_id CHAR(36),
        PRIMARY KEY (user_id, role_id),
        FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
        FOREIGN KEY (role_id) REFERENCES roles (role_id) ON DELETE CASCADE
    )`,

    `CREATE TABLE IF NOT EXISTS role_permissions (
        role_id CHAR(36),
        permission_id CHAR(36),
        resource_id CHAR(36),
        PRIMARY KEY (role_id, permission_id, resource_id),
        FOREIGN KEY (role_id) REFERENCES roles (role_id) ON DELETE CASCADE,
        FOREIGN KEY (permission_id) REFERENCES permissions (permission_id) ON DELETE CASCADE,
        FOREIGN KEY (resource_id) REFERENCES resources (resource_id) ON DELETE CASCADE
    )`
  ];

  for (const [index, query] of queries.entries()) {
    try {
      await pool.query(query);
      console.log(`Query ${index + 1} executed successfully`);
    } catch (error) {
      console.error(`Error executing query ${index + 1}:`, error.message);
    }
  }
};

module.exports = {
  createAllTables
};