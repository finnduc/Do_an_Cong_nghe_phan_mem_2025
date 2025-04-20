const { BadRequestError, NotFoundError, InternalServerError, ConflictError } = require('../core/error');
const { BAD_REQUEST } = require('../core/respone');
const { executeQuery } = require('../database/executeQuery');
const { findEmployeeByInfo, findEmployeeByID } = require('../models/repo/employees.repo');

class EmployeeService {

    // Create employee
    createEmployee = async (payload) => {
        const foundEmployee = await findEmployeeByInfo({ email: payload.email, phone: payload.phone });

        if (foundEmployee[0]) {
            throw new ConflictError("Nhân viên có số điện thoại và email này đã tồn tại!")
        }

        const query = `
                    INSERT INTO employees (name, email, phone, user_id)
                    VALUES (?, ?, ?, ?)
                `;
        return await executeQuery(query, [payload.name, payload.email, payload.phone, payload.user_id]);
    }

    // Update partner
    updateEmployees = async (payload) => {
        const foundEmployee = await findEmployeeByID(payload.employee_id);
        if (!foundEmployee[0]) {
            throw new NotFoundError("Nhân viên không tồn tại!");
        }

        const query = `
                UPDATE employees
                SET name = ?, email = ?, phone = ?
                WHERE employee_id = ?
            `;
        return await executeQuery(query, [payload.name, payload.email, payload.phone, payload.employee_id]);
    }


    // Get all partners
    getAllEmployees = async (payload) => {
        const { page, limit } = payload;
        const offset = (page - 1) * limit;
        const parsedLimit = parseInt(limit, 10);
        const parsedPage = parseInt(page, 10);
        if (isNaN(parsedLimit) || isNaN(parsedPage) || parsedLimit <= 0 || parsedPage <= 0) {
            throw new BadRequestError("Limit và page phải là số nguyên dương!");
        }

        const query = `
            SELECT 
                e.employee_id, 
                e.name, 
                e.email, 
                e.phone, 
                e.created_at, 
            COALESCE(u.username, '') AS username
            FROM employees e
            LEFT JOIN users u ON e.user_id = u.user_id
            ORDER BY e.name ASC
            LIMIT ${parsedLimit} OFFSET ${offset}`;
        const countQuery = `SELECT COUNT(*) AS total FROM employees;`;
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

    // Get partner by id
    getEmployeerById = async (payload) => {
        const { employee_id } = payload;
        const query = `SELECT * FROM employees WHERE employee_id = ?`;
        const employee = await executeQuery(query, [employee_id]);
        if (!employee[0]) {
            throw new NotFoundError("Nhân viên không tồn tại!");
        }

        return employee[0];
    }

    // get Name of partner
    getEmployeeName = async () => {
        const query = `SELECT employee_id, name FROM employees`;
        const employeeNames = await executeQuery(query);
        if (!employeeNames[0]) {
            throw new NotFoundError("Không có tên nhân viên nào!");
        }

        return employeeNames;
    }

    deleteEmployee = async (payload) => {
        const { employee_id } = payload;

        const employeeIds = Array.isArray(employee_id) ? employee_id : [employee_id];

        if (employeeIds.length === 0) {
            throw new BadRequestError("Danh sách employee_id không hợp lệ!");
        }

        const placeholders = employeeIds.map(() => '?').join(', ');
        const findQuery = `
            SELECT employee_id FROM employees
            WHERE employee_id IN (${placeholders});
        `;
        const foundEmployees = await executeQuery(findQuery, employeeIds);

        const foundIds = foundEmployees.map(employee => employee.employee_id);

        const notFoundIds = employeeIds.filter(id => !foundIds.includes(id));

        if (notFoundIds.length > 0) {
            throw new NotFoundError(`Không tìm thấy các employee_id sau: ${notFoundIds.join(', ')}`);
        }

        const deleteQuery = `
            DELETE FROM employees
            WHERE employee_id IN (${placeholders});
            `;
        return await executeQuery(deleteQuery, employeeIds);
    }

    searchEmployee = async (body, query) => {
        const { search } = body;
        const { limit, page } = query;

        // Validate search input
        if (!search || typeof search !== 'string') {
            throw new BadRequestError('Search term is required and must be a string!');
        }

        // Validate pagination parameters
        const parsedLimit = parseInt(limit, 10);
        const parsedPage = parseInt(page, 10);
        if (
            isNaN(parsedLimit) ||
            isNaN(parsedPage) ||
            parsedLimit <= 0 ||
            parsedPage <= 0
        ) {
            throw new BadRequestError('Limit and page must be positive integers!');
        }

        // Calculate offset
        const offset = (parsedPage - 1) * parsedLimit;

        // Use parameterized query to prevent SQL injection
        const searchQuery = `
                SELECT * FROM employees 
                WHERE name LIKE ? OR email LIKE ? OR phone LIKE ?
                LIMIT ${parsedLimit} OFFSET ${offset}
            `;
        const employees = await executeQuery(searchQuery, [
            `%${search}%`,
            `%${search}%`,
            `%${search}%`,
        ]);

        // Check if any employees were found
        if (employees.length === 0) {
            throw new NotFoundError('Không tìm thấy nhân viên nào!');
        }

        return employees;
    };
}

module.exports = new EmployeeService();
