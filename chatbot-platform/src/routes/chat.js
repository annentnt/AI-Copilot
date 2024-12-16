import express from 'express';
import { callGPT } from '../services/openaiService';
import { callGemini } from '../services/geminiService';
import { callClaude } from '../services/claudeService';

const router = express.Router();

const chatController = {
    handleMessage: async (req, res) => {
        try {
            const { message, model } = req.body;

            if (!message || !model) {
                return res.status(400).json({ error: "Message and model are required" });
            }
            
            let response;
            switch (model.toLowerCase()) {
                case 'gpt':
                    response = await callGPT(message);
                    break;
                case 'gemini':
                    response = await callGemini(message);
                    break;
                case 'claude':
                    response = await callClaude(message);
                    break;
                default:
                    return res.status(400).json({ error: "Invalid model selected" });
            }

            // Trả về phản hồi từ AI
            return res.status(200).json({ reply: response });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
};

// Route gửi tin nhắn và nhận phản hồi
router.post('/message', chatController.handleMessage);

export default router;
