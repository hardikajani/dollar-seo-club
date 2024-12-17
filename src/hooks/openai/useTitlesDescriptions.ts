import { useState } from 'react';
import axios from 'axios';

export function useTitlesDescriptions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<string>('');

  const aiGenerateText = async (domain:string, keyword: string) => {
    const prompt: string = `
      Analyze the following content related to the URL: "${domain}" and optimize it for the target keyword: "${keyword}".

      1. Review the content and identify:
         - How well the current content aligns with the target keyword.
         - Areas where the keyword usage is missing or inconsistent.
         - Opportunities for improving keyword density and placement (e.g., headers, paragraphs, meta tags).

      2. Generate:
         - An SEO-friendly page title (50-60 characters) optimized for the target keyword.
         - A meta description (150-160 characters) that includes the target keyword and its variations naturally.

      3. Provide recommendations for:
         - Improving content structure (e.g., adding subheadings, bulleted lists, or summaries).
         - Adding related long-tail keywords, synonyms, and semantic variations.
         - Enhancing the overall content for better search engine ranking and user engagement.

      Format the output as follows:
      - Current Analysis: [Brief summary of the content based on the available information.]
      - Title: [Optimized Page Title]
      - Description: [Optimized Meta Description]
      - Recommendations:
         - [1st Recommendation]
        - [2nd Recommendation]
        - [etc.]
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