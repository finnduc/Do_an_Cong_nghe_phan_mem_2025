const UserService = require('../services/User.service');
const { OK } = require('../core/respone');

class UserController {
  CreateUser = async (req, res, next) => {
    try {
      const responces = await UserService.createrUser(req.body);
      return new OK({
        message: 'Create user success',
        metadata: responces,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  UpdateUser = async (req, res, next) => {
    try {
      const responces = await UserService.updateUser(req.body);
      return new OK({
        message: 'Update user success',
        metadata: responces,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  GetAllUser = async (req, res, next) => {
    try {
      const responces = await UserService.getAllUsers(req.query);
      return new OK({
        message: 'Get all user success',
        metadata: responces,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  DeleteUser = async (req, res, next) => {
    try {
      const responces = await UserService.deleteUser(req.query);
      return new OK({
        message: 'Delete user success',
        metadata: responces,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  SearchUser = async (req, res, next) => {
    try {
      const responces = await UserService.searchUser(req.query, req.body);
      return new OK({
        message: 'Search user success',
        metadata: responces,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  getUserName = async (req, res, next) => {
    try {
      const responces = await UserService.getNameUser();
      return new OK({
        message: 'Get user name success',
        metadata: responces,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }

  getRoleUser = async (req, res, next) => {
    try {
      const responces = await UserService.getRoleUser();
      return new OK({
        message: 'Get user role success',
        metadata: responces,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();