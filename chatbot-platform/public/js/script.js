// Lấy các phần tử liên quan
const loginTab = document.getElementById('login-tab');
const registerTab = document.getElementById('register-tab');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const chatForm = document.getElementById('chat-form');
const chatBody = document.querySelector('.chat-body');
// Gắn sự kiện click cho nút Login
loginTab.addEventListener('click', () => {
    loginTab.classList.add('active');
    registerTab.classList.remove('active');
    loginForm.classList.add('active');
    registerForm.classList.remove('active');
});

// Gắn sự kiện click cho nút Register
registerTab.addEventListener('click', () => {
    registerTab.classList.add('active');
    loginTab.classList.remove('active');
    registerForm.classList.add('active');
    loginForm.classList.remove('active');
});

document.querySelector('.chat-send-button').addEventListener('click', function () {
    const inputField = document.querySelector('.chat-input');
    const message = inputField.value.trim();

    if (message) {
        // Tạo tin nhắn của user
        const userMessage = document.createElement('div');
        userMessage.className = 'chat-message user';
        userMessage.innerHTML = `<div class="message-content">${message}</div>`;

        // Thêm tin nhắn vào chat-body
        const chatBody = document.querySelector('.chat-body');
        chatBody.appendChild(userMessage);

        // Cuộn xuống cuối cùng
        chatBody.scrollTop = chatBody.scrollHeight;

        // Xóa nội dung trong input
        inputField.value = '';

        // Giả lập phản hồi từ bot (có thể thay thế bằng API thực tế)
        setTimeout(() => {
            const botMessage = document.createElement('div');
            botMessage.className = 'chat-message bot';
            botMessage.innerHTML = `<div class="message-content">Cảm ơn bạn đã gửi tin nhắn: "${message}"</div>`;
            chatBody.appendChild(botMessage);
            chatBody.scrollTop = chatBody.scrollHeight;
        }, 1000); // Giả lập độ trễ 1 giây
    }
});

document.querySelector('.chat-input').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault(); // Ngăn việc xuống dòng
        document.querySelector('.chat-send-button').click(); // Gọi sự kiện click của nút gửi
    }
});

