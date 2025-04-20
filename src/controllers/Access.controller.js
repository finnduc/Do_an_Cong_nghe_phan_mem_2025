const AccessService = require('../services/Access.service/Login.service');
const { OK, CREATED } = require('../core/respone');

class AccessController {
  Login = async (req, res, next) => {
    try {
      const responces = await AccessService.Login(req.body);
      return new OK({
        message: 'Login success',
        metadata: responces,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  logout = async (req, res, next) => {
    try {
      const responces = await AccessService.logout(req.keyStore);
      return new OK({
        message: 'Logout success',
        metadata: responces,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req, res, next) => {
    try {
      const responces = await AccessService.refreshToken(req.body, req.keyStore);
      return new OK({
        message: 'Refresh token success',
        metadata: responces,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new AccessController();