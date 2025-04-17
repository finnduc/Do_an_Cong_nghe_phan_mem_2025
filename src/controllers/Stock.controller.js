const StockService = require('../services/Stock.service')
const { OK, CREATED } = require('../core/respone')

class StockController {
  
    ImportItems = async (req, res) => {
        const respone = await StockService.ImportItems(req.body);
        return new OK({
            message: 'Import items successfully',
            metadata: respone
        }).send(res);
    }

    ExportItems = async (req, res) => {
        const respone = await StockService.ExportItems(req.body);
        return new OK({
            message: 'Export items successfully',
            metadata: respone
        }).send(res);
    }

    GetStock = async (req, res) => {
        const respone = await StockService.getStock(req.query);
        return new OK({
            message: 'Get stock successfully',
            metadata: respone
        }).send(res);
    }

    SearchStock = async (req, res) => {
        const respone = await StockService.searchStock(req.body, req.query);
        return new OK({
            message: 'Search stock successfully',
            metadata: respone
        }).send(res);
    }

    filteringStock = async ( req, res) => {
        const respone = await StockService.filteringStock(req.body, req.query);
        return new OK({
            message: 'Filtering stock successfully',
            metadata: respone
        }).send(res);
    }
}

module.exports = new StockController();