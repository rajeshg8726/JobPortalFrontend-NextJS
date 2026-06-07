import type { Metadata } from "next";
import { Geist, Geist_Mono, Sora, Playfair_Display } from "next/font/google";
import "./globals.css";
import PublicShell from "./components/PublicShell";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RGJobs — AI Career Intelligence Platform | Resume Audit, ATS Optimizer & Application Tracker",
  description:
    "Career Intelligence Platform for ambitious tech professionals. Free 6-dimension ATS resume audit, AI skill-gap analysis, personalized interview coaching, application pipeline tracker, and salary benchmarks. Opportunities sourced directly from 890+ corporate career pages — zero middlemen, 100% transparent.",
  keywords: [
    "career intelligence platform",
    "ATS resume checker",
    "AI career tools",
    "resume audit",
    "application tracker",
    "career management",
    "skill gap analysis",
    "interview prep",
    "tech careers India",
    "remote jobs India",
  ],
  verification: {
    google: "cMXxHXt8iDBLnyGweMvFDeotRL46bZ5KIVkFUEA2Mew",
  },
  openGraph: {
    title: "RGJobs — AI Career Intelligence Platform",
    description:
      "Free ATS resume audit, AI skill-gap analysis, interview coaching & application tracker. Opportunities sourced from 890+ companies — apply directly.",
    type: "website",
    url: "https://www.rgjobs.in",
    siteName: "RGJobs",
    images: [
      {
        url: "https://www.rgjobs.in/og-image.png",
        width: 1200,
        height: 630,
        alt: "RGJobs — AI Career Intelligence Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RGJobs — AI Career Intelligence Platform",
    description:
      "Free ATS resume audit, AI skill-gap analysis, and career tools. Opportunities from 890+ companies — apply directly, 100% transparent.",
    images: ["https://www.rgjobs.in/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${sora.variable} ${playfair.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col font-sora bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <PublicShell>
          {children}
        </PublicShell>
        <Analytics />
      </body>
    </html>
  );
}
