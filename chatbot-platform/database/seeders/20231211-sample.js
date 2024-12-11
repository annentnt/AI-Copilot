// 20231211-sample.js
const db = require('../database');

const seedUsers = async () => {
    const query = `
        INSERT INTO users (email, password)
        VALUES ('test@example.com', 'hashedpassword123');
    `;
    await db.query(query);
    console.log('Sample user data inserted');
};

module.exports = seedUsers;
