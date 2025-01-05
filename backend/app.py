from flask import Flask, request, jsonify
from model import get_answer
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS
#app = Flask(__name__)

@app.route('/ask', methods=['POST'])
def ask():
    question = request.json.get('question')
    similar_answers, similar_questions = get_answer(question)
    return jsonify({
        'similar_answers': similar_answers,
        'similar_questions': similar_questions
    })

if __name__ == '__main__':
    app.run(debug=True) 