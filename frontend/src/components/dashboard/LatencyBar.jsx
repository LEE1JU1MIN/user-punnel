export default function LatencyBar({
  system,
  user,
  systemStatus = "normal",
  userStatus = "normal",
  systemDeltaValue = null,
  userDeltaValue = null,
  avgSystem = 0,
  avgUser = 0,
}) {
  const maxDelta = 1; // 100% faster/slower
  const base = 50;
  const clamp = (v) => Math.max(-maxDelta, Math.min(maxDelta, v));
  const toPercent = (delta) => base + delta * 50;
  const minWidth = 2;

  const systemDelta =
    avgSystem > 0 ? clamp((system - avgSystem) / avgSystem) : 0;
  const userDelta =
    avgUser > 0 ? clamp((user - avgUser) / avgUser) : 0;

  const systemPos = toPercent(systemDelta);
  const userPos = toPercent(userDelta);
  const systemLeft = systemPos < base;
  const userLeft = userPos < base;
  const formatDelta = (value) =>
    value === null ? "" : `${value > 0 ? "+" : ""}${value}%`;
  const systemDeltaClass =
    systemDeltaValue === null ? "" : systemDeltaValue >= 0 ? "increase" : "decrease";
  const userDeltaClass =
    userDeltaValue === null ? "" : userDeltaValue >= 0 ? "increase" : "decrease";
  const systemAnimateClass = systemDeltaValue === null ? "" : systemDeltaValue >= 0 ? "pulse-up" : "pulse-down";
  const userAnimateClass = userDeltaValue === null ? "" : userDeltaValue >= 0 ? "pulse-up" : "pulse-down";

  return (
    <div className="latency-stack">
      <div className="latency-row" >
        <div
          className="latency-label"
          data-tooltip="サーバー側で計測した処理遅延（server latency）"
        >
          System
        </div>
        <div className="latency-track">
          <div
            className={`latency-fill ${systemDeltaClass || systemStatus} ${systemAnimateClass}`}
            style={{
              left: `${base}%`,
              width: `${Math.max(Math.abs(systemPos - base), minWidth)}%`,
              transform: systemLeft ? "translateX(-100%)" : "none",
              borderRadius: systemLeft ? "999px 0 0 999px" : "0 999px 999px 0",
            }}
          />
        </div>
        <div className={`latency-value ${systemDeltaClass}`} data-tooltip="システム遅延（平均との差分）">
          <span>{system}ms</span>
          {systemDeltaValue !== null && <em>{formatDelta(systemDeltaValue)}</em>}
        </div>
      </div>
      <div className="latency-row">
        <div
          className="latency-label"
          data-tooltip="ユーザーの思考時間（user_think_time）"
        >
          User
        </div>
        <div className="latency-track" data-tooltip="中央値は中央線、平均との差分はバーの長さで表示">
          <div
            className={`latency-fill ${userDeltaClass || userStatus} ${userAnimateClass}`}
            style={{
              left: `${base}%`,
              width: `${Math.max(Math.abs(userPos - base), minWidth)}%`,
              transform: userLeft ? "translateX(-100%)" : "none",
              borderRadius: userLeft ? "999px 0 0 999px" : "0 999px 999px 0",
            }}
          />
        </div>
        <div className={`latency-value ${userDeltaClass}`} data-tooltip="ユーザー遅延（平均との差分）">
          <span>{user}ms</span>
          {userDeltaValue !== null && <em>{formatDelta(userDeltaValue)}</em>}
        </div>
      </div>
    </div>
  );
}
