'use client';

import React from 'react';
import { useDomainHistory } from '@/hooks/useDomainHistory';
import { FaGlobe, FaClock } from 'react-icons/fa';
import Loader from '../Loader/Loader';

const DomainHistoryDisplay: React.FC = () => {
    const { domainHistory, loading, error } = useDomainHistory();

    if (loading) return <Loader />;
    if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;
    if (!domainHistory || domainHistory.length === 0) return <div className="text-center py-10">No domain history found</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Domain History</h2>
            <div className="space-y-6">
                {domainHistory.map((domain) => (
                    <div key={domain._id} className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center mb-4">
                            <FaGlobe className="text-blue-500 mr-2" />
                            <h3 className="text-xl font-semibold text-gray-800">{domain.domain}</h3>
                        </div>
                        <p className="text-gray-600 mb-4">{domain.workDescription}</p>
                        <div className="mb-4">
                            <h4 className="text-lg font-semibold text-gray-700 mb-2">Keywords:</h4>
                            <div className="flex flex-wrap gap-2">
                                {domain.keywords.map((keyword, index) => (
                                    <span
                                        key={index}
                                        className={`px-2 py-1 rounded-full text-sm ${keyword.isExpired
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-blue-100 text-blue-800'
                                            }`}
                                    >
                                        {keyword.content}
                                        {keyword.isExpired && (
                                            <span className="ml-1 text-xs">(Expired)</span>
                                        )}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                            <FaClock className="mr-1" />
                            <span>Created: {new Date(domain.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DomainHistoryDisplay;