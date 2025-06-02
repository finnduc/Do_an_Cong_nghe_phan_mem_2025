const express = require('express');
const Router = express.Router();
const asyncHandler = require('../../helpers/asyncHandle')
const PartnerController = require('../../controllers/Partner.controller');
const { authentication } = require('../../auth/authUtils');

Router.use(authentication);

module.exports = Router;