"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
  Bookmark, Eye, ChevronRight, Building2,
  MapPin, Clock, ExternalLink, Briefcase, Sparkles, Activity, Zap, Shield,
  WifiOff, RefreshCw, Target, Award, FileText, LayoutDashboard, CheckSquare, AlertTriangle
} from 'lucide-react';

function calcCompletion(profile: any): number {
  if (!profile) return 0;
  const checks = [
    !!(profile.full_name),
    !!profile.phone,
    !!profile.location,
    !!profile.bio,
    !!(Array.isArray(profile.skills) ? profile.skills.length > 0 : !!profile.skills),
    !!profile.profile_image,
    !!profile.resume,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

export default function CandidateDashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [savedCount, setSavedCount] = useState(0);
  const [viewedJobs, setViewedJobs] = useState<any[]>([]);
  const [aiMatches, setAiMatches] = useState<any[]>([]);
  const [matchesLoading, setMatchesLoading] = useState(true);
  const [matchesError, setMatchesError] = useState(false);
  const [latestResumeHealth, setLatestResumeHealth] = useState<any>(null);
  const [healthLoading, setHealthLoading] = useState(true);
  
  // Live Kanban stage metrics
  const [trackerCounts, setTrackerCounts] = useState({
    applied: 0,
    interviewing: 0,
    offered: 0,
    rejected: 0,
    total: 0
  });

  useEffect(() => {
    // 1. Instant load from cache
    const cached = localStorage.getItem('candidate');
    const user = cached ? JSON.parse(cached) : null;
    if (user) setProfile(user);

    const userId = user?.id || 'anonymous';
    const saved = JSON.parse(localStorage.getItem(`savedJobs_${userId}`) || '[]');
    setSavedCount(saved.length);

    const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    setViewedJobs(viewed.slice(0, 5));

    // 2. Fetch fresh profile to update credits, pro status, and health score
    const fetchFreshProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/candidate/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success && res.data.user) {
          setProfile(res.data.user);
          localStorage.setItem('candidate', JSON.stringify(res.data.user));
        }
      } catch (err) {
        console.error('Failed to sync latest profile data', err);
      }
    };
    fetchFreshProfile();

    const fetchMatches = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setMatchesLoading(false);
        return;
      }
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/candidate/my-ai-matches`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setAiMatches(res.data.data.slice(0, 3));
        }
        setMatchesError(false);
      } catch (err) {
        console.error('Failed to load AI matches', err);
        setMatchesError(true);
      }
      setMatchesLoading(false);
    };

    const fetchTrackerStats = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/tracker`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          const trackedJobs = res.data.data || [];
          setTrackerCounts({
            applied: trackedJobs.filter((j: any) => j.status === 'applied').length,
            interviewing: trackedJobs.filter((j: any) => j.status === 'interviewing').length,
            offered: trackedJobs.filter((j: any) => j.status === 'offered').length,
            rejected: trackedJobs.filter((j: any) => j.status === 'rejected').length,
            total: trackedJobs.length
          });
        }
      } catch (err) {
        console.error('Failed to load tracker stats', err);
      }
    };

    const fetchLatestHealth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setHealthLoading(false);
        return;
      }
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/candidate/resume-health/latest`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success && res.data.data) {
          setLatestResumeHealth(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load latest resume health', err);
      }
      setHealthLoading(false);
    };

    fetchMatches();
    fetchTrackerStats();
    fetchLatestHealth();
  }, []);

  const completion = calcCompletion(profile);
  const firstName = profile?.full_name?.split(' ')[0] || 'there';

  const formatDate = (d: string) => {
    if (!d) return 'Recently';
    const days = Math.ceil(Math.abs(Date.now() - new Date(d).getTime()) / 86400000);
    if (days <= 1) return 'Today';
    if (days < 7) return `${days}d ago`;
    if (days < 30) return `${Math.floor(days / 7)}w ago`;
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex flex-col gap-8 font-sora">
      
      {/* ── HEADER TITLE BAR ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white font-playfair tracking-tight flex items-center gap-2">
            Welcome, {firstName}! 👋
          </h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
            Analyze your progress, bypass recruiter filters, and scale your active pipeline.
          </p>
        </div>
        
        {profile?.is_pro ? (
          <span className="inline-flex items-center gap-1.5 px-4.5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-amber-500/20">
            <Sparkles className="w-4 h-4 text-white" /> PRO Member
          </span>
        ) : (
          <Link
            href="/pro"
            className="inline-flex items-center gap-1.5 px-4.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5"
          >
            Upgrade to PRO <Zap className="w-3.5 h-3.5 fill-white" />
          </Link>
        )}
      </div>

      {/* ── MAIN 8:4 SaaS WORKSPACE GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ================= LEFT MAIN WORKSPACE COLUMN (lg:col-span-8) ================= */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* A. Core SaaS Verification & Reminder Panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-36 h-36 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" /> Workspace Curation Active
                </span>
                <h3 className="text-[16px] font-black text-white">Direct Sourcing Portals Sourced</h3>
                <p className="text-xs text-slate-400 font-semibold leading-relaxed max-w-lg">
                  Every application routes you directly to official company career domains. We do not gatekeep or harvest candidate data.
                </p>
              </div>
              <div className="flex flex-row md:flex-col items-center md:items-end gap-3 justify-between w-full md:w-auto border-t border-slate-800 md:border-none pt-4 md:pt-0">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider rounded-lg">
                  <span className="w-1.5 h-1.5 bg-emerald-450 rounded-full animate-ping" />
                  Live Sync
                </span>
                <span className="text-[11px] text-slate-550 font-bold uppercase tracking-wider text-slate-500">100% Direct Apply</span>
              </div>
            </div>
            
            {/* Quick SaaS Verification Badges */}
            <div className="grid grid-cols-3 gap-3 border-t border-slate-850 pt-5 mt-5 text-left">
              {[
                { label: "Parsed Resume", ok: !!profile?.resume, msg: profile?.resume ? "Optimized ✓" : "Upload Missing ⚠", href: "/candidate-dashboard/settings" },
                { label: "Profile Depth", ok: completion >= 80, msg: completion >= 80 ? "Sufficient ✓" : `${completion}% Strength ⚠`, href: "/candidate-dashboard/settings" },
                { label: "Kanban Pipelines", ok: trackerCounts.total > 0, msg: trackerCounts.total > 0 ? `${trackerCounts.total} Active ✓` : "0 Tracked ⚠", href: "/candidate-dashboard/tracker" }
              ].map((item, idx) => (
                <Link key={idx} href={item.href} className="group bg-slate-950/40 hover:bg-slate-950/80 border border-slate-850 rounded-2xl p-3.5 transition-all">
                  <span className="block text-[9px] font-bold text-slate-550 uppercase tracking-widest text-slate-500">{item.label}</span>
                  <span className={`block text-xs font-black mt-1 group-hover:text-blue-400 transition-colors ${item.ok ? 'text-emerald-400' : 'text-amber-500'}`}>{item.msg}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* B. Dynamic Interactive Kanban Tracker Widget */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <div className="flex justify-between items-center mb-6 text-left">
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-500" /> Career Kanban Pipeline
                </h3>
                <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-0.5">Automate follow-up invite scripts and company interview guides stage-by-stage.</p>
              </div>
              <Link href="/candidate-dashboard/tracker" className="text-xs font-black text-blue-600 hover:text-blue-500 flex items-center gap-1">
                View Tracker <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Horizontal Kanban stage indicators */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { stage: "applied" as const, name: "Applied", count: trackerCounts.applied, color: "border-l-blue-500 text-blue-500 bg-blue-500/5 hover:border-blue-500/30" },
                { stage: "interviewing" as const, name: "Interviewing", count: trackerCounts.interviewing, color: "border-l-indigo-500 text-indigo-500 bg-indigo-500/5 hover:border-indigo-500/30" },
                { stage: "offered" as const, name: "Offered", count: trackerCounts.offered, color: "border-l-emerald-500 text-emerald-500 bg-emerald-500/5 hover:border-emerald-500/30" },
                { stage: "rejected" as const, name: "Rejected", count: trackerCounts.rejected, color: "border-l-rose-500 text-rose-500 bg-rose-500/5 hover:border-rose-500/30" }
              ].map((column) => (
                <Link key={column.stage} href="/candidate-dashboard/tracker" className={`border border-slate-200 dark:border-slate-800 border-l-4 ${column.color} rounded-2xl p-4 transition-all duration-300 hover:scale-[1.02] text-left block`}>
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-450 dark:text-slate-400 block">{column.name}</span>
                  <div className="flex justify-between items-baseline mt-2">
                    <span className="text-2xl font-black text-slate-900 dark:text-white leading-none">{column.count}</span>
                    <span className="text-[9px] font-bold text-slate-405 dark:text-slate-500 uppercase tracking-widest">Active</span>
                  </div>
                </Link>
              ))}
            </div>

            {trackerCounts.total === 0 && (
              <div className="mt-5 p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl text-left flex gap-3 items-start">
                <Sparkles className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white">Track Your First Role to Get AI Follow-ups</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Paste any targeted job descriptions to calculate keyword deficiencies and get dynamic STAR interview preparation question banks.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* C. Flagship AI Compatibility Matches Feed */}
          <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-6 md:p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            
            <div className="flex items-center justify-between mb-6 relative z-10 text-left">
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-400 fill-blue-400/20" /> ATS Compatibility Matches
                </h2>
                <p className="text-[13px] text-slate-400 font-medium mt-0.5">
                  Review calculated match densities, custom cover letter downloads, and STAR questions.
                </p>
              </div>
              <Link href="/jobs" className="text-[13px] font-bold text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1 shrink-0">
                Find Vacancies <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {matchesLoading ? (
              <div className="flex justify-center py-10">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : matchesError ? (
              <div className="flex flex-col items-center justify-center py-12 text-center relative z-10">
                <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center mb-4 border border-rose-500/20">
                  <WifiOff className="w-8 h-8 text-rose-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Unable to load matches</h3>
                <p className="text-[14px] text-slate-400 mb-5 max-w-sm">Could not connect to the database. Please try again.</p>
                <button
                  onClick={() => window.location.reload()}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 transition-colors shadow-lg text-[14px]"
                >
                  <RefreshCw className="w-4 h-4" /> Retry
                </button>
              </div>
            ) : aiMatches.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center relative z-10">
                <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-4 border border-slate-700">
                  <Activity className="w-8 h-8 text-slate-500" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">No AI Compatibility Scans</h3>
                <p className="text-[14px] text-slate-400 mb-5 max-w-sm">Use your active wallet credits on any job page to run parsing check comparisons.</p>
                <Link href="/jobs" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-550 transition-colors shadow-lg text-[14px]">
                  Explore Job Postings
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                {aiMatches.map((match, i) => {
                  const score = match.match_score;
                  let colors = "bg-rose-500/10 border-rose-500/20 text-rose-400";
                  let radial = "stroke-rose-500";
                  if (score >= 80) {
                    colors = "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";
                    radial = "stroke-emerald-500";
                  } else if (score >= 60) {
                    colors = "bg-amber-500/10 border-amber-500/20 text-amber-400";
                    radial = "stroke-amber-500";
                  }
                  
                  return (
                    <Link key={match.id} href={`/job/${match.job.id}/${match.job.slug || match.job.id}?autoAnalyze=true`}>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="group bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-2xl p-5 transition-all cursor-pointer h-full flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex justify-between items-start mb-3 text-left">
                            <div className="flex gap-3 items-center min-w-0">
                              <div className="w-10 h-10 rounded-lg bg-white p-1 shrink-0 overflow-hidden">
                                <img
                                  src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/${match.job.image}`}
                                  alt={match.job.title}
                                  className="w-full h-full object-contain"
                                  onError={(e: any) => { e.target.src = '/logo.webp'; }}
                                />
                              </div>
                              <div className="min-w-0">
                                <h4 className="text-[15px] font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">{match.job.role}</h4>
                                <p className="text-[12px] text-slate-400 flex items-center gap-1 mt-0.5 line-clamp-1">
                                  <Building2 className="w-3 h-3 shrink-0" /> {match.job.title}
                                </p>
                              </div>
                            </div>
                            
                            {/* Visual Score Ring */}
                            <div className="relative w-11 h-11 shrink-0 flex items-center justify-center">
                              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                <circle cx="18" cy="18" r="16" fill="none" stroke="#334155" strokeWidth="2.5" />
                                <circle cx="18" cy="18" r="16" fill="none" className={radial} strokeWidth="2.5" strokeDasharray="100" strokeDashoffset={100 - score} strokeLinecap="round" />
                              </svg>
                              <span className="absolute text-[11px] font-black text-white">{score}%</span>
                            </div>
                          </div>
                          <p className="text-[13px] text-slate-450 text-slate-450 text-slate-400 line-clamp-2 mt-2 leading-relaxed text-left">
                            {match.ai_feedback}
                          </p>
                        </div>
                        
                        <div className="mt-4 pt-3 border-t border-slate-700/50 flex justify-between items-center text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                          <span>{formatDate(match.updated_at)}</span>
                          <span className="text-blue-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                            Review Prep <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ================= RIGHT WORKSPACE SIDEBAR COLUMN (lg:col-span-4) ================= */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* A. Unified ATS Resume Monitor Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none" />
            
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest block flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Resume Health Score
              </span>
              {latestResumeHealth && (
                <span className="text-[9px] font-bold text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-100 dark:border-slate-700">
                  Last Scanned
                </span>
              )}
            </div>

            {healthLoading ? (
              <div className="flex flex-col items-center justify-center py-10">
                <div className="w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mb-3" />
                <span className="text-xs text-slate-400 font-bold">Loading Score...</span>
              </div>
            ) : latestResumeHealth ? (
              <>
                <div className="flex items-center gap-5 mb-5">
                  {/* Real Score Gauge */}
                  <div className="relative w-18 h-18 shrink-0 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="#1e293b" strokeWidth="7" />
                      <motion.circle 
                        initial={{ strokeDashoffset: 264 }}
                        animate={{ strokeDashoffset: 264 - (264 * Math.round((latestResumeHealth.overall_score / 60) * 100)) / 100 }}
                        transition={{ duration: 1.2 }}
                        cx="50" cy="50" r="42" fill="none" 
                        stroke={Math.round((latestResumeHealth.overall_score / 60) * 100) >= 75 ? "#10b981" : Math.round((latestResumeHealth.overall_score / 60) * 100) >= 50 ? "#f59e0b" : "#f43f5e"} 
                        strokeWidth="7" 
                        strokeDasharray="264" 
                        strokeLinecap="round" 
                      />
                    </svg>
                    <span className="absolute text-lg font-black text-slate-900 dark:text-white">
                      {Math.round((latestResumeHealth.overall_score / 60) * 100)}%
                    </span>
                  </div>
                  
                  <div>
                    <h4 className="font-black text-slate-900 dark:text-white leading-tight">
                      {Math.round((latestResumeHealth.overall_score / 60) * 100) >= 75 ? "Excellent Match" : Math.round((latestResumeHealth.overall_score / 60) * 100) >= 50 ? "Needs Improvement" : "Critical Fixes Needed"}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-semibold line-clamp-2">
                      {latestResumeHealth.summary !== '[Locked for PRO users]' ? latestResumeHealth.summary : "Unlock full analysis with PRO."}
                    </p>
                  </div>
                </div>

                {latestResumeHealth.top_fixes && latestResumeHealth.top_fixes.length > 0 && (
                  <div className="space-y-2 border-t border-slate-100 dark:border-slate-800/80 pt-4 mb-5">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Top Fixes Needed</span>
                    {latestResumeHealth.top_fixes.slice(0, 2).map((fix: string, idx: number) => (
                      <div key={idx} className="flex gap-2 items-start">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400 line-clamp-2 leading-snug">{fix}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <Link href="/resume-health" className="flex-1 py-3 bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-xs font-black rounded-xl transition-all shadow-sm flex items-center justify-center border border-rose-100 dark:border-rose-500/20">
                    Full Report
                  </Link>
                  <Link href="/resume-health?action=rescan" className="flex-1 py-3 bg-slate-900 hover:bg-slate-850 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-black rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5" /> 
                    {profile?.is_pro ? "Re-scan" : "Re-scan (-1 ⚡)"}
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-5 mb-5">
                  <div className="relative w-18 h-18 shrink-0 flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-full border border-slate-100 dark:border-slate-700">
                    <Activity className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 dark:text-white leading-tight">No Scan Found</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-semibold leading-relaxed">
                      Find out if your resume is getting auto-rejected by ATS bots.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2 border-t border-slate-100 dark:border-slate-800/80 pt-4 text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-5">
                  <div className="flex gap-2 items-center"><CheckSquare className="w-3.5 h-3.5 text-emerald-500" /> Checks ATS Parseability</div>
                  <div className="flex gap-2 items-center"><CheckSquare className="w-3.5 h-3.5 text-emerald-500" /> Checks Keyword Density</div>
                  <div className="flex gap-2 items-center"><CheckSquare className="w-3.5 h-3.5 text-emerald-500" /> Identifies Missing Skills</div>
                </div>

                <Link href="/resume-health" className="w-full py-3.5 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white text-xs font-black rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> 
                  {profile?.is_pro || !profile?.is_first_resume_health_free_used ? "Analyze Resume — Free" : "Analyze Resume (-1 ⚡)"}
                </Link>
              </>
            )}
          </div>

          {/* B. Glowing Credits & Refill B2C Balance Card */}
          <div className={`rounded-[2rem] p-6 shadow-md flex flex-col justify-between text-left relative overflow-hidden transition-all duration-300 ${
            profile?.is_pro
              ? 'bg-gradient-to-br from-slate-950 via-amber-950/20 to-slate-950 border border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.15)] hover:border-amber-500/60'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-200'
          }`}>
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />
            
            <div className="flex justify-between items-start mb-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${
                profile?.is_pro
                  ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-md shadow-amber-500/10 animate-pulse'
                  : 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-650 dark:text-indigo-400 border-indigo-100 dark:border-indigo-850'
              }`}>
                <Zap className="w-5.5 h-5.5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">AI Wallet balance</span>
            </div>

            <div>
              <div className={`text-3.5xl font-black leading-none ${profile?.is_pro ? 'text-amber-400' : 'text-slate-900 dark:text-white'}`}>
                {profile?.is_pro ? 'Unlimited' : `${profile?.ai_credits !== undefined ? profile.ai_credits : 6} Left`}
              </div>
              <div className="text-[11px] font-bold text-slate-455 text-slate-450 text-slate-400 uppercase tracking-widest mt-1.5">
                {profile?.is_pro ? 'SaaS Unlimited Active' : 'AI Match scan credits'}
              </div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed">
                {profile?.is_pro 
                  ? "Enjoy infinite technical checks, resume optimizer parses, and Cover Letter vector downloads." 
                  : "Refill credits for quick match diagnostics or get a full PRO pass for unlimited scans."}
              </p>
            </div>

            <Link href="/pro" className={`w-full py-3.5 text-center text-xs font-black rounded-xl transition-all shadow-md mt-5 block ${
              profile?.is_pro 
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/10'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/10'
            }`}>
              {profile?.is_pro ? "Manage PRO Plan" : "Refill Credits (₹29)"}
            </Link>
          </div>

          {/* C. Sleek Direct Sourcing Activity Timeline Log */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none" />
            
            <div className="flex justify-between items-center mb-5">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block flex items-center gap-1">
                <Bookmark className="w-3.5 h-3.5" /> Sourcing Activity Log
              </span>
              <span className="px-2 py-0.5 text-[9px] font-black text-slate-450 dark:text-slate-400 bg-slate-100 dark:bg-slate-850 rounded">View History</span>
            </div>

            {viewedJobs.length === 0 ? (
              <div className="py-8 text-center">
                <Briefcase className="w-8 h-8 text-slate-300 mx-auto mb-2.5" />
                <p className="text-xs text-slate-500 font-semibold">Activity log empty. Visited direct jobs will record here.</p>
              </div>
            ) : (
              <div className="space-y-4 relative pl-3.5 border-l border-slate-150 dark:border-slate-800">
                {viewedJobs.map((job) => (
                  <div key={job.id} className="relative group/timeline">
                    {/* Circle marker */}
                    <div className="absolute -left-[19px] top-1.5 w-2 h-2 rounded-full bg-slate-300 group-hover/timeline:bg-blue-500 transition-colors border-2 border-white dark:border-slate-900" />
                    
                    <div className="min-w-0">
                      <Link href={`/job/${job.id}/${job.slug || job.id}`} className="block">
                        <span className="block text-[13px] font-black text-slate-950 dark:text-white line-clamp-1 group-hover/timeline:text-blue-500 transition-colors leading-tight">
                          {job.role}
                        </span>
                        <span className="block text-[11px] text-slate-500 font-medium mt-0.5 truncate">
                          {job.title} · {job.location || 'Remote'}
                        </span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-400">
              <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-blue-400" /> Direct Curation</span>
              <Link href="/jobs" className="text-blue-500 hover:underline">Find Jobs</Link>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

