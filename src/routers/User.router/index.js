const express = require('express');
const Router = express.Router();
const asyncHandler = require('../../helpers/asyncHandle')
const UserController = require('../../controllers/User.controller');

Router.post('/create', asyncHandler(UserController.CreateUser));
Router.post('/update', asyncHandler(UserController.UpdateUser));
Router.get('/delete', asyncHandler(UserController.DeleteUser));
Router.get('/getAll', asyncHandler(UserController.GetAllUser));
Router.post('/search', asyncHandler(UserController.SearchUser));

module.exports = Router;