"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, IndianRupee, HelpCircle, AlertTriangle, RefreshCw, Mail } from 'lucide-react';

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sora flex flex-col overflow-hidden">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full pt-32 pb-24 lg:pt-40 lg:pb-32 flex items-center justify-center overflow-hidden bg-slate-950">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-luminosity"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent"></div>

          <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/30 blur-[120px] rounded-full pointer-events-none mix-blend-screen"></div>

          <div className="relative z-10 px-6 max-w-[900px] mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-slate-300 text-[13px] font-bold tracking-wide uppercase mb-6 backdrop-blur-md"
            >
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              100% Secure Billing
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-8 font-playfair tracking-tight leading-[1.1]"
            >
              Refund & Cancellation
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-[17px] md:text-[20px] text-slate-300 font-medium leading-relaxed max-w-[700px] mx-auto"
            >
              We believe in complete transparency, honest pricing, and customer trust. Read our simple guidelines below.
            </motion.p>
          </div>
        </section>

        {/* Content Section */}
        <section className="relative z-20 -mt-12 max-w-[1000px] mx-auto px-6 mb-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full bg-white rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.06)] border border-slate-200 p-8 md:p-14"
          >
            <div className="space-y-12">
              
              {/* Last Updated */}
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wide">
                Last Updated: May 2026
              </p>

              {/* Section 1 */}
              <div>
                <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                    <IndianRupee className="w-6 h-6" />
                  </div>
                  1. The "3-Keyword" Refund Guarantee
                </h2>
                <div className="text-slate-600 text-[16px] leading-relaxed space-y-4 font-medium">
                  <p>
                    We are incredibly confident in the quality of our recruitment AI engine. If you purchase the <strong>RGJobs PRO Pass (₹199)</strong> and our AI analyzer fails to identify at least 3 missing keywords to help improve your resume matching score, you are entitled to a full refund:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Timeframe:</strong> Refund claims must be submitted via email within exactly <strong>3 days (72 hours)</strong> from the date and time of transaction capture.</li>
                    <li><strong>Condition:</strong> The candidate profile must have been evaluated against at least one curated job listing on our platform.</li>
                    <li><strong>No Questions Asked:</strong> We will process your return immediately upon verification of the AI output—no arguments, no fine print.</li>
                  </ul>
                </div>
              </div>

              {/* Section 2 */}
              <div>
                <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                    <RefreshCw className="w-6 h-6 animate-spin-slow" />
                  </div>
                  2. Double Charges & Transaction Failures
                </h2>
                <div className="text-slate-600 text-[16px] leading-relaxed space-y-4 font-medium">
                  <p>
                    Occasionally, payment gateway network timeouts can cause transaction anomalies:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>If money is debited from your bank account but your RGJobs account fails to upgrade to PRO within 10 minutes, our payment processor (Razorpay) initiates an automatic reversal.</li>
                    <li>Double payments caused by rapid-clicking are automatically refunded back to your original source account.</li>
                    <li>All merchant-side failed payments are settled automatically within <strong>5 to 7 business days</strong> depending on your bank's clearance cycles.</li>
                  </ul>
                </div>
              </div>

              {/* Section 3 */}
              <div>
                <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
                  <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  3. Service Cancellation Policy
                </h2>
                <p className="text-slate-600 text-[16px] leading-relaxed font-medium">
                  At RGJobs, we despise hidden recurring charges. The <strong>PRO upgrade is a ONE-TIME payment for a 30-Day Pass</strong>. 
                  <br /><br />
                  Because we <strong>never</strong> store your billing details to auto-renew your plan, there are no subscriptions to cancel, no recurring liabilities, and no contract termination fees. Your PRO status simply expires naturally after 30 days unless you manually decide to purchase another pass.
                </p>
              </div>

              {/* Section 4 */}
              <div>
                <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
                  <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                    <HelpCircle className="w-6 h-6" />
                  </div>
                  4. How to Claim Your Refund
                </h2>
                <div className="text-slate-600 text-[16px] leading-relaxed space-y-4 font-medium">
                  <p>
                    We have made claiming your refund incredibly simple. You do not need to call any customer support centers:
                  </p>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>Write an email to our core team at <a href="mailto:rgjobsupdate@gmail.com" className="text-indigo-600 font-bold hover:underline">rgjobsupdate@gmail.com</a>.</li>
                    <li>Use the subject line: <strong>PRO Refund Request - [Your Full Name]</strong>.</li>
                    <li>State your registered email address and attach your payment receipt or Order ID.</li>
                  </ol>
                  <p className="mt-4">
                    Once received, our finance team will audit the transaction details and credit the amount back to your original source (UPI, Credit/Debit Card, or NetBanking) within 48 hours.
                  </p>
                </div>
              </div>

              {/* Contact */}
              <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Need billing support?</h3>
                  <p className="text-slate-600 font-medium">
                    If you have questions about your invoices, transactions, or account upgrade status, our dedicated billing desk is ready to help.
                  </p>
                </div>
                <a 
                  href="mailto:rgjobsupdate@gmail.com"
                  className="px-6 py-3 bg-slate-950 text-white rounded-xl font-bold text-[13px] hover:bg-slate-800 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" /> Email Billing
                </a>
              </div>

            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
