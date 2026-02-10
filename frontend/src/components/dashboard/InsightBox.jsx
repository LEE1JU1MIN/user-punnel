export default function InsightBox({ steps, onClose }) {
  if (!steps || steps.length === 0) return null;

  const worstDrop = steps.reduce((a, b) =>
    (a.drop_off_rate ?? 0) > (b.drop_off_rate ?? 0) ? a : b
  );

  const userAvgSamples = steps
    .map((s) => s.avg_user_think_time_ms ?? 0)
    .filter((v) => v > 0);
  const systemAvgSamples = steps
    .map((s) => s.avg_system_latency_ms ?? 0)
    .filter((v) => v > 0);

  const overallUserAvg =
    userAvgSamples.length > 0
      ? userAvgSamples.reduce((sum, v) => sum + v, 0) / userAvgSamples.length
      : 0;
  const overallSystemAvg =
    systemAvgSamples.length > 0
      ? systemAvgSamples.reduce((sum, v) => sum + v, 0) / systemAvgSamples.length
      : 0;

  const userDelta =
    overallUserAvg > 0
      ? Math.round(((overallUserAvg - (worstDrop.avg_user_think_time_ms ?? 0)) / overallUserAvg) * 100)
      : 0;
  const systemDelta =
    overallSystemAvg > 0
      ? Math.round((((worstDrop.avg_system_latency_ms ?? 0) - overallSystemAvg) / overallSystemAvg) * 100)
      : 0;

  const focusName = worstDrop.name || "Product";
  const dropRate = worstDrop.drop_off_rate ?? 0;

  return (
    <div className="insight-box" data-tooltip="主要課題と改善アクションを要約">
      <div className="insight-header">
        <strong>核心インサイト</strong>
        <button
          type="button"
          className="insight-close"
          onClick={onClose}
          data-tooltip="Insightを閉じる"
        >
          Hide Insight
        </button>
      </div>

      <div className="insight-block">
        <div className="insight-block-title">1. 問題の本質</div>
        <ul className="insight-list">
          <li>離脱の<span className="highlight">{dropRate}%</span>が「{focusName}」で発生</li>
          <li>興味はあるが、判断できずに離脱している</li>
          <li>技術問題ではなく「判断が面倒になる構造」が原因</li>
        </ul>
      </div>

      <div className="insight-block">
        <div className="insight-block-title">2. なぜ離脱が起きるのか（非エンジニア向け）</div>
        <ul className="insight-list">
          <li>ユーザーの迷い時間（考える時間）：{userDelta >= 0 ? `-${userDelta}%` : `+${Math.abs(userDelta)}%`}</li>
          <li>十分理解する前に判断を求められている</li>
          <li>「買って大丈夫？」を整理する時間がない</li>
          <li>画面の待ち時間（読み込みの遅さ）：+{Math.abs(systemDelta)}%</li>
          <li>迷っている時のローディングは離脱を加速させる</li>
        </ul>
        <div className="insight-conclusion">
          結論：考えさせるのが早すぎて、システムは遅い。購入転換に最悪の組み合わせ。
        </div>
      </div>

      <div className="insight-block">
        <div className="insight-block-title">3. ビジネスインパクト</div>
        <ul className="insight-list">
          <li>この区間はCVRと再訪意向を同時に決める最大のボトルネック</li>
          <li>ここだけ改善すれば、全体を触らずに成果が出る</li>
          <li>開発ROIが最も高いレバー</li>
        </ul>
      </div>

      <div className="insight-block">
        <div className="insight-block-title">4. 戦略的優先度</div>
        <div className="insight-note">
          “判断コスト” と “待ち時間コスト” を同時に消す設計が最優先
        </div>
      </div>

      <div className="insight-block insight-actions">
        <div className="insight-block-title">Action Plan（意思決定向け）</div>
        <ol className="insight-list ordered">
          <li>判断負担の除去：レビュー・保証・配送を上部に集約</li>
          <li>行動摩擦の除去：CTAの視覚優先度を強化</li>
          <li>成果指標：Product離脱 −5pt / 平均Latency −20%</li>
        </ol>
      </div>
    </div>
  );
}
