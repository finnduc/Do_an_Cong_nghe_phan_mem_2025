const { executeQuery } = require('../../database/executeQuery');

const addInfo = async () => {
  const defaultDataQueries = [
    {
      query: `INSERT INTO users (username, password)
              SELECT 'superadmin', 'superadmin'
              WHERE (SELECT COUNT(*) FROM users) = 0`,
      params: []
    },

    // Insert manager role if it doesn't exist
    {
      query: `INSERT INTO roles (name, description)
              SELECT 'manager', 'Full access to all resources'
              WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'manager')`,
      params: []
    },

    // Insert employee role if it doesn't exist
    {
      query: `INSERT INTO roles (name, description)
              SELECT 'employee', 'Limited access to resources'
              WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'employee')`,
      params: []
    },

    // Insert read permission if it doesn't exist
    {
      query: `INSERT INTO permissions (name, description)
              SELECT 'read', 'Read access to resources'
              WHERE NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'read')`,
      params: []
    },

    // Insert create permission if it doesn't exist
    {
      query: `INSERT INTO permissions (name, description)
              SELECT 'create', 'Create new resources'
              WHERE NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'create')`,
      params: []
    },


    {
      query: `INSERT INTO permissions (name, description)
              SELECT 'update', 'Update existing resources'
              WHERE NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'update')`,
      params: []
    },

    // Insert delete permission if it doesn't exist
    {
      query: `INSERT INTO permissions (name, description)
              SELECT 'delete', 'Delete resources'
              WHERE NOT EXISTS (SELECT 1 FROM permissions WHERE name = 'delete')`,
      params: []
    },

    // Insert resources if they don't exist
    {
      query: `INSERT INTO resources (name, description)
              SELECT 'users', 'Resource for users table'
              WHERE NOT EXISTS (SELECT 1 FROM resources WHERE name = 'users')`,
      params: []
    },

    {
      query: `INSERT INTO resources (name, description)
              SELECT 'api_keys', 'Resource for api_keys table'
              WHERE NOT EXISTS (SELECT 1 FROM resources WHERE name = 'api_keys')`,
      params: []
    },

    {
      query: `INSERT INTO resources (name, description)
              SELECT 'categories', 'Resource for categories table'
              WHERE NOT EXISTS (SELECT 1 FROM resources WHERE name = 'categories')`,
      params: []
    },

    {
      query: `INSERT INTO resources (name, description)
              SELECT 'manufacturers', 'Resource for manufacturers table'
              WHERE NOT EXISTS (SELECT 1 FROM resources WHERE name = 'manufacturers')`,
      params: []
    },

    {
      query: `INSERT INTO resources (name, description)
              SELECT 'products', 'Resource for products table'
              WHERE NOT EXISTS (SELECT 1 FROM resources WHERE name = 'products')`,
      params: []
    },

    {
      query: `INSERT INTO resources (name, description)
              SELECT 'stock', 'Resource for stock table'
              WHERE NOT EXISTS (SELECT 1 FROM resources WHERE name = 'stock')`,
      params: []
    },

    {
      query: `INSERT INTO resources (name, description)
              SELECT 'product_prices', 'Resource for product_prices table'
              WHERE NOT EXISTS (SELECT 1 FROM resources WHERE name = 'product_prices')`,
      params: []
    },

    {
      query: `INSERT INTO resources (name, description)
              SELECT 'partners', 'Resource for partners table'
              WHERE NOT EXISTS (SELECT 1 FROM resources WHERE name = 'partners')`,
      params: []
    },

    {
      query: `INSERT INTO resources (name, description)
              SELECT 'employees', 'Resource for employees table'
              WHERE NOT EXISTS (SELECT 1 FROM resources WHERE name = 'employees')`,
      params: []
    },

    {
      query: `INSERT INTO resources (name, description)
              SELECT 'transactions', 'Resource for transactions table'
              WHERE NOT EXISTS (SELECT 1 FROM resources WHERE name = 'transactions')`,
      params: []
    },

    {
      query: `INSERT INTO resources (name, description)
              SELECT 'parameters', 'Resource for parameters table'
              WHERE NOT EXISTS (SELECT 1 FROM resources WHERE name = 'parameters')`,
      params: []
    },

    {
      query: `INSERT INTO resources (name, description)
              SELECT 'roles', 'Resource for roles table'
              WHERE NOT EXISTS (SELECT 1 FROM resources WHERE name = 'roles')`,
      params: []
    },

    {
      query: `INSERT INTO resources (name, description)
              SELECT 'permissions', 'Resource for permissions table'
              WHERE NOT EXISTS (SELECT 1 FROM resources WHERE name = 'permissions')`,
      params: []
    },

    {
      query: `INSERT INTO resources (name, description)
              SELECT 'resources', 'Resource for resources table'
              WHERE NOT EXISTS (SELECT 1 FROM resources WHERE name = 'resources')`,
      params: []
    },

    {
      query: `INSERT INTO resources (name, description)
              SELECT 'user_roles', 'Resource for user_roles table'
              WHERE NOT EXISTS (SELECT 1 FROM resources WHERE name = 'user_roles')`,
      params: []
    },

    {
      query: `INSERT INTO resources (name, description)
              SELECT 'role_permissions', 'Resource for role_permissions table'
              WHERE NOT EXISTS (SELECT 1 FROM resources WHERE name = 'role_permissions')`,
      params: []
    },

    // Assign superadmin to manager role by inserting user_id and role_id into user_roles
    {
      query: `INSERT INTO user_roles (user_id, role_id)
              SELECT u.user_id, r.role_id
              FROM users u
              JOIN roles r ON r.name = 'manager'
              WHERE u.username = 'superadmin'
              ON DUPLICATE KEY UPDATE user_id = u.user_id`,
      params: []
    },

    // Assign permissions to manager (full access to all resources)
    {
      query: `INSERT INTO role_permissions (role_id, permission_id, resource_id)
              SELECT r.role_id, p.permission_id, res.resource_id
              FROM roles r
              JOIN permissions p ON p.name IN ('read', 'create', 'update', 'delete')
              JOIN resources res
              WHERE r.name = 'manager'
              ON DUPLICATE KEY UPDATE role_id = r.role_id`,
      params: []
    },

    // Assign read permission to employee for all resources
    {
      query: `INSERT INTO role_permissions (role_id, permission_id, resource_id)
              SELECT r.role_id, p.permission_id, res.resource_id
              FROM roles r
              JOIN permissions p ON p.name = 'read'
              JOIN resources res
              WHERE r.name = 'employee'
              ON DUPLICATE KEY UPDATE role_id = r.role_id`,
      params: []
    },

    // Assign update permission to employee for stock resource
    {
      query: `INSERT INTO role_permissions (role_id, permission_id, resource_id)
              SELECT r.role_id, p.permission_id, res.resource_id
              FROM roles r
              JOIN permissions p ON p.name = 'update'
              JOIN resources res ON res.name = 'stock'
              WHERE r.name = 'employee'
              ON DUPLICATE KEY UPDATE role_id = r.role_id`,
      params: []
    },

    {
      query: `INSERT INTO role_permissions (role_id, permission_id, resource_id)
              SELECT r.role_id, p.permission_id, res.resource_id
              FROM roles r
              JOIN permissions p ON p.name = 'update'
              JOIN resources res ON res.name = 'users'
              WHERE r.name = 'employee'
              ON DUPLICATE KEY UPDATE role_id = r.role_id`,
      params: []
    }
  ];

  try {
    // Execute default data queries
    for (const [index, { query, params }] of defaultDataQueries.entries()) {
      await executeQuery(query, params);
      console.log(`Default data query ${index + 1} executed successfully`);
    }
    console.log('All default data inserted successfully');
  } catch (error) {
    console.error('Error inserting default data:', error.message);
    throw error;
  }
};

module.exports = {
  addInfo
};