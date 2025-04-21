const { BadRequestError, InternalServerError } = require('../core/error');
const { executeQuery } = require('../database/executeQuery');

class TransactionService {
    getTransaction = async (payload) => {
        const { limit, page, employee, partner, startTime, endTime, product_name, manufacturer, category_name, action } = payload;
        const parsedLimit = parseInt(limit, 10);
        const parsedPage = parseInt(page, 10);
        if (isNaN(parsedLimit) || isNaN(parsedPage) || parsedLimit <= 0 || parsedPage <= 0) {
            throw new BadRequestError("Limit và page phải là số nguyên dương!");
        }
        const offset = (parsedPage - 1) * parsedLimit;
        let addQuery = '';
        const params = [];

        if (employee) {
            addQuery += ' AND e.name LIKE ?';
            params.push(`%${employee}%`);
        }
        if (partner) {
            addQuery += ' AND pr.name LIKE ?';
            params.push(`%${partner}%`);
        }
        if (product_name) {
            addQuery += ' AND p.name LIKE ?';
            params.push(`%${product_name}%`);
        }
        if (manufacturer) {
            addQuery += ' AND m.name LIKE ?';
            params.push(`%${manufacturer}%`);
        }
        if (category_name) {
            addQuery += ' AND c.name LIKE ?';
            params.push(`%${category_name}%`);
        }

        if (action && ['import', 'export'].includes(action)) {
            addQuery += ' AND t.action = ?';
            params.push(action);
        }

        if (startTime) {
            addQuery += ' AND t.created_at >= ?';
            params.push(startTime);
        }
        if (endTime) {
            addQuery += ' AND t.created_at <= ?';
            params.push(endTime);
        }

        let query = `
                SELECT 
                    t.transaction_id,
                    t.action,
                    t.quantity,
                    t.price_per_unit,
                    t.created_at,
                    p.name AS product_name,
                    m.name AS manufacturer,
                    c.name AS category_name,
                    pr.name AS partner_name,
                    e.name AS employee_name
                FROM transactions t
                    LEFT JOIN stock s ON t.stock_id = s.stock_id
                    LEFT JOIN products p ON s.product_id = p.product_id
                    LEFT JOIN manufacturers m ON s.manufacturer_id = m.manufacturer_id
                    LEFT JOIN categories c ON s.category_id = c.category_id
                    LEFT JOIN partners pr ON t.partner_id = pr.partner_id
                    LEFT JOIN employees e ON t.employee_id = e.employee_id
                WHERE 1=1
                    ${addQuery}
                ORDER BY t.created_at DESC
                LIMIT ${parsedLimit} OFFSET ${offset}
            `;

        let countQuery = `
                SELECT COUNT(*) AS total
                FROM transactions t
                    LEFT JOIN stock s ON t.stock_id = s.stock_id
                    LEFT JOIN products p ON s.product_id = p.product_id
                    LEFT JOIN manufacturers m ON s.manufacturer_id = m.manufacturer_id
                    LEFT JOIN categories c ON s.category_id = c.category_id
                    LEFT JOIN partners pr ON t.partner_id = pr.partner_id
                    LEFT JOIN employees e ON t.employee_id = e.employee_id
                WHERE 1=1
                    ${addQuery}
            `;
        const countResult = await executeQuery(countQuery, params);
        const total = countResult[0].total;
        const results = await executeQuery(query, params);

        return {
            total: total,
            totalPage: Math.ceil(total / parsedLimit),
            page: parsedPage,
            limit: parsedLimit,
            data: results
        };
    }

    searchTransaction = async (payload, query) => {
        const { limit, page } = payload;
        const { search } = query;
        const parsedLimit = parseInt(limit, 10);
        const parsedPage = parseInt(page, 10);

        if (isNaN(parsedLimit) || isNaN(parsedPage) || parsedLimit <= 0 || parsedPage <= 0) {
            throw new BadRequestError("Limit và page phải là số nguyên dương!");
        }
        const offset = (parsedPage - 1) * parsedLimit;
    }

    totalTransactionsToday = async () => {
        const query = `
            SELECT COUNT(*) AS total_transactions
            FROM transactions
            WHERE DATE(created_at) = CURDATE();
        `;
        const result = await executeQuery(query);
        return result[0].total_transactions;
    };

    getTransactionQuantityStatsLast12Months = async () => {
        const query = `
            SELECT 
                DATE_FORMAT(created_at, '%Y-%m') AS month,
                COALESCE(SUM(CASE WHEN action = 'import' THEN quantity END), 0) AS import_quantity,
                COALESCE(SUM(CASE WHEN action = 'export' THEN quantity END), 0) AS export_quantity
            FROM transactions
            WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
            GROUP BY DATE_FORMAT(created_at, '%Y-%m')
            ORDER BY month DESC;
        `;
        const result = await executeQuery(query);
        return result;
    };
}

module.exports = new TransactionService();