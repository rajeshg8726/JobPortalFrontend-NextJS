import React from 'react';
import JobsBrowser from '../../components/JobsBrowser';


export async function generateMetadata({ params }: { params: Promise<{ type: string }> }) {
  const resolvedParams = await params;
  let decodedType = decodeURIComponent(resolvedParams.type).replace(/-/g, ' ');
  decodedType = decodedType.replace(/\bjobs\b/ig, '').trim();
  const capitalized = decodedType.replace(/\b\w/g, l => l.toUpperCase());
  return {
    title: `${capitalized} Jobs | RGJobs`,
    description: `Find top ${capitalized} opportunities curated for you.`
  };
}

export default async function JobsByTypePage(props: { params: Promise<{ type: string }> }) {
  const params = await props.params;
  const decodedType = decodeURIComponent(params.type).replace(/-/g, ' ');

  // E.g. "Internship-jobs" -> "Internship", "Freshers-jobs" -> "Freshers"
  let cleanType = decodedType.replace(/\bjobs\b/ig, '').trim();
  cleanType = cleanType.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  // We are routing 'type' dynamically to JobType if it sounds like an employment type, 
  // or to Experience if it sounds like "Freshers"
  let initialJobType: string[] = [];
  let initialExperience: string[] = [];

  if (['fresher', 'freshers', 'entry level'].includes(cleanType.toLowerCase())) {
     initialExperience.push('Fresher');
  } else {
     initialJobType.push(cleanType);
  }

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      
      <main className="flex-1">
        <JobsBrowser 
          initialJobType={initialJobType}
          initialExperience={initialExperience}
          pageTitle={`${cleanType} Opportunities`}
          pageDescription={`Explore high-paying and exclusive ${cleanType} positions.`}
        />
      </main>
      
    </div>
  );
}
