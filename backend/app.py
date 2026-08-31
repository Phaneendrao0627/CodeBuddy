from flask import Flask, request, jsonify
from flask_cors import CORS
from ai_service import get_ai_response


app = Flask(__name__)

# Allow the React frontend to communicate with Flask
CORS(app)


# Temporary in-memory session storage
sessions = {}


@app.route("/ask", methods=["POST"])
def ask():

    data = request.get_json()

    if not data:
        return jsonify({
            "error": "Request body is required"
        }), 400

    question = data.get("question", "").strip()

    if not question:
        return jsonify({
            "error": "Question is required"
        }), 400

    session_id = data.get(
        "session_id",
        "default"
    )

    topic = data.get(
        "topic",
        "general"
    )

    level = data.get(
        "level",
        "beginner"
    )

    mode = data.get(
        "mode",
        "learn"
    )

    language = data.get(
        "language",
        "python"
    )


    # Create session if it doesn't exist
    if session_id not in sessions:
        sessions[session_id] = []


    # Retrieve previous conversation
    history = sessions[session_id]


    try:

        answer = get_ai_response(
            question=question,
            topic=topic,
            level=level,
            mode=mode,
            language=language,
            history=history
        )


        # Save student message
        history.append({
            "role": "student",
            "content": question
        })


        # Save AI response
        history.append({
            "role": "assistant",
            "content": answer
        })


        # Keep conversation manageable
        if len(history) > 20:
            sessions[session_id] = history[-20:]


        return jsonify({

            "session_id": session_id,

            "question": question,

            "topic": topic,

            "level": level,

            "mode": mode,

            "language": language,

            "answer": answer

        })


    except Exception as e:

        print("AI ERROR:", e)

        return jsonify({
            "error": str(e)
        }), 500


@app.route("/")
def home():

    return "CodeBuddy DSA Assistant is running!"


if __name__ == "__main__":

    app.run(
        debug=True,
        host="127.0.0.1",
        port=5000
    )