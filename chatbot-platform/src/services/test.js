import { getClaudeCompletion } from '../services/claudeService.js';

const apiKey = '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';

(async () => {
    try {
        const response = await getClaudeCompletion('Xin chào, tôi đang tìm kiếm thông tin về dự án của bạn.');
        console.log('Phản hồi từ Claude:', response);
    } catch (error) {
        console.error('Lỗi:', error);
    }
})();