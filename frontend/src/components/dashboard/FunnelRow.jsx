import LatencyBar from "./LatencyBar";
import { TOOLTIPS } from "../../constants/tooltips";

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
    avgSystem > 0 ? Math.round(((avgSystem - systemMs) / avgSystem) * 100) : null;
  const userDelta =
    avgUser > 0 ? Math.round(((avgUser - userMs) / avgUser) * 100) : null;

  return (
    <div className={`funnel-row ${isActive ? "active" : ""}`}>
      <div className="row-top">
        <div className="funnel-left">
          <span className="step-index">{index}</span>
          <span className="step-name" data-tooltip={TOOLTIPS.STEP_NAME}>
            {step.name}
          </span>
        </div>
        <div className="row-top-right">
          {isRisk && <span className="risk-badge" data-tooltip={TOOLTIPS.RISK_BADGE}>Risk</span>}
          <div className="conversion" data-tooltip={TOOLTIPS.CONVERSION_RATE}>
            {step.conversion_rate}% <span className="conversion-label">到達率</span>
          </div>
        </div>
      </div>

      <div className="row-bottom">
        <div className="row-stats">
          <div className="stat">
            <div className="stat-label" data-tooltip={TOOLTIPS.USERS_LABEL}>Users</div>
            <div className="stat-value">{step.total_users ?? 0}</div>
          </div>
          <div className="stat">
            <div className="stat-label" data-tooltip={TOOLTIPS.DROPOFF_LABEL}>Drop-off</div>
            <div className="stat-value">{step.drop_off_rate ?? 0}%</div>
          </div>
        </div>
        <LatencyBar
          system={systemMs}
          user={userMs}
          systemStatus={systemStatus}
          userStatus={userStatus}
          systemDeltaValue={systemDelta}
          userDeltaValue={userDelta}
          avgSystem={avgSystem}
          avgUser={avgUser}
        />
      </div>
    </div>
  );
}
