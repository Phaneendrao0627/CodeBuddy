from flask import Flask, request, jsonify
from ai_service import get_ai_response

app = Flask(__name__)


@app.route("/")
def home():
    return "Welcome to CodeBuddy!"


@app.route("/ask", methods=["POST"])
def ask():
    data = request.get_json()

    if not data:
        return jsonify({"error": "Request body is required"}), 400

    question = data.get("question")

    if not question or not question.strip():
        return jsonify({"error": "Question is required"}), 400

    answer = get_ai_response(question)

    return jsonify({
        "question": question,
        "answer": answer
    })


if __name__ == "__main__":
    app.run(debug=True)
