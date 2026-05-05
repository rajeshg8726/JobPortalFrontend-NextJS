"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Server } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sora flex flex-col overflow-hidden">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full pt-32 pb-24 lg:pt-40 lg:pb-32 flex items-center justify-center overflow-hidden bg-slate-950">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-luminosity"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent"></div>

          <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-600/30 blur-[120px] rounded-full pointer-events-none mix-blend-screen"></div>

          <div className="relative z-10 px-6 max-w-[900px] mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-slate-300 text-[13px] font-bold tracking-wide uppercase mb-6 backdrop-blur-md"
            >
              <Shield className="w-4 h-4 text-indigo-400" />
              Data Protection
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-8 font-playfair tracking-tight leading-[1.1]"
            >
              Privacy Policy
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-[17px] md:text-[20px] text-slate-300 font-medium leading-relaxed max-w-[700px] mx-auto"
            >
              At RGJobs, we are deeply committed to protecting your personal information and ensuring your job search remains secure and confidential.
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
                Last Updated: May 2026
              </p>

              {/* Section 1 */}
              <div>
                <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                    <Eye className="w-6 h-6" />
                  </div>
                  1. Information We Collect
                </h2>
                <div className="text-slate-600 text-[16px] leading-relaxed space-y-4 font-medium">
                  <p>When you use RGJobs, we collect information to provide and improve our services. This includes:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Account Information:</strong> Name, email address, password, and contact details.</li>
                    <li><strong>Professional Data:</strong> Resumes, work history, skills, portfolios, and educational background provided during profile creation.</li>
                    <li><strong>Usage Data:</strong> Information about how you navigate the platform, jobs you view or apply for, and device information.</li>
                  </ul>
                </div>
              </div>

              {/* Section 2 */}
              <div>
                <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                    <Server className="w-6 h-6" />
                  </div>
                  2. How We Use Your Information
                </h2>
                <div className="text-slate-600 text-[16px] leading-relaxed space-y-4 font-medium">
                  <p>We use the collected data strictly to enhance your recruitment experience:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>To match your profile with relevant job opportunities.</li>
                    <li>To allow employers to discover your talent (if your profile is set to public).</li>
                    <li>To communicate with you regarding application statuses, platform updates, and security alerts.</li>
                    <li>To analyze platform usage and improve our features and algorithms.</li>
                  </ul>
                </div>
              </div>

              {/* Section 3 */}
              <div>
                <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
                  <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                    <Shield className="w-6 h-6" />
                  </div>
                  3. Data Sharing & Disclosure
                </h2>
                <p className="text-slate-600 text-[16px] leading-relaxed font-medium">
                  RGJobs does not sell your personal data. We only share information with prospective employers when you explicitly apply for a job or opt-in to our talent database. We may also share data with trusted third-party service providers (such as cloud hosting) who are bound by strict confidentiality agreements to facilitate our platform operations.
                </p>
              </div>

              {/* Section 4 */}
              <div>
                <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-3">
                  <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                    <Lock className="w-6 h-6" />
                  </div>
                  4. Security
                </h2>
                <p className="text-slate-600 text-[16px] leading-relaxed font-medium">
                  We employ industry-standard encryption, secure server architectures, and regular security audits to protect your data against unauthorized access, alteration, or destruction. However, no method of internet transmission is 100% secure, and we urge you to use strong passwords and keep your login credentials confidential.
                </p>
              </div>

              {/* Contact */}
              <div className="mt-12 pt-8 border-t border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Questions about your privacy?</h3>
                <p className="text-slate-600 font-medium">
                  If you have any questions or wish to delete your account data, please contact our privacy team at <a href="mailto:rgjobsupdate@gmail.com" className="text-indigo-600 hover:underline">rgjobsupdate@gmail.com</a>.
                </p>
              </div>

            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
