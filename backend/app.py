from flask import Flask, request, jsonify
from model import get_answer, submit_no_answer
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

if __name__ == '__main__':
    app.run(debug=True) 