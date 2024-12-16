"use client"

import React from 'react';
import { useOnPageTask } from "@/hooks/data-for-seo-api/useOnPageTask";
import Loader from "../Loader/Loader";
import DomainKeywordSelector from '@/components/DomainKeywordSelector/DomainKeywordSelector';
import OnPageTaskResult from './OnPageTaskResult';

export default function OnPageTaskDisplay() {
  const { runTask, loading, error, data } = useOnPageTask();

  const handleSubmit = (domain: string, keyword: string, tsakId: string) => {
    runTask(tsakId); // Assuming runTask now accepts a keyword parameter
  };

  return (
    <div className="flex flex-col">
      <DomainKeywordSelector onSubmit={handleSubmit} buttonText="Go" />
      {loading && <Loader />}
      {error && <p className="text-red-500">Error: {error}</p>}
      {data && <OnPageTaskResult data={data} />}
    </div>
  );
}