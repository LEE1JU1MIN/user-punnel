import LatencyBar from "./LatencyBar";

export default function FunnelRow({ index, step }) {
  const systemMs = step.system_latency_ms ?? 0;
  const userMs = step.user_think_time_ms ?? 0;
  const isBottleneck = systemMs > 1000;

  return (
    <div className={`funnel-row ${isBottleneck ? "bottleneck" : ""}`}>
      <div className="row-top">
        <div className="funnel-left">
          <span className="step-index">{index}</span>
          <span className="step-name">{step.name}</span>
        </div>
        <div className="row-top-right">
          {isBottleneck && <span className="badge danger">Bottleneck</span>}
          <div className="conversion">{step.conversion_rate}%</div>
        </div>
      </div>

      <div className="row-bottom">
        <div className="meta">
          <span className="meta-item">Users {step.total_users ?? 0}</span>
          <span className="meta-item">Drop-off {step.drop_off_rate ?? 0}%</span>
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
