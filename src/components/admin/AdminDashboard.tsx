"use client";

import { useUser } from '@clerk/nextjs';
import Loader from '../Loader/Loader';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Keyword {
  _id: string;
  content: string;
  isExpired: boolean;
}

interface User {
  firstName: string;
  lastName: string;
  email: string;
}

interface Domain {
  _id: string;
  domain: string;
  workDescription: string;
  keywords: Keyword[];
  isApproved: boolean;
  user: User;
}

const AdminDashboard: React.FC = () => {
  const { user, isLoaded } = useUser();
  const [domains, setDomains] = useState<Domain[]>([]);
  const [expandedDescriptions, setExpandedDescriptions] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const fetchDomains = async () => {
      const response = await axios.get('/api/domains');
      // console.log("data", response.data);
      setDomains(response.data);
    };

    fetchDomains();
  }, []);

  const approveDomain = async (id: string) => {
    try {
      await axios.put(`/api/domains/${id}/approve`);
      setDomains(domains.map(domain => domain._id === id ? { ...domain, isApproved: true } : domain));
    } catch (error) {
      console.error('Error approving domain:', error);
    }
  };

  const toggleDescription = (id: string) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const truncateDescription = (description: string, limit: number = 40) => {
    if (description.length <= limit) return description;
    return description.slice(0, limit) + '...';
  };

  if (!isLoaded) return <Loader />;

  if (user?.publicMetadata?.role !== 'admin') {
    return <div className="flex items-center justify-center h-screen text-2xl font-bold text-red-600">Access Denied</div>;
  }

  return (
    <div className="container mx-auto py-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Domains</h2>
      {domains.length > 0 ? (
        <div className="bg-white shadow-md rounded-lg h-[50vh] overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Domain</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-md:hidden">Work Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keywords</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {domains.map(domain => (
                <tr key={domain._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{domain.user?.firstName || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{domain.domain}</td>
                  <td className="px-6 py-4 max-md:hidden">
                    {expandedDescriptions[domain._id]
                      ? domain.workDescription
                      : truncateDescription(domain.workDescription)}
                    {domain.workDescription.length > 40 && (
                      <button
                        onClick={() => toggleDescription(domain._id)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        {expandedDescriptions[domain._id] ? 'Less' : 'More'}
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-full flex flex-nowrap overflow-x-auto gap-1 pb-2">
                      {domain.keywords.map(keyword => (
                        <span
                          key={keyword._id}
                          className={`px-2 py-1 rounded-full text-xs ${keyword.isExpired ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'} whitespace-nowrap overflow-hidden text-overflow-ellipsis max-w-[150px]`}
                          title={keyword.content}
                        >
                          {keyword.content}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${domain.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {domain.isApproved ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {!domain.isApproved && (
                      <button
                        onClick={() => approveDomain(domain._id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600">No domains found.</p>
      )}
    </div>
  );
};

export default AdminDashboard;