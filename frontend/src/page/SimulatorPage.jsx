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

export default function SimulatorPage({ onRefresh, onScreenChange }) {
  const [screen, setScreen] = useState("home");
  const [history, setHistory] = useState(["home"]);
  const [loading, setLoading] = useState(false);
  const startTimeRef = useRef(Date.now());
  const userIdRef = useRef(createUserId());
  const prevScreenRef = useRef("home");

  useEffect(() => {
    const prevScreen = prevScreenRef.current;
    prevScreenRef.current = screen;
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
    if (screen === "home" && next === "product") latency = 600; // loading product details
    if (screen === "cart" && next === "success") latency = 2800; // processing payment

    await new Promise((r) => setTimeout(r, latency));

    // Navigate first (optimistic), then log the event in the background
    setHistory((prev) => [...prev, next]);
    setScreen(next);
    startTimeRef.current = Date.now();

    postEvent({
      user_id: userIdRef.current,
      screen: screen,
      next_screen: next,
      event_type: "navigate",
      user_think_time: thinkTime,
      system_latency: latency,
      timestamp: new Date().toISOString(),
    })
      .then(() => onRefresh && onRefresh())
      .catch((err) => {
        console.error("Failed to post event", err);
      })
      .finally(() => setLoading(false));
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

  const handleExit = () => {
    setHistory(["exit"]);
    setScreen("exit");
    startTimeRef.current = Date.now();

    postEvent({
      user_id: userIdRef.current,
      screen: screen,
      next_screen: "exit",
      event_type: "exit",
      user_think_time: 0,
      system_latency: 0,
      timestamp: new Date().toISOString(),
    }).then(() => onRefresh && onRefresh());
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
