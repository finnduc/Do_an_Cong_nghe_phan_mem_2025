const { executeQuery } = require("../../database/executeQuery");

const getRoles = async (user_id) => {
    const query = `
        SELECT r.name
        FROM roles r
        JOIN user_roles ur ON ur.role_id = r.role_id
        WHERE ur.user_id = ?
    `;

    return await executeQuery(query, [user_id]);
}

const getUserPermissions = async (user_id) => {
    const query = `
      SELECT 
        p.name AS permission_name,
        rs.name AS resource_name
      FROM user_roles ur
      JOIN role_permissions rp ON ur.role_id = rp.role_id
      JOIN permissions p ON rp.permission_id = p.permission_id
      JOIN resources rs ON rp.resource_id = rs.resource_id
      WHERE ur.user_id = ?
    `;
  
    const results = await executeQuery(query, [user_id]);
  
    return results.map(row => ({
      name: row.permission_name,
      resource: row.resource_name
    }));
  };

const getRole = async (user_id) => {
    const query = `
        SELECT r.name
        FROM roles r
        JOIN user_roles ur ON ur.role_id = r.role_id
        WHERE ur.user_id = ?
    `;

    return await executeQuery(query, [user_id]);
}
  

module.exports = {
    getRoles,
    getUserPermissions,
    getRole
}