import { useState } from 'react';
import axios from 'axios';

export function useSeoRecommendations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const generateText = async (keyword: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('/api/seo-recommendations', {keyword});
      setData(response.data.text);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { generateText, loading, error, data };
}