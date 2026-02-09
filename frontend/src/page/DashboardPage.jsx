import FunnelPanel from "../components/dashboard/FunnelPanel";
import "../styles/dashboard.css";

export default function DashboardPage({ data, loading, error, currentScreen }) {
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1 title="ファネル全体のレイテンシ分析">Funnel Latency Analysis</h1>
        <p title="ユーザー行動とシステム性能の関係">User flow x system performance</p>
      </header>

      <FunnelPanel data={data} loading={loading} error={error} currentScreen={currentScreen} />
    </div>
  );
}
