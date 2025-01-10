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


const { createDatabaseModels } = require('./models/database.model');

const app = express();

createDatabaseModels();

module.exports = app;
