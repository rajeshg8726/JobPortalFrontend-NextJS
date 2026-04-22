import React from 'react';
import JobsBrowser from '../../components/JobsBrowser';


export async function generateMetadata({ params }: { params: Promise<{ role: string }> }) {
  const resolvedParams = await params;
  const decodedRole = decodeURIComponent(resolvedParams.role).replace(/-/g, ' ');
  const capitalized = decodedRole.replace(/\b\w/g, l => l.toUpperCase());
  return {
    title: `${capitalized} Jobs | RGJobs`,
    description: `Browse all curated opportunities for ${capitalized} professionals.`
  };
}

export default async function JobsByRolePage(props: { params: Promise<{ role: string }> }) {
  const params = await props.params;
  const decodedRole = decodeURIComponent(params.role).replace(/-/g, ' ');

  // Clean up role string, e.g. "software-developer-engineer-role" -> "Software Developer Engineer"
  let displayRole = decodedRole.replace(/\brole\b/ig, '').trim();
  displayRole = displayRole.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      
      <main className="flex-1">
        <JobsBrowser 
          initialRoles={[displayRole]}
          pageTitle={`${displayRole} Jobs`}
          pageDescription={`Discover top remote and on-site opportunities perfectly tailored for ${displayRole}s.`}
        />
      </main>
      
    </div>
  );
}
