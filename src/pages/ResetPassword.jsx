import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match. Please try again.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setError('');
    setSuccess(true);
    
    // Simulate API call and redirect
    setTimeout(() => {
      navigate('/login');
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 sm:px-6 lg:px-8 selection:bg-teal-500/30">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white dark:bg-slate-900 p-10 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800"
      >
        {!success ? (
          <>
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Create New Password
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Please enter your new secure password below.
              </p>
            </div>
            
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-sm text-rose-600 dark:bg-rose-900/30 dark:border-rose-800/50 dark:text-rose-400">
                  {error}
                </div>
              )}
              <div className="space-y-4 rounded-md shadow-sm">
                <div>
                  <label htmlFor="new-password" className="sr-only">New Password</label>
                  <input
                    id="new-password"
                    name="newPassword"
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="relative block w-full rounded-xl border-0 py-3 px-4 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-teal-500 bg-white dark:bg-slate-800 transition-all sm:text-sm sm:leading-6"
                    placeholder="New Password"
                  />
                </div>
                <div>
                  <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
                  <input
                    id="confirm-password"
                    name="confirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="relative block w-full rounded-xl border-0 py-3 px-4 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-teal-500 bg-white dark:bg-slate-800 transition-all sm:text-sm sm:leading-6"
                    placeholder="Confirm New Password"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center rounded-xl bg-teal-500 py-3 px-3 text-sm font-semibold text-white hover:bg-teal-600 transition-colors shadow-lg shadow-teal-500/25"
              >
                Save New Password
              </button>
            </form>
          </>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-6">
              <CheckCircleIcon className="w-8 h-8 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Password Updated!
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Your password has been changed successfully. Redirecting to login...
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
