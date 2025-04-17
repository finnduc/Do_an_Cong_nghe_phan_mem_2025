const { BadRequestError } = require('../core/error');
const { executeQuery } = require('../database/executeQuery');
const { findNameAndCategory, findParameterById, findIdAndCategory, foundManufactuner, findProductByName, findManufacturer, findCategory, findParametersEx } = require('../models/repo/parameter.repo');

class ParameterService {
    createParameter = async (payload) => {
        const { name_product, name_category, manufacturer } = payload;

        try {
            const foundProduct = await findProductByName(name_product);
            const foundManufacturer = await findManufacturer(manufacturer);
            const foundCategory = await findCategory(name_category);

            if (!foundProduct[0]) {
                const queryProducts = `
                    INSERT INTO products (name)
                    VALUES (?);
                `;
                await executeQuery(queryProducts, [name_product]);
            }


            if (!foundManufacturer[0]) {
                const queryManufacturers = `
                    INSERT INTO manufacturers (name)
                    VALUES (?);
                `;
                await executeQuery(queryManufacturers, [manufacturer]);
            }


            if (!foundCategory[0]) {
                const queryCategories = `
                    INSERT INTO categories (name)
                    VALUES (?);
                `;
                await executeQuery(queryCategories, [name_category]);
            }

            const IdProduct = await findProductByName(name_product);
            const IdManufacturer = await findManufacturer(manufacturer);
            const IdCategory = await findIdAndCategory(name_category);

            const existsParameter = await findParametersEx(IdProduct[0].product_id, IdManufacturer[0].manufacturer_id, IdCategory[0].category_id);
            if (existsParameter[0]) {
                throw new BadRequestError("Tham số đã tồn tại!");
            }

            const query = `
                INSERT INTO parameters (product_id, manufacturer_id, category_id)
                VALUES (?, ?, ?);
            `;

            return executeQuery(query, [IdProduct[0].product_id, IdManufacturer[0].manufacturer_id, IdCategory[0].category_id]);

        } catch (error) {
            throw new BadRequestError(error.message);
        }
    }

    updateParameter = async (payload) => {
        const { parameter_id, name_product, name_category, manufacturer } = payload;
        try {
            const foundParameter = await findParameterById(parameter_id);

            console.log(foundParameter[0]);
            if (!foundParameter[0]) {
                throw new BadRequestError("Không tìm thấy tham số!");
            }

            const queryUpdateProduct = `
                UPDATE products
                SET name = ?
                WHERE product_id = ?;
            `;
            
            const updateProduct = await executeQuery(queryUpdateProduct, [name_product, foundParameter[0].product_id]);

            const queryUpdateManufacturer = `
                UPDATE manufacturers
                SET name = ?
                WHERE manufacturer_id = ?;
            `;

            const updateManufacturer = await executeQuery(queryUpdateManufacturer, [manufacturer, foundParameter[0].manufacturer_id]);

            const queryUpdateCategory = `
                UPDATE categories
                SET name = ?
                WHERE category_id = ?;
            `;

            const updateCategory = await executeQuery(queryUpdateCategory, [name_category, foundParameter[0].category_id]);

            return {
                product: updateProduct,
                manufacturer: updateManufacturer,
                category: updateCategory
            }
        } catch (error) {
            throw new BadRequestError(error.message);
        }
    };

    // get all parameters
    getAllParameters = async ( payload ) => {
        const { limit, page } = payload;
        const parsedLimit = parseInt(limit, 10);
        const parsedPage = parseInt(page, 10);
        if (isNaN(parsedLimit) || isNaN(parsedPage) || parsedLimit <= 0 || parsedPage <= 0) {
            throw new BadRequestError("Limit và page phải là số nguyên dương!");
        }
        const offset = (parsedPage - 1) * parsedLimit;

        const query = `
            SELECT p.product_id, p.name AS product_name, m.manufacturer_id, m.name AS manufacturer_name, c.category_id, c.name AS category_name
            FROM parameters param
            JOIN products p ON param.product_id = p.product_id
            JOIN manufacturers m ON param.manufacturer_id = m.manufacturer_id
            JOIN categories c ON param.category_id = c.category_id
            ORDER BY category_name ASC, manufacturer_name ASC, product_name ASC
            LIMIT ${parsedLimit} OFFSET ${offset};
        `;

        return executeQuery(query);
    }

    deleteParameter = async (payload) => {

        const { parameter_id } = payload;
        
        try {
            const query = `
                SELECT product_id , manufacturer_id , category_id
                FROM parameters
                WHERE parameter_id = ?;
            `;

            const foundParameter = await executeQuery(query, [parameter_id]);
            if (!foundParameter[0]) {
                throw new BadRequestError("Không tìm thấy tham số!");
            }

            const queryDeleteProduct = `
                DELETE FROM products
                WHERE product_id = ?;
            `;

            const deleteProduct = await executeQuery(queryDeleteProduct, [foundParameter[0].product_id]);

            const queryDeleteManufacturer = `
                DELETE FROM manufacturers
                WHERE manufacturer_id = ?;
            `;
            const deleteManufacturer = await executeQuery(queryDeleteManufacturer, [foundParameter[0].manufacturer_id]);

            const queryDeleteCategory = `
                DELETE FROM categories
                WHERE category_id = ?;
            `;

            const deleteCategory = await executeQuery(queryDeleteCategory, [foundParameter[0].category_id]);
        } catch (error) {
            throw new BadRequestError(error.message);

        }
    }

    getParameterById = async (payload) => {
        const { parameter_id } = payload;
        try {
            const query = `
                SELECT p.product_id, p.name AS product_name, m.manufacturer_id, m.name AS manufacturer_name, c.category_id, c.name AS category_name
                FROM parameters param
                JOIN products p ON param.product_id = p.product_id
                JOIN manufacturers m ON param.manufacturer_id = m.manufacturer_id
                JOIN categories c ON param.category_id = c.category_id
                WHERE param.parameter_id = ?;
            `;

            return executeQuery(query, [parameter_id]);
        } catch (error) {
            throw new BadRequestError(error.message);
        }
    };

    searchParameter = async (payload, query) => {
        const { search } = payload;
        const { limit, page } = query;
        const parsedLimit = parseInt(limit, 10);
        const parsedPage = parseInt(page, 10);
        if (isNaN(parsedLimit) || isNaN(parsedPage) || parsedLimit <= 0 || parsedPage <= 0) {
            throw new BadRequestError("Limit và page phải là số nguyên dương!");
        }
        const offset = (parsedPage - 1) * parsedLimit;

        try {
            const query = `
                SELECT p.product_id, p.name AS product_name, m.manufacturer_id, m.name AS manufacturer_name, c.category_id, c.name AS category_name
                FROM parameters param
                JOIN products p ON param.product_id = p.product_id
                JOIN manufacturers m ON param.manufacturer_id = m.manufacturer_id
                JOIN categories c ON param.category_id = c.category_id
                WHERE p.name LIKE ? AND m.name LIKE ? AND c.name LIKE ?
                ORDER BY category_name ASC, manufacturer_name ASC, product_name ASC
                LIMIT ${parsedLimit} OFFSET ${offset};
            `;

            return executeQuery(query, [`%${search}%`, `%${search}%`, `%${search}%`]);
        } catch (error) {
            throw new BadRequestError(error.message);
        }
    }

}

module.exports = new ParameterService();