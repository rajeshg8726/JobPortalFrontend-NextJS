"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LayoutDashboard, Bookmark, User, LogOut, ChevronRight, MapPin } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Overview', href: '/candidate-dashboard', exact: true, icon: LayoutDashboard },
  { label: 'Saved Jobs', href: '/candidate-dashboard/saved-jobs', exact: false, icon: Bookmark },
  { label: 'Profile Settings', href: '/candidate-dashboard/settings', exact: false, icon: User },
];

function calcCompletion(profile: any): number {
  if (!profile) return 0;
  const checks = [
    !!(profile.name || profile.fullName),
    !!profile.email,
    !!profile.phone,
    !!profile.location,
    !!profile.bio,
    !!(Array.isArray(profile.skills) ? profile.skills.length > 0 : !!profile.skills),
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

export default function CandidateDashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [profile, setProfile] = useState<any>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');

    if (!token || userType !== 'Candidate') {
      router.replace('/login');
      return;
    }

    // Instant render from cache so sidebar shows immediately
    const cached = localStorage.getItem('candidate');
    if (cached) {
      setProfile(JSON.parse(cached));
      setReady(true);
    }

    // Refresh profile from API in background
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/candidate/profile`, {
      headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
    })
      .then(r => {
        if (r.status === 401) { router.replace('/login'); return null; }
        return r.json();
      })
      .then(data => {
        if (data?.success && data.user) {
          setProfile(data.user);
          localStorage.setItem('candidate', JSON.stringify(data.user));
        }
      })
      .catch(() => { /* silently use cached */ })
      .finally(() => setReady(true));
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const completion = calcCompletion(profile);

  if (!ready) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-[3px] border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-10 font-sora">
      <div className="flex flex-col lg:flex-row gap-8 items-start">

        {/* ── Sidebar ── */}
        <aside className="w-full lg:w-[272px] shrink-0 lg:sticky lg:top-24">
          <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">

            {/* Profile card */}
            <div className="p-6 border-b border-slate-100">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center border-4 border-white shadow-lg overflow-hidden mb-3">
                  {profile?.profile_image ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL}/${profile.profile_image}`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-black text-white select-none">
                      {(profile?.name || profile?.fullName || 'U').charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                <h2 className="text-[17px] font-black text-slate-900 leading-tight">
                  {profile?.name || profile?.fullName || 'Candidate'}
                </h2>
                <p className="text-[12px] text-slate-500 font-medium mt-0.5">{profile?.email}</p>
                {profile?.location && (
                  <p className="flex items-center gap-1 text-[11px] text-slate-400 font-medium mt-1">
                    <MapPin className="w-3 h-3" /> {profile.location}
                  </p>
                )}
              </div>

              {/* Profile completion bar */}
              <div className="mt-4">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                    Profile Strength
                  </span>
                  <span className={`text-[12px] font-black ${
                    completion >= 80 ? 'text-emerald-600' : completion >= 50 ? 'text-amber-500' : 'text-rose-500'
                  }`}>
                    {completion}%
                  </span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${completion}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    className={`h-full rounded-full ${
                      completion >= 80 ? 'bg-emerald-500' : completion >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                  />
                </div>
                {completion < 100 && (
                  <Link
                    href="/candidate-dashboard/settings"
                    className="text-[11px] text-blue-600 font-bold mt-1.5 block hover:underline"
                  >
                    Complete your profile →
                  </Link>
                )}
              </div>
            </div>

            {/* Navigation */}
            <nav className="p-3 flex flex-col gap-1">
              {NAV_ITEMS.map(({ label, href, exact, icon: Icon }) => {
                const isActive = exact ? pathname === href : pathname?.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-[14px] transition-all duration-200 ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'opacity-90' : 'opacity-60'}`} />
                    <span className="flex-1">{label}</span>
                    {isActive && <ChevronRight className="w-4 h-4 opacity-40" />}
                  </Link>
                );
              })}

              <div className="h-px bg-slate-100 mx-1 my-1" />

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-[14px] text-red-500 hover:bg-red-50 transition-all w-full text-left"
              >
                <LogOut className="w-5 h-5 opacity-70" />
                Log out
              </button>
            </nav>
          </div>
        </aside>

        {/* ── Main content ── */}
        <section className="flex-1 min-w-0">
          {children}
        </section>

      </div>
    </div>
  );
}
