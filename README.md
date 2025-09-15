# VisuLearn — Chat-to-Visualization App

VisuLearn is an interactive app that **explains concepts with both text and visualization** using LLMs.

---

## 🚀 Features
- Ask a question (e.g., “Explain Newton’s First Law of Motion”).
- Backend (Node.js + Express) generates:
  - 📄 Clear text explanation
  - 🎨 JSON visualization spec
- Frontend (React) displays chat + renders visualization
- Realtime updates via **Server-Sent Events (SSE)**
- Play / Pause visualization controls

---

## 🛠 Tech Stack
- **Backend:** Node.js (Express)
- **Frontend:** React + Vite
- **Realtime:** SSE
- **LLM:** OpenAI (or Hugging Face / Ollama)

---

## ⚙️ Setup

### 1. Clone repo
```bash
git clone https://github.com/<your-username>/VisuLearn.git
cd VisuLearn


<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/temp/1

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
