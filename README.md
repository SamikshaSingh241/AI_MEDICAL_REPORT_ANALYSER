# MediSense AI - Medical Report Analyzer

MediSense AI is a full-stack web application designed to help patients and medical professionals instantly analyze medical reports, blood tests, and prescriptions using advanced AI.

## Features
- 📄 **Smart PDF Extraction:** Drag and drop medical PDFs to instantly extract key data.
- 🧠 **AI Summarization:** Powered by Google Gemini 1.5 Flash to provide plain-English summaries of complex medical jargon.
- 📊 **Health Trend Tracking:** Visualizes historical health markers (like cholesterol and blood sugar) using interactive charts.
- 💊 **Medication Insights:** Automatically identifies prescribed medications and provides easy-to-understand usage warnings.
- 🌙 **Dark Mode:** A fully responsive, modern UI built with TailwindCSS v4 and Framer Motion.

## Tech Stack
- **Frontend:** React, Vite, TailwindCSS v4, Recharts, Framer Motion
- **Backend:** Node.js, Express, Multer
- **Database:** MongoDB
- **AI Integration:** Google Gemini API (`@google/genai`)

## Local Development

### 1. Setup the Backend
Navigate to the `server` directory and create a `.env` file containing:
```
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
```
Then run:
```bash
cd server
npm install
node server.js
```

### 2. Setup the Frontend
In the root directory, create a `.env` file:
```
VITE_API_URL=http://localhost:5000
```
Then run:
```bash
npm install
npm run dev
```
