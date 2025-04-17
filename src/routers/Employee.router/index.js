const express = require('express');
const Router = express.Router();
const asyncHandler = require('../../helpers/asyncHandle')
const EmployeeController = require('../../controllers/Employee.controller');
const { authentication } = require('../../auth/authUtils');

// Middleware to authenticate routes
Router.use(authentication);
// create employee
Router.post('/create', asyncHandler(EmployeeController.createEmployees));

Router.post('/update', asyncHandler(EmployeeController.updateEmployees));

Router.get('/getAll', asyncHandler(EmployeeController.getAllEmployees));

Router.get('/getById', asyncHandler(EmployeeController.getEmployeesById));

Router.get('/getName', asyncHandler(EmployeeController.getEmployeeName));

Router.get('/delete', asyncHandler(EmployeeController.deleteEmployee));

Router.post('/search', asyncHandler(EmployeeController.searchEmployee));

module.exports = Router;