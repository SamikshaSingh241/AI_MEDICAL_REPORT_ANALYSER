export const defaultData = {
  summaryText: "Based on your recent blood work, your overall health markers are stable, but there are a few areas that need attention. Your LDL Cholesterol is slightly elevated, and your Vitamin D levels are significantly low, which might explain recent fatigue.",
  anomalies: [
    { label: 'LDL Cholesterol', value: '145 mg/dL', status: 'high', severity: 'warning' },
    { label: 'Vitamin D', value: '18 ng/mL', status: 'low', severity: 'critical' },
    { label: 'Fasting Glucose', value: '98 mg/dL', status: 'normal', severity: 'good' },
  ],
  medications: [
    {
      name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily at bedtime',
      purpose: 'Lowers "bad" cholesterol (LDL) and triglycerides in the blood.',
      warnings: 'Avoid drinking large amounts of grapefruit juice.',
    },
    {
      name: 'Metformin', dosage: '500mg', frequency: 'Twice daily with meals',
      purpose: 'Improves blood sugar control in adults with type 2 diabetes.',
      warnings: 'May cause stomach upset initially. Take with food.',
    }
  ],
  tips: [
    {
      title: 'Mediterranean Diet', desc: 'Focus on olive oil, nuts, and fish to help lower your LDL cholesterol.',
      iconType: 'FireIcon', color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    },
    {
      title: 'Morning Sun', desc: 'Get 15-20 minutes of morning sunlight to boost Vitamin D levels natively.',
      iconType: 'BoltIcon', color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    },
    {
      title: 'Cardio Routine', desc: '30 mins of brisk walking daily improves cardiovascular health.',
      iconType: 'HeartIcon', color: 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400',
    },
    {
      title: 'Sleep Hygiene', desc: 'Maintain a consistent sleep schedule to aid recovery and energy.',
      iconType: 'MoonIcon', color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
    }
  ],
  insights: [
    "Your cholesterol is trending down! A 15% improvement over the last 3 months. Keep up the Mediterranean diet.",
    "Blood pressure is well within the optimal range (118/76). No medication adjustments needed at this time."
  ],
  chartData: [
    { month: 'Jan', cholesterol: 180, sugar: 95 },
    { month: 'Feb', cholesterol: 175, sugar: 92 },
    { month: 'Mar', cholesterol: 160, sugar: 88 },
    { month: 'Apr', cholesterol: 165, sugar: 90 },
    { month: 'May', cholesterol: 155, sugar: 85 },
    { month: 'Jun', cholesterol: 145, sugar: 82 },
  ]
};

export const newData = {
  summaryText: "Analysis of your latest comprehensive panel shows remarkable improvements. Your HDL (good cholesterol) is up, and your inflammatory markers have normalized. Your iron levels are slightly below optimal.",
  anomalies: [
    { label: 'Iron (Serum)', value: '60 mcg/dL', status: 'borderline', severity: 'warning' },
    { label: 'HDL Cholesterol', value: '55 mg/dL', status: 'optimal', severity: 'good' },
    { label: 'CRP (Inflammation)', value: '0.8 mg/L', status: 'normal', severity: 'good' },
  ],
  medications: [
    {
      name: 'Atorvastatin', dosage: '10mg', frequency: 'Once daily at bedtime',
      purpose: 'Maintains cholesterol levels. Dosage reduced due to improvements.',
      warnings: 'Continue to avoid large amounts of grapefruit juice.',
    },
    {
      name: 'Iron Supplement', dosage: '65mg', frequency: 'Once daily with Vitamin C',
      purpose: 'Addresses borderline low iron levels to prevent anemia.',
      warnings: 'May cause dark stools. Take on an empty stomach if tolerated.',
    }
  ],
  tips: [
    {
      title: 'Iron-Rich Foods', desc: 'Incorporate more spinach, lentils, and lean red meats into your meals.',
      iconType: 'FireIcon', color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    },
    {
      title: 'Vitamin C Pairing', desc: 'Eat citrus fruits along with iron-rich foods to boost absorption.',
      iconType: 'BoltIcon', color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    },
    {
      title: 'Strength Training', desc: 'Add 2 days of light resistance training to build bone density.',
      iconType: 'HeartIcon', color: 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400',
    }
  ],
  insights: [
    "Fantastic progress! Your overall cardiovascular risk has decreased by 20% since your last visit.",
    "Inflammation is fully managed. Your current lifestyle interventions are working perfectly."
  ],
  chartData: [
    { month: 'Mar', cholesterol: 160, sugar: 88 },
    { month: 'Apr', cholesterol: 165, sugar: 90 },
    { month: 'May', cholesterol: 155, sugar: 85 },
    { month: 'Jun', cholesterol: 145, sugar: 82 },
    { month: 'Jul', cholesterol: 130, sugar: 80 },
    { month: 'Aug', cholesterol: 125, sugar: 78 },
  ]
};
