"use client";

import React, { useState } from "react";
import Slider from "./Slider";
import Jobcard from "./Jobcard";

export default function HomeClient({ initialJobs }: { initialJobs: any[] }) {
  const [searchedJobs, setSearchedJobs] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <>
      <Slider setSearchedJobs={setSearchedJobs} setLoading={setLoading} />
      <div className="w-full relative bg-slate-50 dark:bg-slate-950">
        <Jobcard
          allJobs={initialJobs}
          searchedJobs={searchedJobs}
          loading={loading}
        />
      </div>
    </>
  );
}
