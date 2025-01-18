const { executeQuery } = require('../database/executeQuery')

class ParameterService {

    // create parameter
    createParameter = async (payload) => {
        const query = `
        INSERT INTO parameters (name, value)
        VALUES (?, ?)
        `;
        return executeQuery(query, [payload.name, payload.value]);
    }

    // get all parameters
    getAllParameters = async () => {
        const query = `SELECT * FROM parameters`;
        return executeQuery(query);
    }
}

module.exports = new ParameterService();