import axios from 'axios';

const chatController = {
    handleMessage: async (req, res) => {
        try {
            const { message, chatbot } = req.body;

            if (!message) {
                return res.status(400).json({ error: "Message is required" });
            }

            const validChatbots = {
                'chatgpt': 'https://api.openai.com/v1/chat/completions',
                'claude': 'https://api.example.com/claude',
                'gemini': 'https://api.example.com/gemini'
            };

            if (!chatbot || !validChatbots[chatbot]) {
                return res.status(400).json({ error: "Valid chatbot is required" });
            }

            const apiUrl = validChatbots[chatbot];

            // Call the selected chatbot API
            const apiResponse = await axios.post(apiUrl, { message });

            // Get the response from the API
            const response = apiResponse.data.reply || "No reply from chatbot";

            // Return the response to the client
            return res.status(200).json({ reply: response });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
};

export default chatController;
