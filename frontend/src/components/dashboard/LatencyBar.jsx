export default function LatencyBar({ system, user, systemStatus = "normal", userStatus = "normal" }) {
  const max = 2000;
  const minWidth = 6;
  const systemWidth = Math.max((system / max) * 100, minWidth);
  const userWidth = Math.max((user / max) * 100, minWidth);

  return (
    <div className="latency-stack">
      <div className="latency-row">
        <div className="latency-label">System</div>
        <div className="latency-track">
          <div
            className={`latency-fill ${systemStatus}`}
            style={{ width: `${Math.min(systemWidth, 100)}%` }}
          />
        </div>
      </div>
      <div className="latency-row">
        <div className="latency-label">User</div>
        <div className="latency-track">
          <div
            className={`latency-fill ${userStatus}`}
            style={{ width: `${Math.min(userWidth, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
