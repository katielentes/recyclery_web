import { useEffect, useState } from 'react';
import { CMSProgram, cmsService } from '../services/cms';

// Hook for fetching programs from CMS
export function usePrograms() {
  const [programs, setPrograms] = useState<CMSProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await cmsService.getPrograms();
        setPrograms(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch programs');
        console.error('Error fetching programs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  return { programs, loading, error, refetch: () => fetchPrograms() };
}

// Hook for fetching a single program
export function useProgram(id: number) {
  const [program, setProgram] = useState<CMSProgram | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await cmsService.getProgram(id);
        setProgram(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch program');
        console.error('Error fetching program:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProgram();
    }
  }, [id]);

  return { program, loading, error };
}
