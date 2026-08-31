import requests

from prompts import get_system_prompt


OLLAMA_URL = "http://localhost:11434/api/generate"

MODEL = "qwen2.5-coder:7b"


def get_ai_response(
    question,
    topic="general",
    level="beginner",
    mode="learn",
    language="python",
    history=None
):

    if history is None:
        history = []


    # Build conversation history
    conversation = ""

    for message in history:

        conversation += f"""
{message["role"].upper()}:
{message["content"]}
"""


    # Get the structured CodeBuddy system prompt
    system_prompt = get_system_prompt(
        topic=topic,
        level=level,
        mode=mode,
        language=language
    )


    # Build the student's request
    prompt = f"""
PREVIOUS CONVERSATION

{conversation}


CURRENT STUDENT QUESTION

{question}


Remember:

- Answer specifically for the topic: {topic}
- Student level: {level}
- Learning mode: {mode}
- Programming language: {language}

Follow the required JSON structure exactly.
Return ONLY valid JSON.
"""


    payload = {

        "model": MODEL,

        "system": system_prompt,

        "prompt": prompt,

        "stream": False,

        "format": "json"
    }


    try:

        response = requests.post(
            OLLAMA_URL,
            json=payload,
            timeout=120
        )

        response.raise_for_status()


        data = response.json()


        # Get Ollama's generated response
        answer = data.get("response", "")


        if not answer:

            raise Exception(
                "Ollama returned an empty response."
            )


        return answer


    except requests.exceptions.ConnectionError:

        raise Exception(
            "Could not connect to Ollama. "
            "Make sure Ollama is running."
        )


    except requests.exceptions.Timeout:

        raise Exception(
            "Ollama took too long to respond."
        )


    except requests.exceptions.RequestException as e:

        raise Exception(
            f"Ollama request failed: {str(e)}"
        )