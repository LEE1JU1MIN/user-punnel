import { TOOLTIPS } from "../../constants/tooltips";

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
  const deltaClass = (value) => (value >= 0 ? "delta-negative" : "delta-positive");
  const formatDelta = (value, invert = false) => {
    const v = Math.abs(value);
    return `${invert ? "-" : "+"}${v}%`;
  };

  return (
    <div className="insight-box" data-tooltip={TOOLTIPS.INSIGHT_BOX}>
      <div className="insight-header">
        <strong>核心インサイト</strong>
        <button
          type="button"
          className="insight-close"
          onClick={onClose}
          data-tooltip={TOOLTIPS.INSIGHT_CLOSE}
        >
          Hide Insight
        </button>
      </div>

      <div className="insight-block">
        <div className="insight-block-title">1. 問題の本質</div>
        <ul className="insight-list">
          <li>離脱の<span className="highlight">{dropRate}%</span>が「<span className="highlight">{focusName}</span>」で発生</li>
        </ul>
      </div>

      <div className="insight-block">
        <div className="insight-block-title">2. なぜ離脱が起きるのか </div>
        <ul className="insight-list">
          <li>
            ユーザーの迷い時間（考える時間）：
            <span className={deltaClass(userDelta)}>
              {userDelta >= 0 ? formatDelta(userDelta, true) : formatDelta(userDelta)}
            </span>
          </li>
          <li>
            画面の待ち時間（読み込みの遅さ）：
            <span className={deltaClass(systemDelta)}>
              {systemDelta >= 0 ? formatDelta(systemDelta) : formatDelta(systemDelta, true)}
            </span>
          </li>
        </ul>
      </div>

      <div className="insight-block">
        <div className="insight-block-title">3. ビジネスインパクト</div>
        <ul className="insight-list">
          <li>この区間は離脱が集中しており、改善候補として優先度が高い</li>
          <li>改善の効果はCVRや再訪意向に反映される可能性がある</li>
        </ul>
      </div>

      <div className="insight-block">
        <div className="insight-block-title">4. 戦略的優先度</div>
        <div className="insight-note">
          “判断コスト” と “待ち時間コスト” の低減が優先度の高い改善テーマ
        </div>
      </div>

      <div className="insight-block insight-actions">
        <div className="insight-block-title">Action Plan（候補）</div>
        <ol className="insight-list ordered">
          <li>判断負担の除去：レビュー・保証・配送を上部に集約</li>
          <li>行動摩擦の除去：CTAの視覚優先度を強化</li>
          <li>検証指標：離脱率 / 平均Latency / CVR の変化</li>
        </ol>
      </div>
    </div>
  );
}
