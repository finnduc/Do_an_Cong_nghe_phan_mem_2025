const express = require('express');
const Router = express.Router();
const asyncHandler = require('../../helpers/asyncHandle')
const TransactionController = require('../../controllers/Transaction.controller');

// create partner
Router.get('/getTransaction', asyncHandler(TransactionController.getTransaction))
Router.get('/12LastMonth', asyncHandler(TransactionController.getTransactionStatsLast12Months))

module.exports = Router;