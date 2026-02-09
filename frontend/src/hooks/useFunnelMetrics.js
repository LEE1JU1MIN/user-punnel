import { useEffect, useState } from "react";
import { fetchFunnelSummary } from "../services/funnelApi";

export default function useFunnelMetrics() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFunnelSummary();
      setData(result);
    } catch (e) {
      console.error("Failed to fetch funnel summary", e);
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return { data, loading, error, refresh };
}
