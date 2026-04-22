"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowLeft, ShieldCheck } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Read token & email from URL query params (avoids need for Suspense wrapper)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setToken(params.get('token') || '');
    setEmail(params.get('email') || '');
  }, []);

  const passwordStrength = (pwd: string): number => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColor = ['', 'bg-rose-400', 'bg-amber-400', 'bg-blue-500', 'bg-emerald-500'];
  const strength = passwordStrength(form.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match. Please check and try again.');
      return;
    }
    if (!token || !email) {
      setError('Invalid or expired reset link. Please request a new one.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          token,
          email,
          password: form.password,
          password_confirmation: form.confirmPassword,
        }),
      });
      const data = await res.json();

      // Laravel returns status 'passwords.reset' on success
      if (res.ok || data.status === 'passwords.reset') {
        setSuccess(true);
        setTimeout(() => router.push('/login'), 3000);
      } else {
        setError(data.message || 'Could not reset password. The link may have expired.');
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    'block w-full px-5 pb-3 pt-7 text-[16px] text-slate-900 bg-slate-50 border-2 border-transparent rounded-2xl appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 focus:bg-white transition-all peer disabled:opacity-60';
  const labelBase =
    'absolute text-[15px] text-slate-500 duration-300 transform -translate-y-3.5 scale-75 top-5 z-10 origin-[0] left-12 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3.5 peer-focus:text-blue-500 font-medium pointer-events-none';

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

            {/* ── Success state ── */}
            {success ? (
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
                  Password updated!
                </h2>
                <p className="text-[15px] font-medium text-slate-500 mb-7">
                  Your password has been reset successfully. Redirecting you to login…
                </p>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-[14px] hover:bg-blue-600 transition-colors shadow-sm"
                >
                  Go to Login
                </Link>
              </motion.div>

            ) : (
              /* ── Reset form ── */
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="w-16 h-16 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <ShieldCheck className="w-8 h-8 text-blue-600" />
                </div>

                <div className="text-center mb-8">
                  <h1 className="text-3xl font-black text-slate-900 font-playfair tracking-tight mb-2">
                    Set new password
                  </h1>
                  <p className="text-[15px] font-medium text-slate-500">
                    Must be at least 8 characters.
                  </p>
                  {email && (
                    <p className="text-[13px] text-slate-400 mt-1.5">
                      Resetting for: <span className="font-bold text-slate-600">{email}</span>
                    </p>
                  )}
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

                  {/* New Password */}
                  <div className="relative group">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="rp-password"
                      placeholder=" "
                      value={form.password}
                      onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                      required
                      disabled={loading}
                      className={`${inputBase} pr-12`}
                    />
                    <label htmlFor="rp-password" className={labelBase}>New Password</label>
                    <Lock className="absolute left-4 top-4 w-5 h-5 text-slate-400 peer-focus:text-blue-500 transition-colors" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Password strength bar */}
                  {form.password && (
                    <div className="space-y-1.5 -mt-2">
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4].map(i => (
                          <div
                            key={i}
                            className={`h-1.5 flex-1 rounded-full transition-all duration-400 ${
                              i <= strength ? strengthColor[strength] : 'bg-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                      <p className={`text-[12px] font-bold ${
                        strength <= 1 ? 'text-rose-500' : strength === 2 ? 'text-amber-500' : strength === 3 ? 'text-blue-500' : 'text-emerald-500'
                      }`}>
                        {strengthLabel[strength]}
                      </p>
                    </div>
                  )}

                  {/* Confirm Password */}
                  <div className="relative group">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      id="rp-confirm"
                      placeholder=" "
                      value={form.confirmPassword}
                      onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))}
                      required
                      disabled={loading}
                      className={`${inputBase} pr-12 ${
                        form.confirmPassword && form.password !== form.confirmPassword
                          ? '!border-rose-400'
                          : form.confirmPassword && form.password === form.confirmPassword
                          ? '!border-emerald-400'
                          : ''
                      }`}
                    />
                    <label htmlFor="rp-confirm" className={labelBase}>Confirm Password</label>
                    <Lock className="absolute left-4 top-4 w-5 h-5 text-slate-400 peer-focus:text-blue-500 transition-colors" />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 focus:outline-none"
                    >
                      {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 w-full h-14 flex items-center justify-center gap-3 bg-slate-900 text-white rounded-2xl font-bold text-[16px] hover:bg-blue-600 transition-all shadow-[0_4px_14px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_24px_rgba(37,99,235,0.3)] disabled:opacity-70 disabled:pointer-events-none"
                  >
                    {loading
                      ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      : <><span>Reset Password</span> <CheckCircle2 className="w-5 h-5" /></>
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
            )}

          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
}
