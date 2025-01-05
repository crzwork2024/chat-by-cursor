document.addEventListener('DOMContentLoaded', function() {
    const chatWindow = document.getElementById('chat-window');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const exitButton = document.getElementById('exit-button');

    // 发送消息的函数
    function sendMessage() {
        const message = userInput.value.trim();
        if (message) {
            const messageElement = document.createElement('div');
            messageElement.textContent = `你: ${message}`;
            chatWindow.appendChild(messageElement);
            userInput.value = ''; // 清空输入框

            // 模拟 AI 回复
            setTimeout(() => {
                const responseElement = document.createElement('div');
                responseElement.textContent = `AI: ${message} (这是模拟的回复)`; // 这里可以替换为实际的 AI 回复逻辑
                chatWindow.appendChild(responseElement);
                chatWindow.scrollTop = chatWindow.scrollHeight; // 滚动到最新消息
            }, 1000);
        }
    }

    // 发送按钮点击事件
    sendButton.addEventListener('click', sendMessage);

    // 输入框按下 Enter 键发送消息
    userInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });

    // 退出按钮点击事件
    exitButton.addEventListener('click', function() {
        if (confirm('你确定要退出对话吗？')) {
            chatWindow.innerHTML = ''; // 清空对话内容
            userInput.value = ''; // 清空输入框
        }
    });
}); 