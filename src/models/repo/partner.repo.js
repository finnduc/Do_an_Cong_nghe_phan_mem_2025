const { executeQuery } = require("../../database/executeQuery");

const findPartnerByInfo = async ({ email , phone }) => {
    const query = `SELECT * FROM partners WHERE email = ? AND phone = ?`;
    return await executeQuery(query , [email , phone])
}

const findPartnerByID = async (partner_id) => {
    const query = `SELECT * FROM partners WHERE partner_id = ?`;
    return await executeQuery(query , [partner_id])
}

module.exports = {
    findPartnerByInfo,
    findPartnerByID,
}

