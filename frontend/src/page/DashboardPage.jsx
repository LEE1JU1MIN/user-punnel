import FunnelPanel from "../components/dashboard/FunnelPanel";
import "../styles/dashboard.css";

export default function DashboardPage({ data, loading, error }) {
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Funnel Latency Analysis</h1>
        <p>User flow x system performance</p>
      </header>

      <FunnelPanel data={data} loading={loading} error={error} />
    </div>
  );
}
