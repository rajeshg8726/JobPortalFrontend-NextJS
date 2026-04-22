"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import slugify from 'react-slugify';
import {
  Bookmark, MapPin, Wallet, Building2,
  ExternalLink, Trash2, Search, X,
} from 'lucide-react';

interface SavedJob {
  id: number;
  role: string;
  title: string;
  location?: string;
  pay?: string;
  image?: string;
  created_at?: string;
  slug?: string;
}

export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('candidate') || 'null');
    const userId = user?.id || 'anonymous';
    
    // savedJobsDetails stores { [id]: fullJobObject }
    const details: Record<string, SavedJob> = JSON.parse(localStorage.getItem(`savedJobsDetails_${userId}`) || '{}');
    // savedJobs stores ordered array of IDs
    const ids: number[] = JSON.parse(localStorage.getItem(`savedJobs_${userId}`) || '[]');
    const jobs = ids.map(id => details[String(id)]).filter(Boolean);
    setSavedJobs(jobs);
  }, []);

  const removeJob = (jobId: number) => {
    const user = JSON.parse(localStorage.getItem('candidate') || 'null');
    const userId = user?.id || 'anonymous';
    const savedKey = `savedJobs_${userId}`;
    const detailsKey = `savedJobsDetails_${userId}`;

    setSavedJobs(prev => prev.filter(j => j.id !== jobId));

    const ids: number[] = JSON.parse(localStorage.getItem(savedKey) || '[]');
    localStorage.setItem(savedKey, JSON.stringify(ids.filter(id => id !== jobId)));

    const details: Record<string, SavedJob> = JSON.parse(localStorage.getItem(detailsKey) || '{}');
    delete details[String(jobId)];
    localStorage.setItem(detailsKey, JSON.stringify(details));
  };

  const formatSalary = (s?: string) => {
    if (!s) return 'Not disclosed';
    return s.replace(/(-|to|TO)/g, ' – ').replace(/\s+/g, ' ').trim();
  };

  const filtered = savedJobs.filter(j =>
    !searchTerm ||
    j.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-100 font-playfair tracking-tight">
            Saved Jobs
          </h1>
          <p className="text-[14px] text-slate-500 font-medium mt-1">
            {savedJobs.length} job{savedJobs.length !== 1 ? 's' : ''} bookmarked
          </p>
        </div>

        {savedJobs.length > 0 && (
          <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-2xl shadow-sm w-full sm:w-auto">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search saved jobs..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-[14px] text-slate-700 placeholder-slate-400 w-full sm:w-48"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')}>
                <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Empty State */}
      {savedJobs.length === 0 ? (
        <div className="bg-white border border-slate-200 border-dashed rounded-[2rem] py-24 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 border border-blue-100">
            <Bookmark className="w-8 h-8 text-blue-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2 font-playfair">No saved jobs yet</h3>
          <p className="text-[14px] text-slate-500 mb-6">
            Tap the bookmark icon on any job listing to save it here.
          </p>
          <Link
            href="/jobs"
            className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-blue-600 transition-colors shadow-sm text-[14px]"
          >
            Explore Jobs
          </Link>
        </div>

      /* No search results */
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-[2rem] py-16 flex flex-col items-center justify-center text-center">
          <p className="text-slate-500 font-medium">No saved jobs match &ldquo;{searchTerm}&rdquo;.</p>
          <button
            onClick={() => setSearchTerm('')}
            className="mt-3 text-blue-600 font-bold text-[14px] hover:underline"
          >
            Clear search
          </button>
        </div>

      ) : (
        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.map((job, i) => (
              <motion.div
                key={job.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.06, duration: 0.3 }}
                className="bg-white border border-slate-200 hover:border-blue-200 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all group"
              >
                {/* Company + Role */}
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 overflow-hidden p-2">
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/${job.image}`}
                      alt={job.title}
                      className="w-full h-full object-contain"
                      onError={(e: any) => { e.target.src = '/logo.webp'; }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[16px] font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {job.role}
                    </h3>
                    <span className="text-[13px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                      <Building2 className="w-3.5 h-3.5 shrink-0" /> {job.title}
                    </span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {job.location && (
                    <span className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[12px] text-slate-600 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[12px] text-slate-600 font-medium">
                    <Wallet className="w-3.5 h-3.5 text-slate-400" /> {formatSalary(job.pay)}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                  <Link
                    href={`/job/${job.id}/${job.slug || slugify(job.title || '')}`}
                    className="flex-1 h-10 flex items-center justify-center gap-2 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-[13px] font-bold transition-all"
                  >
                    View Job <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    onClick={() => removeJob(job.id)}
                    title="Remove from saved"
                    className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-200 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
}
