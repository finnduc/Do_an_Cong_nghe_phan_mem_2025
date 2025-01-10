const pool = require('../database/init.mysql');

const createDatabaseModels = () => {
    const queries = [
        `CREATE TABLE users (
            user_id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) NOT NULL UNIQUE,
            email VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            role ENUM('admin', 'manager') NOT NULL DEFAULT 'manager',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

        `CREATE TABLE warehouses (
            warehouse_id INT AUTO_INCREMENT PRIMARY KEY,
            manager_id INT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (manager_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
        )`,

        `CREATE TABLE categories (
            category_id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL UNIQUE
        )`,

        `CREATE TABLE products (
            product_id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            manufacturer VARCHAR(100) NOT NULL,
            export_price DECIMAL(10, 2) CHECK (export_price > 0),
            import_price DECIMAL(10, 2) CHECK (import_price > 0),
            stock_quantity INT NOT NULL CHECK (stock_quantity >= 0),
            category_id INT NOT NULL,
            warehouse_id INT NOT NULL,
            FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE ON UPDATE CASCADE,
            FOREIGN KEY (warehouse_id) REFERENCES warehouses(warehouse_id) ON DELETE CASCADE ON UPDATE CASCADE,
            UNIQUE (name, warehouse_id)
        )`,

        `CREATE TABLE transactions (
            transaction_id INT AUTO_INCREMENT PRIMARY KEY,
            action ENUM('import', 'export') NOT NULL,
            product_id INT NOT NULL,
            quantity INT NOT NULL CHECK (quantity > 0),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (product_id) REFERENCES products(product_id)
        )`,

        `CREATE TABLE employees (
            employee_id INT AUTO_INCREMENT PRIMARY KEY,
            warehouse_id INT NOT NULL,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            phone VARCHAR(15),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (warehouse_id) REFERENCES warehouses(warehouse_id) ON DELETE CASCADE ON UPDATE CASCADE
        )`,

        `CREATE TABLE partners (
            partner_id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL UNIQUE,
            partner_type ENUM('supplier', 'customer') NOT NULL,
            address TEXT,
            phone VARCHAR(15),
            email VARCHAR(100),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,

        `CREATE TABLE transaction_details (
            detail_id INT AUTO_INCREMENT PRIMARY KEY,
            transaction_id INT NOT NULL,
            employee_id INT NOT NULL,
            partner_id INT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (transaction_id) REFERENCES transactions(transaction_id),
            FOREIGN KEY (employee_id) REFERENCES employees(employee_id),
            FOREIGN KEY (partner_id) REFERENCES partners(partner_id)
        )`
    ];

    queries.forEach(query => {
        pool.query(query, (err, results) => {
            if (err) {
                console.error('Error executing query:', err.message);
            } else {
                console.log('Query executed successfully');
            }
        });
    });
};

module.exports = {
    createDatabaseModels,
};
