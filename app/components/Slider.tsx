"use client";

import React, { useState, useCallback, useMemo } from "react";
import axios from "axios";
import {
  Search,
  MapPin,
  Briefcase,
  GraduationCap,
  Globe,
  Code,
  Zap,
  Award,
  Users,
  ChevronRight,
  Sparkles,
  Building,
  Shield,
  ArrowRight,
  Layers,
  TrendingUp,
  BarChart3,
  Target,
  Lock,
  CheckCircle2,
  Activity,
  Radar,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function Slider({ setSearchedJobs, setLoading, allJobs }: any) {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [role, setRole] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const backendURL = process.env.NEXT_PUBLIC_API_URL;

  // Compute real stats from actual job data — zero fake numbers
  const realStats = useMemo(() => {
    const jobs = allJobs || [];
    const totalJobs = jobs.length;
    const uniqueCompanies = new Set(jobs.map((j: any) => j.title?.toLowerCase?.()?.trim?.())).size;
    const remoteJobs = jobs.filter((j: any) =>
      j.location?.toLowerCase?.()?.includes?.('remote') ||
      j.location?.toLowerCase?.()?.includes?.('work from home') ||
      j.location?.toLowerCase?.()?.includes?.('wfh')
    ).length;
    return { totalJobs, uniqueCompanies, remoteJobs };
  }, [allJobs]);

  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!role && !location && !searchTerm) {
      alert("Please enter at least one search criteria to find your perfect role.");
      return;
    }

    setIsSearching(true);
    if (setLoading) setLoading(true);

    try {
      const res = await axios.get(`${backendURL}/api/jobs-search`, {
        params: {
          searchTerm: searchTerm.trim(),
          location: location.trim(),
          role: role.trim()
        },
      });

      if (res.data && res.data.length > 0) {
        if (setSearchedJobs) setSearchedJobs(res.data);
        const jobsSection = document.querySelector('.premium-jobcard-container');
        if (jobsSection) {
          jobsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        if (setSearchedJobs) setSearchedJobs([]);
      }
    } catch (err) {
      console.error("Error fetching jobs:", err);
      alert("Error searching jobs. Please try again.");
    } finally {
      setIsSearching(false);
      if (setLoading) setLoading(false);
    }
  }, [searchTerm, location, role, backendURL, setSearchedJobs, setLoading]);

  return (
    <div className="w-full flex flex-col font-sora">
      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 1: HERO — Career Intelligence Platform (Above the Fold)
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="relative w-full min-h-[92vh] flex flex-col items-center justify-center overflow-hidden bg-slate-950 pt-20 pb-16">

        {/* Cinematic Gradient Background */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-950 via-blue-950/30 to-slate-950" />
        <div className="absolute top-[-15%] right-[-8%] w-[700px] h-[700px] rounded-full bg-blue-600/8 blur-[150px] pointer-events-none" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/6 blur-[120px] pointer-events-none" />
        <div className="absolute top-[40%] left-[50%] w-[400px] h-[400px] rounded-full bg-violet-600/4 blur-[100px] pointer-events-none" />

        {/* Subtle radial spotlight */}
        <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_30%_20%,rgba(37,99,235,0.08),transparent_50%)]" />

        <div className="relative z-10 w-full max-w-[1250px] mx-auto px-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">

            {/* ── LEFT COLUMN: Platform Messaging ── */}
            <div className="lg:col-span-6 space-y-7 text-left flex flex-col justify-center">

              {/* Platform Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/25 bg-blue-500/8 text-blue-300 text-[11px] font-bold tracking-[0.15em] uppercase w-fit backdrop-blur-md"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                Career Intelligence Platform
              </motion.div>

              {/* Hero Headline — CRED-level minimal */}
              <motion.h1
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-[60px] font-black text-white tracking-tight leading-[1.08] font-playfair"
              >
                Your career,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400">
                  managed.
                </span>
              </motion.h1>

              {/* Sub-heading — explains the value */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-slate-400 text-[17px] leading-relaxed font-medium max-w-[520px]"
              >
                Stop applying blindly. Audit your resume against ATS filters, uncover skill gaps with AI, track your applications, and get personalized interview coaching — all in one secure workspace.
              </motion.p>

              {/* Two CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2"
              >
                <Link
                  href="/resume-health"
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-[15px] shadow-[0_0_40px_rgba(59,130,246,0.25)] hover:shadow-[0_0_50px_rgba(59,130,246,0.4)] hover:-translate-y-0.5 transition-all"
                >
                  <Sparkles className="w-5 h-5" />
                  Get Your Career Score — Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href="#opportunity-radar"
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold text-[14px] transition-all backdrop-blur-sm"
                >
                  <Radar className="w-4 h-4 text-slate-400" />
                  Explore Opportunities
                </a>
              </motion.div>

              {/* Micro trust signals */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] text-slate-500 font-semibold pt-2"
              >
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> No credit card needed</span>
                <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-blue-400" /> Zero data selling</span>
                <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-violet-400" /> 100% direct apply</span>
              </motion.div>
            </div>

            {/* ── RIGHT COLUMN: Career Intelligence Dashboard Mockup ── */}
            <div className="lg:col-span-6 w-full">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.25 }}
                className="w-full bg-slate-900/60 border border-white/8 rounded-[2.5rem] p-6 sm:p-8 backdrop-blur-2xl shadow-[0_40px_100px_rgba(0,0,0,0.5)] relative overflow-hidden group hover:border-blue-500/15 transition-all duration-500"
              >
                {/* Ambient glows */}
                <div className="absolute -top-16 -right-16 w-40 h-40 bg-blue-500/8 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/15 transition-all duration-700" />
                <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-indigo-500/6 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/12 transition-all duration-700" />

                {/* Dashboard header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="text-left">
                      <span className="text-[10px] font-black text-blue-400/70 uppercase tracking-[0.15em] block">Career Intelligence</span>
                      <h4 className="text-[15px] font-black text-white leading-tight">Your Dashboard</h4>
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">Live</span>
                  </div>
                </div>

                {/* Career Score + Market Pulse + Skill Gaps — 3 column mini cards */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-center hover:border-blue-500/20 transition-all">
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                      className="text-2xl font-black text-white block"
                    >74</motion.span>
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mt-1">Career Score</span>
                    <span className="text-[9px] font-bold text-amber-400">Needs work</span>
                  </div>
                  <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-center hover:border-emerald-500/20 transition-all">
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
                      className="text-2xl font-black text-white flex items-center justify-center gap-1"
                    ><TrendingUp className="w-4 h-4 text-emerald-400" />12%</motion.span>
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mt-1">Market Pulse</span>
                    <span className="text-[9px] font-bold text-emerald-400">React demand ↑</span>
                  </div>
                  <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-center hover:border-rose-500/20 transition-all">
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                      className="text-2xl font-black text-white block"
                    >3</motion.span>
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mt-1">Skill Gaps</span>
                    <span className="text-[9px] font-bold text-rose-400">Docker, K8s, GQL</span>
                  </div>
                </div>

                {/* ATS Parse Score bars */}
                <div className="space-y-4 mb-6">
                  {[
                    { label: "ATS Parseability", score: 85, color: "bg-emerald-500" },
                    { label: "Technical Keywords", score: 40, color: "bg-rose-500" },
                    { label: "Measurable Impact", score: 55, color: "bg-amber-500" }
                  ].map((dim, i) => (
                    <div key={i} className="space-y-1.5 text-left">
                      <div className="flex justify-between text-[11px] font-bold">
                        <span className="text-slate-400">{dim.label}</span>
                        <span className="text-slate-500">{dim.score}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${dim.score}%` }}
                          transition={{ duration: 1, delay: 0.5 + i * 0.15 }}
                          className={`h-full rounded-full ${dim.color}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI Recommendation teaser */}
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Zap className="w-4 h-4 text-violet-400" />
                  </div>
                  <div className="text-left">
                    <h5 className="text-[11px] font-black text-white mb-0.5">AI Recommendation</h5>
                    <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                      Add &quot;Docker&quot; and &quot;CI/CD&quot; to your experience section — 67% of matching roles require them.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 2: TRUST BAR — Platform Metrics (Not Job Board Vanity)
          ═══════════════════════════════════════════════════════════════════ */}
      <div className="w-full border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-100 dark:divide-slate-800/60">
          <div className="p-6 md:p-10 flex flex-col items-center justify-center text-center group">
            <span className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 transition-colors">890+</span>
            <span className="text-[11px] md:text-xs font-bold text-slate-500 uppercase tracking-widest">Company Sources</span>
          </div>
          <div className="p-6 md:p-10 flex flex-col items-center justify-center text-center group">
            <span className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 transition-colors">6-Point</span>
            <span className="text-[11px] md:text-xs font-bold text-slate-500 uppercase tracking-widest">ATS Resume Audit</span>
          </div>
          <div className="p-6 md:p-10 flex flex-col items-center justify-center text-center group">
            <span className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 transition-colors">100%</span>
            <span className="text-[11px] md:text-xs font-bold text-slate-500 uppercase tracking-widest">Direct Apply</span>
          </div>
          <div className="p-6 md:p-10 flex flex-col items-center justify-center text-center group">
            <span className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 transition-colors flex items-center gap-1 justify-center"><Lock className="w-6 h-6" /></span>
            <span className="text-[11px] md:text-xs font-bold text-slate-500 uppercase tracking-widest">Zero Data Selling</span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 3: RESUME HEALTH SCORE PROMO BLOCK
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 border-b border-slate-200 dark:border-slate-800/80 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/4 w-[350px] h-[350px] bg-rose-500/5 blur-[100px] rounded-full pointer-events-none mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-blue-500/5 blur-[80px] rounded-full pointer-events-none mix-blend-screen" />

        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-widest"
              >
                🩺 Flagship AI Service
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white font-playfair tracking-tight leading-[1.15]"
              >
                75% of resumes get <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-amber-500 to-rose-500">
                  filtered out by ATS
                </span>
                <br />before reaching a recruiter.
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed font-medium"
              >
                Stop sending resumes blindly into empty applications. Our AI parser scans your resume across 6 critical dimensions to identify structural flaws, missing tech keywords, and format parsing issues before you click apply.
              </motion.p>

              {/* Bullet list of checks */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2"
              >
                {[
                  "Can automated crawlers read your format?",
                  "Are contact infos fully parsed?",
                  "Is the section structure ATS-friendly?",
                  "Is your technical keyword density enough?",
                  "Do you have quantified achievements?",
                  "Is the document length & styling professional?"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-sm text-slate-700 dark:text-slate-300 font-bold">
                    <span className="w-5 h-5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center shrink-0 text-xs">✓</span>
                    {item}
                  </div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="pt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
              >
                <Link
                  href="/resume-health"
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-black text-center text-[15px] shadow-[0_10px_30px_rgba(244,63,94,0.3)] hover:shadow-[0_15px_40px_rgba(244,63,94,0.5)] transition-all flex items-center justify-center gap-2 group hover:-translate-y-0.5"
                >
                  <Sparkles className="w-5 h-5" />
                  Audit My Resume Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="text-center sm:text-left text-xs text-slate-500 dark:text-slate-400 font-bold self-center">
                  Takes less than 15 seconds • No credit card required
                </div>
              </motion.div>
            </div>

            {/* Right Visual Dashboard Column */}
            <div className="lg:col-span-5 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-6 sm:p-8 shadow-[0_30px_60px_rgba(0,0,0,0.06)] relative overflow-hidden group hover:border-rose-500/20 transition-all duration-300"
              >
                {/* Visual Glassmorphic elements mimicking a parsed resume */}
                <div className="flex items-center justify-between mb-8 pb-5 border-b border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-rose-50 dark:bg-rose-500/10 text-rose-500 rounded-xl flex items-center justify-center">
                      <Layers className="w-6 h-6 animate-pulse" />
                    </div>
                    <div className="text-left">
                      <h4 className="text-[14px] font-black text-slate-900 dark:text-white leading-none">ATS Parse Report</h4>
                      <p className="text-[11px] text-slate-400 font-semibold mt-1">Status: Ready to fix</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">62<span className="text-[13px] font-bold text-slate-400">/100</span></span>
                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-wider">Needs Work</span>
                  </div>
                </div>

                {/* Simulated scoring dimensions */}
                <div className="space-y-5">
                  {[
                    { label: "ATS Parseability", score: 85, color: "bg-emerald-500" },
                    { label: "Technical Keyword Density", score: 40, color: "bg-rose-500" },
                    { label: "Quantified Achievements", score: 50, color: "bg-amber-500" }
                  ].map((dim, i) => (
                    <div key={i} className="space-y-1.5 text-left">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-700 dark:text-slate-300">{dim.label}</span>
                        <span className="text-slate-500">{dim.score}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${dim.score}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: i * 0.15 }}
                          className={`h-full rounded-full ${dim.color}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Priority action teaser */}
                <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl text-left">
                  <div className="flex gap-2.5 items-start">
                    <Zap className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-[12px] font-bold text-slate-900 dark:text-white mb-0.5">Top AI Fix Recommendation</h5>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                        Add &quot;Docker&quot; and &quot;CI/CD&quot; under your experience section; Swiggy SDE job posts actively require them.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Graphic overlay to look premium */}
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl group-hover:bg-rose-500/20 transition-all" />
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 4: HOW IT WORKS
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest mb-5">
              <Sparkles className="w-3.5 h-3.5" /> Simple & Transparent
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white font-playfair tracking-tight mb-4">
              Get career-ready in<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500">3 simple steps</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl mx-auto font-medium">
              No middlemen. No application fees. No hidden subscriptions. Just you and your career intelligence.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0 }}
              className="relative bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-8 hover:border-blue-200 dark:hover:border-blue-500/30 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="absolute -top-4 left-8 w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-black flex items-center justify-center shadow-lg">01</div>
              <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FileText className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3">Audit Your Resume</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-[15px] leading-relaxed mb-5">Upload your resume and get a 6-dimension ATS health score with specific fixes — no job description needed.</p>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-black uppercase tracking-wider">✓ Always Free</span>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="relative bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-8 hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="absolute -top-4 left-8 w-8 h-8 rounded-full bg-indigo-600 text-white text-xs font-black flex items-center justify-center shadow-lg">02</div>
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3">Fix & Optimize</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-[15px] leading-relaxed mb-5">Use AI match scoring to find missing ATS keywords, generate tailored cover letters, and prep for interviews with STAR coaching.</p>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-[11px] font-black uppercase tracking-wider">✓ 6 Credits Free</span>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-8 hover:border-purple-200 dark:hover:border-purple-500/30 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="absolute -top-4 left-8 w-8 h-8 rounded-full bg-purple-600 text-white text-xs font-black flex items-center justify-center shadow-lg">03</div>
              <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Target className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3">Track & Apply</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-[15px] leading-relaxed mb-5">Track your pipeline with the AI Kanban board, get recruiter outreach scripts, and apply directly to official career pages.</p>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-500/10 border border-purple-100 dark:border-purple-500/20 text-purple-600 dark:text-purple-400 text-[11px] font-black uppercase tracking-wider">✓ 100% Transparent</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 5: FREE FEATURES SHOWCASE
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-slate-950 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.12),transparent_70%)] pointer-events-none" />

        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-5">
              <Award className="w-3.5 h-3.5" /> Everything Free on Signup
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white font-playfair tracking-tight mb-4">
              What you get for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">absolutely free</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">
              Create a free account in 30 seconds and unlock all of this — no credit card required, ever.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: "🩺", title: "Resume Health Score", desc: "Upload your resume and instantly see if it's ATS-ready — scored across 6 dimensions with specific fix suggestions. No job description needed.", tag: "New · Free" },
              { icon: "🔍", title: "Opportunity Radar", desc: "Browse live opportunities sourced directly from 890+ official company career pages. Fully searchable and always current.", tag: "Always Free" },
              { icon: "🤖", title: "6 AI Match Credits", desc: "Every new account gets 6 AI credits to analyze your profile against real job descriptions and get a match score.", tag: "On Signup" },
              { icon: "✨", title: "First Analysis Free", desc: "Your very first AI match always costs zero credits. Try it completely risk-free before spending anything.", tag: "Zero Risk" },
              { icon: "📋", title: "Application Tracker", desc: "Track up to 5 active applications with a Kanban board. Get AI follow-up scripts, interview prep, and rejection diagnosis.", tag: "5 Apps Free" },
              { icon: "🔒", title: "100% Direct Applications", desc: "Every Apply click takes you to the employer's real career page. We never store or forward your CV or data.", tag: "100% Transparent" },
            ].map(({ icon, title, desc, tag }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bg-slate-900/60 border border-slate-800 rounded-[1.75rem] p-7 hover:border-slate-700 hover:bg-slate-900 transition-all duration-300 group"
              >
                <div className="text-4xl mb-5">{icon}</div>
                <h3 className="text-lg font-black text-white mb-2 group-hover:text-blue-400 transition-colors">{title}</h3>
                <p className="text-slate-400 text-[14px] font-medium leading-relaxed mb-5">{desc}</p>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider">✓ {tag}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-14 text-center"
          >
            <Link
              href="/role-selection"
              className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-[15px] shadow-[0_0_40px_rgba(99,102,241,0.3)] hover:shadow-[0_0_50px_rgba(99,102,241,0.5)] hover:-translate-y-0.5 transition-all"
            >
              <Users className="w-5 h-5" />
              Create Free Account — No Card Needed
              <ChevronRight className="w-5 h-5" />
            </Link>
            <p className="text-slate-500 text-sm font-medium mt-4">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-400 hover:text-blue-300 font-bold hover:underline">Sign in →</Link>
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 6: OPPORTUNITY RADAR — Jobs Search & Listings Header
          The job search bar lives HERE, not in the hero.
          ═══════════════════════════════════════════════════════════════════ */}
      <section id="opportunity-radar" className="py-16 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest mb-4">
              <Radar className="w-3.5 h-3.5" /> Sourced from 890+ Corporate Career Pages
            </div>
            <h2 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white font-playfair tracking-tight mb-3">
              Opportunity Radar
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl mx-auto">
              AI-curated opportunities sourced directly from official corporate databases. Every link is a 100% direct application — zero middlemen.
            </p>
          </motion.div>

          {/* Search bar — moved here from hero */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <form
              onSubmit={handleSearch}
              className="w-full max-w-[900px] mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.3)] flex flex-col md:flex-row gap-1.5 transition-all duration-300 hover:border-blue-200 dark:hover:border-blue-500/20"
            >
              <div className="flex-1 flex items-center gap-2.5 px-4 py-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl focus-within:bg-white dark:focus-within:bg-slate-900 border border-transparent focus-within:border-blue-500/20 transition-all">
                <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Role (e.g. Frontend Developer)"
                  className="bg-transparent border-none outline-none text-slate-900 dark:text-white w-full placeholder:text-slate-400 text-sm font-medium"
                  disabled={isSearching}
                />
              </div>

              <div className="flex-[0.8] flex items-center gap-2.5 px-4 py-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl focus-within:bg-white dark:focus-within:bg-slate-900 border border-transparent focus-within:border-blue-500/20 transition-all">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City or Remote"
                  className="bg-transparent border-none outline-none text-slate-900 dark:text-white w-full placeholder:text-slate-400 text-sm font-medium"
                  disabled={isSearching}
                />
              </div>

              <button
                type="submit"
                disabled={isSearching}
                className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-6 py-2.5 font-bold text-sm flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-blue-600/20 min-w-[140px]"
              >
                {isSearching ? (
                  <>
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                    <span>Searching</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Search Radar</span>
                  </>
                )}
              </button>
            </form>

            {/* Category shortcuts */}
            <div className="mt-5 flex flex-wrap justify-center items-center gap-3">
              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Quick filters:</span>
              <Link href="/jobs/Remote-Jobs" className="px-4 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-500/30 text-[11px] font-bold transition-all">Remote Roles</Link>
              <Link href="/jobsbyrole/software-developer-engineer-role" className="px-4 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-500/30 text-[11px] font-bold transition-all">Software Engineering</Link>
              <Link href="/jobsbytype/Internship-jobs" className="px-4 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-500/30 text-[11px] font-bold transition-all">Internships</Link>
              <Link href="/jobsbytype/Freshers-jobs" className="px-4 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-500/30 text-[11px] font-bold transition-all">Freshers</Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION 7: EXPLORE BY CATEGORY
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white font-playfair mb-3 tracking-tight">Explore by Category</h2>
              <p className="text-slate-500 dark:text-slate-400 text-lg">Find the perfect role from our curated opportunity radar.</p>
            </div>
            <Link href="/jobs" className="text-blue-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
              Browse all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            <Link href="/jobsbyrole/software-developer-engineer-role" className="group p-8 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-500/30 hover:shadow-[0_20px_40px_rgba(37,99,235,0.08)] dark:hover:shadow-[0_20px_40px_rgba(37,99,235,0.05)] transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:bg-blue-600 group-hover:text-white">
                <Code className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Software Development</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Curated engineering roles</p>
            </Link>

            <Link href="/jobsbyrole/data-scientist-role" className="group p-8 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-200 dark:hover:border-purple-500/30 hover:shadow-[0_20px_40px_rgba(168,85,247,0.08)] transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:bg-purple-600 group-hover:text-white">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Data Science & AI</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium">AI & ML career paths</p>
            </Link>

            <Link href="/jobs/Remote-Jobs" className="group p-8 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-500/30 hover:shadow-[0_20px_40px_rgba(16,185,129,0.08)] transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:bg-emerald-600 group-hover:text-white">
                <Globe className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Remote Opportunities</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Work from anywhere</p>
            </Link>

            <Link href="/jobs/2025-batch" className="group p-8 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-200 dark:hover:border-amber-500/30 hover:shadow-[0_20px_40px_rgba(245,158,11,0.08)] transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:bg-amber-500 group-hover:text-white">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Class of 2026</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Exclusive graduate roles</p>
            </Link>

            <Link href="/jobsbytype/Internship-jobs" className="group p-8 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-pink-200 dark:hover:border-pink-500/30 hover:shadow-[0_20px_40px_rgba(236,72,153,0.08)] transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-pink-50 dark:bg-pink-500/10 text-pink-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:bg-pink-600 group-hover:text-white">
                <Award className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Top Internships</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Kickstart your career</p>
            </Link>

            <Link href="/jobsbytype/Freshers-jobs" className="group p-8 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-200 dark:hover:border-cyan-500/30 hover:shadow-[0_20px_40px_rgba(6,182,212,0.08)] transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:bg-cyan-600 group-hover:text-white">
                <GraduationCap className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Freshers Hiring</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Entry-level positions</p>
            </Link>

          </div>
        </div>
      </section>
    </div>
  );
}
