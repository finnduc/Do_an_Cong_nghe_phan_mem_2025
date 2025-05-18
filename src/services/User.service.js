const { getUserByUserName, findUserById, findRoleBy } = require("../models/repo/user.repo");
const { executeQuery } = require("../database/executeQuery");
const { BadRequestError, ConflictError, InternalServerError, NotFoundError } = require("../core/error");

class UserService {
    createrUser = async (payload) => {
        const { userName, role_id , password } = payload;
        const foundUser = await getUserByUserName(userName);

        if (foundUser[0]) {
            throw new ConflictError("Người dùng này đã tồn tại!");
        }
            
        const query = `
                INSERT INTO users (username, password)
                VALUES (?, ?);
            `;
        await executeQuery(query, [userName, password]);

        const user_id = await getUserByUserName(userName);

        const insertRoleQuery = `
            INSERT INTO user_roles (user_id, role_id)
            VALUES (?, ?);
            `;
        await executeQuery(insertRoleQuery, [user_id[0].user_id, role_id]);
        return {
            user_id: user_id[0],
            role_id: role_id[0]
        }
    }

    updateUser = async (payload) => {
        const { user_id, userName, role_id , password } = payload;

        const foundUser = await findUserById(user_id);
        if (!foundUser[0]) {
            throw new NotFoundError("Không tìm thấy người dùng!");
        }

        // Cập nhật thông tin người dùng
        const query = `
                UPDATE users
                SET username = ?, password = ?
                WHERE user_id = ?;
            `;
        
        const queryUpdateRole = `
            UPDATE user_roles
            SET role_id = ?
            WHERE user_id = ?
            `;

        
        const updateUser =  await executeQuery(query, [userName, password, user_id]);
        const updateRole = await executeQuery(queryUpdateRole, [role_id, user_id]);

        return {
            user_id: user_id,
            role_id: role_id
        }
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
                SELECT users.*, r.name as role, r.description
                FROM users
                JOIN user_roles ur ON users.user_id = ur.user_id
                JOIN roles r ON ur.role_id = r.role_id
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

    getRoleUser = async () => {
        const query = `
                SELECT role_id, name FROM roles;
            `;
        return await executeQuery(query);
    }

}
module.exports = new UserService();