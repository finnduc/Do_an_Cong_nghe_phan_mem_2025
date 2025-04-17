const express = require('express');
const Router = express.Router();
const asyncHandler = require('../../helpers/asyncHandle')
const PartnerController = require('../../controllers/Partner.controller');
const { authentication } = require('../../auth/authUtils');

// Middleware to authenticate routes
Router.use(authentication);

// create partner
Router.post('/create', asyncHandler(PartnerController.createPartner));

// get all partners
Router.get('/getAll', asyncHandler(PartnerController.getAllPartners));

// get partner by id
Router.post('/getById', asyncHandler(PartnerController.getPartnerById));

// get partner name
Router.get('/getName', asyncHandler(PartnerController.getPartnerName));

module.exports = Router;