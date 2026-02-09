export default function InsightBox({ steps }) {
  const worst = steps.reduce((a, b) =>
    a.system_latency_ms > b.system_latency_ms ? a : b
  );

  return (
    <div className="insight-box">
      <strong>Insight</strong>
      <p>
        <span className="highlight">{worst.name}</span> 단계에서
        평균 지연이 가장 큽니다.  
        해당 구간 최적화 시 전체 전환율 개선 여지가 큽니다.
      </p>
    </div>
  );
}