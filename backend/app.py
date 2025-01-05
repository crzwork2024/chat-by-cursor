from flask import Flask, request, jsonify
from model import get_answer, submit_no_answer, query_data_from_db, delete_unanswered_question, update_unanswered_question
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
    print('############ ',question)
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

@app.route('/update_question/<question_id>', methods=['PUT'])
def update_question(question_id):
    data = request.get_json()
    updated_answer = data.get('question')  # Get the updated answer from the request

    update_unanswered_question(question_id, updated_answer)
    
    return jsonify({'message': '问题已更新。'})


@app.route('/delete_question/<question_id>', methods=['DELETE'])
def delete_question(question_id):
    try:
        # Logic to delete the question from ChromaDB
        delete_unanswered_question(question_id)
        return jsonify({'message': '问题已删除。'})
    except Exception as e:
        print(f"Error deleting question with ID {question_id}: {e}")  # Log the error
        return jsonify({'message': '删除问题时出错。', 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True) 