// src/configs/mysql.config.js
const dotenv = require('dotenv');
dotenv.config();

const mysqlConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
};

console.log(mysqlConfig);

module.exports = mysqlConfig;