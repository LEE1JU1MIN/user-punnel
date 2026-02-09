export default function InsightBox({ steps }) {
  const worst = steps.reduce((a, b) =>
    a.system_latency_ms > b.system_latency_ms ? a : b
  );

  return (
    <div className="insight-box" title="遅延が最も大きいステップの要約">
      <strong>Insight</strong>
      <p>
        <span className="highlight">{worst.name}</span> 
        段階で平均遅延が最も大きいです。
        この区間の最適化により、全体のコンバージョン率の改善が期待できます。
      </p>
    </div>
  );
}
