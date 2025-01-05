document.getElementById('fetchData').addEventListener('click', async function() {
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
}); 