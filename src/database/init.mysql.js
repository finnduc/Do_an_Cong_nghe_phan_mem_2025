// src/database/init.mysql.js
const mysql = require('mysql2/promise');
const mysqlConfig = require('../configs/mysql.config');
const { checkDatabaseStatus } = require('../helpers/check.connect.mysql');

const pool = mysql.createPool({
    ...mysqlConfig,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error('Database connection failed:', err.message);
    } else {
        console.log('Database connected successfully');
        connection.release();
    }
});

const access = checkDatabaseStatus(pool);
console.log( "Số lượng truy cập: " , access);

module.exports = pool

