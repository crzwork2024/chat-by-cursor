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
    
    // 打印返回的数据到控制台
    console.log('Response data1:', data);

    // 清空之前的响应
    responseDiv.innerHTML = '';

    // 显示相似问题和答案
    if (data.similar_answers && data.similar_questions) {
        for (let i = 0; i < data.similar_answers.length; i++) {
            responseDiv.innerHTML += `<p><strong>相似问题 ${i + 1}:</strong> ${data.similar_questions[i]}</p>`;
            responseDiv.innerHTML += `<p><strong>答案 ${i + 1}:</strong> ${data.similar_answers[i]}</p>`;
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