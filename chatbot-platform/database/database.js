import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: true,
        trustServerCertificate: true,
    },
};

async function connectDB() {
  try {
    const pool = sql.connect(config);
    console.log('Kết nối SQL Server thành công');
    return pool;
  } catch (err) {
    console.error('Lỗi kết nối SQL Server:', err);
  }
};

const queryDatabase = async (query) => {
    try {
        const result = await sql.query(query);
        return result.recordset;
    } catch (err) {
        console.error('Error querying database:', err);
        throw err;
    }
};

// Export các hàm
export { connectDB, queryDatabase };
