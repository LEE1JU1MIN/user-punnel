import { useCallback, useEffect, useRef, useState } from "react";

export default function useLiveFunnel() {
  const [liveData, setLiveData] = useState(null);
  const wsRef = useRef(null);
  const [connected, setConnected] = useState(false);

  const send = useCallback((payload) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(payload));
    }
  }, []);

  useEffect(() => {
    const wsBase =
      import.meta.env.VITE_WS_BASE ??
      `${window.location.protocol === "https:" ? "wss" : "ws"}://${
        window.location.hostname
      }:8000`;
    const ws = new WebSocket(`${wsBase}/ws/metrics`);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        setLiveData(payload);
      } catch (e) {
        console.error("WS parse error", e);
      }
    };

    ws.onerror = (err) => {
      console.error("WS error", err);
      setConnected(false);
    };

    ws.onclose = () => {
      setConnected(false);
    };

    return () => {
      ws.close();
    };
  }, []);

  const reset = useCallback(() => {
    setLiveData(null);
  }, []);

  return { liveData, send, reset, connected };
}
