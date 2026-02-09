import LatencyBar from "./LatencyBar";

export default function FunnelRow({ index, step, isActive }) {
  const systemMs = step.system_latency_ms ?? 0;
  const userMs = step.user_think_time_ms ?? 0;

  return (
    <div className={`funnel-row ${isActive ? "active" : ""}`}>
      <div className="row-top">
        <div className="funnel-left">
          <span className="step-index">{index}</span>
          <span className="step-name">{step.name}</span>
        </div>
        <div className="row-top-right">
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
        <LatencyBar system={systemMs} user={userMs} />
        <div className="latency-meta">
          <span>System {systemMs}ms</span>
          <span>User {userMs}ms</span>
        </div>
      </div>
    </div>
  );
}
