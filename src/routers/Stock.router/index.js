const express = require('express');
const Router = express.Router();
const asyncHandler = require('../../helpers/asyncHandle')
const StockController = require('../../controllers/Stock.controller');
const { authentication } = require('../../auth/authUtils');

// Middleware to authenticate routes
// Router.use(authentication);

Router.post('/import', asyncHandler(StockController.ImportItems));
Router.post('/export', asyncHandler(StockController.ExportItems));
Router.get('/getStock', asyncHandler(StockController.GetStock));
Router.post('/search', asyncHandler(StockController.SearchStock));
Router.post('/filtering', asyncHandler(StockController.filteringStock));
Router.get('/getTotalStock', asyncHandler(StockController.totalItemInStock));
Router.get('/getTotal3Months', asyncHandler(StockController.totalItemInStock3Month));


module.exports = Router;