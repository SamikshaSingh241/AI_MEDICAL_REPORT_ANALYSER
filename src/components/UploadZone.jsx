import { useRef, useState } from 'react';
import { DocumentArrowUpIcon, CheckCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

export default function UploadZone({ onUploadSuccess }) {
  const fileInputRef = useRef(null);
  const [status, setStatus] = useState('idle'); // idle, uploading, success
  const [fileName, setFileName] = useState('');

  const uploadFile = async (file) => {
    setStatus('uploading');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const userId = localStorage.getItem('userId');
      if (userId) formData.append('userId', userId);
      
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/reports/analyze`, {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      if (result.success) {
        setStatus('success');
        if (onUploadSuccess) onUploadSuccess(result.data);
      } else {
        setStatus('idle');
        console.error(result.error);
        alert('Upload failed: ' + result.error);
      }
    } catch (err) {
      setStatus('idle');
      console.error('Upload failed', err);
      alert('Upload failed: Cannot connect to server');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      uploadFile(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setFileName(file.name);
      uploadFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full relative group cursor-pointer"
      onClick={() => status === 'idle' && fileInputRef.current.click()}
      onDrop={status === 'idle' ? handleDrop : undefined}
      onDragOver={status === 'idle' ? handleDragOver : undefined}
    >
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.png,.jpg,.jpeg"
      />
      
      <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-500 animate-glow"></div>
      
      <div className="relative bg-white dark:bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800 rounded-2xl p-10 flex flex-col items-center justify-center text-center overflow-hidden transition-all duration-300 min-h-[240px]">
        
        {status === 'idle' && (
          <>
            <div className="w-16 h-16 rounded-full bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <DocumentArrowUpIcon className="w-8 h-8 text-teal-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Upload Medical Records
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-sm">
              Drag & drop your PDFs, X-Rays, or prescriptions here. Our AI will analyze them instantly.
            </p>
            <button className="px-6 py-2.5 rounded-full bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium transition-colors shadow-lg shadow-teal-500/25">
              Browse Files
            </button>
          </>
        )}

        {status === 'uploading' && (
          <div className="flex flex-col items-center">
            <ArrowPathIcon className="w-12 h-12 text-teal-500 animate-spin mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Analyzing {fileName}...
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Our AI is extracting medical data. Please wait.
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center">
            <CheckCircleIcon className="w-16 h-16 text-emerald-500 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Analysis Complete!
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Successfully extracted data from {fileName}
            </p>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setStatus('idle');
                setFileName('');
              }}
              className="px-6 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium transition-colors"
            >
              Upload Another File
            </button>
          </div>
        )}

      </div>
    </motion.div>
  );
}
