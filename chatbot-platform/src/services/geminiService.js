import axios from 'axios';

const callGemini = async (message) => {
    const response = await axios.post('https://gemini-api.googleapis.com/v1/chat', {
        prompt: message,
    }, {
        headers: {
            Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
        },
    });

    return response.data.reply;
};

export { callGemini };
