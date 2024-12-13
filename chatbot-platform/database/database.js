const sql = require('mssql');

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER, // Địa chỉ server
    database: process.env.DB_NAME,
    options: {
        encrypt: true, // Bật nếu sử dụng Azure
        trustServerCertificate: true, // Chỉ bật nếu phát triển cục bộ
    },
};

const connectDB = async () => {
    try {
        const pool = await sql.connect(config);
        console.log('SQL Server connected');
        return pool;
    } catch (error) {
        console.error(`Error connecting to SQL Server: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
