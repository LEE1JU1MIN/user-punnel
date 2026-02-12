import { useEffect, useState } from "react";
import { TOOLTIPS } from "../../constants/tooltips";

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
    avgSystem > 0 ? clamp((avgSystem - system) / avgSystem) : 0;
  const userDelta =
    avgUser > 0 ? clamp((avgUser - user) / avgUser) : 0;

  const systemPos = toPercent(systemDelta);
  const userPos = toPercent(userDelta);
  const systemLeft = systemPos < base;
  const userLeft = userPos < base;
  const [systemTick, setSystemTick] = useState(0);
  const [userTick, setUserTick] = useState(0);
  const formatDelta = (value) =>
    value === null ? "" : `${value > 0 ? "+" : ""}${value}%`;
  const systemDeltaClass =
    systemDeltaValue === null ? "" : systemDeltaValue >= 0 ? "increase" : "decrease";
  const userDeltaClass =
    userDeltaValue === null ? "" : userDeltaValue >= 0 ? "increase" : "decrease";

  useEffect(() => {
    setSystemTick((v) => v + 1);
  }, [systemPos, systemLeft]);

  useEffect(() => {
    setUserTick((v) => v + 1);
  }, [userPos, userLeft]);

  return (
    <div className="latency-stack">
      <div className="latency-row" >
        <div
          className="latency-label"
          data-tooltip={TOOLTIPS.LATENCY_SYSTEM_LABEL}
        >
          System
        </div>
        <div className="latency-track">
          <div
            className="latency-fill-wrap"
            style={{
              left: `${base}%`,
              width: `${Math.max(Math.abs(systemPos - base), minWidth)}%`,
              transform: systemLeft ? "translateX(-100%)" : "none",
            }}
          >
            <div
              key={`system-${systemTick}`}
              className={`latency-fill ${systemDeltaClass || systemStatus}`}
              style={{
                transformOrigin: systemLeft ? "right center" : "left center",
                borderRadius: systemLeft ? "999px 0 0 999px" : "0 999px 999px 0",
              }}
            />
          </div>
        </div>
        <div className={`latency-value ${systemDeltaClass}`} data-tooltip={TOOLTIPS.LATENCY_SYSTEM_VALUE}>
          <span>{system}ms</span>
          {systemDeltaValue !== null && <em>{formatDelta(systemDeltaValue)}</em>}
        </div>
      </div>
      <div className="latency-row">
        <div
          className="latency-label"
          data-tooltip={TOOLTIPS.LATENCY_USER_LABEL}
        >
          User
        </div>
        <div className="latency-track" data-tooltip={TOOLTIPS.LATENCY_TRACK}>
          <div
            className="latency-fill-wrap"
            style={{
              left: `${base}%`,
              width: `${Math.max(Math.abs(userPos - base), minWidth)}%`,
              transform: userLeft ? "translateX(-100%)" : "none",
            }}
          >
            <div
              key={`user-${userTick}`}
              className={`latency-fill ${userDeltaClass || userStatus}`}
              style={{
                transformOrigin: userLeft ? "right center" : "left center",
                borderRadius: userLeft ? "999px 0 0 999px" : "0 999px 999px 0",
              }}
            />
          </div>
        </div>
        <div className={`latency-value ${userDeltaClass}`} data-tooltip={TOOLTIPS.LATENCY_USER_VALUE}>
          <span>{user}ms</span>
          {userDeltaValue !== null && <em>{formatDelta(userDeltaValue)}</em>}
        </div>
      </div>
    </div>
  );
}
