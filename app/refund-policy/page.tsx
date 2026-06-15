"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, IndianRupee, HelpCircle, AlertTriangle, RefreshCw, Mail, CheckCircle, XCircle, Zap, FileText } from 'lucide-react';

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
              Refund &amp; Cancellation Policy
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-[17px] md:text-[20px] text-slate-300 font-medium leading-relaxed max-w-[700px] mx-auto"
            >
              We believe in complete transparency, honest pricing, and customer trust. Please read our detailed policy carefully before making a purchase.
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
                Last Updated: June 2026
              </p>

              {/* ═══════════════════════════════════════════ */}
              {/* Section 1 — What You Are Paying For        */}
              {/* ═══════════════════════════════════════════ */}
              <div>
                <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                    <Zap className="w-6 h-6" />
                  </div>
                  1. What You Are Paying For
                </h2>
                <div className="text-slate-600 text-[16px] leading-relaxed space-y-4 font-medium">
                  <p>
                    When you purchase the <strong>RGJobs PRO Pass (₹199)</strong> or any <strong>AI Credit Top-Up</strong>, you are paying for <strong>instant access to premium digital services</strong>. These services include, but are not limited to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>AI-Powered Resume Analysis</strong> — Our AI scans your resume, identifies missing keywords, and provides actionable improvement suggestions tailored to each job.</li>
                    <li><strong>AI Resume Health Check</strong> — A comprehensive audit of your resume&apos;s quality, formatting, and ATS compatibility.</li>
                    <li><strong>Enhanced Profile Visibility</strong> — Your profile is prioritized and highlighted to employers.</li>
                    <li><strong>Premium Badge</strong> — A visual trust signal on your profile indicating verified PRO status.</li>
                    <li><strong>Priority Application Routing</strong> — Your job applications are given higher priority in employer queues.</li>
                    <li><strong>Unlimited AI Credits</strong> — No daily or weekly limits on AI analyses during your PRO period.</li>
                  </ul>

                  <div className="p-5 bg-indigo-50 border border-indigo-200 rounded-xl mt-4">
                    <p className="text-indigo-900 text-[15px] font-bold mb-2">
                      ⚡ Important: Instant Digital Delivery
                    </p>
                    <p className="text-indigo-800 text-[14px]">
                      All PRO services are <strong>activated instantly</strong> upon successful payment. Since these are digital services that are delivered and consumed immediately, they are treated as &quot;used&quot; from the moment of activation — regardless of whether you choose to use them or not.
                    </p>
                  </div>

                  <div className="p-5 bg-rose-50 border border-rose-200 rounded-xl mt-2">
                    <p className="text-rose-900 text-[15px] font-bold mb-2">
                      🚫 What You Are NOT Paying For
                    </p>
                    <p className="text-rose-800 text-[14px]">
                      The PRO Pass is <strong>not</strong> a guarantee of job placement, interview calls, or the availability of job listings matching your specific profile (such as graduation batch, experience level, skill set, or preferred location). RGJobs is a <strong>service platform</strong>, not a placement agency. Job listings on our platform are posted by third-party employers and are subject to change at any time.
                    </p>
                  </div>
                </div>
              </div>

              {/* ═══════════════════════════════════════════ */}
              {/* Section 2 — Eligible Refund Scenarios       */}
              {/* ═══════════════════════════════════════════ */}
              <div>
                <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  2. When You ARE Eligible for a Refund
                </h2>
                <div className="text-slate-600 text-[16px] leading-relaxed space-y-4 font-medium">
                  <p>
                    We stand behind the quality of our services. You are entitled to a refund in the following specific scenarios:
                  </p>

                  <div className="space-y-4 mt-4">
                    {/* Scenario A */}
                    <div className="p-4 bg-emerald-50/60 border border-emerald-100 rounded-xl">
                      <p className="text-emerald-900 font-bold text-[15px] mb-1">✅ A. Technical / Payment Failures</p>
                      <ul className="list-disc pl-6 space-y-1 text-emerald-800 text-[14px]">
                        <li>Money was debited from your account but your PRO plan was <strong>not activated</strong> within 10 minutes.</li>
                        <li>You were charged <strong>twice</strong> for the same purchase due to a payment gateway error.</li>
                        <li>Razorpay or your bank confirms a <strong>failed transaction</strong> where money left your account but did not reach us.</li>
                      </ul>
                      <p className="text-emerald-700 text-[13px] mt-2 font-bold">→ These are automatically reversed within 5–7 business days. No action needed from you.</p>
                    </div>

                    {/* Scenario B */}
                    <div className="p-4 bg-emerald-50/60 border border-emerald-100 rounded-xl">
                      <p className="text-emerald-900 font-bold text-[15px] mb-1">✅ B. The &quot;3-Keyword&quot; AI Service Guarantee</p>
                      <p className="text-emerald-800 text-[14px] mb-2">
                        If you use our AI Resume Analyzer against at least one job listing and the AI fails to identify at least <strong>3 missing keywords</strong> or actionable suggestions, you are entitled to a <strong>full refund</strong>.
                      </p>
                      <ul className="list-disc pl-6 space-y-1 text-emerald-800 text-[14px]">
                        <li><strong>Timeframe:</strong> Claim must be submitted within <strong>48 hours</strong> of purchase.</li>
                        <li><strong>Condition:</strong> You must have completed at least one AI analysis on the platform.</li>
                        <li><strong>Proof Required:</strong> Screenshot of the AI analysis result showing fewer than 3 suggestions.</li>
                      </ul>
                    </div>

                    {/* Scenario C */}
                    <div className="p-4 bg-emerald-50/60 border border-emerald-100 rounded-xl">
                      <p className="text-emerald-900 font-bold text-[15px] mb-1">✅ C. Platform Downtime / Service Outage</p>
                      <p className="text-emerald-800 text-[14px]">
                        If the RGJobs platform experiences a major outage lasting more than <strong>48 consecutive hours</strong> during your active PRO period, and you were unable to use any PRO features during that time, you may request a <strong>pro-rata extension</strong> or a partial refund.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ═══════════════════════════════════════════ */}
              {/* Section 3 — Non-Refundable Scenarios        */}
              {/* ═══════════════════════════════════════════ */}
              <div>
                <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
                  <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                    <XCircle className="w-6 h-6" />
                  </div>
                  3. When Refunds Will NOT Be Issued
                </h2>
                <div className="text-slate-600 text-[16px] leading-relaxed space-y-4 font-medium">
                  <p>
                    Since the PRO Pass provides instant access to premium digital services that are consumed upon activation, refunds will <strong>not</strong> be issued in the following cases:
                  </p>

                  <div className="space-y-3 mt-4">
                    <div className="flex gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                      <span className="text-rose-500 font-black text-[16px] shrink-0 mt-0.5">✗</span>
                      <div>
                        <p className="text-slate-900 font-bold text-[14px]">Job Listings Not Matching Your Profile</p>
                        <p className="text-slate-600 text-[13px]">If you purchased PRO but found that currently available jobs do not match your specific graduation batch, experience level, skill set, or preferred location. Example: You are from a 2019 batch with no work experience, and our current listings are for recent graduates or experienced candidates.</p>
                      </div>
                    </div>

                    <div className="flex gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                      <span className="text-rose-500 font-black text-[16px] shrink-0 mt-0.5">✗</span>
                      <div>
                        <p className="text-slate-900 font-bold text-[14px]">Change of Mind / Buyer&apos;s Remorse</p>
                        <p className="text-slate-600 text-[13px]">If you simply change your mind after purchasing, or decide you no longer need the PRO services after 1 or 2 days. The services were already delivered and activated for you.</p>
                      </div>
                    </div>

                    <div className="flex gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                      <span className="text-rose-500 font-black text-[16px] shrink-0 mt-0.5">✗</span>
                      <div>
                        <p className="text-slate-900 font-bold text-[14px]">Not Using the Services</p>
                        <p className="text-slate-600 text-[13px]">If you purchased PRO but chose not to use any of the AI analysis, resume health, or other PRO features during your active period. Access was available — usage is your choice.</p>
                      </div>
                    </div>

                    <div className="flex gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                      <span className="text-rose-500 font-black text-[16px] shrink-0 mt-0.5">✗</span>
                      <div>
                        <p className="text-slate-900 font-bold text-[14px]">Dissatisfaction with Job Market Conditions</p>
                        <p className="text-slate-600 text-[13px]">If you are unhappy with the general state of the job market, the number of open positions, hiring freezes by companies, or the competition for roles. These are external factors beyond our control.</p>
                      </div>
                    </div>

                    <div className="flex gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                      <span className="text-rose-500 font-black text-[16px] shrink-0 mt-0.5">✗</span>
                      <div>
                        <p className="text-slate-900 font-bold text-[14px]">Expecting Guaranteed Job Placement</p>
                        <p className="text-slate-600 text-[13px]">If you expected the PRO Pass to guarantee you a job, an interview call, or a direct placement. RGJobs is a technology service platform — we provide tools to improve your chances, not guaranteed outcomes.</p>
                      </div>
                    </div>

                    <div className="flex gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                      <span className="text-rose-500 font-black text-[16px] shrink-0 mt-0.5">✗</span>
                      <div>
                        <p className="text-slate-900 font-bold text-[14px]">Request Made After 48 Hours</p>
                        <p className="text-slate-600 text-[13px]">Refund requests submitted more than 48 hours after the date and time of the original transaction will not be entertained, except for verified technical/payment failures.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ═══════════════════════════════════════════ */}
              {/* Section 4 — Cancellation Policy             */}
              {/* ═══════════════════════════════════════════ */}
              <div>
                <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
                  <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  4. Cancellation &amp; Auto-Renewal Policy
                </h2>
                <div className="text-slate-600 text-[16px] leading-relaxed space-y-4 font-medium">
                  <p>
                    At RGJobs, we despise hidden recurring charges. The <strong>PRO Pass is a ONE-TIME payment for a 30-Day access period</strong>.
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>We <strong>never</strong> store your card, UPI, or banking details.</li>
                    <li>There is <strong>no auto-renewal</strong>. Your PRO status simply expires after 30 days.</li>
                    <li>There are <strong>no recurring charges</strong>, no hidden fees, and no cancellation penalties.</li>
                    <li>If you wish to continue PRO after 30 days, you must manually purchase a new pass.</li>
                  </ul>
                  <p>
                    Since there is no subscription to cancel, there is no cancellation process. Your PRO access naturally expires at the end of the 30-day period.
                  </p>
                </div>
              </div>

              {/* ═══════════════════════════════════════════ */}
              {/* Section 5 — Refund Deductions               */}
              {/* ═══════════════════════════════════════════ */}
              <div>
                <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                    <IndianRupee className="w-6 h-6" />
                  </div>
                  5. Refund Amount &amp; Deductions
                </h2>
                <div className="text-slate-600 text-[16px] leading-relaxed space-y-4 font-medium">
                  <p>
                    For all approved refund requests (as per Section 2), the refund amount will be calculated as follows:
                  </p>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse mt-2">
                      <thead>
                        <tr className="bg-slate-50">
                          <th className="border border-slate-200 px-4 py-3 text-[13px] font-bold text-slate-700">Scenario</th>
                          <th className="border border-slate-200 px-4 py-3 text-[13px] font-bold text-slate-700">Refund Amount</th>
                        </tr>
                      </thead>
                      <tbody className="text-[14px]">
                        <tr>
                          <td className="border border-slate-200 px-4 py-3">Payment failure / double charge</td>
                          <td className="border border-slate-200 px-4 py-3 font-bold text-emerald-700">100% (Full Amount)</td>
                        </tr>
                        <tr className="bg-slate-50/50">
                          <td className="border border-slate-200 px-4 py-3">AI &quot;3-Keyword&quot; Guarantee claim</td>
                          <td className="border border-slate-200 px-4 py-3 font-bold text-emerald-700">100% (Full Amount)</td>
                        </tr>
                        {/* <tr>
                          <td className="border border-slate-200 px-4 py-3">Goodwill/exceptional case (admin-approved only)</td>
                          <td className="border border-slate-200 px-4 py-3 font-bold text-amber-700">Amount minus GST (18%) and Payment Gateway charges (2–3%)</td>
                        </tr> */}
                      </tbody>
                    </table>
                  </div>

                  {/* <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl mt-2">
                    <p className="text-amber-800 text-[14px]">
                      <strong>Why the deduction?</strong> When you make a payment, the government charges us 18% GST and Razorpay charges us a 2–3% transaction fee. These are <strong>non-recoverable third-party costs</strong> that we have already paid. In goodwill refund cases, these amounts are deducted to ensure fairness for both parties.
                    </p>
                  </div> */}
                </div>
              </div>

              {/* ═══════════════════════════════════════════ */}
              {/* Section 6 — How to Claim                    */}
              {/* ═══════════════════════════════════════════ */}
              <div>
                <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                    <FileText className="w-6 h-6" />
                  </div>
                  6. How to Request a Refund
                </h2>
                <div className="text-slate-600 text-[16px] leading-relaxed space-y-4 font-medium">
                  <p>
                    If you believe your situation qualifies for a refund under Section 2, follow these steps:
                  </p>
                  <ol className="list-decimal pl-6 space-y-3">
                    <li>
                      Send an email to <a href="mailto:rgjobsupdate@gmail.com" className="text-indigo-600 font-bold hover:underline">rgjobsupdate@gmail.com</a> within <strong>48 hours</strong> of your purchase.
                    </li>
                    <li>
                      Use the subject line: <strong>&quot;PRO Refund Request — [Your Full Name]&quot;</strong>
                    </li>
                    <li>
                      Include the following in your email:
                      <ul className="list-disc pl-6 space-y-1 mt-2">
                        <li>Your registered email address on RGJobs.</li>
                        <li>Your Razorpay Order ID or payment receipt screenshot.</li>
                        <li>A clear description of the issue and the reason for requesting a refund.</li>
                        <li>Any supporting screenshots (e.g., AI analysis result, error messages).</li>
                      </ul>
                    </li>
                  </ol>
                  <p className="mt-4">
                    Our team will review your request and respond within <strong>24–48 hours</strong>. If approved, the refund will be credited to your original payment method within <strong>5–7 business days</strong>.
                  </p>
                </div>
              </div>

              {/* ═══════════════════════════════════════════ */}
              {/* Section 7 — Our Commitment                  */}
              {/* ═══════════════════════════════════════════ */}
              <div>
                <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
                  <div className="p-2 bg-teal-50 text-teal-600 rounded-xl">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  7. Our Commitment to You
                </h2>
                <div className="text-slate-600 text-[16px] leading-relaxed space-y-4 font-medium">
                  <p>
                    We understand that spending ₹199 is a decision you make with trust, and we take that trust very seriously. Here is what we guarantee:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Every PRO feature listed on our platform will work exactly as described.</li>
                    <li>Our AI engine will provide genuine, actionable insights — not generic filler content.</li>
                    <li>We will never charge you without your explicit action and consent.</li>
                    <li>We will never sell, share, or misuse your personal data or resume information.</li>
                    <li>We actively add new job listings daily and remove expired ones to maintain a high-quality, relevant opportunity database.</li>
                  </ul>

                  <div className="p-5 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl mt-4">
                    <p className="text-indigo-900 text-[15px] font-bold mb-2">
                      💡 Before You Purchase
                    </p>
                    <p className="text-indigo-800 text-[14px]">
                      We strongly recommend that you <strong>browse the available job listings on our platform for free</strong> before purchasing the PRO Pass. This way, you can verify whether our current listings match your batch, experience, skills, and career goals. If you find relevant opportunities, the PRO Pass will help you maximize your chances. If no jobs match your profile, you can check back later when new listings are added — there is no pressure to buy immediately.
                    </p>
                  </div>
                </div>
              </div>

              {/* ═══════════════════ Contact ═══════════════════ */}
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
