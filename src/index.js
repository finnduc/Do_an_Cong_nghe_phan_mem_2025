// index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();
require('./database/init.mysql'); // Khởi tạo kết nối DB
const { createAllTables } = require('./models/database.model');

const app = express();

// Tạo model database
createAllTables();

// Middleware cơ bản
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:4000', // Chỉ định origin của frontend
    credentials: true // Cho phép gửi cookie hoặc thông tin xác thực
}));
app.use(bodyParser.json()); // Parse JSON body
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded body
app.use(cookieParser()); // Xử lý cookie
app.use(morgan('dev')); // Logging
app.use(helmet()); // Bảo mật header
app.use(compression()); // Nén dữ liệu trả về

// Cấu hình Routes
const apiRouter = require('./routers'); // Giả sử bạn có file routes
const errorHandler = require('./helpers/errorHandler');
app.use('/v1/api', apiRouter);

app.use((req, res, next) => {
    res.status(404).json({ status: 404 , message: 'Endpoint not found' });
});

app.use((res, req, next) => {
    res.status(401).json({ status: 401 , message: 'Unauthorized' });
});

app.use(errorHandler);
module.exports = app;

