"use client"

import React, { useEffect, useRef, useState } from 'react';
import { useContentCreation } from "@/hooks/openai/useContentCreation";
import Loader from "../Loader/Loader";
import DomainKeywordSelector from '@/components/DomainKeywordSelector/DomainKeywordSelector';

export default function ContentCreation() {
  const { generateText, loading, error, data } = useContentCreation();
  const [streamedContent, setStreamedContent] = useState('');
  const contentRef = useRef(null);

  const handleSubmit = (domain: string, keyword: string) => {
    generateText(keyword);
    setStreamedContent('');
  };

  useEffect(() => {
    if (data) {
      let index = 0;
      const intervalId = setInterval(() => {
        setStreamedContent((prev) => prev + data[index]);
        index++;
        if (index === data.length) {
          clearInterval(intervalId);
        }
      }, 20); // Adjust the interval for faster or slower streaming

      return () => clearInterval(intervalId);
    }
  }, [data]);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [streamedContent]);

  return (
    <div className="flex flex-col max-w-full mx-auto p-6">
      <DomainKeywordSelector onSubmit={handleSubmit} buttonText="Go" />

      {loading && <Loader />}
      {error && <p className="text-red-500">Error: {error}</p>}

      {streamedContent && (
        <div
          ref={contentRef}
          className="mt-6 max-w-4xl bg-white shadow-lg rounded-lg p-4 overflow-y-auto scrollbar-thin scrollbar-thumb max-h-[80vh]"
        >
          <h1 className="text-3xl font-bold mb-4">
            {streamedContent.split('\n')[0].replace('###', '').trim()}
          </h1>

          {streamedContent.split('\n').slice(1).map((paragraph, index) => {
            if (paragraph.startsWith('####')) {
              return <h2 key={index} className="text-2xl font-semibold mt-6 mb-3">{paragraph.replace('####', '').trim()}</h2>;
            } else if (paragraph.trim().startsWith('-')) {
              return <li key={index} className="ml-6 mb-2">{paragraph.replace('-', '').trim()}</li>;
            } else if (paragraph.trim().startsWith('1.')) {
              return <ol key={index} className="list-decimal ml-6 mb-2">{paragraph}</ol>;
            } else {
              return <p key={index} className="mb-4">{paragraph}</p>;
            }
          })}
        </div>
      )}
    </div>
  );
}

