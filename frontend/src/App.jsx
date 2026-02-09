import AppLayout from "./layout/AppLayout";
import SplitLayout from "./layout/SplitLayout";
import SimulatorPage from "./page/SimulatorPage";
import DashboardPage from "./page/DashboardPage";
import { useState } from "react";
import useFunnelMetrics from "./hooks/useFunnelMetrics";
import useLiveFunnel from "./hooks/useLiveFunnel";

export default function App() {
  const { data, loading, error, refresh } = useFunnelMetrics();
  const [currentScreen, setCurrentScreen] = useState("home");
  const { liveData, send } = useLiveFunnel();
  const mergedData = liveData ?? data;

  return (
    <AppLayout>
      <SplitLayout
        left={<SimulatorPage onRefresh={refresh} onScreenChange={setCurrentScreen} onSendLatency={send} />}
        right={
          <DashboardPage
            data={mergedData} loading={loading} error={error} currentScreen={currentScreen}
          />
        }
      />
    </AppLayout>
  );
}
