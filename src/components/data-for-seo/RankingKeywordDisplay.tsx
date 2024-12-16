"use client"

import React, { useState } from 'react';
import { useRankingKeyword } from "@/hooks/data-for-seo-api/useRankingKeyword";
import Loader from "../Loader/Loader";
import DomainKeywordSelector from '@/components/DomainKeywordSelector/DomainKeywordSelector';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface SearchIntentInfo {
    main_intent: string;
    last_updated_time: string; // Assuming this is a string, adjust if it's a Date object
}

interface KeywordProperties {
    keyword_difficulty: number;
    detected_language: string;
}

interface KeywordInfo {
    monthly_searches: MonthlySearch[];
    search_volume: number;
    competition_level: string;
    cpc?: number;
}

interface KeywordData {
    keyword: string;
    keyword_info: KeywordInfo;
    keyword_properties: KeywordProperties;
    search_intent_info?: SearchIntentInfo; // Make this optional if it may not always be present
}

interface MonthlySearch {
    year: number;
    month: number;
    search_volume: number;
}

interface KeywordInfo {
    monthly_searches: MonthlySearch[];
    search_volume: number;
    competition_level: string;
    cpc?: number;
}

interface KeywordData {
    keyword: string;
    keyword_info: KeywordInfo;
    keyword_properties: {
        keyword_difficulty: number;
        detected_language: string;
    };
}

interface RankedSerpElement {
    serp_item: {
        rank_group: number;
        url: string;
    };
}

interface RankedKeyword {
    keyword_data: KeywordData;
    ranked_serp_element: RankedSerpElement;
}

interface RankingKeywordResponse {
    rankedKeywords: {
        tasks: {
            result: {
                items: RankedKeyword[];
            }[];
        }[];
    };
}

export default function RankingKeywordDisplay() {
    const { runTask, loading, error, data } = useRankingKeyword();
    const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);

    const handleSubmit = (domain: string, keyword: string, taskId: string) => {
        const cleanDomain = (domain: string) => {
            return domain
                .replace(/^https?:\/\//, '')
                .replace(/^www\./, '');
        };

        const cleanedDomain = cleanDomain(domain);
        runTask(cleanedDomain, keyword);
    };

    const rankedKeywords: RankedKeyword[] = data?.rankedKeywords?.tasks?.[0]?.result?.[0]?.items || [];

    const renderHistoricalChart = (keyword: string) => {
        const keywordData = rankedKeywords.find(item => item.keyword_data.keyword === keyword);
        if (!keywordData || !keywordData.keyword_data.keyword_info.monthly_searches) {
            return <p>No historical data available</p>;
        }

        const monthlySearches = keywordData.keyword_data.keyword_info.monthly_searches;
        const chartData = {
            labels: monthlySearches.map(item => `${item.year}-${item.month}`),
            datasets: [{
                label: 'Search Volume',
                data: monthlySearches.map(item => item.search_volume),
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        };

        return <Line data={chartData} options={{
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Search Volume'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Historical Search Volume Trend'
                }
            }
        }} />;
    };

    return (
        <div className="flex flex-col space-y-6 p-6">
            <DomainKeywordSelector onSubmit={handleSubmit} buttonText="Analyze" />
            {loading && <Loader />}
            {error && <p className="text-red-500">Error: {error}</p>}
            {data && (
                <div className="space-y-6">
                    <div className="bg-white shadow-lg rounded-lg p-6">
                        <h2 className="text-2xl font-bold mb-4">Keyword Rankings</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="px-4 py-2">Keyword</th>
                                        <th className="px-4 py-2">Current Rank</th>
                                        <th className="px-4 py-2">URL</th>
                                        <th className="px-4 py-2">Search Volume</th>
                                        <th className="px-4 py-2">Competition</th>
                                        <th className="px-4 py-2">CPC</th>
                                        <th className="px-4 py-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rankedKeywords.length > 0 ? (
                                        rankedKeywords.map((item: RankedKeyword, index: number) => (
                                            <tr key={index} className="hover:bg-gray-100">
                                                <td className="border px-4 py-2">{item.keyword_data.keyword}</td>
                                                <td className="border px-4 py-2">{item.ranked_serp_element.serp_item.rank_group}</td>
                                                <td className="border px-4 py-2 truncate max-w-xs">{item.ranked_serp_element.serp_item.url}</td>
                                                <td className="border px-4 py-2">{item.keyword_data.keyword_info.search_volume}</td>
                                                <td className="border px-4 py-2">{item.keyword_data.keyword_info.competition_level}</td>
                                                <td className="border px-4 py-2">${item.keyword_data.keyword_info.cpc?.toFixed(2) || 'N/A'}</td>
                                                <td className="border px-4 py-2">
                                                    <button
                                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                                        onClick={() => setSelectedKeyword(item.keyword_data.keyword)}
                                                    >
                                                        Details
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="border px-4 py-2 text-center">No ranked keywords available</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {selectedKeyword && (
                        <div className="bg-white shadow-lg rounded-lg p-6">
                            <h2 className="text-2xl font-bold mb-4">Selected Keyword: {selectedKeyword}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Historical Trend</h3>
                                    {renderHistoricalChart(selectedKeyword)}
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Keyword Properties</h3>
                                    {rankedKeywords.length > 0 && (
                                        rankedKeywords.find(item => item.keyword_data.keyword === selectedKeyword)?.keyword_data.keyword_properties ? (
                                            <ul className="list-disc pl-5">
                                                <li>Keyword Difficulty: {rankedKeywords.find(item => item.keyword_data.keyword === selectedKeyword)?.keyword_data.keyword_properties.keyword_difficulty || 'N/A'}</li>
                                                <li>Detected Language: {rankedKeywords.find(item => item.keyword_data.keyword === selectedKeyword)?.keyword_data.keyword_properties.detected_language || 'N/A'}</li>
                                            </ul>
                                        ) : (
                                            <p>No keyword properties available</p>
                                        )
                                    )}
                                    <h3 className="text-xl font-semibold mt-4 mb-2">Search Intent</h3>
                                    {rankedKeywords.length > 0 && (
                                        rankedKeywords.find(item => item.keyword_data.keyword === selectedKeyword)?.keyword_data.search_intent_info ? (
                                            <ul className="list-disc pl-5">
                                                <li>Main Intent: {rankedKeywords.find(item => item.keyword_data.keyword === selectedKeyword)?.keyword_data.search_intent_info.main_intent || 'N/A'}</li>
                                                <li>Last Updated: {new Date(rankedKeywords.find(item => item.keyword_data.keyword === selectedKeyword)?.keyword_data.search_intent_info.last_updated_time || '').toLocaleDateString() || 'N/A'}</li>
                                            </ul>
                                        ) : (
                                            <p>No search intent information available</p>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}