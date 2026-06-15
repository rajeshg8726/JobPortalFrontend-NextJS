import React from 'react';
import CompaniesBrowser from '../components/CompaniesBrowser';


export const metadata = {
  title: 'Top Companies | RGJobs',
  description: 'Analyze employer tech stacks, company cultures, and career trajectories with our enterprise intelligence database.',
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
