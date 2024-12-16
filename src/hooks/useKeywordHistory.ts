'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/nextjs';
import { IKeyword } from '@/model/domain.Model'

export const useKeywordHistory = () => {
    const [keywordHistory, setKeywordHistory] = useState<IKeyword | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { userId } = useAuth();
  
    useEffect(() => {
      const fetchKeywordHistory = async () => {
        if (!userId) {
          setLoading(false);
          return;
        }
  
        try {
          const response = await axios.get(`/api/keyword-history`, {
            params: { userId },
          });
          setKeywordHistory(response.data.keywords);
        } catch (err) {
          if (axios.isAxiosError(err)) {
            setError(err.response?.data?.error || 'An error occurred while fetching keyword history');
          } else {
            setError('An unexpected error occurred');
          }
        } finally {
          setLoading(false);
        }
      };
  
      fetchKeywordHistory();
    }, [userId]);
  
    return { keywordHistory, loading, error };
  };

