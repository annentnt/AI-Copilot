import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { Anthropic } from '@anthropic-ai/sdk';
// Thiết lập __dirname cho ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
//app.use(express.static('public'));
app.use(express.json());
app.use(cors());
// Thêm middleware để phục vụ file tĩnh
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));
// Sau đó sử dụng
//const client = new MongoClient(process.env.MONGODB_URI);

// const claude = new Anthropic({
//     apiKey: process.env.CLAUDE_API_KEY,// Make sure this is set in .env
// });
// Khởi tạo Anthropic client
const anthropic = new Anthropic({
    apiKey: process.env.CLAUDE_API_KEY,
});


console.log('Claude API Key:', process.env.CLAUDE_API_KEY);

const client = new MongoClient('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true });
// const db = 'admnin'; // This line is not needed and should be removed
async function connectDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Database connection failed:', error.message);
        process.exit(1);
    }
}

// Connect to the database
connectDB();

const db = client.db('chatbot-platform');
const usersCollection = db.collection('users');

// Basic route
app.get('/', (_, res) => {
    res.send('Welcome to Chatbot Platform!');
});

// Route for registration
// app.post('/api/register', async (req, res) => {
//     const { username, password } = req.body;
//     try {
//         const result = await usersCollection.insertOne({ username, password });
//         res.json({ message: 'Registration successful', result });
//     } catch (error) {
//         res.status(500).json({ message: 'Error registering user', error: error.message });
//     }
// });
// Cập nhật route đăng ký
// Thêm route để serve file HTML

// Thay đổi route này
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'views', 'login.html'));
// });
app.get(['/', '/login'], (req, res) => {
    const filePath = path.join(__dirname, 'views', 'login.html');
    console.log('Attempting to serve:', filePath);
    
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send('File not found at ${filePath}');
    }
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'dashboard.html'));
});
app.post('/api/register', async (req, res) => {
    const { username, password, email } = req.body;
    try {
        // Kiểm tra xem username đã tồn tại chưa
        const existingUser = await usersCollection.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const result = await usersCollection.insertOne({ 
            username, 
            password, 
            email,
            createdAt: new Date()
        });
        res.json({ message: 'Registration successful', result });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
});


// Route for login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await usersCollection.findOne({ username, password });
        if (user) {
            res.json({ message: 'Login successful' });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});

// Route to get users
app.get('/api/users', async (_, res) => {
    try {
        const users = await usersCollection.find().toArray();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
});

// Server running
const PORT = 3000;
const server = app.listen(PORT, () => console.log('Server is running on http://localhost:${PORT}'));

// Gracefully close the MongoDB client when the server is stopped
process.on('SIGINT', async () => {
    console.log('Closing MongoDB client');
    await client.close();
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

// Thêm collection mới cho chatbots
const chatbotsCollection = db.collection('chatbots');


// Thêm collection để lưu lịch sử chat
const chatHistoryCollection = db.collection('chat_history');

//Helper function to process messages
async function processMessage(chatbotId, message) {
    try {
        if (!process.env.CLAUDE_API_KEY) {
            throw new Error('Claude API key is not configured');
        }

        console.log('Processing message:', message);

        const response = await anthropic.messages.create({
            model: "claude-3-sonnet-20240229",
            max_tokens: 1000,
            messages: [
                {
                    role: "user",
                    content: message
                }
            ]
        });

        // Lưu lịch sử chat
        await chatHistoryCollection.insertOne({
            chatbotId,
            userMessage: message,
            botResponse: response.content[0].text,
            timestamp: new Date()
        });

        return response.content[0].text;
    } catch (error) {
        console.error('Claude API Error:', error);
        throw new Error('Failed to get response from Claude: ' + error.message);
    }
}
// Thêm mảng các câu trả lời mẫu
// const mockResponses = [
//     "Xin chào! Tôi có thể giúp gì cho bạn?",
//     "Rất vui được gặp bạn!",
//     "Tôi đang ở đây để hỗ trợ bạn.",
//     "Bạn cần tôi tư vấn về vấn đề gì?",
//     "Tôi sẽ cố gắng hết sức để giúp bạn."
// ];

// // Helper function to get random response
// function getRandomResponse() {
//     const index = Math.floor(Math.random() * mockResponses.length);
//     return mockResponses[index];
// }

// // Helper function to process messages (phiên bản giả lập)
// async function processMessage(chatbotId, message) {
//     try {
//         // Thêm delay giả lập để tạo cảm giác thực tế
//         await new Promise(resolve => setTimeout(resolve, 1000));

//         // Xử lý một số câu hỏi cơ bản
//         let response;
//         const lowerMessage = message.toLowerCase();
        
//         if (lowerMessage.includes('xin chào') || lowerMessage.includes('chào')) {
//             response = "Xin chào! Tôi có thể giúp gì cho bạn?";
//         } else if (lowerMessage.includes('tạm biệt')) {
//             response = "Tạm biệt! Hẹn gặp lại bạn sau.";
//         } else if (lowerMessage.includes('cảm ơn')) {
//             response = "Không có gì! Rất vui được giúp đỡ bạn.";
//         } else {
//             // Nếu không match các câu trên, trả về câu trả lời ngẫu nhiên
//             response = getRandomResponse();
//         }

//         // Log cho debug
//         console.log('Mock response:', response);

//         // Lưu vào lịch sử chat nếu cần
//         await chatHistoryCollection.insertOne({
//             chatbotId,
//             userMessage: message,
//             botResponse: response,
//             timestamp: new Date(),
//             isMock: true
//         });

//         return response;
//     } catch (error) {
//         console.error('Mock processing error:', error);
//         throw new Error('Failed to process message: ' + error.message);
//     }
// }


// Endpoint chính để xử lý chat
app.post('/api/chatbots/:id/chat', async (req, res) => {
    const { message } = req.body;
    const chatbotId = req.params.id;

    try {
        // Validate input
        if (!message || typeof message !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'Invalid message format'
            });
        }

        console.log('Received chat request:', {
            chatbotId,
            message
        });

        const response = await processMessage(chatbotId, message);
        
        res.json({
            success: true,
            message: response
        });
    } catch (error) {
        console.error('Chat processing error:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing message',
            error: error.message
        });
    }
});

// Endpoint để lấy lịch sử chat
app.get('/api/chatbots/:id/history', async (req, res) => {
    const chatbotId = req.params.id;
    
    try {
        const history = await chatHistoryCollection.find({
            chatbotId: chatbotId
        })
        .sort({ timestamp: -1 })
        .limit(50)
        .toArray();

        res.json({
            success: true,
            history
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching chat history',
            error: error.message
        });
    }
});
