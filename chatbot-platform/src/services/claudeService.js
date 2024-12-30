import axios from 'axios';

// Lấy API key từ môi trường
const apiKey = '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';

if (!apiKey) {
    throw new Error('API key for Anthropic is not defined. Please set the ANTHROPIC_API_KEY environment variable.');
}

// Hàm gọi API Anthropic
export const getClaudeCompletion = async (userMessage, model = "claude-2.1", maxTokens = 10, temperature = 0.7) => {
    const prompt = `\n\nHuman: ${userMessage}\n\nAssistant:`;

    try {
        const response = await axios.post(
            'https://api.anthropic.com/v1/complete',
            {
                model: model,
                prompt: prompt,
                max_tokens_to_sample: maxTokens,
                temperature: temperature,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                },
            }
        );
        return response.data.completion; // Trả về phần trả lời của Claude
    } catch (error) {
        console.error('Error calling Anthropic API:', error.message);
        throw new Error('Failed to fetch completion from Anthropic API');
    }
};

// export const callClaude = async (message) => {
//     try {
//         const response = await getClaudeCompletion(message);
//         return response;
//     } catch (error) {
//         console.error('Error calling Claude:', error);
//         throw error;
//     }
// };  