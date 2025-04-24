const express = require('express');
const Router = express.Router();
const asyncHandler = require('../../helpers/asyncHandle');
const StockController = require('../../controllers/Stock.controller');
const { authentication } = require('../../auth/authUtils');
const { hasPermission, hasRole } = require('../../middleware/role.permission');

Router.use(authentication);

// Import items to stock
Router.post(
  '/import',
  hasRole(['manager', 'employee']),
  hasPermission({ permissions: ['update'], resource: 'stock' }),
  asyncHandler(StockController.ImportItems)
);

// Export items from stock
Router.post(
  '/export',
  hasRole(['manager', 'employee']),
  hasPermission({ permissions: ['update'], resource: 'stock' }),
  asyncHandler(StockController.ExportItems)
);

// Get stock details
Router.get(
  '/getStock',
  hasRole(['manager', 'employee']),
  hasPermission({ permissions: ['read'], resource: 'stock' }),
  asyncHandler(StockController.GetStock)
);

// Search stock
Router.post(
  '/search',
  hasRole(['manager', 'employee']),
  hasPermission({ permissions: ['read'], resource: 'stock' }),
  asyncHandler(StockController.SearchStock)
);

// Filter stock
Router.post(
  '/filtering',
  hasRole(['manager', 'employee']),
  hasPermission({ permissions: ['read'], resource: 'stock' }),
  asyncHandler(StockController.filteringStock)
);

// Get total stock
Router.get(
  '/getTotalStock',
  hasRole(['manager', 'employee']),
  hasPermission({ permissions: ['read'], resource: 'stock' }),
  asyncHandler(StockController.totalItemInStock)
);

// Get total stock for last 3 months
Router.get(
  '/getTotal3Months',
  hasRole(['manager', 'employee']),
  hasPermission({ permissions: ['read'], resource: 'stock' }),
  asyncHandler(StockController.totalItemInStock3Month)
);

module.exports = Router;