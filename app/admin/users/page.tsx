"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Users2, Building2, X, ChevronLeft, ChevronRight,
  CheckCircle2, Ban, Loader2, Mail, Phone, MapPin, Calendar,
  ArrowRight, Sparkles, BookOpen, Briefcase, Wrench, Shield, FileText
} from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL;
const authH = () => ({
  'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
  'Accept': 'application/json',
  'Content-Type': 'application/json',
});

type UserType = 'candidate' | 'employer';

type AppUser = {
  id: number;
  full_name: string;
  email: string;
  phone?: string;
  location?: string;
  bio?: string;
  is_active: boolean;
  is_employer: boolean;
  created_at: string;
  profile_image?: string;
  userType?: string;
  profile_completeness?: number;
  resume?: string;
  resume_text?: string;
  skills?: string[] | string;
  work_experience?: any[];
  education?: any[];
  ai_credits: number;
  is_first_resume_health_free_used: boolean;
  application_tracker_count?: number;
  job_matches_count?: number;
  is_pro: boolean;
  pro_expires_at?: string;
};

export default function AdminUsersPage() {
  const [tab, setTab] = useState<UserType>('candidate');
  const [users, setUsers] = useState<AppUser[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<Record<number, boolean>>({});
  const [toast, setToast] = useState<string | null>(null);

  // Detail drawer states
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [drawerTab, setDrawerTab] = useState<'profile' | 'resume'>('profile');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      type: tab,
      page: String(page),
      ...(search && { search }),
    });
    try {
      const res = await fetch(`${API}/api/admin/users?${params}`, { headers: authH() });
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
        setTotal(data.total);
        setTotalPages(data.totalPages ?? 1);
      }
    } catch { }
    setLoading(false);
  }, [tab, page, search]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);
  useEffect(() => { setPage(1); }, [tab, search]);

  const toggleStatus = async (userId: number) => {
    setToggling(p => ({ ...p, [userId]: true }));
    try {
      const res = await fetch(`${API}/api/admin/users/${userId}/toggle-status`, { method: 'PUT', headers: authH() });
      const data = await res.json();
      if (data.success) {
        setUsers(prev => prev.map(u =>
          u.id === userId ? { ...u, is_active: data.user.is_active } : u
        ));
        
        // Update selected user in drawer as well if open
        if (selectedUser && selectedUser.id === userId) {
          setSelectedUser(prev => prev ? { ...prev, is_active: data.user.is_active } : null);
        }
        
        showToast(data.user.is_active ? 'User activated successfully' : 'User deactivated successfully');
      }
    } catch { }
    setToggling(p => ({ ...p, [userId]: false }));
  };

  const revokePro = async (userId: number) => {
    if (!confirm('Are you sure you want to manually revoke the Pro plan for this user? This does not start an automatic refund. Please manually deduct GST and Payment Gateway charges before refunding.')) return;
    setToggling(p => ({ ...p, [userId]: true }));
    try {
      const res = await fetch(`${API}/api/admin/users/${userId}/revoke-pro`, { method: 'PUT', headers: authH() });
      const data = await res.json();
      if (data.success) {
        setUsers(prev => prev.map(u =>
          u.id === userId ? { ...u, is_pro: false } : u
        ));
        
        if (selectedUser && selectedUser.id === userId) {
          setSelectedUser(prev => prev ? { ...prev, is_pro: false } : null);
        }
        
        showToast('Pro plan revoked successfully');
      } else {
        showToast(data.message || 'Failed to revoke Pro plan');
      }
    } catch { 
      showToast('Error revoking Pro plan');
    }
    setToggling(p => ({ ...p, [userId]: false }));
  };

  // Fetch complete profile details on row click
  const openDetails = async (userId: number) => {
    setSelectedUserId(userId);
    setLoadingDetails(true);
    setDrawerTab('profile');
    try {
      const res = await fetch(`${API}/api/admin/users/${userId}`, { headers: authH() });
      const data = await res.json();
      if (data.success) {
        setSelectedUser(data.user);
      }
    } catch {
      showToast('Error fetching user profile');
    }
    setLoadingDetails(false);
  };

  const formatDate = (d: string) =>
    d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

  const TABS: { label: string; value: UserType; icon: React.ElementType }[] = [
    { label: 'Candidates', value: 'candidate', icon: Users2 },
    { label: 'Employers', value: 'employer', icon: Building2 },
  ];

  return (
    <div className="flex flex-col gap-5 relative">

      {/* Toast Alert */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 right-6 z-50 px-5 py-3 bg-emerald-500 text-white rounded-2xl shadow-xl font-bold text-[13px] flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" /> {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Details Side-Drawer */}
      <AnimatePresence>
        {selectedUserId && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => { setSelectedUserId(null); setSelectedUser(null); }}
              className="fixed inset-0 bg-black z-40"
            />

            {/* Slide-over Menu */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full md:max-w-xl bg-white shadow-2xl z-50 flex flex-col h-full border-l border-slate-100 font-sora"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-black text-slate-900 text-base">User Detail Profile</h3>
                </div>
                <button
                  onClick={() => { setSelectedUserId(null); setSelectedUser(null); }}
                  className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto">
                {loadingDetails ? (
                  <div className="flex flex-col items-center justify-center h-64 gap-3">
                    <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                    <span className="text-[12px] text-slate-400 font-bold uppercase tracking-wider">Loading profile details…</span>
                  </div>
                ) : selectedUser ? (
                  <div className="p-6 flex flex-col gap-6">
                    
                    {/* User Intro Block */}
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-150">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white text-lg font-black shrink-0 overflow-hidden shadow-sm">
                        {selectedUser.profile_image ? (
                          <img src={`${API}/${selectedUser.profile_image}`} alt={selectedUser.full_name} className="w-full h-full object-cover" />
                        ) : (
                          (selectedUser.full_name || 'U').charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-black text-slate-900 text-base truncate">{selectedUser.full_name || 'Candidate'}</h4>
                          {selectedUser.is_pro && (
                            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[9px] font-black rounded uppercase tracking-wider">PRO</span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">ID: #{selectedUser.id} • {selectedUser.is_employer ? 'Employer' : 'Candidate'}</p>
                        <div className="mt-2.5 flex items-center gap-1.5">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${selectedUser.is_active !== false ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                            {selectedUser.is_active !== false ? 'Active' : 'Inactive'}
                          </span>
                          <span className="text-[11px] text-slate-400 font-medium">Joined {formatDate(selectedUser.created_at)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-white rounded-xl p-3 border border-slate-150 text-center shadow-sm">
                        <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">AI Credits</span>
                        <span className="text-base font-black text-slate-800 mt-1 block">
                          {selectedUser.is_pro ? 'PRO (Unlimited)' : `${selectedUser.ai_credits ?? 0}`}
                        </span>
                      </div>
                      <div className="bg-white rounded-xl p-3 border border-slate-150 text-center shadow-sm">
                        <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tracker Cards</span>
                        <span className="text-base font-black text-slate-800 mt-1 block">
                          {selectedUser.application_tracker_count ?? 0}
                        </span>
                      </div>
                      <div className="bg-white rounded-xl p-3 border border-slate-150 text-center shadow-sm">
                        <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">AI Match Count</span>
                        <span className="text-base font-black text-slate-800 mt-1 block">
                          {selectedUser.job_matches_count ?? 0}
                        </span>
                      </div>
                    </div>

                    {/* Contact Details */}
                    <div className="flex flex-col gap-2 p-4 rounded-xl bg-white border border-slate-150 shadow-sm text-[12.5px] font-semibold text-slate-600">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="truncate">{selectedUser.email}</span>
                      </div>
                      {selectedUser.phone && (
                        <div className="flex items-center gap-2 mt-1">
                          <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                          <span>{selectedUser.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>{selectedUser.location || 'Location not specified'}</span>
                      </div>
                    </div>

                    {/* Drawer internal tabs */}
                    {tab === 'candidate' && (
                      <div className="flex border-b border-slate-150">
                        <button
                          onClick={() => setDrawerTab('profile')}
                          className={`flex-1 pb-2 text-center text-xs font-black uppercase tracking-wider border-b-2 transition-all ${drawerTab === 'profile' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                        >
                          Experience & Bio
                        </button>
                        <button
                          onClick={() => setDrawerTab('resume')}
                          className={`flex-1 pb-2 text-center text-xs font-black uppercase tracking-wider border-b-2 transition-all ${drawerTab === 'resume' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                        >
                          Skills & Resume
                        </button>
                      </div>
                    )}

                    {/* Tab 1: Profile Details */}
                    {drawerTab === 'profile' && (
                      <div className="flex flex-col gap-5">
                        {/* Bio */}
                        {selectedUser.bio && (
                          <div className="flex flex-col gap-1.5">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Candidate Bio</span>
                            <p className="text-[12.5px] text-slate-500 font-semibold leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">{selectedUser.bio}</p>
                          </div>
                        )}

                        {/* Experience */}
                        <div className="flex flex-col gap-3">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" /> Work Experience</span>
                          {selectedUser.work_experience && selectedUser.work_experience.length > 0 ? (
                            <div className="relative pl-4 border-l-2 border-indigo-100 flex flex-col gap-4">
                              {selectedUser.work_experience.map((exp: any, i: number) => (
                                <div key={i} className="relative">
                                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-white" />
                                  <div className="text-[13px] font-black text-slate-800">{exp.role}</div>
                                  <div className="text-[11.5px] text-slate-500 font-bold mt-0.5">{exp.company} • {exp.from_year} – {exp.is_current ? 'Present' : (exp.to_year || 'N/A')}</div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-[12px] text-slate-400 font-semibold italic bg-slate-50 p-3.5 rounded-xl border border-slate-100">No work experience listed.</span>
                          )}
                        </div>

                        {/* Education */}
                        <div className="flex flex-col gap-3">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /> Education</span>
                          {selectedUser.education && selectedUser.education.length > 0 ? (
                            <div className="flex flex-col gap-3">
                              {selectedUser.education.map((edu: any, i: number) => (
                                <div key={i} className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                                  <div className="text-[13px] font-black text-slate-800">{edu.degree}</div>
                                  <div className="text-[11.5px] text-slate-500 font-bold mt-0.5">{edu.institution} ({edu.year || 'N/A'})</div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-[12px] text-slate-400 font-semibold italic bg-slate-50 p-3.5 rounded-xl border border-slate-100">No education details listed.</span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Tab 2: Skills & Resume */}
                    {drawerTab === 'resume' && (
                      <div className="flex flex-col gap-5">
                        {/* Skills */}
                        <div className="flex flex-col gap-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Wrench className="w-3.5 h-3.5" /> Skills</span>
                          {selectedUser.skills && (Array.isArray(selectedUser.skills) ? selectedUser.skills.length > 0 : String(selectedUser.skills).trim() !== '') ? (
                            <div className="flex flex-wrap gap-1.5">
                              {(Array.isArray(selectedUser.skills) ? selectedUser.skills : String(selectedUser.skills).split(',')).map((skill: string, idx: number) => (
                                <span key={idx} className="px-2.5 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold text-[11px] rounded-lg">
                                  {skill.trim()}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-[12px] text-slate-400 font-semibold italic bg-slate-50 p-3.5 rounded-xl border border-slate-100">No skills specified.</span>
                          )}
                        </div>

                        {/* Resume File */}
                        <div className="flex flex-col gap-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Resume File</span>
                          {selectedUser.resume ? (
                            <div className="flex items-center gap-3 p-4 rounded-xl border border-indigo-100 bg-indigo-50/20">
                              <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                                <FileText className="w-5 h-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="block text-[12.5px] font-bold text-slate-800 truncate">Uploaded Resume PDF</span>
                                <span className="block text-[10px] text-slate-400 font-semibold mt-0.5">Stored on public disk</span>
                              </div>
                              <a
                                href={`${API}/${selectedUser.resume}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] rounded-lg transition-all"
                              >
                                View PDF
                              </a>
                            </div>
                          ) : (
                            <span className="text-[12px] text-slate-400 font-semibold italic bg-slate-50 p-3.5 rounded-xl border border-slate-100">No resume PDF uploaded.</span>
                          )}
                        </div>

                        {/* Resume Health Indicator */}
                        <div className="flex flex-col gap-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Resume Health Diagnostic</span>
                          <div className="p-4 rounded-xl border border-slate-150 shadow-sm flex items-center justify-between text-[12.5px] font-semibold text-slate-700">
                            <span>Status:</span>
                            <span className={`font-black ${selectedUser.is_first_resume_health_free_used ? 'text-indigo-600' : 'text-slate-400'}`}>
                              {selectedUser.is_first_resume_health_free_used ? 'Analysis Performed' : 'Not Used Yet'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Danger Zone Actions */}
                    <div className="mt-4 pt-6 border-t border-slate-150 flex flex-col gap-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Account Management</span>
                      <div className="flex gap-3 mt-1.5">
                        <button
                          onClick={() => toggleStatus(selectedUser.id)}
                          disabled={!!toggling[selectedUser.id]}
                          className={`flex-1 flex items-center justify-center gap-1.5 h-10 rounded-xl text-[12.5px] font-bold border transition-all cursor-pointer disabled:opacity-50 ${selectedUser.is_active !== false
                              ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            }`}
                        >
                          {toggling[selectedUser.id] ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : selectedUser.is_active !== false ? (
                            <Ban className="w-4 h-4" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4" />
                          )}
                          {selectedUser.is_active !== false ? 'Deactivate Account' : 'Activate Account'}
                        </button>

                        {selectedUser.is_pro && (
                          <button
                            onClick={() => revokePro(selectedUser.id)}
                            disabled={!!toggling[selectedUser.id]}
                            className="flex-1 flex items-center justify-center gap-1.5 h-10 rounded-xl text-[12.5px] font-bold border bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 transition-all cursor-pointer disabled:opacity-50"
                          >
                            <Ban className="w-4 h-4" />
                            Revoke Pro Plan
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="py-20 text-center text-slate-400 text-sm">Failed to load candidate information.</div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900">User Management</h1>
        <p className="text-[13px] text-slate-500 font-medium mt-0.5">
          {total.toLocaleString()} {tab}s registered
        </p>
      </div>

      {/* Tabs + Search */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row gap-3">
        {/* Tab pills */}
        <div className="flex items-center gap-1 p-1 bg-slate-50 border border-slate-200 rounded-xl">
          {TABS.map(({ label, value, icon: Icon }) => (
            <button
              key={value}
              onClick={() => { setTab(value); setPage(1); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-bold transition-all cursor-pointer ${tab === value
                  ? 'bg-white shadow-sm text-indigo-600 border border-slate-200'
                  : 'text-slate-500 hover:text-slate-800'
                }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder={`Search ${tab}s by name or email…`}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-[14px] text-slate-700 placeholder-slate-400 outline-none font-medium"
          />
          {search && (
            <button onClick={() => setSearch('')} className="cursor-pointer">
              <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
            </button>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className="py-20 text-center text-slate-400 font-medium">
            No {tab}s found{search ? ` for "${search}"` : ''}.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px] min-w-[720px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  {['User', 'Contact', 'Location', 'Usage & Credits', 'Joined', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3.5 font-bold text-slate-500 uppercase tracking-wider text-[11px] first:pl-6">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((user, i) => (
                  <tr
                    key={user.id}
                    className={`border-b border-slate-50 hover:bg-indigo-50/20 transition-colors ${i % 2 !== 0 ? 'bg-slate-50/40' : ''}`}
                  >
                    {/* User Profile */}
                    <td className="pl-6 pr-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-blue-600 flex items-center justify-center text-white text-[13px] font-black shrink-0 overflow-hidden shadow-sm">
                          {user.profile_image
                            ? <img src={`${API}/${user.profile_image}`} alt={user.full_name} className="w-full h-full object-cover" />
                            : (user.full_name || 'U').charAt(0).toUpperCase()
                          }
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 leading-tight flex items-center gap-1.5">
                            {user.full_name || '—'}
                            {user.is_pro && (
                              <span className="px-1.5 py-0.2 bg-indigo-55 bg-indigo-50 border border-indigo-200 text-indigo-700 text-[8.5px] font-black rounded uppercase tracking-wider">💎 Pro</span>
                            )}
                          </div>
                          <div className="text-slate-400 text-[11.5px] font-bold mt-0.5">#{user.id}</div>
                        </div>
                      </div>
                    </td>

                    {/* Contact details */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5 text-slate-600 font-bold text-[12px]">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate max-w-[170px]">{user.email}</span>
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-1.5 text-slate-500 font-bold text-[12px] mt-1">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          {user.phone}
                        </div>
                      )}
                    </td>

                    {/* Location */}
                    <td className="px-4 py-4">
                      {user.location ? (
                        <span className="flex items-center gap-1.5 text-slate-600 font-bold text-[12px]">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {user.location}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-semibold italic">—</span>
                      )}
                    </td>

                    {/* Usage & Credits */}
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-0.5 text-[11.5px] font-bold text-slate-600">
                        {user.is_pro ? (
                          <span className="text-indigo-700 uppercase text-[9.5px] font-black bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded w-fit">💎 Pro Pass</span>
                        ) : (
                          <span className="text-emerald-700 text-[12px]">{user.ai_credits ?? 0} Credits Left</span>
                        )}
                        {tab === 'candidate' && (
                          <div className="text-[10.5px] text-slate-400 font-bold mt-1">
                            {user.application_tracker_count ?? 0} Cards • {user.job_matches_count ?? 0} Matches
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Joined Date */}
                    <td className="px-4 py-4 text-slate-500 font-bold text-[12px]">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {formatDate(user.created_at)}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border tracking-wider ${user.is_active !== false
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-250 bg-emerald-50/50'
                          : 'bg-slate-50 text-slate-500 border-slate-200'
                        }`}>
                        {user.is_active !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openDetails(user.id)}
                          className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-750 text-indigo-700 font-bold text-[11.5px] rounded-lg border border-indigo-200 transition-all cursor-pointer"
                        >
                          View Profile
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50">
            <span className="text-[13px] text-slate-500 font-medium">
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
