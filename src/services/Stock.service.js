const { executeQuery } = require('../database/executeQuery');
const { BadRequestError, NotFoundError, InternalServerError, ConflictError } = require('../core/error');
const { findProductByName, findManufacturer, findCategory, findIdProduct, findIdManu, findIdCategory } = require('../models/repo/parameter.repo');
const { getStockId, checkProduct, totalProduct } = require('../models/repo/stock.repo');
const { findPartnerByID } = require('../models/repo/partner.repo');
const { findEmployeeByID } = require('../models/repo/employees.repo');

class StockService {

    ImportItems = async (payload) => {
        const { partner_id, employee_id, action, time, items } = payload;
        
        // Validate partner and employee
        const foundPartner = await findPartnerByID(partner_id);
        const foundEmployee = await findEmployeeByID(employee_id);

        if (!foundPartner[0]) {
            throw new NotFoundError("Đối tác không tồn tại!");
        }

        if (!foundEmployee[0]) {
            throw new NotFoundError("Nhân viên không tồn tại!");
        }

        let totalAmount = 0;
        const stockUpdates = [];

        for (const item of items) {
            const { product_id, category_id, manufacturer_id, price_per_unit, quantity } = item;
            
            const Id_product = await findIdProduct(product_id);
            const Id_manufacturer = await findIdManu(manufacturer_id);
            const Id_category = await findIdCategory(category_id);

            if (!Id_product[0] || !Id_manufacturer[0] || !Id_category[0]) {
                throw new NotFoundError("Không tìm thấy thông tin sản phẩm, nhà sản xuất hoặc danh mục!");
            }

            const itemTotal = Number(price_per_unit) * Number(quantity);
            totalAmount += itemTotal;

            stockUpdates.push({
                product_id: Id_product[0].product_id,
                manufacturer_id: Id_manufacturer[0].manufacturer_id,
                category_id: Id_category[0].category_id,
                quantity,
                price_per_unit,
                stock_id: null
            });
        }

        totalAmount = Math.round(totalAmount * 100) / 100;

        if (totalAmount > 99999999.99) {
            throw new BadRequestError("Tổng tiền vượt quá giới hạn cho phép (99999999.99)");
        }

        try {
            // Create transaction header first
            const insertHeaderQuery = `
                INSERT INTO transaction_headers (
                    action,
                    partner_id,
                    employee_id,
                    total_amount,
                    created_at
                )
                VALUES (?, ?, ?, ?, ?)
            `;
            
            const headerResult = await executeQuery(insertHeaderQuery, [
                action,
                partner_id,
                employee_id,
                totalAmount,
                time || new Date()
            ]);

            // Get the inserted header_id
            const getHeaderIdQuery = `
                SELECT header_id 
                FROM transaction_headers 
                WHERE action = ? 
                AND partner_id = ? 
                AND employee_id = ? 
                AND total_amount = ? 
                ORDER BY created_at DESC 
                LIMIT 1
            `;
            
            const headerIdResult = await executeQuery(getHeaderIdQuery, [
                action,
                partner_id,
                employee_id,
                totalAmount
            ]);

            if (!headerIdResult || !headerIdResult[0] || !headerIdResult[0].header_id) {
                throw new InternalServerError("Không thể lấy header_id sau khi tạo transaction");
            }

            const headerId = headerIdResult[0].header_id;
            const results = [];

            for (const update of stockUpdates) {
                const foundProduct = await getStockId(
                    update.product_id,
                    update.manufacturer_id,
                    update.category_id
                );

                if (!foundProduct[0]) {
                    const insertProductQuery = `
                        INSERT INTO stock (product_id, category_id, manufacturer_id, stock_quantity)
                        VALUES (?, ?, ?, ?)
                    `;
                    await executeQuery(insertProductQuery, [
                        update.product_id,
                        update.category_id,
                        update.manufacturer_id,
                        update.quantity
                    ]);
                } else {
                    const updateProductQuery = `
                        UPDATE stock
                        SET stock_quantity = stock_quantity + ?
                        WHERE product_id = ? AND manufacturer_id = ? AND category_id = ? AND is_deleted = FALSE
                    `;
                    await executeQuery(updateProductQuery, [
                        update.quantity,
                        update.product_id,
                        update.manufacturer_id,
                        update.category_id
                    ]);
                }

                const stock_id = await getStockId(
                    update.product_id,
                    update.manufacturer_id,
                    update.category_id
                );

                if (!stock_id[0] || !stock_id[0].stock_id) {
                    throw new InternalServerError("Không thể lấy stock_id sau khi cập nhật");
                }

                update.stock_id = stock_id[0].stock_id;

                const insertItemQuery = `
                    INSERT INTO transaction_items (
                        header_id,
                        stock_id,
                        quantity,
                        price_per_unit_snapshot
                    )
                    VALUES (?, ?, ?, ?)
                `;
                const insertItem = await executeQuery(insertItemQuery, [
                    headerId,
                    update.stock_id,
                    update.quantity,
                    update.price_per_unit
                ]);

                const insertPriceQuery = `
                    INSERT INTO product_prices (stock_id, price_type, price, effective_date)
                    VALUES (?, ?, ?, ?)
                `;
                const insertPrice = await executeQuery(insertPriceQuery, [
                    update.stock_id,
                    action,
                    update.price_per_unit,
                    time || new Date()
                ]);

                results.push({
                    stock_id: update.stock_id,
                    transaction_item: insertItem,
                    price: insertPrice
                });
            }

            return {
                header_id: headerId,
                total_amount: totalAmount,
                items: results
            };
        } catch (error) {
            throw error;
        }
    }

    ExportItems = async (payload) => {
        const { partner_id, employee_id, action, time, items } = payload;
        
        const foundPartner = await findPartnerByID(partner_id);
        const foundEmployee = await findEmployeeByID(employee_id);

        if (!foundPartner[0]) {
            throw new NotFoundError("Đối tác không tồn tại!");
        }

        if (!foundEmployee[0]) {
            throw new NotFoundError("Nhân viên không tồn tại!");
        }

        let totalAmount = 0;
        const stockUpdates = [];

        for (const item of items) {
            const { product_id, category_id, manufacturer_id, price_per_unit, quantity } = item;
            
            const Id_product = await findIdProduct(product_id);
            const Id_manufacturer = await findIdManu(manufacturer_id);
            const Id_category = await findIdCategory(category_id);

            if (!Id_product[0] || !Id_manufacturer[0] || !Id_category[0]) {
                throw new NotFoundError("Không tìm thấy thông tin sản phẩm, nhà sản xuất hoặc danh mục!");
            }


            const foundProduct = await getStockId(
                Id_product[0].product_id,
                Id_manufacturer[0].manufacturer_id,
                Id_category[0].category_id
            );

            if (!foundProduct[0]) {
                throw new ConflictError("Sản phẩm không tồn tại trong kho!");
            }


            if (foundProduct[0].stock_quantity < quantity) {
                throw new ConflictError(`Số lượng sản phẩm trong kho không đủ! (Còn lại: ${foundProduct[0].stock_quantity})`);
            }


            const itemTotal = Number(price_per_unit) * Number(quantity);
            totalAmount += itemTotal;


            stockUpdates.push({
                product_id: Id_product[0].product_id,
                manufacturer_id: Id_manufacturer[0].manufacturer_id,
                category_id: Id_category[0].category_id,
                quantity,
                price_per_unit,
                stock_id: foundProduct[0].stock_id
            });
        }

        totalAmount = Math.round(totalAmount * 100) / 100;

        if (totalAmount > 99999999.99) {
            throw new BadRequestError("Tổng tiền vượt quá giới hạn cho phép (99999999.99)");
        }

        try {

            const insertHeaderQuery = `
                INSERT INTO transaction_headers (
                    action,
                    partner_id,
                    employee_id,
                    total_amount,
                    created_at
                )
                VALUES (?, ?, ?, ?, ?)
            `;
            
            await executeQuery(insertHeaderQuery, [
                action,
                partner_id,
                employee_id,
                totalAmount,
                time || new Date()
            ]);


            const getHeaderIdQuery = `
                SELECT header_id 
                FROM transaction_headers 
                WHERE action = ? 
                AND partner_id = ? 
                AND employee_id = ? 
                AND total_amount = ? 
                ORDER BY created_at DESC 
                LIMIT 1
            `;
            
            const headerIdResult = await executeQuery(getHeaderIdQuery, [
                action,
                partner_id,
                employee_id,
                totalAmount
            ]);

            if (!headerIdResult || !headerIdResult[0] || !headerIdResult[0].header_id) {
                throw new InternalServerError("Không thể lấy header_id sau khi tạo transaction");
            }

            const headerId = headerIdResult[0].header_id;
            const results = [];

            for (const update of stockUpdates) {
                const updateProductQuery = `
                    UPDATE stock
                    SET stock_quantity = stock_quantity - ?
                    WHERE stock_id = ? AND is_deleted = FALSE
                `;
                await executeQuery(updateProductQuery, [
                    update.quantity,
                    update.stock_id
                ]);

                const insertItemQuery = `
                    INSERT INTO transaction_items (
                        header_id,
                        stock_id,
                        quantity,
                        price_per_unit_snapshot
                    )
                    VALUES (?, ?, ?, ?)
                `;
                const insertItem = await executeQuery(insertItemQuery, [
                    headerId,
                    update.stock_id,
                    update.quantity,
                    update.price_per_unit
                ]);

                const insertPriceQuery = `
                    INSERT INTO product_prices (stock_id, price_type, price, effective_date)
                    VALUES (?, ?, ?, ?)
                `;
                const insertPrice = await executeQuery(insertPriceQuery, [
                    update.stock_id,
                    action,
                    update.price_per_unit,
                    time || new Date()
                ]);

                const checkStockQuery = `
                    SELECT stock_quantity
                    FROM stock
                    WHERE stock_id = ? AND is_deleted = FALSE
                `;
                const stockResult = await executeQuery(checkStockQuery, [update.stock_id]);
                
                if (stockResult[0] && stockResult[0].stock_quantity === 0) {
                    const deleteStockQuery = `
                        UPDATE stock
                        SET is_deleted = TRUE
                        WHERE stock_id = ?
                    `;
                    await executeQuery(deleteStockQuery, [update.stock_id]);
                }

                results.push({
                    stock_id: update.stock_id,
                    transaction_item: insertItem,
                    price: insertPrice
                });
            }

            return {
                header_id: headerId,
                total_amount: totalAmount,
                items: results
            };
        } catch (error) {
            throw error;
        }
    }

    getStock = async (payload) => {
        const { limit, page, category_name, product_name, manufacturer, priceMax, priceMin, quantityMax, quantityMin } = payload;
        const parsedLimit = parseInt(limit, 10);
        const parsedPage = parseInt(page, 10);


        if (isNaN(parsedLimit) || isNaN(parsedPage) || parsedLimit <= 0 || parsedPage <= 0) {
            throw new BadRequestError("Limit và page phải là số nguyên dương!");
        }

        const offset = (parsedPage - 1) * parsedLimit;
        let whereQuery = '';
        let havingQuery = '';
        let param = [];

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

        const parsedPriceMax = priceMax !== undefined ? parseFloat(priceMax) : null;
        const parsedPriceMin = priceMin !== undefined ? parseFloat(priceMin) : null;

        if (parsedPriceMax !== null) {
            if (isNaN(parsedPriceMax) || parsedPriceMax < 0) {
                throw new BadRequestError("PriceMax phải là số không âm!");
            }
            havingQuery += ' AND COALESCE(MAX(pp.price), 0) <= ?';
            param.push(parsedPriceMax);
        }
        if (parsedPriceMin !== null) {
            if (isNaN(parsedPriceMin) || parsedPriceMin < 0) {
                throw new BadRequestError("PriceMin phải là số không âm!");
            }
            havingQuery += ' AND COALESCE(MAX(pp.price), 0) >= ?';
            param.push(parsedPriceMin);
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
                        s.is_deleted = FALSE AND p.is_deleted = FALSE AND m.is_deleted = FALSE AND (c.is_deleted = FALSE OR c.is_deleted IS NULL)
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
                            s.is_deleted = FALSE AND p.is_deleted = FALSE AND m.is_deleted = FALSE AND (c.is_deleted = FALSE OR c.is_deleted IS NULL)
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
                    (p.name LIKE ? OR c.name LIKE ? OR m.name LIKE ?)
                    AND s.is_deleted = FALSE AND p.is_deleted = FALSE AND m.is_deleted = FALSE AND (c.is_deleted = FALSE OR c.is_deleted IS NULL)
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
                LIMIT ${parsedLimit} OFFSET ${offset}`;

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
                        (p.name LIKE ? OR c.name LIKE ? OR m.name LIKE ?)
                        AND s.is_deleted = FALSE AND p.is_deleted = FALSE AND m.is_deleted = FALSE AND (c.is_deleted = FALSE OR c.is_deleted IS NULL)
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
            FROM stock
            WHERE is_deleted = FALSE;
        `;
        const result = await executeQuery(query);
        return result[0].total_items;
    };

    totalUnsoldItemsInStock3Months = async () => {
        const query = `
            SELECT COALESCE(SUM(s.stock_quantity), 0) AS total_items
            FROM stock s
            WHERE s.stock_id NOT IN (
                SELECT DISTINCT ti.stock_id
                FROM transaction_items ti
                JOIN transaction_headers th ON ti.header_id = th.header_id
                WHERE th.action = 'export'
                AND th.created_at >= DATE_SUB(NOW(), INTERVAL 3 MONTH)
            )
            AND s.is_deleted = FALSE;
        `;
        const result = await executeQuery(query);
        return result[0].total_items;
    };
}

module.exports = new StockService();