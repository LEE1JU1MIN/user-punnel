import { Activity } from "lucide-react";

export default function DashboardHeader({ onReset }) {
  return (
    <div className="dashboard-header">
      <div>
        <h1 className="dashboard-title">
          <Activity size={18} />
          Funnel Latency Analysis
        </h1>
        <p className="dashboard-sub">
          User behavior × System latency impact
        </p>
      </div>

      <button className="reset-btn" onClick={onReset}>
        Reset
      </button>
    </div>
  );
}