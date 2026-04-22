"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Briefcase, Building2, CheckCircle2, Zap, ArrowRight, UserPlus } from 'lucide-react';

export default function PostJobsGateway() {
  return (
    <div className="min-h-screen bg-slate-50 font-sora flex flex-col">
     

      <main className="flex-1">
        {/* Split Screen Hero */}
        <section className="relative w-full overflow-hidden bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[85vh]">
            
            {/* Left Content */}
            <div className="flex flex-col justify-center px-6 md:px-16 py-20 lg:py-0 relative z-10">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-[13px] font-bold tracking-wide uppercase mb-8 border border-blue-100 w-max"
              >
                <Building2 className="w-4 h-4" /> For Employers
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6 font-playfair leading-[1.1]"
              >
                Hire the top <span className="text-blue-600">1%</span> of global talent.
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-[17px] md:text-[19px] text-slate-500 font-medium leading-relaxed mb-10 max-w-xl"
              >
                Post your open roles and instantly connect with thousands of active, highly qualified professionals. Scale your team faster than ever before.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link 
                  href="/coming-soon"
                  className="h-14 px-8 inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-blue-600 text-white rounded-2xl font-bold text-[16px] transition-all shadow-[0_4px_14px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_24px_rgba(37,99,235,0.3)] hover:-translate-y-1"
                >
                  Create Employer Account <ArrowRight className="w-5 h-5" />
                </Link>
                <Link 
                  href="/contact"
                  className="h-14 px-8 inline-flex items-center justify-center gap-2 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 rounded-2xl font-bold text-[16px] transition-all"
                >
                  Talk to Sales
                </Link>
              </motion.div>
              
              <div className="mt-14 flex items-center gap-8 border-t border-slate-100 pt-8">
                <div className="flex flex-col">
                  <span className="text-3xl font-black text-slate-900">1K+</span>
                  <span className="text-[13px] font-bold text-slate-500 uppercase tracking-wide">Candidates</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-black text-slate-900">24hr</span>
                  <span className="text-[13px] font-bold text-slate-500 uppercase tracking-wide">Avg Time to Match</span>
                </div>
              </div>
            </div>

            {/* Right Side Visual */}
            <div className="hidden lg:block relative bg-slate-900 p-12 overflow-hidden flex items-center justify-center">
               <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
               <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-transparent to-blue-900/50"></div>
               
               {/* Floating UI Elements */}
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9, x: 50 }}
                 animate={{ opacity: 1, scale: 1, x: 0 }}
                 className="relative z-10 w-full max-w-sm bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2rem] p-8 shadow-2xl flex flex-col gap-6"
               >
                  <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                    <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                      <Briefcase className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="text-white font-bold text-lg">Senior Developer</div>
                      <div className="text-blue-200 font-medium text-sm">Design Department</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-4">
                     <div className="flex items-center gap-3">
                       <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                       <span className="text-slate-200 font-medium text-sm">142 Candidates Matched</span>
                     </div>
                     <div className="flex items-center gap-3">
                       <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                       <span className="text-slate-200 font-medium text-sm">Ranked by Technical Score</span>
                     </div>
                     <div className="flex items-center gap-3">
                       <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                       <span className="text-slate-200 font-medium text-sm">Automated Interview Scheduling</span>
                     </div>
                  </div>

                  <div className="mt-4 py-3 w-full bg-white text-slate-900 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg">
                    <UserPlus className="w-4 h-4" /> Start Reviewing Candidates
                  </div>
               </motion.div>
            </div>
            
          </div>
        </section>

      </main>

      
    </div>
  );
}
