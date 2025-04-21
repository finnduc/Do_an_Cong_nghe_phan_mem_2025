const express = require('express');
const Router = express.Router();
const asyncHandler = require('../../helpers/asyncHandle')
const ParameterController = require('../../controllers/Parameter.controller');
const { authentication } = require('../../auth/authUtils');

// Middleware to authenticate routes
// Router.use(authentication);

Router.post('/createManu', asyncHandler(ParameterController.createManu));
Router.post('/createCate', asyncHandler(ParameterController.createCate));
Router.post('/deleteManu', asyncHandler(ParameterController.deleteManu));
Router.get('/getManu', asyncHandler(ParameterController.getManu));

Router.post('/updateManu', asyncHandler(ParameterController.updateManu));
Router.post('/updateCate', asyncHandler(ParameterController.updateCate));
Router.post('/deleteCate', asyncHandler(ParameterController.deleteCate));
Router.get('/getCate', asyncHandler(ParameterController.getCategory));

Router.post('/create', asyncHandler(ParameterController.createParameter));
Router.post('/update', asyncHandler(ParameterController.updateParameter));
Router.get('/delete', asyncHandler(ParameterController.deleteParameter));
Router.get('/getAll', asyncHandler(ParameterController.getAllParameters));
Router.get('/getById', asyncHandler(ParameterController.getParameterById));
Router.get('/getName', asyncHandler(ParameterController.getParameterName));
Router.post('/search', asyncHandler(ParameterController.searchParameter));

module.exports = Router;