const { BadRequestError, ConflictError, InternalServerError, NotFoundError } = require('../core/error')
const { executeQuery } = require('../database/executeQuery');
const { findEmployeeByID } = require('../models/repo/employees.repo');
const { findPartnerByInfo, findPartnerByID } = require('../models/repo/partner.repo');

class PartnerService {

    createPartner = async (payload) => {
        const foundPartner = await findPartnerByInfo({ email: payload.email, phone: payload.phone });

        if (foundPartner[0]) {
            throw new ConflictError("Đối tác có số điện thoại và email này đã tồn tại!")
        }
        const query = `
                INSERT INTO partners (name, partner_type, address, phone, email)
                VALUES (?, ?, ?, ?, ?)
            `;
        return executeQuery(query, [payload.name, payload.partner_type, payload.address, payload.phone, payload.email]);
    }

    updatePartner = async (payload) => {
        const foundPartner = await findPartnerByID(payload.partner_id);

        console.log(foundPartner)
        if (!foundPartner[0]) {
            throw new NotFoundError("Đối tác không tồn tại!");
        }

        const query = `
                UPDATE partners
                SET name = ?, partner_type = ?, address = ?, phone = ?, email = ?
                WHERE partner_id = ? AND is_deleted = FALSE
            `;
        return await executeQuery(query, [payload.name, payload.partner_type, payload.address, payload.phone, payload.email, payload.partner_id]);
    }

    // Get all partners
    getAllPartners = async (payload) => {
        const { page, limit } = payload;
        const offset = (page - 1) * limit;
        const parsedLimit = parseInt(limit, 10);
        const parsedPage = parseInt(page, 10);

        if (isNaN(parsedLimit) || isNaN(parsedPage) || parsedLimit <= 0 || parsedPage <= 0) {
            throw new BadRequestError("Limit và page phải là số nguyên dương!");
        }

        const query = `SELECT
                    partner_id,
                    name,
                    partner_type,
                    phone,
                    email,
                    address
                FROM partners WHERE is_deleted = FALSE ORDER BY name ASC LIMIT ${parsedLimit} OFFSET ${offset};`;
        const countQuery = `SELECT COUNT(*) AS total FROM partners WHERE is_deleted = FALSE`;
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
    }

    // Get partner by id
    getPartnerById = async (payload) => {
        const query = `SELECT * FROM partners WHERE partner_id = ? AND is_deleted = FALSE`;
        return await executeQuery(query, [payload.partner_id]);
    }

    // get Name of partner
    getPartnerName = async (payload) => {
        const { action } = payload;
        const query = `SELECT name, partner_id FROM partners WHERE partner_type = ? AND is_deleted = FALSE`;
        return await executeQuery(query, [action]);
    }

    deletePartner = async (payload) => {
        const { partner_id } = payload;
        const partnerIds = Array.isArray(partner_id) ? partner_id : [partner_id];

        if (partnerIds.length === 0) {
            throw new BadRequestError("Danh sách partner_id không hợp lệ!");
        }

        const placeholders = partnerIds.map(() => '?').join(', ');
        const findQuery = `
            SELECT partner_id FROM partners
            WHERE partner_id IN (${placeholders}) AND is_deleted = FALSE;
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
            UPDATE partners
            SET is_deleted = TRUE
            WHERE partner_id IN (${placeholders});
        `;
        return await executeQuery(deleteQuery, partnerIds);
    }

    searchPartner = async (payload, query) => {
        const { page, limit } = query;
        const offset = (page - 1) * limit;
        const parsedLimit = parseInt(limit, 10);
        const parsedPage = parseInt(page, 10);

        if (isNaN(parsedLimit) || isNaN(parsedPage) || parsedLimit <= 0 || parsedPage <= 0) {
            throw new BadRequestError("Limit và page phải là số nguyên dương!");
        }

        const { search } = payload;
        if (search === '' || !search) {
            return this.getAllPartners(query);
        } else {
            
            const parsedLimit = parseInt(limit, 10);
            const parsedPage = parseInt(page, 10);
            if (
                isNaN(parsedLimit) ||
                isNaN(parsedPage) ||
                parsedLimit <= 0 ||
                parsedPage <= 0
            ) {
                throw new BadRequestError('Limit and page must be positive integers!');
            }

            const offset = (parsedPage - 1) * parsedLimit;
            
            const searchQuery = `
                SELECT
                    partner_id,
                    name,
                    partner_type,
                    phone,
                    email,
                    address
                FROM partners
                WHERE (name LIKE ? OR phone LIKE ? OR email LIKE ?)
                AND is_deleted = FALSE
                ORDER BY name ASC LIMIT ${parsedLimit} OFFSET ${offset};
            `;
            const searchParams = [`%${search}%`, `%${search}%`, `%${search}%`];

            const results = await executeQuery(searchQuery, searchParams);

            return results;
        }
    }
}

module.exports = new PartnerService();
