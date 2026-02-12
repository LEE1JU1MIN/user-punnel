import { TOOLTIPS } from "../../constants/tooltips";

export default function DropoffChart({ steps }) {
  return (
    <section className="dropoff-chart">
      <div className="chart-header">
        <div>
          <div className="chart-title">Drop-off by Step</div>
          <div className="chart-sub">離脱率（×クリック基準）</div>
        </div>
      </div>

      <div className="chart-body">
        {steps.map((step, idx) => {
          const value = step.drop_off_rate ?? 0;
          const width = Math.min(Math.max(value, 0), 100);
          return (
            <div key={step.step ?? idx} className="chart-row" data-tooltip={TOOLTIPS.DROPOFF_ROW}>
              <div className="chart-label">
                <span className="chart-step">{step.name}</span>
                <span className="chart-value">{value}%</span>
              </div>
              <div className="chart-track">
                <div
                  className="chart-bar"
                  style={{ width: `${width}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
