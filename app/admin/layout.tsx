"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Briefcase, Users2, LogOut,
  Menu, X, Shield, ChevronRight, MessageSquare,
} from 'lucide-react';

const NAV = [
  { label: 'Overview',        href: '/admin',       exact: true,  icon: LayoutDashboard },
  { label: 'Job Management',  href: '/admin/jobs',  exact: false, icon: Briefcase },
  { label: 'User Management', href: '/admin/users', exact: false, icon: Users2 },
  { label: 'Communications',  href: '/admin/communications', exact: false, icon: MessageSquare },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter();
  const pathname = usePathname();

  const [adminProfile, setAdminProfile] = useState<any>(null);
  const [ready,        setReady]        = useState(false);
  const [sideOpen,     setSideOpen]     = useState(false);

  const isLogin = pathname === '/admin/login';

  useEffect(() => {
    if (isLogin) { setReady(true); return; }

    const token = localStorage.getItem('adminToken');
    if (!token) { router.replace('/admin/login'); return; }

    const p = localStorage.getItem('adminProfile');
    if (p) setAdminProfile(JSON.parse(p));
    setReady(true);
  }, [isLogin, router]);

  const handleLogout = async () => {
    const token = localStorage.getItem('adminToken');
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/logout`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
      });
    } catch {}
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminProfile');
    router.replace('/admin/login');
  };

  if (!ready) {
    return (
      <div className="min-h-screen bg-[#0c1427] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  // Login page: no shell
  if (isLogin) return <>{children}</>;

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname?.startsWith(href);

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sora">

      {/* ─── Mobile overlay ─── */}
      {sideOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setSideOpen(false)}
        />
      )}

      {/* ─── Sidebar ─── */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-60 bg-[#0c1427] flex flex-col
        transition-transform duration-300 ease-in-out
        ${sideOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>

        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-5 border-b border-white/5 shrink-0">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-white font-black text-[15px]">RGJobs</span>
            <span className="block text-indigo-400 text-[10px] font-bold uppercase tracking-wider leading-none mt-0.5">Admin Panel</span>
          </div>
          <button
            onClick={() => setSideOpen(false)}
            className="ml-auto lg:hidden text-slate-500 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 flex flex-col gap-1 overflow-y-auto">
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-3 mb-2">
            Main Menu
          </p>
          {NAV.map(({ label, href, exact, icon: Icon }) => {
            const active = isActive(href, exact);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSideOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-bold transition-all ${
                  active
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4.5 h-4.5 ${active ? 'opacity-90' : 'opacity-60'}`} />
                <span className="flex-1">{label}</span>
                {active && <ChevronRight className="w-3.5 h-3.5 opacity-50" />}
              </Link>
            );
          })}
        </nav>

        {/* Admin profile + logout */}
        <div className="p-3 border-t border-white/5 shrink-0">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-[13px] font-black shrink-0">
              {(adminProfile?.name || 'A').charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-white text-[13px] font-bold truncate">{adminProfile?.name || 'Admin'}</p>
              <p className="text-slate-500 text-[11px] truncate">{adminProfile?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-bold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
          >
            <LogOut className="w-4 h-4 opacity-70" />
            Logout
          </button>
        </div>
      </aside>

      {/* ─── Right column: topbar + content ─── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center gap-4 px-6 shrink-0">
          <button
            onClick={() => setSideOpen(true)}
            className="lg:hidden w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-[13px] font-bold text-slate-400">
            <span>Admin</span>
            {pathname !== '/admin' && (
              <>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-slate-900 capitalize">
                  {pathname.split('/').filter(Boolean).slice(1).join(' / ')}
                </span>
              </>
            )}
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-[13px] font-bold text-slate-600">
              <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-[11px] font-black">
                {(adminProfile?.name || 'A').charAt(0).toUpperCase()}
              </div>
              {adminProfile?.name}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-100">
          {children}
        </main>
      </div>
    </div>
  );
}
