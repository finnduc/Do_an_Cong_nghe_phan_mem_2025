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

    `CREATE TABLE IF NOT EXISTS stocks (
        stock_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
        product_id CHAR(36) NOT NULL,
        manufacturer_id CHAR(36) NOT NULL,
        category_id CHAR(36) NULL,
        quantity_new INT NOT NULL CHECK (quantity_new >= 0),
        quantity_damage INT NOT NULL CHECK (quantity_damage >= 0),
        quantity_sold INT NOT NULL CHECK (quantity_sold >= 0),
        FOREIGN KEY (product_id) REFERENCES products (product_id) ON UPDATE CASCADE,
        FOREIGN KEY (manufacturer_id) REFERENCES manufacturers (manufacturer_id) ON UPDATE CASCADE,
        FOREIGN KEY (category_id) REFERENCES categories (category_id) ON UPDATE CASCADE
    )`,

    `CREATE TABLE IF NOT EXISTS partners (
        partner_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
        name VARCHAR(100) NOT NULL UNIQUE,
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
        employee_type ENUM('out_province', 'in_province') NOT NULL,
        user_id CHAR(36) UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE SET NULL ON UPDATE CASCADE
    )`,

    `CREATE TABLE IF NOT EXISTS schools (
        school_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
        name VARCHAR(100) NOT NULL,
        address TEXT,
        phone VARCHAR(15) UNIQUE NOT NULL,
        quantity_class INT NOT NULL CHECK (quantity_class >= 0),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    `CREATE TABLE IF NOT EXISTS school_inventory (
        inventory_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
        school_id CHAR(36) NOT NULL,
        product_id CHAR(36) NOT NULL,
        manufacturer_id CHAR(36) NOT NULL,
        category_id CHAR(36) NULL,
        quantity_new INT NOT NULL CHECK (quantity_new >= 0),
        quantity_damage INT NOT NULL CHECK (quantity_damage >= 0),
        status_type VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (school_id) REFERENCES schools (school_id) ON UPDATE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products (product_id) ON UPDATE CASCADE,
        FOREIGN KEY (manufacturer_id) REFERENCES manufacturers (manufacturer_id) ON UPDATE CASCADE,
        FOREIGN KEY (category_id) REFERENCES categories (category_id) ON UPDATE CASCADE
    )`,

    `CREATE TABLE IF NOT EXISTS employee_inventory (
        inventory_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
        employee_id CHAR(36) NOT NULL,
        product_id CHAR(36) NOT NULL,
        manufacturer_id CHAR(36) NOT NULL,
        category_id CHAR(36) NULL,
        quantity_new INT NOT NULL CHECK (quantity_new >= 0),
        quantity_damage INT NOT NULL CHECK (quantity_damage >= 0),
        status_type VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (employee_id) REFERENCES employees (employee_id) ON UPDATE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products (product_id) ON UPDATE CASCADE,
        FOREIGN KEY (manufacturer_id) REFERENCES manufacturers (manufacturer_id) ON UPDATE CASCADE,
        FOREIGN KEY (category_id) REFERENCES categories (category_id) ON UPDATE CASCADE
    )`,

    `CREATE TABLE IF NOT EXISTS operations (
        transaction_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
        action ENUM('import_new', 'export_school', 'import_school', 'export_reserve', 'import_reserve', 'import_repair', 'export_repair', 'liquidate', 'replace') NOT NULL,
        inventory_id CHAR(36),
        stock_id CHAR(36),
        partner_id CHAR(36),
        employee_id CHAR(36),
        school_id CHAR(36),
        quantity INT NOT NULL CHECK (quantity > 0),
        note TEXT,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (inventory_id) REFERENCES employee_inventory (inventory_id) ON UPDATE CASCADE ON DELETE SET NULL,
        FOREIGN KEY (inventory_id) REFERENCES school_inventory (inventory_id) ON UPDATE CASCADE ON DELETE SET NULL,
        FOREIGN KEY (stock_id) REFERENCES stocks (stock_id) ON UPDATE CASCADE,
        FOREIGN KEY (partner_id) REFERENCES partners (partner_id) ON UPDATE CASCADE,
        FOREIGN KEY (employee_id) REFERENCES employees (employee_id) ON UPDATE CASCADE,
        FOREIGN KEY (school_id) REFERENCES schools (school_id) ON UPDATE CASCADE
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