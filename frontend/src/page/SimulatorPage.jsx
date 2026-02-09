import { useState, useRef, useEffect } from "react";

import MobileFrame from "../layout/MobileFrame";

import StatusBar from "../components/simulator/StatusBar";
import AppHeader from "../components/simulator/AppHeader";
import HomePage from "../components/simulator/HomePage";
import ProductPage from "../components/simulator/ProductPage";
import CartPage from "../components/simulator/CartPage";
import SuccessPage from "../components/simulator/SuccessPage";
import ExitPage from "../components/simulator/ExitPage";

import { postEvent } from "../services/eventApi";

import "../styles/simulator.css";

const TITLES = {
  home: "Discover",
  product: "Product",
  cart: "Checkout",
  success: "Done",
  exit: "Exit",
};

const PREV = {
  product: "home",
  cart: "product",
  success: "home",
};

const createUserId = () => `user_${Math.random().toString(36).slice(2, 8)}`;

export default function SimulatorPage({ onRefresh, onScreenChange, onSendLatency }) {
  const [screen, setScreen] = useState("home");
  const [history, setHistory] = useState(["home"]);
  const [loading, setLoading] = useState(false);
  const startTimeRef = useRef(Date.now());
  const userIdRef = useRef(createUserId());
  const prevScreenRef = useRef("home");

  useEffect(() => {
    const prevScreen = prevScreenRef.current;
    prevScreenRef.current = screen;

    // exit -> home 으로 복귀했을 때만 enter 이벤트 기록
    if (!(prevScreen === "exit" && screen === "home")) return;

    userIdRef.current = createUserId();
    postEvent({
      user_id: userIdRef.current,
      screen: "home",
      next_screen: "home",
      event_type: "enter",
      user_think_time: 0,
      system_latency: 0,
      timestamp: new Date().toISOString(),
    }).then(() => onRefresh && onRefresh());
  }, [screen, onRefresh]);

  useEffect(() => {
    if (onScreenChange) onScreenChange(screen);
  }, [screen, onScreenChange]);

  const handleNavigate = async (next) => {
    if (loading || next === screen) return;
    const thinkTime = Date.now() - startTimeRef.current;

    setLoading(true);

    let latency = 300; // default latency
    if (screen === "home" && next === "product") latency = 600;
    if (screen === "cart" && next === "success") latency = 2800;

    await new Promise((r) => setTimeout(r, latency));

    // UI 먼저 이동
    setHistory((prev) => [...prev, next]);
    setScreen(next);
    startTimeRef.current = Date.now();

    // 실제 HTTP latency 측정
    const start = performance.now();
    const res = await postEvent({
      user_id: userIdRef.current,
      screen: screen,
      next_screen: next,
      event_type: "navigate",
      user_think_time: thinkTime,
      system_latency: 0,
      timestamp: new Date().toISOString(),
    });
    const elapsed = performance.now() - start;

    if (onSendLatency && res?.data?.id) {
      onSendLatency({
        type: "latency",
        event_id: res.data.id,
        client_latency_ms: Math.round(elapsed),
      });
    }

    onRefresh && onRefresh();
    setLoading(false);
  };

  const handleBack = () => {
    if (loading || history.length < 2) return;
    setHistory((prev) => {
      const updated = prev.slice(0, -1);
      const previousScreen = updated[updated.length - 1] || "home";
      setScreen(previousScreen);
      startTimeRef.current = Date.now();
      return updated;
    });
  };

  const handleReset = () => {
    setHistory(["home"]);
    setScreen("home");
    startTimeRef.current = Date.now();
  };

  const renderScreen = () => {
    switch (screen) {
      case "home":
        return <HomePage onNavigate={handleNavigate} loading={loading} />;
      case "product":
        return <ProductPage onNavigate={handleNavigate} loading={loading} />;
      case "cart":
        return <CartPage onNavigate={handleNavigate} loading={loading} />;
      case "success":
        return <SuccessPage onNavigate={handleNavigate} loading={loading} />;
      case "exit":
        return <ExitPage onEnter={handleReset} />;
      default:
        return null;
    }
  };

  const handleExit = async () => {
    setHistory(["exit"]);
    setScreen("exit");
    startTimeRef.current = Date.now();

    const start = performance.now();
    const res = await postEvent({
      user_id: userIdRef.current,
      screen: screen,
      next_screen: "exit",
      event_type: "exit",
      user_think_time: 0,
      system_latency: 0,
      timestamp: new Date().toISOString(),
    });
    const elapsed = performance.now() - start;

    if (onSendLatency && res?.data?.id) {
      onSendLatency({
        type: "latency",
        event_id: res.data.id,
        client_latency_ms: Math.round(elapsed),
      });
    }

    onRefresh && onRefresh();
  };

  return (
    <MobileFrame>
      <div className="sim-shell">
        <StatusBar />
        <AppHeader
          title={TITLES[screen]}
          onBack={PREV[screen] ? handleBack : undefined}
          onExit={handleExit}
        />
        <div className="sim-content">
          {renderScreen()}
          {loading && <div className="sim-overlay">Processing…</div>}
        </div>
      </div>
    </MobileFrame>
  );
}
