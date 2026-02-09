import AppLayout from "./layout/AppLayout";
import SplitLayout from "./layout/SplitLayout";
import SimulatorPage from "./page/SimulatorPage";
import DashboardPage from "./page/DashboardPage";
import { useState } from "react";
import useFunnelMetrics from "./hooks/useFunnelMetrics";

export default function App() {
  const { data, loading, error, refresh } = useFunnelMetrics();
  const [currentScreen, setCurrentScreen] = useState("home");

  return (
    <AppLayout>
      <SplitLayout
        left={<SimulatorPage onRefresh={refresh} onScreenChange={setCurrentScreen} />}
        right={
          <DashboardPage
            data={data}
            loading={loading}
            error={error}
            currentScreen={currentScreen}
          />
        }
      />
    </AppLayout>
  );
}
