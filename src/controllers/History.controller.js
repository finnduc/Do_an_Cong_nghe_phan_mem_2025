const HistoryService = require('../services/Transaction.service');
const { OK } = require('../core/respone');

class HistoryController {
  getHistory = async (req, res, next) => {
    try {
      const respone = await HistoryService.getHistory(req.query);
      return new OK({
        message: 'Get history success',
        metadata: respone,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new HistoryController();