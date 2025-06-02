const StockService = require('../services/Stock.service');
const { OK } = require('../core/respone');

class StockController {
  ImportItems = async (req, res, next) => {
    try {
      const respone = await StockService.ImportItems(req.body);
      return new OK({
        message: 'Import items successfully',
        metadata: respone,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  ExportItems = async (req, res, next) => {
    try {
      const respone = await StockService.ExportItems(req.body);
      return new OK({
        message: 'Export items successfully',
        metadata: respone,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  GetStock = async (req, res, next) => {
    try {
      const respone = await StockService.getStock(req.query);
      return new OK({
        message: 'Get stock successfully',
        metadata: respone,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  SearchStock = async (req, res, next) => {
    try {
      const respone = await StockService.searchStock(req.body, req.query);
      return new OK({
        message: 'Search stock successfully',
        metadata: respone,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  filteringStock = async (req, res, next) => {
    try {
      const respone = await StockService.filteringStock(req.body, req.query);
      return new OK({
        message: 'Filtering stock successfully',
        metadata: respone,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  totalItemInStock = async (req, res, next) => {
    try {
      const respone = await StockService.totalItemInStock();
      return new OK({
        message: 'Get total item in stock successfully',
        metadata: respone,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }

  totalItemInStock3Month = async (req, res, next) => {
    try {
      const respone = await StockService.totalUnsoldItemsInStock3Months();
      return new OK({
        message: 'Get total item in stock in 3 month successfully',
        metadata: respone,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }

  updatePriceExport = async (req, res, next) => {
    try {
      const respone = await StockService.updatePriceExport(req.body);
      return new OK({
        message: 'Update price export successfully',
        metadata: respone,
      }).send(res);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new StockController();