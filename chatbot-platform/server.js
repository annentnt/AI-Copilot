import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

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
        res.status(404).send(`File not found at ${filePath}`);
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
const server = app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));

// Gracefully close the MongoDB client when the server is stopped
process.on('SIGINT', async () => {
    console.log('Closing MongoDB client');
    await client.close();
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

// // Route to get chatbot information
// app.get('/api/chatbots', (_, res) => {
//     // Logic to get chatbot list from the database
//     res.json({ message: 'Chatbot list' });
// });

// // Route to get a specific chatbot
// app.get('/api/chatbots/:id', (req, res) => {
//     // Logic to get information of a specific chatbot
//     res.json({ message: `Information of chatbot with id ${req.params.id}` });
// });

// // Route to chat with a chatbot
// app.post('/api/chatbots/:id/chat', (req, res) => {
//     // Logic to chat with a chatbot
//     res.json({ message: `Chat with chatbot with id ${req.params.id}` });
// });

// // Route to test chat with chatbot in backend interface
// app.post('/api/test-chat', (req, res) => {
//     const { message } = req.body;
//     // Logic to handle message and respond from chatbot
//     const responseMessage = `Chatbot response: ${message}`;
//     res.json({ message: responseMessage });
// });
// Thêm collection mới cho chatbots
const chatbotsCollection = db.collection('chatbots');

// Route to get chatbot information
app.get('/api/chatbots', async (_, res) => {
    try {
        const chatbots = await chatbotsCollection.find().toArray();
        res.json({ chatbots });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching chatbots', error: error.message });
    }
});

// Route to get a specific chatbot
app.get('/api/chatbots/:id', async (req, res) => {
    try {
        const chatbot = await chatbotsCollection.findOne({ _id: req.params.id });
        if (!chatbot) {
            return res.status(404).json({ message: 'Chatbot not found' });
        }
        res.json({ chatbot });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching chatbot', error: error.message });
    }
});

// Route to chat with a chatbot
app.post('/api/chatbots/:id/chat', async (req, res) => {
    const { message } = req.body;
    try {
        // Ở đây bạn có thể thêm logic để xử lý tin nhắn dựa trên loại chatbot
        // Ví dụ: gọi API của ChatGPT, Claude, hay Gemini
        const response = await processMessage(req.params.id, message);
        res.json({ message: response });
    } catch (error) {
        res.status(500).json({ message: 'Error processing message', error: error.message });
    }
});

// Route to test chat with chatbot in backend interface
app.post('/api/test-chat', async (req, res) => {
    const { message, model } = req.body;
    try {
        // Ở đây bạn có thể thêm logic để xử lý tin nhắn dựa trên model được chọn
        let response;
        switch (model) {
            case 'gpt-4o':
                response = `GPT-4o: ${message}`;
                break;
            case 'claude-ai':
                response = `Claude AI: ${message}`;
                break;
            case 'gemini-ai':
                response = `Gemini AI: ${message}`;
                break;
            default:
                response = `Bot: ${message}`;
        }
        res.json({ message: response });
    } catch (error) {
        res.status(500).json({ message: 'Error processing message', error: error.message });
    }
});

// Helper function to process messages based on chatbot type
async function processMessage(chatbotId, message) {
    // Implement your message processing logic here
    // This could include calling different AI APIs based on the chatbot type
    return `Processed response for chatbot ${chatbotId}: ${message}`;
}
