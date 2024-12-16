import express from 'express';
import dotenv from 'dotenv';
import connectDB from './database/database.js';

dotenv.config(); // Load biến môi trường từ file .env

const app = express();
app.use(express.static('public'));

// Kết nối cơ sở dữ liệu
connectDB();

// Middleware
app.use(express.json());
app.use(express.static('public')); // Phục vụ file tĩnh từ thư mục public

// Định nghĩa route cơ bản
app.get('/', (_, res) => {
    res.send('Welcome to Chatbot Platform!');
});

// Route để đăng ký
app.post('/api/register', (_, res) => {
    // Logic để đăng ký người dùng mới
    res.json({ message: 'Đăng ký thành công' });
});

// Route để đăng nhập
app.post('/api/login', (_, res) => {
    // Logic để đăng nhập người dùng
    res.json({ message: 'Đăng nhập thành công' });
});

// Server chạy
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));

// Route để lấy thông tin chatbot
app.get('/api/chatbots', (_, res) => {
    // Logic để lấy danh sách chatbot từ cơ sở dữ liệu
    res.json({ message: 'Danh sách chatbot' });
});

// Route để chọn một chatbot
app.get('/api/chatbots/:id', (req, res) => {
    // Logic để lấy thông tin của một chatbot cụ thể
    res.json({ message: `Thông tin của chatbot với id ${req.params.id}` });
});

// Route để chat với chatbot
app.post('/api/chatbots/:id/chat', (req, res) => {
    // Logic để chat với chatbot
    res.json({ message: `Chat với chatbot với id ${req.params.id}` });
});
