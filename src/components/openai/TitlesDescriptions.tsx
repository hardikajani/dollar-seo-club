"use client"

import React, { useEffect, useRef, useState } from 'react';
import { useTitlesDescriptions } from "@/hooks/openai/useTitlesDescriptions";
import Loader from "../Loader/Loader";
import DomainKeywordSelector from '@/components/DomainKeywordSelector/DomainKeywordSelector';

export default function TitlesDescriptions() {
  const { generateText, loading, error, data } = useTitlesDescriptions();
  const [streamedContent, setStreamedContent] = useState('');
  const contentRef = useRef(null);

  const handleSubmit = (domain: string, keyword: string) => {
    generateText(domain, keyword);
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
      }, 10);

      return () => clearInterval(intervalId);
    }
  }, [data]);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [streamedContent]);

  const formatContent = (content) => {
    return content
      .replace(/\*\*/g, '')
      .split('\n')
      .map((line:string, index:number) => {
        if (line.startsWith('Current Analysis:')) {
          return <h3 key={index} className="text-xl font-semibold text-blue-600 mt-4 mb-2">{line}</h3>;
        } else if (line.startsWith('Title:')) {
          return <h3 key={index} className="text-xl font-semibold text-green-600 mt-4 mb-2">{line}</h3>;
        } else if (line.startsWith('Description:')) {
          return <h3 key={index} className="text-xl font-semibold text-purple-600 mt-4 mb-2">{line}</h3>;
        } else if (line.startsWith('Recommendations:')) {
          return <h3 key={index} className="text-xl font-semibold text-red-600 mt-4 mb-2">{line}</h3>;
        } else if (line.trim().startsWith('-')) {
          return <li key={index} className="ml-6 mb-2">{line.trim().substring(1)}</li>;
        } else {
          return <p key={index} className="mb-2">{line}</p>;
        }
      });
  };


  return (
    <div className="flex flex-col mx-auto p-6">
      <DomainKeywordSelector onSubmit={handleSubmit} buttonText="Go" />
      
      {loading && <Loader />}
      
      {error && <p className="text-red-500 mt-4">Error: {error}</p>}
      
      {streamedContent && (
        <div className="mt-5 max-w-4xl shadow-lg overflow-hidden">
          <div className="p-4">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Generated Content</h2>
            <div
              ref={contentRef}
              className="max-h-[70vh] overflow-y-scroll scrollbar-thin scrollbar-thumb"
            >
              {formatContent(streamedContent)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}