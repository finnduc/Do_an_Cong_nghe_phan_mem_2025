const EmployeeService = require('../services/Employees.service');
const { OK, CREATED } = require('../core/respone');

class EmployeeController {
  createEmployees = async (req, res, next) => {
    try {
      const responces = await EmployeeService.createEmployee(req.body);
      return new CREATED({
        message: 'Create success',
        metadata: responces,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  updateEmployees = async (req, res, next) => {
    try {
      const responces = await EmployeeService.updateEmployees(req.body);
      return new OK({
        message: 'Update success',
        metadata: responces,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  getAllEmployees = async (req, res, next) => {
    try {
      const responces = await EmployeeService.getAllEmployees(req.query);
      return new OK({
        message: 'Get all Employee',
        metadata: responces,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  getEmployeesById = async (req, res, next) => {
    try {
      const responces = await EmployeeService.getEmployeerById(req.query);
      return new OK({
        message: 'Get employee by id',
        metadata: responces,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  getEmployeeName = async (req, res, next) => {
    try {
      const responces = await EmployeeService.getEmployeeName();
      return new OK({
        message: 'Get employee name',
        metadata: responces,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  deleteEmployee = async (req, res, next) => {
    try {
      const responces = await EmployeeService.deleteEmployee(req.query);
      return new OK({
        message: 'Delete employee success',
        metadata: responces,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  searchEmployee = async (req, res, next) => {
    try {
      const responces = await EmployeeService.searchEmployee(req.body, req.query);
      return new OK({
        message: 'Search employee success',
        metadata: responces,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new EmployeeController();