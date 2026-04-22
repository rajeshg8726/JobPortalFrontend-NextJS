"use client";

import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { 
  Search, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Globe, 
  Code, 
  Zap, 
  Award, 
  Users, 
  ChevronRight,
  Sparkles,
  Building
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function Slider({ setSearchedJobs, setLoading }: any) {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [role, setRole] = useState("");
  const [activeSlide, setActiveSlide] = useState(0);
  const [isSearching, setIsSearching] = useState(false);

  const backendURL = process.env.NEXT_PUBLIC_API_URL;

  const slides = [
    { image: "/t1.webp" },
    { image: "/t2.webp" }
  ];

  // Auto-rotate background
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!role && !location && !searchTerm) {
      alert("Please enter at least one search criteria to find your perfect role.");
      return;
    }

    setIsSearching(true);
    if (setLoading) setLoading(true);

    try {
      const res = await axios.get(`${backendURL}/api/jobs-search`, {
        params: { 
          searchTerm: searchTerm.trim(), 
          location: location.trim(), 
          role: role.trim() 
        },
      });
      
      if (res.data && res.data.length > 0) {
        if (setSearchedJobs) setSearchedJobs(res.data);
        const jobsSection = document.querySelector('.premium-jobcard-container');
        if (jobsSection) {
          jobsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        if (setSearchedJobs) setSearchedJobs([]);
      }
    } catch (err) {
      console.error("Error fetching jobs:", err);
      alert("Error searching jobs. Please try again.");
    } finally {
      setIsSearching(false);
      if (setLoading) setLoading(false);
    }
  }, [searchTerm, location, role, backendURL, setSearchedJobs, setLoading]);

  return (
    <div className="w-full flex flex-col font-sora">
      {/* ===== HERO SECTION ===== */}
      <div className="relative w-full min-h-[85vh] flex flex-col items-center justify-center overflow-hidden bg-slate-950 pt-20 pb-16">
        
        {/* Dynamic Image Background */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 z-0"
          >
            <Image 
              src={slides[activeSlide].image}
              alt="Hero Background"
              fill
              priority
              className="object-cover opacity-60"
            />
          </motion.div>
        </AnimatePresence>

        {/* Sophisticated Gradient Mask */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-slate-950" />
        <div className="absolute inset-0 z-[2] bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.15),transparent_60%)]" />

        <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 flex flex-col items-center mt-10">
          
          {/* Animated Premium Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-[11px] sm:text-xs font-bold tracking-widest uppercase mb-8 backdrop-blur-md shadow-[0_0_20px_rgba(37,99,235,0.15)] ring-1 ring-blue-500/20"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Accelerate your career
          </motion.div>

          {/* Hero Typography */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-black text-white text-center tracking-tight mb-6 font-playfair leading-[1.1]"
          >
            Find the role that <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-400 animate-gradient-x">
              sparks your passion.
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-slate-400 text-base sm:text-lg md:text-xl text-center max-w-2xl mb-12 font-medium leading-relaxed px-4"
          >
            Discover exceptional opportunities at the world's most innovative companies. Your next elite career move starts exactly here.
          </motion.p>

          {/* Unified Glassmorphic Search Pill */}
          <motion.form 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
            onSubmit={handleSearch}
            className="w-full max-w-[1000px] bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-2 md:p-2.5 shadow-[0_30px_60px_rgba(0,0,0,0.4)] flex flex-col lg:flex-row gap-2 transition-all duration-500 hover:bg-white/10 hover:border-white/20 hover:shadow-[0_30px_80px_rgba(37,99,235,0.15)]"
          >
            
            <div className="flex-1 flex items-center gap-3 px-5 py-3.5 md:py-4 bg-slate-950/50 rounded-2xl group focus-within:bg-slate-900 border border-transparent focus-within:border-blue-500/50 transition-all">
              <Briefcase className="w-5 h-5 text-slate-500 group-focus-within:text-blue-400 shrink-0 transition-colors" />
              <input 
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Job Role (e.g. Developer)" 
                className="bg-transparent border-none outline-none text-white w-full placeholder:text-slate-500 text-[15px] font-medium"
                disabled={isSearching} 
              />
            </div>
            
            <div className="hidden lg:block w-[1px] h-12 bg-white/10 self-center" />
            
            <div className="flex-[0.8] flex items-center gap-3 px-5 py-3.5 md:py-4 bg-slate-950/50 rounded-2xl group focus-within:bg-slate-900 border border-transparent focus-within:border-blue-500/50 transition-all">
              <MapPin className="w-5 h-5 text-slate-500 group-focus-within:text-blue-400 shrink-0 transition-colors" />
              <input 
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, State, or Remote" 
                className="bg-transparent border-none outline-none text-white w-full placeholder:text-slate-500 text-[15px] font-medium" 
                disabled={isSearching}
              />
            </div>

            <div className="hidden lg:block w-[1px] h-12 bg-white/10 self-center" />

            <div className="flex-1 flex items-center gap-3 px-5 py-3.5 md:py-4 bg-slate-950/50 rounded-2xl group focus-within:bg-slate-900 border border-transparent focus-within:border-blue-500/50 transition-all">
              <Search className="w-5 h-5 text-slate-500 group-focus-within:text-blue-400 shrink-0 transition-colors" />
              <input 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Skills, Keywords, etc." 
                className="bg-transparent border-none outline-none text-white w-full placeholder:text-slate-500 text-[15px] font-medium" 
                disabled={isSearching}
              />
            </div>

            <button 
              type="submit"
              disabled={isSearching}
              className="lg:ml-2 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl px-8 py-4 font-bold text-[15px] flex items-center justify-center gap-2.5 transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] disabled:opacity-70 disabled:cursor-not-allowed disabled:shadow-none min-w-[140px]"
            >
              {isSearching ? (
                <>
                  <div className="w-5 h-5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                  <span>Searching</span>
                </>
              ) : (
                <>
                  <span>Search Jobs</span>
                </>
              )}
            </button>
          </motion.form>
          
          {/* Quick Trending Filters */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-10 flex flex-wrap justify-center items-center gap-3 w-full px-4"
          >
            <span className="text-sm text-slate-500 font-semibold mr-1 flex items-center gap-1.5 hidden sm:flex">
              <Sparkles className="w-4 h-4 text-amber-500" /> Trending:
            </span>
            <Link href="/jobs/Remote-Jobs" className="px-5 py-2.5 rounded-full border border-white/10 bg-white/5 text-slate-300 text-[13px] font-medium hover:bg-blue-500/20 hover:border-blue-500/50 hover:text-white transition-all backdrop-blur-md flex items-center gap-2">
              <Globe className="w-4 h-4" /> Remote
            </Link>
            <Link href="/jobsbyrole/software-developer-engineer-role" className="px-5 py-2.5 rounded-full border border-white/10 bg-white/5 text-slate-300 text-[13px] font-medium hover:bg-blue-500/20 hover:border-blue-500/50 hover:text-white transition-all backdrop-blur-md flex items-center gap-2">
              <Code className="w-4 h-4" /> Software
            </Link>
            <Link href="/jobsbytype/Internship-jobs" className="px-5 py-2.5 rounded-full border border-white/10 bg-white/5 text-slate-300 text-[13px] font-medium hover:bg-blue-500/20 hover:border-blue-500/50 hover:text-white transition-all backdrop-blur-md flex items-center gap-2">
              <Award className="w-4 h-4" /> Internships
            </Link>
            <Link href="/jobsbytype/Freshers-jobs" className="hidden sm:flex px-5 py-2.5 rounded-full border border-white/10 bg-white/5 text-slate-300 text-[13px] font-medium hover:bg-blue-500/20 hover:border-blue-500/50 hover:text-white transition-all backdrop-blur-md items-center gap-2">
              <GraduationCap className="w-4 h-4" /> Freshers
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ===== TRUST BAR ===== */}
      <div className="w-full border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 mt-0">
        <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-100 dark:divide-slate-800/60">
          <div className="p-6 md:p-10 flex flex-col items-center justify-center text-center group">
            <span className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 transition-colors">1k+</span>
            <span className="text-[11px] md:text-xs font-bold text-slate-500 uppercase tracking-widest">Active Jobs</span>
          </div>
          <div className="p-6 md:p-10 flex flex-col items-center justify-center text-center group">
            <span className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 transition-colors">500+</span>
            <span className="text-[11px] md:text-xs font-bold text-slate-500 uppercase tracking-widest">Top Companies</span>
          </div>
          <div className="p-6 md:p-10 flex flex-col items-center justify-center text-center group">
            <span className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 transition-colors">10k+</span>
            <span className="text-[11px] md:text-xs font-bold text-slate-500 uppercase tracking-widest">Global Users</span>
          </div>
          <div className="p-6 md:p-10 flex flex-col items-center justify-center text-center group">
            <span className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 transition-colors">100%</span>
            <span className="text-[11px] md:text-xs font-bold text-slate-500 uppercase tracking-widest">Free Access</span>
          </div>
        </div>
      </div>

      {/* ===== EXPLORE CATEGORIES ===== */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white font-playfair mb-3 tracking-tight">Explore by Category</h2>
              <p className="text-slate-500 dark:text-slate-400 text-lg">Find the perfect role from our expertly curated lists.</p>
            </div>
            <Link href="/" className="text-blue-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
              Browse all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <Link href="/jobsbyrole/software-developer-engineer-role" className="group p-8 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-500/30 hover:shadow-[0_20px_40px_rgba(37,99,235,0.08)] dark:hover:shadow-[0_20px_40px_rgba(37,99,235,0.05)] transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:bg-blue-600 group-hover:text-white">
                <Code className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Software Development</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium">100+ Elite engineering roles</p>
            </Link>

            <Link href="/jobsbyrole/data-scientist-role" className="group p-8 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-200 dark:hover:border-purple-500/30 hover:shadow-[0_20px_40px_rgba(168,85,247,0.08)] transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:bg-purple-600 group-hover:text-white">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Data Science & AI</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium">100+ Future-ready positions</p>
            </Link>

            <Link href="/jobs/Remote-Jobs" className="group p-8 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-500/30 hover:shadow-[0_20px_40px_rgba(16,185,129,0.08)] transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:bg-emerald-600 group-hover:text-white">
                <Globe className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Remote Opportunities</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium">100+ Work from anywhere</p>
            </Link>

            <Link href="/jobs/2025-batch" className="group p-8 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-200 dark:hover:border-amber-500/30 hover:shadow-[0_20px_40px_rgba(245,158,11,0.08)] transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:bg-amber-500 group-hover:text-white">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Class of 2026</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Exclusive graduate roles</p>
            </Link>

            <Link href="/jobsbytype/Internship-jobs" className="group p-8 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-pink-200 dark:hover:border-pink-500/30 hover:shadow-[0_20px_40px_rgba(236,72,153,0.08)] transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-pink-50 dark:bg-pink-500/10 text-pink-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:bg-pink-600 group-hover:text-white">
                <Award className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Top Internships</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium">100+ Kickstart your career</p>
            </Link>

            <Link href="/jobsbytype/Freshers-jobs" className="group p-8 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-200 dark:hover:border-cyan-500/30 hover:shadow-[0_20px_40px_rgba(6,182,212,0.08)] transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:bg-cyan-600 group-hover:text-white">
                <GraduationCap className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Freshers Hiring</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium">100+ Entry-level positions</p>
            </Link>

          </div>
        </div>
      </section>
    </div>
  );
}
