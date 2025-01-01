const session = require('express-session');

// Cấu hình session
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Đặt true nếu dùng HTTPS
}));

// API logout
app.post('/api/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).send('Failed to logout');
        }
        res.clearCookie('connect.sid'); // Xóa cookie session
        res.status(200).send('Logout successful');
    });
});

// Route tĩnh cho file HTML
app.use(express.static('public'));