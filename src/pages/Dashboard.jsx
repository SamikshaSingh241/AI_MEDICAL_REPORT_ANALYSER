import { useState } from 'react';
import Navbar from '../components/Navbar';
import UploadZone from '../components/UploadZone';
import AiSummaryPanel from '../components/AiSummaryPanel';
import MedicationExplainer from '../components/MedicationExplainer';
import LifestyleSuggestions from '../components/LifestyleSuggestions';
import HealthTrends from '../components/HealthTrends';
import InsightsPanel from '../components/InsightsPanel';
import { defaultData, newData } from '../data/mockData';

export default function Dashboard() {
  const [data, setData] = useState(defaultData);

  const handleUploadSuccess = (reportData) => {
    // When a new file is uploaded, use the real backend parsed data
    setData(reportData);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 font-sans selection:bg-teal-500/30">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          <div className="lg:col-span-2 flex flex-col gap-8">
            <UploadZone onUploadSuccess={handleUploadSuccess} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
              <AiSummaryPanel summaryText={data.summaryText} anomalies={data.anomalies} />
              <InsightsPanel insights={data.insights} />
            </div>
          </div>
          <div className="lg:col-span-1 flex flex-col gap-8">
            <MedicationExplainer medications={data.medications} />
            <LifestyleSuggestions tips={data.tips} />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <HealthTrends chartData={data.chartData} />
        </div>
        
      </main>
    </div>
  );
}
