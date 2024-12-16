'use client';

import React from 'react';
import { useKeywordStats } from '@/hooks/useKeywordStats';
import { FaKeyboard, FaShoppingCart, FaChartLine, FaClock } from 'react-icons/fa';
import Loader from '../Loader/Loader';

const KeywordStatsDisplay: React.FC = () => {
  const { keywordStats, loading, error } = useKeywordStats();

  if (loading) return <Loader />;
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  if (!keywordStats) return <div className="text-center py-10">No keyword stats found</div>;

  const stats = [
    { title: 'Ordered Keywords', value: keywordStats.totalOrderedKeywords, icon: FaShoppingCart },
    { title: 'Added Keywords', value: keywordStats.totalAddedKeywords, icon: FaChartLine },
    { title: 'Total Keywords', value: keywordStats.totalKeywords, icon: FaKeyboard },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Keyword Stats</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6 transition duration-300 ease-in-out transform hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-700">{stat.title}</h3>
              <stat.icon className="text-2xl text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-700">Last Updated</h3>
          <FaClock className="text-2xl text-blue-500" />
        </div>
        <p className="text-lg text-gray-600">
          {new Date(keywordStats.lastUpdated).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default KeywordStatsDisplay;