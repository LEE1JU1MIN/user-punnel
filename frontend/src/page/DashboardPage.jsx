import FunnelPanel from "../components/dashboard/FunnelPanel";
import InsightBox from "../components/dashboard/InsightBox";
import "../styles/dashboard.css";
import { TOOLTIPS } from "../constants/tooltips";

export default function DashboardPage({
  data,
  loading,
  error,
  currentScreen,
  wsConnected = false,
  onClear,
  clearing = false,
  onToggleInsight,
  insightOpen = true,
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
          <h1 data-tooltip={TOOLTIPS.DASHBOARD_TITLE}>顧客離脱ファネル分析</h1>
          <div className="dashboard-actions">
            <div
              className={`ws-badge ${wsConnected ? "online" : "offline"}`}
              data-tooltip={TOOLTIPS.WS_BADGE}
            >
              <span className="ws-dot" />
              {wsConnected ? "WS Online" : "WS Offline"}
            </div>
            <button
              type="button"
              className="dashboard-clear"
              onClick={handleClear}
              disabled={clearing}
              data-tooltip={TOOLTIPS.RESET_DATA}
            >
              {clearing ? "初期化中…" : "データ初期化"}
            </button>
          </div>
        </div>
        <p data-tooltip={TOOLTIPS.DASHBOARD_SUB}>ユーザー行動 × システム性能</p>
      </header>

      {insightOpen && !loading && !error && data?.steps?.length > 0 && (
        <InsightBox steps={data.steps} onClose={onToggleInsight} />
      )}

      <FunnelPanel
        data={data}
        loading={loading}
        error={error}
        currentScreen={currentScreen}
        onToggleInsight={onToggleInsight}
        insightOpen={insightOpen}
      />
    </div>
  );
}
