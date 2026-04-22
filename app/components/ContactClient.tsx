"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export default function ContactClient() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/contactus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok || data.success) {
        setMessageType('success');
        setMessage("Awesome! We've received your message and will be in touch shortly.");
        setFormData({ name: '', email: '', message: '' });

        setTimeout(() => {
          setMessage('');
          setMessageType('');
        }, 6000);
      } else {
        throw new Error("Failed to send");
      }
    } catch (error) {
      setMessageType('error');
      setMessage("Oops! Something went wrong. Please try again or email us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-slate-50 font-sora py-16 md:py-24 flex items-center justify-center overflow-hidden z-0">
      
      {/* Background Decorative Lighting */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-blue-300/20 blur-[120px] pointer-events-none z-[-1]"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-indigo-300/20 blur-[120px] pointer-events-none z-[-1]"></div>
      
      <div className="w-full max-w-[1240px] mx-auto px-6 relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-slate-900 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(15,23,42,0.3)] overflow-hidden flex flex-col lg:flex-row border border-slate-800"
        >
          
          {/* Left Side: Dark Contact Info */}
          <div className="w-full lg:w-[45%] p-10 md:p-16 relative overflow-hidden flex flex-col justify-between">
            {/* Dark Side Glows */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/30 blur-[100px] rounded-full mix-blend-screen pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-500/20 blur-[100px] rounded-full mix-blend-screen pointer-events-none -translate-x-1/3 translate-y-1/3"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-white text-[13px] font-medium tracking-wide mb-8 backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-blue-400" />
                Let's Connect
              </div>
              
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 font-playfair tracking-tight leading-tight">
                We'd love to hear from you.
              </h2>
              
              <p className="text-slate-300 text-[16px] md:text-[18px] leading-relaxed mb-12 max-w-md border-l-2 border-blue-500/50 pl-5">
                Whether you’re looking for your dream job or searching for the perfect candidate, our team is here to assist you every step of the way.
              </p>
            </div>

            <div className="flex flex-col gap-8 relative z-10 pb-6">
              <div className="flex items-center gap-5 group cursor-pointer">
                <div className="w-14 h-14 bg-white/5 border border-white/10 group-hover:bg-blue-500/20 group-hover:border-blue-500/30 rounded-2xl flex items-center justify-center text-blue-400 backdrop-blur-sm transition-all duration-300">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[14px] font-medium text-slate-400 mb-1">Send us an email</div>
                  <a href="mailto:rgjobsupdate@gmail.com" className="text-[17px] font-bold text-white group-hover:text-blue-400 transition-colors">
                    rgjobsupdate@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-5 group cursor-pointer">
                <div className="w-14 h-14 bg-white/5 border border-white/10 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/30 rounded-2xl flex items-center justify-center text-emerald-400 backdrop-blur-sm transition-all duration-300">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[14px] font-medium text-slate-400 mb-1">Give us a ring</div>
                  <div className="text-[17px] font-bold text-white group-hover:text-emerald-400 transition-colors">
                    Available during business hours
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-5 group cursor-pointer">
                <div className="w-14 h-14 bg-white/5 border border-white/10 group-hover:bg-amber-500/20 group-hover:border-amber-500/30 rounded-2xl flex items-center justify-center text-amber-400 backdrop-blur-sm transition-all duration-300">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[14px] font-medium text-slate-400 mb-1">Office Location</div>
                  <div className="text-[17px] font-bold text-white group-hover:text-amber-400 transition-colors">
                    Remote-First, Base in India
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Side: Light Form */}
          <div className="w-full lg:w-[55%] bg-white p-10 md:p-16 lg:rounded-l-[2.5rem] relative shadow-[-20px_0_40px_rgba(0,0,0,0.2)]">
            <h3 className="text-2xl font-bold text-slate-900 mb-1">Send a Message</h3>
            <p className="text-slate-500 text-[15px] mb-8">Fill out the form below and we will get right back to you.</p>

            <AnimatePresence mode="wait">
              {message && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  className={`mb-8 p-4 rounded-2xl flex items-start gap-3 font-semibold text-[15px] border ${
                    messageType === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'
                  }`}
                >
                  {messageType === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" /> : <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />}
                  {message}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Custom Floating Label Input - Name */}
                <div className="relative group">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder=" "
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={submitting}
                    className="block w-full px-5 pb-3 pt-6 w-full text-[16px] text-slate-900 bg-slate-50 border-2 border-transparent rounded-2xl appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 focus:bg-white transition-all peer disabled:opacity-60"
                  />
                  <label 
                    htmlFor="name" 
                    className="absolute text-[15px] text-slate-500 duration-300 transform -translate-y-3 scale-75 top-5 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-blue-500 font-medium pointer-events-none"
                  >
                    Full Name
                  </label>
                </div>

                {/* Custom Floating Label Input - Email */}
                <div className="relative group">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder=" "
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={submitting}
                    className="block w-full px-5 pb-3 pt-6 w-full text-[16px] text-slate-900 bg-slate-50 border-2 border-transparent rounded-2xl appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 focus:bg-white transition-all peer disabled:opacity-60"
                  />
                  <label 
                    htmlFor="email" 
                    className="absolute text-[15px] text-slate-500 duration-300 transform -translate-y-3 scale-75 top-5 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-blue-500 font-medium pointer-events-none"
                  >
                    Email Address
                  </label>
                </div>
              </div>

              {/* Custom Floating Label Input - Message */}
              <div className="relative group mt-2">
                <textarea
                  name="message"
                  id="message"
                  placeholder=" "
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  required
                  disabled={submitting}
                  className="block w-full px-5 pb-3 pt-8 w-full text-[16px] text-slate-900 bg-slate-50 border-2 border-transparent rounded-2xl appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 focus:bg-white transition-all peer disabled:opacity-60 resize-y min-h-[140px]"
                ></textarea>
                <label 
                  htmlFor="message" 
                  className="absolute text-[15px] text-slate-500 duration-300 transform -translate-y-4 scale-75 top-6 z-10 origin-[0] left-5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-blue-500 font-medium pointer-events-none"
                >
                  How can we help you?
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="mt-4 w-full h-14 flex items-center justify-center gap-3 bg-blue-600 text-white rounded-2xl font-bold text-[16px] hover:bg-blue-700 transition-all shadow-[0_8px_20px_rgba(37,99,235,0.25)] hover:shadow-[0_12px_28px_rgba(37,99,235,0.4)] hover:-translate-y-1 disabled:opacity-70 disabled:pointer-events-none"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Routing Message...
                  </>
                ) : (
                  <>
                    Send Message <Send className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

          </div>
        </motion.div>
      </div>
      
    </div>
  );
}
