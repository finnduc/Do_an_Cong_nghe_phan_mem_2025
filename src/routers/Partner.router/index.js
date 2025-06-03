const express = require('express');
const Router = express.Router();
const asyncHandler = require('../../helpers/asyncHandle');
const PartnerController = require('../../controllers/Partner.controller');
const { authentication } = require('../../auth/authUtils');
const { hasPermission, hasRole } = require('../../middleware/role.permission');

Router.use(authentication);

// Create partner
Router.post(
  '/create',
  hasRole('manager'),
  hasPermission({ permissions: ['create'], resource: 'partners' }),
  asyncHandler(PartnerController.createPartner)
);

// Update partner
Router.post(
  '/update',
  hasRole('manager'),
  hasPermission({ permissions: ['update'], resource: 'partners' }),
  asyncHandler(PartnerController.updatePartner)
);

// Get all partners
Router.get(
  '/getAll',
  hasRole(['manager', 'employee']),
  hasPermission({ permissions: ['read'], resource: 'partners' }),
  asyncHandler(PartnerController.getAllPartners)
);

// Get partner by id
Router.get(
  '/getById',
  hasRole(['manager', 'employee']),
  hasPermission({ permissions: ['read'], resource: 'partners' }),
  asyncHandler(PartnerController.getPartnerById)
);

// Get partner name
Router.get(
  '/getName',
  hasRole(['manager', 'employee']),
  hasPermission({ permissions: ['read'], resource: 'partners' }),
  asyncHandler(PartnerController.getPartnerName)
);

// Delete partner
Router.delete(
  '/delete',
  hasRole('manager'),
  hasPermission({ permissions: ['delete'], resource: 'partners' }),
  asyncHandler(PartnerController.deletePartner)
);

// Search partner
Router.post(
  '/search',
  hasRole(['manager', 'employee']),
  hasPermission({ permissions: ['read'], resource: 'partners' }),
  asyncHandler(PartnerController.searchPartner)
);

// Get total partner
Router.get(
  '/getTotal',
  hasRole(['manager', 'employee']),
  hasPermission({ permissions: ['read'], resource: 'partners' }),
  asyncHandler(PartnerController.getTotalPartner)
);

module.exports = Router;