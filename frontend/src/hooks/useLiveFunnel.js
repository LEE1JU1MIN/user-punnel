import { useEffect, useRef, useState } from "react";

export default function useLiveFunnel() {
  const [liveData, setLiveData] = useState(null);
  const wsRef = useRef(null);

  useEffect(() => {
    const send = (payload) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(payload));
        }
    };

    const ws = new WebSocket("ws://localhost:8000/ws/metrics");
    wsRef.current = ws;

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
    };

    return () => {
      ws.close();
    };
  }, []);

  return { liveData, send };
}
