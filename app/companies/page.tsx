import React from 'react';
import CompaniesBrowser from '../components/CompaniesBrowser';


export const metadata = {
  title: 'Top Companies | RGJobs',
  description: 'Explore leading tech companies and startups hiring on RGJobs. Discover your next career move by browsing verified employer profiles.',
};

export default function CompaniesPage() {
  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      
      <main className="flex-1">
        <CompaniesBrowser />
      </main>
     
    </div>
  );
}
