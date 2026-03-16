from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
from pipeline import read_pdf, save_summary_to_pdf
from groq import Groq
import os, json, tempfile

load_dotenv()
app = Flask(__name__, static_folder="static")
CORS(app)
client = Groq()

@app.route("/")
def index():
    return send_from_directory("static", "index.html")

@app.route("/analyze", methods=["POST"])
def analyze():
    try:
        if "pdf" not in request.files:
            return jsonify({"error": "No PDF uploaded"}), 400

        pdf_file = request.files["pdf"]
        query    = request.form.get("query", "").strip()

        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            pdf_file.save(tmp.name)
            tmp_path = tmp.name

        case_text = read_pdf(tmp_path)

        # Step 1: Summarize
        summary = Groq().chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a highly experienced senior advocate. Read and analyze the provided legal case. Summarize it clearly including: parties involved, case background, relevant facts, legal issues, applicable laws/sections, and current status. Use formal legal language. Be accurate and concise."},
                {"role": "user",   "content": case_text}
            ]
        ).choices[0].message.content

        os.makedirs("summaries", exist_ok=True)
        save_summary_to_pdf(summary, "summaries/summary_output.pdf")

        # Step 2: Recommendation
        recommendation = Groq().chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a highly respected senior advocate. Analyze the legal case deeply. Reference 2-3 similar relevant cases with context, outcome, and relevance. Then provide your legal suggestion. Use clear legal language. Be concise, well-organized, and actionable."},
                {"role": "user",   "content": f"Case Summary:\n{summary}\n\nUser Query: {query or 'Give general legal advice for this case.'}"}
            ]
        ).choices[0].message.content

        # Step 3: Risk Score
        risk_raw = Groq().chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": 'You are a legal risk analyst. Based on the case summary, give a legal risk score 0-100 for the plaintiff (100=very strong, 0=very weak). Reply ONLY with JSON: {"score": 75, "verdict": "Strong Case", "reason": "one line reason"}. Nothing else.'},
                {"role": "user",   "content": summary}
            ]
        ).choices[0].message.content.strip()

        try:
            risk = json.loads(risk_raw.replace("```json","").replace("```","").strip())
        except Exception:
            risk = {"score": 50, "verdict": "Neutral", "reason": "Could not determine risk."}

        os.unlink(tmp_path)
        return jsonify({"summary": summary, "query": query or "General legal analysis", "recommendation": recommendation, "risk": risk})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/transcribe", methods=["POST"])
def transcribe():
    try:
        if "audio" not in request.files:
            return jsonify({"error": "No audio file"}), 400
        audio_file = request.files["audio"]
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as tmp:
            audio_file.save(tmp.name)
            tmp_path = tmp.name
        with open(tmp_path, "rb") as f:
            transcript = client.audio.transcriptions.create(model="whisper-large-v3", file=f, response_format="verbose_json")
        os.unlink(tmp_path)
        return jsonify({"text": transcript.text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/download")
def download():
    try:
        return send_from_directory("summaries", "summary_output.pdf", as_attachment=True)
    except Exception:
        return jsonify({"error": "No summary yet"}), 404

if __name__ == "__main__":
    print("\n⚖️  LexiBot → http://localhost:5000\n")
    app.run(debug=True, port=5000)