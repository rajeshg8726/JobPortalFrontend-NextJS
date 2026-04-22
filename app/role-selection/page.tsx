"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Building2, ArrowRight } from 'lucide-react';


export default function RoleSelection() {
  const [hoveredRole, setHoveredRole] = useState<'candidate' | 'employer' | null>(null);

  return (
    <div className="min-h-screen bg-slate-50 font-sora flex flex-col">
      

      <main className="flex-1 flex flex-col items-center justify-center pt-24 pb-16 px-6">
        
        <div className="text-center max-w-2xl mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-black text-slate-900 mb-4 font-playfair tracking-tight"
          >
            Join RGJobs Today
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 font-medium text-[16px] md:text-[18px]"
          >
            To get started, tell us how you'll be using our platform.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 relative"
        >
          {/* Candidate Card */}
          <Link 
            href="/signup/candidate"
            onMouseEnter={() => setHoveredRole('candidate')}
            onMouseLeave={() => setHoveredRole(null)}
            className={`relative overflow-hidden rounded-[2.5rem] bg-white border-2 p-10 lg:p-14 transition-all duration-500 flex flex-col items-center text-center shadow-[0_8px_30px_rgba(0,0,0,0.04)] ${hoveredRole === 'candidate' ? 'border-blue-500 shadow-[0_20px_40px_rgba(37,99,235,0.12)] scale-[1.02] z-10' : hoveredRole === 'employer' ? 'border-slate-100 scale-[0.98] opacity-60 grayscale-[30%]' : 'border-slate-200 hover:border-blue-300'}`}
          >
            <div className="absolute top-0 left-0 w-full h-[5px] bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            
            <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center mb-8 transition-colors duration-500 ${hoveredRole === 'candidate' ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30' : 'bg-blue-50 text-blue-600'}`}>
              <Briefcase className="w-10 h-10" />
            </div>

            <h2 className="text-3xl font-black text-slate-900 mb-4 font-playfair tracking-tight">I'm a Candidate</h2>
            <p className="text-slate-500 text-[16px] font-medium leading-relaxed mb-10 max-w-sm mx-auto">
              I'm looking for my next big career move, active job alerts, and one-click applications.
            </p>

            <div className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${hoveredRole === 'candidate' ? 'bg-blue-50 text-blue-700' : 'bg-slate-50 text-slate-400'}`}>
              Create Candidate Profile <ArrowRight className={`w-4 h-4 transition-transform ${hoveredRole === 'candidate' ? 'translate-x-1' : ''}`} />
            </div>
          </Link>

          {/* Employer Card */}
          <Link 
            href="/signup/employer"
            onMouseEnter={() => setHoveredRole('employer')}
            onMouseLeave={() => setHoveredRole(null)}
            className={`relative overflow-hidden rounded-[2.5rem] bg-white border-2 p-10 lg:p-14 transition-all duration-500 flex flex-col items-center text-center shadow-[0_8px_30px_rgba(0,0,0,0.04)] ${hoveredRole === 'employer' ? 'border-emerald-500 shadow-[0_20px_40px_rgba(16,185,129,0.12)] scale-[1.02] z-10' : hoveredRole === 'candidate' ? 'border-slate-100 scale-[0.98] opacity-60 grayscale-[30%]' : 'border-slate-200 hover:border-emerald-300'}`}
          >
            <div className="absolute top-0 right-0 w-full h-[5px] bg-gradient-to-l from-emerald-400 to-emerald-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            
            <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center mb-8 transition-colors duration-500 ${hoveredRole === 'employer' ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/30' : 'bg-emerald-50 text-emerald-600'}`}>
              <Building2 className="w-10 h-10" />
            </div>

            <h2 className="text-3xl font-black text-slate-900 mb-4 font-playfair tracking-tight">I'm an Employer</h2>
            <p className="text-slate-500 text-[16px] font-medium leading-relaxed mb-10 max-w-sm mx-auto">
              I want to post jobs, manage applicants, and hire from the top 1% of global talent seamlessly.
            </p>

            <div className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${hoveredRole === 'employer' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-50 text-slate-400'}`}>
              Create Company Account <ArrowRight className={`w-4 h-4 transition-transform ${hoveredRole === 'employer' ? 'translate-x-1' : ''}`} />
            </div>
          </Link>
        </motion.div>

        <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.4 }}
           className="mt-12 text-slate-500 font-medium"
        >
           Already have an account? <Link href="/login" className="text-blue-600 font-bold hover:underline">Log In</Link>
        </motion.div>

      </main>

      
    </div>
  );
}
