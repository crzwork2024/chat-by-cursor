async function askQuestion() {
    const question = document.getElementById('question').value;
    const responseDiv = document.getElementById('response');

    if (!question.trim()) {
        return; // 如果输入为空，则不提交
    }

    const response = await fetch('http://127.0.0.1:5000/ask', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ question })
    });

    // 检查响应状态
    if (!response.ok) {
        console.error('HTTP error', response.status);
        return;
    }

    const data = await response.json();
    
    // 清空之前的响应
    responseDiv.innerHTML = '';

    // 显示相似问题和答案
    if (data.similar_answers && data.similar_questions) {
        // Show the first similar question and answer in a card
        const firstCard = document.createElement('div');
        firstCard.className = 'card';
        firstCard.innerHTML = `
            <div class="card-header">相似问题 1:</div>
            <p>${data.similar_questions[0]}</p>
            <div class="card-header">答案 1:</div>
            <p>${data.similar_answers[0]}</p>
        `;
        responseDiv.appendChild(firstCard);

        // Create an expandable section for the rest
        if (data.similar_questions.length > 1) {
            const expandableDiv = document.createElement('div');
            expandableDiv.style.display = 'none'; // Initially hidden
            for (let i = 1; i < data.similar_answers.length; i++) {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <div class="card-header">相似问题 ${i + 1}:</div>
                    <p>${data.similar_questions[i]}</p>
                    <div class="card-header">答案 ${i + 1}:</div>
                    <p>${data.similar_answers[i]}</p>
                `;
                expandableDiv.appendChild(card);
            }
            responseDiv.appendChild(expandableDiv);

            // Add a button to toggle the expandable section
            const toggleButton = document.createElement('button');
            toggleButton.className = 'toggle-button';
            toggleButton.innerText = '显示更多答案';
            toggleButton.onclick = function() {
                if (expandableDiv.style.display === 'none') {
                    expandableDiv.style.display = 'block';
                    toggleButton.innerText = '隐藏答案';
                    // Adjust the height of the chat container based on content
                    const chatContainer = document.querySelector('.chat-container');
                    chatContainer.style.height = 'auto'; // Reset height
                    chatContainer.style.height = chatContainer.scrollHeight + 'px'; // Set height to content height
                } else {
                    expandableDiv.style.display = 'none';
                    toggleButton.innerText = '显示更多答案';
                }
            };
            responseDiv.appendChild(toggleButton);
        }
    } else {
        responseDiv.innerHTML = '<p>没有找到相似的问题。</p>';
    }

    // 清空输入框
    document.getElementById('question').value = '';

    // Move the input area to the bottom and center it
    const chatContainer = document.querySelector('.chat-container');
    chatContainer.style.height = 'auto'; // Reset height
    chatContainer.style.height = chatContainer.scrollHeight + 'px'; // Set height to content height
    document.getElementById('question').scrollIntoView({ behavior: 'smooth' }); // Scroll to the input area
}

// 添加事件监听器以支持 Enter 键提交
document.getElementById('question').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        askQuestion();
    }
}); 