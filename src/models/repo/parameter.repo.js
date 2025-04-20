const { executeQuery } = require("../../database/executeQuery");

const findProductByName = async (name) => {
    const query = `
        SELECT product_id
        FROM products
        WHERE name = ?
    `;
    return await executeQuery(query, [name]);
}

const findManufacturer = async (name) => {
    const query = `
        SELECT manufacturer_id
        FROM manufacturers
        WHERE name = ?
    `;
    return await executeQuery(query, [name]);
}

const findCategory = async (name) => {
    const query = `
        SELECT category_id
        FROM categories
        WHERE name = ?
    `;
    return await executeQuery(query, [name]);
}

const findIdAndCategory = async (name) => {
    const query = `
        SELECT category_id
        FROM categories
        WHERE name = ?
    `;
    return await executeQuery(query, [name]);
}

const findParametersEx = async (product_id, manufacturer_id, category_id) => {
    const query = `
        SELECT parameter_id
        FROM parameters
        WHERE product_id = ? AND manufacturer_id = ? AND category_id = ?
    `;
    return await executeQuery(query, [product_id, manufacturer_id, category_id]);
};  

const findParameterById = async (id) => {
    const query = `
        SELECT * FROM parameters WHERE parameter_id = ?;
    `;
    return await executeQuery(query, [id]);
}

const foundManufactuner = async ( manufacturer ) => {
    const query = `
        SELECT manufacturer_id, name
        FROM manufactuners
        WHERE name = ?
    `;

    return await executeQuery(query, [manufacturer]);
}

module.exports = {
    findIdAndCategory,
    findParameterById,
    findParametersEx,
    foundManufactuner,
    findProductByName,
    findManufacturer,
    findCategory,
}