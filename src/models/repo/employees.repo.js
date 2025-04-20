const { executeQuery } = require("../../database/executeQuery");

const findEmployeeByInfo = async ({ email , phone }) => {
    const query = `SELECT * FROM employees WHERE email = ? AND phone = ?`;
    return await executeQuery(query , [email , phone])
}

const findEmployeeByID = async (employeeID) => {
    const query = `SELECT * FROM employees WHERE employee_id = ?`;
    return await executeQuery(query, [employeeID]);
}

module.exports = {
    findEmployeeByInfo,
    findEmployeeByID,
}