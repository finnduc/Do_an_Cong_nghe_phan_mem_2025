const EmployeeService = require('../services/Employees.service');
const { OK, CREATED } = require('../core/respone')

class EmployeeController {
    createEmployees = async (req, res) => {
        const responces = await EmployeeService.createEmployee(req.body);
        return new OK({
            message: 'Create  success',
            metadata: responces
        }).send(res);
    }

    getAllEmployees = async (req, res) => {
        const responces = await EmployeeService.getAllEmployees();
        return new OK({
            message: 'Get all Employee',
            metadata: responces
        }).send(res);
    }

    getEmployeesById = async (req, res) => {
        const responces = await EmployeeService.getEmployeerById(req.body);
        return new OK({
            message: 'Get employee by id',
            metadata: responces
        }).send(res);
    }

    getEmployeeName = async (req, res) => {
        const responces = await EmployeeService.getEmployeeName();
        return new OK({
            message: 'Get employee name',
            metadata: responces
        }).send(res);
    }
}

module.exports = new EmployeeController();