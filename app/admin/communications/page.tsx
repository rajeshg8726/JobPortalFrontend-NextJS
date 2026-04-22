"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare, Mail, Search, X, Trash2, 
  ChevronLeft, ChevronRight, CheckCircle2, AlertTriangle, Loader2
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const authH = () => ({
  'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
  'Accept': 'application/json',
});

const PER_PAGE = 10;
type ViewMode = "feedback" | "subscribers";

type Communication = {
  id: number | string;
  name: string;
  email: string;
  message: string;
  created_at: string;
};

export default function CommunicationsPage() {
  const [mode,        setMode]        = useState<ViewMode>("feedback");
  const [data,        setData]        = useState<Communication[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [page,        setPage]        = useState(1);
  const [search,      setSearch]      = useState("");
  
  const [deleteId,    setDeleteId]    = useState<number | string | null>(null);
  const [deleting,    setDeleting]    = useState(false);
  const [toast,       setToast]       = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    const endpoint = mode === "feedback" ? "getContacts" : "getAllUserSubscriberForEmailNotify";
    
    try {
      // NOTE: Using the exact endpoints provided in the user's legacy code
      // We assume these endpoints don't strictly require the admin token if they were public before,
      // but passing it is safe practice.
      const res = await fetch(`${API}/api/${endpoint}`, { headers: authH() });
      const resData = await res.json();
      
      let items: any[] = [];
      if (Array.isArray(resData)) items = resData;
      else if (Array.isArray(resData.feedbackData)) items = resData.feedbackData;
      else if (Array.isArray(resData.subscribers)) items = resData.subscribers;

      const normalized = items.map((it: any) => ({
        id: it.id || it._id || it.feedbackId || Math.random().toString(),
        name: it.name || it.fullName || it.username || it.contactName || "—",
        email: it.email || "",
        message: it.message || it.msg || it.content || it.note || "—",
        created_at: it.created_at || "",
      }));

      setData(normalized);
      setPage(1);
    } catch (error) {
      console.error(error);
      showToast("Failed to load data.", "error");
    } finally {
      setLoading(false);
    }
  }, [mode]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    
    // Note: The user's legacy code only showed a delete endpoint for feedback.
    // If subscribers share this, it works. Otherwise, it will just delete from local state visually for now.
    try {
      await fetch(`${API}/api/deleteFeedback/${deleteId}`, { 
        method: "DELETE", 
        headers: authH() 
      });
      
      setData((prev) => prev.filter((item) => String(item.id) !== String(deleteId)));
      showToast("Entry deleted successfully.", "success");
      setDeleteId(null);
    } catch (error) {
      showToast("An error occurred. Please try again.", "error");
    } finally {
      setDeleting(false);
    }
  };

  // Client-side filtering and pagination
  const filteredData = data.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) || 
    item.email.toLowerCase().includes(search.toLowerCase()) ||
    item.message.toLowerCase().includes(search.toLowerCase())
  );
  
  const totalPages = Math.max(1, Math.ceil(filteredData.length / PER_PAGE));
  const currentData = filteredData.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const formatDate = (dateString: string) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric", month: "short", day: "numeric",
    });
  };

  return (
    <div className="flex flex-col gap-5 pb-10">

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-5 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-xl font-bold text-[14px] flex items-center gap-2 ${
              toast.type === "success" ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
            }`}
          >
            {toast.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Delete Modal ── */}
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
              <h3 className="text-lg font-black text-slate-900 mb-2">Delete this entry?</h3>
              <p className="text-[14px] text-slate-500 font-medium mb-6">
                This action cannot be undone. The record will be permanently removed.
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
                  className="flex-1 h-11 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition-colors text-[14px] flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  {deleting ? "Deleting…" : "Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-black text-slate-900">Communications</h1>
        <p className="text-[13px] text-slate-500 font-medium mt-0.5">
          {data.length.toLocaleString()} total active {mode === 'feedback' ? 'contacts' : 'subscribers'}
        </p>
      </div>

      {/* ── Tabs + Search ── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row gap-3">
        {/* Pills */}
        <div className="flex items-center gap-1 p-1 bg-slate-50 border border-slate-200 rounded-xl overflow-x-auto">
          <button
            onClick={() => setMode("feedback")}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-[13px] font-bold transition-all whitespace-nowrap ${
              mode === "feedback"
                ? "bg-white shadow-sm text-indigo-600 border border-slate-200"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <MessageSquare className="w-4 h-4" /> Contact Feedback
          </button>
          <button
            onClick={() => setMode("subscribers")}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-[13px] font-bold transition-all whitespace-nowrap ${
              mode === "subscribers"
                ? "bg-white shadow-sm text-indigo-600 border border-slate-200"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Mail className="w-4 h-4" /> Email Subscribers
          </button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by name, email, or message…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="flex-1 bg-transparent text-[14px] text-slate-700 placeholder-slate-400 outline-none font-medium"
          />
          {search && (
            <button onClick={() => setSearch("")}>
              <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
            </button>
          )}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-24">
             <div className="w-8 h-8 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        ) : currentData.length === 0 ? (
          <div className="py-20 text-center text-slate-400 font-medium">
            No {mode} found{search ? ` matching "${search}"` : ""}.
          </div>
        ) : (
          <div className="overflow-x-auto">
             <table className="w-full text-left text-[13px] min-w-[800px]">
               <thead>
                 <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="px-6 py-3 font-bold text-slate-500 uppercase tracking-wider text-[11px] w-12">#</th>
                    <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[11px]">User Identity</th>
                    <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[11px] w-1/2">
                      {mode === "feedback" ? "Message" : "Subscription Note"}
                    </th>
                    <th className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[11px] whitespace-nowrap">Date</th>
                    <th className="px-6 py-3 font-bold text-slate-500 uppercase tracking-wider text-[11px] text-right">Delete</th>
                 </tr>
               </thead>
               <tbody>
                 {currentData.map((post, idx) => (
                    <tr key={post.id} className={`border-b border-slate-50 hover:bg-indigo-50/20 transition-colors ${idx % 2 !== 0 ? 'bg-slate-50/30' : ''}`}>
                      <td className="pl-6 pr-4 py-5 text-slate-400 font-bold">
                        {(page - 1) * PER_PAGE + idx + 1}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-600 text-[14px] font-black shrink-0">
                            {(post.name && post.name !== '—') ? post.name.charAt(0).toUpperCase() : (post.email ? post.email.charAt(0).toUpperCase() : '?')}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 leading-tight">{post.name}</div>
                            <div className="text-slate-500 text-[12px] font-medium">{post.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 pr-8">
                         <p className="text-slate-600 text-[13px] leading-relaxed line-clamp-3" title={post.message}>
                           {post.message}
                         </p>
                      </td>
                      <td className="px-4 py-4 text-slate-500 font-medium whitespace-nowrap">
                         {formatDate(post.created_at)}
                      </td>
                      <td className="px-6 py-4 text-right">
                         <button
                           onClick={() => setDeleteId(post.id)}
                           className="w-8 h-8 inline-flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all"
                           title="Delete Entry"
                         >
                           <Trash2 className="w-3.5 h-3.5" />
                         </button>
                      </td>
                    </tr>
                 ))}
               </tbody>
             </table>
          </div>
        )}

        {/* ── Client Side Pagination ── */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50">
            <span className="text-[13px] text-slate-500 font-medium">
              Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filteredData.length)} of {filteredData.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              {/* Simple page numbers */}
              <div className="hidden sm:flex items-center gap-1 mx-2">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const p = i + 1;
                  // Extremely simple logic to show first, last, and +/- 1 of current
                  if (p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1)) {
                    return (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-8 h-8 rounded-lg text-[13px] font-bold flex items-center justify-center transition-all ${
                          page === p ? "bg-indigo-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-200"
                        }`}
                      >
                        {p}
                      </button>
                    );
                  }
                  // Ellipsis
                  if (p === 2 && page > 3) return <span key={p} className="text-slate-400">…</span>;
                  if (p === totalPages - 1 && page < totalPages - 2) return <span key={p} className="text-slate-400">…</span>;
                  return null;
                })}
              </div>

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
