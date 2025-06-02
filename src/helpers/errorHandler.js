const { ApiError } = require("../core/error");

function errorHandler(err, req, res, next) {

    console.log(err)
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            statusCode : err.statusCode,
            message: err.message,
            metadata: err.metadata || {},
        });
    }

    return res.status(500).json({
        message: "Internal Server Error",
        statusCode: 500,
        message: err.message || "Something went wrong",
        metadata: err.metadata || {},
    });
}

module.exports = errorHandler;