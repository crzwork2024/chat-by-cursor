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
}); 