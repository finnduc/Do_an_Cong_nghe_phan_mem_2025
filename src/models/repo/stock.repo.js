const { executeQuery } = require('../../database/executeQuery')

const getStockId = async ( product_id, manufacturer_id, category_id ) => {
    const query = `
        SELECT stock_id FROM stock WHERE product_id = ? AND manufacturer_id = ? AND category_id = ?
    `;

    return await executeQuery(query, [product_id, manufacturer_id, category_id]);
}

const checkProduct = async ( name_product, name_category, manufacturer ) => {
    const query = `
        SELECT p.name, c.name, m.name
        FROM stock s
        JOIN products p ON s.product_id = p.product_id
        JOIN categories c ON s.category_id = c.category_id
        JOIN manufacturers m ON s.manufacturer_id = m.manufacturer_id
        WHERE p.name = ? AND c.name = ? AND m.name = ?
    `;
        
    return await executeQuery(query, [name_product, name_category, manufacturer]);
}

const totalProduct = async ( ) => {
    const query = `
        SELECT COUNT(*) AS total FROM stock;
    `;
        
    return await executeQuery(query);
}

module.exports = {
    getStockId,
    checkProduct,
    totalProduct
}