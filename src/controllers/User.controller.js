const UserService = require('../services/User.service')
const { OK, CREATED } = require('../core/respone')

class UserController {
    CreateUser = async (req, res) => {
        const responces = await UserService.createrUser(req.body);
        return new OK({
            message: 'Create user success',
            metadata: responces
        }).send(res);
    }

    UpdateUser = async (req, res) => {
        const responces = await UserService.updateUser(req.body);
        return new OK({
            message: 'Update user success',
            metadata: responces
        }).send(res);
    }

    GetAllUser = async (req, res) => {
        const responces = await UserService.getAllUsers(req.query);
        return new OK({
            message: 'Get all user success',
            metadata: responces
        }).send(res);
    }

    DeleteUser = async (req, res) => {
        const responces = await UserService.deleteUser(req.query);
        return new OK({
            message: 'Delete user success',
            metadata: responces
        }).send(res);
    }

    SearchUser = async (req, res) => {
        const responces = await UserService.searchUser(req.query , req.body);
        return new OK({
            message: 'Search user success',
            metadata: responces
        }).send(res);
    }
}

module.exports = new UserController();