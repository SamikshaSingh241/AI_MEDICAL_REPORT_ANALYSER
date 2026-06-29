import { motion } from 'framer-motion';
import { LightBulbIcon, ArrowTrendingUpIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import jsPDF from 'jspdf';

export default function InsightsPanel({ insights = [] }) {
  
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(20, 184, 166);
    doc.text("MediSense AI - Health Report", 20, 30);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(15, 23, 42);
    doc.text("Date: " + new Date().toLocaleDateString(), 20, 40);
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("AI Recommendations:", 20, 60);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    
    insights.forEach((insight, i) => {
      const lines = doc.splitTextToSize(`${i+1}. ${insight}`, 170);
      doc.text(lines, 20, 75 + (i * 20));
    });
    
    doc.save("MediSense_Report.pdf");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl p-6 text-white shadow-lg shadow-teal-500/20 h-full flex flex-col"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
          <LightBulbIcon className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-lg font-bold">AI Recommendations</h3>
      </div>
      
      <div className="space-y-4 flex-grow">
        {insights.map((insight, idx) => (
          <div key={idx} className="flex gap-4 p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
            {idx % 2 === 0 ? (
              <ArrowTrendingUpIcon className="w-5 h-5 flex-shrink-0 mt-0.5 text-teal-100" />
            ) : (
              <ShieldCheckIcon className="w-5 h-5 flex-shrink-0 mt-0.5 text-teal-100" />
            )}
            <p className="text-sm text-teal-50 leading-relaxed">
              {insight}
            </p>
          </div>
        ))}
      </div>
      
      <button 
        onClick={handleDownloadPDF}
        className="w-full mt-6 py-3 rounded-xl bg-white text-teal-600 font-semibold text-sm hover:bg-slate-50 transition-colors shadow-sm"
      >
        Download Full PDF Report
      </button>
    </motion.div>
  );
}
