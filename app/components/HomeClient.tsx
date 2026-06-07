"use client";

import React, { useState, useEffect } from "react";
import Slider from "./Slider";
import Jobcard from "./Jobcard";
import axios from "axios";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  Shield, 
  Target, 
  FileText, 
  Zap, 
  Briefcase, 
  ArrowRight, 
  CheckCircle2, 
  Activity, 
  EyeOff, 
  Coins,
  Globe,
  Radar
} from "lucide-react";
import Link from "next/link";

export default function HomeClient({ initialJobs }: { initialJobs: any[] }) {
  const [jobs, setJobs] = useState<any[]>(initialJobs);
  const [searchedJobs, setSearchedJobs] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLatestJobs = async () => {
      const isInitialEmpty = !jobs || jobs.length === 0;
      if (isInitialEmpty) {
        setLoading(true);
      }
      try {
        const backendURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const res = await axios.get(`${backendURL}/api/getAllJobs`);
        let jobsData = [];
        if (res.data) {
          if (res.data.JobsData) {
            jobsData = Array.isArray(res.data.JobsData) ? res.data.JobsData : [];
          } else {
            jobsData = Array.isArray(res.data) ? res.data : [];
          }
        }
        if (jobsData.length > 0) {
          setJobs(jobsData);
        }
      } catch (err) {
        console.error("Error fetching jobs client-side:", err);
      } finally {
        if (isInitialEmpty) {
          setLoading(false);
        }
      }
    };

    fetchLatestJobs();
  }, []);

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════════
          1. HERO + TRUST BAR + RESUME HEALTH + HOW IT WORKS + FREE FEATURES 
             + OPPORTUNITY RADAR SEARCH + CATEGORIES (all inside Slider)
          ═══════════════════════════════════════════════════════════════════ */}
      <Slider setSearchedJobs={setSearchedJobs} setLoading={setLoading} allJobs={jobs} />

      {/* ═══════════════════════════════════════════════════════════════════
          2. THE INTELLIGENCE SUITE — Three Flagship Product Cards
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="w-full relative bg-slate-950 text-white py-24 border-t border-slate-900 overflow-hidden font-sora">
        {/* Subtle grid and glows */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.03),transparent_40%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.02),transparent_40%)] pointer-events-none" />
        <div className="absolute inset-0 z-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-20">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-wider uppercase mb-4"
            >
              <Sparkles className="w-3.5 h-3.5" /> Your Career Toolkit
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-5xl font-black text-white font-playfair tracking-tight mb-4"
            >
              The Career Intelligence Suite
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-slate-400 font-medium text-base md:text-lg"
            >
              Traditional job portals sell candidate databases to third parties. We build elite utility tools to ensure your resume bypasses automated screening filters.
            </motion.p>
          </div>

          {/* Three Flagship Product Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
            
            {/* Tool 1: ATS Resume Optimizer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-slate-900/40 backdrop-blur-sm border border-slate-850 hover:border-slate-750 rounded-[2rem] p-8 text-left transition-all duration-300 relative group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center text-rose-400 mb-6 group-hover:scale-105 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-white mb-2">1. ATS Resume Audit</h3>
                <p className="text-slate-400 text-xs font-semibold leading-relaxed mb-6">
                  Check your standalone resume&apos;s parsing integrity across 6 structural metrics. Identify broken layout parameters, contact details, and density gaps before you submit.
                </p>
              </div>
              <Link href="/resume-health" className="inline-flex items-center gap-1.5 text-xs font-black text-rose-400 hover:text-rose-300 tracking-wider uppercase group-hover:translate-x-1 transition-all mt-auto">
                Scan Resume <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>

            {/* Tool 2: AI Compatibility Engine */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-slate-900/40 backdrop-blur-sm border border-slate-850 hover:border-slate-750 rounded-[2rem] p-8 text-left transition-all duration-300 relative group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 mb-6 group-hover:scale-105 transition-transform">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-white mb-2">2. AI Compatibility Engine</h3>
                <p className="text-slate-400 text-xs font-semibold leading-relaxed mb-6">
                  Match your resume against any job description for a deep compatibility score. Get missing keyword suggestions, tailored cover letters, and STAR interview prep.
                </p>
              </div>
              <a href="#opportunity-radar" className="inline-flex items-center gap-1.5 text-xs font-black text-blue-400 hover:text-blue-300 tracking-wider uppercase group-hover:translate-x-1 transition-all mt-auto">
                Explore Opportunities <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </motion.div>

            {/* Tool 3: Application Command Center */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-slate-900/40 backdrop-blur-sm border border-slate-850 hover:border-slate-750 rounded-[2rem] p-8 text-left transition-all duration-300 relative group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center text-purple-400 mb-6 group-hover:scale-105 transition-transform">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-white mb-2">3. Application Command Center</h3>
                <p className="text-slate-400 text-xs font-semibold leading-relaxed mb-6">
                  Organize your active job hunts systematically. Log target roles, receive contextual pipeline indicators, and automatically trigger tailored cover letters and STAR interview prep guides.
                </p>
              </div>
              <Link href="/candidate-dashboard" className="inline-flex items-center gap-1.5 text-xs font-black text-purple-400 hover:text-purple-300 tracking-wider uppercase group-hover:translate-x-1 transition-all mt-auto">
                Open Workspace <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════════
              ANTI-SPAM & TRUST MANIFESTO — Moved up to be visible early
              ═══════════════════════════════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-850 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10 text-left">
              <div className="lg:col-span-6 space-y-4">
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Shield className="w-4 h-4" /> 100% Transparent, Ethical Curation
                </span>
                <h3 className="text-2xl md:text-3xl font-black text-white font-playfair leading-tight">
                  Our Anti-Spam & Trust Manifesto
                </h3>
                <p className="text-slate-400 text-xs font-semibold leading-relaxed">
                  Most job aggregators act as data brokers, harvesting your phone numbers and selling them to educational consultants. We are a pure utility software platform funded strictly by premium consumer tools subscriptions.
                </p>
              </div>

              <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-950/60 border border-slate-850 rounded-2xl p-4.5">
                  <EyeOff className="w-5 h-5 text-blue-400 mb-2" />
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">Zero CV Data-Brokering</h4>
                  <p className="text-[10px] text-slate-500 font-bold mt-1 leading-normal">
                    We will never sell, lease, or distribute your email or contact phone details to recruiters. Your profile stays confidential.
                  </p>
                </div>
                <div className="bg-slate-950/60 border border-slate-850 rounded-2xl p-4.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 mb-2" />
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">100% Direct Application</h4>
                  <p className="text-[10px] text-slate-500 font-bold mt-1 leading-normal">
                    Every listing redirects directly to official company career subdomains ( Greenhouse, Lever, Workday etc.). No gated forms.
                  </p>
                </div>
                <div className="bg-slate-950/60 border border-slate-850 rounded-2xl p-4.5">
                  <Coins className="w-5 h-5 text-amber-400 mb-2" />
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">Manual Billing Control</h4>
                  <p className="text-[10px] text-slate-500 font-bold mt-1 leading-normal">
                    We hate sneaky auto-renew subscription loops. All passes are completely manual, giving you absolute checkout control.
                  </p>
                </div>
                <div className="bg-slate-950/60 border border-slate-850 rounded-2xl p-4.5">
                  <Activity className="w-5 h-5 text-rose-400 mb-2" />
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">Honest AI Analysis</h4>
                  <p className="text-[10px] text-slate-500 font-bold mt-1 leading-normal">
                    We do not inflate scores to boost user satisfaction. Genuinely missing parameters lead to actual interview callbacks.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          3. VETTED CURATION GUARANTEE BANNER
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-12 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center gap-6 md:gap-10 bg-blue-50 dark:bg-slate-950 border border-blue-100 dark:border-blue-500/20 rounded-3xl p-7 md:p-10"
          >
            <div className="w-16 h-16 shrink-0 rounded-2xl bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Globe className="w-8 h-8" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <p className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1.5">
                🛡️ Vetted Curation Guarantee — 100% Spam-Free Intelligence
              </p>
              <p className="text-slate-700 dark:text-slate-300 font-medium text-[15px] leading-relaxed">
                RGJobs actively crawls and vets opportunity listings <strong>directly from official company career subdomains</strong> (e.g. Greenhouse, Workday, Lever) and registered legal corporations. When you click Apply, you go <strong>straight to the official employer portal</strong>. We automatically discard all third-party affiliates, reseller boards, and generic spam, keeping your applications 100% direct and under your control.
              </p>
            </div>
            <Link
              href="/pro"
              className="shrink-0 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-colors shadow-lg shadow-blue-600/20 whitespace-nowrap"
            >
              See AI Features →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          4. LIVE OPPORTUNITY RADAR — Job Listings (The Feature, Not the Product)
          ═══════════════════════════════════════════════════════════════════ */}
      <div id="explore-opportunities" className="w-full bg-slate-50 dark:bg-slate-950 py-12 border-t border-slate-200 dark:border-slate-900 text-center font-sora">
        <div className="max-w-xl mx-auto px-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-black tracking-wider uppercase mb-3">
            <Radar className="w-3 h-3" /> Sourced from 890+ Corporate Career Pages
          </div>
          <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white font-playfair tracking-tight mb-2">
            Opportunity Radar — Live Feed
          </h3>
          <p className="text-[13px] text-slate-550 dark:text-slate-400 font-semibold leading-relaxed">
            AI-curated opportunities tracked in real time on official corporate databases. Every application is 100% direct.
          </p>
        </div>
      </div>

      {/* Job Cards */}
      <div className="w-full relative bg-slate-50 dark:bg-slate-950 premium-jobcard-container pb-24">
        <Jobcard
          allJobs={jobs}
          searchedJobs={searchedJobs}
          loading={loading}
        />
      </div>
    </>
  );
}
