const PartnerService = require('../services/Partners.service');
const { OK, CREATED } = require('../core/respone')

class PartnerController {
    // Create partner
    createPartner = async (req, res) => {
        const responces = await PartnerService.createPartner(req.body);
        return new OK({
            message: 'Create partner success',
            metadata: responces
        }).send(res);
    }

    // Get all partners
    getAllPartners = async (req, res) => {
        const responces = await PartnerService.getAllPartners();
        return new OK({
            message: 'Get all partners',
            metadata: responces
        }).send(res);
    }

    // Get partner by id
    getPartnerById = async (req, res) => {
        const responces = await PartnerService.getPartnerById(req.body);
        return new OK({
            message: 'Get partner by id',
            metadata: responces
        }).send(res);
    }

    // get Name of partner
    getPartnerName = async (req, res) => {
        const responces = await PartnerService.getPartnerName();
        return new OK({
            message: 'Get partner name',
            metadata: responces
        }).send(res);
    }
}

module.exports = new PartnerController();