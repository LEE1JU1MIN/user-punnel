import AppLayout from "./layout/AppLayout";
import SplitLayout from "./layout/SplitLayout";
import SimulatorPage from "./page/SimulatorPage";
import { useEffect, useState, Suspense, lazy } from "react";
import useFunnelMetrics from "./hooks/useFunnelMetrics";
import useLiveFunnel from "./hooks/useLiveFunnel";
import { clearEvents } from "./services/eventApi";

const DashboardPage = lazy(() => import("./page/DashboardPage"));

export default function App() {
  const { data, loading, error, refresh } = useFunnelMetrics();
  const [currentScreen, setCurrentScreen] = useState("home");
  const { liveData, send, reset, connected } = useLiveFunnel();
  const mergedData = liveData ?? data;
  const [showDashboard, setShowDashboard] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [insightOpen, setInsightOpen] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowDashboard(true), 250);
    return () => clearTimeout(t);
  }, []);

  return (
    <AppLayout>
      <SplitLayout
        left={<SimulatorPage onRefresh={refresh} onScreenChange={setCurrentScreen} onSendLatency={send} />}
        right={
          showDashboard ? (
            <Suspense fallback={<div className="dashboard-skeleton">Loading dashboard…</div>}>
                <DashboardPage
                  data={mergedData}
                  loading={loading}
                  error={error}
                  currentScreen={currentScreen}
                  wsConnected={connected}
                  onClear={async () => {
                    if (clearing) return;
                    setClearing(true);
                    try {
                      await clearEvents();
                      reset();
                      await refresh();
                    } finally {
                      setClearing(false);
                    }
                  }}
                  clearing={clearing}
                  onToggleInsight={() => setInsightOpen((v) => !v)}
                  insightOpen={insightOpen}
                />
            </Suspense>
          ) : (
            <div className="dashboard-skeleton">Loading dashboard…</div>
          )
        }
      />
    </AppLayout>
  );
}
