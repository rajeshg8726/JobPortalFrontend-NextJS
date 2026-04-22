import React from 'react';
import JobsBrowser from '../../components/JobsBrowser';


export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = await params;
  const decodedCategory = decodeURIComponent(resolvedParams.category).replace(/-/g, ' ');
  return {
    title: `${decodedCategory} | RGJobs`,
    description: `Browse all curated opportunities for ${decodedCategory}.`
  };
}

export default async function CategoryJobsPage(props: { params: Promise<{ category: string }> }) {
  const params = await props.params;
  const decodedCategory = decodeURIComponent(params.category);
  
  let initialLocations: string[] = [];
  let initialBatches: string[] = [];
  
  // Extremely basic URL parameter mapping heuristic
  // "Bengaluru-Jobs" -> location: "Bengaluru"
  // "2025-batch" -> batch: "2025"
  if (decodedCategory.toLowerCase().includes('job')) {
    // Attempt to extract prefix
    const loc = decodedCategory.replace(/-?job(?:s)?$/i, ''); 
    // capitalize
    const capitalizedLoc = loc.charAt(0).toUpperCase() + loc.slice(1);
    if (capitalizedLoc) initialLocations.push(capitalizedLoc);
  } else if (decodedCategory.toLowerCase().includes('batch')) {
    const batch = decodedCategory.replace(/-?batch(?:-jobs)?$/i, '');
    if (batch) initialBatches.push(batch);
  } else {
    // direct match attempt
    const val = decodedCategory.charAt(0).toUpperCase() + decodedCategory.slice(1);
    initialLocations.push(val);
  }

  const pageTitle = decodedCategory.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      
      <main className="flex-1">
        <JobsBrowser 
          initialLocations={initialLocations}
          initialBatches={initialBatches}
          pageTitle={pageTitle}
          pageDescription={`Discover elite ${pageTitle} perfectly tailored to your skills.`}
        />
      </main>
      
    </div>
  );
}
