const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const { GoogleGenAI } = require('@google/genai');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const User = require('./models/User');
const Report = require('./models/Report');

const app = express();
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'https://ai-medical-report-analyzer.vercel.app',
    'https://ai-medical-report-analyzer-git-main-samikshasingh241s-projects.vercel.app' // Optional wildcard fallback can be configured if needed, but array is safer
  ], 
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

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
    // Simple authentication against MongoDB
    const user = await User.findOne({ email, password });
    if (user) {
      // Generate JWT
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      
      // Set HttpOnly Cookie
      res.cookie('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.json({ success: true, email: user.email });
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

    // Generate JWT
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    // Set HttpOnly Cookie
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({ success: true, email: newUser.email });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 1.6 Auth Logout Route
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('auth_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });
  res.json({ success: true });
});

// Auth Middleware
const verifyToken = (req, res, next) => {
  const token = req.cookies.auth_token;
  if (!token) return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.clearCookie('auth_token');
    res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
  }
};

// 2. Upload & Analyze Route
app.post('/api/reports/analyze', verifyToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    
    // Get userId from verified JWT token
    const userId = req.userId;

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
