const express = require('express');
const Routes = express.Router(); // Initialize Router instance
const { authentication } = require('../auth/authUtils');

// Use the '/access' route
Routes.use('/access', require('./Access.router/index'));

Routes.use(authentication);

Routes.get('/', (req, res) => {
    res.json({ message: 'Welcome to the API' });
});

// Export the Routes module
module.exports = Routes;
