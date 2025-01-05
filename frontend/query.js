document.addEventListener('DOMContentLoaded', async function() {
    const response = await fetch('http://127.0.0.1:5000/query_data');
    
    if (!response.ok) {
        console.error('HTTP error', response.status);
        return;
    }

    const data = await response.json();
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `
        <p>总数据数量: ${data.total_documents}</p>
        <p>未回答问题数量: ${data.unanswered_count}</p>
    `;

    const dropdown = document.getElementById('unansweredQuestions');
    dropdown.innerHTML = ''; // Clear existing options

    data.unanswered_questions.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id; // Set the ID as the value
        option.textContent = item.question; // Display the question text
        dropdown.appendChild(option);
    });

    // Handle edit question button click
    document.getElementById('editQuestion').addEventListener('click', function() {
        const selectedOption = dropdown.options[dropdown.selectedIndex];
        if (selectedOption.value) {
            document.getElementById('editText').value = selectedOption.textContent; // Set the textarea to the selected question
            document.getElementById('modal').style.display = 'flex'; // Show the modal
        } else {
            alert('请先选择一个未回答问题。');
        }
    });

    // Close modal
    document.getElementById('closeModal').addEventListener('click', function() {
        document.getElementById('modal').style.display = 'none';
    });

    // Update question
    document.getElementById('updateQuestion').addEventListener('click', async function() {
        const selectedOption = dropdown.options[dropdown.selectedIndex];
        const updatedQuestion = document.getElementById('editText').value;

        if (selectedOption.value && updatedQuestion.trim()) {
            await fetch(`http://127.0.0.1:5000/update_question/${selectedOption.value}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ question: updatedQuestion })
            });
            alert('问题已更新。');
            document.getElementById('modal').style.display = 'none';
            location.reload(); // Reload the page to refresh the dropdown
        } else {
            alert('请填写更新内容。');
        }
    });

    // Delete question
    document.getElementById('deleteQuestion').addEventListener('click', async function() {
        const selectedOption = dropdown.options[dropdown.selectedIndex];

        if (selectedOption.value) {
            await fetch(`http://127.0.0.1:5000/delete_question/${selectedOption.value}`, {
                method: 'DELETE'
            });
            alert('问题已删除。');
            document.getElementById('modal').style.display = 'none';
            location.reload(); // Reload the page to refresh the dropdown
        } else {
            alert('请先选择一个未回答问题。');
        }
    });

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
                    
                    // 隐藏“问题未找到”按钮
                    const notFoundButton = document.getElementById('notFoundButton');
                    if (notFoundButton) {
                        notFoundButton.style.display = 'none'; // 隐藏按钮
                    }
                }
            };
            responseDiv.appendChild(toggleButton);
        }
    } else {
        responseDiv.innerHTML = '<p>没有找到相似的问题。</p>';
    }

    // 清空输入框
    document.getElementById('question').value = '';
}); 