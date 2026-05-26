"use client";

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Phone, MapPin, FileText, Tag,
  Upload, CheckCircle2, AlertCircle, Camera, X, Save,
  Briefcase, GraduationCap, Plus, Trash2, WifiOff
} from 'lucide-react';

export default function ProfileSettingsPage() {
  interface WorkExp {
    company: string;
    role: string;
    from_year: string;
    to_year: string;
    is_current: boolean;
  }

  interface Education {
    degree: string;
    institution: string;
    year: string;
  }

  const [profile, setProfile] = useState<any>(null);
  const [resumeWarning, setResumeWarning] = useState<string | null>(null);
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    location: '',
    bio: '',
    skills: [] as string[],
    work_experience: [] as WorkExp[],
    education: [] as Education[],
  });
  const [newSkill, setNewSkill] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const photoRef = useRef<HTMLInputElement>(null);
  const resumeRef = useRef<HTMLInputElement>(null);

  /* ── Helpers ── */
  const token = () => localStorage.getItem('token') || '';

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const parseSkills = (raw: any): string[] => {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw.filter(Boolean);
    if (typeof raw === 'string') return raw.split(',').map((s: string) => s.trim()).filter(Boolean);
    return [];
  };

  const applyProfile = (p: any) => {
    setProfile(p);
    setForm({
      full_name: p.full_name || '',
      phone: p.phone || '',
      location: p.location || '',
      bio: p.bio || '',
      skills: parseSkills(p.skills),
      work_experience: Array.isArray(p.work_experience) ? p.work_experience : [],
      education: Array.isArray(p.education) ? p.education : [],
    });
  };

  /* ── Load profile ── */
  useEffect(() => {
    const cached = localStorage.getItem('candidate');
    if (cached) {
      const parsed = JSON.parse(cached);
      applyProfile(parsed);
      if (parsed.resume && (!parsed.resume_text || parsed.resume_text.length < 150)) {
        setResumeWarning("Your uploaded resume PDF/document appears to be a scanned image or has very little readable text. For best AI matching results, please upload a text-based PDF or fill out your profile details fully.");
      }
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/candidate/profile`, {
      headers: { 'Authorization': `Bearer ${token()}`, 'Accept': 'application/json' },
    })
      .then(r => r.json())
      .then(data => {
        if (data?.success && data.user) {
          applyProfile(data.user);
          localStorage.setItem('candidate', JSON.stringify(data.user));
          if (data.user.resume && (!data.user.resume_text || data.user.resume_text.length < 150)) {
            setResumeWarning("Your uploaded resume PDF/document appears to be a scanned image or has very little readable text. For best AI matching results, please upload a text-based PDF or fill out your profile details fully.");
          } else {
            setResumeWarning(null);
          }
        }
      })
      .catch(() => {
        showToast('Unable to load your profile from the server. Showing cached data.', 'error');
      });
  }, []); // eslint-disable-line

  /* ── Save profile ── */
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/candidate/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token()}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ ...form, name: form.full_name }),
      });
      const data = await res.json();
      if (data.success) {
        applyProfile(data.user);
        localStorage.setItem('candidate', JSON.stringify(data.user));
        showToast('Profile updated successfully!', 'success');
      } else {
        showToast(data.message || 'Failed to save. Please try again.', 'error');
      }
    } catch {
      showToast('Network error. Please check your connection.', 'error');
    } finally {
      setSaving(false);
    }
  };

  /* ── Photo upload ── */
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    const fd = new FormData();
    fd.append('image', file);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/candidate/profile/image`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token()}`, 'Accept': 'application/json' },
        body: fd,
      });
      const data = await res.json();
      if (data.success) {
        const updated = { ...profile, profile_image: data.profile_image };
        setProfile(updated);
        localStorage.setItem('candidate', JSON.stringify(updated));
        showToast('Profile photo updated!', 'success');
      } else {
        showToast(data.message || 'Photo upload failed.', 'error');
      }
    } catch {
      showToast('Upload failed. Try again.', 'error');
    } finally {
      setUploadingPhoto(false);
    }
  };

  /* ── Resume upload ── */
  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingResume(true);
    const fd = new FormData();
    fd.append('resume', file);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/candidate/profile/resume`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token()}`, 'Accept': 'application/json' },
        body: fd,
      });
      const data = await res.json();
      if (data.success) {
        const updated = { ...profile, resume: data.resume, resume_text: data.resume_text };
        setProfile(updated);
        localStorage.setItem('candidate', JSON.stringify(updated));
        
        if (data.warning) {
          setResumeWarning(data.warning);
          showToast('Resume uploaded with warnings.', 'error');
        } else {
          setResumeWarning(null);
          showToast('Resume uploaded successfully!', 'success');
        }
      } else {
        showToast(data.message || 'Resume upload failed.', 'error');
      }
    } catch {
      showToast('Upload failed. Try again.', 'error');
    } finally {
      setUploadingResume(false);
    }
  };

  /* ── Skill helpers ── */
  const addSkill = () => {
    const s = newSkill.trim();
    if (s && !form.skills.includes(s) && form.skills.length < 15) {
      setForm(prev => ({ ...prev, skills: [...prev.skills, s] }));
      setNewSkill('');
    }
  };
  const removeSkill = (skill: string) =>
    setForm(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));

  /* ── Work Experience helpers ── */
  const addWorkExperience = () => {
    if (form.work_experience.length >= 5) {
      showToast('Maximum 5 work experience entries allowed.', 'error');
      return;
    }
    setForm(prev => ({
      ...prev,
      work_experience: [
        ...prev.work_experience,
        { company: '', role: '', from_year: '', to_year: '', is_current: false }
      ]
    }));
  };

  const updateWorkExperience = (index: number, field: keyof WorkExp, val: any) => {
    setForm(prev => {
      const updated = [...prev.work_experience];
      updated[index] = { ...updated[index], [field]: val };
      if (field === 'is_current' && val === true) {
        updated[index].to_year = '';
      }
      return { ...prev, work_experience: updated };
    });
  };

  const removeWorkExperience = (index: number) => {
    setForm(prev => ({
      ...prev,
      work_experience: prev.work_experience.filter((_, i) => i !== index)
    }));
  };

  /* ── Education helpers ── */
  const addEducation = () => {
    if (form.education.length >= 3) {
      showToast('Maximum 3 education entries allowed.', 'error');
      return;
    }
    setForm(prev => ({
      ...prev,
      education: [
        ...prev.education,
        { degree: '', institution: '', year: '' }
      ]
    }));
  };

  const updateEducation = (index: number, field: keyof Education, val: string) => {
    setForm(prev => {
      const updated = [...prev.education];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, education: updated };
    });
  };

  const removeEducation = (index: number) => {
    setForm(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  /* ── Input class helper ── */
  const inputCls = 'w-full py-3 bg-slate-50 border border-slate-200 rounded-xl text-[15px] text-slate-900 font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all';

  return (
    <div className="flex flex-col gap-6">

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-20 right-6 z-[9999] px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-[14px] ${
              toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
            }`}
          >
            {toast.type === 'success'
              ? <CheckCircle2 className="w-5 h-5 shrink-0" />
              : <AlertCircle className="w-5 h-5 shrink-0" />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-100 font-playfair tracking-tight">
            Profile Settings
          </h1>
          <p className="text-[14px] text-slate-500 font-medium mt-1">
            Keep your profile up-to-date to attract better opportunities.
          </p>
        </div>
        {profile && (
          <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-2xl px-5 py-3 self-start sm:self-auto shrink-0">
            <div className="text-right">
              <span className="text-[10px] text-slate-500 font-bold block uppercase tracking-widest">Completeness</span>
              <span className="text-sm font-black text-white">{profile.profile_completeness ?? 0}%</span>
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
              (profile.profile_completeness ?? 0) >= 80 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
            }`}>
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        )}
      </div>

      {/* ── Profile Photo ── */}
      <section className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm">
        <h2 className="text-[15px] font-black text-slate-900 mb-5 flex items-center gap-2">
          <Camera className="w-5 h-5 text-blue-500" /> Profile Photo
        </h2>
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center border-4 border-slate-100 shadow overflow-hidden shrink-0">
            {profile?.profile_image ? (
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}/${profile.profile_image}`}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl font-black text-white select-none">
                {(form.full_name || profile?.full_name || 'U').charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <input
              type="file"
              ref={photoRef}
              onChange={handlePhotoUpload}
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
            />
            <button
              onClick={() => photoRef.current?.click()}
              disabled={uploadingPhoto}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-[14px] hover:bg-blue-600 transition-colors shadow-sm disabled:opacity-60"
            >
              {uploadingPhoto
                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <Upload className="w-4 h-4" />}
              {uploadingPhoto ? 'Uploading…' : 'Upload Photo'}
            </button>
            <p className="text-[12px] text-slate-400 mt-1.5">JPG, PNG or WEBP · Max 2 MB</p>
          </div>
        </div>
      </section>

      {/* ── Basic Information ── */}
      <section className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm">
        <h2 className="text-[15px] font-black text-slate-900 mb-5 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-500" /> Basic Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Full Name */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={form.full_name}
                onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))}
                placeholder="Your full name"
                className={`${inputCls} pl-10 pr-4`}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">
              Email <span className="text-slate-400 normal-case font-medium">(read-only)</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                value={profile?.email || ''}
                readOnly
                className="w-full pl-10 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-[15px] text-slate-500 font-medium cursor-not-allowed"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="tel"
                value={form.phone}
                onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                placeholder="+91 9876543210"
                className={`${inputCls} pl-10 pr-4`}
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={form.location}
                onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                placeholder="e.g. Bengaluru, India"
                className={`${inputCls} pl-10 pr-4`}
              />
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="mt-4">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">
            Bio / About You
          </label>
          <textarea
            value={form.bio}
            onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
            rows={4}
            maxLength={500}
            placeholder="Tell employers a bit about yourself, your experience, and what you're looking for…"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[15px] text-slate-900 font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all resize-none"
          />
          <p className="text-[11px] text-right text-slate-400 mt-1">{form.bio.length} / 500</p>
        </div>
      </section>

      {/* ── Skills ── */}
      <section className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm">
        <h2 className="text-[15px] font-black text-slate-900 mb-5 flex items-center gap-2">
          <Tag className="w-5 h-5 text-blue-500" /> Skills
          <span className="ml-auto text-[12px] font-medium text-slate-400">{form.skills.length} / 15</span>
        </h2>

        <div className="flex flex-wrap gap-2 mb-4 min-h-[36px]">
          {form.skills.map(skill => (
            <span
              key={skill}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-[13px] font-bold"
            >
              {skill}
              <button
                onClick={() => removeSkill(skill)}
                className="hover:text-rose-500 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
          {form.skills.length === 0 && (
            <p className="text-[13px] text-slate-400 italic">No skills added yet.</p>
          )}
        </div>

        {form.skills.length < 15 && (
          <div className="flex gap-2">
            <input
              type="text"
              value={newSkill}
              onChange={e => setNewSkill(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
              placeholder="Add a skill (e.g. React, Python, SQL)…"
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] text-slate-900 font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
            />
            <button
              onClick={addSkill}
              disabled={!newSkill.trim()}
              className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-[14px] hover:bg-blue-600 transition-colors disabled:opacity-40"
            >
              Add
            </button>
          </div>
        )}
        <p className="text-[11px] text-slate-400 mt-2">Press Enter or click Add. Maximum 15 skills.</p>
      </section>

      {/* ── Work Experience ── */}
      <section className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm">
        <h2 className="text-[15px] font-black text-slate-900 mb-5 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-blue-500" /> Work Experience
          <span className="ml-auto text-[12px] font-medium text-slate-400">{form.work_experience.length} / 5</span>
        </h2>

        <div className="flex flex-col gap-4">
          {form.work_experience.map((exp, index) => (
            <div key={index} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl relative flex flex-col gap-4">
              <button
                type="button"
                onClick={() => removeWorkExperience(index)}
                className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 transition-colors p-1.5 hover:bg-slate-100 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Role */}
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">
                    Role / Job Title
                  </label>
                  <input
                    type="text"
                    value={exp.role}
                    onChange={e => updateWorkExperience(index, 'role', e.target.value)}
                    placeholder="e.g. Senior Software Engineer"
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[14px] text-slate-900 font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                  />
                </div>

                {/* Company */}
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">
                    Company
                  </label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={e => updateWorkExperience(index, 'company', e.target.value)}
                    placeholder="e.g. Google India"
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[14px] text-slate-900 font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                {/* From Year */}
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">
                    From Year
                  </label>
                  <input
                    type="text"
                    value={exp.from_year}
                    onChange={e => updateWorkExperience(index, 'from_year', e.target.value)}
                    placeholder="e.g. 2022"
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[14px] text-slate-900 font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                  />
                </div>

                {/* To Year */}
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">
                    To Year
                  </label>
                  <input
                    type="text"
                    value={exp.to_year}
                    onChange={e => updateWorkExperience(index, 'to_year', e.target.value)}
                    disabled={exp.is_current}
                    placeholder={exp.is_current ? 'Present' : 'e.g. 2025'}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[14px] text-slate-900 font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all disabled:opacity-50 disabled:bg-slate-100"
                  />
                </div>

                {/* Is Current Checkbox */}
                <div className="flex items-center gap-2 mt-4 md:mt-0">
                  <input
                    type="checkbox"
                    id={`is_current_${index}`}
                    checked={exp.is_current}
                    onChange={e => updateWorkExperience(index, 'is_current', e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor={`is_current_${index}`} className="text-[13px] font-semibold text-slate-700 select-none cursor-pointer">
                    I currently work here
                  </label>
                </div>
              </div>
            </div>
          ))}

          {form.work_experience.length === 0 && (
            <p className="text-[13px] text-slate-400 italic">No work experience added yet.</p>
          )}

          {form.work_experience.length < 5 && (
            <button
              type="button"
              onClick={addWorkExperience}
              className="mt-2 flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-200 hover:border-blue-400 text-slate-500 hover:text-blue-600 rounded-2xl font-bold text-[13px] transition-all bg-slate-50/50 hover:bg-blue-50/20"
            >
              <Plus className="w-4 h-4" /> Add Work Experience
            </button>
          )}
        </div>
      </section>

      {/* ── Education ── */}
      <section className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm">
        <h2 className="text-[15px] font-black text-slate-900 mb-5 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-blue-500" /> Education
          <span className="ml-auto text-[12px] font-medium text-slate-400">{form.education.length} / 3</span>
        </h2>

        <div className="flex flex-col gap-4">
          {form.education.map((edu, index) => (
            <div key={index} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl relative flex flex-col gap-4">
              <button
                type="button"
                onClick={() => removeEducation(index)}
                className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 transition-colors p-1.5 hover:bg-slate-100 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Degree */}
                <div className="md:col-span-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">
                    Degree / Course
                  </label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={e => updateEducation(index, 'degree', e.target.value)}
                    placeholder="e.g. B.Tech Computer Science"
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[14px] text-slate-900 font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                  />
                </div>

                {/* Institution */}
                <div className="md:col-span-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">
                    Institution / University
                  </label>
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={e => updateEducation(index, 'institution', e.target.value)}
                    placeholder="e.g. VIT University"
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[14px] text-slate-900 font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                  />
                </div>

                {/* Year */}
                <div className="md:col-span-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 block">
                    Graduation Year
                  </label>
                  <input
                    type="text"
                    value={edu.year}
                    onChange={e => updateEducation(index, 'year', e.target.value)}
                    placeholder="e.g. 2020"
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[14px] text-slate-900 font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>
          ))}

          {form.education.length === 0 && (
            <p className="text-[13px] text-slate-400 italic">No education details added yet.</p>
          )}

          {form.education.length < 3 && (
            <button
              type="button"
              onClick={addEducation}
              className="mt-2 flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-200 hover:border-blue-400 text-slate-500 hover:text-blue-600 rounded-2xl font-bold text-[13px] transition-all bg-slate-50/50 hover:bg-blue-50/20"
            >
              <Plus className="w-4 h-4" /> Add Education
            </button>
          )}
        </div>
      </section>

      {/* ── Resume ── */}
      <section className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm">
        <h2 className="text-[15px] font-black text-slate-900 mb-5 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-500" /> Resume
        </h2>

        {resumeWarning && (
          <div className="mb-5 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[13px] font-medium leading-relaxed">{resumeWarning}</p>
          </div>
        )}

        <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100 shrink-0">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-[14px] font-bold text-slate-900">
                {profile?.resume ? 'Resume uploaded ✓' : 'No resume uploaded'}
              </p>
              <p className="text-[12px] text-slate-400">PDF, DOC or DOCX · Max 5 MB</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {profile?.resume && (
              <a
                href={`${process.env.NEXT_PUBLIC_API_URL}/${profile.resume}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-bold text-[13px] hover:bg-slate-100 transition-colors"
              >
                View
              </a>
            )}
            <input
              type="file"
              ref={resumeRef}
              onChange={handleResumeUpload}
              accept=".pdf,.doc,.docx"
              className="hidden"
            />
            <button
              onClick={() => resumeRef.current?.click()}
              disabled={uploadingResume}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl font-bold text-[13px] hover:bg-blue-600 transition-colors disabled:opacity-60"
            >
              {uploadingResume
                ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <Upload className="w-3.5 h-3.5" />}
              {uploadingResume ? 'Uploading…' : profile?.resume ? 'Replace' : 'Upload'}
            </button>
          </div>
        </div>
      </section>

      {/* ── Save Button ── */}
      <div className="flex justify-end pb-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2.5 px-8 py-3.5 bg-slate-900 text-white rounded-xl font-bold text-[15px] hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-600/25 disabled:opacity-60 disabled:pointer-events-none"
        >
          {saving
            ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : <Save className="w-5 h-5" />}
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>

    </div>
  );
}
