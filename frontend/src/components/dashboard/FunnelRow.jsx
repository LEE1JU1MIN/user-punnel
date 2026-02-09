import LatencyBar from "./LatencyBar";

export default function FunnelRow({ index, step, isActive, avgSystem, avgUser, isRisk }) {
  const systemMs = step.system_latency_ms ?? 0;
  const userMs = step.user_think_time_ms ?? 0;
  const systemStatus =
    avgSystem > 0 && systemMs > avgSystem * 1.2
      ? "slow"
      : avgSystem > 0 && systemMs < avgSystem * 0.8
        ? "fast"
        : "normal";
  const userStatus =
    avgUser > 0 && userMs > avgUser * 1.2
      ? "slow"
      : avgUser > 0 && userMs < avgUser * 0.8
        ? "fast"
        : "normal";
  const systemDelta =
    avgSystem > 0 ? Math.round(((systemMs - avgSystem) / avgSystem) * 100) : null;
  const userDelta =
    avgUser > 0 ? Math.round(((userMs - avgUser) / avgUser) * 100) : null;
  const formatDelta = (value) =>
    value === null ? "" : `${value > 0 ? "+" : ""}${value}%`;

  return (
    <div className={`funnel-row ${isActive ? "active" : ""}`}>
      <div className="row-top">
        <div className="funnel-left">
          <span className="step-index">{index}</span>
          <span className="step-name">{step.name}</span>
        </div>
        <div className="row-top-right">
          {isRisk && <span className="risk-badge">Risk</span>}
          <div className="conversion">{step.conversion_rate}%</div>
        </div>
      </div>

      <div className="row-bottom">
        <div className="row-stats">
          <div className="stat">
            <div className="stat-label">Users</div>
            <div className="stat-value">{step.total_users ?? 0}</div>
          </div>
          <div className="stat">
            <div className="stat-label">Drop-off</div>
            <div className="stat-value">{step.drop_off_rate ?? 0}%</div>
          </div>
        </div>
        <LatencyBar
          system={systemMs}
          user={userMs}
          systemStatus={systemStatus}
          userStatus={userStatus}
          systemDelta={formatDelta(systemDelta)}
          userDelta={formatDelta(userDelta)}
        />
      </div>
    </div>
  );
}
