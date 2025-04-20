const ParameterService = require('../services/Parameter.service');
const { OK } = require('../core/respone');

class ParameterController {
  createParameter = async (req, res, next) => {
    try {
      const responces = await ParameterService.createParameter(req.body);
      return new OK({
        message: 'Create parameter success',
        metadata: responces,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  updateParameter = async (req, res, next) => {
    try {
      const responces = await ParameterService.updateParameter(req.body);
      return new OK({
        message: 'Update parameter success',
        metadata: responces,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  deleteParameter = async (req, res, next) => {
    try {
      const responces = await ParameterService.deleteParameter(req.query);
      return new OK({
        message: 'Delete parameter success',
        metadata: responces,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  getAllParameters = async (req, res, next) => {
    try {
      const responces = await ParameterService.getAllParameters(req.query);
      return new OK({
        message: 'Get all parameters',
        metadata: responces,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  getParameterById = async (req, res, next) => {
    try {
      const responces = await ParameterService.getParameterById(req.body);
      return new OK({
        message: 'Get parameter by id',
        metadata: responces,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  getParameterName = async (req, res, next) => {
    try {
      const responces = await ParameterService.getParameterName();
      return new OK({
        message: 'Get parameter name',
        metadata: responces,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  searchParameter = async (req, res, next) => {
    try {
      const responces = await ParameterService.searchParameter(req.body, req.query);
      return new OK({
        message: 'Search parameter success',
        metadata: responces,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new ParameterController();