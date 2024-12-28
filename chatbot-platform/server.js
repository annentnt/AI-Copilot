import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // Thêm thư viện cors
import { connectDB, queryDatabase } from './database/database.js';

dotenv.config(); // Load biến môi trường từ file .env

const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(cors());
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

app.get('/api/users', async (_, res) => {
    try {
        const query = 'SELECT * FROM Users'; // Câu lệnh SQL
        const users = await queryDatabase(query); // Thực hiện query
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
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

// Route để thử chat với chatbot trong giao diện backend
app.post('/api/test-chat', (req, res) => {
    const { message } = req.body;
    // Logic để xử lý tin nhắn và trả lời từ chatbot
    const responseMessage = `Chatbot trả lời: ${message}`;
    res.json({ message: responseMessage });
});