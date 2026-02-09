import AppLayout from "./layout/AppLayout";
import SplitLayout from "./layout/SplitLayout";
import SimulatorPage from "./page/SimulatorPage";
import { useEffect, useState, Suspense, lazy } from "react";
import useFunnelMetrics from "./hooks/useFunnelMetrics";
import useLiveFunnel from "./hooks/useLiveFunnel";

const DashboardPage = lazy(() => import("./page/DashboardPage"));

export default function App() {
  const { data, loading, error, refresh } = useFunnelMetrics();
  const [currentScreen, setCurrentScreen] = useState("home");
  const { liveData, send } = useLiveFunnel();
  const mergedData = liveData ?? data;
  const [showDashboard, setShowDashboard] = useState(false);

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
