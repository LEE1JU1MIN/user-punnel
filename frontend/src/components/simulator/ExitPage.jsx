export default function ExitPage({ onEnter }) {
  return (
    <div className="sim-page exit">
      <div className="badge">✕</div>
      <h2>離脱しました</h2>
      <p className="muted">お店を離れました。</p>
      <button className="primary wide" onClick={onEnter}>
        ホームへ戻る
      </button>
    </div>
  );
}
