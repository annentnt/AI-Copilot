import { Sequelize, DataTypes } from 'sequelize';

// Kết nối với SQL Server
const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'mssql',
    dialectOptions: {
        options: {
            encrypt: true,
            trustServerCertificate: true
        }
    }
});

// Định nghĩa mô hình người dùng
const User = sequelize.define('User', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'Users'
});

// Hàm tạo người dùng mẫu
const createSampleUser = async () => {
    await sequelize.sync(); // Đồng bộ hóa mô hình với cơ sở dữ liệu
    await User.create({ email: 'test@example.com', password: 'hashedpassword123' });
    console.log('Sample user created');
};

module.exports = createSampleUser;
