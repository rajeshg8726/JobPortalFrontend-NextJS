"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Check,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube
} from 'lucide-react';
import axios from 'axios';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const backendURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const contactEmail = "rgjobsupdate@gmail.com";
  const phone = "+918726141025";
  const address = "Lucknow, Uttar Pradesh, India";
  const companyName = "RGJobs";
  const logo = "/logo.png";
  const socialLinks = {
    facebook: "https://www.facebook.com/rgjobs_updates",
    twitter: "https://x.com/rgjobs_updates",
    instagram: "https://www.instagram.com/rgjobs_updates/",
    linkedin: "https://www.linkedin.com/company/rgjobs",
    youtube: "https://www.youtube.com/@RajeshGupta-e5d",
  };
  const quickLinks = {
    candidates: [
      { name: "Find Jobs", path: "/jobs", upcoming: false },
      { name: "Browse Companies", path: "/companies", upcoming: false },
      { name: "Candidate Dashboard", path: "/login", upcoming: false },
      { name: "Saved Jobs", path: "/login", upcoming: false },
    ],
    employers: [
      { name: "Post Jobs", path: "/post-jobs", upcoming: false },
      { name: "Employer Dashboard", path: "/coming-soon", upcoming: true },
      { name: "Company Profile", path: "/coming-soon", upcoming: true },
      { name: "Pricing Plans", path: "/coming-soon", upcoming: true },
    ],
    resources: [
      { name: "Blog", path: "/coming-soon", upcoming: true },
      { name: "Career Advice", path: "/coming-soon", upcoming: true },
      { name: "Interview Tips", path: "/coming-soon", upcoming: true },
      { name: "Resume Tips", path: "/coming-soon", upcoming: true },
      { name: "Contact Us", path: "/contact", upcoming: false },
    ],
    company: [
      { name: "About Us", path: "/about", upcoming: false },
      { name: "Contact", path: "/contact", upcoming: false },
      { name: "Privacy Policy", path: "/privacy", upcoming: false },
      { name: "Terms of Service", path: "/terms", upcoming: false },
      { name: "FAQ", path: "/coming-soon", upcoming: true },
    ],
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await axios.post(`${backendURL}/api/subscribeNewsletter`, { email });
      setSubscribed(res.status === 200 || res.status === 201);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    } catch (error) {
      console.error('Newsletter subscription failed', error);
      alert('Error subscribing to newsletter. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="w-full bg-slate-950 text-slate-300 font-sora relative overflow-hidden border-t border-slate-800">
      
      {/* Premium Background Effects */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_20%_80%,rgba(37,99,235,0.05),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(245,201,107,0.03),transparent_40%)]" />

      {/* Grid Network Lines pattern (Subtle) */}
      <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="max-w-[1400px] mx-auto px-6 pt-24 pb-12 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8 mb-20">
          
          {/* Brand Info (takes up 2 columns) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Link href="/" className="flex items-center group">
               <div className="h-12 group-hover:scale-105 transition-transform duration-300">
                  <img src="/logo.webp" alt="RGJobs" className="h-full w-auto object-contain" />
               </div>
            </Link>
            
            <p className="text-sm text-slate-400 leading-relaxed font-medium">
              Connecting elite talent with the world's most innovative companies. 
              Elevate your career journey on a platform engineered for excellence.
            </p>

            <div className="flex flex-col gap-3 mt-4">
              <a href={`mailto:${contactEmail}`} className="flex items-center gap-3 text-sm text-slate-400 hover:text-white transition-colors group">
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-500 transition-all">
                  <Mail className="w-4 h-4" />
                </div>
                <span>{contactEmail}</span>
              </a>
              <a href={`tel:${phone}`} className="flex items-center gap-3 text-sm text-slate-400 hover:text-white transition-colors group">
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-500 transition-all">
                  <Phone className="w-4 h-4" />
                </div>
                <span>{phone}</span>
              </a>
              <div className="flex items-center gap-3 text-sm text-slate-400 group">
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-500 transition-all">
                  <MapPin className="w-4 h-4" />
                </div>
                <span>{address}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-5">
            <h3 className="text-white font-bold text-base uppercase tracking-wider">Candidates</h3>
            <ul className="flex flex-col gap-3">
              {quickLinks.candidates.map((link) => (
                <li key={link.name}>
                  <Link href={link.path} className={`text-sm font-medium transition-colors flex items-center gap-2 group ${link.upcoming ? 'text-slate-500 hover:text-slate-400 cursor-not-allowed' : 'text-slate-400 hover:text-blue-400'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full transition-all ${link.upcoming ? 'bg-slate-700' : 'bg-blue-500/0 group-hover:bg-blue-400'}`} />
                    {link.name}
                    {link.upcoming && <span className="text-[9px] uppercase font-bold bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded-md ml-1 border border-slate-700">Soon</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-5">
            <h3 className="text-white font-bold text-base uppercase tracking-wider">Employers</h3>
            <ul className="flex flex-col gap-3">
              {quickLinks.employers.map((link) => (
                <li key={link.name}>
                  <Link href={link.path} className={`text-sm font-medium transition-colors flex items-center gap-2 group ${link.upcoming ? 'text-slate-500 hover:text-slate-400 cursor-not-allowed' : 'text-slate-400 hover:text-blue-400'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full transition-all ${link.upcoming ? 'bg-slate-700' : 'bg-blue-500/0 group-hover:bg-blue-400'}`} />
                    {link.name}
                    {link.upcoming && <span className="text-[9px] uppercase font-bold bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded-md ml-1 border border-slate-700">Soon</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter (takes up 2 columns) */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <h3 className="text-white font-bold text-base uppercase tracking-wider">Stay Updated</h3>
            <p className="text-sm text-slate-400 font-medium">Subscribe to our newsletter for the latest remote opportunities and career insights.</p>
            
            <form onSubmit={handleSubscribe} className="mt-2 relative">
              <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl p-1.5 focus-within:bg-white/10 focus-within:border-blue-500/50 transition-all duration-300">
                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-white text-sm px-4 placeholder:text-slate-500"
                  disabled={loading || subscribed}
                />
                <button
                  type="submit"
                  disabled={loading || subscribed}
                  className={`flex items-center justify-center w-12 h-10 rounded-xl text-white transition-all shadow-md ${
                    subscribed 
                      ? 'bg-emerald-500 cursor-default' 
                      : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20'
                  }`}
                >
                  {loading ? (
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  ) : subscribed ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            </form>

            {/* Social Links */}
            <div className="flex items-center gap-3 mt-4">
              <a href={socialLinks.facebook} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-slate-400 hover:bg-blue-600 hover:text-white hover:border-transparent transition-all" target='_blank' ><Facebook className="w-4 h-4" /></a>
              <a href={socialLinks.twitter} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-slate-400 hover:bg-sky-500 hover:text-white hover:border-transparent transition-all" target='_blank' ><Twitter className="w-4 h-4" /></a>
              <a href={socialLinks.instagram} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-slate-400 hover:bg-pink-600 hover:text-white hover:border-transparent transition-all" target='_blank' ><Instagram className="w-4 h-4" /></a>
              <a href={socialLinks.linkedin} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-slate-400 hover:bg-blue-700 hover:text-white hover:border-transparent transition-all" target='_blank' ><Linkedin className="w-4 h-4" /></a>
              <a href={socialLinks.youtube} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-slate-400 hover:bg-red-600 hover:text-white hover:border-transparent transition-all" target='_blank' ><Youtube className="w-4 h-4" /></a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500 font-medium">
            © {new Date().getFullYear()} RGJobs. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6">
            <Link href="/about" className="text-sm text-slate-500 hover:text-white transition-colors">About Us</Link>
            <Link href="/privacy" className="text-sm text-slate-500 hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-sm text-slate-500 hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
