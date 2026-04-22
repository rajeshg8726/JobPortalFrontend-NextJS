"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import ReactPaginate from "react-paginate";
import { motion } from "framer-motion";
import { Building2, Search, ExternalLink, ChevronLeft, ChevronRight, Briefcase } from "lucide-react";

export default function CompaniesBrowser() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const PER_PAGE = 12;

  useEffect(() => {
    const fetchAndGroupCompanies = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getAllJobs`);
        let data = await response.json();
        
        // If data is wrapped in a success obj, extract array, else assume array
        const jobs = Array.isArray(data) ? data : (data.JobsData || []);

        // Helper: extract & clean company name from an image filename
        const extractCompanyName = (imagePath: string, fallback: string): string => {
          let name = imagePath.split('/').pop() || "";
          // Strip file extension
          name = name.replace(/\.(png|jpg|jpeg|webp|gif|svg)$/i, '');
          // Strip timestamp prefix: leading digits (and optional separator _ or -)
          name = name.replace(/^\d+[-_]?/g, '');
          // Strip trailing "-logo" or "_logo"
          name = name.replace(/[-_]?logo$/i, '');
          // Replace separators with spaces
          name = name.replace(/[-_]/g, ' ').trim();
          // Capitalize each word
          name = name.split(' ').filter(Boolean).map((word: string) =>
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ');
          // Fall back to job.title if extraction yields nothing useful
          return name || fallback;
        };

        const companyMap = new Map<string, { name: string; logo: string; activeJobs: number }>();

        jobs.forEach((job: any) => {
          if (!job.image) return; // Skip if no logo

          const normalizedName = extractCompanyName(job.image, job.title || 'Unknown');

          // Group by normalized company name so timestamps don't create duplicates
          if (companyMap.has(normalizedName)) {
            const existing = companyMap.get(normalizedName)!;
            existing.activeJobs += 1;
            // Keep the most recent/first logo we saw
          } else {
            companyMap.set(normalizedName, {
              name: normalizedName,
              logo: job.image,
              activeJobs: 1
            });
          }
        });

        // Convert Map to array and sort by active jobs descending
        const uniqueCompanies = Array.from(companyMap.values()).sort((a, b) => b.activeJobs - a.activeJobs);
        setCompanies(uniqueCompanies);
      } catch (error) {
        console.error("Failed to fetch jobs for companies", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndGroupCompanies();
  }, []);

  // Filter based on search term
  const filteredCompanies = useMemo(() => {
    return companies.filter(company => 
      company.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [companies, searchTerm]);

  // Client-side pagination logic
  const offset = currentPage * PER_PAGE;
  const paginatedCompanies = filteredCompanies.slice(offset, offset + PER_PAGE);
  const pageCount = Math.ceil(filteredCompanies.length / PER_PAGE);

  const handlePageClick = ({ selected }: any) => {
    setCurrentPage(selected);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset page when search term changes
  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm]);

  return (
    <div className="w-full min-h-screen bg-slate-50/50 font-sora py-12">
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* Header Section */}
        <div className="mb-12 text-center flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 font-playfair tracking-tight leading-tight">
            Explore Top Companies
          </h1>
          <p className="text-[16px] md:text-[18px] text-slate-500 font-medium max-w-2xl mb-8">
            Discover {companies.length > 0 ? companies.length : 'hundreds of'} leading companies actively hiring on our platform. Find your perfect cultural fit and dream role.
          </p>

          <div className="flex items-center px-4 py-3 bg-white border border-slate-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)] rounded-full w-full max-w-[500px]">
             <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
             <input 
               type="text" 
               placeholder="Search company by name (e.g. Google, Amazon)..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full bg-transparent border-none outline-none text-[15px] font-medium text-slate-800 placeholder-slate-400"
             />
          </div>
        </div>

        {/* Content Area */}
        <div className="w-full">
          {loading ? (
            // Loading Skeletons
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1,2,3,4,5,6,7,8].map(i => (
                  <div key={i} className="bg-white border border-slate-100 rounded-[2rem] p-6 h-[220px] animate-pulse flex flex-col items-center justify-center">
                    <div className="w-20 h-20 bg-slate-100 rounded-2xl mb-4"></div>
                    <div className="h-5 bg-slate-100 rounded-md w-1/2 mb-3"></div>
                    <div className="h-4 bg-slate-50 rounded-md w-1/4"></div>
                  </div>
                ))}
            </div>
          ) : filteredCompanies.length === 0 ? (
            // Empty State
            <div className="w-full py-24 flex flex-col items-center justify-center text-center bg-white border border-slate-200 border-dashed rounded-[2rem]">
              <div className="w-20 h-20 bg-blue-50/50 rounded-3xl flex items-center justify-center text-blue-400 mb-6 border border-blue-100/50">
                <Building2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2 font-playfair">No companies found</h3>
              <p className="text-slate-500 font-medium">We couldn't find any companies matching your search.</p>
              {searchTerm && (
                <button onClick={() => setSearchTerm("")} className="mt-6 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition-colors shadow-lg">
                  Clear Search
                </button>
              )}
            </div>
          ) : (
             <>
              {/* Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {paginatedCompanies.map((company, i) => (
                    <motion.div 
                      key={company.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                      className="group relative bg-white border border-slate-200 hover:border-blue-300 rounded-[2rem] p-8 flex flex-col items-center justify-center transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(37,99,235,0.06)]"
                    >
                        {/* Company Logo */}
                        <div className="w-24 h-24 rounded-[1.5rem] bg-white border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-3 flex items-center justify-center overflow-hidden mb-5 group-hover:scale-105 transition-transform duration-300">
                           <img
                             src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/${company.logo}`}
                             alt={`${company.name} logo`}
                             loading="lazy"
                             className="w-full h-full object-contain"
                             onError={(e: any) => { e.target.src = '/logo.webp'; }}
                           />
                        </div>

                        {/* Title & Badge */}
                        <h3 className="text-xl font-bold text-slate-900 mb-2 text-center group-hover:text-blue-600 transition-colors line-clamp-1 w-full px-2" title={company.name}>
                          {company.name}
                        </h3>
                        
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[12px] font-bold tracking-wide uppercase border border-blue-100 mb-6">
                           <Briefcase className="w-3.5 h-3.5" /> 
                           {company.activeJobs} {company.activeJobs === 1 ? 'Active Job' : 'Active Jobs'}
                        </div>

                        <Link
                          href={`/jobs?search=${encodeURIComponent(company.name)}`}
                          className="w-full h-11 flex items-center justify-center gap-2 bg-slate-50 group-hover:bg-blue-600 text-slate-600 group-hover:text-white rounded-xl text-[14px] font-bold transition-all border border-slate-200 group-hover:border-transparent group-hover:shadow-[0_8px_20px_rgba(37,99,235,0.3)]"
                        >
                          View Openings <ExternalLink className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                        </Link>
                    </motion.div>
                  ))}
              </div>

              {/* Pagination */}
              {pageCount > 1 && (
                <div className="mt-16 flex justify-center">
                  <ReactPaginate
                    pageCount={pageCount}
                    onPageChange={handlePageClick}
                    forcePage={currentPage}
                    marginPagesDisplayed={1}
                    pageRangeDisplayed={3}
                    previousLabel={
                      <div className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-600 transition-all hover:border-blue-300 shadow-sm">
                        <ChevronLeft className="w-5 h-5" />
                      </div>
                    }
                    nextLabel={
                      <div className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-600 transition-all hover:border-blue-300 shadow-sm">
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    }
                    containerClassName="flex items-center gap-2"
                    pageClassName="flex"
                    pageLinkClassName="w-10 h-10 flex items-center justify-center rounded-2xl text-[14px] font-bold text-slate-500 border border-transparent hover:bg-slate-100 transition-all"
                    activeClassName=""
                    activeLinkClassName="!bg-slate-900 !text-white !border-slate-900 shadow-lg"
                    disabledClassName="opacity-30 pointer-events-none"
                    breakLabel={<span className="text-slate-400 font-bold px-1">...</span>}
                    breakClassName="flex items-center"
                  />
                </div>
              )}
             </>
          )}
        </div>
      </div>
    </div>
  );
}
