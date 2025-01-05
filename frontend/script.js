async function askQuestion() {
    const question = document.getElementById('question').value;

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
    
    // Clear previous responses
    let responseDiv = document.getElementById('response');
    if (!responseDiv) {
        responseDiv = document.createElement('div');
        responseDiv.id = 'response';
        responseDiv.style.marginTop = '20px'; // Add some space above the response
        document.querySelector('.chat-container').appendChild(responseDiv);
    } else {
        // Clear previous content
        responseDiv.innerHTML = '';
    }

    // 显示相似问题和答案
    if (data.similar_answers && data.similar_questions) {
        // Show the first similar question and answer in a card
        const firstCard = document.createElement('div');
        firstCard.className = 'card';
        firstCard.innerHTML = `
            <p>${data.similar_questions[0]}</p>
            <div class="card-header">回答:</div>
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
                    <p>${data.similar_questions[i]}</p>
                    <div class="card-header">回答:</div>
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
                    
                    // Check if the "问题未找到" button already exists
                    let notFoundButton = document.getElementById('notFoundButton');
                    if (!notFoundButton) {
                        // Add the "问题未找到" button
                        notFoundButton = document.createElement('button');
                        notFoundButton.id = 'notFoundButton'; // Set an ID for the button
                        notFoundButton.className = 'not-found-button'; // Use the new class
                        notFoundButton.innerText = '问题未找到';
                        notFoundButton.onclick = async function() {
                            await fetch('http://127.0.0.1:5000/record_unanswered', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ question })
                            });
                            alert('问题已记录为未回答。');
                        };
                        responseDiv.appendChild(notFoundButton); // Append the button
                    }
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
    chatContainer.appendChild(document.getElementById('question')); // Move the input to the bottom
    document.getElementById('question').scrollIntoView({ behavior: 'smooth' }); // Scroll to the input area

    // Set focus back to the input field
    document.getElementById('question').focus(); // Ensure the input field is focused
}

// 添加事件监听器以支持 Enter 键提交
document.getElementById('question').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        askQuestion();
    }
});