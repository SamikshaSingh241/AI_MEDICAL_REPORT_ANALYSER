import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import emailjs from '@emailjs/browser';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  // 'login' | 'forgot' | 'reset-sent'
  const [view, setView] = useState('login');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include' // Allow receiving HttpOnly cookies
      });
      const data = await response.json();
      
      if (data.success) {
        navigate('/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Cannot connect to backend server. Is it running?');
      console.error(err);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include' // Allow receiving HttpOnly cookies
      });
      const data = await response.json();
      
      if (data.success) {
        navigate('/dashboard');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Cannot connect to backend server. Is it running?');
      console.error(err);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address first.');
      return;
    }
    
    setError('');
    setIsSending(true);

    try {
      // NOTE: Replace these with your actual EmailJS credentials
      const serviceId = 'service_rda1pxd';
      const templateId = 'template_0axza4w';
      const publicKey = 'iN4PFlaomCc0h4cG-';

      const templateParams = {
        to_email: email, // This matches the {{to_email}} variable in your EmailJS template
        reply_to: 'admin@medisense.com'
      };

      if (serviceId !== 'YOUR_SERVICE_ID') {
        await emailjs.send(serviceId, templateId, templateParams, publicKey);
      } else {
        // Simulate a network delay if keys aren't set up yet
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.warn('EmailJS keys not set! Simulating successful email send.');
      }
      
      setView('reset-sent');
    } catch (err) {
      const errorMessage = err?.text || err?.message || JSON.stringify(err);
      setError(`EmailJS Error: ${errorMessage}`);
      console.error('EmailJS Error:', err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 sm:px-6 lg:px-8 selection:bg-teal-500/30">
      <div className="max-w-md w-full relative">
        <AnimatePresence mode="wait">
          
          {view === 'login' && (
            <motion.div 
              key="login-view"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8 bg-white dark:bg-slate-900 p-10 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800"
            >
              <div className="text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-teal-500 flex items-center justify-center shadow-lg shadow-teal-500/30 mb-4">
                  <span className="text-white font-bold text-2xl">+</span>
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Welcome to Medi<span className="text-teal-500">Sense</span> AI
                </h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Sign in to access your medical dashboard
                </p>
              </div>
              
              <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                {error && (
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-sm text-rose-600 dark:bg-rose-900/30 dark:border-rose-800/50 dark:text-rose-400">
                    {error}
                  </div>
                )}
                <div className="space-y-4 rounded-md shadow-sm">
                  <div>
                    <label htmlFor="email-address" className="sr-only">Email address</label>
                    <input
                      id="email-address"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="relative block w-full rounded-xl border-0 py-3 px-4 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-teal-500 bg-white dark:bg-slate-800 transition-all sm:text-sm sm:leading-6"
                      placeholder="Email address"
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="sr-only">Password</label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="relative block w-full rounded-xl border-0 py-3 px-4 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-teal-500 bg-white dark:bg-slate-800 transition-all sm:text-sm sm:leading-6"
                      placeholder="Password"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-600 dark:border-slate-600 dark:bg-slate-700"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-900 dark:text-slate-300">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <button 
                      type="button"
                      onClick={() => { setError(''); setView('forgot'); }}
                      className="font-semibold text-teal-600 hover:text-teal-500 dark:text-teal-400 transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="group relative flex w-full justify-center rounded-xl bg-teal-500 py-3 px-3 text-sm font-semibold text-white hover:bg-teal-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 transition-colors shadow-lg shadow-teal-500/25"
                  >
                    Sign in
                  </button>
                </div>
                
                <div className="text-center text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Don't have an account? </span>
                  <button 
                    type="button"
                    onClick={() => { setError(''); setView('register'); }}
                    className="font-semibold text-teal-600 hover:text-teal-500 dark:text-teal-400 transition-colors"
                  >
                    Sign up
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {view === 'register' && (
            <motion.div 
              key="register-view"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8 bg-white dark:bg-slate-900 p-10 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800"
            >
              <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Create Account
                </h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Join MediSense AI today
                </p>
              </div>
              
              <form className="mt-8 space-y-6" onSubmit={handleRegister}>
                {error && (
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-sm text-rose-600 dark:bg-rose-900/30 dark:border-rose-800/50 dark:text-rose-400">
                    {error}
                  </div>
                )}
                <div className="space-y-4 rounded-md shadow-sm">
                  <div>
                    <label htmlFor="reg-email" className="sr-only">Email address</label>
                    <input
                      id="reg-email"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="relative block w-full rounded-xl border-0 py-3 px-4 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-teal-500 bg-white dark:bg-slate-800 transition-all sm:text-sm sm:leading-6"
                      placeholder="Email address"
                    />
                  </div>
                  <div>
                    <label htmlFor="reg-password" className="sr-only">Password</label>
                    <input
                      id="reg-password"
                      name="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="relative block w-full rounded-xl border-0 py-3 px-4 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-teal-500 bg-white dark:bg-slate-800 transition-all sm:text-sm sm:leading-6"
                      placeholder="Password"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="group relative flex w-full justify-center rounded-xl bg-teal-500 py-3 px-3 text-sm font-semibold text-white hover:bg-teal-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 transition-colors shadow-lg shadow-teal-500/25"
                  >
                    Sign up
                  </button>
                </div>
                
                <div className="text-center text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Already have an account? </span>
                  <button 
                    type="button"
                    onClick={() => { setError(''); setView('login'); }}
                    className="font-semibold text-teal-600 hover:text-teal-500 dark:text-teal-400 transition-colors"
                  >
                    Sign in
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {view === 'forgot' && (
            <motion.div 
              key="forgot-view"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8 bg-white dark:bg-slate-900 p-10 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800"
            >
              <div>
                <button 
                  onClick={() => { setError(''); setView('login'); }}
                  className="flex items-center text-sm text-slate-500 hover:text-teal-500 transition-colors mb-6"
                >
                  <ArrowLeftIcon className="w-4 h-4 mr-1" />
                  Back to login
                </button>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Reset Password
                </h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Enter your email and we'll send you a link to reset your password.
                </p>
              </div>

              <form className="mt-8 space-y-6" onSubmit={handleForgotPassword}>
                {error && (
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-sm text-rose-600 dark:bg-rose-900/30 dark:border-rose-800/50 dark:text-rose-400">
                    {error}
                  </div>
                )}
                <div>
                  <label htmlFor="reset-email" className="sr-only">Email address</label>
                  <input
                    id="reset-email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="relative block w-full rounded-xl border-0 py-3 px-4 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-teal-500 bg-white dark:bg-slate-800 transition-all sm:text-sm sm:leading-6"
                    placeholder="Enter your email address"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full flex justify-center rounded-xl bg-teal-500 py-3 px-3 text-sm font-semibold text-white hover:bg-teal-600 transition-colors shadow-lg shadow-teal-500/25 disabled:opacity-70"
                >
                  {isSending ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            </motion.div>
          )}

          {view === 'reset-sent' && (
            <motion.div 
              key="sent-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6 bg-white dark:bg-slate-900 p-10 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800"
            >
              <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-6">
                <CheckCircleIcon className="w-8 h-8 text-emerald-500" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Check your inbox
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 px-4">
                We've sent a password reset link to <span className="font-semibold text-slate-800 dark:text-slate-200">{email}</span>.
              </p>
              
              <button
                onClick={() => { setView('login'); setPassword(''); }}
                className="mt-8 w-full flex justify-center rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 py-3 px-3 text-sm font-semibold text-slate-800 dark:text-slate-200 transition-colors"
              >
                Return to Login
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
