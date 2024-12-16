'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/nextjs';
import { IDomain } from '@/model/domain.Model'

export const useDomainHistory = () => {
    const [domainHistory, setDomainHistory] = useState<IDomain | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { userId } = useAuth();
  
    useEffect(() => {
      const fetchDomainHistory = async () => {
        if (!userId) {
          setLoading(false);
          return;
        }
  
        try {
          const response = await axios.get(`/api/domain-history`, {
            params: { userId },
          });
          setDomainHistory(response.data.domains);
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
  
      fetchDomainHistory();
    }, [userId]);
  
    return { domainHistory, loading, error };
  };

