import { useState } from 'react';
import { generateText } from "@/utils/generateText";
import { readStreamableValue } from 'ai/rsc';

export const maxDuration = 30;


export function useContentCreation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<string>('');

  const aiGenerateText = async (keyword: string) => {
    const prompt: string = `
    Generate a detailed, engaging, and SEO-optimized article focusing on the keyword: "${keyword}". 
    Ensure the content is tailored to attract readers and rank highly in search engine results.
    Include a compelling introduction, benefits, examples, and a strong conclusion.
    Use proper HTML structure and natural occurrences of the keyword.
  `;

    setLoading(true);
    setError(null);
    
    try {
      const { output } = await generateText(prompt);

    for await (const delta of readStreamableValue(output)) {
      setData(currentGeneration => `${currentGeneration}${delta}`);
    }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { aiGenerateText, loading, error, data };
}