const pool = require('./init.mysql'); // Import pool kết nối

// Hàm chạy query
async function executeQuery(query, params = []) {
  let connection;
  try {
    connection = await pool.getConnection(); // Lấy một kết nối từ pool
    const [rows] = await connection.execute(query, params); // Thực thi query
    return rows;
  } catch (error) {
    console.error('Lỗi khi thực thi query:', error);
    throw error;
  } finally {
    if (connection) connection.release(); // Trả lại kết nối vào pool
  }
}

module.exports = { executeQuery };
