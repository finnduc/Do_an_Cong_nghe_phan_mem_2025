const TransactionService = require("../services/Transaction.service");
const { OK } = require('../core/respone');

class TransactionController {
    getTransaction = async ( req, res ) => {
        const respone = await TransactionService.getTransaction(req.query);
        return new OK({
            message: 'Lấy danh sách giao dịch thành công',
            metadata: respone
        }).send(res);
    }
}

module.exports = new TransactionController();