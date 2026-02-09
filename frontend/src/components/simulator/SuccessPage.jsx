export default function SuccessPage({ onNavigate, loading }) {
  return (
    <div className="sim-page success">
      <div className="badge">✓</div>
      <h2>Payment Success</h2>
      <p className="muted">Your order #2039 has been placed.</p>
      <button disabled={loading} onClick={() => onNavigate("home")} className="primary wide">
        Back to home
      </button>
    </div>
  );
}
