"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';


export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const text = await response.text();
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        console.error("Invalid JSON response from server:", text);
        throw new Error("Server communication error. Please ensure the backend is running properly.");
      }
      
      if (response.ok && data.token) {
        setSuccess(true);
        // Save to Auth headers layout
        localStorage.setItem('token', data.token);
        
        // Ensure userType exists! "Candidate" or "Employer"
        const userType = data.userType || (data.user?.is_employer ? 'Employer' : 'Candidate');
        localStorage.setItem('userType', userType);
        
        // Save raw user profile data
        localStorage.setItem(userType === 'Candidate' ? 'candidate' : 'employer', JSON.stringify(data.user));
        
        // Merge anonymously saved jobs
        if (userType === 'Candidate' && data.user?.id) {
            const anonSaved = JSON.parse(localStorage.getItem('savedJobs_anonymous') || '[]');
            const anonDetails = JSON.parse(localStorage.getItem('savedJobsDetails_anonymous') || '{}');
            
            if (anonSaved.length > 0) {
                const userSavedKey = `savedJobs_${data.user.id}`;
                const userDetailsKey = `savedJobsDetails_${data.user.id}`;
                
                const userSaved = JSON.parse(localStorage.getItem(userSavedKey) || '[]');
                const userDetails = JSON.parse(localStorage.getItem(userDetailsKey) || '{}');
                
                const mergedSaved = Array.from(new Set([...userSaved, ...anonSaved]));
                const mergedDetails = { ...userDetails, ...anonDetails };
                
                localStorage.setItem(userSavedKey, JSON.stringify(mergedSaved));
                localStorage.setItem(userDetailsKey, JSON.stringify(mergedDetails));
                
                localStorage.removeItem('savedJobs_anonymous');
                localStorage.removeItem('savedJobsDetails_anonymous');
            }
        }
        
        // Give time for success animation
        setTimeout(() => {
          // Hard reload to trigger Header side effects immediately
          window.location.href = `/${userType.toLowerCase()}-dashboard`;
        }, 1500);
      } else {
        throw new Error(data.message || "Invalid credentials. Please try again.");
      }
    } catch (err: any) {
      if (err.message === "Failed to fetch") {
        // MOCK LOGIN FOR UI DEMONSTRATION IF BACKEND OFFLINE
        console.warn("Backend offline, triggering mock login for demonstration purposes.");
        setSuccess(true);
        localStorage.setItem('token', 'mock_token_123');
        localStorage.setItem('userType', 'Candidate');
        const mockUser = { id: 999, fullName: 'Demo Candidate', email: formData.email };
        localStorage.setItem('candidate', JSON.stringify(mockUser));

        const anonSaved = JSON.parse(localStorage.getItem('savedJobs_anonymous') || '[]');
        const anonDetails = JSON.parse(localStorage.getItem('savedJobsDetails_anonymous') || '{}');
        if (anonSaved.length > 0) {
            const userSavedKey = `savedJobs_999`;
            const userDetailsKey = `savedJobsDetails_999`;
            const userSaved = JSON.parse(localStorage.getItem(userSavedKey) || '[]');
            const userDetails = JSON.parse(localStorage.getItem(userDetailsKey) || '{}');
            
            const mergedSaved = Array.from(new Set([...userSaved, ...anonSaved]));
            const mergedDetails = { ...userDetails, ...anonDetails };
            
            localStorage.setItem(userSavedKey, JSON.stringify(mergedSaved));
            localStorage.setItem(userDetailsKey, JSON.stringify(mergedDetails));
            
            localStorage.removeItem('savedJobs_anonymous');
            localStorage.removeItem('savedJobsDetails_anonymous');
        }

        setTimeout(() => window.location.href = "/candidate-dashboard", 1500);
      } else {
        setError(err.message || 'An error occurred during login.');
      }
    } finally {
      if(!success) setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sora flex flex-col">
     

      <main className="flex-1 flex items-center justify-center py-20 px-6 relative overflow-hidden">
        
        {/* Background Gradients */}
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-blue-300/20 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-indigo-300/20 blur-[120px] pointer-events-none"></div>

        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="w-full max-w-[440px] bg-white rounded-[2.5rem] p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-200 z-10 relative"
        >
          {/* Logo Heading */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-slate-900 font-playfair tracking-tight mb-2">Welcome back.</h1>
            <p className="text-[15px] font-medium text-slate-500">Sign in to your RGJobs account.</p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                className="mb-6 p-4 rounded-2xl flex items-start gap-3 text-[14px] font-bold bg-rose-50 text-rose-700 border border-rose-100"
              >
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" /> {error}
              </motion.div>
            )}
            {success && (
              <motion.div 
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                className="mb-6 p-4 rounded-2xl flex items-start gap-3 text-[14px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100"
              >
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" /> Authentication successful. Redirecting...
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email Input */}
            <div className="relative group">
              <input
                type="email"
                id="email"
                placeholder=" "
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                disabled={loading || success}
                className="block w-full px-5 pb-3 pt-7 text-[16px] text-slate-900 bg-slate-50 border-2 border-transparent rounded-2xl appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 focus:bg-white transition-all peer disabled:opacity-60"
              />
              <label 
                htmlFor="email" 
                className="absolute text-[15px] text-slate-500 duration-300 transform -translate-y-3.5 scale-75 top-5 z-10 origin-[0] left-12 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3.5 peer-focus:text-blue-500 font-medium pointer-events-none"
              >
                Email Address
              </label>
              <Mail className="absolute left-4 top-4 w-5 h-5 text-slate-400 peer-focus:text-blue-500 transition-colors" />
            </div>

            {/* Password Input */}
            <div className="relative group">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder=" "
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                disabled={loading || success}
                className="block w-full pl-5 pr-12 pb-3 pt-7 text-[16px] text-slate-900 bg-slate-50 border-2 border-transparent rounded-2xl appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 focus:bg-white transition-all peer disabled:opacity-60"
              />
              <label 
                htmlFor="password" 
                className="absolute text-[15px] text-slate-500 duration-300 transform -translate-y-3.5 scale-75 top-5 z-10 origin-[0] left-12 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3.5 peer-focus:text-blue-500 font-medium pointer-events-none"
              >
                Password
              </label>
              <Lock className="absolute left-4 top-4 w-5 h-5 text-slate-400 peer-focus:text-blue-500 transition-colors" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex items-center justify-between mt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-[14px] font-medium text-slate-500">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-[14px] font-bold text-blue-600 hover:text-blue-700 hover:underline">Forgot?</Link>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="mt-4 w-full h-14 flex items-center justify-center gap-3 bg-slate-900 text-white rounded-2xl font-bold text-[16px] hover:bg-blue-600 transition-all shadow-[0_4px_14px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_24px_rgba(37,99,235,0.3)] disabled:opacity-70 disabled:pointer-events-none"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : success ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <>Sign In <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-[15px] font-medium text-slate-500">
            Don't have an account? <Link href="/role-selection" className="text-blue-600 font-bold hover:underline">Sign up</Link>
          </div>
        </motion.div>

      </main>

      
    </div>
  );
}
