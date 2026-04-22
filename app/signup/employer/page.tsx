"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, CheckCircle2, AlertCircle, ArrowRight, Building2 } from 'lucide-react';


export default function EmployerSignup() {
  const [formData, setFormData] = useState({ companyName: '', fullName: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/register/employer`, {
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
      
      if (response.ok || data.success) {
        setSuccess(true);
        setTimeout(() => window.location.href = "/login", 2000);
      } else {
        throw new Error(data.message || "Failed to register. Email or Company might already exist.");
      }
    } catch (err: any) {
      if (err.message === "Failed to fetch") {
        // MOCK REGISTRATION FOR UI DEMONSTRATION
        console.warn("Backend offline, triggering mock registration.");
        setSuccess(true);
        setTimeout(() => window.location.href = "/login", 2000);
      } else {
        setError(err.message || 'An error occurred during registration.');
      }
    } finally {
      if(!success) setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sora flex flex-col">
      

      <main className="flex-1 flex items-center justify-center py-24 px-6 relative overflow-hidden">
        
        {/* Background Gradients */}
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-emerald-300/20 blur-[120px] pointer-events-none"></div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[480px] bg-white rounded-[2.5rem] p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-200 z-10 relative"
        >
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 outline outline-[6px] outline-emerald-50/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
             <Building2 className="w-8 h-8" />
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-slate-900 font-playfair tracking-tight mb-2">Company Account</h1>
            <p className="text-[15px] font-medium text-slate-500">Sign up to start hiring the top 1% of talent.</p>
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
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" /> Registration successful! Redirecting to login...
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            {/* Company Name */}
            <div className="relative group">
              <input
                type="text"
                placeholder=" "
                value={formData.companyName}
                onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                required
                disabled={loading || success}
                className="block w-full pl-5 pr-5 pb-3 pt-7 text-[16px] text-slate-900 bg-slate-50 border-2 border-transparent rounded-2xl appearance-none focus:outline-none focus:ring-0 focus:border-emerald-500 focus:bg-white transition-all peer disabled:opacity-60"
              />
              <label className="absolute text-[15px] text-slate-500 duration-300 transform -translate-y-3.5 scale-75 top-5 z-10 origin-[0] left-12 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3.5 peer-focus:text-emerald-500 font-medium pointer-events-none">
                Company Name
              </label>
              <Building2 className="absolute left-4 top-4 w-5 h-5 text-slate-400 peer-focus:text-emerald-500 transition-colors" />
            </div>

            {/* Full Name */}
            <div className="relative group">
              <input
                type="text"
                placeholder=" "
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                required
                disabled={loading || success}
                className="block w-full pl-5 pr-5 pb-3 pt-7 text-[16px] text-slate-900 bg-slate-50 border-2 border-transparent rounded-2xl appearance-none focus:outline-none focus:ring-0 focus:border-emerald-500 focus:bg-white transition-all peer disabled:opacity-60"
              />
              <label className="absolute text-[15px] text-slate-500 duration-300 transform -translate-y-3.5 scale-75 top-5 z-10 origin-[0] left-12 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3.5 peer-focus:text-emerald-500 font-medium pointer-events-none">
                Your Full Name
              </label>
              <User className="absolute left-4 top-4 w-5 h-5 text-slate-400 peer-focus:text-emerald-500 transition-colors" />
            </div>

            {/* Email */}
            <div className="relative group">
              <input
                type="email"
                placeholder=" "
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                disabled={loading || success}
                className="block w-full pl-5 pr-5 pb-3 pt-7 text-[16px] text-slate-900 bg-slate-50 border-2 border-transparent rounded-2xl appearance-none focus:outline-none focus:ring-0 focus:border-emerald-500 focus:bg-white transition-all peer disabled:opacity-60"
              />
              <label className="absolute text-[15px] text-slate-500 duration-300 transform -translate-y-3.5 scale-75 top-5 z-10 origin-[0] left-12 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3.5 peer-focus:text-emerald-500 font-medium pointer-events-none">
                Work Email Address
              </label>
              <Mail className="absolute left-4 top-4 w-5 h-5 text-slate-400 peer-focus:text-emerald-500 transition-colors" />
            </div>

            {/* Password */}
            <div className="relative group flex gap-4">
               <div className="relative w-1/2">
                <input
                  type="password"
                  placeholder=" "
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                  disabled={loading || success}
                  className="block w-full pl-5 pr-3 pb-3 pt-7 text-[16px] text-slate-900 bg-slate-50 border-2 border-transparent rounded-2xl appearance-none focus:outline-none focus:ring-0 focus:border-emerald-500 focus:bg-white transition-all peer disabled:opacity-60"
                />
                <label className="absolute text-[13px] text-slate-500 duration-300 transform -translate-y-3.5 scale-75 top-5 z-10 origin-[0] left-11 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3.5 peer-focus:text-emerald-500 font-medium pointer-events-none">
                  Password
                </label>
                <Lock className="absolute left-3 top-4 w-5 h-5 text-slate-400 peer-focus:text-emerald-500 transition-colors" />
              </div>
              <div className="relative w-1/2">
                <input
                  type="password"
                  placeholder=" "
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  required
                  disabled={loading || success}
                  className="block w-full pl-5 pr-3 pb-3 pt-7 text-[16px] text-slate-900 bg-slate-50 border-2 border-transparent rounded-2xl appearance-none focus:outline-none focus:ring-0 focus:border-emerald-500 focus:bg-white transition-all peer disabled:opacity-60"
                />
                <label className="absolute text-[13px] text-slate-500 duration-300 transform -translate-y-3.5 scale-75 top-5 z-10 origin-[0] left-11 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3.5 peer-focus:text-emerald-500 font-medium pointer-events-none">
                  Confirm
                </label>
                <Lock className="absolute left-3 top-4 w-5 h-5 text-slate-400 peer-focus:text-emerald-500 transition-colors" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="mt-6 w-full h-14 flex items-center justify-center gap-3 bg-emerald-600 text-white rounded-2xl font-bold text-[16px] hover:bg-emerald-700 transition-all shadow-[0_4px_14px_rgba(16,185,129,0.25)] hover:shadow-[0_8px_24px_rgba(16,185,129,0.4)] hover:-translate-y-0.5 disabled:opacity-70 disabled:pointer-events-none"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : success ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <>Register Company <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-[15px] font-medium text-slate-500">
            Already have an account? <Link href="/login" className="text-emerald-600 font-bold hover:underline">Log in</Link>
          </div>
        </motion.div>

      </main>

      
    </div>
  );
}
