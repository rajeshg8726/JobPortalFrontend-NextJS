"use client";

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Star, Clock, Pencil, Trash2,
  ChevronLeft, ChevronRight, X, AlertTriangle,
  MapPin, Wallet, Loader2,
} from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL;
const authH = () => ({
  'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
  'Accept': 'application/json',
  'Content-Type': 'application/json',
});

type Job = {
  id: number; role: string; title: string; location: string;
  pay: string; batches: string; image: string; joblink: string;
  is_featured: boolean; is_urgent: boolean; created_at: string;
};

export default function AdminJobsPage() {
  const [jobs,      setJobs]      = useState<Job[]>([]);
  const [total,     setTotal]     = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page,      setPage]      = useState(1);
  const [search,    setSearch]    = useState('');
  const [filter,    setFilter]    = useState<'all' | 'featured' | 'urgent'>('all');
  const [loading,   setLoading]   = useState(true);
  const [toggling,  setToggling]  = useState<Record<string, boolean>>({});
  const [deleteId,  setDeleteId]  = useState<number | null>(null);
  const [deleting,  setDeleting]  = useState(false);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      ...(search && { search }),
      ...(filter !== 'all' && { filter }),
    });
    try {
      const res  = await fetch(`${API}/api/admin/jobs?${params}`, { headers: authH() });
      const data = await res.json();
      if (data.success) {
        setJobs(data.jobs);
        setTotal(data.total);
        setTotalPages(data.totalPages ?? 1);
      }
    } catch {}
    setLoading(false);
  }, [page, search, filter]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  // Debounce search
  useEffect(() => { setPage(1); }, [search, filter]);

  /* ── Toggle featured / urgent ── */
  const toggle = async (id: number, field: 'featured' | 'urgent') => {
    const key = `${id}-${field}`;
    setToggling(p => ({ ...p, [key]: true }));
    try {
      const res  = await fetch(`${API}/api/admin/jobs/${id}/toggle-${field}`, { method: 'PUT', headers: authH() });
      const data = await res.json();
      if (data.success) {
        setJobs(prev => prev.map(j =>
          j.id === id
            ? { ...j, [`is_${field}`]: data.job[`is_${field}`] }
            : j
        ));
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
      }
    } catch {}
    setDeleting(false);
  };

  const formatDate = (d: string) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' });
  };

  return (
    <div className="flex flex-col gap-5">

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
              <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-rose-600" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">Delete this job?</h3>
              <p className="text-[14px] text-slate-500 font-medium mb-6">
                This action cannot be undone. The job listing will be permanently removed.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 h-11 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors text-[14px]"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="flex-1 h-11 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition-colors text-[14px] disabled:opacity-60 flex items-center justify-center gap-2"
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
          <p className="text-[13px] text-slate-500 font-medium mt-0.5">
            {total.toLocaleString()} total jobs
          </p>
        </div>
        <Link 
          href="/admin/jobs/add"
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-[13px] hover:bg-indigo-700 transition-colors shadow-sm w-fit"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
          Add New Job
        </Link>
      </div>

      {/* ── Search + Filter bar ── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by role or company…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="flex-1 bg-transparent text-[14px] text-slate-700 placeholder-slate-400 outline-none font-medium"
          />
          {search && (
            <button onClick={() => setSearch('')}>
              <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 p-1 bg-slate-50 border border-slate-200 rounded-xl">
          {(['all', 'featured', 'urgent'] as const).map(f => (
            <button
              key={f}
              onClick={() => { setFilter(f); setPage(1); }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-bold capitalize transition-all whitespace-nowrap ${
                filter === f
                  ? 'bg-white shadow-sm text-indigo-600 border border-slate-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {f === 'featured' && <Star className="w-3.5 h-3.5" />}
              {f === 'urgent'   && <Clock className="w-3.5 h-3.5" />}
              {f === 'all' ? 'All Jobs' : f}
            </button>
          ))}
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
                  {['Company / Role', 'Location / Pay', 'Batches', 'Featured', 'Urgent', 'Posted', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[11px] whitespace-nowrap first:pl-6">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {jobs.map((job, i) => (
                  <tr
                    key={job.id}
                    className={`border-b border-slate-50 hover:bg-indigo-50/30 transition-colors ${i % 2 !== 0 ? 'bg-slate-50/40' : ''}`}
                  >
                    {/* Company / Role */}
                    <td className="pl-6 pr-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                          <img
                            src={`${API}/${job.image}`}
                            alt={job.title}
                            className="w-full h-full object-contain p-1"
                            onError={(e: any) => { e.target.src = '/logo.webp'; }}
                          />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 leading-tight line-clamp-1">{job.role}</div>
                          <div className="text-slate-500 font-medium text-[12px] line-clamp-1">{job.title}</div>
                        </div>
                      </div>
                    </td>

                    {/* Location / Pay */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1 text-slate-600 font-medium text-[12px]">
                        <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                        <span className="truncate max-w-[120px]">{job.location || '—'}</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-500 font-medium text-[12px] mt-0.5">
                        <Wallet className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                        <span className="truncate max-w-[120px]">{job.pay || '—'}</span>
                      </div>
                    </td>

                    {/* Batches */}
                    <td className="px-4 py-4">
                      <span className="text-slate-600 font-medium truncate block max-w-[100px]">{job.batches || '—'}</span>
                    </td>

                    {/* Featured toggle */}
                    <td className="px-4 py-4">
                      <button
                        onClick={() => toggle(job.id, 'featured')}
                        disabled={!!toggling[`${job.id}-featured`]}
                        className={`relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold border transition-all disabled:opacity-50 ${
                          job.is_featured
                            ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                            : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {toggling[`${job.id}-featured`]
                          ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          : <Star className={`w-3.5 h-3.5 ${job.is_featured ? 'fill-amber-500' : ''}`} />
                        }
                        {job.is_featured ? 'Yes' : 'No'}
                      </button>
                    </td>

                    {/* Urgent toggle */}
                    <td className="px-4 py-4">
                      <button
                        onClick={() => toggle(job.id, 'urgent')}
                        disabled={!!toggling[`${job.id}-urgent`]}
                        className={`relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold border transition-all disabled:opacity-50 ${
                          job.is_urgent
                            ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                            : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {toggling[`${job.id}-urgent`]
                          ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          : <Clock className={`w-3.5 h-3.5 ${job.is_urgent ? 'fill-rose-500' : ''}`} />
                        }
                        {job.is_urgent ? 'Yes' : 'No'}
                      </button>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-4 text-slate-500 font-medium whitespace-nowrap">
                      {formatDate(job.created_at)}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/jobs/${job.id}/edit`}
                          className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all"
                          title="Edit job"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => setDeleteId(job.id)}
                          className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all"
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
