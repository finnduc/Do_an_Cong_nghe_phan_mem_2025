const express = require('express');
const Router = express.Router();
const asyncHandler = require('../../helpers/asyncHandle');
const ParameterController = require('../../controllers/Parameter.controller');
const { authentication } = require('../../auth/authUtils');
const { hasPermission, hasRole } = require('../../middleware/role.permission');

Router.use(authentication);

// Manufacturer routes
Router.post(
  '/createManu',
  hasRole('manager'),
  hasPermission({ permissions: ['create'], resource: 'manufacturers' }),
  asyncHandler(ParameterController.createManu)
);

Router.delete(
  '/deleteManu',
  hasRole('manager'),
  hasPermission({ permissions: ['delete'], resource: 'manufacturers' }),
  asyncHandler(ParameterController.deleteManu)
);

Router.get(
  '/getManu',
  hasRole(['manager', 'employee']),
  hasPermission({ permissions: ['read'], resource: 'manufacturers' }),
  asyncHandler(ParameterController.getManu)
);

Router.post(
  '/updateManu',
  hasRole('manager'),
  hasPermission({ permissions: ['update'], resource: 'manufacturers' }),
  asyncHandler(ParameterController.updateManu)
);

// Category routes
Router.post(
  '/createCate',
  hasRole('manager'),
  hasPermission({ permissions: ['create'], resource: 'categories' }),
  asyncHandler(ParameterController.createCate)
);

Router.delete(
  '/deleteCate',
  hasRole('manager'),
  hasPermission({ permissions: ['delete'], resource: 'categories' }),
  asyncHandler(ParameterController.deleteCate)
);

Router.get(
  '/getCate',
  hasRole(['manager', 'employee']),
  hasPermission({ permissions: ['read'], resource: 'categories' }),
  asyncHandler(ParameterController.getCategory)
);

Router.post(
  '/updateCate',
  hasRole('manager'),
  hasPermission({ permissions: ['update'], resource: 'categories' }),
  asyncHandler(ParameterController.updateCate)
);

// Parameter routes
Router.post(
  '/create',
  hasRole('manager'),
  hasPermission({ permissions: ['create'], resource: 'parameters' }),
  asyncHandler(ParameterController.createParameter)
);

Router.post(
  '/update',
  hasRole('manager'),
  hasPermission({ permissions: ['update'], resource: 'parameters' }),
  asyncHandler(ParameterController.updateParameter)
);

Router.delete(
  '/delete',
  hasRole('manager'),
  hasPermission({ permissions: ['delete'], resource: 'parameters' }),
  asyncHandler(ParameterController.deleteParameter)
);

Router.get(
  '/getAll',
  hasRole(['manager', 'employee']),
  hasPermission({ permissions: ['read'], resource: 'parameters' }),
  asyncHandler(ParameterController.getAllParameters)
);

Router.get(
  '/getById',
  hasRole(['manager', 'employee']),
  hasPermission({ permissions: ['read'], resource: 'parameters' }),
  asyncHandler(ParameterController.getParameterById)
);

Router.get(
  '/getName',
  hasRole(['manager', 'employee']),
  hasPermission({ permissions: ['read'], resource: 'parameters' }),
  asyncHandler(ParameterController.getNameParameter)
);

Router.post(
  '/search',
  hasRole(['manager', 'employee']),
  hasPermission({ permissions: ['read'], resource: 'parameters' }),
  asyncHandler(ParameterController.searchParameter)
);

module.exports = Router;