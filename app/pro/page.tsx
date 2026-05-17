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

  const handleUpgrade = async () => {
    setIsProcessing(true);
    
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
        }
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
        name: "RGJobs PRO",
        description: "Upgrade to Professional Tier",
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
                 const updatedUser = { ...user, is_pro: true };
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
          name: user.name || "",
          email: user.email || "",
          contact: user.phone || ""
        },
        theme: {
          color: "#8B5CF6"
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
                  ? 'Welcome to RGJobs PRO! Your account has been upgraded and you now have access to all premium features.' 
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
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-center">
          
          {/* Free Tier */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-[2rem] p-8 md:p-12 relative overflow-hidden"
          >
            <h3 className="text-2xl font-black text-white mb-2">Basic Candidate</h3>
            <p className="text-slate-400 font-medium mb-8">For casual job seekers exploring the market.</p>
            
            <div className="flex items-end gap-2 mb-8">
              <span className="text-5xl font-black text-white">Free</span>
              <span className="text-slate-500 font-medium mb-1">forever</span>
            </div>

            {/* Honest aggregator transparency note */}
            <div className="flex items-start gap-2 p-3 mb-6 bg-slate-800/60 border border-slate-700 rounded-xl">
              <Shield className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                <span className="text-blue-400 font-bold">Honest disclosure:</span> All jobs on RGJobs are curated from external company career pages (Amazon, Google, etc.). Applying takes you directly to the official company website — we never collect your application.
              </p>
            </div>

            <div className="space-y-5 mb-10">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                <span className="text-slate-300 font-medium">Browse unlimited curated job postings</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                <span className="text-slate-300 font-medium">Apply directly on the company's official site</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                <span className="text-slate-300 font-medium">Build your candidate profile</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                <div>
                  <span className="text-slate-300 font-medium block">3 Free AI Job Matches</span>
                  <span className="text-xs text-slate-500">Try AI matching before you commit to PRO</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <X className="w-6 h-6 text-slate-600 shrink-0" />
                <span className="text-slate-500 font-medium line-through">Unlimited AI Match Scores</span>
              </div>
              <div className="flex items-start gap-3">
                <X className="w-6 h-6 text-slate-600 shrink-0" />
                <span className="text-slate-500 font-medium line-through">Missing ATS Keywords</span>
              </div>
              <div className="flex items-start gap-3">
                <X className="w-6 h-6 text-slate-600 shrink-0" />
                <span className="text-slate-500 font-medium line-through">AI Cover Letter Generator (.PDF & .DOC)</span>
              </div>
              <div className="flex items-start gap-3">
                <X className="w-6 h-6 text-slate-600 shrink-0" />
                <span className="text-slate-500 font-medium line-through">AI Resume Optimizer</span>
              </div>
              <div className="flex items-start gap-3">
                <X className="w-6 h-6 text-slate-600 shrink-0" />
                <span className="text-slate-500 font-medium line-through">Salary Benchmark & Insights</span>
              </div>
              <div className="flex items-start gap-3">
                <X className="w-6 h-6 text-slate-600 shrink-0" />
                <span className="text-slate-500 font-medium line-through">Likely Interview Questions & Tips</span>
              </div>
            </div>

            <button 
              onClick={() => router.push('/login')}
              className="w-full py-4 rounded-xl border border-slate-700 text-white font-bold hover:bg-slate-800 transition-colors"
            >
              Create Free Account
            </button>
            <p className="text-center text-xs font-medium text-slate-600 mt-3">
              Already have an account? <Link href="/login" className="text-slate-400 hover:text-white underline">Sign in</Link>
            </p>
          </motion.div>

          {/* PRO Tier */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-b from-purple-900/40 to-blue-900/20 backdrop-blur-2xl border-2 border-purple-500/50 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden shadow-[0_0_80px_rgba(139,92,246,0.15)]"
          >
            {/* Pro Badge */}
            <div className="absolute top-0 right-8 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-black uppercase tracking-widest py-2 px-4 rounded-b-xl shadow-lg">
              Most Popular
            </div>

            <div className="flex items-center gap-3 mb-2 mt-2">
              <Zap className="w-6 h-6 text-purple-400 fill-purple-400/20" />
              <h3 className="text-2xl font-black text-white">RGJobs PRO</h3>
            </div>
            <p className="text-purple-200/70 font-medium mb-8 leading-relaxed">
              Stop applying blindly. Get the ultimate AI advantage and bypass HR filters to land your dream job faster.
            </p>
            
            <div className="flex items-end gap-2 mb-2">
              <span className="text-5xl font-black text-white">₹199</span>
              <span className="text-purple-200/50 font-medium mb-1">/ 30 Days</span>
            </div>
            <p className="text-[12px] text-emerald-400/80 font-semibold mb-8 flex items-center gap-1.5">
              <IndianRupee className="w-3 h-3" />
              Less than ₹7/day. Land a job 1 week earlier = ₹12,500 saved. ROI: 62x.
            </p>

            <div className="space-y-5 mb-10">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-bold block mb-0.5">Unlimited AI Match Scores</span>
                  <span className="text-sm text-purple-200/60 font-medium leading-relaxed">Know your exact profile matching percentage against any job description instantly.</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-bold block mb-0.5">Missing ATS Keywords</span>
                  <span className="text-sm text-purple-200/60 font-medium leading-relaxed">See the exact keywords and critical skills that automated recruiter filters are looking for.</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-bold block mb-0.5">AI Cover Letter Generator (.PDF & .DOC)</span>
                  <span className="text-sm text-purple-200/60 font-medium leading-relaxed">Generate personalized, job-specific cover letters. Copy or download instantly as clean vector PDF or editable Microsoft Word .DOC!</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-bold block mb-0.5">AI Resume Optimizer <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full ml-1">New</span></span>
                  <span className="text-sm text-purple-200/60 font-medium leading-relaxed">Automatically rewrites your profile biography to natural, highly persuasive prose incorporating missing ATS keywords under your settings.</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-bold block mb-0.5">Salary Benchmark & Insights <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full ml-1">New</span></span>
                  <span className="text-sm text-purple-200/60 font-medium leading-relaxed">Know the realistic salary range for any role in INR based on your profile, and receive negotiating guidelines.</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-white font-bold block mb-0.5">Likely Interview Questions & Tips <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full ml-1">New</span></span>
                  <span className="text-sm text-purple-200/60 font-medium leading-relaxed">Get 10 custom interview questions tailored specifically to the role's stack and your background, with expert guidelines.</span>
                </div>
              </div>
            </div>

            <button 
              onClick={handleUpgrade}
              disabled={isProcessing}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-black text-lg transition-all shadow-[0_10px_30px_rgba(139,92,246,0.3)] hover:shadow-[0_15px_40px_rgba(139,92,246,0.5)] hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                "Upgrade to PRO"
              )}
            </button>
            <p className="text-center text-xs font-medium text-purple-200/40 mt-4 uppercase tracking-widest flex flex-col gap-1">
              <span>One-Time Payment. No Auto-Renewal.</span>
              <span className="flex items-center justify-center gap-1 mt-1 text-emerald-500/70"><Shield className="w-3 h-3" /> Secure Razorpay Checkout</span>
            </p>
          </motion.div>

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
                a: "Free users get exactly 3 free AI match calculations to test the system. When you upgrade to PRO, this limit is completely removed. You enjoy 100% unlimited AI matches, resume optimizations, cover letter downloads, salary benchmarking, and interview prep questions."
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
