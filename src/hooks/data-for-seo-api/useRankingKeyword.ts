import { useState } from 'react';
import axios from 'axios';

export function useRankingKeyword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const runTask = async (domain: string, keyword: string) => {
    if (!domain && !keyword) {
      setError('Domain and keyword is required');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/ranking-keyword', { domain, keyword });
      setData(response.data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        // Log specific error details
        console.error('API error response:', err.response);
        setError(err.response?.data?.message || 'An error occurred');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return { runTask, loading, error, data };
}