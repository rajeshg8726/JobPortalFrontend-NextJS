"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
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
  FileText,
  Zap,
  CheckCircle2,
  SearchX,
  ChevronRight,
  Sparkles
} from 'lucide-react';

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
  const [job, setJob] = useState<any>(initialJob || null);
  const [loading, setLoading] = useState<boolean>(!initialJob);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [toastMessage, setToastMessage] = useState<{msg: string, type: string} | null>(null);

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
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-xl md:text-2xl font-bold text-blue-400">{job.title}</h2>
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

            </div>
          </div>

          {/* Right Sidebar (Sticky Tracker) */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 flex flex-col gap-6">
              
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

                  <p className="text-center text-[11px] font-bold text-slate-400 mt-5 uppercase tracking-widest">
                    Closes internally when filled
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
    </div>
  );
}
