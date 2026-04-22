"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Save, Upload, Star, Clock,
  CheckCircle2, AlertCircle, Loader2,
} from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL;
const authH = (isJson = true) => ({
  'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
  'Accept': 'application/json',
  ...(isJson ? { 'Content-Type': 'application/json' } : {}),
});

type Form = {
  title: string; role: string; pay: string; location: string;
  description: string; eligibility: string; rolesAndResponsibilities: string;
  niceToHave: string; requirements: string; jobtype: string;
  jobbyrole: string; jobbycity: string; batch1: string;
  batch2: string; batch3: string; batches: string;
  jobpayrange: string; jobexplevel: string; joblink: string;
  is_featured: boolean; is_urgent: boolean;
};

const EMPTY: Form = {
  title: '', role: '', pay: '', location: '', description: '',
  eligibility: '', rolesAndResponsibilities: '', niceToHave: '',
  requirements: '', jobtype: '', jobbyrole: '', jobbycity: '',
  batch1: '', batch2: '', batch3: '', batches: '', jobpayrange: '',
  jobexplevel: '', joblink: '', is_featured: false, is_urgent: false,
};

const inputCls = 'w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[14px] text-slate-900 font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition-all';
const labelCls = 'block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
    <h2 className="text-[14px] font-black text-slate-900 mb-5 pb-4 border-b border-slate-100">{title}</h2>
    {children}
  </div>
);

export default function EditJobPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [form,         setForm]         = useState<Form>(EMPTY);
  const [currentImage, setCurrentImage] = useState<string>('');
  const [loading,      setLoading]      = useState(true);
  const [saving,       setSaving]       = useState(false);
  const [uploading,    setUploading]    = useState(false);
  const [toast,        setToast]        = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const logoRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const set = (field: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [field]: e.target.value }));

  /* ── Load job ── */
  useEffect(() => {
    if (!id) return;
    fetch(`${API}/api/admin/jobs/${id}`, { headers: authH() })
      .then(r => r.json())
      .then(data => {
        if (data.success && data.job) {
          const j = data.job;
          setCurrentImage(j.image || '');
          setForm({
            title:                  j.title || '',
            role:                   j.role || '',
            pay:                    j.pay || '',
            location:               j.location || '',
            description:            j.description || '',
            eligibility:            j.eligibility || '',
            rolesAndResponsibilities: j.rolesAndResponsibilities || '',
            niceToHave:             j.niceToHave || '',
            requirements:           j.requirements || '',
            jobtype:                j.jobtype || '',
            jobbyrole:              j.jobbyrole != null ? String(j.jobbyrole) : '',
            jobbycity:              j.jobbycity != null ? String(j.jobbycity) : '',
            batch1:                 j.batch1 != null ? String(j.batch1) : '',
            batch2:                 j.batch2 != null ? String(j.batch2) : '',
            batch3:                 j.batch3 != null ? String(j.batch3) : '',
            batches:                j.batches || '',
            jobpayrange:            j.jobpayrange != null ? String(j.jobpayrange) : '',
            jobexplevel:            j.jobexplevel != null ? String(j.jobexplevel) : '',
            joblink:                j.joblink || '',
            is_featured:            !!j.is_featured,
            is_urgent:              !!j.is_urgent,
          });
        }
      })
      .catch(() => showToast('Failed to load job data.', 'error'))
      .finally(() => setLoading(false));
  }, [id]);

  /* ── Save ── */
  const handleSave = async () => {
    setSaving(true);
    try {
      const res  = await fetch(`${API}/api/admin/jobs/${id}`, {
        method: 'PUT',
        headers: authH(),
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Job updated successfully!', 'success');
      } else {
        showToast(data.message || 'Failed to save changes.', 'error');
      }
    } catch {
      showToast('Network error. Try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  /* ── Logo upload ── */
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('companyLogo', file);
    try {
      const res  = await fetch(`${API}/api/admin/jobs/${id}/logo`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}`, 'Accept': 'application/json' },
        body: fd,
      });
      const data = await res.json();
      if (data.success) {
        setCurrentImage(data.image);
        showToast('Logo updated!', 'success');
      } else {
        showToast(data.message || 'Logo upload failed.', 'error');
      }
    } catch {
      showToast('Upload failed. Try again.', 'error');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-9 h-9 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 max-w-4xl">

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-5 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-xl font-bold text-[14px] flex items-center gap-2 ${
              toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
            }`}
          >
            {toast.type === 'success'
              ? <CheckCircle2 className="w-5 h-5" />
              : <AlertCircle className="w-5 h-5" />
            }
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/jobs"
            className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Edit Job</h1>
            <p className="text-[13px] text-slate-500 font-medium">Job ID #{id}</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-[14px] hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-60"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>

      {/* ── Flags ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-wrap gap-4">
        <button
          type="button"
          onClick={() => setForm(p => ({ ...p, is_featured: !p.is_featured }))}
          className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-bold text-[14px] border transition-all ${
            form.is_featured
              ? 'bg-amber-50 text-amber-700 border-amber-300 shadow-sm'
              : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-amber-200'
          }`}
        >
          <Star className={`w-4.5 h-4.5 ${form.is_featured ? 'fill-amber-500 text-amber-500' : ''}`} />
          {form.is_featured ? 'Featured ✓' : 'Mark as Featured'}
        </button>

        <button
          type="button"
          onClick={() => setForm(p => ({ ...p, is_urgent: !p.is_urgent }))}
          className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-bold text-[14px] border transition-all ${
            form.is_urgent
              ? 'bg-rose-50 text-rose-700 border-rose-300 shadow-sm'
              : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-rose-200'
          }`}
        >
          <Clock className={`w-4.5 h-4.5 ${form.is_urgent ? 'fill-rose-500 text-rose-500' : ''}`} />
          {form.is_urgent ? 'Urgent Hiring ✓' : 'Mark as Urgent'}
        </button>
      </div>

      {/* ── Company Logo ── */}
      <Section title="Company Logo">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-slate-100 border-2 border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
            {currentImage
              ? <img src={`${API}/${currentImage}`} alt="Logo" className="w-full h-full object-contain p-2" onError={(e: any) => { e.target.src = '/logo.webp'; }} />
              : <span className="text-slate-400 text-[11px] font-bold">No logo</span>
            }
          </div>
          <div>
            <input type="file" ref={logoRef} onChange={handleLogoUpload} accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" />
            <button
              onClick={() => logoRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-[14px] hover:bg-indigo-600 transition-colors shadow-sm disabled:opacity-60"
            >
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {uploading ? 'Uploading…' : 'Upload New Logo'}
            </button>
            <p className="text-[12px] text-slate-400 mt-2">JPG, PNG, WEBP or GIF · Max 2 MB</p>
          </div>
        </div>
      </Section>

      {/* ── Basic Info ── */}
      <Section title="Basic Job Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Company Name *</label>
            <input type="text" value={form.title} onChange={set('title')} placeholder="e.g. Google" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Job Role / Title *</label>
            <input type="text" value={form.role} onChange={set('role')} placeholder="e.g. Software Development Engineer" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Salary / Pay *</label>
            <input type="text" value={form.pay} onChange={set('pay')} placeholder="e.g. 12-18 LPA" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Location *</label>
            <input type="text" value={form.location} onChange={set('location')} placeholder="e.g. Bengaluru, Remote" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Apply Link *</label>
            <input type="url" value={form.joblink} onChange={set('joblink')} placeholder="https://..." className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Company Type (jobtype)</label>
            <input type="text" value={form.jobtype} onChange={set('jobtype')} placeholder="e.g. Service Based, Product Based" className={inputCls} />
          </div>
        </div>
      </Section>

      {/* ── Content Sections ── */}
      <Section title="Job Content">
        <div className="flex flex-col gap-4">
          {([
            { field: 'description',            label: 'Job Description'           },
            { field: 'eligibility',            label: 'Eligibility / Qualifications' },
            { field: 'rolesAndResponsibilities', label: 'Roles & Responsibilities' },
            { field: 'requirements',           label: 'Requirements / Skills'     },
            { field: 'niceToHave',             label: 'Nice to Have'              },
          ] as const).map(({ field, label }) => (
            <div key={field}>
              <label className={labelCls}>{label}</label>
              <textarea
                value={form[field]}
                onChange={set(field)}
                rows={4}
                placeholder={`Enter ${label.toLowerCase()}…`}
                className={`${inputCls} resize-y`}
              />
            </div>
          ))}
        </div>
      </Section>

      {/* ── Categorization ── */}
      <Section title="Categorization & Filters">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Batches (display string) *</label>
            <input type="text" value={form.batches} onChange={set('batches')} placeholder="e.g. 2024, 2025, 2026" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Job By Role ID (jobbyrole)</label>
            <input type="number" value={form.jobbyrole} onChange={set('jobbyrole')} placeholder="FK integer" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Job By City ID (jobbycity)</label>
            <input type="number" value={form.jobbycity} onChange={set('jobbycity')} placeholder="FK integer" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Batch1 (past years)</label>
            <input type="number" value={form.batch1} onChange={set('batch1')} placeholder="FK integer" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Batch2 (current/future)</label>
            <input type="number" value={form.batch2} onChange={set('batch2')} placeholder="FK integer" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Batch3 (domain e.g. SWE, DevOps)</label>
            <input type="number" value={form.batch3} onChange={set('batch3')} placeholder="FK integer" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Pay Range ID (jobpayrange)</label>
            <input type="number" value={form.jobpayrange} onChange={set('jobpayrange')} placeholder="FK integer" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Experience Level ID (jobexplevel)</label>
            <input type="number" value={form.jobexplevel} onChange={set('jobexplevel')} placeholder="FK integer" className={inputCls} />
          </div>
        </div>
      </Section>

      {/* ── Bottom Save ── */}
      <div className="flex justify-end pb-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-7 py-3.5 bg-indigo-600 text-white rounded-xl font-bold text-[15px] hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-600/25 disabled:opacity-60"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {saving ? 'Saving…' : 'Save All Changes'}
        </button>
      </div>

    </div>
  );
}
