import { useState } from 'react';
import axios from 'axios';

export function useOnPageTask() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const runTask = async (taskId: string) => {
    if (!taskId) {
      setError('Task ID is required');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/on-page-task', { taskId });
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { runTask, loading, error, data };
}