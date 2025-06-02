const express = require('express');
const Router = express.Router();
const asyncHandler = require('../../helpers/asyncHandle')
const AccessController = require('../../controllers/Access.controller');
const { authentication } = require('../../auth/authUtils');

Router.post('/login', asyncHandler(AccessController.Login));

Router.use(authentication);

Router.get('/logout', asyncHandler(AccessController.logout));

Router.post('/refreshToken', asyncHandler(AccessController.refreshToken));


module.exports = Router;