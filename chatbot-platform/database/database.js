import sql from 'mssql/msnodesqlv8.js'; // Sử dụng msnodesqlv8 driver
import dotenv from 'dotenv';

// Nạp biến môi trường từ file .env
dotenv.config();

// Cấu hình kết nối SQL Server
const config = {
  driver: 'msnodesqlv8',
  server: 'DANNO\\SQLEXPRESS01', // Thay bằng tên server của bạn
  database: 'ChatbotPlatform',   // Tên database
  options: {
      encrypt: true,
      trustServerCertificate: true,
  },
};

async function connectDB() {
  try {
    const pool = sql.connect(config); // Kết nối SQL Server
    console.log('Kết nối SQL Server thành công');
    return pool;
  } catch (err) {
    console.error('Lỗi kết nối SQL Server:', err);
    throw err;
  }
}

const queryDatabase = async (query) => {
  try {
    const result = await sql.query(query); // Thực hiện truy vấn
    return result.recordset; // Trả về dữ liệu
  } catch (err) {
    console.error('Error querying database:', err);
    throw err;
  }
};

// Export các hàm
export { connectDB, queryDatabase };
