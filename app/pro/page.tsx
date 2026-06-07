"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Zap, Shield, Sparkles, X, Target, FileSearch, MessageSquare, IndianRupee, FileText, ChevronDown, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProPricing() {
  const router = useRouter();
  const [isAnnual, setIsAnnual] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'failed' | null>(null);
  const [paymentErrorMsg, setPaymentErrorMsg] = useState('');
  const [purchasedPack, setPurchasedPack] = useState<'PRO' | 'TOPUP' | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleUpgrade = async (packageType: 'PRO' | 'TOPUP' = 'PRO') => {
    setIsProcessing(true);
    setPurchasedPack(packageType);

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      setShowLoginModal(true);
      setIsProcessing(false);
      return;
    }

    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      setPaymentStatus('failed');
      setPaymentErrorMsg('Failed to load payment gateway. Please check your internet connection.');
      setIsProcessing(false);
      return;
    }

    try {
      const orderRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/payments/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ package_type: packageType })
      });

      if (!orderRes.ok) {
        throw new Error('Failed to create order');
      }

      const orderData = await orderRes.json();

      const userStr = localStorage.getItem('candidate') || localStorage.getItem('employer');
      const user = userStr ? JSON.parse(userStr) : {};

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: "INR",
        name: packageType === 'TOPUP' ? "RGJobs Credits" : "RGJobs PRO",
        description: packageType === 'TOPUP' ? "10 AI Match Credits Pack" : "Upgrade to Professional Tier",
        order_id: orderData.order_id,
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/payments/verify`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            if (verifyRes.ok) {
              setPaymentStatus('success');
              if (userStr) {
                const updatedUser = {
                  ...user,
                  is_pro: packageType === 'PRO' ? true : user.is_pro,
                  ai_credits: packageType === 'TOPUP' ? (user.ai_credits || 0) + 10 : user.ai_credits
                };
                const userType = localStorage.getItem('userType');
                localStorage.setItem(userType === 'Candidate' ? 'candidate' : 'employer', JSON.stringify(updatedUser));
              }
            } else {
              setPaymentStatus('failed');
              setPaymentErrorMsg("Payment verification failed. If money was deducted, it will be refunded.");
            }
          } catch (error) {
            console.error("Verification Error:", error);
            setPaymentStatus('failed');
            setPaymentErrorMsg("An error occurred during verification.");
          }
        },
        prefill: {
          name: user.name || user.full_name || "",
          email: user.email || "",
          contact: user.phone || ""
        },
        theme: {
          color: packageType === 'TOPUP' ? "#10B981" : "#8B5CF6"
        }
      };

      const paymentObject = new (window as any).Razorpay(options);

      paymentObject.on('payment.failed', function (response: any) {
        console.error(response.error);
        setPaymentStatus('failed');
        setPaymentErrorMsg(`Payment failed: ${response.error.description}`);
      });

      paymentObject.open();
    } catch (error) {
      console.error(error);
      setPaymentStatus('failed');
      setPaymentErrorMsg("Something went wrong. Please try again later.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sora selection:bg-purple-500/30 selection:text-purple-200">

      {/* Login Required Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-md w-full shadow-2xl relative"
            >
              <button onClick={() => setShowLoginModal(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
              <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Login Required</h3>
              <p className="text-slate-400 mb-8 leading-relaxed">
                You need to create an account or log in before you can upgrade to RGJobs PRO and unlock premium features.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="flex-1 py-3 px-4 rounded-xl border border-slate-700 text-white font-medium hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => router.push('/login')}
                  className="flex-1 py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-colors shadow-lg shadow-purple-500/25"
                >
                  Go to Login
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Payment Status Modal */}
      <AnimatePresence>
        {paymentStatus && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-md w-full shadow-2xl relative text-center"
            >
              <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 ${paymentStatus === 'success' ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}>
                {paymentStatus === 'success' ? (
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                ) : (
                  <X className="w-10 h-10 text-rose-500" />
                )}
              </div>

              <h3 className="text-2xl font-bold text-white mb-3">
                {paymentStatus === 'success' ? 'Payment Successful!' : 'Payment Failed'}
              </h3>

              <p className="text-slate-400 mb-8 leading-relaxed">
                {paymentStatus === 'success'
                  ? (purchasedPack === 'TOPUP'
                    ? '10 AI Match credits loaded successfully! You can now analyze fresh opportunities.'
                    : 'Welcome to RGJobs PRO! Your account has been upgraded and you now have access to all premium features.')
                  : paymentErrorMsg}
              </p>

              <button
                onClick={() => {
                  setPaymentStatus(null);
                  if (paymentStatus === 'success') {
                    const userType = localStorage.getItem('userType');
                    router.push(userType === 'Candidate' ? '/candidate-dashboard' : '/');
                  }
                }}
                className={`w-full py-4 rounded-xl text-white font-bold transition-colors shadow-lg ${paymentStatus === 'success' ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/25' : 'bg-slate-800 hover:bg-slate-700 border border-slate-700'}`}
              >
                {paymentStatus === 'success' ? 'Go to Dashboard' : 'Try Again'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.15),transparent_60%)] blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1),transparent_60%)] blur-[100px]" />
        <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.05),transparent_60%)] blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 pt-32 pb-24">

        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-bold tracking-wide uppercase mb-6"
          >
            <Sparkles className="w-4 h-4" />
            Beat the ATS Algorithms
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white font-playfair tracking-tight mb-6 leading-tight"
          >
            Stop applying blindly. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              Get the insider advantage.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-400 leading-relaxed font-medium"
          >
            90% of resumes are rejected by HR robots before a human even sees them.
            RGJobs PRO tells you exactly what the employer wants to see so you can land your dream job faster.
          </motion.p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">

          {/* Free Tier */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-[2rem] p-6 md:p-8 flex flex-col justify-between relative overflow-hidden"
          >
            <div>
              <h3 className="text-xl font-black text-white mb-1.5">Basic Candidate</h3>
              <p className="text-slate-400 text-xs font-medium mb-6">Explore the market and test our AI matching tools.</p>

              <div className="flex items-end gap-1.5 mb-6">
                <span className="text-4xl font-black text-white">Free</span>
                <span className="text-slate-500 text-xs font-medium mb-1">forever</span>
              </div>

              {/* Honest aggregator transparency note */}
              <div className="flex items-start gap-2 p-3 mb-6 bg-slate-950/40 border border-slate-800 rounded-xl">
                <Shield className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                  <span className="text-blue-400 font-bold">100% Transparent:</span> We are a job aggregator. All listings redirect you to apply directly on the employer's official website. We never collect or gatekeep applications.
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-slate-300 text-sm font-medium">Browse unlimited curated job listings</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-slate-300 text-sm font-medium">6 Starting AI Match Credits</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-300 text-sm font-medium block">1x First Job Profile Match (Free)</span>
                    <span className="text-[10px] text-slate-500 font-medium">Analyze your first target role for 0 credits</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-300 text-sm font-medium block">1x First Resume Health Scan (Free)</span>
                    <span className="text-[10px] text-slate-500 font-medium">Standalone ATS parse audit across 6 dimensions</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-300 text-sm font-medium block">Profile Completeness Bonus</span>
                    <span className="text-[10px] text-slate-500 font-medium">Earn +3 extra credits at 80% profile completeness</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-300 text-sm font-medium block">5 Active Job Tracking Slots</span>
                    <span className="text-[10px] text-slate-500 font-medium">Log and track up to 5 jobs on your Kanban dashboard</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-300 text-sm font-medium block">Weekly credit refresh</span>
                    <span className="text-[10px] text-slate-500 font-medium">Lazy refreshes +1 credit every week (max 6)</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <X className="w-5 h-5 text-slate-700 shrink-0 mt-0.5" />
                  <span className="text-slate-600 text-sm font-medium line-through">Unlimited AI Match Scores</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <X className="w-5 h-5 text-slate-700 shrink-0 mt-0.5" />
                  <span className="text-slate-600 text-sm font-medium line-through">Premium Cover Letter PDF/DOC Downloads</span>
                </div>
              </div>
            </div>

            <div>
              <button
                onClick={() => router.push('/login')}
                className="w-full py-3.5 rounded-xl border border-slate-800 hover:border-slate-700 text-slate-300 font-bold hover:bg-slate-900 transition-colors text-sm"
              >
                Create Free Account
              </button>
              <p className="text-center text-[11px] font-medium text-slate-600 mt-2.5">
                Already have an account? <Link href="/login" className="text-slate-400 hover:text-white underline">Sign in</Link>
              </p>
            </div>
          </motion.div>

          {/* Micro Top-Up Pack Tier (NEW) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-slate-900/40 backdrop-blur-xl border border-emerald-500/20 rounded-[2rem] p-6 md:p-8 flex flex-col justify-between relative overflow-hidden shadow-[0_0_40px_rgba(16,185,129,0.03)]"
          >
            {/* Top-up badge */}
            <div className="absolute top-0 right-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest py-1 px-3 rounded-b-lg">
              Low Cost Pack
            </div>

            <div>
              <h3 className="text-xl font-black text-white mb-1.5 flex items-center gap-1.5">
                <Target className="w-5 h-5 text-emerald-400" /> 10 Credits Top-Up
              </h3>
              <p className="text-slate-400 text-xs font-medium mb-6">Perfect if you only need a quick boost on high-priority applications.</p>

              <div className="flex items-end gap-1.5 mb-2">
                <span className="text-4xl font-black text-white">₹29</span>
                <span className="text-slate-500 text-xs font-medium mb-1">/ one-time buy</span>
              </div>
              <p className="text-[10px] text-emerald-400 font-semibold mb-6 flex items-center gap-1">
                <IndianRupee className="w-2.5 h-2.5" /> Just ₹2.9 per analysis. Zero commitment.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-200 text-sm font-bold block mb-0.5">+10 AI Match Credits (No Expiry)</span>
                    <span className="text-[10px] text-slate-400">Loaded instantly onto your balance. Use them when you want.</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-200 text-sm font-bold block mb-0.5">Resume Health Re-Audits</span>
                    <span className="text-[10px] text-slate-400">Re-run full standalone ATS parser checks after updating your resume.</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-200 text-sm font-bold block mb-0.5">ATS Technical Keyword Match</span>
                    <span className="text-[10px] text-slate-400">Extract matching parameters and critical keyword lists.</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-200 text-sm font-bold block mb-0.5">Custom Cover Letter Draft</span>
                    <span className="text-[10px] text-slate-400">Generate copyable tailored cover letters for target roles.</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-200 text-sm font-bold block mb-0.5">10 Active Job Tracking Slots</span>
                    <span className="text-[10px] text-slate-400">Increase your Kanban job tracker capacity to 10 active jobs automatically.</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <button
                onClick={() => handleUpgrade('TOPUP')}
                disabled={isProcessing}
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all text-sm shadow-lg shadow-emerald-600/10 hover:shadow-emerald-600/25 flex items-center justify-center gap-2"
              >
                {isProcessing && purchasedPack === 'TOPUP' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Get 10 Credits"
                )}
              </button>
              <p className="text-center text-[10px] font-medium text-slate-600 mt-3 flex items-center justify-center gap-1">
                <Shield className="w-3 h-3" /> One-Time payment · Razorpay Secure
              </p>
            </div>
          </motion.div>

          {/* PRO Tier */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-b from-purple-900/40 to-blue-900/20 backdrop-blur-2xl border-2 border-purple-500/50 rounded-[2.5rem] p-6 md:p-8 flex flex-col justify-between relative overflow-hidden shadow-[0_0_80px_rgba(139,92,246,0.1)]"
          >
            {/* Pro Badge */}
            <div className="absolute top-0 right-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-[9px] font-black uppercase tracking-widest py-1.5 px-3 rounded-b-lg shadow-md">
              Best Value
            </div>

            <div>
              <h3 className="text-xl font-black text-white mb-1.5 flex items-center gap-1.5 mt-2">
                <Zap className="w-5 h-5 text-purple-400 fill-purple-400/20" /> RGJobs PRO
              </h3>
              <p className="text-purple-200/70 text-xs font-medium mb-6">Stop applying blindly. Get the ultimate unlimited AI advantage and bypass HR filters.</p>

              <div className="flex items-end gap-1.5 mb-2">
                <span className="text-4xl font-black text-white">₹199</span>
                <span className="text-purple-200/50 text-xs font-medium mb-1">/ 30 Days</span>
              </div>
              <p className="text-[10px] text-purple-300 font-semibold mb-6 flex items-center gap-1">
                <IndianRupee className="w-2.5 h-2.5" /> Less than ₹7/day. Land your target interview faster.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white font-bold text-sm block mb-0.5">100% Unlimited AI Match Scores</span>
                    <span className="text-[10px] text-purple-200/60 leading-relaxed block">Run as many role-matching and technical scans as you want, zero quota stress.</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white font-bold text-sm block mb-0.5">100% Unlimited Resume Health Checks</span>
                    <span className="text-[10px] text-purple-200/60 leading-relaxed block">Audit your resume's ATS health metrics as many times as you like.</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white font-bold text-sm block mb-0.5">Premium Cover Letter PDF & DOC Downloads</span>
                    <span className="text-[10px] text-purple-200/60 leading-relaxed block">Generate, refine and download print-ready vector PDF or editable Word .DOC files directly.</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white font-bold text-sm block mb-0.5">AI Resume Bio Optimizer (Full Copy)</span>
                    <span className="text-[10px] text-purple-200/60 leading-relaxed block">Full access to copy and paste optimized bios with technical keywords pre-injected.</span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white font-bold text-sm block mb-0.5">Unlimited Application Tracking (Kanban Tracker)</span>
                    <span className="text-[10px] text-purple-200/60 leading-relaxed block">Exceed the 5-job free and 10-job top-up limits with fully unlocked, infinite active tracking.</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <button
                onClick={() => handleUpgrade('PRO')}
                disabled={isProcessing}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-black text-sm transition-all shadow-[0_8px_25px_rgba(139,92,246,0.25)] hover:shadow-[0_12px_30px_rgba(139,92,246,0.4)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex items-center justify-center gap-2"
              >
                {isProcessing && purchasedPack === 'PRO' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Upgrade to PRO"
                )}
              </button>
              <p className="text-center text-[10px] font-medium text-purple-200/40 mt-3 uppercase tracking-widest flex flex-col gap-0.5">
                <span>One-Time Payment. No Auto-Renewal.</span>
                <span className="flex items-center justify-center gap-1 mt-1 text-emerald-400/70"><Shield className="w-3 h-3" /> Secure Razorpay Checkout</span>
              </p>
            </div>
          </motion.div>

        </div>

        {/* Competitive Comparison Grid */}
        <div className="max-w-[1000px] mx-auto mt-32 mb-16">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold tracking-wider uppercase mb-4"
            >
              Market Comparison
            </motion.div>
            <h3 className="text-3xl md:text-4xl font-black text-white font-playfair tracking-tight mb-4">How We Compare to the Market</h3>
            <p className="text-slate-400 font-medium max-w-2xl mx-auto text-lg">We provide elite-grade, tailored AI career acceleration services for a fraction of the cost of legacy platforms.</p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900/20 backdrop-blur-xl shadow-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="p-6 text-slate-400 font-semibold text-sm">Feature / Service</th>
                  <th className="p-6 text-purple-400 font-extrabold text-sm bg-purple-500/5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500" />
                    RGJobs PRO 🚀
                  </th>
                  <th className="p-6 text-slate-400 font-semibold text-sm">LinkedIn Premium 💎</th>
                  <th className="p-6 text-slate-400 font-semibold text-sm">Jobscan 🔍</th>
                  <th className="p-6 text-slate-400 font-semibold text-sm">ChatGPT Free 🤖</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {[
                  {
                    feature: "Automated PDF Resume Parser",
                    us: { check: true, text: "Yes (Gemini/Groq-Powered)" },
                    linkedin: { check: false, text: "No (Bio form only)" },
                    jobscan: { check: true, text: "Yes" },
                    chatgpt: { check: false, text: "No (Manual paste)" }
                  },
                  {
                    feature: "ATS Keyword Gap Scores",
                    us: { check: true, text: "Yes (0-100% Breakdown)" },
                    linkedin: { check: false, text: "Basic indicators" },
                    jobscan: { check: true, text: "Yes" },
                    chatgpt: { check: false, text: "No (Manual ask)" }
                  },
                  {
                    feature: "Contextual Cover Letter",
                    us: { check: true, text: "Yes (Customized)" },
                    linkedin: { check: false, text: "No" },
                    jobscan: { check: false, text: "Templates only" },
                    chatgpt: { check: true, text: "Generic prompt" }
                  },
                  {
                    feature: "10 Tailored Interview Questions",
                    us: { check: true, text: "Yes (STAR structure)" },
                    linkedin: { check: false, text: "Standard sets only" },
                    jobscan: { check: false, text: "No" },
                    chatgpt: { check: false, text: "No" }
                  },
                  {
                    feature: "INR Local Salary Benchmarks",
                    us: { check: true, text: "Yes (INR localized advice)" },
                    linkedin: { check: false, text: "Premium pool only" },
                    jobscan: { check: false, text: "No" },
                    chatgpt: { check: false, text: "No" }
                  },
                  {
                    feature: "Pricing",
                    us: { check: true, text: "₹199 / 30 Days" },
                    linkedin: { check: false, text: "₹1,500 - ₹2,500/Mo" },
                    jobscan: { check: false, text: "₹3,500 / Month" },
                    chatgpt: { check: false, text: "Free / ₹1,999 (Plus)" }
                  }
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/10 transition-colors">
                    <td className="p-6 text-slate-300 font-bold text-sm leading-relaxed">{row.feature}</td>
                    <td className="p-6 text-white font-bold text-sm bg-purple-500/5">
                      <div className="flex items-center gap-2">
                        {row.us.check ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <X className="w-4 h-4 text-rose-500 shrink-0" />
                        )}
                        <span>{row.us.text}</span>
                      </div>
                    </td>
                    <td className="p-6 text-slate-400 font-medium text-sm">
                      <div className="flex items-center gap-2">
                        {row.linkedin.check ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        ) : (
                          <X className="w-4 h-4 text-slate-700 shrink-0" />
                        )}
                        <span>{row.linkedin.text}</span>
                      </div>
                    </td>
                    <td className="p-6 text-slate-400 font-medium text-sm">
                      <div className="flex items-center gap-2">
                        {row.jobscan.check ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        ) : (
                          <X className="w-4 h-4 text-slate-700 shrink-0" />
                        )}
                        <span>{row.jobscan.text}</span>
                      </div>
                    </td>
                    <td className="p-6 text-slate-400 font-medium text-sm">
                      <div className="flex items-center gap-2">
                        {row.chatgpt.check ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        ) : (
                          <X className="w-4 h-4 text-slate-700 shrink-0" />
                        )}
                        <span>{row.chatgpt.text}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Before vs After Demonstration */}
        <div className="max-w-[1000px] mx-auto mt-32 mb-16">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-black text-white font-playfair tracking-tight mb-4">Why you need ATS Keywords</h3>
            <p className="text-slate-400 font-medium max-w-2xl mx-auto text-lg">75% of resumes are rejected by HR robots before a human ever sees them. See how RGJobs PRO fixes your resume instantly.</p>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-center">
            {/* Before */}
            <div className="flex-1 w-full bg-slate-900/50 border border-rose-500/30 rounded-3xl p-8 relative overflow-hidden backdrop-blur-sm">
              <div className="absolute top-0 left-0 w-full h-1 bg-rose-500" />
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-rose-400 font-black text-lg">Without PRO</h4>
                <div className="px-3 py-1 bg-rose-500/10 text-rose-400 text-xs font-bold rounded-full border border-rose-500/20">Rejected by ATS</div>
              </div>
              <div className="space-y-4">
                <div className="h-4 bg-slate-800 rounded w-3/4" />
                <div className="h-4 bg-slate-800 rounded w-full" />
                <div className="h-4 bg-slate-800 rounded w-5/6" />
                <div className="flex gap-2 mt-6">
                  <span className="px-2 py-1 bg-slate-800 text-slate-500 text-xs rounded">React</span>
                  <span className="px-2 py-1 bg-slate-800 text-slate-500 text-xs rounded">Node.js</span>
                </div>
              </div>
              <div className="mt-8 p-4 bg-rose-500/5 rounded-xl border border-rose-500/10">
                <div className="text-rose-400 text-sm font-bold flex items-center gap-2 mb-1">
                  <X className="w-4 h-4" /> 40% Match Score
                </div>
                <div className="text-slate-500 text-[13px] font-medium">Missing required skills for the role.</div>
              </div>
            </div>

            {/* Arrow */}
            <div className="w-12 h-12 shrink-0 bg-slate-800 rounded-full flex items-center justify-center rotate-90 md:rotate-0 shadow-lg">
              <ArrowRight className="w-5 h-5 text-slate-400" />
            </div>

            {/* After */}
            <div className="flex-1 w-full bg-slate-900/50 border border-emerald-500/30 rounded-3xl p-8 relative overflow-hidden backdrop-blur-sm shadow-[0_0_50px_rgba(16,185,129,0.1)]">
              <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-emerald-400 font-black text-lg">With RGJobs PRO</h4>
                <div className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/20 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Interview Secured
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-4 bg-slate-800 rounded w-3/4" />
                <div className="h-4 bg-slate-800 rounded w-full" />
                <div className="h-4 bg-slate-800 rounded w-5/6" />
                <div className="flex gap-2 mt-6 flex-wrap">
                  <span className="px-2 py-1 bg-slate-800 text-slate-400 text-xs rounded">React</span>
                  <span className="px-2 py-1 bg-slate-800 text-slate-400 text-xs rounded">Node.js</span>
                  <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs rounded font-bold shadow-[0_0_10px_rgba(16,185,129,0.2)]">+ GraphQL</span>
                  <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs rounded font-bold shadow-[0_0_10px_rgba(16,185,129,0.2)]">+ AWS</span>
                </div>
              </div>
              <div className="mt-8 p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                <div className="text-emerald-400 text-sm font-bold flex items-center gap-2 mb-1">
                  <CheckCircle2 className="w-4 h-4" /> 92% Match Score
                </div>
                <div className="text-slate-400 text-[13px] font-medium">Missing keywords added automatically.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Why ATS Optimization Matters — Industry Facts, Not Our Claims */}
        <div className="max-w-[1000px] mx-auto mt-32 mb-16">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-wider uppercase mb-4">
              Industry Reality
            </div>
            <h3 className="text-3xl md:text-4xl font-black text-white font-playfair tracking-tight mb-4">
              Why ATS Optimization Matters
            </h3>
            <p className="text-slate-400 font-medium max-w-2xl mx-auto text-lg">
              These are well-documented industry statistics — not our claims. Understanding them is the first step to fixing your job search.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900/30 border border-slate-800 rounded-[2rem] p-8 text-center backdrop-blur-sm relative overflow-hidden group hover:border-emerald-500/30 transition-all">
              <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />
              <div className="text-5xl font-black text-white mb-2 group-hover:text-emerald-400 transition-colors">75%</div>
              <div className="text-sm font-bold text-slate-300 mb-2 uppercase tracking-wide">Resumes Auto-Rejected</div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Industry research shows that up to 75% of resumes are filtered out by ATS software before a human recruiter ever sees them.
              </p>
              <p className="text-[10px] text-slate-600 mt-3 font-medium">Source: Harvard Business School, 2021</p>
            </div>

            <div className="bg-slate-900/30 border border-slate-800 rounded-[2rem] p-8 text-center backdrop-blur-sm relative overflow-hidden group hover:border-blue-500/30 transition-all">
              <div className="absolute top-0 left-0 w-full h-1 bg-blue-500" />
              <div className="text-5xl font-black text-white mb-2 group-hover:text-blue-400 transition-colors">98%</div>
              <div className="text-sm font-bold text-slate-300 mb-2 uppercase tracking-wide">Fortune 500 Use ATS</div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Nearly all large companies — and increasingly mid-size firms — use Applicant Tracking Systems to screen resumes before human review.
              </p>
              <p className="text-[10px] text-slate-600 mt-3 font-medium">Source: Jobscan Industry Report</p>
            </div>

            <div className="bg-slate-900/30 border border-slate-800 rounded-[2rem] p-8 text-center backdrop-blur-sm relative overflow-hidden group hover:border-purple-500/30 transition-all">
              <div className="absolute top-0 left-0 w-full h-1 bg-purple-500" />
              <div className="text-5xl font-black text-white mb-2 group-hover:text-purple-400 transition-colors">6 sec</div>
              <div className="text-sm font-bold text-slate-300 mb-2 uppercase tracking-wide">Average Recruiter Scan</div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Even after passing ATS, recruiters spend an average of just 6-7 seconds reviewing each resume. The right keywords make those seconds count.
              </p>
              <p className="text-[10px] text-slate-600 mt-3 font-medium">Source: Ladders Eye-Tracking Study</p>
            </div>
          </div>
        </div>

        {/* Why RGJobs PRO > ChatGPT comparative card */}
        <div className="max-w-[1000px] mx-auto mt-32 mb-16">
          <div className="bg-gradient-to-br from-purple-950/40 via-slate-950 to-blue-950/40 border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="flex flex-col lg:flex-row gap-10 items-center relative z-10">
              <div className="flex-1 text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold tracking-wider uppercase mb-5">
                  <Sparkles className="w-3.5 h-3.5" /> Built for Hiring Scanners
                </div>
                <h3 className="text-3xl md:text-4xl font-black text-white font-playfair tracking-tight mb-4">
                  Why you can't just use standard ChatGPT
                </h3>
                <p className="text-slate-400 font-medium text-[15px] leading-relaxed mb-6">
                  Many candidates copy-paste prompts into free AI interfaces and wonder why they still get rejected. Recruitment algorithms look for technical match parameters and structured keyword layouts that standard prompts cannot solve.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-black text-rose-400">✗</div>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">
                      <strong>ChatGPT lacks scoring indicators:</strong> It cannot calculate technical weightings or dynamically score a parsed PDF resume line by line (0-100%).
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-black text-rose-400">✗</div>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">
                      <strong>ChatGPT has generalized context:</strong> Standard AI has no localized, Indian tech market context and guesses INR salary benchmarks.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-black text-rose-400">✗</div>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">
                      <strong>ChatGPT cannot format recruiter-ready files:</strong> It outputs generic text blocks instead of compiling formatted, copy-paste vectors or downloadable recruiter-ready documents.
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-96 shrink-0 bg-slate-950/60 border border-slate-800 rounded-3xl p-6 md:p-8 backdrop-blur-md">
                <h4 className="text-sm font-black text-white uppercase tracking-widest mb-6 text-center">RGJobs PRO Optimization Shield</h4>
                <div className="space-y-5">
                  {[
                    { title: "Dynamic Score Mapping", desc: "Instantly displays exact match index weightings based on HR schemas." },
                    { title: "True PDF Parsing Context", desc: "No paste-limit issues. Reads, processes, and rewrites clean resume texts on-the-fly." },
                    { title: "Recruiter PDF Documents", desc: "Downloads customized vector-perfect print PDF and DOC cover letters directly." },
                    { title: "INR Salary Calibration", desc: "Calibrated directly against Indian developer salary standards." }
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 bg-white/[0.02] border border-white/5 rounded-2xl p-3.5 hover:border-purple-500/20 transition-all">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-bold text-slate-200 block mb-0.5">{item.title}</span>
                        <span className="text-[10px] text-slate-500 leading-normal font-medium block">{item.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Founding Member Guarantee */}
        <div className="max-w-3xl mx-auto mt-20 mb-32 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/20 rounded-3xl p-8 md:p-10 text-center relative overflow-hidden backdrop-blur-sm">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-blue-300 text-xs font-bold uppercase tracking-widest mb-6">
            <Sparkles className="w-3.5 h-3.5" /> Founding Member Benefit
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-white font-playfair mb-4">The "3 Keyword" Guarantee</h3>
          <p className="text-slate-300 text-[15px] leading-relaxed max-w-2xl mx-auto">
            We are so confident in our AI that if it doesn't find at least 3 missing keywords to improve your resume match score, email our support team and we will refund your ₹199 instantly. No questions asked.
          </p>
        </div>

        {/* Value Props */}
        <div className="grid md:grid-cols-5 gap-6 max-w-5xl mx-auto mt-24">
          <div className="text-center">
            <div className="w-14 h-14 mx-auto bg-blue-500/10 rounded-2xl flex items-center justify-center mb-4">
              <Target className="w-7 h-7 text-blue-400" />
            </div>
            <h4 className="text-base font-bold text-white mb-2">AI Match Score</h4>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">Know your fit before you apply.</p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 mx-auto bg-rose-500/10 rounded-2xl flex items-center justify-center mb-4">
              <FileSearch className="w-7 h-7 text-rose-400" />
            </div>
            <h4 className="text-base font-bold text-white mb-2">ATS Keywords</h4>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">Beat the robot resume filters.</p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 mx-auto bg-purple-500/10 rounded-2xl flex items-center justify-center mb-4">
              <FileText className="w-7 h-7 text-purple-400" />
            </div>
            <h4 className="text-base font-bold text-white mb-2">Cover Letter</h4>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">Personalized in seconds.</p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 mx-auto bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-4">
              <IndianRupee className="w-7 h-7 text-emerald-400" />
            </div>
            <h4 className="text-base font-bold text-white mb-2">Salary Benchmark</h4>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">Negotiate with confidence.</p>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 mx-auto bg-amber-500/10 rounded-2xl flex items-center justify-center mb-4">
              <MessageSquare className="w-7 h-7 text-amber-400" />
            </div>
            <h4 className="text-base font-bold text-white mb-2">Interview Prep</h4>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">10 questions tailored to you.</p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-32">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-black text-white font-playfair tracking-tight mb-4">Frequently Asked Questions</h3>
            <p className="text-slate-400 font-medium">Everything you need to know about the product and billing.</p>
          </div>
          <div className="space-y-4">
            {[
              {
                q: "Is my payment secure?",
                a: "Absolutely. All transactions are securely processed via Razorpay using bank-level AES-256 encryption. We do not store any of your credit card details or payment information on our servers."
              },
              {
                q: "What happens if a transaction fails?",
                a: "If money is deducted but the transaction fails due to a network error, Razorpay automatically initiates a full refund to your original payment method. It usually reflects within 5-7 business days."
              },
              {
                q: "Is this a recurring subscription?",
                a: "No! This is a one-time payment for a 30-Day PRO Pass. We will never auto-charge your card. Once your 30 days are up, you can manually renew if you still need the premium tools."
              },
              {
                q: "How do the AI Match Score credits work?",
                a: "Every new account starts with 6 AI Match Credits for free. Your very first analysis always costs 0 credits — it's on us, so you can try before committing. After that, each match uses 1 credit. Credits automatically refresh by +1 every week (capped at 6 total), and you can earn a one-time bonus of +3 credits by completing your profile to 80% or more. When you upgrade to PRO, the credit system is completely bypassed — you get 100% unlimited AI matches, cover letter PDF & DOC downloads, salary benchmarking, and interview prep for the 30-day duration of your pass."
              },
              {
                q: "Do you offer a refund policy?",
                a: "We offer a 3-day money-back guarantee if you are completely unsatisfied with our PRO tools. Simply contact our support team and we will process the refund, no questions asked."
              }
            ].map((faq, i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm transition-all hover:border-slate-700">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left"
                >
                  <span className="text-white font-bold pr-8">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${expandedFaq === i ? 'rotate-180 text-blue-400' : ''}`} />
                </button>
                <AnimatePresence>
                  {expandedFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-[15px] font-medium text-slate-400 leading-relaxed border-t border-slate-800/50 pt-4">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
