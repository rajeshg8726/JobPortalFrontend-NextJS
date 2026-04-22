"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Briefcase, Users2, Building2, TrendingUp,
  Clock, MapPin, ArrowRight, Plus,
} from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL;
const adminHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
  'Accept': 'application/json',
});

export default function AdminOverviewPage() {
  const [stats, setStats]           = useState<any>(null);
  const [recentJobs, setRecentJobs] = useState<any[]>([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    fetch(`${API}/api/admin/stats`, { headers: adminHeaders() })
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setStats(d.stats);
          setRecentJobs(d.recentJobs || []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const CARDS = [
    { label: 'Total Jobs',       key: 'totalJobs',       icon: Briefcase,  color: 'bg-blue-50 text-blue-600 border-blue-100' },
    { label: 'Candidates',       key: 'totalCandidates', icon: Users2,     color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { label: 'Employers',        key: 'totalEmployers',  icon: Building2,  color: 'bg-amber-50 text-amber-600 border-amber-100' },
    { label: 'Jobs This Week',   key: 'jobsThisWeek',    icon: TrendingUp, color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
  ];

  const formatDate = (d: string) => {
    if (!d) return '—';
    const days = Math.ceil(Math.abs(Date.now() - new Date(d).getTime()) / 86400000);
    if (days <= 1) return 'Today';
    if (days < 7)  return `${days}d ago`;
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="flex flex-col gap-6">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Overview</h1>
          <p className="text-[13px] text-slate-500 font-medium mt-0.5">Welcome back. Here's what's happening.</p>
        </div>
        <Link
          href="/admin/jobs"
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-[13px] hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Manage Jobs
        </Link>
      </div>

      {/* ── Stat Cards ── */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse h-28" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {CARDS.map((c, i) => {
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

      {/* ── Recent Jobs ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-[15px] font-black text-slate-900">Recent Job Postings</h2>
          <Link
            href="/admin/jobs"
            className="flex items-center gap-1 text-[13px] font-bold text-indigo-600 hover:underline"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="p-6 flex flex-col gap-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : recentJobs.length === 0 ? (
          <div className="py-16 text-center text-slate-400 font-medium">No jobs posted yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-6 py-3 font-bold text-slate-500 uppercase tracking-wider text-[11px]">Company / Role</th>
                  <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[11px]">Location</th>
                  <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[11px]">Posted</th>
                  <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[11px]">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentJobs.map((job, i) => (
                  <tr key={job.id} className={`border-b border-slate-50 hover:bg-slate-50 transition-colors ${i % 2 === 0 ? '' : 'bg-slate-50/40'}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                          <img
                            src={`${API}/${job.image}`}
                            alt={job.title}
                            className="w-full h-full object-contain p-1"
                            onError={(e: any) => { e.target.src = '/logo.webp'; }}
                          />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 leading-tight">{job.role}</div>
                          <div className="text-slate-500 font-medium text-[12px]">{job.title}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="flex items-center gap-1 text-slate-500 font-medium">
                        <MapPin className="w-3.5 h-3.5 shrink-0" /> {job.location || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="flex items-center gap-1 text-slate-500 font-medium">
                        <Clock className="w-3.5 h-3.5 shrink-0" /> {formatDate(job.created_at)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <Link
                        href={`/admin/jobs/${job.id}/edit`}
                        className="text-indigo-600 font-bold hover:underline text-[12px]"
                      >
                        Edit →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Quick Links ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/admin/users"
          className="group bg-white rounded-2xl border border-slate-200 p-6 flex items-center gap-4 hover:border-indigo-200 hover:shadow-md transition-all"
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
          className="group bg-white rounded-2xl border border-slate-200 p-6 flex items-center gap-4 hover:border-indigo-200 hover:shadow-md transition-all"
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
      </div>

    </div>
  );
}
