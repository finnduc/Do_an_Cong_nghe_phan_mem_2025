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
const { addInfo } = require('./models/repo/admin.repo');

const app = express();

// Tạo model database
const initializeDatabase = async () => {
    try {
        console.log('Creating tables...');
        await createAllTables();
        console.log('Tables created successfully');

        console.log('Inserting default data...');
        await addInfo();
        console.log('Default data inserted successfully');
    } catch (error) {
        console.error('Database initialization failed:', error.message);
        throw error;
    };
}
initializeDatabase().catch((error) => {
    console.error('Failed to initialize database:', error.message);
    process.exit(1);
});



// Middleware cơ bản
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());

app.get('/', (req, res) => {
  res.status(200).send('Backend server is running!');
});

// Cấu hình Routes
const apiRouter = require('./routers');
const errorHandler = require('./helpers/errorHandler');
app.use('/v1/api', apiRouter);

app.use((req, res, next) => {
    res.status(404).json({ status: 404, message: 'Endpoint not found' });
});

app.use((res, req, next) => {
    res.status(401).json({ status: 401, message: 'Unauthorized' });
});

app.use(errorHandler);
module.exports = app;

