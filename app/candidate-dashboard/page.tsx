"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
  Bookmark, Eye, TrendingUp, ChevronRight, Building2,
  MapPin, Clock, ExternalLink, Briefcase, Sparkles, Activity, Zap
} from 'lucide-react';

function calcCompletion(profile: any): number {
  if (!profile) return 0;
  const checks = [
    !!(profile.full_name),
    !!profile.phone,
    !!profile.location,
    !!profile.bio,
    !!profile.is_pro,
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

  useEffect(() => {
    const cached = localStorage.getItem('candidate');
    const user = cached ? JSON.parse(cached) : null;
    if (user) setProfile(user);

    const userId = user?.id || 'anonymous';
    const saved = JSON.parse(localStorage.getItem(`savedJobs_${userId}`) || '[]');
    setSavedCount(saved.length);

    const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    setViewedJobs(viewed.slice(0, 6));

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
          setAiMatches(res.data.data.slice(0, 4));
        }
      } catch (err) {}
      setMatchesLoading(false);
    };
    fetchMatches();
  }, []);

  const completion = calcCompletion(profile);
  const firstName = profile?.full_name?.split(' ')[0] || 'there';

  const stats = [
    {
      label: 'Saved Jobs',
      value: savedCount,
      icon: Bookmark,
      colorClass: 'bg-blue-50 text-blue-600 border-blue-100',
      link: '/candidate-dashboard/saved-jobs',
    },
    {
      label: 'Jobs Viewed',
      value: viewedJobs.length,
      icon: Eye,
      colorClass: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      link: null,
    },
    {
      label: 'Profile Strength',
      value: `${completion}%`,
      icon: TrendingUp,
      colorClass: 'bg-amber-50 text-amber-600 border-amber-100',
      link: '/candidate-dashboard/settings',
    },
  ];

  const formatDate = (d: string) => {
    if (!d) return 'Recently';
    const days = Math.ceil(Math.abs(Date.now() - new Date(d).getTime()) / 86400000);
    if (days <= 1) return 'Today';
    if (days < 7) return `${days}d ago`;
    if (days < 30) return `${Math.floor(days / 7)}w ago`;
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex flex-col gap-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-black text-slate-100 font-playfair tracking-tight mb-1.5 flex flex-wrap items-center gap-3">
          Welcome back, {firstName}! 👋
          {profile?.is_pro ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 border border-amber-200 text-amber-700 text-[13px] font-black uppercase tracking-widest rounded-full shadow-sm align-middle mt-1 md:mt-0">
              <Sparkles className="w-4 h-4" /> PRO Member
            </span>
          ) : (
            <Link 
              href="/pro"
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-[13px] font-black uppercase tracking-widest rounded-full shadow-sm align-middle mt-1 md:mt-0 transition-colors cursor-pointer group"
            >
              BASIC Member <span className="text-[10px] text-blue-600 font-bold group-hover:translate-x-0.5 transition-transform ml-1">Upgrade ⚡</span>
            </Link>
          )}
        </h1>
        <p className="text-[15px] font-medium text-slate-500">
          Here's your job search activity at a glance.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          const isClickable = !!stat.link;
          const card = (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm flex flex-col gap-4 ${
                isClickable ? 'cursor-pointer hover:-translate-y-1 hover:shadow-md hover:border-blue-200 transition-all duration-300' : ''
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${stat.colorClass}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <div className="text-4xl font-black text-slate-900">{stat.value}</div>
                <div className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mt-1">{stat.label}</div>
              </div>
            </motion.div>
          );
          return stat.link ? (
            <Link key={i} href={stat.link} className="block">
              {card}
            </Link>
          ) : (
            <div key={i}>{card}</div>
          );
        })}
      </div>

      {/* Recently Viewed Jobs */}
      <div className="bg-white border border-slate-200 rounded-[2rem] p-6 md:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-black text-slate-900">Recently Viewed Jobs</h2>
            <p className="text-[13px] text-slate-500 font-medium mt-0.5">
              Jobs you opened will appear here for quick access.
            </p>
          </div>
          <Link
            href="/jobs"
            className="text-[13px] font-bold text-blue-600 hover:underline flex items-center gap-1 shrink-0"
          >
            Browse More <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {viewedJobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 border border-blue-100">
              <Briefcase className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">No jobs viewed yet</h3>
            <p className="text-[14px] text-slate-500 mb-5">
              Start browsing — jobs you visit will show up here.
            </p>
            <Link
              href="/jobs"
              className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-blue-600 transition-colors shadow-sm text-[14px]"
            >
              Explore Jobs
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {viewedJobs.map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="group flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-sm transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shrink-0 p-1.5">
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/${job.image}`}
                    alt={job.title}
                    className="w-full h-full object-contain"
                    onError={(e: any) => { e.target.src = '/logo.webp'; }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[15px] font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {job.role}
                  </div>
                  <div className="flex items-center gap-3 text-[12px] text-slate-500 font-medium mt-0.5 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3 h-3" /> {job.title}
                    </span>
                    {job.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {job.location}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {formatDate(job.created_at)}
                    </span>
                  </div>
                </div>
                <Link
                  href={`/job/${job.id}/${job.slug || job.id}`}
                  className="shrink-0 w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* AI Analyzed Opportunities */}
      <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-400 fill-blue-400/20" /> My AI Matches
            </h2>
            <p className="text-[13px] text-slate-400 font-medium mt-0.5">
              Review your ATS scores and interview prep for jobs you've analyzed.
            </p>
          </div>
          <Link
            href="/jobs"
            className="text-[13px] font-bold text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-1 shrink-0"
          >
            Find Matches <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {matchesLoading ? (
          <div className="flex justify-center py-10">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : aiMatches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center relative z-10">
            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-4 border border-slate-700">
              <Activity className="w-8 h-8 text-slate-500" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No AI Analyses Yet</h3>
            <p className="text-[14px] text-slate-400 mb-5 max-w-sm">
              Use your credits to analyze jobs and get instant match scores, cover letters, and interview questions.
            </p>
            <Link
              href="/jobs"
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20 text-[14px]"
            >
              Analyze Jobs
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
            {aiMatches.map((match, i) => {
              const score = match.match_score;
              let colors = "bg-rose-500/10 border-rose-500/20 text-rose-400";
              if (score >= 80) colors = "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";
              else if (score >= 60) colors = "bg-amber-500/10 border-amber-500/20 text-amber-400";
              
              return (
                <Link key={match.id} href={`/job/${match.job.id}/${match.job.slug || match.job.id}?autoAnalyze=true`}>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="group bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-2xl p-5 transition-all cursor-pointer h-full flex flex-col"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex gap-3 items-center">
                        <div className="w-10 h-10 rounded-lg bg-white p-1 shrink-0 overflow-hidden">
                          <img
                            src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/${match.job.image}`}
                            alt={match.job.title}
                            className="w-full h-full object-contain"
                            onError={(e: any) => { e.target.src = '/logo.webp'; }}
                          />
                        </div>
                        <div>
                          <h4 className="text-[15px] font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">{match.job.role}</h4>
                          <p className="text-[12px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Building2 className="w-3 h-3" /> {match.job.title}
                          </p>
                        </div>
                      </div>
                      <div className={`px-2.5 py-1 rounded-lg ${colors} font-black text-[14px] flex items-center gap-1`}>
                        {score}% <span className="text-[10px] uppercase font-bold text-slate-500 ml-0.5">Match</span>
                      </div>
                    </div>
                    <p className="text-[13px] text-slate-400 line-clamp-2 mt-2 leading-relaxed flex-1">
                      {match.ai_feedback}
                    </p>
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

      {/* CTA Banner */}
      {!profile?.is_pro ? (
        <div className="relative bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 rounded-[2rem] p-8 md:p-10 text-white overflow-hidden shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-300 text-xs font-bold uppercase tracking-widest mb-3 border border-blue-500/30">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Unlock Premium
              </div>
              <h3 className="text-2xl font-black mb-2 font-playfair">Upgrade to PRO Status</h3>
              <p className="text-blue-200/80 font-medium text-[15px] max-w-xl">
                Get unlimited AI resume matches, tailored cover letters, and bypass ATS filters to land your dream job faster.
              </p>
            </div>
            <Link
              href="/pro"
              className="px-7 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-black hover:shadow-xl hover:scale-105 transition-all whitespace-nowrap text-[14px] text-center shadow-[0_0_20px_rgba(245,158,11,0.4)]"
            >
              Upgrade Now
            </Link>
          </div>
          <div className="absolute right-0 top-0 w-72 h-72 bg-blue-500 opacity-20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          <div className="absolute left-1/4 bottom-0 w-48 h-48 bg-indigo-400 opacity-20 rounded-full blur-3xl pointer-events-none" />
        </div>
      ) : (
        <div className="relative bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-900 rounded-[2rem] p-8 md:p-10 text-white overflow-hidden shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold uppercase tracking-widest mb-3 border border-emerald-500/30">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> PRO Active
              </div>
              <h3 className="text-2xl font-black mb-2 font-playfair">Ready for your next opportunity?</h3>
              <p className="text-emerald-100/80 font-medium text-[15px] max-w-xl">
                Your profile is boosted. Explore thousands of fresh premium job listings curated just for you.
              </p>
            </div>
            <Link
              href="/jobs"
              className="px-7 py-3.5 bg-white text-slate-900 rounded-xl font-black hover:shadow-xl hover:scale-105 transition-all whitespace-nowrap text-[14px] text-center"
            >
              Browse Premium Jobs →
            </Link>
          </div>
          <div className="absolute right-0 top-0 w-72 h-72 bg-emerald-500 opacity-10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          <div className="absolute left-1/4 bottom-0 w-48 h-48 bg-teal-400 opacity-10 rounded-full blur-3xl pointer-events-none" />
        </div>
      )}

    </div>
  );
}
