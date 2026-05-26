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
  title: "RGJobs — AI-Powered Job Portal for Indian Tech Talent",
  description:
    "Discover 1000+ curated tech jobs from top Indian companies. Free ATS keyword analysis, AI cover letter generator, STAR interview prep, and INR salary benchmarks. Apply directly on employer sites — zero middlemen, 100% transparent.",
  keywords: [
    "jobs",
    "job portal",
    "tech jobs India",
    "ATS resume checker",
    "AI job matching",
    "cover letter generator",
    "freshers jobs",
    "remote jobs India",
    "internships 2025 2026",
  ],
  verification: {
    google: "cMXxHXt8iDBLnyGweMvFDeotRL46bZ5KIVkFUEA2Mew",
  },
  openGraph: {
    title: "RGJobs — AI-Powered Job Portal for Indian Tech Talent",
    description:
      "Free ATS keyword analysis, AI cover letters, interview prep & salary benchmarks. 1000+ curated tech jobs from top companies.",
    type: "website",
    url: "https://www.rgjobs.in",
    siteName: "RGJobs",
  },
  twitter: {
    card: "summary_large_image",
    title: "RGJobs — AI-Powered Job Portal for Indian Tech Talent",
    description:
      "Free ATS keyword analysis, AI cover letters, and 1000+ curated tech jobs. Apply directly — 100% transparent.",
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
