"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import ReactPaginate from "react-paginate";
import slugify from "react-slugify";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Wallet,
  Briefcase,
  Calendar,
  Share2,
  Clock,
  Building2,
  Star,
  ExternalLink,
  Search,
  Bookmark,
  CheckCircle2,
  TrendingUp,
  Filter,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Globe
} from "lucide-react";

const PER_PAGE = 6;

// Custom Toast Component to avoid messy vanilla DOM manipulation
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
      className={`fixed bottom-6 right-6 z-[9999] px-6 py-4 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.15)] backdrop-blur-xl border border-white/20 flex items-center gap-3 font-semibold text-[14px] ${
        type === "success" ? "bg-emerald-500/95 text-white" : "bg-blue-600/95 text-white"
      }`}
    >
      <CheckCircle2 className="w-5 h-5 opacity-90" />
      {message}
    </motion.div>
  );
};

export default function Jobcard(props: any) {
  const [currentPage, setCurrentPage] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [savedJobs, setSavedJobs] = useState<number[]>([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [jobStats, setJobStats] = useState({
    total: 0,
    newToday: 0,
    companies: 0,
    remote: 0
  });

  const [toastMessage, setToastMessage] = useState<{msg: string, type: string} | null>(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('candidate') || 'null');
    const userId = user?.id || 'anonymous';
    const saved = localStorage.getItem(`savedJobs_${userId}`);
    if (saved) {
      setSavedJobs(JSON.parse(saved));
    }
  }, []);

  const handlePageClick = ({ selected }: any) => {
    setCurrentPage(selected);
  };

  const allJobs = props.allJobs || [];
  
  let offset = currentPage * PER_PAGE;
  let currentPageJob = allJobs.slice(offset, offset + PER_PAGE);
  let pageCount = Math.ceil(allJobs.length / PER_PAGE);
  let jobsToDisplay = allJobs;

  if (props.searchedJobs && props.searchedJobs.length > 0) {
    offset = currentPage * PER_PAGE;
    currentPageJob = props.searchedJobs.slice(offset, offset + PER_PAGE);
    pageCount = Math.ceil(props.searchedJobs.length / PER_PAGE);
    jobsToDisplay = props.searchedJobs;
  }

  const isFeatured = (post: any) => post.featured || post.is_featured || post.premium || false;

  const isWithinDays = (dateString: string, days: number) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= days;
  };

  const isUrgentHiring = (post: any) => post.urgent_hiring || post.is_urgent || post.urgent || (post.created_at && isWithinDays(post.created_at, 2));

  const isRemote = (job: any) => job.location && (
    job.location.toLowerCase().includes('remote') ||
    job.location.toLowerCase().includes('work from home') ||
    job.location.toLowerCase().includes('wfh')
  );

  // Apply visual filter
  if (selectedFilter !== "all") {
    currentPageJob = currentPageJob.filter((job: any) => {
      if (selectedFilter === "featured") return isFeatured(job);
      if (selectedFilter === "urgent") return isUrgentHiring(job);
      if (selectedFilter === "remote") return isRemote(job);
      return true;
    });
  }

  useEffect(() => {
    if (jobsToDisplay && jobsToDisplay.length > 0) {
      const todayString = new Date().toISOString().split('T')[0];
      
      const newToday = jobsToDisplay.filter((job: any) => {
        if(!job.created_at) return false;
        return new Date(job.created_at).toISOString().split('T')[0] === todayString;
      }).length;

      const uniqueCompanies = [...new Set(jobsToDisplay.map((job: any) => job.title))].length;
      const remoteJobs = jobsToDisplay.filter((job: any) => isRemote(job)).length;

      setJobStats({
        total: jobsToDisplay.length,
        newToday,
        companies: uniqueCompanies,
        remote: remoteJobs
      });
    }
  }, [jobsToDisplay]);

  const toggleSaveJob = (post: any) => {
    const user = JSON.parse(localStorage.getItem('candidate') || 'null');
    const userId = user?.id || 'anonymous';
    const savedKey = `savedJobs_${userId}`;
    const detailsKey = `savedJobsDetails_${userId}`;

    const jobId: number = post.id;
    setSavedJobs(prev => {
      const isSaved = prev.includes(jobId);
      const updated = isSaved ? prev.filter(id => id !== jobId) : [...prev, jobId];
      localStorage.setItem(savedKey, JSON.stringify(updated));

      const details: Record<string, any> = JSON.parse(localStorage.getItem(detailsKey) || '{}');
      if (isSaved) {
        delete details[String(jobId)];
      } else {
        details[String(jobId)] = {
          id: post.id,
          role: post.role,
          title: post.title,
          location: post.location,
          pay: post.pay,
          image: post.image,
          created_at: post.created_at,
          slug: post.title ? post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : String(jobId),
        };
      }
      localStorage.setItem(detailsKey, JSON.stringify(details));

      setToastMessage({
        msg: isSaved ? 'Job removed from saved' : 'Job saved securely!',
        type: 'success'
      });
      return updated;
    });
  };

  const handleShare = async (post: any) => {
    const jobTitle = post.title || "Job Opportunity";
    const jobLocation = post.location || "Unknown Location";
    const jobPay = post.pay || "Salary not disclosed";
    const jobURL = `${window.location.origin}/job/${post.id}/${slugify(jobTitle)}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${post.role} at ${jobTitle}`,
          text: `Check out this opportunity: ${post.role} at ${jobTitle}, ${jobLocation}. Pay: ${jobPay}.`,
          url: jobURL,
        });
        setToastMessage({ msg: 'Job shared successfully!', type: 'success' });
      } catch (err) {
        console.log("Error sharing", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(jobURL);
        setToastMessage({ msg: 'Job link copied to clipboard!', type: 'success' });
      } catch (err) {
        setToastMessage({ msg: 'Failed to copy link.', type: 'error' });
      }
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffMinutes = Math.ceil(diffTime / (1000 * 60));
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
    return `${Math.floor(diffDays / 365)}y ago`;
  };

  const formatSalary = (salary: string) => {
    if (!salary) return "Not disclosed";
    return salary.replace(/(-|to|TO)/g, " - ").replace(/\s+/g, " ").trim();
  };

  useEffect(() => {
    if (currentPage > 0) {
      const jobsSection = document.getElementById('jobcards-section');
      if (jobsSection) {
        jobsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [currentPage]);

  if (props.loading) {
    return (
      <div className="w-full max-w-[1200px] mx-auto py-20 px-6 font-sora min-h-[50vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Fetching elite opportunities...</p>
      </div>
    );
  }

  if (!allJobs || allJobs.length === 0) {
    return (
      <div className="w-full max-w-[1200px] mx-auto py-24 px-6 font-sora min-h-[50vh] flex items-center justify-center">
        <div className="flex flex-col items-center text-center max-w-sm">
          <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-400 mb-6 shadow-inner">
            <Briefcase className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2 font-playfair tracking-tight">No Jobs Available</h3>
          <p className="text-slate-500 font-medium text-15px]">Our partner companies are currently preparing new listings. Please check back later.</p>
        </div>
      </div>
    );
  }

  if (props.searchedJobs && props.searchedJobs.length === 0) {
    return (
      <div className="w-full max-w-[1200px] mx-auto py-24 px-6 font-sora min-h-[50vh] flex items-center justify-center" id="jobcards-section">
        <div className="flex flex-col items-center text-center max-w-sm">
          <div className="w-20 h-20 bg-blue-50/50 rounded-3xl flex items-center justify-center text-blue-400 mb-6 shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)] border border-blue-100/50">
            <Search className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2 font-playfair tracking-tight">Zero Matches</h3>
          <p className="text-slate-500 font-medium text-[15px]">Try adjusting your search filters or browse our raw categories below.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto py-16 px-6 font-sora" id="jobcards-section">
      <AnimatePresence>
        {toastMessage && <Toast message={toastMessage.msg} type={toastMessage.type} onClose={() => setToastMessage(null)} />}
      </AnimatePresence>

      {/* SEO Section Heading */}
      <div className="mb-12 text-center md:text-left">
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 font-playfair tracking-tight leading-tight">
          {props.searchedJobs && props.searchedJobs.length > 0
            ? `Extracted ${props.searchedJobs.length} Results`
            : "Latest Elite Openings"}
        </h2>
        <p className="text-[15px] md:text-[17px] text-slate-500 font-medium max-w-2xl">
          {props.searchedJobs && props.searchedJobs.length > 0
            ? "Showing the most highly-rated jobs matching your exact search criteria."
            : "Discover top career opportunities deliberately curated from leading companies across India and Remote."}
        </p>
      </div>

      {/* Enhanced Stats Banner */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 bg-white border border-slate-200 shadow-[0_4px_20px_rgba(15,23,42,0.03)] rounded-3xl p-3 md:p-4 mb-10">
        <div className="flex flex-wrap items-center gap-1.5 md:gap-3 w-full lg:w-auto overflow-hidden divide-x divide-slate-100">
          <div className="flex items-center gap-3 px-3 md:px-5">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg md:text-xl font-bold text-slate-900 leading-none mb-1">{jobStats.total.toLocaleString()}</div>
              <div className="text-[11px] md:text-[12px] font-semibold text-slate-500 uppercase tracking-wider">Total</div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-3 md:px-5">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg md:text-xl font-bold text-slate-900 leading-none mb-1">{jobStats.newToday}</div>
              <div className="text-[11px] md:text-[12px] font-semibold text-slate-500 uppercase tracking-wider">New Today</div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-3 md:px-5">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg md:text-xl font-bold text-slate-900 leading-none mb-1">{jobStats.companies}</div>
              <div className="text-[11px] md:text-[12px] font-semibold text-slate-500 uppercase tracking-wider">Companies</div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-3 md:px-5">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg md:text-xl font-bold text-slate-900 leading-none mb-1">{jobStats.remote}</div>
              <div className="text-[11px] md:text-[12px] font-semibold text-slate-500 uppercase tracking-wider">Remote</div>
            </div>
          </div>
        </div>

        {/* Filter Bar Segment */}
        <div className="flex items-center p-1.5 bg-slate-50 border border-slate-200 rounded-2xl w-full lg:w-auto overflow-x-auto no-scrollbar">
          {['all', 'featured', 'urgent', 'remote'].map(filter => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold capitalize transition-all whitespace-nowrap ${
                selectedFilter === filter 
                  ? 'bg-white shadow-sm text-blue-600 border border-slate-200/50' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-transparent'
              }`}
            >
              {filter === 'featured' && <Star className="w-4 h-4" />}
              {filter === 'urgent' && <Clock className="w-4 h-4" />}
              {filter === 'remote' && <Globe className="w-4 h-4" />}
              {filter === 'all' && <Filter className="w-4 h-4" />}
              {filter === 'all' ? 'All Jobs' : filter}
            </button>
          ))}
        </div>
      </div>

      {/* Modern Grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentPageJob.length === 0 ? (
          <div className="col-span-full py-16 flex flex-col items-center justify-center text-slate-400 bg-white border border-slate-200 rounded-3xl border-dashed">
            <Filter className="w-12 h-12 mb-3 opacity-50" />
            <span className="font-medium text-[15px]">No jobs match this specific filter. Try another one.</span>
          </div>
        ) : (
          currentPageJob.map((post: any) => (
            <div 
              key={post.id}
              className={`group relative bg-white border rounded-[2rem] p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(37,99,235,0.06)] flex flex-col ${
                isFeatured(post) ? 'border-amber-200/60 shadow-[0_4px_20px_rgba(245,158,11,0.05)]' : 'border-slate-200 hover:border-blue-200'
              }`}
              onMouseEnter={() => setHoveredCard(post.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              
              {/* Top Tags row */}
              <div className="flex items-center justify-between mb-5 h-8">
                <div className="flex gap-2">
                  {isFeatured(post) && (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-[11px] font-bold tracking-wide uppercase border border-amber-100">
                      <Star className="w-3.5 h-3.5" /> Featured
                    </div>
                  )}
                  {isUrgentHiring(post) && (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-[11px] font-bold tracking-wide uppercase border border-rose-100">
                      <Clock className="w-3.5 h-3.5" /> Urgent
                    </div>
                  )}
                </div>

                <button 
                  onClick={() => toggleSaveJob(post)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all bg-slate-50 hover:bg-slate-100 border border-slate-200 ${
                    savedJobs.includes(post.id) ? 'text-blue-600 bg-blue-50 border-blue-200' : 'text-slate-400 hover:text-blue-500'
                  }`}
                  title={savedJobs.includes(post.id) ? 'Saved' : 'Save job'}
                >
                  <Bookmark className={`w-4 h-4 ${savedJobs.includes(post.id) ? 'fill-blue-600' : ''}`} />
                </button>
              </div>

              {/* Company Logo & Titles */}
              <div className="flex gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 overflow-hidden shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)] p-2">
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/${post.image}`}
                    alt={`${post.title} logo`}
                    loading="lazy"
                    className="w-full h-full object-contain"
                    onError={(e: any) => { e.target.src = '/logo.webp'; }}
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <h2 className="text-[17px] font-bold text-slate-900 leading-tight mb-1 group-hover:text-blue-600 transition-colors line-clamp-1" title={post.role}>
                    {post.role}
                  </h2>
                  <span className="text-[14px] text-slate-500 font-medium flex items-center gap-1.5 line-clamp-1" title={post.title}>
                    <Building2 className="w-3.5 h-3.5 opacity-70" /> {post.title}
                  </span>
                </div>
              </div>

              {/* Minimalist Details Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[13px] text-slate-600 font-medium">
                  <GraduationCap className="w-4 h-4 text-slate-400" />
                  <span className="truncate max-w-[120px]">{post.batches || "Any batch"}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[13px] text-slate-600 font-medium">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {isRemote(post) ? <span className="text-emerald-600 font-semibold">Remote</span> : <span className="truncate max-w-[120px]">{post.location || "TBD"}</span>}
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[13px] text-slate-600 font-medium">
                  <Wallet className="w-4 h-4 text-slate-400" />
                  <span className="truncate max-w-[100px]">{formatSalary(post.pay)}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-auto pt-5 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[12px] font-semibold text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(post.created_at)}
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleShare(post)}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-50 text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-all border border-transparent hover:border-blue-100"
                    title="Share opportunity"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <Link
                    href={`/job/${post.id}/${slugify(post.title)}`}
                    className="flex items-center gap-2 h-9 px-5 bg-slate-900 hover:bg-blue-600 text-white rounded-full text-[13px] font-bold transition-all shadow-[0_4px_10px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_20px_rgba(37,99,235,0.3)] hover:-translate-y-0.5"
                  >
                    View Role <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

      {/* Sleek Pagination */}
      {pageCount > 1 && (
        <div className="mt-16 flex justify-center">
          <ReactPaginate
            pageCount={pageCount}
            onPageChange={handlePageClick}
            forcePage={currentPage}
            marginPagesDisplayed={1}
            pageRangeDisplayed={3}
            previousLabel={
              <div className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-all opacity-80 hover:opacity-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                <ChevronLeft className="w-5 h-5" />
              </div>
            }
            nextLabel={
              <div className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-all opacity-80 hover:opacity-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                <ChevronRight className="w-5 h-5" />
              </div>
            }
            containerClassName="flex items-center justify-center gap-2 md:gap-3"
            pageClassName="flex"
            pageLinkClassName="w-10 h-10 flex items-center justify-center rounded-2xl text-[14px] font-bold text-slate-500 border border-transparent hover:bg-black/5 transition-all"
            activeClassName=""
            activeLinkClassName="!bg-slate-900 !text-white !border-slate-900 shadow-[0_4px_12px_rgba(15,23,42,0.2)]"
            disabledClassName="opacity-30 cursor-not-allowed pointer-events-none"
            breakLabel={<span className="text-slate-400 font-bold px-1">...</span>}
            breakClassName="flex items-center"
          />
        </div>
      )}
    </div>
  );
}
