const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');
const chatbotRoutes = require('./chatbot');

router.use('/auth', authRoutes);
router.use('/chatbot', chatbotRoutes);

module.exports = router;
