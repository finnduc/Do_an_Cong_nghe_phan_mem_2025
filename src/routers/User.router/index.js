const express = require('express');
const Router = express.Router();
const asyncHandler = require('../../helpers/asyncHandle');
const UserController = require('../../controllers/User.controller');
const { authentication } = require('../../auth/authUtils');
const { hasPermission, hasRole } = require('../../middleware/role.permission');

Router.use(authentication);

// Create user
Router.post(
  '/create',
  hasRole('manager'),
  hasPermission({ permissions: ['create'], resource: 'users' }),
  asyncHandler(UserController.CreateUser)
);

// Update user
Router.post(
  '/update',
  hasRole('manager'),
  hasPermission({ permissions: ['update'], resource: 'users' }),
  asyncHandler(UserController.UpdateUser)
);

// Update user setting
Router.post(
  '/updateSetting',
  hasRole(['manager', 'employee']),
  hasPermission({ permissions: ['update'], resource: 'users' }),
  asyncHandler(UserController.updateUserSetting)
);

// Delete user
Router.delete(
  '/delete',
  hasRole('manager'),
  hasPermission({ permissions: ['delete'], resource: 'users' }),
  asyncHandler(UserController.DeleteUser)
);

// Get all users
Router.get(
  '/getAll',
  hasRole(['manager', 'employee']),
  hasPermission({ permissions: ['read'], resource: 'users' }),
  asyncHandler(UserController.GetAllUser)
);

// Search users
Router.post(
  '/search',
  hasRole(['manager', 'employee']),
  hasPermission({ permissions: ['read'], resource: 'users' }),
  asyncHandler(UserController.SearchUser)
);

// Get user name
Router.get(
  '/getName',
  hasRole(['manager', 'employee']),
  hasPermission({ permissions: ['read'], resource: 'users' }),
  asyncHandler(UserController.getUserName)
);

// Get user role
Router.get(
  '/getRole',
  hasRole('manager'),
  hasPermission({ permissions: ['read'], resource: 'users' }),
  asyncHandler(UserController.getRoleUser)
);

module.exports = Router;