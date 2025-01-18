const ParameterService = require('../services/Parameter.service');

class ParameterController {
    createParameter = async (req, res) => {
        const responces = await ParameterService.createParameter(req.body);
        return new OK({
            message: 'Create parameter success',
            metadata: responces
        }).send(res);
    }

    getAllParameters = async (req, res) => {
        const responces = await ParameterService.getAllParameters();
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
}

module.exports = new ParameterController();