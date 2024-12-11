// database.js
const sql = require('mssql');

const config = {
    user: 'username',
    password: 'password',
    server: 'localhost',
    database: 'database',
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Connected to SQL Server');
        return pool;
    })
    .catch(err => {
        console.error('Database Connection Failed! Bad Config: ', err);
        throw err;
    });

module.exports = {
    query: async (query) => {
        const pool = await poolPromise;
        return pool.request().query(query);
    }
};
