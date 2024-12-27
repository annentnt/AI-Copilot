import sql from 'mssql';

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

export default connectDB;
