const { executeQuery } = require('../database/executeQuery');
const { BadRequestError, NotFoundError, InternalServerError, ConflictError } = require('../core/error');
const { findProductByName, findManufacturer, findCategory } = require('../models/repo/parameter.repo');
const { getStockId, checkProduct, totalProduct } = require('../models/repo/stock.repo');
const { findPartnerByID } = require('../models/repo/partner.repo');
const { findEmployeeByID } = require('../models/repo/employees.repo');

class StockService {
    /**
     * Xử lý giao dịch nhập hoặc xuất kho.
     * @param {Object} payload - Dữ liệu giao dịch.
     * @param {'import' | 'export'} payload.action - Loại giao dịch.
     * @param {string} payload.product_name - iphone 14 pro max.
     * @param {string} payload.category_name - Điện thoại.
     * @param {string} payload.manufacturer - Apple.
     * @param {string} payload.partner_id - ID đối tác (chỉ bắt buộc khi nhập).
     * @param {string} payload.employee_id - ID nhân viên (chỉ bắt buộc khi xuất).
     * @param {number} payload.price_per_unit - Đơn giá lấy theo nhập xuất
     * @param {number} payload.quantity - Số lượng sản phẩm.
     * @returns {Promise<Object>} Kết quả giao dịch đã được lưu.
     */
    ImportItems = async (payload) => {
        const { product_name, category_name, manufacturer, partner_id, employee_id, price_per_unit, quantity, action, time } = payload;

        try {
            const foundProduct = await checkProduct(product_name, category_name, manufacturer);

            const foundPartner = await findPartnerByID(partner_id);
            const foundEmployee = await findEmployeeByID(employee_id);

            if (!foundPartner[0]) {
                throw new NotFoundError("Đối tác không tồn tại!");
            }

            if (!foundEmployee[0]) {
                throw new NotFoundError("Nhân viên không tồn tại!");
            }

            const Id_product = await findProductByName(product_name);
            const Id_manufacturer = await findManufacturer(manufacturer);
            const Id_category = await findCategory(category_name);

            if (!foundProduct[0]) {

                const insertProductQuery = `
                    INSERT INTO stock (product_id, category_id, manufacturer_id, stock_quantity)
                    VALUES (?, ?, ?, ?)
                `;

                await executeQuery(insertProductQuery, [Id_product[0].product_id, Id_category[0].category_id, Id_manufacturer[0].manufacturer_id, quantity]);
            } else {
                const updateProductQuery = `
                    UPDATE stock
                    SET stock_quantity = stock_quantity + ?
                    WHERE product_id = ? AND manufacturer_id = ? AND category_id = ?
                `;
                await executeQuery(updateProductQuery, [quantity, Id_product[0].product_id, Id_manufacturer[0].manufacturer_id, Id_category[0].category_id]);
            }

            const stock_id = await getStockId(Id_product[0].product_id, Id_manufacturer[0].manufacturer_id, Id_category[0].category_id);

            const insertTransactionQuery = `
                INSERT INTO transactions (action, stock_id, partner_id, employee_id, price_per_unit, quantity)
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            const insertTransaction = await executeQuery(insertTransactionQuery, [action, stock_id[0].stock_id, partner_id, employee_id, price_per_unit, quantity]);

            const insertPriceQuery = `
                INSERT INTO product_prices (stock_id, price_type, price, effective_date)
                VALUES (?, ?, ?, ?)
            `;
            const insertPrice = await executeQuery(insertPriceQuery, [stock_id[0].stock_id, action, price_per_unit, time]);

            return {
                product: await checkProduct(product_name, category_name, manufacturer),
                transaction: insertTransaction,
                price: insertPrice
            }

        } catch (error) {
            throw new InternalServerError(error.message);
        }
    }

    ExportItems = async (payload) => {
        const { product_name, category_name, manufacturer, partner_id, employee_id, price_per_unit, quantity, action, time } = payload;

        try {
            const foundProduct = await checkProduct(product_name, category_name, manufacturer);

            const foundEmployee = await findEmployeeByID(employee_id);
            const foundPartner = await findPartnerByID(partner_id);

            if (!foundEmployee[0]) {
                throw new NotFoundError("Nhân viên không tồn tại!");
            }
            if (!foundPartner[0]) {
                throw new NotFoundError("Đối tác không tồn tại!");
            }
            const Id_product = await findProductByName(product_name);
            const Id_manufacturer = await findManufacturer(manufacturer);
            const Id_category = await findCategory(category_name);

            if (!foundProduct[0]) {
                throw new ConflictError("Sản phẩm không tồn tại trong kho!");
            } else {
                if (foundProduct[0].quantity < quantity) {
                    throw new ConflictError("Số lượng sản phẩm trong kho không đủ!");
                } else {
                    const updateProductQuery = `
                        UPDATE stock
                        SET stock_quantity = stock_quantity - ?
                        WHERE product_id = ? AND manufacturer_id = ? AND category_id = ?
                    `;
                    await executeQuery(updateProductQuery, [quantity, Id_product[0].product_id, Id_manufacturer[0].manufacturer_id, Id_category[0].category_id]);
                }
            }

            const stock_id = await getStockId(Id_product[0].product_id, Id_manufacturer[0].manufacturer_id, Id_category[0].category_id);

            const insertTransactionQuery = `
                INSERT INTO transactions (action, stock_id, partner_id, employee_id, price_per_unit, quantity)
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            const insertTransaction = await executeQuery(insertTransactionQuery, [action, stock_id[0].stock_id, partner_id, employee_id, price_per_unit, quantity]);

            const insertPriceQuery = `
                INSERT INTO product_prices (stock_id, price_type, price, effective_date)
                VALUES (?, ?, ?, ?)
            `;
            const insertPrice = await executeQuery(insertPriceQuery, [stock_id[0].stock_id, action, price_per_unit, time]);

            return {
                product: await checkProduct(product_name, category_name, manufacturer),
                transaction: insertTransaction,
                price: insertPrice
            }

        } catch (error) {
            throw new InternalServerError(error.message);
        }
    }

    getStock = async (payload) => {
        const { limit, page, category_name, product_name, manufacturer, priceMax, priceMin, quantityMax, quantityMin, action } = payload;
        const parsedLimit = parseInt(limit, 10);
        const parsedPage = parseInt(page, 10);
    
        // Validate pagination
        if (isNaN(parsedLimit) || isNaN(parsedPage) || parsedLimit <= 0 || parsedPage <= 0) {
            throw new BadRequestError("Limit và page phải là số nguyên dương!");
        }
    
        const offset = (parsedPage - 1) * parsedLimit;
        let whereQuery = '';
        let havingQuery = '';
        let param = [];
    
        // WHERE clause conditions
        if (product_name) {
            whereQuery += ' AND p.name LIKE ?';
            param.push(`%${product_name}%`);
        }
        if (category_name) {
            whereQuery += ' AND c.name LIKE ?';
            param.push(`%${category_name}%`);
        }
        if (manufacturer) {
            whereQuery += ' AND m.name LIKE ?';
            param.push(`%${manufacturer}%`);
        }
    
        // Validate and handle quantity
        const parsedQuantityMax = quantityMax !== undefined ? parseFloat(quantityMax) : null;
        const parsedQuantityMin = quantityMin !== undefined ? parseFloat(quantityMin) : null;
    
        if (parsedQuantityMax !== null) {
            if (isNaN(parsedQuantityMax) || parsedQuantityMax < 0) {
                throw new BadRequestError("QuantityMax phải là số không âm!");
            }
            whereQuery += ' AND s.stock_quantity <= ?';
            param.push(parsedQuantityMax);
        }
        if (parsedQuantityMin !== null) {
            if (isNaN(parsedQuantityMin) || parsedQuantityMin < 0) {
                throw new BadRequestError("QuantityMin phải là số không âm!");
            }
            whereQuery += ' AND s.stock_quantity >= ?';
            param.push(parsedQuantityMin);
        }
    
        // Validate and handle price
        const parsedPriceMax = priceMax !== undefined ? parseFloat(priceMax) : null;
        const parsedPriceMin = priceMin !== undefined ? parseFloat(priceMin) : null;
        const priceType = action === 'import' ? 'import' : 'export';
    
        if (parsedPriceMax !== null) {
            if (isNaN(parsedPriceMax) || parsedPriceMax < 0) {
                throw new BadRequestError("PriceMax phải là số không âm!");
            }
            havingQuery += ' AND COALESCE(MAX(CASE WHEN pp.price_type = ? THEN pp.price END), 0) <= ?';
            param.push(priceType, parsedPriceMax);
        }
        if (parsedPriceMin !== null) {
            if (isNaN(parsedPriceMin) || parsedPriceMin < 0) {
                throw new BadRequestError("PriceMin phải là số không âm!");
            }
            havingQuery += ' AND COALESCE(MAX(CASE WHEN pp.price_type = ? THEN pp.price END), 0) >= ?';
            param.push(priceType, parsedPriceMin);
        }
    
        const query = `SELECT 
                        s.stock_id,
                        p.name AS product_name,
                        m.name AS manufacturer,
                        c.name AS category_name,
                        s.stock_quantity AS quantity,
                        COALESCE(
                            MAX(CASE WHEN pp.price_type = 'import' THEN pp.price END),
                            0
                        ) AS product_price_import,
                        COALESCE(
                            MAX(CASE WHEN pp.price_type = 'export' THEN pp.price END),
                            0
                        ) AS product_price_export
                    FROM 
                        stock s
                        INNER JOIN products p ON s.product_id = p.product_id
                        INNER JOIN manufacturers m ON s.manufacturer_id = m.manufacturer_id
                        LEFT JOIN categories c ON s.category_id = c.category_id
                        LEFT JOIN product_prices pp ON s.stock_id = pp.stock_id
                    WHERE
                        1=1
                        ${whereQuery}
                    GROUP BY 
                        s.stock_id,
                        p.name,
                        m.name,
                        c.name,
                        s.stock_quantity
                    HAVING
                        1=1
                        ${havingQuery}
                    ORDER BY 
                        category_name ASC,
                        manufacturer ASC,
                        product_name ASC
                    LIMIT ${parsedLimit} OFFSET ${offset};`;
    
        const countQuery = `SELECT COUNT(*) AS total
                    FROM (
                        SELECT s.stock_id
                        FROM 
                            stock s
                            INNER JOIN products p ON s.product_id = p.product_id
                            INNER JOIN manufacturers m ON s.manufacturer_id = m.manufacturer_id
                            LEFT JOIN categories c ON s.category_id = c.category_id
                            LEFT JOIN product_prices pp ON s.stock_id = pp.stock_id
                        WHERE
                            1=1
                            ${whereQuery}
                        GROUP BY 
                            s.stock_id,
                            p.name,
                            m.name,
                            c.name,
                            s.stock_quantity
                        HAVING
                            1=1
                            ${havingQuery}
                    ) AS subquery;`;
    
        const countResult = await executeQuery(countQuery, param);
        const totalItem = countResult[0].total;
        const data = await executeQuery(query, param);
    
        return {
            data,
            page: parsedPage,
            limit: parsedLimit,
            totalPage: Math.ceil(totalItem / parsedLimit),
            totalItem
        };
    };

    searchStock = async (payload, query) => {
        const { limit, page } = query;
        const { search } = payload;
        const parsedLimit = parseInt(limit, 10);
        const parsedPage = parseInt(page, 10);

        if (isNaN(parsedLimit) || isNaN(parsedPage) || parsedLimit <= 0 || parsedPage <= 0) {
            throw new BadRequestError("Limit và page phải là số nguyên dương!");
        }

        const offset = (parsedPage - 1) * parsedLimit;

        const queryStr = `
                SELECT 
                    s.stock_id,
                    p.name AS product_name,
                    m.name AS manufacturer,
                    c.name AS category_name,
                    s.stock_quantity AS quantity,
                    COALESCE(
                        MAX(CASE WHEN pp.price_type = 'import' THEN pp.price END),
                        'N/A'
                    ) AS product_price_import,
                    COALESCE(
                        MAX(CASE WHEN pp.price_type = 'export' THEN pp.price END),
                        'N/A'
                    ) AS product_price_export
                FROM 
                    stock s
                    INNER JOIN products p ON s.product_id = p.product_id
                    INNER JOIN manufacturers m ON s.manufacturer_id = m.manufacturer_id
                    LEFT JOIN categories c ON s.category_id = c.category_id
                    LEFT JOIN product_prices pp ON s.stock_id = pp.stock_id
                WHERE 
                    p.name LIKE ? 
                    OR c.name LIKE ? 
                    OR m.name LIKE ?
                GROUP BY 
                    s.stock_id,
                    p.name,
                    m.name,
                    c.name,
                    s.stock_quantity
                ORDER BY 
                    category_name ASC,
                    manufacturer ASC,
                    product_name ASC
                LIMIT ${parsedLimit} OFFSET ${offset};
            `;

        // Truy vấn đếm tổng số bản ghi
        const countQuery = `
                SELECT COUNT(*) AS total
                FROM (
                    SELECT s.stock_id
                    FROM 
                        stock s
                        INNER JOIN products p ON s.product_id = p.product_id
                        INNER JOIN manufacturers m ON s.manufacturer_id = m.manufacturer_id
                        LEFT JOIN categories c ON s.category_id = c.category_id
                        LEFT JOIN product_prices pp ON s.stock_id = pp.stock_id
                    WHERE 
                        p.name LIKE ? 
                        OR c.name LIKE ? 
                        OR m.name LIKE ?
                    GROUP BY 
                        s.stock_id,
                        p.name,
                        m.name,
                        c.name,
                        s.stock_quantity
                ) AS subquery;
            `;

        // Thực hiện cả hai truy vấn song song
        const params = [`%${search}%`, `%${search}%`, `%${search}%`];
        const data = await executeQuery(queryStr, params);
        const countResult = await executeQuery(countQuery, params);

        const totalItem = countResult[0].total || 0;
        const totalPage = Math.ceil(totalItem / parsedLimit);

        return {
            data: data,
            page: parsedPage,
            limit: parsedLimit,
            totalPage: totalPage,
            totalItem: totalItem
        };
    };

    totalItemInStock = async () => {
        const query = `
            SELECT SUM(stock_quantity) AS total_items
            FROM stock;
        `;
        const result = await executeQuery(query);
        return result[0].total_items;
    };

    totalUnsoldItemsInStock3Months = async () => {
        const query = `
            SELECT COALESCE(SUM(s.stock_quantity), 0) AS total_items
            FROM stock s
            LEFT JOIN transactions t 
                ON s.stock_id = t.stock_id 
                AND t.action = 'export' 
                AND t.created_at >= DATE_SUB(NOW(), INTERVAL 3 MONTH)
            WHERE t.transaction_id IS NULL;
        `;
        const result = await executeQuery(query);
        return result[0].total_items;
    };
}

module.exports = new StockService();