import { memo } from "react";
import LatencyBar from "./LatencyBar";
import { TOOLTIPS } from "../../constants/tooltips";

const STEP_LABELS = {
  home: "ホーム",
  product: "商品",
  cart: "カート",
  success: "購入完了",
};

function getStatus(value, avg) {
  if (avg <= 0) return "normal";
  if (value > avg * 1.2) return "slow";
  if (value < avg * 0.8) return "fast";
  return "normal";
}

function getDelta(value, avg) {
  if (avg <= 0) return null;
  return Math.round(((avg - value) / avg) * 100);
}

function FunnelRowComponent({ index, step, isActive, avgSystem, avgUser, isRisk }) {
  const stepLabel = STEP_LABELS[step.step] ?? step.name;
  const systemMs = step.system_latency_ms ?? 0;
  const userMs = step.user_think_time_ms ?? 0;

  const systemStatus = getStatus(systemMs, avgSystem);
  const userStatus = getStatus(userMs, avgUser);
  const systemDelta = getDelta(systemMs, avgSystem);
  const userDelta = getDelta(userMs, avgUser);

  return (
    <div className={`funnel-row ${isActive ? "active" : ""}`}>
      <div className="row-top">
        <div className="funnel-left">
          <span className="step-index">{index}</span>
          <span className="step-name" data-tooltip={TOOLTIPS.STEP_NAME}>
            {stepLabel} ページ
          </span>
        </div>
        <div className="row-top-right">
          {isRisk && <span className="risk-badge" data-tooltip={TOOLTIPS.RISK_BADGE}>Risk</span>}
          <div className="conversion" data-tooltip={TOOLTIPS.CONVERSION_RATE}>
            {step.conversion_rate}% <span className="conversion-label">購入到達率</span>
          </div>
        </div>
      </div>

      <div className="row-bottom">
        <div className="row-stats">
          <div className="stat">
            <div className="stat-label" data-tooltip={TOOLTIPS.USERS_LABEL}>User数</div>
            <div className="stat-value">{step.total_users ?? 0}</div>
          </div>
          <div className="stat">
            <div className="stat-label" data-tooltip={TOOLTIPS.DROPOFF_LABEL}>離脱率</div>
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

function areEqual(prevProps, nextProps) {
  if (
    prevProps.index !== nextProps.index ||
    prevProps.isActive !== nextProps.isActive ||
    prevProps.avgSystem !== nextProps.avgSystem ||
    prevProps.avgUser !== nextProps.avgUser ||
    prevProps.isRisk !== nextProps.isRisk
  ) {
    return false;
  }

  const prevStep = prevProps.step;
  const nextStep = nextProps.step;

  return (
    prevStep.step === nextStep.step &&
    prevStep.name === nextStep.name &&
    prevStep.conversion_rate === nextStep.conversion_rate &&
    prevStep.system_latency_ms === nextStep.system_latency_ms &&
    prevStep.user_think_time_ms === nextStep.user_think_time_ms &&
    prevStep.avg_system_latency_ms === nextStep.avg_system_latency_ms &&
    prevStep.avg_user_think_time_ms === nextStep.avg_user_think_time_ms &&
    prevStep.total_users === nextStep.total_users &&
    prevStep.drop_off_rate === nextStep.drop_off_rate
  );
}

const FunnelRow = memo(FunnelRowComponent, areEqual);

export default FunnelRow;
