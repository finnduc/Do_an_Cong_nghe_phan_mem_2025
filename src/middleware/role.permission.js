const { ForbiddenError } = require('../core/error');
const { getUserPermissions, getRoles } = require('../models/repo/rbac.repo');

const HEADERS = {
  API_KEY: 'x-api-key',
  CLIENT_ID: 'x-client-id',
  AUTHORIZATION: 'authorization',
};

const hasPermission = ({ resource, permissions }) => {
  if (!resource || typeof resource !== 'string') {
    throw new Error('Resource must be a non-empty string');
  }

  const permissionList = Array.isArray(permissions) ? permissions : [permissions];

  if (!permissionList.length || !permissionList.every(p => typeof p === 'string')) {
    throw new Error('Permissions must be a non-empty array of strings or a single string');
  }

  return async (req, res, next) => {
    const userId = req.headers[HEADERS.CLIENT_ID];

    if (!userId) {
      return next(new ForbiddenError('Missing client ID in headers'));
    }

    try {
      const userPermissions = await getUserPermissions(userId);

      if (!Array.isArray(userPermissions)) {
        throw new Error('Invalid permissions format returned from getUserPermissions');
      }

      const isAllowed = userPermissions.some(
        ({ name, resource: res }) =>
          res === resource && permissionList.includes(name)
      );

      if (!isAllowed) {
        return next(
          new ForbiddenError(`Bạn không có quyền truy cập tài nguyên "${resource}" với quyền: ${permissionList.join(', ')}`)
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};


const hasRole = (roles) => {
  const roleList = Array.isArray(roles) 
    ? roles 
    : typeof roles === 'string' 
      ? [roles] 
      : [];

  if (!roleList.length || !roleList.every(r => typeof r === 'string')) {
    throw new Error('Roles must be a non-empty array of strings or a single string');
  }

  return async (req, res, next) => {
    const userId = req.headers[HEADERS.CLIENT_ID];

    if (!userId) {
      return next(new ForbiddenError('Missing client ID in headers'));
    }

    try {
      const userRoles = await getRoles(userId);

      if (!userRoles || typeof userRoles[0]?.name !== 'string') {
        throw new Error('Invalid role format from database');
      }

      const userRoleName = userRoles[0].name;

      const hasRequiredRole = roleList.includes(userRoleName);

      if (!hasRequiredRole) {
        return next(
          new ForbiddenError(
            `User does not have any of the required roles: ${roleList.join(', ')}`
          )
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};


module.exports = {
  hasPermission,
  hasRole,
};