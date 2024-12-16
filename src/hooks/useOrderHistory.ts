'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/nextjs';
import { IOrder } from '@/model/order.Model';

export const useOrderHistory = () => {
    const [orderHistory, setOrderHistory] = useState<IOrder | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { userId } = useAuth();
  
    useEffect(() => {
      const fetchOrderHistory = async () => {
        if (!userId) {
          setLoading(false);
          return;
        }
  
        try {
          const response = await axios.get(`/api/order-history`, {
            params: { userId },
          });
          setOrderHistory(response.data.orders);
        } catch (err) {
          if (axios.isAxiosError(err)) {
            setError(err.response?.data?.error || 'An error occurred while fetching keyword stats');
          } else {
            setError('An unexpected error occurred');
          }
        } finally {
          setLoading(false);
        }
      };
  
      fetchOrderHistory();
    }, [userId]);
  
    return { orderHistory, loading, error };
  };

