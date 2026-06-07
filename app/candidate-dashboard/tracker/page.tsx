"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import Link from "next/link";
import {
  Target,
  Plus,
  X,
  Briefcase,
  Globe,
  Trash2,
  Edit2,
  Save,
  Zap,
  Lock,
  ChevronRight,
  ClipboardCheck,
  RefreshCw,
  Sparkles,
  ArrowRight,
  GraduationCap,
  Award,
  Layers,
  Search,
  User,
  Shield,
  FileText
} from "lucide-react";

/* ─── Interfaces ─── */
interface TrackedJob {
  id: number;
  company_name: string;
  job_title: string;
  job_description?: string;
  job_url?: string;
  status: "applied" | "interviewing" | "offered" | "rejected";
  notes?: string;
  applied_at: string;
}

interface AIInsightApplied {
  linkedin_note: string;
  cold_email_subject: string;
  cold_email_body: string;
}

interface AIInsightInterviewing {
  questions: {
    question: string;
    tip: string;
  }[];
}

interface AIInsightRejected {
  missing_keywords: string[];
  diagnosis_summary: string;
  error_message?: string;
}

export default function ApplicationTrackerPage() {
  const [jobs, setJobs] = useState<TrackedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modals / Panels
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<TrackedJob | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [requiresUpgrade, setRequiresUpgrade] = useState(false);
  const [upgradeMessage, setUpgradeMessage] = useState("");
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Form states
  const [form, setForm] = useState({
    company_name: "",
    job_title: "",
    job_description: "",
    job_url: "",
    status: "applied" as TrackedJob["status"],
    notes: "",
    applied_at: new Date().toISOString().split("T")[0]
  });

  // AI insights states
  const [aiLoading, setAiLoading] = useState(false);
  const [aiInsights, setAiInsights] = useState<any>(null);
  const [hasResume, setHasResume] = useState(false);

  const backendURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    // Check resume status
    const cached = localStorage.getItem("candidate");
    if (cached) {
      try {
        const profile = JSON.parse(cached);
        if (profile) {
          setHasResume(!!profile.resume);
        }
      } catch (err) {
        console.error("Failed to parse cached candidate profile:", err);
      }
    }
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(`${backendURL}/api/tracker`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setJobs(res.data.data);
      }
    } catch (err: any) {
      console.error("Error loading tracker jobs:", err);
      setError("Unable to load tracked applications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setRequiresUpgrade(false);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${backendURL}/api/tracker`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setJobs([res.data.data, ...jobs]);
        setIsAddModalOpen(false);
        // Reset form
        setForm({
          company_name: "",
          job_title: "",
          job_description: "",
          job_url: "",
          status: "applied",
          notes: "",
          applied_at: new Date().toISOString().split("T")[0]
        });
      }
    } catch (err: any) {
      if (err.response?.status === 402 || err.response?.data?.requires_upgrade) {
        setRequiresUpgrade(true);
        setUpgradeMessage(err.response?.data?.message || "You have reached your tracked job limit.");
      } else {
        setError(err.response?.data?.message || "Failed to add application. Please try again.");
      }
    }
  };

  const handleUpdateStatus = async (jobId: number, nextStatus: TrackedJob["status"]) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${backendURL}/api/tracker/${jobId}`,
        { status: nextStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        // Update local state
        const updated = jobs.map((j) => (j.id === jobId ? { ...j, status: nextStatus } : j));
        setJobs(updated);
        
        // If drawer is open and looking at this job, update selected job & refetch AI insights
        if (selectedJob && selectedJob.id === jobId) {
          const updatedJob = { ...selectedJob, status: nextStatus };
          setSelectedJob(updatedJob);
          fetchAIInsights(updatedJob);
        }
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleDeleteJob = async (jobId: number) => {
    if (!confirm("Are you sure you want to delete this application from your tracker?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${backendURL}/api/tracker/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs(jobs.filter((j) => j.id !== jobId));
      if (selectedJob?.id === jobId) {
        setIsDrawerOpen(false);
        setSelectedJob(null);
      }
    } catch (err) {
      console.error("Failed to delete application:", err);
    }
  };

  const openJobDrawer = (job: TrackedJob) => {
    setSelectedJob(job);
    setIsDrawerOpen(true);
    fetchAIInsights(job);
  };

  const fetchAIInsights = async (job: TrackedJob) => {
    setAiLoading(true);
    setAiInsights(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(`${backendURL}/api/tracker/${job.id}/ai-insights`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setAiInsights(res.data.data);
      }
    } catch (err) {
      console.error("Error loading AI coaching insights:", err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2500);
  };

  // Group jobs by status
  const columns = {
    applied: jobs.filter((j) => j.status === "applied"),
    interviewing: jobs.filter((j) => j.status === "interviewing"),
    offered: jobs.filter((j) => j.status === "offered"),
    rejected: jobs.filter((j) => j.status === "rejected")
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sora pt-28 pb-16 transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* ===== HEADER BAR ===== */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Application Command Center</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white font-playfair tracking-tight">
              AI Application Tracker
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1">
              Your central dashboard to prepare, optimize, and organize your job hunt milestones scientifically.
            </p>
          </div>
          
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2.5 px-6 py-3.5 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl font-bold text-[14px] hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-blue-500/20"
          >
            <Plus className="w-5 h-5" />
            Track New Application
          </button>
        </div>

        {/* ===== TOAST WARNINGS / NOTICES ===== */}
        {requiresUpgrade && (
          <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl p-6 mb-8 flex items-start gap-4">
            <Lock className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-amber-800 dark:text-amber-300 font-bold mb-1">Tracked Job Limit Exhausted</h4>
              <p className="text-amber-700 dark:text-amber-400 text-sm font-medium mb-3">
                {upgradeMessage || "You've reached the maximum limit of active tracked applications for your tier. Upgrade to PRO to track unlimited active applications and unlock our recruiter follow-up Outreach campaigns."}
              </p>
              <Link
                href="/pro"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold text-sm transition-colors shadow-lg shadow-amber-500/20"
              >
                <Zap className="w-4 h-4" /> View PRO Passes
              </Link>
            </div>
          </div>
        )}

        {!hasResume && (
          <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-2xl p-6 mb-8 flex items-start gap-4">
            <FileText className="w-6 h-6 text-rose-500 shrink-0 mt-0.5 animate-pulse" />
            <div>
              <h4 className="text-rose-800 dark:text-rose-300 font-bold mb-1">No Resume Uploaded</h4>
              <p className="text-rose-700 dark:text-rose-400 text-sm font-medium mb-3">
                Upload your resume in Profile Settings to unlock automated Recruiter follow-up outreach, company-specific Mock Interview prep, and Rejection diagnostics.
              </p>
              <Link
                href="/candidate-dashboard/settings"
                className="inline-flex items-center gap-2 text-sm font-bold text-rose-600 hover:text-rose-500 hover:underline"
              >
                Upload Resume Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* ===== KANBAN TRACKING BOARD ===== */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-blue-500 animate-spin mb-4" />
            <p className="text-slate-400 font-semibold">Syncing your application ledger...</p>
          </div>
        ) : jobs.length === 0 ? (
          /* ===== EMPTY STATE — ONBOARDING HERO ===== */
          <div className="pb-8">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-sm">
              <div className="text-center mb-10">
                <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-amber-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-[0_10px_30px_rgba(244,63,94,0.25)]">
                  <Target className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white font-playfair tracking-tight mb-4">
                  Stop applying blindly.<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-amber-500">
                    Start applying strategically.
                  </span>
                </h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                  Every job you track unlocks personalized AI coaching — follow-up scripts, interview prep, and rejection diagnosis — all tailored to that specific company and role.
                </p>
              </div>

              {/* 3 AI Service Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
                <div className="bg-blue-50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/15 rounded-[1.75rem] p-6 text-left">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-500/10 rounded-xl flex items-center justify-center mb-4">
                    <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-[15px] font-black text-slate-900 dark:text-white mb-1.5">
                    AI Follow-Up Scripts
                  </h3>
                  <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    When you mark a job as <strong>"Applied"</strong>, our AI generates a personalized LinkedIn connection note and cold recruiter outreach email — ready to copy and send in seconds.
                  </p>
                  <span className="inline-flex mt-3 px-2.5 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-blue-500/20">
                    Status: Applied
                  </span>
                </div>

                <div className="bg-indigo-50 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/15 rounded-[1.75rem] p-6 text-left">
                  <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-500/10 rounded-xl flex items-center justify-center mb-4">
                    <GraduationCap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-[15px] font-black text-slate-900 dark:text-white mb-1.5">
                    Mock Interview Prep
                  </h3>
                  <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    Move a job to <strong>"Interviewing"</strong> and get 5 tailored technical questions based on the company's tech stack and your resume strengths — with answer coaching tips.
                  </p>
                  <span className="inline-flex mt-3 px-2.5 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-indigo-500/20">
                    Status: Interviewing
                  </span>
                </div>

                <div className="bg-rose-50 dark:bg-rose-500/5 border border-rose-100 dark:border-rose-500/15 rounded-[1.75rem] p-6 text-left">
                  <div className="w-10 h-10 bg-rose-100 dark:bg-rose-500/10 rounded-xl flex items-center justify-center mb-4">
                    <Shield className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  </div>
                  <h3 className="text-[15px] font-black text-slate-900 dark:text-white mb-1.5">
                    Rejection Diagnosis
                  </h3>
                  <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    Got rejected? Mark it as <strong>"Rejected"</strong> and our AI audits your resume against the job description to find the exact missing keywords and skills — so you fix them before the next one.
                  </p>
                  <span className="inline-flex mt-3 px-2.5 py-1 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-rose-500/20">
                    Status: Rejected
                  </span>
                </div>
              </div>

              {/* How It Works */}
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 mb-10">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">How it works</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { step: "1", text: "Apply to any job on RGJobs or anywhere" },
                    { step: "2", text: "Click \"Track New Application\" and paste the job details" },
                    { step: "3", text: "Update the status as your application progresses" },
                    { step: "4", text: "Get AI coaching tailored to each stage automatically" }
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-3">
                      <span className="w-7 h-7 rounded-full bg-slate-900 dark:bg-blue-600 text-white text-[11px] font-black flex items-center justify-center shrink-0">{item.step}</span>
                      <p className="text-[13px] text-slate-600 dark:text-slate-300 font-medium leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white rounded-2xl font-black text-[15px] shadow-[0_10px_30px_rgba(244,63,94,0.3)] hover:shadow-[0_15px_40px_rgba(244,63,94,0.5)] transition-all hover:-translate-y-0.5"
                >
                  <Plus className="w-5 h-5" />
                  Track Your First Application
                </button>
                <Link
                  href="/jobs"
                  className="flex items-center gap-2 px-6 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-2xl font-bold text-[14px] transition-all"
                >
                  <Search className="w-4 h-4" />
                  Browse Jobs First
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <p className="text-center text-xs text-slate-400 font-medium mt-5">
                Free tier: track up to 5 active applications · Top-up: 10 active applications · PRO: unlimited
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* 1. Column: APPLIED */}
            <div className="flex flex-col h-full min-h-[60vh] bg-slate-100/50 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-5">
              <div className="flex items-center justify-between mb-5 px-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
                  <span className="font-bold text-slate-800 dark:text-white text-[15px]">Applied</span>
                </div>
                <span className="px-2 py-0.5 text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-200/50 dark:bg-slate-800 rounded-lg">
                  {columns.applied.length}
                </span>
              </div>
              <div className="space-y-4 flex-1 overflow-y-auto">
                {columns.applied.length === 0 ? (
                  <div className="border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-6 text-center py-10">
                    <p className="text-slate-400 text-xs font-medium leading-relaxed">No jobs applied yet. Tap "Track New Application" to list your first!</p>
                  </div>
                ) : (
                  columns.applied.map((job) => (
                    <JobCard key={job.id} job={job} onClick={() => openJobDrawer(job)} onUpdateStatus={handleUpdateStatus} onDelete={handleDeleteJob} />
                  ))
                )}
              </div>
            </div>

            {/* 2. Column: INTERVIEWING */}
            <div className="flex flex-col h-full min-h-[60vh] bg-slate-100/50 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-5">
              <div className="flex items-center justify-between mb-5 px-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full" />
                  <span className="font-bold text-slate-800 dark:text-white text-[15px]">Interviewing</span>
                </div>
                <span className="px-2 py-0.5 text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-200/50 dark:bg-slate-800 rounded-lg">
                  {columns.interviewing.length}
                </span>
              </div>
              <div className="space-y-4 flex-1 overflow-y-auto">
                {columns.interviewing.length === 0 ? (
                  <div className="border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-6 text-center py-10">
                    <p className="text-slate-400 text-xs font-medium leading-relaxed">No active interviews listed. Drag or update a card to push it here!</p>
                  </div>
                ) : (
                  columns.interviewing.map((job) => (
                    <JobCard key={job.id} job={job} onClick={() => openJobDrawer(job)} onUpdateStatus={handleUpdateStatus} onDelete={handleDeleteJob} />
                  ))
                )}
              </div>
            </div>

            {/* 3. Column: OFFERED */}
            <div className="flex flex-col h-full min-h-[60vh] bg-slate-100/50 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-5">
              <div className="flex items-center justify-between mb-5 px-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                  <span className="font-bold text-slate-800 dark:text-white text-[15px]">Offered</span>
                </div>
                <span className="px-2 py-0.5 text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-200/50 dark:bg-slate-800 rounded-lg">
                  {columns.offered.length}
                </span>
              </div>
              <div className="space-y-4 flex-1 overflow-y-auto">
                {columns.offered.length === 0 ? (
                  <div className="border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-6 text-center py-10">
                    <p className="text-slate-400 text-xs font-medium leading-relaxed">Milestone await! Log any job offers you win to celebrate.</p>
                  </div>
                ) : (
                  columns.offered.map((job) => (
                    <JobCard key={job.id} job={job} onClick={() => openJobDrawer(job)} onUpdateStatus={handleUpdateStatus} onDelete={handleDeleteJob} />
                  ))
                )}
              </div>
            </div>

            {/* 4. Column: REJECTED */}
            <div className="flex flex-col h-full min-h-[60vh] bg-slate-100/50 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-5">
              <div className="flex items-center justify-between mb-5 px-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-rose-500 rounded-full" />
                  <span className="font-bold text-slate-800 dark:text-white text-[15px]">Rejected / Silent</span>
                </div>
                <span className="px-2 py-0.5 text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-200/50 dark:bg-slate-800 rounded-lg">
                  {columns.rejected.length}
                </span>
              </div>
              <div className="space-y-4 flex-1 overflow-y-auto">
                {columns.rejected.length === 0 ? (
                  <div className="border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-6 text-center py-10">
                    <p className="text-slate-400 text-xs font-medium leading-relaxed">No rejections reported. Rejections are learning feedback loops!</p>
                  </div>
                ) : (
                  columns.rejected.map((job) => (
                    <JobCard key={job.id} job={job} onClick={() => openJobDrawer(job)} onUpdateStatus={handleUpdateStatus} onDelete={handleDeleteJob} />
                  ))
                )}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* ===== ADD APPLICATION MODAL ===== */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full shadow-2xl relative overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Track New Job</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-950 dark:hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddJob} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={form.company_name}
                    onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                    placeholder="e.g. Swiggy, Cashfree"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 px-4 py-3 rounded-xl outline-none focus:border-blue-500 transition-colors text-slate-900 dark:text-white text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Job Title / Role *</label>
                  <input
                    type="text"
                    required
                    value={form.job_title}
                    onChange={(e) => setForm({ ...form, job_title: e.target.value })}
                    placeholder="e.g. React Engineer, SDE Intern"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 px-4 py-3 rounded-xl outline-none focus:border-blue-500 transition-colors text-slate-900 dark:text-white text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Job Description Text (Optional)</label>
                  <p className="text-[10px] text-slate-400 font-semibold mb-1">Pasting this allows the AI to diagnose keyword gaps if rejected, or run matches.</p>
                  <textarea
                    rows={4}
                    value={form.job_description}
                    onChange={(e) => setForm({ ...form, job_description: e.target.value })}
                    placeholder="Paste the job description or requirements text here..."
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 px-4 py-3 rounded-xl outline-none focus:border-blue-500 transition-colors text-slate-900 dark:text-white text-sm font-medium resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Job Posting URL (Optional)</label>
                    <input
                      type="url"
                      value={form.job_url}
                      onChange={(e) => setForm({ ...form, job_url: e.target.value })}
                      placeholder="https://company.com/careers/job..."
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 px-4 py-3 rounded-xl outline-none focus:border-blue-500 transition-colors text-slate-900 dark:text-white text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Date Applied</label>
                    <input
                      type="date"
                      value={form.applied_at}
                      onChange={(e) => setForm({ ...form, applied_at: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 px-4 py-3 rounded-xl outline-none focus:border-blue-500 transition-colors text-slate-900 dark:text-white text-xs font-medium"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 mt-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-500/25 transition-all"
                >
                  Confirm & Log Application
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ===== AI INSIGHTS DRAWER PANEL ===== */}
      <AnimatePresence>
        {isDrawerOpen && selectedJob && (
          <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm">
            {/* Dismiss overlay click */}
            <div className="absolute inset-0" onClick={() => setIsDrawerOpen(false)} />
            
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 200 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 h-full border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col pt-[72px]"
            >
              
              {/* Drawer Header */}
              <div className="p-6 border-b border-slate-100 dark:border-slate-850/50 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/30 gap-4">
                <div className="text-left min-w-0 flex-1">
                  <span className="text-[10px] font-black text-blue-500 dark:text-blue-400 uppercase tracking-widest">Job Audit drawer</span>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight mt-1 break-words" title={selectedJob.company_name}>{selectedJob.company_name}</h3>
                  <p className="text-xs text-slate-500 font-semibold mt-1 break-words" title={selectedJob.job_title}>{selectedJob.job_title}</p>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* PIPELINE STATUS TRIGGER SELECTOR */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Pipeline Milestones</label>
                  <div className="grid grid-cols-4 gap-2 bg-slate-50 dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-850/50">
                    {(["applied", "interviewing", "offered", "rejected"] as const).map((st) => {
                      const active = selectedJob.status === st;
                      const activeColors = {
                        applied: "bg-blue-500 text-white shadow-md shadow-blue-500/20",
                        interviewing: "bg-indigo-500 text-white shadow-md shadow-indigo-500/20",
                        offered: "bg-emerald-500 text-white shadow-md shadow-emerald-500/20",
                        rejected: "bg-rose-500 text-white shadow-md shadow-rose-500/20"
                      };
                      return (
                        <button
                          key={st}
                          onClick={() => handleUpdateStatus(selectedJob.id, st)}
                          className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                            active 
                              ? activeColors[st] 
                              : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
                          }`}
                        >
                          {st === "rejected" ? "Rejected" : st}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* FLAGSHIP AI COACHING INSIGHTS */}
                <div className="border-t border-slate-100 dark:border-slate-850 pt-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-4 h-4 text-rose-500 animate-pulse" />
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 text-left">AI Active Coaching Insights</h4>
                  </div>

                  {aiLoading ? (
                    <div className="flex flex-col items-center justify-center py-10 bg-slate-50 dark:bg-slate-950 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
                      <div className="w-8 h-8 rounded-full border-2 border-slate-350 border-t-rose-500 animate-spin mb-3" />
                      <p className="text-[12px] text-slate-500 font-semibold">Consulting recruiter AI model...</p>
                    </div>
                  ) : !hasResume ? (
                    <div className="bg-rose-50/50 dark:bg-rose-500/5 border border-rose-100/50 dark:border-rose-500/10 rounded-2xl p-5 text-center">
                      <p className="text-xs text-rose-700 dark:text-rose-400 font-semibold leading-relaxed">
                        To unlock follow-up connection scripts, customized company prep, and keywords diagnoses, please upload a parsed resume PDF in Settings first.
                      </p>
                    </div>
                  ) : aiInsights ? (
                    <div className="space-y-4">
                      
                      {/* CASE A: APPLIED -> FOLLOW-UP OUTREACH SCRIPTS */}
                      {selectedJob.status === "applied" && (
                        <div className="space-y-4 text-left">
                          
                          {/* LinkedIn Connection Note */}
                          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl space-y-2 relative group">
                            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">LinkedIn connection invite note</span>
                            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                              {aiInsights.linkedin_note}
                            </p>
                            <button
                              onClick={() => handleCopyToClipboard(aiInsights.linkedin_note)}
                              className="absolute top-4 right-4 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 hover:text-blue-500 transition-colors shadow-sm"
                            >
                              {copiedText === aiInsights.linkedin_note ? (
                                <ClipboardCheck className="w-4 h-4 text-emerald-500 animate-bounce" />
                              ) : (
                                <span className="text-[10px] font-bold">Copy</span>
                              )}
                            </button>
                          </div>

                          {/* Cold Outreach Email */}
                          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl space-y-3 relative group">
                            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Recruiter Outreach Email</span>
                            <div className="border-b border-slate-200 dark:border-slate-800/80 pb-2">
                              <span className="text-[11px] text-slate-400 font-bold block">Subject Line:</span>
                              <span className="text-[12px] text-slate-800 dark:text-white font-bold">{aiInsights.cold_email_subject}</span>
                            </div>
                            <pre className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed font-sans whitespace-pre-wrap select-all">
                              {aiInsights.cold_email_body}
                            </pre>
                            <button
                              onClick={() => handleCopyToClipboard(aiInsights.cold_email_body)}
                              className="absolute top-4 right-4 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 hover:text-blue-500 transition-colors shadow-sm"
                            >
                              {copiedText === aiInsights.cold_email_body ? (
                                <ClipboardCheck className="w-4 h-4 text-emerald-500 animate-bounce" />
                              ) : (
                                <span className="text-[10px] font-bold">Copy Email</span>
                              )}
                            </button>
                          </div>

                        </div>
                      )}

                      {/* CASE B: INTERVIEWING -> tailored TECHNICAL MOCK QUESTIONS */}
                      {selectedJob.status === "interviewing" && aiInsights.questions && (
                        <div className="space-y-3 text-left">
                          <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Tailored Mock Preparation Qs</span>
                          {aiInsights.questions.map((q: any, idx: number) => (
                            <div key={idx} className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl space-y-2">
                              <div className="flex gap-2">
                                <span className="w-5 h-5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 flex items-center justify-center shrink-0 text-[10px] font-black mt-0.5">
                                  {idx + 1}
                                </span>
                                <h5 className="text-[13px] font-black text-slate-900 dark:text-white leading-tight">{q.question}</h5>
                              </div>
                              <div className="pl-7 border-l-2 border-indigo-500/20">
                                <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                  <span className="font-bold text-slate-400">Coach Answer Tip:</span> {q.tip}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* CASE C: REJECTED -> DIAGNOSTICS & KEYWORD GAPS */}
                      {selectedJob.status === "rejected" && (
                        <div className="space-y-4 text-left">
                          {aiInsights.error_message ? (
                            <div className="bg-rose-500/5 border border-rose-500/15 rounded-2xl p-5 text-center">
                              <p className="text-xs text-rose-500 font-semibold leading-relaxed">
                                {aiInsights.error_message}
                              </p>
                            </div>
                          ) : (
                            <>
                              {/* Gap Keywords */}
                              {aiInsights.missing_keywords && aiInsights.missing_keywords.length > 0 && (
                                <div className="space-y-2">
                                  <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Identified Keyword Gaps</span>
                                  <div className="flex flex-wrap gap-2">
                                    {aiInsights.missing_keywords.map((kw: string) => (
                                      <span key={kw} className="px-3 py-1 text-xs font-bold text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                                        -{kw}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Diagnostics Summary */}
                              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl space-y-2">
                                <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Gap Audit Summary</span>
                                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                                  {aiInsights.diagnosis_summary}
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                      )}

                      {/* CASE D: OFFERED -> CELEBRATION */}
                      {selectedJob.status === "offered" && (
                        <div className="bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/20 p-6 rounded-3xl space-y-4 text-center">
                          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                            <Award className="w-8 h-8 animate-bounce" />
                          </div>
                          <div>
                            <h5 className="text-lg font-black text-emerald-800 dark:text-emerald-300 leading-tight">Offer Secured!</h5>
                            <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold leading-relaxed mt-2">
                              {aiInsights.message || "Unbelievable achievement. You have bridged the gap and secured your offer. Up next: negotiate your base salary benchmark and compare secondary elements with absolute confidence."}
                            </p>
                          </div>
                        </div>
                      )}

                    </div>
                  ) : (
                    <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl p-5 text-center">
                      <p className="text-xs text-slate-400 font-semibold leading-relaxed">No AI analysis returned. Drag or click status elements to recalculate.</p>
                    </div>
                  )}
                </div>

                {/* DELETE / ACTIONS BASE PANEL */}
                <div className="pt-6 border-t border-slate-100 dark:border-slate-850 flex justify-between gap-4">
                  {selectedJob.job_url && (
                    <a
                      href={selectedJob.job_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3 text-center border border-slate-200 dark:border-slate-750 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-xs font-bold transition-colors"
                    >
                      View Original Posting
                    </a>
                  )}
                  <button
                    onClick={() => handleDeleteJob(selectedJob.id)}
                    className="flex-1 py-3 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-600 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <Trash2 className="w-4 h-4" /> Remove Application
                  </button>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

/* ─── KANBAN CARD SUB-COMPONENT ─── */
function JobCard({
  job,
  onClick,
  onUpdateStatus,
  onDelete
}: {
  job: TrackedJob;
  onClick: () => void;
  onUpdateStatus: (jobId: number, nextStatus: TrackedJob["status"]) => void;
  onDelete: (jobId: number) => void;
}) {
  const statusGradients = {
    applied: "border-l-blue-500 hover:border-blue-500/30",
    interviewing: "border-l-indigo-500 hover:border-indigo-500/30",
    offered: "border-l-emerald-500 hover:border-emerald-500/30",
    rejected: "border-l-rose-500 hover:border-rose-500/30"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 border-l-4 ${
        statusGradients[job.status]
      } rounded-2xl p-4 sm:p-5 cursor-pointer shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:shadow-lg transition-all duration-300 relative group`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2 pr-4 text-left gap-2">
        <div className="min-w-0 flex-1">
          <h4 
            className="text-[14px] font-black text-slate-900 dark:text-white leading-tight group-hover:text-blue-500 transition-colors truncate"
            title={job.company_name}
          >
            {job.company_name}
          </h4>
          <p 
            className="text-[11px] text-slate-500 font-bold mt-0.5 line-clamp-2 break-words"
            title={job.job_title}
          >
            {job.job_title}
          </p>
        </div>
        
        {job.job_description && (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-wider shrink-0">
            AI Active
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 text-[10px] text-slate-400 font-bold justify-between">
        <span className="flex items-center gap-1">
          <Globe className="w-3.5 h-3.5 opacity-55" /> 
          {new Date(job.applied_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
        </span>

        {/* Floating contextual indicator */}
        {job.status === "applied" && (
          <span className="text-blue-400 uppercase tracking-widest text-[8px] font-black">Outreach Note Ready</span>
        )}
        {job.status === "interviewing" && (
          <span className="text-indigo-400 uppercase tracking-widest text-[8px] font-black animate-pulse">Prep Active</span>
        )}
        {job.status === "rejected" && job.job_description && (
          <span className="text-rose-400 uppercase tracking-widest text-[8px] font-black">Audit Ready</span>
        )}
      </div>
      
      {/* Quick delete floating absolute */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(job.id);
        }}
        className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
}
