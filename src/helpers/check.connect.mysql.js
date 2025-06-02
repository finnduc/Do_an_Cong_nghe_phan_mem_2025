// Hàm kiểm tra trạng thái cơ sở dữ liệu
const checkDatabaseStatus = (pool) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.error('Database connection failed:', err.message);
                return reject(err);
            }

            // Kiểm tra số lượng kết nối đang hoạt động
            connection.query("SHOW STATUS LIKE 'Threads_connected';", (err, results) => { // Sử dụng dấu nháy đơn
                connection.release(); // Giải phóng kết nối về pool

                if (err) {
                    console.error('Error querying database status:', err.message);
                    return reject(err);
                }

                const connectedThreads = results[0]?.Value || 0; // Lấy giá trị
                resolve(connectedThreads); // Trả về số lượng kết nối
            });
        });
    });
};

// Xuất module
module.exports = {
    checkDatabaseStatus
};
