const { executeQuery } = require("../../database/executeQuery");

const getUserByUserName = async (userName) => {
    const query = `SELECT * FROM users WHERE username = ?`;
    return await executeQuery(query, [userName]);
}

const findRoleBy = async (role) => {
    const query = `SELECT * FROM roles WHERE role = ?`;
    return await executeQuery(query, [role]);
}
// Lấy danh sách tất cả users
const getUsers = async () => {
    const query = `SELECT * FROM users`;
    return await executeQuery(query);
}

// Lấy ID từ username
const getIDByUsername = async (username) => {
    const query = `SELECT user_id FROM users WHERE username = ?`;
    return await executeQuery(query, [username]);
};

// Lấy mật khẩu hash từ username
const getPasswordHashByUserName = async (username) => {
    const query = `SELECT password FROM users WHERE username = ?`;
    return await executeQuery(query, [username]);
};

// Lấy mật khẩy hash từ user_id
const getPasswordHashByUserID = async (userID) => {
    const query = `SELECT password FROM users WHERE user_id = ?`;
    return await executeQuery(query, [userID]);
};

// Lấy thông tin user từ user_id
const findUserById = async (userID) => {
    const query = `SELECT * FROM users WHERE user_id = ?`;
    return await executeQuery(query, [userID]);
}

module.exports = {
    getUserByUserName,
    getUsers,
    getIDByUsername,
    getPasswordHashByUserName,
    getPasswordHashByUserID,
    findUserById,
    findRoleBy
};