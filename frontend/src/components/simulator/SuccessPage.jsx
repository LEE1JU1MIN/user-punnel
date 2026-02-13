export default function SuccessPage({ onNavigate, loading }) {
  return (
    <div className="sim-page success">
      <div className="badge">✓</div>
      <h2>購入完了</h2>
      <p className="muted">ご注文 #2039 を承りました。</p>
      <button disabled={loading} onClick={() => onNavigate("home")} className="primary wide">
        ホームへ戻る
      </button>
    </div>
  );
}
