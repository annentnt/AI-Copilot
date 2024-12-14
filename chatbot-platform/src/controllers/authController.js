import sql from 'mssql';
import bcrypt from 'bcryptjs';
import connectDB from '../../database/database.js';

const authController = {
    register: async (req, res) => {
        const { username, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        try {
            const pool = await connectDB();

            // Kiểm tra username đã tồn tại
            const result = await pool.request()
                .input('username', sql.NVarChar, username)
                .query('SELECT * FROM Users WHERE username = @username');

            if (result.recordset.length > 0) {
                return res.status(400).json({ message: 'Username already exists' });
            }

            // Mã hóa mật khẩu
            const hashedPassword = await bcrypt.hash(password, 10);

            // Thêm người dùng mới
            await pool.request()
                .input('username', sql.NVarChar, username)
                .input('password', sql.NVarChar, hashedPassword)
                .query('INSERT INTO Users (username, password) VALUES (@username, @password)');

            res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    login: async (req, res) => {
        const { username, password } = req.body;

        try {
            const pool = await connectDB();

            // Tìm người dùng theo username
            const result = await pool.request()
                .input('username', sql.NVarChar, username)
                .query('SELECT * FROM Users WHERE username = @username');

            if (result.recordset.length === 0) {
                return res.status(401).json({ message: 'Invalid username or password' });
            }

            const user = result.recordset[0];

            // Kiểm tra mật khẩu
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid username or password' });
            }

            res.status(200).json({ message: 'Login successful', user: { id: user.id, username: user.username } });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },
    
    logout: (req, res) => {
        // Hủy session hiện tại
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ message: "Error logging out" });
            }
            res.clearCookie('connect.sid'); // Xóa cookie session
            return res.status(200).json({ message: "Logged out successfully" });
        });
    },
};

export default authController;
