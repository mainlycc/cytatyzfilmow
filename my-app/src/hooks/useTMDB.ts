import { useState, useEffect } from 'react';
import { TMDB_API_KEY, TMDB_BASE_URL } from '@/app/constants';

interface TMDBResponse<T> {
  results: T[];
  total_pages: number;
  total_results: number;
}

export function useTMDB<T>(endpoint: string, params: Record<string, string> = {}) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const queryParams = new URLSearchParams({
          api_key: TMDB_API_KEY,
          language: 'pl-PL',
          ...params
        });

        const response = await fetch(
          `${TMDB_BASE_URL}${endpoint}?${queryParams}`
        );
        
        if (!response.ok) {
          throw new Error('Błąd pobierania danych');
        }

        const json: TMDBResponse<T> = await response.json();
        setData(json.results);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Wystąpił błąd');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, JSON.stringify(params)]);

  return { data, loading, error };
}