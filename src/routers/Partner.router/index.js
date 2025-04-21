const express = require('express');
const Router = express.Router();
const asyncHandler = require('../../helpers/asyncHandle')
const PartnerController = require('../../controllers/Partner.controller');
const { authentication } = require('../../auth/authUtils');

// Middleware to authenticate routes
// Router.use(authentication);

// create partner
Router.post('/create', asyncHandler(PartnerController.createPartner));

Router.post('/update', asyncHandler(PartnerController.updatePartner))

// get all partners
Router.get('/getAll', asyncHandler(PartnerController.getAllPartners));

// get partner by id
Router.get('/getById', asyncHandler(PartnerController.getPartnerById));

// get partner name
Router.get('/getName', asyncHandler(PartnerController.getPartnerName));

// delete partner
Router.get('/delete', asyncHandler(PartnerController.deletePartner));

Router.post('/search', asyncHandler(PartnerController.searchPartner))

module.exports = Router;