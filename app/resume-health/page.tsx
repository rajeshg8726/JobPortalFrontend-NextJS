import { Metadata } from "next";
import ResumeHealthClient from "./ResumeHealthClient";

export const metadata: Metadata = {
  title: "Free Resume Health Score — ATS Readiness Check | RGJobs",
  description:
    "Is your resume getting auto-rejected by ATS software? Get a free AI-powered ATS readiness score across 6 dimensions. Find out exactly what to fix — no job description needed.",
  alternates: {
    canonical: "https://www.rgjobs.in/resume-health",
  },
  openGraph: {
    title: "Free Resume Health Score — ATS Readiness Check | RGJobs",
    description:
      "75% of resumes are auto-rejected before a human sees them. Check your resume's ATS health score for free.",
    url: "https://www.rgjobs.in/resume-health",
    type: "website",
    images: [
      {
        url: "https://www.rgjobs.in/og-image.png",
        width: 1200,
        height: 630,
        alt: "RGJobs Resume Health Score",
      },
    ],
  },
};

export default function ResumeHealthPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <ResumeHealthClient />
    </main>
  );
}
