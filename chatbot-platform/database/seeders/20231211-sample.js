// 20231211-sample.js
import db from '../database';

const seedUsers = async () => {
    const query = `
        INSERT INTO users (email, password)
        VALUES ('test@example.com', 'hashedpassword123');
    `;
    await db.query(query);
    console.log('Sample user data inserted');
};

export default seedUsers;
