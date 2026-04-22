"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

/**
 * PublicShell – wraps Header + Footer conditionally.
 * Admin routes (/admin/*) get neither Header nor Footer,
 * and don't need the mt-[70px] offset for the fixed header.
 */
export default function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <>
      {!isAdmin && <Header />}
      <main className={`flex-1 ${!isAdmin ? 'mt-[70px]' : ''}`}>
        {children}
      </main>
      {!isAdmin && <Footer />}
    </>
  );
}
