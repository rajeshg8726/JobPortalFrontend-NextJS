"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  Users,
  Share2,
  Bookmark,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Clock,
  Building2,
  GraduationCap,
  SearchX,
  CheckCircle2,
  Zap,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Lock,
  ArrowRight,
  FileText,
  X,
  TrendingUp,
  MessageSquare,
  IndianRupee,
  Download,
  FileDown,
  UserRoundPen,
  FileCheck,
  RefreshCw,
  Shield
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────────────
   RADAR / SPIDER CHART — pure SVG, no external charting library needed
   Shows the 5-category AI score breakdown. Blurred + locked for BASIC users.
───────────────────────────────────────────────────────────────────────── */
function RadarChart({ breakdown, isPro }: { breakdown: Record<string, number> | null; isPro: boolean }) {
  if (!breakdown) return null;
  const cx = 100, cy = 95, r = 60;
  const axes = [
    { key: 'technical_skills',    label: 'Technical',  max: 40 },
    { key: 'experience_relevance',label: 'Experience', max: 25 },
    { key: 'education',           label: 'Education',  max: 10 },
    { key: 'soft_skills',         label: 'Soft Skills',max: 15 },
    { key: 'keyword_match',       label: 'Keywords',   max: 10 },
  ];
  const n = axes.length;
  const angles = axes.map((_, i) => -Math.PI / 2 + (2 * Math.PI * i) / n);
  const pt = (rad: number, ang: number) => ({ x: cx + rad * Math.cos(ang), y: cy + rad * Math.sin(ang) });
  const poly = (pts: { x: number; y: number }[]) => pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const levels = [0.25, 0.5, 0.75, 1.0];
  const outerPts = angles.map(a => pt(r, a));
  const dataPts  = axes.map((axis, i) => {
    const val  = Number(breakdown?.[axis.key] ?? 0);
    const norm = Math.min(val / axis.max, 1);
    return pt(r * norm, angles[i]);
  });
  const labelPts = angles.map((a, i) => ({ ...pt(r + 22, a), label: axes[i].label }));

  return (
    <div className="relative w-full">
      <svg viewBox="0 0 200 175" className={`w-full transition-all duration-300 ${!isPro ? 'blur-sm select-none pointer-events-none' : ''}`}>
        {/* Grid */}
        {levels.map(lv => (
          <polygon key={lv} points={poly(angles.map(a => pt(r * lv, a)))} fill="none" stroke="rgba(148,163,184,0.1)" strokeWidth="1" />
        ))}
        {/* Axis lines */}
        {outerPts.map((p, i) => (
          <line key={i} x1={cx} y1={cy} x2={p.x.toFixed(1)} y2={p.y.toFixed(1)} stroke="rgba(148,163,184,0.1)" strokeWidth="1" />
        ))}
        {/* Data polygon */}
        <polygon points={poly(dataPts)} fill="rgba(99,102,241,0.18)" stroke="rgba(99,102,241,0.75)" strokeWidth="2" strokeLinejoin="round" />
        {/* Data dots */}
        {dataPts.map((p, i) => (
          <circle key={i} cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r="3.5" fill="#6366f1" stroke="rgba(15,23,42,0.9)" strokeWidth="2" />
        ))}
        {/* Category labels */}
        {labelPts.map((p, i) => (
          <text key={i} x={p.x.toFixed(1)} y={p.y.toFixed(1)} textAnchor="middle" dominantBaseline="middle" fontSize="7" fontWeight="bold" fill="rgba(148,163,184,0.85)">
            {p.label}
          </text>
        ))}
      </svg>
      {!isPro && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Link href="/pro" className="flex flex-col items-center gap-2 bg-slate-900/90 border border-indigo-500/40 hover:border-indigo-500/70 rounded-2xl px-5 py-4 text-center transition-all group">
            <Lock className="w-5 h-5 text-indigo-400" />
            <p className="text-[11px] font-black text-white">Score Breakdown</p>
            <span className="text-[10px] font-bold text-indigo-400 group-hover:text-indigo-300 transition-colors">Unlock with PRO →</span>
          </Link>
        </div>
      )}
    </div>
  );
}

const Toast = ({ message, type, onClose }: any) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className={`fixed bottom-6 right-6 z-[9999] px-6 py-4 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.2)] backdrop-blur-2xl border flex items-center gap-3 font-semibold text-[14px] ${
        type === "success" 
          ? "bg-slate-900/90 border-slate-700 text-white" 
          : "bg-blue-600/90 border-blue-500 text-white"
      }`}
    >
      {type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
      {message}
    </motion.div>
  );
};

export default function JobDetailClient({ id, slug, initialJob }: { id: string, slug: string, initialJob?: any }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const autoAnalyze = searchParams.get('autoAnalyze');
  const [job, setJob] = useState<any>(initialJob || null);
  const [loading, setLoading] = useState<boolean>(!initialJob);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [toastMessage, setToastMessage] = useState<{msg: string, type: string} | null>(null);
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [matchFeedback, setMatchFeedback] = useState<string | null>(null);
  const [missingKeywords, setMissingKeywords] = useState<string[]>([]);
  const [coverLetter, setCoverLetter] = useState<string | null>(null);
  const [showCoverLetter, setShowCoverLetter] = useState(false);
  const letterRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState<'pdf' | 'word' | 'interview-pdf' | null>(null);
  const [interviewQuestions, setInterviewQuestions] = useState<string[]>([]);
  const [salaryBenchmark, setSalaryBenchmark] = useState<any>(null);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const [matchLoading, setMatchLoading] = useState(false);
  const [requiresUpgrade, setRequiresUpgrade] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [optimizedProfile, setOptimizedProfile] = useState<string | null>(null);
  const [showOptimizerModal, setShowOptimizerModal] = useState(false);
  const [showProfileAlert, setShowProfileAlert] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState<number>(0);
  const [scoreBreakdown, setScoreBreakdown] = useState<Record<string, number> | null>(null);
  const [originalBio, setOriginalBio] = useState<string>('');
  const [isPro, setIsPro] = useState<boolean>(false);
  const [aiProvider, setAiProvider] = useState<string | null>(null);

  const backendURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    if (!initialJob) {
      fetchJobDetails();
    }
  }, [id, initialJob]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('candidate') || 'null');
    const userId = user?.id || 'anonymous';
    const saved = localStorage.getItem(`savedJobs_${userId}`);
    if (saved) {
      const savedJobs = JSON.parse(saved);
      setIsSaved(savedJobs.includes(parseInt(id)));
    }
    setOriginalBio(user?.bio || '');
    setIsPro(!!(user?.is_pro));
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendURL}/api/job/${id}`);
      setJob(response.data.job || response.data);
    } catch (err) {
      console.error('Error fetching job:', err);
      setError('Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveJob = () => {
    const user = JSON.parse(localStorage.getItem('candidate') || 'null');
    const userId = user?.id || 'anonymous';
    const savedKey = `savedJobs_${userId}`;
    const detailsKey = `savedJobsDetails_${userId}`;

    const savedId = parseInt(id);
    const saved = localStorage.getItem(savedKey);
    let savedJobs = saved ? JSON.parse(saved) : [];
    
    const details = JSON.parse(localStorage.getItem(detailsKey) || '{}');
    
    if (isSaved) {
      savedJobs = savedJobs.filter((i: number) => i !== savedId);
      delete details[String(savedId)];
      setToastMessage({ msg: 'Removed from your saved collection.', type: 'info' });
    } else {
      savedJobs.push(savedId);
      if (job) {
        details[String(savedId)] = {
          id: job.id,
          role: job.role,
          title: job.title,
          location: job.location,
          pay: job.pay,
          image: job.image,
          created_at: job.created_at,
          slug: job.title ? job.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : slug,
        };
      }
      setToastMessage({ msg: 'Opportunity securely saved!', type: 'success' });
    }
    
    localStorage.setItem(savedKey, JSON.stringify(savedJobs));
    localStorage.setItem(detailsKey, JSON.stringify(details));
    setIsSaved(!isSaved);
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: job?.role,
          text: `Check out this job: ${job?.role} at ${job?.title}`,
          url: shareUrl,
        });
        setToastMessage({ msg: 'Shared successfully!', type: 'success' });
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setToastMessage({ msg: 'Link copied to clipboard!', type: 'success' });
      } catch (err) {
        setToastMessage({ msg: 'Failed to copy link.', type: 'error' });
      }
    }
  };

  const handleApply = () => {
    if (job?.joblink) {
      window.open(job.joblink, '_blank');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const calculateAIMatch = async (skipProfileCheck?: boolean | any, forceRefresh: boolean = false) => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    
    if (!token || userType !== 'Candidate') {
      setShowLoginModal(true);
      return;
    }

    if (skipProfileCheck !== true) {
      const userStr = localStorage.getItem('candidate');
      if (userStr) {
        try {
          const profile = JSON.parse(userStr);
          const checks = [
            !!(profile.full_name),
            !!profile.phone,
            !!profile.location,
            !!profile.bio,
            !!(Array.isArray(profile.skills) ? profile.skills.length > 0 : !!profile.skills),
            !!profile.profile_image,
            !!profile.resume,
          ];
          const comp = Math.round((checks.filter(Boolean).length / checks.length) * 100);
          if (comp < 70) {
            setProfileCompletion(comp);
            setShowProfileAlert(true);
            return;
          }
        } catch(e) {}
      }
    }

    setMatchLoading(true);
    try {
      const response = await axios.post(
        `${backendURL}/api/candidate/generate-match`,
        { job_id: id, force_refresh: forceRefresh },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        const aiData = response.data.data;
        setMatchScore(aiData.match_score);
        setMatchFeedback(aiData.ai_feedback);
        
        if (aiData.missing_keywords) {
          try {
            setMissingKeywords(typeof aiData.missing_keywords === 'string' ? JSON.parse(aiData.missing_keywords) : aiData.missing_keywords);
          } catch(e) { setMissingKeywords([]); }
        }
        setCoverLetter(aiData.cover_letter || null);

        // Parse new features
        if (aiData.interview_questions) {
          try {
            setInterviewQuestions(typeof aiData.interview_questions === 'string' ? JSON.parse(aiData.interview_questions) : aiData.interview_questions);
          } catch(e) { setInterviewQuestions([]); }
        }
        if (aiData.salary_benchmark) {
          try {
            setSalaryBenchmark(typeof aiData.salary_benchmark === 'string' ? JSON.parse(aiData.salary_benchmark) : aiData.salary_benchmark);
          } catch(e) { setSalaryBenchmark(null); }
        }
        setOptimizedProfile(aiData.optimized_profile || null);
        if (aiData.score_breakdown) {
          try {
            setScoreBreakdown(typeof aiData.score_breakdown === 'string' ? JSON.parse(aiData.score_breakdown) : aiData.score_breakdown);
          } catch(e) { setScoreBreakdown(null); }
        }

        // Track AI provider for premium badge
        setAiProvider(response.data.ai_provider || null);

        setToastMessage({ msg: response.data.ai_provider === 'premium' ? '✨ Premium AI Analysis complete!' : 'AI Analysis complete!', type: 'success' });
      }
    } catch (err: any) {
      console.error('AI Match Error:', err);
      
      // Catch "Out of Credits" error from backend (usually 402 or custom flag)
      if (err.response?.status === 402 || err.response?.data?.requires_upgrade) {
        setRequiresUpgrade(true);
        setToastMessage({ msg: 'You have used all your free AI Matches.', type: 'error' });
      } else {
        setToastMessage({ msg: err.response?.data?.message || 'Failed to calculate match.', type: 'error' });
      }
    } finally {
      setMatchLoading(false);
    }
  };

  useEffect(() => {
    if (autoAnalyze === 'true') {
      const timer = setTimeout(() => {
        calculateAIMatch(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [autoAnalyze]);

  const downloadAsPDF = async () => {
    if (!coverLetter) return;
    setIsDownloading('pdf');
    try {
      const doc = new jsPDF();
      
      // Document styling & spacing
      const margin = 20;
      const pageWidth = 210; // A4 standard width in mm
      const maxLineWidth = pageWidth - (margin * 2);
      
      // 1. Premium Letter Header
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(15, 23, 42); // slate-900
      doc.text("COVER LETTER", margin, 35);
      
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(100, 116, 139); // slate-500
      doc.text("GENERATED VIA RGJOBS AI", margin, 42);
      
      // Elegant horizontal divider line
      doc.setDrawColor(226, 232, 240); // slate-200
      doc.setLineWidth(0.5);
      doc.line(margin, 46, pageWidth - margin, 46);
      
      // 2. Letter Content Setup
      doc.setFont("times", "normal"); // High-end serif font for cover letter text
      doc.setFontSize(11.5);
      doc.setTextColor(51, 65, 85); // slate-700
      
      const paragraphs = coverLetter.split('\n');
      let y = 60; // Starting Y coordinate for text
      const lineHeight = 7;
      const paragraphSpacing = 10;
      
      paragraphs.forEach((para: string) => {
        const text = para.trim();
        if (text) {
          // splitTextToSize wraps text to fit within maxLineWidth
          const lines = doc.splitTextToSize(text, maxLineWidth);
          lines.forEach((line: string) => {
            if (y > 260) { // A4 height is 297mm
              doc.addPage();
              y = 30; // reset y on new page
              doc.setFont("times", "normal");
              doc.setFontSize(11.5);
              doc.setTextColor(51, 65, 85);
            }
            doc.text(line, margin, y);
            y += lineHeight;
          });
          y += paragraphSpacing;
        }
      });
      
      // 3. Premium Footer / Sign-off
      if (y > 240) {
        doc.addPage();
        y = 30;
      }
      
      doc.setDrawColor(241, 245, 249); // slate-100
      doc.line(margin, y, pageWidth - margin, y);
      y += 12;
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42); // slate-900
      doc.text("Best Regards,", margin, y);
      
      y += 6;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 116, 139); // slate-500
      doc.text("Candidate via RGJobs", margin, y);
      
      // Save PDF
      doc.save(`${job?.role?.replace(/\s+/g, '_')}_Cover_Letter_RGJobs.pdf`);
      setToastMessage({ msg: 'PDF Downloaded successfully!', type: 'success' });
    } catch (err) {
      console.error(err);
      setToastMessage({ msg: 'Failed to generate PDF', type: 'error' });
    } finally {
      setIsDownloading(null);
    }
  };

  const downloadAsWord = () => {
    setIsDownloading('word');
    try {
      const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' "+
            "xmlns:w='urn:schemas-microsoft-com:office:word' "+
            "xmlns='http://www.w3.org/TR/REC-html40'>"+
            "<head><meta charset='utf-8'><title>Cover Letter</title></head><body>";
      const footer = "</body></html>";
      const sourceHTML = header + coverLetter?.split('\n').map(p => `<p>${p}</p>`).join('') + footer;
      
      const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
      const fileDownload = document.createElement("a");
      document.body.appendChild(fileDownload);
      fileDownload.href = source;
      fileDownload.download = `${job?.role?.replace(/\s+/g, '_')}_Cover_Letter_RGJobs.doc`;
      fileDownload.click();
      document.body.removeChild(fileDownload);
      setToastMessage({ msg: 'Word Document Downloaded!', type: 'success' });
    } catch (err) {
      console.error(err);
      setToastMessage({ msg: 'Failed to generate Word document', type: 'error' });
    } finally {
      setIsDownloading(null);
    }
  };

  const downloadInterviewPDF = async () => {
    if (!interviewQuestions || interviewQuestions.length === 0) return;
    setIsDownloading('interview-pdf');
    try {
      const doc = new jsPDF();
      const margin = 20;
      const pageWidth = 210;
      const maxLineWidth = pageWidth - margin * 2;

      // Dark header
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, pageWidth, 52, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(255, 255, 255);
      doc.text('INTERVIEW PREP KIT', margin, 22);
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(`${(job?.role || 'Role').toUpperCase()} — ${(job?.title || 'Company').toUpperCase()}`, margin, 33);
      doc.text(`Generated by RGJobs AI  •  ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`, margin, 43);

      // Divider
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.5);
      doc.line(margin, 60, pageWidth - margin, 60);

      let y = 72;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(99, 102, 241);
      doc.text('LIKELY INTERVIEW QUESTIONS', margin, y);
      y += 14;

      interviewQuestions.forEach((q: string, i: number) => {
        if (y > 255) { doc.addPage(); y = 25; }

        // Question number badge
        doc.setFillColor(30, 27, 75);
        doc.roundedRect(margin, y - 5.5, 7, 7, 1, 1, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(129, 140, 248);
        doc.text(`${i + 1}`, margin + (i < 9 ? 2 : 1), y + 0.3);

        // Question text
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(15, 23, 42);
        const lines = doc.splitTextToSize(q, maxLineWidth - 12);
        lines.forEach((line: string, li: number) => {
          if (y > 265) { doc.addPage(); y = 25; }
          doc.text(line, margin + 10, y);
          if (li < lines.length - 1) y += 6;
        });
        y += 8;

        // Tip
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        const tipLines = doc.splitTextToSize('Tip: Use the STAR method (Situation, Task, Action, Result) to structure your answer.', maxLineWidth - 12);
        tipLines.forEach((line: string) => {
          if (y > 265) { doc.addPage(); y = 25; }
          doc.text(line, margin + 10, y);
          y += 5;
        });
        y += 7;
      });

      // Footer on every page
      const totalPages = (doc as any).internal.getNumberOfPages();
      for (let p = 1; p <= totalPages; p++) {
        doc.setPage(p);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text('Generated by RGJobs AI — rgjobs.in', margin, 288);
        doc.text(`Page ${p} of ${totalPages}`, pageWidth - margin, 288, { align: 'right' });
      }

      doc.save(`${(job?.role || 'Role').replace(/\s+/g, '_')}_Interview_Prep_RGJobs.pdf`);
      setToastMessage({ msg: '📄 Interview Prep PDF Downloaded!', type: 'success' });
    } catch (err) {
      console.error(err);
      setToastMessage({ msg: 'Failed to generate PDF', type: 'error' });
    } finally {
      setIsDownloading(null);
    }
  };

  const parseDescription = (text: string) => {
    if (!text) return [];
    return text.split('\n').filter(line => line.trim());
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-slate-950 flex flex-col items-center justify-center font-sora relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="w-16 h-16 rounded-full border border-slate-800 border-t-blue-500 animate-spin mb-6 relative z-10" />
        <p className="text-slate-400 font-medium tracking-wide animate-pulse relative z-10">Initializing Details...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="w-full min-h-screen bg-slate-950 flex items-center justify-center font-sora p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(225,29,72,0.1),transparent_50%)]" />
        <div className="w-full max-w-lg bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-[2rem] p-12 flex flex-col items-center text-center relative z-10">
          <div className="w-24 h-24 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mb-8 border border-rose-500/20 shadow-[0_0_40px_rgba(225,29,72,0.1)]">
            <SearchX className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-white font-playfair mb-4">Position Unavailable</h1>
          <p className="text-slate-400 mb-8 leading-relaxed">This opportunity is no longer active or the link is broken. Discover thousands of other premium roles waiting for you.</p>
          <button 
            onClick={() => router.push('/')}
            className="w-full py-4 bg-white text-slate-900 rounded-xl font-black transition-all hover:bg-slate-200"
          >
            Explore Active Roles
          </button>
        </div>
      </div>
    );
  }

  const isRemote = job.location?.toLowerCase().includes('remote');

  return (
    <div className="w-full min-h-screen bg-slate-50 font-sora relative">
      <AnimatePresence>
        {toastMessage && <Toast message={toastMessage.msg} type={toastMessage.type} onClose={() => setToastMessage(null)} />}
      </AnimatePresence>

      {/* Dark Premium Hero Section */}
      <div className="w-full bg-slate-950 text-white relative pt-[90px] pb-32 overflow-hidden border-b border-slate-800">
        
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(37,99,235,0.15),transparent_50%)]" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
        
        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-4 mb-16">
            <button 
              onClick={() => router.back()}
              className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-all backdrop-blur-sm"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 text-[13px] font-medium text-slate-400">
              <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
              <ChevronRight className="w-3.5 h-3.5 opacity-50" />
              <Link href="/jobs" className="hover:text-blue-400 transition-colors">Jobs</Link>
              <ChevronRight className="w-3.5 h-3.5 opacity-50" />
              <span className="text-white font-semibold truncate max-w-[200px]">{job.title}</span>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-8"
          >
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
              
              {/* Premium Logo Frame */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-500" />
                <div className="relative w-28 h-28 md:w-32 md:h-32 bg-white rounded-[2rem] p-4 flex items-center justify-center flex-shrink-0 shadow-2xl">
                  <img
                    src={`${backendURL}/${job.image}`}
                    alt={job.title}
                    className="w-full h-full object-contain"
                    onError={(e: any) => (e.target.src = '/logo.webp')}
                  />
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <h2 className="text-xl md:text-2xl font-bold text-blue-400">{job.title}</h2>
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[11px] font-black uppercase tracking-wider rounded-full backdrop-blur-md shadow-[0_2px_10px_rgba(16,185,129,0.05)]">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Official Source Verified
                  </span>
                  {job.featured && (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[11px] font-black uppercase tracking-wider rounded-full backdrop-blur-md">
                      <Sparkles className="w-3 h-3" /> Promoted
                    </span>
                  )}
                </div>
                <h1 className="text-4xl md:text-5xl font-black font-playfair tracking-tight mb-6 leading-tight">
                  {job.role}
                </h1>
                
                {/* Hero Tags */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-[14px] font-medium text-slate-300 backdrop-blur-md">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    {isRemote ? <span className="text-emerald-400 font-semibold">Remote</span> : job.location}
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-[14px] font-medium text-slate-300 backdrop-blur-md">
                    <Briefcase className="w-4 h-4 text-amber-400" />
                    {job.jobtype === '1' ? 'Internship' : 'Full-Time'}
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-[14px] font-medium text-slate-300 backdrop-blur-md">
                    <Clock className="w-4 h-4 text-purple-400" />
                    Posted {formatDate(job.created_at)}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl text-white transition-all backdrop-blur-md tooltip-trigger"
                title="Share this job"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={handleSaveJob}
                className={`w-12 h-12 flex items-center justify-center border rounded-2xl transition-all backdrop-blur-md ${
                  isSaved 
                    ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' 
                    : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                }`}
                title="Save for later"
              >
                <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-blue-400' : ''}`} />
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1200px] mx-auto px-6 -mt-10 relative z-20 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (Details) */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white border border-slate-200 rounded-[1.5rem] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:border-blue-200 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Salary</div>
                <div className="text-lg font-black text-slate-900 truncate">{job.pay || "Competitive"}</div>
              </div>
              <div className="bg-white border border-slate-200 rounded-[1.5rem] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:border-blue-200 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Batches</div>
                <div className="text-lg font-black text-slate-900 truncate">{job.batches || "Any Batch"}</div>
              </div>
              <div className="bg-white border border-slate-200 rounded-[1.5rem] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:border-blue-200 transition-colors col-span-2 lg:col-span-1">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                  <Users className="w-5 h-5" />
                </div>
                <div className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Applicants</div>
                <div className="text-lg font-black text-slate-900">High Demand</div>
              </div>
            </div>

            {/* Core Description blocks */}
            <div className="bg-white border border-slate-200 rounded-[2rem] p-8 md:p-12 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
              
              {job.description && (
                <div className="mb-12 last:mb-0">
                  <h3 className="text-xl font-black text-slate-900 font-playfair mb-6 flex items-center gap-3">
                    <span className="w-1.5 h-6 rounded-full bg-blue-600" />
                    About The Role
                  </h3>
                  <div className="prose prose-slate prose-p:text-[15px] prose-p:leading-relaxed prose-p:font-medium prose-p:text-slate-600">
                    {parseDescription(job.description).map((para, idx) => <p key={idx} className="mb-4">{para}</p>)}
                  </div>
                </div>
              )}

              {job.rolesAndResponsibilities && (
                <div className="mb-12 last:mb-0">
                  <h3 className="text-xl font-black text-slate-900 font-playfair mb-6 flex items-center gap-3">
                    <span className="w-1.5 h-6 rounded-full bg-emerald-500" />
                    Responsibilities
                  </h3>
                  <div className="grid gap-4">
                    {parseDescription(job.rolesAndResponsibilities).map((item, idx) => (
                      <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-blue-100 transition-colors hover:shadow-sm">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-[15px] leading-relaxed font-medium text-slate-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {job.requirements && (
                <div className="mb-12 last:mb-0">
                  <h3 className="text-xl font-black text-slate-900 font-playfair mb-6 flex items-center gap-3">
                    <span className="w-1.5 h-6 rounded-full bg-rose-500" />
                    Requirements
                  </h3>
                  <ul className="space-y-4">
                    {parseDescription(job.requirements).map((item, idx) => (
                      <li key={idx} className="flex gap-4 items-start">
                        <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                          <div className="w-2 h-2 rounded-full bg-slate-400" />
                        </div>
                        <span className="text-[15px] leading-relaxed font-medium text-slate-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {job.eligibility && (
                <div className="last:mb-0">
                  <div className="rounded-2xl bg-blue-50 border border-blue-100 p-8 relative overflow-hidden">
                    <Zap className="absolute -right-4 -bottom-4 w-32 h-32 text-blue-500/10" />
                    <h3 className="text-lg font-black text-slate-900 font-playfair mb-4 relative z-10">Eligibility Checklist</h3>
                    <div className="prose prose-slate prose-p:text-[15px] prose-p:leading-relaxed prose-p:font-semibold prose-p:text-blue-900/80 relative z-10">
                      {parseDescription(job.eligibility).map((para, idx) => <p key={idx}>{para}</p>)}
                    </div>
                  </div>
                </div>
              )}

              {/* Job Sourcing & Verification Transparency Shield */}
              <div className="mt-12 pt-8 border-t border-slate-100 last:mb-0">
                <div className="rounded-[2rem] bg-emerald-500/[0.03] border border-emerald-500/10 p-6 md:p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/[0.02] rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="flex items-center gap-3.5 mb-6 relative z-10">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0 shadow-sm">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-black text-slate-900 uppercase tracking-wide">RGJobs Verification Shield</h4>
                      <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">100% Secure & Authentic Career Sourcing</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[13px] font-bold text-slate-950 block mb-0.5">Verified Official Career Source</span>
                        <span className="text-[11px] text-slate-600 leading-relaxed font-medium block">
                          Aggregated directly from the official career subdomain of <strong>{job.title}</strong> (e.g. Workday, Greenhouse, Lever, or official corporate page). No third-party job board clones or affiliate loops.
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[13px] font-bold text-slate-950 block mb-0.5">Active Entity Legal Review</span>
                        <span className="text-[11px] text-slate-600 leading-relaxed font-medium block">
                          Our team verified that <strong>{job.title}</strong> is a registered active tech corporation with verified employee presence on professional directories.
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 md:col-span-2 border-t border-slate-100 pt-5">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[13px] font-bold text-slate-950 block mb-0.5">100% Direct Application Redirection</span>
                        <span className="text-[11px] text-slate-600 leading-relaxed font-medium block">
                          When you click apply, you are sent directly to the employer's official recruitment scanner. RGJobs <strong>never intercepts, reads, stores, or sells your resume or personal application data</strong>.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Right Sidebar (Sticky Tracker) */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 flex flex-col gap-6">
              
              {/* Premium AI Match Card */}
              <div className="bg-slate-950 border border-slate-800 rounded-[2rem] p-8 shadow-xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.15),transparent_50%)] pointer-events-none" />
                
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    <h3 className="text-lg font-black text-white uppercase tracking-widest">AI Match Score</h3>
                    {aiProvider === 'premium' && (
                      <span className="ml-1 px-2.5 py-0.5 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-full text-[10px] font-black text-purple-300 uppercase tracking-widest flex items-center gap-1">
                        <Zap className="w-2.5 h-2.5" /> Premium
                      </span>
                    )}
                  </div>

                  {requiresUpgrade ? (
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex flex-col items-center mt-2 w-full"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(139,92,246,0.3)]">
                        <Lock className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="text-xl font-black text-white mb-2">Out of Free Matches</h4>
                      <p className="text-[13px] font-medium text-slate-400 mb-6 leading-relaxed">
                        You've used your 6 free AI matches. Upgrade to PRO to get unlimited insights and bypass the ATS filters.
                      </p>
                      <button 
                        onClick={() => router.push('/pro')}
                        className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-bold tracking-wide transition-all shadow-[0_8px_20px_rgba(139,92,246,0.25)] hover:shadow-[0_12px_25px_rgba(139,92,246,0.4)]"
                      >
                        Upgrade to PRO <ArrowRight className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ) : matchScore !== null ? (
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex flex-col items-center"
                    >
                      {/* Circular Progress Ring */}
                      <div className="relative w-32 h-32 mb-6 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" className="text-slate-800" strokeWidth="8" />
                          <motion.circle 
                            initial={{ strokeDashoffset: 283 }}
                            animate={{ strokeDashoffset: 283 - (283 * matchScore) / 100 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            cx="50" cy="50" r="45" fill="none" 
                            stroke="currentColor" 
                            className={matchScore >= 80 ? "text-emerald-500" : matchScore >= 50 ? "text-amber-500" : "text-rose-500"} 
                            strokeWidth="8" 
                            strokeDasharray="283" 
                            strokeLinecap="round" 
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                          <span className="text-3xl font-black text-white">{matchScore}%</span>
                        </div>
                      </div>
                      
                      <p className="text-[13px] font-medium text-slate-300 leading-relaxed bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md">
                        {matchFeedback}
                      </p>

                      {/* ── Score Breakdown Radar Chart ── */}
                      {scoreBreakdown && (
                        <div className="w-full mt-4 border-t border-slate-800 pt-4">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                              <TrendingUp className="w-3.5 h-3.5 text-indigo-400" /> Score Breakdown
                            </h5>
                            {!isPro && (
                              <span className="text-[9px] font-bold text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-full">PRO Only</span>
                            )}
                          </div>
                          <RadarChart breakdown={scoreBreakdown} isPro={isPro} />
                          {isPro && (
                            <div className="mt-3 space-y-2">
                              {[
                                { key: 'technical_skills',     label: 'Technical',  max: 40 },
                                { key: 'experience_relevance', label: 'Experience', max: 25 },
                                { key: 'soft_skills',          label: 'Soft Skills',max: 15 },
                                { key: 'education',            label: 'Education',  max: 10 },
                                { key: 'keyword_match',        label: 'Keywords',   max: 10 },
                              ].map(item => {
                                const val = scoreBreakdown[item.key] ?? 0;
                                const pct = Math.round((val / item.max) * 100);
                                return (
                                  <div key={item.key} className="flex items-center gap-2">
                                    <span className="text-[9px] text-slate-400 w-[68px] shrink-0">{item.label}</span>
                                    <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                                      <div className="h-full bg-indigo-500 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                                    </div>
                                    <span className="text-[9px] font-bold text-slate-300 w-8 text-right shrink-0">{val}/{item.max}</span>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}

                      {missingKeywords && missingKeywords.length > 0 && (
                        <div className="w-full mt-6 text-left border-t border-slate-800 pt-6">
                          <h5 className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-3">Missing ATS Keywords:</h5>
                          <div className="flex flex-wrap gap-2">
                            {missingKeywords.map((kw, i) => (
                              <span key={i} className="px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold rounded-lg shadow-sm">
                                + {kw}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {coverLetter && (
                        <button 
                          onClick={() => setShowCoverLetter(true)}
                          className="w-full mt-6 flex items-center justify-center gap-2 py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all border border-white/5"
                        >
                          <FileText className="w-4 h-4 text-purple-400" /> View AI Cover Letter
                        </button>
                      )}

                      {optimizedProfile && (
                        <button 
                          onClick={() => setShowOptimizerModal(true)}
                          className="w-full mt-3 flex items-center justify-center gap-2 py-3.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-xl font-bold transition-all border border-emerald-500/20"
                        >
                          <UserRoundPen className="w-4 h-4" /> AI Resume Optimizer
                        </button>
                      )}

                      {/* Salary Benchmark */}
                      {salaryBenchmark && (
                        <div className="w-full mt-6 text-left border-t border-slate-800 pt-6">
                          <h5 className="text-[12px] font-bold text-emerald-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <IndianRupee className="w-3.5 h-3.5" /> Salary Benchmark
                          </h5>
                          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4">
                            <div className="text-2xl font-black text-white mb-1">
                              ₹{(salaryBenchmark.min / 100000).toFixed(1)}L – ₹{(salaryBenchmark.max / 100000).toFixed(1)}L
                              <span className="text-xs font-medium text-slate-400 ml-1">/ year</span>
                            </div>
                            {salaryBenchmark.advice && (
                              <p className="text-[12px] text-emerald-300/80 font-medium leading-relaxed mt-2">{salaryBenchmark.advice}</p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Interview Questions */}
                      {interviewQuestions && interviewQuestions.length > 0 && (
                        <div className="w-full mt-6 text-left border-t border-slate-800 pt-6">
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="text-[12px] font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
                              <MessageSquare className="w-3.5 h-3.5" /> Likely Interview Questions
                            </h5>
                            <button
                              onClick={downloadInterviewPDF}
                              disabled={isDownloading === 'interview-pdf'}
                              title="Download Interview Prep as PDF"
                              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 rounded-lg text-[10px] font-bold transition-all disabled:opacity-50"
                            >
                              {isDownloading === 'interview-pdf' ? (
                                <div className="w-3 h-3 border border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
                              ) : (
                                <Download className="w-3 h-3" />
                              )}
                              PDF
                            </button>
                          </div>
                          <div className="flex flex-col gap-2">
                            {interviewQuestions.map((q: string, i: number) => (
                              <div key={i} className="bg-blue-500/10 border border-blue-500/20 rounded-xl overflow-hidden">
                                <button
                                  onClick={() => setExpandedQuestion(expandedQuestion === i ? null : i)}
                                  className="w-full flex items-center justify-between gap-2 px-4 py-3 text-left"
                                >
                                  <span className="text-[12px] font-semibold text-blue-200 leading-snug flex-1">{i + 1}. {q}</span>
                                  <ChevronDown className={`w-3.5 h-3.5 text-blue-400 shrink-0 transition-transform ${expandedQuestion === i ? 'rotate-180' : ''}`} />
                                </button>
                                {expandedQuestion === i && (
                                  <div className="px-4 pb-3">
                                    <p className="text-[11px] text-slate-400 font-medium italic border-t border-blue-500/20 pt-2">
                                      💡 Tip: Research the company's tech stack and relate your answer to specific projects you've worked on.
                                    </p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Refresh Button */}
                      <div className="w-full mt-6 pt-6 border-t border-slate-800">
                        <button
                          onClick={() => calculateAIMatch(true, true)}
                          disabled={matchLoading}
                          className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white rounded-xl font-semibold text-[13px] transition-all disabled:opacity-50"
                        >
                          {matchLoading ? (
                            <div className="w-4 h-4 rounded-full border-2 border-slate-400 border-t-white animate-spin" />
                          ) : (
                            <><RefreshCw className="w-4 h-4" /> Updated Profile? Re-Analyze</>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <>
                      <p className="text-[13px] font-medium text-slate-400 mb-6 leading-relaxed">
                        Find out instantly if you are a good fit for this role using our advanced AI analysis.
                      </p>
                      <button 
                        onClick={calculateAIMatch}
                        disabled={matchLoading}
                        className="w-full flex items-center justify-center gap-2 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-bold tracking-wide transition-all disabled:opacity-50"
                      >
                        {matchLoading ? (
                          <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        ) : (
                          <>Analyze Profile</>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Premium Apply Card */}
              <div className="bg-white border-2 border-blue-600 rounded-[2rem] p-1 shadow-[0_20px_40px_rgba(37,99,235,0.1)] relative overflow-hidden group">
                <div className="absolute inset-0 bg-blue-600 opacity-5 group-hover:opacity-10 transition-opacity duration-300" />
                
                <div className="bg-white rounded-[1.8rem] p-8 relative z-10 h-full flex flex-col">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                    <Zap className="w-6 h-6 fill-blue-600/20" />
                  </div>
                  
                  <h3 className="text-2xl font-black text-slate-900 font-playfair mb-2">Ready to Apply?</h3>
                  <p className="text-[14px] font-medium text-slate-500 mb-8 leading-relaxed">
                    Submit your application seamlessly through the official portal. Make sure your resume is up to date!
                  </p>

                  <button 
                    onClick={handleApply}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black tracking-wide shadow-[0_8px_20px_rgba(37,99,235,0.3)] hover:shadow-[0_12px_25px_rgba(37,99,235,0.4)] transition-all hover:-translate-y-1 active:translate-y-0"
                  >
                    Apply on Company Site
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </button>

                  {(() => {
                    let applyDomain = "";
                    if (job?.joblink) {
                      try {
                        const url = new URL(job.joblink);
                        applyDomain = url.hostname.replace("www.", "");
                      } catch (e) {
                        applyDomain = "";
                      }
                    }
                    return (
                      <div className="mt-3.5 flex items-center justify-center gap-1.5 text-[11px] font-bold text-emerald-600 bg-emerald-500/5 border border-emerald-500/10 px-3.5 py-2.5 rounded-xl">
                        <Shield className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
                        <span>Redirects to: <strong className="font-extrabold text-emerald-700">{applyDomain || `${job.title} Careers`}</strong></span>
                      </div>
                    );
                  })()}

                  <p className="text-center text-[10px] font-bold text-slate-400 mt-5 uppercase tracking-widest">
                    Direct Apply · No Intermediaries
                  </p>
                </div>
              </div>

              {/* Similar Alert / Minimal Stats */}
              <div className="bg-slate-50 border border-slate-200 rounded-[2rem] p-8 hidden md:block">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Job Summary</h3>
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium text-sm">Role</span>
                    <span className="font-bold text-slate-900 truncate max-w-[120px]">{job.role}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium text-sm">Type</span>
                    <span className="font-bold text-slate-900">{job.jobtype === '1' ? 'Intern' : 'Full-Time'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium text-sm">Company</span>
                    <span className="font-bold text-slate-900 truncate max-w-[120px]">{job.title}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
      
      {/* Login / Complete Profile Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-md w-full shadow-2xl relative"
            >
              <button onClick={() => setShowLoginModal(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
              <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Login Required</h3>
              <p className="text-slate-400 mb-8 leading-relaxed">
                Please log in and complete your full profile to get the best results from our AI Analysis. A complete profile ensures highly accurate match scores and tailored insights!
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowLoginModal(false)}
                  className="flex-1 py-3 px-4 rounded-xl border border-slate-700 text-white font-medium hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => router.push('/login')}
                  className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors shadow-lg shadow-blue-500/25"
                >
                  Go to Login
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Incomplete Profile Alert Modal */}
      <AnimatePresence>
        {showProfileAlert && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-md w-full shadow-2xl relative"
            >
              <button onClick={() => setShowProfileAlert(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
              <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-6">
                <AlertCircle className="w-8 h-8 text-amber-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Incomplete Profile</h3>
              <p className="text-slate-400 mb-6 leading-relaxed">
                Your profile is only <strong>{profileCompletion}% complete</strong>. The AI Engine requires a highly detailed profile (Bio, Skills, Location, etc.) to give you the best ATS Match Score and Resume optimizations. 
                <br /><br />
                If you proceed now, you might waste a credit on poor results. We highly recommend completing your profile first.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => {
                    setShowProfileAlert(false);
                    calculateAIMatch(true);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl border border-slate-700 text-slate-300 font-medium hover:bg-slate-800 transition-colors text-[14px]"
                >
                  Proceed Anyway
                </button>
                <button 
                  onClick={() => router.push('/candidate-dashboard/settings')}
                  className="flex-[1.5] py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold transition-colors shadow-lg shadow-amber-500/20 text-[14px]"
                >
                  Complete Profile
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cover Letter Modal */}
      <AnimatePresence>
        {showCoverLetter && coverLetter && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
              onClick={() => setShowCoverLetter(false)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl bg-[#0B1120] border border-purple-500/30 rounded-[2rem] overflow-hidden shadow-[0_0_80px_rgba(139,92,246,0.15)] flex flex-col max-h-[90vh]"
            >
              {/* Premium Header */}
              <div className="p-6 md:p-8 border-b border-white/5 bg-gradient-to-r from-purple-900/20 to-blue-900/10 shrink-0 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500" />
                <div className="flex justify-between items-center relative z-10">
                  <div>
                    <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 flex items-center gap-3">
                      <div className="p-2 bg-purple-500/20 rounded-xl border border-purple-500/30">
                        <Sparkles className="w-6 h-6 text-purple-400" />
                      </div>
                      Your Tailored Cover Letter
                    </h3>
                    <p className="text-sm font-medium text-slate-400 mt-2 ml-14">
                      Generated specifically for the {job?.role} position.
                    </p>
                  </div>
                  <button onClick={() => setShowCoverLetter(false)} className="p-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all">
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Letter Content */}
              <div className="flex-1 p-8 md:p-10 overflow-y-auto bg-white relative">
                <div ref={letterRef} className="relative z-10 space-y-6 text-[16px] leading-[1.8] text-slate-800 font-serif max-w-2xl mx-auto p-4 bg-white">
                  {/* Letter Header (Fictional) */}
                  <div className="mb-12 border-b-2 border-slate-100 pb-8">
                    <h4 className="text-2xl font-black text-slate-900 mb-1 tracking-tight">COVER LETTER</h4>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Generated via RGJobs AI</p>
                  </div>
                  
                  {coverLetter.split('\n').map((para, i) => 
                    para.trim() && <p key={i} className="text-justify">{para}</p>
                  )}

                  <div className="mt-12 pt-8 border-t border-slate-100">
                    <p className="font-bold text-slate-900">Best Regards,</p>
                    <p className="text-slate-600">Candidate via RGJobs</p>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-6 md:p-8 border-t border-white/5 bg-slate-950/80 shrink-0 flex flex-col sm:flex-row gap-4 items-center">
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(coverLetter);
                    setToastMessage({ msg: 'Cover Letter copied to clipboard!', type: 'success' });
                  }}
                  className="w-full sm:flex-1 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold transition-all border border-white/10 flex items-center justify-center gap-2 group"
                >
                  <FileText className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" /> Copy
                </button>

                <button 
                  onClick={downloadAsWord}
                  disabled={!!isDownloading}
                  className="w-full sm:flex-[1.5] py-4 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 rounded-2xl font-bold transition-all border border-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isDownloading === 'word' ? (
                    <div className="w-5 h-5 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
                  ) : (
                    <FileDown className="w-5 h-5" />
                  )}
                  Download .DOC
                </button>

                <button 
                  onClick={downloadAsPDF}
                  disabled={!!isDownloading}
                  className="w-full sm:flex-[2] py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-2xl font-black transition-all shadow-[0_10px_30px_rgba(139,92,246,0.2)] hover:shadow-[0_15px_40px_rgba(139,92,246,0.4)] hover:-translate-y-1 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isDownloading === 'pdf' ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Download className="w-5 h-5" />
                  )}
                  Download PDF
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Resume Optimizer Modal — Before / After Split Panel ── */}
      <AnimatePresence>
        {showOptimizerModal && optimizedProfile && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
              onClick={() => setShowOptimizerModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-slate-900 border border-emerald-500/30 rounded-[2rem] overflow-hidden shadow-[0_0_80px_rgba(16,185,129,0.12)] flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/5 bg-emerald-500/5 shrink-0 relative">
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-500 to-blue-500" />
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-black text-white flex items-center gap-3">
                      <div className="p-2 bg-emerald-500/20 rounded-xl border border-emerald-500/20">
                        <UserRoundPen className="w-5 h-5 text-emerald-400" />
                      </div>
                      AI Resume Optimizer
                    </h3>
                    <p className="text-sm font-medium text-slate-400 mt-2 ml-14">
                      See exactly how AI rewrote your bio to pass ATS filters for this role.
                    </p>
                  </div>
                  <button onClick={() => setShowOptimizerModal(false)} className="p-2 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Split Panel Body */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  {/* Left: Original Bio */}
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full bg-rose-500" />
                      <span className="text-[11px] font-black text-rose-400 uppercase tracking-widest">Before — Original Bio</span>
                    </div>
                    <div className="flex-1 bg-rose-500/5 border border-rose-500/20 rounded-2xl p-5">
                      {originalBio ? (
                        <p className="text-[14px] leading-[1.8] text-slate-300 whitespace-pre-wrap">{originalBio}</p>
                      ) : (
                        <p className="text-[13px] text-slate-500 italic">No bio found. Complete your profile settings for better AI results.</p>
                      )}
                    </div>
                  </div>

                  {/* Right: AI Optimized Bio (PRO gate) */}
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-[11px] font-black text-emerald-400 uppercase tracking-widest">After — AI Optimized</span>
                      {isPro && (
                        <span className="ml-auto px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[9px] font-black uppercase tracking-wider rounded-full">PRO Active</span>
                      )}
                    </div>
                    <div className="flex-1 relative">
                      <div className={`bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5 h-full transition-all duration-300 ${!isPro ? 'blur-sm select-none' : ''}`}>
                        <p className="text-[14px] leading-[1.8] text-slate-200 whitespace-pre-wrap">{optimizedProfile}</p>
                      </div>
                      {!isPro && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <Link href="/pro" className="flex flex-col items-center gap-2 bg-slate-900/95 border border-emerald-500/30 hover:border-emerald-500/60 rounded-2xl px-6 py-5 text-center shadow-2xl transition-all group">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                              <Lock className="w-5 h-5 text-emerald-400" />
                            </div>
                            <p className="text-[13px] font-black text-white">Unlock Optimized Bio</p>
                            <p className="text-[11px] font-medium text-slate-400">Copy & paste directly into your profile</p>
                            <span className="mt-1 px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-900 rounded-lg font-black text-[11px] transition-colors">Upgrade to PRO →</span>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Injected keywords callout (PRO only) */}
                {isPro && missingKeywords && missingKeywords.length > 0 && (
                  <div className="mt-6 p-5 bg-slate-800/50 border border-slate-700/50 rounded-2xl">
                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-amber-400" /> ATS Keywords Injected by AI
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {missingKeywords.slice(0, 10).map((kw, i) => (
                        <span key={i} className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] font-bold rounded-lg">+ {kw}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-5 border-t border-white/5 bg-slate-950/50 shrink-0">
                {isPro ? (
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(optimizedProfile);
                        setToastMessage({ msg: 'Optimized Bio copied to clipboard!', type: 'success' });
                      }}
                      className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
                    >
                      <FileCheck className="w-5 h-5" /> Copy Optimized Bio
                    </button>
                    <Link
                      href="/candidate-dashboard/settings"
                      className="flex-1 py-3.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-[14px]"
                    >
                      Update Profile
                    </Link>
                  </div>
                ) : (
                  <Link
                    href="/pro"
                    className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white rounded-xl font-black transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Sparkles className="w-5 h-5" /> Upgrade to PRO to Unlock Optimized Bio
                  </Link>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
