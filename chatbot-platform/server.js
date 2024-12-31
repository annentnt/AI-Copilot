import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();


const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(cors());
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
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await usersCollection.insertOne({ username, password });
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

// Route to get chatbot information
app.get('/api/chatbots', (_, res) => {
    // Logic to get chatbot list from the database
    res.json({ message: 'Chatbot list' });
});

// Route to get a specific chatbot
app.get('/api/chatbots/:id', (req, res) => {
    // Logic to get information of a specific chatbot
    res.json({ message: `Information of chatbot with id ${req.params.id}` });
});

// Route to chat with a chatbot
app.post('/api/chatbots/:id/chat', (req, res) => {
    // Logic to chat with a chatbot
    res.json({ message: `Chat with chatbot with id ${req.params.id}` });
});

// Route to test chat with chatbot in backend interface
app.post('/api/test-chat', (req, res) => {
    const { message } = req.body;
    // Logic to handle message and respond from chatbot
    const responseMessage = `Chatbot response: ${message}`;
    res.json({ message: responseMessage });
});