
import axios from "axios";
import { Metadata } from "next";
import JobDetailClient from "./JobDetailClient";

// 1. Generate SEO Metadata precisely matching the original react-helmet-async setup
export async function generateMetadata({ params }: any): Promise<Metadata> {
  const resolvedParams = await params;
  const backendURL = process.env.NEXT_PUBLIC_API_URL;
  try {
    const res = await axios.get(`${backendURL}/api/job/${resolvedParams.id}`);
    const job = res.data.job || res.data;
    
    return {
      title: `${job.role} at ${job.title} - Apply Now | RGJobs`,
      description: `Apply for ${job.role} at ${job.title}. Location: ${job.location || 'India'}. Salary: ${job.pay || 'Competitive'}. Batches: ${job.batches || 'All'}. Find the best career opportunities on RGJobs.`,
      alternates: {
        canonical: `https://www.rgjobs.in/job/${resolvedParams.id}/${resolvedParams.slug}`,
      },
      openGraph: {
        title: `${job.role} at ${job.title} | RGJobs`,
        description: `${job.role} at ${job.title}. ${job.location || 'India'}. ${job.pay || 'Competitive salary'}.`,
        url: `https://www.rgjobs.in/job/${resolvedParams.id}/${resolvedParams.slug}`,
        type: "article",
        images: [`${backendURL}/${job.image}`],
      }
    };
  } catch (err) {
    return {
      title: 'Job Not Found | RGJobs',
      description: 'The requested job could not be found.'
    };
  }
}

// 2. Server Component Wrapper to output JSON-LD Schema and render Client UI
export default async function JobPage({ params }: any) {
  const resolvedParams = await params;
  const backendURL = process.env.NEXT_PUBLIC_API_URL;
  let jobData = null;

  try {
    const res = await axios.get(`${backendURL}/api/job/${resolvedParams.id}`);
    jobData = res.data.job || res.data;
  } catch (err) {
    console.error("Error fetching job on server", err);
  }

  return (
    <>
      {jobData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "JobPosting",
              "title": jobData.role,
              "description": jobData.description || `${jobData.role} position at ${jobData.title}`,
              "datePosted": jobData.created_at,
              "hiringOrganization": {
                "@type": "Organization",
                "name": jobData.title,
                "logo": `${backendURL}/${jobData.image}`
              },
              "jobLocation": {
                "@type": "Place",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": jobData.location || "India",
                  "addressCountry": "IN"
                }
              },
              "employmentType": jobData.jobtype === '1' ? "INTERN" : "FULL_TIME",
              "url": `https://www.rgjobs.in/job/${resolvedParams.id}/${resolvedParams.slug}`
            }),
          }}
        />
      )}
      
      {/* Pass initial data into Client Component if fetched, else standard Client Loading */}
      <JobDetailClient id={resolvedParams.id} slug={resolvedParams.slug} initialJob={jobData} />
    </>
  );
}
