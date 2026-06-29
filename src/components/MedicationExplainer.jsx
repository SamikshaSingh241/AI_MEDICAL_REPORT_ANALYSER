import { Disclosure, Transition } from '@headlessui/react';
import { ChevronUpIcon, BeakerIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

export default function MedicationExplainer({ medications = [] }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800"
    >
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Medication Explainer</h3>
      
      <div className="space-y-3">
        {medications.map((med, idx) => (
          <Disclosure key={idx}>
            {({ open }) => (
              <div className={cn(
                "rounded-xl border transition-colors duration-200",
                open ? "border-teal-200 dark:border-teal-900/50 bg-teal-50/50 dark:bg-teal-900/10" : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              )}>
                <Disclosure.Button className="flex w-full justify-between items-center px-4 py-3 text-left">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-lg transition-colors",
                      open ? "bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-400" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                    )}>
                      <BeakerIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white block">{med.name}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">{med.dosage} &bull; {med.frequency}</span>
                    </div>
                  </div>
                  <ChevronUpIcon
                    className={cn(
                      "h-5 w-5 text-slate-400 transition-transform duration-200",
                      open ? "rotate-180" : ""
                    )}
                  />
                </Disclosure.Button>
                <Transition
                  enter="transition duration-150 ease-out"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition duration-75 ease-out"
                  leaveFrom="transform scale-100 opacity-100"
                  leaveTo="transform scale-95 opacity-0"
                >
                  <Disclosure.Panel className="px-4 pt-2 pb-4 text-sm text-slate-600 dark:text-slate-300">
                    <div className="mb-2">
                      <strong className="text-slate-700 dark:text-slate-200 font-semibold">Purpose:</strong> {med.purpose}
                    </div>
                    <div>
                      <strong className="text-slate-700 dark:text-slate-200 font-semibold">Note:</strong> {med.warnings}
                    </div>
                  </Disclosure.Panel>
                </Transition>
              </div>
            )}
          </Disclosure>
        ))}
      </div>
    </motion.div>
  );
}
