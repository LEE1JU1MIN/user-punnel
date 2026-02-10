import FunnelPanel from "../components/dashboard/FunnelPanel";
import "../styles/dashboard.css";

export default function DashboardPage({
  data,
  loading,
  error,
  currentScreen,
  onClear,
  clearing = false,
}) {
  const handleClear = async () => {
    if (!onClear) return;
    const confirmed = window.confirm(
      "データベース内のイベントをすべて削除します。よろしいですか？"
    );
    if (!confirmed) return;
    await onClear();
  };
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="dashboard-header-top">
          <h1 data-tooltip="ファネル全体のレイテンシ分析">Funnel Latency Analysis</h1>
          <button
            type="button"
            className="dashboard-clear"
            onClick={handleClear}
            disabled={clearing}
            data-tooltip="DB内のイベントを全削除して再計測"
          >
            {clearing ? "Clearing…" : "Reset Data"}
          </button>
        </div>
        <p data-tooltip="ユーザー行動とシステム性能の関係">User flow x system performance</p>
      </header>

      <FunnelPanel data={data} loading={loading} error={error} currentScreen={currentScreen} />
    </div>
  );
}
