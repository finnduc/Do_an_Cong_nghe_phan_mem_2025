const { BadRequestError, NotFoundError, InternalServerError } = require('../core/error');
const { executeQuery } = require('../database/executeQuery');
const { findNameAndCategory, findParameterById, findIdAndCategory, foundManufactuner, findProductByName, findManufacturer, findCategory, findParametersEx, findIdCategory, findIdManu, findIdProduct } = require('../models/repo/parameter.repo');

class ParameterService {

    createManu = async (payload) => {
        const { manufacturer } = payload;

        const foundManu = await foundManufactuner(manufacturer);

        if(foundManu[0]) {
            throw new BadRequestError("Nhà sản xuất đã tồn tại!");
        }

        const queryManufacturers = `
            INSERT INTO manufacturers (name)
            VALUES (?);
            `;

        const createManufacturer = await executeQuery(queryManufacturers, [manufacturer]);
        
        return createManufacturer;
    }

    updateManu = async (payload) => {
        const { manufacturer_id, manufacturer } = payload;
        const foundManu = await findIdManu(manufacturer_id);

        if (!foundManu[0]) {
            throw new NotFoundError("Không tìm thấy nhà sản xuất!");
        }

        const queryUpdateManufacturers = `
            UPDATE manufacturers
            SET name = ?
            WHERE manufacturer_id = ?;
        `;

        const updateManufacturers = await executeQuery(queryUpdateManufacturers, [manufacturer, manufacturer_id]);
        return updateManufacturers;
    }

    deleteManu = async (payload) => {
        const { manufacturer_id } = payload;
        const foundManu = await findIdManu(manufacturer_id);
        if (!foundManu[0]) {
            throw new NotFoundError("Không tìm thấy nhà sản xuất!");
        }

        const queryDeleteManufacturers = `
            DELETE FROM manufacturers
            WHERE manufacturer_id = ?;
        `;

        const deleteManufacturers = await executeQuery(queryDeleteManufacturers, [manufacturer_id]);

        return deleteManufacturers;
    }

    getManu = async () => {
        const queryManufacturers = `
            SELECT manufacturer_id, name FROM manufacturers;
        `;

        const manufacturers = await executeQuery(queryManufacturers);

        return manufacturers;
    }

    createCategory = async (payload) => {
        const { category } = payload;
        const foundCategory = await findCategory(category);
        if (foundCategory[0]) {
            throw new BadRequestError("Danh mục đã tồn tại!");
        }

        const queryCategories = `
        INSERT INTO categories (name)
        VALUES (?);
        `;

        const createCategory = await executeQuery(queryCategories, [category]);

        return createCategory;
    }

    updateCategory = async (payload) => {
        const { category_id, category } = payload;
        const foundCategory = await findIdCategory(category_id);
        if (!foundCategory[0]) {
            throw new NotFoundError("Không tìm thấy danh mục!");
        }

        const queryUpdateCategories = `
        UPDATE categories
        SET name = ?
        WHERE category_id = ?;
        `;

        const updateCategories = await executeQuery(queryUpdateCategories, [category, category_id]);
        return updateCategories;
    }

    deleteCategory = async (payload) => {
        const { category_id } = payload;
        const foundCategory = await findIdCategory(category_id);
        if (!foundCategory[0]) {
            throw new NotFoundError("Không tìm thấy danh mục!");
        }

        const queryDeleteCategories = `
            DELETE FROM categories
            WHERE category_id = ?;
        `;

        const deleteCategories = await executeQuery(queryDeleteCategories, [category_id]);
        return deleteCategories;
    }

    getCategory = async () => {
        const queryCategories = `
            SELECT category_id, name FROM categories;
        `;
        const categories = await executeQuery(queryCategories);
        return categories;
    }

    createParameter = async (payload) => {
        const { name_product, category_id , manufacturer_id } = payload;
        const foundProduct = await findProductByName(name_product);

        const foundManufacturer = await findIdManu(manufacturer_id);
        const foundCategory = await findIdCategory(category_id);

        if (!foundManufacturer[0]) {
            throw new NotFoundError("Không tìm thấy nhà sản xuất!");
        }
        if (!foundCategory[0]) {
            throw new NotFoundError("Không tìm thấy danh mục!");
        }
        
        if (foundProduct[0]) {
            throw new BadRequestError("Sản phẩm đã tồn tại!");
        }
        const queryProducts = `
        INSERT INTO products (name)
        VALUES (?);
        `;
        await executeQuery(queryProducts, [name_product]);
        
        const IdProduct = await findProductByName(name_product);
        
        const existsParameter = await findParametersEx(IdProduct[0].product_id, foundManufacturer[0].manufacturer_id, foundCategory[0].category_id);
        if (existsParameter[0]) {
            throw new NotFoundError("Tham số đã tồn tại!");
        }

        const query = `
                INSERT INTO parameters (product_id, manufacturer_id, category_id)
                VALUES (?, ?, ?);
            `;

        return await executeQuery(query, [IdProduct[0].product_id, foundManufacturer[0].manufacturer_id, foundCategory[0].category_id]);
    }

    updateParameter = async (payload) => {
        const { parameter_id, name_product, product_id , manufacturer_id, category_id } = payload;
        
        const foundParameter = await findParametersEx(parameter_id);

        if (!foundParameter[0]) {
            throw new NotFoundError("Không tìm thấy tham số!");
        }

        const foundProduct = await findIdProduct(product_id);
        if(!foundProduct[0]) {
            throw new NotFoundError("Không tìm thấy sản phẩm!");
        }

        const foundManufacturer = await findIdManu(manufacturer_id);
        if(!foundManufacturer[0]) {
            throw new NotFoundError("Không tìm thấy nhà sản xuất!");
        }

        const foundCategory = await findIdCategory(category_id);
        if(!foundCategory[0]) {
            throw new NotFoundError("Không tìm thấy danh mục!");
        }

        if( foundParameter[0].category_id !== foundCategory[0].category_id ) {
            const queryUpdate = `
                UPDATE parameters
                SET category_id = ?
                WHERE parameter_id = ?
                `;
            await executeQuery(queryUpdate, [foundCategory[0].category_id, parameter_id]);

        }
        
        if( foundParameter[0].manufacturer_id !== foundManufacturer[0].manufacturer_id ) {
            const queryUpdate = `
                UPDATE parameters
                SET manufacturer_id = ?
                WHERE parameter_id = ?
                `;
            await executeQuery(queryUpdate, [foundManufacturer[0].manufacturer_id, parameter_id]);
        }

        const updateProductName = `
            UPDATE products
            SET name = ?
            WHERE product_id = ?
        `;

        const updateProduct = await executeQuery(updateProductName, [name_product, product_id]);

        return updateProduct;
    };

    // get all parameters
    getAllParameters = async (payload) => {
        const { limit, page } = payload;
        const parsedLimit = parseInt(limit, 10);
        const parsedPage = parseInt(page, 10);
        if (isNaN(parsedLimit) || isNaN(parsedPage) || parsedLimit <= 0 || parsedPage <= 0) {
            throw new BadRequestError("Limit và page phải là số nguyên dương!");
        }
        const offset = (parsedPage - 1) * parsedLimit;

        const query = `
            SELECT param.parameter_id, 
                p.name AS product_name, 
                COALESCE(m.name, 'N/A') AS manufacturer_name, 
                COALESCE(c.name, 'N/A') AS category_name
            FROM parameters param
            JOIN products p ON param.product_id = p.product_id
            LEFT JOIN manufacturers m ON param.manufacturer_id = m.manufacturer_id
            LEFT JOIN categories c ON param.category_id = c.category_id
            ORDER BY category_name ASC, manufacturer_name ASC, product_name ASC
            LIMIT ${parsedLimit} OFFSET ${offset};
        `;

        return await executeQuery(query);
    }

    deleteParameter = async (payload) => {

        const { parameter_id } = payload;

        const query = `
                SELECT product_id , manufacturer_id , category_id
                FROM parameters
                WHERE parameter_id = ?;
            `;

        const foundParameter = await executeQuery(query, [parameter_id]);
        if (!foundParameter[0]) {
            throw new NotFoundError("Không tìm thấy tham số!");
        }

        const queryDeleteProduct = `
                DELETE FROM products
                WHERE product_id = ?;
            `;

        const deleteProduct = await executeQuery(queryDeleteProduct, [foundParameter[0].product_id]);

        const queryDeleteParameter = `
                DELETE FROM parameters
                WHERE parameter_id = ?;
            `;
        const deleteParameter = await executeQuery(queryDeleteParameter, [parameter_id]);

        return {
            product: deleteProduct,
            parameter: deleteParameter
        }
    }

    getParameterById = async (payload) => {
        const { parameter_id } = payload;
        const query = `
                SELECT p.product_id, p.name AS product_name, m.manufacturer_id, m.name AS manufacturer_name, c.category_id, c.name AS category_name
                FROM parameters param
                JOIN products p ON param.product_id = p.product_id
                JOIN manufacturers m ON param.manufacturer_id = m.manufacturer_id
                JOIN categories c ON param.category_id = c.category_id
                WHERE param.parameter_id = ?;
            `;

        return await executeQuery(query, [parameter_id]);
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
        const querySearch = `
                SELECT p.product_id, p.name AS product_name, m.manufacturer_id, m.name AS manufacturer_name, c.category_id, c.name AS category_name
                FROM parameters param
                JOIN products p ON param.product_id = p.product_id
                JOIN manufacturers m ON param.manufacturer_id = m.manufacturer_id
                JOIN categories c ON param.category_id = c.category_id
                WHERE p.name LIKE ? AND m.name LIKE ? AND c.name LIKE ?
                ORDER BY category_name ASC, manufacturer_name ASC, product_name ASC
                LIMIT ${parsedLimit} OFFSET ${offset};
            `;

        return await executeQuery(querySearch, [`%${search}%`, `%${search}%`, `%${search}%`]);
    }
}

module.exports = new ParameterService();