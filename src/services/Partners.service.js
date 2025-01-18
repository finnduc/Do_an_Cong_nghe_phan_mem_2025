const { executeQuery } = require('../database/executeQuery');

class PartnerService {
    // Create partner
    createPartner = async (payload) => {
        const query = `
        INSERT INTO partners (name, partner_type, address, phone, email)
        VALUES (?, ?, ?, ?, ?)
        `;
        return executeQuery(query, [payload.name, payload.partner_type, payload.address, payload.phone, payload.email]);
    }

    // Get all partners
    getAllPartners = async () => {
        const query = `SELECT * FROM partners`;
        return executeQuery(query);
    }

    // Get partner by id
    getPartnerById = async (payload) => {
        const query = `SELECT * FROM partners WHERE partner_id = ?`;
        return executeQuery(query, [payload.partner_id]);
    }

    // get Name of partner
    getPartnerName = async () => {
        const query = `SELECT name, partner_id FROM partners`;
        return executeQuery(query);
    }
}

module.exports = new PartnerService();
