const { executeQuery } = require('../database/executeQuery');
const { BadRequestError } = require('../core/error');
const { findProductByName , findManufacturer , findCategory} = require('../models/repo/parameter.repo');
const { getStockId, checkProduct, totalProduct } = require('../models/repo/stock.repo');
const { findPartnerByID } = require('../models/repo/partner.repo');
const { findEmployeeByID } = require('../models/repo/employees.repo');
const { off } = require('../database/init.mysql');


class StockService {
    
/**
 * Xử lý giao dịch nhập hoặc xuất kho.
 * @param {Object} payload - Dữ liệu giao dịch.
 * @param {'import' | 'export'} payload.action - Loại giao dịch.
 * @param {string} payload.name_product - iphone 14 pro max.
 * @param {string} payload.name_category - Điện thoại.
 * @param {string} payload.manufacturer - Apple.
 * @param {string} payload.partner_id - ID đối tác (chỉ bắt buộc khi nhập).
 * @param {string} payload.employee_id - ID nhân viên (chỉ bắt buộc khi xuất).
 * @param {number} payload.price_per_unit - Đơn giá lấy theo nhập xuất
 * @param {number} payload.quantity - Số lượng sản phẩm.
 * @returns {Promise<Object>} Kết quả giao dịch đã được lưu.
 */
    ImportItems = async (payload) => {
        const { name_product, name_category, manufacturer, partner_id, employee_id, price_per_unit, quantity, action, time } = payload;

        console.log("payload", payload);
        try {
            const foundProduct = await checkProduct(name_product, name_category, manufacturer);

            const foundPartner = await findPartnerByID(partner_id);
            const foundEmployee = await findEmployeeByID(employee_id);

            if(!foundPartner[0]) {
                throw new BadRequestError("Đối tác không tồn tại!");
            }

            if(!foundEmployee[0]) {
                throw new BadRequestError("Nhân viên không tồn tại!");
            }

            const Id_product = await findProductByName(name_product);
            const Id_manufacturer = await findManufacturer(manufacturer);
            const Id_category = await findCategory(name_category);

            if(!foundProduct[0]) {

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
                product: await checkProduct(name_product, name_category, manufacturer),
                transaction: insertTransaction,
                price: insertPrice
            }
            
        } catch (error) {
            throw new BadRequestError(error.message);
        }
    }

    ExportItems = async (payload) => {
        const { name_product, name_category, manufacturer, partner_id, employee_id, price_per_unit, quantity, action, time } = payload;

        try {
            const foundProduct = await checkProduct(name_product, name_category, manufacturer);

            const foundEmployee = await findEmployeeByID(employee_id);
            const foundPartner = await findPartnerByID(partner_id);

            if(!foundEmployee[0]) {
                throw new BadRequestError("Nhân viên không tồn tại!");
            }
            if(!foundPartner[0]) {
                throw new BadRequestError("Đối tác không tồn tại!");
            }
            const Id_product = await findProductByName(name_product);
            const Id_manufacturer = await findManufacturer(manufacturer);
            const Id_category = await findCategory(name_category);

            if(!foundProduct[0]) {
                throw new BadRequestError("Sản phẩm không tồn tại trong kho!");
            } else {
                if(foundProduct[0].quantity < quantity) {
                    throw new BadRequestError("Số lượng sản phẩm trong kho không đủ!");
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
                product: await checkProduct(name_product, name_category, manufacturer),
                transaction: insertTransaction,
                price: insertPrice
            }
            
        } catch (error) {
            throw new BadRequestError(error.message);
        }
    }

    getStock = async (payload) => {
        const { limit, page, name_category, name_product, manufacturer } = payload;
        try {
            const parsedLimit = parseInt(limit, 10);
            const parsedPage = parseInt(page, 10);
            if (isNaN(parsedLimit) || isNaN(parsedPage) || parsedLimit <= 0 || parsedPage <= 0) {
                throw new BadRequestError("Limit và page phải là số nguyên dương!");
            }
            const offset = (parsedPage - 1) * parsedLimit;
    
            let addQuery = '';
            let param = [];
            if (name_product) {
                addQuery += ' AND p.name LIKE ?';
                param.push(`${name_product}`);
            }
            if (name_category) {
                addQuery += ' AND c.name LIKE ?';
                param.push(`${name_category}`);
            }
            if (manufacturer) {
                addQuery += ' AND m.name LIKE ?';
                param.push(`${manufacturer}`);
            }
    
            const query = `SELECT 
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
                        1=1
                        ${addQuery}
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
                        ${addQuery}
                    GROUP BY 
                        s.stock_id,
                        p.name,
                        m.name,
                        c.name,
                        s.stock_quantity
                ) AS subquery;`;
            const countResult = await executeQuery(countQuery, param);
            const totalItem = countResult[0].total;
            const data = await executeQuery(query, param);

            return {
                data: data,
                page: parsedPage,
                limit: parsedLimit,
                totalPage: Math.ceil(totalItem / parsedLimit),
                totalItem: totalItem
            }
        } catch (error) {
            throw new BadRequestError(error.message || "Lỗi khi lấy dữ liệu kho!");
        }
    };

    searchStock = async (payload, query) => {
        const { limit, page } = query;
        console.log("payload", payload);
        console.log("query", query);
        const { search } = payload;
        try {
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
        } catch (error) {
            throw new BadRequestError(error.message || "Lỗi khi tìm kiếm dữ liệu kho!");
        }
    };
}

module.exports = new StockService();