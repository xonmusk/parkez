import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

export function useParkingData() {
  const [parkings, setParkings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const [parkRes, statsRes] = await Promise.all([
        api.get('/parkings'),
        api.get('/stats')
      ]);
      setParkings(parkRes.data);
      setStats(statsRes.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return { parkings, stats, loading, error, refetch: fetchData };
}
