const { BadRequestError } = require('../core/error')
const { executeQuery } = require('../database/executeQuery');
const { findEmployeeByID } = require('../models/repo/employees.repo');
const { findPartnerByInfo, findPartnerByID } = require('../models/repo/partner.repo');

class PartnerService {
    // Create partner
    createPartner = async (payload) => {
        try {
            const foundPartner = await findPartnerByInfo({ email: payload.email, phone: payload.phone });

            if (foundPartner[0]) {
                throw new BadRequestError("Đối tác có số điện thoại và email này đã tồn tại!")
            }
            const query = `
                INSERT INTO partners (name, partner_type, address, phone, email)
                VALUES (?, ?, ?, ?, ?)
            `;
            return executeQuery(query, [payload.name, payload.partner_type, payload.address, payload.phone, payload.email]);
        } catch (error) {
            throw new BadRequestError(error.message)
        }
    }

    updatePartner = async (payload) => {
        try {
            const foundPartner = await findPartnerByID(payload.partner_id);

            console.log(foundPartner)
            if (!foundPartner[0]) {
                throw new BadRequestError("Đối tác không tồn tại!");
            }

            const query = `
                UPDATE partners
                SET name = ?, partner_type = ?, address = ?, phone = ?, email = ?
                WHERE partner_id = ?
            `;
            return executeQuery(query, [payload.name, payload.partner_type, payload.address, payload.phone, payload.email, payload.partner_id]);
        } catch (error) {
            throw new BadRequestError(error.message)
        }
    }

    // Get all partners
    getAllPartners = async ( payload ) => {
        try {
            const { page, limit } = payload;
            const offset = (page - 1) * limit;
            const parsedLimit = parseInt(limit, 10);
            const parsedPage = parseInt(page, 10);

            if (isNaN(parsedLimit) || isNaN(parsedPage) || parsedLimit <= 0 || parsedPage <= 0) {
                throw new BadRequestError("Limit và page phải là số nguyên dương!");
            }

            const query = `SELECT * FROM partners ORDER BY name ASC LIMIT ${parsedLimit} OFFSET ${offset};`;
            const countQuery = `SELECT COUNT(*) AS total FROM partners`;
            const countResult = await executeQuery(countQuery);
            const total = countResult[0].total;
            const results = await executeQuery(query);

            return {
                total: total,
                totalPage: Math.ceil(total / parsedLimit),
                page: parsedPage,
                limit: parsedLimit,
                data: results
            };
        } catch (error) {
            throw new BadRequestError(error.message)
        }
    }

    // Get partner by id
    getPartnerById = async (payload) => {
        try {
            const query = `SELECT * FROM partners WHERE partner_id = ?`;
            return executeQuery(query, [payload.partner_id]);
        } catch (error) {
            throw new BadRequestError(error.message)
        }
    }

    // get Name of partner
    getPartnerName = async () => {
        try {
            const query = `SELECT name, partner_id FROM partners`;
            return executeQuery(query);
        } catch (error) {
            throw new BadRequestError(error.message)
        }
    }

    deletePartner = async (payload) => {
        try {
            const { partner_id } = payload;
            const partnerIds = Array.isArray(partner_id) ? partner_id : [partner_id];

            if (partnerIds.length === 0) {
                throw new BadRequestError("Danh sách partner_id không hợp lệ!");
            }

            const placeholders = partnerIds.map(() => '?').join(', ');
            const findQuery = `
            SELECT partner_id FROM partners
            WHERE partner_id IN (${placeholders});
        `;
            const foundPartners = await executeQuery(findQuery, partnerIds);
            const foundIds = foundPartners.map(partner => partner.partner_id);

            if (foundIds.length === 0) {
                throw new BadRequestError("Không tìm thấy đối tác nào trong danh sách!");
            }

            const notFoundIds = partnerIds.filter(id => !foundIds.includes(id));

            if (notFoundIds.length > 0) {
                throw new BadRequestError(`Không tìm thấy các partner_id sau: ${notFoundIds.join(', ')}`);
            }

            const deleteQuery = `
                DELETE FROM partners
                WHERE partner_id IN (${placeholders});
            `;
            return executeQuery(deleteQuery, partnerIds);
        } catch (error) {
            throw new BadRequestError(error.message)
        }
    }

    searchPartner = async (payload , query ) => {
        try {
            const { page, limit } = query;
            const offset = (page - 1) * limit;
            const parsedLimit = parseInt(limit, 10);
            const parsedPage = parseInt(page, 10);

            if (isNaN(parsedLimit) || isNaN(parsedPage) || parsedLimit <= 0 || parsedPage <= 0) {
                throw new BadRequestError("Limit và page phải là số nguyên dương!");
            }

            const { search } = payload;
            const searchQuery = `
                SELECT * FROM partners
                WHERE name LIKE ? OR phone LIKE ? OR email LIKE ?
                ORDER BY name ASC LIMIT ${parsedLimit} OFFSET ${offset};
            `;
            const searchParams = [`%${search}%`, `%${search}%`, `%${search}%`];

            const results = await executeQuery(searchQuery, searchParams);

            return results;
        } catch (error) {
            throw new BadRequestError(error.message)
        }
    }

}

module.exports = new PartnerService();
