"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import ReactPaginate from "react-paginate";
import slugify from "react-slugify";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Wallet, Briefcase, Calendar, Share2, Clock, 
  Building2, Star, ExternalLink, Search, Bookmark, 
  CheckCircle2, Filter, GraduationCap, ChevronLeft, ChevronRight, X
} from "lucide-react";

export interface JobsBrowserProps {
  initialSearch?: string;
  initialLocations?: string[];
  initialRoles?: string[];
  initialBatches?: string[];
  initialExperience?: string[];
  initialJobType?: string[];
  pageTitle?: string;
  pageDescription?: string;
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
      className={`fixed bottom-6 right-6 z-[9999] px-6 py-4 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.15)] backdrop-blur-xl border border-white/20 flex items-center gap-3 font-semibold text-[14px] ${
        type === "success" ? "bg-emerald-500/95 text-white" : "bg-blue-600/95 text-white"
      }`}
    >
      <CheckCircle2 className="w-5 h-5 opacity-90" />
      {message}
    </motion.div>
  );
};

export default function JobsBrowser(props: JobsBrowserProps) {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalJobs, setTotalJobs] = useState(0);

  // Filters State
  const [searchTerm, setSearchTerm] = useState(props.initialSearch || "");
  const [locations, setLocations] = useState<string[]>(props.initialLocations || []);
  const [roles, setRoles] = useState<string[]>(props.initialRoles || []);
  const [batches, setBatches] = useState<string[]>(props.initialBatches || []);
  const [experience, setExperience] = useState<string[]>(props.initialExperience || []);
  const [jobType, setJobType] = useState<string[]>(props.initialJobType || []);

  const [savedJobs, setSavedJobs] = useState<number[]>([]);
  const [toastMessage, setToastMessage] = useState<{msg: string, type: string} | null>(null);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('candidate') || 'null');
    const userId = user?.id || 'anonymous';
    const saved = localStorage.getItem(`savedJobs_${userId}`);
    if (saved) {
      setSavedJobs(JSON.parse(saved));
    }
  }, []);

  const fetchJobs = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/filter?page=${page + 1}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          search: searchTerm,
          locations,
          roles,
          batches,
          experience,
          jobType
        })
      });
      const data = await response.json();
      if (data.success) {
        setJobs(data.jobs || []);
        setTotalPages(data.totalPages || 0);
        setTotalJobs(data.total || 0);
      } else if (Array.isArray(data)) {
        // Fallback if the backend hasn't been updated perfectly yet and just returns an array
        setJobs(data);
        setTotalPages(Math.ceil(data.length / 10));
        setTotalJobs(data.length);
      }
    } catch (error) {
      console.error("Failed to fetch jobs", error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, locations, roles, batches, experience, jobType]);

  // Debounce filter changes
  useEffect(() => {
    setCurrentPage(0); // Reset to page 0 on filter change
    const timer = setTimeout(() => {
      fetchJobs(0);
    }, 400); // 400ms debounce
    return () => clearTimeout(timer);
  }, [searchTerm, locations, roles, batches, experience, jobType, fetchJobs]);

  const handlePageClick = ({ selected }: any) => {
    setCurrentPage(selected);
    fetchJobs(selected);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterToggle = (category: string, value: string) => {
    const updater = (prev: string[]) => 
      prev.includes(value) ? prev.filter(i => i !== value) : [...prev, value];

    if (category === 'locations') setLocations(updater);
    if (category === 'roles') setRoles(updater);
    if (category === 'batches') setBatches(updater);
    if (category === 'experience') setExperience(updater);
    if (category === 'jobType') setJobType(updater);
  };

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

      // Store / remove full job details so the dashboard Saved Jobs page needs no API call
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
        msg: isSaved ? 'Job removed from saved' : 'Job saved!',
        type: 'success',
      });
      return updated;
    });
  };

  // Track recently viewed jobs (for dashboard Overview page)
  const trackRecentlyViewed = (post: any) => {
    const key = 'recentlyViewed';
    const existing: any[] = JSON.parse(localStorage.getItem(key) || '[]');
    const filtered = existing.filter((j: any) => j.id !== post.id);
    const updated = [{
      id: post.id,
      role: post.role,
      title: post.title,
      image: post.image,
      location: post.location,
      pay: post.pay,
      created_at: post.created_at,
      slug: post.title ? post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : String(post.id),
    }, ...filtered].slice(0, 20);
    localStorage.setItem(key, JSON.stringify(updated));
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setLocations([]);
    setRoles([]);
    setBatches([]);
    setExperience([]);
    setJobType([]);
  };

  const hasActiveFilters = locations.length > 0 || roles.length > 0 || batches.length > 0 || experience.length > 0 || jobType.length > 0 || searchTerm !== "";

  // Helper renderings
  const isFeatured = (post: any) => post.featured || post.is_featured || post.premium || false;
  const isUrgentHiring = (post: any) => post.urgent_hiring || post.is_urgent || false;
  const isRemote = (job: any) => job.location && (
    job.location.toLowerCase().includes('remote') ||
    job.location.toLowerCase().includes('work from home') ||
    job.location.toLowerCase().includes('wfh')
  );

  const formatSalary = (salary: string) => {
    if (!salary) return "Not disclosed";
    return salary.replace(/(-|to|TO)/g, " - ").replace(/\s+/g, " ").trim();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    const diffTime = Math.abs(new Date().getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Filter Categories Settings
  const FILTER_OPTIONS = {
    locations: ["Bengaluru", "Remote", "Hyderabad", "Pune", "Mumbai", "Delhi NCR", "Chennai", "Noida", "Gurugram"],
    roles: ["Software Developer", "Frontend Developer", "Backend Developer", "Full Stack Developer", "Data Scientist", "DevOps Engineer", "UI/UX Designer", "Product Manager"],
    batches: ["2028", "2027", "2026", "2025", "2024", "2023"],
    jobType: ["Full-Time", "Internship", "Contract"],
    experience: ["Fresher", "1-3 Years", "3-5 Years", "5+ Years"]
  };

  return (
    <div className="w-full min-h-screen bg-slate-50/50 font-sora py-12">
      <AnimatePresence>
        {toastMessage && <Toast message={toastMessage.msg} type={toastMessage.type} onClose={() => setToastMessage(null)} />}
      </AnimatePresence>

      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* Header Section */}
        <div className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 font-playfair tracking-tight leading-tight">
              {props.pageTitle || "Premium Job Hub"}
            </h1>
            <p className="text-[16px] md:text-[18px] text-slate-500 font-medium max-w-2xl">
              {props.pageDescription || "Explore thousands of curated tech opportunities tailored to your skills, location, and graduation batch."}
            </p>
          </div>

          <div className="flex items-center gap-4">
             <button 
                onClick={() => setIsMobileFiltersOpen(true)}
                className="md:hidden flex-1 flex items-center justify-center gap-2 px-5 py-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm text-slate-700 font-bold"
             >
                <Filter className="w-5 h-5" /> Filters {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-blue-600"></span>}
             </button>
             <div className="hidden md:flex items-center px-4 py-3 bg-white border border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-2xl w-[320px]">
                <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
                <input 
                  type="text" 
                  placeholder="Seach role, company, skills..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-[15px] font-medium text-slate-800 placeholder-slate-400"
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm("")} className="ml-2 text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                )}
             </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* Left Sidebar Filters - Desktop */}
          <div className={`fixed inset-0 z-50 bg-white/80 backdrop-blur-xl md:static md:bg-transparent md:backdrop-blur-none transition-all duration-300 md:block md:w-[300px] shrink-0 ${isMobileFiltersOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto'}`}>
            <div className={`absolute top-0 right-0 bottom-0 w-[300px] bg-white border-l border-slate-200 shadow-2xl md:static md:w-full md:bg-white md:border md:border-slate-200 md:shadow-[0_4px_20px_rgba(0,0,0,0.03)] md:rounded-[2rem] flex flex-col h-full overflow-hidden transition-transform duration-300 ${isMobileFiltersOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}>
              
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-bold text-slate-900">Filters</h3>
                </div>
                <div className="flex items-center gap-3">
                  {hasActiveFilters && (
                    <button onClick={clearAllFilters} className="text-[13px] font-bold text-slate-500 hover:text-blue-600 transition-colors">
                      Clear
                    </button>
                  )}
                  <button onClick={() => setIsMobileFiltersOpen(false)} className="md:hidden w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto flex-1 custom-scrollbar flex flex-col gap-8">
                
                {/* Location Filter */}
                <FilterSection title="Location" type="locations" options={FILTER_OPTIONS.locations} current={locations} onChange={handleFilterToggle} />
                <FilterSection title="Role / Domain" type="roles" options={FILTER_OPTIONS.roles} current={roles} onChange={handleFilterToggle} />
                <FilterSection title="Graduation Batch" type="batches" options={FILTER_OPTIONS.batches} current={batches} onChange={handleFilterToggle} />
                <FilterSection title="Job Type" type="jobType" options={FILTER_OPTIONS.jobType} current={jobType} onChange={handleFilterToggle} />
                <FilterSection title="Experience" type="experience" options={FILTER_OPTIONS.experience} current={experience} onChange={handleFilterToggle} />

              </div>
              
              <div className="p-5 border-t border-slate-100 bg-slate-50 md:hidden">
                 <button onClick={() => setIsMobileFiltersOpen(false)} className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center shadow-lg shadow-blue-600/20">
                   Show {totalJobs} Results
                 </button>
              </div>

            </div>
            
            {/* Mobile overlay backdrop */}
            {isMobileFiltersOpen && (
              <div onClick={() => setIsMobileFiltersOpen(false)} className="absolute inset-0 bg-slate-900/20 md:hidden -z-10 backdrop-blur-sm"></div>
            )}
          </div>

          {/* Right Content - Grid */}
          <div className="flex-1 w-full min-w-0">
            
            <div className="flex items-center justify-between mb-8">
              <div className="text-slate-600 font-medium">
                {loading ? "Searching..." : `Showing ${totalJobs} opportunities`}
              </div>
            </div>

            {loading ? (
              // Loading Skeletons
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                 {[1,2,3,4,5,6].map(i => (
                    <div key={i} className="bg-white border border-slate-100 rounded-[2rem] p-6 h-[280px] animate-pulse">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 bg-slate-100 rounded-2xl"></div>
                        <div className="flex-1">
                          <div className="h-5 bg-slate-100 rounded-md w-3/4 mb-2.5"></div>
                          <div className="h-4 bg-slate-50 rounded-md w-1/2"></div>
                        </div>
                      </div>
                      <div className="flex gap-2 mb-8">
                         <div className="w-24 h-8 bg-slate-50 rounded-lg"></div>
                         <div className="w-20 h-8 bg-slate-50 rounded-lg"></div>
                         <div className="w-28 h-8 bg-slate-50 rounded-lg"></div>
                      </div>
                      <div className="mt-auto flex justify-between">
                         <div className="w-20 h-5 bg-slate-50 rounded-md"></div>
                         <div className="w-24 h-9 bg-slate-50 rounded-full"></div>
                      </div>
                    </div>
                 ))}
              </div>
            ) : jobs.length === 0 ? (
              // Empty State
              <div className="w-full py-24 flex flex-col items-center justify-center text-center bg-white border border-slate-200 border-dashed rounded-[2rem]">
                <div className="w-20 h-20 bg-blue-50/50 rounded-3xl flex items-center justify-center text-blue-400 mb-6 border border-blue-100/50">
                  <Search className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2 font-playfair">No matches found</h3>
                <p className="text-slate-500 font-medium">Try adjusting your filters or expanding your search criteria.</p>
                {hasActiveFilters && (
                  <button onClick={clearAllFilters} className="mt-6 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition-colors shadow-lg">
                    Reset All Filters
                  </button>
                )}
              </div>
            ) : (
               <>
                {/* Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                   <AnimatePresence>
                    {jobs.map((post: any, i) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.05 }}
                        className={`group relative bg-white border rounded-[2rem] p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(37,99,235,0.06)] flex flex-col ${
                          isFeatured(post) ? 'border-amber-200/60 shadow-[0_4px_20px_rgba(245,158,11,0.05)]' : 'border-slate-200 hover:border-blue-200'
                        }`}
                        key={post.id}
                      >
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
                            >
                              <Bookmark className={`w-4 h-4 ${savedJobs.includes(post.id) ? 'fill-blue-600' : ''}`} />
                            </button>
                         </div>

                         <div className="flex gap-4 mb-6">
                            <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shrink-0 overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-2">
                              <img
                                src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/${post.image}`}
                                alt={`${post.title} logo`}
                                loading="lazy"
                                className="w-full h-full object-contain"
                                onError={(e: any) => { e.target.src = '/logo.webp'; }}
                              />
                            </div>
                            <div className="flex flex-col justify-center">
                              <h2 className="text-[17px] font-bold text-slate-900 leading-tight mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
                                {post.role}
                              </h2>
                              <span className="text-[14px] text-slate-500 font-medium flex items-center gap-1.5 line-clamp-1">
                                <Building2 className="w-3.5 h-3.5 opacity-70" /> {post.title}
                              </span>
                            </div>
                         </div>

                         <div className="flex flex-wrap gap-2 mb-8 mt-auto">
                            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[13px] text-slate-600 font-medium">
                              <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                              <span className="truncate max-w-[100px]">{post.batches || "Any batch"}</span>
                            </div>
                            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[13px] text-slate-600 font-medium">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              {isRemote(post) ? <span className="text-emerald-600 font-semibold">Remote</span> : <span className="truncate max-w-[100px]">{post.location || "TBD"}</span>}
                            </div>
                            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[13px] text-slate-600 font-medium">
                              <Wallet className="w-3.5 h-3.5 text-slate-400" />
                              <span className="truncate max-w-[90px]">{formatSalary(post.pay)}</span>
                            </div>
                         </div>

                         <div className="pt-5 border-t border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-[12px] font-semibold text-slate-400">
                              <Calendar className="w-3.5 h-3.5" />
                              {formatDate(post.created_at)}
                            </div>
                            <div className="flex items-center gap-2">
                              <Link
                                href={`/job/${post.id}/${slugify(post.title)}`}
                                onClick={() => trackRecentlyViewed(post)}
                                className="flex items-center gap-2 h-9 px-5 bg-slate-900 hover:bg-blue-600 text-white rounded-full text-[13px] font-bold transition-all shadow-sm"
                              >
                                View Role
                              </Link>
                            </div>
                         </div>
                      </motion.div>
                    ))}
                   </AnimatePresence>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-16 flex justify-center">
                    <ReactPaginate
                      pageCount={totalPages}
                      onPageChange={handlePageClick}
                      forcePage={currentPage}
                      marginPagesDisplayed={1}
                      pageRangeDisplayed={3}
                      previousLabel={
                        <div className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-600 transition-all opacity-80 hover:opacity-100 hover:border-blue-300">
                          <ChevronLeft className="w-5 h-5" />
                        </div>
                      }
                      nextLabel={
                        <div className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-600 transition-all opacity-80 hover:opacity-100 hover:border-blue-300">
                          <ChevronRight className="w-5 h-5" />
                        </div>
                      }
                      containerClassName="flex items-center gap-2"
                      pageClassName="flex"
                      pageLinkClassName="w-10 h-10 flex items-center justify-center rounded-2xl text-[14px] font-bold text-slate-500 border border-transparent hover:bg-slate-100 transition-all"
                      activeClassName=""
                      activeLinkClassName="!bg-slate-900 !text-white !border-slate-900 shadow-lg"
                      disabledClassName="opacity-30 pointer-events-none"
                      breakLabel={<span className="text-slate-400 font-bold px-1">...</span>}
                      breakClassName="flex items-center"
                    />
                  </div>
                )}
               </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

// Subcomponent for filter sections
function FilterSection({ title, type, options, current, onChange }: { title: string, type: string, options: string[], current: string[], onChange: (type: string, value: string) => void }) {
  const [isExpanded, setIsExpanded] = useState(true);
  
  return (
    <div>
      <div 
        className="flex items-center justify-between mb-3 cursor-pointer group"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h4 className="text-[14px] font-bold text-slate-900 uppercase tracking-wide group-hover:text-blue-600 transition-colors">{title}</h4>
        <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
      </div>
      
      {isExpanded && (
        <div className="flex flex-col gap-2.5">
          {options.map((opt) => {
            const isActive = current.includes(opt);
            return (
              <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="hidden" 
                  checked={isActive} 
                  onChange={() => onChange(type, opt)} 
                />
                <div className={`w-5 h-5 rounded-[6px] border flex items-center justify-center transition-all ${
                  isActive ? 'bg-blue-600 border-blue-600 shadow-[0_2px_8px_rgba(37,99,235,0.25)]' : 'bg-white border-slate-300 group-hover:border-blue-400'
                }`}>
                  {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                </div>
                <span className={`text-[14px] font-medium transition-colors ${isActive ? 'text-slate-900 font-bold' : 'text-slate-600 group-hover:text-slate-900'}`}>
                  {opt}
                </span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
