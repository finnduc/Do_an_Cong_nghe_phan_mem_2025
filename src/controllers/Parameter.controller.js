const ParameterService = require('../services/Parameter.service');
const { OK } = require('../core/respone');
const { BadRequestError } = require('../core/error');

class ParameterController {
    createParameter = async (req, res, next) => {
        const responces = await ParameterService.createParameter(req.body);
        return new OK({
            message: 'Create parameter success',
            metadata: responces
        }).send(res);
    }

    updateParameter = async (req, res, next) => {
        const responces = await ParameterService.updateParameter(req.body);
        return new OK({
            message: 'Update parameter success',
            metadata: responces
        }).send(res);
    }

    deleteParameter = async (req, res) => {
        const responces = await ParameterService.deleteParameter(req.query);
        return new OK({
            message: 'Delete parameter success',
            metadata: responces
        }).send(res);
    }

    getAllParameters = async (req, res) => {
        const responces = await ParameterService.getAllParameters(req.query);
        return new OK({
            message: 'Get all parameters',
            metadata: responces
        }).send(res);
    }

    getParameterById = async (req, res) => {
        const responces = await ParameterService.getParameterById(req.body);
        return new OK({
            message: 'Get parameter by id',
            metadata: responces
        }).send(res);
    }

    getParameterName = async (req, res) => {
        const responces = await ParameterService.getParameterName();
        return new OK({
            message: 'Get parameter name',
            metadata: responces
        }).send(res);
    }

    searchParameter = async (req, res) => {
        const responces = await ParameterService.searchParameter(req.body, req.query);
        return new OK({
            message: 'Search parameter success',
            metadata: responces
        }).send(res);
    }
}

module.exports = new ParameterController();