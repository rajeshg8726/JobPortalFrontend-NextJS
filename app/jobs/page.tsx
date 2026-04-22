import React from 'react';
import JobsBrowser from '../components/JobsBrowser';


export const metadata = {
  title: 'All IT Jobs | RGJobs',
  description: 'Browse the latest software, management, and tech jobs curated for developers, freshers, and professionals.',
};

export default async function JobsPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;
  const initialSearch = typeof searchParams.search === 'string' ? searchParams.search : undefined;

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      
      <main className="flex-1">
        <JobsBrowser initialSearch={initialSearch} />
      </main>
        
    </div>
  );
}
