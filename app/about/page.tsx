"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Zap, Code, Heart, Target, ArrowRight, CheckCircle2, Globe, Mail } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sora flex flex-col overflow-hidden">
      <main className="flex-1">
        {/* Hero Section — Personal, not corporate */}
        <section className="relative w-full pt-32 pb-24 lg:pt-40 lg:pb-32 flex items-center justify-center overflow-hidden bg-slate-950">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-950/40 via-slate-950 to-slate-950"></div>
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen"></div>
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none mix-blend-screen"></div>

          <div className="relative z-10 px-6 max-w-[900px] mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-slate-300 text-[13px] font-bold tracking-wide uppercase mb-6 backdrop-blur-md"
            >
              <Heart className="w-4 h-4 text-rose-400" />
              Built with Purpose
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-8 font-playfair tracking-tight leading-[1.1]"
            >
              One developer.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">One real problem.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-[17px] md:text-[20px] text-slate-300 font-medium leading-relaxed max-w-[700px] mx-auto"
            >
              RGJobs exists because I got tired of watching talented developers apply to 100+ jobs and hear nothing back. I built this to fix it.
            </motion.p>
          </div>
        </section>

        {/* The Real Story */}
        <section className="relative z-20 -mt-12 max-w-[1000px] mx-auto px-6 mb-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full bg-white rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.06)] border border-slate-200 p-8 md:p-14"
          >
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 font-playfair tracking-tight">
                  Hey, I&apos;m Rajesh 👋
                </h2>
                <div className="text-slate-600 text-[16px] leading-relaxed space-y-4 font-medium">
                  <p>
                    I&apos;m a developer from <strong>Lucknow, India</strong>. I built RGJobs because I witnessed a pattern that frustrated me: skilled developers spending weeks crafting resumes, applying to dozens of companies, and getting zero callbacks — not because they weren&apos;t qualified, but because their resumes weren&apos;t optimized for <strong>ATS (Applicant Tracking Systems)</strong>.
                  </p>
                  <p>
                    Most job seekers don&apos;t even know ATS exists. They don&apos;t realize that 80% of resumes are rejected before a human ever reads them — simply because they&apos;re missing the right keywords. That felt wrong to me.
                  </p>
                  <p>
                    So I built RGJobs. Not as a startup pitch or a venture-backed experiment. As a practical tool that solves a real problem: <strong>helping candidates understand exactly why they&apos;re not getting callbacks and what to fix</strong>.
                  </p>
                </div>
              </div>

              <div className="h-px bg-slate-100"></div>

              {/* Honest Disclosure */}
              <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 mb-2">Complete Transparency</h3>
                    <p className="text-slate-600 text-[15px] font-medium leading-relaxed">
                      RGJobs is an <strong>AI Career Intelligence Platform</strong>. We index fresh listings directly from official company career pages — Swiggy, Razorpay, Flipkart, Amazon, and hundreds more. When you click &quot;Apply&quot;, you go directly to their official career page. We never collect your application data or act as a middleman. What we <em>add</em> on top is AI-powered resume analysis that shows you exactly how well you match a job and what keywords you&apos;re missing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* What Makes Us Different */}
        <section className="max-w-[1200px] mx-auto px-6 mb-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 font-playfair tracking-tight mb-4">
              Why RGJobs is Different
            </h2>
            <p className="text-slate-500 text-[16px] font-medium max-w-2xl mx-auto">
              No fake promises. No inflated numbers. Just a product built with honesty and engineering.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Target,
                title: "ATS Gap Analysis",
                description: "Our AI reads your resume and the job description, then tells you exactly which keywords you're missing. Not vague advice — specific, actionable gaps.",
                color: "bg-blue-50 text-blue-600 border-blue-100"
              },
              {
                icon: Shield,
                title: "No Data Gatekeeping",
                description: "We never hold your application hostage. Every 'Apply' button takes you directly to the company's official career page. Your data stays yours.",
                color: "bg-emerald-50 text-emerald-600 border-emerald-100"
              },
              {
                icon: Code,
                title: "Built by a Developer",
                description: "This isn't a corporate product with hidden agendas. It's built by one person who understands the Indian tech job market firsthand.",
                color: "bg-purple-50 text-purple-600 border-purple-100"
              },
              {
                icon: Zap,
                title: "Free to Start",
                description: "Every user gets 3 free AI credits. No credit card required. Try the product, see the value, then decide if PRO is worth it. We earn trust first.",
                color: "bg-amber-50 text-amber-600 border-amber-100"
              },
              {
                icon: Heart,
                title: "No Fake Testimonials",
                description: "We don't manufacture reviews or show fake success stories. When real users share their feedback, we'll display it honestly — not before.",
                color: "bg-rose-50 text-rose-600 border-rose-100"
              },
              {
                icon: Globe,
                title: "Fresh Listings Daily",
                description: "We actively curate and index job listings from company career pages across India. Every listing links to the real posting — no stale or expired jobs.",
                color: "bg-indigo-50 text-indigo-600 border-indigo-100"
              }
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-white border border-slate-200 rounded-[2rem] p-7 hover:border-blue-200 hover:shadow-[0_10px_30px_rgba(37,99,235,0.05)] transition-all duration-300"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${item.color} mb-5`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-[17px] font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-[14px] font-medium leading-relaxed">{item.description}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Simple Promise */}
        <section className="max-w-[800px] mx-auto px-6 mb-24">
          <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 rounded-[2rem] p-10 md:p-14 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-black text-white font-playfair tracking-tight mb-6">
                My Promise to You
              </h3>
              <div className="space-y-4 text-left max-w-lg mx-auto mb-8">
                {[
                  "I will never show fake reviews or inflated numbers",
                  "I will never lock your data behind a paywall",
                  "I will always be transparent about what RGJobs is (an opportunity pipeline + AI tools)",
                  "I will keep improving this product based on real user feedback",
                  "If PRO doesn't find at least 3 missing keywords, you get a full refund"
                ].map((promise, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <p className="text-slate-300 text-[15px] font-medium">{promise}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/jobs"
                  className="inline-flex items-center gap-2 bg-white text-slate-900 font-bold py-3 px-7 rounded-xl hover:bg-slate-100 transition-all text-[14px]"
                >
                  Browse Jobs <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="mailto:rgjobsupdate@gmail.com"
                  className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white font-bold py-3 px-7 rounded-xl hover:bg-white/20 transition-all text-[14px]"
                >
                  <Mail className="w-4 h-4" /> Email Rajesh Directly
                </a>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
