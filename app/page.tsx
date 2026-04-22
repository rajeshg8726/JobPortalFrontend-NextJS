"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Slider from "./components/Slider";
import Jobcard from "./components/Jobcard";

export default function Home() {
  const [searchedJobs, setSearchedJobs] = useState<any[] | null>(null);
  const [allJobs, setAllJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const backendURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchInitialJobs = async () => {
      try {
        setLoading(true);
        // Fallback to searching without parameters to get all jobs if /api/jobs doesn't work
        const res = await axios.get(`${backendURL}/api/getAllJobs`).catch(() => 
          axios.get(`${backendURL}/api/jobs-search`)
        );
        
        if (res.data.JobsData) {
          setAllJobs(Array.isArray(res.data.JobsData) ? res.data.JobsData : []);
        }
      } catch (err) {
        console.error("Error fetching initial jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialJobs();
  }, [backendURL]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Slider setSearchedJobs={setSearchedJobs} setLoading={setLoading} />
      
      <div className="w-full relative bg-slate-50 dark:bg-slate-950">
        <Jobcard 
          allJobs={allJobs} 
          searchedJobs={searchedJobs} 
          loading={loading} 
        />
      </div>
    </div>
  );
}

