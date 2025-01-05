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
        // Show the first similar question and answer
        responseDiv.innerHTML += `<p><strong>相似问题 1:</strong> ${data.similar_questions[0]}</p>`;
        responseDiv.innerHTML += `<p><strong>答案 1:</strong> ${data.similar_answers[0]}</p>`;

        // Create an expandable section for the rest
        if (data.similar_questions.length > 1) {
            const expandableDiv = document.createElement('div');
            expandableDiv.style.display = 'none'; // Initially hidden
            for (let i = 1; i < data.similar_answers.length; i++) {
                expandableDiv.innerHTML += `<p><strong>相似问题 ${i + 1}:</strong> ${data.similar_questions[i]}</p>`;
                expandableDiv.innerHTML += `<p><strong>答案 ${i + 1}:</strong> ${data.similar_answers[i]}</p>`;
            }
            responseDiv.appendChild(expandableDiv);

            // Add a button to toggle the expandable section
            const toggleButton = document.createElement('button');
            toggleButton.innerText = '显示更多答案';
            toggleButton.onclick = function() {
                if (expandableDiv.style.display === 'none') {
                    expandableDiv.style.display = 'block';
                    toggleButton.innerText = '隐藏答案';
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
}

// 添加事件监听器以支持 Enter 键提交
document.getElementById('question').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        askQuestion();
    }
}); 