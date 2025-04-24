const express = require('express');
const Router = express.Router();
const asyncHandler = require('../../helpers/asyncHandle');
const EmployeeController = require('../../controllers/Employee.controller');
const { authentication } = require('../../auth/authUtils');
const { hasPermission, hasRole } = require('../../middleware/role.permission');

Router.use(authentication);

Router.post(
  '/create',
  hasRole('manager'),
  hasPermission({ permissions: ['create'], resource: 'employees' }),
  asyncHandler(EmployeeController.createEmployees)
);

Router.post(
  '/update',
  hasRole('manager'),
  hasPermission({ permissions: ['update'], resource: 'employees' }),
  asyncHandler(EmployeeController.updateEmployees)
);

Router.get(
  '/getAll',
  hasRole(['manager', 'employee']),
  hasPermission({ permissions: ['read'], resource: 'employees' }),
  asyncHandler(EmployeeController.getAllEmployees)
);

Router.get(
  '/getById',
  hasRole(['manager', 'employee']),
  hasPermission({ permissions: ['read'], resource: 'employees' }),
  asyncHandler(EmployeeController.getEmployeesById)
);

Router.get(
  '/getName',
  hasRole(['manager', 'employee']),
  hasPermission({ permissions: ['read'], resource: 'employees' }),
  asyncHandler(EmployeeController.getEmployeeName)
);

Router.get(
  '/delete',
  hasRole('manager'),
  hasPermission({ permissions: ['delete'], resource: 'employees' }),
  asyncHandler(EmployeeController.deleteEmployee)
);

Router.post(
  '/search',
  hasRole('manager'),
  hasPermission({ permissions: ['read'], resource: 'employees' }),
  asyncHandler(EmployeeController.searchEmployee)
);

module.exports = Router;