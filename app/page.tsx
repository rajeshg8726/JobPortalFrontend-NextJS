import HomeClient from "./components/HomeClient";

async function fetchInitialJobs() {
  const backendURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  try {
    let res = await fetch(`${backendURL}/api/getAllJobs`, {
      next: { revalidate: 86400 },
    });
    if (!res.ok) {
      // Fallback endpoint if the primary one isn't available
      res = await fetch(`${backendURL}/api/jobs-search`, {
        next: { revalidate: 86400 },
      });
    }
    const data = await res.json();
    if (data.JobsData) {
      return Array.isArray(data.JobsData) ? data.JobsData : [];
    }
    return Array.isArray(data) ? data : [];
  } catch {
    // If backend is completely unreachable, return empty — Jobcard handles empty state gracefully
    return [];
  }
}

export default async function Home() {
  const initialJobs = await fetchInitialJobs();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <HomeClient initialJobs={initialJobs} />
    </div>
  );
}
