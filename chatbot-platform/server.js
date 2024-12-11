const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./database/database');

dotenv.config(); // Load biến môi trường từ file .env

const app = express();

// Kết nối cơ sở dữ liệu
connectDB();

// Middleware
app.use(express.json());
app.use(express.static('public')); // Phục vụ file tĩnh từ thư mục public

// Định nghĩa route cơ bản
app.get('/', (req, res) => {
    res.send('Welcome to Chatbot Platform!');
});

// Server chạy
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
