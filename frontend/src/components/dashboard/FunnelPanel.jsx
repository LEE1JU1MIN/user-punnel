import FunnelRow from "./FunnelRow";
import InsightBox from "./InsightBox";
import DropoffChart from "./DropoffChart";

export default function FunnelPanel({ data, loading, error, currentScreen }) {
  const steps = data?.steps || [];
  const kpis = data?.kpis || {};
  const worstLabel = kpis.worst_step
    ? `${kpis.worst_step.charAt(0).toUpperCase()}${kpis.worst_step.slice(1)}`
    : "-";
  const exitCount = kpis.exit_count ?? 0;
  const avgSystem =
    steps.length > 0
      ? steps.reduce((sum, s) => sum + (s.system_latency_ms ?? 0), 0) / steps.length
      : 0;
  const avgUser =
    steps.length > 0
      ? steps.reduce((sum, s) => sum + (s.user_think_time_ms ?? 0), 0) / steps.length
      : 0;
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
        <h2 className="section-title" title="ステップ別の指標一覧">Funnel Steps</h2>
      )}

      {!loading && !error && steps.map((step, idx) => (
        <FunnelRow
          key={step.step ?? idx}
          index={idx + 1}
          step={step}
          isActive={currentScreen === step.step}
          avgSystem={avgSystem}
          avgUser={avgUser}
          isRisk={maxDropOff > 0 && (step.drop_off_rate ?? 0) === maxDropOff}
        />
      ))}

      {!loading && !error && steps.length > 0 && (
        <DropoffChart steps={steps} />
      )}

      {!loading && !error && steps.length > 0 && (
        <section className="kpi-panel" title="全体の主要指標">
          <div className="kpi-title">KPI</div>
          <div className="kpi-row">
            <div className="kpi-card" title="ホーム到達ユーザー数">
              <div className="kpi-label">Total Users</div>
              <div className="kpi-value">{kpis.total_users ?? 0}</div>
            </div>
            <div className="kpi-card" title="成功までの全体転換率">
              <div className="kpi-label">Overall Conversion</div>
              <div className="kpi-value">{kpis.overall_conversion ?? 0}%</div>
            </div>
            <div className="kpi-card" title="離脱ボタンを押したユーザー数">
              <div className="kpi-label">Exit Count</div>
              <div className="kpi-value">{exitCount}</div>
            </div>
            <div className="kpi-card" title="遅延が最も大きいステップ">
              <div className="kpi-label">Worst Step</div>
              <div className="kpi-value">{worstLabel}</div>
            </div>
          </div>
        </section>
      )}

      {!loading && !error && steps.length > 0 && (
        <InsightBox steps={steps} />
      )}
    </section>
  );
}
