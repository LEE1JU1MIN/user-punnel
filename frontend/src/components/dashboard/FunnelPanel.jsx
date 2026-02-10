import FunnelRow from "./FunnelRow";
import InsightBox from "./InsightBox";
import DropoffChart from "./DropoffChart";

export default function FunnelPanel({
  data,
  loading,
  error,
  currentScreen,
  showInsight = true,
  onToggleInsight,
  insightOpen = true,
}) {
  const steps = data?.steps || [];
  const kpis = data?.kpis || {};
  const worstLabel = kpis.worst_step
    ? `${kpis.worst_step.charAt(0).toUpperCase()}${kpis.worst_step.slice(1)}`
    : "-";
  const exitCount = kpis.exit_count ?? 0;
  const maxDropOff =
    steps.length > 0
      ? Math.max(...steps.map((s) => s.drop_off_rate ?? 0))
      : 0;

  return (
    <section className="funnel-panel">
      {loading && <p className="empty-state">Loading funnel metrics…</p>}
      {!loading && error && (
        <p className="error">Failed to load metrics: {error.message}</p>
      )}
      {!loading && !error && !steps.length && (
        <p className="empty-state">No funnel data yet.</p>
      )}

      {!loading && !error && steps.length > 0 && (
        <div className="section-title-block">
          {onToggleInsight && !insightOpen && (
            <div className="insight-toggle-row">
              <span className="insight-toggle-note">
                Webサイトの顧客離脱ファネル分析をご覧になりたい方は、こちらをクリックしてください
              </span>
              <button
                type="button"
                className="dashboard-insight-toggle"
                onClick={onToggleInsight}
                data-tooltip="Insight(要点と改善提案)を表示/非表示に切り替えます。"
              >
                {insightOpen ? "Hide Insight" : "Show Insight"}
              </button>
            </div>
          )}
          <h2 className="section-title" data-tooltip="ステップ別の指標一覧">Funnel Steps_RealTime</h2>
        </div>
      )}

      {!loading && !error && steps.map((step, idx) => (
        <FunnelRow
          key={step.step ?? idx}
          index={idx + 1}
          step={step}
          isActive={currentScreen === step.step}
          avgSystem={step.avg_system_latency_ms ?? 0}
          avgUser={step.avg_user_think_time_ms ?? 0}
          isRisk={maxDropOff > 0 && (step.drop_off_rate ?? 0) === maxDropOff}
        />
      ))}

      {!loading && !error && steps.length > 0 && (
        <section className="avg-panel" data-tooltip="ステップ別の平均レイテンシ">
          <div className="avg-title">Average Latency by Step</div>
          <div className="avg-grid">
            {steps.map((step, idx) => (
              <div key={`avg-${step.step ?? idx}`} className="avg-card">
                <div className="avg-name">{step.name}</div>
                <div className="avg-values">
                  <span>System {step.avg_system_latency_ms ?? 0}ms</span>
                  <span>User {step.avg_user_think_time_ms ?? 0}ms</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {!loading && !error && steps.length > 0 && (
        <DropoffChart steps={steps} />
      )}

      {!loading && !error && steps.length > 0 && (
        <section className="kpi-panel">
          <div className="kpi-title">KPI</div>
          <div className="kpi-row">
            <div className="kpi-card" data-tooltip="ホーム到達ユーザー数">
              <div className="kpi-label">Total Users</div>
              <div className="kpi-value">{kpis.total_users ?? 0}</div>
            </div>
            <div className="kpi-card" data-tooltip="成功までの全体転換率">
              <div className="kpi-label">Overall Conversion</div>
              <div className="kpi-value">{kpis.overall_conversion ?? 0}%</div>
            </div>
            <div className="kpi-card" data-tooltip="離脱ボタンを押したユーザー数">
              <div className="kpi-label">Exit Count</div>
              <div className="kpi-value">{exitCount}</div>
            </div>
            <div className="kpi-card" data-tooltip="遅延が最も大きいステップ">
              <div className="kpi-label">Worst Step</div>
              <div className="kpi-value">{worstLabel}</div>
            </div>
          </div>
        </section>
      )}

      {!loading && !error && steps.length > 0 && showInsight && (
        <InsightBox steps={steps} />
      )}
    </section>
  );
}
