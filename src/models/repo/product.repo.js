const findCategoryById = async (id) => {
    const query = `SELECT * FROM categories WHERE category_id = ? AND is_deleted = FALSE`;
    return await executeQuery(query, [id]);
}

const findProductByInfo = async ({ name }) => {
    const query = `SELECT * FROM products WHERE name = ? AND is_deleted = FALSE`;
    return await executeQuery(query, [name]);
}

const findCategoryByInfo = async ({ name }) => {
    const query = `SELECT * FROM categories WHERE name = ? AND is_deleted = FALSE`;
    return await executeQuery(query, [name]);
}

module.exports = {
    findCategoryById,
    findProductByInfo,
    findCategoryByInfo,
}