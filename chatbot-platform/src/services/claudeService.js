import axios from 'axios';

const callClaude = async (message) => {
    const response = await axios.post('https://api.anthropic.com/v1/complete', {
        prompt: `Human: ${message}\nAssistant:`,
        model: "claude-v1",
        max_tokens: 100,
    }, {
        headers: {
            Authorization: `Bearer ${process.env.CLAUDE_API_KEY}`,
        },
    });

    return response.data.completion;
};

export { callClaude };
