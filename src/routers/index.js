const express = require('express');
const Routes = express.Router(); // Initialize Router instance

// Use the '/access' route
Routes.use('/access', require('./Access.router/index'));

// Export the Routes module
module.exports = Routes;
