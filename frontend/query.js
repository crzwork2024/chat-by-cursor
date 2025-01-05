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
}); 