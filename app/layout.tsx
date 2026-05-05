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
  title: "RGJobs - Find Your Dream Job",
  description: "Find your dream job",
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
      <body className="min-h-full flex flex-col font-sora bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <PublicShell>
          {children}
        </PublicShell>
        <Analytics />
      </body>
    </html>
  );
}
