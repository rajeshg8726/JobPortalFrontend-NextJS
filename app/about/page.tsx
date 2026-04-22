"use client";

import React from 'react';

import { motion } from 'framer-motion';
import { Globe, Users, Zap, Briefcase } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sora flex flex-col overflow-hidden">


      <main className="flex-1">
        {/* Massive Hero Section */}
        <section className="relative w-full pt-32 pb-24 lg:pt-40 lg:pb-32 flex items-center justify-center overflow-hidden bg-slate-950">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-luminosity"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent"></div>

          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/30 blur-[120px] rounded-full pointer-events-none mix-blend-screen"></div>

          <div className="relative z-10 px-6 max-w-[900px] mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-slate-300 text-[13px] font-bold tracking-wide uppercase mb-6 backdrop-blur-md"
            >
              <Users className="w-4 h-4 text-blue-400" />
              Our Mission
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-8 font-playfair tracking-tight leading-[1.1]"
            >
              Building the future of talent discovery.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-[17px] md:text-[20px] text-slate-300 font-medium leading-relaxed max-w-[700px] mx-auto"
            >
              RGJobs was founded with a singular vision: to break the barriers between global elite talent and the world's most innovative companies.
            </motion.p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="relative z-20 -mt-12 max-w-[1200px] mx-auto px-6 mb-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full bg-white rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.06)] border border-slate-200 p-10 md:p-14 grid grid-cols-1 md:grid-cols-3 gap-10 divide-y md:divide-y-0 md:divide-x divide-slate-100"
          >
            <div className="flex flex-col items-center text-center">
              <div className="text-4xl md:text-5xl font-black text-slate-900 mb-2">1k+</div>
              <div className="text-[15px] font-bold text-slate-500 uppercase tracking-wide">Jobs Posted</div>
            </div>
            <div className="flex flex-col items-center text-center pt-8 md:pt-0">
              <div className="text-4xl md:text-5xl font-black text-blue-600 mb-2">Planning to expand</div>
              <div className="text-[15px] font-bold text-slate-500 uppercase tracking-wide">Partner Companies</div>
            </div>
            <div className="flex flex-col items-center text-center pt-8 md:pt-0">
              <div className="text-4xl md:text-5xl font-black text-slate-900 mb-2">10k+</div>
              <div className="text-[15px] font-bold text-slate-500 uppercase tracking-wide">Active Users</div>
            </div>
          </motion.div>
        </section>

        {/* Value Proposition */}
        <section className="max-w-[1200px] mx-auto px-6 py-12 mb-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 font-playfair leading-tight">
              A platform engineered for excellence.
            </h2>
            <p className="text-slate-600 text-[17px] leading-relaxed mb-6 font-medium">
              We believe that hiring shouldn't be a tedious process of sifting through noise. At RGJobs, we utilize smart filtering, stunning interfaces, and rigorous vetting to ensure high signal-to-noise ratios.
            </p>
            <p className="text-slate-600 text-[17px] leading-relaxed mb-10 font-medium">
              Whether you are a startup scaling your engineering team, or a Fortune 500 company looking for executives, our platform elegantly scales to your demands.
            </p>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 font-bold text-slate-900 bg-white border border-slate-200 px-5 py-3 rounded-xl shadow-sm">
                <Globe className="w-5 h-5 text-blue-600" /> Global Reach
              </div>
              <div className="flex items-center gap-2 font-bold text-slate-900 bg-white border border-slate-200 px-5 py-3 rounded-xl shadow-sm">
                <Zap className="w-5 h-5 text-emerald-500" /> Fast Execution
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 relative">
            <div className="w-full h-[300px] bg-slate-200 rounded-[2rem] overflow-hidden translate-y-12 shadow-xl">
              <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover" alt="Team working" />
            </div>
            <div className="w-full h-[300px] bg-slate-300 rounded-[2rem] overflow-hidden shadow-xl">
              <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover" alt="Office space" />
            </div>
          </div>
        </section>

      </main>


    </div>
  );
}
