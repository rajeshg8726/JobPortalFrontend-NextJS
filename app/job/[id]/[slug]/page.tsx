
import axios from "axios";
import { Metadata } from "next";
import JobDetailClient from "./JobDetailClient";

export const dynamic = 'force-dynamic';

// 1. Generate SEO Metadata precisely matching the original react-helmet-async setup
export async function generateMetadata({ params }: any): Promise<Metadata> {
  const resolvedParams = await params;
  const backendURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  try {
    const res = await fetch(`${backendURL}/api/job/${resolvedParams.id}`, {
      next: { revalidate: 86400 }
    });
    if (!res.ok) throw new Error('Failed to fetch job');
    const data = await res.json();
    const job = data.job || data;
    
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
  const backendURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  let jobData = null;

  try {
    const res = await fetch(`${backendURL}/api/job/${resolvedParams.id}`, {
      next: { revalidate: 86400 }
    });
    if (!res.ok) throw new Error('Failed to fetch job');
    const data = await res.json();
    jobData = data.job || data;
  } catch (err) {
    console.error("Error fetching job on server", err);
  }

  // Optimize schema dynamic variables
  let jobPostingSchema = null;
  if (jobData) {
    const isRemote = jobData.location?.toLowerCase().includes("remote");

    // Google Jobs strictly requires rich text description formats (HTML <p>, <ul>, <li>)
    const formatHtmlDescription = (desc: string, req: string, resp: string) => {
      let html = "";
      if (desc) {
        html += `<h3>Job Description</h3><p>${desc.replace(/\n+/g, "</p><p>")}</p>`;
      }
      if (req) {
        html += `<h3>Requirements</h3><ul><li>${req.replace(/\n+/g, "</li><li>")}</li></ul>`;
      }
      if (resp) {
        html += `<h3>Responsibilities</h3><ul><li>${resp.replace(/\n+/g, "</li><li>")}</li></ul>`;
      }
      return html || `${jobData.role} position at ${jobData.title}`;
    };

    const richDescription = formatHtmlDescription(
      jobData.description || "",
      jobData.requirements || "",
      jobData.rolesAndResponsibilities || ""
    );

    // Calculate expiry validThrough date (Google standard: 90 days after creation)
    const postedDate = jobData.created_at ? new Date(jobData.created_at) : new Date();
    const expiryDate = new Date(postedDate);
    expiryDate.setDate(expiryDate.getDate() + 90);
    const validThroughStr = expiryDate.toISOString().split("T")[0];

    const baseSchema: any = {
      "@context": "https://schema.org",
      "@type": "JobPosting",
      "title": jobData.role,
      "description": richDescription,
      "datePosted": jobData.created_at ? jobData.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
      "validThrough": validThroughStr,
      "directApply": true, // Displays Direct Apply tag on Google Search Results
      "hiringOrganization": {
        "@type": "Organization",
        "name": jobData.title,
        "logo": `${backendURL}/${jobData.image}`
      },
      "employmentType": jobData.jobtype === '1' ? "INTERN" : "FULL_TIME",
      "url": `https://www.rgjobs.in/job/${resolvedParams.id}/${resolvedParams.slug}`
    };

    if (isRemote) {
      baseSchema.jobLocationType = "TELECOMMUTE";
      baseSchema.applicantLocationRequirements = {
        "@type": "Country",
        "name": "IN"
      };
    } else {
      baseSchema.jobLocation = {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": jobData.location || "India",
          "addressCountry": "IN"
        }
      };
    }

    jobPostingSchema = JSON.stringify(baseSchema);
  }

  return (
    <>
      {jobPostingSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jobPostingSchema,
          }}
        />
      )}
      
      {/* Pass initial data into Client Component if fetched, else standard Client Loading */}
      <JobDetailClient id={resolvedParams.id} slug={resolvedParams.slug} initialJob={jobData} />
    </>
  );
}
