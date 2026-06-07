import React from 'react';
import JobsBrowser from '../components/JobsBrowser';


export const metadata = {
  title: 'All IT Jobs | RGJobs',
  description: 'Browse the latest software, management, and tech jobs curated for developers, freshers, and professionals.',
};

export default async function JobsPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;
  const initialSearch = typeof searchParams.search === 'string' ? searchParams.search : undefined;

  let initialJobs = [];
  let initialTotal = 0;
  let initialTotalPages = 1;

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const res = await fetch(`${apiUrl}/api/jobs/filter?page=1`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        search: initialSearch || "",
        locations: [],
        roles: [],
        batches: [],
        experience: [],
        jobType: []
      }),
      cache: 'no-store'
    });

    const data = await res.json();
    if (data.success) {
      initialJobs = data.jobs || [];
      initialTotal = data.total || 0;
      initialTotalPages = data.totalPages || 1;
    }
  } catch (err) {
    console.error("Failed to fetch initial jobs on server:", err);
  }

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      
      <main className="flex-1">
        <JobsBrowser 
          initialSearch={initialSearch} 
          initialJobs={initialJobs}
          initialTotal={initialTotal}
          initialTotalPages={initialTotalPages}
        />
      </main>
        
    </div>
  );
}
