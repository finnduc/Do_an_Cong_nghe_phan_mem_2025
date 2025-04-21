const { getUserByUserName, findUserById } = require("../models/repo/user.repo");
const { executeQuery } = require("../database/executeQuery");
const { BadRequestError, ConflictError, InternalServerError, NotFoundError } = require("../core/error");

class UserService {
    createrUser = async (payload) => {
        const { userName, role, password } = payload;
        const foundUser = await getUserByUserName(userName);

        if (foundUser[0]) {
            throw new ConflictError("Người dùng này đã tồn tại!");
        }
        const query = `
                INSERT INTO users (username, role, password)
                VALUES (?, ?, ?);
            `;
        return await executeQuery(query, [userName, role, password]);
    }

    updateUser = async (payload) => {
        const { user_id, userName, role, password } = payload;
        // Kiểm tra user_id có tồn tại không
        const foundUser = await findUserById(user_id);
        if (!foundUser[0]) {
            throw new NotFoundError("Không tìm thấy người dùng!");
        }

        // Cập nhật thông tin người dùng
        const query = `
                UPDATE users
                SET username = ?, role = ? , password = ?
                WHERE user_id = ?;
            `;
        return await executeQuery(query, [userName, role, password, user_id]);
    }

    deleteUser = async (payload) => {
        const { user_id } = payload;
        const userIds = Array.isArray(user_id) ? user_id : [user_id];

        if (userIds.length === 0) {
            throw new BadRequestError("Danh sách user_id không hợp lệ!");
        }

        const placeholders = userIds.map(() => '?').join(', ');
        const findQuery = `
                SELECT user_id FROM users
                WHERE user_id IN (${placeholders});
            `;
        const foundUsers = await executeQuery(findQuery, userIds);
        const foundIds = foundUsers.map(user => user.user_id);

        const notFoundIds = userIds.filter(id => !foundIds.includes(id));

        if (notFoundIds.length > 0) {
            throw new NotFoundError(`Không tìm thấy các user_id sau: ${notFoundIds.join(', ')}`);
        }

        const deleteQuery = `
                DELETE FROM users
                WHERE user_id IN (${placeholders});
            `;
        return await executeQuery(deleteQuery, userIds);
    };


    getAllUsers = async (payload) => {
        const { limit, page } = payload;
        const parsedLimit = parseInt(limit, 10);
        const parsedPage = parseInt(page, 10);
        if (isNaN(parsedLimit) || isNaN(parsedPage) || parsedLimit <= 0 || parsedPage <= 0) {
            throw new BadRequestError("Limit và page phải là số nguyên dương!");
        }
        const offset = (parsedPage - 1) * parsedLimit;

        const query = `
                SELECT * FROM users
                LIMIT ${parsedLimit} OFFSET ${offset};
            `;
        const countQuery = `
                SELECT COUNT(*) AS total FROM users;
            `;
        const countResult = await executeQuery(countQuery);
        const total = countResult[0].total;
        const results = await executeQuery(query);

        return {
            total: total,
            totalPage: Math.ceil(total / parsedLimit),
            page: parsedPage,
            limit: parsedLimit,
            data: results
        };
    }

    getUserById = async (user_id) => {
        const query = `
                SELECT * FROM users
                WHERE user_id = ?;
            `;
        return await executeQuery(query, [user_id]);
    }

    searchUser = async (payload, query) => {
        const { page, limit } = query;
        const offset = (page - 1) * limit;
        const parsedLimit = parseInt(limit, 10);
        const parsedPage = parseInt(page, 10);

        if (isNaN(parsedLimit) || isNaN(parsedPage) || parsedLimit <= 0 || parsedPage <= 0) {
            throw new BadRequestError("Limit và page phải là số nguyên dương!");
        }

        const { userName } = payload;
        const searchQuery = `
                SELECT * FROM users
                WHERE username LIKE ? OR role LIKE ?
                LIMIT ${parsedLimit} OFFSET ${offset};
            `;
        return await executeQuery(searchQuery, [`%${userName}%`], [`%${userName}%`]);
    }

    getNameUser = async () => {
        const query = `
                SELECT username, user_id FROM users;
            `;
        return await executeQuery(query);
    }

}
module.exports = new UserService();