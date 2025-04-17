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

    updatePartner = async (req, res) => {
        const respone = await PartnerService.updatePartner(req.body)
        return new OK({
            message : "Update partner success!",
            metadata : respone
        }).send(res)
    }

    // Get all partners
    getAllPartners = async (req, res) => {
        const responces = await PartnerService.getAllPartners(req.query);
        return new OK({
            message: 'Get all partners',
            metadata: responces
        }).send(res);
    }

    // Get partner by id
    getPartnerById = async (req, res) => {
        const responces = await PartnerService.getPartnerById(req.query);
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

    deletePartner = async (req, res) => {
        const responces = await PartnerService.deletePartner(req.query);
        return new OK({
            message: 'Delete partner success',
            metadata: responces
        }).send(res);
    }

    searchPartner = async (req, res) => {
        const responces = await PartnerService.searchPartner(req.body, req.query);
        return new OK({
            message: 'Search partner success',
            metadata: responces
        }).send(res);
    }
}

module.exports = new PartnerController();