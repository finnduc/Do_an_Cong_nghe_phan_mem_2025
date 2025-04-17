
class HistoryController {
    getHistory = async ( req , res ) => {
        const respone = await HistoryService.getHistory( req.query );
        return new OK({
            message: 'Get history success',
            metadata: respone
        }).send( res );
    }
}

module.exports = new HistoryController();