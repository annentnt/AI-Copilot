import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import session from 'express-session';
import flash from 'connect-flash';
import { OpenAIApi, configuration } from 'openai';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.join(__dirname, 'user.csv'); // Đường dẫn file CSV

if (!process.env.OPENAI_API_KEY) {
    throw new Error('Missing OpenAI API key in environment variables');
}

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY, // Thay bằng API key của bạn
});

const openai = new OpenAIApi(configuration);
// Middleware
app.set('view engine', 'ejs'); // Sử dụng EJS làm view engine
app.use(express.static('public')); // Đường dẫn tĩnh (CSS, JS)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));
app.use(flash());


// Hàm đọc thông tin tài khoản từ CSV
const readUserCredentials = () => {
    try {
        if (!fs.existsSync(filePath)) return [];
        const data = fs.readFileSync(filePath, 'utf8');
        return data.split('\n').slice(1).map(row => {
            const [username, password] = row.split(',');
            return { username: username?.trim(), password: password?.trim() };
        }).filter(user => user.username && user.password);
    } catch (error) {
        console.error('Error reading user credentials:', error);
        return [];
    }
};

// Hàm đăng ký tài khoản mới
const registerNewUser = (username, password, confirmPassword) => {
    if (password !== confirmPassword) {
        console.error('Passwords do not match');
        return false;
    }

    try {
        const users = readUserCredentials();
        if (users.some(user => user.username === username)) {
            return false; // Tài khoản đã tồn tại
        }

        const header = !fs.existsSync(filePath) ? "username,password\n" : "";
        fs.appendFileSync(filePath, `${header}${username},${password}\n`);
        return true;
    } catch (error) {
        console.error('Error registering new user:', error);
        return false;
    }
};

// Route chính
app.get('/', (_req, res) => {
    res.render('index');
});

// Route đăng nhập
app.route('/login')
    .get((req, res) => {
        res.render('login', { messages: req.flash() });
    })
    .post((req, res) => {
        const { username, password } = req.body;
        const users = readUserCredentials();
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            req.session.username = username;
            req.flash('success', `Đăng nhập thành công! Chào mừng, ${username}.`);
            res.redirect('/chat');
        } else {
            req.flash('danger', 'Sai tài khoản hoặc mật khẩu.');
            res.redirect('/login');
        }
    });

// Route đăng ký
app.route('/register')
    .get((req, res) => {
        res.render('register', { messages: req.flash() });
    })
    .post((req, res) => {
        const { username, password, confirmPassword } = req.body;
        if (registerNewUser(username, password, confirmPassword)) {
            req.flash('success', 'Đăng ký thành công! Bạn có thể đăng nhập.');
            res.redirect('/login');
        } else {
            req.flash('danger', 'Tài khoản đã tồn tại hoặc mật khẩu không khớp.');
            res.redirect('/register');
        }
    });

// Route chat
app.route('/chat')
    .get((req, res) => {
        if (!req.session.username) {
            req.flash('danger', 'Bạn cần đăng nhập để truy cập.');
            return res.redirect('/login');
        }
        res.render('chat', { messages: req.flash(), userInput: '', botResponse: '' });
    })
    .post(async (req, res) => {
        const { user_input } = req.body;
        try {
            const response = await openai.createChatCompletion({
                model: 'gpt-3.5-turbo', // Sử dụng GPT-3.5 Turbo
                messages: [{ role: 'user', content: user_input }]
            });
            const botResponse = response.data.choices[0].message.content.trim();
            res.render('chat', { userInput: user_input, botResponse, messages: req.flash() });
        } catch (error) {
            console.error('OpenAI API error:', error);
            req.flash('danger', 'Đã xảy ra lỗi khi gọi OpenAI API.');
            res.redirect('/chat');
        }
    });

// Server khởi chạy
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
