import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.rgjobs.in';
  const backendURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/jobs`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/companies`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/pro`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/refund-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    // Category pages
    { url: `${baseUrl}/jobsbyrole/software-developer-engineer-role`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/jobsbyrole/data-scientist-role`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/jobsbytype/Internship-jobs`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/jobsbytype/Freshers-jobs`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
    { url: `${baseUrl}/jobs/Remote-Jobs`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.7 },
  ];

  // Dynamic job pages — fetch all job IDs from backend
  let jobPages: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${backendURL}/api/getAllJobs`, {
      next: { revalidate: 3600 }, // Regenerate sitemap every hour
    });
    if (res.ok) {
      const data = await res.json();
      const jobs = data.JobsData || (Array.isArray(data) ? data : []);

      jobPages = jobs.map((job: any) => {
        const slug = job.title
          ? job.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
          : String(job.id);
        return {
          url: `${baseUrl}/job/${job.id}/${slug}`,
          lastModified: job.created_at ? new Date(job.created_at) : new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.6,
        };
      });
    }
  } catch (error) {
    // If backend is unreachable, return only static pages
    console.error('Sitemap: Failed to fetch jobs from backend', error);
  }

  return [...staticPages, ...jobPages];
}
