export default function LatencyBar({ system, user }) {
  const max = 3000;

  return (
    <div className="latency-bar">
      <div
        className="latency system"
        style={{ width: `${Math.min(system / max * 100, 100)}%` }}
      />
      <div
        className="latency user"
        style={{ width: `${Math.min(user / max * 100, 100)}%` }}
      />
    </div>
  );
}