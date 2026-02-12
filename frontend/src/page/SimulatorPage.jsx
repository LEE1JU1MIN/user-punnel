import { useState, useRef, useEffect, useCallback } from "react";

import MobileFrame from "../layout/MobileFrame";

import StatusBar from "../components/simulator/StatusBar";
import AppHeader from "../components/simulator/AppHeader";
import HomePage from "../components/simulator/HomePage";
import ProductPage from "../components/simulator/ProductPage";
import CartPage from "../components/simulator/CartPage";
import SuccessPage from "../components/simulator/SuccessPage";
import ExitPage from "../components/simulator/ExitPage";

import { postEvent } from "../services/eventApi";
import { FUNNEL_STEPS } from "../constants/funnelSteps";

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
  const defaultStep = FUNNEL_STEPS[0];
  const [screen, setScreen] = useState(defaultStep);
  const [history, setHistory] = useState([defaultStep]);
  const [loading, setLoading] = useState(false);
  const startTimeRef = useRef(Date.now());
  const userIdRef = useRef(createUserId());
  const prevScreenRef = useRef(defaultStep);
  const idleTimerRef = useRef(null);

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      handleExit("timeout");
    }, 5 * 60 * 1000);
  }, []);

  useEffect(() => {
    const prevScreen = prevScreenRef.current;
    prevScreenRef.current = screen;

    if (!(prevScreen === "exit" && screen === defaultStep)) return;

    userIdRef.current = createUserId();
    postEvent({
      user_id: userIdRef.current,
      screen: defaultStep,
      next_screen: defaultStep,
      event_type: "enter",
      user_think_time: 0,
      system_latency: 0,
      timestamp: new Date().toISOString(),
    }).then(() => onRefresh && onRefresh());
  }, [screen, onRefresh]);

  useEffect(() => {
    if (onScreenChange) onScreenChange(screen);
  }, [screen, onScreenChange]);

  useEffect(() => {
    resetIdleTimer();
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [resetIdleTimer]);

  const handleNavigate = async (next) => {
    if (loading || next === screen) return;
    const thinkTime = Date.now() - startTimeRef.current;

    setLoading(true);

    setHistory((prev) => [...prev, next]);
    setScreen(next);
    startTimeRef.current = Date.now();
    resetIdleTimer();

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
      const previousScreen = updated[updated.length - 1] || defaultStep;
      setScreen(previousScreen);
      startTimeRef.current = Date.now();
      return updated;
    });
    resetIdleTimer();
  };

  const handleReset = () => {
    setHistory([defaultStep]);
    setScreen(defaultStep);
    startTimeRef.current = Date.now();
    resetIdleTimer();
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

  const handleExit = async (reason = "click") => {
    const exitFrom = screen;
    setHistory(["exit"]);
    setScreen("exit");
    startTimeRef.current = Date.now();

    const start = performance.now();
    const res = await postEvent({
      user_id: userIdRef.current,
      screen: exitFrom,
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
        exit_reason: reason,
      });
    }

    onRefresh && onRefresh();
    resetIdleTimer();
  };

  return (
    <div className="sim-wrap">
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
      <div className="sim-help">
        <div className="sim-help-title">操作ガイド</div>
        <div className="sim-help-grid">
          <div className="sim-help-item">
            <div className="sim-help-label">Step 1</div>
            <p>左の画面で「閲覧 → カート → 購入」を操作します。</p>
          </div>
          <div className="sim-help-item">
            <div className="sim-help-label">Step 2</div>
            <p>右上の × で離脱をシミュレーションできます。</p>
          </div>
          <div className="sim-help-item">
            <div className="sim-help-label">Step 3</div>
            <p>右のダッシュボードで離脱率・転換率・レイテンシを確認します。</p>
          </div>
          <div className="sim-help-item">
            <div className="sim-help-label">Step 4</div>
            <p>レイテンシバーの中央線は平均値、色は増減を示します。</p>
          </div>
        </div>
      </div>
    </div>
  );
}
