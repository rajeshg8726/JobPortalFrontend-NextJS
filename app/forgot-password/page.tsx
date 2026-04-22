"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      // Laravel returns status 'passwords.sent' on success
      if (res.ok || data.status === 'passwords.sent') {
        setSent(true);
      } else {
        setError(data.message || 'Could not send reset link. Please check the email address.');
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sora flex flex-col">
      <main className="flex-1 flex items-center justify-center py-20 px-6 relative overflow-hidden">

        {/* Background blobs */}
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-blue-300/20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-indigo-300/20 blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="w-full max-w-[440px] bg-white rounded-[2.5rem] p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-200 z-10 relative"
        >
          <AnimatePresence mode="wait">

            {/* ── Step 1: Email form ── */}
            {!sent ? (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="w-16 h-16 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-8 h-8 text-blue-600" />
                </div>

                <div className="text-center mb-8">
                  <h1 className="text-3xl font-black text-slate-900 font-playfair tracking-tight mb-2">
                    Forgot password?
                  </h1>
                  <p className="text-[15px] font-medium text-slate-500">
                    No worries — enter your email and we'll send you a reset link.
                  </p>
                </div>

                {/* Error banner */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, y: -10 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -10 }}
                      className="mb-5 p-4 rounded-2xl flex items-start gap-3 text-[14px] font-bold bg-rose-50 text-rose-700 border border-rose-100"
                    >
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="relative group">
                    <input
                      type="email"
                      id="fp-email"
                      placeholder=" "
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      disabled={loading}
                      className="block w-full px-5 pb-3 pt-7 text-[16px] text-slate-900 bg-slate-50 border-2 border-transparent rounded-2xl appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 focus:bg-white transition-all peer disabled:opacity-60"
                    />
                    <label
                      htmlFor="fp-email"
                      className="absolute text-[15px] text-slate-500 duration-300 transform -translate-y-3.5 scale-75 top-5 z-10 origin-[0] left-12 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3.5 peer-focus:text-blue-500 font-medium pointer-events-none"
                    >
                      Email Address
                    </label>
                    <Mail className="absolute left-4 top-4 w-5 h-5 text-slate-400 peer-focus:text-blue-500 transition-colors" />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 w-full h-14 flex items-center justify-center gap-3 bg-slate-900 text-white rounded-2xl font-bold text-[16px] hover:bg-blue-600 transition-all shadow-[0_4px_14px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_24px_rgba(37,99,235,0.3)] disabled:opacity-70 disabled:pointer-events-none"
                  >
                    {loading
                      ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      : <><span>Send Reset Link</span> <ArrowRight className="w-5 h-5" /></>
                    }
                  </button>
                </form>

                <div className="mt-8 text-center">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-[14px] font-bold text-slate-500 hover:text-blue-600 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back to login
                  </Link>
                </div>
              </motion.div>

            ) : (
              /* ── Step 2: Success state ── */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4"
              >
                <div className="w-20 h-20 bg-emerald-50 border-2 border-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 font-playfair mb-3">
                  Check your inbox!
                </h2>
                <p className="text-[15px] font-medium text-slate-500 mb-2">
                  We've sent a password reset link to:
                </p>
                <p className="text-[15px] font-bold text-blue-600 mb-6 break-all">{email}</p>
                <p className="text-[13px] text-slate-400 mb-8 leading-relaxed">
                  The link expires in <strong>60 minutes</strong>. Didn't receive it? Check your spam folder.
                </p>
                <button
                  onClick={() => { setSent(false); setEmail(''); }}
                  className="text-[14px] font-bold text-slate-600 hover:text-blue-600 transition-colors underline underline-offset-2"
                >
                  Try a different email
                </button>
                <div className="mt-6">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-[14px] font-bold text-slate-500 hover:text-blue-600 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back to login
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
}
