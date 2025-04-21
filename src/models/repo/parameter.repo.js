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

const findParametersEx = async (parameter_id) => {
    const query = `
        SELECT parameter_id, product_id, manufacturer_id, category_id
        FROM parameters
        WHERE parameter_id = ?
    `;
    return await executeQuery(query, [parameter_id]);
};  

const findParameterById = async (id) => {
    const query = `
        SELECT * FROM parameters WHERE parameter_id = ?;
    `;
    return await executeQuery(query, [id]);
}

const foundManufactuner = async ( manufacturer ) => {
    const query = `
        SELECT manufacturer_id
        FROM manufacturers
        WHERE name = ?
    `;

    return await executeQuery(query, [manufacturer]);
}

const findIdCategory = async (id) => {
    const query = `
        SELECT category_id , name
        FROM categories
        WHERE category_id = ?
    `;

    return await executeQuery(query, [id]);
}

const findIdManu = async (id) => {
    const query = `
        SELECT manufacturer_id, name
        FROM manufacturers
        WHERE manufacturer_id = ?
    `;

    return await executeQuery(query, [id]);
}

const findIdProduct = async (id) => {
    const query = `
        SELECT product_id, name
        FROM products
        WHERE product_id = ?
    `;

    return await executeQuery(query, [id]);
}

module.exports = {
    findIdAndCategory,
    findParameterById,
    findParametersEx,
    foundManufactuner,
    findProductByName,
    findManufacturer,
    findCategory,
    findIdCategory,
    findIdManu,
    findIdProduct
}