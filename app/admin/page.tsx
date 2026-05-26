"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Briefcase, Users2, Building2, TrendingUp,
  Clock, MapPin, ArrowRight, Plus, IndianRupee,
  Sparkles, CheckCircle, Percent, ArrowUpRight
} from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const adminHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
  'Accept': 'application/json',
});

export default function AdminOverviewPage() {
  const [stats, setStats]                     = useState<any>(null);
  const [recentJobs, setRecentJobs]           = useState<any[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [loading, setLoading]                 = useState(true);

  useEffect(() => {
    fetch(`${API}/api/admin/stats`, { headers: adminHeaders() })
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setStats(d.stats);
          setRecentJobs(d.recentJobs || []);
          setRecentTransactions(d.recentTransactions || []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const OPERATIONAL_CARDS = [
    { label: 'Total Jobs',       key: 'totalJobs',       icon: Briefcase,  color: 'bg-blue-50 text-blue-600 border-blue-100' },
    { label: 'Candidates',       key: 'totalCandidates', icon: Users2,     color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { label: 'Employers',        key: 'totalEmployers',  icon: Building2,  color: 'bg-amber-50 text-amber-600 border-amber-100' },
    { label: 'Jobs This Week',   key: 'jobsThisWeek',    icon: TrendingUp, color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
  ];

  const FINANCIAL_CARDS = [
    { 
      label: 'Total Revenue', 
      value: stats ? `₹${(stats.totalRevenue || 0).toLocaleString('en-IN')}` : '₹0', 
      subtitle: `PRO: ₹${(stats?.proRevenue || 0).toLocaleString('en-IN')} | Topups: ₹${(stats?.topupRevenue || 0).toLocaleString('en-IN')}`,
      icon: IndianRupee, 
      color: 'bg-gradient-to-br from-amber-500/10 to-orange-500/10 text-amber-600 border-amber-200/50' 
    },
    { 
      label: 'Active PRO Users', 
      value: stats ? stats.totalPro : 0, 
      subtitle: `${stats?.totalProPurchases || 0} upgrades all-time`,
      icon: Sparkles, 
      color: 'bg-gradient-to-br from-indigo-500/10 to-purple-500/10 text-indigo-600 border-indigo-200/50' 
    },
    { 
      label: 'Top-Up Purchases', 
      value: stats ? stats.totalTopupPurchases : 0, 
      subtitle: `₹29 packs loaded`,
      icon: TrendingUp, 
      color: 'bg-gradient-to-br from-cyan-500/10 to-teal-500/10 text-cyan-600 border-cyan-200/50' 
    },
    { 
      label: 'Checkout Success', 
      value: stats ? `${stats.txConversionRate}%` : '100%', 
      subtitle: `${stats?.successfulTx || 0} successful sales`,
      icon: Percent, 
      color: 'bg-gradient-to-br from-emerald-500/10 to-teal-500/10 text-emerald-600 border-emerald-200/50' 
    },
  ];

  const formatDate = (d: string) => {
    if (!d) return '—';
    const days = Math.ceil(Math.abs(Date.now() - new Date(d).getTime()) / 86400000);
    if (days <= 1) return 'Today';
    if (days < 7)  return `${days}d ago`;
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="flex flex-col gap-6 font-sora">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Overview</h1>
          <p className="text-[13px] text-slate-500 font-medium mt-0.5">Welcome back. Here's what's happening.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/subscription-ai"
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-[13px] hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-amber-400" /> Subscription & AI Log
          </Link>
          <Link
            href="/admin/jobs"
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-[13px] hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Manage Jobs
          </Link>
        </div>
      </div>

      {/* ── Operational Stat Cards ── */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse h-28" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {OPERATIONAL_CARDS.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.div
                key={c.key}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
              >
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${c.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-3xl font-black text-slate-900">
                  {(stats?.[c.key] ?? 0).toLocaleString()}
                </div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">{c.label}</div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ── Monetization & Purchase Insights (WOW Factor!) ── */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          <h2 className="text-base font-black text-slate-950">Monetization & Purchase Insights</h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse h-32" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {FINANCIAL_CARDS.map((c, i) => {
              const Icon = c.icon;
              return (
                <motion.div
                  key={c.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between h-36 hover:border-indigo-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{c.label}</div>
                    <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${c.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="text-2xl font-black text-slate-900">{c.value}</div>
                    <div className="text-[11px] font-semibold text-slate-400 mt-1 leading-snug truncate">
                      {c.subtitle}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Double Activity Feed Split Grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Left: Recent Jobs */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-slate-500" />
              <h2 className="text-[14px] font-black text-slate-900">Recent Job Postings</h2>
            </div>
            <Link
              href="/admin/jobs"
              className="flex items-center gap-1 text-[12px] font-bold text-indigo-600 hover:underline"
            >
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {loading ? (
            <div className="p-6 flex flex-col gap-3 flex-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : recentJobs.length === 0 ? (
            <div className="py-16 text-center text-slate-400 font-medium flex-1 flex items-center justify-center">No jobs posted yet.</div>
          ) : (
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left text-[13px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/30">
                    <th className="px-6 py-3.5 font-bold text-slate-500 uppercase tracking-wider text-[11px]">Role</th>
                    <th className="px-4 py-3.5 font-bold text-slate-500 uppercase tracking-wider text-[11px]">Location</th>
                    <th className="px-4 py-3.5 font-bold text-slate-500 uppercase tracking-wider text-[11px]">Posted</th>
                  </tr>
                </thead>
                <tbody>
                  {recentJobs.slice(0, 5).map((job, i) => (
                    <tr key={job.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                            <img
                              src={`${API}/${job.image}`}
                              alt={job.title}
                              className="w-full h-full object-contain p-1"
                              onError={(e: any) => { e.target.src = '/logo.webp'; }}
                            />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 leading-tight">{job.role}</div>
                            <div className="text-slate-500 font-medium text-[11px] mt-0.5">{job.title}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="flex items-center gap-1 text-slate-500 font-semibold text-[12px]">
                          <MapPin className="w-3 h-3 opacity-60" /> {job.location || '—'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-500 font-medium text-[12px]">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 opacity-60" /> {formatDate(job.created_at)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right: Recent Purchases (WOW Factor!) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <h2 className="text-[14px] font-black text-slate-900">Recent Successful Sales Feed</h2>
            </div>
            <Link
              href="/admin/subscription-ai"
              className="flex items-center gap-1 text-[12px] font-bold text-indigo-600 hover:underline"
            >
              View Invoices <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {loading ? (
            <div className="p-6 flex flex-col gap-3 flex-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : recentTransactions.length === 0 ? (
            <div className="py-16 text-center text-slate-400 font-medium flex-1 flex items-center justify-center">No successful sales recorded yet.</div>
          ) : (
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left text-[13px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/30">
                    <th className="px-6 py-3.5 font-bold text-slate-500 uppercase tracking-wider text-[11px]">User / Email</th>
                    <th className="px-4 py-3.5 font-bold text-slate-500 uppercase tracking-wider text-[11px] text-center">Package</th>
                    <th className="px-4 py-3.5 font-bold text-slate-500 uppercase tracking-wider text-[11px] text-center">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.slice(0, 5).map((tx) => (
                    <tr key={tx.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-3.5">
                        <div>
                          <div className="font-bold text-slate-900 leading-tight">{tx.user_name}</div>
                          <div className="text-slate-500 font-medium text-[11px] mt-0.5">{tx.user_email}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        {tx.plan_type === 'PRO' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-200 text-amber-700 text-[10px] font-black uppercase rounded-full">
                            💎 PRO Pass
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-gradient-to-r from-cyan-500/10 to-teal-500/10 border border-cyan-200 text-cyan-700 text-[10px] font-black uppercase rounded-full">
                            ⚡ Top-Up
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-center font-black text-slate-900">
                        ₹{tx.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* ── Quick Links ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/admin/users"
          className="group bg-white rounded-2xl border border-slate-200 p-6 flex items-center gap-4 hover:border-indigo-200 hover:shadow-md transition-all animate-none"
        >
          <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center shrink-0">
            <Users2 className="w-6 h-6 text-emerald-600" />
          </div>
          <div className="flex-1">
            <div className="font-black text-slate-900">Manage Users</div>
            <div className="text-[13px] text-slate-500 font-medium">View candidates & employers</div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
        </Link>

        <Link
          href="/admin/jobs"
          className="group bg-white rounded-2xl border border-slate-200 p-6 flex items-center gap-4 hover:border-indigo-200 hover:shadow-md transition-all animate-none"
        >
          <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center shrink-0">
            <Briefcase className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <div className="font-black text-slate-900">Manage Jobs</div>
            <div className="text-[13px] text-slate-500 font-medium">Edit, feature, or delete listings</div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
        </Link>

        <Link
          href="/admin/subscription-ai"
          className="group bg-white rounded-2xl border border-slate-200 p-6 flex items-center gap-4 hover:border-indigo-200 hover:shadow-md transition-all animate-none"
        >
          <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6 text-indigo-600" />
          </div>
          <div className="flex-1">
            <div className="font-black text-slate-900">Revenue & AI logs</div>
            <div className="text-[13px] text-slate-500 font-medium">Subscription logs & AI stats</div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
        </Link>
      </div>

    </div>
  );
}
