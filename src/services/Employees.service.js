const { executeQuery } = require('../database/executeQuery');

class EmployeeService {
    // Create partner
    createEmployee = async (payload) => {
        const query = `
        INSERT INTO employees (name, email, phone)
        VALUES (?, ?, ?)
        `;
        return executeQuery(query, [payload.name, payload.email , payload.phone]);
    }

    // Get all partners
    getAllEmployees = async () => {
        const query = `SELECT * FROM employees`;
        return executeQuery(query);
    }

    // Get partner by id
    getEmployeerById = async (payload) => {
        const query = `SELECT * FROM employees WHERE employee_id = ?`;
        return executeQuery(query, [payload.employee_id]);
    }

    // get Name of partner
    getEmployeeName = async () => {
        const query = `SELECT name, employee_id FROM employees`;
        return executeQuery(query);
    }
}

module.exports = new EmployeeService();
