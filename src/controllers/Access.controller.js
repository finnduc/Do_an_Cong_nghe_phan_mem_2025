const AccessService = require('../services/Access.service/Login.service');
const { OK, CREATED } = require('../core/respone')

class AccessController {
  Login = async (req, res) => {
    const responces = await AccessService.Login(req.body);
    return new OK({
      message: 'Login success',
      metadata: responces
    }).send(res);
  }

  logout = async (req, res) => {
    console.log('req.keyStore', req.keyStore);
    const responces = await AccessService.logout(req.keyStore);
    return new OK({
      message: 'Logout success',
      metadata: responces
    }).send(res);
  }

refeshToken = async (req, res) => {
    const responces = await AccessService.refreshToken(req.body, req.keyStore);
    return new OK({
      message: 'Refresh token success',
      metadata: responces
    }).send(res);
  }
}

module.exports = new AccessController();