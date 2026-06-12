"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import axios from "axios";
import { toBlob } from "html-to-image";
import {
  FileText,
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Upload,
  Sparkles,
  Zap,
  Lock,
  ChevronDown,
  RefreshCw,
  Target,
  User,
  Layers,
  Hash,
  Award,
  Type,
  X,
  Download,
  Share2,
} from "lucide-react";

/* ─── Types ─── */
interface DimensionResult {
  score: number;
  max: number;
  status: "good" | "warning" | "poor";
  feedback: string;
}

interface HealthData {
  overall_score: number;
  dimensions: {
    ats_parseability: DimensionResult;
    contact_info: DimensionResult;
    section_structure: DimensionResult;
    keyword_density: DimensionResult;
    achievements: DimensionResult;
    formatting: DimensionResult;
  };
  top_fixes: string[];
  summary?: string;
}

/* ─── Dimension config for display ─── */
const DIMENSION_META: Record<
  string,
  { label: string; icon: any; description: string }
> = {
  ats_parseability: {
    label: "ATS Parseability",
    icon: Layers,
    description: "Can ATS software read and parse your resume correctly?",
  },
  contact_info: {
    label: "Contact Information",
    icon: User,
    description: "Are email, phone, and LinkedIn/portfolio present?",
  },
  section_structure: {
    label: "Section Structure",
    icon: FileText,
    description: "Does it have Summary, Experience, Education, Skills sections?",
  },
  keyword_density: {
    label: "Technical Keywords",
    icon: Hash,
    description: "Enough role-relevant technical keywords for ATS matching?",
  },
  achievements: {
    label: "Measurable Achievements",
    icon: Award,
    description: "Numbers, percentages, and impact metrics in your experience?",
  },
  formatting: {
    label: "Length & Formatting",
    icon: Type,
    description: "Appropriate length, clean formatting, no problematic elements?",
  },
};

/* ─── Score Ring Component ─── */
function ScoreRing({ score, size = 160 }: { score: number; size?: number }) {
  const r = (size - 16) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (circumference * score) / 100;
  const color =
    score >= 75
      ? "stroke-emerald-500"
      : score >= 50
      ? "stroke-amber-500"
      : "stroke-rose-500";
  const bgColor =
    score >= 75
      ? "text-emerald-500"
      : score >= 50
      ? "text-amber-500"
      : "text-rose-500";
  const label =
    score >= 75 ? "ATS Ready" : score >= 50 ? "Needs Work" : "At Risk";

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          className="text-slate-200 dark:text-slate-800"
          strokeWidth="8"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          className={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="text-4xl font-black text-slate-900 dark:text-white"
        >
          {score}
        </motion.span>
        <span className={`text-xs font-bold uppercase tracking-widest ${bgColor}`}>
          {label}
        </span>
      </div>
    </div>
  );
}

/* ─── Static Score Ring (For html2canvas) ─── */
function StaticScoreRing({ score, size = 160 }: { score: number; size?: number }) {
  const r = (size - 16) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (circumference * score) / 100;
  const color =
    score >= 75
      ? "stroke-emerald-500"
      : score >= 50
      ? "stroke-amber-500"
      : "stroke-rose-500";
  const bgColor =
    score >= 75
      ? "text-emerald-500"
      : score >= 50
      ? "text-amber-500"
      : "text-rose-500";
  const label =
    score >= 75 ? "ATS Ready" : score >= 50 ? "Needs Work" : "At Risk";

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          className="text-slate-800"
          strokeWidth="8"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          className={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-black text-white">
          {score}
        </span>
        <span className={`text-xs font-bold uppercase tracking-widest ${bgColor}`}>
          {label}
        </span>
      </div>
    </div>
  );
}

/* ─── Shareable Score Card (Hidden for html2canvas) ─── */
function ShareableScoreCard({ result, userName }: { result: HealthData; userName: string }) {
  const displayScore = Math.round((result.overall_score / 60) * 100);
  return (
    <div 
      className="w-[800px] h-[450px] flex flex-col justify-between font-sora relative overflow-hidden text-white border border-slate-800 rounded-3xl" 
      style={{ backgroundColor: '#020617', padding: '40px' }}
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-600/10 rounded-full blur-[80px] pointer-events-none" />
      
      <div className="relative z-10 flex justify-between items-start">
        <div>
          <h2 className="text-4xl font-black font-playfair tracking-tight mb-2" style={{ fontFamily: 'Georgia, serif' }}>ATS Resume Health</h2>
          <p className="text-xl text-slate-400 font-medium">{userName ? `${userName}'s` : 'Candidate'} Audit Results</p>
        </div>
        <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-2xl border border-white/10 backdrop-blur-md">
          <Shield className="w-6 h-6 text-blue-400" />
          <span className="font-black text-lg tracking-wide">RGJobs</span>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-between mt-8">
        <div className="flex items-center gap-10">
          <StaticScoreRing score={displayScore} size={180} />
          <div className="flex flex-col gap-3">
             <div className="text-3xl font-black text-white">{displayScore >= 75 ? "Excellent Match" : displayScore >= 50 ? "Needs Improvement" : "Critical Fixes Needed"}</div>
             <p className="text-slate-400 max-w-sm text-lg leading-relaxed">
               {displayScore >= 75 ? "This resume is highly optimized to pass automated HR screening systems." : "This resume is missing key requirements and risks auto-rejection."}
             </p>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex justify-between items-end mt-8 border-t border-white/10 pt-6">
        <div className="flex gap-4">
           {Object.entries(result.dimensions).slice(0, 4).map(([key, dim]) => {
              const meta = DIMENSION_META[key];
              const pct = Math.round((dim.score / dim.max) * 100);
              return (
                <div key={key} className="bg-white/5 border border-white/10 rounded-xl p-3 w-32">
                  <div className="text-sm font-bold text-slate-300 mb-1 truncate">{meta?.label || key}</div>
                  <div className="flex justify-between items-end">
                     <span className={`text-lg font-black ${dim.status === 'good' ? 'text-emerald-400' : dim.status === 'warning' ? 'text-amber-400' : 'text-rose-400'}`}>{pct}%</span>
                  </div>
                </div>
              );
           })}
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Check Yours Free</div>
          <div className="text-xl font-black text-blue-400">www.rgjobs.in</div>
        </div>
      </div>
    </div>
  );
}

/* ─── Dimension Card ─── */
function DimensionCard({
  dimKey,
  data,
  index,
}: {
  dimKey: string;
  data: DimensionResult;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const meta = DIMENSION_META[dimKey];
  if (!meta) return null;
  const Icon = meta.icon;

  const statusStyles = {
    good: {
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
      border: "border-emerald-200 dark:border-emerald-500/20",
      text: "text-emerald-700 dark:text-emerald-400",
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
      label: "Good",
      barColor: "bg-emerald-500",
    },
    warning: {
      bg: "bg-amber-50 dark:bg-amber-500/10",
      border: "border-amber-200 dark:border-amber-500/20",
      text: "text-amber-700 dark:text-amber-400",
      icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
      label: "Needs Improvement",
      barColor: "bg-amber-500",
    },
    poor: {
      bg: "bg-rose-50 dark:bg-rose-500/10",
      border: "border-rose-200 dark:border-rose-500/20",
      text: "text-rose-700 dark:text-rose-400",
      icon: <XCircle className="w-5 h-5 text-rose-500" />,
      label: "Critical",
      barColor: "bg-rose-500",
    },
  };

  const style = statusStyles[data.status] || statusStyles.warning;
  const pct = Math.round((data.score / data.max) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 + index * 0.08 }}
      className={`rounded-[1.75rem] border p-5 transition-all duration-300 cursor-pointer ${style.border} ${
        expanded ? style.bg : "bg-white dark:bg-slate-900"
      } hover:shadow-md`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${style.bg} ${style.text}`}
          >
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-[15px] font-bold text-slate-900 dark:text-white">
              {meta.label}
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              {meta.description}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            {style.icon}
            <span className={`text-xs font-bold ${style.text}`}>{style.label}</span>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {/* Score bar */}
      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${style.barColor}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, delay: 0.3 + index * 0.08 }}
        />
      </div>
      <div className="flex justify-between mt-1.5">
        <span className="text-[10px] font-bold text-slate-400">
          {data.score}/{data.max}
        </span>
        <span className="text-[10px] font-bold text-slate-400">{pct}%</span>
      </div>

      {/* Expanded feedback */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800">
              {data.feedback.includes('[Locked for PRO users') ? (
                <div className="relative group overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                  <div className="p-4 blur-[4px] opacity-60">
                    <p className="text-[13px] text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                      This is a placeholder for the detailed feedback that will analyze your specific resume section and provide actionable recommendations. It will point out exact phrases to change and suggest ATS-friendly alternatives based on your experience.
                    </p>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-100/40 dark:bg-slate-900/40 transition-colors">
                    <Link href="/pro" className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-[13px] font-bold bg-white dark:bg-slate-900 px-4 py-2 rounded-full border border-indigo-200 dark:border-indigo-500/30 shadow-sm hover:shadow-md transition-all">
                      <Lock className="w-3.5 h-3.5" /> Unlock Detailed Feedback
                    </Link>
                  </div>
                </div>
              ) : (
                <p className="text-[13px] text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                  {data.feedback}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Main Component ─── */
export default function ResumeHealthClient() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasResume, setHasResume] = useState(false);
  const [userName, setUserName] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<HealthData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [requiresUpgrade, setRequiresUpgrade] = useState(false);
  const [isFirstFree, setIsFirstFree] = useState<boolean>(true);
  const [isPro, setIsPro] = useState<boolean>(false);
  const [isGeneratingCard, setIsGeneratingCard] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const scoreCardRef = useRef<HTMLDivElement>(null);

  const backendURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("userType");
    const cached = localStorage.getItem("candidate");
    if (token && userType === "Candidate" && cached) {
      setIsLoggedIn(true);
      try {
        const profile = JSON.parse(cached);
        if (profile) {
          setUserName(profile.full_name?.split(" ")[0] || "");
          setHasResume(!!profile.resume);
          setIsFirstFree(!profile.is_first_resume_health_free_used);
          setIsPro(!!profile.is_pro);
        }
      } catch (err) {
        console.error("Failed to parse cached candidate profile:", err);
      }
    }
  }, []);

  const runAnalysis = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShowLoginModal(true);
      return;
    }

    setAnalyzing(true);
    setError(null);
    setRequiresUpgrade(false);

    try {
      const res = await axios.post(
        `${backendURL}/api/candidate/resume-health`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setResult(res.data.data);
        
        // Sync local storage profile so the user dashboard and credit systems reflect the deduction instantly
        const cached = localStorage.getItem("candidate");
        if (cached) {
          try {
            const profile = JSON.parse(cached);
            if (profile && !profile.is_pro) {
              if (!profile.is_first_resume_health_free_used) {
                profile.is_first_resume_health_free_used = true;
              } else {
                profile.ai_credits = Math.max(0, (profile.ai_credits || 0) - 1);
              }
              localStorage.setItem("candidate", JSON.stringify(profile));
              setIsFirstFree(false);
            }
          } catch (e) {
            console.error("Failed to sync profile credits locally:", e);
          }
        }
      } else {
        setError(res.data.message || "Analysis failed. Please try again.");
      }
    } catch (err: any) {
      if (err.response?.status === 402 || err.response?.data?.requires_upgrade) {
        setRequiresUpgrade(true);
      } else if (err.response?.status === 422) {
        setError(
          "No resume found on your profile. Please upload your resume in Settings first."
        );
      } else {
        setError(
          err.response?.data?.message ||
            "Could not connect to the server. Please check your internet and try again."
        );
      }
    } finally {
      setAnalyzing(false);
    }
  };

  /* ─── Score Card Generation ─── */
  const generateScoreCard = useCallback(async (): Promise<Blob | null> => {
    if (!scoreCardRef.current) return null;
    setIsGeneratingCard(true);
    try {
      const blob = await toBlob(scoreCardRef.current, {
        pixelRatio: 3,
        backgroundColor: 'transparent',
      });
      return blob;
    } catch (err) {
      console.error('Failed to generate score card:', err);
      return null;
    } finally {
      setIsGeneratingCard(false);
    }
  }, []);

  const handleDownloadCard = useCallback(async () => {
    const blob = await generateScoreCard();
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const displayScore = result ? Math.round((result.overall_score / 60) * 100) : 0;
    a.download = `RGJobs-ATS-Score-${displayScore}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [generateScoreCard, result]);

  const handleShareCard = useCallback(async (platform: 'linkedin' | 'twitter' | 'native') => {
    const score = result ? Math.round((result.overall_score / 60) * 100) : 0;
    const shareText = `My resume ATS score is ${score}/100 — checked on www.rgjobs.in\n\n75% of resumes get auto-rejected by ATS bots. Check yours for free 👇`;
    const shareUrl = 'https://www.rgjobs.in/resume-health';

    if (platform === 'native' && navigator.share) {
      const blob = await generateScoreCard();
      const files = blob ? [new File([blob], 'RGJobs-ATS-Score.png', { type: 'image/png' })] : [];
      try {
        await navigator.share({
          title: `My ATS Resume Score: ${score}/100`,
          text: shareText,
          url: shareUrl,
          ...(files.length > 0 && navigator.canShare?.({ files }) ? { files } : {}),
        });
        return;
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
      }
    }

    // Download the image first so user can attach it
    await handleDownloadCard();

    let url = '';
    if (platform === 'linkedin') {
      try {
        await navigator.clipboard.writeText(shareText);
        setShowShareToast(true); // Can reuse toast or change text later
      } catch (err) {
        console.error('Failed to copy text', err);
      }
      url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    } else if (platform === 'twitter') {
      url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    }
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
    
    if (platform === 'twitter') {
      setShowShareToast(true);
    }
    setTimeout(() => setShowShareToast(false), 4000);
  }, [generateScoreCard, result, handleDownloadCard]);

  return (
    <div className="font-sora">
      {/* ─── Login Modal ─── */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl max-w-md w-full shadow-2xl relative"
            >
              <button
                onClick={() => setShowLoginModal(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="w-16 h-16 bg-blue-50 dark:bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                Login Required
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                Create a free account and upload your resume to get your ATS
                Health Score. It takes less than 2 minutes.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <Link
                  href="/login"
                  className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors shadow-lg shadow-blue-500/25 text-center"
                >
                  Go to Login
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── Hero Section ─── */}
      <section className="relative w-full pt-32 pb-20 lg:pt-40 lg:pb-28 flex items-center justify-center overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-gradient-to-b from-rose-950/30 via-slate-950 to-slate-950" />
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-rose-600/15 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-amber-600/8 blur-[100px] rounded-full pointer-events-none mix-blend-screen" />

        <div className="relative z-10 px-6 max-w-[900px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-slate-300 text-[13px] font-bold tracking-wide uppercase mb-6 backdrop-blur-md"
          >
            <Target className="w-4 h-4 text-rose-400" />
            Free ATS Readiness Tool
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-8 font-playfair tracking-tight leading-[1.1]"
          >
            Is your resume getting
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-400">
              auto-rejected?
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[17px] md:text-[20px] text-slate-300 font-medium leading-relaxed max-w-[700px] mx-auto mb-10"
          >
            75% of resumes are filtered out by ATS before a recruiter sees them.
            Get your free health score across 6 critical dimensions and find out
            exactly what to fix.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {!isLoggedIn ? (
              <button
                onClick={() => setShowLoginModal(true)}
                className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-black text-[15px] shadow-[0_0_40px_rgba(244,63,94,0.3)] hover:shadow-[0_0_50px_rgba(244,63,94,0.5)] hover:-translate-y-0.5 transition-all"
              >
                <FileText className="w-5 h-5" />
                Check My Resume — Free
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : !hasResume ? (
              <Link
                href="/candidate-dashboard/settings"
                className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-black text-[15px] shadow-[0_0_40px_rgba(244,63,94,0.3)] hover:shadow-[0_0_50px_rgba(244,63,94,0.5)] hover:-translate-y-0.5 transition-all"
              >
                <Upload className="w-5 h-5" />
                Upload Resume First
                <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <button
                onClick={runAnalysis}
                disabled={analyzing}
                className="inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-black text-[15px] shadow-[0_0_40px_rgba(244,63,94,0.3)] hover:shadow-[0_0_50px_rgba(244,63,94,0.5)] hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              >
                {analyzing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analyzing your resume...
                  </>
                ) : result ? (
                  <>
                    <RefreshCw className="w-5 h-5" />
                    {isPro ? "Re-Analyze Resume" : "Re-Analyze Resume (Costs 1 Credit)"}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    {(isPro || isFirstFree) ? "Analyze My Resume — Free" : "Analyze My Resume (Costs 1 Credit)"}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            )}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-slate-500 text-sm font-medium mt-5"
          >
            No job description needed. Works with any resume.
          </motion.p>
        </div>
      </section>

      {/* ─── Results Section ─── */}
      <section className="relative z-20 max-w-[1000px] mx-auto px-6 -mt-10 pb-24">
        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-2xl p-6 mb-8 flex items-start gap-4"
            >
              <XCircle className="w-6 h-6 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-rose-800 dark:text-rose-300 font-bold mb-1">
                  Analysis Failed
                </h4>
                <p className="text-rose-700 dark:text-rose-400 text-sm font-medium">
                  {error}
                </p>
                {error.includes("upload") && (
                  <Link
                    href="/candidate-dashboard/settings"
                    className="inline-flex items-center gap-2 mt-3 text-sm font-bold text-rose-600 hover:text-rose-500 hover:underline"
                  >
                    Go to Settings <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upgrade Required */}
        <AnimatePresence>
          {requiresUpgrade && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl p-6 mb-8 flex items-start gap-4"
            >
              <Lock className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-amber-800 dark:text-amber-300 font-bold mb-1">
                  Credits Exhausted
                </h4>
                <p className="text-amber-700 dark:text-amber-400 text-sm font-medium mb-3">
                  You&apos;ve used all your free AI credits. Upgrade to PRO for
                  unlimited analyses or get a 10-credit top-up.
                </p>
                <Link
                  href="/pro"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold text-sm transition-colors shadow-lg shadow-amber-500/20"
                >
                  <Zap className="w-4 h-4" /> View PRO Plans
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Analysis Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Score Overview Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-[0_20px_40px_rgba(0,0,0,0.06)] p-8 md:p-12 mb-8">
                <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                  {/* Score Ring — normalize from 0-60 backend scale to 0-100 for display */}
                  <div className="shrink-0">
                    <ScoreRing score={Math.round((result.overall_score / 60) * 100)} size={180} />
                  </div>

                  {/* Summary */}
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white font-playfair tracking-tight mb-3">
                      {userName ? `${userName}, your` : "Your"} Resume Health
                      Score
                    </h2>
                    <p className="text-slate-600 dark:text-slate-300 font-medium text-[15px] leading-relaxed mb-6">
                      {result.summary || (Math.round((result.overall_score / 60) * 100) >= 75
                        ? "Your resume is in good shape for ATS systems. Focus on the yellow/red areas below to push it higher."
                        : Math.round((result.overall_score / 60) * 100) >= 50
                        ? "Your resume has some gaps that could cause ATS rejections. Check the critical items below."
                        : "Your resume has significant ATS issues. Most automated systems will likely filter it out. Fix the critical items below.")}
                    </p>

                    {/* Quick stat pills */}
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                      {Object.entries(result.dimensions).map(([key, dim]) => {
                        const statusColor =
                          dim.status === "good"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                            : dim.status === "warning"
                            ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20"
                            : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20";
                        const meta = DIMENSION_META[key];
                        return (
                          <span
                            key={key}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${statusColor}`}
                          >
                            {dim.status === "good" ? (
                              <CheckCircle2 className="w-3 h-3" />
                            ) : dim.status === "warning" ? (
                              <AlertTriangle className="w-3 h-3" />
                            ) : (
                              <XCircle className="w-3 h-3" />
                            )}
                            {meta?.label || key}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

                {/* ─── Share / Download Score Card Buttons ─── */}
                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h4 className="text-[15px] font-bold text-slate-900 dark:text-white mb-1">Share your score</h4>
                      <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium">Download a beautiful score card or share it to your socials.</p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {!isPro ? (
                        <Link
                          href="/pro"
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white/10 hover:bg-slate-800 dark:hover:bg-white/20 text-indigo-400 font-bold text-[13px] transition-all shadow-md"
                        >
                          <Lock className="w-4 h-4" />
                          PRO: Download Card
                        </Link>
                      ) : (
                        <button
                          onClick={handleDownloadCard}
                          disabled={isGeneratingCard}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white/10 hover:bg-slate-800 dark:hover:bg-white/20 text-white font-bold text-[13px] transition-all disabled:opacity-50 shadow-md"
                        >
                          {isGeneratingCard ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <Download className="w-4 h-4" />
                          )}
                          Download Card
                        </button>
                      )}
                      <button
                        onClick={() => { if (!isPro) return; handleShareCard('linkedin'); }}
                        disabled={isGeneratingCard || !isPro}
                        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0A66C2] hover:bg-[#004182] text-white font-bold text-[13px] transition-all shadow-md ${!isPro ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                      >
                        {!isPro ? <Lock className="w-4 h-4" /> : <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>}
                        LinkedIn
                      </button>
                      <button
                        onClick={() => { if (!isPro) return; handleShareCard('twitter'); }}
                        disabled={isGeneratingCard || !isPro}
                        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-950 hover:bg-black text-white font-bold text-[13px] transition-all shadow-md ${!isPro ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                      >
                        {!isPro ? <Lock className="w-4 h-4" /> : <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>}
                        Post
                      </button>
                      {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
                        <button
                          onClick={() => { if (!isPro) return; handleShareCard('native'); }}
                          disabled={isGeneratingCard || !isPro}
                          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-white font-bold text-[13px] transition-all disabled:opacity-50 ${!isPro ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {!isPro ? <Lock className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                          More
                        </button>
                      )}
                    </div>
                  </div>
                </div>

              {/* Dimension Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {Object.entries(result.dimensions).map(
                  ([key, dim], index) => (
                    <DimensionCard
                      key={key}
                      dimKey={key}
                      data={dim}
                      index={index}
                    />
                  )
                )}
              </div>

              {/* Top Fixes */}
              {result.top_fixes && result.top_fixes.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 rounded-[2rem] p-8 md:p-10 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-white">
                          Priority Fixes
                        </h3>
                        <p className="text-xs text-slate-400 font-medium">
                          Address these to improve your score the most
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {result.top_fixes.map((fix, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 bg-white/[0.03] border border-white/5 rounded-2xl p-4 hover:border-blue-500/20 transition-all"
                        >
                          <div className="w-6 h-6 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
                            <span className="text-[10px] font-black text-blue-400">
                              {i + 1}
                            </span>
                          </div>
                          <p className="text-[13px] text-slate-300 font-medium leading-relaxed">
                            {fix}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* CTA to job matching */}
                    <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <p className="text-slate-400 text-sm font-medium">
                        Ready to match your resume against real jobs?
                      </p>
                      <Link
                        href="/jobs"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm transition-colors shadow-lg shadow-blue-600/20"
                      >
                        Browse Jobs & Get Match Scores{" "}
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Pre-Analysis Educational Content (shown when no results yet) ─── */}
        {!result && !analyzing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {/* What We Check */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-[0_20px_40px_rgba(0,0,0,0.06)] p-8 md:p-12 mb-8">
              <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white font-playfair tracking-tight mb-3">
                  What We Analyze
                </h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl mx-auto">
                  Our AI reads your resume like an ATS scanner would and scores
                  it across 6 critical dimensions.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {Object.entries(DIMENSION_META).map(([key, meta], i) => {
                  const Icon = meta.icon;
                  const colors = [
                    "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
                    "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
                    "bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20",
                    "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
                    "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
                    "bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20",
                  ];
                  return (
                    <div
                      key={key}
                      className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[1.75rem] p-6 hover:border-blue-200 dark:hover:border-blue-500/30 hover:shadow-md transition-all duration-300"
                    >
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center border ${colors[i]} mb-4`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-[15px] font-bold text-slate-900 dark:text-white mb-1">
                        {meta.label}
                      </h3>
                      <p className="text-[13px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                        {meta.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Honest Disclosure */}
            <div className="flex items-start gap-4 bg-blue-50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/20 rounded-2xl p-6">
              <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-1">
                  Honest Disclaimer
                </h4>
                <p className="text-[13px] text-blue-700 dark:text-blue-400/80 font-medium leading-relaxed">
                  This tool analyzes your resume for common ATS compatibility
                  issues. No tool can guarantee you&apos;ll pass every ATS — each
                  company uses different software and criteria. What we{" "}
                  <em>can</em> do is identify the most common reasons resumes get
                  filtered out and help you fix them.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Analyzing Skeleton */}
        {analyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-[0_20px_40px_rgba(0,0,0,0.06)] p-8 md:p-12"
          >
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-full border-4 border-slate-200 dark:border-slate-800" />
                <div className="absolute inset-0 w-20 h-20 rounded-full border-4 border-transparent border-t-blue-500 animate-spin" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
                Analyzing your resume...
              </h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm max-w-md">
                Our AI is reading your resume the way an ATS scanner would —
                checking formatting, keywords, structure, and more. This usually
                takes 10-15 seconds.
              </p>
              <div className="flex items-center gap-6 mt-8">
                {["Parsing PDF", "Checking ATS", "Scoring", "Generating Fixes"].map(
                  (step, i) => (
                    <div key={step} className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"
                        style={{ animationDelay: `${i * 300}ms` }}
                      />
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">
                        {step}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          </motion.div>
        )}
      </section>

      {/* Hidden container for generating the shareable image */}
      {result && (
        <div style={{ position: 'absolute', top: 0, left: 0, zIndex: -1, opacity: 0.01, pointerEvents: 'none' }}>
          <div ref={scoreCardRef}>
            <ShareableScoreCard result={result} userName={userName} />
          </div>
        </div>
      )}

      {/* Toast Notification for sharing */}
      <AnimatePresence>
        {showShareToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-10 left-1/2 z-50 bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl font-bold text-sm border border-slate-800 flex items-center gap-3"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            Image downloaded! Caption copied to clipboard.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
