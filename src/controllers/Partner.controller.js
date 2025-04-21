const PartnerService = require('../services/Partners.service');
const { OK } = require('../core/respone');

class PartnerController {
  createPartner = async (req, res, next) => {
    try {
      const responces = await PartnerService.createPartner(req.body);
      return new OK({
        message: 'Create partner success',
        metadata: responces,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  updatePartner = async (req, res, next) => {
    try {
      const respone = await PartnerService.updatePartner(req.body);
      return new OK({
        message: 'Update partner success!',
        metadata: respone,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  getAllPartners = async (req, res, next) => {
    try {
      const responces = await PartnerService.getAllPartners(req.query);
      return new OK({
        message: 'Get all partners',
        metadata: responces,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  getPartnerById = async (req, res, next) => {
    try {
      const responces = await PartnerService.getPartnerById(req.query);
      return new OK({
        message: 'Get partner by id',
        metadata: responces,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  getPartnerName = async (req, res, next) => {
    try {
      const responces = await PartnerService.getPartnerName(req.query);
      return new OK({
        message: 'Get partner name',
        metadata: responces,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  deletePartner = async (req, res, next) => {
    try {
      const responces = await PartnerService.deletePartner(req.query);
      return new OK({
        message: 'Delete partner success',
        metadata: responces,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  searchPartner = async (req, res, next) => {
    try {
      const responces = await PartnerService.searchPartner(req.body, req.query);
      return new OK({
        message: 'Search partner success',
        metadata: responces,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new PartnerController();