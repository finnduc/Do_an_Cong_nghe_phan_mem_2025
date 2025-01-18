const express = require('express');
const Router = express.Router();
const asyncHandler = require('../../helpers/asyncHandle')
const EmployeeController = require('../../controllers/Employee.controller');

// create partner
Router.post('/create', asyncHandler(EmployeeController.createEmployees));

// get all partners
Router.get('/getAll', asyncHandler(EmployeeController.getAllEmployees));

// get partner by id
Router.post('/getById', asyncHandler(EmployeeController.getEmployeesById));

// get partner name
Router.get('/getName', asyncHandler(EmployeeController.getEmployeeName));

module.exports = Router;