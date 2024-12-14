import express from 'express';
import chatController from '../controllers/chatController.js';

const router = express.Router();

// Route gửi tin nhắn và nhận phản hồi
router.post('/message', chatController.handleMessage);

export default router;
