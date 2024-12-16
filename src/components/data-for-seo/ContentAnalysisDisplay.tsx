"use client"

import React from 'react';
import { useContentAnalysis } from "@/hooks/data-for-seo-api/useContentAnalysis";
import Loader from "../Loader/Loader";
import DomainKeywordSelector from '@/components/DomainKeywordSelector/DomainKeywordSelector';

interface TopDomain {
    domain: string;
    count: number;
}

interface ContentAnalysisResult {
    total_count: number;
    rank: number;
    top_domains: TopDomain[];
    connotation_types: Record<string, number>;
    page_types: Record<string, number>;
    countries: Record<string, number>;
    languages: Record<string, number>;
}


export default function ContentAnalysisDisplay() {
    const { runTask, loading, error, data } = useContentAnalysis();

    const handleSubmit = (domain: string, keyword: string, tsakId: string) => {
        // Function to clean up the domain

        runTask(keyword);
    };

    const result: ContentAnalysisResult | undefined = data?.summary?.tasks?.[0]?.result?.[0];

    return (
        <div className="flex flex-col space-y-6 p-6">
            <DomainKeywordSelector onSubmit={handleSubmit} buttonText="Go" />
            {loading && <Loader />}
            {error && <p className="text-red-500">Error: {error}</p>}
            {result && (
                <div className="bg-gray-100 shadow-lg rounded-lg p-6">
                    <h2 className="text-2xl font-bold mb-4">Content Analysis Data</h2>

                    {/* Summary Information */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-blue-100 p-4 rounded">
                            <h3 className="font-semibold">Total Count</h3>
                            <p>{result.total_count}</p>
                        </div>
                        <div className="bg-green-100 p-4 rounded">
                            <h3 className="font-semibold">Rank</h3>
                            <p>{result.rank}</p>
                        </div>
                    </div>

                    {/* Top Domains */}
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-2">Top Domains</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {result.top_domains.map((domain: TopDomain, index: number) => (
                                <div key={index} className="bg-gray-200 p-3 rounded">
                                    <p className="font-medium">{domain.domain}</p>
                                    <p className="text-sm">Count: {domain.count}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Connotation Types */}
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-2">Connotation Types</h3>
                        <div className="flex space-x-4">
                            {Object.entries(result.connotation_types).map(([type, count]) => (
                                <div key={type} className="bg-yellow-100 p-3 rounded flex-1 text-center">
                                    <p className="font-medium capitalize">{type}</p>
                                    <p>{count.toString()}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Page Types */}
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-2">Page Types</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {Object.entries(result.page_types).map(([type, count]) => (
                                <div key={type} className="bg-purple-100 p-3 rounded">
                                    <p className="font-medium capitalize">{type}</p>
                                    <p>{count.toString()}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Countries and Languages */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-xl font-semibold mb-2">Countries</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {Object.entries(result.countries).map(([country, count]) => (
                                    <div key={country} className="bg-indigo-100 p-2 rounded">
                                        <p className="font-medium">{country}</p>
                                        <p>{count.toString()}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-2">Languages</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {Object.entries(result.languages).map(([lang, count]) => (
                                    <div key={lang} className="bg-pink-100 p-2 rounded">
                                        <p className="font-medium">{lang.toUpperCase()}</p>
                                        <p>{count.toString()}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}