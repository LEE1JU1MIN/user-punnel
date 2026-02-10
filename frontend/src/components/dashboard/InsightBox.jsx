const ACTIONS = {
  home: [
    "商品カテゴリの入口を明確化し、迷いを減らす",
    "最初の3秒で価値が伝わるヒーローを配置",
  ],
  product: [
    "比較材料（レビュー・保証・配送）を上部に集約",
    "カート導線の視認性を強化",
  ],
  cart: [
    "入力項目を最小化し、ゲスト購入を強調",
    "配送・支払いのステップを1画面化",
  ],
  success: [
    "購入後の次アクション（シェア/再購入）を提示",
    "完了画面の安心情報（保証/返品）を整理",
  ],
};

const formatDelta = (value) => {
  if (value === null || value === undefined) return "0%";
  return `${value > 0 ? "+" : ""}${value}%`;
};

export default function InsightBox({ steps }) {
  if (!steps || steps.length === 0) return null;

  const worstDrop = steps.reduce((a, b) =>
    (a.drop_off_rate ?? 0) > (b.drop_off_rate ?? 0) ? a : b
  );
  const worstLatency = steps.reduce((a, b) =>
    (a.avg_system_latency_ms ?? 0) > (b.avg_system_latency_ms ?? 0) ? a : b
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
      ? Math.round(((worstDrop.avg_user_think_time_ms ?? 0) - overallUserAvg) / overallUserAvg * 100)
      : null;
  const systemDelta =
    overallSystemAvg > 0
      ? Math.round(((worstLatency.avg_system_latency_ms ?? 0) - overallSystemAvg) / overallSystemAvg * 100)
      : null;

  const primaryStep = worstDrop.step || worstLatency.step;
  const primaryName = worstDrop.name || worstLatency.name || "Step";
  const actions = ACTIONS[primaryStep] || [
    "主要導線の情報量を削減し意思決定を支援",
    "最短経路（1クリック少ない導線）を設計",
  ];

  return (
    <div className="insight-box" data-tooltip="主要課題と改善アクションを要約">
      <div className="insight-header">
        <strong>Insight</strong>
        <span className="insight-tag">Actionable</span>
      </div>

      <div className="insight-lines">
        <div className="insight-line">
          重要課題: <span className="highlight">{primaryName}</span> が全離脱の中心（{worstDrop.drop_off_rate ?? 0}%）
        </div>
        <div className="insight-line">
          要因: User Think Time {formatDelta(userDelta)} / System Latency {formatDelta(systemDelta)} が平均より悪化
        </div>
        <div className="insight-line">
          影響: この区間の改善が全体CVRと再訪意向に最も効く
        </div>
        <div className="insight-line">
          優先度: “判断負荷の軽減” と “待ち時間の短縮” を同時に実行
        </div>
      </div>

      <div className="insight-actions">
        <div className="insight-action-title">Action Plan</div>
        <div className="insight-action">1. {actions[0]}</div>
        <div className="insight-action">2. {actions[1]}</div>
        <div className="insight-action">3. KPI: 離脱率−5pt / 平均レイテンシ−20%</div>
      </div>
    </div>
  );
}
