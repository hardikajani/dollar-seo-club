'use client';

import React from 'react';
import { useKeywordHistory } from '@/hooks/useKeywordHistory';
import { FaKey, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import Loader from '../Loader/Loader';

const KeywordHistoryDisplay: React.FC = () => {
  const { keywordHistory, loading, error } = useKeywordHistory();

  if (loading) return <Loader />;
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  if (!keywordHistory || keywordHistory.length === 0) return <div className="text-center py-10">No keyword history found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Keyword History</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {keywordHistory.map((keyword) => (
          <div key={keyword._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <FaKey className="text-blue-500 mr-2" />
                <h3 className="text-xl font-semibold text-gray-800">{keyword.content}</h3>
              </div>
              {keyword.isExpired ? (
                <FaTimesCircle className="text-red-500" title="Expired" />
              ) : (
                <FaCheckCircle className="text-green-500" title="Active" />
              )}
            </div>
            <div className="text-sm text-gray-600 mb-2">
              <FaClock className="inline mr-1" />
              Created: {new Date(keyword.createdAt).toLocaleDateString()}
            </div>
            <div className="text-sm text-gray-600">
              <FaClock className="inline mr-1" />
              Updated: {new Date(keyword.updatedAt).toLocaleDateString()}
            </div>
            <div className={`mt-4 text-sm ${keyword.isExpired ? 'text-red-500' : 'text-green-500'} font-semibold`}>
              {keyword.isExpired ? 'Expired' : 'Active'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KeywordHistoryDisplay;