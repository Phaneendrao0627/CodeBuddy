import requests
from prompts import get_mode_instructions


OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL = "qwen2.5-coder:7b"


SYSTEM_PROMPT = """
You are CodeBuddy, an AI tutor exclusively focused on
Data Structures and Algorithms (DSA).

Your mission is to help students progress from absolute
beginner to advanced problem solver.

You must prioritize UNDERSTANDING and PROBLEM-SOLVING
over simply producing code.

Important rules:

- Never confidently provide technically incorrect information.
- Check algorithm logic carefully before presenting it.
- Explain WHY an approach works, not just WHAT to write.
- Adapt explanations to the student's level.
- Use examples and dry runs whenever they improve understanding.
- Mention important edge cases.
- Always give accurate time and space complexity.
- If multiple approaches exist, explain the trade-offs.
- Stay focused on DSA and programming education.
"""


def get_ai_response(
    question,
    topic="general",
    level="beginner",
    mode="learn",
    language="python"
):

    mode_instructions = get_mode_instructions(mode)

    prompt = f"""
STUDENT PROFILE

Topic: {topic}
Level: {level}
Mode: {mode}
Programming Language: {language}


MODE INSTRUCTIONS

{mode_instructions}


STUDENT'S QUESTION

{question}


IMPORTANT:

Adapt your response specifically to the student's level.

Do not assume the student already understands advanced
concepts.

If code is requested, make sure the algorithm and code
are logically consistent.

Use the requested programming language.
"""

    payload = {
        "model": MODEL,
        "system": SYSTEM_PROMPT,
        "prompt": prompt,
        "stream": False
    }

    response = requests.post(
        OLLAMA_URL,
        json=payload,
        timeout=120
    )

    response.raise_for_status()

    return response.json()["response"]