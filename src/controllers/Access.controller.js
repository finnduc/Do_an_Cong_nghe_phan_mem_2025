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
}

module.exports = new AccessController();