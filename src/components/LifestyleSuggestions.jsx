import { motion } from 'framer-motion';
import { HeartIcon, BoltIcon, FireIcon, MoonIcon } from '@heroicons/react/24/outline';

const iconMap = {
  FireIcon, BoltIcon, HeartIcon, MoonIcon
};

export default function LifestyleSuggestions({ tips = [] }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800"
    >
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Lifestyle & Diet Tips</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {tips.map((tip, idx) => {
          const IconComponent = iconMap[tip.iconType] || FireIcon;
          return (
            <div key={idx} className="flex gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 hover:shadow-md transition-shadow">
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${tip.color}`}>
                <IconComponent className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">{tip.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{tip.desc}</p>
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  );
}
