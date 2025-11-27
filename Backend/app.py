import os
import time
from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai
from prompts import MODES, TASK_TEMPLATES, RESPONSE_STYLES

app = Flask(__name__)
CORS(app)

# --- GEMINI API KEY ---
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY missing in environment.")

client = genai.Client(api_key=api_key)

@app.route("/ask", methods=["POST"])
def ask():
    data = request.json
    mode = data.get("mode")
    task = data.get("task")  # Optional
    style = data.get("style")  # Optional
    user_input = data.get("prompt")

    start_time = time.time()

    # --- Build system prompt ---
    if mode not in MODES:
        return jsonify({"error": "Invalid mode"}), 400
    system_prompt = MODES[mode]

    if task in TASK_TEMPLATES:
        system_prompt += "\n" + TASK_TEMPLATES[task]

    if style in RESPONSE_STYLES:
        system_prompt += "\n" + RESPONSE_STYLES[style]

    full_prompt = f"{system_prompt}\nUser: {user_input}"

    # --- Gemini API Call ---
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=full_prompt
    )

    latency = round(time.time() - start_time, 2)

    return jsonify({
        "response": response.text,
        "latency_seconds": latency
    })

if __name__ == "__main__":
    app.run(debug=True)
