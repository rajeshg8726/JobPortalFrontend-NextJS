"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft, Terminal } from 'lucide-react';


export default function ComingSoon() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 font-sora">
    
      
      <main className="flex-1 relative flex items-center justify-center overflow-hidden">
        {/* Deep Dark Lighting */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none mix-blend-screen"></div>
        
        {/* Sublt Grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="relative z-10 px-6 py-20 text-center max-w-2xl mx-auto flex flex-col items-center">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-20 h-20 bg-slate-900 border border-slate-800 rounded-3xl flex items-center justify-center shadow-[0_0_40px_rgba(37,99,235,0.2)] mb-8"
          >
            <Terminal className="w-10 h-10 text-blue-500" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-[13px] font-bold tracking-wide uppercase mb-6"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            Under Construction
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl md:text-5xl font-black text-white mb-6 font-playfair tracking-tight leading-tight"
          >
            Something incredible is brewing.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-[17px] text-slate-400 font-medium mb-10 leading-relaxed"
          >
            We are currently building this feature to give you the most powerful tools in the industry. Check back very soon or browse open positions in the meantime.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link 
              href="/jobs"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold transition-all shadow-[0_4px_14px_rgba(37,99,235,0.3)] hover:shadow-[0_8px_24px_rgba(37,99,235,0.4)] hover:-translate-y-0.5"
            >
              <ArrowLeft className="w-5 h-5" /> Explore Active Jobs
            </Link>
          </motion.div>

        </div>
      </main>

    </div>
  );
}
