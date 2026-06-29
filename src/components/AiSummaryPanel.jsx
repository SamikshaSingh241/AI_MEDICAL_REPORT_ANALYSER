import { motion } from 'framer-motion';
import { CheckCircleIcon, ExclamationTriangleIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';

export default function AiSummaryPanel({ summaryText = '', anomalies = [] }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 h-full"
    >
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
        <span className="bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 text-xs px-2 py-1 rounded-md font-semibold tracking-wider uppercase">AI Summary</span>
      </h3>
      
      <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
        {summaryText}
      </p>

      <div className="space-y-3">
        {anomalies.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
            <div className="flex items-center gap-3">
              {item.severity === 'good' && <CheckCircleIcon className="w-5 h-5 text-emerald-500" />}
              {item.severity === 'warning' && <ExclamationTriangleIcon className="w-5 h-5 text-amber-500" />}
              {item.severity === 'critical' && <ExclamationCircleIcon className="w-5 h-5 text-rose-500" />}
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{item.label}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-slate-900 dark:text-white">{item.value}</span>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                item.severity === 'good' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                item.severity === 'warning' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
              }`}>
                {item.status.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
