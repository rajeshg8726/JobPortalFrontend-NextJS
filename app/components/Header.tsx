"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
  ChevronRight,
  Sparkles,
  LayoutDashboard,
  Search,
  Building2,
  Phone,
  Settings,
  Info
} from "lucide-react";
import DarkModeToggle from "./DarkModeToggle";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isDesktopJobsOpen, setIsDesktopJobsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    
    // Check auth status
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      const userType = localStorage.getItem("userType");
      const savedUser = localStorage.getItem(userType === "Candidate" ? "candidate" : "employer");
      if (savedUser) {
        setUserProfile(JSON.parse(savedUser));
      }
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setUserProfile(null);
    window.location.href = "/";
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Find Jobs", path: "/jobs", hasDropdown: true },
    { name: "Companies", path: "/companies" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const jobCategories = [
    { name: "Software Development", path: "/jobsbyrole/software-developer-engineer-role" },
    { name: "Remote Jobs", path: "/jobs/Remote-Jobs" },
    { name: "Internships", path: "/jobsbytype/Internship-jobs" },
    { name: "Fresher Roles", path: "/jobsbytype/Freshers-jobs" },
    { name: "2026 Batch", path: "/jobs/2026-batch" },
  ];

  const isActive = (path: string) => pathname === path || (path !== "/" && pathname?.startsWith(path));

  return (
    <>
      <header 
        className={`fixed top-0 w-full z-[100] transition-all duration-500 border-b ${
          isScrolled 
            ? "bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-slate-200 dark:border-slate-800 shadow-sm" 
            : "bg-white/40 dark:bg-slate-950/40 backdrop-blur-sm border-transparent"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 h-[72px] flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center group relative">
            <div className="h-11 group-hover:scale-105 transition-transform duration-300">
              <img src="/logo.webp" alt="RGJobs" className="h-full w-auto object-contain" />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/50 dark:bg-slate-800/50 p-1.5 rounded-full border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-md">
            {navLinks.map((link) => (
              <div 
                key={link.name} 
                className="relative"
                onMouseEnter={() => link.hasDropdown && setIsDesktopJobsOpen(true)}
                onMouseLeave={() => link.hasDropdown && setIsDesktopJobsOpen(false)}
              >
                <Link 
                  href={link.path}
                  className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-[14px] font-semibold transition-all duration-300 ${
                    isActive(link.path) 
                      ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm" 
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  {link.name}
                  {link.hasDropdown && (
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isDesktopJobsOpen ? 'rotate-180' : ''}`} />
                  )}
                </Link>

                {/* Desktop Dropdown Mega Menu (Glassmorphic) */}
                {link.hasDropdown && (
                  <AnimatePresence>
                    {isDesktopJobsOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-[120%] left-1/2 -translate-x-1/2 w-[280px] bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-slate-200 dark:border-slate-700/50 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.4)] overflow-hidden"
                      >
                        <div className="p-3">
                          <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 mb-2">
                            Explore Categories
                          </div>
                          {jobCategories.map((cat, idx) => (
                            <Link 
                              key={idx} 
                              href={cat.path}
                              className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors group"
                            >
                              <span className="text-[14px] font-semibold text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                {cat.name}
                              </span>
                              <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </nav>

          {/* Actions & Profile (Desktop) */}
          <div className="hidden lg:flex items-center gap-5">
            <DarkModeToggle />

            {!isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link 
                  href="/login" 
                  className="px-5 py-2.5 text-[14px] font-bold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Log in
                </Link>
                <Link 
                  href="/role-selection" 
                  className="px-6 py-2.5 text-[14px] font-bold text-white bg-slate-900 dark:bg-blue-600 rounded-full hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all shadow-[0_4px_14px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Sign up
                </Link>
              </div>
            ) : (
              <div className="relative">
                <button 
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-3 p-1.5 pr-4 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all bg-white dark:bg-slate-900"
                >
                  <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold overflow-hidden">
                    {userProfile?.profileImage ? (
                      <img src={`${process.env.NEXT_PUBLIC_API_URL}/${userProfile.profileImage}`} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[13px] font-bold text-slate-900 dark:text-white leading-none">
                      {userProfile?.fullName || userProfile?.companyName || "User"}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium mt-1 uppercase tracking-wider">
                      {localStorage.getItem("userType")}
                    </span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-slate-400 ml-1 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isProfileDropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-[120%] w-[220px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 rounded-2xl shadow-xl overflow-hidden py-2"
                    >
                      <Link 
                        href={`/${localStorage.getItem("userType")?.toLowerCase()}-dashboard`} 
                        className="flex items-center gap-3 px-5 py-3 text-[14px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <LayoutDashboard className="w-4 h-4 text-blue-500" />
                        Dashboard
                      </Link>
                      <Link 
                        href={`/${localStorage.getItem("userType")?.toLowerCase()}-dashboard/settings`} 
                        className="flex items-center gap-3 px-5 py-3 text-[14px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <Settings className="w-4 h-4 text-slate-400" />
                        Settings
                      </Link>
                      <div className="h-px bg-slate-200 dark:bg-slate-700/50 my-1 mx-4" />
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-5 py-3 text-[14px] font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Log out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-3 lg:hidden">
            <DarkModeToggle />
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[90] bg-slate-900/60 backdrop-blur-sm lg:hidden pt-[72px]"
          >
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute right-0 top-[72px] bottom-0 w-[85%] max-w-[360px] bg-white dark:bg-slate-900 shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 overflow-y-auto"
            >
              <div className="p-6 flex flex-col gap-8">
                
                {/* Mobile Account Section */}
                {isAuthenticated && userProfile ? (
                  <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold overflow-hidden border-2 border-white dark:border-slate-800">
                      {userProfile.profileImage ? (
                        <img src={`${process.env.NEXT_PUBLIC_API_URL}/${userProfile.profileImage}`} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {userProfile.fullName || userProfile.companyName || "User"}
                      </span>
                      <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                        {localStorage.getItem("userType")}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="py-3 text-center rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700">Log in</Link>
                    <Link href="/role-selection" onClick={() => setIsMobileMenuOpen(false)} className="py-3 text-center rounded-xl bg-blue-600 font-bold text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20">Sign up</Link>
                  </div>
                )}

                {/* Mobile Links */}
                <div className="flex flex-col gap-2">
                  <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 px-2">Menu</div>
                  {navLinks.map((link) => (
                    <Link 
                      key={link.name} 
                      href={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center justify-between p-3 rounded-xl font-semibold transition-colors ${
                        isActive(link.path) 
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" 
                          : "text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {link.name === "Home" && <LayoutDashboard className="w-5 h-5 opacity-50" />}
                        {link.name === "Find Jobs" && <Search className="w-5 h-5 opacity-50" />}
                        {link.name === "Companies" && <Building2 className="w-5 h-5 opacity-50" />}
                        {link.name === "About" && <Info className="w-5 h-5 opacity-50" />}
                        {link.name === "Contact" && <Phone className="w-5 h-5 opacity-50" />}
                        {link.name}
                      </div>
                      {link.hasDropdown && <ChevronRight className="w-4 h-4 opacity-50" />}
                    </Link>
                  ))}
                </div>

                {/* Auth Actions Mobile */}
                {isAuthenticated && (
                  <div className="mt-auto border-t border-slate-100 dark:border-slate-800 pt-6">
                    <Link 
                      href={`/${localStorage.getItem("userType")?.toLowerCase()}-dashboard`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-xl font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <LayoutDashboard className="w-5 h-5 text-blue-500" />
                      Dashboard
                    </Link>
                    <button 
                      onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                      className="w-full flex items-center gap-3 p-3 rounded-xl font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 text-left mt-2"
                    >
                      <LogOut className="w-5 h-5" />
                      Log out
                    </button>
                  </div>
                )}

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
