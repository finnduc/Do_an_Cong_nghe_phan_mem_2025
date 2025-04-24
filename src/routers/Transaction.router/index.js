const express = require('express');
const Router = express.Router();
const asyncHandler = require('../../helpers/asyncHandle');
const TransactionController = require('../../controllers/Transaction.controller');
const { authentication } = require('../../auth/authUtils');
const { hasPermission, hasRole } = require('../../middleware/role.permission');

Router.use(authentication);

// Get transaction details
Router.get(
  '/getTransaction',
  hasRole(['manager', 'employee']),
  hasPermission({ permissions: ['read'], resource: 'transactions' }),
  asyncHandler(TransactionController.getTransaction)
);

// Get transaction statistics for the last 12 months
Router.get(
  '/12LastMonth',
  hasRole(['manager', 'employee']),
  hasPermission({ permissions: ['read'], resource: 'transactions' }),
  asyncHandler(TransactionController.getTransactionStatsLast12Months)
);

module.exports = Router;