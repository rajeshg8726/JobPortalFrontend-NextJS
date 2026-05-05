"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle, AlertTriangle, Scale, Users } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sora flex flex-col overflow-hidden">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full pt-32 pb-24 lg:pt-40 lg:pb-32 flex items-center justify-center overflow-hidden bg-slate-950">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-luminosity"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent"></div>

          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-600/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen"></div>

          <div className="relative z-10 px-6 max-w-[900px] mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-slate-300 text-[13px] font-bold tracking-wide uppercase mb-6 backdrop-blur-md"
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              Legal Agreements
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-8 font-playfair tracking-tight leading-[1.1]"
            >
              Terms of Service
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-[17px] md:text-[20px] text-slate-300 font-medium leading-relaxed max-w-[700px] mx-auto"
            >
              Please read these terms carefully before using the RGJobs platform. They define the rules of engagement for both candidates and employers.
            </motion.p>
          </div>
        </section>

        {/* Content Section */}
        <section className="relative z-20 -mt-12 max-w-[1000px] mx-auto px-6 mb-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="w-full bg-white rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.06)] border border-slate-200 p-8 md:p-14"
          >
            <div className="space-y-12">
              
              {/* Last Updated */}
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wide">
                Effective Date: May 2026
              </p>

              {/* Section 1 */}
              <div>
                <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
                  <div className="p-2 bg-slate-100 text-slate-700 rounded-xl">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  1. Acceptance of Terms
                </h2>
                <p className="text-slate-600 text-[16px] leading-relaxed font-medium">
                  By accessing or using the RGJobs website and services, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use our services. These terms apply to all visitors, users, employers, and candidates who access the platform.
                </p>
              </div>

              {/* Section 2 */}
              <div>
                <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                    <Users className="w-6 h-6" />
                  </div>
                  2. User Responsibilities
                </h2>
                <div className="text-slate-600 text-[16px] leading-relaxed space-y-4 font-medium">
                  <p>As a user of RGJobs, you agree to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Provide accurate, current, and complete information during registration and on your profile/resume.</li>
                    <li>Maintain the security of your account password and accept responsibility for all activities under your account.</li>
                    <li>Not use the platform for any illegal, harmful, or discriminatory purpose.</li>
                    <li>Not scrape, crawl, or attempt to extract data from the platform using automated means without explicit written permission.</li>
                  </ul>
                </div>
              </div>

              {/* Section 3 */}
              <div>
                <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                    <FileText className="w-6 h-6" />
                  </div>
                  3. Employer Guidelines
                </h2>
                <p className="text-slate-600 text-[16px] leading-relaxed font-medium">
                  Employers utilizing RGJobs to post job listings must ensure all postings are legitimate, accurate, and do not violate any local employment laws. We reserve the right to remove any job posting or ban employer accounts that solicit candidates for illegal activities, multi-level marketing, or unpaid "trial" work disguised as employment.
                </p>
              </div>

              {/* Section 4 */}
              <div>
                <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
                  <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  4. Limitation of Liability
                </h2>
                <p className="text-slate-600 text-[16px] leading-relaxed font-medium">
                  RGJobs acts as a venue for employers to post opportunities and candidates to search for them. We are not involved in the actual transaction between employers and candidates. As a result, we have no control over the quality, safety, or legality of the jobs or resumes posted. We are not liable for any damages arising from your use of the platform.
                </p>
              </div>

              {/* Section 5 */}
              <div>
                <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
                  <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                    <Scale className="w-6 h-6" />
                  </div>
                  5. Modifications to Terms
                </h2>
                <p className="text-slate-600 text-[16px] leading-relaxed font-medium">
                  We reserve the right to modify or replace these Terms at any time. We will provide notice of any significant changes by posting the new Terms on this page. Your continued use of the platform after such changes constitutes acceptance of the new Terms.
                </p>
              </div>

              {/* Contact */}
              <div className="mt-12 pt-8 border-t border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Legal Inquiries</h3>
                <p className="text-slate-600 font-medium">
                  If you have any legal inquiries regarding these terms, please contact us at <a href="mailto:rgjobsupdate@gmail.com" className="text-indigo-600 hover:underline">rgjobsupdate@gmail.com</a>.
                </p>
              </div>

            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
