const express = require('express');
const Routes = express.Router(); // Initialize Router instance
const { authentication } = require('../auth/authUtils');

Routes.use('/access', require('./Access.router/index'));
Routes.use('/partner', require('./Partner.router/index'));
Routes.use('/employee', require('./Employee.router/index'));
Routes.use('/parameter', require('./Parameter.router/index'));
Routes.use('/transaction', require('./Transaction.router/index'));
Routes.use('/product', require('./Product.router/index'));
Routes.use('/stock', require('./Stock.router/index'));
Routes.use('/user', require('./User.router/index'));

// Export the Routes module
module.exports = Routes;
