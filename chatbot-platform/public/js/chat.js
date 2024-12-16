document.getElementById('sendButton').addEventListener('click', () => {
    const userMessage = document.getElementById('messageInput').value;
    const selectedModel = document.getElementById('modelSelect').value;

    fetch('/chat/message', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage, model: selectedModel })
    })
    .then(response => response.json())
    .then(data => {
        const chatBox = document.getElementById('chatBox');
        chatBox.innerHTML += `<p><strong>You:</strong> ${userMessage}</p>`;
        chatBox.innerHTML += `<p><strong>${selectedModel}:</strong> ${data.reply}</p>`;
        document.getElementById('messageInput').value = '';
    })
    .catch(error => console.error('Error:', error));
});
