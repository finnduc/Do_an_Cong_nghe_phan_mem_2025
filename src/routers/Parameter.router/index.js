const express = require('express');
const Router = express.Router();
const asyncHandler = require('../../helpers/asyncHandle')
const ParameterController = require('../../controllers/Parameter.controller');

Router.post('/create', asyncHandler(ParameterController.createParameter));

module.exports = Router;