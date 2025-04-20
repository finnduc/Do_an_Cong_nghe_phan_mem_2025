class ApiError extends Error {
    constructor(statusCode, message = "Error", metadata = {}) {
        super(message);
        this.statusCode = statusCode;
        
        this.metadata = {
            error: message,
            ...metadata,
        };
        
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

class BadRequestError extends ApiError {
    constructor(message = "Bad Request", metadata = {}) {
        super(400, message, metadata);
    }
}

class UnauthorizedError extends ApiError {
    constructor(message = "Unauthorized", metadata = {}) {
        super(401, message, metadata);
    }
}

class ForbiddenError extends ApiError {
    constructor(message = "Forbidden", metadata = {}) {
        super(403, message, metadata);
    }
}

class NotFoundError extends ApiError {
    constructor(message = "Not Found", metadata = {}) {
        super(404, message, metadata);
    }
}

class ConflictError extends ApiError {
    constructor(message = "Conflict", metadata = {}) {
        super(409, message, metadata);
    }
}

class TooManyRequestsError extends ApiError {
    constructor(message = "Too Many Requests", metadata = {}) {
        super(429, message, metadata);
    }
}

// ✅ **LỖI PHÍA SERVER (5XX)**
class InternalServerError extends ApiError {
    constructor(message = "Internal Server Error", metadata = {}) {
        super(500, message, metadata);
    }
}

class NotImplementedError extends ApiError {
    constructor(message = "Not Implemented", metadata = {}) {
        super(501, message, metadata);
    }
}

class ServiceUnavailableError extends ApiError {
    constructor(message = "Service Unavailable", metadata = {}) {
        super(503, message, metadata);
    }
}

module.exports = {
    ApiError,

    // LỖI CLIENT (4XX)
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    ConflictError,
    TooManyRequestsError,

    // LỖI SERVER (5XX)
    InternalServerError,
    NotImplementedError,
    ServiceUnavailableError,
};
