const ParameterService = require('../services/Parameter.service');
const { OK, CREATED } = require('../core/respone');

class ParameterController {

  createManu = async (req, res, next) => {
    try {
      const responces = await ParameterService.createManu(req.body);
      return new OK({
        message: 'Create parameter success',
        metadata: responces,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  updateManu = async (req, res, next) => {
    try {
      const responces = await ParameterService.updateManu(req.body);
      return new OK({
        message: 'Update parameter success',
        metadata: responces,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }

  deleteManu = async (req, res, next) => {
    try {
      const responces = await ParameterService.deleteManu(req.body);
      return new OK({
        message: 'Delete parameter success',
        metadata: responces,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }

  getManu = async (req, res, next) => {
    try {
      const responces = await ParameterService.getManu();
      return new OK({
        message: 'Get parameter success',
        metadata: responces,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }

  createCate = async (req, res, next) => {
    try {
      const responces = await ParameterService.createCategory(req.body);
      return new OK({
        message: 'Create parameter success',
        metadata: responces,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }

  updateCate = async (req, res, next) => {
    try {
      const responces = await ParameterService.updateCategory(req.body);
      return new OK({
        message: 'Update parameter success',
        metadata: responces,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }

  deleteCate = async (req, res, next) => {
    try {
      const responces = await ParameterService.deleteCategory(req.body);
      return new OK({
        message: 'Delete parameter success',
        metadata: responces,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }

  getCategory = async (req, res, next) => {
    try {
      const responces = await ParameterService.getCategory();
      return new OK({
        message: 'Get parameter success',
        metadata: responces,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }
  createParameter = async (req, res, next) => {
    try {
      const responces = await ParameterService.createParameter(req.body);
      return new CREATED({
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

  getNameParameter = async (req, res, next) => {
    try {
      const responces = await ParameterService.getNameParameter();
      return new OK({
        message: 'Get name parameter success',
        metadata: responces,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ParameterController();