"use client"

import React, { useEffect, useRef, useState } from 'react';
import { useContentCreation } from "@/hooks/openai/useContentCreation";
import Loader from "../Loader/Loader";
import DomainKeywordSelector from '@/components/DomainKeywordSelector/DomainKeywordSelector';

export default function ContentCreation() {
  const { aiGenerateText, loading, error, data } = useContentCreation();
  const [streamedContent, setStreamedContent] = useState('');
  const contentRef = useRef<HTMLDivElement | null>(null);

  const handleSubmit = (domain: string, keyword: string) => {
    aiGenerateText(keyword);
  };

  // useEffect(() => {
  //   if (data) {
  //     let index = 0;
  //     const intervalId = setInterval(() => {
  //       setStreamedContent((prev) => prev + data[index]);
  //       index++;
  //       if (index === data.length) {
  //         clearInterval(intervalId);
  //       }
  //     }, 20); // Adjust the interval for faster or slower streaming

  //     return () => clearInterval(intervalId);
  //   }
  // }, [data]);

  // useEffect(() => {
  //   if (contentRef.current) {
  //     contentRef.current.scrollTop = contentRef.current.scrollHeight;
  //   }
  // }, [streamedContent]);

  return (
    <div className="flex flex-col max-w-4xl mx-auto p-6">
      <DomainKeywordSelector onSubmit={handleSubmit} buttonText="Go" />

      {loading && <Loader />}
      {error && <p className="text-red-500">Error: {error}</p>}

      {data && (
        <div ref={contentRef} className="mt-4 overflow-y-auto max-h-[600px]">
          <div dangerouslySetInnerHTML={{ __html: data }} />
        </div>
      )}
    </div>
  );
}

