from flask import Flask, request, jsonify
from ai_service import get_ai_response

app = Flask(__name__)


@app.route("/ask", methods=["POST"])
def ask():
    data = request.get_json()

    question = data.get("question", "")
    topic = data.get("topic", "general")
    level = data.get("level", "beginner")
    mode = data.get("mode", "learn")
    language = data.get("language", "python")

    if not question:
        return jsonify({
            "error": "Question is required"
        }), 400

    try:
        answer = get_ai_response(
            question=question,
            topic=topic,
            level=level,
            mode=mode,
            language=language
        )

        return jsonify({
            "question": question,
            "topic": topic,
            "level": level,
            "mode": mode,
            "language": language,
            "answer": answer
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


if __name__ == "__main__":
    app.run(debug=True)