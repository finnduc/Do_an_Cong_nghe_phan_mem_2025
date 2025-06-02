// Định nghĩa các mã trạng thái HTTP
const statusCode = {
    // Thành công
    OK: 200,              // Khi yêu cầu thành công và có dữ liệu trả về
    CREATED: 201,         // Khi một tài nguyên mới được tạo thành công
    ACCEPTED: 202,        // Khi yêu cầu đã được chấp nhận nhưng chưa hoàn thành
    NO_CONTENT: 204,      // Khi yêu cầu thành công nhưng không có nội dung trả về

    // Lỗi client
    BAD_REQUEST: 400,     // Khi yêu cầu không hợp lệ hoặc sai cú pháp
    UNAUTHORIZED: 401,    // Khi người dùng không có quyền truy cập tài nguyên
    FORBIDDEN: 403,       // Khi người dùng không có quyền truy cập tài nguyên
    NOT_FOUND: 404,       // Khi tài nguyên yêu cầu không tồn tại

    // Lỗi server
    METHOD_NOT_ALLOWED: 405, // Khi phương thức HTTP không được phép cho tài nguyên
    CONFLICT: 409,        // Khi có xung đột với trạng thái hiện tại của tài nguyên
    INTERNAL_SERVER_ERROR: 500, // Lỗi server, yêu cầu không thể hoàn thành
};

// Định nghĩa các lý do tương ứng cho các mã trạng thái HTTP
const reasonStatusCode = {
    // Thành công
    OK: 'Success!',              // Mã trạng thái 200 - Thành công
    CREATED: 'Created!',         // Mã trạng thái 201 - Tài nguyên được tạo thành công
    ACCEPTED: 'Request Accepted!', // Mã trạng thái 202 - Yêu cầu đã được chấp nhận
    NO_CONTENT: 'No Content!',     // Mã trạng thái 204 - Không có nội dung trả về

    // Lỗi client
    BAD_REQUEST: 'Bad Request!',     // Mã trạng thái 400 - Yêu cầu không hợp lệ
    UNAUTHORIZED: 'Unauthorized!',   // Mã trạng thái 401 - Không có quyền truy cập tài nguyên
    FORBIDDEN: 'Forbidden!',         // Mã trạng thái 403 - Không có quyền truy cập tài nguyên
    NOT_FOUND: 'Not Found!',         // Mã trạng thái 404 - Tài nguyên không tồn tại

    // Lỗi server
    METHOD_NOT_ALLOWED: 'Method Not Allowed!', // Mã trạng thái 405 - Phương thức không hợp lệ
    CONFLICT: 'Conflict!',          // Mã trạng thái 409 - Xung đột tài nguyên
    INTERNAL_SERVER_ERROR: 'Internal Server Error!', // Mã trạng thái 500 - Lỗi server
};

// Lớp cơ sở cho các phản hồi thành công
class SuccessResponse {
    constructor({
        message,
        status = statusCode.OK,
        reasonStatus = reasonStatusCode.OK,
        metadata = {},
    }) {
        this.message = !message ? reasonStatus : message;
        this.status = status || statusCode.OK;
        this.metadata = metadata;
    }

    send(res, headers = {}) {
        return res.status(this.status).json(this);
    }
}

// Các lớp con cho từng mã trạng thái cụ thể (Dùng khi trả về thành công)

class OK extends SuccessResponse {
    constructor({ message, metadata }) {
        super({ message, status: statusCode.OK, reasonStatus: reasonStatusCode.OK, metadata });
    }
}

class CREATED extends SuccessResponse {
    constructor({ message, metadata }) {
        super({ message, status: statusCode.CREATED, reasonStatus: reasonStatusCode.CREATED, metadata });
    }
}

class ACCEPTED extends SuccessResponse {
    constructor({ message, metadata }) {
        super({ message, status: statusCode.ACCEPTED, reasonStatus: reasonStatusCode.ACCEPTED, metadata });
    }
}

class NO_CONTENT extends SuccessResponse {
    constructor({ message, metadata }) {
        super({ message, status: statusCode.NO_CONTENT, reasonStatus: reasonStatusCode.NO_CONTENT, metadata });
    }
}

// Các lớp con cho mã trạng thái lỗi (Dùng khi xảy ra lỗi client hoặc server)

class BAD_REQUEST extends SuccessResponse {
    constructor({ message, metadata }) {
        super({ message, status: statusCode.BAD_REQUEST, reasonStatus: reasonStatusCode.BAD_REQUEST, metadata });
    }
}

class UNAUTHORIZED extends SuccessResponse {
    constructor({ message, metadata }) {
        super({ message, status: statusCode.UNAUTHORIZED, reasonStatus: reasonStatusCode.UNAUTHORIZED, metadata });
    }
}

class FORBIDDEN extends SuccessResponse {
    constructor({ message, metadata }) {
        super({ message, status: statusCode.FORBIDDEN, reasonStatus: reasonStatusCode.FORBIDDEN, metadata });
    }
}

class NOT_FOUND extends SuccessResponse {
    constructor({ message, metadata }) {
        super({ message, status: statusCode.NOT_FOUND, reasonStatus: reasonStatusCode.NOT_FOUND, metadata });
    }
}

class METHOD_NOT_ALLOWED extends SuccessResponse {
    constructor({ message, metadata }) {
        super({ message, status: statusCode.METHOD_NOT_ALLOWED, reasonStatus: reasonStatusCode.METHOD_NOT_ALLOWED, metadata });
    }
}

class CONFLICT extends SuccessResponse {
    constructor({ message, metadata }) {
        super({ message, status: statusCode.CONFLICT, reasonStatus: reasonStatusCode.CONFLICT, metadata });
    }
}

class INTERNAL_SERVER_ERROR extends SuccessResponse {
    constructor({ message, metadata }) {
        super({ message, status: statusCode.INTERNAL_SERVER_ERROR, reasonStatus: reasonStatusCode.INTERNAL_SERVER_ERROR, metadata });
    }
}

module.exports = {
    OK,
    CREATED,
    ACCEPTED,
    NO_CONTENT,
    BAD_REQUEST,
    UNAUTHORIZED,
    FORBIDDEN,
    NOT_FOUND,
    METHOD_NOT_ALLOWED,
    CONFLICT,
    INTERNAL_SERVER_ERROR,
};
