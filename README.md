<div align="center">

# ⚖️ LexiBot

### AI-Powered Legal Advisor

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-2.x-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com)
[![Groq](https://img.shields.io/badge/Groq-LLaMA_3.3_70B-F55036?style=for-the-badge&logo=groq&logoColor=white)](https://groq.com)
[![License](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)](LICENSE)

<img src="https://img.shields.io/badge/Status-Live-success?style=flat-square" />
<img src="https://img.shields.io/badge/AI_Model-LLaMA_3.3_70B-blueviolet?style=flat-square" />
<img src="https://img.shields.io/badge/Voice-Whisper_v3-orange?style=flat-square" />

</div>

---

## 🧠 What is LexiBot?

**LexiBot** is an AI-powered legal assistant that analyzes legal case PDFs and delivers instant case summaries, legal recommendations, and a **Legal Risk Score** — powered by Meta's LLaMA 3.3 70B model on Groq's ultra-fast inference engine.

> Upload a legal document. Ask your question. Get expert-level legal insight in seconds.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📄 **PDF Case Analysis** | Upload any legal PDF — contracts, court cases, agreements |
| 🧠 **AI Case Summary** | Structured summary with parties, facts, legal issues & applicable laws |
| ⚖️ **Legal Recommendation** | References 2-3 similar cases + actionable legal advice |
| 📊 **Legal Risk Score** | 0–100 animated risk meter — instantly assess case strength |
| 🎙️ **Voice Query** | Record your legal question via microphone (Whisper v3 transcription) |
| 📥 **PDF Export** | Download AI-generated case summary as a PDF |
| 🌐 **Fully Responsive** | Works on desktop, tablet, and mobile |
| ✨ **Premium Dark UI** | Glassmorphism + animated starfield + typing effects |

---

## 🛠️ Tech Stack

### Backend

| Tool | Purpose |
|------|---------|
| Python 3.10+ | Core language |
| Flask | Web framework & REST API |
| Flask-CORS | Cross-origin resource sharing |
| Groq API | Ultra-fast LLM inference |
| LLaMA 3.3 70B | Case summarization & legal analysis |
| Whisper v3 | Speech-to-text for voice queries |
| PyMuPDF | PDF text extraction |
| fpdf2 | PDF generation for summaries |
| python-dotenv | Secure API key management |

### Frontend

| Tool | Purpose |
|------|---------|
| HTML5 | Semantic structure |
| CSS3 | Glassmorphism, animations, responsive grid |
| Vanilla JS | Fetch API, drag & drop, voice recording |
| Canvas API | Animated starfield background |
| Web Audio API | Voice recording via MediaRecorder |

---

## 📂 Project Structure

```
lexibot-ai_lawyer_chatbot/
│
├── app.py                   ← Flask backend (API routes)
├── pipeline.py              ← PDF read/write utilities
├── requirements.txt         ← Python dependencies
├── .env                     ← API keys (not committed)
│
└── static/
    ├── index.html           ← Main HTML structure
    │
    ├── css/
    │   ├── base.css         ← CSS variables, reset, fonts
    │   ├── animations.css   ← All keyframe animations
    │   ├── layout.css       ← Header, grid, cards, footer
    │   └── components.css   ← Buttons, inputs, upload, risk score
    │
    └── js/
        ├── stars.js         ← Animated starfield canvas
        ├── upload.js        ← Drag & drop file handling
        ├── voice.js         ← Voice recording & transcription
        └── analyze.js       ← API calls, typing effect, risk score
```

---

## ⚡ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/sagarjain2205/lexibot-ai_lawyer_chatbot.git
```

```bash
cd lexibot-ai_lawyer_chatbot
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Set up environment variables

Create a `.env` file in the root folder:

```env
GROQ_API_KEY=your_groq_api_key_here
```

> 🔑 Get your free Groq API key at [console.groq.com](https://console.groq.com)

### 4. Run the server

```bash
python app.py
```

### 5. Open in browser

```
http://localhost:5000
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Serve frontend |
| `POST` | `/analyze` | Analyze PDF → summary, recommendation & risk score |
| `POST` | `/transcribe` | Transcribe voice query using Whisper v3 |
| `GET` | `/download` | Download generated summary PDF |

### `/analyze` Request

```
Content-Type: multipart/form-data

pdf   → legal case PDF file
query → user's legal question (optional)
```

### `/analyze` Response

```json
{
  "summary": "Case summary text...",
  "query": "User's legal question",
  "recommendation": "Legal advice with similar cases...",
  "risk": {
    "score": 75,
    "verdict": "Strong Case",
    "reason": "Clear breach of contract with documented evidence"
  }
}
```

---

## 📜 License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) for details.

---

<div align="center">

Made with ❤️ by **Sagar Jain**

[![GitHub](https://img.shields.io/badge/GitHub-sagarjain2205-181717?style=for-the-badge&logo=github)](https://github.com/sagarjain2205)

⚖️ *LexiBot — Democratizing Legal Knowledge with AI*

</div>
