'use client';

import React from 'react';
import { useOrderHistory } from '@/hooks/useOrderHistory';
import Loader from '../Loader/Loader';

const OrderHistoryDisplay: React.FC = () => {
  const { orderHistory, loading, error } = useOrderHistory();

  if (loading) return <Loader />;
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  if (!orderHistory || orderHistory.length === 0) return <div className="text-center py-10">No Order history found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Order History</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {orderHistory.map((order, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg p-4 border-2 border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-base font-medium text-gray-600">Order ID:</span>
              <span className="text-base text-gray-800">{order.userId.slice(-6)}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-base font-medium text-gray-600">Amount:</span>
              <span className="text-base text-gray-800">${order.totalAmount}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-base font-medium text-gray-600">Keywords:</span>
              <span className="text-base text-gray-800">{order.numberOfKeywords}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-base font-medium text-gray-600">Status:</span>
              <span className={`text-base ${order.status === 'complete' ? 'text-green-600' : 'text-yellow-600'}`}>
                {order.status}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-base font-medium text-gray-600">Email:</span>
              <span className="text-base text-gray-800 truncate" title={order.customerEmail}>
                {order.customerEmail}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-base font-medium text-gray-600">Date:</span>
              <span className="text-base text-gray-800">
                {new Date(order.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistoryDisplay;