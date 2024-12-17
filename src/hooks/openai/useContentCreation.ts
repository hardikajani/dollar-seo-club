import { useState } from 'react';
import axios from 'axios';

export function useContentCreation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<string>('');

  const aiGenerateText = async (keyword: string) => {
    const prompt = `
      Generate a detailed, engaging, and SEO-optimized article focusing on the keyword: "${keyword}".
      Ensure the content is tailored to attract readers and rank highly in search engine results.
      Include a compelling introduction, benefits, examples, and a strong conclusion.
      Use proper HTML structure and natural occurrences of the keyword.
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