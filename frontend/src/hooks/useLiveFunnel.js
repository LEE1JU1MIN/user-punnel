import { useCallback, useEffect, useRef, useState } from "react";

export default function useLiveFunnel() {
  const [liveData, setLiveData] = useState(null);
  const wsRef = useRef(null);
  const [connected, setConnected] = useState(false);

  const wsUrl =
    import.meta.env.VITE_WS_URL ??
    `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.hostname}:8000/ws/metrics`;

  const send = useCallback((payload) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(payload));
    }
  }, []);

  useEffect(() => {
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => setConnected(true);
    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        setLiveData(payload);
      } catch (e) {
        console.error("WS parse error", e);
      }
    };
    ws.onerror = () => setConnected(false);
    ws.onclose = () => setConnected(false);

    return () => ws.close();
  }, [wsUrl]);

  const reset = useCallback(() => setLiveData(null), []);

  return { liveData, send, reset, connected };
}
