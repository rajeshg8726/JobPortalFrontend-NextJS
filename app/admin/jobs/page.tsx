"use client";

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Star, Clock, Pencil, Trash2, ChevronLeft, ChevronRight,
  X, AlertTriangle, MapPin, Wallet, Loader2, Sparkles, Plus,
  CheckCircle2, AlertCircle
} from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL;
const authH = () => ({
  'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
  'Accept': 'application/json',
  'Content-Type': 'application/json',
});

type Job = {
  id: number;
  role: string;
  title: string;
  location: string;
  pay: string;
  batches: string;
  image: string;
  joblink: string;
  is_featured: boolean;
  is_urgent: boolean;
  created_at: string;
  status: string;
};

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'featured' | 'urgent' | 'old' | 'old_60'>('all');
  const [activeTab, setActiveTab] = useState<'all' | 'published' | 'draft'>('all');
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<Record<string, boolean>>({});
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      ...(activeTab !== 'all' && { status: activeTab }),
      ...(search && { search }),
      ...(filter !== 'all' && { filter }),
    });
    try {
      const res = await fetch(`${API}/api/admin/jobs?${params}`, { headers: authH() });
      const data = await res.json();
      if (data.success) {
        setJobs(data.jobs);
        setTotal(data.total);
        setTotalPages(data.totalPages ?? 1);
      }
    } catch {}
    setLoading(false);
  }, [page, search, filter, activeTab]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  useEffect(() => { setPage(1); }, [search, filter, activeTab]);

  /* ── Publish Job ── */
  const publishJob = async (id: number) => {
    try {
      const res = await fetch(`${API}/api/admin/jobs/${id}/publish`, { method: 'PUT', headers: authH() });
      const data = await res.json();
      if (data.success) {
        setJobs(prev => prev.filter(j => j.id !== id));
        setTotal(t => t - 1);
        showToast('Job published successfully');
      }
    } catch {}
  };

  /* ── Toggle featured / urgent ── */
  const toggle = async (id: number, field: 'featured' | 'urgent') => {
    const key = `${id}-${field}`;
    setToggling(p => ({ ...p, [key]: true }));
    try {
      const res = await fetch(`${API}/api/admin/jobs/${id}/toggle-${field}`, { method: 'PUT', headers: authH() });
      const data = await res.json();
      if (data.success) {
        setJobs(prev => prev.map(j =>
          j.id === id
            ? { ...j, [`is_${field}`]: data.job[`is_${field}`] }
            : j
        ));
        showToast(`${field.charAt(0).toUpperCase() + field.slice(1)} status updated`);
      }
    } catch {}
    setToggling(p => ({ ...p, [key]: false }));
  };

  /* ── Delete ── */
  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API}/api/admin/jobs/${deleteId}`, { method: 'DELETE', headers: authH() });
      const data = await res.json();
      if (data.success) {
        setJobs(prev => prev.filter(j => j.id !== deleteId));
        setTotal(t => t - 1);
        setDeleteId(null);
        showToast('Job deleted successfully');
      }
    } catch {}
    setDeleting(false);
  };

  const formatDate = (d: string) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="flex flex-col gap-5 relative font-sora">

      {/* Toast Alert */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 right-6 z-50 px-5 py-3 bg-emerald-500 text-white rounded-2xl shadow-xl font-bold text-[13px] flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" /> {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Delete confirm modal ── */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-7 max-w-sm w-full shadow-2xl"
            >
              <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center mb-4 border border-rose-100">
                <AlertTriangle className="w-6 h-6 text-rose-600" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">Delete this job?</h3>
              <p className="text-[13px] text-slate-500 font-semibold mb-6">
                This action cannot be undone. The job listing will be permanently removed.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 h-11 border border-slate-200 rounded-xl font-bold text-slate-655 text-slate-600 hover:bg-slate-50 transition-colors text-[13px] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="flex-1 h-11 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition-colors text-[13px] disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  {deleting ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Job Management</h1>
          <p className="text-[13px] text-slate-500 font-medium mt-0.5 capitalize">
            {total.toLocaleString()} {activeTab === 'all' ? 'total' : activeTab} jobs found
          </p>
        </div>
        <Link 
          href="/admin/jobs/add"
          className="flex items-center gap-2 px-4.5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-[13px] hover:bg-indigo-700 transition-all shadow-sm w-fit"
        >
          <Plus className="w-4 h-4" /> Add New Job
        </Link>
      </div>

      {/* ── Search + Filter bar ── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col gap-4 shadow-sm">
        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => { setActiveTab('all'); setPage(1); }}
            className={`px-4 py-2 text-[13px] font-black border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'all' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            All Jobs
          </button>
          <button
            onClick={() => { setActiveTab('published'); setPage(1); }}
            className={`px-4 py-2 text-[13px] font-black border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'published' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            Live Jobs
          </button>
          <button
            onClick={() => { setActiveTab('draft'); setPage(1); }}
            className={`px-4 py-2 text-[13px] font-black border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'draft' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            Pending AI Drafts
            {activeTab !== 'draft' && <span className="bg-indigo-50 border border-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase">New</span>}
          </button>
        </div>

        <div className="flex flex-col xl:flex-row gap-3">
          <div className="flex items-center gap-2 flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search jobs by role or company…"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="flex-1 bg-transparent text-[14px] text-slate-700 placeholder-slate-400 outline-none font-medium"
            />
            {search && (
              <button onClick={() => setSearch('')} className="cursor-pointer">
                <X className="w-4 h-4 text-slate-400 hover:text-slate-655" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 p-1 bg-slate-50 border border-slate-200 rounded-xl overflow-x-auto no-scrollbar">
            {(['all', 'featured', 'urgent', 'old', 'old_60'] as const).map(f => (
              <button
                key={f}
                onClick={() => { setFilter(f); setPage(1); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12.5px] font-bold capitalize transition-all whitespace-nowrap cursor-pointer ${
                  filter === f
                    ? 'bg-white shadow-sm text-indigo-600 border border-slate-200'
                    : 'text-slate-500 hover:text-slate-805 hover:text-slate-800'
                }`}
              >
                {f === 'featured' && <Star className="w-3.5 h-3.5 fill-amber-500 stroke-amber-500" />}
                {f === 'urgent'   && <Clock className="w-3.5 h-3.5 text-rose-500" />}
                {f === 'old'      && <Clock className="w-3.5 h-3.5 text-slate-500" />}
                {f === 'old_60'   && <Clock className="w-3.5 h-3.5 text-slate-650 text-slate-500" />}
                {f === 'all' ? 'All' : f === 'old' ? '30+ Days Old' : f === 'old_60' ? '60+ Days Old' : f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="py-20 text-center text-slate-400 font-medium">
            No jobs found{search ? ` for "${search}"` : ''}.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px] min-w-[800px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  {['Company / Role', 'Location / Pay', 'Target Batches', 'Featured', 'Urgent', 'Posted Date', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3.5 font-bold text-slate-500 uppercase tracking-wider text-[11px] whitespace-nowrap first:pl-6">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {jobs.map((job, i) => (
                  <tr
                    key={job.id}
                    className={`border-b border-slate-50 hover:bg-indigo-50/20 transition-colors ${i % 2 !== 0 ? 'bg-slate-50/40' : ''}`}
                  >
                    {/* Company / Role */}
                    <td className="pl-6 pr-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                          <img
                            src={`${API}/${job.image}`}
                            alt={job.title}
                            className="w-full h-full object-contain p-1.5"
                            onError={(e: any) => { e.target.src = '/logo.webp'; }}
                          />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 leading-tight line-clamp-1 flex items-center gap-2">
                            {job.role}
                            {activeTab === 'all' && (
                               <span className={`px-2 py-0.2 rounded text-[9px] font-black uppercase tracking-wider border ${job.status === 'published' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                                 {job.status === 'published' ? 'Live' : 'Draft'}
                               </span>
                            )}
                          </div>
                          <div className="text-slate-400 font-bold text-[11.5px] line-clamp-1 mt-0.5">{job.title}</div>
                        </div>
                      </div>
                    </td>

                    {/* Location / Pay */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5 text-slate-600 font-bold text-[12px]">
                        <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                        <span className="truncate max-w-[140px]">{job.location || '—'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500 font-bold text-[12px] mt-1">
                        <Wallet className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                        <span className="truncate max-w-[140px] text-emerald-700">{job.pay || '—'}</span>
                      </div>
                    </td>

                    {/* Batches */}
                    <td className="px-4 py-4">
                      <span className="text-slate-600 font-bold text-[12px] truncate block max-w-[120px]">{job.batches || '—'}</span>
                    </td>

                    {/* Featured toggle */}
                    <td className="px-4 py-4">
                      <button
                        onClick={() => toggle(job.id, 'featured')}
                        disabled={!!toggling[`${job.id}-featured`]}
                        className={`relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11.5px] font-black border transition-all cursor-pointer disabled:opacity-50 ${
                          job.is_featured
                            ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                            : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {toggling[`${job.id}-featured`] ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Star className={`w-3.5 h-3.5 ${job.is_featured ? 'fill-amber-500 stroke-amber-550 stroke-amber-500' : ''}`} />
                        )}
                        {job.is_featured ? 'Featured' : 'Regular'}
                      </button>
                    </td>

                    {/* Urgent toggle */}
                    <td className="px-4 py-4">
                      <button
                        onClick={() => toggle(job.id, 'urgent')}
                        disabled={!!toggling[`${job.id}-urgent`]}
                        className={`relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11.5px] font-black border transition-all cursor-pointer disabled:opacity-50 ${
                          job.is_urgent
                            ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                            : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {toggling[`${job.id}-urgent`] ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Clock className="w-3.5 h-3.5" />
                        )}
                        {job.is_urgent ? 'Urgent' : 'Standard'}
                      </button>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-4 text-slate-500 font-bold text-[12px] whitespace-nowrap">
                      {formatDate(job.created_at)}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5">
                        {job.status === 'draft' && (
                          <button
                            onClick={() => publishJob(job.id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-55 bg-emerald-50 text-emerald-600 font-black border border-emerald-200 hover:bg-emerald-100 transition-all text-[11.5px] cursor-pointer"
                          >
                            Approve
                          </button>
                        )}
                        <Link
                          href={`/admin/jobs/${job.id}/edit`}
                          className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-indigo-50 hover:text-indigo-650 hover:text-indigo-600 hover:border-indigo-200 transition-all"
                          title="Edit job"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => setDeleteId(job.id)}
                          className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-505 text-slate-400 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all cursor-pointer"
                          title="Delete job"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
                className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
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
