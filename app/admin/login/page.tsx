"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminProfile', JSON.stringify(data.admin));
        router.replace('/admin');
      } else {
        setError(data.message || 'Invalid credentials. Access denied.');
      }
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c1427] flex items-center justify-center px-6 relative overflow-hidden">

      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-[400px] z-10"
      >
        {/* Card */}
        <div className="bg-white rounded-[2.5rem] p-10 shadow-[0_40px_80px_rgba(0,0,0,0.5)]">

          {/* Icon + Title */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 font-playfair tracking-tight">
              Admin Portal
            </h1>
            <p className="text-[14px] text-slate-500 font-medium mt-1">
              RGJobs • Restricted Access
            </p>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-5 p-4 rounded-2xl flex items-start gap-3 text-[14px] font-bold bg-rose-50 text-rose-700 border border-rose-100"
              >
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <div className="relative group">
              <input
                type="email"
                id="admin-email"
                placeholder=" "
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                required
                disabled={loading}
                className="block w-full px-5 pb-3 pt-7 text-[15px] text-slate-900 bg-slate-50 border-2 border-transparent rounded-2xl appearance-none focus:outline-none focus:border-indigo-500 focus:bg-white transition-all peer disabled:opacity-60"
              />
              <label
                htmlFor="admin-email"
                className="absolute text-[14px] text-slate-500 duration-300 transform -translate-y-3.5 scale-75 top-5 z-10 origin-[0] left-12 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3.5 peer-focus:text-indigo-500 font-medium pointer-events-none"
              >
                Email Address
              </label>
              <Mail className="absolute left-4 top-4 w-5 h-5 text-slate-400 peer-focus:text-indigo-500 transition-colors" />
            </div>

            {/* Password */}
            <div className="relative group">
              <input
                type={showPassword ? 'text' : 'password'}
                id="admin-password"
                placeholder=" "
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                required
                disabled={loading}
                className="block w-full px-5 pb-3 pt-7 pr-12 text-[15px] text-slate-900 bg-slate-50 border-2 border-transparent rounded-2xl appearance-none focus:outline-none focus:border-indigo-500 focus:bg-white transition-all peer disabled:opacity-60"
              />
              <label
                htmlFor="admin-password"
                className="absolute text-[14px] text-slate-500 duration-300 transform -translate-y-3.5 scale-75 top-5 z-10 origin-[0] left-12 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3.5 peer-focus:text-indigo-500 font-medium pointer-events-none"
              >
                Password
              </label>
              <Lock className="absolute left-4 top-4 w-5 h-5 text-slate-400 peer-focus:text-indigo-500 transition-colors" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full h-13 py-3.5 flex items-center justify-center gap-3 bg-indigo-600 text-white rounded-2xl font-bold text-[15px] hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-600/30 disabled:opacity-70 disabled:pointer-events-none"
            >
              {loading
                ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><Shield className="w-5 h-5" /> Sign In to Admin</>
              }
            </button>
          </form>
        </div>

        <p className="text-center text-slate-600 text-[12px] font-medium mt-6">
          Unauthorized access is strictly prohibited.
        </p>
      </motion.div>
    </div>
  );
}
