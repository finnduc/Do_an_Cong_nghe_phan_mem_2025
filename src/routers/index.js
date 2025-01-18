const express = require('express');
const Routes = express.Router(); // Initialize Router instance
const { authentication } = require('../auth/authUtils');

// Use the '/access' route
Routes.use('/access', require('./Access.router/index'));

Routes.use(authentication);
// partner routes
Routes.use('/partner', require('./Partner.router/index'));
Routes.use('/employee', require('./Employee.router/index'));

// Export the Routes module
module.exports = Routes;
