const { ApiError } = require("../core/error");

function errorHandler(err, req, res, next) {

    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            statusCode : err.statusCode,
            metadata: err.metadata,
            stack: err.stack,
        });
    }

    return res.status(500).json({
        message: "Internal Server Error",
        statusCode: 500,
        metadata: { error: err.message },
        stack: { error : err.stack}
    });
}

module.exports = errorHandler;