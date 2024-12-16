'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/nextjs';
import { IKeywordStats } from '@/model/keywordStats.Model';

export const useKeywordStats = () => {
    const [keywordStats, setKeywordStats] = useState<IKeywordStats | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { userId } = useAuth();
  
    useEffect(() => {
      const fetchKeywordStats = async () => {
        if (!userId) {
          setLoading(false);
          return;
        }
  
        try {
          const response = await axios.get(`/api/keyword-stats`, {
            params: { userId },
          });
          setKeywordStats(response.data.keywordStats);
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
  
      fetchKeywordStats();
    }, [userId]);
  
    return { keywordStats, loading, error };
  };

