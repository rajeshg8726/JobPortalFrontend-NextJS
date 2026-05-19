"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, CreditCard, Search, Calendar, ChevronRight, X, 
  MapPin, CheckCircle, HelpCircle, FileText, TrendingUp, IndianRupee, 
  ArrowRight, Mail, Phone, AlertCircle, Clock, Copy, Check
} from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const adminHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
  'Accept': 'application/json',
});

export default function SubscriptionAiAdminPage() {
  const [activeTab, setActiveTab] = useState<'pro' | 'transactions' | 'ai'>('pro');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(''); // SUCCESS, FAILED, PENDING for transactions
  const [loading, setLoading] = useState(true);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [aiLogs, setAiLogs] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  
  // Copy to clipboard indicator
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Selected AI Log for Drawer
  const [selectedLog, setSelectedLog] = useState<any | null>(null);

  // Fetch Data
  const fetchData = () => {
    setLoading(true);
    let endpoint = 'pro-subscribers';
    if (activeTab === 'transactions') endpoint = 'transactions';
    if (activeTab === 'ai') endpoint = 'ai-usage';

    let url = `${API}/api/admin/${endpoint}?page=${page}&search=${searchQuery}`;
    if (activeTab === 'transactions' && statusFilter) {
      url += `&status=${statusFilter}`;
    }

    fetch(url, { headers: adminHeaders() })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          if (activeTab === 'pro') {
            setSubscribers(data.users || []);
            setTotalItems(data.total || 0);
            setTotalPages(data.totalPages || 1);
          } else if (activeTab === 'transactions') {
            setTransactions(data.transactions || []);
            setTotalItems(data.total || 0);
            setTotalPages(data.totalPages || 1);
          } else {
            setAiLogs(data.logs || []);
            setTotalItems(data.total || 0);
            setTotalPages(data.totalPages || 1);
          }
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setPage(1);
    fetchData();
  }, [activeTab, statusFilter]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setPage(1);
      fetchData();
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      fetchData();
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // Helper formatting functions
  const formatDate = (dateString: string) => {
    if (!dateString) return "Recently";
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const parseJsonSafe = (data: any) => {
    if (!data) return null;
    if (typeof data === 'object') return data;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  };

  return (
    <div className="flex flex-col gap-6 font-sora">
      
      {/* Drawer overlay & content */}
      <AnimatePresence>
        {selectedLog && (
          <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLog(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 20 }}
              className="relative w-full max-w-2xl bg-white h-full shadow-2xl z-10 flex flex-col overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
                <div>
                  <h3 className="text-lg font-black flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    AI Match In-depth Details
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mt-1">
                    Calculated for {selectedLog.user_name} on {formatDate(selectedLog.created_at)}
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedLog(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Score Summary Block */}
                <div className="p-5 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-black text-indigo-500 uppercase tracking-widest block mb-1">Target Job Description</span>
                    <h4 className="text-base font-black text-slate-900 leading-tight">{selectedLog.job_role}</h4>
                    <p className="text-sm text-slate-500 font-medium mt-0.5">{selectedLog.job_title}</p>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center ${
                      selectedLog.match_score >= 80 
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                        : selectedLog.match_score >= 50 
                          ? 'border-amber-500 bg-amber-50 text-amber-700' 
                          : 'border-rose-500 bg-rose-50 text-rose-700'
                    }`}>
                      <span className="text-lg font-black">{selectedLog.match_score}%</span>
                    </div>
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider mt-1.5">Score</span>
                  </div>
                </div>

                {/* AI Verdict & Feedback */}
                <div className="space-y-2">
                  <h5 className="text-[12px] font-black text-slate-400 uppercase tracking-wider">AI Feedback & Verdict</h5>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5">
                    <p className="text-sm text-slate-700 leading-relaxed font-medium">
                      {selectedLog.ai_feedback}
                    </p>
                  </div>
                </div>

                {/* Salary Benchmark */}
                {selectedLog.salary_benchmark && (
                  <div className="space-y-2">
                    <h5 className="text-[12px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <IndianRupee className="w-4 h-4 text-emerald-500" />
                      Salary Benchmarking & Negotiator
                    </h5>
                    {(() => {
                      const benchmark = parseJsonSafe(selectedLog.salary_benchmark);
                      if (!benchmark) return <p className="text-xs text-slate-400">Not calculated.</p>;
                      return (
                        <div className="p-4 border border-slate-200 rounded-2xl space-y-3">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl font-black text-slate-900">
                              ₹{(benchmark.min / 100000).toFixed(1)}L - ₹{(benchmark.max / 100000).toFixed(1)}L
                            </span>
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-wider rounded-md border border-emerald-100">
                              {benchmark.experience_level || "Benchmark"}
                            </span>
                          </div>
                          {benchmark.advice && (
                            <p className="text-[13px] text-slate-500 font-medium leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                              {benchmark.advice}
                            </p>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* Missing ATS Keywords */}
                {selectedLog.missing_keywords && (
                  <div className="space-y-2">
                    <h5 className="text-[12px] font-black text-slate-400 uppercase tracking-wider">Missing ATS Keywords</h5>
                    <div className="flex flex-wrap gap-2">
                      {(() => {
                        const keywords = parseJsonSafe(selectedLog.missing_keywords);
                        if (!keywords || keywords.length === 0) {
                          return <span className="text-xs text-slate-400 font-medium italic">Perfect keyword match! No keywords missing.</span>;
                        }
                        return keywords.map((k: string, i: number) => (
                          <span 
                            key={i} 
                            className="px-3 py-1 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold rounded-full shadow-xs"
                          >
                            + {k}
                          </span>
                        ));
                      })()}
                    </div>
                  </div>
                )}

                {/* Likely Interview Questions */}
                {selectedLog.interview_questions && (
                  <div className="space-y-2">
                    <h5 className="text-[12px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-purple-500" />
                      Generated Interview Preparation Questions
                    </h5>
                    <div className="space-y-2">
                      {(() => {
                        const questions = parseJsonSafe(selectedLog.interview_questions);
                        if (!questions || questions.length === 0) {
                          return <p className="text-xs text-slate-400">No questions generated.</p>;
                        }
                        return questions.map((q: string, i: number) => (
                          <div key={i} className="flex gap-3 items-start p-3 bg-slate-50 border border-slate-100 rounded-xl">
                            <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                              {i + 1}
                            </span>
                            <p className="text-[13px] font-semibold text-slate-700 leading-snug">{q}</p>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>
                )}

                {/* Cover Letter Block */}
                {selectedLog.cover_letter && (
                  <div className="space-y-2">
                    <h5 className="text-[12px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-amber-500" />
                      Generated Cover Letter Draft
                    </h5>
                    <div className="p-4 border border-slate-200 rounded-2xl bg-amber-50/20 text-[13px] text-slate-600 leading-relaxed font-playfair font-medium whitespace-pre-wrap max-h-60 overflow-y-auto">
                      {selectedLog.cover_letter}
                    </div>
                  </div>
                )}

              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
                <button 
                  onClick={() => setSelectedLog(null)}
                  className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[13px] font-bold shadow-md hover:bg-slate-800 transition-colors"
                >
                  Close Insights
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Header ── */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Subscription & Payments Dashboard</h1>
          <p className="text-[13px] text-slate-500 font-medium mt-0.5">
            Monitor real-time candidate subscriptions, follow up with failed transaction records instantly, and inspect calculated AI metrics.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-slate-200 p-1 rounded-2xl self-start shrink-0">
          <button
            onClick={() => setActiveTab('pro')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-black tracking-wide uppercase transition-all ${
              activeTab === 'pro' 
                ? 'bg-white text-indigo-600 shadow-xs' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            PRO Subscribers
          </button>
          
          <button
            onClick={() => setActiveTab('transactions')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-black tracking-wide uppercase transition-all ${
              activeTab === 'transactions' 
                ? 'bg-white text-indigo-600 shadow-xs' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <IndianRupee className="w-3.5 h-3.5" />
            Payment Logs
          </button>
          
          <button
            onClick={() => setActiveTab('ai')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-black tracking-wide uppercase transition-all ${
              activeTab === 'ai' 
                ? 'bg-white text-indigo-600 shadow-xs' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Usage Logs
          </button>
        </div>
      </div>

      {/* ── Search & Filter Controls ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        
        <div className="md:col-span-2 relative">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={
              activeTab === 'pro' 
                ? "Search subscriber by name or email..." 
                : activeTab === 'transactions'
                  ? "Search by candidate name, email, or order ID..."
                  : "Search by candidate name, email, or target job role..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 pl-11 pr-4 py-3 rounded-xl text-[13px] font-medium outline-hidden focus:bg-white focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Transactions Status Filter */}
        <div className="md:col-span-1">
          {activeTab === 'transactions' ? (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-[13px] font-bold text-slate-700 outline-hidden focus:bg-white focus:border-indigo-500 transition-colors"
            >
              <option value="">All Payment Statuses</option>
              <option value="SUCCESS">✅ SUCCESSFUL Only</option>
              <option value="FAILED">❌ FAILED Only</option>
              <option value="PENDING">⏳ PENDING Only</option>
            </select>
          ) : (
            <div className="h-11 bg-slate-100 rounded-xl border border-dashed border-slate-200 flex items-center justify-center text-[11px] font-bold text-slate-400">
              Filters Active
            </div>
          )}
        </div>

        <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-center md:col-span-1">
          <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest block">Total Records</span>
          <span className="text-lg font-black text-indigo-900 mt-0.5 block">{totalItems.toLocaleString()}</span>
        </div>

      </div>

      {/* ── Main Data View ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 flex flex-col gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-12 bg-slate-50 border border-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : activeTab === 'pro' ? (
          
          /* PRO Subscribers List */
          subscribers.length === 0 ? (
            <div className="py-20 text-center text-slate-400 font-medium">No PRO subscribers found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="px-6 py-3.5 font-bold text-slate-500 uppercase tracking-wider text-[11px]">User Name</th>
                    <th className="px-4 py-3.5 font-bold text-slate-500 uppercase tracking-wider text-[11px]">Email Address</th>
                    <th className="px-4 py-3.5 font-bold text-slate-500 uppercase tracking-wider text-[11px]">Phone Number</th>
                    <th className="px-4 py-3.5 font-bold text-slate-500 uppercase tracking-wider text-[11px]">Subscription Expiry</th>
                    <th className="px-4 py-3.5 font-bold text-slate-500 uppercase tracking-wider text-[11px]">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((user, i) => (
                    <tr key={user.id} className={`border-b border-slate-50 hover:bg-slate-50 transition-colors ${i % 2 === 0 ? '' : 'bg-slate-50/40'}`}>
                      <td className="px-6 py-4 font-bold text-slate-950">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-black">
                            {user.full_name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <span>{user.full_name || 'Candidate'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 font-medium text-slate-600">{user.email}</td>
                      <td className="px-4 py-4 font-medium text-slate-500">
                        {user.phone ? (
                          <a href={`tel:${user.phone}`} className="flex items-center gap-1 hover:text-indigo-600 font-bold transition-colors">
                            <Phone className="w-3.5 h-3.5 opacity-60 text-slate-400" />
                            {user.phone}
                          </a>
                        ) : '—'}
                      </td>
                      <td className="px-4 py-4 font-bold text-slate-600">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {user.pro_expires_at ? new Date(user.pro_expires_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : "Unlimited"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-xs">
                          💎 Active PRO
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : activeTab === 'transactions' ? (

          /* Payments Logs List */
          transactions.length === 0 ? (
            <div className="py-20 text-center text-slate-400 font-medium">No transaction records found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="px-6 py-3.5 font-bold text-slate-500 uppercase tracking-wider text-[11px]">User & Contact</th>
                    <th className="px-4 py-3.5 font-bold text-slate-500 uppercase tracking-wider text-[11px]">Razorpay Details</th>
                    <th className="px-4 py-3.5 font-bold text-slate-500 uppercase tracking-wider text-[11px] text-center">Amount</th>
                    <th className="px-4 py-3.5 font-bold text-slate-500 uppercase tracking-wider text-[11px] text-center">Status</th>
                    <th className="px-4 py-3.5 font-bold text-slate-500 uppercase tracking-wider text-[11px]">Date & Time</th>
                    <th className="px-4 py-3.5 font-bold text-slate-500 uppercase tracking-wider text-[11px] text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx, i) => (
                    <tr key={tx.id} className={`border-b border-slate-50 hover:bg-slate-50 transition-colors ${i % 2 === 0 ? '' : 'bg-slate-50/40'}`}>
                      {/* User & Contact details so admin can follow up */}
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-bold text-slate-900 leading-tight">{tx.user_name || 'Candidate'}</div>
                          <div className="flex flex-col gap-0.5 mt-1 font-medium text-slate-500 text-[11px]">
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3 text-slate-400" />
                              {tx.user_email}
                            </span>
                            {tx.user_phone && (
                              <span className="flex items-center gap-1 font-bold text-indigo-600">
                                <Phone className="w-3 h-3" />
                                {tx.user_phone}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Razorpay transaction details */}
                      <td className="px-4 py-4 font-semibold text-slate-600">
                        <div>
                          <span className="text-[11px] text-slate-400 block font-bold">ORDER ID</span>
                          <span className="text-[12px] font-bold text-slate-800">{tx.razorpay_order_id}</span>
                          {tx.razorpay_payment_id && (
                            <span className="block text-[10px] text-emerald-600 font-bold mt-0.5">PAYMENT: {tx.razorpay_payment_id}</span>
                          )}
                        </div>
                      </td>

                      {/* Transaction Amount */}
                      <td className="px-4 py-4 text-center font-black text-slate-900">
                        ₹{tx.amount}
                      </td>

                      {/* Status Badges */}
                      <td className="px-4 py-4 text-center">
                        {tx.status === 'SUCCESS' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-black uppercase rounded-full shadow-xs">
                            <CheckCircle className="w-3 h-3" /> SUCCESSFUL
                          </span>
                        ) : tx.status === 'FAILED' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-black uppercase rounded-full shadow-xs animate-pulse">
                            <AlertCircle className="w-3 h-3" /> FAILED
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-black uppercase rounded-full shadow-xs">
                            <Clock className="w-3 h-3 animate-spin" /> PENDING
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-4 text-slate-500 font-medium">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {formatDate(tx.created_at)}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {/* Direct Actions */}
                          {tx.user_phone ? (
                            <a
                              href={`tel:${tx.user_phone}`}
                              title={`Call ${tx.user_name}`}
                              className="w-8 h-8 rounded-lg bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white border border-indigo-100 flex items-center justify-center transition-all shadow-xs"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                          ) : (
                            <a
                              href={`mailto:${tx.user_email}?subject=Regarding Your RGJobs Subscription Payment`}
                              title={`Email ${tx.user_name}`}
                              className="w-8 h-8 rounded-lg bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white border border-indigo-100 flex items-center justify-center transition-all shadow-xs"
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </a>
                          )}
                          
                          <button
                            onClick={() => copyToClipboard(`${tx.user_name}\nEmail: ${tx.user_email}\nPhone: ${tx.user_phone || 'N/A'}\nStatus: ${tx.status}`, tx.id)}
                            title="Copy Contact Credentials"
                            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center transition-all"
                          >
                            {copiedId === tx.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          
          /* AI Usage Logs List */
          aiLogs.length === 0 ? (
            <div className="py-20 text-center text-slate-400 font-medium">No AI match logs recorded yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="px-6 py-3.5 font-bold text-slate-500 uppercase tracking-wider text-[11px]">Candidate</th>
                    <th className="px-4 py-3.5 font-bold text-slate-500 uppercase tracking-wider text-[11px]">Target Job / Role</th>
                    <th className="px-4 py-3.5 font-bold text-slate-500 uppercase tracking-wider text-[11px] text-center">Score</th>
                    <th className="px-4 py-3.5 font-bold text-slate-500 uppercase tracking-wider text-[11px]">Analyzed At</th>
                    <th className="px-4 py-3.5 font-bold text-slate-500 uppercase tracking-wider text-[11px]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {aiLogs.map((log, i) => (
                    <tr key={log.id} className={`border-b border-slate-50 hover:bg-slate-50 transition-colors ${i % 2 === 0 ? '' : 'bg-slate-50/40'}`}>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-bold text-slate-900 leading-tight">{log.user_name || 'Candidate'}</div>
                          <div className="text-slate-500 text-[11px] font-medium">{log.user_email}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <div className="font-bold text-indigo-950 leading-tight">{log.job_role || 'Job Description'}</div>
                          <div className="text-slate-400 text-[11px] font-medium truncate max-w-64">{log.job_title}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`inline-block px-3 py-1 text-xs font-black rounded-full border shadow-xs ${
                          log.match_score >= 80 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                            : log.match_score >= 50 
                              ? 'bg-amber-50 text-amber-700 border-amber-200' 
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}>
                          {log.match_score}%
                        </span>
                      </td>
                      <td className="px-4 py-4 text-slate-500 font-medium">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {formatDate(log.created_at)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-indigo-600 hover:text-white border border-slate-200 hover:border-indigo-500 text-slate-700 text-[12px] font-bold rounded-xl transition-all shadow-xs"
                        >
                          View Details <ArrowRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}

        {/* Paginations Footer */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">
              Showing page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-black rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-black rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
