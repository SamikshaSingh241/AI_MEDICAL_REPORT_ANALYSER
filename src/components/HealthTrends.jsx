import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function HealthTrends({ chartData = [] }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4 }}
      className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 col-span-1 lg:col-span-2"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Health Trends</h3>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-3 h-3 rounded-full bg-teal-500"></span>
            <span className="text-slate-600 dark:text-slate-300">Cholesterol</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-3 h-3 rounded-full bg-rose-400"></span>
            <span className="text-slate-600 dark:text-slate-300">Blood Sugar</span>
          </div>
        </div>
      </div>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCholesterol" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorSugar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#fb7185" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#fb7185" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: 'var(--tw-colors-slate-900, #0f172a)', color: '#fff' }}
              itemStyle={{ color: '#fff' }}
            />
            <Area type="monotone" dataKey="cholesterol" stroke="#14b8a6" strokeWidth={3} fillOpacity={1} fill="url(#colorCholesterol)" />
            <Area type="monotone" dataKey="sugar" stroke="#fb7185" strokeWidth={3} fillOpacity={1} fill="url(#colorSugar)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
