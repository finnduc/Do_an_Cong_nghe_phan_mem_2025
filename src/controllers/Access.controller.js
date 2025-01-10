const AccessService = require('../services/Access.service');
const { OK, CREATED } = require('../core/respone')

class AccessController {
  Login = (req, res) => {
    const responces = await AccessService.Login(req.body);
    const 
}