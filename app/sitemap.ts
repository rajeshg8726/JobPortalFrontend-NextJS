import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.rgjobs.in';
  const backendURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // Core Platform Pages (Highest Priority)
  const corePages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/resume-health`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 }, // Flagship SaaS feature
    { url: `${baseUrl}/jobs`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 }, // Main jobs hub
    { url: `${baseUrl}/companies`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/pro`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/post-jobs`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 }, // Important for B2B acquisition
  ];

  // Secondary Pages
  const secondaryPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/refund-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];

  // High-Value SEO Category Pages (Expanded for better long-tail ranking)
  const popularRoles = [
    'software-developer-engineer', 'data-scientist', 'product-manager',
    'ui-ux-designer', 'full-stack-developer', 'backend-developer',
    'frontend-developer', 'devops-engineer', 'machine-learning-engineer'
  ];
  const popularTypes = ['Internship', 'Freshers', 'Remote', 'Full-time'];

  const categoryPages: MetadataRoute.Sitemap = [
    ...popularRoles.map(role => ({
      url: `${baseUrl}/jobsbyrole/${role}-role`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    })),
    ...popularTypes.map(type => ({
      url: `${baseUrl}/jobsbytype/${type}-jobs`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    }))
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
        
        // Prioritize fresh jobs by analyzing created_at vs updated_at
        const modifiedDate = job.updated_at ? new Date(job.updated_at) : (job.created_at ? new Date(job.created_at) : new Date());
        const isRecent = (new Date().getTime() - modifiedDate.getTime()) < (7 * 24 * 60 * 60 * 1000); // 7 days

        return {
          url: `${baseUrl}/job/${job.id}/${slug}`,
          lastModified: modifiedDate,
          changeFrequency: 'weekly' as const,
          priority: isRecent ? 0.8 : 0.5, // Give higher priority to newer jobs
        };
      });
    }
  } catch (error) {
    console.error('Sitemap: Failed to fetch dynamic jobs from backend', error);
  }

  return [...corePages, ...categoryPages, ...secondaryPages, ...jobPages];
}
