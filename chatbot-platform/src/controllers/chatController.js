import axios from 'axios';

const chatController = {
    handleMessage: async (req, res) => {
        try {
            const { message, chatbot } = req.body;

            if (!message) {
                return res.status(400).json({ error: "Message is required" });
            }

            if (!chatbot || !['chatgpt', 'claude', 'gemini'].includes(chatbot)) {
                return res.status(400).json({ error: "Valid chatbot is required" });
            }

            let apiUrl;
            switch (chatbot) {
                case 'chatgpt':
                    apiUrl = 'https://api.example.com/chatgpt';
                    break;
                case 'claude':
                    apiUrl = 'https://api.example.com/claude';
                    break;
                case 'gemini':
                    apiUrl = 'https://api.example.com/gemini';
                    break;
                default:
                    return res.status(400).json({ error: "Invalid chatbot selection" });
            }

            // Call the selected chatbot API
            const apiResponse = await axios.post(apiUrl, { message });

            // Get the response from the API
            const response = apiResponse.data.reply;

            // Return the response to the client
            return res.status(200).json({ reply: response });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
};

export default chatController;
