"use client"

import React, { useEffect, useRef, useState } from 'react';
import { useSeoRecommendations } from "@/hooks/openai/useSeoRecommendations";
import Loader from "../Loader/Loader";
import DomainKeywordSelector from '@/components/DomainKeywordSelector/DomainKeywordSelector';

export default function SeoRecommendations() {
  const { generateText, loading, error, data } = useSeoRecommendations();
  const [streamedContent, setStreamedContent] = useState('');
  const contentRef = useRef<HTMLDivElement | null>(null);

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
      }, 10); // Slightly faster streaming

      return () => clearInterval(intervalId);
    }
  }, [data]);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [streamedContent]);

  const renderContent = (content: string) => {
    return content.split('\n').map((paragraph: string, index: number) => {
      if (paragraph.startsWith('###')) {
        return <h1 key={index} className="text-3xl font-bold mt-8 mb-4 text-indigo-700">{paragraph.replace('###', '').trim()}</h1>;
      } else if (paragraph.startsWith('####')) {
        return <h2 key={index} className="text-2xl font-semibold mt-6 mb-3 text-indigo-600">{paragraph.replace('####', '').trim()}</h2>;
      } else if (paragraph.trim().startsWith('-')) {
        return <li key={index} className="ml-6 mb-2 list-disc">{paragraph.replace('-', '').trim()}</li>;
      } else if (paragraph.trim().match(/^\d+\./)) {
        return <li key={index} className="ml-6 mb-2 list-decimal">{paragraph.replace(/^\d+\./, '').trim()}</li>;
      } else if (paragraph.trim().startsWith('**')) {
        return <p key={index} className="mb-4 font-bold">{paragraph.replace(/\*\*/g, '').trim()}</p>;
      } else {
        return <p key={index} className="mb-4">{paragraph}</p>;
      }
    });
  };

  return (
    <div className="flex flex-col max-w-fill mx-auto p-6">
      <DomainKeywordSelector onSubmit={handleSubmit} buttonText="Go" />
      
      {loading && <Loader />}
      
      {error && <p className="text-red-500 mt-4">Error: {error}</p>}
      
      {streamedContent && (
        <div
          ref={contentRef}
          className="mt-6 bg-white max-w-4xl shadow-lg rounded-lg p-6 overflow-y-scroll scrollbar-thin scrollbar-thumb max-h-[110vh] prose prose-indigo"
        >
          {renderContent(streamedContent)}
        </div>
      )}
    </div>
  );
}