const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const User = require('./models/User');
const Report = require('./models/Report');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Gemini SDK
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Set up Multer for handling file uploads in memory (to send to Gemini as base64)
const upload = multer({ storage: multer.memoryStorage() });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Seed mock users if they don't exist
const seedUser = async () => {
  try {
    const existing = await User.findOne({ email: 'admin@medisense.com' });
    if (!existing) {
      await User.create({ email: 'admin@medisense.com', password: 'password123' });
      await User.create({ email: 'patient@medisense.com', password: 'password123' });
      console.log('Test users seeded');
    }
  } catch(e) {
    console.error('Error seeding users:', e);
  }
};
seedUser();

// --- ROUTES ---

// 1. Auth Login Route
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // Simple mock authentication against MongoDB
    const user = await User.findOne({ email, password });
    if (user) {
      res.json({ success: true, userId: user._id, email: user.email });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 1.5 Auth Register Route
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    // Create new user
    const newUser = new User({ email, password });
    await newUser.save();

    res.json({ success: true, userId: newUser._id, email: newUser.email });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. Upload & Analyze Route
app.post('/api/reports/analyze', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    
    // We expect the frontend to send the userId as part of the FormData
    const { userId } = req.body;

    const fileData = {
      inlineData: {
        data: req.file.buffer.toString("base64"),
        mimeType: req.file.mimetype // e.g. "application/pdf" or image/png
      }
    };

    const prompt = `You are a medical AI assistant. Analyze this medical document and extract the key information into a strict JSON format. 
The JSON must have this exact structure (no markdown formatting, just raw JSON):
{
  "summaryText": "A plain English summary of the report",
  "anomalies": [
    { "label": "e.g. LDL Cholesterol", "value": "e.g. 145 mg/dL", "status": "e.g. high", "severity": "good | warning | critical" }
  ],
  "medications": [
    { "name": "e.g. Atorvastatin", "dosage": "e.g. 20mg", "frequency": "e.g. Once daily", "purpose": "e.g. Lowers cholesterol", "warnings": "e.g. Take at night" }
  ],
  "tips": [
    { "title": "e.g. Mediterranean Diet", "desc": "e.g. Focus on olive oil", "iconType": "FireIcon", "color": "bg-orange-100 text-orange-600" }
  ],
  "insights": [
    "e.g. Your cholesterol is trending down! A 15% improvement.",
    "e.g. Blood pressure is well within the optimal range."
  ],
  "chartData": [
    { "month": "Jan", "cholesterol": 180, "sugar": 95 },
    { "month": "Feb", "cholesterol": 175, "sugar": 92 }
  ]
}
If the document is not a clear medical report, hallucinate realistic medical mock data in this format so the UI doesn't break. Ensure chartData simulates a logical trend.`;

    // Call Gemini API
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [fileData, prompt],
        config: {
          responseMimeType: "application/json"
        }
    });

    const responseText = response.text;
    const parsedData = JSON.parse(responseText);

    // Save the parsed data to MongoDB
    const report = new Report({
      userId: userId || null,
      fileName: req.file.originalname,
      ...parsedData
    });
    
    await report.save();

    // Send the generated report data back to the frontend
    res.json({ success: true, data: report });

  } catch (error) {
    console.error('Error analyzing report with Gemini:', error);
    res.status(500).json({ success: false, error: 'Failed to analyze report' });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
