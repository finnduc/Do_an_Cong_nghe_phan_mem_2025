const { BadRequestError } = require('../core/error');
const { BAD_REQUEST } = require('../core/respone');
const { executeQuery } = require('../database/executeQuery');
const { findEmployeeByInfo, findEmployeeByID } = require('../models/repo/employees.repo');

class EmployeeService {
    // Create partner
    createEmployee = async (payload) => {
        try {
            const foundEmployee = findEmployeeByInfo({ email: payload.email, phone: payload.email });

            if (foundEmployee[0]) {
                throw new BadRequestError("Nhân viên có số điện thoại và email này đã tồn tại!")
            }

            const query = `
                    INSERT INTO employees (name, email, phone)
                    VALUES (?, ?, ?)
                `;
            return executeQuery(query, [payload.name, payload.email, payload.phone]);

        } catch (error) {
            throw new BadRequestError(error.message);
        }
    }

    updateEmployees = async (payload) => {

        try {
            const foundEmployee = await findEmployeeByID(payload.employee_id);
            if (!foundEmployee[0]) {
                throw new BadRequestError("Nhân viên không tồn tại!");
            }

            const query = `
                UPDATE employees
                SET name = ?, email = ?, phone = ?
                WHERE employee_id = ?
            `;
            return executeQuery(query, [payload.name, payload.email, payload.phone, payload.employee_id]);
        } catch (error) {
            throw new BadRequestError(error.message);

        }
    }


    // Get all partners
    getAllEmployees = async ( payload ) => {
        try {
            const { page, limit } = payload;
            const offset = (page - 1) * limit;
            const parsedLimit = parseInt(limit, 10);
            const parsedPage = parseInt(page, 10);
            if (isNaN(parsedLimit) || isNaN(parsedPage) || parsedLimit <= 0 || parsedPage <= 0) {
                throw new BadRequestError("Limit và page phải là số nguyên dương!");
            }

            const query = `SELECT * FROM employees ORDER BY name ASC LIMIT ${parsedLimit} OFFSET ${offset};`;
            return executeQuery(query);
        } catch (error) {
            throw new BadRequestError(error.message);
        }
    }

    // Get partner by id
    getEmployeerById = async (payload) => {
        try {
            const { employee_id } = payload;
            const query = `SELECT * FROM employees WHERE employee_id = ?`;
            const employee = await executeQuery(query, [employee_id]);
            if (!employee[0]) {
                throw new BadRequestError("Nhân viên không tồn tại!");
            }

            return employee[0];
        } catch (error) {
            throw new BadRequestError(error.message);
        }
    }

    // get Name of partner
    getEmployeeName = async () => {
        try {
            const query = `SELECT employee_id, name FROM employees`;
            const employeeNames = await executeQuery(query);
            if (!employeeNames[0]) {
                throw new BadRequestError("Không có tên nhân viên nào!");
            }

            return employeeNames;
        } catch (error) {
            throw new BadRequestError(error.message);
        }
    }

    deleteEmployee = async (payload) => {
        try {
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
                throw new BadRequestError(`Không tìm thấy các employee_id sau: ${notFoundIds.join(', ')}`);
            }

            const deleteQuery = `
            DELETE FROM employees
            WHERE employee_id IN (${placeholders});
            `;
            return executeQuery(deleteQuery, employeeIds);
        } catch (error) {
            throw new BadRequestError(error.message);
        }
    }

    searchEmployee = async (body, query) => {
        try {
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
                throw new BadRequestError('Không tìm thấy nhân viên nào!');
            }
    
            return employees;
        } catch (error) {
            // Ensure all errors are thrown as BadRequestError with the error message
            throw new BadRequestError(error.message || 'An error occurred while searching employees.');
        }
    };
}

module.exports = new EmployeeService();
