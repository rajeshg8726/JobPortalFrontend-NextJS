"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, FileText, ChevronLeft, ChevronRight, X,
  ArrowRight, ShieldCheck, AlertCircle, HelpCircle,
  TrendingUp, Users2, Star, Calendar, RefreshCw
} from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const authH = () => ({
  'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
  'Accept': 'application/json',
  'Content-Type': 'application/json',
});

type ResumeCheck = {
  id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  overall_score: number;
  raw_json: any;
  created_at: string;
};

export default function ResumeTrackerPage() {
  const [checks, setChecks] = useState<ResumeCheck[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Dashboard stats
  const [stats, setStats] = useState<any>({
    totalChecks: 0,
    uniqueUsers: 0,
    avgScore: 0,
    goodCount: 0,
    warnCount: 0,
    poorCount: 0
  });

  // Selected check for drawer
  const [selectedCheck, setSelectedCheck] = useState<ResumeCheck | null>(null);

  // Fetch checks
  const fetchChecks = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      ...(search && { search }),
    });
    try {
      const res = await fetch(`${API}/api/admin/resume-checks?${params}`, { headers: authH() });
      const data = await res.json();
      if (data.success) {
        setChecks(data.checks);
        setTotal(data.total);
        setTotalPages(data.totalPages ?? 1);
      }
    } catch {}
    setLoading(false);
  }, [page, search]);

  // Fetch summary stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/admin/stats`, { headers: authH() });
      const data = await res.json();
      if (data.success && data.stats) {
        setStats({
          totalChecks: data.stats.resumeTotalChecks ?? 0,
          uniqueUsers: data.stats.resumeUniqueUsers ?? 0,
          avgScore: data.stats.resumeAvgScore ?? 0,
          goodCount: data.stats.resumeScoreGood ?? 0,
          warnCount: data.stats.resumeScoreWarning ?? 0,
          poorCount: data.stats.resumeScorePoor ?? 0
        });
      }
    } catch {}
  }, []);

  useEffect(() => {
    fetchChecks();
  }, [fetchChecks]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const formatDate = (d: string) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 42) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 18) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 42) return 'Good';
    if (score >= 18) return 'Warning';
    return 'Poor';
  };

  // Dimensions key label mapping
  const dimensionLabels: Record<string, string> = {
    ats_parseability: 'ATS Parseability',
    contact_info: 'Contact Information',
    section_structure: 'Section Structure',
    keyword_density: 'Keyword Density',
    achievements: 'Measurable Achievements',
    formatting: 'Formatting & Length'
  };

  return (
    <div className="flex flex-col gap-6 font-sora relative">
      
      {/* Drawer Overlay */}
      <AnimatePresence>
        {selectedCheck && (
          <>
            {/* Dark Background Fade */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCheck(null)}
              className="fixed inset-0 bg-black z-40"
            />

            {/* Sidebar drawer content */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full md:max-w-2xl bg-white shadow-2xl z-50 flex flex-col h-full border-l border-slate-100"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-base">Resume Health Report</h3>
                    <p className="text-[12px] text-slate-500 font-semibold">{selectedCheck.user_name} • {selectedCheck.user_email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCheck(null)}
                  className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                
                {/* Score Section */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex flex-col sm:flex-row items-center gap-6">
                  {/* Gauge */}
                  <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle cx="64" cy="64" r="52" stroke="#e2e8f0" strokeWidth="8" fill="none" />
                      <circle
                        cx="64"
                        cy="64"
                        r="52"
                        stroke={selectedCheck.overall_score >= 42 ? "#10b981" : selectedCheck.overall_score >= 18 ? "#f59e0b" : "#ef4444"}
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${(selectedCheck.overall_score / 60) * 326.7} 326.7`}
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute text-center">
                      <span className="text-2xl font-black text-slate-800 leading-none">{selectedCheck.overall_score}</span>
                      <span className="block text-[11px] text-slate-400 font-bold uppercase mt-0.5">out of 60</span>
                    </div>
                  </div>

                  {/* Classification details */}
                  <div className="flex-1 flex flex-col gap-2 text-center sm:text-left">
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <span className={`px-3 py-1 rounded-full text-xs font-black border uppercase tracking-wider ${getScoreColor(selectedCheck.overall_score)}`}>
                        {getScoreBadge(selectedCheck.overall_score)} Quality
                      </span>
                      <span className="text-slate-400 text-xs font-semibold">
                        Checked {formatDate(selectedCheck.created_at)}
                      </span>
                    </div>
                    <p className="text-[13px] text-slate-500 font-semibold leading-relaxed">
                      {selectedCheck.raw_json?.summary || "No description provided."}
                    </p>
                  </div>
                </div>

                {/* 6 Dimensions Breakdown */}
                <div className="flex flex-col gap-4">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Dimension Scores</h4>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {selectedCheck.raw_json?.dimensions && 
                      Object.entries(selectedCheck.raw_json.dimensions).map(([key, dimVal]: [string, any]) => {
                        const score = dimVal?.score ?? 0;
                        const max = dimVal?.max ?? 10;
                        const label = dimensionLabels[key] || key.replace('_', ' ');
                        
                        let colorBar = 'bg-rose-500';
                        let colorBg = 'bg-rose-50 border-rose-100 text-rose-700';
                        if (score >= 7) {
                          colorBar = 'bg-emerald-500';
                          colorBg = 'bg-emerald-50 border-emerald-100 text-emerald-700';
                        } else if (score >= 4) {
                          colorBar = 'bg-amber-500';
                          colorBg = 'bg-amber-50 border-amber-100 text-amber-700';
                        }

                        return (
                          <div key={key} className="p-4 rounded-xl border border-slate-100 hover:border-slate-200 bg-white shadow-sm flex flex-col gap-3">
                            <div className="flex justify-between items-center">
                              <span className="text-[13px] font-black text-slate-800">{label}</span>
                              <span className={`px-2 py-0.5 border text-xs font-black rounded ${colorBg}`}>
                                {score}/{max}
                              </span>
                            </div>
                            
                            {/* Progress bar */}
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                              <div className={`h-full rounded-full ${colorBar}`} style={{ width: `${(score / max) * 100}%` }} />
                            </div>

                            {/* AI Feedback */}
                            <p className="text-[12px] text-slate-500 font-semibold leading-relaxed italic">
                              "{dimVal?.feedback || 'No detailed feedback.'}"
                            </p>
                          </div>
                        );
                      })
                    }
                  </div>
                </div>

                {/* Top Fixes */}
                {selectedCheck.raw_json?.top_fixes && selectedCheck.raw_json.top_fixes.length > 0 && (
                  <div className="flex flex-col gap-3">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Recommended Action Items</h4>
                    <div className="bg-amber-50/30 rounded-2xl p-5 border border-amber-200/50 flex flex-col gap-3">
                      {selectedCheck.raw_json.top_fixes.map((fix: string, idx: number) => (
                        <div key={idx} className="flex gap-3 items-start">
                          <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-extrabold shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="text-[12.5px] text-slate-600 font-bold leading-relaxed">{fix}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Resume Checker Log</h1>
          <p className="text-[13px] text-slate-500 font-medium mt-0.5">
            Track user interactions and ATS readiness scores.
          </p>
        </div>
        <button
          onClick={() => { fetchChecks(); fetchStats(); }}
          className="flex items-center gap-1.5 px-3 py-2 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 rounded-xl font-bold text-[12px] shadow-sm transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Data
        </button>
      </div>

      {/* Metrics Headers */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total checks */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{stats.totalChecks.toLocaleString()}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Total Checks</div>
          </div>
        </div>

        {/* Unique users */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <Users2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{stats.uniqueUsers.toLocaleString()}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Unique Users</div>
          </div>
        </div>

        {/* Avg score */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{stats.avgScore}/60</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Average Score</div>
          </div>
        </div>

        {/* Score Tiers Quality */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col justify-center gap-1.5 min-h-[76px]">
          <div className="flex items-center justify-between text-[11px] font-bold text-emerald-600 leading-tight">
            <span>Good Tiers (42+):</span>
            <span>{stats.goodCount} checks</span>
          </div>
          <div className="flex items-center justify-between text-[11px] font-bold text-amber-600 leading-tight">
            <span>Warning Tiers (18-41):</span>
            <span>{stats.warnCount} checks</span>
          </div>
          <div className="flex items-center justify-between text-[11px] font-bold text-rose-600 leading-tight">
            <span>Poor Tiers (&lt;18):</span>
            <span>{stats.poorCount} checks</span>
          </div>
        </div>
      </div>

      {/* Control bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search checks by candidate name or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-[14px] text-slate-700 placeholder-slate-400 outline-none font-medium"
          />
          {search && (
            <button onClick={() => setSearch('')}>
              <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
            </button>
          )}
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        ) : checks.length === 0 ? (
          <div className="py-20 text-center text-slate-400 font-medium">
            No resume checks found{search ? ` for "${search}"` : ''}.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px] min-w-[720px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-6 py-3.5 font-bold text-slate-500 uppercase tracking-wider text-[11px]">Candidate</th>
                  <th className="px-4 py-3.5 font-bold text-slate-500 uppercase tracking-wider text-[11px] text-center">ATS Score</th>
                  <th className="px-4 py-3.5 font-bold text-slate-500 uppercase tracking-wider text-[11px] text-center">Quality Tier</th>
                  <th className="px-4 py-3.5 font-bold text-slate-500 uppercase tracking-wider text-[11px]">Check Date</th>
                  <th className="px-6 py-3.5 font-bold text-slate-500 uppercase tracking-wider text-[11px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {checks.map((check, i) => (
                  <tr
                    key={check.id}
                    className={`border-b border-slate-50 hover:bg-indigo-50/20 transition-colors ${i % 2 !== 0 ? 'bg-slate-50/40' : ''}`}
                  >
                    {/* Candidate Details */}
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-bold text-slate-900 leading-tight">{check.user_name || 'Candidate'}</div>
                        <div className="text-slate-500 text-[11.5px] font-medium mt-0.5">{check.user_email}</div>
                      </div>
                    </td>

                    {/* Overall Score */}
                    <td className="px-4 py-4 text-center">
                      <span className="font-black text-slate-800 text-[14px]">
                        {check.overall_score}
                      </span>
                      <span className="text-slate-400 font-bold text-[10.5px]">/60</span>
                    </td>

                    {/* Tier badge */}
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border tracking-wider ${getScoreColor(check.overall_score)}`}>
                        {getScoreBadge(check.overall_score)}
                      </span>
                    </td>

                    {/* Check Date */}
                    <td className="px-4 py-4 text-slate-500 font-medium whitespace-nowrap">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {formatDate(check.created_at)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedCheck(check)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[11.5px] border border-indigo-200 transition-all cursor-pointer"
                      >
                        View Analysis <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50">
            <span className="text-[13px] text-slate-500 font-medium">
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
