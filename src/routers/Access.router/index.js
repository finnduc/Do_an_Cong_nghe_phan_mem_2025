const express = require('express');
const Router = express.Router();
const asyncHandler = require('../../helpers/asyncHandle')
const AccessController = require('../../controllers/Access.controller');

Router.post('/login', asyncHandler(AccessController.Login));

module.exports = Router;