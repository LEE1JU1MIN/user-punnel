import AppLayout from "./layout/AppLayout";
import SplitLayout from "./layout/SplitLayout";
import SimulatorPage from "./page/SimulatorPage";
import DashboardPage from "./page/DashboardPage";
import useFunnelMetrics from "./hooks/useFunnelMetrics";

export default function App() {
  const { data, loading, error, refresh } = useFunnelMetrics();

  return (
    <AppLayout>
      <SplitLayout
        left={<SimulatorPage onRefresh={refresh} />}
        right={<DashboardPage data={data} loading={loading} error={error} />}   
      />
    </AppLayout>
  );
}
