"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, PlusCircle, Upload, CheckCircle2,
  AlertCircle, Loader2, Image as ImageIcon
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
  companyLogo: File | null;
};

const EMPTY: Form = {
  title: '', role: '', pay: '', location: '', description: '',
  eligibility: '', rolesAndResponsibilities: '', niceToHave: '',
  requirements: '', jobtype: '', jobbyrole: '', jobbycity: '',
  batch1: '', batch2: '', batch3: '', batches: '', jobpayrange: '',
  jobexplevel: '', joblink: '', companyLogo: null
};

const inputCls = 'w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[14px] text-slate-900 font-medium focus:outline-none focus:border-indigo-500 focus:bg-white transition-all';
const labelCls = 'block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
    <h2 className="text-[14px] font-black text-slate-900 mb-5 pb-4 border-b border-slate-100">{title}</h2>
    {children}
  </div>
);

export default function AdminJobAddPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState<Form>(EMPTY);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  
  // Category states
  const [jobRole, setJobRole] = useState<any[]>([]);
  const [jobLocation, setJobLocation] = useState<any[]>([]);
  const [jobBatch, setJobBatch] = useState<any[]>([]);
  const [jobPay, setJobPay] = useState<any[]>([]);
  const [jobDomain, setJobDomain] = useState<any[]>([]);
  const [jobExpLevel, setJobExpLevel] = useState<any[]>([]);
  const [jobCompanyType, setJobCompanyType] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const logoRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch categories exactly as your provided code
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const [
          rolesRes, locationRes, batchRes, payRes, 
          domainRes, expLevelRes, companyTypeRes
        ] = await Promise.all([
          fetch(`${API}/api/getRolesCat`).then(r => r.json()),
          fetch(`${API}/api/getLocationCat`).then(r => r.json()),
          fetch(`${API}/api/getBatchCat`).then(r => r.json()),
          fetch(`${API}/api/getPayCat`).then(r => r.json()),
          fetch(`${API}/api/getDomainCat`).then(r => r.json()),
          fetch(`${API}/api/getExpLevelCat`).then(r => r.json()),
          fetch(`${API}/api/getCompanyCat`).then(r => r.json())
        ]);

        setJobRole(rolesRes.roleData || []);
        setJobLocation(locationRes.roleData || []);
        setJobBatch(batchRes.roleData || []);
        setJobPay(payRes.roleData || []);
        setJobDomain(domainRes.roleData || []);
        setJobExpLevel(expLevelRes.roleData || []);
        setJobCompanyType(companyTypeRes.roleData || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, companyLogo: file }));
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    // Append all text fields
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'companyLogo' && value !== null && value !== undefined) {
        data.append(key, value as string);
      }
    });

    // Append File
    if (formData.companyLogo) {
      data.append('companyLogo', formData.companyLogo);
    } else {
      showToast("Company logo is required", "error");
      setLoading(false);
      return;
    }

    try {
      // Keep exact endpoint format from original code
      const response = await fetch(`${API}/api/job`, {
        method: 'POST',
        // IMPORTANT: Do NOT set Content-Type header on FormData fetch, browser boundary will handle it
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          'Accept': 'application/json'
        },
        body: data,
      });
      
      const resData = await response.json();
      
      if (response.ok || resData.success) {
        showToast('Job added successfully!', 'success');
        setTimeout(() => {
          router.push('/admin/jobs');
        }, 1500);
      } else {
         showToast(resData.message || 'Failed to add job. Check validations.', 'error');
      }
    } catch (error) {
      showToast('Network error. Failed to add job.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 max-w-4xl pb-10">

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
            {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page header */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-2">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/jobs"
            className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Post New Job</h1>
            <p className="text-[13px] text-slate-500 font-medium mt-0.5">Publish a new opportunity to the portal.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col">
        
        {/* ── Basic Info ── */}
        <Section title="Basic Details (Inputs)">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label htmlFor="title" className={labelCls}>Company Name (Title) *</label>
              <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required className={inputCls} placeholder="e.g. Google" />
            </div>
            <div>
              <label htmlFor="role" className={labelCls}>Job Role *</label>
              <input type="text" id="role" name="role" value={formData.role} onChange={handleChange} required className={inputCls} placeholder="e.g. Frontend Developer" />
            </div>
            <div>
              <label htmlFor="pay" className={labelCls}>Expected Pay *</label>
              <input type="text" id="pay" name="pay" value={formData.pay} onChange={handleChange} required className={inputCls} placeholder="e.g. 10 LPA - 15 LPA"/>
            </div>
            <div>
              <label htmlFor="location" className={labelCls}>Job Locations (Text) *</label>
              <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} required className={inputCls} placeholder="e.g. Pune, Remote"/>
            </div>
            <div>
              <label htmlFor="joblink" className={labelCls}>Apply Link / URL *</label>
              <input type="url" id="joblink" name="joblink" value={formData.joblink} onChange={handleChange} required className={inputCls} placeholder="https://..." />
            </div>
            <div>
              <label htmlFor="batches" className={labelCls}>Batches Description String *</label>
              <input type="text" id="batches" name="batches" value={formData.batches} onChange={handleChange} required className={inputCls} placeholder="e.g. 2024, 2025" />
            </div>
          </div>
        </Section>

        {/* ── Dropdowns / Categories ── */}
        <Section title="Categorization (Dropdowns)">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div>
              <label htmlFor="jobexplevel" className={labelCls}>Experience Level *</label>
              <select id="jobexplevel" name="jobexplevel" value={formData.jobexplevel} onChange={handleChange} required className={inputCls}>
                <option value="">Select Level</option>
                {jobExpLevel.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="jobbycity" className={labelCls}>Job City (Category) *</label>
              <select id="jobbycity" name="jobbycity" value={formData.jobbycity} onChange={handleChange} required className={inputCls}>
                <option value="">Select City</option>
                {jobLocation.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="jobtype" className={labelCls}>Company Type *</label>
              <select id="jobtype" name="jobtype" value={formData.jobtype} onChange={handleChange} required className={inputCls}>
                <option value="">Select Company Type</option>
                {jobCompanyType.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="jobpayrange" className={labelCls}>Pay Range Category *</label>
              <select id="jobpayrange" name="jobpayrange" value={formData.jobpayrange} onChange={handleChange} required className={inputCls}>
                <option value="">Select Range</option>
                {jobPay.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="jobbyrole" className={labelCls}>Category Role *</label>
              <select id="jobbyrole" name="jobbyrole" value={formData.jobbyrole} onChange={handleChange} required className={inputCls}>
                <option value="">Select Category Role</option>
                {jobRole.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="batch3" className={labelCls}>Job Domain</label>
              <select id="batch3" name="batch3" value={formData.batch3} onChange={handleChange} className={inputCls}>
                <option value="">Select Domain</option>
                {jobDomain.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="batch1" className={labelCls}>Past Batches</label>
              <select id="batch1" name="batch1" value={formData.batch1} onChange={handleChange} className={inputCls}>
                <option value="">Select Past Batches</option>
                {jobBatch.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="batch2" className={labelCls}>Upcoming Batches</label>
              <select id="batch2" name="batch2" value={formData.batch2} onChange={handleChange} className={inputCls}>
                <option value="">Select Upcoming Batches</option>
                {jobBatch.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
          </div>
        </Section>

        {/* ── Description & Long Text ── */}
        <Section title="Job Descriptions">
          <div className="flex flex-col gap-6">
            <div>
              <label htmlFor="description" className={labelCls}>Job Description *</label>
              <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} required className={`${inputCls} resize-y min-h-[100px]`} placeholder="Detailed text..." />
            </div>
            <div>
              <label htmlFor="eligibility" className={labelCls}>Eligibility</label>
              <textarea id="eligibility" name="eligibility" value={formData.eligibility} onChange={handleChange} rows={3} className={`${inputCls} resize-y bg-white`} />
            </div>
            <div>
              <label htmlFor="rolesAndResponsibilities" className={labelCls}>Roles & Responsibilities</label>
              <textarea id="rolesAndResponsibilities" name="rolesAndResponsibilities" value={formData.rolesAndResponsibilities} onChange={handleChange} rows={3} className={`${inputCls} resize-y bg-white`} />
            </div>
            <div>
              <label htmlFor="requirements" className={labelCls}>Requirements</label>
              <textarea id="requirements" name="requirements" value={formData.requirements} onChange={handleChange} rows={3} className={`${inputCls} resize-y bg-white`} />
            </div>
            <div>
              <label htmlFor="niceToHave" className={labelCls}>Nice To Have / Preferred</label>
              <textarea id="niceToHave" name="niceToHave" value={formData.niceToHave} onChange={handleChange} rows={2} className={`${inputCls} resize-y bg-white`} />
            </div>
          </div>
        </Section>

        {/* ── Image Upload ── */}
        <Section title="Company Logo Upload">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden shrink-0">
               {logoPreview ? (
                 <img src={logoPreview} alt="Preview" className="w-full h-full object-contain p-1" />
               ) : (
                 <ImageIcon className="w-8 h-8 text-slate-300" />
               )}
            </div>
            
            <div className="flex-1">
              <label htmlFor="companyLogo" className="block text-[14px] font-bold text-slate-900 mb-2">Select Logo Image *</label>
              <input type="file" id="companyLogo" ref={logoRef} accept="image/*" onChange={handleFileChange} className="hidden" />
              
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => logoRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 border-2 border-slate-200 text-slate-700 rounded-xl font-bold text-[13px] hover:border-indigo-600 hover:text-indigo-600 transition-all bg-white"
                >
                  <Upload className="w-4 h-4" /> Browse File
                </button>
                <span className="text-[13px] text-slate-500 font-medium">
                  {formData.companyLogo ? formData.companyLogo.name : 'No file chosen'}
                </span>
              </div>
              <p className="text-[12px] text-slate-400 mt-2">Required. Accepted formats: JPG, PNG, WEBP, GIF. Max size 2MB.</p>
            </div>
          </div>
        </Section>

        {/* ── Submit Area ── */}
        <div className="flex justify-end pt-2 pb-10">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-8 py-3.5 bg-indigo-600 text-white rounded-xl font-bold text-[15px] hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-600/30 disabled:opacity-60"
          >
             {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <PlusCircle className="w-5 h-5" />}
             {loading ? 'Submitting Job...' : 'Publish Job Listing'}
          </button>
        </div>

      </form>
    </div>
  );
}
