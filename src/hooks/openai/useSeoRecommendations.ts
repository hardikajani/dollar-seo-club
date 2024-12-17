import { useState } from 'react';
import axios from 'axios';

export function useSeoRecommendations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<string>('');

  const aiGenerateText = async (keyword: string) => {
    const prompt = `
    Analyze the keyword: "${keyword}" and provide detailed recommendations for optimizing its use in digital content. 
    Focus on SEO, content strategy, UX, and technical SEO, as well as additional strategies for amplification. 
    Make the recommendations actionable and relevant for effective implementation.    
    `;

    setLoading(true);
    setError(null);
    setData('');

    try {
      const response = await axios.post('/api/generate', { prompt }, {
        responseType: 'text',
      });

      setData(response.data);

    } catch (err) {
      console.error('Error in API call:', err);  // Log the full error
      if (axios.isAxiosError(err)) {
        setError(err.message || 'An error occurred during the API call');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return { aiGenerateText, loading, error, data };
}