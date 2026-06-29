const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Optional for testing without strict auth
  },
  fileName: String,
  summaryText: String,
  anomalies: [{
    label: String,
    value: String,
    status: String,
    severity: String // 'good', 'warning', 'critical'
  }],
  medications: [{
    name: String,
    dosage: String,
    frequency: String,
    purpose: String,
    warnings: String
  }],
  tips: [{
    title: String,
    desc: String,
    iconType: String,
    color: String
  }],
  insights: [String],
  chartData: [{
    month: String,
    cholesterol: Number,
    sugar: Number
  }]
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
