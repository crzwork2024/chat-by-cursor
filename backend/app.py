from flask import Flask, request, jsonify
from model import get_answer, submit_no_answer, query_data_from_db
from flask_cors import CORS


app = Flask(__name__)
CORS(app)  # Enable CORS


@app.route('/ask', methods=['POST'])
def ask():
    question = request.json.get('question')
    similar_answers, similar_questions = get_answer(question)
    return jsonify({
        'similar_answers': similar_answers,
        'similar_questions': similar_questions
    })

@app.route('/record_unanswered', methods=['POST'])
def record_unanswered():
    data = request.get_json()
    question = data.get('question')

    # Logic to record the unanswered question in ChromaDB
    # Assuming you have a collection named 'questions'
    submit_no_answer(question)
    return jsonify({'message': '问题已记录为未回答。'})

@app.route('/query_data', methods=['GET'])
def query_data():
    total_documents, unanswered_count, unanswered_questions = query_data_from_db()
    return jsonify({
        'total_documents': total_documents,
        'unanswered_count': unanswered_count,
        'unanswered_questions': unanswered_questions  # Return unanswered questions with IDs
    })

@app.route('/unanswered_questions', methods=['GET'])
def get_unanswered_questions():
    # Fetch all documents and filter for unanswered questions
    unanswered_questions = [
        doc['question'] for doc in collection.get()['documents'] 
        if doc['answer'] == '未回答问题'
    ]
    return jsonify(unanswered_questions)

if __name__ == '__main__':
    app.run(debug=True) 