"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Users2, Building2, X,
  ChevronLeft, ChevronRight, CheckCircle2, Ban, Loader2,
  Mail, Phone, MapPin, Calendar,
} from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL;
const authH = () => ({
  'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
  'Accept': 'application/json',
  'Content-Type': 'application/json',
});

type UserType = 'candidate' | 'employer';

type AppUser = {
  id: number; fullName: string; email: string; phone?: string;
  location?: string; is_active: boolean; created_at: string;
  profile_image?: string; userType?: string;
};

export default function AdminUsersPage() {
  const [tab,        setTab]        = useState<UserType>('candidate');
  const [users,      setUsers]      = useState<AppUser[]>([]);
  const [total,      setTotal]      = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page,       setPage]       = useState(1);
  const [search,     setSearch]     = useState('');
  const [loading,    setLoading]    = useState(true);
  const [toggling,   setToggling]   = useState<Record<number, boolean>>({});
  const [toast,      setToast]      = useState<string | null>(null);

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
      const res  = await fetch(`${API}/api/admin/users?${params}`, { headers: authH() });
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
        setTotal(data.total);
        setTotalPages(data.totalPages ?? 1);
      }
    } catch {}
    setLoading(false);
  }, [tab, page, search]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);
  useEffect(() => { setPage(1); }, [tab, search]);

  const toggleStatus = async (userId: number) => {
    setToggling(p => ({ ...p, [userId]: true }));
    try {
      const res  = await fetch(`${API}/api/admin/users/${userId}/toggle-status`, { method: 'PUT', headers: authH() });
      const data = await res.json();
      if (data.success) {
        setUsers(prev => prev.map(u =>
          u.id === userId ? { ...u, is_active: data.user.is_active } : u
        ));
        showToast(data.user.is_active ? 'User activated' : 'User deactivated');
      }
    } catch {}
    setToggling(p => ({ ...p, [userId]: false }));
  };

  const formatDate = (d: string) =>
    d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' }) : '—';

  const TABS: { label: string; value: UserType; icon: React.ElementType }[] = [
    { label: 'Candidates', value: 'candidate', icon: Users2   },
    { label: 'Employers',  value: 'employer',  icon: Building2 },
  ];

  return (
    <div className="flex flex-col gap-5">

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 right-6 z-50 px-5 py-3 bg-emerald-500 text-white rounded-2xl shadow-xl font-bold text-[14px] flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" /> {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900">User Management</h1>
        <p className="text-[13px] text-slate-500 font-medium mt-0.5">
          {total.toLocaleString()} {tab}s found
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
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-bold transition-all ${
                tab === value
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
            <button onClick={() => setSearch('')}>
              <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
            </button>
          )}
        </div>
      </div>

      {/* Table */}
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
                  {['User', 'Contact', 'Location', 'Joined', 'Status', 'Action'].map(h => (
                    <th key={h} className="px-4 py-3 font-bold text-slate-500 uppercase tracking-wider text-[11px] first:pl-6">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((user, i) => (
                  <tr
                    key={user.id}
                    className={`border-b border-slate-50 hover:bg-indigo-50/30 transition-colors ${i % 2 !== 0 ? 'bg-slate-50/40' : ''}`}
                  >
                    {/* User */}
                    <td className="pl-6 pr-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-blue-600 flex items-center justify-center text-white text-[13px] font-black shrink-0 overflow-hidden">
                          {user.profile_image
                            ? <img src={`${API}/${user.profile_image}`} alt={user.fullName} className="w-full h-full object-cover" />
                            : (user.fullName || 'U').charAt(0).toUpperCase()
                          }
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 leading-tight">{user.fullName || '—'}</div>
                          <div className="text-slate-500 text-[12px] font-medium">#{user.id}</div>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1 text-slate-600 font-medium text-[12px]">
                        <Mail className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                        <span className="truncate max-w-[160px]">{user.email}</span>
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-1 text-slate-500 font-medium text-[12px] mt-0.5">
                          <Phone className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                          {user.phone}
                        </div>
                      )}
                    </td>

                    {/* Location */}
                    <td className="px-4 py-4">
                      {user.location ? (
                        <span className="flex items-center gap-1 text-slate-600 font-medium text-[12px]">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {user.location}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    {/* Joined */}
                    <td className="px-4 py-4">
                      <span className="flex items-center gap-1 text-slate-500 font-medium text-[12px]">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {formatDate(user.created_at)}
                      </span>
                    </td>

                    {/* Status badge */}
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                        user.is_active !== false
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-slate-50 text-slate-500 border-slate-200'
                      }`}>
                        {user.is_active !== false
                          ? <><CheckCircle2 className="w-3 h-3" /> Active</>
                          : <><Ban className="w-3 h-3" /> Inactive</>
                        }
                      </span>
                    </td>

                    {/* Toggle action */}
                    <td className="px-4 py-4">
                      <button
                        onClick={() => toggleStatus(user.id)}
                        disabled={!!toggling[user.id]}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold border transition-all disabled:opacity-50 ${
                          user.is_active !== false
                            ? 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200'
                            : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200'
                        }`}
                      >
                        {toggling[user.id]
                          ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          : user.is_active !== false ? <Ban className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />
                        }
                        {toggling[user.id] ? '…' : user.is_active !== false ? 'Deactivate' : 'Activate'}
                      </button>
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
                className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition-all"
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
