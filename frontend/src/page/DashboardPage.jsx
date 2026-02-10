import FunnelPanel from "../components/dashboard/FunnelPanel";
import InsightBox from "../components/dashboard/InsightBox";
import "../styles/dashboard.css";

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
          <h1 data-tooltip="ファネル全体のレイテンシ分析">Funnel Latency Analysis</h1>
          <div className="dashboard-actions">
            <div
              className={`ws-badge ${wsConnected ? "online" : "offline"}`}
              data-tooltip="WebSocketは「画面とサーバーがずっとつながっている電話」のような仕組みです。ボタンを押した瞬間に数字が変わるので、何が起きたかをすぐに確認できます。普通の通信だと更新が遅れるため、リアルタイム性を見せるために使っています。"
            >
              <span className="ws-dot" />
              {wsConnected ? "WS Online" : "WS Offline"}
            </div>
            <button
              type="button"
              className="dashboard-insight-toggle"
              onClick={onToggleInsight}
              data-tooltip="Insightの表示を切替"
            >
              {insightOpen ? "Hide Insight" : "Show Insight"}
            </button>
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
        </div>
        <p data-tooltip="ユーザー行動とシステム性能の関係">User flow x system performance</p>
      </header>

      {insightOpen && !loading && !error && data?.steps?.length > 0 && (
        <InsightBox steps={data.steps} />
      )}

      <FunnelPanel
        data={data}
        loading={loading}
        error={error}
        currentScreen={currentScreen}
        showInsight={false}
      />
    </div>
  );
}
