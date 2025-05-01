const TransactionService = require('../services/Transaction.service');
const { OK } = require('../core/respone');

class TransactionController {
  getTransaction = async (req, res, next) => {
    try {
      const respone = await TransactionService.getTransaction(req.query);
      return new OK({
        message: 'Lấy danh sách giao dịch thành công',
        metadata: respone,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  searchTransaction = async (req, res, next) => {
    try {
      const respone = await TransactionService.searchTransaction(
        req.body,
        req.query
      );
      return new OK({
        message: 'Tìm kiếm giao dịch thành công',
        metadata: respone,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }

  totalTransactionsToday = async (req, res, next) => {
    try {
      const respone = await TransactionService.totalTransactionsToday();
      return new OK({
        message: 'Lấy số lượng giao dịch hôm nay thành công',
        metadata: respone,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }

  getTransactionStatsLast12Months = async (req, res, next) => {
    try {
      const respone = await TransactionService.getTransactionQuantityStatsLast12Months();
      return new OK({
        message: 'Lấy thống kê giao dịch tháng trước thành công',
        metadata: respone,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }

  getTodayCount = async (req, res, next) => {
    try {
      const respone = await TransactionService.getTodayCount();
      return new OK({
        message: 'Lấy số lượng giao dịch hôm nay thành công',
        metadata: respone,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TransactionController();